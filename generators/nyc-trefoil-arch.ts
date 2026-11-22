/**
 * Trefoil Arch, Central Park, under East Drive by the Conservatory Water
 * (Calvert Vaux, 1862) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-trefoil-arch.ts
 *
 * Built with the portal kit in nyc-balcony-bridge.ts and the arch kit in
 * nyc-greyshot-arch.ts.
 *
 * Frame (mesh.ts map frame): y along the footpath through the arch, toward
 * the west portal (bearing 311°: the placement's bearing), x along East
 * Drive (bearing 41°), z up, metres; z = 0 is the path under the arch.
 * Anchor: the centroid of OSM way/1120999154 (man_made=bridge,
 * bridge:structure=arch, "Trefoil Arch"), which the model draws across and
 * so replaces.
 *
 * Evidence
 * - OSM (ODbL): outline way/1120999154, 9.6 m along the drive by 21.6 m
 *   portal to portal; East Drive on it way/959011551 (width 6) and the
 *   footway beside it way/959011557; the path through way/211731510.
 * - Map terrain (Mapterhorn z15, bearing 311): the path at 0 at both ends,
 *   the drive's plateau 4.4–4.8 m above it from y −9 to +3; west of that the
 *   ground falls to the west portal in a hollow, its sides 2–3 m up at
 *   x ±6. The roadway is taken at 4.7 m; the portal blocks' tops stop at
 *   4.4 m, in asphalt grey.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-trefoil-arch/photos):
 *   Epicgenius, "Central Park Jul 2019 49.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_Jul_2019_49.jpg
 *     (the east face square on: every proportion of that face below);
 *   Epicgenius, "Central Park Jul 2019 48.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_Jul_2019_48.jpg
 *     (the cusped ring close up; the brick-walled, plank-ceiled passage);
 *   Jim.henderson, "Trefoil Arch East jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Trefoil_Arch_East_jeh.jpg
 *     (the east face in winter: the long wall, the iron railing between
 *     brownstone posts);
 *   Epicgenius, "Central Park Jul 2019 46.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Central_Park_Jul_2019_46.jpg
 *     and Pablo Costa Tirado, "Trefoil Arch - panoramio.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Trefoil_Arch_-_panoramio.jpg
 *     (the west portal in its hollow: a low face with wing walls sloping
 *     into the hillside, under ivy).
 * - Estimated from the square-on east photo, scaled to the terrain's 4.9 m
 *   from the path to the coping: span 6.8 m (about 57% of the face between
 *   the roundels' outer edges), a flattened arch springing at 0.8 m with
 *   its crown at 3.35 m (about 70–75% of the way to the cornice), its inner
 *   edge cusped low on the haunches (the trefoil); ring 0.5 m; roundels
 *   1.9 m across, drawn a little bold (0.25 m proud with a boss), just
 *   outside the ring 5.0 m either side of the centre line at 2.3 m; cornice 0.35 m; railing 1.0 m on posts.
 *   The east face is drawn 18 m long; the west face's crown wall 4.3 m,
 *   its wing walls falling to 1.2 m at x ±7.
 *
 * Simplified: the ashlar coursing and the roundels' carving are left out
 * (each roundel is a disc with a boss); the railing is two rails and sparse
 * balusters; the passage's plank ceiling is drawn as the arch's soffit.
 * Each portal carries 3 m of barrel; the middle is the terrain's.
 *
 * Doubts: dimensions are photo-scaled from the terrain's road height; the
 * west ring is drawn plain (the photos show no cusps there under the ivy).
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { band, bevelBox, box, qn, steps } from './nyc-greyshot-arch'
import { archPr, barrel, openFace, ring, type Pr } from './nyc-balcony-bridge'

const face = new Part(), trim = new Part(), brick = new Part(), metal = new Part(), fill = new Part()
const HY = 10.8, T = 0.8, DEPTH = 3.0, FILL = 4.4
const A = 3.4, RISE = 2.55, SPRING = 0.8, RING = 0.5
const plain = archPr('ellipse', A, RISE, SPRING, 22)
/** The trefoil: the ellipse pulled in to a cusp at 30° and 150°. */
const cusped: Pr = plain.map(([x, z]) => {
  if (z <= SPRING + 1e-6) return [x, z]
  const t = Math.atan2((z - SPRING) / RISE, x / A)
  const f = 1 - 0.13 * Math.max(0, 1 - Math.abs(t - (30 * Math.PI) / 180) / 0.45, 1 - Math.abs(t - (150 * Math.PI) / 180) / 0.45)
  return [x * f, SPRING + (z - SPRING) * f]
})
const WB = A + RING + 0.9 // half width of each portal block behind its face

