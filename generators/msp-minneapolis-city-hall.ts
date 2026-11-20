/**
 * Minneapolis City Hall and Hennepin County Courthouse (1888-1909, Long and
 * Kees), Minneapolis — original procedural geometry, CC0-1.0.
 * bun generators/msp-minneapolis-city-hall.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to the downtown street
 * grid (placement bearing 30.5°: the model's +y runs along 3rd/4th Avenue
 * South toward 4th Street). Origin at the anchor, the area centroid of the
 * OSM multipolygon relation/4503577 (-93.26541, 44.977285), on the lowest
 * ground under it (4th Street side, ~254.5 m NAVD88).
 *
 * Form: a Richardsonian Romanesque block of rough rose granite filling the
 * block between 4th and 5th Streets and 3rd and 4th Avenues, 90 x 91 m, five
 * storeys to a 30 m eave, around a courtyard. Steep copper-green hipped roofs
 * on the outer slopes (dark low-pitched roofing on the courtyard side), four
 * corner pavilions with tall copper pyramids, round turrets and stone gables.
 * The clock tower stands in the middle of the 4th Street (north) front: a
 * square shaft with four clock faces, a corbelled belfry, corner turrets and
 * a copper pyramid to ~117 m. A second, lower tower (~73 m) marks the 5th
 * Street entrance in the middle of the south front.
 *
 * Sources
 * - OSM: relation/4503577 (outer way/27517962, inner court way/323321688;
 *   building:levels 5, roof:shape hipped, building:colour #b89088,
 *   roof:colour #8eac92).
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022; read
 *   with class 18 kept, heights above 254.5 m = the 4th Street kerb):
 *   outer walls x -47.5..42.5, y -45.5..45.5 (OSM's outline is ~4 m wider on
 *   the east and ~2 m on the west; the lidar edges and NAIP agree, so the
 *   lidar is used); eave 29-30, outer ridge 43 about 11 m in, inner eave 33
 *   at 27 m in; corner pavilion pyramids 50-51; clock tower shaft 16 x 16 m
 *   centred on the north front, projecting ~2 m, belfry top 93-99, pyramid
 *   apex 117-122, finial ~131; south tower 13 m square, cornice ~58-61, apex
 *   72-74; courtyard: a low roof at ~7 m (a roof garden in NAIP) in the west
 *   half and a block at ~20 m in the east half. Ground: 0-1 m on 4th Street,
 *   1-2 on 4th Avenue, 2-3 on 3rd Avenue, 3-4.5 on 5th Street.
 * - USGS NAIP (public domain): plan, copper on outer slopes only, dark inner
 *   slopes, green court roof, pale east court block.
 * - Published: completed 1909; clock tower 345 ft (105 m) (Wikipedia,
 *   "Minneapolis City Hall"); the lidar puts the pyramid's apex 12 m higher,
 *   which McGhiever's photo (scaled from the 16 m shaft) supports, so the
 *   lidar is used.
 * - Photos (Wikimedia Commons, all evidence):
 *   Michael Barera, "Minneapolis April 2025 11 (Minneapolis City Hall).jpg",
 *     CC BY-SA 4.0 (from 3rd Ave & 5th St, south-west): corner pavilion,
 *     turrets, gables, south tower, window rhythm.
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_11_(Minneapolis_City_Hall).jpg
 *   Michael Barera, "Minneapolis April 2025 14 (Minneapolis City Hall).jpg",
 *     CC BY-SA 4.0 (from the south, head-on): south tower, storey bands.
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_April_2025_14_(Minneapolis_City_Hall).jpg
 *   McGhiever, "Minneapolis City Hall 2013.jpg", CC BY-SA 4.0 (from the
 *     north-east): clock tower stages, slit windows, clock faces.
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_City_Hall_2013.jpg
 *   Jason Riedy, "Minneapolis City Hall 2012.jpg", CC BY 2.0 (from the
 *     south-east, Government Center plaza): both towers, roofs.
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_City_Hall_2012.jpg
 *   Tony Webster, "Minneapolis City Hall and US District Courthouse
 *     Minnesota.jpg", CC BY-SA 4.0: belfry and turrets of the clock tower.
 *     https://commons.wikimedia.org/wiki/File:Minneapolis_City_Hall_and_US_District_Courthouse_Minnesota.jpg
 *   Ibboh, "Minneapolis City Hall, 2012.jpg", CC BY-SA 3.0: turrets and
 *     gable detail. https://commons.wikimedia.org/wiki/File:Minneapolis_City_Hall,_2012.jpg
 *   Carol M. Highsmith, "Minneapolis City Hall Highsmith.jpg", public domain.
 *
 * Measured: plan, eave, ridges, pyramids, both towers (lidar).
 * Estimated from the photos: storey bands (arcaded ground floor, floors 2-3,
 * 4-5), bay width ~4.2 m, turret radii (2.5 m), gable size, clock centre
 * (82 m) and radius (3.4 m), belfry stages of both towers.
 * Colours: granite from the daylight photos (dark rose-brown, pulled light);
 * copper from photos and OSM roof:colour.
 *
 * Night: the four clock faces are lit (neon material, pale cream).
 *
 * Doubts: the east and west fronts' middle bays are drawn plain (no clear
 * photo of them); the courtyard blocks are simplified to two flat roofs;
 * dormers and small pinnacles are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, ccw, chamfer, capRing, wallEdge, outward, finishGlb } from './sea-rainier-square-tower'

const X0 = -47.5, X1 = 42.5, Y0 = -45.5, Y1 = 45.5
const CX = (X0 + X1) / 2
const Z = { eave: 30, ridge: 43, inner: 33, pav: 52.5, pavWall: 35, court: 7, courtBlock: 21 }
const RIDGE_IN = 11, WING = 27, PAV = 22
const GROUND = { n: 0.5, e: 1.5, s: 4, w: 2.5 }

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

export function circle(c: XY, r: number, n: number, a0 = 0): XY[] {
  return Array.from({ length: n }, (_, i) => { const a = a0 + (2 * Math.PI * i) / n; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY })
}

/** A flat panel on a vertical face: s along the face from a, with an optional semicircular head. */
export function panel(part: Part, a: XY, t: XY, n: XY, s: number, w: number, z0: number, z1: number, arch: boolean, proud = 0.06) {
  const P = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * proud, a[1] + t[1] * u + n[1] * proud, z]
  const r = w / 2, zs = arch ? z1 - r : z1
  if (zs - z0 > 0.2) part.quad(P(s - r, z0), P(s + r, z0), P(s + r, zs), P(s - r, zs))
  if (arch) {
    const k = 8
    for (let i = 0; i < k; i++) {
      const a0 = (Math.PI * i) / k, a1 = (Math.PI * (i + 1)) / k
      part.tri(P(s, zs), P(s + r * Math.cos(a0), zs + r * Math.sin(a0)), P(s + r * Math.cos(a1), zs + r * Math.sin(a1)))
    }
  }
}

