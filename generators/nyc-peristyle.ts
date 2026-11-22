/**
 * The Peristyle (Grecian Shelter), Prospect Park, Brooklyn (McKim, Mead &
 * White, 1905) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-peristyle.ts
 *
 * Frame: x across the shelter (toward 153.5°), y along it (toward 63.5°),
 * z up, metres. Placed at bearing 63.5°. Anchor: the area centroid of OSM
 * way/241846610 (-73.967596, 40.653182), which the model replaces.
 *
 * Evidence
 * - OSM way/241846610 (ODbL): amenity=shelter, 7.25 × 22.8 m rectangle,
 *   height=5.6, main axis 63.5°.
 * - Published (Wikipedia "Grecian Shelter"; NYC LPC designation 1966): open
 *   colonnade of Corinthian columns under an entablature and balustrade,
 *   limestone (cast stone restored 1990s), on a low stepped platform.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Jim.henderson, "Grecian Shelter shade jeh.JPG", public domain,
 *     https://commons.wikimedia.org/wiki/File:Grecian_Shelter_shade_jeh.JPG
 *     (three-quarter view from the south-west: column count, corner piers,
 *     proportions);
 *   Wil540 art, "Prospect Park Peristyle Sep 23 2021.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Peristyle_Sep_23_2021.jpg
 *     (dusk, the other three-quarter: floodlit columns).
 *
 * Counted from the photos: a square pier at each corner, ten columns between
 * the piers on each long side and three on each end. Estimated from the
 * photos scaled to people (~1.7 m): platform 0.45 m in three steps, columns
 * 4.25 m with base and capital, entablature 1.05 m with a 0.35 m cornice
 * projection, balustrade 0.9 m with pedestals at the corners and over the
 * piers. OSM's 5.6 m is taken as the top of the cornice.
 *
 * Night: the columns are uplit from their bases (dusk photo), drawn with a
 * _FLOODLIGHT that fades up the shafts.
 *
 * Doubts: the inner row of columns some photos suggest is not separately
 * confirmed and is left out; the ceiling is drawn flat. Capitals are bold
 * flared blocks, not acanthus.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect, capPoly } from './nyc-570-lexington'
import { box } from './nyc-prospect-park-boathouse'
import { cyl, cornice, parapet, piercings } from './nyc-litchfield-villa'
import { PALETTE, finish } from './palette'

/** Uplights at the column bases: brightest low on the shafts, fading upward; tops barely lit. */
const uplit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : Math.max(0.35, 1 - p[2] / 8))

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), shade = new Part(), base = new Part()
  const X = 3.62, Y = 11.4
  const P0 = 0.45, CAP = 4.7, ENT = 5.6, BAL = 6.5

  // Stepped platform (three steps of 0.15 m).
  for (let k = 0; k < 3; k++) {
    const o = 0.6 - k * 0.3
    prism({ wall: base, win: null, roof: base, ring: chamferRect(-X - o, -Y - o, X + o, Y + o, 0), z0: k * 0.15, z1: (k + 1) * 0.15, facade: null, bevel: 0.05 })
  }

  // Corner piers (square, with base and capital) and the columns between them.
  const PR = 0.36, CX = X - 0.42, CY = Y - 0.42
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = sx * CX, y = sy * CY
    box(stone, x - PR, y - PR, x + PR, y + PR, P0, CAP)
    box(trim, x - PR - 0.08, y - PR - 0.08, x + PR + 0.08, y + PR + 0.08, P0, P0 + 0.25)
    box(trim, x - PR - 0.12, y - PR - 0.12, x + PR + 0.12, y + PR + 0.12, CAP - 0.35, CAP)
  }
  const col = (x: number, y: number) => {
    const r = 0.24
    box(trim, x - 0.33, y - 0.33, x + 0.33, y + 0.33, P0, P0 + 0.22)
    cyl(stone, x, y, r, P0 + 0.22, CAP - 0.5, 8, false, Math.PI / 8)
    // Corinthian capital: a flared block under a square abacus
    const c0 = CAP - 0.5, c1 = CAP - 0.12
    const ring = (h: number, z: number) => chamferRect(x - h, y - h, x + h, y + h, h * 0.35).map(([a, b]) => [a, b, z] as [number, number, number])
    stone.loft([ring(r, c0), ring(0.36, c1)])
    box(trim, x - 0.4, y - 0.4, x + 0.4, y + 0.4, c1, CAP)
  }
  const nLong = 10, nEnd = 3
  for (const sx of [-1, 1]) for (let k = 1; k <= nLong; k++) col(sx * CX, -CY + (2 * CY * k) / (nLong + 1))
  for (const sy of [-1, 1]) for (let k = 1; k <= nEnd; k++) col(-CX + (2 * CX * k) / (nEnd + 1), sy * CY)

  // Entablature: architrave and frieze, then the projecting cornice.
  const E = chamferRect(-X + 0.02, -Y + 0.02, X - 0.02, Y - 0.02, 0)
  prism({ wall: trim, win: null, roof: null, ring: E, z0: CAP, z1: ENT - 0.35, facade: null, bevel: 0.08 })
  capPoly(shade, chamferRect(-X + 0.05, -Y + 0.05, X - 0.05, Y - 0.05, 0), CAP + 0.01, false)
  cornice(trim, E, ENT - 0.35, ENT, 0.35, roof)
  // Balustrade: a light band with dark piercings, pedestals at corners and over the piers.
  const B = chamferRect(-X - 0.1, -Y - 0.1, X + 0.1, Y + 0.1, 0)
  parapet(trim, B, ENT, BAL, 0.3)
  piercings(shade, B, ENT + 0.22, BAL - 0.2, 1.15, 0.78, 0.9)
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(trim, sx * (X + 0.1) - 0.55, sy * (Y + 0.1) - 0.55, sx * (X + 0.1) + 0.55, sy * (Y + 0.1) + 0.55, ENT, BAL + 0.08)
  for (const sx of [-1, 1]) box(trim, sx * (X + 0.1) - 0.5, -0.45, sx * (X + 0.1) + 0.5, 0.45, ENT, BAL + 0.05)

  finishModel('Peristyle (Grecian Shelter)', 'nyc-peristyle', [
    { part: stone, material: { ...PALETTE.stone, floodlight: uplit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: (p, n) => 0.5 * uplit(p, n) } },
    { part: base, material: finish('granite-step', 0xc9c4ba) },
    { part: roof, material: PALETTE.roof },
    { part: shade, material: finish('shade', 0x979ea3) },
  ], { bearing: 63.5, osm: 'way/241846610', height: BAL + 0.08 })
}

if (import.meta.main) build()
