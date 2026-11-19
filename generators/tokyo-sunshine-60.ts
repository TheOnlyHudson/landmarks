/**
 * Sunshine 60 (サンシャイン60), Higashi-Ikebukuro, Tokyo: procedural, CC0-1.0.
 * bun generators/tokyo-sunshine-60.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 * Uses the shared kit in tokyo-metropolitan-government-building.ts.
 *
 * Completed 1978 (Mitsubishi Estate); 60 floors, 239.7 m to the roof of the
 * penthouse (Wikipedia, "Sunshine 60"; OSM). Japan's tallest building until
 * 1991. A plain off-white slab, its long faces covered in columns of windows,
 * its short faces ribbed with deep fins either side of a blank middle band,
 * a long penthouse on the roof and red-and-white aviation-light masts.
 *
 * Frame: built turned to bearing 33.9 (the outline's long walls). Origin at
 * the outline's centroid (139.718157, 35.729406); y = 0 is the ground.
 *
 * OSM (all replaced): way/314155355 the tower (building:part of the
 * Sunshine City outline way/250938764, which is left to the map: it is the
 * whole mall and the model covers only a corner of it), 73 x 43 m;
 * way/314155348 (0-228 m, the body with its fins: 1.5 m notches every
 * 3 m on the short faces except the middle 14.4 m); way/314155351 (8.5-10 m
 * slab, the canopy line); way/314155353 (222.5-224 m, the crown ledge);
 * way/314155349 (229 m, the top band); relation/4220791 (228-230 m, the
 * parapet ring); way/314155354 (229-240 m, the
 * penthouse, 64 x 17 m); the masts: way/314155330, 314155331, 314155332,
 * 314155333, 314155335, 314155337, 314155339, 314155340, 314155345,
 * 314155347 (two banded masts at x = +-22 m to 260 m, 4 m bands red and
 * white), and the lamp masts way/314155334, 314155336, 314155338,
 * 314155341, 314155342, 314155343, 314155344, 314155346 (four, at the
 * penthouse's corners, to 249 m, with red lamp housings at 246.5-247 m).
 *
 * From photos: the long faces carry 24 columns of windows between narrow
 * white piers, one window per floor with thin spandrels (drawn as panels
 * two columns and three floors to a panel in the low model, one column and
 * two floors in the detail); the short faces' notches hold the windows; the
 * top storeys (224-229 m) are a band of small square windows; the
 * penthouse is plain white. Estimated: the masts' radius (0.5 m), lamp
 * housings drawn as 1.6 m drums; the canopy slab's depth (1.2 m).
 *
 * Colours (Kakidai's daylight photo): concrete off-white #e4e1d9, drawn
 * #ebe6dc; window glass a grey teal #6f8a92, drawn as `window` #6b7f8a.
 * Night: office windows lit; aviation lamps red (`lamp`).
 *
 * Photos (Wikimedia Commons):
 * - "Sunshine 60.JPG", Kakidai, CC BY-SA 3.0 (long face and short face, south-west)
 * - "Sunshine 60 2015 July.jpg", Morio, CC BY-SA 4.0 (short face, the blank middle band)
 * - "Sunshine 60 1 Ikebukuro Tokyo 16 November 2003.jpg", Morio, CC BY-SA 3.0
 * - "Sunshine 60 5 Ikebukuro Tokyo 16 November 2003.jpg", Morio, CC BY-SA 3.0
 * - "Sunshine 60, worm's eye view.jpg", Xenmorpha, CC0
 * No lidar (Japan). No look-only sources.
 * Doubts: the mall podium around the foot is the map's (Sunshine City), so
 * the model's lower floors stand inside it; the roof's antennas other than
 * the six mapped masts are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, panels, member, box, rect, lathe, writeModel, type XY, type Layer, setSoftMin } from './tokyo-metropolitan-government-building'

type Lod = { detail: boolean }
const HX = 36.5, HY = 21.5

/** The body's plan: fins on the short (east/west) faces, 1.5 m notches every 3 m outside the middle band. */
function body(): XY[] {
  const east: XY[] = []
  // from the south-east corner northward along x = +HX
  east.push([HX, -HY])
  const edges = [-20.0, -18.5, -17.0, -15.5, -14.0, -12.5, -11.0, -9.5, -8.0, -7.2]
  // south half: alternate out/in starting at the corner fin (-21.5..-20 out, -20..-18.5 in, ...)
  let inNotch = false
  for (const y of edges) {
    const x = inNotch ? HX - 1.5 : HX
    east.push([x, y])
    inNotch = !inNotch
    east.push([inNotch ? HX - 1.5 : HX, y])
  }
  const south = east.slice()
  const north = south.map(([x, y]) => [x, -y] as XY).reverse()
  const E = [...south, ...north]
  const W = E.map(([x, y]) => [-x, -y] as XY)
  return [...E, ...W]
}

