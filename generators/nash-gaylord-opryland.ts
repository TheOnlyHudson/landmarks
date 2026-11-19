/**
 * Gaylord Opryland Resort & Convention Center, Nashville (1977 onward):
 * procedural, CC0-1.0.
 * bun generators/nash-gaylord-opryland.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of OSM relation/4756295 (outer way/44176788 less the courtyard,
 * inner way/336195004): -86.6942682, 36.2116579. y = 0 is the lowest lidar
 * ground under the outline on the west side (ground_min + 2.0 m); the ground
 * rises about 6 m to the courtyard and the Magnolia front in the north-east.
 *
 * Form: one huge low complex. West, round the three glass atria, the
 * cream stucco hotel wings (six storeys over a red-brick arcade storey,
 * white cornices, round-ended wings), flat-roofed at ~21.5 m: the Garden
 * Conservatory's long glass ridge roof with white hip ends (NW), the
 * Cascades' glass hip rising to its west end (N), and the Delta's broad
 * glass roof (centre): a white rim, glass up to a ring and down to the drum
 * of a central glass dome with a white lantern. East, the original
 * Magnolia hotel and its wings under slate mansards with white cupolas,
 * round a courtyard (the OSM inner ring, left open); south, the
 * convention halls under a deep slate hip round a sunken flat roof.
 * Everything stands on a 12.5 m base over the whole OSM outline (the
 * west rotunda's height), so nothing in the outline is left undrawn.
 *
 * OSM: relation/4756295 (Q5528863), building=hotel, multipolygon: outer
 * way/44176788, inner way/336195004 (the courtyard). No heights or parts;
 * no other building way lies inside it. Outline simplified (1.2 m).
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022, 2 m grid over the whole
 * site, heights above y = 0: wings 21.3–21.7; Conservatory eave 22.6, ridge
 * 29.5; Cascades rim 21.7, ridge 29.5 (east) to ~33–35 at its west apex;
 * Delta rim 24.5–25.5, glass ring 35, the valley round the dome 29.5, dome
 * crown 41.4 (a flagpole reads 61); NW and NE wings 18; Magnolia mansard
 * eaves 15, tops 19–21.6, the south block's roof well 18.5; cupolas 31 and
 * 35; convention eave 21.5, ridge ring 27.8, well 24.3; west rotunda 12.5.
 * NAIP (USDA, public domain, 0.6 m): the plan of every atrium, rim and wing,
 * roof colours (dark slate, white rims, green-blue glass). Positions of the
 * Delta dome taken from lidar (NAIP leans it ~9 m west).
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/nash/work/nash-gaylord-opryland/photos), all
 * Antony-22, CC BY-SA 4.0:
 *  g9  "Opryland Hotel 2022q.jpg": the Delta's south-west wings from the
 *      west: cream stucco, red-brick arcade storey, round ends, cornice and
 *      balustrade, the Delta's green glass roof and lantern behind.
 *  g10 "Opryland Hotel 2022r.jpg": an entrance porte-cochère and the cream
 *      wings with a brick arcade base and a round corner tower.
 *  g8  "Opryland Hotel 2022p.jpg": the courtyard: red-brick pavilions, slate
 *      hipped roofs, a white cupola, cream wings with mansards and dormers.
 *  g7  "Opryland Hotel 2022o.jpg": the courtyard garden, cream wings with
 *      white pilasters.
 *  ha..hn "Opryland Hotel 2022a–n.jpg": the atria from inside (the glass
 *      roofs' white structure and the central dome).
 *
 * Estimated: the window bays (7 m, one panel per two or three storeys);
 * the brick storey (4.5 m above the local ground); the cupolas' profiles;
 * the Delta's ring radii (scaled from the rim, clamped where the dome is
 * near the east rim); the ground rise used for the brick band (0.5 / 3 / 6
 * m by area, from lidar).
 * Invented / not photo-confirmed: the Magnolia entrance portico (six white
 * two-storey columns under a flat entablature on the north entrance block
 * at the head of the circle drive). No licensed photo of that front was
 * found; NAIP shows a flat-roofed block there. Treat it as a doubt.
 * Left out: dormers, balustrades, the porte-cochères and canopies, rooftop
 * plant except three boxes on the service block, the glass pyramid at the
 * Conservatory's north end, the separate buildings north (way/878003549)
 * and south (Events Center, way/642931323), which are not in the relation.
 * Night: the wings' windows glow (`window`); the atria's glass stays dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, finishGlb, writeModel, lathe, arc } from './sea-tacoma-union-station'
import { triO, quadO } from './nash-tennessee-state-capitol'

const OUTER: XY[] = [[-269.5, 111.0], [-254.6, 112.5], [-253.7, 102.7], [-223.3, 108.1], [-223.1, 106.8], [-205.1, 106.6], [-199.1, 156.6], [-196.2, 156.5], [-192.7, 164.8], [-186.4, 166.6], [-186.2, 169.1], [-141.9, 163.4], [-141.9, 161.2], [-135.3, 158.6], [-132.3, 152.5], [-129.3, 152.1], [-127.9, 165.0], [-125.4, 164.7], [-123.6, 168.6], [-119.4, 171.6], [-113.6, 172.2], [-108.7, 170.3], [-104.9, 161.7], [-103.2, 161.5], [-104.8, 148.8], [-101.3, 148.3], [-97.4, 153.9], [-89.2, 154.5], [-89.0, 156.6], [-4.1, 146.1], [-4.3, 144.6], [9.0, 137.0], [14.7, 123.5], [16.3, 124.3], [17.4, 121.8], [21.1, 123.1], [19.9, 125.8], [25.1, 127.8], [22.1, 128.1], [-4.9, 191.3], [-1.2, 192.8], [-1.1, 198.3], [1.0, 201.4], [7.4, 203.5], [11.3, 202.8], [14.3, 199.1], [18.0, 200.7], [44.5, 137.3], [37.3, 134.3], [35.8, 130.3], [43.5, 111.8], [49.2, 111.4], [51.4, 128.5], [72.7, 125.7], [72.4, 122.7], [74.6, 122.5], [72.7, 136.5], [97.7, 139.8], [99.8, 126.0], [102.0, 126.7], [101.3, 130.2], [121.0, 138.0], [127.0, 124.0], [132.6, 126.1], [135.0, 143.3], [132.4, 147.4], [124.6, 148.1], [133.1, 216.5], [137.0, 215.9], [138.7, 220.0], [147.3, 222.7], [151.0, 221.6], [153.9, 213.7], [157.5, 213.2], [149.1, 144.8], [142.9, 142.3], [141.8, 131.2], [143.1, 123.8], [186.1, 129.5], [190.4, 99.6], [136.7, 92.5], [139.4, 74.6], [151.4, 75.8], [153.2, 63.5], [160.0, 58.5], [161.4, 47.0], [168.2, 47.5], [186.9, -98.2], [164.3, -102.4], [165.2, -108.6], [168.3, -108.4], [176.5, -173.0], [167.4, -174.8], [168.5, -183.7], [93.6, -195.2], [96.2, -213.1], [11.9, -225.1], [3.7, -224.8], [-9.8, -132.8], [-0.8, -131.8], [-1.4, -123.7], [-8.2, -122.7], [-8.9, -124.6], [-39.4, -119.4], [-41.5, -126.0], [-43.7, -125.2], [-51.9, -146.6], [-70.7, -139.3], [-63.7, -131.7], [-57.1, -134.2], [-52.5, -121.9], [-54.7, -121.0], [-52.5, -115.4], [-82.1, -93.3], [-132.7, -131.9], [-143.9, -130.9], [-149.5, -124.4], [-148.6, -112.5], [-97.4, -73.2], [-109.7, -44.6], [-190.3, -55.0], [-190.6, -53.2], [-195.6, -52.0], [-199.2, -48.6], [-200.4, -39.2], [-193.1, -30.5], [-113.2, -19.8], [-106.2, 23.6], [-111.7, 37.4], [-116.1, 35.9], [-117.1, 29.1], [-123.4, 24.4], [-122.4, 22.5], [-135.3, 16.1], [-134.6, 14.3], [-137.8, 12.9], [-134.3, 4.9], [-139.3, 2.8], [-142.7, 10.8], [-163.9, 4.7], [-164.7, 7.0], [-172.6, 8.0], [-176.8, 14.4], [-178.9, 13.8], [-198.5, 60.1], [-208.8, 55.9], [-235.8, 52.4], [-237.8, 65.1], [-248.9, 63.8], [-250.1, 71.2], [-260.2, 69.9], [-261.4, 77.3], [-265.0, 77.0], [-265.4, 80.0], [-272.8, 85.8], [-274.9, 90.0], [-274.6, 99.8], [-269.1, 106.5]]
const COURT: XY[] = [[49.7, 91.9], [55.7, 96.1], [72.2, 94.4], [78.4, 45.8], [86.0, 46.7], [90.0, 17.9], [87.4, 17.6], [90.9, -8.0], [93.6, -7.7], [95.8, -23.6], [89.8, -24.5], [92.1, -40.8], [90.4, -40.8], [88.5, -34.1], [35.2, -36.9], [35.2, -34.3], [44.0, -33.9], [41.1, 26.0], [37.3, 26.0], [37.5, 30.4], [41.0, 30.1]]

// ================================================================ geometry kit

/** Ear-clipping triangulation of a counter-clockwise ring; points that coincide with a corner don't block an ear (bridged holes). */
function tri2(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const same = (p: XY, q: XY) => Math.abs(p[0] - q[0]) < 1e-6 && Math.abs(p[1] - q[1]) < 1e-6
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (cr(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === i0 || j === i1 || j === i2) continue
        const p = r[j]
        if (same(p, a) || same(p, b) || same(p, c)) continue
        if (cr(a, b, p) >= -1e-9 && cr(b, c, p) >= -1e-9 && cr(c, a, p) >= -1e-9) { ok = false; break }
      }
      if (!ok) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A counter-clockwise ring with a (clockwise) hole bridged in from its nearest outer vertex. */
function bridge(outer: XY[], hole: XY[]): XY[] {
  let bi = 0, bj = 0, bd = Infinity
  outer.forEach((p, i) => hole.forEach((q, j) => { const d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < bd) { bd = d; bi = i; bj = j } }))
  const h = [...hole.slice(bj), ...hole.slice(0, bj), hole[bj]]
  return [...outer.slice(0, bi + 1), ...h, ...outer.slice(bi)]
}

