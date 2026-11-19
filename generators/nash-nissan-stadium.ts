/**
 * Nissan Stadium, Nashville (Tennessee Titans; opened 1999 as Adelphia
 * Coliseum, HOK Sport) — procedural, CC0-1.0, no textures.
 *   bun generators/nash-nissan-stadium.ts
 *
 * The stadium as it stood in 2026, before the new enclosed stadium east of
 * it (way/1293763784, under construction; not drawn and not replaced) takes
 * over.
 *
 * Map frame: x across the field (+x the east sideline), y along it (+y the
 * north end), z up, metres. Placed at bearing 335°, the field's long axis
 * (OSM grass way/130913334, inner ring of the building=stadium relation:
 * long sides at 155.3° and 155.4°). The anchor is the area centroid of the
 * stadium outline (relation/1762289, outer way/172668024), -86.771255,
 * 36.166458. The bowl is centred on the field centre C = (-2.5, 2.5) in this
 * frame (midpoint of the eight light-tower heads in the lidar, which agrees
 * with the grass outline's centre within 0.5 m), and is drawn symmetric
 * across both of the field's axes, as the lidar shows it is.
 *
 * z = 0 is the field. Elevation: -7.5. The field is sunk below the plaza
 * round the stadium: in the 2022 lidar the open field reads 0.2-0.5 m and
 * the plaza and streets outside 7.5-8.2 m on every side (first returns on
 * open paving, not ground_min), and the photos agree: the lower bowl's back
 * row opens straight onto the street-level plaza at both ends ("LP Field
 * Nashville", Crassic) and the street-level gates sit at the club-fascia
 * level. No published section was found; the depth is a doubt within
 * about half a metre. With it the map fills the bowl to the street and
 * draws its ground there, so the navy lower bowl (2 m at the field wall to
 * 7.7-9.5 m at its back) is left to the map, as in the Cotton Bowl model;
 * the model starts at the street with the club fascia and the end-zone
 * parapet. Terrain check (bearing 335, elevation -7.5): "ok: no visible top
 * above y 0.2 m is buried more than 0.15 m (17924.3 m² checked)".
 *
 * What makes it read as itself, from the photos:
 * - two big sideline stands of three tiers: navy lower bowl (the map's,
 *   see above), a band of red club seats, and a steep navy upper deck to a 51 m rim with a red rail,
 *   wrapping round the four corners and stopping short of the end zones;
 * - the end zones low and open, only the lower bowl, with a big video board
 *   on a base block behind each (the south one "WELCOME TO NISSAN STADIUM"
 *   on its back);
 * - the eight red lattice light towers: on each sideline two upright
 *   frames on twin legs, and at each corner an angled frame, all with their
 *   light banks at 61 m — the lit tops seen across the river at night;
 * - under the upper deck its dark sloping underside on pale columns, over
 *   a pale precast concourse block; the glass main entrances with their red
 *   band at the middle of each sideline;
 * - four stacked ramp towers at the corners.
 *
 * Evidence
 * - Lidar, measured: USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 1 m
 *   grid, half 185 m, read along rays from C every 10° and on 2-6 m grids
 *   in this frame. Field wall 41.5 m from C on the sidelines, 62 m at the
 *   ends; lower bowl 2 m at the wall to 7.7 m at 66.5 m (sidelines) and
 *   9.5 m at 93 m (ends); club tier 14.5-19.7 m between 66.5 and 82.5 m on
 *   the sidelines (to 92-107 m round the corners), stopping at about 63°
 *   from the sideline axis; suite fascia 19.7-30 m; upper deck 30 m at its
 *   front to the 51 m rim, 112 m from C on the sidelines and 132 m at 40°,
 *   lower (44 m) where it ends at about 54°; light-tower heads 61 m, at
 *   (±106.5, ±32.5) and (±87.5, ±99) from C, each about 20 m long; video
 *   boards 37-38 m, 48 m wide, crown box 44-46 m; ramp towers 25-32 m.
 * - OSM: relation/1762289 (building=stadium; outer way/172668024, inner
 *   way/130913334), leisure=stadium way/58759639 (name, wikidata Q1142992),
 *   the scoreboard base blocks way/462229949 (north) and way/462229953
 *   (south), whose outlines the bases follow.
 * - NAIP (USGS, public domain): plan, the eight red towers, seat colours.
 * - Published (Wikipedia, "Nissan Stadium"): opened 1999, HOK Sport;
 *   69,143 seats; field below the surrounding grade.
 * - Photos (Wikimedia Commons), compared with renders from their sides:
 *   Quintin Soloviev, "Aerial view of Nissan Stadium (Tennessee Titans).jpg"
 *   (CC BY 4.0, from the south: the south board, the ramps, all the towers);
 *   Quintin Soloviev, "Nissan Stadium wide angle.jpg" (CC BY 4.0, over the
 *   south board: the tiers and seat colours);
 *   Antony-22, "Nissan Stadium 2022.jpg" (CC BY-SA 4.0, the west side from
 *   across the river: four towers, the entrance, the underside of the
 *   upper deck on its columns);
 *   Praneeth Thalla, "Nissan Stadium (2024).jpg" (CC0, from the north-west
 *   across the river);
 *   Kaldari, "LP Field 2009 crop.jpg" (CC0, from the north-east: the east
 *   stand, a corner ramp tower, the north board);
 *   User:Crassic, "LP Field Nashville.jpg" (CC BY-SA 4.0, inside from the
 *   north-east upper deck: tier ends, the north board, the end plaza);
 *   Alberto Cabello, "LP Field.jpg" (CC BY 2.0, inside from the east: the
 *   west stand and its four towers);
 *   Casey Fleser, "Night Settles on LP Field.jpg" (CC BY 2.0, night: the
 *   light banks lit);
 *   Quintin Soloviev, "New Nissan Stadium under construction.jpg" (CC BY
 *   4.0: a corner tower close up).
 *
 * Estimated: the setback of the concourse block under the upper deck (8 m)
 * and the height where the underside meets it (36 m), from the photos; the
 * column spacing; the glass entrances' width (50 m) and the red band
 * height; the ramp towers' five decks (from the aerial photo); the boards'
 * bottom (22 m) and their truss legs; the light towers' legs (the lidar only
 * sees the heads). Not drawn: the field (the map's), the seat-row stripes
 * and lettering, the flagpoles, the small plaza buildings.
 *
 * Night: the light banks are `neon-floodlights`, warm white; the suite
 * glass, entrances, facade windows and board screens are `window`.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const navy = new Part(), red = new Part(), precast = new Part(), dark = new Part(), win = new Part(), lights = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const face = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const ord = dot(face, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns?.map(unit)
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[ord[a]], n[ord[b]], n[ord[c]]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
/** Oriented box: centre, unit axes, half extents; `open` skips faces (0..5 = +a,-a,+b,-b,+c,-c). */
function box(p: Part, c: V3, ax: [V3, V3, V3], h: [number, number, number], open: number[] = []) {
  const P = (a: number, b: number, d: number) => add(add(add(c, mul(ax[0], a * h[0])), mul(ax[1], b * h[1])), mul(ax[2], d * h[2]))
  const faces: [number, number][] = [[0, 1], [0, -1], [1, 1], [1, -1], [2, 1], [2, -1]]
  faces.forEach(([i, sgn], f) => {
    if (open.includes(f)) return
    const o = [0, 1, 2].filter(x => x !== i)
    const corner = (a: number, b: number) => {
      const v = [0, 0, 0]
      v[i] = sgn; v[o[0]] = a; v[o[1]] = b
      return P(v[0], v[1], v[2])
    }
    quad(p, [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)], mul(ax[i], sgn))
  })
}
const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], Z: V3 = [0, 0, 1]
/** Axis-aligned box from corner ranges. */
const abox = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, open: number[] = []) =>
  box(p, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], [X, Y, Z], [(x1 - x0) / 2, (y1 - y0) / 2, (z1 - z0) / 2], open)
