/**
 * The Parthenon, Centennial Park, Nashville (1897 exposition building,
 * rebuilt in concrete 1920–31 by Russell Hart; a full-scale replica of the
 * Athenian Parthenon, complete and polychromed): procedural, CC0-1.0.
 * bun generators/nash-parthenon.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 56.5: the
 * model's +y is the temple's long axis (ENE), +x its SSE flank. The model is
 * mirrored about both axes, as the temple is.
 * Anchor -86.8134273, 36.1496883: the centre of the stylobate as the lidar
 * shows it. OSM way/130913355 (Q1467467) has the right width and bearing
 * (edges at 56.5° / 146.5°) but runs 82.5 m long, about 10 m past the
 * lidar roof at the ENE end; its centroid (-86.8133823, 36.1497158) is
 * 5.05 m along the axis and 0.3 m across from the building's centre, so the
 * anchor was moved onto the building (overlay of OSM, lidar and NAIP in
 * landmarks-scratch/nash/work/nash-parthenon/ov.png). Doubt: OSM's long end.
 * y = 0 is the ground the steps stand on (lidar ground 4.2–4.4 m above the
 * box's ground_min of 159.36 m; the site is flat within 0.2 m; Mapterhorn
 * shows the building as a 3 m plateau, which the map fills).
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 0.5 m
 * grid, read with tools/lidar_frame.py at bearing 56.5, above y = 0:
 * side eaves 15.2–15.4; ridge 19.1–19.2 (roof pitch 13.6°); pediment apex
 * with its acroterion base 19.85 (published total 19.8 m); acroterion
 * tops up to 21.1. Roof outline 33 × 71.1 m (stylobate plus the cornice's
 * overhang).
 *
 * Published (Wikipedia, "Parthenon" and "Parthenon (Nashville)"; the
 * replica copies the Athenian dimensions): stylobate 30.88 × 69.5 m; Doric
 * peripteral, 8 × 17 columns; columns 10.4 m tall, 1.9 m in diameter;
 * axial spacing 4.3 m with the corner intercolumns contracted (3.7 m);
 * a hexastyle porch at each end in front of the cella; three-step
 * crepidoma; 92 metopes (14 per end, 32 per side); entablature about
 * 3.3 m (architrave, frieze of triglyphs and metopes, cornice).
 *
 * Photos (EVIDENCE, Wikimedia Commons; local copies in
 * landmarks-scratch/nash/work/nash-parthenon/photos):
 *  p02 "Parthenon in Nashville 2025.jpg", BullDawg2021, CC BY 4.0
 *      https://commons.wikimedia.org/wiki/File:Parthenon_in_Nashville_2025.jpg
 *  p03 "The Parthenon, Nashville, Tennessee.jpg", Aaron Archuleta, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:The_Parthenon,_Nashville,_Tennessee.jpg
 *  p05 "The Parthenon, Nashville.JPG", Mayur Phadtare, CC BY-SA 3.0 (end on)
 *      https://commons.wikimedia.org/wiki/File:The_Parthenon,_Nashville.JPG
 *  p07 "Nashville Parthenon from south.jpg", Dave Pape, public domain (flank)
 *      https://commons.wikimedia.org/wiki/File:Nashville_Parthenon_from_south.jpg
 *  p08 "Parthenon Nashville 2024a.jpg", Antony-22, CC BY-SA 4.0 (steps,
 *      antefixes, griffin acroterion)
 *      https://commons.wikimedia.org/wiki/File:Parthenon_Nashville_2024a.jpg
 *  p13 "Corner of Parthenon in Nashville, TN, US.jpg", Bubba73 (Jud McCranie), CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:Corner_of_Parthenon_in_Nashville,_TN,_US.jpg
 *  p14 "Parthenon in Centennial Park in Nashville, TN.jpg", John LaGuardia,
 *      CC BY-SA 4.0 (pediment: red tympanum, pale figures, red metopes,
 *      inner porch, steps)
 *      https://commons.wikimedia.org/wiki/File:Parthenon_in_Centennial_Park_in_Nashville,_TN.jpg
 *  n01 "Nashville Parthenon at night at night 2024.jpg", Jschnake, CC BY-SA 4.0
 *      https://commons.wikimedia.org/wiki/File:Nashville_Parthenon_at_night_at_night_2024.jpg
 *  USGS NAIP (public domain): plan, the pale apron, roof colour (sunlit
 *  slope #b0af9e, a warm grey).
 * No look-only sources. No commercial imagery.
 *
 * Estimated (from the photos, scaled to the lidar and published sizes):
 * steps 3 × 0.52 m high, 0.7 m treads (people on p08); capitals (echinus
 * 0.45 m, abacus 2.05 m square × 0.35); cornice projection 0.75 m; the
 * inner platform (two 0.35 m steps), the cella (21.2 m wide) and the inner
 * porch columns (1.7 m, 3.56 m apart); bronze doors 4.8 × 7.6 m;
 * antefixes drawn at half their real density (one per 2.15 m, as the
 * style guide allows for thin repeated members); the pediment sculpture
 * as one pale relief band with a stepped top in front of a darker buff
 * tympanum (p14 shows the tympanum ground painted red; the lead's review
 * asked for buff stone there, keeping red only on the metopes); acroteria (palmette at each
 * apex, a griffin at each corner) as bold simple masses.
 * Left out: fluting, triglyph grooves, guttae, the blue mutule band, the
 * relief carving (metopes are flat rose fields, as they read
 * from a distance), the lower-level museum entrance, the light poles.
 * Metopes are a dusty rose (red ground half covered by pale relief at a
 * distance).
 * Colours: buff concrete aggregate sampled from p02/p03/p08 (#7f725b in
 * shade, khaki), pulled to palette lightness; metope red
 * from p14; roof warm grey from NAIP.
 * Night: floodlit from the ground (n01; colour-changing column lights,
 * drawn warm white); doors are `entrance` (open and lit in n01).
 */
