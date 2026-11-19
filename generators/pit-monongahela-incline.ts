/**
 * Monongahela Incline (1870, engineer John Endres; the oldest operating
 * funicular in the United States; lower station 1904, MacClure & Spahr) —
 * procedural, CC0-1.0, no textures. bun generators/pit-monongahela-incline.ts
 *
 * A funicular straight up the face of Mount Washington from Carson Street:
 * a double track on a dark steel deck, low posts over the upper slope, a
 * span over McArdle Roadway, a short run in a cut, and a tall trestle with
 * A-braced bents over the lower hillside, the wall and the T line; two
 * stepped cars (salmon-red below, pale yellow above with a broad window
 * band); the upper station on Grandview Avenue (yellow clapboard, red trim,
 * a gable along the track over the street front, a lower gabled front block
 * over the track opening with a bay window either side, a low west wing);
 * the lower station on Carson Street (painted red brick, two storeys, a
 * hipped silver roof with the teal, red and dark cupola, the orange canopy
 * over three teal doors, the teal string course, the hooded track entry at
 * the back).
 *
 * Imports the incline helpers from pit-duquesne-incline.ts (unchanged; its
 * build runs only as the main module), so that generator merges first.
 *
 * Frame: x across the track (+x south-east), y along it, downhill toward the
 * lower station (north-east), z up, metres. Bearing 34.84°: the deck's line
 * in lidar (OSM's two track ways drift 1–2 m across over the length; the
 * lidar deck is straight). Anchor -80.0053937, 40.431914: the track's
 * midpoint, on the deck's centreline (the incline has no single outline).
 *
 * Height. As pit-duquesne-incline: every foot (bents, posts, station walls)
 * runs down to Mapterhorn's ground under it (`GROUND`, metres above
 * 223.16 m, which the lidar's ground_min 223.11 m matches within 0.05 m),
 * and the model is dropped so its lowest vertex, the lower station's front
 * on Carson Street, is at y = 0. Elevation 0. The terrain rises 112 m from
 * Carson Street (0.5) to Grandview Avenue (113.0). `terrain.ts check`: ok,
 * follows the DEM.
 *
 * Sources:
 * - OSM: track ways way/54834760, way/833629684 (bridge, y −38..−15, over
 *   McArdle Roadway), way/833629685, way/833629689 (the cut, y −15..+14),
 *   way/833629686, way/833629688 (bridge, y +14..+69), way/833629687,
 *   way/833629690 (into the stations); stations way/43081628 (Monongahela
 *   Upper Station) and way/43081627 (Monongahela Lower Station); route
 *   relation/6060404; wikidata Q6901799; NRHP 74001742.
 * - Lidar, USGS 3DEP PA_WesternPA_2_2019 (flown 2019), 1 m grid, read in
 *   this frame: the rail top is a straight line, 56.1 m at y = 0 falling
 *   0.713 m per metre (35.5°), within 0.5 m from y = −68 to +66 (`T`); the
 *   deck 6 m wide (x −3..+3) its whole length; ground under it 3–4.5 m down
 *   on the upper slope, 6–12 m over McArdle Roadway (67 m), 1.5–3 m in the
 *   cut, 8–20 m over the lower hillside, the wall at y ≈ 30, the T line
 *   (12.9) and the lot (5.2). Both cars, 4–5 m over the rail, at y ≈ −26
 *   (west track) and +32 (east track): drawn there. Upper station: the main
 *   block x −7.5..+7.5, y −87..−77.5, ridge 120.0 along x = 0, eaves about
 *   117.5; a lower front block to y −71.5, ridge 118.2; bay roofs 115.1 at
 *   x ≈ ±5.5; the west wing x −13..−7.5, y −86..−78, top 117.2; the street
 *   113.0. Lower station: x −9..+6.8, y 72..86.2 (OSM's outline is 1 m
 *   narrower on the east and 1.3 m further south; lidar followed), the roof
 *   12.0 at x ≈ −1, eaves 7.5–8, the cupola 15.9, a chimney 11.9 at
 *   (−5.5, 81.5); the hooded track entry x −4..+3.5, y 64..72, 11.0;
 *   Carson Street 0.4–0.6.
 * - NAIP (USDA, public domain), 0.1 m: the step across the upper station's
 *   roof at y ≈ −77.5; the lower station's footprint against the track end,
 *   the lot on its east side, Carson Street along its north front.
 * - Published (Wikipedia "Monongahela Incline"; NRHP nomination): opened
 *   1870, length 635 ft (194 m), rise 369 ft (112.6 m), grade 35°35′, 5 ft
 *   gauge, two cars. The modelled track runs 183 m on the slope and rises
 *   106 m between the stations' platforms.
 * - Photos (Wikimedia Commons):
 *   - m1 "Lower station, Monongahela Incline, 2024-12-15", m2 "… 2024-12-15-1",
 *     m3 "… 2024-12-15-3", m6 "Cupola of the lower station, Monongahela
 *     Incline, 2024-12-15", m4 "Monongahela Incline upper station, Mount
 *     Washington, 2025-02-24-1", m5 "… 2025-02-24-2", m7 "Monongahela
 *     Incline, upper station, 2021-05-11, 01", m11 "Monongahela Incline car
 *     arriving at upper station, 2024-12-15", m12 "Monongahela Incline car,
 *     2024-12-15" (all Cbaile19, CC0): the lower station's front (m3, head
 *     on), east side and sign (m1, m2), cupola (m6); the upper station's
 *     street gable, sign and long side (m4, m5), the downhill face, track
 *     opening, bays and stone base (m7, m11); the cars (m11, m12) and the
 *     deck, its pale edge rails and lamps (m6, m12);
 *   - m23 "Monongahela Incline.jpg" (Suckindiesel at English Wikipedia,
 *     CC BY-SA 3.0): the lower station's east side with the trestle behind,
 *     its A-braced bent and deep side girders;
 *   - m8 "Looking up the Monongahela Incline.jpg" (Bestbudbrian,
 *     CC BY-SA 4.0): the line straight up from the lower station;
 *   - m15 "Lower station of Monongahela Incline.JPG" (An Errant Knight,
 *     CC BY-SA 4.0): the hooded track entry at the back of the lower station;
 *   - m20 "Mon Incline (3021295853)", m21 "Mon Incline (3022128312)" (Doug
 *     Kerr, CC BY-SA 2.0): night views (lit windows, the floodlit sign wall).
 *
 * Estimated: the bents' places (y 21, 34, 47, 58 below; −35, −18 at McArdle
 * Roadway; posts every 7 m above) and sizes, from m23 and the lidar's
 * clearances; the deck's depth (1.3 m, 2.6 m on the lower trestle); the
 * cars (6.6 m long, 2.7 m wide, three level tiers, from m6, m12 against the
 * 5 ft gauge); windows, doors, canopy and cupola stages (from m3, m6, m23
 * against the lidar's heights); the bays (3.1 m wide, from m11).
 * Doubts: the upper station's east side over the falling ground and the
 * lower station's west side and back are seen only obliquely; the bents'
 * exact positions are not fixed by lidar; the track lamps along both deck
 * edges (red, green and white at night, m6, m12) are left out: the model
 * already uses six materials, so there is no slot for a `lamp` material.
 * Colour: brick and car red #bb5c4b (the brick reads #c0584a in m2, the cars'
 * salmon is lighter; they share one finish); station yellow #e4d17e (the
 * clapboard and the cars' upper half); teal #6fa59b (doors, string course,
 * cupola base, window frames on the brick); roofs the palette's roof grey
 * (both stations have silver standing-seam roofs since 2024); the deck and
 * the cupola's lantern charcoal #4f5257; windows the palette's slate (both
 * stations and the cars are lit after dark). The track opening is dark.
 *
 * No commercial imagery was used for this model.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { face, groundAt, stations, type GroundGrid } from './bridge-kit'
import { PALETTE, finish } from './palette'
import {
  type Ground, tri, box, footedBox, wallShape, rectPts, archPts, walls, gableRoof, hipRoof, trackDeck, bent, settle,
} from './pit-duquesne-incline'

/** Mapterhorn z15 under the site, 4 m grid in this frame, metres above 223.16 m. */
const GROUND: GroundGrid = {"y0":-100.0,"x0":-24.0,"step":4.0,"z":[[114.2,114.1,113.9,113.7,113.8,113.6,113.4,113.0,112.5,112.4,112.3,111.9,107.0],[114.0,113.8,113.6,113.4,113.2,113.1,112.9,112.7,112.6,112.5,112.4,112.2,107.2],[114.0,113.8,113.6,113.4,113.2,113.1,112.9,112.7,112.6,112.5,112.5,111.9,106.9],[113.9,113.7,113.5,113.3,113.2,113.0,112.9,112.7,112.7,112.6,112.6,111.6,106.8],[112.3,112.4,112.2,112.3,112.0,111.4,111.1,110.9,110.5,110.0,109.4,107.6,106.3],[108.7,109.0,109.3,109.2,109.1,108.6,108.3,107.9,107.4,107.2,106.9,106.3,105.0],[105.7,106.2,106.5,106.7,106.2,105.7,105.2,104.9,106.4,106.4,106.3,105.8,103.3],[102.5,102.8,103.3,103.6,103.2,102.5,102.0,102.4,103.6,103.9,104.0,103.5,102.1],[99.4,99.6,100.0,100.1,100.1,99.7,99.3,99.9,100.9,101.2,101.2,100.6,99.3],[96.5,96.9,97.0,97.5,97.9,97.2,95.8,97.0,98.2,98.4,98.5,97.4,96.7],[94.9,95.2,95.4,95.6,95.9,95.2,94.4,94.9,95.4,95.8,95.7,95.5,94.9],[92.0,92.5,92.6,93.1,93.1,92.5,92.1,92.4,92.7,92.7,92.7,92.6,91.8],[88.9,88.9,89.2,89.5,89.8,89.3,88.9,89.5,89.9,89.8,89.7,88.9,88.5],[86.9,86.8,86.7,86.7,86.8,86.4,86.2,86.7,87.3,87.4,87.2,86.3,85.9],[85.0,84.7,84.2,83.2,84.2,84.9,84.9,85.0,84.7,84.5,84.6,84.3,83.5],[79.9,78.7,77.1,76.5,79.8,83.0,83.3,82.8,81.8,81.6,81.8,81.4,80.8],[72.3,71.4,70.8,70.5,73.6,78.2,78.2,77.8,77.6,76.5,77.5,77.7,75.8],[68.8,68.4,68.1,67.8,67.5,68.4,68.1,67.9,68.0,67.8,69.6,69.7,69.0],[68.2,68.0,67.7,67.4,67.2,66.9,66.6,66.4,66.1,65.9,65.6,65.3,65.1],[68.4,68.1,67.9,67.6,67.3,67.0,66.8,66.5,66.2,66.0,65.7,65.3,65.1],[68.5,68.3,68.0,67.8,67.6,67.4,67.3,66.9,66.4,66.1,66.0,65.7,65.2],[67.5,67.8,67.8,67.8,67.6,66.7,66.3,65.9,64.7,64.5,64.6,65.1,64.8],[64.5,65.1,65.8,66.6,66.6,64.7,63.7,63.4,61.7,61.5,61.6,62.5,62.3],[60.2,61.2,62.2,63.1,63.3,61.6,60.5,60.1,58.8,58.5,58.5,58.5,58.4],[57.7,58.4,59.2,59.8,59.8,58.2,57.3,56.8,55.9,55.7,55.8,55.7,55.9],[55.9,56.4,56.7,56.8,56.9,55.5,54.4,54.1,53.0,52.7,52.8,53.4,53.8],[53.1,53.4,53.5,53.4,53.6,52.6,51.5,51.4,50.2,49.8,49.8,51.1,52.6],[48.6,48.6,47.9,47.9,49.3,49.5,47.5,46.1,45.4,45.5,45.5,47.8,50.9],[40.2,40.2,40.5,40.3,41.9,40.6,40.3,40.0,40.7,41.5,41.6,42.5,45.8],[31.8,32.6,34.0,34.6,34.8,35.4,36.5,36.7,37.0,37.2,37.5,37.9,38.6],[26.6,27.3,29.3,29.4,29.8,30.8,32.7,33.4,33.1,33.1,33.2,33.9,33.9],[21.4,21.8,23.0,23.6,24.5,25.8,28.5,29.4,29.2,29.0,29.2,29.6,29.6],[15.8,16.1,16.7,17.1,18.4,19.9,21.3,22.8,23.8,24.1,24.5,24.7,24.8],[12.8,12.9,12.9,13.1,13.2,13.5,13.9,14.7,15.9,16.8,17.4,17.3,17.3],[12.7,12.7,12.8,12.8,12.8,12.8,12.9,13.0,13.0,13.0,13.0,13.0,13.1],[12.3,12.4,12.5,12.6,12.6,12.6,12.7,12.8,12.8,12.8,12.8,12.9,12.9],[11.5,11.5,11.6,11.6,11.6,11.7,11.9,12.0,12.0,12.1,12.2,12.3,12.4],[10.2,10.3,10.4,10.5,10.5,10.6,10.7,10.7,10.8,10.9,11.0,11.2,11.3],[8.4,8.5,8.6,8.6,7.8,7.8,8.5,8.7,9.1,9.4,9.7,10.0,10.4],[6.6,6.7,6.8,6.7,6.3,5.6,5.6,5.5,5.9,6.1,6.3,6.7,7.9],[5.4,5.6,5.5,5.5,5.5,5.3,5.3,5.2,5.1,5.1,5.0,5.1,5.1],[4.5,4.7,4.8,4.8,4.8,5.0,5.2,4.5,4.2,4.1,4.2,4.4,4.5],[3.5,4.0,4.1,3.8,3.3,3.1,3.4,2.1,1.7,1.7,1.7,3.1,3.6],[2.5,3.1,3.1,2.4,1.9,1.2,0.5,0.9,1.3,1.2,1.3,2.4,2.8],[1.5,1.9,2.1,1.7,1.0,0.6,0.6,0.8,1.0,1.0,1.1,2.1,2.0],[0.6,0.9,1.1,1.0,0.8,0.6,0.8,0.9,0.9,0.9,0.9,1.6,1.4],[0.2,0.3,0.5,0.5,0.6,0.7,0.7,0.8,0.8,0.8,0.8,0.9,0.9],[0.1,0.2,0.3,0.3,0.4,0.4,0.5,0.5,0.5,0.6,0.6,0.7,0.7],[0.2,0.2,0.3,0.3,0.4,0.5,0.5,0.5,0.6,0.7,0.7,0.7,0.8],[0.2,0.2,0.3,0.3,0.3,0.4,0.5,0.5,0.5,0.6,0.6,0.7,0.7],[0.1,0.2,0.3,0.3,0.4,0.4,0.5,0.6,0.6,0.7,0.8,0.8,0.8]]}
const ground: Ground = (x, y) => groundAt(GROUND, x, y)

