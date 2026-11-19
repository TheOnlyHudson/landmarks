/**
 * Frist Art Museum, Nashville (1933–34, Marr & Holman, as the U.S. Post
 * Office; museum since 2001) — original procedural geometry, CC0-1.0.
 * bun generators/nash-frist-art-museum.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332, so +y
 * points out of the Broadway front and +x runs toward 9th Avenue. Anchor =
 * area centroid of OSM way/130905893, 36.157612, -86.783628. y = 0 is the
 * lowest ground under the footprint (the west side, lidar ground_min +
 * 0.4); the Broadway pavement is 3.5 m higher, the east side ~1.6, the
 * rear yard ~4.5.
 *
 * Identity, in order: the long white-marble Broadway front, stripped
 * classical: nine tall dark windows between ten broad fluted pilasters
 * under a plain frieze and the museum sign; the two end pavilions, a
 * little proud and taller with a raised attic, each with a granite
 * entrance surround, an aluminium grille over the doors, three small
 * windows and four reeded ribs above; tall narrow windows in the outer
 * bays; aluminium hexagon grilles beside the pavilions; the plain sides
 * of tall two-storey windows over a granite base; the attic blocks on the
 * roof; the one-storey dock wing behind.
 *
 * Evidence:
 *  - plan: OSM way/130905893 (main block 76 x 55 m, pavilions 11.1 m
 *    wide and 1.7 m proud, the stepped rear wing), checked against the
 *    lidar: they agree to under a metre.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 0.5 m grid in
 *    the model frame, above y = 0: main parapet 19.1; pavilions 22.0 with
 *    an attic to 22.5; gallery clerestory 23.1; rear attic blocks 26.8 and
 *    24.8; plant 21.9; rear wing 8.0 with a raised dock canopy 10.6.
 *    Measured.
 *  - bays and storeys: from LeMay's square views of the front (54384482124)
 *    and the east pavilion (54384482279), scaled to the lidar (bay 3.6 m,
 *    windows 6.0–15.0, entrance surround 6.2 x 9.2 m); sides from LeMay's
 *    east view (54384665765), eleven bays; rear from Ed!'s photo.
 *    Estimated.
 *  - colours: white Georgia marble (sampled grey-white, kept pale), grey
 *    granite base and surrounds, aluminium grilles and sign.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Old Nashville Post Office (Frist Art Museum), Broadway and 9th Avenue,
 *    Nashville, TN (54384482124), (54384482279), (54384665765) and the rest
 *    of the set, Warren LeMay, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Old_Nashville_Post_Office_(Frist_Art_Museum),_Broadway_and_9th_Avenue,_Nashville,_TN_(54384482124).jpg
 *    https://commons.wikimedia.org/wiki/File:Old_Nashville_Post_Office_(Frist_Art_Museum),_Broadway_and_9th_Avenue,_Nashville,_TN_(54384482279).jpg
 *    https://commons.wikimedia.org/wiki/File:Old_Nashville_Post_Office_(Frist_Art_Museum),_Broadway_and_9th_Avenue,_Nashville,_TN_(54384665765).jpg
 *  - Frist Center for the Visual Arts (Northeast face), (Northwest face),
 *    Michael Rivera, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Frist_Center_for_the_Visual_Arts_(Northeast_face).JPG
 *  - Frist Center Nashville TN USA.JPG, Ed!, CC BY-SA 3.0 (the rear)
 *    https://commons.wikimedia.org/wiki/File:Frist_Center_Nashville_TN_USA.JPG
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow; the pavilion doors are `entrance`; the Broadway
 * front carries a light floodlight.
 *
 * Left out: the carved frieze ornament, eagles, reeding on the pilasters,
 * the sign's lettering (a plain box), banners, lamps, the front areaway
 * wall and steps (ground).
 *
 * Doubts: the west side is seen only obliquely and is drawn as the east;
 * the side entrance canopy's position is estimated; the rear wing's
 * raised canopy is drawn as a plain block.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, box, save } from './atl-westin-peachtree-plaza'
import { rectOn, band, block, type Face } from './nash-ryman-auditorium'
import { wf, rect, type Side } from './nash-downtown-presbyterian'

// Model frame, bearing 332: +y out of the Broadway front. z above y = 0 = lidar ground_min + 0.4.
const AX = 1.0 // the façade axis
const X0 = -37.3, X1 = 38.9, YF = 30.8, YR = -24.6, YP = 32.5
const PAV = 11.1 // pavilion width
const PX = [-25.45, 27.45] // pavilion centres (OSM)
const TOP = 19.1, PTOP = 22.0, STREET = 3.5, BASE = 5.0

function build() {
  const marble = new Part(), granite = new Part(), win = new Part(), grille = new Part(), roof = new Part(), door = new Part()

  // ── Massing ──
  prism(granite, rect(X0 - 0.15, YR - 0.15, X1 + 0.15, YF + 0.15), 0, BASE, granite, 0.05)
  prism(marble, rect(X0, YR, X1, YF), BASE, TOP, roof, 0.3)
  // the pavilions on Broadway, a little proud and taller, with a raised attic
  for (const cx of PX) {
    const x0 = cx - PAV / 2, x1 = cx + PAV / 2
    prism(granite, rect(x0 - 0.1, YF - 1, x1 + 0.1, YP + 0.1), 0, BASE, granite, 0.05)
    prism(marble, rect(x0, YF - 1, x1, YP), BASE, PTOP, roof, 0.3)
    box(marble, cx - 4.7, cx + 4.7, YF - 4, YP - 0.4, PTOP - 0.1, PTOP + 0.6, roof, 0.1)
  }
  // roof monitors: the gallery clerestory, the rear attic and plant
  box(marble, -20, 23, 10, 17, TOP - 0.3, 23.1, roof, 0.2)
  box(marble, -23, -1, -17, -8, TOP - 0.3, 26.8, roof, 0.2)
  box(marble, -1, 24, -17, -8, TOP - 0.3, 24.8, roof, 0.2)
  box(roof, 24.5, 36.5, -9, -2, TOP - 0.3, 21.9, roof, 0.2)
  // the one-storey rear wing (loading dock) and its raised canopy
  prism(marble, [[X0 + 0.3, YR + 0.2], [X0 + 0.3, -30.4], [-29.4, -30.4], [-29.4, -32.3], [-22, -32.3], [-22, -34.3], [-5, -34.3], [-5, -32.3], [2.3, -32.3], [2.3, -31.2], [27.4, -31.2], [27.4, YR + 0.2]] as [number, number][], 0, 8.0, roof, 0.2)
  box(marble, -28.5, -3, -33.6, -27.5, 7.5, 10.6, roof, 0.15)

  // ── Faces ──
  const N = wf('N', YF, X0, X1), S = wf('S', YR, X0, X1), E = wf('E', X1, YR, YF), W = wf('W', X0, YR, YF)
  for (const { f } of [N, S, E, W]) {
    band(granite, f, 0, f.L, BASE - 0.3, BASE, 0.08)
    band(marble, f, 0.3, f.L - 0.3, 17.6, 18.1, 0.12) // the carved frieze band
    band(marble, f, 0, f.L, TOP - 0.8, TOP - 0.3, 0.25) // cornice
  }
  // Broadway colonnade: nine tall windows between ten fluted pilasters
  {
    const { f, s } = N
    for (let k = -4; k <= 4; k++) {
      const x = AX + k * 3.6
      rectOn(win, f, s(x) - 0.85, s(x) + 0.85, 6.0, 15.0, 0.06)
      rectOn(marble, f, s(x) - 0.85, s(x) + 0.85, 10.5, 10.85, 0.08) // transom between the two storeys
    }
    for (let k = -4.5; k <= 4.5; k++) {
      const x = AX + k * 3.6
      band(marble, f, s(x) - 0.88, s(x) + 0.88, BASE, 15.3, 0.35)
      band(marble, f, s(x) - 0.98, s(x) + 0.98, 15.3, 15.9, 0.47)
    }
    // the museum sign over the colonnade
    band(grille, f, s(AX) - 6.6, s(AX) + 6.6, 16.2, 17.3, 0.25)
    // aluminium hexagon grilles beside the pavilions
    for (const x of [PX[0] + PAV / 2 + 1.4, PX[1] - PAV / 2 - 1.4]) {
      rectOn(grille, f, s(x) - 0.4, s(x) + 0.4, 12.4, 15.0, 0.06)
      rectOn(grille, f, s(x) - 0.4, s(x) + 0.4, 6.3, 10.6, 0.06)
    }
    // the outer bays: one tall narrow window each
    for (const x of [(X0 + PX[0] - PAV / 2) / 2, (X1 + PX[1] + PAV / 2) / 2]) {
      rectOn(marble, f, s(x) - 1.1, s(x) + 1.1, 5.6, 16.0, 0.03)
      rectOn(win, f, s(x) - 0.8, s(x) + 0.8, 5.9, 15.7, 0.07)
    }
  }
  // the pavilion fronts: granite entrance surround, grille, doors, three windows, reeded ribs
  for (const cx of PX) {
    const { f, s } = wf('N', YP, cx - PAV / 2, cx + PAV / 2)
    const m = s(cx)
    band(granite, f, m - 3.1, m + 3.1, STREET, 12.7, 0.45)
    rectOn(grille, f, m - 2.15, m + 2.15, 7.6, 11.7, 0.5)
    rectOn(door, f, m - 2.0, m + 2.0, STREET + 0.3, 7.3, 0.5)
    for (const k of [-2.2, 0, 2.2]) rectOn(win, f, m + k - 0.6, m + k + 0.6, 13.6, 16.0, 0.06)
    for (const k of [-3.3, -1.1, 1.1, 3.3]) band(marble, f, m + k - 0.3, m + k + 0.3, 16.3, 20.6, 0.18)
    for (const k of [-1, 1]) band(marble, f, m + k * 3.75 - 0.35, m + k * 3.75 + 0.35, STREET, 12.0, 0.25) // fluted jambs
    band(marble, f, 0.2, f.L - 0.2, 17.6, 18.1, 0.12)
    band(marble, f, 0, f.L, PTOP - 0.8, PTOP - 0.3, 0.25)
  }
  // the long sides: eleven bays of tall two-storey windows, a pavilion-side window at the front
  for (const [{ f, s }, d] of [[E, 'E'], [W, 'W']] as [{ f: Face; s: (u: number) => number }, Side][]) {
    for (let k = 0; k < 11; k++) {
      const y = -21.2 + k * 4.3
      rectOn(win, f, s(y) - 0.95, s(y) + 0.95, 6.0, 16.4, 0.06)
      rectOn(marble, f, s(y) - 0.95, s(y) + 0.95, 10.6, 11.4, 0.08)
      rectOn(win, f, s(y) - 0.6, s(y) + 0.6, 1.4, 3.6, 0.06) // basement
    }
    rectOn(win, f, s(27.3) - 0.8, s(27.3) + 0.8, 5.9, 15.7, 0.06)
    if (d === 'E') {
      // the side entrance under a flat canopy
      const y = -5.5
      rectOn(door, f, s(y) - 1.8, s(y) + 1.8, 2.0, 4.8, 0.08)
      box(grille, X1, X1 + 3.2, y - 4, y + 4, 5.3, 5.9, grille, 0.1)
    }
  }
  // the rear: a row of tall windows over the dock
  {
    const { f, s } = S
    for (let x = -34; x <= 36; x += 4.67) rectOn(win, f, s(x) - 0.9, s(x) + 0.9, 8.6, 16.4, 0.06)
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] > YF - 0.5 && n[1] > 0.5 ? 0.55 : 0)
  return [
    { part: marble, material: { ...finish('frist-marble', 0xe4e2dc), floodlight: flood } },
    { part: granite, material: finish('frist-granite', 0xb2b0aa) },
    { part: win, material: PALETTE.window },
    { part: grille, material: finish('frist-aluminium', 0x8e9296) },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  await save('nash-frist-art-museum', 'Frist Art Museum', build(), { height: 26.8, anchor: [36.157612, -86.783628], bearing: 332 })
}
