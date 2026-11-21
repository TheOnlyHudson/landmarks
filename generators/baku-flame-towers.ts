/**
 * Flame Towers (Alov qüllələri), Baku. HOK, built 2007–2012: three
 * flame-shaped glass towers on a podium on the hill above the bay, Tower 1
 * (south, residential, 182 m), Tower 2 (west, Fairmont hotel, 165 m) and
 * Tower 3 (north, offices, 161 m).
 *
 * Identity, in order: three glass flames whose plans are rounded triangles
 * with a flat face to the middle of the group and a corner pointing out;
 * each rises with that outer corner nearly upright and the rest of the
 * plan sweeping up and over to a sharp tip above it, so the three tips
 * fan outward; blue-silver glass by day; the dark double band at about
 * four fifths of each tower's height; the LED facade at night.
 *
 * Form: each storey's section is the OSM outline (grown 3%), first swollen
 * about the plan's centre by the bulge 1 + 0.85 t (1 - t)^3, then drawn in
 * by the taper (1 - t^1.9)^q toward a centre that starts at the outer
 * corner and drifts in by `drift` t^3 (late, so the tip flicks in near the
 * top); t = z / height. Fitted (review
 * round 2) to silhouette edges measured in p02 (east) and p03 (south-east):
 * each tower is widest at t 0.15-0.2 with the base 0.94 of that, 0.62 of
 * the base at t 0.8 and 0.34 at 0.95; Tower 1's widest width is 0.42-0.45
 * of its height in p02, p06 and p12, against 0.37 from the OSM plan alone,
 * hence the 3% growth (the outline is likely traced inside the curved
 * glass) and the bulge. Crowns per tower (round 2): Tower 1 q 0.45, drift
 * 0.22 (its tip about a quarter of the width in from the outer edge in
 * p02); Tower 2 q 0.3, drift 0.1, the blunter bullet crown it shows from
 * the east (p02); Tower 3 q 0.62, drift 0.18, the sharp flick near its
 * outer edge (p02, p03, p12). The two corners of the flat inner face are kept as
 * creases, as in p06 and p03. Round 3: above 0.9 of the height each crown
 * runs on from the dome without a kink, then hollows into a concave sweep
 * to a sharp point that leans back out a little (p12, p02 Tower 3):
 * flick exponents 1.35 / 1.0 / 1.5, Tower 2 the bluntest.
 *
 * Night: the facades are covered with LED lines along the floor edges that
 * play a flame animation (mostly orange and red, at times the flag; p01,
 * p09, p10, p11). The glass is drawn as alternating bands that are the same
 * blue-silver by day: `window` bands, which the map lights warm amber at
 * night (standing in for the orange-red flame, the closest the material
 * conventions allow without coloured stripes by day), and `glass` bands
 * between them, which stay dark. The low model has a band every three
 * floors (lit 36%), the detail model one per floor (lit 32%), as the real
 * lines are. Podium windows are `window-2` and glow too.
 *
 * Evidence (all Wikimedia Commons):
 * - p01 https://commons.wikimedia.org/wiki/File:Flame_towers_from_Baku_boulevard.JPG
 *   Xoncha, CC BY-SA 4.0: night, red LED, from the boulevard (ESE).
 * - p02 https://commons.wikimedia.org/wiki/File:Flame_Towers_von_der_Uferpromenade.jpg
 *   KeuleKeulmann, CC BY-SA 4.0: day, from the funicular's lower station
 *   (east, about 87 degrees): profile, tips, band, glass colour.
 * - p03 https://commons.wikimedia.org/wiki/File:Flame_towers.jpg
 *   KeuleKeulmann, CC BY-SA 4.0: day, overcast, from the south-east
 *   (about 130-140 degrees): tips, creases, the grey podium, glass colour.
 * - p04 https://commons.wikimedia.org/wiki/File:Flame_Tower_-_panoramio.jpg
 *   Stomatoloq Fərid Zey… (Panoramio), CC BY-SA 3.0: evening, from the
 *   old city (NE): glass colour.
 * - p05 https://commons.wikimedia.org/wiki/File:Baku_1.JPG
 *   Peter in s, CC BY-SA 3.0: sunlit glass colour.
 * - p06 https://commons.wikimedia.org/wiki/File:View_From_Maidens_Tower_(221090097).jpeg
 *   Francisco Anzola, CC BY 3.0: day, from the Maiden Tower (about 55
 *   degrees): tip positions, creases, the double band.
 * - p07 https://commons.wikimedia.org/wiki/File:Panorama_of_Flame_Towers.jpg
 *   Shefiqe Fazil and Hikmet Shahverdizade, CC BY-SA 3.0: from the bay,
 *   relative heights.
 * - p08 https://commons.wikimedia.org/wiki/File:Window_washers_cleaning_the_glass_windows_of_the_Flame_Towers.jpg
 *   Ilgar Jafarov, CC BY-SA 4.0: the curtain wall close up.
 * - p09 https://commons.wikimedia.org/wiki/File:Пламенные_башни.jpg
 *   Bright estrellas, CC BY-SA 4.0: dusk, orange LED lines per floor.
 * - p10 https://commons.wikimedia.org/wiki/File:Flame_Towers.jpg
 *   Saidaa444, CC BY-SA 4.0: night, the flag colours.
 * - p11 https://commons.wikimedia.org/wiki/File:BAKU_AT_NIGHT_.RED_TOWERS.באקו_בלילה_מגדלים_באדום.jpg
 *   Avisadehh, CC0: night, red.
 * - p12 https://commons.wikimedia.org/wiki/File:Baku%27s_beauty.jpg
 *   Saidaa444, CC BY-SA 4.0: day, from the west (about 250 degrees): the
 *   crowns from the far side.
 * - OSM (OSM API, 2026-11): way/253081850 Tower 1 (height 181.8, 39
 *   levels), way/253082095 Tower 2 (164.6), way/253081914 Tower 3 (160.8),
 *   way/687226634 the podium (3 levels), way/687226633 the annex east of
 *   Tower 3; way/340060268 is the tourism=attraction landuse area
 *   (wikidata Q80499), not a building.
 * - Published: heights 182 / 165 / 161 m and 33 / 30 / 28 floors,
 *   Wikipedia "Flame Towers" (citing Emporis); HOK architect; the LED
 *   facade (Traxon / Vetas, over 10,000 luminaires), same article.
 * - Mapterhorn terrain (z12 only here): the site falls about 33 m to the
 *   north-east across the footprint; the map drapes the podium over it.
 * - No lidar or NAIP (outside the US). Look-only references: none.
 *
 * Numbers: tower heights published; plans OSM, grown 3% (estimated); the
 * profile measured from p02 and p03 (estimated, ±5%); the band at
 * 0.795–0.82 of each height (p02, p06, p03; estimated, the photos' own
 * perspective makes it uncertain by ±0.02); glass #a9bcc6, sampled from
 * p02–p05 (#849296 to #becdd4, the sunlit sides lightest) and pulled light,
 * a light steel blue-grey as p12 and p03 read (round 3); the band
 * charcoal #4f565e; the podium grey-green #9ea8a3 for walls and roof (p03,
 * #6f726c / #545851 under overcast, pulled light), with one quiet glazed
 * ribbon under its edge (#7e8f93; invented from the storey count); the red
 * box on the podium between Towers 2 and 3 (p03, #791f28 pulled to
 * #b8494a), about 16 x 10 x 9 m (estimated from p03); podium 14 m and
 * annex 9 m (three and two storeys, estimated).
 *
 * Doubts: the podium is barely seen in any open photo (p03 shows grey
 * blocks, a red box and green glass by Tower 3); its walls, glazing,
 * heights and the red box's size and place are approximate. The towers'
 * upper plans are assumed similar to the OSM base outline. From the west
 * (p12) Tower 1's tip stands nearer the middle of its silhouette and
 * Tower 2's crown is more pointed than the model's (both are right from the
 * east); one similar-section form can't match every side. The LED lines
 * are amber in the map rather than the real orange-red. The Fairmont's
 * entrance canopy (p09) is left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, windowVariant, type Swatch } from './palette'
import { triangulate, type XY } from './chi-aon-center'

// ---- Frame -----------------------------------------------------------------------------------------------
// Anchor: the area-weighted centroid of the podium (way/687226634), the two
// towers outside it (way/253082095, way/253081914) and the annex
// (way/687226633). Tower 1 (way/253081850) stands inside the podium outline.
export const ANCHOR: [number, number] = [49.82648, 40.3598]
const KX = 111320 * Math.cos((ANCHOR[1] * Math.PI) / 180), KY = 110574
const local = (c: number[][]): XY[] => c.map(([lo, la]) => [(lo - ANCHOR[0]) * KX, (la - ANCHOR[1]) * KY] as XY)

const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const ccw = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)
const open = (r: XY[]) => (Math.hypot(r[0][0] - r[r.length - 1][0], r[0][1] - r[r.length - 1][1]) < 0.01 ? r.slice(0, -1) : r)

// OSM outlines (OSM API, 2026-11), lon/lat.
const T1_OSM = [[49.8269463, 40.3594531], [49.8268139, 40.359404], [49.8267435, 40.359381], [49.8266713, 40.3593671], [49.8265165, 40.359345], [49.826535, 40.3592169], [49.8266133, 40.359068], [49.8267156, 40.3589658], [49.8268201, 40.3588985], [49.8269976, 40.3588466], [49.8270876, 40.3589667], [49.8271105, 40.3590643], [49.8271025, 40.3592004], [49.8270346, 40.3593532], [49.8269463, 40.3594531]]
const T2_OSM = [[49.8261683, 40.3601262], [49.826119, 40.3599798], [49.8261017, 40.3599171], [49.8261068, 40.3598589], [49.8261238, 40.3597475], [49.8259708, 40.359717], [49.8257592, 40.3597188], [49.825588, 40.3597581], [49.8254748, 40.3598069], [49.8253558, 40.3599113], [49.8254788, 40.3600218], [49.8255967, 40.3600747], [49.8257571, 40.3601144], [49.8259647, 40.3601367], [49.8261683, 40.3601262]]
const T3_OSM = [[49.8267434, 40.3608536], [49.8268012, 40.3607591], [49.8268379, 40.3606337], [49.8268348, 40.3605877], [49.826827, 40.3604735], [49.8267724, 40.3603514], [49.8267225, 40.3603601], [49.8266207, 40.3603807], [49.8265474, 40.360391], [49.8264709, 40.3603927], [49.8263237, 40.3603903], [49.8262985, 40.3605093], [49.8263209, 40.3606696], [49.8263884, 40.3607958], [49.8264629, 40.360877], [49.826569, 40.3609349], [49.8266093, 40.3609492], [49.8267434, 40.3608536]]
const PODIUM_OSM = [[49.8267225, 40.3603601], [49.8267232, 40.3602894], [49.8267424, 40.3602442], [49.826847, 40.3602401], [49.8268792, 40.360236], [49.8269342, 40.3602104], [49.8269717, 40.3601593], [49.8270066, 40.3600868], [49.8269999, 40.3600398], [49.8269154, 40.3599754], [49.8269945, 40.3599887], [49.8270361, 40.3598916], [49.8270079, 40.3598671], [49.8270817, 40.3598017], [49.8271112, 40.3597536], [49.8271233, 40.3597117], [49.8271166, 40.3596954], [49.8270991, 40.3596903], [49.8271555, 40.3595922], [49.8271662, 40.3595411], [49.8271997, 40.3593837], [49.8271166, 40.3593612], [49.8272654, 40.3591538], [49.827244, 40.358883], [49.8271528, 40.3587797], [49.8270174, 40.3587245], [49.8268296, 40.3587205], [49.8266807, 40.3588043], [49.8265305, 40.3590046], [49.8265895, 40.359025], [49.8265117, 40.3590925], [49.8264769, 40.3590557], [49.8263655, 40.3590935], [49.8263696, 40.3591415], [49.8260933, 40.3593663], [49.8261376, 40.3593909], [49.8261309, 40.3594072], [49.8260719, 40.3593827], [49.8259485, 40.3594624], [49.8259592, 40.3594828], [49.8259243, 40.3595155], [49.8258761, 40.3595074], [49.8257849, 40.3596279], [49.8257592, 40.3597188], [49.8259708, 40.359717], [49.8261238, 40.3597475], [49.8261068, 40.3598589], [49.8261017, 40.3599171], [49.826119, 40.3599798], [49.8261683, 40.3601262], [49.8259647, 40.3601367], [49.8257607, 40.3601552], [49.8256722, 40.3602268], [49.8258989, 40.3603882], [49.8261765, 40.3605712], [49.8262569, 40.360472], [49.8262636, 40.3605558], [49.8263209, 40.3606696], [49.8262985, 40.3605093], [49.8263237, 40.3603903], [49.8264709, 40.3603927], [49.8265474, 40.360391], [49.8266207, 40.3603807], [49.8267225, 40.3603601]]
const ANNEX_OSM = [[49.8267232, 40.3602894], [49.8268068, 40.3602677], [49.8268564, 40.3603637], [49.8268738, 40.3603576], [49.8268872, 40.3604025], [49.8268618, 40.3604097], [49.8268886, 40.3604996], [49.8268805, 40.3605977], [49.8268348, 40.3605877], [49.826827, 40.3604735], [49.8267724, 40.3603514], [49.8267225, 40.3603601], [49.8267232, 40.3602894]]

// ---- Tower form ------------------------------------------------------------------------------------------
type TowerSpec = {
  name: string
  osm: number[][]
  /** Index of the outward corner of the OSM outline: the flame's tip rises over it. */
  apex: number
  /** The two corners of the flat inner face (OSM indices). Their edges are the creases that sweep up to the tip. */
  inner: [number, number]
  height: number
  /** Crown fullness: lower is blunter (a bullet), higher a sharper flick. */
  q: number
  /** The crown's concave flick: above 1, the sides hollow toward the point. */
  flick: number
  /** How far the tip moves in from the outer corner toward the plan's centre. */
  drift: number
  /** Ground under the tower above the footprint's lowest ground (y = 0), from the map's terrain: estimated. */
  base: number
  /** Floors with LED lines (published 33 / 30 / 28). */
  floors: number
}
export const TOWERS: TowerSpec[] = [
  { name: 'Tower 1 (south, residential)', osm: T1_OSM, apex: 9, inner: [0, 4], height: 182, q: 0.45, flick: 1.35, drift: 0.22, base: 0, floors: 33 },
  { name: 'Tower 2 (west, Fairmont hotel)', osm: T2_OSM, apex: 9, inner: [0, 4], height: 165, q: 0.3, flick: 1.0, drift: 0.1, base: 0, floors: 30 },
  { name: 'Tower 3 (north, offices)', osm: T3_OSM, apex: 16, inner: [5, 10], height: 161, q: 0.62, flick: 1.5, drift: 0.18, base: 0, floors: 28 },
]

