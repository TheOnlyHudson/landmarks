/**
 * U.S. Steel Tower, Pittsburgh (Harrison & Abramovitz & Abbe, 1970)
 * — original procedural geometry, CC0-1.0.
 * bun generators/pit-us-steel-tower.ts
 *
 * Map frame turned to the building: +y along bearing 357.6 (square to the
 * flat north face on Seventh Avenue), +x along 87.6, z up, metres. BEARING
 * 357.6: the OSM north edge runs at 267.7°, the two long edges at 147.0° and
 * 26.8°, 60° apart. Origin = centroid of the OSM outline way/448319709,
 * 40.441358, -79.994744 (the incentre of the triangle).
 *
 * Identity, in order: the equilateral triangle in plan with its three corners
 * cut by shallow concave notches; the exposed weathering-steel (Cor-Ten)
 * columns standing outside the walls, six to a face; the near-black,
 * faintly rust-brown steel of the whole tower, the columns bold continuous
 * verticals with dark glass strips between them; the flat top with no crown, the columns running to the parapet;
 * the columns carrying down past a recessed glass lobby.
 *
 * Evidence
 * - OSM way/448319709 (height 256.34, 64 levels, building:material
 *   weathering_steel, building:colour #312421), wikidata Q632329. No
 *   building:parts.
 * - USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019), 1 m grid read in this
 *   frame (SCRATCH/work/pit-us-steel-tower/lidar.json): the roof is flat at
 *   257.3 m above the lowest ground under the footprint (published 256.3).
 *   The plan is an equilateral triangle with a flat north face at y ≈ 29 and
 *   its tip (extended) at y ≈ -62, i.e. side ≈ 105 m; each corner is cut by
 *   two faces square to the adjoining main faces, meeting in a concave V on
 *   the bisector: ≈ 9 m each at all three corners (from the 1 m mask). The
 *   lidar outline sits ≈ 1.5 m larger all round than OSM's (it catches the
 *   column faces); the model uses side 103 m, centred on the OSM centroid.
 * - Ground (lidar and Mapterhorn): Grant Street on the west at the lowest,
 *   the plaza on the east side ≈ 6 m higher. Elevation 0.
 * - Published: 841 ft (256.3 m), 64 floors, 18 exterior columns filled with
 *   liquid for fire protection, triangular plan with indented corners
 *   (Wikipedia "U.S. Steel Tower"; CTBUH).
 * - Photos (Wikimedia Commons):
 *   "U. S. Steel Tower, 2015-06-20. 01.jpg" (Cbaile19, CC0) — two faces and a
 *   notch, the column rhythm and the steel grid, from the south-west;
 *   "U. S. Steel Tower from Duquesne University, 2023-05-04, 01.jpg"
 *   (Cbaile19, CC0) — a whole face square on from the south-east, the flat top;
 *   "Downtown Pittsburgh (US Steel Tower from Mellon Square).JPG" (Alekjds,
 *   CC BY-SA 3.0) — the rust colour in sun, the notched corner from below;
 *   "Pittsburgh-pennsylvania-usx-tower.jpg" (Derek Jensen, public domain) —
 *   the column lines from base to top, the corner notch;
 *   "U.S. Steel Tower in Detail.jpg" (Richard Stephen Haynes, CC BY-SA 4.0) —
 *   the boxed three-storey grid of the facade;
 *   "U. S. Steel Tower, 2025-04-23.jpg" (Cbaile19, public domain) — from
 *   Grant Street, the full height with the plaza. USGS NAIP not needed (lidar
 *   gives the plan). No commercial imagery.
 *
 * Estimated: the column section (1.8 m wide, 2 m proud, bevelled; drawn a little
 * bolder than the real ones so they read at phone size; the corner columns
 * 2.6 m wide and 2.8 m proud, standing at the notch edges) and their spacing
 * (six evenly per face); the glass drawn as continuous vertical strips
 * between the columns, split by one steel mullion per bay and broken every
 * three storeys by a thin (1.3 m) steel spandrel (photos p1, p4, p5); the
 * glass a dark blue-grey a step lighter than the steel so the columns read;
 * the top two storeys and parapet (8.5 m) left solid steel, the darker band
 * of the sign and louvred plant zone in p1 and p2; the lobby (9 m tall,
 * glass set 2.5 m behind the columns); the steel colour, near-black with a
 * faint rust-brown cast in every photo, drawn at charcoal (#4d4642).
 * Review round 2: the notch is drawn 16.5 m back from each cut-away tip. A
 * re-read of the lidar along each face from the tip (r2/notch.py) finds the
 * mask starting 16-18 m from every tip (bisector apex 18-19 m in), so the
 * notches already matched to within the 1 m grid; the corner columns were
 * made bigger so the notch reads as a break between three planes.
 * Left out: the UPMC signs at the top of two faces (lit white at night), the
 * plaza and its sculpture, the fine window grid.

 * Night: office windows are `window`; the lobby glass is `entrance`.
 *
 * Doubts: the notch depth is read from a 1 m grid; the north notches look a
 * metre deeper than the south one in lidar and are drawn equal (the tower is
 * symmetric in every photo).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, panel, save, walls, type XY } from './chi-aon-center'

const ID = 'pit-us-steel-tower'
const ANCHOR: [number, number] = [40.441358, -79.994744]
const BEARING = 357.6

const L = 103 // side of the full triangle
const R = L / Math.sqrt(3) // circumradius
const S = 16.5 // notch: the main face stops this far short of the (cut-away) tip
const H = 256.3 // parapet
const LOBBY = 9
const BAND = 8.5 // top two storeys + parapet: solid steel band

const add = (a: XY, b: XY, k = 1): XY => [a[0] + b[0] * k, a[1] + b[1] * k]
const unit = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }
const v = (p: XY, z: number): V3 => [p[0], p[1], z]

/** The notched triangle, counter-clockwise, offset outward by `o`. */
function plan(o = 0): XY[] {
  const tips: XY[] = [30, 150, 270].map(a => [R * Math.cos(a * Math.PI / 180), R * Math.sin(a * Math.PI / 180)])
  const ring: XY[] = []
  for (let k = 0; k < 3; k++) {
    const T = tips[k], P = tips[(k + 2) % 3], N = tips[(k + 1) % 3]
    const tl = Math.hypot(T[0], T[1])
    ring.push(add(T, unit(T, P), S), [T[0] - T[0] / tl * S / Math.cos(Math.PI / 6), T[1] - T[1] / tl * S / Math.cos(Math.PI / 6)], add(T, unit(T, N), S))
  }
  return o ? inset(ring, -o) : ring
}

