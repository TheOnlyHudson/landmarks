/**
 * East Wood Arch, Prospect Park, Brooklyn (Calvert Vaux and Frederick Law
 * Olmsted, 1867) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-east-wood-arch.ts
 *
 * Frame (mesh.ts map frame): y along the barrel toward its north-east
 * portal (bearing 44.4°, the placement's bearing: OSM's footway through
 * it), x across it, z up, metres. z = 0 is the footpath under the arch,
 * the lowest ground under the footprint. Anchor: the midpoint of OSM
 * footway way/1498375011 (tunnel=yes, layer -1, 21 m long, under East
 * Drive way/5673843), -73.966467 40.665873. OSM maps no tunnel or bridge
 * outline and no building here, so `replaces` is empty.
 *
 * Identity: the photos (Commons file descriptions: "East Wood Arch …
 * under the East Drive of the park") show a stone arch, not cast iron as
 * the batch plan said: a flattened elliptical arch whose long rock-faced
 * voussoirs alternate red brownstone and buff sandstone, under a low
 * gabled coping; rock-faced ashlar faces and wings; a red brick barrel on
 * low sandstone jamb blocks.
 *
 * The arch carries East Drive. No road surface is drawn: the portals'
 * infill stops at 3.7 m, 0.3 m under the map's plateau over the barrel
 * (Mapterhorn z15, `bun tools/terrain.ts grid` bearing 44.4: 3.8–4.2 m above
 * the path); the gable's coping rises to 4.6 m. Only the two portals are
 * drawn, each with 3 m of barrel behind its face; the middle is under the
 * embankment.
 *
 * Evidence
 * - OSM (ODbL): way/1498375011, way/5673843.
 * - Published (NYC Parks; Prospect Park Alliance): built 1867, among the
 *   park's oldest arches.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-east-wood-arch/photos), EVIDENCE:
 *   Epicgenius, "Prospect Park Brooklyn Feb 2019 102.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Feb_2019_102.jpg
 *     (a portal square on: used for every proportion below);
 *   Epicgenius, "Prospect Park Brooklyn Mar 2019 09.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Mar_2019_09.jpg
 *     (a portal at an angle: the wing walls, the gable);
 *   Epicgenius, "Prospect Park Brooklyn Feb 2019 100.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect_Park_Brooklyn_Feb_2019_100.jpg
 *     (from down the path: the arch in its cutting under the drive's fence);
 *   Dave Smith, "East Wood Arch in Prospect Park from west.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:East_Wood_Arch_in_Prospect_Park_from_west.jpg
 *     (the west portal).
 * - Estimated from the square-on photo, scaled so the gable's apex stands
 *   0.6 m above the terrain's 4.0 m roadway: span 5.4 m; springing 0.95 m
 *   on the jamb blocks; crown 3.1 m; 13 voussoirs 1.3 m long (the keystone reaching the coping); the coping
 *   0.45 m deep, level at 3.75 m and rising in a gable 3 m either side of
 *   the centre to 4.6 m; the faces 12 m long.
 *
 * Simplified: rock-facing, the wall stones' own red/buff mix (drawn buff)
 * and the brick coursing are plain.
 *
 * Doubts: the two portals are drawn alike (the photos show both with the
 * same gable and voussoirs); the wing walls' length into the banks is
 * estimated. No lidar.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { band, box, profile, qn } from './nyc-greyshot-arch'
import { barrel, offsetPr, openFace, prNormals, type Pr } from './nyc-balcony-bridge'
import { kinked } from './nyc-endale-arch'

function build() {
  const face = new Part(), red = new Part(), buff = new Part(), brick = new Part(), fill = new Part()
  const HY = 10.5, T = 0.8, W = 6.0, G = 3.0, PORTAL = 3, NV = 13
  const A = 2.7, RISE = 2.15, SPR = 0.95, SIDE = 3.75, APEX = 4.6, COP = 0.45, FILL = 3.7, VOUS = 1.3
  const top = (x: number) => SIDE + Math.max(0, (APEX - SIDE) * (1 - Math.abs(x) / G))
  const arch: Pr = profile('ellipse', A, RISE, SPR, NV * 2).map((p): [number, number] => [p[0], p[1]])
  const pr = kinked([[-A, 0], ...arch, [A, 0]], [-G, 0, G])
  const archK = pr.slice(1, -1)
  const out = offsetPr(arch, VOUS), nr = prNormals(arch)
  const xs = [...new Set([-W, -G, ...archK.map((p) => p[0]), G, W])].sort((p, q) => p - q)

  for (const s of [-1, 1]) {
    const y = s * HY, yi = s * (HY - T), nf: V3 = [0, s, 0]
    openFace(face, y, s, pr, -W, W, top, 3)
    // the voussoirs, alternating red brownstone and buff sandstone (keystone red)
    const yr = y + s * 0.07
    for (let i = 0; i < arch.length - 1; i++) {
      const P = Math.floor(i / 2) % 2 === 0 ? red : buff
      const [x0, z0] = arch[i], [x1, z1] = arch[i + 1], [u0, w0] = out[i], [u1, w1] = out[i + 1]
      qn(P, [x0, yr, z0], [x1, yr, z1], [u1, yr, w1], [u0, yr, w0], nf)
      const nx = (nr[i][0] + nr[i + 1][0]) / 2, nz = (nr[i][1] + nr[i + 1][1]) / 2
      qn(P, [x0, y, z0], [x1, y, z1], [x1, yr, z1], [x0, yr, z0], [-nx, 0, -nz])
      qn(P, [u0, y, w0], [u1, y, w1], [u1, yr, w1], [u0, yr, w0], [nx, 0, nz])
      if (i % 2 === 1 || i === 0) {
        const j = i % 2 === 1 ? i + 1 : 0, [xa, za] = arch[j], [ua, wa] = out[j]
        qn(P, [xa, y, za], [ua, y, wa], [ua, yr, wa], [xa, yr, za], [nr[j][1], 0, -nr[j][0]])
      }
    }
    // the jamb blocks under the springing, proud of the face
    for (const sx of [-1, 1]) {
      const x0 = sx * A, x1 = sx * (A + 1.0), lo = Math.min(x0, x1), hi = Math.max(x0, x1)
      box(buff, lo, hi, Math.min(y, y + s * 0.12), Math.max(y, y + s * 0.12), 0, SPR)
    }
    // the coping: level on the wings, gabled over the arch
    band(buff, s, HY, 0.15, [-W, -G, 0, G, W], (x) => top(x) - COP, top)
    // the wall top over its thickness, the inner face above the infill, ends
    for (let i = 0; i + 1 < xs.length; i++) {
      const p = xs[i], q = xs[i + 1]
      qn(buff, [p, y, top(p)], [q, y, top(q)], [q, yi, top(q)], [p, yi, top(p)], [0, 0, 1])
      qn(face, [p, yi, FILL], [q, yi, FILL], [q, yi, top(q)], [p, yi, top(p)], [0, -s, 0])
    }
    const y1 = s * (HY - PORTAL)
    for (const sx of [-1, 1]) qn(face, [sx * W, y, 0], [sx * W, y1, 0], [sx * W, y1, top(sx * W)], [sx * W, y, top(sx * W)], [sx, 0, 0])
    // the barrel behind the face: brick soffit, sandstone jamb walls
    const ya = Math.min(y, y1), yb = Math.max(y, y1)
    barrel(brick, arch, ya, yb)
    barrel(buff, [[-A, 0], [-A, SPR]], ya, yb)
    barrel(buff, [[A, SPR], [A, 0]], ya, yb)
    // the infill under the drive (asphalt grey) and the wall that closes it
    qn(fill, [-W, yi, FILL], [W, yi, FILL], [W, y1, FILL], [-W, y1, FILL], [0, 0, 1])
    openFace(face, y1, -s, [[-A, 0], ...arch, [A, 0]], -W, W, () => FILL, 1)
  }

  finishModel('East Wood Arch', 'nyc-east-wood-arch', [
    { part: face, material: { name: 'stone', color: 0xb2ac97, roughness: 0.9 } },
    { part: red, material: { name: 'brownstone', color: 0xb08377, roughness: 0.9 } },
    { part: buff, material: { name: 'sandstone', color: 0xc6bfa6, roughness: 0.9 } },
    { part: brick, material: { name: 'brick', color: 0xab6e5c, roughness: 0.9 } },
    { part: fill, material: { name: 'asphalt', color: 0x8e8e8c, roughness: 0.95 } },
  ], { bearing: 44.4, osm: 'way/1498375011', height: APEX }, 5000)
}

if (import.meta.main) build()
