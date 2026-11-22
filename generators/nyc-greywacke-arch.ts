/**
 * Greywacke Arch, Central Park, behind the Metropolitan Museum (Calvert
 * Vaux and Jacob Wrey Mould, 1862) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-greywacke-arch.ts
 *
 * Frame (mesh.ts map frame): x along East Drive (bearing 226.1°), y along
 * the footpath through the arch (the placement's bearing, 136.1°, SE), z up,
 * metres. z = 0 is the footpath under the arch. Anchor: the middle of OSM
 * way/318474843 (footway, tunnel=yes, layer −1, "Greywacke Arch"), 16.2 m
 * long, taken as portal face to portal face. OSM maps no man_made=bridge
 * outline or building here (the OSM API timed out on a fuller check; `replaces`
 * is empty and should be confirmed at merge with `bun tools/overlap.ts`).
 * The drive's surface is the map's: the model's infill stops 0.3 m under the
 * assumed roadway at 4.6 m, and nothing is drawn at road level.
 *
 * Evidence
 * - OSM (ODbL): the path through the arch, way/318474843.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-greywacke-arch/photos):
 *   Jim.henderson, "Greywacke Arch snow jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Greywacke_Arch_snow_jeh.jpg
 *     (one face square on: the depressed pointed arch, the greywacke
 *     voussoirs and jambs, the gabled hood with its finial, red brownstone
 *     ashlar with grey bands, cornice, iron railing between capped stone
 *     pedestals; every proportion below);
 *   Jim.henderson, "Greywacke Arch CP jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Greywacke_Arch_CP_jeh.jpg
 *     (a three-quarter view in sun: colours, people for scale);
 *   Eden, Janine and Jim, "Greywacke Arch (51431346630).jpg", CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Greywacke_Arch_(51431346630).jpg
 *     (the red brick barrel, the face's lower greywacke courses).
 * - Estimated from the snow photo, scaled to an assumed 4.6 m from the path
 *   to the drive (people in the sunny photo agree to about ±0.4 m): span
 *   5.8 m, springing 0.9 m, apex of the intrados 3.4 m; voussoir ring
 *   0.75 m; hood feet 2.65 m up, apex at the cornice; cornice 0.35 m;
 *   railing 1.0 m with pedestals at the face's ends and 3.3 m either side
 *   of the centre; the face 13 m long.
 *
 * Simplified: the pointed arch is an equilateral arch scaled down to the
 * real rise; the face's grey and red courses are one red face with grey
 * base courses, impost and one string course; the railing's lattice is an
 * X per bay. The barrel is drawn 2.5 m deep behind each portal; the
 * embankment under the drive covers the middle.
 *
 * Doubts: the drive's height wasn't measured (the map terrain and lidar
 * reads timed out on the overloaded machine); both faces are drawn alike.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { band, bevelBox, box, qn, steps, urn } from './nyc-greyshot-arch'

const red = new Part(), grey = new Part(), brick = new Part(), iron = new Part(), fill = new Part()
const ROAD = 4.6, TOP = ROAD, W = 6.5, D = 16, half = D / 2, PORTAL = 2.5
const A = 2.9, SPRING = 0.9, APEX = 3.4, RING = 0.75, CORN = 0.35
const H = APEX - SPRING

/** A pointed (equilateral, scaled) arch from (−a, spring) to (a, spring). */
function pointed(a: number, h: number, spring: number, n = 7): [number, number][] {
  const left = steps(Math.PI, (2 * Math.PI) / 3, n).map((t): [number, number] => [a * (1 + 2 * Math.cos(t)), spring + (h / Math.sqrt(3)) * 2 * Math.sin(t)])
  left[n][0] = 0
  const right = left.slice(0, n).reverse().map(([x, z]): [number, number] => [-x, z])
  return [...left, ...right]
}
const pr = pointed(A, H, SPRING)
const po = pointed(A + RING, H + RING * 1.25, SPRING)
const N = pr.length - 1
// outward normals (away from the opening) per point, from the profile's tangent
const nrm = pr.map((_, i): [number, number] => {
  const p = pr[Math.max(i - 1, 0)], q = pr[Math.min(i + 1, N)]
  const tx = q[0] - p[0], tz = q[1] - p[1], l = Math.hypot(tx, tz)
  return [-tz / l, tx / l]
})

