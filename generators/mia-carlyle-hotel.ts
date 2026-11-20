/**
 * The Carlyle, Miami Beach (1250 Ocean Drive; 1939–41, Richard Kiehnel and
 * William Elliott, Streamline Moderne) — original procedural geometry,
 * CC0-1.0.
 * bun generators/mia-carlyle-hotel.ts
 *
 * Map frame: model +y points along the bearing (8°, Ocean Drive's line),
 * +x to its right (98°, toward Ocean Drive); metres; origin at the anchor
 * on the ground. Anchor = centroid of the OSM outline way/380861944,
 * 25.7838040, -80.1303364. Front on +x.
 *
 * Identity, in order: the white three-storey Ocean Drive front with its
 * three tall fluted fins rising above the roof, the raised parapet between
 * them, each stepping in to a narrower top; the rounded corners at both
 * ends of the front; the long cantilevered eyebrows over
 * each floor, running round that corner and out past the north-east one;
 * the porch canopy along the ground floor with the "The CARLYLE" neon sign
 * over it; the taller rear block behind the front.
 *
 * Famous sign: "The CARLYLE" over the porch is the hotel's signature (it is
 * on every Ocean Drive postcard and in "The Birdcage"), so its letters are
 * modelled from the photos: a script "The" and wide Art Deco capitals,
 * `neon-carlyle-pink`, glowing pink-red at night. The lead's note calls it
 * a rooftop sign; every licensed photo shows it over the porch, so it is
 * drawn there.
 *
 * Night: the three fins are lit blue-white from below (`neon-carlyle-fin`,
 * a pale blue-white tint, so it reads white by day and glows blue-white at night); windows glow (`window`).
 *
 * Evidence:
 *  - plan: OSM way/380861944 (its rounded south side and the notch on the
 *    south-west). The front wall is put at x = 25.4 from the lidar; OSM's
 *    26.3 takes in the porch, drawn as a canopy to x = 28.4.
 *  - heights: lidar, USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019
 *    (flown 2019), 0.5 m grid, above the street: front block roof 12.0
 *    (x 19.5–25.4); rear block 14.3–15.1 (a lift room ~18.7 on it is left
 *    out: no photo shows it); fins at
 *    y = −4.5, 0, +4 to ~15.4–15.8, the centre one ~17.8 (drawn: shaft
 *    15.6, stepped top 17.0); porch canopy ~3.2–3.6.
 *  - floors, windows, eyebrows, fin widths, the sign's size: from the
 *    front photos, scaled by the 19 m front.
 *  - colours: white throughout, pink-red neon sign (photos).
 *
 * Photos (Wikimedia Commons):
 *  - South_Beach,_Miami_Beach,_Florida_2021_-_The_Carlyle.jpg (Sharon Hahn
 *    Darlin, CC BY 2.0): the front, square on
 *  - Miami_Beach_-_The_Carlyle.jpg and Miami_Beach_-_Carlyle.jpg
 *    (P. Hughes, CC BY-SA 4.0): from the south-east, the rounded corner
 *  - The_Carlyle_(neon_sign),_Miami_Beach,_east_view_up,_2018-08-21.jpg
 *    (Radomianin, public domain): fins and sign
 *  - The_Carlyle_(Miami_Beach).jpg (Tamanoeconomico, CC BY-SA 4.0): night,
 *    fins lit blue
 *  - Carlyle_hotel_(South_Beach,_Florida)_001.jpg (Leonard J. DeFrancisci,
 *    CC BY-SA 3.0)
 *  - 20111001_1502_South_Beach_The_Carlyle_dusk.jpg (Dan Lundberg,
 *    CC BY-SA 2.0): dusk, sign lit
 * No look-only sources. No commercial imagery.
 *
 * Left out: the fins' flutes and their half-round caps, the thin masts on
 * the fins, the lattice grilles in the raised parapet, the porch's
 * ornamental railing (a plain low wall), awnings and umbrellas.
 *
 * Doubts: the rear block (lidar 14.3–15.1, higher than the front) is not
 * seen in any photo from the street; it is drawn plain. The north (13th
 * Street) side's windows are estimated from one old photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, onWall, panel, save, walls, type XY } from './chi-aon-center'
import { parapet } from './mia-freedom-tower'
import { cols, punched } from './mia-vizcaya'
import { box, quadF } from './mia-miami-beach-post-office'
import { facePlace, glyph, word } from './mia-colony-hotel'
import { Pen, strokes, type Pt } from './lettering'

/** A slab `t` thick standing out `out` from the walls along an open polyline (outside on its right). */
function lip(p: Part, pts: XY[], out: number, z: number, t: number) {
  const nrm = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }
  const o = pts.map((q, i) => {
    const n0 = i > 0 ? nrm(pts[i - 1], q) : nrm(q, pts[i + 1])
    const n1 = i < pts.length - 1 ? nrm(q, pts[i + 1]) : n0
    const m: XY = [n0[0] + n1[0], n0[1] + n1[1]], l = Math.hypot(m[0], m[1])
    const k = out / Math.max(0.5, (m[0] * n0[0] + m[1] * n0[1]) / l)
    return [q[0] + (m[0] / l) * k, q[1] + (m[1] / l) * k] as XY
  })
  const V = (q: XY, zz: number): V3 => [q[0], q[1], zz]
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], c = o[i + 1], d = o[i]
    quadF(p, V(a, z + t), V(b, z + t), V(c, z + t), V(d, z + t), [0, 0, 1])
    quadF(p, V(a, z), V(b, z), V(c, z), V(d, z), [0, 0, -1])
    const n = nrm(a, b)
    quadF(p, V(d, z), V(c, z), V(c, z + t), V(d, z + t), [n[0], n[1], 0])
  }
  for (const [q, r, s] of [[pts[0], o[0], pts[1]], [pts[pts.length - 1], o[o.length - 1], pts[pts.length - 2]]] as [XY, XY, XY][]) {
    const want: V3 = [q[0] - s[0], q[1] - s[1], 0]
    quadF(p, V(q, z), V(r, z), V(r, z + t), V(q, z + t), want)
  }
}

