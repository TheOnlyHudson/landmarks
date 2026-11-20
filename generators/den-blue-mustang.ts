/**
 * Blue Mustang ("Blucifer"), Denver International Airport (Luis Jiménez,
 * installed 2008) — original procedural geometry, CC0-1.0.
 * bun generators/den-blue-mustang.ts
 *
 * Map frame of the model: +y is the way the horse faces (bearing 205°,
 * south-south-west, toward the traffic coming up Peña Boulevard from
 * Denver), +x to its right, z up, metres; origin on the ground at the
 * centre of the sculpture. No OSM building; Wikidata Q28455129 (point
 * -104.67626, 39.83412). Anchor -104.676242, 39.834117: the centre of the
 * lidar returns over the sculpture, 1.5 m east and 0.3 m south of
 * Wikidata's point, inside the gravel ring the NAIP shows in the median.
 *
 * Identity (photos below): a huge rearing horse in glossy cobalt blue
 * fibreglass, hind legs planted, body thrown up at about 50°, forelegs
 * pawing the air (one reaching forward, one tucked), head bent forward and
 * down on an arched neck, a spiky flame-like mane and a long tail streaming
 * down behind, and glowing red eyes.
 *
 * Measured: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 0.5 m grid; the
 * returns are sparse on the fibreglass, but the highest (9.2 m, the head)
 * lie 1.5–2 m south-west of the lower returns over the haunches (4.7–5.5
 * m), which gives the facing (about 205°) and the head height. NAIP (USGS,
 * public domain) shows the blue figure stretched south-west to north-east
 * and its shadow, in the median. Published: 32 ft (9.8 m) tall (Wikidata,
 * Denver Public Art), so the ears reach 9.8. Estimated: everything else —
 * the pose, read from the photos (the side profile in agahran, the front in
 * sinko3, the three-quarter view in sinko), scaled to 9.8 m; the low base
 * (0.5 m, the lidar ground under the hooves is 0.3–0.5 m above the gravel
 * round it). Left out: the red veins painted on the body, the face detail.
 *
 * Photos (evidence):
 *  agahran "BLUCIFER: horse of doom...", agahran, CC BY 2.0,
 *          https://www.flickr.com/photos/78863070@N00/6070167891 (daylight,
 *          side profile: the colour and the pose)
 *  sinko   "Blucifer-Michael-Sinko.jpg", Michael Sinko, CC BY-SA 2.0,
 *          https://commons.wikimedia.org/wiki/File:Blucifer-Michael-Sinko.jpg
 *          (night, three-quarter front from below)
 *  sinko2  "Blucifer at the Denver International Airport", Mike Sinko
 *          Photography, CC BY-SA 2.0,
 *          https://www.flickr.com/photos/36520720@N04/15384910808 (night,
 *          side)
 *  sinko3  "_MG_5009", Mike Sinko Photography, CC BY 2.0,
 *          https://www.flickr.com/photos/36520720@N04/39359159900 (night,
 *          front)
 * Look-only: none used. No commercial imagery.
 *
 * Night: the sculpture is floodlit from the ground (sinko photos), so the
 * blue and the mane carry _FLOODLIGHT, strongest low down; the eyes are
 * `neon` in their red.
 *
 * Doubts: the facing comes from sparse lidar and NAIP, not a photo with a
 * known direction; the exact limb angles are from three photos, two at
 * night.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './atl-flatiron-building'

const blue = new Part(), blueDark = new Part(), mane = new Part(), eyes = new Part(), base = new Part()

// Model local: x right, y forward, z up. Built facing +y, then turned so +y
// faces north in the GLB's own frame (the catalog bearing turns it to 205°).
type J = [number, number, number, number] // x, y, z, radius

const norm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/**
 * A smooth tapered tube through joints, rounded off at both ends; faces that
 * look down go to the darker blue so the form's undersides read.
 */
