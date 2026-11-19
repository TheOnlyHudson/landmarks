/**
 * Nippon Budokan (日本武道館, Yamada Mamoru, 1964), Kitanomaru Park, Tokyo
 * — procedural, CC0-1.0.
 * bun generators/tokyo-nippon-budokan.ts
 *
 * Writes models/tokyo-nippon-budokan.glb (low) and
 * models/tokyo-nippon-budokan.detail.glb (detail: finer fins and roof
 * seams, rafters under the eave, a smoother giboshi).
 *
 * Map frame: x east, y north, z up, metres, turned so the octagon's faces
 * lie square to the axes: the OSM outline way/43896730 has its sides at
 * 13°, 58°, 103° and 148°, so the catalog bearing is 13. Origin: the
 * outline's centroid (139.7498694, 35.6933580).
 *
 * Identity, in order: the great octagon modelled on Hōryū-ji's Yumedono,
 * its pale grey-green copper roof sweeping up in a concave curve to a small
 * octagonal drum crowned by the gilt onion-shaped giboshi; the deep bronze-
 * gold fascia band of the wide lower eave, its corners turned up; the band
 * of white vertical fins under the eave; the bare-concrete body under it,
 * stepped out like inverted stands, with four heavy raking struts on each
 * face; the terrace ring at first-floor level and the green-framed window
 * bands.
 *
 * Evidence:
 *  - OSM way/43896730: a regular octagon, sides 39.7-40.5 m, 97 m across
 *    the flats (the eave's fascia); height 42 (published height of the
 *    hall to the giboshi's tip; ja.wikipedia 日本武道館: 42 m, built 1964,
 *    the octagon after the Yumedono, the giboshi after Mount Fuji's
 *    outline as the architect described it).
 *  - heights within the building (estimates, scaled from Morio's level
 *    front view, the fascia 40 m long as the scale, ~25 px/m): ground-floor
 *    wall 0-5.2, terrace slab 5.2-6.4 with its parapet to 7.0, window band
 *    6.8-8.4, the stepped underside 9.5-14.0, fin band 14.0-16.6, soffit
 *    16.6-17.3, fascia 17.3-19.6 (corners up 1.1 m, Wiiii's front view);
 *    roof to the drum at 35.8 (Suicasmo's elevated view: the hip line's rise is 0.35 of
 *    its run, shallow over the eave and ~37° under the drum, profile t^2.6), drum to 37.3, giboshi 37.6-42.0 (its shape
 *    from Kakidai's 2018, Morio's and Wiiii's photos: a squat onion on a
 *    short collar, widest about a third of the way up, a short pointed tip
 *    and a small knob).
 *  - plan within: body wall 38-39.5 m from the centre (apothem), the
 *    stepped underside out to 45, the fins at 45, fascia at 48.5 (OSM);
 *    struts four to a face, from the wall at 9 m to the fin band at 15 m
 *    (Monniaux's oblique view).
 *  - colours (daylight photos, pulled to the palette): roof patina #9dbaab
 *    (#a7c3b5 in sun, Suicasmo); fascia gold-bronze #c8922f (#c9a050 in sun, #b98a3a in shade, Wiiii's front view); giboshi gilt
 *    #d6b25a; concrete #cbc6bb; fins white #ece9e1; window bands slate.
 *  - night: the fascia and the giboshi are floodlit in night photos of
 *    concerts; the window bands glow.
 *  - terrain: see the report; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Nippon Budokan 2018.jpg, Kakidai, CC BY-SA 4.0 (fascia, struts, fins, close)
 *  - Nippon Budokan 20190406.jpg, Suicasmo, CC BY-SA 4.0 (the roof from above, from the south-west)
 *  - Nippon Budokan 2010.jpg, Wiiii, CC BY-SA 3.0 (front, level)
 *  - Nippon Budokan 1 and 2 Kitanomaru Chiyoda Tokyo.jpg, Morio, CC BY-SA 3.0 (front and three-quarter, giboshi)
 *  - Nippon Budokan dsc05079.jpg, David Monniaux, CC BY-SA 3.0 (struts and stepped underside)
 *  - Nippon Budokan - sunny day - Nov 12 2021 various 14 20 07 779000.jpeg, Nesnad, CC BY 4.0 (eave, side)
 * No commercial imagery. No look-only references.
 *
 * Left out: the red 武道館 board over the main door, the stairs and ramps
 * up to the terrace, the doors' detail, the scaffold-free roof vents.
 * Doubts: the plan of the stepped underside and the body's setbacks are
 * read from oblique photos; the roof's profile from two far photos; which
 * face is the "front" (the board is left out, so all eight faces are drawn
 * alike, as they nearly are).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { bar, lathe, grid, save, type Mat } from './tokyo-meiji-jingu'

type Sz = { detail: boolean }
const C8 = Math.cos(Math.PI / 8)

/** Octagon corner k (0..7) at apothem a, faces square to the axes. */
const corner = (k: number, a: number, z: number): V3 => {
  const t = Math.PI / 8 + (k * Math.PI) / 4, r = a / C8
  return [r * Math.cos(t), r * Math.sin(t), z]
}
/** A point along face k (between corners k and k+1) at u in -1..1. */
const onFace = (k: number, u: number, a: number, z: number): V3 => {
  const A = corner(k, a, z), B = corner(k + 1, a, z), f = (u + 1) / 2
  return [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f, z]
}
/** Outward normal of face k. */
const nrm = (k: number): [number, number] => { const t = Math.PI / 4 + (k * Math.PI) / 4; return [Math.cos(t), Math.sin(t)] }

