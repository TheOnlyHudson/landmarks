/**
 * Riverplace Tower (Gulf Life Tower until the 1990s), Jacksonville — original
 * procedural geometry, CC0-1.0.
 * bun generators/jax-riverplace-tower.ts
 *
 * Welton Becket and Associates, 1967; 28 storeys, 132 m, then the tallest
 * building in Florida and the tallest post-tensioned precast concrete
 * structure in the world. A square shaft whose identity is its white precast
 * frame: two columns on each face, no column at the corners, and on every
 * floor a white spandrel band that dips toward the corners, so the dark
 * window bands wrap round each corner as a chevron. A deep white crown band
 * caps it over a taller recessed top floor.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 4.25:
 * the OSM outline's edges run 4-4.5° clockwise of north. Origin = centroid
 * of way/348715499.
 *
 * Evidence
 * - OSM way/348715499 (Riverplace Tower, building=office, height 132,
 *   28 levels, wikidata Q7338278): a square 41.3 x 41.5 m in this frame
 *   (x -20.7..20.7, y -20.7..20.8).
 *   Not included: parts way/591669055 and way/591669056, a two-storey
 *   octagonal pavilion with a pyramid roof joined to the north face (no
 *   photo of it here; the map keeps drawing it), and the riverfront shops,
 *   garage and hotel around it.
 * - Published (Wikipedia "Riverplace Tower"; AIA Florida "100 Years,
 *   100 Places"): 28 floors, 132 m (433 ft), completed 1967.
 * - Photos (all daylight, Commons):
 *   · "Riverplace Tower, Jacksonville, FL, US.jpg", Jud McCranie (Bubba73),
 *     CC BY-SA 4.0 (from the north-west riverwalk: the corner chevrons, two
 *     columns a face, the crown),
 *     https://commons.wikimedia.org/wiki/File:Riverplace_Tower,_Jacksonville,_FL,_US.jpg
 *   · "Jacksonville Riverplace Tower and The Peninsula Digon3.jpg", Jonathan
 *     Zander (Digon3), CC BY-SA 3.0 (from the west along the river: glass
 *     wrapping each corner),
 *     https://commons.wikimedia.org/wiki/File:Jacksonville_Riverplace_Tower_and_The_Peninsula_Digon3.jpg
 *   · "RiverPlaceTowerJacksonville-Feb2010-b.JPG", LoneStarMike,
 *     CC BY-SA 3.0 (from across the river, north: whole shaft and crown),
 *     https://commons.wikimedia.org/wiki/File:RiverPlaceTowerJacksonville-Feb2010-b.JPG
 *
 * Measured: plan (OSM). Published: height 132, 28 floors.
 * Estimated from the photos: column width 2.4 m and their centres ±9.0 m
 * from each face's middle; the corner chamfer (2 m, so the window bands
 * read as wrapping the corner); floor-to-floor 4.4 m over a two-storey
 * 8 m base; window band 2.4 m tall dipping 1.3 m at the corners (the photos
 * show the dark bands about as tall as the white spandrels); the top two
 * floors (113.6-122.5 m) a dark glass loggia set 1.3 m back behind the
 * columns, with the crown's soffit dropping in haunches between them; the
 * white crown fascia 9.5 m deep (about two floors, from p1), overhanging
 * 0.9 m.
 * Invented: the base (hidden behind the Riverplace shops and hotel in every
 * photo) is drawn as a glazed two-storey lobby between the columns.
 *
 * Exception to "no per-floor bands": the white precast spandrel on every
 * floor is the building's identity, so each floor keeps its own window band;
 * they are drawn bold (white wider than the glass) rather than as fine lines.
 *
 * Night: window bands `window`, the lobby `entrance`. The crown carries a
 * bank sign today; it is left plain.
 *
 * Doubts: the base and the pavilion to the north are not photographed; the
 * curved heads of the middle-bay windows are drawn as chamfers.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 4.25
const ANCHOR = { lng: -81.65672959, lat: 30.31934122 }

const body = new Part(), win = new Part(), roof = new Part(), cols = new Part(), lobby = new Part()

const H = 20.7 // half-width of the square
const C = 2.0 // corner chamfer
const TOP = 132
const BASE = 8, FLOOR = 4.4, NFLOORS = 24 // floors 3..26 below the two-storey loggia
const LOGGIA0 = BASE + NFLOORS * FLOOR // 113.6: the recessed dark top two floors
const TOP_SHAFT = 122.5 // underside of the deep white crown fascia
const RECESS = 1.3 // how far the loggia glass sits behind the face
const COL_C = 9.0, COL_W = 2.4, COL_D = 0.7

/** The chamfered square, counter-clockwise from above, offset outward by e. */
function ring(e: number, z: number): V3[] {
  const h = H + e, c = C + e * (Math.SQRT2 - 1)
  return [
    [-h + c, -h, z], [h - c, -h, z], [h, -h + c, z], [h, h - c, z],
    [h - c, h, z], [-h + c, h, z], [-h, h - c, z], [-h, -h + c, z],
  ]
}

