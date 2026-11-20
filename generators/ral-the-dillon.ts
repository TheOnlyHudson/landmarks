/**
 * The Dillon, Raleigh Warehouse District (2018, Kane Realty) — original
 * procedural geometry, CC0-1.0.
 * bun generators/ral-the-dillon.ts [out.glb]
 *
 * Uses the kit in ral-wells-fargo-capitol-center.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM relation/8554719 (outer way/47776724
 * less its two pedestrian inners), 35.777823, -78.645595. Bearing 2.5: the
 * block's west and east edges run 2.5° east of north; in that frame the
 * outline is the rectangle x −32.6…30.7, y −63.5…64.
 *
 * Identity (photos below): the OSM relation is the whole block, so the model
 * is the whole block. A 17-storey office tower over a parking base, long
 * east–west, whose upper office floors are blue glass banded every storey
 * by broad rust-red spandrels, with a thick rust band at the roof and at the
 * foot of the office floors; a dark-framed glass box projecting from the
 * south face's west half and another from the north face's east half; a
 * parking podium of grey and white checker panels in front of the south
 * face with a roof terrace at level 9 (OSM way/676665469, layer 2, level 9);
 * an open paved plaza in the south-west corner (OSM inner way/676665462).
 * North of a surface car park (OSM way/1178625430) stands the eight-storey
 * apartment block round a paved courtyard (OSM inner way/618948921), red
 * brick on its two lower storeys and pale panels above.
 *
 * Evidence:
 *  - plan: OSM relation/8554719, way/616807009 (building=parking, 8
 *    levels, the south half), the inners and the terrace above. Tower
 *    footprint x −32.4…30.5, y −45…−11 (upper floors to y −47…−8):
 *    estimated from USGS NAIP (roof 66 × 40 m, displaced ~17 m east and
 *    ~4 m north by the image's lean). Courtyard x −8.5…13.5, y 21.5…43.5
 *    from the OSM inner.
 *  - heights: tower 81 m published (266 ft, 17 floors; Wikipedia, List of
 *    tallest buildings in Raleigh, citing CTBUH). Parking base and podium
 *    30 m (8 levels, OSM; the level-9 terrace). Office floors 4.2 m from
 *    30 m: estimated from the rust bands counted in Thakerus's photo (about
 *    eleven above the podium). Glass boxes' extent: estimated from the same
 *    photo and Oakcitydylan's drone photo. Apartments 27 m (eight storeys,
 *    estimated from the drone photo and the NAIP lean ratio against the
 *    tower). No lidar covers Raleigh.
 *  - ground: Mapterhorn z13 rises ~3 m from the south-west to the north;
 *    y = 0 is the lowest ground (south), and each building's facade starts
 *    at its own ground (podium +0.7, tower +1.4, apartments +3.0 m).
 *    Elevation 0.
 *  - colours from the photos, pulled to the palette's lightness: sky-blue
 *    glass, rust spandrels and brick, pale grey panels.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - The Dillon building in Raleigh, NC.jpg, Thakerus, CC0
 *    https://commons.wikimedia.org/wiki/File:The_Dillon_building_in_Raleigh,_NC.jpg
 *    (south face: rust bands, projecting glass box, podium and terrace)
 *  - TheDillon 2018.jpg, Oakcitydylan, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:TheDillon_2018.jpg
 *    (drone at dusk from the north-east, under construction: east and north
 *    faces, north glass box, the overhang, the brick apartment block)
 * USGS NAIP for plan, roofs and lean. No look-only sources used for shape
 * (State Archives photos of the old Dillon Supply warehouse were not used).
 * No commercial imagery.
 *
 * Doubts: only two licensed photos, one at dusk under construction; the west
 * face is unphotographed (assumed like the east). The brief mentions a
 * rooftop sign; no licensed photo shows one, so none is modelled. Where the
 * restored Dillon Supply warehouse sits in the block is not clear from the
 * evidence; it is not modelled separately. 81 m over 17 floors does not
 * square with the band count; the published height is kept. The apartment
 * block's height is estimated.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, rect, ringFaces, curtain, coping, plate, cap, punched, write } from './ral-wells-fargo-capitol-center'

const glass = new Part(), rust = new Part(), panel = new Part(), dark = new Part(), roof = new Part(), frame = new Part()

const XW = -32.4, XE = 30.5
const TOP = 81, BASE = 30, FLOOR = 4.2

// ── The tower's parking base (0–30 m): grey panels, broad openings, shopfronts.
const GT = 1.4
const lower = rect(XW, -45, XE, -11)
for (const f of ringFaces(lower, 0, BASE)) {
  // glazed like the floors above (drone photo), slab lines in pale panel every two levels
  curtain(glass, panel, { ...f, z0: GT + 5.6 }, { floor: 3.3, every: 2, origin: GT + 5.6, band: 0.9, mullion: 8, mullionW: 0.6 })
  plate(panel, f, 0, f.len, 0, GT + 5.8, 0, 0)
  const n = Math.max(2, Math.round(f.len / 7))
  for (let k = 0; k < n; k++) plate(dark, f, (k * f.len) / n + 0.8, ((k + 1) * f.len) / n - 0.8, GT + 0.3, GT + 5, 0.06)
}

// ── The office floors (30–81 m): sky glass with a rust spandrel every storey.
const upper = rect(XW, -47, XE, -8)
for (const f of ringFaces(upper, BASE, TOP)) {
  curtain(glass, rust, f, { floor: FLOOR, every: 1, origin: BASE, band: 1.4 })
  plate(rust, f, 0, f.len, BASE, BASE + 1.8, 0.1) // the band at the foot of the office floors
  coping(rust, f, 2.2, 0.15, 0.3) // the thick roof band
}
// the underside where the office floors overhang the base
roof.quad([XW, -11, BASE], [XW, -8, BASE], [XE, -8, BASE], [XE, -11, BASE])
roof.quad([XW, -47, BASE], [XW, -45, BASE], [XE, -45, BASE], [XE, -47, BASE])
roof.quad([XW, -47, BASE], [XE, -47, BASE], [XE, -45, BASE], [XW, -45, BASE])
cap(roof, upper, TOP)
// the mechanical penthouse
{
  const pen = rect(-8, -36, 20, -20)
  for (const f of ringFaces(pen, TOP, TOP + 4)) {
    plate(panel, f, 0, f.len, TOP, TOP + 4, 0, 0)
    coping(panel, f, 0.6, 0.1, 0.25)
  }
  cap(roof, pen, TOP + 4)
}

/** A dark-framed glass box standing proud of a face, s0–s1 along it. */
function glassBox(f: Face, s0: number, s1: number, z0: number, z1: number, out = 1.8) {
  plate(frame, f, s0, s1, z0, z1, out, out)
  // big light glass with a few dark mullions and transoms, as in Thakerus's photo
  plate(glass, f, s0 + 0.7, s1 - 0.7, z0 + 1.1, z1 - 1.1, out + 0.05)
  const n = Math.round((s1 - s0) / 3.5)
  for (let k = 1; k < n; k++) {
    const s = s0 + ((s1 - s0) * k) / n
    plate(frame, f, s - 0.18, s + 0.18, z0 + 1.1, z1 - 1.1, out + 0.1)
  }
  for (let z = z0 + 1.1 + 2 * FLOOR; z < z1 - 2; z += 2 * FLOOR) plate(frame, f, s0 + 0.7, s1 - 0.7, z - 0.2, z + 0.2, out + 0.1)
}
const faces = ringFaces(upper, BASE, TOP)
const south = faces[0], north = faces[2]
glassBox(south, -22 - XW, 0 - XW, 42, 72) // south face, west half (Thakerus)
glassBox(north, XE - 24, XE - 6, 44, 73) // north face, east half (drone); north face runs east→west

