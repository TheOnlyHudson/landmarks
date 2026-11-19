/**
 * Cathedral of Saint Paul (1906-1915, Emmanuel L. Masqueray), Saint Paul:
 * procedural, CC0-1.0.
 * bun generators/msp-cathedral-of-saint-paul.ts [out.glb]
 *
 * Identity checked: OSM way/39633135 is named and tagged as the cathedral;
 * every photo below shows this building. The dome is dark brown copper, not
 * green (re-roofed 2002).
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's walls run within
 * 1 degree of north-south and east-west). The origin is the area centroid of
 * OSM way/39633135 (-93.109102, 44.946959). The plan is a Greek cross: the
 * entrance arm faces east (towards the Capitol, down John Ireland Blvd), the
 * transepts north and south, the apse west. The crossing and the dome's axis
 * are at x = 1.5 (lidar), y = 0 (lidar -0.3, taken as 0); the model is
 * symmetric about y = 0. y = 0 is the lowest ground under the footprint, at
 * the east front (lidar 273.2 m); the hill rises about 6 m to the west, where
 * the ground is at the church's floor level (+6).
 *
 * Form: a grey granite Greek cross. The east front: a pediment over a huge
 * round arch with the rose window and the portal, between two square bell
 * towers with arched belfries and dark copper caps; the front steps. The
 * transept ends repeat the arch, rose window and pediment without towers.
 * Four round corner chapels with small domes and lanterns in the re-entrant
 * angles. The apse: a tall half-round sanctuary with a curved metal roof, a
 * lower ring with windows, and a ring of round chapels (the Shrines of the
 * Nations) with low domes, and a low block behind. Over the crossing the drum
 * (round-headed windows, four diagonal buttresses), a balustrade with eight
 * turrets, the dark ribbed copper dome, and a tall lantern and spire with the
 * cross.
 *
 * Sources
 * - OSM (ODbL): way/39633135 (building=cathedral, the outline; no parts or
 *   heights). Plan positions of the transept (x -14.8..17.8, y +-33.3), the
 *   east arm (to x 41.5, y +-23.5), the chapels and the rear block are OSM's.
 * - USGS 3DEP lidar MN_CentralMissRiver_5_B22 (flown 2022), 1 m grid, class 18
 *   kept (tall tops are flagged as noise in this dataset); heights above the
 *   east-front grade (273.2 m): cross 99.4 (published 306.5 ft = 93.4 m above
 *   the floor at +6, so the two agree); lantern 75-89; dome surface 62 at r 14,
 *   65.5 at r 12, 68.2 at r 10, 70.6 at r 8, 72 at r 6 (measured); drum r
 *   18.5, balustrade 51-52.5; turrets 64; transept eaves 30 and ridge 37; east
 *   arm ridge 39.5; towers' caps 54; round chapels 17-20 with domes to 24-27;
 *   apse 30-37; chapel ring 17-21.
 * - USGS NAIP (public domain): the plan, the grey metal arm roofs.
 * - Published (Wikipedia, "Cathedral of Saint Paul (Minnesota)"): Rockville
 *   granite from St. Cloud; copper-clad dome, re-roofed 2001-02, after which
 *   "the previously green patina became a brown" (so the dome is dark brown,
 *   not green); height 306.5 ft; 307 x 216 ft.
 * - Photos (Wikimedia Commons):
 *   McGhiever, "Saint Paul Cathedral facade golden hour.jpg", CC BY-SA 4.0
 *     (east front, frontal: arch, rose, pediment, towers, steps);
 *   Michael Barera, "Saint Paul April 2025 11 (Cathedral of Saint Paul).jpg"
 *     and "... 12 ...", CC BY-SA 4.0 (from the north-east);
 *   AlexiusHoratius, "Cathedral of Saint Paul (Minnesota) 5.jpg", CC BY-SA 3.0
 *     (north-east, the dome, turrets and lantern);
 *   Nheyob, "Cathedral of Saint Paul (St. Paul, Minnesota) - exterior.jpg",
 *     CC BY-SA 4.0 (north-east);
 *   w_lemay, "The Cathedral of Saint Paul, Selby Avenue and Summit Avenue,
 *     Cathedral Hill, Saint Paul, MN - 51707289303.jpg" (south side),
 *     "... 51707014266.jpg" (south-west: apse, corner chapel),
 *     "... 51707651949.jpg" (apse chapels close up),
 *     "... 51707034216.jpg" (east front at night, floodlit), and
 *     "Cathedral of Saint Paul from Minnesota State Capitol ... -
 *     51670982043.jpg" (night, from the Capitol), all CC BY-SA 2.0.
 * Estimated from the photos (scaled to lidar): the arches (r 8 inside a 1.2 m
 *   archivolt, springing 24.5 on the front, 27 on the transepts, their faces
 *   set back 1.6 m as the photos' deep recesses), the transept pediments'
 *   apex (38, a metre over the lidar ridge, from the photos' pitch), the rose
 *   windows (r 4.2-4.4, centred 22.2 and 23.4), the tower
 *   stages (shaft to 36.5, belfry to 45.5, cap 46.5-54), the drum's sixteen
 *   windows (41-47), the cornice lines, the corner chapels' r 4.5, the lantern
 *   stages, the steps, the windows and doors.
 * Left out: sculpture, statues and reliefs in the pediments, columns of the
 *   portal, balustrade spindles, the dome's ribs and lucarnes, the dome's
 *   small dormers, railings, lamp standards.
 * Doubts: the rear block west of the apse (x -63..-37) is seen only from
 *   afar and in lidar; its height (16.5) and the dome on its round end are
 *   estimated. The north side is assumed to mirror the south (OSM's north
 *   outline differs by about a metre at the east corner chapel; photos from
 *   the north-east show the same round chapel).
 * Night: the whole church is floodlit, the dome, drum and lantern most
 *   (`floodlight`); windows are `window`, the doors `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, archShape, archBand, lathe, arc, outward, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'

const DX = 1.5 // the crossing / dome axis
const TX0 = -14.8, TX1 = 17.8, TY = 33.3, T_EAVE = 30, T_RIDGE = 38 // transept
const EX0 = TX1, EX1 = 41.5, EY = 23.5, E_EAVE = 30.7, E_RIDGE = 39.5, GY = 12.5 // east arm, its gabled centre
const TWX0 = 34, TWY0 = GY, TWY1 = 20, TW_SHAFT = 36.5, TW_BELL = 45.5 // towers
const FLOOR = 6 // the church floor, at the top of the front steps
const AX = TX0 // the apse centre (x), y = 0
const DR = 18.2, DRUM_TOP = 49.5, BAL = 52.6 // drum

const mirror = (f: (s: 1 | -1) => void) => { f(1); f(-1) }

function offset(r: XY[], d: number): XY[] {
  return r.map((q, i) => {
    const a = outward(r[(i - 1 + r.length) % r.length], q), b = outward(q, r[(i + 1) % r.length])
    const k = 1 + a[0] * b[0] + a[1] * b[1]
    return [q[0] + (d * (a[0] + b[0])) / k, q[1] + (d * (a[1] + b[1])) / k]
  })
}
/** A rectangle hw x hd about (cx, cy), turned by `a` degrees (hw across the radius, hd along it). */
function rotRect(cx: number, cy: number, a: number, hw: number, hd: number): XY[] {
  const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180)
  const P = (u: number, v: number): XY => [cx + u * c - v * s, cy + u * s + v * c]
  return [P(-hd, -hw), P(hd, -hw), P(hd, hw), P(-hd, hw)]
}

