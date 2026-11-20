/**
 * Guthrie Theater, Minneapolis (2006, Jean Nouvel) — procedural, CC0-1.0, no
 * textures.
 * bun generators/msp-guthrie-theater.ts
 *
 * Stacked boxes and a drum in midnight-blue metal cladding on the riverfront
 * by the Mill City Museum: the round Wurtele Thrust drum on the west, the tall
 * Dowling Studio block on the east carrying the yellow-glass Amber Box and a
 * scatter of amber slit windows, the McGuire Proscenium block toward the
 * river, the lobby strip between them, and the 54 m cantilevered Endless
 * Bridge reaching out toward the Mississippi. Two thin LED sign pylons stand on
 * the roofs, and a red LED sign stands at the entrance on 2nd Street.
 *
 * The large printed photographs of past productions on the walls are left
 * plain blue, as asked (no textures).
 *
 * Frame: map frame x right, y forward, z up, metres, placed at bearing 30, the
 * street grid's: model +y points to the river (north-north-east), along the
 * Endless Bridge; +x down the river (east-south-east); 2nd Street runs along
 * the −y side. Anchor -93.2553788, 44.9781657, the area centroid of the outline
 * way/129937715. z = 0 is the lowest ground under the footprint, under the
 * bridge on the river side (248.9 m); 2nd Street is 2.4 m higher.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): the outline way/129937715 and its
 *   parts: way/129937709 Wurtele Thrust (the drum), way/129937704 (the centre
 *   block), way/129937720 McGuire Proscenium, way/129937712 Dowling Studio,
 *   way/129937722 Endless Bridge (x 0–11, y 20–73 in this frame). Their
 *   tagged heights (15–33 m) are too low against the lidar and the photos.
 * - Lidar (measured): USGS 3DEP MN_CentralMissRiver_4_B22 (flown 2022), 1 m,
 *   class 18 kept (city notes), above this model's base: drum 29.7 m; centre
 *   block 38 m; lobby strip 26.8 m; McGuire block 29.8 m; Dowling block 54 m;
 *   the Amber Box's top 48 m on the Dowling block's river face (x 10–22);
 *   the Endless Bridge's roof 27 m out to 40 m from the building, its tip
 *   19–20 m; an LED pylon on the Dowling roof to 69.6 m.
 * - Published (Wikipedia, "Guthrie Theater"): Jean Nouvel, opened 2006; the
 *   Endless Bridge cantilevers 178 ft (54 m) toward the river; the Amber Box;
 *   the Wurtele Thrust, McGuire Proscenium and Dowling Studio stages.
 * Photos (evidence, Wikimedia Commons):
 * - Michael Barera, "Minneapolis April 2025 46 (Guthrie Theater from Gold
 *   Medal Park).jpg", CC BY-SA 4.0 (from the south-east: the Dowling block, the
 *   Amber Box, the amber slits, the LED pylon, the lower blocks):
 *   https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_46_(Guthrie_Theater_from_Gold_Medal_Park).jpg
 * - Appraiser at English Wikipedia, "Guthrie-North.jpg", public domain (from the river
 *   side: the drum, the stacked blocks, the bridge, both pylons):
 *   https://commons.wikimedia.org/wiki/File:Guthrie-North.jpg
 * - {just jennifer}, "Guthrie Theater in Minneapolis - July 2015 (19163652843).jpg",
 *   CC BY 2.0 (2nd Street at dusk: the drum, its ribbon window, the red
 *   entrance sign, the lit pylons):
 *   https://commons.wikimedia.org/wiki/File:Guthrie_Theater_in_Minneapolis_-_July_2015_(19163652843).jpg
 * - Michael Barera, "Minneapolis April 2025 22 (Guthrie Theater).jpg", CC
 *   BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_22_(Guthrie_Theater).jpg
 * - Gabriel Vanslette, "Guthrie Theater Walkway - Minneapolis, MN -
 *   panoramio.jpg", CC BY 3.0 (the bridge's underside and end):
 *   https://commons.wikimedia.org/wiki/File:Guthrie_Theater_Walkway_-_Minneapolis,_MN_-_panoramio.jpg
 * - Steve Lyon, "Guthrie Theater-night-2007-03-12.jpg", CC BY-SA 2.0
 *   (night): https://commons.wikimedia.org/wiki/File:Guthrie_Theater-night-2007-03-12.jpg
 *
 * Numbers
 * - Plans: OSM parts in this frame, squared; heights: lidar (above).
 * - The bridge's underside: 16 m at the building rising to 21 m at the end of
 *   the enclosed part (photo-scaled from the river-side photo against the drum's
 *   lidar height); the open tip 13 m long, its roof 19.5 m.
 * - The second pylon, on the centre block, to 56 m: from the river-side photo
 *   (the lidar has a single return there).
 * - The Amber Box 11.5 m wide, standing 7 m out from the Dowling block's river
 *   face, 5 m tall, from 43 m (lidar top; its reach from the Gold Medal Park
 *   photo, where it stands out by about a third of the block's depth).
 * - Colours: midnight-blue cladding held at the palette's dark limit, amber
 *   glass, red LED sign, from the daylight photos.
 *
 * Night: the Amber Box and the amber slits glow (a `window-*` variant), the
 * lobby and bridge glazing glow, the LED pylons and the entrance sign are
 * `neon*`, and the cladding is washed with light (_FLOODLIGHT), the Endless
 * Bridge's underside most (the night photo shows the walls lit blue).
 *
 * Doubts
 * - The printed production images, the drum's balcony slots and the roof
 *   plant are left out.
 * - The second pylon's height and both pylons' colours (the dusk photo has one
 *   red-yellow, one blue-white) are estimated.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE, windowVariant } from './palette'

// Cladding: washed with blue light at night (night photo), the Endless Bridge's
// underside brightest, the roofs barely.
const BLUE = { ...finish('guthrie-blue', 0x4b5266), floodlight: (_p: V3, n: V3) => (n[2] < -0.5 ? 1 : n[2] > 0.5 ? 0.08 : 0.55) }
const AMBER = windowVariant(2, 0xd9a93a)
const WIN = PALETTE.window
const RED = finish('neon-guthrie-red', 0xd94a32)
const BLUELED = finish('neon-guthrie-blue', 0x8fb6e0)
const blue = new Part(), amber = new Part(), win = new Part(), red = new Part(), led = new Part()

const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function poly(p: Part, q: V3[], n: V3) {
  const pts = dot(cross(sub(q[1], q[0]), sub(q[2], q[0])), n) >= 0 ? q : [...q].reverse()
  for (let i = 1; i + 1 < pts.length; i++) p.tri(pts[0], pts[i], pts[i + 1])
}
function prism(p: Part, plan: [number, number][], z0: number, z1: number, bottom = false) {
  const n = plan.length
  for (let i = 0; i < n; i++) {
    const a = plan[i], b = plan[(i + 1) % n]
    poly(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [b[1] - a[1], -(b[0] - a[0]), 0])
  }
  poly(p, plan.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, plan.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
const rect = (x0: number, x1: number, y0: number, y1: number, c = 0.35): [number, number][] =>
  c > 0
    ? [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.35, bottom = false) =>
  prism(p, rect(x0, x1, y0, y1, c), z0, z1, bottom)
/** A flush panel on an axis-aligned face: 'x' faces at x = at (normal ±x), 'y' faces at y = at. */
function panelOn(p: Part, axis: 'x' | 'y', at: number, sign: number, a0: number, a1: number, z0: number, z1: number) {
  const o = 0.05 * sign
  const q: V3[] = axis === 'x'
    ? [[at + o, a0, z0], [at + o, a1, z0], [at + o, a1, z1], [at + o, a0, z1]]
    : [[a0, at + o, z0], [a1, at + o, z0], [a1, at + o, z1], [a0, at + o, z1]]
  poly(p, q, axis === 'x' ? [sign, 0, 0] : [0, sign, 0])
}

