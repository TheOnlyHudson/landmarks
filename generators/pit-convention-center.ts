/**
 * David L. Lawrence Convention Center (2003, Rafael Viñoly), 1000 Fort
 * Duquesne Boulevard on the Allegheny riverfront, Pittsburgh — original
 * procedural geometry, CC0-1.0.
 * bun generators/pit-convention-center.ts
 *
 * Frame: x, y, z up, metres; origin at the anchor on the lowest ground under
 * the footprint (the riverside, ~1.2 m above lidar ground_min 216.3 m NAVD88,
 * which is the river surface). Anchor = area centroid of the OSM outline
 * way/171870223, -79.9962353 40.4456294. Bearing 341: the roof's bays and
 * its cables run along y, model +y points NNW to the river, +x ENE along
 * Fort Duquesne Boulevard toward the Strip District.
 *
 * Identity, in order: the great white roof, hung in catenary bays from a
 * row of tall white masts on its high south (Penn Avenue) edge, sagging
 * down toward the Allegheny; the skylight strips between its bays; the
 * masts standing far above it with their stays; the swoop's profile seen
 * at both glazed ends, the roof overhanging them; the riverfront facade's
 * leaning white struts and glass bands; the lower flat-roofed halls and
 * roof gardens behind on Penn Avenue.
 *
 * Evidence:
 *  - plan: OSM outline way/171870223 (and way/664168719, a building mapped
 *    inside its south-east wing), turned into this frame.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    1 m grid, read in this frame with tools/lidar_frame.py. The roof
 *    surface is a least-squares fit to the lidar of each roof section
 *    (rms 0.1 m): ~28 m at the river terrace rising to 44-51 m at its top
 *    edge (y -14), the east section higher. The ridge beam at y -28
 *    rises 47 -> 60 m west to east; fifteen masts at y -28, 18 m apart
 *    (x read from lidar peaks), tops to ~70 m. River terrace 27.9; the
 *    slot between the two roof sections (x 1..13) 28.0; the flat halls
 *    behind 22-40 m; the south-east wing 35.3.
 *  - USGS NAIP orthophoto (public domain): the two roof sections (8 + 6
 *    bays) with pale green-blue skylight strips between bays, the white
 *    terrace along the river, dark flat roofs and roof gardens behind.
 *  - published: Rafael Viñoly, opened 2003; cable-suspended roof
 *    (Wikipedia, "David L. Lawrence Convention Center").
 *  - photos (Wikimedia Commons, EVIDENCE):
 *    a "David L. Lawrence Convention Center, Pittsburgh, from a bridge 2006.jpg"
 *      https://commons.wikimedia.org/wiki/File:David_L._Lawrence_Convention_Center,_Pittsburgh,_from_a_bridge_2006.jpg
 *      Dmuth, CC BY-SA 3.0 — from upriver (east): the roof sweeping down.
 *    c "David L. Lawrence Convention Center from Heinz History Center.JPG"
 *      https://commons.wikimedia.org/wiki/File:David_L._Lawrence_Convention_Center_from_Heinz_History_Center.JPG
 *      Fredlyfish4, CC BY-SA 4.0 — the east end: swoop profile, glass end
 *      wall, masts and stays, the white boxes on Penn Avenue.
 *    d "ConventionCenterfromNorthside.jpg"
 *      https://commons.wikimedia.org/wiki/File:ConventionCenterfromNorthside.jpg
 *      TheZachMorrisExperience, CC BY-SA 3.0 — the river front: bays, masts
 *      in a row on the high edge, leaning struts, glass bands.
 *    e "Lawrence center river side jeh.jpg"
 *      https://commons.wikimedia.org/wiki/File:Lawrence_center_river_side_jeh.jpg
 *      Jim.henderson, CC BY 3.0 — the west corner, white diagonal frame.
 *    h "The David L. Lawrence Convention Center (53881482408).jpg"
 *      https://commons.wikimedia.org/wiki/File:The_David_L._Lawrence_Convention_Center_(53881482408).jpg
 *      Douglas Muth, CC BY-SA 2.0 — Penn Avenue: white panel walls, glass
 *      bands, masts and the ridge truss.
 *    i "Pittsburgh, David L. Lawrence Convention Center, U.S. Steel Tower - panoramio.jpg"
 *      https://commons.wikimedia.org/wiki/File:Pittsburgh,_David_L._Lawrence_Convention_Center,_U.S._Steel_Tower_-_panoramio.jpg
 *      phil.d.howard, CC BY 3.0 — the east end from the south-east.
 * Estimated: the masts' section (1.4 m) and single fore- and backstay
 *   each (the real ones fan out); the strut positions (one per bay line)
 *   and lean; the glass band heights on the river front (from photo d);
 *   the depth of the roof slab (1 m); the west end's diagonal frame as
 *   four white bars (photo e); the walls of the halls on Penn
 *   Avenue, kept to broad glass bands.
 * Doubts: the halls behind the roof are simplified to eight blocks; their
 *   heights are lidar, their walls are photographed only on Penn Avenue
 *   and the east end. The riverside road runs under the north edge; the
 *   model's base there is solid. The roof's real cables fan to several
 *   anchor points; drawn as one stay each way.
 * Left out: the fountain/water feature, railings, the stair towers on the
 *   terraces, signage, the pedestrian bridge.
 *
 * Night: the glass ends and bands glow (`window`); the skylights stay dark
 * (`glass`); the roof underside is washed by its floodlights.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, rect, save, walls, type XY } from './chi-aon-center'
import { rod } from './bridge-kit'

// Roof fits from lidar (heights above ground_min), +4.3 to this model's base.
const FIT = {
  W: [40.2141589, 0.0322573, -0.3571465, 0.0019131, -0.0002833, 3.7e-06, -2e-06],
  E: [40.2116859, 0.0384926, -0.3555884, 0.0019746, -0.0003897, 2.2e-06, -5e-07],
}
const zr = (x: number, y: number) => {
  const c = x < 7 ? FIT.W : FIT.E
  return c[0] + c[1] * x + c[2] * y + c[3] * y * y + c[4] * x * y + c[5] * y ** 3 + c[6] * x * y * y + 4.3
}
const TERR = 27.9 // river terrace and roof foot
const yf = (x: number) => 81 + (x + 149.3) * 0.132 // river facade line
const ye = (x: number) => yf(x) - 22 // where the roof meets the terrace
const YTOP = -14 // the halls' south wall under the roof's high edge
const ytop = (x: number) => -20 + ((x + 150) * 5) / 270 // the roof's high edge (lidar), overhanging the halls
const xE = (y: number) => 121 - (y - YTOP) * (11 / 128.6) // east end wall
const MASTS = [-130, -112, -94, -75, -57, -39, -21, -2, 16, 35, 52, 71, 89, 107, 126]

/** Walls along a→b with a top following top(x, y), split in n pieces. */
function wallTo(p: Part, a: XY, b: XY, z0: number, top: (x: number, y: number) => number, n: number) {
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n
    const p0: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
    const p1: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
    p.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], top(...p1)], [p0[0], p0[1], top(...p0)])
  }
}
/** A flat panel on a→b (outward normal to the right of a→b), its top following top(). */
function panelTo(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, top: (x: number, y: number) => number, n: number, out = 0.06) {
  const { P } = onWall(a, b)
  for (let i = 0; i < n; i++) {
    const sa = s0 + ((s1 - s0) * i) / n, sb = s0 + ((s1 - s0) * (i + 1)) / n
    const A = P(sa, 0, out), B = P(sb, 0, out)
    const ta = top(A[0], A[1]), tb = top(B[0], B[1])
    if (ta <= z0 + 0.5 && tb <= z0 + 0.5) continue
    p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], Math.max(z0, tb)], [A[0], A[1], Math.max(z0, ta)])
  }
}
function box(wall: Part, top: Part, r: [number, number, number, number], h: number) {
  const q = rect(...r)
  walls(wall, q, 0, h)
  cap(top, q, h)
}

