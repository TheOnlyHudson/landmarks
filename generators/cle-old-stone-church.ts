/**
 * Old Stone Church (First Presbyterian Church, Charles Heard and Simeon
 * Porter, 1855; rebuilt inside after the fires of 1857 and 1884), 91 Public
 * Square, Cleveland — original procedural geometry, CC0-1.0.
 * bun generators/cle-old-stone-church.ts
 *
 * Map frame of the model: x, y, z up, metres. Anchor = area centroid of
 * the OSM outline way/333522113, -81.6947528 41.5004187. Bearing 325.9:
 * model +y points north-north-west (the back, toward the building behind
 * it), -y is the front on Public Square at Ontario Street, +x is the
 * Ontario Street side. y = 0 is the lowest ground under the footprint (the
 * Ontario Street side, lidar 2.0 m above the box minimum); the front walk
 * is about 0.4 m higher, so the doors stand at 0.4 (0.7 under the short
 * tower, where the map's ground rises toward the west side).
 *
 * Identity, in order: the tall square clock tower on the right-hand (+x)
 * front corner, with corner pinnacles and the slender grey-blue slate spire
 * with gabled lucarnes; the shorter left-hand tower with its green copper
 * pyramid; the dark grey sandstone front gable between them with three
 * round-arched windows and the round-arched door; the long dark slate
 * gable roof of the nave; the side walls with tall round-arched windows
 * between pilaster buttresses.
 *
 * Evidence:
 *  - plan: OSM way/333522113 turned into this frame: x -12.4..11.8,
 *    y -16.8..16, the front gable wall set back to y -15.3. OSM's front
 *    steps put the towers at x 6.0..11.8 and -12.4..-7.2, but the lidar
 *    and the head-on photo (towers ~7 and ~6 m wide, the gable ~11 m
 *    between them) show them wider: drawn x 5.2..11.8 (spire tower) and
 *    -12.4..-6.6 (short tower), each square in plan (back faces
 *    estimated, from the aerial photo).
 *  - heights, measured: USGS 3DEP lidar OH_Statewide_Phase1_1_2019 (2019
 *    flight), 0.5 m grid, read with tools/lidar_frame.py at bearing 325.9,
 *    above y = 0: nave eaves 13.6 at x ±11; ridge 19.2 along x ≈ 0; short
 *    tower cornice 27.2, its pyramid to ~33 (the lidar's 31.7 misses the
 *    sharp apex; the photo's pitch is steeper); spire tower walls ~31,
 *    pinnacles ~35.5; spire top 58.6 (lidar 60.6 − 2.0). The lidar sits
 *    ~0.8 m south of the OSM outline; OSM is followed for the plan.
 *  - estimated from the front photos scaled to the lidar: the storeys of
 *    both towers (string courses, the belfry openings, the clock at 28.6),
 *    the front windows (middle 8.2-14.6, sides 8.6-13.1) and door, the
 *    five bays of tall side windows; the spire's octagon, radius 2.6 at
 *    its foot.
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    https://commons.wikimedia.org/wiki/File:Old_Stone_Church_-_Cleveland,_OH.jpg
 *      Upstateherd, CC BY-SA 4.0 — the front head on.
 *    https://commons.wikimedia.org/wiki/File:Old_Stone_Church_Cleveland_April_2023.jpg
 *      Percival Kestreltail, CC BY-SA 4.0 — the front and the Ontario side; stone colour.
 *    https://commons.wikimedia.org/wiki/File:Old_Stone_Church_(Cleveland)_(2018).jpg
 *      Cards84664, CC BY-SA 4.0 — from above (Key Tower): the roof, the towers' plans, the lucarnes.
 *    https://commons.wikimedia.org/wiki/File:Old_Stone_Church,_Downtown_Cleveland.jpg
 *      Eli Pousson, CC BY-SA 2.0 — from the south-east: front and Ontario side.
 *    https://commons.wikimedia.org/wiki/File:Old_Stone_Church_(Cleve,_OH).jpg
 *      Chris Light, CC BY-SA 4.0 — 1990s, before the spire was restored; the tower top and pinnacles.
 *  - colour: the sandstone is weathered dark grey (kept grey, pulled to
 *    the palette's lightness); the nave roof dark slate; the spire
 *    grey-blue slate; the short tower's pyramid green copper.
 *
 * Left out: the corbel tables (drawn as plain projecting bands), the
 *  rose tracery, the louvres' slats (pale panels), the roof vents, the
 *  crosses on the gable, chimneys. Doors are drawn in the roof's dark
 *  colour (the real doors are dark wood) to stay within six materials.
 * Doubts: the night look (floodlighting) was not checked against a night
 *  photo; only the windows glow. The -x side wall stands against a neighbour and is not
 *  photographed; it repeats the +x side. The rear gable is hidden behind
 *  the building at the back (way/1019579489, not replaced).
 *
 * Night: the windows glow (`window`); the clock faces are trim.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { arch, band, grow, poly, wallsSplit } from './pit-allegheny-county-courthouse'

function build() {
  const stone = new Part(), slate = new Part(), spire = new Part(), copper = new Part(), win = new Part(), trim = new Part()

  const X0 = -11.9, X1 = 11.8, YF = -15.3, YB = 15.8
  const EAVE = 13.6, RIDGE = 19.2, RX = -0.05
  const DOOR = 0.4

  // ---------------------------------------------------------------- nave
  const nave: [number, number, number, number] = [X0, YF, X1, YB]
  wallsSplit(stone, [[X0, YF], [X1, YF], [X1, YB], [X0, YB]], 0, EAVE, 5)
  band(stone, rect(...nave), grow(nave, 0.3), EAVE - 0.6, EAVE, 0.3)
  band(stone, rect(...nave), grow(nave, 0.2), 0, 0.9, 0.15)
  // the gable walls front and back, standing a little proud of the roof
  const slope = (RIDGE - EAVE) / (X1 - RX)
  for (const [y, out] of [[YF, -1], [YB, 1]] as [number, number][]) {
    const t = 0.6
    const ya = y, yb = y - out * t
    const prof: XY[] = [[X0, EAVE], [X1, EAVE], [X1, EAVE + 0.45], [RX, RIDGE + 0.25], [X0, EAVE + 0.45]]
    const f = prof.map(([x, z]) => [x, ya, z] as V3), b = prof.map(([x, z]) => [x, yb, z] as V3)
    poly(stone, f, [0, out, 0])
    poly(stone, b, [0, -out, 0])
    for (const [i, j] of [[2, 3], [3, 4]]) {
      const m: V3 = [(f[i][0] + f[j][0]) / 2 - RX, 0, (f[i][2] + f[j][2]) / 2 - EAVE]
      poly(stone, [f[i], f[j], b[j], b[i]], m)
    }
  }
  // the slate roof between the gables
  {
    const o = 0.35, y0 = YF + 0.6, y1 = YB - 0.6
    const ez = EAVE - o * slope
    const L: V3[] = [[X0 - o, y0, ez], [X0 - o, y1, ez], [RX, y1, RIDGE], [RX, y0, RIDGE]]
    const R: V3[] = [[X1 + o, y0, ez], [RX, y0, RIDGE], [RX, y1, RIDGE], [X1 + o, y1, ez]]
    poly(slate, L, [-slope, 0, 1])
    poly(slate, R, [slope, 0, 1])
    poly(slate, [[X0 - o, y0, ez], [X1 + o, y0, ez], [X1 + o, y1, ez], [X0 - o, y1, ez]], [0, 0, -1])
  }
  // side walls: pilaster buttresses and five tall round-arched windows a side
  for (const [a, b] of [[[X1, -10.2], [X1, YB]], [[X0, YB], [X0, -10.9]]] as [XY, XY][]) {
    const { L } = onWall(a, b), n = 5, pitch = L / n
    for (let i = 0; i <= n; i++) {
      const s = i * pitch
      const { P } = onWall(a, b)
      const r: XY[] = [P(Math.max(0, s - 0.45), 0, 0), P(Math.min(L, s + 0.45), 0, 0), P(Math.min(L, s + 0.45), 0, 0.45), P(Math.max(0, s - 0.45), 0, 0.45)].map(q => [q[0], q[1]] as XY)
      if (i > 0 && i < n) { walls(stone, r, 0, EAVE - 0.6); cap(stone, r, EAVE - 0.6) }
    }
    for (let i = 0; i < n; i++) {
      const s = (i + 0.5) * pitch
      arch(win, a, b, s - 0.85, s + 0.85, 4.6, 10.0, 0.05, 8)
      panel(stone, a, b, s - 1.1, s + 1.1, 4.3, 4.6, 0.12)
    }
  }

  // ---------------------------------------------------------------- front
  {
    const a: XY = [-6.6, YF], b: XY = [5.2, YF]
    const { L } = onWall(a, b), m = L / 2
    walls(stone, rect(-6.6, YF - 0.25, 5.2, YF), 7.2, 7.6)
    cap(stone, rect(-6.6, YF - 0.25, 5.2, YF), 7.6)
    arch(win, a, b, m - 0.85, m + 0.85, 8.2, 13.8, 0.05, 8)
    for (const s of [m - 2.4, m + 2.4]) arch(win, a, b, s - 0.55, s + 0.55, 8.6, 12.55, 0.05, 8)
    arch(slate, a, b, m - 1.0, m + 1.0, DOOR, 3.6, 0.05, 8) // the main door
    arch(win, a, b, m - 1.0, m + 1.0, 3.6, 3.6, 0.07, 8)
    for (const s of [m - 3.6, m + 3.6]) arch(win, a, b, s - 0.45, s + 0.45, 2.0, 4.2, 0.05, 6)
  }

  // ---------------------------------------------------------------- towers
  /** Arched openings on the faces of a tower box that show. */
  const faces = (r: [number, number, number, number], which: number[]) => {
    const f: [XY, XY][] = [[[r[0], r[1]], [r[2], r[1]]], [[r[2], r[1]], [r[2], r[3]]], [[r[2], r[3]], [r[0], r[3]]], [[r[0], r[3]], [r[0], r[1]]]]
    return which.map(i => f[i])
  }

  // the short tower, with the copper pyramid
  {
    const r: [number, number, number, number] = [-12.4, -16.7, -6.6, -10.9]
    wallsSplit(stone, rect(...r), 0, 26.6, 5)
    band(stone, rect(...r), grow(r, 0.2), 0, 0.9, 0.15)
    band(stone, rect(...r), grow(r, 0.22), 17.3, 17.8, 0.15)
    band(stone, rect(...r), grow(r, 0.35), 26.4, 27.2, 0.3)
    cap(stone, rect(...r), 27.2)
    const cx = (r[0] + r[2]) / 2, cy = (r[1] + r[3]) / 2
    const g = grow(r, 0.45), tip: V3 = [cx, cy, 33.0]
    for (let i = 0; i < 4; i++) {
      const p0 = g[i], p1 = g[(i + 1) % 4]
      poly(copper, [[p0[0], p0[1], 27.0], [p1[0], p1[1], 27.0], tip], [(p0[0] + p1[0]) / 2 - cx, (p0[1] + p1[1]) / 2 - cy, 0.6])
    }
    cap(copper, g, 27.0, false)
    for (const [a, b] of faces(r, [0, 1, 2, 3])) {
      const { L } = onWall(a, b), m = L / 2
      // a louvred belfry opening, two storeys of arched windows below
      arch(trim, a, b, m - 0.6, m + 0.6, 19.2, 22.6, 0.05, 6)
      arch(win, a, b, m - 0.55, m + 0.55, 13.2, 15.4, 0.05, 6)
      arch(win, a, b, m - 0.55, m + 0.55, 8.0, 10.6, 0.05, 6)
      if (a[1] === r[1] && b[1] === r[1]) arch(slate, a, b, m - 0.7, m + 0.7, 0.7, 3.2, 0.05, 6)
    }
  }

  // the clock tower and spire
  {
    const r: [number, number, number, number] = [5.2, -16.8, 11.8, -10.2]
    const cx = (r[0] + r[2]) / 2, cy = (r[1] + r[3]) / 2, TOP = 31.0
    wallsSplit(stone, rect(...r), 0, TOP - 0.7, 5)
    band(stone, rect(...r), grow(r, 0.2), 0, 0.9, 0.15)
    band(stone, rect(...r), grow(r, 0.25), 18.6, 19.2, 0.2)
    band(stone, rect(...r), grow(r, 0.25), 26.9, 27.4, 0.2)
    band(stone, rect(...r), grow(r, 0.4), TOP - 0.7, TOP, 0.3)
    cap(stone, rect(...r), TOP)
    // corner pilasters
    for (const [sx, sy] of [[0, 1], [2, 1], [2, 3], [0, 3]]) {
      const px = r[sx], py = r[sy], dx = sx === 0 ? 1 : -1, dy = sy === 1 ? 1 : -1
      const q: XY[] = rect(Math.min(px - dx * 0.15, px + dx * 0.9), Math.min(py - dy * 0.15, py + dy * 0.9), Math.max(px - dx * 0.15, px + dx * 0.9), Math.max(py - dy * 0.15, py + dy * 0.9))
      walls(stone, q, 0.9, TOP - 0.7)
      // the pinnacle on top
      const pcx = px + dx * 0.35, pcy = py + dy * 0.35
      lathe(stone, pcx, pcy, [[0.65, TOP], [0.65, 33.3], [0.8, 33.5], [0.01, 35.8]], 8)
    }
    for (const [a, b] of faces(r, [0, 1, 2, 3])) {
      const { L } = onWall(a, b), m = L / 2
      arch(trim, a, b, m - 0.85, m + 0.85, 20.6, 25.0, 0.05, 8) // the louvred belfry
      const { P, n } = onWall(a, b)
      const rose: V3[] = Array.from({ length: 10 }, (_, k) => P(m + 0.55 * Math.cos(k * Math.PI / 5), 25.05 + 0.55 * Math.sin(k * Math.PI / 5), 0.08))
      poly(win, rose, [n[0], n[1], 0])
      const clock: V3[] = Array.from({ length: 12 }, (_, k) => P(m + 0.8 * Math.cos(k * Math.PI / 6), 28.7 + 0.8 * Math.sin(k * Math.PI / 6), 0.06))
      poly(trim, clock, [n[0], n[1], 0])
      arch(win, a, b, m - 0.55, m + 0.55, 14.2, 16.4, 0.05, 6)
      arch(win, a, b, m - 0.6, m + 0.6, 8.0, 10.6, 0.05, 6)
      if (a[1] === r[1] && b[1] === r[1]) arch(slate, a, b, m - 0.75, m + 0.75, DOOR, 3.0, 0.05, 6)
    }
    // the octagonal spire, with a gabled lucarne on each face of the tower
    const R0 = 2.6, TIP = 57.6, seg = 8, a0 = Math.PI / 8
    lathe(spire, cx, cy, [[R0 + 0.1, TOP], [R0, TOP + 0.5], [0.2, TIP - 0.3], [0.01, TIP]], seg, a0)
    for (let k = 0; k < 4; k++) {
      const t = k * Math.PI / 2, ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux
      const d = 2.55, w = 1.1, z0 = TOP, z1 = 33.3, z2 = 35.6, back = 1.6
      const F = (s: number, z: number, o: number): V3 => [cx + ux * (d - o) + vx * s, cy + uy * (d - o) + vy * s, z]
      const front = [F(-w, z0, 0), F(w, z0, 0), F(w, z1, 0), F(0, z2, 0), F(-w, z1, 0)]
      poly(spire, front, [ux, uy, 0])
      poly(spire, [F(w, z0, 0), F(w, z0, back), F(w, z1, back), F(w, z1, 0)], [vx, vy, 0])
      poly(spire, [F(-w, z0, back), F(-w, z0, 0), F(-w, z1, 0), F(-w, z1, back)], [-vx, -vy, 0])
      poly(spire, [F(w, z1, 0), F(w, z1, back), F(0, z2, back), F(0, z2, 0)], [vx, vy, 1])
      poly(spire, [F(-w, z1, back), F(-w, z1, 0), F(0, z2, 0), F(0, z2, back)], [-vx, -vy, 1])
      poly(win, [F(-0.35, 32.0, -0.05), F(0.35, 32.0, -0.05), F(0.35, 33.2, -0.05), F(0, 33.7, -0.05), F(-0.35, 33.2, -0.05)], [ux, uy, 0])
    }
    // the cross
    const bar = (p: V3, q: V3, w: number) => {
      const r2: XY[] = rect(-w / 2, -w / 2, w / 2, w / 2)
      if (p[0] === q[0] && p[1] === q[1]) { walls(spire, r2.map(([x, y]) => [x + p[0], y + p[1]] as XY), p[2], q[2]); cap(spire, r2.map(([x, y]) => [x + p[0], y + p[1]] as XY), q[2]) }
    }
    bar([cx, cy, TIP - 0.2], [cx, cy, 58.6], 0.16)
    {
      const ring: XY[] = rect(cx - 0.4, cy - 0.06, cx + 0.4, cy + 0.06)
      walls(spire, ring, 57.95, 58.1)
      cap(spire, ring, 58.1)
      cap(spire, ring, 57.95, false)
    }
  }

  return [
    { part: stone, material: finish('cle-osc-sandstone', 0xa7a49c) },
    { part: slate, material: finish('cle-osc-slate', 0x5d6167) },
    { part: spire, material: finish('cle-osc-spire-slate', 0x8d9fb5) },
    { part: copper, material: PALETTE.copper },
    { part: win, material: PALETTE.window },
    { part: trim, material: PALETTE.trim },
  ]
}

if (import.meta.main) await save('cle-old-stone-church', 'Old Stone Church', [41.5004187, -81.6947528], 325.9, build() as any, 5000)
