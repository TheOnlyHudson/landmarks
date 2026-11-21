/**
 * Public Service Hall (House of Justice, იუსტიციის სახლი), on the right
 * bank of the Mtkvari at 1 Zviad Gamsakhurdia Embankment, Tbilisi:
 * procedural, CC0-1.0, no textures.
 *   bun generators/tbilisi-public-service-hall.ts
 * Writes models/tbilisi-public-service-hall.glb.
 *
 * Massimiliano and Doriana Fuksas, 2012: eleven white leaf-shaped roofs
 * ("petals", "mushrooms") at heights from 15 to 33 m, overlapping like a
 * flower, carried on white tree-like columns over a cluster of four-storey
 * glass blocks. Each petal is a thick white lens: domed on top, its
 * underside rising to a thin lifted rim.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). Built in the
 * OSM-local frame of (44.8066, 41.6991) and shifted so the origin is the
 * area centroid of the outline way/1066392731, (4.6, -8.4) m from there:
 * anchor 44.806655, 41.699024, bearing 0.
 *
 * Identity, from the photos: the white petals, each a distinct leaf with a
 * thick rounded rim, stacked so the highest is in the middle and the
 * lowest to the east and south; the white branching columns under their
 * rims; green-grey glass blocks beneath with dense vertical fins.
 *
 * Evidence
 * - OSM (ODbL): outline way/1066392731 (building=public, 7 levels,
 *   roof:shape many), the stepped glass plan; way/1137055259, the same
 *   plan as a part, height 18, 4 levels; the eleven petals
 *   way/1135278408..418, building:part=roof, roof:shape dome, roof:height
 *   3, each with min_height/height (m): 408 24/27, 409 21/24, 410 15/18,
 *   411 18/21, 412 21/24, 413 21/24, 414 18/21, 415 24/27, 416 27/30,
 *   417 18/21, 418 30/33. The petals' plans are drawn exactly from these
 *   outlines (resampled to 22 points), their heights from these tags.
 * - Published: Studio Fuksas (https://fuksas.com/tbilisi-public-service-hall/
 *   and Dezeen, 15 Oct 2012): eleven petals up to 35 m across on
 *   tree-trunk-like pillars, seven glazed volumes, 42,000 m² gross,
 *   "leaves" 24,800 m², a hall 35 m high under the canopy.
 * - Photos (all evidence):
 *   - "Tbilisi Public Service Hall Building IMG 8999 1920.jpg", Alexxx1979,
 *     CC BY-SA 4.0 (Commons): from Mtatsminda, high, from the south-west;
 *     the petals' overlap and order of heights, the lifted rims, the
 *     glass blocks between, the columns along the river front
 *     https://commons.wikimedia.org/wiki/File:Tbilisi_Public_Service_Hall_Building_IMG_8999_1920.jpg
 *   - "Public Service Hall (34559549093).jpg", Max Benidze, CC BY-SA 2.0:
 *     the river front at street level; a petal's section (thick white
 *     lens, the underside rising to the rim), the twin-trunk columns with
 *     raking branches, the four-storey glass blocks with vertical fins
 *     https://commons.wikimedia.org/wiki/File:Public_Service_Hall_(34559549093).jpg
 *   - "Tbilisi13.jpg", BBCLCD, CC BY-SA 4.0, and "2016 Tbilisi, Widoki z
 *     Twierdzy Narikala (05).jpg", Marcin Konsek, CC BY-SA 4.0: from
 *     Narikala, the canopy from the south-east
 *     https://commons.wikimedia.org/wiki/File:Tbilisi13.jpg
 *     https://commons.wikimedia.org/wiki/File:2016_Tbilisi,_Widoki_z_Twierdzy_Narikala_(05).jpg
 *   - "თბილისის იუსტიციის სახლი-Tbilisi Justic House 08, 10, 12.jpg",
 *     Davit butulashvili, CC BY-SA 4.0: the glass blocks and entrance
 *     https://commons.wikimedia.org/wiki/File:%E1%83%97%E1%83%91%E1%83%98%E1%83%9A%E1%83%98%E1%83%A1%E1%83%98%E1%83%A1_%E1%83%98%E1%83%A3%E1%83%A1%E1%83%A2%E1%83%98%E1%83%AA%E1%83%98%E1%83%98%E1%83%A1_%E1%83%A1%E1%83%90%E1%83%AE%E1%83%9A%E1%83%98-Tbilisi_Justic_House_12.jpg
 *   - "Ministry of Justice of Georgia. Tbilisi (50503019008).jpg" and
 *     others of that set, Andrew Milligan sumo, CC BY 2.0: inside, the
 *     white tree columns rising through the hall to the petals' undersides
 *     https://commons.wikimedia.org/wiki/File:Ministry_of_Justice_of_Georgia._Tbilisi_(50503019008).jpg
 * - Terrain (Mapterhorn z12): 2.5 to 3.5 m round the site with a 7 m bump
 *   over the building itself (the building in the z12 surface). The real
 *   site is a level embankment.
 *
 * Numbers
 * - Petal plans: measured (OSM outlines, resampled to 22 points, 40 in
 *   the detail model, smoothed once). Petal tops at the OSM `height`
 *   (18 to 33 m).
 * - Petal section: a domed cap 6 m thick at the crown (against OSM's
 *   roof:height 3): the top domes 4.4 m over a 1 m rim, the underside
 *   sags 0.6 m at the centre, so the rim droops all round: estimated from
 *   Benidze's photo at 17.5 px/m (four storeys = 16 m) and the Narikala
 *   views. The crown sits at OSM's height less 1 m, or higher where that
 *   would cut the glass volume below (rim then about 1 m over it). Each
 *   petal tilts 2.5 m up toward its outer end, the opening flower of
 *   Alexxx1979's photo.
 * - The oculus in the highest petal (way/1135278418): seen in the photos
 *   from Narikala and Mtatsminda, size estimated (a fifth of the petal).
 * - Glass: the OSM plan (a union of rectangles turned 8.5 deg) split into
 *   seven volumes, as Fuksas describes and the photos show, stepping
 *   11.5 to 17 m (OSM part: 18 m, 4 levels; Benidze's photo about 16 m
 *   for the river-front volumes); per-volume heights estimated from the
 *   photos. Broad glass with two or three thin pale horizontal bands (the
 *   ground floor's head, a middle band on volumes 14 m and over, the
 *   top); fine vertical fins only in the detail model.
 * - Columns: one white tree per petal, halfway out toward its outer end
 *   (under the centre of the highest one), twin trunks
 *   (0.75 m radius, drawn bold) branching 7 m below the underside into
 *   three arms 8 m long (0.6 m radius):
 *   positions estimated (the real trees also stand under the rims).
 * - Colours: petals white #f2f2ee (Alexxx1979, sunlit); glass dark
 *   reflective blue-grey #5d6f78 (sunlit, in all three photos), `window`;
 *   oculus #55707e.
 * - Terrain check (z12): ok.
 *
 * Doubts
 * - The seven volumes' split and heights are read from the photos, not
 *   from drawings; the real ones have gaps and a tall open hall between.
 * - The real petal count and plan follow OSM; the rim lift and the trees'
 *   positions are estimated.
 * - Night: the glass is `window` (the hall is lit and open late). No
 *   licensed night photo was found, so the petals are left unlit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { tube } from './bridge-kit'

type XY = [number, number]
const OX = 4.6, OY = -8.4

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crossv = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const norm = (a: V3): V3 => scale(a, 1 / (Math.hypot(...a) || 1))

// ---- OSM (metres in the frame of 44.8066, 41.6991) ----
/** The OSM plan of the glass (way/1066392731), for reference; drawn as VOLUMES below. */
export const BLOCK: XY[] = [[-43.7, 16.9], [-31.0, 18.8], [-34.0, 38.5], [-19.5, 40.6], [-21.8, 56.0], [9.4, 60.7], [12.4, 41.2], [22.5, 42.8], [26.9, 13.9], [42.0, 16.2], [52.8, -54.4], [45.3, -55.6], [27.1, -58.3], [28.8, -69.5], [0.0, -73.9], [-3.2, -53.4], [-20.9, -56.1], [-26.1, -22.1], [-37.5, -23.8], [-38.7, -16.2]]

