/**
 * Aldar Headquarters, Al Raha Beach, Abu Dhabi (MZ Architects, Arup;
 * 2010): procedural, CC0-1.0.
 * bun generators/abu-dhabi-aldar-hq.ts
 *
 * The "coin": a circular building standing on edge, its two faces convex
 * glass, wrapped in a steel diagrid, joined round the edge by a narrow
 * band of indented glazing between pale rims.
 *
 * Frame: anchor at the centroid of the OSM outline (way/168404139),
 * 54.5753287, 24.4414194; bearing 346, the outline's long axis (its long
 * edges run at 166 / 346), so the disc's plane is the model's y-z plane
 * and its faces look along model +x / -x (compass 76, east-north-east, and
 * 256).
 *
 * Published: 23 storeys; 121 m tall overall (Arup; Gulf News; OSM's
 * 110 m and Wikipedia's 110 m are the roof); 124 m across (Building
 * magazine; 120.9 m in a student study); about 10 m thick at the edge and
 * 36.4 m at the middle (the same study); steel diagrid (Arup); "two
 * circular convex shaped facades linked by a narrow band of indented
 * glazing" (ArchDaily). Modelled: radius 62 m, the centre 59 m up, so the
 * top is at 121 m and the circle meets the ground in a 38 m chord;
 * thickness 10 m + 26.4 m (1 - (r/R)^2); OSM's outline (130 m by about
 * 46 m) is the disc's plan projection, which this matches within its
 * tracing. Estimated from photos (o01, o03): the diagrid as tall diamonds,
 * bars at +-68 degrees from the horizontal, 7.5 m apart, here as thin
 * solid bars (0.44 m wide) standing 0.28 m proud of the glass; the rims pale silver; the glazed band set in about 1.2 m.
 *
 * Colour: face glass #9db4c7 (reflective silver-blue as in o02; o01 shows #1f3550 against a bright sky;
 * pulled to the palette's lightness); diagrid #c3cdd5, light grey and close to the glass tone (fine, subtle lines in o02 and o03);
 * rim #c6ccd2 (o01 sunlit rim); the edge glazing `window`. Night: the
 * offices are lit; glass is `window`.
 *
 * Photos (EVIDENCE):
 * - o01 "Aldar headquarters building", Christoph Derndorfer, CC BY-SA 2.0, https://www.flickr.com/photos/14184479@N02/24481460592 (face and rim, from the north)
 * - o02 "The 'Wafer' at Al Raha Beach from distance, Abu Dhabi", lam_chihang, CC BY 2.0, https://www.flickr.com/photos/12316147@N05/8584317200 (face-on, distant)
 * - o03 "The Aldar building in Abu Dhabi", ciamabue, CC BY 2.0, https://www.flickr.com/photos/25588248@N00/7088180501 (aerial, diagrid)
 * Commons files found but not downloaded (rate-limited): "Al Dar Hq
 * architecutal view.jpg" (Asimuddinustad, CC BY-SA 4.0).
 * Facts: https://www.arup.com/projects/aldar-headquarters/ ;
 * https://www.building.co.uk/buildings/aldars-abu-dhabi-hq-one-last-spin-of-the-wheel/5001243.article ;
 * https://www.archdaily.com/240524/al-dar-headquarters-mz-architects ;
 * https://gulfnews.com/uae/abu-dhabi/aldar-headquarters-abu-dhabis-circular-marvel-redefines-skyline-and-sustainability-1.500746376
 *
 * Doubts: only three open photos; the height (121 or 110 m) and the
 * diameter (121 or 124 m) differ between sources; how far the circle is
 * sunk into the ground is estimated; the diagrid's angle and spacing are
 * read from small, distant photos; the base and entrance are not seen in
 * any open photo and are left plain.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 346
const R = 62, C = 59 // radius; height of the centre
const TAU = Math.PI * 2
const thick = (rho: number) => 10 + 26.4 * (1 - Math.min(1, rho / R) ** 2)
/** A face point: v along the plane (model y), z up; side +1 / -1 (model x). */
const face = (v: number, z: number, side: number, out = 0): V3 => {
  const rho = Math.hypot(v, z - C)
  const n = faceN(v, z, side)
  return [side * thick(rho) / 2 + n[0] * out, v + n[1] * out, z + n[2] * out]
}
function faceN(v: number, z: number, side: number): V3 {
  // x = side * t/2, so the outward normal is (side, 26.4 v / R^2, 26.4 (z - C) / R^2)
  const n: V3 = [side, (26.4 * v) / (R * R), (26.4 * (z - C)) / (R * R)]
  const l = Math.hypot(...n)
  return [n[0] / l, n[1] / l, n[2] / l]
}
/** The visible disc is the circle above the ground. */
const zGround = 0
const ringPt = (th: number, rho: number): [number, number] => {
  const v = rho * Math.cos(th), z = C + rho * Math.sin(th)
  return [v, Math.max(z, zGround)]
}

