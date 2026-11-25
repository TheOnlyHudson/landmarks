/**
 * Brooklyn Point, 138 Willoughby Street, Downtown Brooklyn (Kohn Pedersen
 * Fox, 2021) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-brooklyn-point.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: area
 * centroid of the OSM outline way/700241901 (-73.982979, 40.691785).
 * Only Brooklyn Point: City Point's towers, podium parts and retail base
 * to the south are separate OSM buildings and keep drawing.
 *
 * Evidence
 * - OSM: outline way/700241901 (57 levels, height 227.1), the tower part
 *   way/1523838441 (a 41 × 22 m quadrilateral whose east side runs along
 *   Flatbush Avenue Extension at an angle; glass; 227.1), the podium part
 *   way/1523838440 (whole outline, 4 levels, 32 m) and a small part
 *   way/1144377898 (33 m) in the outline's south notch.
 * - Published (Wikipedia, "Brooklyn Point"; CTBUH): 720 ft (219.5 m) to
 *   the roof, 68 storeys by the developer's count, completed 2021, KPF;
 *   rooftop infinity pool. The roof is taken as the published 219.5 m;
 *   OSM's 227.1 m is read as the parapet and rooftop screens, so the
 *   parapet and pool screen are modelled up to 223 m (estimated).
 * - No lidar: USGS NY_NewYorkCity (2017) predates the tower.
 * - Terrain (Mapterhorn): the north half of the footprint is at street
 *   level (~13 m), the south half is in the 2017 City Point excavation pit
 *   (down to ~1–5 m). The pit has since been built over, but the map's
 *   terrain still shows it, so the model stands on the pit floor and its
 *   north side sinks ~12 m below Willoughby Street. Kept elevation 0 per
 *   evidence.md ("terrain that is wrong for the site"); flagged.
 * - Photos (Wikimedia Commons):
 *   - "Brooklyn Point Downtown Brooklyn.jpg", Kidfly182, CC BY-SA 4.0
 *   - "Brooklyn Point 003.jpg", Kidfly182, CC BY-SA 4.0
 *   - "Brooklyn Point 009.jpg", "Brooklyn Point 013.jpg", "Brooklyn Point 016.jpg", Kidfly182, CC BY 4.0
 *   - "City Point - Brooklyn (55268461473).jpg", ajay_suresh, CC BY 4.0
 *
 * Read from the photos: a plain prism with a flat top; a pale warm-grey
 * frame (the faceted precast/metal surrounds) over dark blue glass; the
 * windows are bays whose position shifts from one floor to the next, so
 * the frame zigzags; glass wraps the corners. The base is a tall pale
 * podium of pilasters with dark vertical louvre panels over a glazed
 * ground storey, and the tower stands back from it on every side.
 * The assignment mentions terracotta-coloured fins; every daylight photo
 * shows the frame pale warm grey, so the photos were followed.
 *
 * Rework after lead review (2026-11-23): the first pass drew a pale
 * masonry wall with a per-floor grid of small dark windows, a rejected
 * dot-grid look. From a distance (Downtown Brooklyn, 003) the tower is
 * almost all glass, so the shaft is now a lighter tinted curtain wall
 * (window-2, #7f96b0: the deep blue-grey of the photos pulled light per
 * STYLE.md) with a thin pale silver frame: a 0.5 m vertical per bay and a
 * 0.75 m band every three storeys, the verticals shifting a fifth of a bay
 * left and right from band to band for the zigzag. Podium, crown, height
 * and massing unchanged.
 *
 * Estimated: the bay pitch (3.4 m, counted in Brooklyn Point 013), the
 * floor height (3.1 m, roof over storeys), the stagger (a quarter bay),
 * the podium bays and louvre heights, the parapet and pool screen.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, prism, capPoly, insetRing, type XY } from './nyc-570-lexington'

const frame = new Part(), curtain = new Part(), win = new Part(), louvre = new Part(), roof = new Part(), podiumStone = new Part()

// OSM, metres from the anchor, counter-clockwise.
const OUTLINE: XY[] = [[-27.2, 17.1], [-28.3, -15.1], [-20.6, -15.4], [-20.5, -12.4], [-0.5, -13.0], [9.5, -13.4], [9.3, -16.8],
  [30.5, -17.6], [33.4, -17.7], [20.6, 15.3], [14.0, 13.9], [14.1, 15.7]]
const TOWER: XY[] = [[-23.0, -8.8], [27.8, -10.8], [18.9, 11.4], [-22.1, 13.0]]

const PODIUM = 32, ROOF = 219.5, PARAPET = 221.2, SCREEN = 223
const BAY = 3.4, FLOOR = 3.1

function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const at = (s: number, z: number, d = 0.05): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  return { L, at }
}
const panel = (p: Part, at: (s: number, z: number, d?: number) => V3, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(s0, z0, d), at(s1, z0, d), at(s1, z1, d), at(s0, z1, d))

// ---------------------------------------------------------------------------
// Podium: pale pilasters, dark louvre panels, glazed ground storey.
// ---------------------------------------------------------------------------
prism({ wall: podiumStone, win: null, roof, ring: OUTLINE, z0: 0, z1: PODIUM, facade: null, bevel: 0.4 })
for (let i = 0; i < OUTLINE.length; i++) {
  const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length]
  const { L, at } = along(a, b)
  if (L < 5) continue
  const n = Math.max(1, Math.round((L - 1.2) / 6.2)), pitch = (L - 1.2) / n
  for (let k = 0; k < n; k++) {
    const s0 = 0.6 + k * pitch + 0.75, s1 = 0.6 + (k + 1) * pitch - 0.75
    panel(win, at, s0, s1, 0.4, 7.2)          // shopfront glazing
    const c = (s0 + s1) / 2, h = (s1 - s0) * 0.3
    panel(louvre, at, c - h, c + h, 9.6, 26.5) // a tall louvre strip mid-bay
    panel(win, at, s0, s1, 27.6, 30.6)         // the glazed top storey under the coping
  }
}

// ---------------------------------------------------------------------------
// Tower: a glass curtain wall (the dominant surface) in a thin pale silver
// frame: one slim vertical per bay and a horizontal band every three
// storeys. The verticals shift a quarter bay one way then the other from
// one three-storey band to the next, which is the zigzag of the real frame
// drawn at a scale that reads as panels, not dots. Glass wraps the corners.
// ---------------------------------------------------------------------------
prism({ wall: curtain, win: null, roof: null, ring: TOWER, z0: PODIUM - 0.5, z1: ROOF, facade: null, bevel: 0.5 })
prism({ wall: frame, win: null, roof: null, ring: TOWER, z0: ROOF, z1: PARAPET, facade: null, bevel: 0.5 })
const z0 = PODIUM + 1.2, z1 = ROOF - 1.2, GROUP = 3 * FLOOR, MULL = 0.5, BAND = 0.75
const rows = Math.round((z1 - z0) / GROUP), rh = (z1 - z0) / rows
for (let i = 0; i < TOWER.length; i++) {
  const a = TOWER[i], b = TOWER[(i + 1) % TOWER.length]
  const { L, at } = along(a, b)
  const n = Math.round(L / BAY), pitch = L / n
  // Horizontal bands, edge to edge of the face (stopped at the corner bevel).
  for (let r = 0; r <= rows; r++) {
    const z = z0 + r * rh
    panel(frame, at, 0.5, L - 0.5, z - BAND / 2, z + BAND / 2, 0.06)
  }
  // Verticals: one per bay joint, shifted by row; none at the glass corners.
  for (let r = 0; r < rows; r++) {
    const lo = z0 + r * rh + BAND / 2, hi = z0 + (r + 1) * rh - BAND / 2
    const shift = (r % 2 ? 1 : -1) * pitch * 0.22
    for (let k = 1; k < n; k++) {
      const c = k * pitch + shift
      if (c < 1.5 || c > L - 1.5) continue
      panel(frame, at, c - MULL / 2, c + MULL / 2, lo, hi, 0.06)
    }
  }
}

// Roof: parapet ring, the pool deck and a pale screen round the pool and plant.
const inner = insetRing(TOWER, 0.7)
for (let i = 0; i < TOWER.length; i++) {
  const a = inner[(i + 1) % inner.length], b = inner[i] // inner face of the parapet looks inward
  frame.quad([a[0], a[1], ROOF], [b[0], b[1], ROOF], [b[0], b[1], PARAPET], [a[0], a[1], PARAPET])
  const o0 = TOWER[i], o1 = TOWER[(i + 1) % TOWER.length]
  frame.quad([o0[0], o0[1], PARAPET], [o1[0], o1[1], PARAPET], [inner[(i + 1) % 4][0], inner[(i + 1) % 4][1], PARAPET], [inner[i][0], inner[i][1], PARAPET])
}
capPoly(roof, inner, ROOF)
const screen = insetRing(TOWER, 6)
const scr: XY[] = [screen[0], [(screen[0][0] + screen[1][0]) / 2, (screen[0][1] + screen[1][1]) / 2],
  [(screen[2][0] + screen[3][0]) / 2, (screen[2][1] + screen[3][1]) / 2], screen[3]]
prism({ wall: frame, win: null, roof, ring: scr, z0: ROOF, z1: SCREEN, facade: null, bevel: 0.3 })

finishModel('Brooklyn Point', 'nyc-brooklyn-point', [
  { part: frame, material: finish('brooklyn-point-frame', 0xdcdcd8) },
  { part: curtain, material: windowVariant(2, 0x7f96b0) },
  { part: win, material: PALETTE.window },
  { part: louvre, material: finish('brooklyn-point-louvre', 0x707478) },
  { part: podiumStone, material: finish('brooklyn-point-stone', 0xd9d2c6) },
  { part: roof, material: PALETTE.roof },
], { bearing: 0, osm: 'way/700241901', height: SCREEN })
