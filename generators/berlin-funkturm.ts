/**
 * Funkturm Berlin, Messegelände, Charlottenburg-Westend (Heinrich Straumer,
 * 1924-26): procedural, CC0-1.0, no textures. bun generators/berlin-funkturm.ts
 *
 * Writes models/berlin-funkturm.glb (low) and models/berlin-funkturm.detail.glb
 * (detail: the full lattice with its secondary diamonds, the inner lift and
 * stair shaft with its zig-zag flights, railings, the mast's aerials).
 *
 * Map frame: x east, y north, z up, metres, turned to BEARING 14.3 (the
 * tower's square faces in OSM way/30926247): model +y is compass 14.3.
 * Anchor: the area centroid of way/30926247, lng 13.278138, lat 52.505023.
 * z = 0 is the plaza; the legs stand on 1 m concrete pedestals.
 *
 * What makes it the Funkturm, and how each is drawn
 * - A slender square steel lattice tower, splayed on four legs at the foot,
 *   tapering steadily to the top. Every member is real 3D: four corner legs,
 *   horizontal struts at each panel and X bracing on every face (detail
 *   adds the secondary diamond in each panel and the central shaft).
 * - The restaurant at 52-55.5 m: a glazed two-level box on the shaft, the
 *   upper level a wide square overhang with a sloping soffit and an
 *   outward-leaning fascia with its band of windows, a flat dark roof.
 * - The observation deck at 121.5-127 m: a smaller glazed square with a
 *   sloped underside and a projecting roof, a small cabin over it, and the
 *   short lattice mast with its antenna to 146.8 m.
 * - Pale silver-grey paint on the steel; cream-white restaurant and deck.
 *
 * Evidence
 * - OSM (ODbL): way/30926247 (building=tower, man_made=tower, "Funkturm
 *   Berlin", height=147, tower:construction=lattice, wikidata Q699724); its
 *   parts: tower body way/288498853 (1-146.78 m, 22 m square at the foot),
 *   restaurant roof slab way/288498851 (55-55.5, 23 m square), restaurant
 *   glazing way/288498854 (51.65-55) and way/288498855 (48.12-51.65),
 *   deck glazing way/288498852 (121.5-124), deck roof way/288498850
 *   (124-127, 10 m square), the four concrete leg pedestals way/288498856
 *   to /859 (0-1 m).
 * - Published (de.wikipedia "Berliner Funkturm"): 146.78 m with the
 *   antenna (150 m originally quoted), steel lattice 1924-26, 600 t, the
 *   restaurant at 55 m, the observation deck at 124 m.
 * - Photos (Wikimedia Commons), each as evidence:
 *   "Berliner Funkturm Blauer Himmel.jpg", Jojoo64, CC BY-SA 4.0 (whole
 *     tower from the foot: leg splay, panel rhythm, restaurant, deck)
 *     https://commons.wikimedia.org/wiki/File:Berliner_Funkturm_Blauer_Himmel.jpg
 *   "Berliner Funkturm from the Drachenberg 05.jpg", Leonhard Lenz, CC BY-SA
 *     4.0 (the tower square on from far off: widths at each level)
 *     https://commons.wikimedia.org/wiki/File:Berliner_Funkturm_from_the_Drachenberg_05.jpg
 *   "Berliner Funkturm Details 02.jpg", H.Helmlechner, CC BY-SA 4.0 (the
 *     restaurant close up: soffit, fascia windows, lower glazed box)
 *     https://commons.wikimedia.org/wiki/File:Berliner_Funkturm_Details_02.jpg
 *   "Berliner Funkturm Details 04.jpg", H.Helmlechner, CC BY-SA 4.0 (the
 *     foot: legs, pedestals, stair, lift shaft)
 *     https://commons.wikimedia.org/wiki/File:Berliner_Funkturm_Details_04.jpg
 *   "Funkturm Berlin View 05.jpg" and "View 06.jpg", A.Savin, CC BY-SA 3.0
 *   "Berlin Funkturm 2026-04-01 img01.jpg", LarsMueller, CC0
 *   "Funkturm Berlin at night 2025-04-12 01.jpg", Leonhard Lenz, CC0 (night:
 *     the whole lattice floodlit, the restaurant and deck lit)
 *     https://commons.wikimedia.org/wiki/File:Funkturm_Berlin_at_night_2025-04-12_01.jpg
 * - Measured from the Lenz Drachenberg photo (14.7 px/m, the 66 m between
 *   the restaurant roof and the deck as scale): shaft 10.9 m wide at 55.5,
 *   6.1 m at 121.5; restaurant overhang 24 m, lower box 13 m; deck 10 m;
 *   cabin 5.5 m; mast to 136, antenna to 146.8 (published). From the
 *   Jojoo64 photo: the shaft under the restaurant 0.63 of the foot; the foot
 *   18 m between leg centres (OSM pedestals: 12.8 m from the centre on the
 *   diagonals); nine panels above the restaurant, five below.
 * - Estimated: member sizes (legs 0.7 m, braces 0.3-0.4 m, drawn a little
 *   heavier than real); the soffit and fascia slopes.
 * - Look-only references: none.
 * - Doubts: the inner stair is drawn as a simple zig-zag; the kiosk at the
 *   foot (a separate building) is not modelled.
 *
 * Night: the lattice is floodlit (`_FLOODLIGHT`); the restaurant and deck
 * windows glow.
 */
