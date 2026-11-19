/**
 * King Abdullah I Mosque, Abdali, Amman (1982-1989).
 *
 * One model (x east-ish, y north-ish, metres, turned to bearing 14 so the
 * entrance portico faces local -y, i.e. compass 194; origin at the OSM
 * outline's centroid 35.912879 E, 31.961143 N, on the lowest ground):
 * the octagonal prayer hall with its centre portal, pylons and blue
 * calligraphy bands on every face, the pleated star roof with its blue eave
 * lines, the drum of 40 real recessed windows, the 35 m turquoise mosaic
 * dome with its two dark-blue pattern bands and bronze finial, the two
 * minarets with their corbelled crowns, the white precinct walls on the OSM
 * outline, the open entrance portico on its paired piers, the two small
 * blue-domed kiosks with their pointed-arch niches, and the east wing.
 *
 * Sources (open only; no commercial imagery or 3D tiles):
 * - OSM (API map call, 2026-11-18): way/333946090 (building=mosque,
 *   levels 2) and the dome part way/1328040766 (roof:shape=dome, 35 m
 *   across), the streets round it.
 * - Published: octagonal hall for 3,000, dome 35 m across and 31 m high,
 *   built without columns; two minarets, the second added 1988-89
 *   (ar.wikipedia, مسجد الملك عبد الله الأول; en.wikipedia).
 * - Photos (Wikimedia Commons; all EVIDENCE):
 *   k01 "King Abdullah I Mosque from balcony across the street.jpg", Trldp,
 *     CC BY-SA 4.0: the hall from the south-west, above: faces, pylons,
 *     pleated roof, drum windows, dome bands, both minarets.
 *   k02 "King Abdullah I Mosque with Our Lady Church (cropped).jpg", Trldp,
 *     CC BY-SA 4.0: the same side, the east minaret and a blue kiosk dome.
 *   k03 "King Abdullah I Mosque, Amman, Jordan1.jpg", Diego Delso,
 *     CC BY-SA 3.0: the portico, kiosks and their pointed niches, minaret crowns.
 *   k05 "Amman BW 29.JPG", Berthold Werner, CC BY 3.0: the front, level:
 *     heights, the precinct wall, portico, kiosks, dome profile.
 *   k06 "King Abdullah I mosque in Amman, 2024.jpg", Makeandtoss, CC0: from
 *     afar: the star roof, dome bands, minaret proportions.
 *   k07 "Jordan Amman King Abdullah I mosque.jpg", Eurovaran, CC BY-SA 4.0.
 *   k08 "King Abdullah I Mosque, Amman.jpg", Syed Wali Peeran, CC BY-SA 4.0.
 *   k10 "King Abdullah I Mosque (Amman).jpg", Dennis G. Jarvis, CC BY-SA 2.0:
 *     the portico's piers and calligraphy beam, the inner blue door.
 *   k11 "Amman skyline..jpg", young shanahan, CC BY 2.0: both minarets lit.
 * - Terrain: Mapterhorn (`tools/terrain.ts`); no lidar or NAIP here.
 * Look-only references: none.
 *
 * Numbers:
 * - Dome 35 m across, apex 31 m (published); drum 17.8-22.2 m and the
 *   shallow cap (k05: cap about a quarter as tall as wide).
 * - Hall: octagon 46 m across flats (k01: 1.3 dome widths), walls 9.5 m,
 *   pylons 11.5 m, star roof from the walls to the drum at 17.8 m
 *   (k01, k05, scaled on the dome). Estimated.
 * - Minarets 46 m: photo-scaled on the dome (k05, level: about 42 m; k01,
 *   k02, k06: 48-58 m, all with unknown depths); shaft 3.5 m square, a
 *   crown of 8 corbelled ribs (corners and face middles) 6.5 m across, dark
 *   openings between at 0.60-0.80 of the height,
 *   upper stage 2.5 m (k03, k10).
 *   Estimated; no published height found.
 * - Precinct wall 9 m (k05: it hides the hall's walls from the street),
 *   portico 14.4 x 7 m and 11.5 m high, standing open in front of the gate wall, kiosks 8 m square and 9 m with 7.6 m
 *   domes (k03, k05, k10). Estimated.
 * - Colours from the photos, pulled to the palette: limestone #e6dccb
 *   (k01 sunlit #dccdba); star roof pale grey #dcdfdd (k01 #98a6ab
 *   in shade); dome pale turquoise-grey #8cbfcf (k01 #7ea8bb, k01 sunlit #8db4c3,
 *   k06 #6ca1c2); pattern bands, eave lines,
 *   calligraphy and the kiosk domes deep blue #2f5f8f (k01 #46627a, k08
 *   #0b3b66); finials dark bronze #4a4f57.
 *
 * Doubts:
 * - No open aerial: the plan of the precinct (where the forecourt, the
 *   portico and the minarets stand) is inferred from the photos' viewpoints
 *   and the OSM outline: the portico faces Sulayman al-Nabulsi Street (south),
 *   with a minaret at each front corner. The east wing is a plain block
 *   standing for the library, museum and offices (OSM maps them as one).
 * - The assignment named one minaret; every photo and ar.wikipedia show two.
 * - The OSM outline is roughly traced, so the kiosks sit a little off
 *   symmetric to follow it.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { type Mat, type P2, cap, facade, lathe, ngon, oquad, otri, panels, walls, inset, ccw, writeModel, box } from './medina-prophets-mosque'

const TAU = Math.PI * 2
export const KAM = { lng: 35.912879, lat: 31.961143, bearing: 14 }

/** way/333946090 in the turned frame (bearing 14), from the anchor. */
const OUTLINE: P2[] = [[-29.5, 29.7], [-50.7, -20.0], [-46.2, -29.2], [-43.4, -33.8], [-34.9, -35.7], [-26.0, -42.8], [-20.8, -44.5], [-9.1, -40.5], [-1.5, -35.8], [5.7, -32.8], [10.9, -33.6], [30.9, -41.7], [34.8, -43.4], [40.7, -40.2], [39.2, -37.5], [36.7, -36.4], [33.2, -38.0], [29.2, -36.0], [27.3, -31.1], [31.3, -18.7], [40.8, -15.3], [42.7, -17.3], [47.9, -15.9], [47.0, -12.8], [44.8, -10.7], [41.3, -10.6], [39.9, -6.8], [47.5, -3.9], [48.7, 0.0], [38.3, 23.1], [40.5, 33.9], [37.0, 45.1], [19.7, 39.6], [16.2, 41.0], [14.5, 38.5], [10.9, 37.6], [-8.0, 44.9], [-16.0, 39.2], [-17.5, 41.3], [-25.7, 36.0], [-23.9, 33.6]]

