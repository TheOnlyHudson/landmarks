/**
 * Wells Fargo Capitol Center, Raleigh (1991; formerly First Union / Wachovia
 * Capitol Center) — original procedural geometry, CC0-1.0.
 * bun generators/ral-wells-fargo-capitol-center.ts [out.glb]
 *
 * This file also holds the small kit the other Raleigh B3 towers import
 * (ral-two-hannover-square, ral-fnb-tower, ral-red-hat-tower,
 * ral-skyhouse-raleigh): a stepped grid mass that only draws walls where a
 * neighbour is lower (merged into whole faces), punched-window and
 * curtain-wall dressings, a bevelled coping, a gable roof along either axis.
 * It builds on the primitives exported by atl-one-atlantic-center.ts. The
 * tower's own build runs only when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/297829069, 35.778666,
 * -78.639686. Bearing 2: the downtown grid's edges run 2° east of north in
 * the OSM outline; the model is built in that turned frame.
 *
 * Identity (photos below): a square granite shaft with deep glazed notches
 * at all four corners; mottled pink-grey granite with tall window strips
 * grouped over several storeys; at the top each face steps up in two
 * shoulders to a centre bay under a steep gable, and the four gables cross
 * over the core (pale grey roofs in NAIP); gold WELLS FARGO letters under
 * the south and west gables and a small red logo panel in those gables; a
 * five-to-six storey granite podium round the base. The brief mentioned a
 * pyramidal crown; no photo shows one. The crown is the cross gable.
 *
 * Evidence:
 *  - plan: podium from OSM way/297829069 (turned 2°). Tower shaft 48 m
 *    square, centred on the outline, with 6 m corner notches: estimated
 *    from USGS NAIP (the roof outline, displaced east by the image's lean,
 *    measures about 48–51 m including the gables' lean; the west face's
 *    foot sits on the outline's west edge less ~3 m of podium) and from
 *    the photos (notch faces about a sixth of each face).
 *  - heights: 121.92 m published (Wikipedia, 400 ft; OSM height 121.92),
 *    29 floors. Gable ridge set to 121.9 m. Body 104 m, shoulders 108.5 m,
 *    gable eaves 113 m: estimated from the step and gable proportions in
 *    City Dweller 2's and Jmturner's photos. Podium 21 m with the notch
 *    fill to 25 m: counted storeys in Jmturner's and Alexisrael's photos.
 *    No lidar covers Raleigh.
 *  - colours: granite #c8b3a8-ish in shade, pulled to the palette's
 *    lightness; glass dark blue-grey (palette window); crown roofs pale
 *    grey (NAIP); sign gold, logo red.
 *  - y = 0 is the street; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Wells Fargo Building Raleigh.JPG, Alexisrael, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Wells_Fargo_Building_Raleigh.JPG
 *    (from the south-west, looking up: notches, stepped top, signs)
 *  - Wells Fargo Capitol Center December 2023.jpg, City Dweller 2, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Wells_Fargo_Capitol_Center_December_2023.jpg
 *    (from the south-east: stepped shoulders on the east face)
 *  - Wachovia-Building-Raleigh-20080321.jpeg, Jmturner, public domain
 *    https://commons.wikimedia.org/wiki/File:Wachovia-Building-Raleigh-20080321.jpeg
 *    (from Hargett and Fayetteville, south-east: podium, notch, colours)
 *  - Wells Fargo Capitol Center.jpg, FoxDon, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Wells_Fargo_Capitol_Center.jpg
 *    (from the west-south-west: gables, signs, logo panels)
 *  - Wells Fargo Capitol Center Street View.JPG, Abbylabar, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Wells_Fargo_Capitol_Center_Street_View.JPG
 *    (east podium and arched entrance)
 *  - View of wachovia bank, downtown raleigh - panoramio.jpg, Scott
 *    Thompson, CC BY 3.0 https://commons.wikimedia.org/wiki/File:View_of_wachovia_bank,_downtown_raleigh_-_panoramio.jpg
 *    (night: lit windows and notch glazing, crown dark)
 * USGS NAIP for the plan and roof colour. No look-only sources. No
 * commercial imagery.
 *
 * Doubts: the shaft size and notch depth are read from a leaning aerial
 * and photos, not measured; no photo shows the north face (assumed like
 * the others, without sign); the podium's wing seen west of the tower in
 * Alexisrael's photo is not in the OSM outline and is left out; the east
 * entrance arch is not modelled; the granite's checkerboard of pink and
 * grey blocks is drawn as one colour.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, at, wall, panels, capPoly, add2, lerp2, write } from './atl-one-atlantic-center'

// ─────────────────────────────── shared kit ───────────────────────────────

export { write }
export type { XY }

/** A counter-clockwise rectangle. */
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** One outward wall face over edge a→b (counter-clockwise ring), z0 to z1. */
export type Face = { a: XY; b: XY; z0: number; z1: number; n: XY; t: XY; len: number }

