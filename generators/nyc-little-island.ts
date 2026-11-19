/**
 * Little Island at Pier 55, Hudson River Park, New York City: procedural,
 * CC0-1.0.
 * bun generators/nyc-little-island.ts
 *
 * A 2.4-acre park (Heatherwick Studio with MNLA, opened May 2021) standing
 * in the Hudson off West 13th Street on 132 precast concrete "tulip" pots,
 * each on its own column, with an undulating landscaped deck on top, an
 * amphitheatre (The Amph, 687 seats) and two gangway bridges to the shore.
 *
 * Frame: the island's plan is close to a square turned to the Manhattan
 * street grid, so the model is built square to it: x runs along the grid's
 * east (compass 118.6°), y along its north (28.6°), z up, metres. The
 * placement bearing is 28.6, which turns the model's north to 28.6°.
 * Origin: the placement anchor (lon -74.0106105, lat 40.7420041), the OSM
 * centre of the island, on the water. z = 0 is the river surface, the lowest
 * ground under the footprint; the island is a structure over the water, so
 * the model owns the pots, columns, deck and gangways, and elevation stays
 * 0. Below, "SW", "SE", "NW", "NE" mean the model's (grid) corners: SW is
 * the island's westernmost point, NE the one nearest the shore.
 *
 * Plan: OSM. The island way/833335529 (man_made=pier, leisure=park): a
 * square of 97.2 m a side between its lobed corners, edges at 28.6° and
 * 118.6°, centred on the anchor. The gangways' outlines way/1169234796
 * (South Bridge, straight out from Little West 12th Street, landing on the
 * east edge 17 m south of centre) and way/1169234797 (North Bridge, out
 * from West 14th Street along a line 24 m north of the island, then turning
 * south onto the north edge 8 m east of centre). The Amph, way/963397721,
 * on the west edge north of centre, with its stage way/1234760723 at the
 * water's edge. Checked against USGS NAIP (public domain; a 2019 frame,
 * mid-construction, that shows the pots' grid and the bridges' plan).
 *
 * Published (Wikipedia, "Little Island at Pier 55", citing the NYT, ENR and
 * the Hudson River Park Trust): 132 pots; pot tops 15 to 62 ft (4.6 to
 * 18.9 m) above mean water; the largest support 30 ft (9.1 m); pot edges
 * 9 ± 3 in apart; 2.4 acres; The Amph 687 seats at the western end on the
 * north side of the tallest hill; overlooks at the NW, SW and SE corners;
 * trees to 35 ft (11 m).
 *
 * No lidar: the USGS 3DEP NYC flight (2017) predates the island, so every
 * height here is from the published range and the photos.
 * Estimated from the photos against the 4.6-18.9 m range:
 *   pot-top heights: SW 18.9 m (the tallest hill, the high stilts in
 *     "Little Island Pier 55 NYC.JPG" and Mike Peel's 050/060), NW 12 m,
 *     SE and NE 7.5 m (the east edge about 8 m in Epicgenius's photo from
 *     the South Bridge). The SW corner lifts sharply: a narrow plateau
 *     falling off within about 40 m. The south edge sags to pots at the
 *     waterline (4.6 m) east of its middle, as in Jakub Hałun's photo from
 *     New Jersey, the north edge dips 2 m, and the rim waves by ±1.2 m;
 *   The Amph: a bowl on the west edge, the stage at 5.5 m (the low pots
 *     under it in "Little Island Pier 55 NYC.JPG"), the seats rising 0.45 m
 *     per metre inland to meet the hill;
 *   the pots on a 12 x 11 grid (8.1 x 8.8 m), which gives the published
 *     132 and the OSM outline, jittered up to 0.6 m in plan (inner pots)
 *     and 0.7 m down in height; each pot a chalice over 65% of its height,
 *     a trumpet opening to a rounded-square head whose rim meets its
 *     neighbours', on a stem tapering from 1.8 m across at the water to
 *     3 m at the throat;
 *   the South Bridge passes level, 3.9 m up, through the east edge under
 *     an arch: that pot has no stem, its head a shallow bowl (1.8 m deep,
 *     top 8.6 m) carried by its neighbours, as in Epicgenius's photo;
 *   soil 0.4 m over the pot tops, two broad rises (2.5 m, the larger south
 *     of the Amph) and five planted mounds 3.5-5.5 m high and 7-11 m
 *     across, drawn in the trees' green; trees in clumps along the rim;
 *     the weathering-steel railing 1.1 m, drawn a little inside the edge
 *     pots' centres so their pale lips show as the scalloped rim;
 *   the gangways 3.5 m above the water at the shore, rising to the deck
 *     at the island, on pairs of columns every 10-12 m.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *   "At New York City 2023 060 - Little Island at Pier 55.jpg", Mike Peel,
 *     CC BY-SA 4.0 (from the Pier 57 roof, north: the north edge, the
 *     North Bridge, the SW stilts)
 *     https://commons.wikimedia.org/wiki/File:At_New_York_City_2023_060_-_Little_Island_at_Pier_55.jpg
 *   "At New York City 2023 050.jpg", Mike Peel, CC BY-SA 4.0 (from the
 *     north at water level: the pots and columns, the edge rising west)
 *     https://commons.wikimedia.org/wiki/File:At_New_York_City_2023_050.jpg
 *   "At New York City 2023 055.jpg", Mike Peel, CC BY-SA 4.0 (from Pier 57)
 *     https://commons.wikimedia.org/wiki/File:At_New_York_City_2023_055.jpg
 *   "Little Island Pier 55 NYC.JPG", Dr. Bernd Gross, CC BY-SA 4.0 (from
 *     the river, west: The Amph in its dip, the high SW corner)
 *     https://commons.wikimedia.org/wiki/File:Little_Island_Pier_55_NYC.JPG
 *   "Little Island at Pier 55, New York City, 20231001 1017 0809.jpg",
 *     Jakub Hałun, CC BY-SA 4.0 (from New Jersey, south-west)
 *     https://commons.wikimedia.org/wiki/File:Little_Island_at_Pier_55,_New_York_City,_20231001_1017_0809.jpg
 *   "Little Island at Pier 55.jpg", Praneeth Thalla, CC BY-SA 4.0 (from
 *     Pier 57, the North Bridge and the island's north edge)
 *     https://commons.wikimedia.org/wiki/File:Little_Island_at_Pier_55.jpg
 *   "Little Island Pier 55 Aug 2021 07.jpg", Epicgenius, CC BY-SA 4.0
 *     (from the South Bridge, east)
 *     https://commons.wikimedia.org/wiki/File:Little_Island_Pier_55_Aug_2021_07.jpg
 *   "Little Island Amphitheater, New York City, 20231001 1824 1523.jpg",
 *     Jakub Hałun, CC BY-SA 4.0 (The Amph's seats)
 *     https://commons.wikimedia.org/wiki/File:Little_Island_Amphitheater,_New_York_City,_20231001_1824_1523.jpg
 *
 * Style: pale concrete pots, each a trumpet flaring from a tapered stem to
 * a rounded-square head, the heads meeting, so the edge reads as the row
 * of tulips and scalloped arches it is; the deck a muted green, its edge a weathering-
 * steel band; The Amph's seats as stepped timber rows; trees as simple
 * green crowns. The low model draws the edge pots in full and the inner
 * ones as plain columns and cones; the detail model (models/
 * nyc-little-island.detail.glb, from zoom 17) draws every pot round, the
 * gangways' railings and more trees. Night: the pots' undersides are
 * floodlit, as the underlit pots are in night photos; nothing else glows.
 *
 * Doubts: no lidar, so the corner heights are photo estimates within the
 * published range (the SE corner, at 7.5 m, is lower than some
 * descriptions suggest, following the New Jersey photo); the flare share
 * (65%) is bolder than on the tallest real pots, whose stems are longer.
 * The deck is a smooth surface with mounds where the real one has lawns,
 * paths, rock outcrops and retaining walls. The railing stands inside the
 * pot lips rather than on them. The real pots are irregular and tilted,
 * and staggered more than the jitter here. The FOH building and the three
 * kiosks on the deck (OSM building ways) are under 4 m and left out.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { qf, tf } from './dc-white-house'

const BEARING = 28.6
const S = 48.6 // half-size of the island square, to the pots' outer lips
const NU = 12, NV = 11
const PU = (2 * S) / NU, PV = (2 * S) / NV
const AX = PU / 2 + 0.05, AY = PV / 2 + 0.05 // a pot head's half-widths: the rims meet
const RC = 1.1 // the stem's radius at its waist
const EDGE = -0.1 // the deck's edge, as a share of the edge pots' half-width beyond their centres
const XB = S - PU / 2 + EDGE * AX, YB = S - PV / 2 + EDGE * AY

// OSM (metres east, north of the anchor) to the model's grid frame.
const rad = (BEARING * Math.PI) / 180
const toModel = (e: number, n: number): [number, number] => [
  e * Math.cos(rad) - n * Math.sin(rad),
  e * Math.sin(rad) + n * Math.cos(rad),
]

// ------------------------------------------------------------- heights ----
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
const C_SW = 18.9, C_SE = 7.5, C_NW = 12.0, C_NE = 7.5
const AMPH: [number, number] = [-46, 17] // the stage's centre, on the west edge
const AMPH_Z = 5.5, AMPH_R0 = 5, AMPH_R1 = 21, AMPH_HALF = (52 * Math.PI) / 180
const amphZ = (d: number) => AMPH_Z + 0.45 * Math.max(0, d - AMPH_R0)
const amphD = (x: number, y: number) => Math.hypot(x - AMPH[0], (y - AMPH[1]) * 0.85)
const ARCH_TOP = 8.6
const S_LAND = toModel(35.2, -39.0) // where the South Bridge meets the east edge
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const gauss = (x: number, y: number, cx: number, cy: number, r: number) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (r * r))

/**
 * Pot-top height above the water. The SW corner lifts sharply out of a low
 * island (a narrow plateau, falling off within 40 m), the rim waves, and the
 * south edge sags to pots at the waterline east of its middle.
 */