type Petal = { id: string; lo: number; hi: number; pts: XY[] }
const PETALS: Petal[] = [
  { id: '408', lo: 24, hi: 27, pts: [[-27.4, 37.0], [-27.1, 53.3], [-24.0, 65.7], [-17.6, 76.9], [-9.2, 84.6], [0.2, 89.3], [6.4, 89.5], [11.5, 84.4], [13.4, 77.0], [14.2, 69.6], [13.6, 56.7], [12.9, 53.3], [11.1, 45.3], [9.8, 35.4], [5.3, 23.2], [-4.9, 12.1], [-16.3, 8.0], [-17.5, 9.3], [-24.8, 17.3]] },
  { id: '409', lo: 21, hi: 24, pts: [[-9.1, 37.0], [3.4, 47.5], [12.9, 53.3], [21.3, 60.3], [33.4, 64.8], [44.1, 63.2], [48.5, 58.5], [48.5, 52.9], [44.8, 45.7], [40.5, 39.9], [31.4, 29.3], [24.2, 21.3], [16.8, 14.4], [5.6, 7.8], [-9.3, 5.5], [-17.5, 9.3], [-18.8, 20.7]] },
  { id: '410', lo: 15, hi: 18, pts: [[33.2, 29.4], [41.0, 27.7], [48.1, 23.6], [59.0, 5.8], [65.6, -6.6], [68.4, -17.9], [68.5, -24.3], [64.0, -30.1], [53.7, -30.2], [43.9, -27.0], [32.2, -18.1], [22.9, -12.3], [14.3, -6.9], [6.1, 2.7], [4.1, 14.6], [7.0, 21.8], [15.8, 28.1]] },
  { id: '411', lo: 18, hi: 21, pts: [[16.2, -10.6], [26.1, -12.5], [40.1, -20.3], [51.1, -30.5], [60.0, -41.6], [63.0, -52.1], [60.6, -57.6], [55.6, -61.5], [47.5, -63.8], [38.7, -63.5], [25.2, -59.9], [14.9, -56.0], [6.7, -50.5], [-1.6, -43.1], [-6.8, -30.5], [-7.1, -19.6], [-0.9, -9.9]] },
  { id: '412', lo: 21, hi: 24, pts: [[13.8, 2.7], [20.0, 4.8], [33.4, 2.1], [46.4, -4.5], [55.3, -15.7], [58.2, -26.2], [55.8, -31.7], [50.8, -35.5], [41.9, -36.5], [33.4, -35.3], [20.8, -31.4], [12.3, -26.1], [5.7, -20.5], [3.4, -16.7], [3.0, -12.8], [3.0, -7.4], [4.8, -4.3], [9.6, -0.1]] },
  { id: '413', lo: 21, hi: 24, pts: [[24.8, -31.6], [28.1, -40.4], [30.3, -53.1], [32.8, -67.7], [30.4, -82.6], [24.7, -87.3], [18.8, -89.0], [13.7, -87.9], [7.0, -83.9], [0.3, -75.9], [-4.6, -66.1], [-7.8, -55.7], [-8.1, -45.9], [-6.5, -34.7], [-0.2, -23.2], [7.3, -19.7], [14.3, -23.7]] },
  { id: '414', lo: 18, hi: 21, pts: [[14.0, -32.9], [8.2, -40.3], [-1.4, -48.8], [-13.7, -57.1], [-26.3, -61.8], [-33.7, -62.1], [-38.3, -58.0], [-40.0, -53.1], [-39.0, -45.4], [-34.1, -36.1], [-28.8, -28.5], [-20.3, -19.0], [-12.2, -13.9], [-2.6, -10.3], [8.7, -8.8], [15.0, -11.8], [16.5, -19.4]] },
  { id: '415', lo: 24, hi: 27, pts: [[-2.7, -22.0], [-12.0, -24.2], [-24.9, -24.8], [-39.7, -25.5], [-53.1, -20.1], [-58.4, -15.0], [-59.3, -9.0], [-57.0, -4.2], [-52.2, 1.8], [-43.9, 7.6], [-33.6, 11.2], [-22.8, 13.1], [-13.0, 12.1], [-1.9, 9.2], [8.7, 1.6], [11.4, -6.2], [6.5, -12.7]] },
  { id: '416', lo: 27, hi: 30, pts: [[-29.5, 11.1], [-37.5, 16.1], [-47.3, 25.5], [-55.3, 38.6], [-57.9, 53.0], [-54.2, 59.4], [-49.1, 62.9], [-43.9, 63.5], [-36.3, 61.9], [-27.8, 56.1], [-19.5, 48.9], [-13.0, 40.1], [-9.5, 31.0], [-7.3, 19.8], [-8.8, 12.0], [-16.1, 7.2], [-20.7, 8.0]] },
  { id: '417', lo: 18, hi: 21, pts: [[-47.2, -17.1], [-52.5, -9.3], [-57.7, 2.4], [-62.2, 16.7], [-64.1, 30.9], [-60.3, 37.1], [-54.9, 40.0], [-49.7, 40.1], [-42.3, 37.9], [-33.9, 31.6], [-26.8, 23.3], [-21.3, 13.9], [-18.7, 4.4], [-17.5, -6.9], [-20.9, -19.4], [-27.3, -24.6], [-35.2, -22.4]] },
  { id: '418', lo: 30, hi: 33, pts: [[-12.6, -11.0], [-16.0, -4.0], [-16.6, 5.2], [-16.3, 18.3], [-13.1, 33.3], [-9.4, 40.1], [-1.8, 46.2], [4.9, 46.8], [10.3, 44.5], [17.3, 38.3], [22.6, 27.6], [23.3, 16.8], [23.2, 6.0], [19.8, -3.0], [15.4, -11.9], [10.6, -19.7], [2.0, -23.4], [-4.4, -21.0]] },
]

