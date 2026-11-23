/**
 * BAM Peter Jay Sharp Building (Brooklyn Academy of Music), 30 Lafayette
 * Avenue, Fort Greene (Herts & Tallant, 1908) — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-bam.ts
 *
 * Map frame: model x along Lafayette Avenue (east), y towards it (north),
 * z up, metres; placed at bearing 351.4 (the block is turned 8.6° anti-
 * clockwise from true north). Anchor: area centroid of the OSM outline
 * way/250979163 (-73.977698, 40.686466).
 *
 * Evidence
 * - OSM: way/250979163, "BAM Peter Jay Sharp Building", height 21.7,
 *   wikidata Q72912; no building:parts. The outline has a 5 m slot cut
 *   40 m in from the south; lidar shows only a narrow light well there at
 *   roof level, so the block is modelled whole.
 * - Lidar: USGS NY_NewYorkCity (2017), 0.5 m grid, read in the model frame
 *   (lidar_frame.py, bearing -8.6). Street at the north-west corner is the
 *   base (y = 0). Measured: footprint x -27.3…27.7, y -31…30.5; front
 *   parapet top 21.7 m; roof behind it 20–21 m with the auditorium roof
 *   at about 23.8 m; the south third of the block 25.5 m; the stage fly
 *   tower (x 4…20, y -8…-30) 29 m. The street rises about 2 m to the
 *   south-east.
 * - Published (Wikipedia "Brooklyn Academy of Music"; NYC LPC, BAM
 *   Historic District): Herts & Tallant, opened 1908; Renaissance revival,
 *   buff brick with polychrome terracotta; the Lafayette Avenue front with
 *   five tall arched windows, inscribed frieze and a polychrome parapet.
 * - Photos (Wikimedia Commons):
 *   - "2013 BAM Peter Jay Sharp Building from west.jpg", Beyond My Ken, CC BY-SA 4.0
 *   - "2013 BAM Peter Jay Sharp Building from east.jpg", Beyond My Ken, CC BY-SA 4.0
 *   - "BAM Peter Jay Sharp Building.jpg", Jeffrey Bary, CC BY 2.0
 *   - "Brooklyn Academy of Music (BAM) (48228024996).jpg", Ajay Suresh, CC BY 2.0
 *
 * Read from the photos: a tall buff-brick block on a rusticated base with
 * five doors and a glass canopy on Lafayette; a polychrome terracotta belt
 * over the base; five round-headed windows with cream terracotta
 * surrounds; an aedicule (two columns under an arched niche) near the
 * front of each side; inscribed frieze, a deep grey-green cornice, and a
 * parapet of red-orange panels between cream piers with cream acroteria
 * at the corners and along the front.
 *
 * Estimated from the photos, scaled on the 21.7 m parapet: the window
 * heights (sill 8.2 m, crown 16.7 m) and widths (4.4 m, 7.4 m apart, centred), the aedicules,
 * the base (6.4 m), belt, frieze, cornice depth (1.3 m) and acroteria.
 * Rework after lead review (2026-11-23): the five arched windows were
 * too small. Re-read from Brooklyn Academy of Music (BAM) (48228024996)
 * (Ajay Suresh, CC BY 2.0), scaled on the lidar parapet: glass sill 7.4 m
 * (just over the belt), crown about 16 m, surround up to the frieze;
 * centre pitch fitted by perspective to about 7.2 m. Glass now 4.6 m wide
 * in a 0.9 m terracotta surround that runs from the belt to the frieze;
 * glazing dark green-black (pulled light to #56665f); the terracotta trim
 * a warmer tan (#dcc79c) and the brick a cooler pale buff-grey (#dcd8cb),
 * from the same photo and the two Beyond My Ken photos.
 * The rear (south) face is not photographed and is drawn plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, type XY } from './nyc-570-lexington'

const brick = new Part(), trim = new Part(), grey = new Part(), red = new Part(), win = new Part(), door = new Part()

const X0 = -27.3, X1 = 27.7, Y0 = -31, Y1 = 30.5
const BASE = 6.4, BELT = 7.1, FRIEZE = 16.9, CORNICE = 18.4, CORNICE_TOP = 19.3, PARAPET = 21.7, OVER = 1.3

/** A frame along a wall a→b (counter-clockwise), d outward. */
function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (s: number, z: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, at, u, n }
}
const rect = (p: Part, at: (s: number, z: number, d?: number) => V3, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(s0, z0, d), at(s1, z0, d), at(s1, z1, d), at(s0, z1, d))

