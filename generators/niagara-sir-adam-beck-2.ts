/**
 * Sir Adam Beck II Generating Station (1954, Ontario Hydro; 16 units),
 * Niagara Gorge, Niagara Falls, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-sir-adam-beck-2.ts
 *
 * Holds the gorge helpers shared with niagara-sir-adam-beck-1.ts
 * (`profileAt`, `slopeFace`, `penstock`, `capGrid`, `endWall`); merge this
 * generator first.
 *
 * Map frame: x east (towards the river), y north, z up, metres, turned to
 * bearing 359.2 (the long sides of the OSM plant area way/37538927).
 * Anchor = the plant area's centroid, 43.14591, -79.04399. y = 0 is the
 * river: the lowest ground under the footprint (tailwater, about 76 m
 * above sea level in the lidar). The water is the map's, not modelled.
 *
 * Identity: a long, low pale concrete powerhouse standing in the river at
 * the foot of the Canadian gorge wall, with a band of light vertical fins
 * along its upper river front, and behind it the great sloped concrete
 * face of the gorge wall carrying sixteen rounded penstock casings from
 * the intake wall on the cliff top down to a deck of transformers behind
 * the powerhouse.
 *
 * Evidence:
 * - plan: OSM plant area way/37538927 (x -67.5..30.9; the penstock face
 *   y -167..95, the narrow north end to 179, the powerhouse's south end
 *   at -182); USGS NAIP orthophoto (0.8 m, public domain) for the
 *   powerhouse ends (-182 and 142), the service building at the north end
 *   (142..179) and the penstock spacing (16.6 m, sixteen casings).
 * - heights and section: USGS 3DEP lidar NY_FEMAR2_Central_B1_2018 (2018
 *   flight; it reaches the Ontario bank), a 150 m crop read across the
 *   middle of the plant: the river front at x 37 with an 8 m ledge to x 41
 *   over the draft-tube outlets; the powerhouse roof at 30.0 m over x
 *   13..37; transformers to 21 m on a deck at 14 m (x -3..11); the
 *   penstock casings rising at about 60 degrees from 22 m at x -5 to 71 m
 *   at x -33, then easing to 85 m at x -57, the troughs between them 3 to
 *   8 m lower; the cliff-top wall at about 93-96 m. Mapterhorn terrain
 *   agrees on the cliff (95.5) and the deck (14.8).
 * - photos (Wikimedia Commons), EVIDENCE:
 *   - "Sir Adam Beck Hydroelectric Generating Station beside the Niagara
 *     River.jpg", Changku88, CC BY-SA 4.0 (the river front from the
 *     south-east, from the Robert Moses plant)
 *   - "Robert Moses Power Station and Sir Adam Beck Station from south,
 *     July 2023.jpg", Mr. Matté, CC BY-SA 4.0 (from the south-east, high)
 *   - "Power station on the Niagara River (27896070345).jpg", shankar s.,
 *     CC BY 2.0 (aerial from the south)
 *   - "Adam Beck Complex.jpg", Ontario Power Generation, CC BY 2.0
 *     (aerial from the north)
 *
 * Estimated: the casings' width (12 m of the 16.6 m spacing) and round
 * section; the window band and fin band heights on the river front from
 * the photos; the service building's height (32 m) and the cliff-top wall.
 * Left out: the transmission towers and gantries, the cranes, the draft
 * tube piers' detail, roof vents. Doubts: the back of the powerhouse and
 * the ends of the penstock face are seen only from far off; the lidar and
 * the NAIP photo disagree by about 9 m east-west on the river front
 * (lidar used).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { block, cap, panel, save, walls, type XY } from './chi-aon-center'
import { densify, rect } from './niagara-table-rock-centre'

export type XZ = [number, number]

/** Height of a polyline profile (x ascending) at x, clamped at its ends. */
export function profileAt(prof: XZ[], x: number): number {
  if (x <= prof[0][0]) return prof[0][1]
  for (let i = 0; i < prof.length - 1; i++) {
    const [x0, z0] = prof[i], [x1, z1] = prof[i + 1]
    if (x <= x1) return z0 + ((z1 - z0) * (x - x0)) / (x1 - x0)
  }
  return prof[prof.length - 1][1]
}

/** A flat top over an axis-aligned rectangle, cut into pieces no longer than `step` (for the terrain drape). */
export function capGrid(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, step = 5) {
  const nx = Math.max(1, Math.ceil((x1 - x0) / step)), ny = Math.max(1, Math.ceil((y1 - y0) / step))
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const a = x0 + ((x1 - x0) * i) / nx, b = x0 + ((x1 - x0) * (i + 1)) / nx
    const c = y0 + ((y1 - y0) * j) / ny, d = y0 + ((y1 - y0) * (j + 1)) / ny
    p.quad([a, c, z], [b, c, z], [b, d, z], [a, d, z])
  }
}

