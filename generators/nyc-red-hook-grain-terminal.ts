/**
 * Red Hook Grain Terminal (New York State Barge Canal Grain Elevator),
 * Gowanus Bay, Red Hook: procedural, CC0-1.0.
 * bun generators/nyc-red-hook-grain-terminal.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 22.3° (the
 * long axis of the silo block in OSM and the lidar). The origin is the
 * centroid of OSM way/248168048 ("Red Hook Grain Terminal", height=58.7),
 * on the ground.
 *
 * The building. A reinforced-concrete grain elevator built 1922 by the
 * State for the Barge Canal terminal and disused since the mid-1960s: a
 * 130 m row of 54 cylindrical bins, their curved outer faces showing as
 * deep vertical flutes on every side, under a flat top with a band of
 * small openings; a tall headhouse over the south end, its upper storeys
 * clad in rusted steel; a smaller stair tower at the north end; lower
 * conveyor towers and galleries on the east and west. Weathered grey
 * concrete streaked dark (Wikipedia, "Red Hook Grain Terminal"; HAER
 * NY-69, "New York State Barge Canal, Gowanus Bay Terminal").
 *
 * Numbers (lidar: USGS NY_NewYorkCity, 2017; ground ~2 m above the box's
 * lowest return, all heights above that ground):
 *   silo block 23 x 130 m, top 37 m: measured, lidar and OSM.
 *   headhouse 14 x 46 m over the south half of the block, to 58 m:
 *     measured (OSM height=58.7 agrees). Dark weathered concrete to 41 m,
 *     rust-red cladding above with a few big grouped voids per bay:
 *     estimated from "Red Hook Grain Terminal (42816p)".
 *   north tower 12 x 12 m to 51 m; east towers to 33–40 m; the west
 *     gallery 3 m wide to 15 m; south annex to 20 m and the south-west
 *     tower to 32 m: measured, lidar.
 *   flutes: 6 m bins (a half-cylinder per bin on each face), 21 along each
 *     long side and 4 across each end: estimated from the photos and HAER
 *     NY-69-1 (bin count published as 54; the faces show ~20 a side).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Red Hook Grain Terminal (42816p)", Rhododendrites, CC BY-SA 4.0 (from
 *     the water, the headhouse and the south end)
 *   "Red Hook Grain Terminal (May 2025) (1)", "(3)", "(5)", MikeBurnsPhotos,
 *     CC0 (the long side and the towers from the park)
 *   "Red Hook Grain Terminal, Brooklyn, New York, US", Clyde Charles Brown,
 *     CC BY-SA 4.0 (the north-east corner and the flutes)
 *   "PA Grains Red Hook jeh", Jim.henderson, public domain (the long side)
 *   "Red Hook Park td (2024-09-14) 053b", Tdorante10, CC BY-SA 4.0
 *   HAER NY-69-1, "General view of grain elevator from northeast",
 *     Library of Congress, public domain
 * Look-only: none.
 *
 * Night: derelict, unlit. The openings are a dark unlit finish, not
 * `window`.
 *
 * Colours (lead review): bins pale grey-cream; the headhouse base, the
 * towers, the gallery band and the low west gallery dark charcoal concrete
 * (the gallery is dark in "PA Grains Red Hook jeh"); rust only on the
 * headhouse's upper cladding.
 *
 * Doubts: the south end's annexes and conveyor structures are simplified to
 * boxes; the rusted cladding's extent; the openings are a few bold bands.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, quadN, type Facade, type XY } from './nyc-570-lexington'

const W = 11.5, YS = -52, YN = 78, TOP = 37, R = 3.0, CAP = 3.5
const concrete = new Part(), dark = new Part(), rust = new Part(), roof = new Part(), opening = new Part()

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ------------------------------------------------------------ the bins ---
// A core box set in by the bin radius, the bins' outer halves round it as
// half-cylinders, and the flat top band over them.
prism({ wall: concrete, win: null, roof: null, ring: rect(-W + R, YS + R, W - R, YN - R), z0: 0, z1: TOP - CAP, facade: null, bevel: 0 })
function flute(cx: number, cy: number, nx: number, ny: number) {
  const SEG = 8, z0 = 0, z1 = TOP - CAP
  for (let k = 0; k < SEG; k++) {
    // from the left of the outward normal round to its right
    const a0 = Math.PI / 2 - (k / SEG) * Math.PI, a1 = Math.PI / 2 - ((k + 1) / SEG) * Math.PI
    const dir = (a: number): XY => [nx * Math.cos(a) - ny * Math.sin(a), nx * Math.sin(a) + ny * Math.cos(a)]
    const d0 = dir(a0), d1 = dir(a1)
    const p = (d: XY, z: number): V3 => [cx + d[0] * R, cy + d[1] * R, z]
    quadN(concrete, p(d0, z0), p(d1, z0), p(d1, z1), p(d0, z1), [[d0[0], d0[1], 0], [d1[0], d1[1], 0], [d1[0], d1[1], 0], [d0[0], d0[1], 0]])
  }
}
{
  const nLong = 21, pitchL = (YN - YS - 2 * R) / nLong
  for (let k = 0; k < nLong; k++) {
    const y = YS + R + pitchL * (k + 0.5)
    flute(W - R, y, 1, 0); flute(-W + R, y, -1, 0)
  }
  const nEnd = 4, pitchE = (2 * W - 2 * R) / nEnd
  for (let k = 0; k < nEnd; k++) {
    const x = -W + R + pitchE * (k + 0.5)
    flute(x, YN - R, 0, 1); flute(x, YS + R, 0, -1)
  }
}
// The top band (the bin-top gallery), a little proud of the bins, dark
// weathered concrete with a row of openings, as in all the photos.
const bandFacade: Facade = { bay: 6.2, ratio: 0.55, floor: 1.6, group: 1, spandrel: 0, sill: 0.6, head: 0.5, minLength: 6 }
prism({ wall: dark, win: opening, roof, ring: rect(-W - 0.3, YS - 0.3, W + 0.3, YN + 0.3), z0: TOP - CAP, z1: TOP, facade: bandFacade, bevel: 0.3 })

// --------------------------------------------------------- the headhouse ---
// Concrete to 41 m, rusted steel cladding above with bands of openings.
const HX0 = -4, HX1 = 10, HY0 = -52, HY1 = -6, HTOP = 58
prism({ wall: dark, win: null, roof: null, ring: rect(HX0, HY0, HX1, HY1), z0: TOP - 0.5, z1: 41, facade: null, bevel: 0.3 })
// A few big ragged voids per bay, grouped two storeys, not a window grid.
const cladFacade: Facade = { bay: 7, ratio: 0.62, floor: 3.4, group: 2, spandrel: 1.6, sill: 1.0, head: 1.4, minLength: 5, margin: 1.2 }
prism({ wall: dark, win: opening, roof, ring: rect(HX0 - 0.2, HY0 - 0.2, HX1 + 0.2, HY1 + 0.2), z0: 41, z1: HTOP, facade: cladFacade, bevel: 0.25 })
// Rust-red patches on the cladding, 0.03 m proud (the voids, 0.05 m, stay on
// top), where "Red Hook Grain Terminal (42816p)" shows them: the upper
// storeys of the west and south faces and a few strips on the east.
{
  const d = 0.23
  const W_ = (y0: number, y1: number, z0: number, z1: number) => rust.quad([HX0 - d, y1, z0], [HX0 - d, y0, z0], [HX0 - d, y0, z1], [HX0 - d, y1, z1])
  const E_ = (y0: number, y1: number, z0: number, z1: number) => rust.quad([HX1 + d, y0, z0], [HX1 + d, y1, z0], [HX1 + d, y1, z1], [HX1 + d, y0, z1])
  const S_ = (x0: number, x1: number, z0: number, z1: number) => rust.quad([x0, HY0 - d, z0], [x1, HY0 - d, z0], [x1, HY0 - d, z1], [x0, HY0 - d, z1])
  W_(-50, -36, 48, 57.5); W_(-30, -22, 44, 57.5); W_(-16, -8, 50, 57.5)
  S_(-3.5, 4, 46, 57.5)
  E_(-46, -40, 47, 57.5); E_(-26, -20, 50, 57.5)
}

// -------------------------------------------------------- the other towers ---
// The towers: a few large openings, not a grid.
const towerFacade: Facade = { bay: 6, ratio: 0.5, floor: 4.5, group: 2, spandrel: 4, sill: 3, head: 2.5, minLength: 5, margin: 1.5 }
// North stair tower, dark weathered concrete.
prism({ wall: dark, win: opening, roof, ring: rect(-6, 66, 6, 78), z0: TOP - 0.5, z1: 51, facade: towerFacade, bevel: 0.3 })
// East leg towers.
for (const [y0, y1, h] of [[66, 78, 40], [10, 20, 35], [-50, -38, 40]] as [number, number, number][])
  prism({ wall: dark, win: opening, roof, ring: rect(W - 0.5, y0, 18.5, y1), z0: 0, z1: h, facade: towerFacade, bevel: 0.3 })
// West conveyor gallery along the south half, the south annex and the south-west tower.
prism({ wall: dark, win: null, roof, ring: rect(-14.5, -70, -W + 0.5, 2), z0: 0, z1: 15, facade: null, bevel: 0.3 })
prism({ wall: dark, win: opening, roof, ring: rect(-6, -62, 10, YS + 0.5), z0: 0, z1: 20, facade: towerFacade, bevel: 0.3 })
prism({ wall: dark, win: opening, roof, ring: rect(-18, -79, -10, -69), z0: 0, z1: 32, facade: towerFacade, bevel: 0.3 })

const parts: { part: Part; material: MaterialSpec }[] = [
  { part: concrete, material: finish('grain-concrete', 0xc4beb1) },
  { part: dark, material: finish('grain-concrete-dark', 0x67645f) },
  { part: rust, material: finish('grain-rust', 0x6f5446) },
  { part: roof, material: PALETTE.roof },
  { part: opening, material: finish('grain-opening', 0x4a4f57) },
]
finishModel('Red Hook Grain Terminal', 'nyc-red-hook-grain-terminal', parts, {
  bearing: 22.3, elevation: 0, height: HTOP, osm: 'way/248168048',
})
