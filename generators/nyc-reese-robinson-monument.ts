/**
 * Jackie Robinson and Pee Wee Reese Monument, Maimonides Park, Coney Island
 * (William Behrends, bronze, dedicated 1 November 2005) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-reese-robinson-monument.ts
 *
 * Map frame: x east, y north, z up, metres, the figures facing -y and the
 * model turned to the catalog bearing so they face the way they do in the
 * photos: bearing 10, so they face 190°, down the path that leaves the
 * paved circle round the drum toward Surf Avenue (NYS 2024 ortho). Anchor: OSM node/5400243839
 * (tourism=artwork, artist William Behrends, bronze). Not a building, so
 * the model replaces nothing.
 *
 * The scene: Reese, in a Brooklyn Dodgers uniform and cap, stands on
 * Robinson's left with his right arm round Robinson's shoulders, his left
 * arm down; Robinson stands square, a glove in his right hand at his hip,
 * looking ahead. Both a little over life size on a bronze ground plate, on a low,
 * wide granite drum carrying the plaques, in a round lawn with a paved
 * circle (the lawn and paving are the map's).
 *
 * Evidence
 * - OSM: node/5400243839 (name, artist, material bronze, start_date
 *   2005-11-01, subject Q221048 Robinson and Q182485 Reese).
 * - Wikipedia "Reese and Robinson Monument" (the pose and its story).
 * - Photos (Wikimedia Commons):
 *   - "Кони-Айленд MCU парк.jpg", Multiplicitous, CC BY-SA 3.0 (2012;
 *     the pair at three-quarter view, the drum and its plaques, people
 *     for scale)
 *   - "Coney Island Surf Ave Sep 2019 14.jpg", Epicgenius, CC BY-SA 4.0
 *     (the monument in its lawn circle in front of the ballpark's
 *     concourse, from the south-west)
 * - NYS orthophoto 2024 (orthos.its.ny.gov, public): the lawn circle and
 *   the statue's shadow, for the facing.
 *
 * Estimated, from the two photos against the people and the 1 m gates
 * beside it: the drum 2.6 × 1.9 m and 0.85 m high, the bronze plate
 * 0.1 m, the figures 1.95 m (Robinson) and 1.9 m (Reese) to the cap's top,
 * 0.56 m apart. Only two open photos exist, so the backs are drawn plain
 * and the faces, numbers and lettering are left out.
 */
import { Part, addGltfTriangles, cross, sub, len, type V3 } from './mesh'
import { finish } from './palette'
import { finishModel } from './nyc-570-lexington'

const TAU = Math.PI * 2
const unit = (v: V3): V3 => v.map((n) => n / (len(v) || 1)) as V3
const plus = (a: V3, b: V3): V3 => a.map((n, i) => n + b[i]) as V3
const scale = (a: V3, s: number): V3 => a.map((n) => n * s) as V3

// ------------------------------------------------------------------ helpers
// (smooth, oval, body, ellipsoid and tube as in nyc-duffy-square-statues.ts)

function smooth(target: Part, build: (p: Part) => void, crease = 70) {
  const p = new Part()
  build(p)
  addGltfTriangles(target, new Float32Array(p.pos), Uint32Array.from({ length: p.pos.length / 3 }, (_, i) => i), { creaseDegrees: crease })
}
function oval(c: V3, rx: number, ry: number, n = 12): V3[] {
  return Array.from({ length: n }, (_, i) => {
    const a = ((i + 0.5) / n) * TAU
    return [c[0] + rx * Math.cos(a), c[1] + ry * Math.sin(a), c[2]]
  })
}
/** A closed loft of horizontal rings, rows of [z, rx, ry, cx, cy]. */
function body(p: Part, rows: number[][], n = 12) {
  smooth(p, (mesh) => {
    const rings = rows.map(([z, rx, ry, cx = 0, cy = 0]) => oval([cx, cy, z], rx, ry, n))
    mesh.loft(rings)
    mesh.cap(rings[0], false)
    mesh.cap(rings[rings.length - 1], true)
  })
}
function ellipsoid(p: Part, c: V3, r: V3, n = 10, rows = 6) {
  smooth(p, (mesh) => {
    const rings = Array.from({ length: rows + 1 }, (_, j) => {
      const a = -Math.PI / 2 + (j / rows) * Math.PI
      const k = j === 0 || j === rows ? 0 : Math.cos(a)
      return oval([c[0], c[1], c[2] + r[2] * Math.sin(a)], r[0] * k, r[1] * k, n)
    })
    mesh.loft(rings)
  }, 80)
}
/** A rounded tapered limb along a path. */
function tube(p: Part, path: V3[], widths: number[], sides = 8) {
  const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  smooth(p, (mesh) => {
    let u: V3 | undefined
    const rings = path.map((c, i) => {
      const axis = unit(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(0, i - 1)]))
      const ref: V3 = u ?? (Math.abs(axis[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1])
      u = unit(sub(ref, scale(axis, dot(ref, axis))))
      const v = cross(axis, u)
      return Array.from({ length: sides }, (_, j) => {
        const a = (j / sides) * TAU
        return plus(c, plus(scale(u!, widths[i] * Math.cos(a)), scale(v, widths[i] * Math.sin(a))))
      })
    })
    mesh.loft(rings)
    mesh.cap(rings[0], false)
    mesh.cap(rings[rings.length - 1], true)
  })
}

