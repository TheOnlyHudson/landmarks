/**
 * Fontainebleau Miami Beach (1954, Morris Lapidus), 4441 Collins Avenue —
 * original procedural geometry, CC0-1.0.
 * bun generators/mia-fontainebleau.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/447042031
 * (25.8182604, -80.1220601). The Versailles wing and the podium run 8°
 * clockwise of north, so the catalog bearing is 8 and the model is drawn
 * square to that frame (every coordinate below is in it).
 *
 * What the landmark covers: the OSM hotel outline way/447042031 — the 1954
 * Chateau (the quarter-circle tower, OSM part way/447041951), the 1958
 * Versailles wing along the north side of the outline, the low podium
 * between them (lobby, ballrooms, the "cheese-hole" arched screen on
 * Collins Avenue, the porte-cochère canopies, OSM roof way/447042025 and
 * part way/447041953), and the two small pavilions at the south-west foot
 * of the Chateau (parts way/447041950, way/447041948). NOT covered: the
 * later Tresor (2005) and Sorrento (2008) towers south of the Chateau,
 * which OSM maps separately, outside this outline; the small buildings
 * way/463513166 and way/463513167 just outside the outline's south-west
 * edge; and the 13-level towers north of the outline (way/463513161,
 * way/463513163), which lie inside the Eden Roc's outline and are Eden Roc.
 *
 * Identity: the Chateau's sweeping quarter-circle slab of white floor bands
 * and ribbon windows, concave to the pool and the ocean, with its tall
 * white service cores (one on the curve with a dark glass stair strip, one
 * at the east end); the long straight Versailles slab behind it with its
 * rounded west end; the low white podium with the row of tall arched,
 * hole-punched screen panels facing Collins Avenue.
 *
 * Sources:
 *  - OSM: outline way/447042031 (building=hotel, architect Morris Lapidus,
 *    start_date 1954, wikidata Q1435790); parts way/447041951 (the
 *    Chateau curve: fitted as an annulus about (17.8, -79.25), outer
 *    radius 71.3, inner 50.9, residuals < 0.03 m; the east straight end
 *    and the south straight end from its points), way/447041953,
 *    way/447041950, way/447041948; roof way/447042025. None carries a
 *    height.
 *  - Lidar: NOAA Digital Coast EPT 10338 (2021 Florida coastal topobathy,
 *    public domain; FL_TopobathyFLKeysNOAA_Hydroflattened_2019 returns no
 *    points here), 1 m grid, read in this frame with tools/lidar_frame.py.
 *    Heights above the street round the hotel (lidar 1.6 m): Chateau roof
 *    46.4 (returns 47–49 with roof plant; edge 44), its south straight end
 *    43; east-end core x 2..14, 52; the core on the curve (at 137°,
 *    x -38..-26, y -39..-27), 54.5; Versailles x -64..68, y 63..79, roof
 *    48.8, with its west end widening to y 53, a penthouse x -38..-17 to
 *    55.3 and a machine room x 34..44 to 58.5; podium: north block
 *    x -61..15, 14.6; part 447041953, 23.1; x 28..68, 19.2; south-east
 *    block x 37..61, y -46..10, 16; lobby and low wings 10.4; north-east
 *    wing 14.4; porte-cochère canopies 6.4; pavilions 9 (447041950) and 16
 *    (447041948). All measured.
 *  - USGS NAIP (public domain): plan, roof colours, the glass roofs of the
 *    south-west pavilions.
 *  - Estimated from the photos below: floor groups (14 storeys, drawn as
 *    six two-storey window rows), the screen's 16 arched panels (about
 *    2.75 m pitch, heads at the podium's roof line) and the canopy posts.
 *  - Colours: brilliant white render, grey-green glass, grey roofs, the
 *    screen's punched panels read as a pale grey field: from the photos.
 *  - Night: the windows glow; the lobby glazing under the canopies is
 *    `entrance`; the screen is floodlit (an estimate: no licensed night
 *    photo was found).
 *
 * Photos (Wikimedia Commons, daylight):
 *  - Fontainebleau_Miami_Beach_Aerial_2025.jpg, InvadingInvader, CC BY 4.0
 *    — from the north over the Versailles wing: the Chateau's convex face,
 *    both cores, the dark stair strip, the roofs; Tresor and Sorrento
 *    behind;
 *  - Miami_Beach_FL_Fontainebleau_pano01.jpg, Ebyabe, CC BY-SA 3.0 — from
 *    Collins Avenue (west): Versailles' rounded end, the arched screen, the
 *    lobby box, the Chateau and its core;
 *  - Miami_Beach_FL_Fontainebleau05.jpg, Ebyabe, CC BY-SA 3.0 — the
 *    porte-cochère canopy on its round columns;
 *  - Fontainebleau_Hotel_Miami_Beach_FL1.jpg, Acroterion, CC BY-SA 4.0 —
 *    the Chateau's floor bands and the screen's arched, hole-punched
 *    panels;
 *  - Detail_of_Fontainbleau_Hotel_Miami_Beach.jpg, Phillip Pessar,
 *    CC BY-SA 3.0 — the screen row from Collins Avenue;
 *  - Fontainebleau-11.jpg, Visitor7, CC BY-SA 3.0 — the entrance canopy;
 *  - Miami_Beach_-_Air_view_of_Hotel_Fontainebleau.jpg, Tichnor Brothers
 *    postcard, public domain — the curve's concave side to the ocean.
 * Look-only (not relied on): Flickr photos by Thomas Hawk (CC BY-NC 2.0)
 * and wallyg (CC BY-NC-ND 2.0). No commercial imagery or 3D tiles.
 *
 * Doubts: the beach (east) side of the podium and the Versailles' south
 * face above the podium have no close photo and are kept plain. The lidar
 * is from 2021, so the heights are current; the screen and canopy shapes
 * are simplified. The street is 1–2 m above the lowest terrain in the
 * footprint, so the map stands the model up to 1 m low on its west side.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, walls, capRing, face, build, outward } from './mia-panorama-tower'

const white = new Part(), win = new Part(), glass = new Part(), roof = new Part(), screen = new Part(), entr = new Part()

const D2R = Math.PI / 180
const C: XY = [17.8, -79.25], RO = 71.3, RI = 50.9
const arcPt = (r: number, a: number): XY => [C[0] + r * Math.cos(a * D2R), C[1] + r * Math.sin(a * D2R)]
const arcPts = (r: number, a0: number, a1: number, n: number): XY[] => Array.from({ length: n + 1 }, (_, k) => arcPt(r, a0 + ((a1 - a0) * k) / n))

/** Window panels on a wall segment a→b (outward side), one per `bay`, rows between z0 and z1. */
function bandPanels(a: XY, b: XY, z0: number, z1: number, rows: number, bay: number, pier = 1.0, spandrel = 2.5, skip?: (s: number, L: number) => boolean) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 3) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o = outward(a, b), n: V3 = [o[0], o[1], 0]
  const nb = Math.max(1, Math.round(L / bay)), bw = L / nb, rh = (z1 - z0) / rows
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + o[0] * 0.05, a[1] + t[1] * s + o[1] * 0.05, z]
  for (let k = 0; k < nb; k++) {
    const s0 = k * bw + pier / 2, s1 = (k + 1) * bw - pier / 2
    if (skip && skip((s0 + s1) / 2, L)) continue
    for (let j = 0; j < rows; j++) {
      const za = z0 + j * rh + spandrel / 2, zb = z0 + (j + 1) * rh - spandrel / 2
      face(win, [P(s0, za), P(s1, za), P(s1, zb), P(s0, zb)], n)
    }
  }
}
/** Panels on every edge of a ccw ring, filtered by edge. */
function ringPanels(r: XY[], z0: number, z1: number, rows: number, bay: number, keep: (a: XY, b: XY) => boolean = () => true, pier = 1.0) {
  r.forEach((a, i) => { const b = r[(i + 1) % r.length]; if (keep(a, b)) bandPanels(a, b, z0, z1, rows, bay, pier) })
}

