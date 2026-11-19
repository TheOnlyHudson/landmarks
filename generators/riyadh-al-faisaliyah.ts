/**
 * Al Faisaliah Tower (Al Faisaliyah Center), Riyadh — original procedural geometry, CC0-1.0.
 * bun generators/riyadh-al-faisaliyah.ts
 *
 * Frame: map frame turned to BEARING 335.9, so the faces are square to the
 * axes (OSM's square outline runs at 65.9° / 155.9°). Origin = centroid of
 * the OSM tower outline way/1445986915.
 *
 * Evidence
 * - OSM way/1445986915 "برج الفيصلية": a 40 × 42 m square outline, height
 *   267, 30 levels. The low complex round it (way/177667555, 5 levels) is a
 *   separate outline that the tower does not cover; it is left to the map.
 * - Published (Wikipedia "Al Faisaliah Center", CTBUH): 267 m to the tip,
 *   Foster + Partners with Buro Happold, completed 2000; a golden glass globe
 *   (restaurant) high on the tower, four corner legs converging to a spire,
 *   three sky-lobby bands braced by large diagonal trusses.
 * - Commons photos, all EVIDENCE:
 *   "Al Faisaliah Tower (xiquinhosilva) - Flickr.jpg" (xiquinhosilva, CC BY 4.0)
 *     — from a corner, the clearest elevation: legs, bands, fins, block,
 *     globe, deck spire and glass tip;
 *     https://commons.wikimedia.org/wiki/File:Al_Faisaliah_Tower_(xiquinhosilva)_-_Flickr.jpg
 *   "All Faisaliah Tower Riyadh, 2023.jpeg" (Hamza A. Durrani, CC BY-SA 4.0)
 *     — the base and the brace geometry;
 *     https://commons.wikimedia.org/wiki/File:All_Faisaliah_Tower_Riyadh,_2023.jpeg
 *   "Faisaliah Tower (12753438475).jpg" (Francisco Anzola, CC BY 2.0) — the
 *     fins and the beige recess behind the braces;
 *     https://commons.wikimedia.org/wiki/File:Faisaliah_Tower_(12753438475).jpg
 *   "King Fahd Road (looking north).JPG" (BroadArrow, CC BY-SA 3.0) — from
 *     afar with little perspective: the heights of the bands, block, globe and
 *     spire, scaled to the globe; https://commons.wikimedia.org/wiki/File:King_Fahd_Road_(looking_north).JPG
 *   "Faisaliah tower riyadh.jpg" (Abdulrahman.Dallal, CC BY-SA 4.0) — the
 *     stacked decks of the spire; https://commons.wikimedia.org/wiki/File:Faisaliah_tower_riyadh.jpg
 *
 * Estimated (from the King Fahd Road photo, scaled to the 41 m OSM base and the
 * published 267 m): the corner profile, half-width 24 × (1 − t/2 − t⁴/2), t = z/252
 * (48 m across the legs at the base, ~30 m under the block, legs meeting
 * at 252 m);
 * brace bands at 70–79, 114–123 and 158–167 m, each with a bold X truss of 2.6 m
 * bars from corner to corner across the face; the stone block 167–178 m;
 * the globe 21 m across (0.93 of the face width under it, as in the
 * distant photo), centred at 189 m; spire decks 201–229 m; glass tip 232–252 m; needle to 267 m. Fins drawn every ~4.6 m (about one a floor)
 * and 1.3 m deep, 1.0 m thick (the louvres read as broad white bands in every photo), so they read without shimmering; the real louvres are
 * one per floor. Leg and beam sizes estimated from the photos.
 *
 * Leg spread from photos: OSM's outline is a 41 m square, but the distant
 * King Fahd Road view gives base width / height of about 0.18 (~48 m on the
 * published 267 m), so the splayed corner legs reach ~3.5 m beyond the OSM
 * outline at the foot. The OSM centre is kept.
 *
 * Doubts: band heights and the leg spread rest on one distant photo.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { oq, triCount } from './riyadh-kingdom-centre'

const BEARING = 335.9
const ANCHOR = { lng: 46.6850099, lat: 24.6902004 }

const alu = new Part(), glassBody = new Part(), stone = new Part(), gold = new Part(), steel = new Part(), tip = new Part()

const W0 = 24, ZC = 252
const w = (z: number) => { const t = Math.min(z, ZC) / ZC; return W0 * (1 - 0.5 * t - 0.5 * t ** 4) }
const LEG = (z: number) => 1.7 - 0.7 * (z / ZC) // leg half-size
const body = (z: number) => w(z) - 1.4 // glazed face half-width

/** Square ring at half-width h, chamfer c, height z, CCW. */
function sq(h: number, z: number, c = 0): V3[] {
  if (c <= 0) return [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  return [[-h + c, -h, z], [h - c, -h, z], [h, -h + c, z], [h, h - c, z], [h - c, h, z], [-h + c, h, z], [-h, h - c, z], [-h, -h + c, z]]
}
function loftFn(p: Part, hw: (z: number) => number, z0: number, z1: number, step = 8, c = 0) {
  const n = Math.max(1, Math.ceil((z1 - z0) / step)), rings: V3[][] = []
  for (let k = 0; k <= n; k++) { const z = z0 + ((z1 - z0) * k) / n; rings.push(sq(hw(z), z, c)) }
  p.loft(rings)
}
/** Horizontal annulus between two square half-widths at z, facing up or down. */
function annulus(p: Part, hOut: number, hIn: number, z: number, up: boolean) {
  const o = sq(hOut, z), i = sq(hIn, z)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    oq(p, i[k], o[k], o[l], i[l], [0, 0, up ? 1 : -1])
  }
}
/** A box between corner points, axis-aligned. */
function abox(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const r0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const r1: V3[] = r0.map(([x, y]) => [x, y, z1])
  p.loft([r0, r1]); p.cap(r1, true); p.cap(r0, false)
}
/** Rotate a point about z by k quarter turns (faces: 0 = +y face … ). */
const rot = (v: V3, k: number): V3 => {
  let [x, y, z] = v
  for (let i = 0; i < k; i++) [x, y] = [-y, x]
  return [x, y, z]
}

