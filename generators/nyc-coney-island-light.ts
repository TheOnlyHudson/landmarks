/**
 * Coney Island Light (Norton's Point Light), Sea Gate, Brooklyn (U.S.
 * Lighthouse Board, 1890) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-coney-island-light.ts
 *
 * Map frame: x = east, y = north, z up, metres, built in the tower's own
 * square frame and placed at bearing 50.7 (the Sea Gate street grid and the
 * Keeper's Quarters way/248352853, whose walls run 50.7° / 140.6°; the
 * legs' true orientation isn't measurable on the aerial, so estimated).
 * Anchor: area centroid of OSM way/1185754230 (-74.0117631, 40.5766049),
 * the central stair column.
 *
 * Evidence
 * - OSM: way/1185754230 "Coney Island Lighthouse", man_made=lighthouse,
 *   height 22.9 (= seamark:light:height), a 2.3 m circle: the central
 *   column. way/554952605 "Coney Island Light Station" is the site area.
 * - Published (Wikipedia "Coney Island Light"; USCG Light List LLNR
 *   34910): skeletal square pyramidal steel tower with a central cylinder,
 *   built 1890, about 75 ft (23 m); focal height 75 ft; red flash every 5 s.
 * - Photos (Wikimedia Commons):
 *   - "Coney Island Lighthouse 01.JPG", Jeffrey Lewis Riehle, CC BY-SA 3.0
 *     (whole tower, near side-on; the proportions below are scaled on the
 *     2.3 m column in it)
 *   - "Coney Island Lighthouse 04.JPG", Jeffrey Lewis Riehle, CC BY-SA 3.0
 *     (the frame from below: four legs, two levels of struts to the column,
 *     X rods in each face, the black gallery skirt)
 *   - "Coney Island Lighthouse 02.JPG", Jeffrey Lewis Riehle, CC BY-SA 3.0
 *   - "Coney Island Light.jpg", Oleg Yunakov, CC BY-SA 4.0 (top stages at
 *     dusk, the red light lit)
 *   - "Nortons Point Light jeh.JPG", Jim.henderson, public domain (from
 *     the water)
 * - Terrain (Mapterhorn): flat, within 0.4 m across the footprint.
 *
 * Colours: every photo shows the frame, column and watch room white and
 * the gallery skirt, railings, lantern and roof black (pulled to charcoal);
 * the brief's "red-and-white" is the light, not the paint, so the photos
 * were followed. The red light is a red lens seen through a translucent
 * lantern; it is `neon` and glows red at night. The lens is drawn larger
 * than real (1.2 m across, the glazing height) so the lit lantern reads.
 *
 * Estimated from "Coney Island Lighthouse 01" at 17 px/m (column 2.3 m):
 * leg spread 8.2 m at the ground and 5.0 m under the gallery; gallery
 * underside 15.3 m, deck 16.6 m; watch room 16.6–18.9 m, 3.5 m across;
 * lantern deck 19.15 m, glazing 19.6–20.6 m; roof to 21.9 m, ball to
 * 22.4 m, close to the published 23 m. Strut levels at 5.5 and 11 m from
 * "04". Members are drawn bolder than real (legs 0.36 m, struts 0.26 m,
 * rods 0.18 m), per STYLE.md, so the frame reads at map distance.
 * Doubts: the bearing of the legs; the door's side (one black door is
 * seen in "04", put on the south-west face); railings are a top rail and
 * posts only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, loftRings, ring3, circle, unit, type XY } from './nyc-570-lexington'

const white = new Part(), black = new Part(), glass = new Part(), lens = new Part(), door = new Part()

const BASE_HALF = 4.1, TOP_HALF = 2.5, GALLERY_LO = 15.3, DECK = 16.6
const COLUMN_R = 1.15, WATCH_R = 1.75, WATCH_TOP = 18.9, LDECK = 19.15
const LANTERN_R = 1.15, GLASS_LO = 19.6, GLASS_HI = 20.6, ROOF_LO = 20.75, ROOF_TOP = 21.9

/** A square-section bar from a to b, w wide, with end caps. */
function bar(p: Part, a: V3, b: V3, w: number) {
  const d = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  const ref: V3 = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const u = unit([d[1] * ref[2] - d[2] * ref[1], d[2] * ref[0] - d[0] * ref[2], d[0] * ref[1] - d[1] * ref[0]])
  const v: V3 = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]]
  const h = w / 2
  const sec = (c: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([s, t]) =>
    [c[0] + (u[0] * s + v[0] * t) * h, c[1] + (u[1] * s + v[1] * t) * h, c[2] + (u[2] * s + v[2] * t) * h] as V3)
  const r0 = sec(a), r1 = sec(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.quad(r0[i], r0[j], r1[j], r1[i])
  }
  p.quad(r1[0], r1[1], r1[2], r1[3])
  p.quad(r0[3], r0[2], r0[1], r0[0])
}

