/**
 * Story Bridge, Brisbane (1940; J. J. C. Bradfield, Evans Deakin–Hornibrook)
 * — procedural, CC0-1.0, no textures.
 * bun generators/brisbane-story-bridge.ts
 *
 * One model for the steel cantilever bridge inside its OSM `man_made=bridge`
 * outline (way/507264554, 445 m): the two through trusses over the south
 * anchor arm, the two cantilever arms and the suspended span of the main
 * span, and the north anchor arm, with the "diamond" towers over the main
 * piers where the trusses reach 74 m and their lower chords dip to the
 * bearings; the three concrete piers (two main, the south anchor pier) and
 * the north abutment on the Fortitude Valley cliff; the footways on both
 * outer edges. The roadways (Bradfield Highway, three lanes each way) are
 * the map's: nothing here draws a road surface.
 *
 * Frame: x across the bridge (east +), y along it (north +), z up, metres;
 * origin on the water at the outline's centre (the main span's middle).
 * Placed at bearing 358.67°, the outline's long axis.
 *
 * Two levels of detail from one description:
 * - low (≤ 6,500 triangles): every panel's chords, verticals and one
 *   diagonal as solid members, the tower panels' crossed diagonals and the
 *   diamond under them, top struts, deck and footway bands, the piers, and
 *   the lights along the top chords;
 * - detail (≤ 40,000): the same plus counter-diagonals, top lateral X-bracing,
 *   portal and sway struts, floor beams, footway railings on posts, and the
 *   lights at their full spacing along the top chords and the deck edges.
 *
 * Sources:
 * - OSM (© OpenStreetMap contributors, ODbL): way/507264554 (the outline,
 *   445 m by 27 m, tagged bridge=cantilever); the two carriageways
 *   way/575920451 and way/1154158840 (three lanes each, layer 2, no height
 *   or `ele`).
 * - Published (Queensland Heritage Register 600240; Wikipedia "Story
 *   Bridge"; Structurae): two anchor spans of 82.1 m, a main span of
 *   281.7 m made of two 93.9 m cantilever arms carrying a 93.9 m suspended
 *   span; the trusses 47.34 m high over the main piers; 74 m high above the
 *   river; 24 m wide; clearance 30.4 m at mid-span; north end anchored into
 *   the schist cliff (no anchor pier), the south end on an anchor pier.
 * - Photos (Wikimedia Commons; EVIDENCE):
 *   "Story Bridge Panorama" (Cyron Ray Macey, CC BY 2.0; side-on from the
 *   east: the profile, measured below);
 *   "Brisbane Story Bridge (IMG05653)" (Andrew Mercer, CC BY-SA 4.0; the
 *   tower over the north main pier, posts, diagonals, lateral bracing, the
 *   arched pier);
 *   "Storey Bridge and Brisbane CBD May 2013" (Lachlan Fearnley, CC BY-SA
 *   3.0; night side view: lights along the top chords and deck, piers);
 *   "Story Bridge at night, Brisbane 05" (Kgbo, CC BY-SA 4.0; the coloured
 *   LED lights);
 *   "Story Bridge Cropped - Flickr - Fishyone1" (Andrew Sutherland, CC BY-SA
 *   2.0; the truss and its light strings close up);
 *   "Story Bridge from Goodwill Bridge Brisbane P1180671" (John Robert
 *   McPherson, CC BY-SA 4.0; the tower's colour in flat light).
 * - Measured on the panorama (scale 0.41 m/px from the main span): truss
 *   depth about 13.5 m over the suspended span and 11 m at the anchor ends;
 *   the top chord's concave sweep from the tower down to the cantilever
 *   tips; the main piers about 18 m along the bridge with a 6 m arched
 *   opening; the anchor pier as two legs about 12 m apart.
 * - Estimated: the roadway profile (33.5 m above the river at mid-span,
 *   from the published clearance plus a 3.1 m deck, falling on a parabola
 *   to 32.0 at the main piers and 29.8 at the ends, where the north end
 *   meets the cliff); the bearings 26.7 m up (74 m less the published
 *   47.34 m truss depth); the trusses 20.8 m apart; the panel lengths (10
 *   in the suspended span, 9 in each cantilever arm, 8 in each anchor arm,
 *   plus the tower panel over each main pier); member sizes, drawn heavy so
 *   they read.
 * - Colour: the steel is a blue-grey (#6a7fa3 sunlit on the panorama,
 *   #55687d in haze on the Goodwill Bridge photo), drawn #74839a; the piers
 *   pale concrete (#d2cac5, #cdc0ba), drawn #d0c8bf.
 * - Ground: Mapterhorn z12 (the only zoom here) every 20 m in this frame,
 *   less its water reading, in GROUND; piers and the abutment stand on it
 *   vertex by vertex.
 *
 * Night: the lights strung along both top chords and both deck edges
 * (`lamp`; the real LEDs change colour, warm white by default) and the
 * floodlit piers; the steel is washed faintly from below.
 *
 * Doubts: the roadway heights are estimated (no `ele` on the OSM ways; the
 * map guesses the deck from the ground and water, so it may not meet the
 * trusses until the carriageways carry `ele` tags, see
 * docs/bridge-heights.md); the panel counts and the exact diagonal pattern
 * (drawn as one diagonal a panel sloping down away from each pier) are read
 * from photos at a distance; the piers' plan is from photos only (OSM maps
 * none).
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { footedLoft, groundAt, chamferedRect, bead, type GroundGrid } from './bridge-kit'
import { quadOut, hexa } from './nyc-george-washington-bridge'

// ---- Small vector helpers, members (shared with auckland-harbour-bridge.ts) ---------

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const nrm = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]]

function tubeQuads(p: Part, sa: V3[], sb: V3[], na: V3[], nb: V3[]) {
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    p.tri(sa[k], sa[j], sb[j], undefined, undefined, undefined, [na[k], na[j], nb[j]])
    p.tri(sa[k], sb[j], sb[k], undefined, undefined, undefined, [na[k], nb[j], nb[k]])
  }
}

/**
 * A straight member from a to b, w wide along `across` and t deep square to
 * it: four smooth-shaded sides, open at the ends (which butt into joints),
 * or three sides (`tri`) for a low model's thinnest members.
 */
