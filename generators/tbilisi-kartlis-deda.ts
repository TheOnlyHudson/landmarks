/**
 * Kartlis Deda (Mother of Georgia), Sololaki ridge, Tbilisi: Elguja
 * Amashukeli's aluminium figure of 1958 (recast 1997) on its low plinth:
 * procedural, CC0-1.0, no textures.
 *   bun generators/tbilisi-kartlis-deda.ts
 * Writes models/tbilisi-kartlis-deda.glb and a detail model
 * models/tbilisi-kartlis-deda.detail.glb (finer rings: the robe's folds,
 * the hair, the hands, the bowl and the sword's hilt).
 *
 * Frame: x east, y north (the way she faces), z up, metres; the figure is
 * authored with x to her right and mirrored on output, so her left hand
 * (the bowl) is to the west; origin at the
 * area centroid of the plinth's OSM outline way/1063062536, OSM-local
 * (0.22, 2.23) m from (44.8046, 41.6881): anchor 44.804603, 41.688120.
 * Placed at bearing 9.2: her front is the long side of the plinth facing
 * north over the old town (the plinth's long sides run 9.2 deg north of
 * east-west), as the photos from the old town show her face on.
 *
 * Identity: a tall, columnar standing woman in a long straight robe that
 * falls in vertical folds to a block-like hem, broad shoulders, a small
 * head bound with a band, the hair falling down her back; her left arm
 * bent up holding a wide bowl of wine out at shoulder height, her right
 * arm straight down holding a long sword level across her front at the
 * hip. Silver-grey aluminium.
 *
 * Evidence
 * - OSM (ODbL): way/1063062536 (historic=monument, monument=statue,
 *   material=aluminium, height 20, start_date 1958): the plinth, 6.0 x
 *   4.8 m. No building is mapped under it: replaces [].
 * - Published: Wikipedia, "Kartlis Deda": 20 m aluminium statue by Elguja
 *   Amashukeli, erected 1958 on Sololaki hill; wine bowl in her left hand
 *   for friends, sword in her right for enemies.
 *   https://en.wikipedia.org/wiki/Kartlis_Deda
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Kartlis Deda - Mother of a Kartli or Mother of a Georgian - Photo
 *     by Mostafa Meraji" (the first of the series), Mostafameraji, CC BY-SA
 *     4.0 ("... Photo by Mostafa Meraji 02.jpg"): face on from the old town;
 *     every proportion below scaled from
 *     it at 0.0435 m/px (head 2.8, shoulders 4.8 wide, robe 3.9 wide at the
 *     hip and 4.6 at the hem, the sword 8.5 long at 10 m, the bowl about
 *     2.8 m across at 16.5 m, held just outside the vertical forearm,
 *     its rim 4.8 m out to her left; the bowl arm's upper arm close to her
 *     side)
 *     https://commons.wikimedia.org/wiki/File:Kartlis_Deda_-_Mother_of_a_Kartli_or_Mother_of_a_Georgian_-_Photo_by_Mostafa_Meraji_02.jpg
 *   - "مجسمه (تندیس) کارتلیس ددا یا مادر گرجستان بر بلندای شهر تفلیس 06.jpg"
 *     and "... 08.jpg", Mostafameraji, CC BY-SA 4.0: from behind on the
 *     left (the hair down the back, the robe's back) and in profile (the
 *     bowl held forward, the sword pointing forward-left, the robe's depth)
 *     https://commons.wikimedia.org/wiki/Category:Remote_views_of_Kartlis_Deda
 *   - "Kartlis Deda, Mother of Georgia 0257.JPG", Møller, CC BY-SA 4.0, and
 *     "Kartlis Deda overlooking the old part of Tbilisi.jpg", CC BY-SA:
 *     from below in the old town, the silhouette
 *
 * Numbers: the figure's 20 m published (taken as head top to hem); the
 * plinth from OSM, its height (2.6 m) from the front photo; all else
 * estimated from the photos above. Doubts: the face, the hands and the
 * folds are simplified to bold forms; the sword's exact angle forward is
 * read from one profile silhouette. Lit white at night (photos at night
 * show her floodlit).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { prism, lathe } from './sf-de-young'
import { smooth, ellipsoid, solid, slab, tube } from './nyc-columbus-monument'
import { stube } from './tbilisi-metekhi-church'
import { writeModel } from './tbilisi-holy-trinity-cathedral'


/**
 * A limb: a tube along a Catmull-Rom curve through `pts`, radii eased
 * between them, its rings carried along by parallel transport so the
 * surface never twists where the limb turns from level to upright (the
 * shared `tube` flips its frame there and leaves a seam).
 */
