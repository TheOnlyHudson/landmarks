/**
 * Endale Arch, Prospect Park, Brooklyn (Calvert Vaux and Frederick Law
 * Olmsted, 1867) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-endale-arch.ts
 *
 * This file also exports `pointedPr` (a blunt pointed arch profile with
 * jambs) and `kinked` (adds stations to a profile where the wall top
 * breaks), used by nyc-meadowport-arch. Its own build runs only when it is
 * the main module.
 *
 * Frame (mesh.ts map frame): y along the barrel, toward the north-north-east
 * face (bearing 10.4°, the placement's bearing: the long sides of OSM's
 * tunnel outline), x across it, z up, metres. z = 0 is the footpath under
 * the arch, the lowest ground under the footprint. Anchor: the centroid of
 * OSM way/1481639638 (man_made=tunnel, "Endale Arch", 24.2 m portal to
 * portal by 9.2 m), -73.969059 40.671085. A tunnel outline is not a
 * building, so `replaces` is empty.
 *
 * The arch carries the park drive at the Grand Army Plaza entrance. No road
 * surface is drawn: the portals' infill stops at 4.5 m, 0.3 m under the
 * map's plateau over the barrel (Mapterhorn z15, `bun tools/terrain.ts grid`
 * bearing 11.8: 4.7–5.0 m above the path), and the central block's cornice
 * stands 0.6 m above it as the parapet, as in the photos (people and a
 * timber fence stand behind it). Only the two portals are drawn, each with
 * 3 m of barrel behind its face; the middle of the barrel is under the
 * terrain's embankment. The wing walls run into the cutting's banks
 * (terrain 2–4.5 m beside the portals).
 *
 * Evidence
 * - OSM (ODbL): tunnel outline way/1481639638 and the footway through it
 *   way/603157050 (tunnel=yes, bearing 11.8°).
 * - Published (NYC Parks; Prospect Park Alliance; Wikipedia "Prospect
 *   Park"): built 1867 to Vaux and Olmsted's design, the first structure
 *   finished in the park; brownstone and Berea sandstone; the barrel's
 *   timber lining restored in 2020.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-endale-arch/photos), EVIDENCE:
 *   Jim.henderson, "Endale Arch PP sun jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Endale_Arch_PP_sun_jeh.jpg
 *     (a face square on: the blunt pointed arch, the long voussoirs, the
 *     gabled central block with its carved finial, the lower wing walls,
 *     the jamb pedestals; used for every proportion below);
 *   Dogears, "Prospect-park-bridge.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Prospect-park-bridge.jpg
 *     (the same face at an angle: the wing walls' cornice stepping down
 *     from the central block, the barrel's depth);
 *   Rhododendrites, "Restored Endale arch (03487).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Restored_Endale_arch_(03487).jpg
 *     (the other face at dusk after the restoration: the same gable and
 *     finial, the light sandstone rim and pedestals, the ribbed timber
 *     lining of the barrel).
 * - Estimated from the Henderson photo, scaled so the cornice stands 0.6 m
 *   over the terrain's 4.8 m roadway: span 7.3 m; the arch springs 0.8 m
 *   above the path from light sandstone pedestals, its crown at 4.2 m, a
 *   blunt point (two elliptical arcs whose centres sit 2.5 m past the
 *   centre line, a Tudor-like point); voussoirs 1.1 m deep, a light rim 0.3 m; the central
 *   block 8.4 m wide, its cornice at 5.4 m rising in a shallow gable to
 *   6.0 m over the middle 4.4 m, the finial to 6.9 m; the wing walls'
 *   cornice at 4.5 m, the faces 15 m long overall.
 *
 * Simplified: the carved finial (three rosettes on an anthemion) is a
 * plain rounded block; the face's coursing, the iron brackets beside the
 * faces and the timber ribs are left out.
 *
 * Doubts: no lidar (the machine is overloaded; the terrain and photos
 * agree on the 4.8 m drive). The two faces are drawn alike, as the two
 * face photos show. The stone colours: the faces read buff grey in
 * daylight with browner voussoirs; the "polychrome" brownstone banding is
 * drawn as the warmer voussoir ring and the light rim, cornice and
 * pedestals. The wing walls' length into the banks is estimated.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { band, bevelBox, box, qn, steps } from './nyc-greyshot-arch'
import { barrel, openFace, ring, type Pr } from './nyc-balcony-bridge'

/**
 * A blunt pointed arch of half-span a, crown at spring + rise: two
 * elliptical arcs whose centres sit e past the centre line, with vertical
 * jambs from the ground. Points run from (−a, 0) to (a, 0).
 */
