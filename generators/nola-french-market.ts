/**
 * The French Market, New Orleans — procedural, CC0-1.0, no textures.
 * bun generators/nola-french-market.ts
 *
 * What this model is: the market's colonnaded halls and its open shed, as
 * one model of three separate buildings on Decatur / N. Peters Street (they
 * are not contiguous: streets, the Red Stores, the Bazaar building and Dutch
 * Alley lie between them):
 *  1. the Butcher's Market (Halle des Boucheries, 1813, rebuilt by the WPA
 *     in the 1930s), OSM way/329364505, from the end of Café du Monde's
 *     share (C-frame y 15.5, see below) to Dumaine Street: the long hipped
 *     hall with Tuscan colonnades on Decatur and the river side, its closed
 *     end pavilion with three arched fanlight windows, and two of its three
 *     cupolas. Café du Monde (nola-cafe-du-monde.ts) draws the upriver end;
 *  2. the second hall, OSM way/329364588 (Dumaine to St. Philip, along Dutch
 *     Alley): a lower plain hipped hall with round-headed teal doors, bent
 *     where the street turns;
 *  3. the Farmers Market shed, OSM way/345253096: the long open steel shed
 *     with its raised monitor and the yellow "FRENCH MARKET" arch gateway at
 *     its upriver end. The Flea Market shed beyond it (way/480088580) is left
 *     to the map.
 * Left out: the Red Stores (way/478486747), the Dutch Alley Artists' Co-op
 * (way/329364487) and the Bazaar building (way/345253295), which are
 * separate buildings of other forms.
 *
 * Also the kit for nola-cafe-du-monde.ts (merge this generator first): the
 * hall is built by `butchersHall(parts, ya, yb, ground)` in the shared
 * "C-frame" (origin the Café du Monde node, bearing 38.1); each model draws
 * its own stretch of it and closes the cut with a section.
 *
 * Frame: bearing 38.1 (the hall's axis); model +y runs downriver along
 * Decatur (compass 38.1), +x toward the river (compass 128.1). Anchor: the
 * middle of the Butcher's Market's French-Market stretch (C-frame 3.6, 54.0).
 * The second hall and the shed are placed from their own OSM outlines.
 *
 * Evidence
 * - OSM: way/329364505 (the Butcher's Market, 99.3 x 19.2 m, with the 3 x
 *   4.5 m notches at the Decatur corners of both end pavilions), relation/
 *   7064857 ("Shops of The Colonnade", outer ways 329364505, 329364588 and
 *   480518814), way/329364588 (the second hall), way/345253096 (Farmers
 *   Market Pavilion, 103 x 17 m, its gateway as a 6.2 m bump on the end).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grids read in the C-frame. Butcher's Market: ground 3.0 (abs),
 *   eave 4.5, ridge 9.6 on x 3.6, cupola tops 12.3 at y ~11, 42, 73; over
 *   the end pavilions the roof follows the colonnade's slope (5.3 at x −4,
 *   6.3 at x −2), so their Decatur walls rise to meet it; hip ends steeper
 *   than the sides (~0.8). Second hall: ground 2.8, eave 4.7, ridge 7.5,
 *   12 m wide. Shed: ground 2.3 (the lowest, so z 0), roof 4.2, monitor 5.5,
 *   gateway 5.9.
 * - NAIP 2021-ish orthophoto (USGS): the long hip with three green-capped
 *   cupolas on the ridge; the shed's dark roof with its pale monitor.
 * - Photos (Wikimedia Commons):
 *   - "French Quarter, New Orleans, 5 July 2021 - 43.jpg", Infrogmation of
 *     New Orleans, CC BY-SA 4.0: Decatur at Dumaine looking upriver, the end
 *     pavilion, the colonnade and the cupolas
 *     https://commons.wikimedia.org/wiki/File:French_Quarter,_New_Orleans,_5_July_2021_-_43.jpg
 *   - "N Peters Street French Market New Orleans Feb 2020 01.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: the river-side colonnade
 *     https://commons.wikimedia.org/wiki/File:N_Peters_Street_French_Market_New_Orleans_Feb_2020_01.jpg
 *   - "Dumaine & Decatur Streets, French Quarter, July 2008 Phonecall.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 3.0: the Decatur colonnade's
 *     column count and the cupolas
 *     https://commons.wikimedia.org/wiki/File:Dumaine_%26_Decatur_Streets,_French_Quarter,_July_2008_Phonecall.jpg
 *   - "French Market arch New Orleans May 2009.jpg", Derek Bridges, CC BY 2.0:
 *     the shed's end and the gateway, face on
 *     https://commons.wikimedia.org/wiki/File:French_Market_arch_New_Orleans_May_2009.jpg
 *   - "French Market, New Orleans, USA1.jpg", Diego Delso, CC BY-SA 3.0: the
 *     gateway's attic, cornices and keystone
 *     https://commons.wikimedia.org/wiki/File:French_Market,_New_Orleans,_USA1.jpg
 *   - "City of New Orleans, The French Market, March 2015.jpg", Steve Knight,
 *     CC BY 2.0: the shed inside, its post rows and curved brackets
 *     https://commons.wikimedia.org/wiki/File:City_of_New_Orleans,_The_French_Market,_March_2015.jpg
 *   - "New Orleans Dutch Alley up from Red Stores Feb 2020.jpg", Infrogmation
 *     of New Orleans, CC BY-SA 4.0: the second hall's Dutch Alley side
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_Dutch_Alley_up_from_Red_Stores_Feb_2020.jpg
 * - Published: Wikipedia, "French Market": market on the site since 1791,
 *   oldest structures c. 1813, major WPA renovations in the 1930s.
 *
 * Measured (lidar): every height above, the hall's plan and the pavilions'
 * notches, the cupolas' positions. Estimated from the photos: the column
 * height (3.6 under a 0.9 m entablature), diameter (0.64) and pitch (24 per
 * side, ~3.9 m), the gallery depth (3 m) behind them, the shopfronts, the
 * end pavilion's three arches (3.2 m wide to 3.9), the cupolas' box, cornice
 * and flared cap, the second hall's door pitch (4.2 m), the shed's four
 * post rows and 6 m bays, the gateway (6.2 x 6.0, arch 3.2 wide to 3.75).
 * Invented: the shop door / window rhythm (every third bay a window).
 * Left out: the lettering on the gateway, the awnings in the colonnade
 * bays, lamps, the shed's stalls and fences.
 *
 * Doubts: the second hall has only one close photo (its Dutch Alley side);
 * its Decatur side is drawn like it. The river-side colonnade is assumed to
 * have the Decatur side's pitch. The model spans ~430 m in three pieces;
 * the ground falls 0.7 m from the hall to the shed, so the halls stand on
 * stylobates/walls carried down to z 0. The OSM link roof between the shed
 * and the Flea Market (way/480088581) is 11% under the shed's end and left
 * unlisted (a separate neighbour).
 *
 * Night: the shopfronts and fanlights glow (`window`); the shed's monitor
 * glazing glows faintly as `window` (the market is lit in the evening).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE, type Swatch } from './palette'
import { finishModel, type XY } from './nyc-570-lexington'
import { block, column, archPanel, rectPanel } from './nyc-city-hall'
import { quadN, triN, archWall, type Face } from './nola-cabildo'

// ===========================================================================
// The shared frame
// ===========================================================================
//
// Everything is authored in the "C-frame": origin at the Café du Monde node
// (OSM node/3362351943, -90.06185 29.95756), turned to bearing 38.1, the
// axis of the Butcher's Market hall (OSM way/329364505). +y runs downriver
// along Decatur Street (compass 38.1), +x toward the river (compass 128.1),
// so the Decatur front is the hall's −x side. Each model shifts the C-frame
// to its own anchor at the end (`shift`).

export const C_LON = -90.06185, C_LAT = 29.95756, C_BEARING = 38.1

/** Lon/lat of a C-frame point (for anchors). */
export function cToLonLat(x: number, y: number): [number, number] {
  const b = (C_BEARING * Math.PI) / 180
  const kx = 111320 * Math.cos((C_LAT * Math.PI) / 180), ky = 110540
  const E = x * Math.cos(b) + y * Math.sin(b), N = -x * Math.sin(b) + y * Math.cos(b)
  return [C_LON + E / kx, C_LAT + N / ky]
}

