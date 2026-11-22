/**
 * Sylvan Building (built 1870–71 as the Central National Bank; Sylvan
 * Bros. jewellers since 1907), corner of Main and Hampton Streets,
 * Columbia, SC — original procedural geometry, CC0-1.0.
 * bun generators/cola-sylvan-building.ts
 *
 * Map frame: x east, y north, z up, metres; built in a frame turned to the
 * downtown grid, bearing 70 (+y toward 70°, along Hampton Street; +x toward
 * 160°, the Hampton front; -y is the Main Street front). Anchor = centroid
 * of OSM way/328921264 ("Sylvan Building", building=commercial, 4 levels,
 * roof:shape=quadruple_saltbox), 34.005594, -81.035022.
 *
 * Identity: a long three-storey Second Empire block of red brick with pale
 * stone quoins, window hoods and a bracketed cornice, under a steep slate
 * mansard with arched dormers; three taller mansard pavilions (the
 * chamfered Main/Hampton corner, the middle of the Hampton front and its
 * far end), chimneys on the ridge, and the jeweller's entrance in the cut
 * corner.
 *
 * Evidence:
 *  - plan: OSM way/328921264, simplified to x -4.8..6.3, y -24..23.5 with
 *    the chamfered corner (1.5,-24)–(6.3,-19.2). OSM's 1.5 m step in the
 *    Hampton face and the small bump on the north side (x -6.8) are not
 *    drawn: the lidar shows the Hampton wall at x ≈ 6.3 its whole length,
 *    and the bump at about 3–4 m (a back porch).
 *  - heights: USGS 3DEP SC_SavannahPeeDee_5_2019 (2019 flight), 0.5 m
 *    grid. Measured: eaves 13.5–14 m (with the cornice), mansard top about
 *    17.0 m, pavilion tops 18.2–19.2 m (corner y -22..-15, middle
 *    y -3..4.5, east end y 17..23). Storey heights (shop storey ~4.8 m,
 *    second to ~8.9 m, third to the cornice at ~12.4 m) estimated from Boucher's HABS view, scaled
 *    to the lidar eaves.
 *  - bays, dormers, pavilions, chimneys: Boucher's HABS photo (1960) of the
 *    Main and Hampton fronts; the brick and trim colours from the 2016
 *    photos. The roof is still the 1960 roof in the lidar.
 *  - colour: salmon-red painted brick and white trim (Mjcrawf1, Milligan),
 *    pulled to the palette's lightness; the mansard grey slate (`roof`).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Sylvan building Columbia.jpg, Mjcrawf1, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Sylvan_building_Columbia.jpg
 *  - Sylvan Building; Columbia, South Carolina; February 26, 2016.jpg,
 *    Stephen Matthew Milligan, CC BY-SA 4.0 (canopy cresting detail)
 *    https://commons.wikimedia.org/wiki/File:Sylvan_Building;_Columbia,_South_Carolina;_February_26,_2016.jpg
 *  - HABS SC,40-COLUM,8-1, Sylvan entrance on south and west sides, Jack
 *    Boucher, 1960, public domain
 *    https://commons.wikimedia.org/wiki/File:Historic_American_Buildings_Survey,_April,_1960_SYLVAN_ENTRANCE_ON_SOUTH_AND_WEST_SIDES._-_Central_National_Bank,_Hampton_and_Main_Streets,_Columbia,_Richland_County,_SC_HABS_SC,40-COLUM,8-1.tif
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north and east (back) walls are unphotographed; their
 * windows are a sparse estimated rhythm; dormer count and spacing are read from one oblique 1960 photo;
 * the copper entrance canopy and the cast-iron street clock on the
 * sidewalk (a separate HABS landmark, outside the footprint) are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, cornice, offset, prism, save, type XY } from './atl-flatiron-building'
import { archOn, gable, rectOn } from './cola-palmetto-building'

const brick = new Part(), trim = new Part(), win = new Part(), slate = new Part(), door = new Part()

const X0 = -4.8, X1 = 6.3, Y0 = -24, Y1 = 23.5
const ring: XY[] = [[X0, Y0], [1.5, Y0], [X1, -19.2], [X1, Y1], [X0, Y1]]
const SHOP = 4.8, MID = 8.9, EAVE = 12.4, CORN = 13.7, TOP = 17.0, PAV = 18.6

/** A steep mansard from `ring` at z0 to the ring inset by `inset` at z1, capped flat. */
function mansard(r: XY[], z0: number, z1: number, inset: number) {
  const top = offset(r, -inset)
  const n = r.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [r[i][0], r[i][1], z0], b: V3 = [r[j][0], r[j][1], z0]
    const c: V3 = [top[j][0], top[j][1], z1], d: V3 = [top[i][0], top[i][1], z1]
    slate.quad(a, b, c, d)
  }
  capPoly(slate, top, z1, true)
  cornice(trim, top, z1 - 0.3, 0.35, 0.15, slate)
}

// ── Walls, string course, bracketed cornice ──
prism(brick, ring, 0, CORN, null, 0)
cornice(trim, ring, SHOP - 0.2, 0.6, 0.25)
cornice(trim, ring, MID - 0.1, 0.3, 0.1)
cornice(trim, ring, EAVE, CORN - EAVE, 0.7, slate)

// ── Mansards: the long roof and the three taller pavilions ──
mansard(ring, CORN, TOP, 1.5)
const corner: XY[] = [[X0, Y0], [1.5, Y0], [X1, -19.2], [X1, -15.0], [X0, -15.0]]
mansard(corner, CORN, PAV + 0.4, 1.3)
mansard([[X0, -3.2], [X1, -3.2], [X1, 4.6], [X0, 4.6]], CORN, PAV, 1.3)
mansard([[X0, 17.0], [X1, 17.0], [X1, Y1], [X0, Y1]], CORN, PAV - 0.4, 1.3)

