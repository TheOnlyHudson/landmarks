/**
 * Fort Nashborough, Riverfront Park, Nashville: the log-fort replica on the
 * bluff at 1st Avenue North and Church Street, rebuilt in 2017 as the Fort
 * Nashborough History Center (the first replica, 1930, was rebuilt in 1962
 * and replaced). Two-storey gabled blockhouses at the river-side corners, a
 * row of shed-roofed log cabins along the river side with an open breezeway
 * in the middle, two small cabins on the street side and a short stockade
 * with the south gate.
 *
 * Frame: built along the OSM outline's long axis, bearing 333.6° (model +y
 * points NNW, +x ENE toward the river). Origin at the centroid of OSM
 * way/130910783 (historic=fort, Q5471739): -86.775364, 36.164192.
 * The model is drawn where the 2017 fort stands (y -15.5 to 32.3), not over
 * the OSM outline's south third (y -30 to -16), which is open plaza today.
 *
 * Sources
 * - OSM way/130910783 (outline, 19.6 × 59.5 m, source=Bing, traced from the
 *   pre-2017 replica) and four untagged buildings inside it (465278579,
 *   465278589, 465278599, 465278603), also from the old replica: none of them
 *   matches the 2017 plan. OSM API.
 * - USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022 flight, after the rebuild),
 *   0.5 m grid, read in this frame with tools/lidar_frame.py. Courtyard ground
 *   119.2 m NAVD88 (9.6 in the grid). Measured:
 *   - blockhouses: x 0–7.7, north y 24.7–32.3, south y -15.5–-7.5; eaves 5.1 m,
 *     ridge 7.7 m running across (x); stone chimney on the south one's west
 *     gable, top 8.5 m;
 *   - river-side cabin row: x 1.2–7.0, y -7.5–24.5; shed roof 4.6 m on the
 *     river side, 2.9 m on the courtyard side; middle bay a little higher;
 *   - street-side cabins: north x -11.3–-5.2, y 24.3–27.6, about 3.0 m with a
 *     chimney at its west end; south x -11–-4.5, y -14.5–-9.5, shed roof
 *     4.4 m on the south, 3.1 m on the north;
 *   - stockade and gate between the south cabin and the south blockhouse,
 *     about 4.5 m at the gate posts.
 *   The street (west) and north sides show nothing over 1 m: no stockade.
 * - Mapterhorn terrain (bun tools/terrain.ts grid): the site is flat to
 *   ±0.4 m; the bluff drops to the river east of x = 9.
 * - Photos (EVIDENCE):
 *   - "Fort Nashborough History Center 2022", Antony-22, CC BY-SA 4.0:
 *     https://commons.wikimedia.org/wiki/File:Fort_Nashborough_History_Center_2022.jpg
 *     (inside, looking south along the walkway: cabin row, doors and
 *     shutters, stone chimneys, south blockhouse, gate, street-side cabin)
 *   - "Nashville from Cumberland River September 2026 004" and "… 002",
 *     King of Hearts, CC BY-SA 4.0:
 *     https://commons.wikimedia.org/wiki/File:Nashville_from_Cumberland_River_September_2026_004.jpg
 *     https://commons.wikimedia.org/wiki/File:Nashville_from_Cumberland_River_September_2026_002.jpg
 *     (from over the river: the river face, both blockhouses' gables,
 *     the breezeway, grey weathered logs and dark shake roofs)
 *   - "Nashville from Cumberland River September 2026 001", King of Hearts,
 *     CC BY-SA 4.0 (the fort small, from the east, over the bluff).
 *   - "FORT NASHBOROUGH", Jerrye & Roy Klotz MD, CC BY-SA 3.0 (the old
 *     replica; used only for log and stone detail, not for the plan).
 * - Look-only (not relied on): Flickr photos under NC/ND licences, all of the
 *   pre-2017 replica.
 *
 * Numbers: plan and heights measured (lidar) as above, from the courtyard.
 * Base offset B = 1.8 m: the map puts y = 0 at the lowest ground under the
 * footprint, which is the top of the bluff at the river-side walls (x = 8);
 * terrain.ts check shows the courtyard 1.6–2.4 m above that, so every height
 * is lifted by B and the walls run down to y = 0. Doors 1.0 × 2.0 m, shutters 0.8 × 0.8 m, corner log ends 0.25 m:
 * estimated from the inside photo. Log coursing drawn as pale chinking bands
 * 0.18 m tall every 0.7 m (about four logs a storey), bolder and sparser than
 * the real ~0.35 m logs so it reads at phone size. Colours from the photos:
 * weathered grey-brown logs, pale lime chinking, dark grey shakes.
 *
 * Doubts
 * - No licensed photo from the street (west) or the north at ground level;
 *   the street-side cabins' doors and the north blockhouse's openings are
 *   placed by analogy with the photographed ones.
 * - Whether the blockhouses' upper storeys overhang can't be seen in the
 *   evidence; drawn flush.
 * - Not lit at night as far as the evidence shows: no lit materials.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const B = 1.8 // courtyard over the lowest map ground under the footprint (the bluff lip at x = 8)

const logs = new Part(), roof = new Part(), stone = new Part(), door = new Part(), chink = new Part()

/**
 * Log coursing as bold chinking lines: one pale band 0.18 m tall every 0.7 m
 * (about four logs to a storey), flush 0.03 m off the wall, stopped 0.35 m
 * short of the corner log ends and under the wall's top edge. The wall runs
 * from (ax, ay) to (bx, by) along its face; `out` is the face's outward unit
 * normal in plan; `top(t)` the wall's top height at t in 0..1 along it.
 */
