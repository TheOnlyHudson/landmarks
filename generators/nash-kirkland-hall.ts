/**
 * Kirkland Hall, Vanderbilt University, Nashville (1875 "Main Building",
 * rebuilt after the 1905 fire with a single tall clock tower; red brick and
 * white limestone, Victorian Gothic): procedural, CC0-1.0.
 * bun generators/nash-kirkland-hall.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 328.7 (the
 * OSM walls run at 328.7° / 58.7°): +y is the long main block's axis
 * (NNW), +x points ENE. Anchor: the area centroid of OSM way/544397715
 * (Q129068411), -86.8027985, 36.1482137. The plan is that outline: a
 * 17 × 54 m main block, a gabled cross wing reaching 22 m to the WSW with
 * the Gothic entrance at its end, a short pavilion on the ENE side.
 * y = 0 is the lowest ground under the footprint (lidar 166.85 m, the ENE
 * side); the WSW entrance end stands 1.1–1.7 m higher.
 *
 * Lidar (measured): USGS 3DEP TN_DavidsonCo_1_2022 (2022), 0.5 m grid, read
 * with tools/lidar_frame.py at bearing 328.7, above y = 0: flat roofs 19.8;
 * crenellated parapets 20.8–21.4 (ENE pavilion 22.5); the cross wing's
 * low-pitched roof, eaves 20.2, ridge 22.8, running from the WSW end to
 * x = 7; clock tower 6.7 × 7.0 m at (10.9, -12.0), roof 51.1, merlons 52.4.
 *
 * Photos (EVIDENCE, Wikimedia Commons; local copies in
 * landmarks-scratch/nash/work/nash-kirkland-hall/photos):
 *  k01 "Kirkland Hall at Vanderbilt University.jpg", Jaydenwithay, CC BY 4.0
 *      https://commons.wikimedia.org/wiki/File:Kirkland_Hall_at_Vanderbilt_University.jpg
 *  k02 "Kirkland Hall.jpg", BugsMeanee, CC BY-SA 4.0 (night: tower floodlit)
 *      https://commons.wikimedia.org/wiki/File:Kirkland_Hall.jpg
 *  k03 "KirklandVanderbilt.JPG", Jbaker08, public domain (the Gothic portal)
 *      https://commons.wikimedia.org/wiki/File:KirklandVanderbilt.JPG
 *  k04 "KirklandHallVU.JPG", Jbaker08, public domain (parapet, frieze, windows)
 *      https://commons.wikimedia.org/wiki/File:KirklandHallVU.JPG
 *  k05, k06 "VandyKirklandTower.JPG", "VanderbiltKirlandTower2.JPG",
 *      Dansan4444, CC BY-SA 3.0 (tower stages, clock, belfry, parapet)
 *      https://commons.wikimedia.org/wiki/File:VandyKirklandTower.JPG
 *      https://commons.wikimedia.org/wiki/File:VanderbiltKirlandTower2.JPG
 *  k07 "Vandy-kirkland.jpg", Reid Sullivan, CC BY-SA 3.0 (whole front)
 *      https://commons.wikimedia.org/wiki/File:Vandy-kirkland.jpg
 *  k08 "2019 Sit-in.jpg", public domain (entrance stairs)
 *      https://commons.wikimedia.org/wiki/File:2019_Sit-in.jpg
 *  USGS NAIP (public domain): plan; teal metal roof on the cross wing,
 *  grey flat roofs on the rest.
 * No look-only sources. No commercial imagery.
 *
 * Estimated (from the photos, scaled to the lidar): tower stages — white
 * stone string courses, the clock stage (faces 3.0 m across at 37.5 m),
 * the belfry with two tall pointed louvred openings a face, the white
 * crenellated parapet with corner turrets; four storeys of pointed-arch
 * windows at a 3.4 m bay rhythm; the white frieze band (lettered
 * "KIRKLAND HALL" on the real building, drawn plain) and water table; the
 * portal's size (6.4 m wide gabled frontispiece, 5.2 m pointed arch).
 * Doubts: the bay rhythm and the window count on each face are generic
 * (photos show parts of the facades, mostly behind trees); the rear (NNW)
 * end is unphotographed.
 * Left out: the entrance stairs (outside the outline), railings, the
 * lettering, the small pinnacles beside the portal, chimneys.
 * Night: the tower is floodlit (k02); windows glow; the portal doors are
 * `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, capRing, ccw, flatShape, extrudeShape, archShape, arc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, quadO, triO } from './nash-tennessee-state-capitol'

// OSM way/544397715 in the model frame.
const PLAN: XY[] = ccw([[-22.9, -7.9], [-22.9, -6.2], [-26.7, -6.2], [-26.7, 6.8], [-23.4, 6.8], [-23.4, 8.9], [-4.5, 8.8], [-4.5, 26.7], [12.3, 26.6], [12.3, 14.4], [14.0, 14.4], [14.0, 9.0], [18.2, 9.0], [18.2, -8.8], [16.3, -8.8], [16.3, -14.0], [12.3, -14.0], [12.3, -26.9], [-4.5, -26.8], [-4.5, -8.0]])
const ROOF = 19.8, PAR = 20.6, MER = 21.4
const TX = 10.9, TY = -12.0, THX = 3.0, THY = 3.1, TROOF = 51.1, TTOP = 52.4

/** A pointed (two-centred) arch outline: jambs from z0, the head from zs, apex sharpness k (radius = k × width). */
function pointed(s: number, w: number, z0: number, zs: number, k = 0.8, n = 4): XY[] {
  const r = k * w, h = w / 2, out: XY[] = [[s - h, z0], [s + h, z0]]
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * (Math.acos((r - h) / r))
    out.push([s + h - r + r * Math.cos(a), zs + r * Math.sin(a)])
  }
  for (let i = n - 1; i >= 0; i--) {
    const a = (i / n) * (Math.acos((r - h) / r))
    out.push([s - h + r - r * Math.cos(a), zs + r * Math.sin(a)])
  }
  return out
}

