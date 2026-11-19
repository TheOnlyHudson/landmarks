/**
 * Mode Gakuen Cocoon Tower (モード学園コクーンタワー), Nishi-Shinjuku, Tokyo:
 * procedural, CC0-1.0.  bun generators/tokyo-mode-gakuen-cocoon-tower.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 * Uses the shared kit in tokyo-metropolitan-government-building.ts.
 *
 * Completed 2008 (Tange Associates); 50 floors, 203.65 m (Wikipedia, "Mode
 * Gakuen Cocoon Tower"; OSM's top part 204 m). A cocoon: three bulging lobes
 * of dark glass wrapped in a white diagonal web of steel members, divided by
 * three recessed, lens-shaped strips of lighter glass (narrow at the foot
 * and at the top, widest at mid-height), rising to a rounded point.
 *
 * Frame: north up (bearing 0). Origin at 139.69694, 35.69158; the tower's
 * axis at (0.1, 1.7) m from it (the centre of OSM's dome part); y = 0 is
 * the ground.
 *
 * OSM (all replaced): way/145495557 outline (50 levels); building:parts
 * way/577319850 (the body, a near circle r ~22 m, a dome roof from 98 to
 * 198 m), way/577094865, way/577094866, way/577094867 (the three lobes,
 * bulging to r ~27 m), way/577569356 (the core's triangle, to 204 m).
 *
 * Plan: r(angle) = 24 + 3.2 cos(3 (angle - 205 deg)) for the lobes (27.2 m
 * at their crowns, matching the outline's reach), the strips set back to
 * r 21 (the dome part). The strips face compass 185, 305 and 65 degrees and
 * the lobes 245 (with the oval), 5 and 125: read from the photos (DXR's
 * from the Metropolitan Government Building, bearing ~243 from the tower,
 * shows the oval lobe face-on and one strip to its right; Kakidai's from
 * the south shows a strip face-on). OSM's lobe and core parts sit ~25
 * degrees clockwise of this; the photos are followed. Profile (photos, Kakidai and DXR): 0.92 of full width at
 * the foot, full width from ~60 to ~95 m, then rounding in to the tip at
 * 204 m. The strips: from ~5 m to ~194 m, up to ~17 m wide at ~90 m, banded by pale
 * floor lines
 * (estimated, photos).
 * The web: two families of helical members crossing in diamonds ~7 m
 * wide and ~13 m tall (photos show diamonds about three floors tall,
 * smaller toward the top), heavier edge members along each strip, and the
 * elliptical opening high on the west lobe (~150-185 m, ~16 m wide; DXR's
 * west view) where the web parts round an oval window. Members are drawn
 * as 3-sided (low) or 4-sided (detail) prisms, ~1.2 m across (thicker than
 * real so they read).
 * Estimated: the exact web pattern (the real members curve and vary in
 * spacing), the strips' widths, the profile between the photo readings.
 *
 * Colours (daylight): the web white (#eef0f0), the lobes' glass a dark
 * blue-grey (#3e4a55), drawn `window` #5d6c79 (lit at night); the strips a
 * lighter reflective glass (#a5b8c6), `window-2`.
 *
 * Photos (Wikimedia Commons):
 * - "Mode Gakuen Cocoon Tower, Tokyo, West view 20190419 1.jpg", DXR, CC BY-SA 4.0
 * - "2018 Mode Gakuen Cocoon Tower 2.jpg", Kakidai, CC BY-SA 4.0
 * - "Mode Gakuen Cocoon Tower, Tokyo JP.jpg", Stefano Vigorelli, CC0
 * - "Mode Gakuen Cocoon Tower 2018.jpg", Otto Domes, CC BY-SA 4.0
 * - "Mode Gakuen Cocoon Tower in the evening with blue sky Tokyo Japan.jpg",
 *   Basile Morin, CC BY-SA 4.0 (dusk, lighting)
 * No lidar (Japan). No look-only sources.
 * Doubts: the third strip (south-west) is assumed like the two photographed;
 * the web's pattern is regularised; the tip's open crown is a small cage.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { member, writeModel, type Layer } from './tokyo-metropolitan-government-building'

const C: [number, number] = [0.1, 1.7]
const H = 204
const TAU = Math.PI * 2
/** Width factor with height: 0.92 at the foot, 1 from 60 to 95 m, rounding to 0 at the tip. */
function prof(z: number) {
  if (z <= 60) return 0.92 + 0.08 * Math.sin((z / 60) * (Math.PI / 2))
  if (z <= 95) return 1
  const t = (z - 95) / (H - 95)
  return Math.pow(Math.max(0, 1 - Math.pow(t, 2.2)), 0.5)
}
/** Lobed radius at angle a (full width). */
const lobeR = (a: number) => 24 + 3.2 * Math.cos(3 * (a - 205 * Math.PI / 180))
const STRIP_R = 21
const STRIPS = [25 * Math.PI / 180, 145 * Math.PI / 180, 265 * Math.PI / 180] // compass 65, 305, 185 (photos)
/** Half-width (radians) of the glazed strip at height z. */
function stripHalf(z: number) {
  if (z < 5 || z > 194) return 0
  const t = (z - 5) / (194 - 5)
  return 0.4 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), 0.75)
}
const angDist = (a: number, b: number) => { let d = (((a - b) % TAU) + TAU) % TAU; if (d > Math.PI) d -= TAU; return d }
/** Inside a strip (gap in the web)? Returns the signed distance in radians to the strip's edge (<0 inside). */
function stripEdge(a: number, z: number) {
  let best = Infinity
  for (const s of STRIPS) best = Math.min(best, Math.abs(angDist(a, s)) - stripHalf(z))
  return best
}
/** The oval opening high on the west lobe. */
const OVAL = { a: 205 * Math.PI / 180, z: 165, ha: 0.36, hz: 19 }
const inOval = (a: number, z: number) => (angDist(a, OVAL.a) / OVAL.ha) ** 2 + ((z - OVAL.z) / OVAL.hz) ** 2 < 1

