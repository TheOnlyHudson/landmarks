/**
 * Vizcaya Museum and Gardens, main house (Villa Vizcaya), Miami
 * (3251 South Miami Avenue; 1914–1916, F. Burrall Hoffman with Paul Chalfin
 * for James Deering) — original procedural geometry, CC0-1.0.
 * bun generators/mia-vizcaya.ts
 *
 * Also exports a small kit (hipped tile roofs with eaves, punched windows,
 * quoins, chimneys, balustrades) that mia-biltmore-hotel and
 * mia-coral-gables-city-hall import; the Vizcaya model is only written when
 * this file runs itself.
 *
 * Map frame: model +y points along the bearing (53°, north-east, toward the
 * north range), +x to its right (143°, south-east, toward Biscayne Bay);
 * metres; origin at the anchor on the ground. Anchor = centroid of the OSM
 * outline way/301895039, 25.7443635, -80.2104365. The outline's walls run
 * at 53° / 143°, so the catalog bearing is 53.
 *
 * Identity, in order: a pale coral-stuccoed Italian villa, three storeys
 * round a courtyard, under red tile hipped roofs with wide eaves and tall
 * capped chimneys; two four-storey towers with low pyramid roofs at the bay
 * corners; between them the bay (east) front with its three arched
 * windows, the arched loggia over them, the balustrade and the baroque
 * crest with the weathervane; the garden (south) front with its three
 * arched doors and the open top-floor loggia; grey coral-stone quoins on
 * every corner; the glass roof over the courtyard; the arcaded entrance
 * loggia on the west.
 *
 * Night: windows glow (`window`); the bay front and the towers are
 * floodlit for evening events (`floodlight` on the stucco and stone east
 * of x = 3, gentle); the courtyard's glass roof stays dark (`glass`).
 *
 * Evidence:
 *  - plan: OSM outline way/301895039 (height 21.5). Model blocks (x, y):
 *    west range in two pavilions x -24.8..-13 (y -27.5..-9.7 and 3.6..21.4,
 *    each 2.2 m proud of the south and north fronts, as OSM draws them),
 *    the entrance link x -17..-13 between them; south range y -25.3..-13,
 *    north range y 7.5..19.3; east (bay) range x 4.3..12.2; towers
 *    x 4.4..15.6 by 11 m at both bay corners, 3.3 m proud of the bay front.
 *    USGS NAIP (public domain) for the courtyard's glass roof (about
 *    17 x 20 m) and the tile colour.
 *  - heights: lidar, NOAA Digital Coast EPT 10338 (2021 Florida coastal
 *    topobathy, public domain; the USGS 3DEP clouds listed for Miami have no
 *    points here), 0.5 m grid, measured above the ground round the house
 *    (2.0 m over the dataset's lowest ground return): main eaves 13.0,
 *    ridges 15.4, towers' eaves 18.1 and apexes 20.2, bay-front ridge 15.0
 *    behind its balustrade, crest to ~17.5, glass roof 12.4–14.4, the
 *    entrance loggia 10.6. OSM's 21.5 is within a metre of the tower tops
 *    over the lowest ground.
 *  - storeys, bays, arches, the crest, chimneys, quoins: from the photos
 *    below, scaled by the tower width (11 m).
 *  - colour: walls pale pinkish cream; quoins, balustrades and crest grey
 *    coral stone; roofs red-orange tile (photos and NAIP).
 *
 * Photos (Wikimedia Commons):
 *  - Main_house,_Villa_Vizcaya,_Miami,_Florida,_USA_-_20130909-01.jpg
 *    (Jacklee, CC BY-SA 4.0), the bay front from the south-east
 *  - Vizcaya_Museum_and_Gardens_060524_DSC6656.jpg (Leslie Platt, CC BY 2.0),
 *    the bay front and the south-east tower
 *  - Vizcaya_Museum_and_Gardens_060524_DSC6661.jpg (Leslie Platt, CC BY 2.0),
 *    the bay front from the water, both towers
 *  - Vizcaya_Museum_and_Gardens_060524_DSC6665.jpg (Leslie Platt, CC BY 2.0),
 *    the garden (south) front
 *  - Vizcaya_Museum_and_Gardens_060524_DSC6702.jpg (Leslie Platt, CC BY 2.0),
 *    the entrance loggia
 *  - Villa_Vizcaya_20110228.jpg (Averette, CC BY 3.0), the garden front
 *  Flickr: "Villa Vizcaya, Miami FL 2013" (leoncillo sabino, CC BY 2.0,
 *  flickr.com/photos/28426323@N08/11658297213), the garden front and tower.
 * No look-only sources. No commercial imagery.
 *
 * Left out: the bay terrace and its balustrade (ground, the map's), the
 * statues, urns and window surrounds, the iron balconies, the stone barge.
 *
 * Doubts: no licensed photo of the north front or the west pavilions'
 * west faces; both are drawn with the south front's window rhythm. The
 * lead's note says "four corner towers"; lidar and photos show towers only
 * at the two bay corners, the west corners being pavilions under the main
 * roof (their hips peak ~0.5 m over the ridges).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { archPanel, pinnacle } from './mia-freedom-tower'

// ---------------------------------------------------------------------------
// Kit for this builder's Mediterranean-revival mia- models.

/**
 * A hipped roof with eaves over x0..x1, y0..y1: eaves `oh` past the walls at
 * ze (dropping with the pitch), ridge zr along the longer side, a soffit
 * underneath. A square plan gives a pyramid.
 */
