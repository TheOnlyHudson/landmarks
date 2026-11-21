/**
 * Mother Armenia (Մայր Հայաստան), Victory Park, Yerevan: Ara Harutyunyan's
 * hammered-copper figure of 1967 on Rafayel Israyelian's basalt pedestal
 * (built 1950 for the Stalin statue it replaced), which houses the Mother
 * Armenia military museum. Procedural, CC0-1.0, no textures.
 *   bun generators/yerevan-mother-armenia.ts
 * Writes models/yerevan-mother-armenia.glb and a detail model
 * models/yerevan-mother-armenia.detail.glb (finer rings on the figure, the
 * robe's folds, the shield's star, the portal's arch bands).
 *
 * Frame: x east, y north, z up, metres, in the model's own turned frame:
 * she faces -y. Origin at the area centroid of the museum outline
 * way/446861635 (anchor 44.524669, 40.195145); bearing 42.4, so she faces
 * 222.4 deg (south-west, over the city towards Ararat), square to the
 * pedestal's faces in OSM.
 *
 * Identity: a tall columnar woman in a long straight robe, square shoulder
 * plates, hair to the shoulders, holding a very long sword level across her
 * body: her right hand grips the hilt far out to her right with the elbow
 * thrown wide, her left hand rests on the blade; a big round shield with a
 * star leans at her feet. Dark copper. Under her a dark basalt pedestal: a
 * low museum block with an arched portal and stairs, a tall square shaft
 * whose corners are separate piers behind deep vertical slots, a dentil
 * cornice, a smaller upper stage and her plinth.
 *
 * Evidence
 * - OSM (ODbL): the museum block way/446861635 (building=museum, 1 level),
 *   the shaft building:part way/1217489350 (levels 3, min_level 1), the
 *   upper stage building:part way/1217489351 (height 32), the statue
 *   node/375565244 (height 54, min_height 32, artist Ara Harutyunyan), the
 *   entrance stairs way/1217489358 (19 steps), 1217489352, 1217489353.
 * - Published: Wikipedia "Mother Armenia": statue 22 m, hammered copper,
 *   total 51 m with the pedestal, basalt pedestal by Rafayel Israyelian,
 *   1967 https://en.wikipedia.org/wiki/Mother_Armenia
 * - Photos (all evidence):
 *   - "Mother Armenia (2024) (Far Angle).jpg", ASFINAG AT, CC BY 4.0: face
 *     on from the eternal flame, the camera low and far, so little
 *     foreshortened; every height and the shaft's width are scaled from it
 *     at 0.108-0.111 m/px, taking the figure as 21 m from her feet (museum
 *     block 6.4 m, the corner piers to 25.1, the cornice 28.8, the upper
 *     stage 32.0, her plinth to 33.6; the shaft 20.6 m wide, the corner
 *     piers behind 1.1 m slots; the figure: head 2.4 m, chin at 51.6,
 *     shoulders at 50.4, robe 4.6 m across the chest narrowing to 3.4 at
 *     the hem, her right elbow 5.8 m out, the sword 13.5 m from pommel to
 *     point at 46.7). Changed at review: her right fist is brought in to
 *     grip the sword before her chest (the photo's grip is further out),
 *     the blade running out to her left; the shield halved to 2.4 m so it
 *     reads as a shield, not a wheel, at phone size)
 *     https://commons.wikimedia.org/wiki/File:Mother_Armenia_(2024)_(Far_Angle).jpg
 *   - "Mother Armenia Monument.JPG", Aschroet, CC0: the figure close from
 *     below (too foreshortened to measure): the shoulder drapery, the
 *     hands, the pleats, the star on the shield
 *     https://commons.wikimedia.org/wiki/File:Mother_Armenia_Monument.JPG
 *   - "Yerevan, Mother Armenia Monument, Armenia.jpg", Vyacheslav
 *     Argenberg, CC BY 4.0: three-quarter from the left front, the pedestal
 *     in depth, the slots, the museum block and portal
 *     https://commons.wikimedia.org/wiki/File:Yerevan,_Mother_Armenia_Monument,_Armenia.jpg
 *   - "Mother-Armenia-Yerevan-Armenia.jpg", acediscovery, CC BY 4.0;
 *     "Mother Armenia Statue, Yerevan, Armenia.jpg", SamvelM, CC BY-SA 3.0;
 *     "Mother Armenia statue in Yerevan P8210360 2350.jpg", Alexxx1979,
 *     CC BY-SA 4.0; "2014 Erywań, Widoki z Kaskad (14).jpg", Marcin Konsek,
 *     CC BY-SA 4.0 (from the side: the sword's depth, the robe's depth)
 *   - "Mother Armenia Military Museum in Yerevan 05.jpg", Gill M L, CC BY-SA
 *     2.0: the carved portal
 *
 * Numbers: the museum block's plan from OSM; the shaft and upper stage
 * from the photo, centred on OSM's parts (OSM draws the shaft 24.9 x 22.8 m
 * and the upper stage 13.9 x 12.5, about a fifth larger than the photo
 * allows against the published heights); heights: the statue from 32 to 54 m as OSM's
 * node tags give it, which the far-angle photo confirms (55 m from the
 * portal's sill); Wikipedia's 51 m total is 3 m less, perhaps measured from
 * the upper terrace. Everything else estimated from the photos above.
 * Colours sampled: basalt #5e4f3d-#665541 shaded, #776659 sunlit (pulled
 * lighter, kept dark as it is the monument's identity); copper #4a4b3f-
 * #4e524a, pulled to a dark olive grey.
 *
 * Doubts: the back of the figure is seen only far off (hair and robe
 * simplified); the reliefs on the pedestal, the railing round the upper
 * stage and the military hardware round the park are left out; the
 * museum's side faces have no photographed openings modelled. Floodlit at
 * night.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { smooth, ellipsoid, solid, tube, slab } from './nyc-columbus-monument'
import { polyTris, fquad, ftri } from './berlin-oberbaum-bridge'
import { writeModel } from './tbilisi-holy-trinity-cathedral'
import { flatPoly, archOutline, recess, ccwRing, type XY } from './yerevan-cascade'

/** A flat-based prism over a ring: walls z0..z1, top at z1 (optionally on another part). */
function prism(wall: Part, top: Part | null, ring0: XY[], z0: number, z1: number) {
  const ring = ccwRing(ring0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const n: V3 = [b[1] - a[1], a[0] - b[0], 0], l = Math.hypot(n[0], n[1])
    fquad(wall, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [n[0] / l, n[1] / l, 0])
  }
  if (top) flatPoly(top, ring, [], z1)
}
/** A prism whose ring is reshaped with height by `at(ring, z)`: walls and top. */
function taper(wall: Part, top: Part | null, ring0: XY[], z0: number, z1: number, at: (r: XY[], z: number) => XY[]) {
  const ring = ccwRing(ring0), a0 = at(ring, z0), a1 = at(ring, z1)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const n: V3 = [a0[j][1] - a0[i][1], a0[i][0] - a0[j][0], 0], l = Math.hypot(n[0], n[1])
    fquad(wall, [a0[i][0], a0[i][1], z0], [a0[j][0], a0[j][1], z0], [a1[j][0], a1[j][1], z1], [a1[i][0], a1[i][1], z1], [n[0] / l, n[1] / l, 0.05])
  }
  if (top) flatPoly(top, a1, [], z1)
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/**
 * A limb: a tube along a Catmull-Rom curve through `pts`, radii eased
 * between them, its rings carried by parallel transport so the surface never
 * twists where the limb turns.
 */
