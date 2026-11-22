/**
 * McKissick Museum, University of South Carolina, Columbia — procedural,
 * CC0-1.0, no textures.
 * bun generators/cola-mckissick-museum.ts
 *
 * Built in 1940 as the McKissick Memorial Library (Lafaye & Lafaye), a
 * stripped Classical limestone building closing the head of the Horseshoe;
 * a museum since 1976. Its identity: the six-column Ionic portico in antis
 * on a broad stair, the attic block over it with the university seal held
 * by two figures, the stepped attic above, and the low pale dome.
 *
 * Map frame: x east, y north, z up, metres. Anchor: the area centroid of
 * OSM way/329014211 (lng -81.0268837, lat 33.9987448). Its walls run
 * 160° / 70°, the same as the Horseshoe's, so it is placed at bearing 340
 * and built square: model -x is the front, facing down the Horseshoe (true
 * bearing 250), model +y is true bearing 340.
 *
 * Replaces: way/329014211 (OSM has no parts).
 *
 * Ground: the site falls about 2 m from the front (west) to the light
 * courts at the back. The map puts y = 0 on the lowest ground under the
 * footprint, the back courts; the front's ground, FG, is 2.1 m above it
 * (map terrain, Mapterhorn z15, 3.3 against 1.2; lidar ground 97.6 against
 * 95.5). Walls run down to z = 0. Elevation 0.
 *
 * Evidence
 * - OSM way/329014211 (measured): the comb-shaped plan, read in the model
 *   frame — the long main range x -10.7..0.2, y -27.7..37; the end
 *   pavilions reaching forward to x -18.4 / -19.2 and back to x 8.3; the
 *   centre block with the portico zone forward to x -13.3 between
 *   y -3.7 and 11.7; the back spine to x 9.4; the two light courts behind.
 * - USGS 3DEP lidar, SC_SavannahPeeDee_5_2019 (2019 flight), 0.5 m grid,
 *   heights above the front ground (measured): main range 14.2; end
 *   pavilions and back spine 11.1; portico entablature 12.0; centre block
 *   parapet 16.6 (roof inside 15.0); the stepped attic 19.4 over
 *   x -12..1, y -3..10; dome rising from radius ~5 at ~21 to its crown at
 *   23.9, centred on (-5.3, 3.6).
 * - Photos (Wikimedia Commons), all of the west front:
 *   "McKissick Museum, USC, Columbia, West view 20160702 1.jpg" (DXR,
 *   CC BY-SA 4.0)
 *   https://commons.wikimedia.org/wiki/File:McKissick_Museum,_USC,_Columbia,_West_view_20160702_1.jpg
 *   "McKissick Museum.jpg" (ProfReader, CC BY-SA 4.0)
 *   https://commons.wikimedia.org/wiki/File:McKissick_Museum.jpg
 *   "McKissick Memorial Library (McKissick Museum), Horseshoe, University of
 *   South Carolina, Sumter Street, Columbia, SC.jpg" (w_lemay, CC BY-SA 2.0)
 *   https://commons.wikimedia.org/wiki/File:McKissick_Memorial_Library_(McKissick_Museum),_Horseshoe,_University_of_South_Carolina,_Sumter_Street,_Columbia,_SC_-_53398425249.jpg
 *   — six Ionic columns between square end piers, the lettered entablature,
 *   the seal and figures on the attic, a lunette in the drum, the low dome;
 *   three window rows and a small attic row on the main range; a broad
 *   stair with cheek blocks. Colours: buff limestone, a paler dome, slate
 *   window glass.
 * - Estimated: column height and spacing (from the photos, scaled to the
 *   lidar entablature); the stair (7 risers to 1.2 m); the window rows; the
 *   back and the courts (no photo), drawn plain with the same window bays.
 * - Simplified: the seal group as a medallion slab between two blocky
 *   figures; Ionic capitals as a flared cap under an abacus; the lettering
 *   is left out.
 *
 * Night: the portico and the attic are floodlit; windows glow; the doors
 * are `entrance`.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, cylinder, panel, rect } from './dc-white-house'
import { lathe, saveModel } from './dc-nga-west'
import { archWindow, block, door, newKit, windowBays } from './cola-usc-horseshoe'

const FG = 2.1 // the front ground above the back courts
const ROWS: [number, number][] = [[1.4, 4.2], [5.4, 7.8], [9.0, 11.0], [12.3, 13.3]]
const PAV: [number, number][] = [[1.4, 4.2], [5.4, 7.8], [8.6, 10.0]]

function build() {
  const k = newKit()
  const dome = new Part()

  // ---- The main range, its two end pavilions and the back spine.
  block(k, rect(-10.7, 0.2, -27.7, 36.0), FG, 14.2, { rows: ROWS, faces: ['w', 'e'], frames: ['w'], pitch: 3.2,
    skip: (s, c) => (s === 'w' && (c > -4.4 && c < 12.4)) || c < -18.6 || c > 26.0 })
  for (const r of [rect(-18.4, 8.3, -27.7, -18.4), rect(-19.2, 8.0, 26.3, 35.3)]) {
    block(k, r, FG, 11.1, { rows: PAV, faces: ['w', 'n', 's', 'e'], frames: ['w'], pitch: 3.2,
      skip: (s, c) => (s === 'n' || s === 's') && c > -11 && c < 0.5 })
  }
  block(k, rect(0.2, 9.4, -3.8, 12.4), FG, 11.1, { rows: PAV, faces: ['e', 'n', 's'], pitch: 3.2 })
  // the court-side faces of the main range behind
  for (const [y0, y1] of [[-18.4, -3.8], [12.4, 26.3]]) windowBays(k.win, 'e', 0.2, y0 + 0.6, y1 - 0.6, ROWS.slice(0, 3), FG, 3.2, 1.1)

  // ---- The centre block behind the portico, the stepped attic, drum and dome.
  // (behind the portico the wall stands back at the main range's face; the
  // attic over the entablature comes forward to the portico's front)
  block(k, rect(-10.7, 2.6, -3.7, 11.7), FG, 16.6, { faces: [], cornice: 0.6 })
  const att = rect(-12.9, -10.6, -3.7, 11.7)
  cbox(k.wall, att, FG + 11.9, FG + 16.0, { bottom: true, top: false })
  cbox(k.trim, { x0: att.x0 - 0.25, x1: att.x1, y0: att.y0 - 0.25, y1: att.y1 + 0.25 }, FG + 16.0, FG + 16.6, { b: 0.15, bottom: true, top: k.roof })
  // the stepped attic, standing on the centre block's roof
  const sa = rect(-12.0, 1.4, -3.0, 10.2)
  cbox(k.wall, sa, FG + 16.4, FG + 18.95, { top: false })
  cbox(k.trim, { x0: sa.x0 - 0.2, x1: sa.x1 + 0.2, y0: sa.y0 - 0.2, y1: sa.y1 + 0.2 }, FG + 18.95, FG + 19.4, { b: 0.12, bottom: true, top: k.roof })
  const cx = -5.3, cy = 3.6
  lathe(k.trim, cx, cy, [[5.3, FG + 19.4], [5.3, FG + 20.6], [5.6, FG + 20.75], [5.6, FG + 21.0], [5.0, FG + 21.0]], 20, false)
  const R = 7.2, base = 5.0, zc = FG + 21.0 - Math.sqrt(R * R - base * base)
  const prof: [number, number][] = []
  for (let i = 0; i <= 6; i++) {
    const t0 = Math.asin(base / R), t = t0 * (1 - i / 6)
    prof.push([R * Math.sin(t), zc + R * Math.cos(t)])
  }
  lathe(dome, cx, cy, prof, 20, false)
  // the lunette over the front of the drum, a half-round window
  archWindow(k.win, undefined, 'w', cx - 5.3, cy, 2.6, FG + 19.5, FG + 20.75, 6)

  // ---- The portico: platform and stair, six Ionic columns between square
  // end piers, the lettered entablature, the seal group on the attic.
  const PX = -13.3, x0 = -10.7
  cbox(k.trim, rect(PX - 0.2, x0, -3.9, 11.9), 0, FG + 1.2, { b: 0.06 })
  for (let i = 0; i < 7; i++) {
    const h = FG + 1.2 - (i + 1) * (1.2 / 8)
    cbox(k.trim, rect(PX - 0.2 - (i + 1) * 0.42, PX - 0.2 - i * 0.42, -2.6, 10.6), 0, h, { top: true })
  }
  for (const y of [-3.9, 10.6]) cbox(k.trim, rect(PX - 0.2 - 7 * 0.42, PX - 0.2, y, y + 1.3), 0, FG + 1.7, { b: 0.1 })
  const COLS = Array.from({ length: 6 }, (_, i) => -2.9 + (13.8 * (i + 1)) / 7)
  for (const y of COLS) ionic(k.trim, -12.5, y, 0.46, FG + 1.2, FG + 10.8)
  for (const y of [-3.7, 10.9]) cbox(k.trim, rect(PX, x0, y, y + 0.8), FG + 1.2, FG + 10.8)
  cbox(k.trim, rect(PX - 0.1, x0, -3.8, 11.8), FG + 10.8, FG + 11.6, { bottom: true, top: false })
  cbox(k.trim, rect(PX - 0.35, x0, -4.0, 12.0), FG + 11.6, FG + 12.0, { b: 0.15, bottom: true, top: k.roof })
  // windows and doors on the wall behind the columns
  for (const y of COLS.slice(0, 5).map((c) => c + 13.8 / 14)) {
    const mid = Math.abs(y - 4.0) < 2.5
    if (!mid) for (const [z0, z1] of PAV) panel(k.win, 'w', x0, y - 0.6, y + 0.6, FG + z0, FG + z1, 0.05)
    else for (const [z0, z1] of PAV.slice(1)) panel(k.win, 'w', x0, y - 0.6, y + 0.6, FG + z0, FG + z1, 0.05)
  }
  for (const y of [2.03, 4.0, 5.97]) door(k, 'w', x0, y, FG, 1.5, 2.9, 1.2)
  // the seal: a raised oval-topped medallion and two seated figures
  archWindow(k.trim, undefined, 'w', -12.9, cy, 2.4, FG + 12.0, FG + 15.6, 8)
  cbox(k.trim, rect(-13.5, -12.9, cy - 1.0, cy + 1.0), FG + 12.0, FG + 14.8, { b: 0.2 })
  for (const s of [-1, 1]) {
    cbox(k.trim, rect(-13.4, -12.9, cy + s * 1.9 - 0.45, cy + s * 1.9 + 0.45), FG + 12.0, FG + 14.4, { b: 0.15 })
    lathe(k.trim, -13.15, cy + s * 1.9, [[0.3, FG + 14.4], [0.32, FG + 14.7], [0.2, FG + 15.0], [0, FG + 15.05]], 8, false)
  }

  const lit = (p: V3, n: V3) => (p[0] < -10.5 && n[0] < -0.5 ? 0.9 : p[2] > FG + 16 && n[2] < 0.7 ? 0.6 : 0)
  return [
    { part: k.wall, material: { ...LIMESTONE, floodlight: lit } },
    { part: k.trim, material: { ...TRIM, floodlight: lit } },
    { part: k.roof, material: PALETTE.roof },
    { part: dome, material: { ...DOME, floodlight: lit } },
    { part: k.win, material: PALETTE.window },
    { part: k.door, material: PALETTE.entrance },
  ]
}

/** An Ionic column: base, tapering shaft, a flared cap under a square abacus. */
function ionic(p: Part, x: number, y: number, r: number, z0: number, z1: number) {
  cbox(p, rect(x - r * 1.3, x + r * 1.3, y - r * 1.3, y + r * 1.3), z0, z0 + 0.35, { b: 0.06 })
  cylinder(p, x, y, r, z0 + 0.35, z1 - 0.6, 12, r * 0.88)
  cylinder(p, x, y, r * 0.88, z1 - 0.6, z1 - 0.25, 12, r * 1.3)
  cbox(p, rect(x - r * 1.35, x + r * 1.35, y - r * 1.35, y + r * 1.35), z1 - 0.25, z1, { bottom: true })
}

/** Buff Indiana-type limestone, from the photos, pulled to the palette. */
const LIMESTONE = finish('mckissick-limestone', 0xe4d8bf)
/** The portico, cornices and frames: the same stone in fuller light. */
const TRIM = finish('mckissick-trim', 0xf0e7d6)
/** The low dome, a paler grey-buff. */
const DOME = finish('mckissick-dome', 0xd9d4c8)

if (import.meta.main) {
  await saveModel('cola-mckissick-museum', 'McKissick Museum', build(), { source: 'generators/cola-mckissick-museum.ts' })
}
