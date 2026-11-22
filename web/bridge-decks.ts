import { MercatorCoordinate, type CustomLayerInterface, type CustomRenderMethodInput, type DataDrivenPropertyValueSpecification, type Map as LibreMap } from 'maplibre-gl'
import { BufferAttribute, BufferGeometry, Camera, Color, DoubleSide, Matrix4, Mesh, MeshBasicMaterial, Scene, WebGLRenderer } from 'three'
import { VectorTile } from '@mapbox/vector-tile'
import { PbfReader } from 'pbf'
import { recolor } from './theme'
import { PLAN_CELL, type ModelPlan } from './map-models'

/**
 * Bridges and viaducts as 3D decks, worked out in the browser from public data
 * only: the bridge ways in OpenFreeMap's vector tiles (OpenMapTiles
 * `transportation`, `brunnel=bridge`) and the Mapterhorn terrain the map
 * already draws. There is no deck height in the tiles (OSM has no `ele` on
 * most bridges), so heights are estimates, by the rule in `deckHeights`:
 *
 * 1. A bridge is every bridge way that touches another, joined across tiles.
 *    It lands where a way ends without meeting another bridge way.
 * 2. Each landing takes the terrain's height there. Along the bridge the deck
 *    runs between its landings, weighted by distance along the deck (a
 *    straight grade between two landings), plus a gentle crest that grows
 *    with the distance to the nearest landings (2% of it, at most 6 m).
 * 3. Away from its landings the deck keeps a clearance over the ground under
 *    it (5.5 m, 7 m over water) and 6 m over a lower-`layer` bridge it
 *    crosses. Where it would not, it is lifted, the lift tapering to nothing
 *    at the landings.
 */

/** OpenFreeMap tiles are cut to zoom 14 at 4096 units a side. */
export const TILE_ZOOM = 14
export const EXTENT = 4096
const WORLD = EXTENT * 2 ** TILE_ZOOM
/** Metres in one tile unit at the equator. */
const UNIT_M = 40075016.686 / WORLD
/**
 * Mapterhorn at z14, 512 px tiles (about 3–4 m a pixel in the US): one
 * terrain tile per road tile, rather than the four z15 would take, and
 * fine enough for a landing on an embankment or the ground under a span.
 */
const DEM_ZOOM = 14
const DEM_SIZE = 512
const DEM_PER_UNIT = (DEM_SIZE * 2 ** DEM_ZOOM) / WORLD
export const DEM_TILES = 'https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'

/** Deck nodes no further apart than this, in metres, so the clearance is checked along the span. */
const STEP = 12
/** Clearance from the deck's surface to the ground under it, over land and over water. */
export const CLEARANCE = 5.5
export const WATER_CLEARANCE = 7
/** Over a lower-`layer` bridge's deck. */
export const STACK = 6
/** Crest: this share of the harmonic distance to the landings, at most CREST_MAX metres. */
const CREST = 0.02
const CREST_MAX = 6
/** Nodes this close to a landing (harmonic distance, metres) aren't held to the clearance: they are on the abutment. */
const ABUTMENT = 12
/** The deck surface is drawn this far over its height, clear of the ground it meets at a landing. */
const LIFT = 0.3
const DECK_DEPTH = 1.2

/** One bridge way clipped to a tile, in global tile units (zoom 14, 4096 a tile). */
export type Piece = { id: number; cls: string; ramp: boolean; layer: number; points: [number, number][] }
type TileData = { pieces: Piece[]; water: [number, number][][] }

/** Clip a line to the square [lo, hi]², returning the runs inside (Liang–Barsky per segment). */
export function clipLine(points: [number, number][], lo: number, hi: number): [number, number][][] {
  const runs: [number, number][][] = []
  let run: [number, number][] = []
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1], [x1, y1] = points[i]
    let t0 = 0, t1 = 1
    const dx = x1 - x0, dy = y1 - y0
    let inside = true
    for (const [p, q] of [[-dx, x0 - lo], [dx, hi - x0], [-dy, y0 - lo], [dy, hi - y0]]) {
      if (p === 0) { if (q < 0) { inside = false; break } continue }
      const r = q / p
      if (p < 0) { if (r > t1) { inside = false; break } if (r > t0) t0 = r }
      else { if (r < t0) { inside = false; break } if (r < t1) t1 = r }
    }
    if (!inside) { if (run.length > 1) runs.push(run); run = []; continue }
    const a: [number, number] = [x0 + dx * t0, y0 + dy * t0], b: [number, number] = [x0 + dx * t1, y0 + dy * t1]
    if (!run.length) run.push(a)
    else if (t0 > 0) { if (run.length > 1) runs.push(run); run = [a] }
    run.push(b)
    if (t1 < 1) { if (run.length > 1) runs.push(run); run = [] }
  }
  if (run.length > 1) runs.push(run)
  return runs
}

