/**
 * Fort Pitt Block House (1764, built under Col. Henry Bouquet as a redoubt
 * outside Fort Pitt's moat; the oldest building in Pittsburgh) — procedural,
 * CC0-1.0, no textures.
 * bun generators/pit-fort-pitt-block-house.ts
 *
 * A small five-sided brick redoubt: a fieldstone base, a dark timber sill, brick
 * walls with round loopholes (closed by iron plates), a dark timber band
 * near the top, under a pentagonal hipped roof of weathered wood shingles that
 * rises to a point; one plain wooden door with a brick arch on the north
 * face.
 *
 * Frame: x east, y north, z up, metres; origin at the OSM outline's
 * centroid, on the ground. Bearing 0.
 *
 * Sources:
 * - OSM: way/109499956 (building=yes, historic=building, wikidata
 *   Q5471838), a pentagon of 58.6 m², sides 5.2–7.8 m; used as the wall
 *   line. The Fort Pitt Museum (way/109499955) is a separate building and
 *   not covered.
 * - Lidar, USGS 3DEP PA_WesternPA_2_2019 (flown 2019), 0.5 m grid: ground
 *   flat (within 0.2 m) at 220.7 m NAVD88; eave edges 4.3 m above it, the
 *   roof's apex 6.8 m. The lidar roof sits about 1.2 m south of the OSM
 *   outline (an offset in the OSM trace; the shape agrees), so the model
 *   keeps the OSM footprint the map hides.
 * - Published (Wikipedia "Fort Pitt Block House"; NRHP 1970; Fort Pitt
 *   Society of the DAR): built 1764, brick, five-sided, two rows of
 *   loopholes, owned by the DAR since 1894, restored 2013 (cedar shingle
 *   roof).
 * - Photos (Wikimedia Commons, Cbaile19, CC0): "Fort Pitt Blockhouse,
 *   2026-10-22" and "-1" to "-11": every side, the door face head-on (-5),
 *   the stone base, the two dark timber bands, round loopholes two to a
 *   face, the shingle roof's pitch and colour. The door face looks toward
 *   Mount Washington's Grandview apartments in "-1" to "-3", so it faces
 *   north; the other faces are placed by the order the photos go round.
 *
 * Estimated, from "-10" (a face square-on) scaled to the lidar eave: the
 * fieldstone base (1.25 m), the timber sill over it (to 1.55 m), the timber
 * band (3.65–3.95 m) with brick above it to the eave; the overhang
 * (0.5 m); the round iron loophole covers (0.33 m across, drawn 0.5 m so
 * they read; centred 2.15 m up); door 1.0 × 1.9 m. The timber bands' slot
 * loopholes are left out. Only one door is
 * drawn; the photos show no other.
 * Colour from the sunlit photos: brick #85584b lifted to #946558; base
 * fieldstone #8f8577 to #a49a8b; timber bands #463c35 to #5f554c; shingles
 * #6e665e to #837b72; door oak #6a4c37 to #7d5d45.
 */
import { Part, cross, sub, writeGlb, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'

// The OSM outline about its centroid, counter-clockwise from above.
const PLAN: [number, number][] = [[5.01, 2.13], [-0.49, 4.43], [-4.99, 1.93], [-3.19, -2.97], [2.01, -5.07]]
const BASE = 1.25, SILL = 1.55, STRING0 = 3.65, STRING1 = 3.95, EAVE = 4.3, APEX = 6.8, OVER = 0.5

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) { p.tri(a, b, c); p.tri(a, c, d) } else { p.tri(a, c, b); p.tri(a, d, c) }
}

/** The plan grown outward by d (mitred). */
function offset(plan: [number, number][], d: number): [number, number][] {
  const n = plan.length
  return plan.map((_, i) => {
    const [ax, ay] = plan[(i + n - 1) % n], [bx, by] = plan[i], [cx, cy] = plan[(i + 1) % n]
    const n1 = norm([by - ay, -(bx - ax), 0]), n2 = norm([cy - by, -(cx - bx), 0])
    const m = norm([n1[0] + n2[0], n1[1] + n2[1], 0]), k = d / dot(m, n1)
    return [bx + m[0] * k, by + m[1] * k]
  })
}

/** Walls of a prism band between z0 and z1 over a plan, with an optional top ledge back to `inner`. */
function band(p: Part, plan: [number, number][], z0: number, z1: number, top?: [number, number][], bottom?: [number, number][]) {
  const n = plan.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = plan[i], [bx, by] = plan[(i + 1) % n]
    quad(p, [ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1], norm([by - ay, -(bx - ax), 0]))
    if (top) { const [cx, cy] = top[(i + 1) % n], [dx, dy] = top[i]; quad(p, [ax, ay, z1], [bx, by, z1], [cx, cy, z1], [dx, dy, z1], [0, 0, 1]) }
    if (bottom) { const [cx, cy] = bottom[(i + 1) % n], [dx, dy] = bottom[i]; quad(p, [ax, ay, z0], [bx, by, z0], [cx, cy, z0], [dx, dy, z0], [0, 0, -1]) }
  }
}