function build() {
  const stucco = new Part(), win = new Part(), roof = new Part(), sign = new Part(), fin = new Part()

  const FX = 25.4, RX = 19.5
  // Rounded corners at both ends of the front, radius 3.
  const corner: XY[] = [[22.4, -11.0], [23.9, -10.6], [24.9, -9.6], [25.4, -8.0]]
  const cornerN: XY[] = [[25.4, 8.2], [24.9, 9.8], [23.9, 10.8], [22.4, 11.22]]
  const front: XY[] = [[RX, -11.9], [20.4, -11.7], ...corner, ...cornerN, [RX, 11.24]]
  const rear: XY[] = [[-14.0, -16.6], [2.5, -16.7], [2.5, -7.8], [10.1, -7.9], [10.1, -10.4], [13.5, -11.7], [16.9, -12.3], [RX, -11.9], [RX, 11.24], [-13.9, 11.3]]

  // --- Masses.
  const FR = 12.0, RR = 14.4
  walls(stucco, front, 0, FR - 0.9)
  parapet(stucco, front, FR - 0.9, FR, 0.3)
  cap(roof, inset(front, 0.3), FR - 1.1)
  walls(stucco, rear, 0, RR - 0.8)
  parapet(stucco, rear, RR - 0.8, RR, 0.3)
  cap(roof, inset(rear, 0.3), RR - 1.0)

  // --- Front: fins, raised centre, windows, eyebrows.
  const fa: XY = [FX, -8.0], fb: XY = [FX, 11.2]
  const sAt = (y: number) => y + 8.0
  const FINS = [-4.0, 0, 4.0], FH = 0.75, FO = 1.15, FT = 15.6
  // Each fin steps in near the top: a full shaft to FT, a narrower stage to 17.0.
  for (const y of FINS) {
    box(fin, fa, fb, sAt(y) - FH, sAt(y) + FH, -0.1, FO, 4.9, FT)
    box(fin, fa, fb, sAt(y) - FH * 0.62, sAt(y) + FH * 0.62, -0.3, FO * 0.62, FT, 17.0)
  }
  box(stucco, fa, fb, sAt(-4.0), sAt(4.0), -1.2, 0.0, FR, 14.3)
  const W2: [number, number] = [5.2, 6.8], W3: [number, number] = [8.3, 9.8]
  for (const [z0, z1] of [W2, W3]) {
    for (const y of [-2.0, 2.0]) panel(win, fa, fb, sAt(y) - 0.8, sAt(y) + 0.8, z0, z1, 0.05)
    panel(win, fa, fb, sAt(-7.3), sAt(-5.4), z0, z1, 0.05)
    panel(win, fa, fb, sAt(5.4), sAt(7.3), z0, z1, 0.05)
  }
  // Eyebrows: from the south side round the corner, along the front and
  // round the north-east corner onto 13th Street.
  const path: XY[] = [[13.5, -11.7], [16.9, -12.3], [20.4, -11.7], ...corner, ...cornerN, [19.0, 11.24]]
  for (const z of [7.0, 10.0]) lip(stucco, path, 1.0, z, 0.35)
  // Porch: canopy slab, its fascia carrying the sign, the low wall, the glazing.
  box(stucco, fa, fb, -2.4, 18.6, 0, 3.0, 3.55, 3.95, true)
  box(stucco, fa, fb, -2.4, 18.6, 2.7, 3.0, 0, 0.9)
  for (let k = 0; k < 5; k++) panel(win, fa, fb, 0.3 + k * 3.1, 2.9 + k * 3.1, 0.6, 3.3, 0.05)

  // --- The sign: "The CARLYLE", centred on the middle fin, on the wall over the canopy.
  const SW = 0.13
  const caps = word('CARLYLE', 0.5, 0.62, 0.12, SW)
  const the = new Pen()
  // Script "The": a looped T with a swash bar, then h and e.
  the.moveTo([0.0, 0.62]).cubicTo([0.15, 0.7], [0.45, 0.58], [0.62, 0.66])
  the.moveTo([0.34, 0.64]).cubicTo([0.3, 0.4], [0.22, 0.15], [0.12, 0.02])
  the.moveTo([0.52, 0.02]).lineTo([0.66, 0.6]).moveTo([0.58, 0.22]).cubicTo([0.66, 0.36], [0.82, 0.36], [0.8, 0.2]).lineTo([0.78, 0.02])
  the.moveTo([0.92, 0.14]).cubicTo([1.08, 0.18], [1.1, 0.34], [0.98, 0.32]).cubicTo([0.86, 0.3], [0.86, 0.02], [1.08, 0.04])
  const theW = 1.15, gap = 0.25, total = theW + gap + caps.width
  const { P, u, n } = onWall(fa, fb)
  const s0 = sAt(0) - total / 2
  strokes(sign, the.paths, { width: SW, depth: 0.12, place: facePlace(P(s0, 4.1, 0.1), u, n) })
  strokes(sign, caps.paths, { width: SW, depth: 0.12, place: facePlace(P(s0 + theW + gap, 4.1, 0.1), u, n) })

  // --- Sides: punched windows on the upper floors.
  const N: [XY, XY] = [[FX, 11.2], [-13.9, 11.3]]
  punched(win, N[0], N[1], cols(39.3, 8, 3.0), 2.0, [W2, W3])
  punched(win, [16.9, -12.3], [20.4, -11.7], [1.75], 1.6, [W2, W3])
  punched(win, [13.5, -11.7], [16.9, -12.3], [1.7], 1.6, [W2, W3])
  punched(win, [-14.0, -16.6], [2.5, -16.7], cols(16.5, 3, 3.0), 2.0, [W2, W3])
  punched(win, [-13.9, 11.3], [-14.0, -16.6], cols(27.9, 4, 3.5), 2.0, [W2, W3])

  return [
    { part: stucco, material: finish('carlyle-stucco', 0xf6f4ef) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: sign, material: finish('neon-carlyle-pink', 0xe0607a, 0.5) },
    { part: fin, material: finish('neon-carlyle-fin', 0xdbe4f5) },
  ]
}

if (import.meta.main) await save('mia-carlyle-hotel', 'The Carlyle', [25.783804, -80.1303364], 8, build(), 5000)
