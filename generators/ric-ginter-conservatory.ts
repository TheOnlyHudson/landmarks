/**
 * Lewis Ginter Botanical Garden Conservatory, Richmond — procedural,
 * CC0-1.0, no textures.
 * bun generators/ric-ginter-conservatory.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/275860188 "Conservatory" (lng -77.4719635, lat
 * 37.6214752). Its walls run at 59° and 149°, so the model is placed at
 * bearing 59 and built square: model +x points SSE, the garden front with
 * the arched entrance porch, which looks down the lawn to the crescent pool.
 *
 * What it is: the conservatory (2003, Shepley Bulfinch with Rodney Robinson)
 * in the manner of a Victorian glasshouse: a two-storey square glass
 * pavilion framed in white, under a glass dome on a glazed drum with a
 * lantern; one-storey glass wings with curved eaves running out on either
 * side and behind; a white arcaded entrance porch on the garden front.
 *
 * Covers and replaces: way/275860188 (the one outline; OSM has no parts).
 *
 * Evidence
 * - OSM (measured): the outline, split into its parts in the bearing-59
 *   frame: the pavilion x -3.2..15.4, y -6.8..12.6; the porch x 15.1..21.2,
 *   y -1.2..8.2; the front wings x 0.5..11.7, y 12.6..37.5 and x 1.4..11.4,
 *   y -30.5..-6.8; the back wing x -24.7..-3.0, y -2.4..8.0; the back-left
 *   wing x -18.7..-8.3, y -30.2..-12.1 and its link to the back wing.
 * - Lidar: not used (heights scaled from the photos, cross-checked with the
 *   18.6 m pavilion).
 * - Photos (Wikimedia Commons, EVIDENCE; each at
 *   https://commons.wikimedia.org/wiki/File:<name with underscores>):
 *   "Lewis Ginter Conservatory (3996473341).jpg" (Kim, CC BY-SA 2.0), the
 *   garden front square on: pavilion cornice 9 m, the wings 6.3 m with
 *   curved eaves from 3.6 m, dome 9 m across rising about 5.6 m over a
 *   1.9 m drum, lantern to about 19.6 m, the three-arched porch about 5 m;
 *   "Exterior View of Lewis Ginter Conservatory.JPG" (Bobt54, CC BY 3.0),
 *   the front three-quarter: the drum's glazing, the dome's ribs, the
 *   white frame; "Conservatory at Lewis Ginter Botanical Gardens -
 *   panoramio.jpg" (bobt54, CC BY 3.0), the dome reflected.
 * - Colours: white-painted frame, pale clear glass (drawn translucent,
 *   tinted, per STYLE.md), green planting seen through it.
 * - Estimated: all heights (from the photos, above); the back wings'
 *   profile (taken as the front wings'); the rib spacing (4 m, coarser
 *   than the real glazing bars); the plants inside (palms and beds,
 *   invented masses to give the glass something to show).
 * - Simplified: the wings' rounded hip ends are drawn as plain profile
 *   ends; no glazing bars, cresting or urns.
 * - Night: glass stays dark (`glass`), as STYLE.md asks for glass roofs.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, panel, arc, qf, tf, type Side, type Rect } from './dc-white-house'
import { saveModel, lathe, type Mat } from './dc-nga-west'

const glass = new Part(), frame = new Part(), plants = new Part(), base = new Part()

const KNEE = 0.6, WALL = 3.6, CURVE = 2.6, WTOP = 6.6

/** The wing's cross-section across its width w: (offset from the near edge, z). */
function profile(w: number): [number, number][] {
  const pts: [number, number][] = [[0, KNEE], [0, WALL]]
  for (const [c, s] of arc(CURVE, WALL, CURVE, 180, 90, 5).slice(1)) pts.push([c, s])
  pts.push([w / 2, WTOP])
  const far = pts.slice(0, -1).reverse().map(([d, z]) => [w - d, z] as [number, number])
  return pts.concat(far)
}

