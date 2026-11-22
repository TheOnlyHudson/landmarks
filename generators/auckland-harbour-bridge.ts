/**
 * Auckland Harbour Bridge (1959; Freeman Fox & Partners, Dorman Long and
 * Cleveland Bridge; the clip-ons 1969 by IHI) — procedural, CC0-1.0, no
 * textures.
 * bun generators/auckland-harbour-bridge.ts
 *
 * One model for the whole structure inside its OSM `man_made=bridge`
 * outline (way/302049182, 1.6 km from St Marys Bay over the harbour and
 * across Northcote Point): the original steel box truss, two planes 13.4 m
 * apart, as deck trusses under the roadway on the southern approach spans
 * and the side spans and, over the 244 m main span, rising above the
 * roadway in the arch ("the Coathanger") while its lower chord dips to the
 * main piers; the two "Nippon clip-on" box girders cantilevered outside it
 * on both sides, haunched deep over the main piers; the concrete piers; the
 * viaduct carrying the motorway on across Northcote Point to Sulphur Beach.
 * The roadways (eight lanes) are the map's: nothing here draws a road
 * surface.
 *
 * Frame: x across the bridge (east-south-east +), y along it (north-north-
 * east +, towards Northcote), z up, metres; origin on the water at the
 * main span's middle, halfway between the main piers' LINZ outlines.
 * Placed at bearing 27.92°, the line through the four charted piers.
 *
 * Two levels of detail from one description:
 * - low (≤ 6,500 triangles): every panel's chords and diagonals as solid
 *   members (verticals over the main span), top struts of the arch, the
 *   clip-on girders, piers, the Northcote viaduct, lights along the arch;
 * - detail (≤ 40,000): the same plus every vertical, the arch's top lateral
 *   X-bracing and sway frames, cross frames under the deck, the clip-ons'
 *   steel brackets on the piers, lamp standards along both edges.
 *
 * Sources:
 * - OSM (© OpenStreetMap contributors, ODbL): way/302049182 (the outline);
 *   the four charted piers (bridge:support=pier, from LINZ Auckland Harbour
 *   East chart) way/1000929559 and way/1000929560 (the main piers, 242 m
 *   apart), way/1000929555 and way/1000929556 (the next two south), each
 *   13.1 x 6.9 m at the water; seamark clearance 39 m under the main span.
 * - Published (Wikipedia "Auckland Harbour Bridge"; Structurae): spans
 *   80.82, 103.70, 114.375, 124.06, 177.28, 244.00 (main) and 176.90 m,
 *   1,021 m in all; 64 m above the water at the top; clearance 43.27 m
 *   above high water; 35.4 m wide, the original structure 13.4 m and each
 *   clip-on 11 m; four lanes on the truss and two on each clip-on; six
 *   reinforced concrete piers in the water; box truss, cantilever; clip-ons
 *   orthotropic steel box girders (1969); ornamental LED lighting (2017).
 * - Photos (Wikimedia Commons; EVIDENCE):
 *   "Auckland Harbour Bridge East" (Ingolfson, public domain; the whole
 *   elevation from the east: span layout, arch, deck trusses, measured
 *   below);
 *   "Auckland Harbour Bridge from NW" (Bjankuloski06, CC BY 4.0; the main
 *   span side-on from above: the arch's Warren web with verticals, the
 *   clip-on girders' haunches, the main piers);
 *   "Auckland Harbour Bridge - August 2024" (MrSeabody, CC0; the main pier,
 *   the side span's deepening deck truss, the clip-on soffit);
 *   "Auckland Harbour Bridge South" (Ingolfson, public domain; the southern
 *   approach's Warren deck trusses and piers);
 *   "Above Auckland Harbour Bridge looking SW" (Bjankuloski06, CC BY 4.0;
 *   the arch from above: top lateral bracing, the clip-ons either side);
 *   "Auckland Harbour Bridge entering Northcote Point" (Bjankuloski06, CC BY
 *   4.0; the viaduct across the point);
 *   "Auckland Harbour Bridge aerial" (Robert Linsdell, CC BY 2.0; plan and
 *   span rhythm from the Sky Tower);
 *   "Auckland Harbour Bridge at night" (Chris Gin, CC BY 2.0; lamp standards
 *   along both edges, the lit arch).
 * - Measured on "East" (0.74 m/px from the main span): the arch's top about
 *   19 m over the roadway at mid-span; the truss's depth about 16 m at the
 *   main piers and 20 m at mid-span; the main piers' tops about 16 m under
 *   the roadway; the approach trusses about 7.5 m deep.
 * - Estimated: the roadway profile (45.3 m above the water at mid-span, the
 *   published clearance plus a 2 m deck, on a vertical curve over ±200 m,
 *   then falling 5 % to 9.6 m at St Marys Bay and to the Northcote
 *   anchorage, then across Northcote Point at about 10 m over the ground,
 *   down to Sulphur Beach); the side spans' pier positions from the chart
 *   (the chart puts the side span at 190.7 m, against 177.28 published);
 *   the southern approach piers from the published spans; the clip-ons'
 *   haunch (7.5 m deep at the main piers, 3 m at mid-span, from the photos);
 *   panel lengths about 12 m; member sizes, drawn heavy so they read; the
 *   Northcote viaduct's piers every 35 m.
 * - Colour: the truss and clip-ons light grey in sunlit photos (grey steel
 *   against blue water), drawn #a3a9ad and #b3b6b5; the piers weathered
 *   concrete, drawn #b0a698.
 * - Ground: Mapterhorn z12 (the only zoom here) every 20 m in this frame,
 *   less its water reading, in GROUND; piers stand on it vertex by vertex.
 *
 * Night: the arch's LED lights along both top chords and the lamp standards
 * along both edges (`lamp`), the piers lit from below.
 *
 * Doubts: the roadway heights are estimated (no `ele` on the OSM ways); the
 * southern end's last 75 m and the Northcote viaduct are drawn plainly from
 * aerial photos; the clip-ons' brackets and diaphragms are simplified; the
 * web pattern of the side and approach spans is drawn as Warren with
 * verticals, as it reads from a distance.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { footedLoft, groundAt, chamferedRect, bead, type GroundGrid } from './bridge-kit'
import { quadOut, hexa } from './nyc-george-washington-bridge'
import { member, chord } from './brisbane-story-bridge'

export const ID = 'auckland-harbour-bridge'
export const BEARING = 27.92

// ---- Ground --------------------------------------------------------------------------

// Mapterhorn z12, metres above the harbour, every 20 m: rows along y from
// -840, columns across x from -100 to 40.
const GROUND: GroundGrid = { y0: -840, x0: -100, step: 20, z: [
  [2.2, 3.8, 4.0, 4.8, 8.0, 9.2, 8.5, 4.2],
  [0.4, 2.8, 4.0, 4.0, 8.5, 9.8, 8.5, 4.7],
  [0.0, 1.0, 3.6, 4.1, 5.2, 6.3, 5.6, 3.9],
  [0.0, 0.1, 1.5, 3.4, 4.0, 4.0, 4.1, 3.6],
  [0.0, 0.0, 0.0, 0.8, 3.5, 3.7, 4.0, 3.6],
  [0.0, 0.0, 0.0, 0.0, 0.5, 1.8, 3.3, 3.5],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.8, 2.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.1, 0.2, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 2.5, 4.5, 0.4, 0.0],
  [0.0, 0.0, 0.0, 0.1, 6.7, 9.1, 1.3, 0.0],
  [0.0, 0.1, 0.3, 0.1, 7.1, 13.5, 5.4, 0.1],
  [3.4, 4.0, 8.4, 7.2, 13.3, 16.3, 10.7, 0.3],
  [3.2, 6.9, 11.6, 15.4, 17.4, 18.7, 16.0, 4.2],
  [3.7, 8.8, 13.0, 19.0, 20.8, 20.3, 19.0, 14.1],
  [7.5, 11.0, 16.8, 21.0, 21.6, 21.2, 20.4, 19.4],
  [10.4, 15.9, 20.7, 22.0, 22.0, 21.8, 21.3, 20.5],
  [13.3, 19.0, 21.7, 22.3, 22.6, 22.4, 22.0, 21.1],
  [16.2, 21.4, 22.4, 22.6, 22.9, 22.5, 22.1, 21.8],
  [19.0, 22.3, 22.5, 22.9, 23.0, 22.9, 22.2, 21.7],
  [22.2, 22.5, 22.6, 22.9, 22.7, 22.4, 22.0, 21.9],
  [22.6, 22.6, 22.4, 22.1, 22.0, 22.0, 22.0, 21.7],
  [22.4, 22.3, 21.9, 21.7, 21.5, 21.7, 21.4, 19.3],
  [22.1, 21.4, 21.1, 20.8, 20.6, 20.3, 17.7, 11.3],
  [21.3, 20.4, 19.7, 19.4, 18.8, 16.9, 11.1, 4.0],
  [20.9, 19.8, 18.8, 18.1, 16.5, 13.9, 6.6, 3.5],
  [20.9, 19.6, 18.5, 17.1, 12.9, 10.2, 5.7, 3.4],
  [21.3, 19.8, 18.4, 16.1, 9.9, 5.4, 3.1, 0.7],
  [21.4, 20.0, 18.5, 16.7, 11.6, 4.3, 1.8, 0.0],
  [21.4, 20.3, 18.8, 17.0, 12.2, 3.2, 0.3, 0.0],
  [21.5, 20.5, 19.1, 17.9, 11.3, 2.5, 0.0, 0.0],
  [22.1, 21.1, 19.9, 17.2, 9.0, 1.2, 0.1, 0.0],
  [22.6, 21.6, 17.5, 7.9, 1.3, 0.0, 0.0, 0.0],
  [23.0, 22.0, 15.4, 4.5, 0.4, 0.0, 0.0, 0.0],
  [23.1, 20.4, 10.6, 1.9, 0.1, 0.0, 0.0, 0.0],
  [23.2, 20.5, 9.8, 1.2, 0.1, 0.0, 0.0, 0.0],
  [22.7, 18.2, 7.3, 2.1, 0.6, 0.0, 0.0, 0.0],
  [20.4, 12.2, 8.1, 7.8, 5.7, 1.8, 0.5, 0.0],
  [20.0, 9.1, 8.3, 10.1, 7.8, 4.3, 1.5, 0.0],
  [14.6, 8.1, 8.3, 9.4, 5.5, 2.9, 0.7, 0.0],
  [8.4, 6.9, 7.7, 5.7, 4.0, 0.4, 0.0, 0.0],
] }
const ground = (x: number, y: number) => groundAt(GROUND, x, y)

// ---- Layout --------------------------------------------------------------------------

const MP = 121.0                       // main piers, |y|
const PIERS_S = [-311.7, -439.5, -553.9, -657.6]   // southern piers (chart, then published spans)
const S_ABUT = -738.4                   // southern abutment of the steel spans
const S_END = -813.0                    // end of the outline
const N_ANCH = MP + 176.9               // Northcote anchorage
const TX = 6.7                          // truss planes, |x|
const CX0 = 7.4, CX1 = 17.7             // clip-on girders, |x|
const CREST = 45.3, CURVE = 200, GRADE = 0.05

/** Roadway height along the straight part of the bridge. */
function road(y: number): number {
  const a = Math.abs(y)
  if (a <= CURVE) return CREST - (GRADE * a * a) / (2 * CURVE)
  return CREST - (GRADE * CURVE) / 2 - GRADE * (a - CURVE)
}
const ROAD_MP = road(MP)
const BEAR_MP = ROAD_MP - 16.0          // main piers' bearings
const ARCH_TOP = 64.0                    // top chord centre at mid-span (published height)