export function member(p: Part, a: V3, b: V3, w: number, t: number, across: V3 = [1, 0, 0], caps = false, tri = false) {
  const d = nrm(sub(b, a))
  let A = sub(across, mul(d, dot(across, d)))
  if (Math.hypot(...A) < 1e-6) A = crs(d, [0, 0, 1])
  A = nrm(A)
  const B = crs(d, A)
  if (tri) {
    const ang = [90, 210, 330].map((g) => (g * Math.PI) / 180)
    const ns = ang.map((g) => nrm(add(mul(A, Math.cos(g)), mul(B, Math.sin(g)))))
    const sec = (o: V3) => ang.map((g) => add(o, add(mul(A, (Math.cos(g) * w) / 1.5), mul(B, (Math.sin(g) * t) / 1.5))))
    const sa = sec(a), sb = sec(b)
    for (let k = 0; k < 3; k++) {
      const j = (k + 1) % 3
      p.tri(sa[k], sa[j], sb[j], undefined, undefined, undefined, [ns[k], ns[j], ns[j]])
      p.tri(sa[k], sb[j], sb[k], undefined, undefined, undefined, [ns[k], ns[j], ns[k]])
    }
    return
  }
  const ns = CORNERS.map(([u, v]) => nrm(add(mul(A, u), mul(B, v))))
  const sec = (o: V3) => CORNERS.map(([u, v]) => add(o, add(mul(A, (u * w) / 2), mul(B, (v * t) / 2))))
  const sa = sec(a), sb = sec(b)
  tubeQuads(p, sa, sb, ns, ns)
  if (caps) { const m = mul(add(a, b), 0.5); quadOut(p, sa, m); quadOut(p, sb, m) }
}