/** A flat (or planar) cap over a ring at height h(x, y), facing up or down. */
function cap(p: Part, ring: XY[], h: (x: number, y: number) => number, up = true) {
  for (const [a, b, c] of tri2(ring)) {
    const P = (q: XY): V3 => [q[0], q[1], h(q[0], q[1])]
    triO(p, P(ring[a]), P(ring[b]), P(ring[c]), [0, 0, up ? 1 : -1])
  }
}

/** A vertical wall a→b (outside on the right of a counter-clockwise ring) from z0 to z1. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number) {
  if (z1 - z0 < 1e-3) return
  quadO(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [b[1] - a[1], a[0] - b[0], 0])
}

/** Offset a counter-clockwise ring inward by d (mitred corners). */
function inset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], c = r[(i + 1) % n]
    const u = [p[0] - a[0], p[1] - a[1]], v = [c[0] - p[0], c[1] - p[1]]
    const lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1])
    const n0 = [-u[1] / lu, u[0] / lu], n1 = [-v[1] / lv, v[0] / lv] // inward (left) normals
    const m = [n0[0] + n1[0], n0[1] + n1[1]], dot = 1 + n0[0] * n1[0] + n0[1] * n1[1]
    const k = d / Math.max(dot, 0.3)
    return [p[0] + m[0] * k, p[1] + m[1] * k] as XY
  })
}

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** The ground's rise above y = 0 along the walls (lidar, rounded): west and south ~0.5, the north-west wings ~3, the courtyard and Magnolia front ~6. */
function ground(x: number, y: number) {
  if (x > 25 && x < 135 && y > -40) return 6
  if (y > 120) return x > -20 ? 5 : 3
  return 0.5
}

