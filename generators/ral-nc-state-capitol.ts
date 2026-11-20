/**
 * North Carolina State Capitol, Raleigh (1833–40; Town & Davis, David
 * Paton): procedural, CC0-1.0.
 * bun generators/ral-nc-state-capitol.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 2.34 (the OSM
 * walls run at 2.34°/92.34°, the street grid of Union Square). Origin: the
 * area centroid of OSM way/47663703 (-78.6391014, 35.7803989). The model is
 * mirrored about both axes, as the building is.
 * y = 0 is the ground. Mapterhorn (z13; z14–15 tiles are missing here)
 * shows the knoll of Union Square within 1.2 m across the footprint;
 * elevation 0.
 *
 * OSM: way/47663703 "North Carolina State Capitol" (Q3694520, source
 * WakeGIS, no height): a cross. In the model frame the main block is
 * 20.0 × 48.0 m (x ±10, y ±24), the east and west arms 14.2 m wide
 * (y ±7.1) reaching x = ±21.85 (east 22.03, west 21.67: drawn symmetric).
 * Published (NC Dept. of Public Instruction "Carolina Clips: Capitol",
 * cited by Wikipedia's list of state capitols,
 * web.archive.org/web/20120831102956/http://www.ncwiseowl.org/carolinaclips/caroclips/raleigh/capitol.html):
 * gneiss walls; cross-shaped with a domed rotunda; 160 ft north–south
 * (48.8 m: OSM 48.0) and 140 ft east–west (42.7 m: OSM 43.7); 97.5 ft
 * (29.7 m) "from the base of the rotunda to the crown atop the dome". The
 * photos put the crown's top lower, 27–28.3 m above the lawn (c13, c14,
 * scaled through the end face's measured storeys), so the published figure
 * is probably taken from a lower base; the model follows the photos, with
 * the top at 27.75 m (after flattening the dome to the saucer the photos
 * show), so the dome keeps its proportion to the walls.
 * Wikipedia: roof and dome
 * re-roofed in copper from 2023, which is why the 2024 photos show a dark
 * brown-grey dome where older ones show green.
 * The copper is drawn 0x988f87, the new copper's warm grey (c13, c18)
 * pulled to the palette's lightness; it is shared by the dome and the
 * roofs (NAIP's pale green predates the re-roofing).
 *
 * No lidar covers Wake County in 3DEP (lidar.py find returns nothing), so
 * every height is photo-scaled (estimated), from frontal photos with
 * vertical verticals, against the OSM widths:
 *   c20 north end (20.0 m wide): blocking-course top 17.3, cornice
 *     15.95–16.6, frieze 14.6–15.95, architrave 13.7–14.6 (pilaster tops),
 *     upper windows 11.1–12.9, main-floor windows 6.1–8.6 (hoods 9.0),
 *     ground-floor windows 1.1–3.5; five bays at 3.33 m, inner pilasters
 *     1.45 m wide at x = ±1.66, ±5.0, corner antae 2.4 m.
 *   c14 east front (48 m wide): the same storeys; string course 5.5;
 *     three windows each side of the arm at |y| = 8.9, 12.2, 15.6 and a
 *     pavilion window at 20.6 between a 2 m pilaster and the corner anta;
 *     portico columns at ±2.05, ±6.1, ~1.5 m thick, on a floor at 5.0;
 *     pediment slope 0.31 (apex 18.9).
 *   c13 south end from Fayetteville Street (long lens): the dome group
 *     relative to the 4.6 m crown cylinder: octagonal lower stage (cornice
 *     12.7 m across) to 21.85, a two-step stone ring 21.85–23.45 (11.7 m),
 *     the dome 9.9 m across; c13's 3.2 m includes the crown cylinder's
 *     foot, and c14/c18 show a low saucer, so the dome rises 2.2 m to the
 *     cylinder (a sphere of radius 5.93), the cylinder 1.3 m (c16), to
 *     26.95; palmettes 0.7 m (drawn 0.8 so the crown holds at phone size).
 *     The hip roof ridge 17.8, 0.5 m over the blocking course: c14 and c18
 *     show no roof over the blocking course from the lawn. The arms' gables
 *     keep the pediments' apex, 18.9.
 *   c22, c18: the arm's side wall (one window bay, an anta at the portico
 *     end) and the portico one intercolumn deep; chimney blocks on the
 *     lower stage's diagonal faces (one seen from the south-east, one from
 *     the north-east, drawn on all four).
 *
 * Photos (evidence, Wikimedia Commons; local copies in
 * landmarks-scratch/ral/work/ral-nc-state-capitol/photos):
 *  c01 "North Carolina State Capitol, Raleigh.jpg", Jim Bowen, CC BY 2.0:
 *      portico from the north-west, rusticated basement piers, the end
 *      pavilion pilasters.
 *  c03 "North Carolina State Capitol Facade.JPG", Alexisrael, CC BY-SA 3.0:
 *      the portico frontal: four Doric columns, antae, the recessed back
 *      wall with three windows a floor.
 *  c13 "CaribMask 2024 in Raleigh, NC - Capitol.jpg", Sergiy Galyonkin,
 *      CC BY-SA 2.0: south end and the dome group, current copper colour.
 *  c14 "North Carolina State Capitol, Raleigh, NC (28221602578).jpg",
 *      Warren LeMay, CC0: east front.
 *  c16 "Exterior dome - North Carolina State Capitol - DSC05841.JPG",
 *      Daderot, public domain: the crown cylinder and its anthemion
 *      palmettes (rust-bronze), the ribbed dome.
 *  c18 "Raleigh - North Carolina State Capitol.jpg", P. Hughes, CC BY 4.0:
 *      from the north-east, 2020s: the dark copper dome, stone colour,
 *      the stepped drum, end-face pilasters.
 *  c20 "North Carolina State Capitol, Raleigh, NC (28221598188).jpg",
 *      Warren LeMay, CC0: north end, frontal.
 *  c21/c11/c12 HABS NC,92-RAL,5 photos by Archie A. Biggs, 1937 (Historic American
 *      Buildings Survey), public domain: front facade, corner, portico and
 *      dome.
 *  c22 "State Capitol, Raleigh, Wake County, North Carolina
 *      LCCN2017888973.jpg", Frances Benjamin Johnston, public domain:
 *      from the south-east: every storey, the arm, the portico in depth.
 * Aerial: USGS NAIP (public domain): the cross plan, hip roofs on the
 * main block, gables on the arms, the dome on an octagonal stage.
 *
 * Look-only (not relied on for shape or colour): Flickr 11452604123 "North
 * Carolina State Capitol", Sky Noir, CC BY-NC-ND 2.0, and 7331971852, Eric
 * Spiegel, CC BY-NC-ND 2.0: the building floodlit at night, windows lit,
 * the crown lit gold; they agree with c14's window count.
 *
 * Estimated: every height above; the portico back wall's depth (x = 15.5)
 * and the antae (to 17.5); window widths (1.4 m with the frame 1.76;
 * c20 reads 1.2 m of sash); the loggia piers (2.1 m, c14); the chimney blocks'
 * size; the dome's profile (a sphere through the measured base and the
 * crown cylinder's foot). Invented: nothing beyond the north end's centre
 * bay, hidden in every photo by the monument and drawn as a window (the
 * south end has a door and steps, c22).
 * Left out: triglyphs and mutules, rustication grooves, railings and
 * balconies, the flagpole, the window hoods' brackets, statues and
 * monuments on the grounds, the portico steps.
 * Doubts: no Mapillary (no token on this machine) and no lidar; the dome
 * group's heights rest on one long-lens photo, and disagree with the
 * published height (above); the crown's palmette count (16; the real ring
 * has about 20); the portico's depth.
 * Night: floodlit from the grounds (night photos): `floodlight` on the
 * gneiss, trim and portico shade, faces looking up barely lit; the dome
 * and the crown are lit too (the dome reads lit in the night photos);
 * windows are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, capRing, lathe, disc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, column, gable, quadO, triO, slabRing, crossRing, panel, grow } from './nash-tennessee-state-capitol'

/** A Part seen through a quarter turn about the origin, so an arm can be built pointing +y. */
function turned(p: Part, c: number, s: number): Part {
  const R = (v: V3): V3 => [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]]
  const proxy = {
    tri(a: V3, b: V3, d: V3, ua?: number[], ub?: number[], uc?: number[], n?: V3[]) {
      p.tri(R(a), R(b), R(d), ua, ub, uc, n?.map(R))
    },
    quad(a: V3, b: V3, d: V3, e: V3) {
      this.tri(a, b, d)
      this.tri(a, d, e)
    },
  }
  return proxy as unknown as Part
}