/** A glass wing over rect r, its long axis along y (`ns`) or x. */
function wing(r: Rect, ns: boolean, capLo = true, capHi = true) {
  const w = ns ? r.x1 - r.x0 : r.y1 - r.y0
  const [l0, l1] = ns ? [r.y0, r.y1] : [r.x0, r.x1]
  const pr = profile(w)
  const P = (d: number, z: number, l: number): V3 => (ns ? [r.x0 + d, l, z] : [l, r.y0 + d, z])
  // knee wall (frame white)
  cbox(base, r, 0, KNEE, { top: false })
  // glazed skin, each strip facing out
  for (let i = 0; i < pr.length - 1; i++) {
    const [d0, z0] = pr[i], [d1, z1] = pr[i + 1]
    // outward: away from the middle of the section
    let nd = z1 - z0, nz = -(d1 - d0)
    if (((d0 + d1) / 2 - w / 2) * nd + ((z0 + z1) / 2 - 2) * nz < 0) { nd = -nd; nz = -nz }
    const n: V3 = ns ? [nd, 0, nz] : [0, nd, nz]
    qf(glass, P(d0, z0, l0), P(d1, z1, l0), P(d1, z1, l1), P(d0, z0, l1), n)
  }
  // profile ends: fan from the middle
  const c: [number, number] = [w / 2, (KNEE + WTOP) / 2]
  for (const [l, s] of [[l0, -1], [l1, 1]] as [number, number][]) {
    if ((s < 0 && !capLo) || (s > 0 && !capHi)) continue
    const n: V3 = ns ? [0, s, 0] : [s, 0, 0]
    for (let i = 0; i < pr.length - 1; i++) tf(glass, P(c[0], c[1], l), P(pr[i][0], pr[i][1], l), P(pr[i + 1][0], pr[i + 1][1], l), n)
    tf(glass, P(c[0], c[1], l), P(pr[pr.length - 1][0], pr[pr.length - 1][1], l), P(pr[0][0], pr[0][1], l), n)
  }
  // white frame: ribs every ~4 m following the profile, the eaves lines, the ridge
  const L = l1 - l0, nr = Math.max(2, Math.round(L / 4))
  for (let k = 0; k <= nr; k++) {
    const l = l0 + (L * k) / nr
    for (let i = 0; i < pr.length - 1; i++) rib(P, pr[i], pr[i + 1], l, ns, w)
  }
  for (const d of [0, w]) {
    const s = d === 0 ? -1 : 1
    const R = ns ? rect(r.x0 + d - 0.12 + s * 0.06, r.x0 + d + 0.12 + s * 0.06, l0, l1) : rect(l0, l1, r.y0 + d - 0.12 + s * 0.06, r.y0 + d + 0.12 + s * 0.06)
    cbox(frame, R, WALL - 0.18, WALL + 0.12, { bottom: true })
  }
  const RR = ns ? rect(r.x0 + w / 2 - 0.15, r.x0 + w / 2 + 0.15, l0, l1) : rect(l0, l1, r.y0 + w / 2 - 0.15, r.y0 + w / 2 + 0.15)
  cbox(frame, RR, WTOP - 0.05, WTOP + 0.2, { bottom: false })
}

/** A white rib on the glass between two profile points, at position l along the wing. */
function rib(P: (d: number, z: number, l: number) => V3, a: [number, number], b: [number, number], l: number, ns: boolean, w: number) {
  const t = 0.09, o = 0.04
  const nd = b[1] - a[1], nz = -(b[0] - a[0]), m = Math.hypot(nd, nz) || 1
  let ud = nd / m, uz = nz / m
  // outward: away from the profile's middle
  if ((a[0] - w / 2) * ud + (a[1] - 2) * uz < 0) { ud = -ud; uz = -uz }
  const A = (p: [number, number], s: number) => P(p[0] + ud * o, p[1] + uz * o, l + s)
  const n: V3 = ns ? [ud, 0, uz] : [0, ud, uz]
  qf(frame, A(a, -t), A(b, -t), A(b, t), A(a, t), n)
}