/** Move every part so the C-frame point (ax, ay) becomes the origin. */
export function shift(parts: Part[], ax: number, ay: number) {
  // Part stores glTF (x, z_up, -y_map).
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= ax; p.pos[i + 2] += ay }
}

// ===========================================================================
// Butcher's Market hall (Halle des Boucheries, WPA rebuild 1930s)
// ===========================================================================

/** Plan (C-frame), from OSM way/329364505 checked against the 2021 lidar. */
export const H = {
  X0: -6.0, // Decatur colonnade line
  X1: 13.2, // river colonnade line (and the pavilions' river face)
  XC0: -3.0, // Decatur core wall (and the pavilions' Decatur face)
  XC1: 10.2, // river core wall
  Y0: -6.9, // upriver end face (café end)
  YP0: -2.4, // upriver pavilion / colonnade join
  YP1: 87.5, // downriver pavilion / colonnade join
  Y1: 92.4, // downriver end face (Dumaine Street)
  EAVE: 4.5, // lidar: roof edge 4.5 over the street
  RIDGE: 9.6, // lidar: ridge 9.6
  ENT: 3.6, // entablature bottom (photos: column ~3.6 of the 4.5 eave)
  SOFFIT: 3.95,
  END_SLOPE: 0.8, // lidar: the hip ends are steeper than the sides
  COLS: 24, // columns per side, pavilion to pavilion (photos: ~3.9 m pitch)
  CUPOLAS: [11.55, 42.75, 73.95], // lidar peaks at ~11, 42, 73 (tops 12.3)
}
const XM = (H.X0 + H.X1) / 2
const SIDE_SLOPE = (H.RIDGE - H.EAVE) / ((H.X1 - H.X0) / 2)

