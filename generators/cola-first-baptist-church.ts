/**
 * First Baptist Church, 1306 Hampton Street, Columbia, SC: the 1859 Greek
 * Revival sanctuary (brick temple front with a four-column portico) where
 * the Secession Convention first met in December 1860: procedural, CC0-1.0.
 * bun generators/cola-first-baptist-church.ts [out.glb]
 *
 * Uses the shared church helpers in cola-trinity-cathedral.ts.
 *
 * Identity: the amenity node/13362907003 (wikidata Q5452371) stands for the
 * whole church campus. The 1859 building is OSM way/1455848743 (building=
 * chapel, gabled, tagged "Boyce Chapel"): the only gabled temple-fronted
 * outline facing Hampton Street, 17.3 × 41 m, with the "First Baptist
 * Church" and "Ordinance of Secession" markers on the sidewalk in front of
 * it. The modern sanctuary with the tall white steeple (way/1455848744,
 * east of it) is a different building and is not modelled.
 *
 * Map frame: x toward 70°, y toward 340° (bearing 340, OSM edges at 70° /
 * 160°), z up, metres. Origin: the outline's centroid (-81.032690,
 * 34.005722). The portico faces +y (Hampton Street, north-north-west).
 *
 * Heights: USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019 flight), 1 m
 * grid, local ground 1.0 m above the crop minimum (measured): ridge 17.1,
 * eaves 13.2 (roof pitch ~24°, the same over the portico). The roof runs
 * to the front edge (lidar), so the portico is under the main pediment.
 * Facade from HABS photo h1 (frontal), scaled to the 17.3 m width and to
 * the lidar eaves (estimated): column capitals 11.9, entablature
 * 11.9–13.2; columns ~1.1 m across at x ±2.9 and ±7.6 (wider centre
 * intercolumniation, h1); portico back wall at y 15.9 (the OSM outline's
 * kink there), so the portico is 4.6 m deep; centre door 2.3 wide to 4.8,
 * side doors arched to 4.4, three round-headed upper windows 7.0–11.0.
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/cola/work/cola-first-baptist-church/photos):
 *  h1 "Historic American Buildings Survey, April, 1960 FRONT (NORTH)
 *     ELEVATION. - First Baptist Church, Hampton Street, ...", Jack Boucher
 *     (HABS), public domain,
 *     https://commons.wikimedia.org/wiki/File:Historic_American_Buildings_Survey,_April,_1960_FRONT_(NORTH)_ELEVATION._-_First_Baptist_Church,_Hampton_Street,_Columbia,_Richland_County,_SC_HABS_SC,40-COLUM,5-2.tif
 *  p1 "First Baptist Church Columbia, SC Front View.jpg", Thomas Kirchel,
 *     CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:First_Baptist_Church_Columbia,_SC_Front_View.jpg
 *     — the portico close up from the north-east: red brick columns with
 *     pale bases and capitals, white doors under fanlights, brick walls.
 *
 * Left out: capitals' volutes, the door surround's pediment, railings,
 * pilaster capitals. Doubts: the flanks and the rear are unphotographed in
 * licensed sources (a low link abuts the west side): six bays of round-headed upper
 * windows and arched lower ones, mirrored, are estimated. Roof colour grey
 * (unphotographed). Colours: brick 0xb47160 (h1/p1, pulled light); trim
 * white (palette); doors white (p1) as `entrance`.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, flatShape, extrudeShape, arc, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './nash-tennessee-state-capitol'
import { prismY, roofY } from './ral-holy-name-of-jesus-cathedral'

const X0 = -8.65, X1 = 8.65, HW = 8.65
const Y0 = -20.5, YP = 15.9, Y1 = 20.5 // rear, portico back wall, front
const EAVE = 13.2, RIDGE = 17.1, CAP = 11.9, BASE = 1.0

function roundHead(p: Part, f: Face, s: number, w: number, z0: number, z1: number, d = 0.06) {
  const r = w / 2
  flatShape(p, f, [[s - r, z0], [s + r, z0], ...arc(s, z1 - r, r, 0, 180, 8)], d)
}

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

  // ============================================================ the body, the roof, the pediments
  box(brick, X0, Y0, X1, YP, 0, EAVE, null)
  prismY(brick, Y0, Y0 + 0.4, [[X0, EAVE], [X1, EAVE], [0, RIDGE]])
  // cornice round the flanks and the rear
  box(trim, X0 - 0.25, Y0 - 0.25, X1 + 0.25, YP, EAVE - 0.6, EAVE, null)
  // the portico: stylobate, entablature, the pediment (white tympanum)
  box(trim, X0, YP, X1, Y1, 0, BASE)
  box(trim, X0 - 0.25, YP, X1 + 0.25, Y1 + 0.25, CAP, EAVE)
  prismY(trim, Y1 - 0.2, Y1 + 0.25, [[X0 - 0.25, EAVE], [X1 + 0.25, EAVE], [0, RIDGE + 0.15]])
  roofY(roof, Y0 - 0.3, Y1 - 0.2, 0, HW, EAVE + 0.05, RIDGE + 0.1, 0.35, 0.25)
  // the four brick columns with pale bases and capitals (h1, p1)
  for (const x of [-7.6, -2.9, 2.9, 7.6]) {
    const y = Y1 - 0.85
    box(trim, x - 0.7, y - 0.7, x + 0.7, y + 0.7, BASE, BASE + 0.5)
    lathe(brick, x, y, [[0.56, BASE + 0.5], [0.47, CAP - 0.55]], 12)
    lathe(trim, x, y, [[0.47, CAP - 0.55], [0.7, CAP - 0.15]], 12)
    box(trim, x - 0.75, y - 0.75, x + 0.75, y + 0.75, CAP - 0.15, CAP)
  }
  // pilasters at the portico's back corners
  for (const x of [X0 + 0.5, X1 - 0.5]) box(brick, x - 0.5, YP, x + 0.5, YP + 0.35, BASE, CAP)

  // ============================================================ the front wall behind the columns (h1)
  const f: Face = { o: [0, YP, 0], n: [0, 1] }
  extrudeShape(trim, f, [[-1.65, BASE], [1.65, BASE], [1.65, 5.4], [-1.65, 5.4]], 0, 0.15)
  flatShape(door, { o: [0, YP + 0.15, 0], n: [0, 1] }, [[-1.15, BASE], [1.15, BASE], [1.15, 4.8], [-1.15, 4.8]], 0.05)
  for (const s of [-4.9, 4.9]) {
    flatShape(door, f, [[s - 0.75, BASE], [s + 0.75, BASE], [s + 0.75, 3.4], [s - 0.75, 3.4]], 0.06)
    flatShape(win, f, arc(s, 3.45, 0.75, 0, 180, 8), 0.06)
  }
  for (const s of [-4.9, 0, 4.9]) roundHead(win, f, s, 1.7, 7.0, 11.0)

  // ============================================================ flanks: six bays, arched lower and round-headed upper windows
  const bay = (YP - Y0) / 6
  for (const [x, n] of [[X0, -1], [X1, 1]] as [number, number][]) {
    for (let k = 0; k < 6; k++) {
      const g: Face = { o: [x, Y0 + (k + 0.5) * bay, 0], n: [n, 0] }
      roundHead(win, g, 0, 1.4, 1.8, 4.8)
      roundHead(win, g, 0, 1.6, 6.8, 11.2)
    }
    for (let k = 1; k < 6; k++) { const y = Y0 + k * bay; box(brick, x + (n < 0 ? -0.3 : 0), y - 0.45, x + (n < 0 ? 0 : 0.3), y + 0.45, 0, EAVE - 0.6, null) }
  }
  // rear: two round-headed windows
  for (const s of [-3.5, 3.5]) roundHead(win, { o: [0, Y0, 0], n: [0, -1] }, s, 1.6, 6.8, 11.2)

  return finishGlb('First Baptist Church', [
    { part: brick, material: finish('fbc-cola-brick', 0xb47160) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 340, height: RIDGE + 0.25, replaces: ['way/1455848743'] }, 5000)
}

if (import.meta.main) await writeModel('cola-first-baptist-church', build())