type Kit = { stucco: Part; brick: Part; trim: Part; roof: Part; win: Part; glass: Part }

/** A panel flat on the wall a→b, s0..s1 along it, z0..z1, 0.06 m out. */
function panel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [t[1], -t[0]]
  const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * 0.06, a[1] + t[1] * s + n[1] * 0.06, z]
  quadO(p, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), [n[0], n[1], 0])
}

/**
 * The walls of one mass over a counter-clockwise ring, z0..z1: a red-brick
 * arcade storey at the bottom (where it is above ground), cream stucco, a
 * white cornice; window panels in bays of about 7 m, each panel two or three
 * storeys, with wall between the bays and the groups. `skip` leaves out
 * edges hidden against a neighbour.
 */
function dress(k: Kit, ring: XY[], z0: number, z1: number, skip: (a: XY, b: XY) => boolean = () => false, corn = 0.8) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (skip(a, b)) continue
    const g = ground((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    const br = Math.min(z1 - corn, Math.max(z0, g + 4.5))
    wall(k.brick, a, b, z0, br)
    wall(k.stucco, a, b, br, z1 - corn)
    wall(k.trim, a, b, Math.max(z0, z1 - corn), z1)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const lo = Math.max(br + 0.9, g + 5.4), hi = z1 - corn - 1.0
    if (L < 6 || hi - lo < 2) continue
    const nb = Math.max(1, Math.round(L / 7)), bw = L / nb, pw = Math.min(3.8, bw * 0.55)
    // groups of storeys: one panel up to ~8 m tall, else two with a spandrel between
    const groups: XY[] = hi - lo > 8.5 ? [[lo, (lo + hi) / 2 - 0.5], [(lo + hi) / 2 + 0.5, hi]] : [[lo, hi]]
    for (let j = 0; j < nb; j++) {
      const s = (j + 0.5) * bw
      for (const [g0, g1] of groups) panel(k.win, a, b, s - pw / 2, s + pw / 2, g0, g1)
    }
  }
}