export const columnYs = () => Array.from({ length: H.COLS }, (_, k) => H.YP0 + 0.45 + (k * (H.YP1 - H.YP0 - 0.9)) / (H.COLS - 1))

export type HallParts = { stucco: Part; trim: Part; roof: Part; win: Part; green: Part }

/** Roof height over the hall at (x, y), from its eave planes (z above the hall's own ground). */
function roofZ(x: number, y: number, _xw = H.X0) {
  const e = H.EAVE, xw = H.X0
  return Math.min(e + SIDE_SLOPE * (x - xw), e + SIDE_SLOPE * (H.X1 - x), e + H.END_SLOPE * (y - H.Y0), e + H.END_SLOPE * (H.Y1 - y), H.RIDGE)
}
/** The Decatur eave line: the colonnade at X0, the pavilions set back at XC0. */
const xWest = (y: number) => (y >= H.YP0 && y <= H.YP1 ? H.X0 : H.XC0)

function profileXs(y: number, xw: number): number[] {
  const e = H.EAVE, k = H.END_SLOPE / SIDE_SLOPE
  const c = [xw, H.X1, XM, xw + (y - H.Y0) * k, xw + (H.Y1 - y) * k, H.X1 - (y - H.Y0) * k, H.X1 - (H.Y1 - y) * k,
    xw + (H.RIDGE - e) / SIDE_SLOPE, H.X1 - (H.RIDGE - e) / SIDE_SLOPE]
  return c.filter((x) => x >= xw - 1e-6 && x <= H.X1 + 1e-6)
}
/** Keep the part of a convex polygon where f(x, y) <= 0 (Sutherland–Hodgman). */
function clipPoly(poly: XY[], f: (x: number, y: number) => number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a[0], a[1]), fb = f(b[0], b[1])
    if (fa <= 1e-9) out.push(a)
    if ((fa < -1e-9 && fb > 1e-9) || (fa > 1e-9 && fb < -1e-9)) {
      const t = fa / (fa - fb)
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}
const uniq = (a: number[]) => [...a].sort((p, q) => p - q).filter((v, i, s) => i === 0 || v - s[i - 1] > 1e-4)

/**
 * The hall from ya to yb (C-frame y), standing on ground `g` (z of its own
 * ground in the model). Closed with a section where it is cut (ya > Y0 or
 * yb < Y1), so two models can each draw part of it.
 */