export function hip(roof: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, oh = 0.6) {
  const w = x1 - x0, d = y1 - y0, alongX = w >= d, half = Math.min(w, d) / 2
  const ez = ze - (oh * (zr - ze)) / half
  const X0 = x0 - oh, X1 = x1 + oh, Y0 = y0 - oh, Y1 = y1 + oh
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = Math.abs(w - d) / 2
  const A: V3 = alongX ? [cx - r, cy, zr] : [cx, cy - r, zr], B: V3 = alongX ? [cx + r, cy, zr] : [cx, cy + r, zr]
  const sw: V3 = [X0, Y0, ez], se: V3 = [X1, Y0, ez], ne: V3 = [X1, Y1, ez], nw: V3 = [X0, Y1, ez]
  const q = (a: V3, b: V3, c: V3, e: V3) => { if (r < 1e-3) roof.tri(a, b, c); else roof.quad(a, b, c, e) }
  if (alongX) {
    q(sw, se, B, A); q(ne, nw, A, B); roof.tri(se, ne, B); roof.tri(nw, sw, A)
  } else {
    q(se, ne, B, A); q(nw, sw, A, B); roof.tri(sw, se, A); roof.tri(ne, nw, B)
  }
  roof.quad(sw, nw, ne, se) // soffit, facing down
}

/** A gabled tile prism with eaves along x (or y): gable ends closed in `wall`, both ends optional. */
export function ridge(roof: Part, wall: Part | null, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, oh = 0.6, alongY = false) {
  if (alongY) {
    const half = (x1 - x0) / 2, ez = ze - (oh * (zr - ze)) / half, xm = (x0 + x1) / 2
    roof.quad([x1 + oh, y0, ez], [x1 + oh, y1, ez], [xm, y1, zr], [xm, y0, zr])
    roof.quad([x0 - oh, y1, ez], [x0 - oh, y0, ez], [xm, y0, zr], [xm, y1, zr])
    roof.quad([x0 - oh, y0, ez], [x0 - oh, y1, ez], [x1 + oh, y1, ez], [x1 + oh, y0, ez])
    if (wall) { wall.tri([x0, y0, ze], [x1, y0, ze], [xm, y0, zr]); wall.tri([x1, y1, ze], [x0, y1, ze], [xm, y1, zr]) }
  } else {
    const half = (y1 - y0) / 2, ez = ze - (oh * (zr - ze)) / half, ym = (y0 + y1) / 2
    roof.quad([x0, y0 - oh, ez], [x1, y0 - oh, ez], [x1, ym, zr], [x0, ym, zr])
    roof.quad([x1, y1 + oh, ez], [x0, y1 + oh, ez], [x0, ym, zr], [x1, ym, zr])
    roof.quad([x0, y0 - oh, ez], [x0, y1 + oh, ez], [x1, y1 + oh, ez], [x1, y0 - oh, ez])
    if (wall) { wall.tri([x0, y1, ze], [x0, y0, ze], [x0, ym, zr]); wall.tri([x1, y0, ze], [x1, y1, ze], [x1, ym, zr]) }
  }
}

