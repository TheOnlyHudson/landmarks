/**
 * Binnen Bridge, over the Binnen Falls, Prospect Park, Brooklyn (rustic
 * footbridge, rebuilt in the Ravine restoration of the 1990s) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-binnen-bridge.ts
 *
 * Frame: y along the bridge (bearing 90.5°, east), x across it, z up,
 * metres; z = 0 the pool at the falls' lip under the deck. Anchor: the
 * centroid of OSM's man_made=bridge outline way/1446184623
 * (-73.966234, 40.661741), 14.2 m × 4.8 m, which the model draws whole
 * (deck, stringers, stone abutments, rustic railings), so `replaces`
 * lists it. The footway on it (way/59664787, bridge=yes) is a footbridge:
 * its deck is the model's.
 *
 * Evidence
 * - OSM way/1446184623 (bridge:structure=beam, layer 1) and way/59664787 (ODbL).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Michael Silverstone, "Prospect Park Binnen Bridge.jpg", CC BY-SA,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Binnen_Bridge.jpg
 *     (from below the falls: flat deck over the lip, rustic log railing
 *     of posts, rails and stubby balusters, boulder banks).
 *   The Robert N. Dennis stereographs of "The Binnen Bridge and Cascade"
 *   (public domain, 1870s–1890s) show an earlier rustic bridge and were
 *   only looked at.
 *
 * Estimated from the one photo, scaled by the outline's width: deck 1.4 m
 * over the lip, 0.3 m deep on three log stringers; railing 1.05 m with a
 * top rail, a mid rail and posts about every 1.6 m; stone abutments at
 * each end under the deck.
 *
 * Doubts: only one licensed photo, from the downstream (north) side; the
 * far side is the mirror; what carries the deck mid-span is not visible and
 * none is drawn; the timber may be faux-bois concrete, as other rustic work
 * in the park is.
 */
import { Part } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { quadF, box } from './nyc-prospect-park-boathouse'

const wood = new Part(), rail = new Part(), stone = new Part(), deckP = new Part()

const HALF = 7.08, W = 2.4, DECK = 1.4

// Deck planking and its edge beams.
quadF(deckP, [-W + 0.15, -HALF, DECK], [W - 0.15, -HALF, DECK], [W - 0.15, HALF, DECK], [-W + 0.15, HALF, DECK], [0, 0, 1])
for (const s of [-1, 1]) box(wood, s > 0 ? W - 0.3 : -W, -HALF, s > 0 ? W : -W + 0.3, HALF, DECK - 0.35, DECK + 0.05, true)
// Log stringers under the deck.
for (const x of [-1.2, 0, 1.2]) box(wood, x - 0.18, -HALF, x + 0.18, HALF, DECK - 0.4, DECK - 0.02, true)
// Stone abutments at the ends, from the banks to the deck.
for (const sg of [-1, 1]) box(stone, -W - 0.2, sg > 0 ? HALF - 2.0 : -HALF, W + 0.2, sg > 0 ? HALF : -HALF + 2.0, 0, DECK - 0.35)

// Rustic railings: posts, a top rail and a mid rail, stubby balusters between.
for (const s of [-1, 1]) {
  const x = s * (W - 0.15)
  const n = 9
  for (let k = 0; k < n; k++) {
    const y = -HALF + 0.15 + ((2 * HALF - 0.3) * k) / (n - 1)
    box(rail, x - 0.12, y - 0.12, x + 0.12, y + 0.12, DECK, DECK + 1.2)
  }
  box(rail, x - 0.1, -HALF, x + 0.1, HALF, DECK + 0.92, DECK + 1.08)
  box(rail, x - 0.08, -HALF, x + 0.08, HALF, DECK + 0.48, DECK + 0.6)
  for (let y = -HALF + 0.5; y < HALF - 0.3; y += 0.55) box(wood, x - 0.06, y - 0.06, x + 0.06, y + 0.06, DECK + 0.6, DECK + 0.92)
}

finishModel('Binnen Bridge', 'nyc-binnen-bridge', [
  { part: wood, material: { name: 'timber', color: 0x8a7462, roughness: 0.9 } },
  { part: rail, material: { name: 'rustic-rail', color: 0x9c8673, roughness: 0.9 } },
  { part: stone, material: { name: 'schist', color: 0x8f8b83, roughness: 0.9 } },
  { part: deckP, material: { name: 'walkway', color: 0x9b8b7a, roughness: 0.9 } },
], { bearing: 90.5, osm: 'way/1446184623', height: DECK + 1.2 })