// ===========================================================================
// wings (OSM)
wing(rect(0.5, 11.66, 12.6, 37.5), true, false, true)
wing(rect(1.44, 11.4, -30.5, -6.8), true, true, false)
wing(rect(-24.7, -3.2, -2.35, 8.0), false, true, false)
wing(rect(-18.7, -8.25, -30.2, -12.1), true, true, true)
wing(rect(-15.65, -10.75, -12.1, -2.35), true, false, false)

// ===========================================================================
// the pavilion: glass walls in a white frame, cornice, low roof, drum, dome
const PX0 = -3.2, PX1 = 15.4, PY0 = -6.8, PY1 = 12.6, CX = (PX0 + PX1) / 2, CY = (PY0 + PY1) / 2
const COR = 9.0
cbox(base, rect(PX0, PX1, PY0, PY1), 0, KNEE, { top: false })
// glass walls (each face a single sheet; cbox winds them out)
cbox(glass, rect(PX0, PX1, PY0, PY1), KNEE, COR, { top: false })
// frame: corner posts, posts every ~3 m, a band between the storeys, cornice
for (const [side, at, a0, a1] of [['s', PY0, PX0, PX1], ['n', PY1, PX0, PX1], ['w', PX0, PY0, PY1], ['e', PX1, PY0, PY1]] as [Side, number, number, number][]) {
  const n = 6
  for (let k = 0; k <= n; k++) {
    const a = a0 + ((a1 - a0) * k) / n
    panel(frame, side, at, Math.max(a0, a - 0.2), Math.min(a1, a + 0.2), KNEE, COR, 0.05)
  }
  panel(frame, side, at, a0, a1, 4.6, 5.0, 0.05)
}
cbox(frame, rect(PX0 - 0.4, PX1 + 0.4, PY0 - 0.4, PY1 + 0.4), COR, COR + 0.6, { b: 0.2, bottom: true, top: false })
// low hipped glass roof up to the drum
{
  const r0 = rect(PX0 - 0.2, PX1 + 0.2, PY0 - 0.2, PY1 + 0.2), z0 = COR + 0.6, z1 = 10.4, h = 5.0
  const lo: V3[] = [[r0.x0, r0.y0, z0], [r0.x1, r0.y0, z0], [r0.x1, r0.y1, z0], [r0.x0, r0.y1, z0]]
  const hi: V3[] = [[CX - h, CY - h, z1], [CX + h, CY - h, z1], [CX + h, CY + h, z1], [CX - h, CY + h, z1]]
  for (let k = 0; k < 4; k++) {
    const m = (k + 1) % 4
    const out: V3 = [k === 1 ? 1 : k === 3 ? -1 : 0, k === 0 ? -1 : k === 2 ? 1 : 0, 2]
    qf(glass, lo[k], lo[m], hi[m], hi[k], out)
  }
}
// the drum: glazed, with white bands; the dome with ribs; the lantern
const DR = 4.6, D0 = 10.4, D1 = 12.3
lathe(glass, CX, CY, [[DR, D0], [DR, D1]], 16, false)
lathe(frame, CX, CY, [[DR + 0.15, D0], [DR + 0.15, D0 + 0.3], [DR - 0.05, D0 + 0.3]], 16, false)
lathe(frame, CX, CY, [[DR + 0.5, D1 - 0.1], [DR + 0.5, D1 + 0.3], [DR - 0.1, D1 + 0.3]], 16, false)
{
  const prof: [number, number][] = []
  const rise = 5.6
  for (let k = 0; k <= 6; k++) {
    const a = (k / 6) * (Math.PI / 2)
    prof.push([Math.max(0.9, (DR - 0.1) * Math.cos(a)), D1 + 0.3 + rise * Math.sin(a)])
  }
  lathe(glass, CX, CY, prof, 16, true)
  // eight meridian ribs
  for (let j = 0; j < 8; j++) {
    const ang = (j * Math.PI) / 4
    const u: V3 = [Math.cos(ang), Math.sin(ang), 0], v: V3 = [-Math.sin(ang), Math.cos(ang), 0]
    for (let k = 0; k < prof.length - 1; k++) {
      const [ra, za] = prof[k], [rb, zb] = prof[k + 1]
      const Q = (r: number, z: number, s: number): V3 => [CX + u[0] * (r + 0.05) + v[0] * s, CY + u[1] * (r + 0.05) + v[1] * s, z]
      qf(frame, Q(ra, za, -0.12), Q(ra, za, 0.12), Q(rb, zb, 0.12), Q(rb, zb, -0.12), [u[0] * (zb - za), u[1] * (zb - za), ra - rb])
    }
  }
  const zl = D1 + 0.3 + rise
  lathe(frame, CX, CY, [[1.1, zl - 0.1], [1.1, zl + 1.0], [1.3, zl + 1.0], [0.0, zl + 1.4]], 8, false)
}

