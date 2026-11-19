/**
 * Duquesne Incline (1877, Samuel Diescher; restored 1963 by the Society for
 * the Preservation of the Duquesne Heights Incline) — procedural, CC0-1.0,
 * no textures. bun generators/pit-duquesne-incline.ts
 *
 * A funicular up the face of Mount Washington: two counterbalanced cars on
 * a double track carried by a steel trestle, a tall one over the lower
 * hillside, Carson Street and the railroad, a low one up the upper slope;
 * the upper station on Grandview Avenue (pale green clapboard, a gable along
 * the track, two front towers with truncated slate roofs and iron cresting,
 * a lower west wing with its gable to the observation deck) and the lower
 * station on the riverside lot (red brick, two storeys, a hipped roof with a
 * flat top, a pedimented dormer over the front, round-headed ground-floor
 * windows), with the red steel walkway beside it. The cars are drawn in
 * passing, 60 m from each station, as d1 and d12 show them: red, stepped
 * (three compartments, each floor level, on a dark wedge underframe), cream
 * window frames, dark roofs.
 *
 * This file also exports the incline helpers that pit-monongahela-incline.ts
 * imports (box, panels, roofs, footed walls, the trestle deck and bents, the
 * stepped car); its own build runs only when it is the main module.
 *
 * Frame: x across the track (+x east-south-east), y along it, downhill
 * toward the lower station (north-north-east), z up, metres. Placed at
 * bearing 29.43°, the track's line (OSM ways and lidar agree within 0.5 m
 * over its length). Anchor -80.018187, 40.439092: the midpoint of the track
 * between the stations (the incline has no single outline).
 *
 * Height. The model follows the map's terrain: every foot (trestle bents,
 * station walls, deck posts) runs down to Mapterhorn's ground under it
 * (`GROUND`, a 4 m table in this frame, metres above 224.69 m NAVD88),
 * and the whole model is then dropped so its lowest vertex, a lower-station
 * wall foot on the riverside lot, is at y = 0. Elevation 0. The terrain is
 * steep: 4.6 m at the lower station's lot, 10.4 m on Carson Street, 126 m
 * on Grandview Avenue.
 *
 * Sources:
 * - OSM: track ways way/54834750 and way/833629681 (the trestle,
 *   bridge=yes, y = +12 to +95), way/550018003 and way/833629682 (the upper
 *   slope, y = −95 to +12), route relation/6060405; stations way/1243027566
 *   (Duquesne Upper Station, x −15.3..6.4, y −109.7..−94.0) and
 *   way/43082419 (Duquesne Lower Station, x −6.4..10.4, y 92.8..106.1);
 *   wikidata Q1266663, NRHP 75001609.
 * - Lidar, USGS 3DEP PA_WesternPA_2_2019 (flown 2019), 1 m grid over the
 *   whole incline: the rail top is a straight line from 11.6 m inside the
 *   lower station (y = +95) to 121.8 m at the upper station's face
 *   (y = −94), a 30.3° grade (`T`); the deck 7 m wide, x −2.5..+4.5; its
 *   height over the ground: 1.3–6 m on the upper slope, up to 20 m over the
 *   lower hillside (y = +14..+62) and 13–17 m over Carson Street and the
 *   railroad (y = +66..+88). Upper station: ridge 133.4 m along x ≈ 0.5,
 *   eaves about 131, the west part's low roof 131, two tower tops 136.8–137.0
 *   at x ≈ −4 and +5.8, y ≈ −96; the west wing x −22..−15 at 128.1–128.8;
 *   the deck x −35..−22, y −111..−101, flat at 125.0; Grandview Avenue
 *   126.0–126.3. Lower station: flat roof top 18.1 m over x −6..+4,
 *   y 95..104, hip slopes to about 15 m at the east wall; the walkway along
 *   its east side, x 10.6..13, flat at 13.1 m, y 92..110; the lot at 4.6–5.1.
 * - Published (Wikipedia "Duquesne Incline"; NRHP nomination): opened 1877,
 *   length 794 ft (242 m), rise 400 ft (122 m), grade 30.5°, 5 ft gauge, two
 *   cars of 1877 restored, red with yellow trim.
 * - Photos (Wikimedia Commons):
 *   - d1 "2008-05-24 Pittsburgh 040 Duquesne Incline (2669552496)"
 *     (Allie_Caulfield, CC BY 2.0): the whole line from the north-east: the
 *     trestle on slender bents over the lower slope, the dark girders, both
 *     cars, the stations;
 *   - d12 "Duquesne Incline 01", d13 "Duquesne Incline 02" (An Errant
 *     Knight, CC BY-SA 4.0): the lower station from the north: brick, the
 *     hipped roof and its pedimented dormer, arched windows, the red stairs
 *     and walkway; the upper station's two towers;
 *   - d2 "Ascending the Duquesne Incline" (Dllu, CC BY-SA 4.0), d8
 *     "Duquesne Incline (3872663412)" (Christopher "Rice", CC BY-SA 2.0): the
 *     upper station face-on from the track: the two towers flanking the
 *     track opening, the car's dark underframe;
 *   - d3 "Building at top of Duquesne Incline" (APK, CC BY-SA 4.0): the west
 *     wing's gable on the deck, the green clapboard, dark green trim, the
 *     towers' truncated slate roofs and cresting;
 *   - d5 "Duquense Incline (1092013515)" (daveynin, CC BY 2.0): a car from
 *     above (dark roof, red sides, cream window frames) and the trestle;
 *   - d10 "Duquesne Incline - headed down", d11 "Duquesne Incline - headed
 *     up" (APK, CC BY-SA 4.0): the deck's dark side girders, the lower
 *     station roof.
 *
 * Estimated: bent spacing (14 m, from d1) and the columns' size; the low
 * trestle's posts (every 8 m); the deck's depth (1.1 m on the upper slope,
 * growing to 1.8 m on the trestle); the cars (8 m long in plan, 2.6 m wide,
 * three level tiers stepping down the hill on a wedge underframe, from d2,
 * d5 and d11 against the 5 ft gauge); windows and
 * doors (from d3, d12); the tower plan (3 m square, from lidar's peaks).
 * Doubts: lidar shows no bent under the deck between Carson Street and the
 * station, so the bent at y = 76 between the road and the railroad is a
 * guess; the stairs from the walkway down to the lot (d12) are left out, as
 * neither lidar nor the photos fix their run; the deck west of the upper
 * station is drawn as a slab on four posts, its supports unphotographed.
 * Colour: car red (#c0392f in sun) pulled to #b44a3e, shared with the lower
 * station's brick (#a4553f) and walkway; station green (#9fb8a2) to
 * #a9c1a7; the trestle and the cars' frames charcoal #4f5257; car window
 * frames cream-yellow (#e8cf7a) to #e9d28a; roofs the
 * palette's roof grey (the cars' roofs too: they are near-black in d5, but
 * drawn grey so the cars separate from the dark deck when seen from above,
 * as the map sees them); the track bed charcoal with pale rails drawn
 * 0.3 m wide; windows the palette's window slate (they glow at
 * night: both stations and the cars are lit after dark).
 *
 * No commercial imagery was used for this model.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { face, footedLoft, groundAt, stations, type GroundGrid } from './bridge-kit'
import { PALETTE, finish } from './palette'

export type Ground = (x: number, y: number) => number

/** One triangle, wound to face `n`. */
export function tri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
}

