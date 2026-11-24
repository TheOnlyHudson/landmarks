/**
 * Pat Auletta Steeplechase Pier, Coney Island (rebuilt after Hurricane Sandy,
 * reopened 2015) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-steeplechase-pier.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Built along the
 * pier's own axis and placed at bearing 350.4 (the stem's axis, fitted to
 * the 2017 lidar and matching the OSM outline), so the stem runs along y:
 * the Boardwalk end at y = +173, the T-head at y ≈ -101, the end at y = -165.
 * Anchor: area centroid of OSM way/671962063 (-73.9836468, 40.5710313).
 * The pier's centreline ways (way/101122881, way/101122882) lie inside.
 *
 * Only the pier: deck, pile bents, railings, lamp posts and the two shade
 * canopies on the T-head. The beach and the water are the map's.
 *
 * Heights. Every height is built absolute (NAVD88, as the lidar reads it)
 * and then lowered by T0 = -1.63 m, the lowest map terrain (Mapterhorn
 * z15) under the footprint, under the outer stem and T-head: the map puts
 * the lowest vertex there, so the deck lands at its real height and meets
 * the Boardwalk at the root. The deck is 4.4 m NAVD, about 4.5 m above
 * mean sea level (MSL ≈ -0.1 m NAVD88 at Sandy Hook). The map's sea floor
 * under the T-head is drawn at -1.6 m, so on the map the deck stands about
 * 6 m over the drawn water, against about 4.5 m over the real mean water.
 *
 * Evidence
 * - OSM: way/671962063 (man_made=pier area, the outline), way/101122881
 *   and way/101122882 (the centrelines). In the 350.4° frame the outline
 *   is rectilinear: a 10 m wide land section from the Boardwalk out to
 *   y = 59, a 6.8 m stem with a 5.7 m bump-out on its west side
 *   (y = -36 … -13), the T-head 67 m across and 7.6 m deep, and the stem
 *   running on 60 m past it. It matches the NYS 2024 orthophoto
 *   (orthos.its.ny.gov, public) within about 1 m.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m and 1 m grids. Deck
 *   4.4 m NAVD88 over the water (4.34–4.48 along the whole stem and the
 *   T-head); the land section near the Boardwalk at 5.2–5.3 m, the ramp
 *   between them about 11 m long; railings about 1.0 m above the deck;
 *   the canopies' roofs at 8.2–8.8 m with their masts to 9.6 m, each about
 *   30 × 4.6 m over the south half of an arm. Water at -0.56 m on the
 *   flight; the beach under the root 3.9–4.2 m. The lidar has no returns
 *   past y ≈ -140, so the stem's last 25 m are from OSM and the ortho.
 * - Published (NYC Parks; Wikipedia "Coney Island"): about 1,000 ft long;
 *   rebuilt with a recycled-plastic and concrete deck after Sandy, reopened
 *   2015, renamed for Pat Auletta 2019.
 * - Photos (Wikimedia Commons):
 *   - "Steeplechase Pier facing Coney Island Boardwalk.jpg",
 *     Rhododendrites, CC BY-SA 4.0 (the deck, benches, railings, lamp
 *     posts and both canopies from the stem, looking north)
 *   - "Pat Auletta Steeplechase Pier - Coney Island, Brooklyn, New York,
 *     USA - October 3, 2023.jpg", Giorgio Galeotti, CC BY-SA 4.0 (the
 *     whole pier side-on from the beach: the bent rhythm, the pale
 *     railing band, the lamps and the two canopies)
 *   - "Coney Is Beach td (2018-09-03) 17 - Steeplechase Pier.jpg",
 *     Tdorante10, CC BY-SA 4.0 (a canopy on its posts, pile caps and
 *     braced piles under the T-head)
 *   - "Steeplechase Pier structural infrastructure.jpg", Oleg Yunakov,
 *     CC BY-SA 4.0 (from the water)
 *   - "Coney Is Beach td (2018-09-03) 36 - Steeplechase Pier.jpg" and
 *     "… 30 …", Tdorante10, CC BY-SA 4.0 (the railing: silver pickets
 *     under a grey cap)
 *   - "Coney Island Brooklyn Jul 2019 48.jpg", Epicgenius, CC BY-SA 4.0
 *     (the pier from the Boardwalk at West 17th Street)
 *
 * Estimated: the bent spacing (6.1 m, 20 ft, counted against the canopies
 * in the side view), the piles (three per bent on the stem, two across an
 * arm, drawn 0.55 m square), the pile caps (0.8 m deep), the lamp spacing
 * (about 24 m, alternating sides, from the side view), the canopies' posts
 * (one row under the middle of each roof, about 6 m apart) and their masts.
 * The cross-bracing under the T-head is left out; the benches and the
 * fish-cleaning tables are too small to draw.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { finishModel } from './nyc-570-lexington'

const deck = new Part(), concrete = new Part(), rail = new Part(), white = new Part(), post = new Part(), lamp = new Part()

/** Lowest map terrain under the footprint, NAVD88 m: the model's y = 0. */
const T0 = -1.63
const abs = (h: number) => h - T0

