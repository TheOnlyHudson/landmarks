/**
 * Foshay Tower (1929, Magney & Tusler), Minneapolis — original procedural
 * geometry, CC0-1.0.
 * bun generators/msp-foshay-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the downtown street
 * grid (placement bearing 31°: the model's +y runs up Marquette Avenue
 * toward the north-north-east). Origin at the anchor, the area centroid of
 * the OSM outline way/28525360 (-93.2718431, 44.9745089), on the lowest
 * ground under it.
 *
 * Form: an Art Deco obelisk after the Washington Monument. A two-storey
 * limestone base fills the block corner; the tower stands at its north-east
 * end, a tapering shaft with punched windows and set-in corners. Near the
 * top a bracketed balcony band runs across the middle of each face, a row
 * of windows above it, then the FOSHAY lettering on all four faces under a
 * cornice and parapet. A low stepped roof rises to a small cap carrying a
 * red-and-white lattice mast.
 *
 * Sources
 * - OSM: outline way/28525360 (the 2-storey base, building:levels 2);
 *   part way/301710884 (the tower, height 137, 32 levels, roof:shape
 *   pyramidal). The 4-level parts way/345817377 and way/345817379 east and
 *   north belong to Deluxe Plaza (way/1462073358) and are not modelled.
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022; the
 *   tower top is classified as high noise, class 18, in this dataset, so it
 *   was read with class 18 kept): ground ~258.1 m NAVD88; base roof 9 m;
 *   tower roof parapet 125 m over 21.5 x 19 m; balcony band top ~108.5 m,
 *   standing ~1 m proud of the roof edge; stepped roof 126-136 m; mast
 *   returns to ~176 m (one cluster over the mast; the same flight also has
 *   stray noise clusters at 175-188 m away from any building, so the mast
 *   top is less sure than the roof).
 * - Published: 136 m (447 ft) to the roof, 32 storeys, completed 1929,
 *   lettering 10 ft letters lit at night (Wikipedia, "Foshay Tower";
 *   National Register of Historic Places, 1978).
 * - Photos (Wikimedia Commons, all evidence):
 *   Bobak Ha'Eri, "051907-016-FoshayTower.jpg", CC BY 3.0, from the
 *     south-east (9th St and Marquette): taper, crown order, colour, base.
 *     https://commons.wikimedia.org/wiki/File:051907-016-FoshayTower.jpg
 *   Ibboh, "Foshay Tower 1.jpg", CC BY-SA 3.0, crown close up: letterforms,
 *     balcony brackets, cornices.
 *     https://commons.wikimedia.org/wiki/File:Foshay_Tower_1.jpg
 *   w_lemay, "Foshay Tower, 9th Street and Marquette Avenue ... 51751621026",
 *     CC BY-SA 2.0, the south face from the base roof: proportions, colour.
 *     https://commons.wikimedia.org/wiki/File:Foshay_Tower,_9th_Street_and_Marquette_Avenue,_Minneapolis,_MN_-_51751621026.jpg
 *
 * Measured: base height, roof and parapet, balcony top, tower extents at
 * the roof and (from the walls' lidar edges) near the base, roof steps.
 * Estimated from the photos, scaled to the lidar roof: the crown's order
 * (cornice 2 m under the parapet, letters 4.2 m tall at 114-118 m, a window
 * row 110-113 m, balcony 105-108.5 m on brackets to 101.5 m), the word's
 * width (about three quarters of a face), the bay and storey grouping
 * (five bays a face, three storeys a panel), the mast's taper.
 *
 * Lettering: the FOSHAY sign is the landmark's best-known feature, so it is
 * modelled (STYLE.md, "Famous signs"): tall condensed sans-serif capitals
 * traced from Ibboh's and Ha'Eri's photos — a stadium-shaped O, a pointed A
 * with a low bar, a Y forked at mid height — drawn with lettering.ts at a
 * bold stroke so the word holds at 200 px. The real letters are outlined
 * with bulbs; here they are solid strokes.
 *
 * Night: the letters are lit (neon material, a warm grey that reads dark
 * on the limestone by day and glows pale against the dark tower at night).
 * No licensed night photo was found showing the stone floodlit, so the
 * stone stays unlit.
 *
 * Doubts: the shaft's taper differs a little between the two axes in the
 * lidar edges (25 -> 21.5 m east-west, 24 -> 19 m north-south); kept as
 * measured. The window rhythm is grouped, not counted. The base's
 * shopfronts are drawn as panels without their red frames.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'
import { type XY, ccw, chamfer, capRing, wallEdge, edgePanels, finishGlb } from './sea-rainier-square-tower'

export const FOSHAY = { lng: -93.2718431, lat: 44.9745089, bearing: 31 }

/** The FOSHAY letters, cap height 1, laid out from u = 0; returns the pen and the word's width. */
function foshayWord(): { pen: Pen; width: number } {
  const pen = new Pen()
  let u = 0
  const gap = 0.16
  // F
  pen.moveTo([u, 0]).lineTo([u, 1]).lineTo([u + 0.36, 1])
  pen.moveTo([u, 0.53]).lineTo([u + 0.3, 0.53])
  u += 0.36 + gap
  // O: a tall stadium
  { const r = 0.21, a = u
    pen.moveTo([a, 0.3]).lineTo([a, 0.7]).arc([a + r, 0.7], -Math.PI, 6).lineTo([a + 2 * r, 0.3]).arc([a + r, 0.3], -Math.PI, 6) }
  u += 0.42 + gap
  // S
  pen.moveTo([u + 0.4, 0.8]).cubicTo([u + 0.38, 1.02], [u + 0.01, 1.03], [u + 0.01, 0.76], 6)
    .cubicTo([u + 0.01, 0.52], [u + 0.4, 0.55], [u + 0.4, 0.27], 6)
    .cubicTo([u + 0.4, -0.03], [u + 0.02, -0.03], [u, 0.2], 6)
  u += 0.4 + gap
  // H
  pen.moveTo([u, 0]).lineTo([u, 1])
  pen.moveTo([u + 0.42, 0]).lineTo([u + 0.42, 1])
  pen.moveTo([u, 0.5]).lineTo([u + 0.42, 0.5])
  u += 0.42 + gap
  // A: pointed, low bar
  pen.moveTo([u, 0]).lineTo([u + 0.23, 1]).lineTo([u + 0.46, 0])
  pen.moveTo([u + 0.09, 0.36]).lineTo([u + 0.37, 0.36])
  u += 0.46 + gap
  // Y
  pen.moveTo([u, 1]).lineTo([u + 0.23, 0.5]).lineTo([u + 0.46, 1])
  pen.moveTo([u + 0.23, 0.5]).lineTo([u + 0.23, 0])
  u += 0.46
  return { pen, width: u }
}

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), sign = new Part(), mast = new Part()

  // ---- the tower: a tapering rectangle, centred on C
  const C: XY = [22.6, 9.4]
  const Z = { base: 9, corbel: 101.5, balc0: 105, balc1: 108.5, win0: 110, win1: 112.6, let0: 114.0, let1: 118.6, corn: 123, top: 125, cap: 136, mast: 176 }
  const HX0 = 12.5, HY0 = 12.0, HX1 = 10.75, HY1 = 9.5 // half sizes at the base roof (9 m) and at the parapet (125 m)
  const hx = (z: number) => HX0 + ((HX1 - HX0) * (z - Z.base)) / (Z.top - Z.base)
  const hy = (z: number) => HY0 + ((HY1 - HY0) * (z - Z.base)) / (Z.top - Z.base)
  const SET = 0.9 // the set-in corners
  const ring = (z: number, grow = 0): XY[] => {
    const x = hx(z) + grow, y = hy(z) + grow, s = SET
    // a rectangle with notched (set-in) corners, counter-clockwise
    return [
      [C[0] - x + s, C[1] - y], [C[0] + x - s, C[1] - y], [C[0] + x - s, C[1] - y + s], [C[0] + x, C[1] - y + s],
      [C[0] + x, C[1] + y - s], [C[0] + x - s, C[1] + y - s], [C[0] + x - s, C[1] + y], [C[0] - x + s, C[1] + y],
      [C[0] - x + s, C[1] + y - s], [C[0] - x, C[1] + y - s], [C[0] - x, C[1] - y + s], [C[0] - x + s, C[1] - y + s],
    ]
  }
  const loft = (part: Part, z0: number, z1: number, g0 = 0, g1 = g0) => {
    const a = ring(z0, g0), b = ring(z1, g1)
    for (let i = 0; i < a.length; i++) {
      const j = (i + 1) % a.length
      part.quad([a[i][0], a[i][1], z0], [a[j][0], a[j][1], z0], [b[j][0], b[j][1], z1], [b[i][0], b[i][1], z1])
    }
  }
  const lid = (part: Part, z: number, g = 0) => capRing(part, ring(z, g), z)
  // shaft, with a slim string course under the corbels
  loft(stone, Z.base, Z.corbel)
  loft(stone, Z.corbel, Z.top)
  // cornice over the letters, a band standing 0.35 m proud
  loft(stone, Z.corn - 0.6, Z.corn, 0.35)
  lid(stone, Z.corn, 0.35)
  { const a = ring(Z.corn - 0.6, 0.35), b = ring(Z.corn - 0.6, 0)
    for (let i = 0; i < a.length; i++) { const j = (i + 1) % a.length; stone.quad([b[i][0], b[i][1], Z.corn - 0.6], [b[j][0], b[j][1], Z.corn - 0.6], [a[j][0], a[j][1], Z.corn - 0.6], [a[i][0], a[i][1], Z.corn - 0.6]) } }
  // string course under the letters
  loft(stone, Z.win1 + 0.1, Z.let0 - 0.2, 0.25)
  lid(stone, Z.let0 - 0.2, 0.25)

  // ---- per face: u runs to the reader's right along the face, out is the outward normal
  type Face = { at: (s: number, z: number, out?: number) => V3; w: (z: number) => number }
  const faces: Face[] = [0, 1, 2, 3].map((k) => {
    // k = 0 south, 1 east, 2 north, 3 west
    const at = (s: number, z: number, out = 0): V3 => {
      const x = hx(z), y = hy(z)
      if (k === 0) return [C[0] - x + s, C[1] - y - out, z]
      if (k === 1) return [C[0] + x + out, C[1] - y + s, z]
      if (k === 2) return [C[0] + x - s, C[1] + y + out, z]
      return [C[0] - x - out, C[1] + y - s, z]
    }
    const w = (z: number) => 2 * (k % 2 === 0 ? hx(z) : hy(z))
    return { at, w }
  })
  const quadOn = (part: Part, f: Face, s0: number, s1: number, z0: number, z1: number, out: number) => {
    // s as a fraction of the face width at each height, so panels follow the taper
    const p = (s: number, z: number) => f.at(s * f.w(z), z, out)
    part.quad(p(s0, z0), p(s1, z0), p(s1, z1), p(s0, z1))
  }

  // ---- shaft windows: five bays a face, three storeys a panel
  const STOREY = 3.55, G = 3 * STOREY
  for (const f of faces) {
    for (let z = 12.5; z + G - 1.6 <= Z.corbel - 1.2; z += G) {
      for (let b = 0; b < 5; b++) {
        const m = SET + 0.9, span = 1 - 2 * (m / 22)
        const c = m / 22 + (span * (b + 0.5)) / 5, half = span / 5 * 0.27
        quadOn(win, f, c - half, c + half, z, z + G - 2.6, 0.06)
      }
    }
    // the window row above the balcony: eight small lights in pairs
    for (let b = 0; b < 8; b++) {
      const s0 = 0.12 + b * 0.0985 + 0.02, s1 = s0 + 0.055
      quadOn(win, f, s0, s1, Z.win0, Z.win1, 0.06)
    }
    // the balcony's own row of windows, deep under the corbels
    for (let b = 0; b < 5; b++) quadOn(win, f, 0.16 + b * 0.14 + 0.02, 0.16 + (b + 1) * 0.14 - 0.02, Z.corbel - 3.4, Z.corbel - 0.6, 0.06)
  }

  // ---- the bracketed balcony across the middle of each face
  const BAL = 1.25
  for (const f of faces) {
    const s0 = 0.12, s1 = 0.88
    const P = (s: number, z: number, out: number) => f.at(s * f.w(z), z, out)
    // front, top, bottom and ends of the balcony slab
    stone.quad(P(s0, Z.balc0, BAL), P(s1, Z.balc0, BAL), P(s1, Z.balc1, BAL), P(s0, Z.balc1, BAL))
    stone.quad(P(s0, Z.balc1, BAL), P(s1, Z.balc1, BAL), P(s1, Z.balc1, 0), P(s0, Z.balc1, 0))
    stone.quad(P(s0, Z.balc0, 0), P(s1, Z.balc0, 0), P(s1, Z.balc0, BAL), P(s0, Z.balc0, BAL))
    stone.quad(P(s0, Z.balc0, 0), P(s0, Z.balc0, BAL), P(s0, Z.balc1, BAL), P(s0, Z.balc1, 0))
    stone.quad(P(s1, Z.balc0, BAL), P(s1, Z.balc0, 0), P(s1, Z.balc1, 0), P(s1, Z.balc1, BAL))
    // corbels: wedges under the slab, one at each pier
    for (let c = 0; c <= 5; c++) {
      const s = s0 + ((s1 - s0) * c) / 5, h = 0.018
      const a = s - h, b = s + h
      // a wedge: full depth at the top, back to the wall at the bottom
      stone.quad(P(a, Z.balc0, BAL), P(b, Z.balc0, BAL), P(b, Z.corbel, 0.15), P(a, Z.corbel, 0.15))
      stone.tri(P(a, Z.corbel, 0), P(a, Z.corbel, 0.15), P(a, Z.balc0, BAL))
      stone.tri(P(a, Z.corbel, 0), P(a, Z.balc0, BAL), P(a, Z.balc0, 0))
      stone.tri(P(b, Z.corbel, 0), P(b, Z.balc0, BAL), P(b, Z.corbel, 0.15))
      stone.tri(P(b, Z.corbel, 0), P(b, Z.balc0, 0), P(b, Z.balc0, BAL))
      stone.quad(P(a, Z.corbel, 0), P(b, Z.corbel, 0), P(b, Z.corbel, 0.15), P(a, Z.corbel, 0.15))
    }
  }

  // ---- the FOSHAY letters on all four faces
  const { pen, width } = foshayWord()
  const LH = Z.let1 - Z.let0
  for (const f of faces) {
    const zc = (Z.let0 + Z.let1) / 2, wf = f.w(zc), ww = width * LH
    const u0 = (wf - ww) / 2
    strokes(sign, pen.paths, { width: 0.18, depth: 0.45, place: (u, v, w) => f.at(u0 + u * LH, Z.let0 + v * LH, w) })
  }

  // ---- the roof: parapet, then low steps to the cap
  lid(roof, Z.top)
  const steps = [[126.4, 1.2], [128.2, 2.6], [130.4, 4.2], [133, 5.8]] as const
  let zPrev = Z.top
  for (const [z, inset] of steps) {
    const r = chamfer(ccw([[C[0] - HX1 + inset, C[1] - HY1 + inset], [C[0] + HX1 - inset, C[1] - HY1 + inset], [C[0] + HX1 - inset, C[1] + HY1 - inset], [C[0] - HX1 + inset, C[1] + HY1 - inset]]), 0.4)
    for (let i = 0; i < r.length; i++) wallEdge(stone, r, i, zPrev - 0.05, z)
    capRing(i_roof(z), r, z)
    zPrev = z
  }
  function i_roof(z: number) { return z >= 133 ? stone : roof }
  // the cap: a small square drum
  { const r: XY[] = chamfer(ccw([[C[0] - 2.6, C[1] - 2.6], [C[0] + 2.6, C[1] - 2.6], [C[0] + 2.6, C[1] + 2.6], [C[0] - 2.6, C[1] + 2.6]]), 0.4)
    for (let i = 0; i < r.length; i++) wallEdge(stone, r, i, 133, Z.cap)
    capRing(roof, r, Z.cap) }
  // ---- the mast: a square lattice tower drawn solid, tapering to a pole
  { const M: [number, number][] = [[Z.cap, 0.9], [150, 0.65], [165, 0.35], [Z.mast, 0.12]]
    for (let k = 0; k < M.length - 1; k++) {
      const [z0, h0] = M[k], [z1, h1] = M[k + 1]
      const a: XY[] = [[C[0] - h0, C[1] - h0], [C[0] + h0, C[1] - h0], [C[0] + h0, C[1] + h0], [C[0] - h0, C[1] + h0]]
      const b: XY[] = [[C[0] - h1, C[1] - h1], [C[0] + h1, C[1] - h1], [C[0] + h1, C[1] + h1], [C[0] - h1, C[1] + h1]]
      for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; mast.quad([a[i][0], a[i][1], z0], [a[j][0], a[j][1], z0], [b[j][0], b[j][1], z1], [b[i][0], b[i][1], z1]) }
    }
    const t: XY[] = [[C[0] - 0.15, C[1] - 0.12], [C[0] + 0.12, C[1] - 0.12], [C[0] + 0.12, C[1] + 0.12], [C[0] - 0.12, C[1] + 0.12]]
    capRing(mast, t, Z.mast) }

  // ---- the two-storey base over the whole outline; the tower rises from it
  const base: XY[] = chamfer(ccw([[-26.6, -26.1], [33.4, -25.9], [33.5, -3.4], [39.8, -3.4], [39.8, 24.3], [-26.5, 24.1]]), 0.4)
  for (let i = 0; i < base.length; i++) {
    wallEdge(stone, base, i, 0, Z.base)
    edgePanels(win, base, i, 0, Z.base, { group: 4.2, spandrel: 1.1, pier: 1.0, bayW: 5.2, head: 1.4, foot: 0.9, inset: 1.2 }, false)
  }
  // the base roof, with the tower's footprint cut out as a separate cap underneath it
  capRing(roof, base, Z.base)
  // parapet coping: a slim pale band round the base roof
  { const outer = base, inner = base.map(([x, y]): XY => { const cx = 6.6, cy = -0.9; const k = 0.985; return [cx + (x - cx) * k, cy + (y - cy) * k] })
    for (let i = 0; i < outer.length; i++) { const j = (i + 1) % outer.length; stone.quad([inner[i][0], inner[i][1], Z.base + 0.8], [inner[j][0], inner[j][1], Z.base + 0.8], [outer[j][0], outer[j][1], Z.base + 0.8], [outer[i][0], outer[i][1], Z.base + 0.8]) }
    for (let i = 0; i < outer.length; i++) wallEdge(stone, outer, i, Z.base, Z.base + 0.8)
    for (let i = 0; i < inner.length; i++) { const j = (i + 1) % inner.length; stone.quad([inner[j][0], inner[j][1], Z.base], [inner[i][0], inner[i][1], Z.base], [inner[i][0], inner[i][1], Z.base + 0.8], [inner[j][0], inner[j][1], Z.base + 0.8]) } }

  return finishGlb('msp-foshay-tower', 'Foshay Tower', [
    { part: stone, material: finish('foshay-limestone', 0xe6d8bf) },
    { part: win, material: { ...PALETTE.window, color: 0x6d7f8e } },
    { part: roof, material: { ...PALETTE.roof, color: 0xb3b0a8 } },
    { part: sign, material: finish('neon-foshay', 0x77736b) },
    { part: mast, material: finish('foshay-mast', 0xc0705c) },
  ], { bearing: FOSHAY.bearing, height: Z.mast, replaces: ['way/28525360', 'way/301710884'] }, 6500)
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-foshay-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