/** An upright box; leave out the faces not asked for. */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, f: { top?: boolean; bottom?: boolean } = {}) {
  if (f.top !== false) face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (f.bottom) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
  face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
}

/** A box whose foot follows the ground (edges split every `seg` m), up to `top`. */
export function footedBox(p: Part, ground: Ground, x0: number, x1: number, y0: number, y1: number, top: number, seg = 4, cap = true) {
  footedLoft(p, ground, [
    { plan: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z: 'ground' },
    { plan: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z: top },
  ], seg, cap)
}

/**
 * A flat convex shape on a wall: points (s, z) in the wall's plane, s along
 * `u` from `o`, set `off` metres out along the wall's normal `n`.
 */
export function wallShape(p: Part, o: V3, u: V3, n: V3, pts: [number, number][], off = 0.05) {
  const at = ([s, z]: [number, number]): V3 => [o[0] + u[0] * s + n[0] * off, o[1] + u[1] * s + n[1] * off, z]
  for (let i = 1; i < pts.length - 1; i++) {
    tri(p, at(pts[0]), at(pts[i]), at(pts[i + 1]), n)
  }
}

/** A rectangle (s0..s1, z0..z1) on a wall. */
export const rectPts = (s0: number, s1: number, z0: number, z1: number): [number, number][] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** A round-headed opening: jambs from z0 to the springing zs, a semicircle over them. */
export function archPts(sc: number, w: number, z0: number, zs: number, seg = 8): [number, number][] {
  const r = w / 2, out: [number, number][] = [[sc - r, z0], [sc + r, z0]]
  for (let i = 0; i <= seg; i++) { const a = (Math.PI * i) / seg; out.push([sc + r * Math.cos(a), zs + r * Math.sin(a)]) }
  return out
}

/** Unit vectors for the four walls of an axis-aligned block: origin corner, along-wall u, outward normal n. */
export function walls(x0: number, x1: number, y0: number, y1: number) {
  return {
    south: { o: [x0, y0, 0] as V3, u: [1, 0, 0] as V3, n: [0, -1, 0] as V3, len: x1 - x0 },
    north: { o: [x0, y1, 0] as V3, u: [1, 0, 0] as V3, n: [0, 1, 0] as V3, len: x1 - x0 },
    west: { o: [x0, y0, 0] as V3, u: [0, 1, 0] as V3, n: [-1, 0, 0] as V3, len: y1 - y0 },
    east: { o: [x1, y0, 0] as V3, u: [0, 1, 0] as V3, n: [1, 0, 0] as V3, len: y1 - y0 },
  }
}

/**
 * A gable roof over x0..x1, y0..y1: the ridge along `along` at `ridge`, the
 * eaves at `eave`, overhanging `oh`. The gable triangles go to `gable` (the
 * wall's part), the slopes to `p`.
 */
export function gableRoof(p: Part, gable: Part, x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, along: 'x' | 'y', oh = 0.4) {
  if (along === 'y') {
    const xm = (x0 + x1) / 2, ya = y0 - oh, yb = y1 + oh, xa = x0 - oh, xb = x1 + oh
    const ez = eave - (oh * (ridge - eave)) / (xm - x0)
    face(p, [xa, ya, ez], [xm, ya, ridge], [xm, yb, ridge], [xa, yb, ez], [-(ridge - eave), 0, xm - x0])
    face(p, [xb, ya, ez], [xm, ya, ridge], [xm, yb, ridge], [xb, yb, ez], [ridge - eave, 0, xm - x0])
    for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const a: V3 = [x0, y, eave], b: V3 = [x1, y, eave], c: V3 = [xm, y, ridge]
      tri(gable, a, b, c, [0, s, 0])
    }
  } else {
    const ym = (y0 + y1) / 2, xa = x0 - oh, xb = x1 + oh, ya = y0 - oh, yb = y1 + oh
    const ez = eave - (oh * (ridge - eave)) / (ym - y0)
    face(p, [xa, ya, ez], [xa, ym, ridge], [xb, ym, ridge], [xb, ya, ez], [0, -(ridge - eave), ym - y0])
    face(p, [xa, yb, ez], [xa, ym, ridge], [xb, ym, ridge], [xb, yb, ez], [0, ridge - eave, ym - y0])
    for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) {
      const a: V3 = [x, y0, eave], b: V3 = [x, y1, eave], c: V3 = [x, ym, ridge]
      tri(gable, a, b, c, [s, 0, 0])
    }
  }
}