/** A tile's bridge ways, clipped to the tile itself (not its buffer), and its water, in global units. */
export function readTile(bytes: Uint8Array, x: number, y: number): TileData {
  const tile = new VectorTile(new PbfReader(bytes))
  const ox = x * EXTENT, oy = y * EXTENT
  const pieces: Piece[] = []
  const roads = tile.layers.transportation
  for (let i = 0; roads && i < roads.length; i++) {
    const f = roads.feature(i)
    if (f.type !== 2 || f.properties.brunnel !== 'bridge') continue
    const scale = EXTENT / roads.extent
    for (const line of f.loadGeometry()) {
      for (const run of clipLine(line.map(p => [p.x * scale, p.y * scale] as [number, number]), 0, EXTENT))
        pieces.push({ id: Number(f.id ?? -1), cls: String(f.properties.class ?? ''), ramp: f.properties.ramp === 1 || f.properties.ramp === true,
          layer: Number(f.properties.layer ?? 0), points: run.map(([px, py]) => [ox + px, oy + py]) })
    }
  }
  const water: [number, number][][] = []
  const waters = tile.layers.water
  for (let i = 0; waters && i < waters.length; i++) {
    const f = waters.feature(i)
    if (f.type !== 3) continue
    const scale = EXTENT / waters.extent
    for (const ring of f.loadGeometry()) water.push(ring.map(p => [ox + p.x * scale, oy + p.y * scale]))
  }
  return { pieces, water }
}

/** Even-odd point in rings. */
function inRings(rings: [number, number][][], x: number, y: number) {
  let inside = false
  for (const ring of rings)
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j]
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
    }
  return inside
}

/** The bridges as one graph of deck nodes: shared vertices join ways, within and across tiles. */
export class DeckGraph {
  x: number[] = []
  y: number[] = []
  layer: number[] = []
  /** Whether the node ends a way (a landing, if nothing else meets it). */
  end: boolean[] = []
  adj: number[][] = []
  /** Each piece's nodes, in order. */
  paths: { piece: Piece; nodes: number[] }[] = []
  private grid = new Map<string, number[]>()

  constructor(pieces: Piece[], readonly metresPerUnit: number) {
    for (const piece of pieces) {
      const nodes: number[] = []
      piece.points.forEach(([px, py], i) => {
        const node = this.node(px, py, piece.layer)
        if (i > 0) {
          const prev = nodes[nodes.length - 1]
          if (prev === node) return
          // Densify long segments so the clearance is read along the span.
          const steps = Math.floor((Math.hypot(px - this.x[prev], py - this.y[prev]) * metresPerUnit) / STEP)
          let last = prev
          for (let k = 1; k <= steps; k++) {
            const t = k / (steps + 1)
            const mid = this.add(this.x[prev] + (px - this.x[prev]) * t, this.y[prev] + (py - this.y[prev]) * t, piece.layer)
            this.link(last, mid); nodes.push(mid); last = mid
          }
          this.link(last, node)
        }
        nodes.push(node)
      })
      if (nodes.length < 2) continue
      this.end[nodes[0]] = true
      this.end[nodes[nodes.length - 1]] = true
      this.paths.push({ piece, nodes })
    }
  }

  private add(x: number, y: number, layer: number) {
    const n = this.x.length
    this.x.push(x); this.y.push(y); this.layer.push(layer); this.end.push(false); this.adj.push([])
    return n
  }
  /** The node at a vertex, joining any within 1.5 units (about a metre): tile edges cut a way at slightly different points. */
  private node(x: number, y: number, layer: number) {
    const cx = Math.floor(x / 2), cy = Math.floor(y / 2)
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++)
      for (const n of this.grid.get(`${cx + i},${cy + j}`) ?? []) if (Math.hypot(this.x[n] - x, this.y[n] - y) <= 1.5) {
        this.layer[n] = Math.max(this.layer[n], layer)
        return n
      }
    const n = this.add(x, y, layer)
    const key = `${cx},${cy}`
    const cell = this.grid.get(key)
    if (cell) cell.push(n); else this.grid.set(key, [n])
    return n
  }
  private link(a: number, b: number) {
    if (a === b || this.adj[a].includes(b)) return
    this.adj[a].push(b); this.adj[b].push(a)
  }
  length(a: number, b: number) { return Math.hypot(this.x[a] - this.x[b], this.y[a] - this.y[b]) * this.metresPerUnit }

  components(): number[][] {
    const seen = new Uint8Array(this.x.length)
    const out: number[][] = []
    for (let s = 0; s < this.x.length; s++) {
      if (seen[s] || !this.adj[s].length) continue
      const comp = [s]
      seen[s] = 1
      for (let i = 0; i < comp.length; i++) for (const m of this.adj[comp[i]]) if (!seen[m]) { seen[m] = 1; comp.push(m) }
      out.push(comp)
    }
    return out
  }
}

