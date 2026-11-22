/**
 * St. Johns Bridge, Portland, Oregon (1931; David B. Steinman and Holton D.
 * Robinson) — procedural, CC0-1.0, no textures.
 * bun generators/pdx-st-johns-bridge.ts
 *
 * Also holds helpers shared with pdx-fremont-bridge.ts and
 * pdx-tilikum-crossing.ts (`pointedArch`, `archPanel`, `box`, `beam`,
 * `profileGround`, `writeBridge`): merge this generator first.
 *
 * The whole bridge inside its OSM man_made=bridge outline as one placement:
 * the two verdigris-green Gothic steel towers on their concrete river piers,
 * the main cables (sagging over the 368 m main span, then running straight
 * down to the two concrete anchorages as unloaded backstays), the stiffening
 * truss of the main span, the deck trusses of the side spans and approaches,
 * and the tall concrete approach piers with their pointed Gothic arches that
 * give Cathedral Park its name. The map draws the road surface; nothing here
 * is a slab at road level across the roadway (the sidewalks are the model's).
 * Writes a low model (trusses as solid bands, no suspenders) and a detail
 * model (open trusses, suspenders every 7 m, railings, floor beams), which a
 * map draws from detailZoom 16.
 *
 * Frame: x across (+x south-east, the downstream side), y along toward St.
 * Johns (north-east), z up, metres; origin at the outline's centroid, on the
 * river (Mapterhorn 1.75 m; the 2019 lidar's water reads 1.9–2.2 m NAVD88).
 * Bearing 55.68° (the outline's main axis).
 *
 * What makes it the St. Johns Bridge: the two slender green towers, each two
 * legs flaring toward the foot, with a shallow gabled crown, a pair of small
 * lancets under it, a tall pointed arch over the deck and another under it,
 * and two needle spires; the long sag of the main cables; the green trusses;
 * the row of tall pointed concrete arches over Cathedral Park.
 *
 * Sources:
 * - OSM: outline way/392546027 (man_made=bridge, bridge:structure=suspension,
 *   layer 1, no height), 1,099 m long, x −25..23; the west tower's pier
 *   way/1292827390 (bridge:support=pier, y −345..−331); the east tower's
 *   pier is the outline's bulge at y 21..35. Roadway way/837981556,
 *   115910442, 404734557 (primary, 4 lanes) at x ≈ 0; footways
 *   way/115910434 and 124252583 at x ≈ ±7.5. No building or building:part
 *   inside the outline.
 * - Lidar, USGS 3DEP OR_OLCMetro_2019 (flown 2019): a 0.5 m grid on the east
 *   tower: spire tips 121.8 m above the water, the crown 105–107 m, legs'
 *   centres ±8 m at the top, their outer faces at ±9.5 (top), ±10 (83 m),
 *   ±11.3 (deck), ±13.5 (38 m), the pier top 17.6 m, its lower step 8–10 m
 *   out to ±21 m; the deck surface ±7 m. Roadway (tools/bridge_ele.py
 *   measure 837981556 115910442 404734557 --every 40, spread < 0.1 m): a
 *   crest of 65.9 m NAVD88 near y = −160, grades of about 3.5% to 56.6 m at
 *   the west end and 45.1 m at the east end; `ROAD` below, as NAVD88 − 1.75.
 *   OSM records no height or ele: these are the heights to give the map.
 * - Published (Wikipedia "St. Johns Bridge"; Smith, Norman and Dykman,
 *   "Historic Highway Bridges of Oregon", 1989): main span 1,207 ft (368 m),
 *   suspension structure 2,067 ft (630 m: side spans 131 m each), towers
 *   400 ft, navigation clearance 205 ft; 210 suspender cables; painted green
 *   in 1931; deck replaced and towers repainted 2003–2005.
 * - Photos (Wikimedia Commons):
 *   - "StJohnsBridgeTower.jpg" (Cacophony, CC BY 3.0): the east tower from
 *     the east bank: every stage of the tower, read against the lidar
 *     (gable 104.5–107 m, lancets 95–101, strut 94, upper arch apex 92
 *     springing 66, struts 56 and 52 under the deck, lower arch apex 49
 *     springing 36, strut 21), the needle spires, the pier's two steps;
 *   - "St Johns Bridge from Cathedral Park all - Portland, Oregon.jpg"
 *     (M.O. Stevens, CC BY-SA 4.0): the concrete approach piers, each two
 *     battered legs under the truss planes joined by a pointed arch, and
 *     the deck trusses over them;
 *   - "St Johns Bridge from Cathedral Park anchor - Portland, Oregon.jpg"
 *     (M.O. Stevens, CC BY-SA 4.0): the east anchorage, a ~35 m concrete
 *     block about 16 m high, raised at the river end where the cable enters,
 *     with an approach pier rising from its far end;
 *   - "St. Johns Bridge (Portland, Oregon).jpg" (Visitor7, CC BY-SA 3.0):
 *     from Cathedral Park: the straight backstay from the tower top to the
 *     anchorage (the side spans hang from nothing: they are deck trusses on
 *     the concrete piers), two piers between tower and anchorage;
 *   - "St. Johns Bridge, Portland Oregon (20149754281).jpg" (Tony Webster,
 *     CC BY 2.0): the whole bridge from Forest Park, the west side.
 * - USGS NAIP (public domain): the east approach over Cathedral Park, the
 *   railway and the tower's shadow.
 *
 * Estimated: the approach piers' positions (every 43.7 m, a third of the
 *   side span, as the photos show two piers between tower and anchorage and
 *   the next at the anchorage's far end), their legs (4 m across, 3.6 m
 *   along, battered 4% outward), arch rise (30% of the height, at most 12 m)
 *   and caps; the trusses' depths (5.5 m on the main span, 7.5 m on the
 *   approaches) and the panel length (7.1 m); the anchorages' plan (22 x
 *   35 m) and height (16 m), centred 131 m outside each tower; the main
 *   cables' low point (3 m over the roadway at midspan); the tower legs'
 *   thickness along the bridge (4 m at the foot, 3.5 m at the top); the
 *   sidewalks 1.3 m wide; lamp posts every 36 m.
 *
 * Colours: the steel's pale verdigris green from the daylight photos,
 *   pulled to the palette's lightness; the spires dark bronze (`metal`);
 *   the concrete a weathered warm grey.
 * Night: the towers are floodlit (lighting upgraded in the 2005 rehab;
 *   night photos show them lit green), so the tower steel carries a
 *   `_FLOODLIGHT` wash; the deck's lamp posts are `lamp`.
 *
 * Doubts: no drawing gave the approach piers' spacing; the west approach
 *   (78 m past the west anchorage) is less photographed than Cathedral
 *   Park; the trusses' real depths; where the backstays pass the deck
 *   trusses (here just outside them).
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { band, bead, face, footedLoft, groundAt, piecewise, rod, stations, truss, type GroundGrid } from './bridge-kit'
import { smoothTube } from './dal-margaret-hunt-hill-bridge'
import { PALETTE, finish } from './palette'

// ---- Shared helpers (also used by pdx-fremont-bridge.ts, pdx-tilikum-crossing.ts) ----

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** A closed box x0..x1, y0..y1, z0..z1 (the faces listed in `skip` left out). */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip: string[] = []) {
  if (!skip.includes('-x')) face(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  if (!skip.includes('+x')) face(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  if (!skip.includes('-y')) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  if (!skip.includes('+y')) face(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  if (!skip.includes('-z')) face(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
  if (!skip.includes('+z')) face(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
}

/**
 * A rectangular beam along a path: `w` wide in the direction cross(T, n),
 * `d` thick along `n` (the normal of the plane the path lies in). Flat
 * faces, open ends unless `caps`.
 */
export function beam(p: Part, path: V3[], w: number, d: number, n: V3, caps = false) {
  const secs = path.map((c, i) => {
    const T = norm([0, 1, 2].map((k) => path[Math.min(i + 1, path.length - 1)][k] - path[Math.max(i - 1, 0)][k]) as V3)
    const B = norm(crossV(T, n)), N = norm(n)
    const at = (sb: number, sn: number): V3 => [c[0] + B[0] * sb * w / 2 + N[0] * sn * d / 2, c[1] + B[1] * sb * w / 2 + N[1] * sn * d / 2, c[2] + B[2] * sb * w / 2 + N[2] * sn * d / 2]
    return { pts: [at(1, 1), at(-1, 1), at(-1, -1), at(1, -1)], B, N }
  })
  for (let i = 0; i < secs.length - 1; i++) {
    const a = secs[i], b = secs[i + 1]
    const ns: V3[] = [a.N, [-a.B[0], -a.B[1], -a.B[2]], [-a.N[0], -a.N[1], -a.N[2]], a.B]
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4
      face(p, a.pts[k], a.pts[j], b.pts[j], b.pts[k], ns[k])
    }
  }
  if (caps) for (const [s, dir] of [[secs[0], -1], [secs[secs.length - 1], 1]] as const) {
    const T = norm(crossV(s.B, s.N))
    face(p, s.pts[0], s.pts[1], s.pts[2], s.pts[3], [T[0] * dir, T[1] * dir, T[2] * dir])
  }
}

/**
 * The left half of a two-centred pointed arch from (xa, 0) to its apex over
 * the middle of xa..xb, `rise` high: n + 1 points [x, dz]. A rise equal to
 * the span's half gives a semicircle.
 */
export function pointedArch(xa: number, xb: number, rise: number, n: number): [number, number][] {
  const a = (xb - xa) / 2, R = (a * a + rise * rise) / (2 * a), c = xa + R
  const t1 = Math.atan2(rise, xa + a - c)
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = Math.PI + ((t1 - Math.PI) * i) / n
    return [c + R * Math.cos(t), R * Math.sin(t)] as [number, number]
  })
}

/**
 * A block x xa..xb, y y0..y1, z zs..ztop with a pointed arch opening of the
 * full width springing at zs and peaking at za: the spandrels front and
 * back, the arch's soffit and the top. The block's ends at xa and xb are
 * left open (they stand against legs).
 */
export function archPanel(p: Part, xa: number, xb: number, zs: number, za: number, ztop: number, y0: number, y1: number, n = 6, top = true) {
  const half = pointedArch(xa, xb, za - zs, n)
  const xm = (xa + xb) / 2
  for (const side of [-1, 1]) {
    const arch = half.map(([x, dz]) => [side < 0 ? x : xa + xb - x, zs + dz] as [number, number])
    const ex = side < 0 ? xa : xb
    // The L-shaped outline from the springing up the block's end and along its top to the middle.
    const L1 = ztop - zs, L2 = Math.abs(xm - ex), L = L1 + L2
    const outline = Array.from({ length: n + 1 }, (_, i) => {
      const s = (L * i) / n
      return (s <= L1 ? [ex, zs + s] : [ex + (xm - ex) * ((s - L1) / L2), ztop]) as [number, number]
    })
    for (let i = 0; i < n; i++) {
      const [a, b, c, d] = [arch[i], arch[i + 1], outline[i + 1], outline[i]]
      for (const [y, ny] of [[y0, -1], [y1, 1]] as const)
        face(p, [a[0], y, a[1]], [b[0], y, b[1]], [c[0], y, c[1]], [d[0], y, d[1]], [0, ny, 0])
      // Soffit: faces into the opening (toward the arch's centre below).
      const nx = -(b[1] - a[1]), nz = b[0] - a[0]
      const s = side < 0 ? 1 : -1
      face(p, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], norm([nx * s, 0, nz * s]).map((v) => (v === 0 ? 0 : v)) as V3)
    }
  }
  if (top) face(p, [xa, y0, ztop], [xb, y0, ztop], [xb, y1, ztop], [xa, y1, ztop], [0, 0, 1])
}

/** A ground function from a terrain table (heights above the water, metres). */
export function profileGround(g: GroundGrid) {
  return (x: number, y: number) => Math.max(0, groundAt(g, x, y))
}

export type Mat = { part: Part; material: MaterialSpec }

/** Writes the low and the detail GLB, each held to its budget. */
export async function writeBridge(id: string, name: string, low: Mat[], detail: Mat[], extras: Record<string, unknown>) {
  for (const [file, list, maxTris, maxBytes] of [
    [`${id}.glb`, low, 6500, 250 * 1024],
    [`${id}.detail.glb`, detail, 40000, 1536 * 1024],
  ] as const) {
    const parts = list.filter((l) => l.part.triangles > 0)
    const tris = parts.reduce((s, l) => s + l.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris} (${parts.map((l) => l.material.name + " " + l.part.triangles).join(", ")})`)
    if (new Set(parts.map((l) => l.material.name)).size > 6) throw new Error(`${file}: over six materials`)
    const glb = writeGlb(name, parts, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}

// ---- St. Johns Bridge --------------------------------------------------------

const BEARING = 55.68
// Mapterhorn in this frame (tools/terrain.ts grid, step 8), metres above 1.75 m NAVD88.
const GROUND: GroundGrid = {"y0":-560.0,"x0":-32.0,"step":8.0,"z":[[54.7,54.9,54.9,55.0,55.0,54.9,54.9,54.8,54.8],[52.0,54.6,54.8,54.9,55.0,54.9,54.8,54.7,54.6],[47.1,46.5,49.0,54.2,54.7,54.6,50.9,48.2,48.5],[43.7,44.0,43.3,41.7,43.9,44.0,43.2,43.9,44.3],[38.4,40.5,39.2,37.5,37.8,38.1,39.1,40.2,39.3],[34.1,35.0,35.4,34.5,34.9,35.1,36.1,36.1,37.0],[29.5,30.7,31.4,32.0,32.4,32.1,32.9,33.2,33.6],[23.1,23.9,24.6,26.6,27.7,28.7,28.7,28.9,28.6],[16.9,17.0,17.1,17.2,17.7,19.2,20.2,20.5,20.5],[17.1,17.1,17.1,17.2,17.3,17.3,17.4,17.4,17.4],[17.0,17.0,17.1,17.2,17.2,17.3,17.4,17.4,17.4],[15.7,15.3,15.9,16.3,16.2,16.7,16.9,17.0,17.1],[12.5,12.7,12.8,13.2,13.6,13.8,13.3,13.2,13.7],[12.2,12.3,12.5,12.7,12.6,12.6,12.6,12.6,12.6],[12.1,12.1,12.3,12.4,12.5,12.5,12.6,12.5,12.5],[11.1,11.5,11.9,12.1,12.1,12.3,12.3,12.4,12.5],[10.0,10.0,9.9,9.8,10.2,10.6,10.8,11.4,11.8],[8.8,8.7,8.6,8.8,9.0,9.4,9.9,10.0,10.1],[9.1,9.1,9.1,8.9,8.6,8.5,8.4,8.5,8.6],[8.9,9.0,8.9,8.7,8.5,8.3,8.2,8.3,8.5],[8.7,8.8,8.8,8.6,8.5,8.3,8.2,8.1,8.3],[8.5,8.5,8.5,8.3,8.3,8.2,8.1,8.1,8.2],[8.2,8.3,8.2,8.2,8.2,8.2,7.9,7.9,8.0],[7.9,7.9,7.9,7.9,7.8,7.7,7.6,7.7,7.8],[7.6,7.6,7.7,7.7,7.6,7.5,7.5,7.5,7.7],[7.5,7.5,7.6,7.5,7.5,7.4,7.4,7.3,6.2],[4.1,3.9,4.7,4.2,4.3,4.1,3.8,3.3,1.5],[0.6,0.6,1.0,0.2,0.1,0.1,0.2,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.6,0.6,0.6,0.6,0.2,0.0,0.0,0.0,0.1],[1.7,1.6,1.7,1.7,1.5,1.1,0.7,0.6,0.7],[2.5,2.4,2.6,2.6,2.5,2.2,1.8,1.6,1.7],[3.3,3.4,3.5,3.4,3.3,2.9,2.6,2.5,2.5],[3.6,3.4,3.5,3.5,3.3,3.4,3.1,3.2,3.4],[3.9,3.7,3.6,3.6,3.5,3.5,3.6,3.7,3.9],[4.3,4.0,3.8,3.7,3.7,3.7,3.8,4.0,4.2],[4.6,4.4,4.1,4.0,4.0,4.1,4.3,4.3,4.5],[4.8,4.7,4.5,4.4,4.4,4.4,4.4,4.5,4.6],[5.0,4.9,4.8,4.7,4.7,4.7,4.6,4.7,4.8],[5.1,5.0,4.9,4.9,4.9,4.9,4.9,4.9,5.1],[5.4,5.2,5.1,5.0,5.1,5.1,5.1,5.1,5.3],[5.6,5.5,5.4,5.4,5.3,5.4,5.4,5.4,5.6],[5.9,5.8,5.6,5.5,5.6,5.5,5.7,5.7,5.9],[6.0,5.9,5.9,5.8,5.8,5.8,6.0,6.1,6.4],[6.4,6.2,6.1,6.2,6.2,6.2,6.3,6.5,6.9],[6.8,6.7,6.6,6.7,6.7,6.7,6.9,7.1,7.4],[7.3,7.2,7.3,7.3,7.4,7.4,7.4,7.6,7.9],[7.8,7.8,7.8,8.0,8.1,8.0,7.9,8.2,8.4],[8.3,8.3,8.4,8.5,8.4,8.4,8.4,8.6,8.9],[8.9,8.9,9.0,8.9,8.9,8.9,9.0,9.0,9.0],[9.2,9.3,9.4,9.3,9.3,9.2,9.2,9.1,9.1],[9.2,9.5,9.7,9.7,9.6,9.6,9.5,9.4,9.4],[9.4,9.4,9.7,9.8,10.0,9.7,9.6,9.6,9.6],[9.5,9.5,9.9,10.5,10.3,10.0,9.8,9.8,9.8],[9.7,9.7,10.0,10.7,10.5,10.1,9.8,9.9,9.9],[9.8,9.9,10.1,10.8,10.6,10.3,10.0,10.1,10.1],[9.9,10.0,10.2,10.3,10.4,10.4,10.2,10.2,10.2],[10.1,10.2,10.2,10.2,10.3,10.3,10.2,10.2,10.2],[10.2,10.1,10.1,10.2,10.2,10.1,10.0,10.1,10.3],[10.3,10.2,10.1,10.1,10.0,10.0,10.0,10.1,10.2],[11.3,10.8,11.2,12.3,12.3,12.5,11.6,11.9,11.9],[12.1,11.8,12.4,13.1,13.3,13.3,13.3,13.4,13.4],[12.5,12.5,13.0,13.6,13.8,13.9,13.9,14.0,14.0],[13.0,13.3,13.7,14.2,14.5,14.5,14.5,14.4,13.9],[13.7,14.1,14.4,14.9,15.2,15.1,15.0,14.3,13.2],[14.5,14.8,15.0,15.4,16.0,15.9,15.7,14.6,13.3],[15.1,15.4,15.6,16.3,16.8,16.9,16.4,15.5,14.0],[15.8,16.0,16.4,16.8,17.0,16.9,16.9,16.5,15.3],[16.9,17.1,17.6,18.1,18.5,18.6,18.0,17.2,16.7],[18.1,18.4,19.1,19.7,20.1,20.0,19.1,17.8,17.3],[19.8,20.0,20.4,21.0,21.2,20.9,19.7,18.5,17.7],[21.4,21.5,21.6,21.7,21.5,21.5,20.6,19.5,18.5],[22.7,22.6,22.4,22.0,21.8,21.8,21.6,21.1,20.0],[23.7,23.2,22.9,22.7,22.4,22.7,22.6,22.1,21.2],[24.6,24.1,23.9,23.8,23.8,24.0,23.8,23.2,22.5],[25.6,25.7,25.5,25.5,25.6,25.6,24.8,23.5,23.0],[25.9,26.3,26.8,26.9,27.3,27.1,25.6,24.1,23.7],[27.0,27.3,27.6,27.9,28.1,28.1,27.3,26.2,25.9],[28.6,28.4,28.3,28.2,28.2,28.1,28.1,27.9,27.6],[28.9,28.7,28.5,28.4,28.4,28.4,28.3,28.2,27.9],[29.1,29.6,29.5,28.9,28.9,28.9,29.0,29.0,29.0],[30.7,31.0,30.8,29.6,29.6,29.5,29.8,30.2,30.1],[32.4,31.8,31.4,30.4,30.4,30.4,30.5,31.0,30.8],[33.1,32.3,32.6,31.1,31.1,31.1,31.3,31.4,31.1],[34.7,34.4,34.0,31.9,31.9,31.9,32.0,32.6,32.6],[35.0,34.7,34.5,32.7,32.6,32.6,32.7,32.9,32.9],[35.3,35.3,35.0,33.4,33.3,33.3,33.5,33.7,33.7],[35.4,35.4,35.3,34.1,34.1,34.0,34.2,34.1,34.0],[34.9,34.8,34.7,34.6,34.7,34.6,34.5,34.4,34.3],[35.4,35.2,35.0,35.1,36.0,35.3,34.9,34.8,34.7],[37.6,37.6,36.3,35.6,36.3,36.2,35.5,35.8,35.8],[38.2,38.3,37.1,36.4,37.9,37.8,36.3,36.1,36.0]]}
const ground = (x: number, y: number) => profileGround(GROUND)(x, y)

/** Roadway above the water (lidar NAVD88 − 1.75), by y. */
const ROAD = piecewise([
  [-560, 54.6], [-540, 54.9], [-493, 56.25], [-453, 57.6], [-402, 59.4], [-362, 60.8], [-322, 62.1], [-282, 63.0],
  [-242, 63.7], [-202, 64.0], [-162, 64.15], [-125, 64.1], [-85, 63.8], [-45, 63.2], [-5, 62.4], [35, 61.3],
  [75, 59.9], [115, 58.5], [155, 57.2], [195, 55.8], [224, 54.8], [264, 53.4], [304, 52.0], [344, 50.6],
  [384, 49.1], [424, 47.7], [464, 46.35], [504, 45.0], [544, 43.6], [560, 43.1],
])
const Y0 = -548.4, Y1 = 550.2                    // the outline's ends
const TOWERS = [-339, 29]                        // OSM piers; 368 m apart (published)
const YM = (TOWERS[0] + TOWERS[1]) / 2
const SADDLE = 105.5, CABLE_X = 8, CABLE_LOW = ROAD(YM) + 3
const ANCH = [{ y0: -488, y1: -453, entry: -460 }, { y0: 145, y1: 180, entry: 152 }]
const TRUSS_X = 8, CURB = 6.1, WALK = 7.4
const PIERS = [-513.7, -470, -426.4, -382.7, 72.7, 116.4, 160, 203.8, 247.5, 291.2, 334.9, 378.6, 422.3, 466, 509.7]

const inMain = (y: number) => y > TOWERS[0] && y < TOWERS[1]
const depth = (y: number) => (inMain(y) ? 5.5 : 7.5)
const cable = (y: number) => {
  const h = (TOWERS[1] - TOWERS[0]) / 2, t = (y - YM) / h
  return CABLE_LOW + (SADDLE - CABLE_LOW) * t * t
}

function build() {
  const green = new Part(), greenD = new Part(), web = new Part(), concrete = new Part(), deck = new Part(), spire = new Part()
  const lampLow = new Part(), lampD = new Part(), towerLow = new Part()
  // Tower steel is drawn once, into `towerLow`, and shared by both models.

  // ---- Towers
  const outer = piecewise([[17.9, 14.6], [38, 13.5], [61, 11.3], [83, 10.0], [104.5, 9.5]])
  const width = (z: number) => 4.0 - (z - 17.9) / 86.6
  const thick = (z: number) => 2.0 - 0.25 * (z - 17.9) / 86.6   // half-thickness along y
  const inner = (z: number) => outer(z) - width(z)
  const legZ = [17.9, 38, 61, 83, 104.5]
  for (const yt of TOWERS) {
    for (const s of [-1, 1]) {
      const rings = legZ.map((z) => {
        const o = s * outer(z), i = s * inner(z), t = thick(z)
        const [xa, xb] = [Math.min(o, i), Math.max(o, i)]
        return [[xa, yt - t, z], [xb, yt - t, z], [xb, yt + t, z], [xa, yt + t, z]] as V3[]
      })
      towerLow.loft(rings)
      towerLow.cap(rings[rings.length - 1], true)
      // Pinnacle and needle spire on the leg top.
      const cx = s * (outer(104.5) - width(104.5) / 2)
      const base = 1.6, tz = 104.5
      const pyr: V3[] = [[cx - base, yt - base, tz], [cx + base, yt - base, tz], [cx + base, yt + base, tz], [cx - base, yt + base, tz]]
      const mid: V3[] = pyr.map(([x, y]) => [cx + (x - cx) * 0.3, yt + (y - yt) * 0.3, tz + 3.4] as V3)
      spire.loft([pyr, mid])
      for (let k = 0; k < 4; k++) spire.tri(mid[k], mid[(k + 1) % 4], [cx, yt, 121.8])
    }
    const t = 0.8
    const xi = (z: number) => inner(z) + 0.4   // members run into the legs
    // Crown: block 101–104.5 and a shallow gable to 107.
    const xc = outer(104.5) - 0.2
    box(towerLow, -xc, xc, yt - 1.4, yt + 1.4, 101, 104.5, ['+z'])
    for (const [y, ny] of [[yt - 1.4, -1], [yt + 1.4, 1]] as const)
      ny < 0 ? towerLow.tri([-xc, y, 104.5], [0, y, 107], [xc, y, 104.5]) : towerLow.tri([-xc, y, 104.5], [xc, y, 104.5], [0, y, 107])
    face(towerLow, [-xc, yt - 1.4, 104.5], [0, yt - 1.4, 107], [0, yt + 1.4, 107], [-xc, yt + 1.4, 104.5], norm([-2.5, 0, xc]))
    face(towerLow, [xc, yt - 1.4, 104.5], [0, yt - 1.4, 107], [0, yt + 1.4, 107], [xc, yt + 1.4, 104.5], norm([2.5, 0, xc]))
    // Two lancets under the crown, a mullion between them, the strut under them.
    archPanel(towerLow, -xi(98), -0.6, 97.2, 100.4, 101, yt - t, yt + t, 4, false)
    archPanel(towerLow, 0.6, xi(98), 97.2, 100.4, 101, yt - t, yt + t, 4, false)
    box(towerLow, -0.6, 0.6, yt - t, yt + t, 95.4, 101, ['-z', '+z'])
    box(towerLow, -xi(94.5), xi(94.5), yt - 1.0, yt + 1.0, 93.6, 95.4)
    // The tall pointed arch over the deck.
    archPanel(towerLow, -xi(80), xi(80), 66, 91.6, 93.6, yt - t, yt + t, 8, false)
    // Struts under the deck.
    box(towerLow, -xi(56), xi(56), yt - 1.2, yt + 1.2, 54.6, 57.0)
    box(towerLow, -xi(51.5), xi(51.5), yt - t, yt + t, 50.8, 52.2)
    // The lower pointed arch, and the strut near the foot.
    archPanel(towerLow, -xi(43), xi(43), 36, 49.4, 50.8, yt - t, yt + t, 8, false)
    box(towerLow, -xi(21), xi(21), yt - 1.2, yt + 1.2, 19.8, 22.0)
    // River pier: a wide cutwater footing to 9 m, stepped in to 17.9 m.
    const hex = (hx: number, hy: number, tip: number): [number, number][] =>
      [[-hx, yt - hy], [hx, yt - hy], [hx + tip, yt], [hx, yt + hy], [-hx, yt + hy], [-hx - tip, yt]]
    footedLoft(concrete, ground, [
      { plan: hex(16, 7.2, 7.8), z: 'ground' }, { plan: hex(16, 7.2, 7.8), z: 9 },
      { plan: hex(11.5, 6.0, 4.5), z: 9 }, { plan: hex(11.5, 6.0, 4.5), z: 17.9 },
    ], 8)
  }

  // ---- Main cables and backstays
  for (const s of [-1, 1]) {
    const x = s * CABLE_X
    const main = stations(TOWERS[0], TOWERS[1], 16).map((y) => [x, y, cable(y)] as V3)
    smoothTube(green, main, 0.55, 6)
    smoothTube(greenD, stations(TOWERS[0], TOWERS[1], 6).map((y) => [x, y, cable(y)] as V3), 0.45, 8)
    for (const [k, a] of ANCH.entries()) {
      const yt = TOWERS[k], top = anchTop(a)
      const path: V3[] = [[x, yt, SADDLE], [s * 9.2, a.entry, top - 1]]
      smoothTube(green, path, 0.55, 6)
      smoothTube(greenD, path, 0.45, 8)
    }
  }

  // ---- Anchorages: a long block raised at the river end, where the cable enters.
  for (const a of ANCH) {
    const top = anchTop(a), riverEnd = a.entry < 0 ? a.y1 : a.y0, dir = a.entry < 0 ? -1 : 1
    const raised: [number, number] = dir > 0 ? [a.y0, a.y0 + 11] : [a.y1 - 11, a.y1]
    const rect = (x0: number, x1: number, y0: number, y1: number): [number, number][] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    footedLoft(concrete, ground, [{ plan: rect(-11.5, 11.5, a.y0, a.y1), z: 'ground' }, { plan: rect(-11.5, 11.5, a.y0, a.y1), z: top - 5 }], 8)
    footedLoft(concrete, ground, [{ plan: rect(-11.5, 11.5, raised[0], raised[1]), z: top - 5 }, { plan: rect(-11.5, 11.5, raised[0], raised[1]), z: top }], 8)
    void riverEnd
  }

  // ---- Gothic approach piers
  for (const y of PIERS) {
    const top = ROAD(y) - depth(y) - 0.2
    const g = Math.min(ground(-8, y), ground(8, y))
    const h = top - g
    if (h < 3) continue
    const cap = 2.4, rise = Math.min(12, 0.3 * h), zs = top - cap - rise
    for (const s of [-1, 1]) {
      const xo = s * 10, xi = s * 6
      const ring = (b: number): [number, number][] => {
        const [xa, xb] = s < 0 ? [xo - b, xi] : [xi, xo + b]
        const t = 1.8 + b * 0.5
        return [[xa, y - t], [xb, y - t], [xb, y + t], [xa, y + t]]
      }
      footedLoft(concrete, ground, [{ plan: ring(0.04 * h), z: 'ground' }, { plan: ring(0), z: zs }], 6, false)
    }
    archPanel(concrete, -6, 6, zs, top - cap, top, y - 1.8, y + 1.8, 5)
    box(concrete, -10, -6, y - 1.8, y + 1.8, zs, top, ['-z', '+x'])
    box(concrete, 6, 10, y - 1.8, y + 1.8, zs, top, ['-z', '-x'])
    // A cap a little wider than the shaft.
    box(concrete, -10.6, 10.6, y - 2.3, y + 2.3, top, top + 0.8, [])
  }

  // ---- Deck structure
  const ys = [...new Set([...stations(Y0, TOWERS[0], 15), ...stations(TOWERS[0], TOWERS[1], 12), ...stations(TOWERS[1], Y1, 15)].map((v) => +v.toFixed(3)))].sort((a, b) => a - b)
  const top = (y: number) => ROAD(y) + 1.0
  const bot = (y: number) => ROAD(y) - depth(y)
  for (const s of [-1, 1]) {
    // Low: each truss as a solid band.
    band(green, s * (TRUSS_X - 0.6), s * (TRUSS_X + 0.6), ys, top, bot, { out: true, in: true, top: true, bottom: true, ends: true })
    // Detail: chords and web, panels about 7.1 m.
    const panelsMain = stations(TOWERS[0], TOWERS[1], 7.1)
    const panelsW = stations(Y0, TOWERS[0], 7.6), panelsE = stations(TOWERS[1], Y1, 7.6)
    for (const pts of [panelsW, panelsMain, panelsE])
      truss(greenD, web, s * TRUSS_X, pts, (y) => ROAD(y) + 0.2, bot, { chordW: 0.7, topD: 0.7, botD: 0.8, member: 0.35, post: 0.45 })
    // Railing over the top chord (detail).
    band(greenD, s * (TRUSS_X - 0.08), s * (TRUSS_X + 0.08), ys, (y) => ROAD(y) + 1.15, (y) => ROAD(y) + 1.0, { out: true, in: true, top: true })
    // Sidewalk, the model's own surface.
    for (const p of [deck]) band(p, s * CURB, s * WALK, ys, (y) => ROAD(y) + 0.2, (y) => ROAD(y) - 0.3, { top: true, in: true })
  }
  // Soffit under the roadway, between the trusses.
  band(deck, -TRUSS_X + 0.6, TRUSS_X - 0.6, ys, (y) => ROAD(y) - 1.2, (y) => ROAD(y) - 1.2, { bottom: true })
  // Bottom lateral bracing as a plate in the low model, floor beams in the detail.
  for (const y of stations(Y0, Y1, 7.6)) rod(greenD, [-TRUSS_X, y, ROAD(y) - 1.3], [TRUSS_X, y, ROAD(y) - 1.3], 0.35, 4)

  // ---- Suspenders (detail only), every 7.1 m.
  for (const y of stations(TOWERS[0], TOWERS[1], 7.1).slice(1, -1))
    for (const s of [-1, 1]) rod(greenD, [s * CABLE_X, y, cable(y) - 0.4], [s * CABLE_X, y, ROAD(y) + 0.9], 0.18, 3)

  // ---- Lamp posts along both sidewalks, and red aviation lights on the spires.
  for (const y of stations(Y0 + 10, Y1 - 10, 36)) for (const s of [-1, 1]) {
    if (TOWERS.some((t) => Math.abs(t - y) < 5)) continue
    bead(lampD, [s * 7.6, y, ROAD(y) + 5.5], 0.35)
    if (Math.round((y - Y0) / 36) % 2 === 0) bead(lampLow, [s * 7.6, y, ROAD(y) + 5.5], 0.5, true)
  }

  return { green, greenD, web, concrete, deck, spire, lampLow, lampD, towerLow }
}

function anchTop(a: { y0: number; y1: number }) {
  return Math.max(ground(-11, a.y0), ground(11, a.y1), ground(0, (a.y0 + a.y1) / 2)) + 16
}

if (import.meta.main) {
  const m = build()
  const GREEN = finish('stjohns-green', 0x86bea0)
  const GREEN_WEB: MaterialSpec = { ...finish('stjohns-green-web', 0x86bea0), doubleSided: true }
  const CONCRETE = finish('concrete', 0xbab3a6)
  const DECK = finish('deck', 0xa7adb0)
  const LAMP = finish('lamp', 0xd9d2b8)
  const towerLight = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : 0.35 + 0.45 * Math.min(1, p[2] / 100))
  const TOWER: MaterialSpec = { ...finish('stjohns-tower', 0x86bea0), floodlight: towerLight }
  const SPIRE = PALETTE.metal
  const low: Mat[] = [
    { part: m.towerLow, material: TOWER }, { part: m.green, material: GREEN }, { part: m.concrete, material: CONCRETE },
    { part: m.deck, material: DECK }, { part: m.spire, material: SPIRE }, { part: m.lampLow, material: LAMP },
  ]
  const detail: Mat[] = [
    { part: m.towerLow, material: TOWER }, { part: m.greenD, material: GREEN }, { part: m.web, material: GREEN_WEB },
    { part: m.concrete, material: CONCRETE }, { part: m.deck, material: DECK }, { part: m.lampD, material: LAMP },
  ]
  await writeBridge('pdx-st-johns-bridge', 'St. Johns Bridge', low, detail, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at the anchor on the water', height: 121.8, bearing: BEARING,
  })
}