/** Top chord centre height: the arch over the main span, the deck elsewhere. */
function tc(y: number): number {
  const a = Math.abs(y), deck = road(y) - 0.9
  if (a >= MP) return deck
  const zp = ROAD_MP - 0.9
  return Math.max(deck, zp + (ARCH_TOP - zp) * (1 - (a / MP) ** 2))
}
/** Bottom chord centre height. */
function bc(y: number): number {
  const a = Math.abs(y)
  if (a <= MP) return BEAR_MP + 1.2 + (road(0) - 1.6 - BEAR_MP - 1.2) * (1 - (a / MP) ** 2)
  const side = y < 0 ? -PIERS_S[0] - MP : N_ANCH - MP
  const shallow = road(y) - 8.5
  if (a >= MP + side) return shallow
  const t = 1 - (a - MP) / side
  return shallow - (shallow - BEAR_MP - 1.2) * t * t
}

/** Panel points of the steel truss, south to north. */
function stations(): number[] {
  const ys: number[] = []
  const run = (a: number, b: number, n: number) => { for (let i = 0; i < n; i++) ys.push(a + ((b - a) * i) / n) }
  run(S_ABUT, PIERS_S[3], 7)
  run(PIERS_S[3], PIERS_S[2], 9)
  run(PIERS_S[2], PIERS_S[1], 10)
  run(PIERS_S[1], PIERS_S[0], 11)
  run(PIERS_S[0], -MP, 16)
  run(-MP, MP, 20)
  run(MP, N_ANCH, 15)
  ys.push(N_ANCH)
  return ys
}
const YS = stations()
const isPier = (y: number) => [...PIERS_S, -MP, MP].some((p) => Math.abs(p - y) < 0.5)

