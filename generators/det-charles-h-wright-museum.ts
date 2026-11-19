/**
 * Charles H. Wright Museum of African American History (315 East Warren
 * Avenue; 1997, Sims-Varner & Associates): procedural, CC0-1.0.
 * bun generators/det-charles-h-wright-museum.ts
 *
 * Map frame: x, y, z up, metres, turned to the museum's box: +y runs along
 * bearing 64 (east-north-east), +x along 154. The anchor is the centroid of
 * the OSM outline way/68957303: 42.3591328, -83.0609065.
 *
 * Identity, in order: the glazed dome, ribbed, on a rotunda of stepped
 * round tiers wrapped in ribbon windows and banded round columns; the tall
 * entrance frame on the rotunda's axis, with its crossed bars and the
 * African mask over the doors; the long buff, horizontally banded stone box
 * behind; the low fan-shaped wing on the east.
 *
 * Evidence:
 *  - plan: OSM way/68957303 (building=yes, Q5078673 on the museum). The
 *    rotunda's arc fits a circle centred (11.6, -13.0), radius 24.0; the
 *    fan wing is the annulus to r = 40 between -19 and 36 degrees.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame; heights over the lowest ground (the sunken forecourt, 1.3 m
 *    over the box minimum). Measured: the box 14.8, its penthouse 18.7; the
 *    rotunda tiers 8.7 (r 24), 12.2 (r 18), 15.5 (r 15); the dome's crown
 *    22.8 (most glass returns are missing, so its profile is estimated
 *    through the few hits at 20.8-22.8); the fan wing 8.7.
 *  - NAIP (USGS, public domain): the dome's radial ribbing, the entrance
 *    bridge on the rotunda's south-west, the plan.
 *  - photos (all EVIDENCE):
 *    - Charles H. Wright Museum 2011 5.JPG, Michael Barera, CC BY-SA 4.0
 *      (the entrance square on: frame, mask, columns, tiers, dome).
 *      https://commons.wikimedia.org/wiki/File:Charles_H._Wright_Museum_2011_5.JPG
 *    - Charles H. Wright Museum 2011 1.JPG, Michael Barera, CC BY-SA 4.0
 *      (rotunda and box from the west).
 *      https://commons.wikimedia.org/wiki/File:Charles_H._Wright_Museum_2011_1.JPG
 *    - Charles Wright African-American Museum.jpg, Quick fix (flickr),
 *      CC BY-SA 2.0 (entrance from the forecourt).
 *      https://commons.wikimedia.org/wiki/File:Charles_Wright_African-American_Museum.jpg
 *    - Museum of African American History.jpg, CC BY-SA 2.5 (the long box
 *      from the north-west).
 *      https://commons.wikimedia.org/wiki/File:Museum_of_African_American_History.jpg
 *  - published: opened 1997; the rotunda's dome about 65 ft (20 m) across
 *    inside (Wikipedia, "Charles H. Wright Museum of African American
 *    History").
 *  Estimated: the entrance frame (8 m wide, to 18.5), the columns, the
 *  window bands, the dome's rib count (16), the mask's size.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the entrance axis is set from the aerial (238 degrees in this
 * frame's plan, towards the forecourt bridge); the box's north and east
 * faces are not photographed here and carry only the ground window band.
 * The dome is opaque `glass`, as the brief asks. Elevation 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, walls, type XY } from './chi-aon-center'
import { arc, lathe, disc } from './sea-tacoma-union-station'
import { bbox, box, face, panels, spread, saveModel, type Mat } from './det-detroit-institute-of-arts'

const C: XY = [11.6, -13.0] // the rotunda's centre
const A = (238 * Math.PI) / 180 // the entrance axis
const P = (r: number, a: number, z: number): V3 => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z]

/** A band of panels on a cylinder of radius r, from z0 to z1, between angles, `n` panels with gaps. */
function ring(p: Part, r: number, z0: number, z1: number, a0: number, a1: number, n: number, fill = 0.8) {
  const da = (a1 - a0) / n
  for (let i = 0; i < n; i++) {
    const s = a0 + i * da + (da * (1 - fill)) / 2, e = s + da * fill
    face(p, [P(r, s, z0), P(r, e, z0), P(r, e, z1), P(r, s, z1)], [Math.cos((s + e) / 2), Math.sin((s + e) / 2), 0])
  }
}
/** A cylinder about C from z0 to z1 with a flat top. */
function drum(p: Part, top: Part, r: number, z0: number, z1: number, segs = 32) {
  lathe(p, C[0], C[1], [[r, z0], [r, z1]], segs)
  disc(top, C[0], C[1], r, z1, segs)
}
/** A banded round column: a stack of short drums, alternately thick and thin. */
function banded(p: Part, x: number, y: number, r: number, z0: number, z1: number) {
  const n = Math.max(3, Math.round((z1 - z0) / 1.2)), h = (z1 - z0) / n
  const prof: [number, number][] = []
  for (let i = 0; i < n; i++) prof.push([r, z0 + i * h], [r, z0 + i * h + h * 0.75], [r * 0.82, z0 + i * h + h * 0.88])
  prof.push([r, z1], [0.001, z1])
  lathe(p, x, y, prof, 6)
}

