/**
 * Cathedral-Basilica of Saint Louis, King of France, Jackson Square, New
 * Orleans (1789; rebuilt 1849-51 to J. N. B. de Pouilly's design) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nola-st-louis-cathedral.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 307: model +y runs up the nave
 * from the Jackson Square front (model −y, facing compass 127°, south-east
 * over the square) to the St. Anthony's Garden end (Royal Street). The front
 * is square to Chartres Street (compass 37°). Anchor: the area centroid of
 * the OSM outline way/329364492. Everything is drawn about x = 0 and
 * shifted XC = −0.25 m at the end, where the OSM towers and nave centre lie.
 *
 * Identity, in order: the white stucco front with three slate-black spires
 * (the tall central spire on a square clock-and-belfry tower, its lucarnes;
 * two shorter hexagonal towers with hexagonal spires); the two-storey front
 * with paired columns either side of the central door and the round-headed
 * openings, the attic with the clock under a pediment; the long nave with
 * its shallow grey roof over lean-to aisles; the rear end on St. Anthony's
 * Garden with its pediment, clock and scrolls. The garden is ground (the
 * map's); the Cabildo and Presbytère either side are separate models.
 *
 * Evidence
 * - OSM way/329364492 (outline, building=cathedral; its height=14 is wrong)
 *   and its parts way/1548295055 (nave, 14 m wide), way/1548295056 and
 *   way/1548295057 (the hexagonal side towers, R 2.6 m, flat face forward),
 *   way/1548295058 and way/1548295059 (the central tower, 7.0 x 6.3 m).
 *   In the model frame the outline spans x −15.1..14.9, y −28 (front;
 *   towers to −30.1) .. 27.6 (rear; the nave end to 29.0).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid, read in the model frame. Ground ~0.5 m over the grid's
 *   minimum all round (z = 0). Nave ridge 22.9, nave eaves 20.0 (x ±7);
 *   aisle roofs falling from 15.0 at the clerestory to 12.9 at the outer
 *   walls (parapets to 13.7); front attic 22.3 at its outer piers, pediment
 *   ~21.5; side-tower tops 20.5 (the ring round each spire's foot); central
 *   tower top 30.5-30.9 (the ring round the spire's foot); rear pediment
 *   ~23. No returns at all come back from the three slate spires (empty
 *   cells inside each ring, in every class), so their heights are scaled
 *   from photos against the lidar tower tops.
 * - Terrain (Mapterhorn): flat within 0.6 m over the site. elevation 0.
 * - NAIP (USGS, public domain): the grey roofs, white pilaster caps along
 *   the aisle walls.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Cathedral new orleans.jpg", Krakers (assumed by Commons; no
 *     machine-readable author), CC BY-SA 3.0, face-on from Jackson Square: every front proportion,
 *     opening, the spires
 *     https://commons.wikimedia.org/wiki/File:Cathedral_new_orleans.jpg
 *   - "St. Louis Cathedral (New Orleans).jpg", Royalpt78, CC BY-SA 3.0, far
 *     face-on from Decatur Street (spire heights scaled at 9.6 px/m from the
 *     two lidar tower tops: central tip 48 m, side tips 32.3 m)
 *     https://commons.wikimedia.org/wiki/File:St._Louis_Cathedral_(New_Orleans).jpg
 *   - "StLouisCathedralLowSideJackson29Jan07.jpg", Infrogmation, CC BY 2.5,
 *     three-quarter from the south (the hexagonal tower, the projecting
 *     front, the aisle side, the spire lucarnes)
 *     https://commons.wikimedia.org/wiki/File:StLouisCathedralLowSideJackson29Jan07.jpg
 *   - "StLouisCathedralRoofFromArsanal.jpg", Infrogmation, CC BY 2.5, the
 *     nave roof, clerestory and central tower from the Cabildo side
 *     https://commons.wikimedia.org/wiki/File:StLouisCathedralRoofFromArsanal.jpg
 *   - "Rear view of St Louis Cathedral, New Orleans, across St Anthony's
 *     Garden, January 2012.jpg", Turbine682, CC BY-SA 4.0 (the rear)
 *     https://commons.wikimedia.org/wiki/File:Rear_view_of_St_Louis_Cathedral,_New_Orleans,_across_St_Anthony%27s_Garden,_January_2012.jpg
 *   - "St. Louis Cathedral from the back - famous shadow - New Orleans Sept
 *     2016.jpg", Peter Burka, CC BY-SA 2.0 (the rear, floodlit at night)
 *     https://commons.wikimedia.org/wiki/File:St._Louis_Cathedral_from_the_back_-_famous_shadow_-_New_Orleans_Sept_2016.jpg
 *   - "St. Louis Cathedral, Jackson Square, French Quarter, New Orleans,
 *     Louisiana 2.jpg", Ken Lund (from Las Vegas), CC BY-SA 2.0 (night: the whole front and
 *     towers floodlit to the spires' feet, spires dark, the clock lit)
 *     https://commons.wikimedia.org/wiki/File:St._Louis_Cathedral,_Jackson_Square,_French_Quarter,_New_Orleans,_Louisiana_2.jpg
 *   - "Pirate's Alley, New Orleans, April 2023.jpg", edenpictures, CC BY 2.0
 *     (the pilastered aisle wall on the Cabildo side)
 *     https://commons.wikimedia.org/wiki/File:Pirate%27s_Alley,_New_Orleans,_April_2023.jpg
 * - Published: Wikipedia, "St. Louis Cathedral (New Orleans)": rebuilt
 *   1849-51 to de Pouilly's plans, keeping the side walls and the lower
 *   towers. No published height was found.
 *
 * Measured (lidar): nave eaves 20.0 and ridge 23.2, aisle roofs 13.5-15.4,
 * attic piers 22.4, side-tower cornice 20.6, central-tower cornice 30.4,
 * rear pediment 23.4, the plan. Estimated from the face-on photo (23 px/m
 * vertical, calibrated on those): the storey lines (lower entablature
 * 5.4-6.6, upper 12.6-14.4), every opening's size and height, the columns
 * (r 0.32), the central spire's tip (48.0; the cross to 51) and its
 * lucarnes, the side spires' tips (32.3). Spires sit inside their tower
 * cornices with a ledge round them: side spires 4.1 m across the
 * vertices at the foot, 11.7 m tall (tip/base 3.0 from the face-on photo:
 * 273 px tall against a 100 px base); the central spire 4.8 m across
 * the flats on a 7.7 m cornice. The side walls' windows (two
 * tiers per bay, round-headed) follow the rear aisle ends; no photo shows a
 * whole side face-on (the alleys are 3-4 m wide), so their count is
 * estimated. The clerestory's small windows follow the Arsenal photo.
 * Left out: the balustrades, carved ornament, the spires' diamond slates,
 * weathervanes, the fence and fountain (ground).
 *
 * Doubts: the brief's "about 40 m" for the central spire is below what the
 * photos give against the lidar (48 m to the tip); the photo-scaled figure
 * is used. The tower spires return no lidar points.
 *
 * Night: the front, the towers to their cornices and the rear end are
 * floodlit (`floodlight`), the spires stay dark; both clock faces are lit
 * (`neon-clock`, white); the windows glow (`window`), the doors are
 * dark `window` panels (glowing open doors), so the order can have its
 * own brighter `stl-trim` (pilasters, columns, entablatures, pediment,
 * surrounds) against the `stl-stucco` walls.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, column, archPanel, rectPanel, discPanel, band, dome } from './nyc-city-hall'

const XC = -0.25
const stucco = new Part(), trim = new Part(), roof = new Part(), slate = new Part(), win = new Part(), clock = new Part()

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/** A wall plane for panels: front (y = c, facing −y), rear (+y), west (x = c, −x), east (+x). */
type Side = 'front' | 'rear' | 'west' | 'east'
const wall = (side: Side, c: number): [XY, XY, (t: number) => number] => {
  switch (side) {
    case 'front': return [[-60, c], [60, c], (x) => x + 60]
    case 'rear': return [[60, c], [-60, c], (x) => 60 - x]
    case 'west': return [[c, 60], [c, -60], (y) => 60 - y]
    case 'east': return [[c, -60], [c, 60], (y) => y + 60]
  }
}
/** A round-headed panel centred at t (x along front/rear, y along the sides). */
const arch = (p: Part, side: Side, c: number, t: number, w: number, z0: number, zTop: number, d = 0.05) => {
  const [a, b, s] = wall(side, c); archPanel(p, a, b, s(t), w, z0, zTop, d, 8)
}
const rect = (p: Part, side: Side, c: number, t: number, w: number, z0: number, z1: number, d = 0.05) => {
  const [a, b, s] = wall(side, c); rectPanel(p, a, b, s(t), w, z0, z1, d)
}
const disc = (p: Part, side: Side, c: number, t: number, z: number, r: number, d = 0.05, n = 14) => {
  const [a, b, s] = wall(side, c); discPanel(p, a, b, s(t), z, r, d, n)
}
const rectRing = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** A convex polygon (or one star-shaped about `centre`) in the x–z plane, extruded along y. */
function slabY(p: Part, poly: [number, number][], y0: number, y1: number, centre?: [number, number]) {
  const c = centre ?? [poly.reduce((s, q) => s + q[0], 0) / poly.length, poly.reduce((s, q) => s + q[1], 0) / poly.length]
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    // front (−y) and back (+y) faces, fanned from the centre
    tri(p, [c[0], y0, c[1]], [a[0], y0, a[1]], [b[0], y0, b[1]], [0, -1, 0])
    tri(p, [c[0], y1, c[1]], [a[0], y1, a[1]], [b[0], y1, b[1]], [0, 1, 0])
    let nx = b[1] - a[1], nz = -(b[0] - a[0])
    const mx = (a[0] + b[0]) / 2 - c[0], mz = (a[1] + b[1]) / 2 - c[1]
    if (nx * mx + nz * mz < 0) { nx = -nx; nz = -nz }
    const l = Math.hypot(nx, nz) || 1
    quad(p, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], [nx / l, 0, nz / l])
  }
}
/** Same in the y–z plane, extruded along x. */
function slabX(p: Part, poly: [number, number][], x0: number, x1: number) {
  const c: [number, number] = [poly.reduce((s, q) => s + q[0], 0) / poly.length, poly.reduce((s, q) => s + q[1], 0) / poly.length]
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    tri(p, [x0, c[0], c[1]], [x0, a[0], a[1]], [x0, b[0], b[1]], [-1, 0, 0])
    tri(p, [x1, c[0], c[1]], [x1, a[0], a[1]], [x1, b[0], b[1]], [1, 0, 0])
    let ny = b[1] - a[1], nz = -(b[0] - a[0])
    const my = (a[0] + b[0]) / 2 - c[0], mz = (a[1] + b[1]) / 2 - c[1]
    if (ny * my + nz * mz < 0) { ny = -ny; nz = -nz }
    const l = Math.hypot(ny, nz) || 1
    quad(p, [x0, a[0], a[1]], [x0, b[0], b[1]], [x1, b[0], b[1]], [x1, a[0], a[1]], [0, ny / l, nz / l])
  }
}
/** A triangle / quad wound to face along n (flat-shaded). */
function tri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const g = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  if (Math.hypot(g[0], g[1], g[2]) < 1e-9) return
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) { tri(p, a, b, c, n); tri(p, a, c, d, n) }

