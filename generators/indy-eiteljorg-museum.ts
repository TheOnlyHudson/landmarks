/**
 * Eiteljorg Museum of American Indians and Western Art (1989, Jonathan
 * Hess; north wing 2005), 500 West Washington Street, White River State
 * Park, Indianapolis: procedural, CC0-1.0.
 * bun generators/indy-eiteljorg-museum.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres. The origin is the area centroid
 * of the OSM outline way/113050097 (-86.1677607, 39.7685157); the plan is
 * turned 2.5 degrees anticlockwise (the outline's walls run at 357.5..359),
 * placed at bearing 357.5. y = 0 is the low ground by the east and west
 * walls (214.0 m NAVD88); the lawn and plaza on the south side are about
 * 2.5..4.6 m higher (the map terrain 4.0..4.9), so the south front's doors start at G = 4.3.
 *
 * Identity (from the photos below):
 *  1. A blocky, nearly windowless mass of ochre sandstone-coloured
 *     masonry in horizontal courses, stepped in plan, with a single square
 *     window high on the south front.                             (S)
 *  2. The round red-sandstone drum (a kiva-like rotunda) on the lawn in
 *     front, with three small square windows and a dark flat cap.    (S)
 *  3. The long timber pergola on round posts at the west end of the south
 *     front, over red sandstone walls and steps.                     (S)
 *  4. The low east block of the front carrying the "Eiteljorg Museum"
 *     letters, on a red stone base; the recessed dark entrance between.
 *  5. The lower north wing with its half-round gallery.  (NAIP, lidar)
 *
 * Sources
 * - OSM (ODbL): way/113050097 (building=civic, "Eiteljorg Museum"); no
 *   heights, no parts.
 * - USGS 3DEP lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown 2016),
 *   1 m grid read in this frame (ground_min 212.0; model z = lidar - 2.0).
 *   Measured: the main block 18.2..18.5 with rims to 19.3; the skylight over
 *   x -9..0, y -26..-17 at 21.2..22.0; the north wing 12.1..12.3, its
 *   half-round gallery 13.3..13.9, its north-west corner 10.6 and a small
 *   block at x -16..-10, y 36..41 to 14.8; the east terrace block 6.6; the
 *   raised block at x 18..25, y 8..13 to 19.5; the pergola 11.1..11.3; the
 *   east entrance block 12.2..12.8; the drum 10.2..11.4 (ground there 6.6).
 * - USGS NAIP orthophoto (public domain): the plan, the pergola strip, the
 *   drum's position south of the outline, the half-round gallery, the dark
 *   skylight.
 * - Photos (Wikimedia Commons):
 *   "Indianapolis, eiteljorg museum, esterno 00 - cropped.jpg" (Sailko,
 *   CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Indianapolis,_eiteljorg_museum,_esterno_00_-_cropped.jpg),
 *   the south front: the drum, the pergola, the stepped mass, the sign block;
 *   "Eiteljorg Museum of American Indians and Western Art 2024 jeh.jpg"
 *   (Jim.henderson, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Eiteljorg_Museum_of_American_Indians_and_Western_Art_2024_jeh.jpg),
 *   the south front from the south-west.
 *
 * Estimated: the drum (r 5.2), the pergola's posts and beam depth, the
 *   entrance recess, the window, the red base height, from the photos.
 * Doubts: the north, east and west walls are unphotographed and drawn
 *   plain; the north wing's half-round gallery is taken from the aerial
 *   only. The curved retaining wall west of the building and the sunken
 *   garden are left out (ground, not building). The drum and the pergola
 *   stand just outside the OSM outline, as on the aerial.
 * Left out: the courses in the masonry, the lettering, the sculpture, the
 *   copper scuppers.
 * Night: the entrance glows; the stone is softly floodlit on the front.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, ccw, flatShape, arc, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './indy-world-war-memorial'

const G = 4.3
const ochre = new Part(), red = new Part(), timber = new Part(), win = new Part(), roof = new Part(), glass = new Part()

/** A block over a polygon, ochre walls, roof top, with a short red base. */
function mass(r: XY[], h: number, base = 0) {
  const p = ccw(r)
  prism(ochre, roof, p, 0, h, 1)
  if (base > 0) {
    const big = p.map(([x, y]) => [x, y] as XY)
    // the red sandstone base: a band 0.04 m proud of the south walls
    for (let i = 0; i < big.length; i++) {
      const a = big[i], b = big[(i + 1) % big.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 0.5) continue
      const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
      if (n[1] > -0.7) continue // the red base shows on the south front only
      flatShape(red, { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], n }, rect(-L / 2, 0, L / 2, base), 0.04)
    }
  }
}