const BEARING = 34.84
/** Rail top (lidar): a straight 35.5° line, 56.1 m at the track's midpoint, falling 0.713 m per metre downhill. */
const T = (y: number) => 56.1 - 0.713 * y
const XC = 0, W = 6.0                          // deck centre and width (lidar, x −3..+3)
const TRACK_X = [-1.5, 1.5]                    // the two tracks (OSM ways; lidar cars)
const Y_TOP = -76, Y_BOT = 73                  // the track's ends, inside the stations

const MATS = {
  steel: finish('steel-charcoal', 0x4f5257),
  red: finish('incline-brick', 0xbb5c4b),
  yellow: finish('station-yellow', 0xe4d17e),
  teal: finish('trim-teal', 0x6fa59b),
  roof: PALETTE.roof,
  window: PALETTE.window,
} satisfies Record<string, MaterialSpec>

/** An upright n-gon prism (radius to the corners) from z0 to z1, optionally capped. */
function prism(p: Part, cx: number, cy: number, r: number, n: number, z0: number, z1: number, cap = true, rot = Math.PI / n) {
  for (let k = 0; k < n; k++) {
    const a = rot + (2 * Math.PI * k) / n, b = rot + (2 * Math.PI * (k + 1)) / n, m = (a + b) / 2
    face(p, [cx + r * Math.cos(a), cy + r * Math.sin(a), z0], [cx + r * Math.cos(b), cy + r * Math.sin(b), z0],
      [cx + r * Math.cos(b), cy + r * Math.sin(b), z1], [cx + r * Math.cos(a), cy + r * Math.sin(a), z1], [Math.cos(m), Math.sin(m), 0])
    if (cap) tri(p, [cx, cy, z1], [cx + r * Math.cos(a), cy + r * Math.sin(a), z1], [cx + r * Math.cos(b), cy + r * Math.sin(b), z1], [0, 0, 1])
  }
}