/** A regular polygon ring, CCW; `phase` of the first vertex from +x. */
const ngon = (cx: number, cy: number, r: number, n: number, phase = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(phase + (i * 2 * Math.PI) / n), cy + r * Math.sin(phase + (i * 2 * Math.PI) / n)] as XY)

/** A faceted spire: lofted rings (XY rings at heights) to an apex. */
function spire(p: Part, rings: [XY[], number][], apex: V3) {
  const R = rings.map(([r, z]) => r.map(([x, y]) => [x, y, z] as V3))
  p.loft(R)
  const top = R[R.length - 1]
  for (let i = 0; i < top.length; i++) p.tri(top[i], top[(i + 1) % top.length], apex)
}

/** A thin cross standing at (x, y, z0): stem h, arm w at 70%. */
function cross(p: Part, x: number, y: number, z0: number, h: number, w: number, t: number) {
  block(p, x - t / 2, y - t / 2, x + t / 2, y + t / 2, z0, z0 + h)
  block(p, x - w / 2, y - t / 2, x + w / 2, y + t / 2, z0 + h * 0.62, z0 + h * 0.62 + t)
}

// ---------------------------------------------------------------------------
// Dimensions
// ---------------------------------------------------------------------------

const YF = -28.0          // front wall (frontispiece)
const YW = -27.6          // the wings, set back
const NX = 7.2            // nave half-width (and frontispiece)
const AX = 15.0           // aisle outer walls
const YR = 27.6           // aisle rear walls
const YN = 29.0           // nave end, projecting
const TX = 12.55, TY = -27.8, TR = 2.6   // hexagonal towers (flat face forward)
const L1 = 5.4, L2 = 6.6  // lower entablature
const U1 = 12.6, U2 = 14.4 // upper entablature
const ATT = 20.6          // attic cornice top
const EAVE = 20.0, RIDGE = 23.2
const AIS_OUT = 13.6, AIS_IN = 15.4
const CT = { x0: -3.5, x1: 3.5, y0: -27.6, y1: -21.3, top: 29.6, cor: 30.4 } // central tower
const CY = (CT.y0 + CT.y1) / 2
const SPIRE_TIP = 48.0, SIDE_TIP = 32.3

