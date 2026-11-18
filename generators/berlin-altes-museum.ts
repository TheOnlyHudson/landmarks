/**
 * Altes Museum, Am Lustgarten, Berlin (Karl Friedrich Schinkel, 1823-1830) —
 * procedural, CC0-1.0, no textures. bun generators/berlin-altes-museum.ts
 *
 * Writes models/berlin-altes-museum.glb (low) and
 * models/berlin-altes-museum.detail.glb (detail). Also holds the small
 * Berlin sculpture kit (`put`, `eagle`, `lion`, `rider`, `horseTamer`,
 * `pegasusGroup`, `candelabrumGroup`, `quadrupedWithWings`) and the
 * classical helpers (`corinthian`, `flutedShaft`) that the other Berlin
 * museum generators import: merge this one first.
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 328: model +y
 * is compass 328, so the colonnade front faces model south (compass 148, onto
 * the Lustgarten). Anchor: the area centroid of the OSM multipolygon
 * relation/3619 (outer way/15968753 less its two courtyards), lng 13.398786,
 * lat 52.519458. The building's axis is x = CX = -0.4. z = 0 is the
 * Lustgarten pavement in front of the stair (the site is flat).
 *
 * What makes it the Altes Museum, and how each is drawn
 * - The long Ionic colonnade of 18 fluted columns between two corner antae,
 *   real round shafts (8 sides low, 12 detail) with capitals, standing on
 *   the podium in front of a deep open hall: the hall's back wall, cream
 *   with its row of Pompeian-red panels, stands 7 m behind the columns, and
 *   the centre five bays open further into the stair hall (dark glass wall,
 *   1993) behind four more columns. The entablature with the inscription
 *   frieze runs back over the hall to the wall as a real roof slab.
 * - The 18 sandstone eagles standing on the cornice over the columns
 *   (dark, weathered), and the four corner pedestals with their bronze
 *   candelabrum groups.
 * - The raised square attic over the rotunda (cross-shaped in plan, as OSM
 *   maps it) with its gilt railing (detail), and on its corners the two
 *   Dioscuri / horse-tamer groups (Friedrich Tieck, 1828) at the front and
 *   the two Pegasus groups (Hagen and Schievelbein, 1861) at the back.
 * - The broad open stair (Freitreppe) in the middle seven bays, its cheek
 *   walls carrying Kiss's "Amazon on horseback" (east) and Wolff's "Lion
 *   fighter" (west).
 * - The plain cubic block behind: buff sandstone walls with two storeys of
 *   windows on the sides and back, the low grey roof, the two courtyards.
 *
 * Evidence
 * - OSM (ODbL): relation/3619 "Altes Museum" (building=museum, wikidata
 *   Q156722) with outer way/15968753 (building:part, height 24, roof:height
 *   2.7, hipped) and inner courtyards way/15968754, way/15968756; the attic
 *   way/137230471 (building:part, height 30.9, pyramidal).
 * - Published (de.wikipedia "Altes Museum"): 87 x 55 m on a socle; 18 fluted
 *   Ionic columns between two corner pilasters; 18 sandstone eagles over the
 *   columns; the rotunda 23 m high inside; front corners of the attic: two
 *   horse-tamer groups (Tieck, 1828), back corners: two Pegasus groups
 *   (1861); stair cheeks: Amazon on horseback (Kiss, 1842, east) and Lion
 *   fighter (Wolff after Rauch, 1861, west).
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Altes Museum, Berlín, Alemania, 2026-05-02, DD 37.jpg", Diego Delso,
 *   CC BY-SA 4.0 (square-on front: proportions, column rhythm, heights);
 *   "Altes Museum, Berlin-Mitte, 170117, ako.jpg", Ansgar Koreng, CC BY 4.0
 *   (sunlit colonnade: column, podium, red wall colours, eagles, Amazon);
 *   "Berlin, Altes Museum -- 2013 -- 4531.jpg", Dietmar Rabich, CC BY-SA 4.0
 *   (front; attic height against the cornice);
 *   "Museum Island, Berlin 2017 001.jpg", Mike Peel, CC BY-SA 4.0 (front);
 *   "Berlin Altes Museum 01.jpg", Ad Meskens, CC BY-SA 4.0 (front from SSW);
 *   "Altes Museum (Berlin) + Lustgarten, 2024 (01).jpg", Bahnfrend,
 *   CC BY-SA 4.0 (front from SE);
 *   "Berlin Altes Museum sculptures from Berliner Dom 01, 02, 05.jpg", Ad
 *   Meskens, CC BY-SA 4.0 (Lion fighter, Pegasus groups, attic pedestals, the
 *   roof's metal sheet and lanterns);
 *   "Altes Museum seen from NW 1338.jpg", Dosseman, CC BY-SA 4.0 (attic
 *   corner, gilt railing, corner candelabrum group);
 *   "2015-10 Berlin-Mitte (36).jpg", Marek Mróz, CC BY 4.0 (the west side on
 *   the Kupfergraben: plain ashlar, two window storeys);
 *   "Berlin Cathedral and Altes Museum Berlin - BugWarp 01.jpg", BugWarp,
 *   CC BY-SA 4.0 (front from the east, attic and statues in silhouette);
 *   "Altes Museum Berlin at night 2024-01-21 01.jpg", Leonhard Lenz, CC0
 *   (night: the colonnade floodlit, the hall lit).
 * - Measured from the square-on DD 37 photo, scaled by the published 87 m
 *   length (12.4 px/m at the facade): column axis spacing 4.35 m, columns
 *   11.9 m including base and capital, entablature 3.6 m, podium 2.9 m, so
 *   the cornice stands at 18.4 m; the attic top at 24.5 m (Rabich photo,
 *   corrected for its 11 m set-back) and the groups on it 3.6 m tall; the
 *   stair 29.4 m wide between its cheeks.
 * - Estimated: hall depth 7 m and the stair hall's glass wall a further 7 m
 *   back (from the oblique photos); window sizes on the sides and back; the
 *   roof (a low hip to 21.6 m: OSM's 2.7 m roof height on the 18.9 m
 *   blocking course; OSM's 24 m / 30.9 m totals are taken as including
 *   roof and statues and are not used).
 * - Invented/simplified: the sculpture is drawn as bold figure, horse,
 *   lion and eagle forms in the real poses (not portraits); the courtyard
 *   facades are plain; the back of the attic and the north side's windows
 *   follow the west side seen in the Mróz photo.
 * - Look-only references: none.
 * - Doubts: the north (back) side is not in any photo used; the attic is
 *   centred on the facade axis (OSM has it 1 m east of the outline's axis).
 *
 * Colour (review): the columns, entablature and attic are the sooty
 * grey-brown of the photos (about #6f6455), the walls a darker buff, so the
 * colonnade reads dark against the red hall wall; the inscription on the
 * frieze is drawn as dark letter marks (word blocks in the low model).
 *
 * Night: the colonnade, its entablature and the attic front are floodlit
 * (`_FLOODLIGHT`); the hall's red wall and the stair-hall glass are lit as
 * windows; the statues stay dark.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { writeModel } from './london-buckingham-palace'
import { cylinder, cbox, rect, qf, tf } from './dc-white-house'
import { capPoly, wallsPoly, type XY } from './dc-national-cathedral'
import { lathe, ellipsoid, tube, slab, solid, TAU } from './nyc-columbus-monument'
import { place, figure, animal, wing, ell, LOW, HIGH, type Q, type FigureOpts, type AnimalPose } from './london-albert-memorial'
import { ionic, lodKit, faceOf, fpanel, fblock, type Lod, type Face } from './london-british-museum'

export const ID = 'berlin-altes-museum'
export const BEARING = 328

// ===========================================================================
// Berlin sculpture kit (shared with the other Berlin generators)
// ===========================================================================

/** Copy what `make` builds (local frame: +y forward, z up) into q, turned by yaw, pitched, moved to (x, y, z), scaled by k. */
export function put(q: Part, x: number, y: number, z: number, yaw: number, make: (s: Part) => void, k = 1, pitch = 0) {
  const s = new Part()
  make(s)
  const c = Math.cos(yaw), si = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
  for (let i = 0; i < s.pos.length; i += 3) {
    let X = s.pos[i] * k, Y = -s.pos[i + 2] * k, Z = s.pos[i + 1] * k
    ;[Y, Z] = [Y * cp - Z * sp, Y * sp + Z * cp]
    s.pos[i] = x + X * c - Y * si
    s.pos[i + 2] = -(y + X * si + Y * c)
    s.pos[i + 1] = Z + z
    let nx = s.nrm[i], ny = -s.nrm[i + 2], nz = s.nrm[i + 1]
    ;[ny, nz] = [ny * cp - nz * sp, ny * sp + nz * cp]
    s.nrm[i] = nx * c - ny * si
    s.nrm[i + 2] = -(nx * si + ny * c)
    s.nrm[i + 1] = nz
  }
  for (let i = 0; i < s.pos.length; i++) { q.pos.push(s.pos[i]); q.nrm.push(s.nrm[i]) }
  for (let i = 0; i < s.uv.length; i++) q.uv.push(s.uv[i])
}