const C: P2 = [-8.6, 0.4] // the dome part's centre
const APO = 23, WALL = 9.5, PEAK = 13.0, DRUM0 = 17.8, DRUM1 = 22.2, R = 17.5, APEX = 31
const PRECINCT = 9, MIN_H = 46
const PORTICO: P2 = [-8.6, -39.0]

function build(): Mat[] {
  const stone = new Part(), roof = new Part(), dome = new Part(), blue = new Part(), win = new Part(), bronze = new Part()

  // -------------------------------------------------------------- hall ---
  const RV = APO / Math.cos(Math.PI / 8)
  const oct = ngon(C[0], C[1], RV, 8, Math.PI / 8) // flats face ±x, ±y
  for (let i = 0; i < 8; i++) {
    const A = oct[i], B = oct[(i + 1) % 8]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: P2 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n: P2 = [u[1], -u[0]]
    const at = (s: number, d = 0): P2 => [A[0] + u[0] * s + n[0] * d, A[1] + u[1] * s + n[1] * d]
    // the wall with its tall rectangular portal (k01: blue lattice doors)
    facade(stone, win, A, B, 0, WALL, [{ s0: L / 2 - 1.9, s1: L / 2 + 1.9, zb: 0, zs: 7.6, head: 'flat', depth: 1.4 }], { seg: 2 })
    // calligraphy: three rows of deep-blue bands on each half (k01)
    const rows = [5.4, 6.5, 7.6]
    panels(blue, A, B, rows.flatMap((z) => [{ s0: 1.8, s1: L / 2 - 3.4, zb: z, zs: z + 0.55 }, { s0: L / 2 + 3.4, s1: L - 1.8, zb: z, zs: z + 0.55 }]), 2)
    // the portal's two pylons, standing proud and above the wall, each with a slot
    for (const s of [L / 2 - 2.9, L / 2 + 2.9]) {
      const p0 = at(s - 1.0), p1 = at(s + 1.0), q0 = at(s - 1.0, 0.8), q1 = at(s + 1.0, 0.8)
      const ring: P2[] = [p0, p1, q1, q0].reverse()
      walls(stone, ccw(ring), 0, 11.5)
      cap(roof, ccw(ring), 11.5, true)
      panels(win, q0, q1, [{ s0: 0.75, s1: 1.25, zb: 9.4, zs: 11.0 }], 2)
    }
    // the gable fill above the wall up to the eave peaks at the quarters
    for (const [s0, s1] of [[0, L / 2], [L / 2, L]]) {
      const a = at(s0), b = at(s1), m = at((s0 + s1) / 2)
      otri(stone, [a[0], a[1], WALL], [b[0], b[1], WALL], [m[0], m[1], PEAK], [n[0], n[1], 0])
    }
  }
  // the star roof: 16 pleats from the eave (valleys at corners and face
  // centres, peaks at the quarters) up to the drum
  const eave: V3[] = [], drum: V3[] = []
  for (let i = 0; i < 8; i++) {
    const A = oct[i], B = oct[(i + 1) % 8]
    for (let q = 0; q < 4; q++) {
      const t = q / 4, p: P2 = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]
      eave.push([p[0], p[1], q % 2 ? PEAK : WALL])
      const ang = Math.atan2(p[1] - C[1], p[0] - C[0])
      drum.push([C[0] + R * Math.cos(ang), C[1] + R * Math.sin(ang), DRUM0])
    }
  }
  for (let k = 0; k < 32; k++) {
    const j = (k + 1) % 32
    const mid: V3 = [(eave[k][0] + eave[j][0]) / 2 - C[0], (eave[k][1] + eave[j][1]) / 2 - C[1], 6]
    oquad(roof, eave[k], eave[j], drum[j], drum[k], mid)
    // the blue eave line (k01): a band along the pleat's lower edge
    const ej: V3 = eave[j], ek: V3 = eave[k]
    const dk = (p: V3, d: V3): V3 => [p[0] + (d[0] - p[0]) * 0.1, p[1] + (d[1] - p[1]) * 0.1, p[2] + (d[2] - p[2]) * 0.1 + 0.05]
    oquad(blue, [ek[0], ek[1], ek[2] + 0.05], [ej[0], ej[1], ej[2] + 0.05], dk(ej, drum[j]), dk(ek, drum[k]), mid)
  }

  // ---------------------------------------------------- drum and dome ---
  // 40 recessed windows between turquoise piers (k01)
  const dn = 40, dring = ngon(C[0], C[1], R, dn)
  for (let i = 0; i < dn; i++) {
    const A = dring[i], B = dring[(i + 1) % dn], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    facade(dome, win, A, B, DRUM0, DRUM1, [{ s0: L * 0.14, s1: L * 0.86, zb: DRUM0 + 0.7, zs: DRUM1 - 0.35, head: 'flat', depth: 0.45 }], { seg: 2 })
  }
  // the cap: shallow, 8.8 m from the drum to the apex, in rings; two bands
  const steps = 10, H = APEX - DRUM1
  const ringAt = (k: number): [number, number] => { const t = k / steps, a = (t * Math.PI) / 2; return [k === steps ? 0 : (R + 0.3) * Math.cos(a), DRUM1 + H * Math.sin(a)] }
  lathe(dome, C[0], C[1], [[R, DRUM1], [R + 0.3, DRUM1 + 0.3]], dn)
  for (let k = 0; k < steps; k++) {
    const [r0, z0] = ringAt(k), [r1, z1] = ringAt(k + 1)
    const P = (r: number, z: number, a: number): V3 => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z0 === z ? z : z]
    for (let i = 0; i < dn; i++) {
      const a = (TAU * i) / dn, b = (TAU * (i + 1)) / dn, m = (a + b) / 2
      const nz = (rr: number, zz: number, t: number): V3 => { const l = Math.hypot(rr / R, (zz - DRUM1) / H * 0.6 + 0.2); return [Math.cos(t) * (rr / R) / l, Math.sin(t) * (rr / R) / l, ((zz - DRUM1) / H * 0.6 + 0.2) / l] }
      // band 1 (k=2): the chain of elongated dark hexagons — three cells in four;
      // band 2 (k=4): a zigzag lattice — the up-triangles dark
      const part1 = k === 2 && i % 4 !== 3 ? blue : dome
      const tA = P(r0, z0, a), tB = P(r0, z0, b), tC = P(r1, z1, b), tD = P(r1, z1, a), tM = P(r1, z1, m)
      if (k === 4) {
        blue.tri(tA, tB, tM, [0, 0], [0, 0], [0, 0], [nz(r0, z0, a), nz(r0, z0, b), nz(r1, z1, m)])
        dome.tri(tA, tM, tD, [0, 0], [0, 0], [0, 0], [nz(r0, z0, a), nz(r1, z1, m), nz(r1, z1, a)])
        dome.tri(tB, tC, tM, [0, 0], [0, 0], [0, 0], [nz(r0, z0, b), nz(r1, z1, b), nz(r1, z1, m)])
      } else if (r1 > 1e-6) {
        part1.tri(tA, tB, tC, [0, 0], [0, 0], [0, 0], [nz(r0, z0, a), nz(r0, z0, b), nz(r1, z1, b)])
        part1.tri(tA, tC, tD, [0, 0], [0, 0], [0, 0], [nz(r0, z0, a), nz(r1, z1, b), nz(r1, z1, a)])
      } else dome.tri(tA, tB, tC, [0, 0], [0, 0], [0, 0], [nz(r0, z0, a), nz(r0, z0, b), [0, 0, 1]])
    }
  }
  finial(bronze, C[0], C[1], APEX - 0.1, 3.6)

  // ---------------------------------------------------------- minarets ---
  for (const sx of [-1, 1]) minaret(stone, roof, win, bronze, C[0] + sx * 29, -28)

  // -------------------------------------------------- precinct walls ---
  const ring = ccw(OUTLINE)
  const inner = inset(ring, 0.8)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length, a = ring[i], b = ring[j]
    const m: P2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (Math.hypot(m[0] - PORTICO[0], m[1] - PORTICO[1]) < 12.5) continue // the entrance gap
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.3) continue
    const nrm: V3 = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L, 0]
    oquad(stone, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], PRECINCT], [a[0], a[1], PRECINCT], nrm)
    oquad(stone, [inner[i][0], inner[i][1], 0], [inner[j][0], inner[j][1], 0], [inner[j][0], inner[j][1], PRECINCT], [inner[i][0], inner[i][1], PRECINCT], [-nrm[0], -nrm[1], 0])
    oquad(roof, [a[0], a[1], PRECINCT], [b[0], b[1], PRECINCT], [inner[j][0], inner[j][1], PRECINCT], [inner[i][0], inner[i][1], PRECINCT], [0, 0, 1])
  }
  // the east wing (library, museum, offices): a plain block inside the outline
  const wing: P2[] = [[18, -15], [40.8, -15.3], [47.5, -3.9], [48.7, 0.0], [38.3, 23.1], [40.5, 33.9], [37.0, 45.1], [19.7, 39.6], [18, 39]]
  walls(stone, ccw(wing), 0, PRECINCT)
  cap(roof, ccw(wing), PRECINCT, true)

  // ---------------------------------------------------------- portico ---
  {
    // an open gateway frame standing in front of the gate wall (k03, k05, k10):
    // paired piers that splay into brackets under a deep lintel, open sides
    const [px, py] = PORTICO, hw = 7.2, d0 = py - 4, d1 = py + 3, top = 11.5, beam = 2.8
    for (const y0 of [d0, d1 - 1.2]) for (const x0 of [px - hw, px - hw + 1.9, px + hw - 3.1, px + hw - 1.2]) {
      box(stone, x0, x0 + 1.2, y0, y0 + 1.2, 0, top - beam - 1.4)
      // the splayed bracket at the head of each pier
      const cx = x0 + 0.6, cy = y0 + 0.6
      lathe(stone, cx, cy, [[0.6 * Math.SQRT2, top - beam - 1.4], [1.0 * Math.SQRT2, top - beam]], 4, { smooth: false, a0: Math.PI / 4 })
    }
    // the deep lintel: a frame round the top, open in the middle
    box(stone, px - hw - 0.4, px + hw + 0.4, d0 - 0.4, d0 + 1.2, top - beam, top)
    box(stone, px - hw - 0.4, px + hw + 0.4, d1 - 1.2, d1 + 0.4, top - beam, top)
    box(stone, px - hw - 0.4, px - hw + 1.2, d0 + 1.2, d1 - 1.2, top - beam, top)
    box(stone, px + hw - 1.2, px + hw + 0.4, d0 + 1.2, d1 - 1.2, top - beam, top)
    box(roof, px - hw + 1.2, px + hw - 1.2, d0 + 1.2, d1 - 1.2, top - 0.7, top - 0.4)
    // the calligraphy band on the lintel's face (k10)
    panels(blue, [px - hw - 0.4, d0 - 0.4], [px + hw + 0.4, d0 - 0.4], [{ s0: 2.4, s1: 2 * hw - 1.6, zb: top - 1.9, zs: top - 1.0 }], 2)
    // the gate wall behind it, between the kiosks, with the wide dark gateway
    const wy = d1 + 3.0, xa = -24.5, xb = 7.5
    facade(stone, win, [xa, wy], [xb, wy], 0, PRECINCT, [{ s0: (px - xa) - 4.2, s1: (px - xa) + 4.2, zb: 0, zs: 6.2, head: 'flat', depth: 2.2 }], { seg: 2 })
    oquad(stone, [xb, wy + 0.8, 0], [xa, wy + 0.8, 0], [xa, wy + 0.8, PRECINCT], [xb, wy + 0.8, PRECINCT], [0, 1, 0])
    cap(roof, [[xa, wy], [xb, wy], [xb, wy + 0.8], [xa, wy + 0.8]], PRECINCT, true)
  }

  // ----------------------------------------------------------- kiosks ---
  for (const [kx, ky] of [[-20.5, -41.5], [3.5, -33.8]] as P2[]) kiosk(stone, roof, blue, win, bronze, kx, ky)

  const lit = (p: V3) => (p[2] > 0.3 ? 0.75 : 0.4)
  return [
    { part: stone, material: { ...finish('amman-limestone', 0xe6dccb), floodlight: lit } },
    { part: roof, material: finish('amman-roof', 0xdcdfdd) },
    { part: dome, material: { ...finish('amman-dome-turquoise', 0x8cbfcf), floodlight: () => 0.7 } },
    { part: blue, material: { ...finish('amman-deep-blue', 0x2f5f8f), floodlight: () => 0.5 } },
    { part: win, material: PALETTE.window },
    { part: bronze, material: finish('amman-bronze', 0x4a4f57) },
  ]
}