// ---- The drum: the Wurtele Thrust ---------------------------------------------------
// OSM way/129937709 is a near half-ellipse on the west; drawn as one.
const DCX = -23.6, DCY = -4.7, DRX = 27.4, DRY = 25.6
const drumPlan: [number, number][] = []
for (let i = 0; i <= 16; i++) {
  const a = Math.PI / 2 + (Math.PI * i) / 16
  drumPlan.push([DCX + DRX * Math.cos(a), DCY + DRY * Math.sin(a)])
}
// smooth sides on the curve
{
  const z1 = 29.7
  for (let i = 0; i + 1 < drumPlan.length; i++) {
    const a = Math.PI / 2 + (Math.PI * i) / 16, b = Math.PI / 2 + (Math.PI * (i + 1)) / 16
    const na: V3 = [Math.cos(a) / DRX, Math.sin(a) / DRY, 0], nb: V3 = [Math.cos(b) / DRX, Math.sin(b) / DRY, 0]
    const A0: V3 = [drumPlan[i][0], drumPlan[i][1], 0], B0: V3 = [drumPlan[i + 1][0], drumPlan[i + 1][1], 0]
    const A1: V3 = [A0[0], A0[1], z1], B1: V3 = [B0[0], B0[1], z1]
    const nn = (v: V3): V3 => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, 0] }
    blue.tri(A0, B0, B1, undefined, undefined, undefined, [nn(na), nn(nb), nn(nb)])
    blue.tri(A0, B1, A1, undefined, undefined, undefined, [nn(na), nn(nb), nn(na)])
    // the ribbon window round the drum, and its upper slot windows
    const off = 1.003
    const P = (q: [number, number], z: number): V3 => [DCX + (q[0] - DCX) * off - 0.0, DCY + (q[1] - DCY) * off, z]
    const r0: V3[] = [P(drumPlan[i], 9.4), P(drumPlan[i + 1], 9.4), P(drumPlan[i + 1], 10.8), P(drumPlan[i], 10.8)]
    poly(win, r0, nn([(na[0] + nb[0]) / 2, (na[1] + nb[1]) / 2, 0]))
  }
  poly(blue, drumPlan.map(([x, y]) => [x, y, 29.7] as V3), [0, 0, 1])
}

