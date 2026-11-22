/**
 * Scripps Center (312 Walnut Street, 1990), Cincinnati — original procedural
 * geometry, CC0-1.0.
 * bun generators/cin-scripps-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor
 * (-84.51039, 39.09930, 2 m from the OSM outline's centroid) on the lowest
 * ground under the footprint (the 3rd Street side, south; Walnut and 4th
 * are 3-4 m higher). Built in the street grid's frame: placement bearing
 * 350°.
 *
 * Form: a stone podium filling the block; behind, a tall beige stone slab
 * with punched windows; in front (south, toward the river) a dark glass
 * mass whose curved wings step back in tiers, and a glass drum rising out of
 * it to the top, split down its south face by a black glazed slot. The
 * drum's top ring is lit at night. The brief described a pyramidal roof;
 * no photo or lidar shows one: the top is the flat-topped glass drum.
 *
 * Sources
 * - OSM: outline way/39197415 (height 143); parts way/270046854, 856, 858,
 *   859, 861, 862, 863, 864, 865, 866, 867; way/807912954 (an unnamed
 *   building over the same block). Plans from OSM, tiers fitted to lidar.
 * - Lidar (measured, USGS 3DEP OH_StatewideP3_6_B21, ~2021, above the 3rd
 *   Street ground): drum rim 145-146 m; glass mass 137.8 m; stone slab
 *   130.5 m; glass wings 126 m, 111 m and 57.7 m; north steps of the slab
 *   81 m and 65 m; podium 34.8 m (OSM says 24 m; lidar used).
 * - Published: 143 m, 36 storeys (Wikipedia, "Scripps Center").
 * - Photos (Wikimedia Commons):
 *   Jere Keys, "Scripps Center" (CC BY 2.0; from the south: glass front,
 *   slot, stone flanks, podium)
 *   https://commons.wikimedia.org/wiki/File:Scripps_Center.jpg
 *   Keith Lanser (Lanskeith17), "Scripps Building from Carew Tower" (public
 *   domain; from the north-west, above: stone slab, punched windows, the
 *   drum and its ring)
 *   https://commons.wikimedia.org/wiki/File:Scripps_Building_from_Carew_Tower.JPG
 *   Keith Lanser, "Scripps Building" (public domain; from the south, up:
 *   the stepped wings, the slot)
 *   https://commons.wikimedia.org/wiki/File:Scripps_Building.JPG
 *   "Cincinnati-scripps-center.jpg" (CC BY 2.0; dusk from the south: lit
 *   drum ring, lit podium)
 *   https://commons.wikimedia.org/wiki/File:Cincinnati-scripps-center.jpg
 * Rework (after the lead's review against Keys' and Lanser's photos):
 *   - the stone block is drawn whole: its walls are split into 1.5 m
 *     pieces so only the parts really inside the glass are culled (the
 *     south face had been dropped entirely, leaving a thin wall with a roof
 *     plate and wall slivers floating beside the drum); it now runs from
 *     y -14 (lidar: 130.5 m at x -24 and +28 from y -12 north) to +18.5;
 *   - the top of the glass widened to x -18.5..22.5 (lidar 137.8 m from x
 *     -20 to +24, y -12 to +10), so the stone shows as narrow flanks as in
 *     Keys' photo;
 *   - a glass bay in the middle of the north face above the north steps,
 *     126.3 m with a 134.3 m centre (lidar at y 12-16; Lanser's photo from
 *     Carew Tower shows dark glass there); the north steps split so their
 *     faces no longer overlap;
 *   - stone windows drawn column by column only where the wall is exposed;
 *     podium windows finer (2.2 m bays at 3.6 m, two-storey groups).
 * Estimated: the tier plans between lidar samples (superellipses about a
 *   common centre), the drum's radius (11.5 m), the wings' widths (widened past the lidar fit to match the photos, where the glass fills nearly the whole width between the stone flanks), window bays (three storeys per
 *   panel), colours pulled to the palette.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, capRing, wallEdge, edgeBase, coverAt, outward, type Prism, finishGlb, emit } from './sea-two-union-square'
import { superellipse } from './cin-great-american-tower'

/** Split every edge longer than `d` so hidden-face culling works piece by piece. */
function subdiv(r: XY[], d: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / d))
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  return out
}

