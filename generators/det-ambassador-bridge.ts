/**
 * Ambassador Bridge, Detroit–Windsor (1929; McClintic-Marshall Company) —
 * procedural, CC0-1.0.
 * bun generators/det-ambassador-bridge.ts
 *
 * The river crossing from the Detroit anchorage to the Windsor abutment: the two lattice
 * towers with their stacked X bracing and the red "AMBASSADOR / BRIDGE"
 * signs on top, the two main cables and the free backstays down to the
 * anchorages, the suspenders, the stiffening trusses of the main span, the
 * side spans' deck trusses on their braced steel bents, and the concrete
 * anchorages with their pylons where the cables go down, and the Windsor
 * approach viaduct, deck truss on braced bent towers, from the Windsor pylons to
 * the abutment where the deck lands. Writes a low model
 * (trusses as solid bands, no suspenders) and a detail model (open trusses,
 * suspenders, floor beams, bent bracing, serifed letters).
 *
 * Frame: x across the bridge, y along it toward Windsor, z up, metres;
 * origin midway between the towers, on the water. Placed at bearing
 * 154.298°, the line from the Detroit tower's OSM centroid to the Windsor
 * one's (561.1 m apart). The map owns the roadway: the trusses stand beside
 * it and hang below it, the pylons' cap beam sits 0.5 m under it, and
 * nothing here is a slab at road level.
 *
 * Height. z = 0 is the river, 174.85 m NAVD88: Mapterhorn's water reading
 * (174.75) plus 0.1 so the Windsor tower's feet, in the water, sit at 0.
 * Structure heights are lidar (USGS 3DEP USGS_LPC_MI_WayneCo_2017_LAS_2018,
 * flown 2017, which reaches the Windsor bank too), read in this frame:
 * - roadway (tools/bridge_ele.py on way/4898838, every 25 m, spread under
 *   0.15 m; 0.5 m grids at midspan; 1 m grids over both side spans):
 *   crest 226.74 m (51.9 here) at midspan, a parabola falling 9.3e-5 y²
 *   to 44.6 at both towers (219.5 m); the Detroit side span straight at
 *   4.97 % to 29.8 at the Detroit pylons (y = -577); the Windsor side span
 *   at 3.91 % to 34.5 at its pylons (y = +530); the Windsor approach from
 *   the lidar readings every 25 m (APPROACH_ROAD), 3.27 % down to 15.4 at
 *   y = 1135, then 1.4 % down to 13.9 where the deck lands (y = 1225).
 *   These are the roadway heights the trusses are built to, within 0.13 m
 *   of every lidar reading; the `ele` tags proposed for OSM from the same
 *   readings are in ~/landmarks-scratch/osm-ele/det-ambassador-bridge.md.
 * - towers: strut tops 113, leg tops 115–116, sign tops 119–120 (both
 *   towers agree to 0.3 m); legs centred 10.4 m either side of the axis.
 * - cables: 9.5 m either side; 56.2 m (top) at midspan, entering the saddles
 *   at about 114.5; the Detroit backstay straight at 38 % down to 13 m at
 *   y = -546, the Windsor one at 44 % to 14 m at y = +508, both splaying out
 *   to about 11 m from the axis where they reach the anchorages.
 * - anchorages: on both banks a low concrete block (tops 12–15 m) where the
 *   cables go in, then a pair of pylons beside the roadway, 4 m above it
 *   (Detroit y = -584…-569, top 34; Windsor 522…537, top 38.5); the OSM
 *   outline ends at the pylons.
 * - Mapterhorn terrain under both side spans (tools/terrain.ts grid, 10 m),
 *   for the bents', pedestals' and anchorages' feet: the Detroit tower
 *   stands on the bank (2.8 m), the Windsor tower in the water at the dock.
 *
 * Published (Wikipedia "Ambassador Bridge"): main span 1,850 ft (564 m;
 * the OSM tower centroids are 561 m apart), towers 386 ft (118 m),
 * navigation clearance 152 ft (46 m; the lidar gives 46.3 under the truss),
 * deck 47 ft; only the main span hangs from the cables, the approaches are
 * truss spans on steel; repainted teal 1995–2000 (gloss black before);
 * "each bridge tower is topped with a large red neon sign with the bridge's
 * name", facing the nearer shore.
 *
 * OSM: the bridge outline way/988967484 (man_made=bridge, Q12575), y =
 * -582…+537; the Windsor approach viaduct's outline way/988967485, y =
 * +537…+1254, which the model draws to its end; the towers way/469346651
 * (Detroit) and way/656928839 (Windsor), 23.8 x 5.5 m, height 118.
 *
 * The ends. Windsor: the approach's deck truss, 5.5 m deep where the deck
 * is high and shallower over the last 300 m (0.6 of the deck's height over
 * the ground, at least 2.2 m), stands on bent towers (two bents 6 m apart,
 * X-braced on each side, as Woodrich's photo shows past the pylons) about every
 * 36 m and lands on a concrete abutment at y = 1222, 0.4 m under the
 * roadway, where the lidar's surface meets the roadway on every side and
 * the bridge way (way/37319544) ends. Over its last 60 m it bends west with
 * the road (approachX, the road's lidar centre line). Detroit: the model
 * ends at the anchorage pier, the face of the pylons at y = -584 (both
 * pylons stand on the ground, with the cap beam between them under the
 * roadway). Past it the deck carries on as a steel approach truss to the
 * US plaza, but OSM maps that part only as bridge=yes road ways (way/4898838
 * to y = -715, then the one-way carriageways and the plaza ramps), with no
 * man_made=bridge outline, so the map draws it with its own piers and
 * parapets, and the model leaves it to the map.
 *
 * Photos (Wikimedia Commons; daylight unless noted):
 * - "Ambassador Bridge from the Detroit River, Windsor, Ontario,
 *   2025-07-27 03", Chris Woodrich, CC BY-SA 4.0: the Windsor tower whole,
 *   from the river (north-east, the main-span side): its stages measured
 *   from this one (pedestal 4 m; lattice strut 7–13; X panel 13–34; seat
 *   strut 34–39; three X panels 50–107; lattice top strut 107–114); the
 *   side span's bents and the white anchorage.
 * - "Ambassador Bridge, Windsor, Ontario, 2025-06-01" and "2025-05-31",
 *   Crisco 1492, CC BY-SA 4.0: the Windsor tower and side span from the
 *   river; the truss's Warren web and its dark underside.
 * - "Ambassador Bridge from Queen's Dock, Windsor, Ontario, 2025-06-03 04",
 *   Crisco 1492, CC BY-SA 4.0: the Detroit tower and side span from the
 *   south-west.
 * - "Ambassador Bridge, Windsor", Patricia Drury, CC BY 2.0: the Windsor
 *   tower face from the Windsor end: the lattice top strut's diamonds, the
 *   X panels, the sign's frame and letters.
 * - "Ambassador Bridge - Detroit Port of Entry (8617304112)", U.S. Customs
 *   and Border Protection, public domain: the Detroit tower face and its
 *   sign from the US plaza; the letters traced from this one.
 * - "Detroit December 2025 14 (Ambassador Bridge)", Michael Barera, CC
 *   BY-SA 4.0: the whole bridge side-on from the Detroit Riverwalk; bents.
 * - "AmbassadorBridgeDetroitDowntown20230813", Sutherland78, CC0: the main
 *   span side-on from the river, south-west of the bridge.
 * - "Ambassador Bridge Between Detroit and Windsor Aerial (49525264167)"
 *   and "Ambassador Bridge - Detroit and Windsor (51147167940)",
 *   formulanone, CC BY-SA 2.0: plan, anchorages, bents.
 * - "Ambassador Bridge, Detroit, Michigan (21151531443)", Ken Lund, CC
 *   BY-SA 2.0: the cables' pale paint.
 * - Night: "Ambassador Bridge to Windsor Canada", Barbara Eckstein (Flickr
 *   6405176929), CC BY 2.0: the necklace lights on the main cables and
 *   backstays (about 30 a cable over the main span, 8 on each backstay) and
 *   the red sign.
 *
 * Estimated: leg sections (2.4 m across; 4.6 m along at the foot to 3.4 at
 *   the top, from the side views and the OSM footprint); X members 1.7 m;
 *   the main trusses 7.1 m deep (top chord 1.5 m above the road, as the
 *   lidar shows at midspan; bottom at the published clearance); the side
 *   spans' deck trusses 8.5 m (deeper than the main span's in every side
 *   view, scaled against the towers); bent towers (two bents 8 m apart,
 *   X-braced), six on the Detroit side and five on the Windsor side, evenly
 *   spaced (Crisco 1492's 2025-06-01 photo counts five on the Windsor side;
 *   the Detroit count is from NAIP shadows; their exact stations are not
 *   measured); suspenders every 18 m (twice the real spacing, from photos);
 *   the sign 23 m wide, AMBASSADOR standing on a 4.8 m lattice frame and
 *   BRIDGE inside it, 2.1 m capitals, drawn as plain roman capitals with
 *   short serifs (detail) or flat ribbons (low). The cables are drawn 1.0 m
 *   thick, about twice the real ones.
 * Look-only (not used for shape): "The Ambassador Bridge - A night shot",
 *   jebin, Flickr 4686171067, CC BY-ND 2.0 (lights, as Eckstein).
 * Doubts: the anchorages' form under the deck is read from lidar tops and
 *   two photos; the Detroit anchorage has no clear daylight photo. The
 *   Windsor approach's bent stations are evenly spaced, not measured (the
 *   bents stand under the deck, where the lidar doesn't reach); its truss
 *   depth is read from Woodrich's photo, not measured. A tall
 *   lattice mast beside the Detroit side span in the December 2025 photo
 *   is not in the 2017 lidar or the other photos and is left out. The
 *   south-west sidewalk was removed in 2013; nothing here depends on it.
 *
 * Night: the necklace (`lamp` beads on the cables) and the signs (`neon`
 * red). The towers are not floodlit.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { along, band, bead, footedLoft, groundAt, merged, parabola, piecewise, rod, stations, strip, truss, tube, type GroundGrid } from './bridge-kit'
import { beam, box, one, type Skin } from './sf-golden-gate-bridge'
import { Pen, strokes, type Pt } from './lettering'
import { finish } from './palette'

// ---- Measurements -----------------------------------------------------------

const TY = 280.5                    // towers at y = ±TY
const DET_END = -584, WIN_END = 537 // the pylons' far faces (outline -582 / +537)
const DET_PYLON = -569.5, WIN_PYLON = 522
const DET_BLOCK = -541, WIN_BLOCK = 505   // anchorage blocks' tower-facing faces

const CREST = 51.9, K = 9.3e-5
/**
 * The Windsor approach's roadway (lidar, tools/bridge_ele.py on way/37319544
 * every 25 m, spread under 0.15 m), metres above the river, from the
 * Windsor pylons to where the deck lands.
 */
