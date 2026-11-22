/**
 * Table Rock Centre (Table Rock Welcome Centre), Niagara Parkway at the
 * brink of the Horseshoe Falls, Niagara Falls, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-table-rock-centre.ts
 *
 * This file also exports the small roof and window helpers the other
 * niagara- buildings of builder B4 use (`rect`, `hipRoof`, `gableRoof`,
 * `archPanel`, `cone`); Table Rock itself is only written when this file
 * runs.
 *
 * Map frame: x east, y north, z up, metres, built turned to the building's
 * own axes: bearing 13.6 (the long west wall of the OSM outline). Anchor =
 * centroid of the OSM outline way/420548287, 43.079237, -79.078940.
 * y = 0 is the lowest ground under the footprint (Mapterhorn ~157 m; the
 * site is flat to about 1.5 m except the far west end of the footbridge,
 * which lands on the escarpment ~6 m higher).
 *
 * Identity: a low two-storey hall of rough brown sandstone under steep
 * dark bronze standing-seam metal roofs; the south Welcome Centre pavilion
 * with cross gables, big glazed bays and a square lantern cupola on its
 * pyramid roof; a conical-roofed round turret; the restaurant bay facing
 * the falls with its glazed upper floor under a dark mansard; a covered
 * footbridge west over the Niagara Parkway.
 *
 * Evidence:
 * - plan: OSM way/420548287 (building=yes, building:levels=2), used whole.
 *   The arm running west is the covered footbridge over the Niagara
 *   Parkway (OSM way/198239674, bridge=yes covered=yes layer=1; the road
 *   below is tagged maxheight=4.4), ending in a small cross-shaped stair
 *   pavilion on the escarpment.
 * - heights: no published figure; estimated from the photos below against
 *   door height (2.2 m) and the two storeys: eaves 8-9 m, the main ridges
 *   ~15-16 m (the main hall and north block as steep mansards with low
 *   hipped tops), the pavilion apex ~16.5 m, lantern top ~20.5 m, turret
 *   cone tip ~19 m (it rises above the ridges in the photos). Footbridge deck at 6.6 m (4.4 m clearance over the road, which
 *   is 1.6 m above y = 0 on the map terrain).
 * - colours: sandstone brown-tan (photos ~#9a8468, pulled light), dark
 *   bronze metal roofs (~#4e4640, kept dark as identity, no darker than
 *   charcoal), dark glazing.
 * - where each part sits (cupola pavilion south, turret and restaurant bay
 *   on the falls side, gabled north block) from Ethan/Jeff Hitchcock's
 *   views from the east and north-east, and VillageHero's view from the
 *   gorge (east), which show the cupola pavilion at the south end.
 *
 * Photos (Wikimedia Commons), all EVIDENCE:
 * - "Table Rock Welcome Centre.jpg", Chris Light, CC BY-SA 4.0 (dusk, east)
 * - "Table Rock Welcome Centre, Niagara Falls, Ontario (36445947166).jpg",
 *   Paulo O from Halifax, Canada, CC BY 2.0 (from the east)
 * - "Niagara falls visitor center 04.07.2012 14-48-37.jpg", Dirk Ingo
 *   Franke, CC BY-SA 3.0 (the cupola pavilion, south-east)
 * - "Table Rock Welcome Centre (37456151582).jpg" and "(36777436434).jpg",
 *   Jeff Hitchcock from Seattle, CC BY 2.0 (north-east front; restaurant)
 * - "Niagara - Table Rock Welcome Center (44330566925).jpg", VillageHero
 *   from Ulm, CC BY-SA 2.0 (whole east elevation from across the gorge)
 * No lidar (Ontario). No commercial imagery.
 *
 * Doubts: the west and north walls are barely photographed; the roof plan
 * between the photographed ridges is estimated (hips over rectangles that
 * fill the outline); the south strip (6 m wide, 43 m long) is drawn as a
 * one-storey wing under a hipped roof, unphotographed. Dormers, chimneys
 * other than the main one, awnings and the falls-side railing are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, onWall, panel, save, triangulate, turn, walls, circle, type XY } from './chi-aon-center'

/** An axis-aligned rectangle, counter-clockwise. */
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/**
 * A hipped roof over an axis-aligned rectangle: eaves at z, `over` metres
 * out past the walls, rising `rise` to a ridge along the long axis (a
 * pyramid on a square). `fascia` is the thickness of the eave edge; the
 * soffit is closed underneath. Hips at the same pitch all round.
 */