function faces(glass: Part) {
  const NT = 40, NR = 7
  for (const side of [1, -1]) {
    for (let k = 0; k < NR; k++) {
      const r0 = (R * k) / NR, r1 = (R * (k + 1)) / NR
      for (let j = 0; j < NT; j++) {
        const t0 = (TAU * j) / NT, t1 = (TAU * (j + 1)) / NT
        const p = [ringPt(t0, r0), ringPt(t1, r0), ringPt(t1, r1), ringPt(t0, r1)]
        const P = p.map(([v, z]) => face(v, z, side)), N = p.map(([v, z]) => faceN(v, z, side))
        if (k === 0) glass.tri(P[0], P[2], P[3], [0, 0], [0, 0], [0, 0], [N[0], N[2], N[3]])
        else {
          glass.tri(P[0], P[1], P[2], [0, 0], [0, 0], [0, 0], [N[0], N[1], N[2]])
          glass.tri(P[0], P[2], P[3], [0, 0], [0, 0], [0, 0], [N[0], N[2], N[3]])
        }
      }
    }
  }
}

/** Rim: pale lips at both faces' edges and the indented glazed band between. */
function rim(trim: Part, win: Part) {
  const NT = 72
  const e = thick(R) / 2 // 5 m
  const lip = 1.6, inset = 1.2
  for (let j = 0; j < NT; j++) {
    const t0 = (TAU * j) / NT, t1 = (TAU * (j + 1)) / NT
    const [v0, z0] = ringPt(t0, R), [v1, z1] = ringPt(t1, R)
    if (z0 <= zGround + 1e-6 && z1 <= zGround + 1e-6) continue
    const o0: V3 = [0, Math.cos(t0), Math.sin(t0)], o1: V3 = [0, Math.cos(t1), Math.sin(t1)]
    const at = (v: number, z: number, x: number, o: V3, d: number): V3 => [x, v + o[1] * d, z + o[2] * d]
    // the lips: x from +-e to +-(e - lip), flush with the rim
    for (const s of [1, -1]) {
      const a = at(v0, z0, s * e, o0, 0), b = at(v1, z1, s * e, o1, 0), c = at(v1, z1, s * (e - lip), o1, 0), d = at(v0, z0, s * (e - lip), o0, 0)
      trim.tri(a, b, c, [0, 0], [0, 0], [0, 0], [o0, o1, o1]); trim.tri(a, c, d, [0, 0], [0, 0], [0, 0], [o0, o1, o0])
      // the step down into the band
      const c2 = at(v1, z1, s * (e - lip), o1, -inset), d2 = at(v0, z0, s * (e - lip), o0, -inset)
      const sx: V3 = [-s, 0, 0]
      trim.tri(d, c, c2, [0, 0], [0, 0], [0, 0], [sx, sx, sx]); trim.tri(d, c2, d2, [0, 0], [0, 0], [0, 0], [sx, sx, sx])
    }
    const a = at(v0, z0, e - lip, o0, -inset), b = at(v1, z1, e - lip, o1, -inset), c = at(v1, z1, -(e - lip), o1, -inset), d = at(v0, z0, -(e - lip), o0, -inset)
    win.tri(a, b, c, [0, 0], [0, 0], [0, 0], [o0, o1, o1]); win.tri(a, c, d, [0, 0], [0, 0], [0, 0], [o0, o1, o0])
  }
  // the cut at the ground is closed by the map's ground; nothing drawn there
}

