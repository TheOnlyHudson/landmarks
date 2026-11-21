/**
 * John A. Roebling Suspension Bridge (1866; John A. Roebling; cables added
 * and deck rebuilt 1896–99) — procedural, CC0-1.0, no textures.
 * bun generators/cin-roebling-bridge.ts
 *
 * The whole bridge inside its OSM outline, Cincinnati approach to Covington
 * anchorage, as one placement: both sandstone towers (lower block, twin
 * piers either side of one round-arched portal, pale string courses, a
 * corniced top and a gilded-dome cupola on each pier), the four main cables
 * (two a side), the stiffening trusses in Roebling blue, both sidewalks with
 * their balconies round the towers, both anchorages and the Cincinnati
 * approach girders. Writes the low model (towers, cables, trusses as solid
 * bands, walkways) and a detail model (trusses opened into lattice, plus
 * suspenders, the diagonal stays fanning from each tower top, railings and
 * the lamps), which a map draws from detailZoom 16.
 *
 * Frame: x across the bridge (+x to the east side), y along it toward
 * Covington, z up, metres. Placed at bearing 168.74°, the line between the
 * towers' OSM base parts (way/1460399544, way/1460640572), 320.7 m apart;
 * the anchor is midway between them, on the water.
 *
 * Height. z = 0 is the Ohio River, 138.94 m NAVD88 in the lidar (the map's
 * Mapterhorn terrain reads it at 138.9). Roadway heights built to (lidar,
 * tools/bridge_ele.py on ways 871746500, 871746509, 871746508, 871746507,
 * 567780747, OH_StatewideP3_6_B21, lower quartile, spread 0.01–0.3 m; in
 * `ROAD` below): 15.5 m at the Cincinnati end of the outline (y = −368),
 * 17.4 m at the Ohio anchorage (−250), 20.0 m at the Ohio tower, a crest of
 * 24.1 m just Covington-side of midspan, 20.3 m at the Kentucky tower and
 * 17.3 m on the Kentucky anchorage (+249). OSM has no `height` on the
 * outline nor any `ele` on the roadway, so the map's deck is a guess until
 * these are tagged (see docs/bridge-heights.md; values in the report).
 * The sidewalks are the model's (walking surface 0.2 m above the roadway);
 * the roadway between the trusses is the map's.
 *
 * Sources:
 * - OSM: outline way/734667333 (man_made=bridge, layer 1, no height), from
 *   y = −368 (Cincinnati, over East Mehring Way) to +290 (Covington); road
 *   way/567780747 and its Cincinnati continuations; sidewalks way/871746514
 *   and way/871746515 at x = ±5.8, stepping out to ±12.9 round each tower;
 *   tower parts (way/1460399542–5, 1460400591–2, 1460403551–2 and
 *   1460404711–17, 1460640572): base 24.4 × 13.7 m, piers 6.8 × 12.3 m at
 *   x = ±4.5…11.5, the portal 9 m wide, an octagonal top stage and a cupola
 *   2.8 m across on each pier; parts way/871746519–20 (Ohio) and
 *   way/871746501–2 (Kentucky), height 10.5, the anchorages' walls.
 * - Lidar, USGS 3DEP OH_StatewideP3_6_B21 (flown 2021), 0.5 m grid over the
 *   Ohio tower: wall over the portal 51.6 m above the river, pier tops
 *   53.5–54.2 m, cupolas to 58.9 m; roadway through the portal 20.0–20.5 m.
 *   OSM's part heights (57/61/65) read 5–6 m high against it; the lidar's are
 *   used.
 * - Published (Wikipedia "John A. Roebling Suspension Bridge"; NRHP/NHL
 *   75000786): main span 1,057 ft (322 m; OSM towers 320.7 m apart), opened
 *   1866, second pair of cables and the steel trusses added 1896–99.
 * - Photos (Wikimedia Commons):
 *   - "John A Roebling Suspension Bridge Cincinnati September 2026" (King
 *     of Hearts, CC BY-SA 4.0): aerial from upstream: both towers, the cable
 *     curves, the stay fans reaching about a quarter of each span, the
 *     side spans' length;
 *   - "Roebling Bridge from Smale Park, Cincinnati, OH - 52279730873"
 *     (Warren LeMay, CC BY-SA 2.0): the portal face: twin piers, a round
 *     arch springing at the pale band 16 m above the deck, crown about 22 m
 *     above it, cornice, cupolas with gilded domes;
 *   - "Roebling Bridge Tower, Cincinnati, OH - 51401459995" (Warren LeMay,
 *     CC BY-SA 2.0): the portal from the sidewalk: the blue lattice truss
 *     passing through the arch, the pale voussoirs and impost band, the
 *     cornice and balustrade, cupolas with gilded domes and crosses;
 *   - "Roebling Bridge P2110008" (Chris Light, CC BY-SA 4.0): the narrow end
 *     face from the Ohio bank: the battered lower block with a corbelled
 *     balcony at deck level, chamfered pier corners, two pale bands, the
 *     two cupolas, cables and stays;
 *   - "Cincinnati-roebling-suspension-bridge" (Derek Jensen (Tysto), public
 *     domain): at night: floodlit stone, the blind arch in each end face,
 *     lamps strung along the cables and on posts along the deck.
 * - Night: towers floodlit warm (Tysto); lights along the cables and on
 *   the deck: `lamp` beads, and `_FLOODLIGHT` on the towers' stone.
 *
 * Estimated: the trusses' depth (4.2 m above the roadway, 1.2 m below) and
 * x = ±4.3, the walkways' width (4.6–7.0 m out), the cables' plan (x = ±7.4
 * and ±8.6) and sag (lowest at 29 and 30.5 m), saddles where the cables enter
 * the towers at 52.4 m, the stays (12 a fan a cable side, 8–76 m out), the
 * lower block's batter, the string courses, the blind arches, the cupola
 * drum and dome sizes (from the photos), every lamp position, and the
 * anchorages and the Cincinnati approach (plain stone blocks and blue
 * girders on two stone piers; no open photo shows them closely).
 * Doubts: the Covington anchorage is in the map's terrain at road level, so
 * only its parapets show there; the Ohio approach's piers are placed to clear
 * East Mehring Way rather than from evidence.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { along, band, bead, face, footedLoft, groundAt, merged, piecewise, rod, stations, truss, tube, type GroundGrid } from './bridge-kit'

const TY = 160.3                       // towers at y = ±TY
const Y_OH = -368, Y_KY = 289.6        // the outline's ends
const ANCH_OH: [number, number] = [-270, -246.5]  // Ohio anchorage block
const ANCH_KY: [number, number] = [243.5, 289.6]  // Kentucky anchorage block

/** Lidar roadway (m above the river) along the bridge axis. */
const ROAD = piecewise([
  [-368, 15.53], [-348, 16.08], [-328, 16.47], [-299.4, 16.85], [-277.6, 17.13], [-250.7, 17.41], [-246.2, 17.39],
  [-226.2, 17.98], [-206.2, 18.62], [-186.2, 19.31], [-166.2, 20.0], [-146.2, 20.72], [-126.2, 21.44], [-106.2, 22.09],
  [-86.2, 22.68], [-66.2, 23.19], [-46.2, 23.57], [-26.2, 23.88], [-6.2, 24.08], [13.8, 24.04], [33.8, 23.77],
  [53.8, 23.45], [73.8, 23.03], [93.8, 22.56], [113.8, 21.92], [133.8, 21.24], [153.8, 20.48], [173.8, 19.79],
  [193.8, 19.08], [213.8, 18.34], [233.8, 17.69], [249.4, 17.27], [290, 17.0],
])
const road = (y: number) => ROAD(y)
const walkZ = (y: number) => road(y) + 0.2

