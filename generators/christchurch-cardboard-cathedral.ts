/**
 * Transitional Cathedral (the Cardboard Cathedral), Hereford Street,
 * Christchurch: procedural, CC0-1.0.
 * bun generators/christchurch-cardboard-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the plan is drawn
 * from OSM as is). Origin at the area centroid of OSM way/101123036
 * (172.6430602, -43.5323595). The site is flat; y = 0 is the forecourt.
 *
 * Shigeru Ban, opened 2013. An A-frame of 96 cardboard tubes, 48 a side,
 * resting on shipping containers that form the side walls, under a
 * translucent polycarbonate roof; the plan is a trapezoid, so the tubes
 * lean more steeply toward the back while the ridge stays level, and each
 * roof plane is a twisted (ruled) surface. The wide end is the glazed front
 * with the triangle of coloured glass triangles over a low white entrance
 * block, set back under the frame's overhang so the tubes show in the
 * soffit; the narrow back end is a corrugated wall with a louvred top.
 *
 * OSM: way/101123036 (building=church, no height): the front at y 18.2
 * from x -12.6 to 12.3 (24.9 m), the back at y -21.2 from x -7.8 to 8.2
 * (16 m), a kink on the west side at y -4 (followed loosely).
 * Published: 96 cardboard tubes, eight shipping containers, about 700 seats
 * (Wikipedia "Cardboard Cathedral"); tubes 600 mm across.
 * Photo-scaled: the ridge 21.5 m (c5, the front head-on: height to span
 * 0.87 over OSM's 24.9 m front); the back frame is 13.6 m across at its foot
 * (c6: 0.85 of the containers' 16 m) at the same height, so the ridge is
 * level; containers 2.6 m high (standard) under the tube feet; the coloured
 * window an equilateral triangle of seven rows from 4.3 m to 18.3 m (c5,
 * c7), set back 3.5 m behind the frame (c5's soffit); the entrance block
 * 4.3 m high across 20 m.
 * Estimated: the tube spacing (even, 48 a side over the length), the
 * container layout (one run each side), the rear wall's set-back, the
 * colour pattern of the window (drawn as an even mix of its red, blue and
 * amber; the real panels carry images and greens, dropped for the
 * material budget).
 * Left out: the cross at the apex inside, the bell, signs, the low
 * extensions behind the containers.
 *
 * Colours (sample.ts): tubes #c9a979 cardboard (c5 soffit, warm) ->
 * 0xc9a676; roof polycarbonate white-silver (c3) -> 0xdfe5e8 at opacity
 * 0.72 so the tubes show faintly through it (and plainly in the front soffit); frame, containers, entrance block
 * white -> 0xf0f0ec; glass triangles red 0xb8453c, blue as `window`, amber
 * 0xd1a043.
 *
 * Night: the coloured window and the entrance glow (`window*`); the roof is
 * `glass` and stays dark.
 *
 * LODs: the low model has all 96 tubes as 6-sided cylinders; the detail
 * model rounds them (12 sides), adds the window's mullion grid as bars, the
 * container ribs, the rear louvres and the ridge cap.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - c1 "Cardboard Cathedral 01.JPG", Schwede66, CC BY-SA 3.0
 * - c3 "Cardboard Cathedral 03.JPG", Schwede66, CC BY-SA 3.0
 * - c5 "Cardboard Cathedral, Christchurch, New Zealand.jpg", Michal Klajban, CC BY-SA 4.0
 * - c6 "Cardboard Cathedral from the back, Christchurch, New Zealand.jpg", Michal Klajban, CC BY-SA 4.0
 * - c7 "Cardboard Cathedral 1102.jpg", Willem van Valkenburg, CC BY 2.0
 * - c8 "Cardboard Cathedral and Te Kaha May 2025 02.jpg", Tom Ackroyd, CC BY 4.0
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { tube, face, box, saveLods, type XY, type Layer } from './sydney-tower-eye'

const FL: XY = [-12.6, 18.2], FR: XY = [12.3, 18.1], BR: XY = [8.2, -21.2], BL: XY = [-7.8, -20.8]
const RIDGE = 21.5, FOOT = 2.6, CONT_W = 2.44
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const FM = lerp2(FL, FR, 0.5), BM = lerp2(BL, BR, 0.5)
const ridgeAt = (t: number): V3 => { const p = lerp2(FM, BM, t); return [p[0], p[1], RIDGE] }
// the back frame is 13.6 m at its foot (c6), inside OSM's 16 m containers; the front is OSM's 24.9 m
const footAt = (side: -1 | 1, t: number): V3 => {
  const front = side < 0 ? FL : FR, back = side < 0 ? BL : BR
  const p = lerp2(front, back, t), m = lerp2(FM, BM, t)
  const k = 1 - 0.15 * t // pull the foot in toward the back
  return [m[0] + (p[0] - m[0]) * k, m[1] + (p[1] - m[1]) * k, FOOT]
}
// at the very front the frame comes down to the ground
const T_BACK = 0.965 // the last tube, over the rear wall

type Set = { tan: Part; white: Part; poly: Part; win: Part; red: Part; amber: Part }
const mk = (): Set => ({ tan: new Part(), white: new Part(), poly: new Part(), win: new Part(), red: new Part(), amber: new Part() })
const low = mk(), det = mk()

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  const NT = 48, R = 0.3
  // ---- the tubes: 48 a side, foot on the containers to the ridge
  for (const side of [-1, 1] as const) {
    for (let i = 0; i < NT; i++) {
      const t = 0.01 + (i / (NT - 1)) * (T_BACK - 0.01)
      const f = footAt(side, t), r = ridgeAt(t)
      // stop each tube just short of the ridge line, against its partner
      const dir: V3 = [r[0] - f[0], r[1] - f[1], r[2] - f[2]], L = Math.hypot(...dir)
      const e: V3 = [f[0] + (dir[0] * (L - 0.35)) / L, f[1] + (dir[1] * (L - 0.35)) / L, f[2] + (dir[2] * (L - 0.35)) / L]
      tube(s.tan, [f, e], R, d ? 12 : 6, true)
    }
  }

  // ---- the polycarbonate skin, 0.5 m outside the tube axes, a twisted surface each side
  const NS = d ? 16 : 8
  for (const side of [-1, 1] as const) {
    const pt = (t: number, top: boolean, off: number): V3 => {
      const f = footAt(side, t), r = ridgeAt(t)
      const dx = Math.abs(r[0] - f[0]), dz = r[2] - f[2], l = Math.hypot(dx, dz)
      const nx = (side * dz) / l, nz = dx / l // outward across the slope, and up
      const q = top ? r : f
      return [q[0] + nx * off, q[1], q[2] + nz * off]
    }
    for (let k = 0; k < NS; k++) {
      const t0 = (k / NS) * 1.0 - 0.0, t1 = ((k + 1) / NS) * 1.0
      const A = pt(t0, false, 0.5), B = pt(t1, false, 0.5), C = pt(t1, true, 0.5), D = pt(t0, true, 0.5)
      face(s.poly, [A, B, C], [side, 0, 1]); face(s.poly, [A, C, D], [side, 0, 1])
    }
  }

  // ---- the front frame: two white edge beams from the ground to the apex, and the ridge cap
  {
    const apex = ridgeAt(0)
    for (const side of [-1, 1] as const) {
      const f = side < 0 ? FL : FR
      const g: V3 = [f[0] + side * 0.4, f[1], 0]
      // a deep flat beam: 1.3 m deep along the building, 0.5 m thick across the slope
      const P = (q: V3, dy: number, off: number): V3 => [q[0] + side * off * 0.87, q[1] + dy, q[2] + off * 0.5]
      const a0 = P(g, 0, 0), a1 = P(apex, 0, 0), b0 = P(g, -1.3, 0), b1 = P(apex, -1.3, 0)
      const c0 = P(g, 0, 1.2), c1 = P(apex, 0, 1.2), d0 = P(g, -1.3, 1.2), d1 = P(apex, -1.3, 1.2)
      face(s.white, [a0, c0, c1, a1], [0, 1, 0])
      face(s.white, [c0, d0, d1, c1], [side, 0, 0.6])
      face(s.white, [b0, a0, a1, b1], [-side, 0, -0.6])
      face(s.white, [d0, b0, b1, d1], [0, -1, 0])
    }
    // ridge cap along the top
    const r0 = ridgeAt(-0.005), r1 = ridgeAt(1.0)
    tube(s.white, [[r0[0], r0[1], RIDGE + 0.55], [r1[0], r1[1], RIDGE + 0.55]], 0.3, d ? 8 : 4, true)
  }

  // ---- shipping containers along both sides, under the tube feet
  for (const side of [-1, 1] as const) {
    const nC = 4
    for (let c = 0; c < nC; c++) {
      const t0 = 0.06 + (c / nC) * 0.94, t1 = 0.06 + ((c + 1) / nC) * 0.94 - 0.01
      const f0 = footAt(side, t0), f1 = footAt(side, t1)
      // outer face on the foot line, 2.44 m deep inward
      const ux = f1[0] - f0[0], uy = f1[1] - f0[1], L = Math.hypot(ux, uy)
      const u: XY = [ux / L, uy / L]
      const inward: XY = side < 0 ? [-u[1], u[0]] : [u[1], -u[0]] // toward the axis
      const q = (a: number, b: number): XY => [f0[0] + u[0] * a + inward[0] * b, f0[1] + u[1] * a + inward[1] * b]
      const cx = q(L / 2, CONT_W / 2)
      box(s.white, cx, L / 2, CONT_W / 2, 0, FOOT, Math.atan2(u[1], u[0]))
      if (d) {
        // corrugation ribs on the outer face
        for (let a = 0.3; a < L - 0.2; a += 0.6) {
          const p = q(a, -0.05)
          box(s.white, p, 0.06, 0.05, 0.1, FOOT - 0.1, Math.atan2(u[1], u[0]), { top: false })
        }
      }
    }
  }

  // ---- the entrance block under the window, glazed across its front
  const WIN_Y = FM[1] - 3.5
  {
    const cx = FM[0], hw = 10, y0 = FM[1] - 0.6, y1 = WIN_Y - 3
    box(s.white, [cx, (y0 + y1) / 2], hw, (y0 - y1) / 2, 0, 4.3)
    // glazing: broad panels between white posts
    for (let k = 0; k < 7; k++) {
      const x0 = cx - hw + 1.6 + k * 2.55, x1 = x0 + 2.25
      if (k === 0) continue // the signboard bay (c5)
      face(s.win, [[x0, y0 + 0.04, 0.15], [x1, y0 + 0.04, 0.15], [x1, y0 + 0.04, 3.2], [x0, y0 + 0.04, 3.2]], [0, 1, 0])
    }
  }

  // ---- the coloured window: an equilateral triangle of seven rows, 4.3 m to 18.3 m
  {
    const z0 = 4.3, H = 14.0, rows = 7, h = H / rows, w = h / (Math.sqrt(3) / 2)
    const cx = FM[0], y = WIN_Y
    const base = (H / (Math.sqrt(3) / 2)) / 2
    // backing triangle in white (the mullions show as its gaps), plus the soffit band to the frame
    face(s.white, [[cx - base - 0.3, y - 0.02, z0], [cx + base + 0.3, y - 0.02, z0], [cx, y - 0.02, z0 + H + 0.5]], [0, 1, 0])
    // a fixed pseudo-random colour order
    const colours = [0, 1, 2, 0, 3, 1, 2, 1, 0, 2, 1, 0, 3, 2, 0, 1, 2, 0, 1, 3, 0, 2, 1, 2, 0, 1, 0, 2, 3, 1, 2, 0, 1, 0, 2, 1, 3, 0, 1, 2, 0, 2, 1, 0, 3, 1, 2, 0, 1]
    let ci = 0
    const gap = d ? 0.07 : 0.1
    for (let r = 0; r < rows; r++) {
      // row r from the top: z from top - (r+1)h to top - r h
      const zt = z0 + H - r * h, zb = zt - h
      for (let k = 0; k < 2 * r + 1; k++) {
        const up = k % 2 === 0
        const xc = cx + (k - r) * (w / 2)
        let pts: [number, number][] = up ? [[xc - w / 2, zb], [xc + w / 2, zb], [xc, zt]] : [[xc - w / 2, zt], [xc, zb], [xc + w / 2, zt]]
        // shrink toward the centroid for the mullion gap
        const mx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, mz = (pts[0][1] + pts[1][1] + pts[2][1]) / 3
        const sc = 1 - gap / (w / (2 * Math.sqrt(3))) // inradius shrunk by the gap
        pts = pts.map(([x, z]) => [mx + (x - mx) * sc, mz + (z - mz) * sc])
        const col = colours[ci++ % colours.length]
        const part = col === 0 ? s.red : col === 2 ? s.amber : s.win
        face(part, pts.map(([x, z]) => [x, y + 0.03, z] as V3), [0, 1, 0])
      }
    }
    // the soffit: the tube undersides show; close the gap above the window to the frame with a white strip
  }

  // ---- the rear wall: a vertical corrugated triangle with a louvred top (c6)
  {
    const t = T_BACK + 0.012, r = ridgeAt(t), fl = footAt(-1, t), fr = footAt(1, t)
    const y = r[1]
    face(s.white, [[fl[0] + 0.3, y, 0], [fr[0] - 0.3, y, 0], [fr[0] - 0.3, y, FOOT], [r[0], y, RIDGE - 0.4], [fl[0] + 0.3, y, FOOT]], [0, -1, 0])
    face(s.white, [[fl[0] + 0.3, y + 0.1, 0], [fl[0] + 0.3, y + 0.1, FOOT], [r[0], y + 0.1, RIDGE - 0.4], [fr[0] - 0.3, y + 0.1, FOOT], [fr[0] - 0.3, y + 0.1, 0]], [0, 1, 0])
    if (d) for (let z = 12; z < 17.5; z += 0.5) {
      const half = ((RIDGE - z) / (RIDGE - FOOT)) * ((fr[0] - fl[0]) / 2) - 0.6
      if (half < 0.8) break
      box(s.white, [r[0], y - 0.08], Math.min(half, 2.2), 0.08, z, z + 0.1)
    }
  }
}

// ---- Materials and output --------------------------------------------------------------------------------

const layers = (s: Set): Layer[] => [
  { part: s.tan, material: finish('cardboard-tube', 0xc9a676) },
  { part: s.white, material: finish('white-frame', 0xf0f0ec) },
  { part: s.poly, material: { name: 'glass', color: 0xdfe5e8, roughness: 0.3, opacity: 0.72, doubleSided: true } as MaterialSpec },
  { part: s.win, material: PALETTE.window },
  { part: s.red, material: windowVariant(2, 0xb8453c) },
  { part: s.amber, material: windowVariant(3, 0xd1a043) },
]

if (import.meta.main) {
  await saveLods('christchurch-cardboard-cathedral', 'Transitional Cathedral (Cardboard Cathedral)', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, forecourt level',
    bearing: 0, height: 22.3,
  })
}