// ---- The blocks ---------------------------------------------------------------------
box(blue, -23.5, -0.6, -30.6, 20.6, 0, 38) // centre block (way/129937704)
box(blue, -0.6, 10.2, -30.8, 20.2, 0, 26.8) // lobby strip
box(blue, 10.2, 45, -10, 19.6, 0, 29.8) // McGuire Proscenium
box(blue, 10.2, 44.5, -31.5, -10, 0, 54, 0.45) // Dowling Studio block
// the Amber Box on the Dowling block's river face
box(amber, 10.6, 22.2, -10, -3, 43, 48, 0.2, true)
// the drum's few windows: square lights high up and a slot (photos)
for (const [ang, z0, z1, w] of [[150, 21, 24.5, 0.06], [205, 21, 24.5, 0.06], [180, 15, 16.6, 0.12]] as [number, number, number, number][]) {
  const a0 = ((ang - w * 57.3 / 2) * Math.PI) / 180, a1 = ((ang + w * 57.3 / 2) * Math.PI) / 180, k = 1.004
  const P = (a: number, z: number): V3 => [DCX + DRX * k * Math.cos(a), DCY + DRY * k * Math.sin(a), z]
  poly(win, [P(a0, z0), P(a1, z0), P(a1, z1), P(a0, z1)], [Math.cos((a0 + a1) / 2) / DRX, Math.sin((a0 + a1) / 2) / DRY, 0])
}
// amber slit windows (photos: long horizontal yellow strips, scattered)
for (const [a0, a1, z] of [[-30, -22, 46.5], [-26, -14, 40], [-20, -12.5, 50.5], [-29, -24, 35]] as [number, number, number][]) panelOn(amber, 'x', 10.2, -1, a0, a1, z, z + 0.9)
for (const [a0, a1, z] of [[14, 26, 51], [30, 40, 47], [26, 34, 39], [34, 42, 34]] as [number, number, number][]) panelOn(amber, 'y', -31.5, -1, a0, a1, z, z + 0.9)
for (const [a0, a1, z] of [[-28, -18, 44], [-24, -13, 49.5], [-30, -25, 38]] as [number, number, number][]) panelOn(amber, 'x', 44.5, 1, a0, a1, z, z + 0.9)
for (const [a0, a1, z] of [[26, 40, 50.5], [30, 36, 44.5]] as [number, number, number][]) panelOn(amber, 'y', -10, 1, a0, a1, z, z + 0.9)
for (const [a0, a1, z] of [[-28, -20, 33], [-16, -6, 30.5], [4, 14, 33.5]] as [number, number, number][]) panelOn(amber, 'x', -23.5, -1, a0, a1, z, z + 0.9)
// lobby glazing: 2nd Street entrance and the river side under the bridge
panelOn(win, 'y', -30.8, -1, 0, 9.6, 2.6, 9.5)
panelOn(win, 'y', 20.2, 1, -0.2, 9.8, 3, 8.5)
panelOn(win, 'y', 19.6, 1, 11, 44, 3, 6.5)
// the red LED entrance sign on 2nd Street
box(red, -0.2, 5.4, -31.9, -30.8, 2.4, 13, 0.1)

