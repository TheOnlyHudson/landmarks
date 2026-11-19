/**
 * Asahi Beer Tower (Asahi Group headquarters, アサヒビール本社ビル),
 * Azumabashi, Sumida, Tokyo (Nikken Sekkei, 1989) — procedural, CC0-1.0.
 * bun generators/tokyo-asahi-beer-tower.ts
 *
 * The companion of tokyo-asahi-beer-hall (the Flamme d'Or), next to it on
 * the same plaza. A tower of amber-gold glass with a white faceted crown,
 * meant to read as a glass of beer with its head.
 *
 * Map frame: x towards bearing 125°, y towards 35° (along the hall's axis),
 * z up, metres; origin on the ground at the centroid of the OSM outline
 * way/155874930 (139.8007064, 35.7101163); catalog bearing 35.
 *
 * Evidence:
 *  - plan: OSM way/155874930: a 38.5 × 38.8 m square with its south corner
 *    cut back 12 m (outline taken as the tower's, full height). Height
 *    95.1 m, 22 levels (OSM).
 *  - heights, measured on 663highland's level view from across the river
 *    (the tower 96 m = 910 px): the crown 11.8 m (83.3-95.1 m), a dark band
 *    under it ~1.6 m, the west face ~40 m wide, the crown standing ~1 m out
 *    from the gold face; a pinkish stone base of ~4 storeys (to 13 m; 663highland,
 *    Kakidai).
 *  - the crown: an open lattice of white members, a row of diamonds whose
 *    middle points stand out, sky showing through it (663highland, Kakidai,
 *    Akonnchiroll): drawn as a real space frame of white struts (0.42 m,
 *    thicker than life so it reads), rings at its foot, middle and top,
 *    diagonals, corner posts and three roof beams, round a dark roof deck
 *    and a low plant box.
 *  - colours: the glass reads amber-gold #c6a24e-#d8b65c in sun (drawn
 *    #c9a65a, a `window-2` that glows at night as the offices do); the
 *    crown near white; floor bands every three storeys in pale gold.
 *  - terrain: see the report; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Asahi Breweries Headquarters (derivative image).jpg, 663highland, CC BY 2.5 (west, level)
 *  - Asahi Breweries Azumabashi Headquarters Building 02.jpg, Kakidai, CC BY-SA 4.0 (south-west, street)
 *  - Asahi HQ1.jpg, Akonnchiroll, CC0 (north-west, across the river; crown)
 *  - Asahi Beer Tower and Super Dry Hall.JPG, Tokumeigakarinoaoshima, CC0
 *  - Views from Tokyo Skytree 350 Asahi Breweries DSCN3683 20121101.JPG, Ogiyoshisan, CC BY-SA 3.0 (from above)
 * No commercial imagery. No look-only references.
 *
 * Doubts: whether the cut south corner runs the full height (the photos
 * show the crown turning a corner there, so it is drawn full height); the
 * darker panels scattered over the glass are left out.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { bar, quadOut, triOut, save, type Mat } from './tokyo-sensoji'

type XY = [number, number]
const PLAN: XY[] = [[-18.5, -20.2], [7.7, -20.1], [20.0, -8.1], [20.0, 18.6], [-18.5, 18.5]]
const BASE = 13, BODY = 83.3 - 1.6, BAND = 83.3, TOP = 95.1

/** Offset a convex CCW polygon outward by d. */
function offset(poly: XY[], d: number): XY[] {
  const n = poly.length
  return poly.map((p, i) => {
    const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n]
    const e1 = norm2([p[0] - a[0], p[1] - a[1]]), e2 = norm2([b[0] - p[0], b[1] - p[1]])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m = norm2([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A vertical prism on a polygon between z0 and z1 (walls, and a top if asked). */
function prism(p: Part, poly: XY[], z0: number, z1: number, top = false) {
  const n = poly.length
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n]
    const out: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    quadOut(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], out)
  }
  if (top) for (let i = 1; i < n - 1; i++) triOut(p, [poly[0][0], poly[0][1], z1], [poly[i][0], poly[i][1], z1], [poly[i + 1][0], poly[i + 1][1], z1], [0, 0, 1])
}

function build() {
  const stone = new Part(), glass = new Part(), trim = new Part(), dark = new Part(), crown = new Part()

  prism(stone, PLAN, 0, BASE)
  prism(glass, offset(PLAN, -0.05), BASE, BODY)
  // Floor bands every three storeys (~3.7 m a storey).
  for (let z = BASE + 11.2; z < BODY - 3; z += 11.2) prism(trim, offset(PLAN, 0.02), z, z + 0.45)
  prism(trim, offset(PLAN, 0.15), BASE - 0.4, BASE + 0.3)
  // The dark band, the roof deck and a low plant box inside the crown.
  prism(dark, PLAN, BODY, BAND, true)
  prism(dark, offset(PLAN, -6), BAND, BAND + 3.2, true)
  // The crown ("the head"): an open space frame of white struts 11.8 m tall
  // standing 1 m out from the gold face, through which the sky shows: rings
  // at its foot, its top and its middle, and diagonals making a row of
  // diamonds whose middle points stand 1.6 m further out.
  const C = offset(PLAN, 0.6), M = offset(PLAN, 2.2)
  const mid = (BAND + TOP) / 2, W = 0.42
  const strut = (a: V3, b: V3) => bar(crown, [a, b], W, W / 2, W / 2, true, true)
  for (let i = 0; i < C.length; i++) {
    const a = C[i], b = C[(i + 1) % C.length], ma = M[i], mb = M[(i + 1) % M.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.round(L / 4.3))
    const at = (p: XY, q: XY, f: number, z: number): V3 => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, z]
    for (let k = 0; k < n; k++) {
      const f0 = k / n, f1 = (k + 1) / n, fm = (k + 0.5) / n
      const B0 = at(a, b, f0, BAND), B1 = at(a, b, f1, BAND), T0 = at(a, b, f0, TOP), T1 = at(a, b, f1, TOP)
      const Mx = at(ma, mb, fm, mid), M0 = at(a, b, f0, mid), M1 = at(a, b, f1, mid)
      strut(B0, B1); strut(T0, T1)
      strut(B0, Mx); strut(Mx, B1); strut(T0, Mx); strut(Mx, T1)
      strut(M0, Mx); strut(Mx, M1)
      if (k === 0) strut(B0, T0) // a post at each corner
    }
  }
  // Roof beams across the top of the frame.
  for (const f of [0.25, 0.5, 0.75]) {
    const y = -20.2 + 38.8 * f
    strut([-18.0, y, TOP], [19.4, y, TOP])
  }

  const parts: Mat[] = [
    { part: glass, material: windowVariant(2, 0xc9a65a) },
    { part: trim, material: finish('pale-gold', 0xe6d3a0) },
    { part: stone, material: finish('pink-granite', 0xbfa89b) },
    { part: dark, material: finish('crown-shadow', 0x5c636b) },
    { part: crown, material: finish('froth-white', 0xe9eef0) },
  ]
  return parts
}

if (import.meta.main) {
  await save('tokyo-asahi-beer-tower', 'Asahi Beer Tower', build(), 'tokyo-asahi-beer-tower.glb', 5000, 250_000, { bearing: 35, elevation: 0, height: 95.1, osm: 'way/155874930' })
}
