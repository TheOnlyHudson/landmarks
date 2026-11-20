/**
 * Marjorie McNeely Conservatory (Frederick Nussbaumer, 1915), Como Park,
 * Saint Paul: procedural, CC0-1.0.
 * bun generators/msp-marjorie-mcneely-conservatory.ts [out.glb]
 *
 * Frame: bearing 45, so +y runs north-east along the two wings and +x
 * south-east, towards the dome's entrance and the park. The origin is the
 * area centroid of OSM way/363419023 (-93.151325, 44.981896). The site is
 * flat (lidar ground 284.9-285.3 m over the footprint); y = 0 is 284.9 m.
 *
 * What makes it itself: the Palm Dome, a white-framed glass bell on a white
 * base with tall windows, a clerestory drum and a smaller ribbed upper dome
 * with a lantern, entered through a white pavilion with a fan-lit gable on
 * the south-east; the two long curvilinear glass wings either side (North
 * Garden to the north-east, Sunken Garden to the south-west), their ends
 * closed by the same curved section with a white fan-lit door.
 *
 * Sources
 * - OSM (ODbL): way/363419023 (building=conservatory, the whole complex) and
 *   its parts: way/363419022 Palm Dome, way/363419024 North Garden,
 *   way/363419026 Sunken Garden, way/363419025, way/158779389,
 *   way/158779392, way/158779394, way/158779395 and way/35329730 Orchid House
 *   (the later glass houses and service blocks behind, to the north-west).
 * - USGS 3DEP lidar MN_CentralMissRiver_5_B22 (flown 2022), 1 m grid. Above
 *   y = 0: the dome 19.7 at the crown (17 at r = 6.5, 11.5-13 at r = 11.5,
 *   9.5 at r = 13.5); the wings' crowns 9.1 (North Garden) and 8-9 (Sunken
 *   Garden), 6.5-7 five metres off their centre lines; the entrance pavilion
 *   9.5-10; the north-west complex 4.2-5.8.
 * - USGS NAIP (public domain): the plan, the dome's 12 ribs, the ridged
 *   glass roof of the north-west house.
 * - Photos (Wikimedia Commons), compared side by side with renders:
 *   McGhiever, "Como Park Conservatory.jpg", CC BY-SA 3.0 (the entrance
 *     front from the south-east: base, pavilion, gable, both domes, wings);
 *   Runner1928, "Como Park Zoo and Conservatory 02.jpg" / "03" / "04",
 *     CC BY-SA 4.0 (the Sunken Garden wing and the dome from the south and
 *     east), and "Como Park Zoo and Conservatory - 01.jpg", CC BY-SA 4.0
 *     (a wing's end: the curved section, fan-lit door, balustrade);
 *   RxS, "Como Park Zoo and Conservatory-2006.jpg", public domain (the dome
 *     and a wing from the south).
 * Published: 1915, Frederick Nussbaumer (Como Park superintendent); National
 *   Register of Historic Places 1974 (Wikipedia, "Marjorie McNeely
 *   Conservatory").
 * Estimated from the photos (scaled to lidar): the dome's profile between the
 *   lidar points, the base wall (6 m) and its windows, the drum (13.6-15.5),
 *   the lantern (to 21), the wings' 3.2 m upright glass before the curve, the
 *   ribs' spacing, the pavilion's gable (to 12.8) and fan light, the drum's 16 windows, the end doors.
 * Left out: the balustraded terraces and steps (at ground), the reflecting
 *   pools, the Japanese garden, the visitor centre (a separate building).
 * Doubts: the north-west complex is drawn plainly (a low block with a ridged
 *   glass roof over its glass house) from NAIP and lidar only; no photo was
 *   used for it.
 * Night: glass roofs are `glass` and stay dark; the base's windows are
 *   `window` and the entrance doors `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, ccw, flatShape, arc, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'

const DX = 36.5, DY = -10.5, DR = 17.5 // the Palm Dome's centre and base radius
const BASE = 6 // its white base
const WEST: XY[] = [[8.3, 43.8], [8.4, 41.0], [8.9, 32.8], [11.5, 32.9], [12.0, 23.7], [14.9, 23.6], [15.0, 14.2], [17.4, 14.1], [17.7, 3.2], [17.8, 2.0], [16.7, 1.8], [16.8, -7.7], [19.5, -7.5], [19.5, -16.8], [19.9, -19.5], [20.8, -31.1], [23.0, -31.2], [23.5, -39.2], [-4.7, -41.2], [-5.2, -33.6], [-9.9, -34.0], [-32.0, -35.3], [-32.1, -17.9], [-32.1, -3.7], [-33.1, 20.2], [-49.1, 19.9], [-61.8, 19.1], [-62.8, 38.7], [-50.3, 39.6]]

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const face = (p: Part, P: V3[], out: V3) => {
  const q = dot(cross(sub(P[1], P[0]), sub(P[2], P[0])), out) < 0 ? [...P].reverse() : P
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

/** A curvilinear glasshouse section, half-width h: upright to zc, then a quarter ellipse to the crown. */
const section = (h: number, zc: number, crown: number, n = 6): XY[] => {
  const pts: XY[] = [[h, 0], [h, zc]]
  for (let k = 1; k <= n; k++) { const t = (k / n) * (Math.PI / 2); pts.push([h * Math.cos(t), zc + (crown - zc) * Math.sin(t)]) }
  return pts // from the eave out to the centre line (s, z), s >= 0
}

