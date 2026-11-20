/**
 * 1801 California Street (1983, Johnson-Fain and Pereira Associates),
 * Denver — original procedural geometry, CC0-1.0.
 * bun generators/den-1801-california.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = centroid of the OSM outline
 * way/304666082 (tower, podium and the parking garage as one outline),
 * -104.9895993, 39.7478912. The tower's walls run north–south and east–west,
 * so the bearing is 0; the podium and garage follow the 45° street grid.
 *
 * Identity, in order (photos below):
 *  1. a brown granite shaft with chamfered corners, flat-topped, 216 m, the
 *     tallest part a slab on the west with a shoulder on the east that stops
 *     13 m lower.                                       (shank, midi, midi1)
 *  2. the cascade of chamfered setbacks down the west side, stepping out
 *     and down to the corner of 18th and California: 111 m, 59 m, then low
 *     terraces cut off by the diagonal street walls.         (transam, midi1)
 *  3. dark bands of black glass: a bold two-floor band round the whole
 *     shaft at ~145–153 m, unbroken over the chamfers, its strongest
 *     feature, and a thinner one at the top of the 59 m block.
 *                                              (transam, shank, midi1)
 *  4. punched windows in the brown granite, with a plain band at the top
 *     where the sign is.                                    (shank, transam)
 *  5. the parking garage on the north-east, open decks in brown concrete.
 *                                                                (midi1)
 *
 * Plan and heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid,
 * read in this frame with tools/lidar_frame.py; ground_min 1591.0 m; y = 0
 * is 0.7 m above it (the 18th St side; the site is within 1.3 m of level).
 * The tiers' plans were read from the lidar's height classes, cross-checked
 * against OSM: the tower part way/457999932 matches the lidar's 204 m
 * outline to about a metre and is used as drawn for it. Measured (model
 * metres): west slab parapet 216.8, roof 215.7 (published 216 m / 53
 * floors: OSM, Wikipedia "1801 California Street"); east shoulder 203.4;
 * west setback 110.6; 58.4 block; terraces 40.5 and 29.4 on the west face;
 * the low wedge 18.1, and 10.5 at its south tip; the garage 33.8, with a
 * stair and lift block to 41.0.
 *
 * OSM disagrees with the lidar on the podium: it maps the whole south-west
 * wedge as one 14 m part (way/588305744), while the lidar shows the 111 and
 * 59 m setbacks and the terraces standing in it. The lidar is followed.
 *
 * Estimated: the dark bands' heights (scaled on transam between the
 * lidar's 59 and 111 m setbacks: ~150 m, and the top floor of the 59 m
 * block), the window grouping (broad panels of two or three windows by three
 * floors, ~4.07 m floors, with granite piers and spandrels between), the plain sign band (top 10 m), the garage deck rhythm.
 *
 * Colour: the granite and its glass read dark bronze-brown in every daylight
 * photo; a dark warm brown finish, above charcoal, with the slate windows
 * still distinct on it. The bands are a near-charcoal black-glass finish. The garage's concrete is a lighter tan.
 *
 * Night: offices lit (window). The black-glass bands are mechanical floors
 * and stay dark: they share the garage decks' dark grey finish.
 *
 * Photos (Wikimedia Commons, evidence):
 *  shank   "1801 California Street in Denver Colorado.jpg", David
 *          Shankbone, CC BY-SA 3.0 (the top, from the south-east)
 *  transam "Transamerica, 1801 California Street, Denver, CO.jpg",
 *          Xnatedawgx, CC BY-SA 4.0 (west face, the setbacks)
 *  midi    "1801 California Street.jpg", Midimacman, CC BY 3.0 (the top
 *          from the west)
 *  midi1   "1801 California Street (1).jpg", Midimacman, CC BY 3.0 (from
 *          the north, over the garage)
 *  clink   "CenturyLink, 1801 California Street, Denver.jpg", Xnatedawgx,
 *          CC BY-SA 3.0
 * No look-only sources. No commercial imagery.
 *
 * Left out: the sign lettering, rooftop plant, entrances and canopies, the
 * garage's ramps.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { block, panel, rows, save, type XY } from './chi-aon-center'

const granite = new Part(), win = new Part(), roof = new Part(), garage = new Part(), deck = new Part(), band = new Part()

const FL = 4.07

// ---------------------------------------------------------------------------
// Convex clipping, for tiers cut by the diagonal street walls.

/** Keep the part of a counter-clockwise ring left of the line a→b. */
function clip(r: XY[], a: XY, b: XY): XY[] {
  const side = (p: XY) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const p = r[i], q = r[(i + 1) % r.length], sp = side(p), sq = side(q)
    if (sp >= 0) out.push(p)
    if ((sp >= 0) !== (sq >= 0)) {
      const t = sp / (sp - sq)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out.filter((p, i) => Math.hypot(p[0] - out[(i + 1) % out.length][0], p[1] - out[(i + 1) % out.length][1]) > 0.05)
}
const clipBy = (r: XY[], hull: XY[]) => hull.reduce((acc, a, i) => clip(acc, a, hull[(i + 1) % hull.length]), r)
const box = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const ccw = (r: XY[]) => (r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) < 0 ? [...r].reverse() : r)

// The south-west wedge of the outline (convex): the diagonal walls on
// California and 18th, the north wall, and an east side inside the tower.
const WEDGE: XY[] = [[-72.7, -17.9], [-29.1, -61.5], [-10.3, -42.9], [-10.3, -20], [-17.9, 0.2], [-21.0, 5.9], [-47.6, 6.9]]

