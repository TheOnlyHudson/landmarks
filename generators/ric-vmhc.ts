/**
 * Virginia Museum of History & Culture (Battle Abbey), Richmond — procedural,
 * CC0-1.0, no textures.
 * bun generators/ric-vmhc.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/598522099 "Battle Abbey" (lng -77.4738241, lat
 * 37.5581026), which covers the whole museum. Its walls run at 24° and 114°,
 * so the model is placed at bearing 24 and built square: model +x is the
 * Arthur Ashe Boulevard front (world ESE), model +y the north end.
 *
 * What it is: Battle Abbey (Bebb & Gould, 1913), a one-storey neoclassical
 * memorial hall of buff limestone: a long front with a tetrastyle Ionic
 * portico and pediment in the middle, pilastered wings with an entablature
 * and a plain attic, and a curved bay closing the north end, all on a raised
 * terrace with a balustrade and broad steps. Behind it the Virginia
 * Historical Society's later wings (1959 onward; 1992, 1998, 2006 and 2016
 * additions) wrap it in plain grey ashlar: a taller block at the south end,
 * a west block with a pyramid skylight, a north wing and lower links.
 *
 * Covers and replaces: way/598522099 (the one outline; OSM has no parts).
 *
 * Evidence
 * - OSM (measured): the outline, read in the bearing-24 frame. Front wall
 *   x = 33.4 from y -23 to 24.7; portico bump to x 35.2, y -5.2..5.2; the
 *   north curved bay about (30.9, 30.4), r 5.1 (its drum drawn 1.6 m over
 *   the attic, as photo 2 shows it, though the 1 m lidar grid barely catches it); south tall block
 *   y -36..-23; south-east block x 31.9..50.2; the curved south addition
 *   y -46..-36; west parts to x -47.
 * - USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014), 1 m grid,
 *   read every 4 m in this frame (measured; model z = lidar - 0.4, the
 *   north-west lawn being the lowest ground): front terrace 2.8; Battle
 *   Abbey roof 15.4; portico pediment about 16.1; south block 20.6; south-east
 *   block 16.1; west block 15.4, its pyramid skylight to 19.1; north wing
 *   15.1; two roof monitors 19.4 and 20.0; low links 4.5 and 6.3. The curved
 *   south addition returns almost nothing in 2014 (under construction for the
 *   2016 addition): drawn at 15.2, matching the lidar on its east end.
 *   Terrain (Mapterhorn): flat within 1.5 m over the site.
 * - Photos (Wikimedia Commons, EVIDENCE; each at
 *   https://commons.wikimedia.org/wiki/File:<name with underscores>):
 *   "Virginia Museum of History & Culture (VMHC) Building - 2021.jpg" (VMHC,
 *   CC BY-SA 4.0), the front square on: four Ionic columns under a pediment,
 *   the wings' pilasters, blank panels and entablature, a window each side of
 *   the portico, the terrace, balustrade and steps, the curved north bay;
 *   column height 9.4 m, cornice 10 m over the terrace, scaled to the 10.4 m
 *   portico; "Virginia Museum of History & Culture (VMHC) Building with Sign
 *   - 2021.jpg" (VMHC, CC BY-SA 4.0), from the south-east: the tall plain grey
 *   south block with a column of windows, the curved bay rising as a drum;
 *   "Virginia Historical Society in Richmond, Virginia.jpg" (Yo scottie oh,
 *   CC BY-SA 4.0), from the north-east along the Boulevard.
 * - USGS NAIP (public domain): the plan, pale roofs, the pyramid skylight.
 * - Colours from the photos: warm buff limestone on Battle Abbey, cooler grey
 *   ashlar on the later wings, both pulled to the palette's lightness.
 * - Estimated: the portico's depth (4.4 m, past OSM's 1.9 m bump, from the
 *   photo's shadows); the wings' bay rhythm (five bays each side); window
 *   positions on the rear and sides, which no photo here shows (doubt); the
 *   curved south addition's facade (not photographed here; plain grey with a
 *   glazed band, doubt).
 * - Simplified: Ionic capitals are plain round caps; no balusters (the
 *   balustrade is a low solid wall); no inscription, banners or lamp posts.
 * - Night: the Boulevard front is floodlit softly; the rest unlit.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, panel, rect, block, qf, tf, cylinder, type Side } from './dc-white-house'
import { saveModel, pslab, roundColumn, pcap, lathe, type XY, type Mat } from './dc-nga-west'

const abbey = new Part(), ashlar = new Part(), roof = new Part(), win = new Part(), glass = new Part()

// ---- Heights (lidar, model z)
const TER = 2.8 // front terrace
const FRONT = 15.4, CORN = TER + 10, ENT = TER + 9.0
const LOW = 4.6

// ===========================================================================
// The low links west of Battle Abbey (the rest of the outline is covered by blocks).
pslab(ashlar, lowBase(), 0, LOW, 0.3, roof)
function lowBase(): XY[] {
  // west and south-west parts only (x < -6): the rest is covered by blocks
  return [[-36.37, -36.23], [-6.2, -36.2], [-6.2, 27.6], [-9.10, 28.88], [-12.10, 29.63], [-15.20, 29.72], [-18.33, 29.14], [-21.26, 27.91], [-23.86, 26.08], [-23.85, 23.96], [-35.78, 23.90], [-35.78, 27.04], [-45.76, 26.99], [-45.76, 24.14], [-47.04, 24.14], [-47.04, -23.83], [-36.37, -23.77]]
}
// the courtyard roofs a little higher (6.3) north and south of the west block
cbox(ashlar, rect(-20, -6.2, 12, 26), LOW, 6.3, { b: 0.2, top: roof })
cbox(ashlar, rect(-20, -6.2, -34, -12), LOW, 6.3, { b: 0.2, top: roof })

// ---- West block with its pyramid skylight
const west: XY[] = [[-38, -16], [-20, -16], [-20, -10], [-6.2, -10], [-6.2, 10], [-20, 10], [-20, 16], [-38, 16], [-38, 8], [-43, 8], [-43, -8], [-38, -8]]
pslab(ashlar, west, 0, FRONT, 0.3, roof)
{
  const cx = -30, cy = 0, h = 4.6, top = 19.1
  cbox(ashlar, rect(cx - h - 0.6, cx + h + 0.6, cy - h - 0.6, cy + h + 0.6), FRONT, FRONT + 0.8, { b: 0.2, top: roof })
  const z0 = FRONT + 0.8
  const c: V3[] = [[cx - h, cy - h, z0], [cx + h, cy - h, z0], [cx + h, cy + h, z0], [cx - h, cy + h, z0]]
  const apex: V3 = [cx, cy, top]
  for (let k = 0; k < 4; k++) {
    const a = c[k], b = c[(k + 1) % 4]
    tf(glass, a, b, apex, [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 2])
  }
}

// ---- North wing (plain grey ashlar) and its roof monitor
const north: XY[] = [[-6.2, 24.7], [31.81, 24.7], [31.81, 47.92], [30.90, 47.92], [30.90, 51.04], [-10.04, 50.83], [-10.03, 48.84], [-11.92, 48.83], [-11.91, 38.29], [-6.2, 38.33]]
pslab(ashlar, north, 0, 15.1, 0.3, roof)
cbox(ashlar, rect(2, 18, 25.5, 38), 15.1, 19.4, { b: 0.2, top: roof })
// a band of tall windows on the north end, a few on the west
for (const c of [-2, 6, 14, 22]) panel(win, 'n', 50.95, c - 1.4, c + 1.4, 3, 11, 0.05)
for (const c of [42, 46]) panel(win, 'w', -11.92, c - 1.2, c + 1.2, 3, 11, 0.05)

// ---- South block: the tall plain grey block behind the front, and the
// south-east block, the curved 2016 addition in front of them
cbox(ashlar, rect(-6.2, 31.94, -36, -23.07), 0, 20.6, { b: 0.35, top: roof })
cbox(ashlar, rect(31.94, 50.18, -35.78, -25.4), 0, 16.1, { b: 0.3, top: roof })
// the column of windows at the south block's east corner (photo 2)
panel(win, 'e', 31.94, -24.5 - 2.2, -24.5 + 0.0, 4, 18.5, 0.05)
for (const c of [36, 44]) panel(win, 'n', -25.4, c - 1.6, c + 1.6, 4, 12.5, 0.05)
panel(win, 'e', 50.18, -33.5, -27.5, 4, 12.5, 0.05)
// curved addition: from the outline's south arc
const southArc: XY[] = [[-3.27, -36], [46.49, -36], [46.49, -38.94], [42.85, -41.21], [38.99, -43.08], [34.96, -44.54], [30.25, -45.67], [25.45, -46.24], [20.62, -46.25], [16.27, -44.77], [11.91, -44.18], [7.63, -43.15], [3.84, -41.81], [0.20, -40.11], [-3.27, -38.07]]
pslab(ashlar, southArc, 0, 15.2, 0.3, roof)
// a glazed band low along its curved face
{
  const arc = southArc.slice(3)
  for (let k = 0; k < arc.length - 1; k++) {
    const a = arc[k], b = arc[k + 1]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    if (l < 2) continue
    const nx = -dy / l, ny = dx / l // outward for this (clockwise round the south) run
    const P = (t: number, z: number): V3 => [a[0] + dx * t + nx * 0.05, a[1] + dy * t + ny * 0.05, z]
    qf(win, P(0.08, 1.2), P(0.92, 1.2), P(0.92, 5.2), P(0.08, 5.2), [nx, ny, 0])
  }
}
// the monitor over the middle
cbox(ashlar, rect(14, 22, -18.5, -8.5), FRONT, 20.0, { b: 0.2, top: roof })

// ===========================================================================
// Battle Abbey: the front block
const FX = 33.38, FY0 = -23.07, FY1 = 24.71
cbox(abbey, rect(-6.2, FX, FY0, FY1), 0, ENT, { top: false })
// entablature: a projecting band, then the attic set back slightly
cbox(abbey, rect(-6.2, FX + 0.45, FY0 - 0.45, FY1), ENT, CORN, { bottom: true, top: false })
cbox(abbey, rect(-6.2, FX + 0.7, FY0 - 0.7, FY1), CORN, CORN + 0.4, { b: 0.25, bottom: true, top: false })
cbox(abbey, rect(-6.2, FX, FY0, FY1), CORN + 0.4, FRONT, { b: 0.25, top: roof })
// pilasters on the wings, five bays each side; a window by the portico
const PY = 5.2
for (const [a, b] of [[FY0, -PY], [PY, FY1]] as [number, number][]) {
  const n = 5, w = (b - a) / n
  for (let k = 0; k <= n; k++) {
    const y = a + k * w
    const y0 = Math.max(a, y - 0.55), y1 = Math.min(b, y + 0.55)
    block(abbey, 'e', FX, y0, y1, TER + 0.9, ENT, 0.3, false, true)
  }
  // sunk panels between the pilasters: blank stone, a little shaded
  for (let k = 0; k < n; k++) {
    const c = a + (k + 0.5) * w
    const nearPortico = (a < 0 && k === n - 1) || (a > 0 && k === 0)
    if (nearPortico) panel(win, 'e', FX, c - 0.9, c + 0.9, TER + 2.2, TER + 6.4, 0.05)
  }
}
// plinth course along the terrace
cbox(abbey, rect(FX - 0.5, FX + 0.25, FY0, FY1), TER, TER + 0.9, { b: 0.1, top: false })

// ---- the portico: four Ionic columns, entablature and pediment
const PX1 = FX + 4.4
cbox(abbey, rect(FX, PX1 + 0.3, -PY - 0.3, PY + 0.3), TER, TER + 0.6, { b: 0.1, top: roof })
for (const y of [-3.9, -1.3, 1.3, 3.9]) roundColumn(abbey, PX1 - 0.9, y, 0.56, TER + 0.6, ENT, 12, 0.7)
cbox(abbey, rect(FX, PX1, -PY, PY), ENT, CORN, { bottom: true, top: false })
cbox(abbey, rect(FX, PX1 + 0.25, -PY - 0.25, PY + 0.25), CORN, CORN + 0.4, { b: 0.2, bottom: true, top: false })
{
  // pediment: a low gable facing east, ridge along x
  const z0 = CORN + 0.4, z1 = 16.1, x0 = FX - 0.5, x1 = PX1 + 0.25, y0 = -PY - 0.25, y1 = PY + 0.25
  tf(abbey, [x1, y0, z0], [x1, y1, z0], [x1, 0, z1], [1, 0, 0])
  qf(roof, [x0, y0, z0], [x1, y0, z0], [x1, 0, z1], [x0, 0, z1], [0, -(z1 - z0), PY])
  qf(roof, [x0, y1, z0], [x1, y1, z0], [x1, 0, z1], [x0, 0, z1], [0, z1 - z0, PY])
  // raking cornice: a lip under the slope ends
  block(abbey, 'e', x1, y0, y1, z0 - 0.01, z0 + 0.01, 0.01, false, false)
}
// the door and its window in the portico's back wall
panel(win, 'e', FX, -1.5, 1.5, TER + 0.6, TER + 6.0, 0.05)
panel(win, 'e', FX, -1.5, 1.5, TER + 6.6, TER + 8.2, 0.05)

// ---- the curved bay at the north end, rising a little as a drum
{
  const cx = 30.9, cy = 30.4, r = 5.1
  lathe(abbey, cx, cy, [[r, 0], [r, ENT], [r + 0.45, ENT], [r + 0.45, CORN + 0.4], [r, CORN + 0.4], [r, FRONT + 1.6], [r - 0.3, FRONT + 1.9]], 20, false)
  pcap(roof, Array.from({ length: 20 }, (_, k) => [cx + (r - 0.3) * Math.cos((k * 2 * Math.PI) / 20), cy + (r - 0.3) * Math.sin((k * 2 * Math.PI) / 20)] as XY), FRONT + 1.9)
}

// ---- the terrace, its solid balustrade and the steps
const TX = 49
cbox(abbey, rect(FX - 0.2, TX, -22, 30), 0, TER, { b: 0.1 })
for (const [a, b] of [[-22, -8], [8, 30]] as [number, number][]) cbox(abbey, rect(TX - 0.5, TX, a, b), TER, TER + 1.0, { b: 0.1 })
cbox(abbey, rect(FX + 1, TX, -22.5, -22), TER, TER + 1.0, { b: 0.1 })
for (let k = 0; k < 4; k++) cbox(abbey, rect(TX, TX + 1.2 * (4 - k), -8, 8), 0, TER * ((k + 1) / 5))

// ===========================================================================
// Floodlight: the Boulevard front softly lit, the portico brightest.
const lit = (p: V3, n: V3): number => {
  if (n[2] > 0.7) return 0.05
  if (p[0] > FX - 1 && p[2] > TER && n[0] > 0.3) return Math.abs(p[1]) < 7 ? 0.9 : 0.55
  return 0
}
const lit_ = (m: MaterialSpec): Mat => m

if (import.meta.main) {
  await saveModel('ric-vmhc', 'Virginia Museum of History & Culture', [
    { part: abbey, material: lit_({ ...finish('battle-abbey-limestone', 0xeadfcb), floodlight: lit }) },
    { part: ashlar, material: finish('vmhc-grey-ashlar', 0xdcd8d0) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
  ], { source: 'generators/ric-vmhc.ts', bearing: 24, osm: 'way/598522099', height: 20.6 }, 5000)
}