export function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, rise: number, over = 0.5, fascia = 0.35, edge: Part = p) {
  const a = x0 - over, b = x1 + over, c = y0 - over, d = y1 + over
  const w = b - a, h = d - c, half = Math.min(w, h) / 2
  const e: XY[] = [[a, c], [b, c], [b, d], [a, d]]
  walls(edge, e, z - fascia, z)
  cap(edge, e, z - fascia, false)
  const zt = z + rise
  const r0: V3 = w >= h ? [a + half, c + half, zt] : [a + half, c + half, zt]
  const r1: V3 = w >= h ? [b - half, c + half, zt] : [a + half, d - half, zt]
  const E = e.map(([x, y]) => [x, y, z] as V3)
  if (w >= h) {
    p.quad(E[0], E[1], r1, r0) // south
    p.tri(E[1], E[2], r1) // east hip
    p.quad(E[2], E[3], r0, r1) // north
    p.tri(E[3], E[0], r0) // west hip
  } else {
    p.tri(E[0], E[1], r0) // south hip
    p.quad(E[1], E[2], r1, r0) // east
    p.tri(E[2], E[3], r1) // north hip
    p.quad(E[3], E[0], r0, r1) // west
  }
}

/**
 * A gabled roof over an axis-aligned rectangle, ridge along x (`alongX`) or
 * y, eaves at z, `over` past the walls; the gable triangles go in `gable`
 * (the wall material), flush with the end walls.
 */
export function gableRoof(p: Part, gable: Part, x0: number, y0: number, x1: number, y1: number, z: number, rise: number, alongX: boolean, over = 0.5, fascia = 0.3) {
  if (alongX) {
    const c = y0 - over, d = y1 + over, m = (y0 + y1) / 2, zt = z + rise
    const a = x0 - over * 0.6, b = x1 + over * 0.6
    walls(p, [[a, c], [b, c], [b, d], [a, d]], z - fascia, z)
    cap(p, [[a, c], [b, c], [b, d], [a, d]], z - fascia, false)
    p.quad([a, c, z], [b, c, z], [b, m, zt], [a, m, zt])
    p.quad([b, d, z], [a, d, z], [a, m, zt], [b, m, zt])
    // the ends of the roof slab
    p.tri([a, d, z], [a, c, z], [a, m, zt])
    p.tri([b, c, z], [b, d, z], [b, m, zt])
    const zr = z + rise * (1 - over / ((y1 - y0) / 2 + over))
    gable.tri([x0, y0, z], [x0, y1, z], [x0, m, zr].map((v, i) => (i === 2 ? v : v)) as V3)
    gable.tri([x1, y1, z], [x1, y0, z], [x1, m, zr])
  } else {
    const a = x0 - over, b = x1 + over, m = (x0 + x1) / 2, zt = z + rise
    const c = y0 - over * 0.6, d = y1 + over * 0.6
    walls(p, [[a, c], [b, c], [b, d], [a, d]], z - fascia, z)
    cap(p, [[a, c], [b, c], [b, d], [a, d]], z - fascia, false)
    p.quad([b, c, z], [b, d, z], [m, d, zt], [m, c, zt])
    p.quad([a, d, z], [a, c, z], [m, c, zt], [m, d, zt])
    p.tri([a, c, z], [b, c, z], [m, c, zt])
    p.tri([b, d, z], [a, d, z], [m, d, zt])
    const zr = z + rise * (1 - over / ((x1 - x0) / 2 + over))
    gable.tri([x1, y0, z], [x0, y0, z], [m, y0, zr])
    gable.tri([x0, y1, z], [x1, y1, z], [m, y1, zr])
  }
}

/**
 * A round-headed window panel on wall a→b of a counter-clockwise ring:
 * s0..s1 along the wall, from z0 up to the springing line zs, then a real
 * semicircle of radius (s1 - s0) / 2. `seg` segments in the half circle.
 */
