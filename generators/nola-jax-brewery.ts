/**
 * Jax Brewery (Jackson Brewing Company brewhouse, 1891), 620 Decatur Street,
 * New Orleans — procedural, CC0-1.0, no textures.
 * bun generators/nola-jax-brewery.ts
 *
 * Which building: the brewhouse with the castellated towers and the "HOME
 * OF JAX BEER" sign facing Jackson Square is OSM way/329364474 (620 Decatur
 * Street; its door is numbered 620 in the 2023 photo below). The id in the
 * assignment, way/367725763 ("The Marketplace at Jackson Brewery", 14.4 m),
 * is the separate riverside mall building 170 m upriver and is not modelled
 * here; nor is the complex's other block at 600 Decatur (way/329364466).
 * Both 600 and 620 are grouped in relation/7052913 (Q6116967), which has no
 * building tag. Wikidata's point for Q6116967 (-90.0633, 29.9561) lies
 * between them.
 *
 * Identity: a five/six-storey pale block (blue-grey panels between cream
 * pilasters and storey cornices, round-headed windows), the castellated
 * lantern tower on the Jackson Square front with corner turrets and a
 * hip-roofed lantern, the tall crenellated block on Decatur, the big red
 * "JAX" letters with "HOME OF" and "BEER" on the Jackson Square parapet,
 * the glazed pavilion on the roof terrace.
 *
 * Frame: bearing 38.7 (the walls run 38.7 / 128.7); +y toward Jackson
 * Square (St. Peter Street), −x the Decatur front, +x toward the river.
 * Anchor: the area centroid of way/329364474.
 *
 * Evidence
 * - OSM way/329364474 (outline; building=retail, 5 levels).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (2021-22), 0.5 m grid, heights above
 *   the street (2.45 abs): main parapet 23.2 (21.8 on the Jackson Square
 *   front), tall Decatur block 30.5, small upriver tower 29.4, lantern tower
 *   27 (lantern 29.5), roof pavilion 26.5 to an apex of 29.7, upriver block
 *   25 on Decatur and 15 toward the river, river annexes 11.5-13.5, the
 *   downriver-river corner 19 and its low front 11.5. The lidar shows ground
 *   where OSM draws the front corner x −12..4, y 19..25; the model follows
 *   the lidar there.
 * - Photos (Wikimedia Commons):
 *   - "Jackson Brewing Company building, New Orleans, April 2023.jpg",
 *     edenpictures, CC BY 2.0: the Decatur front, its bays, colours, windows
 *     https://commons.wikimedia.org/wiki/File:Jackson_Brewing_Company_building,_New_Orleans,_April_2023.jpg
 *   - "Jackson Brewery Bistro Bar, New Orleans.JPG", MusikAnimal, CC BY-SA
 *     4.0: the Jackson Square front, the tower, lantern, sign, pavilion
 *     https://commons.wikimedia.org/wiki/File:Jackson_Brewery_Bistro_Bar,_New_Orleans.JPG
 *   - "Jax Brewery, seen across Jackson Square (200026832).jpg", Patrick
 *     Nielsen Hayden, CC BY-SA 2.0: the same front, the sign's letters
 *     https://commons.wikimedia.org/wiki/File:Jax_Brewery,_seen_across_Jackson_Square_(200026832).jpg
 *   - "Jax Brewery New Orleans 1976 by Leon Winer.JPG", Leon Winer, CC BY-SA
 *     2.0: the river side and the towers (as a working brewery, 1976)
 *     https://commons.wikimedia.org/wiki/File:Jax_Brewery_New_Orleans_1976_by_Leon_Winer.JPG
 *   - "New Orleans, LA (French Quarter) - Home of JAX Beer sign at night.jpg",
 *     JasonParis, CC BY 2.0: the sign lit at night (red JAX, white words)
 *     https://commons.wikimedia.org/wiki/File:New_Orleans,_LA_(French_Quarter)_-_Home_of_JAX_Beer_sign_at_night.jpg
 *   - "New Orleans - Jackson Square \"JAX Brewery From Jackson Square\".jpg",
 *     David Ohmer, CC BY 2.0: the sign and front from the square
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_-_Jackson_Square_%22JAX_Brewery_From_Jackson_Square%22.jpg
 * - Published: Wikipedia, "Jackson Brewing Company (New Orleans)": brewery
 *   1890-1974, converted to shops, restaurants and flats.
 *
 * Measured: all the heights and the plan above. Estimated from the photos:
 * the bays (~5 m), storey lines (6.2, 10.6, 14.6, 18.6), the window shapes,
 * the tower's turrets and merlons, the lantern, the sign's size (JAX ~4.3 m
 * tall, ~8.6 m wide; HOME OF and BEER ~1.1 m capitals, traced as a bold
 * sans; the J's hook and the letter weights from the photos). Invented:
 * the windows on the river annexes (no recent photo of that side).
 * Left out: palms, railings, the transmission tower behind, shopfront
 * canopies, the "JACKSON BREWING COMPANY" lettering on Decatur, the bulbs
 * on the letters.
 *
 * Doubts: the river and upriver sides are drawn from the 1976 photo and
 * lidar only. The 0.4 m sign letters' depth is guessed.
 *
 * Night: the sign glows in its own colours (`neon-jax-red`, `neon-jax-white`,
 * as in the night photo), the windows glow (`window`).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, type XY } from './nyc-570-lexington'
import { archPanel, rectPanel } from './nyc-city-hall'
import { quadN, triN } from './nola-cabildo'
import { Pen, strokes } from './lettering'

type Parts = { wall: Part; trim: Part; roof: Part; win: Part; red: Part; white: Part }

/** An axis-aligned box: walls, top, optional bottom. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true, bottom = false) {
  const r: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const t = r.map(([x, y]) => [x, y, z1] as V3)
  p.loft([r, t]); if (top) p.cap(t, true); if (bottom) p.cap(r, false)
}

/** Faces of a rectangle, outside to the right of a→b. */
const faces = (x0: number, y0: number, x1: number, y1: number): [XY, XY][] => [
  [[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]],
]
const flen = ([a, b]: [XY, XY]) => Math.hypot(b[0] - a[0], b[1] - a[1])
const fpt = ([a, b]: [XY, XY], s: number, d: number, z: number): V3 => {
  const L = flen([a, b]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  return [a[0] + ux * s + uy * d, a[1] + uy * s - ux * d, z]
}
/** A block standing proud of a face: s0..s1 along, 0..d out, z0..z1. */
function fblock(p: Part, F: [XY, XY], s0: number, s1: number, d: number, z0: number, z1: number, bottom = true) {
  const r = [fpt(F, s0, -0.05, z0), fpt(F, s1, -0.05, z0), fpt(F, s1, d, z0), fpt(F, s0, d, z0)]
  const n: V3 = (() => { const q = fpt(F, 0, 1, 0), o = fpt(F, 0, 0, 0); return [q[0] - o[0], q[1] - o[1], 0] })()
  const t = r.map(([x, y]) => [x, y, z1] as V3)
  quadN(p, r[3], r[2], t[2], t[3], n)
  quadN(p, r[0], r[3], t[3], t[0], [-(r[1][0] - r[0][0]), -(r[1][1] - r[0][1]), 0])
  quadN(p, r[2], r[1], t[1], t[2], [r[1][0] - r[0][0], r[1][1] - r[0][1], 0])
  quadN(p, t[0], t[3], t[2], t[1], [0, 0, 1])
  if (bottom) quadN(p, r[0], r[1], r[2], r[3], [0, 0, -1])
}

/**
 * The brewhouse facade on one face: pale pilasters between bays, a cornice
 * band at each storey line, a tall round-headed window per bay on the
 * ground storey and paired round-headed windows above (photo: Decatur).
 */
function facade(P: Parts, F: [XY, XY], z1: number, bays: number, o: { ground?: boolean; s0?: number; s1?: number; zmin?: number } = {}) {
  const zmin = o.zmin ?? 0
  const L = flen(F), s0 = o.s0 ?? 0, s1 = o.s1 ?? L, pitch = (s1 - s0) / bays
  const storeys = [0, 6.2, 10.6, 14.6, 18.6].filter((z) => z < z1 - 3)
  for (let k = 0; k <= bays; k++) fblock(P.trim, F, s0 + k * pitch - 0.45, s0 + k * pitch + 0.45, 0.28, zmin, z1 - 0.6, false)
  for (const z of storeys.slice(1)) if (z > zmin) fblock(P.trim, F, s0, s1, 0.18, z - 0.25, z + 0.1)
  fblock(P.trim, F, s0 - 0.3, s1 + 0.3, 0.45, z1 - 0.9, z1 - 0.35) // the main cornice
  for (let k = 0; k < bays; k++) {
    const c = s0 + (k + 0.5) * pitch
    if (o.ground !== false) {
      archPanel(P.trim, F[0], F[1], c, Math.min(3.4, pitch * 0.62), 2.6, 6.0, 0.03, 6)
      archPanel(P.win, F[0], F[1], c, Math.min(2.9, pitch * 0.54), 2.8, 5.75, 0.06, 6)
      rectPanel(P.win, F[0], F[1], c, Math.min(2.4, pitch * 0.45), 0, 2.5, 0.06) // glazed doors / shopfronts
    }
    for (let i = 1; i < storeys.length; i++) {
      const zb = storeys[i] + 0.7, zt = (storeys[i + 1] ?? z1 - 1.2) - 0.6
      if (zt - zb < 1.5 || zb < zmin) continue
      const w = Math.min(2.6, pitch * 0.5)
      archPanel(P.trim, F[0], F[1], c, w + 0.35, zb - 0.15, zt + 0.2, 0.03, 4)
      archPanel(P.win, F[0], F[1], c, w, zb, zt, 0.06, 4)
      rectPanel(P.trim, F[0], F[1], c, 0.18, zb, zt - w / 2, 0.08) // the mullion between the paired lights
    }
  }
}

/** Crenellations (merlons) along the top of a rectangle. */
function merlons(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, h = 0.9, w = 0.7, gap = 0.7) {
  for (const F of faces(x0, y0, x1, y1)) {
    const L = flen(F), n = Math.max(2, Math.round((L + gap) / (w + gap)))
    const pitch = (L - w) / (n - 1)
    for (let k = 0; k < n; k++) fblock(p, F, k * pitch, k * pitch + w, -0.0, z, z + h, false)
  }
}

/** A parapet ring with a coping, thickness t, inside the rectangle. */
function parapet(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, t = 0.35) {
  box(p, x0, y0, x1, y0 + t, z0, z1); box(p, x0, y1 - t, x1, y1, z0, z1)
  box(p, x0, y0, x0 + t, y1, z0, z1); box(p, x1 - t, y0, x1, y1, z0, z1)
}

/** A hipped roof over a rectangle, eaves at z0, apex/ridge at z0 + h. */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, h: number) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, k = Math.min(x1 - x0, y1 - y0) / 2
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  const r0: V3 = x1 - x0 >= y1 - y0 ? [x0 + k, cy, z0 + h] : [cx, y0 + k, z0 + h]
  const r1: V3 = x1 - x0 >= y1 - y0 ? [x1 - k, cy, z0 + h] : [cx, y1 - k, z0 + h]
  const up: V3 = [0, 0, 1]
  if (x1 - x0 >= y1 - y0) { quadN(p, A, B, r1, r0, up); quadN(p, C, D, r0, r1, up); triN(p, B, C, r1, up); triN(p, D, A, r0, up) }
  else { quadN(p, B, C, r1, r0, up); quadN(p, D, A, r0, r1, up); triN(p, A, B, r0, up); triN(p, C, D, r1, up) }
}