/**
 * A sloped face running along y from y0 to y1, its section the profile
 * `prof` (x ascending, down the slope towards +x), cut every `step` m
 * along y so the terrain drape can follow it.
 */
export function slopeFace(p: Part, prof: XZ[], y0: number, y1: number, step = 5) {
  const n = Math.max(1, Math.ceil((y1 - y0) / step))
  for (let j = 0; j < n; j++) {
    const a = y0 + ((y1 - y0) * j) / n, b = y0 + ((y1 - y0) * (j + 1)) / n
    for (let i = 0; i < prof.length - 1; i++) {
      const [xa, za] = prof[i], [xb, zb] = prof[i + 1]
      p.quad([xa, a, za], [xb, a, zb], [xb, b, zb], [xa, b, za])
    }
  }
}

/**
 * The end wall of a slope mass at y, from the profile down to z0, facing
 * -y (`south`) or +y.
 */
export function endWall(p: Part, prof: XZ[], y: number, z0: number, south: boolean) {
  for (let i = 0; i < prof.length - 1; i++) {
    const [xa, za] = prof[i], [xb, zb] = prof[i + 1]
    const A: V3 = [xa, y, z0], B: V3 = [xb, y, z0], C: V3 = [xb, y, zb], D: V3 = [xa, y, za]
    if (south) p.quad(A, B, C, D); else p.quad(B, A, D, C)
  }
}

/**
 * A penstock casing lying on a slope: centred on y = c, `w` wide, its
 * crown a round arch `rise` above the slope face `prof`, offset along the
 * face's normal so it keeps its section on the steep part. Smooth-shaded,
 * with flat ends.
 */
export function penstock(p: Part, prof: XZ[], c: number, w: number, rise: number, seg = 6) {
  // the face normal at each profile point (averaged at the bends)
  const nrm = prof.map((_, i) => {
    const a = prof[Math.max(0, i - 1)], b = prof[Math.min(prof.length - 1, i + 1)]
    const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz)
    return [-dz / l, dx / l] as XZ
  })
  // the section: a half ellipse across y, from the left foot to the right foot
  const sec = Array.from({ length: seg + 1 }, (_, k) => {
    const t = Math.PI * (1 - k / seg)
    return { dy: (w / 2) * Math.cos(t), up: rise * Math.sin(t), ny: Math.cos(t) / (w / 2), nu: Math.sin(t) / rise }
  })
  const pt = (i: number, s: (typeof sec)[number]): V3 => [prof[i][0] + nrm[i][0] * s.up, c + s.dy, prof[i][1] + nrm[i][1] * s.up]
  const nm = (i: number, s: (typeof sec)[number]): V3 => {
    const l = Math.hypot(s.ny, s.nu)
    return [(nrm[i][0] * s.nu) / l, s.ny / l, (nrm[i][1] * s.nu) / l]
  }
  for (let i = 0; i < prof.length - 1; i++) {
    for (let k = 0; k < seg; k++) {
      const a = sec[k], b = sec[k + 1]
      const A = pt(i, a), B = pt(i + 1, a), C = pt(i + 1, b), D = pt(i, b)
      const nA = nm(i, a), nB = nm(i + 1, a), nC = nm(i + 1, b), nD = nm(i, b)
      p.tri(A, B, C, [0, 0], [0, 0], [0, 0], [nA, nB, nC])
      p.tri(A, C, D, [0, 0], [0, 0], [0, 0], [nA, nC, nD])
    }
  }
  // the flat ends
  for (const [i, sign] of [[0, -1], [prof.length - 1, 1]] as [number, number][]) {
    const ring = sec.map(s => pt(i, s))
    const base: V3 = [prof[i][0], c, prof[i][1]]
    for (let k = 0; k < seg; k++) {
      if (sign < 0) p.tri(base, ring[k + 1], ring[k]); else p.tri(base, ring[k], ring[k + 1])
    }
  }
}

// ---------------------------------------------------------------------------
// Sir Adam Beck II

