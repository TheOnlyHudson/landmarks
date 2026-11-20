/**
 * James A. Garfield Memorial (George Keller, architect; dedicated 1890),
 * Lake View Cemetery, Cleveland — original procedural geometry, CC0-1.0.
 * bun generators/cle-garfield-memorial.ts
 *
 * Map frame of the model: x, y, z up, metres. Anchor = area centroid of
 * the OSM outline way/345315398 (the crypt terrace), -81.5913918
 * 41.5100384. Bearing 7: the memorial is square to the compass within a
 * few degrees; the porch and stairs face west (-x), the round tower stands
 * east of it. y = 0 is the lawn at the foot of the west stairs (lidar 8.6
 * above the box minimum); the ground round the terrace is within 0.4 m of
 * it. Elevation 0. The map's terrain shows the terrace as a mound; the
 * model draws it to its lidar height (docs/evidence.md, "The map's
 * terrain").
 *
 * Identity, in order: the round dark sandstone tower with its pale arcaded
 * belvedere and dark conical roof with a cross; the square porch on the
 * west with the great arched entrance between two smaller arches, the pale
 * relief frieze, cornice and balustrade, and the square corner turrets
 * with pyramid caps; the lower drum of the memorial hall with twin arched
 * windows under pale arches and gables between pinnacled buttresses; the
 * rusticated crypt terrace with the wide flight of steps to the porch.
 *
 * Evidence:
 *  - plan: OSM way/345315398 (building=yes, historic=building, wikidata
 *    Q1494202), turned into this frame: the terrace, x -15.7..17.7,
 *    y -12.9..13.3. It agrees with the lidar terrace edge within ~1 m.
 *  - heights, measured: USGS 3DEP lidar OH_Statewide_Phase1_1_2019 (2019
 *    flight), 0.5 m grid, read with tools/lidar_frame.py at bearing 7 and
 *    as a radial profile about the tower axis, above y = 0: terrace 3.5;
 *    porch block x -9.3..-1.3 (19 m wide), balustrade 16.2-17.4; turret
 *    pyramids ~25 (lidar 22-24 beside trees); tower axis 10.8 m east of
 *    the porch front; cone eave radius ~9.1 at 35.4, cone median slope
 *    ~1.4 rising to 46.5-48.8 at the axis (the apex itself is sparse):
 *    drawn apex 48.7, cross to 50.8. No ring of roof shows outside r 9.5,
 *    so the hall's drum is drawn r 9.0 and the shaft r 8.2. The west
 *    stairs show as ground rising from 0 at x ~-22 to the terrace.
 *  - published: George Keller architect, dedicated 30 May 1890 (Wikipedia
 *    "James A. Garfield Memorial"; National Register 1973). The often
 *    quoted 180 ft (55 m) is not borne out by the lidar (~50 m above the
 *    lawn); the lidar is followed.
 *  - estimated from the photos scaled to the lidar: the porch arches
 *    (great arch 7.4 m wide, crown ~11.6; side arches 3.4 m, crown ~10),
 *    frieze 13.0-15.1, the hall's windows 7.4-12.1 and gables to 16.5, the
 *    hall cornice 16.6-17.6, the shaft string course, the belvedere
 *    27.6-35.7 with 16 arches, the stair width (9 m between cheek walls;
 *    the lidar sees ~6 m between the spruces, the photos read wider).
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    https://commons.wikimedia.org/wiki/File:James_A._Garfield_Memorial,_Lakeview_Cemetery,_Cleveland_Ohio.jpg
 *      Ray Curtis, CC BY-SA 4.0 — the west front head on.
 *    https://commons.wikimedia.org/wiki/File:Garfield_Memorial_and_surroundings.jpg
 *      Kevin Payravi, CC BY-SA 4.0 — the west front from farther off.
 *    https://commons.wikimedia.org/wiki/File:Cleveland_Garfield_Memorial_angled_view.jpg
 *      Kevin Payravi, CC BY-SA 4.0 — from the south-west: the porch side, frieze, turret.
 *    https://commons.wikimedia.org/wiki/File:James_A._Garfield_Memorial_(21884478574).jpg
 *      Erik Drost, CC BY 2.0 — the porch front: arches, rose, frieze panels, balustrade.
 *    https://commons.wikimedia.org/wiki/File:James_A._Garfield_Memorial_(22317732350).jpg
 *      Erik Drost, CC BY 2.0 — the west front with the stairs and pedestals.
 *    https://commons.wikimedia.org/wiki/File:Looing_NW_at_Garfield_Memorial_-_Lake_View_Cemetery_-_2014-11-26_(17541577595).jpg
 *      Tim Evanson, CC BY-SA 2.0 — from the south-east: the hall drum, terrace wall.
 *    https://commons.wikimedia.org/wiki/File:S_side_-_Garfield_Memorial_-_Lake_View_Cemetery_-_2014-11-26_(16919075404).jpg
 *      Tim Evanson, CC BY-SA 2.0 — (despite the title, from the north-east)
 *      the hall's window bays, gables and buttresses, the shaft, the terrace.
 *    USGS NAIP orthophoto (public domain) for the plan.
 *  - colour: the Berea sandstone has weathered to a dark brown-grey
 *    (pulled to 0x625c55, lighter than in the photos); the frieze,
 *    arches, belvedere and copings are pale buff; the cone is dark tile.
 *
 * Left out: the relief sculpture (pale panels), the balusters (a solid
 *  pale parapet), the belvedere's colonnettes, the corbel tables, the
 *  bronze door grilles, the flagpole. Gargoyles are small blocks.
 * Doubts: the cone looks squatter in every photo than the lidar profile
 *  says (perspective from below; the lidar is followed). The east side of
 *  the terrace and its door are only seen obliquely. The night look was
 *  not checked against a night photo; only the windows glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cap, circle, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { arch, band, grow, poly, wallsSplit } from './pit-allegheny-county-courthouse'

/** A flat, slightly pointed arched panel on wall a→b (k = radius / width; 0.5 is round). */
export function pointed(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, k = 0.55, seg = 5) {
  const { P } = onWall(a, b)
  const w = s1 - s0, R = w * k, c = (s0 + s1) / 2
  const th = Math.acos((c - (s1 - R)) / R)
  const pts: XY[] = [[s0, z0], [s1, z0]]
  for (let i = 0; i <= seg; i++) { const t = th * i / seg; pts.push([s1 - R + R * Math.cos(t), zs + R * Math.sin(t)]) }
  for (let i = 1; i <= seg; i++) { const t = Math.PI - th + th * i / seg; pts.push([s0 + R + R * Math.cos(t), zs + R * Math.sin(t)]) }
  const ctr = P(c, (z0 + zs) / 2, out)
  for (let i = 0; i < pts.length; i++) {
    const q = pts[i], n = pts[(i + 1) % pts.length]
    p.tri(ctr, P(q[0], q[1], out), P(n[0], n[1], out))
  }
  return zs + Math.sqrt(R * R - (c - (s1 - R)) ** 2)
}