function chinking(ax: number, ay: number, bx: number, by: number, out: [number, number], top: (t: number) => number) {
  const L = Math.hypot(bx - ax, by - ay), e = 0.35 / L, o = 0.03, h = 0.18
  const P = (t: number, z: number): V3 => [ax + (bx - ax) * t + out[0] * o, ay + (by - ay) * t + out[1] * o, z]
  for (let z = B + 0.55; ; z += 0.7) {
    const need = z + h + 0.12
    const ok: number[] = []
    for (let i = 0; i <= 60; i++) { const t = e + ((1 - 2 * e) * i) / 60; if (top(t) >= need) ok.push(t) }
    if (ok.length < 2) { if (z > 12) break; if (Math.max(top(0), top(0.5), top(1)) < need) break; continue }
    const t0 = ok[0], t1 = ok[ok.length - 1]
    const inside = P((t0 + t1) / 2, z); inside[0] -= out[0]; inside[1] -= out[1]
    poly(chink, [P(t0, z), P(t1, z), P(t1, z + h), P(t0, z + h)], inside)
  }
}
/** Chinking on all four walls of a rectangular house; top heights per wall. */
function chinkHouse(x0: number, x1: number, y0: number, y1: number, tops: { s: (t: number) => number; n: (t: number) => number; w: (t: number) => number; e: (t: number) => number }) {
  chinking(x0, y0, x1, y0, [0, -1], tops.s)
  chinking(x1, y1, x0, y1, [0, 1], (t) => tops.n(1 - t))
  chinking(x0, y1, x0, y0, [-1, 0], (t) => tops.w(1 - t))
  chinking(x1, y0, x1, y1, [1, 0], tops.e)
}

const avg = (ps: V3[]): V3 => [0, 1, 2].map((k) => ps.reduce((s, p) => s + p[k], 0) / ps.length) as V3
/** A convex polygon facing away from `inside`. */
function poly(p: Part, pts: V3[], inside: V3) {
  const c = avg(pts)
  const a = pts[0], b = pts[1], d = pts[2]
  const n = [(b[1] - a[1]) * (d[2] - a[2]) - (b[2] - a[2]) * (d[1] - a[1]), (b[2] - a[2]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[2] - a[2]), (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0])]
  const out = n[0] * (c[0] - inside[0]) + n[1] * (c[1] - inside[1]) + n[2] * (c[2] - inside[2]) > 0
  const q = out ? pts : [...pts].reverse()
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
/** A convex solid from a bottom ring and a top ring (same count, any order consistent). */
function solid(p: Part, bot: V3[], top: V3[], skipBottom = true) {
  const c = avg([...bot, ...top])
  const n = bot.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    poly(p, [bot[i], bot[j], top[j], top[i]], c)
  }
  poly(p, top, c)
  if (!skipBottom) poly(p, bot, c)
}
const rect = (x0: number, x1: number, y0: number, y1: number, z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  solid(p, rect(x0, x1, y0, y1, z0), rect(x0, x1, y0, y1, z1))
}
/** Log ends crossing at a corner, standing a little proud of both walls. */
function corners(x0: number, x1: number, y0: number, y1: number, z1: number) {
  const e = 0.25, w = 0.3
  for (const [x, sx] of [[x0, -1], [x1, 1]] as const)
    for (const [y, sy] of [[y0, -1], [y1, 1]] as const) {
      const xa = x + sx * e, xb = x - sx * w, ya = y + sy * e, yb = y - sy * w
      box(logs, Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb), Math.max(ya, yb), 0, z1)
    }
}
/** A flush panel (door or shutter) on a wall facing +x, -x, +y or -y. */
function panel(face: 'x+' | 'x-' | 'y+' | 'y-', at: number, u0: number, u1: number, z0: number, z1: number) {
  const o = face.endsWith('+') ? 0.055 : -0.055, w = at + o
  const pts: V3[] = face[0] === 'x' ? [[w, u0, z0], [w, u1, z0], [w, u1, z1], [w, u0, z1]] : [[u0, w, z0], [u1, w, z0], [u1, w, z1], [u0, w, z1]]
  const inside: V3 = face[0] === 'x' ? [at - o * 10, (u0 + u1) / 2, (z0 + z1) / 2] : [(u0 + u1) / 2, at - o * 10, (z0 + z1) / 2]
  poly(door, pts, inside)
}