type Kit = { steel: Part; clip: Part; pier: Part; lamp: Part; d: boolean }

// ---- The truss -------------------------------------------------------------------------

function truss(k: Kit) {
  const d = k.d
  for (const x of [-TX, TX]) {
    // The low model's chords skip every other panel point where they run straight.
    const cy = d ? YS : YS.filter((y, i) => i % 2 === 0 || isPier(y) || i === YS.length - 1 || (y > PIERS_S[0] - 1 && y < N_ANCH - 60))
    chord(k.steel, cy.map((y) => [x, y, tc(y)] as V3), 1.3, 1.4)
    chord(k.steel, cy.map((y) => [x, y, bc(y)] as V3), 1.3, 1.5)
    for (let i = 0; i < YS.length; i++) {
      const y = YS[i], main = Math.abs(y) < MP - 0.1, pier = isPier(y) || i === 0 || i === YS.length - 1
      if (!d && !main && !pier && i % 2 === 1) continue
      if (tc(y) - bc(y) < 2) continue
      member(k.steel, [x, y, bc(y) + 0.75], [x, y, tc(y) - 0.7], pier ? 1.6 : 0.8, pier ? 1.6 : 0.8, [1, 0, 0], false, !d && !pier)
    }
    // Warren diagonals, alternating; over the main span they lean from
    // the top towards mid-span.
    for (let i = 0; i < YS.length - 1; i++) {
      const ya = YS[i], yb = YS[i + 1]
      let up = i % 2 === 0
      if (Math.abs(ya) < MP + 0.1 && Math.abs(yb) < MP + 0.1) up = Math.abs(ya) > Math.abs(yb)
      const [lo, hi] = up ? [ya, yb] : [yb, ya]
      member(k.steel, [x, lo, bc(lo) + 0.7], [x, hi, tc(hi) - 0.7], 0.75, 0.75, [1, 0, 0], false, !d)
    }
    // Bearings on the main piers.
    for (const s of [-1, 1]) {
      const y = s * MP
      hexa(k.steel, [[x - 1.5, y - 1.5, BEAR_MP - 0.4], [x + 1.5, y - 1.5, BEAR_MP - 0.4], [x + 1.5, y + 1.5, BEAR_MP - 0.4], [x - 1.5, y + 1.5, BEAR_MP - 0.4]],
        [[x - 0.8, y - 0.8, BEAR_MP + 0.6], [x + 0.8, y - 0.8, BEAR_MP + 0.6], [x + 0.8, y + 0.8, BEAR_MP + 0.6], [x - 0.8, y + 0.8, BEAR_MP + 0.6]])
    }
  }
  // Across: struts along the arch's top chords; cross frames under the deck.
  const IN = TX - 0.6
  for (let i = 0; i < YS.length; i++) {
    const y = YS[i]
    if (Math.abs(y) < MP && tc(y) - road(y) > 5) {
      member(k.steel, [-IN, y, tc(y)], [IN, y, tc(y)], 0.7, 0.9, [0, 1, 0])
      if (d) {
        member(k.steel, [-IN, y, tc(y) - 0.4], [IN, YS[i + 1], tc(YS[i + 1]) - 0.4], 0.4, 0.4, [0, 0, 1])
        member(k.steel, [IN, y, tc(y) - 0.4], [-IN, YS[i + 1], tc(YS[i + 1]) - 0.4], 0.4, 0.4, [0, 0, 1])
        if (tc(y) - road(y) > 10) {
          member(k.steel, [-IN, y, tc(y) - 0.8], [IN, y, road(y) + 6.5], 0.4, 0.4, [0, 1, 0])
          member(k.steel, [IN, y, tc(y) - 0.8], [-IN, y, road(y) + 6.5], 0.4, 0.4, [0, 1, 0])
        }
      }
    }
    if (d && bc(y) < road(y) - 4) {
      member(k.steel, [-IN, y, bc(y)], [IN, y, bc(y)], 0.6, 0.7, [0, 1, 0])
      member(k.steel, [-IN, y, bc(y) + 0.5], [IN, y, road(y) - 1.6], 0.4, 0.4, [0, 1, 0])
      member(k.steel, [IN, y, bc(y) + 0.5], [-IN, y, road(y) - 1.6], 0.4, 0.4, [0, 1, 0])
    }
  }
  // The original deck's underside between the trusses.
  const ds = d ? YS : YS.filter((_, i) => i % 2 === 0 || i === YS.length - 1)
  for (let i = 0; i < ds.length - 1; i++) {
    const ya = ds[i], yb = ds[i + 1]
    quadOut(k.steel, [[-TX, ya, road(ya) - 1.3], [-TX, yb, road(yb) - 1.3], [TX, yb, road(yb) - 1.3], [TX, ya, road(ya) - 1.3]], [0, ya, road(ya) + 5])
  }
}

