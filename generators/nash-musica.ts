/**
 * Musica (2003, Alan LeQuire), the bronze dancers in the Music Row
 * roundabout, Nashville: procedural, CC0-1.0.
 * bun generators/nash-musica.ts [out.glb]
 *
 * An abstract, respectful version: nine larger-than-life dancing figures
 * drawn as plain bronze mannequins (tapered limbs, torso, head; no
 * anatomical detail) at their true size and in their real layout — a
 * woman lifted high on a man's shoulders in the middle with a gilded
 * tambourine raised, a woman in front of them leaning back with her arms
 * spread, and six dancers round them leaning outward with their arms flung
 * up — on a low mound of rough limestone.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Anchor
 * -86.7916436, 36.1520862: the middle of the group as the lidar shows it,
 * 1.0 m S and 0.5 m E of OSM node/5652196013 (Q6942466; "Musica").
 * y = 0 is the lowest ground under the base (lidar 163.2 m; the roundabout
 * island falls 0.3 m to the east). replaces: none (OSM has no building).
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022 (2022), 0.5 m grid:
 * highest return 11.2 m above the island at the group's middle (published
 * 38 ft / 11.6 m to the tambourine — thin parts are missed by the
 * scanner); rock base about 1.1 m high and 7 m across; outer figures'
 * heads 3.5–5.4 m above the rock, at 3–4.5 m from the middle, in seven
 * places round it (W, SW, S, SE, NE, N, NW).
 * Published: Wikipedia "Musica (sculpture)": 2003, Alan LeQuire, nine
 * nude figures, 38 ft (11.6 m) tall, the largest bronze figure group in
 * the US at its unveiling.
 *
 * Photos:
 *  EVIDENCE: m01 "Musica sculpture - Nashville TN.jpg", WV-Mike,
 *    CC BY-SA 4.0 (night, from the SW: the stack in the middle, the ring
 *    of dancers, the rock, the floodlighting)
 *    https://commons.wikimedia.org/wiki/File:Musica_sculpture_-_Nashville_TN.jpg
 *  LOOK-ONLY (Flickr, CC BY-NC-ND 2.0; looked at for the pose layout,
 *    not relied on for shapes): Scott Beale "Musica"
 *    https://www.flickr.com/photos/27403767@N00/2071457088 and
 *    https://www.flickr.com/photos/27403767@N00/2070663105 ; johnlamb
 *    "Musica" https://www.flickr.com/photos/50767319@N00/250387205 ;
 *    tncountryfan "Musica" https://www.flickr.com/photos/47538938@N08/4755001190
 * No commercial imagery. Only one licensed photo exists, at night: the
 * poses are generic dance poses placed where the lidar puts each figure;
 * flagged as a doubt.
 *
 * Estimated: figure heights (4.0–4.6 m, "larger than life", from the
 * lidar heads), every pose, the rock's outline. The model's top is
 * 11.2 m (the published 11.6 m includes the tambourine's rim held at
 * arm's length; the lifted figure stands a little low). Invented: the individual
 * limb angles (kept plausible and varied, not copied).
 * Night: floodlit from the ground (m01) — `floodlight` on the bronze.
 */
