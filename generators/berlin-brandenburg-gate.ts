/**
 * Brandenburg Gate, Berlin (Carl Gotthard Langhans, 1788-1791; the Quadriga
 * by Johann Gottfried Schadow, 1793, recast 1958): original procedural
 * geometry, CC0-1.0.
 * bun generators/berlin-brandenburg-gate.ts
 * Writes models/berlin-brandenburg-gate.glb (low) and
 * models/berlin-brandenburg-gate.detail.glb (detail, detailZoom 16).
 * Imports the facade kit from berlin-reichstag.ts and the sculpture kit
 * from london-albert-memorial.ts (merge those first).
 *
 * Map frame, turned to BEARING 353.6 (the line of the twelve columns in OSM:
 * the gate stands 6.4 degrees off north-south, square to Unter den Linden):
 * +y is compass 353.6 (north), +x compass 83.6 (east, Pariser Platz). z up,
 * metres; z = 0 the paving (Mapterhorn: flat to 0.4 m). Origin = the area
 * centroid of OSM way/518071791, the gate itself.
 *
 * What makes it the Brandenburg Gate, and how each is drawn
 * - Twelve fluted Doric columns, six a side, in pairs joined by the walls
 *   that divide the five real passages (the middle one 5.6 m wide, the
 *   others 4.1 m), each wall with its roundel and relief panel facing the
 *   passages; the columns as 16-sided fluted shafts in the detail model.
 * - The Doric entablature: the plain architrave, the frieze with its
 *   triglyphs (and metope reliefs, detail), the cornice.
 * - The stepped attic: a ridge block over the outer bays with the steps
 *   running down to the cornice front and back, and the higher central
 *   block with Schadow's relief of the procession of Peace (figures in the
 *   detail model) carrying the Quadriga.
 * - The Quadriga, in green patinated copper, facing east: four horses
 *   abreast, the inner pair by the chariot pole and the outer pair turned
 *   a little out, each stepping with one foreleg raised, necks arched and
 *   heads tucked, tails long; the two-wheeled chariot with its round front;
 *   Victoria standing in it, wings raised, laurel crown, the reins in her
 *   left hand and in her right the staff with the oak wreath, the Iron
 *   Cross and the Prussian eagle on top. Every horse, the chariot, the
 *   figure and the staff are real 3D; the low model has the same parts
 *   with fewer facets.
 * - Langhans' two flanking column halls (open, under a low copper roof) and
 *   the two guardhouses in front of them on the Pariser Platz side, small
 *   Doric temples with their pediments to the east.
 *
 * Sources
 * - OSM way/518071791 (gate, height 26; wikidata Q82425) and its parts: the
 *   twelve columns way/206159275-286 (13.5 m), the passage walls
 *   way/206159287/288/290/292/293, way/206001643, the entablature
 *   way/496376285 (13.5-16), cornice way/206004656 (16-16.8), the attic
 *   way/1222287191 and way/496376284 (16.8-19.7) and its centre
 *   way/1222287190 (16.8-20); the column halls way/206159289,
 *   way/518071779 (roof parts way/1222295517, /518, 10-12), their columns
 *   (0.9 m, 10 m: way/1222287219-252); the guardhouses way/518071762,
 *   way/375247938 (roofs way/1222295515, /516), their cellas
 *   way/1162406970, /971 and their columns. (c) OpenStreetMap contributors,
 *   ODbL.
 * - Published (Wikipedia "Brandenburger Tor"): 26 m high, 65.5 m wide,
 *   11 m deep; the middle passage 5.65 m, the others 3.8 m; the Quadriga
 *   faces east into the city.
 * - Mapterhorn terrain (bun tools/terrain.ts grid): flat, 0.4 m over the
 *   whole site.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Brandenburg Gate - Brandenburger Tor - Berlin - Germany - 02.jpg",
 *     Norbert Nagel, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Brandenburg_Gate_-_Brandenburger_Tor_-_Berlin_-_Germany_-_02.jpg
 *     (the east front three-quarter: columns, passage walls with roundels
 *     and reliefs, entablature, the stepped attic, a guardhouse and a
 *     column hall; scaled by the 16.8 m cornice);
 *   "Brandenburg Gate - Brandenburger Tor - Berlin - Germany - 01.jpg" and
 *     "- 03.jpg", Norbert Nagel, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Brandenburg_Gate_-_Brandenburger_Tor_-_Berlin_-_Germany_-_01.jpg
 *     https://commons.wikimedia.org/wiki/File:Brandenburg_Gate_-_Brandenburger_Tor_-_Berlin_-_Germany_-_03.jpg
 *   "Brandenburger Tor morgens.jpg", Thomas Wolf (www.foto-tw.de),
 *     CC BY-SA 3.0, the west front level with both column halls,
 *     https://commons.wikimedia.org/wiki/File:Brandenburger_Tor_morgens.jpg
 *   "Berlin, Brandenburger Tor -- 2019 -- 6331.jpg", "-- 6326", "-- 6338",
 *     Dietmar Rabich, CC BY-SA 4.0 (east front, guardhouse roofs green),
 *     https://commons.wikimedia.org/wiki/File:Berlin,_Brandenburger_Tor_--_2019_--_6331.jpg
 *   "Quadriga auf Brandenburger Tor in Berlin.jpg", Mark König,
 *     CC BY-SA 4.0 (the Quadriga frontal: lanes of the horses, Victoria,
 *     the staff, wreath, cross and eagle; scaled by the 9.1 m block),
 *     https://commons.wikimedia.org/wiki/File:Quadriga_auf_Brandenburger_Tor_in_Berlin.jpg
 *   "MK20009 Quadriga (Brandenburger Tor).jpg", Martin Kraft, CC BY-SA 3.0
 *     (the Quadriga from the side: the horses' gait, the chariot and its
 *     wheel, Victoria's wings and staff),
 *     https://commons.wikimedia.org/wiki/File:MK20009_Quadriga_(Brandenburger_Tor).jpg
 *   "00 2486 Quadriga - Brandenburger Tor (Berlin).jpg", W. Bulach,
 *     CC BY-SA 4.0; "Berlin, Quadriga auf dem Brandenburger Tor
 *     2H1A0140WI.jpg", Kora27, CC BY-SA 4.0; "Berlin-Brandenburger
 *     Tor-18-Quadriga-2016-gje.jpg", Gerd Eichmann, CC BY-SA 4.0 (the
 *     attic relief and the Quadriga from below).
 *   "Brandenburger Tor with Ukrainian flag from Pariser Platz 2023-02-24
 *     06.jpg", Leonhard Lenz, CC0 (night).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - From OSM: the whole plan (columns at x +-4.35, y +-3.6/9.3/15.1; walls;
 *   halls 10.4 x 15.6 m on a 4 x 5 column grid; guardhouses 17.5 x 11 m),
 *   and the heights 13.5 / 16 / 16.8 / 19.7 / 20.
 * - Estimated from Nagel's "- 02" (26.5 px/m): column base 0.35, capital
 *   12.6-13.5; architrave 13.5-14.8; the attic steps (four) and the ridge
 *   block; roundels at 9.6, relief panels 6.2-7.6 on the passage walls.
 * - Estimated from König's frontal photo: the horses close abreast (lanes +-0.9 and
 *   +-2.9 m), withers 2.0 m, heads to 23.0, Victoria's head 24.1, the
 *   wreath at 25.6 (about 1.3 m over her head, as in the photo) and the
 *   eagle's wing tips at 27.1 m (OSM's gate height is 26).
 * - Invented: the halls' interior, the guardhouse cellas' doors, the
 *   relief figures' poses and the exact leg each horse raises.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { lathe, face, tube, ellipsoid, solid, slab, TAU } from './nyc-columbus-monument'
import { writeModel, box, cbox } from './london-buckingham-palace'
import { place, figure, ell, LOW, HIGH, type Q } from './london-albert-memorial'
import { welded } from './berlin-reichstag'

export const BEARING = 353.6

/** Sculpture quality for the bronze (copper) groups. */
type SQ = { tube: number; ell: number; rows: number; ring: number; detail: boolean }