// Chimneys on the ridge.
for (const y of [-9.5, 11.0, 14.5]) box(brick, -1.6, -0.4, y - 0.6, y + 0.6, TOP - 0.5, TOP + 1.8, slate, 0.15)

// Stone quoins at the corners and either side of the pavilions.
const quoin = (x0: number, x1: number, y0: number, y1: number) => box(trim, x0, x1, y0, y1, 0.0, EAVE + 0.1, null, 0)
quoin(X1 - 0.5, X1 + 0.12, -19.0, -18.2)
quoin(X1 - 0.5, X1 + 0.12, -3.2, -2.4)
quoin(X1 - 0.5, X1 + 0.12, 3.8, 4.6)
quoin(X1 - 0.5, X1 + 0.12, 17.0, 17.8)
quoin(X1 - 0.5, X1 + 0.12, Y1 - 0.8, Y1 + 0.02)
quoin(X0 - 0.12, X0 + 0.7, Y0 - 0.12, Y0 + 0.5)
quoin(0.7, 1.4, Y0 - 0.12, Y0 + 0.5)

// ── Openings ──
// A face's windows: shopfronts below; a second storey of tall windows
// under pale hoods; a third storey of round-headed windows in pale
// surrounds (the HABS view), at the given positions along the face.
function face(a: XY, b: XY, at: number[], shop: boolean, w = 1.3) {
  for (const s of at) {
    rectOn(trim, a, b, s - w / 2 - 0.3, s + w / 2 + 0.3, MID - 0.8, MID - 0.3, 0.1) // hood
    rectOn(win, a, b, s - w / 2, s + w / 2, SHOP + 0.9, MID - 0.9, 0.08)
    rectOn(trim, a, b, s - w / 2 - 0.25, s + w / 2 + 0.25, MID + 0.4, EAVE - 0.3, 0.04)
    archOn(win, a, b, s - w / 2, s + w / 2, MID + 0.6, EAVE - 0.5, 0.08)
    if (shop) rectOn(win, a, b, s - w / 2 - 0.5, s + w / 2 + 0.5, 0.6, SHOP - 0.7)
    else rectOn(win, a, b, s - w / 2, s + w / 2, 1.2, SHOP - 1.0)
  }
}
// Hampton front, (6.3,-19.2) → (6.3,23.5): sixteen bays.
const hA: XY = [X1, -19.2], hB: XY = [X1, Y1]
const hamp = [2.4, 5.0, 7.6, 10.2, 12.8, 14.9, 18.0, 19.9, 21.8, 25.4, 27.6, 29.8, 32.0, 34.2, 38.6, 40.6]
face(hA, hB, hamp, true)
// The corner pavilion's Main Street face: two bays; the cut corner: the
// jeweller's door below a large window.
face([X0, Y0], [1.5, Y0], [1.6, 4.5], true)
const cA: XY = [1.5, Y0], cB: XY = [X1, -19.2]
rectOn(trim, cA, cB, 1.6, 5.2, SHOP + 0.7, MID - 0.3, 0.04)
rectOn(win, cA, cB, 1.9, 4.9, SHOP + 0.9, MID - 0.6, 0.08)
gable(trim, cA, cB, 1.5, 5.3, MID - 0.3, 0.8, 0.2, 0.15)
rectOn(trim, cA, cB, 1.9, 4.9, MID + 0.4, EAVE - 0.3, 0.04)
archOn(win, cA, cB, 2.2, 4.6, MID + 0.6, EAVE - 0.5, 0.08)
rectOn(door, cA, cB, 2.2, 4.6, 0, 3.6, 0.08)
rectOn(win, cA, cB, 2.2, 4.6, 3.8, SHOP - 0.5, 0.08)
// Back walls: plain upper windows only.
face([X1, Y1], [X0, Y1], [2.5, 5.5, 8.5], false)
// The long back wall (unphotographed): a sparse row of plain windows, estimated.
face([X0, Y1], [X0, Y0], [4, 10, 16, 22, 28, 34, 40], false)

// Dormers: small pale gabled dormers with arched lights on the mansard.
function dormer(a: XY, b: XY, s: number, z0: number, big = false) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L
  const w = big ? 2.0 : 1.6, h = big ? 3.0 : 2.4, back = 1.6
  const p = (u: number, v: number): XY => [a[0] + tx * u + ty * v, a[1] + ty * u - tx * v]
  const q = [p(s - w / 2, -0.4), p(s + w / 2, -0.4), p(s + w / 2, -0.4 - back), p(s - w / 2, -0.4 - back)]
  const xs = q.map((v) => v[0]), ys = q.map((v) => v[1])
  box(trim, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), z0, z0 + h, null, 0)
  const fa = p(0, -0.4), fb = p(L, -0.4)
  gable(trim, fa, fb, s - w / 2 - 0.15, s + w / 2 + 0.15, z0 + h, 0.9, back, 0.05)
  archOn(win, fa, fb, s - w / 2 + 0.3, s + w / 2 - 0.3, z0 + 0.3, z0 + h - 0.3, 0.06)
}
for (const s of [7.6, 12.8, 27.6, 32.0]) dormer(hA, hB, s, CORN)
dormer(hA, hB, 19.9, CORN, true)
dormer(hA, hB, 39.6, CORN, true)
dormer([X0, Y0], [1.5, Y0], 3.1, CORN, true)
dormer(cA, cB, 3.4, CORN, true)

await save('cola-sylvan-building', 'Sylvan Building', [
  { part: brick, material: finish('sylvan-brick', 0xc98a76) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: slate, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
], { height: PAV + 0.4, anchor: [34.005594, -81.035022], bearing: 70 })