const APPROACH_ROAD: [number, number][] = [
  [531.9, 34.64], [556.9, 33.8], [581.9, 33.0], [606.9, 32.16], [631.9, 31.31], [656.9, 30.52], [681.9, 29.71],
  [706.9, 28.89], [731.9, 28.08], [756.9, 27.25], [781.9, 26.46], [806.9, 25.64], [831.9, 24.83], [856.9, 24.01],
  [881.9, 23.18], [906.9, 22.37], [931.9, 21.58], [956.9, 20.74], [981.9, 19.96], [1006.9, 19.09], [1031.9, 18.3],
  [1056.9, 17.47], [1106.9, 15.9], [1124.4, 15.58], [1135.4, 15.43], [1160.4, 15.19], [1173, 15.09], [1180.1, 15.02],
  [1187.5, 14.9], [1192.5, 14.83], [1197.8, 14.76], [1204.4, 14.6], [1211.2, 14.36], [1218.3, 14.12], [1224.8, 13.94],
]
const approachRoad = piecewise(APPROACH_ROAD)
/** Where the Windsor approach lands: the abutment's face, at the end of the bridge way. */
const ABUT = 1222
/** The approach's centre line across x: straight on the axis, then bending west with the road to the abutment. */
const approachX = piecewise([[1160, 0], [1173, -0.5], [1180, -1.4], [1187.5, -3], [1192.5, -4.8], [1197.8, -7.3], [1204.4, -11.1], [1211.2, -15.9], [1218.3, -21.1], [1224.8, -26.5]])
const roadAtTower = CREST - K * TY * TY
/** The roadway (lidar), metres above the river. */
const road = (y: number): number => {
  if (Math.abs(y) <= TY) return CREST - K * y * y
  if (y >= APPROACH_ROAD[0][0]) return approachRoad(y)
  return y < 0 ? roadAtTower - 0.0497 * (-y - TY) : roadAtTower - 0.0391 * (y - TY)
}

const CABLE_X = 9.6, CABLE_R = 0.5
const SADDLE = 114.5, LOW = 55.7
const mainCable = (y: number) => LOW + (SADDLE - LOW) * (y / TY) ** 2
const DET_ANCH: [number, number] = [-546, 13], WIN_ANCH: [number, number] = [508, 14]
/** A backstay: straight with a slight sag, from the saddle to the anchorage. */
function backstay(end: [number, number]) {
  const s = Math.sign(end[0])
  const mid: [number, number] = [(s * TY + end[0]) / 2, (SADDLE + end[1]) / 2 - 0.8]
  return { z: parabola([s * TY, SADDLE], mid, end), x: (y: number) => CABLE_X + (1.4 * (Math.abs(y) - TY)) / (Math.abs(end[0]) - TY) }
}
const DET_STAY = backstay(DET_ANCH), WIN_STAY = backstay(WIN_ANCH)

const LEG_X = 10.4, LEG_W = 2.4
const LEG_IN = LEG_X - LEG_W / 2

const MAIN_TRUSS_X = 9.6, SIDE_TRUSS_X = 8.6
const MAIN_UP = 1.5, MAIN_DOWN = 5.6, SIDE_UP = 0.9, SIDE_DOWN = 7.6

