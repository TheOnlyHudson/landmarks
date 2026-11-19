/**
 * St. Alphonsus Church, 2025 Constance Street, Irish Channel, New Orleans
 * (1855-57; Louis L. Long, Renaissance Revival, built by the Redemptorists
 * for the Irish parish; now the St. Alphonsus Art & Cultural Center) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nola-st-alphonsus.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 323.2: model +y runs up the nave
 * from the Constance Street front (model −y, facing compass 143°) to the
 * sanctuary. Anchor: the area centroid of OSM way/328647184.
 *
 * Identity, in order: the two square brick towers that were never given
 * their spires, each in four stages under bold cream cornices and ending
 * flat; the big round-arched window between them flanked by statue niches,
 * under a small arched aedicule and cross; the white stuccoed three-arched
 * portico with its balustrade across the foot of the front, the stuccoed
 * ground storey of the towers; the long brick nave and its grey gable roof.
 *
 * Evidence
 * - OSM way/328647184 (building=yes, height=24 from Microsoft footprints).
 *   It runs 5.6 m further toward the street than the lidar's front (the
 *   lidar shows only 5 m trees there) and sits ~0.9 m off to model +x; the
 *   rear end agrees. The model follows the lidar, which matches the
 *   photos' sidewalk-front towers.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid in the model frame; ground 0.6 over the grid minimum = z 0.
 *   Towers x ±(4.5..12.9), y −22.6..−14, their flat tops 28.0; the
 *   aedicule between them 24.7 (crosses ~28); the portico 9.2, to y −23.5;
 *   nave x ±11.3, eaves 16.2, ridge 21.8, to y 20; the sanctuary x ±5.5 to
 *   y 25.5 at 16.5; low sacristies either side of it at 6.5. A 4.5 m bump
 *   over the north tower's middle (to 32.5) is not in any photo and is left
 *   out (equipment or a later structure).
 * - Photos (Wikimedia Commons, all evidence): "St. Alphonsus Church 01..04
 *   .JPG", Nolabob, CC BY-SA 3.0 — the front and the towers from the south
 *   and below (every stage line, opening, cornice and colour)
 *   https://commons.wikimedia.org/wiki/File:St._Alphonsus_Church_01.JPG
 *   https://commons.wikimedia.org/wiki/File:St._Alphonsus_Church_02.JPG
 *   https://commons.wikimedia.org/wiki/File:St._Alphonsus_Church_03.JPG
 *   https://commons.wikimedia.org/wiki/File:St._Alphonsus_Church_04.JPG
 *   The Infrogmation "Saint Alphonsus Church New Orleans 17 December 2016"
 *   set (CC BY-SA 4.0) is all interior: the nave's tall lower windows and
 *   round upper lights are taken from it.
 * - Published: Wikipedia, "St. Alphonsus Church (New Orleans)": 1855-57,
 *   Louis L. Long; the towers' planned spires were never built.
 *
 * Measured (lidar): every height above and the plan. Estimated from the
 * photos against the lidar tower tops: the stage lines (ground storey to
 * 9.5, the window stage to 17.0, the entablature to 18.6, the panelled
 * stage to 21.6, the belfry to 27.3, the top cornice), the windows (tower
 * stage 2: 1.7 m to 16.0; belfry 1.6 m, 22.8-26.6; centre 3.2 m to 17.2),
 * the niches, the portico's arches (2.3 m to 7.0) and balustrade. The nave
 * sides and rear have no exterior photo: their windows follow the interior
 * photos (seven bays) and are estimated; they are kept plain.
 *
 * Doubts: no licensed photo of the long sides, the rear or the roof; the
 * colours of the ground-storey stucco come from one sunlit photo.
 *
 * Night: windows glow, the front is softly floodlit.
 */
import { type V3 } from './mesh'
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism } from './nyc-570-lexington'
import { block, band } from './nyc-city-hall'
import { slabY, arch, rect, rectRing, barCross, gableRoof, type Side } from './nola-st-patricks-church'

const brick = new Part(), cream = new Part(), stucco = new Part(), roof = new Part(), win = new Part(), dark = new Part()

