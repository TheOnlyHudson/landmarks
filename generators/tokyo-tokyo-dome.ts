/**
 * Tokyo Dome (東京ドーム, "the Big Egg"), Kōraku, Bunkyō, Tokyo (Nikken
 * Sekkei and Takenaka, 1988): procedural, CC0-1.0.
 * bun generators/tokyo-tokyo-dome.ts
 *
 * Writes models/tokyo-tokyo-dome.glb (low: one raised cushion per cell of
 * the cable net, the net standing on the creases as bold members, the
 * skirt's mullions) and .detail.glb (zoom 16: the cushions on a fine grid,
 * finer cables and mullions, the canopy's columns).
 *
 * Identity: the low white air-supported membrane with its diagonal cable
 * net and quilted pillows; the canted ring it springs from; the sloped glass
 * skirt round the gate sides over a ground-storey canopy.
 *
 * Frame: built axis-aligned and turned by the placement's bearing (7°).
 * Origin at the centroid of OSM way/20028328 (139.751966, 35.7055246).
 * y = 0 is the plaza round the building. The field is ~5.5 m below it
 * (published: roof 61.69 m above the field, building 56.19 m), but it is
 * covered, so nothing below the plaza is modelled and elevation stays 0.
 * Terrain check: ok (Mapterhorn relief under the plan ~3 m).
 *
 * OSM (replaced): way/20028328 Tokyo Dome (Q733748); way/576664844, a
 * building:part over its south-east third (tagged 25 m, gabled: wrong, it is
 * the same building); way/576498576, a small wedge against its west side
 * (stairs to the gates; 29% under the model, reported by the overlap check).
 *
 * Published (ja.wikipedia 東京ドーム): building height 56.19 m; roof 61.69 m
 * above the field; building area 46,755 m²; the dome about 216 m square;
 * 28 cables at 8.5 m in a grid; a double fluororesin-coated glass-fibre
 * membrane, 400 t, letting through ~5% of daylight.
 *
 * Measured on OSM: the plan is a superellipse |x|^2.6 + |y|^2.6 = 107^2.6
 * (rms 3%), turned 7° clockwise.
 *
 * Estimated from photos (Carpkazu's from above, DX Broadrec's and
 * 江戸村のとくぞう's gate-side views, Syced's north side from Kōrakuen
 * station): ground-storey canopy at ~10.5 m; the glass skirt leaning in ~10 m
 * up to ~28 m, grey-green with dense white mullions; a canted ring band
 * flaring back out to its gutter at ~33.5 m, where the membrane springs;
 * the membrane a convex dome, crown ~53.9 m on the cable crossings and
 * ~55.8 m on the cushions (just under the published 56.19 m), i.e. ~20-22 m
 * above the ring, rising ~35° from the gutter (profile 1 - rho^3.4); the north quarter (bearings 295-65°) grey panels instead
 * of glass. The cable net is drawn as two diagonal families at 17 m (the
 * spacing read off the photos; the published 8.5 m figure could not be
 * reconciled with the visible net, see doubts), raised ~0.5 m and drawn
 * bolder than real so it reads; the cushions bulge 2 m between the cables.
 *
 * Colours (daylight photos): membrane white (#f1f1ee), cables mid grey,
 * ring pale grey, skirt glass grey-green (#8b9c96), concrete grey.
 * Night: the skirt glows warm as in night photos (window); the gates are
 * entrance; the membrane carries a faint floodlight wash.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Tokyo dome.JPG, Carpkazu at Japanese Wikipedia, CC BY-SA 3.0 (from above)
 *  - Tokyo Dome 2007-12.jpg, DX Broadrec, CC BY-SA 3.0 (gate side)
 *  - Tokyo Dome (December 24, 2024).jpg, AmadeusPrower, CC0 (gates at night)
 *  - Tokyo Dome 201904a.jpg, 江戸村のとくぞう, CC BY-SA 4.0 (gates)
 *  - Tokyo Dome 2.jpg, Syced, CC0 (north side, from Kōrakuen station)
 *  - Tokyo Dome (52480559907).jpg, Dick Thomas Johnson, CC BY 2.0 (gate side)
 * No look-only sources used.
 *
 * Doubts: the cable spacing and direction (the published "28 cables at
 * 8.5 m" would cover only ~120 m; the photos show a coarser diagonal net,
 * followed here); the ring and skirt heights are photo estimates; which
 * sides are glazed rests on four photos; the green TOKYO DOME letters and
 * the blue LED line on the ring are left out (no lettering traced).
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { member, unit, writeModel, type XY, type Layer } from './tokyo-metropolitan-government-building'

const TAU = Math.PI * 2
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const nz = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

type Opt = { detail: boolean }

/*
 * Plan: a superellipse |x/A|^n + |y/A|^n = 1 fitted to OSM way/20028328 (A 107 m,
 * n 2.6, rms 3%, turned 7° clockwise: the placement's bearing).
 */
