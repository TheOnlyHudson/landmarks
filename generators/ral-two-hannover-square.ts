/**
 * Two Hannover Square, Raleigh (1991; formerly the BB&T Building) —
 * original procedural geometry, CC0-1.0.
 * bun generators/ral-two-hannover-square.ts [out.glb]
 *
 * Uses the kit in ral-wells-fargo-capitol-center.ts.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/297829070, 35.774400,
 * -78.640037. Bearing 2 (the downtown grid, from the outline's edges).
 *
 * Identity (photos below): Raleigh's second-tallest tower, a square shaft
 * of warm taupe-pink granite with punched windows, whose four corners are
 * cut back in a staircase of setbacks, deeper at each step, so every face
 * narrows towards the top in steps; the top closes as a stepped pyramid of
 * shrinking tiers to a square lantern of pale green-grey fins and a short
 * pointed cap. At night the lantern and the
 * stepped corner notches are lit green (two night photos), drawn as a
 * `neon` lantern and `_FLOODLIGHT` on the notch faces.
 *
 * Evidence:
 *  - plan: the tower from OSM way/297829070 (turned 2°): 42.7 × 43.6 m,
 *    squared up; the two-storey annex north of it from OSM part
 *    way/310324653. The setback steps, 2.4 m each (about one window bay),
 *    five of them: estimated from Jmturner's and Scott Thompson's photos
 *    (the top tier's faces are about 0.4 of the base's) and the NAIP roof.
 *  - heights: 131.4 m published (OSM height 131.369; Wikipedia 432 ft),
 *    29 floors. Corner setbacks at 12, 40, 62, 80 and 94 m; then the
 *    crown closes as a ziggurat: whole-plan tiers set in 4, 8, 11.5 and
 *    14.5 m from every face, topping out at 100, 108, 114, 119 and 123 m;
 *    the finned lantern 123–128.6 m and a pointed cap to 131.4 m. All
 *    estimated by counting storeys (~4.05 m) and comparing tier widths in
 *    Jmturner's, Sam Shaber's and Scott Thompson's photos. Annex 9 m (2
 *    levels, OSM). No lidar covers Raleigh.
 *  - colours: granite #a8907f-ish in sun, pulled to the palette's
 *    lightness; windows the palette's slate; lantern pale green-grey.
 *  - y = 0 is the plaza and street; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - B-B-and-T-Building-20080321.jpeg, Jmturner, public domain
 *    https://commons.wikimedia.org/wiki/File:B-B-and-T-Building-20080321.jpeg
 *    (from the plaza, two faces: setbacks, lantern, colour)
 *  - Pyramiding - panoramio.jpg, Scott Thompson, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Pyramiding_-_panoramio.jpg
 *    (one face square on at night: the stepped profile)
 *  - BB^T Building - panoramio.jpg, Sam Shaber, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:BB%5ET_Building_-_panoramio.jpg
 *    (daylight, the stepped corners and lantern colour)
 *  - Two Hannover Square, night.jpg, jill, jellidonut... whatever, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Two_Hannover_Square,_night.jpg
 *    (night: green-lit notches and lantern)
 *  - Green bankalishi - panoramio.jpg, Scott Thompson, CC BY 3.0
 *    https://commons.wikimedia.org/wiki/File:Green_bankalishi_-_panoramio.jpg
 *    (night, close: green floodlighting in the notches)
 * USGS NAIP for the plan and roof. No look-only sources. No commercial
 * imagery.
 *
 * Doubts: the corners' setbacks are not all at the same storeys in the
 * photos (the tower may step a little differently at each corner); they
 * are drawn symmetric. The colonnade at the plaza and the dark spandrel
 * bands between storeys are left out. The lantern's fin count is
 * estimated.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, grid, punched, coping, rect, ringFaces, cap, plate, write } from './ral-wells-fargo-capitol-center'
import { pyramid } from './atl-one-atlantic-center'

const granite = new Part(), glass = new Part(), roof = new Part(), lantern = new Part()

const C: XY = [-1.65, -4.7] // shaft centre
const A = 21.35, B = 21.9 // half-widths
const STEP = 2.4
const LEVELS = [12, 40, 62, 80, 94] // where corner setback k (1..5) begins
// The crown: whole-plan tiers, each set in from every face by INSET[k],
// rising in shorter steps to the lantern; a ziggurat.
const INSET = [4, 8, 11.5, 14.5]
const TIER = [100, 108, 114, 119, 123] // tops: the outer ring, then each tier
const LANT = 128.6, TOP = 131.4
const FLOOR = 4.05, G0 = 6

// cell edges: the corner steps and the tier insets from each side
const ins = [...[0, 1, 2, 3, 4, 5].map((k) => k * STEP), ...INSET].sort((a, b) => a - b).filter((v, i, a) => i === 0 || v - a[i - 1] > 1e-6)
const xe = [...ins.map((d) => C[0] - A + d), ...ins.slice().reverse().map((d) => C[0] + A - d)]
const ye = [...ins.map((d) => C[1] - B + d), ...ins.slice().reverse().map((d) => C[1] + B - d)]
const height = (x: number, y: number) => {
  const ex = A - Math.abs(x - C[0]), ey = B - Math.abs(y - C[1])
  const m = Math.max(ex, ey) // depth into the plan from the corner
  let notch = Infinity
  for (let k = 1; k <= 5; k++) if (m < k * STEP) { notch = LEVELS[k - 1]; break }
  const e = Math.min(ex, ey) // inset from the nearest face
  let tier = TIER[TIER.length - 1]
  for (let k = 0; k < INSET.length; k++) if (e < INSET[k]) { tier = TIER[k]; break }
  return Math.min(notch, tier)
}

const facade = { bay: 3.2, pier: 1.5, group: 2 * FLOOR, spandrel: 2.6, origin: G0 }
grid(xe, ye, height, roof, (f: Face) => {
  // the 2.4 m staircase strips each carry one window column
  punched(granite, glass, f, f.len < 3 ? { ...facade, pier: 0.9 } : facade)
  coping(granite, f, 0.8, 0.18)
})

// The lantern: a square box of pale green-grey fins on the top tier, and a
// short pointed cap to 131.4 m. Bold, so it holds at phone size.
{
  const L = 4.8
  const inner = rect(C[0] - L, C[1] - L, C[0] + L, C[1] + L)
  const z0 = TIER[TIER.length - 1]
  for (const f of ringFaces(inner, z0, LANT)) {
    // the screen behind the fins, then the fins
    plate(lantern, f, 0, f.len, f.z0, f.z1, 0, 0)
    const n = 5
    for (let k = 0; k <= n; k++) {
      const s = 0.35 + (f.len - 0.7) * k / n
      plate(lantern, f, s - 0.35, s + 0.35, f.z0, f.z1, 0.8, 0.8)
    }
  }
  const eave = rect(C[0] - L - 0.8, C[1] - L - 0.8, C[0] + L + 0.8, C[1] + L + 0.8)
  pyramid(lantern, eave, LANT, [C[0], C[1], TOP])
  cap(lantern, eave, LANT, false)
}

// The annex: two storeys north of the tower (OSM part way/310324653).
{
  const ring: XY[] = [[1.6, 17.2], [15.7, 17.0], [15.9, 40.0], [3.7, 40.0], [3.6, 34.7], [1.8, 34.8]]
  for (const f of ringFaces(ring, 0, 9)) {
    punched(granite, glass, f, { bay: 3.6, pier: 1.2, group: 9, spandrel: 2.4, origin: 0 })
    coping(granite, f, 0.6, 0.15)
  }
  cap(roof, ring, 9)
}

// Green floodlighting falls in the stepped corner notches.
const inNotch = (p: V3, n: V3) =>
  p[2] > 12 && Math.abs(n[2]) < 0.5 && p[2] < TIER[0] && A - Math.abs(p[0] - C[0]) < 5 * STEP + 0.1 && B - Math.abs(p[1] - C[1]) < 5 * STEP + 0.1 ? 0.85 : 0

await write('ral-two-hannover-square', 'Two Hannover Square', [
  { part: granite, material: { ...finish('th-granite', 0xcfb4a4), floodlight: inNotch } },
  { part: glass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: lantern, material: finish('neon-th-lantern', 0xb5cfc1, 0.6) },
], { bearing: 2, elevation: 0, height: TOP, replaces: ['way/297829070', 'way/310324653'] })
