/**
 * St. John's Church (Episcopal), 2401 East Broad Street, Church Hill,
 * Richmond, Virginia (1741; north wing 1772; tower c. 1830; enlarged
 * 1880s) — the church of Patrick Henry's "Give me liberty" speech —
 * original procedural geometry, CC0-1.0.
 * bun generators/ric-st-johns-church.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 0.69 (the walls of OSM way/400327565 run at 0.7°).
 * Anchor = the outline's centroid, -77.4196653, 37.5313448.
 *
 * Identity (from the photos below):
 *  1. A white clapboard church on a cross plan with plain grey gabled roofs:
 *     the original 1741 nave runs east–west across the middle (its gables
 *     at the east and west ends), with the 1772 north wing and the later
 *     south wing running north–south through it.
 *  2. The tower on the north gable (toward Broad Street): a square white
 *     clapboard shaft with the main door, a cornice, a narrower stage with a
 *     round louvred oculus, a narrower belfry stage with a louvred opening,
 *     an octagonal louvred lantern with a small cap and a cross.
 *  3. The north gable front: two side doors and two shuttered 12-light
 *     windows either side of the tower; tall shuttered windows on the long
 *     sides.
 *
 * Plan: OSM way/400327565, used as drawn in the turned frame: north wing
 * x -7.1..7.6, y 2.6..13.6; the old nave x -9.35..9.0, y -6.1..2.7; south
 * wing x -7.7..7.0, y -13.55..-6.1; a small polygonal chancel to y -15.7;
 * the tower x -1.7..2.1, y 13.5..17.4.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid, read in this frame. y = 0 is the lowest ground, at the south
 * end; the ground rises 1.8 m to the north front. Measured above y = 0:
 * wing ridges 10.7, nave ridge 11.1, eaves 7.65, the chancel about 7.5,
 * the tower top 22.7 (the lantern cap). Estimated from the Skyring and
 * Hathorn photos, scaled to the lidar tower: the stage heights (shaft to
 * 12.4, oculus stage to 15.8, belfry to 19.5, lantern 19.8–22.3), the
 * stage widths (4.0, 3.5, 3.1, lantern 2.5), the cross (to 23.8), the
 * windows and doors.
 *
 * Ground: Mapterhorn and lidar rise ~1.8 m from the south end to the north
 * front; elevation 0. The north doors sit at the north ground (1.8).
 *
 * Night: the church and tower are floodlit white; windows glow.
 *
 * Photos (all EVIDENCE):
 *  - StJohnsRichmond.JPG, Skyring, CC BY-SA 3.0 (the north front and tower)
 *    https://commons.wikimedia.org/wiki/File:StJohnsRichmond.JPG
 *  - St. John's Church in Richmond, VA (2011) IMG 4046.JPG, Billy Hathorn,
 *    CC BY-SA 3.0 (north front, summer)
 *    https://commons.wikimedia.org/wiki/File:St._John%27s_Church_in_Richmond,_VA_(2011)_IMG_4046.JPG
 *  - St. John's Church, Richmond, Virginia-LCCN2008679545.jpg, Detroit
 *    Photographic Co. 1901, public domain (the west side: the cross plan,
 *    the nave's gable, the shuttered windows)
 *    https://commons.wikimedia.org/wiki/File:St._John%27s_Church,_Richmond,_Virginia-LCCN2008679545.jpg
 *  - St. John's Church, Site of Patrick Henry's 'Give Me Liberty' Speech,
 *    Ken Lund, CC BY-SA 2.0 https://www.flickr.com/photos/75683070@N00/2522595702
 *  - USGS NAIP orthoimagery (public domain): roof plan.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south wing and chancel are seen in no photo used here; they
 * follow OSM and lidar, with windows like the north wing's. Window counts
 * on the long sides are from the 1901 photo. The real lantern is octagonal
 * with louvres on each face; drawn as an octagon with four louvres.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, gableRoof, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, prism, save } from './atl-flatiron-building'

const white = new Part(), roof = new Part(), win = new Part(), dark = new Part()

const EAVE = 7.65, NG = 1.8 // north ground above y = 0
type F = [XY, XY]
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** Ground under a point, from the lidar: 0 at the south end, NG at the north front. */
const g = (y: number) => Math.max(0, Math.min(NG, lerp(0, NG, (y + 14) / 30)))

// ── Wings and nave ──
const NW = { x0: -7.1, x1: 7.6, y0: 2.0, y1: 13.6 }
const SW = { x0: -7.7, x1: 7.0, y0: -13.55, y1: -5.5 }
const NV = { x0: -9.35, x1: 9.0, y0: -6.1, y1: 2.7 }
box(white, NW.x0, NW.x1, NW.y0, NW.y1, 0, EAVE, null, 0)
box(white, SW.x0, SW.x1, SW.y0, SW.y1, 0, EAVE, null, 0)
box(white, NV.x0, NV.x1, NV.y0, NV.y1, 0, EAVE, null, 0)
gableRoof(roof, white, NW.x0, NW.x1, NW.y0, NW.y1, EAVE, 10.7, 'y', 0.35, 0.3)
gableRoof(roof, white, SW.x0, SW.x1, SW.y0, SW.y1, EAVE, 10.7, 'y', 0.35, 0.3)
gableRoof(roof, white, NV.x0, NV.x1, NV.y0, NV.y1, EAVE, 11.1, 'x', 0.35, 0.3)
// boxed cornices along the eaves
for (const r of [NW, SW, NV]) box(white, r.x0 - 0.2, r.x1 + 0.2, r.y0 - 0.2, r.y1 + 0.2, EAVE - 0.35, EAVE, null, 0)