/**
 * A perched eagle facing +y, talons at z = 0, h tall to the crown of its
 * head; wings folded (spread 0) or half open (spread 1), as on a cornice.
 */
export function eagle(q: Part, Q: Q, h: number, spread = 0) {
  const n = Q.detail ? 10 : 5, rows = Q.detail ? 5 : 2
  // Breast and body, leaning back a little.
  ellipsoid(q, [0, 0.02 * h, 0.46 * h], [0.2 * h, 0.2 * h, 0.33 * h], n, rows, 0, 0)
  // Head on a short neck, and the hooked beak.
  ellipsoid(q, [0, 0.08 * h, 0.86 * h], [0.11 * h, 0.13 * h, 0.12 * h], n, rows)
  if (Q.detail) tube(q, [[0, 0.18 * h, 0.87 * h], [0, 0.28 * h, 0.83 * h], [0, 0.29 * h, 0.76 * h]], [0.05 * h, 0.035 * h, 0.012 * h], 4)
  // Talons gripping a small rock.
  if (Q.detail) solid(q, [ell(0, 0.02 * h, -0.02 * h, 0.2 * h, 0.16 * h, 8), ell(0, 0.02 * h, 0.08 * h, 0.17 * h, 0.13 * h, 8)])
  for (const s of [-1, 1] as const) {
    if (spread > 0) {
      wing(q, Q, [s * 0.14 * h, -0.05 * h, 0.7 * h], s, 0.75 * h * spread + 0.3 * h, 0.5, 0.35)
    } else {
      // Folded wing: a broad plate from the shoulder down the flank to the tail.
      slab(q, [s * 0.19 * h, -0.02 * h, 0.72 * h], [s * 0.12, -0.35, -0.93], [0, 1, -0.15],
        Q.detail ? [[0, -0.12 * h], [0.25 * h, -0.14 * h], [0.62 * h, -0.05 * h], [0.68 * h, 0.04 * h], [0.1 * h, 0.16 * h]] : [[0, -0.12 * h], [0.65 * h, -0.08 * h], [0.6 * h, 0.06 * h], [0.05 * h, 0.16 * h]], 0.07 * h)
    }
  }
  // Tail feathers down behind.
  if (Q.detail) slab(q, [0, -0.16 * h, 0.2 * h], [0, -0.35, -0.94], [1, 0, 0], [[0, -0.1 * h], [0.25 * h, -0.13 * h], [0.25 * h, 0.13 * h], [0, 0.1 * h]], 0.05 * h)
}

