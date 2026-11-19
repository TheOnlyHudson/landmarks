/**
 * Rotes Rathaus (Berlin City Hall), Rathausstraße 15: procedural, CC0-1.0.
 * bun generators/berlin-rotes-rathaus.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 320.7: the
 * model's north is the Rathausstraße front (north-west), where the tower
 * stands; its x axis runs along that front (OSM's long walls run at 50.7
 * and 140.7 degrees). Origin: the centre of the outline's box in that frame,
 * 13.408545 52.518278; y = 0 at the ground (the site is flat; Mapterhorn
 * varies under 0.6 m across it).
 *
 * Identity (from the photos below):
 *  1. The 74 m clock tower over the middle of the Rathausstraße front: a
 *     square shaft with open, column-lined corner loggias, pairs of tall
 *     round-arched windows, a clock in a round-arched panel on every face,
 *     a corbelled arcade frieze and parapet, a low dark cap and a lattice
 *     spire with the flag.
 *  2. Red-orange brick all over (the "red" of the name), with pale
 *     sandstone string courses, cornice and plinth.
 *  3. A square block of four wings round three open courtyards, with corner
 *     pavilions and a broad central risalit on each front.
 *  4. The facade rhythm: segment-headed ground-floor windows, the terracotta
 *     frieze on the first-floor balcony ("Steinerne Chronik"), two-storey
 *     round-arched window niches above it, small round-arched top-floor
 *     windows under the main cornice and attic.
 *  5. The arched main portal under the tower.
 *
 * Plan: OSM relation/4211905 (outer way/313675136, courtyards
 * way/313675137-139), simplified to its straight walls and risalits in the
 * turned frame; the tower is building:part way/222813049 (16 m with notched
 * corners), the inner parts way/128396192, way/222813051, way/222813052,
 * way/230838701, way/217541314, way/217541315.
 *
 * Published (German Wikipedia, "Rotes Rathaus"): 1861-69, Hermann Friedrich
 * Waesemann; 99 m square plan (OSM: 99 x 89 m); four wings round three open
 * courtyards; the building 27 m to the top of the attic over the main
 * cornice; tower to the parapet 74 m, to the tip 94 m, plan about 12 x 13 m
 * (OSM's part includes the loggias); four clock faces 4.75 m across; the
 * terracotta frieze of 36 relief panels on the first-floor balcony;
 * two-storey round-arched window niches on the Rathausstraße and Gustav-
 * Böß-Straße fronts.
 *
 * Measured off photos (scaled from the clock's 4.75 m, "Rotes Rathaus,
 * Berlin-Mitte, Turm, 160213, ako.jpg"): clock centre 58 m, its stage from
 * 54.5 m, the arcade frieze from 68 m, the tall paired windows 41-53 m, the
 * ledge under them at 40 m, the loggias' openings 41-50 and 54-61 m. The cap
 * and spire (to 80 and 86 m) from "20240815 View cupola Berlin Cathedral
 * 10.jpg" and "Rotes Rathaus June 2023 01.jpg". Facade storey heights from
 * the long front in "Rotes Rathaus June 2023 01.jpg" scaled to 27 m: ground
 * floor to 7.5 m, frieze 7.6-9.4 m, the two-storey niches 10.2-20.5 m, top
 * floor windows 21.2-24.1 m, cornice 24.8 m; first- and second-floor
 * windows 9.9-14.7 and 15.0-19.8 m, in pairs of narrow round-headed
 * lights between brick pilasters. Bays about 3.9 m (25 on the
 * long fronts).
 *
 * Estimated: the courtyard facades (no photo: plain brick with grouped
 * window panels); the roofs (flat, with the gabled Festsaal roof of
 * way/230838701 drawn low); the corner columns as one per loggia; the
 * window widths; the portal's size. Left out: sculpture, the coats of arms,
 * the flag, the frieze's reliefs (a band in terracotta), the glass roof of
 * one courtyard.
 *
 * Night: the brick is floodlit (`_FLOODLIGHT`, strongest on the tower); the
 * windows are `window`.
 *
 * Photos (evidence, Wikimedia Commons):
 * - "Rotes Rathaus June 2023 01.jpg", ArildV, CC BY-SA 4.0 (south-west front from the cathedral dome)
 *   https://commons.wikimedia.org/wiki/File:Rotes_Rathaus_June_2023_01.jpg
 * - "Rotes Rathaus, Berlin, Südseite, 160213, ako.jpg", Ansgar Koreng, CC BY 3.0 de
 *   https://commons.wikimedia.org/wiki/File:Rotes_Rathaus,_Berlin,_S%C3%BCdseite,_160213,_ako.jpg
 * - "Blick vom Hotel Park Inn zum Roten Rathaus.jpg", JoachimKohler-HB, CC BY-SA 4.0 (from the north-east, high)
 *   https://commons.wikimedia.org/wiki/File:Blick_vom_Hotel_Park_Inn_zum_Roten_Rathaus.jpg
 * - "Rotes Rathaus, Berlin-Mitte, Turm, 160213, ako.jpg", Ansgar Koreng, CC BY 3.0 de (tower top)
 *   https://commons.wikimedia.org/wiki/File:Rotes_Rathaus,_Berlin-Mitte,_Turm,_160213,_ako.jpg
 * - "Rotes Rathaus, Berlin-Mitte, Fassadendetails Ostseite, 160213, ako.jpg", Ansgar Koreng, CC BY 3.0 de
 *   https://commons.wikimedia.org/wiki/File:Rotes_Rathaus,_Berlin-Mitte,_Fassadendetails_Ostseite,_160213,_ako.jpg
 * - "Rotes Rathaus November 2013.jpg", Arild Vågen, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Rotes_Rathaus_November_2013.jpg
 * - "Berlin - Rotes Rathaus 7450.jpg", Phyrexian, CC BY-SA 4.0 (frieze, niches)
 *   https://commons.wikimedia.org/wiki/File:Berlin_-_Rotes_Rathaus_7450.jpg
 * - "20240815 View cupola Berlin Cathedral 10.jpg", Flocci Nivis, CC BY 4.0 (from the west, high)
 *   https://commons.wikimedia.org/wiki/File:20240815_View_cupola_Berlin_Cathedral_10.jpg
 * Look-only: none.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, ccw, cornice, prism, save, wall, type XY } from './atl-flatiron-building'
import { archShape, gableRoof, onWall, rectShape } from './atl-tech-tower'
import { lathe, flat } from './berlin-fernsehturm'

const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), frieze = new Part(), slate = new Part()

const CORNICE = 24.8, ATTIC = 27

// ── Plan (turned frame), clockwise as listed, then made counter-clockwise ──
const OUTER: XY[] = ccw([
  [-49.1, 36.6], [-49.1, 43.6], [-42.0, 43.6], [-42.0, 42.0], [-8.8, 42.0], [-8.8, 45.2], [9.3, 45.2], [9.3, 42.0],
  [42.4, 42.0], [42.4, 43.7], [49.5, 43.7], [49.5, 36.6], [47.9, 36.6],
  [47.9, 7.7], [49.5, 7.7], [49.5, -9.3], [48.0, -9.3], [48.0, -38.2], [49.7, -38.2], [49.7, -45.1], [42.8, -45.1], [42.8, -43.6],
  [6.5, -43.6], [6.5, -45.2], [-5.6, -45.2], [-5.6, -43.6], [-41.8, -43.6], [-41.8, -45.2], [-48.8, -45.2], [-48.8, -38.2], [-47.3, -38.2],
  [-47.3, -16.9], [-49.6, -16.9], [-49.6, 14.5], [-47.4, 14.5], [-47.4, 36.6],
])
// Courtyards, from way/313675137-139 squared off.
const COURTS: [number, number, number, number][] = [
  [10.1, 34.6, -29.8, 25.2],
  [-26.5, -9.6, 8.6, 25.2],
  [-26.5, -9.6, -29.7, -10.3],
]

// ── Massing: the outer walls, the courtyard walls, the roof between ──
wall(brick, OUTER, 0, ATTIC)
for (const [x0, x1, y0, y1] of COURTS) {
  const r: XY[] = [[x0, y0], [x0, y1], [x1, y1], [x1, y0]] // clockwise: walls face into the court
  wall(brick, r, 0, ATTIC - 0.6)
  // the courtyard's coping
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4]
    stone.quad([a[0], a[1], ATTIC - 0.6], [b[0], b[1], ATTIC - 0.6], [b[0], b[1], ATTIC], [a[0], a[1], ATTIC])
  }
}
// Flat roofs over the wings, as rectangles (the courts stay open).
const WINGS: [number, number, number, number][] = [
  [-49.6, 49.7, 25.2, 45.2],   // north (Rathausstraße)
  [-49.6, 49.7, -45.2, -29.7], // south
  [-49.6, -26.5, -29.7, 25.2], // west
  [34.6, 49.7, -29.8, 25.2],   // east
  [-9.6, 10.1, -29.8, 25.2],   // the middle wing
  [-26.5, -9.6, -10.3, 8.6],   // between the west courts
]
{
  // Each wing's rectangle, trimmed to the outline's main walls.
  const clampX = (x: number) => Math.max(-47.3, Math.min(47.9, x)), clampY = (y: number) => Math.max(-43.6, Math.min(42.0, y))
  for (const [x0, x1, y0, y1] of WINGS) {
    capPoly(roof, [[clampX(x0), clampY(y0)], [clampX(x1), clampY(y0)], [clampX(x1), clampY(y1)], [clampX(x0), clampY(y1)]], ATTIC - 0.05, true)
  }
  // The risalits and corner pavilions stand proud of the main walls: their
  // roofs are the outline's notches.
  const notches: XY[][] = [
    [[-49.1, 36.6], [-47.4, 36.6], [-47.4, 42.0], [-42.0, 42.0], [-42.0, 43.6], [-49.1, 43.6]],
    [[-8.8, 42.0], [9.3, 42.0], [9.3, 45.2], [-8.8, 45.2]],
    [[42.4, 42.0], [47.9, 42.0], [47.9, 36.6], [49.5, 36.6], [49.5, 43.7], [42.4, 43.7]],
    [[47.9, 7.7], [47.9, -9.3], [49.5, -9.3], [49.5, 7.7]],
    [[48.0, -38.2], [49.7, -38.2], [49.7, -45.1], [42.8, -45.1], [42.8, -43.6], [48.0, -43.6]],
    [[6.5, -43.6], [-5.6, -43.6], [-5.6, -45.2], [6.5, -45.2]],
    [[-41.8, -43.6], [-47.3, -43.6], [-47.3, -38.2], [-48.8, -38.2], [-48.8, -45.2], [-41.8, -45.2]],
    [[-47.3, -16.9], [-47.3, 14.5], [-49.6, 14.5], [-49.6, -16.9]],
  ]
  for (const n of notches) capPoly(roof, ccw(n), ATTIC - 0.05, true)
}
// Main cornice and the attic's coping, round the whole outline.
cornice(stone, OUTER, CORNICE, 0.9, 0.55, null)
cornice(stone, OUTER, ATTIC - 0.45, 0.45, 0.25, null)
// Granite plinth.
{
  const o = OUTER.map((p) => p)
  for (let i = 0; i < o.length; i++) {
    const a = o[i], b = o[(i + 1) % o.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.1) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const P = (p: XY, d: number, z: number): V3 => [p[0] + n[0] * d, p[1] + n[1] * d, z]
    stone.quad(P(a, 0.25, 0), P(b, 0.25, 0), P(b, 0.25, 1.3), P(a, 0.25, 1.3))
    stone.quad(P(a, 0.25, 1.3), P(b, 0.25, 1.3), P(b, 0, 1.55), P(a, 0, 1.55))
  }
}
// The Festsaal's low gabled roof over the middle wing (way/230838701).
gableRoof(roof, brick, -9.5, 11.9, -8.9, 5.3, ATTIC, ATTIC + 3, 'x', 0.2, 0.2)

// ── Facades ──
/** A band standing `out` off a wall from a to b (outside to the right), z0-z1, with a top. */
function strip(p: Part, top: Part | null, a: XY, b: XY, z0: number, z1: number, out: number, inset = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
  const P = (s: number, d: number, z: number): V3 => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z]
  const s0 = inset, s1 = L - inset
  p.quad(P(s0, out, z0), P(s1, out, z0), P(s1, out, z1), P(s0, out, z1))
  p.quad(P(s0, 0, z0), P(s1, 0, z0), P(s1, out, z0), P(s0, out, z0)) // underside
  p.quad(P(s0, 0, z0), P(s0, out, z0), P(s0, out, z1), P(s0, 0, z1))
  p.quad(P(s1, out, z0), P(s1, 0, z0), P(s1, 0, z1), P(s1, out, z1))
  ;(top ?? p).quad(P(s0, out, z1), P(s1, out, z1), P(s1, 0, z1), P(s0, 0, z1))
}
const TOWER_X0 = -8.8, TOWER_X1 = 9.3
for (let i = 0; i < OUTER.length; i++) {
  const a = OUTER[i], b = OUTER[(i + 1) % OUTER.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 3.5) continue
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  // The terracotta frieze on the first-floor balcony, with a stone sill.
  strip(frieze, stone, a, b, 7.6, 9.4, 0.45, 0.3)
  strip(stone, stone, a, b, 20.6, 20.9, 0.18, 0.1)
  const bays = Math.max(1, Math.round((L - 1.2) / 3.9)), w = (L - 1.2) / bays
  const portal = a[1] > 44 && b[1] > 44 // the central risalit under the tower
  for (let k = 0; k < bays; k++) {
    const s = 0.6 + (k + 0.5) * w
    const isPortal = portal && k === Math.floor(bays / 2)
    if (isPortal) {
      // The main portal: a round arch with a stone surround.
      onWall(stone, a, b, archShape(s, 5.6, 0.3, 4.6, 10), 0.04)
      onWall(win, a, b, archShape(s, 4.4, 0.3, 4.6, 10), 0.08)
    } else {
      onWall(win, a, b, archShape(s, Math.min(1.7, w * 0.44), 2.3, 5.7, 4), 0.05)
    }
    // First and second floors: pairs of narrow round-headed windows between
    // brick pilasters, as on the long fronts in the photos; one on the top floor.
    const pw = Math.min(0.98, w * 0.25), gap = pw * 0.4
    for (const d of [-1, 1]) {
      const c = s + d * (pw + gap) / 2
      onWall(win, a, b, archShape(c, pw, 9.9, 14.2, 4), 0.05)
      onWall(win, a, b, archShape(c, pw, 15.0, 19.3, 4), 0.05)
    }
    onWall(win, a, b, archShape(s, Math.min(1.4, w * 0.36), 21.1, 23.6, 6), 0.05)
    // the pilaster between this bay and the next, standing proud
    if (k < bays - 1) onWall(brick, a, b, rectShape(s + w / 2 - 0.32, s + w / 2 + 0.32, 9.5, 24.6), 0.22)
  }
  void t
}
// Courtyard facades: grouped panels, two storeys each.
for (const [x0, x1, y0, y1] of COURTS) {
  const r: XY[] = [[x0, y0], [x0, y1], [x1, y1], [x1, y0]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bays = Math.max(1, Math.round((L - 2) / 4)), w = (L - 2) / bays
    for (let k = 0; k < bays; k++) {
      const s = 1 + (k + 0.5) * w
      onWall(win, a, b, rectShape(s - w * 0.28, s + w * 0.28, 10.2, 18.5), 0.05)
    }
  }
}

