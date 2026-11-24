/**
 * Brooklyn Masonic Temple, 317 Clermont Avenue at Lafayette Avenue, Fort
 * Greene (Lord & Hewlett with Pell & Corbett, 1906) — procedural, CC0-1.0,
 * no textures.
 * bun generators/nyc-brooklyn-masonic-temple.ts
 *
 * Model frame: x along Lafayette Avenue (east), y towards it (north), z up,
 * metres; placed at bearing 351.3 (the Brooklyn street grid, 8.7° anti-
 * clockwise of true north). Anchor: area centroid of the OSM outline
 * way/250361396 (-73.969530, 40.688065).
 *
 * Evidence
 * - OSM: way/250361396 "Brooklyn Masonic Temple", height 34.7; a square of
 *   30.4 m in the model frame. No building:parts.
 * - Lidar: USGS NY_NewYorkCity (2017), 0.5 m grid read in the model frame
 *   (lidar_frame.py, bearing -8.7). Base = the street at the north-west
 *   corner; the ground rises about 1 m to the south-east. Measured:
 *   footprint ±15.2 m; cornice edge 29.1 m; attic 32.0 m, set back about
 *   1.5 m; the roof rises to 34.6 m in the middle. The building to the
 *   south-east stands against the east face up to about 24 m.
 * - Published (Wikipedia "Brooklyn Masonic Temple"; NYC LPC Fort Greene
 *   Historic District): 1906, Lord & Hewlett with Pell & Corbett; a Greek
 *   temple form in buff/brown brick with polychrome terracotta.
 * - Photos (Wikimedia Commons):
 *   - "Brooklyn Masonic Temple from west.jpg", Beyond My Ken, CC BY-SA 4.0
 *   - "Brooklyn Masonic Temple from east.jpg", Beyond My Ken, CC BY-SA 4.0
 *   - "Masonic Lafayette Clermont sunny jeh.jpg", Jim.henderson, CC0
 *
 * Read from the photos: a pale limestone base, banded, with a polychrome
 * (green-dotted) belt at its top; a dark brown brick body; on each street
 * face a recessed loggia of four giant fluted Ionic columns in cream
 * terracotta between broad brick end piers, each pier with a slit window
 * and a polychrome medallion; a cream entablature whose frieze carries red
 * and green roundels; a deep cornice; a pierced attic and a cresting of
 * green copper antefixes. Two doors in the base of each street face,
 * symmetric about its middle (east photo).
 *
 * Estimated from the photos, scaled on the lidar cornice: the base
 * (9.6 m), stylobate (12.6–13.2 m), column height (13.2–24.0 m) and
 * diameter (1.3 m), the loggia width (19 m) and depth (1.6 m), the frieze
 * roundels, cornice projection (1.2 m) and the cresting (0.9 m).
 * Doubts: the south and east faces are not photographed and are drawn as
 * plain brick over the base; which street face carries which door is
 * read from two photos taken in poor alignment, so both street faces get
 * the same pair.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, quadN, capPoly, type XY } from './nyc-570-lexington'

const brick = new Part(), stone = new Part(), copper = new Part(), win = new Part(), roundel = new Part(), roof = new Part()

const H = 15.2
const BASE = 9.6, STYLOBATE = 13.2, COL_TOP = 24.0, ENT = 24.8, FRIEZE0 = 25.6, FRIEZE1 = 26.9, CORNICE0 = 27.6, CORNICE1 = 29.1
const ATTIC = 32.0, INSET = 1.5, CREST = 0.9, ROOF_TOP = 34.6
const LOGGIA = 9.5, DEPTH = 1.6 // loggia half-width and depth

const RING: XY[] = [[-H, -H], [H, -H], [H, H], [-H, H]]

function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, at, u, n }
}
type At = (s: number, z: number, d?: number) => V3
const rect = (p: Part, at: At, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(s0, z0, d), at(s1, z0, d), at(s1, z1, d), at(s0, z1, d))
/** A box from d0 to d1 off the wall, all four visible sides and the top. */
function box(p: Part, at: At, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, bottom = false) {
  rect(p, at, s0, s1, z0, z1, d1)
  p.quad(at(s0, z0, d0), at(s0, z0, d1), at(s0, z1, d1), at(s0, z1, d0))
  p.quad(at(s1, z0, d1), at(s1, z0, d0), at(s1, z1, d0), at(s1, z1, d1))
  p.quad(at(s0, z1, d1), at(s1, z1, d1), at(s1, z1, d0), at(s0, z1, d0))
  if (bottom) p.quad(at(s0, z0, d0), at(s1, z0, d0), at(s1, z0, d1), at(s0, z0, d1))
}
/** A fluted-looking column: a 12-sided smooth cylinder centred at (s, d). */
function column(p: Part, at: At, s: number, d: number, r: number, z0: number, z1: number) {
  const N = 12
  for (let k = 0; k < N; k++) {
    const a0 = (2 * Math.PI * k) / N, a1 = (2 * Math.PI * (k + 1)) / N
    const P = (a: number, z: number) => at(s + r * Math.cos(a), z, d + r * Math.sin(a))
    const nrm = (a: number): V3 => { const q = P(a, 0), c = at(s, 0, d); return [q[0] - c[0], q[1] - c[1], 0] }
    const n0 = nrm(a0), n1 = nrm(a1), l0 = Math.hypot(n0[0], n0[1]), l1 = Math.hypot(n1[0], n1[1])
    const m0: V3 = [n0[0] / l0, n0[1] / l0, 0], m1: V3 = [n1[0] / l1, n1[1] / l1, 0]
    quadN(p, P(a1, z0), P(a0, z0), P(a0, z1), P(a1, z1), [m1, m0, m0, m1])
  }
}

