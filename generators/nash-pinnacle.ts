/**
 * The Pinnacle at Symphony Place (now "Symphony Place"; 150 3rd Avenue
 * South), Nashville (2010, Pickard Chilton with Everton Oglesby) — original
 * procedural geometry, CC0-1.0.
 * bun generators/nash-pinnacle.ts [out.glb]
 *
 * This file also holds the small kit (prisms, bevelled rings, grouped window
 * panels, fins) shared by the other nash-* towers built with it
 * (nash-four-seasons, nash-fifth-third-center, nash-nashville-city-center,
 * nash-life-and-casualty-tower); its own build runs only as the main module.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/130910796 (36.1603003, -86.7747350). Bearing 61°: the tower's
 * faces, which sit square to SoBro's street grid, are square to this frame
 * (+y faces 61°, toward 2nd Ave / the river; -y faces Demonbreun-side 241°).
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the square glass shaft with its four corners notched the whole height;
 * - the crown: from 78 m the tower tapers in seven steps to 133 m. Each
 *   step narrows every face (the stepped outer edges seen on every face in
 *   the photos) and, from 102.6 m, also sets it back (lidar: faces at
 *   24.5, 23.6, 22.6, 21.4, 19.6 and 17.6 m from the centre), so each face
 *   reads as a stepped, tapering slab and the corner notches deepen as it
 *   rises; the top step is a hollow ring of glass screens round the roof;
 * - in each corner notch, three stepped glass "blades" climbing toward the
 *   top (to 96, 108 and 116 m) and, above them, the narrow slit where two
 *   faces' slabs nearly meet: from a corner the top reads as two tapering
 *   slabs split by a slot (Chader's, LeMay's and Wobbanight's photos);
 * - the curtain wall: light, silvery-blue reflective glass with bright pale
 *   vertical mullion fins. Drawn as broad three-storey glass panels between
 *   pale piers (one per ~3 m bay) and pale spandrel lines, with the step
 *   lips in pale trim;
 * - a pale warm-grey stone base, about four storeys.
 *
 * Evidence
 * - OSM: outline way/130910796 (building, 29 levels, height 127, wikidata
 *   Q7757217). Read in this frame it is a square of 50.1 x 49.0 m (x -24.8
 *   to 25.3, y -24.3 to 24.7) with 5.5 x 6 m notches at all four corners;
 *   drawn as a 49 m square, notches 5.5 m. No building:parts.
 * - Lidar: USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 0.5 m grid, read in
 *   this frame (tools/lidar_frame.py). Heights are above the lowest ground
 *   under the footprint (the north-east, 2nd Ave side; 0.8 m above the box's
 *   ground_min; the Demonbreun side is ~2 m higher). Measured: corner zones
 *   89.7 m; face steps at 102.6, 117.4, 125 and 133 m with their faces at
 *   ±24.5, ±22.5, ±20 and ±17-18 m; crown ring 133 m, its corners open
 *   (the slit); roof inside the ring 117-125 m; corner blades ~107 m; slab
 *   width ±13.5-14.5 m. Garage podium beside the tower (not part of this
 *   outline) 23 m. The intermediate steps (78, 86, 94, 110.5 m) and the
 *   arm widths are scaled from the photos between those measured levels.
 * - Published: 127 m (417 ft), 29 floors, opened 2010 (Wikipedia, "The
 *   Pinnacle at Symphony Place"). The lidar ring top is 133 m above the low
 *   side, 131 m above the Demonbreun side; the lidar is used for the form.
 * - Terrain (Mapterhorn): ground under the footprint varies by ~3.5 m, low on
 *   the north-east; the walls simply run down to y = 0.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   Pinnacle at Symphony Place.jpg, Louis Chader, CC BY-SA 4.0 (a notched
 *     corner and its blades, close up);
 *   Pinnacle at Symphony Place Nashville.jpg, Wobbanight, CC0 (from the
 *     north-west, far: the two crown slabs and the slit);
 *   Pinnacle Nashville.JPG, Michael Rivera, CC BY-SA 4.0 (a face square-on,
 *     used to scale the edge steps);
 *   Pinnacle Nashville (from Broadway).JPG, Michael Rivera, CC BY-SA 4.0;
 *   Pinnacle Building, 3rd Avenue and Demonbreun Street, Nashville, TN
 *     (54385253009) and (54384181657), Warren LeMay, CC BY-SA 2.0 (the corner
 *     slot and the steps on the far edges);
 *   Schermerhorn Symphony Center and The Pinnacle building.jpg, Reading Tom,
 *     CC BY 2.0 (the stone base, from the plaza).
 *   No look-only sources were used. No commercial imagery.
 * - Colours from those photos, pulled to the palette: light grey-blue glass
 *   (a lighter window variant, as the tower reads pale and silvery), pale
 *   cool-grey mullions and lips, warm grey-beige stone base.
 * - Night: the office floors glow (window); the crown screens above the roof
 *   (125-133 m) are open glass fins in reality, drawn in glass so they stay
 *   dark. (No night photo was checked.)
 *
 * Estimated: the stone base height (17 m, from Reading Tom's photo against
 *   the Schermerhorn cornice); the blades' plan size and heights; the bay
 *   width; the intermediate crown steps (above).
 * Left out: the rooftop "Pinnacle" sign (removed in 2025), the fine
 *   mullions, the garage podium (a separate OSM building).
 * Doubts: the four corners are drawn alike; photos show at least two of
 *   them clearly and lidar shows the crown ring symmetric. The real blades
 *   are glass fins with sloped tops; they are drawn as flat-topped blocks.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'

// ======================================================================
// Shared kit
// ======================================================================
export type XY = [number, number]
export const at = (p: XY, z: number): V3 => [p[0], p[1], z]

/** A planar convex polygon, wound to face `hint`. */
export function poly(part: Part, pts: V3[], hint: V3) {
  const [a, b, c] = pts
  const n = [
    (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
    (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
  ]
  const p = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < p.length - 1; i++) part.tri(p[0], p[i], p[i + 1])
}

export const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
export const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

/** Outward normal of the edge a→b of a counter-clockwise ring. */
export const outN = (a: XY, b: XY): XY => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
}