export function butchersHall(P: HallParts, ya: number, yb: number, g: number) {
  const e = g + H.EAVE
  const lo = Math.max(ya, H.YP0), hi = Math.min(yb, H.YP1)

  // ---- roof: each eave plane's facet, clipped exactly ---------------------
  // One hip over the whole rectangle (lidar: the ridge holds 9.6 to the
  // hips, and over the pavilions the roof follows the colonnade's slope:
  // 5.3 at x −4, 6.3 at x −2), drawn over the notched plan: over the two
  // pavilions it stops at their Decatur wall (XC0), which rises to meet it.
  const E = H.EAVE
  const planes: [number, number, number][] = [ // z = a x + b y + c (above the hall's ground)
    [SIDE_SLOPE, 0, E - SIDE_SLOPE * H.X0], [-SIDE_SLOPE, 0, E + SIDE_SLOPE * H.X1],
    [0, H.END_SLOPE, E - H.END_SLOPE * H.Y0], [0, -H.END_SLOPE, E + H.END_SLOPE * H.Y1], [0, 0, H.RIDGE]]
  const zf = (pl: number[], x: number, y: number) => pl[0] * x + pl[1] * y + pl[2]
  for (const [p0, p1, xw] of [[H.Y0, H.YP0, H.XC0], [H.YP0, H.YP1, H.X0], [H.YP1, H.Y1, H.XC0]]) {
    const q0 = Math.max(p0, ya), q1 = Math.min(p1, yb)
    if (q1 - q0 < 1e-3) continue
    planes.forEach((pi, i) => {
      let poly: XY[] = [[xw, q0], [H.X1, q0], [H.X1, q1], [xw, q1]]
      planes.forEach((pj, j) => { if (j !== i) poly = clipPoly(poly, (x, y) => zf(pi, x, y) - zf(pj, x, y)) })
      if (poly.length < 3) return
      for (let k = 1; k < poly.length - 1; k++) {
        const A = poly[0], B = poly[k], Cc = poly[k + 1]
        triN(P.roof, [A[0], A[1], g + zf(pi, A[0], A[1])], [B[0], B[1], g + zf(pi, B[0], B[1])], [Cc[0], Cc[1], g + zf(pi, Cc[0], Cc[1])], [0, 0, 1])
      }
    })
  }
  // where the roof passes over the notch: the pavilions' Decatur walls rise
  // to meet it, and the colonnade's ends are closed by a small gable
  for (const [p0, p1, ys, dir] of [[H.Y0, H.YP0, H.YP0, -1], [H.YP1, H.Y1, H.YP1, 1]] as [number, number, number, number][]) {
    const q0 = Math.max(p0, ya), q1 = Math.min(p1, yb)
    if (q1 - q0 > 1e-3) {
      const zt = (y: number) => g + roofZ(H.XC0, y, H.X0)
      const yk = dir > 0 ? H.Y1 - (zt(0) - e) / H.END_SLOPE : H.Y0 + (zt(0) - e) / H.END_SLOPE // where the hip takes over
      const pts = uniq([q0, q1, ...(yk > q0 && yk < q1 ? [yk] : [])])
      for (let j = 0; j < pts.length - 1; j++) {
        const y0 = pts[j], y1 = pts[j + 1]
        quadN(P.stucco, [H.XC0, y0, e - 0.05], [H.XC0, y1, e - 0.05], [H.XC0, y1, zt(y1)], [H.XC0, y0, zt(y0)], [-1, 0, 0])
      }
    }
    if (ys > ya && ys < yb) triN(P.stucco, [H.X0, ys, e - 0.02], [H.XC0, ys, e - 0.02], [H.XC0, ys, g + roofZ(H.XC0, ys, H.X0)], [0, dir, 0])
  }
  // sections where the hall is cut between two models
  for (const [ys, dir] of [[ya, -1], [yb, 1]] as [number, number][]) {
    if (ys <= H.Y0 + 1e-6 || ys >= H.Y1 - 1e-6) continue
    const xw = xWest(ys), xs = uniq(profileXs(ys, xw))
    for (let j = 0; j < xs.length - 1; j++) {
      const a = xs[j], b = xs[j + 1]
      quadN(P.roof, [a, ys, e], [b, ys, e], [b, ys, g + roofZ(b, ys, xw)], [a, ys, g + roofZ(a, ys, xw)], [0, dir, 0])
    }
    // the core's section, down to the ground
    quadN(P.stucco, [H.XC0, ys, 0], [H.XC1, ys, 0], [H.XC1, ys, e], [H.XC0, ys, e], [0, dir, 0])
  }

  // ---- end pavilions -------------------------------------------------------
  for (const [p0, p1, endY, dir] of [[H.Y0, H.YP0, H.Y0, -1], [H.YP1, H.Y1, H.Y1, 1]] as [number, number, number, number][]) {
    const q0 = Math.max(p0, ya), q1 = Math.min(p1, yb)
    if (q1 - q0 < 0.1) continue
    const ring: V3[] = [[H.XC0, q0, 0], [H.X1, q0, 0], [H.X1, q1, 0], [H.XC0, q1, 0]]
    P.stucco.loft([ring, ring.map(([x, y]) => [x, y, e] as V3)])
    // cornice round the pavilion's three outer faces
    const cz0 = e - 0.55
    block(P.trim, H.XC0 - 0.22, q0, H.XC0, q1, cz0, e)
    block(P.trim, H.X1, q0, H.X1 + 0.22, q1, cz0, e)
    if (endY >= q0 && endY <= q1) {
      const yE = endY, ye = yE + dir * 0.22
      block(P.trim, H.XC0 - 0.22, Math.min(yE, ye), H.X1 + 0.22, Math.max(yE, ye), cz0, e)
      // the end face: three tall arched openings (fanlight windows)
      const F: Face = dir > 0 ? { a: [H.X1, yE], b: [H.XC0, yE] } : { a: [H.XC0, yE], b: [H.X1, yE] }
      const L = H.X1 - H.XC0
      for (const s of [L / 2 - 4.6, L / 2, L / 2 + 4.6]) bigArch(P, F, s, g)
      // plinth
      block(P.trim, H.XC0 - 0.1, Math.min(yE, yE + dir * 0.12), H.X1 + 0.1, Math.max(yE, yE + dir * 0.12), g - 0.0, g + 0.45)
    }
    // one arch on each side face of the pavilion
    const ym = (p0 + p1) / 2
    if (ym > q0 && ym < q1) {
      bigArch(P, { a: [H.XC0, p1], b: [H.XC0, p0] }, p1 - ym, g, 2.6, 3.7, true)
      bigArch(P, { a: [H.X1, p0], b: [H.X1, p1] }, ym - p0, g, 2.6, 3.7, true)
    }
  }

  if (hi - lo < 0.1) return
  // ---- the core (shops), its doors, the gallery soffits -------------------
  const zs = g + H.SOFFIT
  P.stucco.quad([H.XC0, hi, 0], [H.XC0, lo, 0], [H.XC0, lo, zs + 0.6], [H.XC0, hi, zs + 0.6])
  P.stucco.quad([H.XC1, lo, 0], [H.XC1, hi, 0], [H.XC1, hi, zs + 0.6], [H.XC1, lo, zs + 0.6])
  const ys = columnYs()
  for (let k = 0; k < ys.length - 1; k++) {
    const yc = (ys[k] + ys[k + 1]) / 2
    if (yc < lo + 1 || yc > hi - 1) continue
    const kind = k % 3
    for (const F of [{ a: [H.XC0, hi], b: [H.XC0, lo] }, { a: [H.XC1, lo], b: [H.XC1, hi] }] as Face[]) {
      const s = F.a[1] < F.b[1] ? yc - F.a[1] : F.a[1] - yc
      // shopfronts fill the bay, so the pale columns stand out against them
      const bw = ys[k + 1] - ys[k] - 0.7
      if (kind === 1) { // shop window
        rectPanel(P.trim, F.a as XY, F.b as XY, s, bw + 0.3, g + 0.3, g + 3.5, 0.03)
        rectPanel(P.win, F.a as XY, F.b as XY, s, bw, g + 0.5, g + 3.3, 0.06)
      } else { // teal double doors under a transom light
        rectPanel(P.trim, F.a as XY, F.b as XY, s, bw + 0.3, g, g + 3.5, 0.03)
        rectPanel(P.green, F.a as XY, F.b as XY, s, bw, g, g + 2.6, 0.06)
        rectPanel(P.win, F.a as XY, F.b as XY, s, bw, g + 2.75, g + 3.3, 0.06)
      }
    }
  }
  for (const [x0, x1] of [[H.X0 + 0.75, H.XC0], [H.XC1, H.X1 - 0.75]]) quadN(P.stucco, [x0, lo, zs], [x0, hi, zs], [x1, hi, zs], [x1, lo, zs], [0, 0, -1])

  // ---- the colonnades -----------------------------------------------------
  for (const y of ys) {
    if (y < lo + 0.3 || y > hi - 0.3) continue
    column(P.trim, H.X0 + 0.42, y, 0.32, g, g + H.ENT, { n: 8, base: 0.3, cap: 0.28, taper: 0.86 })
    column(P.trim, H.X1 - 0.42, y, 0.32, g, g + H.ENT, { n: 8, base: 0.3, cap: 0.28, taper: 0.86 })
  }
  // entablature: architrave/frieze band and a projecting cornice
  for (const [x0, x1, cx0, cx1] of [[H.X0, H.X0 + 0.75, H.X0 - 0.22, H.X0 + 0.75], [H.X1 - 0.75, H.X1, H.X1 - 0.75, H.X1 + 0.22]]) {
    block(P.stucco, x0, lo, x1, hi, g + H.ENT, e - 0.3, true)
    block(P.trim, cx0, lo, cx1, hi, e - 0.3, e)
    block(P.trim, x0 - 0.06, lo, x1 + 0.06, hi, g + H.ENT, g + H.ENT + 0.18)
  }
  // the Decatur entablature returns to the pavilions
  if (H.YP0 >= ya && H.YP0 <= yb) block(P.stucco, H.X0, H.YP0, H.XC0, H.YP0 + 0.6, g + H.ENT, e - 0.02)
  if (H.YP1 >= ya && H.YP1 <= yb) block(P.stucco, H.X0, H.YP1 - 0.6, H.XC0, H.YP1, g + H.ENT, e - 0.02)

  // ---- cupolas on the ridge -----------------------------------------------
  for (const yc of H.CUPOLAS) if (yc > ya + 1.2 && yc < yb - 1.2) cupola(P, XM, yc, g)
}