// --- Heights ---
const BANDS: [number, number][] = [[70, 79], [114, 123], [158, 167]]
const LOBBY = 8, BLOCK0 = 167, BLOCK1 = 178, GLOBE_C = 189, GLOBE_R = 10.5
const DECK0 = 201, TIP0 = 232, APEX = 252, NEEDLE = 267
const RECESS = 2.6

// --- Body: glazed sections between the bands, recessed beige bands, glass lobby. ---
{
  const cuts = [0, LOBBY, ...BANDS.flat(), BLOCK0]
  for (let i = 0; i + 1 < cuts.length; i++) {
    const z0 = cuts[i], z1 = cuts[i + 1]
    const isBand = BANDS.some(([a]) => a === z0)
    const isLobby = z0 === 0
    const hw = isBand || isLobby ? (z: number) => body(z) - RECESS : body
    loftFn(isBand ? stone : glassBody, hw, z0, z1, 8)
    if (isBand || isLobby) {
      // the overhang above (a soffit) and, for bands, the sill below
      annulus(stone, body(z1), body(z1) - RECESS, z1, false)
      if (isBand) annulus(stone, body(z0), body(z0) - RECESS, z0, true)
    }
  }
  // Block under the globe: stone, flush with the legs' inner faces.
  loftFn(stone, (z) => w(z) - 1.0, BLOCK0, BLOCK1, 11)
  annulus(stone, w(BLOCK0) - 1.0, body(BLOCK0), BLOCK0, false)
  const top = sq(w(BLOCK1) - 1.0, BLOCK1)
  stone.cap(top, true)
}

// --- Fins: white louvres every ~6 m on the glazed sections, between the legs. ---
{
  const sections: [number, number][] = [[LOBBY + 3, BANDS[0][0] - 1.5], [BANDS[0][1] + 3, BANDS[1][0] - 1.5], [BANDS[1][1] + 3, BANDS[2][0] - 1.5]]
  for (const [a, b] of sections) {
    const n = Math.max(1, Math.round((b - a) / 4.6))
    for (let k = 0; k <= n; k++) {
      const z = a + ((b - a) * k) / n
      const h = body(z), span = w(z) - 2 * LEG(z) - 0.2
      for (let f = 0; f < 4; f++) {
        // fin on the +y face, then turned: x from -span to span, y from h to h + 1.0
        const pts = [[-span, h - 0.05], [span, h - 0.05], [span, h + 1.3], [-span, h + 1.3]] as [number, number][]
        const r0 = pts.map(([x, y]) => rot([x, y, z - 1.0], f)), r1 = pts.map(([x, y]) => rot([x, y, z], f))
        alu.loft([r0, r1]); alu.cap(r1, true); alu.cap(r0, false)
      }
    }
  }
}

