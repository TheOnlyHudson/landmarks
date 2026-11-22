/**
 * The timing and scoring pylon (2014) of the Indianapolis Motor Speedway,
 * Speedway, Indiana: procedural, CC0-1.0.
 * bun generators/indy-ims-scoring-pylon.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * centre of the pylon's lidar returns, about 1 m south-east of the OSM node
 * node/5623124056 (man_made=tower, "IMS Timing & Scoring Pylon (4-sided LED
 * Video Display) with Windsock at top"), on the infield strip between the
 * main straight (west) and pit lane (east), opposite Gasoline Alley.
 *
 * The form:
 *   - a four-sided LED box, 3.0 m north-south by 2.2 m east-west (lidar
 *     returns 2.5-3 m by 1.5-2 m; the photo's 1:10 width to height), from
 *     2.4 m to 29.3 m, on two short pale legs;
 *   - its faces, broad lit panels: the wing-and-wheel logo band at the top,
 *     and below it the 33 positions as eleven groups of three rows (the
 *     ladder the photos show from a distance), on the west and east faces
 *     and narrower on the north and south;
 *   - a thin cap frame to 30.1 m (lidar maximum, 30.1 m above the grass),
 *     and the windsock on its mast to 33 m.
 *
 * Sources
 * - OSM (ODbL): node/5623124056, no building.
 * - USGS lidar USGS_LPC_IN_Central_MarionCo_2016_LAS_2018 (flown 2016,
 *   after the 2014 pylon went up), 0.5 m grid: the top at 30.1 m and the
 *   footprint.
 * - Photos (Wikimedia Commons):
 *   "Indianapolis Motor Speedway pylon - 2015 Indianapolis Speedway -
 *   Stierch.jpg" (Sarah Stierch, CC BY 4.0,
 *   https://commons.wikimedia.org/wiki/File:Indianapolis_Motor_Speedway_pylon_-_2015_Indianapolis_Speedway_-_Stierch.jpg),
 *   the top: LED on every face, the logo band, the windsock;
 *   "Indianapolis pylon (51221638058).jpg" (Zach Catanzareti Photo, CC BY
 *   2.0, https://commons.wikimedia.org/wiki/File:Indianapolis_pylon_(51221638058).jpg),
 *   the track face: logo, "THE GRID", position and car-number rows;
 *   "Indianapolis Motor Speedway (16005026897).jpg" (redlegsfan21, CC BY-SA
 *   2.0, https://commons.wikimedia.org/wiki/File:Indianapolis_Motor_Speedway_(16005026897).jpg),
 *   the whole pylon from the outside wall: proportions, the two legs, the
 *   cap and mast.
 * Estimated: the legs' height (2.4 m), the panel layout, the mast height
 *   (about 3 m over the cap, from the photo), the windsock's size.
 * Night: the panels are `neon` (a video display, lit in its own light).
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './indy-world-war-memorial'
import { lathe } from './sea-tacoma-union-station'

const legs = new Part(), body = new Part(), led = new Part(), logo = new Part(), sock = new Part()

const HX = 1.1, HY = 1.5 // half-sizes east-west and north-south
const Z0 = 2.4, Z1 = 29.3, CAP = 30.1

// legs and the box
box(legs, legs, -HX + 0.2, -HY + 0.1, HX - 0.2, -HY + 0.9, 0, Z0)
box(legs, legs, -HX + 0.2, HY - 0.9, HX - 0.2, HY - 0.1, 0, Z0)
box(body, body, -HX, -HY, HX, HY, Z0, Z1, 0.12)
// the cap frame, a little proud of the box
box(body, body, -HX - 0.15, -HY - 0.15, HX + 0.15, HY + 0.15, Z1, CAP, 0.1)

// panels on a face: `n` the face's outward axis, `half` its half-width
type FaceSpec = { axis: 'x' | 'y'; sign: 1 | -1; half: number; depth: number }
const faces: FaceSpec[] = [
  { axis: 'x', sign: -1, half: HY, depth: HX }, // west, to the track
  { axis: 'x', sign: 1, half: HY, depth: HX }, // east, to pit lane
  { axis: 'y', sign: 1, half: HX, depth: HY },
  { axis: 'y', sign: -1, half: HX, depth: HY },
]
function panel(part: (typeof led), f: FaceSpec, s0: number, s1: number, z0: number, z1: number) {
  const d = f.depth + 0.05
  // points on the face; s runs to the right as seen from outside
  const P = (s: number, z: number): [number, number, number] =>
    f.axis === 'x' ? [f.sign * d, f.sign * s, z] : [-f.sign * s, f.sign * d, z]
  part.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
}
for (const f of faces) {
  const m = 0.25, s0 = -f.half + m, s1 = f.half - m
  // logo band
  panel(logo, f, s0, s1, 26.3, 28.9)
  // 33 positions in eleven groups of three rows
  const top = 25.8, bottom = Z0 + 0.5, g = 11, gap = 0.28
  const step = (top - bottom) / g
  for (let k = 0; k < g; k++) {
    const zb = top - (k + 1) * step + gap / 2, zt = top - k * step - gap / 2
    if (f.axis === 'x') {
      // a narrow position column and a wider car-number column
      const split = s0 + (s1 - s0) * 0.36
      panel(led, f, s0, split - 0.12, zb, zt)
      panel(led, f, split + 0.12, s1, zb, zt)
    } else panel(led, f, s0, s1, zb, zt)
  }
}

// the windsock on its mast, from the cap's north-west corner
const mx = -HX + 0.3, my = HY - 0.3
box(body, null, mx - 0.07, my - 0.07, mx + 0.07, my + 0.07, CAP, CAP + 3.0)
// the sock: a cone streaming south-east, drawn as a short lathe laid along the wind
{
  const tmp = new Part()
  lathe(tmp, 0, 0, [[0.001, 0], [0.38, 0], [0.38, 0.05], [0.22, 1.9], [0.001, 1.9]], 8)
  // lathe builds about z; turn it to lie along (+x, -y) at the mast top
  const dir = [Math.SQRT1_2, -Math.SQRT1_2]
  for (let i = 0; i < tmp.pos.length; i += 9) {
    const pts: [number, number, number][] = []
    for (let k = 0; k < 3; k++) {
      // glTF frame back to map frame: (x, y, z)gl = (x, z, -y)map
      const gx = tmp.pos[i + 3 * k], gy = tmp.pos[i + 3 * k + 1], gz = tmp.pos[i + 3 * k + 2]
      const X = gx, Y = -gz, Z = gy // map coords in the lathe frame
      // lathe axis z -> wind direction; lathe x -> across; lathe y -> up
      pts.push([mx + dir[0] * Z + -dir[1] * X, my + dir[1] * Z + dir[0] * X, CAP + 2.6 + Y])
    }
    sock.tri(pts[0], pts[1], pts[2])
  }
}

const built = finishGlb('IMS Timing and Scoring Pylon', [
  { part: legs, material: PALETTE.stone },
  { part: body, material: finish('indy-pylon-black', 0x4a4f57) },
  { part: led, material: finish('neon-pylon-led', 0x7f8994) },
  { part: logo, material: finish('neon-pylon-logo', 0xd9dde0) },
  { part: sock, material: finish('indy-pylon-windsock', 0xe0703c) },
], { bearing: 0, height: CAP + 3.0, replaces: [] }, 5000)
await writeModel('indy-ims-scoring-pylon', built)
