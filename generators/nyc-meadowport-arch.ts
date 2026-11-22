/**
 * Meadowport Arch, Prospect Park, Brooklyn (Calvert Vaux and Frederick Law
 * Olmsted, 1870) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-meadowport-arch.ts
 *
 * Frame (mesh.ts map frame): y along the barrel toward its Long Meadow end
 * (bearing 155.5°, the placement's bearing: the long sides of OSM's tunnel
 * outline), x across it, z up, metres. z = 0 is the footpath under the
 * arch, the lowest ground under the footprint. Anchor: the centroid of OSM
 * way/1481639639 (man_made=tunnel, "Meadowport Arch", 36 m by 9.6 m),
 * -73.970693 40.670711. A tunnel outline is not a building, so `replaces`
 * is empty.
 *
 * The barrel runs under the embankment at the Prospect Park West entrance
 * (map terrain over it 5.2–5.4 m above the path). At its Long Meadow end the
 * path forks (OSM footways way/20954043 south to the meadow and
 * way/701424165 east, both starting at the tunnel's end, and the terrain's
 * two low cuts there), and the arch has its famous double portal: two
 * arched faces at right angles, each under a curved hood, meeting at a
 * tall pier with a domed cap and a flared foot, with smaller domed piers at
 * their outer ends. The other end (toward the entrance) has a single
 * hooded portal. Only the three portals are drawn, each with 2.5–3 m of
 * barrel behind it; the middle is under the terrain. No road surface is
 * drawn (the top here is embankment, not a drive); the portals' infill
 * stops at 4.3 m, 0.3 m under the wall tops, in asphalt grey.
 *
 * Evidence
 * - OSM (ODbL): way/1481639639, footways way/701424162 (through the
 *   tunnel), way/20954043 and way/701424165 (the fork).
 * - Map terrain (Mapterhorn z15, `bun tools/terrain.ts grid`, bearing
 *   155.5): the two cuts at the meadow end (straight on, and to the ENE),
 *   the single cut at the entrance end, the embankment at 5.2–5.4 m.
 * - Published (NYC Parks; Prospect Park Alliance; Wikipedia "Prospect
 *   Park"): built 1868–70 to Vaux and Olmsted's design, sandstone, the
 *   double-hooded portal facing the Long Meadow; timber-lined barrel.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-meadowport-arch/photos), EVIDENCE:
 *   Dogears, "Meadowpoint arch.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Meadowpoint_arch.jpg
 *     (the meadow-end portal facing the meadow, square on: arch, voussoirs,
 *     curved hood, the corner pier with its dome and flared foot; used for
 *     every proportion below);
 *   Robert N. Dennis collection stereographs (NYPL), public domain:
 *     https://commons.wikimedia.org/wiki/File:Meadowport_Arch,_from_Robert_N._Dennis_collection_of_stereoscopic_views.jpg
 *     https://commons.wikimedia.org/wiki/File:Meadow_Port_Arches,_from_Robert_N._Dennis_collection_of_stereoscopic_views.jpg
 *     (the double portal from the meadow: two hooded arches at an angle,
 *     the tall central pier, the smaller domed end piers);
 *   Intrepidor, "Walkway - Prospect Park, Brooklyn New York City.JPG",
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Walkway_-_Prospect_Park,_Brooklyn_New_York_City.JPG
 *     (the single portal at the entrance end: the same hooded arch).
 * - Estimated from the Dogears photo, scaled so the face's wall top beside
 *   the hood is 4.6 m (70 px/m): span 5.3 m; springing 0.85 m; crown
 *   4.0 m (slightly stilted ellipse); voussoirs 1.1 m; the hood a band
 *   0.7 m deep, standing 0.3 m proud, concentric with the arch, its top 5.85 m over the crown,
 *   meeting the level wall top 3 m either side of the centre; the corner
 *   pier 1.2 m square, its cap at 5.3 m, dome to 6.3 m, its foot flaring
 *   to 3.0 m square from 3.2 m up; the end piers 0.9 m, domes to 5.6 m.
 *
 * Simplified: the rock-faced voussoirs and plinth, the carved panels in
 * the spandrels and the barrel's ribbed lining are plain.
 *
 * Doubts: the second meadow-end portal (facing ENE) is placed from the
 * terrain's cut and the OSM fork, at right angles to the first; the
 * stereographs show the angle but no plan was found. The entrance-end
 * portal's wings and the faces' exact lengths are estimated. No lidar.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { band, profile, qn } from './nyc-greyshot-arch'
import { barrel, hull, openFace, ring, type Pr } from './nyc-balcony-bridge'
import { kinked } from './nyc-endale-arch'

const A = 2.65, SPR = 0.85, RISE = 3.15, WT = 4.6, H = 1.85, HOOD = 0.7, T = 0.9, FILL = 4.3

/** Copy src into dst, turned by angle (counter-clockwise, map frame) and moved to (ox, oy). */
function place(src: Part, dst: Part, angle: number, ox: number, oy: number) {
  const c = Math.cos(angle), s = Math.sin(angle)
  for (let i = 0; i < src.pos.length; i += 3) {
    // glTF (X, Y, Z) = map (x, z, -y)
    const x = src.pos[i], y = -src.pos[i + 2], z = src.pos[i + 1]
    dst.pos.push(x * c - y * s + ox, z, -(x * s + y * c + oy))
    const nx = src.nrm[i], ny = -src.nrm[i + 2], nz = src.nrm[i + 1]
    dst.nrm.push(nx * c - ny * s, nz, -(nx * s + ny * c))
  }
  dst.uv.push(...src.uv)
}