function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), cu = new Part(), win = new Part(), door = new Part()
  const n = PLAN.length

  // ---------------------------------------------------------- the body, walls split for the terrain
  for (let i = 0; i < n; i++) {
    const a = PLAN[i], b = PLAN[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const out: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L], m = Math.max(1, Math.ceil(L / 5))
    const P = (t: number, z: number, d = 0): V3 => [a[0] + (b[0] - a[0]) * t + out[0] * d, a[1] + (b[1] - a[1]) * t + out[1] * d, z]
    for (let k = 0; k < m; k++) {
      quadO(brick, P(k / m, 1.6), P((k + 1) / m, 1.6), P((k + 1) / m, ROOF), P(k / m, ROOF), [out[0], out[1], 0])
      quadO(stone, P(k / m, 0), P((k + 1) / m, 0), P((k + 1) / m, 1.6, 0.12), P(k / m, 1.6, 0.12), [out[0], out[1], 0])
    }
    // water table top, frieze band, parapet, merlons
    const f: Face = { o: [a[0], a[1], 0], n: out }
    extrudeShape(stone, f, [[0, 17.4], [L, 17.4], [L, ROOF], [0, ROOF]].map(([s, z]) => [s, z] as XY), 0, 0.15, true)
    extrudeShape(stone, f, [[0, 1.45], [L, 1.45], [L, 1.6], [0, 1.6]].map(([s, z]) => [s, z] as XY), 0.12, 0.2, false)
    // windows: pointed heads, four storeys, a 3.4 m bay rhythm
    const bays = Math.floor((L - 1.2) / 3.4)
    if (bays >= 1) {
      const pad = (L - bays * 3.4) / 2
      for (let k = 0; k < bays; k++) {
        const s = pad + 1.7 + k * 3.4 // s runs from a to b on this face
        for (const [z0, zs] of [[2.4, 4.6], [6.4, 9.2], [10.7, 13.3], [14.3, 16.1]]) {
          flatShape(stone, f, pointed(s, 1.75, zs - 0.15, zs - 0.15, 0.8, 3), 0.04)
          flatShape(win, f, pointed(s, 1.35, z0, zs, 0.8, 3), 0.07)
        }
      }
    }
  }
  // roof cap, parapet and battlements
  capRing(roof, PLAN, ROOF)
  const ringPar = PLAN
  for (let i = 0; i < n; i++) {
    const a = ringPar[i], b = ringPar[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const out: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const P = (t: number, z: number, d: number): V3 => [a[0] + (b[0] - a[0]) * t + out[0] * d, a[1] + (b[1] - a[1]) * t + out[1] * d, z]
    const hi = a[0] > 18 || b[0] > 18 ? 1.2 : 0 // the ENE pavilion's parapet stands higher
    quadO(stone, P(0, ROOF - 0.3, 0.2), P(1, ROOF - 0.3, 0.2), P(1, PAR + hi, 0.2), P(0, PAR + hi, 0.2), [out[0], out[1], 0])
    quadO(stone, P(0, PAR + hi, 0.2), P(1, PAR + hi, 0.2), P(1, PAR + hi, -0.35), P(0, PAR + hi, -0.35), [0, 0, 1])
    quadO(stone, P(0, ROOF - 0.3, 0.2), P(1, ROOF - 0.3, 0.2), P(1, ROOF - 0.3, 0), P(0, ROOF - 0.3, 0), [0, 0, -1])
    quadO(stone, P(1, ROOF, -0.35), P(0, ROOF, -0.35), P(0, PAR + hi, -0.35), P(1, PAR + hi, -0.35), [-out[0], -out[1], 0])
    const mm = Math.max(1, Math.round(L / 2.3))
    for (let k = 0; k < mm; k++) {
      const t0 = (k + 0.25) / mm, t1 = (k + 0.75) / mm
      const A = P(t0, PAR + hi, 0.2), B = P(t1, PAR + hi, 0.2), C = P(t1, PAR + hi, -0.35), D = P(t0, PAR + hi, -0.35)
      const up = (v: V3): V3 => [v[0], v[1], MER + hi]
      quadO(stone, A, B, up(B), up(A), [out[0], out[1], 0])
      quadO(stone, C, D, up(D), up(C), [-out[0], -out[1], 0])
      quadO(stone, B, C, up(C), up(B), [b[0] - a[0], b[1] - a[1], 0])
      quadO(stone, D, A, up(A), up(D), [a[0] - b[0], a[1] - b[1], 0])
      quadO(stone, up(A), up(B), up(C), up(D), [0, 0, 1])
    }
  }

  // ---------------------------------------------------------- the cross wing's teal roof (x -26.7 .. 7)
  {
    const x0 = -26.7, x1 = 7.0, w = 8.4, ze = 20.2, zr = 22.8
    for (const sy of [-1, 1]) quadO(cu, [x0, sy * w, ze], [x1, sy * w, ze], [x1, 0.4, zr], [x0, 0.4, zr], [0, sy * (zr - ze), w])
    // gable end over the entrance, in brick with a stone coping
    triO(brick, [x0, -w, ROOF], [x0, w, ROOF], [x0, 0.4, zr], [-1, 0, 0])
    triO(brick, [x1, -w, ze], [x1, w, ze], [x1, 0.4, zr], [1, 0, 0])
  }

  // ---------------------------------------------------------- the Gothic portal on the WSW end
  {
    const f: Face = { o: [-26.7, 0, 0], n: [-1, 0] } // s runs toward -y
    const s0 = -0.3, base = 1.6
    extrudeShape(stone, f, [[s0 - 3.2, 0], [s0 + 3.2, 0], [s0 + 3.2, 9.0], [s0, 11.6], [s0 - 3.2, 9.0]], 0, 0.9)
    flatShape(stone, { o: [-27.6, 0, 0], n: [-1, 0] }, pointed(s0, 4.2, base, 5.2, 0.85, 5), 0.02)
    flatShape(win, { o: [-27.6, 0, 0], n: [-1, 0] }, pointed(s0, 3.0, base + 3.9, 5.6, 0.85, 4), 0.05)
    flatShape(door, { o: [-27.6, 0, 0], n: [-1, 0] }, rect(s0 - 1.5, base, s0 + 1.5, base + 3.8), 0.05)
    for (const s of [s0 - 3.0, s0 + 3.0]) {
      const y = -s
      box(stone, -27.85, y - 0.4, -26.7, y + 0.4, 0, 9.4, stone, 0.1)
    }
  }

  // ---------------------------------------------------------- the clock tower
  const T = rect(TX - THX, TY - THY, TX + THX, TY + THY)
  prism(brick, null, T, 0, 48.6)
  // the white stone top stage under the battlements (k06)
  prism(stone, null, chamfer(rect(TX - THX - 0.12, TY - THY - 0.12, TX + THX + 0.12, TY + THY + 0.12), 0.08), 48.6, TROOF)
  capRing(roof, T, TROOF)
  const courses = [ROOF, 27.0, 34.5, 40.5]
  for (const z of courses) prism(stone, stone, chamfer(rect(TX - THX - 0.2, TY - THY - 0.2, TX + THX + 0.2, TY + THY + 0.2), 0.1), z, z + 0.5)
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as XY[]) {
    const half = nx ? THX : THY
    const f: Face = { o: [TX + nx * THX, TY + ny * THY, 0], n: [nx, ny] }
    // clock stage: a pale square panel with the dial
    flatShape(stone, f, arc(0, 37.65, 1.75, 0, 360, 14).slice(0, -1), 0.05)
    flatShape(win, f, arc(0, 37.65, 1.45, 0, 360, 14).slice(0, -1), 0.1)
    // belfry: two tall pointed louvred openings in white stone frames
    for (const s of [-1.1, 1.1]) {
      flatShape(stone, f, pointed(s, 1.6, 41.3, 46.4, 0.8, 4), 0.05)
      flatShape(win, f, pointed(s, 1.15, 41.6, 46.2, 0.8, 4), 0.09)
    }
    // slit windows down the shaft
    for (const z of [3.0, 9.0, 15.0, 22.0, 28.5]) if (nx > 0 || z > 20) flatShape(win, f, pointed(0, 0.8, z, z + 3.2, 0.8, 2), 0.06)
    // white parapet with merlons
    extrudeShape(stone, f, rect(-half - 0.25, TROOF - 0.6, half + 0.25, TROOF + 0.4), 0, 0.25)
    for (const s of [-half + 0.6, -0.9, 0.9, half - 0.6].filter((v, i, arr) => arr.indexOf(v) === i)) {
      extrudeShape(stone, f, rect(s - 0.45, TROOF + 0.4, s + 0.45, TTOP), -0.1, 0.25)
    }
  }
  // corner turrets
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = TX + sx * (THX - 0.1), y = TY + sy * (THY - 0.1)
    box(stone, x - 0.55, y - 0.55, x + 0.55, y + 0.55, TROOF - 1.6, TTOP + 0.9, stone, 0.12)
  }

  // ---------------------------------------------------------- materials and night
  const tower = (p: V3, nn: V3) => (Math.abs(p[0] - TX) < THX + 1 && Math.abs(p[1] - TY) < THY + 1 && p[2] > ROOF && nn[2] < 0.7 ? 1 : 0)
  return finishGlb('Kirkland Hall', [
    { part: brick, material: { ...finish('kirkland-brick', 0xb8705b), floodlight: tower } },
    { part: stone, material: { ...finish('kirkland-limestone', 0xece5d6), floodlight: tower } },
    { part: roof, material: PALETTE.roof },
    { part: cu, material: PALETTE.patina },
    { part: win, material: PALETTE.window },
    { part: door, material: { name: 'entrance', color: 0x7a5a3e, roughness: 0.7 } },
  ], { bearing: 328.7, height: TTOP + 0.9, replaces: ['way/544397715'] }, 6500)
}

if (import.meta.main) await writeModel('nash-kirkland-hall', build())
