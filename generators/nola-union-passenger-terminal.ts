/**
 * New Orleans Union Passenger Terminal (1954, Wogan & Bernard with
 * Jules K. de la Vergne), 1001 Loyola Avenue. Procedural, CC0-1.0, no
 * textures.
 * bun generators/nola-union-passenger-terminal.ts [out.glb]
 *
 * What makes it read as itself: a long, low, flat-roofed block of pale
 * limestone; at the centre of the Loyola Avenue (east) front a taller hall
 * whose face is five tall glazed windows between plain stone piers, with
 * solid stone end bays; a thin flat entrance canopy across the hall's foot
 * over dark granite and glazed doors; lower wings either side with a single
 * high row of small square windows; the low concourse and the platform
 * canopy on the track (west) side, and the long low wing along the tracks
 * to the north-west.
 *
 * Frame: x along compass 105 (out of the Loyola front, east-south-east), y
 * along compass 15 (model north), z up, metres (glTF +Y up, -Z north).
 * Bearing 15: the OSM outline way/328803040 is square to it within 0.2
 * degrees. Anchor = area centroid of way/328803040, -90.0786956 29.9463316.
 * z = 0 is the street (lidar ground ~0.8 m above ground_min); the site is
 * flat (Mapterhorn 0.0-1.0 m over 180 m). elevation 0.
 *
 * Sources
 * - OSM: way/328803040 (building=train_station, height 14, 4 levels: one
 *   outline over the main block, the entrance canopy, the concourse, the
 *   north annex and the north-west wing). No building:part ways. The
 *   Amtrak platforms (ways 542930767/8/70/71, shelter=yes) are platforms,
 *   not buildings, and are not drawn.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid, read in this frame with tools/lidar_frame.py, above the
 *   street (all measured): central hall 12.6 (x 16.5-35.7, y -27.6..-3.7);
 *   front wings 10.2-11.4, a very low ridge, drawn flat 10.7 (x 10.5-35.7);
 *   rear block 8.3 (x -7..10.5); west strip 7.8; concourse canopy on the
 *   track side 5.8 (x -16..-7); north annex 3.6 (y 22.5-41); north-west
 *   wing 7.2; south strip 3.6 (under the Pontchartrain Expressway, which
 *   crosses the south end at ~15 m and is the map's); entrance canopy top
 *   3.6 (x 35.7-42.9). The lidar footprint matches OSM within ~1 m.
 * - NAIP (USGS, public domain): the plan, grey flat roofs, the darker hall
 *   roof, the platform canopies west of the outline.
 * - Published: opened 1954, architects Wogan & Bernard (Wikipedia, "New
 *   Orleans Union Passenger Terminal").
 * - Photos (EVIDENCE):
 *   f1 "New Orleans Union Passenger Terminal", Reading Tom, CC BY 2.0, from
 *     the north-east: the whole Loyola front, hall to wing heights (0.87,
 *     lidar 0.84), the high row of square windows on both wings, the
 *     canopy; https://www.flickr.com/photos/16801915@N06/5981839205
 *   p02 "New Orleans Union Passenger Terminal Feb 2018 Exterior.jpg", David
 *     Wilson, CC BY 2.0, head-on from the east: five tall windows, piers,
 *     end bays, canopy, lettering;
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_Union_Passenger_Terminal_Feb_2018_Exterior.jpg
 *   p01 "Union Passenger Terminal, New Orleans.jpg", Vegasjon, CC BY-SA 3.0:
 *     close-up of the hall, piers proud of the glass, dark granite under
 *     the canopy, the canopy's thin white fascia;
 *     https://commons.wikimedia.org/wiki/File:Union_Passenger_Terminal,_New_Orleans.jpg
 *   p05 "NOUnionTerminal2Jan08FrontLoyolaAcross.jpg", Infrogmation of New
 *     Orleans, CC BY-SA 3.0: from across Loyola, the south wing;
 *     https://commons.wikimedia.org/wiki/File:NOUnionTerminal2Jan08FrontLoyolaAcross.jpg
 *   p03 "New Orleans March 2018 Union Terminal and Streetcar.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: the north side, two rows of
 *     windows; https://commons.wikimedia.org/wiki/File:New_Orleans_March_2018_Union_Terminal_and_Streetcar.jpg
 *   p04 "NOUnionTerminal2Jan08Back.jpg", Infrogmation of New Orleans, CC
 *     BY-SA 3.0: the platform canopies from the concourse;
 *     https://commons.wikimedia.org/wiki/File:NOUnionTerminal2Jan08Back.jpg
 * - Look-only: none.
 *
 * Estimated (from f1, p02, p01 scaled to the lidar heights): hall windows
 * 2.5 m wide, 4.6-11.4 m, piers 1.4 m standing 0.35 m proud, end bays 3 m;
 * wing windows 1.4 m square at a 3.3 m pitch, 7.2-8.6 m; side faces two
 * rows; canopy 0.6 m deep fascia; doors and granite under the canopy.
 * Colours from the daylight photos, pulled to the palette: limestone
 * #ebe5d8, granite #6f5d55, canopy fascia trim.
 * Night: the tall hall windows and wing windows are `window`; the doors
 * under the canopy `entrance`.
 * Left out: the lettering on the canopy, the flagpole, the platform
 * canopies over the tracks (not OSM buildings), the expressway, the
 * gardens.
 *
 * Doubts: the west (track) and north-west wing faces are seen only from the
 * platforms (p04) and the air; drawn plain. The front wings' faint ridge is
 * drawn flat. The canopy is drawn to OSM's 24 m; p01 suggests it runs a
 * little further along the front.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, inset, walls, cap, onWall, panel, parapetRoof, save } from './chi-aon-center'

const HALL = 12.6, WING = 10.7, REAR = 8.3, WEST = 7.8, CONC = 5.8, LOW = 3.6, NW = 7.2, CANOPY = 3.6

const ccw = (r: XY[]): XY[] => (r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) < 0 ? r.slice().reverse() : r)

/** Walls split into pieces no longer than 5 m near the ground, for the terrain drape. */
function wallsSeg(p: Part, r: XY[], z0: number, z1: number, seg = 5) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / seg))
    for (let k = 0; k < n; k++) {
      const p0: XY = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]
      const p1: XY = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n]
      p.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
    }
  }
}
/** A flat-roofed block: walls, a bevelled coping and a sunk roof. */
function block(stone: Part, roof: Part, r: XY[], z: number, lip = 0.5) {
  r = ccw(r)
  wallsSeg(stone, r, 0, 3)
  walls(stone, r, 3, z - 0.3)
  const b = inset(r, 0.3)
  walls(stone, r, z - 0.3, z, b)
  parapetRoof(stone, roof, b, z, lip, 0.4)
}
/** Punched windows along wall a→b: width w at pitch, z0..z1, leaving `end` at each end. */
function row(p: Part, a: XY, b: XY, w: number, pitch: number, z0: number, z1: number, end = 2) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor((L - 2 * end + pitch - w) / pitch)
  if (n < 1) return
  const s0 = (L - (n - 1) * pitch - w) / 2
  for (let k = 0; k < n; k++) panel(p, a, b, s0 + k * pitch, s0 + k * pitch + w, z0, z1)
}

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), trim = new Part(), door = new Part(), granite = new Part()

  // ---- Massing (counter-clockwise rings in this frame).
  block(stone, roof, rect(-7, -54, 10.5, 22.5), REAR)
  block(stone, roof, rect(10.5, -54, 35.7, -27.6), WING)
  block(stone, roof, rect(10.5, -3.7, 35.7, 22.5), WING)
  block(stone, roof, rect(10.5, -27.6, 16.5, -3.7), WING)
  // The hall: its own walls rise from the street on the front, over the wings elsewhere.
  block(stone, roof, rect(16.5, -27.6, 35.7, -3.7), HALL, 0.6)
  // North annex, low, with the rounded north-east corner (OSM).
  {
    const arc: XY[] = []
    for (let k = 0; k <= 6; k++) { const t = (k / 6) * Math.PI / 2; arc.push([8.7 - 9.8 * Math.sin(t), 30.1 + 9.8 * (1 - Math.cos(t))]) }
    block(stone, roof, [[-7.9, 22.5], [15, 22.5], [15, 30.1], ...arc, [-1.1, 41.3], [-7.9, 41.3]], LOW, 0.3)
  }
  // North-west wing along the tracks, and its low link.
  block(stone, roof, [[-7.9, 41.3], [-7.9, 60.1], [-81.4, 59.7], [-81.4, 53.3], [-43.9, 41.2]], NW)
  block(stone, roof, rect(-7.9, 41.3, -1.1, 60.1), LOW, 0.3)
  // South strip under the expressway.
  block(stone, roof, [[-7, -60.7], [16.5, -60.6], [16.5, -55.5], [17.6, -55.5], [17.6, -54], [-7, -54]], LOW, 0.3)

  // ---- Concourse canopy on the track side: a slab on posts (x -15.9..-7).
  {
    const c = rect(-15.9, -54.1, -7, 24.8)
    walls(roof, c, CONC - 0.8, CONC)
    cap(roof, c, CONC)
    cap(roof, c, CONC - 0.8, false)
    for (let y = -50; y <= 22; y += 8) walls(granite, rect(-15.3, y - 0.3, -14.7, y + 0.3), 0, CONC - 0.8)
  }

  // ---- Entrance canopy (OSM x 35.7-42.9, y -27.6..-3.7): thin slab, white fascia, on posts.
  {
    const c = rect(35.7, -27.6, 42.9, -3.7)
    walls(trim, c, CANOPY - 0.6, CANOPY)
    cap(trim, c, CANOPY)
    cap(trim, c, CANOPY - 0.6, false)
    for (const y of [-25.5, -19.5, -11.8, -5.8]) walls(trim, rect(42.0, y - 0.15, 42.3, y + 0.15), 0, CANOPY - 0.6)
    // Under it: dark granite piers and glazed doors on the hall's foot.
    const a: XY = [35.7, -27.6], b: XY = [35.7, -3.7]
    const { P } = onWall(a, b) // runs +y; outward is +x
    panel(granite, a, b, 0, 23.9, 0, CANOPY - 0.6, 0.05)
    for (let k = 0; k < 5; k++) panel(door, a, b, 3.2 + k * 3.9, 3.2 + k * 3.9 + 2.6, 0, 2.7, 0.09)
    void P
  }

  // ---- The hall's front: five tall windows between proud piers, solid end bays.
  {
    const x = 35.7, y0 = -27.6, END = 3.0, PIER = 1.4, D = 0.35
    const W = (23.9 - 2 * END - 4 * PIER) / 5
    for (let k = 0; k < 5; k++) {
      const s = y0 + END + k * (W + PIER)
      win.quad([x + 0.04, s, 4.6], [x + 0.04, s + W, 4.6], [x + 0.04, s + W, 11.4], [x + 0.04, s, 11.4])
    }
    for (let k = 0; k < 4; k++) {
      const s = y0 + END + W + k * (W + PIER)
      const r: XY[] = rect(x, s, x + D, s + PIER)
      walls(stone, r, CANOPY, 11.9)
      cap(stone, r, 11.9)
    }
  }

  // ---- Wing windows: a high row on the Loyola front, two rows on the end faces.
  const front = (y0: number, y1: number) => row(win, [35.7, y0], [35.7, y1], 1.4, 3.3, 7.2, 8.6, 1.5)
  front(-54, -27.6)
  front(-3.7, 22.5)
  for (const z of [[4.4, 5.8], [7.2, 8.6]] as [number, number][]) {
    row(win, [35.7, 22.5], [10.5, 22.5], 1.4, 3.3, z[0], z[1]) // north face, over the annex
    row(win, [10.5, -54], [35.7, -54], 1.4, 3.3, z[0], z[1]) // south face
  }
  // North face of the hall above the wing roofs: a band of clerestory panels.
  row(win, [35.2, -3.7], [16.5, -3.7], 2.2, 3.4, 11.0, 11.9, 1.5)
  row(win, [16.5, -27.6], [35.2, -27.6], 2.2, 3.4, 11.0, 11.9, 1.5)
  // The north-west wing's long face: a high row (plain otherwise).
  row(win, [-7.9, 60.1], [-81.4, 59.7], 1.4, 4.0, 4.6, 6.0, 3)

  return [
    { part: stone, material: finish('upt-limestone', 0xebe5d8) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: trim, material: PALETTE.trim },
    { part: door, material: PALETTE.entrance },
    { part: granite, material: finish('upt-granite', 0x6f5d55) },
  ]
}

if (import.meta.main) await save('nola-union-passenger-terminal', 'New Orleans Union Passenger Terminal', [29.9463316, -90.0786956], 15, build())