// Map terrain (Mapterhorn) above its river reading (138.9 m), in this frame, 4 m apart.
const GROUND_OH: GroundGrid = {"y0":-380,"x0":-16,"step":4,"z":[[15.4,15.4,15.3,15.2,15.3,15.2,15.4,15.3,15.3],[15.3,15.4,15.5,15.3,15.3,15.4,15.5,15.3,15.3],[15.5,15.4,15.6,15.4,15.5,15.5,15.6,15.3,15.3],[15.4,14,13.7,14.4,14.8,14.9,13.7,14.8,15.3],[11.5,10.9,10.8,10.8,10.8,10.8,10.8,11.2,12],[10.7,10.7,10.7,10.7,10.7,10.7,10.7,10.7,10.7],[10.7,10.7,10.6,10.6,10.6,10.6,10.7,10.6,10.6],[10.4,10.3,10.3,10.3,10.3,10.3,10.2,10.4,10.5],[9.8,9.9,10,10,9.9,9.9,10,9.9,9.9],[9.1,9.1,9.1,9.1,9.2,9.2,9.2,9.2,9.3],[9.2,9.2,9.2,9.2,9.2,9.2,9.3,9.3,9.4],[9.3,9.2,9.2,9.2,9.2,9.2,9.3,9.3,9.4],[9.1,9.1,9.1,9.1,9.1,9.1,9.2,9.2,9.3],[9.7,9.8,9.8,9.7,9.7,9.7,9.9,9.8,9.7],[9.9,10,10.1,10.1,10.1,10.1,10.1,10.1,10],[10.1,10,10.2,10.2,10.2,10.2,10.1,10.1,10.1],[10.1,10,10.2,10.2,10.1,10.1,10.1,10,10],[10.1,10,10.1,10.1,10.1,10.1,10.1,10,10],[10.1,9.9,10,10,10,10,10.1,10,9.9],[10,9.9,10,10,10,10,10.1,10,9.9],[9.9,9.8,10,10,10,10,10,10,9.8],[9.8,9.8,9.9,9.9,9.9,9.9,10,9.9,9.8],[9.8,9.7,9.8,9.8,9.8,9.9,9.9,9.9,9.9],[9.7,9.7,9.8,9.8,9.8,9.8,9.9,9.9,9.8],[9.7,9.7,9.8,9.8,9.8,9.9,9.9,9.8,9.7],[9.6,9.6,9.7,9.7,9.8,9.8,9.8,9.7,9.6],[9.6,9.6,9.7,9.7,9.7,9.8,9.8,9.7,9.6],[9.5,9.6,9.7,9.7,9.7,9.7,9.7,9.6,9.5],[9.5,9.6,9.7,9.7,9.7,9.6,9.6,9.6,9.5],[9.5,9.6,9.6,9.6,9.6,9.6,9.6,9.5,9.3],[9.4,9.5,9.5,9.5,9.5,9.5,9.5,9.5,9],[9.4,9.5,9.5,9.5,9.5,9.5,9.5,9.4,8.9],[9.3,9.3,9.4,9.4,9.4,9.5,9.4,9.4,8.8],[9.3,9.3,9.3,9.3,9.4,9.4,9.4,9.3,8.7],[9.3,9.3,9.3,9.3,9.3,9.3,9.3,9.2,8.8],[9.3,9.3,9.3,9.3,9.3,9.3,9.2,9.2,8.9],[9.3,9.3,9.3,9.3,9.2,9.2,9.1,9,8.6],[9.3,9.3,9.3,9.2,9.2,9.2,9.1,8.7,8.4],[9.3,9.3,9.3,9.2,9.2,9,8.7,8.4,8.3],[9.3,9.3,9.2,9,8.8,8.6,8.4,8.4,8.2],[9,8.9,8.8,8.6,8.6,8.5,8.4,8.3,8.1],[7.2,6.7,6.9,6.1,5.9,6.1,5.8,5.4,5.9],[4.1,4.1,4.2,4.3,4.6,4.8,5,5.2,5.4],[3.9,3.8,3.9,4,4.2,4.5,4.6,4.8,4.9],[3.2,3,3.1,3.3,3.6,3.9,4.1,4.2,4.3],[2.1,2,2.1,2.2,2.5,2.7,2.9,3.1,3.2],[1.3,1.3,1.4,1.5,1.6,1.7,1.9,2,2.2],[0.6,0.7,0.8,0.8,0.9,0.9,0.9,1,1.2],[0.1,0.1,0.1,0.2,0.2,0.2,0.2,0.3,0.4],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]}
const GROUND_KY: GroundGrid = {"y0":180,"x0":-16,"step":4,"z":[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0.1,0,0.1,0.2],[0.1,0.1,0.3,0.5,0.6,2.5,0.9,0.6,0.8],[0.8,1,1.3,1.7,1.7,1.8,1.7,1.6,1.8],[2,2.3,2.6,2.7,2.8,2.9,2.9,2.8,2.8],[3.7,3.8,3.8,3.8,3.8,3.9,4.1,4.1,4.1],[5,5.1,5,4.8,4.9,5,5.1,5.2,5.2],[6.3,6.3,6.1,5.9,5.9,5.9,5.9,5.8,5.6],[7,6.9,6.7,6.5,6.4,6.3,6.3,6.2,6.2],[7.3,7.3,7.2,6.9,6.9,6.9,7,7,6.9],[7.5,7.6,7.6,7.5,7.4,7.4,7.5,7.6,7.6],[7.6,7.7,7.7,7.7,7.7,7.8,7.8,7.8,7.9],[7.8,7.8,7.9,7.9,8,8,8,8,8.1],[8,8.3,8.3,8.4,8.4,8.4,8.5,8.5,8.7],[8.6,9.7,10.2,9.7,9.2,12,13.4,11.1,9.3],[9.3,13.7,17.6,15.4,13.9,16.2,17.6,15.1,9.9],[9.8,13.5,17.5,17.3,17.2,17.3,17.4,13,10.9],[10,11.5,17.3,17.2,17.1,17.2,17.3,11.6,10.8],[9.9,10.3,17.2,17.1,17,17.1,17.1,11.6,10.8],[10,11.4,17.1,17,17,17,16.9,11.3,10.6],[10.1,11.1,17,16.9,16.9,17,16.9,11.2,10.5],[10.1,11.4,16.9,16.9,16.8,16.9,16.6,11.1,10.4],[10.3,12.1,16.7,16.9,16.8,16.9,16.7,10.5,10.3],[11.9,15,16.6,16.8,16.7,16.8,16.4,11.2,10.9],[12.9,15.6,16.5,16.8,16.7,16.8,16.3,12.6,11.8],[13.3,15.8,16.4,16.7,16.8,16.7,16.3,14.5,13],[15.6,16.3,16.4,16.7,16.7,16.7,16.5,15.6,14],[16.1,16.3,16.5,16.7,16.8,16.7,16.6,16.1,14.6],[16.1,16.6,16.7,16.7,16.8,16.7,16.8,16.5,15.1]]}
const ground = (x: number, y: number) =>
  y < -184 ? groundAt(GROUND_OH, x, y) : y > 184 ? groundAt(GROUND_KY, x, y) : 0