export function limb(q: Part, pts: V3[], radii: number[], sides: number, sub = 4, flat = 1) {
  const path: V3[] = [], rad: number[] = []
  const P = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2)
    for (let k = 0; k < sub; k++) {
      const t = k / sub, t2 = t * t, t3 = t2 * t
      path.push([0, 1, 2].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)) as V3)
      rad.push(radii[i] + (radii[i + 1] - radii[i]) * ((1 - Math.cos(t * Math.PI)) / 2))
    }
  }
  path.push(pts[pts.length - 1]); rad.push(radii[radii.length - 1])
  const nrm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
  const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const tan = path.map((_, i) => { const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)]; return nrm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]) })
  let u = nrm(crs(tan[0], Math.abs(tan[0][2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]))
  const rings: V3[][] = []
  for (let i = 0; i < path.length; i++) {
    if (i > 0) { const t = tan[i]; const d = u[0] * t[0] + u[1] * t[1] + u[2] * t[2]; u = nrm([u[0] - d * t[0], u[1] - d * t[1], u[2] - d * t[2]]) }
    const w = crs(tan[i], u)
    rings.push(Array.from({ length: sides }, (_, k) => {
      const a = (2 * Math.PI * k) / sides, c = Math.cos(a) * rad[i], s = Math.sin(a) * rad[i] * flat
      return [path[i][0] + u[0] * c + w[0] * s, path[i][1] + u[1] * c + w[1] * s, path[i][2] + u[2] * c + w[2] * s] as V3
    }))
  }
  // keep each ring counter-clockwise about the direction of travel, so solid() caps face out
  solid(q, rings)
}

