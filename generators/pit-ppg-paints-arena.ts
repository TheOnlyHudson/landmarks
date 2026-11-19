/**
 * PPG Paints Arena (Consol Energy Center until 2016), Pittsburgh (NHL,
 * Pittsburgh Penguins; 2010, HOK Sport/Populous) — procedural, CC0-1.0, no
 * textures.  bun generators/pit-ppg-paints-arena.ts
 *
 * Map frame: x east, y north, z up, metres (bearing 0). The anchor is the
 * area centroid of the building outline (building=stadium way/1557964471):
 * -79.989534, 40.439572. z = 0 is the lowest ground under it, on Fifth
 * Avenue at the south-west; the site climbs about 15 m to Centre Avenue on
 * the north, where the walls sink into the hill (STYLE.md, "Ground").
 *
 * What makes it read as itself, from the photos: a big rounded box of buff
 * brick and precast, its upper walls clad in white metal panels; the tall
 * curved glass curtain wall wrapping its west side, towards downtown, with
 * a lower glazed lobby stepping down at the south-west and the buff
 * entrance block of the gate in front of the glass; and over it all the
 * broad, shallow oval dome of the white roof.
 *
 * Evidence
 * - OSM: building=stadium way/1557964471 (the outline); leisure=stadium
 *   way/130358195 (name, Q595460). No other building under the model.
 * - Measured, lidar: USGS 3DEP PA_WesternPA_2_2019 (flown 2019), 1 m grid
 *   (heights above the box's lowest ground, at the south-west corner): the
 *   roof's rim 40-42 m all round, the roof rising as a shallow oval dome to
 *   52 m over the bowl, its long axis about 25° east of north; the west
 *   lobby's glazed roof 35 m (y -22..+2) and 30 m (y -46..-26); the ground
 *   from 0-1 m on Fifth Avenue to 15 m on the north-west plaza and 23 m at
 *   the north-east.
 * - Measured, USGS NAIP orthophoto (0.25 m): plan, the white roof and its
 *   dome's edge, the glass along the west side.
 * - Published (Wikipedia, "PPG Paints Arena"): opened 2010; Populous (as
 *   HOK Sport); renamed 2016.
 * - Photos (Wikimedia Commons):
 *   Jleedev, "PPG Paints Arena - March 2017" (CC BY-SA 4.0, the glass
 *     front and the gate)
 *     https://commons.wikimedia.org/wiki/File:PPG_Paints_Arena_-_March_2017.jpg
 *   Bohao Zhao, "Consol Energy Center - panoramio" (CC BY 3.0, the curved
 *     glass wall)
 *     https://commons.wikimedia.org/wiki/File:Consol_Energy_Center_-_panoramio.jpg
 *   NWRGeek, "CONSOL Energy Center - Pittsburgh, PA" (CC0, the glass wall
 *     above the plaza)
 *     https://commons.wikimedia.org/wiki/File:CONSOL_Energy_Center_-_Pittsburgh,_PA.JPG
 *   Larry LaRose, "Consol Centre - panoramio" (CC BY-SA 3.0, a buff corner
 *     tower)
 *     https://commons.wikimedia.org/wiki/File:Consol_Centre_-_panoramio.jpg
 *   David Fulmer, "Consol Energy Center March 2010" (CC BY 2.0, the
 *     south-west corner: glass, buff tower, white panels above)
 *     https://commons.wikimedia.org/wiki/File:Consol_Energy_Center_March_2010.jpg
 *   Colethazor, "PensArena" (public domain, the glass front)
 *     https://commons.wikimedia.org/wiki/File:PensArena.jpg
 *   Doug Kerr, "Pittsburgh, Pennsylvania (8482600915)" (CC BY-SA 2.0, the
 *     gate) and "(8483704534)" (CC BY-SA 2.0, the north side's buff piers
 *     and white panels along Centre Avenue)
 *     https://commons.wikimedia.org/wiki/File:Pittsburgh,_Pennsylvania_(8482600915).jpg
 *     https://commons.wikimedia.org/wiki/File:Pittsburgh,_Pennsylvania_(8483704534).jpg
 * Estimated: the dome's profile between the lidar rows; the white panels'
 * extent on the east and south sides (photographed only at the corners);
 * the gate block's place and size (photos); the glass's mullion lines.
 * Left out: the signs and lettering, the Lemieux statue, the flagpoles.
 * Doubts: the gate's place on the west front is read from photos without a
 * known camera position; the east side is unphotographed.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { quad, box, triangulate, type XY } from './dc-nationals-park'
import { save } from './phl-lincoln-financial-field'

const buff = new Part(), white = new Part(), win = new Part(), door = new Part()

// OSM outline (way/1557964471), counter-clockwise from the south-east.
const OUT: XY[] = [[25.8, -79.0], [26.1, -75.0], [40.4, -75.9], [40.6, -72.7], [60.8, -73.8], [62.0, -54.0], [62.2, -50.4], [66.0, 16.1], [67.8, 47.8], [69.1, 69.0], [44.7, 77.1], [44.4, 84.9], [19.2, 85.3], [-21.4, 76.6], [-27.1, 75.4], [-31.8, 81.3], [-39.9, 80.0], [-43.2, 74.8], [-47.9, 65.2], [-51.9, 55.4], [-56.0, 44.4], [-58.2, 36.4], [-59.1, 33.3], [-61.0, 22.8], [-64.2, 8.8], [-68.5, -4.5], [-72.0, -14.7], [-75.9, -23.3], [-80.6, -31.5], [-84.4, -37.5], [-80.8, -42.7], [-64.6, -68.5], [-58.7, -68.7], [-58.7, -70.0], [-46.1, -70.6], [-46.5, -74.7]]
// The west lobby's wedge (lidar: lower, glazed) is cut from the main block.
const iW0 = OUT.findIndex(([x, y]) => x === -64.2 && y === 8.8), iW1 = OUT.findIndex(([x, y]) => x === -80.8 && y === -42.7)
const MAIN: XY[] = [...OUT.slice(0, iW0 + 1), [-64, 0], [-67.5, -26], [-76, -44], ...OUT.slice(iW1 + 1)]
const LOBBY: XY[] = [...OUT.slice(iW0, iW1 + 1), [-76, -44], [-67.5, -26], [-64, 0]]
const RIM = 41

// Which outline edges are glass: the west side, from the lobby round the
// north-west corner to the gate's bump on the north.
const glassEdge = (a: XY, b: XY) => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  return (mx < -40 && my > -45) || (mx < -20 && my > 70)
}

/** Walls of a plan polygon (counter-clockwise), with panels on each face. */
function walls(poly: XY[], z1: number, isLobby: boolean) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.01) continue
    const out: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
    const glass = glassEdge(a, b)
    const P = (t: number, z: number, d = 0): V3 => [a[0] + (b[0] - a[0]) * t + out[0] * d, a[1] + (b[1] - a[1]) * t + out[1] * d, z]
    // split long faces so the uphill ground can take them
    const n = Math.max(1, Math.ceil(L / 12))
    for (let k = 0; k < n; k++) quad(glass ? win : buff, [P(k / n, 0), P((k + 1) / n, 0), P((k + 1) / n, z1), P(k / n, z1)], out)
    if (glass) {
      // pale floor lines across the curtain wall, and a white coping
      for (const z of [z1 * 0.36, z1 * 0.68]) quad(white, [P(0, z, 0.06), P(1, z, 0.06), P(1, z + 0.6, 0.06), P(0, z + 0.6, 0.06)], out)
      quad(white, [P(0, z1 - 1.4, 0.06), P(1, z1 - 1.4, 0.06), P(1, z1, 0.06), P(0, z1, 0.06)], out)
      // a few pale mullion lines
      const nm = Math.floor(L / 9)
      for (let k = 1; k <= nm; k++) { const t = k / (nm + 1), h = 0.25 / L; quad(white, [P(t - h, 0, 0.06), P(t + h, 0, 0.06), P(t + h, z1 - 1.4, 0.06), P(t - h, z1 - 1.4, 0.06)], out) }
    } else if (L > 22 && L <= 45 && !isLobby) {
      // a buff corner tower: a tall recessed louvre panel up its middle
      quad(win, [P(0.33, 12, 0.06), P(0.67, 12, 0.06), P(0.67, z1 - 9, 0.06), P(0.33, z1 - 9, 0.06)], out)
    } else if (L > 45 && !isLobby) {
      // white metal panels over the buff base, between buff end piers
      const e = Math.min(9, L * 0.2) / L
      quad(white, [P(e, 21, 0.06), P(1 - e, 21, 0.06), P(1 - e, z1 - 2, 0.06), P(e, z1 - 2, 0.06)], out)
      // louvred window bands low in the brick
      const m = Math.max(1, Math.floor((L * (1 - 2 * e)) / 14))
      for (let k = 0; k < m; k++) {
        const t0 = e + ((1 - 2 * e) * (k + 0.2)) / m, t1 = e + ((1 - 2 * e) * (k + 0.8)) / m
        quad(win, [P(t0, 9, 0.06), P(t1, 9, 0.06), P(t1, 16, 0.06), P(t0, 16, 0.06)], out)
      }
    }
  }
}

