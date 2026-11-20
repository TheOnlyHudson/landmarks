/**
 * Soldiers' and Sailors' Monument (Levi Scofield, dedicated 1894), south-east
 * quadrant of Public Square, Cleveland — original procedural geometry,
 * CC0-1.0.
 * bun generators/cle-soldiers-and-sailors-monument.ts
 *
 * Map frame of the model: x, y, z up, metres. Anchor = centre of the
 * memorial hall (OSM way/1078054875), -81.6929277 41.4995200. The monument
 * is square to the Public Square street grid: bearing 326.5, so model +y
 * points north-north-west (toward Superior Avenue's centre of the square),
 * +x east-north-east (toward East Roadway and 200 Public Square).
 * y = 0 is the paved ring round the terrace (lidar 1.1 m above the lowest
 * return in the box, which is the lawn to the north).
 *
 * Identity, in order: the tall dark bronze column banded with rings, its
 * capital and the Liberty statue on top; the square buff sandstone hall
 * with grey rusticated walls between buff arched windows, its frieze,
 * cornice, raised central attic on each face and corner turrets with
 * eagles; the stone terrace with stairs at its four corners; the four
 * bronze groups on pedestals in the middle of each terrace side.
 *
 * Evidence:
 *  - plan: OSM, turned into this frame: terrace way/430783849 (about ±15 m,
 *    rounded corners, height 1.75, wikidata Q7557370); hall way/1078054875
 *    (±6.9 m square); column base way/1078054880 (±3 m); column
 *    way/1078054881 (radius ~1.5); the four group pedestals
 *    way/1078274608-611 (2.6 × 6.2 m, centred ~11 m out on each side).
 *  - heights, measured: USGS 3DEP lidar OH_Statewide_Phase1_1_2019 (2019
 *    flight), 0.5 m grid, read with tools/lidar_frame.py at bearing 326.5,
 *    above the paved ring (lidar 1.1): terrace platform 1.6; terrace
 *    parapet 2.3; pedestals 4.4; bronze groups 6.4-7.1; hall cornice
 *    8.3; hall roof and attics 8.4-10.0; column base 11.9; statue top
 *    37.5 (lidar 38.6). The corner stairs show as ramps 1.2 → 2.7 on all
 *    four diagonals between 10 and 12.5 m out on each axis.
 *  - published: 125 ft (38 m) overall; Levi Scofield architect; dedicated
 *    4 July 1894 (Wikipedia "Soldiers' and Sailors' Monument (Cleveland)";
 *    National Register 1978).
 *  - estimated from photos scaled to the lidar: the column's stages
 *    (stone drum 11.9-16.8, bronze shaft radius 1.1 to 28.4 with four ring
 *    bands, capital to 31.0, upper drum and dome to 33.8, Liberty 33.8-37.5),
 *    from DSC07884 and DSC07873; the hall's storeys (plinth, grey wall to
 *    6.3, frieze 6.3-7.6, cornice) and the arched openings, from DSC07864
 *    (the +y face head on) and DSC07869; the stairs' 8 risers.
 *  - which group stands where: the Color Guard (+y) and the cavalry Advance
 *    Guard (-x) from DSC07869, taken from the (-x, +y) corner with 200
 *    Public Square on the left; the Navy's mortar group (-y) from the
 *    night photo with Key Tower behind it; so the artillery group with its
 *    gun wheel is +x. Doors in the middle of the ±y faces (DSC07869,
 *    Cards84664), arched windows in the middle of ±x.
 *  - photos (all EVIDENCE):
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument_(Cleveland).jpg
 *      Cards84664, CC BY-SA 4.0 — from the (+x, -y) corner: stairs, door, artillery and navy groups.
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument_(Cleveland)_(2).jpg
 *      Cards84664, CC BY-SA 4.0 — the same corner, wider: terrace, stairs, column base.
 *    https://commons.wikimedia.org/wiki/File:Soldiers_and_Sailors_Monument_Cleveland_at_night.png
 *      Cards84664, CC BY-SA 4.0 — the navy group and hall at night, floodlit.
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument_(Cleveland)_-_DSC07863.JPG
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument_(Cleveland)_-_DSC07864.JPG
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument_(Cleveland)_-_DSC07869.JPG
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument_(Cleveland)_-_DSC07873.JPG
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument_(Cleveland)_-_DSC07876.JPG
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument_(Cleveland)_-_DSC07878.JPG
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument_(Cleveland)_-_DSC07884.JPG
 *      Daderot, CC0 — the +y face head on, the corners, the column and capital, the groups.
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument,_Public_Square,_Cleveland,_OH_(27732092537).jpg
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument,_Public_Square,_Cleveland,_OH_(27732116077).jpg
 *      Warren LeMay, CC0 — overcast views, silhouette against the sky.
 *    https://commons.wikimedia.org/wiki/File:Soldiers%27_and_Sailors%27_Monument_in_Cleveland_Public_Square.jpg
 *      Erik Drost, CC BY 2.0 — the monument from across the square.
 *  - colour: buff sandstone in sun, pulled to the palette's lightness; the
 *    rusticated wall panels blue-grey; the bronze near black-green, kept
 *    dark (it is the defining feature) but no darker than the palette's
 *    charcoal; the red sandstone stairs.
 *
 * Left out: the roundels in the frieze, the crenellation's merlons (drawn
 *  as a low parapet), lettering, railings, lamps, flagpoles, the relief
 *  plaques' carving (drawn as dark flush panels), the inscriptions on the
 *  shaft. The groups are bold simple masses: figures, a flag, the mortar,
 *  a gun wheel, a horse.
 * Doubts: which eagle stands on which turret varies between photos; all
 *  four corners carry one here. Liberty is turned to face -x (west-south-
 *  west), from DSC07873/DSC07884 taken from the west; her facing is not
 *  certain. Whether the groups on ±x are as assigned rests on one photo
 *  (DSC07869).
 *
 * Night: the hall and column are floodlit (the night photo); the stained
 *  glass windows glow (`window`).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { arch, band, grow, poly, voussoirs, wallsSplit } from './pit-allegheny-county-courthouse'

/** A square-section bar of width w from a to b. */
function beam(p: Part, a: V3, b: V3, w: number, w2 = w) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d)
  const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const up: V3 = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const cr = (u: V3, v: V3): V3 => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const nz = (u: V3): V3 => { const l = Math.hypot(...u); return [u[0] / l, u[1] / l, u[2] / l] }
  const s = nz(cr(t, up)), q = nz(cr(s, t))
  const ring = (c: V3, h: number, k: number): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) =>
    [c[0] + (s[0] * i + q[0] * j) * h * (j > 0 ? 1 : k), c[1] + (s[1] * i + q[1] * j) * h * (j > 0 ? 1 : k), c[2] + (s[2] * i + q[2] * j) * h * (j > 0 ? 1 : k)] as V3)
  const r0 = ring(a, w / 2, 1), r1 = ring(b, w2 / 2, 1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const m: V3 = [(r0[i][0] + r0[j][0]) / 2 - a[0], (r0[i][1] + r0[j][1]) / 2 - a[1], (r0[i][2] + r0[j][2]) / 2 - a[2]]
    poly(p, [r0[i], r0[j], r1[j], r1[i]], m)
  }
  poly(p, r0, [-t[0], -t[1], -t[2]])
  poly(p, r1, t)
}

