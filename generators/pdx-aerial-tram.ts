/**
 * Portland Aerial Tram (2006, agps architecture with Doppelmayr / Garaventa),
 * Portland, Oregon: procedural, CC0-1.0, no textures.
 * bun generators/pdx-aerial-tram.ts
 *
 * The jig-back aerial tram from the South Waterfront up to the Oregon Health
 * & Science University on Marquam Hill: the lower terminal, an open grey
 * steel box at the waterfront; the single intermediate tower, a slender grey
 * shaft with a broad saddle frame on top, near the I-5 freeway; the upper
 * station, a grey steel deck on tall columns beside the Kohler Pavilion; the
 * two tracks of ropes between them; and the two silver bubble cabins, drawn
 * where they pass each other mid-span, each hanging from its curved arm.
 *
 * Frame: x east, y north, z up, metres, bearing 0 (the line runs almost due
 * west from the lower terminal). Origin: the midpoint of OSM way/180623086's
 * end nodes. z = 0 is the lowest ground under the model, at the lower
 * terminal (Mapterhorn terrain, 10.6 m above sea level). Everything that
 * stands on land (the terminal, the tower, the upper station's columns)
 * runs down to the terrain under it, read from `tools/terrain.ts grid`, so
 * the map drapes the model along the hill.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the line way/180623086
 *   (aerialway=cable_car; its middle node the tower); the stations
 *   way/75733977 (South Waterfront) and way/123502675 (Marquam Hill). The
 *   Kohler Pavilion (way/57692207) is a separate building and is not
 *   replaced.
 * - Published (Wikipedia, "Portland Aerial Tram"; OHSU): 3,300 ft (1 km)
 *   long, a 500 ft (150 m) rise, the tower 197 ft (60 m) tall, two cabins of
 *   78 passengers.
 * - Mapterhorn terrain along the line (ground heights for the feet).
 * - Photos (evidence, Wikimedia Commons):
 *   - Cacophony, "PortlandAerialTram10.jpg", CC BY 3.0 (the two cabins
 *     passing, their arms and carriages, the tower and its saddle frame):
 *     https://commons.wikimedia.org/wiki/File:PortlandAerialTram10.jpg
 *   - Doug Kerr, "Portland Aerial Tram - Portland, Oregon (14613518881).jpg",
 *     CC BY-SA 2.0 (the lower terminal from above, a cabin docked):
 *     https://commons.wikimedia.org/wiki/File:Portland_Aerial_Tram_-_Portland,_Oregon_(14613518881).jpg
 *   - Doug Kerr, "Portland Aerial Tram - Portland, Oregon (14616206212).jpg",
 *     CC BY-SA 2.0 (the tower's head from below: the saddles, catwalks):
 *     https://commons.wikimedia.org/wiki/File:Portland_Aerial_Tram_-_Portland,_Oregon_(14616206212).jpg
 *   - Paul Horner, "Portland Aerial Tram (4173542689).jpg", CC BY-SA 2.0 (the
 *     lower terminal: the grey box frame, open to the west):
 *     https://commons.wikimedia.org/wiki/File:Portland_Aerial_Tram_(4173542689).jpg
 *   - Tim Adams, "Portland Aerial Tram departs OHSU campus.png", CC BY 3.0
 *     (a cabin at the upper station: its shape and silver finish):
 *     https://commons.wikimedia.org/wiki/File:Portland_Aerial_Tram_departs_OHSU_campus.png
 *
 * Numbers (no lidar used)
 * - Published: the tower 60 m over its ground; the upper platform 150 m
 *   over the lower one.
 * - Terrain: the ground at the lower terminal (0), the tower (10.5 m), under
 *   the upper station (about 98-112 m, falling east).
 * - Estimated from the photos: the lower terminal box 15 m high, the ropes
 *   entering it at 9 m; the tower's saddle frame 15 m wide; the two tracks
 *   10 m apart; the cabins about 7 m long, 4.6 m wide, 3.6 m high, hanging
 *   6 m under their carriages; the main span's sag 25 m.
 * - Each track's two track ropes and the haul ropes are drawn as one rope
 *   per track, thicker than real so it reads.
 *
 * Night: the cabins' windows glow.
 *
 * Doubts
 * - The upper station is drawn as a plain steel-clad deck on four columns;
 *   no licensed photo shows it whole.
 * - The tower is drawn plumb; its slight lean is not modelled.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { tube } from './bridge-kit'

type XY = [number, number]
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % n]
    p.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  if (top) for (let i = 1; i < n - 1; i++) p.tri([ring[0][0], ring[0][1], z1], [ring[i][0], ring[i][1], z1], [ring[i + 1][0], ring[i + 1][1], z1])
  if (bottom) for (let i = 1; i < n - 1; i++) p.tri([ring[0][0], ring[0][1], z0], [ring[i + 1][0], ring[i + 1][1], z0], [ring[i][0], ring[i][1], z0])
}
/** An axis-aligned box, counter-clockwise from above. */
const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true, bottom = false) =>
  prism(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, top, bottom)

