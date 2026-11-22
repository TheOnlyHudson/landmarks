/**
 * Beehive House (1854, Truman O. Angell), 67 East South Temple, Salt Lake
 * City: Brigham Young's official residence. Procedural, CC0-1.0.
 * bun generators/slc-beehive-house.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin: the area
 * centroid of OSM way/33167760 (-111.8886444, 40.7697043). y = 0 is the
 * lowest ground under the outline (Mapterhorn: the south-west corner by the
 * Lion House); the main house's front ground stands about 1.0 m higher
 * (terrain grid), so its doors and sills start at G = 1.0.
 *
 * Form, from the photos: the main house is a two-storey cream stucco block
 * with a white two-storey veranda across the south front and down the east
 * side (square white columns, a solid-reading white balustrade at the upper
 * floor, an entablature), dark green shutters on every front window, a
 * grey hipped roof rising to a flat-topped attic band with Greek-key
 * frieze panels, a widow's-walk deck and, in the middle, the white
 * square lantern capped by the gilded-white beehive dome. Two pale
 * chimneys rise at the ends. Behind it the two-storey north wing with a
 * steep gable and tall gabled dormers, a single-storey porch on its east
 * side; west of it the lower 1½-storey office and link wing (two south-
 * facing gables) with a single-storey veranda, joining the Lion House.
 *
 * Heights: HABS UT-18-SALCI-1 sheet 10 (section, 1934): floor-to-floor
 * 11'5" and 14'9", attic 11'0" to the "pent house floor" (published by
 * HABS, read off the dimension lines): veranda top 7.4 m, main eaves 8.0 m,
 * deck 11.7 m above the front ground; the lantern ~3.0 m and the beehive
 * 1.2 m (sheet 7, "penthouse details", 3'11" beehive). Plan from OSM
 * (outline includes the verandas); wall lines inside it estimated from the
 * photos (main walls 14 m wide, veranda depth 2.8 m). Wings' heights
 * estimated from p3 against the main eaves. The north wing: eaves G + 6.4,
 * ridge G + 9.6 (p2: the gable apex about 1.35 times the eave height, a
 * ~35 degree pitch); it stays under the main hip (top G + 10.6) and is
 * hidden behind it from the south, as in p1 and p3. Chimneys to ~3 m above the deck
 * (p1, p3).
 * Left out: the iron cresting on the deck, balusters, porch brackets,
 * window muntins, the fence.
 *
 * Photos (EVIDENCE):
 *  p1 https://commons.wikimedia.org/wiki/File:Beehive_House_-_Salt_Lake_City,_Utah_-_2_May_2020.jpg
 *     Beneathtimp, CC0 (south front, straight on)
 *  p2 https://commons.wikimedia.org/wiki/File:Beehive_Hse_(5-17-24)_5231.jpg
 *     Chris Light, CC BY-SA 4.0 (north wing from the north-east, 2024, during restoration)
 *  p3 https://commons.wikimedia.org/wiki/File:Beehive_house_complex,_Salt_Lake_City,_Utah.jpg
 *     David Jay Fullmer, CC BY-SA 4.0 (the south front and west wings from the south-west)
 * Drawings (EVIDENCE, public domain): HABS UTAH,18-SALCI,1- sheets 7 and 10,
 *  https://commons.wikimedia.org/wiki/File:Beehive_House,_East_South_Temple_Street,_Salt_Lake_City,_Salt_Lake_County,_UT_HABS_UTAH,18-SALCI,1-_(sheet_10_of_13).png
 * Lidar: not used.
 * Doubts: the north wing's west side and the north end are seen in no photo
 * (modelled plain); the 2024 restoration repainted the stucco a greyer
 * cream (p2) than p1's warm cream; the colour is a pale grey-white with a
 * little cream, nearer the 2024 paint.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

export type XY = [number, number]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** Walls of a ring (counter-clockwise), split into pieces of at most 5 m so they follow the terrain. */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % n]
    const k = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 5))
    for (let s = 0; s < k; s++) {
      const u0 = s / k, u1 = (s + 1) / k
      const x0 = ax + (bx - ax) * u0, y0 = ay + (by - ay) * u0, x1 = ax + (bx - ax) * u1, y1 = ay + (by - ay) * u1
      p.quad([x0, y0, z0], [x1, y1, z0], [x1, y1, z1], [x0, y0, z1])
    }
  }
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
export const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) =>
  prism(p, rect(x0, y0, x1, y1), z0, z1, true, bottom)