/** A chord swept through points in a plane x = const: w across x, t deep, sections square to the averaged tangent, ends capped. */
export function chord(p: Part, pts: V3[], w: number, t: number) {
  const secs = pts.map((o, i) => {
    const d = nrm(sub(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)]))
    const A: V3 = [1, 0, 0], B = nrm(crs(d, A))
    return {
      pts: CORNERS.map(([u, v]) => add(o, add(mul(A, (u * w) / 2), mul(B, (v * t) / 2)))),
      ns: CORNERS.map(([u, v]) => nrm(add(mul(A, u), mul(B, v)))),
    }
  })
  for (let i = 0; i < pts.length - 1; i++) tubeQuads(p, secs[i].pts, secs[i + 1].pts, secs[i].ns, secs[i + 1].ns)
  quadOut(p, secs[0].pts, pts[1]); quadOut(p, secs[secs.length - 1].pts, pts[pts.length - 2])
}

// ---- Ground --------------------------------------------------------------------------

// Mapterhorn z12, metres above the river, every 20 m: rows along y from -240
// (south) to 240 (north), columns across x from -60 to 60.
const GROUND: GroundGrid = { y0: -240, x0: -60, step: 20, z: [
  [5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5],
  [5.5, 5.6, 6.0, 6.0, 6.0, 5.5, 5.5],
  [5.0, 5.6, 6.0, 6.0, 6.0, 5.5, 5.5],
  [5.0, 5.6, 6.0, 6.0, 6.0, 5.5, 5.1],
  [5.0, 5.3, 5.8, 6.0, 5.8, 5.2, 3.7],
  [4.6, 4.7, 5.1, 5.2, 4.8, 3.4, 1.6],
  [3.1, 3.5, 3.4, 2.7, 2.1, 1.1, 0.5],
  [0.9, 1.3, 1.3, 1.2, 0.9, 0.6, 0.4],
  [0.3, 0.5, 0.6, 0.7, 0.5, 0.3, 0.0],
  [0.0, 0.3, 0.5, 0.5, 0.3, 0.0, 0.0],
  [0.0, 0.0, 0.1, 0.1, 0.0, 0.0, 0.0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0.3, 0.3, 0, 0, 0, 0, 0],
  [0.5, 0.5, 0.4, 0.3, 0, 0, 0],
  [1.0, 1.0, 1.0, 0.5, 0.5, 0.3, 0.1],
  [1.8, 1.8, 1.7, 1.3, 1.1, 0.7, 0.7],
  [3.4, 3.2, 2.9, 2.7, 2.5, 2.0, 2.1],
  [4.2, 3.8, 3.5, 3.5, 3.5, 3.3, 3.6],
  [4.6, 3.7, 3.5, 3.9, 4.6, 11.6, 19.0],
  [11.9, 11.9, 13.7, 14.1, 16.4, 28.2, 32.7],
  [23.4, 24.6, 27.0, 28.8, 29.8, 32.2, 33.3],
  [26.5, 28.9, 30.9, 32.0, 32.3, 33.0, 33.3],
] }
const ground = (x: number, y: number) => groundAt(GROUND, x, y)

// ---- Profile -------------------------------------------------------------------------

const PIER = 141.0, TOWER = 4.6, TIP = 47.0, END = 223.0
const TX = 10.4                                  // truss planes, |x|
const road = (y: number) => 33.5 - 0.000075 * y * y
const bc = (y: number) => road(y) - 1.4          // bottom chord centre
const BEARING_Z = 26.7, TOP = 74.0
const T_TIP = bc(TIP) + 12.5, T_END = bc(END) + 11.0

