/**
 * Jon M. Huntsman Center (Special Events Center, 1969), University of
 * Utah, Salt Lake City — procedural, CC0-1.0, no textures.
 *   bun generators/slc-huntsman-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (round). The anchor
 * is the area centroid of the outline (way/33633100, building=stadium,
 * Q6271169); the dome part (way/1319349564) shares its centre within 0.5 m.
 *
 * A round arena under a shallow ribbed metal dome:
 *   - the dome: springs at r 55, 9.8 m, and rises to 27 m at r 6, where a
 *     low lantern ring (to 28 m) and a small cap (30.5 m) finish it; the
 *     profile is the lidar's, ring by ring (r 54: 9.8, 46: 14.7, 38: 18.9,
 *     30: 22.4, 22: 24.6, 14: 26.1, 6: 27). Drawn flat-faceted in 40 gores,
 *     which reads as its standing-seam ribs;
 *   - the eave: a deep cream concrete fascia ring at r 56.5, 8 to 9.8 m,
 *     carried by 40 cream concrete piers that stand between the tall
 *     concourse windows (r 53.5, 3.7 to 8 m) and kink outward at the top
 *     (Tricia Simpson's photo);
 *   - the ground floor: a red-brown brick drum to r 63, 3.7 m, with a cream
 *     parapet band and the concourse terrace on its roof (lidar: 3.7 m from
 *     r 56.5 to 63–65 all round); at the four entrances (OSM roof parts
 *     way/1421051608–611, a pinwheel of 22° arcs starting at each compass
 *     point) the drum stops and glass doors stand under a thin canopy.
 *
 * Elevation 0: the ground is flat round the building (Mapterhorn 7.0 m ±0.1
 * within the footprint; it falls away only beyond the south-west corner).
 *
 * Evidence
 * - OSM: way/33633100 outline; parts way/1319349564 (dome), way/1421051607
 *   (roof), way/1421051608, 1421051609, 1421051610, 1421051611 (entrance
 *   roofs).
 * - Lidar: USGS_LPC_UT_Wasatch_L4_2013_LAS_2016 (flown 2013), 1 m: the
 *   dome profile, eave, lantern and terrace heights; the plan radii.
 * - Photos (Wikimedia Commons):
 *   Tricia Simpson, "Huntsman Center.jpeg" (CC BY-SA 3.0; the piers, the
 *     fascia, the brick ground floor, an entrance);
 *   Klubbit, "Uofu huntsmancenter.jpg" (public domain; the whole elevation
 *     with the ribbed dome);
 *   Jeff Hitchcock, "Jon M. Huntsman Center (30987753554).jpg" and
 *     "(30987758474).jpg" (CC BY 2.0; the dome's silhouette from afar).
 * Estimated: the window and fascia band heights (photo, scaled to the
 *   lidar's 3.7 m terrace and 9.8 m eave); the canopy depth.
 * Left out: the grand stairs to the concourse terrace, lettering, railings.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, quad } from './dc-nationals-park'

const dome = new Part(), cream = new Part(), brick = new Part(), glass = new Part(), doors = new Part(), deck = new Part()

const N = 40 // gores and piers
const ang = (i: number) => (i / N) * 2 * Math.PI
const at = (r: number, a: number, z: number): V3 => [r * Math.sin(a), r * Math.cos(a), z]
const out = (a: number): V3 => [Math.sin(a), Math.cos(a), 0]

/** A ring band (vertical, facing out or in) between two angles. */
function band(p: Part, r: number, z0: number, z1: number, a0: number, a1: number, seg: number, inward = false) {
  for (let k = 0; k < seg; k++) {
    const a = a0 + ((a1 - a0) * k) / seg, b = a0 + ((a1 - a0) * (k + 1)) / seg
    const m = (a + b) / 2
    const n = inward ? [-Math.sin(m), -Math.cos(m), 0] as V3 : out(m)
    quad(p, [at(r, a, z0), at(r, b, z0), at(r, b, z1), at(r, a, z1)], n, inward ? undefined : [out(a), out(b), out(b), out(a)])
  }
}
/** A flat annulus between two radii at height z (facing up or down). */
function annulus(p: Part, r0: number, r1: number, z: number, a0: number, a1: number, seg: number, up = true) {
  for (let k = 0; k < seg; k++) {
    const a = a0 + ((a1 - a0) * k) / seg, b = a0 + ((a1 - a0) * (k + 1)) / seg
    quad(p, [at(r0, a, z), at(r1, a, z), at(r1, b, z), at(r0, b, z)], [0, 0, up ? 1 : -1])
  }
}

