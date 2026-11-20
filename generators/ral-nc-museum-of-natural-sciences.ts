/**
 * North Carolina Museum of Natural Sciences (now its Nature Exploration
 * Center), Raleigh (2000; Bicentennial Plaza): procedural, CC0-1.0.
 * bun generators/ral-nc-museum-of-natural-sciences.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 3 (the OSM
 * walls run at 3°/93°). Origin: the area centroid of OSM way/197842115
 * (-78.639511, 35.782179). y = 0 is the lowest ground under the footprint.
 * Mapterhorn (z13) falls about 3 m from the south side to Jones Street;
 * the walls run down to y = 0 and sink into the slope. Elevation 0.
 *
 * OSM: way/197842115 "North Carolina Museum of Natural Sciences"
 * (Q2483656, no height or levels): 66 × 55 m. Its north-east corner is an
 * arc (fitted radius 10.9 m about (20.2, 18.9)): the round corner tower;
 * its east side bows out (radius 19.4 m about (15.0, -1.4)): the curved
 * entrance front on Bicentennial Plaza. The south wall is shared with the
 * Agriculture Building (way/197842116, way/197842117), not modelled.
 *
 * Plan of the roofs, from USGS NAIP (public domain, 0.11 m/px; NAIP sits
 * ~8.8 m east of OSM here, the same shift as at the Nature Research
 * Center, so its positions were moved back by that much):
 *  - the corner tower's glass dome, 13.3 m across inside a cornice ring
 *    16.2 m across; so the tower is drawn 9.0 m in radius above its base
 *    (the OSM arc, 10.9 m, takes in the base and steps); drawn 9.8 m about
 *    (20.8, 18.8) after a first pass at 9.0 m made the tower read weaker
 *    than it does in n01;
 *  - two blocks with low patina-green hipped roofs: the east block
 *    (x 10..31, y -15..11) and a west one (x -30..-15, y -9..10), with a
 *    glass barrel skylight between them (x -15..8, y -7..5), drawn rising
 *    only 1 m so it doesn't read as a second dome behind the tower's;
 *  - a flat-roofed range along Jones Street (y 16..25);
 *  - a roof terrace with planters over the south-west quarter.
 *
 * No lidar covers Wake County, so heights are estimated, from n01 (the
 * corner tower frontal from the north-east) scaled by the tower's NAIP
 * width (18 m ≈ 325 px):
 *  - the main cornice 22 m (n01: the tower's cornice and the east block's
 *    at one level); the east block's attic 3.5 m more (n01: the stepped
 *    block behind the curved front);
 *  - the granite base 5.5 m (n01, n04: one rusticated storey);
 *  - the tower's glass: a drum 1.5 m and a dome rising 4.2 m on a 7.0 m
 *    radius (n01: 35 px of drum, 83 px of dome over a 140 px radius): a
 *    shallow dome, neither a saucer nor a half sphere;
 *  - the south-west roof terrace 17.5 m (NAIP: shadow of the east block
 *    ≈4.6 m on it);
 *  - the hipped roofs rise 1.0 m, inside a 1.2 m parapet, so they stay
 *    hidden from the street, as in n01 and n04 (no roof shows over the
 *    cornice), and show green only from above, as NAIP does.
 *
 * Photos (evidence):
 *  n01 "North-Carolina-Museum-of-Natural-Sciences-20070321.jpeg",
 *      Jmturner, public domain: the corner tower and the curved east front
 *      from Jones and Salisbury.
 *  n04 "North Carolina Museum of Natural Since - panoramio - Chanilim714
 *      .jpg", Chanilim714, CC BY-SA 3.0: the Jones Street front: granite
 *      base, limestone, tall green-framed windows two storeys high.
 *  n05 "North Carolina Museum of Natural Since - panoramio.jpg",
 *      Chanilim714, CC BY-SA 3.0: the curved east front on the plaza, its
 *      inscription band, the entrance between granite piers.
 *  n02 "North Carolina Museum of Natural Sciences.JPG", Abbylabar,
 *      CC BY-SA 3.0: the granite base and green window frames close up.
 *  l03 "North Carolina Legislative Building at Downtown Raleigh NC -
 *      panoramio.jpg", Chanilim714, CC BY-SA 3.0: the east front and the
 *      tower from the plaza's south end.
 * Aerial: USGS NAIP (public domain).
 *
 * Colours: pale limestone, a grey granite base (n02), windows a green-grey
 * glass (their green frames, n01/n02), the dome's glass teal (n01), the
 * hipped roofs patina (NAIP).
 * Estimated: every height; the bays (≈4.5 m). Invented: the west wall
 * (not photographed; the same treatment as Jones Street).
 * The rotunda and the curved east front: tall glazed bays (two storeys of
 * green glass, then a shorter top bay) filling the space between the
 * engaged columns (n01, n05), not punched windows.
 * Left out: the engaged columns' capitals, the inscription,
 * banners, the skywalk to the Nature Research Center (way/199919512, a
 * separate building), rooftop plant, the terrace planters.
 * Doubts: no lidar, no Mapillary (no token); the tower's radius (OSM and
 * NAIP disagree; NAIP followed); the terrace height.
 * Night: windows glow; the dome is glass and stays dark; the limestone is
 * floodlit softly on the corner tower and the east front.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'
import { type XY, type Face, prism, rect, capRing, lathe, disc, arc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, panel, slabRing, grow, triO } from './nash-tennessee-state-capitol'

const MAIN = 22, ATTIC = 25.5, RANGE = 19, TOWER = 23.5, TERR = 17.5, BASE = 5.5, PAR = 1.2
const TC: XY = [20.8, 18.8], TR = 9.8

// the curved east front: OSM's arc about (15.0, -1.4), radius 19.4
const bay = (y0: number, y1: number, n: number): XY[] => {
  const a0 = (Math.asin((y0 + 1.4) / 19.4) * 180) / Math.PI, a1 = (Math.asin((y1 + 1.4) / 19.4) * 180) / Math.PI
  return arc(15.0, -1.4, 19.4, a0, a1, n)
}
// north part (y > -9) and the east block run to MAIN; the south-west quarter is lower
const NORTH: XY[] = [[-32.1, -9], [10, -9], [10, -25.7], [18.9, -25.6], [31.9, -25.1], [31.6, -17.7], [31.2, -13.1], [31.9, -11], ...bay(-9.3, 8.6, 8), [31.5, 12.3], [28.7, 12.9], [14, 12.6], [-32.1, 12.6]]
// the lower range along Jones Street
const RANGE_RING: XY[] = [[-32.1, 12.6], [14, 12.6], [14, 25.5], [-32.2, 25.3], [-32.1, 15.2]]
const SOUTH: XY[] = [[-31.9, -26.9], [10, -25.7], [10, -9], [-32.1, -9]]

const onCurve = (q: XY) => Math.abs(Math.hypot(q[0] - 15.0, q[1] + 1.4) - 19.4) < 0.05

function facade(win: Part, trim: Part, ring: XY[], top: number, skip: (a: XY, b: XY) => boolean = () => false) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2 || skip(a, b)) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const f: Face = { o: [a[0], a[1], 0], n }
    const bays = Math.max(1, Math.round(L / 4.5)), w = L / bays
    for (let k = 0; k < bays; k++) {
      const s = w * (k + 0.5)
      panel(win, f, s, Math.min(1.8, w - 1.2), 1.2, 4.3, 0.05) // ground floor, in the granite
      panel(win, f, s, Math.min(2.6, w - 1.4), 6.6, 13.8, 0.05) // the two-storey windows
      if (top > 18) panel(win, f, s, Math.min(1.4, w - 1.6), top - 4.4, top - 1.6, 0.05)
    }
    // a cornice band at the top and a string course over the base
    panel(trim, f, L / 2, L + 0.01, top - 1.0, top - 0.3, 0.18)
    panel(trim, f, L / 2, L + 0.01, BASE, BASE + 0.5, 0.12)
  }
}

function hip(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, rise: number) {
  const h = Math.min(x1 - x0, y1 - y0) / 2
  const A: V3 = [x0, y0, z], B: V3 = [x1, y0, z], C: V3 = [x1, y1, z], D: V3 = [x0, y1, z]
  const alongX = x1 - x0 >= y1 - y0
  const cy = (y0 + y1) / 2, cx = (x0 + x1) / 2
  const R0: V3 = alongX ? [x0 + h, cy, z + rise] : [cx, y0 + h, z + rise]
  const R1: V3 = alongX ? [x1 - h, cy, z + rise] : [cx, y1 - h, z + rise]
  if (alongX) {
    triO(p, A, B, R1, [0, -1, 1]); triO(p, A, R1, R0, [0, -1, 1])
    triO(p, C, D, R0, [0, 1, 1]); triO(p, C, R0, R1, [0, 1, 1])
    triO(p, B, C, R1, [1, 0, 1]); triO(p, D, A, R0, [-1, 0, 1])
  } else {
    triO(p, B, C, R1, [1, 0, 1]); triO(p, B, R1, R0, [1, 0, 1])
    triO(p, D, A, R0, [-1, 0, 1]); triO(p, D, R0, R1, [-1, 0, 1])
    triO(p, A, B, R0, [0, -1, 1]); triO(p, C, D, R1, [0, 1, 1])
  }
}

function build() {
  const lime = new Part(), granite = new Part(), win = new Part(), glass = new Part(), roof = new Part(), trim = new Part()

  // ------------------------------------------------------------ the main masses
  prism(granite, null, NORTH, 0, BASE)
  prism(lime, null, NORTH, BASE, MAIN)
  capRing(trim, NORTH, MAIN, true)
  prism(granite, null, SOUTH, 0, BASE)
  prism(lime, null, SOUTH, BASE, TERR)
  capRing(trim, SOUTH, TERR, true)
  facade(win, trim, NORTH, MAIN, (a, b) => (Math.abs(a[0] - 10) < 0.1 && Math.abs(b[0] - 10) < 0.1) || (a[1] === -9 && b[1] === -9) || (a[1] > 12 && b[1] > 12) || (onCurve(a) && onCurve(b)))
  prism(granite, null, RANGE_RING, 0, BASE)
  prism(lime, null, RANGE_RING, BASE, RANGE)
  capRing(trim, RANGE_RING, RANGE, true)
  facade(win, trim, RANGE_RING, RANGE, (a, b) => (a[1] === 12.6 && b[1] === 12.6) || (a[0] === 14 && b[0] === 14))
  {
    // the taller middle's north wall over the range
    const f: Face = { o: [14, 12.6, 0], n: [0, 1] }
    for (const s of [4, 12, 20, 28, 36]) panel(win, f, s, 3, RANGE + 0.6, MAIN - 1.4, 0.05)
  }
  facade(win, trim, SOUTH, TERR, (a, b) => Math.abs(a[0] - 10) < 0.1 && Math.abs(b[0] - 10) < 0.1)
  // the stepped wall where the terrace meets the north part
  {
    const f: Face = { o: [10, -9, 0], n: [0, -1] }
    for (const s of [-36, -28, -20, -12, -4]) panel(win, f, s, 3, TERR + 1.0, MAIN - 1.6, 0.05)
  }
  // the curved east front: tall glazed bays between engaged columns (n01,
  // n05): two storeys of green glass over the base, a shorter bay above
  {
    const pts = bay(-9.3, 8.6, 8)
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const f: Face = { o: [a[0], a[1], 0], n: [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] }
      // columns stand on the even points, so each bay spans two segments
      const s0 = i % 2 === 0 ? 0.65 : 0, s1 = i % 2 === 0 ? L : L - 0.65
      panel(win, f, (s0 + s1) / 2, s1 - s0, 6.2, 14.8, 0.05)
      panel(win, f, (s0 + s1) / 2, s1 - s0, 15.6, MAIN - 2.0, 0.05)
      if (i % 2 === 0) panel(win, f, L, 1.8, 1.2, 4.4, 0.05)
    }
    // the cornice band and string course along the curve
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const f: Face = { o: [a[0], a[1], 0], n: [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] }
      panel(trim, f, L / 2, L + 0.01, MAIN - 1.0, MAIN - 0.3, 0.18)
      panel(trim, f, L / 2, L + 0.01, BASE, BASE + 0.5, 0.12)
    }
  }
  for (const [x, y] of bay(-9.3, 8.6, 8).filter((_, i) => i % 2 === 0).slice(1, -1)) {
    const d = Math.hypot(x - 15.0, y + 1.4), ux = (x - 15.0) / d, uy = (y + 1.4) / d
    lathe(lime, x + ux * 0.25, y + uy * 0.25, [[0.6, BASE + 0.5], [0.55, MAIN - 1.0]], 8)
  }
  // ------------------------------------------------------------ the roofs (low, behind parapets)
  // parapet walls round the north part's west half and the hips inside
  box(lime, 10, -15, 31, 11.5, MAIN, ATTIC, null, 0.3) // the east block's attic
  box(trim, 9.7, -15.3, 31.3, 11.8, ATTIC - 0.6, ATTIC, null, 0.3)
  {
    // the attic's top: a frame of trim round a low hip
    const o = rect(9.7, -15.3, 31.3, 11.8), i = rect(10.9, -14.1, 30.1, 10.6)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      trim.quad([i[k][0], i[k][1], ATTIC], [o[k][0], o[k][1], ATTIC], [o[l][0], o[l][1], ATTIC], [i[l][0], i[l][1], ATTIC])
    }
    hip(roof, 10.9, -14.1, 30.1, 10.6, ATTIC - PAR, PAR - 0.2)
    // inner face of the attic's parapet
    prism(lime, null, [...i].reverse(), ATTIC - PAR, ATTIC)
  }
  // the west hip and the glass barrel skylight, each inside a parapet
  slabRing(lime, rect(-30.6, -9.5, -14.4, 10.5), MAIN, MAIN + PAR, null)
  hip(roof, -30, -9, -15, 10, MAIN + PAR - 0.05, 1.0)
  {
    // barrel skylight, its axis east–west, a shallow segment
    const x0 = -14.4, x1 = 8.5, yc = -1, R = 19.6, rise = 1.0
    const half = 6.2, zc = MAIN - (R - rise) + 0.0
    const a0 = Math.asin(half / R)
    const N = 8
    for (let k = 0; k < N; k++) {
      const t0 = -a0 + (2 * a0 * k) / N, t1 = -a0 + (2 * a0 * (k + 1)) / N
      const P = (x: number, t: number): V3 => [x, yc + R * Math.sin(t), zc + R * Math.cos(t)]
      const Nn = (t: number): V3 => [0, Math.sin(t), Math.cos(t)]
      glass.tri(P(x0, t0), P(x1, t0), P(x1, t1), undefined, undefined, undefined, [Nn(t0), Nn(t0), Nn(t1)])
      glass.tri(P(x0, t0), P(x1, t1), P(x0, t1), undefined, undefined, undefined, [Nn(t0), Nn(t1), Nn(t1)])
    }
    // end walls of the barrel
    for (const [x, out] of [[x0, -1], [x1, 1]] as [number, number][]) {
      for (let k = 0; k < N; k++) {
        const t0 = -a0 + (2 * a0 * k) / N, t1 = -a0 + (2 * a0 * (k + 1)) / N
        triO(glass, [x, yc, MAIN], [x, yc + R * Math.sin(t0), zc + R * Math.cos(t0)], [x, yc + R * Math.sin(t1), zc + R * Math.cos(t1)], [out, 0, 0])
      }
    }
  }

  // ------------------------------------------------------------ the corner tower
  const SEG = 20
  lathe(granite, TC[0], TC[1], [[TR + 0.4, 0], [TR + 0.4, BASE]], SEG)
  lathe(trim, TC[0], TC[1], [[TR + 0.4, BASE], [TR + 0.6, BASE], [TR + 0.6, BASE + 0.6], [TR, BASE + 0.6]], SEG)
  lathe(lime, TC[0], TC[1], [[TR, BASE + 0.6], [TR, TOWER - 1.6]], SEG)
  // the cornice, an attic band and its coping
  lathe(trim, TC[0], TC[1], [[TR, TOWER - 1.6], [TR + 0.7, TOWER - 1.0], [TR + 0.7, TOWER - 0.4], [TR - 0.3, TOWER - 0.4]], SEG)
  lathe(lime, TC[0], TC[1], [[TR - 0.3, TOWER - 0.4], [TR - 0.3, TOWER + 1.0], [TR - 0.1, TOWER + 1.0], [TR - 0.1, TOWER + 1.4], [6.9, TOWER + 1.4]], SEG)
  // engaged columns between the windows, and the windows: tall in the
  // middle storeys, small in the base and at the top
  for (let k = 0; k < 10; k++) {
    const t = ((k + 0.5) / 10) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t)
    lathe(lime, TC[0] + c * (TR + 0.05), TC[1] + s * (TR + 0.05), [[0.55, BASE + 0.6], [0.5, TOWER - 1.6]], 8)
    const tw = ((k + 1) / 10) * 2 * Math.PI, cw = Math.cos(tw), sw = Math.sin(tw)
    const f: Face = { o: [TC[0] + cw * TR, TC[1] + sw * TR, 0], n: [cw, sw] }
    // a tall glazed bay between the columns, as two flat halves so it
    // follows the curve: two storeys of glass, then a shorter top bay
    for (const u of [-1.05, 1.05]) {
      panel(win, f, u, 2.1, 6.4, 14.8, 0.12)
      panel(win, f, u, 2.1, 15.8, TOWER - 2.2, 0.12)
    }
    panel(win, f, 0, 1.8, 1.2, 4.4, 0.48)
  }
  // the glass drum and dome: a shallow dome on a 6.6 m radius
  const DR = 7.0, D0 = TOWER + 1.4, D1 = D0 + 1.5, RISE = 4.2
  lathe(glass, TC[0], TC[1], [[DR, D0], [DR, D1]], SEG)
  const SR = (DR * DR + RISE * RISE) / (2 * RISE), zc = D1 + RISE - SR
  const prof: [number, number][] = []
  for (let k = 0; k <= 7; k++) {
    const r = DR * (1 - k / 7)
    prof.push([r, zc + Math.sqrt(SR * SR - r * r)])
  }
  lathe(glass, TC[0], TC[1], prof, SEG)
  lathe(trim, TC[0], TC[1], [[0.6, D1 + RISE - 0.05], [0.6, D1 + RISE + 0.5], [0, D1 + RISE + 0.5]], 8)

  const lit = (p: V3, n: V3) => (n[2] > 0.5 ? 0 : p[0] > 10 && p[2] < TOWER + 1 ? 0.7 : 0)
  return finishGlb('North Carolina Museum of Natural Sciences', [
    { part: lime, material: <Swatch>{ ...finish('ncmns-limestone', 0xe6dfd2), floodlight: lit } },
    { part: granite, material: <Swatch>{ ...finish('ncmns-granite', 0xc4bfb6), floodlight: lit } },
    { part: win, material: windowVariant(2, 0x6d8a86) },
    { part: glass, material: { ...PALETTE.glass, color: 0x8fbab2 } },
    { part: roof, material: PALETTE.patina },
    { part: trim, material: <Swatch>{ ...PALETTE.trim, floodlight: lit } },
  ], { bearing: 3, height: D1 + RISE + 0.5, replaces: ['way/197842115'] }, 6500)
}

if (import.meta.main) await writeModel('ral-nc-museum-of-natural-sciences', build())