/** A log house with a gabled roof; the ridge runs along x. */
function gabled(x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, ov = 0.45) {
  const ym = (y0 + y1) / 2
  // walls with the gable ends (x0, x1) carried up to the ridge
  const prof: [number, number][] = [[y0, 0], [y1, 0], [y1, eave], [ym, ridge], [y0, eave]]
  const inside: V3 = [(x0 + x1) / 2, ym, eave / 2]
  for (let i = 0; i < prof.length; i++) {
    const [ya, za] = prof[i], [yb, zb] = prof[(i + 1) % prof.length]
    if (za === 0 && zb === 0) continue
    if (i === 2 || i === 3) continue // roof covers the slopes
    poly(logs, [[x0, ya, za], [x1, ya, za], [x1, yb, zb], [x0, yb, zb]], inside)
  }
  poly(logs, prof.map(([y, z]) => [x0, y, z] as V3), inside)
  poly(logs, prof.map(([y, z]) => [x1, y, z] as V3), inside)
  // the roof: two slabs 0.18 m thick, overhanging
  const t = 0.18, k = (ridge - eave) / (ym - y0)
  for (const s of [-1, 1]) {
    const ye = s < 0 ? y0 - ov : y1 + ov, ze = eave - ov * k
    const lo: V3[] = [[x0 - ov, ye, ze], [x1 + ov, ye, ze], [x1 + ov, ym, ridge], [x0 - ov, ym, ridge]]
    solid(roof, lo, lo.map(([x, y, z]) => [x, y, z + t] as V3), false)
  }
  corners(x0, x1, y0, y1, eave)
  const gab = (t: number) => eave + (ridge - eave) * (1 - Math.abs(2 * t - 1)), flat = () => eave
  chinkHouse(x0, x1, y0, y1, { s: flat, n: flat, w: gab, e: gab })
}

/** A log house with a shed roof sloping across x, high on the x1 side if `highEast`. */
function shed(x0: number, x1: number, y0: number, y1: number, zLo: number, zHi: number, highEast: boolean, open = false, ov = 0.4) {
  const zx = (x: number) => (highEast ? zLo + ((zHi - zLo) * (x - x0)) / (x1 - x0) : zHi - ((zHi - zLo) * (x - x0)) / (x1 - x0))
  if (!open) solid(logs, rect(x0, x1, y0, y1, 0), [[x0, y0, zx(x0)], [x1, y0, zx(x1)], [x1, y1, zx(x1)], [x0, y1, zx(x0)]])
  const xa = x0 - ov, xb = x1 + ov, t = 0.18
  const lo: V3[] = [[xa, y0 - ov, zx(xa)], [xb, y0 - ov, zx(xb)], [xb, y1 + ov, zx(xb)], [xa, y1 + ov, zx(xa)]]
  solid(roof, lo, lo.map(([x, y, z]) => [x, y, z + t] as V3), false)
  if (!open) {
    corners(x0, x1, y0, y1, Math.min(zLo, zHi))
    const along = (t: number) => zx(x0 + (x1 - x0) * t)
    chinkHouse(x0, x1, y0, y1, { s: along, n: along, w: () => zx(x0), e: () => zx(x1) })
  }
}
/** A shed roof sloping along y instead (high on the y0 side). */
function shedY(x0: number, x1: number, y0: number, y1: number, zLo: number, zHi: number, ov = 0.4) {
  const zy = (y: number) => zHi - ((zHi - zLo) * (y - y0)) / (y1 - y0)
  solid(logs, rect(x0, x1, y0, y1, 0), [[x0, y0, zy(y0)], [x1, y0, zy(y0)], [x1, y1, zy(y1)], [x0, y1, zy(y1)]])
  const ya = y0 - ov, yb = y1 + ov, t = 0.18
  const lo: V3[] = [[x0 - ov, ya, zy(ya)], [x1 + ov, ya, zy(ya)], [x1 + ov, yb, zy(yb)], [x0 - ov, yb, zy(yb)]]
  solid(roof, lo, lo.map(([x, y, z]) => [x, y, z + t] as V3), false)
  corners(x0, x1, y0, y1, zLo)
  const along = (t: number) => zy(y0 + (y1 - y0) * t)
  chinkHouse(x0, x1, y0, y1, { s: () => zy(y0), n: () => zy(y1), w: along, e: along })
}

