/**
 * Metekhi Church of the Assumption, with the equestrian statue of King
 * Vakhtang I Gorgasali beside it, on the Metekhi cliff over the Mtkvari,
 * Tbilisi: procedural, CC0-1.0, no textures.
 *   bun generators/tbilisi-metekhi-church.ts
 *
 * One model for the two: they share the cliff-top site, the statue on its
 * terrace 45 m west-north-west of the church, facing the Metekhi bridge and
 * the old town it points to.
 *
 * Frame: x along the church's axis (towards its apses), y to its north, z
 * up, metres. Placed at bearing 4.9 (the OSM outline's long walls run to
 * compass 94.9); the origin is the area centroid of the church's outline
 * way/1064270003, OSM-local (3.8, -6.5) m from (44.8112, 41.6902): anchor
 * 44.811246, 41.690141.
 *
 * Identity: a compact, almost square cross-domed church of buff ashlar,
 * one broad gable to the west and transept gables north and south, a short
 * twelve-sided brick drum ringed with blind arches under a grey
 * twelve-sided cone; three tall round apses to the east, the middle one
 * the tallest, with brick cornices and conical caps; a small gabled gate
 * porch with arches on the north. The statue: the king on a walking horse,
 * its head bowed and a foreleg raised, his right hand raised high in
 * greeting, the left on the reins, the sword at the horse's flank, on a
 * tall plain grey pedestal.
 *
 * Evidence
 * - OSM (ODbL): church way/1064270003 (16.3 x 16 m body, three apse bulges
 *   on the east wall), parts way/40851972 (body), way/1207173726 (drum,
 *   cone roof, 7.7 m across), way/1207173723..25 (the three apses),
 *   way/1064270002 (the north porch, building:part=roof, gabled); the
 *   statue's pedestal way/1062990549 (historic=memorial, statue=equestrian,
 *   height 5.8, about 6 x 5 m with its steps).
 * - Published: Wikipedia "Metekhi" (church built c. 1278-1284 under
 *   Demetrius II; statue by Elguja Amashukeli, 1961/67); de.wikipedia
 *   "Denkmal für König Wachtang I. Gorgassali": right hand raised in
 *   greeting towards the city, the left on the reins, the sword sheathed at
 *   the horse's flank, a black horse, on a masonry pedestal.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Metekhi church and Vakhtang Gorgasali's statue Tbilisi.jpg",
 *     Radosław Botev, CC BY 3.0 pl: the west front and the statue; heights
 *     scaled from the 16 m front at 0.097 m/px: corner eaves 10.7, gable
 *     16, drum 7 across, its cornice 20, cone apex 24, cross top 25.5
 *     https://commons.wikimedia.org/wiki/File:Metekhi_church_and_Vakhtang_Gorgasali%27s_statue_Tbilisi.jpg
 *   - "Metekhi Church in Old Tbilisi, Georgia 02.JPG", Kober, CC BY-SA 4.0:
 *     the west front close up, the brick drum's arcade, the north porch
 *     https://commons.wikimedia.org/wiki/File:Metekhi_Church_in_Old_Tbilisi,_Georgia_02.JPG
 *   - "Metekhi church Tbilisi eastern facade.jpg", Mikhail Daneliya, CC0:
 *     the three apses
 *     https://commons.wikimedia.org/wiki/File:Metekhi_church_Tbilisi_eastern_facade.jpg
 *   - "Metekhi church, southern facade, as seen from the right bank of the
 *     Kura ...", "Metekhi church, view from the north ...", "... view from
 *     the north-east ...", "... View from the east.jpg", Kober, CC0
 *     https://commons.wikimedia.org/wiki/File:Metekhi_church,_view_from_the_north._Tbilisi,_Georgia._July_2023.jpg
 *   - "Metekhi church, tbilisi.JPG", Kober, public domain: north-west
 *     corner, the porch's arch, colours
 *     https://commons.wikimedia.org/wiki/File:Metekhi_church,_tbilisi.JPG
 *   - "Gorgasali.jpg", Vladimer Shioshvili, CC BY-SA 2.0 (the statue in
 *     profile: the walking horse, head bowed, a foreleg raised);
 *     "Statue of Gorgasali.JPG", Abramia Giorgi, CC BY-SA 4.0 and
 *     "Vakhtang Gorgasali monument - panoramio.jpg", Ivan Z, CC BY-SA 3.0
 *     (front and three-quarter, the raised hand, the pedestal)
 *     https://commons.wikimedia.org/wiki/File:Gorgasali.jpg
 *     https://commons.wikimedia.org/wiki/File:Statue_of_Gorgasali.JPG
 *     https://commons.wikimedia.org/wiki/File:Vakhtang_Gorgasali_monument_-_panoramio.jpg
 *
 * Numbers: plan measured from OSM. Heights estimated from Botev's photo
 * (above). The statue estimated against its pedestal: pedestal 4.5 m with its 0.5 m step (OSM
 * height 5.8, which may count the step and the terrace kerb), horse and rider 2.6 x life, the raised
 * hand 6.6 m over the pedestal. Colours: the warm yellow-brown rubble stone
 * as sunlit in the photos (#b39a74; samples #bba88e..#c1b58e), the brick drum and cornices, the dark bronze.
 *
 * Doubts and terrain: the cliff and the statue's walled terrace are ground
 * and are not modelled; the pedestal stands on the church's own level,
 * which the photos show to be about the same. Mapterhorn here is z12 only
 * and smears the 20 m cliff across both: it puts the statue's ground about
 * 10 m below the church's, so the map sinks the church into its smeared
 * hill. The model is kept true to the photos (see docs/evidence.md,
 * "Terrain that is wrong for the site"). The statue's face, helmet and the
 * reins' fine work are simplified; the horse's raised foreleg is its right
 * one (from the profile photo; the other side is not photographed).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { lathe, prism, box, type XY } from './sf-de-young'
import { quadOut, triOut, beam } from './moscow-church-kit'
import { smooth, ellipsoid, tube, slab, solid } from './nyc-columbus-monument'
import { gabled, faceOf, at, holedWall, archRing, archBand, pilaster, win, writeModel, type Face } from './tbilisi-holy-trinity-cathedral'

const PITCH_W = (16 - 10.7) / 8 // the broad west gable's slope

/** A tube along a Catmull-Rom curve through `pts`, radii eased between them (limbs). */
export function stube(q: Part, pts: V3[], radii: number[], sides: number, sub = 3) {
  if (pts.length < 3) return tube(q, pts, radii, sides)
  const path: V3[] = [], rad: number[] = []
  const P = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2)
    for (let k = 0; k < sub; k++) {
      const t = k / sub, t2 = t * t, t3 = t2 * t
      path.push([0, 1, 2].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)) as V3)
      const e = (1 - Math.cos(t * Math.PI)) / 2
      rad.push(radii[i] + (radii[i + 1] - radii[i]) * e)
    }
  }
  path.push(pts[pts.length - 1]); rad.push(radii[radii.length - 1])
  tube(q, path, rad, sides)
}

