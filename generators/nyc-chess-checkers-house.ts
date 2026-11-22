/**
 * Chess & Checkers House, Central Park, on the rock outcrop west of the
 * Dairy (built 1952 on the site of Vaux's Kinderberg summerhouse; restored
 * by the Central Park Conservancy) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-chess-checkers-house.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0 (the octagon's
 * straight faces run east–west and north–south in OSM). Anchor: the centroid
 * of OSM way/265347597 (building=yes, "Chess and Checkers House",
 * height=6.1, building:levels=1, roof:colour=grey), which this model
 * replaces; no other building ways lie within 40 m.
 *
 * Plan (OSM): a regular octagon, faces 4.67 m, x ±5.62, y ±5.66.
 *
 * Heights (y = 0 is the paved terrace round the house):
 * - Published, OSM height=6.1: taken as the roof's apex under the cupola.
 * - Estimated from the photos (scaled on the doors and the 9.3 m width
 *   across the faces): brick walls 3.75 m to the eave, granite base 0.45 m,
 *   buff bands at 1.1, 1.9 and 2.7 m, segmental-arched three-light windows
 *   (2.9 m wide, sill 1.1 m) and glazed double doors (1.6 m, 2.75 m), the
 *   roof's eave overhang 0.45 m, the louvred cupola (1.1 m square, 1.2 m
 *   tall) and its lead spire to +8.0.
 *
 * Photos (Wikimedia Commons; copies in landmarks-scratch/nyc-parks-2/work/nyc-chess-checkers-house/photos):
 * - Rhododendrites, "Central Park Chess and Checkers House 2.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Central_Park_Chess_and_Checkers_House_2.jpg
 *   (one window face square on, with a door face either side; the roof and cupola)
 * - Rhododendrites, "Central Park Chess and Checkers House 1.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Central_Park_Chess_and_Checkers_House_1.jpg
 *   (a window face and a door face from close by, under the arbour)
 * - alvy, "Chess&checkers house.jpg", CC BY-SA 2.0,
 *   https://commons.wikimedia.org/wiki/File:Chess%26checkers_house.jpg
 *   (from the path below: window and door faces, the cupola, the arbour's posts)
 *
 * Colours from the photos: red brick with buff brick bands and voussoirs, a
 * grey granite base, dark grey slate, the cupola's grey lead.
 *
 * Doubts: the photos show three faces; the model alternates windows (the
 * four straight faces) and doors (the four diagonal faces) all round, as
 * those faces do. The timber arbours where the games are played (posts and
 * beams, wisteria) stand apart on the terrace; OSM doesn't map them and no
 * open aerial shows their plan, so they are left out.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { board, opening, openingPts, archPts, slabUp, box, type P2 } from './nyc-cp-dairy'

const brick = new Part(), buff = new Part(), granite = new Part(), slate = new Part(), lead = new Part(), win = new Part()

const R = 5.64 // apothem of the octagon (x ±5.62, y ±5.66)
const side = 2 * R * Math.tan(Math.PI / 8)
const EAVE = 3.75, APEX = 6.1
// Octagon corners, counter-clockwise, flat faces facing ±x, ±y.
const oct = (r: number): P2[] => Array.from({ length: 8 }, (_, i): P2 => {
  const a = Math.PI / 8 + (i * Math.PI) / 4, rc = r / Math.cos(Math.PI / 8)
  return [rc * Math.cos(a), rc * Math.sin(a)]
})

// Walls, base and bands.
slabUp(granite, oct(R + 0.06), 0, 0.45)
slabUp(brick, oct(R), 0.45, EAVE)
for (const z of [1.1, 1.9, 2.7]) slabUp(buff, oct(R + 0.03), z - 0.08, z + 0.08)
slabUp(slate, oct(R + 0.1), EAVE - 0.25, EAVE) // dark fascia under the eave

// Openings: face k has outward normal at angle k·45°; even k (E, N, W, S) windows, odd k doors.
for (let k = 0; k < 8; k++) {
  const a = (k * Math.PI) / 4, nx = Math.cos(a), ny = Math.sin(a), cx = R * nx, cy = R * ny
  const w = k % 2 === 0 ? 2.9 : 1.6, z0 = k % 2 === 0 ? 1.1 : 0.45, z1 = 2.8, rise = 0.28
  // Voussoirs: a segmental arch band of alternating buff and brick blocks.
  const at = (s: number, z: number): V3 => [cx - ny * s + nx * 0.05, cy + nx * s + ny * 0.05, z]
  const outer = archPts(w + 0.9, z1 - rise, rise + 0.12, 9), inner = archPts(w, z1 - rise, rise, 9)
  // Ring segments: segmental head drawn as blocks between outer and inner curves.
  const seg = (pts: P2[]) => pts.filter((_, i) => i !== Math.floor(pts.length / 2) || pts.length % 2 === 1)
  const O = seg(outer), I = seg(inner)
  const n = Math.min(O.length, I.length)
  for (let i = 0; i < n - 1; i++) {
    const quad: P2[] = [I[i], I[i + 1], [O[i + 1][0], O[i + 1][1] + 0.35], [O[i][0], O[i][1] + 0.35]]
    board(i % 2 === 0 ? buff : brick, quad, at, [nx, ny, 0], 0.06, false)
  }
  if (k % 2 === 0) box(granite, 0, 0, 0, 0, 0, 0) // placeholder removed below
  opening(win, cx, cy, nx, ny, w, z0, z1, rise, 0.09, 4)
  // Granite sill under the windows.
  if (k % 2 === 0) board(granite, [[-w / 2 - 0.1, z0 - 0.14], [w / 2 + 0.1, z0 - 0.14], [w / 2 + 0.1, z0], [-w / 2 - 0.1, z0]], at, [nx, ny, 0], 0.16)
}

// The roof: a low octagonal pyramid of slate over a 0.45 m overhang.
const eaveRing = oct(R + 0.45), z0 = EAVE - 0.05
const top = oct(0.75)
for (let i = 0; i < 8; i++) {
  const j = (i + 1) % 8, a = eaveRing[i], b = eaveRing[j], c = top[j], d = top[i]
  slate.quad([a[0], a[1], z0], [b[0], b[1], z0], [c[0], c[1], APEX - 0.2], [d[0], d[1], APEX - 0.2])
  slate.quad([a[0], a[1], z0 - 0.15], [b[0], b[1], z0 - 0.15], [b[0], b[1], z0], [a[0], a[1], z0])
  slate.tri([b[0], b[1], z0 - 0.15], [a[0], a[1], z0 - 0.15], [0, 0, z0 - 0.15])
}
// The cupola: a square louvred lantern of lead, a cornice and a pointed spire.
const q = 0.55
box(lead, -q, -q, q, q, APEX - 0.4, APEX + 1.0)
for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as P2[]) opening(win, nx * q, ny * q, nx, ny, 0.7, APEX + 0.05, APEX + 0.85, 0, 0.03)
box(lead, -q - 0.12, -q - 0.12, q + 0.12, q + 0.12, APEX + 1.0, APEX + 1.15)
const sp: P2[] = [[-q, -q], [q, -q], [q, q], [-q, q]]
for (let i = 0; i < 4; i++) { const a = sp[i], b = sp[(i + 1) % 4]; lead.tri([a[0], a[1], APEX + 1.15], [b[0], b[1], APEX + 1.15], [0, 0, 7.75]) }
box(lead, -0.04, -0.04, 0.04, 0.04, 7.7, 8.0)
void openingPts

finishModel('Chess & Checkers House', 'nyc-chess-checkers-house', [
  { part: brick, material: { name: 'brick', color: 0xb05a4a, roughness: 0.9 } },
  { part: buff, material: { name: 'buff', color: 0xe6d6aa, roughness: 0.85 } },
  { part: granite, material: { name: 'granite', color: 0xa8a49b, roughness: 0.85 } },
  { part: slate, material: { name: 'slate', color: 0x5f646b, roughness: 0.8 } },
  { part: lead, material: { name: 'lead', color: 0x9ea4a6, roughness: 0.6 } },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
], { bearing: 0, osm: 'way/265347597', height: 8.0 }, 5000)