import { Part, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { mat } from './berlin-konzerthaus'

export const ID = 'berlin-funkturm'
export const BEARING = 14.3

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const scl = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const nrm = (a: V3): V3 => scl(a, 1 / (Math.hypot(...a) || 1))
const lerp3 = (a: V3, b: V3, t: number): V3 => add(a, scl(subv(b, a), t))

/**
 * A square-section member from A to B, `w` wide, its faces turned to `up`
 * (the face normal it should share with the lattice face). Capped.
 */
function beam(p: Part, A: V3, B: V3, w: number, up: V3 = [0, 0, 1], caps = true) {
  const d = nrm(subv(B, A))
  let u = crs(d, up)
  if (Math.hypot(...u) < 1e-3) u = crs(d, [1, 0, 0])
  u = scl(nrm(u), w / 2)
  const v = scl(nrm(crs(u, d)), w / 2)
  const ring = (c: V3): V3[] => [add(add(c, u), v), add(subv(c, u), v), subv(subv(c, u), v), subv(add(c, u), v)]
  const a = ring(A), b = ring(B)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const n = nrm(add(subv(a[i], A), subv(a[j], A)))
    const q = [a[i], a[j], b[j], b[i]]
    const g = crs(subv(q[1], q[0]), subv(q[2], q[0]))
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.quad(q[0], q[1], q[2], q[3])
    else p.quad(q[3], q[2], q[1], q[0])
  }
  if (caps) {
    const cap = (r: V3[], out: V3) => {
      const g = crs(subv(r[1], r[0]), subv(r[2], r[0]))
      if (g[0] * out[0] + g[1] * out[1] + g[2] * out[2] >= 0) p.quad(r[0], r[1], r[2], r[3])
      else p.quad(r[3], r[2], r[1], r[0])
    }
    cap(a, scl(d, -1))
    cap(b, d)
  }
}

/** A box, counter-clockwise rings; `bottom` caps the underside too. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  frustum(p, [x0, y0, x1, y1], [x0, y0, x1, y1], z0, z1, true, bottom)
}
/** A square-ish frustum between two rectangles [x0,y0,x1,y1]. */
function frustum(p: Part, r0: number[], r1: number[], z0: number, z1: number, top = true, bottom = false) {
  const ring = (r: number[], z: number): V3[] => [[r[0], r[1], z], [r[2], r[1], z], [r[2], r[3], z], [r[0], r[3], z]]
  const a = ring(r0, z0), b = ring(r1, z1)
  p.loft([a, b])
  if (top) p.cap(b, true)
  if (bottom) p.cap(a, false)
}
const sq = (h: number) => [-h, -h, h, h]

// Heights (see header).
const Z_PED = 1.0
const Z_REST0 = 48.1, Z_REST1 = 51.6, Z_SOFF = 52.7, Z_ROOF = 55.5
const Z_DECK0 = 119.0, Z_DECK1 = 121.5, Z_DECK2 = 124.0, Z_DECK3 = 124.7, Z_CAB = 127.5
const Z_MAST = 136.0, Z_TOP = 146.8