export function face(a: XY, b: XY, z0: number, z1: number): Face {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, b, z0, z1, n: [t[1], -t[0]], t, len }
}

/** Faces round a counter-clockwise ring. */
export function ringFaces(ring: XY[], z0: number, z1: number): Face[] {
  return ring.map((a, i) => face(a, ring[(i + 1) % ring.length], z0, z1))
}

/** Make a ring counter-clockwise. */
export function ccw(ring: XY[]): XY[] {
  let s = 0
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length]
    s += a[0] * b[1] - b[0] * a[1]
  })
  return s < 0 ? [...ring].reverse() : ring
}

/**
 * A stepped rectilinear mass on a grid of cells: `h(x, y)` gives a cell's
 * roof height from its centre (0 = empty). Roofs go to `roof`; a wall is
 * emitted wherever a neighbour is lower, merged along each line into whole
 * faces, and handed to `dress`.
 */
export function grid(xe: number[], ye: number[], h: (x: number, y: number) => number, roof: Part, dress: (f: Face) => void) {
  const nx = xe.length - 1, ny = ye.length - 1
  const H = (i: number, j: number) =>
    i < 0 || j < 0 || i >= nx || j >= ny ? 0 : Math.max(0, h((xe[i] + xe[i + 1]) / 2, (ye[j] + ye[j + 1]) / 2))
  const raw: Array<{ key: string; f: Face; s0: number; s1: number }> = []
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const z = H(i, j)
      if (z <= 0) continue
      const x0 = xe[i], x1 = xe[i + 1], y0 = ye[j], y1 = ye[j + 1]
      roof.quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z])
      const sides: Array<[string, XY, XY, number, number, number]> = [
        ['E', [x1, y0], [x1, y1], H(i + 1, j), y0, y1],
        ['W', [x0, y1], [x0, y0], H(i - 1, j), -y1, -y0],
        ['N', [x1, y1], [x0, y1], H(i, j + 1), -x1, -x0],
        ['S', [x0, y0], [x1, y0], H(i, j - 1), x0, x1],
      ]
      for (const [d, a, b, hn, s0, s1] of sides) {
        if (hn >= z) continue
        const plane = d === 'E' || d === 'W' ? a[0] : a[1]
        raw.push({ key: `${d}|${plane.toFixed(3)}|${hn.toFixed(3)}|${z.toFixed(3)}`, f: face(a, b, hn, z), s0, s1 })
      }
    }
  }
  const groups = new Map<string, typeof raw>()
  for (const r of raw) groups.set(r.key, [...(groups.get(r.key) ?? []), r])
  for (const list of groups.values()) {
    list.sort((p, q) => p.s0 - q.s0)
    let cur = list[0]
    for (const r of list.slice(1)) {
      if (Math.abs(r.s0 - cur.s1) < 1e-6) cur = { ...cur, f: face(cur.f.a, r.f.b, cur.f.z0, cur.f.z1), s1: r.s1 }
      else {
        dress(cur.f)
        cur = r
      }
    }
    dress(cur.f)
  }
}

/** Grouped window panels on a stone wall: `bay` is the target bay width. */
export type Punched = { bay: number; pier: number; group: number; spandrel: number; origin?: number; from?: number; top?: number }

export function punched(stone: Part, glass: Part, f: Face, o: Punched) {
  wall(stone, f.a, f.b, f.z0, f.z1)
  const bays = Math.max(1, Math.round(f.len / o.bay))
  const z0 = Math.max(f.z0, o.from ?? f.z0), z1 = f.z1 - (o.top ?? 1.2)
  if (z1 - z0 > 1.5 && f.len > o.pier + 0.8) panels(glass, f.a, f.b, z0, z1, { group: o.group, spandrel: o.spandrel, bays, pier: o.pier, origin: o.origin ?? 0 })
}