/** The wall top: level, rising under the hood over the arch. */
const top = (x: number) => {
  const u = x / (A + H)
  return Math.abs(u) < 1 ? Math.max(WT, SPR + (RISE + H) * Math.sqrt(1 - u * u)) : WT
}

type PortalParts = { face: Part; trim: Part; lining: Part; fill: Part }

/**
 * One hooded portal in local coordinates: the face at y = 0 facing +y,
 * from x0 to x1, the barrel `depth` deep behind it.
 */
function portal(P: PortalParts, x0: number, x1: number, depth: number) {
  const arch = profile('ellipse', A, RISE, SPR, 14).map((p): [number, number] => [p[0], p[1]])
  const hoodXs: number[] = []
  for (let i = 0; i <= 16; i++) {
    const x = -(A + H) + (2 * (A + H) * i) / 16
    if (top(x) > WT + 1e-3 || Math.abs(x) < A + H - 1e-6) hoodXs.push(x)
  }
  const xs = [...new Set([x0, ...hoodXs.filter((x) => x > x0 && x < x1), x1])].sort((p, q) => p - q)
  const pr: Pr = kinked([[-A, 0], ...arch, [A, 0]], xs)
  // the face, outside the opening (stations follow the hood) and over it
  for (let i = 0; i + 1 < xs.length; i++) {
    const p = xs[i], q = xs[i + 1]
    for (const [lo, hi] of [[x0, -A], [A, x1]]) {
      const u = Math.max(p, lo), v = Math.min(q, hi)
      if (v - u > 1e-6) qn(P.face, [u, 0, 0], [v, 0, 0], [v, 0, top(v)], [u, 0, top(u)], [0, 1, 0])
    }
  }
  for (const x of [-A, A]) if (!xs.includes(x)) xs.push(x)
  xs.sort((p, q) => p - q)
  for (let i = 0; i + 1 < pr.length; i++) {
    const [u, zu] = pr[i], [v, zv] = pr[i + 1]
    if (v - u > 1e-6) qn(P.face, [u, 0, zu], [v, 0, zv], [v, 0, top(v)], [u, 0, top(u)], [0, 1, 0])
  }
  // voussoirs, the hood moulding (continuing level along the wall), a plinth course
  ring(P.trim, 0, 1, arch, 1.1, 0.06)
  band(P.trim, 1, 0, 0.32, xs, (x) => top(x) - HOOD, top)
  for (const [lo, hi] of [[x0, -A], [A, x1]]) band(P.trim, 1, 0, 0.1, [lo, hi], () => 0, () => SPR)
  // the wall top over its thickness, inner face above the infill, ends
  for (let i = 0; i + 1 < xs.length; i++) {
    const p = xs[i], q = xs[i + 1]
    qn(P.trim, [p, 0, top(p)], [q, 0, top(q)], [q, -T, top(q)], [p, -T, top(p)], [0, 0, 1])
    qn(P.face, [p, -T, FILL], [q, -T, FILL], [q, -T, top(q)], [p, -T, top(p)], [0, -1, 0])
  }
  for (const x of [x0, x1]) qn(P.face, [x, 0, 0], [x, -depth, 0], [x, -depth, top(x)], [x, 0, top(x)], [Math.sign(x), 0, 0])
  // the barrel: lining over the arch, stone jambs
  barrel(P.lining, arch, -depth, 0)
  barrel(P.trim, [[-A, 0], [-A, SPR]], -depth, 0)
  barrel(P.trim, [[A, SPR], [A, 0]], -depth, 0)
  // the infill (asphalt grey) and the wall closing it where the barrel stops
  qn(P.fill, [x0, -T, FILL], [x1, -T, FILL], [x1, -depth, FILL], [x0, -depth, FILL], [0, 0, 1])
  openFace(P.face, -depth, -1, [[-A, 0], ...arch, [A, 0]], x0, x1, () => FILL, 1)
}