// The main block, walls to the rim, a flat white rim round the dome.
walls(MAIN, RIM, false)
// The lobby wedge, glazed, 33 m.
walls(LOBBY, 33, true)
for (const [i, j, k] of triangulate(LOBBY)) quad(white, [[LOBBY[i][0], LOBBY[i][1], 33], [LOBBY[j][0], LOBBY[j][1], 33], [LOBBY[k][0], LOBBY[k][1], 33], [LOBBY[k][0], LOBBY[k][1], 33]], [0, 0, 1])

// The roof: a shallow oval dome from the rim (41 m) to 52 m, its long axis
// 25° east of north, on a flat rim that fills the rest of the plan.
const DC: XY = [3, 2], ANG = (25 * Math.PI) / 180
const AX: XY = [Math.sin(ANG), Math.cos(ANG)], AY: XY = [Math.cos(ANG), -Math.sin(ANG)] // along, across
const SA = 74, SB = 56, NSE = 3
const NR = 32, NRING = 6
const domePt = (k: number, j: number): V3 => {
  const th = (k / NR) * 2 * Math.PI
  const c = Math.cos(th), s = Math.sin(th)
  const rr = (Math.abs(c) ** NSE + Math.abs(s) ** NSE) ** (-1 / NSE) // superellipse
  const rho = 1 - j / NRING // 1 at the edge, 0 at the top
  const u = SA * rr * c * rho, v = SB * rr * s * rho
  const z = RIM + 0.05 + 11 * (1 - rho * rho) ** 0.7
  return [DC[0] + AX[0] * u + AY[0] * v, DC[1] + AX[1] * u + AY[1] * v, z]
}
for (let j = 0; j < NRING; j++) for (let k = 0; k < NR; k++) {
  const a = domePt(k, j), b = domePt(k + 1, j), c = domePt(k + 1, j + 1), d = domePt(k, j + 1)
  quad(white, [a, b, c, d], [0, 0, 1])
}
// the flat rim under and round the dome's foot
for (const [i, j, k] of triangulate(MAIN)) quad(white, [[MAIN[i][0], MAIN[i][1], RIM], [MAIN[j][0], MAIN[j][1], RIM], [MAIN[k][0], MAIN[k][1], RIM], [MAIN[k][0], MAIN[k][1], RIM]], [0, 0, 1])