/** A lion facing +y, paws at z = 0, s its shoulder height. Lying (dying, on its side) or leaping. */
export function lion(q: Part, Q: Q, s: number, pose: { lying?: boolean; leap?: number } = {}) {
  const S = (x: number, y: number, z: number): V3 => [x * s, y * s, z * s]
  const sides = Q.detail ? 7 : 4, n = Q.detail ? 9 : 5, rows = Q.detail ? 4 : 3
  if (pose.lying) {
    // Thrown on its back, legs clawing up, the maned head twisted.
    tube(q, [S(0, -0.6, 0.28), S(0, -0.2, 0.32), S(0, 0.25, 0.36)], [0.24 * s, 0.3 * s, 0.32 * s], sides)
    ellipsoid(q, S(0, 0.48, 0.45), [0.38 * s, 0.32 * s, 0.36 * s], n, rows)
    ellipsoid(q, S(0.05, 0.72, 0.42), [0.17 * s, 0.2 * s, 0.17 * s], n, rows)
    if (Q.detail) for (const [x, y] of [[-0.18, 0.25], [0.18, 0.15], [-0.2, -0.45], [0.2, -0.5]]) tube(q, [S(x, y, 0.4), S(x * 1.6, y + 0.1, 0.7), S(x * 1.8, y + 0.2, 0.62)], [0.08 * s, 0.07 * s, 0.06 * s], 4)
    if (Q.detail) tube(q, [S(0, -0.85, 0.25), S(0.2, -1.15, 0.08), S(0.35, -1.25, 0.05)], [0.04 * s, 0.035 * s, 0.05 * s], 4)
    return
  }
  const lp = pose.leap ?? 0
  const R = (x: number, y: number, z: number): V3 => {
    // Leaping: the body pitched up about the hind feet.
    const a = lp * 0.7, dy = y + 0.55, dz = z
    return S(x, -0.55 + dy * Math.cos(a) - dz * Math.sin(a), dy * Math.sin(a) + dz * Math.cos(a))
  }
  tube(q, [R(0, -0.55, 0.62), R(0, -0.2, 0.6), R(0, 0.2, 0.66), R(0, 0.42, 0.7)], [0.17 * s, 0.2 * s, 0.24 * s, 0.2 * s], sides)
  ellipsoid(q, R(0, 0.45, 0.86), [0.3 * s, 0.26 * s, 0.32 * s], n, rows) // mane
  ellipsoid(q, R(0, 0.66, 0.9), [0.14 * s, 0.17 * s, 0.14 * s], n, rows) // head
  for (const x of Q.detail ? [-0.12, 0.12] : [0]) {
    tube(q, [R(x, 0.38, 0.6), R(x, 0.55 + lp * 0.2, 0.35), R(x, 0.62 + lp * 0.3, 0.05 + lp * 0.2)], [0.08 * s, 0.065 * s, 0.07 * s], 4)
    tube(q, [R(x, -0.48, 0.58), R(x, -0.62, 0.32), R(x, -0.55, 0.0)], [0.1 * s, 0.07 * s, 0.07 * s], 4)
  }
  if (Q.detail) tube(q, [R(0, -0.7, 0.66), R(0, -1.0, 0.5), R(0, -1.2, 0.62)], [0.04 * s, 0.035 * s, 0.05 * s], 4)
}

/** A rider astride, hips at the origin, h his full standing height; facing +y. */
export function riderFigure(q: Part, Q: Q, h: number, arms: V3[][], o: { lean?: number; helmet?: boolean; robe?: boolean } = {}) {
  const H = (x: number, y: number, z: number): V3 => [x * h, y * h, z * h]
  const sides = Q.detail ? 7 : 4
  const lean = o.lean ?? 0.05
  // Legs astride, down the horse's flanks.
  for (const s of [-1, 1]) {
    tube(q, [H(s * 0.08, 0, 0.02), H(s * 0.15, 0.12, -0.16), H(s * 0.17, 0.08, -0.38), H(s * 0.16, 0.13, -0.43)], [0.07 * h, 0.06 * h, 0.045 * h, 0.04 * h], sides)
  }
  if (o.robe) solid(q, [ell(0, 0, -0.12 * h, 0.2 * h, 0.15 * h, Q.ring), ell(0, 0, 0.05 * h, 0.15 * h, 0.12 * h, Q.ring)])
  // Torso, shoulders, head.
  solid(q, [ell(0, 0, 0, 0.13 * h, 0.1 * h, Q.ring), ell(0, lean * 0.15 * h, 0.2 * h, 0.12 * h, 0.08 * h, Q.ring), ell(0, lean * 0.3 * h, 0.33 * h, 0.15 * h, 0.08 * h, Q.ring), ell(0, lean * 0.35 * h, 0.38 * h, 0.05 * h, 0.05 * h, Q.ring)])
  ellipsoid(q, H(0, lean * 0.42, 0.45), [0.06 * h, 0.065 * h, 0.075 * h], Q.ell, Q.rows)
  if (o.helmet) ellipsoid(q, H(0, lean * 0.42, 0.5), [0.07 * h, 0.075 * h, 0.05 * h], Q.ell, Q.rows)
  for (const a of arms) tube(q, a.map(([x, y, z]) => H(x, y, z)), a.map((_, i) => (0.045 - i * 0.007) * h), Q.detail ? 6 : 4)
}

/**
 * Smooth-shade what `make` builds into dst: every corner at a position takes
 * the area-weighted mean of all faces there, so the corners weld and a
 * small low-poly figure costs about one vertex per two triangles.
 */
export function smoothAll(dst: Part, make: (q: Part) => void) {
  const q = new Part()
  make(q)
  const key = (i: number) => `${Math.round(q.pos[i] * 1e4)},${Math.round(q.pos[i + 1] * 1e4)},${Math.round(q.pos[i + 2] * 1e4)}`
  const acc = new Map<string, V3>()
  const at = (i: number): V3 => [q.pos[i], -q.pos[i + 2], q.pos[i + 1]] // glTF storage -> map frame
  for (let t = 0; t < q.pos.length; t += 9) {
    const A = at(t), B = at(t + 3), C = at(t + 6)
    const u: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v: V3 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]]
    const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    for (const i of [t, t + 3, t + 6]) {
      const k = key(i), m = acc.get(k)
      if (m) { m[0] += n[0]; m[1] += n[1]; m[2] += n[2] } else acc.set(k, [...n])
    }
  }
  const nrm = (i: number): V3 => { const m = acc.get(key(i))!, l = Math.hypot(m[0], m[1], m[2]) || 1; return [m[0] / l, m[1] / l, m[2] / l] }
  for (let t = 0; t < q.pos.length; t += 9) {
    const A = at(t), B = at(t + 3), C = at(t + 6)
    dst.tri(A, B, C, undefined, undefined, undefined, [nrm(t), nrm(t + 3), nrm(t + 6)])
  }
}

/** Translate a part's local points (glTF storage) by (x, y, z) in the local map frame. */
function shift(s: Part, x: number, y: number, z: number) {
  for (let i = 0; i < s.pos.length; i += 3) { s.pos[i] += x; s.pos[i + 1] += z; s.pos[i + 2] -= y }
}

/**
 * The horse's back at its mid-point when rearing by `rear` (horse frame,
 * metres, s its withers height): where a rider sits.
 */
export function saddle(s: number, rear: number): V3 {
  const len = 0.95, bodyZ = 0.78, rB = 0.2
  const hy = -len / 2, dy = -hy, dz = rB + 0.02
  return [0, (hy + dy * Math.cos(rear) - dz * Math.sin(rear)) * s, (bodyZ + dy * Math.sin(rear) + dz * Math.cos(rear)) * s]
}