/** A closed cylinder (or frustum) between two heights. */
function drum(p: Part, r0: number, r1: number, z0: number, z1: number, n: number, top = true, bottom = false, phase = Math.PI / n) {
  loftRings(p, [ring3(circle(0, 0, r0, n, phase), z0), ring3(circle(0, 0, r1, n, phase), z1)], top, bottom)
}

/** A railing: posts and a top rail round an n-gon of radius r. */
function railing(p: Part, r: number, z0: number, h: number, n: number, phase: number) {
  const pts = circle(0, 0, r, n, phase)
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    bar(p, [a[0], a[1], z0 + h], [b[0], b[1], z0 + h], 0.09)
    bar(p, [a[0], a[1], z0], [a[0], a[1], z0 + h], 0.09)
  }
}

// ---------------------------------------------------------------------------
// The frame: four corner legs, two levels of struts, X rods in every face.
// ---------------------------------------------------------------------------
const CORNERS: XY[] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
const legAt = (c: XY, z: number): V3 => {
  const t = z / GALLERY_LO, h = BASE_HALF + (TOP_HALF - BASE_HALF) * t
  return [c[0] * h, c[1] * h, z]
}
const LEVELS = [0.15, 5.5, 11, GALLERY_LO]
for (const c of CORNERS) bar(white, legAt(c, 0), legAt(c, GALLERY_LO + 0.1), 0.36)
for (let i = 0; i < 4; i++) {
  const c = CORNERS[i], d = CORNERS[(i + 1) % 4]
  for (const z of [5.5, 11]) {
    bar(white, legAt(c, z), legAt(d, z), 0.26) // perimeter girt
    const a = legAt(c, z), r = COLUMN_R / Math.hypot(a[0], a[1])
    bar(white, a, [a[0] * r, a[1] * r, z], 0.26) // strut to the column
  }
  for (let k = 0; k < LEVELS.length - 1; k++) {
    const z0 = LEVELS[k], z1 = LEVELS[k + 1]
    bar(white, legAt(c, z0), legAt(d, z1), 0.18)
    bar(white, legAt(d, z0), legAt(c, z1), 0.18)
  }
}

// The central stair column, with its door.
drum(white, COLUMN_R, COLUMN_R, 0, GALLERY_LO, 14, false)
{
  // A shallow box standing 0.12 m proud of the column face.
  const a = Math.PI * 1.25, hw = 0.42, r0 = COLUMN_R - 0.1, r1 = COLUMN_R + 0.12, top = 2.2
  const p = (s: number, r: number, z: number): V3 => [Math.cos(a) * r - Math.sin(a) * s, Math.sin(a) * r + Math.cos(a) * s, z]
  door.quad(p(-hw, r1, 0), p(hw, r1, 0), p(hw, r1, top), p(-hw, r1, top))
  door.quad(p(hw, r1, 0), p(hw, r0, 0), p(hw, r0, top), p(hw, r1, top))
  door.quad(p(-hw, r0, 0), p(-hw, r1, 0), p(-hw, r1, top), p(-hw, r0, top))
  door.quad(p(-hw, r1, top), p(hw, r1, top), p(hw, r0, top), p(-hw, r0, top))
}

