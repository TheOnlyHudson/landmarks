/**
 * The Colony Hotel, Miami Beach (736 Ocean Drive; 1935, Henry Hohauser) —
 * original procedural geometry, CC0-1.0.
 * bun generators/mia-colony-hotel.ts
 *
 * Also exports the block-letter glyphs (`glyph`, `word`) that
 * mia-carlyle-hotel imports; the Colony is only written when this file runs
 * itself.
 *
 * Map frame: model +y points along the bearing (11°, Ocean Drive's line),
 * +x to its right (101°, toward Ocean Drive and the beach); metres; origin
 * at the anchor on the ground. Anchor = centroid of the OSM outline
 * way/435587753, 25.7774621, -80.1315694. Front on +x.
 *
 * Identity, in order: the white four-storey Ocean Drive front, 12 m wide;
 * the lavender sign fin up its middle carrying "COLONY" in stacked letters
 * on its face and both sides, rising above the parapet; the "HOTEL"
 * marquee box across its foot over the entrance; the projecting eyebrows
 * with green edges over the top two floors, wrapping round the corners;
 * the wide window bands either side and the narrow windows and blue-striped
 * panels beside the fin; the raised centre of the parapet.
 *
 * Famous sign (STYLE.md, "Famous signs"): the Colony's sign is why the
 * building is known, so its letters are modelled, as stroked centre-lines
 * (generators/lettering.ts): Art Deco capitals traced from the photos
 * below — a narrow C, tall oval O's, plain L, N and Y; "HOTEL" in wide
 * capitals. Night: the letters are `neon-colony-blue` and glow blue, as the
 * real tubes do; windows glow (`window`).
 *
 * Evidence:
 *  - plan: OSM way/435587753 (37.8 x 12.1 m).
 *  - heights: lidar, USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019
 *    (flown 2019), 0.5 m grid, above the street: roof 11.3, parapet
 *    12.4–12.7, the fin's top ~13.3 (a thin fin, so read as at least that;
 *    drawn 14.2, as the photos show it standing clear of the raised parapet), a rooftop stair box at the back of the front, 13.0. The
 *    OSM height 16.1 is not borne out by the lidar.
 *  - storeys (ground + three), window bands, eyebrows, fin and marquee
 *    sizes: from the front photos, scaled by the 12.1 m front.
 *  - colours: white stucco, green eyebrow edges, lavender fin and marquee,
 *    pale blue stripe panels (drawn in the roof grey-blue), near-black (navy) letters by day (photos); the letters are drawn in the tubes' blue so they glow blue at night.
 *
 * Photos (Wikimedia Commons):
 *  - Colony_Hotel_Miami.jpg (Ad Meskens, CC BY-SA 3.0): the front, square on
 *  - Miami_Beach_-_Colony_Hotel_(2011).jpg (P. Hughes, CC BY-SA 4.0): the
 *    fin from the south
 *  - 6)_Colony_(1935).jpg (Elisa.rolle, CC BY-SA 4.0): the front, 2010s
 *  - Colony_Hotel.jpg (Codera23, CC BY-SA 4.0): night, blue neon
 *  - Colony_Hotel_(Miami_Beach).jpg (Visitor7, CC BY-SA 3.0): night
 *  - EAST ELEVATION - Colony Hotel ... HABS FLA,13-MIAM,18-1 (Walter
 *    Smalling Jr., HABS, public domain): the front and south side
 * No look-only sources. No commercial imagery.
 *
 * Left out: the zigzag frieze, the awnings, umbrellas and café railings,
 * the window mullions, the tubes along the parapet. The blue tubes under
 * the front's eyebrow lips are drawn as thin `neon` strips on the lips'
 * undersides.
 *
 * Doubts: the side walls are mostly hidden by the neighbours; their window
 * rhythm is estimated from the HABS photo of the south side. The rear is
 * drawn plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { parapet } from './mia-freedom-tower'
import { cols, faces, punched } from './mia-vizcaya'
import { box } from './mia-miami-beach-post-office'
import { Pen, strokes, type Pt } from './lettering'

// ---------------------------------------------------------------------------
// Block capitals: centre-lines in metres, cap height h, width w, origin at
// the letter's bottom left.

function ell(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 10): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = (a0 + ((a1 - a0) * i) / n) * Math.PI / 180
    return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)] as Pt
  })
}

/** One capital's paths. `sw` is the stroke width, used to keep strokes inside the box. */
export function glyph(ch: string, w: number, h: number, sw: number): Pt[][] {
  const e = sw / 2, x0 = e, x1 = w - e, y0 = e, y1 = h - e, xm = w / 2, ym = h / 2
  const rx = (x1 - x0) / 2, ry = (y1 - y0) / 2
  switch (ch) {
    case 'C': return [ell(xm, ym, rx, ry, 40, 320, 12)]
    case 'O': return [ell(xm, ym, rx, ry, 0, 360, 16)]
    case 'L': return [[[x0, y1], [x0, y0], [x1, y0]]]
    case 'N': return [[[x0, y0], [x0, y1], [x1, y0], [x1, y1]]]
    case 'Y': return [[[x0, y1], [xm, ym], [x1, y1]], [[xm, ym], [xm, y0]]]
    case 'H': return [[[x0, y0], [x0, y1]], [[x1, y0], [x1, y1]], [[x0, ym], [x1, ym]]]
    case 'T': return [[[x0, y1], [x1, y1]], [[xm, y1], [xm, y0]]]
    case 'E': return [[[x1, y1], [x0, y1], [x0, y0], [x1, y0]], [[x0, ym], [x1 - w * 0.12, ym]]]
    case 'A': return [[[x0, y0], [xm, y1], [x1, y0]], [[x0 + rx * 0.45, h * 0.35], [x1 - rx * 0.45, h * 0.35]]]
    case 'R': return [[[x0, y0], [x0, y1], [x1 - rx * 0.6, y1], ...ell(x1 - rx * 0.6, (y1 + ym) / 2, rx * 0.6, (y1 - ym) / 2, 90, -90, 6).slice(1), [x0, ym]], [[xm, ym], [x1, y0]]]
    default: return []
  }
}

