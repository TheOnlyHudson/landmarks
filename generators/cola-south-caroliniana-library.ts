/**
 * South Caroliniana Library, University of South Carolina, Columbia —
 * procedural, CC0-1.0, no textures.
 * bun generators/cola-south-caroliniana-library.ts
 *
 * The South Carolina College library of 1840 (after a design by Robert
 * Mills), the first free-standing college library building in the United
 * States, with wings added in 1927 and 1940. A red-brick block at the
 * Sumter Street end of the Horseshoe; its identity is the giant portico of
 * four plain white Tuscan columns under a white entablature and attic,
 * between two-storey brick wings with a white string course and cornice,
 * round-headed upper windows and a row of small square windows under the
 * cornice.
 *
 * Map frame: x east, y north, z up, metres. Anchor: the area centroid of
 * OSM way/108351420 (lng -81.0299041, lat 33.9983453). Its walls run
 * 160° / 70°, as all the Horseshoe's do, so it is placed at bearing 340 and
 * built square: the front is model -y (true bearing 160), facing the lawn.
 *
 * Replaces: way/108351420 (OSM has no parts).
 *
 * Evidence
 * - OSM way/108351420 (measured), in the model frame: the wings
 *   x -25.4..-12.9 and 4.8..17.2, y -3.4..16; the 1840 centre between them,
 *   y -3.5..8.5, with a round apse on its back (centre x -4.0, radius 2.9,
 *   to y 12.8); the portico zone in front, x -11.8..4.3 to y -8.1.
 * - USGS 3DEP lidar, SC_SavannahPeeDee_5_2019 (2019 flight), 0.5 m grid,
 *   above the ground around it (flat, within 0.5 m) (measured): wings 12.8;
 *   centre 13.2–13.6 with a raised attic edge to ~15 across its front; the
 *   portico roof 13.3 ending ~1 m short of the OSM line; the apse 13.0.
 * - Photos (Wikimedia Commons):
 *   "South Caroliniana Library.jpg" (ProfReader, CC BY-SA 4.0)
 *   https://commons.wikimedia.org/wiki/File:South_Caroliniana_Library.jpg
 *   — the front square on: four columns evenly spaced, the white
 *   entablature and the stepped white attic over it, the string course at
 *   the first floor, ground-floor windows with white sills, tall
 *   round-headed upper windows, small square windows under the cornice, a
 *   plain door in the centre.
 *   "South Caroliniana Library, Horseshoe, University of South Carolina,
 *   Sumter Street, Columbia, SC.jpg" (w_lemay, CC BY-SA 2.0)
 *   https://commons.wikimedia.org/wiki/File:South_Caroliniana_Library,_Horseshoe,_University_of_South_Carolina,_Sumter_Street,_Columbia,_SC_-_53398531755.jpg
 *   — the portico from the south-west, its depth, the east wing.
 *   Colours: red-brown brick, white trim, from these, pulled to the palette.
 * - Published (Wikipedia "South Caroliniana Library"; NRHP 1970): built
 *   1840, Robert Mills's design; wings 1927 and 1940.
 * - Estimated: column spacing (4.5 m) and size (1.1 m across) from the
 *   front photo scaled to the portico's OSM width; window and band heights
 *   from the same photo scaled to the lidar cornice; the back and the ends
 *   (no photo) drawn with the same window rows.
 * - Simplified: the attic's steps as two blocks; sills, the door's
 *   surround and the brick piers between bays are left out.
 *
 * Night: the portico is floodlit; windows glow; the door is `entrance`.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, cylinder, rect } from './dc-white-house'
import { saveModel } from './dc-nga-west'
import { archWindow, block, door, newKit, windowBays, type Rect, type Side } from './cola-usc-horseshoe'

const G = 0.3 // the ground at the front above the lowest ground under the footprint
const EAVE = 12.8

function build() {
  const k = newKit()

  /** The window rows of a bay: a rectangle below, a round-headed light above, a small square under the cornice. */
  const bays = (side: Side, at: number, a0: number, a1: number, pitch = 3.3, skip = (c: number) => false) => {
    windowBays(k.win, side, at, a0, a1, [[1.0, 3.0], [9.5, 10.6]], G, pitch, 1.2, undefined, skip)
    const n = Math.max(1, Math.round((a1 - a0) / pitch)), step = (a1 - a0) / n
    for (let i = 0; i < n; i++) {
      const c = a0 + step * (i + 0.5)
      if (!skip(c)) archWindow(k.win, undefined, side, at, c, 1.3, G + 4.6, G + 8.2)
    }
  }
  /** A brick block with the white string course and cornice. */
  const brick = (r: Rect, eave: number, faces: Side[]) => {
    block(k, r, G, eave, { faces: [], cornice: 1.0, overhang: 0.3 })
    cbox(k.trim, { x0: r.x0 - 0.08, x1: r.x1 + 0.08, y0: r.y0 - 0.08, y1: r.y1 + 0.08 }, G + 3.7, G + 4.0, { top: false, bottom: true })
    for (const s of faces) {
      const ns = s === 'n' || s === 's'
      const at = s === 'n' ? r.y1 : s === 's' ? r.y0 : s === 'e' ? r.x1 : r.x0
      bays(s, at, (ns ? r.x0 : r.y0) + 0.5, (ns ? r.x1 : r.y1) - 0.5)
    }
  }

  // ---- The wings.
  brick(rect(-25.4, -12.9, -3.4, 15.7), EAVE, ['s', 'w', 'n', 'e'])
  brick(rect(4.8, 17.2, -3.6, 16.1), EAVE, ['s', 'e', 'n', 'w'])

  // ---- The 1840 centre, its apse behind, and the attic over the front.
  block(k, rect(-12.9, 4.8, -3.5, 8.5), G, 13.5, { faces: [], cornice: 1.0, overhang: 0.3 })
  cbox(k.trim, rect(-12.98, 4.88, -3.58, 8.58), G + 3.7, G + 4.0, { top: false, bottom: true })
  bays('n', 8.5, -12.4, -7.2, 2.6)
  bays('n', 8.5, -0.8, 4.3, 2.6)
  const ax = -4.0, ay = 8.5, ar = 2.9
  const ring: V3[] = Array.from({ length: 9 }, (_, i) => { const a = (Math.PI * i) / 8; return [ax + ar * Math.cos(a), ay + ar * Math.sin(a), 0] as V3 })
  for (let i = 0; i < 8; i++) {
    const a = ring[i], b = ring[i + 1]
    k.wall.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], G + 12.0], [a[0], a[1], G + 12.0])
    k.trim.quad([a[0], a[1], G + 12.0], [b[0], b[1], G + 12.0], [b[0], b[1], G + 13.0], [a[0], a[1], G + 13.0])
    k.roof.tri([ax, ay, G + 13.0], [a[0], a[1], G + 13.0], [b[0], b[1], G + 13.0])
  }
  // the front attic: two white steps over the portico
  cbox(k.trim, rect(-11.8, 4.3, -3.6, 2.0), G + 13.3, G + 14.3, { b: 0.1 })
  cbox(k.trim, rect(-7.2, -0.3, -3.6, 1.0), G + 14.3, G + 15.0, { b: 0.1 })

  // ---- The portico: four giant Tuscan columns, the entablature and its roof.
  const PY = -7.1
  cbox(k.trim, rect(-11.8, 4.3, PY - 0.9, -3.5), 0, G + 0.3, { b: 0.05 })
  for (const x of [-10.5, -6.0, -1.5, 3.0]) tuscan(k.trim, x, PY, 0.55, G + 0.3, G + 11.6)
  cbox(k.trim, rect(-11.8, 4.3, PY - 0.7, -3.5), G + 11.6, G + 13.3, { b: 0.15, bottom: true, top: k.roof })
  // behind the columns: the centre's door and windows
  door(k, 's', -3.5, -3.75, G, 1.6, 2.6, 0.3)
  for (const x of [-9.4, -6.6, -0.9, 1.9]) windowBays(k.win, 's', -3.5, x - 0.7, x + 0.7, [[1.0, 3.0]], G, 1.4, 1.2)
  for (const x of [-8.0, -3.75, 0.5]) archWindow(k.win, undefined, 's', -3.5, x, 1.4, G + 4.6, G + 8.6)

  const lit = (p: V3, n: V3) => (p[1] < -3.2 && p[0] > -12 && p[0] < 4.5 ? (n[2] > 0.8 ? 0.3 : 0.9) : 0)
  return [
    { part: k.wall, material: BRICK },
    { part: k.trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: k.roof, material: PALETTE.roof },
    { part: k.win, material: PALETTE.window },
    { part: k.door, material: PALETTE.entrance },
  ]
}

/** A plain Tuscan column: square plinth, tapering round shaft, a cushion cap and abacus. */
function tuscan(p: Part, x: number, y: number, r: number, z0: number, z1: number) {
  cbox(p, rect(x - r * 1.25, x + r * 1.25, y - r * 1.25, y + r * 1.25), z0, z0 + 0.4, { b: 0.06 })
  cylinder(p, x, y, r, z0 + 0.4, z1 - 0.6, 12, r * 0.86)
  cylinder(p, x, y, r * 0.86, z1 - 0.6, z1 - 0.3, 12, r * 1.15)
  cbox(p, rect(x - r * 1.25, x + r * 1.25, y - r * 1.25, y + r * 1.25), z1 - 0.3, z1, { bottom: true })
}

/** Red-brown brick, pulled to the palette's lightness. */
const BRICK = finish('caroliniana-brick', 0xa86a55)

if (import.meta.main) {
  await saveModel('cola-south-caroliniana-library', 'South Caroliniana Library', build(), { source: 'generators/cola-south-caroliniana-library.ts' })
}