/** Shortest distances along the deck from one node to every node it reaches (Dijkstra on a binary heap). */
function distances(g: DeckGraph, from: number): Map<number, number> {
  const dist = new Map<number, number>([[from, 0]])
  const heap: [number, number][] = [[0, from]]
  const push = (item: [number, number]) => {
    heap.push(item)
    for (let i = heap.length - 1; i > 0;) {
      const p = (i - 1) >> 1
      if (heap[p][0] <= heap[i][0]) break
      ;[heap[p], heap[i]] = [heap[i], heap[p]]; i = p
    }
  }
  const pop = () => {
    const top = heap[0], last = heap.pop()!
    if (heap.length) {
      heap[0] = last
      for (let i = 0; ;) {
        const l = 2 * i + 1, r = l + 1
        let m = i
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r
        if (m === i) break
        ;[heap[m], heap[i]] = [heap[i], heap[m]]; i = m
      }
    }
    return top
  }
  while (heap.length) {
    const [d, n] = pop()
    if (d > (dist.get(n) ?? Infinity)) continue
    for (const m of g.adj[n]) {
      const dm = d + g.length(n, m)
      if (dm < (dist.get(m) ?? Infinity)) { dist.set(m, dm); push([dm, m]) }
    }
  }
  return dist
}

/**
 * Deck heights for one bridge (see the module comment). `landings` are its
 * nodes that meet the ground, `ground` the terrain under every node, `needs`
 * the least height a node must have (ground plus clearance, or a lower deck
 * plus STACK). Returns null without a landing.
 */
export function deckHeights(g: DeckGraph, comp: number[], landings: number[], ground: (n: number) => number, needs: (n: number) => number): Map<number, number> | null {
  if (!landings.length) return null
  const fromLanding = landings.map(l => distances(g, l))
  const base = new Map<number, number>(), harmonic = new Map<number, number>()
  for (const n of comp) {
    let weight = 0, sum = 0, at = -1
    landings.forEach((l, k) => {
      const d = fromLanding[k].get(n)
      if (d === undefined) return
      if (d < 1e-6) at = l
      else { weight += 1 / d; sum += ground(l) / d }
    })
    if (at >= 0) { base.set(n, ground(at)); harmonic.set(n, 0); continue }
    base.set(n, weight ? sum / weight : ground(n))
    harmonic.set(n, weight ? 1 / weight : 0)
  }
  const deck = new Map<number, number>()
  for (const n of comp) deck.set(n, base.get(n)! + Math.min(CREST * harmonic.get(n)!, CREST_MAX))
  // Lift where the deck would come too close to what is under it, tapering to the landings.
  const lifts: { at: number; by: number }[] = []
  for (const n of comp) {
    const h = harmonic.get(n)!
    if (h < ABUTMENT) continue
    const by = needs(n) - deck.get(n)!
    if (by > 0) lifts.push({ at: h, by })
  }
  if (lifts.length) for (const n of comp) {
    const h = harmonic.get(n)!
    let lift = 0
    for (const { at, by } of lifts) lift = Math.max(lift, by * Math.min(1, h / at))
    deck.set(n, deck.get(n)! + lift)
  }
  return deck
}

/** Where two segments cross, as the parameter along the first; null if they don't (or are parallel). */
function crossing(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): number | null {
  const den = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx)
  if (Math.abs(den) < 1e-9) return null
  const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / den
  const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / den
  // Ends included: densified decks often have a node right at the crossing.
  return t >= -1e-9 && t <= 1 + 1e-9 && u >= -1e-9 && u <= 1 + 1e-9 ? t : null
}

type Surface = { ground: (n: number) => number | null; water: (n: number) => boolean; open: (n: number) => boolean }