/** A frustum (n sides) from radius r0 at z0 to r1 at z1, with an underside when it flares out. */
function frustum(p: Part, cx: number, cy: number, r0: number, r1: number, n: number, z0: number, z1: number, rot = Math.PI / n) {
  for (let k = 0; k < n; k++) {
    const a = rot + (2 * Math.PI * k) / n, b = rot + (2 * Math.PI * (k + 1)) / n, m = (a + b) / 2
    const nz = (r0 - r1) / (z1 - z0)
    face(p, [cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), z0], [cx + r0 * Math.cos(b), cy + r0 * Math.sin(b), z0],
      [cx + r1 * Math.cos(b), cy + r1 * Math.sin(b), z1], [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), z1], [Math.cos(m), Math.sin(m), nz])
  }
}

/** A dome: latitude bands from radius r at z0 up to a point at z0 + h. */
function dome(p: Part, cx: number, cy: number, r: number, h: number, n: number, z0: number, rings = 3) {
  for (let i = 0; i < rings; i++) {
    const t0 = (Math.PI / 2) * (i / rings), t1 = (Math.PI / 2) * ((i + 1) / rings)
    const r0 = r * Math.cos(t0), r1 = r * Math.cos(t1), za = z0 + h * Math.sin(t0), zb = z0 + h * Math.sin(t1)
    if (i === rings - 1) {
      for (let k = 0; k < n; k++) {
        const a = Math.PI / n + (2 * Math.PI * k) / n, b = Math.PI / n + (2 * Math.PI * (k + 1)) / n, m = (a + b) / 2
        tri(p, [cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), za], [cx + r0 * Math.cos(b), cy + r0 * Math.sin(b), za], [cx, cy, zb], [Math.cos(m), Math.sin(m), 1.2])
      }
    } else frustum(p, cx, cy, r0, r1, n, za, zb)
  }
}