for (const s of [-1, 1]) {
  const y = s * half, nf: V3 = [0, s, 0], yi = s * (half - 0.9)
  // the face outside the opening and over it, up to the cornice
  qn(red, [-W, y, 0], [-A, y, 0], [-A, y, TOP], [-W, y, TOP], nf)
  qn(red, [A, y, 0], [W, y, 0], [W, y, TOP], [A, y, TOP], nf)
  for (let i = 0; i < N; i++) {
    const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
    qn(red, [x0, y, z0], [x1, y, z1], [x1, y, TOP], [x0, y, TOP], nf)
  }
  // jambs below the springing are faced in greywacke with the ring
  const yr = s * (half + 0.08)
  for (let i = 0; i < N; i++) {
    const [x0, z0] = pr[i], [x1, z1] = pr[i + 1], [u0, w0] = po[i], [u1, w1] = po[i + 1]
    qn(grey, [x0, yr, z0], [x1, yr, z1], [u1, yr, w1], [u0, yr, w0], nf)
    qn(grey, [u0, y, w0], [u1, y, w1], [u1, yr, w1], [u0, yr, w0], [(u0 + u1) / 2, 0, (w0 + w1) / 2 - SPRING])
  }
  for (const sx of [-1, 1]) band(grey, s, half, 0.08, sx < 0 ? [-A - RING, -A] : [A, A + RING], () => 0, () => SPRING)
  // the greywacke base courses, impost band and a string course
  for (const sx of [-1, 1]) {
    const xs = sx < 0 ? [-W, -A - RING] : [A + RING, W]
    band(grey, s, half, 0.05, xs, () => 0, () => SPRING + 0.35)
    band(grey, s, half, 0.05, xs, () => 2.5, () => 2.68)
  }
  // the cornice, the wall top and the ends
  band(grey, s, half, 0.2, [-W, W], () => TOP - CORN, () => TOP)
  qn(red, [-W, y, TOP], [W, y, TOP], [W, yi, TOP], [-W, yi, TOP], [0, 0, 1])
  for (const sx of [-1, 1]) qn(red, [sx * W, y, 0], [sx * W, yi, 0], [sx * W, yi, TOP], [sx * W, y, TOP], [sx, 0, 0])
  // the gabled hood over the arch, with a finial at its apex
  const hz0 = SPRING + 1.75, hx0 = A + RING + 0.55, hz1 = TOP - 0.05
  for (const sx of [-1, 1]) {
    const yh = s * (half + 0.22), xa = sx * hx0, ux = -sx * 0.22, uz = 0.34
    const p0: V3 = [xa, yh, hz0], p1: V3 = [0, yh, hz1], p2: V3 = [0, yh, hz1 + uz], p3: V3 = [xa + ux * 0, yh, hz0 + uz]
    qn(grey, p0, p1, p2, p3, nf)
    qn(grey, [xa, y, hz0 + uz], [0, y, hz1 + uz], p2, p3, [0, 0, 1])
    qn(grey, [xa, y, hz0], [xa, y, hz0 + uz], p3, p0, [sx, 0, 0])
    qn(grey, [xa, y, hz0], [0, y, hz1], p1, p0, [0, 0, -1])
  }
  bevelBox(grey, 0, s * (half + 0.15), 0.28, 0.22, TOP - 0.1, TOP + 0.45, 0.08)
  urn(grey, 0, s * (half + 0.15), [[0.18, TOP + 0.45], [0.26, TOP + 0.6], [0.12, TOP + 0.85], [0.03, TOP + 1.0]], 8)
}

