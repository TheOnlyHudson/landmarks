/** The catalog as stored: one JSON file per entry, so that pull requests
 * adding or editing different landmarks touch different files and never
 * conflict, however close their ids sort.
 *
 *     catalog/places/<id>.json
 *     catalog/models/<id>.json
 *     catalog/landmarks/<id>.json
 *
 * Each file holds one record, two-space indented with a trailing newline,
 * and is named after its `id`. Before this layout the whole catalog lived
 * in one sorted `catalog.json`; `catalogAt` still reads that from old
 * commits, for history. */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Catalog } from './catalog'

export const CATALOG_DIR = 'catalog'
const KINDS = ['places', 'models', 'landmarks'] as const
type Kind = (typeof KINDS)[number]

export const formatEntry = (entry: unknown) => JSON.stringify(entry, null, 2) + '\n'
const byId = <T extends { id: string }>(rows: T[]) => [...rows].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))

/** Build a catalog from `catalog/<kind>/<id>.json` paths and their text. */
function assemble(files: Iterable<[path: string, read: () => string]>): Catalog {
  const lists: Record<Kind, { id: string }[]> = { places: [], models: [], landmarks: [] }
  for (const [path, read] of files) {
    const m = path.match(/^catalog\/(places|models|landmarks)\/[^/]+\.json$/)
    if (m) lists[m[1] as Kind].push(JSON.parse(read()))
  }
  const catalog = { models: byId(lists.models), landmarks: byId(lists.landmarks) } as Catalog
  if (lists.places.length) catalog.places = byId(lists.places) as Catalog['places']
  return catalog
}

const entryFiles = (root: string) => KINDS.flatMap(kind => {
  const dir = join(root, CATALOG_DIR, kind)
  return existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.json')).map(f => `${CATALOG_DIR}/${kind}/${f}`) : []
})

/** The catalog in a working tree. */
export function readCatalog(root: string): Catalog {
  return assemble(entryFiles(root).map(path => [path, () => readFileSync(join(root, path), 'utf8')]))
}

/** Write a whole catalog, one file per entry, removing files for entries it no longer has. */
export function writeCatalog(root: string, catalog: Catalog) {
  for (const kind of KINDS) {
    const dir = join(root, CATALOG_DIR, kind)
    mkdirSync(dir, { recursive: true })
    const rows = (catalog[kind] ?? []) as { id: string }[]
    const keep = new Set(rows.map(r => `${r.id}.json`))
    for (const f of readdirSync(dir)) if (f.endsWith('.json') && !keep.has(f)) rmSync(join(dir, f))
    for (const r of rows) {
      const file = join(dir, `${r.id}.json`)
      const text = formatEntry(r)
      if (!existsSync(file) || readFileSync(file, 'utf8') !== text) writeFileSync(file, text)
    }
  }
}

/** Problems with how the catalog is stored: a file not named after its id,
 * or not in the standard format. `bun tools/format-catalog.ts` fixes both. */
export function storageProblems(root: string): string[] {
  const problems: string[] = []
  if (existsSync(join(root, 'catalog.json'))) problems.push('catalog.json: the catalog now lives in catalog/<kind>/<id>.json; move its entries there')
  for (const path of entryFiles(root)) {
    const text = readFileSync(join(root, path), 'utf8')
    let entry: { id?: string }
    try { entry = JSON.parse(text) } catch { problems.push(`${path}: not valid JSON`); continue }
    if (`${entry.id}.json` !== path.split('/').pop()) problems.push(`${path}: file name must be its id ("${entry.id}.json")`)
    else if (formatEntry(entry) !== text) problems.push(`${path}: not formatted; run bun tools/format-catalog.ts`)
  }
  return problems
}

/** Paths in a commit, with their blob ids. */
export function treeAt(root: string, commit: string): Map<string, string> {
  const out = execFileSync('git', ['-C', root, 'ls-tree', '-r', commit], { maxBuffer: 64 * 1024 * 1024 }).toString().trim()
  return new Map(out ? out.split('\n').map(line => {
    const [entry, path] = line.split('\t')
    return [path, entry.split(' ')[2]] as [string, string]
  }) : [])
}

/** Read many blobs in one `git cat-file --batch`, into `cache` by blob id. */
function readBlobs(root: string, oids: string[], cache: Map<string, string>) {
  const missing = [...new Set(oids)].filter(oid => !cache.has(oid))
  if (!missing.length) return
  const out = execFileSync('git', ['-C', root, 'cat-file', '--batch'], { input: missing.join('\n') + '\n', maxBuffer: 1024 * 1024 * 1024 })
  let at = 0
  while (at < out.length) {
    const eol = out.indexOf(10, at)
    const [oid, , size] = out.subarray(at, eol).toString().split(' ')
    const start = eol + 1
    cache.set(oid, out.subarray(start, start + Number(size)).toString())
    at = start + Number(size) + 1
  }
}

/** The catalog at a commit, in either layout; undefined where there is none.
 * Pass the same `cache` across commits to read each unchanged entry once. */
export function catalogAt(root: string, commit: string, tree = treeAt(root, commit), cache = new Map<string, string>()): Catalog | undefined {
  const entries = [...tree].filter(([path]) => path.startsWith(`${CATALOG_DIR}/`))
  if (entries.length) {
    readBlobs(root, entries.map(([, oid]) => oid), cache)
    return assemble(entries.map(([path, oid]) => [path, () => cache.get(oid)!]))
  }
  const legacy = tree.get('catalog.json')
  if (!legacy) return undefined
  // Whole old catalogs are megabytes each and rarely repeat: don't keep them.
  const once = new Map<string, string>()
  readBlobs(root, [legacy], once)
  return JSON.parse(once.get(legacy)!) as Catalog
}
