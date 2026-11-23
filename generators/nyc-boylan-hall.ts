/**
 * Boylan Hall, Brooklyn College (Randolph Evans, 1937) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-boylan-hall.ts
 *
 * Map frame: x = east, y = north, z up, metres, built in the building's
 * frame and placed at bearing 351.9 (its walls run 351.9° / 81.9°).
 * Anchor: area centroid of OSM way/249997409 (-73.951652, 40.6318925).
 *
 * IDENTITY NOTE: the assignment describes Boylan Hall "with the white
 * clock tower and cupola". The white clock tower on the campus is on the
 * Library (La Guardia Hall, OSM way/249997410), at the west end of the
 * quadrangle, not on Boylan Hall ("2016 Brooklyn College campus.jpg";
 * Wikipedia "Brooklyn College": Evans's plan was "anchored by a library
 * building with a tower"). Lidar over Boylan Hall shows only hipped roofs
 * and chimneys, no tower. This model is Boylan Hall as it stands.
 *
 * Evidence
 * - OSM: way/249997409 "Boylan Hall", height 26.1 (the tallest ridge).
 * - USGS 3DEP lidar NY_NewYorkCity (2017), 1 m grid, read in this frame
 *   (lidar_frame.py, bearing -8.1). y = 0 is the lowest ground, in the
 *   sunken court north-west of the centre wing (~1.5 m under the street
 *   grade); the streets and the entrance front stand G = 2.5 m higher
 *   (terrain.ts grid; lidar says 1.5, the map's terrain 2.5–2.9, so the
 *   map's value is used for the fronts). Measured above y = 0: the end
 *   wings' eaves 18.5, ridges 23; the main bar's eaves 18.5, ridge 22.5;
 *   the centre block (x -26.6…18.6) eaves 21, ridge 26; the north centre
 *   wing eaves 21.5, ridge 28.5 (OSM's 26.1 is from the street); chimneys
 *   ~3 m over the ridges. The court between the north wings (x 6…42,
 *   y 3…25) is inside the outline but at grade (a paved court), so it is
 *   not drawn.
 * - Published (Wikipedia "Brooklyn College"; the college's history pages,
 *   facts only): Randolph Evans, Georgian Revival, campus opened 1937;
 *   named for the first president, William A. Boylan, in the 1940s.
 * - Photos (Wikimedia Commons):
 *   - "2016 Brooklyn College Boylan Hall.jpg", Beyond My Ken, CC BY-SA 4.0
 *     (the entrance front, square on; scaled at 24 px/m on the 17 m eave)
 *   - "2016 Brooklyn College campus.jpg", Beyond My Ken, CC BY-SA 4.0
 *     (the quadrangle, the Library tower; Boylan's neighbours' roofs)
 *
 * From the photo (heights above the street, G added in the model): red brick with white window frames and cornice; four
 * storeys of windows (centres at 2.5, 6.8, 10.6, 14.6 m), about 1.7 ×
 * 2.4 m, on a 3.3 m pitch; a grey slate hipped roof with white dormers and
 * tall brick chimneys; the entrance: three round arches 3.2 m wide on a
 * 4.4 m pitch, 5.2–12.1 m, an open loggia with white walls; two oculi
 * either side; three yellow doors under it at the top of a flight of steps.
 * Estimated: the entrance is on the south front's projecting centre (the
 * photo's side is not recorded); the other faces repeat the windows with
 * no photo; dormer count and chimney positions.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, type XY } from './nyc-570-lexington'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

type Block = { x0: number; y0: number; x1: number; y1: number; eave: number; ridge: number; dormers?: boolean }
const W_WING: Block = { x0: -70.4, y0: -29.3, x1: -50.5, y1: 27.1, eave: 18.5, ridge: 23, dormers: true }
const E_WING: Block = { x0: 42.2, y0: -29.3, x1: 62.2, y1: 26.7, eave: 18.5, ridge: 23, dormers: true }
const BAR: Block = { x0: -50.5, y0: -17.1, x1: 42.2, y1: 3.0, eave: 18.5, ridge: 22.5, dormers: true }
const CENTRE: Block = { x0: -26.6, y0: -20.4, x1: 18.6, y1: 3.0, eave: 21, ridge: 26 }
const NORTH: Block = { x0: -14.3, y0: 3.0, x1: 6.0, y1: 26.8, eave: 21.5, ridge: 28.5 }
const G = 2.5 // the street grade at the fronts, over the sunken north-west court (y = 0)
const FLOORS = [2.5, 6.8, 10.6, 14.6].map((z) => z + G), WIN_W = 1.7, WIN_H = 2.4, PITCH = 3.3

type At = (s: number, z: number, d?: number) => V3
/** A frame along a wall a→b (counter-clockwise from above), d outward. */
function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at: At = (s, z, d = 0) => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, at }
}
const rect = (p: Part, at: At, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(s0, z0, d), at(s1, z0, d), at(s1, z1, d), at(s0, z1, d))
function arched(p: Part, at: At, c: number, w: number, z0: number, spring: number, d: number) {
  const r = w / 2
  rect(p, at, c - r, c + r, z0, spring, d)
  for (let k = 0; k < 10; k++) {
    const a0 = (Math.PI * k) / 10, a1 = (Math.PI * (k + 1)) / 10
    p.tri(at(c, spring, d), at(c + r * Math.cos(a0), spring + r * Math.sin(a0), d), at(c + r * Math.cos(a1), spring + r * Math.sin(a1), d))
  }
}
const disc = (p: Part, at: At, c: number, z: number, r: number, d: number) => {
  for (let k = 0; k < 12; k++) {
    const a0 = (2 * Math.PI * k) / 12, a1 = (2 * Math.PI * (k + 1)) / 12
    p.tri(at(c, z, d), at(c + r * Math.cos(a0), z + r * Math.sin(a0), d), at(c + r * Math.cos(a1), z + r * Math.sin(a1), d))
  }
}
/** A punched window: white frame, slate panel. */
function windowAt(at: At, c: number, zc: number) {
  rect(trim, at, c - WIN_W / 2 - 0.22, c + WIN_W / 2 + 0.22, zc - WIN_H / 2 - 0.3, zc + WIN_H / 2 + 0.22, 0.04)
  rect(win, at, c - WIN_W / 2, c + WIN_W / 2, zc - WIN_H / 2, zc + WIN_H / 2, 0.08)
}

