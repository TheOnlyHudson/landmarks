/**
 * Neue Synagoge, Oranienburger Straße 28-30: procedural, CC0-1.0.
 * bun generators/berlin-neue-synagoge.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 23.3: the
 * model's south is the street front on Oranienburger Straße (it faces
 * 203.3 degrees), its x axis runs along that front. Origin: the centre of
 * the outline's box in that frame, 13.394342 52.524998; y = 0 at the street
 * (the site is flat). The front is symmetric about x = -5.1, the main
 * dome's axis.
 *
 * Identity (from the photos below):
 *  1. The gilded Moorish main dome: a slightly bulging melon of grey zinc
 *     panels in a gilt net (ribs, a row of pointed arches, a row of round
 *     medallions), on a drum with paired arched windows, crowned by a gilt
 *     finial and the Star of David.
 *  2. The two flanking towers on the street front, each ending in an
 *     arcaded octagonal lantern under a small ribbed dome with a gilt crown
 *     of leaves and a gilt finial.
 *  3. The patterned brick front: ochre brick banded with red courses and
 *     terracotta friezes, three tall round-arched tracery windows over three
 *     arched portals in the centre, paired arched windows up the towers, an
 *     arcaded frieze and cresting along the top.
 *
 * Plan: OSM way/24054915 (21.3 m), the dome way/42976796 (21.3-42.75 m,
 * a dome roof 12.7 m high, about 15.6 m across with its drum) and the tower
 * domes way/454211904/905 (3.8 m across). OSM draws the towers' fronts
 * 4.3 m ahead of the centre; the photos show the centre set back only about
 * a metre, so it is drawn 1.2 m back. The rest of the outline (the rebuilt
 * Centrum Judaicum behind the front, bent to the old axis) is a plain block.
 *
 * Published (Wikipedia, "Neue Synagoge (Berlin)"): 1859-66, Eduard
 * Knoblauch and Friedrich August Stüler; dome rebuilt 1988-95; the front
 * and dome are what remain.
 *
 * Measured off photos, scaled from OSM's 21.3 m front ("Neue Synagoge,
 * Berlin-Mitte, 160328, ako.jpg", nearly square-on): the towers' bodies to
 * 28.9 m, their lanterns to 36.1 m, domes to 40 m (pointed), finials 41 m; the
 * centre's tracery windows 9.5-17.5 m, portals to 6.2 m; the drum's paired
 * windows 22.5-26.5 m. The dome's shape (bulging to its widest about a fifth
 * of the way up, then curving in to the finial) from "Berlin, Kuppeln der
 * Synagoge in der Oranienburger Straße.JPG" and "Neue Synagoge (Berlin),
 * Kuppel, 140525, ako.jpg".
 *
 * Estimated: the red bands every 1.5 m (the real courses are finer and more
 * numerous); the number of dome ribs (16) and medallions; the window sizes
 * on the towers' sides; the rear block's walls (no photo: plain brick with
 * window panels); the drum's eight sides. Left out: the cresting's
 * individual merlons, the doors' metalwork, the fence.
 *
 * Night: the front and dome are floodlit (`_FLOODLIGHT`); windows glow.
 *
 * Photos (evidence, Wikimedia Commons):
 * - "Neue Synagoge, Berlin-Mitte, 160328, ako.jpg", Ansgar Koreng, CC BY 3.0 de (front)
 *   https://commons.wikimedia.org/wiki/File:Neue_Synagoge,_Berlin-Mitte,_160328,_ako.jpg
 * - "Neue Synagoge (Berlin), Kuppel, 140525, ako.jpg", Ansgar Koreng, CC BY-SA 4.0 (dome)
 *   https://commons.wikimedia.org/wiki/File:Neue_Synagoge_(Berlin),_Kuppel,_140525,_ako.jpg
 * - "Neue Synagoge, Oranienburger Straße, Berlin-Mitte.jpg", Neuköllner, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Neue_Synagoge,_Oranienburger_Stra%C3%9Fe,_Berlin-Mitte.jpg
 * - "Berlin-Neue Synagoge-Oranienburger Str-08-2016-gje.jpg", Gerd Eichmann, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Berlin-Neue_Synagoge-Oranienburger_Str-08-2016-gje.jpg
 * - "Neue Synagoge, Oranienburger Straße, Berlin, 1603281233, ako.jpg", Ansgar Koreng, CC BY-SA 4.0 (from the east)
 *   https://commons.wikimedia.org/wiki/File:Neue_Synagoge,_Oranienburger_Stra%C3%9Fe,_Berlin,_1603281233,_ako.jpg
 * - "Neue Synagoge (Berlin), 2024 (01).jpg", Bahnfrend, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Neue_Synagoge_(Berlin),_2024_(01).jpg
 * - "Berlin, Kuppeln der Synagoge in der Oranienburger Straße.JPG", Carola Opitz, CC BY-SA 4.0 (domes)
 *   https://commons.wikimedia.org/wiki/File:Berlin,_Kuppeln_der_Synagoge_in_der_Oranienburger_Stra%C3%9Fe.JPG
 * - "Berlin - Die Neue Synagoge.jpg", Marek Śliwecki, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Berlin_-_Die_Neue_Synagoge.jpg
 * Look-only: none.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, cornice, prism, save, type XY } from './atl-flatiron-building'
import { archShape, onWall, rectShape } from './atl-tech-tower'
import { lathe, ribbedDome, plate } from './berlin-fernsehturm'

const TAU = Math.PI * 2
const brick = new Part(), red = new Part(), win = new Part(), gold = new Part(), zinc = new Part(), roof = new Part()

const AX = -5.1 // the front's axis
const FRONT = -24.4, CFRONT = -23.2, TOP = 21.3

// ── The rear block: the outline, plain ──
const OUTLINE: XY[] = ccw([
  [-16.7, -4.5], [-18.1, -10.3], [-19.6, -20.0], [9.3, -20.0], [11.8, -12.0], [13.6, -5.3], [18.0, 11.3], [19.3, 16.2], [19.5, 16.9],
  [-2.8, 24.5], [-3.0, 24.0], [-0.9, 23.0], [-5.5, 9.8], [-1.8, 8.1], [-8.0, -4.1], [-11.5, -5.9],
])
prism(brick, OUTLINE, 0, 19.6, roof, 0.3)
cornice(red, OUTLINE, 18.8, 0.8, 0.3, null)
// window panels on the rear block's long walls, grouped two storeys
for (let i = 0; i < OUTLINE.length; i++) {
  const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 8 || (a[1] < -19 && b[1] < -19)) continue
  const n = Math.round((L - 2) / 4.5), w = (L - 2) / n
  for (let k = 0; k < n; k++) {
    const s = 1 + (k + 0.5) * w
    onWall(win, a, b, rectShape(s - 1, s + 1, 2.5, 8.5), 0.05)
    onWall(win, a, b, rectShape(s - 1, s + 1, 10.5, 16.5), 0.05)
  }
}

// ── The street front ──
const mirror = (x: number) => 2 * AX - x
const TW0 = -19.6, TW1 = -13.4 // left tower, x
/** Red bands across a wall face from a to b (outside to the right). */
function bands(a: XY, b: XY, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  for (let z = z0; z < z1 - 0.3; z += 1.5) onWall(red, a, b, rectShape(0.05, L - 0.05, z, z + 0.35), 0.03)
}
// The centre: a block set 1.2 m behind the towers' fronts.
{
  const x0 = TW1, x1 = mirror(TW1)
  box(brick, x0, x1, CFRONT, -19.0, 0, TOP - 1.4, null, 0)
  const a: XY = [x0, CFRONT], b: XY = [x1, CFRONT], L = x1 - x0, m = L / 2
  bands(a, b, 1.2, 19.4)
  // terracotta frieze bands and the arcaded frieze, parapet and cresting
  onWall(red, a, b, rectShape(0, L, 7.0, 8.2), 0.1)
  box(red, x0, x1, CFRONT - 0.5, -19.0, TOP - 1.4, TOP - 0.6, null, 0)
  box(brick, x0, x1, CFRONT - 0.3, -19.0, TOP - 0.6, TOP, brick, 0.1)
  for (let k = 0; k < 16; k++) {
    const s = 0.6 + (k + 0.5) * ((L - 1.2) / 16)
    onWall(win, [x0, CFRONT - 0.5], [x1, CFRONT - 0.5], archShape(s, 0.5, TOP - 1.3, TOP - 0.95, 4), 0.05)
    if (k % 2 === 0) box(red, x0 + s - 0.18, x0 + s + 0.18, CFRONT - 0.2, CFRONT + 0.1, TOP, TOP + 0.8, red, 0)
  }
  for (const d of [-4.6, 0, 4.6]) {
    // the tall tracery windows: two lights under a round head, a transom
    onWall(red, a, b, archShape(m + d, 3.6, 9.0, 16.3, 10), 0.06)
    onWall(win, a, b, archShape(m + d, 2.9, 9.4, 16.3, 10), 0.1)
    onWall(red, a, b, rectShape(m + d - 0.09, m + d + 0.09, 9.4, 17.3), 0.13)
    onWall(red, a, b, rectShape(m + d - 1.45, m + d + 1.45, 13.0, 13.25), 0.13)
    // the portals
    onWall(red, a, b, archShape(m + d, 3.8, 0.0, 4.4, 8), 0.06)
    onWall(win, a, b, archShape(m + d, 3.0, 0.3, 4.4, 8), 0.1)
  }
}
// The towers.
const TOWER_TOP = 28.9
for (const [x0, x1] of [[TW0, TW1], [mirror(TW1), mirror(TW0)]]) {
  const c: XY = [(x0 + x1) / 2, (FRONT + -17.6) / 2]
  const ring = ccw([[x0, FRONT], [x1, FRONT], [x1, -17.6], [x0, -17.6]])
  prism(brick, ring, 0, TOWER_TOP - 1.6, null, 0)
  // corbelled arcade frieze and the cornice
  cornice(red, ring, TOWER_TOP - 1.6, 1.0, 0.45, null)
  prism(brick, ccw([[x0 - 0.45, FRONT - 0.45], [x1 + 0.45, FRONT - 0.45], [x1 + 0.45, -17.15], [x0 - 0.45, -17.15]]), TOWER_TOP - 0.6, TOWER_TOP, roof, 0.15)
  const faces: [XY, XY][] = [[[x0, FRONT], [x1, FRONT]], [[x1, FRONT], [x1, -17.6]], [[x0, -17.6], [x0, FRONT]]]
  for (const [a, b] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = L / 2
    bands(a, b, 1.2, TOWER_TOP - 2)
    for (let k = 0; k < 6; k++) onWall(win, a, b, archShape(0.6 + (k + 0.5) * ((L - 1.2) / 6), 0.45, TOWER_TOP - 1.5, TOWER_TOP - 1.2, 4), 0.5)
    // paired round-headed windows up the tower, and a portal at the foot
    for (const [z0, zs] of [[9.0, 13.2], [15.2, 18.6], [21.6, 25.0]]) {
      for (const d of [-0.85, 0.85]) onWall(win, a, b, archShape(m + d, 1.25, z0, zs, 6), 0.06)
      onWall(red, a, b, rectShape(m - 0.08, m + 0.08, z0, zs + 0.6), 0.09)
    }
    if (a[1] === FRONT && b[1] === FRONT) {
      onWall(red, a, b, archShape(m, 2.9, 0, 3.6, 8), 0.06)
      onWall(win, a, b, archShape(m, 2.2, 0.3, 3.6, 8), 0.1)
    }
  }
  // The arcaded octagonal lantern, the gilt crown, the ribbed dome, the finial.
  const R8 = 2.75 / Math.cos(Math.PI / 8)
  lathe([[R8, TOWER_TOP], [R8, 35.4]], () => brick, 8, 10, c, Math.PI / 8)
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * TAU + Math.PI / 8 - Math.PI / 8
    const d: XY = [Math.cos(a), Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
    const P = (s: number, z: number): V3 => [c[0] + d[0] * 2.8 + t[0] * s, c[1] + d[1] * 2.8 + t[1] * s, z]
    const q = archShape(0, 1.25, 30.0, 33.6, 6).map(([s, z]) => P(s, z))
    for (let k = 1; k < q.length - 1; k++) win.tri(q[0], q[k], q[k + 1])
  }
  lathe([[R8, 35.4], [3.2, 35.6], [3.2, 36.1], [2.6, 36.2]], () => red, 8, 10, c, Math.PI / 8)
  // crown of leaves: a gilt band with points
  lathe([[2.55, 36.2], [2.65, 37.3]], () => gold, 16, 40, c)
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU, a1 = ((i + 0.5) / 16) * TAU, a2 = ((i + 1) / 16) * TAU
    const P = (r: number, aa: number, z: number): V3 => [c[0] + r * Math.cos(aa), c[1] + r * Math.sin(aa), z]
    plate(gold, P(2.65, a, 37.3), P(2.65, a2, 37.3), P(2.5, a1, 38.0))
  }
  const td: [number, number][] = [[2.45, 37.3], [2.42, 38.0], [2.1, 38.8], [1.4, 39.5], [0.35, 40.0]]
  ribbedDome(zinc, gold, td, 12, 6, 0.28, 0.08, c, 0, td.length - 1)
  lathe([[0.35, 40.0], [0.18, 40.2], [0.32, 40.45], [0.12, 40.9], [0, 41.0]], () => gold, 8, 50, c)
}