/** Unit tangent and outward normal of the face from a to b (counter-clockwise ring). */
export function face(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return { L, t: [(b[0] - a[0]) / L, (b[1] - a[1]) / L] as XY, n: outward(a, b) }
}

/** A closed square-ish prism (ring ccw) from z0 to z1, walls and top cap. */
export function prism(part: Part, ring: XY[], z0: number, z1: number, top: Part | null = part, smooth = 35) {
  for (let i = 0; i < ring.length; i++) wallEdge(part, ring, i, z0, z1, smooth)
  if (top) capRing(top, ring, z1)
}
/** An outset band (string course / cornice) round a ring, with its underside. */
export function band(part: Part, ring: XY[], out: number, z0: number, z1: number, smooth = 35) {
  const o = ring.map((p, i) => {
    const a = ring[(i - 1 + ring.length) % ring.length], b = ring[(i + 1) % ring.length]
    const n1 = outward(a, p), n2 = outward(p, b), m: XY = [n1[0] + n2[0], n1[1] + n2[1]], l = Math.hypot(m[0], m[1])
    const k = out / Math.max(0.5, (m[0] / l) * n1[0] + (m[1] / l) * n1[1])
    return [p[0] + (m[0] / l) * k, p[1] + (m[1] / l) * k] as XY
  })
  for (let i = 0; i < o.length; i++) wallEdge(part, o, i, z0, z1, smooth)
  for (let i = 0; i < o.length; i++) {
    const j = (i + 1) % o.length
    part.quad([ring[j][0], ring[j][1], z0], [ring[i][0], ring[i][1], z0], [o[i][0], o[i][1], z0], [o[j][0], o[j][1], z0])
    part.quad([o[i][0], o[i][1], z1], [o[j][0], o[j][1], z1], [ring[j][0], ring[j][1], z1], [ring[i][0], ring[i][1], z1])
  }
  return o
}
/** A pyramid (or cone) over a ring, to an apex. */
export function pyramid(part: Part, ring: XY[], z0: number, apex: V3, smoothCone = false) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (!smoothCone) { part.tri([a[0], a[1], z0], [b[0], b[1], z0], apex); continue }
    const nrm = (p: XY): V3 => { const dx = p[0] - apex[0], dy = p[1] - apex[1], l = Math.hypot(dx, dy), h = apex[2] - z0; const k = Math.hypot(h, l); return [(dx / l) * h / k, (dy / l) * h / k, l / k] }
    const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    part.tri([a[0], a[1], z0], [b[0], b[1], z0], apex, undefined, undefined, undefined, [nrm(a), nrm(b), nrm(m)])
  }
}
/** A round turret: drum from z0 to z1 and a conical cap to zc. */
function turret(stone: Part, cap: Part, c: XY, r: number, z0: number, z1: number, zc: number, n = 12) {
  const ring = circle(c, r, n)
  for (let i = 0; i < n; i++) wallEdge(stone, ring, i, z0, z1, 40)
  const eave = circle(c, r + 0.35, n)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    cap.quad([ring[j][0], ring[j][1], z1], [ring[i][0], ring[i][1], z1], [eave[i][0], eave[i][1], z1], [eave[j][0], eave[j][1], z1])
  }
  pyramid(cap, eave, z1, [c[0], c[1], zc], true)
}

