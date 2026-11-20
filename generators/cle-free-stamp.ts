/**
 * Free Stamp (Claes Oldenburg and Coosje van Bruggen, 1982-85, installed
 * 1991), Willard Park, Cleveland: a giant red rubber stamp lying on its
 * side, its face reading FREE in mirror image, as a stamp's would. Original
 * procedural geometry, CC0-1.0.
 * bun generators/cle-free-stamp.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = OSM node/1122411825 (tourism=artwork, "Free Stamp"),
 * 41.5054338,-81.6924505; OSM maps no building, so `replaces` is empty.
 * Catalog bearing 347: the model's +y runs from the stamp face toward the
 * end of the handle (lidar axis), so the face looks to 167° (south-south-
 * east, toward Lakeside Avenue and E 9th St).
 *
 * Identity, in order: the red block standing on one corner, its face tipped
 * up and turned in its own plane; the grey stamp face with the huge raised
 * pink letters FREE, mirrored, stacked up the long side (F at the bottom);
 * the bulbous red handle lying on the lawn behind it, with the round knob
 * at the block and the waist before the wide, low grip.
 *
 * Evidence:
 *  - dimensions, published: 28 ft 10 in (8.79 m) high, 26 ft (7.9 m) wide,
 *    49 ft (15 m) long (Wikipedia, "Willard Park, Cleveland", citing the
 *    Smithsonian inventory).
 *  - pose and plan, measured: USGS 3DEP lidar OH_Statewide_Phase1_1_2019
 *    (2019), 0.5 m grid read in this frame (lidar_frame.py, bearing 347).
 *    Block top 8.55 m at its high (west) corner falling to 6.75 m at the
 *    east corner 5.7 m away: an in-plane turn of 18°; the face spreads over
 *    2.2 m in plan from its top edge to its foot: tipped back about 18°;
 *    plan width 7.8 m (published 7.9). The handle runs along +y on the axis
 *    x = -0.6 to y = +6; its knob top 4.5 m at the block, the waist 3.6 m,
 *    the grip 4.3 m high and 6 m wide (it is sunk into the lawn).
 *  - face 7.5 × 5.8 m, turned 19° in its plane and tipped back 16°: fitted
 *    to the lidar corners (front top-west corner 8.55 m, bottom-west
 *    corner ~2 m up, the foot corner on the lawn) and the published height
 *    and width (the model: 8.63 m high, 7.8 m wide). The photos give the
 *    face as about 1.34 × as long as wide; the lidar and the published
 *    height allow 1.29. Letter sizes and stroke weight traced from the
 *    near-frontal photos (RepeatRight, compujeramey, valkyrieh116): cap
 *    height 4.9 m, strokes 0.7 m, letters raised 0.45 m.
 *    The letters are a heavy condensed sans: square-ended arms, the R with
 *    a rounded D bowl and a straight diagonal leg.
 *  - block depth 3.0 m with a step 1.5 m back, and the handle profile:
 *    estimated from the side photos (compujeramey, Ron Cogswell) against
 *    the lidar's handle length and heights. The block's back bottom edge
 *    runs into the mulch bed (the face's foot corner is on the lawn while
 *    the block leans back), so the block is cut flat at the ground.
 *  - colours, from the daylight photos: the handle bright red, the block a
 *    deeper red, the face light grey, the letters a faded pink (they read
 *    pink in every daylight photo since 2007; brighter red-orange at
 *    night under the floodlights).
 *  - night: the face is floodlit from the front (Ken Lund's night photo):
 *    a _FLOODLIGHT wash on the face and letters; nothing glows.
 *
 * Lettering: the sculpture's word is its identity, so it is modelled
 * (STYLE.md, "Famous signs"), traced letter by letter with lettering.ts.
 *
 * Photos (evidence): Cleveland Free Stamp (26646559122).jpg and (26740830195)
 * .jpg, Free Stamp (51141639178).jpg (Erik Drost, CC BY 2.0, Wikimedia
 * Commons); flickr 473738856 and 473751979 "Free Stamp" (compujeramey,
 * CC BY 2.0); flickr 52612810582 "'FREE Stamp' (1982)" (Ron Cogswell, CC BY
 * 2.0); flickr 31241277378 "FREE Stamp" (RepeatRight, CC BY-SA 2.0);
 * flickr 174199958 (valkyrieh116, CC BY-SA 2.0); flickr 7981757184 "The
 * Free Stamp, Cleveland Landmark" (Ken Lund, CC BY-SA 2.0, night). USGS
 * NAIP for the plan. No commercial imagery.
 * Look-only (not relied on): none.
 *
 * Elevation 0: the stamp rests on the park lawn (a mulch bed, not
 * modelled). The handle's underside is flattened where it meets the lawn.
 *
 * Doubts: the block's back and the handle's far end are partly under tree
 * canopy in the lidar; their extent rests on the photos and the published
 * 15 m length. The block's step and its depth are estimated. The letter
 * shapes are traced from oblique photos; small differences in the R's leg
 * angle and the arms' lengths are likely.
 */
