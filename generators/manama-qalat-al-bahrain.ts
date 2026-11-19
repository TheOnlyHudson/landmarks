/**
 * Qal'at al-Bahrain (Bahrain Fort, the Portuguese fort, UNESCO), Karbabad:
 * procedural, CC0-1.0.
 * bun generators/manama-qalat-al-bahrain.ts
 *
 * The restored 16th-century fort as it stands: battered coral-stone
 * curtain walls with a wall-walk and plain parapet along the OSM wall line,
 * a huge round-cornered bastion at the south-west corner with a domed
 * sentry turret (garita), a tall square bastion with battered faces at the
 * south-east, a square bastion at the north-west, a round bastion at the
 * end of the eastern lobe and round towers on the north and west walls, and
 * inside, the keep: a tall block and a higher tower with its own garita.
 * The ruins of the tell and the excavated town are left to the map.
 *
 * Frame: bearing 0. Origin: centroid of OSM way/89370342, 50.5199956,
 * 26.2334016 (geometry is authored in metres from 50.52, 26.2333 and moved).
 *
 * Elevation 0. The fort stands on the 12 m tell, but the tell is ground the
 * map already draws: Mapterhorn z12 here rises from about 6 m on the east
 * lobe to 12-13 m over the fort (bun tools/terrain.ts grid --zoom 12), and
 * the walls rise from the dry moat cut into the tell. So y = 0 is the moat
 * floor at the lowest ground under the outline and nothing is raised; where
 * the z12 surface is higher (the west half) the walls sink into it, as the
 * evidence rules say for sloped sites. That z12 surface also counts the
 * walls themselves, so the sink is partly an artefact of the tiles.
 *
 * Evidence
 * - OSM way/89370342 (Bahrain Fort / Qal'at al-Bahrain, historic=castle,
 *   barrier=city_wall, building=yes): the wall line, simplified here to its
 *   corners (WALL), with the jogs that mark the bastions read as: SW
 *   bastion x -86.5..-61, y -59.5..-36; SE bastion x -5.5..13, y -57..-43.5;
 *   NW bastion x -64.9..-53.6, y 55.5..68.6; the round east bastion centre
 *   (111.2, 9.2), r 8.8 (all in metres from 50.52, 26.2333).
 *   No other building is mapped within 150 m.
 * - Published: the fort tops a 12 m mound (en.wikipedia.org/wiki/Qal%27at_al-Bahrain).
 * - Photos, all EVIDENCE:
 *   f1 "Bahrain Fort March 2015.JPG", Martin Falbisoner, CC BY-SA 4.0: the
 *     round-cornered bastion with the garita, the dry moat, curtain walls.
 *     https://commons.wikimedia.org/wiki/File:Bahrain_Fort_March_2015.JPG
 *   d66, d68, d67, d53 "Qal'at al-Bahrain, Karbabad, Baréin, 2024-08-18,
 *     DD 66/68/67/53.jpg", Diego Delso, CC BY-SA 4.0: the big bastion, the
 *     square battered bastion, the keep and its garita, the long south wall.
 *     https://commons.wikimedia.org/wiki/File:Qal%27at_al-Bahrain,_Karbabad,_Bar%C3%A9in,_2024-08-18,_DD_66.jpg
 *     https://commons.wikimedia.org/wiki/File:Qal%27at_al-Bahrain,_Karbabad,_Bar%C3%A9in,_2024-08-18,_DD_68.jpg
 *     https://commons.wikimedia.org/wiki/File:Qal%27at_al-Bahrain,_Karbabad,_Bar%C3%A9in,_2024-08-18,_DD_67.jpg
 *     https://commons.wikimedia.org/wiki/File:Qal%27at_al-Bahrain,_Karbabad,_Bar%C3%A9in,_2024-08-18,_DD_53.jpg
 *   z12 "Manama Qal'at al-Bahrain 12.jpg", Zairon, CC BY-SA 4.0: the square
 *     bastion's batter and loopholes.
 *     https://commons.wikimedia.org/wiki/File:Manama_Qal%27at_al-Bahrain_12.jpg
 *   z01 "Manama Qal'at al-Bahrain 01.jpg", Zairon, CC BY-SA 4.0: the whole
 *     fort from the shore. https://commons.wikimedia.org/wiki/File:Manama_Qal%27at_al-Bahrain_01.jpg
 *   pan "Bahrain Fort (Panorama View).jpg", Jacobs - Creative Bees, CC BY 2.0.
 *     https://commons.wikimedia.org/wiki/File:Bahrain_Fort_(Panorama_View).jpg
 *   b01 "Bahrain Fort 01.jpg", Dobroš, CC BY-SA 4.0: keep tower and garita.
 *     https://commons.wikimedia.org/wiki/File:Bahrain_Fort_01.jpg
 *   Look-only context: "Old Portuguese Fort, Bahrein.png" (public domain,
 *     19th c.): round towers on the walls before restoration.
 *
 * Estimated from the photos (people and doorways for scale), raised in
 * lead review round 1 so the bastions and keep stand clearly above the
 * curtain as in pan: curtain walls 10.5 m above the moat floor to the
 * parapet (5.5 m on the lower eastern enclosure, pan and d53), batter 1 m,
 * 4.5 m thick at the walk; SW bastion 14 m, SE bastion 15 m (batter 1.2 m),
 * NW bastion 13 m, west round tower r 6.8 m, 12.5 m; on the outer
 * enclosure the east round bastion 8.5 m and the north tower 7.5 m; keep
 * block 16 m, keep tower 19 m, inner range 12.5 m; garitas 1.3 m radius,
 * 3.3 m with their domes. Parapet tops are the paler plaster so the wall
 * line reads from above.
 * Plan search (round 1): no open plan, aerial or licensed site drawing was
 * found (Commons "Bahrain Fort plan", "Qal'at al-Bahrain site plan",
 * "Qalat al Bahrain map", "Bahrain Fort aerial/drone"; Openverse the same).
 * The OSM line takes in more than the fort: west of x 13 is the compact
 * fort (the bastions, keep and tall walls of every photo); east of it a
 * lower enclosure runs to the round east bastion (pan, d53 show lower walls
 * running on to a gate). So the fort is modelled in full, closed by an
 * estimated east wall at x 13 with its court filled to 6.5 m (the terraces
 * seen inside in d67, b01), and the eastern enclosure as low walls only.
 * The round wall towers' places and the keep's plan are estimated.
 * Colour: sunlit stone #dcc2a0/#c6a988/#c3a480 -> #d6c0a0; plaster patches
 * and turrets lighter #e3cfb0; loopholes and doors #5e4a3a.
 *
 * Night: the walls are floodlit (OSM lit=yes); `_FLOODLIGHT` on vertical faces.
 *
 * Doubts: the OSM line is the only plan; its eastern lobe and the bastion
 * shapes are read from jogs in it. Ruined stretches are drawn whole, as
 * restored walls. The interior courts, terraces and ruins are not modelled.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { ccw, inset, oq, ot, earcut, triCount, type P2 } from './riyadh-kingdom-centre'

const ANCHOR = { lng: 50.5199956, lat: 26.2334016 }
const OFF: P2 = [-0.44, 11.23] // the anchor in the authoring frame
const BEARING = 0

const WALL_RAW: P2[] = [[-86.8, -60], [-61, -58.1], [-60.1, -49.6], [-4.5, -52.1], [6.9, -57.1], [13.4, -49.9], [10.4, -43.5], [26.4, -26.5], [34.9, -25.4], [57.9, -2.8], [67.4, 4.6], [78, 10.2], [83.8, 12.3], [94.1, 14.1], [104, 6], [106.5, 22], [100.4, 30.7], [94.2, 39.8], [82.6, 51], [68.7, 59], [49.8, 64.3], [41.4, 68], [32.1, 70.5], [19.4, 69.2], [0.4, 69.7], [-10.1, 66.1], [-29.5, 63.9], [-53.8, 63.4], [-58.5, 60], [-60, 40.5], [-61.6, 28.2], [-64.8, 18], [-68.5, 5.6], [-71.6, -0.7], [-75.5, -31.3], [-81.5, -34.9], [-84.6, -47.7]]
const M = (p: P2): P2 => [p[0] - OFF[0], p[1] - OFF[1]]
const WALL = ccw(WALL_RAW.map(M))

function build() {
  const stone = new Part(), plaster = new Part(), dark = new Part(), court_ = new Part()

  /** Battered faces of a closed ring: bottom ring at z0, top ring at z1 (both CCW). */
  const ringFaces = (p: Part, lo: P2[], hi: P2[], z0: number, z1: number, inward = false) => {
    const n = lo.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const ex = lo[j][0] - lo[i][0], ey = lo[j][1] - lo[i][1]
      const o: V3 = inward ? [-ey, ex, 0] : [ey, -ex, 0] // CCW: outward is to the right
      const L = Math.hypot(ex, ey), k = Math.max(1, Math.ceil(L / 6))
      for (let s = 0; s < k; s++) {
        const a = s / k, b = (s + 1) / k
        const L0 = (P: P2[], t: number): P2 => [P[i][0] + (P[j][0] - P[i][0]) * t, P[i][1] + (P[j][1] - P[i][1]) * t]
        const A = L0(lo, a), B = L0(lo, b), C = L0(hi, b), D = L0(hi, a)
        oq(p, [A[0], A[1], z0], [B[0], B[1], z0], [C[0], C[1], z1], [D[0], D[1], z1], o)
      }
    }
  }
  /** A flat band between two rings at height z (outer, inner), facing up. */
  const ringTop = (p: Part, outer: P2[], inner: P2[], z: number) => {
    for (let i = 0; i < outer.length; i++) {
      const j = (i + 1) % outer.length
      oq(p, [outer[i][0], outer[i][1], z], [outer[j][0], outer[j][1], z], [inner[j][0], inner[j][1], z], [inner[i][0], inner[i][1], z], [0, 0, 1])
    }
  }

  // ---------------- curtain walls ----------------
  {
    // The walls of the eastern lobe (east of the SE bastion) stand lower than the fort's own (pan, d53).
    const H = WALL.map(([x]) => (x + OFF[0] > 16 ? 5.5 : 10.5))
    const o09 = inset(WALL, 1.0), o16 = inset(WALL, 2.0), i35 = inset(WALL, 4.5)
    const n = WALL.length
    const V = (P: P2[], i: number, z: number): V3 => [P[i][0], P[i][1], z]
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, ex = WALL[j][0] - WALL[i][0], ey = WALL[j][1] - WALL[i][1]
      const o: V3 = [ey, -ex, 0], ii: V3 = [-ey, ex, 0]
      const k = Math.max(1, Math.ceil(Math.hypot(ex, ey) / 6))
      for (let s2 = 0; s2 < k; s2++) {
        const a = s2 / k, b = (s2 + 1) / k
        const L = (P: P2[], t: number, z: number): V3 => [P[i][0] + (P[j][0] - P[i][0]) * t, P[i][1] + (P[j][1] - P[i][1]) * t, z]
        const top = (t: number) => H[i] + (H[j] - H[i]) * t, walk = (t: number) => top(t) - 1
        oq(stone, L(WALL, a, 0), L(WALL, b, 0), L(o09, b, top(b)), L(o09, a, top(a)), o) // battered outer face
        oq(stone, L(i35, a, walk(a)), L(i35, b, walk(b)), L(i35, b, 0), L(i35, a, 0), ii) // inner face
      }
      oq(plaster, V(o09, i, H[i]), V(o09, j, H[j]), V(o16, j, H[j]), V(o16, i, H[i]), [0, 0, 1]) // parapet top, pale so the wall line reads from above
      oq(stone, V(o16, i, H[i]), V(o16, j, H[j]), V(o16, j, H[j] - 1), V(o16, i, H[i] - 1), ii) // parapet inner face
      oq(stone, V(o16, i, H[i] - 1), V(o16, j, H[j] - 1), V(i35, j, H[j] - 1), V(i35, i, H[i] - 1), [0, 0, 1]) // wall-walk
    }
  }

  // ---------------- bastions ----------------
  /** A rounded-rectangle ring, CCW, corner radius r, `seg` steps per corner. */
  const rrect = (x0: number, x1: number, y0: number, y1: number, r: number, seg: number): P2[] => {
    const out: P2[] = []
    const cs: [number, number, number][] = [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]]
    for (const [cx, cy, a0] of cs) for (let k = 0; k <= seg; k++) { const a = a0 + (Math.PI / 2) * (k / seg); out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
    return out
  }
  const circle = (cx: number, cy: number, r: number, n: number): P2[] => Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)] as P2)
  const shrink = (P: P2[], d: number): P2[] => {
    const c = P.reduce((s, p) => [s[0] + p[0] / P.length, s[1] + p[1] / P.length], [0, 0])
    return P.map(([x, y]) => { const dx = x - c[0], dy = y - c[1], l = Math.hypot(dx, dy) || 1; return [x - (dx / l) * d, y - (dy / l) * d] as P2 })
  }
  /** A solid bastion: battered body, plain parapet round a sunken platform. */
  function bastion(foot: P2[], h: number, batter: number, part = stone) {
    const top = foot === foot ? (foot.length > 12 ? shrink(foot, batter) : inset(foot, batter)) : foot
    const inner = foot.length > 12 ? shrink(top, 0.8) : inset(top, 0.8)
    ringFaces(part, foot, top, 0, h)
    ringTop(plaster, top, inner, h)
    ringFaces(part, inner, inner, h, h - 1, true)
    for (const [a, b, c] of earcut(inner)) ot(stone, [inner[a][0], inner[a][1], h - 1], [inner[b][0], inner[b][1], h - 1], [inner[c][0], inner[c][1], h - 1], [0, 0, 1])
    return top
  }
  function garita(cx: number, cy: number, z: number) {
    const n = 10, r = 1.3
    const ring = (rr: number, zz: number): V3[] => Array.from({ length: n }, (_, k) => [cx + rr * Math.cos((2 * Math.PI * k) / n), cy + rr * Math.sin((2 * Math.PI * k) / n), zz] as V3)
    const rows: [number, number][] = [[r, z], [r, z + 2.0], [r + 0.15, z + 2.1], [r + 0.15, z + 2.3], [r * 0.95, z + 2.3], [r * 0.8, z + 2.8], [r * 0.45, z + 3.2], [0.01, z + 3.35]]
    for (let k = 0; k + 1 < rows.length; k++) {
      const a = ring(rows[k][0], rows[k][1]), b = ring(rows[k + 1][0], rows[k + 1][1])
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, m = (2 * Math.PI * (i + 0.5)) / n
        oq(plaster, a[i], a[j], b[j], b[i], [Math.cos(m), Math.sin(m), rows[k + 1][0] < rows[k][0] ? 0.8 : 0])
      }
    }
    // a slit window facing out
    const a = Math.atan2(cy, cx)
    const c = Math.cos(a), s = Math.sin(a), u = 0.22
    oq(dark, [cx + c * (r + 0.03) - s * u, cy + s * (r + 0.03) + c * u, z + 1.0], [cx + c * (r + 0.03) + s * u, cy + s * (r + 0.03) - c * u, z + 1.0], [cx + c * (r + 0.03) + s * u, cy + s * (r + 0.03) - c * u, z + 1.7], [cx + c * (r + 0.03) - s * u, cy + s * (r + 0.03) + c * u, z + 1.7], [c, s, 0])
  }
  /** Small dark loopholes on a straight battered face a→b at height z. */
  function loopholes(a: P2, b: P2, z: number, n: number) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: P2 = [t[1], -t[0]]
    for (let k = 0; k < n; k++) {
      const s = (L * (k + 0.5)) / n, x = a[0] + t[0] * s + o[0] * 0.06, y = a[1] + t[1] * s + o[1] * 0.06
      oq(dark, [x - t[0] * 0.25, y - t[1] * 0.25, z], [x + t[0] * 0.25, y + t[1] * 0.25, z], [x + t[0] * 0.25, y + t[1] * 0.25, z + 0.9], [x - t[0] * 0.25, y - t[1] * 0.25, z + 0.9], [o[0], o[1], 0])
    }
  }

  // SW: the great round-cornered bastion with its garita (f1, d66)
  const sw = rrect(...([-86.5, -61, -59.5, -36].map((v, i) => v - OFF[i < 2 ? 0 : 1]) as [number, number, number, number]), 6, 4)
  const swTop = bastion(sw, 14, 0.9)
  garita(-84.8 - OFF[0], -57.7 - OFF[1], 14 - 1)
  // SE: the tall square bastion with battered faces and loopholes (d68, z12)
  const se = rrect(-5.5 - OFF[0], 13 - OFF[0], -57 - OFF[1], -43.5 - OFF[1], 0.8, 1)
  bastion(se, 15, 1.2)
  loopholes([-5.5 - OFF[0] + 1.5, -57 - OFF[1] + 0.25], [13 - OFF[0] - 1.5, -57 - OFF[1] + 0.25], 9.5, 3)
  loopholes([13 - OFF[0] - 0.25, -57 - OFF[1] + 1.5], [13 - OFF[0] - 0.25, -43.5 - OFF[1] - 1.5], 9.5, 2)
  // NW square bastion
  bastion(rrect(-64.9 - OFF[0], -53.6 - OFF[0], 55.5 - OFF[1], 68.6 - OFF[1], 0.8, 1), 13, 0.8)
  // E round bastion, and round towers on the north and west walls
  bastion(circle(111.2 - OFF[0], 9.2 - OFF[1], 8.8, 20), 8.5, 0.7)
  bastion(circle(33 - OFF[0], 67.5 - OFF[1], 6.0, 16), 7.5, 0.4)
  bastion(circle(-62.5 - OFF[0], 33 - OFF[1], 6.8, 16), 12.5, 0.5)
  void swTop

  // ---------------- the compact fort: its east wall and raised court ----------------
  // The OSM line also takes in a lower eastern enclosure (pan, d53: lower walls running on to a
  // gate); the fort itself ends at the SE bastion. Its east wall (x 13, estimated) closes it, and
  // its court is filled to 6.5 m, the terraces seen inside the walls in d67 and b01, so the fort
  // reads as a solid block from above rather than a ring.
  {
    const FORT: P2[] = ccw(([[-86.8, -60], [-61, -58.1], [-60.1, -49.6], [-4.5, -52.1], [6.9, -57.1], [13, -50], [13, 69.2], [0.4, 69.7], [-10.1, 66.1], [-29.5, 63.9], [-53.8, 63.4], [-58.5, 60], [-60, 40.5], [-61.6, 28.2], [-64.8, 18], [-68.5, 5.6], [-71.6, -0.7], [-75.5, -31.3], [-81.5, -34.9], [-84.6, -47.7]] as P2[]).map(M))
    const court = inset(FORT, 4.4)
    for (const [i, j, k] of earcut(court)) ot(court_, [court[i][0], court[i][1], 6.5], [court[j][0], court[j][1], 6.5], [court[k][0], court[k][1], 6.5], [0, 0, 1])
    // the east wall, 4.5 m thick, 10.5 m, with a pale parapet
    const x0 = 13 - OFF[0] - 2.5, x1 = 13 - OFF[0] + 2.0, y0 = -50 - OFF[1], y1 = 69.2 - OFF[1]
    for (let k = 0; k < 20; k++) {
      const ya = y0 + ((y1 - y0) * k) / 20, yb = y0 + ((y1 - y0) * (k + 1)) / 20
      oq(stone, [x1, ya, 0], [x1, yb, 0], [x1 - 0.8, yb, 10.5], [x1 - 0.8, ya, 10.5], [1, 0, 0])
      oq(stone, [x0, yb, 6.5], [x0, ya, 6.5], [x0, ya, 10.5], [x0, yb, 10.5], [-1, 0, 0])
    }
    oq(plaster, [x0, y0, 10.5], [x1 - 0.8, y0, 10.5], [x1 - 0.8, y1, 10.5], [x0, y1, 10.5], [0, 0, 1])
  }

  // ---------------- the keep inside ----------------
  {
    const kx = (v: number) => v - OFF[0], ky = (v: number) => v - OFF[1]
    // the keep block and its higher tower with a garita (d67, b01, pan)
    bastion(rrect(kx(-38), kx(-14), ky(-14), ky(6), 0.6, 1), 16, 0.3)
    bastion(rrect(kx(-14), kx(-2), ky(-6), ky(6), 0.5, 1), 19, 0.3)
    garita(kx(-3.2), ky(4.8), 18)
    // a lower inner range along the south side of the court
    bastion(rrect(kx(-50), kx(-20), ky(-40), ky(-30), 0.5, 1), 12.5, 0.2)
    loopholes([kx(-38) + 2, ky(-14) + 0.1], [kx(-14) - 2, ky(-14) + 0.1], 12, 4)
    // the gate in the south wall (d53): a dark round-headed doorway on the outer face
    const g: P2 = [kx(18), ky(-35.6)]
    void g
  }

  const flood = (_p: V3, n: V3) => (Math.abs(n[2]) < 0.6 ? 0.85 : 0.15)
  return [
    { part: stone, material: { ...finish('qalat-stone', 0xd6c0a0), floodlight: flood } },
    { part: plaster, material: { ...finish('qalat-plaster', 0xe3cfb0), floodlight: flood } },
    { part: dark, material: finish('qalat-shadow', 0x5e4a3a) },
    { part: court_, material: finish('qalat-court', 0xc4ad8c) },
  ]
}

if (import.meta.main) {
  const parts = build()
  const triangles = triCount(parts)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb("Qal'at al-Bahrain", parts, {
    license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 16,
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    replaces: ['way/89370342'],
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/manama-qalat-al-bahrain.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