// ── The main dome ──
const DC: XY = [AX, -11.8]
{
  // The drum: eight-sided, with paired arched windows and a gallery.
  const R8 = 7.0 / Math.cos(Math.PI / 8)
  lathe([[R8, 18.5], [R8, 27.4]], () => brick, 8, 10, DC, Math.PI / 8)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU
    const d: XY = [Math.cos(a), Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
    const P = (s: number, z: number, o = 7.04): V3 => [DC[0] + d[0] * o + t[0] * s, DC[1] + d[1] * o + t[1] * s, z]
    for (const dd of [-1.0, 1.0]) {
      const q = archShape(dd, 1.4, 22.5, 25.8, 6).map(([s, z]) => P(s, z))
      for (let k = 1; k < q.length - 1; k++) win.tri(q[0], q[k], q[k + 1])
    }
    for (let z = 19.5; z < 27; z += 2.0) {
      const q = rectShape(-2.85, 2.85, z, z + 0.35).map(([s, zz]) => P(s, zz, 7.02))
      red.tri(q[0], q[1], q[2]); red.tri(q[0], q[2], q[3])
    }
    // corner buttresses
    const ca = a + Math.PI / 8, cc: XY = [DC[0] + R8 * Math.cos(ca), DC[1] + R8 * Math.sin(ca)]
    box(brick, cc[0] - 0.55, cc[0] + 0.55, cc[1] - 0.55, cc[1] + 0.55, 18.5, 28.4, red, 0.1)
  }
  lathe([[R8, 27.4], [R8 + 0.5, 27.8], [R8 + 0.5, 28.4], [6.9, 28.6], [6.9, 29.6], [7.1, 29.7], [7.1, 30.1], [6.7, 30.1]], (b) => (b === 4 ? brick : red), 16, 20, DC, Math.PI / 8)
  // cresting on the drum's gallery
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU, c: XY = [DC[0] + 7.6 * Math.cos(a), DC[1] + 7.6 * Math.sin(a)]
    box(gold, c[0] - 0.2, c[0] + 0.2, c[1] - 0.2, c[1] + 0.2, 28.4, 29.1, null, 0)
  }
  // The melon dome: zinc panels in a gilt net.
  const NR = 16 // gilt ribs (the real dome has about three times as many, finer)
  const DOME: [number, number][] = [[6.65, 30.1], [6.95, 31.6], [7.0, 33.0], [6.8, 34.6], [6.25, 36.4], [5.3, 38.3], [3.9, 40.2], [2.1, 41.8], [0.9, 42.6]]
  ribbedDome(zinc, gold, DOME, 32, NR, 0.5, 0.14, DC, 0, DOME.length - 1)
  // gilt rings: the arches' feet and their springing
  for (const [r, z] of [[6.98, 31.6], [6.95, 34.2]] as [number, number][]) {
    lathe([[r + 0.1, z - 0.14], [r + 0.1, z + 0.14]], () => gold, 32, 60, DC)
  }
  // pointed arch heads between the ribs, and the round medallions above
  for (let i = 0; i < NR; i++) {
    const a0 = (i / NR) * TAU, a1 = ((i + 1) / NR) * TAU, am = (a0 + a1) / 2
    const R = (z: number) => {
      for (let k = 0; k < DOME.length - 1; k++) if (z <= DOME[k + 1][1]) {
        const [r0, z0] = DOME[k], [r1, z1] = DOME[k + 1]
        return r0 + ((r1 - r0) * (z - z0)) / (z1 - z0)
      }
      return 0
    }
    const P = (a: number, z: number, o = 0.1): V3 => [DC[0] + (R(z) + o) * Math.cos(a), DC[1] + (R(z) + o) * Math.sin(a), z]
    // arch head: two gilt strips rising from the rib feet to a point
    const s0 = P(a0 + 0.02, 34.2), pk = P(am, 35.6), s1 = P(a1 - 0.02, 34.2)
    for (const [p, q] of [[s0, pk], [pk, s1]] as [V3, V3][]) {
      const up: V3 = [0, 0, 0.13]
      gold.quad(p, q, [q[0] + up[0], q[1] + up[1], q[2] + up[2]], [p[0], p[1], p[2] + 0.13])
      gold.quad(p, [p[0], p[1], p[2] + 0.13], [q[0], q[1], q[2] + 0.13], q)
    }
    // medallion: a gilt ring of 6 segments
    const zc = 36.9, rr = 0.75
    const ringP = (k: number, o: number) => {
      const th = (k / 6) * TAU
      return P(am + (rr * Math.cos(th)) / R(zc + rr * Math.sin(th)), zc + rr * Math.sin(th), o)
    }
    for (let k = 0; k < 6; k++) {
      gold.quad(ringP(k, 0.08), ringP(k + 1, 0.08), ringP(k + 1, 0.2), ringP(k, 0.2))
    }
  }
  // Finial: a gilt collar, ball, and the Star of David.
  lathe([[0.9, 42.6], [1.0, 42.9], [0.55, 43.2], [0.5, 43.9], [0.25, 44.1]], () => gold, 10, 40, DC)
  const ball: [number, number][] = []
  for (let i = 0; i <= 6; i++) { const t = -Math.PI / 2 + (i / 6) * Math.PI; ball.push([Math.max(0.001, 0.55 * Math.cos(t)), 44.65 + 0.55 * Math.sin(t)]) }
  lathe(ball, () => gold, 10, 60, DC)
  lathe([[0.08, 45.2], [0.08, 45.6]], () => gold, 6, 60, DC)
  // the star: two triangles, facing the street and the back, with depth
  const SZ = 46.3, SR = 0.75
  for (const flip of [0, 1]) {
    const pts: V3[] = [0, 1, 2].map((k) => {
      const a = Math.PI / 2 + flip * Math.PI + (k / 3) * TAU
      return [DC[0] + SR * Math.cos(a), DC[1], SZ + SR * Math.sin(a)] as V3
    })
    for (const dy of [-0.08, 0.08]) {
      const q = pts.map(([x, y, z]) => [x, y + dy, z] as V3)
      plate(gold, q[0], q[1], q[2])
    }
  }
}

// ── Output ──
// Ochre brick and the red banding from the daylight photos, pulled to the
// palette's lightness; the dome's grey zinc a touch blue; gilt.
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[1] < -16 ? 1 : 0.5)
const domeLit = (p: V3) => (p[2] > 29 ? 0.7 : 0)
if (process.env.DEBUG) console.log([brick, red, win, gold, zinc, roof].map((p) => p.triangles).join(' '))
await save('berlin-neue-synagoge', 'Neue Synagoge', [
  { part: brick, material: { ...finish('synagoge-ochre-brick', 0xc9a675), floodlight: lit } },
  { part: red, material: { ...finish('synagoge-red-brick', 0xac6a50), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: gold, material: { ...finish('synagoge-gilt', 0xd6ae52, 0.5), floodlight: domeLit } },
  { part: zinc, material: { ...finish('synagoge-dome-zinc', 0xb3b9bd, 0.5), floodlight: domeLit } },
  { part: roof, material: PALETTE.roof },
], { bearing: 23.3, elevation: 0, height: 46.9 }, 6500)