const A = 107, NEXP = 2.6
/** The point at "radius" rho (1 on the outline) and angle t. */
const sq = (rho: number, t: number, a = A): XY => {
  const c = Math.cos(t), s = Math.sin(t)
  return [a * rho * Math.sign(c) * Math.pow(Math.abs(c), 2 / NEXP), a * rho * Math.sign(s) * Math.pow(Math.abs(s), 2 / NEXP)]
}
const rhoOf = (x: number, y: number, a = A) => Math.pow(Math.pow(Math.abs(x / a), NEXP) + Math.pow(Math.abs(y / a), NEXP), 1 / NEXP)

// Heights above the plaza (y = 0).
const Z = {
  top: 56.19, // published: building height
  ring: 33.5, // estimated (photos): the membrane springs from the compression ring
  ringBot: 29.0, // estimated: foot of the ring's canted band
  skirtTop: 28.0, // estimated: top of the sloped glazed skirt
  skirtFoot: 10.5, // estimated: top of the ground-storey canopy
}
const RING_RHO = 0.982 // the ring's outer lip, just inside the outline
const MEM_RHO = 0.968 // the membrane's edge, inside the ring's gutter
const SKIRT_TOP_RHO = 0.905 // the skirt leans in ~10 m (photos)
const BASE_RHO = 0.965 // the ground storey's wall, under the canopy
/** The membrane: a low dome on the ring, steeper at its edge; its crown 1.1 m under the published height so the cables on it top out there. */
const memZ = (rho: number) => Z.ring + (Z.top - 2.3 - Z.ring) * (1 - Math.pow(Math.min(1, rho / MEM_RHO), 3.4))