// ======================= the Chateau (1954) =======================
const TOP = 46.4, SOUTH_TOP = 43
const N_ARC = 14
// main ring: east straight end + the curve; the south straight end is its own lower block
const outerArc = arcPts(RO, 98, 180, N_ARC), innerArc = arcPts(RI, 180, 101.5, N_ARC)
const CHATEAU = ccw([[33, -27.3], [31, -5.6], ...outerArc, [-53.5, -80.5], [-32.4, -80.5], ...innerArc])
const SOUTH = ccw([[-53.5, -80.5], [-52.9, -96.5], [-52.5, -101.6], [-31.1, -99.1], [-32.4, -80.5]])
walls(CHATEAU, [[0, TOP - 1.2, white], [TOP - 1.2, TOP, white]])
capRing(roof, CHATEAU, TOP)
walls(SOUTH, [[0, SOUTH_TOP, white]])
capRing(roof, SOUTH, SOUTH_TOP)
// parapet lip: a slightly proud white band round the roof edge
{
  const lip = (r: XY[], z: number) => r.map((p, i) => {
    const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
    const n1 = outward(a, p), n2 = outward(p, b), m = [n1[0] + n2[0], n1[1] + n2[1]], l = Math.hypot(m[0], m[1]) || 1
    return [p[0] + (m[0] / l) * 0.35, p[1] + (m[1] / l) * 0.35] as XY
  })
  const L = lip(CHATEAU, TOP)
  walls(L, [[TOP - 0.9, TOP + 0.5, white]]); capRing(white, L, TOP - 0.9, false); capRing(roof, L, TOP + 0.5)
}
// window rows: six two-storey rows on the curve's faces and the ends
const CORE_A0 = 131.5, CORE_A1 = 142.5 // the core on the curve (lidar x -38..-26)
const angleOf = (p: XY) => Math.atan2(p[1] - C[1], p[0] - C[0]) / D2R
ringPanels(CHATEAU, 5.2, 45, 6, 7.4, (a, b) => {
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], am = angleOf(m)
  if (am > CORE_A0 - 1 && am < CORE_A1 + 1 && Math.hypot(m[0] - C[0], m[1] - C[1]) > 60) return false
  if (m[0] > 1.5 && m[0] < 14.5) return false   // east core: blank white
  return true
})
// east straight end: its north and south faces carry panels only east of the core
bandPanels([31, -5.6], [7.7, -8.6], 5.2, 45, 6, 7.4, 1.0, 2.5, (s, L) => s > 17 && s < 30)
ringPanels(SOUTH, 5.2, 41.6, 6, 7.0)