import { Part, type V3, cross, sub } from './mesh'
import { finish } from './palette'
import { Pen, strokes } from './lettering'
import { save } from './chi-aon-center'

const D2R = Math.PI / 180

// ------------------------------------------------------------------ pose
const W = 5.8 // face, short side (u)
const L = 7.5 // face, long side (v)
const THETA = 19 * D2R // in-plane turn: the top leans east
const PHI = 16 * D2R // the face tipped up (the block leaning back)
const PSI = 17 * D2R // the handle's axis, down from level toward its end
const PLATE = 0.3, STEP = 1.5, DEPTH = 3.0, LETTER = 0.45
const CX = -0.8, CY = -6.85 // the face's centre in plan
const FOOT = 0.15 // the face's lowest (south-east) corner above the lawn

const ct = Math.cos(THETA), st = Math.sin(THETA), cp = Math.cos(PHI), sp = Math.sin(PHI)
// Face basis after the in-plane turn, then tipped back about x.
const tilt = ([x, y, z]: V3): V3 => [x, y * cp + z * sp, -y * sp + z * cp]
const U = tilt([ct, 0, -st]), Vv = tilt([st, 0, ct]), N = tilt([0, -1, 0])
// The face's foot corner sits FOOT above the lawn; the block's back edge
// behind it runs into the mulch bed (lidar), so the block is cut at z = 0.
const CZ = FOOT - Math.min(...[-W / 2, W / 2].flatMap((u) => [-L / 2, L / 2].map((v) => u * U[2] + v * Vv[2])))
const F = (u: number, v: number, w: number): V3 => [
  CX + u * U[0] + v * Vv[0] + w * N[0],
  CY + u * U[1] + v * Vv[1] + w * N[1],
  Math.max(0, CZ + u * U[2] + v * Vv[2] + w * N[2]),
]

type UV = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function faceTo(p: Part, pts: V3[], want: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const r = dot(g, want) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < r.length - 1; i++) p.tri(r[0], r[i], r[i + 1])
}
/** A rectangle (u, v) with chamfered corners, counter-clockwise seen from the face. */
const chamRect = (hu: number, hv: number, c: number): UV[] => [
  [-hu + c, -hv], [hu - c, -hv], [hu, -hv + c], [hu, hv - c], [hu - c, hv], [-hu + c, hv], [-hu, hv - c], [-hu, -hv + c],
]
/** A prism in face coordinates from w0 to w1: sides, and optionally caps. */
function prism(p: Part, r0: UV[], w0: number, r1: UV[], w1: number, front = true, back = true) {
  const n = r0.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = F(r0[i][0], r0[i][1], w0), b = F(r0[j][0], r0[j][1], w0), c = F(r1[j][0], r1[j][1], w1), d = F(r1[i][0], r1[i][1], w1)
    const mu = (r0[i][0] + r0[j][0]) / 2, mv = (r0[i][1] + r0[j][1]) / 2
    const out = sub(F(mu, mv, (w0 + w1) / 2), F(0, 0, (w0 + w1) / 2))
    // Split the long sides so the terrain drape can follow them.
    const len = Math.hypot(r0[j][0] - r0[i][0], r0[j][1] - r0[i][1]), k = Math.max(1, Math.ceil(len / 4))
    for (let q = 0; q < k; q++) {
      const t0 = q / k, t1 = (q + 1) / k
      const lerp3 = (x: V3, y: V3, t: number): V3 => [x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]
      faceTo(p, [lerp3(a, b, t0), lerp3(a, b, t1), lerp3(d, c, t1), lerp3(d, c, t0)], out)
    }
  }
  if (front) faceTo(p, r1.map(([u, v]) => F(u, v, w1)), N)
  if (back) faceTo(p, r0.map(([u, v]) => F(u, v, w0)), [-N[0], -N[1], -N[2]])
}