/** A hipped roof from the eaves (with overhang `oh`) up to a flat top inset `inset` from the walls. */
export function hipRoof(p: Part, x0: number, x1: number, y0: number, y1: number, eave: number, top: number, inset: number, oh = 0.4) {
  const o: [number, number][] = [[x0 - oh, y0 - oh], [x1 + oh, y0 - oh], [x1 + oh, y1 + oh], [x0 - oh, y1 + oh]]
  const i: [number, number][] = [[x0 + inset, y0 + inset], [x1 - inset, y0 + inset], [x1 - inset, y1 - inset], [x0 + inset, y1 - inset]]
  const run = inset + oh, rise = top - eave
  const ns: V3[] = [[0, -rise, run], [rise, 0, run], [0, rise, run], [-rise, 0, run]]
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    face(p, [o[k][0], o[k][1], eave], [o[j][0], o[j][1], eave], [i[j][0], i[j][1], top], [i[k][0], i[k][1], top], ns[k])
  }
  face(p, [i[0][0], i[0][1], top], [i[1][0], i[1][1], top], [i[2][0], i[2][1], top], [i[3][0], i[3][1], top], [0, 0, 1])
  // The soffit, so the overhang isn't see-through from below.
  face(p, [o[0][0], o[0][1], eave], [o[1][0], o[1][1], eave], [o[2][0], o[2][1], eave], [o[3][0], o[3][1], eave], [0, 0, -1])
}

/** A track: the rail top `T(y)`, from `y0` (uphill end) to `y1`, centred on `xc`, `w` wide. */
export type Track = { T: (y: number) => number; y0: number; y1: number; xc: number; w: number }

/**
 * The deck of a double-track incline: two side girders (dark) from `depth(y)`
 * below the rail top to `rail` above it, a dark track bed of ties between
 * them just under the rail top, the rails as pale flat bands drawn wider
 * than they are (0.3 m) on `rails`, centred on `railX`, and a soffit. Split
 * every `step` metres.
 */
export function trackDeck(side: Part, rails: Part, railX: number[], t: Track, depth: (y: number) => number, step = 6, rail = 0.7) {
  const ys = stations(Math.min(t.y0, t.y1), Math.max(t.y0, t.y1), step)
  const xa = t.xc - t.w / 2, xb = t.xc + t.w / 2, gw = 0.35
  for (let i = 0; i < ys.length - 1; i++) {
    const ya = ys[i], yb = ys[i + 1]
    const top = (y: number) => t.T(y) + rail, bot = (y: number) => t.T(y) - depth(y), bedZ = (y: number) => t.T(y) - 0.25
    const slope = (t.T(yb) - t.T(ya)) / (yb - ya)
    for (const [x0, x1] of [[xa, xa + gw], [xb - gw, xb]]) {
      face(side, [x0, ya, bot(ya)], [x0, yb, bot(yb)], [x0, yb, top(yb)], [x0, ya, top(ya)], [-1, 0, 0])
      face(side, [x1, ya, bot(ya)], [x1, yb, bot(yb)], [x1, yb, top(yb)], [x1, ya, top(ya)], [1, 0, 0])
      face(side, [x0, ya, top(ya)], [x1, ya, top(ya)], [x1, yb, top(yb)], [x0, yb, top(yb)], [0, -slope, 1])
    }
    face(side, [xa + gw, ya, bedZ(ya)], [xb - gw, ya, bedZ(ya)], [xb - gw, yb, bedZ(yb)], [xa + gw, yb, bedZ(yb)], [0, -slope, 1])
    for (const x of railX) face(rails, [x - 0.15, ya, t.T(ya)], [x + 0.15, ya, t.T(ya)], [x + 0.15, yb, t.T(yb)], [x - 0.15, yb, t.T(yb)], [0, -slope, 1])
    face(side, [xa, ya, bot(ya)], [xb, ya, bot(ya)], [xb, yb, bot(yb)], [xa, yb, bot(yb)], [0, slope, -1])
  }
  // Close the ends.
  for (const y of [ys[0], ys[ys.length - 1]]) {
    const s = y === ys[0] ? -1 : 1
    face(side, [xa, y, t.T(y) - depth(y)], [xb, y, t.T(y) - depth(y)], [xb, y, t.T(y) + rail], [xa, y, t.T(y) + rail], [0, s, 0])
  }
}

/** A trestle bent: two square columns from the ground to `zTop`, a cap beam, and struts every `strut` m. */
export function bent(p: Part, ground: Ground, xs: [number, number], y: number, zTop: number, c = 0.8, strut = 7) {
  const g = Math.min(ground(xs[0], y), ground(xs[1], y))
  for (const x of xs) footedBox(p, ground, x - c / 2, x + c / 2, y - c / 2, y + c / 2, zTop, 4, false)
  box(p, xs[0] - c / 2, xs[1] + c / 2, y - c / 2, y + c / 2, zTop - 0.8, zTop, { top: false, bottom: true })
  for (let z = zTop - strut; z > g + 2; z -= strut) box(p, xs[0] + c / 2, xs[1] - c / 2, y - 0.25, y + 0.25, z - 0.3, z + 0.3, { top: true, bottom: true })
}

