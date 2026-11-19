/**
 * Memorial Hall (Confederate Memorial Hall Museum, "Louisiana's Civil War
 * Museum"), 929 Camp Street, New Orleans (Thomas Sully, 1891) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nola-memorial-hall.ts
 *
 * What this model is: the hall alone: its long gabled nave of orange-red
 * brick running back from Camp Street under a dark slate roof, the steep
 * front gable with its triple round-arched window, the projecting entrance
 * porch with the great round arch (red sandstone, on clustered colonnettes)
 * and its lower arcaded wings, the octagonal corner tower with its belfry
 * arcade and slate spire, and the low north annex behind the tower. The
 * Howard Memorial Library south of it and the Ogden's Goldring Hall north of
 * it are nola-ogden-museum.
 *
 * Also the small kit (gabled roofs, octagonal spires) that nola-ogden-museum
 * imports: merge this generator first.
 *
 * Map frame: x = model east, y = model north, z up, metres; bearing 14.5
 * (the hall's long axis, compass 104.5, along x; Camp Street runs along
 * model y), so model +x is the front on Camp Street (compass 104.5).
 * Anchor: the area centroid of the hall's OSM part way/1391223540.
 *
 * Evidence
 * - OSM: the outline way/328848201 (the hall and the Howard Library
 *   together, wikidata Q117486905 = Howard Library), the hall's part
 *   way/1391223540 (x -16..16, y -3.9..3.8), the tower way/1391223538
 *   (round, r 2.1 at (15.7, 5.9)), the porch (x 16..19.3, y -1.8..2.3 in
 *   the outline). The OSM node/367133371 (the museum) stands in it.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in the model frame. The hall stands on a raised front
 *   terrace and lawn (lidar ground 1.3 over the box's minimum) 0.9 m above
 *   the Camp Street sidewalk (0.4); the heights below are from the terrace
 *   and the model lifts them by 0.9, its y = 0 being the sidewalk:
 *   ridge 10.9 over y 0..1 along the whole nave, eaves about 7.0 at
 *   y +-3.5; the porch 5.9; the tower 8.3-9.2 (its spire's thin tip is
 *   not caught); the strip behind the tower (y 4..8) flat at 6.1.
 * - Terrain: flat. elevation 0.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Civil War Museum in New Orleans.jpg", Nolabob, CC BY-SA 3.0: the
 *     front face on (porch arch, colonnettes, triple window, tower)
 *     https://commons.wikimedia.org/wiki/File:Civil_War_Museum_in_New_Orleans.jpg
 *   - "Confederate Memorial Hall New Orleans LA north view.jpg" and "south
 *     view.jpg", NastyCanasta, CC BY-SA 4.0: the front from both sides,
 *     the arcaded porch wings, the tower's plain shaft
 *     https://commons.wikimedia.org/wiki/File:Confederate_Memorial_Hall_New_Orleans_LA_north_view.jpg
 *     https://commons.wikimedia.org/wiki/File:Confederate_Memorial_Hall_New_Orleans_LA_south_view.jpg
 *   - "Memorial Hall, New Orleans November 2024.jpg", Daniel Hartwig,
 *     CC BY 2.0: the slate roofs, the porch gable, the tower and spire
 *     https://commons.wikimedia.org/wiki/File:Memorial_Hall,_New_Orleans_November_2024.jpg
 *   - "Camp Street, New Orleans Central Business District, 12 March 2024 -
 *     Howard Library, Confederate Hall, Ogden Museum.jpg", Infrogmation,
 *     CC BY-SA 4.0, and "Ogden Museum and Confederate Museum, Camp Street,
 *     New Orleans, January 2023.jpg", Infrogmation of New Orleans,
 *     CC BY-SA 4.0: the hall between its neighbours
 *     https://commons.wikimedia.org/wiki/File:Camp_Street,_New_Orleans_Central_Business_District,_12_March_2024_-_Howard_Library,_Confederate_Hall,_Ogden_Museum.jpg
 *     https://commons.wikimedia.org/wiki/File:Ogden_Museum_and_Confederate_Museum,_Camp_Street,_New_Orleans,_January_2023.jpg
 * - Published: Wikipedia "Confederate Memorial Hall": 1891, Thomas
 *   O. Sully, Romanesque Revival, Louisiana's oldest museum.
 *
 * Measured (lidar/OSM), above the terrace (add 0.9 for the model): plan, ridge 11.0, eaves 7.0, porch 6.2 (lidar 5.9 at its ridge cells), annex 6.4
 * (lidar roof 6.1, plus its parapet).
 * Estimated from the photos scaled to those: the porch's width with its
 * arcaded wings (6.8 m; OSM maps only its middle), the great arch (2.8 m
 * wide, 4.3 high), the triple window (6.3-8.9), the tower's cornice (6.6)
 * and spire (to 10.4, the lidar's 8.8 is short of its thin tip; the photos put its cross just over the triple
 * window), the south wall's arched windows. The back (west) end abuts its
 * neighbours and is not photographed.
 * Left out: the carved panels, crockets and finials, the cannon, the
 * planters, the lettering.
 *
 * Night: the front is floodlit; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, circle, save, type XY } from './atl-flatiron-building'
import { faceOf, fpanel, farch, fblock, fprism, tf, qf } from './nola-gallier-hall'

// ───────────────────────────── kit ─────────────────────────────

/**
 * A gabled roof over x0..x1 × y0..y1 with its ridge along x (or along y with
 * `alongY`): eaves at ze, ridge at zr, overhang o at the eaves and e at the
 * ends; both slopes closed underneath. The gable-end triangles go to `wall`
 * (pass null when another mass closes them).
 */