// Ground along the line (Mapterhorn, metres above the lowest point, by x).
const GROUND: Array<[number, number]> = [[-520, 113.6], [-480, 98.1], [-440, 92.4], [-400, 86.2], [-360, 73.4], [-320, 69.1], [-280, 70.3], [-240, 55.3], [-200, 51.4], [-160, 42.5], [-120, 42.3], [-80, 41.2], [-40, 38.9], [0, 38.9], [40, 35.9], [80, 34.2], [120, 32.2], [160, 29.7], [200, 25.7], [240, 22.9], [280, 18.1], [320, 13.7], [360, 13.0], [400, 9.2], [440, 1.1], [480, 0.4], [520, 0.5]]
const ground = (x: number) => {
  for (let i = 0; i < GROUND.length - 1; i++) {
    const [a, za] = GROUND[i], [b, zb] = GROUND[i + 1]
    if (x <= b) return za + ((Math.max(x, a) - a) / (b - a)) * (zb - za)
  }
  return GROUND[GROUND.length - 1][1]
}

const steel = new Part()   // stations and tower: grey painted steel
const glazing = new Part() // station glazing
const rope = new Part()    // ropes, carriages, arms
const cabin = new Part()   // the silver cabins
const cabWin = new Part()  // cabin windows

// Plan (OSM, this frame)
const LOW: XY = [504.4, -12.2], TOWER: XY = [384.6, -9.3], UP: XY = [-504.4, 12.2]
const LINE_Y = (x: number) => LOW[1] + ((x - LOW[0]) / (UP[0] - LOW[0])) * (UP[1] - LOW[1])
const TRACK = 5.0                     // each track 5 m either side of the line
const Z_LOW = 9.0                     // ropes entering the lower terminal
const Z_TOWER = ground(TOWER[0]) + 60 // 70.5, the saddle tops
const Z_UP = 152.0                    // ropes at the upper station
const SAG = 25                        // main span's sag at mid-span

// --- the lower terminal: an open grey steel box, open to the west
{
  const x0 = 495.2, x1 = 519.7, y0 = -17.3, y1 = 0.5, H = 15
  box(steel, x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5, H - 1.2, H, true, true)              // the roof
  box(steel, x1 - 1.2, y0, x1, y1, 0, H - 1.2, false)                                      // the back wall
  for (const [ya, yb] of [[y0, y0 + 0.8], [y1 - 0.8, y1]]) {
    box(steel, x0, ya, x1 - 1.2, yb, 0, 4.5, true)                                         // solid lower sides
    box(glazing, x0 + 1.0, ya + 0.1, x1 - 1.2, yb - 0.1, 4.5, H - 1.2, false)              // glazed upper sides
    box(steel, x0, ya, x0 + 1.0, yb, 4.5, H - 1.2, false)                                  // the portal posts
  }
  box(steel, x0, y0, x0 + 1.0, y1, H - 2.6, H - 1.2, false, true)                          // the portal beam
  box(steel, x0 + 1, y0 + 0.8, x1 - 1.2, y1 - 0.8, 4.0, 4.6, true, true)                   // the platform
}

