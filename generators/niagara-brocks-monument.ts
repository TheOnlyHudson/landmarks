/**
 * Brock's Monument, Queenston Heights, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-brocks-monument.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the pedestal is
 * square to the compass in OSM). The origin is the centroid of OSM's
 * outline way/363598111 (11.3 m square); the column part way/232287277
 * (5 m round) sits within 1.5 m of it and the model centres the column on
 * the outline.
 *
 * The 1853-56 monument (William Thomas, architect) to Sir Isaac Brock: a
 * stepped stone base with a door, sitting lions at the corners of its top,
 * a square die with sunk panels and reliefs, a fluted Roman Composite
 * column with an internal stair, a decorated capital carrying a small
 * round lookout drum with oval openings, and a statue of Brock on top.
 *
 * Published: 56 m (185 ft) to the top of the statue (Wikipedia, Parks
 * Canada); the statue about 4.9 m (16 ft) in the round, drawn here 2.9 m
 * tall standing, its plinth included in the drum's dome.
 *
 * From photos, scaled to the published 56 m from Mmcintyre's frontal
 * view (0.083 m/px), cross-checked on Mhsheikholeslami's night view:
 * - base: plinth and steps 0-1.4, block 1.4-8.2, cornice 8.2-9.0; the door
 *   on the east face at the ground, where the straight path (OSM
 *   way/158454937) comes in from the east;
 * - lion stage 9.0-12.0 (half 4.4), the lions on the base cornice's
 *   corners, about 2.8 m tall, sitting, facing out;
 * - die 12.0-20.8 (half 3.5), sunk panels framed by a raised border,
 *   cornice to 21.4;
 * - column base and ornamented torus 21.4-23.4; shaft 23.4-47.1, 4.0 m
 *   across at the foot and 3.3 m under the capital, 16 flutes;
 * - capital 47.1-50.8 with corner volutes and a square abacus; lookout
 *   drum 50.8-52.2, its oval openings; dome to 53.0; statue to 56.0.
 * Colour: the buff Queenston sandstone (#c9b89e in daylight, the base a
 *   greyer #b3a998), pulled to the palette's lightness.
 *
 * Estimated: the reliefs (left as plain sunk panels), the lions' and the
 * statue's shapes (bold blocks), the statue's facing (east, the right arm
 * raised toward the south-east as in both photos taken from the path),
 * the opening count in the drum (4). Left out: the terrace walls, the
 * paths and the four warrior statues on posts at the terrace corners
 * (separate, 12-15 m out), the cannon and the inscriptions.
 *
 * Night: the whole monument is floodlit (night photo); the openings in the
 * drum are `window`.
 *
 * Terrain (Mapterhorn): within 0.4 m over the 12 m footprint; no lidar on
 * the Ontario side here.
 *
 * Photos (Wikimedia Commons):
 * - "Brock's Monument at Queenston Heights, Ontario.JPG", Mmcintyre, CC BY-SA 3.0 (east front, proportions)
 * - "Brock's Monument in 2010, Queenston, Ontario.jpg", A.Roz, CC BY-SA 3.0 (die, fluting, capital)
 * - "Brock's Monument- Queenston Heights-Niagara-on-the-Lake-Ontario- HPC7677-20220317.jpg", Mhsheikholeslami, CC BY-SA 4.0 (night; lions, stages)
 * Look-only: none.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const D2R = Math.PI / 180
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

const stone = new Part() // column, die, capital, statue, lions
const base = new Part()  // the greyer lower block
const door = new Part()
const win = new Part()   // the drum's openings

/** A quad whose winding is chosen so it faces along its normals. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/** Surface of revolution from [r, z] (bottom to top), smooth below `smooth` degrees. */
function lathe(p: Part, profile: [number, number][], k: number, smooth = 40, cx = 0, cy = 0) {
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos(smooth * D2R)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], other = bandN[b + (end ? 1 : -1)]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  const o: V3 = [cx, cy, 0]
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const aa = (s / k) * TAU, ab = ((s + 1) / k) * TAU
      const q = [P(r0, aa, z0), P(r0, ab, z0), P(r1, ab, z1), P(r1, aa, z1)].map((v) => add(v, o))
      const nn = [N(n0, aa), N(n0, ab), N(n1, ab), N(n1, aa)]
      if (r0 === 0) p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(p, q, nn)
    }
  }
}