import { Part, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { finishGlb, writeModel } from './sea-tacoma-union-station'
import { quadO } from './nash-tennessee-state-capitol'

// finishGlb is typed for Swatch; writeGlb reads the floodlight function off the same object.
const fl = (s: Swatch, f: (p: V3, n: V3) => number): Swatch => ({ ...s, floodlight: f }) as Swatch


const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const nrm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** A tapered round tube from a (radius r0) to b (radius r1), smooth sided, capped at both ends. */
function tube(p: Part, a: V3, b: V3, r0: number, r1: number, n = 6, flat = 1) {
  const ax = nrm([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = nrm(crs(ax, ref)), v = crs(ax, u)
  const ring = (c: V3, r: number) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2, d = add(mul(u, Math.cos(t) * r), mul(v, Math.sin(t) * r * flat))
    return { p: add(c, d), n: nrm(add(mul(u, Math.cos(t)), mul(v, Math.sin(t) / flat))) }
  })
  const A = ring(a, r0), B = ring(b, r1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.tri(A[i].p, A[j].p, B[j].p, undefined, undefined, undefined, [A[i].n, A[j].n, B[j].n])
    p.tri(A[i].p, B[j].p, B[i].p, undefined, undefined, undefined, [A[i].n, B[j].n, B[i].n])
  }
  for (let i = 1; i < n - 1; i++) {
    p.tri(B[0].p, B[i].p, B[i + 1].p, undefined, undefined, undefined, [ax, ax, ax])
    const m = mul(ax, -1)
    p.tri(A[0].p, A[i + 1].p, A[i].p, undefined, undefined, undefined, [m, m, m])
  }
}
/** A small round head. */
function head(p: Part, c: V3, r: number) {
  const prof: [number, number][] = [[0.0, -1], [0.7, -0.7], [1, 0], [0.7, 0.7], [0.0, 1]]
  const n = 8
  for (let k = 0; k + 1 < prof.length; k++) {
    for (let i = 0; i < n; i++) {
      const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI
      const P = (q: [number, number], t: number): V3 => [c[0] + r * q[0] * Math.cos(t), c[1] + r * q[0] * Math.sin(t), c[2] + r * 1.15 * q[1]]
      const N = (q: [number, number], t: number): V3 => nrm([q[0] * Math.cos(t), q[0] * Math.sin(t), q[1]])
      const a = prof[k], b = prof[k + 1]
      if (a[0] > 0) p.tri(P(a, t0), P(a, t1), P(b, t1), undefined, undefined, undefined, [N(a, t0), N(a, t1), N(b, t1)])
      if (b[0] > 0) p.tri(P(a, t0), P(b, t1), P(b, t0), undefined, undefined, undefined, [N(a, t0), N(b, t1), N(b, t0)])
    }
  }
}

type Pose = {
  foot: V3 // between the feet
  H: number // height to the top of the head
  out: [number, number] // facing (unit, in plan)
  lean: number // forward/outward lean, radians
  arms: [V3, V3] // left, right arm directions in (side, forward, up)
  legs?: [V3, V3] // left, right foot offsets in (side, forward, up), × H
}
/** A dancer as a bronze mannequin; returns the hand positions. */
function figure(p: Part, f: Pose): [V3, V3] {
  const fw: V3 = [f.out[0], f.out[1], 0], sd: V3 = [f.out[1], -f.out[0], 0]
  const up = nrm(add([0, 0, Math.cos(f.lean)], mul(fw, Math.sin(f.lean))))
  const fwd = nrm(crs(sd, up))
  const at = (s: number, q: number, u: number): V3 => add(f.foot, add(mul(sd, s * f.H), add(mul(fwd, q * f.H), mul(up, u * f.H))))
  const H = f.H
  const hip = at(0, 0, 0.5), chest = at(0, 0, 0.8)
  // legs
  const legs = f.legs ?? [[-0.09, 0, 0], [0.09, 0, 0]]
  for (const [k, L] of legs.entries()) {
    const s = k === 0 ? -0.06 : 0.06
    tube(p, at(s, 0, 0.5), at(L[0], L[1], L[2] + 0.02), 0.048 * H, 0.026 * H, 6)
  }
  // torso (flattened), neck and head
  tube(p, hip, chest, 0.066 * H, 0.085 * H, 8, 0.62)
  tube(p, chest, at(0, 0, 0.87), 0.03 * H, 0.028 * H, 5)
  head(p, at(0, 0.01, 0.92), 0.055 * H)
  // arms
  const hands: V3[] = []
  for (const [k, d] of f.arms.entries()) {
    const s = k === 0 ? -1 : 1
    const sh = at(s * 0.1, 0, 0.8)
    const dir = nrm(add(mul(sd, d[0]), add(mul(fwd, d[1]), mul(up, d[2]))))
    const hand = add(sh, mul(dir, 0.42 * H))
    tube(p, sh, hand, 0.032 * H, 0.02 * H, 5)
    hands.push(hand)
  }
  return hands as [V3, V3]
}

/** The rough limestone base: an irregular low mound, split for the terrain. */
function rock(p: Part) {
  const R = [3.6, 3.2, 3.9, 3.4, 3.7, 3.0, 3.5, 3.8, 3.3, 3.6, 3.1, 3.7]
  const n = R.length
  const ring = (k: number, z: number, j = 0): V3 => {
    const t = ((k % n) / n) * 2 * Math.PI + 0.13
    const r = R[(k + j) % n] * (z < 0.1 ? 1 : z < 0.8 ? 0.86 : 0.55)
    return [r * Math.cos(t), r * Math.sin(t), z + (z > 1 ? ((k * 7) % 3) * 0.08 : 0)]
  }
  for (let k = 0; k < n; k++) {
    const levels: V3[][] = [[ring(k, 0), ring(k + 1, 0)], [ring(k, 0.7), ring(k + 1, 0.7)], [ring(k, 1.1), ring(k + 1, 1.1)]]
    for (let l = 0; l < 2; l++) {
      const [a, b] = levels[l], [d, c] = levels[l + 1]
      const m: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.6]
      quadO(p, a, b, c, d, m)
    }
    const [d, c] = levels[2]
    p.tri(d, c, [0, 0, 1.25])
  }
}