// the barrel, PORTAL deep behind each face, in red brick; the jambs below
// the springing; and the infill under the drive, closed where it stops
const P0 = half - PORTAL
for (const [y0, y1] of [[-half, -P0], [P0, half]] as [number, number][]) {
  for (const sx of [-1, 1]) qn(brick, [sx * A, y0, 0], [sx * A, y1, 0], [sx * A, y1, SPRING], [sx * A, y0, SPRING], [-sx, 0, 0])
  for (let i = 0; i < N; i++) {
    const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
    qn(brick, [x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0], [-(nrm[i][0] + nrm[i + 1][0]), 0, -(nrm[i][1] + nrm[i + 1][1])])
  }
  const f0 = Math.max(y0, -(half - 0.9)), f1 = Math.min(y1, half - 0.9)
  qn(fill, [-W, f0, ROAD - 0.3], [W, f0, ROAD - 0.3], [W, f1, ROAD - 0.3], [-W, f1, ROAD - 0.3], [0, 0, 1])
  for (const sx of [-1, 1]) qn(fill, [sx * W, f0, 0], [sx * W, f1, 0], [sx * W, f1, ROAD - 0.3], [sx * W, f0, ROAD - 0.3], [sx, 0, 0])
}
for (const s of [-1, 1]) {
  const y = s * P0, nf: V3 = [0, -s, 0]
  qn(fill, [-W, y, 0], [-A, y, 0], [-A, y, ROAD - 0.3], [-W, y, ROAD - 0.3], nf)
  qn(fill, [A, y, 0], [W, y, 0], [W, y, ROAD - 0.3], [A, y, ROAD - 0.3], nf)
  for (let i = 0; i < N; i++) {
    const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
    qn(fill, [x0, y, z0], [x1, y, z1], [x1, y, ROAD - 0.3], [x0, y, ROAD - 0.3], nf)
  }
  // the wall's inner face from the infill up to the wall top
  const yi = s * (half - 0.9)
  qn(red, [-W, yi, ROAD - 0.3], [W, yi, ROAD - 0.3], [W, yi, TOP], [-W, yi, TOP], [0, -s, 0])
}

// the parapet: an iron railing between stone pedestals with domed caps
const RAIL = 1.0, posts = [-W + 0.3, -3.3, 3.3, W - 0.3]
for (const s of [-1, 1]) {
  const yb = s * (half - 0.25)
  for (let k = 0; k + 1 < posts.length; k++) {
    const x0 = posts[k] + 0.3, x1 = posts[k + 1] - 0.3
    for (const o of [-1, 1]) {
      const yy = yb + o * 0.05
      // two rails and a band of openwork between, in the iron colour
      qn(iron, [x0, yy, TOP], [x1, yy, TOP], [x1, yy, TOP + 0.12], [x0, yy, TOP + 0.12], [0, o, 0])
      qn(iron, [x0, yy, TOP + RAIL - 0.1], [x1, yy, TOP + RAIL - 0.1], [x1, yy, TOP + RAIL], [x0, yy, TOP + RAIL], [0, o, 0])
      const nb = Math.round((x1 - x0) / 0.9)
      for (let j = 0; j <= nb; j++) {
        const xc = x0 + ((x1 - x0) * j) / nb
        qn(iron, [xc - 0.05, yy, TOP + 0.12], [xc + 0.05, yy, TOP + 0.12], [xc + 0.05, yy, TOP + RAIL - 0.1], [xc - 0.05, yy, TOP + RAIL - 0.1], [0, o, 0])
      }
      // a diagonal lattice suggested by an X in each bay
      for (let j = 0; j < nb; j++) {
        const xa = x0 + ((x1 - x0) * j) / nb, xb = x0 + ((x1 - x0) * (j + 1)) / nb
        for (const [za, zb] of [[TOP + 0.12, TOP + RAIL - 0.1], [TOP + RAIL - 0.1, TOP + 0.12]]) {
          qn(iron, [xa, yy, za - 0.05], [xb, yy, zb - 0.05], [xb, yy, zb + 0.05], [xa, yy, za + 0.05], [0, o, 0])
        }
      }
    }
    box(iron, x0, x1, yb - 0.05, yb + 0.05, TOP + RAIL - 0.02, TOP + RAIL)
  }
  for (const x of posts) {
    bevelBox(grey, x, yb, 0.3, 0.3, TOP, TOP + RAIL + 0.15, 0.05)
    urn(grey, x, yb, [[0.3, TOP + RAIL + 0.15], [0.26, TOP + RAIL + 0.3], [0.16, TOP + RAIL + 0.42], [0.02, TOP + RAIL + 0.48]], 8)
  }
}

finishModel('Greywacke Arch', 'nyc-greywacke-arch', [
  { part: red, material: { name: 'brownstone', color: 0xa87c6c, roughness: 0.9 } },
  { part: grey, material: { name: 'greywacke', color: 0x9a9b8e, roughness: 0.9 } },
  { part: brick, material: { name: 'brick', color: 0x9e6253, roughness: 0.9 } },
  { part: iron, material: { name: 'iron', color: 0x4a4f57, roughness: 0.7 } },
  { part: fill, material: { name: 'infill', color: 0x8f8d88, roughness: 0.9 } },
], { bearing: 136.1, height: TOP + RAIL + 0.5 }, 5000)