/** One wall a→b from z0 to z1, split into pieces no longer than 5 m for the terrain. */
function side(p: Part, a: XY, b: XY, z0: number, z1: number, step = 5) {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
  for (let k = 0; k < n; k++) {
    const p0: XY = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n], p1: XY = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n]
    p.quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
  }
}

/** A box [x0,y0,x1,y1] from z0 to z1 with a top. */
function box(p: Part, r: [number, number, number, number], z0: number, z1: number, top = true) {
  walls(p, rect(...r), z0, z1)
  if (top) cap(p, rect(...r), z1)
}

function build() {
  const sand = new Part(), grey = new Part(), bronze = new Part(), win = new Part(), red = new Part()

  // ---------------------------------------------------------------- terrace
  const T = 15, PLAT = 1.6, PARA = 2.3
  // Eight levels: seven risers of the corner stairs, then the platform. Each
  // level is the square ±T cut at its corners by |x|+|y| = c.
  const oct = (c: number): XY[] => {
    const e = c - T
    return [[T, -e], [T, e], [e, T], [-e, T], [-T, e], [-T, -e], [-e, -T], [e, -T]]
  }
  const NL = 8
  for (let k = 0; k < NL; k++) {
    const c = 25.2 - 0.7 * k, z0 = k * PLAT / NL, z1 = (k + 1) * PLAT / NL
    const r = oct(c)
    // the faces along the sides are sandstone, the risers at the corners red
    for (let i = 0; i < 8; i++) {
      const a = r[i], b = r[(i + 1) % 8]
      side(i % 2 === 0 ? sand : red, a, b, z0, z1)
    }
    cap(k === NL - 1 ? sand : red, r, z1)
  }
  // the parapet along each side, between the stairs
  for (let k = 0; k < 4; k++) {
    const rot = (p: XY): XY => { const a = k * Math.PI / 2; return [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)] }
    const e = 25.2 - 0.7 * (NL - 1) - T - 0.2
    const r = [[T - 0.7, -e], [T, -e], [T, e], [T - 0.7, e]].map(p => rot(p as XY))
    wallsSplit(sand, r, PLAT, PARA, 5)
    cap(sand, r, PARA)
    // end posts at the stairs
    for (const s of [-1, 1]) {
      const pr = [[T - 0.9, s * e - 0.5], [T, s * e - 0.5], [T, s * e + 0.5], [T - 0.9, s * e + 0.5]].map(p => rot(p as XY))
      walls(sand, pr, PLAT, PARA + 0.35)
      cap(sand, pr, PARA + 0.35)
    }
  }

  // ---------------------------------------------------------------- hall
  const H = 6.9
  const Z = { plinth: 2.3, wall: 6.3, frieze: 7.6, cornice: 8.3, roof: 10.0, base: 11.9 }
  const hr: [number, number, number, number] = [-H, -H, H, H]
  band(sand, rect(...hr), grow(hr, 0.25), PLAT, Z.plinth, 0.2)
  walls(grey, rect(...hr), Z.plinth, Z.wall)
  walls(sand, rect(...hr), Z.wall, Z.frieze)
  band(sand, rect(...hr), grow(hr, 0.4), Z.frieze, Z.cornice, 0.3)
  // corner piers in buff stone, standing a little proud of the grey wall
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x0 = sx > 0 ? H - 1.2 : -H - 0.12, x1 = sx > 0 ? H + 0.12 : -H + 1.2
    const y0 = sy > 0 ? H - 1.2 : -H - 0.12, y1 = sy > 0 ? H + 0.12 : -H + 1.2
    walls(sand, rect(x0, y0, x1, y1), Z.plinth, Z.wall)
  }
  // the openings on each face: arched windows each side, the door (±y) or
  // a larger window (±x) in the middle; buff surrounds and sills
  const faces: [XY, XY, boolean][] = [
    [[-H, -H], [H, -H], true], [[H, -H], [H, H], false], [[H, H], [-H, H], true], [[-H, H], [-H, -H], false],
  ]
  for (const [a, b, door] of faces) {
    const L = 2 * H, m = L / 2
    for (const s of [m - 4.2, m + 4.2]) {
      panel(sand, a, b, s - 1.2, s + 1.2, 3.5, 4.4, 0.1)
      panel(sand, a, b, s - 1.25, s - 0.85, 4.4, 5.1, 0.1)
      panel(sand, a, b, s + 0.85, s + 1.25, 4.4, 5.1, 0.1)
      arch(win, a, b, s - 0.85, s + 0.85, 4.4, 5.1, 0.06, 8)
      voussoirs(sand, a, b, s - 0.85, s + 0.85, 5.1, 0.4, 0.1, 8)
    }
    // the middle arch, wider
    panel(sand, a, b, m - 1.5, m - 1.05, door ? PLAT : 3.5, 4.9, 0.1)
    panel(sand, a, b, m + 1.05, m + 1.5, door ? PLAT : 3.5, 4.9, 0.1)
    if (door) {
      panel(bronze, a, b, m - 1.05, m + 1.05, Z.plinth - 0.3, 4.2, 0.06)
      arch(win, a, b, m - 1.05, m + 1.05, 4.2, 4.9, 0.06, 8)
    } else {
      panel(sand, a, b, m - 1.5, m + 1.5, 3.2, 4.0, 0.1)
      arch(win, a, b, m - 1.05, m + 1.05, 4.0, 4.9, 0.06, 8)
    }
    voussoirs(sand, a, b, m - 1.05, m + 1.05, 4.9, 0.4, 0.1, 8)

    // the frieze's roundels, drawn as grey discs
    {
      const { P: Q, n: nn } = onWall(a, b)
      for (let i = 0; i < 9; i++) {
        const sc = 1.3 + i * (L - 2.6) / 8
        const ring: V3[] = Array.from({ length: 8 }, (_, k) => Q(sc + 0.42 * Math.cos(k * Math.PI / 4), 6.95 + 0.42 * Math.sin(k * Math.PI / 4), 0.06))
        poly(grey, ring, [nn[0], nn[1], 0])
      }
    }
    // the attic over the middle: a gable with a segmental top, and the
    // arch of the inscription as a raised ring on its face
    const { P, n } = onWall(a, b)
    const w = 2.9, d = 1.4, top = 10.4, rise = 1.1
    const R = (w * w + rise * rise) / (2 * rise), zc = top - R, a0 = Math.asin(w / R)
    const prof: [number, number][] = [[m - w, Z.cornice], [m + w, Z.cornice]]
    prof.push(...Array.from({ length: 7 }, (_, i) => { const t = a0 - (2 * a0 * i) / 6; return [m + R * Math.sin(t), zc + R * Math.cos(t)] as [number, number] }))
    const front = prof.map(([q, z]) => P(q, z, 0.05)), back = prof.map(([q, z]) => P(q, z, -d))
    poly(sand, front, [n[0], n[1], 0])
    for (let i = 1; i < prof.length; i++) {
      const j = (i + 1) % prof.length
      const mz = (prof[i][1] + prof[j][1]) / 2, mq = (prof[i][0] + prof[j][0]) / 2
      const mp = P(mq, mz, 0), cp = P(m, 9.0, 0)
      poly(sand, [front[i], front[j], back[j], back[i]], [mp[0] - cp[0], mp[1] - cp[1], mz - 9.0])
    }
    voussoirs(sand, a, b, m - 1.7, m + 1.7, Z.cornice + 0.05, 0.28, 0.12, 8)
  }
  // a low parapet behind the cornice
  {
    const o = rect(-H - 0.1, -H - 0.1, H + 0.1, H + 0.1), i = rect(-H + 0.4, -H + 0.4, H - 0.4, H - 0.4)
    walls(sand, o, Z.cornice, Z.cornice + 0.55)
    walls(sand, [...i].reverse(), Z.cornice, Z.cornice + 0.55)
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4
      sand.quad([o[k][0], o[k][1], Z.cornice + 0.55], [o[j][0], o[j][1], Z.cornice + 0.55], [i[j][0], i[j][1], Z.cornice + 0.55], [i[k][0], i[k][1], Z.cornice + 0.55])
    }
  }
  // the stepped stone roof up to the column base
  {
    const lo = rect(-H + 0.4, -H + 0.4, H - 0.4, H - 0.4), mid = rect(-4.6, -4.6, 4.6, 4.6), hi = rect(-3.4, -3.4, 3.4, 3.4)
    walls(sand, lo, Z.cornice, Z.cornice + 0.3, mid)
    walls(sand, mid, Z.cornice + 0.3, 9.2)
    walls(sand, mid, 9.2, Z.roof, hi)
    cap(sand, hi, Z.roof)
    // the column base block, with cannon-ball pyramids at its corners
    box(sand, [-2.6, -2.6, 2.6, 2.6], Z.roof, Z.base)
    band(sand, rect(-2.6, -2.6, 2.6, 2.6), grow([-2.6, -2.6, 2.6, 2.6], 0.25), Z.base - 0.5, Z.base, 0.2)
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const cx = sx * 2.95, cy = sy * 2.95, h = 0.45
      const base: V3[] = rect(cx - h, cy - h, cx + h, cy + h).map(([x, y]) => [x, y, Z.roof] as V3)
      const tip: V3 = [cx, cy, Z.roof + 0.7]
      for (let i = 0; i < 4; i++) poly(sand, [base[i], base[(i + 1) % 4], tip], [(base[i][0] + base[(i + 1) % 4][0]) / 2 - cx, (base[i][1] + base[(i + 1) % 4][1]) / 2 - cy, 0.5])
    }
  }
  // corner turrets with eagles
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = sx * (H - 0.45), cy = sy * (H - 0.45)
    const r: [number, number, number, number] = [cx - 0.75, cy - 0.75, cx + 0.75, cy + 0.75]
    walls(sand, rect(...r), Z.cornice, 9.3)
    band(sand, rect(...r), grow(r, 0.15), 9.3, 9.6, 0.1)
    lathe(sand, cx, cy, [[0.7, 9.6], [0.6, 9.95], [0.35, 10.2], [0.01, 10.3]], 8)
    // the eagle: body, raised wings
    const ox = sx * 0.7071, oy = sy * 0.7071 // facing out over the corner
    beam(bronze, [cx, cy, 10.2], [cx + ox * 0.25, cy + oy * 0.25, 11.1], 0.45, 0.3)
    for (const side of [-1, 1]) {
      const px = -oy * side, py = ox * side
      poly(bronze, [[cx + px * 0.15, cy + py * 0.15, 10.6], [cx + px * 0.9, cy + py * 0.9, 11.7], [cx + px * 0.75 - ox * 0.1, cy + py * 0.75 - oy * 0.1, 10.9]], [ox, oy, 0])
      poly(bronze, [[cx + px * 0.15, cy + py * 0.15, 10.6], [cx + px * 0.75 - ox * 0.1, cy + py * 0.75 - oy * 0.1, 10.9], [cx + px * 0.9, cy + py * 0.9, 11.7]], [-ox, -oy, 0])
    }
  }

  // ---------------------------------------------------------------- column
  lathe(sand, 0, 0, [
    [2.0, Z.base], [2.0, 12.3], [1.7, 12.7], [1.6, 12.9], [1.6, 14.6], [1.8, 14.8], [1.8, 15.9],
    [1.95, 16.15], [1.95, 16.6], [1.15, 16.75],
  ], 14)
  {
    const prof: XY[] = [[1.15, 16.75], [1.12, 18.4]]
    for (const z of [18.6, 20.5, 22.4, 24.3]) prof.push([1.12, z - 0.12], [1.36, z], [1.36, z + 0.38], [1.1, z + 0.5])
    prof.push([1.08, 25.8], [1.2, 25.9], [1.2, 28.0], [1.08, 28.1], [1.08, 28.35], [1.3, 28.5], [1.55, 29.5], [1.95, 30.3])
    lathe(bronze, 0, 0, prof, 14)
    // the abacus: a square with chamfered corners, then the upper drum and dome
    const ab: XY[] = [[2.1, -1.3], [2.1, 1.3], [1.3, 2.1], [-1.3, 2.1], [-2.1, 1.3], [-2.1, -1.3], [-1.3, -2.1], [1.3, -2.1]]
    walls(bronze, ab, 30.3, 30.9)
    cap(bronze, ab, 30.3, false)
    cap(bronze, ab, 30.9)
    lathe(bronze, 0, 0, [[1.25, 30.9], [1.25, 32.5], [1.42, 32.65], [1.42, 33.0], [1.05, 33.4], [0.65, 33.7], [0.01, 33.85]], 12)
  }
  // Liberty: robe, shoulders, helmeted head; shield and sword (facing -x)
  lathe(bronze, 0, 0, [[0.62, 33.75], [0.55, 35.1], [0.5, 35.9], [0.62, 36.35], [0.3, 36.6], [0.24, 36.9], [0.3, 37.25], [0.01, 37.5]], 10)
  {
    const cx = -0.62, cy = 0.25
    const sh: V3[] = [[cx, cy - 0.5, 36.1], [cx, cy - 0.5, 35.3], [cx, cy, 34.75], [cx, cy + 0.5, 35.3], [cx, cy + 0.5, 36.1]]
    poly(bronze, sh, [-1, 0, 0])
    poly(bronze, sh.map(([x, y, z]) => [x + 0.12, y, z] as V3), [1, 0, 0])
    for (let i = 0; i < sh.length; i++) {
      const a = sh[i], b = sh[(i + 1) % sh.length]
      poly(bronze, [a, b, [b[0] + 0.12, b[1], b[2]], [a[0] + 0.12, a[1], a[2]]], [0, (a[1] + b[1]) / 2 - cy, (a[2] + b[2]) / 2 - 35.5])
    }
    beam(bronze, [-0.4, -0.35, 35.6], [-1.6, 0.15, 35.0], 0.12)
  }

  // ---------------------------------------------------------------- groups
  // Each pedestal stands on the platform in the middle of a side, its long
  // side along the face; `G` gives a point on it: u along the face, v out
  // from the hall, z up from the pedestal top.
  const PED_IN = 9.5, PED_OUT = 12.15, PED_TOP = 4.4
  const sides: { ang: number; kind: 'colors' | 'cavalry' | 'navy' | 'artillery' }[] = [
    { ang: 90, kind: 'colors' }, { ang: 180, kind: 'cavalry' }, { ang: 270, kind: 'navy' }, { ang: 0, kind: 'artillery' },
  ]
  for (const { ang, kind } of sides) {
    const a = ang * Math.PI / 180
    const nx = Math.cos(a), ny = Math.sin(a), ux = -ny, uy = nx
    const G = (u: number, v: number, z: number): V3 => [ux * u + nx * v, uy * u + ny * v, PED_TOP + z]
    const vc = (PED_IN + PED_OUT) / 2
    const ped = (u0: number, u1: number, v0: number, v1: number): XY[] => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => { const p = G(u, v, 0); return [p[0], p[1]] as XY })
    // the pedestal: a plinth, the die, a projecting cornice
    const fix = (r: XY[]) => { // keep the ring counter-clockwise from above
      const ar = r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
      return ar < 0 ? [...r].reverse() : r
    }
    const plinth = fix(ped(-3.3, 3.3, PED_IN - 0.15, PED_OUT + 0.15)), die = fix(ped(-3.1, 3.1, PED_IN, PED_OUT)), corn = fix(ped(-3.3, 3.3, PED_IN - 0.15, PED_OUT + 0.15))
    walls(sand, plinth, PLAT, 2.0)
    cap(sand, plinth, 2.0)
    walls(sand, die, 2.0, 3.85)
    walls(sand, die, 3.85, 4.05, corn)
    walls(sand, corn, 4.05, PED_TOP)
    cap(sand, corn, PED_TOP)
    // the bronze relief plaque on the outer face
    {
      const p0 = G(-0.9, PED_OUT + 0.05, -2.0), p1 = G(0.9, PED_OUT + 0.05, -2.0), p2 = G(0.9, PED_OUT + 0.05, -1.05), p3 = G(-0.9, PED_OUT + 0.05, -1.05)
      poly(bronze, [p0, p1, p2, p3], [nx, ny, 0])
    }
    // a bronze base slab for the group
    {
      const r = fix(ped(-2.9, 2.9, PED_IN + 0.2, PED_OUT - 0.2))
      walls(bronze, r, PED_TOP, PED_TOP + 0.15)
      cap(bronze, r, PED_TOP + 0.15)
    }
    const z0 = 0.15
    /** A standing figure at (u, v): legs, coat, shoulders, head. */
    const fig = (u: number, v: number, h = 2.3, r = 0.4) => {
      const c = G(u, v, z0)
      lathe(bronze, c[0], c[1], [[r * 0.8, c[2]], [r * 0.85, c[2] + h * 0.45], [r * 1.05, c[2] + h * 0.6], [r * 1.15, c[2] + h * 0.8], [r * 0.45, c[2] + h * 0.84], [r * 0.5, c[2] + h * 0.93], [0.01, c[2] + h]], 6)
    }
    const bar = (p: [number, number, number], q: [number, number, number], w: number) => beam(bronze, G(...p), G(...q), w)

    if (kind === 'colors') {
      // the Color Guard: a tight row of soldiers round the flag, one fallen
      for (const [u, v, h] of [[-2.3, vc, 2.1], [-1.5, vc + 0.3, 2.35], [-0.6, vc - 0.2, 2.4], [0.4, vc + 0.2, 2.4], [1.3, vc - 0.1, 2.35], [2.1, vc + 0.3, 2.2]] as [number, number, number][]) fig(u, v, h)
      bar([-2.6, vc + 0.5, 0.3], [-1.9, vc + 0.6, 0.6], 0.45) // the fallen one
      bar([-0.2, vc, 0.2], [-1.1, vc + 0.3, 4.0], 0.12) // the flagstaff
      poly(bronze, [G(-1.05, vc + 0.28, 3.9), G(-0.75, vc + 0.2, 3.2), G(0.9, vc - 0.1, 2.8), G(0.6, vc, 3.6)], [nx, ny, 0])
      poly(bronze, [G(-1.05, vc + 0.28, 3.9), G(0.6, vc, 3.6), G(0.9, vc - 0.1, 2.8), G(-0.75, vc + 0.2, 3.2)], [-nx, -ny, 0])
      bar([1.0, vc + 0.1, 1.9], [2.1, vc + 0.4, 2.2], 0.12) // a levelled rifle
    } else if (kind === 'navy') {
      // Mortar Practice: the mortar on its wedge carriage, sailors round it
      const w0 = vc - 0.6, w1 = vc + 0.6
      const wedge = (v: number): V3[] => [G(-1.3, v, z0), G(1.1, v, z0), G(1.1, v, z0 + 0.9), G(-0.2, v, z0 + 1.7)]
      const A = wedge(w0), B = wedge(w1)
      poly(bronze, B, [nx, ny, 0])
      poly(bronze, A, [-nx, -ny, 0])
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        const m = [(A[i][0] + A[j][0]) / 2, (A[i][1] + A[j][1]) / 2, (A[i][2] + A[j][2]) / 2]
        const c = G(-0.1, vc, z0 + 0.8)
        poly(bronze, [A[i], A[j], B[j], B[i]], [m[0] - c[0], m[1] - c[1], m[2] - c[2]])
      }
      // the stubby barrel, tilted up
      bar([0.0, vc, 1.4], [0.75, vc, 2.5], 1.0)
      for (const [u, v, h] of [[-2.5, vc + 0.1, 2.3], [-1.7, vc - 0.3, 2.2], [1.7, vc + 0.2, 2.4], [2.5, vc - 0.2, 2.2]] as [number, number, number][]) fig(u, v, h)
      bar([1.8, vc + 0.2, 1.8], [1.2, vc + 0.1, 2.9], 0.18) // the raised arm
    } else if (kind === 'artillery') {
      // the gun crew: a field gun with its big spoked wheel, three gunners
      const wc: [number, number, number] = [0.4, vc + 0.75, 0.95]
      const R = 0.85, seg = 12
      for (let i = 0; i < seg; i++) {
        const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
        bar([wc[0] + R * Math.cos(t0), wc[1], wc[2] + R * Math.sin(t0)], [wc[0] + R * Math.cos(t1), wc[1], wc[2] + R * Math.sin(t1)], 0.16)
      }
      bar([wc[0] - R, wc[1], wc[2]], [wc[0] + R, wc[1], wc[2]], 0.1)
      bar([wc[0], wc[1], wc[2] - R], [wc[0], wc[1], wc[2] + R], 0.1)
      bar([wc[0], vc - 0.7, wc[2]], [wc[0], vc + 0.75, wc[2]], 0.15) // axle
      bar([1.6, vc, 1.15], [-0.3, vc, 0.95], 0.4) // the barrel
      bar([-0.2, vc, 0.9], [-1.6, vc, 0.2], 0.3) // the trail
      for (const [u, v, h] of [[-2.4, vc - 0.1, 2.3], [-1.5, vc + 0.4, 1.7], [2.3, vc - 0.2, 2.35]] as [number, number, number][]) fig(u, v, h)
      bar([-2.3, vc - 0.1, 1.7], [-1.5, vc - 0.2, 1.9], 0.14) // a rammer
    } else {
      // the Advance Guard: a horse with its rider, men on foot either side
      const hz = 1.25
      bar([-1.0, vc, hz], [0.8, vc, hz + 0.1], 0.75) // body
      bar([0.75, vc, hz + 0.15], [1.25, vc, hz + 0.95], 0.4) // neck
      bar([1.15, vc, hz + 0.9], [1.6, vc, hz + 0.6], 0.3) // head
      for (const [u, dv] of [[-0.85, -0.2], [-0.85, 0.2], [0.65, -0.2], [0.65, 0.2]]) bar([u, vc + dv, hz - 0.2], [u + 0.05, vc + dv, z0], 0.17)
      bar([-1.0, vc, hz + 0.1], [-1.4, vc, 0.4], 0.14) // tail
      fig(-0.1, vc, 1.5, 0.3) // the rider, sitting high
      const rc = G(-0.1, vc, z0 + 1.3)
      lathe(bronze, rc[0], rc[1], [[0.3, rc[2]], [0.34, rc[2] + 0.55], [0.15, rc[2] + 0.6], [0.17, rc[2] + 0.8], [0.01, rc[2] + 0.95]], 6)
      bar([0.0, vc, 2.0], [-0.5, vc, 4.0], 0.11) // the guidon staff
      poly(bronze, [G(-0.48, vc, 3.95), G(-0.4, vc, 3.4), G(0.6, vc, 3.55)], [nx, ny, 0])
      poly(bronze, [G(-0.48, vc, 3.95), G(0.6, vc, 3.55), G(-0.4, vc, 3.4)], [-nx, -ny, 0])
      for (const [u, v, h] of [[-2.4, vc + 0.2, 2.3], [-1.7, vc - 0.3, 2.1], [1.9, vc - 0.2, 2.3], [2.6, vc + 0.2, 2.2]] as [number, number, number][]) fig(u, v, h)
    }
  }

  // ---------------------------------------------------------------- materials
  // floodlit from the terrace: the hall's walls strongest, the column fading
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[2] < 1.7 ? 0.3 : p[2] < 17 ? 0.85 : 0.55)
  return [
    { part: sand, material: { ...finish('cle-ssm-sandstone', 0xdcc79c), floodlight: lit } },
    { part: grey, material: { ...finish('cle-ssm-rustication', 0x989ea6), floodlight: lit } },
    { part: bronze, material: { ...finish('cle-ssm-bronze', 0x555b57), floodlight: (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[2] < 9 ? 0.45 : 0.35) } },
    { part: win, material: PALETTE.window },
    { part: red, material: finish('cle-ssm-red-sandstone', 0xbb8b7b) },
  ]
}

if (import.meta.main) await save('cle-soldiers-and-sailors-monument', "Soldiers' and Sailors' Monument", [41.49952, -81.6929277], 326.5, build() as any, 6500)
