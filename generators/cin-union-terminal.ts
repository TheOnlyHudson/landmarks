/**
 * Cincinnati Union Terminal (1933, Fellheimer & Wagner, with Paul Philippe
 * Cret and Roland Wank), now the Cincinnati Museum Center — original
 * procedural geometry, CC0-1.0.
 * bun generators/cin-union-terminal.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Anchor -84.53748, 39.11001 (inside the OSM outline
 * way/27669543, by the rotunda). The building's axis runs at 4.6° / 94.6°
 * (OSM edges), so the catalog bearing is 4.6 and the great arch faces +x
 * (east, up the fountain axis), centred on y = -5.6.
 *
 * Identity, in order: the great arched front — a limestone face whose top
 * is a true semicircle, stepping down in three small steps to the flat
 * shoulders — with the recessed arched window wall of nine lights between
 * stone piers, the two tall central piers carrying the clock, the arch's
 * pale band, and the canopy over the entrances; the relief pylons either
 * side; the low curved wings sweeping forward around the plaza; behind,
 * the dark grey half-dome over the rotunda and the barrel roof in front of
 * it; the plain office blocks and Tower A at the back. Floodlit at night.
 *
 * Ground: the front plaza is 9.5 m above the lowest ground under the
 * footprint (the old track level behind, west): lidar ground and the
 * map's Mapterhorn terrain agree (plaza ~9.5–10, back ~0.5–2). Every wall
 * runs down to z = 0, so the east side sinks into the plaza's fill; all the
 * front's detail starts at the plaza, ZP = 9.5.
 *
 * Evidence:
 *  - plan: OSM outline way/27669543 and relation/3654546, and its parts
 *    (way/109081271 dome, 274541605–274541611 the arch block and its
 *    steps, 274542103/274542105 the relief pylons, 333015082 the canopy,
 *    274542106 Tower A, 274542107 the rotunda base and west block,
 *    274547508–274547518 the wings and back arms, 333015079–333015084).
 *    The wing and back-block rings are used as OSM draws them.
 *  - heights: measured, USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio
 *    statewide phase 3, ~2021 flight), 1 m grid read in the model frame,
 *    from the lowest ground: crown of the arch, barrel and dome 47; the
 *    shoulders 31 (21.5 over the plaza); relief pylons ~26–27; canopy
 *    14.5–16; wings 17.5; back arms 19–20; rotunda base and west block
 *    26–29 (27.5); Tower A 34; the low fillers by the dome 15.
 *  - the arch: the lidar cross-section of the barrel (x 6–18) and the
 *    dome's fall-off both fit one circle, radius 31.3 m centred 15.7 m up
 *    (crown 47); the dome is that circle turned about the rotunda's centre
 *    (x 4, y -5.6), meeting the 27.5 m base at radius 29. The face's steps
 *    and the window arch are measured off the head-on photo (CMC-Union
 *    Terminal.jpg) scaled by the lidar height of the crown over the plaza
 *    (37.5 m = 242 px): the arc ends 24.0 m off the axis, steps 3.1 m wide
 *    at 25.6 and 23.6 m over the plaza, flat shoulders at 21.4 m out to
 *    36.5 m (OSM: 36–37). Window band radius 21.5–23.6, concentric with the
 *    face; nine lights ~3.2 m with 1.6 m piers, the clock piers 2.2 m and
 *    rising to 31.3 m; clock 6.8 m across, centre 19.7 m over the plaza.
 *    Published: the rotunda's half-dome is 180 ft (55 m) wide and 106 ft
 *    (32 m) high inside (Wikipedia), which fits inside these figures.
 *  - colour: limestone from the daylight photos (#d8ccb4 sun) pulled to the
 *    palette (stone, a touch warmer); the dome and roofs grey from NAIP and
 *    the rear photo (Antony-22 2025a): the dome reads darker than the
 *    flat roofs.
 *
 * Photos (Wikimedia Commons), all EVIDENCE:
 *  - CMC-Union_Terminal.jpg, Ɱ, CC BY-SA 4.0 (head-on from the east)
 *    https://commons.wikimedia.org/wiki/File:CMC-Union_Terminal.jpg
 *  - Cincinnati_Union_Terminal_principal_facade.jpg, Dacoslett, CC BY-SA 3.0
 *    (from the south-east) https://commons.wikimedia.org/wiki/File:Cincinnati_Union_Terminal_principal_facade.jpg
 *  - Cincinnati_Union_Terminal_2025a.jpg, Antony-22, CC BY-SA 4.0 (the back,
 *    from the south-west, over the tracks) https://commons.wikimedia.org/wiki/File:Cincinnati_Union_Terminal_2025a.jpg
 *  - Cincinnati_Union_Terminal_at_night.jpg, Hhelvey, CC BY-SA 4.0 (night,
 *    from the east) https://commons.wikimedia.org/wiki/File:Cincinnati_Union_Terminal_at_night.jpg
 *  - USGS NAIP orthophoto (public domain) for the plan and roof colours.
 * No commercial imagery.
 *
 * Doubts: the back blocks' windows are a generic grouped rhythm from the one
 * rear photo; the outer (convex) sides of the wings and the north side are
 * unphotographed, and their lower walls are left plain. OSM gives two back
 * parts (274547509, 274547512, 274547517) min_height 4, an underpass at the
 * old track level; they are drawn solid. Left out: the fountain and plaza
 * (ground), the lamp pylons along the plaza, the relief sculpture, the
 * dentils of the arch band and the dome's ribs.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, bays, save, triangulate, type XY } from './chi-aon-center'

const ZP = 9.5 // the front plaza over the lowest ground
const YC = -5.6 // the arch's axis
const FX = 22.5 // the face of the great arch
const BX = 4 // the rotunda's centre; the barrel runs FX..BX, the dome west of it
const RS = 31.3, ZC = 15.7 // the arch circle: radius and centre height
const arcZ = (d: number) => ZC + Math.sqrt(Math.max(0, RS * RS - d * d))

/** A quad with a known outward normal; `tri` winds it to agree. */
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const N = (Array.isArray(n[0]) ? n : [n, n, n, n]) as V3[]
  p.tri(a, b, c, undefined, undefined, undefined, [N[0], N[1], N[2]])
  p.tri(a, c, d, undefined, undefined, undefined, [N[0], N[2], N[3]])
}

