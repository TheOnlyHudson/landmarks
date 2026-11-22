/**
 * Anzac Memorial, Hyde Park South, Sydney: procedural, CC0-1.0.
 * bun generators/sydney-anzac-memorial.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to bearing 8.4
 * (the memorial's axes, from OSM's parts). Origin at the centre of the
 * square body (151.2109486, -33.8757516); y = 0 at the park's ground at
 * the foot of the podium.
 *
 * Art Deco war memorial by C. Bruce Dellit with sculpture by Rayner Hoff,
 * 1932-1934, clad in pink-grey granite. A square body standing on a
 * cruciform podium with stairs north and south; on each face a tall
 * round-headed window of amber glass flanked by four buttresses, each
 * carrying a seated figure (16 in all); standing figures at the four upper
 * corners; a stepped, ziggurat-like top. The Pool of Reflection (north) and
 * the 2018 cascade (south) are water and the map's, not modelled.
 *
 * Published: about 100 ft (30.5 m) high (RSL NSW; anzacday.org.au);
 * symmetrical on both axes; 16 seated figures on the buttresses and four
 * standing figures at the corners (Infantry, Navy, Air Force, Army Medical
 * Corps); one large arched window of amber glass on each side; granite
 * from Bathurst (Wikipedia "Anzac Memorial").
 *
 * OSM (turned frame), all within the outline way/182821636: the body
 * way/1230124828 (16.8 m square, 18 m), the top's steps way/1230124827
 * (13 m, 19 m), way/1230124826, way/1230124825, way/1230124824 (6.8 m,
 * 22 m); the 16 buttresses way/1237770040-55 (1.2 x 1.0 m at +-2.5 and
 * +-5.5 along each face, standing 0.6-1.8 m proud); the cruciform podium
 * way/1237770056 (4 m, arms to +-11.25 and +-13.55, stair bays to +-15.65);
 * the stairs way/1237770061/65 (1.5-4 m) and the half-round steps
 * way/1237770058/63 (1.5 m), north and south.
 * Heights: OSM's (22 m to the top) are scaled to the published 30.5 m with
 * a2 (the south front at dusk, near-frontal, 0.1 m/px from the 19 m body
 * with buttresses): podium 4; body top 26.3; five steps to 30.5; window
 * 9.4 to its springing 19.5 (4 m wide between the inner buttresses);
 * door 4-8.3; buttresses to 19.5, the seated figures 2.7 m on them (a4);
 * the corner niches from 20.5, their standing figures 3.6 m (a2, a4).
 * The steps' half-widths 6.2, 5.5, 4.8, 4.15, 3.5 m from a2 (the lit bands
 * read 0.74 to 0.42 of the body's width; OSM's parts give 6.5 and 3.4).
 * Estimated: the figures' proportions (from a4's close view); the
 * corner reliefs' size.
 * Left out: the bronze friezes over the doors, the relief carving's detail,
 * the oculus and Hall of Service below ground, flagpoles.
 *
 * Colours (sample2.ts): granite sunlit #e6d9cf (a1), overcast #d4d1d6
 * (a5); the lead's review reads it warm pinkish beige, ~#d8c2ab sunlit
 * in a2/a5 -> 0xdcc4ad; the figures a shade warmer and
 * darker (a4); the window amber (a2, a4).
 *
 * Night: the body is floodlit warm (a2, a6), the stepped top's risers
 * glow amber (a2): their risers are `neon-crown-amber`, a warm sandy
 * amber by day close to the granite; the amber windows are `window`.
 *
 * LODs: the low model has the figures as simple lofted bodies (seat,
 * legs, torso, head); the detail model sculpts them with tapered lofts,
 * blended shoulders, arms and hands, heads with brims, and the standing
 * figures' greatcoats.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - a1 "Sydney (AU), View from Sydney Tower, Pool of Reflection and Anzac Memorial -- 2019 -- 3125.jpg", Dietmar Rabich, CC BY-SA 4.0 (aerial)
 * - a2 "ANZAC Memorial Hyde Park 001.jpg", Sardaka, CC BY-SA 4.0 (south front, dusk)
 * - a4 "ANZAC Memorial Hyde Park figures.jpg", Mertie ., CC BY 2.0 (buttress figures)
 * - a5 "The ANZAC Memorial on Hyde Park (16016054793).jpg", Jorge Láscar, CC BY 2.0 (aerial)
 * - a6 "Anzac War Memorial and Hyde Park at night April 2013.jpg", Nick-D, CC BY-SA 4.0 (night)
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { arch, box, face, lathe, loftRings, prism, saveLods, skin, type Layer, type XY } from './sydney-tower-eye'

const H = 8.4 // body half-width
const POD = 4.0, TOP = 26.3
const D = 0.9 // depth of the window's reveal

type Set = { stone: Part; figure: Part; win: Part; door: Part; crown: Part }
const mk = (): Set => ({ stone: new Part(), figure: new Part(), win: new Part(), door: new Part(), crown: new Part() })
const low = mk(), det = mk()

/** Rotate a figure-frame point (u forward, v left, z up) to the map frame at `o` facing `a`. */
const F = (o: V3, a: number) => (u: number, v: number, z: number): V3 => [o[0] + u * Math.cos(a) - v * Math.sin(a), o[1] + u * Math.sin(a) + v * Math.cos(a), o[2] + z]