/** The shell's radius at (a, z): the lobe, blended into the strip's setback near and in the strip. */
function shellR(a: number, z: number) {
  const e = stripEdge(a, z)
  const lobe = lobeR(a)
  // inside the strip: the setback glass; just outside it the lobe swells back out
  const k = Math.max(0, Math.min(1, (e + 0.02) / 0.12))
  return (STRIP_R + (lobe - STRIP_R) * k) * prof(z)
}
const P = (a: number, z: number, r: number): V3 => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z]

type Lod = { detail: boolean; na: number; nz: number; lines: number; dz: number; r: number; sides: number }
const LOW: Lod = { detail: false, na: 36, nz: 22, lines: 21, dz: 11, r: 0.72, sides: 3 }
const DETAIL: Lod = { detail: true, na: 96, nz: 52, lines: 34, dz: 4.6, r: 0.42, sides: 4 }

function build(L: Lod): Layer[] {
  const web = new Part(), dark = new Part(), light = new Part(), crown = new Part()
  // ---- the shell: a lofted surface, dark on the lobes, light in the strips
  const zs: number[] = []
  for (let i = 0; i <= L.nz; i++) { const t = i / L.nz; zs.push(H * (1 - Math.pow(1 - t, 1.25)) * 0.985) }
  const ztop = zs[zs.length - 1]
  const N = (a: number, z: number): V3 => {
    const e = 0.01, r = shellR(a, z)
    const dA = (shellR(a + e, z) - shellR(a - e, z)) / (2 * e), dZ = (shellR(a, z + 0.5) - shellR(a, z - 0.5)) / 1
    // gradient of F = rho - r(a, z) in cylindrical coordinates
    const nr = 1, na = -dA / Math.max(r, 1), nz = -dZ
    const n: V3 = [nr * Math.cos(a) - na * Math.sin(a), nr * Math.sin(a) + na * Math.cos(a), nz]
    const l = Math.hypot(...n); return [n[0] / l, n[1] / l, n[2] / l]
  }
  for (let j = 0; j < L.nz; j++) for (let i = 0; i < L.na; i++) {
    const a0 = (i / L.na) * TAU, a1 = ((i + 1) / L.na) * TAU, z0 = zs[j], z1 = zs[j + 1]
    const am = (a0 + a1) / 2, zm = (z0 + z1) / 2
    const part = stripEdge(am, zm) < 0 || inOval(am, zm) ? light : dark
    const q = [P(a0, z0, shellR(a0, z0)), P(a1, z0, shellR(a1, z0)), P(a1, z1, shellR(a1, z1)), P(a0, z1, shellR(a0, z1))]
    const n = [N(a0, z0), N(a1, z0), N(a1, z1), N(a0, z1)]
    part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [n[0], n[1], n[2]])
    part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [n[0], n[2], n[3]])
  }
  // the tip: a small open cage over a cap
  const tip: V3 = [C[0], C[1], H - 1.5]
  for (let i = 0; i < L.na; i++) {
    const a0 = (i / L.na) * TAU, a1 = ((i + 1) / L.na) * TAU
    dark.tri(P(a0, ztop, shellR(a0, ztop)), P(a1, ztop, shellR(a1, ztop)), tip)
  }
  for (let k = 0; k < 3; k++) {
    const a = STRIPS[k] + Math.PI / 3
    member(crown, P(a, ztop - 6, shellR(a, ztop - 6) + 0.4), [C[0], C[1], H], 0.35, 3)
  }

  // ---- the web: two families of helical members on the lobes, broken at the strips and the oval
  const slope = Math.tan((28 * Math.PI) / 180) / 24 // radians of turn per metre of height
  const off = 0.55 // how far the members stand off the glass
  const pt = (a: number, z: number): V3 => P(a, z, shellR(a, z) + off)
  const ok = (a: number, z: number) => stripEdge(a, z) > 0.04 && !inOval(a, z) && z < H - 4
  for (const dir of [1, -1]) for (let k = 0; k < L.lines; k++) {
    const a0 = (k / L.lines) * TAU + (dir > 0 ? 0 : Math.PI / L.lines)
    for (let z = 0; z < H - 4; z += L.dz) {
      const z1 = Math.min(H - 4, z + L.dz)
      const s = slope * (z <= 95 ? 1 : 1 / Math.max(0.35, prof(z)))
      const aA = a0 + dir * slope * z, aB = a0 + dir * (slope * z + s * (z1 - z))
      // split the segment where it enters or leaves a gap
      const steps = 1
      for (let m = 0; m < steps; m++) {
        const t0 = m / steps, t1 = (m + 1) / steps
        const pa = aA + (aB - aA) * t0, pb = aA + (aB - aA) * t1, qa = z + (z1 - z) * t0, qb = z + (z1 - z) * t1
        if (ok(pa, qa) && ok(pb, qb)) member(web, pt(pa, qa), pt(pb, qb), L.r, L.sides, [0, 0, 1])
      }
    }
  }
  // horizontal rings every ~4 diamonds (the real web has none; the strips' and oval's edge members instead)
  // edge members along each strip, both sides
  for (const s of STRIPS) for (const side of [1, -1]) {
    const zs2: number[] = []
    for (let z = 5; z <= 194; z += L.detail ? 4 : 9) zs2.push(z)
    zs2.push(194)
    for (let i = 0; i < zs2.length - 1; i++) {
      const za = zs2[i], zb = zs2[i + 1]
      const aa = s + side * (stripHalf(za) + 0.03), ab = s + side * (stripHalf(zb) + 0.03)
      member(web, pt(aa, za), pt(ab, zb), L.r * 1.25, L.sides, [0, 0, 1])
    }
  }
  // pale floor bands across the strips' glass, every three floors (detail: every floor)
  for (const s0 of STRIPS) for (let z = 12; z < 192; z += L.detail ? 4 : 12) {
    const h = stripHalf(z)
    if (h < 0.05) continue
    const segs = L.detail ? 6 : 3
    for (let i = 0; i < segs; i++) {
      const a0 = s0 - h + (2 * h * i) / segs, a1 = s0 - h + (2 * h * (i + 1)) / segs
      member(web, P(a0, z, shellR(a0, z) + 0.15), P(a1, z, shellR(a1, z) + 0.15), L.detail ? 0.2 : 0.3, 3, [0, 0, 1])
    }
  }
  // the oval's frame
  const n = L.detail ? 28 : 14
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * TAU, t1 = ((i + 1) / n) * TAU
    const A = (t: number): V3 => pt(OVAL.a + (OVAL.ha + 0.02) * Math.cos(t), OVAL.z + (OVAL.hz + 0.6) * Math.sin(t))
    member(web, A(t0), A(t1), L.r * 1.2, L.sides, [0, 0, 1])
  }
  // the foot: a ring beam the web lands on
  for (let i = 0; i < L.lines * 2; i++) {
    const a0 = (i / (L.lines * 2)) * TAU, a1 = ((i + 1) / (L.lines * 2)) * TAU
    if (stripEdge(a0, 1) > 0 && stripEdge(a1, 1) > 0) member(web, pt(a0, 1.2), pt(a1, 1.2), L.r, L.sides, [0, 0, 1])
  }

  return [
    { part: web, material: finish('cocoon-web', 0xeef0f0) },
    { part: dark, material: { name: 'window', color: 0x5d6c79, roughness: 0.3 } },
    { part: light, material: { name: 'window-2', color: 0xa5b8c6, roughness: 0.3 } },
    { part: crown, material: finish('cocoon-crown', 0xd5d8da) },
  ]
}

const meta = { bearing: 0, elevation: 0, height: H }
await writeModel('tokyo-mode-gakuen-cocoon-tower', 'tokyo-mode-gakuen-cocoon-tower.glb', 'Mode Gakuen Cocoon Tower', build(LOW), meta, 6500, 256_000)
await writeModel('tokyo-mode-gakuen-cocoon-tower', 'tokyo-mode-gakuen-cocoon-tower.detail.glb', 'Mode Gakuen Cocoon Tower', build(DETAIL), meta, 40_000, 1536 * 1024)
