/**
 * Wayne Day Family Field at Carter–Finley Stadium, NC State University,
 * Raleigh (1966; south end zone 2001, Vaughn Towers 2005, north end zone
 * 2006, north videoboard 2023): procedural, CC0-1.0.
 * bun generators/ral-carter-finley-stadium.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 143, the
 * field's long axis; +y is the south end zone (the Murphy Center beyond),
 * −y the north end zone with the videoboard, +x the west side with the
 * C. Richard Vaughn Towers, −x the east grandstand.
 * Origin: the centroid of OSM way/33077391 (-78.719718, 35.800809).
 * y = 0 is the field, which lies in a bowl dug about 12.5 m below the
 * street round it: the west lower stand rises from the field wall to the
 * cross aisle at street level in about thirty rows (c04) at ~0.4 m a row.
 * Elevation 0, not −12.5: the 1966 bowl is old enough that the map's
 * terrain already has it (Mapterhorn z13 shows the pit 12.8 m deep, flat
 * at the field), so the map's lowest ground under the footprint is the
 * field itself. `terrain.ts check` with −12.5 buried 12,500 m² of stands by
 * ~11 m; with 0 it prints ok.
 *
 * Plan (measured, OSM relation/1216299 building=stadium: outer way/33077391,
 * inner way/81048905 the field): the field hole spans x −52.6..18.2,
 * y −43..79; the outline reaches x −102 (east stand), x 106–120 (the
 * towers), y −110 (north stand), y 114 (south stand).
 * Heights (no lidar in Wake County; none published), photo-scaled:
 *  - the east grandstand: one rake from the field wall to about 29 m over
 *    the field (17 m over the street; c01 shows its back on columns, c07
 *    its rows);
 *  - the north end zone stand about 24 m (c01, c05); the south end zone's
 *    low stand about 14 m (c05: about twenty rows);
 *  - the west side: a lower stand to the cross aisle at street level, an
 *    upper deck over it to about 28 m (c04), and the Vaughn Towers behind:
 *    a brick base 4.7 m over the street, an open colonnade to 10 m, the
 *    box block to 22.5 m and stair towers to 26 m over the street (c06,
 *    scaled against a 3 m box truck); the field side has three glazed
 *    levels and a set-back top level (c04);
 *  - the videoboard: about 34 × 14 m (published: "more than double" the
 *    old board), standing on the north rim, estimated.
 *
 * Photos (evidence):
 *  c01 "Carter-Finley Stadium 1.jpg", SMaloney, CC BY 3.0 (aerial from the east)
 *      https://commons.wikimedia.org/wiki/File:Carter-Finley_Stadium_1.jpg
 *  c02 "Carter Finley Stadium aerial.jpg", NASA, public domain (vertical aerial)
 *      https://commons.wikimedia.org/wiki/File:Carter_Finley_Stadium_aerial.jpg
 *  c03 "Carter Finley Stadium Arc.JPG", Alexisrael, CC BY-SA 3.0 (the north plaza gate)
 *      https://commons.wikimedia.org/wiki/File:Carter_Finley_Stadium_Arc.JPG
 *  c04 "Carter-Finley Stadium.jpg", Greenstrat (en.wikipedia), public domain (the west stands and towers, 2005)
 *      https://commons.wikimedia.org/wiki/File:Carter-Finley_Stadium.jpg
 *  c05 "Carter-finley stadium.jpg", Jcmurphy (en.wikipedia), CC BY-SA 3.0 (looking south)
 *      https://commons.wikimedia.org/wiki/File:Carter-finley_stadium.jpg
 *  c06 "Carter-FinleyOUTSIDE.jpg", Greenstrat, public domain (the towers from the west)
 *      https://commons.wikimedia.org/wiki/File:Carter-FinleyOUTSIDE.jpg
 *  c07 "Carter finley stadium panorama.jpg", SuperUserCode, CC BY-SA 4.0 (the east stand)
 *      https://commons.wikimedia.org/wiki/File:Carter_finley_stadium_panorama.jpg
 *  c08 "Carter Finley Stadium at Sunset.jpg", Melizabethi123, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:Carter_Finley_Stadium_at_Sunset.jpg
 *  c13 "Carter-Finley Stadium from NCSU sideline.jpg", Mark Haynes, CC BY 2.0
 *      https://commons.wikimedia.org/wiki/File:Carter-Finley_Stadium_from_NCSU_sideline.jpg
 * Aerial: USGS NAIP (public domain): plan, seat colours (red ends, pale
 * sides), the towers' roof.
 * Published: Wikipedia "Carter–Finley Stadium" (dates, the 2006 north stand,
 * the 2023 videoboard).
 *
 * Colours: grey aluminium seats on the sides, red seats in the end zones
 * (NAIP, c05); pale concrete; the towers' grey panels with red stripes and
 * white field-side front (c04, c06); brick base (c06).
 * Left out: the field (the map's), the light poles, the ribbon boards and
 * lettering, the corner video screens, the Murphy Center (its own building),
 * the north plaza gate and concession buildings, the Walk of Champions arch.
 * Doubts: all heights are photo-scaled; the north stand's height and the
 * videoboard's size are estimates; the east stand's back is drawn as a
 * plain wall over a dark concourse band.
 * Night: the towers' windows glow; the videoboard's screen glows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, rect, prism, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'
import { quadO, panel, box } from './nash-tennessee-state-capitol'

const ELEV = 12.5 // the street over the field
const FX = -17.2, FY = 18 // field centre
const W0 = 36.5, L0 = 62 // field wall half-sizes
const SE = 5 // superellipse exponent of the field wall: square sides, rounded corners
// per side: how far the top of the stand is from the field wall, and its height
const SIDE = {
  east: { d: 49, z: 29 }, // −x
  west: { d: 28, z: ELEV + 0.5 }, // +x: lower stand to the cross aisle
  north: { d: 61, z: 24 }, // −y
  south: { d: 32, z: 14 }, // +y
}

function fieldWall(t: number): { p: XY; n: XY } {
  const c = Math.cos(t), s = Math.sin(t)
  const px = W0 * Math.sign(c) * Math.abs(c) ** (2 / SE), py = L0 * Math.sign(s) * Math.abs(s) ** (2 / SE)
  // normal from the gradient of |x/W|^n + |y/L|^n
  const gx = (Math.sign(px) * Math.abs(px / W0) ** (SE - 1)) / W0, gy = (Math.sign(py) * Math.abs(py / L0) ** (SE - 1)) / L0
  const l = Math.hypot(gx, gy) || 1
  return { p: [FX + px, FY + py], n: [gx / l, gy / l] }
}
function sideBlend(t: number, key: 'd' | 'z') {
  const c = Math.cos(t), s = Math.sin(t)
  const a = c < 0 ? SIDE.east[key] : SIDE.west[key], b = s < 0 ? SIDE.north[key] : SIDE.south[key]
  const wa = Math.abs(c) ** 3, wb = Math.abs(s) ** 3
  return (a * wa + b * wb) / (wa + wb)
}

function build() {
  const conc = new Part(), grey = new Part(), red = new Part(), panelP = new Part(), win = new Part(), white = new Part()

  // ------------------------------------------------------------ the bowl
  const N = 96
  const ring = (k: number) => {
    const t = (2 * Math.PI * k) / N
    const { p, n } = fieldWall(t)
    const d = sideBlend(t, 'd'), z = sideBlend(t, 'z')
    return { t, p, n, d, z }
  }
  const pts = Array.from({ length: N }, (_, k) => ring(k))
  const WALL = 1.4
  for (let k = 0; k < N; k++) {
    const A = pts[k], B = pts[(k + 1) % N]
    const tm = (A.t + B.t) / 2 + (k === N - 1 ? Math.PI : 0)
    const endZone = Math.abs(Math.sin(tm)) > 0.82
    const seats = endZone ? red : grey
    const P = (r: typeof A, d: number, z: number): V3 => [r.p[0] + r.n[0] * d, r.p[1] + r.n[1] * d, z]
    const out: V3 = [(A.n[0] + B.n[0]) / 2, (A.n[1] + B.n[1]) / 2, 0]
    // the field wall
    quadO(conc, P(A, 0, 0), P(B, 0, 0), P(B, 0, WALL), P(A, 0, WALL), [-out[0], -out[1], 0])
    // the rake, in two pitches (steeper above, as the rows climb), with a cross aisle
    const ma = 0.45, mb = 0.45
    const zA1 = WALL + (A.z - WALL) * 0.42, zB1 = WALL + (B.z - WALL) * 0.42
    quadO(seats, P(A, 0, WALL), P(B, 0, WALL), P(B, B.d * mb, zB1), P(A, A.d * ma, zA1), [-out[0], -out[1], 2])
    quadO(conc, P(A, A.d * ma, zA1), P(B, B.d * mb, zB1), P(B, B.d * mb + 2, zB1), P(A, A.d * ma + 2, zA1), [0, 0, 1])
    quadO(conc, P(A, A.d * ma + 2, zA1), P(B, B.d * mb + 2, zB1), P(B, B.d * mb + 2, zB1 + 0.8), P(A, A.d * ma + 2, zA1 + 0.8), [-out[0], -out[1], 0])
    quadO(seats, P(A, A.d * ma + 2, zA1 + 0.8), P(B, B.d * mb + 2, zB1 + 0.8), P(B, B.d, B.z), P(A, A.d, A.z), [-out[0], -out[1], 1.5])
    // the top: a parapet and the back wall down to the field level (below the street it is buried)
    quadO(conc, P(A, A.d, A.z), P(B, B.d, B.z), P(B, B.d, B.z + 1.1), P(A, A.d, A.z + 1.1), [-out[0], -out[1], 0])
    quadO(conc, P(A, A.d, A.z + 1.1), P(B, B.d, B.z + 1.1), P(B, B.d + 0.8, B.z + 1.1), P(A, A.d + 0.8, A.z + 1.1), [0, 0, 1])
    quadO(conc, P(A, A.d + 0.8, 0), P(B, B.d + 0.8, 0), P(B, B.d + 0.8, B.z + 1.1), P(A, A.d + 0.8, A.z + 1.1), out)
    // a dark concourse band on the back where it stands clear of the street
    if (Math.min(A.z, B.z) > ELEV + 7)
      quadO(panelP, P(A, A.d + 0.86, ELEV + 0.3), P(B, B.d + 0.86, ELEV + 0.3), P(B, B.d + 0.86, ELEV + 4.6), P(A, A.d + 0.86, ELEV + 4.6), out)
  }

  // ------------------------------------------------------------ the west upper deck
  const XU0 = FX + W0 + 28, XU1 = 80, YU0 = -40, YU1 = 76, ZU0 = ELEV + 2.5, ZU1 = 28
  {
    const N2 = 6
    for (let i = 0; i < N2; i++) {
      const y0 = YU0 + ((YU1 - YU0) * i) / N2, y1 = YU0 + ((YU1 - YU0) * (i + 1)) / N2
      const seats = i === 0 || i === N2 - 1 ? red : grey
      quadO(seats, [XU0, y0, ZU0], [XU0, y1, ZU0], [XU1, y1, ZU1], [XU1, y0, ZU1], [-1, 0, 2])
      // the soffit underneath, back to the towers
      quadO(conc, [XU0, y0, ZU0 - 1.6], [XU0, y1, ZU0 - 1.6], [XU1, y1, ZU0 + 3], [XU1, y0, ZU0 + 3], [0, 0, -1])
    }
    // the red fascia along the front (c04)
    quadO(red, [XU0, YU0, ZU0 - 1.6], [XU0, YU1, ZU0 - 1.6], [XU0, YU1, ZU0 + 0.2], [XU0, YU0, ZU0 + 0.2], [-1, 0, 0])
    // the deck's sloped end walls
    for (const [y, s] of [[YU0, -1], [YU1, 1]] as const) {
      const poly: V3[] = [[XU0, y, ZU0 - 1.6], [XU1, y, ZU0 + 3], [XU1, y, ZU1], [XU0, y, ZU0 + 0.2]]
      quadO(conc, poly[0], poly[1], poly[2], poly[3], [0, s, 0])
    }
  }

  // ------------------------------------------------------------ the Vaughn Towers
  const TX0 = XU1 - 1, TX1 = 112, TY0 = -58, TY1 = 84
  const T0 = ELEV, BRICK = ELEV + 4.7, COL = ELEV + 10, TOP = ELEV + 22.5, STAIR = ELEV + 26
  {
    // the box block on the colonnade
    box(panelP, TX0, TY0, TX1, TY1, COL, TOP, conc, 0.4)
    // the colonnade: a recessed wall and round-ish columns
    box(panelP, TX0 + 4, TY0 + 4, TX1 - 5, TY1 - 4, T0, COL, null)
    for (let y = TY0 + 6; y <= TY1 - 6; y += 13) for (const x of [TX1 - 2.5, TX0 + 2.5]) box(conc, x - 0.7, y - 0.7, x + 0.7, y + 0.7, T0, COL, null)
    // the brick base wall along the west front, below the colonnade
    box(red, TX1 - 1.5, TY0, TX1 + 0.5, TY1, 0, BRICK, conc)
    // the field side: white, three glazed levels and a set-back top storey (c04)
    const ff: Face = { o: [TX0, TY1, 0], n: [-1, 0] } // s runs from y = TY1 southward... (−y)
    const L = TY1 - TY0
    panel(white, ff, L / 2, L, COL, TOP, 0.05)
    for (const [z0, z1] of [[COL + 1.2, COL + 4.2], [COL + 5.0, COL + 8.0], [COL + 8.8, COL + 11.4]]) panel(win, ff, L / 2, L - 6, z0, z1, 0.1)
    panel(red, ff, L / 2, L, TOP - 0.9, TOP - 0.5, 0.1)
    box(white, TX0 + 6, TY0 + 22, TX0 + 20, TY1 - 26, TOP, TOP + 3.6, conc, 0.3)
    panel(win, { o: [TX0 + 6, TY1 - 26, 0], n: [-1, 0] }, (L - 48) / 2, L - 52, TOP + 0.6, TOP + 3.0, 0.06)
    // the west front: grey panels, red stripes, punched window bands, four stair towers (c06)
    const wf: Face = { o: [TX1, TY0, 0], n: [1, 0] }
    for (const z of [COL + 3.4, COL + 7.6, COL + 11.6]) panel(red, wf, L / 2, L - 0.4, z, z + 0.35, 0.05)
    for (const [z0, z1] of [[COL + 1.0, COL + 3.0], [COL + 4.6, COL + 6.8], [COL + 8.6, COL + 10.8]]) {
      for (const [s0, s1] of [[11, 30], [43, 74], [88, 115], [129, 138]]) panel(win, wf, (s0 + s1) / 2, s1 - s0, z0, z1, 0.06)
    }
    for (const s of [4.5, 36, 81, 122]) {
      const y0 = TY0 + s - 4.5, y1 = TY0 + s + 4.5
      box(panelP, TX1 - 2, y0, TX1 + 3, y1, T0, STAIR, white, 0.3)
      box(white, TX1 - 2.2, y0 - 0.3, TX1 + 3.4, y1 + 0.3, STAIR, STAIR + 0.6, white, 0)
    }
    // the ends: grey
    for (const [y, n] of [[TY0, -1], [TY1, 1]] as const) {
      const ef: Face = n > 0 ? { o: [TX1, TY1, 0], n: [0, 1] } : { o: [TX0, TY0, 0], n: [0, -1] }
      panel(red, ef, (TX1 - TX0) / 2, TX1 - TX0 - 0.8, COL + 7.6, COL + 7.95, 0.05)
    }
  }

  // ------------------------------------------------------------ the north videoboard
  {
    const yb = FY - L0 - SIDE.north.d + 2, x0 = FX - 17, x1 = FX + 17, zb0 = 24, zb1 = 38.5
    box(panelP, x0, yb - 1.5, x1, yb + 1.5, zb0, zb1, conc, 0.2)
    panel(win, { o: [x1, yb + 1.5, 0], n: [0, 1] }, 17, 32, zb0 + 1, zb1 - 1, 0.06)
    for (const x of [x0 + 5, x1 - 5]) box(conc, x - 1, yb - 1.2, x + 1, yb + 1.2, 0, zb0, null)
  }

  return finishGlb('Carter–Finley Stadium', [
    { part: conc, material: finish('cf-concrete', 0xddd8cf) },
    { part: grey, material: finish('cf-seats', 0xc4c8cb) },
    { part: red, material: finish('cf-red', 0xb8564f) },
    { part: panelP, material: finish('cf-panel', 0x9ea3a9) },
    { part: win, material: PALETTE.window },
    { part: white, material: PALETTE.trim },
  ], { bearing: 143, height: ELEV + 26.6, replaces: ['relation/1216299'] }, 6500)
}

if (import.meta.main) await writeModel('ral-carter-finley-stadium', build())