/** A bronze finial: stem, two balls and a crescent (k03, k10). */
function finial(p: Part, x: number, y: number, z: number, h: number) {
  lathe(p, x, y, [[0.22, z], [0.14, z + 0.35 * h], [0.32, z + 0.42 * h], [0.12, z + 0.52 * h], [0.24, z + 0.58 * h], [0.08, z + 0.66 * h]], 6)
  const R = 0.17 * h, t = 0.06 * h, zc = z + 0.66 * h + R
  for (let k = 0; k < 7; k++) {
    const f0 = 2.6 + (4.22 * k) / 7, f1 = 2.6 + (4.22 * (k + 1)) / 7
    const o = (f: number, s: number): V3 => [x + R * Math.cos(f), y + s * t, zc + R * Math.sin(f)]
    const i_ = (f: number, s: number): V3 => [x + 0.78 * R * Math.cos(f), y + s * t, zc + 0.25 * R + 0.78 * R * Math.sin(f)]
    for (const s of [1, -1]) oquad(p, o(f0, s), o(f1, s), i_(f1, s), i_(f0, s), [0, s, 0])
    const m = (f0 + f1) / 2
    oquad(p, o(f0, 1), o(f1, 1), o(f1, -1), o(f0, -1), [Math.cos(m), 0, Math.sin(m)])
  }
}