// ---- Clip-ons ---------------------------------------------------------------------------

/** Depth of a clip-on girder: 3 m, haunched to 7.5 m over the main piers. */
function clipDepth(y: number): number {
  const a = Math.abs(y)
  if (a <= MP) return 3.0 + 4.5 * (a / MP) ** 2
  return 3.0 + 4.5 * Math.max(0, 1 - (a - MP) / 75) ** 2
}

/** The two box girders along a run of stations: outer web (sloped), soffit and inner web; never the roadway. */
function clipons(k: Kit, ys: number[], at: (y: number) => { c: [number, number]; e: [number, number]; z: number; dep: number }) {
  for (let i = 0; i < ys.length - 1; i++) {
    const A = at(ys[i]), B = at(ys[i + 1])
    for (const s of [-1, 1]) {
      const P = (S: typeof A, x: number, z: number): V3 => [S.c[0] + S.e[0] * s * x, S.c[1] + S.e[1] * s * x, z]
      const topA = A.z - 0.35, topB = B.z - 0.35, botA = topA - A.dep, botB = topB - B.dep
      const inside: V3 = [A.c[0] + A.e[0] * s * 12, A.c[1] + A.e[1] * s * 12, (topA + botA) / 2]
      // Outer web, its lower edge 1.5 m in from the top edge.
      quadOut(k.clip, [P(A, CX1, topA + 0.9), P(B, CX1, topB + 0.9), P(B, CX1 - 1.5, botB), P(A, CX1 - 1.5, botA)], inside)
      quadOut(k.clip, [P(A, CX0 + 0.6, botA), P(B, CX0 + 0.6, botB), P(B, CX1 - 1.5, botB), P(A, CX1 - 1.5, botA)], inside)
      quadOut(k.clip, [P(A, CX0, topA), P(B, CX0, topB), P(B, CX0 + 0.6, botB), P(A, CX0 + 0.6, botA)], inside)
      // The parapet's top along the outer edge.
      quadOut(k.clip, [P(A, CX1, topA + 0.9), P(B, CX1, topB + 0.9), P(B, CX1 - 0.4, topB + 0.9), P(A, CX1 - 0.4, topA + 0.9)], [inside[0], inside[1], topA - 3])
      if (k.d) quadOut(k.clip, [P(A, CX1 - 0.4, topA + 0.9), P(B, CX1 - 0.4, topB + 0.9), P(B, CX1 - 0.4, topB + 0.35), P(A, CX1 - 0.4, topA + 0.35)], [P(A, CX1 + 5, 0)[0], P(A, CX1 + 5, 0)[1], topA])
    }
  }
}