/**
 * Resample a closed ring to n points, starting at its first corner, with the
 * corners kept exactly and the points between spread by arc length.
 */
function resample(r: XY[], corners: number[], n: number): { ring: XY[]; corner: boolean[] } {
  const cs = [...corners].sort((a, b) => a - b)
  const spans = cs.map((c, k) => {
    const e = cs[(k + 1) % cs.length], pts: XY[] = []
    for (let i = c; ; i = (i + 1) % r.length) { pts.push(r[i]); if (i === e) break }
    return pts
  })
  const lenOf = (pts: XY[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)
  const L = spans.map(lenOf), total = L.reduce((s, v) => s + v, 0)
  const counts = L.map((l) => Math.max(2, Math.round((l / total) * n)))
  const ring: XY[] = [], corner: boolean[] = []
  spans.forEach((pts, k) => {
    const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
    for (let m = 0; m < counts[k]; m++) {
      let d = (m / counts[k]) * L[k], i = 0
      while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++ }
      const t = seg[i] ? d / seg[i] : 0, a = pts[i], b = pts[i + 1]
      ring.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
      corner.push(m === 0)
    }
  })
  return { ring, corner }
}

/** A light Laplacian pass that leaves the corners where they are. */
function soften(r: XY[], k: number, keep: boolean[]): XY[] {
  let q = r
  for (let it = 0; it < k; it++)
    q = q.map((p, i) => keep[i] ? p : [
      0.5 * p[0] + 0.25 * (q[(i - 1 + q.length) % q.length][0] + q[(i + 1) % q.length][0]),
      0.5 * p[1] + 0.25 * (q[(i - 1 + q.length) % q.length][1] + q[(i + 1) % q.length][1]),
    ] as XY)
  return q
}

