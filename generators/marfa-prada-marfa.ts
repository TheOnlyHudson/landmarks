/**
 * Prada Marfa: Elmgreen & Dragset's permanent sculpture (2005), a sealed
 * Prada shop front standing alone beside U.S. Route 90, 2.3 km north-west of
 * Valentine, Jeff Davis County, Texas. A small flat-roofed box of adobe
 * brick under cream plaster, with a cornice lip under a low parapet and a
 * ledge round its base; on the front, facing the highway, two plate-glass
 * shop windows in aluminium frames either side of a glass door that doesn't
 * open, each window under a grey awning lettered PRADA and a black board
 * lettered PRADA / MARFA. Through the glass: white shelves of shoes on the
 * back wall and handbags on low plinths. The sides and back are blank.
 * Original procedural geometry, CC0-1.0.   bun generators/marfa-prada-marfa.ts
 *
 * Frame: bearing 41. +y faces the highway (north-east), +x runs along it
 * (south-east). x right, y up the page, z up, metres; origin at the anchor
 * -104.5185081, 30.6034566, the middle of the OSM outline, on the ground.
 *
 * Ground: the desert pad is flat (Mapterhorn, within 0.2 m over 20 m).
 * Elevation 0.
 *
 * Evidence
 * - OSM way/357863959 (building=yes, "Prada Marfa"; tourism=artwork): a
 *   7.9 x 5.3 m box whose long side runs at bearing 134.5.
 * - USGS NAIP (0.6 m, 2022): the white roof, about 9 x 6 m blurred, its long
 *   side at bearing 126 beside the highway's 131; the model splits the two
 *   (bearing 41 + 90 = 131).
 * - Dimensions: 7.6 x 4.6 m (25 x 15 ft), the size usually given for the
 *   work (the brief; consistent with NAIP and with OSM's slightly larger
 *   outline). Height 4.8 m to the parapet: estimated from the face-on
 *   photo below, scaled to the 7.6 m front (0.00843 m/px), which also gives
 *   a 2.05 m door, a plausible check.
 * - Wikipedia "Prada Marfa": materials (adobe bricks, plaster, paint, glass
 *   pane, aluminum frame, MDF, carpet), the non-working door, the two front
 *   windows of shoes and handbags, the ledge round the base.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   "(Valentine, Texas) Prada Marfa.jpg" (MarkScottAustinTX, CC BY-SA 2.0):
 *     the front face-on, every height below: base 0-0.38, windows
 *     0.38-2.1 over u +-(0.6..3.38), door 0.5-2.55 with its transom to 2.78,
 *     awnings from 2.8 down to a valance 2.0-2.33, boards 2.8-3.65 over
 *     u +-(0.56..3.45), the cornice lip 4.36-4.5, the parapet to 4.8;
 *   "Prada Marfa Pixabay popmortem.jpg" (popmortem, CC0) and "2014-07-26
 *     Prada Marfa 2.jpg" (Nicolas Henderson, CC BY 2.0): the awnings' depth
 *     (about 0.9 m) and the blank side walls;
 *   "2012-10-09 Back of Prada Marfa.jpg" (daveynin, CC BY 2.0) and
 *     "2013-05-17 back of prada marfa.jpg" (panda brand, CC BY-SA 2.0): the
 *     back is a blank plastered wall over the base ledge, with the cornice;
 *   "2015-09-06 Prada Marfa side.jpg" (MarkScottAustinTX, CC BY-SA 2.0):
 *     the side wall and the ledge;
 *   "2014-03-28 Prada Marfa twilight.jpg" (Nan Palmero, CC BY 2.0) and
 *     "Prada Marfa.tiff" (Carol M. Highsmith, public domain): at dusk the
 *     shop's interior is lit and the windows glow; the boards and the walls
 *     are not lit.
 *
 * Lettering is the exception STYLE.md allows for a famous sign: the work is
 * a sign. PRADA in the boards' white serif capitals and again in black on
 * each awning's valance, cap height 0.26 m against the photo's 0.21 so they
 * survive a close view; MARFA under it (0.06 m) is left out.
 *
 * Night: the interior (its shelves, back and side walls, `window-2`) glows
 * through the dark translucent glass, as in the dusk photos. Nothing else is
 * lit; the site has no floodlights.
 *
 * Doubts: the height is from one photo; the interior's depth and shelf
 * heights are read through glass; the door's dark metal sill and the
 * security camera on the corner are left out; the roof is assumed flat
 * behind the parapet (NAIP shows it plain white).
 */
