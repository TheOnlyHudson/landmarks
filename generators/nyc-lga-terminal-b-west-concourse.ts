/**
 * LaGuardia Airport Terminal B, Western Concourse (gates 10–31), with its
 * jet bridges — procedural, CC0-1.0, no textures.
 * bun generators/nyc-lga-terminal-b-west-concourse.ts
 *
 * Also the shared kit for nyc-lga-terminal-b-east-concourse, which imports
 * `concourse` from here. The model is only written when this file is run.
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0, as the headhouse
 * model (nyc-lga-terminal-b). Anchor: area centroid of the OSM outline
 * way/677731265, -73.8726371, 40.7755292. OSM is put in this frame at the
 * map's own scale (MapLibre, 111,195 m per degree of latitude), so the
 * outline lands on the map's OSM.
 *
 * Identifying features:
 *  1. A long, bent gate pier: a 125 m bar running west from the West
 *     Pedestrian Bridge and a squarer 45 m block turning north-east, flat
 *     white roof cut into sections by raised joints (NAIP 2024).
 *  2. Its upper storey all glass, a tall gate hall over the apron level of
 *     pale panels, under a thin pale roof edge (night photos 01/02, Irving
 *     Farm interior photo for the full-height glazing).
 *  3. The West Pedestrian Bridge landing on its south side, high above the
 *     apron (the bridge itself is nyc-lga-terminal-b's).
 *  4. A ring of jet bridges: a fixed link off the wall to a rotunda, then a
 *     telescoping tunnel on a wheeled leg out to the aircraft door (OSM
 *     aeroway=jet_bridge, NAIP 2024, Simply Aviation gate photo).
 *
 * Evidence
 * - OSM way/677731265 (Western Concourse, aeroway=terminal, no height) as
 *   mapped; it matches the NAIP 2024 roof within a metre or two. Its three
 *   nodes on the bridge end are moved onto the end of the bridge as the
 *   headhouse model draws it (that model used 110,540 m per degree of
 *   latitude, so its bridge ends 1.3 m short of OSM here); the concourse wall
 *   and the bridge end then meet exactly.
 * - OSM jet bridges (aeroway=jet_bridge, highway=footway, level 2):
 *   way/719465267, 719465269, 719465270, 719973808, 719973809, 803064896,
 *   1132718323, 1132718336, 1132718338–1132718346. Each runs from a node on
 *   the outline to the aircraft door: the segments before the longest are
 *   the fixed link, the longest is the tunnel from the rotunda, the short
 *   last one the cab.
 * - USDA NAIP, flown 2024-09-13, 0.6 m, tile m_4007310_sw_18_060_20240913
 *   (public domain; read from the Microsoft Planetary Computer copy, since
 *   tools/usgs.py's NAIP Plus service only has 2019 here, when this
 *   concourse was still being built): the plan, the white roof and its
 *   joints, the fixed links and rotundas, and shadows. Sun scale from a
 *   narrow-body's fin (about 12 m, its tailplane checked at 13.5 m across):
 *   shadow about 9.8 m, 0.8 of height, falling a little east of north. The
 *   concourse's north wall throws 15–16 m of shadow (about 19–20 m tall);
 *   the Eastern Concourse's north-east wall gives about 23 m. Roof 22.5 m
 *   used, inside that range.
 * - Photos (Wikimedia Commons):
 *   "View of LaGuardia Airport (October 2023) 01" and "02" (DiscoA340,
 *   CC BY-SA 4.0): gate 26 at the north-east end and the Eastern Concourse
 *   at night — the glazed gate hall over a pale apron storey, a thin roof
 *   edge with a rail, jet bridges at about the glazing's sill.
 *   "08-JUL-2022 - UA5546 LGA-ORD (E175 - N89349) (01)" (Simply Aviation,
 *   CC BY 4.0): a jet bridge at gate 46, light grey corrugated tunnel, cab
 *   and stair, wheel bogie.
 *   "Terminal B at LaGuardia Airport (1)" (Simply Aviation, CC BY 4.0): the
 *   gate hall inside, full-height glazing between tall white columns.
 * - Lidar: USGS NY_NewYorkCity was flown in 2017, before this concourse was
 *   built (opened 2020; the old terminal's piers stood here). Not used.
 * - Published: Western Concourse opened 2020 (Wikipedia, "LaGuardia
 *   Airport"); HOK, for LaGuardia Gateway Partners.
 *
 * Estimated: every height. Roof 22.5 m (shadow, above); the apron storey
 * 0–7.8 m and the glazing 7.8–20.8 m, from the night photos against the jet
 * bridges; jet bridges with the fixed link at 4.6–7.6 m, tunnels 2.8 m tall
 * falling to a 3.7 m floor at the cab (typical narrow-body bridges; photo).
 * Invented: the bridge landing — the headhouse model keeps its bridge level
 * at 20.1–29.6 m (OSM) all the way, above this roof, so a glazed head the
 * width of the bridge carries it 6 m into the concourse to the bridge's roof.
 * NAIP shows no such step's shadow on the roof: the real bridge probably
 * comes down to the roof at its end. Doubts: the roof height (no measured
 * height exists); the apron storey's openings (no daylight airside photo);
 * the rooftop plant and skylights are left off; the low service blocks at
 * some fixed links (not in OSM) are left off.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant, finish } from './palette'
import { type XY, capPoly, finishModel, facade, area, inside, unit, type Facade } from './nyc-570-lexington'
import { clip } from './nyc-jfk-terminal-5'

// The headhouse model's bridges (nyc-lga-terminal-b.ts), so the pieces meet.
export const BRIDGE = { B0: 20.12, B1: 29.57, BG0: 21.4, BG1: 27.6 }

const H = 22.5, GLASS0 = 7.8, GLASS1 = 20.8 // roof, gate-hall glazing
const JB = { floor: 4.6, top: 7.6, cabFloor: 3.7, tunnelH: 2.8, linkW: 4.0, tunnelW: 2.8, cabW: 3.4 }
const ccw = (r: XY[]) => (area(r) < 0 ? r.slice().reverse() : r)
const d2 = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

/** A solid with a 4-corner bottom and top, counter-clockwise from above; all six faces. */
function solid(p: Part, b: V3[], t: V3[]) {
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; p.quad(b[i], b[j], t[j], t[i]) }
  p.quad(t[0], t[1], t[2], t[3]); p.quad(b[3], b[2], b[1], b[0])
}
/** A box along a→b, width w, floor and roof heights at each end (sloping allowed). */
function beam(p: Part, a: XY, b: XY, w: number, za0: number, za1: number, zb0: number, zb1: number) {
  const L = d2(a, b); if (L < 0.05) return
  const n: XY = [-(b[1] - a[1]) / L * w / 2, (b[0] - a[0]) / L * w / 2]
  const c: XY[] = [[a[0] - n[0], a[1] - n[1]], [b[0] - n[0], b[1] - n[1]], [b[0] + n[0], b[1] + n[1]], [a[0] + n[0], a[1] + n[1]]]
  const lo = [za0, zb0, zb0, za0], hi = [za1, zb1, zb1, za1]
  solid(p, c.map((q, i) => [q[0], q[1], lo[i]] as V3), c.map((q, i) => [q[0], q[1], hi[i]] as V3))
}
/** A square post centred on c. */
const post = (p: Part, c: XY, s: number, z0: number, z1: number) =>
  solid(p, [[c[0] - s, c[1] - s, z0], [c[0] + s, c[1] - s, z0], [c[0] + s, c[1] + s, z0], [c[0] - s, c[1] + s, z0]],
    [[c[0] - s, c[1] - s, z1], [c[0] + s, c[1] - s, z1], [c[0] + s, c[1] + s, z1], [c[0] - s, c[1] + s, z1]])
