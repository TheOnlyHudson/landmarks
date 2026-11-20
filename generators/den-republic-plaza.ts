/**
 * Republic Plaza (370 17th Street, 1984, Skidmore, Owings & Merrill),
 * Denver — original procedural geometry, CC0-1.0.
 * bun generators/den-republic-plaza.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/52959755,
 * -104.9886472, 39.7434960. The long faces run at 45.2°, so the catalog
 * bearing is 45.2 and the slab is square to this frame, long along y.
 *
 * Identity, in order: the tallest tower in Colorado, a plain flat-topped
 * slab, 61.7 × 38 m, nothing but height; pale cream granite with a dense
 * even grid of punched windows; the two mechanical floors that ring the
 * shaft as thin dark lines of louvres, about a third and two thirds of the
 * way up; the corners notched by a narrow reveal up the whole height.
 *
 * Evidence:
 *  - plan: OSM outline way/52959755, a 61.7 × 38.0 m rectangle (one
 *    collinear extra node). The lidar footprint matches it within a metre.
 *  - heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read
 *    in this frame with tools/lidar_frame.py. ground_min 1589.5 m is a pit
 *    off the east corner; the plaza and sidewalks all round are 4.7–5.0 m
 *    above it. Parapet 223.4 above ground_min = 218.6 m above the plaza;
 *    roof inside it 222.1 (1.3 m below the parapet). Published 218 m / 56
 *    floors (OSM, Wikipedia "Republic Plaza (Denver)"). Built to 218.4.
 *  - the louvre bands: floors ~20 and ~39 of 56, counted between the bands
 *    on Xnatedawgx's "south corner" photo (17–18 floors above the upper band,
 *    ~18 between) and checked against BUTTON74's view; estimated ±2 floors.
 *  - windows: about 16 per long face and 10 per short face (3.85 m pitch),
 *    counted on the same two photos; drawn as broad panels of about three
 *    windows by three floors (five bays a long face, three a short one),
 *    with granite piers and spandrels between, per STYLE.md.
 *  - corner reveal: the vertical shadow line at every corner in the photos;
 *    drawn as a 1.0 m notch (estimated).
 *  - colour: cream-grey granite in every daylight photo (OSM building:colour
 *    #FFEBCD); a cool cream finish at the palette's lightness. The windows
 *    read mid blue-grey with the sky in them, a lighter window variant, so
 *    the tower stays pale as in the photos; the roof the palette roof. The
 *    louvre bands are a dark grey finish a full floor tall, darker than the
 *    photos' thin lines so they still read at 200 px.
 *
 * Night: offices lit (window); the granite is not floodlit.
 *
 * Photos (Wikimedia Commons, evidence):
 *  south  "Republic Plaza south corner from Court Pl.jpg", Xnatedawgx,
 *         CC BY-SA 4.0
 *  b74    "REPUBLICPLAZA.jpg", BUTTON74, CC BY-SA 4.0 (from the west, 16th St)
 *  odea   "Republic Plaza Denver.jpg", O'Dea, CC BY-SA 4.0 (night)
 *  shank  "Republic Plaza in Denver Colorado.jpg", David Shankbone,
 *         CC BY-SA 3.0
 * No look-only sources. No commercial imagery.
 *
 * Left out: the larger glazing of the lowest floors, the rooftop window-
 * washing gear and small penthouses (OSM's 218–227 m parts, all inside the
 * parapet, at most 1 m above it in the lidar), the separate low retail and
 * "World Trade Center" lobby buildings around the base (their own OSM ways).
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, panel, rows, save, walls, type XY } from './chi-aon-center'

const granite = new Part(), win = new Part(), roof = new Part(), louvre = new Part()

const HX = 19.0, HY = 30.85, N = 1.0 // half-widths, corner notch
const H = 218.4, ROOF = H - 1.3
const FL = H / 56 // floor height
const LOBBY = 8.6
const BANDS: [number, number][] = [[19.5 * FL, 20.5 * FL], [38.5 * FL, 39.5 * FL]]

// The notched ring, counter-clockwise from the south face.
const ring: XY[] = [
  [-HX + N, -HY], [HX - N, -HY], [HX - N, -HY + N], [HX, -HY + N],
  [HX, HY - N], [HX - N, HY - N], [HX - N, HY], [-HX + N, HY],
  [-HX + N, HY - N], [-HX, HY - N], [-HX, -HY + N], [-HX + N, -HY + N],
]

// Shaft, bevelled top edge, parapet and sunk roof.
const B = 0.45
walls(granite, ring, 0, H - B)
const top = inset(ring, B)
walls(granite, ring, H - B, H, top)
const lip = inset(top, 0.6)
for (let i = 0; i < top.length; i++) {
  const j = (i + 1) % top.length
  granite.quad([top[i][0], top[i][1], H], [top[j][0], top[j][1], H], [lip[j][0], lip[j][1], H], [lip[i][0], lip[i][1], H])
}
walls(granite, lip.map(p => p).reverse(), ROOF, H) // inner face of the parapet, facing in
cap(roof, lip, ROOF)

// Window groups: lobby, then three-floor groups between the louvre bands.
const groups: [number, number][] = []
const runs: [number, number][] = [[LOBBY, BANDS[0][0]], [BANDS[0][1], BANDS[1][0]], [BANDS[1][1], 55 * FL]]
for (const [a, b] of runs) groups.push(...rows(a, b, Math.round((b - a) / (3 * FL)), 3.4))

// Faces: the long walls of the ring, between the corner notches.
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 5) continue
  const k = Math.round(L / 11.8), pitch = L / k, w = pitch - 3.2
  for (let q = 0; q < k; q++) {
    const s0 = q * pitch + (pitch - w) / 2, s1 = s0 + w
    for (const [z0, z1] of groups) panel(win, a, b, s0, s1, z0, z1, 0.05)
    // lobby: one tall glazed bay per pair, under a granite lintel
    panel(win, a, b, s0, s1, 0.4, LOBBY - 1.4, 0.05)
    // louvre bands: a dark strip per bay in the mechanical floors
    
  }
  // louvre bands: one dark strip along the face in each mechanical floor
  for (const [z0, z1] of BANDS) panel(louvre, a, b, 0.9, L - 0.9, z0 + 0.3, z1 - 0.3, 0.05)
}

await save('den-republic-plaza', 'Republic Plaza', [39.743496, -104.9886472], 45.2, [
  { part: granite, material: finish('republic-granite', 0xe6dfd2) },
  { part: win, material: windowVariant(2, 0x7f94a6) },
  { part: roof, material: PALETTE.roof },
  { part: louvre, material: finish('republic-louvre', 0x5d6168) },
])