/** The top chord's centre height at y. */
function tc(y: number): number {
  const a = Math.abs(y), s = Math.sign(y) || 1
  void s
  if (a <= TIP) return bc(y) + 12.5 + 0.8 * (1 - (a / TIP) ** 2) - 0.8 * 0
  if (a <= PIER - TOWER) return T_TIP + (TOP - T_TIP) * ((a - TIP) / (PIER - TOWER - TIP)) ** 1.5
  if (a <= PIER + TOWER) return TOP
  return T_END + (TOP - T_END) * ((END - a) / (END - PIER - TOWER)) ** 1.5
}

/** Panel points along the bridge, south to north. */
function stations(): number[] {
  const half: number[] = []
  for (let i = 0; i <= 5; i++) half.push((TIP * i) / 5)                     // suspended span (10 panels)
  for (let i = 1; i <= 9; i++) half.push(TIP + ((PIER - TOWER - TIP) * i) / 9) // cantilever arm
  half.push(PIER + TOWER)                                                    // across the tower
  for (let i = 1; i <= 8; i++) half.push(PIER + TOWER + ((END - PIER - TOWER) * i) / 8) // anchor arm
  return [...half.slice(1).map((y) => -y).reverse(), ...half]
}
const YS = stations()
const isTower = (a: number) => Math.abs(Math.abs(a) - PIER) < TOWER + 0.1

type Kit = { steel: Part; pier: Part; deck: Part; lamp: Part; d: boolean }

// ---- Trusses -------------------------------------------------------------------------