function build(): Mat[] {
  const stone = new Part(), win = new Part(), glass = new Part(), trim = new Part(), bronze = new Part(), band = new Part()

  // ---------------------------------------------------------------- the box and its penthouse
  bbox(stone, stone, -42.2, -20.2, 18.9, 33.6, 0, 14.8, 0.3)
  bbox(stone, stone, -20, 0, 2, 17, 14.8, 18.7, 0.25)
  // the stone's horizontal banding, drawn as broad darker courses
  for (let zb = 1.6; zb < 14; zb += 2.4) bbox(band, null, -42.3, -20.3, 19.0, 33.7, zb, zb + 0.6, 0.05)
  // the ground window band on the north and east (the forecourt faces are banded stone only)
  panels(win, 'n', 33.7, spread(-40, 17, 6), 7.0, 0.1, 1.5, 0.06)
  panels(win, 'e', 19.0, spread(12, 32, 2), 7.0, 0.1, 1.5, 0.06)

  // ---------------------------------------------------------------- the fan wing
  {
    const a0 = (-19 * Math.PI) / 180, a1 = (36 * Math.PI) / 180, n = 8
    const outer: XY[] = [], inner: XY[] = []
    for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; outer.push([C[0] + 39.6 * Math.cos(a), C[1] + 39.6 * Math.sin(a)]); inner.push([C[0] + 22 * Math.cos(a), C[1] + 22 * Math.sin(a)]) }
    const poly = [...outer, ...inner.reverse()]
    walls(stone, poly, 0, 8.7); cap(stone, poly, 8.7)
    ring(win, 39.65, 1.0, 3.8, a0, a1, 6, 0.85)
    ring(win, 39.65, 5.2, 7.4, a0, a1, 6, 0.85)
  }

  // ---------------------------------------------------------------- the rotunda's tiers
  drum(stone, stone, 24.0, 0, 8.7)
  drum(stone, stone, 18.2, 8.7, 12.2)
  drum(stone, stone, 15.4, 12.2, 15.5)
  // a cornice lip on each tier
  for (const [r, zt] of [[24.0, 8.7], [18.2, 12.2], [15.4, 15.5]]) lathe(trim, C[0], C[1], [[r + 0.35, zt - 0.6], [r + 0.35, zt], [r, zt]], 32)
  // ribbon windows and banded columns round the bottom tier (the box hides its back)
  const fa = (a: number) => a > 3.3 && a < 5.95 // the open arc, between the box and the fan wing
  {
    const n = 18
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI
      if (!fa(a) || Math.abs(a + Math.PI / n - A) < 0.2) continue
      ring(win, 24.05, 1.2, 3.6, a + 0.035, a + 2 * Math.PI / n - 0.035, 1, 1)
      ring(win, 24.05, 4.8, 7.4, a + 0.035, a + 2 * Math.PI / n - 0.035, 1, 1)
      const q = P(24.5, a, 0)
      banded(trim, q[0], q[1], 0.75, 0, 7.9)
    }
  }
  ring(win, 18.25, 9.4, 11.5, 3.5, 7.3, 14, 0.8)
  ring(win, 15.45, 13.0, 14.9, 0, 2 * Math.PI, 20, 0.7)

  // ---------------------------------------------------------------- the dome, ribbed
  {
    const R0 = 15.0, Z0 = 15.5, H = 7.3
    const prof: [number, number][] = []
    const Rs = (R0 * R0 + H * H) / (2 * H) // sphere through the rim and the crown
    for (let i = 0; i <= 6; i++) { const r = R0 * (1 - i / 6); prof.push([Math.max(r, 0.001), Z0 + Math.sqrt(Rs * Rs - r * r) - (Rs - H)]) }
    lathe(glass, C[0], C[1], prof, 32)
    // 16 meridian ribs, a little proud of the glass
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * 2 * Math.PI, w = 0.2 / R0
      for (let i = 0; i < 5; i++) {
        const [r0, z0] = prof[i], [r1, z1] = prof[i + 1], o = 0.12
        const ww0 = 0.22, ww1 = 0.22
        const pa = (r: number, z: number, da: number): V3 => P(r + o, a + da, z + o * 0.6)
        face(trim, [pa(r0, z0, -ww0 / r0), pa(r0, z0, ww0 / r0), pa(r1, z1, ww1 / Math.max(r1, 2)), pa(r1, z1, -ww1 / Math.max(r1, 2))], [Math.cos(a), Math.sin(a), 0.6])
        void w
      }
    }
    lathe(trim, C[0], C[1], [[2.2, 22.5], [2.2, 23.1], [0.001, 23.3]], 12)
  }

  // ---------------------------------------------------------------- the entrance frame
  {
    // its own frame: u along the axis (outward), v across
    const ua: XY = [Math.cos(A), Math.sin(A)], va: XY = [-Math.sin(A), Math.cos(A)]
    const Q = (u: number, v: number, zz: number): V3 => [C[0] + ua[0] * u + va[0] * v, C[1] + ua[1] * u + va[1] * v, zz]
    const slab = (p: Part, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number) => {
      const r: XY[] = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => { const q = Q(u, v, 0); return [q[0], q[1]] as XY })
      const ccw = r[0][0] * r[1][1] - r[1][0] * r[0][1] + r[1][0] * r[2][1] - r[2][0] * r[1][1] + r[2][0] * r[3][1] - r[3][0] * r[2][1] + r[3][0] * r[0][1] - r[0][0] * r[3][1] > 0 ? r : [...r].reverse()
      walls(p, ccw, z0, z1); cap(p, ccw, z1)
    }
    // the frame's two piers and lintel, standing proud of the tiers up to 18.5
    slab(stone, 20, 25.6, -6.2, -4.4, 0, 18.8)
    slab(stone, 20, 25.6, 4.4, 6.2, 0, 18.8)
    slab(stone, 17, 25.6, -6.2, 6.2, 17.0, 18.8)
    slab(stone, 22, 25.6, -4.4, 4.4, 7.6, 9.0) // the inscription band over the doors
    // doors and the glazed panel over them
    const fz = (u: number, v0: number, v1: number, z0: number, z1: number, p: Part) => face(p, [Q(u, v0, z0), Q(u, v1, z0), Q(u, v1, z1), Q(u, v0, z1)], [ua[0], ua[1], 0])
    fz(24.1, -4.0, 4.0, 0, 7.5, win)
    // the crossed bars over the inscription band, and the mask
    for (const s of [-1, 1]) {
      // a bar from each lower corner of the opening up across to the far upper corner
      const b0 = Q(25.7, s * 4.4, 9.0), b1 = Q(25.7, s * 4.4 - s * 1.3, 9.0), b2 = Q(25.7, -s * 4.4, 16.0), b3 = Q(25.7, -s * 4.4 + s * 1.3, 16.0)
      face(trim, [b0, b1, b2, b3], [ua[0], ua[1], 0])
    }
    // the mask: a long face over the cross, a crown of rods above it
    const m = (v: number, zz: number) => Q(26.0, v, zz)
    face(bronze, [m(-1.1, 10.4), m(1.1, 10.4), m(1.7, 13.2), m(-1.7, 13.2)], [ua[0], ua[1], 0])
    face(bronze, [m(-1.7, 13.2), m(1.7, 13.2), m(1.6, 15.0), m(-1.6, 15.0)], [ua[0], ua[1], 0])
    face(bronze, [m(-0.5, 9.6), m(0.5, 9.6), m(1.1, 10.4), m(-1.1, 10.4)], [ua[0], ua[1], 0])
    for (let k = -3; k <= 3; k++) face(bronze, [m(k * 0.45 - 0.14, 15.0), m(k * 0.45 + 0.14, 15.0), m(k * 0.45 + 0.14, 16.9), m(k * 0.45 - 0.14, 16.9)], [ua[0], ua[1], 0])
    // banded columns flanking the doors, low and on the second tier
    for (const v of [-5.3, 5.3]) {
      const q = Q(26.4, v, 0); banded(trim, q[0], q[1], 0.8, 0, 7.6)
      const t = Q(25.2, v, 0); banded(trim, t[0], t[1], 0.7, 9.0, 15.8)
    }
    // the bridge over the forecourt to the doors, a plain deck on a wall
    slab(stone, 25.6, 40, -3.0, 3.0, 0, 0.9)
  }
  void box

  return [
    { part: stone, material: finish('wright-stone', 0xddd2bd) },
    { part: win, material: PALETTE.window },
    { part: glass, material: finish('glass', 0x7d9bb4, 0.24) },
    { part: trim, material: finish('wright-trim', 0xece4d4) },
    { part: bronze, material: finish('wright-bronze', 0x5b4a3c) },
    { part: band, material: finish('wright-band', 0xc9bea8) },
  ]
}

if (import.meta.main) await saveModel('det-charles-h-wright-museum', 'Charles H. Wright Museum of African American History', [42.3591328, -83.0609065], 64, build(), 6500)
