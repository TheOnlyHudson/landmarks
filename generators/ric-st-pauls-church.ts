/**
 * St. Paul's Episcopal Church, 815 East Grace Street, Richmond, Virginia
 * (1845, Thomas S. Stewart; Greek Revival) with its parish buildings —
 * original procedural geometry, CC0-1.0.
 * bun generators/ric-st-pauls-church.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 36.7 (the street grid: the nave runs along North
 * 9th Street, its portico facing Grace Street at +y). Anchor = the centroid
 * of the outer ring of OSM relation/19918536 (way/263138763),
 * -77.4353248, 37.5399564.
 *
 * Identity (from the photos below):
 *  1. A stuccoed temple-front church, painted warm white: a deep hexastyle
 *     Corinthian portico (six fluted columns across, the side rows running
 *     back to the front wall) under a low pediment, on a raised podium.
 *  2. The tall staged steeple rising behind the pediment: a broad square
 *     louvred stage with a dentilled cornice and a balustrade; a narrower
 *     chamfered stage with wreath roundels on the angles and a louvre in
 *     each face; an open belfry of Corinthian piers; a low grey ribbed dome
 *     and a spike finial.
 *  3. Long side walls along 9th Street with pilasters and two tiers of
 *     windows, a plain entablature and a low grey roof.
 *
 * Plan: OSM relation/19918536 (outer way/263138763, inner courtyard
 * way/1456058031), read in this frame and checked against the lidar. The
 * church is x 14.6..35.3 (lidar; OSM draws the 9th Street wall ~3 m
 * further east), y -19.5..19.5, with a three-sided chancel to y -22.5.
 * The parish buildings fill the rest of the outline round the courtyard.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014),
 * 0.5 m grid, read in this frame. y = 0 is the lowest ground (the alley on
 * the south-west side); Grace Street at the portico is 5.6 m higher, 9th
 * Street falls from 5.0 to 1.5 m along the side. Measured above y = 0:
 * nave eaves 17.0, ridge 19.5; steeple first stage 24.6 (cornice) and 25.6
 * (balustrade corners), second stage 30.1, dome top about 41 (the highest
 * returns, 41.0–41.6). Parish hall (middle block) eaves 15.4, ridge 17.4;
 * west wing eaves 12.2, ridge 13.8; south link 16.0; north link 11.0.
 * Estimated from the photos, scaled to those heights: the column rows, the
 * portico depth (three columns down each side, front wall at y 10), stage
 * widths (9.6, 6.4, belfry 5.6 m), the window and door sizes, the finial
 * (to 43.5).
 *
 * Ground: lidar and Mapterhorn slope ~5.5 m from the alley up to Grace
 * Street; elevation 0. The portico floor sits 1.4 m above Grace Street.
 *
 * Night: the church and steeple are floodlit (strongest on the steeple and
 * portico); windows glow.
 *
 * Photos (all EVIDENCE):
 *  - 2015 St. Paul's Episcopal Church - Richmond, Virginia.JPG, Farragutful,
 *    CC BY-SA 4.0 (the 9th Street side and portico from the east)
 *    https://commons.wikimedia.org/wiki/File:2015_St._Paul%27s_Episcopal_Church_-_Richmond,_Virginia.JPG
 *  - StPaulsEpiscopalRichmond.JPG, Morgan Riley, CC BY 3.0 (portico and
 *    steeple from Grace and 9th)
 *    https://commons.wikimedia.org/wiki/File:StPaulsEpiscopalRichmond.JPG
 *  - RICHMOND, Va. - 85.jpg, Peter H. Feist, CC BY-SA 4.0 (the front from
 *    Grace Street, north-west side)
 *    https://commons.wikimedia.org/wiki/File:RICHMOND,_Va._-_85.jpg
 *  - USGS NAIP orthoimagery (public domain): roof plan, courtyard.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the parish buildings (west wing, hall, links) are seen in no
 * photo used here; they are plain stucco masses with grouped windows at
 * the lidar heights. The portico's depth is read from the oblique photos.
 * The west wall of the nave above the parish hall is plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { gableRoof, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, column, prism, save } from './atl-flatiron-building'

const stucco = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dark = new Part()
type F = [XY, XY]

// ── The church ──
const X0 = 14.6, X1 = 35.3, XC = (X0 + X1) / 2, YR = -19.5, YW = 10, YF = 19.5
const EAVE = 17.0, RIDGE = 19.5, ENT = 15.6, FLOOR = 7.0
/** Ground under the church, from the lidar: 1.3 at the rear, 5.6 at Grace Street. */
const g = (y: number) => 1.3 + ((y + 22) / 42) * 4.3