const straight = (y: number) => ({ c: [0, y] as [number, number], e: [1, 0] as [number, number], z: road(y), dep: clipDepth(y) })

// ---- Piers -----------------------------------------------------------------------------

/** A pier: a shaft on the ground about 11 m across and 14 m along the bridge (photos; the chart's 13.1 x 6.9 m outline reads turned), flaring to a cap under the girders. */
function pier(k: Kit, y: number, top: number, capHalf: number, main: boolean) {
  const hx = 5.5, hy = 7.0, c = k.d ? 0.5 : 0
  const flare = main ? 6 : 4
  footedLoft(k.pier, ground, [
    { plan: chamferedRect(-hx - 0.8, hx + 0.8, y - hy - 0.8, y + hy + 0.8, c), z: 'ground' },
    { plan: chamferedRect(-hx - 0.8, hx + 0.8, y - hy - 0.8, y + hy + 0.8, c), z: Math.max(ground(0, y), 0) + 1.5 },
    { plan: chamferedRect(-hx, hx, y - hy, y + hy, c), z: Math.max(ground(0, y), 0) + 2.2 },
    { plan: chamferedRect(-hx + 0.6, hx - 0.6, y - hy + 0.3, y + hy - 0.3, c), z: top - flare - 1.2 },
    { plan: chamferedRect(-capHalf, capHalf, y - hy - 0.4, y + hy + 0.4, c), z: top - 1.2 },
    { plan: chamferedRect(-capHalf, capHalf, y - hy - 0.4, y + hy + 0.4, c), z: top },
  ], k.d ? 3 : 60)
}