/** A mounted group: a rearing horse with its rider, and an optional beast under or at it. Faces +y, plinth top at z = 0. */
export function rider(q: Part, Q: Q, o: { s: number; rear: number; lift?: number; toss?: number; h: number; arms: V3[][]; spear?: [V3, V3]; beast?: 'lion' | 'panther'; robe?: boolean; helmet?: boolean }) {
  const pose: AnimalPose = { rear: o.rear, lift: o.lift ?? 1, toss: o.toss ?? -0.1, girth: 1.2 }
  animal(q, Q, 'horse', o.s, pose)
  const [sx, sy, sz] = saddle(o.s, o.rear)
  const r = new Part()
  riderFigure(r, Q, o.h, o.arms, { lean: 0.25, robe: o.robe, helmet: o.helmet })
  shift(r, sx, sy, sz - 0.02 * o.h)
  for (let i = 0; i < r.pos.length; i++) { q.pos.push(r.pos[i]); q.nrm.push(r.nrm[i]) }
  for (let i = 0; i < r.uv.length; i++) q.uv.push(r.uv[i])
  if (o.spear) tube(q, o.spear, [0.05, 0.03], 4)
  if (o.beast === 'lion') put(q, 0.1, 0.55 * o.s, 0, -0.4, (b) => lion(b, Q, 0.75 * o.s, { lying: true }))
  if (o.beast === 'panther') put(q, -0.15, 0.95 * o.s, 0, Math.PI + 0.25, (b) => lion(b, Q, 0.55 * o.s, { leap: 0.9 }))
}

/** A horse tamer: a nude youth beside a prancing horse, one arm up at its bridle. Faces +y, plinth top at z = 0. */
export function horseTamer(q: Part, Q: Q, s: number, side: 1 | -1) {
  animal(q, Q, 'horse', s, { rear: 0.32, lift: 0.75, toss: -0.15, girth: 1.25 })
  const h = 1.45 * s
  put(q, side * 0.42 * s, 0.55 * s, 0, side * 1.27, (f) => figure(f, Q, h, {
    legs: true, stride: 0.5, lean: -0.05, girth: 1.2,
    arms: [[[0.13, 0, 0.78], [0.2, 0.12, 0.92], [0.18, 0.22, 1.05]], [[-0.13, 0, 0.78], [-0.2, -0.05, 0.6], [-0.18, 0.02, 0.45]]],
  }))
}

/** Pegasus with wings raised, and a robed muse at its shoulder. Faces +y, plinth top at z = 0. */
export function pegasusGroup(q: Part, Q: Q, s: number, side: 1 | -1) {
  quadrupedWithWings(q, Q, s, { rear: 0.18, lift: 0.6, toss: -0.05, girth: 1.2 }, 1.05 * s)
  const h = 1.45 * s
  put(q, side * 0.48 * s, 0.45 * s, 0, side * 1.35, (f) => figure(f, Q, h, {
    lean: 0.15, girth: 1.25,
    arms: [[[0.13, 0, 0.78], [0.24, 0.15, 0.78], [0.22, 0.32, 0.82]], [[-0.13, 0, 0.78], [-0.18, 0.05, 0.6], [-0.15, 0.12, 0.48]]],
  }))
}

/** A horse with two raised wings at the withers (Pegasus). */
export function quadrupedWithWings(q: Part, Q: Q, s: number, pose: AnimalPose, span: number) {
  animal(q, Q, 'horse', s, pose)
  const rear = pose.rear ?? 0
  const w = saddle(s, rear)
  for (const sd of [-1, 1] as const) wing(q, Q, [sd * 0.12 * s, w[1] + 0.18 * s, w[2] - 0.02 * s], sd, span, 1.0, 0.55)
}

/** Two seated figures flanking a tall candelabrum (the Altes Museum's corner groups). Faces +y, plinth top at z = 0. */
export function candelabrumGroup(q: Part, Q: Q, h: number) {
  if (Q.detail) lathe(q, [[0.28 * h, 0], [0.22 * h, 0.08 * h], [0.08 * h, 0.14 * h], [0.06 * h, 0.75 * h], [0.1 * h, 0.8 * h], [0.25 * h, 0.95 * h], [0.25 * h, 1.0 * h], [0.05 * h, 1.0 * h]], 10)
  else lathe(q, [[0.2 * h, 0], [0.07 * h, 0.12 * h], [0.07 * h, 0.8 * h], [0.25 * h, 1.0 * h]], 5)
  for (const sd of [-1, 1]) {
    put(q, sd * 0.38 * h, 0.05 * h, 0, sd * -0.5, (f) => figure(f, Q, 0.82 * h, {
      seated: true, girth: 1.25, lean: 0.1,
      arms: [[[-sd * 0.13, 0, 0.7], [-sd * 0.25, 0.05, 0.85], [-sd * 0.3, 0.05, 1.0]], [[sd * 0.13, 0, 0.7], [sd * 0.2, 0.12, 0.55], [sd * 0.12, 0.25, 0.48]]],
    }))
  }
}

// ===========================================================================
// Classical helpers (shared)
// ===========================================================================

/** A round shaft with a torus base, from z0 to z1, tapering to 0.86 r. */
export function shaftWithBase(L: Lod, shaft: Part, base: Part, x: number, y: number, z0: number, z1: number, r: number) {
  if (L.hi) {
    cbox(base, rect(x - r * 1.3, x + r * 1.3, y - r * 1.3, y + r * 1.3), z0, z0 + 0.32, { c: 0.08 })
    cylinder(base, x, y, r * 1.16, z0 + 0.32, z0 + 0.62, L.seg, r * 1.04)
    cylinder(shaft, x, y, r, z0 + 0.62, z1, L.seg, r * 0.86)
  } else cylinder(shaft, x, y, r, z0, z1, L.seg, r * 0.86)
}

/**
 * A Corinthian column at (x, y) from z0 to z1 (abacus top), shaft radius r:
 * base, tapering shaft, the bell of acanthus as a flared drum (two tiers of
 * leaves as notched rings in the detail), and the concave abacus block.
 */