// OSM's apse and chapels (way/39633135, x <= -14.7), closed along the transept's west wall.
const WEST: XY[] = [
  [-14.7, 29.5], [-18.3, 29.6], [-22.0, 26.1], [-22.3, 22.1], [-20.0, 19.8], [-22.2, 20.2], [-24.6, 20.0], [-26.3, 19.7], [-27.7, 18.7],
  [-28.7, 17.3], [-30.3, 17.3], [-32.2, 16.9], [-33.6, 16.0], [-34.6, 14.8], [-35.0, 13.3], [-34.8, 11.8], [-36.6, 11.5], [-37.9, 10.6],
  [-38.7, 9.5], [-39.0, 7.9], [-38.7, 6.3], [-37.4, 4.7], [-45.2, 4.6], [-46.5, 6.2], [-46.5, 8.8], [-54.9, 8.6], [-54.8, 5.9], [-56.3, 4.5],
  [-59.6, 4.5], [-61.5, 3.4], [-62.3, 2.2], [-63.0, 0.7], [-62.4, -0.8], [-61.1, -2.3], [-59.4, -3.4], [-56.6, -3.4], [-55.1, -4.5],
  [-55.0, -7.0], [-46.4, -7.1], [-46.4, -4.5], [-44.8, -3.6], [-37.5, -3.7], [-38.5, -5.0], [-38.8, -6.8], [-38.0, -8.9], [-36.5, -9.8],
  [-34.3, -10.7], [-34.3, -12.1], [-34.0, -13.6], [-33.1, -14.7], [-31.6, -15.8], [-29.8, -16.2], [-28.3, -16.2], [-27.5, -17.2],
  [-26.4, -18.2], [-24.9, -19.0], [-23.1, -19.5], [-21.5, -19.4], [-20.3, -19.0], [-19.0, -17.8], [-18.5, -18.3], [-21.5, -20.6],
  [-21.5, -24.6], [-17.3, -28.4], [-14.7, -28.5],
]