/** A closed box x0..x1, y0..y1, z0..z1 (walls and top). */
export function solid(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = p) {
  const r = rect(x0, y0, x1, y1)
  walls(p, r, z0, z1)
  if (top) cap(top, r, z1)
}

/** Punched windows on wall a→b: one panel per column centre `cs` (width w) per storey [z0, z1]. */
export function punched(p: Part, a: XY, b: XY, cs: number[], w: number, rows: [number, number][], out = 0.05) {
  for (const c of cs) for (const [z0, z1] of rows) panel(p, a, b, c - w / 2, c + w / 2, z0, z1, out)
}

/** Evenly spaced column centres: n columns over a wall of length L, `end` metres clear at each end. */
export const cols = (L: number, n: number, end: number) =>
  Array.from({ length: n }, (_, i) => (n === 1 ? L / 2 : end + ((L - 2 * end) * i) / (n - 1)))

/** Quoin strips at both ends of wall a→b, `w` wide, z0..z1. */
export function quoins(p: Part, a: XY, b: XY, z0: number, z1: number, w = 0.9, out = 0.03) {
  const { L } = onWall(a, b)
  panel(p, a, b, 0, w, z0, z1, out)
  panel(p, a, b, L - w, L, z0, z1, out)
}

/** A chimney stack with a projecting slab and a small tile hip cap. */
export function chimney(wall: Part, roof: Part, x: number, y: number, z0: number, z1: number, w = 1.0, d = 1.3) {
  solid(wall, x - w / 2, y - d / 2, x + w / 2, y + d / 2, z0, z1, null)
  solid(wall, x - w / 2 - 0.25, y - d / 2 - 0.25, x + w / 2 + 0.25, y + d / 2 + 0.25, z1, z1 + 0.25, null)
  hip(roof, x - w / 2 - 0.25, y - d / 2 - 0.25, x + w / 2 + 0.25, y + d / 2 + 0.25, z1 + 0.25, z1 + 0.85, 0.1)
}

/** A solid balustrade along wall a→b from s0 to s1: a rail t thick standing z0..z1, `out` proud of the wall line. */
export function balustrade(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, t = 0.3, out = 0) {
  const { P } = onWall(a, b)
  const o0 = out, o1 = out - t
  p.quad(P(s0, z0, o0), P(s1, z0, o0), P(s1, z1, o0), P(s0, z1, o0))
  p.quad(P(s1, z0, o1), P(s0, z0, o1), P(s0, z1, o1), P(s1, z1, o1))
  p.quad(P(s0, z1, o0), P(s1, z1, o0), P(s1, z1, o1), P(s0, z1, o1))
  p.quad(P(s0, z0, o1), P(s0, z0, o0), P(s0, z1, o0), P(s0, z1, o1))
  p.quad(P(s1, z0, o0), P(s1, z0, o1), P(s1, z1, o1), P(s1, z1, o0))
}

/** The four walls of a rectangle, counter-clockwise: [south, east, north, west] as [a, b] pairs. */
export const faces = (x0: number, y0: number, x1: number, y1: number): [XY, XY][] => [
  [[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]],
]

// ---------------------------------------------------------------------------
// Vizcaya