export function pointedPr(a: number, rise: number, spring: number, e: number, n = 8): Pr {
  const A = a + e, c = -e / A, B = rise / Math.sqrt(1 - c * c), tc = Math.acos(c)
  const left: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const t = Math.PI - ((Math.PI - tc) * i) / n
    left.push([e + A * Math.cos(t), spring + B * Math.sin(t)])
  }
  left[0] = [-a, spring]; left[n] = [0, spring + rise]
  const right = left.slice(0, n).reverse().map(([x, z]): [number, number] => [-x, z])
  return [[-a, 0], ...left, ...right, [a, 0]]
}

/** The profile with stations added at xs (where the wall top breaks). */
export function kinked(pr: Pr, xs: number[]): Pr {
  const out: Pr = [pr[0]]
  for (let i = 0; i + 1 < pr.length; i++) {
    const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
    for (const x of xs) if (x > x0 + 1e-6 && x < x1 - 1e-6) out.push([x, z0 + ((z1 - z0) * (x - x0)) / (x1 - x0)])
    out.push(pr[i + 1])
  }
  return out
}

/** A triangle wound to face n. */
export function tn(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}

/** A prism of thickness 2·hy about y = cy from a convex outline in (x, z), counter-clockwise. */
export function prism(p: Part, cy: number, hy: number, pts: [number, number][]) {
  const n = pts.length
  for (const s of [-1, 1]) {
    const y = cy + s * hy
    for (let i = 1; i + 1 < n; i++) {
      const a: V3 = [pts[0][0], y, pts[0][1]], b: V3 = [pts[i][0], y, pts[i][1]], c: V3 = [pts[i + 1][0], y, pts[i + 1][1]]
      tn(p, a, b, c, [0, s, 0])
    }
  }
  for (let i = 0; i < n; i++) {
    const [x0, z0] = pts[i], [x1, z1] = pts[(i + 1) % n]
    qn(p, [x0, cy - hy, z0], [x1, cy - hy, z1], [x1, cy + hy, z1], [x0, cy + hy, z0], [z1 - z0, 0, -(x1 - x0)])
  }
}

// ===========================================================================
// Endale Arch
// ===========================================================================