function H(x: number, y: number) {
  const t = (x + S) / (2 * S), s = (y + S) / (2 * S)
  const tt = smooth(clamp01((t - 0.08) / 0.5)), ss = smooth(clamp01((s - 0.08) / 0.55))
  let h = (1 - tt) * (1 - ss) * C_SW + tt * (1 - ss) * C_SE + (1 - tt) * ss * C_NW + tt * ss * C_NE
  h -= 3.0 * gauss(x, y, 14, -S, 13) // the south edge's sag
  h -= 2.0 * gauss(x, y, -12, S, 11) // a dip in the north edge
  h += 1.2 * Math.sin(x / 7.5) * Math.cos(y / 8.5) // the rim's wave
  h = Math.max(h, (ARCH_TOP - 0.2) * smooth(1 - Math.hypot(x - S_LAND[0], y - S_LAND[1]) / 12)) // over the South Bridge's arch
  return Math.max(4.6, Math.min(18.9, h, amphZ(amphD(x, y))))
}
/** How far (x, y) is inside the Amph's seating fan: 1 inside, 0 beyond 3 m out. */
function inAmph(x: number, y: number) {
  const r = Math.hypot(x - AMPH[0], y - AMPH[1]), a = Math.abs(Math.atan2(y - AMPH[1], x - AMPH[0]))
  const out = Math.max(r - AMPH_R1, (a - AMPH_HALF) * r, 0)
  return 1 - smooth(out / 3)
}
/** The deck's planted surface: soil over the pots, sunk under the Amph's seats. */
const Z = (x: number, y: number) => H(x, y) + 0.4 - 1.2 * inAmph(x, y) + hills(x, y)
/**
 * The planted hills over the pots (estimated from the photos): the tallest
 * south of the Amph, lower mounds east of the Main Lawn. Gone by the edges,
 * where the railing stands on the pot lips.
 */