/**
 * An incline car on rail top `T`, centred at (xc, yc), as the 1877 cars are
 * built (d2, d5, d11): `tiers` compartments along the track, each level, so
 * the body steps down the hill, red sides with a cream-framed window band, a
 * roof over each tier (`top`), all on a dark wedge underframe that is tallest
 * at the downhill end. `L` is its plan length, `W` its width, `H` a tier's
 * wall height.
 */
export function car(
  parts: { body: Part; frame: Part; win: Part; trim: Part; top: Part },
  T: (y: number) => number, xc: number, yc: number,
  { L = 8, W = 2.6, tiers = 3, clear = 0.6, H = 2.6 } = {},
) {
  const { body, frame, win, trim, top } = parts
  const x0 = xc - W / 2, x1 = xc + W / 2, ya = yc - L / 2, yb = yc + L / 2, dl = L / tiers
  const floorOf = (k: number) => Math.max(T(ya + k * dl), T(ya + (k + 1) * dl)) + clear
  for (let k = 0; k < tiers; k++) {
    const y0 = ya + k * dl, y1 = y0 + dl, f = floorOf(k), r = f + H
    box(body, x0, x1, y0, y1, f, r, { top: false })
    box(top, x0 - 0.12, x1 + 0.12, y0 - 0.08, y1 + 0.08, r, r + 0.35, { top: true, bottom: true })
    for (const [x, sx] of [[x0, -1], [x1, 1]] as [number, number][]) {
      const o: V3 = [x, y0, 0], u: V3 = [0, 1, 0], n: V3 = [sx, 0, 0]
      wallShape(trim, o, u, n, rectPts(0.12, dl - 0.12, f + 0.8, f + 2.1), 0.03)
      wallShape(win, o, u, n, rectPts(0.3, dl - 0.3, f + 0.95, f + 1.95), 0.06)
    }
    for (const [y, sy, end] of [[y0, -1, k === 0], [y1, 1, k === tiers - 1]] as [number, number, boolean][]) {
      if (!end) continue
      const o: V3 = [x0, y, 0], u: V3 = [1, 0, 0], n: V3 = [0, sy, 0]
      wallShape(trim, o, u, n, rectPts(0.2, W - 0.2, f + 0.8, f + 2.1), 0.03)
      wallShape(win, o, u, n, rectPts(0.4, W - 0.4, f + 0.95, f + 1.95), 0.06)
    }
  }
  // The wedge underframe: from just over the rails up to each tier's floor.
  const rz = (y: number) => T(y) + 0.25, fx0 = x0 + 0.15, fx1 = x1 - 0.15
  for (let k = 0; k < tiers; k++) {
    const y0 = ya + k * dl, y1 = y0 + dl, f = floorOf(k)
    for (const [x, sx] of [[fx0, -1], [fx1, 1]] as [number, number][]) face(frame, [x, y0, rz(y0)], [x, y1, rz(y1)], [x, y1, f], [x, y0, f], [sx, 0, 0])
    face(frame, [fx0, y0, rz(y0)], [fx1, y0, rz(y0)], [fx1, y1, rz(y1)], [fx0, y1, rz(y1)], [0, 0, -1])
    // The riser between this tier's floor and the next one down.
    const kn = T(ya) > T(yb) ? k + 1 : k - 1
    if (kn >= 0 && kn < tiers) {
      const yr = T(ya) > T(yb) ? y1 : y0, fn = floorOf(kn), sy = T(ya) > T(yb) ? 1 : -1
      face(frame, [fx0, yr, fn], [fx1, yr, fn], [fx1, yr, f], [fx0, yr, f], [0, sy, 0])
    }
  }
  const down = T(ya) > T(yb) ? yb : ya, kD = down === yb ? tiers - 1 : 0
  face(frame, [fx0, down, rz(down)], [fx1, down, rz(down)], [fx1, down, floorOf(kD)], [fx0, down, floorOf(kD)], [0, down === yb ? 1 : -1, 0])
}

/** Drops every part so the lowest vertex is at 0 (glTF y is up). Returns the drop. */
export function settle(parts: Part[]) {
  let lo = Infinity
  for (const p of parts) for (let i = 1; i < p.pos.length; i += 3) lo = Math.min(lo, p.pos[i])
  for (const p of parts) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] -= lo
  return lo
}

/** The shared materials. */
export const MATS = {
  steel: finish('steel-charcoal', 0x4f5257),
  red: finish('incline-red', 0xb44a3e),
  green: finish('station-green', 0xa9c1a7),
  cream: finish('car-cream', 0xe9d28a),
  roof: PALETTE.roof,
  window: PALETTE.window,
} satisfies Record<string, MaterialSpec>

// ---------------------------------------------------------------------------------------------
// Duquesne Incline

