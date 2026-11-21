/**
 * Union Station, Columbia, South Carolina: the 1902 passenger station of
 * the Southern and Atlantic Coast Line railways (Frank P. Milburn), in buff
 * brick under steep brown tile hip roofs, with shouldered, stepped gables
 * and tall chimney stacks; now a restaurant. The street front (north)
 * stands two storeys tall; on the track side (south) the ground falls a
 * storey to a long flat-roofed gallery, with the station's covered porch
 * wrapping the east end.
 *
 * Frame: turned to the station, bearing 339.4° (+x runs along the tracks
 * towards 69.4°, +y to the street front). Origin at the OSM outline's
 * centroid.
 *
 * Sources
 * - OSM way/260712359 (building=retail, building:levels=2, roof:shape=gabled):
 *   the outline, rectilinear in this frame.
 * - USGS 3DEP lidar SC_SavannahPeeDee_5_2019 (2019), 1 m grid, heights above
 *   the track-side ground (y = 0): track side 0.5 m, street side 3.8–4.4 m;
 *   main eaves 13.4 m (south) and 14.5 m (north), the hip ridge 19.6 m,
 *   the central cross gable's ridge 21 m; the track-side gallery's flat
 *   roof 8.4–9.1 m; the one-storey street wing 9.2 m; the east porch roof
 *   9.4 m; the low west wing 7.6–9 m.
 * - Photos (EVIDENCE), by Eastward Gypsy, CC BY-SA 4.0:
 *   - "Union Station Columbia left oblique.jpg" (the street front's east
 *     end: stepped gable with chimney, bracketed cornice, crested one-storey
 *     bay, porch on brick piers)
 *     https://commons.wikimedia.org/wiki/File:Union_Station_Columbia_left_oblique.jpg
 *   - "Union Station Columbia South elevation.jpg" (the track side: the long
 *     hip roof, the central and west gables, the gallery, the east porch
 *     with its stair)
 *     https://commons.wikimedia.org/wiki/File:Union_Station_Columbia_South_elevation.jpg
 *   - "Union Station Columbia, SC East elevation.jpg" (the north gable's
 *     chimney rising through its middle)
 *     https://commons.wikimedia.org/wiki/File:Union_Station_Columbia,_SC_East_elevation.jpg
 *
 * Numbers
 * - Measured: plan (OSM), every height above (lidar).
 * - Estimated from the photos: window sizes and rows, the gables' shoulders
 *   and steps, the chimneys' size and height (about 2.5 m over the gable
 *   apex), the cornice depth.
 * - Simplified: the striped fabric awnings over the gallery, the porch's
 *   brackets, the cresting (drawn as plain merlons), the dormers.
 *
 * Night: windows glow; the doors are `entrance`.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, gable, grow, hip, panel, rect, tf, qf, type Rect, type Side } from './dc-white-house'
import { earcut, saveModel, type XY } from './dc-nga-west'

const BRICK = finish('union-station-brick', 0xd6c7ab)
const TILE = finish('union-station-tile', 0xa8836a)
const FLAT = finish('union-station-flat-roof', 0xbfc1bd)

/** A plate whose outline is drawn in the x–z plane, from y0 to y1. */
function plateXZ(p: Part, poly: XY[], y0: number, y1: number) {
  for (const [a, b, c] of earcut(poly)) {
    tf(p, [poly[a][0], y0, poly[a][1]], [poly[b][0], y0, poly[b][1]], [poly[c][0], y0, poly[c][1]], [0, -1, 0])
    tf(p, [poly[a][0], y1, poly[a][1]], [poly[b][0], y1, poly[b][1]], [poly[c][0], y1, poly[c][1]], [0, 1, 0])
  }
  let area = 0
  for (let i = 0; i < poly.length; i++) { const u = poly[i], v = poly[(i + 1) % poly.length]; area += u[0] * v[1] - v[0] * u[1] }
  const sg = area > 0 ? 1 : -1
  for (let i = 0; i < poly.length; i++) {
    const u = poly[i], v = poly[(i + 1) % poly.length]
    qf(p, [u[0], y0, u[1]], [v[0], y0, v[1]], [v[0], y1, v[1]], [u[0], y1, u[1]], [sg * (v[1] - u[1]), 0, -sg * (v[0] - u[0])])
  }
}