// ---------------------------------------------------------------------------
// The nave and aisles
// ---------------------------------------------------------------------------

// Nave/clerestory block from behind the frontispiece to the rear end.
prism({ wall: stucco, win: null, roof: null, ring: rectRing(-NX, -21.0, NX, YN), z0: 0, z1: EAVE, facade: null, bevel: 0.25 })
// Eaves cornices along the clerestory, and over the rear end.
for (const s of [-1, 1]) block(stucco, s < 0 ? -NX - 0.35 : NX - 0.05, -21.0, s < 0 ? -NX + 0.05 : NX + 0.35, YN, EAVE - 0.5, EAVE)
// The nave roof: a shallow gable, overhanging the clerestory.
{
  const xe = NX + 0.4, ze = EAVE - 0.1, ya = -21.2, yb = YN - 0.2
  for (const s of [-1, 1]) quad(roof, [s * xe, ya, ze], [0, ya, RIDGE], [0, yb, RIDGE], [s * xe, yb, ze], [s * (RIDGE - ze) / xe, 0, 1])
  // Its front gable end, behind the central tower and over the frontispiece.
  slabY(stucco, [[-xe, ze], [xe, ze], [0, RIDGE]], ya, ya + 0.3)
}
// Clerestory windows: small square-headed lights over the aisle roofs.
const BAYS = 11, B0 = -21.0, B1 = YR - 0.4, BP = (B1 - B0) / BAYS
for (let i = 0; i < BAYS; i++) {
  const y = B0 + (i + 0.5) * BP
  rect(win, 'west', -NX, y, 1.3, 16.1, 17.5)
  rect(win, 'east', NX, y, 1.3, 16.1, 17.5)
}