const sq = (cx: number, cy: number, h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
const oct = (cx: number, cy: number, r: number, z: number): V3[] =>
  Array.from({ length: 10 }, (_, k): V3 => [cx + r * Math.cos((k * Math.PI) / 5), cy + r * Math.sin((k * Math.PI) / 5), z])

/** A square pier (flared at the foot if asked) with a cap band and a domed top. */
function pier(p: Part, cx: number, cy: number, h: number, cap: number, dome: number, flare: number) {
  const foot = flare > 0
    ? [sq(cx, cy, h + flare, 0), sq(cx, cy, h + flare * 0.5, 1.0), sq(cx, cy, h + flare * 0.18, 2.2), sq(cx, cy, h, 3.2)]
    : [sq(cx, cy, h + 0.08, 0), sq(cx, cy, h + 0.08, 0.7), sq(cx, cy, h, 0.7)]
  hull(p, [...foot, sq(cx, cy, h, cap - 0.35)])
  hull(p, [sq(cx, cy, h + 0.12, cap - 0.35), sq(cx, cy, h + 0.12, cap)], true)
  const r = h * 0.85, dz = dome - cap
  hull(p, [oct(cx, cy, r, cap), oct(cx, cy, r, cap + dz * 0.2), oct(cx, cy, r * 1.05, cap + dz * 0.28), oct(cx, cy, r * 0.95, cap + dz * 0.5),
    oct(cx, cy, r * 0.75, cap + dz * 0.7), oct(cx, cy, r * 0.4, cap + dz * 0.86), oct(cx, cy, 0.1, cap + dz * 0.95), oct(cx, cy, 0.08, dome)])
}

function build() {
  const face = new Part(), trim = new Part(), lining = new Part(), fill = new Part(), dome = new Part()
  const portals: [number, number, number, number, number, number][] = [
    // angle, origin x, origin y, x0, x1, barrel depth
    [0, 0.3, 17.9, -5.1, 4.5, 3], // meadow end, facing the meadow
    [Math.PI / 2, -5.3, 12.2, -4.5, 5.1, 2.8], // meadow end, facing ENE
    [Math.PI, 0.3, -18.3, -5.3, 5.3, 3], // entrance end
  ]
  for (const [ang, ox, oy, x0, x1, d] of portals) {
    const L = { face: new Part(), trim: new Part(), lining: new Part(), fill: new Part() }
    portal(L, x0, x1, d)
    place(L.face, face, ang, ox, oy); place(L.trim, trim, ang, ox, oy); place(L.lining, lining, ang, ox, oy); place(L.fill, fill, ang, ox, oy)
  }
  // the tall corner pier between the two meadow portals, and the end piers
  pier(dome, -4.8, 17.3, 0.6, 5.3, 6.3, 0.9)
  pier(dome, 4.85, 17.65, 0.45, 4.9, 5.6, 0)
  pier(dome, -5.05, 7.7, 0.45, 4.9, 5.6, 0)

  finishModel('Meadowport Arch', 'nyc-meadowport-arch', [
    { part: face, material: { name: 'stone', color: 0xb9b2a0, roughness: 0.9 } },
    { part: trim, material: { name: 'sandstone', color: 0xc9c0aa, roughness: 0.9 } },
    { part: dome, material: { name: 'piers', color: 0xc4baa3, roughness: 0.9 } },
    { part: lining, material: { name: 'timber', color: 0x8c7c68, roughness: 0.85 } },
    { part: fill, material: { name: 'asphalt', color: 0x8e8e8c, roughness: 0.95 } },
  ], { bearing: 155.5, osm: 'way/1481639639', height: 6.3 }, 5000)
}

if (import.meta.main) build()