/** A box column standing out of the wall a→b at s along it. */
function column(p: Part, a: XY, b: XY, s: number, w: number, d: number, z0: number, z1: number) {
  const u = unit(a, b), n: XY = [u[1], -u[0]]
  const q = (t: number, o: number): XY => add(add(a, u, t), n, o)
  const c = 0.4
  const r: XY[] = [q(s - w / 2, -0.2), q(s + w / 2, -0.2), q(s + w / 2, d - c), q(s + w / 2 - c, d), q(s - w / 2 + c, d), q(s - w / 2, d - c)]
  // ring order must be counter-clockwise from above
  const ar = r.reduce((acc, p0, i) => { const e = r[(i + 1) % r.length]; return acc + p0[0] * e[1] - e[0] * p0[1] }, 0)
  const ccw = ar > 0 ? r : [...r].reverse()
  walls(p, ccw, z0, z1)
  cap(p, ccw, z1)
}

function build() {
  const steel = new Part(), cols = new Part(), win = new Part(), notch = win, roof = new Part(), lobby = new Part()
  const ring = plan()
  const n = ring.length

  // --- Lobby: glass set back behind the columns, then the tower above. ---
  const inner = inset(ring, 2.5)
  walls(lobby, inner, 0, LOBBY)
  // soffit over the lobby
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    steel.quad(v(ring[i], LOBBY), v(inner[i], LOBBY), v(inner[j], LOBBY), v(ring[j], LOBBY))
  }

  // --- Shaft with a bevelled parapet. ---
  const top = inset(ring, 0.5)
  walls(steel, ring, LOBBY, H - 0.5)
  walls(steel, ring, H - 0.5, H, top)
  const deck = inset(ring, 1.4)
  walls(steel, top, H, H, deck)
  walls(steel, [...deck].reverse(), H - 1.2, H) // parapet inner wall (faces in)
  cap(roof, deck, H - 1.2)

  // --- Windows: one continuous dark glass strip per column bay, broken every
  // three storeys by a thin steel spandrel; the top two storeys (the sign
  // zone, louvred plant floors) stay solid steel, a darker band. ---
  const z0 = LOBBY + 1.2, zTop = H - BAND, ROWS = 20
  const rowH = (zTop - z0) / ROWS
  const SPAN = 1.3 // thin spandrel between three-storey groups
  const colW = 1.8, colD = 2.0
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n], len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const main = len > 30
    // six columns per main face, the outer two at the notch corners
    const cs = main ? Array.from({ length: 6 }, (_, k) => colW / 2 + 0.3 + k * (len - colW - 0.6) / 5) : []
    cs.forEach((s, k) => { const edge = k === 0 || k === 5; column(cols, a, b, edge ? (k ? len - 1.5 : 1.5) : s, edge ? 2.6 : colW, edge ? 2.8 : colD, 0, H - 0.3) })
    const strips: [number, number][] = main
      ? Array.from({ length: 5 }, (_, k) => {
        const s0 = (k === 0 ? 2.8 : cs[k] + colW / 2) + 0.5, s1 = (k === 4 ? len - 2.8 : cs[k + 1] - colW / 2) - 0.5, m = (s0 + s1) / 2
        return [[s0, m - 0.4], [m + 0.4, s1]] as [number, number][] // a steel mullion splits each bay
      }).flat()
      : [[0.6, len - 0.6]]
    for (const [s0, s1] of strips)
      for (let r = 0; r < ROWS; r++) {
        const za = z0 + r * rowH + (r ? SPAN / 2 : 0), zb = z0 + (r + 1) * rowH - SPAN / 2
        panel(main ? win : notch, a, b, s0, s1, za, zb)
      }
  }

  return [
    { part: steel, material: finish('uss-corten', 0x4a4340, 0.9) },
    { part: cols, material: finish('uss-column', 0x4d4642, 0.8) },
    { part: win, material: windowVariant(2, 0x4a5159) },
    { part: roof, material: PALETTE.roof },
    { part: lobby, material: { ...PALETTE.entrance, color: 0x6f7a83 } },
  ]
}

if (import.meta.main) await save(ID, 'U.S. Steel Tower', ANCHOR, BEARING, build(), 5000)