// east-end core: plain white slab rising above the roof
{
  const r = ccw([[1.8, -8.9], [14.4, -7.3], [14.6, -28.4], [2.0, -29.1]])
  walls(r, [[TOP, 52, white]]); capRing(roof, r, 52)
}
// the core on the curve: a white box standing 2 m proud of the convex face, to 54.5
{
  const r0 = 61, r1 = RO + 2
  const am = (CORE_A0 + CORE_A1) / 2, half = ((CORE_A1 - CORE_A0) / 2) * D2R * RO
  const u: XY = [Math.cos(am * D2R), Math.sin(am * D2R)], t: XY = [-u[1], u[0]]
  const P = (rr: number, s: number): XY => [C[0] + u[0] * rr + t[0] * s, C[1] + u[1] * rr + t[1] * s]
  const r = ccw([P(r0, -half), P(r1, -half), P(r1, half), P(r0, half)])
  walls(r, [[0, 54.5, white]]); capRing(roof, r, 54.5)
  // dark glass stair strip down its outer face, from the first floor to under the roof
  const n: V3 = [u[0], u[1], 0], w = 1.6
  const Q = (s: number, z: number): V3 => [C[0] + u[0] * (r1 + 0.06) + t[0] * s, C[1] + u[1] * (r1 + 0.06) + t[1] * s, z]
  face(glass, [Q(-w, 4.5), Q(w, 4.5), Q(w, 51.5), Q(-w, 51.5)], n)
}