function piers(k: Kit) {
  for (const s of [-1, 1]) {
    const y = s * MP
    pier(k, y, BEAR_MP - 0.4, 10.5, true)
    // The clip-ons' steel brackets from the pier's cap up to their haunches.
    for (const sx of [-1, 1]) {
      const top = road(y) - 0.35 - clipDepth(y)
      for (const dy of k.d ? [-2.5, 2.5] : [0]) {
        member(k.steel, [sx * 10.2, y + dy, BEAR_MP - 0.4], [sx * 12.5, y + dy, top], 1.2, 1.2, [0, 1, 0], true)
        if (k.d) member(k.steel, [sx * 7.0, y + dy, BEAR_MP - 0.4], [sx * 12.5, y + dy, top], 0.8, 0.8, [0, 1, 0])
      }
    }
  }
  for (const y of PIERS_S) {
    const top = bc(y) - 0.8
    pier(k, y, top, 16.5, false)
    // Steel posts from the cap to the clip-ons above.
    for (const sx of [-1, 1]) member(k.steel, [sx * 12.5, y, top], [sx * 12.5, y, road(y) - 0.35 - clipDepth(y)], 1.0, 1.0, [0, 1, 0])
  }
  // The steel spans' ends: the abutment at St Marys Bay and the Northcote anchorage.
  for (const [y, len] of [[S_ABUT, 8], [N_ANCH, 10]] as const) {
    footedLoft(k.pier, ground, [
      { plan: chamferedRect(-18.2, 18.2, y - len / 2, y + len / 2, 0), z: 'ground' },
      { plan: chamferedRect(-18.2, 18.2, y - len / 2, y + len / 2, 0), z: Math.min(bc(y), road(y) - 3.4) - 0.6 },
    ], k.d ? 3 : 40)
  }
}