/** Ear clipping for a simple counter-clockwise ring. */
export function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (cr(r[ia], r[ib], r[ic]) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(r[j], r[ia], r[ib], r[ic]))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat cap over a simple counter-clockwise ring. */
export function cap(part: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of triangulate(r)) {
    if (up) part.tri(at(r[a], z), at(r[b], z), at(r[c], z))
    else part.tri(at(r[a], z), at(r[c], z), at(r[b], z))
  }
}

/** Walls of a counter-clockwise ring, z0→z1; walls reaching the ground are cut into ≤5 m pieces for the terrain drape. */
export function walls(part: Part, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = z0 <= 0.5 ? Math.max(1, Math.ceil(L / 5)) : 1
    for (let k = 0; k < n; k++) {
      const p: XY = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]
      const q: XY = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n]
      part.quad(at(p, z0), at(q, z0), at(q, z1), at(p, z1))
    }
  }
}

/** A prism over a ring: walls in `part`, a top in `top` (or none). */
export function prism(part: Part, r: XY[], z0: number, z1: number, top: Part | null = part) {
  const w = ccw(r)
  walls(part, w, z0, z1)
  if (top) cap(top, w, z1)
  return w
}

/** Cut every convex corner of a counter-clockwise ring by `c` (the bevel STYLE.md asks for). */
export function bevel(r: XY[], c: number): XY[] {
  const w = ccw(r), out: XY[] = []
  for (let i = 0; i < w.length; i++) {
    const p = w[(i - 1 + w.length) % w.length], q = w[i], s = w[(i + 1) % w.length]
    const cr = (q[0] - p[0]) * (s[1] - q[1]) - (q[1] - p[1]) * (s[0] - q[0])
    const l1 = Math.hypot(q[0] - p[0], q[1] - p[1]), l2 = Math.hypot(s[0] - q[0], s[1] - q[1])
    if (cr <= 1e-9 || l1 < 3 * c || l2 < 3 * c) { out.push(q); continue }
    out.push([q[0] + (p[0] - q[0]) / l1 * c, q[1] + (p[1] - q[1]) / l1 * c])
    out.push([q[0] + (s[0] - q[0]) / l2 * c, q[1] + (s[1] - q[1]) / l2 * c])
  }
  return out
}