function hills(x: number, y: number) {
  const bump = (cx: number, cy: number, a: number, r: number) => a * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (r * r))
  const edge = smooth(Math.min(XB - Math.abs(x), YB - Math.abs(y)) / 10)
  return edge * (bump(-28, -22, 2.5, 16) + bump(14, 26, 1.5, 13)) * (1 - inAmph(x, y))
}
/** Chunky planted mounds on the deck: centre, radius, height (estimated from the photos). */
const MOUNDS: Array<[number, number, number, number]> = [
  [-26, -26, 11, 5.5], [-9, 33, 8, 4.5], [18, 23, 8.5, 4.5], [31, -27, 8, 4.5], [2, -8, 7, 3.5],
]

// --------------------------------------------------------------- parts ----
type Mats = { pot: Part; plant: Part; tree: Part; steel: Part; amph: Part }

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A superellipse ring, counter-clockwise from above. */
function ring(cx: number, cy: number, ax: number, ay: number, n: number, z: number, seg: number): V3[] {
  const out: V3[] = []
  for (let k = 0; k < seg; k++) {
    const a = (2 * Math.PI * (k + 0.5)) / seg, c = Math.cos(a), s = Math.sin(a)
    out.push([cx + ax * Math.sign(c) * Math.abs(c) ** (2 / n), cy + ay * Math.sign(s) * Math.abs(s) ** (2 / n), z])
  }
  return out
}