export function corinthian(L: Lod, shaft: Part, cap: Part, x: number, y: number, z0: number, z1: number, r: number, rich = true) {
  const ch = r * 2.3 // capital height
  shaftWithBase(L, shaft, cap, x, y, z0, z1 - ch, r)
  const seg = L.seg
  if (!L.hi || !rich) {
    lathe(cap, [[r * 0.86, z1 - ch], [r * 1.05, z1 - ch * 0.45], [r * 1.35, z1 - ch * 0.18]], seg, x, y, false)
    cbox(cap, rect(x - r * 1.45, x + r * 1.45, y - r * 1.45, y + r * 1.45), z1 - ch * 0.18, z1)
    return
  }
  lathe(cap, [[r * 0.9, z1 - ch], [r * 1.0, z1 - ch * 0.7], [r * 1.12, z1 - ch * 0.4], [r * 1.38, z1 - ch * 0.18]], seg, x, y, false)
  // Leaf tips: eight small tongues round each of two tiers, and corner volutes.
  for (const [zt, rr, hh] of [[z1 - ch * 0.62, r * 1.08, ch * 0.3], [z1 - ch * 0.38, r * 1.2, ch * 0.24]] as const) {
    for (let k = 0; k < 8; k++) {
      const a = (TAU * (k + (zt > z1 - ch * 0.5 ? 0.5 : 0))) / 8
      const c: V3 = [x + rr * Math.cos(a), y + rr * Math.sin(a), zt]
      tube(cap, [c, [c[0] + 0.12 * r * Math.cos(a), c[1] + 0.12 * r * Math.sin(a), zt + hh * 0.5], [c[0] + 0.2 * r * Math.cos(a), c[1] + 0.2 * r * Math.sin(a), zt + hh * 0.75]], [r * 0.16, r * 0.12, r * 0.04], 4)
    }
  }
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) ellipsoid(cap, [x + sx * r * 1.25, y + sy * r * 1.25, z1 - ch * 0.25], [r * 0.2, r * 0.2, r * 0.22], 6, 3)
  // Abacus with hollow sides: a cross of two boxes and a thinner square.
  cbox(cap, rect(x - r * 1.5, x + r * 1.5, y - r * 1.2, y + r * 1.2), z1 - ch * 0.16, z1, { c: 0.05 })
  cbox(cap, rect(x - r * 1.2, x + r * 1.2, y - r * 1.5, y + r * 1.5), z1 - ch * 0.16, z1, { c: 0.05 })
}

/** A rectangular block on any face: s0..s1 along it, z0..z1, standing out d0..d1 (front, ends, top and bottom). */
export function faceBox(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number) {
  fblock(p, f, s0, s1, z0, z1, d0, d1, true)
}

/** Merge parts: every vertex of src appended to dst. */
export function append(dst: Part, src: Part) {
  for (let i = 0; i < src.pos.length; i++) { dst.pos.push(src.pos[i]); dst.nrm.push(src.nrm[i]) }
  for (let i = 0; i < src.uv.length; i++) dst.uv.push(src.uv[i])
}

// ===========================================================================
// The museum
// ===========================================================================

const CX = -0.4 // the front's axis
const X0 = -43.8, X1 = 43.0 // the block's ends
const YF = -27.1 // the podium front, under the column line
const YB = 26.3 // the back wall
const YW = -20.1 // the hall's back wall
const ZP = 2.9 // podium top: the hall floor
const ZC = ZP + 11.9 // capital tops
const ZE = ZC + 3.6 // cornice top
const ZBK = ZE + 0.5 // blocking course top
const ZR = 19.9 // roof top: a low hip hidden behind the blocking course
const ZA = 24.5 // attic cornice top
const S = 4.35 // column axis spacing
const R = 0.66 // column radius at the foot
const ANTA = 2.8 // corner pilaster width
const colX = (k: number) => CX + (k - 8.5) * S

// The attic over the rotunda: OSM's cross plan, centred on the axis.
const AT = { core: 8.65, wide: 13.2, y0: -16.0, y1: 13.4, wy0: -13.2, wy1: 10.8 }
// The two courtyards (OSM inner ways), as rectangles.
const COURTS: Array<[number, number, number, number]> = [[-31.5, -16.5, -8.5, 8.0], [15.7, 30.7, -8.5, 8.0]]

