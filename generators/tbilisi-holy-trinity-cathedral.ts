/**
 * Holy Trinity Cathedral of Tbilisi (Tsminda Sameba), Elia Hill, Avlabari,
 * Tbilisi: procedural, CC0-1.0, no textures.
 *   bun generators/tbilisi-holy-trinity-cathedral.ts
 * Writes models/tbilisi-holy-trinity-cathedral.glb (low LOD) and
 * models/tbilisi-holy-trinity-cathedral.detail.glb (detail LOD, drawn from
 * zoom 16): the same massing, with every blind arcade's colonnettes, the
 * drum's corner colonnettes and cornice corbels, the cone's ribs, smaller
 * windows and the oculi, which the low model leaves out.
 *
 * Also exports the shared Georgian-church pieces (gabled blocks, blind
 * arches in relief, walls with real arched openings, the frame shift) that
 * tbilisi-metekhi-church and tbilisi-narikala import; the build here runs
 * only under `import.meta.main`.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). Built in the
 * OSM-local frame of (44.8165, 41.6975) and shifted so the origin is the
 * area centroid of the outline way/585352693, (3.4, 5.9) m from there:
 * anchor 44.816541, 41.697553, bearing 0 (the cathedral is oriented, its
 * long axis due east; the OSM outline is turned only ~0.3 deg).
 *
 * Identity, from the photos: a stepped ziggurat of gabled arms. On the west
 * front a low arcade of three big round arches projects before three
 * central gables of about the drum's width stand one behind and
 * above the other, each with the wider gable of the tier behind showing as
 * sloping shoulders; the north, south and east arms end in tall
 * three-sided apses under hipped grey roofs; over the crossing a tall
 * twelve-sided drum with twelve long round-headed windows between
 * colonnettes and arches, a deep corbelled cornice, a flared twelve-sided
 * cone of gilded ribs and darker bronze-gold panels, and a gilded cross. Every face carries blind arcades in
 * relief: big archivolts under each gable framing two or three windows and
 * an oculus, tall arched frames down the walls. Warm yellow-beige ashlar,
 * dark slate blue-grey sheet-metal roofs. Floodlit golden at night.
 *
 * Evidence
 * - OSM (ODbL): outline way/585352693 (height 87, building:parts=vertical)
 *   and its parts, read in metres in the frame above:
 *   way/1221613354 lowest tier, cross-shaped, height 24.5, roof 14.5 gabled
 *     along (ridge E-W): eaves 11.7 at the 22 m half-width (pitch ~30 deg);
 *   way/1221613351 second tier x -16.8..32.8, y -11.3..22.4, h 32.5, roof
 *     9.5 gabled along (eaves 22.8);
 *   way/1221613352 E-W arm 15.6 m wide, h 41, roof 5 gabled;
 *   way/1221613350 N-S arm 15 m wide, h 41, roof 5.6, ending in the
 *     three-sided apses way/1221613348 (south) and way/1221613349 (north),
 *     h 41 pyramidal; way/1221613347 east apse, h 41 pyramidal;
 *   way/1221613353 projecting west gable of the second tier, h 30;
 *   way/1221613355 west porch, h 18; way/1221613345, way/1221613346 north
 *     and south porches, h 14.7, roof 4 gabled;
 *   way/585352695 the drum, a 16-gon 21.7 m across (its eaves), h 70, cone
 *     roof 13.5, roof:colour gold.
 * - Published: Wikipedia, "Holy Trinity Cathedral of Tbilisi"
 *   (https://en.wikipedia.org/wiki/Holy_Trinity_Cathedral_of_Tbilisi):
 *   86.1 m from the zero level to the top of the cross; the gilded cross
 *   7.5 m; length 70.45 m, width 64.68 m (the OSM outline: 69 x 64.5);
 *   architect Archil Mindiashvili, built 1995-2004; the dome over the
 *   crossing; a free-standing bell tower in the precinct.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Architecture of Tbilisi, Part II - TbilisiArchitecture8024.jpg",
 *     lumoplank, CC0: from the south-west in sun; the stepped gables, the
 *     west porch, the south apse with its great arch, the drum close up
 *     (twelve faces, colonnettes, corbelled cornice, flared gilded cone)
 *     https://commons.wikimedia.org/wiki/File:Architecture_of_Tbilisi,_Part_II_-_TbilisiArchitecture8024.jpg
 *   - "Samebao2915.jpg", Goichev, CC BY-SA 4.0: the west front head-on from
 *     the foot of the stairs; the three central gables and their shoulders,
 *     the apses' hipped roofs either side; widths read from it
 *     https://commons.wikimedia.org/wiki/File:Samebao2915.jpg
 *   - "Sameba Cathedral, Tbilisi ... 13.jpg" (کلیسای سامبا در تفلیس گرجستان
 *     13), Mostafameraji, CC BY-SA 4.0: telephoto from the south-west, the
 *     least distorted view of the drum: shaft height 0.92 x its width, cone
 *     0.66 x, cross 0.29 x; the drum's foot at the arms' ridges
 *     https://commons.wikimedia.org/wiki/File:Sameba_Cathedral,_Tbilisi_%DA%A9%D9%84%DB%8C%D8%B3%D8%A7%DB%8C_%D8%B3%D8%A7%D9%85%D8%A8%D8%A7_%D8%AF%D8%B1_%D8%AA%D9%81%D9%84%DB%8C%D8%B3_%DA%AF%D8%B1%D8%AC%D8%B3%D8%AA%D8%A7%D9%86_13.jpg
 *   - "Samebao000022.jpg", "Samebao3530.jpg", "Sameba177.jpg", Goichev,
 *     CC BY-SA 4.0: north-east, east and west views; colours
 *     https://commons.wikimedia.org/wiki/File:Samebao000022.jpg
 *     https://commons.wikimedia.org/wiki/File:Samebao3530.jpg
 *     https://commons.wikimedia.org/wiki/File:Sameba177.jpg
 *   - "Sameba Cathedral, Tbilisi ... 10.jpg", Mostafameraji, CC BY-SA 4.0:
 *     floodlit gold at night
 *     https://commons.wikimedia.org/wiki/File:Sameba_Cathedral,_Tbilisi_%DA%A9%D9%84%DB%8C%D8%B3%D8%A7%DB%8C_%D8%B3%D8%A7%D9%85%D8%A8%D8%A7_%D8%AF%D8%B1_%D8%AA%D9%81%D9%84%DB%8C%D8%B3_%DA%AF%D8%B1%D8%AC%D8%B3%D8%AA%D8%A7%D9%86_10.jpg
 * - Terrain (Mapterhorn z12, the only zoom here): 3.3 to 7.4 m of fall
 *   across the footprint, lowest to the west. The real platform is level
 *   (the photos); the z12 surface model is too coarse to show it. The model
 *   stands on y = 0 and its west and south-west foot carries a plain
 *   1.2 m base course, so the doors stay above the drawn ground.
 *
 * Numbers: plan from OSM (measured). Heights: total 86.1 and the cross 7.5
 * published; the drum's proportions from the telephoto (estimated): drum
 * 20 m across its flats, shaft 45.6 to 62.4, cornice to 64.4, a concave
 * flared cone 65 to 78.4, ball and cross to 86.1. Tier heights from the OSM parts, the arms' ridge raised from 41 to
 * 43 and a 2.6 m square pedestal under the drum, so the drum's proportions
 * from the telephoto fit the published 86.1 m (estimated). Window and
 * arcade sizes estimated from the west-front and south-west photos.
 * Doubts: the east front is seen only obliquely (Samebao3530) and is
 * drawn like the north and south apses. The arcades are drawn as a regular
 * rhythm, not bay by bay. The free-standing bell tower (way/1443353724
 * nearby is a small chapel; the belfry itself stands on the plaza to the
 * south-west, in no footprint shared with the cathedral) is not included.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { lathe, planar, box, prism, type XY } from './sf-de-young'
import { quadOut, triOut, beam, hood, archPanel, cylinder } from './moscow-church-kit'
import { polyTris } from './berlin-oberbaum-bridge'

export const PITCH = Math.tan((30 * Math.PI) / 180)
const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]
const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** Shift every vertex already written into `parts` by (-dx, -dy) in the map frame. */
export function shift(parts: Part[], dx: number, dy: number) {
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= dx; p.pos[i + 2] += dy }
}

