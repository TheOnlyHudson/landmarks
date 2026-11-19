/**
 * Tokyo Big Sight Conference Tower (東京ビッグサイト 会議棟), Ariake, Koto,
 * Tokyo: procedural, CC0-1.0.  bun generators/tokyo-big-sight.ts
 *
 * The Tokyo International Exhibition Center's conference tower (AXS Satow,
 * 1996): four inverted pyramids clad in titanium panels, each standing on a
 * glazed leg above the Entrance Plaza, the glass block between them showing
 * in the V-shaped notches, and the roof storey with its four white core
 * heads. The exhibition halls around it are separate OSM buildings and are
 * not modelled. Writes the low model and a detail model (drawn from zoom 16)
 * in the same frame.
 *
 * Frame: built turned to bearing 56.7, the outline's side (OSM's square
 * runs at 56.7 and 146.7 degrees), so the square's sides are on the axes.
 * Origin at the centroid of the outline (way/154080988); z = 0 is the
 * ground under the Entrance Plaza.
 *
 * OSM (all replaced):
 * - way/154080988 the outline (会議棟, Conference Tower), a 97.6 m square;
 * - way/543039412 "Entrance Plaza", the same square, 0-8 m: the hall under
 *   the plaza deck the tower stands on;
 * - the pyramids, each as seven square storeys L2-L8 (25-53 m, 4 m each,
 *   15.6 m wide at the bottom to 48.9 m at the top), centred 24.35 m from
 *   the middle along both axes: way/543039423, 428, 422, 427, 425, 426, 429;
 *   543039432, 437, 431, 436, 433, 434, 438; 543039441, 446, 439, 444, 442,
 *   443, 447; 543039448, 453, 449, 455, 454, 451, 457;
 * - way/543039414 the glass block between the pyramids (a 64 m square,
 *   32-53 m); way/154080991 the roof storey (a square turned 45 degrees
 *   whose corners touch the outline's sides, 53-55 m);
 * - way/543039458, 459, 460, 462 "Conference Tower Columns": the white
 *   cores, 10 m square, to 58 m, one up the middle of each pyramid.
 *
 * Published (Wikipedia "Tokyo Big Sight", ja "東京ビッグサイト"): completed
 * 1996, AXS Satow; the conference tower 58 m, 8 storeys.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Tokyo Big Sight -03.jpg" (Aimaimyi, CC BY-SA 3.0): straight on to one
 *   side from the plaza. Scaled at 12 px/m on the 97.6 m width: the legs
 *   13.6 m wide, 18.4 m from the plaza to the pyramids' tips (plaza deck at
 *   8 m: tips at 26 m, OSM 25), the rims 46 m above the plaza (54 m; OSM
 *   53), the core heads to ~59.5 m; the notch's glass gable, and the band
 *   across its foot at 28-34 m with open sky beneath.
 * - "Tokyo Big Sight 20090816.jpg" (Vantey, public domain): from the water,
 *   the whole tower over the halls.
 * - "Tokyo Big Sight 01.jpg" (Zairon, CC BY-SA 4.0): from the north-east
 *   corner, the four legs and the roof storey.
 * - "Tokyo Big Sight conference center.jpg" (Daniel Dobkin, CC BY-SA 4.0)
 *   and "Tokyo Big Sight Conference Tower exterior.png" (Kestrel, CC BY-SA
 *   4.0): the legs' glazing on X-braced frames, the triangular titanium
 *   panels, the rim.
 * - "Tokyo Big Sight 20171001-1.jpg" (ITA-ATU, CC BY-SA 4.0): the roof
 *   storey between two core heads.
 * - "Tokyo Big Sight exterior 2024-02-12.jpg" (Masahiko OHKUBO, CC BY 2.0):
 *   the panels from below.
 * - Night: "Tokyo Big Sight at Night.jpg" (Masato Ohta, CC BY 2.0): the
 *   pyramids floodlit from below, the legs glowing teal-green, the notch's
 *   glazing lit.
 *
 * Measured from OSM: the plan, every height. Estimated from photos: the
 * legs (14.4 m, a little narrower than the pyramids' 15.6 m soles, as the
 * photo shows a ledge), the panel grid (rows ~4 m up the slope, near
 * equilateral triangles, drawn as raised seams), the rim fascia, the
 * roof storey's pavilion (30 m square, to 58.5 m, glazed) and its low hip.
 * Left out: the inclined escalator tube that climbs into the west pyramid
 * from outside the outline, the plaza's canopies and the exhibition halls.
 *
 * Colours: the titanium a warm mid-grey (re-sampled from Aimaimyi's photo:
 * #615d53 to #6a6559 on the shaded undersides; drawn #a3a098, near neutral,
 * since every face looks down and the map shades it; OSM's #c3b08a reads
 * too tan); the leg glazing grey-green (#545c58); the cores
 * white (OSM #f7faff).
 *
 * Doubts: what stands under the plaza deck (the outline is drawn as an 8 m
 * block with glazed bands); the roof storey is seen only from the plaza,
 * and the pavilion's size is a guess from two photos.
 */