// --- Brace bands: top and bottom beams and the big ^ truss on every face. ---
for (const [z0, z1] of BANDS) {
  for (let f = 0; f < 4; f++) {
    const hb = body(z0), ht = body(z1)
    const sb = w(z0) - 2 * LEG(z0), st = w(z1) - 2 * LEG(z1)
    // beams: 1.3 m tall, 1.1 m deep, outer face 0.3 m proud of the glazing
    for (const [zc, h, s] of [[z0, hb, sb], [z1, ht, st]] as [number, number, number][]) {
      const pts = [[-s, h - 0.8], [s, h - 0.8], [s, h + 0.6], [-s, h + 0.6]] as [number, number][]
      const r0 = pts.map(([x, y]) => rot([x, y, zc - 0.9], f)), r1 = pts.map(([x, y]) => rot([x, y, zc + 0.9], f))
      alu.loft([r0, r1]); alu.cap(r1, true); alu.cap(r0, false)
    }
    // a bold X across the full face: corner to corner, 2.6 m wide bars standing proud of the recess
    for (const [ua, za, ub, zb] of [[-(sb - 1.0), z0 + 0.6, st - 1.0, z1 - 0.6], [sb - 1.0, z0 + 0.6, -(st - 1.0), z1 - 0.6]]) {
      const ya = hb - 0.2, yb = ht - 0.2
      const a: V3 = [ua, ya, za], b: V3 = [ub, yb, zb]
      const dx = b[0] - a[0], dz = b[2] - a[2], l = Math.hypot(dx, dz)
      const nx = (-dz / l) * 1.3, nz = (dx / l) * 1.3 // half-width across the bar in the face plane
      const sec = (p: V3): V3[] => [
        rot([p[0] + nx, p[1] - 0.6, p[2] + nz], f), rot([p[0] + nx, p[1] + 0.6, p[2] + nz], f),
        rot([p[0] - nx, p[1] + 0.6, p[2] - nz], f), rot([p[0] - nx, p[1] - 0.6, p[2] - nz], f),
      ]
      alu.sweep([sec(a), sec(b)])
    }
  }
}

// --- Corner legs: square sections following the curved corner, meeting at the tip. ---
for (let f = 0; f < 4; f++) {
  const rings: V3[][] = []
  const N = 26
  for (let k = 0; k <= N; k++) {
    const z = (APEX - 6) * (k / N)
    const lh = LEG(z), c = Math.max(w(z) - lh, 0.6)
    rings.push(sq(lh, z).map(([x, y]) => rot([c + x, c + y, z], f)))
  }
  alu.loft(rings)
  alu.cap(rings[rings.length - 1], true)
}

// --- The golden globe: a faceted sphere, flat-shaded like its glass facets. ---
{
  const NS = 16, NR = 10
  const pt = (i: number, j: number): V3 => {
    const th = (Math.PI * j) / NR, ph = (2 * Math.PI * i) / NS
    return [GLOBE_R * Math.sin(th) * Math.cos(ph), GLOBE_R * Math.sin(th) * Math.sin(ph), GLOBE_C - GLOBE_R * Math.cos(th)]
  }
  for (let j = 0; j < NR; j++) for (let i = 0; i < NS; i++) {
    const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1)
    const m: V3 = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2 - GLOBE_C]
    if (j === 0) { oqTri(gold, a, c, d, m); continue }
    if (j === NR - 1) { oqTri(gold, a, b, c, m); continue }
    oq(gold, a, b, c, d, m)
  }
}
function oqTri(p: Part, a: V3, b: V3, c: V3, hint: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}

// --- Spire: a central mast with stacked decks, a glass pyramid tip and a needle. ---
{
  abox(steel, -1.4, 1.4, -1.4, 1.4, BLOCK1, TIP0)
  for (const z of [DECK0, 206.5, 212, 217.5, 223, 228]) {
    const h = Math.max(1.6, w(z) - 2 * LEG(z) - 0.3)
    abox(steel, -h, h, -h, h, z, z + 1.2)
  }
  const h0 = w(TIP0) - 0.4
  const base = sq(h0, TIP0)
  for (let k = 0; k < 4; k++) tip.tri(base[k], base[(k + 1) % 4], [0, 0, APEX])
  tip.cap(base, false)
  const n0 = sq(0.5, APEX - 0.5), n1 = sq(0.08, NEEDLE)
  steel.loft([n0, n1]); steel.cap(n1, true)
}

const parts = [
  { part: alu, material: finish('aluminium-white', 0xeceeee) },
  { part: glassBody, material: { ...PALETTE.window, color: 0x5f7689 } },
  { part: stone, material: finish('faisaliah-stone', 0xd8cdbb) },
  { part: gold, material: finish('neon-globe-gold', 0xc9a45c, 0.4) },
  { part: steel, material: finish('spire-steel', 0x9aa1a7) },
  { part: tip, material: { ...PALETTE.glass, color: 0xa8cdc5 } },
]
const triangles = triCount(parts)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Al Faisaliah Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: NEEDLE,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/1445986915'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/riyadh-al-faisaliyah.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