/** A curtain wall: glass, pale floor bands every `every` floors, a few mullions. */
export type Curtain = { floor: number; every: number; origin?: number; mullion?: number; band?: number; mullionW?: number }

export function curtain(glass: Part, line: Part, f: Face, o: Curtain) {
  wall(glass, f.a, f.b, f.z0, f.z1)
  const A = add2(f.a, f.n, 0.06), B = add2(f.b, f.n, 0.06)
  const g0 = o.origin ?? 0, step = o.floor * o.every, bh = o.band ?? 0.5
  for (let z = g0 + step; z < f.z1 - 1; z += step) if (z > f.z0 + 1) wall(line, A, B, z - bh / 2, z + bh / 2)
  if (o.mullion) {
    const k = Math.max(1, Math.round(f.len / o.mullion)), w = (o.mullionW ?? 0.4) / 2
    for (let m = 1; m < k; m++) {
      const p = lerp2(A, B, m / k)
      wall(line, add2(p, f.t, -w), add2(p, f.t, w), f.z0, f.z1)
    }
  }
}

/** A bevelled coping band at the top of a face: proud by `out`, `h` tall. */
export function coping(p: Part, f: Face, h = 0.8, out = 0.2, bevel = 0.25) {
  const A = add2(f.a, f.n, out), B = add2(f.b, f.n, out)
  wall(p, A, B, f.z1 - h, f.z1 - bevel)
  p.quad(at(f.a, f.z1 - h), at(f.b, f.z1 - h), at(B, f.z1 - h), at(A, f.z1 - h)) // soffit
  p.quad(at(A, f.z1 - bevel), at(B, f.z1 - bevel), at(f.b, f.z1), at(f.a, f.z1)) // chamfer
}

/** A flat panel standing `out` proud of a face, between s0..s1 along it and z0..z1. */
export function plate(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, out = 0.08, depth = 0) {
  const a = add2(add2(f.a, f.t, s0), f.n, out), b = add2(add2(f.a, f.t, s1), f.n, out)
  wall(p, a, b, z0, z1)
  if (depth > 0) {
    // a shallow box: sides, top and bottom back to the wall
    const a0 = add2(a, f.n, -depth), b0 = add2(b, f.n, -depth)
    wall(p, b, b0, z0, z1)
    wall(p, a0, a, z0, z1)
    p.quad(at(a0, z1), at(a, z1), at(b, z1), at(b0, z1))
    p.quad(at(a0, z0), at(b0, z0), at(b, z0), at(a, z0))
  }
}

/**
 * A gable roof along the x or y axis, from s0 to s1 along it, centred on the
 * line `c` across, `w` either side, eaves at zE and ridge at zR. The slopes
 * go to `roof`, the triangular ends to `end`.
 */
export function gable(roof: Part, end: Part, axis: 'x' | 'y', s0: number, s1: number, c: number, w: number, zE: number, zR: number) {
  // local (u along, v left of the axis) → plan; a rotation, so winding holds
  const P = (u: number, v: number, z: number): V3 => (axis === 'x' ? [u, c + v, z] : [c - v, u, z])
  roof.quad(P(s0, 0, zR), P(s1, 0, zR), P(s1, w, zE), P(s0, w, zE))
  roof.quad(P(s1, 0, zR), P(s0, 0, zR), P(s0, -w, zE), P(s1, -w, zE))
  end.tri(P(s1, -w, zE), P(s1, w, zE), P(s1, 0, zR))
  end.tri(P(s0, w, zE), P(s0, -w, zE), P(s0, 0, zR))
}

/** A flat cap over a ring (convex or not) at z. */
export function cap(p: Part, ring: XY[], z: number, up = true) {
  capPoly(p, ring, z, up)
}

// ─────────────────────────────── the tower ───────────────────────────────