/** Heights for every bridge in the graph: null for a node whose bridge couldn't be worked out. */
export function solveDecks(g: DeckGraph, surface: Surface): Map<number, number> {
  const heights = new Map<number, number>()
  const comps = g.components()
  const compOf = new Int32Array(g.x.length).fill(-1)
  comps.forEach((c, k) => c.forEach(n => { compOf[n] = k }))
  // Segment crossings between different layers, found on a grid of 64 units (about 30 m).
  const segs: [number, number][] = []
  for (let a = 0; a < g.x.length; a++) for (const b of g.adj[a]) if (a < b) segs.push([a, b])
  const cells = new Map<string, number[]>()
  segs.forEach(([a, b], i) => {
    const x0 = Math.floor(Math.min(g.x[a], g.x[b]) / 64), x1 = Math.floor(Math.max(g.x[a], g.x[b]) / 64)
    const y0 = Math.floor(Math.min(g.y[a], g.y[b]) / 64), y1 = Math.floor(Math.max(g.y[a], g.y[b]) / 64)
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) { const k = `${x},${y}`; const c = cells.get(k); if (c) c.push(i); else cells.set(k, [i]) }
  })
  /** For each upper node, the lower segments it passes over: [lower a, lower b, t along it]. */
  const over = new Map<number, [number, number, number][]>()
  const checked = new Set<string>()
  for (const list of cells.values()) for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const key = list[i] < list[j] ? `${list[i]},${list[j]}` : `${list[j]},${list[i]}`
    if (checked.has(key)) continue
    checked.add(key)
    let [a, b] = segs[list[i]], [c, d] = segs[list[j]]
    const la = Math.max(g.layer[a], g.layer[b]), lc = Math.max(g.layer[c], g.layer[d])
    if (la === lc || a === c || a === d || b === c || b === d) continue
    if (la < lc) [a, b, c, d] = [c, d, a, b]
    const t = crossing(g.x[a], g.y[a], g.x[b], g.y[b], g.x[c], g.y[c], g.x[d], g.y[d])
    if (t === null) continue
    const u = crossing(g.x[c], g.y[c], g.x[d], g.y[d], g.x[a], g.y[a], g.x[b], g.y[b])!
    const upper = t < 0.5 ? a : b
    const entry = over.get(upper)
    if (entry) entry.push([c, d, u]); else over.set(upper, [[c, d, u]])
  }
  // Lower layers first, then twice more so a lift below reaches the decks above it.
  const order = comps.map((c, k) => ({ k, layer: Math.min(...c.map(n => g.layer[n])) })).sort((p, q) => p.layer - q.layer)
  for (let pass = 0; pass < 3; pass++) {
    for (const { k } of order) {
      const comp = comps[k]
      if (pass > 0 && !comp.some(n => over.has(n))) continue
      const grounds = comp.map(n => surface.ground(n))
      if (grounds.some(v => v === null)) continue
      const ground = new Map(comp.map((n, i) => [n, grounds[i]!]))
      const landings = comp.filter(n => g.end[n] && g.adj[n].length === 1 && !surface.open(n))
      const deck = deckHeights(g, comp, landings, n => ground.get(n)!, n => {
        let need = ground.get(n)! + (surface.water(n) ? WATER_CLEARANCE : CLEARANCE)
        for (const [c, d, u] of over.get(n) ?? []) {
          const hc = heights.get(c), hd = heights.get(d)
          if (hc !== undefined && hd !== undefined) need = Math.max(need, hc + (hd - hc) * u + STACK)
        }
        return need
      })
      if (deck) for (const [n, h] of deck) heights.set(n, h)
    }
  }
  return heights
}

/** Deck half-widths in metres by OpenMapTiles class. Dual carriageways are separate ways, each drawn alone. */
function halfWidth(p: Piece) {
  if (p.ramp) return 3.5
  return ({ motorway: 6, trunk: 5.5, primary: 5, secondary: 4.5, tertiary: 4, minor: 3.5, service: 2.75, track: 2, raceway: 4, busway: 3.5,
    path: 1.5, rail: 2.5, transit: 2.25 } as Record<string, number>)[p.cls] ?? 3
}
/** Day colours from the basemap's own road paint (Positron), by surface: the deck top for each class, and its sides. */
const DAY = { major: '#ffffff', minor: '#e0e0e0', path: '#eaeaea', rail: '#dddddd', side: '#b2b2b2' }
type Shade = keyof typeof DAY
const shadeOf = (p: Piece): Shade => ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'].includes(p.cls) ? 'major'
  : p.cls === 'path' ? 'path' : ['rail', 'transit'].includes(p.cls) ? 'rail' : 'minor'