/** A flat disc on wall a→b (rose window, oculus). */
export function disc(p: Part, a: XY, b: XY, s: number, z: number, r: number, out = 0.06, seg = 10) {
  const { P, n } = onWall(a, b)
  poly(p, Array.from({ length: seg }, (_, k) => P(s + r * Math.cos(k * 2 * Math.PI / seg), z + r * Math.sin(k * 2 * Math.PI / seg), out)), [n[0], n[1], 0])
}

/** A solid box [x0,y0,x1,y1] from z0 to z1, walls split for the terrain. */
function box(p: Part, r: [number, number, number, number], z0: number, z1: number, top: Part | null = p) {
  wallsSplit(p, rect(...r), z0, z1, 5)
  if (top) cap(top, rect(...r), z1)
}

/** A box turned to stand on a facet of a polygon: centre (cx, cy), facing angle t. */
function orientedBox(p: Part, cx: number, cy: number, t: number, w: number, d: number, z0: number, z1: number) {
  const u: XY = [Math.cos(t), Math.sin(t)], v: XY = [-u[1], u[0]]
  const q = (a: number, b: number): XY => [cx + u[0] * a + v[0] * b, cy + u[1] * a + v[1] * b]
  const r = [q(-d / 2, -w / 2), q(d / 2, -w / 2), q(d / 2, w / 2), q(-d / 2, w / 2)]
  walls(p, r, z0, z1)
  cap(p, r, z1)
  return r
}