// ------------------------------------------------------------ lettering
const CAP = 4.9, SW = 0.7, h = SW / 2
/** FREE, each letter drawn in letter units (x advance, y up, metres). */
function word(): { main: Pen; leg: Pen; total: number } {
  const main = new Pen(), leg = new Pen()
  let x = 0
  const gap = 0.3
  // F
  {
    const w = 1.28
    main.moveTo([x + w, CAP - h]).lineTo([x + h, CAP - h]).lineTo([x + h, 0])
    main.moveTo([x + h, CAP * 0.5]).lineTo([x + w * 0.95, CAP * 0.5])
    x += w + gap
  }
  // R: stem, a rounded D bowl over the upper half, a straight leg.
  {
    const w = 1.5, r = 0.45, yb = CAP * 0.45
    main.moveTo([x + h, 0]).lineTo([x + h, CAP - h]).lineTo([x + w - h - r, CAP - h])
      .arc([x + w - h - r, CAP - h - r], -Math.PI / 2, 4)
      .lineTo([x + w - h, yb + h + r])
      .arc([x + w - h - r, yb + h + r], -Math.PI / 2, 4)
      .lineTo([x + h, yb + h])
    leg.moveTo([x + w * 0.42, yb + h * 0.4]).lineTo([x + w - h * 0.85, h * 0.35])
    x += w + gap
  }
  // E, E
  for (let k = 0; k < 2; k++) {
    const w = 1.38
    main.moveTo([x + w, CAP - h]).lineTo([x + h, CAP - h]).lineTo([x + h, h]).lineTo([x + w, h])
    main.moveTo([x + h, CAP * 0.5]).lineTo([x + w, CAP * 0.5])
    x += w + gap
  }
  return { main, leg, total: x - gap }
}