/** The deck ribbons for the drawn pieces: a top at deck height and its two sides, in metres from `origin` (x east, y south, z up). */
export function deckMesh(g: DeckGraph, heights: Map<number, number>, drawn: (p: Piece) => boolean, origin: [number, number]) {
  const position: number[] = [], shade: Shade[] = []
  const at = (n: number): [number, number] => [(g.x[n] - origin[0]) * g.metresPerUnit, (g.y[n] - origin[1]) * g.metresPerUnit]
  const quad = (a: number[], b: number[], c: number[], d: number[], s: Shade) => { position.push(...a, ...b, ...c, ...a, ...c, ...d); for (let i = 0; i < 6; i++) shade.push(s) }
  let pieces = 0
  for (const { piece, nodes } of g.paths) {
    if (!drawn(piece) || nodes.some(n => !heights.has(n))) continue
    pieces++
    const w = halfWidth(piece), top = shadeOf(piece)
    // Draw only the nodes that bend the deck: in plan, or off a straight grade by more than 15 cm.
    const kept = nodes.filter((n, i) => {
      if (i === 0 || i === nodes.length - 1) return true
      const a = nodes[i - 1], b = nodes[i + 1]
      const cross = (g.x[n] - g.x[a]) * (g.y[b] - g.y[a]) - (g.y[n] - g.y[a]) * (g.x[b] - g.x[a])
      const span = Math.hypot(g.x[b] - g.x[a], g.y[b] - g.y[a]) || 1
      if (Math.abs(cross / span) * g.metresPerUnit > 0.3) return true
      const t = Math.hypot(g.x[n] - g.x[a], g.y[n] - g.y[a]) / span
      return Math.abs(heights.get(n)! - (heights.get(a)! + (heights.get(b)! - heights.get(a)!) * t)) > 0.15
    })
    const edges = kept.map((n, i) => {
      const [x, y] = at(n)
      const [px, py] = at(kept[Math.max(0, i - 1)]), [nx, ny] = at(kept[Math.min(kept.length - 1, i + 1)])
      let dx = nx - px, dy = ny - py
      const len = Math.hypot(dx, dy) || 1
      dx /= len; dy /= len
      const z = heights.get(n)! + LIFT
      return { l: [x - dy * w, y + dx * w, z], r: [x + dy * w, y - dx * w, z] }
    })
    for (let i = 1; i < edges.length; i++) {
      const a = edges[i - 1], b = edges[i]
      const down = (v: number[]) => [v[0], v[1], v[2] - DECK_DEPTH]
      quad(a.l, b.l, b.r, a.r, top)
      quad(a.l, b.l, down(b.l), down(a.l), 'side')
      quad(a.r, b.r, down(b.r), down(a.r), 'side')
    }
  }
  return { position: new Float32Array(position), shade, pieces }
}

/** How near (metres) a bridge way must run to a landmark's replaced ways, over how much of its length, to count as part of that landmark. */
const COVER_DISTANCE = 18
const COVER_SHARE = 0.7

/**
 * The bridge ways a shown landmark model stands in for: the ways it replaces,
 * and any way running alongside them for most of its length (the other
 * carriageway, a footway on the same deck), which its `replaces` may not list.
 */
export function coveredByModels(g: DeckGraph, replaced: Set<number>, plans: ModelPlan[] = []): Set<Piece> {
  const covered = new Set<Piece>()
  // Ways lying mostly where a shown model has geometry: its deck, whatever ids its catalogue entry lists.
  const planned = plans.map(({ asset, cells }) => {
    const at = MercatorCoordinate.fromLngLat(asset.anchor)
    return { x: at.x * WORLD, y: at.y * WORLD, perUnit: (1 / WORLD) / at.meterInMercatorCoordinateUnits(), cells }
  })
  const inPlan = (n: number) => planned.some(p => {
    const east = (g.x[n] - p.x) * p.perUnit, south = (g.y[n] - p.y) * p.perUnit
    return p.cells.has(`${Math.floor(east / PLAN_CELL)},${Math.floor(south / PLAN_CELL)}`)
  })
  if (planned.length) for (const path of g.paths) if (path.nodes.filter(inPlan).length >= path.nodes.length * COVER_SHARE) covered.add(path.piece)
  const cell = COVER_DISTANCE / g.metresPerUnit
  const grid = new Set<string>()
  for (const { piece, nodes } of g.paths) {
    if (!replaced.has(piece.id) && !covered.has(piece)) continue
    covered.add(piece)
    for (const n of nodes) grid.add(`${Math.floor(g.x[n] / cell)},${Math.floor(g.y[n] / cell)}`)
  }
  if (!grid.size) return covered
  const near = (n: number) => {
    const cx = Math.floor(g.x[n] / cell), cy = Math.floor(g.y[n] / cell)
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) if (grid.has(`${cx + i},${cy + j}`)) return true
    return false
  }
  for (const { piece, nodes } of g.paths)
    if (!covered.has(piece) && nodes.filter(near).length >= nodes.length * COVER_SHARE) covered.add(piece)
  return covered
}

/** Mapterhorn terrain decoded from its tiles, kept as 0.2 m steps in 16 bits. */
class Terrain {
  private tiles = new Map<string, Promise<Uint16Array | null>>()
  failed = false