const shift = (p: XY): XY => [p[0] - OX, p[1] - OY]
const area = (r: XY[]) => r.reduce((s, p, i) => s + p[0] * r[(i + 1) % r.length][1] - r[(i + 1) % r.length][0] * p[1], 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
function centroid(r: XY[]): XY {
  let a = 0, cx = 0, cy = 0
  for (let i = 0; i < r.length; i++) {
    const p = r[i], q = r[(i + 1) % r.length], c = p[0] * q[1] - q[0] * p[1]
    a += c; cx += (p[0] + q[0]) * c; cy += (p[1] + q[1]) * c
  }
  return [cx / (3 * a), cy / (3 * a)]
}
/** `n` points evenly spaced round a closed ring, smoothed once (the OSM traces are hand-drawn). */
function resample(r: XY[], n: number): XY[] {
  const L = [0]
  for (let i = 1; i <= r.length; i++) L.push(L[i - 1] + Math.hypot(r[i % r.length][0] - r[i - 1][0], r[i % r.length][1] - r[i - 1][1]))
  const out: XY[] = []
  let k = 1
  for (let j = 0; j < n; j++) {
    const s = (L[L.length - 1] * j) / n
    while (L[k] < s) k++
    const t = (s - L[k - 1]) / (L[k] - L[k - 1] || 1), a = r[k - 1], b = r[k % r.length]
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out.map((p, i) => {
    const a = out[(i - 1 + n) % n], b = out[(i + 1) % n]
    return [0.5 * p[0] + 0.25 * (a[0] + b[0]), 0.5 * p[1] + 0.25 * (a[1] + b[1])] as XY
  })
}

type Parts = { petal: Part; glass: Part; trim: Part; roof: Part; oculus: Part }

// ---- a petal: a thick domed cap, its rim drooping ----
const RIM = 1.0, DOME = 4.4, CROWN = 6.0, TILT = 2.5, CURL = 0.0
/** The canopy's middle, near the highest petal (418), in the model frame. */
const HUB: XY = [-1.6, 14.0]
function petal(P: Parts, pt: Petal, n: number, tTop: number[], tBot: number[]) {
  const ring = resample(ccw(pt.pts), n).map(shift)
  const c = centroid(ring)
  // The top at the centre: OSM's height less 1 m, but never so low that
  // the rim would cut into the glass volume under the petal's centre.
  const crownTop = Math.max(pt.hi - 1, volumeTopAt(c) + CROWN + 0.6)
  const rimTop = crownTop - DOME, rimBot = rimTop - RIM
  const at = (k: number, t: number): XY => [c[0] + (ring[k][0] - c[0]) * t, c[1] + (ring[k][1] - c[1]) * t]
  const zb0 = (t: number) => rimBot - (CROWN - DOME - RIM) * (1 - t * t)
  const zt0 = (t: number) => rimTop + DOME * (1 - t * t) ** 0.7
  // The petals open like a flower: each tilts up toward its outer end
  // (away from the middle of the canopy), whose rim curls up a little more.
  const off = Math.hypot(c[0] - HUB[0], c[1] - HUB[1])
  const d: XY = off > 8 ? [(c[0] - HUB[0]) / off, (c[1] - HUB[1]) / off] : [0, 0]
  const R = Math.max(...ring.map((p) => Math.abs((p[0] - c[0]) * d[0] + (p[1] - c[1]) * d[1])), 1)
  const dz = (x: number, y: number) => {
    const u = ((x - c[0]) * d[0] + (y - c[1]) * d[1]) / R
    return TILT * u + CURL * Math.max(0, u) ** 3
  }
  let kNow = 0
  const zb = (t: number) => zb0(t) + dz(...at(kNow, t))
  const zt = (t: number) => zt0(t) + dz(...at(kNow, t))
  // a surface grid: rows over t, columns round the ring; normals from the grid
  const surface = (ts: number[], z: (t: number) => number, up: boolean) => {
    const G: V3[][] = ts.map((t) => ring.map((_, k) => { kNow = k; return [...at(k, t), z(t)] as V3 }))
    const N: V3[][] = G.map((row, i) => row.map((p, k) => {
      const du = subv(row[(k + 1) % n], row[(k - 1 + n) % n])
      const i0 = Math.max(i - 1, 0), i1 = Math.min(i + 1, G.length - 1)
      let dv = subv(G[i1][k], G[i0][k])
      if (i === 0) dv = subv(G[1][k], [c[0], c[1], z(0)] as V3) // z(0) has no tilt: at the centre dz = 0
      let nn = norm(crossv(du, dv))
      if ((nn[2] > 0) !== up) nn = scale(nn, -1)
      if (i === 0) nn = up ? [0, 0, 1] : [0, 0, -1]
      return nn
    }))
    const cen: V3 = [c[0], c[1], z(0)], cn: V3 = up ? [0, 0, 1] : [0, 0, -1]
    for (let k = 0; k < n; k++) {
      const l = (k + 1) % n
      P.petal.tri(cen, G[0][k], G[0][l], undefined, undefined, undefined, [cn, N[0][k], N[0][l]])
      for (let i = 0; i < G.length - 1; i++) {
        P.petal.tri(G[i][k], G[i + 1][k], G[i + 1][l], undefined, undefined, undefined, [N[i][k], N[i + 1][k], N[i + 1][l]])
        P.petal.tri(G[i][k], G[i + 1][l], G[i][l], undefined, undefined, undefined, [N[i][k], N[i + 1][l], N[i][l]])
      }
    }
    return G
  }
  const top = surface(tTop, zt, true)
  if (pt.id === '418') {
    // the oculus: a dark glazed ellipse let into the crown of the highest petal
    const ts = [0, 0.1, 0.2]
    const ring2 = ts.map((t) => ring.map((_, k) => { kNow = k; return [...at(k, t), zt(t) + 0.08] as V3 }))
    for (let k = 0; k < n; k++) {
      const l = (k + 1) % n
      P.oculus.tri(ring2[0][0], ring2[1][k], ring2[1][l])
      P.oculus.quad(ring2[1][k], ring2[2][k], ring2[2][l], ring2[1][l])
    }
  }
  const bot = surface(tBot, zb, false)
  // the rounded rim: from the underside's edge, out a little and up to the top's edge
  const T = top[top.length - 1], B = bot[bot.length - 1]
  for (let k = 0; k < n; k++) {
    const l = (k + 1) % n
    const out = (p: V3): V3 => norm([p[0] - c[0], p[1] - c[1], 0])
    const mid = (a: V3, b: V3): V3 => add(scale(add(a, b), 0.5), scale(out(a), 0.25))
    const Mk = mid(B[k], T[k]), Ml = mid(B[l], T[l])
    const nk = out(B[k]), nl = out(B[l])
    const nb = (v: V3): V3 => norm(add(v, [0, 0, -0.8])), nt = (v: V3): V3 => norm(add(v, [0, 0, 0.8]))
    P.petal.tri(B[k], B[l], Ml, undefined, undefined, undefined, [nb(nk), nb(nl), nl])
    P.petal.tri(B[k], Ml, Mk, undefined, undefined, undefined, [nb(nk), nl, nk])
    P.petal.tri(Mk, Ml, T[l], undefined, undefined, undefined, [nk, nl, nt(nl)])
    P.petal.tri(Mk, T[l], T[k], undefined, undefined, undefined, [nk, nt(nl), nt(nk)])
  }
  const under = (x: number, y: number, t: number) => zb0(t) + dz(x, y)
  // where the tree stands: out toward the petal's outer end, under its rim,
  // so it stands clear of the glass as in the street photo
  const foot: XY = [c[0] + d[0] * R * 0.5, c[1] + d[1] * R * 0.5]
  return { c: foot, under }
}

// ---- the white tree columns ----
function tree(P: Parts, c: XY, underAt: (x: number, y: number, t: number) => number, reach: number, sides: number, seed: number) {
  const under = underAt(c[0], c[1], 0.3)
  const fork = Math.max(under - 7, 4)
  for (const dx of [-0.8, 0.8]) tube(P.petal, [[c[0] + dx, c[1], 0.3], [c[0] + dx, c[1], fork + 0.4]], 0.75, sides)
  for (let j = 0; j < 3; j++) {
    const a = seed + (j * 2 * Math.PI) / 3
    const ex = c[0] + reach * Math.cos(a), ey = c[1] + reach * Math.sin(a)
    tube(P.petal, [[c[0], c[1], fork], [ex, ey, underAt(ex, ey, 0.45) + 0.6]], 0.6, sides)
  }
}

// ---- the glass volumes ----
// The OSM plan is a union of rectangles turned 8.5 deg; here it is split
// into the seven glazed volumes the photos show, each with its own height.
const ROT = (8.5087 * Math.PI) / 180
type Vol = { u0: number; u1: number; v0: number; v1: number; h: number }
const VOLUMES: Vol[] = [
  { u0: -13.3, u1: 18.3, v0: 43.1, v1: 58.6, h: 16 }, // north, on the river front
  { u0: -27.9, u1: 28.6, v0: 23.2, v1: 43.1, h: 13 }, // north-centre
  { u0: -40.7, u1: -27.9, v0: -18.0, v1: 23.2, h: 12 }, // west wing
  { u0: -27.9, u1: 28.6, v0: -18.0, v1: 23.2, h: 17 }, // the central hall's block
  { u0: 28.6, u1: 43.9, v0: -61.6, v1: 9.8, h: 11.5 }, // east, under the lowest petal
  { u0: -29.1, u1: 28.6, v0: -52.4, v1: -18.0, h: 15 }, // south-centre
  { u0: -10.9, u1: 28.6, v0: -73.0, v1: -52.4, h: 13 }, // south
]
const toModel = (u: number, v: number): XY => shift([u * Math.cos(ROT) - v * Math.sin(ROT), u * Math.sin(ROT) + v * Math.cos(ROT)])
function volumeTopAt(p: XY): number {
  const x = p[0] + OX, y = p[1] + OY
  const u = x * Math.cos(ROT) + y * Math.sin(ROT), v = -x * Math.sin(ROT) + y * Math.cos(ROT)
  for (const b of VOLUMES) if (u >= b.u0 && u <= b.u1 && v >= b.v0 && v <= b.v1) return b.h
  return 0
}
function block(P: Parts, finStep: number) {
  for (const V of VOLUMES) {
    const e = 0.05
    const r: XY[] = [toModel(V.u0 + e, V.v0 + e), toModel(V.u1 - e, V.v0 + e), toModel(V.u1 - e, V.v1 - e), toModel(V.u0 + e, V.v1 - e)]
    const H = V.h
    // broad glass with a few strong horizontal bands: the ground floor's
    // head, a middle band on the taller volumes, and the top
    const bands: [number, number][] = [[4.6, 5.05], [H - 0.45, H + 0.2]]
    if (H >= 14) bands.push([(4.5 + H) / 2 - 0.22, (4.5 + H) / 2 + 0.22])
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4]
      P.glass.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], H], [a[0], a[1], H])
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      const t: V3 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len, 0]
      const o: V3 = [t[1], -t[0], 0] // outward for a CCW ring
      for (const [z0, z1] of bands) slab(P.trim, a, b, o, z0, z1, 0.3)
      // fine fins in the detail model only
      if (finStep > 0) {
        const nf = Math.floor(len / finStep)
        for (let f = 1; f <= nf; f++) {
          const s2 = (len * f) / (nf + 1)
          fin(P.glass, [a[0] + t[0] * s2, a[1] + t[1] * s2], t, o, H - 0.7)
        }
      }
    }
    P.roof.quad([r[0][0], r[0][1], H], [r[1][0], r[1][1], H], [r[2][0], r[2][1], H], [r[3][0], r[3][1], H])
  }
}
/** A band along a wall from a to b, `d` proud of it. */
function slab(p: Part, a: XY, b: XY, o: V3, z0: number, z1: number, d: number) {
  const A0: V3 = [a[0], a[1], z0], B0: V3 = [b[0], b[1], z0]
  const A1 = add(A0, scale(o, d)), B1 = add(B0, scale(o, d))
  p.quad(A1, B1, add(B1, [0, 0, z1 - z0]), add(A1, [0, 0, z1 - z0]))
  p.quad(add(A0, [0, 0, z1 - z0]), add(A1, [0, 0, z1 - z0]), add(B1, [0, 0, z1 - z0]), add(B0, [0, 0, z1 - z0]))
  p.quad(A0, B0, B1, A1)
}
function fin(p: Part, at: XY, t: V3, o: V3, h: number) {
  const w = 0.1, d = 0.25
  const a0: V3 = [at[0] - t[0] * w, at[1] - t[1] * w, 0], a1: V3 = [at[0] + t[0] * w, at[1] + t[1] * w, 0]
  const b0 = add(a0, scale(o, d)), b1 = add(a1, scale(o, d))
  const up: V3 = [0, 0, h]
  p.quad(b0, b1, add(b1, up), add(b0, up))
  p.quad(a0, b0, add(b0, up), add(a0, up))
  p.quad(b1, a1, add(a1, up), add(b1, up))
}