/** Diagrid: two families of straight bars in the plane, laid on the convex faces. */
function diagrid(dg: Part) {
  const ang = (68 * Math.PI) / 180, gap = 7.5, w = 0.22, out = 0.28, seg = 14
  for (const side of [1, -1]) {
    for (const s of [1, -1]) {
      const d: [number, number] = [s * Math.cos(ang), Math.sin(ang)] // direction in (v, z)
      const q: [number, number] = [-d[1], d[0]]
      const spacing = gap * Math.sin(ang)
      for (let k = -12; k <= 12; k++) {
        const o = k * spacing
        // clip the line {c + q*o + d*t} to the circle radius R - 1.8 (inside the lip) and z >= 0.5
        const Ri = R - 1.8
        if (Math.abs(o) >= Ri) continue
        const h = Math.sqrt(Ri * Ri - o * o)
        let tA = -h, tB = h
        const cz = C + q[1] * o
        // z = cz + d[1] t >= 0.5
        tA = Math.max(tA, (0.5 - cz) / d[1])
        if (tB <= tA) continue
        const n = Math.max(1, Math.ceil((tB - tA) / seg))
        const P = (t: number, sw: number, oo: number): V3 => {
          const v = q[0] * o + d[0] * t + q[0] * sw, z = cz + d[1] * t + q[1] * sw
          return face(v, z, side, oo)
        }
        const N = (t: number): V3 => faceN(q[0] * o + d[0] * t, cz + d[1] * t, side)
        for (let i = 0; i < n; i++) {
          const t0 = tA + ((tB - tA) * i) / n, t1 = tA + ((tB - tA) * (i + 1)) / n
          const A0 = P(t0, -w, out), B0 = P(t0, w, out), A1 = P(t1, -w, out), B1 = P(t1, w, out)
          const a0 = P(t0, -w, 0), b0 = P(t0, w, 0), a1 = P(t1, -w, 0), b1 = P(t1, w, 0)
          const n0 = N(t0), n1 = N(t1)
          dg.tri(A0, B0, B1, [0, 0], [0, 0], [0, 0], [n0, n0, n1]); dg.tri(A0, B1, A1, [0, 0], [0, 0], [0, 0], [n0, n1, n1])
          // sides: normals across the bar, in the plane, tilted onto the face
          const sideN = (sg: number, nn: V3): V3 => {
            const t: V3 = [0, q[0] * sg, q[1] * sg]
            const dot = t[0] * nn[0] + t[1] * nn[1] + t[2] * nn[2]
            const r: V3 = [t[0] - dot * nn[0], t[1] - dot * nn[1], t[2] - dot * nn[2]]
            const l = Math.hypot(...r) || 1
            return [r[0] / l, r[1] / l, r[2] / l]
          }
          const L0 = sideN(-1, n0), L1 = sideN(-1, n1), R0 = sideN(1, n0), R1 = sideN(1, n1)
          dg.tri(a0, A0, A1, [0, 0], [0, 0], [0, 0], [L0, L0, L1]); dg.tri(a0, A1, a1, [0, 0], [0, 0], [0, 0], [L0, L1, L1])
          dg.tri(B0, b0, b1, [0, 0], [0, 0], [0, 0], [R0, R0, R1]); dg.tri(B0, b1, B1, [0, 0], [0, 0], [0, 0], [R0, R1, R1])
        }
      }
    }
  }
}

if (import.meta.main) {
  const glass = new Part(), trim = new Part(), win = new Part(), dg = new Part()
  faces(glass); rim(trim, win); diagrid(dg)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: glass, material: { ...PALETTE.window, color: 0x9db4c7 } },
    { part: dg, material: { ...finish('aldar-diagrid', 0xc3cdd5), floodlight: () => 0.5 } },
    { part: trim, material: { ...finish('aldar-rim', 0xc6ccd2), floodlight: () => 0.7 } },
    { part: win, material: { name: 'window-2', color: 0x64798a, roughness: 0.35 } },
  ]
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Aldar Headquarters', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: BEARING, elevation: 0, height: 121,
  })
  console.log(`abu-dhabi-aldar-hq.glb: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > 5000 || glb.length > 250_000) throw new Error('over budget')
  await Bun.write(new URL('../models/abu-dhabi-aldar-hq.glb', import.meta.url).pathname, glb)
}
