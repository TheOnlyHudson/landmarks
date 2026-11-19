/**
 * Little Caesars Arena, Detroit (NHL Red Wings, NBA Pistons, opened 2017) —
 * procedural, CC0-1.0, no textures.  bun generators/det-little-caesars-arena.ts
 *
 * Map frame: turned to bearing 153.5°, the long axis of the outline and of
 * the roof's oval (OSM way/526548805 edges at 153.5° and 62°). +y points
 * SSE toward I-75, +x WSW toward Cass Avenue; Woodward is on the -x side.
 * Anchor: the outline's area centroid. z = 0 is the street (the lidar's
 * lowest return, 7 m lower, is the loading dock and event-level ramp).
 *
 * The bowl is sunk (event level about three storeys down: OSM
 * building:levels:underground=3), but the arena is enclosed, so the map
 * draws nothing inside it and the model is the shell from the street:
 * `elevation` 0.
 *
 * What makes it itself: the oval roof, a white top cap over a silver ribbed
 * metal skin that sweeps down over the "Via" concourse to the brick and dark
 * mid-rise buildings wrapping the block. (The photos and NAIP show the roof
 * white and silver, not dark.)
 *
 * Massing from the USGS lidar (USGS_LPC_MI_WayneCo_2017_LAS_2018, flown
 * 2017 while the arena was finishing; the roof and surrounding blocks are
 * complete in it), heights above the street:
 *   - roof crown 34 m at (4, -10); the oval rim at about 24 m, 63 m from
 *     the centre across and 74–76 m along; the skin running on down to
 *     about 21 m over the concourse ring;
 *   - the wrapping buildings (OSM parts of 3–5 levels) 20–21 m, drawn as
 *     one block over the outline.
 *
 * Evidence
 * - OSM: outline way/526548805 and building relation/9124656 with its
 *   parts (all listed in `replaces`); wikidata Q18154984.
 * - Measured: lidar 2017; USGS NAIP orthophoto (the oval, the white cap and
 *   the ribbed skin, about 56 ribs).
 * - Published: opened September 2017; HKS architects (Wikipedia, "Little
 *   Caesars Arena").
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   - "Little Caesars Arena from above.jpg", JJonahJackalope (CC BY-SA 4.0): the roof's
 *     white cap and silver ribbed skin, the brick and dark buildings round it.
 *   - "Detroit August 2025 07 (Little Caesars Arena).jpg", Michael Barera
 *     (CC BY-SA 4.0): the Woodward side, brick and dark-panelled blocks.
 *   - "Little Caesar Arena Detroit.jpg", Ed from Queens (CC BY 2.0): the
 *     roof rising behind the wrap buildings from Woodward.
 * Estimated: window bands; rib size. Simplified: the wrap buildings are all
 * brick, though the Woodward block is clad in dark panels. Not drawn: the sign tower and lettering
 * on Woodward, the roof graphics.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, quad, type XY } from './dc-nationals-park'

const OUTLINE: XY[] = [[73.2, 33.0], [64.9, 62.5], [62.1, 61.8], [59.8, 70.2], [57.6, 78.6], [60.0, 79.3], [68.4, 81.6], [68.1, 89.3], [67.9, 93.0], [55.6, 92.6], [55.6, 91.4], [47.7, 91.0], [47.6, 92.1], [23.8, 91.1], [23.8, 89.9], [20.1, 89.7], [20.1, 90.9], [0.7, 89.8], [0.8, 88.4], [-9.4, 87.5], [-9.7, 89.0], [-18.4, 86.5], [-19.1, 88.7], [-37.6, 87.2], [-37.5, 83.5], [-42.7, 81.9], [-42.2, 79.7], [-41.2, 76.4], [-40.9, 75.1], [-44.5, 74.0], [-43.5, 70.4], [-50.2, 68.5], [-60.5, 65.6], [-64.2, 78.5], [-66.0, 84.7], [-67.4, 84.3], [-67.2, 83.8], [-79.0, 82.6], [-79.2, 77.8], [-79.1, 34.5], [-76.6, 34.6], [-76.5, 29.9], [-79.4, 29.9], [-79.4, -6.9], [-76.0, -6.9], [-76.0, -12.3], [-79.2, -12.4], [-79.3, -28.7], [-77.7, -34.4], [-78.9, -34.7], [-78.9, -60.1], [-70.4, -59.7], [-68.3, -67.3], [-52.5, -62.2], [-50.9, -68.4], [-49.2, -74.7], [-51.9, -75.6], [-51.1, -91.1], [-16.4, -88.2], [4.5, -87.1], [25.7, -85.5], [43.5, -84.4], [80.6, -83.4], [79.8, -68.3], [75.1, -65.6], [75.8, -60.7], [76.8, -54.0], [79.2, -54.5], [78.1, -22.8], [75.2, 6.3], [74.1, 6.3], [73.7, 11.3], [74.7, 11.3]]

const white = new Part(), silver = new Part(), brick = new Part(), stone = new Part(), glass = new Part()

// ---------------------------------------------------------------------------
// The roof: an oval dome over rings of ρ (1 = the rim), then the skin on
// down to the wrap buildings.
const CX = 6, CY = -14, A = 62, BS = 64, BN = 66 // BS toward -y (the NNW end), BN toward +y (SSE)
const N = 56
const RINGS: [number, number][] = [ // [ρ, z]
  [0, 34], [0.3, 33.2], [0.55, 31.0], [0.72, 29.3], [0.86, 27.0], [1.0, 24.0], [1.13, 21.0],
]
const CAP = 3 // rings below this index are the white cap
// The north (-y) end stays high to its edge (lidar: 27 m at y -82); the
// silver skin sweeps lowest on the south and east, as the NAIP shows.
const LIFT = [0, 0, 0, 0, 1.5, 3, 5.5]
const pt = (rho: number, th: number, z: number, k = -1): V3 => {
  const b = Math.sin(th) > 0 ? BN : BS
  const lift = k >= 0 ? LIFT[k] * Math.max(0, -Math.sin(th)) : 0
  return [CX + A * rho * Math.cos(th), CY + b * rho * Math.sin(th), z + lift]
}
const isWhite = (k: number, _th: number) => k < CAP
{
  for (let k = 0; k < RINGS.length - 1; k++) {
    const [r0, z0] = RINGS[k], [r1, z1] = RINGS[k + 1]
    for (let i = 0; i < N; i++) {
      const t0 = (2 * Math.PI * i) / N, t1 = (2 * Math.PI * (i + 1)) / N
      const part = isWhite(k, (t0 + t1) / 2) ? white : silver
      const a0 = pt(r0, t0, z0, k), a1 = pt(r0, t1, z0, k), b0 = pt(r1, t0, z1, k + 1), b1 = pt(r1, t1, z1, k + 1)
      if (r0 === 0) part.tri(a0, b0, b1)
      else quad(part, [a0, b0, b1, a1], [0, 0, 1])
    }
  }
  // Ribs on the silver skin: raised radial strips, one per segment.
  for (let i = 0; i < N; i++) {
    const th = (2 * Math.PI * (i + 0.5)) / N, dth = 0.006
    for (let k = CAP; k < RINGS.length - 1; k++) {
      if (isWhite(k, th)) continue
      const [r0, z0] = RINGS[k], [r1, z1] = RINGS[k + 1]
      const h = 0.35
      const L0 = pt(r0, th - dth, z0, k), R0 = pt(r0, th + dth, z0, k), L1 = pt(r1, th - dth, z1, k + 1), R1 = pt(r1, th + dth, z1, k + 1)
      const up = (p: V3): V3 => [p[0], p[1], p[2] + h]
      quad(silver, [up(L0), up(R0), up(R1), up(L1)], [0, 0, 1])
      const side: V3 = [-Math.sin(th), Math.cos(th), 0]
      quad(silver, [L0, L1, up(L1), up(L0)], [-side[0], -side[1], 0])
      quad(silver, [R0, R1, up(R1), up(R0)], side)
    }
  }
  // The skin's lower edge meets the wrap buildings' roofs.
  for (let i = 0; i < N; i++) {
    const t0 = (2 * Math.PI * i) / N, t1 = (2 * Math.PI * (i + 1)) / N, r = RINGS[RINGS.length - 1][0]
    const a = pt(r, t0, 21, RINGS.length - 1), b = pt(r, t1, 21, RINGS.length - 1)
    quad(silver, [[a[0], a[1], 20.4], [b[0], b[1], 20.4], b, a], [Math.cos(t0), Math.sin(t0), 0])
  }
}

// ---------------------------------------------------------------------------
// The wrap buildings round the block, 20.5 m: brick with glazed bays.
prism(OUTLINE, 0, 19.3, brick, null)
prism(OUTLINE, 19.3, 20.5, stone, silver)

function ringBays(ring: XY[], bay: number, rows: [number, number][]) {
  const area = ring.reduce((s, p, i) => { const q = ring[(i + 1) % ring.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const r = area < 0 ? [...ring].reverse() : ring // counter-clockwise: outside is to the right
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 7) continue
    const e: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: V3 = [e[1], -e[0], 0]
    const n = Math.max(1, Math.round(L / bay))
    for (let j = 0; j < n; j++) {
      const u0 = (L / n) * j + 1.0, u1 = (L / n) * (j + 1) - 1.0
      for (const [z0, z1] of rows) {
        const q = (u: number, z: number): V3 => [a[0] + e[0] * u + nrm[0] * 0.25, a[1] + e[1] * u + nrm[1] * 0.25, z]
        quad(glass, [q(u0, z0), q(u1, z0), q(u1, z1), q(u0, z1)], nrm)
      }
    }
  }
}
ringBays(OUTLINE, 7, [[1.2, 4.6], [8, 16.5]])

// ---------------------------------------------------------------------------
const parts = [
  { part: white, material: PALETTE.trim },
  { part: silver, material: finish('lca-silver', 0xc3cad0, 0.5) },
  { part: brick, material: finish('lca-brick', 0xb98169) },
  { part: stone, material: PALETTE.stone },
  { part: glass, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Little Caesars Arena', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 153.5, osm: 'way/526548805', height: 34,
  })
  if (glb.length > 240000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/det-little-caesars-arena.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