function build() {
  const granite = new Part(), glass = new Part(), roof = new Part()
  const crown = new Part(), gold = new Part(), red = new Part()

  const C: XY = [0.9, -0.6] // shaft centre
  const T = 24, N = 7 // half-width, notch depth
  const BODY = 100, SHOULDER = 106, EAVE = 112, RIDGE = 121.9
  const PODIUM = 21, FILL = 25
  const FLOOR = 3.9, G0 = 6 // ground floor to 6 m, then 3.9 m storeys

  const edges = [-T, -T + N, -11.5, -6, 6, 11.5, T - N, T]
  const xe = edges.map((v) => C[0] + v), ye = edges.map((v) => C[1] + v)
  const height = (x: number, y: number) => {
    const ax = Math.abs(x - C[0]), ay = Math.abs(y - C[1])
    if (ax > T - N && ay > T - N) return FILL // the notch, filled by the podium
    const m = Math.min(ax, ay)
    return m < 6 ? EAVE : m < 11.5 ? SHOULDER : BODY
  }
  const inNotch = (f: Face) => {
    // a face whose midpoint sits in the outer band in both directions
    const m = lerp2(f.a, f.b, 0.5)
    return Math.abs(m[0] - C[0]) > T - N - 0.01 && Math.abs(m[1] - C[1]) > T - N - 0.01
  }
  const facade: Punched = { bay: 4.4, pier: 1.35, group: 3 * FLOOR, spandrel: 1.8, origin: G0 }
  grid(xe, ye, height, roof, (f) => {
    if (f.z1 <= FILL + 0.01) {
      // the notch fill: podium granite
      punched(granite, glass, f, { bay: 3.4, pier: 1.2, group: 2 * FLOOR, spandrel: 1.8, origin: G0 })
      coping(granite, f, 0.7, 0.15)
      return
    }
    if (inNotch(f)) {
      curtain(glass, granite, f, { floor: FLOOR, every: 3, origin: G0, mullion: 3, band: 0.6, mullionW: 0.35 })
      return
    }
    punched(granite, glass, f, facade)
    coping(granite, f, 0.9, 0.2)
  })

  // The cross gables over the centre bays, and the gable ends' trim.
  for (const axis of ['x', 'y'] as const) {
    const c = axis === 'x' ? C[1] : C[0], s = axis === 'x' ? C[0] : C[1]
    gable(crown, granite, axis, s - T - 0.2, s + T + 0.2, c, 6.3, EAVE, RIDGE)
  }

  // Signs: gold WELLS FARGO lettering bands under the south and west gables,
  // and a red logo panel in each of those gables.
  const S = face([C[0] - 6, C[1] - T], [C[0] + 6, C[1] - T], 0, EAVE)
  const W = face([C[0] - T, C[1] + 6], [C[0] - T, C[1] - 6], 0, EAVE)
  for (const f of [S, W]) {
    plate(gold, f, 0.6, 11.4, EAVE - 3.6, EAVE - 1.4, 0.35, 0.3)
    plate(red, f, 4.7, 7.3, EAVE + 1.4, EAVE + 4.0, 0.4, 0.35)
  }

  // The podium: the OSM outline, five storeys of granite with punched windows.
  const podium = ccw([
    [28.3, -28.4], [28.4, -11.7], [26.1, -11.7], [26.2, -8.2], [21.9, -8.2], [21.9, -3.5], [24.3, -3.5], [24.3, 5.5],
    [21.6, 5.5], [21.6, 9.7], [27.0, 9.6], [27.0, 12.7], [29.6, 12.7], [29.7, 22.9], [25.2, 22.9], [25.2, 26.8],
    [7.5, 26.9], [7.5, 25.5], [-8.7, 25.6], [-8.6, 27.3], [-26.4, 27.4], [-26.8, -24.3], [-23.3, -24.3], [-23.3, -28.7],
    [-13.6, -28.8], [-13.6, -26.5], [-9.7, -26.5], [-9.7, -23.9], [7.8, -24.0], [7.8, -26.2], [11.8, -26.2], [11.8, -28.3],
  ])
  for (const f of ringFaces(podium, 0, PODIUM)) {
    if (f.len < 2.5) {
      wall(granite, f.a, f.b, f.z0, f.z1)
      continue
    }
    punched(granite, glass, f, { bay: 3.4, pier: 1.2, group: 2 * FLOOR, spandrel: 1.8, origin: G0 })
    coping(granite, f, 0.7, 0.15)
  }
  cap(roof, podium, PODIUM)

  return [
    { part: granite, material: finish('wf-granite', 0xd5bfb3) },
    { part: glass, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: crown, material: finish('wf-crown-roof', 0xc6ccd1) },
    { part: gold, material: finish('neon-wf-gold', 0xe0b44a, 0.5) },
    { part: red, material: finish('neon-wf-red', 0xc9443c, 0.5) },
  ]
}

if (import.meta.main) {
  await write('ral-wells-fargo-capitol-center', 'Wells Fargo Capitol Center', build(), {
    bearing: 2, elevation: 0, height: 121.9,
    replaces: ['way/297829069'],
  })
}