const GROUND: GroundGrid = {"y0":-124.0,"x0":-40.0,"step":4.0,"z":[[125.4,125.4,125.5,125.6,125.7,125.7,125.8,125.9,126.0,126.1,126.1,126.2,126.3,126.3,126.4],[125.4,125.5,125.5,125.6,125.7,125.8,125.9,126.0,126.1,126.1,126.1,126.2,126.3,126.3,126.4],[125.3,125.3,125.5,125.6,125.7,125.8,125.9,126.0,126.1,126.1,126.2,126.2,126.2,126.4,126.4],[125.3,125.3,125.3,125.6,125.6,125.9,126.0,126.0,126.1,126.1,126.2,126.2,126.2,126.3,126.4],[125.1,125.1,125.1,125.1,125.1,125.1,125.0,126.0,126.0,126.1,126.2,126.2,126.3,126.4,126.4],[125.1,125.1,125.1,125.1,125.1,125.1,125.1,126.0,126.0,126.1,126.1,126.2,126.3,126.4,126.4],[125.1,125.1,125.1,125.1,125.0,125.0,125.0,125.9,126.0,126.1,126.1,126.2,126.3,126.4,126.4],[121.6,123.1,124.6,124.9,125.0,125.0,125.0,125.8,126.0,126.0,126.1,126.2,126.2,126.3,126.3],[120.7,120.8,121.8,123.4,123.6,123.9,124.2,124.8,124.6,124.8,125.3,125.9,126.1,126.2,126.2],[119.6,119.9,119.9,120.6,120.5,120.5,120.4,120.6,121.2,121.8,122.4,123.2,124.3,124.9,125.2],[118.6,119.2,119.1,119.2,119.0,118.7,118.4,118.1,118.8,119.4,120.2,120.7,121.2,122.0,122.5],[117.7,117.6,118.2,117.8,117.3,116.2,116.1,116.4,116.8,117.4,118.0,118.6,119.2,119.8,120.0],[116.1,116.4,116.6,116.2,115.6,114.7,114.2,114.3,114.8,115.3,116.0,116.5,117.0,117.4,117.4],[114.0,114.5,114.7,114.4,113.8,112.7,111.6,112.0,112.2,112.5,112.6,112.7,113.0,113.8,114.6],[110.6,110.8,110.4,110.2,110.3,109.6,109.3,109.0,108.6,108.6,108.4,108.7,109.2,110.0,110.6],[107.9,107.6,107.0,106.7,106.7,106.6,106.4,106.4,106.2,106.0,105.9,106.0,106.2,106.5,107.1],[105.0,104.6,104.4,104.2,104.1,104.1,104.0,103.9,103.6,103.6,103.6,103.5,103.6,103.7,103.9],[102.1,101.8,101.7,101.7,101.5,101.4,101.4,101.2,101.1,101.1,101.0,100.9,100.8,100.9,101.1],[99.5,99.0,98.9,98.8,98.7,98.6,98.6,98.4,98.3,98.2,98.1,98.0,97.8,97.8,97.8],[96.5,96.2,96.1,95.9,95.8,95.8,95.6,95.4,95.4,95.4,95.2,94.9,94.6,94.5,94.4],[93.4,93.3,93.3,93.3,93.2,93.0,92.8,92.6,92.6,92.6,92.4,92.2,91.9,91.6,91.2],[90.5,90.4,90.4,90.2,90.1,89.9,89.8,89.7,89.6,89.7,89.6,89.4,89.2,88.8,88.3],[87.6,87.6,87.6,87.5,87.3,87.2,87.1,87.1,87.0,86.9,86.9,86.7,86.4,86.1,85.6],[85.3,85.1,84.8,84.7,84.6,84.6,84.6,84.5,84.4,84.3,84.2,84.0,83.6,83.2,82.6],[82.6,82.3,82.1,82.0,82.0,82.0,82.0,82.0,81.9,81.7,81.5,81.2,80.7,80.3,79.9],[79.8,79.6,79.5,79.4,79.4,79.5,79.5,79.6,79.4,79.1,78.8,78.3,77.8,77.4,77.0],[77.6,77.5,77.5,77.5,77.6,77.7,77.8,77.8,77.6,77.2,76.7,76.2,75.7,75.3,74.9],[76.6,76.6,76.7,76.9,77.0,77.1,77.0,76.9,76.5,76.1,75.7,75.2,74.7,74.3,73.9],[75.9,76.0,76.2,76.3,76.3,76.3,76.0,75.6,75.3,75.0,74.6,74.1,73.6,73.2,72.9],[75.4,75.4,75.4,75.4,75.3,75.0,74.6,74.3,74.1,73.8,73.3,72.6,72.0,71.4,70.9],[74.0,73.9,73.8,73.6,73.4,73.0,72.5,72.2,71.9,71.6,70.9,70.0,69.0,68.4,68.0],[71.7,71.5,71.3,71.1,71.0,70.5,70.2,70.0,69.6,69.1,68.3,67.4,66.5,66.0,65.3],[69.3,69.2,69.1,68.9,68.6,68.0,67.6,67.1,66.7,66.4,65.8,65.0,64.4,63.8,63.0],[66.6,66.6,66.5,66.2,65.9,65.4,65.0,64.6,64.5,64.4,64.1,63.5,62.8,62.1,61.4],[63.6,63.6,63.6,63.4,63.1,62.8,62.5,62.2,62.3,62.3,61.9,61.3,60.5,59.5,58.6],[60.7,60.8,60.8,60.6,60.4,60.1,59.8,59.6,59.6,59.4,58.8,57.8,56.6,55.6,54.7],[58.4,58.1,57.6,57.0,56.6,56.4,56.3,56.0,55.7,55.2,54.5,53.7,52.7,51.8,50.8],[54.2,53.9,53.4,53.1,52.8,52.4,52.0,51.7,51.4,51.0,50.4,49.9,49.2,48.5,47.9],[50.1,49.6,49.1,48.6,48.1,47.6,47.2,46.9,46.6,46.3,46.0,45.5,45.1,44.6,44.1],[46.1,45.4,44.7,44.0,43.4,42.9,42.5,42.2,41.9,41.7,41.4,41.0,40.6,40.2,39.7],[42.0,41.2,40.3,39.5,38.9,38.5,38.2,37.9,37.6,37.4,37.1,36.7,36.3,35.9,35.4],[37.6,36.8,35.9,35.1,34.5,34.1,33.8,33.5,33.2,32.9,32.6,32.2,31.8,31.4,31.0],[32.9,32.1,31.3,30.6,30.1,29.7,29.3,29.0,28.7,28.5,28.2,27.9,27.5,27.1,26.7],[28.0,27.4,26.8,26.3,25.8,25.4,25.1,24.8,24.6,24.4,24.2,24.0,23.7,23.4,23.0],[23.7,23.4,23.0,22.6,22.2,21.9,21.6,21.4,21.3,21.2,21.1,21.0,20.8,20.6,20.3],[20.9,20.6,20.3,20.0,19.7,19.4,19.2,19.0,19.0,18.9,18.9,18.8,18.7,18.6,18.3],[18.6,18.3,18.0,17.7,17.4,17.0,16.7,16.6,16.6,16.6,16.6,16.5,16.4,16.3,16.2],[15.8,15.5,15.2,15.0,14.8,14.6,14.4,14.3,14.3,14.3,14.3,14.3,14.2,14.2,14.0],[13.2,13.1,13.0,12.9,12.8,12.6,12.4,12.3,12.3,12.3,12.3,12.4,12.4,12.4,12.3],[11.1,11.0,11.0,11.0,11.0,10.9,10.9,10.9,10.8,10.8,10.7,10.8,10.9,10.9,11.0],[10.3,10.3,10.3,10.3,10.3,10.3,10.3,10.3,10.3,10.3,10.2,10.2,10.4,10.5,10.6],[10.4,10.4,10.4,10.4,10.4,10.4,10.4,10.4,10.3,10.3,10.3,10.3,10.4,10.4,10.5],[10.5,10.5,10.5,10.5,10.4,10.4,10.4,10.4,10.4,10.4,10.4,10.4,10.4,10.4,10.4],[10.6,10.6,10.6,10.6,10.6,10.6,10.6,10.6,10.6,10.6,10.6,10.6,10.6,10.6,10.6],[10.5,10.5,10.5,10.4,10.4,10.4,10.4,10.4,10.4,10.4,10.5,10.5,10.5,10.6,10.6],[9.8,9.7,9.7,9.6,9.6,9.6,9.6,9.6,9.6,9.6,9.6,9.6,9.6,9.7,9.8],[7.7,7.6,7.5,7.4,7.3,7.3,7.3,7.3,7.4,7.5,7.6,7.6,7.7,7.7,7.9],[5.6,5.6,5.6,5.5,5.4,5.3,5.2,5.2,5.4,5.6,5.8,5.8,5.8,6.1,6.3],[4.6,4.6,4.6,4.7,4.7,4.7,4.8,4.9,5.0,5.0,5.1,5.1,5.2,5.3,5.3],[4.4,4.5,4.6,4.6,4.6,4.7,4.8,4.8,4.9,5.0,5.1,5.1,5.2,5.2,5.3],[4.4,4.5,4.6,4.6,4.7,4.8,4.8,4.9,4.9,5.0,5.1,5.2,5.2,5.3,5.3],[4.3,4.4,4.5,4.6,4.6,4.7,4.8,4.8,4.9,5.0,5.0,5.1,5.2,5.2,5.3],[4.1,4.3,4.4,4.5,4.6,4.7,4.8,4.8,4.9,4.9,5.0,5.0,5.1,5.1,5.1]]}
const ground: Ground = (x, y) => groundAt(GROUND, x, y)