/** Half the width between leg centres at height z. */
function half(z: number) {
  if (z <= 52) return 9.0 + ((5.6 - 9.0) * (z - Z_PED)) / (52 - Z_PED)
  return 5.6 + ((3.05 - 5.6) * (z - 52)) / (Z_DECK1 - 52)
}
const corner = (z: number, sx: number, sy: number): V3 => [sx * half(z), sy * half(z), z]
const CORNERS: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]

/** Panel levels: five below the restaurant, nine above to the deck. */
const LEVELS = [Z_PED, 10.4, 19.8, 29.2, 38.6, Z_REST0,
  ...Array.from({ length: 10 }, (_, i) => Z_ROOF + ((Z_DECK0 - Z_ROOF) * i) / 9)]

function lattice(steel: Part, detail: boolean) {
  const W = detail ? { leg: 0.75, brace: 0.32, strut: 0.34, sec: 0.2 } : { leg: 0.8, brace: 0.42, strut: 0.42, sec: 0 }
  // Legs, kinked at each level so they follow the taper.
  for (const [sx, sy] of CORNERS) {
    const zs = [Z_PED, ...LEVELS.slice(1, 6), 52, Z_ROOF, ...LEVELS.slice(7), Z_DECK1]
    for (let i = 0; i < zs.length - 1; i++) beam(steel, corner(zs[i], sx, sy), corner(zs[i + 1], sx, sy), W.leg, [sx, sy, 0])
  }
  // Each face: struts at every level, X bracing in every panel.
  for (let f = 0; f < 4; f++) {
    const [ax, ay] = CORNERS[f], [bx, by] = CORNERS[(f + 1) % 4]
    const out: V3 = [(ax + bx) / 2, (ay + by) / 2, 0]
    for (let i = 0; i < LEVELS.length; i++) {
      const z = LEVELS[i]
      if (i !== 5 && i !== 6) beam(steel, corner(z, ax, ay), corner(z, bx, by), W.strut, out)
      if (i === LEVELS.length - 1 || i === 5) continue
      const z1 = LEVELS[i + 1]
      const A0 = corner(z, ax, ay), B0 = corner(z, bx, by), A1 = corner(z1, ax, ay), B1 = corner(z1, bx, by)
      beam(steel, A0, B1, W.brace, out)
      beam(steel, B0, A1, W.brace, out)
      if (detail) {
        // The secondary diamond joining the panel's edge midpoints.
        const m = [lerp3(A0, B0, 0.5), lerp3(B0, B1, 0.5), lerp3(A1, B1, 0.5), lerp3(A0, A1, 0.5)]
        for (let k = 0; k < 4; k++) beam(steel, m[k], m[(k + 1) % 4], W.sec, out)
      }
    }
  }
  // Under the restaurant the shaft carries on inside the lower box (48-52).
  // Horizontal diaphragm bracing at the deck's foot.
  for (let f = 0; f < 2; f++) {
    const z = Z_ROOF
    const [ax, ay] = CORNERS[f], [cx, cy] = CORNERS[f + 2]
    beam(steel, corner(z, ax, ay), corner(z, cx, cy), W.strut, [0, 0, 1])
  }
}

/** The lift and stair shaft up the middle, with its zig-zag flights (detail only). */
function shaft(steel: Part) {
  const h = 1.3
  for (const [sx, sy] of CORNERS) beam(steel, [sx * h, sy * h, Z_PED], [sx * h, sy * h, Z_DECK0], 0.22, [sx, sy, 0])
  for (let z = Z_PED + 4; z < Z_DECK0; z += 4) for (let f = 0; f < 4; f++) {
    const [ax, ay] = CORNERS[f], [bx, by] = CORNERS[(f + 1) % 4]
    beam(steel, [ax * h, ay * h, z], [bx * h, by * h, z], 0.16, [(ax + bx) / 2, (ay + by) / 2, 0])
  }
  // Flights: on alternating sides of the shaft, a landing each 4 m.
  let s = 1
  for (let z = Z_PED; z < Z_DECK0 - 4; z += 4) {
    if (z > Z_REST0 - 4 && z < Z_ROOF) { s = -s; continue }
    const x0 = 1.5, x1 = Math.min(half(z + 4) - 0.8, 3.6)
    const A: V3 = [x0, s * -1.6, z], B: V3 = [x0, s * 1.6, z + 4]
    beam(steel, [x0 + 0.5 * (x1 - x0), A[1], A[2]], [x0 + 0.5 * (x1 - x0), B[1], B[2]], 0.5, [1, 0, 0])
    s = -s
  }
}