// Mapterhorn ground above the river, 10 m apart in this frame: columns x =
// -30…30, rows along y. Water elsewhere.
const DET_GROUND: GroundGrid = { y0: -600, x0: -30, step: 10, z: [
  [4.7, 4.6, 4.9, 5.0, 5.1, 5.1, 5.1], [4.7, 4.7, 5.0, 5.0, 5.1, 5.2, 5.6], [4.8, 4.8, 5.2, 5.4, 5.4, 5.3, 5.8],
  [4.9, 4.9, 5.1, 5.3, 5.5, 5.4, 5.9], [5.0, 5.0, 5.3, 5.3, 5.4, 5.6, 5.9], [5.0, 5.0, 5.3, 5.3, 5.4, 5.5, 5.7],
  [5.1, 5.0, 5.0, 5.0, 5.1, 5.4, 5.5], [4.5, 4.0, 4.4, 5.0, 5.1, 5.3, 5.3], [4.1, 3.8, 4.1, 4.2, 4.4, 5.5, 5.5],
  [3.6, 3.6, 4.0, 4.1, 4.3, 5.5, 5.7], [3.6, 3.6, 3.9, 3.9, 4.5, 5.5, 5.7], [3.5, 3.6, 3.9, 3.9, 4.3, 5.4, 5.6],
  [3.4, 3.5, 3.8, 3.9, 4.2, 5.3, 5.6], [3.4, 3.5, 3.7, 3.7, 4.0, 5.2, 5.4], [3.3, 3.5, 3.6, 3.6, 3.8, 4.9, 5.1],
  [3.3, 3.5, 3.7, 3.7, 3.9, 4.6, 4.7], [3.3, 3.5, 3.6, 3.8, 3.9, 4.3, 4.6], [3.3, 3.4, 3.4, 3.6, 3.8, 4.1, 4.5],
  [3.2, 3.2, 3.2, 3.4, 3.5, 3.8, 4.2], [2.9, 3.0, 3.1, 3.2, 3.3, 3.3, 3.7], [2.7, 2.8, 2.9, 2.9, 2.7, 2.5, 2.9],
  [2.6, 2.7, 2.8, 2.7, 2.6, 2.5, 2.5], [2.3, 2.4, 2.6, 2.6, 2.5, 2.5, 2.5], [2.3, 2.3, 2.6, 2.7, 2.7, 2.5, 2.4],
  [2.5, 2.6, 2.7, 2.8, 2.9, 2.7, 2.5], [2.7, 2.9, 2.9, 2.8, 2.8, 2.7, 2.6], [2.4, 2.7, 2.8, 2.7, 2.6, 2.3, 2.5],
  [2.6, 2.8, 2.8, 2.8, 2.8, 2.8, 2.6], [3.4, 3.3, 3.1, 3.1, 3.1, 2.9, 2.8], [3.9, 3.6, 3.3, 3.1, 2.9, 2.9, 2.7],
  [3.9, 2.9, 3.4, 3.2, 3.1, 2.9, 2.8], [3.8, 3.2, 3.2, 3.1, 3.1, 2.7, 2.7], [1.5, 2.8, 2.7, 2.9, 3.2, 3.0, 2.8],
  [0.1, 0.1, 1.4, 2.0, 2.9, 2.8, 3.3], [0.1, 0.1, 0.1, 0.1, 1.2, 2.4, 3.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3],
] }
const WIN_GROUND: GroundGrid = { y0: 330, x0: -60, step: 10, z: [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [1.3, 1.4, 1.3, 1.4, 0.7, 0.5, 0.4, 0.2, 0.0, 0.0], [1.1, 1.1, 1.1, 1.3, 0.9, 1.0, 0.9, 0.8, 0.6, 0.3],
  [1.1, 1.0, 1.0, 1.1, 0.8, 1.0, 1.0, 0.9, 1.0, 1.1], [1.3, 1.2, 1.1, 1.1, 0.9, 1.2, 1.1, 0.9, 0.9, 0.8], [2.3, 2.0, 1.8, 1.3, 1.1, 1.0, 1.0, 1.0, 0.8, 0.9],
  [3.0, 2.7, 2.5, 1.7, 1.4, 1.3, 1.2, 1.0, 1.0, 1.0], [3.6, 3.2, 2.8, 2.0, 1.5, 1.3, 1.3, 1.1, 1.1, 1.2], [4.0, 3.5, 2.7, 2.1, 1.7, 1.5, 1.5, 1.5, 1.6, 1.8],
  [3.4, 3.4, 2.7, 2.2, 1.9, 1.9, 2.0, 2.0, 2.3, 2.4], [3.2, 3.0, 2.8, 2.6, 2.4, 2.4, 2.4, 2.5, 2.7, 2.9], [3.2, 3.0, 2.7, 2.7, 2.7, 2.6, 2.7, 2.8, 3.0, 3.2],
  [2.9, 2.6, 2.9, 2.8, 2.7, 2.8, 2.9, 3.1, 3.3, 3.6], [3.6, 3.0, 3.2, 3.0, 2.9, 2.9, 3.0, 3.1, 3.4, 3.8], [4.6, 4.0, 3.6, 3.2, 3.1, 3.0, 3.2, 3.3, 3.5, 3.7],
  [4.8, 4.6, 4.0, 3.4, 3.2, 3.3, 3.4, 3.5, 4.0, 4.0], [4.9, 4.7, 4.2, 3.5, 3.4, 3.5, 3.6, 3.8, 3.9, 4.0], [4.7, 4.6, 4.2, 3.8, 3.7, 3.7, 3.7, 3.9, 4.0, 4.0],
  [4.0, 3.8, 4.0, 4.0, 3.9, 3.9, 3.9, 4.1, 4.2, 4.4], [4.5, 3.7, 4.3, 4.4, 4.3, 4.3, 4.3, 4.5, 4.5, 4.8], [5.1, 4.9, 4.9, 4.7, 4.6, 4.9, 5.0, 5.1, 4.9, 5.0],
  [5.4, 5.4, 5.2, 4.9, 4.9, 5.3, 5.4, 5.4, 5.0, 5.0], [5.5, 5.4, 5.3, 5.3, 5.2, 5.5, 5.6, 5.7, 5.3, 5.3], [5.6, 5.4, 5.5, 5.5, 5.5, 5.4, 5.5, 5.7, 5.7, 5.9],
  [6.1, 6.0, 5.8, 5.6, 5.6, 5.7, 5.7, 5.7, 5.7, 5.8], [6.2, 6.2, 6.2, 5.8, 5.8, 5.9, 5.9, 5.9, 5.9, 6.0], [6.3, 6.3, 6.3, 6.0, 5.9, 6.4, 6.2, 6.2, 6.1, 6.4],
  [6.4, 6.4, 6.4, 6.1, 6.0, 6.4, 6.2, 6.2, 6.1, 6.4], [6.5, 6.5, 6.5, 6.1, 6.1, 6.5, 6.4, 6.3, 6.2, 6.4], [6.5, 6.5, 6.5, 6.2, 6.2, 6.5, 6.5, 6.4, 6.5, 6.8],
  [6.7, 6.5, 6.6, 6.3, 6.3, 6.5, 6.5, 6.6, 6.7, 6.8], [7.1, 6.9, 6.7, 6.4, 6.4, 6.8, 6.7, 6.8, 6.9, 7.1], [7.1, 7.1, 6.9, 6.5, 6.5, 7.0, 6.9, 6.9, 7.0, 6.9],
  [7.2, 7.2, 7.0, 6.7, 6.5, 7.0, 7.0, 6.9, 7.0, 7.2], [7.4, 7.3, 7.1, 6.7, 6.7, 7.1, 7.1, 7.0, 7.2, 7.4], [7.4, 7.4, 7.2, 6.8, 6.7, 7.1, 7.0, 7.0, 7.0, 7.3],
  [7.3, 7.4, 7.1, 6.8, 6.7, 7.2, 7.1, 7.0, 7.0, 7.0], [7.4, 7.4, 7.2, 6.9, 6.8, 7.2, 7.1, 7.0, 7.0, 7.1], [7.3, 7.3, 7.2, 6.8, 6.7, 7.2, 7.1, 7.0, 7.0, 7.2],
  [7.3, 7.4, 7.1, 6.8, 6.7, 7.2, 7.0, 6.9, 6.9, 6.9], [7.2, 7.1, 7.0, 6.8, 6.7, 7.1, 7.0, 6.8, 6.7, 6.9], [7.4, 7.1, 7.0, 6.7, 6.7, 7.1, 7.0, 6.8, 6.6, 6.8],
  [7.3, 7.1, 7.0, 6.7, 6.6, 7.1, 7.1, 6.8, 6.7, 7.0], [7.3, 7.2, 7.0, 6.6, 6.6, 7.0, 7.0, 6.9, 6.8, 6.9], [7.2, 7.2, 7.0, 6.7, 6.6, 7.1, 7.0, 7.0, 6.9, 7.0],
  [7.4, 7.2, 7.1, 6.6, 6.6, 6.6, 6.7, 6.6, 6.5, 6.5], [7.4, 7.3, 7.1, 6.7, 6.7, 6.6, 6.7, 6.7, 6.6, 6.6], [7.4, 7.3, 7.3, 6.9, 6.8, 7.2, 7.1, 6.9, 6.9, 6.9],
  [7.7, 7.6, 7.4, 7.1, 6.9, 7.1, 7.0, 6.8, 6.7, 7.0], [7.5, 7.4, 7.5, 7.1, 6.9, 7.1, 7.0, 6.7, 6.7, 6.9], [7.4, 7.6, 7.4, 7.0, 6.9, 7.2, 7.0, 6.6, 6.6, 6.6],
  [7.5, 7.4, 7.3, 7.0, 6.9, 7.2, 6.9, 6.6, 6.5, 6.6], [7.6, 7.4, 7.2, 7.0, 6.8, 7.2, 7.0, 6.6, 6.4, 6.3], [7.4, 7.2, 7.1, 6.8, 6.8, 7.0, 6.8, 6.4, 6.4, 6.4],
  [8.5, 8.3, 7.0, 6.8, 6.7, 7.0, 6.7, 6.5, 6.3, 6.5], [7.6, 7.8, 6.9, 6.9, 6.7, 7.0, 6.8, 6.6, 6.5, 6.5], [7.4, 7.2, 7.1, 6.8, 6.7, 7.0, 6.8, 6.6, 6.7, 6.7],
  [7.3, 7.1, 7.0, 6.8, 6.6, 7.0, 6.9, 6.7, 6.8, 6.8], [7.4, 7.2, 7.1, 6.8, 6.6, 7.0, 7.0, 6.8, 6.8, 6.7], [7.4, 7.2, 7.1, 6.8, 6.6, 7.0, 6.9, 6.7, 6.7, 6.4],
  [7.2, 7.2, 7.1, 6.8, 6.6, 7.1, 6.9, 6.6, 6.6, 6.4], [5.7, 5.5, 6.7, 6.8, 6.5, 7.1, 6.9, 6.7, 6.6, 6.4], [5.5, 5.0, 5.8, 6.8, 6.5, 7.0, 6.9, 6.5, 6.5, 6.3],
  [5.4, 4.9, 6.1, 6.7, 6.5, 6.7, 6.6, 6.4, 6.4, 6.3], [5.4, 5.5, 6.6, 6.7, 6.5, 6.8, 6.6, 6.4, 6.2, 6.3], [5.5, 6.0, 7.0, 6.7, 6.4, 6.5, 6.5, 6.4, 6.3, 6.3],
  [5.8, 6.4, 7.0, 6.6, 6.4, 6.3, 6.2, 6.2, 6.2, 6.1], [6.2, 6.8, 7.0, 6.6, 6.4, 6.2, 6.1, 6.0, 6.0, 6.0], [6.5, 6.6, 7.0, 6.5, 6.3, 6.4, 6.4, 6.2, 6.2, 6.4],
  [6.2, 6.4, 6.9, 6.5, 6.2, 6.4, 6.4, 6.2, 6.1, 6.5], [6.9, 7.0, 7.1, 6.5, 6.2, 6.5, 6.5, 6.3, 6.2, 6.7], [6.5, 6.6, 7.1, 6.5, 6.2, 6.5, 6.6, 6.5, 6.5, 7.0],
  [6.0, 6.4, 7.1, 6.6, 6.4, 6.7, 6.9, 6.8, 6.9, 7.3], [7.0, 7.1, 7.2, 6.7, 6.6, 6.9, 7.1, 7.1, 7.1, 7.7], [7.0, 7.0, 7.0, 6.9, 6.9, 7.2, 7.4, 7.4, 7.5, 7.9],
  [6.9, 6.9, 7.1, 7.2, 7.3, 7.5, 7.8, 7.8, 7.9, 8.2], [6.9, 7.1, 7.3, 7.5, 7.6, 7.6, 7.6, 7.7, 7.8, 8.0], [7.0, 7.5, 7.8, 7.8, 7.7, 7.7, 7.7, 7.8, 7.8, 7.9],
  [7.6, 7.8, 8.0, 8.0, 7.8, 8.1, 8.3, 8.1, 8.2, 8.1], [7.8, 8.0, 8.1, 8.2, 7.8, 8.4, 8.4, 8.4, 8.4, 8.4], [8.0, 8.1, 8.2, 8.3, 7.9, 8.4, 8.6, 8.5, 8.4, 8.2],
  [8.2, 8.2, 8.3, 8.3, 7.9, 8.3, 8.5, 8.4, 8.2, 8.0], [8.2, 8.2, 8.3, 8.3, 7.9, 8.2, 8.4, 8.4, 8.3, 8.2], [8.2, 8.2, 8.2, 8.2, 7.9, 8.2, 8.4, 8.2, 8.2, 7.9],
  [8.0, 8.1, 8.1, 8.0, 7.7, 7.8, 7.9, 7.9, 7.8, 7.7], [7.9, 7.9, 7.9, 7.8, 7.5, 7.6, 7.6, 7.7, 7.7, 7.5], [7.8, 7.7, 7.7, 7.6, 7.4, 7.3, 7.4, 7.5, 7.6, 7.5],
  [7.9, 7.7, 7.6, 7.4, 7.2, 7.4, 7.4, 7.5, 7.5, 7.4], [8.3, 8.0, 7.7, 7.7, 7.4, 7.5, 7.5, 7.4, 7.4, 7.3], [9.9, 10.6, 11.3, 10.0, 8.2, 7.8, 7.7, 7.5, 7.3, 7.2],
  [10.5, 10.6, 10.5, 9.9, 8.9, 8.2, 7.8, 7.5, 7.3, 7.2], [10.8, 10.6, 10.2, 9.7, 9.0, 8.3, 7.8, 7.5, 7.3, 7.1],
] }
/** The map's ground under (x, y), metres above the river (0 on the water). */
const ground = (x: number, y: number): number => {
  const g = y <= -250 ? groundAt(DET_GROUND, x, y) : y >= 330 ? groundAt(WIN_GROUND, x, y) : 0.1
  return Math.max(0, g - 0.1)
}