/** A square-section bar between two points. */
function bar(p: Part, a: V3, b: V3, w: number) {
  const f = unit(sub(b, a))
  const s = unit(Math.abs(f[2]) > 0.9 ? cross(f, X) : cross(f, Z))
  box(p, mul(add(a, b), 0.5), [f, s, unit(cross(f, s))], [Math.hypot(...sub(b, a)) / 2, w / 2, w / 2])
}

// ---------------------------------------------------------------------------
// Rings: superellipses about the field centre C (half width a, half length b).
const C: XY = [-2.5, 2.5]
type SE = { a: number; b: number; n: number }
const R0: SE = { a: 41.5, b: 62, n: 8 } // field wall
const R1: SE = { a: 67, b: 93, n: 4 } // back of the lower bowl / club fascia
const R2: SE = { a: 82.5, b: 110, n: 3 } // back of the club tier / suite fascia
const R3: SE = { a: 112, b: 132, n: 3 } // rim
const N = 96

const dirs: XY[] = (() => {
  const pts: XY[] = [], M = 4000
  const sp = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e)
  for (let i = 0; i <= M; i++) {
    const t = (i / M) * 2 * Math.PI
    pts.push([R3.a * sp(Math.cos(t), 2 / R3.n), R3.b * sp(Math.sin(t), 2 / R3.n)])
  }
  const cum = [0]
  for (let i = 1; i <= M; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const out: XY[] = []
  let j = 0
  for (let k = 0; k < N; k++) {
    const s = (k / N) * cum[M]
    while (cum[j + 1] < s) j++
    const f = (s - cum[j]) / (cum[j + 1] - cum[j] || 1)
    const x = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, y = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f
    const l = Math.hypot(x, y)
    out.push([x / l, y / l])
  }
  return out
})()
const D = (k: number) => dirs[((k % N) + N) % N]
const radius = (se: SE, k: number, off = 0) => {
  const [dx, dy] = D(k)
  return 1 / Math.pow(Math.pow(Math.abs(dx) / (se.a + off), se.n) + Math.pow(Math.abs(dy) / (se.b + off), se.n), 1 / se.n)
}
const at = (k: number, r: number, z: number): V3 => [C[0] + D(k)[0] * r, C[1] + D(k)[1] * r, z]
/** Angle from the sideline axis, degrees, 0-90. */
const fold = (k: number) => (Math.atan2(Math.abs(D(k)[1]), Math.abs(D(k)[0])) * 180) / Math.PI
const segFold = (k: number) => (fold(k) + fold(k + 1)) / 2
const table = (t: [number, number][], v: number) => {
  for (let i = 1; i < t.length; i++)
    if (v <= t[i][0]) return t[i - 1][1] + ((t[i][1] - t[i - 1][1]) * (v - t[i - 1][0])) / (t[i][0] - t[i - 1][0])
  return t[t.length - 1][1]
}

