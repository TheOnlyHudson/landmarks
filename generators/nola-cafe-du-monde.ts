/**
 * Café du Monde, 800 Decatur Street, New Orleans — procedural, CC0-1.0.
 * bun generators/nola-cafe-du-monde.ts
 *
 * Identity: the open-air café at the upriver end of the French Market's
 * Butcher's Market hall (1813, rebuilt in the 1930s): its terrace under the
 * green-and-white striped awning with the green sign band, on white posts,
 * against the hall's closed end pavilion and its hipped grey-brown roof;
 * the colonnade and the first cupola; striped awnings between the
 * river-side columns where the café's seating runs along the hall.
 *
 * Built with the hall kit exported from nola-french-market.ts (merge that
 * generator first). The café and the French Market share one OSM building
 * (way/329364505, and the "Shops of The Colonnade" relation/7064857): this
 * model draws the hall from its upriver end (C-frame y −6.9) to y 15.5
 * (the end pavilion, five colonnade bays and the first cupola, which is
 * where the café's river-side awnings stop in the NAIP image) plus the
 * terrace; nola-french-market draws the rest, and each closes the cut with
 * a section, so neither draws over the other. Both list the shared OSM
 * ids. Placement note: at minzoom 16 the café's end of the hall is missing
 * at zoom 15 (the French Market hides the shared building from 15); giving
 * this model minzoom 15 too avoids that gap.
 *
 * Frame: the French Market's C-frame (origin the Café du Monde node
 * -90.06185 29.95756, bearing 38.1): +y downriver along Decatur, +x toward
 * the river. Anchor: the centroid of the café's share (C 4.0, 1.5).
 *
 * Evidence
 * - OSM: way/329364505 (its upriver end: the terrace x −2.0..11.6,
 *   y −14.65..−6.9; the end pavilion; the Decatur-side notch), node/
 *   3362351943 (Café du Monde).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (2021-22): ground 3.0 (abs), eave 4.5,
 *   ridge 9.6, the hip end steep (6.6 a metre in), the canopy one slope from
 *   ~4.6 at the wall to 3.2 at the edge, the cupola top 12.3 at y ~11.
 * - NAIP orthophoto: the green canopy at the end and the green awnings
 *   along the river side for ~23 m.
 * - Photos (Wikimedia Commons):
 *   - "CafeDuMonde-FacingEastfromDacatur.JPG", Jeremykemp, CC BY-SA 3.0:
 *     Decatur at St. Ann, the end pavilion's arch, the striped canopy side,
 *     the cupola
 *     https://commons.wikimedia.org/wiki/File:CafeDuMonde-FacingEastfromDacatur.JPG
 *   - "New Orleans, LA (French Quarter) - Cafe du Monde Feb 2011.jpg",
 *     JasonParis, CC BY 2.0: the terrace, posts, sign band, the hip end
 *     https://commons.wikimedia.org/wiki/File:New_Orleans,_LA_(French_Quarter)_-_Cafe_du_Monde_Feb_2011.jpg
 *   - "Café du Monde, New Orleans French Market.jpg", Spatms, CC BY-SA 4.0:
 *     the end face on, four bays, the curtains closed
 *     https://commons.wikimedia.org/wiki/File:Caf%C3%A9_du_Monde,_New_Orleans_French_Market.jpg
 *   - "Cafe du Monde in New Orleans.JPG", MusikAnimal, CC BY-SA 4.0: the
 *     terrace from the Decatur corner
 *     https://commons.wikimedia.org/wiki/File:Cafe_du_Monde_in_New_Orleans.JPG
 *   - "N Peters Street French Market New Orleans Feb 2020 01.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: the river side, the striped
 *     awnings at the café end
 *     https://commons.wikimedia.org/wiki/File:N_Peters_Street_French_Market_New_Orleans_Feb_2020_01.jpg
 *
 * Measured: heights and plan as above. Estimated from the photos: the
 * canopy's hipped sides (2 m run), the sign band (2.5 to 3.3), the posts
 * (five across the end, one mid-side), the stripe width (~0.9 m, about three
 * real stripes each, so they hold at phone size), the river-side awnings,
 * the arch openings. Left out: the lettering on the sign band ("CAFE DU
 * MONDE • ORIGINAL FRENCH MARKET COFFEE STAND"; at 0.5 m it does not read at
 * map size), the bulb lights, tables, the roll-down curtains (drawn open).
 *
 * Doubts: whether the canopy's front is striped or plain green metal (the
 * photos differ by year; the brief and most photos read it as striped); the
 * split with the French Market at y 15.5 is a drawing choice, not a wall.
 *
 * Night: the arched windows glow (`window`).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, type XY } from './nyc-570-lexington'
import { block } from './nyc-city-hall'
import { quadN, triN } from './nola-cabildo'
import { butchersHall, columnYs, cToLonLat, shift, H, STUCCO, SHINGLE, TEAL, C_BEARING, type HallParts } from './nola-french-market'

/** The café's share of the hall ends here; the French Market model draws the rest. */
const YS = 15.5

