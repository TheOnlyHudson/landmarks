/**
 * Life & Casualty Tower ("L&C Tower"; 401 Church Street), Nashville (1957,
 * Edwin A. Keeble), Nashville's first skyscraper — original procedural
 * geometry, CC0-1.0.
 * bun generators/nash-life-and-casualty-tower.ts [out.glb]
 * (Uses the small kit exported by generators/nash-pinnacle.ts.)
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/464659471 (36.1633623, -86.7790787). Bearing 63°: downtown's
 * street grid (Church Street runs along +y's perpendicular), so the office
 * block's faces are square to this frame.
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the limestone service shaft: a narrow stone slab set diagonally across
 *   the office block's north-west corner, its end face standing out as the
 *   corner of the tower and running unbroken from the street to above the
 *   roof, where it carries the green "L&C" letters and the antenna mast
 *   (OSM "Top of L&C" is the shaft's top; Moore's, Eagledj's and
 *   Wobbanight's photos);
 * - the office block: the two faces meeting at the shaft are glass behind
 *   dense vertical aluminium fins inside stone margins (drawn as panels
 *   three storeys tall between narrow pale fins), the other faces stone with
 *   window grids; a recessed top floor under a projecting roof slab;
 * - the dark granite base and low podium wings.
 *
 * Evidence
 * - OSM: way/464659471 (building, 30 levels, height 124, wikidata Q1824425)
 *   is the whole site outline including the low podium; way/796298219
 *   ("Walls of L&C") is the tower; way/796298220 ("Top of L&C") the shaft's
 *   top, a 18.6 x 8.1 m slab turned 45° to the block.
 * - Lidar: USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 0.5 m grid, read in
 *   this frame. Heights above the lowest ground under the footprint (the
 *   north-east, ~1.2 m above the box's ground_min). Measured: main roof
 *   111.8 m, roof-slab rim 114.3 m, shaft top ~126 m (a diagonal high strip
 *   matching OSM's "Top of L&C"), the mast tip ~150 m (a single return;
 *   drawn to 148 m), podium wings ~9 m. The lidar block reads ~2 m narrower
 *   east-west than OSM's "Walls"; OSM is used.
 * - Published: 124.7 m (409 ft), 30 floors, 1957; tallest in Nashville
 *   1957-1970 (Wikipedia, "List of tallest buildings in Nashville").
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   Looking up at the L&C, Nashville, TN.jpg, Brent Moore, CC BY 2.0 (the
 *     shaft's end face and the finned faces either side);
 *   Life & Casualty Tower, 2018.jpg, Eagledj, CC BY-SA 4.0 (from 4th and
 *     Church: the shaft corner, the finned faces, the curved glass entrance);
 *   Nashville Life & Casualty Tower a.jpg, Wobbanight, CC0 (the shaft over
 *     the roof with the letters, the stone face with its window strip, the
 *     recessed top floor);
 *   L&C Tower sign.jpg, Keith Hinkle, CC BY 2.0 (the green letters and
 *     louvred screen on the shaft top, close up);
 *   L&C Tower Facade.jpg, Ed Uthman, CC BY-SA 2.0 (the dark granite base).
 *   No look-only sources were used. No commercial imagery.
 * - Colours from those photos, pulled to the palette: warm tan-greige
 *   limestone (clearly darker than the white towers beside it), slate glass, pale aluminium fins, dark granite base (pulled
 *   light), green letters.
 * - Night: office windows glow (window); the "L&C" letters are an
 *   illuminated sign (neon, in their green).
 *
 * Lettering: the sign is the tower's signature, so the three letters are
 * drawn as strokes (generators/lettering.ts) after Hinkle's and
 * Wobbanight's photos: a blackletter-style L with a hooked head and foot,
 * an ampersand, a C with a hooked head. Simplified to bold strokes so they
 * read on a phone; the real letters are outlined steel channel letters.
 *
 * Estimated: the shaft's width at its foot (as at its top); the margins of
 * the finned faces (3 m); the fin spacing (drawn ~3 m, real ~1 m); the base
 * height (8 m); the letters' size (5 m tall) and placement on both of the
 * shaft top's long faces.
 * Doubts: which of the non-finned faces carries the window grid and which
 * the stone with a central window strip is read from one photo
 * (Wobbanight's); the east bay x > 18.8 is drawn as part of the podium.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, at, ccw, prism, bevel, rows, panels, lip, cap, walls, save, type Layer } from './nash-pinnacle'
import { Pen, strokes } from './lettering'

function build(): Layer[] {
  const stone = new Part(), win = new Part(), fin = new Part(), roof = new Part(), granite = new Part(), sign = new Part()

  const Z_BASE = 8, Z_BLOCK = 108.6, Z_SLAB = 112.0, Z_RIM = 114.3, Z_SHAFT = 126, Z_MAST = 148
  const rs = (z0: number, z1: number) => rows(z0, z1, Z_BASE, 11.1, 1.3, 0.8, 0.6)

  // --- podium: the site outline, 0 → 9 m, dark granite ---
  const site: XY[] = ccw([[-17.4, 10.4], [-17.6, 6.3], [-17.0, -4.2], [-16.6, -12.2], [-13.7, -12.2], [-13.2, -19.8], [6.6, -19.6],
    [6.4, -6.6], [18.8, -7.1], [18.9, -3.4], [22.0, -3.2], [21.6, 3.3], [18.9, 3.1], [18.7, 9.9], [17.8, 15.8], [-8.0, 16.2],
    [-11.1, 16.4], [-14.8, 13.7]])
  prism(granite, bevel(site, 0.3), 0, 9, roof)
  lip(granite, bevel(site, 0.3), 8.4, 9, 0.2)

  // --- the office block: the "Walls" outline, its north-west corner taken by the shaft ---
  const block: XY[] = ccw([[-10.4, -19.8], [6.6, -19.6], [6.6, -10.2], [7.7, -7.1], [18.8, -7.1], [18.7, 9.9], [-6.0, 9.8], [-10.6, 4.6]])
  const B = bevel(block, 0.4)
  prism(stone, B, 9, Z_BLOCK, null)
  granite.loft([B.map((p) => at(p, 0)), B.map((p) => at(p, 9.05))])
  // recessed top floor and the projecting roof slab
  const inset = bevel(ccw([[-9.2, -18.6], [17.6, -18.6], [17.6, 8.6], [-5.4, 8.6], [-9.4, 4.2]]), 0.3)
  prism(stone, inset, Z_BLOCK, Z_SLAB, null)
  panels(win, inset[0], inset[1], [[Z_BLOCK + 0.5, Z_SLAB - 0.4]], 3.4, 0.5)
  for (let i = 0; i < inset.length; i++) panels(win, inset[i], inset[(i + 1) % inset.length], [[Z_BLOCK + 0.5, Z_SLAB - 0.4]], 3.4, 0.5)
  cap(roof, B, Z_BLOCK)
  const slab = bevel(ccw([[-11.0, -20.4], [19.4, -20.4], [19.4, 10.5], [-6.2, 10.4], [-11.2, 4.8]]), 0.4)
  prism(stone, slab, Z_SLAB, Z_RIM, roof)
  cap(stone, slab, Z_SLAB, false)

  // --- facades ---
  // finned faces: the west (x = -10.4..) and north (y = 9.8) faces, which
  // meet at the shaft: 3 m stone margins, glass behind pale fins
  const finned = (a: XY, b: XY, m0: number, m1: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const s0 = m0 / L, s1 = 1 - m1 / L
    panels(win, a, b, rs(9, Z_BLOCK).map(([p, q]) => [p - 0.45, q + 0.45] as [number, number]), 1.6, 0, s0, s1, 0.05, 0)
    // the fins: pale strips standing 0.35 m proud, one per bay edge
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const span = L * (s1 - s0), k = Math.max(1, Math.round(span / 1.9)), step = span / k
    for (let i = 0; i <= k; i++) {
      const t = L * s0 + i * step
      const c: XY = [a[0] + u[0] * t, a[1] + u[1] * t], w = 0.16, d = 0.5
      const r: XY[] = ccw([[c[0] - u[0] * w, c[1] - u[1] * w], [c[0] + u[0] * w, c[1] + u[1] * w],
        [c[0] + u[0] * w + n[0] * d, c[1] + u[1] * w + n[1] * d], [c[0] - u[0] * w + n[0] * d, c[1] - u[1] * w + n[1] * d]])
      walls(fin, r, 9.2, Z_BLOCK - 0.4)
    }
  }
  finned([-10.6, 4.6], [-10.4, -19.8], 5.5, 2.2)   // west face (ring order runs south)
  finned([18.7, 9.9], [-6.0, 9.8], 2.2, 4.3)       // north face (ring order runs west)
  // south face: window grid in stone
  panels(win, [-10.4, -19.8], [6.6, -19.6], rs(9, Z_BLOCK), 3.4, 1.2, 0.07, 0.93, 0.05, 0.6)
  // east faces: stone with a central strip of windows
  panels(win, [18.8, -7.1], [18.7, 9.9], rs(9, Z_BLOCK), 3.2, 0.6, 0.38, 0.62, 0.05, 0.3)
  panels(win, [6.6, -19.6], [6.6, -10.2], rs(9, Z_BLOCK), 3.2, 0.6, 0.25, 0.75, 0.05, 0.3)
  panels(win, [7.7, -7.1], [18.8, -7.1], rs(9, Z_BLOCK), 3.4, 1.2, 0.1, 0.9, 0.05, 0.6)

  // --- the stone shaft, 0 → Z_SHAFT, turned 45° across the corner ---
  const shaft: XY[] = ccw([[-11.7, 4.2], [-6.2, 10.2], [7.6, -2.5], [1.6, -8.5]])
  const S = bevel(shaft, 0.3)
  prism(stone, S, 0, Z_SHAFT, roof)
  lip(stone, S, Z_SHAFT - 0.6, Z_SHAFT, 0.2)
  // the end face is plain stone (Moore's and Eagledj's photos)
  // the mast
  {
    const c: XY = [-1.5, 1.2]
    prism(stone, ccw([[c[0] - 0.9, c[1] - 0.9], [c[0] + 0.9, c[1] - 0.9], [c[0] + 0.9, c[1] + 0.9], [c[0] - 0.9, c[1] + 0.9]]), Z_SHAFT, Z_SHAFT + 6, roof)
    const r = 0.35
    const sq: XY[] = [[c[0] - r, c[1] - r], [c[0] + r, c[1] - r], [c[0] + r, c[1] + r], [c[0] - r, c[1] + r]]
    walls(fin, sq, Z_SHAFT + 6, Z_MAST - 3)
    sq.forEach((p, i) => fin.tri(at(p, Z_MAST - 3), at(sq[(i + 1) % 4], Z_MAST - 3), [c[0], c[1], Z_MAST]))
  }

  // --- the "L&C" letters on both long faces of the shaft top ---
  // Letter units: cap height 1. Traced after Hinkle's photo: a hooked
  // blackletter-style L, an ampersand, a C with a hooked head.
  const pen = new Pen()
  // L: a hooked head, the stem, a foot kicking right
  pen.moveTo([0.05, 0.85]).quadTo([0.2, 1.02], [0.32, 0.92]).lineTo([0.3, 0.12]).quadTo([0.3, 0.0], [0.45, 0.04]).lineTo([0.72, 0.1])
  // &: the upper loop and the long diagonal
  pen.moveTo([1.42, 0.02]).lineTo([1.05, 0.62]).quadTo([0.95, 0.82], [1.08, 0.92]).quadTo([1.24, 1.0], [1.27, 0.82]).quadTo([1.28, 0.66], [1.08, 0.5])
    .quadTo([0.86, 0.32], [0.92, 0.14]).quadTo([1.0, -0.02], [1.18, 0.06]).lineTo([1.42, 0.3])
  // C: a hooked head and an open bowl
  pen.moveTo([2.25, 0.84]).quadTo([2.2, 1.0], [2.02, 0.98]).cubicTo([1.66, 0.94], [1.6, 0.1], [1.98, 0.02]).quadTo([2.15, 0.0], [2.27, 0.16])
  const H = 5.0, W = 2.3 * H
  for (const side of [1, -1]) {
    // long faces run from the end (-11.7,4.2)/(-6.2,10.2) inward; normal ±(1,1)/√2
    const nrm: XY = [Math.SQRT1_2 * side, Math.SQRT1_2 * side]
    const along: XY = side > 0 ? [-Math.SQRT1_2, Math.SQRT1_2] : [Math.SQRT1_2, -Math.SQRT1_2] // the reader's right
    const mid: XY = side > 0 ? [0.7, 3.9] : [-5.0, -2.2]
    const o: XY = [mid[0] + nrm[0] * 0.02 - along[0] * W / 2, mid[1] + nrm[1] * 0.02 - along[1] * W / 2]
    const z0 = Z_SHAFT - H - 1.2
    strokes(sign, pen.paths, {
      width: 0.17, depth: 0.12,
      place: (u, v, w): V3 => [o[0] + along[0] * u * H + nrm[0] * w * H, o[1] + along[1] * u * H + nrm[1] * w * H, z0 + v * H],
    })
  }

  return [
    { part: stone, material: finish('lc-limestone', 0xcdbba3) },
    { part: win, material: { ...PALETTE.window, color: 0x5f7184 } },
    { part: fin, material: finish('lc-aluminium', 0xc9ccce) },
    { part: roof, material: PALETTE.roof },
    { part: granite, material: finish('lc-granite', 0x7d7875) },
    { part: sign, material: finish('neon-lc-green', 0x5f9a6a) },
  ]
}

if (import.meta.main) {
  await save('nash-life-and-casualty-tower', 'Life & Casualty Tower', build(), {
    bearing: 63, height: 148, replaces: ['way/464659471', 'way/796298219', 'way/796298220'],
  })
}
