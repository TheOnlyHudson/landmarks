/**
 * Steve Jobs Theater, Apple Park, Cupertino: the lobby pavilion on the hill
 * south-east of the ring, a frameless glass cylinder under a thin, gently
 * domed carbon-fibre disc roof that rests on the glass alone. The auditorium
 * is underground and not modelled. Original procedural geometry, CC0-1.0.
 * bun generators/sf-steve-jobs-theater.ts
 *
 * Frame: BEARING 0 (round). x east, y north, z up, metres. Origin = centre of
 * the roof disc fitted to the lidar edge, which sits 1.8 m east and 1.1 m
 * south of the OSM outline's vertex centroid. y = 0 is the paved plaza round
 * the pavilion (56.9 m NAVD88), flat to 0.1 m all round; the hill falls away
 * beyond it to the south-east and rises to a berm on the south-west, all of
 * which is the map's terrain.
 *
 * Evidence
 * - OSM way/491340789 ("Steve Jobs Theater", building, glass, height 6,
 *   radius 18.5-20.1 m from its centroid) and way/521662177 (building=roof,
 *   carbon fibre, min_height 6.6, height 7, radius 22.9-24.7). Both replaced.
 * - USGS 3DEP lidar (CA_SantaClaraCounty_2020) at 0.5 m: the roof disc is a
 *   circle of radius 23.95 m (rms 0.4 m round 107 of 180 edge samples; the
 *   rest hidden by trees), domed from 7.68 m above the plaza at its centre
 *   to 7.55 at r 10, 7.23 at r 20 and 7.06 at its edge.
 * - Published (Foster + Partners, Wikipedia): opened 2017; the roof is a
 *   carbon-fibre disc about 47 m across carried only by the glass, with no
 *   columns or mullions; the glass is about 6.7 m (22 ft) tall.
 * - Photos (Wikimedia Commons): "Steve Jobs Theater - external.jpg" (Justin
 *   Ormont, CC BY 4.0: the glass drum, panel joints, the overhang, the pale
 *   soffit with a ring of light in it, the knife-thin roof edge); "Apple Park
 *   Steve Jobs Theater.jpg" (Nicolapps, CC BY 4.0: the pavilion from the
 *   meadow, the overhang reading as a thin dark disc over the glass).
 *
 * Estimated: the glass radius, 19.5 m, from the gap between the two OSM
 * outlines (~4 m) and the overhang in Nicolapps' photo (glass 0.8 of the roof); the glass height 6.5
 * (published 22 ft, and the lidar edge less the roof's thickness); the roof
 * edge 0.25 m thick, thickening to 0.55 m over the glass; 44 glass panels
 * (~2.85 m, counted against the 6.5 m height in Ormont's photo); the ceiling
 * light ring at r 13. NAIP was unavailable (USGS 504s) when this was built;
 * the roof's top colour is OSM's "grey" and the edge seen in photos.
 * Colours: glass a dark grey-blue and the roof edge and soffit a darker
 * silver than the pale top, as both photos show them; the ceiling is a
 * window material so the lobby glows at night.
 * Not modelled: the plaza paving and planting (ground), the stairs and lift
 * down to the auditorium (sunk into the floor; the floor is the map's).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 0
const ANCHOR = { lng: -122.00744106, lat: 37.3308726 }

const R_ROOF = 23.95 // lidar
const R_GLASS = 19.5 // estimated
const GLASS_H = 6.5
const PANELS = 44
const FINS = 22 // a fin at every other joint, kept faint
const N = 64 // stations round the disc

const roof = new Part(), edge = new Part(), glass = new Part(), sill = new Part(), ceiling = new Part()
const P = (a: number, r: number, z: number): V3 => [r * Math.sin(a), r * Math.cos(a), z]
type RZ = [number, number]

/** A band of the surface of revolution between profile points, smooth round, `hint` on its outside. */
function band(part: Part, A: RZ, B: RZ, hint: RZ, n = N) {
  const dr = B[0] - A[0], dz = B[1] - A[1], l = Math.hypot(dr, dz)
  let nr = dz / l, nz = -dr / l
  if (nr * hint[0] + nz * hint[1] < 0) { nr = -nr; nz = -nz }
  const nm = (a: number): V3 => [nr * Math.sin(a), nr * Math.cos(a), nz]
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
    if (A[0] === 0 || B[0] === 0) {
      // a fan to the axis
      const [C, R] = A[0] === 0 ? [A, B] : [B, A]
      part.tri(P(0, 0, C[1]), P(a0, R[0], R[1]), P(a1, R[0], R[1]), undefined, undefined, undefined, [nm(a0), nm(a0), nm(a1)])
      continue
    }
    part.tri(P(a0, A[0], A[1]), P(a1, A[0], A[1]), P(a1, B[0], B[1]), undefined, undefined, undefined, [nm(a0), nm(a1), nm(a1)])
    part.tri(P(a0, A[0], A[1]), P(a1, B[0], B[1]), P(a0, B[0], B[1]), undefined, undefined, undefined, [nm(a0), nm(a1), nm(a0)])
  }
}