const BLOCKS = [W_WING, E_WING, BAR, CENTRE, NORTH]
/** Is (x, y, z) inside another block's walls? */
const covered = (self: Block, x: number, y: number, z: number) =>
  BLOCKS.some((b) => b !== self && x > b.x0 - 0.01 && x < b.x1 + 0.01 && y > b.y0 - 0.01 && y < b.y1 + 0.01 && z < b.eave)

/** A hipped roof over a rectangle, overhanging by o. */
function hipRoof(b: Block, o = 0.45) {
  const x0 = b.x0 - o, x1 = b.x1 + o, y0 = b.y0 - o, y1 = b.y1 + o, z0 = b.eave, z1 = b.ridge
  const along = x1 - x0 >= y1 - y0
  const h = Math.min(x1 - x0, y1 - y0) / 2
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  if (along) {
    const P: V3 = [x0 + h, (y0 + y1) / 2, z1], Q: V3 = [x1 - h, (y0 + y1) / 2, z1]
    roof.quad(A, B, Q, P); roof.quad(C, D, P, Q); roof.tri(B, C, Q); roof.tri(D, A, P)
  } else {
    const P: V3 = [(x0 + x1) / 2, y0 + h, z1], Q: V3 = [(x0 + x1) / 2, y1 - h, z1]
    roof.quad(B, C, Q, P); roof.quad(D, A, P, Q); roof.tri(A, B, P); roof.tri(C, D, Q)
  }
  // Soffit, so the overhang isn't see-through from below.
  capPoly(trim, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0 - 0.02, false)
  return { along, h, x0, x1, y0, y1 }
}