// The profile: s(t) is the section's scale about the apex, t = z / height:
// (1 - t^p)^q (1 + A t (1 - t)^3), fitted to Tower 1's silhouette edges in
// p02 and p03 (see the header): the base 0.94 of the widest section at
// t 0.15-0.2, 0.62 at 0.8, 0.34 at 0.95. q shapes the crown, per tower.
export const PROFILE = { p: 1.9, A: 0.85 }
const taperBody = (t: number, q: number) => Math.pow(Math.max(0, 1 - Math.pow(t, PROFILE.p)), q)
// The flick (review round 3, p12 and p02): above CROWN the sides run on
// from the dome without a kink, then hollow into a concave sweep to a sharp
// point: width T(CROWN) (1 - u)^flick (1 + a u), u the share of the crown
// climbed, with a set so the slope matches the body's at CROWN.
export const CROWN = 0.9
const bulgeOf = (t: number) => 1 + PROFILE.A * t * Math.pow(1 - t, 3)
const taperOf = (t: number, q: number, flick: number) => {
  if (t <= CROWN) return taperBody(t, q)
  const T0 = taperBody(CROWN, q), h = 1e-4
  const k0 = -((taperBody(CROWN, q) - taperBody(CROWN - h, q)) / h) * (1 - CROWN) / T0
  const u = Math.min(1, (t - CROWN) / (1 - CROWN)), a = flick - k0
  return T0 * Math.pow(1 - u, flick) * (1 + a * u)
}
// In the flick the tip swings back out a little toward the outer corner,
// so the point leans outward (p12).
const dOf = (t: number, drift: number) => {
  const d = drift * Math.pow(Math.min(t, CROWN), 3)
  return t <= CROWN ? d : d * (1 - 0.6 * (t - CROWN) / (1 - CROWN))
}
// The OSM outlines are drawn a little inside the curved glass; the photos
// (p02, p06, c22 from the west) give Tower 1 a widest width of 0.42-0.45 of
// its height against 0.37 from OSM alone. Plans are grown 3% (estimated).
const PLAN_GROW = 1.03