import { Part, cross, sub, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { report, writeGlb } from './sf-de-young'
import { box as box0 } from './sf-opera-house'
import { Pen, strokes } from './lettering'

/** An axis-aligned box, corners in either order. */
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, under = false) =>
  box0(p, Math.min(x0, x1), Math.max(x0, x1), Math.min(y0, y1), Math.max(y0, y1), z0, z1, under)

const plaster = new Part(), black = new Part(), alu = new Part(), glass = new Part(), inside = new Part()

/** A quad wound to face `want`. */
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
/** A rectangle in the front plane y = Y, facing +y, over x0..x1, z0..z1. */
const front = (p: Part, Y: number, x0: number, x1: number, z0: number, z1: number, n: V3 = [0, 1, 0]) =>
  qf(p, [x0, Y, z0], [x1, Y, z0], [x1, Y, z1], [x0, Y, z1], n)

const L = 3.8, D = 2.3 // half-length (along the highway), half-depth
const TOP = 4.8, CORN = 4.36, WT = 0.35 // parapet top, cornice, wall thickness
const WIN = { z0: 0.38, z1: 2.1, a: 0.6, b: 3.38 } // windows over |x| a..b
const DOOR = { z0: 0.42, z1: 2.78, a: 0.6 }

// ---------------------------------------------------------------------------
// The shell: back and sides whole; the front pierced for the windows and
// the door. Walls are 0.35 m thick round an inner room.
qf(plaster, [L, -D, 0], [-L, -D, 0], [-L, -D, TOP], [L, -D, TOP], [0, -1, 0])
qf(plaster, [-L, -D, 0], [-L, D, 0], [-L, D, TOP], [-L, -D, TOP], [-1, 0, 0])
qf(plaster, [L, D, 0], [L, -D, 0], [L, -D, TOP], [L, D, TOP], [1, 0, 0])
front(plaster, D, -L, L, 0, WIN.z0)
front(plaster, D, -L, -DOOR.a, WIN.z0, WIN.z0 + 0.04) // sill under the door
front(plaster, D, DOOR.a, L, WIN.z0, WIN.z0 + 0.04)
front(plaster, D, -L, -WIN.b, WIN.z0, DOOR.z1)
front(plaster, D, WIN.b, L, WIN.z0, DOOR.z1)
front(plaster, D, -WIN.b, -DOOR.a, WIN.z1, DOOR.z1)
front(plaster, D, DOOR.a, WIN.b, WIN.z1, DOOR.z1)
front(plaster, D, -L, L, DOOR.z1, TOP)
// the reveals round each opening, through the wall (the glass is 0.15 m in)
const GY = D - 0.15, RY = D - WT
const reveal = (x0: number, x1: number, z0: number, z1: number) => {
  qf(plaster, [x0, D, z0], [x0, RY, z0], [x0, RY, z1], [x0, D, z1], [1, 0, 0])
  qf(plaster, [x1, RY, z0], [x1, D, z0], [x1, D, z1], [x1, RY, z1], [-1, 0, 0])
  qf(plaster, [x0, RY, z1], [x1, RY, z1], [x1, D, z1], [x0, D, z1], [0, 0, -1])
  qf(plaster, [x0, D, z0], [x1, D, z0], [x1, RY, z0], [x0, RY, z0], [0, 0, 1])
}
reveal(-WIN.b, -WIN.a, WIN.z0, WIN.z1)
reveal(WIN.a, WIN.b, WIN.z0, WIN.z1)
reveal(-DOOR.a, DOOR.a, DOOR.z0, DOOR.z1)

// cornice lip, a low parapet and the flat roof behind it
box(plaster, -L - 0.1, L + 0.1, -D - 0.1, D + 0.1, CORN, CORN + 0.14, true)
{
  const i = 0.22, zr = TOP - 0.2
  box(plaster, -L, L, D - i, D, CORN + 0.14, TOP)
  box(plaster, -L, L, -D, -D + i, CORN + 0.14, TOP)
  box(plaster, -L, -L + i, -D + i, D - i, CORN + 0.14, TOP)
  box(plaster, L - i, L, -D + i, D - i, CORN + 0.14, TOP)
  qf(plaster, [-L + i, -D + i, zr], [L - i, -D + i, zr], [L - i, D - i, zr], [-L + i, D - i, zr], [0, 0, 1])
  // the walls' tops between the cornice and the roof, round the inner side
  box(plaster, -L + i, L - i, -D + i, D - i, CORN + 0.14, zr)
}
// the ledge round the base, where visitors leave their cards
box(plaster, -L - 0.15, L + 0.15, -D - 0.15, D + 0.15, 0, 0.42)