const UPPER_END = 54, CLUB_END = 63 // degrees from the sideline axis (lidar)
const hasUpper = (k: number) => segFold(k) < UPPER_END
const hasClub = (k: number) => segFold(k) < CLUB_END
const zLB = (k: number) => table([[0, 7.7], [45, 8.2], [70, 9.5], [90, 9.5]], fold(k)) // back of the lower bowl
const rim = (k: number) => table([[0, 51], [42, 51], [54, 44], [90, 44]], fold(k))
const CLUB_LO = 14.5, CLUB_HI = 19.7, SUITE_TOP = 30
const SET = 8, SOFFIT_LO = 36 // concourse block set back under the upper deck

/** A band between two rings, over the segments `on` picks, smooth round the bowl. */
function band(p: Part, lo: (k: number) => V3, hi: (k: number) => V3, face: 1 | -1 | 'up', on: (k: number) => boolean = () => true) {
  const fn = (k: number): V3 => {
    const a = lo(k), b = lo(k + 1), c = hi(k)
    let n = unit(cross(sub(b, a), sub(c, a)))
    const want: V3 = face === 'up' ? Z : mul([D(k)[0], D(k)[1], 0], face)
    if (dot(n, want) < 0) n = mul(n, -1)
    return n
  }
  for (let k = 0; k < N; k++) {
    if (!on(k)) continue
    const n0 = unit(add(fn(k - 1), fn(k))), n1 = unit(add(fn(k), fn(k + 1)))
    quad(p, [lo(k), lo(k + 1), hi(k + 1), hi(k)], fn(k), [n0, n1, n1, n0])
  }
}
const not = (f: (k: number) => boolean) => (k: number) => !f(k)

