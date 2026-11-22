/**
 * Science Museum of Virginia (Broad Street Station), Richmond — procedural,
 * CC0-1.0, no textures.
 * bun generators/ric-science-museum.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/252997396 (lng -77.4656202, lat 37.5614941). The
 * walls run at 37° and 127° (the station sits square to Broad Street's
 * grid), so the model is placed at bearing 37 and built square: model
 * "south" is the Broad Street front (world SW), model "north" the tracks.
 *
 * What it is: John Russell Pope's Broad Street Station (1917–19), a Roman
 * Doric station of buff limestone: a long two-storey block with a projecting
 * central pavilion (six Doric columns in antis between two end bays, each
 * with an arched door, a tall attic over the cornice) and a low saucer dome
 * on a square, chamfered drum with a lunette in each face. Iron canopies run
 * along the wings. Behind it, down at track level, the old concourse runs
 * north over the platforms as a tall plain block with a low gable, and on
 * the west a low block carries the museum's white geodesic Dome theatre.
 *
 * Covers and replaces: way/252997396 (the outline: station, west block,
 * concourse and the north-east block) and its building:parts way/334113909
 * (the dome), way/334113910 (the dome's base) and way/334113913 (the
 * geodesic dome), and the two canopies way/334113925 and way/334113955
 * (building=roof).
 *
 * Evidence
 * - OSM (measured): outline and parts, read in the bearing-37 frame. Main
 *   block x -26.7..49.4, y -62..-30 (axis x = 11.35); pavilion x -10.4..33.1
 *   projecting to y -69; dome part 28 m square about (11.4, -43.6); geodesic
 *   dome part about (-42, -9), 29 m across.
 * - USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014), 1 m grid,
 *   read every 5 m in this frame (measured; model z = lidar - 0.7, the track
 *   level under the rear being the lowest ground): Broad Street plaza 5.5;
 *   main roof and pavilion cornice 20.5 (15 m above the plaza); attic 22.5;
 *   drum top 28.8; dome crown 37.9; canopies 9.7 (4.2 m over the plaza);
 *   west block roof 10.3; geodesic dome crown 19.0, its base 30 m across;
 *   concourse eaves 19.6, ridge about 22.3; block east of the concourse 9.7.
 *   The terrain grid (Mapterhorn) agrees: the front stands about 6 m above
 *   the track level behind.
 * - Photos (Wikimedia Commons, EVIDENCE; each at
 *   https://commons.wikimedia.org/wiki/File:<name with underscores>):
 *   "Science Museum of Virginia 20070916.jpg" (Coredesat, CC BY 3.0), the
 *   Broad Street front, frontal: six columns in antis, end bays with arched
 *   doors and a window over, cornice level with the wings' parapet, attic,
 *   drum and dome; column spacing 4.4 m, columns 10.4 m, attic 3.7 m, the
 *   arched doors 3.5 m wide, all scaled to OSM's 43.5 m pavilion;
 *   "Science Museum of Virginia (26479711253).jpg" (Eli Christman, CC BY
 *   2.0), the east side at dusk: six bays of tall paired windows over a
 *   ground storey under the iron canopy, the dome's grey ribbed metal;
 *   "Rear view of the Science Museum of Virginia.jpg" (Rifleman 82, CC BY-SA
 *   4.0), from across the tracks: the tall plain gabled concourse block,
 *   the drum's lunette, the white geodesic dome.
 * - USGS NAIP (public domain): the plan, pale roofs, the grey dome, the
 *   white geodesic dome, the north-east block's white roof.
 * - Colours from the photos: buff-grey limestone (pulled to the palette's
 *   lightness), grey ribbed dome, near-black iron canopies, white geodesic.
 * - Estimated: the portico's depth (back wall 5.7 m behind the pavilion
 *   face); window heights on the sides (from the east-side photo); the
 *   concourse's side windows; the north-east block (x -6.5..28.9,
 *   y 52..107): the 2014 lidar shows nothing there, so it is newer than the
 *   flight or low; drawn as a plain 8 m block from its NAIP shadow. Its
 *   faces are not photographed here (doubt).
 * - Simplified: canopies are flat slabs on a few posts; no triglyphs,
 *   inscriptions, clock, lamp standards; the geodesic dome is a smooth cap.
 * - Night: the front and sides are floodlit (coloured uplights in the
 *   photo); the stone carries a floodlight wash, strongest on the front.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, panel, rect, block, gable, arc, type Side, type XY as XY2 } from './dc-white-house'
import { saveModel, pslab, lathe, roundColumn, ppanel, pcap, type XY, type Mat } from './dc-nga-west'

const stone = new Part(), roof = new Part(), win = new Part(), dome = new Part(), iron = new Part(), geo = new Part()

// ---- Plan (OSM, bearing-37 frame)
const AX = 11.35 // the station's axis
const MX0 = -26.7, MX1 = 49.4, MY0 = -62, MY1 = -30 // main block
const PX0 = -10.4, PX1 = 33.1, PY0 = -69 // pavilion
const EB = 7.4 // end bay width
// ---- Heights (lidar, above the track level)
const FG = 5.5 // Broad Street plaza
const ROOF = 20.5, CORN = 19.7, ATTIC = 22.6
const DRUM = 27.8, DRUM_TOP = 28.8, CROWN = 37.9

// ===========================================================================
// Main block: walls to the cornice, a bevelled cornice band, a low parapet.
const main = rect(MX0, MX1, MY0, MY1)
cbox(stone, main, 0, CORN, { top: false })
cbox(stone, grow(main, 0.5), CORN, CORN + 0.5, { b: 0.25, bottom: true, top: false })
cbox(stone, main, CORN + 0.5, ROOF, { b: 0.2, top: roof })

// Pavilion: solid end bays, the portico between, attic over the whole front.
const pav = rect(PX0, PX1, PY0, MY0 + 0.1)
for (const [a, b] of [[PX0, PX0 + EB], [PX1 - EB, PX1]] as [number, number][]) {
  cbox(stone, rect(a, b, PY0, MY0 + 0.1), 0, CORN, { top: false })
}
// portico floor (the stylobate) and its steps
cbox(stone, rect(PX0 + EB, PX1 - EB, PY0, MY0), 0, FG + 0.6, { b: 0.15, top: roof })
cbox(stone, rect(AX - 8, AX + 8, PY0 - 2.4, PY0), 0, FG + 0.3, { b: 0.1, top: roof })
// entablature over the portico (its underside is the ceiling)
const YPW = PY0 + 5.7 // portico back wall
cbox(stone, rect(PX0 + EB, PX1 - EB, PY0, YPW), FG + 11, CORN, { bottom: true, top: false })
// back wall of the portico: five tall windows, doors in the middle three
const cols = [-11, -6.6, -2.2, 2.2, 6.6, 11].map((d) => AX + d)
for (let k = 0; k < 5; k++) {
  const m = (cols[k] + cols[k + 1]) / 2
  panel(win, 's', YPW, m - 1.5, m + 1.5, FG + (k >= 1 && k <= 3 ? 0.6 : 2.0), FG + 10.2, 0.05)
}
for (const x of cols) roundColumn(stone, x, PY0 + 1.2, 0.8, FG + 0.6, FG + 11, 12, 0.8)
// pavilion cornice and the attic
cbox(stone, grow(pav, 0.55), CORN, CORN + 0.5, { b: 0.25, bottom: true, top: false })
cbox(stone, rect(PX0, PX1, PY0, MY0 + 2), CORN + 0.5, ATTIC - 0.4, { top: false })
cbox(stone, rect(PX0 - 0.25, PX1 + 0.25, PY0 - 0.25, MY0 + 2.25), ATTIC - 0.4, ATTIC, { b: 0.2, bottom: true, top: roof })
// attic panels: three sunk tablets
for (const d of [-8.5, 0, 8.5]) panel(roof, 's', PY0, AX + d - 2.6, AX + d + 2.6, CORN + 1.1, ATTIC - 1.0, 0.03)

/** A round-headed opening: jambs and a semicircular head, flat on a wall. */
function archPanel(p: Part, side: Side, at: number, c: number, w: number, z0: number, zs: number, d = 0.05) {
  panel(p, side, at, c - w / 2, c + w / 2, z0, zs, d)
  const pts = arc(0, 0, w / 2, 0, 180, 10)
  const sgn = side === 's' || side === 'w' ? -1 : 1
  for (let k = 0; k < pts.length - 1; k++) {
    const A = pts[k], B = pts[k + 1]
    const P = (q: XY2 | [number, number]): V3 => (side === 's' || side === 'n' ? [c + q[0], at + sgn * d, zs + q[1]] : [at + sgn * d, c + q[0], zs + q[1]])
    const n: V3 = side === 's' ? [0, -1, 0] : side === 'n' ? [0, 1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
    const tri: V3[] = [P([0, 0]), P(A), P(B)]
    const f = [tri[1][0] - tri[0][0], tri[1][1] - tri[0][1], tri[1][2] - tri[0][2]], g = [tri[2][0] - tri[0][0], tri[2][1] - tri[0][1], tri[2][2] - tri[0][2]]
    const cr: V3 = [f[1] * g[2] - f[2] * g[1], f[2] * g[0] - f[0] * g[2], f[0] * g[1] - f[1] * g[0]]
    if (cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] >= 0) p.tri(tri[0], tri[1], tri[2])
    else p.tri(tri[0], tri[2], tri[1])
  }
}