function build() {
  const white = new Part(), wall = new Part(), win = new Part(), roof = new Part(), glass = new Part(), green = new Part()

  // ---- the halls under the roof: west and east sections and the slot
  const under = (x: number, y: number) => (y < ye(x) - 0.5 ? zr(x, y) - 1.0 : TERR)
  const west: XY[] = [[-149.5, YTOP], [1, YTOP], [1, yf(1)], [-149.5, yf(-149.5)]]
  const east: XY[] = [[13, YTOP], [xE(YTOP), YTOP], [xE(yf(110)), yf(110)], [13, yf(13)]]
  for (const r of [west, east]) {
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      wallTo(wall, a, b, 0, under, Math.max(1, Math.ceil(L / 6)))
    }
    // the terrace between the roof's foot and the river facade
    const xa = r[0][0], xb = r === west ? 1 : xE(ye(110))
    cap(white, [[xa, ye(xa)], [xb, ye(xb)], [xb, yf(xb)], [xa, yf(xa)]], TERR)
  }
  // the slot between the two roof sections
  {
    const s: XY[] = [[1, YTOP], [13, YTOP], [13, yf(13)], [1, yf(1)]]
    walls(wall, s, 0, 28.0); cap(roof, s, 28.0)
  }

  // the glazed ends under the swoop, the glass following the roof down
  {
    const aW: XY = [-149.5, yf(-149.5)], bW: XY = [-149.5, YTOP]
    const LW = Math.hypot(bW[0] - aW[0], bW[1] - aW[1])
    panelTo(win, aW, bW, 6, LW - 3, 6.5, (x, y) => under(x, y) - 2.0, 16)
    // the west end's white diagonal frame over the glass (photo e)
    const { P } = onWall(aW, bW)
    const ss = [6, 28, 50, 72, LW - 3]
    for (let i = 0; i < ss.length - 1; i++) {
      const lowFirst = i % 2 === 0
      const s0 = ss[i], s1 = ss[i + 1]
      const top = (s: number) => { const q = P(s, 0); return under(q[0], q[1]) - 2.0 }
      const z0 = lowFirst ? 6.5 : top(s0), z1 = lowFirst ? top(s1) : 6.5
      const w = 0.7
      white.quad(P(s0, z0 - w, 0.14), P(s1, z1 - w, 0.14), P(s1, z1 + w, 0.14), P(s0, z0 + w, 0.14))
    }
    const aE: XY = [xE(YTOP), YTOP], bE: XY = [xE(yf(110)), yf(110)]
    const LE = Math.hypot(bE[0] - aE[0], bE[1] - aE[1])
    panelTo(win, aE, bE, 3, LE - 6, 6.5, (x, y) => under(x, y) - 2.0, 16)
  }
  // the river front: plinth, two glass bands between white decks
  for (const [xa, xb] of [[-149.5, 1], [1, 13], [13, xE(yf(110))]] as [number, number][]) {
    const a: XY = [xb, yf(xb)], b: XY = [xa, yf(xa)]
    const { L } = onWall(a, b)
    const { P } = onWall(a, b)
    for (const [z0, z1] of [[8.0, 14.6], [16.6, 24.6]]) win.quad(P(1, z0, 0.06), P(L - 1, z0, 0.06), P(L - 1, z1, 0.06), P(1, z1, 0.06))
    // the white deck edges
    for (const z of [15.6, 26.2]) {
      const z0 = z - 0.9, z1 = z + 0.9, o = 1.2
      white.quad(P(0, z0, o), P(L, z0, o), P(L, z1, o), P(0, z1, o))
      white.quad(P(0, z1, o), P(L, z1, o), P(L, z1, 0), P(0, z1, 0))
      white.quad(P(0, z0, 0), P(L, z0, 0), P(L, z0, o), P(0, z0, o))
    }
  }
  // leaning white struts on the river front, one per bay line
  for (const x of [-149, ...MASTS.slice(0, 14), 112]) {
    const xx = Math.min(x, 109)
    const y = yf(xx)
    const foot: V3 = [xx, y - 3.5, 0], head: V3 = [xx, y + 3.0, TERR]
    const w = 0.8, d = 0.7
    const c = (p: V3, dx: number, dy: number): V3 => [p[0] + dx, p[1] + dy, p[2]]
    const f = [c(foot, -w, -d), c(foot, w, -d), c(foot, w, d), c(foot, -w, d)]
    const h = [c(head, -w, -d), c(head, w, -d), c(head, w, d), c(head, -w, d)]
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; white.quad(f[k], f[j], h[j], h[k]) }
  }

  // ---- the roof: hung bays, a 1 m slab, skylights on the cable lines
  const sections: number[][] = [[-152.5, -130, -112, -94, -75, -57, -39, -21, 1], [13, 35, 52, 71, 89, 107, 124]]
  const NY = 10, T = 1.0
  const xEdge = (x: number, y: number) => (x >= 124 ? 124 - (y - YTOP) * (11 / 128.6) : x) // east bay's slanted edge
  const pt = (x: number, t: number, dz = 0): V3 => {
    const y0 = ytop(x), y1 = ye(x)
    const y = y0 + (y1 - y0) * t
    const xx = xEdge(x, y)
    return [xx, y, zr(xx, y) + dz]
  }
  for (const sec of sections) {
    for (let i = 0; i < sec.length - 1; i++) {
      const xa = sec[i], xb = sec[i + 1]
      for (let k = 0; k < NY; k++) {
        const t0 = k / NY, t1 = (k + 1) / NY
        white.quad(pt(xa, t0), pt(xb, t0), pt(xb, t1), pt(xa, t1)) // top
        white.quad(pt(xa, t0, -T), pt(xa, t1, -T), pt(xb, t1, -T), pt(xb, t0, -T)) // underside
      }
    }
    // the section's ends, the high edge and the foot
    const x0 = sec[0], x1 = sec[sec.length - 1]
    for (let k = 0; k < NY; k++) {
      const t0 = k / NY, t1 = (k + 1) / NY
      white.quad(pt(x0, t1), pt(x0, t1, -T), pt(x0, t0, -T), pt(x0, t0))
      white.quad(pt(x1, t0), pt(x1, t0, -T), pt(x1, t1, -T), pt(x1, t1))
    }
    for (let i = 0; i < sec.length - 1; i++) {
      const xa = sec[i], xb = sec[i + 1]
      white.quad(pt(xa, 0, -T), pt(xb, 0, -T), pt(xb, 0), pt(xa, 0)) // high edge, facing -y
      const A = pt(xa, 1), B = pt(xb, 1)
      white.quad([B[0], B[1], TERR], [A[0], A[1], TERR], A, B) // foot, facing +y
    }
    // skylight strips on the inner cable lines
    for (const x of sec.slice(1, -1)) {
      for (let k = 0; k < NY; k++) {
        const t0 = k / NY, t1 = (k + 1) / NY
        const a0 = pt(x - 0.9, t0, 0.08), b0 = pt(x + 0.9, t0, 0.08), b1 = pt(x + 0.9, t1, 0.08), a1 = pt(x - 0.9, t1, 0.08)
        glass.quad(a0, b0, b1, a1)
      }
    }
  }

  // ---- the halls behind, on Penn Avenue (lidar heights)
  const blocks: [number, number, number, number, number, Part][] = [
    [-149.5, -28, 121, YTOP, 35.8, roof],
    [-149.5, -48, -15, -28, 40.5, roof],
    [-15, -48, 35, -28, 34.9, roof],
    [35, -48, 105, -28, 40.5, roof],
    [105, -48, 117, -28, 27.9, roof],
    [-149.5, -55, -35, -48, 32.3, roof],
    [-149.5, -73, -35, -55, 21.9, green],
    [-35, -75, 55, -48, 34.2, roof],
    [55, -75, 117, -48, 27.9, green],
  ]
  for (const [x0, y0, x1, y1, h, top] of blocks) box(wall, top, [x0, y0, x1, y1], h)
  // the south-east wing (and the building mapped inside it)
  const se: XY[] = [[51, -130], [155, -130], [155, -100], [144, -99], [133, -75], [51, -75]]
  walls(wall, se, 0, 35.3); cap(roof, se, 35.3)
  const strip: XY[] = [[117, -75], [133, -75], [117, -39]]
  walls(wall, strip, 0, 16.3); cap(roof, strip, 16.3)
  // glass bands on the Penn Avenue faces and the east faces
  const bandsOn = (a: XY, b: XY, rows: [number, number][]) => {
    const { L, P } = onWall(a, b)
    if (L < 8) return
    for (const [z0, z1] of rows) win.quad(P(2, z0, 0.06), P(L - 2, z0, 0.06), P(L - 2, z1, 0.06), P(2, z1, 0.06))
  }
  bandsOn([-149.5, -73], [-35, -73], [[8, 12], [14.5, 19]])
  bandsOn([-35, -75], [51, -75], [[8, 12], [17, 22], [26, 31]])
  bandsOn([51, -130], [155, -130], [[9, 14], [20, 25]])
  bandsOn([155, -130], [155, -100], [[9, 14], [20, 25]])
  bandsOn([-149.5, YTOP], [-149.5, -73], [[8, 12], [17, 22]])

  // ---- masts, ridge truss and stays
  const ridge = (x: number) => 47.1 + ((x + 150) / 276) * 12.9
  {
    // the ridge truss, a white beam along the mast line
    const a: V3 = [-150, -28, ridge(-150)], b: V3 = [126, -28, ridge(126)]
    const s = 0.8
    const r = [[-s, -s], [s, -s], [s, s], [-s, s]].map(([dy, dz]) => [[a[0], a[1] + dy, a[2] + dz], [b[0], b[1] + dy, b[2] + dz]] as [V3, V3])
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; white.quad(r[k][0], r[j][0], r[j][1], r[k][1]) }
  }
  for (const x of MASTS) {
    const z0 = 35.0, z1 = 70.0
    const lo = 0.7, hi = 0.4
    const q0: V3[] = [[x - lo, -28 - lo, z0], [x + lo, -28 - lo, z0], [x + lo, -28 + lo, z0], [x - lo, -28 + lo, z0]]
    const q1: V3[] = [[x - hi, -28 - hi, z1], [x + hi, -28 - hi, z1], [x + hi, -28 + hi, z1], [x - hi, -28 + hi, z1]]
    for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; white.quad(q0[k], q0[j], q1[j], q1[k]) }
    white.quad(q1[0], q1[1], q1[2], q1[3])
    const top: V3 = [x, -28, z1 - 1]
    const xs = Math.min(Math.max(x, -150), 120)
    rod(white, top, [xs, 25, zr(xs, 25) + 0.1], 0.3)
    rod(white, top, [x, -50, x < -35 ? 32.3 : 34.2], 0.3)
  }

  return [
    { part: white, material: { ...finish('roof-white', 0xdfe3e5), floodlight: (p: V3, n: V3) => (n[2] < -0.3 ? 0.7 : 0.15) } },
    { part: wall, material: finish('panel', 0xcfd3d5) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
    { part: green, material: finish('green-roof', 0x8f9c74) },
  ]
}

if (import.meta.main) await save('pit-convention-center', 'David L. Lawrence Convention Center', [40.4456294, -79.9962353], 341, build() as any, 6500)