/**
 * A box with chamfered vertical corners and a chamfered top edge, centred
 * on (cx, cy), turned `rot` radians counter-clockwise.
 */
function bbox(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, c = 0.3, rot = 0) {
  const cs = Math.cos(rot), sn = Math.sin(rot)
  const ring = (z: number, i: number): V3[] => {
    const ax = hx - i, ay = hy - i, k = Math.min(c, ax * 0.45, ay * 0.45)
    const pts: [number, number][] = [[ax - k, -ay], [ax, -ay + k], [ax, ay - k], [ax - k, ay], [-ax + k, ay], [-ax, ay - k], [-ax, -ay + k], [-ax + k, -ay]]
    return pts.map(([x, y]) => [cx + x * cs - y * sn, cy + x * sn + y * cs, z])
  }
  const t = Math.min(c, (z1 - z0) * 0.4)
  const rings = [ring(z0, 0), ring(z1 - t, 0), ring(z1, t)]
  p.loft(rings)
  p.cap(rings[2], true)
  if (z0 > 0.01) p.cap(rings[0], false)
}

/** A box between two points in plan and height: a limb, from a to b, w wide and d deep. */
function limb(p: Part, a: V3, b: V3, w: number, d: number) {
  const ax = unit(sub(b, a))
  const side = unit(Math.abs(ax[2]) > 0.9 ? cross(ax, [1, 0, 0]) : cross(ax, [0, 0, 1]))
  const up = unit(cross(side, ax))
  const corner = (o: V3, u: number, v: number): V3 => add(add(o, mul(side, u * w / 2)), mul(up, v * d / 2))
  const r0 = [corner(a, 1, -1), corner(a, 1, 1), corner(a, -1, 1), corner(a, -1, -1)]
  const r1 = [corner(b, 1, -1), corner(b, 1, 1), corner(b, -1, 1), corner(b, -1, -1)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const n = unit(add(sub(r0[i], a), sub(r0[j], a)))
    face(p, [r0[i], r0[j], r1[j], r1[i]], [n, n, n, n])
  }
  face(p, [r0[0], r0[1], r0[2], r0[3]], [mul(ax, -1), mul(ax, -1), mul(ax, -1), mul(ax, -1)])
  face(p, [r1[0], r1[1], r1[2], r1[3]], [ax, ax, ax, ax])
}

// ------------------------------------------------------------------ base ---
bbox(base, 0, 0, 5.7, 5.7, 0, 1.4, 0.25)        // plinth and steps
bbox(base, 0, 0, 5.4, 5.4, 1.4, 8.2, 0.3)       // the block
bbox(base, 0, 0, 5.4, 5.4, 4.6, 4.9, 0.1)       // a string course
bbox(base, 0, 0, 5.47, 5.47, 4.6, 4.85, 0.1)
bbox(stone, 0, 0, 5.75, 5.75, 8.2, 9.0, 0.35)   // cornice

// The east door at the ground, in a pale surround, where the path comes in.
{
  const x = 5.7
  bbox(stone, x + 0.05, 0, 0.2, 1.45, 0, 3.3, 0.1)
  const q: V3[] = [[x + 0.27, -0.9, 0.05], [x + 0.27, 0.9, 0.05], [x + 0.27, 0.9, 2.75], [x + 0.27, -0.9, 2.75]]
  face(door, q, q.map(() => [1, 0, 0] as V3))
}