// end bays: an arched door, a window over it; the same on the bays' sides
for (const c of [PX0 + EB / 2, PX1 - EB / 2]) {
  archPanel(win, 's', PY0, c, 3.5, FG, FG + 5.2)
  panel(win, 's', PY0, c - 1.0, c + 1.0, FG + 8.4, FG + 10.4)
}
archPanel(win, 'w', PX0, (PY0 + MY0) / 2, 3.0, FG, FG + 4.8)
archPanel(win, 'e', PX1, (PY0 + MY0) / 2, 3.0, FG, FG + 4.8)

// ---- wings: three bays of tall two-storey windows on each front, ground
// storey windows under the canopy
const wingBays = (x0: number, x1: number) => [0, 1, 2].map((k) => x0 + ((k + 0.5) * (x1 - x0)) / 3)
for (const [x0, x1] of [[MX0, PX0], [PX1, MX1]] as [number, number][]) {
  for (const c of wingBays(x0, x1)) {
    panel(win, 's', MY0, c - 1.4, c + 1.4, FG + 5.6, FG + 12.8, 0.05)
    panel(win, 's', MY0, c - 1.1, c + 1.1, FG + 1.0, FG + 3.9, 0.05)
  }
}
// sides: six bays the same way (east-side photo); the rear half of the west
// side is masked by the west block, so its lower windows stop there
const sideBays = [0, 1, 2, 3, 4, 5].map((k) => MY0 + 1.5 + ((k + 0.5) * (MY1 - MY0 - 3)) / 6)
for (const [side, at] of [['w', MX0], ['e', MX1]] as [Side, number][]) {
  for (const c of sideBays) {
    panel(win, side, at, c - 1.2, c + 1.2, FG + 5.6, FG + 12.8, 0.05)
    if (side === 'e' || c < -40) panel(win, side, at, c - 1.0, c + 1.0, FG + 1.0, FG + 3.9, 0.05)
  }
}
// rear (track side): the exposed parts between the blocks behind
for (const c of [-24, -20, -16, -12, -8, -4, 0, 24, 28]) {
  if (c > -8 && c < 2) continue
  panel(win, 'n', MY1, c - 1.2, c + 1.2, 12, 18.2, 0.05)
}