/**
 * A gabled block on the rectangle x0..x1, y0..y1: walls from z0 to the eaves
 * `ze`, the ridge `zr` along `axis` over the middle, gable triangles on its
 * ends, the roof `ov` past the walls with a fascia and soffit. `skip` leaves
 * out wall faces drawn elsewhere (one with openings) or buried.
 */
export function gabled(o: {
  wall: Part; roof: Part; x0: number; x1: number; y0: number; y1: number; ze: number; zr: number
  axis: 'x' | 'y'; z0?: number; ov?: number; skip?: Array<'s' | 'n' | 'w' | 'e'>; ends?: boolean
}) {
  const { wall, roof, x0, x1, y0, y1, ze, zr, axis } = o
  const z0 = o.z0 ?? 0, ov = o.ov ?? 0.5, skip = new Set(o.skip ?? [])
  const t = 0.35
  if (axis === 'x') {
    const ym = (y0 + y1) / 2, k = (zr - ze) / ((y1 - y0) / 2)
    if (!skip.has('s')) quadOut(wall, [x0, y0, z0], [x1, y0, z0], [x1, y0, ze], [x0, y0, ze], [0, -1, 0])
    if (!skip.has('n')) quadOut(wall, [x0, y1, z0], [x1, y1, z0], [x1, y1, ze], [x0, y1, ze], [0, 1, 0])
    for (const [x, s, d] of [[x0, 'w', -1], [x1, 'e', 1]] as const) {
      if (skip.has(s)) continue
      quadOut(wall, [x, y0, z0], [x, y1, z0], [x, y1, ze], [x, y0, ze], [d, 0, 0])
      triOut(wall, [x, y0, ze], [x, y1, ze], [x, ym, zr], [d, 0, 0])
    }
    const X0 = x0 - ov, X1 = x1 + ov, ze2 = ze - ov * k
    for (const [y, d] of [[y0, -1], [y1, 1]] as const) {
      const Y = y + d * ov
      quadOut(roof, [X0, Y, ze2], [X1, Y, ze2], [X1, ym, zr], [X0, ym, zr], [0, d, 1])
      quadOut(roof, [X0, Y, ze2 - t], [X1, Y, ze2 - t], [X1, Y, ze2], [X0, Y, ze2], [0, d, 0])
      quadOut(roof, [X0, Y, ze2 - t], [X1, Y, ze2 - t], [X1, y, ze - t], [X0, y, ze - t], [0, 0, -1])
      for (const [X, e] of [[X0, -1], [X1, 1]] as const) quadOut(roof, [X, Y, ze2 - t], [X, ym, zr - t], [X, ym, zr], [X, Y, ze2], [e, 0, 0])
      for (const [X, e] of [[X0, -1], [X1, 1]] as const) quadOut(roof, [X, Y, ze2 - t], [X, ym, zr - t], [X - e * ov, ym, zr - t], [X - e * ov, y, ze - t], [0, 0, -1])
    }
  } else {
    const xm = (x0 + x1) / 2, k = (zr - ze) / ((x1 - x0) / 2)
    if (!skip.has('w')) quadOut(wall, [x0, y0, z0], [x0, y1, z0], [x0, y1, ze], [x0, y0, ze], [-1, 0, 0])
    if (!skip.has('e')) quadOut(wall, [x1, y0, z0], [x1, y1, z0], [x1, y1, ze], [x1, y0, ze], [1, 0, 0])
    for (const [y, s, d] of [[y0, 's', -1], [y1, 'n', 1]] as const) {
      if (skip.has(s)) continue
      quadOut(wall, [x0, y, z0], [x1, y, z0], [x1, y, ze], [x0, y, ze], [0, d, 0])
      triOut(wall, [x0, y, ze], [x1, y, ze], [xm, y, zr], [0, d, 0])
    }
    const Y0 = y0 - ov, Y1 = y1 + ov, ze2 = ze - ov * k
    for (const [x, d] of [[x0, -1], [x1, 1]] as const) {
      const X = x + d * ov
      quadOut(roof, [X, Y0, ze2], [X, Y1, ze2], [xm, Y1, zr], [xm, Y0, zr], [d, 0, 1])
      quadOut(roof, [X, Y0, ze2 - t], [X, Y1, ze2 - t], [X, Y1, ze2], [X, Y0, ze2], [d, 0, 0])
      quadOut(roof, [X, Y0, ze2 - t], [X, Y1, ze2 - t], [x, Y1, ze - t], [x, Y0, ze - t], [0, 0, -1])
      for (const [Y, e] of [[Y0, -1], [Y1, 1]] as const) quadOut(roof, [X, Y, ze2 - t], [xm, Y, zr - t], [xm, Y, zr], [X, Y, ze2], [0, e, 0])
      for (const [Y, e] of [[Y0, -1], [Y1, 1]] as const) quadOut(roof, [X, Y, ze2 - t], [xm, Y, zr - t], [xm, Y - e * ov, zr - t], [x, Y - e * ov, ze - t], [0, 0, -1])
    }
  }
}

/**
 * A polygonal apse: the prism over `ring` (counter-clockwise) from z0 to the
 * eaves `ze`, roofed by triangles from each outer edge to `apex` (the end
 * of the ridge it meets), `ov` past the walls. `open` lists edges (by their
 * first index) that are inside the building and get no wall or roof.
 */