function build() {
  const stone = new Part(), win = new Part(), glass = new Part(), slot = new Part(), roof = new Part(), ring = new Part()
  const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
  const C: XY = [2, -8]

  type P = Prism & { mat: 'stone' | 'glass'; base: XY[] }
  const mk = (base: XY[], z1: number, kind: string, mat: 'stone' | 'glass'): P => ({ ring: mat === 'stone' ? subdiv(base, 1.5) : base, base, z1, kind, mat })
  const prisms: P[] = [
    mk(rect(-28, 32, -25, 25), 34.8, 'podium', 'stone'),
    // the stone tower: a deep, solid block (lidar: 130.5 m from y -14 to +17, x -26 to +29)
    mk(rect(-26, 29, -14, 18.5), 130.5, 'slab', 'stone'),
    mk(rect(-21, -12, 18.5, 22.5), 65, 'n1', 'stone'),
    mk(rect(16, 25, 18.5, 22.5), 65, 'n1e', 'stone'),
    mk(rect(-12, 16, 18.5, 22.5), 81, 'n2', 'stone'),
    // the glass front, wrapped onto the stone's south face in receding tiers
    mk(superellipse(26.5, 15, 4, 32, C[0], C[1]), 57.7, 'w1', 'glass'),
    mk(superellipse(23, 14, 3.5, 32, C[0], C[1]), 111, 'w2', 'glass'),
    mk(superellipse(19.5, 13.5, 3, 28, C[0], C[1]), 126, 'w3', 'glass'),
    // the top of the glass: wide over the stone's south half (lidar 137.8 m, x -20 to +24)
    mk(superellipse(20.5, 12.5, 4, 32, 2, -2.5), 137.8, 'body', 'glass'),
  ]
  // a glass bay in the middle of the north face, above the north steps,
  // stepping up past the stone roof (lidar: 126.3 m wide, 134.3 m centre;
  // Lanser's photo from Carew Tower)
  prisms.push(mk(rect(-12, 16, 14, 18.8), 126.3, 'bayN', 'glass'), mk(rect(-5, 9, 10, 18.8), 134.3, 'bayN2', 'glass'))
  prisms[prisms.length - 2].z0 = 81
  prisms[prisms.length - 1].z0 = 81
  const drumC: XY = [2, -11], DR = 11.5
  const drum = superellipse(DR, DR, 2, 28, drumC[0], drumC[1])
  const all: Prism[] = [...prisms, { ring: drum, z1: 145.5, kind: 'drum' }]

  for (const Pr of prisms) {
    const r = Pr.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(all, Pr, i)
      if (z0 >= Pr.z1 - 0.01) continue
      if (Pr.mat === 'stone') wallEdge(stone, r, i, z0, Pr.z1, 0)
      else wallEdge(glass, r, i, z0, Pr.z1)
    }
    if (Pr.mat === 'stone') {
      const b = Pr.base
      for (let i = 0; i < b.length; i++)
        if (Pr.kind === 'podium') stoneWindows(win, all, Pr, b, i, 3, Pr.z1 - 4.5, { w: 2.2, pitch: 3.6, grp: 9.2, gap: 2.4, from: 1.5 })
        else stoneWindows(win, all, Pr, b, i, 36, Pr.z1 - 2, { w: 2.4, pitch: 4.0, grp: 11.4, gap: 2.4, from: 34.8 })
    }
    capRing(roof, Pr.base, Pr.z1)
  }
  // the drum: glass walls, a lit rim ring at the top
  for (let i = 0; i < drum.length; i++) {
    const z0 = edgeBase(all, all[all.length - 1], i)
    if (z0 < 141.5) wallEdge(glass, drum, i, z0, 141.5)
    wallEdge(ring, drum, i, Math.max(z0, 141.5), 145.5)
  }
  // the rim is an open ring: a low roof inside it
  capRing(roof, superellipse(DR - 0.8, DR - 0.8, 2, 28, drumC[0], drumC[1]), 143)
  {
    const inner = superellipse(DR - 0.8, DR - 0.8, 2, 28, drumC[0], drumC[1])
    for (let i = 0; i < inner.length; i++) {
      const a = inner[i], b = inner[(i + 1) % inner.length]
      ring.quad([b[0], b[1], 143], [a[0], a[1], 143], [a[0], a[1], 145.5], [b[0], b[1], 145.5])
      const A = drum[i], B = drum[(i + 1) % drum.length]
      ring.quad([a[0], a[1], 145.5], [A[0], A[1], 145.5], [B[0], B[1], 145.5], [b[0], b[1], 145.5])
    }
  }
  // the black slot down the drum's south face, podium to the rim
  {
    const y = drumC[1] - DR, w = 1.8
    const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => {
      const r = rect(x0, x1, y0, y1)
      for (let i = 0; i < 4; i++) wallEdge(slot, r, i, z0, z1, 0)
      capRing(slot, r, z1)
    }
    box(drumC[0] - w, drumC[0] + w, y - 0.5, y + 1.5, 34.8, 141.5)
    // and through the podium to the entrance
    box(drumC[0] - w, drumC[0] + w, -25.3, -24.9, 4, 34.8)
  }

  const out = finishGlb('Scripps Center', [
    { part: stone, material: finish('scripps-stone', 0xe3d6bd) },
    { part: win, material: PALETTE.window },
    { part: glass, material: windowVariant(2, 0x6f879b) },
    { part: slot, material: finish('scripps-slot', 0x4a4f57, 0.4) },
    { part: roof, material: PALETTE.roof },
    { part: ring, material: finish('neon-scripps-ring', 0xd5e0e8, 0.4) },
  ], { bearing: 350, height: 145.5, replaces: REPLACES })
  return out
}

