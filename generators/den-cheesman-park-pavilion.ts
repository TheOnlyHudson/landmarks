/**
 * Cheesman Memorial Pavilion, Cheesman Park, Denver (1909–1910, Marean &
 * Norton; neoclassical, Colorado Yule marble) — original procedural
 * geometry, CC0-1.0.
 * bun generators/den-cheesman-park-pavilion.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0 (the long axis runs
 * north–south). Origin on the ground at the anchor, the area centroid of
 * OSM way/129773326 (-104.9651417, 39.7322566).
 *
 * Identity, in order (photos below):
 *  1. a long, open colonnade of white marble Ionic columns, under a plain
 *     entablature and a solid attic, with a flat roof.        (h72, h73, old)
 *  2. a slightly wider pavilion at each end, its corners closed by heavy
 *     square piers, columns between them on every face.        (h72, old)
 *  3. it stands on a low podium at the top of terraced steps and gardens
 *     (the terraces are ground, not modelled).                  (old, h72)
 *
 * Plan: OSM way/129773326 (14.6 m wide at the ends, 11.1 m in the middle,
 * 34.5 m long), made symmetric.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid. y = 0
 * is 1638.7 m, the ground beside the podium (level within 0.3 m round it).
 * Measured: the flat roof 7.4–7.5; the attic's edge 8.1–8.3. USGS NAIP
 * shows the roof white; it is drawn pale. The floor and ceiling inside the
 * colonnade are a shaded tone so the columns read against them.
 * Estimated from the photos: the podium 0.8 high; columns 5.3 m tall,
 * 0.66 m across; the entablature 6.1–7.5; the attic 7.5–8.3 standing at the
 * edge; eight columns a side in the middle (h72 shows eight between the end
 * pavilions); two a side and four across each end pavilion; corner piers
 * 1.5 m square.
 * Left out: the column flutes and volutes, the balustrades, the terraces,
 * steps, fountains and pool.
 *
 * Photos (Wikimedia Commons, evidence):
 *  h72   "The 1908 pavilion in Denver, Colorado's, Cheesman Park
 *        LCCN2015633572.tif", Carol M. Highsmith, public domain (the long
 *        side, square on, from the gardens)
 *  h73   "The 1908 pavilion in Denver, Colorado's, Cheesman Park
 *        LCCN2015633573.tif", Carol M. Highsmith, public domain (from an
 *        angle, past the fountain)
 *  old   "Cheesman Memorial Pavilion.jpg", unknown author, public domain
 *        (early photo: the long side and one end, terraces)
 *  knapp "Cheesman Park Pavilion, Denver Colorado.jpg", Keith Knapp,
 *        CC BY-SA 3.0 (at dusk: the colonnade floodlit)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: which long side the photos show is not certain (the two are
 * alike); the end pavilions' column count is from the old photo only.
 *
 * Night: floodlit, the columns and the inner faces brightest (knapp).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, ccw, cornice, offset, prism, save, split, wall, type XY } from './atl-tech-tower'
import { at, ledge } from './atl-flatiron-building'
import { freeColumn } from './den-city-and-county-building'

const marble = new Part(), shade = new Part(), roof = new Part()

const XE = 7.25, XM = 5.55, YI = 10.1, YE = 17.24
const plan: XY[] = ccw([[-XE, -YE], [XE, -YE], [XE, -YI], [XM, -YI], [XM, YI], [XE, YI], [XE, YE], [-XE, YE], [-XE, YI], [-XM, YI], [-XM, -YI], [-XE, -YI]])
const POD = 0.8, ENT = 6.1, TOP = 7.5, ATTIC = 8.3

// the podium, split so its long faces follow the ground
prism(marble, split(offset(plan, 0.6), 4.5), 0, POD, marble, 0.08)
// the entablature: soffit, architrave line, cornice, the flat roof, the attic
prism(marble, plan, ENT, TOP, null, 0)
// flat caps as three rectangles (the cross-shaped ring defeats ear clipping)
const rects: [number, number, number, number][] = [[-XM, XM, -YI, YI], [-XE, XE, YI, YE], [-XE, XE, -YE, -YI]]
function caps(p: Part, z: number, up: boolean, inset = 0) {
  for (const [x0, x1, y0, y1] of rects) {
    const a: V3 = [x0 + inset, y0 + (y0 === -YE ? inset : 0), z], b: V3 = [x1 - inset, y0 + (y0 === -YE ? inset : 0), z], c: V3 = [x1 - inset, y1 - (y1 === YE ? inset : 0), z], d: V3 = [x0 + inset, y1 - (y1 === YE ? inset : 0), z]
    if (up) p.quad(a, b, c, d); else p.quad(a, d, c, b)
  }
}
caps(shade, ENT, false)
// the shaded floor inside the colonnade, which the columns stand against
caps(shade, POD + 0.02, true, 0.35)
cornice(marble, plan, ENT + 0.55, 0.2, 0.08, null)
cornice(marble, plan, TOP - 0.35, 0.35, 0.28, null)
{
  const inner = offset(plan, -0.45)
  wall(marble, plan, TOP, ATTIC)
  wall(marble, [...inner].reverse(), TOP, ATTIC)
  ledge(marble, plan, inner, ATTIC, true)
  caps(roof, TOP, true)
}

// corner piers of the end pavilions
for (const sy of [-1, 1]) for (const sx of [-1, 1]) {
  for (const [cx, cy] of [[sx * (XE - 0.75), sy * (YE - 0.75)], [sx * (XE - 0.75), sy * (YI + 0.75)]] as XY[]) {
    box(marble, cx - 0.75, cx + 0.75, cy - 0.75, cy + 0.75, POD, ENT, null, 0)
    box(marble, cx - 0.85, cx + 0.85, cy - 0.85, cy + 0.85, POD, POD + 0.35, null, 0.05)
    box(marble, cx - 0.85, cx + 0.85, cy - 0.85, cy + 0.85, ENT - 0.3, ENT, null, 0.05)
  }
}
// columns
const R = 0.33
const cols: XY[] = []
for (let i = 0; i < 8; i++) {
  const y = -8.7 + (i * 17.4) / 7
  cols.push([-(XM - 0.55), y], [XM - 0.55, y])
}
for (const sy of [-1, 1]) {
  for (const y of [12.8, 14.6]) cols.push([-(XE - 0.6), sy * y], [XE - 0.6, sy * y])
  for (const x of [-3.6, -1.2, 1.2, 3.6]) cols.push([x, sy * (YE - 0.6)])
}
for (const c of cols) freeColumn(marble, c, R, POD, ENT, 12, 1.3)

const lit = (p: V3, n: V3) => (n[2] > 0.9 ? 0.15 : p[2] < ENT + 0.01 ? 0.95 : 0.6)
await save('den-cheesman-park-pavilion', 'Cheesman Park Pavilion', [
  { part: marble, material: { ...finish('cheesman-marble', 0xede8de), floodlight: lit } },
  { part: shade, material: { ...finish('cheesman-shade', 0xb3ab9f), floodlight: () => 0.8 } },
  { part: roof, material: finish('cheesman-roof', 0xdcd9d3) },
], { height: ATTIC, anchor: [39.7322566, -104.9651417], bearing: 0 })
void at