// ---- Parts --------------------------------------------------------------------

type Lod = 'low' | 'detail'
type Kit = { teal: Part; shade: Part; concrete: Part; cable: Part; neon: Part; lamp: Part; web: Part }
const newKit = (): Kit => ({ teal: new Part(), shade: new Part(), concrete: new Part(), cable: new Part(), neon: new Part(), lamp: new Part(), web: new Part() })
/** Teal steel, its downward faces in the shade colour (the dark underside in every photo). */
const steel = (k: Kit): Skin => (n) => (n[2] < -0.5 ? k.shade : k.teal)

// ---- The sign's letters ---------------------------------------------------------
// Roman capitals, cap height 1, traced from the CBP and Drury photos: plain
// strokes of even weight with short slab serifs on the stems.
type Glyph = { w: number; draw: (p: Pen, serif: boolean, n: number) => void }
/** Segments per curve: fewer in the low model. */
const SERIF = 0.13
function serifs(p: Pen, at: Pt[], on: boolean) {
  if (!on) return
  for (const [u, v] of at) p.moveTo([u - SERIF, v]).lineTo([u + SERIF, v])
}
const bowl = (p: Pen, x0: number, y0: number, y1: number, depth: number, n: number) => {
  const r = (y1 - y0) / 2
  p.moveTo([x0, y1]).lineTo([x0 + depth - r, y1]).arc([x0 + depth - r, y0 + r], -Math.PI, n).lineTo([x0, y0])
}
const GLYPHS: Record<string, Glyph> = {
  A: { w: 0.82, draw: (p, s, n) => { p.moveTo([0, 0]).lineTo([0.41, 1]).lineTo([0.82, 0]); p.moveTo([0.17, 0.33]).lineTo([0.65, 0.33]); serifs(p, [[0.02, 0], [0.8, 0]], s) } },
  M: { w: 0.96, draw: (p, s, n) => { p.moveTo([0.04, 0]).lineTo([0.08, 1]).lineTo([0.48, 0.02]).lineTo([0.88, 1]).lineTo([0.92, 0]); serifs(p, [[0.04, 0], [0.92, 0]], s) } },
  B: { w: 0.66, draw: (p, s, n) => { p.moveTo([0, 0]).lineTo([0, 1]); bowl(p, 0, 0.52, 1, 0.6, n); bowl(p, 0, 0, 0.52, 0.66, n); serifs(p, [[0, 0], [0, 1]], s) } },
  S: { w: 0.62, draw: (p, _s, n) => { p.moveTo([0.58, 0.86]).cubicTo([0.5, 1.03], [0.04, 1.05], [0.04, 0.75], n).cubicTo([0.04, 0.5], [0.6, 0.53], [0.6, 0.25], n).cubicTo([0.6, -0.05], [0.1, -0.04], [0.02, 0.14], n) } },
  D: { w: 0.76, draw: (p, s, n) => { p.moveTo([0, 0]).lineTo([0, 1]); bowl(p, 0, 0, 1, 0.76, n + 2); serifs(p, [[0, 0], [0, 1]], s) } },
  O: { w: 0.82, draw: (p, _s, n) => { p.circle([0.41, 0.5], 0.41, 0.5, 2 * n + 2) } },
  R: { w: 0.7, draw: (p, s, n) => { p.moveTo([0, 0]).lineTo([0, 1]); bowl(p, 0, 0.5, 1, 0.62, n); p.moveTo([0.3, 0.5]).lineTo([0.7, 0]); serifs(p, [[0, 0], [0, 1]], s) } },
  I: { w: 0.0, draw: (p, s, n) => { p.moveTo([0, 0]).lineTo([0, 1]); serifs(p, [[0, 0], [0, 1]], s) } },
  G: { w: 0.76, draw: (p, _s, n) => { p.moveTo([0.72, 0.83]).cubicTo([0.62, 1.04], [0.02, 1.08], [0.02, 0.5], n).cubicTo([0.02, -0.08], [0.62, -0.03], [0.75, 0.12], n).lineTo([0.75, 0.42]).lineTo([0.46, 0.42]) } },
  E: { w: 0.62, draw: (p, s, n) => { p.moveTo([0.62, 1]).lineTo([0, 1]).lineTo([0, 0]).lineTo([0.64, 0]); p.moveTo([0, 0.52]).lineTo([0.5, 0.52]) } },
}
/**
 * The low model's letters: each stroke a flat ribbon facing the reader, in
 * a double-sided material, a quarter of the triangles of a solid stroke,
 * which at the low model's distances reads the same.
 */