/** A word laid left to right: letters of width w, gap g. */
export function word(text: string, w: number, h: number, g: number, sw: number): { paths: Pt[][]; width: number } {
  const paths: Pt[][] = []
  let x = 0
  for (const ch of text) {
    for (const p of glyph(ch, w, h, sw)) paths.push(p.map(([u, v]) => [u + x, v] as Pt))
    x += w + g
  }
  return { paths, width: x - g }
}

/** place() for a vertical face: origin o, unit right r (horizontal), normal n. */
export const facePlace = (o: V3, r: XY, n: XY) => (u: number, v: number, w: number): V3 =>
  [o[0] + r[0] * u + n[0] * w, o[1] + r[1] * u + n[1] * w, o[2] + v]

// ---------------------------------------------------------------------------
// The Colony

function build() {
  const stucco = new Part(), trim = new Part(), win = new Part(), fin = new Part(), neon = new Part(), blue = new Part()

  const X0 = -21.4, X1 = 16.4, Y0 = -5.7, Y1 = 6.4
  const ring = rect(X0, Y0, X1, Y1)
  const ROOF = 11.3
  walls(stucco, ring, 0, ROOF)
  parapet(stucco, ring, ROOF, 12.1, 0.3)
  parapet(trim, inset(ring, -0.05), 12.1, 12.3, 0.4)
  cap(blue, inset(ring, 0.3), ROOF - 0.2)
  // Rooftop stair box behind the front.
  box(stucco, [X0, Y0], [X1, Y0], 28.4, 33.4, -5.0, -0.2, ROOF - 0.2, 13.0)

  const [S, E, N, W] = faces(X0, Y0, X1, Y1)
  const FW = Y1 - Y0, MID = FW / 2
  const [fa, fb] = E // front, s from south to north

  // --- Front: window bands, narrow windows by the fin, stripe panels.
  const floors: [number, number][] = [[4.3, 5.6], [6.6, 7.9], [9.0, 10.3]]
  for (const [z0, z1] of floors) {
    panel(win, fa, fb, 0.5, 3.9, z0, z1, 0.05)
    panel(win, fa, fb, FW - 3.9, FW - 0.5, z0, z1, 0.05)
    panel(win, fa, fb, MID - 1.75, MID - 0.95, z0 + 0.1, z1, 0.05)
    panel(win, fa, fb, MID + 0.95, MID + 1.75, z0 + 0.1, z1, 0.05)
  }
  for (const z of [5.75, 8.1, 10.5]) {
    panel(blue, fa, fb, MID - 2.0, MID - 0.7, z, z + 0.7, 0.05)
    panel(blue, fa, fb, MID + 0.7, MID + 2.0, z, z + 0.7, 0.05)
  }
  // Ground floor: shopfront glazing and the entrance under the marquee.
  panel(win, fa, fb, 0.5, MID - 1.6, 0.7, 2.8, 0.05)
  panel(win, fa, fb, MID + 1.6, FW - 0.5, 0.7, 2.8, 0.05)
  panel(win, fa, fb, MID - 1.0, MID + 1.0, 0.3, 3.0, 0.05)

  // Eyebrows over the top two floors, wrapping round the front corners;
  // a thin green line over the second floor.
  for (const z of [8.05, 10.45]) {
    box(stucco, fa, fb, -0.7, FW + 0.7, 0, 0.75, z, z + 0.32, true)
    panel(trim, fa, fb, -0.7, FW + 0.7, z - 0.01, z + 0.33, 0.76)
    box(stucco, S[0], S[1], X1 - X0 - 3.0, X1 - X0, 0, 0.7, z, z + 0.32, true)
    box(stucco, N[0], N[1], 0, 3.0, 0, 0.7, z, z + 0.32, true)
    panel(trim, S[0], S[1], X1 - X0 - 3.0, X1 - X0 + 0.7, z - 0.01, z + 0.33, 0.71)
    panel(trim, N[0], N[1], -0.7, 3.0, z - 0.01, z + 0.33, 0.71)
    // The blue tube under the lip: hidden from above by day, lit at night.
    const { P: Q } = onWall(fa, fb), zt = z - 0.02
    neon.quad(Q(-0.5, zt, 0.4), Q(-0.5, zt, 0.72), Q(FW + 0.5, zt, 0.72), Q(FW + 0.5, zt, 0.4))
  }
  panel(trim, fa, fb, 0.3, FW - 0.3, 5.85, 6.05, 0.07)

  // Raised centre of the parapet, with its blue stripes.
  box(stucco, fa, fb, MID - 2.6, MID + 2.6, -0.6, 0.05, 12.1, 12.9)
  panel(blue, fa, fb, MID - 2.3, MID - 0.9, 12.2, 12.75, 0.07)
  panel(blue, fa, fb, MID + 0.9, MID + 2.3, 12.2, 12.75, 0.07)

  // --- The sign: fin and marquee.
  const F0 = 4.9, F1 = 14.2, FD = 1.9, FH = 0.58
  box(fin, fa, fb, MID - FH, MID + FH, -0.1, FD, F0, F1)
  box(fin, fa, fb, MID - 3.05, MID + 3.05, -0.1, 1.0, 3.6, F0, true)

  const { P, u, n } = onWall(fa, fb)
  const LW = 0.17, LD = 0.1
  // COLONY stacked on the fin's face.
  const L1 = 1.08, P1 = 1.38, top = F1 - 0.35
  'COLONY'.split('').forEach((ch, i) => {
    const vb = top - L1 - P1 * i
    const wF = 0.78
    strokes(neon, glyph(ch, wF, L1, LW), { width: LW, depth: LD, place: facePlace(P(MID - wF / 2, vb, FD), u, n) })
    // Both sides, read from the street: on the south side +u is toward the
    // front (out), on the north side away from it.
    const wS = 1.3
    const south = facePlace(P(MID - FH, vb, FD - 0.25 - wS), [n[0], n[1]], [-u[0], -u[1]])
    strokes(neon, glyph(ch, wS, L1, LW), { width: LW, depth: LD, place: south })
    const north = facePlace(P(MID + FH, vb, 0.25 + wS), [-n[0], -n[1]], [u[0], u[1]])
    strokes(neon, glyph(ch, wS, L1, LW), { width: LW, depth: LD, place: north })
  })
  // HOTEL on the marquee's face.
  const hw = word('HOTEL', 0.86, 0.98, 0.26, 0.2)
  strokes(neon, hw.paths, { width: 0.2, depth: LD, place: facePlace(P(MID - hw.width / 2, 3.76, 1.0), u, n) })

  // --- Sides and rear: punched windows over the upper floors.
  for (const [a, b] of [S, N]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    punched(win, a, b, cols(L, 6, 6.0), 1.8, floors)
  }
  punched(win, W[0], W[1], cols(FW, 3, 2.0), 1.2, floors)

  return [
    { part: stucco, material: finish('colony-stucco', 0xf6f3ee) },
    { part: trim, material: finish('colony-green', 0x5fae96) },
    { part: win, material: PALETTE.window },
    { part: fin, material: finish('colony-lavender', 0xe6cde6) },
    { part: neon, material: finish('neon-colony-blue', 0x3352c4, 0.5) },
    { part: blue, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('mia-colony-hotel', 'The Colony Hotel', [25.7774621, -80.1315694], 11, build(), 5000)