  /** Load the tiles under these points (global tile units). */
  async load(points: [number, number][]) {
    const keys = new Set(points.map(([x, y]) => `${Math.floor((x * DEM_PER_UNIT) / DEM_SIZE)}/${Math.floor((y * DEM_PER_UNIT) / DEM_SIZE)}`))
    await Promise.all([...keys].map(k => this.tile(k)))
  }
  private tile(key: string) {
    let tile = this.tiles.get(key)
    if (!tile) {
      const [x, y] = key.split('/')
      tile = decodeDem(DEM_TILES.replace('{z}', String(DEM_ZOOM)).replace('{x}', x).replace('{y}', y)).catch(() => { this.failed = true; this.tiles.delete(key); return null })
      this.tiles.set(key, tile)
      while (this.tiles.size > 32) this.tiles.delete(this.tiles.keys().next().value!)
    }
    return tile
  }
  /** Height at a point, bilinear within its tile; null if the tile isn't loaded. */
  async at(x: number, y: number): Promise<number | null> {
    const px = x * DEM_PER_UNIT, py = y * DEM_PER_UNIT
    const tx = Math.floor(px / DEM_SIZE), ty = Math.floor(py / DEM_SIZE)
    const data = await this.tile(`${tx}/${ty}`)
    if (!data) return null
    const fx = Math.min(DEM_SIZE - 1.001, Math.max(0, px - tx * DEM_SIZE - 0.5)), fy = Math.min(DEM_SIZE - 1.001, Math.max(0, py - ty * DEM_SIZE - 0.5))
    const ix = Math.floor(fx), iy = Math.floor(fy), u = fx - ix, v = fy - iy
    const h = (i: number, j: number) => data[j * DEM_SIZE + i] / 5 - 500
    return h(ix, iy) * (1 - u) * (1 - v) + h(ix + 1, iy) * u * (1 - v) + h(ix, iy + 1) * (1 - u) * v + h(ix + 1, iy + 1) * u * v
  }
}