// --- The dome (lidar profile) ---
const PROFILE: [number, number][] = [[55, 9.8], [50, 12.3], [46, 14.7], [42, 16.9], [38, 18.9], [34, 20.7], [30, 22.4], [26, 23.6], [22, 24.6], [18, 25.5], [14, 26.1], [10, 26.6], [6.5, 27.0]]
for (let i = 0; i < N; i++) {
  const a = ang(i), b = ang(i + 1)
  for (let k = 0; k < PROFILE.length - 1; k++) {
    const [r0, z0] = PROFILE[k], [r1, z1] = PROFILE[k + 1]
    quad(dome, [at(r0, a, z0), at(r0, b, z0), at(r1, b, z1), at(r1, a, z1)], [0, 0, 1])
  }
}
// The lantern ring and its cap.
band(cream, 6.5, 26.8, 28.2, 0, 2 * Math.PI, 16)
annulus(dome, 2, 6.5, 28.2, 0, 2 * Math.PI, 16)
band(cream, 2, 28.2, 30.5, 0, 2 * Math.PI, 12)
annulus(dome, 0, 2, 30.5, 0, 2 * Math.PI, 12)

// --- The eave: fascia ring and its soffit ---
band(cream, 56.5, 8, 9.9, 0, 2 * Math.PI, N)
annulus(cream, 55, 56.5, 9.9, 0, 2 * Math.PI, N)
annulus(cream, 53.5, 56.5, 8, 0, 2 * Math.PI, N, false)

// --- The concourse: tall windows between kinked piers ---
band(glass, 53.5, 3.7, 8, 0, 2 * Math.PI, N)
for (let i = 0; i < N; i++) {
  const a = ang(i) + Math.PI / N, o = out(a), t: V3 = [Math.cos(a), -Math.sin(a), 0], Z: V3 = [0, 0, 1]
  box(cream, at(54.1, a, 5.6), [o, t, Z], [0.6, 0.45, 1.9]) // the upright
  // The knee: a sloped bracket out to the fascia.
  const k0 = at(54.1, a, 7.4), k1 = at(56.3, a, 8.6)
  const d: V3 = [k1[0] - k0[0], k1[1] - k0[1], k1[2] - k0[2]], L = Math.hypot(...d), u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const up: V3 = [u[1] * t[2] - u[2] * t[1], u[2] * t[0] - u[0] * t[2], u[0] * t[1] - u[1] * t[0]]
  box(cream, [(k0[0] + k1[0]) / 2, (k0[1] + k1[1]) / 2, (k0[2] + k1[2]) / 2], [u, t, up], [L / 2 + 0.3, 0.45, 0.6])
}

// --- The ground floor: brick drum, terrace, entrances ---
// Entrances: 22° arcs clockwise from each compass point (OSM).
const ENT = 22 * (Math.PI / 180)
for (let q = 0; q < 4; q++) {
  const e0 = (q * Math.PI) / 2, e1 = e0 + ENT, n0 = e1, n1 = e0 + Math.PI / 2
  // The drum between entrances.
  band(brick, 63, 0, 2.7, n0, n1, 8)
  band(cream, 63, 2.7, 3.7, n0, n1, 8)
  annulus(deck, 53.5, 63, 3.7, n0, n1, 8)
  for (const a of [n0, n1]) {
    const t: V3 = [Math.cos(a), -Math.sin(a), 0], sgn = a === n0 ? -1 : 1
    quad(brick, [at(53.5, a, 0), at(63, a, 0), at(63, a, 3.7), at(53.5, a, 3.7)], [t[0] * sgn, t[1] * sgn, 0])
  }
  // The entrance: glass doors under a thin canopy.
  band(doors, 53.5, 0, 3.2, e0, e1, 3)
  band(cream, 53.5, 3.2, 3.7, e0, e1, 3)
  annulus(cream, 53.5, 58, 3.7, e0, e1, 3)
  annulus(cream, 53.5, 58, 3.25, e0, e1, 3, false)
  band(cream, 58, 3.25, 3.7, e0, e1, 3)
}

// ---------------------------------------------------------------------------
const parts = [
  { part: dome, material: finish('huntsman-dome', 0xc8c7c0) },
  { part: cream, material: PALETTE.trim },
  { part: brick, material: finish('huntsman-brick', 0xa86a58) },
  { part: glass, material: PALETTE.window },
  { part: doors, material: { ...PALETTE.entrance, color: 0x74889a } }, // glass doors
  { part: deck, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Jon M. Huntsman Center', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 0, osm: 'way/33633100', height: 30.5,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const outPath = new URL('../models/slc-huntsman-center.glb', import.meta.url).pathname
  await Bun.write(outPath, glb)
  console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes`)
}