/** An elliptical ring in the figure frame. */
const ell = (f: (u: number, v: number, z: number) => V3, cu: number, cv: number, z: number, ru: number, rv: number, n: number): V3[] =>
  Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return f(cu + ru * Math.cos(t), cv + rv * Math.sin(t), z) })

/** A limb: a tapered loft along a polyline of [u, v, z, r] (figure frame). */
function limb(p: Part, f: (u: number, v: number, z: number) => V3, pts: [number, number, number, number][], n: number) {
  const rings: V3[][] = []
  for (let k = 0; k < pts.length; k++) {
    const [u, v, z, r] = pts[k]
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)]
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(d[0], d[1], d[2]) || 1
    const dn = d.map((x) => x / l)
    let e1 = Math.abs(dn[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
    const dot = e1[0] * dn[0] + e1[1] * dn[1] + e1[2] * dn[2]
    e1 = e1.map((x, i) => x - dot * dn[i]); const l1 = Math.hypot(e1[0], e1[1], e1[2]); e1 = e1.map((x) => x / l1)
    const e2 = [dn[1] * e1[2] - dn[2] * e1[1], dn[2] * e1[0] - dn[0] * e1[2], dn[0] * e1[1] - dn[1] * e1[0]]
    rings.push(Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2
      return f(u + r * (Math.cos(t) * e1[0] + Math.sin(t) * e2[0]), v + r * (Math.cos(t) * e1[1] + Math.sin(t) * e2[1]), z + r * (Math.cos(t) * e1[2] + Math.sin(t) * e2[2]))
    }))
  }
  loftRings(p, rings, { top: true, bottom: true })
}

/** A head: a small lathe (egg), with a cap brim in the detail model. */
function head(p: Part, f: (u: number, v: number, z: number) => V3, cu: number, z0: number, r: number, d: boolean, brim = false) {
  const n = d ? 10 : 6
  const prof: [number, number][] = d ? [[0.02, z0], [r * 0.75, z0 + r * 0.25], [r, z0 + r * 0.9], [r * 0.92, z0 + r * 1.5], [r * 0.55, z0 + r * 1.95], [0.02, z0 + r * 2.1]] : [[0.02, z0], [r, z0 + r * 0.8], [r * 0.7, z0 + r * 1.8], [0.02, z0 + r * 2.1]]
  const c = f(cu, 0, 0)
  lathe(p, [c[0], c[1]], prof.map(([rr, z]) => [rr, c[2] + z]), n)
  if (brim) lathe(p, [c[0], c[1]], [[r * 0.6, c[2] + z0 + r * 1.55], [r * 1.45, c[2] + z0 + r * 1.5], [r * 1.45, c[2] + z0 + r * 1.62], [r * 0.6, c[2] + z0 + r * 1.7]], n, { bottom: true, top: true })
}