// Deck heights (lidar): 4.4 m over the water, 5.25 m on the land section,
// with the ramp between y = 101 and 112.
const DECK_SEA = abs(4.4), DECK_LAND = abs(5.25), RAMP0 = 101, RAMP1 = 112
const deckAt = (y: number) => (y <= RAMP0 ? DECK_SEA : y >= RAMP1 ? DECK_LAND : DECK_SEA + ((DECK_LAND - DECK_SEA) * (y - RAMP0)) / (RAMP1 - RAMP0))
const SLAB = 0.4, CAP = 0.8, RAIL = 1.05

// The map's terrain along the stem (Mapterhorn z15, NAVD88 m), every 5 m
// of y from +175 down to -170, read in this frame.
const TERR = [
  4.17, 4.17, 4.17, 4.17, 4.17, 4.17, 4.17, 4.17, 4.17, 4.17, 4.17, 4.17, 4.27, 4.27, 4.17, 3.07, 2.67, 2.37, 2.17, 1.97, 1.77,
  1.77, 1.57, 1.37, 0.97, 0.87, 0.57, 0.17, -0.13, -0.33, -0.73, -1.63,
]
const terrAt = (y: number) => {
  const k = (175 - y) / 5
  if (k >= TERR.length - 1) return T0
  const i = Math.max(0, Math.floor(k)), t = Math.max(0, k - i)
  return TERR[i] + (TERR[i + 1] - TERR[i]) * t
}
/** A pile's foot: 0.3 m into the ground the map draws, never below y = 0. */
const footAt = (y: number) => Math.max(0, abs(terrAt(y)) - 0.3)

/** An axis-aligned box; `bottom` false leaves the underside open. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bottom = true) {
  const c: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const t: V3[] = c.map(([x, y]) => [x, y, z1])
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    p.quad(c[i], c[j], t[j], t[i])
  }
  p.quad(t[0], t[1], t[2], t[3])
  if (bottom) p.quad(c[3], c[2], c[1], c[0])
}

/** A deck slab over [x0,x1]×[y0,y1], its top following deckAt (linear in y within one piece). */
function slab(x0: number, y0: number, x1: number, y1: number) {
  const a = deckAt(y0), b = deckAt(y1)
  const T: V3[] = [[x0, y0, a], [x1, y0, a], [x1, y1, b], [x0, y1, b]]
  const B: V3[] = T.map(([x, y, z]) => [x, y, z - SLAB])
  deck.quad(T[0], T[1], T[2], T[3])
  concrete.quad(B[3], B[2], B[1], B[0])
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    concrete.quad(B[i], B[j], T[j], T[i])
  }
}