// The bowl, field outwards.
// The field and the lower bowl are the map's: with the placement's
// elevation the map fills the sunken bowl to the street and draws its ground
// there (as for the Cotton Bowl), and the lower bowl's back rows rise at
// most 2 m above the street, under the map's coarse ground grid, so the
// model starts at the club fascia and the end-zone parapet (terrain check).
// End zones: the lower bowl's back parapet and its outer wall (mostly below the street).
const endZone = not(hasClub)
band(precast, k => at(k, radius(R1, k), zLB(k)), k => at(k, radius(R1, k), zLB(k) + 1.1), -1, endZone)
band(precast, k => at(k, radius(R1, k), zLB(k) + 1.1), k => at(k, radius(R1, k, 0.8), zLB(k) + 1.1), 'up', endZone)
band(precast, k => at(k, radius(R1, k, 0.8), 0), k => at(k, radius(R1, k, 0.8), zLB(k) + 1.1), 1, endZone)
// Club tier: fascia, red seats.
band(dark, k => at(k, radius(R1, k), zLB(k)), k => at(k, radius(R1, k), CLUB_LO), -1, hasClub)
band(red, k => at(k, radius(R1, k), CLUB_LO), k => at(k, radius(R2, k), CLUB_HI), -1, hasClub)
// Where the club tier stands alone (corners past the upper deck): parapet and back wall.
const clubOnly = (k: number) => hasClub(k) && !hasUpper(k)
band(precast, k => at(k, radius(R2, k), CLUB_HI), k => at(k, radius(R2, k), CLUB_HI + 1), -1, clubOnly)
band(precast, k => at(k, radius(R2, k), CLUB_HI + 1), k => at(k, radius(R2, k, 0.8), CLUB_HI + 1), 'up', clubOnly)
band(precast, k => at(k, radius(R2, k, 0.8), 0), k => at(k, radius(R2, k, 0.8), CLUB_HI + 1), 1, clubOnly)
// Suite fascia with its glass band, the upper deck, the rim.
band(precast, k => at(k, radius(R2, k), CLUB_HI), k => at(k, radius(R2, k), SUITE_TOP), -1, hasUpper)
band(win, k => at(k, radius(R2, k, -0.05), 21.6), k => at(k, radius(R2, k, -0.05), 28.2), -1, hasUpper)
band(navy, k => at(k, radius(R2, k), SUITE_TOP), k => at(k, radius(R3, k, -1.6), rim(k) - 1), -1, hasUpper)
band(precast, k => at(k, radius(R3, k, -1.6), rim(k) - 1), k => at(k, radius(R3, k, -1.6), rim(k)), -1, hasUpper)
band(red, k => at(k, radius(R3, k, -1.6), rim(k)), k => at(k, radius(R3, k), rim(k)), 'up', hasUpper) // red rail
band(red, k => at(k, radius(R3, k), rim(k) - 1.2), k => at(k, radius(R3, k), rim(k)), 1, hasUpper)
// Under the upper deck: its dark underside down to the precast concourse block.
band(dark, k => at(k, radius(R3, k, -SET), SOFFIT_LO), k => at(k, radius(R3, k), rim(k) - 1.2), 1, hasUpper)
band(precast, k => at(k, radius(R3, k, -SET), 0), k => at(k, radius(R3, k, -SET), SOFFIT_LO), 1, hasUpper)

// End caps where a tier stops, facing away from it.
function cap(k: number, pts: XY[], away: number) {
  // pts: (r, z) round the section, a fan from the first point.
  const t: V3 = [-D(k)[1] * away, D(k)[0] * away, 0]
  const P = pts.map(([r, z]) => at(k, r, z))
  for (let i = 1; i < P.length - 1; i++) quad(precast, [P[0], P[i], P[i + 1], P[i + 1]], t)
}
for (let k = 0; k < N; k++) {
  const prev = (k - 1 + N) % N
  for (const [has, mk] of [
    [hasUpper, (kk: number): XY[] => {
      const r2 = radius(R2, kk), r3 = radius(R3, kk)
      return [[r2, 0], [r3 - SET, 0], [r3 - SET, SOFFIT_LO], [r3, rim(kk) - 1.2], [r3, rim(kk)], [r3 - 1.6, rim(kk)], [r2, SUITE_TOP], [r2, CLUB_HI]]
    }],
    [hasClub, (kk: number): XY[] => {
      const r1 = radius(R1, kk), r2 = radius(R2, kk)
      return [[r1, zLB(kk)], [r2 + 0.8, zLB(kk)], [r2 + 0.8, CLUB_HI + 1], [r2, CLUB_HI + 1], [r2, CLUB_HI], [r1, CLUB_LO]]
    }],
  ] as [(k: number) => boolean, (k: number) => XY[]][]) {
    if (has(k) && !has(prev)) cap(k, mk(k), -1)
    if (!has(k) && has(prev)) cap(k, mk(k), 1)
  }
}