// ---------------------------------------------------------------- dimensions
const W = 10, L = 24 // main block, outer face of pilasters and plain walls (OSM)
const IN = 0.6 // recess of the bays between pilasters
const AQ = 7.1 // arm half width (OSM)
const BACK = 15.5, ANTA = 17.5, COLX = 20.6, ENT = 21.4, FRONT = 21.85 // along the arm
// heights (photo-scaled; see header)
const FLOOR = 5.0, STR0 = 5.3, STR1 = 5.55
const CAP = 13.7, FRIEZE = 14.6, CORN0 = 15.95, CORN = 16.6, BLOCK = 17.3
const RIDGE = 17.8, PED = 18.9
const WIN = { g0: 1.1, g1: 3.5, m0: 6.1, m1: 8.6, h0: 9.0, h1: 9.3, u0: 11.1, u1: 12.9 }
const WW = 1.4
// dome group
const ST_A = 6.1, ST0 = 17.6, ST1 = 21.45, ST2 = 21.85
const DR1 = 22.65, DR2 = 23.45
const DOME_R = 4.95, SPH = 5.93, CYL_R = 2.3, CYL1 = 26.95, TOP = 27.75

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), shade = new Part(), metal = new Part()

  type Kit = { tr: Part; wn: Part; mt: Part }
  const K: Kit = { tr: trim, wn: win, mt: metal }
  // a window: the panel in a pale frame (the white sashes and stone
  // architrave that make every window read in the photos), and on the main
  // floor a hood
  const windowAt = (k: Kit, f: Face, s: number, row: 'g' | 'm' | 'u', w = WW, d = 0.06) => {
    const z0 = row === 'g' ? WIN.g0 : row === 'm' ? WIN.m0 : WIN.u0
    const z1 = row === 'g' ? WIN.g1 : row === 'm' ? WIN.m1 : WIN.u1
    panel(k.wn, f, s, w, z0, z1, d)
    panel(k.tr, f, s, w + 0.36, z0 - 0.22, z1 + 0.16, d - 0.02)
    if (row === 'm') extrudeShape(k.tr, f, [[s - w / 2 - 0.3, WIN.h0], [s + w / 2 + 0.3, WIN.h0], [s + w / 2 + 0.3, WIN.h1], [s - w / 2 - 0.3, WIN.h1]], 0, 0.28)
  }
  // a door: leaves, a glazed transom, a pale surround
  const door = (k: Kit, f: Face, s: number, w: number, h: number, d = 0.04) => {
    flatShape(k.tr, f, [[s - w / 2 - 0.3, 0], [s + w / 2 + 0.3, 0], [s + w / 2 + 0.3, h + 0.35], [s - w / 2 - 0.3, h + 0.35]], d)
    panel(k.mt, f, s, w, 0, h - 0.8, d + 0.03)
    panel(k.wn, f, s, w, h - 0.7, h, d + 0.03)
  }
  const column3 = (k: Kit, f: Face, s: number, ground: 'win' | 'door' = 'win') => {
    if (ground === 'win') windowAt(k, f, s, 'g')
    else door(k, f, s, 1.6, 3.4)
    windowAt(k, f, s, 'm')
    windowAt(k, f, s, 'u')
  }

  // ============================================================ main block
  // the core wall, set back behind pilasters and plain walls
  prism(stone, null, rect(-W + IN, -L + IN, W - IN, L - IN), 0, CAP)
  // corner antae (2.4 m each way) and the end faces' inner pilasters
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x0 = sx > 0 ? W - 2.4 : -W, x1 = sx > 0 ? W : -W + 2.4
    const y0 = sy > 0 ? L - 2.4 : -L, y1 = sy > 0 ? L : -L + 2.4
    box(stone, x0, y0, x1, y1, 0, CAP, null, 0.12)
    // the long faces' pavilion pilaster, 17.6–19.6 from the centre
    box(stone, sx > 0 ? W - IN - 0.05 : -W, sy > 0 ? 17.6 : -19.6, sx > 0 ? W : -W + IN + 0.05, sy > 0 ? 19.6 : -17.6, 0, CAP, null, 0.08)
    // the plain wall between the arm and the pavilion, flush with the pilasters
    box(stone, sx > 0 ? W - IN - 0.05 : -W, sy > 0 ? AQ : -17.6, sx > 0 ? W : -W + IN + 0.05, sy > 0 ? 17.6 : -AQ, 0, CAP, null)
  }
  for (const sy of [-1, 1]) for (const x of [-5.0, -1.66, 1.66, 5.0]) {
    box(stone, x - 0.725, sy > 0 ? L - IN - 0.05 : -L, x + 0.725, sy > 0 ? L : -L + IN + 0.05, 0, CAP, null, 0.08)
  }
  // pilaster capitals: a band round the whole block just under the architrave
  slabRing(trim, chamfer(rect(-W - 0.08, -L - 0.08, W + 0.08, L + 0.08), 0.1), CAP - 0.35, CAP, null)
  // string course at the main floor
  for (const sy of [-1, 1]) {
    box(trim, -W - 0.08, sy > 0 ? L - IN - 0.1 : -L - 0.08, W + 0.08, sy > 0 ? L + 0.08 : -L + IN + 0.1, STR0, STR1, trim)
    for (const sx of [-1, 1]) box(trim, sx > 0 ? W - IN - 0.1 : -W - 0.08, sy > 0 ? AQ : -L, sx > 0 ? W + 0.08 : -W + IN + 0.1, sy > 0 ? L : -AQ, STR0, STR1, trim)
  }

  // ---------------------------------------------------------- windows of the main block
  for (const sy of [-1, 1]) {
    // end faces: five bays in the recesses between pilasters
    const f: Face = { o: [0, sy * (L - IN), 0], n: [0, sy] }
    for (const x of [-6.65, -3.33, 0, 3.33, 6.65]) {
      const s = -x * sy // s runs along -x on the north face, +x on the south
      column3(K, f, s, sy < 0 && x === 0 ? 'door' : 'win')
    }
  }
  for (const sx of [-1, 1]) {
    const f: Face = { o: [sx * W, 0, 0], n: [sx, 0] }
    const fr: Face = { o: [sx * (W - IN), 0, 0], n: [sx, 0] }
    for (const sy of [-1, 1]) {
      for (const y of [8.9, 12.2, 15.6]) column3(K, f, sy * y * sx)
      column3(K, fr, sy * 20.6 * sx)
    }
  }

  // ============================================================ the arms and porticoes
  for (const side of [1, -1]) {
    // build pointing +y, then turn: east arm (x, y) → (y, -x), west (x, y) → (-y, x)
    const T = (p: Part) => turned(p, 0, side > 0 ? -1 : 1)
    const St = T(stone), Tr = T(trim), Rf = T(roof), Wn = T(win), Sh = T(shade), Mt = T(metal)
    // the arm's body behind the portico
    box(St, -AQ, W - IN - 0.05, AQ, BACK, 0, CAP, null)
    // antae: the side walls running on to the portico
    for (const sx of [-1, 1]) box(St, sx > 0 ? AQ - 1.25 : -AQ, BACK - 0.05, sx > 0 ? AQ : -AQ + 1.25, ANTA, 0, CAP, null, 0.1)
    // string course on the side walls
    for (const sx of [-1, 1]) box(Tr, sx > 0 ? AQ - 0.05 : -AQ - 0.08, W, sx > 0 ? AQ + 0.08 : -AQ + 0.05, ANTA, STR0, STR1, Tr)
    // basement piers under the columns, the portico floor over the loggia
    for (const x of [-6.1, -2.05, 2.05, 6.1]) box(St, x - 1.05, COLX - 1.2, x + 1.05, COLX + 0.9, 0, FLOOR - 0.6, null, 0.1)
    box(Tr, -AQ, BACK, AQ, COLX + 0.95, FLOOR - 0.6, FLOOR, Tr)
    // the loggia's back wall and the portico's back wall, in shade
    const ka: Kit = { tr: Tr, wn: Wn, mt: Mt }
    const fb: Face = { o: [0, BACK, 0], n: [0, 1] }
    flatShape(Sh, fb, [[-AQ + 1.25, 0], [AQ - 1.25, 0], [AQ - 1.25, CAP], [-AQ + 1.25, CAP]], 0.02)
    // doors in the loggia (the main entrance in the middle)
    door(ka, fb, 0, 1.8, 3.6)
    for (const s of [-4.1, 4.1]) door(ka, fb, s, 1.3, 3.2)
    // main floor: a tall door onto the portico in the middle, windows each side
    panel(Wn, fb, 0, 1.5, FLOOR + 0.4, 9.0, 0.07)
    extrudeShape(Tr, fb, [[-1.1, WIN.h0], [1.1, WIN.h0], [1.1, WIN.h1], [-1.1, WIN.h1]], 0, 0.25)
    for (const s of [-4.1, 4.1]) windowAt(ka, fb, s, 'm')
    for (const s of [-4.1, 0, 4.1]) windowAt(ka, fb, s, 'u')
    // the side walls: one window bay each
    for (const sx of [-1, 1]) {
      const f: Face = { o: [sx * AQ, 0, 0], n: [sx, 0] }
      for (const row of ['g', 'm', 'u'] as const) windowAt(ka, f, sx * 13.1, row)
    }
    // the four Doric columns: fluted shafts drawn plain, no base, an echinus and abacus
    for (const x of [-6.1, -2.05, 2.05, 6.1]) column(Tr, Tr, x, COLX, 0.76, FLOOR, CAP, { base: 0, capH: 0.75, flare: true, ax: 1.75, ay: 1.75, segs: 12 })
    // pediment and the arm's gable roof (its inner end buried in the main roof)
    gable(Rf, Tr, St, AQ + 0.45, 3.4 - AQ - 0.45, FRONT, CORN, PED, [1], 0.6, 0.45)
  }

  // ============================================================ entablature, blocking course, roof
  const crossCore = crossRing(W, L, ENT - W, AQ)
  slabRing(stone, crossCore, CAP, CORN0, null) // architrave and frieze
  slabRing(trim, grow(crossCore, 0.12), FRIEZE - 0.15, FRIEZE, null) // the architrave's fillet
  const corn = chamfer(grow(crossCore, 0.45), 0.2)
  prism(trim, null, corn, CORN0 + 0.2, CORN)
  capRing(trim, corn, CORN0 + 0.2, false)
  slabRing(trim, grow(crossCore, 0.22), CORN0, CORN0 + 0.2, null)
  // blocking course on the main block, broken where the arms run through
  const BT = 0.6
  for (const sy of [-1, 1]) {
    box(stone, -W, sy > 0 ? L - BT : -L, W, sy > 0 ? L : -L + BT, CORN, BLOCK, trim, 0)
    for (const sx of [-1, 1]) box(stone, sx > 0 ? W - BT : -W, sy > 0 ? AQ + 0.45 : -L + BT, sx > 0 ? W : -W + BT, sy > 0 ? L - BT : -AQ - 0.45, CORN, BLOCK, trim, 0)
  }
  // the hip roof behind the blocking course, ridge north–south
  {
    const ex = W - BT, ey = L - BT, run = ex, ry = ey - run
    const A: V3 = [-ex, -ey, CORN], B: V3 = [ex, -ey, CORN], C: V3 = [ex, ey, CORN], D: V3 = [-ex, ey, CORN]
    const R0: V3 = [0, -ry, RIDGE], R1: V3 = [0, ry, RIDGE]
    quadO(roof, B, C, R1, R0, [RIDGE - CORN, 0, run])
    quadO(roof, D, A, R0, R1, [-(RIDGE - CORN), 0, run])
    triO(roof, A, B, R0, [0, -(RIDGE - CORN), run])
    triO(roof, C, D, R1, [0, RIDGE - CORN, run])
  }

  // ============================================================ the dome group
  // octagonal lower stage over the crossing, its cornice
  const oct = (a: number): XY[] => Array.from({ length: 8 }, (_, k) => {
    const t = ((k + 0.5) / 8) * 2 * Math.PI, r = a / Math.cos(Math.PI / 8)
    return [r * Math.cos(t), r * Math.sin(t)] as XY
  })
  prism(stone, null, oct(ST_A), ST0, ST1)
  prism(trim, trim, oct(ST_A + 0.3), ST1, ST2)
  capRing(trim, oct(ST_A + 0.3), ST1, false)
  // the four chimney blocks on its diagonal faces
  for (let k = 0; k < 4; k++) {
    const t = ((k + 0.5) / 4) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t)
    const f: Face = { o: [c * ST_A, s * ST_A, 0], n: [c, s] }
    extrudeShape(stone, f, [[-0.8, ST0], [0.8, ST0], [0.8, 20.6], [-0.8, 20.6]], -0.1, 1.0)
    extrudeShape(trim, f, [[-0.95, 20.6], [0.95, 20.6], [0.95, 20.95], [-0.95, 20.95]], -0.1, 1.15)
    // the top of the cap
    const P = (u: number, d: number): V3 => [c * (ST_A + d) - s * u, s * (ST_A + d) + c * u, 20.95]
    quadO(trim, P(-0.95, -0.1), P(0.95, -0.1), P(0.95, 1.15), P(-0.95, 1.15), [0, 0, 1])
  }
  // the stepped stone ring the dome springs from
  lathe(trim, 0, 0, [[ST_A + 0.3, ST2], [5.85, ST2], [5.85, DR1], [5.5, DR1], [5.5, DR2], [DOME_R, DR2]], 24)
  // the dome: a sphere (radius 5.15) through its foot and the crown cylinder's
  const zc = DR2 - Math.sqrt(SPH * SPH - DOME_R * DOME_R)
  const prof: [number, number][] = []
  const a0 = Math.asin(DOME_R / SPH), a1 = Math.asin(CYL_R / SPH)
  for (let k = 0; k <= 7; k++) {
    const a = a0 + ((a1 - a0) * k) / 7
    prof.push([SPH * Math.sin(a), zc + SPH * Math.cos(a)])
  }
  lathe(roof, 0, 0, prof, 24)
  // the crown: a stone cylinder, a copper top, the ring of anthemion palmettes
  const zFoot = prof[prof.length - 1][1]
  lathe(stone, 0, 0, [[CYL_R, zFoot - 0.2], [CYL_R, CYL1 - 0.15], [CYL_R + 0.08, CYL1 - 0.15], [CYL_R + 0.08, CYL1]], 16)
  disc(roof, 0, 0, CYL_R + 0.08, CYL1, 16)
  const NP = 16
  for (let k = 0; k < NP; k++) {
    const t = (k / NP) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t)
    const r = CYL_R - 0.05, hw = 0.36
    const fan: XY[] = [[-0.1, CYL1], [0.1, CYL1], [0.18, CYL1 + 0.18]]
    // the fan: a near-circle on a short stem, flush outward
    for (let j = 0; j <= 8; j++) {
      const a = -Math.PI / 2 + 0.55 + ((Math.PI * 2 - 1.1) * j) / 8
      fan.push([hw * Math.cos(a), TOP - hw + hw * Math.sin(a)])
    }
    fan.push([-0.18, CYL1 + 0.18])
    const f: Face = { o: [c * r, s * r, 0], n: [c, s] }
    extrudeShape(metal, f, fan, -0.06, 0.06)
    flatShape(metal, { o: [c * r, s * r, 0], n: [-c, -s] }, fan.map(([u, z]) => [-u, z] as XY), 0.06)
  }

  // ============================================================ materials and night
  // Floodlit from the grounds: walls, columns and the dome's stone lit,
  // faces looking up barely; the crown lit too.
  const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.2 : 1)
  return finishGlb('North Carolina State Capitol', [
    { part: stone, material: <Swatch>{ ...finish('nc-gneiss', 0xe2d8c4), floodlight: lit } },
    { part: trim, material: <Swatch>{ ...finish('nc-gneiss-trim', 0xeee6d5), floodlight: lit } },
    { part: roof, material: <Swatch>{ ...finish('nc-copper', 0x988f87), floodlight: (p: V3, n: V3) => (p[2] > DR2 - 0.1 && n[2] < 0.9 ? 0.7 : 0) } },
    { part: win, material: PALETTE.window },
    { part: shade, material: <Swatch>{ ...finish('nc-portico-shade', 0xc6bba8), floodlight: lit } },
    { part: metal, material: <Swatch>{ ...PALETTE.metal, floodlight: (p: V3) => (p[2] > CYL1 - 0.1 ? 1 : 0) } },
  ], { bearing: 2.34, height: TOP, replaces: ['way/47663703'] }, 6500)
}

if (import.meta.main) await writeModel('ral-nc-state-capitol', build())