/** A seated figure on a buttress top at `o`, facing angle `a`, about 2.7 m tall (a4). */
function seated(p: Part, o: V3, a: number, d: boolean, pose: number) {
  const f = F(o, a)
  const n = d ? 8 : 4
  // the seat block behind, drapery falling to the plinth
  loftRings(p, [ell(f, -0.15, 0, 0, 0.42, 0.5, d ? 8 : 4), ell(f, -0.12, 0, 0.62, 0.4, 0.47, d ? 8 : 4)], { top: true })
  // lower legs (shins together under the robe) and thighs
  loftRings(p, [ell(f, 0.42, 0, 0, 0.2, 0.36, n), ell(f, 0.44, 0, 0.62, 0.2, 0.35, n)], { top: false })
  loftRings(p, [ell(f, -0.05, 0, 0.6, 0.3, 0.42, n), ell(f, 0.28, 0, 0.66, 0.26, 0.38, n), ell(f, 0.52, 0, 0.68, 0.16, 0.34, n)], { top: true, bottom: true })
  // torso: hips, waist, chest, blended shoulders, a slight forward lean
  const lean = 0.06 + 0.04 * pose
  loftRings(p, [
    ell(f, -0.08, 0, 0.6, 0.27, 0.4, n),
    ell(f, -0.05 + lean * 0.3, 0, 1.0, 0.22, 0.34, n),
    ell(f, -0.03 + lean * 0.6, 0, 1.42, 0.24, 0.41, n),
    ell(f, -0.02 + lean, 0, 1.72, 0.21, 0.45, n),
    ell(f, 0.0 + lean, 0, 1.86, 0.15, 0.3, n),
    ell(f, 0.02 + lean, 0, 1.94, 0.08, 0.1, n),
  ], { top: true })
  head(p, f, 0.04 + lean, 1.92, 0.19, d, pose % 2 === 1)
  if (d) {
    // arms: shoulder, elbow, hands meeting on the lap or one raised to the chin (a4's poses)
    for (const s of [-1, 1]) {
      const raised = pose % 3 === 0 && s === 1
      limb(p, f, raised
        ? [[0.0 + lean, s * 0.44, 1.7, 0.1], [0.22, s * 0.42, 1.25, 0.09], [0.28 + lean, s * 0.12, 1.75, 0.075]]
        : [[0.0 + lean, s * 0.44, 1.7, 0.1], [0.12, s * 0.46, 1.22, 0.09], [0.42, s * 0.18, 0.92, 0.08]], 6)
    }
  } else {
    // arms as one band round the front of the body
    loftRings(p, [ell(f, 0.2, 0, 0.88, 0.14, 0.42, 4), ell(f, 0.16, 0, 1.05, 0.12, 0.44, 4)], { top: true, bottom: true })
  }
}