// ---------------------------------------------------------------- the masses
// main block: the south half of the outline
mass([[-27.4, -44.1], [-4.2, -43.3], [-4.2, -44.3], [23.6, -44.3], [23.5, -28.4], [17.9, -28.4], [17.9, 10.0], [-11.1, 10.0], [-29.9, 11.3], [-28.6, -22.6], [-27.7, -22.6], [-27.7, -32.6]], 16.4, G + 1.0)
// its higher west and south rims, and the stepped west slab, a little lower
prism(ochre, roof, ccw(rect(-27.7, -44.1, -20.5, 11.0)), 16.4, 17.3, 1)
prism(ochre, roof, ccw(rect(-9.0, -44.3, 9.5, -42.6)), 16.4, 17.3, 1)
// the west bump
mass([[-32.8, -32.0], [-27.7, -32.6], [-27.7, -22.6], [-32.8, -22.4]], 8.5, 2.0)
// the east terrace block and the raised block beside it
mass([[17.9, -28.4], [23.5, -28.4], [23.2, -8.2], [17.9, -8.2]], 4.6, 1.0)
mass([[17.9, 8.1], [24.8, 8.2], [24.9, 13.0], [17.9, 13.0]], 17.5)
// the skylight over the main galleries
box(glass, glass, -9.0, -26.0, 0.0, -17.0, 16.4, 19.9)
prism(ochre, ochre, ccw(rect(-9.3, -26.3, 0.3, -16.7)), 16.4, 17.2, 1)
// the north wing
mass([[-11.1, 10.0], [17.9, 10.0], [17.9, 13.0], [24.9, 13.0], [25.4, 33.0], [-11.0, 33.0]], 4.6)
mass([[-11.0, 13.0], [8.0, 13.0], [8.0, 33.0], [-11.0, 33.0]], 10.2)
mass([[-11.0, 33.0], [25.4, 33.0], [26.0, 52.3], [-3.4, 52.9], [-3.1, 55.1], [-9.6, 55.0], [-9.8, 41.4], [-15.6, 40.9], [-16.4, 35.8], [-10.5, 35.5]], 10.2)
box(ochre, roof, -16.4, 35.8, -10.0, 41.0, 0, 12.8)
// the half-round gallery on the north wing, bulging west
{
  const ring: XY[] = arc(12.0, 23.0, 9.5, 90, 270, 10)
  prism(ochre, roof, ccw(ring), 0, 11.4, 35)
}

// ---------------------------------------------------------------- the south front
{
  const S: Face = { o: [0, -44.3, 0], n: [0, -1] } // s = x
  // the recessed dark entrance, west of the sign block
  flatShape(win, S, rect(-3.8, G, 0.0, G + 3.6), 0.05)
  flatShape(timber, S, rect(-4.3, G + 3.6, 0.5, G + 4.2), 0.05)
  // the one square window, high on the front
  flatShape(win, S, rect(1.4, G + 8.8, 3.2, G + 10.6), 0.05)
  // the low sign block in front of the east half, on a red stone base
  box(ochre, roof, 0.2, -47.5, 23.6, -44.3, 0, 10.6)
  const fS: Face = { o: [0, -47.5, 0], n: [0, -1] }
  flatShape(red, fS, rect(0.3, 0, 23.5, G + 0.9), 0.04)
  flatShape(timber, fS, rect(5.0, G + 3.0, 18.0, G + 3.6), 0.05) // the letters, as a dark band
  prism(ochre, null, ccw(rect(0.0, -47.7, 23.8, -44.3)), 10.0, 10.6, 1)
}

// ---------------------------------------------------------------- the drum on the lawn
{
  const cx = -19.5, cy = -54.5, r = 5.2, top = 8.8
  lathe(red, cx, cy, [[r, 0], [r, top - 0.5]], 16)
  lathe(timber, cx, cy, [[r + 0.25, top - 0.5], [r + 0.25, top], [0.01, top]], 16)
  for (const a of [-60, -90, -120]) {
    const t = (a * Math.PI) / 180
    const f: Face = { o: [cx + r * Math.cos(t), cy + r * Math.sin(t), 0], n: [Math.cos(t), Math.sin(t)] }
    flatShape(win, f, rect(-0.4, top - 2.4, 0.4, top - 1.6), 0.06)
  }
}

// ---------------------------------------------------------------- the pergola at the west end of the front
{
  const y0 = -46.2, y1 = -41.0, z = G - 0.5 + 6.3 // the walk under it is a little below the front
  for (let x = -38.0; x <= -13.0; x += 5.0) {
    lathe(timber, x, y0 + 0.6, [[0.55, 0], [0.5, z - 0.9], [0.75, z - 0.6], [0.01, z - 0.6]], 8)
    lathe(red, x, y0 + 0.6, [[0.9, 0], [0.9, G + 0.4], [0.01, G + 0.4]], 8)
  }
  // the beam over the posts and the slatted roof drawn as a slab
  box(timber, timber, -39.0, y0, -12.0, y0 + 1.1, z - 0.6, z)
  box(timber, timber, -39.0, y0 + 1.1, -12.0, y1, z - 0.35, z - 0.1)
  // the red sandstone wall and steps under it
  box(red, red, -40.0, y1 - 0.2, -11.5, y1 + 0.6, 0, G + 0.5)
}

const frontLit = (p: V3, n: V3) => (n[1] < -0.6 && p[2] < 18 ? 0.45 : 0)
const ochreM = { ...finish('indy-eit-sandstone', 0xdcbf93), floodlight: frontLit }
const built = finishGlb('Eiteljorg Museum', [
  { part: ochre, material: ochreM },
  { part: red, material: finish('indy-eit-red-sandstone', 0xa8614f) },
  { part: timber, material: finish('indy-eit-timber', 0x6e5a4a) },
  { part: win, material: finish('entrance', 0x5d5550) },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.glass },
], { bearing: 357.5, height: 19.9, replaces: ['way/113050097'] }, 5000)
await writeModel('indy-eiteljorg-museum', built)