/** A prism on a ring with sides, top and bottom. */
function prismAll(p: Part, ring: XY[], z0: number, z1: number) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]) }
  capPoly(p, r, z1); capPoly(p, r, z0, false)
}
/** Coping lip round a ring (as the headhouse model's), skipping edges `skip` says. */
function lipRing(p: Part, ring: XY[], z0: number, z1: number, d: number, skip: (a: XY, b: XY) => boolean = () => false) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = d2(a, b); if (L < 1e-6 || skip(a, b)) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const A: XY = [a[0] + n[0] * d, a[1] + n[1] * d], B: XY = [b[0] + n[0] * d, b[1] + n[1] * d]
    p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
    p.quad([A[0], A[1], z1], [B[0], B[1], z1], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

export type ConcourseSpec = {
  id: string; name: string; osm: string
  /** OSM outline in this frame. */
  ring: XY[]
  /** The headhouse model's bridge end, as drawn, in this frame, in its ring order: three points. */
  bridgeEnd: [XY, XY, XY]
  /** Unit vector along the bridge, pointing into the concourse. */
  bridgeAxis: XY
  /** Raised roof joints, as segments. */
  joints: [XY, XY][]
  /** OSM jet bridges, from the wall outwards. */
  jetBridges: [string, XY[]][]
}

export function concourse(s: ConcourseSpec) {
  const wall = new Part(), win = new Part(), roof = new Part(), trim = new Part(), bglass = new Part(), jet = new Part()

  // --- The outline, with its bridge-end nodes moved onto the bridge as drawn ---
  const ring = ccw(s.ring.map((p) => {
    const q = s.bridgeEnd.find((e) => d2(e, p) < 2.5)
    return q ? ([q[0], q[1]] as XY) : p
  }))
  const moved = s.bridgeEnd.filter((e) => ring.some((p) => p[0] === e[0] && p[1] === e[1])).length
  if (moved !== 3) throw new Error(`${s.id}: bridge end matched ${moved} of 3 outline nodes`)
  const onEnd = (a: XY, b: XY) => s.bridgeEnd.some((e) => e[0] === a[0] && e[1] === a[1]) && s.bridgeEnd.some((e) => e[0] === b[0] && e[1] === b[1])

  // --- The concourse: apron storey of pale panels, the glazed gate hall, a pale roof edge ---
  const apron: Facade = { bay: 9, ratio: 0.45, floor: 3.2, group: 1, spandrel: 0, sill: 2.2, head: 2.0, ground: 2.2, minLength: 9 }
  const hall: Facade = { bay: 6, ratio: 0.9, floor: 6.5, group: 1, spandrel: 0.6, sill: 0.3, head: 0.2, minLength: 3 }
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (onEnd(a, b)) { facade(wall, null, a, b, 0, BRIDGE.B0, null); continue } // under the bridge; above it is the bridge
    facade(wall, win, a, b, 0, GLASS0, apron)
    facade(wall, win, a, b, GLASS0, GLASS1, hall)
    facade(trim, null, a, b, GLASS1, H - 0.4, null)
  }
  capPoly(roof, ring, H)
  lipRing(trim, ring, H - 0.4, H + 0.05, 0.15, onEnd)
  // Raised joints between the roof's sections.
  for (const [a, b] of s.joints) beam(trim, a, b, 1.6, H - 0.1, H + 0.45, H - 0.1, H + 0.45)

  // --- The bridge landing: the bridge's section carried 6 m in, up to its roof ---
  {
    const [E0, E1, E2] = s.bridgeEnd, u = s.bridgeAxis
    const dot = (p: XY) => p[0] * u[0] + p[1] * u[1]
    const far = Math.max(dot(E0), dot(E1), dot(E2)) + 6
    const head: XY[] = [E0, E1, E2, [E2[0] + u[0] * (far - dot(E2)), E2[1] + u[1] * (far - dot(E2))], [E0[0] + u[0] * (far - dot(E0)), E0[1] + u[1] * (far - dot(E0))]]
    for (const p of head.slice(3)) if (!inside(p, ring)) throw new Error(`${s.id}: bridge landing leaves the concourse`)
    const hr = ccw(head), top = BRIDGE.B1 - 0.3
    for (let i = 0; i < hr.length; i++) {
      const a = hr[i], b = hr[(i + 1) % hr.length]
      if (onEnd(a, b)) continue // the bridge itself
      const q = (p: Part, z0: number, z1: number) => { if (z1 > z0) p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]) }
      q(trim, H, BRIDGE.BG0); q(bglass, Math.max(H, BRIDGE.BG0), BRIDGE.BG1); q(trim, BRIDGE.BG1, top)
    }
    capPoly(roof, hr, top)
    lipRing(trim, hr, BRIDGE.B1 - 0.5, BRIDGE.B1, 0.12, onEnd)
  }

  // --- Jet bridges: fixed link (merged where links share a corridor), rotunda, tunnel, cab ---
  const links: XY[][] = []
  for (const [, pts] of s.jetBridges) {
    const seg = pts.slice(0, -1).map((p, i) => d2(p, pts[i + 1]))
    const t = seg.indexOf(Math.max(...seg)) // the tunnel
    // fixed link: from just inside the wall to the rotunda
    for (let i = 0; i < t; i++) {
      let a = pts[i]; const b = pts[i + 1], L = d2(a, b)
      if (i === 0) a = [a[0] - (b[0] - a[0]) / L * 0.4, a[1] - (b[1] - a[1]) / L * 0.4]
      const n: XY = [-(b[1] - a[1]) / d2(a, b) * JB.linkW / 2, (b[0] - a[0]) / d2(a, b) * JB.linkW / 2]
      const e: XY = [(b[0] - a[0]) / d2(a, b) * JB.linkW / 2, (b[1] - a[1]) / d2(a, b) * JB.linkW / 2]
      links.push(ccw([[a[0] - n[0], a[1] - n[1]], [b[0] - n[0] + e[0], b[1] - n[1] + e[1]], [b[0] + n[0] + e[0], b[1] + n[1] + e[1]], [a[0] + n[0], a[1] + n[1]]]))
      if (i > 0 || t > 1) post(jet, b, 0.4, 0, JB.floor)
      for (let k = 1; k < Math.floor(L / 12) + 1; k++) { const f = k / (Math.floor(L / 12) + 1); post(jet, [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], 0.35, 0, JB.floor) }
    }
    // rotunda: an octagonal cabin on a column
    const R = pts[t], E = pts[t + 1]
    const oct = Array.from({ length: 8 }, (_, k) => [R[0] + 2.3 * Math.cos((k + 0.5) * Math.PI / 4), R[1] + 2.3 * Math.sin((k + 0.5) * Math.PI / 4)] as XY)
    prismAll(jet, oct, JB.floor - 0.3, JB.top + 0.3)
    post(jet, R, 0.6, 0, JB.floor - 0.3)
    // tunnel, sloping down to the cab
    beam(jet, R, E, JB.tunnelW, JB.floor, JB.floor + JB.tunnelH, JB.cabFloor, JB.cabFloor + JB.tunnelH)
    // wheel bogie three-quarters out: two legs and the bogie
    const L = d2(R, E), ux = (E[0] - R[0]) / L, uy = (E[1] - R[1]) / L, W: XY = [R[0] + ux * L * 0.78, R[1] + uy * L * 0.78]
    const zf = JB.floor + (JB.cabFloor - JB.floor) * 0.78
    for (const sgn of [-1, 1]) post(jet, [W[0] - uy * sgn * 1.0, W[1] + ux * sgn * 1.0], 0.22, 0.9, zf)
    beam(jet, [W[0] - ux * 0.7, W[1] - uy * 0.7], [W[0] + ux * 0.7, W[1] + uy * 0.7], 2.8, 0, 0.9, 0, 0.9)
    // cab: along the last segment, or on along the tunnel if there is none
    const C0: XY = [E[0] - ux * 0.4, E[1] - uy * 0.4]
    let C1: XY
    if (t + 2 < pts.length) { const P = pts[pts.length - 1], l = d2(E, P); C1 = l > 0.5 ? [E[0] + (P[0] - E[0]) / l * Math.max(l, 2.5), E[1] + (P[1] - E[1]) / l * Math.max(l, 2.5)] : [E[0] + ux * 2.5, E[1] + uy * 2.5] }
    else C1 = [E[0] + ux * 2.5, E[1] + uy * 2.5]
    beam(jet, t + 2 < pts.length ? E : C0, C1, JB.cabW, JB.cabFloor - 0.2, JB.cabFloor + 2.9, JB.cabFloor - 0.2, JB.cabFloor + 2.9)
  }
  for (const r of clip('union', [links[0]], ...links.slice(1).map((l) => [l]))) prismAll(jet, r, JB.floor, JB.top)

  // Night: the gate hall's glass glows (window); the apron storey and the jet bridges are floodlit.
  const flood = (p: V3, n: V3) => (p[2] < GLASS0 + 0.1 && Math.abs(n[2]) < 0.5 ? 0.6 : 0)
  finishModel(s.name, s.id, [
    { part: wall, material: { ...PALETTE.stone, floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: trim, material: PALETTE.trim },
    { part: bglass, material: windowVariant(2, 0xa9bfd1) },
    { part: jet, material: { ...finish('lga-jet-bridge', 0xcdd1d4), floodlight: (_p: V3, n: V3) => (Math.abs(n[2]) < 0.5 ? 0.5 : 0.2) } },
  ], { bearing: 0, osm: s.osm, height: BRIDGE.B1 }, 6500)
}