box(stucco, X0, X1, YR, YW, 0, ENT, null, 0)
// the chancel: three sides to the rear
prism(stucco, [[19.5, YR], [30.5, YR], [28.6, -22.5], [21.4, -22.5]].reverse() as XY[], 0, 14.2, roof, 0.2)
// entablature round the nave and the solid entablature/ceiling of the portico
box(trim, X0 - 0.25, X1 + 0.25, YR - 0.25, YF + 0.05, ENT, EAVE, null, 0.15)
box(trim, X0 - 0.45, X1 + 0.45, YR - 0.45, YF + 0.25, EAVE - 0.4, EAVE, null, 0.1)
gableRoof(roof, stucco, X0, X1, YR, YF, EAVE, RIDGE, 'y', 0.5, 0.3)
// raking cornices on the front pediment
{
  const s = (RIDGE - EAVE) / ((X1 - X0) / 2)
  for (const sg of [-1, 1]) {
    const xa = sg < 0 ? X0 - 0.5 : X1 + 0.5, za = EAVE - 0.5 * s
    const a: V3 = [xa, YF + 0.35, za], b: V3 = [XC, YF + 0.35, RIDGE], hh = 0.45
    const q = (p: V3, dz: number, dy: number): V3 => [p[0], p[1] + dy, p[2] + dz]
    if (sg < 0) trim.quad(q(a, -hh, 0), q(b, -hh, 0), b, a)
    else trim.quad(q(b, -hh, 0), q(a, -hh, 0), a, b)
  }
}

// podium of the portico and its steps
box(stucco, X0, X1, YW, YF, 0, FLOOR, trim, 0.1)
box(stucco, X0 + 2.5, X1 - 2.5, YF, YF + 0.8, 0, FLOOR - 0.5, stucco, 0.05)

// the portico: six columns across, two more down each side, antae at the wall
{
  const xs = Array.from({ length: 6 }, (_, i) => X0 + 1.0 + (i * (X1 - X0 - 2.0)) / 5)
  const pts: XY[] = xs.map((x) => [x, YF - 0.9] as XY)
  for (const y of [15.25, 12.0]) pts.push([X0 + 1.0, y], [X1 - 1.0, y])
  for (const c of pts) {
    box(trim, c[0] - 0.62, c[0] + 0.62, c[1] - 0.62, c[1] + 0.62, FLOOR, FLOOR + 0.35, null, 0.05)
    column(trim, c, 0.58, FLOOR + 0.35, ENT - 0.85, 12)
    revolve(trim, c, [[0.6, ENT - 0.85], [0.85, ENT - 0.15], [0.85, ENT]], 8, Math.PI / 8, true, false)
  }
  for (const x of [X0 + 1.0, X1 - 1.0]) box(stucco, x - 0.55, x + 0.55, YW, YW + 0.35, FLOOR, ENT, null, 0)
}

// ── Facades of the church ──
const faceN: F = [[X1, YW], [X0, YW]] // the front wall behind the portico
const faceE: F = [[X1, YR], [X1, YW]] // 9th Street
const faceS: F = [[X0, YR], [X1, YR]]
// doors: the tall central doorway and two side doors, with windows over the side doors
{
  const W = X1 - X0
  for (const [s, w, h] of [[W / 2, 2.4, 5.2], [W / 2 - 6.3, 1.7, 3.6], [W / 2 + 6.3, 1.7, 3.6]] as [number, number, number][]) {
    onWall(trim, faceN[0], faceN[1], rectShape(s - w / 2 - 0.35, s + w / 2 + 0.35, FLOOR, FLOOR + h + 0.5), 0.04)
    onWall(dark, faceN[0], faceN[1], rectShape(s - w / 2, s + w / 2, FLOOR, FLOOR + h), 0.08)
    if (w < 2) onWall(win, faceN[0], faceN[1], rectShape(s - 0.8, s + 0.8, FLOOR + 5.0, FLOOR + 7.6), 0.06)
  }
}
// the 9th Street side: five bays between pilasters, a tall window over a low one
{
  const L = YW - YR, n = 5, bw = L / n
  for (let i = 0; i <= n; i++) {
    const s = i * bw
    onWall(trim, faceE[0], faceE[1], rectShape(Math.max(0, s - 0.45), Math.min(L, s + 0.45), 0, ENT), 0.12)
  }
  for (let i = 0; i < n; i++) {
    const s = (i + 0.5) * bw, gy = g(YR + s)
    onWall(trim, faceE[0], faceE[1], rectShape(s - 1.25, s + 1.25, 8.4, 14.5), 0.04)
    onWall(win, faceE[0], faceE[1], rectShape(s - 1.0, s + 1.0, 8.65, 14.25), 0.08)
    onWall(win, faceE[0], faceE[1], rectShape(s - 0.8, s + 0.8, gy + 1.0, gy + 3.2), 0.06)
  }
  // a plinth course
  onWall(trim, faceE[0], faceE[1], rectShape(0, L, 0, g(YR) + 0.9), 0.06)
}
// the rear: a window either side of the chancel
for (const s of [2.4, X1 - X0 - 2.4]) onWall(win, faceS[0], faceS[1], rectShape(s - 1.0, s + 1.0, 8.65, 14.25), 0.06)