function trusses(k: Kit) {
  const d = k.d
  for (const x of [-TX, TX]) {
    const top = YS.map((y) => [x, y, tc(y)] as V3)
    chord(k.steel, top, 1.5, 1.7)
    chord(k.steel, YS.map((y) => [x, y, bc(y)] as V3), 1.5, 1.8)
    for (let i = 0; i < YS.length; i++) {
      const y = YS[i]
      const post = isTower(y)
      const end = Math.abs(Math.abs(y) - END) < 0.1
      member(k.steel, [x, y, bc(y) + 0.9], [x, y, tc(y) - 0.85], post || end ? 2.0 : 1.0, post || end ? 2.0 : 1.1, [1, 0, 0])
    }
    // Diagonals: one a panel, from the top at its pier-side end down to the
    // bottom at its far end; in the suspended span they lean towards the
    // middle. The tower panels get a full X.
    for (let i = 0; i < YS.length - 1; i++) {
      const ya = YS[i], yb = YS[i + 1], ym = (ya + yb) / 2
      if (isTower(ya) && isTower(yb)) {
        for (const [p0, p1] of [[ya, yb], [yb, ya]]) member(k.steel, [x, p0, tc(p0) - 1], [x, p1, bc(p1) + 1], 1.3, 1.3, [1, 0, 0])
        continue
      }
      const a = Math.abs(ym)
      let hi: number, lo: number
      if (a < TIP) [hi, lo] = Math.abs(ya) > Math.abs(yb) ? [ya, yb] : [yb, ya]       // towards the middle
      else if (a < PIER) [hi, lo] = Math.abs(ya) > Math.abs(yb) ? [ya, yb] : [yb, ya] // away from the pier, to the tip
      else [hi, lo] = Math.abs(ya) < Math.abs(yb) ? [ya, yb] : [yb, ya]              // away from the pier, to the end
      member(k.steel, [x, hi, tc(hi) - 0.8], [x, lo, bc(lo) + 0.9], 0.9, 0.9, [1, 0, 0], false, !d)
      if (d) member(k.steel, [x, lo, tc(lo) - 0.8], [x, hi, bc(hi) + 0.9], 0.55, 0.55, [1, 0, 0])
      if (d && tc(ym) - bc(ym) > 20) {
        // A half-height strut in the deep panels (sub-panelling).
        const zm = (tc(ym) + bc(ym)) / 2
        member(k.steel, [x, ym, bc(ym) + 0.9], [x, ym, zm], 0.55, 0.55, [1, 0, 0])
      }
    }
    // The diamond under each tower: from the posts' feet down to the bearing on the pier.
    for (const s of [-1, 1]) {
      const yp = s * PIER, B: V3 = [x, yp, BEARING_Z]
      for (const dy of [-TOWER, TOWER]) member(k.steel, [x, yp + dy, bc(yp + dy)], B, 1.8, 1.8, [1, 0, 0])
      member(k.steel, [x, yp, bc(yp)], B, 1.4, 1.4, [1, 0, 0])
      // The bearing shoe.
      hexa(k.steel, [[x - 1.6, yp - 1.6, BEARING_Z - 1.2], [x + 1.6, yp - 1.6, BEARING_Z - 1.2], [x + 1.6, yp + 1.6, BEARING_Z - 1.2], [x - 1.6, yp + 1.6, BEARING_Z - 1.2]],
        [[x - 0.9, yp - 0.9, BEARING_Z + 0.3], [x + 0.9, yp - 0.9, BEARING_Z + 0.3], [x + 0.9, yp + 0.9, BEARING_Z + 0.3], [x - 0.9, yp + 0.9, BEARING_Z + 0.3]])
    }
  }
  // Bracing between the trusses: a strut at every top panel point; in the
  // detail, top lateral X-bracing, sway struts and the tower's cross frames.
  const IN = TX - 0.8
  for (let i = 0; i < YS.length; i++) {
    const y = YS[i]
    if (!d && i % 2 === 1 && !isTower(y)) continue
    member(k.steel, [-IN, y, tc(y) - 0.3], [IN, y, tc(y) - 0.3], 0.9, 1.1, [0, 1, 0])
    if (d && tc(y) - road(y) > 14) member(k.steel, [-IN, y, road(y) + 9.5], [IN, y, road(y) + 9.5], 0.7, 0.9, [0, 1, 0])
    if (d && tc(y) - road(y) > 22) {
      // Sway frame: an X between the top strut and the portal strut.
      member(k.steel, [-IN, y, tc(y) - 1], [IN, y, road(y) + 10], 0.5, 0.5, [0, 1, 0])
      member(k.steel, [IN, y, tc(y) - 1], [-IN, y, road(y) + 10], 0.5, 0.5, [0, 1, 0])
    }
  }
  if (d) for (let i = 0; i < YS.length - 1; i++) {
    const ya = YS[i], yb = YS[i + 1]
    member(k.steel, [-IN, ya, tc(ya) - 0.3], [IN, yb, tc(yb) - 0.3], 0.5, 0.5, [0, 0, 1])
    member(k.steel, [IN, ya, tc(ya) - 0.3], [-IN, yb, tc(yb) - 0.3], 0.5, 0.5, [0, 0, 1])
  }
  // Tower cross frames between the posts, above the traffic.
  for (const s of [-1, 1]) for (const dy of [-TOWER, TOWER]) {
    const y = s * PIER + dy
    for (const z of d ? [48, 60] : [56]) member(k.steel, [-IN, y, z], [IN, y, z], 1.0, 1.2, [0, 1, 0])
    if (d) {
      member(k.steel, [-IN, y, 46], [IN, y, 72], 0.6, 0.6, [0, 1, 0])
      member(k.steel, [IN, y, 46], [-IN, y, 72], 0.6, 0.6, [0, 1, 0])
    }
  }
}

// ---- Deck and footways -------------------------------------------------------------------

const FOOT0 = 11.0, FOOT1 = 13.3 // footways outside the trusses, |x|