function ribbons(part: Part, paths: Pt[][], width: number, place: (u: number, v: number, w: number) => V3) {
  const h = width / 2
  for (const path of paths) for (let i = 0; i + 1 < path.length; i++) {
    const [a, b] = [path[i], path[i + 1]]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (l < 1e-6) continue
    // Overlap the joints a little so the ribbon reads continuous.
    const t: Pt = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], nn: Pt = [-t[1] * h, t[0] * h], e = Math.min(h, l / 2)
    const A: Pt = [a[0] - t[0] * e, a[1] - t[1] * e], B: Pt = [b[0] + t[0] * e, b[1] + t[1] * e]
    const q = [[A[0] - nn[0], A[1] - nn[1]], [B[0] - nn[0], B[1] - nn[1]], [B[0] + nn[0], B[1] + nn[1]], [A[0] + nn[0], A[1] + nn[1]]].map(([u, v]) => place(u, v, 0))
    const front = sub(place(0, 0, 1), place(0, 0, 0))
    const g = cross(sub(q[1], q[0]), sub(q[2], q[0]))
    const [p0, p1, p2, p3] = g[0] * front[0] + g[1] * front[1] + g[2] * front[2] >= 0 ? q : [q[3], q[2], q[1], q[0]]
    part.quad(p0, p1, p2, p3)
  }
}

/** A word's pen, its width in letter units, centred on u = 0. */
function word(text: string, gap: number, serif: boolean, n: number): Pen {
  const pen = new Pen()
  let u = 0
  for (const ch of text) {
    const g = GLYPHS[ch], part = new Pen()
    g.draw(part, serif, n)
    pen.add(part, u)
    u += g.w + gap
  }
  pen.translate(-(u - gap) / 2)
  return pen
}

// ---- A tower --------------------------------------------------------------------

/**
 * One tower at y = ty, its sign facing `face` (-1 toward Detroit, +1 toward
 * Windsor), into the kit's parts.
 */
