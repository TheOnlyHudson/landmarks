/**
 * Qasr al-Farid ("the lonely castle"), Hegra (Mada'in Salih): procedural,
 * CC0-1.0.
 * bun generators/hegra-qasr-al-farid.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/hegra-qasr-al-farid.glb, the low model (budget 5,000 tris);
 * - models/hegra-qasr-al-farid.detail.glb, drawn from zoom 16: a finer,
 *   rougher boulder with its weathering bands, horned capitals, the cornice
 *   mouldings and the eroded eagle and urns over the door.
 *
 * Uses the rock-cut kit exported by petra-al-khazneh.ts (merge that first).
 *
 * A Nabataean tomb carved into the front of a single free-standing sandstone
 * boulder, left unfinished. The boulder is part of the landmark and is
 * modelled; the ground around it is not.
 *
 * Identity: OSM way/639423413 (historic=tomb, tomb=rock-cut,
 * natural=bare_rock, name "القصر الفريد", name:en "Qasr Al Fareed",
 * wikidata Q20403473, wikipedia en:Qasr al-Farid). Certain: the name,
 * Wikidata and Wikipedia tags agree, Wikidata's coordinates
 * (26.77397, 37.96122) fall inside it, and every geotagged Commons photo of
 * the tomb is taken 40-60 m north of it. It lies about 1.5 km SSE of the
 * assignment's rough point (26.786, 37.953); the historic=tomb ways near
 * that point (Al Faqir Tomb, way/986930782) are other tombs.
 *
 * Map frame: x east, y north, z up, metres. Built turned to bearing 160:
 * the model's -y, the facade, faces real NNW (340°). From the photos'
 * geotags and what each shows: Mortel (18), taken from 341° at 41 m, is
 * square on with both flanks equally visible; (21) from 318° shows the
 * right-hand flank, (2) from 350° and (3) from 356° the left; the evening
 * photos (18:00-18:30 in June, sun about 290-295°) have the facade in full
 * sun. The anchor is the OSM outline's centroid (37.9612179, 26.7739792);
 * the outline is 29 m across and 38 m deep in this frame, with the facade
 * at its narrow NNW end (its front at about y = -19, including the talus).
 *
 * Scale, from photos (no published dimension agrees: 13.85 m, 16, 17 and
 * 22 m are all quoted): taken here as 22.6 m from the ground to the boulder's
 * top, after World History Encyclopedia's "about 22 m" for the tomb and
 * the brief's ~20 m for the block, which makes the boulder about 23 m wide
 * where photographed square on (Mortel 18: 600 px wide, 558 px tall), in
 * keeping with the OSM outline's 29 m including the fallen rock. Every
 * other number is read off Mortel (18) at 24.3 px/m:
 * - the boulder sits on a paler layer of rock 3 m high that juts 2 m out
 *   under the facade as a ledge; the boulder is undercut above it.
 * - facade 12.4 m wide (13.3 m at the upper cornice); four pilasters at
 *   x ±2.05 and ±5.65, 1.26 m wide, from the unfinished zone at 3-4 m to horned
 *   Nabataean capitals at 10.1-11.1 m; architrave and frieze to 12.3 m,
 *   cornice to 13.1 m; plain attic to 16.2 m; upper cornice to 17.5 m;
 *   the double crow-step crown above, 11.2 m wide, two flights of five
 *   steps facing each other from 21.8 m at the outer ends down to a gap
 *   2.6 m wide over the middle; rough rock above to 22.6 m (the top barely clears the crown).
 * - door 1.4 m wide, 3.0-4.75 m, under a small pediment to 6.3 m with an
 *   eroded eagle on it.
 * - the unfinished parts: the facade's lowest metre is a row of rough
 *   blocks (left by the masons, Mortel 8), the pilasters have no bases.
 *
 * Estimated: the projections (pilasters 0.45 m, cornices 0.9-1.0 m, the
 * crow-steps 0.6 m) and the boulder's plan and taper, from the oblique
 * photos and the OSM outline. The boulder's back (SSE) is unphotographed
 * here and is drawn as the same rounded rock.
 *
 * Colour: Hegra's sandstone is a warm orange-tan; the dressed facade
 * (#da9e57 in evening sun, #a86d4a at midday in Hargas's photo) is drawn a
 * warm tan pulled to the palette's lightness, the rough weathered boulder
 * (#a3714f, #864d1d in shade) a little browner, the projecting carving
 * (pilasters, capitals, cornices, crow-steps, door frame) a little paler
 * than the dressed wall, as it reads in the photos, the base layer a pale
 * cream (#dbb473), the door a deep brown.
 *
 * Night: AlUla floodlights the tomb for events; a moderate wash on the
 * facade only.
 *
 * Elevation 0: the boulder stands on the desert floor, which the terrain
 * shows.
 *
 * replaces: none. The tomb's OSM way is natural=bare_rock, not a building,
 * and no building or building:part lies under the model (osm.py buildings
 * at the anchor, 250 m: none).
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - "Qasr al-Farid, Hegra (Madain Salih), 1st cent. CE, Saudi Arabia
 *   (18).jpg", Richard Mortel, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Qasr_al-Farid,_Hegra_(Madain_Salih),_1st_cent._CE,_Saudi_Arabia_(18).jpg
 *   (square on, 41 m: every height and width)
 * - the same series (8), (21), (2), (3), (24), Richard Mortel, CC BY 2.0
 *   (close frontal: the unfinished zone; obliques from 318°, 350°, 356°)
 * - "Qasr al Farid.JPG", Richard.hargas, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Qasr_al_Farid.JPG
 *   (oblique at midday: the boulder's flank and colour)
 * - "Qasr al-Farid.jpg", Radosław Botev, CC BY 3.0 pl,
 *   https://commons.wikimedia.org/wiki/File:Qasr_al-Farid.jpg
 * - "Mada'in Saleh 2017.jpg", Ahmad AlHasanat, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Mada%27in_Saleh_2017.jpg
 *
 * Look-only: none.
 *
 * Doubts: the overall size (published heights disagree from 13.85 m to
 * 22 m; this follows the photos' proportions and the OSM outline); the
 * boulder's plan behind the facade; the facing, from geotags of a few
 * metres' precision (±10°).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { box, bbox, prismY, limb, blob, face, writeModel } from './petra-al-khazneh'

const BEARING = 160
/** The facade's dressed plane. */
const F = -15.5

