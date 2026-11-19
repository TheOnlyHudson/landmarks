/**
 * Molecule Man, Spree at the Treptowers, Berlin (Jonathan Borofsky, 1999):
 * procedural, CC0-1.0, no textures. bun generators/berlin-molecule-man.ts
 *
 * Writes models/berlin-molecule-man.glb (low) and
 * models/berlin-molecule-man.detail.glb (detail: every figure riddled with
 * real round holes, cut clean through the plate with their own walls).
 *
 * Map frame: x east, y north, z up, metres, BEARING 0. Anchor: the point
 * where the three figures' plates meet, the junction of the three arms of
 * OSM way/166268035, lng 13.459044, lat 52.496963. z = 0 is the water.
 *
 * What makes it the Molecule Man, and how each is drawn
 * - Three giant flat aluminium figures, each a perforated plate standing in
 *   its own vertical plane; the three planes radiate from one vertical axis
 *   about 120 degrees apart, so from any side two figures are seen in
 *   profile leaning in to each other and the third edge on between them.
 * - Each figure walks outward, its back foot far out on its plate, its
 *   front foot by the axis, the body leaning in with the head a third of
 *   the way out and both arms reaching forward to the axis, where the
 *   three meet.
 * - The plates are riddled with round holes of mixed sizes, which is what
 *   people remember. Low: the larger holes, real, six-sided. Detail: the
 *   full scatter, twelve-sided, through holes with walls.
 * - Silver aluminium, bluish grey in daylight; small dark footing pads in
 *   the water under each foot.
 *
 * Evidence
 * - OSM (ODbL): way/166268035 (tourism=artwork, "Molecule Man", Jonathan
 *   Borofsky, height=30, material aluminium/steel, wikidata Q522248): three
 *   lines radiating from the junction, compass 283 (13.0 m), 159 (11.3 m)
 *   and 43 (14.4 m): the three plates' feet lines.
 * - Published (de.wikipedia "Molecule Man"; bildhauerei-in-berlin.de): 30 m
 *   high, aluminium, 45 t, installed 1999 in the Spree where Friedrichshain,
 *   Kreuzberg and Treptow meet.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "5217 Berlin Molecule Man.jpg", Spyrosdrakopoulos, CC BY-SA 4.0 (from
 *     the south-east: the NE figure square on, traced for the silhouette)
 *     https://commons.wikimedia.org/wiki/File:5217_Berlin_Molecule_Man.jpg
 *   "Molecule Man - Berlin - 2013.jpg", Avda, CC BY-SA 3.0 (close, from the
 *     south-east: holes, plate edges, footing pads)
 *     https://commons.wikimedia.org/wiki/File:Molecule_Man_-_Berlin_-_2013.jpg
 *   "Molecule Man in Berlin.jpg", Allthingsberlin, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Molecule_Man_in_Berlin.jpg
 *   "Berlin - Molecule Man (2).jpg", Fred Romero, CC BY 2.0
 *     https://commons.wikimedia.org/wiki/File:Berlin_-_Molecule_Man_(2).jpg
 *   "Molecule man 2007 12 09 picture 01.JPG", Stefan Sordon, public domain
 *     (from the north bank: the other two figures in profile)
 *     https://commons.wikimedia.org/wiki/File:Molecule_man_2007_12_09_picture_01.JPG
 *   "Berlin Spree Molecule men nahansicht.jpg", Jensen, CC BY-SA 3.0 (dusk)
 *     https://commons.wikimedia.org/wiki/File:Berlin_Spree_Molecule_men_nahansicht.jpg
 *   "Molecule Man (32074679122).jpg", tian2992, CC BY-SA 2.0 (night: the
 *     figures floodlit from below)
 *     https://commons.wikimedia.org/wiki/File:Molecule_Man_(32074679122).jpg
 * - Measured from the Spyrosdrakopoulos photo, with the head at the
 *   published 30 m as scale: the back heel 13.1 m out on the plate (OSM:
 *   11.3-14.4 m), the hands at the axis, the head centred 4.2 m out.
 * - Estimated: the plate's thickness (0.5 m, from edge-on views); the hole
 *   sizes (0.3-1.1 m across) and density from the close photos.
 * - Invented: the exact hole layout (a seeded scatter, not traced); the
 *   three figures share one silhouette, as they appear to in the photos.
 * - Look-only references: none.
 * - Doubts: OSM's three arms differ in length (11.3-14.4 m); the model uses
 *   one figure for all three. The plates' real thickness is not published.
 *
 * Night: the figures are floodlit from lamps in the water at their feet
 * (`_FLOODLIGHT`, strongest low down).
 */
import { polyTris } from './berlin-oberbaum-bridge'
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { mat } from './berlin-konzerthaus'

export const ID = 'berlin-molecule-man'
export const BEARING = 0

type XY = [number, number]
const TAU = Math.PI * 2