/**
 * Loft elliptical sections along a spine: `pts` the centre line, `rad` each
 * section's half-width (x, across) and half-height (in the spine's vertical
 * plane), `side` the across direction. Ends capped; smooth-shaded by `place`.
 */
function spine(q: Part, pts: V3[], rad: [number, number][], n: number, side: V3 = [1, 0, 0], wobble?: (k: number, a: number) => number) {
  const rings = pts.map((c, k) => {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)]
    const t = unit3(sub3(b, a)), u = unit3(side), v = unit3(cross3(t, u))
    return Array.from({ length: n }, (_, i): V3 => {
      const th = i * TAU / n, w = wobble ? wobble(k, th) : 1
      const cu = Math.cos(th) * rad[k][0] * w, sv = Math.sin(th) * rad[k][1] * w
      return [c[0] + u[0] * cu + v[0] * sv, c[1] + u[1] * cu + v[1] * sv, c[2] + u[2] * cu + v[2] * sv]
    })
  })
  // Make every ring counter-clockwise about the spine's direction so the loft faces out.
  solid(q, rings)
}
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit3 = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/**
 * A horse facing local +y, hooves at z = 0, `s` its withers height, sculpted
 * as one lofted body from the dock through barrel and chest up the arched
 * neck to the tucked head; a mane crest, ears, a long tail, and four legs
 * with muscled forearms and gaskins, knees, hocks and hooves; `raise` lifts
 * one foreleg (+1 right, -1 left) bent at the knee.
 */