/** A flush octagonal disc (a frieze roundel or medallion). */
function disc(p: Part, at: At, s: number, z: number, r: number, d: number) {
  for (let k = 0; k < 8; k++) {
    const a0 = (Math.PI * 2 * k) / 8 + Math.PI / 8, a1 = (Math.PI * 2 * (k + 1)) / 8 + Math.PI / 8
    p.tri(at(s, z, d), at(s + r * Math.cos(a0), z + r * Math.sin(a0), d), at(s + r * Math.cos(a1), z + r * Math.sin(a1), d))
  }
}

RING.forEach((a, i) => {
  const b = RING[(i + 1) % 4]
  const { L, at } = along(a, b)
  const c = L / 2, street = i === 2 || i === 3

  // Base: banded limestone, the green-dotted polychrome belt at its top,
  // and the stylobate ledge the columns stand on.
  rect(stone, at, 0, L, 0, BASE, 0)
  box(copper, at, -0.15, L, BASE - 0.5, BASE, 0, 0.15)
  box(stone, at, -0.3, L, STYLOBATE - 0.6, STYLOBATE, 0, 0.3)
  for (const z of [3.0, 5.4, 7.6]) rect(stone, at, 0.2, L - 0.2, z, z + 0.18, 0.08) // banding

  if (!street) {
    rect(brick, at, 0, L, BASE, ENT, 0)
  } else {
    const s0 = c - LOGGIA, s1 = c + LOGGIA
    // End piers and the brick wall under the loggia.
    rect(brick, at, 0, s0, BASE, ENT, 0)
    rect(brick, at, s1, L, BASE, ENT, 0)
    rect(brick, at, s0, s1, BASE, STYLOBATE - 0.6, 0)
    // The recess: back wall, returns, floor and ceiling.
    rect(brick, at, s0, s1, STYLOBATE - 0.6, ENT, -DEPTH)
    brick.quad(at(s0, STYLOBATE - 0.6, -DEPTH), at(s0, STYLOBATE - 0.6, 0), at(s0, ENT, 0), at(s0, ENT, -DEPTH)) // faces +s
    brick.quad(at(s1, STYLOBATE - 0.6, 0), at(s1, STYLOBATE - 0.6, -DEPTH), at(s1, ENT, -DEPTH), at(s1, ENT, 0))
    stone.quad(at(s0, STYLOBATE - 0.6, 0), at(s1, STYLOBATE - 0.6, 0), at(s1, STYLOBATE - 0.6, -DEPTH), at(s0, STYLOBATE - 0.6, -DEPTH))
    stone.quad(at(s0, ENT, -DEPTH), at(s1, ENT, -DEPTH), at(s1, ENT, 0), at(s0, ENT, 0))
    // Four Ionic columns in antis, with capitals and bases.
    const cols = [-5.7, -1.9, 1.9, 5.7]
    for (const dx of cols) {
      column(stone, at, c + dx, -0.75, 0.65, STYLOBATE - 0.6, COL_TOP)
      box(stone, at, c + dx - 0.95, c + dx + 0.95, COL_TOP, ENT, -1.6, 0.05, true)
      box(stone, at, c + dx - 0.85, c + dx + 0.85, STYLOBATE - 0.6, STYLOBATE - 0.1, -1.6, 0.05)
    }
    // Windows in the loggia, two tiers per intercolumniation.
    const edges = [s0, ...cols.map((dx) => c + dx), s1]
    for (let k = 0; k < edges.length - 1; k++) {
      const m = (edges[k] + edges[k + 1]) / 2
      rect(win, at, m - 1.0, m + 1.0, 13.6, 18.4, -DEPTH + 0.05)
      rect(win, at, m - 1.0, m + 1.0, 19.2, 23.6, -DEPTH + 0.05)
    }
    // End piers: a slit window in a stone frame and a medallion above.
    for (const m of [s0 / 2, (s1 + L) / 2]) {
      rect(stone, at, m - 0.75, m + 0.75, 13.4, 22.0, 0.04)
      rect(win, at, m - 0.45, m + 0.45, 13.7, 21.7, 0.08)
      rect(stone, at, m - 1.0, m + 1.0, 22.4, 24.2, 0.04)
      disc(roundel, at, m, 23.3, 0.7, 0.08)
    }
    // Doors in the base, symmetric about the middle, and grilles between.
    for (const dx of [-9, 9]) {
      box(stone, at, c + dx - 1.8, c + dx + 1.8, 0, 5.6, 0, 0.25)
      box(stone, at, c + dx - 2.1, c + dx + 2.1, 5.6, 6.2, 0, 0.45)
      rect(copper, at, c + dx - 1.1, c + dx + 1.1, 0.4, 4.6, 0.3)
    }
    for (const dx of [-4, 4]) rect(win, at, c + dx - 0.7, c + dx + 0.7, 2.6, 5.6, 0.06)
  }

  // Entablature with the roundel frieze, cornice and attic (all faces).
  rect(stone, at, 0, L, ENT, CORNICE0, 0)
  const nr = Math.round(L / 2.3), pr = L / nr
  for (let k = 0; k < nr; k++) disc(roundel, at, (k + 0.5) * pr, (FRIEZE0 + FRIEZE1) / 2, 0.55, 0.06)
  box(stone, at, -1.2, L, CORNICE0, CORNICE1, 0, 1.2, true)
})

