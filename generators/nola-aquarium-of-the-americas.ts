/**
 * Audubon Aquarium of the Americas (1990; renovated 2022-23), 1 Canal
 * Street, New Orleans — procedural, CC0-1.0.
 * bun generators/nola-aquarium-of-the-americas.ts
 *
 * Identity: the teal glass drum at the Canal Street end, cut by a steep
 * slanted glass roof (high on the Canal side, falling to the north-east) under a pale
 * rim; the long low white-tiled building on the riverfront with its grid of
 * big square windows and the open arcade at the plaza; the open lattice
 * cube over the river entrance with the shark sign (pale grey since the
 * renovation; yellow before); the glass atrium with its leaning glass prow
 * at the north end; the taller white block on Canal Street.
 *
 * Frame: bearing 0 (north up), origin at the OSM outline's centroid
 * (-90.063194 29.950901). y = 0 is the street (Canal / the riverfront rail
 * corridor, the lowest ground under the footprint); the river plaza on the
 * east is 2.6 m higher (lidar ground 5.5 vs 2.9; it sits behind the
 * floodwall), so the east facade's arcade starts at z 2.6.
 *
 * Evidence
 * - OSM: way/367725678 (outline, height 30), way/367725655 (the glass drum,
 *   building:part, height 44, skillion glass roof), in relation/7111767.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (2021-22), 1 m grid. Heights above
 *   the street (ground 2.9 in the grid): the west spine 16.3, the river-side
 *   wings 12.8, the skylit block 15.8, the south block 17.2 with a 21.6
 *   penthouse, the Canal Street block 20.3, the cage 15.4, the drum's rim
 *   29.8 at the south-west falling to 16.4 at the north-east (a plane
 *   cut, fitted to the rim returns; the glass top returns nothing).
 *   OSM's 44 m is not borne out by the lidar; the lidar is used.
 * - USGS NAIP 2023-05-04: the plan, the white roofs, the drum's glass disc,
 *   the atrium's white roof and the grey glass prow pointing south-east.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   - "Audubon Aquarium (55151703296).jpg", ajay_suresh, CC BY 4.0
 *     (2025, after the renovation): the river front from the plaza, the
 *     drum in profile, the grey cage and shark sign, the atrium and prow
 *     https://commons.wikimedia.org/wiki/File:Audubon_Aquarium_(55151703296).jpg
 *   - "Aquarium of the Americas from the Mississippi River, New Orleans
 *     October 2024.jpg", lukeharold, CC0: the drum's slanted glass top and
 *     rim, the white grid walls, the cage
 *     https://commons.wikimedia.org/wiki/File:Aquarium_of_the_Americas_from_the_Mississippi_River,_New_Orleans_October_2024.jpg
 *   - "Aquarium of the Americas in New Orleans.JPG", MusikAnimal,
 *     CC BY-SA 4.0: the drum's profile from the river, the arcade
 *     https://commons.wikimedia.org/wiki/File:Aquarium_of_the_Americas_in_New_Orleans.JPG
 *   - "Aquarium of the Americas in New Orleans 2.JPG", MusikAnimal,
 *     CC BY-SA 4.0: the drum from the river
 *     https://commons.wikimedia.org/wiki/File:Aquarium_of_the_Americas_in_New_Orleans_2.JPG
 *   - "Aquarium of the Americas and World Trade Center of New Orleans.jpg",
 *     Yair Haklai, CC BY-SA 4.0: the west (street) side
 *     https://commons.wikimedia.org/wiki/File:Aquarium_of_the_Americas_and_World_Trade_Center_of_New_Orleans.jpg
 *   - "Aquarium of the Americas and Red Streetcar.jpg", Reading Tom,
 *     CC BY 2.0: the Canal Street block with the logo, the drum
 *     https://commons.wikimedia.org/wiki/File:Aquarium_of_the_Americas_and_Red_Streetcar.jpg
 *
 * Measured: the plan (OSM, NAIP) and every height above (lidar).
 * Estimated from the photos: the window grid (2.8 m square openings in
 * 4.5 m bays, two rows), the arcade (z 2.6 to 6.0), the cage's lattice
 * (2.2 m grid, its floor at 4.6), the atrium's height (12.5) and the prow's
 * tip (16.5, glass returns poorly in lidar), the drum's rim band (0.9 m).
 * Left out: lettering, the shark logo's shape (a plain sign panel), the
 * rooftop plant, the mural on the west side.
 *
 * Night: the windows glow; the drum's teal glazing and the atrium are
 * structural glass and stay dark (STYLE.md, Night), the white walls carry a
 * light floodlight share.
 *
 * Doubts: the atrium sits a few metres east of OSM's outline (NAIP followed);
 * the west face's slanted parapet (Haklai photo) is drawn flat.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, circle, toFrame, smoothWall, capPoly, edgePanels, save, type XY } from './atl-flatiron-building'
import { faceOf, fpanel, fblock, qf, tf } from './nola-gallier-hall'

const ANCHOR = { lng: -90.063194, lat: 29.950901 }
const wall = new Part(), roof = new Part(), win = new Part(), teal = new Part(), glass = new Part(), metal = new Part()

// The lidar blocks were read in a frame about (-90.06322, 29.95090); shift them to the anchor.
const L = (x: number, y: number): XY => [x - 2.5, y - 0.1]
const Lr = (pts: [number, number][]): XY[] => pts.map(([x, y]) => L(x, y))
const rectL = (x0: number, x1: number, y0: number, y1: number): XY[] => Lr([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

const OUTLINE = toFrame([[-90.0635318, 29.9513133], [-90.0635577, 29.9513544], [-90.0635808, 29.9514127], [-90.063591, 29.9514899], [-90.0635439, 29.9515113], [-90.0635565, 29.9516573], [-90.0633069, 29.9516467], [-90.0633038, 29.9516228], [-90.0632427, 29.9516286], [-90.0632689, 29.9516819], [-90.0632243, 29.9517061], [-90.0631994, 29.9516656], [-90.0631757, 29.9516259], [-90.0631465, 29.9515742], [-90.0631246, 29.9515284], [-90.0631071, 29.9514873], [-90.0630908, 29.9514517], [-90.0630484, 29.9514221], [-90.0630645, 29.9514062], [-90.0630331, 29.9513821], [-90.0630469, 29.9513673], [-90.063019, 29.9513468], [-90.0630427, 29.9513206], [-90.0630012, 29.9511764], [-90.0629457, 29.951181], [-90.0629444, 29.9511426], [-90.0629222, 29.9510946], [-90.0629349, 29.951061], [-90.0629211, 29.9509209], [-90.0629194, 29.9508993], [-90.0629469, 29.9508986], [-90.0629418, 29.9505713], [-90.0629593, 29.9504386], [-90.0629674, 29.9503572], [-90.0629567, 29.9503071], [-90.0629702, 29.9502478], [-90.0630099, 29.9501983], [-90.0631445, 29.9501586], [-90.06324, 29.9501948], [-90.0633832, 29.9501821], [-90.0634529, 29.9507707], [-90.0635131, 29.9508121], [-90.0634655, 29.9508651], [-90.0635186, 29.9513138]], ANCHOR)

const H_BASE = 12.8, H_SPINE = 16.3, PLAZA = 2.6

// ───────────────────────────── massing ─────────────────────────────

prism(wall, OUTLINE, 0, H_BASE, roof, 0.35)
// the west spine along the street, full width at the north end
const SPINE = Lr([[-22.5, -16], [-8, -16], [-8, 44], [6, 46], [10, 60], [4.3, 80.2], [2.0, 84.6], [-0.4, 89.1], [-4.7, 86.4], [-2.2, 80.5], [-8.1, 79.9], [-8.4, 82.5], [-32.5, 83.7], [-31.2, 67.6], [-35.8, 65.2], [-34.8, 56.7], [-32.6, 50.2], [-30.1, 45.7], [-28.8, 45.7], [-23.7, -3.9], [-28.3, -9.7]])
prism(wall, SPINE, H_BASE - 0.4, H_SPINE, roof, 0.35)
// the skylit block on the river side and its eight rooflights
prism(wall, rectL(3.5, 28.5, -3.5, 28), H_BASE - 0.4, 15.8, roof, 0.3)
for (const [x, y] of [[8, 24], [14, 24], [20, 24], [24.5, 18], [24.5, 10], [24.5, 2], [8, 6], [16, 2]] as XY[]) {
  const [a, b] = L(x, y)
  prism(glass, [[a - 0.8, b - 0.8], [a + 0.8, b - 0.8], [a + 0.8, b + 0.8], [a - 0.8, b + 0.8]], 15.8, 16.5, glass, 0.15)
}
// the south block, its penthouse, and the taller block on Canal Street
prism(wall, Lr([[-22.1, -18], [4, -18], [4, -50], [-18.4, -54]]), H_BASE - 0.4, 17.2, roof, 0.35)
prism(wall, rectL(-8, 2, -34, -20), 16.8, 21.6, roof, 0.3)
prism(wall, Lr([[-16.4, -80], [-2, -80], [-2, -60], [-18.4, -60]]), H_BASE - 0.4, 20.3, roof, 0.35)
// mechanical housings on the roofs (pale grey, as NAIP shows)
for (const r of [rectL(-12, -6, 28, 34), rectL(-6, 0, 2, 8), rectL(-14, -8, -40, -34), rectL(12, 20, -18, -6)]) prism(roof, r, 16, 18.2, roof, 0.2)

// ───────────────────────────── facades ─────────────────────────────

// big square windows in a white grid, two rows, on every long wall of the
// base and the spine; the east (plaza) side over an open arcade
const panelsOn = (ring: XY[], z0: number, z1: number, east: boolean) => {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const Lg = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (Lg < 7) continue
    const nx = (b[1] - a[1]) / Lg // outward normal x (counter-clockwise ring)
    const isEast = nx > 0.6
    if (isEast !== east) continue
    edgePanels(win, a, b, z0, z1, { group: 3.9, gap: 1.1, bay: 4.5, pier: 1.4, margin: 1.2, out: 0.05 })
  }
}
panelsOn(OUTLINE, 4.6, 12.0, false)
panelsOn(OUTLINE, 6.6, 12.0, true)
// the arcade along the plaza: a dark band behind square white piers
for (let i = 0; i < OUTLINE.length; i++) {
  const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length]
  const F = faceOf(a, b)
  if (F.L < 7 || F.n[0] < 0.6) continue
  fpanel(win, F, 0.3, F.L - 0.3, PLAZA - 0.3, 6.0, 0.04)
  const n = Math.max(1, Math.round(F.L / 4.5))
  for (let k = 0; k <= n; k++) {
    const s = Math.min(F.L - 0.5, Math.max(0.5, (F.L * k) / n))
    fblock(wall, F, s - 0.5, s + 0.5, PLAZA - 0.3, 6.0, 0.35)
  }
  fblock(wall, F, 0, F.L, 6.0, 6.6, 0.3, -0.05) // the lintel band over the arcade
}
// the spine's upper storey, seen over the wings on the river side: a row of windows
{
  const F = faceOf(L(-8, -16), L(-8, 44))
  for (let s = 2; s < F.L - 3; s += 4.5) fpanel(win, F, s, s + 2.6, 13.4, 15.6)
}
// the Canal Street block: blank white face with the sign panel, and its east return
{
  const F = faceOf(L(-16.4, -80), L(-2, -80))
  fpanel(win, F, 2.0, 9.0, 12.0, 18.6, 0.06) // the logo sign
}

// ───────────────────────────── the glass drum ─────────────────────────────

const DC = L(8.95, -65.7), DR = 16.4
// the cut is a plane falling to the north-east: 29.8 at the south-west rim, 16.4 at the north-east
const rimZ = (x: number, y: number) => 23.1 - 0.27 * (x - DC[0]) - 0.31 * (y - DC[1])
{
  const n = 24, ring = circle(DC, DR, n)
  // the walls up to the slanted cut, smooth-shaded
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = ring[i], b = ring[j]
    const na: V3 = [(a[0] - DC[0]) / DR, (a[1] - DC[1]) / DR, 0], nb: V3 = [(b[0] - DC[0]) / DR, (b[1] - DC[1]) / DR, 0]
    teal.tri([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], rimZ(b[0], b[1]) - 0.9], undefined, undefined, undefined, [na, nb, nb])
    teal.tri([a[0], a[1], 0], [b[0], b[1], rimZ(b[0], b[1]) - 0.9], [a[0], a[1], rimZ(a[0], a[1]) - 0.9], undefined, undefined, undefined, [na, nb, na])
    // the pale rim band, standing a little proud
    const o = 0.25, A: XY = [DC[0] + (a[0] - DC[0]) * (1 + o / DR), DC[1] + (a[1] - DC[1]) * (1 + o / DR)], B: XY = [DC[0] + (b[0] - DC[0]) * (1 + o / DR), DC[1] + (b[1] - DC[1]) * (1 + o / DR)]
    metal.tri([A[0], A[1], rimZ(a[0], a[1]) - 0.9], [B[0], B[1], rimZ(b[0], b[1]) - 0.9], [B[0], B[1], rimZ(b[0], b[1]) + 0.25], undefined, undefined, undefined, [na, nb, nb])
    metal.tri([A[0], A[1], rimZ(a[0], a[1]) - 0.9], [B[0], B[1], rimZ(b[0], b[1]) + 0.25], [A[0], A[1], rimZ(a[0], a[1]) + 0.25], undefined, undefined, undefined, [na, nb, na])
    qf(metal, [A[0], A[1], rimZ(a[0], a[1]) - 0.9], [B[0], B[1], rimZ(b[0], b[1]) - 0.9], [b[0], b[1], rimZ(b[0], b[1]) - 0.9], [a[0], a[1], rimZ(a[0], a[1]) - 0.9], [0, 0, -1])
    // the rim's top, from the outer edge in to the glass
    const ia: XY = [DC[0] + (a[0] - DC[0]) * 0.94, DC[1] + (a[1] - DC[1]) * 0.94], ib: XY = [DC[0] + (b[0] - DC[0]) * 0.94, DC[1] + (b[1] - DC[1]) * 0.94]
    qf(metal, [A[0], A[1], rimZ(a[0], a[1]) + 0.25], [B[0], B[1], rimZ(b[0], b[1]) + 0.25], [ib[0], ib[1], rimZ(ib[0], ib[1]) + 0.1], [ia[0], ia[1], rimZ(ia[0], ia[1]) + 0.1], [0.27, 0.31, 1])
    // the glass top, a slanted ellipse, gently domed
    tf(glass, [ia[0], ia[1], rimZ(ia[0], ia[1]) + 0.1], [ib[0], ib[1], rimZ(ib[0], ib[1]) + 0.1], [DC[0], DC[1], rimZ(DC[0], DC[1]) + 0.9], [0.27, 0.31, 1])
  }
  // two broad bands of fritted (darker) glass low on the drum, and the
  // mullion rhythm: a few pale vertical bars on the river side
  for (let i = 0; i < n; i += 2) {
    const a = ring[i], b = ring[(i + 1) % n]
    const F = faceOf(a, b)
    if (F.n[1] > 0.55) continue // the north side is inside the building
    fpanel(metal, F, -0.08, 0.08, 0, rimZ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) - 1.0, 0.06)
  }
}

// ───────────────────────────── the cage over the river entrance ─────────────────────────────

{
  const [x0, y0] = L(22.5, -51), [x1, y1] = L(35, -36.5), z0 = 4.6, z1 = 15.4, T = 0.42
  // the wall and windows behind it
  prism(win, [[x0, y0], [x0 + 3, y0], [x0 + 3, y1], [x0, y1]], z0, z1 - 0.4, roof, 0)
  const bar = (a: V3, b: V3) => {
    const lo: V3 = [Math.min(a[0], b[0]) - T / 2, Math.min(a[1], b[1]) - T / 2, Math.min(a[2], b[2]) - T / 2]
    const hi: V3 = [Math.max(a[0], b[0]) + T / 2, Math.max(a[1], b[1]) + T / 2, Math.max(a[2], b[2]) + T / 2]
    const ring: XY[] = [[lo[0], lo[1]], [hi[0], lo[1]], [hi[0], hi[1]], [lo[0], hi[1]]]
    prism(metal, ring, lo[2], hi[2], metal, 0, true)
  }
  const nx = 6, ny = 7, nz = 5
  for (let k = 0; k <= ny; k++) { const y = y0 + ((y1 - y0) * k) / ny; bar([x1, y, z0], [x1, y, z1]); bar([x0 + 3, y, z1], [x1, y, z1]) }
  for (let k = 0; k <= nz; k++) { const z = z0 + ((z1 - z0) * k) / nz; bar([x1, y0, z], [x1, y1, z]); bar([x0 + 3, y0, z], [x1, y0, z]); bar([x0 + 3, y1, z], [x1, y1, z]) }
  for (let k = 1; k < nx; k++) { const x = x0 + 3 + ((x1 - x0 - 3) * k) / nx; bar([x, y0, z0], [x, y0, z1]); bar([x, y1, z0], [x, y1, z1]); bar([x, y0, z1], [x, y1, z1]) }
  // the shark sign hung in the front of the cage
  const F = faceOf([x1, y0], [x1, y1])
  fpanel(win, F, 4.0, 10.0, 8.6, 13.6, 0.25)
  // the canopy over the doors under it
  prism(wall, [[x0 + 3, y0], [x1 + 0.4, y0], [x1 + 0.4, y1], [x0 + 3, y1]], z0 - 0.5, z0, wall, 0.1)
  for (const y of [y0 + 0.4, y1 - 0.4]) prism(metal, circle([x1 - 0.4, y], 0.35, 8), PLAZA, z0 - 0.5, null, 0)
}

// ───────────────────────────── the north atrium and its glass prow ─────────────────────────────

{
  const [ax0, ay0] = L(8, 40), [ax1, ay1] = L(23, 61), H = 12.5
  // glass walls on a short white base, white roof
  prism(wall, [[ax0, ay0], [ax1, ay0], [ax1, ay1], [ax0, ay1]], 0, PLAZA + 0.8, null, 0)
  prism(glass, [[ax0, ay0], [ax1, ay0], [ax1, ay1], [ax0, ay1]], PLAZA + 0.8, H, null, 0)
  prism(wall, [[ax0 - 0.2, ay0 - 0.2], [ax1 + 0.2, ay0 - 0.2], [ax1 + 0.2, ay1 + 0.2], [ax0 - 0.2, ay1 + 0.2]], H, H + 0.6, roof, 0.15)
  // the prow: a leaning glass wedge off the atrium's south-east corner
  const A: V3 = [...L(12, 40.2), 0] as V3, B: V3 = [...L(23, 46), 0] as V3, G: V3 = [...L(25.5, 34), 0] as V3
  const A1: V3 = [A[0], A[1], H + 0.6], B1: V3 = [B[0], B[1], H + 0.6], T: V3 = [...L(30.5, 29.5), 16.5] as V3
  const nrm = (p: V3, q: V3, r: V3): V3 => { const u = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], v = [r[0] - p[0], r[1] - p[1], r[2] - p[2]]; return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]] }
  const C: V3 = [(A[0] + B[0] + G[0]) / 3, (A[1] + B[1] + G[1]) / 3, 6]
  const out = (p: V3, q: V3, r: V3): V3 => { const n = nrm(p, q, r), m = [(p[0] + q[0] + r[0]) / 3 - C[0], (p[1] + q[1] + r[1]) / 3 - C[1], (p[2] + q[2] + r[2]) / 3 - C[2]]; return n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0 ? n : [-n[0], -n[1], -n[2]] }
  const face = (p: Part, pts: V3[]) => { for (let i = 1; i < pts.length - 1; i++) tf(p, pts[0], pts[i], pts[i + 1], out(pts[0], pts[i], pts[i + 1])) }
  face(glass, [A, G, T, A1]) // the west face
  face(glass, [G, B, B1, T]) // the east face
  face(roof, [A1, T, B1]) // the standing-seam metal top
}

// ───────────────────────────── write ─────────────────────────────

const glow = (p: V3, n: V3) => (n[2] < 0.5 && p[2] > 3 ? 0.25 : 0)
await save('nola-aquarium-of-the-americas', 'Audubon Aquarium of the Americas', [
  { part: wall, material: { ...PALETTE.stone, name: 'tile', color: 0xeeefeb, floodlight: glow } },
  { part: roof, material: finish('aquarium-roof', 0xd2d6d7) },
  { part: win, material: PALETTE.window },
  { part: teal, material: finish('aquarium-drum-glass', 0x6fa7a3, 0.3) },
  { part: glass, material: { ...PALETTE.glass, color: 0xc9dde2 } },
  { part: metal, material: finish('aquarium-steel', 0xb7bec2) },
], { bearing: 0, osm: 'way/367725678', height: 30.0 }, 5000)