/** A half round apse on the east wall x = x0, centred at y = yc: wall to ze, a half cone to `apex`. */
function roundApse(wall: Part, roof: Part, band: Part, x0: number, yc: number, r: number, ze: number, rise: number, seg: number) {
  const ts = Array.from({ length: seg + 1 }, (_, k) => -Math.PI / 2 + (Math.PI * k) / seg)
  const P = (t: number, rr: number, z: number): V3 => [x0 + rr * Math.cos(t), yc + rr * Math.sin(t), z]
  for (let k = 0; k < seg; k++) {
    const a = ts[k], b = ts[k + 1], m = (a + b) / 2, n: V3 = [Math.cos(m), Math.sin(m), 0]
    quadOut(wall, P(a, r, 0), P(b, r, 0), P(b, r, ze - 0.9), P(a, r, ze - 0.9), n)
    // the brick cornice: a band corbelled out under the cap
    quadOut(band, P(a, r, ze - 0.9), P(b, r, ze - 0.9), P(b, r + 0.25, ze - 0.5), P(a, r + 0.25, ze - 0.5), [n[0], n[1], -0.5])
    quadOut(band, P(a, r + 0.25, ze - 0.5), P(b, r + 0.25, ze - 0.5), P(b, r + 0.25, ze), P(a, r + 0.25, ze), n)
    quadOut(roof, P(a, r + 0.25, ze), P(b, r + 0.25, ze), [x0, yc, ze + rise], [x0, yc, ze + rise], [n[0], n[1], 1])
    triOut(roof, P(a, r + 0.25, ze), P(b, r + 0.25, ze), [x0, yc, ze + rise], [n[0], n[1], 1])
  }
}

