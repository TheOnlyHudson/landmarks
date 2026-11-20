/**
 * Minneapolis Central Library (2006, Pelli Clarke Pelli with Architectural
 * Alliance), Minneapolis — original procedural geometry, CC0-1.0.
 * bun generators/msp-minneapolis-central-library.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the downtown street
 * grid (placement bearing 30.5°: the model's +x runs along 3rd/4th Street
 * toward Nicollet Mall, +y along Nicollet toward 3rd Street). Origin at the
 * anchor, the area centroid of the OSM outline way/546472304 (-93.2700496,
 * 44.9805562), on the lowest ground under it (~256.5 m NAVD88).
 *
 * Form: two low glass blocks banded with tan stone at every floor, a
 * four-storey block to the north and a five-storey block to the south, with
 * a tall glass atrium between them that widens toward Nicollet Mall. Over the
 * atrium the "wing", a thin silver blade of roof, runs the length of the
 * block and cantilevers out past both ends, over Nicollet Mall (where it
 * widens into a wedge) and toward Hennepin Avenue. A one-storey strip with a
 * green roof fills the block's south-west corner.
 *
 * Sources
 * - OSM: outline way/546472304; parts way/1539780797 (south block, 5
 *   levels, grass roof), way/1539780799 (the atrium wedge under the wing, 7
 *   levels), way/1539780796 (south-west strip, 1 level, grass roof); the
 *   wing's overhangs way/1350766339 (over Nicollet Mall) and way/1539780798
 *   (west end), both building=roof, min_level 6.
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022, class
 *   18 kept; heights above 256.5 m): north block 21 m with a raised centre
 *   28 m (x -18..26, y 6..30); south block 26 m; south-west strip 8 m; the
 *   wing 33 m along its north edge falling to ~29.5 m at its south-east tip,
 *   from x -62 to 54; a low entrance block on the west side ~13 m.
 * - Published: opened 2006, Cesar Pelli (Wikipedia, "Minneapolis Central
 *   Library").
 * - Photos (Wikimedia Commons, all evidence):
 *   Zachary Korb, "Public library minneapolis exterior.jpg", CC BY 2.0 (from
 *     Nicollet Mall): the wing over the mall, both blocks, the bands.
 *     https://commons.wikimedia.org/wiki/File:Public_library_minneapolis_exterior.jpg
 *   Tony Webster, "Minneapolis Central Hennepin Library 15784191996.jpg",
 *     CC BY-SA 4.0: atrium and wing from the north-east.
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_Central_Hennepin_Library_15784191996.jpg
 *   Richie Diesterheft, "Minneapolis Central Public Library by Cesar
 *     Pelli.jpg", CC BY 2.0: the atrium's glass and the wing's tip.
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_Central_Public_Library_by_Cesar_Pelli.jpg
 *   Paytonc, "Minneapolis Central library.jpg", CC BY-SA 2.0 (from the
 *     north-east). https://commons.wikimedia.org/wiki/File:Minneapolis_Central_library.jpg
 *   Jon Platek, "Central Library - panoramio.jpg", CC BY-SA 3.0 (the long
 *     4th Street side). https://commons.wikimedia.org/wiki/File:Central_Library_-_panoramio.jpg
 *   Tony Webster, "Hennepin County Library - Downtown Minneapolis
 *     (23237528250).jpg", CC BY-SA 2.0: the wing's thickness from below.
 *     https://commons.wikimedia.org/wiki/File:Hennepin_County_Library_-_Downtown_Minneapolis_(23237528250).jpg
 *   mtellin, "Minneapolis Central Library night.jpg", CC BY 2.0: the lit
 *     atrium and the floodlit underside of the wing.
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_Central_Library_night.jpg
 *
 * Estimated: floor bands every 5.2 m, 1.3 m deep (from the photos); the
 * wing's thickness (3.6 m over the building, thinning to 0.6 m at the tips); the atrium's
 * glazing reaches the wing's underside.
 *
 * Night: block glass and the atrium glow; the wing's underside is floodlit.
 *
 * Doubts: the wing is drawn as one plane, flat along its length and tilted
 * across it; the real blade also rises toward its Nicollet tip a little.
 * The raised centre of the north block is drawn as a plain banded box.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, triangulate, wallEdge, capRing, finishGlb } from './sea-rainier-square-tower'
import { band } from './msp-minneapolis-city-hall'

// ---------------------------------------------------------------- plan (OSM, model frame)
const NORTH: XY[] = ccw([[-45.1, 0.9], [33.6, -4.7], [34.4, 0.8], [43.5, 0.3], [43.7, 4.2], [44.1, 44.9], [-39.4, 45.5], [-40.7, 3.5]])
const UPPER: XY[] = ccw([[-18, 6], [26, 6], [26, 30], [-18, 30]])
const SOUTH: XY[] = ccw([[-50.3, -31.6], [-47.5, -15.5], [-45.3, -3.1], [31.8, -18.0], [33.7, -18.4], [29.1, -39.4], [27.7, -45.9], [23.3, -45.9]])
const STRIP: XY[] = ccw([[-50.3, -31.6], [23.3, -45.9], [-9.2, -45.6], [-50.4, -45.2]])
const WEST: XY[] = ccw([[-51.3, -5.2], [-45.3, -3.1], [-47.5, -15.5], [-52.9, -14.4]])
const ATRIUM: XY[] = ccw([[-45.3, -3.1], [-45.1, 0.9], [33.6, -4.7], [33.1, -8.8], [31.8, -18.0]])
const WING: XY[] = ccw([[-63.3, -3.2], [-51.3, -5.2], [-45.3, -3.1], [31.8, -18.0], [33.3, -20.3], [48.2, -23.0], [52.7, 2.5], [-62.2, 3.3]])
const Z = { north: 21, upper: 28, south: 26, strip: 8, west: 13 }
const wingTop = (p: XY) => 33 + (p[1] - 3) * 0.135
const wingT = (p: XY) => (p[0] < -50 || p[0] > 40 ? 0.6 : 3.6)

function build() {
  const stone = new Part(), glassW = new Part(), atrium = new Part(), wing = new Part(), roof = new Part(), green = new Part()

  // ---------------------------------------------------------------- banded glass blocks
  const block = (ring: XY[], z1: number, top: Part, z0 = 0) => {
    for (let i = 0; i < ring.length; i++) wallEdge(glassW, ring, i, z0, z1, 20)
    capRing(top, ring, z1)
    for (let z = z0 + 5.2; z < z1 - 1.5; z += 5.2) band(stone, ring, 0.2, z - 0.7, z + 0.6, 20)
    band(stone, ring, 0.2, z1 - 1.2, z1 + 0.25, 20)
  }
  block(NORTH, Z.north, roof)
  block(UPPER, Z.upper, roof, Z.north)
  block(SOUTH, Z.south, green)
  block(STRIP, Z.strip, green)
  block(WEST, Z.west, roof)

  // ---------------------------------------------------------------- atrium: glass up to the wing
  for (let i = 0; i < ATRIUM.length; i++) {
    const a = ATRIUM[i], b = ATRIUM[(i + 1) % ATRIUM.length]
    const za = wingTop(a) - wingT(a), zb = wingTop(b) - wingT(b)
    atrium.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zb], [a[0], a[1], za])
  }

  // ---------------------------------------------------------------- the wing
  {
    const r = WING, tris = triangulate(r)
    const T = (p: XY): V3 => [p[0], p[1], wingTop(p)], B = (p: XY): V3 => [p[0], p[1], wingTop(p) - wingT(p)]
    for (const [a, b, c] of tris) {
      wing.tri(T(r[a]), T(r[b]), T(r[c]))
      wing.tri(B(r[a]), B(r[c]), B(r[b]))
    }
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      wing.quad(B(a), B(b), T(b), T(a))
    }
  }

  // the wing's underside is floodlit at night
  const wingMat = { ...finish('library-wing', 0xc3c8cc), floodlight: (_p: V3, n: V3) => (n[2] < -0.5 ? 0.85 : 0) }
  return finishGlb('msp-minneapolis-central-library', 'Minneapolis Central Library', [
    { part: stone, material: finish('library-limestone', 0xdcc69c) },
    { part: glassW, material: windowVariant(2, 0xb3c3cd) },
    { part: atrium, material: { ...PALETTE.window, color: 0x6f8794 } },
    { part: wing, material: wingMat },
    { part: roof, material: PALETTE.roof },
    { part: green, material: finish('library-green-roof', 0xa9b597) },
  ], {
    bearing: 30.5, height: 33.5,
    replaces: ['way/546472304', 'way/1539780797', 'way/1539780799', 'way/1539780796', 'way/1350766339', 'way/1539780798'],
  })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-minneapolis-central-library.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