// ── Chancel at the south end ──
{
  const ring: XY[] = [[-3.6, -13.55], [-2.64, -14.83], [-1.21, -15.45], [1.0, -15.68], [2.6, -15.0], [3.58, -13.55]].reverse() as XY[]
  const r2: XY[] = [[3.58, -13.55], [2.6, -15.0], [1.0, -15.68], [-1.21, -15.45], [-2.64, -14.83], [-3.6, -13.55]]
  void ring
  const ccwRing: XY[] = [...r2].reverse()
  prism(white, ccwRing, 0, 5.2, null, 0)
  const apex: V3 = [0, -13.55, 7.4]
  for (let i = 0; i < ccwRing.length - 1; i++) {
    const a = ccwRing[i], b = ccwRing[i + 1]
    const o = (p: XY): V3 => [p[0] * 1.06, -13.55 + (p[1] + 13.55) * 1.12, 5.1]
    roof.tri(o(a), o(b), apex)
  }
}

// ── Windows and doors ──
function shuttered(f: F, s: number, z0: number, w: number, h: number) {
  onWall(white, f[0], f[1], rectShape(s - w / 2 - 0.12, s + w / 2 + 0.12, z0 - 0.15, z0 + h + 0.2), 0.04)
  onWall(win, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z0 + h), 0.07)
  for (const k of [-1, 1]) onWall(dark, f[0], f[1], rectShape(s + k * (w / 2 + 0.12), s + k * (w / 2 + 0.12 + w * 0.5), z0, z0 + h), 0.07)
}
function door(f: F, s: number, z0: number, w: number, h: number, p: Part) {
  onWall(white, f[0], f[1], rectShape(s - w / 2 - 0.18, s + w / 2 + 0.18, z0, z0 + h + 0.25), 0.04)
  onWall(p, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z0 + h), 0.08)
}
// north gable front, either side of the tower
{
  const f: F = [[NW.x0, NW.y1], [NW.x1, NW.y1]].reverse() as F // outside +y: run east to west
  const sAt = (x: number) => NW.x1 - x
  for (const x of [-4.6, 5.0]) {
    door(f, sAt(x), NG, 1.2, 2.3, white)
    onWall(dark, f[0], f[1], rectShape(sAt(x) - 0.6, sAt(x) + 0.6, NG + 2.3, NG + 2.32), 0.09)
    shuttered(f, sAt(x), NG + 3.6, 1.0, 1.45)
  }
}
// long sides of the north wing, the nave's gable ends and side bits, the south wing
for (const [f, ss] of [
  [[[NW.x1, NW.y0 + 0.7], [NW.x1, NW.y1]], [3.4, 8.2]],
  [[[NW.x0, NW.y1], [NW.x0, NW.y0 + 0.7]], [2.7, 7.5]],
  [[[SW.x1, SW.y0], [SW.x1, NV.y0]], [2.4, 5.6]],
  [[[SW.x0, NV.y0], [SW.x0, SW.y0]], [2.4, 5.6]],
] as [F, number[]][]) {
  for (const s of ss) {
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
    const y = lerp(f[0][1], f[1][1], s / L)
    shuttered(f, s, g(y) + 1.6, 1.1, 3.2)
  }
}
for (const f of [[[NV.x1, NV.y0], [NV.x1, NV.y1]], [[NV.x0, NV.y1], [NV.x0, NV.y0]]] as F[]) {
  const L = NV.y1 - NV.y0
  for (const s of [L / 2 - 2.0, L / 2 + 2.0]) shuttered(f, s, g(-2) + 1.6, 1.1, 3.2)
  onWall(white, f[0], f[1], archShape(L / 2, 1.0, 8.4, 8.9, 8), 0.05) // a small gable light
  onWall(win, f[0], f[1], archShape(L / 2, 0.75, 8.5, 8.9, 8), 0.08)
}
for (const f of [[[NV.x1, NV.y1], [NW.x1, NV.y1]], [[NW.x0, NV.y1], [NV.x0, NV.y1]], [[NV.x0, NV.y0], [SW.x0, NV.y0]], [[SW.x1, NV.y0], [NV.x1, NV.y0]]] as F[]) {
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
  if (L > 1.9) shuttered(f, L / 2, g(0) + 1.6, 0.8, 3.0)
}
// south gable over the chancel
{
  const f: F = [[SW.x0, SW.y0], [SW.x1, SW.y0]]
  const L = SW.x1 - SW.x0
  onWall(white, f[0], f[1], archShape(L / 2 + 0.35, 1.6, 5.6, 7.6, 10), 0.04)
  onWall(win, f[0], f[1], archShape(L / 2 + 0.35, 1.3, 5.75, 7.6, 10), 0.08)
}