type Mats = { face: Part; carve: Part; rock: Part; base: Part; dark: Part }

/** A deterministic pseudo-random number in [0, 1) from integers. */
const hash = (i: number, j: number) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}

/**
 * One ring of the boulder: a superellipse of half-widths a (x) and b (y),
 * placed so its front would reach `F - 3`, then flattened at `clamp` (the cut
 * face), with rough noise on everything but the cut.
 */
function ring(n: number, z: number, a: number, b: number, clamp: number, level: number, rough: number): V3[] {
  a *= 0.9 // narrowed after the first photo comparison (Mortel 18)
  const e = 2.6, yc = F - 3 + b
  const out: V3[] = []
  for (let i = 0; i < n; i++) {
    // start at the front (-y) and go counter-clockwise from above
    const t = -Math.PI / 2 + (i / n) * Math.PI * 2
    const c = Math.cos(t), s = Math.sin(t)
    const k = 1 + rough * ((hash(i, level) - 0.5) * 1.2 + (hash(i, 99) - 0.5) * 0.8)
    const x = a * k * Math.sign(c) * Math.abs(c) ** (2 / e)
    let y = yc + b * k * Math.sign(s) * Math.abs(s) ** (2 / e)
    if (y < clamp) y = clamp
    // the boulder is highest at the facade and its top falls away to the back
    // (Hargas, Mortel 21: the back stands at about 45% of the front's height)
    const back = Math.max(0, Math.min(1, (y - F) / 34))
    const zz = z > 3 ? 3 + (z - 3) * (1 - 0.55 * back ** 1.3) : z
    out.push([x, y, zz])
  }
  return out
}