// ---- Parts ---------------------------------------------------------------------------
const stone = new Part()     // sandstone: lower blocks, piers, wall, anchorages
const recess = new Part()    // blind arches, arch soffits, deck underside
const trim = new Part()      // pale bands, cornices, cupola drums, sidewalks
const gold = new Part()      // cupola domes and finials
const steelLow = new Part(), steelDetail = new Part(), web = new Part()
const wires = new Part(), fine = new Part()
const lamps = new Part(), lampsLow = new Part()
const walk = new Part()      // walking surfaces (trim colour)
const rails = new Part()     // detail: railings

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A box x0..x1, y0..y1, z0..z1 with its vertical edges chamfered by r. */
function cbox(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, r = 0.4, lid: Part | null = p, base = false) {
  const ring: [number, number][] = r > 0
    ? [[x0 + r, y0], [x1 - r, y0], [x1, y0 + r], [x1, y1 - r], [x1 - r, y1], [x0 + r, y1], [x0, y1 - r], [x0, y0 + r]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  prism(p, ring, z0, z1, lid, base)
}

/** A vertical prism over a convex CCW plan ring, flat-shaded sides. */
function prism(p: Part, ring: [number, number][], z0: number, z1: number, lid: Part | null = p, base = false) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % n]
    const nx = by - ay, ny = -(bx - ax), l = Math.hypot(nx, ny)
    face(p, [ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1], [nx / l, ny / l, 0])
  }
  const cx = ring.reduce((s, q) => s + q[0], 0) / n, cy = ring.reduce((s, q) => s + q[1], 0) / n
  for (let i = 0; i < n; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % n]
    if (lid) lid.tri([cx, cy, z1], [ax, ay, z1], [bx, by, z1], undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
    if (base) p.tri([cx, cy, z0], [bx, by, z0], [ax, ay, z0], undefined, undefined, undefined, [[0, 0, -1], [0, 0, -1], [0, 0, -1]])
  }
}

