/**
 * Altria Theater (the Mosque, Acca Temple Shrine), Richmond — procedural,
 * CC0-1.0, no textures.
 * bun generators/ric-altria-theater.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/229623395 (lng -77.4521075, lat 37.5462271); the
 * walls run at 1° and 91°, so the model is placed at bearing 1 and built
 * square. The entrance front with the twin minarets faces east onto Laurel
 * Street; Main Street runs along the south side.
 *
 * What it is: Marcellus Wright's Moorish-revival Shrine temple and theatre
 * of 1925–27, sand-coloured brick with cream stone trim: a big auditorium
 * block, lower ranges and corner towers with green copper domes, and on
 * Laurel Street a tall entrance pavilion with a great pointed-arch recess,
 * crenellated cresting, and two square minarets ending in a balcony, a
 * tiled drum and a green cupola with a finial.
 *
 * Covers and replaces: way/229623395 (the only OSM building here; no parts).
 *
 * Evidence
 * - OSM (measured): outline, read in the bearing-1 frame: main body
 *   x -20..37.8, y -33.3..28.6; entrance front x 37.7 between y -11.2 and
 *   7.1; west annex x -47.3..-20, y -16.8..28.
 * - USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014), 1 m grid
 *   read every 3 m (measured, above the street; the site is flat to 0.5 m):
 *   auditorium roof 23.3, its raised centre 25.2; south and north fronts
 *   stepping down to 8.8 m strips along Main Street and the north alley;
 *   east ranges 19.8; entrance pavilion 25.2 at its street face (27.9 behind it); minaret finials 38.5–39.6;
 *   east corner towers' domes 25.0; west corner towers' domes 16.4; west
 *   annex 12.5 and 15.0.
 * - Photos (Wikimedia Commons, EVIDENCE; each at
 *   https://commons.wikimedia.org/wiki/File:<name with underscores>):
 *   "Landmark Theater Richmond Virginia.jpg" (Mentes, public domain), the
 *   entrance pavilion and minarets from below: brick colour, the pointed
 *   arch recess and its stone surround, the cresting, the minarets' balcony,
 *   tiled drum and cupola, cream-framed window strips;
 *   "Richmond 23 Shooting - Altria VCU.jpg" and "Richmond 23 Shooting -
 *   Altria Closed Road.jpg" (MonkeyBBGB, CC0), the east front and the
 *   Main Street corner: window strips grouped over storeys, arched
 *   windows over a stone ground storey, the green corner domes;
 *   "The mosque, Richmond Civic Center, Richmond, Va.jpg" (Boston Public
 *   Library, Tichnor postcard, CC BY 2.0): the massing from the south-east
 *   (its red brick is the printer's; the brick is sand-coloured).
 * - USGS NAIP (public domain): plan, pale roofs, the green domes at the
 *   corners.
 * - Estimated: window strip widths and counts from the photos; the arch
 *   recess 9 m wide and 19 m tall; minaret shafts 4 m square to 35.4 m, with the balcony, drum and
 *   cupola in the top 5 m (photo proportions, lidar finial height);
 *   the east ranges' four bays a side and their stone ground storey (from
 *   the Closed Road photo); the west annex's faces (not photographed here); the north side is
 *   mirrored from the south (doubt).
 * - Simplified: tile and arabesque work are flat panels; the marquee is a
 *   plain slab; no lettering.
 * - Night: the entrance front and minarets are floodlit; windows glow.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, panel, rect, type Side, type Rect } from './dc-white-house'
import { saveModel, lathe, pslab, type Mat } from './dc-nga-west'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), copper = new Part(), tile = new Part()

// ---- Heights (lidar, above the street)
const HALL = 23.3, HALL_TOP = 25.2, STRIP = 8.8, RANGE = 19.8, PAV = 25.2

/** A wall block with a cream cornice band and a parapet. */
function body(r: Rect, z1: number, top: Part = roof) {
  cbox(brick, r, 0, z1 - 0.9, { top: false })
  cbox(trim, grow(r, 0.3), z1 - 0.9, z1 - 0.5, { bottom: true, top: false })
  cbox(brick, r, z1 - 0.5, z1, { b: 0.15, top })
  cbox(trim, grow(r, 0.08), 0, 1.0, { top: false }) // stone base course
}

/** Window strips: a cream frame panel with a window panel inside, two groups. */
function strip(side: Side, at: number, c: number, w: number, z0: number, z1: number) {
  panel(trim, side, at, c - w / 2 - 0.35, c + w / 2 + 0.35, z0 - 0.35, z1 + 0.35, 0.03)
  const zm = (z0 + z1) / 2
  panel(win, side, at, c - w / 2, c + w / 2, z0, zm - 0.3, 0.06)
  panel(win, side, at, c - w / 2, c + w / 2, zm + 0.3, z1, 0.06)
}