export function gable(roof: Part, wall: Part | null, x0: number, x1: number, y0: number, y1: number, ze: number, zr: number, o = 0.35, e = 0.3, alongY = false) {
  const P = (u: number, v: number, z: number): V3 => (alongY ? [v, u, z] : [u, v, z])
  const [u0, u1, v0, v1] = alongY ? [y0, y1, x0, x1] : [x0, x1, y0, y1]
  const vm = (v0 + v1) / 2, s = (zr - ze) / ((v1 - v0) / 2), zo = ze - s * o
  for (const [va, sg] of [[v0 - o, -1], [v1 + o, 1]] as [number, number][]) {
    const up: V3 = alongY ? [sg * s, 0, 1] : [0, sg * s, 1]
    const a = P(u0 - e, va, zo), b = P(u1 + e, va, zo), c = P(u1 + e, vm, zr), d = P(u0 - e, vm, zr)
    qf(roof, a, b, c, d, up)
    qf(roof, a, b, c, d, [-up[0], -up[1], -up[2]])
  }
  if (wall) {
    for (const [u, sg] of [[u0, -1], [u1, 1]] as [number, number][]) {
      tf(wall, P(u, v0, ze), P(u, v1, ze), P(u, vm, zr), alongY ? [0, sg, 0] : [sg, 0, 0])
    }
  }
}

/** A pointed cone or pyramid (n sides) from radius r at z0 to an apex at z1. */
export function spire(p: Part, c: XY, r: number, z0: number, z1: number, n = 8, phase = Math.PI / 8) {
  const ring = circle(c, r, n, phase)
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n], m = ((i + 0.5) / n) * 2 * Math.PI + phase
    tf(p, [a[0], a[1], z0], [b[0], b[1], z0], [c[0], c[1], z1], [Math.cos(m), Math.sin(m), r / (z1 - z0)])
  }
}

/** A row of round-headed arches on a face: count n, centred at s, pitch, each w wide, z0 to top. */
export function arcade(p: Part, F: ReturnType<typeof faceOf>, s: number, n: number, pitch: number, w: number, z0: number, top: number, d = 0.05) {
  for (let k = 0; k < n; k++) farch(p, F, s + (k - (n - 1) / 2) * pitch, w, z0, top, d)
}

// ───────────────────────────── Memorial Hall ─────────────────────────────