// ---------------------------------------------------------------------------
// The shop inside, seen through the glass: an inner room whose walls, floor and
// ceiling are the lit display (window-2), white shelves
// along the back wall with shoes on them, and handbags on two low plinths.
const IX = L - WT, IY0 = -D + WT, IY1 = D - WT, FZ = 0.42, CZ = 3.0
qf(inside, [-IX, IY0, FZ], [IX, IY0, FZ], [IX, IY0, CZ], [-IX, IY0, CZ], [0, 1, 0]) // back wall, facing in
qf(inside, [-IX, IY1, FZ], [-IX, IY0, FZ], [-IX, IY0, CZ], [-IX, IY1, CZ], [1, 0, 0])
qf(inside, [IX, IY0, FZ], [IX, IY1, FZ], [IX, IY1, CZ], [IX, IY0, CZ], [-1, 0, 0])
qf(inside, [-IX, IY0, CZ], [IX, IY0, CZ], [IX, IY1, CZ], [-IX, IY1, CZ], [0, 0, -1]) // ceiling
qf(inside, [-IX, IY0, FZ], [-IX, IY1, FZ], [IX, IY1, FZ], [IX, IY0, FZ], [0, 0, 1]) // pale carpet, lit at night like the rest
for (const s of [-1, 1]) {
  for (const z of [0.95, 1.45, 1.95]) box(plaster, s * 0.9, s * 3.2, IY0, IY0 + 0.3, z - 0.04, z)
  // shoes: low dark blocks along each shelf
  for (const z of [0.95, 1.45, 1.95]) for (let k = 0; k < 4; k++) {
    const x = s * (1.2 + k * 0.6)
    box(black, x - 0.13, x + 0.13, IY0 + 0.08, IY0 + 0.24, z, z + 0.12)
  }
  // a plinth with three handbags in front of each window
  box(plaster, s * 1.2, s * 2.6, IY1 - 1.0, IY1 - 0.45, FZ, FZ + 0.42, false)
  for (let k = 0; k < 3; k++) {
    const x = s * (1.45 + k * 0.45)
    box(black, x - 0.15, x + 0.15, IY1 - 0.8, IY1 - 0.65, FZ + 0.42, FZ + 0.72)
  }
}

// ---------------------------------------------------------------------------
// Plate glass in aluminium frames: two shop windows and the door with its
// side light and transom.
for (const s of [-1, 1]) {
  const x0 = s < 0 ? -WIN.b : WIN.a, x1 = s < 0 ? -WIN.a : WIN.b
  front(glass, GY, x0, x1, WIN.z0, WIN.z1)
}
front(glass, GY, -DOOR.a, DOOR.a, DOOR.z0, DOOR.z1)
const frame = (x0: number, x1: number, z0: number, z1: number, t = 0.06) => {
  front(alu, GY + 0.02, x0, x1, z0, z0 + t)
  front(alu, GY + 0.02, x0, x1, z1 - t, z1)
  front(alu, GY + 0.02, x0, x0 + t, z0 + t, z1 - t)
  front(alu, GY + 0.02, x1 - t, x1, z0 + t, z1 - t)
}
frame(-WIN.b, -WIN.a, WIN.z0, WIN.z1)
frame(WIN.a, WIN.b, WIN.z0, WIN.z1)
frame(-DOOR.a, DOOR.a, DOOR.z0, DOOR.z1)
front(alu, GY + 0.02, -DOOR.a, DOOR.a, 2.5, 2.56) // transom bar
front(alu, GY + 0.02, 0.26, 0.32, DOOR.z0, 2.5) // door's edge, by its side light
front(alu, GY + 0.02, -0.5, -0.44, DOOR.z0 + 0.05, 2.5)