function build(hi: boolean) {
  const L = lodKit(hi)
  const Qs: Q = hi ? HIGH : LOW
  // Smooth-shade sculpture; the low model averages every corner so it welds small.
  const sculpt = (g: Part, make: (q: Part) => void) => (hi ? place(g, [0, 0, 0], 0, 1, make, 70) : smoothAll(g, make))
  const stone = new Part(), dark = new Part(), roof = new Part(), win = new Part(), red = new Part(), bronze = new Part()

  // ===== Podium, stair and cheeks =========================================
  // The podium runs under the whole block (and the hall floor).
  cbox(stone, rect(X0, X1, YF, YB), 0, ZP - 0.35, { top: false })
  cbox(stone, rect(X0 - 0.25, X1 + 0.25, YF - 0.25, YB + 0.25), ZP - 0.35, ZP, { top: stone, bottom: true })
  // The open stair, seven bays wide, rising from the Lustgarten.
  const SW = 14.7, SD = 8.0, nSteps = hi ? 14 : 5
  for (let k = 0; k < nSteps; k++) {
    const t0 = k / nSteps, t1 = (k + 1) / nSteps
    cbox(stone, rect(CX - SW, CX + SW, YF - SD * (1 - t0), YF), ZP * t0, ZP * t1, { top: true })
  }
  // Cheek walls with the bronze riders on their fronts.
  const CW = 2.6
  for (const s of [-1, 1]) {
    const xa = CX + s * SW, xb = CX + s * (SW + CW)
    cbox(stone, rect(Math.min(xa, xb), Math.max(xa, xb), YF - SD - 0.4, YF), 0, ZP + 0.45, { c: 0.15, b: 0.12 })
    cbox(stone, rect(Math.min(xa, xb) + 0.25, Math.max(xa, xb) - 0.25, YF - SD + 0.2, YF - SD + 3.6), ZP + 0.45, ZP + 0.85, { c: 0.1 })
  }
  // Lion fighter (west) and Amazon (east), riding out towards the Lustgarten.
  const riderZ = ZP + 0.85, ryY = YF - SD + 1.9
  put(bronze, CX - (SW + CW / 2), ryY, riderZ, Math.PI + 0.25, (g) => sculpt(g, (q) => rider(q, Qs, {
    s: 2.0, rear: 0.55, lift: 1, h: 2.4, beast: 'lion',
    arms: [[[0.13, 0.02, 0.33], [0.2, 0.1, 0.5], [0.22, 0.12, 0.7]], [[-0.13, 0.02, 0.33], [-0.18, 0.12, 0.2], [-0.12, 0.25, 0.15]]],
    spear: [[0.6, -0.6, 4.6], [0.15, 1.3, 0.7]],
  })))
  put(bronze, CX + (SW + CW / 2), ryY, riderZ, Math.PI - 0.25, (g) => sculpt(g, (q) => rider(q, Qs, {
    s: 2.0, rear: 0.35, lift: 0.8, h: 2.3, beast: 'panther', robe: true, helmet: true,
    arms: [[[-0.13, 0.02, 0.33], [-0.22, 0.1, 0.5], [-0.25, 0.05, 0.72]], [[0.13, 0.02, 0.33], [0.2, 0.15, 0.3], [0.15, 0.32, 0.3]]],
    spear: [[-0.8, -0.8, 4.5], [0.0, 2.2, 2.0]],
  })))

  // ===== The block ========================================================
  // Main walls: sides and back from the podium to the cornice; the front of
  // the block is the hall's back wall at YW, with the antae carrying the side
  // walls forward to the column line.
  wallsPoly(stone, [[X0, YF], [X0, YB], [X1, YB], [X1, YF]].reverse() as XY[], ZP, ZE - 3.6, (a, b) => a[1] === YF && b[1] === YF)
  // The hall's back wall (facing south), with the stair-hall opening in its middle.
  const OPEN = 8.7
  const hallWall = (x0: number, x1: number) => qf(stone, [x0, YW, ZP], [x1, YW, ZP], [x1, YW, ZC + 1.2], [x0, YW, ZC + 1.2], [0, -1, 0])
  hallWall(X0 + ANTA, CX - OPEN)
  hallWall(CX + OPEN, X1 - ANTA)
  // The antae's inner faces, facing into the hall.
  qf(stone, [X0 + ANTA, YF, ZP], [X0 + ANTA, YW, ZP], [X0 + ANTA, YW, ZC + 1.2], [X0 + ANTA, YF, ZC + 1.2], [1, 0, 0])
  qf(stone, [X1 - ANTA, YF, ZP], [X1 - ANTA, YW, ZP], [X1 - ANTA, YW, ZC + 1.2], [X1 - ANTA, YF, ZC + 1.2], [-1, 0, 0])
  // Anta fronts: weathered like the columns, with a capital band.
  for (const [a, b] of [[X0, X0 + ANTA], [X1 - ANTA, X1]]) {
    cbox(dark, rect(a, b, YF - 0.12, YF + 0.6), ZP, ZC - 1.0, { top: false })
    cbox(dark, rect(a - 0.1, b + 0.1, YF - 0.25, YF + 0.6), ZC - 1.0, ZC, { top: false, bottom: true })
  }
  // The stair hall: side walls, the dark glass wall (1993) and its ceiling.
  const YG = -13.0
  for (const s of [-1, 1]) qf(stone, [CX + s * OPEN, YW, ZP], [CX + s * OPEN, YG, ZP], [CX + s * OPEN, YG, ZC + 1.2], [CX + s * OPEN, YW, ZC + 1.2], [-s, 0, 0])
  qf(win, [CX - OPEN, YG, ZP], [CX + OPEN, YG, ZP], [CX + OPEN, YG, ZC + 1.2], [CX - OPEN, YG, ZC + 1.2], [0, -1, 0])
  if (hi) for (let k = 1; k < 6; k++) { const x = CX - OPEN + (2 * OPEN * k) / 6; cbox(dark, rect(x - 0.12, x + 0.12, YG - 0.15, YG), ZP, ZC + 1.2, { top: false }) }
  qf(stone, [CX - OPEN, YW, ZC + 1.2], [CX + OPEN, YW, ZC + 1.2], [CX + OPEN, YG, ZC + 1.2], [CX - OPEN, YG, ZC + 1.2], [0, 0, -1])
  // The four columns of the stair hall, in line with the wall.
  for (const k of [7, 8, 9, 10]) ionic(L, dark, dark, colX(k), YW + 0.4, ZP, ZC, R * 0.92, [1, 0])
  // Red panels on the hall wall, one per bay, and the red band under the ceiling.
  for (let k = -1; k < 18; k++) {
    const xm = k < 0 ? colX(0) - S / 2 - 0.2 : k === 17 ? colX(17) + S / 2 + 0.2 : (colX(k) + colX(k + 1)) / 2
    if (Math.abs(xm - CX) < OPEN + 0.5) continue
    const w = k < 0 || k === 17 ? 2.0 : 2.7
    qf(red, [xm - w / 2, YW - 0.05, ZP + 1.3], [xm + w / 2, YW - 0.05, ZP + 1.3], [xm + w / 2, YW - 0.05, ZP + 4.6], [xm - w / 2, YW - 0.05, ZP + 4.6], [0, -1, 0])
    if (false) qf(red, [xm - w / 2, YW - 0.05, ZP + 6.2], [xm + w / 2, YW - 0.05, ZP + 6.2], [xm + w / 2, YW - 0.05, ZP + 9.6], [xm - w / 2, YW - 0.05, ZP + 9.6], [0, -1, 0])
  }
  for (const [a, b] of [[X0 + ANTA, CX - OPEN], [CX + OPEN, X1 - ANTA]]) {
    qf(red, [a, YW - 0.05, ZP + 0.2], [b, YW - 0.05, ZP + 0.2], [b, YW - 0.05, ZP + 0.8], [a, YW - 0.05, ZP + 0.8], [0, -1, 0])
    qf(red, [a, YW - 0.05, ZC - 0.6], [b, YW - 0.05, ZC - 0.6], [b, YW - 0.05, ZC + 0.2], [a, YW - 0.05, ZC + 0.2], [0, -1, 0])
  }
  // Hall ceiling (coffered in reality), seen from below.
  qf(stone, [X0 + ANTA, YF + 0.7, ZC + 1.2], [X1 - ANTA, YF + 0.7, ZC + 1.2], [X1 - ANTA, YW, ZC + 1.2], [X0 + ANTA, YW, ZC + 1.2], [0, 0, -1])

  // ===== The colonnade ====================================================
  for (let k = 0; k < 18; k++) {
    if (hi) {
      // Plinth, base and fluted-looking 12-sided shaft, the Ionic capital.
      ionic(L, dark, dark, colX(k), YF + 1.0, ZP, ZC, R, [1, 0])
    } else ionic(L, dark, dark, colX(k), YF + 1.0, ZP, ZC, R, [1, 0])
  }
  // Entablature: architrave and frieze over the column line from anta to
  // anta, carried round the block's sides and back.
  const outer: XY[] = [[X0, YF], [X1, YF], [X1, YB], [X0, YB]]
  wallsPoly(dark, outer, ZC, ZE - 0.9)
  // The dedication inscription on the front frieze: dark letter marks
  // (letters in the detail, word blocks in the low model).
  {
    const words = [10, 9, 2, 6, 12, 9, 2, 6, 11, 6, 9, 9]
    const total = words.reduce((a, b) => a + b, 0) + words.length - 1
    const pitch = 70 / total, zl0 = ZC + 1.55, zl1 = ZC + 2.3, yl = YF - 0.04
    let at = CX - 35
    for (const w of words) {
      if (hi) for (let k = 0; k < w; k++) { const x = at + k * pitch; qf(bronze, [x + 0.08, yl, zl0], [x + pitch - 0.12, yl, zl0], [x + pitch - 0.12, yl, zl1], [x + 0.08, yl, zl1], [0, -1, 0]) }
      else qf(bronze, [at, yl, zl0 + 0.15], [at + w * pitch - 0.15, yl, zl0 + 0.15], [at + w * pitch - 0.15, yl, zl1 - 0.15], [at, yl, zl1 - 0.15], [0, -1, 0])
      at += (w + 1) * pitch
    }
  }
  // Architrave soffit over the columns (the hall ceiling starts behind it).
  qf(dark, [X0 + ANTA, YF, ZC], [X1 - ANTA, YF, ZC], [X1 - ANTA, YF + 0.7, ZC], [X0 + ANTA, YF + 0.7, ZC], [0, 0, -1])
  qf(dark, [X0 + ANTA, YF + 0.7, ZC], [X1 - ANTA, YF + 0.7, ZC], [X1 - ANTA, YF + 0.7, ZC + 1.2], [X0 + ANTA, YF + 0.7, ZC + 1.2], [0, 1, 0])
  // Cornice: a projecting slab with a bevelled top.
  cbox(dark, rect(X0 - 0.75, X1 + 0.75, YF - 0.75, YB + 0.75), ZE - 0.9, ZE, { b: 0.25, bottom: true })
  // Blocking course (set back) and the roof.
  cbox(stone, rect(X0 - 0.1, X1 + 0.1, YF - 0.1, YB + 0.1), ZE - 0.2, ZBK, { top: false })
  // Roof: a low hip rising to a flat deck, with the two courtyard wells.
  const T = { x0: X0 + 4, x1: X1 - 4, y0: YF + 6, y1: YB - 4 }
  roof.loft([[[X0 - 0.1, YF - 0.1, ZBK], [X1 + 0.1, YF - 0.1, ZBK], [X1 + 0.1, YB + 0.1, ZBK], [X0 - 0.1, YB + 0.1, ZBK]], [[T.x0, T.y0, ZR], [T.x1, T.y0, ZR], [T.x1, T.y1, ZR], [T.x0, T.y1, ZR]]])
  const deck = (x0: number, x1: number, y0: number, y1: number) => { if (x1 > x0 && y1 > y0) roof.cap([[x0, y0, ZR], [x1, y0, ZR], [x1, y1, ZR], [x0, y1, ZR]], true) }
  const [cw, ce] = COURTS
  deck(T.x0, T.x1, T.y0, cw[2]); deck(T.x0, T.x1, cw[3], T.y1)
  deck(T.x0, cw[0], cw[2], cw[3]); deck(cw[1], ce[0], cw[2], cw[3]); deck(ce[1], T.x1, cw[2], cw[3])
  for (const [x0, x1, y0, y1] of COURTS) {
    // Inner walls down to the court floor, facing into the court.
    qf(stone, [x0, y0, ZP], [x1, y0, ZP], [x1, y0, ZR], [x0, y0, ZR], [0, 1, 0])
    qf(stone, [x0, y1, ZP], [x1, y1, ZP], [x1, y1, ZR], [x0, y1, ZR], [0, -1, 0])
    qf(stone, [x0, y0, ZP], [x0, y1, ZP], [x0, y1, ZR], [x0, y0, ZR], [1, 0, 0])
    qf(stone, [x1, y0, ZP], [x1, y1, ZP], [x1, y1, ZR], [x1, y0, ZR], [-1, 0, 0])
    roof.cap([[x0, y0, ZP + 0.05], [x1, y0, ZP + 0.05], [x1, y1, ZP + 0.05], [x0, y1, ZP + 0.05]], true)
    if (hi) for (const zz of [[ZP + 2.5, ZP + 5.5], [ZP + 8.5, ZP + 12.5]]) {
      for (let k = 0; k < 3; k++) {
        const xm = x0 + ((x1 - x0) * (k + 0.5)) / 3
        qf(win, [xm - 1, y0 + 0.05, zz[0]], [xm + 1, y0 + 0.05, zz[0]], [xm + 1, y0 + 0.05, zz[1]], [xm - 1, y0 + 0.05, zz[1]], [0, 1, 0])
        qf(win, [xm - 1, y1 - 0.05, zz[0]], [xm + 1, y1 - 0.05, zz[0]], [xm + 1, y1 - 0.05, zz[1]], [xm - 1, y1 - 0.05, zz[1]], [0, -1, 0])
      }
    }
  }
  // Roof lanterns over the galleries (dark metal hoods), detail only.
  if (hi) for (const [x, y] of [[-36, 0], [-24, 13], [-24, -13], [23, 13], [23, -13], [35, 0]] as XY[]) {
    cbox(roof, rect(x - 1.6, x + 1.6, y - 1.6, y + 1.6), ZR - 1.0, ZR + 0.6, { b: 0.5 })
  }

  // ===== Windows on the sides and back ====================================
  // Two storeys: a lower row and the tall upper row, a string course between.
  const sideFaces: Array<{ f: Face; s0: number; s1: number }> = [
    { f: faceOf([X0, YB], [X0, YF]), s0: YB - (YW + 2.5), s1: YB - YB + 3.0 }, // west, running south
    { f: faceOf([X1, YF], [X1, YB]), s0: (YW + 2.5) - YF, s1: YB - YF - 3.0 }, // east, running north
    { f: faceOf([X1, YB], [X0, YB]), s0: 3.5, s1: X1 - X0 - 3.5 }, // back, facing north
  ]
  for (const { f, s0, s1 } of sideFaces) {
    const a = Math.min(s0, s1), b = Math.max(s0, s1)
    const n = Math.round((b - a) / S)
    const step = (b - a) / n
    for (let k = 0; k < n; k++) {
      const s = a + step * (k + 0.5)
      fpanel(win, f, s - 0.85, s + 0.85, ZP + 1.4, ZP + 4.4)
      fpanel(win, f, s - 1.0, s + 1.0, ZP + 7.0, ZP + 10.8)
      if (hi) fblock(stone, f, s - 1.35, s + 1.35, ZP + 10.8, ZP + 11.2, 0, 0.22, true)
    }
    fblock(stone, f, 0.2, f.len - 0.2, ZP + 5.6, ZP + 6.0, 0, 0.18, true)
  }

  // ===== The attic over the rotunda =======================================
  const atc: XY[] = [
    [CX - AT.core, AT.y0], [CX + AT.core, AT.y0], [CX + AT.core, AT.wy0], [CX + AT.wide, AT.wy0], [CX + AT.wide, AT.wy1], [CX + AT.core, AT.wy1],
    [CX + AT.core, AT.y1], [CX - AT.core, AT.y1], [CX - AT.core, AT.wy1], [CX - AT.wide, AT.wy1], [CX - AT.wide, AT.wy0], [CX - AT.core, AT.wy0],
  ]
  wallsPoly(dark, atc, ZR - 1.5, ZA - 0.9)
  // Attic cornice and flat lead top.
  const grownAtc = atc.map(([x, y]) => [x + Math.sign(x - CX) * 0.35, y + Math.sign(y - (AT.y0 + AT.y1) / 2) * 0.35] as XY)
  wallsPoly(dark, grownAtc, ZA - 0.9, ZA)
  capPoly(dark, grownAtc, ZA - 0.9, false)
  capPoly(roof, grownAtc, ZA, true)
  // The statue pedestals fill the four re-entrant corners.
  const peds: Array<{ x: number; y: number; front: boolean }> = []
  for (const sx of [-1, 1]) for (const front of [true, false]) {
    const x = CX + sx * (AT.core + AT.wide) / 2
    const y = front ? (AT.y0 + AT.wy0) / 2 : (AT.y1 + AT.wy1) / 2
    peds.push({ x, y, front })
    const hw = (AT.wide - AT.core) / 2, hd = front ? (AT.wy0 - AT.y0) / 2 : (AT.y1 - AT.wy1) / 2
    cbox(dark, rect(x - hw, x + hw, y - hd, y + hd), ZR - 1.5, ZA - 0.6, { top: false })
    cbox(dark, rect(x - hw - 0.2, x + hw + 0.2, y - hd - 0.2, y + hd + 0.2), ZA - 0.6, ZA, { b: 0.15 })
  }
  // Gilt railing along the attic's front and back (detail): a top rail on posts.
  if (hi) for (const y of [AT.y0 - 0.1, AT.y1 + 0.1]) {
    cbox(dark, rect(CX - AT.core + 0.4, CX + AT.core - 0.4, y - 0.06, y + 0.06), ZA + 0.85, ZA + 0.95, { bottom: true })
    for (let k = 0; k <= 12; k++) { const x = CX - AT.core + 0.4 + ((2 * AT.core - 0.8) * k) / 12; cbox(dark, rect(x - 0.05, x + 0.05, y - 0.05, y + 0.05), ZA, ZA + 0.85, { top: false }) }
  }
  // The groups: horse tamers at the front, Pegasus groups at the back, all
  // facing out from the attic's front or back.
  for (const p of peds) {
    const side = (p.x > CX ? 1 : -1) as 1 | -1
    const yaw = p.front ? Math.PI : 0
    put(bronze, p.x, p.y, ZA, yaw + (p.front ? side * 0.35 : -side * 0.35), (g) => sculpt(g, (q) => (p.front ? horseTamer(q, Qs, 1.85, (side * -1) as 1 | -1) : pegasusGroup(q, Qs, 1.75, (side * -1) as 1 | -1))))
  }

  // ===== Cornice sculpture =================================================
  // The 18 eagles over the columns.
  for (let k = 0; k < 18; k++) {
    put(bronze, colX(k), YF - 0.1, ZE, Math.PI, (g) => sculpt(g, (q) => eagle(q, Qs, 1.75)))
  }
  // The four corner pedestals with their candelabrum groups.
  for (const sx of [-1, 1]) for (const y of [YF + 1.3, YB - 1.3]) {
    const x = sx < 0 ? X0 + 1.3 : X1 - 1.3
    cbox(stone, rect(x - 1.3, x + 1.3, y - 1.3, y + 1.3), ZE, ZE + 1.0, { c: 0.1 })
    cbox(dark, rect(x - 1.45, x + 1.45, y - 1.45, y + 1.45), ZE + 1.0, ZE + 1.3, { b: 0.1 })
    put(bronze, x, y, ZE + 1.3, y < 0 ? Math.PI : 0, (g) => sculpt(g, (q) => candelabrumGroup(q, Qs, 2.4)))
  }

  // ===== Materials and night ==============================================
  const lit = (p: V3, n: V3) => (p[1] < YW + 0.5 && n[2] < 0.7 ? 0.95 : p[2] > ZR && p[1] < AT.wy0 && n[1] < -0.5 ? 0.6 : 0)
  return [
    { part: stone, material: { ...finish('schinkel-sandstone', 0xa99c86), floodlight: lit } },
    { part: dark, material: { ...finish('weathered-sandstone', 0x73685a), floodlight: lit } },
    { part: roof, material: finish('lead-roof', 0xa6aaa8) },
    { part: win, material: PALETTE.window },
    { part: red, material: { ...windowRed(), floodlight: lit } },
    { part: bronze, material: finish('bronze-patina', 0x5b6d65, 0.6) },
  ] as Array<{ part: Part; material: MaterialSpec }>
}

/** The hall's Pompeian red, named as a window so the lit hall glows at night. */
function windowRed(): MaterialSpec {
  return { name: 'window-2', color: 0xbf5a43, roughness: 0.8 }
}

if (import.meta.main) {
  const extras = { landmark: 'Altes Museum', wikidata: 'Q156722' }
  writeModel('Altes Museum', ID, build(false), extras, 6500)
  writeModel('Altes Museum', ID, build(true), extras, 40000, `${ID}.detail`)
}
