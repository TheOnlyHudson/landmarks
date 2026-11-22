/**
 * Veterans Memorial Coliseum, Portland, Oregon (1960; Skidmore, Owings &
 * Merrill) — procedural, CC0-1.0, no textures.
 * bun generators/pdx-veterans-memorial-coliseum.ts
 *
 * Map frame: x and y along the sides of the square glass box (+y at
 * bearing 51.9°, north-east; +x south-east, towards the entrance canopy),
 * z up, metres. Anchor: area centroid of the OSM outline way/34813762,
 * -122.669375, 45.532120. z = 0 is the lowest ground at the footprint
 * (the east side); elevation 0.
 *
 * What makes it read as itself: a plain square box, its lower two thirds
 * a curtain wall of grey tinted glass with the elliptical concrete
 * seating bowl seen through it, its upper third a white panelled fascia,
 * and a flat roof; the low flat entrance canopy on the south-east side.
 *
 * Evidence
 * - OSM: way/34813762 (building=yes, leisure=stadium): the 110 × 110 m
 *   box at 51.9°/141.9° and the canopy, 15 m deep, notched in the middle.
 *   No parts.
 * - Measured, lidar: USGS 3DEP OR_OLCMetro_2019 (flown 2019), 1 m grid.
 *   Ground 5-7 m (east) to 9 m (west) over the box's lowest return; z = 0
 *   here is 6.0. Roof 37.7 m (31.7 above z = 0), flat; its edge 36.7 m.
 *   Canopy 13.5 m (7.5 above z = 0).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Steve Morgan, "Memorial Coliseum wide view from north, 2013.jpg"
 *     (CC BY-SA 3.0; two sides: glass, fascia, canopy at the corner)
 *     https://commons.wikimedia.org/wiki/File:Memorial_Coliseum_wide_view_from_north,_2013.jpg
 *   Steve Morgan, "Veterans Memorial Coliseum in 2013 - Portland,
 *     Oregon.jpg" (CC BY-SA 3.0; the canopy front, the bowl's curve
 *     behind the glass, the fascia's panels)
 *     https://commons.wikimedia.org/wiki/File:Veterans_Memorial_Coliseum_in_2013_-_Portland,_Oregon.jpg
 *   Pete Forsyth, "Moda Center and Memorial Coliseum from the air.jpg"
 *     (CC BY 3.0; the white roof and fascia from above)
 *     https://commons.wikimedia.org/wiki/File:Moda_Center_and_Memorial_Coliseum_from_the_air.jpg
 * - Estimated: the fascia's depth (9 m, 30% of the height seen from the
 *   west plaza in the photos); the mullion and transom spacing; the bowl's
 *   size and rake (an ellipse 100 × 88 m at its rim, 21 m up, down to
 *   64 × 48 m at 3 m), from the curve seen through the glass.
 * - Doubts: the bowl inside is drawn only as its sloped underside and rim.
 *   Not drawn: the four roof columns inside, door frames, signs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, quad, box, type XY } from './dc-nationals-park'

const X0 = -58.5, X1 = 51.5, Y0 = -54.8, Y1 = 54.6
const ROOF = 31.2, GLASS_TOP = 22.7

const fascia = new Part(), glass = new Part(), frame = new Part(), roof = new Part(), concrete = new Part()

// The glass walls, in pieces of 5 m or less, and the white fascia above.
const sides: [XY, XY][] = [[[X0, Y0], [X1, Y0]], [[X1, Y0], [X1, Y1]], [[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, Y0]]]
for (const [a, b] of sides) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: V3 = [e[1], -e[0], 0]
  const at = (u: number, z: number, off = 0): V3 => [a[0] + e[0] * u + o[0] * off, a[1] + e[1] * u + o[1] * off, z]
  const n = Math.ceil(L / 5)
  for (let k = 0; k < n; k++) quad(glass, [at((L * k) / n, 0), at((L * (k + 1)) / n, 0), at((L * (k + 1)) / n, GLASS_TOP), at((L * k) / n, GLASS_TOP)], o)
  quad(fascia, [at(0, GLASS_TOP), at(L, GLASS_TOP), at(L, ROOF), at(0, ROOF)], o)
  // Mullions every bay (16 to a side) and two transoms, a solid frame
  // that carries the glass's outline.
  for (let k = 0; k <= 16; k++) {
    const u = Math.min(L - 0.25, Math.max(0.25, (L * k) / 16))
    quad(frame, [at(u - 0.25, 0, 0.06), at(u + 0.25, 0, 0.06), at(u + 0.25, GLASS_TOP, 0.06), at(u - 0.25, GLASS_TOP, 0.06)], o)
  }
  for (const z of [7.5, 15]) quad(frame, [at(0, z - 0.25, 0.07), at(L, z - 0.25, 0.07), at(L, z + 0.25, 0.07), at(0, z + 0.25, 0.07)], o)
  // A sill under the fascia.
  quad(frame, [at(0, GLASS_TOP - 0.4, 0.08), at(L, GLASS_TOP - 0.4, 0.08), at(L, GLASS_TOP, 0.08), at(0, GLASS_TOP, 0.08)], o)
}
// The flat roof, and the fascia's cap.
prism([[X0 + 0.6, Y0 + 0.6], [X1 - 0.6, Y0 + 0.6], [X1 - 0.6, Y1 - 0.6], [X0 + 0.6, Y1 - 0.6]], ROOF - 0.5, ROOF - 0.05, fascia, roof)

// The seating bowl, seen through the glass: its sloped concrete underside
// from the rim (21 m) down to the arena floor's edge (3 m), and the rim.
{
  const C: XY = [(X0 + X1) / 2, (Y0 + Y1) / 2], N = 24
  const ring = (a: number, b: number, z: number) => Array.from({ length: N }, (_, i): V3 => {
    const t = (2 * Math.PI * i) / N
    return [C[0] + a * Math.cos(t), C[1] + b * Math.sin(t), z]
  })
  const outer = ring(50, 44, 21), lip = ring(50, 44, 22.2), inner = ring(32, 24, 3), floor = ring(32, 24, 0)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N, mid = (p: V3[]) => [(p[i][0] + p[j][0]) / 2 - C[0], (p[i][1] + p[j][1]) / 2 - C[1]]
    const m = mid(outer)
    quad(concrete, [inner[i], inner[j], outer[j], outer[i]], [m[0] * 0.3, m[1] * 0.3, -1])
    quad(concrete, [outer[i], outer[j], lip[j], lip[i]], [m[0], m[1], 0])
    quad(concrete, [inner[i], inner[j], floor[j], floor[i]], [m[0], m[1], 0])
  }
}

// The entrance canopy on the south-east side: two flat slabs (OSM's notch
// between them), each on a pair of tapered posts.
for (const [ya, yb] of [[-24.4, -2.5], [4.0, 26.2]]) {
  prism([[X1, ya], [66.9, ya], [66.9, yb], [X1, yb]], 6.7, 7.5, fascia, roof)
  quad(frame, [[X1, ya, 6.7], [X1, yb, 6.7], [66.9, yb, 6.7], [66.9, ya, 6.7]], [0, 0, -1])
  for (const y of [ya + 5, yb - 5]) box(concrete, [61, y, 3.35], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.6, 0.6, 3.35])
}

// Colours: the fascia white; the glass a dark grey-blue, seen through at
// 0.68; the frame pale; the bowl's concrete a light warm grey.
const parts = [
  { part: fascia, material: finish('vmc-white', 0xedefee) },
  { part: glass, material: { name: 'glass', color: 0x42515d, roughness: 0.24, opacity: 0.68, doubleSided: true } },
  { part: frame, material: finish('vmc-frame', 0xd7dadb) },
  { part: roof, material: PALETTE.roof },
  { part: concrete, material: finish('vmc-concrete', 0xcfc8bb) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Veterans Memorial Coliseum', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 51.9, osm: 'way/34813762', height: ROOF,
  })
  const out = new URL('../models/pdx-veterans-memorial-coliseum.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