/** A tall round-headed opening: pale surround, the glass, an impost bar; `door` puts teal leaves under a fanlight. */
function bigArch(P: HallParts, F: Face, s: number, g: number, w = 3.2, top = 3.9, door = false) {
  archPanel(P.trim, F.a, F.b, s, w + 0.5, g + (door ? 0 : 0.45), g + top + 0.25, 0.04, 8)
  archPanel(P.win, F.a, F.b, s, w, g + (door ? 0 : 0.6), g + top, 0.08, 8)
  const spring = g + top - w / 2
  if (door) rectPanel(P.green, F.a, F.b, s, w - 0.3, g, spring - 0.1, 0.1)
  rectPanel(P.trim, F.a, F.b, s, w, spring - 0.1, spring + 0.06, 0.11)
}

/** A cupola on the ridge: a louvred cream box, a cornice, a flared green cap and a finial (lidar top 12.3). */
function cupola(P: HallParts, x: number, y: number, g: number) {
  const r = 1.0, z0 = g + H.RIDGE - SIDE_SLOPE * r - 0.05, zt = g + H.RIDGE + 1.5
  const ring = (h: number, z: number): V3[] => [[x - h, y - h, z], [x + h, y - h, z], [x + h, y + h, z], [x - h, y + h, z]]
  P.stucco.loft([ring(r, z0), ring(r, zt)])
  // louvres: a dark panel on each face
  for (const [a, b] of [[[x - r, y - r], [x + r, y - r]], [[x + r, y - r], [x + r, y + r]], [[x + r, y + r], [x - r, y + r]], [[x - r, y + r], [x - r, y - r]]] as XY[][]) {
    rectPanel(P.roof, a, b, r, 1.2, g + H.RIDGE + 0.05, zt - 0.2, 0.03)
  }
  P.trim.loft([ring(r + 0.18, zt), ring(r + 0.18, zt + 0.22)])
  P.trim.cap(ring(r + 0.18, zt + 0.22), true)
  P.trim.cap(ring(r + 0.18, zt), false)
  // the flared (bell) cap
  const caps: [number, number][] = [[1.1, 0.22], [0.75, 0.45], [0.4, 0.8], [0.12, 1.1]]
  const rings = caps.map(([h, dz]) => ring(h, zt + dz))
  P.green.loft(rings)
  const top = rings[rings.length - 1]
  for (let i = 0; i < 4; i++) P.green.tri(top[i], top[(i + 1) % 4], [x, y, zt + 1.2])
  // finial
  const f = (h: number, z: number): V3[] => ring(h, z)
  P.green.loft([f(0.07, zt + 1.15), f(0.05, zt + 1.85)])
  for (let i = 0; i < 4; i++) P.green.tri(f(0.05, zt + 1.85)[i], f(0.05, zt + 1.85)[(i + 1) % 4], [x, y, zt + 2.0])
}