import { Part, cross, sub, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, capPoly, rect, writeModel, ccw, type XY, type Layer } from './tokyo-metropolitan-government-building'

const H = 48.9            // half the outline's side
const PC = 24.35          // pyramid centres at (±PC, ±PC)
const Z0 = 25, Z1 = 53    // pyramid sole and rim
const B0 = 7.8, B1 = 24.45 // their half-widths there
const LEG = 7.2           // the legs' half-width
const DECK = 8            // the Entrance Plaza's deck
const half = (z: number) => B0 + ((B1 - B0) * (z - Z0)) / (Z1 - Z0)

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const norm = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
/** A quad wound to face `want`. */
function qo(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), want) >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bevel = 0.3, roof?: Part) =>
  prism(p, rect((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2), z0, z1, { bevel, roof: roof ?? p })

/** Clip the segment a-b (2D) to a convex counter-clockwise polygon. */
function clipSeg(a: [number, number], b: [number, number], poly: [number, number][]): [[number, number], [number, number]] | null {
  let t0 = 0, t1 = 1
  const d = [b[0] - a[0], b[1] - a[1]]
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length]
    const nx = -(q[1] - p[1]), ny = q[0] - p[0] // inward for CCW
    const num = nx * (a[0] - p[0]) + ny * (a[1] - p[1]), den = nx * d[0] + ny * d[1]
    if (Math.abs(den) < 1e-12) { if (num < 0) return null; continue }
    const t = -num / den
    if (den > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t)
    if (t0 >= t1) return null
  }
  return [[a[0] + d[0] * t0, a[1] + d[1] * t0], [a[0] + d[0] * t1, a[1] + d[1] * t1]]
}

type Lod = { detail: boolean }