// Aisles: walls to the parapet, lean-to roofs rising to the clerestory.
for (const s of [-1, 1]) {
  const xo = s * AX, xi = s * NX
  prism({ wall: stucco, win: null, roof: null, ring: rectRing(Math.min(xo, xi), YW, Math.max(xo, xi), YR), z0: 0, z1: AIS_OUT, facade: null, bevel: 0.2 })
  // the sloped end walls, front and rear, up to the clerestory
  slabY(stucco, [[xo, AIS_OUT], [xi, AIS_OUT], [xi, AIS_IN + 0.4], [xo, AIS_OUT + 0.4]], YR - 0.35, YR)
  slabY(stucco, [[xo, AIS_OUT], [xi, AIS_OUT], [xi, AIS_IN + 0.4], [xo, AIS_OUT + 0.4]], YW, YW + 0.35)
  // the roof, a little inside the parapet
  const xr = s * (AX - 0.35)
  quad(roof, [xr, YW + 0.3, AIS_OUT - 0.15], [xi, YW + 0.3, AIS_IN], [xi, YR - 0.3, AIS_IN], [xr, YR - 0.3, AIS_OUT - 0.15], [s * 0.25, 0, 1])
  // parapet coping along the outer wall
  block(stucco, s < 0 ? -AX - 0.2 : AX - 0.45, YW, s < 0 ? -AX + 0.45 : AX + 0.2, YR, AIS_OUT - 0.45, AIS_OUT)
  // pilasters along the side, their caps standing over the parapet
  const side: Side = s < 0 ? 'west' : 'east'
  for (let i = 0; i <= BAYS; i++) {
    const y = B0 + i * BP
    if (y < -24.5) continue
    block(stucco, s < 0 ? -AX - 0.3 : AX - 0.1, y - 0.45, s < 0 ? -AX + 0.1 : AX + 0.3, y + 0.45, 0, AIS_OUT + 0.6)
  }
  // two tiers of round-headed windows per bay
  for (let i = 0; i < BAYS; i++) {
    const y = B0 + (i + 0.5) * BP
    arch(win, side, xo, y, 1.4, 2.2, 6.2)
    arch(win, side, xo, y, 1.3, 8.2, 11.4)
  }
}