type CafeParts = HallParts & { awning: Part }

/** Green-and-white stripes on a sloped quad a-b (low edge) d-c (high edge), stripes running a→d. */
function stripes(P: CafeParts, a: V3, b: V3, c: V3, d: V3, n: number, startGreen = true) {
  const L = (p: V3, q: V3, t: number): V3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n
    const part = (i % 2 === 0) === startGreen ? P.awning : P.trim
    quadN(part, L(a, b, t0), L(a, b, t1), L(d, c, t1), L(d, c, t0), [0, 0, 1])
    quadN(part, L(a, b, t0), L(d, c, t0), L(d, c, t1), L(a, b, t1), [0, 0, -1])
  }
}

function build() {
  const P: CafeParts = { stucco: new Part(), trim: new Part(), roof: new Part(), win: new Part(), green: new Part(), awning: new Part() }
  butchersHall(P, H.Y0, YS, 0)

  // ---- the terrace under its striped awning (OSM: x −2.0..11.6, y −14.65..−6.9)
  const tx0 = -2.0, tx1 = 11.6, ty0 = -14.65, ty1 = H.Y0
  // lidar: the canopy is one slope, ~4.6 near the wall falling to 3.2 at the
  // edge, level across; photos: plain green metal on top, the striped
  // canvas on its two sides (tall at the wall, nothing at the front), and
  // the green sign band (valance) under it on all three open sides.
  const zTop = 4.4, zLow = 3.3, vz0 = 2.5
  // a hipped canopy: a shallow plain-green front slope and steep striped sides
  const run = 2.0
  const hip = (y: number) => run * (y - ty0) / (ty1 - ty0) // the hip line's inset at y
  {
    // the front slope in green and white stripes running down the slope
    const n = 15, x0 = tx0 + run, x1 = tx1 - run
    for (let i = 0; i < n; i++) {
      const u0 = i / n, u1 = (i + 1) / n
      const part = i % 2 === 0 ? P.awning : P.trim
      const lo0: V3 = [tx0 + (tx1 - tx0) * u0, ty0, zLow], lo1: V3 = [tx0 + (tx1 - tx0) * u1, ty0, zLow]
      const hi0: V3 = [x0 + (x1 - x0) * u0, ty1, zTop], hi1: V3 = [x0 + (x1 - x0) * u1, ty1, zTop]
      quadN(part, lo0, lo1, hi1, hi0, [0, 0, 1])
      quadN(part, lo0, hi0, hi1, lo1, [0, 0, -1])
    }
  }
  for (const [x, sx] of [[tx0, 1], [tx1, -1]] as [number, number][]) {
    const n = 9
    for (let i = 0; i < n; i++) {
      const y0 = ty0 + ((ty1 - ty0) * i) / n, y1 = ty0 + ((ty1 - ty0) * (i + 1)) / n
      const part = i % 2 === 0 ? P.trim : P.awning
      const a0: V3 = [x, y0, zLow], a1: V3 = [x, y1, zLow]
      const b0: V3 = [x + sx * hip(y0), y0, zLow + (zTop - zLow) * (y0 - ty0) / (ty1 - ty0)]
      const b1: V3 = [x + sx * hip(y1), y1, zLow + (zTop - zLow) * (y1 - ty0) / (ty1 - ty0)]
      quadN(part, a0, a1, b1, b0, [-sx, 0, 1])
      quadN(part, a0, b0, b1, a1, [sx, 0, -1])
    }
  }
  // the valance (sign band) and its white bulb line
  block(P.awning, tx0 - 0.08, ty0 - 0.08, tx1 + 0.08, ty0 + 0.08, vz0, zLow)
  block(P.awning, tx0 - 0.08, ty0, tx0 + 0.08, ty1, vz0, zLow)
  block(P.awning, tx1 - 0.08, ty0, tx1 + 0.08, ty1, vz0, zLow)
  block(P.trim, tx0 - 0.11, ty0 - 0.11, tx1 + 0.11, ty0 - 0.02, vz0 + 0.05, vz0 + 0.17)
  block(P.trim, tx0 - 0.11, ty0, tx0 - 0.02, ty1, vz0 + 0.05, vz0 + 0.17)
  block(P.trim, tx1 + 0.02, ty0, tx1 + 0.11, ty1, vz0 + 0.05, vz0 + 0.17)
  // white posts: five across the end, one between on each side
  for (const x of [tx0, tx0 + (tx1 - tx0) * 0.25, tx0 + (tx1 - tx0) * 0.5, tx0 + (tx1 - tx0) * 0.75, tx1]) block(P.trim, x - 0.08, ty0 - 0.0, x + 0.08, ty0 + 0.16, 0, vz0)
  for (const x of [tx0, tx1]) block(P.trim, x - 0.08, (ty0 + ty1) / 2 - 0.08, x + 0.08, (ty0 + ty1) / 2 + 0.08, 0, vz0)
  // the low iron railing round the tables, as a dark band
  for (const [x0, y0, x1, y1] of [[tx0 + 0.1, ty0 + 0.1, tx1 - 0.1, ty0 + 0.16], [tx0 + 0.1, ty0 + 0.1, tx0 + 0.16, ty1], [tx1 - 0.16, ty0 + 0.1, tx1 - 0.1, ty1]]) block(P.roof, x0, y0, x1, y1, 0.0, 0.95)

  // ---- striped awnings between the river-side columns (café seating) and over the Decatur arch
  const ys = columnYs()
  for (let k = 0; k < ys.length - 1; k++) {
    const y0 = ys[k] + 0.4, y1 = ys[k + 1] - 0.4
    if (y1 > YS - 0.2) break
    const xin = H.X1 - 0.75, xout = H.X1 + 0.35
    stripes(P, [xout, y0, 2.55], [xout, y1, 2.55], [xin, y1, 3.55], [xin, y0, 3.55], 6)
    block(P.awning, xout - 0.05, y0, xout + 0.05, y1, 2.25, 2.6)
  }
  {
    const ym = (H.Y0 + H.YP0) / 2, w = 1.5, x = H.XC0
    stripes(P, [x - 0.9, ym - w, 2.6], [x - 0.9, ym + w, 2.6], [x, ym + w, 3.5], [x, ym - w, 3.5], 5)
  }

  const AX = 4.0, AY = 1.5
  shift(Object.values(P), AX, AY)
  console.log('anchor', cToLonLat(AX, AY))
  finishModel('Café du Monde', 'nola-cafe-du-monde', [
    { part: P.stucco, material: STUCCO },
    { part: P.trim, material: PALETTE.trim },
    { part: P.roof, material: SHINGLE },
    { part: P.win, material: PALETTE.window },
    { part: P.green, material: TEAL },
    { part: P.awning, material: finish('cafe-awning-green', 0x2f7a5a) },
  ], { bearing: C_BEARING, osm: 'way/329364505' }, 5000)
}

if (import.meta.main) build()