function tower(k: Kit, ty: number, face: number, lod: Lod) {
  const S = steel(k)
  // Concrete pedestals under the legs, on the bank or in the water.
  for (const s of [-1, 1]) {
    const x0 = s * LEG_X - 2, x1 = s * LEG_X + 2
    const plan: [number, number][] = [[x0, ty - 2.75], [x1, ty - 2.75], [x1, ty + 2.75], [x0, ty + 2.75]]
    footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: 4.2 }], lod === 'low' ? 6 : 2.5)
  }
  // Legs: lattice columns drawn solid, tapering along the bridge.
  const LEG_TOP = 115.5
  for (const s of [-1, 1]) {
    const a = s * LEG_X - LEG_W / 2, b = s * LEG_X + LEG_W / 2
    const ring = (z: number, d: number): V3[] => [[a, ty - d, z], [b, ty - d, z], [b, ty + d, z], [a, ty + d, z]]
    const rings = [ring(4.2, 2.3), ring(LEG_TOP, 1.7), ring(LEG_TOP + 0.7, 1.3)]
    for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < 4; j++) {
      const A = rings[i][j], B = rings[i][(j + 1) % 4], C = rings[i + 1][(j + 1) % 4], D = rings[i + 1][j]
      const n = norm(cross(sub(B, A), sub(D, A)))
      S(n).quad(A, B, C, D)
    }
    const t = rings[2]
    k.teal.quad(t[0], t[1], t[2], t[3])
  }
  /** The legs' half-depth along y at height z. */
  const legD = (z: number) => 2.3 - (0.6 * (z - 4.2)) / (LEG_TOP - 4.2)

  /** A lattice strut between the legs, z0–z1: chords, and diamonds in the detail. */
  function lattice(z0: number, z1: number, bays: number) {
    const d = Math.min(legD(z1), 1.3), ch = Math.min(1.3, (z1 - z0) * 0.2)
    box(S, -LEG_IN, LEG_IN, ty - d, ty + d, z1 - ch, z1, { r: 0, bottom: true })
    box(S, -LEG_IN, LEG_IN, ty - d, ty + d, z0, z0 + ch, { r: 0, bottom: true })
    const w = (2 * LEG_IN) / bays, zm = (z0 + z1) / 2
    const mem = 1.0
    for (let i = 0; i < bays; i++) {
      const xa = -LEG_IN + i * w, xb = xa + w, xm = (xa + xb) / 2
      // A diamond in each bay: four members from the chords' midpoints to the bay's sides.
      beam(S, [xm, ty, z0 + ch * 0.5], [xa + 0.2, ty, zm], mem, 2 * d * 0.7)
      beam(S, [xm, ty, z0 + ch * 0.5], [xb - 0.2, ty, zm], mem, 2 * d * 0.7)
      beam(S, [xa + 0.2, ty, zm], [xm, ty, z1 - ch * 0.5], mem, 2 * d * 0.7)
      beam(S, [xb - 0.2, ty, zm], [xm, ty, z1 - ch * 0.5], mem, 2 * d * 0.7)
      if (lod === 'detail' && i > 0) beam(S, [xa, ty, z0 + ch], [xa, ty, z1 - ch], 0.5, 2 * d * 0.7)
    }
  }
  /** An X panel between the legs, z0–z1. */
  function xPanel(z0: number, z1: number) {
    const d = legD((z0 + z1) / 2) * 0.55
    for (const s of [-1, 1]) beam(S, [-s * LEG_IN, ty, z0], [s * LEG_IN, ty, z1], 1.7, 2 * d)
  }
  // Under the deck the low model draws the lattice struts as plain girders.
  const strut = (z0: number, z1: number, bays: number) => lod === 'low'
    ? box(S, -LEG_IN, LEG_IN, ty - 1.2, ty + 1.2, z0, z1, { r: 0, bottom: true })
    : lattice(z0, z1, bays)
  strut(7.2, 13.2, 3)
  xPanel(13.2, 33.6)
  // The seat strut under the trusses, a lattice girder like the others.
  strut(33.6, roadAtTower - MAIN_DOWN - 0.1, 4)
  for (const [z0, z1] of [[50.5, 69], [69, 87.5], [87.5, 106.5]]) xPanel(z0, z1)
  lattice(106.5, 113.6, 3)

  // The sign: a light steel frame on the top strut, BRIDGE on its outer face
  // and AMBASSADOR standing on top of it, in 2.1 m capitals (CBP, Drury).
  const H = 2.1, FRAME_TOP = 118.4, SIGN_W = 11.4
  const fy = ty + face * 0.9
  const frame = (x0: number, x1: number, z0: number, z1: number) => box(one(k.cable), x0, x1, fy - 0.2, fy + 0.2, z0, z1, { r: 0 })
  frame(-SIGN_W, SIGN_W, FRAME_TOP - 0.35, FRAME_TOP)
  frame(-SIGN_W, SIGN_W, 113.6, 114.0)
  const posts = stations(-SIGN_W + 0.15, SIGN_W - 0.15, lod === 'low' ? 6 : 3)
  for (const x of posts) frame(x - 0.15, x + 0.15, 114.0, FRAME_TOP - 0.35)
  if (lod === 'detail') for (let i = 0; i < posts.length - 1; i++)
    for (const [za, zb] of [[114.0, FRAME_TOP - 0.35], [FRAME_TOP - 0.35, 114.0]])
      rod(k.cable, [posts[i], fy, za], [posts[i + 1], fy, zb], 0.1, 3)
  // Reader's right: +x seen from Detroit (facing +y), -x from Windsor.
  const ux = face < 0 ? 1 : -1
  const serif = lod === 'detail'
  for (const [text, gap, z0] of [['AMBASSADOR', 0.42, FRAME_TOP + 0.1], ['BRIDGE', 0.56, 115.3]] as [string, number, number][]) {
    const pen = word(text, gap, serif, lod === 'low' ? 3 : 6)
    const place = (u: number, v: number, w: number): V3 => [ux * u * H, fy + face * (0.2 + w * H), z0 + v * H]
    if (lod === 'detail') strokes(k.neon, pen.paths, { width: 0.15, depth: 0.12, back: true, place })
    else ribbons(k.neon, pen.paths, 0.17, place)
  }
}

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

// ---- The span -------------------------------------------------------------------

const MAIN: [number, number] = [-TY + 2.3, TY - 2.3]
const DET_SIDE: [number, number] = [DET_PYLON, -TY - 2.3]
const WIN_SIDE: [number, number] = [TY + 2.3, WIN_PYLON]
// Bent towers: two bents 8 m apart, evenly spaced between tower and
// anchorage, six on the Detroit side and five on the Windsor side.
const BENTS = [
  ...stations(-TY, DET_BLOCK, (DET_BLOCK + TY) / -7).slice(1, -1),
  ...stations(TY, WIN_BLOCK, (WIN_BLOCK - TY) / 6).slice(1, -1),
]