const YF = -22.6, YT = -14.0, NX = 11.3, YN = 20.0, YS = 25.5
const T0 = 4.5, T1 = 12.9                 // tower inner and outer x
const EAVE = 16.2, RIDGE = 21.8
const G = 9.5, S2 = 17.0, E2 = 18.6, S3 = 21.6, S4 = 27.3, TOP = 28.0

// ---------------------------------------------------------------------------
// Nave, sanctuary, sacristies
// ---------------------------------------------------------------------------

prism({ wall: brick, win: null, roof: null, ring: rectRing(-NX, YT, NX, YN), z0: 0, z1: EAVE, facade: null, bevel: 0.15 })
gableRoof(roof, 0, NX, YT, YN + 0.3, EAVE + 0.2, RIDGE, 0.35)
slabY(brick, [[-NX, EAVE], [NX, EAVE], [0, RIDGE]], YN - 0.4, YN)
for (const s of [-1, 1]) {
  block(cream, s < 0 ? -NX - 0.4 : NX - 0.1, YT, s < 0 ? -NX + 0.1 : NX + 0.4, YN, EAVE - 0.7, EAVE)
  block(stucco, s < 0 ? -NX - 0.15 : NX - 0.3, YT, s < 0 ? -NX + 0.3 : NX + 0.15, YN, 0, 1.2)
  const side: Side = s < 0 ? 'west' : 'east'
  for (let i = 0; i <= 7; i++) {
    const y = YT + 0.6 + (i * (YN - YT - 1.2)) / 7
    block(brick, s < 0 ? -NX - 0.35 : NX, y - 0.45, s < 0 ? -NX : NX + 0.35, y + 0.45, 0, EAVE - 0.7)
  }
  for (let i = 0; i < 7; i++) {
    const y = YT + 0.6 + ((i + 0.5) * (YN - YT - 1.2)) / 7
    arch(cream, side, s * NX, y, 2.0, 2.9, 10.3, 0.05)
    arch(win, side, s * NX, y, 1.6, 3.2, 10.0, 0.1)
    arch(win, side, s * NX, y, 1.3, 11.8, 14.4, 0.05)
  }
}
prism({ wall: brick, win: null, roof: roof, ring: rectRing(-5.5, YN - 0.5, 5.5, YS), z0: 0, z1: 16.5, facade: null, bevel: 0.15 })
band(cream, rectRing(-5.5, YN - 0.5, 5.5, YS), 15.8, 16.5, 0.25)
for (const s of [-1, 1]) {
  const xa = Math.min(s * 5.5, s * 12.8), xb = Math.max(s * 5.5, s * 12.8)
  prism({ wall: brick, win: null, roof: roof, ring: rectRing(xa, YN - 0.3, xb, YS - 0.5), z0: 0, z1: 6.5, facade: null, bevel: 0.12 })
}

// ---------------------------------------------------------------------------
// The towers
// ---------------------------------------------------------------------------