/**
 * A Monongahela car (m6, m12): three compartments stepping down the hill,
 * each level, salmon-red below and pale yellow above with a broad window
 * band, a grey roof over each tier, on a dark wedge underframe.
 */
function car(parts: { body: Part; upper: Part; frame: Part; win: Part; top: Part }, xc: number, yc: number, { L = 6.6, Wd = 2.7, tiers = 3, clear = 0.5, H = 2.7 } = {}) {
  const { body, upper, frame, win, top } = parts
  const x0 = xc - Wd / 2, x1 = xc + Wd / 2, ya = yc - L / 2, dl = L / tiers
  const floorOf = (k: number) => Math.max(T(ya + k * dl), T(ya + (k + 1) * dl)) + clear
  const split = 1.25
  for (let k = 0; k < tiers; k++) {
    const y0 = ya + k * dl, y1 = y0 + dl, f = floorOf(k), r = f + H
    box(body, x0, x1, y0, y1, f, f + split, { top: false })
    box(upper, x0, x1, y0, y1, f + split, r, { top: false })
    box(top, x0 - 0.12, x1 + 0.12, y0 - 0.06, y1 + 0.06, r, r + 0.3, { top: true, bottom: true })
    for (const [x, sx] of [[x0, -1], [x1, 1]] as [number, number][]) wallShape(win, [x, y0, 0], [0, 1, 0], [sx, 0, 0], rectPts(0.25, dl - 0.25, f + split + 0.25, r - 0.3), 0.04)
    for (const [y, sy, end] of [[y0, -1, k === 0], [y1, 1, k === tiers - 1]] as [number, number, boolean][]) {
      if (end) wallShape(win, [x0, y, 0], [1, 0, 0], [0, sy, 0], rectPts(0.3, Wd - 0.3, f + split + 0.25, r - 0.3), 0.04)
    }
  }
  const rz = (y: number) => T(y) + 0.25, fx0 = x0 + 0.2, fx1 = x1 - 0.2
  for (let k = 0; k < tiers; k++) {
    const y0 = ya + k * dl, y1 = y0 + dl, f = floorOf(k)
    for (const [x, sx] of [[fx0, -1], [fx1, 1]] as [number, number][]) face(frame, [x, y0, rz(y0)], [x, y1, rz(y1)], [x, y1, f], [x, y0, f], [sx, 0, 0])
    face(frame, [fx0, y0, rz(y0)], [fx1, y0, rz(y0)], [fx1, y1, rz(y1)], [fx0, y1, rz(y1)], [0, 0, -1])
    if (k + 1 < tiers) face(frame, [fx0, y1, floorOf(k + 1)], [fx1, y1, floorOf(k + 1)], [fx1, y1, f], [fx0, y1, f], [0, 1, 0])
  }
  const yb = ya + L
  face(frame, [fx0, yb, rz(yb)], [fx1, yb, rz(yb)], [fx1, yb, floorOf(tiers - 1)], [fx0, yb, floorOf(tiers - 1)], [0, 1, 0])
}