/** A frustum between two chamfered rectangles (a battered block). */
function batter(p: Part, a: [number, number, number, number], b: [number, number, number, number], z0: number, z1: number, r: number) {
  const ring = ([x0, x1, y0, y1]: number[]): [number, number][] =>
    [[x0 + r, y0], [x1 - r, y0], [x1, y0 + r], [x1, y1 - r], [x1 - r, y1], [x0 + r, y1], [x0, y1 - r], [x0, y0 + r]]
  const A = ring(a), B = ring(b)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    const p0: V3 = [A[i][0], A[i][1], z0], p1: V3 = [A[j][0], A[j][1], z0], p2: V3 = [B[j][0], B[j][1], z1], p3: V3 = [B[i][0], B[i][1], z1]
    const ex = p1[0] - p0[0], ey = p1[1] - p0[1], l = Math.hypot(ex, ey)
    face(p, p0, p1, p2, p3, [ey / l, -ex / l, 0.12])
  }
}

/** A flat round-headed panel on a wall plane: facing `n` (±x or ±y), centred at u along the wall. */
function blindArch(p: Part, plane: 'x' | 'y', at: number, n: number, u: number, w: number, z0: number, z1: number) {
  const r = w / 2, spring = z1 - r
  const pt = (uu: number, z: number): V3 => plane === 'x' ? [at, uu, z] : [uu, at, z]
  const N: V3 = plane === 'x' ? [n, 0, 0] : [0, n, 0]
  face(p, pt(u - r, z0), pt(u + r, z0), pt(u + r, spring), pt(u - r, spring), N)
  const SEG = 8
  for (let i = 0; i < SEG; i++) {
    const a0 = (Math.PI * i) / SEG, a1 = (Math.PI * (i + 1)) / SEG
    const A = pt(u + r * Math.cos(a0), spring + r * Math.sin(a0)), B = pt(u + r * Math.cos(a1), spring + r * Math.sin(a1)), C = pt(u, spring)
    const ok = dot(crossV(sub3(B, A), sub3(C, A)), N) >= 0
    p.tri(A, ok ? B : C, ok ? C : B, undefined, undefined, undefined, [N, N, N])
  }
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

// ---- Towers ------------------------------------------------------------------------------
const PX0 = 4.5, PX1 = 11.5, PY = 6.15   // piers (OSM)
const WY = 5.2                            // the wall over the portal, set back from the pier faces
const SPRING = 37.5                       // the arch springs at the pale band (photo)
const AR = PX0                            // a semicircle 9 m across: crown 42 m
const BAND0 = 36.9, BAND1 = 37.9          // impost band
const COR0 = 50.4, COR1 = 51.6            // cornice; the wall's top (lidar 51.6)
const PTOP = 54.0                         // pier top stage (lidar 53.5–54.2)
const DRUM = 56.3, DOME = 57.7, FIN = 59.6 // cupola (lidar 58.9 at the dome)

function tower(cy: number) {
  const rt = road(cy)
  const deck0 = rt - 1.6, deckTop = rt - 0.35
  const Y = (v: number) => cy + v
  // Lower block: battered from the river to the deck, corbelled at its top.
  batter(stone, [-13.0, 13.0, Y(-7.6), Y(7.6)], [-12.2, 12.2, Y(-6.85), Y(6.85)], 0, deck0, 0.6)
  cbox(trim, -12.8, 12.8, Y(-7.35), Y(7.35), deck0, deckTop, 0.5, null)
  // Its top, under the roadway in the portal and under the balconies outside.
  face(recess, [-12.8, Y(-7.35), deckTop], [12.8, Y(-7.35), deckTop], [12.8, Y(7.35), deckTop], [-12.8, Y(7.35), deckTop], [0, 0, 1])
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? PX0 : -PX1, x1 = s > 0 ? PX1 : -PX0
    // Pier: lower stage to the impost band, upper stage set in 0.3 m.
    cbox(stone, x0, x1, Y(-PY), Y(PY), deckTop, BAND0, 0.6, null)
    cbox(trim, x0 - 0.3, x1 + 0.3, Y(-PY - 0.3), Y(PY + 0.3), BAND0, BAND1, 0.6, null)
    cbox(stone, x0 + 0.3, x1 - 0.3, Y(-PY + 0.3), Y(PY - 0.3), BAND1, COR0, 0.6, null)
    // Base course just above the walkway.
    cbox(trim, x0 - 0.2, x1 + 0.2, Y(-PY - 0.2), Y(PY + 0.2), deckTop, rt + 1.2, 0.6, null)
    // Blind arches on the end face and on the long faces outside the portal.
    const ex = s * (PX1 + 0.04)
    blindArch(recess, 'x', ex, s, Y(0), 6.4, rt + 2.5, BAND0 - 1.8)
    blindArch(recess, 'x', s * (PX1 - 0.26), s, Y(0), 5.6, BAND1 + 1.5, COR0 - 1.6)
    for (const f of [-1, 1]) {
      blindArch(recess, 'y', Y(f * (PY + 0.04)), f, s * 8, 4.2, rt + 2.5, BAND0 - 1.6)
      blindArch(recess, 'y', Y(f * (PY - 0.26)), f, s * 8, 3.6, BAND1 + 1.5, COR0 - 1.6)
    }
    // Top stage: chamfered, with the cupola on it.
    const cx = s * 8.0
    cbox(stone, cx - 2.9, cx + 2.9, Y(-5.4), Y(5.4), COR1, PTOP, 1.0, null)
    cbox(trim, cx - 3.1, cx + 3.1, Y(-5.6), Y(5.6), PTOP - 0.6, PTOP, 1.0)
    const ring = (r: number, k = 12): [number, number][] => Array.from({ length: k }, (_, i) => [cx + r * Math.cos((2 * Math.PI * i) / k), Y(r * Math.sin((2 * Math.PI * i) / k))])
    prism(trim, ring(1.45), PTOP, DRUM, null)
    prism(trim, ring(1.7), DRUM - 0.35, DRUM, trim)
    // Dome: a hemisphere in three rings, then the finial.
    const rings = [0, 0.35, 0.65, 0.88, 1].map((t) => ({ r: 1.45 * Math.cos((t * Math.PI) / 2), z: DRUM + (DOME - DRUM) * Math.sin((t * Math.PI) / 2) }))
    for (let k = 0; k + 1 < rings.length; k++) {
      const A = ring(Math.max(rings[k].r, 0.01)), B = ring(Math.max(rings[k + 1].r, 0.01))
      for (let i = 0; i < A.length; i++) {
        const j = (i + 1) % A.length
        const pa: V3 = [A[i][0], A[i][1], rings[k].z], pb: V3 = [A[j][0], A[j][1], rings[k].z]
        const pc: V3 = [B[j][0], B[j][1], rings[k + 1].z], pd: V3 = [B[i][0], B[i][1], rings[k + 1].z]
        const mx = (pa[0] + pb[0]) / 2 - cx, my = (pa[1] + pb[1]) / 2 - cy
        face(gold, pa, pb, pc, pd, [mx, my, (rings[k + 1].z - DRUM) * 0.9 + 0.3])
      }
    }
    rod(gold, [cx, Y(0), DOME - 0.1], [cx, Y(0), FIN], 0.18, 4)
    bead(gold, [cx, Y(0), DOME + 0.45], 0.42)
  }
  // The wall over the portal, from the springing to the cornice, with the arch cut from it.
  const SEG = 10
  for (const f of [-1, 1]) {
    const yy = Y(f * WY), N: V3 = [0, f, 0]
    for (let i = 0; i < SEG; i++) {
      const a0 = Math.PI - (Math.PI * i) / SEG, a1 = Math.PI - (Math.PI * (i + 1)) / SEG
      const xa = AR * Math.cos(a0), za = SPRING + AR * Math.sin(a0), xb = AR * Math.cos(a1), zb = SPRING + AR * Math.sin(a1)
      face(stone, [xa, yy, za], [xb, yy, zb], [xb, yy, COR0], [xa, yy, COR0], N)
      // Archivolt: a pale ring 0.8 m wide, 0.2 m proud.
      const ro = AR + 0.8, yo = Y(f * (WY + 0.2))
      const pa: V3 = [xa, yo, za], pb: V3 = [xb, yo, zb]
      const qa: V3 = [ro * Math.cos(a0), yo, SPRING + ro * Math.sin(a0)], qb: V3 = [ro * Math.cos(a1), yo, SPRING + ro * Math.sin(a1)]
      face(trim, pa, pb, qb, qa, N)
      // Soffit through the wall's depth, facing the opening.
      const na: V3 = [-Math.cos(a0), 0, -Math.sin(a0)]
      face(recess, [xa, Y(-WY), za], [xb, Y(-WY), zb], [xb, Y(WY), zb], [xa, Y(WY), za], na)
    }
    // Keystone.
    cbox(trim, -0.55, 0.55, Y(f * WY) - 0.3, Y(f * WY) + 0.3, SPRING + AR - 0.2, SPRING + AR + 1.5, 0.1, null)
  }
  face(recess, [-AR, Y(-WY), SPRING], [-AR, Y(WY), SPRING], [-AR, Y(WY), SPRING + 0.01], [-AR, Y(-WY), SPRING + 0.01], [1, 0, 0])
  face(stone, [-PX0, Y(-WY), COR0], [PX0, Y(-WY), COR0], [PX0, Y(WY), COR0], [-PX0, Y(WY), COR0], [0, 0, 1])
  // Cornice over the whole top, and the wall's parapet up to 51.6.
  cbox(trim, -11.9, 11.9, Y(-6.6), Y(6.6), COR0, COR1, 0.6)
}