/** A portal: its face, ring, 3 m of barrel, and the block behind capped in grey. */
function portal(s: number, pr: Pr, x0: number, x1: number, top: (x: number) => number, xsTop: number[]) {
  const y = s * HY, yi = s * (HY - T), yb = s * (HY - DEPTH)
  openFace(face, y, s, pr, x0, x1, top, 6)
  ring(trim, y, s, pr, RING, 0.12)
  barrel(brick, pr, y, yb)
  // the wall top over its thickness, and its inner face
  const xs = [...new Set([x0, ...xsTop, -WB, WB, x1])].sort((a, b) => a - b)
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i], b = xs[i + 1]
    qn(face, [a, y, top(a)], [b, y, top(b)], [b, yi, top(b)], [a, yi, top(a)], [0, 0, 1])
    const inside = Math.abs(a) < WB - 1e-6 && Math.abs(b) < WB + 1e-6
    const lo = (x: number) => (inside ? Math.min(FILL, top(x)) : 0)
    if (top(a) > lo(a) + 1e-3 || top(b) > lo(b) + 1e-3) qn(face, [a, yi, lo(a)], [b, yi, lo(b)], [b, yi, top(b)], [a, yi, top(a)], [0, -s, 0])
  }
  for (const x of [x0, x1]) qn(face, [x, y, 0], [x, yi, 0], [x, yi, top(x)], [x, y, top(x)], [Math.sign(x), 0, 0])
  // the block behind: sides, back face with the opening, grey top
  const zt = Math.min(FILL, top(0))
  openFace(face, yb, -s, pr, -WB, WB, () => zt, 2)
  for (const x of [-WB, WB]) qn(face, [x, yi, 0], [x, yb, 0], [x, yb, zt], [x, yi, zt], [Math.sign(x), 0, 0])
  qn(fill, [-WB, yi, zt], [WB, yi, zt], [WB, yb, zt], [-WB, yb, zt], [0, 0, 1])
}

// --- the east face, on the Conservatory Water side ---------------------------
const TOPE = 4.9, XE = 9.0
portal(-1, cusped, -XE, XE, () => TOPE, steps(-XE, XE, 6))
band(trim, -1, HY, 0.2, [-XE, XE], () => TOPE - 0.35, () => TOPE)
for (const [a, b] of [[-XE, -A], [A, XE]]) band(trim, -1, HY, 0.06, [a, b], () => 0, () => 0.45)
// the roundels: a disc with a boss
const disc = (cx: number, cz: number, r: number, y0: number, y1: number, n = 14) => {
  const ring0 = Array.from({ length: n }, (_, k): [number, number] => [cx + r * Math.cos((2 * Math.PI * k) / n), cz + r * Math.sin((2 * Math.PI * k) / n)])
  for (let k = 0; k < n; k++) {
    const [x0, z0] = ring0[k], [x1, z1] = ring0[(k + 1) % n]
    qn(trim, [x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0], [(x0 + x1) / 2 - cx, 0, (z0 + z1) / 2 - cz])
    const t: V3[] = [[cx, y1, cz], [x0, y1, z0], [x1, y1, z1]]
    if (y1 < y0) trim.tri(t[0], t[2], t[1]); else trim.tri(t[0], t[1], t[2])
  }
}
for (const sx of [-1, 1]) {
  disc(sx * 5.0, 2.3, 0.95, -HY, -HY - 0.25)
  disc(sx * 5.0, 2.3, 0.45, -HY - 0.25, -HY - 0.42, 8)
}
// the railing: brownstone posts, black iron rails and balusters
const yr = -(HY - 0.3), posts = [-8.7, -5.4, -2.0, 2.0, 5.4, 8.7]
for (const x of posts) {
  bevelBox(trim, x, yr, 0.25, 0.25, TOPE, TOPE + 1.05, 0.05)
  bevelBox(trim, x, yr, 0.3, 0.3, TOPE + 1.05, TOPE + 1.17, 0.04)
}
for (let k = 0; k + 1 < posts.length; k++) {
  const x0 = posts[k] + 0.25, x1 = posts[k + 1] - 0.25
  box(metal, x0, x1, yr - 0.04, yr + 0.04, TOPE + 0.9, TOPE + 0.98)
  box(metal, x0, x1, yr - 0.04, yr + 0.04, TOPE + 0.12, TOPE + 0.18)
  const m = Math.max(1, Math.round((x1 - x0) / 0.55))
  for (let j = 1; j < m; j++) {
    const xc = x0 + ((x1 - x0) * j) / m
    box(metal, xc - 0.03, xc + 0.03, yr - 0.03, yr + 0.03, TOPE, TOPE + 0.9)
  }
}

// --- the west face, in the hollow ---------------------------------------------
const XW = 7.0, CW = 3.9
const topW = (x: number) => (Math.abs(x) <= CW ? 4.3 : 4.3 - (3.1 * (Math.abs(x) - CW)) / (XW - CW))
const xsW = [...steps(-XW, -CW, 4), ...steps(CW, XW, 4)]
portal(1, plain, -XW, XW, topW, xsW)
for (const sx of [-1, 1]) {
  const xs = sx < 0 ? steps(-XW, -CW, 4) : steps(CW, XW, 4)
  band(trim, 1, HY, 0.12, xs, (x) => topW(x) - 0.3, topW)
}
band(trim, 1, HY, 0.12, [-CW, CW], () => 4.0, () => 4.3)

finishModel('Trefoil Arch', 'nyc-trefoil-arch', [
  { part: face, material: { name: 'brownstone', color: 0xa8806f, roughness: 0.9 } },
  { part: trim, material: { name: 'brownstone-trim', color: 0xb8907c, roughness: 0.85 } },
  { part: brick, material: { name: 'brick', color: 0x9e6253, roughness: 0.9 } },
  { part: metal, material: { name: 'metal', color: 0x4a4f57, roughness: 0.6 } },
  { part: fill, material: { name: 'asphalt', color: 0x8e8e8c, roughness: 0.95 } },
], { bearing: 311, osm: 'way/1120999154', height: TOPE + 1.17 }, 5000)