/** A radial fin: a corbel sloping out from the shaft, then a vertical rib, as a solid. */
function fin(p: Part, x: number, y: number, ang: number, off: number, r0: number, r1: number, z0: number, zc: number, z1: number, t: number) {
  const c = Math.cos(ang), s = Math.sin(ang)
  const at = (r: number, side: number, z: number): V3 => [x + c * r - s * (off + side * t / 2), y + s * r + c * (off + side * t / 2), z]
  const prof: [number, number][] = [[r0, z0], [r1, zc], [r1, z1], [r0, z1]]
  for (const side of [-1, 1]) {
    const q = prof.map(([r, z]) => at(r, side, z))
    oquad(p, q[0], q[1], q[2], q[3], [-s * side, c * side, 0])
  }
  for (let k = 0; k < 3; k++) {
    const [ra, za] = prof[k], [rb, zb] = prof[k + 1]
    const n: V3 = [c * (zb - za), s * (zb - za), -(rb - ra)]
    oquad(p, at(ra, -1, za), at(rb, -1, zb), at(rb, 1, zb), at(ra, 1, za), n)
  }
}

/** A minaret (k03, k10): a slim square shaft with slit windows, a crown of corbelled ribs, a narrow upper stage and a pointed cap. */
function minaret(stone: Part, roof: Part, win: Part, bronze: Part, x: number, y: number) {
  const H = MIN_H, h = 1.75, z = (f: number) => f * H
  const sq = (half: number): P2[] => [[x - half, y - half], [x + half, y - half], [x + half, y + half], [x - half, y + half]]
  walls(stone, sq(h), 0, z(0.63))
  const s = sq(h)
  for (let i = 0; i < 4; i++) panels(win, s[i], s[(i + 1) % 4], [0.34, 0.43, 0.52].map((f) => ({ s0: h - 0.16, s1: h + 0.16, zb: z(f), zs: z(f) + 2.4 })), 2)
  // the crown: the core with dark openings between three corbelled ribs a face
  walls(stone, sq(h), z(0.63), z(0.77))
  for (let i = 0; i < 4; i++) panels(win, s[i], s[(i + 1) % 4], [{ s0: 0.45, s1: h - 0.4, zb: z(0.64), zs: z(0.765) }, { s0: h + 0.4, s1: 2 * h - 0.45, zb: z(0.64), zs: z(0.765) }], 2)
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2
    // a rib out from each corner and one from the middle of each face, open between
    fin(stone, x, y, ang, 0, h - 0.05, h + 1.5, z(0.585), z(0.665), z(0.775), 0.6)
    fin(stone, x, y, ang + Math.PI / 4, 0, h * Math.SQRT2 - 0.3, h * Math.SQRT2 + 1.3, z(0.585), z(0.665), z(0.775), 0.6)
  }
  // the overhanging slab over the crown
  box(stone, x - h - 1.7, x + h + 1.7, y - h - 1.7, y + h + 1.7, z(0.775), z(0.795))
  // narrow upper stage with openings, then the pointed cap
  const u = 1.25
  walls(stone, sq(u), z(0.795), z(0.87))
  const su = sq(u)
  for (let i = 0; i < 4; i++) panels(win, su[i], su[(i + 1) % 4], [{ s0: u - 0.4, s1: u + 0.4, zb: z(0.81), zs: z(0.85), head: 'round' }], 2)
  lathe(stone, x, y, [[u * Math.SQRT2, z(0.87)], [1.75 * Math.SQRT2, z(0.875)], [1.75 * Math.SQRT2, z(0.885)], [1.2, z(0.89)], [1.05, z(0.915)], [0.4, z(0.95)], [0, z(0.955)]], 8, { smooth: true })
  finial(bronze, x, y, z(0.95), H - z(0.95))
}