// ---------------------------------------------------------------------------
// The front
// ---------------------------------------------------------------------------

// Frontispiece (the nave's front, three storeys) and the wings either side.
prism({ wall: stucco, win: null, roof: stucco, ring: rectRing(-NX, YF, NX, -21.0), z0: 0, z1: ATT, facade: null, bevel: 0.25 })
for (const s of [-1, 1]) {
  const x0 = s * NX, x1 = s * (TX - TR + 0.1)
  prism({ wall: stucco, win: null, roof: stucco, ring: rectRing(Math.min(x0, x1), YW, Math.max(x0, x1), YW + 1.6), z0: 0, z1: U2, facade: null, bevel: 0.1 })
}
// The classical order. Proud paired pilasters frame the frontispiece and
// the wings; two bold entablatures run across the whole front at the
// first-storey line and the top of the second storey, breaking forward
// over every column pair and pilaster pair.
block(trim, -TX + TR - 0.1, YF - 0.35, TX - TR + 0.1, YF, 0, 0.5)
const WX = TX - TR + 0.1                  // where the wings meet the towers
const pilasterPairs = [6.85, 9.55]       // frontispiece edge, wing/tower edge
for (const s of [-1, 1]) for (const [z0, z1] of [[0.5, L1], [L2, U1], [U2, ATT - 0.6]] as [number, number][]) {
  for (const xc of pilasterPairs) {
    if (xc > 8 && z0 >= U2) continue     // the wings stop at the second storey
    const yb = xc > 8 ? YW : YF
    for (const d of [-0.33, 0.33]) block(trim, s * xc + d - 0.24, yb - 0.5, s * xc + d + 0.24, yb, z0, z1)
  }
  // attic pilasters either side of the clock bay
  if (z0 >= U2) for (const xc of [4.3]) block(trim, s * xc - 0.3, YF - 0.4, s * xc + 0.3, YF, z0, z1)
}
for (const [z0, z1] of [[L1, L2], [U1, U2]] as [number, number][]) {
  // frieze across the frontispiece and the wings
  block(trim, -NX, YF - 0.6, NX, YF, z0, z1)
  for (const s of [-1, 1]) block(trim, Math.min(s * NX, s * WX), YW - 1.0, Math.max(s * NX, s * WX), YW, z0, z1)
  // breaks over the column pairs and the pilaster pairs
  for (const s of [-1, 1]) {
    block(trim, Math.min(s * 1.95, s * 4.05), YF - 1.05, Math.max(s * 1.95, s * 4.05), YF - 0.6, z0, z1)
    block(trim, Math.min(s * 6.25, s * 7.45), YF - 0.75, Math.max(s * 6.25, s * 7.45), YF - 0.6, z0, z1)
  }
  // the cornice lip, the boldest line on the front
  block(trim, -WX, YF - 0.95, WX, YF - 0.2, z1 - 0.35, z1)
  for (const s of [-1, 1]) block(trim, Math.min(s * 1.85, s * 4.15), YF - 1.3, Math.max(s * 1.85, s * 4.15), YF - 0.9, z1 - 0.35, z1)
}
// Paired columns, both storeys, either side of the central bay.
for (const s of [-1, 1]) for (const x of [2.45, 3.55]) {
  column(trim, s * x, YF - 0.75, 0.32, 0.5, L1, { n: 12, base: 0.35, cap: 0.3 })
  column(trim, s * x, YF - 0.75, 0.3, L2, U1, { n: 12, base: 0.45, cap: 0.3 })
}