// ===========================================================================
// Shared materials
// ===========================================================================

export const STUCCO: Swatch = finish('market-stucco', 0xe2d6b8)
export const SHINGLE: Swatch = finish('market-shingle', 0x8e837b)
export const TEAL: Swatch = finish('market-green', 0x5f8c80)
const MARKET_GREEN: Swatch = finish('market-dark-green', 0x4a6660)
const GATE: Swatch = finish('market-gate-yellow', 0xe6cf7c)

// ===========================================================================
// The French Market (only when run directly)
// ===========================================================================

/** A point in a local frame: origin o, unit u along, n = u turned clockwise (to the right). */
function lf(o: XY, u: XY) {
  const n: XY = [u[1], -u[0]]
  return (s: number, t: number, z = 0): V3 => [o[0] + u[0] * s + n[0] * t, o[1] + u[1] * s + n[1] * t, z]
}

/**
 * A plain hipped market hall on an oriented rectangle (s 0..L along u,
 * t −W/2..W/2): stucco walls on ground g, a cornice, a hipped or gabled
 * roof at each end, and round-headed teal doors at `pitch` on the long sides.
 */
function plainHall(P: HallParts, o: XY, u: XY, L: number, W: number, g: number, eave: number, ridge: number, hip0: boolean, hip1: boolean, pitch: number, s0Doors = 0, s1Doors = L) {
  const Q = lf(o, u), w = W / 2, e = g + eave, R = g + ridge
  const ring = [Q(0, -w), Q(L, -w), Q(L, w), Q(0, w)]
  const ccw = (ring[1][0] - ring[0][0]) * (ring[2][1] - ring[0][1]) - (ring[1][1] - ring[0][1]) * (ring[2][0] - ring[0][0]) > 0
  const rr = ccw ? ring : [...ring].reverse()
  P.stucco.loft([rr.map(([x, y]) => [x, y, 0] as V3), rr.map(([x, y]) => [x, y, e] as V3)])
  // cornice
  const c = 0.22, cr = [Q(-c, -w - c), Q(L + c, -w - c), Q(L + c, w + c), Q(-c, w + c)]
  const cc = ccw ? cr : [...cr].reverse()
  P.trim.loft([cc.map(([x, y]) => [x, y, e - 0.4] as V3), cc.map(([x, y]) => [x, y, e] as V3)])
  P.trim.cap(cc.map(([x, y]) => [x, y, e - 0.4] as V3), false)
  // roof (from the cornice's outer edge)
  const W2 = w + c, run = ridge - eave, hr = run / (run / W2) // same slope at the hips
  const h0 = hip0 ? hr : 0, h1 = hip1 ? hr : 0
  const up: V3 = [0, 0, 1]
  quadN(P.roof, Q(-c, W2, e), Q(L + c, W2, e), Q(L + c - h1, 0, R), Q(-c + h0, 0, R), up)
  quadN(P.roof, Q(L + c, -W2, e), Q(-c, -W2, e), Q(-c + h0, 0, R), Q(L + c - h1, 0, R), up)
  if (hip0) triN(P.roof, Q(-c, -W2, e), Q(-c, W2, e), Q(-c + h0, 0, R), up)
  else triN(P.stucco, Q(-c, -W2, e), Q(-c, W2, e), Q(-c, 0, R), [-u[0], -u[1], 0])
  if (hip1) triN(P.roof, Q(L + c, W2, e), Q(L + c, -W2, e), Q(L + c - h1, 0, R), up)
  else triN(P.stucco, Q(L + c, W2, e), Q(L + c, -W2, e), Q(L + c, 0, R), [u[0], u[1], 0])
  // doors, both long sides
  const n = Math.max(1, Math.round((s1Doors - s0Doors) / pitch)), p = (s1Doors - s0Doors) / n
  const right: Face = { a: [Q(0, w)[0], Q(0, w)[1]], b: [Q(L, w)[0], Q(L, w)[1]] }
  const left: Face = { a: [Q(L, -w)[0], Q(L, -w)[1]], b: [Q(0, -w)[0], Q(0, -w)[1]] }
  for (let k = 0; k < n; k++) {
    const s = s0Doors + p * (k + 0.5)
    for (const [F, ss] of [[right, s], [left, L - s]] as [Face, number][]) {
      archPanel(P.trim, F.a, F.b, ss, 2.5, g, g + 3.55, 0.03, 4)
      archPanel(P.win, F.a, F.b, ss, 2.0, g + 2.05, g + 3.3, 0.06, 4) // fan centre kept off the sill line (no zero-area slivers)
      rectPanel(P.green, F.a, F.b, ss, 2.0, g, g + 2.25, 0.07)
    }
  }
}

