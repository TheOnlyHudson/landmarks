/**
 * Babcock Building, Columbia, South Carolina: the main building of the
 * former South Carolina State Hospital (Lunatic Asylum) on Bull Street,
 * built 1857–1885 to designs begun by George E. Walker; long red-brick
 * wings in steps either side of a central pavilion with a two-storey
 * Classical portico and pediment, crowned by the tall cupola with its red
 * bell-shaped dome. Restored as apartments in the 2020s.
 *
 * Frame: turned to the building's spine, bearing 339° (+y runs NNW along
 * the wings, +x ENE; the portico faces -x, towards 249°). Origin at the OSM
 * outline's centroid.
 *
 * Sources
 * - OSM way/273765090 (building=apartments, building:levels=4,
 *   roof:shape=gabled): the outline, rectilinear in this frame, drawn here
 *   as ten rectangles (wings, cross blocks, end pavilions, centre).
 * - USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019), 1 m grid (metres over
 *   the lowest ground under the footprint, y = 0, which is 1.5 m under the
 *   ground at the centre): wing ridges 15.8–16.3 m; the cross blocks and
 *   end pavilions 18.3–20.4 m; the central pavilion 23.5 m; the dome's top
 *   about 40 m and the finial's tip 42.7 m, at (-16.3, -6.1).
 * - USGS NAIP orthophoto (public domain): red roofs over the central
 *   pavilion and the east cross block, pale grey standing-seam roofs on the
 *   wings, the portico's place on the west front.
 * - Photos (EVIDENCE):
 *   - Jerrye & Roy Klotz MD, "BABCOCK BUILDING.jpg", CC BY-SA 3.0: the
 *     west front, portico of six columns over a raised ground floor,
 *     pediment, red brick with pale trim, the cupola's base.
 *     https://commons.wikimedia.org/wiki/File:BABCOCK_BUILDING.jpg
 *   - Thomas Kirchel, "Babcock Building Dome, Columbia, SC.jpg", CC BY-SA
 *     4.0: the cupola: red flared base, white drum with tall round-headed
 *     windows, red bell dome, spike finial.
 *     https://commons.wikimedia.org/wiki/File:Babcock_Building_Dome,_Columbia,_SC.jpg
 *   - "Columbia - Babcock Building.jpg", postcard (F. M. Kirby & Co., public
 *     domain): the front axis with portico and cupola.
 *     https://commons.wikimedia.org/wiki/File:Columbia_-_Babcock_Building.jpg
 *
 * Numbers
 * - Measured: plan (OSM), roof and cupola heights (lidar).
 * - Estimated: eaves 3–4 m under each ridge (photos), window rows and bay
 *   pitch (3.4 m), the cupola's stage heights (photo, scaled to the lidar
 *   top), the portico's columns (0.45 m radius, 9 m tall, photo).
 * - Doubts: the rear (east) faces and the far wings are not photographed
 *   here; their windows repeat the front's rhythm.
 *
 * Night: windows glow; the portico's doors are `entrance`.
 */
import { Part } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, cylinder, gable, grow, panel, qf, rect, type Rect } from './dc-white-house'
import { lathe, saveModel } from './dc-nga-west'
import { block, newKit, type Kit } from './cola-usc-horseshoe'

const BRICK = finish('babcock-brick', 0xb86c57)
const ROOF = finish('babcock-roof', 0xb8bbbc)
const RED = finish('babcock-red', 0xb4524a)

const ROWS3: [number, number][] = [[2.3, 4.8], [5.8, 8.3], [9.3, 11.6]]
const ROWS4: [number, number][] = [...ROWS3, [12.6, 14.6]]