function restaurant(stone: Part, win: Part, roof: Part, steel: Part, detail: boolean) {
  // Lower glazed box.
  box(stone, -6.5, -6.5, 6.5, 6.5, Z_REST0, Z_REST0 + 0.5, true)
  box(stone, -6.5, -6.5, 6.5, 6.5, Z_REST0 + 0.5, Z_REST0 + 1.6)
  box(win, -6.45, -6.45, 6.45, 6.45, Z_REST0 + 1.6, Z_REST1 - 0.6)
  box(stone, -6.5, -6.5, 6.5, 6.5, Z_REST1 - 0.6, Z_REST1)
  // The soffit sloping out to the overhang's edge, the fascia leaning out.
  frustum(stone, sq(6.5), sq(11.0), Z_REST1, Z_SOFF, false)
  const fz = [Z_SOFF, Z_SOFF + 1.2, Z_ROOF - 0.55, Z_ROOF]
  const fh = (z: number) => 11.0 + ((12.2 - 11.0) * (z - Z_SOFF)) / (Z_ROOF - Z_SOFF)
  frustum(stone, sq(fh(fz[0])), sq(fh(fz[1])), fz[0], fz[1], false)
  frustum(win, sq(fh(fz[1]) + 0.02), sq(fh(fz[2]) + 0.02), fz[1], fz[2], false)
  frustum(stone, sq(fh(fz[2])), sq(fh(fz[3])), fz[2], fz[3], false)
  // The flat roof, a little parapet lip.
  frustum(roof, sq(12.2), sq(12.2), Z_ROOF, Z_ROOF + 0.15, true)
  if (detail) {
    // Mullions on the fascia band and the roof railing.
    for (let f = 0; f < 4; f++) {
      const rot = (p: V3): V3 => f === 0 ? p : f === 1 ? [-p[1], p[0], p[2]] : f === 2 ? [-p[0], -p[1], p[2]] : [p[1], -p[0], p[2]]
      for (let i = -11; i <= 11; i += 1.4) {
        const a: V3 = [i * fh(fz[1]) / 12.2, -fh(fz[1]) - 0.03, fz[1]], b: V3 = [i * fh(fz[2]) / 12.2, -fh(fz[2]) - 0.03, fz[2]]
        beam(stone, rot(a), rot(b), 0.12, [0, -1, 0], false)
      }
      beam(steel, rot([-12.0, -12.0, Z_ROOF + 1.1]), rot([12.0, -12.0, Z_ROOF + 1.1]), 0.08, [0, -1, 0])
      for (let i = -12; i <= 12; i += 2) beam(steel, rot([i, -12.0, Z_ROOF + 0.15]), rot([i, -12.0, Z_ROOF + 1.1]), 0.07, [0, -1, 0], false)
      for (let i = -6; i <= 6; i += 1.3) beam(stone, rot([i, -6.47, Z_REST0 + 1.6]), rot([i, -6.47, Z_REST1 - 0.6]), 0.1, [0, -1, 0], false)
    }
  }
}