// ---------------------------------------------------------------------------
// The deck, from the OSM outline in this frame.
// ---------------------------------------------------------------------------
const WL = -5.3, WR = 4.8 // land section
const SL = -2.9, SR = 3.9 // stem
const BUMP0 = -36, BUMP1 = -13, BL = -8.6 // west bump-out
const TN = -97.6, TS = -105.2, TW = -33, TE = 34 // T-head arms
const ROOT = 173, END = -165, LAND = 59

slab(WL, RAMP1, WR, ROOT)
slab(WL, RAMP0, WR, RAMP1)
slab(WL, LAND, WR, RAMP0)
slab(SL, BUMP1, SR, LAND)
slab(BL, BUMP0, SR, BUMP1)
slab(SL, TN, SR, BUMP0)
slab(TW, TS, TE, TN)
slab(SL, END, SR, TS)

// ---------------------------------------------------------------------------
// Pile bents: a cap across the deck and piles down to the ground.
// ---------------------------------------------------------------------------
const BAY = 6.1
const pile = (x: number, y: number, top: number) => {
  const foot = footAt(y)
  if (top - foot > 0.2) box(concrete, x - 0.28, y - 0.28, foot, x + 0.28, y + 0.28, top, false)
}
for (let y = ROOT - 2.5; y > END; y -= BAY) {
  if (y < TN + 1 && y > TS - 1) continue // the T-head's own bents carry it
  const wide = y > LAND, bump = y > BUMP0 && y < BUMP1
  const x0 = wide ? WL : bump ? BL : SL, x1 = wide ? WR : SR
  const top = deckAt(y) - SLAB, bot = top - CAP
  box(concrete, x0 + 0.2, y - 0.4, bot, x1 - 0.2, y + 0.4, top)
  const xs = bump ? [x0 + 0.48, -2.0, 0.5, x1 - 0.48] : [x0 + 0.48, (x0 + x1) / 2, x1 - 0.48]
  for (const x of xs) pile(x, y, bot)
}
{
  // Under the T-head: bents across each arm, and two along the junction.
  const top = DECK_SEA - SLAB, bot = top - CAP
  for (const s of [-1, 1]) {
    for (let k = 0; ; k++) {
      const x = s < 0 ? SL - 2.5 - k * BAY : SR + 2.5 + k * BAY
      if (s < 0 ? x < TW + 0.5 : x > TE - 0.5) break
      box(concrete, x - 0.4, TS + 0.2, bot, x + 0.4, TN - 0.2, top)
      for (const y of [TS + 0.48, TN - 0.48]) pile(x, y, bot)
    }
  }
  for (const y of [TN - 0.8, TS + 0.8]) {
    box(concrete, SL + 0.2, y - 0.4, bot, SR - 0.2, y + 0.4, top)
    for (const x of [SL + 0.48, SR - 0.48]) pile(x, y, bot)
  }
}

// ---------------------------------------------------------------------------
// Railings: a pale band along every edge but the Boardwalk end, broken at
// the ramp so it follows the deck.
// ---------------------------------------------------------------------------
const ring: [number, number][] = [
  [WL, ROOT], [WL, LAND], [SL, LAND], [SL, BUMP1], [BL, BUMP1], [BL, BUMP0], [SL, BUMP0], [SL, TN], [TW, TN], [TW, TS], [SL, TS],
  [SL, END], [SR, END], [SR, TS], [TE, TS], [TE, TN], [SR, TN], [SR, LAND], [WR, LAND], [WR, ROOT],
]
const RT = 0.1
for (let i = 0; i < ring.length - 1; i++) {
  const [ax, ay] = ring[i], [bx, by] = ring[i + 1]
  // Split at the ramp's ends so each piece is linear.
  const cuts = [0, 1]
  for (const yc of [RAMP0, RAMP1]) if ((ay - yc) * (by - yc) < 0) cuts.push((yc - ay) / (by - ay))
  cuts.sort((p, q) => p - q)
  // The ring runs counter-clockwise seen from above, so the outside is to
  // the right of a→b; the rail's outer face is on the edge, inset inward.
  const L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, nx = uy, ny = -ux // right of a→b
  for (let k = 0; k < cuts.length - 1; k++) {
    const p = (t: number, d: number, up: number): V3 => {
      const x = ax + (bx - ax) * t + nx * d, y = ay + (by - ay) * t + ny * d
      return [x, y, deckAt(y) + up]
    }
    const t0 = cuts[k], t1 = cuts[k + 1]
    // Outer face, inner face, top.
    rail.quad(p(t0, 0, 0), p(t1, 0, 0), p(t1, 0, RAIL), p(t0, 0, RAIL))
    rail.quad(p(t1, -RT, 0), p(t0, -RT, 0), p(t0, -RT, RAIL), p(t1, -RT, RAIL))
    rail.quad(p(t0, 0, RAIL), p(t1, 0, RAIL), p(t1, -RT, RAIL), p(t0, -RT, RAIL))
  }
}

