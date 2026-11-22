/**
 * Seneca Niagara Resort & Casino (casino 2002, hotel tower 2005), Niagara
 * Falls, New York: procedural, CC0-1.0.
 * bun generators/niagara-seneca-niagara-casino.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. Anchor = centroid of the hotel tower's OSM outline
 * way/807632544, 43.086348, -79.055729. z = 0 is the street around the
 * casino (lidar ground, flat to about 0.3 m).
 *
 * Identity: a 26-storey glass slab in pale sky-blue glass, each face split
 * by a broad dark-blue central band that rises a little above the roof on
 * the west face and both end faces; nested dark-blue bracket lines (a
 * double Γ) on the pale glass either side; the lowest floors in sea-green
 * glass rising into a row of triangular peaks. It stands on the casino:
 * a huge barrel-vaulted hall in pale green metal to the west, a beige hotel
 * wing with green roof edges round the tower's foot.
 *
 * Evidence:
 * - plan: OSM. Tower way/807632544 (building=hotel, 26 levels), 23.3 x
 *   76.6 m, turned 2.9 degrees anticlockwise; casino way/393294157.
 * - heights: USGS 3DEP lidar, NY_FEMAR2_Central_B1_2018 (flown 2018;
 *   NY_3County_2019 has no points here), 1 m grid over the tower and a 2 m
 *   grid over the casino, measured from the street (ground_min + 3.4 m):
 *   - tower: lidar footprint about 25 x 80 m (its 2 m read-out widens the
 *     OSM outline; the model takes 24.4 x 78.6 m); roof 97.0 m, parapet
 *     98.5 m; the central bands of the west face and both end faces rise
 *     to 101.6 m, the east face's stops at the parapet; roof plant boxes
 *     to about 104-107 m (the tallest returns, 111-112 m, are the sign
 *     frame and masts, left out);
 *   - casino hall: one barrel vault spanning north-south, 140 m wide,
 *     crown 23.9 m at y = -9, eaves about 7 m (a circular arc, radius
 *     149 m, fits every 10 m sample to 0.6 m);
 *   - hotel wing round the tower: 18 m; north strip: 10 m; the rest of
 *     the casino's edge: 7-8 m.
 *   Published: 26 floors (Wikipedia "Seneca Niagara Resort & Casino"; no
 *   published height found, so the lidar stands).
 * - bands, brackets, peaks, colours: the photos below. The bracket lines
 *   turn at about 79 m on the broad faces (68 m on the ends) and end at
 *   about 44 m; the peaks reach 39-42 m over a green band to 26 m.
 *   Estimated by scaling both street photos against the lidar roof
 *   height, +-3 m.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Seneca Niagara Casino Tower.jpg", Buffalutheran, CC0 (from the
 *   south-east, street): bands, brackets, peaks, green roofs, beige wing
 *   https://commons.wikimedia.org/wiki/File:Seneca_Niagara_Casino_Tower.jpg
 * - "Seneca Niagara Casino Hotel and Tower.jpg", Whpq, CC BY-SA 3.0 (from
 *   the west, Canada, far): the west face straight on, the rainbow LED
 *   "T" in the band, the vault's arched end
 *   https://commons.wikimedia.org/wiki/File:Seneca_Niagara_Casino_Hotel_and_Tower.jpg
 * - "Seneca Niagara Casino in Niagara Falls, NY IMG 1320.JPG", Billy
 *   Hathorn, CC BY-SA 3.0: the top, bands rising above the roof
 *   https://commons.wikimedia.org/wiki/File:Seneca_Niagara_Casino_in_Niagara_Falls,_NY_IMG_1320.JPG
 * No commercial imagery.
 *
 * Simplified / left out: the glass mullion grid; the rainbow LED "T" lines
 * in the bands (no seventh material; at night the glass glows as windows);
 * the rooftop sign frame and masts; the casino's entrance canopies and the
 * parking garage (way/393294330, its own building).
 * Doubts: the east face and the north end have no close photo (drawn as
 * the west and south, with the lidar's heights); the vault's west end
 * reads dark in the Whpq photo and is drawn in the band blue.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, block, cap, inset, onWall, panel, rect, save, turn, walls, type XY } from './chi-aon-center'

const CASINO_RAW: XY[] = [[-190.1, 76.2], [-180.5, -95.4], [-172.1, -95.0], [-173.1, -77.7], [-164.8, -77.2], [-153.1, -76.6], [-152.0, -94.5], [-133.9, -93.5], [-134.5, -82.0], [-124.9, -81.4], [-124.2, -93.3], [-114.0, -92.7], [-114.6, -82.0], [-81.8, -80.2], [-81.1, -92.0], [-75.2, -91.7], [-75.9, -79.2], [-66.5, -78.7], [-66.2, -84.2], [-57.8, -83.7], [-57.5, -90.1], [-27.8, -88.4], [-28.4, -78.1], [-19.1, -77.6], [-18.1, -95.3], [-9.7, -94.9], [-9.4, -99.7], [0.7, -99.1], [0.4, -94.3], [33.4, -91.9], [32.8, -82.7], [37.5, -82.5], [34.9, -36.5], [31.2, -36.7], [30.7, -27.2], [24.2, -27.7], [23.8, -19.3], [22.1, -19.3], [21.8, -11.6], [21.0, 1.9], [20.3, 15.6], [20.0, 23.0], [21.6, 23.2], [20.9, 31.6], [27.4, 32.0], [26.8, 41.3], [30.8, 41.5], [27.2, 111.1], [10.6, 110.3], [-32.4, 108.0], [-31.9, 98.9], [-139.2, 93.1], [-154.9, 92.2], [-154.2, 78.9], [-161.9, 78.5], [-160.9, 60.9], [-170.8, 60.3], [-180.4, 59.8], [-181.4, 76.7]]
const CASINO: XY[] = area(CASINO_RAW) > 0 ? CASINO_RAW : [...CASINO_RAW].reverse()

// Tower, in its own frame: u across (west -> east), v along (south -> north).
const ROT = 2.9, HU = 12.2, HV = 39.3
const ROOF = 97.0, PARAPET = 98.5, BAND_TOP = 101.6
const BAND_V = 13 // half-width of the broad faces' central band (a third of the face, as the Whpq photo)
const BAND_U = 4 // half-width of the end faces' band
const PEAK_BASE = 26, PEAK_TIP = 42
const BR_TOP = 79, BR_BOT = 44

const T = (r: XY[]) => turn(r, ROT)

function build() {
  const glass = new Part(), green = new Part(), blue = new Part(), wall = new Part(), roof = new Part(), metal = new Part()

  // ---- casino base: the whole outline at 7 m
  block(wall, roof, CASINO, 0, 7, 0.3)
  // podium windows: a band of glass round the base
  for (let i = 0; i < CASINO.length; i++) {
    const a = CASINO[i], b = CASINO[(i + 1) % CASINO.length]
    const { L } = onWall(a, b)
    if (L < 8) continue
    const k = Math.round(L / 9), w = (L - 2) / k
    for (let q = 0; q < k; q++) panel(green, a, b, 1 + q * w + 0.8, 1 + (q + 1) * w - 0.8, 1.2, 4.6, 0.05)
  }

  // ---- the barrel vault over the gaming hall, spanning north-south
  const VX0 = -178, VX1 = -42, VY0 = -77.5, VY1 = 60, CY = -9.3, CROWN = 23.9, R = 149
  const arc = (y: number) => CROWN - (R - Math.sqrt(R * R - (y - CY) ** 2))
  const N = 14
  const ys = Array.from({ length: N + 1 }, (_, i) => VY0 + (VY1 - VY0) * i / N)
  const XS = Array.from({ length: 9 }, (_, i) => VX0 + (VX1 - VX0) * i / 8)
  for (let i = 0; i < N; i++) {
    const y0 = ys[i], y1 = ys[i + 1]
    const n0: V3 = [0, (y0 - CY) / R, Math.sqrt(1 - ((y0 - CY) / R) ** 2)], n1: V3 = [0, (y1 - CY) / R, Math.sqrt(1 - ((y1 - CY) / R) ** 2)]
    for (let k = 0; k < XS.length - 1; k++) {
      const a: V3 = [XS[k], y0, arc(y0)], b: V3 = [XS[k + 1], y0, arc(y0)], c: V3 = [XS[k + 1], y1, arc(y1)], d: V3 = [XS[k], y1, arc(y1)]
      metal.tri(a, b, c, undefined, undefined, undefined, [n0, n0, n1])
      metal.tri(a, c, d, undefined, undefined, undefined, [n0, n1, n1])
    }
  }
  // side walls up to the eaves, and the arched ends
  for (const [y, s] of [[VY0, -1], [VY1, 1]] as [number, number][]) {
    const pts = XS.map((x) => [x, y] as XY)
    const ring = s < 0 ? pts : [...pts].reverse()
    for (let k = 0; k < ring.length - 1; k++)
      wall.quad([ring[k][0], ring[k][1], 7], [ring[k + 1][0], ring[k + 1][1], 7], [ring[k + 1][0], ring[k + 1][1], arc(y)], [ring[k][0], ring[k][1], arc(y)])
  }
  for (const [x, s] of [[VX0, -1], [VX1, 1]] as [number, number][]) {
    for (let i = 0; i < N; i++) {
      const y0 = ys[i], y1 = ys[i + 1]
      const q: V3[] = [[x, y0, 7], [x, y1, 7], [x, y1, arc(y1)], [x, y0, arc(y0)]]
      if (s > 0) wall.quad(q[0], q[1], q[2], q[3]); else wall.quad(q[1], q[0], q[3], q[2])
    }
    // the west end's great arched glass, set just proud of its wall
    if (s < 0) for (let i = 1; i < N - 1; i++) {
      const y0 = ys[i], y1 = ys[i + 1], x0 = x - 0.06
      blue.quad([x0, y1, 8], [x0, y0, 8], [x0, y0, arc(y0) - 1.2], [x0, y1, arc(y1) - 1.2])
    }
  }

  // ---- north strip and the hotel wing round the tower's foot
  const hipped = (r: XY[], z1: number) => {
    walls(wall, r, 0, z1 - 2)
    const top = inset(r, 1.6)
    walls(metal, r, z1 - 2, z1, top)
    cap(roof, top, z1)
  }
  hipped(rect(-141.7, 60.7, -51.7, 92), 10)
  hipped(rect(-41, -49, 19.5, 104), 18)
  hipped(rect(19.5, 42, 27, 104), 14)
  for (const [r, z1] of [[rect(-41, -49, 19.5, 104), 18], [rect(-141.7, 60.7, -51.7, 92), 10]] as [XY[], number][])
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4]
      const { L } = onWall(a, b)
      const k = Math.round(L / 7), w = L / k
      for (let q = 0; q < k; q++) for (const [z0, z2] of z1 > 12 ? [[8.6, 11.2], [12.4, 15.0]] : [[7.4, 7.8]].slice(1)) panel(glass, a, b, q * w + 1.2, (q + 1) * w - 1.2, z0, z2, 0.05)
    }

  // ---- the tower
  const shaft = T([[-HU, -HV], [HU, -HV], [HU, HV], [-HU, HV]])
  walls(glass, shaft, 0, PARAPET - 0.5)
  const pTop = inset(shaft, 0.4)
  walls(glass, shaft, PARAPET - 0.5, PARAPET, pTop)
  cap(roof, pTop, PARAPET)

  // Per face: a = start corner, b = end corner (counter-clockwise), L its length.
  // Faces: 0 south (end), 1 east (broad), 2 north (end), 3 west (broad).
  for (let f = 0; f < 4; f++) {
    const a = shaft[f], b = shaft[(f + 1) % 4]
    const { L, P } = onWall(a, b)
    const broad = f % 2 === 1
    const half = broad ? BAND_V : BAND_U
    const c = L / 2

    // green glass base and its peaks
    panel(green, a, b, 0, L, 7.2, PEAK_BASE, 0.05)
    const peaks: [number, number][] = broad ? [[c - BAND_V, PEAK_TIP - 3], [c + BAND_V, PEAK_TIP - 3], [c - 30, PEAK_TIP], [c + 30, PEAK_TIP]] : [[c - 8, PEAK_TIP - 3], [c + 8, PEAK_TIP - 3]]
    for (const [pc, tip] of peaks) {
      const w = broad ? 10 : 7
      // the triangle, clipped to the face
      const poly: [number, number][] = clip([[pc - w, PEAK_BASE], [pc + w, PEAK_BASE], [pc, tip]], 0, L)
      for (let i = 1; i < poly.length - 1; i++) green.tri(P(poly[0][0], poly[0][1], 0.05), P(poly[i][0], poly[i][1], 0.05), P(poly[i + 1][0], poly[i + 1][1], 0.05))
    }

    // the central dark-blue band, a little proud; above the roof where the lidar shows it
    const rise = f === 1 ? PARAPET + 0.3 : BAND_TOP
    const s0 = c - half, s1 = c + half
    const box: XY[] = [P(s0, 0, 0.3), P(s1, 0, 0.3), P(s1, 0, -0.5), P(s0, 0, -0.5)].map((q) => [q[0], q[1]] as XY)
    block(blue, blue, box, 7.2, rise, 0.2)

    // bracket lines either side of the band: a double Γ, mirrored; the
    // inner one nests lower and nearer the face's edge
    const BW = 1.0, GAP = 1.2
    for (const side of [-1, 1]) {
      const inner = side < 0 ? s0 : s1, outer = side < 0 ? 0 : L
      const mid = (inner + outer) / 2
      for (let k = 0; k < 2; k++) {
        const d = k * (BW + GAP)
        const zt = (broad ? BR_TOP : BR_TOP - 11) - d
        const xv = mid + side * d
        if (side < 0) {
          panel(blue, a, b, outer + 0.6, xv + BW, zt - BW, zt, 0.07)
          panel(blue, a, b, xv, xv + BW, BR_BOT, zt - BW, 0.07)
        } else {
          panel(blue, a, b, xv - BW, outer - 0.6, zt - BW, zt, 0.07)
          panel(blue, a, b, xv - BW, xv, BR_BOT, zt - BW, 0.07)
        }
      }
    }
  }

  // roof plant: three boxes, as the lidar and the Whpq photo show
  for (const [u0, v0, u1, v1, z] of [[1, -12, 11, 9, 104], [3, 21, 10, 30, 104.5], [3, -32, 10, -22, 104.5]])
    block(wall, roof, T(rect(u0, v0, u1, v1)), ROOF, z, 0.3)

  return [
    { part: glass, material: { ...PALETTE.window, color: 0x9fb8d6 } },
    { part: green, material: windowVariant(2, 0x6c9f98) },
    { part: blue, material: finish('seneca-blue', 0x4a63a6) },
    { part: wall, material: finish('seneca-beige', 0xe8dcc3) },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: finish('seneca-green-metal', 0x9cbcaa) },
  ]
}

/** Clip a convex polygon (s, z) to s0 <= s <= s1. */
function clip(poly: [number, number][], s0: number, s1: number): [number, number][] {
  const cut = (p: [number, number][], keep: (q: [number, number]) => boolean, at: (a: [number, number], b: [number, number]) => [number, number]) => {
    const out: [number, number][] = []
    for (let i = 0; i < p.length; i++) {
      const A = p[i], B = p[(i + 1) % p.length]
      if (keep(A)) out.push(A)
      if (keep(A) !== keep(B)) out.push(at(A, B))
    }
    return out
  }
  const atS = (s: number) => (A: [number, number], B: [number, number]): [number, number] => [s, A[1] + (B[1] - A[1]) * (s - A[0]) / (B[0] - A[0])]
  return cut(cut(poly, (q) => q[0] >= s0, atS(s0)), (q) => q[0] <= s1, atS(s1))
}

if (import.meta.main) await save('niagara-seneca-niagara-casino', 'Seneca Niagara Resort & Casino', [43.086348, -79.055729], 0, build())