function deck(stone: Part, win: Part, roof: Part, steel: Part, detail: boolean) {
  // Sloped underside from the shaft out to the glazed band.
  frustum(stone, sq(3.0), sq(5.0), Z_DECK0, Z_DECK1, false, true)
  box(stone, -5.0, -5.0, 5.0, 5.0, Z_DECK1, Z_DECK1 + 0.6)
  box(win, -4.95, -4.95, 4.95, 4.95, Z_DECK1 + 0.6, Z_DECK2 - 0.5)
  box(stone, -5.0, -5.0, 5.0, 5.0, Z_DECK2 - 0.5, Z_DECK2)
  // The projecting roof (the open platform).
  box(stone, -5.6, -5.6, 5.6, 5.6, Z_DECK2, Z_DECK3, true)
  frustum(roof, sq(5.5), sq(5.5), Z_DECK3, Z_DECK3 + 0.05)
  // The cabin over it.
  box(stone, -2.8, -2.8, 2.8, 2.8, Z_DECK3, Z_DECK3 + 1.0)
  box(win, -2.75, -2.75, 2.75, 2.75, Z_DECK3 + 1.0, Z_CAB - 0.9)
  box(stone, -2.8, -2.8, 2.8, 2.8, Z_CAB - 0.9, Z_CAB - 0.5)
  box(roof, -3.0, -3.0, 3.0, 3.0, Z_CAB - 0.5, Z_CAB)
  // The mast: a small tapering lattice, then the antenna.
  const mh = (z: number) => 1.2 + ((0.55 - 1.2) * (z - Z_CAB)) / (Z_MAST - Z_CAB)
  for (const [sx, sy] of CORNERS) beam(steel, [sx * mh(Z_CAB), sy * mh(Z_CAB), Z_CAB], [sx * mh(Z_MAST), sy * mh(Z_MAST), Z_MAST], detail ? 0.22 : 0.3, [sx, sy, 0])
  const step = detail ? 1.5 : 3
  for (let z = Z_CAB; z < Z_MAST - 0.1; z += step) for (let f = 0; f < 4; f++) {
    const [ax, ay] = CORNERS[f], [bx, by] = CORNERS[(f + 1) % 4]
    beam(steel, [ax * mh(z), ay * mh(z), z], [bx * mh(z + step), by * mh(z + step), Math.min(z + step, Z_MAST)], detail ? 0.12 : 0.2, [(ax + bx) / 2, (ay + by) / 2, 0])
  }
  beam(steel, [0, 0, Z_MAST - 1], [0, 0, Z_TOP], detail ? 0.32 : 0.4)
  if (detail) {
    // Crossbars and dipoles on the antenna; the deck railings.
    for (const z of [139, 141.5, 144]) {
      beam(steel, [-1.1, 0, z], [1.1, 0, z], 0.1)
      beam(steel, [0, -1.1, z], [0, 1.1, z], 0.1)
    }
    for (const [sx, sy] of CORNERS) beam(steel, [sx * 2.4, sy * 2.4, Z_CAB], [sx * 2.4, sy * 2.4, Z_CAB + 3.5], 0.1)
    for (let f = 0; f < 4; f++) {
      const rot = (p: V3): V3 => f === 0 ? p : f === 1 ? [-p[1], p[0], p[2]] : f === 2 ? [-p[0], -p[1], p[2]] : [p[1], -p[0], p[2]]
      beam(steel, rot([-5.5, -5.5, Z_DECK3 + 1.1]), rot([5.5, -5.5, Z_DECK3 + 1.1]), 0.08, [0, -1, 0])
      for (let i = -5.5; i <= 5.5; i += 1.375) beam(steel, rot([i, -5.5, Z_DECK3]), rot([i, -5.5, Z_DECK3 + 1.1]), 0.07, [0, -1, 0], false)
      for (let i = -4.5; i <= 4.5; i += 1.5) beam(stone, rot([i, -5.02, Z_DECK1 + 0.6]), rot([i, -5.02, Z_DECK2 - 0.5]), 0.12, [0, -1, 0], false)
    }
  }
}

function pedestals(stone: Part) {
  for (const [sx, sy] of CORNERS) {
    const c = corner(Z_PED, sx, sy)
    box(stone, c[0] - 1.8, c[1] - 1.8, c[0] + 1.8, c[1] + 1.8, 0, Z_PED)
  }
}

function build(detail: boolean) {
  const steel = new Part(), stone = new Part(), win = new Part(), roof = new Part()
  lattice(steel, detail)
  if (detail) shaft(steel)
  restaurant(stone, win, roof, steel, detail)
  deck(stone, win, roof, steel, detail)
  pedestals(stone)
  return { steel, stone, win, roof }
}

function write(detail: boolean) {
  const { steel, stone, win, roof } = build(detail)
  // Floodlit from the foot and from the restaurant roof.
  const lit = (p: V3) => (p[2] < Z_DECK1 ? 0.9 : 0.6)
  writeModel('Funkturm Berlin', ID, [
    { part: steel, material: { ...mat('funkturm-steel', 0xc3c8cc, 0.6), floodlight: lit } },
    { part: stone, material: mat('stone', 0xe8e4da) },
    { part: win, material: mat('window', 0x64798a, 0.35) },
    { part: roof, material: mat('roof', 0x7c8287) },
  ], { bearing: BEARING, osm: 'way/30926247', height: Z_TOP }, detail ? 40000 : 5000, detail ? `${ID}.detail` : ID)
}

if (import.meta.main) {
  write(false)
  write(true)
}