/** `Part.loft`, smooth-shaded: each corner's normal from its ring and profile neighbours. */
function smoothLoft(p: Part, rings: V3[][]) {
  const n = rings[0].length
  const N = rings.map((r, k) => r.map((_, i) => {
    const t = sub(r[(i + 1) % n], r[(i + n - 1) % n])
    const u = sub(rings[Math.min(k + 1, rings.length - 1)][i], rings[Math.max(k - 1, 0)][i])
    return cross(t, u)
  }))
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
      p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [N[k][i], N[k][j], N[k + 1][j]])
      p.tri(a, c, d, [0, 0], [0, 0], [0, 0], [N[k][i], N[k + 1][j], N[k + 1][i]])
    }
}

/**
 * One tulip: a stem tapering up from the water to a wide throat, then a
 * chalice flaring over 65% of the pot's height to a rounded-square head
 * whose rim meets its neighbours'. With no stem (`stem` false) the head is a
 * shallow bowl spanning a passage, as over the South Bridge.
 */
function pot(p: Part, cx: number, cy: number, top: number, seg: number, ts: number[], colSeg: number, cap: boolean, k = 1, D0?: number) {
  const D = D0 ?? Math.max(3.4, Math.min(top - 0.6, 0.65 * top))
  const z0 = top - D
  const r1 = RC * 1.35 // the throat, wider than the stem's foot
  const rings = ts.map((t) => {
    const u = Math.min(1, t / 0.9), f = u ** 2.6 // a trumpet opening into a wide bowl, then an upright lip
    return ring(cx, cy, r1 + (AX * k - r1) * f, r1 + (AY * k - r1) * f, 2 + 2 * t, z0 + D * t, seg)
  })
  smoothLoft(p, rings)
  if (cap) p.cap(rings[rings.length - 1], true)
  if (D0 !== undefined) {
    p.cap(rings[0], false)
    return
  }
  const col = (z: number, r: number) => ring(cx, cy, r, r, 2, z, colSeg)
  smoothLoft(p, colSeg === seg ? [col(0, RC * 0.8), rings[0]] : [col(0, RC * 0.8), col(z0, r1)])
}