function build() {
  const stucco = new Part(), stone = new Part(), win = new Part(), tile = new Part(), glass = new Part()

  const EAVE = 13.0, RIDGE = 15.4, TEAVE = 18.1, TAPEX = 20.2
  // Storey bands: ground, piano nobile, top floor, tower floor.
  const G: [number, number] = [1.3, 3.9], PN: [number, number] = [5.5, 8.0], TOP: [number, number] = [9.8, 11.6], TW: [number, number] = [14.0, 16.4]

  // --- Blocks.
  const SW = [-24.8, -27.5, -13.0, -9.7] as const, NW = [-24.8, 3.6, -13.0, 21.4] as const
  const SR = [-13.0, -25.3, 4.4, -13.0] as const, NR = [-13.0, 7.5, 4.4, 19.3] as const
  const ER = [4.4, -14.1, 12.2, 8.5] as const
  const SET = [4.4, -25.2, 15.6, -14.1] as const, NET = [4.4, 8.5, 15.6, 19.5] as const
  const LINK = [-17.0, -9.7, -13.0, 3.6] as const
  const COURT = [-13.0, -13.0, 4.4, 7.5] as const

  for (const b of [SW, NW, SR, NR, ER]) solid(stucco, b[0], b[1], b[2], b[3], 0, EAVE, null)
  for (const b of [SET, NET]) solid(stucco, b[0], b[1], b[2], b[3], 0, TEAVE, null)
  solid(stucco, LINK[0], LINK[1], LINK[2], LINK[3], 0, 12.2, null)
  solid(stucco, COURT[0], COURT[1], COURT[2], COURT[3], 0, 12.4, null)

  // --- Roofs.
  hip(tile, SW[0], SW[1], SW[2], SW[3], EAVE, RIDGE + 0.4, 0.7)
  hip(tile, NW[0], NW[1], NW[2], NW[3], EAVE, RIDGE + 0.4, 0.7)
  ridge(tile, null, -18.9, SR[1], 10, SR[3], EAVE, RIDGE, 0.7)
  ridge(tile, null, -18.9, NR[1], 10, NR[3], EAVE, RIDGE, 0.7)
  ridge(tile, null, ER[0], -19.6, ER[2], 14.0, EAVE, 15.0, 0.4, true)
  hip(tile, LINK[0], LINK[1], LINK[2] + 2, LINK[3], 12.2, 13.0, 0.5)
  hip(tile, SET[0], SET[1], SET[2], SET[3], TEAVE, TAPEX, 0.9)
  hip(tile, NET[0], NET[1], NET[2], NET[3], TEAVE, TAPEX, 0.9)
  // The courtyard's low glass roof.
  hip(glass, COURT[0] + 0.2, COURT[1] + 0.2, COURT[2] - 0.2, COURT[3] - 0.2, 12.5, 14.4, 0)
  // Its iron frame, as a few bold bars over the glass (NAIP shows the grid).
  {
    const [x0, y0, x1, y1] = [COURT[0] + 0.2, COURT[1] + 0.2, COURT[2] - 0.2, COURT[3] - 0.2]
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hw = (x1 - x0) / 2, hd = (y1 - y0) / 2
    const zAt = (x: number, y: number) => {
      // height of the hip surface (ridge along y) at (x, y)
      const r = hd - hw, dx = hw - Math.abs(x - cx), dy = hd - Math.abs(y - cy)
      return 12.5 + (14.4 - 12.5) * Math.min(dx / hw, dy / hw, (Math.abs(y - cy) <= r ? dx : dx) / hw) + 0.06
    }
    for (const t of [-0.5, 0, 0.5]) {
      const x = cx + t * hw
      for (let k = 0; k < 6; k++) {
        const ya = y0 + ((y1 - y0) * k) / 6, yb = y0 + ((y1 - y0) * (k + 1)) / 6
        stone.quad([x - 0.15, ya, zAt(x, ya)], [x + 0.15, ya, zAt(x, ya)], [x + 0.15, yb, zAt(x, yb)], [x - 0.15, yb, zAt(x, yb)])
      }
      const y = cy + t * hd
      for (let k = 0; k < 6; k++) {
        const xa = x0 + ((x1 - x0) * k) / 6, xb = x0 + ((x1 - x0) * (k + 1)) / 6
        stone.quad([xa, y - 0.15, zAt(xa, y)], [xb, y - 0.15, zAt(xb, y)], [xb, y + 0.15, zAt(xb, y)], [xa, y + 0.15, zAt(xa, y)])
      }
    }
  }

  // Chimneys, tall with tile caps.
  for (const [x, y] of [[-9.5, -21.6], [-1.5, -21.6], [-9.5, 15.8], [-1.5, 15.8], [-21.0, -23.5], [-21.0, 17.4], [7.0, -10.5], [7.0, 5.0]] as XY[]) {
    chimney(stucco, tile, x, y, 13.5, 17.6)
  }

  // --- Quoins on every corner of the towers and pavilions.
  for (const b of [SET, NET]) for (const [a, c] of faces(b[0], b[1], b[2], b[3])) quoins(stone, a, c, 0, TEAVE)
  for (const b of [SW, NW]) for (const [a, c] of faces(b[0], b[1], b[2], b[3])) quoins(stone, a, c, 0, EAVE)
  // A cornice band under the eaves of the towers.
  for (const b of [SET, NET]) for (const [a, c] of faces(b[0], b[1], b[2], b[3])) panel(stone, a, c, 0, onWall(a, c).L, TEAVE - 0.7, TEAVE, 0.08)

  // --- Garden (south) front.
  {
    const a: XY = [SR[0], SR[1]], b: XY = [SR[2], SR[1]] // x -13 .. 4.4 along +x
    const L = SR[2] - SR[0], m = L / 2
    // Three arched doors in the middle, the open loggia over them on the top floor.
    for (const s of [m - 2.5, m, m + 2.5]) archPanel(win, a, b, s - 0.95, s + 0.95, 0.4, 3.6)
    punched(win, a, b, [m - 2.5, m, m + 2.5], 1.3, [PN])
    panel(stone, a, b, m - 4.4, m + 4.4, 9.3, 9.75, 0.06) // loggia sill
    for (let k = 0; k < 5; k++) panel(win, a, b, m - 4.2 + k * 1.7 + 0.15, m - 4.2 + (k + 1) * 1.7 - 0.15, 9.75, 12.2, 0.05)
    punched(win, a, b, [1.6, L - 1.6], 1.3, [G, PN, TOP])
    // South-west pavilion and south-east tower.
    const pa: XY = [SW[0], SW[1]], pb: XY = [SW[2], SW[1]]
    punched(win, pa, pb, cols(SW[2] - SW[0], 3, 2.4), 1.3, [G, PN, TOP])
    const ta: XY = [SET[0], SET[1]], tb: XY = [SET[2], SET[1]]
    punched(win, ta, tb, cols(SET[2] - SET[0], 3, 2.4), 1.3, [G, PN, TOP, TW])
  }

  // --- Bay (east) front between the towers: three arched windows, the
  // arched loggia over them, attic windows, balustrade and crest.
  {
    const a: XY = [ER[2], ER[1]], b: XY = [ER[2], ER[3]] // y -14.1 .. 8.5 along +y
    const L = ER[3] - ER[1], m = L / 2
    for (const s of [m - 2.9, m, m + 2.9]) archPanel(win, a, b, s - 1.15, s + 1.15, 0.5, 4.1)
    punched(win, a, b, [2.4, L - 2.4], 1.3, [G])
    archPanel(win, a, b, m - 1.2, m + 1.2, 5.3, 8.0)
    punched(win, a, b, [2.4, 5.6, L - 5.6, L - 2.4], 1.3, [PN, TOP])
    // Balustrade along the front, and the crest: a curved stone pediment with
    // a finial and the weathervane.
    balustrade(stone, a, b, 0, L, EAVE, EAVE + 1.2, 0.35, 0.05)
    panel(stone, a, b, 0, L, 4.6, 5.0, 0.07) // string course
    const { P } = onWall(a, b)
    const W = 5.0, n = 10, Z0 = EAVE, ZC = EAVE + 4.0
    const crest = (s: number) => Z0 + 1.6 + (ZC - Z0 - 1.6) * Math.cos(((s - m) / W) * (Math.PI / 2))
    for (let k = 0; k < n; k++) {
      const s0 = m - W + (2 * W * k) / n, s1 = m - W + (2 * W * (k + 1)) / n
      for (const o of [0.25, -0.35]) {
        const [u0, u1] = o > 0 ? [s0, s1] : [s1, s0]
        stone.quad(P(u0, Z0, o), P(u1, Z0, o), P(u1, crest(u1), o), P(u0, crest(u0), o))
      }
      stone.quad(P(s0, crest(s0), 0.25), P(s1, crest(s1), 0.25), P(s1, crest(s1), -0.35), P(s0, crest(s0), -0.35))
    }
    for (const s of [m - W, m + W]) stone.quad(P(s, Z0, -0.35), P(s, Z0, 0.25), P(s, crest(s), 0.25), P(s, crest(s), -0.35))
    const c = P(m, 0, -0.05)
    pinnacle(stone, c[0], c[1], ZC - 0.1, 1.6, 0.45, 8)
    // The vane: a thin rod and plate.
    solid(stone, c[0] - 0.08, c[1] - 0.08, c[0] + 0.08, c[1] + 0.08, ZC + 1.3, ZC + 3.0)
    stone.quad([c[0], c[1] - 0.6, ZC + 2.4], [c[0], c[1] + 0.6, ZC + 2.4], [c[0], c[1] + 0.6, ZC + 2.8], [c[0], c[1] - 0.6, ZC + 2.8])
    stone.quad([c[0], c[1] + 0.6, ZC + 2.4], [c[0], c[1] - 0.6, ZC + 2.4], [c[0], c[1] - 0.6, ZC + 2.8], [c[0], c[1] + 0.6, ZC + 2.8])
    disc(win, a, b, m - 2.4, ZC - 1.3, 0.45)
    disc(win, a, b, m + 2.4, ZC - 1.3, 0.45)
  }

  // --- Towers' other faces.
  for (const b of [SET, NET]) {
    const [s, e, nn] = faces(b[0], b[1], b[2], b[3])
    const Lx = b[2] - b[0], Ly = b[3] - b[1]
    punched(win, e[0], e[1], cols(Ly, 3, 2.4), 1.3, [G, PN, TOP, TW])
    if (b === NET) punched(win, nn[0], nn[1], cols(Lx, 3, 2.4), 1.3, [G, PN, TOP, TW])
    void s
  }

  // --- North front (no photo: drawn like the south).
  {
    const a: XY = [NR[2], NR[3]], b: XY = [NR[0], NR[3]]
    const L = NR[2] - NR[0]
    punched(win, a, b, cols(L, 5, 1.6), 1.3, [G, PN, TOP])
    punched(win, [NW[2], NW[3]], [NW[0], NW[3]], cols(NW[2] - NW[0], 3, 2.4), 1.3, [G, PN, TOP])
  }

  // --- West front: the pavilions, and the arcaded entrance loggia between.
  {
    for (const b of [SW, NW]) punched(win, [b[0], b[3]], [b[0], b[1]], cols(b[3] - b[1], b === SW ? 4 : 4, 2.2), 1.3, [G, PN, TOP])
    // Pavilions' inner (link-facing) walls.
    punched(win, [LINK[0], SW[3]], [SW[0], SW[3]], [3.9], 1.2, [PN, TOP])
    punched(win, [NW[0], NW[1]], [LINK[0], NW[1]], [3.9], 1.2, [PN, TOP])
    // The link's upper wall over the loggia.
    punched(win, [LINK[0], LINK[3]], [LINK[0], LINK[1]], cols(LINK[3] - LINK[1], 3, 3), 1.3, [TOP])
    const LG = [-20.6, -8.6, -17.0, 2.5] as const
    solid(stucco, LG[0], LG[1], LG[2], LG[3], 0, 9.6, null)
    hip(tile, LG[0], LG[1], LG[2], LG[3], 9.6, 10.6, 0.4)
    const a: XY = [LG[0], LG[3]], b: XY = [LG[0], LG[1]], L = LG[3] - LG[1]
    for (const s of [L / 2 - 3.4, L / 2, L / 2 + 3.4]) archPanel(win, a, b, s - 1.35, s + 1.35, 0.6, 5.6)
    panel(stone, a, b, 0, L, 8.6, 9.6, 0.06)
    for (const [aa, bb] of [[[LG[0], LG[1]], [LG[2], LG[1]]], [[LG[2], LG[3]], [LG[0], LG[3]]]] as [XY, XY][]) archPanel(win, aa, bb, 0.9, 2.7, 0.6, 5.0)
  }

  // Floodlight: the bay front and the towers, gently.
  const lit = (p: V3, n: V3) => (p[0] < 3 ? 0 : n[2] > 0.7 ? 0.2 : 0.5 + 0.3 * Math.min(1, p[2] / 18))
  return [
    { part: stucco, material: { ...finish('vz-stucco', 0xf2e2d5), floodlight: lit } },
    { part: stone, material: { ...finish('vz-coral', 0xd9d0c1), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: tile, material: finish('vz-tile', 0xb9694f, 0.9) },
    { part: glass, material: PALETTE.glass },
  ]
}

/** A round disc on wall a→b (oculus). */
function disc(p: Part, a: XY, b: XY, s: number, z: number, r: number, seg = 12) {
  const { P } = onWall(a, b)
  const c = P(s, z, 0.33)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    p.tri(c, P(s + r * Math.cos(t0), z + r * Math.sin(t0), 0.33), P(s + r * Math.cos(t1), z + r * Math.sin(t1), 0.33))
  }
}

if (import.meta.main) await save('mia-vizcaya', 'Vizcaya Museum and Gardens', [25.7443635, -80.2104365], 53, build(), 5000)