function build() {
  const bronze = new Part(), stone = new Part(), gold = new Part()
  rock(stone)
  const ROCK = 1.1
  // the lifter, square in the middle, arms up under the dancer above
  figure(bronze, { foot: [0.1, -0.1, ROCK], H: 4.6, out: [0.6, -0.8], lean: 0.05, arms: [[-0.35, 0.15, 1], [0.35, 0.15, 1]] })
  // the lifted dancer on his shoulders, tambourine raised high
  const top = figure(bronze, { foot: [0.15, -0.1, 5.6], H: 4.6, out: [0.6, -0.8], lean: -0.06, arms: [[-0.45, 0.1, 1], [0.3, 0.05, 1]], legs: [[-0.12, 0.05, 0.02], [0.12, 0.08, 0.06]] })
  const tm = top[1]
  tube(gold, add(tm, [0, 0, 0.05]), add(tm, [0.0, 0.0, 0.1]), 0.32, 0.32, 10)
  tube(gold, add(tm, [0, 0, -0.08]), add(tm, [0.0, 0.0, 0.05]), 0.33, 0.33, 10)
  // the ring of seven dancers, leaning out with arms flung up
  const ring: [number, number, number, number, [V3, V3], ([V3, V3] | undefined)][] = [
    // angle (deg from east, ccw), radius of the feet, height, outward lean, arms (side, fwd, up), feet (side, fwd, up) × H
    [180, 3.0, 4.3, 0.55, [[-0.9, 0.5, 0.35], [0.8, 0.6, 0.45]], [[-0.14, -0.1, 0], [0.12, -0.42, 0.22]]],
    [232, 3.0, 4.2, 0.38, [[-0.6, 0.3, 0.8], [1.0, 0.2, 0.35]], [[-0.16, 0.1, 0], [0.16, -0.18, 0]]],
    [278, 3.2, 4.1, 0.48, [[-1.0, 0.2, 0.3], [0.6, 0.3, 0.8]], [[-0.13, 0.08, 0], [0.12, -0.38, 0.25]]],
    [330, 3.1, 4.4, 0.42, [[-0.5, 0.6, 0.7], [0.9, 0.3, 0.5]], [[-0.15, 0.12, 0], [0.15, -0.15, 0]]],
    [32, 3.0, 4.2, 0.5, [[-0.9, 0.3, 0.5], [0.35, 0.4, 0.9]], [[-0.12, 0.06, 0], [0.16, -0.4, 0.28]]],
    [88, 3.1, 4.1, 0.4, [[-0.7, 0.5, 0.6], [1.0, 0.25, 0.25]], [[-0.16, 0.1, 0], [0.14, -0.2, 0]]],
  ]
  for (const [deg, r, H, lean, arms, legs] of ring) {
    const t = (deg * Math.PI) / 180, o: [number, number] = [Math.cos(t), Math.sin(t)]
    figure(bronze, { foot: [o[0] * r, o[1] * r, 0.5], H, out: o, lean, arms, legs })
  }
  // the woman at the front of the stack, leaning back, arms spread wide
  figure(bronze, { foot: [-0.6, -1.3, ROCK], H: 4.4, out: [-0.45, -0.9], lean: -0.22, arms: [[-1.0, 0.2, 0.45], [1.0, 0.2, 0.5]], legs: [[-0.13, 0.1, 0], [0.13, -0.05, 0]] })
  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : 1)
  return finishGlb('Musica', [
    { part: bronze, material: fl(finish('musica-bronze', 0x6e6650, 0.5), lit) },
    { part: stone, material: finish('musica-limestone', 0xc4bcaa) },
    { part: gold, material: fl(finish('musica-gilt', 0xc9a54a, 0.4), lit) },
  ], { bearing: 0, height: 11.6, replaces: [] }, 5000)
}

if (import.meta.main) await writeModel('nash-musica', build())