function build() {
  const k = newKit(), red = new Part()
  const kr: Kit = { ...k, roof: red }

  // [rect, ground, eave, ridge, ridge runs north–south?, red roof?] — absolute heights over y = 0
  const B: [Rect, number, number, number, boolean, boolean][] = [
    [rect(-22.4, -8.0, 7.0, 38.0), 2.2, 12.8, 16.0, true, false], // north wing
    [rect(-24.6, 32.4, 38.0, 51.0), 2.0, 16.0, 19.8, false, false], // north cross block
    [rect(-9.0, 9.4, 51.0, 83.0), 1.0, 16.4, 20.4, true, false], // north wing, outer
    [rect(-17.9, 21.4, 83.0, 98.0), 0.3, 16.0, 20.0, false, false], // north end pavilion
    [rect(-23.7, -9.0, -48.3, -14.0), 2.5, 12.8, 16.2, true, false], // south wing
    [rect(-25.9, 6.8, -64.5, -48.3), 2.5, 16.0, 19.6, false, false], // south cross block
    [rect(-10.4, 3.9, -91.8, -64.5), 2.2, 12.8, 16.2, true, false], // south wing, outer
    [rect(-20.1, 19.7, -107.4, -91.8), 2.3, 15.0, 18.8, false, false], // south end pavilion
    [rect(-8.0, 30.0, -14.0, 3.0), 2.3, 17.5, 21.5, false, true], // the east cross block behind the centre
    [rect(30.0, 64.6, -13.8, 1.2), 2.5, 9.0, 13.5, false, true], // its lower east end
  ]
  for (const [r, g, eave, ridge, ns, isRed] of B) {
    block(isRed ? kr : k, r, g, eave - g, { roof: ns ? 'gable-ns' : 'gable-ew', ridge: ridge - g, rows: eave - g > 14 ? ROWS4 : ROWS3, pitch: 3.4, ww: 1.3, cornice: 0.5, overhang: 0.35 })
  }

  // ---- The central pavilion: brick to 20 m under a red hipped roof, the cupola on top.
  const C = rect(-44.2, -8.0, -12.5, 6.9)
  block(kr, C, 2.3, 17.7, { roof: 'gable-ew', ridge: 21.4, rows: ROWS4, pitch: 3.4, ww: 1.2, frames: ['n', 's', 'w'], cornice: 0.6, overhang: 0.4, faces: ['n', 's'] })
  // the west front: pediment over the portico's bay
  const front = rect(-45.3, -42.0, -10.0, -2.0)
  cbox(k.wall, front, 0, 19.4, { top: k.roof })
  cbox(k.trim, grow(front, 0.3), 19.4, 20.0, { b: 0.15, bottom: true, top: false })
  // the pediment: the central pavilion's own gable end over the front, with a pale raking cornice
  gable(k.trim, k.trim, rect(-44.9, -43.9, -13.1, 7.5), 19.7, 24.0, false, [false, false])
  for (const [z0, z1] of ROWS4.slice(2)) for (const y of [-8.2, -6.0, -3.8]) panel(k.win, 'w', -45.3, y - 0.6, y + 0.6, 2.3 + z0, 2.3 + z1, 0.05)
  panel(k.trim, 'w', -45.3, -7.6, -4.4, 17.6, 19.6, 0.05) // the name panel under the pediment
  // the portico: six columns on a raised floor, entablature with a flat roof
  const por = rect(-50.0, -45.3, -12.2, 0.2)
  cbox(k.trim, por, 0, 3.0, { b: 0.1 })
  for (let i = 0; i < 6; i++) cylinder(k.trim, -49.2, -11.4 + (i * 10.8) / 5, 0.5, 3.0, 12.4, 10, 0.44)
  cbox(k.trim, grow(por, 0.2), 12.4, 13.6, { b: 0.2, bottom: true, top: k.roof })
  panel(k.door, 'w', -45.3, -7.0, -4.8, 3.0, 6.6, 0.06)
  for (const y of [-9.2, -2.6]) panel(k.win, 'w', -45.3, y - 0.6, y + 0.6, 4.0, 6.8, 0.05)

  // ---- The cupola (lidar: dome top about 40 m, finial 42.7 m).
  const cx = -16.3, cy = -6.1
  cbox(k.wall, rect(cx - 3.6, cx + 3.6, cy - 3.6, cy + 3.6), 18.0, 25.8, { top: false })
  cbox(k.trim, rect(cx - 3.9, cx + 3.9, cy - 3.9, cy + 3.9), 25.8, 26.4, { b: 0.15, bottom: true, top: true })
  lathe(red, cx, cy, [[3.6, 26.4], [3.4, 27.0], [3.0, 28.0]], 16, true) // the red flared skirt
  cylinder(k.trim, cx, cy, 3.0, 28.0, 32.6, 16)
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + Math.PI / 8
    const px = cx + 3.06 * Math.cos(a), py = cy + 3.06 * Math.sin(a)
    // tall round-headed lights, drawn as narrow upright panels facing out
    const w = 0.5, nx = Math.cos(a), ny = Math.sin(a)
    const tx = -ny * w, ty = nx * w
    qf(k.win, [px - tx, py - ty, 28.6], [px + tx, py + ty, 28.6], [px + tx, py + ty, 31.9], [px - tx, py - ty, 31.9], [nx, ny, 0])
  }
  lathe(k.trim, cx, cy, [[3.4, 32.6], [3.4, 33.1]], 16, true)
  lathe(red, cx, cy, [[3.3, 33.1], [3.3, 34.0], [3.1, 35.6], [2.6, 37.2], [1.8, 38.6], [0.9, 39.6], [0.3, 40.1]], 16, false)
  cylinder(k.trim, cx, cy, 0.3, 40.1, 41.0, 6)
  cylinder(red, cx, cy, 0.14, 41.0, 42.7, 4, 0.02)

  return [
    { part: k.wall, material: BRICK },
    { part: k.trim, material: PALETTE.trim },
    { part: k.roof, material: ROOF },
    { part: red, material: RED },
    { part: k.win, material: PALETTE.window },
    { part: k.door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  await saveModel('cola-babcock-building', 'Babcock Building', build(), { source: 'generators/cola-babcock-building.ts' }, 6500)
}