export function hipApse(wall: Part, roof: Part, ring: XY[], ze: number, apex: V3, open: number[] = [], z0 = 0, ov = 0.5) {
  const n = ring.length
  const c: XY = [ring.reduce((s, p) => s + p[0], 0) / n, ring.reduce((s, p) => s + p[1], 0) / n]
  const out = (p: XY): XY => { const d = Math.hypot(p[0] - apex[0], p[1] - apex[1]) || 1; return [p[0] + ((p[0] - apex[0]) / d) * ov, p[1] + ((p[1] - apex[1]) / d) * ov] }
  for (let i = 0; i < n; i++) {
    if (open.includes(i)) continue
    const a = ring[i], b = ring[(i + 1) % n]
    const nrm: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
    quadOut(wall, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], ze], [a[0], a[1], ze], nrm)
    const A = out(a), B = out(b)
    const k = (apex[2] - ze) / Math.max(1e-3, Math.hypot(a[0] - apex[0], a[1] - apex[1]))
    const za = ze - ov * k
    triOut(roof, [A[0], A[1], za], [B[0], B[1], za], apex, [nrm[0], nrm[1], 1])
    quadOut(roof, [A[0], A[1], za - 0.35], [B[0], B[1], za - 0.35], [B[0], B[1], za], [A[0], A[1], za], nrm)
    quadOut(roof, [A[0], A[1], za - 0.35], [B[0], B[1], za - 0.35], [b[0], b[1], ze - 0.35], [a[0], a[1], ze - 0.35], [0, 0, -1])
  }
  void c
}

/** The frame of a wall face: `o` its left foot (seen from outside), `u` along it, `n` out. */
export type Face = { o: V3; u: V3; n: V3 }
export const at = (f: Face, s: number, z: number, d = 0): V3 => [f.o[0] + f.u[0] * s + f.n[0] * d, f.o[1] + f.u[1] * s + f.n[1] * d, z + f.n[2] * d]
/** A face on the line from a to b (map xy), its outside to the right of a->b, i.e. counter-clockwise rings face out. */
export const faceOf = (a: XY, b: XY): Face => {
  const u = unit([b[0] - a[0], b[1] - a[1], 0])
  return { o: [a[0], a[1], 0], u, n: [u[1], -u[0], 0] }
}

/** A round-headed outline (s, z): width w at s, from z0, jambs `jamb` high, `seg` steps round the head. */
export function archRing(s: number, z0: number, w: number, jamb: number, seg = 8): XY[] {
  const pts: XY[] = [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z0 + jamb]]
  for (let k = 1; k < seg; k++) { const t = (Math.PI * k) / seg; pts.push([s + (w / 2) * Math.cos(t), z0 + jamb + (w / 2) * Math.sin(t)]) }
  pts.push([s - w / 2, z0 + jamb])
  return pts
}

/**
 * A wall slab in a face's plane, `thick` deep behind it, its outline (s, z)
 * pierced by `holes`: front, back and the reveals round every hole are real
 * geometry, so an arcade reads as open from any side.
 */
export function holedWall(p: Part, f: Face, outline: XY[], holes: XY[][], thick: number, reveal: Part = p) {
  const W = (q: XY, d: number) => at(f, q[0], q[1], d)
  for (const [a, b, c] of polyTris(outline, holes)) {
    triOut(p, W(a, 0), W(b, 0), W(c, 0), f.n)
    triOut(p, W(a, -thick), W(b, -thick), W(c, -thick), [-f.n[0], -f.n[1], -f.n[2]])
  }
  for (const h of holes) {
    const cs = h.reduce((s, q) => s + q[0], 0) / h.length, cz = h.reduce((s, q) => s + q[1], 0) / h.length
    for (let i = 0; i < h.length; i++) {
      const a = h[i], b = h[(i + 1) % h.length]
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const inward = unit([f.u[0] * (cs - m[0]), f.u[1] * (cs - m[0]), cz - m[1]])
      quadOut(reveal, W(a, 0), W(b, 0), W(b, -thick), W(a, -thick), inward)
    }
  }
}

/** A pilaster or colonnette standing on a face: `w` wide, `d` proud, from z0 to z1 at s (front, sides and top; its back is the wall). */
export function pilaster(p: Part, f: Face, s: number, z0: number, z1: number, w = 0.5, d = 0.25) {
  const A = at(f, s - w / 2, z0), B = at(f, s + w / 2, z0), A1 = at(f, s - w / 2, z0, d), B1 = at(f, s + w / 2, z0, d)
  const up = (q: V3): V3 => [q[0], q[1], z1]
  const mu: V3 = [-f.u[0], -f.u[1], 0]
  quadOut(p, A1, B1, up(B1), up(A1), f.n)
  quadOut(p, A, A1, up(A1), up(A), mu)
  quadOut(p, B1, B, up(B), up(B1), f.u)
  quadOut(p, up(A1), up(B1), up(B), up(A), [0, 0, 1])
}

/** An archivolt: a band `w` wide outside radius r about o (the springing line's middle on the wall), `d` proud; its inner face only if `inner`. */
export function archBand(p: Part, f: Face, s: number, zs: number, r: number, w: number, d: number, seg = 8, inner = true) {
  const P = (t: number, rr: number, dd: number) => at(f, s + rr * Math.cos(t), zs + rr * Math.sin(t), dd)
  for (let k = 0; k < seg; k++) {
    const a = (Math.PI * k) / seg, b = (Math.PI * (k + 1)) / seg, m = (a + b) / 2
    const rad: V3 = [f.u[0] * Math.cos(m), f.u[1] * Math.cos(m), Math.sin(m)]
    quadOut(p, P(a, r, d), P(b, r, d), P(b, r + w, d), P(a, r + w, d), f.n)
    quadOut(p, P(a, r + w, 0), P(b, r + w, 0), P(b, r + w, d), P(a, r + w, d), rad)
    if (inner) quadOut(p, P(a, r, 0), P(b, r, 0), P(b, r, d), P(a, r, d), [-rad[0], -rad[1], -rad[2]])
  }
}

/**
 * A blind arch in relief on a face: an archivolt band `band` wide standing
 * `d` proud on two pilasters, springing at zs with inner radius r about s;
 * the pilasters run down to z0. Real depth, never paint.
 */
export function blindArch(p: Part, f: Face, s: number, z0: number, zs: number, r: number, o: { band?: number; d?: number; seg?: number; pil?: boolean; inner?: boolean } = {}) {
  const band = o.band ?? 0.45, d = (o.d ?? 0.28) * 1.4, seg = o.seg ?? 8
  archBand(p, f, s, zs, r, band, d, seg, o.inner ?? true)
  if (o.pil !== false) for (const e of [-1, 1]) pilaster(p, f, s + e * (r + band / 2), z0, zs, band, d)
}