// ── The steeple ──
const SX = XC, SY = 12.5
{
  const sq = (h: number, z0: number, z1: number, p: Part, bev = 0.1) => box(p, SX - h, SX + h, SY - h, SY + h, z0, z1, null, bev)
  const faces = (h: number): F[] => [
    [[SX + h, SY + h], [SX - h, SY + h]], [[SX + h, SY - h], [SX + h, SY + h]],
    [[SX - h, SY - h], [SX + h, SY - h]], [[SX - h, SY + h], [SX - h, SY - h]],
  ]
  // stage 1: broad, panelled, two louvres a face, dentilled cornice, balustrade
  const H1 = 5.0, T1 = 24.6
  sq(H1, EAVE, T1, stucco, 0)
  sq(H1 + 0.4, T1, T1 + 0.5, trim, 0.15)
  for (const [a, b] of faces(H1)) {
    for (const s of [0.55, 2 * H1 - 0.55]) onWall(trim, a, b, rectShape(s - 0.55, s + 0.55, RIDGE - 0.2, T1), 0.08)
    for (const s of [H1 - 2.1, H1 + 2.1]) {
      onWall(trim, a, b, rectShape(s - 0.75, s + 0.75, 20.4, 23.2), 0.04)
      onWall(dark, a, b, rectShape(s - 0.55, s + 0.55, 20.6, 23.0), 0.08)
    }
  }
  // balustrade: solid corner blocks and a lighter rail between
  for (const cx of [-1, 1]) for (const cy of [-1, 1]) {
    box(trim, SX + cx * (H1 - 0.3) - 0.6, SX + cx * (H1 - 0.3) + 0.6, SY + cy * (H1 - 0.3) - 0.6, SY + cy * (H1 - 0.3) + 0.6, T1 + 0.5, T1 + 1.5, trim, 0.08)
  }
  {
    const o = H1 - 0.05, i = H1 - 0.45
    const ring = (h: number): XY[] => [[SX - h, SY - h], [SX + h, SY - h], [SX + h, SY + h], [SX - h, SY + h]]
    prism(trim, ring(o), T1 + 0.5, T1 + 1.25, trim, 0.05)
    void i
  }
  // stage 2: chamfered square, louvre in each face, wreath roundels on the angles
  const H2 = 3.2, C2 = 1.45, B2 = T1 + 1.25, T2 = 28.7
  const oct = (h: number, c: number): XY[] => [
    [SX - h + c, SY - h], [SX + h - c, SY - h], [SX + h, SY - h + c], [SX + h, SY + h - c],
    [SX + h - c, SY + h], [SX - h + c, SY + h], [SX - h, SY + h - c], [SX - h, SY - h + c],
  ]
  prism(stucco, oct(H2, C2), T1 + 0.5, T2, null, 0)
  prism(trim, oct(H2 + 0.35, C2 + 0.15), T2, T2 + 0.5, trim, 0.12)
  {
    const r = oct(H2, C2)
    for (let k = 0; k < 8; k++) {
      const a = r[k], b = r[(k + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (k % 2 === 0) {
        onWall(trim, a, b, rectShape(L / 2 - 0.6, L / 2 + 0.6, B2 + 0.9, B2 + 2.2), 0.04)
        onWall(dark, a, b, rectShape(L / 2 - 0.42, L / 2 + 0.42, B2 + 1.05, B2 + 2.05), 0.08)
      } else {
        const ring = (rr: number) => Array.from({ length: 12 }, (_, i) => [L / 2 + rr * Math.cos((i / 12) * Math.PI * 2), B2 + 1.6 + rr * Math.sin((i / 12) * Math.PI * 2)] as [number, number])
        onWall(trim, a, b, ring(0.85), 0.05)
        onWall(stucco, a, b, ring(0.62), 0.08)
      }
    }
  }
  // stage 3: the open belfry, eight piers round a dark bell chamber
  const B3 = T2 + 0.5, P0 = B3 + 1.3, P1 = 35.8, T3 = 37.0
  prism(stucco, oct(3.0, 1.25), B3, B3 + 0.6, trim, 0.1)
  prism(stucco, oct(2.75, 1.15), B3 + 0.6, P0, trim, 0.1)
  prism(dark, oct(1.7, 0.7), P0, P1, null, 0)
  {
    const r = oct(2.55, 1.05)
    for (const p of r) {
      const dx = p[0] - SX, dy = p[1] - SY, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l
      const c: XY = [SX + ux * (l - 0.25), SY + uy * (l - 0.25)]
      box(trim, c[0] - 0.32, c[0] + 0.32, c[1] - 0.32, c[1] + 0.32, P0, P1, null, 0.05)
    }
  }
  prism(trim, oct(3.0, 1.25), P1, T3, trim, 0.15)
  prism(stucco, oct(2.6, 1.1), T3, T3 + 0.5, null, 0.05)
  // the low ribbed dome and the finial
  revolve(roof, [SX, SY], [[2.45, T3 + 0.5], [2.4, T3 + 1.1], [2.1, T3 + 2.2], [1.5, T3 + 3.0], [0.7, T3 + 3.6], [0, T3 + 3.8]], 8, Math.PI / 8, true, false)
  revolve(roof, [SX, SY], [[0.22, T3 + 3.7], [0.1, 43.5], [0, 43.55]], 6, 0, true, false)
  revolve(roof, [SX, SY], [[0.01, 41.6], [0.32, 41.9], [0.01, 42.2]], 6, 0, true, false)
}

// ── The parish buildings ──
{
  // west wing on Grace Street
  box(stucco, -41.9, -17.4, 0.9, 18.9, 0, 12.2, null, 0)
  gableRoof(roof, stucco, -41.9, -17.4, 0.9, 18.9, 12.2, 13.8, 'x', 0.3, 0.2)
  // parish hall (middle block)
  box(stucco, -17.4, 2.1, -22.3, 19.1, 0, 15.4, null, 0)
  gableRoof(roof, stucco, -17.4, 2.1, -22.3, 19.1, 15.4, 17.4, 'y', 0.3, 0.2)
  // south link and north link round the courtyard
  box(stucco, 2.1, X0, -22.2, -11.1, 0, 16.0, roof, 0.3)
  box(stucco, 2.1, 13.7, 5.9, 11.8, 0, 11.0, roof, 0.3)
  box(stucco, 13.7, X0, 5.9, 11.8, 0, 11.0, roof, 0.1)
  // grouped windows: two storeys on the Grace Street fronts, the alley side, the west end
  const row = (f: F, ss: number[], z0: number, z1: number, w = 1.3) => {
    for (const s of ss) onWall(win, f[0], f[1], rectShape(s - w / 2, s + w / 2, z0, z1), 0.06)
  }
  const grace = 6.0
  row([[-17.4, 18.9], [-41.9, 18.9]], [2.5, 5.5, 8.5, 11.5, 14.5, 17.5, 20.5], grace + 1.0, grace + 3.0)
  row([[-17.4, 18.9], [-41.9, 18.9]], [2.5, 5.5, 8.5, 11.5, 14.5, 17.5, 20.5], grace + 4.0, grace + 5.6)
  row([[2.1, 19.1], [-17.4, 19.1]], [3.5, 7.5, 12.0, 16.0], grace + 1.2, grace + 7.6, 1.6)
  row([[-41.9, 18.9], [-41.9, 0.9]], [3.5, 9.0, 14.5], grace + 1.0, grace + 3.0)
  row([[-41.9, 18.9], [-41.9, 0.9]], [3.5, 9.0, 14.5], grace + 4.0, grace + 5.6)
  row([[-17.4, -22.3], [2.1, -22.3]], [3.0, 7.0, 12.0, 16.5], 2.0, 5.0, 1.6)
  row([[-17.4, -22.3], [2.1, -22.3]], [3.0, 7.0, 12.0, 16.5], 7.0, 12.0, 1.6)
  row([[2.1, -22.2], [X0, -22.2]], [3.0, 6.5, 9.5], 2.0, 5.0, 1.4)
  row([[2.1, -22.2], [X0, -22.2]], [3.0, 6.5, 9.5], 7.0, 12.5, 1.4)
}

const lit = (p: V3, n: V3) => (p[2] > EAVE ? 0.9 : p[1] > YW - 0.5 ? 0.75 : n[2] > 0.7 ? 0.2 : 0.5)
await save('ric-st-pauls-church', "St. Paul's Episcopal Church", [
  { part: stucco, material: { ...finish('stpauls-stucco', 0xe9e4d9), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: roof, material: finish('stpauls-roof', 0xa7aaa3) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('stpauls-louvre', 0x5a5e63) },
], { height: 43.55, anchor: [37.5399564, -77.4353248], bearing: 36.7 })