// ---------------------------------------------------------------------------
// Tiers

type Tier = { ring: XY[]; h: number; windows?: boolean; band?: number }
const tiers: Tier[] = []
const add = (ring: XY[], h: number, o: Partial<Tier> = {}) => { const r = ccw(ring); if (r.length >= 3) tiers.push({ ring: r, h, windows: true, ...o }) }

// The low wedge: 18.1, lower (10.5) at its south tip.
add(clipBy(box(-80, -70, -27, -9), WEDGE), 18.1)
add(clipBy(box(-27, -70, -10.3, -9), WEDGE), 10.5)
add(clipBy(box(-80, -9, -10.3, 10), WEDGE), 6.0, { windows: false })
// West terraces: 29.4, with two 40.5 bays at the ends of the 59 block.
add(clipBy(box(-65, -50.5, -38, -6), WEDGE), 29.4)
add(clipBy(box(-58.5, -9, -50, -1), WEDGE), 40.5)
add(clipBy(box(-58.5, -36, -50, -27), WEDGE), 40.5)
// The 59 m block, its south-west corner chamfered; and its strip along the
// north wall to the outline's corner.
add(clip(clipBy(box(-53.5, -43.5, -30, 6.9), WEDGE), [-46, -43.5], [-53.5, -36]), 58.4, { band: 54.0 })
add(clipBy(box(-30, 0, -17.9, 6.9), WEDGE), 58.4, { band: 54.0 })
// 111 m setback, chamfered at its west corners.
add([[-30, -42], [-30, 0.2], [-41, 0.2], [-47.5, -6.3], [-47.5, -33], [-38.5, -42]], 110.6)
// East shoulder, 203.4: OSM's tower part less the west slab (an L).
add([[-16.2, -36.8], [-10.3, -42.9], [13.6, -42.8], [19.5, -36.3], [20.0, -12.5], [12.7, -5.2], [3, -5.65], [3, -33.8], [0, -36.8]], 203.4, { band: 145 })
// West slab, 216.8 at the parapet.
add([[-28.7, 0.2], [-35, -5.8], [-35, -30.7], [-28.7, -36.8], [0, -36.8], [3, -33.8], [3, -5.65], [1.55, -5.65], [-4.1, 0.2]], 216.8, { band: 145 })

const BAND_H = 8.2 // two floors of black glass
const SIGN = 10 // plain granite at the top of the shaft, where the sign is
for (const t of tiers) {
  block(granite, roof, t.ring, 0, t.h, 0.4)
  if (!t.windows) continue
  const zTop = t.h > 200 ? t.h - SIGN : t.h - 2.2
  const groups = rows(4.4, zTop, Math.max(1, Math.round((zTop - 4.4) / (3 * FL))), 2.8)
  for (let i = 0; i < t.ring.length; i++) {
    const a = t.ring[i], b = t.ring[(i + 1) % t.ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // the dark band of black glass runs unbroken round every face
    const bh = t.h > 200 ? BAND_H : 4.2 // the 59 m block's band is one floor
    if (t.band !== undefined && (t.h > 200 || L >= 5)) panel(band, a, b, 0, L, t.band, t.band + bh, 0.06)
    if (L < 5) continue
    const k = Math.max(1, Math.round((L - 1.6) / 9.5)), pitch = (L - 1.6) / k, w = Math.min(8, pitch - 2.4)
    for (let q = 0; q < k; q++) {
      const s0 = 0.8 + q * pitch + (pitch - w) / 2, s1 = s0 + w
      for (const [z0, z1] of groups) {
        if (t.band !== undefined && z1 > t.band - 1.5 && z0 < t.band + bh + 1.5) continue
        panel(win, a, b, s0, s1, z0, z1, 0.05)
      }
    }
  }
}

// Parking garage (OSM part way/588305743), open decks in tan concrete.
{
  const g = ccw([[12.7, -5.2], [-13.4, 21.3], [-29.8, 21.4], [-29.8, 24.4], [12.95, 67.25], [69.8, 11.3], [33.1, -25.4], [20.0, -12.5]])
  const H = 33.8
  block(garage, roof, g, 0, H, 0.3)
  for (let i = 0; i < g.length; i++) {
    const a = g[i], b = g[(i + 1) % g.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) continue
    // the edge shared with the tower's shoulder is hidden; skip it
    if (Math.abs(a[0] - 20) < 0.1 || Math.abs(b[0] - 20) < 0.1) continue
    for (const [z0, z1] of rows(1.0, H - 1.2, 5, 3.2)) panel(deck, a, b, 1.0, L - 1.0, z0, z1, 0.05)
  }
  // stair and lift block on the west corner, 41 m
  block(garage, roof, ccw([[-29.6, 21.6], [-13.6, 21.5], [-13.6, 29.6], [-24.4, 29.8], [-29.6, 24.6]]), H - 0.2, 41.0, 0.3)
}

await save('den-1801-california', '1801 California Street', [39.7478912, -104.9895993], 0, [
  { part: granite, material: finish('cal-granite', 0x8e6b59) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: garage, material: finish('cal-garage-concrete', 0xb59a84) },
  { part: deck, material: finish('cal-garage-deck', 0x6d6a66) },
  { part: band, material: finish('cal-black-glass', 0x4b4e54) },
])