// ======================= Versailles (1958) =======================
const VTOP = 48.8
const r8 = (cx: number, cy: number, r: number, a0: number, a1: number, n: number): XY[] => Array.from({ length: n + 1 }, (_, k) => [cx + r * Math.cos((a0 + ((a1 - a0) * k) / n) * D2R), cy + r * Math.sin((a0 + ((a1 - a0) * k) / n) * D2R)] as XY)
const VERS = ccw([
  [68, 63], [68, 78.6], [-58.5, 78.6], ...r8(-58.5, 73.6, 5, 90, 180, 3), ...r8(-56.5, 59.5, 7, 180, 270, 4), [-49.5, 52.5], [-49.5, 63],
])
walls(VERS, [[14.6, VTOP, white]])
walls(VERS.filter(() => true), [[0, 14.6, white]])
capRing(roof, VERS, VTOP)
{
  const lip = VERS.map((p, i) => {
    const a = VERS[(i - 1 + VERS.length) % VERS.length], b = VERS[(i + 1) % VERS.length]
    const n1 = outward(a, p), n2 = outward(p, b), m = [n1[0] + n2[0], n1[1] + n2[1]], l = Math.hypot(m[0], m[1]) || 1
    return [p[0] + (m[0] / l) * 0.35, p[1] + (m[1] / l) * 0.35] as XY
  })
  walls(lip, [[VTOP - 0.9, VTOP + 0.5, white]]); capRing(white, lip, VTOP - 0.9, false); capRing(roof, lip, VTOP + 0.5)
}
// windows: north, west and east faces from the ground; the south face above the podium
VERS.forEach((a, i) => {
  const b = VERS[(i + 1) % VERS.length], o = outward(a, b)
  if (o[1] < -0.7) bandPanels(a, b, 16.4, 47.6, 5, 8, 1.0)
  else bandPanels(a, b, 5.2, 47.6, 7, 8, 1.0)
})
// penthouse and machine room
for (const [x0, x1, z] of [[-38, -17, 55.3], [34, 44, 58.5]]) {
  const r = ccw([[x0, 66.5], [x1, 66.5], [x1, 76.5], [x0, 76.5]])
  walls(r, [[VTOP + 0.5, z, white]]); capRing(roof, r, z)
}

// ======================= podium =======================
const BASE = 10.4
const PODIUM = ccw([
  [-51.5, -100], [-31.9, -98.3], [-32.8, -84.3], [-27, -83], [-22.2, -81.3], [-17.7, -78.7], [-13.8, -75.3], [-10.6, -71.2], [-8.3, -66.7],
  [3.3, -62.2], [9, -59.7], [13, -59.5], [13, -61.3], [27.6, -61.3], [27.6, -56.2], [29, -54.8], [33.9, -54.8], [33.9, -31.5],
  [35.7, -31.4], [42.2, -54.8], [70.3, -55], [63.9, -31.5], [61.4, -31.5], [61.4, -25.8], [68.1, -25.7], [67.9, 8.7], [79.5, 8.7],
  [79.4, 21.9], [73.9, 21.8], [73.9, 23.4], [84.9, 23.5], [84.7, 77.9], [68.3, 77.9], [68.3, 62.7], [-49.2, 62.7], [-49.2, 51.7],
  [-61.1, 51.7], [-61.1, 15], [-61.1, -20], [-56, -45], [-51.5, -62], [-52.2, -80],
])
walls(PODIUM, [[0, BASE, white]])
capRing(roof, PODIUM, BASE)
const block = (x0: number, x1: number, y0: number, y1: number, z: number, z0 = BASE) => {
  const r = ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
  walls(r, [[z0, z, white]]); capRing(roof, r, z)
  return r
}
const A = block(-64.3, 15.6, 13, 62.7, 14.6, 0)     // lobby / north block behind the screen
block(15.6, 28.3, 13.5, 56.7, 23.1)               // OSM part 447041953
block(28.3, 68, 13, 62.7, 19.2)
block(37, 61.4, -46, 10, 16)
block(68.3, 84.7, 62.7, 77.9, 14.4)
void A
// lobby glazing on the west face, under the north canopy; ground-floor glazing elsewhere on the street faces
{
  const n: V3 = [-1, 0, 0], x = -61.1 - 0.06
  face(entr, [[x, 12, 0.6], [x, -18, 0.6], [x, -18, 5.6], [x, 12, 5.6]].map((p) => p as V3), n)
}
PODIUM.forEach((a, i) => {
  const b = PODIUM[(i + 1) % PODIUM.length], o = outward(a, b)
  if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 12 && (o[0] > 0.7 || o[1] < -0.7)) bandPanels(a, b, 1.2, 8.6, 1, 9, 1.4, 1.6)
})