/** A flat shape on wall i, centred at fraction t along it, given as (u, z) points around its outline. */
function onWall(p: Part, i: number, t: number, shape: [number, number][], out = 0.03) {
  const [ax, ay] = PLAN[i], [bx, by] = PLAN[(i + 1) % PLAN.length]
  const L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L
  const nx = uy, ny = -ux
  const cx = ax + (bx - ax) * t + nx * out, cy = ay + (by - ay) * t + ny * out
  const pts: V3[] = shape.map(([u, z]) => [cx + ux * u, cy + uy * u, z])
  const nrm: V3 = [nx, ny, 0]
  for (let k = 1; k < pts.length - 1; k++) {
    const [a, b, c] = [pts[0], pts[k], pts[k + 1]]
    if (dot(cross(sub(b, a), sub(c, a)), nrm) >= 0) p.tri(a, b, c); else p.tri(a, c, b)
  }
}
const disc = (r: number, z: number, n = 10): [number, number][] =>
  Array.from({ length: n }, (_, k) => [r * Math.cos((2 * Math.PI * k) / n), z + r * Math.sin((2 * Math.PI * k) / n)])

async function build() {
  const brick = new Part(), stone = new Part(), timber = new Part(), roof = new Part(), door = new Part()

  // Base, walls, string course, eave band.
  band(stone, offset(PLAN, 0.1), 0, BASE, offset(PLAN, 0.06))
  band(timber, offset(PLAN, 0.06), BASE, SILL, PLAN)
  band(brick, PLAN, SILL, STRING0)
  band(timber, offset(PLAN, 0.06), STRING0, STRING1, PLAN, PLAN)
  band(brick, PLAN, STRING1, EAVE)

  // Roof: a pentagonal pyramid from the eave line, grown by the overhang.
  const eave = offset(PLAN, OVER)
  band(roof, eave, EAVE - 0.15, EAVE, undefined, PLAN)
  const apex: V3 = [0, -0.3, APEX] // the lidar apex sits a little south of the outline's centroid, as the roof's faces are unequal
  for (let i = 0; i < eave.length; i++) {
    const [ax, ay] = eave[i], [bx, by] = eave[(i + 1) % eave.length]
    const a: V3 = [ax, ay, EAVE], b: V3 = [bx, by, EAVE]
    if (dot(cross(sub(b, a), sub(apex, a)), [0, 0, 1]) >= 0) roof.tri(a, b, apex); else roof.tri(a, apex, b)
  }

  // Door on the north face (wall 0), in a brick arch.
  const D_W = 1.0, D_H = 1.9
  const head = (r: number, z: number): [number, number][] => Array.from({ length: 7 }, (_, k) => [r * Math.cos((Math.PI * k) / 6), z + 0.25 * r * Math.sin((Math.PI * k) / 6)])
  onWall(brick, 0, 0.5, [[-D_W / 2 - 0.3, 0], [D_W / 2 + 0.3, 0], ...head(D_W / 2 + 0.3, D_H + 0.1)], 0.12)
  onWall(door, 0, 0.5, [[-D_W / 2, 0], [D_W / 2, 0], ...head(D_W / 2, D_H - 0.1)], 0.14)

  // Loopholes, two to a face (one either side of the door on its face).
  for (let i = 0; i < PLAN.length; i++) {
    const ts = i === 0 ? [0.17, 0.83] : [0.3, 0.7]
    for (const t of ts) onWall(timber, i, t, disc(0.25, 2.15), 0.04)
  }

  const BRICK: MaterialSpec = finish('blockhouse-brick', 0x946558)
  const STONE: MaterialSpec = finish('fieldstone', 0xa49a8b)
  const TIMBER: MaterialSpec = finish('dark-timber', 0x5f554c)
  const ROOF: MaterialSpec = finish('cedar-shingle', 0x837b72)
  const DOOR: MaterialSpec = finish('door-oak', 0x7d5d45)
  const parts = [
    { part: brick, material: BRICK }, { part: stone, material: STONE }, { part: timber, material: TIMBER },
    { part: roof, material: ROOF }, { part: door, material: DOOR },
  ]
  const glb = writeGlb('Fort Pitt Block House', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the ground' })
  await Bun.write(new URL('../models/pit-fort-pitt-block-house.glb', import.meta.url), glb)
  console.log(`pit-fort-pitt-block-house.glb: ${parts.reduce((n, { part }) => n + part.triangles, 0)} triangles, ${glb.length} bytes`)
}

if (import.meta.main) await build()
