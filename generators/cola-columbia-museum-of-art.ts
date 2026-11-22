/**
 * Columbia Museum of Art (opened 1998 in the converted Belk department
 * store, Main and Hampton Streets; entrance on Boyd Plaza), Columbia, SC —
 * original procedural geometry, CC0-1.0.
 * bun generators/cola-columbia-museum-of-art.ts
 *
 * Map frame: x east, y north, z up, metres; built in a frame turned to the
 * downtown grid, bearing 70 (+y toward 70°, toward Main Street; +x toward
 * 160°, toward Hampton Street and Boyd Plaza). Anchor = centroid of OSM
 * way/110410022 ("Columbia Museum of Art", building=public, 2 levels),
 * 34.005918, -81.036194.
 *
 * Identity: a broad block of red-brown brick banded with pale courses, a
 * pale top band, big gridded window bays; on the Boyd Plaza side a white
 * two-storey aluminium frame entrance porch (four bays of square piers on
 * grey stone bases, with red squares at the joints) in front of a glass
 * wall, crowned by a white flared "funnel" canopy, wider at its rim than at
 * its foot and open toward the plaza.
 *
 * Evidence:
 *  - plan: OSM way/110410022, simplified (the 1 m jog on the west side
 *    dropped). Its 6 m bump on the plaza side (x 30.6..36.4,
 *    y 5.6..20.5) is the entrance porch.
 *  - heights: USGS 3DEP SC_SavannahPeeDee_5_2019 (2019 flight), 1 m grid,
 *    read at 4 m in the frame. Measured: main roof 12.2 m; the Main Street
 *    block (y 22..36) 17.3 m; the lantern and funnel's flat top 15.6 m over
 *    x 4..36, y 6..20. The funnel's rim is drawn at 16.0 m (0.4 m over the
 *    lidar) and its foot at 10.6 m, so it stands clear of the 12.2 m roof
 *    and reads at phone size. Porch beam heights (about 7 and 11.6 m) and the
 *    funnel's foot (11.6 m) estimated from Akhenaton06's photo, scaled to the
 *    15 m porch width.
 *  - bays, frame, colours: the two photos below. Brick red-brown pulled to
 *    the palette's lightness; frame and funnel white; pier bases and the
 *    door block grey stone.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - ColumbiaMuseumofArt.jpg (plaza front, from the south-east),
 *    Akhenaton06, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:ColumbiaMuseumofArt.jpg
 *  - Columbia Museum of Art entrance.jpg (the porch close up), Soulbust,
 *    CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Columbia_Museum_of_Art_entrance.jpg
 * Plan check: USGS NAIP orthophoto (public domain). No look-only sources.
 * No commercial imagery.
 *
 * Doubts: the Main Street and west faces are unphotographed and drawn as
 * plain banded brick with a few window bays; the red joint squares, the
 * lettering and the plaza canopies (OSM building=roof ways 1331846557 and
 * 1343107993, separate structures) are left out; the funnel's underside is
 * simplified to two sloped planes and a back wall.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, prism, save, type XY } from './atl-flatiron-building'
import { rectOn } from './cola-palmetto-building'

const brick = new Part(), white = new Part(), win = new Part(), roof = new Part(), stone = new Part(), door = new Part()

// Counter-clockwise ring, the porch bump left out (the glass wall at x 30.6).
const ring: XY[] = [
  [-36.6, -35.5], [8.1, -35.4], [8.1, -25.0], [30.6, -25.0], [30.6, 36.1],
  [-22.2, 36.1], [-22.2, -5.0], [-36.6, -5.0],
]
const ROOF = 12.2, MAIN = 17.3

// ── Brick blocks ──
prism(brick, ring, 0, ROOF - 1.4, null, 0)
prism(white, ring, ROOF - 1.4, ROOF, roof, 0.2) // pale top band
const mainBlock: XY[] = [[-22.2, 22.0], [30.6, 22.0], [30.6, 36.1], [-22.2, 36.1]]
prism(brick, mainBlock, ROOF, MAIN - 1.4, null, 0)
prism(white, mainBlock, MAIN - 1.4, MAIN, roof, 0.2)
// Pale brick courses.
for (const z of [3.4, 6.8]) cornice(white, ring, z, 0.45, 0.05, null)
cornice(white, mainBlock, 14.0, 0.45, 0.05, null)

// Window bays: tall gridded panels, two storeys, with a pale frame line.
const bay = (a: XY, b: XY, s: number, w: number, z0 = 0.8, z1 = 10.2) => {
  rectOn(white, a, b, s - w / 2 - 0.3, s + w / 2 + 0.3, z0 - 0.3, z1 + 0.3, 0.04)
  rectOn(win, a, b, s - w / 2, s + w / 2, z0, z1, 0.08)
}
// Plaza (Hampton) side, x = 30.6: two bays south of the porch, one by the corner; glass wall behind the porch.
const pA: XY = [30.6, -25.0], pB: XY = [30.6, 36.1]
for (const s of [3.0, 16.5, 23.0]) bay(pA, pB, s, 4.0)
rectOn(win, pA, pB, 30.6, 45.5, 0.4, 11.4, 0.08)
bay(pA, pB, 54.0, 4.0, 13.0, 15.4) // upper window of the Main Street block
// Main Street face, y = 36.1.
const mA: XY = [30.6, 36.1], mB: XY = [-22.2, 36.1]
for (const s of [8, 18, 26.4, 34.8, 44]) bay(mA, mB, s, 4.4, 0.8, 10.2)
for (const s of [18, 34.8]) bay(mA, mB, s, 4.4, 12.6, 15.4)
// South (-y) and west faces: a few bays.
const sA: XY = [-36.6, -35.5], sB: XY = [8.1, -35.4]
for (const s of [10, 22, 34]) bay(sA, sB, s, 3.6)
const wA: XY = [8.1, -25.0], wB: XY = [30.6, -25.0]
for (const s of [7, 15.5]) bay(wA, wB, s, 3.6)

// ── Entrance porch: a white square frame in front of the glass wall ──
const FX = 36.0, PW = 0.9 // front face, pier width
const piers = [6.1, 10.9, 15.2, 20.0] // y of each pier centre (the middle bay wider)
for (const y of piers) {
  for (const x of [FX - PW / 2, 32.6]) {
    box(stone, x - PW / 2, x + PW / 2, y - PW / 2, y + PW / 2, 0, 3.0, null, 0)
    box(white, x - PW / 2, x + PW / 2, y - PW / 2, y + PW / 2, 3.0, 11.6, white, 0.15)
  }
}
// Beams: across the front at mid height and the top; ties back to the wall.
for (const [z0, z1] of [[6.6, 7.6], [10.6, 11.6]]) {
  for (const x of [FX - PW, 32.6 - PW / 2]) box(white, x, x + PW, 5.6, 20.5, z0, z1, white, 0.15)
  for (const y of piers) box(white, 30.6, FX - PW, y - PW / 2, y + PW / 2, z0, z1, white, 0.1)
}
// The glass wall of the porch, two storeys, set just behind the back
// row of piers so the white frame reads against it.
box(win, 30.6, 32.0, 5.6, 20.5, 0, 11.6, roof, 0)
// The stone door block in the middle bay, its glazed doors facing the plaza.
box(stone, 32.0, 34.2, 11.4, 14.7, 0, 5.2, roof, 0.2)
rectOn(door, [34.2, 11.4], [34.2, 14.7], 0.4, 2.9, 0.1, 3.4, 0.06)

// ── The lantern and the funnel canopy ──
// The lantern: the flat-topped hall the lidar shows at 15.6 m over
// x 4..30, y 6..20, rising over the 12.2 m roof.
const yc = 13.05
box(white, 4.0, 30.6, yc - 7.0, yc + 7.0, ROOF - 0.2, 15.6, roof, 0.2)
// The funnel: a flared white hopper over the porch, its foot on the
// porch's top beam (10.6 m), its rim 17 m wide at 16 m, open toward the
// plaza; inside, two pale side soffits and a sloped back plane with a
// glazed slot along its foot (Akhenaton06's photo).
{
  const X0 = 27.0, X1 = 37.6, Z0 = 10.6, Z1 = 16.0, LIP = 0.6
  const r0 = 4.0, r1 = 8.5
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  // Outer shell: flat top, sloped flanks, back end, underside.
  roof.quad(P(X0, yc - r1, Z1), P(X1, yc - r1, Z1), P(X1, yc + r1, Z1), P(X0, yc + r1, Z1))
  white.quad(P(X0, yc - r0, Z0), P(X1, yc - r0, Z0), P(X1, yc - r1, Z1), P(X0, yc - r1, Z1))
  white.quad(P(X1, yc + r0, Z0), P(X0, yc + r0, Z0), P(X0, yc + r1, Z1), P(X1, yc + r1, Z1))
  white.quad(P(X0, yc + r0, Z0), P(X0, yc - r0, Z0), P(X0, yc - r1, Z1), P(X0, yc + r1, Z1))
  roof.quad(P(X1, yc - r0, Z0), P(X0, yc - r0, Z0), P(X0, yc + r0, Z0), P(X1, yc + r0, Z0))
  // The rim round the open front.
  const o = [P(X1, yc - r0, Z0), P(X1, yc + r0, Z0), P(X1, yc + r1, Z1), P(X1, yc - r1, Z1)]
  const i = [P(X1, yc - r0 + LIP, Z0 + LIP), P(X1, yc + r0 - LIP, Z0 + LIP), P(X1, yc + r1 - LIP * 1.6, Z1 - LIP), P(X1, yc - r1 + LIP * 1.6, Z1 - LIP)]
  white.quad(o[0], o[1], i[1], i[0]); white.quad(o[1], o[2], i[2], i[1]); white.quad(o[2], o[3], i[3], i[2]); white.quad(o[3], o[0], i[0], i[3])
  // The hollow: its back plane slopes from the foot near the front up to
  // the top at the back, so from the plaza it is a big pale surface.
  const XB = X1 - 1.2, XT = X0 + 1.2
  const k = [P(XB, i[0][1], i[0][2]), P(XB, i[1][1], i[1][2]), P(XT, i[2][1], i[2][2]), P(XT, i[3][1], i[3][2])]
  white.quad(i[1], i[2], k[2], k[1]) // +y soffit
  white.quad(i[3], i[0], k[0], k[3]) // -y soffit
  white.quad(i[2], i[3], k[3], k[2]) // ceiling
  white.quad(i[0], i[1], k[1], k[0]) // floor
  const lerp = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
  const m0 = lerp(k[0], k[3], 0.22), m1 = lerp(k[1], k[2], 0.22)
  win.quad(k[0], k[1], m1, m0) // the glazed slot
  white.quad(m0, m1, k[2], k[3]) // the sloped back plane
}

await save('cola-columbia-museum-of-art', 'Columbia Museum of Art', [
  { part: brick, material: finish('cma-brick', 0xb07a68) },
  { part: white, material: finish('cma-white', 0xf3f1ec) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: stone, material: finish('cma-stone', 0xcfc8bb) },
  { part: door, material: PALETTE.entrance },
], { height: MAIN, anchor: [34.005918, -81.036194], bearing: 70 })