/** A deck slab along a straight leg, top rising from za to zb, with a column pair every `step`. */
function gangway(M: Mats, a: [number, number], b: [number, number], w: number, za: number, zb: number, detail: boolean) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  const ux = dx / L, uy = dy / L, nx = -uy * (w / 2), ny = ux * (w / 2)
  const T = 1.0
  const P = (s: number, side: number, z: number): V3 => [a[0] + ux * s + nx * side, a[1] + uy * s + ny * side, z]
  const zt = (s: number) => za + ((zb - za) * s) / L
  qf(M.pot, P(0, -1, zt(0)), P(L, -1, zt(L)), P(L, 1, zt(L)), P(0, 1, zt(0)), [0, 0, 1])
  qf(M.pot, P(0, -1, zt(0) - T), P(L, -1, zt(L) - T), P(L, 1, zt(L) - T), P(0, 1, zt(0) - T), [0, 0, -1])
  for (const side of [-1, 1]) {
    const o: V3 = [nx * side, ny * side, 0]
    qf(M.pot, P(0, side, zt(0) - T), P(L, side, zt(L) - T), P(L, side, zt(L)), P(0, side, zt(0)), o)
    // Railings: a solid pale band in the low model, as the glass-and-steel
    // balustrade reads from the river; the detail model adds the handrail line.
    const r0 = zt(0) + 1.1, r1 = zt(L) + 1.1
    const q = (s: number, z: number): V3 => P(s, side * 0.97, z)
    qf(M.pot, q(0, zt(0)), q(L, zt(L)), q(L, r1), q(0, r0), o)
    qf(M.pot, q(0, zt(0)), q(L, zt(L)), q(L, r1), q(0, r0), [-o[0], -o[1], 0])
    if (detail) {
      const h0 = r0 + 0.08, h1 = r1 + 0.08, t = 0.06
      const q2 = (s: number, z: number, d: number): V3 => P(s, side * (0.97 + d), z)
      qf(M.steel, q2(0, r0, -t), q2(L, r1, -t), q2(L, h1, t), q2(0, h0, t), [0, 0, 1])
    }
  }
  for (const end of [0, L]) qf(M.pot, P(end, -1, zt(end) - T), P(end, 1, zt(end) - T), P(end, 1, zt(end)), P(end, -1, zt(end)), [end ? ux : -ux, end ? uy : -uy, 0])
  const n = Math.max(1, Math.round(L / 11))
  for (let k = 1; k < n; k++) {
    const s = (k * L) / n
    for (const side of [-0.6, 0.6]) {
      const c = P(s, side, 0)
      const sq = (z: number) => ring(c[0], c[1], 0.45, 0.45, 2, z, 4)
      M.pot.loft([sq(0), sq(zt(s) - T)])
    }
  }
}

/** The grid cell of the edge pot nearest (x, y). */
function nearestEdgePot(x: number, y: number): [number, number] {
  const i = Math.max(0, Math.min(NU - 1, Math.floor((x + S) / PU))), j = Math.max(0, Math.min(NV - 1, Math.floor((y + S) / PV)))
  return [i, j]
}