// ---- the drum: a square with broad chamfers, a lunette in each face
const DH = 15 // half width
const CH = 5 // chamfer
const oct = (h: number, c: number): XY[] => {
  const cx = AX, cy = -44
  return [[cx - h + c, cy - h], [cx + h - c, cy - h], [cx + h, cy - h + c], [cx + h, cy + h - c], [cx + h - c, cy + h], [cx - h + c, cy + h], [cx - h, cy + h - c], [cx - h, cy - h + c]]
}
pslab(stone, oct(DH, CH), ROOF - 0.5, DRUM, 0, false)
pslab(stone, oct(DH + 0.5, CH + 0.2), DRUM, DRUM_TOP, 0.3, roof)
// lunettes on the four main faces (half-discs set on the face)
for (const side of ['s', 'n', 'e', 'w'] as Side[]) {
  const at = side === 's' ? -44 - DH : side === 'n' ? -44 + DH : side === 'e' ? AX + DH : AX - DH
  const c = side === 's' || side === 'n' ? AX : -44
  archPanel(win, side, at, c, 9, DRUM - 4.8, DRUM - 4.8, 0.05)
}

// ---- the saucer dome: a stepped ring, then a low spherical cap
{
  const r0 = 14.2, rise = CROWN - (DRUM_TOP + 0.8)
  const R = (r0 * r0 + rise * rise) / (2 * rise)
  const prof: [number, number][] = [[r0 + 0.6, DRUM_TOP], [r0 + 0.6, DRUM_TOP + 0.4], [r0, DRUM_TOP + 0.8]]
  const a0 = Math.asin(r0 / R)
  for (let k = 1; k <= 7; k++) {
    const a = a0 * (1 - k / 7)
    prof.push([R * Math.sin(a), DRUM_TOP + 0.8 + R * Math.cos(a) - (R - rise)])
  }
  lathe(dome, AX, -44, prof, 24)
}