/** A flat-roofed mass: dressed walls and a roof cap. */
function mass(k: Kit, ring: XY[], z0: number, z1: number, skip?: (a: XY, b: XY) => boolean) {
  const r = ccw(ring)
  dress(k, r, z0, z1, skip)
  cap(k.roof, r, () => z1)
}

/**
 * A mansard-roofed mass: dressed walls to the eave, slate slopes rising d
 * metres inward to `top`, a flat top; with `dip`, the flat top is sunk to
 * that height inside a short wall (a roof well, as on the convention halls).
 */
function mansard(k: Kit, ring: XY[], z0: number, eave: number, top: number, d: number, dip?: number, skip?: (a: XY, b: XY) => boolean) {
  const r = ccw(ring), q = inset(r, d)
  dress(k, r, z0, eave, skip)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    const out: V3 = [r[j][1] - r[i][1], r[i][0] - r[j][0], (d * 1.0) / Math.max(top - eave, 0.5)]
    quadO(k.roof, [r[i][0], r[i][1], eave], [r[j][0], r[j][1], eave], [q[j][0], q[j][1], top], [q[i][0], q[i][1], top], out)
  }
  if (dip === undefined) { cap(k.roof, q, () => top); return }
  const w = inset(q, 0.8)
  for (let i = 0; i < q.length; i++) {
    const j = (i + 1) % q.length
    quadO(k.roof, [q[i][0], q[i][1], top], [q[j][0], q[j][1], top], [w[j][0], w[j][1], top], [w[i][0], w[i][1], top], [0, 0, 1])
    wall(k.stucco, w[j], w[i], dip, top) // the well's inner face, looking in
  }
  cap(k.roof, w, () => dip)
}

/**
 * A glass hipped roof over a quadrilateral q0..q3 (counter-clockwise) whose
 * ridge runs from A (near the end q0-q1) to B (near the end q2-q3): a flat
 * white rim `rim` wide at `eave`, glass slopes, end hips in `hips`.
 */
function glassHip(k: Kit, q: XY[], A: V3, B: V3, eave: number, rim: number, hips: Part) {
  const o = ccw(q), w = inset(o, rim)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    quadO(k.trim, [o[i][0], o[i][1], eave], [o[j][0], o[j][1], eave], [w[j][0], w[j][1], eave], [w[i][0], w[i][1], eave], [0, 0, 1])
  }
  const P = (p: XY): V3 => [p[0], p[1], eave]
  const up = (a: XY, b: XY): V3 => [b[1] - a[1], a[0] - b[0], 3]
  quadO(k.glass, P(w[1]), P(w[2]), B, A, up(w[1], w[2]))
  quadO(k.glass, P(w[3]), P(w[0]), A, B, up(w[3], w[0]))
  triO(hips, P(w[0]), P(w[1]), A, up(w[0], w[1]))
  triO(hips, P(w[2]), P(w[3]), B, up(w[2], w[3]))
}

// ================================================================ the model