/** A round-headed window, a half disc over jambs. */
function arched(side: Side, at: number, c: number, w: number, z0: number, zs: number) {
  panel(win, side, at, c - w / 2, c + w / 2, z0, zs, 0.06)
  const n: V3 = side === 's' ? [0, -1, 0] : side === 'n' ? [0, 1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const off = at + (n[0] + n[1]) * 0.06
  const P = (a: number, z: number): V3 => (side === 's' || side === 'n' ? [a, off, z] : [off, a, z])
  const seg = 8
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    const tri = [P(c, zs), P(c + (w / 2) * Math.cos(a0), zs + (w / 2) * Math.sin(a0)), P(c + (w / 2) * Math.cos(a1), zs + (w / 2) * Math.sin(a1))]
    face(win, tri, n)
  }
}
function face(p: Part, q: V3[], n: V3) {
  const u = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], v = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const c = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (c[0] * n[0] + c[1] * n[1] + c[2] * n[2] >= 0) p.tri(q[0], q[1], q[2])
  else p.tri(q[0], q[2], q[1])
}

/** A pointed (equilateral-ish) arch panel on an east-facing wall at x = at. */
function pointedArch(p: Part, at: number, d: number, c: number, w: number, z0: number, zs: number) {
  const n: V3 = [1, 0, 0], x = at + d, r = w * 0.8, seg = 6
  panel(p, 'e', at, c - w / 2, c + w / 2, z0, zs, d)
  // each half: an arc centred on the far jamb's side, meeting at the apex
  const h = Math.sqrt(r * r - (r - w / 2) ** 2)
  for (const s of [-1, 1]) {
    const cx = c - s * (r - w / 2) // centre of this half's arc
    const pts: V3[] = []
    const aStart = s > 0 ? 0 : Math.PI, aEnd = s > 0 ? Math.atan2(h, r - w / 2) : Math.atan2(h, -(r - w / 2))
    for (let k = 0; k <= seg; k++) {
      const a = aStart + ((aEnd - aStart) * k) / seg
      pts.push([x, cx + r * Math.cos(a), zs + r * Math.sin(a)])
    }
    for (let k = 0; k < seg; k++) face(p, [[x, c, zs], pts[k], pts[k + 1]], n)
  }
}

// ===========================================================================
// Auditorium block and its raised centre
body(rect(-20, 24, -27, 20), HALL)
cbox(roof, rect(-6, 12, -16, 8), HALL, HALL_TOP, { b: 0.3 })
// south and north: the low fronts along Main Street and the alley
body(rect(-13.3, 31, -32.1, -26.8), STRIP)
body(rect(-14, 30.5, 19.8, 27.8), STRIP)
// east ranges either side of the pavilion
body(rect(24, 37.7, -26.7, 22.9), RANGE)
// corner towers with green domes: tall on Laurel Street, low on the west
function tower(r: Rect, z1: number, dr: number) {
  body(r, z1)
  const cx = (r.x0 + r.x1) / 2, cy = (r.y0 + r.y1) / 2
  // octagonal drum then a hemisphere
  pslab(brick, Array.from({ length: 8 }, (_, k) => [cx + (dr + 0.4) * Math.cos((k + 0.5) * Math.PI / 4), cy + (dr + 0.4) * Math.sin((k + 0.5) * Math.PI / 4)] as [number, number]), z1, z1 + 0.9, 0.15, trim)
  const prof: [number, number][] = []
  for (let k = 0; k <= 6; k++) { const a = (Math.PI / 2) * (k / 6); prof.push([dr * Math.cos(a) + (k === 6 ? 0 : 0), z1 + 0.9 + dr * Math.sin(a)]) }
  prof[6] = [0.0001, prof[6][1]]
  lathe(copper, cx, cy, prof, 12)
}
tower(rect(30.6, 37.8, -31.8, -25.6), 21.4, 2.7)
tower(rect(30.6, 37.6, 22.0, 28.6), 21.4, 2.7)
tower(rect(-20.1, -13.3, -33.3, -26.8), 13.0, 2.5)
tower(rect(-20.6, -13.9, 20.0, 28.2), 13.0, 2.5)

// west annex
body(rect(-37, -20, -16.8, 10.4), 12.5)
body(rect(-47.2, -20, 10.4, 18), 15.0)
body(rect(-47.2, -20, 18, 27.9), 4.5)