function build({ detail }: Lod): Layer[] {
  const ti = new Part(), seam = new Part(), white = new Part(), win = new Part(), leg = new Part(), base = new Part()

  // ---- The Entrance Plaza hall under the deck ------------------------------
  box(base, -H, H, -H, H, 0, DECK, 0.4)
  for (const s of [-1, 1]) for (const axis of [0, 1]) {
    // a glazed band round the hall, broken by piers
    const n = detail ? 12 : 6, w = (2 * H - 4) / n
    for (let k = 0; k < n; k++) {
      const u0 = -H + 2 + k * w + 0.6, u1 = u0 + w - 1.2
      const o = s * (H + 0.05)
      const P = (u: number, z: number): V3 => (axis === 0 ? [u, o, z] : [o, u, z])
      qo(win, P(u0, 1.2), P(u1, 1.2), P(u1, 5.6), P(u0, 5.6), axis === 0 ? [0, s, 0] : [s, 0, 0])
    }
  }

  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const cx = sx * PC, cy = sy * PC
    // ---- The leg: glazing on a white frame ---------------------------------
    box(leg, cx - LEG, cx + LEG, cy - LEG, cy + LEG, DECK, Z0, 0.2, white)
    box(white, cx - LEG - 0.4, cx + LEG + 0.4, cy - LEG - 0.4, cy + LEG + 0.4, DECK, DECK + 0.8, 0.15)
    box(white, cx - B0 - 0.2, cx + B0 + 0.2, cy - B0 - 0.2, cy + B0 + 0.2, Z0 - 1.2, Z0, 0.15)
    // the frame: corner posts, a transom at mid-height, X braces on each face
    const fz0 = DECK + 0.8, fz1 = Z0 - 1.2, zm = (fz0 + fz1) / 2
    for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as [number, number][]) {
      const o = LEG + 0.12
      const P = (u: number, z: number): V3 => (nx !== 0 ? [cx + nx * o, cy + u, z] : [cx + u, cy + ny * o, z])
      const want: V3 = [nx, ny, 0]
      const bar = (u0: number, z0: number, u1: number, z1: number, w: number) => {
        const t: V3 = norm(sub(P(u1, z1), P(u0, z0))), side = norm(cross(want, t))
        const a = P(u0, z0), b = P(u1, z1)
        qo(white, add(a, mul(side, -w / 2)), add(a, mul(side, w / 2)), add(b, mul(side, w / 2)), add(b, mul(side, -w / 2)), want)
      }
      const posts = detail ? [-LEG + 0.4, -LEG / 2, 0, LEG / 2, LEG - 0.4] : [-LEG + 0.5, 0, LEG - 0.5]
      for (const u of posts) bar(u, fz0, u, fz1, detail ? 0.45 : 0.8)
      bar(-LEG, zm, LEG, zm, detail ? 0.6 : 0.9)
      if (detail) {
        for (let k = 1; k < 6; k++) { const z = fz0 + ((fz1 - fz0) * k) / 6; if (k !== 3) bar(-LEG, z, LEG, z, 0.2) }
        for (const [z0, z1] of [[fz0, zm], [zm, fz1]]) { bar(-LEG + 0.3, z0, LEG - 0.3, z1, 0.4); bar(LEG - 0.3, z0, -LEG + 0.3, z1, 0.4) }
      }
    }

    // ---- The inverted pyramid ---------------------------------------------
    const C = (x: number, y: number, z: number): V3 => [cx + x, cy + y, z]
    for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as [number, number][]) {
      // the face's corners: (u along the face, z)
      const tx = -ny, ty = nx // along the face
      const P = (u: number, z: number): V3 => { const h = half(z); return C(nx * h + tx * u, ny * h + ty * u, z) }
      const outN = norm([nx * (Z1 - Z0), ny * (Z1 - Z0), -(B1 - B0)])
      qo(ti, P(-B0, Z0), P(B0, Z0), P(B1, Z1), P(-B1, Z1), outN)
      // panel seams: rows up the slope, two families of diagonals
      const rows = detail ? 8 : 4, w = detail ? 0.2 : 0.42
      const slant = Math.hypot(Z1 - Z0, B1 - B0)
      // face coordinates: (u, s) with s the distance up the slope
      const poly: [number, number][] = [[-B0, 0], [B0, 0], [B1, slant], [-B1, slant]]
      const F = (u: number, s: number): V3 => { const z = Z0 + ((Z1 - Z0) * s) / slant; const p = P(u, z); return add(p, mul(outN, 0.05)) }
      const strip = (a: [number, number], b: [number, number]) => {
        const c = clipSeg(a, b, poly); if (!c) return
        const [p, q] = c, du = q[0] - p[0], ds = q[1] - p[1], l = Math.hypot(du, ds); if (l < 0.3) return
        const ou = (-ds / l) * w / 2, os = (du / l) * w / 2
        qo(seam, F(p[0] - ou, p[1] - os), F(q[0] - ou, q[1] - os), F(q[0] + ou, q[1] + os), F(p[0] + ou, p[1] + os), outN)
      }
      const rh = slant / rows, side = (2 * rh) / Math.sqrt(3)
      for (let k = 1; k < rows; k++) strip([-B1 - 1, k * rh], [B1 + 1, k * rh])
      for (let k = -40; k <= 40; k++) {
        const u = k * side
        const L = slant + 2
        const du = (L * side) / (2 * rh)
        strip([u - du, -1], [u + du, L]); strip([u + du, -1], [u - du, L])
      }
    }
    // sole and rim
    capPoly(white, rect(cx, cy, B0, B0), Z0 - 0.01, false)
    // the rim fascia: a band standing just proud of the top edge
    for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as [number, number][]) {
      const o = B1 + 0.25, tx = -ny, ty = nx
      const P = (u: number, z: number): V3 => C(nx * o + tx * u, ny * o + ty * u, z)
      qo(ti, P(-o, Z1 - 1.1), P(o, Z1 - 1.1), P(o, Z1 + 0.6), P(-o, Z1 + 0.6), [nx, ny, 0])
      qo(white, P(-o, Z1 - 1.1), P(o, Z1 - 1.1), C(nx * half(Z1 - 1.1) + tx * o, ny * half(Z1 - 1.1) + ty * o, Z1 - 1.1), C(nx * half(Z1 - 1.1) - tx * o, ny * half(Z1 - 1.1) - ty * o, Z1 - 1.1), [0, 0, -1])
    }
    // the roof over the pyramid
    capPoly(base, rect(cx, cy, B1 + 0.25, B1 + 0.25), Z1 + 0.6)
    // ---- The core head on top -------------------------------------------
    box(white, cx - 5, cx + 5, cy - 5, cy + 5, Z1 + 0.6, 59.5, 0.25)
    if (detail) for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as [number, number][]) for (const u of [-2.5, 0, 2.5]) {
      const o = 5.04, P = (z: number, du: number): V3 => (nx !== 0 ? [cx + nx * o, cy + u + du, z] : [cx + u + du, cy + ny * o, z])
      qo(seam, P(Z1 + 1.5, -0.12), P(Z1 + 1.5, 0.12), P(58.8, 0.12), P(58.8, -0.12), [nx, ny, 0])
    }
  }

  // ---- The glass block in the notches --------------------------------------
  const G = 32, GZ0 = 32, GZ1 = Z1
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as [number, number][]) {
    // only the strip that shows between the pyramids: |u| < PC - half(z)
    const tx = -ny, ty = nx
    const P = (u: number, z: number): V3 => [nx * G + tx * u, ny * G + ty * u, z]
    const zs = detail ? [GZ0, 37, 42, 47, GZ1] : [GZ0, 42.5, GZ1]
    for (let k = 0; k < zs.length - 1; k++) {
      const za = zs[k], zb = zs[k + 1]
      const ua = Math.max(0.2, PC - half(za)) + 0.6, ub = Math.max(0.2, PC - half(zb)) + 0.6
      const pts = [P(-ua, za), P(ua, za), P(ub, zb), P(-ub, zb)]
      qo(win, pts[0], pts[1], pts[2], pts[3], [nx, ny, 0])
      // floor bands across the glazing
      if (detail && k > 0) qo(white, add(P(-ua, za - 0.35), [nx * 0.05, ny * 0.05, 0]), add(P(ua, za - 0.35), [nx * 0.05, ny * 0.05, 0]), add(P(ua, za + 0.35), [nx * 0.05, ny * 0.05, 0]), add(P(-ua, za + 0.35), [nx * 0.05, ny * 0.05, 0]), [nx, ny, 0])
    }
    // the band across the notch's foot, and its soffit
    const ub = PC - half(GZ0) + 1
    qo(white, P(-ub, GZ0 - 3.5), P(ub, GZ0 - 3.5), P(ub, GZ0 + 1.5), P(-ub, GZ0 + 1.5), [nx, ny, 0])
  }
  // the block's underside between the pyramids, and the band's
  capPoly(white, rect(0, 0, G, G), GZ0 - 3.5, false)

  // ---- The roof storey -------------------------------------------------------
  const diamond: XY[] = ccw([[H, 0], [0, H], [-H, 0], [0, -H]])
  prism(white, diamond.map(([x, y]) => [x * 0.985, y * 0.985] as XY), Z1 + 0.6, 55, { bevel: 0.2, roof: base })
  // the pavilion, glazed, under a low hip
  box(white, -15, 15, -15, 15, 55, 57.5, 0.3, base)
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as [number, number][]) {
    const n = detail ? 8 : 3, tx = -ny, ty = nx
    for (let k = 0; k < n; k++) {
      const u0 = -14 + (28 * k) / n + 0.4, u1 = -14 + (28 * (k + 1)) / n - 0.4
      const P = (u: number, z: number): V3 => [nx * 15.06 + tx * u, ny * 15.06 + ty * u, z]
      qo(win, P(u0, 55.6), P(u1, 55.6), P(u1, 57.0), P(u0, 57.0), [nx, ny, 0])
    }
    const P = (u: number, z: number, o = 15.6): V3 => [nx * o + tx * u, ny * o + ty * u, z]
    qo(base, P(-15.6, 57.5), P(15.6, 57.5), P(2, 61.5, 2), P(-2, 61.5, 2), [nx * 4, ny * 4, 13.6])
  }
  capPoly(base, rect(0, 0, 2, 2), 61.5)

  const floodTi = (_p: V3, n: V3) => (n[2] < -0.05 ? 0.9 : n[2] > 0.7 ? 0.15 : 0.5)
  return [
    { part: ti, material: { ...finish('bigsight-titanium', 0xa3a098, 0.5), floodlight: floodTi } as MaterialSpec },
    { part: seam, material: finish('bigsight-seam', 0x77756f) },
    { part: white, material: { ...finish('bigsight-white', 0xe9ebe8), floodlight: (_p: V3, n: V3) => (n[2] < -0.5 ? 0.6 : 0.3) } as MaterialSpec },
    { part: win, material: { ...PALETTE.window, color: 0x6b7f8a } },
    { part: leg, material: finish('neon-bigsight-teal', 0x7c9a93, 0.3) },
    { part: base, material: finish('bigsight-roof', 0xaeb1af) },
  ]
}

if (import.meta.main) {
  const meta = { bearing: 56.7, elevation: 0, height: 61 }
  await writeModel('tokyo-big-sight', 'tokyo-big-sight.glb', 'Tokyo Big Sight Conference Tower', build({ detail: false }), meta, 5000, 250 * 1024)
  await writeModel('tokyo-big-sight', 'tokyo-big-sight.detail.glb', 'Tokyo Big Sight Conference Tower', build({ detail: true }), meta, 40000, 1536 * 1024)
}