function build(o: Opt): Layer[] {
  const membrane = new Part(), cables = new Part(), ring = new Part(), glass = new Part(), concrete = new Part(), gates = new Part()
  const N = o.detail ? 160 : 56
  const ang = (i: number) => (i / N) * TAU
  // compass bearing (model frame) of an angle, to tell the north side apart
  const brgOf = (t: number) => (90 - (t * 180) / Math.PI + 360) % 360
  const northSide = (t: number) => { const b = brgOf(t); return b > 295 || b < 65 }

  type Face = 'out' | 'up' | 'down' | 'in'
  /** Quads between two superellipse rings (rho0, z0) -> (rho1, z1), smooth round the ring. */
  const band = (p: Part | ((i: number) => Part), rho0: number, z0: number, rho1: number, z1: number, face: Face) => {
    const Q: V3[][] = [], F: V3[] = []
    for (let i = 0; i < N; i++) {
      const a0 = sq(rho0, ang(i)), b0 = sq(rho0, ang(i + 1)), a1 = sq(rho1, ang(i)), b1 = sq(rho1, ang(i + 1))
      const a: V3 = [a0[0], a0[1], z0], b: V3 = [b0[0], b0[1], z0], c: V3 = [b1[0], b1[1], z1], d: V3 = [a1[0], a1[1], z1]
      let n = nz(cross(sub(b, a), sub(d, a)))
      const m: XY = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], ml = Math.hypot(m[0], m[1])
      const radial = (n[0] * m[0] + n[1] * m[1]) / ml
      const v = face === 'out' ? radial : face === 'in' ? -radial : face === 'up' ? n[2] : -n[2]
      if (v < 0) n = [-n[0], -n[1], -n[2]]
      Q.push([a, b, c, d]); F.push(n)
    }
    for (let i = 0; i < N; i++) {
      const nl = nz(add(F[(i + N - 1) % N], F[i])), nr = nz(add(F[i], F[(i + 1) % N]))
      const [a, b, c, d] = Q[i], tp = typeof p === 'function' ? p(i) : p
      tp.tri(a, b, c, undefined, undefined, undefined, [nl, nr, nr])
      tp.tri(a, c, d, undefined, undefined, undefined, [nl, nr, nl])
    }
  }

  // ---- the base: ground storey, gates, the sloped skirt, the ring -------------------
  // ground storey wall (recessed under the canopy), with the gates' glazing as panels
  band(concrete, BASE_RHO, 0, BASE_RHO, Z.skirtFoot - 1.2, 'out')
  // the gate fronts: lit glazing in the ground storey, except on the north (service) side
  band((i) => (northSide(ang(i + 0.5)) || i % 4 >= 2 ? glass : gates), BASE_RHO + 0.002, 1.0, BASE_RHO + 0.002, 6.5, 'out')
  // canopy: soffit and fascia
  band(concrete, BASE_RHO, Z.skirtFoot - 1.2, 1.0, Z.skirtFoot - 1.2, 'down')
  band(concrete, 1.0, Z.skirtFoot - 1.2, 1.0, Z.skirtFoot, 'out')
  // the skirt: glazed (gates sides), grey panels on the north (photo from Kōrakuen station)
  band((i) => (northSide(ang(i + 0.5)) ? concrete : glass), 1.0, Z.skirtFoot, SKIRT_TOP_RHO, Z.skirtTop, 'out')
  // a white band at the skirt's head (where the TOKYO DOME letters stand)
  band(ring, SKIRT_TOP_RHO, Z.skirtTop, SKIRT_TOP_RHO, Z.ringBot, 'out')
  // the ring: a canted band flaring out to the gutter lip, its top, and the gutter's inner face
  band(ring, SKIRT_TOP_RHO, Z.ringBot, RING_RHO, Z.ring - 0.6, 'out')
  band(ring, RING_RHO, Z.ring - 0.6, RING_RHO, Z.ring, 'out')
  band(ring, RING_RHO, Z.ring, MEM_RHO, Z.ring, 'up')

  // ---- the membrane ---------------------------------------------------------------
  // Diagonal cable grid (u, v at 45° to the plan), spacing S, with a cushion bulging
  // between the cables in every cell (low: one raised centre per cell; detail: a fine grid).
  const S = 17.0
  const PILLOW = 2.0 // the cushions' bulge between cables (estimated, photos)
  const pillowH = o.detail ? PILLOW : 0
  const surf = (x: number, y: number) => {
    const rho = rhoOf(x, y)
    let z = memZ(rho)
    if (pillowH > 0) {
      const u = (x + y) / Math.SQRT2, v = (x - y) / Math.SQRT2
      const fade = Math.min(1, Math.max(0, (MEM_RHO - rho) / 0.06))
      z += pillowH * fade * Math.abs(Math.sin((Math.PI * u) / S)) * Math.abs(Math.sin((Math.PI * v) / S))
    }
    return z
  }
  if (!o.detail) {
    // Pillows: one cushion per cell of the cable net. The cell's corners sit on
    // the cables (on the smooth dome), its centre bulges up; corners past the
    // membrane's edge are pulled in onto it. Smooth normals, so they read as
    // cushions with creases along the cables.
    const tris: V3[][] = []
    const toXY = (u: number, v: number): XY => [(u + v) / Math.SQRT2, (u - v) / Math.SQRT2]
    const onDome = (q: XY): V3 => {
      const rho = rhoOf(q[0], q[1])
      if (rho <= MEM_RHO) return [q[0], q[1], memZ(rho)]
      const k = MEM_RHO / rho
      return [q[0] * k, q[1] * k, Z.ring]
    }
    for (let i = -9; i < 9; i++)
      for (let j = -9; j < 9; j++) {
        const u0 = i * S, u1 = u0 + S, v0 = j * S, v1 = v0 + S
        const cc = toXY(u0 + S / 2, v0 + S / 2), rc = rhoOf(cc[0], cc[1])
        if (rc > MEM_RHO * 1.04) continue
        const C = [toXY(u0, v0), toXY(u1, v0), toXY(u1, v1), toXY(u0, v1)].map(onDome)
        const fade = Math.min(1, Math.max(0, (MEM_RHO - rc) / 0.08))
        const ctr = onDome(cc)
        const mid: V3 = [ctr[0], ctr[1], ctr[2] + PILLOW * fade]
        for (let e = 0; e < 4; e++) tris.push([C[e], C[(e + 1) % 4], mid])
      }
    // smooth normals by welded position
    const key = (p: V3) => p.map((c) => Math.round(c * 20)).join(',')
    const acc = new Map<string, V3>()
    const faceN = tris.map(([a, b, c]) => { let n = cross(sub(b, a), sub(c, a)); if (n[2] < 0) n = [-n[0], -n[1], -n[2]]; return n })
    tris.forEach((t, k) => t.forEach((p) => { const q = acc.get(key(p)) ?? [0, 0, 0]; acc.set(key(p), add(q, faceN[k])) }))
    tris.forEach(([a, b, c]) => {
      if (Math.hypot(...cross(sub(b, a), sub(c, a))) < 1e-6) return
      membrane.tri(a, b, c, undefined, undefined, undefined, [a, b, c].map((p) => nz(acc.get(key(p))!)) as V3[])
    })
    // an underlay just below, round the edge, so clipped cells leave no gap
    for (const [r0, r1] of [[MEM_RHO, MEM_RHO * 0.86], [MEM_RHO * 0.86, MEM_RHO * 0.72]]) {
      for (let i = 0; i < N; i++) {
        const a = sq(r0, ang(i)), b = sq(r0, ang(i + 1)), c = sq(r1, ang(i + 1)), d = sq(r1, ang(i))
        const P = (q: XY, rho: number): V3 => [q[0], q[1], memZ(rho) - 0.35]
        membrane.tri(P(a, r0), P(b, r0), P(c, r1), undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
        membrane.tri(P(a, r0), P(c, r1), P(d, r1), undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
      }
    }
  } else {
    // a fine square grid clipped to the membrane's edge, then the edge band
    const G = 1.9, n = Math.ceil((A * MEM_RHO) / G)
    const nrm = (x: number, y: number): V3 => { const e = 0.4; return nz([-(surf(x + e, y) - surf(x - e, y)) / (2 * e), -(surf(x, y + e) - surf(x, y - e)) / (2 * e), 1]) }
    const inside = (x: number, y: number) => rhoOf(x, y) < MEM_RHO * 0.985
    for (let ix = -n; ix < n; ix++)
      for (let iy = -n; iy < n; iy++) {
        const x0 = ix * G, y0 = iy * G, x1 = x0 + G, y1 = y0 + G
        if (!(inside(x0, y0) && inside(x1, y0) && inside(x1, y1) && inside(x0, y1))) continue
        const P = (x: number, y: number): V3 => [x, y, surf(x, y)]
        membrane.tri(P(x0, y0), P(x1, y0), P(x1, y1), undefined, undefined, undefined, [nrm(x0, y0), nrm(x1, y0), nrm(x1, y1)])
        membrane.tri(P(x0, y0), P(x1, y1), P(x0, y1), undefined, undefined, undefined, [nrm(x0, y0), nrm(x1, y1), nrm(x0, y1)])
      }
    // stitch the grid's ragged edge to the membrane's edge with a fan per boundary cell:
    // a ring band from just inside the edge, under the grid, to the edge (hidden seam)
    const inner = MEM_RHO * 0.94
    for (let i = 0; i < N; i++) {
      const a = sq(inner, ang(i)), b = sq(inner, ang(i + 1)), c = sq(MEM_RHO, ang(i + 1)), d = sq(MEM_RHO, ang(i))
      const P = (q: XY, rho: number): V3 => [q[0], q[1], rho === MEM_RHO ? Z.ring : surf(q[0], q[1]) - 0.15]
      membrane.tri(P(a, inner), P(c, MEM_RHO), P(b, inner), undefined, undefined, undefined, [nrm(a[0], a[1]), nrm(c[0], c[1]), nrm(b[0], b[1])])
      membrane.tri(P(a, inner), P(d, MEM_RHO), P(c, MEM_RHO), undefined, undefined, undefined, [nrm(a[0], a[1]), nrm(d[0], d[1]), nrm(c[0], c[1])])
    }
  }

  // the cables: two families of straight lines in plan (diagonal), lying on the membrane
  const R = o.detail ? 0.45 : 0.6, SIDES = o.detail ? 6 : 3
  const lift = o.detail ? 0.3 : 0.45
  const zc = (x: number, y: number) => memZ(rhoOf(x, y)) + lift // cables sit in the pillows' creases
  for (const fam of [1, -1]) {
    for (let k = -8; k <= 8; k++) {
      const c0 = k * S // u (or v) of this cable
      // walk along the line, inside the membrane
      const pts: V3[] = []
      const STEP = o.detail ? 4.25 : S
      const at = (t: number): XY => fam === 1 ? [(c0 + t) / Math.SQRT2, (c0 - t) / Math.SQRT2] : [(t + c0) / Math.SQRT2, (t - c0) / Math.SQRT2]
      const edge = (tIn: number, tOut: number): number => { for (let k = 0; k < 30; k++) { const m = (tIn + tOut) / 2; if (rhoOf(...at(m)) <= MEM_RHO) tIn = m; else tOut = m } return tIn }
      let prevIn = false, prevT = 0
      for (let t = -170; t <= 170.01; t += STEP) {
        const inside = rhoOf(...at(t)) <= MEM_RHO
        if (inside && !prevIn && t > -170) { const te = edge(t, prevT); const q = at(te); pts.push([q[0], q[1], Z.ring + lift]) }
        if (inside) { const q = at(t); pts.push([q[0], q[1], zc(q[0], q[1])]) }
        if (!inside && prevIn) { const te = edge(prevT, t); const q = at(te); pts.push([q[0], q[1], Z.ring + lift]) }
        prevIn = inside; prevT = t
      }
      if (pts.length < 2) continue
      // extend each end to the membrane's edge
      for (let s = 0; s < pts.length - 1; s++) member(cables, pts[s], pts[s + 1], R, SIDES, [0, 0, 1], Math.PI / 2)
    }
  }
  // the ring's gutter rail, a bold line at the membrane's foot
  for (let i = 0; i < N; i++) {
    const a = sq(MEM_RHO, ang(i)), b = sq(MEM_RHO, ang(i + 1))
    member(cables, [a[0], a[1], Z.ring + 0.35], [b[0], b[1], Z.ring + 0.35], o.detail ? 0.4 : 0.45, SIDES)
  }

  // the skirt's dense vertical mullions (white bars down the glass), both models
  {
    const NM = o.detail ? 240 : 84
    for (let k = 0; k < NM; k++) {
      const t = ((k + 0.5) / NM) * TAU
      if (northSide(t)) continue
      const a = sq(1.0, t), b = sq(SKIRT_TOP_RHO, t), out = unit([a[0], a[1], 0])
      member(ring, [a[0] + out[0] * 0.25, a[1] + out[1] * 0.25, Z.skirtFoot + 0.2], [b[0] + out[0] * 0.25, b[1] + out[1] * 0.25, Z.skirtTop - 0.2], o.detail ? 0.2 : 0.3, o.detail ? 4 : 3, [0, 0, 1], 0)
    }
  }
  // detail: the canopy's columns
  if (o.detail) {
    const NCOL = 64
    for (let k = 0; k < NCOL; k++) {
      const t = ((k + 0.5) / NCOL) * TAU
      if (northSide(t)) continue
      const a = sq(0.99, t)
      member(ring, [a[0], a[1], 0], [a[0], a[1], Z.skirtFoot - 1.2], 0.7, 8)
    }
  }

  return [
    { part: membrane, material: { ...finish('dome-membrane', 0xf1f1ee, 0.5), floodlight: (_p: V3, n: V3) => (n[2] > 0.95 ? 0.15 : 0.35) } },
    { part: cables, material: finish('dome-cable', 0x9aa1a8, 0.6) },
    { part: ring, material: finish('dome-ring', 0xe2e2df) },
    { part: concrete, material: finish('dome-concrete', 0xc4c6c6) },
    { part: glass, material: { ...PALETTE.window, color: 0x8b9c96 } },
    { part: gates, material: PALETTE.entrance },
  ]
}

const meta = { bearing: 7, elevation: 0, height: Z.top }
if (import.meta.main) {
  await writeModel('tokyo-tokyo-dome', 'tokyo-tokyo-dome.glb', 'Tokyo Dome', build({ detail: false }), meta, 5000, 250_000)
  await writeModel('tokyo-tokyo-dome', 'tokyo-tokyo-dome.detail.glb', 'Tokyo Dome', build({ detail: true }), meta, 40_000, 1536 * 1024)
}