function build(L: Lod): Layer[] {
  setSoftMin(L.detail ? 0 : 2)
  const wall = new Part(), win = new Part(), roof = new Part(), red = new Part(), lamp = new Part(), metal = new Part()
  const B = body()
  prism(wall, B, 0, 222.5, { top: false, bevel: 0.45 })
  // windows on the long faces: 24 columns between narrow piers
  const longRow = L.detail ? 7.4 : 11.1, cols = 24
  for (const s of [1, -1]) {
    const y = s * (HY + 0.05)
    const w = (2 * HX - 2.4) / cols
    for (let i = 0; i < cols; i++) {
      const x0 = -HX + 1.2 + w * i + w * 0.24, x1 = x0 + w * 0.52
      for (let z = 12; z + longRow <= 222; z += longRow) {
        const z0 = z + longRow * 0.05, z1 = z + longRow * 0.95
        if (s > 0) win.quad([x1, y, z0], [x0, y, z0], [x0, y, z1], [x1, y, z1])
        else win.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1])
      }
    }
  }
  // windows in the short faces' notches (on the notch backs, 1.5 m wide)
  panels(win, B, 12, 222, { bay: 1.5, row: longRow, fw: 0.75, fh: 0.9, minEdge: 1.4, margin: 0.05, skip: (_i, m) => Math.abs(m[0]) > HX - 1.2 || Math.abs(m[0]) < HX - 2 || Math.abs(m[1]) > HY - 1 })
  // the ground floors: a recessed glazed base under the canopy line
  if (L.detail) panels(win, rect(0, 0, HX, HY), 1, 8, { bay: 6, row: 7, fw: 0.8, fh: 0.9, out: 0.06 })
  prism(wall, rect(0, 0, HX + 1.2, HY + 1.2), 8.5, 10, { bevel: 0.3, bottom: true })
  // crown: the ledge (222.5-224), the top band of small square windows (224-229)
  prism(wall, rect(0, 0, HX + 0.4, HY + 0.4), 222.5, 224, { bevel: 0.3, bottom: true })
  prism(wall, rect(0, 0, HX, HY), 224, 229, { roof, lip: 0.8, bevel: 0.45 })
  panels(win, rect(0, 0, HX, HY), 224.6, 228.4, { bay: L.detail ? 3.05 : 6.1, row: 3.8, fw: L.detail ? 0.45 : 0.3, fh: 0.6, margin: 1.2 })
  // the penthouse
  prism(wall, rect(0, 0, 32, 8.5), 229, 240, { roof, lip: 0.6, bevel: 0.4 })
  if (L.detail) panels(win, rect(0, 0, 32, 8.5), 233, 238, { bay: 4, row: 5, fw: 0.4, fh: 0.5, margin: 2 })

  // the banded masts (two, to 260 m) and the lamp masts (four, to 249 m)
  const k = L.detail ? 10 : 6
  for (const x of [-22, 22]) {
    box(metal, rect(x, 0, 1.6, 1.6), 240, 243)
    for (let z = 243, i = 0; z < 260; z += 4, i++) lathe(i % 2 ? metal : red, [[0.55, z], [0.55, Math.min(260, z + 4)], [0, Math.min(260, z + 4)]], k, [x, 0], 30)
    lathe(lamp, [[1.4, 252], [1.4, 253.2], [0, 253.2]], k, [x, 0], 30)
  }
  for (const [x, y] of [[-31.8, -9], [31.8, -9], [31.8, 9], [-31.8, 9]] as XY[]) {
    lathe(metal, [[0.35, 240], [0.35, 249], [0, 249]], k, [x, y], 30)
    lathe(lamp, [[1.5, 246.2], [1.6, 247.6], [0, 247.6]], k, [x, y], 30)
    if (L.detail) for (const z of [242, 244]) member(metal, [x - 1.2, y, z], [x + 1.2, y, z], 0.12, 4)
  }

  return [
    { part: wall, material: finish('sunshine-concrete', 0xebe6dc) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: finish('mast-white', 0xe8e8e6) },
    { part: red, material: finish('mast-red', 0xc94a3c) },
    { part: lamp, material: finish('lamp-aviation', 0xc23a30) },
  ]
}

const meta = { bearing: 33.9, elevation: 0, height: 260 }
await writeModel('tokyo-sunshine-60', 'tokyo-sunshine-60.glb', 'Sunshine 60', build({ detail: false }), meta, 5000, 256_000)
await writeModel('tokyo-sunshine-60', 'tokyo-sunshine-60.detail.glb', 'Sunshine 60', build({ detail: true }), meta, 40_000, 1536 * 1024)