/** A box standing proud of a wall: front at d, sides back to the wall, top capped. */
function block(p: Part, at: (s: number, z: number, d?: number) => V3, s0: number, s1: number, z0: number, z1: number, d: number) {
  rect(p, at, s0, s1, z0, z1, d)
  p.quad(at(s0, z0, 0), at(s0, z0, d), at(s0, z1, d), at(s0, z1, 0))
  p.quad(at(s1, z0, d), at(s1, z0, 0), at(s1, z1, 0), at(s1, z1, d))
  p.quad(at(s0, z1, d), at(s1, z1, d), at(s1, z1, 0), at(s0, z1, 0))
}

/** A round-headed panel: rectangle to `spring`, semicircle above (10 segments). */
function arched(p: Part, at: (s: number, z: number, d?: number) => V3, c: number, w: number, z0: number, spring: number, d: number) {
  const r = w / 2
  rect(p, at, c - r, c + r, z0, spring, d)
  const N = 10
  for (let k = 0; k < N; k++) {
    const a0 = Math.PI * k / N, a1 = Math.PI * (k + 1) / N
    p.tri(at(c, spring, d), at(c + r * Math.cos(a0), spring + r * Math.sin(a0), d), at(c + r * Math.cos(a1), spring + r * Math.sin(a1), d))
  }
}

// ---------------------------------------------------------------------------
// Masses: the main block to the cornice, the taller rear third, the
// auditorium roof and the stage fly tower (all lidar).
// ---------------------------------------------------------------------------
const MAIN: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
prism({ wall: brick, win: null, roof: null, ring: MAIN, z0: 0, z1: CORNICE, facade: null, bevel: 0.4 })
prism({ wall: brick, win: null, roof: grey, ring: [[X0 + 1.2, Y0 + 0.6], [X1 - 1.2, Y0 + 0.6], [X1 - 1.2, -15], [X0 + 1.2, -15]], z0: CORNICE, z1: 25.5, facade: null, bevel: 0.4 })
prism({ wall: brick, win: null, roof: grey, ring: [[4, -30], [20, -30], [20, -8], [4, -8]], z0: 25, z1: 29, facade: null, bevel: 0.4 })
prism({ wall: grey, win: null, roof: grey, ring: [[-12, -15], [20, -15], [20, 24], [-12, 24]], z0: 20.5, z1: 23.8, facade: null, bevel: 0.4 })
capPoly(grey, [[X0 + 0.5, -15], [X1 - 0.5, -15], [X1 - 0.5, Y1 - 0.5], [X0 + 0.5, Y1 - 0.5]], 20.5)

// ---------------------------------------------------------------------------
// All four sides: terracotta belt over the base, frieze, cornice, and the
// polychrome parapet with acroteria.
// ---------------------------------------------------------------------------
MAIN.forEach((a, i) => {
  const b = MAIN[(i + 1) % 4]
  const { L, at } = along(a, b)
  // Belt course over the rusticated base, and a granite plinth.
  block(trim, at, -0.25, L, BASE, BELT, 0.25)
  rect(trim, at, 0.4, L - 0.4, FRIEZE, CORNICE, 0.04)
  // Cornice: projecting box with its soffit; it runs on past the start
  // corner so the corners close.
  const o = OVER
  rect(grey, at, -o, L, CORNICE, CORNICE_TOP, o)
  grey.quad(at(-o, CORNICE, 0), at(L, CORNICE, 0), at(L, CORNICE, o), at(-o, CORNICE, o))
  grey.quad(at(-o, CORNICE_TOP, o), at(L, CORNICE_TOP, o), at(L, CORNICE_TOP, 0), at(-o, CORNICE_TOP, 0))
  grey.quad(at(-o, CORNICE, o), at(-o, CORNICE, 0), at(-o, CORNICE_TOP, 0), at(-o, CORNICE_TOP, o))
  // Parapet: cream piers and rails at the wall line, red panels between.
  rect(trim, at, 0, L, CORNICE_TOP, PARAPET, 0)
  rect(trim, at, L, 0, CORNICE_TOP, PARAPET, -0.4) // inner face, looking in
  trim.quad(at(0, PARAPET, 0), at(L, PARAPET, 0), at(L, PARAPET, -0.4), at(0, PARAPET, -0.4))
  const np = Math.round(L / 2.5), pp = L / np
  for (let k = 0; k < np; k++) rect(red, at, k * pp + 0.2, (k + 1) * pp - 0.2, CORNICE_TOP + 0.3, PARAPET - 0.35, 0.05)
  // Acroteria: one at the start corner, then every fourth pier or so.
  const na = Math.max(2, Math.round(L / 9.5)), pa = L / na
  for (let k = 0; k < na; k++) {
    const c = k === 0 ? 0.6 : k * pa, w = k === 0 ? 1.2 : 0.9
    // A box from 0.4 m inside the parapet face to 0.3 m proud of it.
    const sh = (s: number, z: number, d = 0) => at(s, z, d - 0.4)
    block(trim, sh, c - w / 2, c + w / 2, PARAPET, PARAPET + 1.2, 0.7)
    trim.quad(sh(c + w / 2, PARAPET), sh(c - w / 2, PARAPET), sh(c - w / 2, PARAPET + 1.2), sh(c + w / 2, PARAPET + 1.2))
  }
})