function build() {
  const granite = new Part(), copper = new Part(), roof = new Part(), win = new Part(), clock = new Part()

  // ---------------------------------------------------------------- the block
  const outer = ccw(chamfer(rect(X0, Y0, X1, Y1), 0.5))
  prism(granite, outer, 0, Z.eave, null)
  band(granite, outer, 0.45, Z.eave - 1.4, Z.eave)
  // a plinth course at the real ground of each front
  band(granite, outer, 0.3, 0, 4.6)

  // courtyard: inner walls (ring wound the other way so they face the court)
  const IX0 = X0 + WING, IX1 = X1 - WING, IY0 = Y0 + 25, IY1 = Y1 - 25
  const inner: XY[] = rect(IX0, IY0, IX1, IY1).reverse()
  for (let i = 0; i < 4; i++) wallEdge(granite, inner, i, Z.court, Z.inner)
  // court roofs: a low garden roof (west) and a block (east)
  const midX = CX - 2
  capRing(roof, ccw(rect(IX0, IY0, midX, IY1)), Z.court)
  const blk = ccw(rect(midX, IY0, IX1, IY1 - 6))
  for (let i = 0; i < 4; i++) wallEdge(granite, blk, i, Z.court, Z.courtBlock)
  capRing(roof, blk, Z.courtBlock)

  // pale stair and lift blocks at the courtyard's four corners (lidar 46 m, NAIP)
  for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const c: XY = [CX + dx * 25, dy * 25.5]
    const r = ccw(chamfer(rect(c[0] - 4, c[1] - 4, c[0] + 4, c[1] + 4), 0.4))
    prism(granite, r, Z.inner, 46, roof)
    for (let i = 0; i < 4; i++) { const a = r[2 * i + 1], b = r[(2 * i + 2) % 8], { L, t, n } = face(a, b); panel(win, a, t, n, L / 2, 3.2, 40, 44.5, true) }
  }

  // ---------------------------------------------------------------- roofs
  const ov = 0.6
  const eaveR = rect(X0 - ov, Y0 - ov, X1 + ov, Y1 + ov)
  const ridgeR = rect(X0 + RIDGE_IN, Y0 + RIDGE_IN, X1 - RIDGE_IN, Y1 - RIDGE_IN)
  const innerR = rect(IX0, IY0, IX1, IY1)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    copper.quad([eaveR[i][0], eaveR[i][1], Z.eave], [eaveR[j][0], eaveR[j][1], Z.eave], [ridgeR[j][0], ridgeR[j][1], Z.ridge], [ridgeR[i][0], ridgeR[i][1], Z.ridge])
    roof.quad([ridgeR[i][0], ridgeR[i][1], Z.ridge], [ridgeR[j][0], ridgeR[j][1], Z.ridge], [innerR[j][0], innerR[j][1], Z.inner], [innerR[i][0], innerR[i][1], Z.inner])
  }

  // ---------------------------------------------------------------- corner pavilions
  // a 22 m pyramid at each corner, round turrets at the corner and at the
  // pavilion's inner ends, and a stone gable on each outer face
  const corners: { c: XY; sx: number; sy: number }[] = [
    { c: [X0, Y0], sx: 1, sy: 1 }, { c: [X1, Y0], sx: -1, sy: 1 }, { c: [X1, Y1], sx: -1, sy: -1 }, { c: [X0, Y1], sx: 1, sy: -1 },
  ]
  const turrets: XY[] = []
  for (const { c, sx, sy } of corners) {
    // the pavilion rises above the eave to 35 m; a steep pyramid to 52.5 m
    const sq = ccw(chamfer(rect(c[0], c[1], c[0] + PAV * sx, c[1] + PAV * sy), 0.5))
    prism(granite, sq, Z.eave - 2, Z.pavWall, null)
    band(granite, sq, 0.45, Z.pavWall - 1.2, Z.pavWall)
    const sqo = ccw(rect(c[0] - ov * sx, c[1] - ov * sy, c[0] + (PAV + ov) * sx, c[1] + (PAV + ov) * sy))
    pyramid(copper, sqo, Z.pavWall, [c[0] + (PAV / 2) * sx, c[1] + (PAV / 2) * sy, Z.pav])
    // turrets
    const tc: XY = [c[0] + 0.9 * sx, c[1] + 0.9 * sy]
    turret(granite, copper, tc, 2.7, 0, Z.pavWall + 2.5, Z.pavWall + 12)
    const ta: XY = [c[0] + PAV * sx, c[1] - 0.6 * sy], tb: XY = [c[0] - 0.6 * sx, c[1] + PAV * sy]
    turret(granite, copper, ta, 2.3, 0, Z.pavWall + 1, Z.pavWall + 9)
    turret(granite, copper, tb, 2.3, 0, Z.pavWall + 1, Z.pavWall + 9)
    turrets.push(tc, ta, tb)
    // gables on the two outer faces, centred on the pavilion face
    for (const along of ['x', 'y'] as const) {
      const m = PAV / 2 + 0.6
      const mid: XY = along === 'x' ? [c[0] + m * sx, c[1]] : [c[0], c[1] + m * sy]
      const nrm: XY = along === 'x' ? [0, -sy] : [-sx, 0]
      const tan: XY = [-nrm[1], nrm[0]]
      const hw = 5, z0 = Z.pavWall - 2, zA = Z.pavWall + 11, d0 = 0.35, d1 = -4
      const P = (u: number, d: number, z: number): V3 => [mid[0] + tan[0] * u + nrm[0] * d, mid[1] + tan[1] * u + nrm[1] * d, z]
      granite.tri(P(-hw, d0, z0), P(hw, d0, z0), P(0, d0, zA))
      granite.tri(P(hw, d1, z0), P(-hw, d1, z0), P(0, d1, zA))
      granite.quad(P(hw, d0, z0), P(hw, d1, z0), P(0, d1, zA), P(0, d0, zA))
      granite.quad(P(-hw, d1, z0), P(-hw, d0, z0), P(0, d0, zA), P(0, d1, zA))
      // a coping on the gable's slopes
      copper.quad(P(hw + 0.3, d0 + 0.2, z0 + 0.1), P(hw + 0.3, d1, z0 + 0.1), P(0, d1, zA + 0.5), P(0, d0 + 0.2, zA + 0.5))
      copper.quad(P(-hw - 0.3, d1, z0 + 0.1), P(-hw - 0.3, d0 + 0.2, z0 + 0.1), P(0, d0 + 0.2, zA + 0.5), P(0, d1, zA + 0.5))
      // twin arched windows in the gable
      for (const u of [-1.1, 1.1]) panel(win, [mid[0] + nrm[0] * d0, mid[1] + nrm[1] * d0], tan, nrm, u, 1.5, Z.pavWall - 0.5, Z.pavWall + 5.5, true, 0.05)
    }
  }

  // ---------------------------------------------------------------- facade windows
  // storey groups (from the photos): arcaded ground floor, floors 2-3, 4-5
  const bayW = 4.2
  const towerN = { x0: CX - 8, x1: CX + 8 }, towerS = { x0: CX - 6.5, x1: CX + 6.5 }
  const ringPlain = rect(X0, Y0, X1, Y1) // south, east, north, west (ccw)
  const groundOf = [GROUND.s, GROUND.e, GROUND.n, GROUND.w]
  for (let i = 0; i < 4; i++) {
    const a = ringPlain[i], b = ringPlain[(i + 1) % 4], { L, t, n } = face(a, b)
    const g = groundOf[i]
    const bays = Math.round(L / bayW), w = L / bays
    for (let k = 0; k < bays; k++) {
      const s = (k + 0.5) * w
      // skip turrets and towers
      const p: XY = [a[0] + t[0] * s, a[1] + t[1] * s]
      if (turrets.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 3.6)) continue
      if (i === 2 && p[0] > towerN.x0 - 1 && p[0] < towerN.x1 + 1) continue
      if (i === 0 && p[0] > towerS.x0 - 1 && p[0] < towerS.x1 + 1) continue
      const pw = w - 1.5
      panel(win, a, t, n, s, pw, g + 1.6, Math.max(g + 5, 8.6), true)
      panel(win, a, t, n, s, pw, 10.2, 19.4, true)
      panel(win, a, t, n, s, pw, 21, 27.2, false)
    }
  }
  // courtyard windows: two groups above the court roof
  for (let i = 0; i < 4; i++) {
    const a = inner[i], b = inner[(i + 1) % 4], { L, t, n } = face(a, b)
    const bays = Math.round(L / 4.5), w = L / bays
    for (let k = 0; k < bays; k++) {
      const s = (k + 0.5) * w
      panel(win, a, t, n, s, w - 1.6, 9.5, 19.5, false)
      panel(win, a, t, n, s, w - 1.6, 21.5, 30.5, false)
    }
  }

  // ---------------------------------------------------------------- the clock tower (4th Street)
  {
    const s = 16, yc = Y1 + 2 - s / 2, c: XY = [CX, yc], h = s / 2
    const shaft = ccw(chamfer(rect(c[0] - h, c[1] - h, c[0] + h, c[1] + h), 0.45))
    const zTop = 90, zBelfry = 98, zPyr = 99.4, apex = 117
    prism(granite, shaft, 0, zBelfry, null)
    band(granite, shaft, 0.7, 88.4, zTop)
    band(granite, shaft, 0.55, zBelfry, zPyr)
    const top = rect(c[0] - h + 0.2, c[1] - h + 0.2, c[0] + h - 0.2, c[1] + h - 0.2)
    capRing(roof, ccw(rect(c[0] - h - 0.6, c[1] - h - 0.6, c[0] + h + 0.6, c[1] + h + 0.6)), zPyr - 0.01)
    pyramid(copper, ccw(top), zPyr, [c[0], c[1], apex])
    // finial
    pyramid(granite, ccw(rect(c[0] - 0.45, c[1] - 0.45, c[0] + 0.45, c[1] + 0.45)), apex - 1.5, [c[0], c[1], apex + 4.5])
    // corner turrets of the belfry
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) turret(granite, copper, [c[0] + dx * (h - 0.3), c[1] + dy * (h - 0.3)], 1.7, 86, zPyr + 0.8, zPyr + 7.5, 10)
    // faces: clock, slit windows, belfry arcade
    const sq = rect(c[0] - h, c[1] - h, c[0] + h, c[1] + h)
    for (let i = 0; i < 4; i++) {
      const a = sq[i], b = sq[(i + 1) % 4], { t, n } = face(a, b)
      // clock face
      const cc: V3 = [a[0] + t[0] * h + n[0] * 0.1, a[1] + t[1] * h + n[1] * 0.1, 81.5]
      const ring = 16, R = 3.4
      for (let k = 0; k < ring; k++) {
        const q0 = (2 * Math.PI * k) / ring, q1 = (2 * Math.PI * (k + 1)) / ring
        clock.tri(cc, [cc[0] + t[0] * R * Math.cos(q0), cc[1] + t[1] * R * Math.cos(q0), cc[2] + R * Math.sin(q0)], [cc[0] + t[0] * R * Math.cos(q1), cc[1] + t[1] * R * Math.cos(q1), cc[2] + R * Math.sin(q1)])
      }
      // three tall slit windows
      for (const u of [-3.2, 0, 3.2]) panel(win, a, t, n, h + u, 1.5, i === 0 ? 46 : 46, 73, true)
      // belfry arcade
      for (const u of [-4, 0, 4]) panel(win, a, t, n, h + u, 2.4, 91, 97, true)
      // north face below the roof: entrance arch and storey windows
      if (i === 2) {
        panel(win, a, t, n, h, 5.2, GROUND.n + 0.2, 8.2, true)
        for (const u of [-4.6, 4.6]) { panel(win, a, t, n, h + u, 2.2, 10.2, 19.4, true); panel(win, a, t, n, h + u, 2.2, 21, 27.2, false) }
        for (const u of [-3.2, 0, 3.2]) panel(win, a, t, n, h + u, 1.5, 30.5, 40, true)
      }
    }
  }

  // ---------------------------------------------------------------- the south tower (5th Street)
  {
    const s = 13, yc = Y0 - 1.5 + s / 2, c: XY = [CX, yc], h = s / 2
    const shaft = ccw(chamfer(rect(c[0] - h, c[1] - h, c[0] + h, c[1] + h), 0.45))
    const zTop = 60, zPyr = 61.2, apex = 73
    prism(granite, shaft, 0, zTop, null)
    band(granite, shaft, 0.5, 52, 53.2)
    band(granite, shaft, 0.5, zTop, zPyr)
    capRing(roof, ccw(rect(c[0] - h - 0.5, c[1] - h - 0.5, c[0] + h + 0.5, c[1] + h + 0.5)), zPyr - 0.01)
    pyramid(copper, ccw(rect(c[0] - h + 0.3, c[1] - h + 0.3, c[0] + h - 0.3, c[1] + h - 0.3)), zPyr, [c[0], c[1], apex])
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) turret(granite, copper, [c[0] + dx * (h - 0.2), c[1] + dy * (h - 0.2)], 1.25, 54, zPyr + 0.6, zPyr + 5.5, 10)
    const sq = rect(c[0] - h, c[1] - h, c[0] + h, c[1] + h)
    for (let i = 0; i < 4; i++) {
      const a = sq[i], b = sq[(i + 1) % 4], { t, n } = face(a, b)
      for (const u of [-3, 0, 3]) panel(win, a, t, n, h + u, 1.5, i === 0 ? 33 : 44, 50.5, true)
      for (const u of [-3, 0, 3]) panel(win, a, t, n, h + u, 1.6, 54.5, 58.8, false)
      if (i === 0) {
        panel(win, a, t, n, h, 6, GROUND.s + 0.2, 10, true)
        for (const u of [-3.6, 3.6]) { panel(win, a, t, n, h + u, 2, 11.5, 19.4, true); panel(win, a, t, n, h + u, 2, 21, 27.2, false) }
      }
    }
  }

  return finishGlb('msp-minneapolis-city-hall', 'Minneapolis City Hall', [
    { part: granite, material: finish('city-hall-granite', 0xbf9b8f) },
    { part: copper, material: finish('city-hall-copper', 0x8fbe9f) },
    { part: roof, material: { ...PALETTE.roof, color: 0x8f969c } },
    { part: win, material: PALETTE.window },
    { part: clock, material: finish('neon-city-hall-clock', 0xf1e9d6) },
  ], {
    bearing: 30.5, height: 121.5,
    replaces: ['relation/4503577'],
  }, 6500)
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-minneapolis-city-hall.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