/** An axis-aligned rectangle, counter-clockwise. */
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A square-ish ring of half-sizes hx, hy whose four corners are notched n deep (counter-clockwise from the south-east). */
export function notched(hx: number, hy: number, n: number, cx = 0, cy = 0): XY[] {
  const r: XY[] = [
    [hx - n, -hy], [hx - n, -hy + n], [hx, -hy + n], [hx, hy - n], [hx - n, hy - n], [hx - n, hy],
    [-hx + n, hy], [-hx + n, hy - n], [-hx, hy - n], [-hx, -hy + n], [-hx + n, -hy + n], [-hx + n, -hy],
  ]
  return r.map(([x, y]) => [x + cx, y + cy] as XY)
}

/** Storey groups between z0 and z1: bands `group` tall counted from `base`, `gap` of wall between. */
export function rows(z0: number, z1: number, base: number, group: number, gap: number, top = 1.0, bottom = 0.6): [number, number][] {
  const out: [number, number][] = []
  for (let g = Math.floor((z0 - base) / group) - 1; base + g * group < z1; g++) {
    const lo = Math.max(base + g * group + gap / 2, z0 + bottom), hi = Math.min(base + (g + 1) * group - gap / 2, z1 - top)
    if (hi - lo > 1.5) out.push([lo, hi])
  }
  return out
}

/**
 * Window panels on the wall a→b of a counter-clockwise ring (outside to the
 * right), standing `off` proud: bays about `bayW` wide with `pier` of wall
 * between, over the share s0..s1 of the edge.
 */
export function panels(part: Part, a: XY, b: XY, rs: [number, number][], bayW: number, pier: number, s0 = 0, s1 = 1, off = 0.05, edge = -1) {
  const Lt = Math.hypot(b[0] - a[0], b[1] - a[1]), L = Lt * (s1 - s0)
  const e = edge < 0 ? pier / 2 : edge
  if (L < 2 * e + 1.2) return
  const n = outN(a, b), u: XY = [(b[0] - a[0]) / Lt, (b[1] - a[1]) / Lt]
  const st: XY = [a[0] + u[0] * Lt * s0, a[1] + u[1] * Lt * s0]
  const bays = Math.max(1, Math.round((L - 2 * e + pier) / bayW)), bay = (L - 2 * e + pier) / bays
  for (const [z0, z1] of rs) for (let k = 0; k < bays; k++) {
    const t0 = e + k * bay, t1 = e + (k + 1) * bay - pier
    const p: XY = [st[0] + u[0] * t0 + n[0] * off, st[1] + u[1] * t0 + n[1] * off]
    const q: XY = [st[0] + u[0] * t1 + n[0] * off, st[1] + u[1] * t1 + n[1] * off]
    part.quad(at(p, z0), at(q, z0), at(q, z1), at(p, z1))
  }
}

/** Panels on every edge of a ring longer than `min`. */
export function ringPanels(part: Part, r: XY[], rs: [number, number][], bayW: number, pier: number, min = 3, edge = -1) {
  const w = ccw(r)
  for (let i = 0; i < w.length; i++) {
    const a = w[i], b = w[(i + 1) % w.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) >= min) panels(part, a, b, rs, bayW, pier, 0, 1, 0.05, edge)
  }
}

/** A lip around a ring at z0..z1 standing `out` proud (cornices, step edges): walls only, plus the top. */
export function lip(part: Part, r: XY[], z0: number, z1: number, out: number) {
  const w = ccw(r), n = w.length, o: XY[] = []
  for (let i = 0; i < n; i++) {
    const p = w[(i - 1 + n) % n], q = w[i], s = w[(i + 1) % n]
    const n1 = outN(p, q), n2 = outN(q, s), m: XY = [n1[0] + n2[0], n1[1] + n2[1]]
    const d = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    o.push([q[0] + m[0] / d * out, q[1] + m[1] / d * out])
  }
  walls(part, o, z0, z1)
  // the underside and top as rings between w and o
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    part.quad(at(w[i], z1), at(w[j], z1), at(o[j], z1), at(o[i], z1))
    part.quad(at(o[i], z0), at(o[j], z0), at(w[j], z0), at(w[i], z0))
  }
  return o
}

export type Layer = { part: Part; material: Swatch & { floodlight?: (p: V3, n: V3) => number } }