function build() {
  const handle = new Part(), block = new Part(), plate = new Part(), letters = new Part()

  // ---------------------------------------------------------------- block
  const C = 0.22
  prism(plate, chamRect(W / 2, L / 2, C), -PLATE, chamRect(W / 2 - 0.08, L / 2 - 0.08, C), 0, true, false)
  prism(block, chamRect(W / 2, L / 2, C), -STEP, chamRect(W / 2, L / 2, C), -PLATE, false, false)
  // The step, and the narrower back half.
  const back = chamRect(W / 2 - 0.22, L / 2 - 0.22, C)
  {
    const o = chamRect(W / 2, L / 2, C)
    for (let i = 0; i < o.length; i++) {
      const j = (i + 1) % o.length
      faceTo(block, [F(o[i][0], o[i][1], -STEP), F(o[j][0], o[j][1], -STEP), F(back[j][0], back[j][1], -STEP), F(back[i][0], back[i][1], -STEP)], [-N[0], -N[1], -N[2]])
    }
  }
  prism(block, chamRect(W / 2 - 0.42, L / 2 - 0.42, C), -DEPTH, back, -STEP - 0.2, false, true)
  prism(block, back, -STEP - 0.2, back, -STEP, false, false)

  // -------------------------------------------------------------- letters
  // Letter x runs up the long side (v), letter y across it (u): the word
  // reads mirrored, F at the bottom, the letters' tops to the east.
  const { main, leg, total } = word()
  const place = (lx: number, ly: number, w: number): V3 => F(ly - CAP / 2, lx - total / 2, w)
  strokes(letters, main.paths, { width: SW, depth: LETTER, place })
  strokes(letters, leg.paths, { width: SW * 0.85, depth: LETTER, place })

  // --------------------------------------------------------------- handle
  // A lathe about the stamp's axis, from the block's back outwards, its
  // underside flattened where it meets the lawn.
  const prof: UV[] = [
    [0, 1.2], [0.3, 1.5], [0.9, 1.65], [1.5, 1.45], [2.1, 1.12], [2.7, 1.05], [3.4, 1.25], [4.4, 1.85],
    [5.5, 2.45], [6.7, 2.85], [8.0, 2.95], [9.0, 2.75], [9.7, 2.3], [10.2, 1.5], [10.45, 0.7], [10.52, 0],
  ]
  const A = F(0, 0, -DEPTH), ax: V3 = [0, Math.cos(PSI), -Math.sin(PSI)]
  const e1: V3 = [1, 0, 0], e2: V3 = [0, Math.sin(PSI), Math.cos(PSI)]
  const SEG = 24
  const ring = (s: number, r: number): V3[] => Array.from({ length: SEG }, (_, k) => {
    const t = (k / SEG) * 2 * Math.PI, c = Math.cos(t), si = Math.sin(t)
    const p: V3 = [A[0] + ax[0] * s + r * (c * e1[0] + si * e2[0]), A[1] + ax[1] * s + r * (c * e1[1] + si * e2[1]), A[2] + ax[2] * s + r * (c * e1[2] + si * e2[2])]
    p[2] = Math.max(0, p[2])
    return p
  })
  const nrm = prof.map((_, i) => {
    const [s0, r0] = prof[Math.max(0, i - 1)], [s1, r1] = prof[Math.min(prof.length - 1, i + 1)]
    const l = Math.hypot(s1 - s0, r1 - r0)
    return [-(r1 - r0) / l, (s1 - s0) / l] as UV // (axial, radial)
  })
  const rings = prof.map(([s, r]) => ring(s, r))
  const nAt = (i: number, k: number, p: V3): V3 => {
    if (p[2] <= 1e-6) return [0, 0, -1]
    const t = (k / SEG) * 2 * Math.PI, c = Math.cos(t), si = Math.sin(t), [na, nr] = nrm[i]
    return [ax[0] * na + nr * (c * e1[0] + si * e2[0]), ax[1] * na + nr * (c * e1[1] + si * e2[1]), ax[2] * na + nr * (c * e1[2] + si * e2[2])]
  }
  for (let i = 0; i < prof.length - 1; i++) for (let k = 0; k < SEG; k++) {
    const j = (k + 1) % SEG
    const a = rings[i][k], b = rings[i][j], c = rings[i + 1][j], d = rings[i + 1][k]
    if (a[2] <= 1e-6 && b[2] <= 1e-6 && c[2] <= 1e-6 && d[2] <= 1e-6) continue // on the lawn: unseen
    const na = nAt(i, k, a), nb = nAt(i, j, b), nc = nAt(i + 1, j, c), nd = nAt(i + 1, k, d)
    handle.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    if (prof[i + 1][1] > 0) handle.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }

  // Night: floodlights in front of the face light the face and letters.
  const lit = (_p: V3, n: V3) => (dot(n, N) > 0.3 ? 0.9 : dot(n, N) > -0.2 ? 0.5 : 0)
  return [
    { part: handle, material: finish('stamp-red', 0xc8383c) },
    { part: block, material: finish('stamp-block-red', 0xb04448) },
    { part: plate, material: { ...finish('stamp-face-grey', 0xc9cacb), floodlight: lit } },
    { part: letters, material: { ...finish('stamp-letter-pink', 0xd8708e), floodlight: lit } },
  ]
}

if (import.meta.main) {
  const parts = build()
  const all = parts.flatMap((x) => x.part.pos.filter((_, i) => i % 3 === 1))
  console.log(`top ${Math.max(...all).toFixed(2)} m, lowest ${Math.min(...all).toFixed(2)} m`)
  await save('cle-free-stamp', 'Free Stamp', [41.5054338, -81.6924505], 347, parts, 6500)
}