function build() {
  const face = new Part(), vous = new Part(), sand = new Part(), wood = new Part(), fill = new Part()
  const HY = 12.1, T = 0.8, W = 7.5, C = 4.2, G = 2.2, PORTAL = 3
  const A = 3.65, RISE = 3.4, SPRING = 0.8, FILL = 4.5, WING = 4.5, CORN = 5.4, GABLE = 0.6
  const top = (x: number) => (Math.abs(x) <= C + 1e-6 ? CORN + Math.max(0, GABLE * (1 - Math.abs(x) / G)) : WING)
  const pr = kinked(pointedPr(A, RISE, SPRING, 2.5, 8), [-G, G])
  const arch = pr.slice(1, -1)
  const cx = [-C, -G, 0, G, C]
  // stations for the wall tops: the central block's breaks and every arch point
  const xsC = [...new Set([...cx, ...arch.map((p) => p[0])])].sort((p, q) => p - q)

  for (const s of [-1, 1]) {
    const y = s * HY, yi = s * (HY - T), nf: V3 = [0, s, 0]
    // the central block's face with the opening, and the lower wing walls
    openFace(face, y, s, pr, -C, C, top, 2)
    for (const [x0, x1] of [[-W, -C], [C, W]]) qn(face, [x0, y, 0], [x1, y, 0], [x1, y, WING], [x0, y, WING], nf)
    // voussoirs (warmer brownstone) and the light sandstone rim
    ring(vous, y, s, arch, 1.1, 0.04)
    ring(sand, y, s, arch, 0.3, 0.1)
    // the jamb pedestals with their impost caps
    for (const sx of [-1, 1]) {
      const x0 = sx * A, x1 = sx * (A + 0.45)
      const lo = Math.min(x0, x1), hi = Math.max(x0, x1)
      box(sand, lo, hi, Math.min(y, y + s * 0.14), Math.max(y, y + s * 0.14), 0, SPRING - 0.15)
      box(sand, lo - (sx < 0 ? 0.08 : 0), hi + (sx > 0 ? 0.08 : 0), Math.min(y - s * 0.02, y + s * 0.2), Math.max(y - s * 0.02, y + s * 0.2), SPRING - 0.15, SPRING)
    }
    // the cornices: gabled over the central block, level on the wings
    band(sand, s, HY, 0.22, cx, (x) => top(x) - 0.35, top)
    for (const xs of [[-W, -C], [C, W]]) band(sand, s, HY, 0.2, xs, () => WING - 0.32, () => WING)
    // the wall tops over their thickness, inner faces and ends
    for (let i = 0; i + 1 < xsC.length; i++) {
      const p = xsC[i], q = xsC[i + 1]
      qn(sand, [p, y, top(p)], [q, y, top(q)], [q, yi, top(q)], [p, yi, top(p)], [0, 0, 1])
      qn(face, [p, yi, FILL], [q, yi, FILL], [q, yi, top(q)], [p, yi, top(p)], [0, -s, 0])
    }
    for (const sx of [-1, 1]) {
      const x0 = sx * C, x1 = sx * W
      qn(sand, [x0, y, WING], [x1, y, WING], [x1, yi, WING], [x0, yi, WING], [0, 0, 1])
      qn(face, [x0, yi, 0], [x1, yi, 0], [x1, yi, WING], [x0, yi, WING], [0, -s, 0])
      qn(face, [x1, y, 0], [x1, yi, 0], [x1, yi, WING], [x1, y, WING], [sx, 0, 0])
      qn(face, [x0, y, WING], [x0, yi, WING], [x0, yi, CORN], [x0, y, CORN], [sx, 0, 0])
    }
    // the carved finial on the gable: a base and a rounded block
    const yf = s * (HY - 0.3)
    bevelBox(sand, 0, yf, 0.4, 0.3, CORN + GABLE - 0.1, CORN + GABLE + 0.12, 0.05)
    prism(sand, yf, 0.2, [[-0.36, 6.12], [0.36, 6.12], [0.44, 6.42], [0.32, 6.72], [0, 6.9], [-0.32, 6.72], [-0.44, 6.42]])
    // the barrel behind the face: timber soffit, sandstone jamb walls
    const y0 = s * HY, y1 = s * (HY - PORTAL)
    barrel(wood, arch, Math.min(y0, y1), Math.max(y0, y1))
    barrel(sand, [[-A, 0], [-A, SPRING]], Math.min(y0, y1), Math.max(y0, y1))
    barrel(sand, [[A, SPRING], [A, 0]], Math.min(y0, y1), Math.max(y0, y1))
    // the infill under the roadway (asphalt grey), its sides, and the wall
    // that closes it around the opening where the barrel stops
    qn(fill, [-C, yi, FILL], [C, yi, FILL], [C, y1, FILL], [-C, y1, FILL], [0, 0, 1])
    for (const sx of [-1, 1]) qn(face, [sx * C, yi, 0], [sx * C, y1, 0], [sx * C, y1, FILL], [sx * C, yi, FILL], [sx, 0, 0])
    openFace(face, y1, -s, pr, -C, C, () => FILL, 1)
  }

  finishModel('Endale Arch', 'nyc-endale-arch', [
    { part: face, material: { name: 'stone', color: 0xb0ab9c, roughness: 0.9 } },
    { part: vous, material: { name: 'brownstone', color: 0xa69a86, roughness: 0.9 } },
    { part: sand, material: { name: 'sandstone', color: 0xcbbfa5, roughness: 0.9 } },
    { part: wood, material: { name: 'timber', color: 0xb48a5a, roughness: 0.85 } },
    { part: fill, material: { name: 'asphalt', color: 0x8e8e8c, roughness: 0.95 } },
  ], { bearing: 10.4, osm: 'way/1481639638', height: 6.9 }, 5000)
  void steps
}

if (import.meta.main) build()