// ---- the arched screen on Collins Avenue: 16 tall round-headed panels ----
{
  const x = -65.3, depth = 0.9, y0 = 14.3, n = 18, pitch = 2.75, gap = 0.12
  const zb = 3.6, top = 15.6
  const R = (pitch - gap) / 2, spring = top - R
  const rin = R - 0.3, SB = 0.6
  const SEG = 6
  const nW: V3 = [-1, 0, 0]
  for (let k = 0; k < n; k++) {
    const cy = y0 + pitch * (k + 0.5)
    const pt = (r: number, a: number, xx: number): V3 => [xx, cy + r * Math.cos(a), spring + r * Math.sin(a)]
    // front frame: two jambs and the arched ring
    face(white, [[x, cy + R, zb], [x, cy + rin, zb], [x, cy + rin, spring], [x, cy + R, spring]], nW)
    face(white, [[x, cy - rin, zb], [x, cy - R, zb], [x, cy - R, spring], [x, cy - rin, spring]], nW)
    for (let s = 0; s < SEG; s++) {
      const a0 = (Math.PI * s) / SEG, a1 = (Math.PI * (s + 1)) / SEG
      face(white, [pt(R, a0, x), pt(rin, a0, x), pt(rin, a1, x), pt(R, a1, x)], nW)
      // the arch's back/top surface (depth), so the head reads round from the side
      const m = (a0 + a1) / 2
      face(white, [pt(R, a0, x), pt(R, a1, x), pt(R, a1, x + depth), pt(R, a0, x + depth)], [0, Math.cos(m), Math.sin(m)])
      // the punched field inside the head, set back
      face(screen, [[x + SB, cy, spring], pt(rin, a1, x + SB), pt(rin, a0, x + SB)], nW)
      // the reveal round the head
      face(white, [pt(rin, a1, x), pt(rin, a0, x), pt(rin, a0, x + SB), pt(rin, a1, x + SB)], [0, -Math.cos(m), -Math.sin(m)])
    }
    // field below the head, set back
    face(screen, [[x + SB, cy + rin, zb], [x + SB, cy - rin, zb], [x + SB, cy - rin, spring], [x + SB, cy + rin, spring]], nW)
    // the jamb reveals
    face(white, [[x, cy + rin, zb], [x + SB, cy + rin, zb], [x + SB, cy + rin, spring], [x, cy + rin, spring]], [0, -1, 0])
    face(white, [[x, cy - rin, zb], [x, cy - rin, spring], [x + SB, cy - rin, spring], [x + SB, cy - rin, zb]], [0, 1, 0])
    // the outer sides of the frame (seen along the street)
    face(white, [[x, cy + R, zb], [x, cy + R, spring], [x + depth, cy + R, spring], [x + depth, cy + R, zb]], [0, 1, 0])
    face(white, [[x, cy - R, zb], [x + depth, cy - R, zb], [x + depth, cy - R, spring], [x, cy - R, spring]], [0, -1, 0])
  }
  // the plinth band the screen stands on
  const r = ccw([[x, y0], [x + 1.0, y0], [x + 1.0, y0 + n * pitch], [x, y0 + n * pitch]])
  walls(r, [[0, zb, white]]); capRing(white, r, zb)
}