function build() {
  const conc = new Part(), hall = new Part(), roof = new Part(), win = new Part(), fins = new Part(), dark = new Part()

  const YS = -182, YN = 142, YB = 179 // powerhouse south end, north end, service building's north end
  const XR = 37, XB = 12 // the hall's river wall and back wall
  const PS = -167, PN = 99 // the penstock face's ends
  const SP = 16.6, N = 16, C0 = -34 // casing spacing, count, middle

  // --- the penstock face: troughs, sixteen casings, the cliff-top wall
  const trough: XZ[] = [[-58, 80], [-41, 72], [-33, 66.5], [-5, 18], [-3, 14]]
  slopeFace(conc, trough, PS, PN)
  endWall(conc, trough, PS, 10, true)
  endWall(conc, trough, PN, 10, false)
  for (let k = 0; k < N; k++) {
    const c = C0 + SP * (k - (N - 1) / 2)
    penstock(conc, [[-57, 80.5], [-41, 72.5], [-33, 67], [-6, 19.5], [-3, 15.5]], c, 12.4, 5)
  }
  // the intake wall along the cliff top, its outer face down to the casings
  const head = rect(-66, PS, -58, PN)
  block(conc, conc, densify(head, 8), 72, 96.5, 0.5)

  // --- the substructure and transformer deck, river level to 14 m
  walls(conc, densify(rect(-3, YS, XB, YN), 5), 0, 14)
  capGrid(conc, -3, YS, XB, YN, 14)
  // the ledge over the draft-tube outlets along the river, 8 m
  const ledge = rect(XR, YS + 2, 41, YN - 2)
  walls(conc, densify(ledge, 5), 0, 8)
  capGrid(conc, XR, YS + 2, 41, YN - 2, 8, 5)
  // the draft-tube outlets: dark openings at the water, one pair per unit
  for (let k = 0; k < N; k++) {
    const yc = YS + 14 + ((YN - YS - 28) * (k + 0.5)) / N
    for (const d of [-4.2, 4.2]) panel(dark, [41, YS + 2], [41, YN - 2], yc - (YS + 2) + d - 3, yc - (YS + 2) + d + 3, 0.2, 5.6, 0.05)
  }
  // transformers on the deck, one per unit, dark
  for (let k = 0; k < N; k++) {
    const yc = YS + 14 + ((YN - YS - 28) * (k + 0.5)) / N
    block(dark, dark, rect(1, yc - 3.5, 8, yc + 3.5), 14, 21, 0.3)
  }

  // --- the powerhouse hall, 14 to 30 m over the substructure; the river wall from the ledge up
  const H = rect(XB, YS, XR, YN)
  walls(hall, densify(H, 5), 0, 29.2)
  block(hall, null, H, 29.2, 30.4, 0.3)
  cap(roof, rect(XB + 0.3, YS + 0.3, XR - 0.3, YN - 0.3), 30.4)
  // a pale cornice band at the top
  walls(hall, rect(XB - 0.25, YS - 0.25, XR + 0.25, YN + 0.25), 27.6, 28.6)
  cap(hall, rect(XB - 0.25, YS - 0.25, XR + 0.25, YN + 0.25), 27.6, false)
  // river front: the long band of light fins (grouped per unit) and the window row under it
  for (let k = 0; k < N; k++) {
    const s0 = 14 + ((YN - YS - 28) * k) / N
    const s1 = 14 + ((YN - YS - 28) * (k + 1)) / N
    panel(fins, [XR, YS], [XR, YN], s0 + 0.8, s1 - 0.8, 17.5, 26.6, 0.05)
    for (const f of [0.22, 0.5, 0.78]) {
      const s = s0 + (s1 - s0) * f
      panel(win, [XR, YS], [XR, YN], s - 1.6, s + 1.6, 11.2, 14.2, 0.05)
    }
  }
  // the ends: fins high up, the same as the front
  panel(fins, [XB, YS], [XR, YS], 3, 22, 17.5, 26.6, 0.05)
  // roof vents in a row
  for (let k = 0; k < N; k++) {
    const yc = YS + 14 + ((YN - YS - 28) * (k + 0.5)) / N
    block(roof, roof, rect(22, yc - 1.5, 25, yc + 1.5), 30.4, 32, 0.2)
  }

  // --- the service building at the north end, 32 m, plain with window rows
  const S = rect(-3, YN, XR, YB)
  walls(hall, densify(S, 5), 0, 31)
  block(hall, null, S, 31, 32.2, 0.3)
  cap(roof, rect(-2.7, YN + 0.3, XR - 0.3, YB - 0.3), 32.2)
  for (const [a, b] of [[[XR, YN], [XR, YB]], [[XR, YB], [-3, YB]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 6)
    for (let k = 0; k < n; k++) for (const [z0, z1] of [[17, 21.5], [24, 28.5]]) panel(win, a, b, (L * k) / n + 1.2, (L * (k + 1)) / n - 1.2, z0, z1, 0.05)
  }

  return [
    { part: conc, material: finish('beck-concrete', 0xd3ccbf) },
    { part: hall, material: finish('beck-powerhouse', 0xe4dfd4) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: fins, material: windowVariant(2, 0xb7c3cb) },
    { part: dark, material: finish('beck-dark', 0x51575e) },
  ]
}

if (import.meta.main) await save('niagara-sir-adam-beck-2', 'Sir Adam Beck II Generating Station', [43.14591, -79.04399], 359.2, build(), 6500)