// The roof disc: a shallow dome on top (lidar), a knife edge, a soffit that
// thickens toward the glass, and a flat ceiling inside it.
const TOP: RZ[] = [[0, 7.68], [10, 7.55], [16, 7.39], [20, 7.23], [R_ROOF - 0.35, 7.1]]
for (let k = 0; k < TOP.length - 1; k++) band(roof, TOP[k], TOP[k + 1], [0, 1])
band(roof, TOP[TOP.length - 1], [R_ROOF, 7.0], [1, 1])
band(edge, [R_ROOF, 7.0], [R_ROOF, 6.72], [1, 0])
band(edge, [R_ROOF, 6.72], [R_GLASS, GLASS_H], [0, -1])
// Inside: the ceiling, with the recessed ring of light seen through the glass.
band(ceiling, [R_GLASS, GLASS_H], [13.6, GLASS_H], [0, -1])
band(ceiling, [13.6, GLASS_H], [13.6, GLASS_H + 0.2], [-1, 0])
band(ceiling, [13.6, GLASS_H + 0.2], [12.4, GLASS_H + 0.2], [0, -1])
band(ceiling, [12.4, GLASS_H + 0.2], [12.4, GLASS_H], [1, 0])
band(ceiling, [12.4, GLASS_H], [0, GLASS_H], [0, -1])

// The glass drum, seen through from outside (double-sided material), with
// its foot in a thin metal sill and a glass fin inside each panel joint,
// which draws as the faint joint lines.
band(glass, [R_GLASS, 0.12], [R_GLASS, GLASS_H], [1, 0], PANELS * 2)
band(sill, [R_GLASS + 0.12, 0], [R_GLASS + 0.12, 0.12], [1, 0])
band(sill, [R_GLASS + 0.12, 0.12], [R_GLASS - 0.05, 0.12], [0, 1])
for (let k = 0; k < FINS; k++) {
  const a = (2 * Math.PI * k) / FINS
  const er: V3 = [Math.sin(a), Math.cos(a), 0], et: V3 = [Math.cos(a), -Math.sin(a), 0]
  const at = (r: number, t: number, z: number): V3 => [er[0] * r + et[0] * t, er[1] * r + et[1] * t, z]
  const r0 = R_GLASS - 0.12, r1 = R_GLASS - 0.01, t = 0.02
  glass.quad(at(r0, t, 0.12), at(r1, t, 0.12), at(r1, t, GLASS_H), at(r0, t, GLASS_H))
  glass.quad(at(r1, -t, 0.12), at(r0, -t, 0.12), at(r0, -t, GLASS_H), at(r1, -t, GLASS_H))
  glass.quad(at(r0, -t, 0.12), at(r0, t, 0.12), at(r0, t, GLASS_H), at(r0, -t, GLASS_H))
}

const parts = [
  { part: roof, material: finish('carbon-roof', 0xdcdfe0, 0.6) },
  { part: edge, material: finish('roof-edge', 0x8a9197, 0.4) },
  // The lobby ceiling glows at night through the glass (lit for events): a window material in the trim colour.
  { part: ceiling, material: { name: 'window', color: 0xfff0dd, roughness: 0.85 } },
  { part: glass, material: { ...PALETTE.glass, color: 0x6f8794, opacity: 0.4, doubleSided: true } },
  { part: sill, material: finish('sill-steel', 0x6e747b) },
]
const glb = writeGlb('Steve Jobs Theater', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 7.68,
  frame: 'Y up, -Z north, +X east, metres; origin at the centre of the roof disc, on the plaza',
  replaces: ['way/491340789', 'way/521662177'],
})
const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
if (tris > 5000 || glb.length > 250 * 1024) throw new Error(`over budget: ${tris} triangles, ${glb.length} bytes`)
await Bun.write(new URL('../models/sf-steve-jobs-theater.glb', import.meta.url), glb)
console.log(`sf-steve-jobs-theater.glb: ${tris} triangles, ${glb.length} bytes`)
