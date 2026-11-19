/**
 * Vancouver Convention Centre, West building (1055 Canada Place, Coal
 * Harbour; LMN Architects with DA Architects + Planners and MCM, 2009) —
 * original procedural geometry, CC0-1.0.  bun generators/van-convention-centre-west.ts
 *
 * Identity, in order: the long, thin roof plane over the halls, planted as
 * the six-acre living roof, folded into facets that tilt against each other
 * (the east hall rises to a sharp cantilevered prow over the water at the
 * north-east corner, the central hall falls toward the harbour, the west
 * end slopes down toward Coal Harbour Park); the deep overhang and its thin
 * edge; the glass walls, three or four storeys tall, with pale floor lines;
 * the concrete pier deck the building stands on over Burrard Inlet.
 *
 * Frame: x east, y north, z up (map frame of mesh.ts), metres, bearing 0.
 * Origin at the anchor (-123.1159782, 49.2890390), 180 m west and 60 m north
 * of the survey origin (-123.1135, 49.2885) used to read OSM and lidar.
 * z = 0 is the water of Burrard Inlet (lidar ~0-1 m on the water beside the
 * pier), the lowest ground under the footprint: the east and north walls
 * stand on the pier over the water, so the model runs down to it. The land
 * side (Canada Place street, ~14-15 m) buries the bottom of the south and
 * west walls, as STYLE.md asks for on a slope.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/85240507 (building=yes,
 *   4 levels, roof:colour #8c8885, wikidata Q2742735) and its skillion
 *   building:parts way/1526189023 (east hall, roof:direction 220),
 *   way/1526189024 (central hall, roof:direction 40), way/1526189025 (south
 *   band, 220), way/1526189026 (west end, 290), way/1526189027 (the flat
 *   strip between the halls). Walls follow these lines.
 * - Lidar: NRCan HRDEM "BC-Lower_Mainland_2016-1m" DSM and DTM
 *   (CanElevation series, Open Government Licence - Canada; flown 2016,
 *   after the 2009 opening), resampled to a 1 m east/north grid on the survey
 *   origin. Roof planes fitted to the DSM per OSM part (rms 0.4-2 m); the roof
 *   edge, with its overhang, traced from the DSM at 26 m. The City of
 *   Vancouver's own 2022 lidar (Open Government Licence - Vancouver) would
 *   also be usable but its download is behind a browser challenge.
 * Photos (evidence):
 * - "Vancouver Convention Centre Exterior Day.jpg", DarkNight0917, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Vancouver_Convention_Centre_Exterior_Day.jpg
 *   (north-east: the prow, glass walls, pier deck).
 * - "Vancouver Convention Centre from Seawall.jpg", Ash-M-Bishop, CC0
 *   https://commons.wikimedia.org/wiki/File:Vancouver_Convention_Centre_from_Seawall.jpg
 *   (from the west: the living roof's facets and colour).
 * - "Vancouver Convention Centre - Centre des congrès de Vancouver - panoramio.jpg",
 *   Bohao Zhao, CC BY 3.0 (north side from the water).
 * - "Vancouver Convention Centre, Vancouver, Canada (Unsplash).jpg", Scott
 *   Webb, CC0 (east end over the water).
 * - "Vancouver-convention-centre-west-2.jpg", Gregbaker, CC BY-SA 3.0
 *   (north-west corner, floor lines).
 * - "Vancouver Convention Centre from Coal Harbour Park.jpg", Joe Mabel,
 *   CC BY-SA 4.0 (west end, the roof sloping to the park).
 * - "Vancouver Convention Centre.jpg", IntensionalLogican, CC0 (north wall).
 * - Night: "The Vancouver Convention Centre (6911736603).jpg", Reg
 *   Natarajan, CC BY 2.0 (glass walls lit warm, roof dark).
 *
 * Numbers (lidar unless marked):
 * - Roof top 45 m at the prow tip, 41-42 m along the south-west edge of the
 *   central hall, 34 m along its harbour edge, 33 m in the strip between the
 *   halls, 27-33 m over the west end, 28-34 m over the south band.
 * - Overhang: 5-8 m on the north and east, ~25 m at the north-east prow
 *   (DSM roof edge against the OSM walls).
 * - Pier deck and harbour walkway 9-10 m above the water (DTM), the street
 *   on the south 14-15 m.
 * - Roof slab 0.7 m at the edge, a knife-thin blade (estimated from
 *   photos); floor bands every ~6 m and mullion lines every ~9 m (estimated;
 *   four levels per OSM).
 * - Pier (Scott Webb's photo): a dark concrete plinth to 3 m at the water,
 *   a continuous row of pale columns at most 9 m apart 1.5 m in from the
 *   deck edge on every side, the shaded wall 4 m in, the pale deck slab at
 *   10 m (column spacing estimated).
 * - Colours: living roof olive green with dry patches (Ash-M-Bishop's photo),
 *   pulled to the palette's lightness; the roof edge pale; the soffit
 *   warm Douglas-fir wood; glass light blue-grey; plinth dark concrete.
 *
 * Night: the glass walls glow (`window`); the roof's wood soffit carries
 * _FLOODLIGHT, lit warm under the overhang as in the night photo; the
 * planted roof and the pier stay dark.
 *
 * Doubts
 * - The living roof's paths, skylights and plant, the glass slot at the
 *   west end, the stairs, terraces and canopies on the plaza side and the
 *   Olympic cauldron (a separate object, not part of OSM's outline) are left
 *   out.
 * - The south band's roof is not one plane (rms 2.2 m); drawn as one.
 * - The harbour walkway around the building, on the same pier, is not part
 *   of the outline and is left to the map.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { save, triangulate, inset, type XY } from './chi-aon-center'

const CONC = finish('vcc-concrete', 0xe4e1da) // the pale deck slab and its columns
const GREEN = finish('vcc-living-roof', 0x9aa772)
// The heavy plinth at the waterline and the shade behind the columns.
const SHADE = finish('vcc-plinth', 0x6f6a64)
// The roof's underside: the Douglas-fir soffit, warm in every photo.
const WOOD = finish('vcc-soffit', 0xc79a6b)
// The curtain walls read light and glassy: they reflect the harbour sky.
const WIN = { ...PALETTE.window, color: 0x9db4c4 }
const TRIM = PALETTE.trim // floor bands, mullions and the knife-thin roof edge

const conc = new Part(), green = new Part(), shade = new Part(), wood = new Part(), win = new Part(), trim = new Part()
const edge = trim

// Survey frame → model frame.
const OX = -180, OY = 60
const L = (r: XY[]): XY[] => r.map(([x, y]) => [x - OX, y - OY] as XY)

// Roof planes fitted to the 2016 DSM (survey frame): z = a + b x + c y.
type Plane = [number, number, number]
const PL: Record<string, Plane> = {
  E: [41.15, 0.0614, 0.0586],
  C: [39.63, -0.0236, -0.0707],
  S: [37.94, 0.0375, 0.1691],
  W: [69.34, 0.1363, -0.0451],
  G: [33.4, 0, 0],
}
const zOf = (p: Plane, [x, y]: XY) => p[0] + p[1] * (x + OX) + p[2] * (y + OY)

// Walls: the OSM parts (survey frame, counter-clockwise).
const WALLS: Record<string, XY[]> = {
  E: [[-129.3, 3.1], [-61.8, 91.0], [-119.8, 115.6], [-121.0, 112.4], [-157.9, 20.6]],
  C: [[-177.5, 30.7], [-141.9, 121.1], [-140.8, 123.7], [-203.7, 149.1], [-249.2, 53.4]],
  S: [[-146.5, -26.3], [-129.3, 3.1], [-157.9, 20.6], [-177.5, 30.7], [-249.2, 53.4], [-260.5, 29.1], [-247.4, 16.6], [-191.2, -7.3]],
  W: [[-249.2, 53.4], [-203.7, 149.1], [-294.2, 61.4], [-260.5, 29.1]],
  G: [[-177.5, 30.7], [-157.9, 20.6], [-121.0, 112.4], [-141.9, 121.1]],
}
// Roof facets: the same parts pushed out to the DSM roof edge, overhang included.
const ROOFS: Record<string, XY[]> = {
  E: [[-132, 1], [-67, 77], [-44, 115], [-115, 129], [-121.5, 114.5], [-157.9, 20.6]],
  C: [[-177.5, 30.7], [-140.5, 122.5], [-138, 136], [-203, 155], [-249.2, 53.4]],
  S: [[-149, -27], [-132, 1], [-157.9, 20.6], [-177.5, 30.7], [-249.2, 53.4], [-263, 29], [-249, 13], [-191, -9]],
  W: [[-249.2, 53.4], [-203, 155], [-298, 60.5], [-263, 29]],
  G: [[-177.5, 30.7], [-157.9, 20.6], [-121.5, 114.5], [-126, 117], [-140.5, 122.5]],
}

const DECK = 10 // pier deck / walkway level
const T = 0.7 // roof slab at the edge: a thin blade (photos)

/** A planar cap over a counter-clockwise ring, heights from a plane. */
function capPlane(p: Part, r: XY[], pl: Plane, dz: number, up: boolean) {
  for (const [a, b, c] of triangulate(r)) {
    const P = (k: number): V3 => [r[k][0], r[k][1], zOf(pl, r[k]) + dz]
    if (up) p.tri(P(a), P(b), P(c)); else p.tri(P(a), P(c), P(b))
  }
}