/** An octagonal surface from a profile [apothem, z] going up (outer faces), flat-shaded per face. */
function octLoft(p: Part, prof: [number, number][]) {
  p.loft(prof.map(([a, z]) => Array.from({ length: 8 }, (_, k) => corner(k, a, z))))
}
/** Horizontal octagonal ring (annulus) between apothems a0 < a1 at z, facing up or down. */
function octRing(p: Part, a0: number, a1: number, z: number, up: boolean) {
  for (let k = 0; k < 8; k++) {
    const i0 = corner(k, a0, z), i1 = corner(k + 1, a0, z), o0 = corner(k, a1, z), o1 = corner(k + 1, a1, z)
    if (up) p.quad(i0, o0, o1, i1)
    else p.quad(i0, i1, o1, o0)
  }
}

function build(S: Sz) {
  const roof = new Part(), conc = new Part(), fascia = new Part(), gilt = new Part(), win = new Part(), fin = new Part()
  // ---- Body ----------------------------------------------------------------
  // Ground floor wall, the terrace slab and parapet, the upper wall.
  octLoft(conc, [[38.0, 0], [38.0, 5.2]])
  octRing(conc, 38.0, 43.0, 5.2, false)
  octLoft(conc, [[43.0, 5.2], [43.0, 7.0]])
  octRing(conc, 42.6, 43.0, 7.0, true)
  octLoft(conc, [[42.6, 7.0], [42.6, 6.4]].reverse() as [number, number][]) // parapet's inner face
  octRing(conc, 39.5, 42.6, 6.4, true)
  octLoft(conc, [[39.5, 6.4], [39.5, 9.5]])
  // The stepped underside, like inverted stands, out to the fin band.
  const steps: [number, number][] = [[39.5, 9.5]]
  const n = 5
  for (let i = 0; i < n; i++) {
    const a = 39.5 + (45 - 39.5) * (i + 1) / n, z = 9.5 + (14 - 9.5) * (i + 1) / n
    steps.push([a, steps[steps.length - 1][1]], [a, z])
  }
  // the loft above wants rings going up and out; a step's flat underside
  // faces down, so draw each riser and tread separately.
  for (let i = 0; i < steps.length - 1; i++) {
    const [a0, z0] = steps[i], [a1, z1] = steps[i + 1]
    if (a0 === a1) octLoft(conc, [[a0, z0], [a1, z1]])
    else octRing(conc, a0, a1, z0, false)
  }
  // Fin band: a wall at 45 with white fins standing out of it.
  octLoft(conc, [[45, 14], [45, 16.6]])
  const step = S.detail ? 1.05 : 2.1, fw = S.detail ? 0.28 : 0.5
  const side = 2 * 45 * Math.tan(Math.PI / 8)
  for (let k = 0; k < 8; k++) {
    const [nx, ny] = nrm(k), tx = -ny, ty = nx
    const m = Math.floor((side - 1.0) / step)
    for (let i = 0; i <= m; i++) {
      const s = -((m * step) / 2) + i * step
      const c: V3 = onFace(k, 0, 45, 0)
      const x = c[0] + tx * s, y = c[1] + ty * s
      const d = 0.6
      const P = (u: number, v: number, z: number): V3 => [x + tx * u + nx * v, y + ty * u + ny * v, z]
      const z0 = 14.2, z1 = 16.5
      fin.quad(P(-fw / 2, d, z0), P(fw / 2, d, z0), P(fw / 2, d, z1), P(-fw / 2, d, z1))
      fin.quad(P(fw / 2, 0, z0), P(fw / 2, 0, z1), P(fw / 2, d, z1), P(fw / 2, d, z0))
      fin.quad(P(-fw / 2, d, z0), P(-fw / 2, d, z1), P(-fw / 2, 0, z1), P(-fw / 2, 0, z0))
      fin.quad(P(-fw / 2, 0, z0), P(fw / 2, 0, z0), P(fw / 2, d, z0), P(-fw / 2, d, z0))
    }
  }
  // Raking struts: four to a face, from the wall up to the fin band.
  for (let k = 0; k < 8; k++) {
    const [nx, ny] = nrm(k), tx = -ny, ty = nx
    for (const s of [-15.0, -5.2, 5.2, 15.0]) {
      const c = onFace(k, 0, 39.5, 0)
      const at = (a: number, z: number): V3 => [c[0] + tx * s + nx * (a - 39.5), c[1] + ty * s + ny * (a - 39.5), z]
      bar(conc, [at(39.4, 8.2), at(45.6, 14.6)], 1.3, 0.8, 0.8, true, true)
    }
  }
  // Window bands on the upper wall (green-framed glazing), doors below.
  for (let k = 0; k < 8; k++) {
    const [nx, ny] = nrm(k)
    const P = (u: number, a: number, z: number): V3 => { const q = onFace(k, u, a, z); return [q[0] + nx * 0.04, q[1] + ny * 0.04, z] }
    for (const [u0, u1] of [[-0.8, -0.3], [-0.22, 0.22], [0.3, 0.8]]) {
      win.quad(P(u0, 39.5, 7.1), P(u1, 39.5, 7.1), P(u1, 39.5, 8.3), P(u0, 39.5, 8.3))
      win.quad(P(u0 * 0.9, 38.0, 0.6), P(u1 * 0.9, 38.0, 0.6), P(u1 * 0.9, 38.0, 3.0), P(u0 * 0.9, 38.0, 3.0))
    }
  }
  // ---- The eave: soffit, fascia with turned-up corners ----------------------
  const lift = 1.1
  const zl = (u: number) => lift * Math.pow(Math.abs(u), 4)
  const U = S.detail ? [-1, -0.9, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 0.9, 1] : [-1, -0.8, -0.5, 0, 0.5, 0.8, 1]
  const A = 48.5, Z0 = 17.3, Z1 = 19.6
  for (let k = 0; k < 8; k++) {
    // fascia face, its top edge and the soffit from the fin band out
    grid(fascia, U.map((u) => [onFace(k, u, A, Z0 + zl(u)), onFace(k, u, A, Z1 + zl(u))]))
    grid(conc, U.map((u) => [onFace(k, u, 45, 16.6), onFace(k, u, A - 0.25, Z0 + zl(u))]))
    grid(fascia, U.map((u) => [onFace(k, u, A, Z1 + zl(u)), onFace(k, u, A - 0.35, Z1 + zl(u) + 0.08)]))
  }
  if (S.detail) {
    // rafters under the eave
    for (let k = 0; k < 8; k++) {
      const [nx, ny] = nrm(k), tx = -ny, ty = nx
      for (let s = -17; s <= 17; s += 1.7) {
        const c = onFace(k, 0, 45, 0)
        const at = (a: number, z: number): V3 => [c[0] + tx * s + nx * (a - 45), c[1] + ty * s + ny * (a - 45), z]
        bar(conc, [at(45, 16.3), at(48.2, 17.0)], 0.22, 0.0, 0.35, false, true)
      }
    }
  }
  // ---- The roof: concave, rising to the drum -------------------------------
  const T = S.detail ? [0, 0.12, 0.25, 0.37, 0.48, 0.58, 0.67, 0.75, 0.82, 0.88, 0.93, 0.97, 1] : [0, 0.3, 0.55, 0.72, 0.85, 0.94, 1]
  const ZA = 35.8, AT = 4.6
  // strongly concave, like Fuji: shallow over the eave, sweeping up steeply to the drum
  const prof = (t: number): [number, number] => [A - 0.35 - (A - 0.35 - AT) * t, Z1 + 0.08 + (ZA - Z1 - 0.08) * Math.pow(t, 2.6)]
  for (let k = 0; k < 8; k++) {
    grid(roof, U.map((u) => T.map((t) => { const [a, z] = prof(t); const p = onFace(k, u, a, z + zl(u) * Math.pow(1 - t, 2)); return p })))
  }
  // hip ridges at the eight corners, and seams down each face (detail)
  for (let k = 0; k < 8; k++) {
    const line = T.map((t) => { const [a, z] = prof(t); return corner(k, a, z + lift * Math.pow(1 - t, 2)) })
    bar(roof, line, S.detail ? 0.55 : 0.8, 0.35, 0.1, true, false)
    if (S.detail) for (const u of [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]) {
      bar(roof, T.slice(0, -1).map((t) => { const [a, z] = prof(t); return onFace(k, u, a, z + zl(u) * Math.pow(1 - t, 2)) }), 0.12, 0.1, 0.05, false, false)
    }
  }
  // ---- Drum and giboshi -------------------------------------------------------
  octLoft(conc, [[AT, ZA], [4.0, ZA + 0.15], [4.0, 37.3]])
  for (let k = 0; k < 8; k++) {
    const [nx, ny] = nrm(k)
    const P = (u: number, z: number): V3 => { const q = onFace(k, u, 4.0, z); return [q[0] + nx * 0.03, q[1] + ny * 0.03, z] }
    win.quad(P(-0.7, 36.2), P(0.7, 36.2), P(0.7, 37.0), P(-0.7, 37.0))
  }
  octLoft(roof, [[4.0, 37.3], [4.4, 37.3], [4.4, 37.55], [3.0, 37.7]])
  octRing(roof, 0, 3.0, 37.7, true)
  // The giboshi: collar, then the onion swelling a third of the way up,
  // drawn in to a short point, a neck and a small knob.
  const gib: [number, number][] = [[2.6, 37.55], [2.75, 37.85], [2.6, 38.0], [3.0, 38.15], [3.5, 38.45], [3.72, 38.85], [3.7, 39.25], [3.4, 39.75], [2.85, 40.2], [2.15, 40.55], [1.4, 40.85], [0.75, 41.15], [0.32, 41.45], [0.18, 41.6], [0.3, 41.72], [0.28, 41.86], [0.12, 41.96], [0.01, 42.0]]
  const g = S.detail ? gib : gib.filter((_, i) => ![1, 2, 5, 10, 13, 15].includes(i))
  lathe(gilt, 0, 0, g, S.detail ? 32 : 14)

  const lit = (k: number) => (_: V3, n: V3) => (n[2] > 0.6 ? 0.25 * k : k)
  const parts: Mat[] = [
    { part: roof, material: finish('copper-patina', 0x9dbaab) },
    { part: conc, material: finish('concrete', 0xcbc6bb) },
    { part: fascia, material: { ...finish('fascia-gold', 0xc8922f), floodlight: lit(0.8) } },
    { part: gilt, material: { ...finish('giboshi-gilt', 0xd6b25a), floodlight: lit(1) } },
    { part: win, material: PALETTE.window },
    { part: fin, material: PALETTE.trim },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { bearing: 13, elevation: 0, height: 42, osm: 'way/43896730' }
  await save('Nippon Budokan', build({ detail: false }), 'tokyo-nippon-budokan.glb', 6500, 250_000, extras)
  await save('Nippon Budokan', build({ detail: true }), 'tokyo-nippon-budokan.detail.glb', 40_000, 1536 * 1024, extras)
}