/** Loft rings (all with the same count) into a part; flat-shaded facets. */
function loftRings(p: Part, rings: V3[][]) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
      const tri = (u: V3, v: V3, w: V3) => {
        if (Math.hypot(v[0] - u[0], v[1] - u[1], v[2] - u[2]) < 1e-6 || Math.hypot(w[0] - u[0], w[1] - u[1], w[2] - u[2]) < 1e-6 || Math.hypot(w[0] - v[0], w[1] - v[1], w[2] - v[2]) < 1e-6) return
        p.tri(u, v, w) // rings run counter-clockwise from above, so this faces out (or down under an overhang)
      }
      tri(a, b, c)
      tri(a, c, d)
    }
}

/** A cap over a ring, fanned from its centre. */
function capRing(p: Part, r: V3[], up: boolean) {
  const c: V3 = [r.reduce((s, q) => s + q[0], 0) / r.length, r.reduce((s, q) => s + q[1], 0) / r.length, r.reduce((s, q) => s + q[2], 0) / r.length]
  if (up) c[2] += 0.3
  for (let i = 0; i < r.length; i++) face(p, [c, r[i], r[(i + 1) % r.length]], [0, 0, up ? 1 : -1])
}

/** A horned Nabataean capital on a pilaster face (front at y0, x centre, width w). */
function hornedCapital(p: Part, x: number, y0: number, z0: number, z1: number, w: number, detail: boolean) {
  const h = z1 - z0
  // the flaring block
  const sec: [number, number][] = [[x - w / 2, z0], [x + w / 2, z0], [x + w / 2 + 0.3, z1 - h * 0.3], [x - w / 2 - 0.3, z1 - h * 0.3]]
  prismY(p, sec, y0 - 0.1, F + 0.2)
  box(p, x - w / 2 - 0.4, x + w / 2 + 0.4, y0 - 0.2, F + 0.2, z1 - h * 0.3, z1, 'b')
  // the horns: a bold boss at each upper corner
  const hz = z1 - h * 0.45
  for (const s of [-1, 1]) {
    if (detail) limb(p, [x + s * (w / 2 - 0.1), y0 - 0.15, hz - 0.15], [x + s * (w / 2 + 0.35), y0 - 0.3, hz + 0.2], 0.17, 0.11, 6)
    else box(p, x + s * (w / 2) - 0.25, x + s * (w / 2) + 0.25, y0 - 0.3, y0, hz - 0.25, hz + 0.25, 'n')
  }
}