// ---- windows
// south and north, upper wall: tall strips grouped over storeys
const bays = [-8, -2, 4, 10, 16, 22]
for (const [side, at] of [['s', -27], ['n', 20]] as [Side, number][]) {
  for (const c of bays) strip(side, at, c, 1.6, STRIP + 1.5, HALL - 2.5)
}
// south and north, low front: arched windows over a stone ground storey
for (const [side, at] of [['s', -32.1], ['n', 27.8]] as [Side, number][]) {
  panel(trim, side, at, -13.3, 31, 0, 3.6, 0.03)
  for (const c of bays) {
    arched(side, at, c, 2.2, 4.4, 6.6)
    panel(win, side, at, c - 1.4, c + 1.4, 0.6, 3.2, 0.06)
  }
}
// Laurel Street ranges: three strips either side of the pavilion
// (four strips a side over arched windows on a stone ground storey, as photographed)
const ER = [-23.2, -20.3, -17.4, -14.5, 9.3, 12.2, 15.1, 18.0]
panel(trim, 'e', 37.7, -25.6, -11.2, 0, 4.0, 0.03)
panel(trim, 'e', 37.7, 7.1, 22.0, 0, 4.0, 0.03)
for (const c of ER) {
  strip('e', 37.7, c, 1.5, 9.0, RANGE - 2.2)
  arched('e', 37.7, c, 1.8, 4.8, 6.9)
  panel(win, 'e', 37.7, c - 0.9, c + 0.9, 0.6, 3.2, 0.06)
}
// corner towers: a paired window high up on the street faces
for (const [side, at, c] of [['e', 37.8, -28.7], ['e', 37.6, 25.3], ['s', -31.8, 34.2], ['n', 28.6, 34.1]] as [Side, number, number][]) {
  strip(side, at, c, 1.8, 13.5, 18.5)
}
// west annex: a few windows
for (const c of [-12, -4, 4]) panel(win, 'w', -37, c - 1.2, c + 1.2, 6, 10, 0.06)

// ===========================================================================
// Entrance pavilion: a tall brick block, cresting, the pointed-arch recess
const PV = rect(24, 37.9, -11.2, 7.1)
body(PV, PAV)
// cresting: a row of small merlons along the street face and the sides
for (let k = 0; k < 9; k++) {
  const y = -10.3 + (k * 16.5) / 8
  cbox(trim, rect(37.1, 37.9, y - 0.45, y + 0.45), PAV, PAV + 1.2, { b: 0.25 })
}
// the arch: stone surround, an arabesque spandrel panel, then the recess with
// its window column and the doors
const AC = -2.05 // the pavilion's centre line
panel(trim, 'e', 37.9, AC - 6.0, AC + 6.0, 21.0, 24.2, 0.03)
pointedArch(trim, 37.9, 0.05, AC, 10.6, 1.0, 16.2)
pointedArch(brick, 37.9, 0.08, AC, 8.4, 1.0, 16.2) // reveal, in shade colour
pointedArch(trim, 37.9, 0.11, AC, 7.6, 1.0, 16.2)
panel(win, 'e', 37.9, AC - 1.3, AC + 1.3, 6.5, 18.5, 0.14)
panel(win, 'e', 37.9, AC - 3.0, AC + 3.0, 0.4, 3.6, 0.14)
// marquee
cbox(roof, rect(37.9, 40.2, AC - 4.0, AC + 4.0), 3.8, 4.8, { b: 0.1, bottom: true })

// ---- minarets: tall square shafts standing well clear of the cresting
// (shaft to 35.4, balcony, tiled drum, cupola, finial to the lidar's 39.6)
for (const y of [-9.4, 5.3]) {
  const x = 35.6, h = 2.0
  cbox(brick, rect(x - h, x + h, y - h, y + h), PAV - 2, 35.4, { top: false })
  // cream bands round the shaft, as in the photos
  cbox(trim, rect(x - h - 0.12, x + h + 0.12, y - h - 0.12, y + h + 0.12), 31.4, 31.9, { bottom: true, top: false })
  // balcony cornice
  cbox(trim, rect(x - h - 0.6, x + h + 0.6, y - h - 0.6, y + h + 0.6), 35.4, 36.2, { b: 0.25, bottom: true })
  // tiled octagonal drum
  const oct = (r: number) => Array.from({ length: 8 }, (_, k) => [x + r * Math.cos((k + 0.5) * Math.PI / 4), y + r * Math.sin((k + 0.5) * Math.PI / 4)] as [number, number])
  pslab(tile, oct(1.45), 36.2, 37.3, 0, false)
  pslab(trim, oct(1.65), 37.3, 37.6, 0.1, copper)
  // cupola and finial
  lathe(copper, x, y, [[1.2, 37.6], [1.25, 38.0], [1.0, 38.5], [0.55, 38.9], [0.15, 39.1], [0.1, 39.5], [0.0001, 39.6]], 10)
}

// Floodlit: the Laurel Street front and minarets; nothing on the tops.
const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.05 : p[0] > 23 && n[0] > 0.3 ? 0.9 : p[0] > 30 ? 0.5 : 0)

/** A finish with night floodlighting; dc-nga-west's Mat type omits the field but saveModel passes it through. */
const lit_ = (m: MaterialSpec): Mat => m

if (import.meta.main) {
  await saveModel('ric-altria-theater', 'Altria Theater', [
    { part: brick, material: lit_({ ...finish('altria-sand-brick', 0xd8bf92), floodlight: lit }) },
    { part: trim, material: lit_({ ...finish('altria-stone-trim', 0xf3e6cc), floodlight: lit }) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: copper, material: PALETTE.patina },
    { part: tile, material: finish('altria-blue-tile', 0x6f8fb0) },
  ], { source: 'generators/ric-altria-theater.ts', bearing: 1, osm: 'way/229623395', height: 39.6 }, 6500)
}