// The statue's axis on the upper stage (node/375565244, in this frame).
const SX = -0.5, SY = 1.2
const FOOT = 33.6 // the figure's plinth top: her hem

export function build(detail: boolean) {
  const basalt = new Part(), terrace = new Part(), copper = new Part(), door = new Part()

  // ---- The museum block (way/446861635), 6.4 m, its front notch squared to y = -12.4 ----
  const H0 = 6.4
  const museum: XY[] = [[18.6, 16.6], [18.3, 2.3], [18.1, -16.6], [5.4, -16.6], [5.4, -12.4], [-9.8, -12.4], [-9.8, -16.3], [-18.8, -16.3], [-18.6, 1.1], [-18.3, 16.8], [-12.5, 16.8], [-12.5, 13.9], [12.4, 13.9], [12.4, 16.7]]
  const ring = ccwRing(museum)
  // the portal in the notch's back wall
  const pc = -2.2
  const holes: XY[] = archOutline(pc, 1.2, 3.2, 4.0, detail ? 12 : 8)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const n: V3 = [b[1] - a[1], a[0] - b[0], 0], l = Math.hypot(n[0], n[1])
    if (Math.abs(a[1] + 12.4) < 1e-6 && Math.abs(b[1] + 12.4) < 1e-6) {
      const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0])
      for (const [p, q, r] of polyTris([[x0, 0], [x1, 0], [x1, H0], [x0, H0]], [holes])) ftri(basalt, [p[0], -12.4, p[1]], [q[0], -12.4, q[1]], [r[0], -12.4, r[1]], [0, -1, 0])
      continue
    }
    fquad(basalt, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], H0], [a[0], a[1], H0], [n[0] / l, n[1] / l, 0])
  }
  recess(basalt, door, door, -12.4, holes, 1.0, 1.2)
  // the portal's carved surround: three stepped arch bands, standing proud
  for (const [r, w, d] of (detail ? [[1.7, 0.45, 0.25], [2.15, 0.45, 0.4], [2.6, 0.45, 0.55]] : [[1.7, 0.9, 0.3], [2.6, 0.45, 0.55]]) as Array<[number, number, number]>) {
    const seg = detail ? 12 : 8
    const P = (t: number, rr: number, dd: number): V3 => [pc + rr * Math.cos(t), -12.4 - dd, 4.0 + rr * Math.sin(t)]
    for (let k = 0; k < seg; k++) {
      const a = (Math.PI * k) / seg, b = (Math.PI * (k + 1)) / seg, m = (a + b) / 2
      fquad(basalt, P(a, r, d), P(b, r, d), P(b, r + w, d), P(a, r + w, d), [0, -1, 0])
      fquad(basalt, P(a, r + w, 0), P(b, r + w, 0), P(b, r + w, d), P(a, r + w, d), [Math.cos(m), 0, Math.sin(m)])
    }
    for (const s of [-1, 1]) { // the jambs below the springing
      const x0 = pc + s * r, x1 = pc + s * (r + w)
      fquad(basalt, [Math.min(x0, x1), -12.4 - d, 1.2], [Math.max(x0, x1), -12.4 - d, 1.2], [Math.max(x0, x1), -12.4 - d, 4.0], [Math.min(x0, x1), -12.4 - d, 4.0], [0, -1, 0])
      fquad(basalt, [x1, -12.4, 1.2], [x1, -12.4 - d, 1.2], [x1, -12.4 - d, 4.0], [x1, -12.4, 4.0], [s, 0, 0])
    }
  }
  // the stair up to the portal, in the notch (19 steps, way/1217489358), and its terrace top
  const nSt = detail ? 8 : 4, SILL = 1.2
  for (let k = 0; k < nSt; k++) {
    const y0 = -16.3 + (k * 3.4) / nSt, z0 = (k * SILL) / nSt, z1 = ((k + 1) * SILL) / nSt
    fquad(terrace, [-9.8, y0, z0], [5.4, y0, z0], [5.4, y0, z1], [-9.8, y0, z1], [0, -1, 0])
    fquad(terrace, [-9.8, y0, z1], [5.4, y0, z1], [5.4, -12.4, z1], [-9.8, -12.4, z1], [0, 0, 1])
  }
  // the museum's roof: the terrace round the shaft
  const shaft = rect(-10.37, -7.8, 10.23, 12.8)
  flatPoly(terrace, ring, [shaft], H0)
  // a low parapet round the terrace's edge
  {
    const inner = ring.map((p, i) => {
      const a = ring[(i + ring.length - 1) % ring.length], c = ring[(i + 1) % ring.length]
      const n1: XY = [a[1] - p[1], p[0] - a[0]], n2: XY = [p[1] - c[1], c[0] - p[0]]
      const l1 = Math.hypot(...n1), l2 = Math.hypot(...n2)
      const m: XY = [n1[0] / l1 + n2[0] / l2, n1[1] / l1 + n2[1] / l2], k = 0.5 / Math.max(0.4, (m[0] * n1[0] / l1 + m[1] * n1[1] / l1))
      return [p[0] - m[0] * k, p[1] - m[1] * k] as XY
    })
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length
      fquad(basalt, [ring[i][0], ring[i][1], H0], [ring[j][0], ring[j][1], H0], [ring[j][0], ring[j][1], H0 + 0.9], [ring[i][0], ring[i][1], H0 + 0.9], (() => { const n: V3 = [ring[j][1] - ring[i][1], ring[i][0] - ring[j][0], 0], l = Math.hypot(n[0], n[1]); return [n[0] / l, n[1] / l, 0] as V3 })())
      fquad(basalt, [ring[i][0], ring[i][1], H0 + 0.9], [ring[j][0], ring[j][1], H0 + 0.9], [inner[j][0], inner[j][1], H0 + 0.9], [inner[i][0], inner[i][1], H0 + 0.9], [0, 0, 1])
      fquad(basalt, [inner[j][0], inner[j][1], H0], [inner[i][0], inner[i][1], H0], [inner[i][0], inner[i][1], H0 + 0.9], [inner[j][0], inner[j][1], H0 + 0.9], (() => { const n: V3 = [inner[i][1] - inner[j][1], inner[j][0] - inner[i][0], 0], l = Math.hypot(n[0], n[1]); return [n[0] / l, n[1] / l, 0] as V3 })())
    }
  }

  // ---- The shaft (way/1217489350): a cross of two wide arms to the cornice, corner piers behind deep slots ----
  // OSM's part is 24.9 x 22.8 m; the face-on photo, scaled by the statue's
  // height, gives 20.6 m, as it does for the upper stage (11.6 against OSM's
  // 13.9 x 12.5): the photo's proportions are kept, centred on OSM's part.
  const cx = (-12.5 + 12.35) / 2, cy = (-8.9 + 13.9) / 2, hx = 10.3, hy = 10.3
  const pier = 1.5, slot = 1.1
  const ax = hx - pier - slot, ay = hy - pier - slot // the cross arms' half widths
  const ZP = 25.1, ZC = 28.8
  const cross: XY[] = [[ax, -hy], [ax, -ay], [hx, -ay], [hx, ay], [ax, ay], [ax, hy], [-ax, hy], [-ax, ay], [-hx, ay], [-hx, -ay], [-ax, -ay], [-ax, -hy]].map(([x, y]) => [cx + x, cy + y] as XY)
  // the faces batter in by 0.6 m from the terrace to the cornice
  const bat = (r: XY[], z: number) => { const k = 1 - (0.6 / hx) * ((z - H0) / (ZC - 1.0 - H0)); return r.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k] as XY) }
  taper(basalt, null, cross, H0, ZC - 1.0, bat)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    // the corner piers stand 0.3 m back from the arms' faces
    const x0 = cx + sx * (hx - 0.3), x1 = cx + sx * (hx - pier), y0 = cy + sy * (hy - 0.3), y1 = cy + sy * (hy - pier)
    taper(basalt, basalt, rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1)), H0, ZP, bat)
    // the slot's back: the inside corner of the cross, already walled; nothing to add
  }
  // the dentil cornice: a band standing 0.4 proud round the cross's top, with a row of blocks under it
  const grow = (r: XY[], d: number) => r.map(([x, y]) => [x + Math.sign(x - cx) * d, y + Math.sign(y - cy) * d] as XY)
  const crown = grow(bat(cross, ZC - 1.0), 0.45)
  prism(basalt, terrace, crown, ZC - 1.0, ZC)
  flatPoly(basalt, ccwRing(crown), [], ZC - 1.0, false)
  if (detail) {
    // dentils along the four front arms
    const hb = hx - 0.6
    for (const [o, d] of [[[cx, cy - hb], [1, 0]], [[cx, cy + hb], [-1, 0]], [[cx + hb, cy], [0, 1]], [[cx - hb, cy], [0, -1]]] as Array<[XY, XY]>) {
      const n: XY = [d[1], -d[0]]
      for (let s = -ax + 0.4; s <= ax - 0.4; s += 0.9) {
        const p: XY = [o[0] + d[0] * s, o[1] + d[1] * s]
        const q: XY = [p[0] + n[0] * 0.3, p[1] + n[1] * 0.3]
        prism(basalt, null, [[p[0] - d[0] * 0.25, p[1] - d[1] * 0.25], [p[0] + d[0] * 0.25, p[1] + d[1] * 0.25], [q[0] + d[0] * 0.25, q[1] + d[1] * 0.25], [q[0] - d[0] * 0.25, q[1] - d[1] * 0.25]], ZC - 1.5, ZC - 1.0)
      }
    }
  }

  // ---- The upper stage (way/1217489351, height 32) and her plinth ----
  const us = rect(SX - 5.8, SY - 5.8, SX + 5.8, SY + 5.8)
  prism(basalt, terrace, us, ZC, 31.4)
  prism(basalt, terrace, rect(SX - 6.1, SY - 6.1, SX + 6.1, SY + 6.1), 31.4, 32.0) // its cornice lip
  prism(basalt, null, rect(SX - 3.5, SY - 3.0, SX + 3.5, SY + 3.0), 32.0, FOOT)
  flatPoly(basalt, rect(SX - 3.5, SY - 3.0, SX + 3.5, SY + 3.0), [], FOOT)

  // ---- The figure ----
  figure(copper, detail)
  return { basalt, terrace, copper, door }
}