async function decodeDem(url: string): Promise<Uint16Array> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Terrain ${response.status}`)
  const bitmap = await createImageBitmap(await response.blob())
  const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(DEM_SIZE, DEM_SIZE) : Object.assign(document.createElement('canvas'), { width: DEM_SIZE, height: DEM_SIZE })
  const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  ctx.drawImage(bitmap, 0, 0, DEM_SIZE, DEM_SIZE)
  const { data } = ctx.getImageData(0, 0, DEM_SIZE, DEM_SIZE)
  const out = new Uint16Array(DEM_SIZE * DEM_SIZE)
  for (let i = 0; i < out.length; i++) {
    // Terrarium: (r × 256 + g + b / 256) − 32768 metres.
    const e = data[i * 4] * 256 + data[i * 4 + 1] + data[i * 4 + 2] / 256 - 32768
    out[i] = Math.max(0, Math.min(65535, Math.round((e + 500) * 5)))
  }
  return out
}

/** Decks drawn from this zoom; below it the basemap's flat bridges stay. */
export const DECK_MINZOOM = 14
/** The most vector tiles a view builds decks from, nearest the centre first. */
const MAX_TILES = 16

/** The bridge decks layer. Hides the basemap's flat line for every bridge it draws, and for the bridge ways a shown landmark replaces. */
export class BridgeDecks implements CustomLayerInterface {
  readonly id = 'bridge-decks'
  readonly type = 'custom' as const
  readonly renderingMode = '3d' as const
  private map!: LibreMap
  private renderer!: WebGLRenderer
  private scene = new Scene()
  private camera = new Camera()
  private mesh?: Mesh
  private shades: Shade[] = []
  private originMerc = { x: 0, y: 0, unit: 1 }
  private tiles = new Map<string, Promise<TileData | null>>()
  private terrain = new Terrain()
  private timer?: ReturnType<typeof setTimeout>
  private build = 0
  private night = false
  private replaced = new Set<number>()
  private plans: ModelPlan[] = []
  private hidden = new Set<number>()
  /** The basemap's road line layers, with the opacity each had. */
  private roads = new Map<string, unknown>()
  private template = ''
  stats = { tiles: 0, bridges: 0, pieces: 0, triangles: 0, ms: 0 }
  /** The last solve, for checking heights from the console: `map.getLayer('bridge-decks').implementation.solved`. */
  solved?: { graph: DeckGraph; heights: Map<number, number>; ground: (number | null)[] }

  constructor(private onStatus: (message: string) => void) {}

  onAdd(map: LibreMap, gl: WebGL2RenderingContext) {
    this.map = map
    this.renderer = new WebGLRenderer({ canvas: map.getCanvas(), context: gl })
    this.renderer.autoClear = false
    // A flat bridge line under a deck is made transparent by feature state: a repaint, where a filter
    // would lay out the whole basemap source again each time the set changes.
    for (const layer of map.getStyle().layers) {
      if (layer.type !== 'line' || !('source-layer' in layer) || layer['source-layer'] !== 'transportation') continue
      const original = layer.paint?.['line-opacity']
      if (typeof original === 'object' && original !== null) continue // a zoom curve can't be wrapped; Positron has none
      this.roads.set(layer.id, original)
      map.setPaintProperty(layer.id, 'line-opacity', ['case', ['boolean', ['feature-state', 'deck'], false], 0, original ?? 1] as DataDrivenPropertyValueSpecification<number>)
    }
    const tiles = (map.getSource('openmaptiles') as { tiles?: string[] } | undefined)?.tiles
    this.template = tiles?.[0] ?? ''
    map.on('moveend', this.schedule)
    this.schedule()
  }
  onRemove() {
    this.map.off('moveend', this.schedule)
    clearTimeout(this.timer)
    this.hide([])
    for (const [id, original] of this.roads) if (this.map.getLayer(id)) this.map.setPaintProperty(id, 'line-opacity', original as DataDrivenPropertyValueSpecification<number>)
  }

  /** Bridge ways a shown landmark model replaces (Planetiler ids): its own deck stands in for them. */
  setReplaced(ids: number[], plans: ModelPlan[] = []) {
    this.replaced = new Set(ids)
    this.plans = plans
    this.schedule()
  }
  setNight(night: boolean) {
    this.night = night
    this.paint()
  }

  private schedule = () => {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => void this.rebuild(), 250)
  }

  private wantedTiles(): string[] {
    if (this.map.getZoom() < DECK_MINZOOM || !this.template) return []
    const n = 2 ** TILE_ZOOM
    const b = this.map.getBounds()
    const tx = (lng: number) => Math.floor(((lng + 180) / 360) * n)
    const ty = (lat: number) => Math.floor(MercatorCoordinate.fromLngLat([0, lat]).y * n)
    const c = this.map.getCenter()
    const [cx, cy] = [tx(c.lng), ty(c.lat)]
    const out: [string, number][] = []
    for (let x = Math.max(0, tx(b.getWest())); x <= Math.min(n - 1, tx(b.getEast())); x++)
      for (let y = Math.max(0, ty(b.getNorth())); y <= Math.min(n - 1, ty(b.getSouth())); y++)
        out.push([`${x}/${y}`, Math.hypot(x - cx, y - cy)])
    return out.sort((p, q) => p[1] - q[1]).slice(0, MAX_TILES).map(([k]) => k)
  }

  private tile(key: string) {
    let tile = this.tiles.get(key)
    if (!tile) {
      const [x, y] = key.split('/').map(Number)
      const url = this.template.replace('{z}', String(TILE_ZOOM)).replace('{x}', String(x)).replace('{y}', String(y))
      tile = fetch(url).then(async r => {
        if (!r.ok) throw new Error(`Bridges ${r.status}`)
        return readTile(new Uint8Array(await r.arrayBuffer()), x, y)
      }).catch(() => { this.tiles.delete(key); return null })
      this.tiles.set(key, tile)
      while (this.tiles.size > 64) this.tiles.delete(this.tiles.keys().next().value!)
    }
    return tile
  }

  private async rebuild() {
    const build = ++this.build
    const keys = this.wantedTiles()
    if (!keys.length) { this.setMesh(null); this.hide([]); return }
    const start = performance.now()
    const loaded = await Promise.all(keys.map(k => this.tile(k)))
    if (build !== this.build) return
    const fetched = new Set(keys.filter((_, i) => loaded[i]))
    const data = new Map(keys.map((k, i) => [k, loaded[i]]))
    const pieces = loaded.flatMap(t => t?.pieces ?? [])
    const c = this.map.getCenter()
    const graph = new DeckGraph(pieces, UNIT_M * Math.cos((c.lat * Math.PI) / 180))
    // Ground under every node, from the full-resolution terrain.
    this.terrain.failed = false
    await this.terrain.load(graph.x.map((x, i) => [x, graph.y[i]]))
    if (build !== this.build) return
    const ground = await Promise.all(graph.x.map((x, i) => this.terrain.at(x, graph.y[i])))
    if (build !== this.build) return
    const tileOf = (n: number) => `${Math.min(Math.floor(graph.x[n] / EXTENT), 2 ** TILE_ZOOM - 1)}/${Math.floor(graph.y[n] / EXTENT)}`
    const heights = solveDecks(graph, {
      ground: n => ground[n],
      water: n => inRings(data.get(tileOf(n))?.water ?? [], graph.x[n], graph.y[n]),
      // A way cut at the edge of the tiles read doesn't land there: its other end is out of reach.
      open: n => {
        const fx = graph.x[n] / EXTENT, fy = graph.y[n] / EXTENT
        const near = (f: number) => Math.abs(f - Math.round(f)) * EXTENT < 2
        const tx = Math.floor(fx), ty = Math.floor(fy)
        if (near(fx) && (!fetched.has(`${Math.round(fx) - 1}/${ty}`) || !fetched.has(`${Math.round(fx)}/${ty}`))) return true
        if (near(fy) && (!fetched.has(`${tx}/${Math.round(fy) - 1}`) || !fetched.has(`${tx}/${Math.round(fy)}`))) return true
        return false
      },
    })
    this.solved = { graph, heights, ground }
    const origin: [number, number] = [graph.x.length ? graph.x.reduce((s, v) => s + v, 0) / graph.x.length : 0, graph.y.length ? graph.y.reduce((s, v) => s + v, 0) / graph.y.length : 0]
    const covered = coveredByModels(graph, this.replaced, this.plans)
    const drawn = (p: Piece) => !covered.has(p)
    const mesh = deckMesh(graph, heights, drawn, origin)
    // Hide the flat line of every bridge drawn as a deck and of every bridge way a landmark stands in for.
    const decked = new Set(graph.paths.filter(({ piece, nodes }) => drawn(piece) && nodes.every(n => heights.has(n))).map(({ piece }) => piece.id))
    const replacedHere = [...covered].map(p => p.id)
    this.originMerc = { x: origin[0] / WORLD, y: origin[1] / WORLD, unit: MercatorCoordinate.fromLngLat(c).meterInMercatorCoordinateUnits() }
    this.setMesh(mesh)
    this.hide([...decked, ...replacedHere])
    const bridges = graph.components().filter(comp => comp.every(n => heights.has(n))).length
    this.stats = { tiles: fetched.size, bridges, pieces: mesh.pieces, triangles: mesh.position.length / 9, ms: Math.round(performance.now() - start) }
    const canvas = this.map.getCanvas()
    canvas.dataset.deckBridges = String(bridges)
    canvas.dataset.deckTriangles = String(this.stats.triangles)
    canvas.dataset.deckMs = String(this.stats.ms)
    canvas.dataset.deckTiles = String(fetched.size)
    this.onStatus(fetched.size < keys.length || this.terrain.failed ? 'Some bridges could not be raised and are drawn flat on the ground.' : '')
  }

  private setMesh(mesh: ReturnType<typeof deckMesh> | null) {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
      ;(this.mesh.material as MeshBasicMaterial).dispose()
      this.mesh = undefined
    }
    if (mesh && mesh.position.length) {
      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(mesh.position, 3))
      geometry.setAttribute('color', new BufferAttribute(new Float32Array(mesh.position.length), 3))
      this.shades = mesh.shade
      this.mesh = new Mesh(geometry, new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }))
      this.mesh.frustumCulled = false
      this.scene.add(this.mesh)
      this.paint()
    }
    this.map.triggerRepaint()
  }

  private paint() {
    if (!this.mesh) return
    const colors = Object.fromEntries(Object.entries(DAY).map(([k, v]) => [k, new Color(this.night ? recolor(v, 'line-color') as string : v)])) as Record<Shade, Color>
    const attribute = this.mesh.geometry.getAttribute('color') as BufferAttribute
    this.shades.forEach((s, i) => attribute.setXYZ(i, colors[s].r, colors[s].g, colors[s].b))
    attribute.needsUpdate = true
    this.map?.triggerRepaint()
  }

  /** Leave the flat lines of these bridge ways undrawn (by feature state), and draw the rest again. */
  private hide(ids: number[]) {
    const next = new Set(ids)
    const target = (id: number) => ({ source: 'openmaptiles', sourceLayer: 'transportation', id })
    for (const id of this.hidden) if (!next.has(id)) this.map.removeFeatureState(target(id), 'deck')
    for (const id of next) if (!this.hidden.has(id)) this.map.setFeatureState(target(id), { deck: true })
    this.hidden = next
  }

  render(_gl: WebGL2RenderingContext, options: CustomRenderMethodInput) {
    if (!this.mesh) return
    const { x, y, unit } = this.originMerc
    this.camera.projectionMatrix.fromArray(options.defaultProjectionData.mainMatrix)
      .multiply(new Matrix4().makeTranslation(x, y, 0)).multiply(new Matrix4().makeScale(unit, unit, unit))
    this.renderer.resetState()
    this.renderer.render(this.scene, this.camera)
    this.renderer.resetState()
  }
}