// The figure traced from the Spyrosdrakopoulos photo, in its pixels: x across
// (the axis at x = 135, out to the right), y down (the water at y = 1140, the
// head's top at y = 100 → 30 m).
const TRACE: XY[] = [
  [255, 100], [228, 108], [207, 138], [196, 174], [205, 196], [214, 216], [214, 232],
  [180, 228], [146, 222], [138, 240], [145, 265], [178, 270], [222, 290], [236, 312],
  [200, 330], [148, 334], [132, 345], [130, 405], [180, 416], [250, 426],
  [259, 470], [273, 540], [284, 600], [274, 645], [250, 692], [226, 760], [210, 820], [200, 880],
  [194, 940], [185, 1000], [180, 1034], [150, 1040], [124, 1050], [126, 1080], [160, 1120], [190, 1144], [206, 1138], [203, 1100],
  [215, 1050], [240, 980], [265, 900], [300, 830], [340, 760],
  [372, 800], [420, 880], [468, 950], [503, 1000], [515, 1040], [488, 1090], [458, 1124], [452, 1142], [474, 1146],
  [532, 1096], [580, 1060], [591, 1030], [580, 1004],
  [540, 940], [500, 850], [462, 760], [432, 680], [425, 600], [410, 540], [395, 480], [385, 420], [375, 360], [360, 300], [336, 256],
  [312, 236], [320, 200], [325, 160], [316, 122], [290, 102],
]
const K = 30 / 1040
const AXIS_X = 135, WATER_Y = 1140
const THICK = 0.5

/** Chaikin corner cutting on a closed ring. */
function chaikin(r: XY[], n: number): XY[] {
  let p = r
  for (let k = 0; k < n; k++) {
    const q: XY[] = []
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length]
      q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75])
    }
    p = q
  }
  return p
}
const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** The silhouette in plate metres: u out from the axis, v up from the water. */
function silhouette(smooth: number): XY[] {
  let r: XY[] = TRACE.map(([x, y]) => [Math.max(0.15, (x - AXIS_X) * K), Math.max(0, (WATER_Y - y) * K)])
  r = chaikin(r, smooth)
  // The feet stand flat on the water.
  r = r.map(([u, v]) => [u, v < 0.35 ? 0 : v])
  return area(r) < 0 ? r.reverse() : r
}

function inside(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j]
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}
function edgeDist(p: XY, r: XY[]) {
  let d = Infinity
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy
    const t = L ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L)) : 0
    d = Math.min(d, Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy))
  }
  return d
}
function rng(seed: number) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

type Hole = { c: XY; r: number }
/** A seeded scatter of round holes inside the silhouette, clear of its edge and of each other. */
function holes(sil: XY[], seed: number, n: number, rMin: number, rMax: number, gap: number, margin: number): Hole[] {
  const R = rng(seed), out: Hole[] = []
  const us = sil.map((p) => p[0]), vs = sil.map((p) => p[1])
  const u0 = Math.min(...us), u1 = Math.max(...us), v0 = Math.min(...vs), v1 = Math.max(...vs)
  for (let tries = 0; tries < n * 400 && out.length < n; tries++) {
    const c: XY = [u0 + R() * (u1 - u0), v0 + 1.2 + R() * (v1 - v0 - 1.2)]
    // Mostly small holes, a few big ones, as on the real plates.
    const r = rMin + (rMax - rMin) * Math.pow(R(), 1.6)
    if (!inside(c, sil) || edgeDist(c, sil) < r + margin) continue
    if (out.some((h) => Math.hypot(h.c[0] - c[0], h.c[1] - c[1]) < h.r + r + gap)) continue
    out.push({ c, r })
  }
  return out
}

/**
 * One figure plate: the silhouette with its holes, front and back faces,
 * the outer edge and each hole's wall, standing in the vertical plane that
 * runs out from the axis at compass `bearing`.
 */