tower(-TY)
tower(TY)

// ---- Deck: trusses, sidewalks, underside -----------------------------------------------
const TX = 4.3                // truss centre lines
const UP = 4.2, DOWN = 1.2    // truss top above the roadway, underside below it
const W0 = 4.6, W1 = 7.0      // sidewalks, each side
const EDGE = 7.2
const FACE = 7.4              // the towers' faces from their centre lines, at deck level
const deckSpan: [number, number] = [ANCH_OH[1], ANCH_KY[0]]
const top = (y: number) => road(y) + UP, bot = (y: number) => road(y) - DOWN

const curve = ([a, b]: [number, number], step: number) => stations(a, b, step)
for (const s of [-1, 1]) {
  // Through the towers' portals as well: the trusses pass inside the piers.
  band(steelLow, s * (TX - 0.25), s * (TX + 0.25), curve(deckSpan, 20), top, bot)
  truss(steelDetail, web, s * TX, stations(deckSpan[0], deckSpan[1], 4.9), top, bot, { chordW: 0.45, topD: 0.5, botD: 0.6, member: 0.28, curve: curve(deckSpan, 10) })
}
// Underside, outside the towers' blocks.
const clear: [number, number][] = [[deckSpan[0], -TY - FACE], [-TY + FACE, TY - FACE], [TY + FACE, deckSpan[1]]]
for (const span of clear) {
  band(recess, -EDGE, EDGE, curve(span, 20), bot, bot, { bottom: true })
  // Fascia girders at the sidewalks' outer edges.
  for (const s of [-1, 1]) band(steelLow, s * (EDGE - 0.25), s * EDGE, curve(span, 20), (y) => walkZ(y) + 0.1, bot, { out: true, top: true })
}
// Sidewalks, anchorage to anchorage and over the Ohio approach; balconies round the towers.
const walkRuns: [number, number][] = [[Y_OH, -TY - FACE - 1.2], [-TY + FACE + 1.2, TY - FACE - 1.2], [TY + FACE + 1.2, ANCH_KY[0] + 4.7]]
for (const run of walkRuns) for (const s of [-1, 1]) band(walk, s * W0, s * W1, curve(run, 20), walkZ, (y) => walkZ(y) - 0.3, { top: true, out: false, in: false })
for (const t of [-TY, TY]) for (const s of [-1, 1]) {
  const ys = [t - FACE - 1.2, t + FACE + 1.2], z = road(t) + 0.2
  const slab = (x0: number, x1: number, y0: number, y1: number) => cbox(walk, x0, x1, y0, y1, z - 0.4, z, 0, walk)
  const xs = (a: number, b: number) => (s > 0 ? [a, b] : [-b, -a]) as [number, number]
  slab(...xs(PX1 + 0.3, 13.4), ys[0], ys[1])
  slab(...xs(W0, PX1 + 0.3), ys[0], t - PY - 0.3)
  slab(...xs(W0, PX1 + 0.3), t + PY + 0.3, ys[1])
  // Balcony railing.
  band(rails, s * 13.3, s * 13.45, [ys[0], ys[1]], () => z + 1.1, () => z - 0.4)
}
for (const run of walkRuns) for (const s of [-1, 1]) band(rails, s * (W1 - 0.08), s * (W1 + 0.07), curve(run, 10), (y) => walkZ(y) + 1.1, (y) => walkZ(y) + 0.05, { out: true, in: true, top: true })