function limb(js: J[], seg = 8, part: Part | null = null) {
  // round the ends: add a shrunken joint just past each end
  const ext = (a: J, b: J): J => {
    const d = norm([a[0] - b[0], a[1] - b[1], a[2] - b[2]])
    return [a[0] + d[0] * a[3] * 0.7, a[1] + d[1] * a[3] * 0.7, a[2] + d[2] * a[3] * 0.7, a[3] * 0.35]
  }
  const pts = [ext(js[0], js[1]), ...js, ext(js[js.length - 1], js[js.length - 2])]
  const n = pts.length
  let ref: V3 = [1, 0, 0]
  const rings: { p: V3[]; nrm: V3[] }[] = []
  for (let k = 0; k < n; k++) {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(n - 1, k + 1)]
    const t = norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
    let u = crossV(t, ref)
    if (Math.hypot(...u) < 0.2) u = crossV(t, [0, 0, 1])
    u = norm(u)
    const w = norm(crossV(u, t))
    ref = w
    const p: V3[] = [], nrm: V3[] = []
    for (let i = 0; i < seg; i++) {
      const ang = (i / seg) * Math.PI * 2
      const dir: V3 = [u[0] * Math.cos(ang) + w[0] * Math.sin(ang), u[1] * Math.cos(ang) + w[1] * Math.sin(ang), u[2] * Math.cos(ang) + w[2] * Math.sin(ang)]
      const [x, y, z, r] = pts[k]
      p.push([x + dir[0] * r, y + dir[1] * r, z + dir[2] * r])
      nrm.push(dir)
    }
    rings.push({ p, nrm })
  }
  for (let k = 0; k < n - 1; k++) {
    for (let i = 0; i < seg; i++) {
      const i2 = (i + 1) % seg
      const A = rings[k].p[i], B = rings[k].p[i2], C = rings[k + 1].p[i2], D = rings[k + 1].p[i]
      const nA = rings[k].nrm[i], nB = rings[k].nrm[i2], nC = rings[k + 1].nrm[i2], nD = rings[k + 1].nrm[i]
      const nz = nA[2] + nB[2] + nC[2] + nD[2]
      const p = part ?? (nz < -1.6 ? blueDark : blue)
      p.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
      p.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
  // close the tips
  for (const k of [0, n - 1]) {
    const c = pts[k], ring = rings[k]
    const tip: V3 = [c[0], c[1], c[2]]
    const away = k === 0 ? norm([pts[0][0] - pts[1][0], pts[0][1] - pts[1][1], pts[0][2] - pts[1][2]]) : norm([pts[n - 1][0] - pts[n - 2][0], pts[n - 1][1] - pts[n - 2][1], pts[n - 1][2] - pts[n - 2][2]])
    for (let i = 0; i < seg; i++) {
      const i2 = (i + 1) % seg
      ;(part ?? blue).tri(ring.p[i], ring.p[i2], tip, undefined, undefined, undefined, [ring.nrm[i], ring.nrm[i2], away])
    }
  }
}

const B = 0.5 // the base

// ── Body: haunches low behind, chest high in front ──
limb([[0, -1.9, 4.3, 0.75], [0, -1.3, 4.9, 0.95], [0, -0.5, 5.8, 0.98], [0, 0.2, 6.7, 0.9], [0, 0.5, 7.2, 0.7]], 10)
// haunches, a little wider than the barrel
for (const s of [-1, 1]) limb([[s * 0.42, -1.8, 4.3, 0.75], [s * 0.47, -1.2, 3.6, 0.65]], 8)

// ── Hind legs, planted: thigh forward to the stifle, back to the hock, down ──
for (const [s, dy] of [[-1, 0.35], [1, -0.15]] as [number, number][]) {
  limb([[s * 0.55, -1.2 + dy, 3.8, 0.55], [s * 0.62, -0.6 + dy, 2.7, 0.38], [s * 0.68, -1.4 + dy, 1.6, 0.24], [s * 0.75, -1.0 + dy, B + 0.45, 0.18], [s * 0.75, -0.9 + dy, B + 0.12, 0.24]], 7)
}

// ── Forelegs pawing the air: the left reaching forward, the right tucked ──
limb([[-0.55, 0.4, 6.5, 0.42], [-0.55, 1.2, 6.1, 0.3], [-0.55, 2.0, 6.6, 0.25], [-0.55, 2.05, 5.7, 0.18], [-0.55, 2.25, 5.35, 0.23]], 7)
limb([[0.55, 0.4, 6.5, 0.42], [0.55, 1.0, 5.8, 0.3], [0.55, 1.6, 6.5, 0.25], [0.55, 1.35, 5.7, 0.18], [0.55, 1.5, 5.4, 0.23]], 7)

// ── Neck arched up from the chest, head bent forward and down ──
limb([[0, 0.1, 6.9, 0.75], [0, 0.15, 7.9, 0.55], [0, 0.4, 8.7, 0.45], [0, 0.7, 9.05, 0.38]], 9)
limb([[0, 0.65, 9.1, 0.36], [0, 1.2, 8.85, 0.33], [0, 1.65, 8.4, 0.27], [0, 1.8, 8.15, 0.24]], 8)
// ears
for (const s of [-1, 1]) limb([[s * 0.18, 0.55, 9.35, 0.11], [s * 0.22, 0.45, 9.76, 0.04]], 4)

// ── Red eyes: neon, bold enough to read ──
for (const s of [-1, 1]) {
  const c: V3 = [s * 0.3, 1.05, 8.9], r = 0.22
  const P = (dx: number, dy: number, dz: number): V3 => [c[0] + dx * r, c[1] + dy * r, c[2] + dz * r]
  const oct = [P(1, 0, 0), P(0, 1, 0), P(-1, 0, 0), P(0, -1, 0)]
  for (let i = 0; i < 4; i++) {
    eyes.tri(oct[i], oct[(i + 1) % 4], P(0, 0, 1))
    eyes.tri(oct[(i + 1) % 4], oct[i], P(0, 0, -1))
  }
}

// ── The mane: a spiky crest standing back off the neck, flames of fibreglass ──
{
  const crest: [number, number][] = [[0.45, 9.25], [0.05, 8.75], [-0.3, 8.1], [-0.45, 7.5], [-0.55, 6.9], [-0.6, 6.4]] // y, z along the neck's back
  const outN: [number, number] = [-0.8, 0.6] // backward and up
  const th = 0.16
  for (let i = 0; i < crest.length - 1; i++) {
    const [y0, z0] = crest[i], [y1, z1] = crest[i + 1]
    const L = 0.75 + 0.15 * Math.sin(i * 1.7)
    const tip: [number, number] = [(y0 + y1) / 2 + outN[0] * L - 0.25, (z0 + z1) / 2 + outN[1] * L - 0.3]
    // set the crest's root into the neck
    const r0: [number, number] = [y0 + 0.3, z0], r1: [number, number] = [y1 + 0.3, z1]
    for (const s of [-1, 1]) {
      const a: V3 = [s * th, r0[0], r0[1]], b: V3 = [s * th, r1[0], r1[1]], c: V3 = [0, tip[0], tip[1]]
      if (s > 0) mane.tri(a, b, c)
      else mane.tri(b, a, c)
    }
  }
}
// forelock and the tail, streaming down behind
limb([[0, 0.75, 9.3, 0.15], [0, 1.0, 9.2, 0.09]], 5, mane)
limb([[0, -2.3, 4.5, 0.26], [0, -2.85, 4.0, 0.32], [0, -3.05, 3.1, 0.3], [0, -2.85, 2.3, 0.16], [0, -2.65, 1.9, 0.08]], 7, mane)

// ── The low base ──
{
  const ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [r * Math.cos(((i + 0.5) / 8) * Math.PI * 2), -0.9 + 1.0 * r * Math.sin(((i + 0.5) / 8) * Math.PI * 2), z])
  base.loft([ring(1.7, 0), ring(1.7, B - 0.12), ring(1.58, B)])
  base.cap(ring(1.58, B), true)
}

const lit = (p: V3, n: V3) => Math.max(0.35, Math.min(1, 1 - p[2] / 14)) * (n[2] < 0.9 ? 1 : 0.6)
await save('den-blue-mustang', 'Blue Mustang (Blucifer)', [
  { part: blue, material: { ...finish('mustang-blue', 0x3159c0, 0.4), floodlight: lit } },
  { part: blueDark, material: { ...finish('mustang-blue-shade', 0x274a9e, 0.4), floodlight: lit } },
  { part: mane, material: { ...finish('mustang-mane', 0x4c5566, 0.5), floodlight: lit } },
  { part: eyes, material: finish('neon-mustang-eyes', 0xe8322c) },
  { part: base, material: finish('mustang-base', 0x9e9a93) },
], { height: 9.8, anchor: [39.834117, -104.676242], bearing: 205 }, 5000)