for (const s of [-1, 1]) {
  const xa = s < 0 ? -T1 : T0, xb = s < 0 ? -T0 : T1, xc = s * (T0 + T1) / 2
  const ring = rectRing(xa, YF, xb, YT)
  // the lower body (stucco ground storey, the brick window stage) stands 0.4 m proud of the upper stages
  const lo = rectRing(xa - (s < 0 ? 0.4 : 0), YF - 0.4, xb + (s > 0 ? 0.4 : 0), YT)
  prism({ wall: stucco, win: null, roof: null, ring: lo, z0: 0, z1: G, facade: null, bevel: 0.15 })
  prism({ wall: brick, win: null, roof: null, ring: lo, z0: G, z1: E2, facade: null, bevel: 0.15 })
  prism({ wall: brick, win: null, roof: null, ring, z0: E2, z1: S4, facade: null, bevel: 0.15 })
  // corner pilasters (proud strips) on the window stage and the belfry
  const pil = (r: [number, number][], z0: number, z1: number) => {
    const [x0, y0] = r[0], [x1, y1] = r[2]
    for (const [px, py] of [[x0, y0], [x1, y0]] as [number, number][]) {
      const dx = px === x0 ? 1 : -1
      block(brick, Math.min(px, px + dx * 1.1), y0 - 0.35, Math.max(px, px + dx * 1.1), y0 + 0.5, z0, z1)   // front face
      block(brick, dx > 0 ? px - 0.35 : px - 0.5, y0 + 0.4, dx > 0 ? px + 0.5 : px + 0.35, y0 + 1.5, z0, z1) // side face
      void y1
    }
  }
  pil(lo, G + 0.15, S2)
  pil(ring, S3 + 0.15, S4)
  // cornices: the ground storey's dentil band, the big entablature, the attic and the top
  band(cream, lo, G - 0.5, G + 0.15, 0.4)
  band(cream, lo, S2, E2, 0.75)
  band(cream, ring, S3 - 0.35, S3 + 0.15, 0.45)
  band(cream, ring, S4, TOP, 0.7)
  // flat roof inside a low parapet
  block(roof, xa + 0.3, YF + 0.3, xb - 0.3, YT - 0.3, TOP - 0.3, TOP - 0.2)
  // openings on the front and the outer side
  const faces: [Side, number, number, number][] = [['front', YF, xc, -0.4], [s < 0 ? 'west' : 'east', s < 0 ? xa : xb, (YF + YT) / 2 - 0.2, s * 0.4]]
  for (const [side, c0, t, off] of faces) {
    const c = c0 + off  // lower body face
    const cu = c0       // upper stages' face
    // ground storey: an arched door (front) or arched window (side)
    if (side === 'front') {
      arch(cream, side, c, t, 2.8, 0, 6.6, 0.08)
      arch(dark, side, c, t, 2.0, 0, 6.0, 0.14)
    } else {
      arch(cream, side, c, t, 2.4, 1.6, 6.8, 0.08)
      arch(stucco, side, c, t, 1.8, 1.8, 6.4, 0.14)
    }
    // stage 2: a tall arched window in a brick surround
    arch(cream, side, c, t, 2.3, 10.4, 16.4, 0.06)
    arch(win, side, c, t, 1.7, 10.7, 16.0, 0.12)
    // stage 3: a sunk panel
    rect(cream, side, cu, t, 3.4, 19.2, 21.0, 0.05)
    rect(brick, side, cu, t, 3.0, 19.4, 20.8, 0.09)
    // the belfry: a louvred round-arched opening
    arch(cream, side, cu, t, 2.2, 22.5, 27.0, 0.06)
    arch(dark, side, cu, t, 1.6, 22.8, 26.6, 0.12)
  }
}

// ---------------------------------------------------------------------------
// The centre of the front
// ---------------------------------------------------------------------------