const stone = new Part(), bronze = new Part()

// ------------------------------------------------------------------ the drum
// A low elliptical granite drum, its upper edge eased.
{
  const n = 24, rx = 1.3, ry = 0.95
  const rows: number[][] = [[0, rx, ry], [0.78, rx, ry], [0.85, rx - 0.06, ry - 0.06]]
  body(stone, rows, n)
}
const Z0 = 0.95 // top of the bronze ground plate
body(bronze, [[0.85, 0.95, 0.55], [Z0, 0.95, 0.55]], 16)

// ------------------------------------------------------------------ a ballplayer
/** One figure standing at (cx, 0) facing -y, `h` tall to the cap's top. */
function player(cx: number, h: number) {
  const k = h / 1.95
  const Z = (z: number) => Z0 + z * k
  // Legs: knickers to the knee, socks below; shoes.
  for (const s of [-1, 1]) {
    const x = cx + s * 0.13 * k
    ellipsoid(bronze, [x, -0.07, Z(0.05)], [0.07 * k, 0.15 * k, 0.06 * k], 8, 4)
    tube(bronze, [[x, 0, Z(0.05)], [x, 0, Z(0.5)], [x, 0.01, Z(0.62)], [cx + s * 0.12 * k, 0, Z(0.95)]], [0.065 * k, 0.075 * k, 0.1 * k, 0.12 * k])
  }
  // Torso in the jersey, belted.
  body(bronze, [
    [Z(0.9), 0.24 * k, 0.15 * k, cx, 0],
    [Z(1.05), 0.22 * k, 0.14 * k, cx, 0],
    [Z(1.3), 0.24 * k, 0.15 * k, cx, 0],
    [Z(1.52), 0.27 * k, 0.15 * k, cx, 0.01],
    [Z(1.6), 0.15 * k, 0.11 * k, cx, 0.01],
    [Z(1.64), 0.07 * k, 0.07 * k, cx, 0],
  ])
  // Head and cap with its bill forward.
  ellipsoid(bronze, [cx, -0.01, Z(1.74)], [0.1 * k, 0.12 * k, 0.13 * k])
  ellipsoid(bronze, [cx, 0, Z(1.84)], [0.11 * k, 0.12 * k, 0.07 * k], 10, 4)
  ellipsoid(bronze, [cx, -0.12 * k, Z(1.82)], [0.09 * k, 0.07 * k, 0.015 * k], 8, 2)
}

// Facing the viewer (s2), Robinson is on the left: the figures face -y, so
// he stands to the west (-x), on Reese's right, and Reese's right arm
// reaches behind him to his far shoulder. Robinson holds the glove at his
// right hip; Reese's left arm hangs.
const RX = -0.28, PX = 0.28
player(RX, 1.95)
player(PX, 1.9)
{
  const Z = (z: number) => Z0 + z
  // Robinson's left arm down; his right down to the glove at the hip.
  tube(bronze, [[RX + 0.26, 0, Z(1.48)], [RX + 0.3, 0.01, Z(1.15)], [RX + 0.28, -0.02, Z(0.85)]], [0.07, 0.065, 0.055])
  tube(bronze, [[RX - 0.26, 0, Z(1.48)], [RX - 0.31, 0.0, Z(1.15)], [RX - 0.3, -0.06, Z(0.9)]], [0.07, 0.065, 0.055])
  ellipsoid(bronze, [RX - 0.3, -0.1, Z(0.84)], [0.06, 0.12, 0.13], 8, 4)
}
{
  const k = 1.9 / 1.95, Z = (z: number) => Z0 + z * k
  // Reese's right arm behind Robinson's back to his far shoulder.
  tube(bronze, [[PX - 0.25, 0.02, Z(1.48)], [PX - 0.42, 0.14, Z(1.5)], [RX - 0.05, 0.16, Z(1.52)], [RX - 0.22, 0.05, Z(1.52)]], [0.07, 0.065, 0.06, 0.055])
  // His left arm hanging.
  tube(bronze, [[PX + 0.26, 0, Z(1.48)], [PX + 0.3, 0.01, Z(1.15)], [PX + 0.28, -0.02, Z(0.85)]], [0.07, 0.065, 0.055])
}

// Lit by the ballpark's lamps at night: the fronts most, the tops least.
const lit = (base: number) => (_p: V3, n: V3) => Math.min(1, base + 0.3 * Math.max(0, -n[1]) - 0.2 * Math.max(0, n[2]))
finishModel('Jackie Robinson and Pee Wee Reese Monument', 'nyc-reese-robinson-monument', [
  { part: bronze, material: { ...finish('statue-bronze', 0x6c5a4a), floodlight: lit(0.4) } },
  { part: stone, material: { ...finish('reese-robinson-granite', 0xa9a7a2), floodlight: lit(0.3) } },
], { bearing: 10, osm: 'node/5400243839', height: Z0 + 1.95 })
