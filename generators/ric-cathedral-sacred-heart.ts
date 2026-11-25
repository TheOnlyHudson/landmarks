/**
 * Cathedral of the Sacred Heart, 800 South Cathedral Place, Richmond,
 * Virginia (1903–1906, Joseph H. McGuire; Italian Renaissance revival in
 * Indiana limestone over a granite base) — original procedural geometry,
 * CC0-1.0.
 * bun generators/ric-cathedral-sacred-heart.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 103 (the nave's axis, OSM way/229623396's walls run
 * at 13° and 103°): the model's "north" (+y) is the portico front on Laurel
 * Street / Monroe Park, its "south" the apse and the attached rectory.
 * Anchor = the centroid of way/229623396 (which takes in the rectory and
 * offices behind the apse), -77.4523081, 37.5474803. The church's axis is at
 * x = 0.8 in this frame.
 *
 * Identity (from the photos below):
 *  1. A Corinthian hexastyle portico with a plain pediment on a wide flight
 *     of steps, between two square towers.
 *  2. The towers: a plain shaft, an arched belfry stage with pilasters and a
 *     cornice, then a steep pyramidal cap with four small corner pyramids and
 *     a cross.
 *  3. The green copper dome on a drum of paired arched windows, with a
 *     lantern, over a lower round drum with its own green conical roof, at
 *     the crossing of a Latin cross.
 *  4. A tall nave with a clerestory of round-headed windows over lower
 *     aisles; gabled transepts with rose windows; a round apse; every roof
 *     green copper; all in pale limestone.
 *
 * Plan: OSM way/229623396 and its parts (way/463800176..190, 822799759..764)
 * in this frame: nave x -6.2..7.8, aisles to -9.8 and 11.6, y -10..38.5; apse
 * to y -15.1; transept x -15.9..17.2, y 2.5..16.6 (its corner chapels
 * y -0.9..20.3); towers x -11.1..-3.7 and 5.7..12.3, y 38.4..46; portico
 * x -6.1..7.8, y 44.7..48.8; the rectory and offices behind the apse as
 * OSM draws them.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 1 m grid in this frame (it covers the church to y = 42): nave eaves 18.3,
 * ridge 22.0; aisles and transept chapels 11–12.5; transept ridges ~22; the
 * lower drum's roof ~30.8 at r 7; the dome's crown 42.5 (lantern base); the
 * apse 11–12.6; the rectory 7–9 and its two three-storey wings ~11. The
 * towers: OSM height 40 (way/463800186, 463800188), lidar 36.2 at one point
 * near the cap; drawn to 39.6 at the cross. Estimated from the photos
 * (Farragutful 01 and 03, scaled to the lidar nave): the portico (columns to
 * 13.4, pediment apex 18.4), the tower stages, the drum and lantern
 * proportions, the windows.
 *
 * Ground: flat (lidar ground within 1 m). Elevation 0.
 *
 * Night: the limestone front, towers and dome are floodlit; windows glow.
 *
 * Photos (all EVIDENCE, CC BY-SA 4.0 unless noted):
 *  - Sacred Heart - Richmond 01.jpg, Farragutful (the front and north side
 *    from Floyd Avenue) https://commons.wikimedia.org/wiki/File:Sacred_Heart_-_Richmond_01.jpg
 *  - Sacred Heart - Richmond 03.jpg, Farragutful (front three-quarter: the
 *    portico, both towers, the dome) https://commons.wikimedia.org/wiki/File:Sacred_Heart_-_Richmond_03.jpg
 *  - Sacred Heart - Richmond 05.jpg, Farragutful (the dome, drums and
 *    lantern from the rectory side) https://commons.wikimedia.org/wiki/File:Sacred_Heart_-_Richmond_05.jpg
 *  - MJK50185 Cathedral of the Sacred Heart (Richmond, Virginia).jpg,
 *    Martin Kraft, CC BY-SA 3.0 (transept gable, rose window, dome)
 *    https://commons.wikimedia.org/wiki/File:MJK50185_Cathedral_of_the_Sacred_Heart_(Richmond,_Virginia).jpg
 *  - USGS NAIP orthoimagery (public domain).
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the portico and tower tops are outside the lidar crop; their
 * heights rest on OSM and the photos. The rectory is drawn as plain blocks
 * with flat roofs (it has low tiled roofs). Window counts are approximate.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, gableRoof, onWall, pyramid, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, ccw, cornice, prism, save } from './atl-flatiron-building'

const stone = new Part(), trim = new Part(), copper = new Part(), win = new Part(), door = new Part(), roof = new Part()
const AX = 0.8 // the church's axis
type F = [XY, XY]
const ring = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const circ = (s: number, z: number, r: number, n = 14): [number, number][] => Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)])

// ── Nave, with its clerestory ──
const NE = 18.3, NR = 22.0
box(stone, -6.2, 7.8, -9.5, 38.5, 0, NE, null, 0)
cornice(trim, ring(-6.2, 7.8, -9.5, 38.5), NE - 1.0, 1.0, 0.5, null)
gableRoof(copper, stone, -6.2, 7.8, -9.5, 38.5, NE, NR, 'y', 0.5, 0.2)
for (const [f, x] of [[[[7.8, 20.3], [7.8, 38.5]], 7.8], [[[-6.2, 38.5], [-6.2, 20.3]], -6.2], [[[7.8, -4], [7.8, 2.5]], 7.8], [[[-6.2, 2.5], [-6.2, -4]], -6.2]] as [F, number][]) {
  void x
  const L = Math.abs(f[1][1] - f[0][1]), n = Math.max(1, Math.round(L / 3.6))
  for (let i = 0; i < n; i++) {
    const s = (L / n) * (i + 0.5)
    onWall(trim, f[0], f[1], archShape(s, 1.9, 13.0, 15.2, 8), 0.05)
    onWall(win, f[0], f[1], archShape(s, 1.4, 13.2, 15.2, 8), 0.09)
  }
}

// ── Aisles (lean-to roofs) ──
for (const [x0, x1, out] of [[-9.8, -6.2, -1], [7.8, 11.6, 1]] as const) {
  const xo = out < 0 ? x0 : x1, xi = out < 0 ? x1 : x0
  for (const [y0, y1] of [[-4.4, 2.5], [16.6, 38.5]]) {
    box(stone, x0, x1, y0, y1, 0, 11.0, null, 0)
    cornice(trim, ring(x0, x1, y0, y1), 10.2, 0.8, 0.4, null)
    const a: V3 = [xo + out * 0.5, y0, 10.8], b: V3 = [xo + out * 0.5, y1, 10.8], c: V3 = [xi, y1, 12.8], d: V3 = [xi, y0, 12.8]
    if (out > 0) copper.quad(a, d, c, b)
    else copper.quad(a, b, c, d)
    // aisle windows: tall round-headed lights
    const f: F = out < 0 ? [[xo, y1], [xo, y0]] : [[xo, y0], [xo, y1]]
    const L = y1 - y0, n = Math.max(1, Math.round(L / 4.4))
    for (let i = 0; i < n; i++) {
      const s = (L / n) * (i + 0.5)
      onWall(trim, f[0], f[1], archShape(s, 1.8, 2.6, 7.2, 8), 0.05)
      onWall(win, f[0], f[1], archShape(s, 1.3, 2.8, 7.2, 8), 0.09)
    }
  }
}

// ── Apse ──
{
  const pts: XY[] = [[10.6, -8.5], [8.3, -12.0], [4.9, -14.2], [0.8, -15.0], [-3.2, -14.2], [-6.7, -11.9], [-8.9, -8.4], [-8.9, -4.4], [10.9, -4.4]]
  const r = ccw(pts)
  prism(stone, r, 0, 11.0, null, 0)
  cornice(trim, r, 10.2, 0.8, 0.4, null)
  const apex: V3 = [AX, -6.5, 13.6]
  const arc = pts.slice(0, 7)
  for (let i = 0; i < arc.length - 1; i++) {
    const o = (p: XY): V3 => [AX + (p[0] - AX) * 1.05, -6.5 + (p[1] + 6.5) * 1.06, 10.9]
    copper.tri(o(arc[i + 1]), o(arc[i]), apex)
  }
  for (let i = 0; i < arc.length - 1; i += 2) onWall(win, arc[i + 1], arc[i], archShape(Math.hypot(arc[i][0] - arc[i + 1][0], arc[i][1] - arc[i + 1][1]) / 2, 1.2, 3.5, 7.5, 6), 0.08)
}

// ── Transept: corner chapels, the arms, gable ends with rose windows ──
box(stone, -15.9, 17.2, -0.9, 20.3, 0, 12.0, copper, 0.2)
cornice(trim, ring(-15.9, 17.2, -0.9, 20.3), 11.2, 0.8, 0.4, null)
for (const [x0, x1] of [[-15.9, -6.2], [7.8, 17.2]]) {
  box(stone, x0, x1, 2.5, 16.6, 0, NE, null, 0)
  cornice(trim, ring(x0, x1, 2.5, 16.6), NE - 1.0, 1.0, 0.5, null)
  gableRoof(copper, stone, x0, x1, 2.5, 16.6, NE, NR, 'x', 0.5, 0.2)
}
for (const f of [[[17.2, 2.5], [17.2, 16.6]], [[-15.9, 16.6], [-15.9, 2.5]]] as F[]) {
  const L = 14.1
  onWall(trim, f[0], f[1], circ(L / 2, 15.0, 2.6, 16), 0.06)
  onWall(win, f[0], f[1], circ(L / 2, 15.0, 2.1, 16), 0.1)
  onWall(trim, f[0], f[1], archShape(L / 2, 3.6, 0, 3.8, 8), 0.06)
  onWall(door, f[0], f[1], archShape(L / 2, 2.6, 0, 3.6, 8), 0.1)
  for (const s of [2.6, L - 2.6]) {
    onWall(trim, f[0], f[1], archShape(s, 1.7, 5.0, 9.5, 8), 0.05)
    onWall(win, f[0], f[1], archShape(s, 1.2, 5.2, 9.5, 8), 0.09)
  }
}

// transept porches (way/822799760, 822799761): low stone porches over the side doors
for (const [x0, x1] of [[-19.7, -15.9], [17.2, 21.2]]) {
  box(stone, x0, x1, 6.2, 12.9, 0, 8.4, trim, 0.25)
  const xo = x0 < 0 ? x0 : x1
  const f: F = x0 < 0 ? [[xo, 12.9], [xo, 6.2]] : [[xo, 6.2], [xo, 12.9]]
  onWall(trim, f[0], f[1], archShape(3.35, 3.0, 0, 3.6, 8), 0.06)
  onWall(door, f[0], f[1], archShape(3.35, 2.2, 0, 3.4, 8), 0.1)
}

// ── Crossing: square base, lower drum and its cone, windowed drum, dome, lantern ──
box(stone, -6.2, 7.8, 2.5, 16.6, 0, 20.0, null, 0)
{
  const C: XY = [AX, 9.5]
  revolve(stone, C, [[7.2, 19.5], [7.2, 25.6]], 16, Math.PI / 16)
  revolve(trim, C, [[7.2, 25.6], [7.6, 25.9], [7.6, 26.3]], 16, Math.PI / 16)
  revolve(copper, C, [[7.7, 26.3], [5.3, 29.0]], 16, Math.PI / 16)
  revolve(stone, C, [[5.2, 28.9], [5.2, 33.0]], 16, Math.PI / 16)
  revolve(trim, C, [[5.2, 33.0], [5.6, 33.3], [5.6, 33.8], [5.3, 33.9]], 16, Math.PI / 16)
  revolve(copper, C, [[5.3, 33.9], [5.1, 35.6], [4.5, 37.4], [3.4, 39.0], [1.8, 40.2], [1.1, 40.5]], 16, Math.PI / 16)
  revolve(trim, C, [[1.1, 40.5], [1.1, 42.4], [1.35, 42.6]], 8, Math.PI / 8, true)
  revolve(copper, C, [[1.35, 42.6], [0.9, 43.3], [0.3, 43.9], [0, 44.0]], 8, Math.PI / 8)
  box(trim, C[0] - 0.12, C[0] + 0.12, C[1] - 0.12, C[1] + 0.12, 44.0, 45.6, trim, 0)
  box(trim, C[0] - 0.5, C[0] + 0.5, C[1] - 0.12, C[1] + 0.12, 44.9, 45.15, trim, 0)
  // window panels round the drums: paired arched lights above, small round-heads below
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * Math.PI * 2
    const t: XY = [-Math.sin(a), Math.cos(a)]
    for (const [r, w, z0, zs, d] of [[5.2, 0.7, 30.0, 31.8, 0.5], [7.2, 0.9, 21.5, 23.6, 0]]) {
      for (const k of d ? [-1, 1] : [0]) {
        const c: XY = [C[0] + Math.cos(a) * r + t[0] * k * d, C[1] + Math.sin(a) * r + t[1] * k * d]
        const p0: XY = [c[0] - t[0] * w, c[1] - t[1] * w], p1: XY = [c[0] + t[0] * w, c[1] + t[1] * w]
        onWall(win, p0, p1, archShape(w, w * 0.95, z0, zs, 6), 0.08)
      }
    }
  }
}

// ── Front wall between the towers ──
box(stone, -3.7, 5.7, 38.4, 44.7, 0, NE + 0.6, null, 0)
gableRoof(copper, stone, -3.7, 5.7, 38.4, 44.7, NE + 0.6, NR + 0.4, 'y', 0.3, 0.1)
cornice(trim, ring(-3.7, 5.7, 38.4, 44.7), NE - 0.4, 1.0, 0.4, null)

// ── Towers ──
function tower(cx: number) {
  const cy = 42.2, H = 3.6
  const sq = (h: number, z0: number, z1: number, p: Part, bev = 0.1, bottom = false) => box(p, cx - h, cx + h, cy - h, cy + h, z0, z1, p, bev, bottom)
  const fs = (h: number): F[] => [[[cx - h, cy - h], [cx + h, cy - h]], [[cx + h, cy - h], [cx + h, cy + h]], [[cx + h, cy + h], [cx - h, cy + h]], [[cx - h, cy + h], [cx - h, cy - h]]]
  sq(H, 0, 24.2, stone, 0)
  sq(H + 0.35, 24.2, 25.2, trim, 0.2, true)
  for (const [a, b] of fs(H)) {
    onWall(trim, a, b, archShape(H, 1.3, 16.0, 18.6, 6), 0.05)
    onWall(win, a, b, archShape(H, 0.9, 16.2, 18.6, 6), 0.09)
    onWall(trim, a, b, rectShape(H - 0.6, H + 0.6, 6.0, 8.2), 0.05)
    onWall(win, a, b, rectShape(H - 0.4, H + 0.4, 6.2, 8.0), 0.09)
  }
  // belfry stage: one tall arch a face between corner pilasters
  sq(H - 0.3, 25.2, 32.4, stone, 0)
  for (const [a, b] of fs(H - 0.3)) {
    const L = 2 * (H - 0.3)
    onWall(trim, a, b, rectShape(0, 0.8, 25.2, 32.4), 0.08)
    onWall(trim, a, b, rectShape(L - 0.8, L, 25.2, 32.4), 0.08)
    onWall(trim, a, b, archShape(L / 2, 3.0, 26.0, 29.4, 8), 0.05)
    onWall(win, a, b, archShape(L / 2, 2.3, 26.2, 29.4, 8), 0.1)
  }
  sq(H + 0.1, 32.4, 33.4, trim, 0.2, true)
  // steep pyramidal cap with four small corner pyramids, and the cross
  pyramid(copper, [cx, cy], H - 0.7, 33.4, 38.4)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const c: XY = [cx + sx * (H - 0.4), cy + sy * (H - 0.4)]
    box(trim, c[0] - 0.4, c[0] + 0.4, c[1] - 0.4, c[1] + 0.4, 33.4, 34.2, null, 0)
    pyramid(trim, c, 0.4, 34.2, 35.6)
  }
  box(trim, cx - 0.13, cx + 0.13, cy - 0.13, cy + 0.13, 38.2, 40.4, trim, 0)
  box(trim, cx - 0.55, cx + 0.55, cy - 0.13, cy + 0.13, 39.3, 39.6, trim, 0)
}
tower(AX - 8.1)
tower(AX + 8.1)

// ── Portico: steps, six Corinthian columns (and returns), entablature, pediment ──
{
  const x0 = -6.1, x1 = 7.7, y0 = 44.7, y1 = 48.8
  for (let k = 0; k < 4; k++) box(trim, x0 - 2.5 + k * 0.5, x1 + 2.5 - k * 0.5, y0, y1 + 3.0 - k * 0.7, 0, 0.4 * (k + 1), trim, 0.05)
  const Z = 1.6, CT = 13.4, EN = 15.0, PA = 18.4
  for (let i = 0; i < 6; i++) {
    const x = x0 + 0.8 + (i * (x1 - x0 - 1.6)) / 5
    revolve(stone, [x, y1 - 0.8], [[0.68, Z], [0.6, Z + 0.6], [0.58, CT - 1.2], [0.75, CT - 0.2], [0.8, CT]], 10, 0)
  }
  for (const x of [x0 + 0.8, x1 - 0.8]) revolve(stone, [x, y0 + 1.4], [[0.6, Z], [0.58, CT - 1.2], [0.8, CT]], 10, 0)
  box(trim, x0, x1, y0, y1, CT, EN, null, 0, true)
  // pediment
  const xm = (x0 + x1) / 2
  const fr: V3[] = [[x0, y1, EN], [x1, y1, EN], [xm, y1, PA]]
  trim.tri(fr[0], fr[1], fr[2])
  gableRoof(copper, null, x0, x1, y0, y1, EN, PA, 'y', 0.3, 0.15)
  // the three doors behind the columns
  const f: F = [[5.7, 44.7], [-3.7, 44.7]]
  for (const s of [2.0, 4.7, 7.4]) {
    onWall(trim, f[0], f[1], rectShape(s - 1.0, s + 1.0, Z, Z + 5.6), 0.05)
    onWall(door, f[0], f[1], rectShape(s - 0.75, s + 0.75, Z, Z + 4.4), 0.09)
    onWall(win, f[0], f[1], rectShape(s - 0.75, s + 0.75, Z + 4.6, Z + 5.4), 0.09)
  }
}

// ── The rectory and offices behind the apse (way/822799759, 822799762, 822799763) ──
{
  const rect = ccw([[-14.9, 0.2], [-14.9, 0.9], [-21.8, 0.9], [-21.8, -9.3], [-22.0, -29.9], [-21.3, -33.1], [-21.0, -34.6], [-21.7, -35.0], [-20.9, -38.4], [-20.2, -38.3], [-19.2, -42.6], [-9.2, -40.3], [-9.4, -39.3], [6.9, -35.5], [6.5, -33.7], [7.8, -33.4], [10.7, -32.8], [15.5, -31.6], [16.0, -33.7], [25.7, -31.4], [25.1, -28.6], [26.8, -28.1], [24.2, -17.1], [20.2, -18.0], [16.1, -0.9], [11.1, -0.5], [10.9, -4.4], [10.6, -8.5], [8.3, -12.0], [4.9, -14.2], [0.8, -15.0], [-3.2, -14.2], [-6.7, -11.9], [-8.9, -8.4], [-8.9, -4.4], [-8.9, 0.2]])
  prism(stone, rect, 0, 8.2, roof, 0.2)
  const w1 = ccw([[-9.2, -40.3], [-9.4, -39.3], [-11.7, -27.6], [-22.0, -29.9], [-21.3, -33.1], [-21.0, -34.6], [-21.7, -35.0], [-20.9, -38.4], [-20.2, -38.3], [-19.2, -42.6]])
  const w2 = ccw([[24.2, -17.1], [20.2, -18.0], [16.2, -19.2], [16.8, -21.4], [10.0, -23.1], [8.4, -23.5], [10.7, -32.8], [15.5, -31.6], [16.0, -33.7], [25.7, -31.4], [25.1, -28.6], [26.8, -28.1]])
  prism(stone, w1, 8.2, 11.0, roof, 0.2)
  prism(stone, w2, 8.2, 11.0, roof, 0.2)
  // window bands along the long outer walls (outside to the right of a CCW edge)
  const FWD = rect[0][0] === -14.9 && rect[0][1] === 0.2
  for (const [a, b] of [[[-21.8, -9.3], [-21.8, 0.9]], [[-22.0, -29.9], [-21.8, -9.3]], [[-9.4, -39.3], [6.9, -35.5]], [[16.0, -33.7], [25.7, -31.4]], [[26.8, -28.1], [24.2, -17.1]]] as F[]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 3.4))
    for (let i = 0; i < n; i++) for (const z of [1.2, 4.9]) onWall(win, FWD ? a : b, FWD ? b : a, rectShape((L / n) * (i + 0.5) - 0.6, (L / n) * (i + 0.5) + 0.6, z, z + 1.8), 0.07)
  }
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[1] > 36 || Math.hypot(p[0] - AX, p[1] - 9.5) < 8 ? 0.95 : 0.55)
await save('ric-cathedral-sacred-heart', 'Cathedral of the Sacred Heart', [
  { part: stone, material: { ...finish('shc-limestone', 0xe8e0cd), floodlight: lit } },
  { part: trim, material: { ...finish('shc-trim', 0xf5efe3), floodlight: lit } },
  { part: copper, material: finish('shc-copper', 0x7aa697) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('shc-door', 0x5e4a3a) },
  { part: roof, material: PALETTE.roof },
], { height: 45.6, anchor: [37.5474803, -77.4523081], bearing: 103 })