/** A gabled dormer on a roof slope: front at distance `inset` in from the eave line, facing n. */
function dormer(cx: number, cy: number, n: XY, b: Block, slope: number) {
  const w = 2.5, hFront = 2.6, depth = 3.0, inset = 0.8
  const t: XY = [n[1], -n[0]]
  const f = (s: number, d: number, z: number): V3 => [cx + t[0] * s - n[0] * d, cy + t[1] * s - n[1] * d, z]
  const zb = b.eave + inset * slope - 0.1, zt = zb + hFront, zg = zt + 0.8
  // Front face (trim) with its window, cheeks, and a little gable roof.
  trim.quad(f(w / 2, inset, zb), f(-w / 2, inset, zb), f(-w / 2, inset, zt), f(w / 2, inset, zt))
  trim.tri(f(w / 2, inset, zt), f(-w / 2, inset, zt), f(0, inset, zg))
  win.quad(f(0.75, inset - 0.05, zb + 0.35), f(-0.75, inset - 0.05, zb + 0.35), f(-0.75, inset - 0.05, zt - 0.3), f(0.75, inset - 0.05, zt - 0.3))
  trim.quad(f(-w / 2, inset, zb), f(-w / 2, inset + depth, zb + depth * slope), f(-w / 2, inset + depth, zt), f(-w / 2, inset, zt))
  trim.quad(f(w / 2, inset + depth, zb + depth * slope), f(w / 2, inset, zb), f(w / 2, inset, zt), f(w / 2, inset + depth, zt))
  roof.quad(f(0, inset - 0.2, zg), f(-w / 2 - 0.15, inset - 0.2, zt - 0.1), f(-w / 2 - 0.15, inset + depth, zt - 0.1), f(0, inset + depth, zg))
  roof.quad(f(w / 2 + 0.15, inset - 0.2, zt - 0.1), f(0, inset - 0.2, zg), f(0, inset + depth, zg), f(w / 2 + 0.15, inset + depth, zt - 0.1))
}

for (const b of BLOCKS) {
  const ring: XY[] = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]]
  prism({ wall: brick, win: null, roof: null, ring, z0: 0, z1: b.eave, facade: null, bevel: 0.3 })
  const r = hipRoof(b)
  for (let i = 0; i < 4; i++) {
    const a = ring[i], c = ring[(i + 1) % 4]
    const { L, at } = along(a, c)
    // White cornice band under the eave.
    rect(trim, at, 0.3, L - 0.3, b.eave - 0.45, b.eave, 0.12)
    // Windows on every exposed bay.
    const n = Math.floor((L - 2) / PITCH), off = (L - n * PITCH) / 2
    for (let k = 0; k < n; k++) {
      const s = off + PITCH * (k + 0.5)
      for (const z of FLOORS) {
        if (z + WIN_H / 2 > b.eave - 0.2) continue
        const p = at(s, z, 0.6)
        if (covered(b, p[0], p[1], z)) continue
        if (b === CENTRE && i === 0 && Math.abs(s - L / 2) < (z < G + 4 ? 6.8 : z < G + 13 ? 9.6 : 0)) continue
        windowAt(at, s, z)
      }
    }
  }
  if (b.dormers) {
    const slope = (b.ridge - b.eave) / r.h
    if (r.along) {
      for (let x = r.x0 + r.h + 1.5; x < r.x1 - r.h - 1.5; x += 7.4) {
        if (!covered(b, x, b.y0 - 1, b.eave - 1)) dormer(x, b.y0, [0, -1], b, slope)
        if (!covered(b, x, b.y1 + 1, b.eave - 1)) dormer(x, b.y1, [0, 1], b, slope)
      }
    } else {
      for (let y = r.y0 + r.h + 1.5; y < r.y1 - r.h - 1.5; y += 7.4) {
        if (!covered(b, b.x0 - 1, y, b.eave - 1)) dormer(b.x0, y, [-1, 0], b, slope)
        if (!covered(b, b.x1 + 1, y, b.eave - 1)) dormer(b.x1, y, [1, 0], b, slope)
      }
    }
  }
}
// The court between the north wings (x 6…42, y 3…25) is inside the OSM
// outline but lidar and terrain show it at grade: a paved court, not drawn.