function span(k: Kit, lod: Lod) {
  const S = steel(k)
  const mainTop = (y: number) => road(y) + MAIN_UP, mainBot = (y: number) => road(y) - MAIN_DOWN
  const sideTop = (y: number) => road(y) + SIDE_UP, sideBot = (y: number) => road(y) - SIDE_DOWN
  const curve = ([a, b]: [number, number], step: number) => stations(a, b, step)

  for (const [sp, X, top, bot, panel] of [
    [MAIN, MAIN_TRUSS_X, mainTop, mainBot, 9.4],
    [DET_SIDE, SIDE_TRUSS_X, sideTop, sideBot, 9.0],
    [WIN_SIDE, SIDE_TRUSS_X, sideTop, sideBot, 9.0],
  ] as [[number, number], number, (y: number) => number, (y: number) => number, number][]) {
    const ys = curve(sp, sp === MAIN ? 24 : 1000)
    for (const s of [-1, 1]) {
      if (lod === 'low') {
        band(k.teal, s * (X - 0.4), s * (X + 0.4), ys, top, (y) => bot(y) + 0.01, { out: true, in: true, top: true, ends: true })
        band(k.shade, s * (X - 0.4), s * (X + 0.4), ys, (y) => bot(y) + 0.01, bot, { bottom: true })
      } else {
        truss(k.teal, k.web, s * X, curve(sp, panel), top, bot, { chordW: 0.8, topD: 0.8, botD: 0.9, member: 0.45, curve: ys })
      }
    }
    // The floor system's underside, facing down, between the trusses.
    band(k.shade, -X + 0.4, X - 0.4, ys, (y) => road(y) - 0.6, (y) => road(y) - 1.6, { bottom: true })
    if (lod === 'detail') {
      const ps = curve(sp, panel)
      for (let i = 0; i < ps.length; i++) {
        const y = ps[i]
        band(k.shade, -X, X, [y - 0.3, y + 0.3], () => road(y) - 1.6, () => road(y) - 2.8, { bottom: true, out: true, in: true, ends: true })
        if (i + 1 < ps.length) {
          const y2 = ps[i + 1]
          for (const [xa, xb] of [[-1, 1], [1, -1]])
            strip(k.web, [xa * X, y, bot(y) + 0.5], [xb * X, y2, bot(y2) + 0.5], 0.45, [0, 0, 1])
        }
      }
    }
  }

  // Bent towers under the side spans: four posts from the ground to the
  // trusses, a cap girder across each bent, X bracing between the bents.
  for (const yc of BENTS) {
    const ya = yc - 4, yb = yc + 4
    const capZ = (y: number) => road(y) - SIDE_DOWN
    for (const y of [ya, yb]) {
      for (const s of [-1, 1]) {
        const x = s * SIDE_TRUSS_X, h = 0.55
        const plan: [number, number][] = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]]
        footedLoft(k.teal, ground, [{ plan, z: 'ground' }, { plan, z: capZ(y) - 1.2 }], 4, false)
      }
      box(S, -SIDE_TRUSS_X - 0.6, SIDE_TRUSS_X + 0.6, y - 0.6, y + 0.6, capZ(y) - 1.2, capZ(y), { r: 0 })
    }
    const g = Math.max(ground(-SIDE_TRUSS_X, yc), ground(SIDE_TRUSS_X, yc)) + 1
    const zTop = capZ(yc) - 1.2
    const levels = lod === 'low' ? [g, zTop] : stations(g, zTop, 10)
    for (const s of [-1, 1]) {
      const x = s * SIDE_TRUSS_X
      for (let i = 0; i < levels.length - 1; i++) {
        const za = levels[i], zb = levels[i + 1]
        beam(S, [x, ya + 0.4, za], [x, yb - 0.4, zb], 0.55, 0.5, [1, 0, 0])
        beam(S, [x, yb - 0.4, za], [x, ya + 0.4, zb], 0.55, 0.5, [1, 0, 0])
        if (lod === 'detail') box(S, x - 0.3, x + 0.3, ya, yb, zb - 0.4, zb, { r: 0 })
      }
    }
    if (lod === 'detail') for (const y of [ya, yb]) for (let i = 0; i < levels.length - 1; i++) {
      const za = levels[i], zb = levels[i + 1]
      strip(k.web, [-SIDE_TRUSS_X, y, za], [SIDE_TRUSS_X, y, zb], 0.45, [0, 1, 0])
      strip(k.web, [SIDE_TRUSS_X, y, za], [-SIDE_TRUSS_X, y, zb], 0.45, [0, 1, 0])
    }
  }
}

// ---- Anchorages -----------------------------------------------------------------

/**
 * One anchorage: a low block where the cables go in (from yBlock to yPylon,
 * top zBlock), then two pylons beside the roadway to the outline's end, and a
 * cap beam across between them 0.5 m under the road.
 */
function anchorage(k: Kit, yBlock: number, yPylon: number, yEnd: number, zBlock: number, zPylon: number) {
  const [a, b] = [Math.min(yBlock, yPylon), Math.max(yBlock, yPylon)]
  const block: [number, number][] = [[-16, a], [16, a], [16, b], [-16, b]]
  footedLoft(k.concrete, ground, [{ plan: block, z: 'ground' }, { plan: block, z: zBlock }], 4)
  const [c, d] = [Math.min(yPylon, yEnd), Math.max(yPylon, yEnd)]
  for (const s of [-1, 1]) {
    const x0 = s * 9.4, x1 = s * 17.2
    const [xa, xb] = [Math.min(x0, x1), Math.max(x0, x1)]
    const rect = (i: number): [number, number][] => [[xa + i, c + i], [xb - i, c + i], [xb - i, d - i], [xa + i, d - i]]
    const plan = rect(0), inset = rect(0.6)
    footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: zPylon - 1.4 }, { plan: inset, z: zPylon - 0.6 }, { plan: inset, z: zPylon }], 4)
  }
  const ym = (c + d) / 2
  band(k.concrete, -9.4, 9.4, [c, d], () => road(ym) - 0.5, () => road(ym) - 3.2, { out: true, in: true, bottom: true, top: true, ends: true })
}

// ---- Cables, suspenders, lights --------------------------------------------------

function cables(k: Kit, lod: Lod) {
  const step = lod === 'low' ? 40 : 8, sides = lod === 'low' ? 5 : 10, R = lod === 'low' ? 0.6 : CABLE_R
  for (const s of [-1, 1]) {
    const main = stations(-TY, TY, step).map((y) => [s * CABLE_X, y, mainCable(y)] as V3)
    tube(k.cable, main, R, sides)
    for (const [stay, end] of [[DET_STAY, DET_ANCH], [WIN_STAY, WIN_ANCH]] as const) {
      const ys = stations(Math.sign(end[0]) * TY, end[0], lod === 'low' ? 1000 : 25)
      if (lod === 'low') ys.splice(1, 0, (Math.sign(end[0]) * TY + end[0]) / 2)
      tube(k.cable, ys.map((y) => [s * stay.x(y), y, stay.z(y)] as V3), R, sides)
    }
    // Necklace lights: about 30 a cable over the main span and 8 on each backstay.
    // The low model keeps every other light, larger.
    const r = lod === 'low' ? 1.8 : 0.6, keep = (i: number) => lod === 'detail' || i % 2 === 0
    const top = (p: V3): V3 => [p[0], p[1], p[2] + CABLE_R + r * 0.6]
    along(stations(-TY, TY, 4).map((y) => [s * CABLE_X, y, mainCable(y)] as V3), 30).forEach((p, i) => keep(i) && bead(k.lamp, top(p), r, lod === 'low'))
    for (const [stay, end] of [[DET_STAY, DET_ANCH], [WIN_STAY, WIN_ANCH]] as const) {
      const path = stations(Math.sign(end[0]) * TY, end[0] * 0.93 + Math.sign(end[0]) * TY * 0.07, 10).map((y) => [s * stay.x(y), y, stay.z(y)] as V3)
      along(path, 8).forEach((p, i) => keep(i) && bead(k.lamp, top(p), r, lod === 'low'))
    }
  }
  if (lod === 'detail') {
    // Suspenders every 18.2 m (twice the real spacing), from the cable to the truss's top chord.
    for (const y of stations(-TY, TY, 18.2).slice(1, -1)) for (const s of [-1, 1]) {
      const z0 = road(y) + MAIN_UP, z1 = mainCable(y) - CABLE_R * 0.6
      if (z1 - z0 > 0.8) rod(k.cable, [s * CABLE_X, y, z0], [s * CABLE_X, y, z1], 0.2, 4)
    }
  }
}

// ---- The Windsor approach ------------------------------------------------------------

/** Bent towers under the Windsor approach, about every 36 m from the pylons to the abutment (estimated). */
const APPROACH_BENTS = stations(WIN_END, ABUT, 36).slice(1, -1)
const APPROACH_X = SIDE_TRUSS_X
/**
 * The approach truss's depth under the roadway: 5.5 m where the deck is high,
 * shallower where it comes down over the Windsor streets toward the abutment.
 */
function approachDepth(y: number): number {
  const g = Math.max(ground(-APPROACH_X, y), ground(APPROACH_X, y))
  return Math.min(5.5, Math.max(2.2, 0.6 * (road(y) - g)))
}

/**
 * The Windsor approach viaduct (OSM way/988967485), from the pylons' far
 * face to the abutment where the deck lands: the deck truss on X-braced steel
 * bent towers, as the side spans', but shallower. Drawn straight along the axis in a
 * kit of its own and then bent sideways (x += approachX(y)) to follow the
 * road's curve over the last 60 m.
 */