/** A small kiosk: a square block with pointed-arch niches and a deep-blue dome (k03). */
function kiosk(stone: Part, roof: Part, blue: Part, win: Part, bronze: Part, x: number, y: number) {
  const h = 4.0, top = PRECINCT
  const sq: P2[] = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]]
  for (let i = 0; i < 4; i++) {
    const A = sq[i], B = sq[(i + 1) % 4], L = 2 * h
    // a tall pointed-arch niche, a real recess (k03)
    facade(stone, win, A, B, 0, top, [{ s0: L / 2 - 0.9, s1: L / 2 + 0.9, zb: 1.2, zs: 5.6, head: 'pointed', k: 0.8, depth: 0.6 }], { seg: 6 })
  }
  cap(roof, sq, top, true)
  const r = 3.8, prof: P2[] = []
  for (let k = 0; k <= 6; k++) { const a = (k / 6) * (Math.PI / 2); prof.push([k === 6 ? 0 : r * Math.cos(a), top + r * 0.85 * Math.sin(a)]) }
  lathe(blue, x, y, prof, 14, { soft: true })
  finial(bronze, x, y, top + r * 0.85 - 0.1, 3.2)
}

if (import.meta.main) {
  await writeModel('amman-king-abdullah-mosque.glb', 'King Abdullah I Mosque', build(), 6500, 250_000)
}