export type Mats = { lit: Part; dark: Part; band: Part }

/**
 * One flame. Sections are the OSM plan scaled toward a centre that starts at
 * the outward corner, so the corner edge stays nearly upright while the flat
 * inner face sweeps up and over to the tip.
 */
export function flame(m: Mats, spec: TowerSpec, n0: number, floorsPerStripe: number, litShare: number, extraLevels: number, doubleBand = false) {
  const raw = open(local(spec.osm))
  const apexPt = raw[spec.apex]
  const fp = ccw(raw)
  const cornerIdx = [spec.apex, ...spec.inner].map((i) => fp.indexOf(raw[i]))
  const rs = resample(fp, cornerIdx, n0)
  const sharp = rs.corner
  const n = rs.ring.length
  const g: XY = rs.ring.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n], [0, 0] as XY)
  const grow = (p: XY): XY => [g[0] + (p[0] - g[0]) * PLAN_GROW, g[1] + (p[1] - g[1]) * PLAN_GROW]
  const ring = soften(rs.ring, 2, rs.corner).map(grow)
  const apex = grow(apexPt)
  const H = spec.height
  const floorH = 0.78 * H / spec.floors
  const at = (i: number, t: number): V3 => {
    // The bulge swells the whole section about the plan's centre, so the
    // outer edge bows out too (p02, c22); the taper then draws the section
    // in toward the tip, which starts at the outer corner and drifts inward.
    const B = bulgeOf(t), T = taperOf(t, spec.q, spec.flick), d = dOf(t, spec.drift)
    const ax = g[0] + B * (apex[0] - g[0]), ay = g[1] + B * (apex[1] - g[1])
    const cx = ax + (g[0] - ax) * d, cy = ay + (g[1] - ay) * d
    const p = ring[i % n], px = g[0] + B * (p[0] - g[0]), py = g[1] + B * (p[1] - g[1])
    return [cx + T * (px - cx), cy + T * (py - cy), spec.base + t * H]
  }
  // Levels: stripe edges, the dark band at ~0.79 H (p02, p06), and extra
  // rings toward the tip where the curve tightens.
  type Lvl = { t: number; mat: 'lit' | 'dark' | 'band' }
  const lv: Lvl[] = []
  const period = floorsPerStripe * floorH
  const BAND0 = 0.795, BAND1 = 0.82
  for (let z = 0; z < H * 0.985; z += period) {
    lv.push({ t: z / H, mat: 'dark' })
    lv.push({ t: (z + period * (1 - litShare)) / H, mat: 'lit' })
  }
  // The band.
  const cut = lv.filter((l) => l.t < BAND0 || l.t > BAND1)
  const matAt = (t: number) => { let mm: Lvl['mat'] = 'dark'; for (const l of lv) if (l.t <= t + 1e-9) mm = l.mat; return mm }
  cut.push({ t: BAND0, mat: 'band' }, { t: BAND1, mat: matAt(BAND1) })
  // The detail model draws the band as the two dark lines it is (p06), glass between.
  const LINE = 0.0065
  if (doubleBand) cut.push({ t: BAND0 + LINE, mat: 'dark' }, { t: BAND1 - LINE, mat: 'band' })
  const inBand = (t: number) => t >= BAND0 - 1e-9 && t < BAND1 - 1e-9 && (!doubleBand || t < BAND0 + LINE - 1e-9 || t >= BAND1 - LINE - 1e-9)
  // Rings through the flick, the first exactly at its start.
  const crownRings = Math.max(3, Math.round(extraLevels * 0.6))
  for (let j = 0; j < crownRings; j++) {
    const t = CROWN + (1 - CROWN) * (1 - Math.pow(1 - j / crownRings, 1.3))
    if (cut.every((l) => Math.abs(l.t - t) > 0.002)) cut.push({ t, mat: 'lit' })
  }
  for (let k = 1; k <= extraLevels; k++) {
    const t = 1 - Math.pow(1 - k / (extraLevels + 1), 2.2) * 0.5
    if (t > CROWN) continue
    // Only where it doesn't crowd a stripe edge, so the stripes keep their spacing.
    if (t > 0.5 && cut.every((l) => Math.abs(l.t - t) > 0.004)) cut.push({ t, mat: 'lit' })
  }
  cut.sort((a, b) => a.t - b.t)
  const levels = cut.map((l) => ({ t: l.t, mat: inBand(l.t) ? 'band' as const : l.t >= BAND0 && l.t < BAND1 ? 'dark' as const : matAt(l.t) }))
  levels.push({ t: 1, mat: 'lit' })
  // Smooth normals by finite differences; one-sided at the creases, so the
  // corners stay crisp (side +1: the face after the vertex, -1: before).
  const nrm = (i: number, t: number, dt: number, side: number): V3 => {
    const crease = sharp[i % n] && i % n !== 0
    const a = crease && side < 0 ? at(i, t) : at(i + 1, t), b = crease && side > 0 ? at(i, t) : at(i + n - 1, t)
    const t0 = Math.max(0, t - dt), t1 = Math.min(0.999, t + dt)
    const u = at(i, t1), v = at(i, t0)
    const ta: V3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], tv: V3 = [u[0] - v[0], u[1] - v[1], u[2] - v[2]]
    const c: V3 = [ta[1] * tv[2] - ta[2] * tv[1], ta[2] * tv[0] - ta[0] * tv[2], ta[0] * tv[1] - ta[1] * tv[0]]
    const l = Math.hypot(...c) || 1
    return [c[0] / l, c[1] / l, c[2] / l]
  }
  // Below the tower's own ground the base ring runs straight down to y = 0,
  // into the hill on the uphill side.
  for (let i = 0; i < n; i++) {
    const a = at(i, 0), b = at(i + 1, 0)
    m.dark.quad([a[0], a[1], 0], [b[0], b[1], 0], b, a)
  }
  for (let k = 0; k < levels.length - 1; k++) {
    const t0 = levels[k].t, t1 = levels[k + 1].t
    const part = m[levels[k].mat]
    const last = k === levels.length - 2
    for (let i = 0; i < n; i++) {
      const j = i + 1
      const a = at(i, t0), b = at(j, t0), c = at(j, t1), d = at(i, t1)
      const na = nrm(i, t0, 0.01, 1), nb = nrm(j % n, t0, 0.01, -1), nc = nrm(j % n, t1, 0.01, -1), nd = nrm(i, t1, 0.01, 1)
      if (last) {
        part.tri(a, b, d, [0, 0], [0, 0], [0, 0], [na, nb, [0, 0, 1]])
      } else {
        part.tri(a, b, c, [0, 0], [0, 0], [0, 0], [na, nb, nc])
        part.tri(a, c, d, [0, 0], [0, 0], [0, 0], [na, nc, nd])
      }
    }
  }
}