export function build() {
  const granite = new Part(), trim = new Part(), copper = new Part(), roof = new Part(), win = new Part(), door = new Part()

  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = p, c = 0) => {
    const r = rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1))
    prism(p, top, c > 0 ? chamfer(r, c) : r, z0, z1)
  }
  const archWin = (f: Face, sc: number, w: number, z0: number, zs: number, d = 0.06, sur = 0.3) => {
    const n = w > 2.1 ? 8 : 6
    if (sur > 0) flatShape(trim, f, archShape(sc, w + 2 * sur, z0 - sur, zs, n), d)
    flatShape(win, f, archShape(sc, w, z0, zs, n), d + 0.03)
  }
  const rectWin = (f: Face, sc: number, w: number, z0: number, z1: number, d = 0.06) =>
    flatShape(win, f, rect(sc - w / 2, z0, sc + w / 2, z1), d)
  /** A rose window: a pale ring round a slate disc, with a cross of bars. */
  const rose = (f: Face, sc: number, zc: number, r: number) => {
    extrudeShape(trim, f, arc(sc, zc, r + 1.1, 0, 360, 16).slice(0, -1), 0, 0.3)
    flatShape(win, f, arc(sc, zc, r, 0, 360, 16).slice(0, -1), 0.36)
    flatShape(trim, f, rect(sc - 0.18, zc - r, sc + 0.18, zc + r), 0.4)
    flatShape(trim, f, rect(sc - r, zc - 0.18, sc + r, zc + 0.18), 0.4)
    flatShape(trim, f, arc(sc, zc, 1.0, 0, 360, 12).slice(0, -1), 0.42)
  }
  /** A gable roof with its ridge along x. */
  const gableX = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, end0: Part | null, end1: Part | null) => {
    const ym = (y0 + y1) / 2
    roof.quad([x0, y0, z0], [x1, y0, z0], [x1, ym, z1], [x0, ym, z1])
    roof.quad([x1, y1, z0], [x0, y1, z0], [x0, ym, z1], [x1, ym, z1])
    end0?.tri([x0, y1, z0], [x0, y0, z0], [x0, ym, z1])
    end1?.tri([x1, y0, z0], [x1, y1, z0], [x1, ym, z1])
  }
  /** A gable roof with its ridge along y (the gable ends come from the portals). */
  const gableY = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
    const xm = (x0 + x1) / 2
    roof.quad([x1, y0, z0], [x1, y1, z0], [xm, y1, z1], [xm, y0, z1])
    roof.quad([x0, y1, z0], [x0, y0, z0], [xm, y0, z1], [xm, y1, z1])
  }
  const shift = (f: Face, d: number): Face => ({ o: [f.o[0] - f.n[0] * d, f.o[1] - f.n[1] * d, 0], n: f.n })
  /**
   * An arm's end: a pediment over a great round arch, the arch's face set
   * back `depth` behind the front (the deep recess that carries the rose
   * window), its soffit shaded; the main cornice stops at the arch.
   * `f` is the front plane; s = 0 is the arm's axis.
   */
  const RD = 1.6
  const portal = (f: Face, half: number, eave: number, apex: number, zs: number, r: number, floor: number) => {
    const fb = shift(f, RD)
    const P: XY[] = [[r, zs], [r, eave], [half, eave], [0, apex], [-half, eave], [-r, eave], [-r, zs], ...arc(0, zs, r, 180, 0, 14).slice(1, -1)]
    extrudeShape(granite, fb, P, 0, RD)
    mirror((k) => extrudeShape(granite, fb, rect(k > 0 ? r : -half, 0, k > 0 ? half : -r, eave), 0, RD))
    flatShape(granite, fb, rect(-r, 0, r, floor), RD) // the recess's floor front
    box(granite, Math.min(f.o[0], fb.o[0]) + (f.n[0] ? 0 : -r), Math.min(f.o[1], fb.o[1]) + (f.n[1] ? 0 : -r), Math.max(f.o[0], fb.o[0]) + (f.n[0] ? 0 : r), Math.max(f.o[1], fb.o[1]) + (f.n[1] ? 0 : r), 0, floor, granite)
    // the archivolt, the cornice either side, the raking cornices
    extrudeShape(trim, f, archBand(0, zs, r - 0.1, r + 1.1, floor, 14), 0, 0.45)
    mirror((k) => extrudeShape(trim, f, rect(k > 0 ? r + 1.1 : -half - 0.3, eave - 1.2, k > 0 ? half + 0.3 : -r - 1.1, eave), 0, 0.45))
    mirror((k) => extrudeShape(trim, f, [[k * (half + 0.3), eave - 0.2], [0, apex + 0.2], [0, apex + 1.1], [k * (half + 0.3), eave + 0.7]], 0, 0.45))
    return fb
  }

  // ---------------------------------------------------------------- the transept
  box(granite, TX0, -TY + RD, TX1, TY - RD, 0, T_EAVE, roof)
  for (const [x0, x1] of [[TX0 - 0.35, TX0 + 0.5], [TX1 - 0.5, TX1 + 0.35]]) box(trim, x0, -TY - 0.3, x1, TY + 0.3, T_EAVE - 1.2, T_EAVE, trim)
  gableY(TX0, TX1, -TY, TY, T_EAVE, T_RIDGE)
  mirror((s) => {
    const g = s > 0 ? 3 : 4.5 // ground at the north and south ends
    const half = (TX1 - TX0) / 2
    const fb = portal({ o: [DX, s * TY, 0], n: [0, s] }, half, T_EAVE, T_RIDGE, 27, 8, g)
    rose(fb, 0, 23.4, 4.4)
    for (const sc of [-4.4, 0, 4.4]) archWin(fb, sc, 2.0, g + 7, g + 12, 0.08)
    extrudeShape(trim, fb, rect(-8, 17.4, 8, 18.2), 0, 0.3)
    flatShape(door, fb, archShape(0, 2.4, g, g + 4.4, 8), 0.06)
    const f: Face = { o: [DX, s * TY, 0], n: [0, s] }
    mirror((k) => {
      flatShape(door, f, archShape(k * 12.6, 2.2, g, g + 3.6, 8), 0.06)
      rectWin(f, k * 12.6, 1.0, 13.5, 24, 0.06)
    })
  })
  // the transept's flank windows (east and west faces, beyond the arms)
  mirror((s) => {
    for (const k of [-1, 1]) {
      const f: Face = { o: [k > 0 ? TX1 : TX0, s * 28.4, 0], n: [k, 0] }
      archWin(f, 0, 2.2, 14, 22, 0.06)
      archWin(f, 0, 1.6, 6.5, 9.5, 0.06)
    }
  })

  // ---------------------------------------------------------------- the east arm and front
  box(granite, EX0, -EY, EX1 - RD, EY, 0, E_EAVE, roof)
  mirror((s) => {
    box(granite, EX1 - RD, s * 20, EX1, s * EY, 0, E_EAVE, roof) // the low corners beyond the towers
    box(trim, EX0, s * (EY - 0.5), EX1 + 0.35, s * (EY + 0.35), E_EAVE - 1.2, E_EAVE, trim)
    box(trim, EX1 - 0.5, s * (GY + 0.2), EX1 + 0.8, s * (EY + 0.35), E_EAVE - 1.2, E_EAVE, trim)
  })
  gableX(EX0, EX1, -GY, GY, E_EAVE, E_RIDGE, null, null)
  const F = portal({ o: [EX1, 0, 0], n: [1, 0] }, GY, E_EAVE, E_RIDGE, 24.5, 8, FLOOR) // s = y
  rose(F, 0, 22.2, 4.2)
  extrudeShape(trim, F, rect(-8, 15.6, 8, 16.8), 0, 0.4) // the lintel over the portal
  flatShape(door, F, archShape(0, 2.8, FLOOR, FLOOR + 4.6, 8), 0.1)
  archWin(F, 0, 2.2, FLOOR + 5.6, FLOOR + 7.6, 0.1, 0)
  mirror((s) => flatShape(door, F, rect(s * 4.5 - 1.0, FLOOR, s * 4.5 + 1.0, FLOOR + 4.0), 0.1))
  // a cross on the pediment
  box(trim, EX1 - 0.4, -0.25, EX1 + 0.1, 0.25, E_RIDGE, E_RIDGE + 3.4, trim)
  box(trim, EX1 - 0.4, -1.0, EX1 + 0.1, 1.0, E_RIDGE + 2.0, E_RIDGE + 2.5, trim)
  // the front steps
  const steps: [number, number][] = [[6.0, 1.5], [4.6, 3.0], [3.2, 4.5], [1.6, FLOOR]]
  for (const [d, z] of steps) box(granite, EX1, -9.5, EX1 + d, 9.5, 0, z, granite)
  mirror((s) => box(granite, EX1, s * 9.5, EX1 + 6.4, s * 11.2, 0, FLOOR + 1.2, trim))

  // the towers
  mirror((s) => {
    const y0 = s * TWY0, y1 = s * TWY1, yc = (y0 + y1) / 2, hw = (TWY1 - TWY0) / 2, xc = (TWX0 + EX1) / 2
    box(granite, TWX0, y0, EX1 + 0.4, y1, 0, TW_SHAFT, roof)
    box(trim, TWX0 - 0.3, Math.min(y0, y1) - 0.3, EX1 + 0.7, Math.max(y0, y1) + 0.3, TW_SHAFT - 1.0, TW_SHAFT, trim)
    box(granite, TWX0 + 0.6, yc - hw + 0.6, EX1 - 0.2, yc + hw - 0.6, TW_SHAFT, TW_BELL, null, 0.4)
    box(trim, TWX0 + 0.2, yc - hw + 0.2, EX1 + 0.2, yc + hw + 0.2, TW_BELL, TW_BELL + 1.0, trim, 0.4)
    // belfry openings on the four faces, slit windows below
    const bw = 3.0
    const faces: Face[] = [
      { o: [EX1 - 0.2, yc, 0], n: [1, 0] },
      { o: [TWX0 + 0.6, yc, 0], n: [-1, 0] },
      { o: [xc, yc + s * (hw - 0.6), 0], n: [0, s] },
    ]
    for (const f of faces) archWin(f, 0, bw, 37.6, 42.6, 0.06, 0.4)
    rectWin({ o: [EX1 + 0.4, yc, 0], n: [1, 0] }, 0, 1.0, 16, 27, 0.06)
    archWin({ o: [EX1 + 0.4, yc, 0], n: [1, 0] }, 0, 1.6, FLOOR + 2, FLOOR + 5, 0.06)
    rectWin({ o: [xc, y1, 0], n: [0, s] }, 0, 1.0, 16, 27, 0.06)
    // the cap: a dark copper bell dome and a small lantern
    lathe(copper, xc, yc, [[3.5, TW_BELL + 1.0], [3.4, 47.6], [3.0, 48.8], [2.3, 50.2], [1.4, 51.2], [0.9, 51.6], [0.9, 52.5], [0.6, 53.0], [0.1, 54.0]], 8, 22.5, 382.5)
  })
  // the east arm's flanks: lunettes over the corner chapels, windows
  mirror((s) => {
    const f: Face = { o: [0, s * EY, 0], n: [0, s] }
    const sc = s > 0 ? -30.0 : 30.0 // s along the north face runs west
    flatShape(win, f, [[sc - 2.6, 22.5], [sc + 2.6, 22.5], ...arc(sc, 22.5, 2.6, 0, 180, 10)], 0.06)
    extrudeShape(trim, f, archBand(sc, 22.5, 2.6, 3.2, 22.5, 10), 0, 0.12)
    archWin(f, sc, 1.6, 9, 13, 0.06)
  })

  // ---------------------------------------------------------------- corner chapels
  const chapel = (cx: number, cy: number, r: number, h: number, face: number) => {
    lathe(granite, cx, cy, [[r, 0], [r, h]], 12)
    lathe(trim, cx, cy, [[r + 0.35, h - 1.1], [r + 0.35, h], [r - 0.2, h]], 12)
    lathe(copper, cx, cy, [[r - 0.2, h], [r - 0.8, h + 2.4], [r - 2.4, h + 4.3], [0.9, h + 5.0], [0.8, h + 7.4], [0.1, h + 9.2]], 12)
    for (const a of [face - 50, face, face + 50]) {
      const t = (a * Math.PI) / 180
      archWin({ o: [cx + r * Math.cos(t), cy + r * Math.sin(t), 0], n: [Math.cos(t), Math.sin(t)] }, 0, 1.4, 8.5, 12.5, 0.08, 0.25)
    }
  }
  mirror((s) => {
    chapel(22.4, s * 23.4, 4.5, 17.5, s * -45 + 0)
    chapel(-18.6, s * 24.6, 4.4, 17.5, s > 0 ? 135 : -135)
  })

  // ---------------------------------------------------------------- the apse and its chapels
  const W = WEST.map(([x, y]) => [x, y] as XY) // counter-clockwise already
  prism(granite, roof, W, 0, 16.5)
  prism(trim, trim, offset(W, 0.3), 15.6, 16.4)
  // the middle ring, with windows
  lathe(granite, AX, 0, [[19.5, 0], [19.5, 22]], 14, 90, 270)
  lathe(trim, AX, 0, [[19.85, 21], [19.85, 22], [19.3, 22]], 14, 90, 270)
  lathe(roof, AX, 0, [[19.3, 22], [15.5, 22.6]], 14, 90, 270)
  // the sanctuary: a tall half-round under a curved metal roof
  lathe(granite, AX, 0, [[15.5, 0], [15.5, 30]], 14, 90, 270)
  lathe(trim, AX, 0, [[15.85, 28.8], [15.85, 30], [15.6, 30]], 14, 90, 270)
  const apseRoof: [number, number][] = [[15.6, 30], [14.2, 32.4], [11.5, 34.5], [7.5, 36.2], [0.01, 37]]
  lathe(roof, AX, 0, apseRoof, 14, 90, 270)
  for (let a = 105; a <= 255; a += 25) {
    const t = (a * Math.PI) / 180
    archWin({ o: [AX + 15.5 * Math.cos(t), 15.5 * Math.sin(t), 0], n: [Math.cos(t), Math.sin(t)] }, 0, 1.8, 23.3, 26.8, 0.08, 0.25)
  }
  for (let a = 112.5; a <= 247.5; a += 22.5) {
    const t = (a * Math.PI) / 180
    archWin({ o: [AX + 19.5 * Math.cos(t), 19.5 * Math.sin(t), 0], n: [Math.cos(t), Math.sin(t)] }, 0, 1.4, 17.6, 19.6, 0.08, 0.2)
  }
  // the chapels' low domes and windows (centres fitted to OSM's round ends)
  const shrines: [number, number, number][] = [[-25.2, 16.6, 3.6], [-31.6, 13.3, 3.6], [-35.6, 7.9, 3.4]]
  for (const [cx, cy, r] of shrines) mirror((s) => {
    lathe(copper, cx, s * cy, [[r, 16.4], [r - 0.6, 18.2], [r - 2.2, 19.7], [0.01, 20.2]], 10)
    const a = Math.atan2(s * cy, cx - AX)
    archWin({ o: [cx + r * Math.cos(a), s * cy + r * Math.sin(a), 0], n: [Math.cos(a), Math.sin(a)] }, 0, 1.4, 8.5, 12.5, 0.12, 0.25)
  })
  lathe(copper, -59.2, 0.5, [[3.6, 16.4], [3.0, 18.4], [1.4, 20.0], [0.01, 20.6]], 10)
  mirror((s) => archWin({ o: [-50.7, s * 8.7, 0], n: [0, s] }, 0, 1.4, 8.5, 12.5, 0.06, 0.25))
  // close the sanctuary roof's cut face, above the transept's eaves
  {
    const pts: XY[] = apseRoof.map(([r, z]) => [r, z] as XY)
    const prof: XY[] = [[15.6, T_EAVE - 0.01], ...pts.slice(1), ...pts.slice(1).reverse().map(([r, z]) => [-r, z] as XY), [-15.6, T_EAVE - 0.01]]
    flatShape(granite, { o: [AX + 0.02, 0, 0], n: [1, 0] }, prof, 0)
  }

  // ---------------------------------------------------------------- the drum, dome and lantern
  lathe(granite, DX, 0, [[DR, 28], [DR, DRUM_TOP]], 24)
  lathe(trim, DX, 0, [[DR + 0.4, 39.4], [DR + 0.4, 40.2], [DR, 40.2]], 24)
  lathe(trim, DX, 0, [[DR, DRUM_TOP - 0.6], [DR + 0.8, DRUM_TOP], [DR + 0.8, DRUM_TOP + 1.2], [DR - 0.2, DRUM_TOP + 1.2]], 24)
  lathe(trim, DX, 0, [[DR - 0.2, DRUM_TOP + 1.2], [DR - 0.2, BAL], [DR - 0.7, BAL], [DR - 0.7, DRUM_TOP + 1.2]], 24)
  for (let k = 0; k < 16; k++) {
    const a = 22.5 * k + 11.25 + (k % 2 ? -4 : 4) // windows in pairs between the buttresses
    if (Math.abs(((a % 90) + 90) % 90 - 45) < 6) continue
    const t = (a * Math.PI) / 180
    archWin({ o: [DX + DR * Math.cos(t), DR * Math.sin(t), 0], n: [Math.cos(t), Math.sin(t)] }, 0, 2.0, 40.8, 46.9, 0.1, 0.3)
  }
  // the diagonal buttresses
  for (const a of [45, 135, 225, 315]) {
    const t = (a * Math.PI) / 180
    const cx = DX + (DR + 0.6) * Math.cos(t), cy = (DR + 0.6) * Math.sin(t)
    prism(granite, trim, chamfer(rotRect(cx, cy, a, 2.4, 1.9), 0.3), 28, BAL + 0.4)
  }
  // eight turrets on the balustrade
  for (let k = 0; k < 8; k++) {
    const a = 22.5 + 45 * k, t = (a * Math.PI) / 180
    const cx = DX + 16.9 * Math.cos(t), cy = 16.9 * Math.sin(t)
    prism(granite, null, chamfer(rotRect(cx, cy, a, 1.2, 1.2), 0.25), DRUM_TOP + 1.2, 58.2)
    archWin({ o: [cx + 1.2 * Math.cos(t), cy + 1.2 * Math.sin(t), 0], n: [Math.cos(t), Math.sin(t)] }, 0, 1.0, 54.2, 56.8, 0.06, 0)
    lathe(trim, cx, cy, [[1.75, 58.2], [1.75, 58.9], [1.1, 60.4], [0.3, 61.6], [0.02, 64.0]], 4, 45 + a, 405 + a)
  }
  // the dome (dark copper), then the lantern and spire
  lathe(copper, DX, 0, [[16.9, BAL - 0.6], [16.3, 55.5], [15.4, 59], [14, 62], [12, 65.5], [10, 68.2], [8, 70.4], [6, 72.2], [4.6, 73.2]], 24)
  lathe(copper, DX, 0, [[4.6, 73.2], [4.6, 74.6], [3.1, 74.6]], 12)
  lathe(copper, DX, 0, [[3.0, 74.6], [3.0, 82.4], [3.7, 82.6], [3.7, 83.6], [3.1, 83.8], [2.5, 85.8], [1.3, 87.6], [0.9, 88.1], [0.9, 90], [1.3, 90.6], [0.55, 91.8], [0.15, 97.4]], 12)
  for (let k = 0; k < 8; k++) {
    const t = ((22.5 + 45 * k) * Math.PI) / 180
    archWin({ o: [DX + 3.0 * Math.cos(t), 3.0 * Math.sin(t), 0], n: [Math.cos(t), Math.sin(t)] }, 0, 1.0, 76.4, 80.6, 0.06, 0)
  }
  box(trim, DX - 0.14, -0.14, DX + 0.14, 0.14, 97.2, 99.4, trim)
  box(trim, DX - 0.14, -0.75, DX + 0.14, 0.75, 98.3, 98.6, trim)

  // ---------------------------------------------------------------- materials and night
  // Floodlit all round; the dome, drum and lantern brightest; tops catch little.
  const lit = (p: V3, n: V3): number => (n[2] > 0.75 ? 0.3 : p[2] > 40 ? 1 : 0.8)
  return finishGlb('Cathedral of Saint Paul', [
    { part: granite, material: { ...finish('rockville-granite', 0xe2ddd3), floodlight: lit } },
    { part: trim, material: { ...finish('granite-trim', 0xf2eee6), floodlight: lit } },
    { part: copper, material: { ...finish('cathedral-copper', 0x565c63, 0.6), floodlight: (p: V3) => (p[2] > 50 ? 0.9 : 0.5) } },
    { part: roof, material: finish('cathedral-roof', 0x868d94) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], {
    bearing: 0, height: 99.4,
    replaces: ['way/39633135'],
  }, 6500)
}

if (import.meta.main) await writeModel('msp-cathedral-of-saint-paul', build())