function build(detail: boolean): Parts {
  const P: Parts = { petal: new Part(), glass: new Part(), trim: new Part(), roof: new Part(), oculus: new Part() }
  const n = detail ? 40 : 22
  const tTop = detail ? [0.2, 0.4, 0.58, 0.72, 0.84, 0.93, 1] : [0.35, 0.65, 0.88, 1]
  const tBot = detail ? [0.3, 0.55, 0.75, 0.9, 1] : [0.55, 0.85, 1]
  PETALS.forEach((pt, i) => {
    const { c, under } = petal(P, pt, n, tTop, tBot)
    tree(P, c, under, 8, detail ? 8 : 5, i * 0.9)
  })
  block(P, detail ? 2.0 : 0)
  return P
}

const PETAL = finish('petal-white', 0xf2f2ee, 0.6)
const WINDOW = { name: 'window', color: 0x5d6f78, roughness: 0.35 }
const OCULUS = PALETTE.glass
const TRIM = PALETTE.trim
const ROOF = PALETTE.roof

if (import.meta.main) {
  for (const [file, P, maxT, maxB] of [
    ['tbilisi-public-service-hall.glb', build(false), 6500, 250 * 1024],
    ['tbilisi-public-service-hall.detail.glb', build(true), 40000, 1536 * 1024],
  ] as const) {
    const l = [
      { part: P.petal, material: PETAL },
      { part: P.glass, material: WINDOW },
      { part: P.trim, material: TRIM },
      { part: P.roof, material: ROOF },
      { part: P.oculus, material: { ...OCULUS, color: 0x55707e } },
    ]
    let tris = 0
    for (const { part } of l) tris += part.triangles
    console.log(file, l.map((e) => `${e.material.name}:${e.part.triangles}`).join(' '))
    if (tris > maxT) throw new Error(`${file}: ${tris} triangles, over ${maxT}`)
    const glb = writeGlb('Public Service Hall', l, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid', bearing: 0, elevation: 0 })
    if (glb.length > maxB) throw new Error(`${file}: ${glb.length} bytes, over ${maxB}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