// ── The tower: centre (0.3, 32.2), 15 m square with notched corners ──
const TC: XY = [0.3, 32.2], H = 7.5, N = 2.0 // half-size, corner notch
const PARAPET = 74
{
  // The shaft with notched corners, from the roof up.
  const notched = (h: number, n: number): XY[] => ccw([
    [TC[0] - h + n, TC[1] - h], [TC[0] + h - n, TC[1] - h], [TC[0] + h - n, TC[1] - h + n], [TC[0] + h, TC[1] - h + n],
    [TC[0] + h, TC[1] + h - n], [TC[0] + h - n, TC[1] + h - n], [TC[0] + h - n, TC[1] + h], [TC[0] - h + n, TC[1] + h],
    [TC[0] - h + n, TC[1] + h - n], [TC[0] - h, TC[1] + h - n], [TC[0] - h, TC[1] - h + n], [TC[0] - h + n, TC[1] - h + n],
  ])
  // Solid stage to 40 m, then the notched (loggia) shaft to the frieze.
  prism(brick, ccw([[TC[0] - H, TC[1] - H], [TC[0] + H, TC[1] - H], [TC[0] + H, TC[1] + H], [TC[0] - H, TC[1] + H]]), ATTIC - 1, 40.2, null, 0)
  prism(brick, notched(H, N), 40.2, 68, null, 0)
  // The corbelled frieze and the parapet, square again and a little proud.
  const sq = (h: number): XY[] => ccw([[TC[0] - h, TC[1] - h], [TC[0] + h, TC[1] - h], [TC[0] + h, TC[1] + h], [TC[0] - h, TC[1] + h]])
  // corbel: a sloped underside out to the frieze
  {
    const a = sq(H), b = sq(H + 0.5)
    brick.loft([a.map(([x, y]) => [x, y, 67.2] as V3), b.map(([x, y]) => [x, y, 68.2] as V3)])
  }
  prism(brick, sq(H + 0.5), 68.2, PARAPET - 0.4, null, 0)
  cornice(stone, sq(H + 0.5), 68.0, 0.3, 0.2, null)
  cornice(stone, sq(H + 0.5), 71.6, 0.35, 0.25, null)
  prism(stone, sq(H + 0.6), PARAPET - 0.4, PARAPET, roof, 0.15)
  // Corner blocks on the parapet.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = TC[0] + sx * (H - 0.6), cy = TC[1] + sy * (H - 0.6)
    box(brick, cx - 1.2, cx + 1.2, cy - 1.2, cy + 1.2, PARAPET - 0.4, PARAPET + 1.3, stone, 0.15)
  }
  // Stone string courses at the stage lines.
  cornice(stone, sq(H), 39.8, 0.45, 0.25, stone)
  cornice(stone, notched(H, N), 54.2, 0.4, 0.2, stone)
  // The loggias: a column in each notch, from 40.2 to 68, and a ledge across at 54.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const c: XY = [TC[0] + sx * (H - N * 0.45), TC[1] + sy * (H - N * 0.45)]
    lathe([[0.42, 40.2], [0.32, 40.6], [0.32, 53.6], [0.45, 54.0], [0.45, 54.6], [0.32, 55.0], [0.32, 66.8], [0.45, 67.2], [0, 67.2]], () => stone, 8, 40, c)
  }
  // Tower facades: on each face, paired tall windows, the clock in its arch,
  // small windows below.
  const faces: [XY, XY][] = [
    [[TC[0] - H + N, TC[1] - H], [TC[0] + H - N, TC[1] - H]],
    [[TC[0] + H, TC[1] - H + N], [TC[0] + H, TC[1] + H - N]],
    [[TC[0] + H - N, TC[1] + H], [TC[0] - H + N, TC[1] + H]],
    [[TC[0] - H, TC[1] + H - N], [TC[0] - H, TC[1] - H + N]],
  ]
  for (const [a, b] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = L / 2
    for (const d of [-1.35, 1.35]) onWall(win, a, b, archShape(m + d, 1.5, 41.2, 52.2, 8), 0.05)
    onWall(stone, a, b, rectShape(m - 2.1, m + 2.1, 46.5, 46.8), 0.08)
    // The clock's arched panel (brick, a little proud) and the dial.
    onWall(brick, a, b, archShape(m, 6.4, 55.0, 61.2, 10), 0.12)
    const dial: [number, number][] = Array.from({ length: 16 }, (_, i) => [m + 2.38 * Math.cos((i / 16) * Math.PI * 2), 58.3 + 2.38 * Math.sin((i / 16) * Math.PI * 2)])
    onWall(stone, a, b, dial, 0.2)
    // A gilt hand pair, in window grey so they read as the dial's dark marks.
    onWall(win, a, b, rectShape(m - 0.12, m + 0.12, 58.3, 60.2), 0.24)
    onWall(win, a, b, rectShape(m, m + 1.4, 58.18, 58.42), 0.24)
    // Arcade of the corbel frieze: small dark arches.
    for (let k = 0; k < 5; k++) onWall(win, a, b, archShape(m - 4.4 + k * 2.2, 1.0, 68.6, 70.2, 4), 0.55)
    // Lower stage windows.
    for (const d of [-1.3, 1.3]) onWall(win, a, b, archShape(m + d, 1.1, 31.5, 36.5, 6), 0.05)
  }
  // The loggias' inner faces read dark: a window panel at the back of each notch.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = TC[0] + sx * (H - N), cy = TC[1] + sy * (H - N)
    for (const [z0, z1] of [[41.4, 50.2], [55.4, 61.4]]) {
      // two inner faces of the notch, facing out along x and y
      flat(win, [[cx + sx * 0.04, cy, z0], [cx + sx * 0.04, cy + sy * N, z0], [cx + sx * 0.04, cy + sy * N, z1], [cx + sx * 0.04, cy, z1]], [sx, 0, 0])
      flat(win, [[cx, cy + sy * 0.04, z0], [cx + sx * N, cy + sy * 0.04, z0], [cx + sx * N, cy + sy * 0.04, z1], [cx, cy + sy * 0.04, z1]], [0, sy, 0])
    }
  }
  // The low dark cap, its lantern and the lattice spire with the flagpole.
  {
    const h = H - 1.2
    const ring: V3[] = [[TC[0] - h, TC[1] - h, PARAPET], [TC[0] + h, TC[1] - h, PARAPET], [TC[0] + h, TC[1] + h, PARAPET], [TC[0] - h, TC[1] + h, PARAPET]]
    const top: V3[] = ring.map(([x, y]) => [TC[0] + (x - TC[0]) * 0.2, TC[1] + (y - TC[1]) * 0.2, 78.5] as V3)
    for (let i = 0; i < 4; i++) slate.quad(ring[i], ring[(i + 1) % 4], top[(i + 1) % 4], top[i])
    slate.cap(top, true)
    lathe([[0.9, 78.5], [0.6, 82.5], [0.25, 86], [0.12, 92], [0, 92]], () => slate, 6, 40, TC)
  }
}

// ── Output ──
// Brick: the photos' deep red-brown; the sandstone trim and the frieze's
// terracotta darkened to sit with it; the flat roofs a darker grey so they
// don't dominate from above.
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[2] > ATTIC + 1 ? 1 : 0.75)
await save('berlin-rotes-rathaus', 'Rotes Rathaus', [
  { part: brick, material: { ...finish('rathaus-brick', 0xa6553d), floodlight: lit } },
  { part: stone, material: { ...finish('rathaus-sandstone', 0xc9b597), floodlight: lit } },
  { part: frieze, material: finish('rathaus-terracotta', 0xb3765a) },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('rathaus-roof', 0x7b8087) },
  { part: slate, material: finish('rathaus-slate', 0x5c5f68) },
], { bearing: 320.7, elevation: 0, height: 92 }, 6500)
