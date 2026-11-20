/**
 * Cleveland Public Library, Main Building (1925, Walker and Weeks), 325
 * Superior Avenue, on the Mall: procedural, CC0-1.0.
 * bun generators/cle-public-library.ts [out.glb]
 *
 * Frame: x, y, z metres, turned to bearing 56 (+y points north-east toward
 * the Eastman Reading Garden and the Louis Stokes Wing, -y south-west to
 * Superior Avenue, -x north-west to the Mall), origin at the OSM outline's
 * centroid (-81.6918045, 41.5011744). z = 0 is the street round the block
 * (lidar 4.2 m above the box's lowest return, a loading dock). elevation 0.
 *
 * Form: the Group Plan's Beaux-Arts block in pale granite, the twin of the
 * Metzenbaum Courthouse across the Mall: a rusticated base with
 * round-arched windows, a giant Corinthian colonnade of nine bays on every
 * face between solid corner pavilions, the frieze ("The Cleveland Public
 * Library"), a deep cornice and balustrade, and a green copper hip roof
 * ringing a central light court. The main entrance, an arched door between
 * two aedicule windows up a flight of steps, is in the middle of the
 * Superior Avenue front.
 *
 * Sources
 * - OSM (ODbL): way/387414100 (the building: government, 5 levels, height
 *   34.7, roof hipped), replaced. The library's site area way/96672880
 *   (amenity=library, no building tag) and the Louis Stokes Wing
 *   way/333522117 are left to the map.
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 1 m grid read in this frame: walls on the OSM outline
 *   (58.8 x 62.5 m); cornice 27.9 above the street; balustrade and roof
 *   edge about 31; the copper hip rising to its ridge (34.5, OSM 34.7)
 *   about 9 m in; a light court (x -10..10, y -14..18) roofed at 15.8 with
 *   a skylight to 21.5.
 * - Published: 1925, Walker and Weeks, part of the 1903 Group Plan
 *   (Wikipedia, "Cleveland Public Library").
 * - Photos:
 *   - "Cleveland Public Library (July 2018)", Cards84664, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Cleveland_Public_Library_(July_2018).jpg
 *     (the Superior front square on: nine colonnade bays, the window
 *     tiers, the arched base, the entrance and steps, frieze, balustrade,
 *     copper roof)
 *   - "Cleveland Public Main Library, Cleveland, OH" (28726176088,
 *     28726179948, 27732164507), Warren LeMay, CC0, 2018,
 *     https://commons.wikimedia.org/wiki/File:Cleveland_Public_Main_Library,_Cleveland,_OH_(28726176088).jpg
 *     (from the Mall: the colonnade on the Mall face, the corner
 *     pavilions, the other faces in raking view)
 *   - "Cleveland Public Library (16287393458)", Erik Drost, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Cleveland_Public_Library_(16287393458).jpg
 *     (from above: the green copper hip roof)
 *   - "Cleveland Public Library, Cleveland, Ohio", Ken Lund, CC BY-SA 2.0,
 *     https://www.flickr.com/photos/kenlund/7981753464 (at night: lit windows)
 * Estimated from the photos: base 8.8 m; columns 9.6-23 m, r 0.75; window
 *   tiers 10.3-14.6 and 16-22.3; corner pavilions about 6 m wide; the
 *   steps' depth and the door sill (1.5 m).
 * Left out: capitals' carving, the inscription, the aedicule pediments,
 *   balusters (the balustrade is a solid band), rooftop chimneys.
 * Doubts: the south-east and north-east (garden) faces are seen only in
 *   raking views; they are drawn with the same nine-bay colonnade.
 * Night: windows glow; the stone is unlit.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, inset, walls, cap, block, cornice, panel, halfColumn, save } from './chi-field-museum'
import { archPanel, parapet, ringTop } from './cle-city-hall'
import { wallQuad } from './cle-200-public-square'

const X = 29.4, Y = 31.2
const BASE = 8.8, COL0 = 9.6, COL1 = 23.0, CORN = 27.9, BAL = 31.2
const PAV = 6.0, SILL = 1.5

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), copper = new Part(), roof = new Part(), door = new Part()
  const R = rect(-X, -Y, X, Y)

  // The block, split low for the terrain.
  for (let i = 0; i < 4; i++) wallQuad(stone, R[i], R[(i + 1) % 4], 0, CORN - 1.4)
  cornice(trim, R, 0, 0.9, 0.2) // granite plinth
  cornice(trim, R, BASE, COL0, 0.45) // string course over the base
  cornice(trim, R, COL1, COL1 + 0.8, 0.3) // architrave
  cornice(trim, R, CORN - 1.4, CORN, 1.2) // the cornice
  ringTop(roof, inset(R, -0.48), inset(R, 0.2), CORN)
  parapet(stone, inset(R, 0.2), CORN, BAL - 0.4, 0.6) // balustrade
  parapet(trim, inset(R, 0.1), BAL - 0.4, BAL, 0.8)

  // Copper hip ringing the light court.
  const eave = inset(R, 0.8), ridge = inset(R, 9), rim = rect(-11.5, -15.5, 11.5, 19.5), court = rect(-10, -14, 10, 18)
  walls(copper, eave, BAL - 1.0, 34.5, ridge)
  walls(copper, [...rim].reverse(), 33.2, 34.5, [...ridge].reverse())
  ringTop(copper, rim, court, 33.2) // flat lip round the court
  walls(stone, [...court].reverse(), 15.8, 33.2)
  cap(roof, court, 15.8)
  block(roof, roof, rect(-6, -2, 6, 6), 15.8, 21.5, 0.3) // skylight

  // Facades: corner pavilions and nine colonnade bays on every face.
  for (let i = 0; i < 4; i++) {
    const a = R[i], b = R[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bay = (L - 2 * PAV) / 9, cx = (k: number) => PAV + bay * (k + 0.5)
    const front = i === 0 // Superior Avenue
    for (let k = 0; k <= 9; k++) halfColumn(trim, trim, a, b, PAV + bay * k, COL0, COL1, 0.85, 6)
    for (let k = 0; k < 9; k++) {
      const c = cx(k), w = Math.min(2.9, bay - 1.9)
      panel(win, a, b, c - w / 2, c + w / 2, 10.3, 14.6)
      panel(win, a, b, c - w / 2, c + w / 2, 16.0, 22.3)
      if (front && k === 4) {
        // the entrance: an arched door in a pale surround
        archPanel(trim, a, b, c - 2.0, c + 2.0, SILL, 6.0, 0.05)
        archPanel(door, a, b, c - 1.5, c + 1.5, SILL, 6.0, 0.09)
      } else if (front && (k === 3 || k === 5)) {
        // the aedicule windows beside it
        panel(trim, a, b, c - 1.6, c + 1.6, SILL, 7.2, 0.05)
        panel(win, a, b, c - 0.9, c + 0.9, 3.0, 6.2, 0.09)
      } else {
        archPanel(trim, a, b, c - 1.75, c + 1.75, 1.6, 5.6, 0.04)
        archPanel(win, a, b, c - 1.4, c + 1.4, 1.8, 5.6, 0.08)
      }
    }
    // the corner pavilions: one window a storey, an arched one in the base
    for (const c of [PAV / 2, L - PAV / 2]) {
      panel(win, a, b, c - 0.9, c + 0.9, 10.6, 14.2)
      panel(win, a, b, c - 0.9, c + 0.9, 16.4, 21.4)
      archPanel(win, a, b, c - 1.2, c + 1.2, 1.8, 5.6, 0.08)
    }
  }

  // The front steps, across the three middle bays.
  {
    const bay = (2 * X - 2 * PAV) / 9, half = 1.5 * bay + 0.6, n = 5, rise = SILL / n
    for (let s = 0; s < n; s++) {
      const d = 0.5 + (n - s) * 0.8
      block(stone, stone, rect(-half + 0.2 * s, -Y - d, half - 0.2 * s, -Y), s * rise, (s + 1) * rise, 0.04)
    }
  }

  return [
    { part: stone, material: finish('cpl-granite', 0xdcd9d1) },
    { part: trim, material: finish('cpl-granite-trim', 0xeae7e0) },
    { part: win, material: PALETTE.window },
    { part: copper, material: finish('cpl-copper', 0x88b39e) },
    { part: roof, material: PALETTE.roof },
    { part: door, material: finish('cpl-bronze', 0x6f6c5c) },
  ]
}

if (import.meta.main) await save('cle-public-library', 'Cleveland Public Library', [41.5011744, -81.6918045], 56, build() as any, 6500)