export function archPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 8) {
  const { P } = onWall(a, b)
  const r = (s1 - s0) / 2, sc = (s0 + s1) / 2
  const ring: V3[] = [P(s0, z0, out), P(s1, z0, out)]
  for (let k = 0; k <= seg; k++) {
    const t = (k / seg) * Math.PI
    ring.push(P(sc + r * Math.cos(t), zs + r * Math.sin(t), out))
  }
  // convex: a fan from the springing-line centre
  const c = P(sc, zs, out)
  for (let i = 0; i < ring.length; i++) p.tri(c, ring[i], ring[(i + 1) % ring.length])
}

/** A cone (or a cone frustum when r1 > 0) about (cx, cy), seg sides. */
export function cone(p: Part, cx: number, cy: number, r0: number, z0: number, z1: number, seg = 16, r1 = 0) {
  const b = circle(cx, cy, r0, seg), t = circle(cx, cy, r1, seg)
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg
    if (r1 > 0) p.quad([b[i][0], b[i][1], z0], [b[j][0], b[j][1], z0], [t[j][0], t[j][1], z1], [t[i][0], t[i][1], z1])
    else p.tri([b[i][0], b[i][1], z0], [b[j][0], b[j][1], z0], [cx, cy, z1])
  }
  cap(p, b, z0, false)
  if (r1 > 0) cap(p, t, z1, true)
}

/** Split a ring's long edges into pieces no longer than `max` metres (for terrain). */
export function densify(r: XY[], max = 5): XY[] {
  const out: XY[] = []
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max))
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  })
  return out
}

// ---------------------------------------------------------------------------
// Table Rock Centre

/** The OSM outline (way/420548287) in the building frame (turned 13.6°). */
const OUTLINE_WORLD: XY[] = [[-24.79, -10.79], [-29.8, -9.58], [-40.02, -51.62], [-34.05, -53.05], [-28.71, -31.1], [-9.43, -35.72], [-10.85, -41.59], [-7.85, -42.3], [-6.22, -42.69], [-6.45, -43.65], [-2.74, -44.54], [14.49, -48.66], [15.09, -46.15], [19.95, -47.32], [21.0, -43.0], [26.19, -41.28], [31.29, -35.73], [32.86, -29.5], [33.95, -29.77], [36.45, -19.84], [45.99, -14.82], [48.78, -15.4], [49.72, -10.91], [50.53, -7.03], [48.12, -6.53], [43.63, 2.29], [34.56, 4.22], [32.03, 8.77], [31.02, 8.99], [29.32, 9.36], [33.01, 25.89], [33.73, 29.15], [34.79, 33.88], [33.56, 34.16], [29.59, 35.03], [22.19, 36.65], [23.67, 43.24], [22.68, 43.46], [21.51, 43.72], [20.02, 37.03], [13.9, 38.38], [14.8, 42.41], [8.1, 43.89], [8.36, 45.0], [6.16, 45.49], [5.92, 44.44], [-10.4, 48.03], [-16.43, 43.99], [-19.73, 30.41], [-25.02, 31.68], [-26.63, 25.06], [-27.46, 25.26], [-28.17, 22.34], [-33.25, 23.57], [-38.23, 24.76], [-44.3, 26.21], [-59.93, 29.96], [-61.68, 30.38], [-60.65, 34.6], [-67.69, 36.28], [-68.5, 32.92], [-73.54, 34.12], [-74.17, 31.56], [-74.85, 28.75], [-70.29, 27.66], [-71.51, 22.63], [-64.27, 20.89], [-63.15, 25.51], [-61.36, 25.08], [-46.28, 21.47], [-40.28, 20.03], [-35.35, 18.85], [-29.73, 17.5], [-32.38, 6.57], [-21.22, 3.89], [-23.14, -4.05]]