export function build() {
  const white = new Part(), glass = new Part(), win = new Part(), roof = new Part(), door = new Part()

  // ---------------------------------------------------------------- the Palm Dome
  const S = 24
  lathe(white, DX, DY, [[DR, 0], [DR, BASE]], S)
  // the lower glass bell, the drum, the upper dome, the lantern
  lathe(glass, DX, DY, [[DR - 0.2, BASE], [16.2, 8.2], [14.2, 10.3], [11.8, 12.0], [9.4, 13.2], [7.6, 13.6]], S)
  lathe(white, DX, DY, [[7.6, 13.6], [7.6, 15.5]], S)
  lathe(glass, DX, DY, [[7.4, 15.5], [6.6, 16.9], [5.2, 18.2], [3.4, 19.2], [1.4, 19.7], [0, 19.8]], S)
  lathe(white, DX, DY, [[0.9, 19.7], [0.9, 21], [0, 21.3]], 8)
  // the drum's clerestory windows
  for (let i = 0; i < 16; i++) {
    const a = ((i + 0.5) / 16) * Math.PI * 2, n: XY = [Math.cos(a), Math.sin(a)]
    const f: Face = { o: [DX + n[0] * 7.6 * Math.cos(Math.PI / S), DY + n[1] * 7.6 * Math.cos(Math.PI / S), 0], n }
    flatShape(win, f, rect(-0.75, 13.9, 0.75, 15.2), 0.08)
  }
  // the cornice ring at the base's top and the ribs (12, white, slightly proud)
  lathe(white, DX, DY, [[DR + 0.35, BASE - 0.5], [DR + 0.35, BASE], [DR - 0.2, BASE + 0.05]], S)
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + Math.PI / 24, c = Math.cos(a), s = Math.sin(a), w = 0.22
    const lo: XY[] = [[DR - 0.2, BASE], [16.2, 8.2], [14.2, 10.3], [11.8, 12.0], [9.4, 13.2], [7.6, 13.6]]
    const up: XY[] = [[7.4, 15.5], [6.6, 16.9], [5.2, 18.2], [3.4, 19.2], [1.4, 19.7]]
    for (const prof of [lo, up]) {
      for (let k = 0; k + 1 < prof.length; k++) {
        const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
        const P = (r: number, z: number, side: number): V3 => [DX + c * (r + 0.15) - s * side * w, DY + s * (r + 0.15) + c * side * w, z + 0.15]
        face(white, [P(r0, z0, -1), P(r0, z0, 1), P(r1, z1, 1), P(r1, z1, -1)], [c * (z1 - z0), s * (z1 - z0), r0 - r1])
      }
    }
  }
  // the base's tall windows, between white piers (not where the pavilion and wings meet it)
  for (let i = 0; i < S; i++) {
    const a = ((i + 0.5) / S) * Math.PI * 2, deg = (a * 180) / Math.PI
    const near = (t: number) => Math.abs(((deg - t + 540) % 360) - 180) < 22
    if (near(0) || near(90) || near(270)) continue // the pavilion (+x) and the wings (+-y)
    const n: XY = [Math.cos(a), Math.sin(a)]
    const f: Face = { o: [DX + n[0] * DR * Math.cos(Math.PI / S), DY + n[1] * DR * Math.cos(Math.PI / S), 0], n }
    flatShape(win, f, rect(-1.05, 0.8, 1.05, 5.3), 0.06)
  }

  // ---------------------------------------------------------------- the entrance pavilion (south-east)
  {
    const x0 = DX + 11.5, x1 = 54.6, y0 = -15.6, y1 = -4.4, top = 7.6, ym = (y0 + y1) / 2, hw = (y1 - y0) / 2
    prism(white, white, rect(x0, y0, x1, y1), 0, top)
    // the big gable rising into the bell, its face a glazed fan in a white frame
    const gt = 12.8
    const g: XY[] = [[-hw, top], [hw, top], [0, gt]]
    const F: Face = { o: [x1, ym, 0], n: [1, 0] } // s = y - ym
    const G0 = g.map(([s, z]): V3 => [x1, ym + s, z]), G1 = g.map(([s, z]): V3 => [x0 - 3, ym + s, z])
    face(white, G0, [1, 0, 0])
    face(white, [G0[0], G1[0], G1[2], G0[2]], [0, -1, 0.6]); face(white, [G0[1], G0[2], G1[2], G1[1]], [0, 1, 0.6])
    flatShape(glass, F, [[-hw + 0.9, top + 0.3], [hw - 0.9, top + 0.3], [0, gt - 0.75]], 0.06)
    flatShape(white, F, [[-3.6, top + 0.3], [3.6, top + 0.3], ...arc(0, top + 0.3, 3.6, 0, 180, 10).slice(1, -1)], 0.1)
    flatShape(glass, F, [[-3.0, top + 0.3], [3.0, top + 0.3], ...arc(0, top + 0.3, 3.0, 0, 180, 10).slice(1, -1)], 0.14)
    // its windows and the doors
    for (const s of [-4.2, -2.1, 2.1, 4.2]) flatShape(win, F, rect(s - 0.75, 1.0, s + 0.75, 5.6), 0.06)
    flatShape(door, F, rect(-0.9, 0, 0.9, 3.2), 0.06)
    flatShape(win, F, rect(-0.9, 3.4, 0.9, 5.6), 0.06)
  }

  // ---------------------------------------------------------------- the wings
  const wing = (xc: number, ya: number, yb: number, crown: number, end: 1 | -1) => {
    const h = 7.5, sec = section(h, 3.2, crown)
    const full: XY[] = [...sec, ...sec.slice(0, -1).reverse().map(([s, z]) => [-s, z] as XY)] // s from +h round to -h
    // the white plinth
    prism(white, null, rect(xc - h, Math.min(ya, yb), xc + h, Math.max(ya, yb)), 0, 0.9)
    // the glass skin
    for (let k = 0; k + 1 < full.length; k++) {
      const [s0, z0] = full[k], [s1, z1] = full[k + 1]
      const zz0 = Math.max(z0, 0.9), zz1 = Math.max(z1, 0.9)
      face(glass, [[xc + s0, ya, zz0], [xc + s1, ya, zz1], [xc + s1, yb, zz1], [xc + s0, yb, zz0]], [Math.sign(s0 + s1) || 0, 0, (zz0 + zz1) / 2 > 3.5 ? 1 : 0.01])
    }
    // the ribs: white bands following the section, every 7.5 m
    const L = Math.abs(yb - ya), n = Math.max(2, Math.round(L / 7.5)), dir = Math.sign(yb - ya)
    for (let i = 0; i <= n; i++) {
      const y = ya + (dir * L * i) / n
      for (let k = 0; k + 1 < full.length; k++) {
        const [s0, z0] = full[k], [s1, z1] = full[k + 1]
        const nx = z1 - z0, nz = -(s1 - s0), m = Math.hypot(nx, nz) || 1, o = 0.14
        const A = (s: number, z: number, dy: number): V3 => [xc + s + (nx / m) * o, y + dy, Math.max(z, 0.9) + (nz / m) * o]
        face(white, [A(s0, z0, -0.2), A(s1, z1, -0.2), A(s1, z1, 0.2), A(s0, z0, 0.2)], [nx, 0, nz])
      }
    }
    // the closed end: the section in glass, a white door bay with a fan light
    const ye = end > 0 ? Math.max(ya, yb) : Math.min(ya, yb)
    const endPts = full.map(([s, z]): V3 => [xc + s, ye, Math.max(z, 0.9)])
    face(glass, endPts, [0, end, 0])
    const D: Face = { o: [xc, ye + end * 2.2, 0], n: [0, end] }
    prism(white, white, rect(xc - 2.2, Math.min(ye, ye + end * 2.2), xc + 2.2, Math.max(ye, ye + end * 2.2)), 0, 4.6)
    flatShape(door, D, rect(-1.0, 0, 1.0, 2.8), 0.06)
    flatShape(glass, D, [[-1.6, 3.0], [1.6, 3.0], ...arc(0, 3.0, 1.6, 0, 180, 8).slice(1, -1)], 0.06)
    // the wing's other end is closed by the dome's base
    const yo = end > 0 ? Math.min(ya, yb) : Math.max(ya, yb)
    face(white, full.map(([s, z]): V3 => [xc + s, yo, Math.max(z, 0.9)]), [0, -end, 0])
  }
  wing(32.8, DY + 12, 34.4, 9.1, 1) // North Garden
  wing(36.6, DY - 12, -57, 8.6, -1) // Sunken Garden

  // ---------------------------------------------------------------- the north-west complex (later)
  {
    const w = ccw(WEST)
    prism(white, roof, w, 0, 4.4)
    // the ridged glass roof over its glass house (NAIP), ridges running south-east
    const x0 = -18, x1 = 16.2, y0 = -18, y1 = 27, n = 5, dy = (y1 - y0) / n
    for (let i = 0; i < n; i++) {
      const a = y0 + i * dy, b = a + dy, m = (a + b) / 2, z0 = 4.45, z1 = 5.9
      face(glass, [[x0, a, z0], [x1, a, z0], [x1, m, z1], [x0, m, z1]], [0, -1, 1])
      face(glass, [[x0, m, z1], [x1, m, z1], [x1, b, z0], [x0, b, z0]], [0, 1, 1])
      face(glass, [[x0, a, z0], [x0, m, z1], [x0, b, z0]], [-1, 0, 0])
      face(glass, [[x1, a, z0], [x1, b, z0], [x1, m, z1]], [1, 0, 0])
    }
  }

  return finishGlb('Marjorie McNeely Conservatory', [
    { part: white, material: finish('conservatory-white', 0xf4f1ea) },
    { part: glass, material: finish('glass', 0xa9b8c2) }, // silvery, as the photos' glass reads
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ], {
    bearing: 45, height: 21.3,
    replaces: ['way/363419023', 'way/363419022', 'way/363419024', 'way/363419026', 'way/363419025', 'way/158779389', 'way/158779392', 'way/158779394', 'way/158779395', 'way/35329730'],
  })
}

if (import.meta.main) await writeModel('msp-marjorie-mcneely-conservatory', build())
