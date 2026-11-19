/**
 * New Orleans City Hall (1300 Perdido Street, 1957, Goldstein, Parham &
 * Labouisse with Favrot, Reed, Mathes & Bergman). Procedural, CC0-1.0, no
 * textures.
 * bun generators/nola-city-hall.ts [out.glb]
 *
 * What makes it read as itself: a long eleven-storey slab whose two long
 * faces are a light blue glass grid (sky-blue glass over blue-green
 * spandrels, divided by pale aluminium mullions and floor lines) held in a
 * plain pale stone frame: a deep solid band across the top (the CITY HALL
 * letters), a solid stone end bay at the south-east end and a thin one at
 * the north-west; a recessed glazed ground floor; low two- and three-storey
 * wings spread round its foot (west wing, south podium, the curved
 * council-chamber wing to the south-east, the low lobby strip on the
 * Duncan Plaza side).
 *
 * Frame: x along the slab (compass 122.55, south-east), y across it (model
 * north = compass 32.55: +y faces Duncan Plaza, -y faces Perdido Street),
 * z up, metres (glTF +Y up, -Z north). Bearing 32.55: the slab part
 * way/328778341 is square to it. Anchor = area centroid of the outer ring
 * of relation/4597508, -90.0771266 29.9521128. z = 0 is the street (lidar
 * ground ~0.8 above ground_min); the site is flat (Mapterhorn relief under
 * 1.5 m). Duncan Plaza is the map's. elevation 0.
 *
 * Sources
 * - OSM: relation/4597508 (multipolygon, building, height 46.9 from
 *   Microsoft footprints; outer ways 328669163, 328669168, 328669105,
 *   328778340, 328778339, 328669130), building:part way/328778341 (the
 *   slab, height 36, 10 levels: low, see lidar).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid, read in this frame with tools/lidar_frame.py, above the
 *   street (all measured): slab roof 43.7 (x -38.4..63.5, y -16.7..9.5),
 *   penthouses to 46.1, a sunk roof well 41.0 at the south-east half;
 *   lobby strip on the plaza side 5.5; west wing 10.0 (13-15 m at its far
 *   north-west corner, drawn 10); south podium 5.7; south-east wing 9.6.
 * - Published: 11 storeys, completed 1957 (Wikipedia, "New Orleans City
 *   Hall").
 * - NAIP (USGS, public domain): plan, roofs, the penthouse boxes.
 * - Photos (EVIDENCE):
 *   p01 "City of New Orleans - City Hall February 2026.jpg", ajay_suresh,
 *     CC BY 4.0, head-on from Duncan Plaza (north-east): the frame
 *     proportions (top band 4.4 m, south-east end bay 7.3 m, north-west
 *     edge ~1 m), 21 bays, ten glazed floors, the recessed ground floor and
 *     the entrance block;
 *     https://commons.wikimedia.org/wiki/File:City_of_New_Orleans_-_City_Hall_February_2026.jpg
 *   p04 "New Orleans City Hall (close-up).jpg", Vegasjon, CC BY-SA 3.0:
 *     the glass and spandrel colours, mullions, the stone band;
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_City_Hall_(close-up).jpg
 *   p06 "New Orleans Central Business District 28 Oct 2024 - City Hall and
 *     media", Infrogmation, CC BY-SA 4.0: the Perdido Street (south-west)
 *     face, the same grid and stone end at the south-east;
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_Central_Business_District_28_Oct_2024_-_City_Hall_and_media.jpg
 *   p03 "New Orleans City Hall seen from across Duncan Plaza.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 4.0: from far across the plaza;
 *     https://commons.wikimedia.org/wiki/File:New_Orleans_City_Hall_seen_from_across_Duncan_Plaza.jpg
 *   p02 "City Hall, Duncan Plaza, New Orleans.jpg", Infrogmation of New
 *     Orleans, CC BY-SA 4.0.
 *     https://commons.wikimedia.org/wiki/File:City_Hall,_Duncan_Plaza,_New_Orleans.jpg
 * - Look-only: none.
 *
 * Estimated: ground floor 0-5.5 recessed 1.5 m; ten office floors
 * 5.5-39.3 drawn as five two-storey glass panels with pale floor lines
 * between and pale mullion fins (0.3 m wide, 0.35 m proud) every bay of
 * 4.43 m; the curtain wall set 0.25 m behind the stone frame. Colours from
 * p01/p04, pulled to the palette: stone #ddd6cd (warm grey limestone), glass
 * teal sky blue #8fbccc (`window-2`), mullions `trim`, wing windows `window`.
 * Night: the curtain wall glows (`window-2`); wing windows and the dark
 * lobby glazing are `window`.
 * Left out: the CITY HALL letters (an ordinary sign: STYLE, plain signs are
 * left as boxes, and a box there reads as a stain), masts, the entrance
 * steps and planters (on the plaza, the map's).
 *
 * Doubts: the slab's end faces are not photographed head-on; drawn solid
 * stone. The wings are seen only partly through trees; their window
 * rhythm is estimated. The OSM part height (36 m) is wrong; lidar used.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, rect, inset, walls, cap, onWall, panel, parapetRoof, bays, save } from './chi-aon-center'

const X0 = -38.4, X1 = 63.5, Y0 = -16.7, Y1 = 9.5
const ROOF = 43.7, BAND = 39.3, LOBBY = 5.5
const END_SE = 7.3, END_NW = 1.0
const BAYS = 21, FLOORS = 10

const ccw = (r: XY[]): XY[] => (r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) < 0 ? r.slice().reverse() : r)
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
function wing(stone: Part, roof: Part, win: Part, r: XY[], z: number, rows: [number, number][]) {
  r = ccw(r)
  wallsSeg(stone, r, 0, Math.min(3, z - 0.4))
  walls(stone, r, Math.min(3, z - 0.4), z - 0.3)
  const b = inset(r, 0.3)
  walls(stone, r, z - 0.3, z, b)
  parapetRoof(stone, roof, b, z, 0.4, 0.4)
  bays(win, r, rows, { bay: 2.6, gap: 1.6, end: 1.2, minLen: 6 })
}

function build() {
  const stone = new Part(), roof = new Part(), glass = new Part(), trim = new Part(), win = new Part(), lobby = win

  // ---- The slab. Stone frame: ends and top band full depth; the long faces'
  // curtain wall sits D behind the frame between them.
  const D = 0.25
  const gx0 = X0 + END_NW, gx1 = X1 - END_SE
  // Lobby: glass 1.5 m behind the face, under the frame.
  const LR = 1.5
  walls(lobby, rect(gx0, Y0 + LR, gx1, Y1 - LR), 0, LOBBY)
  // soffit over the lobby recess
  for (const [ya, yb] of [[Y0, Y0 + LR], [Y1 - LR, Y1]]) {
    const r = rect(gx0, ya, gx1, yb)
    cap(stone, r, LOBBY, false)
  }
  // ends, full height, as solid stone blocks
  for (const [a, b] of [[X0, gx0], [gx1, X1]]) {
    const r = rect(a, Y0, b, Y1)
    wallsSeg(stone, r, 0, 3)
    walls(stone, r, 3, BAND)
  }
  // top band
  {
    const r = rect(X0, Y0, X1, Y1)
    walls(stone, r, BAND, ROOF - 0.35)
    const bv = inset(r, 0.35)
    walls(stone, r, ROOF - 0.35, ROOF, bv)
    parapetRoof(stone, roof, bv, ROOF, 0.5, 0.6)
    cap(stone, rect(gx0, Y0, gx1, Y0 + D), BAND, false)
    cap(stone, rect(gx0, Y1 - D, gx1, Y1), BAND, false)
  }
  // penthouses on the roof (NAIP, lidar 46.1)
  for (const r of [rect(-25, -9, -6, 3), rect(30, -9, 44, 2)]) {
    walls(roof, r, ROOF - 0.6, 46.1)
    cap(roof, r, 46.1)
  }
  // the curtain walls: glass sheet, floor lines every two storeys, mullion fins every bay
  const fl = (BAND - LOBBY) / FLOORS
  for (const side of [-1, 1]) {
    const y = side < 0 ? Y0 + D : Y1 - D
    const a: XY = side < 0 ? [gx0, y] : [gx1, y], b: XY = side < 0 ? [gx1, y] : [gx0, y]
    const { P, L } = onWall(a, b) // outward is -y for the south face, +y for the north
    // glass between floor bands
    for (let g = 0; g < FLOORS / 2; g++) {
      const z0 = LOBBY + g * 2 * fl + (g === 0 ? 0.6 : 0.3), z1 = LOBBY + (g + 1) * 2 * fl - 0.3
      panel(glass, a, b, 0, L, z0, z1, 0.0)
    }
    // floor bands (pale), proud
    for (let g = 0; g <= FLOORS / 2; g++) {
      const zc = LOBBY + g * 2 * fl, z0 = g === 0 ? LOBBY : zc - 0.3, z1 = g === FLOORS / 2 ? BAND : zc + 0.3
      const q = (s: number, z: number, o: number) => P(s, z, o)
      trim.quad(q(0, z0, D), q(L, z0, D), q(L, z1, D), q(0, z1, D))
      trim.quad(q(0, z1, D), q(L, z1, D), q(L, z1, 0), q(0, z1, 0))
      trim.quad(q(0, z0, 0), q(L, z0, 0), q(L, z0, D), q(0, z0, D))
    }
    // mullion fins
    const bay = L / BAYS
    for (let k = 1; k < BAYS; k++) {
      const s = k * bay, w = 0.15, z0 = LOBBY + 0.3, z1 = BAND - 0.3
      const q = (ss: number, z: number, o: number): V3 => P(ss, z, o)
      trim.quad(q(s - w, z0, D + 0.1), q(s + w, z0, D + 0.1), q(s + w, z1, D + 0.1), q(s - w, z1, D + 0.1))
      trim.quad(q(s + w, z0, D + 0.1), q(s + w, z0, 0), q(s + w, z1, 0), q(s + w, z1, D + 0.1))
      trim.quad(q(s - w, z0, 0), q(s - w, z0, D + 0.1), q(s - w, z1, D + 0.1), q(s - w, z1, 0))
    }
  }
  // lobby piers on the face line (one per two bays)
  for (const side of [-1, 1]) {
    const y = side < 0 ? Y0 : Y1
    const L = gx1 - gx0
    for (let k = 1; k < BAYS; k += 2) {
      const x = gx0 + (k * L) / BAYS
      walls(stone, ccw(rect(x - 0.35, y - (side < 0 ? 0 : 0.7), x + 0.35, y + (side < 0 ? 0.7 : 0))), 0, LOBBY)
    }
  }

  // ---- Low wings (OSM relation/4597508 outer ring; heights lidar).
  wing(stone, roof, win, [[X0, Y1], [57.5, Y1], [57.5, 13.3], [12.5, 14.5], [X0, 15.9]], 5.5, [[1.4, 4.2]])
  wing(stone, roof, win, [[X0, Y0], [X0, 15.9], [-45.8, 16.0], [-48.7, 39.9], [-66.0, 37.3], [-65.0, 30.9], [-76.2, 29.0], [-76.5, 22.5], [-72.2, -7.3], [-70.3, -12.1], [-71.0, Y0]], 10.0, [[1.4, 4.0], [5.6, 8.4]])
  wing(stone, roof, win, [[-79.2, -32.7], [-39.4, -26.7], [-38.3, -32.1], [-8.5, -27.7], [-7.0, Y0], [-71.0, Y0], [-70.3, -12.1], [-82.3, -13.9]], 5.7, [[1.4, 4.4]])
  wing(stone, roof, win, [[X1, -7.9], [68.4, -7.9], [74.0, -7.8], [77.7, -7.6], [82.3, -7.1], [86.2, -6.3], [91.8, -5.2], [99.4, -3.7], [102.0, -3.0], [99.1, 10.4], [109.6, 17.2], [104.2, 27.5], [101.3, 30.0], [94.2, 28.1], [88.8, 26.5], [82.3, 24.4], [77.0, 22.6], [72.4, 20.9], [68.2, 19.1], [64.5, 17.1], [60.6, 15.2], [57.5, 13.3], [57.5, Y1], [X1, Y1]], 9.6, [[1.4, 4.0], [5.4, 8.2]])

  return [
    { part: stone, material: finish('ch-limestone', 0xddd6cd) },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: windowVariant(2, 0x8fbccc) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('nola-city-hall', 'New Orleans City Hall', [29.9521128, -90.0771266], 32.55, build())