const HB = 12.5 // the low base over the whole outline (the west rotunda's roof, lidar 12.5)
const WING = 21.5 // the cream hotel wings round the atria (lidar 21.3–21.7)
// The Delta: rim polygon (NAIP and lidar), the centre of its dome (lidar apex)
const DELTA: XY[] = [[-100, -50], [-80, -82], [-48, -102], [2, -102], [24, -80], [24, -20], [20, -15], [20, 66], [-58, 68], [-100, 12]]
const DC: XY = [-9, -15]

function build() {
  const k: Kit = { stucco: new Part(), brick: new Part(), trim: new Part(), roof: new Part(), win: new Part(), glass: new Part() }

  // ------------------------------------------------------------ the base: the whole OSM outline, courtyard open
  const outer = ccw(OUTER)
  dress(k, outer, 0, HB)
  dress(k, COURT, 0, HB) // clockwise: the courtyard is outside
  cap(k.roof, bridge(outer, COURT), () => HB)

  // ------------------------------------------------------------ the cream wings (lidar: the whole west of the complex stands at ~21.5)
  // One mass over the outline west of the Delta's east side, from where the
  // NW wing meets the Magnolia (22, 128) round the west to the convention
  // halls (-8, -123), closed along the Delta's south and east rims; the low
  // west rotunda (12.5) is left at the base height.
  {
    const near = (q: XY) => outer.reduce((bi, p, i) => (Math.hypot(p[0] - q[0], p[1] - q[1]) < Math.hypot(outer[bi][0] - q[0], outer[bi][1] - q[1]) ? i : bi), 0)
    const iN = near([22, 128]), iS = near([-8, -123])
    const arcW: XY[] = []
    for (let i = iN; ; i = (i + 1) % outer.length) { arcW.push(outer[i]); if (i === iS) break }
    const fill = [...arcW.filter((p) => p[0] > -204.5), [2, -102], [24, -80], [24, -20], [22, 100]] as XY[]
    mass(k, fill, HB, WING)
  }
  // the round tower on the north front, a storey higher
  mass(k, [[-129, 146], [-105, 146], [-103, 162], [-109, 170], [-114, 172], [-119, 172], [-125, 165], [-128, 165]], WING, WING + 1.5)
  // between the Delta and the courtyard, and the service block south of it
  mass(k, rect(20, -36, 41, 100), HB, WING)
  mass(k, rect(24, -104, 96, -38), HB, WING)
  for (const [x, y] of [[40, -80], [62, -66], [78, -88]] as XY[]) mass(k, rect(x - 5, y - 4, x + 5, y + 4), WING, WING + 3.2)

  // ------------------------------------------------------------ the Magnolia (1977) and its wings: slate mansards
  mansard(k, [[22, 128], [44, 137], [18, 201], [14, 199], [7, 204], [1, 201], [-1, 193], [-5, 191]], HB, 14.5, 18.0, 5)
  mansard(k, [[125, 148], [149, 145], [158, 213], [154, 214], [151, 222], [147, 223], [139, 220], [137, 216], [133, 216]], HB, 14.5, 18.0, 5)
  mansard(k, rect(48, 100, 190, 127), HB, 15, 20.5, 6)
  mansard(k, rect(121, 124, 143, 146), HB, 15, 20, 5)
  mansard(k, rect(73, 122, 99, 138), HB, 16.5, 21, 5)
  mansard(k, rect(84, 47, 150, 100), HB, 14.5, 19, 6)
  mansard(k, rect(94, -36, 176, 48), HB, 15, 21.5, 8)
  mansard(k, rect(96, -105, 184, -36), HB, 15, 21.4, 9, 18.5)
  mansard(k, rect(100, -188, 170, -105), HB, 15, 20.5, 9)
  // the convention halls: a deep slate hip round a sunken flat roof
  mansard(k, [[4, -224], [97, -212], [97, -105], [-9, -108]], HB, 21.5, 27.8, 18, 24.3)

  // the Magnolia front: a two-storey white portico on the entrance block (north)
  {
    const g = ground(86, 140)
    for (let i = 0; i < 6; i++) {
      const x = 76.5 + (i * 19) / 5
      lathe(k.trim, x, 140.2, [[0.75, g], [0.75, g + 0.5], [0.6, g + 0.6], [0.5, 15.0], [0.75, 15.4]], 10)
    }
    const slab = rect(74.5, 137.8, 97.5, 141.4)
    dress({ ...k, win: new Part(), brick: k.trim, stucco: k.trim }, slab, 15.2, 16.9)
    cap(k.trim, slab, () => 16.9)
  }
  // cupolas on the Magnolia roofs (white, lidar 31 and 35 m)
  for (const [x, y, z0, top] of [[122, 22, 21.5, 31], [128, -60, 18.5, 35]] as [number, number, number, number][]) {
    const h = top - z0
    lathe(k.trim, x, y, [[3.6, z0], [3.6, z0 + 0.45 * h], [3.9, z0 + 0.5 * h], [3.2, z0 + 0.52 * h]], 8)
    lathe(k.roof, x, y, [[3.2, z0 + 0.52 * h], [2.6, z0 + 0.66 * h], [1.4, z0 + 0.76 * h], [0.5, z0 + 0.8 * h]], 8)
    lathe(k.trim, x, y, [[0.5, z0 + 0.8 * h], [0.25, z0 + 0.9 * h], [0.05, top], [0, top]], 6)
  }

  // ------------------------------------------------------------ the glass atria
  // Garden Conservatory (1983): a long glass ridge roof, white hips at the ends
  glassHip(k, [[-180, 42], [-128, 48], [-136, 146], [-190, 146]], [-156, 64, 29.5], [-162, 126, 29.5], 22.6, 3, k.trim)
  // Cascades (1988): a glass hip rising to its west end
  glassHip(k, [[-6, 104], [-10, 140], [-124, 146], [-112, 62]], [-40, 112, 29.5], [-84, 102, 35.5], 22.0, 7, k.glass)
  // Delta (1996): a white rim, a broad glass roof up to a ring, down to the drum of the central dome
  {
    const D = ccw(DELTA)
    dress(k, D, WING, 24.5)
    const R = (p: XY, t: number, min: number, max: number): XY => {
      const v = [p[0] - DC[0], p[1] - DC[1]], L = Math.hypot(v[0], v[1])
      const r = Math.max(min, Math.min(max, t * L))
      return [DC[0] + (v[0] / L) * r, DC[1] + (v[1] / L) * r]
    }
    const rimIn = inset(D, 9)
    const ridge = D.map((p) => R(p, 0.55, 21, 46))
    const valley = D.map((p) => R(p, 0.3, 16.5, 26))
    for (let i = 0; i < D.length; i++) {
      const j = (i + 1) % D.length
      const at = (a: XY, z: number): V3 => [a[0], a[1], z]
      const n: V3 = [D[j][1] - D[i][1], D[i][0] - D[j][0], 4]
      quadO(k.trim, at(D[i], 24.5), at(D[j], 24.5), at(rimIn[j], 24.5), at(rimIn[i], 24.5), [0, 0, 1])
      quadO(k.glass, at(rimIn[i], 24.5), at(rimIn[j], 24.5), at(ridge[j], 35), at(ridge[i], 35), n)
      quadO(k.glass, at(ridge[i], 35), at(ridge[j], 35), at(valley[j], 29.5), at(valley[i], 29.5), [-n[0], -n[1], 4])
    }
    cap(k.glass, valley, () => 29.5)
    // the central dome: a glazed drum, a glass dome, the white lantern (lidar 41.5 at the crown)
    lathe(k.trim, DC[0], DC[1], [[15, 29.5], [15, 30.6], [14.2, 30.6]], 16)
    lathe(k.glass, DC[0], DC[1], [[14.2, 30.6], [14.2, 33.5], [12.6, 36.6], [9.6, 39.2], [5.2, 41.0], [3.2, 41.4]], 16)
    lathe(k.trim, DC[0], DC[1], [[3.2, 41.4], [3.2, 43.4], [3.6, 43.6], [2.0, 44.6], [0.3, 46.0], [0, 46.0]], 10)
  }

  const stucco = finish('opryland-stucco', 0xece0c7)
  return finishGlb('Gaylord Opryland Resort & Convention Center', [
    { part: k.stucco, material: stucco },
    { part: k.brick, material: finish('opryland-brick', 0xb87464) },
    { part: k.trim, material: PALETTE.trim },
    { part: k.roof, material: PALETTE.roof },
    { part: k.win, material: PALETTE.window },
    { part: k.glass, material: { ...PALETTE.glass, color: 0x9fc3cc } },
  ], { bearing: 0, height: 46, replaces: ['relation/4756295'] }, 6500)
}

if (import.meta.main) await writeModel('nash-gaylord-opryland', build())