// ---- The Endless Bridge ---------------------------------------------------------------
{
  const x0 = 0.3, x1 = 10.6, y0 = 20.2, y1 = 60, ytip = 73
  const top = 27, b0 = 16, b1 = 21
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  // sides, top, sloped underside, end wall
  for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) poly(blue, [P(x, y0, b0), P(x, y1, b1), P(x, y1, top), P(x, y0, top)], [s, 0, 0])
  poly(blue, [P(x0, y0, top), P(x1, y0, top), P(x1, y1, top), P(x0, y1, top)], [0, 0, 1])
  poly(blue, [P(x0, y0, b0), P(x1, y0, b0), P(x1, y1, b1), P(x0, y1, b1)], [0, -0.26, -1])
  // its slot windows along both sides and the glazed end
  for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][])
    for (let k = 0; k < 4; k++) {
      const ya = y0 + 3 + k * 9.6, yb = ya + 6.5
      poly(win, [P(x + 0.05 * s, ya, 22.6), P(x + 0.05 * s, yb, 22.6), P(x + 0.05 * s, yb, 24.6), P(x + 0.05 * s, ya, 24.6)], [s, 0, 0])
    }
  poly(win, [P(x0, y1, b1), P(x1, y1, b1), P(x1, y1, top), P(x0, y1, top)], [0, 1, 0])
  // the open tip: a deck under a thin roof on posts
  box(blue, x0, x1, y1, ytip, 17.6, 18.4, 0.2, true)
  box(blue, x0, x1, y1, ytip, 19.2, 19.7, 0.2, true)
  for (const x of [x0 + 0.3, x1 - 0.3]) for (const y of [y1 + 6, ytip - 0.4]) box(blue, x - 0.15, x + 0.15, y - 0.15, y + 0.15, 18.4, 19.2, 0)
}

// ---- LED pylons -----------------------------------------------------------------------
box(red, 25.2, 26.8, -29.2, -27.6, 54, 69.6, 0.1)
box(led, -18.8, -17.2, -6.8, -5.2, 38, 56, 0.1)

// ---- Write -----------------------------------------------------------------------------
const parts = [
  { part: blue, material: BLUE },
  { part: amber, material: AMBER },
  { part: win, material: WIN },
  { part: red, material: RED },
  { part: led, material: BLUELED },
]
const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
const glb = writeGlb('msp-guthrie-theater', parts, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
})
const outPath = process.argv[2] ?? new URL('../models/msp-guthrie-theater.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${tris} triangles, ${glb.length} bytes`)
console.log(parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
