/**
 * Tennessee Supreme Court Building, Nashville (1937, Marr & Holman):
 * procedural, CC0-1.0.
 * bun generators/nash-tennessee-supreme-court.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 331.8: +y is
 * the long axis, +x the main front on 7th Avenue, facing the Capitol.
 * Origin: the centre of the building as the lidar shows it
 * (-86.7848463, 36.1649275). OSM way/112916694 (Q17059510; no heights)
 * is a rough 26 × 43.6 m trace sitting about 2 m west of the lidar
 * footprint: its east edge falls 2.8 m inside the front wall, though the
 * same lidar matched OSM to 0.15 m at the Capitol next door. The lidar
 * footprint is used: walls 28.0 × 42.0 m (cornice 28.8 × 42.6). The
 * anchor is 2.1 m east of the OSM centroid (-86.7848702, 36.1649273).
 * y = 0 is the lowest ground under the footprint, on the west (rear) side
 * (Mapterhorn 157.9 m; lidar 3.0 m above its ground_min of 154.88 m). The
 * front terrace and the top of the steps on 7th Avenue are 3.9–4.4 m higher,
 * so the granite base shows its full height only at the back and the ends.
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022, tools/lidar_frame.py at
 * bearing 331.8, above y = 0: cornice 18.4–19.2; attic parapet 22.0 over a
 * block 25 × 37.3 m, roof inside it 20.8; a small penthouse 8 × 4 m to 24.1
 * west of the centre; front terrace 3.9.
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/nash/work/nash-tennessee-supreme-court/photos, list in
 * urls.txt):
 *  s05/s09 frontal, s06/s07/s11 oblique fronts, s04 from the Capitol
 *  (front and north end, from above), s02/s03/s08 the 7th Avenue and
 *  Charlotte corner: "Tennessee Supreme Court Building, 7th Avenue and
 *  Charlotte Avenue, Nashville, TN" (Flickr), Warren LeMay, CC BY-SA 2.0;
 *  "Tennessee Supreme Court Nashville 2022.jpg", Antony-22, CC BY-SA 4.0;
 *  "Tennessee Supreme Court building Nashville TN 2013-07-20 001–004",
 *  Thomas R Machnitzki, CC BY 3.0; "Tennessee Supreme Court.jpg", Jon698,
 *  CC BY-SA 4.0; "TennSupreme1.jpg", Cdv1014, CC BY-SA 4.0.
 * From s05, scaled to the lidar cornice: a granite base to 1.0 m above the
 * entrance level (4.4); square piers to 15.9; a decorated frieze and the
 * cornice to 19.2; the attic to 22.0. Front: nine bays between eight piers
 * (3.6 m), solid end pavilions 4.8 m wide; in each bay a two-storey window
 * group (10.3–15.5) with a dark bronze spandrel (12.4–13.6), a roundel
 * (9.2) and a ground-floor window or (three middle bays) bronze doors.
 * North end (s04): five bays of the same window groups in a plain wall.
 *
 * Estimated: every height above (photo scaling, ±0.5 m), the piers'
 * projection (1.0 m), window sizes. Doubts: the south end and the rear
 * (west) side have no photo; they are drawn like the north end (plain
 * wall with five and nine window bays). Left out: the antefixes on the
 * cornice, the frieze's carving and lettering, lamps, the front steps and
 * terrace (outside the footprint; the map's terrain already shows them).
 * Night: no night photo; windows glow, the stone stays unlit.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, prism, rect, chamfer, flatShape, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel } from './nash-tennessee-state-capitol'

const HX = 14.0, HY = 21.0 // walls (lidar)
const ENTRY = 4.4 // the front entrance level
const BASE = 5.4, PIER = 15.9, FRIEZE = 18.1, CORN = 19.2, ATTIC = 22.0, ROOF = 20.8
const PAV = 4.8 // front end pavilions
const REC = 1.0 // the front wall behind the piers

function build() {
  const stone = new Part(), trim = new Part(), granite = new Part(), win = new Part(), bronze = new Part(), roof = new Part()

  // ---------------------------------------------------------- base, walls, piers
  prism(granite, null, chamfer(rect(-HX - 0.15, -HY - 0.15, HX + 0.15, HY + 0.15), 0.2), 0, BASE)
  // the body: full block except the recess behind the front piers
  prism(stone, null, rect(-HX, -HY, HX - REC, HY), BASE, PIER)
  for (const s of [-1, 1]) box(stone, HX - REC, s > 0 ? HY - PAV : -HY, HX, s > 0 ? HY : -HY + PAV, BASE, PIER, null)
  const bay = (2 * (HY - PAV)) / 9
  for (let k = 1; k <= 8; k++) {
    const y = -HY + PAV + bay * k
    box(trim, HX - REC, y - 0.75, HX, y + 0.75, BASE, PIER, null, 0.12)
  }
  // ---------------------------------------------------------- frieze, cornice, attic, roof
  prism(stone, null, rect(-HX, -HY, HX, HY), PIER, FRIEZE)
  capRing(stone, rect(HX - REC, -HY + PAV, HX, HY - PAV), PIER, false) // soffit over the recess
  prism(trim, null, rect(-HX - 0.1, -HY - 0.1, HX + 0.1, HY + 0.1), 16.9, 17.7) // the decorated band
  const corn = chamfer(rect(-HX - 0.4, -HY - 0.3, HX + 0.4, HY + 0.3), 0.25)
  prism(trim, roof, corn, FRIEZE, CORN)
  capRing(trim, corn, FRIEZE, false)
  const at = rect(-12.5, -18.8, 12.5, 18.8)
  prism(stone, null, at, CORN, ATTIC - 0.3)
  prism(trim, null, chamfer(rect(-12.6, -18.9, 12.6, 18.9), 0.12), ATTIC - 0.3, ATTIC)
  capRing(roof, rect(-12.3, -18.6, 12.3, 18.6), ROOF, true)
  // inner faces of the parapet down to the roof
  prism(trim, null, rect(-12.3, -18.6, 12.3, 18.6).reverse(), ROOF, ATTIC)
  box(roof, -7.9, 3.0, 0.1, 7.0, ROOF - 0.2, 24.1)

  // ---------------------------------------------------------- windows and doors
  /** A two-storey window group with its bronze spandrel. */
  const group = (f: Face, s: number, w: number) => {
    panel(win, f, s, w, 13.6, 15.5)
    panel(bronze, f, s, w, 12.4, 13.6)
    panel(win, f, s, w, 10.3, 12.4)
  }
  const roundel = (f: Face, s: number) => {
    const pts = Array.from({ length: 10 }, (_, i) => [s + 0.42 * Math.cos((i / 10) * 2 * Math.PI), 9.2 + 0.42 * Math.sin((i / 10) * 2 * Math.PI)] as [number, number])
    flatShape(bronze, f, pts, 0.06)
  }
  // front: nine bays in the recess
  const front: Face = { o: [HX - REC, 0, 0], n: [1, 0] }
  for (let k = 0; k < 9; k++) {
    const y = -HY + PAV + bay * (k + 0.5)
    group(front, y, 1.55)
    roundel(front, y)
    if (k >= 3 && k <= 5) panel(bronze, front, y, 1.7, ENTRY + 0.2, 8.0)
    else panel(win, front, y, 1.5, 5.7, 8.0)
  }
  // the ends: five bays each
  for (const s of [-1, 1]) {
    const f: Face = { o: [0, s * HY, 0], n: [0, s] }
    for (let k = 0; k < 5; k++) {
      const x = -9.6 + 4.8 * k
      group(f, x, 1.2)
      panel(win, f, x, 1.2, 6.2, 9.0)
      panel(win, f, x, 1.0, 1.4, 3.6, 0.2) // basement windows in the granite, where the ground drops
    }
  }
  // the rear: nine bays
  const rear: Face = { o: [-HX, 0, 0], n: [-1, 0] }
  for (let k = 0; k < 9; k++) {
    const y = -HY + PAV + bay * (k + 0.5)
    group(rear, y, 1.4)
    panel(win, rear, y, 1.4, 6.2, 9.0)
    panel(win, rear, y, 1.1, 1.4, 3.6, 0.2)
  }
  return finishGlb('Tennessee Supreme Court Building', [
    { part: stone, material: finish('tsc-marble', 0xebe3d9) },
    { part: trim, material: finish('tsc-marble-trim', 0xf5efe6) },
    { part: granite, material: finish('tsc-granite', 0xa9a7a3) },
    { part: win, material: PALETTE.window },
    { part: bronze, material: finish('tsc-bronze', 0x6f7c70) },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 331.8, height: 24.1, replaces: ['way/112916694'] })
}

if (import.meta.main) await writeModel('nash-tennessee-supreme-court', build())