// Attic, set back on the cornice: brick with pierced cream panels, and the
// green copper cresting along its top.
const ATT: XY[] = RING.map(([x, y]) => [x - Math.sign(x) * INSET, y - Math.sign(y) * INSET])
ATT.forEach((a, i) => {
  const b = ATT[(i + 1) % 4]
  const { L, at } = along(a, b)
  rect(brick, at, 0, L, CORNICE1, ATTIC, 0)
  const np = Math.round(L / 3.4), pp = L / np
  for (let k = 0; k < np; k++) rect(stone, at, k * pp + 0.6, (k + 1) * pp - 0.6, CORNICE1 + 0.7, ATTIC - 0.6, 0.05)
  box(copper, at, -0.15, L, ATTIC, ATTIC + 0.3, -0.2, 0.15)
  const nt = Math.round(L / 1.1), pt = L / nt
  for (let k = 0; k < nt; k++) {
    const m = (k + 0.5) * pt
    copper.tri(at(m - 0.4, ATTIC + 0.3, 0.05), at(m + 0.4, ATTIC + 0.3, 0.05), at(m, ATTIC + 0.3 + CREST, 0.05))
    copper.tri(at(m + 0.4, ATTIC + 0.3, 0.05), at(m - 0.4, ATTIC + 0.3, 0.05), at(m, ATTIC + 0.3 + CREST, 0.05))
  }
})
capPoly(roof, ATT, ATTIC + 0.3)
// The raised middle of the roof (lidar 34.6 m).
const MIDR: XY[] = [[-8, -8], [8, -8], [8, 8], [-8, 8]]
MIDR.forEach((a, i) => {
  const b = MIDR[(i + 1) % 4]
  roof.quad([a[0], a[1], ATTIC + 0.3], [b[0], b[1], ATTIC + 0.3], [b[0], b[1], ROOF_TOP], [a[0], a[1], ROOF_TOP])
})
capPoly(roof, MIDR, ROOF_TOP)

finishModel('Brooklyn Masonic Temple', 'nyc-brooklyn-masonic-temple', [
  { part: brick, material: finish('masonic-brown-brick', 0x9f9283) },
  { part: stone, material: finish('masonic-limestone', 0xeae0c9) },
  { part: copper, material: PALETTE.copper },
  { part: win, material: PALETTE.window },
  { part: roundel, material: PALETTE.terracotta },
  { part: roof, material: PALETTE.roof },
], { bearing: 351.3, osm: 'way/250361396', height: ROOF_TOP })
