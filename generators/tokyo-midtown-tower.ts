/**
 * Tokyo Midtown Tower (ミッドタウン・タワー), Akasaka, Minato, Tokyo:
 * procedural, CC0-1.0.  bun generators/tokyo-midtown-tower.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 * Uses the shared kit in tokyo-metropolitan-government-building.ts.
 *
 * Completed 2007 (Skidmore, Owings & Merrill, Nikken Sekkei); 54 floors;
 * 248.1 m to the top of the crown frame (OSM height 248.1; Wikipedia
 * "Midtown Tower": 248.1 m).
 *
 * Plan (OSM way/103007069, the only OSM building for the tower; the
 * Galleria and the glass canopy (way/605608659, building=roof) to its
 * south-west are separate and stay the map's): a 74 x 57 m slab whose long
 * axis runs to bearing 130; built turned to bearing 40 so the long faces
 * face model north and south. Its corner notches (OSM: 5.7 x 6.6 m at the
 * west, 2.8 x 6 m at the east) mark where the slab's three interlocking
 * volumes meet, read from the photos as:
 * - the west half: bronze-beige vertical louvres over dark glass, grouped
 *   into broad vertical bands (one 2.6 m band every 4.6 m in the low model,
 *   3D fins every 1.55 m in the detail) tied by a bronze band every six
 *   floors; it stops well short of the top, ~225 m (estimated);
 * - the middle: the green-grey glass slab, the tallest, its roof at ~241 m
 *   under an open glass-and-steel crown frame to 248.1 m;
 * - the east end: darker blue glass with vertical fins, to ~235 m.
 * The green middle rises clearly above both (Kakidai's view from the
 * north-west, Ymblanter's from the south).
 * (Ymblanter's "seen from the south", Kakidai's "Tokyo Midtown.2", Rs1421's
 * five views, Guilhem Vellut's from the garden.)
 * Colours (daylight, sampled): the louvred face averages #a39b80 (Kakidai,
 * louvres and glass together; #977452 in Ymblanter's sunset light), fins
 * drawn bronze-beige #b6a383 over `window` #6a7f90; green
 * glass #86a3a0 to #9bb4b0, drawn `window-2` #93adaa; dark glass #4f6577 to
 * #677d8e, drawn `window` #6a7f90; frame and mullions pale.
 * Estimated: the split lines between the volumes (from the photos'
 * proportions), the two lower roofs, the crown frame's grid.
 *
 * Frame: origin at 139.7312811, 35.6661160, the outline's centroid; y = 0
 * is the ground (the map's terrain is flat to 0.3 m under the footprint).
 *
 * Photos (Wikimedia Commons):
 * - "Tokyo Midtown Tower seen from the south.jpg", Ymblanter, CC BY-SA 4.0
 * - "Tokyo Midtown.2.JPG", Kakidai, CC BY-SA 3.0
 * - "Tokyo-Midtown-Tower-01.jpg", "-03.jpg", "-05.jpg", Rs1421, CC BY-SA 3.0
 * - "Midtown Tower from Tokyo Midtown.jpg", itoshin87, public domain
 * - "Midtown Tower @ Tokyo Midtown @ Akasaka (9434354728).jpg" and
 *   "(9431583961).jpg", Guilhem Vellut, CC BY 2.0
 * - "Tokyo Midtown from Tokyo Tower (11696816565).jpg", Guilhem Vellut, CC BY 2.0
 * No lidar (Japan). No look-only sources.
 * Doubts: the north face is seen only from far off and is drawn as the
 * south's mirror; which corner each volume's notch belongs to is inferred.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, panels, member, capPoly, writeModel, type XY, type Layer } from './tokyo-metropolitan-government-building'

const HT = 248.1, ROOF_G = 241, ROOF_B = 225, ROOF_D = 235
const FL = ROOF_G / 54, ROW = 3 * FL
// the three volumes, counter-clockwise, in the bearing-40 frame (OSM corners)
const yN = (x: number) => 28.25 - 0.0586 * x // the north face runs slightly askew (OSM)
const B: XY[] = [[-31.5, -28.5], [0, -28.5], [0, yN(0)], [-37, yN(-37)], [-37, -21.9], [-31.5, -21.9]]
const G: XY[] = [[0, -28.5], [26, -28.5], [26, yN(26)], [0, yN(0)]]
const D: XY[] = [[26, -28.5], [37.3, -28.5], [37.3, 20.3], [34.7, 20.3], [34.7, yN(34.7)], [26, yN(26)]]

type Lod = { detail: boolean }

function build(L: Lod): Layer[] {
  const louvre = new Part(), dark = new Part(), green = new Part(), trim = new Part(), roof = new Part(), trimEntrance = new Part()
  const inner = (x: number) => (m: XY) => Math.abs(m[0] - x) < 0.01

  // --- the west volume: bronze-beige vertical louvres over dark glass, grouped into bands
  prism(dark, B, 0, ROOF_B, { roof, lip: 0.8 })
  const skipB = (_: number, m: XY) => inner(0)(m)
  if (!L.detail) vlines(louvre, B, 4, ROOF_B, 4.6, 2.6, skipB, 0.1)
  else vlines(louvre, B, 4, ROOF_B, 1.55, 0.45, skipB, 0.8)
  // horizontal bronze bands every six floors tie the fins into groups; a solid band at the top
  for (let z = 4; z < ROOF_B - 4; z += 2 * ROW) ring(louvre, B, z - 0.6, z + 0.6, L.detail ? 0.85 : 0.12, skipB)
  ring(louvre, B, 189, 191, L.detail ? 0.85 : 0.12, skipB)
  ring(louvre, B, ROOF_B - 2.4, ROOF_B, L.detail ? 0.85 : 0.12, skipB)

  // --- the middle volume: green glass, mullion lines, the crown frame
  prism(green, G, 0, ROOF_G, { roof, lip: 0.6 })
  for (let z = ROW; z < ROOF_G - 2; z += ROW) ring(trim, G, z - 0.3, z + 0.3, 0.06, (_, m) => inner(0)(m) || inner(26)(m))
  vlines(trim, G, 0, ROOF_G, L.detail ? 4.5 : 9, 0.45, (_, m) => inner(0)(m) || inner(26)(m))
  // the crown: an open frame continuing the walls from the roof to 248.1 m
  {
    const r = L.detail ? 0.35 : 0.6
    const c: XY[] = [[0.6, -27.9], [25.4, -27.9], [25.4, yN(25.4) - 0.6], [0.6, yN(0.6) - 0.6]]
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4], len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(len / (L.detail ? 4.5 : 9))
      for (let k = 0; k < n; k++) {
        const t = k / n, p: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
        member(trim, [p[0], p[1], ROOF_G], [p[0], p[1], HT - r], r, 4)
      }
      for (const z of L.detail ? [ROOF_G + 3.5, HT - r] : [HT - r]) member(trim, [a[0], a[1], z], [b[0], b[1], z], r, 4)
    }
    // rooftop plant inside the frame
    const pl: XY[] = [[5, -22], [21, -22], [21, 20], [5, 20]]
    prism(roof, pl, ROOF_G, ROOF_G + 4.5, { bevel: 0.3 })
  }

  // --- the east volume: dark glass with vertical fins
  prism(dark, D, 0, ROOF_D, { roof, lip: 0.6 })
  vlines(trim, D, 0, ROOF_D, L.detail ? 2.4 : 4.6, L.detail ? 0.35 : 0.5, (_, m) => inner(26)(m), L.detail ? 0.6 : 0.08)
  for (let z = 2 * ROW; z < ROOF_D - 2; z += 2 * ROW) ring(trim, D, z - 0.25, z + 0.25, 0.06, (_, m) => inner(26)(m))

  // the lobby: a lit glazed band round the foot of the glass volumes
  ring(trimEntrance, G, 0.3, 7, 0.07, (_, m) => inner(0)(m) || inner(26)(m))
  ring(trimEntrance, D, 0.3, 7, 0.07, (_, m) => inner(26)(m))

  return [
    { part: louvre, material: finish('midtown-louvre', 0xb6a383) },
    { part: dark, material: { ...PALETTE.window, color: 0x6a7f90 } },
    { part: green, material: windowVariant(2, 0x93adaa) },
    { part: trim, material: finish('midtown-frame', 0xe9ebea) },
    { part: roof, material: PALETTE.roof },
    { part: trimEntrance, material: PALETTE.entrance },
  ]
}

/** A flush band round a ring's faces (skipping hidden ones). */
function ring(p: Part, r: XY[], z0: number, z1: number, out: number, skip: (i: number, m: XY) => boolean) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (skip(i, m)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    const P = (q: XY, z: number): V3 => [q[0] + nx * out, q[1] + ny * out, z]
    p.quad(P(a, z0), P(b, z0), P(b, z1), P(a, z1))
  }
}
/** Vertical lines (mullions, fins) every `bay` along a ring's faces; `depth` > 0.2 makes them 3D fins. */
function vlines(p: Part, r: XY[], z0: number, z1: number, bay: number, w: number, skip: (i: number, m: XY) => boolean, depth = 0.08) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    if (skip(i, m)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    const n = Math.round(L / bay)
    if (n < 2) continue
    for (let k = 1; k < n; k++) {
      const s = (L * k) / n
      const P = (d: number, o: number, z: number): V3 => [a[0] + ux * (s + d) + nx * o, a[1] + uy * (s + d) + ny * o, z]
      if (depth <= 0.2) p.quad(P(-w / 2, depth, z0), P(w / 2, depth, z0), P(w / 2, depth, z1), P(-w / 2, depth, z1))
      else {
        p.quad(P(-w / 2, depth, z0), P(w / 2, depth, z0), P(w / 2, depth, z1), P(-w / 2, depth, z1))
        p.quad(P(w / 2, 0, z0), P(w / 2, 0, z1), P(w / 2, depth, z1), P(w / 2, depth, z0))
        p.quad(P(-w / 2, 0, z0), P(-w / 2, depth, z0), P(-w / 2, depth, z1), P(-w / 2, 0, z1))
        p.quad(P(-w / 2, 0, z1), P(-w / 2, depth, z1), P(w / 2, depth, z1), P(w / 2, 0, z1))
      }
    }
  }
}
void capPoly

if (import.meta.main) {
  const meta = { bearing: 40, elevation: 0, height: HT }
  await writeModel('tokyo-midtown-tower', 'tokyo-midtown-tower.glb', 'Tokyo Midtown Tower', build({ detail: false }), meta, 5000, 256_000)
  await writeModel('tokyo-midtown-tower', 'tokyo-midtown-tower.detail.glb', 'Tokyo Midtown Tower', build({ detail: true }), meta, 40_000, 1536 * 1024)
}