function plate(p: Part, sil: XY[], hs: Hole[], bearing: number, seg: number) {
  const b = (bearing * Math.PI) / 180
  const d: XY = [Math.sin(b), Math.cos(b)], n: XY = [Math.cos(b), -Math.sin(b)]
  const P = (u: number, v: number, w: number): V3 => [u * d[0] + w * n[0], u * d[1] + w * n[1], v]
  const N3 = (nu: number, nw: number, nv = 0): V3 => [nu * d[0] + nw * n[0], nu * d[1] + nw * n[1], nv]
  const rings: XY[][] = [sil]
  for (const h of hs) {
    // Holes run clockwise (opposite the outline).
    const ring: XY[] = Array.from({ length: seg }, (_, k) => {
      const a = -(k * TAU) / seg + 0.3
      return [h.c[0] + h.r * Math.cos(a), h.c[1] + h.r * Math.sin(a)] as XY
    })
    rings.push(ring)
  }
  const tris = polyTris(sil, rings.slice(1))
  for (const side of [1, -1]) {
    const nn = N3(0, side), w = (side * THICK) / 2
    for (const [a, bb, c] of tris) p.tri(P(a[0], a[1], w), P(bb[0], bb[1], w), P(c[0], c[1], w), undefined, undefined, undefined, [nn, nn, nn])
  }
  // Walls: the outline faces out, each hole's wall faces into the hole.
  // Normals are smoothed at each corner (the outline is a smooth curve and a
  // hole is round), so the corners weld and the edges shade soft.
  const wall = (r: XY[], into: XY | null) => {
    const m = r.length
    const en = r.map((a, i) => {
      const c = r[(i + 1) % m]
      let nu = c[1] - a[1], nv = -(c[0] - a[0])
      const L = Math.hypot(nu, nv) || 1
      nu /= L; nv /= L
      const mm: XY = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2]
      if (into) { if ((into[0] - mm[0]) * nu + (into[1] - mm[1]) * nv < 0) { nu = -nu; nv = -nv } }
      else if (area(r) < 0) { nu = -nu; nv = -nv }
      return [nu, nv] as XY
    })
    const vn = r.map((_, i) => {
      const a = en[(i - 1 + m) % m], b = en[i]
      // A sharp corner (a toe, a fingertip) keeps its crease.
      if (a[0] * b[0] + a[1] * b[1] < 0.6) return null
      const s: XY = [a[0] + b[0], a[1] + b[1]], L = Math.hypot(s[0], s[1]) || 1
      return [s[0] / L, s[1] / L] as XY
    })
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m, a = r[i], c = r[j]
      if (a[1] === 0 && c[1] === 0) continue // the sole, on the water
      const ni = vn[i] ?? en[i], nj = vn[j] ?? en[i]
      const A = N3(ni[0], 0, ni[1]), C = N3(nj[0], 0, nj[1])
      const w = THICK / 2
      p.tri(P(a[0], a[1], -w), P(c[0], c[1], -w), P(c[0], c[1], w), undefined, undefined, undefined, [A, C, C])
      p.tri(P(a[0], a[1], -w), P(c[0], c[1], w), P(a[0], a[1], w), undefined, undefined, undefined, [A, C, A])
    }
  }
  wall(sil, null)
  for (let i = 1; i < rings.length; i++) wall(rings[i], hs[i - 1].c)
}

/** A low dark footing pad under a foot, in the plate's plane. */
function pad(p: Part, bearing: number, u0: number, u1: number) {
  const b = (bearing * Math.PI) / 180
  const d: XY = [Math.sin(b), Math.cos(b)], n: XY = [Math.cos(b), -Math.sin(b)]
  const P = (u: number, w: number, z: number): V3 => [u * d[0] + w * n[0], u * d[1] + w * n[1], z]
  const w = 0.9, z = 0.3
  const ring = (zz: number): V3[] => [P(u0, -w, zz), P(u1, -w, zz), P(u1, w, zz), P(u0, w, zz)]
  const r0 = ring(0), r1 = ring(z)
  // Counter-clockwise from above whichever way the plate turns.
  const ccwRing = (r: V3[]) => {
    const a = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[1][1] - r[0][1]) * (r[2][0] - r[0][0])
    return a < 0 ? [...r].reverse() : r
  }
  const lo = ccwRing(r0), hi = ccwRing(r1)
  p.loft([lo, hi])
  p.cap(hi, true)
}

/** The three plates, compass bearings of OSM way/166268035's arms. */
const PLATES = [
  { bearing: 283, seed: 11, scale: 1.0 },
  { bearing: 159, seed: 23, scale: 0.97 },
  { bearing: 43, seed: 37, scale: 1.0 },
]

function build(detail: boolean) {
  const metal = new Part(), pads = new Part()
  const sil0 = silhouette(detail ? 3 : 1)
  for (const f of PLATES) {
    const sil = sil0.map(([u, v]): XY => [u * f.scale, v * f.scale])
    const hs = detail
      ? holes(sil, f.seed, 240, 0.16, 0.56, 0.17, 0.2)
      : holes(sil, f.seed, 30, 0.3, 0.52, 0.32, 0.26)
    plate(metal, sil, hs, f.bearing, detail ? 10 : 6)
    // Pads under the two feet (the front foot by the axis, the heel far out).
    const feet = sil.filter(([, v]) => v === 0).map(([u]) => u).sort((a, b) => a - b)
    const gapAt = feet.findIndex((u, i) => i > 0 && u - feet[i - 1] > 2)
    if (gapAt > 0) {
      pad(pads, f.bearing, feet[0] - 0.3, feet[gapAt - 1] + 0.3)
      pad(pads, f.bearing, feet[gapAt] - 0.3, feet[feet.length - 1] + 0.3)
    }
  }
  return { metal, pads }
}

function write(detail: boolean) {
  const { metal, pads } = build(detail)
  // Floodlit from the water: bright at the feet, fading up the figures.
  const lit = (p: V3) => Math.max(0.35, 1 - p[2] / 45)
  writeModel('Molecule Man', ID, [
    { part: metal, material: { ...mat('aluminium', 0xbfc6cc, 0.45), floodlight: lit } },
    { part: pads, material: mat('footing', 0x6e6258) },
  ], { bearing: BEARING, osm: 'way/166268035', height: 30 }, detail ? 40000 : 5000, detail ? `${ID}.detail` : ID)
}

if (import.meta.main) {
  write(false)
  write(true)
}