// ── The south podium (0–30 m) with its level-9 roof terrace.
const GP = 0.7
const pod = rect(-17, -63.5, XE, -45)
for (const f of ringFaces(pod, 0, BASE)) {
  if (f.n[1] > 0.9) continue // hidden against the tower
  // checker of pale panels with dark openings, two levels to a band
  punched(panel, dark, f, { bay: 11, pier: 1.6, group: 6.6, spandrel: 2.8, origin: GP + 6, from: GP + 6.4, top: 1.4 })
  const n = Math.max(2, Math.round(f.len / 7))
  for (let k = 0; k < n; k++) plate(dark, f, (k * f.len) / n + 0.8, ((k + 1) * f.len) / n - 0.8, GP + 0.3, GP + 5, 0.06)
  coping(panel, f, 1.1, 0.15, 0.3)
}
cap(roof, pod, BASE)

// ── The apartment block (north), round its courtyard.
const GA = 3.0, AH = 27
const OUT: [number, number, number, number] = [XW, 10.8, XE, 63.9]
const CY: [number, number, number, number] = [-8.5, 21.5, 13.5, 43.5]
const outer = rect(...OUT), court = [...rect(...CY)].reverse() as XY[]
for (const ring of [outer, court]) {
  for (const f of ringFaces(ring, 0, AH)) {
    plate(rust, f, 0, f.len, 0, GA + 7.5, 0, 0) // brick base, two storeys
    const n = Math.max(1, Math.round(f.len / 4.5))
    for (let k = 0; k < n; k++) plate(dark, f, (k * f.len) / n + 0.9, ((k + 1) * f.len) / n - 0.9, GA + 0.4, GA + 6.4, 0.06)
    const up: Face = { ...f, z0: GA + 7.5 }
    punched(panel, dark, up, { bay: 4.5, pier: 1.5, group: 6.4, spandrel: 1.4, origin: GA + 7.5, top: 1.0 })
    coping(panel, f, 0.8, 0.15, 0.25)
  }
}
// roof as four strips round the courtyard
cap(roof, rect(OUT[0], OUT[1], OUT[2], CY[1]), AH)
cap(roof, rect(OUT[0], CY[3], OUT[2], OUT[3]), AH)
cap(roof, rect(OUT[0], CY[1], CY[0], CY[3]), AH)
cap(roof, rect(CY[2], CY[1], OUT[2], CY[3]), AH)

await write('ral-the-dillon', 'The Dillon', [
  { part: glass, material: windowVariant(2, 0x8eaac2) },
  { part: rust, material: finish('dillon-rust', 0xb4705a) },
  { part: panel, material: finish('dillon-panel', 0xdcdad5) },
  { part: dark, material: PALETTE.window },
  { part: frame, material: finish('dillon-frame', 0x5a5f66) },
  { part: roof, material: PALETTE.roof },
], { bearing: 2.5, elevation: 0, height: TOP + 4, replaces: ['relation/8554719', 'way/616807009'] })
