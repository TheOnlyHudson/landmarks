/**
 * OSM buildings a landmark draws over but doesn't replace.
 *
 *   bun tools/overlap.ts <id ...>               these landmarks
 *   bun tools/overlap.ts --branch-diff [base]   every landmark this branch adds or changes
 *   bun tools/overlap.ts --credit <name>        every landmark whose model credits <name>
 *   options: --min <share>  report a building once this share of it is under the model (default 0.1)
 *
 * The map hides only the OSM ids in `replaces` (and buildings lying wholly
 * inside the model). A building or building:part that the model covers only
 * partly, and that isn't listed, keeps drawing: its walls and roof poke
 * through the model, or out of its base, as boxes. This burns the model's
 * plan into a grid, as the map does (tools/parchment/landmark-coverage.ts),
 * fetches every OSM building and building:part around the anchor from
 * Overpass, and lists each unlisted one with the share of its area the model
 * covers. Exits 1 if any is found.
 *
 * For each one reported: if the model stands in for it (a wing, a podium, an
 * entrance block, a part of the same building), add it to `replaces`; if it is
 * a separate building the model shouldn't reach, the model or its placement
 * is wrong. Then rerun `bun tools/replacement-footprints.ts`.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { readGlb } from '../generators/mesh'
import { coveredNear, planCoverage } from './parchment/landmark-coverage'
import { catalogAt, readCatalog } from '../src/catalog-files'
import type { CatalogLandmark } from '../src/catalog'

const ROOT = join(import.meta.dir, '..')
const args = process.argv.slice(2)
const option = (name: string, fallback: string) => {
  const at = args.indexOf(name)
  return at < 0 ? fallback : args.splice(at, 2)[1]
}
const minShare = Number(option('--min', '0.1'))
const credit = option('--credit', '')
const catalog = readCatalog(ROOT)

let picked: CatalogLandmark[]
if (credit) {
  const models = new Set(catalog.models.filter(m => (m.credits ?? []).some(c => c.name.toLowerCase().includes(credit.toLowerCase())) || m.author?.toLowerCase().includes(credit.toLowerCase())).map(m => m.id))
  picked = catalog.landmarks.filter(l => models.has(l.model))
} else if (args[0] === '--branch-diff') {
  const git = (...cmd: string[]) => Bun.spawnSync(['git', ...cmd], { cwd: ROOT }).stdout.toString().trim()
  const since = git('merge-base', args[1] ?? 'origin/main', 'HEAD')
  const before = new Map((catalogAt(ROOT, since)?.landmarks ?? []).map(l => [l.id, JSON.stringify(l)]))
  const changed = new Set(git('diff', '--name-only', since).split('\n'))
  const models = new Set(catalog.models.filter(m => changed.has(m.file) || (m.source && changed.has(m.source))).map(m => m.id))
  picked = catalog.landmarks.filter(l => models.has(l.model) || before.get(l.id) !== JSON.stringify(l))
} else {
  picked = catalog.landmarks.filter(l => args.includes(l.id) || args.includes(l.model))
}
if (!picked.length) {
  console.error('usage: bun tools/overlap.ts <id ...> | --branch-diff [base] | --credit <name>  [--min 0.1]')
  process.exit(2)
}

type Ring = [number, number][]
type Feature = { ref: string; tags: Record<string, string>; rings: Ring[] }

async function overpass(query: string): Promise<any> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: new URLSearchParams({ data: query }) })
    if (r.ok) return r.json()
    await Bun.sleep(5000 * (attempt + 1))
  }
  throw new Error('Overpass did not answer')
}

/** Buildings and building:parts within `radius` m, with their outer rings in lng/lat. */
async function buildingsAround(lng: number, lat: number, radius: number): Promise<Feature[]> {
  const at = `around:${Math.ceil(radius)},${lat},${lng}`
  const data = await overpass(`[out:json][timeout:60];(way(${at})["building"];way(${at})["building:part"];relation(${at})["building"];relation(${at})["building:part"];);out geom;`)
  const out: Feature[] = []
  for (const e of data.elements) {
    const rings: Ring[] = e.type === 'way'
      ? [e.geometry.map((p: any) => [p.lon, p.lat])]
      : (e.members ?? []).filter((m: any) => m.role === 'outer' && m.geometry).map((m: any) => m.geometry.map((p: any) => [p.lon, p.lat]))
    if (rings.length) out.push({ ref: `${e.type}/${e.id}`, tags: e.tags ?? {}, rings })
  }
  return out
}

const inside = (x: number, z: number, ring: Ring) => {
  let hit = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i], [xj, zj] = ring[j]
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) hit = !hit
  }
  return hit
}

let found = 0
for (const l of picked) {
  const model = catalog.models.find(m => m.id === l.model)!
  const prims = readGlb(new Uint8Array(readFileSync(join(ROOT, model.file))))
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
  for (const { position: p } of prims) for (let i = 0; i < p.length; i++) {
    min[i % 3] = Math.min(min[i % 3], p[i]); max[i % 3] = Math.max(max[i % 3], p[i])
  }
  const coverage = planCoverage({ min, max, primitives: prims.map(p => ({ position: p.position, index: p.index, node: -1 })) })
  const scale = l.scale ?? 1, b = ((l.bearing ?? 0) * Math.PI) / 180
  const k = Math.cos((l.lat * Math.PI) / 180) * 111320
  // lng/lat to the model's own frame (x east, z south, unscaled), the inverse of the placement.
  const toModel = ([lng, lat]: [number, number]): [number, number] => {
    const east = (lng - l.lng) * k, south = (l.lat - lat) * 110574
    return [(Math.cos(b) * east + Math.sin(b) * south) / scale, (-Math.sin(b) * east + Math.cos(b) * south) / scale]
  }
  const reach = Math.hypot(Math.max(-min[0], max[0]), Math.max(-min[2], max[2])) * scale
  const listed = new Set(l.replaces ?? [])
  const hits: string[] = []
  for (const f of await buildingsAround(l.lng, l.lat, reach + 30)) {
    if (listed.has(f.ref)) continue
    const rings = f.rings.map(r => r.map(toModel))
    let all = 0, covered = 0
    const step = 1 / scale
    for (const ring of rings) {
      const xs = ring.map(p => p[0]), zs = ring.map(p => p[1])
      for (let x = Math.min(...xs) + step / 2; x < Math.max(...xs); x += step)
        for (let z = Math.min(...zs) + step / 2; z < Math.max(...zs); z += step)
          if (inside(x, z, ring)) { all++; if (coveredNear(coverage, x, z, 0)) covered++ }
    }
    if (!all || covered / all < minShare) continue
    const area = all * scale * scale * step * step
    const what = [f.tags.building ? `building=${f.tags.building}` : `building:part=${f.tags['building:part']}`, f.tags.name].filter(Boolean).join(' ')
    hits.push(`  ${f.ref.padEnd(18)} ${String(Math.round((100 * covered) / all)).padStart(3)}% under the model, ${Math.round(area)} m²  ${what}`)
  }
  if (hits.length) {
    found += hits.length
    console.log(`${l.id}: ${hits.length} unlisted OSM building${hits.length > 1 ? 's' : ''} under the model`)
    for (const h of hits) console.log(h)
  } else console.log(`${l.id}: ok`)
}
if (found) process.exitCode = 1