import { Part, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, capRing, lathe, flatShape, extrudeShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, quadO, triO, gable } from './nash-tennessee-state-capitol'

// Plan (published, placed on the lidar footprint).
const SX = 15.44, SY = 34.75 // stylobate half sizes
const STEP = 0.52, TREAD = 0.7
const STYL = 3 * STEP // stylobate top
const COLTOP = STYL + 10.43 // top of the abacus
const ARCH = COLTOP + 1.35, FRIEZE = ARCH + 1.35, EAVES = FRIEZE + 0.6 // 15.29
const OVER = 0.75 // cornice overhang
const RIDGE = EAVES + (SX + OVER) * Math.tan((13.6 * Math.PI) / 180) // 19.2
const IN0 = STYL + 0.7 // the inner platform's top
const CX = 10.6, CY = 25.6 // cella walls (outer faces)

function axes(n: number, ends: boolean): number[] {
  // 8 or 17 columns: normal 4.296 m intercolumns, corner ones 3.68 m
  const k = n - 3, half = (k * 4.296) / 2
  const out: number[] = []
  for (let i = 0; i <= k; i++) out.push(-half + i * 4.296)
  return [-half - 3.68, ...out, half + 3.68].map((v) => (ends ? v : v))
}

function doric(shaft: Part, cap: Part, x: number, y: number, r0: number, r1: number, z0: number, z1: number, ab: number) {
  const zc = z1 - 0.35, ze = zc - 0.45
  lathe(shaft, x, y, [[r0, z0], [r1, ze]], 12)
  lathe(cap, x, y, [[r1, ze], [ab * 0.47, zc]], 12)
  box(cap, x - ab / 2, y - ab / 2, x + ab / 2, y + ab / 2, zc, z1, null)
}