/** A gabled roof over a rectangle, ridge along x ('x') or y; gable triangles go to `gab`. */
export function gable(rf: Part, gab: Part | null, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, axis: 'x' | 'y', ov = 0.4) {
  if (axis === 'x') {
    const yc = (y0 + y1) / 2, h = (y1 - y0) / 2, dz = ((zr - ze) * ov) / h
    for (const s of [-1, 1]) {
      const q: V3[] = [[x0 - ov, yc + s * (h + ov), ze - dz], [x1 + ov, yc + s * (h + ov), ze - dz], [x1 + ov, yc, zr], [x0 - ov, yc, zr]]
      poly(rf, q, [0, s, 1]); poly(rf, q, [0, -s, -1])
    }
    if (gab) for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) poly(gab, [[x, y0, ze], [x, y1, ze], [x, yc, zr]], [s, 0, 0])
  } else {
    const xc = (x0 + x1) / 2, h = (x1 - x0) / 2, dz = ((zr - ze) * ov) / h
    for (const s of [-1, 1]) {
      const q: V3[] = [[xc + s * (h + ov), y0 - ov, ze - dz], [xc + s * (h + ov), y1 + ov, ze - dz], [xc, y1 + ov, zr], [xc, y0 - ov, zr]]
      poly(rf, q, [s, 0, 1]); poly(rf, q, [-s, 0, -1])
    }
    if (gab) for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) poly(gab, [[x0, y, ze], [x1, y, ze], [xc, y, zr]], [0, s, 0])
  }
}
/** A hipped roof from a rectangle at ze up to an inset flat top at zt (inset d). */
export function hip(rf: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zt: number, d: number, top = true) {
  const a: V3[] = [[x0, y0, ze], [x1, y0, ze], [x1, y1, ze], [x0, y1, ze]]
  const b: V3[] = [[x0 + d, y0 + d, zt], [x1 - d, y0 + d, zt], [x1 - d, y1 - d, zt], [x0 + d, y1 - d, zt]]
  const ns: V3[] = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]]
  for (let i = 0; i < 4; i++) poly(rf, [a[i], a[(i + 1) % 4], b[(i + 1) % 4], b[i]], ns[i])
  if (top) poly(rf, b, [0, 0, 1])
}
export type Face = 'S' | 'N' | 'E' | 'W'
export const NRM: Record<Face, XY> = { S: [0, -1], N: [0, 1], E: [1, 0], W: [-1, 0] }
/** A flat shape on a wall: `face` and its plane coordinate, centre `u` along it (x for S/N, y for E/W). */
export function panel(p: Part, face: Face, plane: number, u: number, w: number, z0: number, z1: number, head: 'flat' | 'round' | 'pointed' = 'flat', off = 0.05) {
  const n = NRM[face]
  const at = (s: number, z: number): V3 => (face === 'S' || face === 'N' ? [u + s, plane + n[1] * off, z] : [plane + n[0] * off, u + s, z])
  const nn: V3 = [n[0], n[1], 0], r = w / 2
  if (head === 'flat') return poly(p, [at(-r, z0), at(r, z0), at(r, z1), at(-r, z1)], nn)
  const pts: V3[] = [at(-r, z0), at(r, z0)]
  const seg = 8
  if (head === 'round') {
    const zs = z1 - r
    for (let k = 0; k <= seg; k++) { const a = (k / seg) * Math.PI; pts.push(at(r * Math.cos(a), zs + r * Math.sin(a))) }
  } else {
    const zs = z1 - w * Math.sin(Math.PI / 3)
    for (let k = 0; k <= seg / 2; k++) { const a = (k / (seg / 2)) * (Math.PI / 3); pts.push(at(-r + w * Math.cos(a), zs + w * Math.sin(a))) }
    for (let k = 1; k <= seg / 2; k++) { const a = Math.PI / 3 + (k / (seg / 2)) * (Math.PI / 3); pts.push(at(r + w * Math.cos(a), zs + w * Math.sin(a))) }
  }
  poly(p, pts, nn)
}