function build() {
  const stone = new Part(), buff = new Part(), tile = new Part(), win = new Part(), door = new Part()

  // ------------------------------------------------------------ frame
  // Lidar heights above the ground at the foot of the west stairs (lidar 8.6
  // above the box minimum). Tower centre and porch from the lidar grid,
  // read at the old anchor; DX/DY move them onto the OSM centroid anchor.
  const DX = -2.32, DY = 1.68
  const T = 3.5 // terrace top
  const CX = 8.5 + DX, CY = -2.2 + DY // tower axis
  const PY = CY // porch centre line

  // ------------------------------------------------------------ terrace
  // The OSM outline (way/345315398), turned to bearing 7: the crypt terrace.
  const terrace: XY[] = ([[-13.4, -14.6], [13.6, -14.4], [19.9, -6.8], [20.0, 3.5], [12.9, 10.8], [-13.4, 11.6]] as XY[]).map(([x, y]) => [x + DX, y + DY] as XY)
  wallsSplit(stone, terrace, 0, T, 5)
  cap(buff, terrace, T)
  // a plain plinth line and crypt slit windows on the south, east and north walls
  for (let i = 0; i < terrace.length; i++) {
    const a = terrace[i], b = terrace[(i + 1) % terrace.length]
    const { L } = onWall(a, b)
    if (i === terrace.length - 1) continue // the west front: the stairs
    const n = Math.max(1, Math.round(L / 6.5))
    for (let k = 0; k < n; k++) {
      const s = (k + 0.5) * L / n
      arch(win, a, b, s - 0.28, s + 0.28, 1.0, 2.05, 0.04, 4)
    }
  }

  // ------------------------------------------------------------ west stairs
  {
    const x0 = -20.2 + DX, x1 = -13.4 + DX, y0 = PY - 4.5, y1 = PY + 4.5, n = 10
    const run = (x1 - x0) / n, rise = T / n
    for (let i = 0; i < n; i++) {
      const xa = x0 + i * run
      box(stone, [xa, y0, x1 - 0.01, y1], 0, rise * (i + 1), buff)
    }
    // cheek walls rising with the flight, ending in square pedestals
    for (const [w0, w1] of [[y0 - 0.9, y0], [y1, y1 + 0.9]]) {
      const zl = 1.1, zh = T + 0.95
      const S: V3[] = [[x0 + 0.4, w0, 0], [x1, w0, 0], [x1, w0, zh], [x0 + 0.4, w0, zl]]
      const N: V3[] = S.map(([x, , z]) => [x, w1, z] as V3)
      poly(stone, S, [0, -1, 0]); poly(stone, N, [0, 1, 0])
      poly(stone, [S[3], S[2], N[2], N[3]], [-(zh - zl), 0, x1 - x0])
      poly(stone, [S[0], S[3], N[3], N[0]], [-1, 0, 0])
      box(stone, [x0 - 0.2, w0 - 0.25, x0 + 1.3, w1 + 0.25], 0, 1.6, buff)
    }
  }

  // ------------------------------------------------------------ porch
  const PX0 = -7.0 + DX, PX1 = 1.0 + DX, PY0 = PY - 9.5, PY1 = PY + 9.5
  const FRZ0 = 13.0, FRZ1 = 15.1, COR = 16.2, BAL = 17.4
  wallsSplit(stone, rect(PX0, PY0, PX1, PY1), T, COR, 5)
  band(stone, rect(PX0, PY0, PX1, PY1), grow([PX0, PY0, PX1, PY1], 0.25), T, T + 0.6, 0.12)
  band(buff, rect(PX0, PY0, PX1, PY1), grow([PX0, PY0, PX1, PY1], 0.45), COR - 0.7, COR, 0.3)
  // the balustrade (drawn solid) round the porch roof
  {
    const o = rect(PX0 - 0.2, PY0 - 0.2, PX1, PY1 + 0.2), i = rect(PX0 + 0.3, PY0 + 0.3, PX1, PY1 - 0.3)
    walls(buff, o, COR, BAL)
    walls(buff, [...i].reverse(), COR, BAL)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      buff.quad([o[k][0], o[k][1], BAL], [o[l][0], o[l][1], BAL], [i[l][0], i[l][1], BAL], [i[k][0], i[k][1], BAL])
    }
    cap(tile, rect(PX0, PY0, PX1, PY1), COR - 0.1)
  }
  // the west front: the great entrance arch between two smaller arches
  {
    const a: XY = [PX0, PY1], b: XY = [PX0, PY0] // facing west
    const { L } = onWall(a, b), m = L / 2
    pointed(buff, a, b, m - 3.7, m + 3.7, T, 7.8, 0.04)
    pointed(stone, a, b, m - 3.0, m + 3.0, T, 7.8, 0.06) // the deep reveal reads dark
    pointed(buff, a, b, m - 2.6, m + 2.6, 7.1, 7.8, 0.08) // the tympanum
    door.quad(...([[m - 1.7, T], [m + 1.7, T], [m + 1.7, 7.1], [m - 1.7, 7.1]] as XY[]).map(([s, z]) => onWall(a, b).P(s, z, 0.09)) as [V3, V3, V3, V3])
    disc(win, a, b, m, 9.0, 0.95, 0.1)
    for (const s of [m - 5.6, m + 5.6]) {
      pointed(buff, a, b, s - 1.7, s + 1.7, 7.6, 8.1, 0.04)
      pointed(stone, a, b, s - 1.25, s + 1.25, 4.4, 8.1, 0.05)
      arch(win, a, b, s - 1.0, s - 0.1, 4.6, 7.3, 0.07, 6)
      arch(win, a, b, s + 0.1, s + 1.0, 4.6, 7.3, 0.07, 6)
      disc(win, a, b, s, 8.65, 0.42, 0.07, 8)
      panel(buff, a, b, s - 1.6, s + 1.6, 4.2, 4.6, 0.06) // the sill and colonnettes' base
    }
    // the relief frieze: three pale panels between dark piers
    for (const [s0, s1] of [[0.9, 5.0], [5.8, L - 5.8], [L - 5.0, L - 0.9]]) panel(buff, a, b, s0, s1, FRZ0, FRZ1, 0.05)
    panel(buff, a, b, 0.4, L - 0.4, FRZ0 - 0.35, FRZ0 - 0.05, 0.06)
  }
  // the north and south sides: an arch with its tympanum, and the frieze
  for (const [a, b] of [[[PX0, PY0], [PX1, PY0]], [[PX1, PY1], [PX0, PY1]]] as [XY, XY][]) {
    const { L } = onWall(a, b), s = a[0] < b[0] ? 3.2 : L - 3.2
    pointed(buff, a, b, s - 1.9, s + 1.9, 7.3, 8.3, 0.04)
    pointed(stone, a, b, s - 1.4, s + 1.4, 4.4, 8.3, 0.05)
    arch(win, a, b, s - 1.1, s - 0.1, 4.6, 7.4, 0.07, 6)
    arch(win, a, b, s + 0.1, s + 1.1, 4.6, 7.4, 0.07, 6)
    disc(win, a, b, s, 8.9, 0.45, 0.07, 8)
    const f0 = a[0] < b[0] ? 0.6 : L - 6.2
    panel(buff, a, b, f0, f0 + 5.6, FRZ0, FRZ1, 0.05)
  }
  // the square corner turrets with their pyramids, at the porch's back corners
  for (const ty of [PY0 + 1.5, PY1 - 1.5]) {
    const r: [number, number, number, number] = [PX1 - 2.6, ty - 1.3, PX1 + 0.0, ty + 1.3]
    box(stone, r, COR - 0.2, 19.8, null)
    band(buff, rect(...r), grow(r, 0.25), 19.6, 20.1, 0.15)
    const g = grow(r, 0.2), tip: V3 = [(r[0] + r[2]) / 2, ty, 25.2]
    for (let i = 0; i < 4; i++) {
      const p0 = g[i], p1 = g[(i + 1) % 4]
      poly(tile, [[p0[0], p0[1], 20.1], [p1[0], p1[1], 20.1], tip], [(p0[0] + p1[0]) / 2 - tip[0], (p0[1] + p1[1]) / 2 - tip[1], 1])
    }
    cross(tile, tip[0], tip[1], 25.0, 26.4, 0.22, 0.75)
    for (const [a, b] of [[[r[0], r[1]], [r[2], r[1]]], [[r[2], r[3]], [r[0], r[3]]], [[r[0], r[3]], [r[0], r[1]]]] as [XY, XY][]) disc(win, a, b, 1.3, 18.2, 0.42, 0.05, 8)
  }

  // ------------------------------------------------------------ tower
  const N = 16, a0 = -Math.PI / N
  const ring = (r: number) => circle(CX, CY, r, N, a0)
  const facet = (r: number, k: number): [XY, XY] => { const q = ring(r); return [q[k], q[(k + 1) % N]] }
  const ang = (k: number) => k * 2 * Math.PI / N // the facing of facet k (0 = east, 4 = north)
  const west = (k: number) => Math.cos(ang(k)) < -0.6 // facets hidden in the porch

  // the lower drum (the memorial hall): a heavy dark plinth, twin arched
  // windows under pale arches and gables, pinnacled buttresses between
  const R1 = 9.0
  wallsSplit(stone, ring(R1), T - 0.1, 17.0, 5)
  walls(stone, ring(R1 + 0.35), T - 0.1, 6.0)
  walls(stone, ring(R1 + 0.35), 6.0, 6.6, ring(R1))
  band(buff, ring(R1), ring(R1 + 0.4), 16.6, 17.6, 0.35)
  for (let k = 0; k < N; k++) {
    if (west(k)) continue
    const [a, b] = facet(R1, k), { L } = onWall(a, b), m = L / 2
    if (k % 2 === 0) {
      const crown = arch(buff, a, b, m - 1.55, m + 1.55, 7.0, 11.6, 0.04, 8)
      arch(win, a, b, m - 1.15, m - 0.12, 7.4, 11.2, 0.07, 6)
      arch(win, a, b, m + 0.12, m + 1.15, 7.4, 11.2, 0.07, 6)
      disc(win, a, b, m, 12.6, 0.4, 0.07, 8)
      // the gable's pale copings over the arch
      const { P, n } = onWall(a, b), ap = 16.5, z0 = crown - 0.9
      for (const sgn of [-1, 1]) {
        const e0 = P(m + sgn * 1.75, z0, 0.06), e1 = P(m, ap, 0.06), w = 0.35
        poly(buff, [e0, e1, [e1[0], e1[1], e1[2] - w * 1.4], [e0[0], e0[1], e0[2] - w]], [n[0], n[1], 0])
      }
    } else {
      // a buttress with a pinnacle, standing on the facet
      const t = ang(k), rr = R1 + 0.45
      const r = orientedBox(stone, CX + rr * Math.cos(t), CY + rr * Math.sin(t), t, 0.95, 1.0, T - 0.1, 15.2)
      const tip: V3 = [CX + rr * Math.cos(t), CY + rr * Math.sin(t), 17.2]
      for (let i = 0; i < 4; i++) {
        const p0 = r[i], p1 = r[(i + 1) % 4]
        poly(buff, [[p0[0], p0[1], 15.2], [p1[0], p1[1], 15.2], tip], [(p0[0] + p1[0]) / 2 - tip[0], (p0[1] + p1[1]) / 2 - tip[1], 0.5])
      }
    }
  }
  // the roof ring between the hall and the shaft
  {
    const o = ring(R1 + 0.4), i = ring(7.9)
    for (let k = 0; k < N; k++) { const l = (k + 1) % N; tile.quad([o[k][0], o[k][1], 17.6], [o[l][0], o[l][1], 17.6], [i[l][0], i[l][1], 17.9], [i[k][0], i[k][1], 17.9]) }
  }

  // the shaft, the pale arcaded belvedere and the conical roof
  const R2 = 8.2
  lathe(stone, CX, CY, [[R2, 17.5], [R2, 28.6]], N, a0)
  lathe(buff, CX, CY, [[R2, 22.6], [R2 + 0.18, 22.7], [R2 + 0.18, 23.1], [R2, 23.2]], N, a0)
  lathe(buff, CX, CY, [[R2, 27.6], [R2 + 0.3, 27.8], [R2 + 0.3, 28.9], [R2, 28.9], [R2, 34.9], [R2 + 0.45, 35.1], [R2 + 0.45, 35.7]], N, a0)
  for (let k = 0; k < N; k++) {
    const [a, b] = facet(R2, k), { L } = onWall(a, b), m = L / 2
    arch(win, a, b, m - 0.9, m + 0.9, 29.9, 32.7, 0.05, 6)
    if (!west(k) && k % 2 === 1) panel(win, a, b, m - 0.25, m + 0.25, 19.6, 21.2, 0.04) // slit lights in the shaft
  }
  lathe(tile, CX, CY, [[R2 + 0.9, 35.4], [R2 + 0.9, 35.7], [0.3, 48.4], [0.0, 48.7]], N, a0)
  cap(tile, ring(R2 + 0.9), 35.4, false)
  // gargoyles at the eaves
  for (let k = 0; k < 8; k++) {
    const t = (k + 0.5) * Math.PI / 4, rr = R2 + 1.05
    orientedBox(tile, CX + rr * Math.cos(t), CY + rr * Math.sin(t), t, 0.45, 1.3, 34.9, 35.4)
  }
  cross(tile, CX, CY, 48.4, 50.8, 0.3, 1.1)

  return [
    { part: stone, material: finish('cle-gm-sandstone', 0x625c55) },
    { part: buff, material: finish('cle-gm-buff', 0xd6c6a2) },
    { part: tile, material: finish('cle-gm-tile', 0x56595e) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('cle-gm-bronze', 0x55625f) },
  ]

  /** A cross finial: post from z0 to z1, w thick, arms `span` wide. */
  function cross(p: Part, x: number, y: number, z0: number, z1: number, w: number, span: number) {
    const post = rect(x - w / 2, y - w / 2, x + w / 2, y + w / 2)
    walls(p, post, z0, z1); cap(p, post, z1)
    const za = z1 - (z1 - z0) * 0.38
    for (const r of [rect(x - span / 2, y - w / 2, x + span / 2, y + w / 2), rect(x - w / 2, y - span / 2, x + w / 2, y + span / 2)]) {
      walls(p, r, za - w / 2, za + w / 2); cap(p, r, za + w / 2); cap(p, r, za - w / 2, false)
    }
  }
}

if (import.meta.main) await save('cle-garfield-memorial', 'James A. Garfield Memorial', [41.5100384, -81.5913918], 7, build() as any, 5000)