/** A square-section member `w` wide from a to b (its side faces only). */
function strut(p: Part, a: V3, b: V3, w: number) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(d[0], d[1], d[2])
  const t = [d[0] / L, d[1] / L, d[2] / L]
  let u = [t[1], -t[0], 0]; const ul = Math.hypot(u[0], u[1])
  u = ul < 1e-6 ? [1, 0, 0] : [u[0] / ul, u[1] / ul, 0]
  const v = [u[1] * t[2] - u[2] * t[1], u[2] * t[0] - u[0] * t[2], u[0] * t[1] - u[1] * t[0]]
  const h = w / 2, off = (su: number, sv: number, q: V3): V3 => [q[0] + h * (su * u[0] + sv * v[0]), q[1] + h * (su * u[1] + sv * v[1]), q[2] + h * (su * u[2] + sv * v[2])]
  const sides: [number, number, number, number][] = [[1, 1, 1, -1], [1, -1, -1, -1], [-1, -1, -1, 1], [-1, 1, 1, 1]]
  for (const [a1, b1, a2, b2] of sides) {
    const n: V3 = [(a1 + a2) * u[0] + (b1 + b2) * v[0], (a1 + a2) * u[1] + (b1 + b2) * v[1], (a1 + a2) * u[2] + (b1 + b2) * v[2]]
    face(p, off(a1, b1, a), off(a2, b2, a), off(a2, b2, b), off(a1, b1, b), n)
  }
}

/**
 * An A-bent of the lower trestle (m23): on each side of the deck, two legs
 * splayed along the track from feet `spread` m apart up to the deck's
 * underside at y, a cross-tie between the feet's tops and an X of bracing.
 */
function aBent(p: Part, y: number, zTop: number, xs: number[], spread: number, c = 0.7) {
  for (const x of xs) {
    const g0 = ground(x, y - spread / 2), g1 = ground(x, y + spread / 2)
    const top: V3 = [x, y, zTop], f0: V3 = [x, y - spread / 2, g0 - 0.3], f1: V3 = [x, y + spread / 2, g1 - 0.3]
    strut(p, f0, top, c)
    strut(p, f1, top, c)
    const zm = Math.min(g0, g1) + (zTop - Math.min(g0, g1)) * 0.45, k = 0.45
    strut(p, [x, y - (spread / 2) * (1 - k), zm], [x, y + (spread / 2) * (1 - k), zm], c * 0.7)
  }
  // Ties across the deck under it and at mid height.
  box(p, xs[0] - c / 2, xs[1] + c / 2, y - c / 2, y + c / 2, zTop - 0.7, zTop, { top: false, bottom: true })
}

/** A punched window with a frame of `fr` around it, on wall `w` at s (centre), z0..z1. */
function framed(frame: Part, win: Part, w: { o: V3; u: V3; n: V3 }, s: number, hw: number, z0: number, z1: number, fr = 0.15) {
  wallShape(frame, w.o, w.u, w.n, rectPts(s - hw - fr, s + hw + fr, z0 - fr, z1 + fr), 0.03)
  wallShape(win, w.o, w.u, w.n, rectPts(s - hw, s + hw, z0, z1), 0.05)
}