// ---- Podium ----------------------------------------------------------------------------------------------
// The podium: three storeys (OSM building:levels=3), 4.6 m each: estimated.
// The map drapes it over the slope.
export const PODIUM_H = 14
export const ANNEX_H = 9 // the low annex east of Tower 3, two storeys: estimated

function prism(walls: Part, roof: Part, r: XY[], z0: number, z1: number) {
  const q = ccw(open(r))
  for (let i = 0; i < q.length; i++) {
    const a = q[i], b = q[(i + 1) % q.length]
    walls.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (const [i, j, k] of triangulate(q)) roof.tri([q[i][0], q[i][1], z1], [q[j][0], q[j][1], z1], [q[k][0], q[k][1], z1])
}

/** A quiet ribbon of glazing along each podium wall longer than 5 m, ends stopped short of the corners. */
function podiumWindows(win: Part, r: XY[], z0: number, z1: number, skip: XY[][]) {
  const q = ccw(open(r))
  const onTower = (p: XY) => skip.some((t) => t.some((v) => Math.hypot(v[0] - p[0], v[1] - p[1]) < 0.5))
  for (let i = 0; i < q.length; i++) {
    const a = q[i], b = q[(i + 1) % q.length]
    if (onTower(a) && onTower(b)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 5) continue
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux // outward for a CCW ring
    const s0 = 0.8, s1 = L - 0.8
    const p0: XY = [a[0] + ux * s0 + nx * 0.05, a[1] + uy * s0 + ny * 0.05]
    const p1: XY = [a[0] + ux * s1 + nx * 0.05, a[1] + uy * s1 + ny * 0.05]
    win.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
  }
}

/** A box turned `deg` clockwise from north, from z0 to z1. */
function box(part: Part, c: XY, w: number, d: number, deg: number, z0: number, z1: number) {
  const a = (deg * Math.PI) / 180, ex: XY = [Math.cos(a), -Math.sin(a)], ey: XY = [Math.sin(a), Math.cos(a)]
  const r: XY[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => [c[0] + ex[0] * i * w / 2 + ey[0] * j * d / 2, c[1] + ex[1] * i * w / 2 + ey[1] * j * d / 2] as XY)
  prism(part, part, r, z0, z1)
}

// ---- Materials -------------------------------------------------------------------------------------------
// The glass, blue-silver by day (sampled from p02, p03, p04, p05: #849296 to
// #becdd4, the sunlit sides lightest), pulled to the palette's light
// reflective-glass tone. Lit and dark stripes share it by day; at night the
// `window` stripes glow (the map's warm amber, the LED flame's colour) and the
// `glass` stripes between them stay dark, as the LED lines do.
const GLASS_DAY = 0xa9bcc6 // round 3: light steel blue-grey (p12, p03)
const LIT: Swatch = { name: 'window', color: GLASS_DAY, roughness: 0.3 }
const DARK: Swatch = { name: 'glass', color: GLASS_DAY, roughness: 0.3 }
const BAND: Swatch = finish('band-charcoal', 0x4f565e, 0.6)
// The podium, walls and roof alike: grey-green concrete and glass (p03,
// #6f726c / #545851 under overcast, pulled light), kept quiet.
const STONE: Swatch = finish('podium-grey-green', 0x9ea8a3)
const PODWIN: Swatch = windowVariant(2, 0x7e8f93)
// The red box on the podium between Towers 2 and 3 (p03; #791f28 under
// overcast, pulled to the palette's lightness).
const RED: Swatch = finish('podium-red', 0xb8494a)

export function build(detail: boolean) {
  const lit = new Part(), dark = new Part(), band = new Part(), stone = new Part(), podwin = new Part(), red = new Part()
  for (const t of TOWERS) flame({ lit, dark, band }, t, detail ? 64 : 22, detail ? 1 : 3, detail ? 0.32 : 0.36, detail ? 14 : 4, detail)
  const towersLocal = TOWERS.map((t) => open(local(t.osm)))
  prism(stone, stone, local(PODIUM_OSM), 0, PODIUM_H)
  prism(stone, stone, local(ANNEX_OSM), 0, ANNEX_H)
  // One glazed ribbon under the roof edge.
  podiumWindows(podwin, local(PODIUM_OSM), PODIUM_H - 4.6, PODIUM_H - 1.2, towersLocal)
  podiumWindows(podwin, local(ANNEX_OSM), ANNEX_H - 4.2, ANNEX_H - 1.2, [])
  // The red box: about 16 x 10 m and 9 m tall on the podium roof, square to
  // the podium's north-west wall (size and place estimated from p03).
  box(red, [-24.5, 64], 16, 10, 48, PODIUM_H - 0.2, PODIUM_H + 9)
  return [
    { part: lit, material: LIT },
    { part: dark, material: DARK },
    { part: band, material: BAND },
    { part: stone, material: STONE },
    { part: podwin, material: PODWIN },
    { part: red, material: RED },
  ]
}

if (import.meta.main) {
  for (const [file, detail, maxTris, maxBytes] of [
    ['baku-flame-towers.glb', false, 6500, 250 * 1024],
    ['baku-flame-towers.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const parts = build(detail)
    const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Flame Towers', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor', anchor: ANCHOR, bearing: 0 })
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