// -------------------------------------------------------------- lions ---
/** A sitting lion facing `dir` (radians, ccw from east), its feet at z. */
function lion(cx: number, cy: number, z: number, dir: number) {
  const u: V3 = [Math.cos(dir), Math.sin(dir), 0], w: V3 = [-Math.sin(dir), Math.cos(dir), 0]
  const at = (a: number, b: number, h: number): V3 => add(add(add([cx, cy, z], mul(u, a)), mul(w, b)), [0, 0, h])
  const S = 1.35 // the lions stand about 2.8 m with their slab (photo)
  const blk = (a0: number, a1: number, hw: number, h0: number, h1: number) => {
    const c = at((S * (a0 + a1)) / 2, 0, 0)
    bbox(stone, c[0], c[1], (S * (a1 - a0)) / 2, S * hw, z + S * h0, z + S * h1, 0.15, dir)
  }
  blk(-0.9, 0.9, 0.55, 0, 0.3)   // its slab
  blk(-0.75, 0.15, 0.48, 0.3, 1.05) // haunches
  blk(-0.2, 0.45, 0.42, 0.3, 1.6) // chest
  blk(0.4, 0.8, 0.36, 0.3, 0.75)  // forepaws
  blk(-0.05, 0.6, 0.52, 1.25, 2.05) // mane
  blk(0.45, 0.95, 0.3, 1.35, 1.95) // muzzle
}
for (const sx of [1, -1]) for (const sy of [1, -1]) lion(sx * 4.7, sy * 4.7, 9.0, Math.atan2(sy, sx))

// ------------------------------------------------------- stage and die ---
bbox(stone, 0, 0, 4.4, 4.4, 9.0, 11.6, 0.3)
bbox(stone, 0, 0, 4.6, 4.6, 11.4, 12.0, 0.25)   // its capping
bbox(stone, 0, 0, 3.85, 3.85, 12.0, 12.7, 0.3)  // the die's base moulding
bbox(stone, 0, 0, 3.5, 3.5, 12.7, 20.0, 0.25)   // the die
// Raised borders framing the sunk panels on each face.
for (let s = 0; s < 4; s++) {
  const r = (s * Math.PI) / 2, cs = Math.cos(r), sn = Math.sin(r)
  const put = (a: number, b: number, ha: number, hb: number, z0: number, z1: number) =>
    bbox(stone, a * cs - b * sn, a * sn + b * cs, ha, hb, z0, z1, 0.06, r)
  put(3.5, 2.75, 0.14, 0.28, 13.6, 19.2)
  put(3.5, -2.75, 0.14, 0.28, 13.6, 19.2)
  put(3.5, 0, 0.14, 3.03, 13.6, 14.1)
  put(3.5, 0, 0.14, 3.03, 18.7, 19.2)
  put(3.5, 0, 0.08, 0.6, 15.6, 17.4) // the relief's boss
}
bbox(stone, 0, 0, 3.6, 3.6, 20.0, 20.8, 0.1)    // frieze
bbox(stone, 0, 0, 3.9, 3.9, 20.8, 21.4, 0.3)    // cornice

// ------------------------------------------------------------- column ---
bbox(stone, 0, 0, 2.9, 2.9, 21.4, 22.0, 0.25)   // the column's square plinth
lathe(stone, [[2.6, 22.0], [2.62, 22.5], [2.45, 22.9], [2.15, 23.1], [2.25, 23.4], [2.0, 23.45]], 16, 60)
// The fluted shaft: 16 concave flutes, faceted so they read as stripes of shade.
{
  const N = 16, z0 = 23.4, z1 = 47.1
  const R = (z: number) => 2.0 - 0.35 * Math.pow((z - z0) / (z1 - z0), 1.3)
  const ring = (z: number): V3[] => {
    const r = R(z), out: V3[] = []
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU, h = TAU / N
      out.push(P(r, a, z), P(r - 0.12, a + h * 0.25, z), P(r - 0.16, a + h * 0.5, z), P(r - 0.12, a + h * 0.75, z))
    }
    return out
  }
  stone.loft([z0, 31, 39, z1].map(ring))
}
lathe(stone, [[1.65, 47.1], [1.88, 47.2], [1.88, 47.5], [1.72, 47.6]], 16, 60) // astragal