/** A shouldered, stepped gable parapet across x0..x1 from the eave ze to the apex za. */
function steppedGable(p: Part, x0: number, x1: number, ze: number, za: number, y0: number, y1: number) {
  const xm = (x0 + x1) / 2, s = 0.9
  plateXZ(p, [[x0, ze], [x1, ze], [x1, ze + 1.4], [x1 - s, ze + 1.4], [x1 - s, ze + 2.0], [xm + 0.8, za], [xm + 0.8, za + 0.6], [xm - 0.8, za + 0.6],
    [xm - 0.8, za], [x0 + s, ze + 2.0], [x0 + s, ze + 1.4], [x0, ze + 1.4]], y0, y1)
}

/** Window rows above the track-side ground: the street floors, and the gallery's glazing. */
const STREET: [number, number][] = [[5.4, 8.6], [10.0, 12.7]]

function windows(win: Part, side: Side, at: number, a0: number, a1: number, rows: [number, number][], pitch: number, w: number, skip: (c: number) => boolean = () => false) {
  const n = Math.max(1, Math.round((a1 - a0) / pitch)), step = (a1 - a0) / n
  for (let i = 0; i < n; i++) {
    const c = a0 + step * (i + 0.5)
    if (skip(c)) continue
    for (const [z0, z1] of rows) panel(win, side, at, c - w / 2, c + w / 2, z0, z1, 0.05)
  }
}