/** "JAX" in its bold slab capitals, and "HOME OF" / "BEER", on the parapet facing Jackson Square (+y). */
function sign(P: Parts, yFace: number, z0: number) {
  // Letter units: cap height 1. The JAX letters lean a little, as on the sign.
  const jax = new Pen()
  jax.moveTo([0.45, 1]).lineTo([0.45, 0.22]).quadTo([0.45, 0], [0.2, 0]).lineTo([-0.05, 0.05]) // J, its hook to the left
  jax.moveTo([0.8, 0]).lineTo([1.22, 1]).lineTo([1.64, 0]) // A
  jax.moveTo([0.98, 0.36]).lineTo([1.46, 0.36])
  jax.moveTo([1.9, 1]).lineTo([2.6, 0]) // X
  jax.moveTo([2.6, 1]).lineTo([1.9, 0])
  // traced proportions (photos from the square): JAX ~3.8 m tall, ~8.6 m
  // wide; HOME OF and BEER ~1 m capitals at the foot of the J and the X
  const H = 4.3, U = 3.2, x0 = -8.7, lean = 0.0
  // seen from +y the reader's right is −x
  strokes(P.red, jax.paths, { width: 0.34, depth: 0.55, back: true, place: (u, v, w) => [x0 - (u + lean * v) * U, yFace + 0.25 + w, z0 + 0.1 + v * H] })

  // HOME OF and BEER, a bold sans, white
  const small = (word: string, start: number, h: number) => {
    const pen = new Pen()
    let u = 0
    for (const ch of word) {
      const g = new Pen()
      switch (ch) {
        case 'H': g.moveTo([0, 0]).lineTo([0, 1]); g.moveTo([0.6, 0]).lineTo([0.6, 1]); g.moveTo([0, 0.5]).lineTo([0.6, 0.5]); break
        case 'O': g.circle([0.33, 0.5], 0.33, 0.5, 10); break
        case 'M': g.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.35, 0.4]).lineTo([0.7, 1]).lineTo([0.7, 0]); break
        case 'E': g.moveTo([0.55, 1]).lineTo([0, 1]).lineTo([0, 0]).lineTo([0.55, 0]); g.moveTo([0, 0.5]).lineTo([0.45, 0.5]); break
        case 'F': g.moveTo([0.55, 1]).lineTo([0, 1]).lineTo([0, 0]); g.moveTo([0, 0.5]).lineTo([0.45, 0.5]); break
        case 'B': g.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.35, 1]).quadTo([0.58, 1], [0.58, 0.76]).quadTo([0.58, 0.52], [0.35, 0.52]).lineTo([0, 0.52]); g.moveTo([0.35, 0.52]).quadTo([0.62, 0.52], [0.62, 0.26]).quadTo([0.62, 0], [0.35, 0]).lineTo([0, 0]); break
        case 'R': g.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.35, 1]).quadTo([0.6, 1], [0.6, 0.75]).quadTo([0.6, 0.5], [0.35, 0.5]).lineTo([0, 0.5]); g.moveTo([0.3, 0.5]).lineTo([0.62, 0]); break
        default: break
      }
      const wdt = ch === ' ' ? 0.35 : ch === 'M' ? 0.7 : ch === 'O' ? 0.66 : 0.6
      pen.add(g, u, 0)
      u += wdt + 0.22
    }
    strokes(P.white, pen.paths, { width: 0.26, depth: 0.3, back: true, place: (uu, v, w) => [start - uu * h, yFace + 0.25 + w, z0 + 0.3 + v * h] })
  }
  small('HOME OF', -2.3, 1.15)
  small('BEER', -17.5, 1.1)
}