// Columns under the upper deck, and the facade's window groups (three
// panels of two storeys each over the street), with the glass entrance
// and its red band at the middle of each sideline.
for (let k = 0; k < N; k++) {
  if (!hasUpper(k)) continue
  const a = at(k, radius(R3, k, -SET), 0), b = at(k + 1, radius(R3, k + 1, -SET), 0)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
  let out: V3 = [u[1], -u[0], 0]
  if (dot(out, [D(k)[0], D(k)[1], 0]) < 0) out = mul(out, -1)
  const v = (s: number, z: number): V3 => [a[0] + u[0] * s + out[0] * 0.05, a[1] + u[1] * s + out[1] * 0.05, z]
  const midY = (a[1] + b[1]) / 2 - C[1]
  if (Math.abs(midY) < 25) {
    quad(win, [v(0, 8.5), v(L, 8.5), v(L, 25.5), v(0, 25.5)], out)
    quad(red, [v(0, 11.6), v(L, 11.6), v(L, 13.4), v(0, 13.4)].map(p => add(p, mul(out, 0.05))), out)
  } else {
    // Panels pair up across two segments, a pier at every other joint.
    const m0 = k % 2 === 0 ? 1.2 : 0, m1 = k % 2 === 0 ? 0 : 1.2
    for (const [z0, z1] of [[10, 16.5], [18.5, 25], [27, 33.5]]) quad(win, [v(m0, z0), v(L - m1, z0), v(L - m1, z1), v(m0, z1)], out)
  }
  if (k % 2 === 0) {
    const r = radius(R3, k, -1.4), base = at(k, r, SOFFIT_LO - 0.5)
    const zTop = SOFFIT_LO + ((rim(k) - 1.2 - SOFFIT_LO) * (SET - 1.4)) / SET
    box(precast, [base[0], base[1], (SOFFIT_LO + zTop) / 2], [u, out, Z], [0.65, 0.65, (zTop - SOFFIT_LO) / 2 + 0.3], [5])
  }
}

// ---------------------------------------------------------------------------
// Light towers. Heads 20 m long, 6 m deep, 55-61 m, red lattice drawn as a
// solid frame with the pale light bank facing the field.
function head(c: XY, along: XY, toField: XY) {
  const a: V3 = [along[0], along[1], 0], f: V3 = [toField[0], toField[1], 0]
  const ctr: V3 = [c[0], c[1], 58]
  box(red, ctr, [a, f, Z], [10, 3, 3])
  const F = (s: number, z: number) => add(add(ctr, mul(f, 3.06)), add(mul(a, s), [0, 0, z]))
  quad(lights, [F(-9.2, -2.3), F(9.2, -2.3), F(9.2, 2.3), F(-9.2, 2.3)], f)
}
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  // Sideline towers: an upright frame on twin legs behind the rim.
  {
    const cx = C[0] + sx * 106.5, cy = C[1] + sy * 32.5
    head([cx, cy], [0, 1], [-sx, 0])
    for (const dy of [-7, 7]) {
      const top: V3 = [cx + sx * 1.5, cy + dy, 55], foot: V3 = [C[0] + sx * 114.2, cy + dy, 24]
      bar(red, foot, top, 1.5)
    }
    // Cross-bracing between the legs, above the rim.
    bar(red, [C[0] + sx * 111, cy - 7, 51.5], [C[0] + sx * 109.5, cy + 7, 55], 0.8)
    bar(red, [C[0] + sx * 111, cy + 7, 51.5], [C[0] + sx * 109.5, cy - 7, 55], 0.8)
  }
  // Corner towers: an angled frame leaning in over the rim from feet outside it.
  {
    const hx = sx * 87.5, hy = sy * 99
    const rl = Math.hypot(hx, hy), rd: XY = [hx / rl, hy / rl], tg: XY = [-rd[1], rd[0]]
    head([C[0] + hx, C[1] + hy], tg, [-rd[0], -rd[1]])
    for (const s of [-7, 7]) {
      const top: V3 = [C[0] + hx + tg[0] * s + rd[0] * 1.5, C[1] + hy + tg[1] * s + rd[1] * 1.5, 55]
      const foot: V3 = [C[0] + rd[0] * (rl + 13) + tg[0] * s * 1.3, C[1] + rd[1] * (rl + 13) + tg[1] * s * 1.3, 24]
      bar(red, foot, top, 1.5)
    }
  }
}