// ===========================================================================
// Iron canopies along the wings' fronts and round the sides (building=roof).
const canopy = (r: ReturnType<typeof rect>) => cbox(iron, r, FG + 4.2, FG + 4.7, { bottom: true })
canopy(rect(MX0 - 4.3, PX0, MY0 - 4.5, MY0))
canopy(rect(PX1, MX1 + 4.3, MY0 - 4.5, MY0))
canopy(rect(MX0 - 4.3, MX0, MY0, MY1 - 0.1))
canopy(rect(MX1, MX1 + 4.3, MY0, -20.5))
// posts at the outer edge
for (const x of [MX0 - 4, -18, PX0 - 0.5, PX1 + 0.5, 41, MX1 + 4]) cbox(iron, rect(x - 0.15, x + 0.15, MY0 - 4.35, MY0 - 4.05), FG, FG + 4.2)
for (const y of [-50, -38]) cbox(iron, rect(MX0 - 4.2, MX0 - 3.9, y - 0.15, y + 0.15), FG, FG + 4.2)
for (const y of [-50, -38, -26]) cbox(iron, rect(MX1 + 3.9, MX1 + 4.2, y - 0.15, y + 0.15), 0, FG + 4.2)

// ===========================================================================
// West block and the geodesic Dome theatre
const west: XY[] = [[-61.3, -32.6], [MX0, -32.0], [MX0, MY1], [1.9, MY1], [1.9, -8.2], [-15.1, -8.4], [-15.4, -6.8], [-20.2, -6.7], [-19.9, 1.4], [-51.3, 15.7], [-60.8, 9.1]]
pslab(stone, west, 0, 10.3, 0.3, roof)
// a band of windows on its track (north-west) side
for (const t of [0.2, 0.5, 0.8]) ppanel(win, [-19.9, 1.4], [-51.3, 15.7], t - 0.08, t + 0.08, 3.5, 7.5)
{
  const cx = -42, cy = -9, r0 = 15.3, rise = 8.7
  const R = (r0 * r0 + rise * rise) / (2 * rise)
  const prof: [number, number][] = [[r0, 10.3]]
  const a0 = Math.asin(r0 / R)
  for (let k = 1; k <= 6; k++) {
    const a = a0 * (1 - k / 6)
    prof.push([R * Math.sin(a), 10.3 + R * Math.cos(a) - (R - rise)])
  }
  lathe(geo, cx, cy, prof, 16)
}

// ===========================================================================
// The concourse over the tracks: a tall plain block with a low gable, north
const CY1 = 43.3
cbox(stone, rect(1.9, 19.7, MY1, CY1), 0, 19.6, { top: false })
cbox(stone, rect(1.6, 20.0, MY1, CY1 + 0.3), 19.3, 19.8, { b: 0.2, bottom: true, top: false })
gable(roof, stone, rect(1.6, 20.0, MY1, CY1 + 0.3), 19.8, 22.3, true, [false, true])
for (const [side, at] of [['w', 1.9], ['e', 19.7]] as [Side, number][]) {
  for (let y = -6; y < CY1 - 3; y += 5.5) panel(win, side, at, y - 1.0, y + 1.0, 9.5, 17.5, 0.05)
}
panel(win, 'n', CY1, 6.5, 15.1, 10.5, 17.0, 0.05)
// low block east of it, and the link and north-east block
pslab(stone, [[19.7, MY1], [MX1, -30.5], [38.8, -24.9], [39.5, -20.1], [29.4, -19.5], [29.6, -10.7], [19.7, -10.8]], 0, 9.7, 0.3, roof)
pslab(stone, [[0.5, CY1], [3.8, CY1], [8.6, CY1], [5.0, 52.2], [0.5, 52.1]], 0, 7.0, 0.2, roof)
pslab(stone, [[-6.8, 52.0], [28.6, 52.0], [28.9, 107.2], [-6.3, 107.0]], 0, 8.0, 0.3, roof)
for (const y of [60, 70, 80, 90, 100]) {
  panel(win, 'w', -6.6, y - 2, y + 2, 2.5, 6.0, 0.05)
  panel(win, 'e', 28.75, y - 2, y + 2, 2.5, 6.0, 0.05)
}

// ===========================================================================
// Floodlit limestone: the Broad Street front brightest, the sides softer;
// the rear blocks unlit, tops faint.
const lit = (p: V3, n: V3): number => {
  // model frame: x east, y north, z up
  if (n[2] > 0.7) return 0.1
  if (p[1] < -28 && p[2] > FG) return n[1] < -0.5 ? 0.95 : 0.6
  return 0
}

/** A finish with night floodlighting; dc-nga-west's Mat type omits the field but saveModel passes it through. */
const lit_ = (m: MaterialSpec): Mat => m

if (import.meta.main) {
  await saveModel('ric-science-museum', 'Science Museum of Virginia', [
    { part: stone, material: lit_({ ...finish('broad-street-limestone', 0xe8dfcf), floodlight: lit }) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: dome, material: finish('broad-street-dome', 0x949ea3) },
    { part: iron, material: finish('broad-street-iron', 0x4a4f57) },
    { part: geo, material: finish('dome-theatre-white', 0xf2f3f1) },
  ], { source: 'generators/ric-science-museum.ts', bearing: 37, osm: 'way/252997396', height: CROWN }, 6500)
}