function limb(q: Part, pts: V3[], radii: number[], sides: number, sub = 5) {
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
      const a = (2 * Math.PI * k) / sides, c = Math.cos(a) * rad[i], s = Math.sin(a) * rad[i]
      return [path[i][0] + u[0] * c + w[0] * s, path[i][1] + u[1] * c + w[1] * s, path[i][2] + u[2] * c + w[2] * s] as V3
    }))
  }
  solid(q, rings)
}

export function build(detail: boolean) {
  const metal = new Part(), plinth = new Part()
  const H0 = 2.6 // the plinth's top: her hem
  const S = detail ? 28 : 16

  // ---- The plinth: a low block, a step round its foot ----
  const rect = (hx: number, hy: number): [number, number][] => [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]]
  prism(plinth, rect(3.25, 2.6), 0, 0.5, plinth, 0.08)
  prism(plinth, rect(3.0, 2.4), 0.5, H0, plinth, 0.12)

  // ---- The figure ----
  const Z = (z: number) => H0 + z // heights over the hem
  smooth(metal, (q) => {
    const S2 = detail ? 32 : 20
    // The robe: a tall, nearly straight column about as wide as her
    // shoulders, a rounded rectangle in plan, a little wider at the hem, cut
    // into broad vertical folds (real grooves).
    const ring = (hw: number, hd: number, z: number, fold: number, yOff = 0): V3[] =>
      Array.from({ length: S }, (_, i) => {
        const t = (2 * Math.PI * i) / S
        const c = Math.cos(t), s = Math.sin(t)
        const e = 0.6
        let x = hw * Math.sign(c) * Math.abs(c) ** e, y = hd * Math.sign(s) * Math.abs(s) ** e
        const g = 1 - fold * (0.5 + 0.5 * Math.cos(t * (detail ? 10 : 6)))
        x *= g; y *= g
        return [x, y + yOff, Z(z)]
      })
    solid(q, [ring(2.08, 1.38, 0, 0.05), ring(2.02, 1.34, 2.0, 0.05), ring(1.96, 1.3, 6.0, 0.04), ring(1.9, 1.27, 9.0, 0.03), ring(1.8, 1.2, 10.4, 0.02, 0.05)])
    // the torso: hips, a waist, the bust swelling out of the chest (two lobes
    // in the rings, not stuck-on balls), broad rounded shoulders
    const tor = (hw: number, hd: number, z: number, bust = 0, yOff = 0): V3[] =>
      Array.from({ length: S2 }, (_, i) => {
        const t = (2 * Math.PI * i) / S2
        const lobe = (m: number) => Math.exp(-((t - m) ** 2) / 0.07)
        const b = Math.sin(t) > 0 ? bust * (lobe(Math.PI / 2 - 0.5) + lobe(Math.PI / 2 + 0.5)) : 0
        return [hw * Math.cos(t), hd * Math.sin(t) + b + yOff, Z(z)] as V3
      })
    solid(q, [tor(1.8, 1.2, 10.3, 0, 0.05), tor(1.58, 1.08, 11.2), tor(1.72, 1.15, 12.0, 0.3), tor(1.98, 1.22, 12.8, 0.8), tor(2.15, 1.2, 13.5, 0.7), tor(2.05, 1.1, 14.2, 0.1), tor(1.85, 0.95, 14.8), tor(1.2, 0.78, 15.25)])
    // the neck, a full head, the band round the brow
    tube(q, [[0, 0.05, Z(14.9)], [0, 0.12, Z(15.95)]], [0.62, 0.56], detail ? 12 : 8)
    ellipsoid(q, [0, 0.18, Z(17.05)], [1.1, 1.22, 1.45], detail ? 16 : 12, detail ? 9 : 6)
    tube(q, [[0, 0.14, Z(17.65)], [0, 0.14, Z(17.95)]], [1.13, 1.13], detail ? 16 : 12)
    ellipsoid(q, [0, 0.1, Z(18.1)], [1.0, 1.08, 0.45], detail ? 16 : 12, 4)
    ellipsoid(q, [0, 1.3, Z(16.95)], [0.2, 0.32, 0.42], 6, 3) // the nose
    // the hair falling down her back to the shoulder blades, and beside the neck
    for (const [y, z, rx, ry, rz] of [[-0.55, 17.4, 1.08, 0.72, 1.05], [-0.95, 16.2, 1.02, 0.52, 1.0], [-1.08, 15.0, 0.92, 0.42, 0.95], [-1.02, 14.0, 0.75, 0.32, 0.7]] as const)
      ellipsoid(q, [0, y, Z(z)], [rx, ry, rz], detail ? 14 : 10, detail ? 7 : 5)
    for (const s of [-1, 1]) stube(q, [[s * 0.9, -0.1, Z(17.4)], [s * 1.0, -0.3, Z(16.2)], [s * 1.08, -0.45, Z(15.1)]], [0.42, 0.42, 0.34], detail ? 10 : 6)
    // each arm one smooth loft from the base of the neck over the rounded
    // shoulder and down: no ball joints, a smooth elbow, tapering to the wrist
    const AS = detail ? 16 : 10
    // the sword arm: straight down to the grip at the hip
    limb(q, [[-0.9, 0.0, Z(14.75)], [-1.55, 0.0, Z(14.8)], [-2.05, 0.0, Z(14.6)], [-2.38, 0.0, Z(14.15)], [-2.52, 0.05, Z(13.35)], [-2.6, 0.2, Z(12.2)], [-2.55, 0.55, Z(11.1)], [-2.38, 1.0, Z(10.35)]], [0.5, 0.7, 0.82, 0.82, 0.74, 0.6, 0.5, 0.43], AS)
    ellipsoid(q, [-2.3, 1.22, Z(10.05)], [0.48, 0.5, 0.55], 10, 5)
    // the bowl arm: the upper arm hanging close to her side, a rounded
    // elbow, the forearm rising nearly vertical to the bowl
    limb(q, [[0.9, 0.0, Z(14.75)], [1.55, 0.0, Z(14.8)], [2.05, 0.0, Z(14.6)], [2.35, 0.0, Z(14.15)], [2.44, 0.1, Z(13.35)], [2.5, 0.3, Z(12.65)], [2.62, 0.58, Z(12.3)], [2.8, 0.88, Z(12.55)], [2.95, 1.12, Z(13.3)], [3.08, 1.35, Z(14.6)], [3.15, 1.45, Z(15.4)]], [0.5, 0.7, 0.82, 0.82, 0.72, 0.64, 0.6, 0.56, 0.5, 0.45, 0.42], AS)
    ellipsoid(q, [3.18, 1.48, Z(15.55)], [0.45, 0.45, 0.42], 10, 5)
  }, 68)

  // The sword: grip in her right hand, held level across her front,
  // pointing forward to her left; hilt, crossguard and a long tapered blade.
  {
    const hand: V3 = [-2.3, 1.25, Z(10.05)]
    const dir: V3 = [0.86, 0.5, -0.03]
    const l = Math.hypot(...dir), d: V3 = [dir[0] / l, dir[1] / l, dir[2] / l]
    const at = (s: number, up = 0, side = 0): V3 => {
      // side: horizontal, perpendicular to the blade
      const sx = -d[1], sy = d[0]
      return [hand[0] + d[0] * s + sx * side, hand[1] + d[1] * s + sy * side, hand[2] + d[2] * s + up]
    }
    tube(metal, [at(-1.25), at(-0.6), at(0.55)], [0.28, 0.16, 0.16], 6) // pommel and grip
    slab(metal, at(0.75), [d[0], d[1], d[2]], [0, 0, 1], [[-0.18, -0.85], [0.18, -0.85], [0.18, 0.85], [-0.18, 0.85]], 0.34) // crossguard (vertical, across the blade)
    // the blade: flat, its broad face up, tapering to the point
    const L = 7.4, w0 = 0.4, t = 0.13
    const P = (s: number, sw: number, up: number) => at(s, up, sw)
    const pts: Array<[number, number]> = [[0.9, w0], [L - 0.9, w0 * 0.82], [L, 0]]
    const top: V3[] = [], bot: V3[] = []
    for (const [s, w] of pts) { top.push(P(s, w, t), P(s, -w, t)); bot.push(P(s, w, -t), P(s, -w, -t)) }
    const quad = (a: V3, b: V3, c: V3, e: V3, n: V3) => {
      const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
      const cr: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
      if (cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] >= 0) metal.quad(a, b, c, e); else metal.quad(e, c, b, a)
    }
    const sideN: V3 = [-d[1], d[0], 0]
    quad(top[0], top[2], top[3], top[1], [0, 0, 1]); metal.tri(...([top[2], top[4], top[3]] as [V3, V3, V3]))
    quad(bot[0], bot[1], bot[3], bot[2], [0, 0, -1]); metal.tri(bot[2], bot[3], bot[4])
    for (const [k, sgn] of [[0, 1], [1, -1]] as const) {
      quad(bot[k], bot[k + 2], top[k + 2], top[k], [sideN[0] * sgn, sideN[1] * sgn, 0])
      quad(bot[k + 2], bot[4], top[4], top[k + 2], [sideN[0] * sgn + d[0], sideN[1] * sgn + d[1], 0])
    }
    quad(bot[0], top[0], top[1], bot[1], [-d[0], -d[1], -d[2]])
  }
  // The bowl: wide and shallow on a short stem, held up in her left hand.
  lathe(metal, [[0.0, Z(15.8)], [0.35, Z(15.84)], [0.4, Z(16.05)], [0.95, Z(16.22)], [1.32, Z(16.65)], [1.4, Z(16.9)], [1.2, Z(16.9)], [0.0, Z(16.65)]], detail ? 24 : 14, [3.4, 1.5], 0, true)

  // the figure was traced at 18.4 m from hem to head top: scale it about the hem to the published 20 m
  const K = 20 / 18.4
  for (let i = 0; i < metal.pos.length; i += 3) { metal.pos[i] *= K; metal.pos[i + 2] *= K; metal.pos[i + 1] = H0 + (metal.pos[i + 1] - H0) * K }
  // authored with +x to her right: mirror x so she holds the bowl in her left hand (west, facing north)
  for (const p of [metal]) {
    for (let i = 0; i < p.pos.length; i += 9) {
      for (const k of [0, 3, 6]) { p.pos[i + k] = -p.pos[i + k]; p.nrm[i + k] = -p.nrm[i + k] }
      for (let c = 0; c < 3; c++) { const a = p.pos[i + 3 + c]; p.pos[i + 3 + c] = p.pos[i + 6 + c]; p.pos[i + 6 + c] = a; const b = p.nrm[i + 3 + c]; p.nrm[i + 3 + c] = p.nrm[i + 6 + c]; p.nrm[i + 6 + c] = b }
    }
  }
  return { metal, plinth }
}

if (import.meta.main) {
  const make = (detail: boolean) => {
    const p = build(detail)
    return [
      { part: p.metal, material: { ...finish('kartlis-deda-aluminium', 0xc9cdd0, 0.45), floodlight: (_q: V3, n: V3) => (n[2] > 0.8 ? 0.5 : 0.9) } },
      { part: p.plinth, material: { ...finish('kartlis-deda-plinth', 0xaaa69e), floodlight: () => 0.6 } },
    ]
  }
  const meta = { bearing: 9.2, osm: 'way/1063062536', height: 22.8 }
  await writeModel('tbilisi-kartlis-deda.glb', 'Kartlis Deda (Mother of Georgia)', make(false), meta, 5000, 250 * 1024)
  await writeModel('tbilisi-kartlis-deda.detail.glb', 'Kartlis Deda (Mother of Georgia)', make(true), meta, 40000, 1536 * 1024)
}