function build() {
  const brick = new Part(), trim = new Part(), tile = new Part(), win = new Part(), door = new Part(), flat = new Part()

  // ---- The main block under the long hip roof.
  const M = rect(-30, 29.5, -4, 10)
  cbox(brick, M, 0, 13.0, { top: false })
  cbox(trim, grow(M, 0.6), 13.0, 13.8, { b: 0.3, bottom: true, top: false }) // the deep bracketed cornice
  hip(tile, grow(M, 0.5), 13.8, 19.6, 6.4)

  // ---- The central cross gable: a steep tile roof to 21 m between stepped gable parapets, north and south.
  const X = rect(8, 20.5, -4.6, 12.6)
  gable(tile, brick, grow(X, 0.3, 0), 13.8, 20.6, true, [false, false])
  steppedGable(brick, X.x0, X.x1, 13.0, 20.8, X.y1 - 0.6, X.y1)
  steppedGable(brick, X.x0, X.x1, 13.0, 20.8, X.y0, X.y0 + 0.6)
  cbox(brick, rect(X.x0, X.x1, 10, X.y1), 0, 13.0, { top: false }) // the gable's bay standing forward of the north wall
  // the west gable over the track side, a smaller stepped one
  const Wg = rect(-27, -19, -4.6, 3)
  gable(tile, brick, grow(Wg, 0.3, 0), 13.8, 18.4, true, [false, false])
  steppedGable(brick, Wg.x0, Wg.x1, 13.0, 18.6, Wg.y0, Wg.y0 + 0.6)

  // ---- Chimneys: through the middle of the north gable, and at the east end (south elevation photo).
  cbox(brick, rect(13.4, 15.1, 11.6, 13.0), 13.0, 23.3, { b: 0.15 })
  cbox(trim, rect(13.2, 15.3, 11.4, 13.2), 23.3, 23.7, { bottom: true })
  cbox(brick, rect(26.2, 27.8, 2.2, 3.8), 13.0, 22.0, { b: 0.15 })
  cbox(trim, rect(26.0, 28.0, 2.0, 4.0), 22.0, 22.4, { bottom: true })

  // ---- The track-side gallery and the low west wing: flat roofs behind a coped parapet.
  const G = rect(-37.1, 29.5, -11.8, -4)
  cbox(brick, G, 0, 8.2, { top: false })
  cbox(trim, grow(G, 0.15), 8.2, 8.8, { b: 0.15, top: flat })
  const W = rect(-38.1, -30, -4, 8.6)
  cbox(brick, W, 0, 8.2, { top: false })
  cbox(trim, grow(W, 0.15), 8.2, 8.8, { b: 0.15, top: flat })

  // ---- Street-side one-storey wings with crested parapets (lidar 9.2 m).
  const N1 = rect(4.9, 21.2, 12.6, 19.1), N2 = rect(-11.8, -1.1, 10, 13.7)
  for (const r of [N1, N2]) {
    cbox(brick, r, 0, 8.6, { top: flat })
    cbox(trim, grow(r, 0.2), 8.6, 9.0, { b: 0.1, bottom: true, top: flat })
    // merlons of the cresting along the street face
    for (let x = r.x0 + 0.5; x < r.x1 - 0.4; x += 1.6) cbox(trim, rect(x, x + 0.7, r.y1 - 0.25, r.y1 + 0.2), 9.0, 9.5)
  }

  // ---- The east porch: a flat roof on brick piers, along the east end and out over the track-side stair.
  const P = rect(29.5, 35.3, -19.1, 4.0) // lidar: the porch roof reaches y = 4 (OSM stops it at -4.5)
  cbox(trim, P, 8.6, 9.4, { b: 0.15, bottom: true, top: flat })
  for (const y of [-18.6, -13.6, -8.6, -3.6, 1.4]) {
    cbox(brick, rect(34.2, 35.1, y - 0.45, y + 0.45), 0, 8.6, { top: false })
  }
  cbox(brick, rect(30, 35.1, -19.1, -18.1), 0, 4.2, { top: true }) // the stair's cheek wall

  // ---- Windows. Street front (north): two storeys above the street; track side: the gallery's
  // shopfront glazing, and the upper storey above the gallery roof.
  windows(win, 'n', 10, -29.5, -12.3, STREET, 3.4, 1.9)
  windows(win, 'n', 10, -0.6, 7.5, STREET, 3.4, 1.9)
  windows(win, 'n', 10, 21.6, 29, STREET, 3.4, 1.9)
  windows(win, 'n', X.y1, X.x0 + 1.0, X.x1 - 1.0, [[10.0, 12.7]], 3.6, 2.3)
  panel(win, 'n', X.y1, 12.9, 15.6, 15.0, 17.2, 0.05) // the gable's paired window
  windows(win, 'n', N1.y1, N1.x0 + 0.8, N1.x1 - 0.8, [[5.4, 7.9]], 3.2, 2.0)
  windows(win, 'n', N2.y1, N2.x0 + 0.6, N2.x1 - 0.6, [[5.4, 7.9]], 3.2, 2.0)
  windows(win, 's', -11.8, -36.5, 29, [[1.3, 6.4]], 3.3, 2.7)
  windows(win, 's', -4, -29.5, 29, [[9.9, 12.4]], 3.3, 1.8, (c) => c > X.x0 && c < X.x1)
  panel(win, 's', X.y0, 12.9, 15.6, 14.9, 17.0, 0.05)
  panel(win, 's', Wg.y0, -24.2, -21.8, 14.3, 16.0, 0.05)
  windows(win, 's', X.y0, X.x0 + 1.0, X.x1 - 1.0, [[9.9, 12.4]], 3.6, 2.3)
  windows(win, 'w', -38.1, -3, 7.5, [[4.8, 7.4]], 3.0, 1.8)
  windows(win, 'e', 29.5, -11.3, -4.4, [[1.3, 6.4]], 3.3, 2.4)
  windows(win, 'e', 29.5, -3.5, 9.5, [[10.0, 12.7]], 3.3, 2.0)

  // ---- Doors: the street entrance under the east porch, and the track-side doors under the gallery.
  panel(trim, 'e', 29.5, -2.6, 1.6, 4.2, 8.2, 0.03)
  panel(door, 'e', 29.5, -2.1, 1.1, 4.4, 7.4, 0.06)
  panel(door, 's', -11.8, 6.2, 9.0, 0.6, 3.6, 0.07)

  return [
    { part: brick, material: BRICK },
    { part: trim, material: PALETTE.trim },
    { part: tile, material: TILE },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: flat, material: FLAT },
  ]
}

if (import.meta.main) {
  await saveModel('cola-union-station', 'Union Station', build(), { source: 'generators/cola-union-station.ts' }, 5000)
}