// ---------------------------------------------------------------------------
// Each window's black board and grey awning.
const BOARD = { z0: 2.82, z1: 3.65, a: 0.56, b: 3.45 }
const AW = { a: 0.5, b: 3.6, out: 0.9, zt: 2.8, zv: 2.33, zb: 2.0 }
for (const s of [-1, 1]) {
  const x0 = s < 0 ? -BOARD.b : BOARD.a, x1 = s < 0 ? -BOARD.a : BOARD.b
  box(black, x0, x1, D, D + 0.08, BOARD.z0, BOARD.z1, true)
  const a0 = s < 0 ? -AW.b : AW.a, a1 = s < 0 ? -AW.a : AW.b, yv = D + AW.out
  // the sloping canvas, the valance, its ends and the underside
  qf(alu, [a0, D, AW.zt], [a1, D, AW.zt], [a1, yv, AW.zv], [a0, yv, AW.zv], [0, AW.zt - AW.zv, AW.out])
  qf(alu, [a0, D, AW.zt - 0.02], [a0, yv, AW.zv - 0.02], [a1, yv, AW.zv - 0.02], [a1, D, AW.zt - 0.02], [0, -(AW.zt - AW.zv), -AW.out])
  front(alu, yv, a0, a1, AW.zb, AW.zv)
  qf(alu, [a0, yv - 0.03, AW.zb], [a1, yv - 0.03, AW.zb], [a1, yv - 0.03, AW.zv], [a0, yv - 0.03, AW.zv], [0, -1, 0])
  qf(alu, [a0, yv - 0.03, AW.zb], [a0, yv, AW.zb], [a1, yv, AW.zb], [a1, yv - 0.03, AW.zb], [0, 0, -1])
  for (const x of [a0, a1]) qf(alu, [x, D, AW.zt], [x, yv, AW.zv], [x, yv, AW.zb], [x, D, AW.zv], [Math.sign(x - (a0 + a1) / 2), 0, 0])
}

// ---------------------------------------------------------------------------
// PRADA, as the sign's serif capitals: unit cap height, stems with serifs.
function prada(): Pen {
  const p = new Pen(), sf = 0.13
  const serifs = (x: number, ...zs: number[]) => { for (const z of zs) p.moveTo([x - sf, z]).lineTo([x + sf, z]) }
  const P = (x: number) => {
    p.moveTo([x, 0]).lineTo([x, 1]).lineTo([x + 0.36, 1]).arc([x + 0.36, 0.75], -Math.PI, 5).lineTo([x, 0.5])
    serifs(x, 0, 1)
    return x + 0.78
  }
  const R = (x: number) => {
    p.moveTo([x, 0]).lineTo([x, 1]).lineTo([x + 0.36, 1]).arc([x + 0.36, 0.75], -Math.PI, 5).lineTo([x, 0.5])
    p.moveTo([x + 0.3, 0.5]).lineTo([x + 0.64, 0])
    serifs(x, 0, 1); serifs(x + 0.66, 0)
    return x + 0.94
  }
  const A = (x: number) => {
    p.moveTo([x, 0]).lineTo([x + 0.38, 1]).lineTo([x + 0.76, 0])
    p.moveTo([x + 0.15, 0.36]).lineTo([x + 0.61, 0.36])
    serifs(x, 0); serifs(x + 0.76, 0)
    return x + 1.04
  }
  const Dd = (x: number) => {
    p.moveTo([x, 0]).lineTo([x, 1]).lineTo([x + 0.3, 1]).cubicTo([x + 0.86, 1], [x + 0.86, 0], [x + 0.3, 0], 6).lineTo([x, 0])
    serifs(x, 0, 1)
    return x + 0.96
  }
  let x = 0.13
  x = P(x); x = R(x); x = A(x); x = Dd(x); x = A(x)
  return p.translate(-(x - 0.28 + 0.13) / 2)
}
const word = prada().paths
const CAP = 0.26
for (const s of [-1, 1]) {
  const cx = s * (BOARD.a + BOARD.b) / 2
  // white on the board (plaster stands in for the paint)
  strokes(plaster, word, { width: 0.17, depth: 0.25, place: (u, v, w) => [cx - u * CAP, D + 0.08 + w * 0.1, 3.19 + v * CAP] })
  // black on the valance
  const cv = s * (AW.a + AW.b) / 2
  strokes(black, word, { width: 0.17, depth: 0.25, place: (u, v, w) => [cv - u * 0.22, D + AW.out + w * 0.1, 2.055 + v * 0.22] })
}

// ---------------------------------------------------------------------------
const parts = [
  { part: plaster, material: finish('prada-plaster', 0xefe7d7) },
  { part: black, material: finish('prada-black', 0x4a4f57) },
  { part: alu, material: finish('prada-aluminium-awning', 0xc9c6c0) },
  { part: glass, material: { name: 'glass', color: 0xa9c8d8, roughness: 0.2, opacity: 0.32, doubleSided: true } },
  { part: inside, material: windowVariant(2, 0xe2e4da) },
]
const glb = writeGlb('Prada Marfa', parts, {
  license: 'CC0-1.0', bearing: 41, elevation: 0, anchor: [30.6034566, -104.5185081],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/357863959'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Prada Marfa', parts, glb, 5000)
const out = new URL('../models/marfa-prada-marfa.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
