/**
 * The Niagara Scow ("Iron Scow", "The Old Scow"), the steel dumping scow
 * stranded on a rock shoal in the Canadian upper rapids on 6 August 1918,
 * about 770 m above the Horseshoe Falls: procedural, CC0-1.0.
 * bun generators/niagara-iron-scow.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to the hull's
 * long axis: bearing 337.6 (the OSM wreck outline, upstream end to
 * downstream end). Anchor = the middle of the OSM outline way/248431076
 * (historic=wreck), 43.073221, -79.071434.
 *
 * Water: the map's terrain is the river surface here, so y = 0 is the
 * water at the hull's downstream (north) end. Mapterhorn (`bun
 * tools/terrain.ts grid -79.07142 43.07320 25 5 --bearing 337.6`) rises
 * about 0.7 m upstream over the hull's length; the hull's sides start at
 * y = 0 and its rim follows the water, so the freeboard is the same all
 * along. No water, rapids or rocks are modelled.
 *
 * Identity: a long, low, open-topped steel box hull, rust red-brown, with
 * a raked bow, broken into three pieces lying slightly out of line (as
 * the 2019 aerial shows after the storm of 31 October 2019 moved it).
 *
 * Evidence:
 * - plan: OSM way/248431076, about 27 m end to end (a rough outline); the
 *   hull drawn 26 m long and 4.0 m wide (the width estimated from the
 *   aerial's proportions, corrected for its slant).
 * - freeboard ~1.9 m above the water, from Don-vip's and Diego Torres
 *   Silvestre's side views, against the hull's length (about 12:1).
 * - the three pieces, their gaps and kinks, from Wikimaker2018's 2019
 *   aerial; the raked bow from the side views.
 * - history: English Wikipedia, "Niagara Scow" (stranding 1918; moved and
 *   turned by the October 2019 storm; pieces broke off in 2022; the bow
 *   moved farther downstream on 20 November 2025).
 * - colour: rusted steel (photos ~#6b3a2a, pulled to the palette's
 *   lightness), the deck inside a darker rust.
 *
 * Photos (Wikimedia Commons), all EVIDENCE:
 * - "Niagara Falls Scow 2019 Aerial Photos-11 (cropped).jpg",
 *   Wikimaker2018, CC BY-SA 4.0 (from above, 2019)
 * - "Niagara Scow 2013.jpg", Don-vip, CC BY-SA 3.0 (side, before 2019)
 * - "Old scow wrecked in 1918 just above Niagara Falls.jpg", Diego Torres
 *   Silvestre, CC BY 2.0 (side, before 2019)
 * No lidar. No commercial imagery.
 *
 * Doubts: no published dimensions (length and width estimated); the wreck
 * keeps breaking up, and since November 2025 the bow lies farther
 * downstream, so the bow piece here shows the 2019-2022 state; the
 * hull's real tilt since 2019 ("flipped on its side") is not shown.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save, type XY } from './chi-aon-center'

const BEAM = 4.0, FREE = 1.9, RIM = 0.25, DECK = 0.7
/** The water above y = 0 at a point along the hull (y north, metres). */
const water = (y: number) => Math.max(0, 0.027 * (13 - y))

/** Turn and shift a plan point: a piece lying `deg` out of line about (cx, cy), moved `dx` sideways. */
const place = (p: XY, cy: number, deg: number, dx: number): XY => {
  const c = Math.cos((deg * Math.PI) / 180), s = Math.sin((deg * Math.PI) / 180), y = p[1] - cy
  return [p[0] * c - y * s + dx, p[0] * s + y * c + cy]
}

/**
 * One open hull piece from y0 to y1, `rake` metres of sloped bow at its y1
 * end: outer sides from y = 0 to the rim, a rim lip, and the deck sunk DECK
 * below the rim inside.
 */
function piece(hull: Part, deck: Part, y0: number, y1: number, rake: number, deg: number, dx: number) {
  const cy = (y0 + y1) / 2, h = BEAM / 2
  const P = (x: number, y: number, z: number): V3 => { const [px, py] = place([x, y], cy, deg, dx); return [px, py, z] }
  const top = (y: number) => water(y) + FREE
  // the rim ring (counter-clockwise) and the bottom ring, which is shorter at a raked bow
  const rim: XY[] = [[-h, y0], [h, y0], [h, y1], [-h, y1]]
  const bot: XY[] = [[-h, y0], [h, y0], [h, y1 - rake], [-h, y1 - rake]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    hull.quad(P(bot[i][0], bot[i][1], 0), P(bot[j][0], bot[j][1], 0), P(rim[j][0], rim[j][1], top(rim[j][1])), P(rim[i][0], rim[i][1], top(rim[i][1])))
  }
  // the rim lip and the inner walls down to the sunk deck
  const ins: XY[] = rim.map(([x, y]) => [x - Math.sign(x) * RIM, y + (y === y0 ? RIM : -RIM)] as XY)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    hull.quad(P(rim[i][0], rim[i][1], top(rim[i][1])), P(rim[j][0], rim[j][1], top(rim[j][1])), P(ins[j][0], ins[j][1], top(ins[j][1])), P(ins[i][0], ins[i][1], top(ins[i][1])))
    hull.quad(P(ins[j][0], ins[j][1], top(ins[j][1]) - DECK), P(ins[i][0], ins[i][1], top(ins[i][1]) - DECK), P(ins[i][0], ins[i][1], top(ins[i][1])), P(ins[j][0], ins[j][1], top(ins[j][1])))
  }
  deck.quad(P(ins[0][0], ins[0][1], top(ins[0][1]) - DECK), P(ins[1][0], ins[1][1], top(ins[1][1]) - DECK), P(ins[2][0], ins[2][1], top(ins[2][1]) - DECK), P(ins[3][0], ins[3][1], top(ins[3][1]) - DECK))
  // transverse frames across the open deck, about every 2.5 m
  const n = Math.max(1, Math.round((y1 - y0 - 2 * RIM) / 2.5))
  for (let k = 1; k < n; k++) {
    const y = y0 + RIM + ((y1 - y0 - 2 * RIM) * k) / n, z1 = top(y) - 0.15, z0 = top(y) - DECK
    hull.quad(P(-h + RIM, y - 0.12, z0), P(h - RIM, y - 0.12, z0), P(h - RIM, y - 0.12, z1), P(-h + RIM, y - 0.12, z1))
    hull.quad(P(h - RIM, y + 0.12, z0), P(-h + RIM, y + 0.12, z0), P(-h + RIM, y + 0.12, z1), P(h - RIM, y + 0.12, z1))
    hull.quad(P(-h + RIM, y - 0.12, z1), P(h - RIM, y - 0.12, z1), P(h - RIM, y + 0.12, z1), P(-h + RIM, y + 0.12, z1))
  }
}

function build() {
  const hull = new Part(), deck = new Part()
  piece(hull, deck, -13, -1.2, 0, 0, 0)
  piece(hull, deck, -0.8, 7.4, 0, 4, 0.35)
  piece(hull, deck, 7.9, 13, 2.0, -5, 0.7)
  return [
    { part: hull, material: finish('scow-rust', 0x9a6450) },
    { part: deck, material: finish('scow-rust-deck', 0x6f4a3e) },
  ]
}

if (import.meta.main) await save('niagara-iron-scow', 'Niagara Scow', [43.073221, -79.071434], 337.6, build())