/** A step: risers all round and the exposed tread ring, split into ≤ 5 m pieces for the terrain. */
function step(p: Part, hx: number, hy: number, z0: number, z1: number, tread: number) {
  const n = (L: number) => Math.max(1, Math.ceil(L / 5))
  const sides: [V3, V3][] = [[[-hx, -hy, 0], [hx, -hy, 0]], [[hx, -hy, 0], [hx, hy, 0]], [[hx, hy, 0], [-hx, hy, 0]], [[-hx, hy, 0], [-hx, -hy, 0]]]
  for (const [a, b] of sides) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = n(L)
    const out: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
    for (let i = 0; i < m; i++) {
      const t0 = i / m, t1 = (i + 1) / m
      const P = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z]
      quadO(p, P(t0, z0), P(t1, z0), P(t1, z1), P(t0, z1), out)
      // tread strip
      const Q = (t: number): V3 => { const q = P(t, z1); return [q[0] - out[0] * tread, q[1] - out[1] * tread, z1] }
      quadO(p, P(t0, z1), P(t1, z1), Q(t1), Q(t0), [0, 0, 1])
    }
  }
}

function build() {
  const stone = new Part(), shade = new Part(), met = new Part(), roof = new Part(), door = new Part()

  // ---------------------------------------------------------- crepidoma
  step(stone, SX + 2 * TREAD, SY + 2 * TREAD, 0, STEP, TREAD)
  step(stone, SX + TREAD, SY + TREAD, STEP, 2 * STEP, TREAD)
  step(stone, SX, SY, 2 * STEP, STYL, 0)
  // the stylobate floor (pteroma) — one cap, seen between the columns
  capRing(stone, rect(-SX, -SY, SX, SY), STYL - 0.001)
  // inner platform, two steps
  prism(stone, stone, rect(-CX - 1.15, -29.9, CX + 1.15, 29.9), STYL, STYL + 0.35)
  prism(stone, stone, rect(-CX - 0.8, -29.55, CX + 0.8, 29.55), STYL + 0.35, IN0)

  // ---------------------------------------------------------- cella, in shade behind the colonnade
  prism(shade, null, rect(-CX, -CY, CX, CY), IN0, ARCH)
  // antae: the side walls run on past the end walls
  for (const s of [-1, 1]) for (const sx of [-1, 1]) {
    const x0 = sx > 0 ? CX - 1.0 : -CX, x1 = sx > 0 ? CX : -CX + 1.0
    box(shade, x0, s > 0 ? CY : -CY - 1.6, x1, s > 0 ? CY + 1.6 : -CY, IN0, ARCH, null)
  }
  // doors (bronze, open and lit at night) with a pale surround
  for (const s of [-1, 1]) {
    const f: Face = { o: [0, s * CY, 0], n: [0, s] }
    extrudeShape(stone, f, [[-3.0, IN0], [3.0, IN0], [3.0, IN0 + 8.3], [-3.0, IN0 + 8.3]], 0, 0.12)
    flatShape(door, f, [[-2.4, IN0], [2.4, IN0], [2.4, IN0 + 7.6], [-2.4, IN0 + 7.6]], 0.16)
  }

  // ---------------------------------------------------------- columns
  const xs = axes(8, true), ys = axes(17, false)
  for (const s of [-1, 1]) {
    for (const x of xs) doric(stone, stone, x, s * ys[16], 0.95, 0.75, STYL, COLTOP, 2.05)
    for (const y of ys.slice(1, -1)) doric(stone, stone, s * xs[7], y, 0.95, 0.75, STYL, COLTOP, 2.05)
    // inner hexastyle porch
    for (let k = 0; k < 6; k++) doric(stone, stone, (k - 2.5) * 3.56, s * 28.4, 0.85, 0.68, IN0, COLTOP, 1.8)
    // inner architrave over the porch, from anta to anta
    box(stone, -CX, s > 0 ? 27.5 : -29.3, CX, s > 0 ? 29.3 : -27.5, COLTOP, ARCH, null)
  }

  // ---------------------------------------------------------- entablature
  // architrave and frieze as a ring band; the ceiling over the pteroma at the architrave's top
  const outer = rect(-SX, -SY, SX, SY), inner = rect(-SX + 1.5, -SY + 1.5, SX - 1.5, SY - 1.5)
  prism(stone, null, outer, COLTOP, FRIEZE)
  // soffit of the architrave ring
  for (let i = 0; i < 4; i++) {
    const a = outer[i], b = outer[(i + 1) % 4], c = inner[(i + 1) % 4], d = inner[i]
    quadO(stone, [a[0], a[1], COLTOP], [b[0], b[1], COLTOP], [c[0], c[1], COLTOP], [d[0], d[1], COLTOP], [0, 0, -1])
  }
  // inner faces of the architrave ring down to the ceiling
  for (let i = 0; i < 4; i++) {
    const a = inner[i], b = inner[(i + 1) % 4]
    const out: V3 = [-(b[1] - a[1]), b[0] - a[0], 0]
    quadO(shade, [a[0], a[1], COLTOP], [b[0], b[1], COLTOP], [b[0], b[1], ARCH], [a[0], a[1], ARCH], out)
  }
  capRing(shade, inner, ARCH, false)
  // metopes: two per intercolumn, red fields on the frieze
  const metopes = (axesU: number[], f: Face, sgn: number) => {
    for (let i = 0; i + 1 < axesU.length; i++) {
      const a = axesU[i], b = axesU[i + 1], w = (b - a) / 2 - 0.85
      for (const t of [0.25, 0.75]) {
        const u = (a + (b - a) * t) * sgn
        flatShape(met, f, [[u - w / 2, ARCH + 0.12], [u + w / 2, ARCH + 0.12], [u + w / 2, FRIEZE - 0.12], [u - w / 2, FRIEZE - 0.12]], 0.04)
      }
    }
  }
  for (const s of [-1, 1]) {
    metopes(xs, { o: [0, s * SY, 0], n: [0, s] }, -s)
    metopes(ys, { o: [s * SX, 0, 0], n: [s, 0] }, s)
  }
  // a thin band at the frieze's top (taenia-like) and the cornice
  prism(stone, null, chamfer(rect(-SX - 0.12, -SY - 0.12, SX + 0.12, SY + 0.12), 0.1), FRIEZE - 0.12, FRIEZE)
  const corn = chamfer(rect(-SX - OVER, -SY - OVER, SX + OVER, SY + OVER), 0.3)
  prism(stone, stone, corn, FRIEZE, EAVES)
  capRing(stone, corn, FRIEZE, false)

  // ---------------------------------------------------------- roof and pediments
  gable(roof, stone, shade, SX + OVER, -SY - OVER, SY + OVER, EAVES, RIDGE, [-1, 1], 0.7, 0.85)
  // pediment sculpture: one pale relief band in front of the recessed
  // tympanum (drawn in the darker cella shade, per the lead's review), its
  // top rising and falling with the figures (tallest in the middle,
  // reclining figures in the corners)
  const W = SX + OVER
  const TH = RIDGE - 0.7 - EAVES, TU = W - 0.7 * (W / (RIDGE - EAVES)) // tympanum height and half base
  const tymp = (u: number) => Math.max(0, TH * (1 - Math.abs(u) / TU))
  const prof: [number, number][] = [[0, 0.86], [1.0, 0.7], [1.9, 0.84], [3.0, 0.66], [4.1, 0.8], [5.3, 0.6], [6.5, 0.74], [7.8, 0.55], [9.0, 0.68], [10.4, 0.5], [11.8, 0.6], [13.2, 0.45], [14.2, 0.0]]
  const top: XY[] = []
  for (const [u, k] of [...prof].reverse()) top.push([-u, EAVES + tymp(u) * k * 0.78])
  for (const [u, k] of prof.slice(1)) top.push([u, EAVES + tymp(u) * k * 0.78])
  const band: XY[] = [[-14.2, EAVES], [14.2, EAVES], ...top.slice().reverse().filter(([u]) => Math.abs(u) < 14.2)]
  for (const s of [-1, 1]) extrudeShape(stone, { o: [0, s * (SY + OVER - 0.85), 0], n: [0, s] }, band, 0, 0.45)
  // antefixes along both eaves, at half their real density
  for (const sx of [-1, 1]) {
    for (let y = -SY + 1.0; y <= SY - 0.9; y += 2.148) {
      const x = sx * (SX + OVER - 0.2), out: V3 = [sx, 0, 0]
      const A: V3 = [x, y - 0.28, EAVES], B: V3 = [x, y + 0.28, EAVES], C: V3 = [x, y + 0.28, EAVES + 0.45], D: V3 = [x, y, EAVES + 0.75], E: V3 = [x, y - 0.28, EAVES + 0.45]
      const back: V3 = [x - sx * 0.35, y, EAVES + 0.2]
      triO(stone, A, B, C, out); triO(stone, A, C, E, out); triO(stone, E, C, D, out)
      triO(stone, B, C, back, [0, 1, 0]); triO(stone, A, E, back, [0, -1, 0])
      triO(stone, E, D, back, [-sx * 0.3, -0.5, 1]); triO(stone, C, D, back, [-sx * 0.3, 0.5, 1])
    }
  }
  // acroteria: a palmette on each apex, a griffin at each corner
  for (const s of [-1, 1]) {
    const yE = s * (SY + OVER - 0.35)
    box(stone, -0.6, yE - 0.45, 0.6, yE + 0.45, RIDGE - 0.4, RIDGE + 0.35, stone, 0.1)
    const f: Face = { o: [0, yE, 0], n: [0, s] }
    const pal: XY[] = [[-0.25, 0], [0.25, 0], [0.75, 0.5], [0.85, 1.05], [0.55, 1.6], [0, 2.0], [-0.55, 1.6], [-0.85, 1.05], [-0.75, 0.5]]
    extrudeShape(stone, f, pal.map(([u, z]) => [u, RIDGE + 0.35 + z] as XY), -0.2, 0.2)
    extrudeShape(stone, { o: [0, yE, 0], n: [0, -s] }, pal.map(([u, z]) => [u, RIDGE + 0.35 + z] as XY), -0.2, 0.2, false)
    for (const sx of [-1, 1]) {
      const x = sx * (W - 0.7)
      box(stone, x - 0.4, yE - 0.55, x + 0.4, yE + 0.55, EAVES + 0.1, EAVES + 0.85, stone, 0.08) // plinth and body
      // raised wings: a wedge rising behind the body
      const ff: Face = { o: [x, yE, 0], n: [0, s] }
      extrudeShape(stone, ff, [[-0.4, EAVES + 0.85], [0.4, EAVES + 0.85], [0.3, EAVES + 1.9], [-0.1, EAVES + 1.6]], -0.35, 0.05)
    }
  }

  // ---------------------------------------------------------- materials and night
  const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.15 : n[2] < -0.5 ? 0.6 : 1)
  // finishGlb is typed for Swatch; writeGlb reads the floodlight function off the same object.
  const fl = (s: Swatch, f: (p: V3, n: V3) => number): Swatch => ({ ...s, floodlight: f }) as Swatch
  return finishGlb('The Parthenon (Nashville)', [
    { part: stone, material: fl(finish('parthenon-aggregate', 0xd6c4a1), lit) },
    { part: shade, material: fl(finish('parthenon-cella', 0x9c8f76), lit) },
    { part: met, material: fl(finish('parthenon-metope', 0xc49884), () => 0.8) },
    { part: roof, material: finish('parthenon-roof', 0xaeab9c) },
    { part: door, material: { name: 'entrance', color: 0x8e7350, roughness: 0.6 } },
  ], { bearing: 56.5, height: RIDGE + 2.35, replaces: ['way/130913355'] }, 6500)
}

if (import.meta.main) await writeModel('nash-parthenon', build())