// Attic: full width to its cornice, the outer piers rising past it (carried
// back to the nave so nothing shows between them and the tower), and the
// pediment over the clock, standing proud.
block(trim, -NX - 0.35, YF - 0.7, NX + 0.35, YF + 0.2, ATT - 0.6, ATT)
for (const s of [-1, 1]) {
  const xa = Math.min(s * 3.5, s * NX), xb = Math.max(s * 3.5, s * NX)
  prism({ wall: stucco, win: null, roof: stucco, ring: rectRing(xa, YF, xb, -21.0), z0: ATT, z1: 22.0, facade: null, bevel: 0.1 })
  block(trim, Math.min(s * 4.0, s * NX) - 0.15, YF - 0.35, Math.max(s * 4.0, s * NX) + 0.15, YF + 1.9, 22.0, 22.4)
}
slabY(trim, [[-4.4, ATT - 0.05], [4.4, ATT - 0.05], [0, 22.3]], YF - 0.75, YF + 1.2)
slabY(trim, [[-4.0, ATT - 0.05], [4.0, ATT - 0.05], [0, 21.95]], YF - 0.85, YF - 0.7)

// Openings on the front. Doors: the central portal and the two side doors,
// each a round-headed opening in a proud moulded surround.
const archShape = (x: number, w: number, z0: number, zTop: number): [number, number][] => {
  const r = w / 2, spring = zTop - r, pts: [number, number][] = [[x - r, z0], [x + r, z0]]
  for (let k = 0; k <= 10; k++) { const t = (k / 10) * Math.PI; pts.push([x + r * Math.cos(t), spring + r * Math.sin(t)]) }
  return pts
}
slabY(trim, archShape(0, 3.7, 0.5, 5.25), YF - 0.3, YF)
arch(win, 'front', YF - 0.3, 0, 2.8, 0.5, 4.75)
for (const s of [-1, 1]) {
  slabY(trim, archShape(s * 5.1, 2.3, 0.5, 4.95), YF - 0.25, YF)
  arch(win, 'front', YF - 0.25, s * 5.1, 1.7, 0.5, 4.55)
}
// Upper storey: the paired central windows under their arch; the outer bays' blind arches.
slabY(trim, archShape(0, 3.3, 7.1, 12.4), YF - 0.25, YF)
for (const x of [-0.7, 0.7]) arch(win, 'front', YF - 0.25, x, 0.95, 7.4, 10.5)
for (const s of [-1, 1]) arch(win, 'front', YF, s * 5.15, 1.0, 7.6, 11.0)
// Attic: an arched light each side, a small one under the clock.
for (const s of [-1, 1]) arch(win, 'front', YF, s * 5.6, 0.75, 14.8, 17.6)
arch(win, 'front', YF, 0, 0.55, 14.7, 16.5)
// The clock, just under the pediment: a lit white face in a dark ring, hands.
disc(slate, 'front', YF, 0, 19.15, 1.25, 0.07, 18)
disc(clock, 'front', YF, 0, 19.15, 1.05, 0.12, 18)
rect(slate, 'front', YF - 0.06, -0.05, 0.12, 19.15, 19.85, 0.12)
rect(slate, 'front', YF - 0.06, 0.25, 0.6, 19.1, 19.22, 0.12)
// Wings: a round-headed window in each storey, then the scrolled top with its cross.
for (const s of [-1, 1]) {
  const xm = s * 8.3
  arch(win, 'front', YW - 0.3, xm, 1.05, 1.4, 4.7)
  arch(win, 'front', YW - 0.3, xm, 1.05, 7.4, 10.5)
  // the bold pedestal on the wing's corner, its domed cap and cross
  const mid = s * 8.4, yc = YW + 0.3
  prism({ wall: trim, win: null, roof: trim, ring: rectRing(mid - 1.15, yc - 0.85, mid + 1.15, yc + 0.85), z0: U2, z1: 16.2, facade: null, bevel: 0.1 })
  block(trim, mid - 1.3, yc - 1.0, mid + 1.3, yc + 1.0, 16.2, 16.55)
  dome(trim, mid, yc, 1.0, 16.55, 1.15, 12, 4)
  block(trim, mid - 0.25, yc - 0.25, mid + 0.25, yc + 0.25, 17.6, 18.0)
  cross(slate, mid, yc, 18.0, 1.9, 0.95, 0.2)
}

// ---------------------------------------------------------------------------
// The hexagonal side towers
// ---------------------------------------------------------------------------