/** A standing figure in a corner niche: greatcoat, shoulders, head, arms at the sides. */
function standing(p: Part, o: V3, a: number, d: boolean, pose: number) {
  const f = F(o, a)
  const n = d ? 10 : 4
  loftRings(p, [
    ell(f, 0, 0, 0, 0.42, 0.5, n), ell(f, 0, 0, 0.9, 0.34, 0.42, n), ell(f, 0, 0, 1.7, 0.3, 0.4, n),
    ell(f, 0.02, 0, 2.35, 0.3, 0.46, n), ell(f, 0.02, 0, 2.8, 0.26, 0.56, n), ell(f, 0.03, 0, 2.98, 0.16, 0.36, n), ell(f, 0.04, 0, 3.06, 0.09, 0.11, n),
  ], { top: true })
  head(p, f, 0.05, 3.04, 0.21, d, true)
  if (d) for (const s of [-1, 1]) {
    const hold = pose % 2 === 0 && s === -1
    limb(p, f, hold
      ? [[0.02, s * 0.55, 2.78, 0.11], [0.2, s * 0.58, 2.2, 0.1], [0.34, s * 0.3, 2.05, 0.085]]
      : [[0.02, s * 0.55, 2.78, 0.11], [0.04, s * 0.6, 2.15, 0.1], [0.08, s * 0.55, 1.6, 0.085]], 6)
  }
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  // ---- Podium: the cruciform base, 4 m ----
  const cross: XY[] = [[8.4, -11.17], [8.4, -15.64], [5.0, -15.64], [5.0, -11.17], [-5.0, -11.17], [-5.0, -15.64], [-8.4, -15.64], [-8.4, -11.17], [-11.25, -11.17], [-11.25, -5.97], [-13.55, -5.97], [-13.55, 5.95], [-11.25, 5.95], [-11.25, 11.17], [-8.4, 11.17], [-8.4, 15.64], [-5.0, 15.64], [-5.0, 11.17], [5.0, 11.17], [5.0, 15.64], [8.4, 15.64], [8.4, 11.17], [11.25, 11.17], [11.25, 5.97], [13.55, 5.97], [13.55, -5.95], [11.25, -5.95], [11.25, -11.17]]
  prism(s.stone, cross, 0, POD - 0.6)
  prism(s.stone, cross.map(([x, y]) => [x * 0.985, y * 0.99] as XY), POD - 0.6, POD)
  // the north and south stairs between the stair bays, up to the podium (1.5-4 m), and the half-round steps below
  for (const sg of [-1, 1]) {
    const nSteps = d ? 10 : 5
    for (let i = 0; i < nSteps; i++) {
      const y0 = sg * 15.64, y1 = sg * (11.17 + ((15.64 - 11.17) * i) / nSteps)
      const z = 1.5 + ((POD - 1.5) * (i + 1)) / nSteps
      prism(s.stone, [[-5.0, Math.min(y0, y1)], [5.0, Math.min(y0, y1)], [5.0, Math.max(y0, y1)], [-5.0, Math.max(y0, y1)]], 0, z)
    }
    for (let k = 0; k < 3; k++) {
      const r = 6.7 - k * 0.6, ri = 0
      void ri
      const n = d ? 16 : 8
      const pts: XY[] = [[-r, sg * 15.64], ...Array.from({ length: n + 1 }, (_, i) => { const t = (i / n) * Math.PI; return [-r * Math.cos(t), sg * (15.64 + r * Math.sin(t))] as XY }), [r, sg * 15.64]]
      prism(s.stone, pts, 0, 0.5 * (k + 1))
    }
  }

  // ---- The body: four faces, each with its window, door, buttresses and figures ----
  prism(s.stone, [[-H + D, -H + D], [H - D, -H + D], [H - D, H - D], [-H + D, H - D]], POD, TOP, { top: true })
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 // outward direction of this face: 0 = east
    const ux = Math.cos(a), uy = Math.sin(a), tx = -uy, ty = ux
    const W = (u: number, t: number): XY => [ux * u + tx * t, uy * u + ty * t]
    // the face's skin: from the left corner to the right (outside on the right)
    const A = W(H - D, -H), B = W(H - D, H)
    const holes: XY[][] = [
      arch(H - 2.0, H + 2.0, 9.4, 19.5, false, d ? 10 : 6),
      [[H - 1.4, POD + 0.1], [H + 1.4, POD + 0.1], [H + 1.4, 8.3], [H - 1.4, 8.3]],
    ]
    // corner niches for the standing figures, cut into the upper corners
    skin(s.stone, s.win, A, B, POD, TOP, D, holes, { top: true, ends: true, s0: 1.4, s1: 2 * H - 1.4 })
    // the corner piers either side, carried to the top, set back to make the niches above 20.5
    for (const sg of [-1, 1]) {
      const c = W(H - 0.7, sg * (H - 0.7))
      box(s.stone, c, 0.7, 0.7, POD, 20.5, a)
    }
    // the door in its recess (entrance), and the amber window (the skin's glass)
    face(s.door, [[...W(H - D + 0.06, -1.4), POD + 0.1], [...W(H - D + 0.06, 1.4), POD + 0.1], [...W(H - D + 0.06, 1.4), 8.3], [...W(H - D + 0.06, -1.4), 8.3]] as V3[], [ux, uy, 0])
    if (d) {
      // the window's mullions and transoms (a4: three lights, three tiers)
      for (const t of [-0.67, 0.67]) box(s.stone, W(H - D + 0.12, t), 0.06, 0.07, 9.4, 19.5 + Math.sqrt(4 - t * t) - 0.1, a)
      for (const z of [12.8, 16.2]) box(s.stone, W(H - D + 0.12, 0), 0.06, 1.98, z - 0.07, z + 0.07, a)
    }
    // buttresses and their seated figures
    for (const t of [-5.5, -2.5, 2.5, 5.5]) {
      box(s.stone, W(H + 0.5, t), 0.6, 0.5, POD, 19.5, a)
      box(s.stone, W(H + 0.55, t), 0.68, 0.58, 19.2, 19.55, a)
      const o = W(H + 0.45, t)
      seated(s.figure, [o[0], o[1], 19.55], a, d, Math.round(t * 2 + k * 3 + 20))
    }
    // corner relief panels below the niches (cast stone), on both sides of each corner
    for (const sg of [-1, 1]) box(s.stone, W(H + 0.08, sg * (H - 0.75)), 0.12, 0.5, 15.5, 19.2, a)
    // a band at the body's top, and the stepped crown begins
  }
  // standing figures in the four corner niches, facing out diagonally
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + Math.PI / 4
    const r = Math.SQRT2 * (H - 0.6)
    standing(s.figure, [r * Math.cos(a), r * Math.sin(a), 20.5], a, d, k)
  }
  box(s.stone, [0, 0], H - 0.2, H - 0.2, TOP - 0.6, TOP)
  // ---- The stepped top ----
  const steps: [number, number][] = [[6.2, 27.15], [5.5, 28.0], [4.8, 28.85], [4.15, 29.7], [3.5, 30.5]]
  let z = TOP
  for (const [h, zz] of steps) {
    // risers glow amber at night (a2); treads are granite
    prism(s.crown, [[-h, -h], [h, -h], [h, h], [-h, h]], z, zz, { top: false })
    prism(s.stone, [[-h, -h], [h, -h], [h, h], [-h, h]], zz - 0.01, zz, { top: true })
    z = zz
  }
}