function deck(k: Kit) {
  const d = k.d
  const ys = d ? YS : YS.filter((_, i) => i % 2 === 0 || i === YS.length - 1)
  for (let i = 0; i < ys.length - 1; i++) {
    const ya = ys[i], yb = ys[i + 1]
    const za = road(ya) - 2.6, zb = road(yb) - 2.6
    // The floor's underside between the trusses, facing down.
    quadOut(k.steel, [[-TX, ya, za], [-TX, yb, zb], [TX, yb, zb], [TX, ya, za]], [0, ya, za + 5])
    for (const s of [-1, 1]) {
      // Footway: its walking surface, its outer fascia and its underside.
      const x0 = s * FOOT0, x1 = s * FOOT1
      const ta = road(ya) + 0.2, tb = road(yb) + 0.2
      quadOut(k.deck, [[x0, ya, ta], [x1, ya, ta], [x1, yb, tb], [x0, yb, tb]], [s * 12, ya, ta - 5])
      quadOut(k.steel, [[x1, ya, ta + (d ? 0.1 : 1.1)], [x1, yb, tb + (d ? 0.1 : 1.1)], [x1, yb, ta - 1.6 + (tb - ta)], [x1, ya, ta - 1.6]], [0, ya, ta])
      quadOut(k.steel, [[x0, ya, ta - 1.6], [x1, ya, ta - 1.6], [x1, yb, tb - 1.6], [x0, yb, tb - 1.6]], [s * 12, ya, ta + 5])
      if (!d) {
        // The railing as a band on the low model, its inner face too.
        quadOut(k.steel, [[x1 - 0.15, ya, ta + 1.1], [x1 - 0.15, yb, tb + 1.1], [x1 - 0.15, yb, tb], [x1 - 0.15, ya, ta]], [s * 20, ya, ta])
        quadOut(k.steel, [[x1 - 0.15, ya, ta + 1.1], [x1, ya, ta + 1.1], [x1, yb, tb + 1.1], [x1 - 0.15, yb, tb + 1.1]], [s * 12, ya, ta])
        continue
      }
      // Railing: top and mid rails on posts.
      for (const zr of [1.25, 0.65]) member(k.steel, [x1 - 0.1, ya, ta + zr], [x1 - 0.1, yb, tb + zr], 0.1, 0.1, [0, 0, 1])
      const n = Math.max(1, Math.round((yb - ya) / 3))
      for (let j = 0; j < n; j++) {
        const y = ya + ((yb - ya) * j) / n, t = road(y) + 0.2
        member(k.steel, [x1 - 0.1, y, t], [x1 - 0.1, y, t + 1.3], 0.1, 0.1)
      }
      // Footway brackets off the bottom chord at each panel point.
      member(k.steel, [s * (TX + 0.6), ya, bc(ya) - 0.6], [s * (FOOT1 - 0.3), ya, road(ya) - 0.3], 0.4, 0.5, [0, 1, 0])
    }
    if (d) {
      // Floor beams across, under the roadway, and two stringers.
      member(k.steel, [-TX, ya, road(ya) - 1.9], [TX, ya, road(ya) - 1.9], 0.6, 1.2, [0, 1, 0])
      for (const x of [-4, 4]) member(k.steel, [x, ya, road(ya) - 2.0], [x, yb, road(yb) - 2.0], 0.5, 1.0, [1, 0, 0])
    }
  }
}

// ---- Piers and abutment ------------------------------------------------------------------

/**
 * A concrete pier on the ground: plan x ±hx, y from y0 to y1, up to `top`,
 * pierced across (along x) by a round-headed opening `ow` wide springing
 * `os` above the lowest ground, as two legs and the mass over the arch.
 */