async function build() {
  const steel = new Part(), red = new Part(), yellow = new Part(), teal = new Part(), roof = new Part(), win = new Part()

  // ---- Track deck and trestles --------------------------------------------------------------------
  const railX = TRACK_X.flatMap((x) => [x - 0.76, x + 0.76])     // 5 ft gauge
  // Deck depth: 1.3 m on the upper slope, down to the ground through the cut (y −15..+13, OSM
  // not a bridge), 2.6 m deep side girders on the lower trestle (m23).
  const depth = (y: number) => {
    if (y > -15 && y < 13) return Math.max(1.3, Math.min(3.5, T(y) - ground(XC, y)))
    return y >= 13 ? 2.6 : 1.3
  }
  trackDeck(steel, roof, railX, { T, y0: Y_TOP, y1: Y_BOT, xc: XC, w: W }, depth, 4)
  // Lower trestle (OSM bridge y +14..+69): braced bents over the hillside, the wall and the T line (m23).
  for (const y of [21, 58]) bent(steel, ground, [XC - W / 2 + 0.5, XC + W / 2 - 0.5], y, T(y) - 2.6, 0.8, 6)
  for (const y of [34, 47]) aBent(steel, y, T(y) - 2.6, [XC - W / 2 + 0.45, XC + W / 2 - 0.45], 9)
  // The pale galvanised edge rails along both sides of the deck, where the track lights hang (m6, m12).
  for (const ys of [stations(Y_TOP, Y_BOT, 4)]) for (let i = 0; i + 1 < ys.length; i++) {
    const ya = ys[i], yb = ys[i + 1], sl = (T(yb) - T(ya)) / (yb - ya)
    for (const xa of [XC - W / 2 - 0.02, XC + W / 2 - 0.33]) face(roof, [xa, ya, T(ya) + 0.72], [xa + 0.35, ya, T(ya) + 0.72], [xa + 0.35, yb, T(yb) + 0.72], [xa, yb, T(yb) + 0.72], [0, -sl, 1])
  }
  // Over McArdle Roadway (OSM bridge y −38..−15): a bent at each side of the road.
  for (const y of [-35, -18]) bent(steel, ground, [XC - W / 2 + 0.5, XC + W / 2 - 0.5], y, T(y) - 1.3, 0.7, 6)
  // Short posts up the upper slope.
  for (const y of stations(Y_TOP + 8, -42, 7)) {
    const zt = T(y) - 1.3
    if (zt - Math.min(ground(XC - 2.5, y), ground(XC + 2.5, y)) < 0.6) continue
    for (const x of [XC - W / 2 + 0.5, XC + W / 2 - 0.5]) footedBox(steel, ground, x - 0.3, x + 0.3, y - 0.3, y + 0.3, zt, 4, false)
  }

  // ---- Cars: where the 2019 lidar caught them -------------------------------------------------------
  const carParts = { body: red, upper: yellow, frame: steel, win, top: roof }
  car(carParts, TRACK_X[0], -26)
  car(carParts, TRACK_X[1], 32)

  // ---- Upper station (lidar x −7.5..7.5, y −87..−71.5; Grandview Avenue 113.0) -----------------------
  {
    // Two blocks under gables along the track (lidar): the main one, ridge 120.0, and a lower front
    // one over the track opening, ridge 118.2, stepping down at y = −77.5 (the line across the roof
    // in NAIP).
    const x0 = -7.5, x1 = 7.5, y0 = -87.0, y1 = -71.5, ym = -77.5, eave = 117.6, ridge = 120.0, street = 113.0
    const fEave = 115.95, fRidge = 118.4
    footedBox(yellow, ground, x0, x1, y0, ym, eave, 3, false)
    gableRoof(roof, yellow, x0, x1, y0, ym, eave, ridge, 'y', 0.5)
    footedBox(yellow, ground, x0, x1, ym, y1, fEave, 3, false)
    gableRoof(roof, yellow, x0, x1, ym + 0.5, y1, fEave, fRidge, 'y', 0.5)
    // Grey block and stone base under the downhill face, either side of the deck (m7, m11).
    const base = T(y1) - 0.6
    for (const [a, b] of [[x0, XC - W / 2], [XC + W / 2, x1]] as [number, number][]) footedBox(roof, ground, a - 0.08, b, y1 - 3.0, y1 + 0.08, base, 3, false)
    const wl = walls(x0, x1, y0, y1)
    // The track opening, framed in red (m7, m11).
    wallShape(red, wl.north.o, wl.north.u, wl.north.n, rectPts(XC - x0 - 3.5, XC - x0 + 3.5, base + 0.1, 114.9), 0.03)
    wallShape(steel, wl.north.o, wl.north.u, wl.north.n, rectPts(XC - x0 - 3.0, XC - x0 + 3.0, base + 0.1, 114.4), 0.06)
    // The two bay windows flanking it, on tapered bottoms (m11).
    for (const xb of [-5.5, 5.5]) {
      const bx0 = xb - 1.55, bx1 = xb + 1.55, by0 = y1, by1 = y1 + 1.3, bz0 = 112.6, bz1 = 115.75
      box(yellow, bx0, bx1, by0, by1, bz0, bz1, { top: false })
      box(roof, bx0 - 0.15, bx1 + 0.15, by0, by1 + 0.15, bz1, bz1 + 0.3, { top: true, bottom: true })
      face(yellow, [bx0, by1, bz0], [bx1, by1, bz0], [xb + 0.5, by0, bz0 - 1.2], [xb - 0.5, by0, bz0 - 1.2], [0, 1, -1])
      tri(yellow, [bx0, by0, bz0], [bx0, by1, bz0], [xb - 0.5, by0, bz0 - 1.2], [-1, 0, -0.6])
      tri(yellow, [bx1, by0, bz0], [bx1, by1, bz0], [xb + 0.5, by0, bz0 - 1.2], [1, 0, -0.6])
      const bw = walls(bx0, bx1, by0, by1)
      framed(red, win, bw.north, 1.55, 0.8, bz0 + 0.5, bz1 - 0.4)
      framed(red, win, bw.west, 0.65, 0.35, bz0 + 0.5, bz1 - 0.4, 0.1)
      framed(red, win, bw.east, 0.65, 0.35, bz0 + 0.5, bz1 - 0.4, 0.1)
    }
    // Street (south) gable: the sign board in the gable, a door and tall windows below (m4, m5).
    wallShape(red, wl.south.o, wl.south.u, wl.south.n, rectPts(5.4, 9.6, eave + 0.3, eave + 1.5), 0.05)
    for (const s of [2.5, 4.9, 10.1, 12.5]) framed(red, win, wl.south, s, 0.5, street + 0.75, street + 3.2)
    wallShape(red, wl.south.o, wl.south.u, wl.south.n, rectPts(6.85, 8.15, street + 0.05, street + 3.0), 0.03)
    wallShape(teal, wl.south.o, wl.south.u, wl.south.n, rectPts(7.0, 8.0, street + 0.05, street + 2.85), 0.05)
    // Long sides: tall windows in pairs.
    for (const side of [wl.west, wl.east]) for (const s of [6.0, 8.0, 11.0, 13.0]) framed(red, win, side, s, 0.5, street + 0.75, street + 3.2)
    // The lower west wing, its gable to the street side (lidar x −13..−7.5, y −86..−78, top 117.2).
    const wx0 = -13.2, wx1 = x0, wy0 = -85.6, wy1 = -78.0, we = 115.7
    footedBox(yellow, ground, wx0, wx1, wy0, wy1, we, 3, false)
    gableRoof(roof, yellow, wx0, wx1, wy0, wy1, we, 117.4, 'x', 0.4)
    const ww = walls(wx0, wx1, wy0, wy1)
    for (const s of [1.6, 3.0, 4.4]) framed(red, win, ww.west, s, 0.45, street + 0.75, street + 2.6, 0.12)
    framed(red, win, ww.north, 3.0, 0.5, street + 0.75, street + 2.6, 0.12)
    // Chimney on the wing (m5).
    box(red, -11.6, -10.8, -83.0, -82.2, 115.0, 118.8, { top: true })
  }

  // ---- Lower station (lidar x −9..6.8, y 72..86; Carson Street at its north front, 0.5) --------------
  {
    const x0 = -9.0, x1 = 6.8, y0 = 72.0, y1 = 86.2, eave = 7.8, top = 12.0, st = 0.5
    footedBox(red, ground, x0, x1, y0, y1, eave, 3, false)
    // Hipped roof up to a short flat top under the cupola (lidar 12.0 at x ≈ −1).
    hipRoof(roof, x0, x1, y0, y1, eave, top, 6.3, 0.7)
    // The hooded opening at the back where the track comes in (m15; lidar x −4..3.5, y 64..72, top 11).
    const hx0 = XC - 3.6, hx1 = XC + 3.6, hy0 = 66.5, hy1 = y0 + 1.5
    box(roof, hx0 - 0.2, hx0, hy0, hy1, T(hy0) - 2.6, 9.0, { top: true })
    box(roof, hx1, hx1 + 0.2, hy0, hy1, T(hy0) - 2.6, 9.0, { top: true })
    gableRoof(roof, roof, hx0, hx1, hy0, hy1, 9.0, 11.0, 'y', 0.3)
    // Two chimneys (m2, m3, m23; lidar 11.9 at x −5.5, y 81.5).
    box(red, -6.0, -5.0, 81.0, 82.0, 9.0, 12.4, { top: true })
    box(red, 4.6, 5.6, 72.6, 73.6, 6.0, 10.4, { top: true })

    // The cupola (m2, m3, m6): teal louvred base, red fretwork drum and cornice, dark lantern, dome, spire.
    const cx = -1.1, cy = 79.1
    box(teal, cx - 1.0, cx + 1.0, cy - 1.0, cy + 1.0, top - 0.6, 13.4, { top: false })
    box(red, cx - 1.25, cx + 1.25, cy - 1.25, cy + 1.25, 13.4, 14.5, { top: true, bottom: true })
    box(red, cx - 1.4, cx + 1.4, cy - 1.4, cy + 1.4, 14.5, 14.75, { top: true, bottom: true })
    prism(steel, cx, cy, 0.85, 8, 14.75, 15.6, false)
    frustum(steel, cx, cy, 0.85, 1.25, 8, 15.6, 15.95)
    dome(steel, cx, cy, 1.15, 1.05, 8, 15.95, 3)
    prism(steel, cx, cy, 0.14, 6, 16.9, 18.6, true, 0)
    for (const wv of Object.values(walls(cx - 1.0, cx + 1.0, cy - 1.0, cy + 1.0))) wallShape(steel, wv.o, wv.u, wv.n, rectPts(0.35, 1.65, 12.0, 13.1), 0.04)
    for (const wv of Object.values(walls(cx - 1.25, cx + 1.25, cy - 1.25, cy + 1.25))) wallShape(teal, wv.o, wv.u, wv.n, rectPts(0.3, 2.2, 13.65, 14.25), 0.04)

    const w = walls(x0, x1, y0, y1)
    // Front (north, on Carson Street, m3 head on; s runs east from the west corner): three teal
    // doors with fanlights and two windows between them under the orange canopy, a small lunette over
    // each window and a large one over the middle door, the teal string course, five upper windows
    // (small ones at the ends), a teal pilaster with a ball at the north-east corner.
    const fl = w.north, L = x1 - x0
    for (const sd of [2.4, 7.9, 13.4]) wallShape(teal, fl.o, fl.u, fl.n, archPts(sd, 1.3, st + 0.05, st + 2.55, 8), 0.05)
    for (const sw of [4.9, 10.9]) framed(teal, win, fl, sw, 0.65, st + 0.9, st + 2.6, 0.12)
    box(yellow, x0 - 0.2, x1 + 0.2, y1, y1 + 1.4, st + 3.3, st + 3.6, { top: true, bottom: true })   // the canopy
    wallShape(teal, fl.o, fl.u, fl.n, rectPts(0, L, st + 4.95, st + 5.3), 0.06)                          // string course
    for (const [sl, wl2] of [[4.9, 1.5], [7.9, 2.3], [10.9, 1.5]]) wallShape(win, fl.o, fl.u, fl.n, archPts(sl, wl2, st + 3.75, st + 3.75, 8), 0.05)
    for (const su of [2.4, 4.9, 7.9, 10.9, 13.4]) framed(teal, win, fl, su, su === 2.4 || su === 13.4 ? 0.4 : 0.65, st + 5.65, st + 6.95, 0.12)
    box(teal, x1 - 0.25, x1 + 0.35, y1 - 0.25, y1 + 0.35, st + 3.6, st + 5.6, { top: true })            // pilaster
    prism(teal, x1 + 0.05, y1 + 0.05, 0.4, 8, st + 5.6, st + 6.3, true)                                    // its ball
    // East side, over the lot (m2, m23): the sign over the ground-floor windows, five upper windows,
    // the string course only near the front corner.
    const es = w.east
    for (const su of [4.4, 10.6, 12.4]) framed(teal, win, es, su, 0.45, st + 0.9, st + 2.5, 0.1)
    for (const su of [2.0, 4.6, 7.2, 9.8, 12.3]) framed(teal, win, es, su, 0.5, st + 5.65, st + 6.95, 0.12)
    wallShape(yellow, es.o, es.u, es.n, rectPts(6.0, 9.0, st + 3.0, st + 4.2), 0.06)                      // the sign
    wallShape(teal, es.o, es.u, es.n, rectPts(10.8, y1 - y0, st + 4.95, st + 5.3), 0.06)
    // West side and the back.
    const wsd = w.west
    for (const su of [3.0, 6.5, 10.0, 12.8]) framed(teal, win, wsd, su, 0.5, st + 5.65, st + 6.95, 0.12)
    for (const su of [6.5, 10.0]) framed(teal, win, wsd, su, 0.5, st + 1.2, st + 2.6, 0.12)
    for (const su of [1.6, 13.4]) framed(teal, win, w.south, su, 0.45, 4.6, 5.9, 0.1)
  }

  // ---- Write --------------------------------------------------------------------------------------
  const list = [
    { part: steel, material: MATS.steel }, { part: red, material: MATS.red }, { part: yellow, material: MATS.yellow },
    { part: teal, material: MATS.teal }, { part: roof, material: MATS.roof }, { part: win, material: MATS.window },
  ]
  const drop = settle(list.map((l) => l.part))
  const tris = list.reduce((n, l) => n + l.part.triangles, 0)
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the track midpoint, on the lowest ground',
    bearing: BEARING, elevation: 0, groundDatumNAVD88: 223.16 + drop,
  }
  const glb = writeGlb('Monongahela Incline', list, extras)
  if (tris > 5000) throw new Error(`${tris} triangles, over 5000`)
  if (glb.length > 250 * 1024) throw new Error(`${glb.length} bytes, over 250 KB`)
  await Bun.write(new URL('../models/pit-monongahela-incline.glb', import.meta.url), glb)
  console.log(`pit-monongahela-incline.glb: ${tris} triangles, ${glb.length} bytes; dropped ${drop.toFixed(2)} m`)
}

if (import.meta.main) await build()