for (const s of [-1, 1]) {
  const cx = s * TX
  const hex = ngon(cx, TY, TR, 6)
  prism({ wall: stucco, win: null, roof: stucco, ring: hex, z0: 0, z1: 19.9, facade: null, bevel: 0.08 })
  band(trim, hex, 0, 0.6, 0.12)
  band(trim, hex, L1, L2, 0.22)
  band(trim, hex, U1, U2, 0.28)
  band(trim, hex, 19.9, 20.6, 0.32)
  // Openings on every face: an arched window in the second stage on the
  // faces clear of the wings and aisle, louvred arches in the belfry stage.
  for (let k = 0; k < 6; k++) {
    const a = hex[k], b = hex[(k + 1) % 6]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const nAng = (k * 60 + 30) * Math.PI / 180, nx = Math.cos(nAng), ny = Math.sin(nAng)
    const exposed = ny < -0.1 || nx * s > 0.1  // front faces and the outer faces
    if (exposed) archPanel(win, a, b, L / 2, 1.0, 8.3, 11.6, 0.05, 8)
    archPanel(slate, a, b, L / 2, 1.3, 15.1, 18.4, 0.05, 8)
  }
  // The slim hexagonal spire, set inside the cornice with a ledge round
  // it (tip/base 3.0, from the face-on photo), and its finial.
  spire(slate, [[ngon(cx, TY, 2.05, 6), 20.6], [ngon(cx, TY, 1.9, 6), 21.2]], [cx, TY, SIDE_TIP])
  block(slate, cx - 0.07, TY - 0.07, cx + 0.07, TY + 0.07, SIDE_TIP - 0.2, SIDE_TIP + 1.8)
}

// ---------------------------------------------------------------------------
// The central tower and spire
// ---------------------------------------------------------------------------

{
  const { x0, x1, y0, y1, top, cor } = CT
  prism({ wall: stucco, win: null, roof: stucco, ring: rectRing(x0, y0, x1, y1), z0: ATT - 0.4, z1: top, facade: null, bevel: 0.15 })
  // corner pilasters
  for (const [px, py] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[]) {
    const sx = Math.sign(px), sy = Math.sign(py - CY)
    block(trim, px - (sx > 0 ? 0.75 : 0.1), py - (sy > 0 ? 0.75 : 0.1), px + (sx > 0 ? 0.1 : 0.75), py + (sy > 0 ? 0.1 : 0.75), ATT, top)
  }
  band(trim, rectRing(x0, y0, x1, y1), top, cor, 0.35)
  band(trim, rectRing(x0, y0, x1, y1), 23.2, 23.6, 0.15)
  // each face: two louvred arches under a round arch, an oculus above
  const faces: [Side, number, number][] = [['front', y0 - 0.1, 0], ['rear', y1 + 0.1, 0], ['west', x0 - 0.1, CY], ['east', x1 + 0.1, CY]]
  for (const [side, c, t0] of faces) {
    arch(slate, side, c, t0, 4.0, 22.6, 29.2, 0.04)
    arch(trim, side, c, t0, 3.6, 22.6, 29.0, 0.08)
    for (const d of [-0.85, 0.85]) arch(slate, side, c, t0 + d, 1.3, 22.9, 27.0, 0.12)
    disc(slate, side, c, t0, 28.05, 0.42, 0.12, 12)
  }
  // The spire: octagonal, a steep foot carrying four lucarnes, then the
  // slender pyramid to the cross.
  const oct = (a: number) => ngon(0, CY, a / Math.cos(Math.PI / 8), 8, Math.PI / 8)
  spire(slate, [[oct(2.4), cor], [oct(2.25), 31.0], [oct(1.75), 35.6]], [0, CY, SPIRE_TIP])
  cross(slate, 0, CY, SPIRE_TIP - 0.3, 3.3, 1.5, 0.22)
  // Lucarnes on the four faces: a gabled box with a louvred front.
  for (const [ux, uy] of [[0, -1], [0, 1], [-1, 0], [1, 0]] as XY[]) {
    const hw = 0.62, out = 2.6, z0 = 31.6, z1 = 35.0, zr = 36.3
    if (uy !== 0) {
      const ya = CY + uy * 1.2, yb = CY + uy * out
      block(slate, -hw, Math.min(ya, yb), hw, Math.max(ya, yb), z0, z1)
      slabY(slate, [[-hw - 0.12, z1], [hw + 0.12, z1], [0, zr]], Math.min(ya, yb), Math.max(ya, yb))
      rect(roof, uy < 0 ? 'front' : 'rear', yb, 0, 0.85, z0 + 0.3, z1 - 0.15, 0.04)
    } else {
      const xa = ux * 1.2, xb = ux * out
      block(slate, Math.min(xa, xb), CY - hw, Math.max(xa, xb), CY + hw, z0, z1)
      slabX(slate, [[CY - hw - 0.12, z1], [CY + hw + 0.12, z1], [CY, zr]], Math.min(xa, xb), Math.max(xa, xb))
      rect(roof, ux < 0 ? 'west' : 'east', xb, CY, 0.85, z0 + 0.3, z1 - 0.15, 0.04)
    }
  }
}