// The gate: a buff entrance block in front of the glass on the west,
// doors under a white canopy. Its base on the plaza, 14 m up the hill.
{
  const c: XY = [-55.6, 46.5], out: XY = [-0.937, 0.35] // on the glass wall (OSM edge)
  const t: V3 = [out[1], -out[0], 0], n: V3 = [out[0], out[1], 0]
  box(buff, [c[0] + out[0] * 3.5, c[1] + out[1] * 3.5, 14 + 4.5], [t, n, [0, 0, 1]], [14, 3.5, 4.5], true)
  box(door, [c[0] + out[0] * 7.06, c[1] + out[1] * 7.06, 16.2], [t, n, [0, 0, 1]], [11, 0.05, 2.2])
  box(white, [c[0] + out[0] * 8.5, c[1] + out[1] * 8.5, 18.8], [t, n, [0, 0, 1]], [12, 1.6, 0.3], true)
  box(buff, [c[0] + out[0] * 3.5, c[1] + out[1] * 3.5, 7], [t, n, [0, 0, 1]], [14, 3.5, 7]) // its foundation down the slope
}

if (import.meta.main) {
  await save('pit-ppg-paints-arena', 'PPG Paints Arena', [
    { part: buff, material: finish('ppg-buff', 0xd9c49b) },
    { part: white, material: finish('ppg-white', 0xe9ebea) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 0, osm: 'way/1557964471', height: 52 }, 5000)
}
