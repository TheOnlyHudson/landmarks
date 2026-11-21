/**
 * This Is the Place Monument (Mahonri Young, 1947), This Is the Place
 * Heritage Park, Salt Lake City — procedural, CC0-1.0, no textures.
 *   bun generators/slc-this-is-the-place-monument.ts
 *
 * Map frame: x across the monument (its front, facing the valley, is -x),
 * y along its wings, z up, metres; bearing 20 (the wings run 20°/200°,
 * lidar; the front faces 290°, WNW, toward the valley, and the figures on
 * the pylon look that way, as in Mark Cowell's photo from behind). The
 * anchor is the pylon's centre, 1.5 m west and 2 m north of OSM's
 * node/356680155 (Q7786449), from the lidar.
 *
 * A tapering granite pylon with three bronze figures on top (Brigham
 * Young, Heber C. Kimball and Wilford Woodruff), set in the middle of a
 * long low granite wall whose two wings carry bronze friezes of the
 * pioneer trek and end in granite blocks topped by bronze groups:
 *   - pylon: 5.2 m square at its foot, 3.4 m at its top, 14.7 m (lidar
 *     23.0–23.4 against the ground's 8.5), with a capping band; the
 *     figures to 18.2 m (lidar 26.8; published 60 ft, 18.3 m);
 *   - the bronze horseman group on a ledge on the pylon's front and the
 *     dark inscription panel under it (Ben P L's photos);
 *   - wings: 3.4 m high (lidar 11.9), about 2 m thick, from end block to
 *     end block 26 m (lidar 23.4 m between block centres; published 86 ft);
 *     bronze friezes on both faces;
 *   - end blocks 4.4 m with equestrian groups to about 6.3 m (lidar 14–15).
 *
 * Elevation 0: the ground is flat (lidar 8.3–8.7 under the monument).
 * Night: the granite is floodlit (`_FLOODLIGHT` on the walls and pylon).
 *
 * Evidence
 * - OSM: node/356680155 (historic=monument); no building to replace.
 * - Lidar: USGS_LPC_UT_Wasatch_L4_2013_LAS_2016 (flown 2013), 0.5 m: the
 *   pylon, the figures' top, the wall and end-block heights, the
 *   orientation.
 * - Photos (Wikimedia Commons):
 *   Ben P L, "This Is The Place Monument (29891219127).jpg" and
 *     "(29891218907).jpg" (CC BY-SA 2.0; the front, frontal, and the
 *     pylon's horseman group);
 *   An Errant Knight, "This Is The Place Monument, Mar 17.jpg" (CC BY-SA
 *     4.0; from the south-west, the wing's back);
 *   Mark Cowell, "View of Salt Lake from behind This is the Place Monument
 *     - panoramio.jpg" (CC BY 3.0; the three figures from behind);
 *   PerryPlanet, "SLC thisistheplace.jpg" (public domain; the pylon's taper
 *     and a wing end).
 * Estimated: the figures and groups as bold blocks of their real size and
 *   pose; the wall thickness; the friezes' extent.
 * Left out: the inscriptions, the smaller figures on the wall, the
 *   plaza's paving and railings.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { box, quad } from './dc-nationals-park'

const granite = new Part(), coping = new Part(), bronze = new Part()
const X: V3 = [1, 0, 0], Y: V3 = [0, 1, 0], Z: V3 = [0, 0, 1]
const B = (p: Part, c: V3, h: V3, bottom = false) => box(p, c, [X, Y, Z], h, bottom)

// --- The pylon: a tapering square shaft ---
{
  const z0 = 0, z1 = 14.2, b = 2.6, t = 1.72
  const ring = (h: number, z: number): V3[] => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
  const lo = ring(b, z0), hi = ring(t, z1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, m: V3 = [(lo[i][0] + lo[j][0]) / 2, (lo[i][1] + lo[j][1]) / 2, 0]
    quad(granite, [lo[i], lo[j], hi[j], hi[i]], [m[0], m[1], 0.2])
  }
  // The capping band and its top.
  B(coping, [0, 0, 14.45], [t + 0.15, t + 0.15, 0.25])
  // A low plinth course at the foot.
  B(coping, [0, 0, 0.35], [b + 0.25, b + 0.25, 0.35])
}
// The three figures on top, looking out over the front (-x).
function figure(x: number, y: number, z: number, h: number, w = 0.42) {
  B(bronze, [x, y, z + h * 0.24], [w * 0.85, w * 1.15, h * 0.24]) // legs and coat skirt
  B(bronze, [x, y, z + h * 0.62], [w, w * 1.3, h * 0.16]) // torso
  B(bronze, [x - 0.05, y, z + h * 0.88], [w * 0.55, w * 0.6, h * 0.1]) // head
}
figure(-0.3, 0, 14.7, 3.5, 0.34) // Brigham Young, in the middle
figure(0.15, -1.1, 14.7, 3.3, 0.3)
figure(0.15, 1.1, 14.7, 3.3, 0.3)

// The horseman group on a ledge on the pylon's front, and the inscription
// panel under it.
{
  const fx = -2.45 // the pylon's front face at z ~4 (it tapers from 2.6)
  B(coping, [fx - 0.6, 0, 3.75], [0.75, 1.9, 0.25])
  // Horse (body, neck and head, legs) and two riders.
  B(bronze, [fx - 0.7, 0, 5.0], [0.45, 1.25, 0.45])
  B(bronze, [fx - 0.7, 1.35, 5.6], [0.3, 0.35, 0.55])
  for (const dy of [-0.9, 0.9]) B(bronze, [fx - 0.7, dy, 4.3], [0.3, 0.18, 0.3])
  figure(fx - 0.7, -0.2, 5.4, 2.0, 0.3)
  figure(fx - 0.5, -1.6, 4.0, 2.2, 0.3)
  quad(bronze, [[-2.62, -1.4, 0.9], [-2.62, 1.4, 0.9], [-2.56, 1.4, 2.7], [-2.56, -1.4, 2.7]], [-1, 0, 0.05])
}

// --- The wings: walls with bronze friezes, end blocks with groups ---
for (const s of [-1, 1]) {
  const y0 = s * 2.6, y1 = s * 10.2, ym = (y0 + y1) / 2, hy = Math.abs(y1 - y0) / 2
  B(granite, [0, ym, 1.7], [1.0, hy, 1.7])
  B(coping, [0, ym, 3.55], [1.15, hy, 0.2])
  B(coping, [0, ym, 0.25], [1.2, hy, 0.25])
  // The friezes, front and back.
  for (const side of [-1, 1]) {
    const x = side * 1.03, a = s * 3.4, b = s * 9.6
    quad(bronze, [[x, a, 0.9], [x, b, 0.9], [x, b, 2.9], [x, a, 2.9]], [side, 0, 0])
  }
  // The end block.
  const ye = s * 11.7
  B(granite, [0, ye, 2.0], [1.6, 1.5, 2.0])
  B(coping, [0, ye, 4.2], [1.75, 1.65, 0.2])
  B(coping, [0, ye, 0.25], [1.8, 1.7, 0.25])
  // An equestrian group on it, facing the front.
  B(bronze, [-0.1, ye, 5.15], [1.15, 0.45, 0.45]) // horse's body, across
  B(bronze, [-1.25, ye, 5.65], [0.3, 0.3, 0.55]) // neck and head
  for (const dx of [-0.8, 0.6]) B(bronze, [dx, ye, 4.65], [0.15, 0.3, 0.3])
  figure(0.1, ye, 5.5, 1.9, 0.32)
  figure(0.9, ye - s * 0.6, 4.4, 1.8, 0.3) // a walker beside it
}

// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : Math.min(1, 0.55 + p[2] / 30))
const parts = [
  { part: granite, material: { ...finish('place-granite', 0xddd2c0), floodlight: lit } },
  { part: coping, material: { ...finish('place-coping', 0xe8dfcf), floodlight: lit } },
  { part: bronze, material: finish('place-bronze', 0x6e5f4d) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('This Is the Place Monument', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 20, osm: 'node/356680155', height: 18.2,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/slc-this-is-the-place-monument.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