// ---------------------------------------------------------------------------
// The watch gallery: a black octagonal skirt flaring out over the legs,
// its deck and railing.
// ---------------------------------------------------------------------------
const OCT = Math.PI / 8
loftRings(black, [ring3(circle(0, 0, 2.35, 8, OCT), GALLERY_LO), ring3(circle(0, 0, 3.0, 8, OCT), DECK - 0.35), ring3(circle(0, 0, 3.0, 8, OCT), DECK)], false, true)
loftRings(white, [ring3(circle(0, 0, 2.95, 8, OCT), DECK), ring3(circle(0, 0, 2.95, 8, OCT), DECK + 0.02)], true)
railing(black, 2.85, DECK, 1.0, 8, OCT)

// The watch room: a white drum, its small window, and the lantern deck.
drum(white, WATCH_R, WATCH_R, DECK, WATCH_TOP, 14)
{
  const a = Math.PI * 0.25, r = WATCH_R + 0.03, hw = 0.3
  const p = (s: number, z: number): V3 => [Math.cos(a) * r - Math.sin(a) * s, Math.sin(a) * r + Math.cos(a) * s, z]
  glass.quad(p(-hw, 17.5), p(hw, 17.5), p(hw, 18.2), p(-hw, 18.2))
}
drum(black, 2.05, 2.15, WATCH_TOP, LDECK, 14, true, true)
railing(black, 2.0, LDECK, 0.85, 10, 0)

// ---------------------------------------------------------------------------
// The lantern: black base, glazing (translucent, with the red lens inside),
// black domed roof, ventilator ball.
// ---------------------------------------------------------------------------
drum(black, LANTERN_R, LANTERN_R, LDECK, GLASS_LO, 8, true)
drum(lens, 0.6, 0.6, GLASS_LO, GLASS_HI - 0.05, 8, true)
drum(glass, LANTERN_R - 0.02, LANTERN_R - 0.02, GLASS_LO, GLASS_HI, 8, false)
// Astragals: bold black corner bars at the glazing joints.
for (const [x, y] of circle(0, 0, LANTERN_R, 8, Math.PI / 8)) bar(black, [x, y, GLASS_LO], [x, y, GLASS_HI], 0.12)
drum(black, LANTERN_R, LANTERN_R + 0.2, GLASS_HI, ROOF_LO, 8, false, true)
loftRings(black, [
  ring3(circle(0, 0, LANTERN_R + 0.2, 8, Math.PI / 8), ROOF_LO),
  ring3(circle(0, 0, 1.0, 8, Math.PI / 8), 21.35),
  ring3(circle(0, 0, 0.45, 8, Math.PI / 8), 21.8),
  ring3(circle(0, 0, 0.15, 8, Math.PI / 8), ROOF_TOP),
], true)
loftRings(black, [
  ring3(circle(0, 0, 0.05, 8), ROOF_TOP),
  ring3(circle(0, 0, 0.24, 8), 22.08),
  ring3(circle(0, 0, 0.24, 8), 22.22),
  ring3(circle(0, 0, 0.05, 8), 22.4),
], true)

finishModel('Coney Island Light', 'nyc-coney-island-light', [
  { part: white, material: finish('lighthouse-white', 0xf3f1ea) },
  { part: black, material: finish('lighthouse-black', 0x4a4f57) },
  { part: glass, material: { name: 'glass', color: 0x7fc4de, roughness: 0.24, opacity: 0.3, doubleSided: true } },
  { part: lens, material: finish('neon-lantern-red', 0xd8473b) },
  { part: door, material: finish('lighthouse-door', 0x55595e) },
], { bearing: 50.7, osm: 'way/1185754230', height: 22.4 })