// The pier deck under the whole roof, overhang included (the DSM roof edge):
// the plaza and harbour walk the roof shelters, at the deck level.
const DECK_RING: XY[] = L([
  [-149, -27], [-132, 1], [-67, 77], [-44, 115], [-115, 129], [-126, 117], [-140.5, 122], [-138, 136],
  [-203, 155], [-298, 60.5], [-263, 29], [-249, 13], [-191, -9],
])

// ---------------------------------------------------------------------------
// Pier (Scott Webb's photo): a dark concrete plinth at the waterline under the
// whole deck, pale columns standing on it under the deck's edge, the shaded
// wall set back behind them, and the pale deck slab at 10 m.
const PLINTH = 3, SLAB = 1.2
// The shaded wall stands 4 m in from the deck edge all round, so the column
// row runs clear in front of it on every side, corners and prow included.
const BACK = inset(DECK_RING, 4), COLS = inset(DECK_RING, 1.5)
for (let i = 0; i < BACK.length; i++) {
  const a = BACK[i], b = BACK[(i + 1) % BACK.length]
  shade.quad([a[0], a[1], PLINTH], [b[0], b[1], PLINTH], [b[0], b[1], DECK - SLAB], [a[0], a[1], DECK - SLAB])
}
for (let i = 0; i < DECK_RING.length; i++) {
  const a = DECK_RING[i], b = DECK_RING[(i + 1) % DECK_RING.length]
  conc.quad([a[0], a[1], DECK - SLAB], [b[0], b[1], DECK - SLAB], [b[0], b[1], DECK], [a[0], a[1], DECK])
  shade.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], PLINTH], [a[0], a[1], PLINTH])
}
// columns: one at every corner of the row and at most 9 m apart between
for (let i = 0; i < COLS.length; i++) {
  const a = COLS[i], b = COLS[(i + 1) % COLS.length]
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], n: XY = [u[1], -u[0]]
  const k = Math.max(1, Math.ceil(len / 9))
  for (let q = 0; q < k; q++) {
    const s0 = (len * q) / k, c: XY = [a[0] + u[0] * s0, a[1] + u[1] * s0], h = 0.5
    const R: XY[] = [[c[0] - u[0] * h + n[0] * h, c[1] - u[1] * h + n[1] * h], [c[0] - u[0] * h - n[0] * h, c[1] - u[1] * h - n[1] * h],
      [c[0] + u[0] * h - n[0] * h, c[1] + u[1] * h - n[1] * h], [c[0] + u[0] * h + n[0] * h, c[1] + u[1] * h + n[1] * h]]
    for (let m = 0; m < 4; m++) {
      const p = R[m], r = R[(m + 1) % 4]
      conc.quad([p[0], p[1], PLINTH], [r[0], r[1], PLINTH], [r[0], r[1], DECK - SLAB], [p[0], p[1], DECK - SLAB])
    }
  }
}
for (const [a, b, c] of triangulate(DECK_RING)) {
  const P = (k: number, z: number): V3 => [DECK_RING[k][0], DECK_RING[k][1], z]
  conc.tri(P(a, DECK), P(b, DECK), P(c, DECK))
  shade.tri(P(a, DECK - SLAB), P(c, DECK - SLAB), P(b, DECK - SLAB))
}

