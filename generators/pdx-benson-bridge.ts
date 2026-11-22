/**
 * Benson Bridge (1914, K.P. Billner; built by Robert L. Ringer), the
 * footbridge across Multnomah Falls between its upper and lower tiers,
 * Columbia River Gorge, Oregon: procedural, CC0-1.0, no textures.
 * bun generators/pdx-benson-bridge.ts
 *
 * A slender reinforced-concrete open-spandrel arch: one flat rib springing
 * from the rock on either side of the creek, the deck resting on its crown
 * and, toward the ends, on short columns joined by small round arches; a
 * concrete balustrade of close-set balusters between posts at the ends and
 * the third points. The bridge owns its walkway (the map draws no road on
 * a footbridge model). The falls and the rock are not modelled.
 *
 * Frame: x across, y along the bridge (bearing 53.6, toward the north-east
 * end), z up, metres. Origin at the centre of OSM way/1030291504 (the
 * man_made=bridge outline, 15.5 m by 2.2 m). z = 0 is the lowest ground the
 * map's terrain (Mapterhorn) shows under the footprint, 16.0 m over the
 * lowest point in a 48 m box (29.3 m NAVD88): the creek's channel at the
 * lip of the lower falls, which the terrain smooths into a trough 1.8 m
 * deep under the bridge's centre line. The abutments run down to the
 * terrain vertex by vertex. Nothing real reaches the channel, so the GLB is
 * shifted down to put the lowest abutment foot (3.75 m over the channel) at
 * y = 0, and the placement's elevation is +3.75: the map grounds the model's
 * lowest vertices on the lowest terrain under the footprint (the channel),
 * then lifts it by that much, onto the rock OSM doesn't map.
 *
 * Elevation: the deck is 105 ft (32 m) above the lower falls' pool and the
 * lower falls drop 69 ft (21 m) (Wikipedia "Multnomah Falls"), so the deck is
 * about 11 m over the creek where it passes under: walking surface at 12.8 m
 * in this frame (1.8 m channel + 11 m). The map's terrain puts the trail at
 * the ends 9.9 m (south-west) and 6.4 m (north-east) here; the gap is drawn
 * as concrete abutment down to the terrain. Real rock stands there.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): way/1030291504 (outline, architect,
 *   builder, 1914), the path way/55527378 (Larch Mountain Trail 441).
 * - Published: 45 ft (14 m) long (Wikipedia "Multnomah Falls"); 105 ft over
 *   the lower pool.
 * - Photos (EVIDENCE):
 *   - Ross kramerov, "Multnomah Falls Bridge - Close-Up.jpg", CC BY-SA 4.0:
 *     the side elevation; every proportion below is scaled from it (the
 *     deck 15.5 m = 1065 px):
 *     https://commons.wikimedia.org/wiki/File:Multnomah_Falls_Bridge_-_Close-Up.jpg
 *   - Chris Light, "Benson Bridge 3647.jpg", CC BY-SA 4.0, from the lower
 *     viewing platform: the rib's flatness, the colour:
 *     https://commons.wikimedia.org/wiki/File:Benson_Bridge_3647.jpg
 *
 * Numbers (from the elevation photo, scaled)
 * - Arch span 13.0 m between springings at y = +-6.5; the intrados 2.95 m
 *   under the deck's top at the springings, 0.75 m at the crown; the rib
 *   0.75 m deep at the springings, merging with the deck at the crown;
 *   balustrade 1.1 m; posts at the ends and the third points; spandrel
 *   columns 1.25 m apart over the outer 5 m each side, under round heads.
 * - Estimated: the width (2.2 m, OSM), the rib's width (1.8 m), baluster
 *   spacing (drawn at half the real density, 0.45 m).
 * - Colour: weathered pale concrete #c7c5bd, pulled to #d2d0c8; the deck
 *   slightly darker.
 *
 * Night: the falls and the bridge are floodlit from below (the visitor
 *   area's lights), so the sides carry _FLOODLIGHT.
 *
 * Doubts
 * - The springings and abutments stand on the map's smoothed terrain, not
 *   the real rock; the north-east abutment is drawn 4 m taller than the real
 *   one would look.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { face, footedLoft, chamferedRect, groundAt, stations, type GroundGrid } from './bridge-kit'

// Map terrain (Mapterhorn), metres over this frame's z = 0, 3 m apart (x -3..3, y -9..9).
const GROUND: GroundGrid = {
  y0: -9, x0: -3, step: 3, z: [
    [13.0, 13.2, 13.3], [4.9, 9.6, 10.6], [0, 2.5, 5.5], [0, 1.8, 3.6], [0, 1.9, 3.7], [0, 5.4, 6.6], [4.9, 10.3, 10.0],
  ],
}
const gnd = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))

const conc = new Part(), deck = new Part()

const WALK = 12.8, SLAB = 0.3, UNDER = WALK - SLAB, HALF = 7.75, W = 1.1, SPRING = 6.5
const RW = 0.9                                     // the rib's half-width
const I = (y: number) => (WALK - 0.75) - 2.2 * (y / SPRING) ** 2      // intrados
const E = (y: number) => UNDER - 1.9 * (y / SPRING) ** 2 + 0.02       // extrados
const ABUT = I(SPRING) + 0.7                                            // the abutments' tops, at the rib's springing

// --- the walkway slab and its fascias
const ys = stations(-HALF, HALF, 1.6)
for (let i = 0; i < ys.length - 1; i++) {
  const a = ys[i], b = ys[i + 1]
  face(deck, [-W + 0.15, a, WALK], [W - 0.15, a, WALK], [W - 0.15, b, WALK], [-W + 0.15, b, WALK], [0, 0, 1])
  face(conc, [-W, a, UNDER], [W, a, UNDER], [W, b, UNDER], [-W, b, UNDER], [0, 0, -1])
  for (const s of [-1, 1]) face(conc, [s * W, a, UNDER], [s * W, b, UNDER], [s * W, b, WALK + 0.2], [s * W, a, WALK + 0.2], [s, 0, 0])
}
for (const y of [-HALF, HALF]) face(conc, [-W, y, UNDER], [W, y, UNDER], [W, y, WALK], [-W, y, WALK], [0, Math.sign(y), 0])

// --- the arch rib
const rs = stations(-SPRING, SPRING, 0.9)
for (let i = 0; i < rs.length - 1; i++) {
  const a = rs[i], b = rs[i + 1]
  face(conc, [-RW, a, I(a)], [RW, a, I(a)], [RW, b, I(b)], [-RW, b, I(b)], [0, 0, -1])
  for (const s of [-1, 1]) face(conc, [s * RW, a, I(a)], [s * RW, b, I(b)], [s * RW, b, Math.min(E(b), UNDER)], [s * RW, a, Math.min(E(a), UNDER)], [s, 0, 0])
}

// --- spandrel columns (cross walls, column-thick from the side) and the arched heads between them
for (const s of [-1, 1]) {
  const cols = [2.4, 3.65, 4.9, 6.15, 7.45].map((k) => s * k)
  for (const y of cols) {
    const z0 = Math.abs(y) > SPRING ? ABUT : E(y) - 0.05
    footedLoft(conc, () => z0, [{ plan: chamferedRect(-RW + 0.05, RW - 0.05, y - 0.15, y + 0.15, 0), z: z0 }, { plan: chamferedRect(-RW + 0.05, RW - 0.05, y - 0.15, y + 0.15, 0), z: UNDER }], 4, false)
  }
  // the little arches' spandrels: a band under the deck, deepest at the columns
  for (let k = 0; k < cols.length - 1; k++) {
    const y0 = cols[k], y1 = cols[k + 1], n = 6
    for (let j = 0; j < n; j++) {
      const t0 = j / n, t1 = (j + 1) / n
      const d = (t: number) => 0.1 + 0.55 * (1 - Math.sin(Math.PI * t)) // round arch head: deep at the columns
      const ya = y0 + (y1 - y0) * t0, yb = y0 + (y1 - y0) * t1
      for (const x of [-RW + 0.02, RW - 0.02]) {
        const sx = Math.sign(x)
        face(conc, [x, ya, UNDER - d(t0)], [x, yb, UNDER - d(t1)], [x, yb, UNDER], [x, ya, UNDER], [sx, 0, 0])
      }
    }
  }
}

// --- abutments: from the springings back under the deck's ends, down to the terrain
for (const s of [-1, 1]) {
  const y0 = s < 0 ? -HALF : SPRING - 0.3, y1 = s < 0 ? -SPRING + 0.3 : HALF
  const top = ABUT
  footedLoft(conc, gnd, [
    { plan: chamferedRect(-W, W, y0, y1, 0), z: 'ground' },
    { plan: chamferedRect(-W, W, y0, y1, 0), z: top },
  ], 1.5)
}

// --- the balustrade: bottom rail, balusters at half density, cap rail, posts
for (const s of [-1, 1]) {
  const x = s * (W - 0.12)
  const rail = (z0: number, z1: number, w: number) => {
    for (let i = 0; i < ys.length - 1; i++) {
      const a = ys[i], b = ys[i + 1]
      face(conc, [x - w, a, z1], [x + w, a, z1], [x + w, b, z1], [x - w, b, z1], [0, 0, 1])
      for (const t of [-1, 1]) face(conc, [x + t * w, a, z0], [x + t * w, b, z0], [x + t * w, b, z1], [x + t * w, a, z1], [t, 0, 0])
    }
    for (const y of [-HALF, HALF]) face(conc, [x - w, y, z0], [x + w, y, z0], [x + w, y, z1], [x - w, y, z1], [0, Math.sign(y), 0])
  }
  rail(WALK, WALK + 0.2, 0.13)
  rail(WALK + 0.92, WALK + 1.1, 0.15)
  const posts = [-HALF + 0.2, -HALF / 3, HALF / 3, HALF - 0.2]
  for (const y of stations(-HALF + 0.4, HALF - 0.4, 0.45)) {
    if (posts.some((p) => Math.abs(p - y) < 0.35)) continue
    const b0 = WALK + 0.2, b1 = WALK + 0.92, r = 0.07
    for (const [dx, dy, n] of [[0, -r, [0, -1, 0]], [r, 0, [1, 0, 0]], [0, r, [0, 1, 0]], [-r, 0, [-1, 0, 0]]] as [number, number, V3][]) {
      const ax = x + (dx === 0 ? -r : dx), ay = y + (dy === 0 ? -r : dy), bx = x + (dx === 0 ? r : dx), by = y + (dy === 0 ? r : dy)
      face(conc, [ax, ay, b0], [bx, by, b0], [bx, by, b1], [ax, ay, b1], n)
    }
  }
  for (const y of posts) {
    footedLoft(conc, () => WALK, [
      { plan: chamferedRect(x - 0.2, x + 0.2, y - 0.2, y + 0.2, 0.04), z: WALK },
      { plan: chamferedRect(x - 0.2, x + 0.2, y - 0.2, y + 0.2, 0.04), z: WALK + 1.25 },
    ], 4)
  }
}

// ---------------------------------------------------------------- output ---
const lit = (_p: V3, n: V3) => (Math.abs(n[2]) > 0.6 ? 0.25 : 0.7)
const parts = [
  { part: conc, material: { ...finish('benson-concrete', 0xd2d0c8), floodlight: lit } },
  { part: deck, material: finish('benson-walkway', 0xbcb9b1) },
]
// Ground the model on its feet: the north-east abutment's foot is its lowest
// vertex, so shift everything down to put it at y = 0, and lift the
// placement by the same amount (elevation) so the map stands it back where
// the terrain table puts it.
const LOW = Math.min(...[conc, deck].flatMap((p) => p.pos.filter((_, i) => i % 3 === 1)))
for (const p of [conc, deck]) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] -= LOW
console.log(`lowest foot ${LOW.toFixed(2)} m over the channel: elevation ${LOW.toFixed(2)}`)
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Benson Bridge', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the centre of way/1030291504; y = 0 the lowest abutment foot, 3.75 m over the channel (elevation 3.75)',
  bearing: 53.6, elevation: +LOW.toFixed(2), height: WALK + 1.25 - LOW,
})
await Bun.write(new URL('../models/pdx-benson-bridge.glb', import.meta.url), glb)
console.log(`pdx-benson-bridge.glb: ${triangles} triangles, ${glb.length} bytes`)