// ---- porte-cochère canopies on round columns ----
function canopy(r: XY[], z: number, posts: XY[]) {
  const R = ccw(r)
  walls(R, [[z - 0.7, z, white]]); capRing(roof, R, z); capRing(white, R, z - 0.7, false)
  for (const [px, py] of posts) {
    const ring = Array.from({ length: 6 }, (_, k) => [px + 0.4 * Math.cos((k * Math.PI) / 3), py + 0.4 * Math.sin((k * Math.PI) / 3)] as XY)
    walls(ring, [[0, z - 0.7, white]], 1.2)
  }
}
canopy([[-61.1, 13], [-69.5, 13], [-69.5, -13], [-68, -18], [-64.5, -21.5], [-60.6, -23]], 6.4, [[-68.3, 10], [-68.3, 0], [-68.3, -10], [-64.5, -18.5]])
canopy([[-61.1, -61.7], [-65.4, -59.3], [-69.5, -57], [-66.6, -49.1], [-62.2, -50.1], [-57.2, -51.1], [-53.9, -51.8], [-54.7, -55.4], [-56.3, -59.7], [-58.3, -63.3]], 6.4, [[-67.6, -55.3], [-63.5, -52]])

// ---- the south-west pavilions (OSM parts 447041950, 447041948) ----
{
  const P1 = ccw([[-54.4, -123.9], [-47.2, -122.3], [-46.7, -123.2], [-44.4, -121.4], [-41.2, -117.6], [-39.9, -113.3], [-39.7, -109.7], [-40.6, -105.3], [-42.9, -101.5], [-43.5, -100.8], [-52.5, -101.6], [-55.1, -96.7], [-59.4, -97.9], [-63.1, -100.5], [-65.7, -104.2], [-67.1, -108.5], [-66.8, -112.1], [-66.3, -112.5], [-64.6, -117.6]])
  walls(P1, [[0, 9, white]]); capRing(roof, P1, 9)
  ringPanels(P1, 1.2, 7.6, 1, 4, () => true, 0.8)
  const P2 = ccw([[-48.3, -132.0], [-63.0, -138.9], [-73.6, -132.6], [-74.7, -116.3], [-68.1, -115.7], [-66.3, -112.5], [-64.6, -117.6], [-54.4, -123.9], [-47.2, -122.3], [-50.8, -126.2]])
  walls(P2, [[0, 15.2, white], [15.2, 16, white]])
  capRing(glass, P2, 16)
  ringPanels(P2, 1.2, 14, 2, 5, () => true, 0.9)
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0 : p[0] < -64 && p[1] > 14 && p[1] < 64 && p[2] > 3 ? 0.8 : 0)
if (import.meta.main) {
  await build('Fontainebleau Miami Beach', 'mia-fontainebleau', [
    { part: white, material: { ...finish('fb-white', 0xf4f2ee), floodlight: lit } },
    { part: win, material: { name: 'window', color: 0x6f8b96, roughness: 0.35 } },
    { part: glass, material: { name: 'glass', color: 0x6d8494, roughness: 0.24 } },
    { part: roof, material: finish('fb-roof', 0xc3c8cb) },
    { part: screen, material: { ...finish('fb-screen', 0xb8c0c5), floodlight: lit } },
    { part: entr, material: PALETTE.entrance },
  ], { bearing: 8, elevation: 0, height: 58.5, replaces: ['way/447042031', 'way/447041951', 'way/447041953', 'way/447041950', 'way/447041948', 'way/447042025'] }, process.argv[2], 5000)
}