// ---- Cables, suspenders, stays ----------------------------------------------------------
const CX = [7.4, 8.6]          // two cables a side
const SADDLE = 52.4            // where they enter the towers
const LOWEST = [29.0, 30.5]
const TF = TY - 6.2            // tower faces at cable height
const mainCable = (k: number) => (y: number) => LOWEST[k] + (SADDLE - LOWEST[k]) * (y / TF) ** 2
// Side spans: a parabola from the tower face to the anchorage, sagging under the chord.
const sideCable = (k: number, y0: number, y1: number) => {
  const z1 = road(y1) + 1.2 + k * 0.8
  return (y: number) => {
    const t = (y - y0) / (y1 - y0)
    return SADDLE + (z1 - SADDLE) * t - (11 - k) * 4 * t * (1 - t) * 0.55
  }
}
const sideOH = (k: number) => sideCable(k, -TF - 12.3, ANCH_OH[1])
const sideKY = (k: number) => sideCable(k, TF + 12.3, ANCH_KY[0])
const cableZ = (k: number) => (y: number) =>
  Math.abs(y) <= TF ? mainCable(k)(y) : y < 0 ? sideOH(k)(y) : sideKY(k)(y)
const cableSpans: [number, number][] = [[ANCH_OH[1] - 4, -TY - 6.2], [-TF, TF], [TY + 6.2, ANCH_KY[0] + 4]]
for (const s of [-1, 1]) for (const k of [0, 1]) {
  const x = s * CX[k]
  for (const [a, b] of cableSpans) {
    tube(steelLow, stations(a, b, 16).map((y) => [x, y, cableZ(k)(y)] as V3), 0.42, 5)
    tube(steelDetail, stations(a, b, 6).map((y) => [x, y, cableZ(k)(y)] as V3), 0.36, 8)
  }
}