// ---------------------------------------------------------------------------
// Lafayette Avenue front (north, edge 2, running west from the north-east
// corner): five arched windows over five doors, and the glass canopy.
// ---------------------------------------------------------------------------
{
  const { L, at } = along(MAIN[2], MAIN[3])
  // Glass 4.6 m wide (the pier between two lights is about as wide), sill
  // just over the belt at 7.5 m, crown 16.1 m; the terracotta surround runs
  // from the belt up to the frieze, 0.9 m wide, so each window reads as one
  // tall arched element filling the wall between base and frieze.
  const W = 4.6, SILL = 7.5, SPRING = 16.1 - W / 2, SW = 0.9
  for (let k = -2; k <= 2; k++) {
    // Centred, with broad blank piers at both ends (both corner photos
    // show the blank pier at the end nearest the camera).
    const c = L / 2 + k * 7.4
    rect(trim, at, c - W / 2 - SW, c + W / 2 + SW, BELT, SPRING, 0.08)
    arched(trim, at, c, W + 2 * SW, SPRING - 0.01, SPRING, 0.08)
    arched(win, at, c, W, SILL, SPRING, 0.14)
    rect(trim, at, c - 0.1, c + 0.1, SILL, SPRING, 0.18) // mullion
    rect(trim, at, c - W / 2, c + W / 2, SILL + 1.6, SILL + 1.8, 0.18) // transom over the bottom lights
    rect(trim, at, c - 1.7, c + 1.7, 0.3, 5.0, 0.06) // door surround
    rect(door, at, c - 1.1, c + 1.1, 0.3, 4.3, 0.1)
  }
  // The canopy: a glass slab on the five doors, sloping slightly outward.
  const s0 = L / 2 - 2 * 7.4 - 3.5, s1 = L - 0.8, zb = 5.3, D = 4.2
  grey.quad(at(s0, zb, D), at(s1, zb, D), at(s1, zb + 0.4, 0.1), at(s0, zb + 0.4, 0.1))
  grey.quad(at(s0, zb + 0.25, 0.1), at(s1, zb + 0.25, 0.1), at(s1, zb - 0.15, D), at(s0, zb - 0.15, D))
  rect(grey, at, s0, s1, zb - 0.15, zb, D)
}

// ---------------------------------------------------------------------------
// Side aedicules near the front corners (east edge 1, west edge 3), with a
// door under each.
// ---------------------------------------------------------------------------
for (const [i, sc] of [[1, -7.5], [3, 7.5]] as [number, number][]) {
  const { L, at } = along(MAIN[i], MAIN[(i + 1) % 4])
  const c = sc < 0 ? L + sc : sc
  arched(trim, at, c, 6.0, BELT, 13.8, 0.1)
  rect(win, at, c - 1.0, c + 1.0, 8.2, 12.6, 0.16)
  arched(win, at, c, 1.5, 14.2, 14.7, 0.16)
  for (const dx of [-2.2, 2.2]) block(trim, at, c + dx - 0.45, c + dx + 0.45, BELT, 13.0, 0.8)
  block(trim, at, c - 3.0, c + 3.0, 13.0, 13.8, 0.95)
  // The street along the east side is ~1.3 m higher there (lidar).
  const g = i === 1 ? 1.3 : 0.3
  rect(trim, at, c - 1.6, c + 1.6, g, g + 4.7, 0.06)
  rect(door, at, c - 1.0, c + 1.0, g, g + 4.0, 0.1)
}

finishModel('BAM Peter Jay Sharp Building', 'nyc-bam', [
  { part: brick, material: finish('bam-buff-brick', 0xdcd8cb) },
  { part: trim, material: finish('bam-terracotta', 0xdcc79c) },
  { part: grey, material: finish('bam-cornice', 0x8d978f) },
  { part: red, material: finish('bam-parapet-red', 0xc4704f) },
  { part: win, material: { name: 'window', color: 0x56665f, roughness: 0.35 } },
  { part: door, material: PALETTE.entrance },
], { bearing: 351.4, osm: 'way/250979163', height: 29 })
