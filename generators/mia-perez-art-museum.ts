/**
 * Pérez Art Museum Miami (PAMM; 2013, Herzog & de Meuron), Museum Park,
 * 1103 Biscayne Boulevard — original procedural geometry, CC0-1.0.
 * bun generators/mia-perez-art-museum.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the canopy, OSM way/316749780,
 * 25.7860227, -80.1862579. The canopy's edges run 65.2° / 335.2°, so the
 * catalog bearing is 335.2 and the model is square to its own frame
 * (+y points NNW, to Biscayne Boulevard's side; -y faces the bay walk).
 *
 * Identity: the wide flat slatted canopy on thin white columns, its slat
 * ends fringing the edges; the hanging gardens, cylinders of plants that
 * dangle from it; the pale board-formed concrete museum box with big
 * windows standing on a raised platform with a grand stair to the bay.
 *
 * Sources:
 *  - OSM: canopy way/316749780 (building:part=roof, 14 m tagged — lidar
 *    says ~20 m, see below), museum way/484587327 (4 levels from level 1,
 *    wikidata Q3026874), the car park under the platform and the plaza,
 *    way/484587328 (layer -1). The complex outline way/1381279639 covers the
 *    Frost Museum and the plaza as well and is listed by mia-frost-science,
 *    not here, so the two models never claim the same way.
 *  - Lidar: USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019), 1 m grid in this frame, heights above the lowest ground
 *    (ground_min + 0.45 m, the Biscayne side): canopy 19.4–21.0 (measured;
 *    two slat tiers), museum roof 21.2 (measured), canopy x ±57, y -38..36
 *    (measured, matches OSM), bay-side platform/plaza 3.0–3.9 (measured on
 *    the uncovered edges), street 0–0.6.
 *  - NAIP (USGS, public domain): the canopy's grid of slatted panels and
 *    the white museum roof.
 *  - Estimated from the photos below: platform 3.8 m, the glazed ground
 *    storey (3.8–8.5) set back under the concrete upper storeys, window
 *    sizes, column spacing (~12 m), garden cylinders (1 m radius, 9–13 m
 *    long, drawn thicker and fewer than the real ~70), the stair's width.
 *  - Colours: concrete pale warm grey; canopy slats weathered light grey
 *    on top, timber brown underneath; columns white; gardens muted green.
 *
 * Photos (Wikimedia Commons, daylight):
 *  - Perez_Art_Museum_Miami.jpg, B137, CC BY-SA 3.0 — the concrete box and
 *    the name sign over the platform wall;
 *  - PAMM_MRD_23.jpg, Phillip Pessar, CC BY 2.0 — the bay-side stair and
 *    the canopy's slat fringe;
 *  - PAMM_MRD_27.jpg, Phillip Pessar, CC BY 2.0 — the south front from the
 *    park: box, canopy, columns;
 *  - Perez_Museum,_Miami,_Florida,_USA_(51015423222).jpg, Paolo Gamba,
 *    CC BY 2.0 — the veranda under the canopy with hanging gardens;
 *  - PAMM_MRD_09.jpg, Phillip Pessar, CC BY 2.0 — the entrance front:
 *    columns, gardens, glazed lobby, the timber underside;
 *  - PAMM_MRD_20.jpg, Allison Meier, CC BY-SA 2.0 — night, the canopy
 *    underside and lobby lit.
 * No commercial imagery or 3D tiles. No look-only sources.
 *
 * Doubts: the slat panels are drawn as one slab with a grid of beams on
 * top and a fringe of slat ends, not as open slats; the museum's internal
 * steps in section (its stacked galleries) are simplified to one box with
 * a recessed glazed base. The north side under the canopy is only seen in
 * passing. The canopy and the box roof are tagged 14 m in OSM; the model
 * follows lidar.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, walls, capRing, face, build, box, panels } from './mia-panorama-tower'

const concrete = new Part(), win = new Part(), slats = new Part(), timber = new Part(), white = new Part(), green = new Part()

const PLAT = 3.8                      // platform top
const CW = 57.4, CN = 36, CS = -36.1  // canopy half-width, north and south edges
const CAN0 = 18.3, CAN1 = 20.0        // canopy slab underside / top
const BOX_TOP = 21.2

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ---------------- platform and the bay-side stair ----------------
const PLATFORM = rect(-CW, CS, CW, CN)
walls(PLATFORM, [[0, PLAT, concrete]])
capRing(concrete, PLATFORM, PLAT)
for (let k = 0; k < 5; k++) {
  const y1 = CS - k * 0.9, z = PLAT - (k + 1) * (PLAT / 6)
  const st = rect(-22, y1 - 0.9, 22, y1)
  walls(st, [[0, z, concrete]]); capRing(concrete, st, z)
}

// ---------------- the museum ----------------
// OSM way/484587327 in this frame (an L: main hall and the west wing)
const MAIN = rect(-25.7, -24.3, 28.0, 26.2)
const WING = rect(-41.9, 7.8, -25.7, 25.8)
const inset = (r: XY[], d: number) => { const [a, , c] = r; return rect(a[0] + d, a[1] + d, c[0] - d, c[1] - d) }
for (const r of [MAIN, WING]) {
  // glazed ground storey set back under the concrete
  const g = inset(r, 2.2)
  walls(g, [[PLAT, 8.5, win]])
  capRing(concrete, r, 8.5, false)
  walls(r, [[8.5, BOX_TOP, concrete]])
  capRing(white, r, BOX_TOP)
  // big windows on the concrete, grouped across the gallery storeys
  panels(win, r, 11.5, 17.5, { bay: 13, pier: 5, rowH: 6, spandrel: 0.6, minEdge: 10, proud: 0.06 })
}
// rooftop plant on the main hall (lidar 22–24 at its north-west)
box(white, -18, 18, 8, 6, BOX_TOP, BOX_TOP + 1.6)

// ---------------- the canopy ----------------
// slab around the museum (the museum's roof stands through it)
const STRIPS: XY[][] = [
  rect(-CW, CS, CW, -24.3), rect(-CW, 26.2, CW, CN),
  rect(28.0, -24.3, CW, 26.2), rect(-CW, -24.3, -25.7, 7.8), rect(-CW, 7.8, -41.9, 26.2),
]
for (const s of STRIPS) {
  capRing(slats, s, CAN1)
  capRing(timber, s, CAN0, false)
}
walls(PLATFORM, [[CAN0, CAN1, timber]])
// beams on top in a coarse grid (the slat panels' frames), skipping the museum
const inMuseum = (x: number, y: number) => (x > -25.7 && x < 28 && y > -24.3 && y < 26.2) || (x > -41.9 && x < -25.7 && y > 7.8 && y < 26.2)
const BX: number[] = [], BY: number[] = []
for (let i = 0; i <= 10; i++) BX.push(-CW + (2 * CW * i) / 10)
for (let j = 0; j <= 6; j++) BY.push(CS + ((CN - CS) * j) / 6)
for (const x of BX) {
  // segments of an N-S beam outside the museum
  let y0: number | null = null
  const ys = BY.flatMap((y, j) => (j ? [BY[j - 1] + (y - BY[j - 1]) / 2, y] : [y]))
  for (let j = 0; j < ys.length; j++) {
    const out = !inMuseum(x, ys[j])
    if (out && y0 === null) y0 = ys[j]
    if ((!out || j === ys.length - 1) && y0 !== null) { const y1 = out ? ys[j] : ys[j - 1]; if (y1 - y0 > 2) box(white, x, (y0 + y1) / 2, 1.0, y1 - y0, CAN1, CAN1 + 0.7); y0 = null }
  }
}
for (const y of BY) {
  let x0: number | null = null
  const xs = BX.flatMap((x, i) => (i ? [BX[i - 1] + (x - BX[i - 1]) / 2, x] : [x]))
  for (let i = 0; i < xs.length; i++) {
    const out = !inMuseum(xs[i], y)
    if (out && x0 === null) x0 = xs[i]
    if ((!out || i === xs.length - 1) && x0 !== null) { const x1 = out ? xs[i] : xs[i - 1]; if (x1 - x0 > 2) box(white, (x0 + x1) / 2, y, x1 - x0, 1.0, CAN1, CAN1 + 0.7); x0 = null }
  }
}
// the slat ends: a fringe of short bars standing out past the long edges and ends
for (let x = -CW + 1.5; x <= CW - 1.4; x += 2.9) {
  box(white, x, CN + 1.4, 0.8, 2.8, CAN1 - 0.6, CAN1, 0)
  box(white, x, CS - 1.4, 0.8, 2.8, CAN1 - 0.6, CAN1, 0)
}
for (let y = CS + 1.5; y <= CN - 1.4; y += 2.9) {
  box(white, CW + 1.4, y, 2.8, 0.8, CAN1 - 0.6, CAN1, 0)
  box(white, -CW - 1.4, y, 2.8, 0.8, CAN1 - 0.6, CAN1, 0)
}

// ---------------- columns ----------------
const COLS: XY[] = []
for (let x = -52; x <= 52.1; x += 13) for (const y of [-31, -12, 8, 31]) if (!inMuseum(x, y) && !inMuseum(x + 2, y + 2) && !inMuseum(x - 2, y - 2)) COLS.push([x, y])
for (const [x, y] of COLS) box(white, x, y, 0.8, 0.8, PLAT, CAN0, 0, false)

// ---------------- hanging gardens ----------------
const circ = (cx: number, cy: number, r: number, n = 8): XY[] => Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)] as XY)
const GARDENS: [number, number, number][] = [
  // bay-side veranda (south) and the west veranda, as in the photos
  [-46, -30, 10], [-38, -33, 12], [-30, -29, 9], [-14, -32, 11], [-6, -28.5, 13], [4, -32.5, 10], [14, -29, 12], [24, -33, 9], [36, -30, 11], [46, -32, 13],
  [-50, -16, 12], [-46, -6, 9], [-51, 3, 11], [-48, 14, 10], [-52, 24, 12],
  // the entrance (north) front
  [-20, 31, 11], [-8, 30, 9], [6, 32, 12], [18, 30, 10], [40, 30, 11],
  // east
  [40, -12, 12], [48, 2, 10], [38, 14, 9],
]
for (const [x, y, L] of GARDENS) {
  const c = ccw(circ(x, y, 1.05))
  walls(c, [[CAN0 - L, CAN0, green]])
  capRing(green, c, CAN0 - L, false)
}

const glow = (p: V3, n: V3) => (n[2] < -0.5 ? 0.9 : 0.3)
if (import.meta.main) {
  await build('Pérez Art Museum Miami', 'mia-perez-art-museum', [
    { part: concrete, material: finish('pamm-concrete', 0xddd8cf) },
    { part: win, material: PALETTE.window },
    { part: slats, material: finish('pamm-slats', 0xaaa69c) },
    { part: timber, material: { ...finish('pamm-timber', 0xc19f7b), floodlight: glow } },
    { part: white, material: PALETTE.trim },
    { part: green, material: finish('pamm-garden', 0x6f9a5c) },
  ], { bearing: 335.2, elevation: 0, height: BOX_TOP + 1.6, replaces: ['way/316749780', 'way/484587327', 'way/484587328'] }, process.argv[2], 6500)
}