function horse(q: Part, Q: SQ, s: number, o: { raise: 1 | -1; girth?: number }) {
  const g = o.girth ?? 1.1, S = (x: number, y: number, z: number): V3 => [x * s, y * s, z * s]
  const n = Q.detail ? 22 : 7
  // Body: dock, quarters, barrel, chest, neck, poll, face, muzzle.
  const body: [number, number, number, number][] = [ // y, z, half-width, half-height
    [-0.64, 0.9, 0.06, 0.07], [-0.58, 0.88, 0.15, 0.17], [-0.46, 0.85, 0.2, 0.22], [-0.28, 0.83, 0.21, 0.23],
    [-0.05, 0.8, 0.22, 0.24], [0.2, 0.83, 0.21, 0.25], [0.38, 0.9, 0.18, 0.25], [0.47, 1.04, 0.13, 0.19],
    [0.52, 1.2, 0.1, 0.15], [0.55, 1.36, 0.085, 0.12], [0.58, 1.5, 0.075, 0.1], [0.66, 1.53, 0.075, 0.09],
    [0.75, 1.4, 0.07, 0.085], [0.84, 1.22, 0.055, 0.065], [0.88, 1.15, 0.03, 0.04],
  ]
  spine(q, body.map(([y, z]) => S(0, y, z)), body.map(([, , w, h]) => [w * s * g, h * s * g] as [number, number]), n)
  // Mane: a crest along the top of the neck, and the forelock.
  const mane: [number, number, number][] = [[0.34, 1.08, 0.03], [0.42, 1.24, 0.045], [0.47, 1.4, 0.05], [0.53, 1.55, 0.04], [0.6, 1.6, 0.025]]
  spine(q, mane.map(([y, z]) => S(0, y - 0.02, z + 0.03)), mane.map(([, , w]) => [w * s * 0.55, w * s * 1.1] as [number, number]), Q.detail ? 6 : 4)
  for (const e of [-1, 1]) tube(q, [S(e * 0.045, 0.6, 1.58), S(e * 0.055, 0.59, 1.7)], [0.028 * s, 0.008 * s], 4)
  // Tail, long and full.
  spine(q, [S(0, -0.64, 0.9), S(0, -0.74, 0.78), S(0, -0.78, 0.55), S(0, -0.76, 0.3)], [[0.04 * s, 0.05 * s], [0.07 * s, 0.07 * s], [0.07 * s, 0.07 * s], [0.03 * s, 0.03 * s]], Q.detail ? 8 : 4, [1, 0, 0])
  // Legs: thigh/forearm, knee or hock, cannon, fetlock, hoof.
  const leg = (pts: V3[], r: number[]) => spine(q, pts, r.map((v) => [v * s, v * s * 1.1] as [number, number]), Q.detail ? 12 : 5, [1, 0, 0])
  for (const e of [-1, 1]) {
    const x = e * 0.11
    leg([S(x, -0.4, 0.86), S(x, -0.5, 0.56), S(x, -0.58, 0.36), S(x, -0.52, 0.16), S(x, -0.5, 0.05), S(x, -0.49, 0.0)], [0.13, 0.085, 0.06, 0.045, 0.05, 0.055])
    if (e === o.raise) leg([S(x, 0.32, 0.86), S(x, 0.45, 0.6), S(x, 0.58, 0.58), S(x, 0.54, 0.4), S(x, 0.58, 0.32)], [0.11, 0.075, 0.055, 0.045, 0.055])
    else leg([S(x, 0.32, 0.86), S(x, 0.36, 0.56), S(x, 0.38, 0.32), S(x, 0.4, 0.1), S(x, 0.41, 0.0)], [0.11, 0.075, 0.055, 0.045, 0.055])
  }
  if (Q.detail) {
    // Harness: the breast collar, the girth and the decorated saddle cloth.
    tube(q, [S(-0.2, 0.33, 1.0), S(0, 0.5, 0.88), S(0.2, 0.33, 1.0)], [0.03 * s, 0.035 * s, 0.03 * s], 5)
    spine(q, [S(0, -0.18, 1.0), S(0, 0.02, 1.02), S(0, 0.2, 1.02)], [[0.25 * s * g, 0.05 * s], [0.26 * s * g, 0.06 * s], [0.25 * s * g, 0.05 * s]], 10)
  }
}

/**
 * Victoria, facing local +y, feet at the origin, h tall to the crown:
 * a flowing robe (folds as ripples in the lofted rings) belted under the
 * breast, bare arms (the right raised to the staff, the left forward with
 * the reins), the head with its laurel crown, and both wings raised behind
 * her shoulders, each a curved fan of feathered blades.
 */