// Suspenders every 4.5 m (every second of the real ones) from the lower cable of each pair.
for (const [a, b] of cableSpans)
  stations(a + 3, b - 3, 4.5).forEach((y, i) => {
    if (Math.abs(Math.abs(y) - TY) < 9) return
    for (const s of [-1, 1]) {
      const z1 = cableZ(0)(y) - 0.3, z0 = bot(y) + 0.3
      if (z1 - z0 > 1) rod(i % 2 ? fine : wires, [s * EDGE, y, z0], [s * CX[0], y, z1], 0.13)
    }
  })

// Stays: fans from each tower top over both spans, to the truss tops.
const STAYS = 12
for (const t of [-TY, TY]) for (const dir of [-1, 1]) for (const s of [-1, 1]) for (let i = 0; i < STAYS; i++) {
  const y = t + dir * (FACE + 8 + i * 6)
  if (y < ANCH_OH[1] || y > ANCH_KY[0]) continue
  rod(i % 2 ? fine : wires, [s * 8.0, t + dir * 6.3, 50.5 - i * 0.12], [s * EDGE, y, top(y) + 0.2], 0.15)
}

// ---- Anchorages and the Cincinnati approach --------------------------------------------
const rect = (x0: number, x1: number, y0: number, y1: number): [number, number][] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
function block(x: number, y0: number, y1: number, topZ: number) {
  footedLoft(stone, ground, [{ plan: rect(-x, x, y0, y1), z: 'ground' }, { plan: rect(-x, x, y0, y1), z: topZ - 1.3 }], 3, false)
  cbox(trim, -x - 0.35, x + 0.35, y0 - 0.35, y1 + 0.35, topZ - 1.3, topZ, 0, trim)
}
block(12.5, ANCH_OH[0], ANCH_OH[1], road(ANCH_OH[1]) - 0.4)
block(12.2, ANCH_KY[0], ANCH_KY[0] + 7, road(ANCH_KY[0]) - 0.4)
block(10.5, ANCH_KY[0] + 7, Y_KY, road(270) - 0.4)
// Parapets along the anchorages' edges (OSM's 10.5 m wall parts read as these from the street).
for (const [y0, y1, x] of [[ANCH_OH[0], ANCH_OH[1], 12.5], [ANCH_KY[0], Y_KY, 10.5]] as [number, number, number][])
  for (const s of [-1, 1]) band(trim, s * (x - 0.5), s * x, curve([y0, y1], 8), (y) => road(y) + 1.0, (y) => road(y) - 0.4, { out: true, in: true, top: true, ends: true })