/** Mother Armenia herself, facing -y, her right hand to -x, hem on FOOT. */
function figure(metal: Part, detail: boolean) {
  const S = detail ? 32 : 24
  const at = (x: number, y: number, z: number): V3 => [SX + x, SY + y, z]
  smooth(metal, (q) => {
    // Robe and torso, one loft from the hem to the neck: a rounded-square
    // column, folds cut in below the belt, the bust swelling from the chest.
    // Measured on the face-on far photo (0.027 m per px at 4x): head top
    // 54.0, chin 50.9, shoulders 49.9, the sword's grip 46.1; robe 4.9 m
    // across the chest, 4.5 at the hip, narrowing to 4.1 at the hem.
    type R = [z: number, a: number, b: number, e: number, fold: number, bust: number, dy: number]
    const rows: R[] = [
      [FOOT, 1.68, 1.15, 0.5, 0.08, 0, 0],
      [FOOT + 1.2, 1.7, 1.16, 0.5, 0.08, 0, 0],
      [FOOT + 4.5, 1.76, 1.2, 0.52, 0.08, 0, 0],
      [FOOT + 8, 1.84, 1.24, 0.55, 0.07, 0, 0],
      [45.4, 1.9, 1.28, 0.6, 0.05, 0, 0],
      [46.4, 2.0, 1.32, 0.66, 0.0, 0.05, 0],
      [47.4, 2.12, 1.38, 0.72, 0, 0.32, 0],
      [48.4, 2.22, 1.4, 0.78, 0, 0.4, 0],
      [49.3, 2.3, 1.32, 0.82, 0, 0.16, 0.05],
      [50.0, 2.2, 1.18, 0.85, 0, 0, 0.08],
      [50.5, 1.6, 0.95, 0.9, 0, 0, 0.1],
      [50.85, 0.8, 0.68, 1, 0, 0, 0.1],
    ]
    const ring = ([z, a, b, e, fold, bust, dy]: R): V3[] => Array.from({ length: S }, (_, i) => {
      const t = (2 * Math.PI * i) / S, c = Math.cos(t), s = Math.sin(t)
      let x = a * Math.sign(c) * Math.abs(c) ** e, y = b * Math.sign(s) * Math.abs(s) ** e
      // deep vertical pleats, strongest on the front
      const g = 1 - fold * (s < 0 ? 1 : 0.5) * (0.5 + 0.5 * Math.cos(t * (detail ? 16 : 10))) * 1.5
      x *= g; y *= g
      if (s < 0 && bust) { const lobe = (m: number) => Math.exp(-((t - m) ** 2) / 0.06); y -= bust * (lobe(1.5 * Math.PI - 0.45) + lobe(1.5 * Math.PI + 0.45)) }
      return at(x, y + dy, z)
    })
    solid(q, rows.map(ring))
    // the neck, the head (an oval, the face forward), the hair to her shoulders
    tube(q, [at(0, 0.1, 50.5), at(0, 0.05, 51.5)], [0.62, 0.56], detail ? 12 : 8)
    ellipsoid(q, at(0, -0.12, 52.8), [0.92, 1.05, 1.2], detail ? 16 : 10, detail ? 9 : 6)
    ellipsoid(q, at(0, -1.13, 52.65), [0.17, 0.26, 0.36], 6, 3) // the nose
    ellipsoid(q, at(0, 0.25, 53.0), [0.98, 1.0, 1.08], detail ? 16 : 10, detail ? 8 : 5) // hair over the crown
    ellipsoid(q, at(0, 0.55, 51.6), [0.98, 0.58, 1.2], detail ? 14 : 10, detail ? 7 : 5) // down the back
    for (const s of [-1, 1]) ellipsoid(q, at(s * 0.78, 0.1, 51.55), [0.32, 0.5, 0.95], 8, 4) // beside the neck

    const AS = detail ? 14 : 11
    // her right arm (-x): from the base of the neck over the shoulder, the
    // upper arm held out level, the elbow, the forearm straight down to the grip
    limb(q, [at(-1.0, 0.05, 50.3), at(-2.0, 0.0, 50.35), at(-3.0, -0.1, 50.0), at(-3.9, -0.35, 49.2), at(-4.3, -0.8, 48.3), at(-4.0, -1.35, 47.6), at(-3.4, -1.75, 47.35), at(-2.95, -1.95, 47.3)], [0.6, 0.95, 0.92, 0.82, 0.78, 0.7, 0.62, 0.55], AS)
    ellipsoid(q, at(-2.7, -2.05, 47.1), [0.6, 0.55, 0.6], 10, 5) // the fist round the grip, before her chest
    // her left arm (+x): down her side to the elbow, the forearm forward to the blade
    limb(q, [at(1.0, 0.05, 50.3), at(2.0, 0.0, 50.3), at(2.7, 0.0, 49.7), at(3.05, 0.05, 48.7), at(3.2, -0.1, 47.7), at(3.15, -0.7, 47.2), at(3.0, -1.4, 47.2), at(2.95, -1.9, 47.2)], [0.6, 0.95, 0.88, 0.76, 0.66, 0.6, 0.54, 0.5], AS)
    ellipsoid(q, at(2.95, -2.2, 47.25), [0.55, 0.5, 0.6], 10, 5) // the hand round the blade
  }, 62)

  // the drapery on her right shoulder, and a plate on her left
  slab(metal, at(-2.25, -0.05, 50.0), [-Math.cos(0.5), 0, -Math.sin(0.5)], [0, 1, 0], [[-0.7, -1.2], [1.1, -1.1], [1.1, 1.1], [-0.7, 1.2]], 0.36)
  if (detail) slab(metal, at(-2.45, -0.05, 49.45), [-Math.cos(0.9), 0, -Math.sin(0.9)], [0, 1, 0], [[-0.4, -1.1], [1.0, -1.0], [1.0, 1.0], [-0.4, 1.1]], 0.3)
  slab(metal, at(2.25, -0.05, 50.0), [Math.cos(0.5), 0, -Math.sin(0.5)], [0, 1, 0], [[-0.7, -1.1], [0.9, -1.0], [0.9, 1.0], [-0.7, 1.1]], 0.3)
  // the sash hanging at her left hip
  slab(metal, at(1.85, -0.75, 44.0), [0, 0, 1], [0.12, -1, 0], [[-2.6, -0.3], [1.9, -0.35], [1.9, 0.35], [-2.6, 0.3]], 0.3)

  // ---- The sword: grip in her right fist, the blade level across her front ----
  const A = at(-3.9, -2.05, 47.05), B = at(9.0, -2.6, 47.45)
  const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d), u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const up0: V3 = [0, 0, 1], k0 = up0[0] * u[0] + up0[1] * u[1] + up0[2] * u[2]
  const up: V3 = (() => { const v: V3 = [up0[0] - k0 * u[0], up0[1] - k0 * u[1], up0[2] - k0 * u[2]], l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] })()
  const side: V3 = [u[1] * up[2] - u[2] * up[1], u[2] * up[0] - u[0] * up[2], u[0] * up[1] - u[1] * up[0]]
  const P = (s: number, h: number, w = 0): V3 => [A[0] + u[0] * s + up[0] * h + side[0] * w, A[1] + u[1] * s + up[1] * h + side[1] * w, A[2] + u[2] * s + up[2] * h + side[2] * w]
  tube(metal, [P(0.0, 0), P(0.3, 0), P(2.2, 0)], [0.36, 0.25, 0.25], 8) // pommel and grip
  ellipsoid(metal, P(-0.05, 0), [0.4, 0.4, 0.4], 8, 4)
  slab(metal, P(2.3, 0), u, up, [[-0.2, -1.4], [0.2, -1.4], [0.2, 1.4], [-0.2, 1.4]], 0.5) // the crossguard
  // the blade: broad, its flat face to the front, the point at the tip
  const s0 = 2.5, s1 = L - 0.9, hw = 0.6, t = 0.14
  const ringB = (s: number, h: number): V3[] => [P(s, -h, -t), P(s, -h, t), P(s, h, t), P(s, h, -t)]
  const r0 = ringB(s0, hw), r1 = ringB(s1, hw * 0.95), tip = P(L, -0.15)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const c0 = P(s0, 0)
    const nn: V3 = [(r0[i][0] + r0[j][0]) / 2 - c0[0], (r0[i][1] + r0[j][1]) / 2 - c0[1], (r0[i][2] + r0[j][2]) / 2 - c0[2]]
    fquad(metal, r0[i], r0[j], r1[j], r1[i], nn)
    ftri(metal, r1[i], r1[j], tip, [nn[0] + u[0], nn[1] + u[1], nn[2] + u[2]])
  }
  fquad(metal, r0[0], r0[1], r0[2], r0[3], [-u[0], -u[1], -u[2]])
  if (detail) slab(metal, P((s0 + s1) / 2, 0, -t - 0.04), u, up, [[-(s1 - s0) / 2 + 0.4, -0.12], [(s1 - s0) / 2 - 0.4, -0.12], [(s1 - s0) / 2 - 0.4, 0.12], [-(s1 - s0) / 2 + 0.4, 0.12]], 0.08)

  // ---- The shield at her feet: a round disc with a boss and an eight-pointed star, leaning back ----
  {
    const C = at(-0.7, -1.95, FOOT + 1.15), R = 1.2, th = 0.25
    const tilt = 0.24 // leaning back onto her plinth
    const ex: V3 = [1, 0, 0], ez: V3 = [0, Math.sin(tilt), Math.cos(tilt)], ny: V3 = [0, -Math.cos(tilt), Math.sin(tilt)]
    const D = (a: number, r: number, f: number): V3 => [C[0] + ex[0] * r * Math.cos(a) + ny[0] * f, C[1] + ez[1] * r * Math.sin(a) + ny[1] * f, C[2] + ez[2] * r * Math.sin(a) + ny[2] * f]
    const n = detail ? 28 : 16
    const ringA = (r: number, f: number) => Array.from({ length: n }, (_, i) => D((2 * Math.PI * i) / n, r, f))
    const back = ringA(R, -th / 2), front = ringA(R, th / 2), rim = ringA(R - 0.18, th / 2 + 0.1), face = ringA(R - 0.18, th / 2 + 0.03)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, a = (2 * Math.PI * (i + 0.5)) / n
      const out: V3 = [Math.cos(a), ez[1] * Math.sin(a), ez[2] * Math.sin(a)]
      fquad(metal, back[i], back[j], front[j], front[i], out)
      fquad(metal, front[i], front[j], rim[j], rim[i], [ny[0] + out[0], ny[1] + out[1], ny[2] + out[2]])
      fquad(metal, rim[i], rim[j], face[j], face[i], [ny[0] - out[0] * 0.5, ny[1] - out[1] * 0.5, ny[2] - out[2] * 0.5])
    }
    for (let i = 1; i < n - 1; i++) { ftri(metal, face[0], face[i], face[i + 1], ny); ftri(metal, back[0], back[i + 1], back[i], [-ny[0], -ny[1], -ny[2]]) }
    // the star: eight raised rays from a boss
    const rays = 8
    for (let k = 0; k < rays; k++) {
      const a = (2 * Math.PI * k) / rays + Math.PI / 8
      const p0 = D(a - 0.3, 0.25, th / 2 + 0.05), p1 = D(a, R - 0.32, th / 2 + 0.05), p2 = D(a + 0.3, 0.25, th / 2 + 0.05)
      const lift = (p: V3, f: number): V3 => [p[0] + ny[0] * f, p[1] + ny[1] * f, p[2] + ny[2] * f]
      const ridge = lift(D(a, (R - 0.32) * 0.45, th / 2 + 0.05), 0.2)
      ftri(metal, p0, ridge, lift(p1, 0.02), [ny[0] - Math.sin(a), ny[1], ny[2] + Math.cos(a)])
      ftri(metal, lift(p1, 0.02), ridge, p2, [ny[0] + Math.sin(a), ny[1], ny[2] - Math.cos(a)])
    }
    ellipsoid(metal, D(0, 0, th / 2 + 0.05), [0.3, 0.3 * Math.cos(tilt) + 0.1, 0.3], 10, 4)
  }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    return [
      { part: p.basalt, material: { ...finish('mother-armenia-basalt', 0x5f5249), floodlight: (_q: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 0.75) } },
      { part: p.terrace, material: finish('mother-armenia-terrace', 0x9b9188) },
      { part: p.copper, material: { ...finish('mother-armenia-copper', 0x5f6257, 0.6), floodlight: (_q: V3, n: V3) => (n[2] > 0.8 ? 0.5 : 0.9) } },
      { part: p.door, material: { name: 'entrance', color: 0x5d5249, roughness: 0.85 } },
    ]
  }
  const meta = { bearing: 42.4, osm: 'way/446861635', height: 54 }
  await writeModel('yerevan-mother-armenia.glb', 'Mother Armenia', make(false), meta, 5000, 250 * 1024)
  await writeModel('yerevan-mother-armenia.detail.glb', 'Mother Armenia', make(true), meta, 40000, 1536 * 1024)
}