/** Write the model, checking the budget. */
export async function save(id: string, name: string, layers: Layer[], meta: { bearing: number; height: number; replaces: string[] }, maxTri = 5000) {
  const triangles = layers.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTri) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, layers.filter((l) => l.part.triangles > 0), {
    license: 'CC0-1.0', bearing: meta.bearing, elevation: 0, height: meta.height,
    frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
    replaces: meta.replaces,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = process.argv[2] ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// ======================================================================
// The Pinnacle
// ======================================================================
function build(): Layer[] {
  const glassW = new Part()  // curtain-wall panels (glow at night)
  const mull = new Part()    // pale mullion piers, spandrels and lips
  const screen = new Part()  // the crown's glass screens above the roof (dark at night)
  const roof = new Part()
  const stone = new Part()

  const H = 24.5, NOTCH = 5.5
  const Z_BASE = 17
  const GROUP = 12.3, GAP = 0.7, BAY = 3.1, PIER = 0.6
  const rs = (z0: number, z1: number) => rows(z0, z1, Z_BASE, GROUP, GAP, 0.9, 0.5)

  // A level of the tower: a cross whose four arms are 2w wide and reach d
  // from the centre (the notched square is the case w = d - notch).
  const cross = (d: number, w: number): XY[] => [
    [w, -d], [w, -w], [d, -w], [d, w], [w, w], [w, d],
    [-w, d], [-w, w], [-d, w], [-d, -w], [-w, -w], [-w, -d],
  ]

  // --- the stone base ---
  const base = bevel(cross(H, H - NOTCH), 0.4)
  prism(stone, base, 0, Z_BASE, null)
  ringPanels(glassW, base, [[1.2, 5.6], [6.8, Z_BASE - 1.4]], 4.2, 1.6)
  lip(mull, base, Z_BASE - 0.7, Z_BASE, 0.25)

  // --- the shaft and the crown's steps: [top, depth d, arm half-width w] ---
  // Each step sets the face back (lidar: 24.5 → 22.5 → 20 → 17-18) and
  // narrows it (the steps on every face's outer edges in the photos), so the
  // corner notches deepen as the crown tapers.
  const levels: [number, number, number][] = [
    [78.0, H, H - NOTCH],
    [86.0, H, 17.6],
    [94.0, H, 16.6],
    [102.6, 23.6, 15.8],
    [110.5, 22.6, 15.2],
    [117.4, 21.4, 14.8],
    [125.0, 19.6, 14.5],
    [133.0, 17.6, 14.4],
  ]
  let z0 = Z_BASE
  levels.forEach(([z1, d, w], i) => {
    const ring = bevel(cross(d, w), 0.35)
    const top = i === levels.length - 1
    if (top) {
      // the crown screens: a hollow ring 1.5 m thick round the roof (125 m)
      const inner = bevel(cross(d - 1.5, w - 1.5), 0.3)
      walls(screen, ring, z0, z1)
      walls(screen, [...inner].reverse(), z0, z1)
      for (let k = 0; k < ring.length; k++) {
        const k2 = (k + 1) % ring.length
        mull.quad(at(inner[k], z1), at(ring[k], z1), at(ring[k2], z1), at(inner[k2], z1))
      }
    } else prism(mull, ring, z0, z1, roof)
    if (!top) ringPanels(glassW, ring, rs(z0, z1), BAY, PIER, 2.5, 0.6)
    lip(mull, ring, z1 - 0.45, z1, 0.18)
    z0 = z1
  })

  // --- the corner blades: two stepped glass blocks rising in each notch,
  // stopping short of the top so the slit between the faces shows ---
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    const blk = (w: number, a: number, z0: number, z1: number) => {
      const r = ccw(rect(w - 0.5, w - 0.5, a, a).map(([x, y]) => [x * sx, y * sy] as XY))
      const q = bevel(r, 0.3)
      prism(mull, q, z0, z1, roof)
      ringPanels(glassW, q, rs(z0, z1), 2.4, 0.5, 1.8, 0.4)
      lip(mull, q, z1 - 0.4, z1, 0.15)
    }
    blk(17.6, 21.6, 78, 96)
    blk(15.8, 19.2, 96, 108)
    blk(14.8, 17.0, 108, 116)
  }

  return [
    { part: glassW, material: { ...PALETTE.window, color: 0x9fb6c9 } },
    { part: mull, material: finish('pinnacle-mullion', 0xdde2e5) },
    { part: screen, material: { ...PALETTE.glass, color: 0xa9bfd1 } },
    { part: roof, material: PALETTE.roof },
    { part: stone, material: finish('pinnacle-stone', 0xd9cfbf) },
  ]
}

if (import.meta.main) {
  await save('nash-pinnacle', 'The Pinnacle at Symphony Place', build(), {
    bearing: 61, height: 133, replaces: ['way/130910796'],
  })
}