// ---- the entrance porch: white arcade, glazed arches, flat roof
const EX0 = 15.4, EX1 = 21.2, EY0 = -1.2, EY1 = 8.2, EH = 5.2
cbox(base, rect(EX0, EX1, EY0, EY1), 0, EH, { top: false })
cbox(base, rect(EX0 - 0.1, EX1 + 0.3, EY0 - 0.3, EY1 + 0.3), EH, EH + 0.6, { b: 0.2, bottom: true, top: frame })
function arch(side: Side, at: number, c: number, w: number, z0: number, zs: number) {
  panel(glass, side, at, c - w / 2, c + w / 2, z0, zs, 0.05)
  const pts = arc(0, 0, w / 2, 0, 180, 8)
  const n: V3 = side === 'e' ? [1, 0, 0] : side === 'n' ? [0, 1, 0] : [0, -1, 0]
  const P = (q: [number, number]): V3 => (side === 'e' ? [at + 0.05, c + q[0], zs + q[1]] : [c + q[0], at + (side === 'n' ? 0.05 : -0.05), zs + q[1]])
  for (let k = 0; k < pts.length - 1; k++) tf(glass, P([0, 0]), P(pts[k]), P(pts[k + 1]), n)
}
for (const c of [0.4, 3.5, 6.6]) arch('e', EX1, c, 2.2, 0.3, 3.4)
arch('n', EY1, (EX0 + EX1) / 2, 2.2, 0.3, 3.4)
arch('s', EY0, (EX0 + EX1) / 2, 2.2, 0.3, 3.4)

// ===========================================================================
// what the glass shows: palms in the pavilion, planting down the wings
function tree(x: number, y: number, trunk: number, r: number) {
  lathe(plants, x, y, [[0.25, 0], [0.2, trunk]], 6, false)
  lathe(plants, x, y, [[0.3, trunk - 0.4], [r, trunk + r * 0.25], [r * 0.7, trunk + r * 0.75], [0, trunk + r]], 8, false)
}
tree(CX - 2.5, CY - 2.0, 7.5, 3.0)
tree(CX + 3.0, CY + 2.5, 6.0, 2.6)
tree(CX + 1.0, CY - 4.0, 4.0, 2.0)
for (const [x, y] of [[6.1, 18], [6.1, 26], [6.1, 33], [6.4, -12], [6.4, -20], [6.4, -27], [-20, 2.8], [-11, 2.8], [-13.5, -16], [-13.5, -25]]) {
  tree(x, y, 1.6, 2.2)
}

const glassMat = { ...PALETTE.glass, color: 0x7fc4de, opacity: 0.3, doubleSided: true } as Mat

if (import.meta.main) {
  await saveModel('ric-ginter-conservatory', 'Lewis Ginter Conservatory', [
    { part: glass, material: glassMat },
    { part: frame, material: PALETTE.trim },
    { part: base, material: finish('conservatory-white', 0xf3f0ea) },
    { part: plants, material: finish('conservatory-planting', 0x7f9a6a) },
  ], { source: 'generators/ric-ginter-conservatory.ts', bearing: 59, osm: 'way/275860188', height: 19.6 }, 6500)
}
