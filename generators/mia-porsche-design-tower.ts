/**
 * Porsche Design Tower (2017, Sieger Suarez Architects for Porsche Design
 * and Dezer), 18555 Collins Avenue, Sunny Isles Beach — original
 * procedural geometry, CC0-1.0.
 * bun generators/mia-porsche-design-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/402232479
 * (25.9481946, -80.1198798). The plan is round, so the bearing is 0.
 *
 * Identity: a tall, slender round tower of dark blue glass that narrows
 * gently toward its flat top; one half is smooth, flush glass, the other
 * carries stacked balcony slabs whose pale edges band it; a white spine
 * (the glass car-lift shaft) runs up one side.
 *
 * Sources:
 *  - OSM: way/402232479 (building=apartments, height 195, 60 levels,
 *    wikidata Q7230398): a 20-point circle, radius 25.9 m about its
 *    centroid (measured from the outline, ±0.1 m).
 *  - Published: 641 ft (195 m), 60 storeys, completed 2017 (Wikipedia,
 *    CTBUH; OSM agrees).
 *  - Lidar: NONE usable. USGS_LPC_FL_Southeast_B2_2018's EPT returns no
 *    points here, and NOAA Digital Coast EPT 10338 (2021) reads only ground
 *    (3 m) over the footprint — the tower's returns are missing from the
 *    cloud (a neighbour 60 m south-west does read 242 m). So the height is
 *    the published 195 m, and every other height is photo-scaled.
 *  - Mapterhorn terrain: falls about 2 m from Collins Avenue (west) to the
 *    beach (east) across the footprint; y = 0 is the lowest ground.
 *  - Estimated from the photos: the taper (full radius to about 140 m,
 *    then narrowing to 0.86 of it at the roof, from the curving silhouette
 *    in Lender's photo and the skyline shots), the split between the smooth
 *    glass half and the balcony half, the spine's width (~4 m), the crown
 *    parapet (~4 m). Balcony slab edges are drawn as a pale band every
 *    three storeys (9.75 m) rather than every floor.
 *  - Colours: deep navy glass pulled light (smooth half), a lighter
 *    grey-blue for the balcony glass, white-grey slab edges and spine.
 *  - Night: both glass halves are `window*` (residences, lit at night).
 *
 * Photos:
 *  - Porsche_Design_Tower_November_2016.jpg, Carl Lender, CC BY 2.0
 *    (Wikimedia Commons) — from the Collins Avenue gateway, looking up:
 *    the smooth glass half, the balcony half and the white spine;
 *  - Sunny_Isles_Beach_skyline_from_the_north,_2016.jpg, B137, CC0
 *    (Commons) — the dark round tower and its flat crown behind its
 *    neighbours;
 *  - "Sunny Isles Beach 1", Julian Boed, CC BY 2.0 (Flickr 22705348953) —
 *    the beach panorama with the round dark tower at the south end
 *    (identification by position; taken before completion);
 *  - Sunny_Isles_,_190906-0402-jikatu, Jimmy Baikovicius, CC BY-SA 2.0
 *    (Commons) — the skyline from the bay at night, lit floors.
 * No look-only sources. No commercial imagery or 3D tiles.
 *
 * Doubts: the evidence is thin. Only one close licensed photo exists, and
 * its direction (west, from the gateway) is inferred from the sign's
 * position; which compass sides carry the balconies and the spine is
 * therefore an estimate (balconies on the south and east, the ocean side;
 * spine on the south). The base (the lobby and its car ramps) and the crown
 * are not photographed close up and are kept plain.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { type XY, walls, capRing, face, build } from './mia-panorama-tower'

const H = 195, R0 = 25.9, N = 28
const smooth = (a: number, b: number, z: number) => { const t = Math.min(1, Math.max(0, (z - a) / (b - a))); return t * t * (3 - 2 * t) }
const rad = (z: number) => R0 * (1 - 0.14 * smooth(120, H, z))
const ring = (z: number, dr = 0, a0 = 0, a1 = 2 * Math.PI, n = N): XY[] =>
  Array.from({ length: n + (a1 - a0 < 2 * Math.PI - 1e-6 ? 1 : 0) }, (_, k) => {
    const a = a0 + ((a1 - a0) * k) / n
    return [(rad(z) + dr) * Math.cos(a), (rad(z) + dr) * Math.sin(a)] as XY
  })

const smoothGlass = new Part(), balcGlass = new Part(), edge = new Part(), spine = new Part(), roof = new Part()

// glass body, lofted ring by ring so it follows the taper; the balcony half
// (south and east: angles -150°..+30°, i.e. from the south-west round to the
// north-east) is a separate lighter material.
const LV: number[] = []; for (let z = 0; z < H - 4; z += 9.75) LV.push(z); LV.push(H - 4)
const isBalc = (a: number) => { const d = ((a * 180) / Math.PI + 360) % 360; return d > 210 || d < 30 }
for (let i = 0; i < LV.length - 1; i++) {
  const z0 = LV[i], z1 = LV[i + 1]
  for (let k = 0; k < N; k++) {
    const a0 = (2 * Math.PI * k) / N, a1 = (2 * Math.PI * (k + 1)) / N
    const p = (a: number, z: number): V3 => [rad(z) * Math.cos(a), rad(z) * Math.sin(a), z]
    const nm = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    const part = isBalc((a0 + a1) / 2) ? balcGlass : smoothGlass
    part.tri(p(a0, z0), p(a1, z0), p(a1, z1), undefined, undefined, undefined, [nm(a0), nm(a1), nm(a1)])
    part.tri(p(a0, z0), p(a1, z1), p(a0, z1), undefined, undefined, undefined, [nm(a0), nm(a1), nm(a0)])
  }
}
// pale slab-edge bands: every three storeys on the balcony half (proud, as
// the balconies are); the smooth half stays plain glass, as in the photos
function band(z: number, h: number, dr: number, a0: number, a1: number, n: number, part: Part) {
  const lo = ring(z - h / 2, dr, a0, a1, n), hi = ring(z + h / 2, dr, a0, a1, n)
  for (let k = 0; k < n; k++) {
    const nm = (q: XY): V3 => { const l = Math.hypot(q[0], q[1]); return [q[0] / l, q[1] / l, 0] }
    part.tri([lo[k][0], lo[k][1], z - h / 2], [lo[k + 1][0], lo[k + 1][1], z - h / 2], [hi[k + 1][0], hi[k + 1][1], z + h / 2], undefined, undefined, undefined, [nm(lo[k]), nm(lo[k + 1]), nm(hi[k + 1])])
    part.tri([lo[k][0], lo[k][1], z - h / 2], [hi[k + 1][0], hi[k + 1][1], z + h / 2], [hi[k][0], hi[k][1], z + h / 2], undefined, undefined, undefined, [nm(lo[k]), nm(hi[k + 1]), nm(hi[k])])
    // soffit and top of the projecting slab
    if (dr > 0.2) {
      const li = ring(z - h / 2, 0, a0, a1, n), ti = ring(z + h / 2, 0, a0, a1, n)
      face(part, [[li[k][0], li[k][1], z - h / 2], [li[k + 1][0], li[k + 1][1], z - h / 2], [lo[k + 1][0], lo[k + 1][1], z - h / 2], [lo[k][0], lo[k][1], z - h / 2]], [0, 0, -1])
      face(part, [[ti[k][0], ti[k][1], z + h / 2], [hi[k][0], hi[k][1], z + h / 2], [hi[k + 1][0], hi[k + 1][1], z + h / 2], [ti[k + 1][0], ti[k + 1][1], z + h / 2]], [0, 0, 1])
    }
  }
}
const BA0 = (-150 * Math.PI) / 180, BA1 = (30 * Math.PI) / 180
for (let z = 9.75; z < H - 6; z += 9.75) band(z, 1.1, 0.9, BA0, BA1, 14, edge)

// the white spine (car-lift shaft) on the south face, standing 1.5 m proud
{
  const w = 2.2
  const zs: number[] = []; for (let z = 0; z <= H + 2; z += 13) zs.push(z); if (zs[zs.length - 1] < H + 2) zs.push(H + 2)
  for (let i = 0; i < zs.length - 1; i++) {
    const za = zs[i], zb = zs[i + 1], ya = -rad(za) - 1.5, yb = -rad(zb) - 1.5, yia = -rad(za) + 2, yib = -rad(zb) + 2
    face(spine, [[-w, ya, za], [w, ya, za], [w, yb, zb], [-w, yb, zb]], [0, -1, 0])
    face(spine, [[w, ya, za], [w, yia, za], [w, yib, zb], [w, yb, zb]], [1, 0, 0])
    face(spine, [[-w, yia, za], [-w, ya, za], [-w, yb, zb], [-w, yib, zb]], [-1, 0, 0])
  }
  face(spine, [[-w, -rad(H + 2) - 1.5, H + 2], [w, -rad(H + 2) - 1.5, H + 2], [w, -rad(H + 2) + 2, H + 2], [-w, -rad(H + 2) + 2, H + 2]], [0, 0, 1])
  // glass slot down its face
  const s = 0.9
  for (let i = 0; i < zs.length - 1; i++) {
    const za = Math.max(zs[i], 6), zb = Math.min(zs[i + 1], H - 2); if (zb <= za) continue
    face(smoothGlass, [[-s, -rad(za) - 1.56, za], [s, -rad(za) - 1.56, za], [s, -rad(zb) - 1.56, zb], [-s, -rad(zb) - 1.56, zb]], [0, -1, 0])
  }
}

// crown: a 4 m pale parapet band round the flat roof, roof slab inside it
walls(ring(H - 4, 0.15), [[H - 4, H, edge]])
capRing(roof, ring(H, -0.6), H - 0.8)
{
  const o = ring(H, 0.15), i = ring(H, -0.6)
  for (let k = 0; k < N; k++) { const j = (k + 1) % N; face(edge, [[o[k][0], o[k][1], H], [o[j][0], o[j][1], H], [i[j][0], i[j][1], H], [i[k][0], i[k][1], H]], [0, 0, 1]) }
  walls(i.slice().reverse(), [[H - 0.8, H, edge]])
}
// rooftop plant
walls(ring(H, -14, 0, 2 * Math.PI, 12).map(([x, y]) => [x * 0.55, y * 0.55] as XY), [[H - 0.8, H + 3, roof]])
capRing(roof, ring(H, -14, 0, 2 * Math.PI, 12).map(([x, y]) => [x * 0.55, y * 0.55] as XY), H + 3)
// ground floor: a pale base band (lobby) under the glass
walls(ring(0, 0.3), [[0, 6, edge]])

if (import.meta.main) {
  await build('Porsche Design Tower', 'mia-porsche-design-tower', [
    { part: smoothGlass, material: { name: 'window', color: 0x56708a, roughness: 0.35 } },
    { part: balcGlass, material: windowVariant(2, 0x7d93a6) },
    { part: edge, material: finish('pdt-edge', 0xe6e8e8) },
    { part: spine, material: finish('pdt-spine', 0xf2f2ef) },
    { part: roof, material: { name: 'roof', color: 0x9da6ad, roughness: 0.85 } },
  ], { bearing: 0, elevation: 0, height: H + 3, replaces: ['way/402232479'] }, process.argv[2], 5000)
}
