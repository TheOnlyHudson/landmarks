/**
 * Ralph L. Carr Colorado Judicial Center, Denver (2013, Fentress Architects):
 * the courts wing and the 12-storey office tower — original procedural
 * geometry, CC0-1.0.
 * bun generators/den-ralph-carr-judicial-center.ts
 *
 * Map frame: x east, y north, z up, metres. Anchor -104.98672, 39.73765,
 * between the courts wing (OSM way/53086055) and the tower (way/53086059);
 * bearing 0.
 *
 * Identity (photos below):
 *  1. Pale grey granite neoclassical courts wing: a four-column portico in
 *     antis under a tall entablature ("Liberty and Justice for All") on the
 *     north front, beside a low colonnade of tall columns in front of glass
 *     along the slanted north-east wing.                      (dror, wg)
 *  2. The glass rotunda drum rising over the colonnade.          (dror, wg)
 *  3. The 12-storey granite office tower to the south, with vertical piers,
 *     tall window bays and a colonnaded base.                   (sw, riot)
 *
 * Plan: OSM way/53086055 and way/53086059 (no parts mapped); the courts
 * wing's blocks split where the lidar's heights change.
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid,
 * ground_min 1595.25 m (a loading ramp); y = 0 is 3.0 m above it, the
 * lowest street ground on the west (the east side is 1.5–2 m higher).
 * Measured (medians, model metres): tower roof 60.0, its north strip 54.9,
 * parapet and plant to 63.3; courts west block 27.8; middle block 24.4 with
 * an attic of 29.2 on the south; the rotunda 32.4; the portico 18.3; the
 * colonnade wing 14.1; the south link 16.0.
 * Estimated: column counts and spacing (portico columns 2.3 m thick, the
 * colonnade's 1.7 m, two storeys; the tower's 15 m column screen), the colonnade's depth (2.5 m) and
 * the rotunda's radius (7 m) from dror and the lidar; storey groups and
 * window bays from the photos.
 *
 * Photos (evidence, Wikimedia Commons):
 *  dror  "Colorado Supreme Court.jpg", Drorzm, CC0 (the north front, under
 *        construction)
 *  wg    "Colorado Court of Appeals 2014.jpg", Wikigringo, CC BY-SA 3.0
 *        (from the north-west)
 *  sw    "Ralph L. Carr Colorado Judicial Center, SW corner.jpg", Xnatedawgx,
 *        CC BY-SA 4.0 (the tower)
 *  riot  "Colorado Judicial Center after summer rioting 2020-08-01.jpg",
 *        Xnatedawgx, CC BY-SA 4.0 (the tower from 14th Ave)
 *  aerial USGS NAIP orthophoto (public domain)
 * No look-only sources. No commercial imagery. Doubt: the courts wing's
 * west and south sides are in no photo; the portico's side (north) is read
 * from the lidar's projecting 18 m block and the dror view.
 *
 * Night: the windows, the colonnade's glass and the rotunda glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, capPoly, ccw, edgePanels, prism, revolve, save, type XY } from './atl-tech-tower'
import { circle, column, smoothWall, split } from './atl-flatiron-building'

const gran = new Part(), roof = new Part(), win = new Part(), rot = new Part()
const PAN = { group: 7.5, gap: 1.6, bay: 4.4, pier: 1.6, margin: 1.4 }

function blockWithBays(x0: number, x1: number, y0: number, y1: number, z1: number, faces: boolean[], z0w = 4, z1w = z1 - 3.5) {
  box(gran, x0, x1, y0, y1, 0, z1, roof, 0.45)
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  r.forEach((a, i) => { if (faces[i]) edgePanels(win, a, r[(i + 1) % 4], z0w, z1w, PAN) })
}

// ── The office tower (way/53086059) ──
{
  const ring: XY[] = ccw([[-42.96, -29.04], [-43.1, -71.82], [35.67, -72.07], [35.79, -35.68], [19.47, -35.63], [19.49, -29.26]])
  const BASE = 15
  // the shaft over a recessed, glazed base behind a screen of tall columns (sw, riot)
  prism(gran, ring, BASE, 54.9, roof, 0.45)
  capPoly(gran, ring, BASE, false)
  const inner: XY[] = ccw([[-40.4, -31.6], [-40.5, -69.3], [33.1, -69.5], [33.2, -38.2], [19.47, -38.2], [19.49, -31.6]])
  prism(win, split(inner, 5), 0, BASE, null, 0)
  box(gran, -42.9, 35.6, -71.8, -35.7, 54.9, 60.0, roof, 0.4)
  box(roof, -20, 12, -62, -45, 60.0, 63.3, roof, 0.3)
  // calm grouped bays: three storeys a panel, wide piers
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    edgePanels(win, a, b, BASE + 1.5, 53, { group: 12.5, gap: 2.2, bay: 5.2, pier: 2.2, margin: 3, min: 5 })
  }
  // the column screen on the west, south and east fronts
  const screen: [XY, XY][] = [[[-43.1, -31.5], [-43.1, -71.82]], [[-43.1, -71.82], [35.67, -72.07]], [[35.67, -72.07], [35.79, -35.68]]]
  for (const [a, b] of screen) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 5.2)
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [-t[1] * 1.2, t[0] * 1.2]
    for (let k = 0; k <= n; k++) column(gran, [a[0] + t[0] * (L * k / n) + o[0], a[1] + t[1] * (L * k / n) + o[1]], 0.85, 0, BASE, 12)
  }
}

// ── The courts wing (way/53086055) ──
blockWithBays(-33.27, -14, -10.5, 52, 27.8, [false, true, false, true])
blockWithBays(-14, 27.24, -10.7, 24, 24.4, [false, true, false, false])
blockWithBays(-14, -2, 24, 46, 24.4, [false, true, true, false])
blockWithBays(10, 27.24, 24, 38, 24.4, [false, true, true, false])
// the colonnade wing's roof runs in under the rotunda
box(gran, -2, 10, 24, 46, 0, 14.1, roof, 0.35)
box(gran, -12, 8, -10.7, -5, 24.4, 29.2, roof, 0.35)
// the south link to the tower
blockWithBays(-17.4, 11.1, -28.6, -10.6, 16.0, [true, true, false, true])
// the glass rotunda: a curved glass drum with granite bands and a low glass dome
{
  const c: XY = [4, 31]
  smoothWall(rot, circle(c, 7.4, 20), 14.1, 30.4)
  for (const z of [18.6, 23.1, 27.6]) smoothWall(gran, circle(c, 7.55, 20), z, z + 0.45)
  smoothWall(gran, circle(c, 7.7, 20), 30.4, 31.3)
  capPoly(gran, circle(c, 7.7, 20), 31.3, true)
  revolve(rot, c, [[7.0, 31.3], [5.6, 32.2], [3.2, 32.8], [0, 33.0]], 20)
}
// the colonnade wing on the slanted north-east front
{
  const wing: XY[] = ccw([[-4.55, 46], [27.3, 46], [28.8, 70.92], [24.03, 66.91], [17.48, 63.03], [8.99, 58.93], [-4.55, 53.44]])
  // glass set back behind the columns, a roof slab over all
  const glassR: XY[] = ccw([[-2, 46], [25, 46], [26.2, 66.2], [23, 63.8], [16.5, 60.6], [8.6, 56.4], [-2, 52]])
  prism(win, glassR, 0, 12.0, null, 0)
  prism(gran, wing, 12.0, 14.1, roof, 0.35, true)
  // columns along the north-east edges
  const edges: [XY, XY][] = [[[28.8, 70.92], [24.03, 66.91]], [[24.03, 66.91], [17.48, 63.03]], [[17.48, 63.03], [8.99, 58.93]], [[8.99, 58.93], [-4.55, 53.44]], [[27.3, 46], [28.8, 70.92]]]
  for (const [a, b] of edges) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 4.6))
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [-t[1] * 1.1, t[0] * 1.1]
    for (let k = 0; k <= n; k++) {
      const p: XY = [a[0] + t[0] * (L * k / n) + o[0], a[1] + t[1] * (L * k / n) + o[1]]
      column(gran, p, 0.85, 0, 12.0, 12)
    }
  }
}
// the portico in antis on the north front
{
  const x0 = -18.5, x1 = -4.6, y0 = 52.3, y1 = 58.6
  // glass behind the columns and the stone ends (antae)
  box(win, x0 + 1.6, x1 - 1.6, y0 - 1, y0 + 0.4, 0, 13.6, null, 0)
  box(gran, x0, x0 + 1.6, y0 - 0.5, y1, 0, 13.6, null, 0.2)
  box(gran, x1 - 1.6, x1, y0 - 0.5, y1, 0, 13.6, null, 0.2)
  for (let k = 0; k < 4; k++) column(gran, [x0 + 3.0 + k * ((x1 - x0 - 6.0) / 3), y1 + 0.2], 1.15, 0, 13.6, 14)
  // the entablature with its inscription band, drawn plain
  box(gran, x0 - 0.4, x1 + 0.4, y0 - 0.5, y1 + 1.8, 13.6, 18.3, roof, 0.4, true)
  box(gran, x0 - 0.8, x1 + 0.8, y0 - 0.5, y1 + 2.2, 17.5, 18.3, null, 0.2)
  box(gran, x0, x0 + 1.6, y1, y1 + 1.4, 0, 13.6, null, 0.2)
  box(gran, x1 - 1.6, x1, y1, y1 + 1.4, 0, 13.6, null, 0.2)
}

void (null as unknown as V3)
await save('den-ralph-carr-judicial-center', 'Ralph L. Carr Colorado Judicial Center', [
  { part: gran, material: finish('carr-granite', 0xd6d4ce) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: rot, material: windowVariant(2, 0xa9bfd1) },
], { height: 63.3, anchor: [39.73765, -104.98672], bearing: 0 })