/** A round-headed window panel flush on a face. */
export function win(p: Part, f: Face, s: number, sill: number, w: number, h: number, seg = 6) {
  archPanel(p, at(f, s, sill), f.u, f.n, w, Math.max(0.1, h - w / 2), seg, 0.05)
}

/** A round window (oculus) flush on a face, with a stone ring `ring` proud round it. */
export function oculus(p: Part, ringPart: Part | null, f: Face, s: number, z: number, r: number, seg = 12) {
  const pts: XY[] = Array.from({ length: seg }, (_, k) => [s + r * Math.cos((2 * Math.PI * k) / seg), z + r * Math.sin((2 * Math.PI * k) / seg)] as XY)
  const zc: V3 = [0, 0, 1]
  const su = unit([f.u[1] * zc[2] - 0, -f.u[0] * zc[2], 0])
  const flip = su[0] * f.n[0] + su[1] * f.n[1] >= 0
  planar(p, add([f.o[0], f.o[1], 0], f.n, 0.05), flip ? f.u : ([-f.u[0], -f.u[1], 0] as V3), zc, flip ? pts : pts.map(([a, b]) => [-a, b] as XY))
  if (ringPart) {
    for (let k = 0; k < seg; k++) {
      const a0 = (2 * Math.PI * k) / seg, a1 = (2 * Math.PI * (k + 1)) / seg, m = (a0 + a1) / 2
      const P = (a: number, rr: number, dd: number) => at(f, s + rr * Math.cos(a), z + rr * Math.sin(a), dd)
      const rad: V3 = [f.u[0] * Math.cos(m), f.u[1] * Math.cos(m), Math.sin(m)]
      quadOut(ringPart, P(a0, r + 0.35, 0), P(a1, r + 0.35, 0), P(a1, r + 0.35, 0.22), P(a0, r + 0.35, 0.22), rad)
      quadOut(ringPart, P(a0, r, 0.22), P(a1, r, 0.22), P(a1, r + 0.35, 0.22), P(a0, r + 0.35, 0.22), f.n)
    }
  }
}