// --- the tower: a slender shaft, the saddle frame on top
{
  const [tx, ty] = TOWER, g = ground(tx) - 0.5
  prism(steel, [[tx - 1.9, ty - 1.4], [tx + 1.9, ty - 1.4], [tx + 1.9, ty + 1.4], [tx - 1.9, ty + 1.4]], g, g + 6, false)
  prism(steel, [[tx - 1.9, ty - 1.4], [tx + 1.9, ty - 1.4], [tx + 1.9, ty + 1.4], [tx - 1.9, ty + 1.4]].map(([x, y]) => [x, y] as XY), g + 6, Z_TOWER - 7, false)
  const W = 7.5, top = Z_TOWER
  box(steel, tx - 1.6, ty - W, tx + 1.6, ty + W, top - 7.0, top - 5.8, true, true)          // the lower crossarm
  box(steel, tx - 1.6, ty - W, tx + 1.6, ty + W, top - 1.4, top - 0.4, true, true)          // the upper crossarm
  for (const s of [-1, 1]) {
    box(steel, tx - 1.4, ty + s * TRACK - 0.5, tx + 1.4, ty + s * TRACK + 0.5, top - 5.8, top - 1.4, false)  // saddle posts
    box(steel, tx - 4.5, ty + s * TRACK - 0.8, tx + 4.5, ty + s * TRACK + 0.8, top - 0.4, top, true, true)  // the saddles
    box(steel, tx - 1.2, ty + s * (W - 0.3) - 0.3, tx + 1.2, ty + s * (W - 0.3) + 0.3, top - 15, top - 5.8, false) // hangers of the catwalks
  }
}

// --- the upper station: a steel-clad deck on four tall columns
{
  const x0 = -527, x1 = -498, y0 = 1.0, y1 = 25.0, zb = Z_UP - 8, zt = Z_UP + 7
  box(steel, x0, y0, x1, y1, zb, zt, true, true)
  box(glazing, x1 + 0.06, y0 + 2, x1 + 0.06, y1 - 2, zb + 3, zt - 2, false)
  // its open east face, where the ropes come in
  box(glazing, x0 + 2, y0 - 0.06, x1 - 2, y0 - 0.06, zb + 4, zt - 2, false)
  box(glazing, x0 + 2, y1 + 0.06, x1 - 2, y1 + 0.06, zb + 4, zt - 2, false)
  for (const [x, y] of [[x0 + 3, y0 + 3], [x1 - 3, y0 + 3], [x0 + 3, y1 - 3], [x1 - 3, y1 - 3]] as XY[])
    box(steel, x - 0.9, y - 0.9, x + 0.9, y + 0.9, ground(x) - 1.0, zb, false)
}

// --- the ropes: one per track, from the lower terminal over the tower's
// saddle to the upper station, sagging in each span
function span(xa: number, za: number, xb: number, zb: number, sag: number, n: number, dy: number): V3[] {
  return Array.from({ length: n + 1 }, (_, k) => {
    const t = k / n, x = xa + (xb - xa) * t
    return [x, LINE_Y(x) + dy, za + (zb - za) * t - 4 * sag * t * (1 - t)] as V3
  })
}
const ropeAt = (x: number, dy: number) => {
  // the main span's height under x (for hanging the cabins)
  const xa = TOWER[0], xb = UP[0] + 14, t = (x - xa) / (xb - xa)
  return Z_TOWER + (Z_UP - Z_TOWER) * t - 4 * SAG * t * (1 - t) + 0 * dy
}
for (const s of [-1, 1]) {
  tube(rope, span(LOW[0] - 6, Z_LOW, TOWER[0], Z_TOWER + 0.3, 1.0, 10, s * TRACK), 0.22, 3)
  tube(rope, span(TOWER[0], Z_TOWER + 0.3, UP[0] + 14, Z_UP, SAG, 40, s * TRACK), 0.22, 3)
}