/** Farmers Market frame (OSM way/345253096's own axis, compass 53.4) → C-frame. */
function f2c(x2: number, y2: number): XY {
  const b2 = (53.4 * Math.PI) / 180, b = (C_BEARING * Math.PI) / 180
  const E = x2 * Math.cos(b2) + y2 * Math.sin(b2), N = -x2 * Math.sin(b2) + y2 * Math.cos(b2)
  return [E * Math.cos(b) - N * Math.sin(b), E * Math.sin(b) + N * Math.cos(b)]
}

export type ShedParts = HallParts & { iron: Part; gate: Part }

/** The Farmers Market shed (2008 rebuild of the 1930s WPA shed) with its arched gateway. */
function farmersShed(P: ShedParts) {
  const o = f2c(-63.5, 316.9), o2 = f2c(-63.5, 317.9), d = Math.hypot(o2[0] - o[0], o2[1] - o[1])
  const u: XY = [(o2[0] - o[0]) / d, (o2[1] - o[1]) / d]
  const Q = lf(o, u), L = Number(process.env.FM_SHED_L ?? 103.1), w = 8.0 // FM_SHED_L: debug crop
  const zt = 4.25, zb = 3.65 // roof top and fascia bottom (lidar: roof 4.2)
  const box = (p: Part, s0: number, s1: number, t0: number, t1: number, z0: number, z1: number, bottom = false) => {
    const r = [Q(s0, t0, z0), Q(s0, t1, z0), Q(s1, t1, z0), Q(s1, t0, z0)]
    const ccw = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[1][1] - r[0][1]) * (r[2][0] - r[0][0]) > 0
    const b = ccw ? r : [...r].reverse(), t = b.map(([x, y]) => [x, y, z1] as V3)
    p.loft([b, t]); p.cap(t, true); if (bottom) p.cap(b, false)
  }
  // the roof slab: charcoal fascia, grey top, pale boarded soffit
  box(P.iron, 0, L, -w, w, zb, zt)
  const sof = [Q(0.05, -w + 0.05, zb - 0.01), Q(0.05, w - 0.05, zb - 0.01), Q(L - 0.05, w - 0.05, zb - 0.01), Q(L - 0.05, -w + 0.05, zb - 0.01)]
  quadN(P.trim, sof[0], sof[1], sof[2], sof[3], [0, 0, -1])
  quadN(P.roof, Q(0.02, -w + 0.02, zt + 0.01), Q(L - 0.02, -w + 0.02, zt + 0.01), Q(L - 0.02, w - 0.02, zt + 0.01), Q(0.02, w - 0.02, zt + 0.01), [0, 0, 1])
  // the raised monitor along the middle (lidar 5.5): glazed sides, grey top
  const mz = 5.5
  box(P.win, 1.5, L - 1.5, -1.5, 1.5, zt, mz - 0.25)
  box(P.trim, 1.2, L - 1.2, -1.8, 1.8, mz - 0.25, mz)
  // posts and their curved brackets, four rows
  const n = Math.round((L - 2) / 5.94) + 1, pitch = (L - 2) / (n - 1)
  for (let k = 0; k < n; k++) {
    const s = 1 + k * pitch
    for (const t of [-7.2, -2.9, 2.9, 7.2]) {
      box(P.iron, s - 0.15, s + 0.15, t - 0.15, t + 0.15, 0, zb)
      const dirs = Math.abs(t) > 5 ? [-Math.sign(t)] : [-1, 1]
      for (const dt of dirs) bracket(P.iron, Q, s, t + dt * 0.15, dt, zb, 1.5)
    }
  }
  // the gateway at the upriver end: a pale stucco arch with an attic
  const g0 = -0.95, g1 = 0.2, gw = 3.1
  const front: Face = { a: [Q(g0, -gw)[0], Q(g0, -gw)[1]], b: [Q(g0, gw)[0], Q(g0, gw)[1]] }
  archWall(P.gate, front, 0, 2 * gw, 0, 4.45, g1 - g0, [{ c: gw, w: 3.2, top: 3.75 }], 8)
  box(P.gate, g0 - 0.18, g1 + 0.18, -gw - 0.18, gw + 0.18, 4.45, 4.8)
  box(P.gate, g0, g1, -gw + 0.05, gw - 0.05, 4.8, 5.75)
  box(P.gate, g0 - 0.14, g1 + 0.14, -gw - 0.1, gw + 0.1, 5.75, 6.0)
  // imposts and the keystone
  for (const t of [-gw, gw - 0.1]) box(P.gate, g0 - 0.06, g1 + 0.06, t, t + 0.1, 2.15, 2.4)
  box(P.gate, g0 - 0.08, g0 + 0.1, -0.25, 0.25, 3.55, 4.1)
}