function approach(k: Kit, lod: Lod) {
  const a = newKit(), S = steel(a)
  // Ground under a point of the straight drawing, read where it ends up after the bend.
  const g0 = (x: number, y: number) => ground(x + approachX(y), y)
  const top = (y: number) => road(y) + SIDE_UP, bot = (y: number) => road(y) - approachDepth(y)
  const ys = stations(WIN_END, ABUT, lod === 'low' ? 56 : 9)
  for (const s of [-1, 1]) {
    if (lod === 'low') {
      band(a.teal, s * (APPROACH_X - 0.4), s * (APPROACH_X + 0.4), ys, top, (y) => bot(y) + 0.01, { out: true, in: true, top: true })
      band(a.shade, s * (APPROACH_X - 0.4), s * (APPROACH_X + 0.4), ys, (y) => bot(y) + 0.01, bot, { bottom: true })
    } else {
      truss(a.teal, a.web, s * APPROACH_X, ys, top, bot, { chordW: 0.8, topD: 0.7, botD: 0.8, member: 0.4 })
    }
  }
  band(a.shade, -APPROACH_X + 0.4, APPROACH_X - 0.4, ys, (y) => road(y) - 0.6, (y) => road(y) - 1.6, { bottom: true })
  if (lod === 'detail') for (let i = 0; i + 1 < ys.length; i += 2) {
    const [y, y2] = [ys[i], ys[i + 1]]
    strip(a.web, [-APPROACH_X, y, bot(y) + 0.4], [APPROACH_X, y2, bot(y2) + 0.4], 0.4, [0, 0, 1])
  }
  // Bent towers, as the side spans': two bents 6 m apart, each two posts
  // under the trusses and a cap girder, X-braced between them on each side.
  // The low model draws every other tower, with one cap across both bents.
  for (const yc of APPROACH_BENTS.filter((_, i) => lod === 'detail' || i % 2 === 0)) {
    const ya = yc - 3, yb = yc + 3
    if (lod === 'low') box(S, -APPROACH_X - 0.6, APPROACH_X + 0.6, ya - 0.5, yb + 0.5, Math.min(bot(ya), bot(yb)) - 1.0, Math.max(bot(ya), bot(yb)), { r: 0 })
    for (const y of [ya, yb]) {
      const capTop = bot(y), capBot = capTop - 1.0
      if (lod === 'detail') box(S, -APPROACH_X - 0.6, APPROACH_X + 0.6, y - 0.5, y + 0.5, capBot, capTop, { r: 0 })
      for (const s of [-1, 1]) {
        const x = s * APPROACH_X, h = 0.5
        const plan: [number, number][] = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]]
        footedLoft(a.teal, g0, [{ plan, z: 'ground' }, { plan, z: capBot + 0.05 }], 4, false)
      }
    }
    const gz = Math.max(g0(-APPROACH_X, yc), g0(APPROACH_X, yc)) + 1, zTop = Math.min(bot(ya), bot(yb)) - 1.0
    if (zTop - gz < 3) continue
    const levels = lod === 'low' ? [gz, zTop] : stations(gz, zTop, 9)
    for (const s of [-1, 1]) {
      const x = s * APPROACH_X
      for (let i = 0; i + 1 < levels.length; i++) {
        const [za, zb] = [levels[i], levels[i + 1]]
        beam(S, [x, ya + 0.4, za], [x, yb - 0.4, zb], 0.45, 0.45, [1, 0, 0])
        beam(S, [x, yb - 0.4, za], [x, ya + 0.4, zb], 0.45, 0.45, [1, 0, 0])
      }
    }
  }
  // The abutment: a concrete wall across the deck's end from the ground to
  // 0.4 m under the roadway, its face toward the river, and short wing walls.
  const zt = road(ABUT) - 0.4
  const wall: [number, number][] = [[-APPROACH_X - 1.5, ABUT], [APPROACH_X + 1.5, ABUT], [APPROACH_X + 1.5, ABUT + 3], [-APPROACH_X - 1.5, ABUT + 3]]
  footedLoft(a.concrete, g0, [{ plan: wall, z: 'ground' }, { plan: wall, z: zt }], lod === 'low' ? 6 : 3)
  for (const s of [-1, 1]) {
    const x0 = s * (APPROACH_X + 0.4), x1 = s * (APPROACH_X + 1.5)
    const wing: [number, number][] = [[Math.min(x0, x1), ABUT - 8], [Math.max(x0, x1), ABUT - 8], [Math.max(x0, x1), ABUT], [Math.min(x0, x1), ABUT]]
    footedLoft(a.concrete, g0, [{ plan: wing, z: 'ground' }, { plan: wing, z: road(ABUT - 8) - 0.4 }], 4)
  }
  // Bend it to the road and add it to the bridge's parts.
  for (const key of Object.keys(a) as (keyof Kit)[]) {
    const part = a[key]
    for (let i = 0; i < part.pos.length; i += 3) part.pos[i] += approachX(-part.pos[i + 2])
    for (const f of ['pos', 'nrm', 'uv'] as const) for (const v of part[f]) k[key][f].push(v)
  }
}

// ---- Build ------------------------------------------------------------------------

function build(lod: Lod): Kit {
  const k = newKit()
  tower(k, -TY, -1, lod)
  tower(k, TY, 1, lod)
  span(k, lod)
  anchorage(k, DET_BLOCK, DET_PYLON, DET_END, 12.5, 34)
  anchorage(k, WIN_BLOCK, WIN_PYLON, WIN_END, 14.5, 38.5)
  approach(k, lod)
  cables(k, lod)
  return k
}

if (import.meta.main) {
  // Colours from the sunlit and overcast 2025 photos: the teal paint pulled to
  // the palette's lightness, its underside in shadow; pale concrete; the
  // cables' pale grey-green paint; the signs' red neon.
  const TEAL = finish('ambassador-teal', 0x4fa6ae)
  const SHADE = finish('ambassador-teal-shade', 0x34727c)
  const CONCRETE = finish('concrete', 0xd6d3cb)
  const CABLE = finish('cable-paint', 0xb0bfbb)
  const NEON = finish('neon-sign-red', 0xc0392f)
  const LAMP = { name: 'lamp', color: 0xc4d0cc }
  const low = build('low'), detail = build('detail')
  const list = (k: Kit, lod: Lod) => [
    { part: lod === 'low' ? k.teal : merged(k.teal, k.web), material: lod === 'low' ? TEAL : { ...TEAL, doubleSided: true } },
    { part: k.shade, material: SHADE },
    { part: k.concrete, material: CONCRETE },
    { part: k.cable, material: CABLE },
    { part: k.neon, material: lod === 'low' ? { ...NEON, doubleSided: true } : NEON },
    { part: k.lamp, material: LAMP },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the river',
    bearing: 154.298, elevation: 0, towers: [-TY, TY], ends: [DET_END, ABUT],
    roadwayMidspan: road(0), roadwayAtTowers: roadAtTower, roadwayEnds: [road(DET_END), road(ABUT)],
  }
  for (const [file, parts, maxTris, maxBytes] of [
    ['det-ambassador-bridge.glb', list(low, 'low'), 6500, 250 * 1024],
    ['det-ambassador-bridge.detail.glb', list(detail, 'detail'), 40000, 1536 * 1024],
  ] as const) {
    const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Ambassador Bridge', [...parts], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