// --- the cabins, passing mid-span: a rounded silver body under a curved arm
function cabinAt(x: number, dy: number) {
  const y = LINE_Y(x) + dy, zr = ropeAt(x, dy)
  const zc = zr - 6.0 - 3.6, L = 3.5, W = 2.3, H = 3.6
  // an octagonal section lofted along x, its ends rounded in
  const section = (half: number, k: number): XY[] => {
    const w = W * k, h = H / 2
    return [[-w, -h * 0.6], [-w * 0.75, -h], [w * 0.75, -h], [w, -h * 0.6], [w, h * 0.6], [w * 0.75, h], [-w * 0.75, h], [-w, h * 0.6]].map(([a, b]) => [a, b] as XY)
  }
  const rings: Array<[number, number]> = [[-L, 0.55], [-L + 0.8, 0.95], [L - 0.8, 0.95], [L, 0.55]]
  const pts = rings.map(([u, k]) => section(0, k).map(([a, b]) => [x + u, y + a, zc + H / 2 + b] as V3))
  for (let r = 0; r < pts.length - 1; r++) {
    const A = pts[r], B = pts[r + 1]
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      cabin.quad(A[i], A[j], B[j], B[i])
    }
  }
  for (const [ring, flip] of [[pts[0], true], [pts[3], false]] as Array<[V3[], boolean]>) {
    for (let i = 1; i < 7; i++) flip ? cabin.tri(ring[0], ring[i + 1], ring[i]) : cabin.tri(ring[0], ring[i], ring[i + 1])
  }
  // the window band round the cabin, flush on its faces
  for (const s of [-1, 1]) {
    const yy = y + s * (W * 0.95 + 0.05)
    const P: V3[] = [[x - L + 0.9, yy, zc + 1.4], [x + L - 0.9, yy, zc + 1.4], [x + L - 0.9, yy, zc + 2.7], [x - L + 0.9, yy, zc + 2.7]]
    s > 0 ? cabWin.quad(P[1], P[0], P[3], P[2]) : cabWin.quad(P[0], P[1], P[2], P[3])
  }
  for (const s of [-1, 1]) {
    const xx = x + s * (L + 0.05), w = W * 0.5
    const P: V3[] = [[xx, y - w, zc + 1.4], [xx, y + w, zc + 1.4], [xx, y + w, zc + 2.7], [xx, y - w, zc + 2.7]]
    s > 0 ? cabWin.quad(P[0], P[1], P[2], P[3]) : cabWin.quad(P[1], P[0], P[3], P[2])
  }
  // the curved arm up to the carriage on the rope
  const arm: V3[] = Array.from({ length: 6 }, (_, k) => {
    const t = k / 5
    return [x - 1.2 * Math.sin(t * Math.PI) , y, zc + H + (zr - 0.6 - zc - H) * t] as V3
  })
  tube(rope, arm, 0.35, 4)
  box(rope, x - 1.6, y - 0.4, x + 1.6, y + 0.4, zr - 0.8, zr + 0.4, true, true)
}
cabinAt(-60, -TRACK)
cabinAt(-60, TRACK)

// ---------------------------------------------------------------- output ---
const parts = [
  { part: steel, material: finish('tram-steel', 0xaab0b5) },
  { part: glazing, material: PALETTE.glass },
  { part: rope, material: finish('tram-rope', 0x5d6369) },
  { part: cabin, material: finish('tram-cabin-silver', 0xd3d7da) },
  { part: cabWin, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Portland Aerial Tram', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: Z_UP + 7,
})
await Bun.write(new URL('../models/pdx-aerial-tram.glb', import.meta.url), glb)
console.log(`pdx-aerial-tram.glb: ${triangles} triangles, ${glb.length} bytes`)