// ---- The St Marys Bay end and the Northcote viaduct -----------------------------------------

// Centre line of the viaduct across Northcote Point to Sulphur Beach (from the outline).
const NORTH_PATH: [number, number][] = [[0, N_ANCH], [0, 590], [-2, 640], [-6, 680], [-13, 715], [-24, 750], [-40.8, 786.5]]
/** Roadway on the Northcote viaduct: from the anchorage down to the ground at Sulphur Beach. */
const northRoad = (s: number) => road(N_ANCH) + ((4.5 - road(N_ANCH)) * s) / 505

function along(path: [number, number][], step: number) {
  const out: { c: [number, number]; e: [number, number]; s: number }[] = []
  let s = 0
  for (let k = 0; k < path.length - 1; k++) {
    const [a, b] = [path[k], path[k + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: [number, number] = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], e: [number, number] = [u[1], -u[0]]
    const n = Math.max(1, Math.ceil(L / step))
    for (let i = k === 0 ? 0 : 1; i <= n; i++) out.push({ c: [a[0] + u[0] * L * (i / n), a[1] + u[1] * L * (i / n)], e, s: s + (L * i) / n })
    s += L
  }
  return out
}

function viaducts(k: Kit) {
  // Northcote: one deep girder band the full width, on paired columns.
  const sts = along(NORTH_PATH, k.d ? 12 : 35)
  const at = (st: (typeof sts)[0]) => ({ c: st.c, e: st.e, z: northRoad(st.s), dep: 2.6 })
  for (let i = 0; i < sts.length - 1; i++) {
    const A = at(sts[i]), B = at(sts[i + 1])
    const P = (S: typeof A, x: number, z: number): V3 => [S.c[0] + S.e[0] * x, S.c[1] + S.e[1] * x, z]
    const inside: V3 = [A.c[0], A.c[1], A.z - 1.5]
    for (const s of [-1, 1]) quadOut(k.clip, [P(A, s * CX1, A.z + 0.55), P(B, s * CX1, B.z + 0.55), P(B, s * (CX1 - 1.2), B.z - A.dep), P(A, s * (CX1 - 1.2), A.z - A.dep)], inside)
    quadOut(k.clip, [P(A, -(CX1 - 1.2), A.z - A.dep), P(B, -(CX1 - 1.2), B.z - B.dep), P(B, CX1 - 1.2, B.z - B.dep), P(A, CX1 - 1.2, A.z - A.dep)], [inside[0], inside[1], A.z + 5])
  }
  const pierStep = 35
  for (let s = 20; s < 470; s += pierStep) {
    let st = sts[0]
    for (const q of sts) if (Math.abs(q.s - s) < Math.abs(st.s - s)) st = q
    const z = northRoad(st.s) - 2.6
    for (const x of [-9, 0, 9]) {
      const c: [number, number] = [st.c[0] + st.e[0] * x, st.c[1] + st.e[1] * x]
      if (ground(c[0], c[1]) > z - 1) continue
      footedLoft(k.pier, ground, [
        { plan: chamferedRect(c[0] - 1.1, c[0] + 1.1, c[1] - 1.1, c[1] + 1.1, k.d ? 0.3 : 0), z: 'ground' },
        { plan: chamferedRect(c[0] - 1.1, c[0] + 1.1, c[1] - 1.1, c[1] + 1.1, k.d ? 0.3 : 0), z },
      ], k.d ? 3 : 40, false)
    }
  }
  // St Marys Bay: the last 75 m, girders on one pier pair to the end of the outline.
  const south = [S_END, (S_END + S_ABUT) / 2, S_ABUT]
  clipons(k, south, straight)
  for (let i = 0; i < south.length - 1; i++) {
    const ya = south[i], yb = south[i + 1]
    quadOut(k.clip, [[-CX0, ya, road(ya) - 3.4], [-CX0, yb, road(yb) - 3.4], [CX0, yb, road(yb) - 3.4], [CX0, ya, road(ya) - 3.4]], [0, ya, road(ya)])
  }
  for (const x of [-11, 0, 11]) footedLoft(k.pier, ground, [
    { plan: chamferedRect(x - 1.3, x + 1.3, south[1] - 1.3, south[1] + 1.3, 0), z: 'ground' },
    { plan: chamferedRect(x - 1.3, x + 1.3, south[1] - 1.3, south[1] + 1.3, 0), z: road(south[1]) - 3.6 },
  ], k.d ? 3 : 40, false)
}

// ---- Lights ----------------------------------------------------------------------------

function lights(k: Kit) {
  const d = k.d
  // LEDs along the arch's top chords.
  for (const x of [-TX, TX]) {
    const n = d ? 60 : 16
    for (let i = 0; i < n; i++) {
      const y = -MP + (2 * MP * (i + 0.5)) / n
      if (tc(y) - road(y) < 1.5) continue
      bead(k.lamp, [x + Math.sign(x) * 0.8, y, tc(y) + 0.6], d ? 0.4 : 0.7, !d)
    }
  }
  // Lamp standards along both outer edges, about every 32 m.
  const step = d ? 32 : 64
  for (let y = S_END + 10; y < N_ANCH; y += step) for (const s of [-1, 1]) {
    const x = s * (CX1 - 0.3), z = road(y) + 0.55
    if (d) member(k.clip, [x, y, z], [x, y, z + 9.5], 0.22, 0.22)
    bead(k.lamp, [x - s * 0.8, y, z + 9.6], d ? 0.35 : 0.6, !d)
  }
}

// ---- Build ------------------------------------------------------------------------------

function build(d: boolean): Kit {
  const k: Kit = { steel: new Part(), clip: new Part(), pier: new Part(), lamp: new Part(), d }
  truss(k)
  const ys: number[] = []
  const cs = d ? YS : YS.filter((_, i) => i % 2 === 0 || i === YS.length - 1)
  for (const y of cs) ys.push(y)
  clipons(k, ys, straight)
  piers(k)
  viaducts(k)
  lights(k)
  return k
}

const steelLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : 0.35) * (p[2] > 46 ? 1.3 : 1)
const pierLit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 0.85)
const STEEL: MaterialSpec = { ...finish('bridge-grey', 0xa3a9ad), floodlight: steelLit }
const CLIP: MaterialSpec = { ...finish('clip-on-grey', 0xb3b6b5), floodlight: (_p, n) => (n[2] < -0.5 ? 0.25 : 0.1) }
const PIER_M: MaterialSpec = { ...finish('pier-concrete', 0xb0a698), floodlight: pierLit }
const LAMP = { name: 'lamp', color: 0x7a7f84 }

if (import.meta.main) {
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the water at mid-span',
    bearing: BEARING, elevation: 0, trussPlanes: [-TX, TX], roadwayMidspan: road(0), roadwayAtMainPiers: ROAD_MP,
    roadwayStMarysBay: road(S_END), roadwayNorthcoteAnchorage: road(N_ANCH),
  }
  for (const [file, d, maxTris, maxBytes] of [
    [`${ID}.glb`, false, 6500, 250 * 1024],
    [`${ID}.detail.glb`, true, 40000, 1536 * 1024],
  ] as const) {
    const k = build(d)
    const parts = [
      { part: k.steel, material: STEEL },
      { part: k.clip, material: CLIP },
      { part: k.pier, material: PIER_M },
      { part: k.lamp, material: LAMP },
    ]
    const tris = parts.reduce((t, { part }) => t + part.triangles, 0)
    const glb = writeGlb('Auckland Harbour Bridge', parts, extras)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes; ` + parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
    if (!process.env.LOOSE && tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    if (!process.env.LOOSE && glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  }
}