const BEARING = 29.43
/** Rail top: lidar, a straight 30.3° line (14.15 m at y = +90, rising 0.5853 m per metre uphill). */
const T = (y: number) => 14.15 + (90 - y) * 0.5853
const XC = 1.0, W = 7.0                        // deck centre and width (lidar, x −2.5..+4.5)
const TRACK_X = [XC - 1.8, XC + 1.8]           // the two tracks
const Y_TOP = -101, Y_BOT = 99                 // the track's ends, inside the stations
const Y_TRESTLE = 12                           // the tall trestle (OSM bridge=yes) from here downhill
const STREET = 126.1                           // Grandview Avenue at the upper station (lidar)

async function build() {
  const steel = new Part(), red = new Part(), green = new Part(), cream = new Part(), roof = new Part(), win = new Part()

  // ---- Track deck, trestle -----------------------------------------------------------------------
  const railX = TRACK_X.flatMap((x) => [x - 0.76, x + 0.76])     // 5 ft gauge
  trackDeck(steel, roof, railX, { T, y0: Y_TOP, y1: Y_BOT, xc: XC, w: W }, (y) => 1.1 + 0.7 * Math.min(1, Math.max(0, y / Y_TRESTLE)), 6)
  // Tall bents over the lower hillside, Carson Street and the railroad (d1); short posts up the upper slope.
  for (const y of [18, 32, 46, 60, 76]) bent(steel, ground, [XC - W / 2 + 0.6, XC + W / 2 - 0.6], y, T(y) - 1.8, 0.8, 7)
  for (const y of stations(Y_TOP + 12, Y_TRESTLE - 2, 8)) {
    const zt = T(y) - 1.1
    if (zt - Math.min(ground(XC - 2.9, y), ground(XC + 2.9, y)) < 0.6) continue
    for (const x of [XC - W / 2 + 0.6, XC + W / 2 - 0.6]) footedBox(steel, ground, x - 0.35, x + 0.35, y - 0.35, y + 0.35, zt, 4, false)
  }

  // ---- Cars, in passing, 60 m from each station -----------------------------------------------------
  const carParts = { body: red, frame: steel, win, trim: cream, top: roof }
  car(carParts, T, TRACK_X[0], -94 + 60 + 4, { L: 8, W: 2.6 })
  car(carParts, T, TRACK_X[1], 94 - 60 - 4, { L: 8, W: 2.6 })

  // ---- Upper station (OSM x −15.3..6.4, y −109.7..−94.0) ----------------------------------------------
  {
    const x0 = -15.2, x1 = 6.3, y0 = -109.7, y1 = -94.1, eave = 130.8
    // Main block: walls from the hillside up to the eaves, split so the north foot follows the slope.
    footedBox(green, ground, x0, x1, y0, y1, eave, 3, false)
    // West part's low hipped roof; over the track, a gable along y (ridge 133.4 at the deck's centre).
    hipRoof(roof, x0, -5.6, y0, y1, eave, 131.4, 1.2, 0.3)
    gableRoof(roof, green, -5.6, x1, y0, y1, eave, 133.4, 'y', 0.4)
    // Two towers on the front, flanking the track (lidar peaks 136.8–137.0).
    for (const xt of [-4.0, 5.8]) {
      const h = 1.3, yt = -95.4, tw = 134.2
      box(green, xt - h, xt + h, yt - h, yt + h, eave - 0.5, tw, { top: false })
      // Truncated slate roof with a flat top and iron cresting.
      const r0 = h + 0.25, r1 = 0.6, z0 = tw, z1 = 136.6
      const ns: V3[] = [[0, -(z1 - z0), r0 - r1], [z1 - z0, 0, r0 - r1], [0, z1 - z0, r0 - r1], [-(z1 - z0), 0, r0 - r1]]
      const c0: [number, number][] = [[-r0, -r0], [r0, -r0], [r0, r0], [-r0, r0]], c1: [number, number][] = [[-r1, -r1], [r1, -r1], [r1, r1], [-r1, r1]]
      for (let k = 0; k < 4; k++) {
        const j = (k + 1) % 4
        face(roof, [xt + c0[k][0], yt + c0[k][1], z0], [xt + c0[j][0], yt + c0[j][1], z0], [xt + c1[j][0], yt + c1[j][1], z1], [xt + c1[k][0], yt + c1[k][1], z1], ns[k])
      }
      face(roof, [xt - r0, yt - r0, z0], [xt + r0, yt - r0, z0], [xt + r0, yt + r0, z0], [xt - r0, yt + r0, z0], [0, 0, -1])
      box(steel, xt - r1, xt + r1, yt - r1, yt + r1, z1, z1 + 0.6, { top: true })   // cresting, as a dark band
      // A window on each face of the tower.
      for (const wv of Object.values(walls(xt - h, xt + h, yt - h, yt + h))) wallShape(win, wv.o, wv.u, wv.n, archPts(wv.len / 2, 0.9, 131.6, 133.0, 6), 0.05)
    }
    // The track opening in the front, under the gable.
    const wl = walls(x0, x1, y0, y1)
    wallShape(win, wl.north.o, wl.north.u, wl.north.n, rectPts(XC - x0 - 3.4, XC - x0 + 3.4, T(-94) - 0.3, STREET + 3.6), 0.05)
    // Tall windows: north face, west part, and the east face.
    for (const s of [2.0, 4.6]) wallShape(win, wl.north.o, wl.north.u, wl.north.n, rectPts(s - 0.6, s + 0.6, STREET + 0.8, STREET + 3.4), 0.05)
    for (const s of [3.5, 7.5, 11.5]) wallShape(win, wl.east.o, wl.east.u, wl.east.n, rectPts(s - 0.6, s + 0.6, STREET + 0.8, STREET + 3.4), 0.05)
    for (const s of [2.5, 6.0, 9.5, 13.0]) wallShape(win, wl.south.o, wl.south.u, wl.south.n, rectPts(s - 0.6, s + 0.6, STREET + 0.8, STREET + 3.4), 0.05)
    // West wing, its gable on the deck (d3), eaves 127.4, ridge along x at 128.8.
    const wx0 = -22.0, wx1 = x0, wy0 = -109.0, wy1 = -97.0, we = 128.6
    footedBox(green, ground, wx0, wx1, wy0, wy1, we, 3, false)
    gableRoof(roof, green, wx0, wx1, wy0, wy1, we, 131.0, 'x', 0.4)
    const ww = walls(wx0, wx1, wy0, wy1)
    wallShape(win, ww.west.o, ww.west.u, ww.west.n, rectPts(5.0, 7.0, STREET - 1.1 + 0.05, STREET + 1.6), 0.05)   // door
    for (const s of [2.4, 9.6]) wallShape(win, ww.west.o, ww.west.u, ww.west.n, rectPts(s - 0.6, s + 0.6, STREET - 0.3, STREET + 1.9), 0.05)
    for (const s of [2.0, 5.0]) wallShape(win, ww.north.o, ww.north.u, ww.north.n, rectPts(s - 0.6, s + 0.6, STREET - 0.3, STREET + 1.9), 0.05)
    // The observation deck, west of the wing (lidar 125.0), on four posts.
    const dz = 125.0, dx0 = -35.0, dx1 = wx0, dy0 = -111.0, dy1 = -100.0
    box(roof, dx0, dx1, dy0, dy1, dz - 0.5, dz, { top: true, bottom: true })
    for (const [px, py] of [[dx0 + 1, dy0 + 1], [dx1 - 1, dy0 + 1], [dx0 + 1, dy1 - 1], [dx1 - 1, dy1 - 1]] as [number, number][])
      if (dz - 0.5 - ground(px, py) > 0.3) footedBox(steel, ground, px - 0.3, px + 0.3, py - 0.3, py + 0.3, dz - 0.5, 4, false)
    // A dark railing as a low solid band along the deck's open edges.
    box(steel, dx0, dx1, dy1 - 0.12, dy1, dz, dz + 1.1, { top: true })
    box(steel, dx0, dx0 + 0.12, dy0, dy1, dz, dz + 1.1, { top: true })
  }

  // ---- Lower station (OSM x −6.4..10.4, y 92.8..106.1) ------------------------------------------------
  {
    // Main block x −6.2..4.5 (lidar flat roof top 18.1), its hipped roof and pedimented front dormer;
    // the east wing x 4.5..10.3 under a gable along x (lidar ridge 17.3 at y ≈ 100, eaves about 14).
    const x0 = -6.2, xm = 4.5, x1 = 10.3, y0 = 93.0, y1 = 106.0, eave = 15.0, lot = 4.9
    footedBox(red, ground, x0, xm, y0, y1, eave, 3, false)
    hipRoof(roof, x0, xm, y0, y1, eave, 18.0, 2.6, 0.5)
    footedBox(red, ground, xm, x1, y0 + 0.4, y1 - 0.4, 14.0, 3, false)
    gableRoof(roof, red, xm, x1, y0 + 0.4, y1 - 0.4, 14.0, 17.3, 'x', 0.4)
    const pc = (x0 + xm) / 2, px0 = pc - 3.0, px1 = pc + 3.0, py0 = y1 - 2.4, py1 = y1
    box(red, px0, px1, py0, py1, eave - 0.2, eave + 1.5, { top: false })
    gableRoof(roof, red, px0, px1, py0, py1, eave + 1.5, eave + 3.2, 'y', 0.3)
    const pd = walls(px0, px1, py0, py1)
    wallShape(cream, pd.north.o, pd.north.u, pd.north.n, rectPts(0.5, 5.5, eave + 0.1, eave + 1.1), 0.05)   // the sign band
    const w = walls(x0, xm, y0, y1), e = walls(xm, x1, y0 + 0.4, y1 - 0.4)
    // Ground floor: round-headed windows and doors; upper floor: square windows (d12).
    for (const sc of [1.9, 5.35, 8.8]) {
      wallShape(win, w.north.o, w.north.u, w.north.n, archPts(sc, 1.9, lot + 0.6, lot + 3.6, 8), 0.05)
      wallShape(win, w.north.o, w.north.u, w.north.n, rectPts(sc - 0.7, sc + 0.7, lot + 5.6, lot + 8.0), 0.05)
    }
    for (const sc of [1.6, 4.2]) {
      wallShape(win, e.north.o, e.north.u, e.north.n, archPts(sc, 1.6, lot + 0.6, lot + 3.4, 8), 0.05)
      wallShape(win, e.north.o, e.north.u, e.north.n, rectPts(sc - 0.6, sc + 0.6, lot + 5.4, lot + 7.4), 0.05)
    }
    for (const sc of [2.5, 6.5, 10.5]) {
      wallShape(win, w.west.o, w.west.u, w.west.n, archPts(sc, 1.7, lot + 0.8, lot + 3.6, 8), 0.05)
      wallShape(win, w.west.o, w.west.u, w.west.n, rectPts(sc - 0.7, sc + 0.7, lot + 5.6, lot + 8.0), 0.05)
    }
    // The track's opening in the back (south) wall, at the upper floor.
    wallShape(win, w.south.o, w.south.u, w.south.n, rectPts(XC - W / 2 - x0, Math.min(XC + W / 2, xm - 0.3) - x0, T(y0) - 0.4, T(y0) + 3.2), 0.05)
    // The red steel stair along the east side (d12, d13): a covered flight under a flat roof
    // (lidar: x 10.6..13, flat at 13.1, y 92..110) on posts.
    const kx0 = 10.6, kx1 = 13.0, kz = 13.1
    box(red, kx0, kx1, 92.0, 110.0, kz - 0.4, kz, { top: true, bottom: true })
    for (const py of [92.6, 101.0, 109.4]) for (const px of [kx0 + 0.25, kx1 - 0.25])
      footedBox(red, ground, px - 0.18, px + 0.18, py - 0.18, py + 0.18, kz - 0.4, 4, false)
    const g0 = ground(11.8, 109) + 0.6, fz = (y: number) => g0 + ((109 - y) / 15) * (kz - 2.6 - g0)
    face(red, [kx0 + 0.3, 109, fz(109) + 0.4], [kx1 - 0.3, 109, fz(109) + 0.4], [kx1 - 0.3, 94, fz(94) + 0.4], [kx0 + 0.3, 94, fz(94) + 0.4], [0, (kz - 2.6) / 15, 1])
    for (const x of [kx0 + 0.3, kx1 - 0.3])
      face(red, [x, 109, fz(109)], [x, 94, fz(94)], [x, 94, fz(94) + 1.3], [x, 109, fz(109) + 1.3], [x < 11.8 ? -1 : 1, 0, 0])
  }

  // ---- Write --------------------------------------------------------------------------------------
  const list = [
    { part: steel, material: MATS.steel }, { part: red, material: MATS.red }, { part: green, material: MATS.green },
    { part: cream, material: MATS.cream }, { part: roof, material: MATS.roof }, { part: win, material: MATS.window },
  ]
  const drop = settle(list.map((l) => l.part))
  const tris = list.reduce((n, l) => n + l.part.triangles, 0)
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the track midpoint, on the lowest ground',
    bearing: BEARING, elevation: 0, groundDatumNAVD88: 224.69 + drop,
  }
  const glb = writeGlb('Duquesne Incline', list, extras)
  if (tris > 5000) throw new Error(`${tris} triangles, over 5000`)
  if (glb.length > 250 * 1024) throw new Error(`${glb.length} bytes, over 250 KB`)
  await Bun.write(new URL('../models/pit-duquesne-incline.glb', import.meta.url), glb)
  console.log(`pit-duquesne-incline.glb: ${tris} triangles, ${glb.length} bytes; dropped ${drop.toFixed(2)} m`)
}

if (import.meta.main) await build()