// ---------------------------------------------------------------------------
// End-zone video boards on their base blocks (OSM way/462229949 north,
// way/462229953 south): screen to the field, sign to the street, a crown box
// on top and four truss legs.
for (const s of [1, -1]) {
  const yF = s > 0 ? 118.5 : -114.5, yB = s > 0 ? 130 : -126.5
  const [y0, y1] = s > 0 ? [118.3, 127] : [-122.2, -112.4]
  const [x0, x1] = s > 0 ? [-36.5, 33] : [-38.2, 31.6]
  abox(precast, x0, x1, y0, y1, 0, 13.5)
  if (s > 0) abox(precast, -36.5, -28.8, 127, 133.3, 0, 13.5)
  const yl = Math.min(yF, yB), yh = Math.max(yF, yB)
  abox(dark, -27, 21, yl, yh, 22, 38)
  quad(win, [[-25, yF - s * 0.06, 23.6], [19, yF - s * 0.06, 23.6], [19, yF - s * 0.06, 36.6], [-25, yF - s * 0.06, 36.6]], [0, -s, 0])
  quad(precast, [[-25.5, yB + s * 0.06, 24], [19.5, yB + s * 0.06, 24], [19.5, yB + s * 0.06, 36.4], [-25.5, yB + s * 0.06, 36.4]], [0, s, 0])
  abox(dark, -9, 4, yl + 2, yh - 2, 38, 45.5)
  for (const lx of [-22, 16]) for (const ly of [yl + 2, yh - 2]) abox(dark, lx - 0.8, lx + 0.8, ly - 0.8, ly + 0.8, 13.5, 22, [5])
}

// ---------------------------------------------------------------------------
// Corner ramp towers: five open decks (precast slabs over a dark core).
const RAMPS: [XY, number, number, number][] = [
  // centre, angle of the long axis from +y (deg, clockwise), length, height
  [[-111, 113], 0, 64, 31],
  [[106, 113], 0, 64, 31],
  [[-108, -103], 20, 64, 30],
  [[103, -103], -20, 64, 30],
]
for (const [c, ang, len, h] of RAMPS) {
  const t = (ang * Math.PI) / 180
  const a: V3 = [Math.sin(t), Math.cos(t), 0], b: V3 = [Math.cos(t), -Math.sin(t), 0]
  box(dark, [c[0], c[1], (6 + h) / 2], [a, b, Z], [len / 2 - 2, 4.5, (h - 6) / 2], [5])
  for (const z of [12.5, 17.5, 22.5, 27, h]) box(precast, [c[0], c[1], z - 0.9], [a, b, Z], [len / 2, 6.5, 0.9])
}

// ---------------------------------------------------------------------------
// Materials (six). Titans navy and red from the daylight photos, pulled to
// the palette's lightness; the red also paints the light towers and rail.
const parts = [
  { part: navy, material: finish('titans-navy-seats', 0x4f6390) },
  { part: red, material: finish('titans-red', 0xc4544e) },
  { part: precast, material: finish('nissan-precast', 0xd9d6cf) },
  { part: dark, material: finish('nissan-underside', 0x6a7078) },
  { part: win, material: PALETTE.window },
  { part: lights, material: finish('neon-floodlights', 0xfff3d8) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Nissan Stadium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 335, osm: 'relation/1762289', height: 61,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/nash-nissan-stadium.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes`)
