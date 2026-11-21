/**
 * Tower at 1301 Gervais (built 1973 for Bankers Trust; Lyles, Bissett,
 * Carlisle & Wolff), Columbia, SC — original procedural geometry, CC0-1.0.
 * bun generators/cola-tower-at-1301-gervais.ts
 *
 * Map frame: x east, y north, z up, metres; built in a frame turned to the
 * downtown grid, bearing 69 (+y toward 69°, along Gervais Street; +x toward
 * 159°, the Gervais front). Anchor = centroid of OSM way/329094457 ("Tower
 * at 1301 Gervais", building=commercial, 20 levels), 34.002192, -81.031596.
 *
 * Identity: a sheer, flat-topped slab, uniformly dark: bronze-black glazing
 * between full-height anodized aluminium columns that divide each face into
 * broad bays (ten on the long faces, four on the ends), a plain dark
 * parapet band at the top, and a recessed lobby storey at the foot.
 *
 * Evidence:
 *  - plan: OSM way/329094457, drawn as the rectangle x -12.6..12.2,
 *    y -31.65..31.5; the 2019 lidar matches it to a metre. The 2.7 m bump
 *    on the east side (x 12.2..14.9, y 7.5..14.3) shows no height in the
 *    lidar and is drawn as a one-storey vestibule.
 *  - heights: published roof 278 ft = 84.7 m, 20 floors (Wikipedia, citing
 *    Emporis). USGS 3DEP SC_SavannahPeeDee_5_2019 (2019 flight), 1 m grid:
 *    roof 84.4 m, parapet 84.7 m, a penthouse about 86.5 m (x -9..3,
 *    y 6..15). Two sunken roof wells at 78.8 m inside the parapet at the
 *    ends are left out (they can't be seen from the street).
 *  - bays: counted on Dr. Blazer's photo (ten broad bays on the long face,
 *    four on the end). Panels grouped three floors to a band (STYLE.md);
 *    the real spandrels are as dark as the glass.
 *  - colour: dark bronze glass and anodized aluminium (Wikipedia: "dark
 *    glazing with anodized aluminum columns to give it a dark, uniformly
 *    colored appearance"; both photos), pulled up to charcoal.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Tower at 1301 Gervias.jpg, Dr. Blazer, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Tower_at_1301_Gervias.jpg
 *  - Wilbur Smith building - 1301 Gervais St, Columbia, SC.jpg,
 *    omk_489 from Louisiana, USA, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Wilbur_Smith_building_-_1301_Gervais_St,_Columbia,_SC.jpg
 * Plan check: USGS NAIP orthophoto (public domain). No look-only sources.
 * No commercial imagery.
 *
 * Doubts: the north and west faces are unphotographed and drawn like the
 * others; the rooftop signs are left out; the lobby recess is simplified to
 * a glazed band between the columns.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, capPoly, ledge, offset, prism, save, wall, type XY } from './atl-flatiron-building'
import { rectOn } from './cola-palmetto-building'

const body = new Part(), win = new Part(), roof = new Part(), lobby = new Part()

const X0 = -12.6, X1 = 12.2, Y0 = -31.65, Y1 = 31.5
const ring: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
const ROOF = 84.4, TOP = 84.7, SHAFT0 = 6.4, SHAFT1 = 81.4

// The shaft stands on a recessed, glazed lobby storey; the columns carry
// on down to the ground in front of it.
prism(body, ring, SHAFT0, TOP, null, 0.3)
capPoly(body, ring, SHAFT0, false)
const core = offset(ring, -1.6)
prism(lobby, core, 0, SHAFT0, null, 0)
const inner = offset(ring, -0.7)
wall(body, [...inner].reverse(), ROOF, TOP)
ledge(body, offset(ring, -0.3), inner, TOP)
prism(roof, inner, ROOF - 0.01, ROOF, roof, 0)

// Bays: broad bays of dark glazing between full-height aluminium columns
// (ten on the long faces, four on the ends). The glazing is grouped three
// floors to a panel, with only a thin spandrel line between groups, so the
// columns read unbroken from the lobby to the parapet band, as they do.
const groups = 6, gh = (SHAFT1 - SHAFT0) / groups
for (let i = 0; i < 4; i++) {
  const a = ring[i], b = ring[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L, nx = ty, ny = -tx
  const n = L > 40 ? 10 : 4, corner = 1.6, pier = 1.0
  const w = (L - 2 * corner + pier) / n
  for (let k = 0; k < n; k++) {
    const s0 = corner + k * w, s1 = s0 + w - pier
    for (let g = 0; g < groups; g++) rectOn(win, a, b, s0, s1, SHAFT0 + g * gh + 0.12, SHAFT0 + (g + 1) * gh - 0.12)
  }
  // Columns down to the ground in front of the lobby (corners included).
  for (let k = 0; k <= n; k++) {
    const s = k === 0 ? corner / 2 : k === n ? L - corner / 2 : corner + k * w - pier / 2
    const hw = k === 0 || k === n ? corner / 2 : pier / 2
    const c: XY = [a[0] + tx * s, a[1] + ty * s]
    const xs = [c[0] - tx * hw, c[0] + tx * hw, c[0] - tx * hw - nx * 1.6, c[0] + tx * hw - nx * 1.6]
    const ys = [c[1] - ty * hw, c[1] + ty * hw, c[1] - ty * hw - ny * 1.6, c[1] + ty * hw - ny * 1.6]
    box(body, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), 0, SHAFT0, null, 0)
  }
}

// Penthouse and the east vestibule.
box(body, -9, 3, 6, 15, ROOF, 86.6, roof, 0.3)
box(body, X1 - 0.3, 14.9, 7.5, 14.3, 0, 5.0, roof, 0.3)
rectOn(lobby, [14.9, 7.5], [14.9, 14.3], 0.8, 6.0, 0.4, 3.8)

await save('cola-tower-at-1301-gervais', 'Tower at 1301 Gervais', [
  { part: body, material: finish('gervais-bronze', 0x645e57) },
  { part: win, material: windowVariant(2, 0x4a4f57) },
  { part: lobby, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { height: 86.6, anchor: [34.002192, -81.031596], bearing: 69 })