/** Write a GLB, check its budget and print a line. */
export async function writeModel(file: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, meta: Record<string, unknown>, maxTris: number, maxBytes: number) {
  const used = parts.filter((q) => q.part.triangles > 0)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...meta })
  const tris = used.reduce((s, q) => s + q.part.triangles, 0)
  if (process.env.PARTS) console.log(file, tris, glb.length, used.map((q) => `${q.material.name}:${q.part.triangles}`).join(" "))
  if (tris > maxTris) throw new Error(`${file}: ${tris} triangles > ${maxTris}`)
  if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes > ${maxBytes}`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------

/** Plan constants (OSM-local metres). */
const CY = 5.5 // the E-W axis
const CX = 9.7 // the N-S axis
const DX = 10.0, DY = 5.3 // the drum's centre
const OX = 3.4, OY = 5.9 // the outline's centroid: the model's origin

export const COLORS = {
  stone: 0xe4cba1, // sunlit ashlar #ddc4a4..#d9c7ab, shade #948168, pulled to the palette's lightness
  roof: 0x59606a, // dark slate blue-grey sheet metal, as the telephoto and the SW photo show it
  gold: 0xd9b55c,
  panel: 0xa8894a, // the cone's darker bronze-gold panels between the gilded ribs
}

function build(detail: boolean) {
  const wall = new Part(), deco = new Part(), roof = new Part(), gold = new Part(), glaze = new Part(), door = new Part(), cone = new Part()
  const shade = roof // porch interiors: the dark slate tone, so the open arches read as openings
  const SEG = detail ? 8 : 6
  const mirrorY = (y: number) => 2 * CY - y
  const BA = (f: Face, s: number, z0: number, zs: number, r: number, o: { band?: number; d?: number; seg?: number; pil?: boolean } = {}) => blindArch(deco, f, s, z0, zs, r, { inner: detail, ...o })

  // ---- Massing --------------------------------------------------------
  // Lowest tier: the E-W body and the N-S body, cross-gabled (eaves 11.7).
  const T1E = 10.0
  gabled({ wall, roof, x0: -23.8, x1: 32.7, y0: CY - 22.1, y1: CY + 22.1, ze: T1E, zr: T1E + 22.1 * PITCH * 1.0, axis: 'x', skip: ['w'] })
  gabled({ wall, roof, x0: CX - 11.45, x1: CX + 11.45, y0: -21.0, y1: mirrorY(-21.0), ze: T1E, zr: T1E + 11.45 * PITCH, axis: 'y' })
  // second tier E-W (eaves 22.8, ridge 32.5) and its projecting west gable (ridge 30)
  gabled({ wall, roof, x0: -16.8, x1: 32.7, y0: CY - 16.85, y1: CY + 16.85, ze: 22.8, zr: 32.5, axis: 'x', z0: 10 })
  gabled({ wall, roof, x0: -23.8, x1: -16.8, y0: CY - 7.85, y1: CY + 7.85, ze: 30 - 7.85 * PITCH, zr: 30, axis: 'x', z0: 10, skip: ['e'] })
  // the arms (eaves 37.2, ridge 42)
  const AE = 37.8, AR = 43
  gabled({ wall, roof, x0: -16.8, x1: 32.7, y0: CY - 7.8, y1: CY + 7.8, ze: AE, zr: AR, axis: 'x', z0: 20, skip: ['e'] })
  gabled({ wall, roof, x0: CX - 7.6, x1: CX + 7.6, y0: -13.3, y1: mirrorY(-13.3), ze: AE, zr: AR, axis: 'y', z0: 12, skip: ['s', 'n'] })
  // the three apses, full height, hipped into the arms' ridges
  const sApse: XY[] = [[CX - 7.6, -13.3], [CX - 3.3, -18.6], [CX + 3.3, -18.6], [CX + 7.6, -13.3]]
  hipApse(wall, roof, [...sApse, [CX, -13.3]], AE, [CX, -13.3, AR], [3, 4])
  hipApse(wall, roof, [...sApse.map(([x, y]) => [x, mirrorY(y)] as XY).reverse(), [CX, mirrorY(-13.3)]], AE, [CX, mirrorY(-13.3), AR], [3, 4])
  const eApse: XY[] = [[32.7, CY - 7.8], [36.3, CY - 4.3], [36.3, CY + 4.3], [32.7, CY + 7.8]]
  hipApse(wall, roof, [...eApse, [32.7, CY]], AE, [32.7, CY, AR], [3, 4])

  // Porches: west (ridge 18, 23 m wide, three open arches), south and north (ridge 14.7).
  const WP = { x0: -32.6, x1: -23.8, hw: 11.6 }
  // the tier-1 central west gable stands behind a low projecting arcade
  const WA = -29.6 // the gable's face; the arcade runs from WP.x0 to here
  gabled({ wall, roof, x0: WA, x1: WP.x1, y0: CY - WP.hw, y1: CY + WP.hw, ze: 18 - WP.hw * PITCH, zr: 18, axis: 'x', skip: ['e'] })
  const SP = { hw: 6.5, y0: -26.7, y1: -21.0 }
  for (const m of [false, true]) {
    const y0 = m ? mirrorY(SP.y1) : SP.y0, y1 = m ? mirrorY(SP.y0) : SP.y1
    gabled({ wall, roof, x0: CX - SP.hw, x1: CX + SP.hw, y0, y1, ze: 14.7 - SP.hw * PITCH, zr: 14.7, axis: 'y', skip: ['s', 'n', 'w', 'e'] })
  }

  // ---- Base course: 1.2 m, a little proud, round the whole outline. ----
  const outline: XY[] = [
    [-23.8, CY - 22.1], [CX - 11.45, CY - 22.1], [CX - 11.45, -21.0], [CX - SP.hw, -21.0], [CX - SP.hw, -26.7], [CX + SP.hw, -26.7],
    [CX + SP.hw, -21.0], [CX + 11.45, -21.0], [CX + 11.45, CY - 22.1], [32.7, CY - 22.1], [32.7, CY - 7.8], [36.3, CY - 4.3],
  ]
  const full: XY[] = [...outline, ...[...outline].reverse().map(([x, y]) => [x, mirrorY(y)] as XY)]
  // west: the porch
  const westPorch: XY[] = [[-23.8, CY + WP.hw], [WP.x0, CY + WP.hw], [WP.x0, CY - WP.hw], [-23.8, CY - WP.hw]] // the arcade and the gable behind it
  const base = [...full, ...westPorch]
  // a plinth band proud of every wall (drawn as an offset ring's walls and lip)
  {
    const n = base.length
    const off = (i: number): XY => {
      const a = base[(i + n - 1) % n], b = base[i], c = base[(i + 1) % n]
      const u1 = unit([b[0] - a[0], b[1] - a[1], 0]), u2 = unit([c[0] - b[0], c[1] - b[1], 0])
      const n1: XY = [u1[1], -u1[0]], n2: XY = [u2[1], -u2[0]]
      const s = 1 + n1[0] * n2[0] + n1[1] * n2[1]
      return [b[0] + (0.4 * (n1[0] + n2[0])) / Math.max(0.3, s), b[1] + (0.4 * (n1[1] + n2[1])) / Math.max(0.3, s)]
    }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, A = off(i), B = off(j), a = base[i], b = base[j]
      const nrm = unit([b[1] - a[1], a[0] - b[0], 0])
      quadOut(wall, [A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], 1.2], [A[0], A[1], 1.2], nrm)
      quadOut(wall, [A[0], A[1], 1.2], [B[0], B[1], 1.2], [b[0], b[1], 1.45], [a[0], a[1], 1.45], [nrm[0], nrm[1], 1])
    }
  }

  // ---- The west porch: a low arcade projecting from the central gable,
  // three big round arches (the middle one wider and taller) under bold
  // stepped archivolts, a lean-to roof back to the gable; real openings.
  {
    const L = 2 * WP.hw, D = WA - WP.x0, ZT = 8.6
    const f = faceOf([WP.x0, CY + WP.hw], [WP.x0, CY - WP.hw])
    const arches: Array<[number, number, number]> = [[L / 2, 5.8, 4.2], [L / 2 - 7.4, 4.2, 3.4], [L / 2 + 7.4, 4.2, 3.4]]
    holedWall(wall, f, [[0, 0], [L, 0], [L, ZT], [0, ZT]], arches.map(([c, w, j]) => archRing(c, 1.45, w, j, SEG + 2)), 1.2, shade)
    for (const [c, w, j] of arches) BA(f, c, 1.45, 1.45 + j, w / 2, { band: 0.8, d: 0.7, seg: SEG + 2 })
    // the sides: an arch each
    for (const m of [false, true]) {
      const y = m ? CY + WP.hw : CY - WP.hw
      const fs = m ? faceOf([WA, y], [WP.x0, y]) : faceOf([WP.x0, y], [WA, y])
      holedWall(wall, fs, [[0, 0], [D, 0], [D, ZT], [0, ZT]], [archRing(D / 2, 1.45, 1.6, 2.6, SEG)], 1.0)
    }
    // floor, ceiling and the lean-to roof
    quadOut(wall, [WP.x0 + 1.2, CY - WP.hw + 1.0, 1.45], [WA, CY - WP.hw + 1.0, 1.45], [WA, CY + WP.hw - 1.0, 1.45], [WP.x0 + 1.2, CY + WP.hw - 1.0, 1.45], [0, 0, 1])
    quadOut(shade, [WP.x0 + 1.2, CY - WP.hw + 1.0, 7.75], [WA, CY - WP.hw + 1.0, 7.75], [WA, CY + WP.hw - 1.0, 7.75], [WP.x0 + 1.2, CY + WP.hw - 1.0, 7.75], [0, 0, -1])
    const X0 = WP.x0 - 0.5, Y0 = CY - WP.hw - 0.4, Y1 = CY + WP.hw + 0.4
    quadOut(roof, [X0, Y0, ZT], [WA, Y0, ZT + 1.6], [WA, Y1, ZT + 1.6], [X0, Y1, ZT], [-0.5, 0, 1])
    quadOut(roof, [X0, Y0, ZT - 0.3], [X0, Y1, ZT - 0.3], [X0, Y1, ZT], [X0, Y0, ZT], [-1, 0, 0])
    for (const [y, d] of [[Y0, -1], [Y1, 1]] as const) triOut(roof, [X0, y, ZT - 0.3], [WA, y, ZT + 1.3], [WA, y, ZT + 1.6], [0, d, 0])
    // the portal in the gable's foot inside, and the gable above: its great arch, three windows, an oculus
    const g = faceOf([WA, CY + WP.hw], [WA, CY - WP.hw])
    // the shaded back wall inside the arcade (drawn dark so the arches read open)
    quadOut(shade, at(g, 1.0, 1.45, 0.02), at(g, L - 1.0, 1.45, 0.02), at(g, L - 1.0, 7.75, 0.02), at(g, 1.0, 7.75, 0.02), g.n)
    archPanel(door, at(g, L / 2, 1.45), g.u, g.n, 3.6, 4.2, SEG, 0.05)
    BA(g, L / 2, ZT + 1.6, 12.2, 4.3, { band: 0.7, d: 0.45, seg: SEG + 2 })
    for (const k of [-1, 0, 1]) win(glaze, g, L / 2 + k * 1.9, 10.4, 1.0, k === 0 ? 4.4 : 3.6, SEG)
    oculus(glaze, deco, g, L / 2, 15.6, 0.8, detail ? 12 : 8)
  }
  // ---- South and north porches: one great open arch each, doors inside.
  for (const m of [false, true]) {
    const yF = m ? mirrorY(SP.y0) : SP.y0, yB = m ? mirrorY(SP.y1) : SP.y1, d = m ? 1 : -1
    const f = m ? faceOf([CX + SP.hw, yF], [CX - SP.hw, yF]) : faceOf([CX - SP.hw, yF], [CX + SP.hw, yF])
    const L = 2 * SP.hw, ze = 14.7 - SP.hw * PITCH
    holedWall(wall, f, [[0, 0], [L, 0], [L, ze], [L / 2, 14.7], [0, ze]], [archRing(L / 2, 1.45, 5.4, 5.0, SEG + 2)], 0.9, shade)
    BA(f, L / 2, 1.45, 6.45, 2.7, { band: 0.55, d: 0.32, seg: SEG + 2 })
    oculus(glaze, deco, f, L / 2, 10.9, 0.7, detail ? 12 : 8)
    for (const e of [-1, 1]) {
      const x = CX + e * SP.hw
      const fs = (e > 0) !== m ? faceOf([x, yF], [x, yB]) : faceOf([x, yB], [x, yF])
      const Ls = Math.abs(yB - yF)
      holedWall(wall, fs, [[0, 0], [Ls, 0], [Ls, ze], [0, ze]], [archRing(Ls / 2, 1.45, 2.6, 3.0, SEG)], 0.9)
    }
    const g = m ? faceOf([CX + SP.hw - 0.9, yB + 0.01], [CX - SP.hw + 0.9, yB + 0.01]) : faceOf([CX - SP.hw + 0.9, yB - 0.01], [CX + SP.hw - 0.9, yB - 0.01])
    quadOut(shade, at(g, 0, 0), at(g, L - 1.8, 0), at(g, L - 1.8, ze), at(g, 0, ze), g.n)
    archPanel(door, at(g, (L - 1.8) / 2, 1.45), g.u, g.n, 2.6, 3.0, SEG, 0.05)
    quadOut(wall, [CX - SP.hw + 0.9, yF - d * -0.9, 1.45], [CX + SP.hw - 0.9, yF - d * -0.9, 1.45], [CX + SP.hw - 0.9, yB, 1.45], [CX - SP.hw + 0.9, yB, 1.45], [0, 0, 1])
    quadOut(shade, [CX - SP.hw + 0.9, yF - d * -0.9, 8.8], [CX + SP.hw - 0.9, yF - d * -0.9, 8.8], [CX + SP.hw - 0.9, yB, 8.8], [CX - SP.hw + 0.9, yB, 8.8], [0, 0, -1])
  }

  // ---- Blind arcades and windows ------------------------------------
  /**
   * A gable face: a great archivolt under the gable framing `n` windows and,
   * in the detail model, an oculus; `zb` is where the face comes clear of
   * the roofs in front of it.
   */
  const gableFace = (f: Face, L: number, zb: number, ze: number, n: number, big = true) => {
    const r = 0.34 * L, zs = ze - 0.12 * L
    if (big) BA(f, L / 2, Math.max(zb, zs - 0.6 * L), zs, r, { band: Math.max(0.45, 0.035 * L), d: 0.32, seg: SEG + 2, pil: true })
    const ww = Math.min(1.5, (1.4 * r) / (n + 1)), hgt = Math.min(0.45 * L, zs - zb - 0.8 + 0.1 * L)
    const sill = zs + 0.08 * L - hgt
    for (let i = 0; i < n; i++) {
      const s = L / 2 + (i - (n - 1) / 2) * (ww * 2.1)
      win(glaze, f, s, sill, ww, hgt, SEG)
    }
    if (detail || L > 15) oculus(glaze, detail ? deco : null, f, L / 2, zs + 0.55 * r, Math.max(0.55, 0.05 * L), detail ? 12 : 8)
  }
  /** A wall of tall blind arches, `bays` of them, each with a window, between zb and ze. */
  const bayFace = (f: Face, s0: number, s1: number, zb: number, ze: number, bays: number, winFrac = 0.6) => {
    const bw = (s1 - s0) / bays, r = bw * 0.36, zs = ze - 0.9 - r
    if (zs - zb < 1.5) return
    for (let i = 0; i < bays; i++) {
      const s = s0 + bw * (i + 0.5)
      BA(f, s, zb, zs, r, { band: 0.42, d: 0.26, seg: SEG, pil: detail })
      const hgt = Math.min((zs - zb) * winFrac + r * 0.7, zs + r - zb - 1)
      if (hgt > 1.4) win(glaze, f, s, zs + r * 0.6 - hgt, Math.min(1.2, r * 0.55), hgt, SEG)
    }
    if (!detail) for (let i = 0; i <= bays; i++) pilaster(deco, f, s0 + bw * i, zb, zs + r * 0.4, 0.5, 0.26)
  }

  // West: tier-1 shoulders, tier-2 gable and shoulders, the arm's gable.
  for (const m of [false, true]) {
    const yA = m ? CY + 22.1 : CY - WP.hw, yB = m ? CY + WP.hw : CY - 22.1
    const f = faceOf([-23.8, yA], [-23.8, yB])
    bayFace(f, 0, Math.abs(yA - yB), 1.45, T1E, 2)
  }
  gableFace(faceOf([-23.8, CY + 7.85], [-23.8, CY - 7.85]), 15.7, 18.2, 30 - 7.85 * PITCH, 3)
  for (const m of [false, true]) {
    const yA = m ? CY + 16.85 : CY - 7.85, yB = m ? CY + 7.85 : CY - 16.85
    const f = faceOf([-16.8, yA], [-16.8, yB])
    const L = 9, zt = 22.8 + (m ? 0 : 0)
    const s = m ? L * 0.42 : L * 0.58
    win(glaze, f, s, zt - 6.2, 1.1, 4.4, SEG)
    BA(f, s, zt - 6.4, zt - 2.6, 1.2, { band: 0.4, seg: SEG, pil: detail })
  }
  gableFace(faceOf([-16.8, CY + 7.8], [-16.8, CY - 7.8]), 15.6, 30.2, AE, 3)

  // South and north (mirrored): tier-1 long walls, porch shoulders, tier-2
  // long walls, the apses' faces and the arm's long walls above.
  for (const m of [false, true]) {
    const Y = (y: number) => (m ? mirrorY(y) : y)
    const F = (x0: number, x1: number, y: number) => (m ? faceOf([x1, Y(y)], [x0, Y(y)]) : faceOf([x0, Y(y)], [x1, Y(y)]))
    // tier-1 long walls either side of the N-S body
    bayFace(F(-23.8, CX - 11.45, CY - 22.1), 0, CX - 11.45 + 23.8, 1.45, T1E, 3)
    bayFace(F(CX + 11.45, 32.7, CY - 22.1), 0, 32.7 - CX - 11.45, 1.45, T1E, 2)
    // the N-S body's gable shoulders beside the porch
    for (const e of [-1, 1]) {
      const x0 = e < 0 ? CX - 11.45 : CX + SP.hw, x1 = e < 0 ? CX - SP.hw : CX + 11.45
      const f = F(x0, x1, -21.0)
      const L = x1 - x0
      BA(f, L / 2, 1.45, 7.0, 1.6, { band: 0.42, seg: SEG, pil: detail })
      win(glaze, f, L / 2, 3.2, 1.1, 4.4, SEG)
    }
    // tier-2 long walls, above the tier-1 roof (14.4 there)
    bayFace(F(-16.8, CX - 7.6, CY - 16.85), 0, CX - 7.6 + 16.8, 14.6, 22.8, 3, 0.45)
    bayFace(F(CX + 7.6, 32.7, CY - 16.85), 0, 32.7 - CX - 7.6, 14.6, 22.8, 2, 0.45)
    // the apse: its front face carries the great arch, the chamfers a tall window each
    {
      const a = sApse.map(([x, y]) => [x, Y(y)] as XY)
      const pairs: Array<[XY, XY]> = m ? [[a[3], a[2]], [a[2], a[1]], [a[1], a[0]]] : [[a[0], a[1]], [a[1], a[2]], [a[2], a[3]]]
      pairs.forEach(([p, q], i) => {
        const f = faceOf(p, q), L = Math.hypot(q[0] - p[0], q[1] - p[1])
        if (i === 1) {
          BA(f, L / 2, 18.5, 31.6, 2.5, { band: 0.6, d: 0.35, seg: SEG + 2 })
          for (const k of [-1, 0, 1]) win(glaze, f, L / 2 + k * 1.45, 22.5, 0.9, k === 0 ? 9.6 : 8.2, SEG)
          win(glaze, f, L / 2, 15.2, 1.0, 2.2, SEG)
        } else {
          BA(f, L / 2, 18.5, 31.6, 1.9, { band: 0.45, seg: SEG, pil: detail })
          win(glaze, f, L / 2, 23.5, 1.1, 9.0, SEG)
        }
      })
    }
    // the arm's long walls between the apse and the drum
    bayFace(F(-16.8, CX - 7.6, CY - 7.8), 0, CX - 7.6 + 16.8, 32.8, AE, 3, 0.3)
    bayFace(F(CX + 7.6, 32.7, CY - 7.8), 0, 32.7 - CX - 7.6, 32.8, AE, 2, 0.3)
  }
  // East: tier-1 and tier-2 shoulders round the apse, the apse's faces.
  for (const m of [false, true]) {
    const Y = (y: number) => (m ? mirrorY(y) : y)
    const f1 = m ? faceOf([32.7, Y(CY - 22.1)], [32.7, Y(CY - 16.85)]) : faceOf([32.7, CY - 22.1], [32.7, CY - 16.85])
    void f1
    const f = m ? faceOf([32.7, Y(CY - 7.8)], [32.7, Y(CY - 22.1)]) : faceOf([32.7, CY - 22.1], [32.7, CY - 7.8])
    bayFace(f, 0, 14.3, 1.45, T1E, 2)
    const g = m ? faceOf([32.7, Y(CY - 7.8)], [32.7, Y(CY - 16.85)]) : faceOf([32.7, CY - 16.85], [32.7, CY - 7.8])
    win(glaze, g, 4.5, 15.8, 1.1, 4.4, SEG)
    BA(g, 4.5, 15.6, 19.6, 1.2, { band: 0.4, seg: SEG, pil: detail })
  }
  {
    const a = eApse
    for (const [i, [p, q]] of ([[a[0], a[1]], [a[1], a[2]], [a[2], a[3]]] as Array<[XY, XY]>).entries()) {
      const f = faceOf(p, q), L = Math.hypot(q[0] - p[0], q[1] - p[1])
      BA(f, L / 2, 1.45, i === 1 ? 31.6 : 31.0, i === 1 ? 2.6 : 1.7, { band: 0.55, d: 0.32, seg: SEG + 2 })
      win(glaze, f, L / 2, 22.5, 1.1, 9.0, SEG)
      win(glaze, f, L / 2, 4.0, 1.1, 5.5, SEG)
      if (i === 1) for (const k of [-1, 1]) win(glaze, f, L / 2 + k * 1.6, 23.5, 0.8, 7.0, SEG)
    }
  }

  // ---- Over the crossing: the square pedestal, the drum, cornice, cone, cross.
  const NF = 12, A0 = 0 // twelve faces; a corner due east
  const RF = 10.0, RC = RF / Math.cos(Math.PI / NF) // across the flats 20 m
  const Z = { ped: 45.6, drum0: 45.6, drum1: 62.4, corn: 64.4, cone0: 65.0, apex: 78.4, top: 86.1 }
  // pedestal: a square block from the arms up to the drum's foot, its corners chamfered, flat grey top
  prism(wall, [[DX - 8.2, DY - 6.2], [DX - 6.2, DY - 8.2], [DX + 6.2, DY - 8.2], [DX + 8.2, DY - 6.2], [DX + 8.2, DY + 6.2], [DX + 6.2, DY + 8.2], [DX - 6.2, DY + 8.2], [DX - 8.2, DY + 6.2]], 38, Z.ped - 0.6, roof)
  lathe(wall, [[RC + 0.35, Z.ped - 0.7], [RC + 0.35, Z.ped + 0.6], [RC, Z.ped + 0.9]], NF, [DX, DY], A0, false)
  // the shaft
  lathe(wall, [[RC, Z.ped + 0.9], [RC, Z.drum1]], NF, [DX, DY], A0, false)
  // the cornice: a deep corbelled flare
  lathe(wall, [[RC, Z.drum1], [RC + 0.25, Z.drum1 + 0.6], [RC + 0.55, Z.drum1 + 1.5], [RC + 0.9, Z.corn]], NF, [DX, DY], A0, false)
  // the cone: a flared gilded eave, then twelve straight facets to the apex
  const RE = RC + 1.5
  // the gilded eave band, then twelve facets to the apex, each a darker
  // bronze-gold panel between gold ribs down the corners (the telephoto's
  // dark panels; from the sun-side it all reads gold)
  lathe(gold, [[RC + 0.9, Z.corn], [RE, Z.corn - 0.15], [RE - 0.25, Z.corn + 0.35], [RC + 0.7, Z.cone0]], NF, [DX, DY], A0, false)
  {
    const prof: Array<[number, number]> = [[RC + 0.7, Z.cone0], [RC * 0.6, Z.cone0 + (Z.apex - Z.cone0) * 0.33], [RC * 0.27, Z.cone0 + (Z.apex - Z.cone0) * 0.7], [0.55, Z.apex - 0.3]]
    const RIB = 0.55
    for (let i = 0; i < NF; i++) {
      const a = A0 + (i * 2 * Math.PI) / NF, b = A0 + ((i + 1) * 2 * Math.PI) / NF, m = (a + b) / 2
      const P = (r: number, z: number, s: number): V3 => {
        const x0 = r * Math.cos(a), y0 = r * Math.sin(a), x1 = r * Math.cos(b), y1 = r * Math.sin(b)
        return [DX + x0 + (x1 - x0) * s, DY + y0 + (y1 - y0) * s, z]
      }
      for (let k = 0; k < prof.length - 1; k++) {
        const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
        const w0 = 2 * r0 * Math.sin(Math.PI / NF), w1 = 2 * r1 * Math.sin(Math.PI / NF)
        const f0 = Math.min(0.42, RIB / w0), f1 = Math.min(0.42, RIB / w1)
        const out: V3 = [Math.cos(m) * (z1 - z0), Math.sin(m) * (z1 - z0), r0 - r1]
        quadOut(gold, P(r0, z0, 0), P(r0, z0, f0), P(r1, z1, f1), P(r1, z1, 0), out)
        quadOut(cone, P(r0, z0, f0), P(r0, z0, 1 - f0), P(r1, z1, 1 - f1), P(r1, z1, f1), out)
        quadOut(gold, P(r0, z0, 1 - f0), P(r0, z0, 1), P(r1, z1, 1), P(r1, z1, 1 - f1), out)
      }
    }
  }
  lathe(gold, [[0.55, Z.apex - 0.3], [0.7, Z.apex], [0.75, Z.apex + 0.45], [0.5, Z.apex + 0.9], [0.18, Z.apex + 1.1]], detail ? 12 : 8, [DX, DY])
  // the cross: a Georgian cross with flared, trefoil ends
  {
    const c: V3 = [DX, DY, 0]
    const z0 = Z.apex + 1.0, z1 = Z.top, zb = z0 + (z1 - z0) * 0.68, half = (z1 - z0) * 0.3
    beam(gold, [c[0], c[1], z0], [c[0], c[1], z1 - 0.35], 0.42, 0.42)
    beam(gold, [c[0], c[1] - half + 0.35, zb], [c[0], c[1] + half - 0.35, zb], 0.42, 0.42)
    for (const [p, dir] of [[[c[0], c[1], z1 - 0.35], [0, 0, 1]], [[c[0], c[1] - half + 0.35, zb], [0, -1, 0]], [[c[0], c[1] + half - 0.35, zb], [0, 1, 0]]] as Array<[V3, V3]>) {
      const q = add(p, dir, 0.3)
      box(gold, q, dir[1] ? 0.3 : 0.35, dir[1] ? 0.35 : 0.3, dir[2] ? 0.3 : 0.35, 0, gold)
      if (detail) for (const s of [-1, 1]) {
        const side: V3 = dir[2] ? [0, s, 0] : [0, 0, s]
        box(gold, add(add(p, dir, 0.15), side, 0.38), 0.18, 0.18, 0.18, 0, gold)
      }
    }
  }
  // the drum's twelve faces: a long round-headed window each, between
  // colonnettes carrying an arch, real relief
  for (let i = 0; i < NF; i++) {
    const t = A0 + ((i + 0.5) * 2 * Math.PI) / NF
    const nn: V3 = [Math.cos(t), Math.sin(t), 0]
    const uu: V3 = [-Math.sin(t), Math.cos(t), 0]
    const fw = 2 * RF * Math.tan(Math.PI / NF) // 5.36 m
    const f: Face = { o: [DX + RF * nn[0] - uu[0] * fw / 2, DY + RF * nn[1] - uu[1] * fw / 2, 0], u: uu, n: nn }
    const s = fw / 2
    win(glaze, f, s, 48.4, 1.5, 10.6, SEG)
    BA(f, s, Z.ped + 1.4, 58.1, 1.05, { band: 0.36, d: 0.3, seg: SEG, pil: detail })
    if (detail) {
      // the paired colonnettes at the corners and the little arches of the frieze
      for (const e of [0.18, fw - 0.18]) pilaster(deco, f, e, Z.ped + 1.4, Z.drum1 - 0.4, 0.3, 0.22)
      for (let k = 0; k < 4; k++) hood(deco, at(f, fw * (k + 0.5) / 4, Z.drum1 + 0.55), f.u, f.n, fw / 8 - 0.12, 0.12, 0.3, 4)
      // a gold rib down each corner of the cone
      const tc = A0 + (i * 2 * Math.PI) / NF
      const cn: V3 = [Math.cos(tc), Math.sin(tc), 0]
      beam(gold, [DX + cn[0] * (RE - 0.1), DY + cn[1] * (RE - 0.1), Z.corn + 0.1], [DX + cn[0] * (RC + 0.6), DY + cn[1] * (RC + 0.6), Z.cone0 + 0.08], 0.28, 0.28)
      beam(gold, [DX + cn[0] * (RC + 0.6), DY + cn[1] * (RC + 0.6), Z.cone0 + 0.08], [DX + cn[0] * 0.55, DY + cn[1] * 0.55, Z.apex - 0.2], 0.28, 0.28)
    } else {
      void cylinder
    }
  }

  // the relief is the same ashlar as the walls: one material
  wall.pos.push(...deco.pos); wall.nrm.push(...deco.nrm); wall.uv.push(...deco.uv)
  const parts = [wall, roof, gold, glaze, door, cone]
  shift(parts, OX, OY)
  const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 0.9)
  return [
    { part: wall, material: { ...finish('sameba-stone', COLORS.stone), floodlight: lit } },
    { part: roof, material: { ...finish('sameba-roof', COLORS.roof, 0.6), floodlight: (_p: V3, n: V3) => (n[2] > 0.5 ? 0.15 : 0.5) } },
    { part: gold, material: { ...finish('sameba-gold', COLORS.gold, 0.35), floodlight: () => 0.85 } },
    { part: cone, material: { ...finish('sameba-cone-panels', COLORS.panel, 0.4), floodlight: () => 0.75 } },
    { part: glaze, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x8a6a4a } },
  ]
}

if (import.meta.main) {
  const meta = { bearing: 0, osm: 'way/585352693', height: 86.1 }
  await writeModel('tbilisi-holy-trinity-cathedral.glb', 'Holy Trinity Cathedral (Tsminda Sameba)', build(false), meta, 6500, 250 * 1024)
  await writeModel('tbilisi-holy-trinity-cathedral.detail.glb', 'Holy Trinity Cathedral (Tsminda Sameba)', build(true), meta, 40000, 1536 * 1024)
}