/**
 * Window panels on edge i of a stone block, column by column, drawn only
 * where the wall is exposed (above whatever stands in front of it).
 */
function stoneWindows(part: Part, all: Prism[], self: Prism, r: XY[], i: number, z0: number, z1: number, o: { w: number; pitch: number; grp: number; gap: number; from: number }) {
  const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = 1.4
  if (L < o.w + 2 * m) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outward(a, b)
  const nb = Math.max(1, Math.floor((L - 2 * m + (o.pitch - o.w)) / o.pitch))
  const span = nb * o.pitch - (o.pitch - o.w), s0 = (L - span) / 2
  for (let k = 0; k < nb; k++) {
    const u0 = s0 + k * o.pitch, u1 = u0 + o.w
    const P = (u: number, d: number): XY => [a[0] + t[0] * u + n[0] * d, a[1] + t[1] * u + n[1] * d]
    // exposed from the higher of the covers at both edges of the panel
    const cz = Math.max(coverAt(all, P(u0 - 0.6, 0.15), self), coverAt(all, P(u1 + 0.6, 0.15), self))
    const A = P(u0, 0.05), B = P(u1, 0.05)
    for (let z = o.from; z < z1; z += o.grp) {
      const lo = Math.max(z + o.gap / 2, z0, cz + 1.2), hi = Math.min(z + o.grp - o.gap / 2, z1)
      if (hi - lo < 2) continue
      part.quad([A[0], A[1], lo], [B[0], B[1], lo], [B[0], B[1], hi], [A[0], A[1], hi])
    }
  }
}

const REPLACES = [
  'way/39197415', 'way/807912954',
  'way/270046854', 'way/270046856', 'way/270046858', 'way/270046859', 'way/270046861', 'way/270046862',
  'way/270046863', 'way/270046864', 'way/270046865', 'way/270046866', 'way/270046867',
]
void (0 as unknown as V3)

if (import.meta.main) await emit('cin-scripps-center', build())