function build(detail: boolean): Mats {
  const M: Mats = { face: new Part(), carve: new Part(), rock: new Part(), base: new Part(), dark: new Part() }
  const { rock, base, dark } = M
  const fc = M.face, cv = M.carve
  const n = detail ? 56 : 28
  const R = detail ? 0.06 : 0.04

  // ---- the boulder ----
  const FB = F - 2.2 // the pale base layer's front, a ledge under the facade
  const baseRings = [
    ring(n, 0, 10.2, 16.0, FB, 0, R),
    ring(n, 1.5, 10.5, 16.3, FB, 1, R),
    ring(n, 3.0, 10.8, 16.6, FB, 2, R),
  ]
  loftRings(base, baseRings)
  capRing(base, baseRings[0], false)
  // the ledge: the ring at 3 m stepping in from the base's front to the cut
  const levels: [number, number, number][] = detail
    ? [[3.0, 11.8, 17.0], [4.2, 12.4, 17.8], [6.5, 12.7, 18.1], [9, 12.9, 18.3], [11.5, 12.9, 18.3], [14, 12.7, 18.1], [16.5, 12.6, 18.0], [18.5, 12.2, 17.7], [20.2, 11.6, 17.3], [21.5, 10.9, 16.8], [22.2, 9.9, 16.1], [22.6, 8.4, 15.0]]
    : [[3.0, 11.8, 17.0], [4.5, 12.5, 17.9], [11, 12.9, 18.3], [16.5, 12.6, 18.0], [20, 11.7, 17.3], [22.0, 10.4, 16.4], [22.6, 8.6, 15.2]]
  const rocks = levels.map(([z, a, b], k) => ring(n, z, a, b, F, k + 3, R * (k === 0 ? 0.5 : 1)))
  // ledge band: from the base's top ring to the first rock ring, both at 3 m
  loftRings(base, [baseRings[2], rocks[0]])
  loftRings(rock, rocks)
  capRing(rock, rocks[rocks.length - 1], true)
  if (detail) {
    // weathering bands: shallow horizontal ridges along the flanks
    for (const z of [7.5, 13.2, 18.0]) {
      const k = levels.findIndex(([zz]) => zz > z)
      const [z0, a0, b0] = levels[k - 1], [z1, a1, b1] = levels[k]
      const t = (z - z0) / (z1 - z0)
      const a = a0 + (a1 - a0) * t + 0.25, b = b0 + (b1 - b0) * t + 0.25
      const r0 = ring(n, z - 0.35, a - 0.25, b - 0.25, F + 0.4, 50 + z, 0.02), r1 = ring(n, z, a, b, F + 0.4, 50 + z, 0.02), r2 = ring(n, z + 0.35, a - 0.25, b - 0.25, F + 0.4, 50 + z, 0.02)
      loftRings(rock, [r0, r1, r2])
    }
  }

  // ---- the facade, carved into the flat cut at y = F ----
  const D = F - 0.12 // the dressed face, just proud of the cut
  const HW = 6.2
  const DW = 0.7, DB = 3.0, DT = 4.75 // the door
  box(fc, -HW, -DW, D, F + 0.3, 4.0, 17.5, 'b')
  box(fc, DW, HW, D, F + 0.3, 4.0, 17.5, 'b')
  box(fc, -DW, DW, D, F + 0.3, DT, 17.5, 'b')
  // the unfinished zone: a row of rough blocks along the bottom
  const nb = detail ? 16 : 9
  for (let i = 0; i < nb; i++) {
    const x0 = -HW + (i * 2 * HW) / nb, x1 = x0 + (2 * HW) / nb - 0.12
    if (x1 > -1.2 && x0 < 1.2) continue // the door
    const h = 0.7 + hash(i, 7) * 0.5, d = 0.35 + hash(i, 8) * 0.45
    box(rock, x0, x1, F - d, F + 0.3, 3.0, 3.0 + h, 'b')
  }
  box(fc, -HW, -DW, F - 0.05, F + 0.3, 3.0, 4.0, 'b')
  box(fc, DW, HW, F - 0.05, F + 0.3, 3.0, 4.0, 'b')
  // pilasters
  for (const x of [-5.65, -2.05, 2.05, 5.65]) {
    box(cv, x - 0.63, x + 0.63, D - 0.45, F + 0.2, 3.6, 10.1, 'b')
    hornedCapital(cv, x, D - 0.45, 10.1, 11.1, 1.26, detail)
  }
  // architrave, frieze, cornice
  box(cv, -HW - 0.1, HW + 0.1, D - 0.35, F + 0.2, 11.1, 11.9, 'b')
  box(cv, -HW - 0.1, HW + 0.1, D - 0.25, F + 0.2, 11.9, 12.3, 'b')
  bbox(cv, -HW - 0.5, HW + 0.5, D - 0.95, F + 0.2, 12.5, 13.1, 0.2)
  box(cv, -HW - 0.3, HW + 0.3, D - 0.65, F + 0.2, 12.3, 12.5, 'b')
  // the attic, with its band
  box(fc, -HW, HW, D - 0.15, F + 0.2, 13.1, 15.6, 'b')
  box(cv, -HW - 0.1, HW + 0.1, D - 0.3, F + 0.2, 15.6, 16.2, 'b')
  // the upper cornice: stepped mouldings out to a bold lip
  box(cv, -HW - 0.2, HW + 0.2, D - 0.45, F + 0.2, 16.2, 16.6, 'b')
  bbox(cv, -HW - 0.45, HW + 0.45, D - 1.05, F + 0.2, 16.6, 17.5, 0.25)
  if (detail) {
    box(cv, -HW - 0.3, HW + 0.3, D - 0.75, F + 0.2, 16.45, 16.65, 'b')
    box(cv, -HW - 0.35, HW + 0.35, D - 0.75, F + 0.2, 12.35, 12.55, 'b')
  }
  // the double crow-step crown: a recessed field and two flights of five steps
  const CW = 5.6, CT = 21.8, gap = 1.3, sh = 0.82
  box(fc, -CW, CW, D, F + 0.3, 17.5, CT - 0.2, 'b')
  box(cv, -gap, gap, D - 0.6, F + 0.3, 17.5, 18.1, 'b')
  const sw = (CW - gap) / 5
  for (const s of [-1, 1])
    for (let i = 0; i < 5; i++) {
      const xo = s * (CW - i * sw), xi = s * (CW - (i + 1) * sw)
      const top = CT - i * sh
      box(cv, Math.min(xo, xi), Math.max(xo, xi), D - 0.6, F + 0.3, 17.5, top, 'b')
    }

  // the door: a real recess, its frame, the pediment and the eagle
  // the opening: dark, set back behind its proud frame (the boulder is
  // solid behind the cut, so the recess is the frame's depth)
  box(dark, -DW, DW, F - 0.04, F + 0.3, DB, DT, 'b')
  for (const s of [-1, 1]) box(cv, s < 0 ? -DW - 0.4 : DW, s < 0 ? -DW : DW + 0.4, D - 0.25, F + 0.3, DB, DT + 0.3, 'b')
  box(cv, -DW - 0.5, DW + 0.5, D - 0.3, F + 0.3, DT + 0.3, DT + 0.6, 'b')
  prismY(cv, [[-1.75, DT + 0.6], [1.75, DT + 0.6], [0, 6.3]], D - 0.4, F + 0.3)
  if (detail) {
    blob(cv, [0, D - 0.4, 6.75], [0.35, 0.28, 0.45], 7, 4) // the eagle's body
    for (const s of [-1, 1]) prismY(cv, s < 0 ? [[-0.15, 6.5], [-0.75, 6.85], [-0.55, 7.2], [-0.12, 7.0]] : [[0.15, 6.5], [0.12, 7.0], [0.55, 7.2], [0.75, 6.85]], D - 0.5, D - 0.2)
    for (const s of [-1, 1]) blob(cv, [s * 1.65, D - 0.35, DT + 0.95], [0.2, 0.2, 0.3], 6, 3) // urns on the ends
  } else blob(cv, [0, D - 0.4, 6.75], [0.45, 0.3, 0.5], 5, 3)

  return M
}

// The facade gets a moderate night wash from the ground; the rock a little.
const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.15 : n[1] < -0.3 ? 0.6 : 0.3)
const litRock = (p: V3, n: V3) => (n[1] < -0.5 && p[2] < 20 ? 0.25 : 0.05)

function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.face, material: { ...finish('hegra-facade', 0xd69c6e), floodlight: lit } },
    { part: M.carve, material: { ...finish('hegra-carving', 0xe6b285), floodlight: lit } },
    { part: M.rock, material: { ...finish('hegra-rock', 0xc28660), floodlight: litRock } },
    { part: M.base, material: finish('hegra-base', 0xe6d0a6) },
    { part: M.dark, material: finish('hegra-shadow', 0x5a3b2a) },
  ]
}

if (import.meta.main) {
  const extras = { bearing: BEARING, elevation: 0, height: 22.9 }
  await writeModel('hegra-qasr-al-farid', 'Qasr al-Farid', materials(build(false)), extras, 5000, 250_000)
  await writeModel('hegra-qasr-al-farid', 'Qasr al-Farid', materials(build(true)), extras, 40_000, 1536 * 1024, '.detail')
}