export function build(detail: boolean) {
  const stone = new Part(), brick = new Part(), roof = new Part(), glaze = new Part(), bronze = new Part(), granite = new Part()
  const SEG = detail ? 8 : 6

  // ---- The church -----------------------------------------------------
  const X0 = -9.38, X1 = 6.94, Y0 = -8.97, Y1 = 7.05, YC = (Y0 + Y1) / 2
  const DC: XY = [-1.0, -1.05] // the drum's centre
  const ZE = 10.7, ZR = 16.0
  gabled({ wall: stone, roof, x0: X0, x1: X1, y0: Y0, y1: Y1, ze: ZE, zr: ZR, axis: 'x', ov: 0.35 })
  // the transept: gables north and south, eaves where the broad roof meets them
  const TH = 4.0, TZE = ZR - TH * PITCH_W * 1.35
  gabled({ wall: stone, roof, x0: DC[0] - TH, x1: DC[0] + TH, y0: Y0, y1: Y1, ze: TZE, zr: ZR, axis: 'y', ov: 0.35, z0: 6 })
  // a plain base course
  prism(stone, [[X0 - 0.25, Y0 - 0.25], [X1 + 0.25, Y0 - 0.25], [X1 + 0.25, Y1 + 0.25], [X0 - 0.25, Y1 + 0.25]], 0, 0.95, stone, 0.15)
  // the apses: the middle one tallest, conical caps, brick cornices
  roundApse(stone, roof, brick, X1, -1.02, 3.45, 12.4, 1.9, detail ? 12 : 8)
  roundApse(stone, roof, brick, X1, 4.76, 2.25, 9.6, 1.3, detail ? 10 : 6)
  roundApse(stone, roof, brick, X1, -6.75, 2.2, 9.6, 1.3, detail ? 10 : 6)
  // the drum: twelve brick faces from the roofs' crossing, a ring of
  // blind arches round its top, a grey twelve-sided cone and the cross
  const NF = 12, RF = 3.5, RC = RF / Math.cos(Math.PI / NF)
  const Zd0 = 14.6, Zd1 = 20.2
  lathe(brick, [[RC + 0.2, Zd0], [RC + 0.2, Zd0 + 1.6], [RC, Zd0 + 1.8], [RC, Zd1], [RC + 0.35, Zd1 + 0.3], [RC + 0.35, Zd1 + 0.6]], NF, DC, 0, false)
  lathe(roof, [[RC + 0.55, Zd1 + 0.5], [RC + 0.35, Zd1 + 0.75], [0.25, 23.9], [0.06, 24.2]], NF, DC, 0, false)
  {
    const z0 = 24.0, z1 = 25.6
    beam(roof, [DC[0], DC[1], z0], [DC[0], DC[1], z1], 0.16, 0.16)
    beam(roof, [DC[0], DC[1] - 0.45, z0 + 1.05], [DC[0], DC[1] + 0.45, z0 + 1.05], 0.14, 0.14)
  }
  for (let i = 0; i < NF; i++) {
    const t = ((i + 0.5) * 2 * Math.PI) / NF
    const nn: V3 = [Math.cos(t), Math.sin(t), 0], uu: V3 = [-Math.sin(t), Math.cos(t), 0]
    const fw = 2 * RF * Math.tan(Math.PI / NF)
    const f: Face = { o: [DC[0] + RF * nn[0] - (uu[0] * fw) / 2, DC[1] + RF * nn[1] - (uu[1] * fw) / 2, 0], u: uu, n: nn }
    archBand(brick, f, fw / 2, 18.6, fw / 2 - 0.3, 0.2, 0.18, detail ? 6 : 4, detail)
    if (detail) for (const e of [0.12, fw - 0.12]) pilaster(brick, f, e, Zd0 + 1.8, 18.6, 0.2, 0.18)
    if (i % 3 === 1) win(glaze, f, fw / 2, 17.0, 0.5, 2.2, 4)
  }

  // ---- Windows and doors, read light by light from the photos -------
  const W = faceOf([X0, Y1], [X0, Y0]), Lw = Y1 - Y0
  win(glaze, W, Lw / 2 + 0.3, 11.2, 0.5, 2.0, SEG)
  win(glaze, W, Lw / 2 + 2.6, 0.6, 1.3, 2.4, SEG) // the west door, off centre to the south
  for (const s of [3.0, Lw - 3.0]) win(glaze, W, s, 6.0, 0.4, 1.8, SEG)
  const S = faceOf([X0, Y0], [X1, Y0]), Ls = X1 - X0
  win(glaze, S, Ls / 2 + 0.2, 9.0, 0.6, 2.4, SEG)
  for (const s of [3.0, Ls - 3.4]) win(glaze, S, s, 5.4, 0.5, 2.0, SEG)
  win(glaze, S, Ls / 2 + 0.2, 0.6, 1.3, 2.5, SEG)
  const N = faceOf([X1, Y1], [X0, Y1])
  win(glaze, N, Ls / 2 - 0.2, 9.0, 0.6, 2.4, SEG)
  win(glaze, N, Ls - 3.0, 5.4, 0.5, 2.0, SEG)
  // apse windows: one tall slit each, a small one in the side apses
  for (const [yc, r, sill, h] of [[-1.02, 3.45, 5.0, 2.6], [4.76, 2.25, 4.6, 1.8], [-6.75, 2.2, 4.6, 1.8]] as const) {
    const f: Face = { o: [X1 + r, yc + 0.5, 0], u: [0, -1, 0], n: [1, 0, 0] }
    win(glaze, f, 0.5, sill, 0.45, h, 4)
  }
  // the east gable over the middle apse: a small cross window
  win(glaze, faceOf([X1, Y0], [X1, Y1]), X1 - X1 + (YC - Y0), 13.0, 0.45, 1.4, 4)

  // ---- The north porch: a gabled gate with three open arches, brick. ----
  {
    const px0 = -4.45, px1 = 1.79, py0 = Y1, py1 = 12.23, ze = 5.6, zr = 7.6
    gabled({ wall: brick, roof, x0: px0, x1: px1, y0: py0, y1: py1, ze, zr, axis: 'y', skip: ['w', 'e', 'n', 's'], ov: 0.3 })
    const L = px1 - px0, D = py1 - py0
    holedWall(brick, faceOf([px1, py1], [px0, py1]), [[0, 0], [L, 0], [L, ze], [L / 2, zr], [0, ze]], [archRing(L / 2, 0, 2.4, 2.6, SEG)], 0.7)
    holedWall(brick, faceOf([px0, py1], [px0, py0]), [[0, 0], [D, 0], [D, ze], [0, ze]], [archRing(D / 2, 0, 2.6, 2.9, SEG)], 0.7)
    holedWall(brick, faceOf([px1, py0], [px1, py1]), [[0, 0], [D, 0], [D, ze], [0, ze]], [archRing(D / 2, 0, 2.6, 2.9, SEG)], 0.7)
    quadOut(brick, [px0 + 0.7, py0, 4.4], [px1 - 0.7, py0, 4.4], [px1 - 0.7, py1 - 0.7, 4.4], [px0 + 0.7, py1 - 0.7, 4.4], [0, 0, -1])
    win(glaze, faceOf([px1 - 0.71, Y1 + 0.01], [px0 + 0.71, Y1 + 0.01]), L / 2 - 0.71, 0.6, 1.4, 2.6, SEG)
  }

  // ---- The statue of Vakhtang Gorgasali -------------------------------
  // On its pedestal at (-44.6, 15.65), facing compass ~275 (model -x),
  // towards the Metekhi bridge and the old town.
  const PX = -44.6, PY = 15.65, PH = 4.0
  // stepped base and the tall plain pedestal, a little tapered
  prism(granite, [[PX - 3.0, PY - 2.0], [PX + 3.0, PY - 2.0], [PX + 3.0, PY + 2.0], [PX - 3.0, PY + 2.0]], 0, 0.5, granite, 0.08)
  {
    const r0 = [2.75, 1.75], r1 = [2.3, 1.3]
    const ring = (h: number[], z: number): V3[] => [[PX - h[0], PY - h[1], z], [PX + h[0], PY - h[1], z], [PX + h[0], PY + h[1], z], [PX - h[0], PY + h[1], z]]
    granite.loft([ring(r0, 0.5), ring(r1, PH - 0.3)])
    granite.loft([ring(r1, PH - 0.3), ring([r1[0] + 0.12, r1[1] + 0.12], PH - 0.15), ring([r1[0] + 0.12, r1[1] + 0.12], PH)])
    granite.cap(ring([r1[0] + 0.12, r1[1] + 0.12], PH), true)
  }
  // horse and rider, in the statue's own frame: u forward, v to the
  // horse's left, w up from the pedestal top; model = (PX - u, PY - v, PH + w)
  const T = (u: number, v: number, w: number): V3 => [PX - u, PY - v, PH + w]
  const S6 = detail ? 10 : 7
  // Sections across a spine in the statue's sagittal plane (u forward, w
  // up): each an ellipse rx wide (to the sides) and rz deep (in the plane),
  // turned square to the spine, lofted and capped.
  const spine = (q: Part, secs: Array<[number, number, number, number]>, n: number) => {
    const rings = secs.map(([u, w, rx, rz], i) => {
      const a = secs[Math.max(0, i - 1)], b = secs[Math.min(secs.length - 1, i + 1)]
      let tu = b[0] - a[0], tw = b[1] - a[1]; const l = Math.hypot(tu, tw) || 1; tu /= l; tw /= l
      // lateral a = +v; in-plane b = t x a = (tu,0,tw) x (0,1,0) = (-tw, 0, tu)
      return Array.from({ length: n }, (_, k) => {
        const th = (2 * Math.PI * k) / n, c = Math.cos(th), sn = Math.sin(th)
        return T(u + -tw * rz * sn, rx * c, w + tu * rz * sn)
      })
    })
    solid(q, rings)
  }
  const NS = detail ? 14 : 9
  smooth(bronze, (q) => {
    // the horse's body: rounded rump, a deep barrel, the broad chest
    spine(q, [[-2.08, 3.2, 0.22, 0.28], [-1.95, 3.2, 0.52, 0.6], [-1.7, 3.17, 0.68, 0.78], [-1.2, 3.07, 0.72, 0.83], [-0.55, 2.97, 0.66, 0.8], [0.1, 2.92, 0.7, 0.86], [0.7, 2.97, 0.68, 0.88], [1.15, 3.07, 0.6, 0.84], [1.45, 3.17, 0.45, 0.66], [1.62, 3.22, 0.18, 0.32]], NS)
    // the neck, rising high and arched, then the head tucked, nose down, the muzzle
    spine(q, [[1.15, 3.35, 0.44, 0.56], [1.55, 3.95, 0.37, 0.5], [1.82, 4.47, 0.31, 0.42], [2.03, 4.88, 0.26, 0.32], [2.13, 5.08, 0.18, 0.2]], NS)
    spine(q, [[1.98, 5.2, 0.16, 0.18], [2.12, 5.1, 0.25, 0.3], [2.32, 4.85, 0.25, 0.31], [2.48, 4.48, 0.21, 0.26], [2.6, 4.1, 0.17, 0.21], [2.67, 3.9, 0.15, 0.15], [2.69, 3.8, 0.07, 0.07]], NS)
    for (const sd of [-1, 1]) tube(q, [T(2.05, sd * 0.13, 5.18), T(1.98, sd * 0.16, 5.5)], [0.08, 0.015], 5)
    // the crested mane along the neck's top
    stube(q, [T(1.15, 0, 3.75), T(1.42, 0, 4.35), T(1.72, 0, 4.92), T(2.0, 0, 5.28)], [0.16, 0.24, 0.22, 0.1], S6)
    // legs tapering from muscled tops to slim cannons, fetlocks and hooves; the right foreleg lifted
    const leg = (pts: Array<[number, number]>, v: number, r: number[]) => stube(q, pts.map(([u, w]) => T(u, v, w)), r, S6)
    leg([[1.1, 2.5], [1.18, 1.75], [1.2, 1.1], [1.18, 0.45], [1.22, 0.14], [1.28, 0]], 0.34, [0.34, 0.22, 0.15, 0.12, 0.15, 0.17])
    leg([[1.15, 2.5], [1.38, 1.85], [1.68, 1.5], [1.6, 0.98], [1.58, 0.8], [1.68, 0.7]], -0.34, [0.34, 0.22, 0.15, 0.12, 0.15, 0.17])
    leg([[-1.35, 2.75], [-1.55, 1.9], [-1.62, 1.3], [-1.42, 0.55], [-1.36, 0.14], [-1.3, 0]], 0.37, [0.42, 0.26, 0.17, 0.12, 0.15, 0.17])
    leg([[-1.25, 2.75], [-1.35, 1.9], [-1.32, 1.3], [-1.08, 0.55], [-1.0, 0.14], [-0.94, 0]], -0.37, [0.42, 0.26, 0.17, 0.12, 0.15, 0.17])
    // the tail, thick at the root, long and falling nearly to the plinth
    stube(q, [T(-2.0, 0, 3.3), T(-2.3, 0, 2.7), T(-2.36, 0, 1.6), T(-2.22, 0, 0.5)], [0.17, 0.27, 0.24, 0.1], S6)
    // the king: a tapered torso, broad shoulders
    const ring = (u: number, w: number, rx: number, ry: number) => Array.from({ length: NS }, (_, k) => { const th = (2 * Math.PI * k) / NS; return T(u + ry * Math.sin(th), rx * Math.cos(th), w) })
    solid(q, [ring(0.0, 3.55, 0.5, 0.42), ring(0.02, 4.0, 0.48, 0.38), ring(0.06, 4.45, 0.55, 0.36), ring(0.08, 4.72, 0.68, 0.34), ring(0.1, 4.86, 0.5, 0.28)])
    for (const sd of [-1, 1]) ellipsoid(q, T(0.08, sd * 0.6, 4.72), [0.24, 0.26, 0.22], 8, 4)
    tube(q, [T(0.12, 0, 4.82), T(0.14, 0, 5.05)], [0.17, 0.16], 7)
    ellipsoid(q, T(0.18, 0, 5.27), [0.25, 0.22, 0.28], NS, detail ? 7 : 5)
    ellipsoid(q, T(0.36, 0, 5.22), [0.06, 0.06, 0.1], 5, 3) // the hawk nose
    // a pointed helmet with a rim
    lathe(q, [[0.3, 5.36], [0.31, 5.43], [0.27, 5.52], [0.2, 5.68], [0.08, 5.82], [0.03, 6.02], [0.0, 6.04]].map(([r, z]) => [r, PH + z] as [number, number]), NS, [PX - 0.16, PY], 0, true)
    // the cloak from the shoulders, falling and flaring behind over the horse's back
    const cl = (u: number, w: number, rx: number, ry: number) => Array.from({ length: NS }, (_, k) => { const th = (2 * Math.PI * k) / NS; return T(u + ry * Math.sin(th), rx * Math.cos(th), w) })
    solid(q, [cl(-0.12, 3.35, 0.82, 0.38), cl(-0.12, 3.9, 0.74, 0.34), cl(-0.1, 4.4, 0.66, 0.34), cl(-0.04, 4.82, 0.6, 0.3)])
    // the legs down the flanks, feet in the stirrups
    for (const sd of [-1, 1]) stube(q, [T(0.1, sd * 0.45, 3.55), T(0.5, sd * 0.8, 3.1), T(0.38, sd * 0.84, 2.25), T(0.6, sd * 0.84, 2.1)], [0.24, 0.18, 0.14, 0.13], S6)
    // the right arm raised, elbow out, the open hand above the head
    stube(q, [T(0.1, -0.66, 4.72), T(0.22, -1.0, 5.15), T(0.32, -0.95, 5.8), T(0.36, -0.88, 6.2)], [0.19, 0.16, 0.14, 0.12], S6)
    slab(q, T(0.38, -0.88, 6.42), [0, 1, 0], [0, 0, 1], [[-0.15, -0.2], [0.15, -0.2], [0.16, 0.18], [0, 0.26], [-0.16, 0.18]], 0.14)
    // left arm down to the reins, and the reins to the bit
    stube(q, [T(0.1, 0.66, 4.65), T(0.3, 0.76, 4.1), T(0.75, 0.38, 3.85)], [0.18, 0.15, 0.13], S6)
    tube(q, [T(0.75, 0.32, 3.85), T(1.8, 0.26, 4.4), T(2.55, 0.18, 4.05)], [0.04, 0.04, 0.04], 4)
    // the sheathed sword at the horse's left flank
    tube(q, [T(-0.05, 0.84, 3.6), T(-0.5, 0.92, 2.7), T(-0.85, 0.92, 2.05)], [0.08, 0.07, 0.05], 5)
  }, 50)

  return { stone, brick, roof, glaze, bronze, granite }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.85)
    return [
      { part: p.stone, material: { ...finish('metekhi-stone', 0xb39a74), floodlight: lit } },
      { part: p.brick, material: { ...finish('metekhi-brick', 0xb67e60), floodlight: lit } },
      { part: p.roof, material: { ...finish('metekhi-roof', 0x8e9397, 0.6), floodlight: (_q: V3, n: V3) => (n[2] > 0.5 ? 0.2 : 0.5) } },
      { part: p.glaze, material: PALETTE.window },
      { part: p.bronze, material: { ...finish('gorgasali-bronze', 0x56554f, 0.55), floodlight: () => 0.55 } },
      { part: p.granite, material: { ...finish('gorgasali-pedestal', 0xb1aca3), floodlight: lit } },
    ]
  }
  const meta = { bearing: 4.9, osm: 'way/1064270003', height: 25.6 }
  await writeModel('tbilisi-metekhi-church.glb', 'Metekhi Church and the statue of Vakhtang Gorgasali', make(false), meta, 6500, 250 * 1024)
  await writeModel('tbilisi-metekhi-church.detail.glb', 'Metekhi Church and the statue of Vakhtang Gorgasali', make(true), meta, 40000, 1536 * 1024)
}