// Shaft, crown, roof.
body.loft([ring(0, 0), ring(0, LOGGIA0)])
body.cap(ring(0, LOGGIA0), true)
// The loggia: the top two floors, a dark glass band set back behind the columns.
win.loft([ring(-RECESS, LOGGIA0), ring(-RECESS, TOP_SHAFT)])
{
  const o = 0.9, bev = 0.5
  body.loft([ring(o, TOP_SHAFT), ring(o, TOP - bev), ring(o - bev, TOP)])
  body.cap(ring(o, TOP_SHAFT), false)
  // a low parapet ring and the roof inside it
  roof.cap(ring(o - bev, TOP), true)
}

// The four faces in order, each walked counter-clockwise from above: start, direction, outward normal.
type Face = { o: [number, number]; u: [number, number]; n: [number, number] }
const faces: Face[] = [
  { o: [0, -H], u: [1, 0], n: [0, -1] }, // south
  { o: [H, 0], u: [0, 1], n: [1, 0] }, // east
  { o: [0, H], u: [-1, 0], n: [0, 1] }, // north
  { o: [-H, 0], u: [0, -1], n: [-1, 0] }, // west
]
const at = (f: Face, s: number, z: number, out: number): V3 => [f.o[0] + f.u[0] * s + f.n[0] * out, f.o[1] + f.u[1] * s + f.n[1] * out, z]

/** A flat polygon on a face (points as [s, z]), counter-clockwise seen from outside. */
function facePoly(part: Part, f: Face, pts: [number, number][], out = 0.06) {
  const p = pts.map(([s, z]) => at(f, s, z, out))
  for (let i = 1; i < p.length - 1; i++) part.tri(p[0], p[i], p[i + 1])
}

// Columns: two a face, full height of the shaft, bevelled.
for (const f of faces) {
  for (const sc of [-COL_C, COL_C]) {
    const s0 = sc - COL_W / 2, s1 = sc + COL_W / 2
    const r = (z: number, inset: number): V3[] => [at(f, s0 + inset, z, 0), at(f, s1 - inset, z, 0), at(f, s1 - inset, z, COL_D - inset), at(f, s0 + inset, z, COL_D - inset)]
    // ring order must be counter-clockwise from above: check with the face direction
    const rr = (z: number, inset: number) => { const q = r(z, inset); return [q[0], q[1], q[2], q[3]].reverse() as V3[] }
    cols.loft([rr(0, 0), rr(TOP_SHAFT, 0)])
  }
}

// Window bands: middle bay between the columns, corner bays wrapping the corner with a dip.
const S_COL = COL_C + COL_W / 2 + 0.35 // window edge beside a column
const S_END = H - C // where the face meets the chamfer
const DIP = 1.3
function floorBand(z0: number, h: number, dip: number, part: Part) {
  for (let k = 0; k < 4; k++) {
    const f = faces[k], g = faces[(k + 1) % 4]
    // middle bay, top corners chamfered (the curved heads)
    const m = COL_C - COL_W / 2 - 0.35, ch = Math.min(0.6, h / 3)
    facePoly(part, f, [[-m, z0], [m, z0], [m, z0 + h - ch], [m - 1.2, z0 + h], [-m + 1.2, z0 + h], [-m, z0 + h - ch]])
    // corner bay of face f (from its right column to the chamfer), then the chamfer, then face g's left bay
    const zz = (t: number) => [z0 - dip * t, z0 + h - dip * t] as const // t: 0 at the column, 1 at the corner
    const [a0, a1] = zz(0), [b0, b1] = zz(1)
    facePoly(part, f, [[S_COL, a0], [S_END, b0], [S_END, b1], [S_COL, a1]])
    facePoly(part, g, [[-S_END, b0], [-S_COL, a0], [-S_COL, a1], [-S_END, b1]])
    // the chamfer face
    const p = at(f, S_END, 0, 0), q = at(g, -S_END, 0, 0)
    const nx = (q[1] - p[1]), ny = -(q[0] - p[0]), nl = Math.hypot(nx, ny)
    const off = (v: V3, z: number): V3 => [v[0] + nx / nl * 0.06, v[1] + ny / nl * 0.06, z]
    part.quad(off(p, b0), off(q, b0), off(q, b1), off(p, b1))
  }
}
for (let i = 0; i < NFLOORS; i++) floorBand(BASE + i * FLOOR + 1.3, 2.4, DIP, win)
// The crown's soffit drops in curved haunches between the columns over the loggia:
// white fillets in the top corners of each loggia bay, on the recessed glass.
for (const f of faces) {
  const fl = 2.2, z1 = TOP_SHAFT, z0 = TOP_SHAFT - fl, out = -RECESS + 0.06
  const m = COL_C - COL_W / 2
  facePoly(body, f, [[-m, z0], [-m + fl * 1.6, z1], [-m, z1]], out)
  facePoly(body, f, [[m, z0], [m, z1], [m - fl * 1.6, z1]], out)
  const e = COL_C + COL_W / 2
  facePoly(body, f, [[e, z1], [e, z0], [e + fl * 1.6, z1]], out)
  facePoly(body, f, [[-e, z1], [-e - fl * 1.6, z1], [-e, z0]], out)
}
// The lobby: two storeys of glazing between and beside the columns.
floorBand(0.4, BASE - 1.6, 0, lobby)

const parts = [
  { part: body, material: finish('riverplace-precast', 0xf1ede5) },
  { part: cols, material: finish('riverplace-columns', 0xf7f3eb) },
  { part: win, material: { ...PALETTE.window, color: 0x56697b } },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x6e7f8c } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Riverplace Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/348715499'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jax-riverplace-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