// The build runs only when this file is run directly; the helpers above are
// shared with slc-lion-house.ts, slc-church-administration-building.ts,
// slc-conference-center.ts and slc-eagle-gate.ts.
if (import.meta.main) {
  const stucco = new Part(), white = new Part(), roof = new Part(), win = new Part(), shutter = new Part(), door = new Part()
  const G = 1.0 // front ground of the main house above y = 0

  /** A shuttered sash window: white surround, window panel, green shutters each side. */
  function sash(face: Face, plane: number, u: number, z0: number, z1: number, w = 1.05, shutters = true) {
    panel(white, face, plane, u, w + 0.36, z0 - 0.2, z1 + 0.3, 'flat', 0.03)
    panel(win, face, plane, u, w, z0, z1, 'flat', 0.06)
    if (shutters) for (const s of [-1, 1]) panel(shutter, face, plane, u + s * (w / 2 + 0.38), 0.55, z0, z1, 'flat', 0.06)
  }

  // ---------------------------------------------------------- main house ---
  const MX0 = -3.4, MX1 = 10.6, MY0 = -10.0, MY1 = 1.2
  const Z_EAVE = G + 8.0, Z_DECK = G + 11.7
  prism(stucco, rect(MX0, MY0, MX1, MY1), 0, Z_EAVE, false)
  // the main cornice: a white band all round
  box(white, MX0 - 0.35, MY0 - 0.35, MX1 + 0.35, MY1 + 0.35, Z_EAVE - 0.5, Z_EAVE, true)
  // grey hipped roof up to the attic band
  hip(roof, MX0 - 0.35, MY0 - 0.35, MX1 + 0.35, MY1 + 0.35, Z_EAVE, Z_DECK - 1.1, 2.6, false)
  // the attic band with its Greek-key panels (frieze windows), and the deck
  const AX0 = MX0 + 2.25, AX1 = MX1 - 2.25, AY0 = MY0 + 2.25, AY1 = MY1 - 2.25
  box(white, AX0, AY0, AX1, AY1, Z_DECK - 1.6, Z_DECK - 0.15)
  box(white, AX0 - 0.25, AY0 - 0.25, AX1 + 0.25, AY1 + 0.25, Z_DECK - 0.15, Z_DECK, true)
  for (const u of [-0.6, 2.4, 5.4, 8.4]) {
    panel(stucco, 'S', AY0, u - 0.6 + 0.75, 0.9, Z_DECK - 1.35, Z_DECK - 0.45, 'flat', 0.04)
  }
  // a low solid band standing for the iron cresting round the deck edge
  prism(white, rect(AX0 - 0.2, AY0 - 0.2, AX1 + 0.2, AY1 + 0.2), Z_DECK, Z_DECK + 0.25, true)
  // the lantern (penthouse) and the beehive
  {
    const cx = (MX0 + MX1) / 2, cy = (MY0 + MY1) / 2, h = 1.55
    const z0 = Z_DECK, z1 = Z_DECK + 2.6
    box(white, cx - h, cy - h, cx + h, cy + h, z0, z1)
    box(white, cx - h - 0.3, cy - h - 0.3, cx + h + 0.3, cy + h + 0.3, z1, z1 + 0.4, true)
    box(white, cx - h, cy - h, cx + h, cy + h, z1 + 0.4, z1 + 0.65)
    for (const f of ['S', 'N', 'E', 'W'] as Face[]) {
      const n = NRM[f], plane = f === 'S' ? cy - h : f === 'N' ? cy + h : f === 'E' ? cx + h : cx - h
      const u = f === 'S' || f === 'N' ? cx : cy
      panel(win, f, plane, u, 0.8, z0 + 0.5, z0 + 2.1, 'flat', 0.05)
      void n
    }
    // corner pedestals with urns
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const px = cx + sx * (h - 0.15), py = cy + sy * (h - 0.15)
      box(white, px - 0.22, py - 0.22, px + 0.22, py + 0.22, z1 + 0.65, z1 + 1.15)
      box(white, px - 0.12, py - 0.12, px + 0.12, py + 0.12, z1 + 1.15, z1 + 1.45)
    }
    // the beehive: a drum on short legs, then the domed hive in stepped rings
    const zb = z1 + 0.65
    const ring = (r: number, z: number): V3[] => Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * 2 * Math.PI
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
    })
    white.loft([ring(0.55, zb), ring(0.55, zb + 0.35)])
    const prof: [number, number][] = [[0.7, 0.35], [0.74, 0.55], [0.72, 0.8], [0.66, 1.05], [0.56, 1.3], [0.42, 1.5], [0.24, 1.65], [0.05, 1.72]]
    white.cap(ring(0.55, zb + 0.35), true)
    white.loft(prof.map(([r, z]) => ring(r, zb + z)))
    white.cap(ring(0.05, zb + 1.72), true)
    white.cap(ring(0.7, zb + 0.35), false)
  }
  // chimneys at the east and west ends
  for (const x of [MX0 + 1.0, MX1 - 1.0]) box(stucco, x - 0.55, -5.2, x + 0.55, -3.8, Z_EAVE - 1, Z_DECK + 2.6)
  for (const x of [MX0 + 1.0, MX1 - 1.0]) box(white, x - 0.7, -5.35, x + 0.7, -3.65, Z_DECK + 2.6, Z_DECK + 2.9, true)

  // south front: 5 bays, door in the middle on the ground floor
  {
    const bays = [-1.0, 1.6, 3.6, 5.6, 8.2]
    bays.forEach((u, i) => {
      if (i === 2) {
        panel(white, 'S', MY0, u, 2.4, G + 0.0, G + 3.3, 'flat', 0.03)
        panel(door, 'S', MY0, u, 1.3, G + 0.1, G + 2.6, 'flat', 0.06)
        panel(win, 'S', MY0, u, 1.3, G + 2.7, G + 3.1, 'flat', 0.06)
        for (const s of [-1, 1]) panel(win, 'S', MY0, u + s * 0.85, 0.32, G + 0.6, G + 2.6, 'flat', 0.06)
      } else sash('S', MY0, u, G + 0.8, G + 2.9)
      sash('S', MY0, u, G + 4.5, G + 6.4)
    })
    // east side behind the veranda, and the west end
    for (const u of [-7.6, -3.5, -0.6]) { sash('E', MX1, u, G + 0.8, G + 2.9); sash('E', MX1, u, G + 4.5, G + 6.4) }
    for (const u of [-7.6, -1.2]) { sash('W', MX0, u, G + 4.5, G + 6.4) }
  }
  // the two-storey veranda: floor, upper deck with a solid balustrade, entablature, columns
  {
    const VX0 = -4.0, VX1 = 13.5, VY0 = -12.8, VY1 = 1.2
    const L: XY[] = [[VX0, VY0], [VX1, VY0], [VX1, VY1], [MX1, VY1], [MX1, MY0], [VX0, MY0]]
    prism(white, L, 0, G + 0.45, true)
    prism(white, L, G + 3.75, G + 4.0, true, true)
    // balustrade as a white band on the outer edges, set in 0.1 m
    const e = 0.12
    for (const seg of [[[VX0 + e, VY0 + e], [VX1 - e, VY0 + e]], [[VX1 - e, VY0 + e], [VX1 - e, VY1]]] as XY[][]) {
      const [a, b] = seg, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = -dy / l * 0.12, ny = dx / l * 0.12
      prism(white, [a, b, [b[0] + nx, b[1] + ny], [a[0] + nx, a[1] + ny]], G + 4.0, G + 4.95, true)
    }
    prism(white, L, G + 6.8, G + 7.4, true, true)
    prism(roof, [[VX0 + 0.2, VY0 + 0.2], [VX1 - 0.2, VY0 + 0.2], [VX1 - 0.2, VY1], [MX1, VY1], [MX1, MY0], [VX0 + 0.2, MY0]], G + 7.4, G + 7.55, true)
    const col = (x: number, y: number) => {
      box(white, x - 0.24, y - 0.24, x + 0.24, y + 0.24, G + 0.45, G + 3.75)
      box(white, x - 0.2, y - 0.2, x + 0.2, y + 0.2, G + 4.0, G + 6.8)
    }
    for (let k = 0; k <= 6; k++) col(VX0 + 0.3 + (k * (VX1 - VX0 - 0.6)) / 6, VY0 + 0.3)
    for (let k = 1; k <= 4; k++) col(VX1 - 0.3, VY0 + 0.3 + (k * (VY1 - VY0 - 0.6)) / 4)
    // front steps
    for (let k = 0; k < 3; k++) box(white, 1.6 + 0.0, VY0 - 0.9 + k * 0.3, 5.6, VY0 + 0.3, 0, G * (k + 1) / 3 * 0.45 + 0.15)
  }

  // ---------------------------------------------------------- north wing ---
  {
    const X0 = -0.4, X1 = 8.6, Y0 = MY1, Y1 = 23.8, ze = G + 6.4, zr = G + 9.6
    prism(stucco, rect(X0, Y0, X1, Y1), 0, ze, false)
    box(white, X0 - 0.25, Y0, X1 + 0.25, Y1 + 0.25, ze - 0.4, ze, true)
    gable(roof, stucco, X0, Y0, X1, Y1, ze, zr, 'y', 0.45)
    // raking trim on the north gable
    for (const s of [-1, 1]) {
      const xc = (X0 + X1) / 2, a: V3 = [xc + s * (X1 - X0) / 2, Y1 + 0.06, ze], b: V3 = [xc, Y1 + 0.06, zr]
      poly(white, [a, b, [b[0], b[1], b[2] - 0.4], [a[0], a[1], a[2] - 0.4]], [0, 1, 0])
    }
    // tall gabled dormers on the east slope (p2: three), and windows
    for (const y of [6.0, 11.5, 17.0]) {
      const x0 = X1 - 1.6, x1 = X1 + 0.05, z0 = ze - 0.2, zt = ze + 1.8
      box(stucco, x0, y - 1.1, x1, y + 1.1, z0, zt, false)
      gable(roof, stucco, x0 - 0.8, y - 1.1, x1, y + 1.1, zt, zt + 0.9, 'x', 0.2)
      panel(win, 'E', x1, y, 0.9, z0 + 0.4, z0 + 1.7)
    }
    for (const y of [4.5, 8.5, 12.5, 16.5, 20.5]) { sash('E', X1, y, G + 0.9, G + 2.9, 1.0, false); sash('E', X1, y, G + 3.9, G + 5.7, 1.0, false) }
    for (const y of [4.5, 10.0, 15.5, 21.0]) { sash('W', X0, y, G + 3.9, G + 5.7, 1.0, false) }
    for (const x of [1.8, 6.4]) { sash('N', Y1, x, G + 0.9, G + 2.9, 1.0, false); sash('N', Y1, x, G + 3.9, G + 5.7, 1.0, false) }
    sash('N', Y1, 4.1, G + 7.0, G + 8.1, 0.8, false)
    // single-storey porch on the east side
    const PX1 = 12.2
    prism(white, rect(X1, 1.6, PX1, 14.8), 0, G + 0.35, true)
    prism(white, rect(X1, 1.6, PX1, 14.8), G + 3.1, G + 3.5, true, true)
    for (let k = 0; k <= 4; k++) box(white, PX1 - 0.45, 1.9 + k * 3.1 - 0.17, PX1 - 0.11, 1.9 + k * 3.1 + 0.17, G + 0.35, G + 3.1)
    panel(door, 'E', X1, 9.8, 1.0, G + 0.35, G + 2.5)
  }

  // --------------------------------------------- west wings (office, link) ---
  {
    // the office: 1½ storeys, its gable to the street
    const OX0 = -22.2, OX1 = -13.0, OY0 = -11.4, OY1 = -2.0, oe = 5.2, orr = 9.4
    prism(stucco, rect(OX0, OY0, OX1, OY1), 0, oe, false)
    gable(roof, stucco, OX0, OY0, OX1, OY1, oe, orr, 'y', 0.45)
    box(white, OX0 - 0.2, OY0 - 0.2, OX1 + 0.2, OY1 + 0.2, oe - 0.35, oe, true)
    sash('S', OY0, -20.3, 1.0, 2.9, 1.1, false)
    sash('S', OY0, -15.0, 1.0, 2.9, 1.1, false)
    sash('S', OY0, -17.6, 5.8, 7.3, 0.9, false)
    panel(white, 'S', OY0, -17.6, 1.6, 0.4, 3.2, 'flat', 0.03)
    panel(door, 'S', OY0, -17.6, 1.0, 0.45, 2.6, 'flat', 0.06)
    panel(win, 'S', OY0, -17.6, 1.0, 2.65, 3.0, 'flat', 0.06)
    // the link: lower, one gable to the street
    const LX0 = -13.0, LX1 = MX0, LY0 = -10.6, LY1 = 1.7, le = 4.2, lr = 7.4
    prism(stucco, rect(LX0, LY0, LX1, LY1), 0, le, false)
    gable(roof, stucco, LX0, LY0, LX1, LY1, le, lr, 'y', 0.4)
    box(white, LX0 - 0.2, LY0 - 0.2, LX1, LY1, le - 0.3, le, true)
    for (const u of [-10.8, -5.8]) sash('S', LY0, u, 1.1, 3.0, 1.1, false)
    sash('S', LY0, -8.2, 4.8, 6.0, 0.8, false)
    panel(door, 'S', LY0, -8.2, 1.0, 0.6, 2.7, 'flat', 0.06)
    // single-storey veranda along both fronts
    const VY0 = -13.6
    prism(white, [[-21.1, VY0], [MX0 - 0.6, VY0], [MX0 - 0.6, LY0], [OX1, LY0], [OX1, OY0], [-21.1, OY0]], 0, 0.4, true)
    prism(white, [[-21.1, VY0], [MX0 - 0.6, VY0], [MX0 - 0.6, LY0], [OX1, LY0], [OX1, OY0], [-21.1, OY0]], 3.3, 3.75, true, true)
    for (let k = 0; k <= 6; k++) { const x = -20.8 + (k * (MX0 - 0.9 + 20.8)) / 6; box(white, x - 0.17, VY0 + 0.13, x + 0.17, VY0 + 0.47, 0.4, 3.3) }
  }

  // ---------------------------------------------------------------- output ---
  // Colours from p1/p3 (and the 2024 repaint in p2): pale grey-white stucco
  // with a little cream (sampled neutral grey in p2's sunlit gable, warmer
  // in p1's shade), white trim, grey shingle roof, dark green shutters, oak doors.
  // Re-picked after review: the stucco is a near-neutral pale grey-white
  // (p2's sunlit gable, p3's sunlit east front) and the trim is a clean white
  // (p1, p3), not the palette's cream trim, which made the house read beige.
  const parts = [
    { part: stucco, material: finish('beehive-stucco', 0xe2e1db) },
    { part: white, material: finish('beehive-white', 0xf6f5f1) },
    { part: roof, material: finish('beehive-shingle', 0x8f9397) },
    { part: win, material: PALETTE.window },
    { part: shutter, material: finish('beehive-shutter', 0x4f6a55) },
    { part: door, material: finish('beehive-door', 0xa07d55) },
  ]
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Beehive House', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: Z_DECK + 3.0,
  })
  await Bun.write(new URL('../models/slc-beehive-house.glb', import.meta.url), glb)
  console.log(`slc-beehive-house.glb: ${triangles} triangles, ${glb.length} bytes`)
}