function victoria(q: Part, Q: SQ, h: number) {
  const n = Q.detail ? 32 : 8
  const H = (x: number, y: number, z: number): V3 => [x * h, y * h, z * h]
  const prof: [number, number, number, number][] = [ // z, half-width, half-depth, forward shift
    [0.0, 0.16, 0.13, 0.02], [0.2, 0.145, 0.115, 0.01], [0.42, 0.125, 0.095, 0], [0.56, 0.105, 0.075, 0],
    [0.62, 0.1, 0.07, 0], [0.7, 0.12, 0.08, 0.01], [0.78, 0.135, 0.075, 0], [0.82, 0.11, 0.06, 0], [0.845, 0.045, 0.045, 0],
  ]
  const rings = prof.map(([z, w, d, f], k) => Array.from({ length: n }, (_, i): V3 => {
    const th = i * TAU / n, fold = Q.detail && z < 0.6 ? 1 + 0.06 * Math.cos(7 * th + k) * (0.6 - z) / 0.6 : 1
    return H(w * fold * Math.cos(th), f + d * fold * Math.sin(th), z)
  }))
  solid(q, rings)
  ellipsoid(q, H(0, 0.01, 0.905), [0.058 * h, 0.064 * h, 0.076 * h], Q.ell, Q.rows)
  const m = Q.detail ? 14 : 6
  const crown: V3[] = Array.from({ length: m + 1 }, (_, k): V3 => H(0.058 * Math.cos(k * TAU / m), 0.01 + 0.064 * Math.sin(k * TAU / m), 0.925))
  tube(q, crown, crown.map(() => 0.012 * h), 4)
  // Arms.
  spine(q, [H(0.12, 0, 0.79), H(0.2, 0.03, 0.86), H(0.21, 0.06, 0.94), H(0.2, 0.08, 1.0)], [[0.034 * h, 0.034 * h], [0.028 * h, 0.028 * h], [0.025 * h, 0.025 * h], [0.022 * h, 0.022 * h]], Q.detail ? 8 : 4, [0, 1, 0])
  spine(q, [H(-0.12, 0, 0.79), H(-0.17, 0.1, 0.68), H(-0.14, 0.22, 0.63), H(-0.1, 0.3, 0.62)], [[0.034 * h, 0.034 * h], [0.028 * h, 0.028 * h], [0.025 * h, 0.025 * h], [0.022 * h, 0.022 * h]], Q.detail ? 8 : 4, [0, 0, 1])
  // Wings: blades fanned from the shoulder, rising and curving outward.
  for (const e of [-1, 1]) {
    const root = H(e * 0.1, -0.08, 0.78)
    const nb = Q.detail ? 7 : 3
    for (let b = 0; b < nb; b++) {
      const f = b / (nb - 1), lift = 1.45 - 0.45 * f, out = 0.4 + 0.3 * f, L = h * (0.42 - 0.08 * f)
      const U: V3 = [e * Math.sin(out) * Math.cos(lift - 0.9), -0.32, Math.sin(lift)], V: V3 = [e * 0.55, -0.75, -0.2]
      slab(q, root, unit3(U), unit3(V), [[0, 0], [L, 0.02 * h], [L * 1.04, 0.08 * h], [L * 0.6, 0.13 * h], [0.05 * h, 0.1 * h]], 0.022 * h)
    }
  }
  // The cloak's end blowing back (detail).
  if (Q.detail) spine(q, [H(0.05, -0.07, 0.75), H(0.1, -0.15, 0.5), H(0.13, -0.2, 0.25), H(0.14, -0.22, 0.08)], [[0.06 * h, 0.02 * h], [0.08 * h, 0.025 * h], [0.08 * h, 0.02 * h], [0.05 * h, 0.015 * h]], 8, [1, 0, 0])
}

/** The Prussian eagle with spread wings, in the y-z plane, facing +x; centre at c. */
function eagle(q: Part, c: V3, k: number, detail: boolean) {
  ellipsoid(q, c, [0.14 * k, 0.12 * k, 0.24 * k], detail ? 8 : 5, detail ? 4 : 3)
  ellipsoid(q, [c[0] + 0.03 * k, c[1], c[2] + 0.3 * k], [0.07 * k, 0.07 * k, 0.08 * k], detail ? 6 : 4, detail ? 3 : 2)
  for (const e of [-1, 1]) {
    slab(q, [c[0], c[1] + e * 0.08 * k, c[2] + 0.05 * k], [0, e, 0.6], [0, 0, 1], [[0, -0.12 * k], [0.55 * k, 0.12 * k], [0.62 * k, 0.32 * k], [0.4 * k, 0.28 * k], [0.05 * k, 0.15 * k]], 0.05 * k)
  }
  // Tail fan.
  slab(q, [c[0], c[1], c[2] - 0.2 * k], [0, 1, 0], [0, 0, -1], [[-0.12 * k, 0], [0.12 * k, 0], [0.18 * k, 0.22 * k], [-0.18 * k, 0.22 * k]], 0.04 * k)
}