// Glass walls under each facet, from the deck to the roof slab, with floor
// bands and mullions on every wall (inner ones show where a facet steps up).
for (const k of Object.keys(WALLS)) {
  const r = L(WALLS[k]), pl = PL[k]
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const za = zOf(pl, a) - T, zb = zOf(pl, b) - T
    win.quad([a[0], a[1], DECK], [b[0], b[1], DECK], [b[0], b[1], zb], [a[0], a[1], za])
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / len, -(b[0] - a[0]) / len]
    // floor bands end to end, clipped only where the sloping roof comes down over them
    for (const z of [DECK + 0.2, 16, 22, 28]) {
      const top = z + 1.2, fa = za - top, fb = zb - top
      if (fa < 0 && fb < 0) continue
      const t0 = fa >= 0 ? 0 : fa / (fa - fb), t1 = fb >= 0 ? 1 : fa / (fa - fb)
      const P = (t: number, dz: number, o: number): V3 => [a[0] + (b[0] - a[0]) * t + n[0] * o, a[1] + (b[1] - a[1]) * t + n[1] * o, z + dz]
      trim.quad(P(t0, 0, 0.4), P(t1, 0, 0.4), P(t1, 0.9, 0.4), P(t0, 0.9, 0.4))
      trim.quad(P(t0, 0.9, 0.4), P(t1, 0.9, 0.4), P(t1, 0.9, 0), P(t0, 0.9, 0))
    }
    // mullion lines: one at each corner and at most 9 m apart, deck to roof
    const k = Math.max(1, Math.ceil(len / 9))
    for (let q = 0; q < k; q++) {
      const t = q / k, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, z1 = za + (zb - za) * t
      const ux = (b[0] - a[0]) / len * 0.18, uy = (b[1] - a[1]) / len * 0.18, o = 0.2
      trim.quad([x - ux + n[0] * o, y - uy + n[1] * o, DECK], [x + ux + n[0] * o, y + uy + n[1] * o, DECK],
        [x + ux + n[0] * o, y + uy + n[1] * o, z1], [x - ux + n[0] * o, y - uy + n[1] * o, z1])
    }
  }
}

// ---------------------------------------------------------------------------
// The roof: one slab per facet, planted on top, a thin pale edge, wood soffit.
for (const k of Object.keys(ROOFS)) {
  const r = L(ROOFS[k]), pl = PL[k]
  capPlane(green, r, pl, 0, true)
  capPlane(wood, r, pl, -T, false)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const za = zOf(pl, a), zb = zOf(pl, b)
    edge.quad([a[0], a[1], za - T], [b[0], b[1], za - T + (zb - za)], [b[0], b[1], zb], [a[0], a[1], za])
  }
}

if (import.meta.main) {
  await save('van-convention-centre-west', 'Vancouver Convention Centre West', [-123.1159782, 49.2890390], 0, [
    { part: conc, material: CONC as Swatch },
    { part: green, material: GREEN },
    { part: shade, material: SHADE },
    // the wood soffit is lit warm under the overhang at night (Natarajan's night photo)
    { part: wood, material: { ...WOOD, floodlight: (_p: V3, n: V3) => (n[2] < -0.5 ? 0.8 : 0) } as Swatch },
    { part: win, material: WIN },
    { part: trim, material: TRIM },
  ], 5000)
}