// ---------------------------------------------------------------------------
// Lamp posts: black poles with a lantern, alternating sides along the stem.
// ---------------------------------------------------------------------------
const POLE = 4.6
const lampPost = (x: number, y: number) => {
  const z = deckAt(y)
  box(post, x - 0.11, y - 0.11, z, x + 0.11, y + 0.11, z + POLE, false)
  box(lamp, x - 0.3, y - 0.3, z + POLE, x + 0.3, y + 0.3, z + POLE + 0.55)
  box(post, x - 0.42, y - 0.42, z + POLE + 0.55, x + 0.42, y + 0.42, z + POLE + 0.7)
}
{
  let side = 0
  for (let y = ROOT - 6; y > END + 3; y -= 24) {
    if (y < TN + 3 && y > TS - 3) continue
    const wide = y > LAND
    lampPost(side % 2 ? (wide ? WR : SR) - 0.35 : (wide ? WL : SL) + 0.35, y)
    side++
  }
  for (const x of [TW + 1, TE - 1]) lampPost(x, (TN + TS) / 2)
}

// ---------------------------------------------------------------------------
// The two shade canopies over the south half of the T-head's arms: a white
// roof plate on one row of posts, masts and stays above.
// ---------------------------------------------------------------------------
const ROOF0 = abs(8.5), ROOF1 = abs(8.82), MAST = abs(9.55)
const CY0 = TS + 0.2, CY1 = TS + 4.8, CYM = (CY0 + CY1) / 2
for (const [x0, x1] of [[TW + 0.5, SL - 0.6], [SR + 0.6, TE - 0.5]]) {
  box(white, x0, CY0, ROOF0, x1, CY1, ROOF1)
  const n = Math.round((x1 - x0) / 6)
  for (let k = 0; k <= n; k++) {
    const x = x0 + 1.4 + ((x1 - x0 - 2.8) * k) / n
    box(white, x - 0.16, CYM - 0.16, DECK_SEA, x + 0.16, CYM + 0.16, ROOF0, false)
    box(white, x - 0.08, CYM - 0.08, ROOF1, x + 0.08, CYM + 0.08, MAST, false)
  }
  // The stays: a ridge bar over the masts.
  box(white, x0 + 1.4, CYM - 0.07, MAST - 0.14, x1 - 1.4, CYM + 0.07, MAST)
}

finishModel('Steeplechase Pier', 'nyc-steeplechase-pier', [
  { part: deck, material: finish('pier-deck', 0x8f857c) },
  { part: concrete, material: finish('pier-concrete', 0xa9aaa6) },
  { part: rail, material: finish('pier-railing', 0xd4d7d6) },
  { part: white, material: finish('pier-canopy', 0xf4f2ec) },
  { part: post, material: finish('pier-lamp-post', 0x4a4f57) },
  { part: lamp, material: { name: 'lamp', color: 0x4a4f57, roughness: 0.6 } },
], { bearing: 350.4, osm: 'way/671962063', height: MAST })