export function build(Q: Q) {
  const stone = new Part(), trim = new Part(), cu = new Part(), win = new Part(), shade = new Part()
  const D = Q.detail
  const n = D ? 16 : 8

  // ===== The gate ==========================================================
  const CX = 4.35, CY = [-15.1, -9.3, -3.6, 3.6, 9.3, 15.1]
  const Z_CAP = 12.6, Z_ARC = 13.5, Z_FR = 14.8, Z_COR = 16.0, Z_ATT = 16.8
  // Columns, fluted in the detail model (alternate radii every other facet).
  const column = (x: number, y: number, r: number, zt: number, nn: number, fluted: boolean, lite = false) => {
    const shaft = (z: number, rr: number) => Array.from({ length: fluted ? nn * 2 : nn }, (_, i): V3 => {
      const a = i * TAU / (fluted ? nn * 2 : nn), f = fluted && i % 2 ? 0.93 : 1
      return [x + rr * f * Math.cos(a), y + rr * f * Math.sin(a), z]
    })
    const k = r / 0.875, zc = zt - 0.9 * k
    if (lite) {
      stone.loft([shaft(0, r), shaft(zt, r * 0.86)])
      return
    }
    if (fluted) {
      stone.loft([shaft(0, r * 1.12), shaft(0.35 * k, r * 1.12)])
      stone.loft([shaft(0.35 * k, r * 1.12), shaft(0.35 * k, r)])
    }
    stone.loft([shaft(fluted ? 0.35 * k : 0, r), shaft(zc, r * 0.86)])
    // Echinus and abacus.
    lathe(trim, [[r * 0.86, zc], [r * 1.0, zc + 0.15 * k], [r * 1.18, zc + 0.5 * k]], nn, x, y, false)
    cbox(trim, x - r * 1.2, y - r * 1.2, x + r * 1.2, y + r * 1.2, zc + 0.5 * k, zt, 0)
  }
  for (const y of CY) for (const x of [-CX, CX]) column(x, y, 0.875, Z_ARC, n, D)
  // The walls between the pairs (the passages run along x between them).
  for (const y of CY) {
    const yA = Math.abs(y) > 15 ? (y > 0 ? 14.3 : -16.9) : y - 0.8, yB = Math.abs(y) > 15 ? (y > 0 ? 16.9 : -14.3) : y + 0.8
    box(stone, -3.5, yA, 3.5, yB, 0, Z_ARC, false)
    // Their faces in the passages: roundel, relief panel, two recessed door panels.
    for (const fy of [yA, yB]) {
      if (Math.abs(fy) > 16) continue
      const out = fy === yA ? -1 : 1, yy = fy + out * 0.04
      const inside: V3 = [0, fy - out, 7]
      const disc = (zc: number, r: number) => {
        const m = D ? 16 : 8
        for (let i = 0; i < m; i++) {
          const a0 = i * TAU / m, a1 = (i + 1) * TAU / m
          const tri = (pts: V3[]) => face(trim, pts[0], pts[1], pts[2], pts[2], inside)
          tri([[0, yy, zc], [r * Math.cos(a0), yy, zc + r * Math.sin(a0)], [r * Math.cos(a1), yy, zc + r * Math.sin(a1)]])
        }
      }
      disc(9.6, 0.85)
      face(trim, [-1.6, yy, 6.2], [1.6, yy, 6.2], [1.6, yy, 7.6], [-1.6, yy, 7.6], inside)
      if (D) {
        for (const x0 of [-2.6, 0.35]) face(shade, [x0, yy, 0.6], [x0 + 2.25, yy, 0.6], [x0 + 2.25, yy, 5.2], [x0, yy, 5.2], inside)
        // The relief figures in the panel, and the roundel's head.
        for (let k = 0; k < 5; k++) ellipsoid(trim, [-1.2 + k * 0.6, fy + out * 0.08, 6.9], [0.16, 0.06, 0.5], 5, 2)
        ellipsoid(trim, [0, fy + out * 0.1, 9.6], [0.38, 0.08, 0.48], 6, 3)
      }
    }
  }
  // Entablature: architrave, frieze, cornice (with soffits).
  const EX = 5.45, EY = 16.6
  box(stone, -EX, -EY, EX, EY, Z_ARC, Z_FR, false)
  stone.quad([-EX, -EY, Z_ARC], [-EX, EY, Z_ARC], [EX, EY, Z_ARC], [EX, -EY, Z_ARC])
  box(stone, -EX - 0.05, -EY - 0.05, EX + 0.05, EY + 0.05, Z_FR, Z_COR, false)
  cbox(trim, -EX - 0.55, -EY - 0.55, EX + 0.55, EY + 0.55, Z_COR, Z_ATT, 0)
  trim.quad([-EX - 0.55, -EY - 0.55, Z_COR], [-EX - 0.55, EY + 0.55, Z_COR], [EX + 0.55, EY + 0.55, Z_COR], [EX + 0.55, -EY - 0.55, Z_COR])
  // Triglyphs (detail) or a band (low) on the frieze, all four faces.
  if (D) {
    for (let k = 0; k <= 22; k++) {
      const y = -EY + 0.5 + k * (2 * EY - 1) / 22
      for (const s of [-1, 1]) {
        cbox(trim, s > 0 ? EX : -EX - 0.15, y - 0.32, s > 0 ? EX + 0.15 : -EX, y + 0.32, Z_FR + 0.05, Z_COR - 0.05, 0)
        if (k < 22) ellipsoid(trim, [s * (EX + 0.06), y + (2 * EY - 1) / 44, (Z_FR + Z_COR) / 2], [0.06, 0.35, 0.4], 5, 2)
      }
    }
    for (let k = 0; k <= 7; k++) {
      const x = -EX + 0.5 + k * (2 * EX - 1) / 7
      for (const s of [-1, 1]) cbox(trim, x - 0.32, s > 0 ? EY : -EY - 0.15, x + 0.32, s > 0 ? EY + 0.15 : -EY, Z_FR + 0.05, Z_COR - 0.05, 0)
    }
    // Guttae band under the frieze.
    cbox(trim, -EX - 0.12, -EY - 0.12, EX + 0.12, EY + 0.12, Z_FR - 0.25, Z_FR, 0)
  } else {
    for (const s of [-1, 1]) face(trim, [s * (EX + 0.07), -EY, Z_FR + 0.1], [s * (EX + 0.07), EY, Z_FR + 0.1], [s * (EX + 0.07), EY, Z_COR - 0.1], [s * (EX + 0.07), -EY, Z_COR - 0.1], [0, 0, 15])
  }

  // ===== The stepped attic ===================================================
  const RX = 3.2, Z_RIDGE = 19.7, BY = 4.55, Z_BLK = 20.0
  const steps = D ? 4 : 3
  for (const s of [-1, 1]) {
    const y0 = s > 0 ? BY : -EY, y1 = s > 0 ? EY : -BY
    box(stone, -RX, y0, RX, y1, Z_ATT, Z_RIDGE)
    for (let k = 0; k < steps; k++) {
      const x0 = EX + 0.2 - (EX + 0.2 - RX) * k / steps, z1 = Z_ATT + (Z_RIDGE - Z_ATT) * (k + 1) / steps - 0.25
      for (const sx of [-1, 1]) box(stone, sx > 0 ? RX : -x0, y0, sx > 0 ? x0 : -RX, y1, Z_ATT, z1)
    }
  }
  // The central block with its relief, and the plinth for the Quadriga.
  cbox(stone, -6.0, -BY, 6.0, BY, Z_ATT, Z_BLK - 0.4, D ? 0.1 : 0)
  cbox(trim, -6.15, -BY - 0.15, 6.15, BY + 0.15, Z_BLK - 0.4, Z_BLK, 0)
  for (const s of [-1, 1]) {
    const x = s * 6.04
    face(trim, [x, -3.7, 17.3], [x, 3.7, 17.3], [x, 3.7, 19.2], [x, -3.7, 19.2], [0, 0, 18])
    if (D) {
      // The procession of Peace: figures and a chariot in low relief.
      for (let k = 0; k < 11; k++) {
        const y = -3.3 + k * 0.66
        place(trim, [x + s * 0.02, y, 17.4], s > 0 ? -Math.PI / 2 : Math.PI / 2, 1, (q) => figure(q, { tube: 4, ell: 5, rows: 2, ring: 5, detail: false }, 1.55, { arms: [[[0.13, 0, 0.78], [0.2, 0.12, 0.65]], [[-0.13, 0, 0.78], [-0.2, 0.1, 0.6]]], girth: 1.0 }), 88)
      }
    }
  }

  // ===== The Quadriga ========================================================
  {
    const SQ: SQ = D ? { tube: 12, ell: 16, rows: 8, ring: 16, detail: true } : { tube: 5, ell: 6, rows: 3, ring: 6, detail: false }
    const g = new Part()
    const z0 = Z_BLK, sW = 2.0
    // Horses facing east (+x): local +y -> model +x is yaw -pi/2.
    const yaw = -Math.PI / 2
    const lanes: [number, number, 1 | -1][] = [[-2.55, 0.1, -1], [-0.9, 0.02, 1], [0.9, -0.02, -1], [2.55, -0.1, 1]]
    for (const [y, turn, raise] of lanes) {
      place(g, [1.5, y, z0], yaw + turn, 1, (q) => horse(q, SQ, sW, { raise, girth: 1.12 }), 70)
    }
    // The pole and the yoke between the inner horses, and the reins.
    tube(g, [[-0.6, 0, z0 + 1.0], [1.6, 0, z0 + 1.45], [2.2, 0, z0 + 1.7]], [0.08, 0.07, 0.06], 4)
    tube(g, [[1.9, -1.4, z0 + 1.75], [1.9, 1.4, z0 + 1.75]], [0.06, 0.06], 4)
    // The chariot: the round-fronted car on two big wheels.
    const cx = -1.15
    solid(g, [ell(cx, 0, z0 + 0.7, 0.75, 0.95, D ? 14 : 8), ell(cx + 0.05, 0, z0 + 1.6, 0.85, 1.0, D ? 14 : 8), ell(cx + 0.1, 0, z0 + 2.3, 0.8, 0.95, D ? 14 : 8)])
    for (const s of [-1, 1]) {
      const m = D ? 20 : 10, r = 1.0, w = 0.12, yc = s * 1.08, zc = z0 + 1.0
      const rim = (rr: number, dy: number) => Array.from({ length: m }, (_, k): V3 => [cx - 0.1 + rr * Math.cos(k * TAU / m), yc + dy, zc + rr * Math.sin(k * TAU / m)])
      // Tyre: a flat ring with its tread.
      const o0 = rim(r, -w), o1 = rim(r, w), i0 = rim(r - 0.14, -w), i1 = rim(r - 0.14, w)
      for (let k = 0; k < m; k++) {
        const l = (k + 1) % m, ctr: V3 = [cx - 0.1, yc, zc]
        face(g, o0[k], o0[l], o1[l], o1[k], ctr)
        face(g, i0[k], i1[k], i1[l], i0[l], [cx - 0.1 + 3 * Math.cos((k + 0.5) * TAU / m), yc, zc + 3 * Math.sin((k + 0.5) * TAU / m)])
        face(g, o1[k], o1[l], i1[l], i1[k], [cx - 0.1, yc - s, zc])
        face(g, o0[k], i0[k], i0[l], o0[l], [cx - 0.1, yc + s, zc])
      }
      // Spokes and the hub.
      const nsp = D ? 10 : 6
      for (let k = 0; k < nsp; k++) {
        const a = k * TAU / nsp
        tube(g, [[cx - 0.1, yc, zc], [cx - 0.1 + (r - 0.1) * Math.cos(a), yc, zc + (r - 0.1) * Math.sin(a)]], [0.06, 0.04], 3)
      }
      ellipsoid(g, [cx - 0.1, yc + s * 0.05, zc], [0.2, 0.18, 0.2], D ? 8 : 5, D ? 4 : 2)
    }
    // Victoria, standing in the car: wings raised, staff in her right hand, reins in her left.
    const fx = cx - 0.15, fz = z0 + 1.2
    place(g, [fx, 0, fz], yaw, 1, (q) => victoria(q, SQ, 3.1), 70)
    // The staff (her right hand is on the south side), with the oak wreath,
    // the Iron Cross and the eagle.
    const sx = fx + 0.2, sy = -0.64
    tube(g, [[sx - 0.15, sy, z0 + 1.6], [sx, sy, 26.2]], [0.06, 0.05], 4)
    const zw = 25.6, rw = 0.48, mw = D ? 18 : 8
    const wreath: V3[] = Array.from({ length: mw + 1 }, (_, k): V3 => [sx, sy + rw * Math.cos(k * TAU / mw), zw + rw * Math.sin(k * TAU / mw)])
    tube(g, wreath, wreath.map(() => (D ? 0.09 : 0.11)), D ? 5 : 4)
    for (const [dy, dz] of [[1, 0], [0, 1]]) {
      const L = rw * 0.85, W = 0.11
      box(g, sx - 0.04, sy - (dy ? L : W), sx + 0.04, sy + (dy ? L : W), zw - (dz ? L : W), zw + (dz ? L : W))
    }
    eagle(g, [sx, sy, 26.45], 1.0, D)
    cu.pos.push(...g.pos); cu.nrm.push(...g.nrm); cu.uv.push(...g.uv)
  }

  // ===== Column halls and guardhouses (north and south) ======================
  for (const s of [-1, 1]) {
    const Y = (y: number) => s * y
    // The column hall: a 4 x 5 grid of Doric columns (some left out, as in OSM) under the roof.
    const hx = [-4.4, -1.35, 1.72, 4.8], hy = [17.6, 21.0, 24.5, 28.0, 31.6]
    for (const y of hy) for (const x of hx) {
      if ((y === 24.5 || y === 17.6) && Math.abs(x) < 2) continue
      if (!D && (y === 21.0 || y === 28.0) && Math.abs(x) < 2) continue
      column(x, Y(y), 0.45, 10.0, D ? 12 : 6, D, !D)
    }
    const y0 = s > 0 ? 16.9 : -32.4, y1 = s > 0 ? 32.4 : -16.9
    box(stone, -5.1, y0, 5.5, y1, 10.0, 11.0, false)
    stone.quad([-5.1, y0, 10.0], [-5.1, y1, 10.0], [5.5, y1, 10.0], [5.5, y0, 10.0])
    cbox(trim, -5.4, y0 - (s > 0 ? 0 : 0.3), 5.8, y1 + (s > 0 ? 0.3 : 0), 11.0, 11.35, 0)
    trim.quad([-5.4, y0, 11.0], [-5.4, y1, 11.0], [5.8, y1, 11.0], [5.8, y0, 11.0])
    // Low hipped copper roof.
    const ra = s > 0 ? 16.9 : -32.7, rb = s > 0 ? 32.7 : -16.9
    cu.loft([[[-5.4, ra, 11.35], [5.8, ra, 11.35], [5.8, rb, 11.35], [-5.4, rb, 11.35]], [[-2.4, ra + (s > 0 ? 0 : 3), 12.3], [2.8, ra + (s > 0 ? 0 : 3), 12.3], [2.8, rb - (s > 0 ? 3 : 0), 12.3], [-2.4, rb - (s > 0 ? 3 : 0), 12.3]]])
    cu.quad([-2.4, ra + (s > 0 ? 0 : 3), 12.3], [2.8, ra + (s > 0 ? 0 : 3), 12.3], [2.8, rb - (s > 0 ? 3 : 0), 12.3], [-2.4, rb - (s > 0 ? 3 : 0), 12.3])
    // A back wall in the hall against the gate (the halls are open on three sides).
    if (D) box(stone, -3.5, s > 0 ? 16.9 : -18.2, 3.5, s > 0 ? 18.2 : -16.9, 0, 10.0, false)

    // The guardhouse: cella, peristyle, entablature, gable roof with pediments east and west.
    const gy0 = 20.9, gy1 = 29.0, gx0 = 8.0, gx1 = 21.5
    const ya = Math.min(Y(gy0), Y(gy1)), yb = Math.max(Y(gy0), Y(gy1))
    box(stone, gx0, ya, gx1, yb, 0, 10.0, false)
    for (const x of [8.0, 11.6, 15.2, 18.8, 22.3]) for (const y of [20.3, 29.6]) column(x, Y(y), 0.45, 10.0, D ? 12 : 6, D, !D)
    for (const y of [23.4, 26.5]) column(22.3, Y(y), 0.45, 10.0, D ? 12 : 6, D, !D)
    // Windows and doors on the cella (detail), a door to the east.
    face(win, [gx1 + 0.04, Y(23.6), 0], [gx1 + 0.04, Y(26.3), 0], [gx1 + 0.04, Y(26.3), 4.6], [gx1 + 0.04, Y(23.6), 4.6], [15, Y(25), 3])
    if (D) for (const x of [9.8, 13.4, 17.0, 20.0]) for (const y of [gy0, gy1]) {
      const yy = Y(y) + (y === gy1 ? s : -s) * 0.04
      face(win, [x - 0.6, yy, 2.0], [x + 0.6, yy, 2.0], [x + 0.6, yy, 4.8], [x - 0.6, yy, 4.8], [15, Y(25), 3])
    }
    const ex0 = 5.6, ex1 = 22.95, ey0 = Math.min(Y(19.7), Y(30.2)), ey1 = Math.max(Y(19.7), Y(30.2))
    box(stone, ex0, ey0, ex1, ey1, 10.0, 11.0, false)
    stone.quad([ex0, ey0, 10.0], [ex0, ey1, 10.0], [ex1, ey1, 10.0], [ex1, ey0, 10.0])
    cbox(trim, ex0, ey0 - 0.3, ex1 + 0.3, ey1 + 0.3, 11.0, 11.35, 0)
    const ym = (ey0 + ey1) / 2, zr = 13.0
    for (const e of [-1, 1]) {
      const yE = e > 0 ? ey1 + 0.3 : ey0 - 0.3
      face(cu, [ex0, yE, 11.35], [ex1 + 0.3, yE, 11.35], [ex1 + 0.3, ym, zr], [ex0, ym, zr], [14, ym, 10])
    }
    for (const x of [ex0, ex1 + 0.3]) {
      // Pediment (tympanum) at each end.
      face(stone, [x, ey0 - 0.3, 11.35], [x, ey1 + 0.3, 11.35], [x, ym + 0.01, zr], [x, ym - 0.01, zr], [14, ym, 11])
    }
    if (D) {
      // The roundel relief in the east pediment and the raking cornice.
      const m = 12
      for (let i = 0; i < m; i++) {
        const a0 = i * TAU / m, a1 = (i + 1) * TAU / m, xx = ex1 + 0.36
        face(trim, [xx, ym, 12.0], [xx, ym + 0.6 * Math.cos(a0), 12.0 + 0.6 * Math.sin(a0)], [xx, ym + 0.6 * Math.cos(a1), 12.0 + 0.6 * Math.sin(a1)], [xx, ym + 0.6 * Math.cos(a1), 12.0 + 0.6 * Math.sin(a1)], [14, ym, 12])
      }
      for (const e of [-1, 1]) {
        const yE = e > 0 ? ey1 + 0.3 : ey0 - 0.3
        tube(trim, [[ex1 + 0.35, yE, 11.4], [ex1 + 0.35, ym, zr + 0.05]], [0.18, 0.18], 4)
      }
    }
  }
  return { stone, trim, cu, win, shade }
}

function write(Q: Q, file: string, maxTris: number) {
  const b = build(Q)
  const [stone, trim, cu, win, shade] = [b.stone, b.trim, b.cu, b.win, b.shade].map((p) => welded(p))
  const lit = (p: V3, n: V3) => (n[2] > 0.9 ? 0.3 : 0.9)
  const parts = [
    { part: stone, material: { ...mat('brandenburg-sandstone', 0xc9b591), floodlight: lit } },
    { part: trim, material: { ...mat('trim', 0xd6c4a2), floodlight: lit } },
    { part: cu, material: { ...mat('patina', 0x7fa398, 0.6), floodlight: (p: V3) => (p[2] > 19 ? 0.9 : 0) } },
    { part: win, material: mat('window', 0x64798a, 0.35) },
  ]
  if (shade.triangles) parts.push({ part: shade, material: mat('brandenburg-shade', 0xa8987a) })
  writeModel('Brandenburg Gate', 'berlin-brandenburg-gate', parts, { bearing: BEARING, osm: 'way/518071791', height: 27.1 }, maxTris, file)
}

function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}

if (import.meta.main) {
  write(LOW, 'berlin-brandenburg-gate', 6500)
  write(HIGH, 'berlin-brandenburg-gate.detail', 40000)
}