// ===========================================================================
// The Western Concourse
// ===========================================================================

// OSM way/677731265 in this frame.
const RING: XY[] = [[19.0, -37.9], [23.3, -38.9], [27.6, -39.9], [28.9, -34.1], [54.0, -39.3], [55.6, -36.7], [56.9, -34.6], [58.5, -32.1], [77.5, -2.3], [84.5, 8.7], [98.9, 32.0], [94.8, 34.6], [92.0, 36.3], [67.0, 52.3], [49.9, 24.7], [47.1, 20.3], [45.8, 18.4], [44.8, 17.3], [43.4, 16.1], [41.6, 15.2], [39.6, 14.4], [35.1, 13.4], [16.2, 9.0], [4.2, 6.6], [-29.1, 15.2], [-78.4, 28.6], [-80.9, 29.5], [-91.2, 32.4], [-96.6, 24.0], [-108.3, 5.8], [-110.2, 2.9], [-114.6, -4.0], [-109.2, -5.4], [-63.7, -16.9], [-10.4, -30.4], [12.9, -36.3]]
// The end of the West Pedestrian Bridge as nyc-lga-terminal-b draws it, in this frame.
const BRIDGE_END: [XY, XY, XY] = [[27.6, -41.2], [28.9, -35.5], [54.1, -40.6]]
// OSM jet bridges, wall first.
const JET: [string, XY[]][] = [
  ['719465267', [[49.9, 24.7], [35.6, 33.9], [42.1, 62.7], [40.1, 63.4]]],
  ['719465269', [[92.0, 36.3], [98.7, 47.1], [92.9, 75.6], [90.3, 75.5]]],
  ['719465270', [[94.8, 34.6], [101.5, 45.6], [129.8, 71.8], [131.0, 74.6]]],
  ['719973808', [[84.5, 8.7], [90.7, 4.7], [117.6, 13.7], [119.2, 16.3]]],
  ['719973809', [[77.5, -2.3], [79.4, -3.5], [73.5, -13.1], [77.8, -15.8], [97.9, -13.2], [99.9, -11.0]]],
  ['803064896', [[58.5, -32.1], [66.7, -37.3], [58.0, -51.0], [61.1, -53.1], [79.3, -37.5]]],
  ['1132718323', [[56.9, -34.6], [62.7, -38.4], [54.4, -51.5], [63.0, -72.4], [66.5, -72.8]]],
  ['1132718336', [[-29.1, 15.2], [-25.3, 30.0], [-33.1, 60.7], [-35.4, 62.2]]],
  ['1132718338', [[-78.4, 28.6], [-74.2, 46.3], [-87.3, 77.1], [-90.1, 76.8]]],
  ['1132718339', [[-80.9, 29.5], [-77.7, 42.2], [-110.1, 62.2], [-111.9, 60.0]]],
  ['1132718340', [[-96.6, 24.0], [-110.6, 28.2], [-109.1, 34.3], [-130.5, 34.6], [-131.9, 32.3]]],
  ['1132718341', [[-108.3, 5.8], [-122.9, 9.7], [-124.1, 10.1], [-159.8, 0.9], [-159.3, -1.7]]],
  ['1132718342', [[-110.2, 2.9], [-122.9, 6.1], [-123.6, 3.8], [-125.8, -19.1], [-124.6, -21.1]]],
  ['1132718343', [[-109.2, -5.4], [-110.5, -9.9], [-101.5, -21.7], [-98.7, -22.5]]],
  ['1132718344', [[-63.7, -16.9], [-64.6, -22.1], [-44.6, -43.5]]],
  ['1132718345', [[-10.4, -30.4], [-12.4, -39.4], [-6.6, -66.2], [-4.1, -68.7]]],
  ['1132718346', [[12.9, -36.3], [11.6, -43.0], [27.1, -58.7]]],
]

if (import.meta.main) concourse({
  id: 'nyc-lga-terminal-b-west-concourse', name: 'LaGuardia Airport Terminal B Western Concourse', osm: 'way/677731265',
  ring: RING, bridgeEnd: BRIDGE_END, bridgeAxis: unit([0.127, 0.992, 0]).slice(0, 2) as XY,
  // Roof joints read off NAIP 2024: two across the long bar, one cutting off the north-east block.
  joints: [[[-22.5, 7.5], [-27.5, -20.5]], [[35.0, 9.5], [30.0, -33.0]], [[53.0, 19.5], [74.5, 5.0]]],
  jetBridges: JET,
})