if (import.meta.main) {
  const brick = new Part(), trim = new Part(), slate = new Part(), win = new Part(), door = new Part()

  const X0 = -16, X1 = 16, Y0 = -4, Y1 = 4, EAVE = 7.0, RIDGE = 11.0
  const hall: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  prism(brick, hall, 0, EAVE, null, 0)
  gable(slate, brick, X0, X1, Y0, Y1, EAVE, RIDGE, 0.4, 0.15)
  // red sandstone water table and a string course round the nave
  for (let i = 0; i < 4; i++) {
    const F = faceOf(hall[i], hall[(i + 1) % 4])
    fblock(trim, F, 0, F.L, 0, 0.9, 0.12)
    fblock(trim, F, 0, F.L, EAVE - 0.35, EAVE, 0.18)
  }

  // the front gable on Camp Street: a coped parapet standing proud of the slates
  const front = faceOf([X1, Y0], [X1, Y1])
  const sl = (RIDGE - EAVE) / 4
  fprism(trim, front, [[-0.45, EAVE - 0.1], [0.2, EAVE - 0.1], [4, RIDGE - 0.45], [7.8, EAVE - 0.1], [8.45, EAVE - 0.1], [8.45, EAVE + 0.55], [4, RIDGE + 0.6], [-0.45, EAVE + 0.55]], -0.55, 0.12, true)
  void sl
  // kneelers at the gable's feet
  fblock(trim, front, -0.45, 0.6, EAVE - 0.6, EAVE + 0.55, 0.25)
  fblock(trim, front, 7.4, 8.45, EAVE - 0.6, EAVE + 0.55, 0.25)
  // the triple round-arched window under a sandstone hood, and the roundel over it
  fblock(trim, front, 2.0, 6.0, 6.0, 6.3, 0.15) // sill course
  arcade(win, front, 4, 3, 1.3, 0.95, 6.35, 8.9, 0.06)
  fprism(trim, front, (() => { const pts: XY[] = []; for (let i = 0; i <= 10; i++) { const a = Math.PI * (i / 10); pts.push([4 + 2.25 * Math.cos(a), 8.3 + 0.9 * Math.sin(a)]) } for (let i = 10; i >= 0; i--) { const a = Math.PI * (i / 10); pts.push([4 + 1.95 * Math.cos(a), 8.3 + 0.6 * Math.sin(a)]) } return pts })(), -0.05, 0.14)
  {
    const c = circle([4, 9.7], 0.42, 10)
    fprism(trim, front, c, -0.05, 0.1)
  }
  // small arched windows beside the porch, on the main front
  farch(win, front, 0.8, 0.55, 2.4, 3.6)
  farch(win, front, 7.2, 0.55, 2.4, 3.6)

  // ── the porch: the great arch in a gabled block, arcaded wings either side ──
  const PX0 = X1, PX1 = 19.4, PY = 2.1
  const porch: XY[] = [[PX0 - 0.2, -PY], [PX1, -PY], [PX1, PY], [PX0 - 0.2, PY]]
  prism(trim, porch, 0, 4.6, null, 0)
  gable(slate, trim, PX0 - 0.2, PX1, -PY, PY, 4.6, 6.2, 0.25, 0.25)
  const pf = faceOf([PX1, -PY], [PX1, PY])
  // the gable's coping and the great arch: dark opening, voussoir ring, colonnettes
  fprism(trim, pf, [[-0.25, 4.5], [PY * 2 + 0.25, 4.5], [PY * 2 + 0.25, 4.9], [PY, 6.45], [-0.25, 4.9]], -0.3, 0.12, true)
  {
    const w = 3.0, top = 4.3, r = w / 2, spring = top - r
    const ring: XY[] = []
    for (let i = 0; i <= 10; i++) { const a = Math.PI * (i / 10); ring.push([PY + (r + 0.45) * Math.cos(a), spring + (r + 0.45) * Math.sin(a)]) }
    for (let i = 10; i >= 0; i--) { const a = Math.PI * (i / 10); ring.push([PY + r * Math.cos(a), spring + r * Math.sin(a)]) }
    fprism(trim, pf, ring, -0.05, 0.16)
    farch(door, pf, PY, w, 0.6, top, 0.04)
    for (const s of [PY - r - 0.2, PY + r + 0.2]) fblock(trim, pf, s - 0.22, s + 0.22, 0.6, spring, 0.22)
  }
  // steps up to the porch
  for (let k = 0; k < 4; k++) fblock(trim, pf, PY - 1.6, PY + 1.6, 0, 0.15 * (k + 1), 0.35 * (4 - k), -0.05)
  // the arcaded wings either side of the porch: low blocks with three small arches each
  for (const [ya, yb] of [[-3.7, -PY], [PY, 3.5]] as [number, number][]) {
    const wing: XY[] = [[X1 - 0.1, ya], [18.7, ya], [18.7, yb], [X1 - 0.1, yb]]
    prism(trim, wing, 0, 3.5, slate, 0.12)
    const wf = faceOf([18.7, ya], [18.7, yb])
    arcade(win, wf, wf.L / 2, 2, 0.75, 0.5, 1.2, 2.8, 0.05)
    fblock(trim, wf, -0.05, wf.L + 0.05, 3.3, 3.7, 0.15)
  }

  // ── the corner tower: octagonal shaft, belfry arcade, cornice, slate spire ──
  const TC: XY = [15.7, 5.9], TR = 2.1
  const tw = circle(TC, TR, 8, Math.PI / 8)
  prism(brick, tw, 0, 6.6, null, 0)
  prism(trim, circle(TC, TR + 0.12, 8, Math.PI / 8), 0, 0.9, null, 0)
  prism(trim, circle(TC, TR + 0.1, 8, Math.PI / 8), 4.9, 5.15, null, 0)
  prism(trim, circle(TC, TR + 0.25, 8, Math.PI / 8), 6.6, 7.0, slate, 0.1)
  for (let i = 0; i < 8; i++) {
    const F = faceOf(tw[i], tw[(i + 1) % 8])
    const out = F.n[0] * 1 + F.n[1] * 0.3
    if (F.n[1] < -0.5) continue // the faces into the hall
    farch(win, F, F.L / 2, 0.75, 5.35, 6.45)
    if (out > 0.2 || F.n[1] > 0.5) fpanel(win, F, F.L / 2 - 0.22, F.L / 2 + 0.22, 1.8, 3.9)
  }
  spire(slate, TC, TR + 0.15, 7.0, 10.4)
  // the finial cross
  qf(trim, [TC[0] - 0.08, TC[1], 10.2], [TC[0] + 0.08, TC[1], 10.2], [TC[0] + 0.08, TC[1], 11.2], [TC[0] - 0.08, TC[1], 11.2], [1, 0, 0])
  qf(trim, [TC[0] - 0.08, TC[1] - 0.3, 10.75], [TC[0] - 0.08, TC[1] + 0.3, 10.75], [TC[0] - 0.08, TC[1] + 0.3, 10.9], [TC[0] - 0.08, TC[1] - 0.3, 10.9], [1, 0, 0])

  // ── the north annex behind the tower ──
  const annex: XY[] = [[X0, Y1], [13.8, Y1], [13.8, 7.9], [X0, 7.9]]
  prism(brick, annex, 0, 6.4, slate, 0.25)
  const af = faceOf([13.8, Y1], [13.8, 7.9])
  void af

  // ── the south wall (toward the library): round-headed windows ──
  const south = faceOf([X0, Y0], [X1, Y0])
  for (let k = 0; k < 4; k++) {
    const s = 5 + k * 3.4
    farch(win, south, s, 1.0, 3.6, 6.1)
    fblock(trim, south, s - 0.65, s + 0.65, 3.35, 3.55, 0.12)
  }

  // Heights above were read from the hall's own raised ground (the front
  // terrace, lidar 1.3); the model's y = 0 is the Camp Street sidewalk 0.9 m
  // lower (the lowest ground under the footprint), so everything off the
  // ground is lifted by that and the walls run down to the sidewalk.
  const TERRACE = 0.9
  for (const p of [brick, trim, slate, win, door]) for (let k = 1; k < p.pos.length; k += 3) if (p.pos[k] > 1e-6) p.pos[k] += TERRACE

  const lit = (p: V3, n: V3) => (n[0] > 0.5 && p[0] > 14 ? 0.95 : p[0] > 13 && n[2] < 0.6 ? 0.6 : 0.1)
  await save('nola-memorial-hall', 'Memorial Hall', [
    { part: brick, material: { ...finish('memorial-brick', 0xbe6c4c), floodlight: lit } },
    { part: trim, material: { ...finish('memorial-sandstone', 0x9b5646), floodlight: lit } },
    { part: slate, material: finish('memorial-slate', 0x6c7279) },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x5d4636 } },
  ], { bearing: 14.5, osm: 'way/1391223540', height: 12.5 }, 5000)
}