function pier(k: Kit, y0: number, y1: number, hx: number, top: number, ow: number, os: number) {
  const ym = (y0 + y1) / 2, r = ow / 2
  void ym
  let gMin = Infinity
  for (const x of [-hx, 0, hx]) for (const y of [y0, ym, y1]) gMin = Math.min(gMin, ground(x, y))
  const spring = gMin + os
  const c = k.d ? 0.35 : 0
  // Legs, either side of the opening, which runs along the bridge under its axis.
  for (const [a, b] of [[-hx, -r], [r, hx]]) {
    footedLoft(k.pier, ground, [
      { plan: chamferedRect(a - 0.6, b + 0.6, y0 - 0.6, y1 + 0.6, c), z: 'ground' },
      { plan: chamferedRect(a - 0.6, b + 0.6, y0 - 0.6, y1 + 0.6, c), z: gMin + 2.0 },
      { plan: chamferedRect(a, b, y0, y1, c), z: gMin + 2.6 },
      { plan: chamferedRect(a, b, y0, y1, c), z: spring },
    ], k.d ? 3 : 40, false)
  }
  // The mass over the opening, with a semicircular soffit.
  const seg = k.d ? 10 : 6
  for (let i = 0; i < seg; i++) {
    const t0 = Math.PI - (Math.PI * i) / seg, t1 = Math.PI - (Math.PI * (i + 1)) / seg
    const pa = [r * Math.cos(t0), spring + r * Math.sin(t0)], pb = [r * Math.cos(t1), spring + r * Math.sin(t1)]
    const q = (y: number): V3[] => [[pa[0], y, pa[1]], [pb[0], y, pb[1]], [pb[0], y, spring + r + 0.01], [pa[0], y, spring + r + 0.01]]
    hexa(k.pier, q(y0), q(y1), { skip: [2] })
  }
  hexa(k.pier, [[-hx, y0, spring + r], [hx, y0, spring + r], [hx, y1, spring + r], [-hx, y1, spring + r]],
    [[-hx, y0, top - 1.2], [hx, y0, top - 1.2], [hx, y1, top - 1.2], [-hx, y1, top - 1.2]], { capA: false, capB: false })
  // Leg tops beside the arch, up to the springing line of the mass.
  for (const sx of [-1, 1]) hexa(k.pier, [[sx * r, y0, spring], [sx * hx, y0, spring], [sx * hx, y1, spring], [sx * r, y1, spring]],
    [[sx * r, y0, spring + r], [sx * hx, y0, spring + r], [sx * hx, y1, spring + r], [sx * r, y1, spring + r]], { capA: false, capB: false, skip: [3] })
  // Cap, projecting a little.
  hexa(k.pier, [[-hx - 0.5, y0 - 0.5, top - 1.2], [hx + 0.5, y0 - 0.5, top - 1.2], [hx + 0.5, y1 + 0.5, top - 1.2], [-hx - 0.5, y1 + 0.5, top - 1.2]],
    [[-hx - 0.5, y0 - 0.5, top], [hx + 0.5, y0 - 0.5, top], [hx + 0.5, y1 + 0.5, top], [-hx - 0.5, y1 + 0.5, top]])
  if (k.d) {
    // Pilaster strips on the faces either side of the opening.
    for (const s of [-1, 1]) for (const yy of [y0 + 1.2, y1 - 1.2]) {
      hexa(k.pier, [[s * hx, yy - 0.6, gMin + 2.6], [s * (hx + 0.3), yy - 0.6, gMin + 2.6], [s * (hx + 0.3), yy + 0.6, gMin + 2.6], [s * hx, yy + 0.6, gMin + 2.6]],
        [[s * hx, yy - 0.6, top - 1.2], [s * (hx + 0.3), yy - 0.6, top - 1.2], [s * (hx + 0.3), yy + 0.6, top - 1.2], [s * hx, yy + 0.6, top - 1.2]], { capA: false })
    }
  }
}