// ── Tower ──
{
  const cx = 0.2, cy = 15.45, Y0 = 13.3
  const S1 = 12.4, S2 = 15.8, S3 = 19.5, LAN0 = 19.8, LAN1 = 22.3
  const sq = (h: number, z0: number, z1: number, p = white, bev = 0.08, yLo = cy - h) => box(p, cx - h, cx + h, yLo, cy + h, z0, z1, p, bev)
  const faces = (h: number): F[] => [
    [[cx + h, cy + h], [cx - h, cy + h]], [[cx + h, cy - h], [cx + h, cy + h]], [[cx - h, cy + h], [cx - h, cy - h]],
  ]
  // shaft (its back runs into the gable), cornice with a little pediment-like ledge
  sq(2.0, 0, S1, white, 0, Y0)
  sq(2.35, S1, S1 + 0.55, white, 0.15, Y0)
  // corner boards
  for (const sx of [-1, 1]) box(white, cx + sx * 2.0 - 0.13, cx + sx * 2.0 + 0.13, cy + 2.0 - 0.26, cy + 2.13, NG, S1, null, 0)
  // stage 2: round louvred oculus
  sq(1.75, S1 + 0.55, S2, white, 0)
  sq(2.05, S2, S2 + 0.45, white, 0.12)
  const ring = (s: number, z: number, r: number, n = 14) => Array.from({ length: n }, (_, i) => [s + r * Math.cos((i / n) * Math.PI * 2), z + r * Math.sin((i / n) * Math.PI * 2)] as [number, number])
  for (const [a, b] of faces(1.75)) {
    onWall(white, a, b, ring(1.75, 14.2, 0.62), 0.05)
    onWall(dark, a, b, ring(1.75, 14.2, 0.48), 0.08)
  }
  // stage 3: belfry with a louvred opening
  sq(1.55, S2 + 0.45, S3, white, 0)
  sq(1.85, S3, S3 + 0.4, white, 0.1)
  for (const [a, b] of faces(1.55)) {
    onWall(white, a, b, rectShape(0.95, 2.15, 16.8, 18.9), 0.05)
    onWall(dark, a, b, rectShape(1.1, 2.0, 16.95, 18.75), 0.08)
  }
  // octagonal lantern, louvred, with its cornice, cap and cross
  revolve(white, [cx, cy], [[1.35, S3 + 0.4], [1.35, LAN1], [1.6, LAN1], [1.6, LAN1 + 0.3], [1.1, LAN1 + 0.45], [0.35, 22.75], [0, 22.8]], 8, Math.PI / 8, true, true)
  for (let i = 0; i < 4; i++) {
    const a0 = Math.PI / 8 + (i * 2 + 0.5) * (Math.PI / 4) - Math.PI / 8
    const r = 1.35 * Math.cos(Math.PI / 8)
    const c: XY = [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r]
    const t: XY = [-Math.sin(a0), Math.cos(a0)]
    const a: XY = [c[0] - t[0] * 0.4, c[1] - t[1] * 0.4], b: XY = [c[0] + t[0] * 0.4, c[1] + t[1] * 0.4]
    onWall(dark, b, a, rectShape(0.1, 0.7, 20.3, 21.9), 0.04)
  }
  box(dark, cx - 0.07, cx + 0.07, cy - 0.07, cy + 0.07, 22.75, 23.85, dark, 0)
  box(dark, cx - 0.4, cx + 0.4, cy - 0.07, cy + 0.07, 23.25, 23.4, dark, 0)
  // the main door with its transom, the lamp, the window over it
  const f: F = [[cx + 2.0, cy + 2.0], [cx - 2.0, cy + 2.0]]
  door(f, 2.0, NG, 1.45, 2.6, dark)
  onWall(white, f[0], f[1], rectShape(1.1, 2.9, NG + 2.85, NG + 3.25), 0.06)
  onWall(win, f[0], f[1], rectShape(1.35, 2.65, NG + 2.95, NG + 3.45), 0.09)
  onWall(white, f[0], f[1], rectShape(1.4, 2.6, NG + 5.4, NG + 6.8), 0.04)
  onWall(win, f[0], f[1], rectShape(1.55, 2.45, NG + 5.55, NG + 6.65), 0.08)
}

const lit = () => 0.8
await save('ric-st-johns-church', "St. John's Church", [
  { part: white, material: { ...finish('sjc-white', 0xf3efe7), floodlight: lit } },
  { part: roof, material: finish('sjc-roof', 0x8f979e) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('sjc-shutter', 0x4a4f57) },
], { height: 23.85, anchor: [37.5313448, -77.4196653], bearing: 0.69 })