function build(detail: boolean): Mats {
  const M: Mats = { pot: new Part(), plant: new Part(), tree: new Part(), steel: new Part(), amph: new Part() }

  // ---- The pots. The low model draws the edge pots round and the inner
  // ones, mostly hidden under the deck, as plain columns and cones.
  // Positions and heights are jittered a little (fixed seed), as the real
  // pots are staggered and each sits at its own height; edge pots move only
  // along the edge, and only down, so the rim stays on the outline.
  const jit = rng(132)
  const arch = nearestEdgePot(S_LAND[0], S_LAND[1])
  for (let i = 0; i < NU; i++)
    for (let j = 0; j < NV; j++) {
      const ex = i === 0 || i === NU - 1, ey = j === 0 || j === NV - 1, edge = ex || ey
      const cx = -S + PU * (i + 0.5) + (ex ? 0 : (jit() - 0.5) * 1.2)
      const cy = -S + PV * (j + 0.5) + (ey ? 0 : (jit() - 0.5) * 1.2)
      const top = H(cx, cy) - jit() * 0.7, k = 0.95 + jit() * 0.08
      if (i === arch[0] && j === arch[1]) {
        // The South Bridge passes through the island's edge under this pot:
        // its head is a shallow bowl carried by its neighbours, 2.9 m clear.
        pot(M.pot, cx, cy, ARCH_TOP, detail ? 12 : 8, [0, 0.5, 1], 0, true, 1, 1.8)
        continue
      }
      if (detail) pot(M.pot, cx, cy, top, 12, [0, 0.2, 0.4, 0.55, 0.7, 0.82, 0.92, 1], 12, edge, k)
      else if (edge) pot(M.pot, cx, cy, top, 8, [0, 0.5, 0.75, 0.9, 1], 6, true, k)
      else pot(M.pot, cx, cy, top, 4, [0, 1], 4, false, k)
    }

  // ---- The deck: a smooth planted surface over the pot grid, finer around
  // the Amph so the bowl keeps its shape.
  const fine = detail ? 2 : 1
  const xs: number[] = [-XB], ys: number[] = [-YB]
  for (let i = 0; i < NU; i++) {
    const c = -S + PU * (i + 0.5)
    for (let k = 0; k < fine; k++) xs.push(c + (k * PU) / fine)
    if (!detail && c < -20) xs.push(c + PU / 2)
  }
  for (let j = 0; j < NV; j++) {
    const c = -S + PV * (j + 0.5)
    for (let k = 0; k < fine; k++) ys.push(c + (k * PV) / fine)
    if (!detail && c > -6 && c < 36) ys.push(c + PV / 2)
  }
  const clampSorted = (v: number[], lim: number) => [...new Set(v.map((a) => Math.max(-lim, Math.min(lim, a))))].sort((a, b) => a - b)
  const X = clampSorted([...xs, XB], XB), Y = clampSorted([...ys, YB], YB)
  const nrm = (x: number, y: number): V3 => {
    const e = 0.5, gx = (Z(x + e, y) - Z(x - e, y)) / (2 * e), gy = (Z(x, y + e) - Z(x, y - e)) / (2 * e)
    return [-gx, -gy, 1]
  }
  const v = (x: number, y: number): V3 => [x, y, Z(x, y)]
  for (let i = 0; i < X.length - 1; i++)
    for (let j = 0; j < Y.length - 1; j++) {
      const a = v(X[i], Y[j]), b = v(X[i + 1], Y[j]), c = v(X[i + 1], Y[j + 1]), d = v(X[i], Y[j + 1])
      const na = nrm(a[0], a[1]), nb = nrm(b[0], b[1]), nc = nrm(c[0], c[1]), nd = nrm(d[0], d[1])
      M.plant.tri(a, b, c, [0, 0], [0, 0], [0, 0], [na, nb, nc])
      M.plant.tri(a, c, d, [0, 0], [0, 0], [0, 0], [na, nc, nd])
    }

  // ---- The mounds: six-sided domes following the deck, densely planted
  // (drawn in the trees' green, as the shrub and tree cover reads on them).
  for (const [mx, my, mr, mh] of MOUNDS) {
    const seg = detail ? 12 : 6
    const prof: Array<[number, number]> = detail ? [[1, -0.3], [0.8, 0.45], [0.5, 0.85], [0.02, 1]] : [[1, -0.3], [0.6, 0.7], [0.02, 1]]
    const rings = prof.map(([f, t]) => ring(mx, my, mr * f, mr * f, 2, 0, seg).map(([x, y]): V3 => [x, y, Z(x, y) + Math.max(t, -0.3) * mh]))
    M.tree.loft(rings) // faceted, so the planted mass catches the light
  }

  // ---- The edge: a weathering-steel band from the pot lips to the railing,
  // broken where the two gangways land.
  const landings: Array<[number, number]> = []
  const [sbx, sby] = toModel(35.2, -39.0), [nbx, nby] = toModel(29.9, 37.4)
  landings.push([sbx, sby], [nbx, nby])
  const loop: [number, number][] = []
  for (const x of X) loop.push([x, -YB])
  for (const y of Y.slice(1)) loop.push([XB, y])
  for (const x of [...X].reverse().slice(1)) loop.push([x, YB])
  for (const y of [...Y].reverse().slice(1)) loop.push([-XB, y])
  for (let k = 0; k < loop.length - 1; k++) {
    const [x0, y0] = loop[k], [x1, y1] = loop[k + 1]
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2
    if (landings.some(([lx, ly]) => Math.hypot(mx - lx, my - ly) < 4.2)) continue
    const out: V3 = [y1 - y0, -(x1 - x0), 0]
    const p0: V3 = [x0, y0, H(x0, y0) - 1.0], p1: V3 = [x1, y1, H(x1, y1) - 1.0]
    const t0: V3 = [x0, y0, Z(x0, y0) + 1.1], t1: V3 = [x1, y1, Z(x1, y1) + 1.1]
    qf(M.steel, p0, p1, t1, t0, out)
    qf(M.steel, p0, p1, t1, t0, [-out[0], -out[1], 0])
  }

  // ---- The Amph: stepped timber rows in a fan facing the stage at the
  // water's edge, and the stage itself.
  const rows = 10, aseg = detail ? 16 : 7
  const arcPt = (r: number, k: number, z: number): V3 => {
    const a = -AMPH_HALF + (2 * AMPH_HALF * k) / aseg
    return [AMPH[0] + r * Math.cos(a), AMPH[1] + r * Math.sin(a), z]
  }
  for (let r = 0; r < rows; r++) {
    const ra = AMPH_R0 + ((AMPH_R1 - AMPH_R0) * r) / rows, rb = AMPH_R0 + ((AMPH_R1 - AMPH_R0) * (r + 1)) / rows
    const z = amphZ((ra + rb) / 2 + 0.6) + 0.05, zp = r === 0 ? AMPH_Z - 0.6 : amphZ((ra + (ra - (rb - ra))) / 2 + 0.6) + 0.05
    for (let k = 0; k < aseg; k++) {
      tf(M.amph, arcPt(ra, k, z), arcPt(rb, k, z), arcPt(rb, k + 1, z), [0, 0, 1])
      tf(M.amph, arcPt(ra, k, z), arcPt(rb, k + 1, z), arcPt(ra, k + 1, z), [0, 0, 1])
      const m = arcPt(ra, k + 0.5, 0)
      qf(M.amph, arcPt(ra, k, zp), arcPt(ra, k + 1, zp), arcPt(ra, k + 1, z), arcPt(ra, k, z), [AMPH[0] - m[0], AMPH[1] - m[1], 0])
    }
  }
  // The stage: a timber half-disc at the edge, the pots under it.
  const st = AMPH_Z - 0.6
  const stageC: V3 = [AMPH[0], AMPH[1], st]
  for (let k = 0; k < aseg; k++) tf(M.amph, stageC, arcPt(AMPH_R0, k, st), arcPt(AMPH_R0, k + 1, st), [0, 0, 1])
  qf(M.amph, [-XB, AMPH[1] - AMPH_R0 * 1.2, st], [AMPH[0], AMPH[1] - AMPH_R0 * 1.2, st], [AMPH[0], AMPH[1] + AMPH_R0 * 1.2, st], [-XB, AMPH[1] + AMPH_R0 * 1.2, st], [0, 0, 1])

  // ---- Trees: green crowns, thicker on the high western half and along
  // the edges, none on the Amph.
  const rand = rng(55)
  const want = detail ? 120 : 36
  let placed = 0, cx0 = 0, cy0 = 0
  for (let tries = 0; placed < want && tries < 8000; tries++) {
    // Clumps of three along the rim (two trees in three), the rest scattered.
    let x: number, y: number
    if (placed % 3 === 0) {
      const side = Math.floor(rand() * 4), a = (rand() * 2 - 1) * 0.9, d = 3 + rand() * 4
      ;[cx0, cy0] = side === 0 ? [a * XB, -YB + d] : side === 1 ? [XB - d, a * YB] : side === 2 ? [a * XB, YB - d] : [-XB + d, a * YB]
      if (rand() < 0.35) [cx0, cy0] = [(rand() * 2 - 1) * (XB - 8), (rand() * 2 - 1) * (YB - 8)]
      x = cx0; y = cy0
    } else {
      x = cx0 + (rand() - 0.5) * 7; y = cy0 + (rand() - 0.5) * 7
    }
    if (Math.abs(x) > XB - 2.5 || Math.abs(y) > YB - 2.5) continue
    if (MOUNDS.some(([mx, my, mr]) => Math.hypot(x - mx, y - my) < mr)) continue
    if (inAmph(x, y) > 0 || Math.hypot(x - AMPH[0], y - AMPH[1]) < AMPH_R1 + 2) continue
    placed++
    const z = Z(x, y), h = 6 + rand() * 5, r = 3.0 + rand() * 1.6, conifer = rand() < 0.45
    if (detail) {
      // a trunk and an 8-sided crown
      M.tree.loft([ring(x, y, 0.2, 0.2, 2, z - 0.2, 4), ring(x, y, 0.2, 0.2, 2, z + h * 0.35, 4)])
      const prof: [number, number][] = conifer
        ? [[0.1, 0.25], [1, 0.3], [0.55, 0.65], [0.02, 1]]
        : [[0.1, 0.3], [0.85, 0.42], [1, 0.62], [0.7, 0.85], [0.05, 1]]
      const rs = prof.map(([f, t]) => ring(x, y, r * f, r * f, 2, z + h * t, 8))
      M.tree.loft(rs)
      M.tree.cap(rs[0], false)
      M.tree.cap(rs[rs.length - 1], true)
    } else {
      // an octahedral crown on the ground: bottom point, a square waist, top point
      const w = conifer ? 0.3 : 0.5
      const bot: V3 = [x, y, z - 0.2], topP: V3 = [x, y, z + h]
      const a0 = rand() * Math.PI
      const mid = [0, 1, 2, 3].map((k): V3 => [x + r * Math.cos(a0 + (k * Math.PI) / 2), y + r * Math.sin(a0 + (k * Math.PI) / 2), z + h * w])
      for (let k = 0; k < 4; k++) {
        const m0 = mid[k], m1 = mid[(k + 1) % 4]
        M.tree.tri(m0, m1, topP)
        M.tree.tri(m1, m0, bot)
      }
    }
  }

  // ---- The gangways, from OSM.
  // The South Bridge runs level into the island under the arch pot, to a
  // wall where the path turns up inside.
  const sShore = toModel(85.3, -66.3), sIn = XB - 5, sIsland: [number, number] = [sIn, sby]
  gangway(M, sShore, sIsland, 6.5, 3.5, 3.9, detail)
  qf(M.pot, [sIn, sby - 4, 2.9], [sIn, sby + 4, 2.9], [sIn, sby + 4, Z(sIn, sby + 4)], [sIn, sby - 4, Z(sIn, sby - 4)], [1, 0, 0])
  const nShore = toModel(106.2, 24.4), nCorner = toModel(42.0, 59.5), nIsland: [number, number] = [nbx, YB - 0.3]
  const zCorner = 3.5 + (Z(nIsland[0], nIsland[1]) - 3.5) * 0.75
  gangway(M, nShore, [nCorner[0] + 3.75, nCorner[1]], 7.5, 3.5, zCorner, detail)
  gangway(M, [nCorner[0], nCorner[1] + 3.75], nIsland, 7.5, zCorner, Z(nIsland[0], nIsland[1]), detail)

  return M
}

// ------------------------------------------------------------- output ----
// Colours from the daylight photos, pulled to the palette's lightness: pale
// grey concrete pots and gangways; a muted green deck and darker trees; the
// rust-brown weathering steel of the railings and retaining walls; The
// Amph's warm timber seats.
const underlit = (_p: V3, n: V3) => (n[2] < -0.15 ? 0.7 : n[2] < 0.3 ? 0.35 : 0)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.pot, material: { ...finish('little-island-concrete', 0xdcd9d1), floodlight: underlit } },
    { part: M.plant, material: finish('little-island-planting', 0x95a273) },
    { part: M.tree, material: finish('little-island-trees', 0x66804f) },
    { part: M.steel, material: finish('little-island-weathering-steel', 0x93694f) },
    { part: M.amph, material: finish('little-island-amph-timber', 0xb98f71) },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Little Island', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: BEARING, elevation: 0,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

await write('nyc-little-island.glb', materials(build(false)), 6500, 250 * 1024)
await write('nyc-little-island.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