// Chimneys: tall brick stacks along the ridges (photo: four over the front).
const stack = (x: number, y: number, top: number) =>
  prism({ wall: brick, win: null, roof: brick, ring: [[x - 0.9, y - 0.6], [x + 0.9, y - 0.6], [x + 0.9, y + 0.6], [x - 0.9, y + 0.6]], z0: top - 5, z1: top, facade: null, bevel: 0.1 })
for (const x of [-42, -31, 23, 34]) stack(x, -7.0, 25.1)
for (const [x, y] of [[-60.4, -14], [-60.4, 12], [52.2, -14], [52.2, 12]] as XY[]) stack(x, y, 25.5)

// ---------------------------------------------------------------------------
// The entrance: the open three-arched loggia, oculi, yellow doors, steps.
// ---------------------------------------------------------------------------
{
  const { L, at: at0 } = along([CENTRE.x0, CENTRE.y0], [CENTRE.x1, CENTRE.y0])
  const at: At = (s, z, d = 0) => at0(s, z + G, d)
  const c = L / 2, P = 4.4, R = 1.6, SPRING = 12.1 - R
  // Brick quoin strips framing the loggia.
  for (const sg of [-1, 1]) rect(trim, at0, c + sg * 10.6 - 0.5, c + sg * 10.6 + 0.5, 0, CENTRE.eave - 0.45, 0.06)
  for (const k of [-1, 0, 1]) {
    const x = c + k * P
    arched(trim, at, x, 2 * R, 5.2, SPRING, 0.08)
    rect(win, at, x - 0.7, x + 0.7, 8.3, 10.0, 0.11) // window at the back of the loggia
    rect(win, at, x - 0.75, x + 0.75, 5.3, 7.6, 0.11) // the balcony door
    rect(trim, at0, x - 1.4, x + 1.4, 0, G + 4.0, 0.06) // stone door surround
    rect(door, at, x - 1.0, x + 1.0, 1.0, 3.6, 0.1)
  }
  rect(trim, at, c - 7.0, c + 7.0, 4.4, 5.2, 0.1) // balcony band with the name
  for (const sg of [-1, 1]) {
    disc(trim, at, c + sg * 7.9, 10.6, 0.9, 0.06)
    disc(win, at, c + sg * 7.9, 10.6, 0.62, 0.1)
  }
  // Steps up to the doors (about 1 m, six risers), drawn as three treads.
  for (let k = 0; k < 3; k++) {
    const d = 4.2 - k * 1.3, w = 8.5 - k * 0.6
    const ring: XY[] = [at(c - w, 0)[0], at(c + w, 0)[0], at(c + w, 0, d)[0], at(c - w, 0, d)[0]].map((_, j) => {
      const p = [at(c - w, 0, 0), at(c + w, 0, 0), at(c + w, 0, d), at(c - w, 0, d)][j]
      return [p[0], p[1]] as XY
    })
    prism({ wall: trim, win: null, roof: trim, ring, z0: 0, z1: G + 0.35 * (k + 1), facade: null, bevel: 0 })
  }
}

finishModel('Boylan Hall', 'nyc-boylan-hall', [
  { part: brick, material: finish('boylan-brick', 0xac6252) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('boylan-slate', 0x8f979e) },
  { part: win, material: PALETTE.window },
  { part: door, material: { name: 'entrance', color: 0xe2b443, roughness: 0.6 } },
], { bearing: 351.9, osm: 'way/249997409', height: 27 })