// Cincinnati approach: girders on two stone piers clear of East Mehring Way and the trail.
for (const yp of [-352, -300]) footedLoft(stone, ground, [{ plan: rect(-7.6, 7.6, yp - 1.6, yp + 1.6), z: 'ground' }, { plan: rect(-7.6, 7.6, yp - 1.6, yp + 1.6), z: bot(yp) }], 3)
footedLoft(stone, ground, [{ plan: rect(-8.9, 8.9, Y_OH, Y_OH + 3), z: 'ground' }, { plan: rect(-8.9, 8.9, Y_OH, Y_OH + 3), z: road(Y_OH) - 0.4 }], 3)
const approach: [number, number] = [Y_OH + 3, ANCH_OH[0]]
for (const s of [-1, 1]) band(steelLow, s * (EDGE - 0.35), s * EDGE, curve(approach, 20), (y) => walkZ(y) + 1.0, bot, { out: true, in: true, top: true })
band(recess, -EDGE, EDGE, curve(approach, 20), bot, bot, { bottom: true })

// ---- Lamps ------------------------------------------------------------------------------
// Along the outer cable of each pair (Tysto, at night), and lamp posts on the truss tops.
for (const s of [-1, 1]) for (const [a, b] of cableSpans) {
  const path = stations(a, b, 4).map((y) => [s * CX[1], y, cableZ(1)(y) + 0.5] as V3)
  const n = Math.round((b - a) / 14)
  along(path, n).forEach((p, i) => { bead(lamps, p, 0.5); if (i % 3 === 1) bead(lampsLow, p, 2.2, true) })
}
for (const s of [-1, 1]) for (const y of stations(deckSpan[0] + 10, deckSpan[1] - 10, 29.4)) {
  if (Math.abs(Math.abs(y) - TY) < 12) continue
  rod(rails, [s * W1, y, walkZ(y)], [s * W1, y, walkZ(y) + 4.2], 0.1, 4)
  bead(lamps, [s * W1, y, walkZ(y) + 4.5], 0.45)
}

// ---- Write --------------------------------------------------------------------------------
// Floodlit stone: the towers, every face but those looking up dimly; nothing else.
const floodlight = (p: V3, n: V3) => {
  if (Math.abs(Math.abs(p[1]) - TY) > 9) return 0
  const up = n[2] > 0.7 ? 0.35 : 1
  return up * (p[2] < 20 ? 0.7 : 1)
}
const STEEL = 0x86b6d9   // Roebling blue, from the daylight photos, pulled light
const mat = {
  stone: { name: 'sandstone', color: 0xb3a286, floodlight },
  recess: { name: 'sandstone-shade', color: 0x978668, floodlight },
  trim: { name: 'limestone-trim', color: 0xd9ccb1, floodlight },
  gold: { name: 'gilded-dome', color: 0xd8b24c, floodlight },
  lamp: { name: 'lamp', color: STEEL },
}
const low = [
  { part: stone, material: mat.stone },
  { part: recess, material: mat.recess },
  { part: merged(trim, walk), material: mat.trim },
  { part: gold, material: mat.gold },
  { part: steelLow, material: { name: 'roebling-blue', color: STEEL } },
  { part: lampsLow, material: mat.lamp },
]
const detail = [
  { part: stone, material: mat.stone },
  { part: recess, material: mat.recess },
  { part: merged(trim, walk), material: mat.trim },
  { part: gold, material: mat.gold },
  { part: merged(steelDetail, web, rails), material: { name: 'roebling-blue', color: STEEL, doubleSided: true } },
  { part: lamps, material: mat.lamp },
  { part: wires, material: { name: 'wire-steel', color: STEEL } },
  { part: fine, material: { name: 'wire-steel-fine', color: STEEL } },
]
// The detail model keeps the low model's fascia girders and the approach girders.
const fascia = new Part()
for (const span of clear) for (const s of [-1, 1]) band(fascia, s * (EDGE - 0.25), s * EDGE, curve(span, 20), (y) => walkZ(y) + 0.1, bot, { out: true, top: true })
for (const s of [-1, 1]) band(fascia, s * (EDGE - 0.35), s * EDGE, curve(approach, 20), (y) => walkZ(y) + 1.0, bot, { out: true, in: true, top: true })
detail[4].part = merged(detail[4].part, fascia)

const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the river',
  bearing: 168.74, elevation: 0, towers: [-TY, TY], roadwayHeights: { cincinnatiEnd: road(Y_OH), ohioTower: road(-TY), crest: road(4), kentuckyTower: road(TY), kentuckyAnchorage: road(249.4) },
}
const count = (list: { part: Part }[]) => list.reduce((n, { part }) => n + part.triangles, 0)
if (import.meta.main) {
  for (const [file, list, maxTris, maxBytes] of [
    ['cin-roebling-bridge.glb', low, 6500, 250 * 1024],
    ['cin-roebling-bridge.detail.glb', detail, 40000, 1536 * 1024],
  ] as const) {
    const tris = count(list)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('John A. Roebling Suspension Bridge', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
  }
}