// ------------------------------------------------------------ capital ---
// The bell, with two rows of acanthus lobes as a scalloped flare.
{
  const K = 16
  const rows: [number, number, number][] = [[1.7, 47.6, 0], [1.95, 48.4, 0.25], [2.05, 48.8, 0], [2.25, 49.6, 0.3], [2.3, 50.1, 0]]
  // The upper row's lobes stand between the lower row's, as acanthus does.
  stone.loft(rows.map(([r, z, lobe], k) => Array.from({ length: K }, (_, i) => P(r + ((i + (k > 2 ? 1 : 0)) % 2 ? 0 : lobe), (i / K) * TAU, z))))
}
// Corner volutes under the abacus's corners.
for (let s = 0; s < 4; s++) {
  const a = (s + 0.5) * (Math.PI / 2)
  bbox(stone, 2.45 * Math.cos(a), 2.45 * Math.sin(a), 0.65, 0.42, 49.0, 50.2, 0.15, a)
}
// The abacus: concave sides between the corners the volutes carry.
{
  const ring = (z: number, g: number): V3[] => {
    const out: V3[] = []
    for (let s = 0; s < 4; s++) {
      const a = (s + 0.5) * (Math.PI / 2)
      out.push(P(3.25 - g, a - 0.17, z), P(3.25 - g, a + 0.17, z), P(2.35 - g, a + Math.PI / 4, z))
    }
    return out
  }
  const rings = [ring(50.1, 0.3), ring(50.25, 0), ring(50.7, 0), ring(50.85, 0.25)]
  stone.loft(rings)
  const top = rings[3]
  for (let i = 0; i < top.length; i++) stone.tri([0, 0, 50.85], top[i], top[(i + 1) % top.length])
  const bot = rings[0]
  for (let i = 0; i < bot.length; i++) stone.tri([0, 0, 50.1], bot[(i + 1) % bot.length], bot[i])
}

// --------------------------------------------- lookout drum and statue ---
lathe(stone, [[1.75, 50.85], [1.75, 51.0], [1.5, 51.05], [1.5, 52.2], [1.62, 52.25], [1.62, 52.4], [1.3, 52.7], [0.8, 52.95], [0.55, 53.0], [0, 53.0]], 16, 35)
// Four oval openings, flat in the drum's face.
for (let s = 0; s < 4; s++) {
  const a = s * (Math.PI / 2) + Math.PI / 4
  const ctr = 51.6, ra = 0.42, rz = 0.45, K = 10
  const rim = Array.from({ length: K }, (_, i) => {
    const t = (i / K) * TAU
    const aa = a + (Math.cos(t) * ra) / 1.5
    return P(1.53, aa, ctr + Math.sin(t) * rz)
  })
  const c = P(1.53, a, ctr), n: V3 = [Math.cos(a), Math.sin(a), 0]
  for (let i = 0; i < K; i++) {
    const q = [c, rim[i], rim[(i + 1) % K]]
    const f = cross(sub(q[1], q[0]), sub(q[2], q[0]))
    if (dot(f, n) >= 0) win.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n, n, n])
    else win.tri(q[0], q[2], q[1], undefined, undefined, undefined, [n, n, n])
  }
}
// Brock, facing east, his right arm raised toward the south-east.
{
  const z = 53.0
  bbox(stone, 0, 0, 0.45, 0.45, z - 0.1, z + 0.25, 0.08)  // his footing
  bbox(stone, 0, 0, 0.26, 0.36, z + 0.25, z + 1.45, 0.1)  // legs and coat skirts
  bbox(stone, 0, 0, 0.3, 0.42, z + 1.35, z + 2.35, 0.12)  // body
  bbox(stone, -0.22, 0, 0.18, 0.5, z + 0.6, z + 2.3, 0.1) // cloak behind
  bbox(stone, 0.02, 0, 0.17, 0.17, z + 2.35, z + 2.85, 0.07) // head
  bbox(stone, 0.0, 0, 0.22, 0.24, z + 2.72, z + 2.95, 0.06)  // hat
  limb(stone, [0.05, -0.42, z + 2.2], [0.55, -0.85, z + 3.15], 0.24, 0.24) // the raised right arm
  limb(stone, [0.05, 0.42, z + 2.2], [0.15, 0.5, z + 1.4], 0.22, 0.22)     // left arm
}

// ---------------------------------------------------------------- output ---
const lit = (_p: V3, n: V3): number => (n[2] > 0.7 ? 0.35 : 0.9)
const parts = [
  { part: stone, material: { ...finish('brock-sandstone', 0xdcc6a6), floodlight: lit } },
  { part: base, material: { ...finish('brock-base-stone', 0xd4c8b4), floodlight: lit } },
  { part: door, material: finish('brock-door', 0x7a6552) },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Brock's Monument", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 56,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/niagara-brocks-monument.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