{
  // the brick wall between the towers (the nave's front), its cornices continuing the towers'
  prism({ wall: brick, win: null, roof: null, ring: rectRing(-T0, YF + 0.6, T0, YT), z0: 0, z1: 21.6, facade: null, bevel: 0.05 })
  block(cream, -T0, YF + 0.1, T0, YF + 0.6, S2, E2)
  block(cream, -T0, YF + 0.2, T0, YF + 0.6, S3 - 0.35, S3 + 0.15)
  // the great round-arched window with its rose-traceried head, statue niches either side
  arch(cream, 'front', YF + 0.6, 0, 3.8, 10.8, 17.0, 0.06)
  arch(win, 'front', YF + 0.6, 0, 3.0, 11.1, 16.6, 0.12)
  rect(cream, 'front', YF + 0.48, 0, 0.18, 11.1, 15.0, 0.08)
  for (const s of [-1, 1]) {
    arch(cream, 'front', YF + 0.6, s * 3.0, 1.15, 11.6, 14.4, 0.05)
    arch(stucco, 'front', YF + 0.6, s * 3.0, 0.85, 11.8, 14.1, 0.1)
  }
  // the aedicule over it: pilastered, an arched pediment, a cross; the gable behind
  prism({ wall: brick, win: null, roof: null, ring: rectRing(-2.4, YF + 0.4, 2.4, YF + 2.0), z0: 21.0, z1: 23.6, facade: null, bevel: 0.05 })
  for (const s of [-1, 1]) block(cream, s * 2.2 - 0.3, YF + 0.25, s * 2.2 + 0.3, YF + 2.0, 21.0, 23.6)
  const ped: [number, number][] = [[-2.6, 23.55]]
  for (let k = 0; k <= 8; k++) { const t = (k / 8) * Math.PI; ped.push([-2.6 * Math.cos(t), 23.55 + 1.15 * Math.sin(t)]) }
  slabY(cream, ped, YF + 0.25, YF + 2.1, [0, 23.9])
  arch(stucco, 'front', YF + 0.4, 0, 0.9, 21.4, 23.1, 0.08)
  barCross(cream, 0, YF + 1.2, 24.6, 3.2, 1.8, 0.3)
  slabY(brick, [[-T0, 21.0], [T0, 21.0], [0, RIDGE]], YT - 0.4, YT)

  // the white portico: three arches on piers, an entablature and a balustrade, the statue aedicule
  const PY0 = -23.6, PY1 = YF + 0.6, PH = 7.6
  for (const x of [-4.2, -1.35, 1.35, 4.2]) block(cream, x - 0.35, PY0, x + 0.35, PY1, 0, PH)
  block(cream, -4.6, PY0 - 0.15, 4.6, PY1, PH, PH + 0.6)
  block(cream, -4.6, PY0 - 0.1, 4.6, PY0 + 0.3, PH + 0.6, PH + 1.5)
  block(cream, -4.7, PY0 - 0.2, 4.7, PY0 + 0.4, PH + 1.5, PH + 1.75)
  block(roof, -4.4, PY0 + 0.3, 4.4, PY1, PH + 0.5, PH + 0.6)
  // arch heads between the piers (a solid spandrel with the arch cut as a dark panel behind)
  for (const x of [-2.775, 0, 2.775]) {
    const pts: [number, number][] = [[x - 1.05, PH], [x - 1.05, 5.3]]
    for (let k = 0; k <= 8; k++) { const t = Math.PI - (k / 8) * Math.PI; pts.push([x + 1.05 * Math.cos(t), 5.3 + 1.05 * Math.sin(t)]) }
    pts.push([x + 1.05, PH])
    slabY(cream, pts, PY0, PY0 + 0.5, [x, PH - 0.2])
    arch(dark, 'front', YF + 0.6, x, 1.9, 0, 6.2, 0.06)
  }
  // the statue aedicule over the middle arch
  block(cream, -0.75, PY0 - 0.1, 0.75, PY0 + 0.5, PH + 1.5, PH + 3.3)
  const ap: [number, number][] = [[-0.85, PH + 3.25]]
  for (let k = 0; k <= 6; k++) { const t = (k / 6) * Math.PI; ap.push([-0.85 * Math.cos(t), PH + 3.25 + 0.6 * Math.sin(t)]) }
  slabY(cream, ap, PY0 - 0.15, PY0 + 0.55, [0, PH + 3.4])
  // steps
  block(stucco, -4.6, -24.4, 4.6, PY0, 0, 0.45)
}

// ---------------------------------------------------------------------------
// Finish
// ---------------------------------------------------------------------------

const lit = (p: V3, n: V3): number => {
  const up = n[2] > 0.7 ? 0.3 : 1
  if (p[1] < YT + 0.2 && n[1] < -0.3) return up
  if (p[1] < YT) return 0.6 * up
  return 0.05 * up
}
finishModel('St. Alphonsus Church', 'nola-st-alphonsus', [
  { part: brick, material: { ...finish('sal-brick', 0xc29275), floodlight: lit } },
  { part: cream, material: { ...finish('sal-cream', 0xf1eadc), floodlight: lit } },
  { part: stucco, material: { ...finish('sal-stucco', 0xe2c8b2), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('sal-dark', 0x74443c) },
], { bearing: 323.2, osm: 'way/328647184', height: 28.6 }, 6500)