/** A mansard: steep slopes `steep` metres up and `depth` in from the eave, then a low hip on top. */
function mansard(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, steep: number, depth: number, topRise: number, over = 0.6) {
  const e = rect(x0 - over, y0 - over, x1 + over, y1 + over)
  walls(p, e, z - 0.35, z)
  cap(p, e, z - 0.35, false)
  const ix0 = x0 - over + depth, iy0 = y0 - over + depth, ix1 = x1 + over - depth, iy1 = y1 + over - depth
  walls(p, e, z, z + steep, rect(ix0, iy0, ix1, iy1))
  hipRoof(p, ix0, iy0, ix1, iy1, z + steep, topRise, 0, 0.01)
}

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), trim = new Part(), glass = new Part()
  const O = turn(OUTLINE_WORLD, 13.6) // counter-clockwise? OSM rings vary; fix below
  const area = O.reduce((s, a, i) => { const b = O[(i + 1) % O.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const ring = area > 0 ? O : [...O].reverse()
  // The building proper: the outline east of the footbridge (x > -33.5).
  const body = ring.filter(([x]) => x > -33.5)
  const EAVE = 8.2

  // Walls to the eaves, split for the terrain; the roof caps follow.
  walls(stone, densify(body, 5), 0, EAVE)
  cap(roof, body, EAVE - 0.05)

  // Window bays: two-storey glazed bays between stone piers on every wall
  // longer than 5 m; arched heads on the falls-side arcade (east, x > 24).
  for (let i = 0; i < body.length; i++) {
    const a = body[i], b = body[(i + 1) % body.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 5) continue
    const n = Math.max(1, Math.round((L - 1.6) / 5.2)), w = (L - 1.6) / n
    const east = (a[0] + b[0]) / 2 > 24
    for (let q = 0; q < n; q++) {
      const s0 = 0.8 + q * w + 0.9, s1 = 0.8 + (q + 1) * w - 0.9
      if (east) {
        archPanel(win, a, b, s0, s1, 0.9, Math.max(1.5, 3.8 - (s1 - s0) / 2), 0.05, 6)
        panel(win, a, b, s0, s1, 4.6, 7.3)
      } else if ((a[1] + b[1]) / 2 < -21) panel(win, a, b, s0, s1, 0.9, 7.2) // the glazed pavilion bays
      else { panel(win, a, b, s0 + 0.5, s1 - 0.5, 1.0, 3.0); panel(win, a, b, s0 + 0.5, s1 - 0.5, 5.0, 6.9) } // punched windows in rough stone
    }
  }

  // --- roofs: hips and gables over the rectangles that fill the outline
  // the main hall and the north block
  // steep (about 55 deg) bronze slopes with low tops, as the photos show
  mansard(roof, -21.5, -21, 26, 16, EAVE, 6.0, 4.2, 1.6)
  mansard(roof, -26.3, 16, 26, 44.4, EAVE, 6.4, 4.4, 1.4)
  hipRoof(roof, 4.5, 40.6, 12.9, 47.6, EAVE - 1.5, 3.2, 0.4)
  // the west link (lower) and the south strip
  hipRoof(roof, -33, -1.2, -21.5, 15.1, EAVE - 2.4, 3.2, 0.5)
  hipRoof(roof, -26.8, -59.6, -20.6, -21, 4.6, 2.4, 0.5)
  // the restaurant bay facing the falls: a dark mansard round a flat top
  const bay: XY[] = [[26, -21], [38.9, -21], [40.1, -10.7], [48.2, -3.6], [51, -3.5], [50.9, 5], [48.3, 5], [41.9, 12.5], [32.6, 12.2], [26, 12.2]]
  const bayTop = bay.map(([x, y]) => [x, y] as XY)
  const inner: XY[] = [[27.5, -18.5], [37, -18.5], [38.4, -8.5], [46.5, -1.5], [48.4, -1.4], [48.4, 2.6], [46.8, 2.6], [40.6, 10], [33, 10], [27.5, 10]]
  walls(roof, bayTop, EAVE, EAVE + 2.6, inner)
  cap(roof, inner, EAVE + 2.6)
  void bayTop
  // the south Welcome Centre pavilion: cross gables, a pyramid, a lantern
  const PX0 = -0.8, PX1 = 25.5, PY0 = -43.9, PY1 = -21
  const cx = (PX0 + PX1) / 2, cy = (PY0 + PY1) / 2
  hipRoof(roof, PX0, PY0, PX1, PY1, EAVE + 0.8, 7.6, 0.6)
  gableRoof(roof, stone, cx - 5.5, PY0, cx + 5.5, cy, EAVE + 0.8, 5.2, false, 0.5)
  gableRoof(roof, stone, cx, cy - 5.5, PX1, cy + 5.5, EAVE + 0.8, 5.2, true, 0.5)
  gableRoof(roof, stone, PX0, cy - 5.5, cx, cy + 5.5, EAVE + 0.8, 5.2, true, 0.5)
  // walls raised under the pavilion eaves (it stands a little taller)
  walls(stone, rect(PX0 + 0.05, PY0 + 0.05, PX1 - 0.05, PY1 - 0.05), EAVE - 0.1, EAVE + 0.8)
  // big round-headed windows in the south and east gables, glazed bays under them
  const gs: [XY, XY][] = [[[cx - 5.5, PY0], [cx + 5.5, PY0]], [[PX1, cy - 5.5], [PX1, cy + 5.5]], [[PX0, cy + 5.5], [PX0, cy - 5.5]]]
  for (const [a, b] of gs) {
    archPanel(win, a, b, 3.2, 7.8, EAVE + 1.2, EAVE + 2.2, 0.06, 8)
    panel(trim, a, b, 2.6, 8.4, EAVE + 0.9, EAVE + 1.1, 0.07)
  }
  // the lantern: a square glazed cupola with its own little pyramid
  const top = EAVE + 0.8 + 7.6 - 2.2
  block(stone, null, rect(cx - 2, cy - 2, cx + 2, cy + 2), top, top + 3.4, 0)
  for (const [a, b] of [[[cx - 2, cy - 2], [cx + 2, cy - 2]], [[cx + 2, cy - 2], [cx + 2, cy + 2]], [[cx + 2, cy + 2], [cx - 2, cy + 2]], [[cx - 2, cy + 2], [cx - 2, cy - 2]]] as [XY, XY][])
    panel(win, a, b, 0.5, 3.5, top + 0.9, top + 2.9, 0.05)
  hipRoof(roof, cx - 2, cy - 2, cx + 2, cy + 2, top + 3.4, 2.2, 0.35, 0.2)

  // the round turret where the restaurant bay meets the north block
  const T: XY = [28.6, 14.2], TR = 4.2
  walls(stone, circle(T[0], T[1], TR, 14), 0, EAVE + 2.4)
  cone(roof, T[0], T[1], TR + 0.5, EAVE + 2.4, EAVE + 11, 14)
  // the big chimney on the main ridge
  block(stone, roof, rect(6, 6, 8, 8.4), EAVE + 4, EAVE + 9.8, 0.2)
  // a pale string course at the first floor round the main walls
  for (let i = 0; i < body.length; i++) {
    const a = body[i], b = body[(i + 1) % body.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 3) panel(trim, a, b, 0, L, 4.0, 4.35, 0.06)
  }

  // --- the covered footbridge over the Niagara Parkway, and the stair
  // pavilion on the escarpment at its west end
  const DECK = 6.6, BX0 = -67.2, BX1 = -33
  const bridge = rect(BX0, 10, BX1, 15)
  block(stone, null, bridge, DECK, DECK + 0.9, 0)
  cap(stone, bridge, DECK, false)
  walls(glass, bridge, DECK + 0.9, DECK + 3.2)
  gableRoof(roof, stone, BX0, 10, BX1, 15, DECK + 3.2, 1.2, true, 0.35, 0.25)
  // a stone pier on each side of the road
  block(stone, null, rect(-45.5, 10.8, -43.5, 14.2), 0, DECK, 0)
  const cross: XY[] = [[-74.8, 5.2], [-67.4, 5.2], [-67.4, 9.9], [-67.1, 9.9], [-67.1, 19.4], [-74.3, 19.3], [-74.3, 15.9], [-79.5, 15.9], [-79.5, 10.3], [-74.8, 10.4]]
  walls(stone, densify(cross, 4), 0, DECK + 3.6)
  hipRoof(roof, -74.8, 5.2, -67.1, 19.4, DECK + 3.6, 3.0, 0.4)
  hipRoof(roof, -79.5, 10.3, -74.8, 15.9, DECK + 3.2, 2.2, 0.4)
  for (const [a, b] of [[[-67.1, 19.4], [-74.3, 19.3]], [[-74.8, 5.2], [-67.4, 5.2]]] as [XY, XY][]) panel(win, a, b, 1.2, 6.0, DECK + 0.6, DECK + 2.8)

  return [
    { part: stone, material: finish('table-rock-sandstone', 0xc2ab8c) },
    { part: roof, material: finish('table-rock-bronze-roof', 0x5e4b46) },
    { part: win, material: PALETTE.window },
    { part: trim, material: PALETTE.trim },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('niagara-table-rock-centre', 'Table Rock Centre', [43.079237, -79.07894], 13.6, build())