function build() {
  const P: Parts = { wall: new Part(), trim: new Part(), roof: new Part(), win: new Part(), red: new Part(), white: new Part() }
  const H = 23.0 // main parapet (lidar 23.2; the Jackson Square front 21.8)

  // ---- the masses (lidar heights above the street) -------------------------
  const X0 = -21.15, YF = 19.05 // the Decatur front, the Jackson Square front
  // main block
  box(P.wall, X0, -14.0, 16.0, YF, 0, H, false)
  box(P.roof, X0 + 0.3, -14.0, 16.0 - 0.3, YF - 0.3, H - 0.8, H - 0.79)
  parapet(P.trim, X0, -14.0, 16.0, YF, H - 0.8, H)
  // upriver block (25 on Decatur, 15 toward the river)
  box(P.wall, X0, -23.3, -4.0, -14.0, 0, 25.0, false)
  box(P.roof, X0, -23.3, -4.0, -14.0, 24.2, 24.21)
  parapet(P.trim, X0, -23.3, -4.0, -14.0, 24.2, 25.0)
  box(P.wall, -4.0, -23.3, 16.9, -14.0, 0, 15.0, false)
  box(P.roof, -4.0, -23.3, 16.9, -14.0, 14.2, 14.21)
  parapet(P.trim, -4.0, -23.3, 16.9, -14.0, 14.2, 15.0)
  // river annexes (11.5 and 13.5)
  box(P.wall, 16.9, -19.8, 24.06, -8.3, 0, 11.5)
  box(P.wall, 16.0, -8.3, 19.13, 10.0, 0, 13.5)
  // the lower downriver-river corner (19) and its low front (11.5)
  box(P.wall, 8.0, 10.0, 19.13, YF, 0, 19.0, false)
  box(P.roof, 8.0, 10.0, 19.13, YF, 18.3, 18.31)
  parapet(P.trim, 8.0, 10.0, 19.13, YF, 18.3, 19.0)
  box(P.wall, 6.0, YF, 19.13, 24.94, 0, 11.5)

  // ---- facades ------------------------------------------------------------
  facade(P, [[X0, YF], [X0, -23.3]], 23.0, 8) // Decatur
  facade(P, [[6.0, YF], [X0, YF]], 21.8, 5) // Jackson Square front (the sign stands on it)
  facade(P, [[X0, -23.3], [-4.0, -23.3]], 25.0, 3) // upriver (Toulouse), the tall part
  facade(P, [[-4.0, -23.3], [16.9, -23.3]], 15.0, 4)
  facade(P, [[16.9, -19.8], [24.06, -19.8]], 11.5, 1)
  facade(P, [[16.0, -14.0], [16.0, YF]], 23.0, 5, { ground: false, zmin: 13.5 }) // river side, above the annexes
  facade(P, [[24.06, -19.8], [24.06, -8.3]], 11.5, 2)
  facade(P, [[19.13, -8.3], [19.13, 10.0]], 13.5, 3)
  facade(P, [[19.13, 10.0], [19.13, YF]], 19.0, 2)
  facade(P, [[19.13, YF], [19.13, 24.94]], 11.5, 1)
  facade(P, [[19.13, 24.94], [6.0, 24.94]], 11.5, 3)
  facade(P, [[16.9, -23.3], [16.9, -19.8]], 15.0, 1)

  // ---- the towers ---------------------------------------------------------
  // the tall crenellated block on Decatur (lidar 30.5)
  box(P.wall, X0, -12.0, -12.0, -2.0, H, 29.6)
  box(P.trim, X0 - 0.25, -12.25, -11.75, -1.75, 29.6, 30.0)
  merlons(P.trim, X0 - 0.25, -12.25, -11.75, -1.75, 30.0, 0.8)
  for (const F of faces(X0, -12.0, -12.0, -2.0)) for (const s of [flen(F) * 0.3, flen(F) * 0.7]) {
    archPanel(P.win, F[0], F[1], s, 1.1, 24.6, 27.6, 0.05, 6)
  }
  // the small upriver tower (29.4)
  box(P.wall, -12.0, -20.0, -6.0, -15.0, 25.0, 28.6)
  merlons(P.trim, -12.25, -20.25, -5.75, -14.75, 28.6, 0.8)
  // the castellated lantern tower over the Jackson Square front (27, lantern 29.5)
  const tx0 = -2.0, tx1 = 6.0, ty0 = 12.0, ty1 = YF
  box(P.wall, tx0, ty0, tx1, ty1, 0, 26.2)
  box(P.trim, tx0 - 0.3, ty0 - 0.3, tx1 + 0.3, ty1 + 0.3, 26.2, 26.6)
  merlons(P.trim, tx0 - 0.3, ty0 - 0.3, tx1 + 0.3, ty1 + 0.3, 26.6, 0.75, 0.6, 0.6)
  for (const [cx, cy] of [[tx0, ty0], [tx1, ty0], [tx1, ty1], [tx0, ty1]]) { // corner turrets
    box(P.trim, cx - 0.55, cy - 0.55, cx + 0.55, cy + 0.55, 22.0, 27.9)
    merlons(P.trim, cx - 0.6, cy - 0.6, cx + 0.6, cy + 0.6, 27.9, 0.45, 0.35, 0.35)
  }
  for (const F of faces(tx0, ty0, tx1, ty1)) {
    const L = flen(F)
    for (const s of [L * 0.25, L * 0.5, L * 0.75]) archPanel(P.win, F[0], F[1], s, 0.95, 23.6, 25.6, 0.05, 6)
  }
  // the lantern: red-framed windows under a grey hip and a spike
  box(P.wall, 0.6, 14.3, 3.4, 17.1, 26.6, 28.3)
  for (const F of faces(0.6, 14.3, 3.4, 17.1)) rectPanel(P.trim, F[0], F[1], flen(F) / 2, 2.2, 26.8, 28.1, 0.04)
  for (const F of faces(0.6, 14.3, 3.4, 17.1)) rectPanel(P.win, F[0], F[1], flen(F) / 2, 1.7, 27.0, 27.9, 0.07)
  hip(P.roof, 0.3, 14.0, 3.7, 17.4, 28.3, 1.3)
  box(P.trim, 1.95, 15.65, 2.05, 15.75, 29.5, 31.0)
  // the glass pavilion on the roof terrace (lidar 26.5, apex 29.7)
  box(P.win, -9.6, -9.6, -0.4, 5.6, H - 0.8, 26.2, false)
  box(P.trim, -10.2, -10.2, 0.2, 6.2, 26.2, 26.5)
  hip(P.roof, -10.4, -10.4, 0.4, 6.4, 26.5, 2.4) // a grey metal hip

  // ---- the sign, facing Jackson Square ------------------------------------
  sign(P, YF, 21.8)

  finishModel('Jax Brewery', 'nola-jax-brewery', [
    { part: P.wall, material: finish('jax-blue-stucco', 0xc4d0d8) },
    { part: P.trim, material: PALETTE.trim },
    { part: P.roof, material: finish('jax-roof', 0x8f969b) },
    { part: P.win, material: PALETTE.window },
    { part: P.red, material: finish('neon-jax-red', 0xc0392f) },
    { part: P.white, material: finish('neon-jax-white', 0xfff4e0) },
  ], { bearing: 38.7, osm: 'way/329364474', height: 31.0 }, 6500)
}

if (import.meta.main) build()