function piers(k: Kit) {
  for (const s of [-1, 1]) pier(k, s * PIER - 7, s * PIER + 7, 13.5, BEARING_Z - 1.2, 9.0, 0.5 * (BEARING_Z - 1.2 - ground(0, s * PIER)))
  // South anchor pier: two legs about 12 m apart under the truss's south end.
  pier(k, -END - 2, -END + 10, 13.0, bc(END) - 1.0, 8.0, 10.0)
  for (const x of [-TX, TX]) hexa(k.steel, [[x - 1.4, -END - 1.2, bc(END) - 1.0], [x + 1.4, -END - 1.2, bc(END) - 1.0], [x + 1.4, -END + 1.2, bc(END) - 1.0], [x - 1.4, -END + 1.2, bc(END) - 1.0]],
    [[x - 0.9, -END - 0.8, bc(END) - 0.2], [x + 0.9, -END - 0.8, bc(END) - 0.2], [x + 0.9, -END + 0.8, bc(END) - 0.2], [x - 0.9, -END + 0.8, bc(END) - 0.2]])
  // North abutment on the cliff.
  footedLoft(k.pier, ground, [
    { plan: chamferedRect(-14, 14, END - 6, END + 1, 0), z: 'ground' },
    { plan: chamferedRect(-14, 14, END - 6, END + 1, 0), z: bc(END) - 1.0 },
  ], k.d ? 3 : 40)
}

// ---- Lights --------------------------------------------------------------------------------

function lights(k: Kit) {
  const d = k.d
  // Along both top chords, on their outer edges.
  for (const x of [-TX, TX]) {
    for (let i = 0; i < YS.length - 1; i++) {
      const n = d ? 2 : 1
      for (let j = 0; j < n; j++) {
        const t = (j + 0.5) / Math.max(n, 1), y = YS[i] + (YS[i + 1] - YS[i]) * t
        bead(k.lamp, [x + Math.sign(x) * 0.9, y, tc(y) + 0.6], d ? 0.45 : 0.8, !d)
      }
    }
    // Along the deck edge (the footway's outer rail).
    const step = d ? 6 : 18
    for (let y = -END + step / 2; y < END; y += step)
      bead(k.lamp, [Math.sign(x) * (FOOT1 + 0.2), y, road(y) + 1.3], d ? 0.35 : 0.6, !d)
  }
}

// ---- Build --------------------------------------------------------------------------------

function build(d: boolean): Kit {
  const k: Kit = { steel: new Part(), pier: new Part(), deck: new Part(), lamp: new Part(), d }
  trusses(k)
  deck(k)
  piers(k)
  lights(k)
  return k
}

// Night: piers floodlit, the steel washed faintly from below and the deck.
const steelLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : 0.35) * (p[2] > 40 ? 0.8 : 1)
const pierLit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.4 : 0.95)
const STEEL: MaterialSpec = { ...finish('story-blue-grey', 0x74839a), floodlight: steelLit }
const PIER_M: MaterialSpec = { ...finish('pier-concrete', 0xd0c8bf), floodlight: pierLit }
const DECK = finish('footway', 0x8e8b86)
const LAMP = { name: 'lamp', color: 0x6d7380 }

export const ID = 'brisbane-story-bridge'
export const BEARING = 358.67

if (import.meta.main) {
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the water at mid-span',
    bearing: BEARING, elevation: 0, trussPlanes: [-TX, TX], roadwayMidspan: road(0), roadwayAtMainPiers: road(PIER), roadwayAtEnds: road(END),
  }
  for (const [file, d, maxTris, maxBytes] of [
    [`${ID}.glb`, false, 6500, 250 * 1024],
    [`${ID}.detail.glb`, true, 40000, 1536 * 1024],
  ] as const) {
    const k = build(d)
    const parts = [
      { part: k.steel, material: STEEL },
      { part: k.pier, material: PIER_M },
      { part: k.deck, material: DECK },
      { part: k.lamp, material: LAMP },
    ]
    const tris = parts.reduce((t, { part }) => t + part.triangles, 0)
    const glb = writeGlb('Story Bridge', parts, extras)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes; ` + parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
    if (!process.env.LOOSE && tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    if (!process.env.LOOSE && glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  }
}