/** A flat polygon in the (y, z) plane at x, facing +x (dir 1) or -x (dir -1). */
function yzCap(p: Part, poly: XY[], x: number, dir: 1 | -1) {
  const n: V3 = [dir, 0, 0]
  for (const [a, b, c] of triangulate(poly)) {
    const P = (k: number): V3 => [x, poly[k][0], poly[k][1]]
    p.tri(P(a), P(b), P(c), undefined, undefined, undefined, [n, n, n])
  }
}

/** A box proud of the face: y0..y1, z0..z1, from x0 out to x1 (front, sides, top, bottom). */
function relief(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  quadN(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  quadN(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  quadN(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  quadN(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  quadN(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
}

/** Outward-facing edges of a ring whose normal looks toward `to`. */
function facing(r: XY[], to: XY, min = 0.45, minLen = 3.5): XY[][] {
  const out: XY[][] = []
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minLen) return
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const t: XY = [to[0] - m[0], to[1] - m[1]], tl = Math.hypot(t[0], t[1])
    if ((n[0] * t[0] + n[1] * t[1]) / tl > min) out.push([a, b])
  })
  return out
}

// OSM rings in the model frame (counter-clockwise), from tools/osm.py.
const WING_N_10: XY[] = [[5.9, 37.8], [5.2, 29.7], [22.8, 30.0], [27.7, 29.8], [27.9, 33.9], [29.2, 37.9], [31.2, 41.4], [33.7, 44.4], [36.8, 46.3], [40.7, 47.6], [44.6, 48.3], [49.0, 48.3], [51.6, 61.2], [48.5, 61.9], [43.9, 62.0], [38.3, 61.5], [33.4, 59.7], [28.6, 57.5], [25.6, 55.4], [21.0, 51.2], [18.3, 47.8], [16.5, 44.2], [15.2, 40.8], [14.0, 38.0]]
const WING_N_7: XY[] = [[48.5, 61.9], [49.8, 70.5], [47.0, 70.8], [44.4, 71.0], [38.4, 70.4], [33.5, 68.9], [28.1, 66.8], [22.6, 63.7], [17.8, 60.0], [14.0, 55.6], [10.3, 50.7], [8.2, 46.4], [6.6, 41.5], [5.9, 37.8], [14.0, 38.0], [15.2, 40.8], [16.5, 44.2], [18.3, 47.8], [21.0, 51.2], [25.6, 55.4], [28.6, 57.5], [33.4, 59.7], [38.3, 61.5], [43.9, 62.0]]
const WING_N_4: XY[] = [[5.9, 37.8], [6.6, 41.5], [8.2, 46.4], [10.3, 50.7], [14.0, 55.6], [17.8, 60.0], [22.6, 63.7], [28.1, 66.8], [33.5, 68.9], [38.4, 70.4], [44.4, 71.0], [47.0, 70.8], [47.5, 75.3], [47.8, 77.7], [40.9, 78.2], [34.9, 77.4], [29.8, 76.3], [24.2, 74.0], [18.0, 70.4], [13.5, 67.0], [9.0, 62.3], [5.6, 58.2], [2.3, 52.9], [0.2, 48.3], [-1.4, 43.0], [-2.0, 37.6]]
const WING_S_10: XY[] = [[22.9, -43.0], [5.3, -42.8], [5.3, -37.2], [2.1, -37.1], [-1.9, -36.3], [-6.6, -34.5], [-6.7, -37.2], [-27.1, -37.2], [-27.2, -25.6], [-45.9, -25.7], [-46.0, -31.3], [-45.6, -63.5], [-27.1, -63.9], [-27.0, -50.8], [-2.6, -50.3], [5.3, -50.1], [14.6, -49.9], [16.8, -55.4], [19.1, -59.7], [22.1, -63.9], [26.0, -67.5], [29.2, -69.7], [33.8, -71.7], [39.1, -73.2], [43.8, -73.8], [48.4, -73.6], [52.4, -73.1], [48.9, -59.3], [44.3, -60.0], [40.5, -59.7], [36.9, -58.3], [33.6, -56.6], [31.0, -53.6], [29.0, -50.3], [27.7, -46.5], [27.7, -43.0]]
const WING_S_7: XY[] = [[43.8, -73.8], [39.1, -73.2], [33.8, -71.7], [29.2, -69.7], [26.0, -67.5], [22.1, -63.9], [19.1, -59.7], [16.8, -55.4], [14.6, -49.9], [5.3, -50.1], [6.5, -55.5], [9.8, -62.6], [13.5, -67.1], [16.9, -71.1], [21.4, -75.1], [26.4, -78.1], [31.0, -80.5], [37.0, -82.1], [42.7, -82.8], [47.3, -83.1], [50.3, -82.6], [48.4, -73.6]]
const WING_S_4: XY[] = [[42.7, -82.8], [37.0, -82.1], [31.0, -80.5], [26.4, -78.1], [21.4, -75.1], [16.9, -71.1], [13.5, -67.1], [9.8, -62.6], [6.5, -55.5], [5.3, -50.1], [-2.6, -50.3], [-1.5, -56.0], [0.8, -61.7], [3.7, -66.9], [7.3, -71.9], [11.5, -76.3], [16.3, -80.8], [21.8, -84.4], [27.5, -87.0], [33.5, -88.8], [40.4, -90.3], [47.6, -90.4], [47.4, -87.8], [47.3, -83.1]]
const BACK_509: XY[] = [[-46.3, 18.6], [-62.0, 18.7], [-78.2, 19.3], [-80.7, 19.3], [-79.5, 6.1], [-59.9, 5.7], [-46.2, 5.7], [-46.2, 12.0]]
const BACK_510: XY[] = [[5.2, 26.0], [5.2, 29.7], [5.9, 37.8], [-2.0, 37.6], [-27.3, 37.9], [-26.8, 51.1], [-45.9, 50.9], [-46.3, 18.6], [-46.2, 12.0], [-27.3, 12.0], [-27.4, 25.4], [-6.0, 25.3], [-5.6, 23.5], [-1.0, 25.1], [3.5, 25.9]]
const BACK_512: XY[] = [[-59.7, -20.2], [-59.6, -13.5], [-60.8, -11.5], [-61.7, -8.9], [-61.7, -6.3], [-61.3, -4.1], [-60.7, -2.2], [-59.8, -0.5], [-59.9, 5.7], [-79.5, 6.1], [-77.0, -20.1]]
const BACK_517: XY[] = [[-46.0, -31.3], [-45.9, -25.7], [-45.9, -20.0], [-59.7, -20.2], [-77.0, -20.1], [-75.9, -31.5], [-73.7, -31.5], [-58.0, -31.2], [-55.2, -31.3]]
const TOWER_A: XY[] = [[-59.8, -0.5], [-60.7, -2.2], [-61.3, -4.1], [-61.7, -6.3], [-61.7, -8.9], [-60.8, -11.5], [-59.6, -13.5], [-59.7, -20.2], [-45.9, -20.0], [-43.5, -19.9], [-43.6, 5.6], [-46.2, 5.7], [-59.9, 5.7]]
const BASE_107: XY[] = [[-45.9, -20.0], [-45.9, -25.7], [-27.2, -25.6], [-26.9, -18.8], [-22.2, -18.9], [-21.3, -20.9], [-18.7, -24.8], [-15.1, -28.8], [-11.2, -32.0], [-6.6, -34.5], [-1.9, -36.3], [2.1, -37.1], [5.3, -37.2], [5.3, -34.2], [5.3, -31.3], [5.2, 20.2], [5.2, 23.3], [5.2, 26.0], [3.5, 25.9], [-1.0, 25.1], [-5.6, 23.5], [-9.5, 21.6], [-13.4, 18.9], [-16.4, 16.1], [-19.0, 13.0], [-21.1, 9.7], [-22.9, 6.0], [-27.3, 6.1], [-27.3, 12.0], [-46.2, 12.0], [-46.2, 5.7]]
const LOW_515: XY[] = [[-27.1, -37.2], [-6.7, -37.2], [-6.6, -34.5], [-11.2, -32.0], [-15.1, -28.8], [-18.7, -24.8], [-21.3, -20.9], [-22.2, -18.9], [-26.9, -18.8], [-27.2, -25.6]]
const LOW_079: XY[] = [[-27.4, 25.4], [-27.3, 12.0], [-27.3, 6.1], [-22.9, 6.0], [-21.1, 9.7], [-19.0, 13.0], [-16.4, 16.1], [-13.4, 18.9], [-9.5, 21.6], [-5.6, 23.5], [-6.0, 25.3]]
const WEST_STRIPS: [XY[], number][] = [
  [[[-78.2, 19.3], [-79.4, 32.9], [-82.1, 32.7], [-80.7, 19.3]], 7],
  [[[-79.4, 32.9], [-80.4, 44.4], [-83.3, 44.2], [-82.1, 32.7]], 7],
  [[[-80.4, 44.4], [-81.4, 55.4], [-84.4, 55.0], [-83.3, 44.2]], 6],
  [[[-81.4, 55.4], [-82.6, 68.0], [-85.7, 67.8], [-84.4, 55.0]], 4],
]

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), dome = new Part(), door = new Part()

  // ---- The great arch block: the face's profile pushed back from FX to BX.
  const S3 = 24.0, S2 = 27.1, S1 = 30.2, S0 = 36.5
  const H2 = ZP + 25.6, H1 = ZP + 23.6, H0 = ZP + 21.4
  const arc: XY[] = []
  const a0 = Math.acos(S3 / RS), SEG = 16
  for (let i = 0; i <= SEG; i++) {
    const t = a0 + (Math.PI - 2 * a0) * (i / SEG)
    arc.push([YC + RS * Math.cos(t), ZC + RS * Math.sin(t)])
  }
  // Counter-clockwise in (y, z): along the bottom, up the north end, over the top.
  const profile: XY[] = [
    [YC - S0, 0], [YC + S0, 0], [YC + S0, H0], [YC + S1, H0], [YC + S1, H1], [YC + S2, H1], [YC + S2, H2], [YC + S3, H2],
    ...arc,
    [YC - S3, H2], [YC - S2, H2], [YC - S2, H1], [YC - S1, H1], [YC - S1, H0], [YC - S0, H0],
  ]
  yzCap(stone, profile, FX, 1)
  yzCap(stone, profile, BX, -1)
  for (let i = 1; i < profile.length; i++) {
    const [y0, z0] = profile[i], [y1, z1] = profile[(i + 1) % profile.length]
    if (z0 === 0 && z1 === 0) continue
    const dy = y1 - y0, dz = z1 - z0, L = Math.hypot(dy, dz)
    const n: V3 = [0, dz / L, -dy / L]
    const onArc = i >= 8 && i < 8 + SEG
    const part = onArc ? dome : Math.abs(dz) < 1e-6 ? roof : stone
    if (onArc) {
      // smooth: normals point away from the arch centre
      const N = (y: number, z: number): V3 => { const l = Math.hypot(y - YC, z - ZC); return [0, (y - YC) / l, (z - ZC) / l] }
      quadN(part, [FX, y0, z0], [FX, y1, z1], [BX, y1, z1], [BX, y0, z0], [N(y0, z0), N(y1, z1), N(y1, z1), N(y0, z0)])
    } else quadN(part, [FX, y0, z0], [FX, y1, z1], [BX, y1, z1], [BX, y0, z0], n)
  }

  // ---- The window wall inside the arch: nine lights between stone piers.
  const RW = 21.5, RB = 23.6, ZW0 = ZP + 5.5
  {
    const poly: XY[] = [[YC - RW, ZW0], [YC + RW, ZW0]]
    for (let i = 0; i <= 14; i++) { const t = (Math.PI * i) / 14; poly.push([YC + RW * Math.cos(t), ZC + RW * Math.sin(t)]) }
    yzCap(win, poly, FX + 0.05, 1)
  }
  // The band round the window, proud of the face.
  {
    const n = 16, out = 0.3
    for (let i = 0; i < n; i++) {
      const t0 = (Math.PI * i) / n, t1 = (Math.PI * (i + 1)) / n
      const P = (r: number, t: number, dx: number): V3 => [FX + dx, YC + r * Math.cos(t), ZC + r * Math.sin(t)]
      quadN(trim, P(RW, t0, out), P(RB, t0, out), P(RB, t1, out), P(RW, t1, out), [1, 0, 0])
      const No = (t: number): V3 => [0, Math.cos(t), Math.sin(t)]
      quadN(trim, P(RB, t0, 0), P(RB, t1, 0), P(RB, t1, out), P(RB, t0, out), [No(t0), No(t1), No(t1), No(t0)])
      const Ni = (t: number): V3 => [0, -Math.cos(t), -Math.sin(t)]
      quadN(trim, P(RW, t0, 0), P(RW, t1, 0), P(RW, t1, out), P(RW, t0, out), [Ni(t0), Ni(t1), Ni(t1), Ni(t0)])
    }
    // its feet down to the canopy
    for (const s of [-1, 1]) relief(trim, FX, FX + 0.3, YC + s * RW - (s > 0 ? 0 : RB - RW), YC + s * RW + (s > 0 ? RB - RW : 0), ZW0, ZC)
  }
  // Piers: [inner, outer] distance from the axis.
  const LIGHT = 3.2, PIER = 1.6
  let y = 1.6 + 2.2
  const piers: [number, number][] = []
  for (let k = 0; k < 3; k++) { y += LIGHT; piers.push([y, y + PIER]); y += PIER }
  for (const s of [-1, 1]) {
    for (const [d0, d1] of piers) {
      const top = ZC + Math.sqrt(RW * RW - d1 * d1) - 0.2
      relief(stone, FX, FX + 0.4, YC + Math.min(s * d0, s * d1), YC + Math.max(s * d0, s * d1), ZW0, top)
    }
    // the clock piers, up through the band
    relief(stone, FX, FX + 0.5, YC + Math.min(s * 1.6, s * 3.8), YC + Math.max(s * 1.6, s * 3.8), ZW0, ZP + 31.3)
  }
  // The clock: a pale face in a dark ring, standing proud of the central light.
  {
    const cz = ZP + 19.7, r = 4.1, n = 16, dx = FX + 0.8
    for (let i = 0; i < n; i++) {
      const t0 = (2 * Math.PI * i) / n, t1 = (2 * Math.PI * (i + 1)) / n
      const P = (rr: number, t: number, x: number): V3 => [x, YC + rr * Math.cos(t), cz + rr * Math.sin(t)]
      door.tri([dx, YC, cz], P(r * 0.7, t0, dx), P(r * 0.7, t1, dx), undefined, undefined, undefined, [[1, 0, 0], [1, 0, 0], [1, 0, 0]])
      quadN(win, P(r * 0.7, t0, dx), P(r * 0.86, t0, dx), P(r * 0.86, t1, dx), P(r * 0.7, t1, dx), [1, 0, 0])
      quadN(trim, P(r * 0.86, t0, dx), P(r, t0, dx), P(r, t1, dx), P(r * 0.86, t1, dx), [1, 0, 0])
      const No = (t: number): V3 => [0, Math.cos(t), Math.sin(t)]
      quadN(trim, P(r, t0, FX + 0.5), P(r, t1, FX + 0.5), P(r, t1, dx), P(r, t0, dx), [No(t0), No(t1), No(t1), No(t0)])
    }
  }
  // A stone coping along the arch's top, so the arch reads from above too.
  {
    const CD = 3.0, CT = 0.45
    for (let i = 0; i < arc.length - 1; i++) {
      const [y0, z0] = arc[i], [y1, z1] = arc[i + 1]
      const N = (y: number, z: number): V3 => { const l = Math.hypot(y - YC, z - ZC); return [0, (y - YC) / l, (z - ZC) / l] }
      const up = (y: number, z: number): XY => { const n = N(y, z); return [y + n[1] * CT, z + n[2] * CT] }
      const [u0y, u0z] = up(y0, z0), [u1y, u1z] = up(y1, z1)
      quadN(stone, [FX, u0y, u0z], [FX, u1y, u1z], [FX - CD, u1y, u1z], [FX - CD, u0y, u0z], [N(y0, z0), N(y1, z1), N(y1, z1), N(y0, z0)])
      quadN(stone, [FX, y0, z0], [FX, y1, z1], [FX, u1y, u1z], [FX, u0y, u0z], [1, 0, 0])
      quadN(stone, [FX - CD, y0, z0], [FX - CD, y1, z1], [FX - CD, u1y, u1z], [FX - CD, u0y, u0z], [-1, 0, 0])
    }
  }

  // ---- Canopy over the entrances, and the doors under it.
  const CY0 = YC - 26.5, CY1 = YC + 26.5
  relief(roof, FX, 27.7, CY0, CY1, ZP + 4.5, ZP + 5.2)
  quadN(win, [FX + 0.05, CY0 + 1, ZP], [FX + 0.05, CY1 - 1, ZP], [FX + 0.05, CY1 - 1, ZP + 4.2], [FX + 0.05, CY0 + 1, ZP + 4.2], [1, 0, 0])
  for (const s of [-1, 1]) for (const d of [8, 17]) relief(stone, 26.9, 27.5, YC + s * d - 0.3, YC + s * d + 0.3, ZP, ZP + 4.4)

  // ---- Relief pylons either side of the arch, standing forward of the face.
  for (const s of [-1, 1]) {
    const y0 = YC + Math.min(s * 26.5, s * 36.5), y1 = YC + Math.max(s * 26.5, s * 36.5)
    block(stone, roof, [[FX - 0.5, y0], [27.8, y0], [27.8, y1], [FX - 0.5, y1]], 0, ZP + 16.2, 0.4)
    block(stone, roof, [[FX, y0 + 1.2], [27.2, y0 + 1.2], [27.2, y1 - 1.2], [FX, y1 - 1.2]], ZP + 16.2, ZP + 17.6, 0.3)
    // the carved panel, a shallow pale recess on the front
    quadN(trim, [27.85, y0 + 1.6, ZP + 6], [27.85, y1 - 1.6, ZP + 6], [27.85, y1 - 1.6, ZP + 15.2], [27.85, y0 + 1.6, ZP + 15.2], [1, 0, 0])
  }

  // ---- The half-dome: the arch circle turned about the rotunda's centre.
  {
    const RD = 29, rings = 9, seg = 14
    const prof: XY[] = Array.from({ length: rings + 1 }, (_, i) => { const d = (RD * i) / rings; return [d, arcZ(d)] as XY })
    const nrm = (d: number, t: number): V3 => {
      const z = arcZ(d) - ZC, l = Math.hypot(d, z)
      return [(d / l) * Math.cos(t), (d / l) * Math.sin(t), z / l]
    }
    for (let k = 0; k < seg; k++) {
      const t0 = Math.PI / 2 + (Math.PI * k) / seg, t1 = Math.PI / 2 + (Math.PI * (k + 1)) / seg
      const P = ([d, z]: XY, t: number): V3 => [BX + d * Math.cos(t), YC + d * Math.sin(t), z]
      for (let i = 0; i < rings; i++) {
        const A = P(prof[i], t0), B = P(prof[i], t1), C = P(prof[i + 1], t1), D = P(prof[i + 1], t0)
        const nA = nrm(prof[i][0], t0), nB = nrm(prof[i][0], t1), nC = nrm(prof[i + 1][0], t1), nD = nrm(prof[i + 1][0], t0)
        if (i > 0) dome.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
        dome.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
      }
    }
  }
  // The rotunda's base and the west block, 27.5 m; the dome rises out of its roof.
  block(stone, roof, BASE_107, 0, 27.5, 0.4)
  block(stone, roof, TOWER_A, 0, 34, 0.4)
  block(stone, roof, LOW_515, 0, 15, 0.3)
  block(stone, roof, LOW_079, 0, 15, 0.3)
  for (const r of [BACK_509, BACK_510, BACK_512, BACK_517]) block(stone, roof, r, 0, 19.5, 0.4)
  for (const [r, h] of WEST_STRIPS) block(stone, roof, r, 0, h, 0.2)

  // ---- The wings, curving forward round the plaza.
  for (const [r, h] of [[WING_N_10, ZP + 8], [WING_N_7, ZP + 6], [WING_N_4, ZP + 4], [WING_S_10, ZP + 8], [WING_S_7, ZP + 6], [WING_S_4, ZP + 4]] as [XY[], number][])
    block(stone, roof, r, 0, h, 0.35)

  // ---- Windows.
  const panelOn = (a: XY, b: XY, rows: [number, number][], bay: number, gap: number, end: number, out = 0.05) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const use = L - 2 * end, k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
    if (use < bay * 0.6) return
    for (let q = 0; q < k; q++) {
      const s0 = end + q * (w + gap), s1 = s0 + w
      const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
      for (const [z0, z1] of rows) quadN(win, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), [n[0], n[1], 0])
    }
  }
  // Wing fronts facing the plaza: two storeys of tall windows.
  const PLAZA: XY = [80, YC]
  for (const r of [WING_N_10, WING_S_10])
    for (const [a, b] of facing(r, PLAZA, 0.35, 3.5)) panelOn(a, b, [[ZP + 1.0, ZP + 3.4], [ZP + 4.4, ZP + 6.8]], 1.6, 2.2, 0.9)
  // The back blocks: grouped storeys.
  const lowRows: [number, number][] = [[2.5, 7], [8.5, 12.5], [14, 18]]
  bays(win, BACK_509, lowRows, { bay: 2.4, gap: 2.0, end: 1.5, minLen: 7 })
  bays(win, BACK_512, lowRows, { bay: 2.4, gap: 2.0, end: 1.5, minLen: 7 })
  bays(win, BACK_517, lowRows, { bay: 2.4, gap: 2.0, end: 1.5, minLen: 7 })
  bays(win, BACK_510, lowRows, { bay: 2.4, gap: 2.0, end: 1.5, minLen: 9 })
  bays(win, TOWER_A, [...lowRows, [20, 25], [27, 32]], { bay: 2.2, gap: 1.8, end: 1.5, minLen: 7 })
  // the west block's long faces over the arms
  for (const [a, b] of facing(BASE_107, [-80, YC], 0.5, 6)) panelOn(a, b, [[20.5, 26]], 2.2, 1.8, 1.5)

  // Night: the front is floodlit, brightest low on the face; roofs barely.
  const flood = (p: V3, n: V3) => (p[0] > 20 && n[0] > 0.5 ? 0.9 : p[0] > 20 && n[2] < 0.7 && p[2] > ZP ? 0.4 : 0)
  return [
    { part: stone, material: { ...finish('ut-limestone', 0xeadcc4), floodlight: flood } },
    { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: dome, material: finish('ut-dome', 0x80888e) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('cin-union-terminal', 'Cincinnati Union Terminal', [39.11001, -84.53748], 4.6, build(), 6500)