/** A curved knee bracket: a thin plate filling the corner between post and beam, its underside a quarter circle. */
function bracket(p: Part, Q: (s: number, t: number, z?: number) => V3, s: number, t: number, dt: number, zb: number, r: number) {
  const pts: V3[] = [Q(s, t, zb)]
  for (let i = 0; i <= 3; i++) {
    const a = Math.PI - (i / 3) * (Math.PI / 2) // from the post (180°) round to the beam (90°)
    pts.push(Q(s, t + dt * (r + r * Math.cos(a)), zb - r + r * Math.sin(a)))
  }
  for (const side of [1, -1]) for (let i = 1; i < pts.length - 1; i++) {
    const off = (q: V3): V3 => [q[0] + side * 0.05 * (Q(1, 0)[0] - Q(0, 0)[0]), q[1] + side * 0.05 * (Q(1, 0)[1] - Q(0, 0)[1]), q[2]]
    const a = Q(1, 0), b = Q(0, 0)
    triN(p, off(pts[0]), off(pts[i]), off(pts[i + 1]), [side * (a[0] - b[0]), side * (a[1] - b[1]), 0])
  }
}

function build() {
  const green = new Part() // doors, cupola caps and the shed's steel share one dark green
  const P: ShedParts = { stucco: new Part(), trim: new Part(), roof: new Part(), win: new Part(), green, iron: green, gate: new Part() }
  const gHall = 0.7, gVeg = 0.5 // lidar ground: hall 3.0, second hall 2.8, shed 2.3 (abs)
  const YS = Number(process.env.FM_YS ?? 15.5) // the café's share ends here (nola-cafe-du-monde.ts); FM_YS: debug
  const only = process.env.FM_PIECE // debug: render one piece on its own
  if (!only || only === 'hall') butchersHall(P, YS, H.Y1, gHall)
  // a low stylobate under the colonnades where the street falls toward the shed
  if (!only || only === 'hall') {
    block(P.stucco, H.X0 + 0.05, YS, H.X0 + 0.8, H.YP1, 0, gHall)
    block(P.stucco, H.X1 - 0.8, YS, H.X1 - 0.05, H.YP1, 0, gHall)
  }
  // the second hall (OSM way/329364588): two hipped wings meeting at a bend
  if (!only || only === 'veg') plainHall(P, [0.2, 108.66], [0, 1], 34.0, 12.2, gVeg, 4.7, 7.5, true, false, 4.2, 0.5, 31.5)
  const b0: XY = [0.58, 140.75], b1: XY = [16.81, 200.54], bl = Math.hypot(b1[0] - b0[0], b1[1] - b0[1])
  const bu: XY = [(b1[0] - b0[0]) / bl, (b1[1] - b0[1]) / bl]
  if (!only || only === 'veg') plainHall(P, [b0[0] - bu[0] * 1.2, b0[1] - bu[1] * 1.2], bu, bl + 1.2, 11.9, gVeg, 4.7, 7.5, false, true, 4.2, 3.0, bl)
  if (!only || only === 'shed') farmersShed(P)

  const AX = 3.6, AY = 54.0
  if (only) {
    const c = only === 'hall' ? [3.6, 54] : only === 'veg' ? [5, 155] : f2c(-63.5, 368)
    shift([P.stucco, P.trim, P.roof, P.win, P.green, P.gate], c[0], c[1])
    const mats = [STUCCO, PALETTE.trim, SHINGLE, PALETTE.window, MARKET_GREEN, GATE]
    const parts = [P.stucco, P.trim, P.roof, P.win, P.green, P.gate].map((part, i) => ({ part, material: mats[i] }))
    Bun.write(`${process.env.FM_OUT}/${only}.glb`, writeGlb(only, parts))
    return
  }
  shift([P.stucco, P.trim, P.roof, P.win, P.green, P.gate], AX, AY)
  console.log('anchor', cToLonLat(AX, AY))
  finishModel('The French Market', 'nola-french-market', [
    { part: P.stucco, material: STUCCO },
    { part: P.trim, material: PALETTE.trim },
    { part: P.roof, material: SHINGLE },
    { part: P.win, material: PALETTE.window },
    { part: P.green, material: MARKET_GREEN },
    { part: P.gate, material: GATE },
  ], { bearing: C_BEARING, osm: 'way/329364505' }, 6500)
}

if (import.meta.main) build()
