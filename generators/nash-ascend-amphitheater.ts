/**
 * Ascend Amphitheater, Nashville (opened 2015, Metro Riverfront Park;
 * Hodgetts + Fung with Smith Gee Studio) — procedural, CC0-1.0, no
 * textures.  bun generators/nash-ascend-amphitheater.ts
 *
 * Map frame: x across the stage (+x towards the seats and lawn, east-south-
 * east), y along the stage roof's long side (+y north-north-east), z up,
 * metres. Placed at bearing 24°, the pavilion roof's long axis (its long
 * edges run along this axis in the lidar to within a degree). The anchor is
 * the area centroid of OSM way/591997424 (building, amenity=theatre,
 * theatre:type=amphi, wikidata Q20708496), -86.771848, 36.159833.
 *
 * z = 0 is the lowest ground under the footprint, the street side on the
 * west (lidar ground 1.7-1.9 m over the grid's lowest return; the ground
 * rises 3 m to the east, towards the seats). Heights below are above it.
 *
 * What makes it read as itself, from the photos:
 * - the pavilion roof: a long flat silver standing-seam slab, 30 by 48.5 m,
 *   over the stage and the front seats, which at its south end sweeps over
 *   in a curve and down to the stone base, and at its north end stops
 *   square, cantilevered past the stone "Ascend" pylon;
 * - its dark underside and the dark open stage frame between pylon and
 *   swoop, seen from the street over the stone base;
 * - the beige limestone base buildings round the stage, with green roofs
 *   and a glass band, the long back-of-house wing running north under a
 *   grey metal roof.
 *
 * Evidence
 * - Lidar, measured: USGS 3DEP TN_DavidsonCo_1_2022 (2022), 0.5 m grid,
 *   half 70 m, read in this frame. Roof top 21.7 m, flat, x -12 to +18,
 *   y -30 to +18.5; the swoop at its south end falling 20.2, 17.3, 13.6,
 *   9.7 m at y -32.2, -34, -35.6, -36.6; base buildings 8-10 m west of the
 *   stage and under the swoop; the north wing 6-10 m.
 * - OSM: way/591997424 (outline, with the north wing); the three unnamed
 *   building ways 591997416, 591997422 and 591997455, 60-125 m to the south
 *   (box office and concession pavilions by the photos), are separate
 *   buildings the model does not draw or replace.
 * - NAIP (USGS, public domain): plan, the white roof and green roofs.
 * - Published (Wikipedia, "Ascend Amphitheater"): opened July 2015; 6,800
 *   capacity, about 2,600 fixed seats under and before the canopy and a
 *   lawn behind.
 * - Photos (Wikimedia Commons), compared with renders from their sides:
 *   Agaskins3553, "Ascend Aerial.jpg" (CC BY-SA 4.0, from the west, high:
 *   the roof, the swoop, the pylon, the green roofs, the base);
 *   Shane Raynor, "Ascend Amphitheater on August 1, 2015.jpg" (CC BY-SA
 *   2.0, from the street on the west: the roof's edge, the swoop, the pylon,
 *   the dark stage frame, the base's glass band);
 *   Walker Kinsler, "Korean War Veterans Memorial Bridge and Ascend
 *   Amphitheater.jpg" (CC BY-SA 4.0, from the south-west, high: the swoop's
 *   curve, the seats and lawn).
 *
 * Estimated: the roof's thickness (2.2 m at its edges) and the swoop
 * shell's (1.2 m), the stage deck (4 m), the pylon's size and place (from
 * the photos), the glass band's heights. Not drawn: the fixed seats and the
 * lawn (built into the ground: the map's), the lighting masts on the lawn,
 * the lettering, the box office and concession buildings to the south.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const metal = new Part(), dark = new Part(), stone = new Part(), green = new Part(), win = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
function quad(p: Part, P: V3[], hint: V3) {
  const face = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const o = dot(face, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const t = (a: number, b: number, c: number) => {
    if (Math.hypot(...cross(sub(P[o[b]], P[o[a]]), sub(P[o[c]], P[o[a]]))) > 1e-9) p.tri(P[o[a]], P[o[b]], P[o[c]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
/** Box between corners; `top` gets its own part (a green roof); `open` skips faces (+x,-x,+y,-y,+z,-z). */
function abox(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part = p, open: number[] = []) {
  const f: [V3[], V3, Part][] = [
    [[[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0], p],
    [[[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], [-1, 0, 0], p],
    [[[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0], p],
    [[[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0], p],
    [[[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1], top],
    [[[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1], p],
  ]
  f.forEach(([q, n, part], i) => { if (!open.includes(i)) quad(part, q, n) })
}
/** An oriented box: centre (x, y), angle of its length from +y (deg, clockwise), length, width, z range. */
function obox(p: Part, cx: number, cy: number, ang: number, len: number, wid: number, z0: number, z1: number, top: Part = p) {
  const t = (ang * Math.PI) / 180, a: V3 = [Math.sin(t), Math.cos(t), 0], b: V3 = [Math.cos(t), -Math.sin(t), 0]
  const P = (s: number, w: number, z: number): V3 => [cx + a[0] * s + b[0] * w, cy + a[1] * s + b[1] * w, z]
  const L = len / 2, W = wid / 2
  quad(p, [P(-L, -W, z0), P(L, -W, z0), P(L, -W, z1), P(-L, -W, z1)], mul(b, -1))
  quad(p, [P(-L, W, z0), P(L, W, z0), P(L, W, z1), P(-L, W, z1)], b)
  quad(p, [P(L, -W, z0), P(L, W, z0), P(L, W, z1), P(L, -W, z1)], a)
  quad(p, [P(-L, -W, z0), P(-L, W, z0), P(-L, W, z1), P(-L, -W, z1)], mul(a, -1))
  quad(top, [P(-L, -W, z1), P(L, -W, z1), P(L, W, z1), P(-L, W, z1)], [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The pavilion roof. Section in (y, z): the flat slab from the north edge to
// y = -30, then the swoop: outer surface through the lidar's points, the
// inner surface 1.2 m inside it.
const X0 = -12, X1 = 18, TOP = 21.7, BOT = 19.5, NORTH = 18.5
const OUTER: [number, number][] = [[NORTH, TOP], [-30, TOP], [-32.2, 20.2], [-34, 17.3], [-35.6, 13.6], [-36.6, 9.7]]
const INNER: [number, number][] = [[NORTH, BOT], [-29.4, BOT], [-31, 18.4], [-32.5, 16.1], [-34, 13], [-35.1, 9.7]]
for (let i = 0; i < OUTER.length - 1; i++) {
  const [ya, za] = OUTER[i], [yb, zb] = OUTER[i + 1]
  const n: V3 = [0, -(zb - za), yb - ya] // outward: up and south
  const nUp: V3 = n[2] < 0 ? mul(n, -1) : n
  quad(metal, [[X0, ya, za], [X1, ya, za], [X1, yb, zb], [X0, yb, zb]], i === 0 ? [0, 0, 1] : [0, -Math.abs(nUp[1]) - 0.01, nUp[2]])
  const [ia, ja] = INNER[i], [ib, jb] = INNER[i + 1]
  quad(dark, [[X0, ia, ja], [X1, ia, ja], [X1, ib, jb], [X0, ib, jb]], i === 0 ? [0, 0, -1] : [0, 1, -0.3])
  // the shell's two side edges, silver like the fascia
  for (const [x, s] of [[X0, -1], [X1, 1]] as [number, number][])
    quad(metal, [[x, ya, za], [x, yb, zb], [x, ib, jb], [x, ia, ja]], [s, 0, 0])
}
// north edge fascia and the swoop's foot
quad(metal, [[X0, NORTH, BOT], [X1, NORTH, BOT], [X1, NORTH, TOP], [X0, NORTH, TOP]], [0, 1, 0])
quad(metal, [[X0, -36.6, 9.7], [X1, -36.6, 9.7], [X1, -35.1, 9.7], [X0, -35.1, 9.7]], [0, 0, -1])

// Under the roof: the stage deck, the dark open frame of the stage's back
// wall above the base, and the stone "Ascend" pylon at its north end that
// carries the cantilevered roof.
abox(dark, X0, 12, -30, 14, 0, 4)
quad(dark, [[X0 + 0.3, -30, 4], [X0 + 0.3, 11, 4], [X0 + 0.3, 11, BOT], [X0 + 0.3, -30, BOT]], [-1, 0, 0])
quad(dark, [[X0 + 0.3, -30, 4], [X0 + 0.3, 11, 4], [X0 + 0.3, 11, BOT], [X0 + 0.3, -30, BOT]], [1, 0, 0])
abox(stone, -13.5, -6.5, 11, 18, 0, BOT, stone, [4])

// ---------------------------------------------------------------------------
// Base buildings: limestone with green roofs (NAIP, photos) and a glass band.
abox(stone, -22, X0, -44, 25, 0, 9.7, green) // west, behind the stage
abox(stone, X0, 17.5, -42, -30, 0, 9.7, green, [4]) // south, under the swoop
quad(green, [[X0, -42, 9.7], [17.5, -42, 9.7], [17.5, -36.6, 9.7], [X0, -36.6, 9.7]], [0, 0, 1])
obox(stone, 11.2, 42, 17.5, 38, 12, 0, 7.5, metal) // the north wing (OSM), grey metal roof
// glass bands on the street (west) face and the south face
for (const [y0, y1] of [[-40, -9], [-7, 22]] as [number, number][])
  quad(win, [[-22.06, y0, 3.2], [-22.06, y1, 3.2], [-22.06, y1, 7], [-22.06, y0, 7]], [-1, 0, 0])
quad(win, [[-9, -42.06, 3.2], [14, -42.06, 3.2], [14, -42.06, 7], [-9, -42.06, 7]], [0, -1, 0])

// ---------------------------------------------------------------------------
// Materials (five): silver standing-seam roof, dark underside and stage,
// limestone, green roofs, window.
const parts = [
  { part: metal, material: finish('ascend-silver-roof', 0xbfc4c7) },
  { part: dark, material: finish('ascend-underside', 0x575d65) },
  { part: stone, material: finish('ascend-limestone', 0xdccfb5) },
  { part: green, material: finish('green-roof', 0xa3b084) },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Ascend Amphitheater', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 24, osm: 'way/591997424', height: TOP,
})
const outPath = new URL('../models/nash-ascend-amphitheater.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes`)