// Blockhouses at the river-side corners: two storeys, gables to the river and street.
for (const [y0, y1] of [[24.7, 32.3], [-15.5, -7.5]]) {
  gabled(0, 7.7, y0, y1, B + 5.1, B + 7.7)
  panel('x-', 0, (y0 + y1) / 2 - 0.55, (y0 + y1) / 2 + 0.55, B, B + 2.1) // door to the courtyard
  for (const f of ['x-', 'x+'] as const)
    for (const dy of [-1.9, 1.9]) panel(f, f === 'x-' ? 0 : 7.7, (y0 + y1) / 2 + dy - 0.4, (y0 + y1) / 2 + dy + 0.4, B + 3.3, B + 4.1)
  for (const f of ['y-', 'y+'] as const) panel(f, f === 'y-' ? y0 : y1, 3.45, 4.25, B + 3.3, B + 4.1)
}
// the south blockhouse's stone chimney on its street gable
box(stone, -1.0, 0.0, -12.3, -10.7, 0, B + 8.5)
box(stone, -1.3, 0.0, -12.6, -10.4, 0, B + 2.2)

// The river-side cabin row: shed roofs high on the river side, the breezeway open in the middle.
for (const [y0, y1] of [[-7.5, 3.5], [13.5, 24.5]]) {
  shed(1.2, 7.0, y0, y1, B + 2.9, B + 4.6, true)
  const n = 2
  for (let i = 0; i < n; i++) {
    const yc = y0 + ((i + 0.5) * (y1 - y0)) / n
    panel('x-', 1.2, yc - 1.6, yc - 0.6, B, B + 2.0)
    panel('x-', 1.2, yc + 0.6, yc + 1.4, B + 1.0, B + 1.8)
  }
}
shed(1.2, 7.0, 3.5, 13.5, B + 3.2, B + 4.9, true, true)
for (const x of [1.4, 6.8]) for (const y of [3.7, 8.5, 13.3]) {
  const zt = B + 3.2 + ((x - 1.2) / 5.8) * 1.7
  box(logs, x - 0.15, x + 0.15, y - 0.15, y + 0.15, 0, zt)
}
// stone chimney at the north cabins' courtyard side (inside photo)
box(stone, 0.4, 1.6, 21.5, 23.0, 0, B + 5.4)

// Street-side cabins.
gabled(-11.3, -5.2, 24.3, 27.6, B + 2.5, B + 3.4, 0.35)
panel('x+', -5.2, 25.4, 26.5, B, B + 2.0)
panel('y-', 24.3, -9.0, -8.2, B + 1.0, B + 1.8)
box(stone, -12.0, -11.3, 25.2, 26.7, 0, B + 4.1)
shedY(-11.0, -4.5, -14.5, -9.5, B + 3.1, B + 4.4)
panel('y+', -9.5, -7.1, -6.1, B, B + 2.0)
panel('y+', -9.5, -9.6, -8.8, B + 1.0, B + 1.8)

// The south stockade and gate, from the street cabin to the blockhouse.
const SY0 = -14.7, SY1 = -14.3
for (let x = -2.3; x < -0.05; x += 0.45) {
  // pointed palisade logs, grouped in pairs so they read
  const xa = x, xb = Math.min(x + 0.45, -0.05), xm = (xa + xb) / 2
  solid(logs, rect(xa, xb, SY0, SY1, 0), rect(xa, xb, SY0, SY1, B + 3.4))
  poly(logs, [[xa, SY0, B + 3.4], [xb, SY0, B + 3.4], [xm, SY0, B + 3.9]], [xm, -14.5, B + 3.5])
  poly(logs, [[xa, SY1, B + 3.4], [xb, SY1, B + 3.4], [xm, SY1, B + 3.9]], [xm, -14.5, B + 3.5])
}
for (const x of [-4.4, -2.5]) box(logs, x, x + 0.35, -14.75, -14.25, 0, B + 4.5)
box(logs, -4.6, -2.0, -14.7, -14.3, B + 4.1, B + 4.5)

if (import.meta.main) {
  const parts = [
    { part: logs, material: finish('weathered-log', 0x9a8b78) },
    { part: roof, material: finish('shake-roof', 0x726d66) },
    { part: stone, material: finish('chimney-stone', 0xbcb19f) },
    { part: door, material: finish('plank-door', 0x7a5c44) },
    { part: chink, material: finish('log-chinking', 0xd6cdbd) },
  ]
  const glb = writeGlb('Fort Nashborough', parts, { license: 'CC0-1.0', frame: 'Y up, -Z along bearing 333.6, +X east of it, metres; origin at the OSM outline centroid' })
  await Bun.write(new URL('../models/nash-fort-nashborough.glb', import.meta.url), glb)
  console.log(`nash-fort-nashborough.glb: ${parts.reduce((s, p) => s + p.part.triangles, 0)} triangles, ${glb.length} bytes`)
}