// ---------------------------------------------------------------------------
// The rear end (St. Anthony's Garden)
// ---------------------------------------------------------------------------

// Storey cornices across the nave end, the pediment and its clock.
block(trim, -NX - 0.2, YN, NX + 0.2, YN + 0.3, 7.4, 8.0)
block(trim, -NX - 0.25, YN, NX + 0.25, YN + 0.35, 14.8, 15.4)
block(trim, -NX - 0.3, YN - 0.2, NX + 0.3, YN + 0.4, EAVE - 0.5, EAVE)
slabY(trim, [[-NX - 0.3, EAVE], [NX + 0.3, EAVE], [0, 23.5]], YN - 0.4, YN + 0.35)
disc(slate, 'rear', YN + 0.35, 0, 21.3, 0.95, 0.05, 14)
disc(clock, 'rear', YN + 0.35, 0, 21.3, 0.8, 0.1, 14)
rect(slate, 'rear', YN + 0.35, 0, 0.1, 21.3, 21.95, 0.13)
// pilasters on the nave end
for (const x of [-6.4, -2.0, 2.0, 6.4]) block(trim, x - 0.4, YN, x + 0.4, YN + 0.25, 0.4, EAVE - 0.5)
// the scrolls either side of the attic, a spiral boss at their foot
for (const s of [-1, 1]) {
  // a concave sweep from the attic's top corner down and out to the boss
  const pts: [number, number][] = [[s * NX, AIS_IN - 0.2]]
  for (let k = 0; k <= 8; k++) {
    const t = (k / 8) * (Math.PI / 2)
    pts.push([s * (NX + 3.1 * (1 - Math.cos(t))), EAVE - 0.4 - (EAVE - 1.0 - AIS_IN) * Math.sin(t)])
  }
  pts.push([s * (NX + 3.2), AIS_IN - 0.2])
  slabY(stucco, pts, YR - 0.1, YR + 0.6, [s * (NX + 0.01), AIS_IN - 0.19])
  disc(stucco, 'rear', YR + 0.6, s * (NX + 2.55), AIS_IN + 0.6, 0.55, 0.06, 10)
}
// openings: the door, three windows over it, the aisle ends' windows
arch(win, 'rear', YN, 0, 2.0, 0.4, 4.4)
for (const x of [-2.6, 0, 2.6]) arch(win, 'rear', YN, x, 1.0, 8.4, 11.0)
for (const s of [-1, 1]) {
  arch(win, 'rear', YR, s * 11.0, 1.2, 8.2, 11.4)
  arch(win, 'rear', YR, s * 11.0, 1.2, 2.0, 5.6)
}

// ---------------------------------------------------------------------------
// Finish: shift to the OSM centre line, light, write.
// ---------------------------------------------------------------------------

const parts = [stucco, trim, roof, slate, win, clock]
for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) p.pos[i] += XC

// The front, its towers to their cornices and the rear end are floodlit;
// the long sides only faintly; faces looking up catch little.
const lit = (p: V3, n: V3): number => {
  const up = n[2] > 0.7 ? 0.35 : 1
  if (p[1] < -20.5 && p[2] < 31) return up * (n[1] < -0.3 ? 1 : 0.75)
  if (p[1] > YR - 0.5) return up * 0.7
  return 0.08 * up
}

finishModel('Cathedral-Basilica of Saint Louis, King of France', 'nola-st-louis-cathedral', [
  { part: stucco, material: { ...finish('stl-stucco', 0xece6d8), floodlight: lit } },
  { part: trim, material: { ...finish('stl-trim', 0xfbf8f1), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: slate, material: finish('stl-slate', 0x5d5760) },
  { part: win, material: PALETTE.window },
  { part: clock, material: finish('neon-clock', 0xf6f3ea) },
], { bearing: 307, osm: 'way/329364492', height: SPIRE_TIP + 3 }, 6500)