// ---- Materials and output --------------------------------------------------------------------------------

// Floodlit from below: the body washed, the crown's risers brightest (a2).
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? (p[2] > 26 ? 0.4 : 0.2) : p[2] > 26 ? 1 : p[2] > POD ? 0.75 : 0.35)
const GRANITE: MaterialSpec = { ...finish('anzac-granite', 0xdcc4ad), floodlight: lit }
const CROWN: MaterialSpec = finish('neon-crown-amber', 0xe2c29a)
const FIGURE: MaterialSpec = { ...finish('anzac-figures', 0xcdb49c), floodlight: (p) => (p[2] > 19 ? 0.85 : 0) }
const WIN: MaterialSpec = { name: 'window', color: 0xc9a650, roughness: 0.35 }
const DOOR: MaterialSpec = { name: 'entrance', color: 0x8c6d4a, roughness: 0.6 }
const layers = (s: Set): Layer[] => [
  { part: s.stone, material: GRANITE },
  { part: s.figure, material: FIGURE },
  { part: s.win, material: WIN },
  { part: s.door, material: DOOR },
  { part: s.crown, material: CROWN },
]

if (import.meta.main) {
  await saveLods('sydney-anzac-memorial', 'Anzac Memorial', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the body centre, park ground', bearing: 8.4,
  })
}
