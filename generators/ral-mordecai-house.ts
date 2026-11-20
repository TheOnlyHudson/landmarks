/**
 * Mordecai House, Raleigh (c. 1785; Greek Revival front by William Nichols,
 * 1824–26): procedural, CC0-1.0.
 * bun generators/ral-mordecai-house.ts [out.glb]
 *
 * Frame: x east, y north, z up, metres, turned to bearing 10 (OSM's walls).
 * Origin: the area centroid of way/47738082 (-78.633301, 35.7926829).
 * Plan (OSM, WakeGIS, in the model frame): the whole house x -8.0 … 7.56,
 * y -7.46 … 9.0, the portico x -2.61 … 2.9 out to y -10.05 (south front),
 * a notch at the NW corner (x -8.0 … -6.2, y 5.9 … 9.0). Read with the photos
 * as the 1826 front block (y -7.46 … 1.5, five bays, low hipped roof, the
 * two-tier pedimented portico) and the older rear block behind it
 * (x -6.2 … 3.6, y 1.5 … 9, two storeys, gable roof running north–south as
 * NAIP shows, brick chimneys) with a red-roofed porch along its east side,
 * inside OSM's outline (photo t, taken from the SE; NAIP's red roof).
 *
 * Ground: Mapterhorn z13 falls ~0.6 m west to east under the house; y = 0 is
 * the east side's ground, G = 0.5 the house's mean ground. Brick
 * foundation to G + 0.7. Elevation 0.
 *
 * Heights (estimated; no lidar over Wake County, no published dimensions):
 * from the photos, with the clapboard courses and the front door (~2.4 m with
 * its transom) as the ruler: storeys ~3.4 m, eaves of the front block G + 7.6,
 * hip ridge G + 8.8 (a low hip, barely seen in photo x); portico deck G + 0.7,
 * gallery floor G + 4.3, upper columns to G + 7.3, pediment apex G + 9.3;
 * the rear block's eaves G + 6.4, ridge G + 8.9; chimneys to ~G + 10.4.
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/ral-mordecai-house):
 *  t  "Historic Mordecai House-Raleigh-NC-13 Sept 2010.jpeg", Mark Turner,
 *     public domain, https://commons.wikimedia.org/wiki/File:Historic_Mordecai_House-Raleigh-NC-13_Sept_2010.jpeg
 *     — south front and east side from the SE, the rear block and its porch.
 *  x  "Mordecai House Christmas 2012.JPG", Leah Rucker, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Mordecai_House_Christmas_2012.JPG
 *     — the south front, nearly square on.
 *  j  "Birthplace of Andrew Johnson, Mordecai House in rear.JPG", CC BY 3.0
 *     (Commons uploader, "self"), https://commons.wikimedia.org/wiki/File:Birthplace_of_Andrew_Johnson,_Mordecai_House_in_rear.JPG
 *     — the rear block, chimneys and porch from the NW, far off.
 *  r2, r3, r1 "The Mordecai House", C Jill Reed, CC BY-SA 2.0,
 *     https://www.flickr.com/photos/57505599@N00/4560313596 ,
 *     https://www.flickr.com/photos/57505599@N00/4560313970 ,
 *     https://www.flickr.com/photos/57505599@N00/4559685625 — the front from
 *     the SW and S; the rear and its chimneys from the garden.
 * Aerial: USGS NAIP (public domain): grey and red roofs, mostly under trees.
 * Look-only: none used (State Archives photos seen in the search, not opened).
 *
 * Left out: clapboard lines, balusters (the gallery rail is a plain band),
 * the steps, window sashes, the rear porch's railings.
 * Doubts: the rear block's form and the porch's exact place (one oblique
 * photo, much in trees); the east side (no photo); all heights estimated.
 * Night: windows are `window`; the house is a museum, not floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, flatShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, quadO, triO } from './nash-tennessee-state-capitol'
import { prismY, roofY } from './ral-holy-name-of-jesus-cathedral'

const G = 0.5
const X0 = -8.0, X1 = 7.56, YF = -7.46, YM = 1.5, YB = 9.0
const BASE = G + 0.7, EA = G + 7.6, RH = G + 8.8
const RX0 = -6.2, RX1 = 3.6, RE = G + 6.4, RR = G + 8.9
const RXC0 = (-6.2 + 3.6) / 2
const PX0 = -2.61, PX1 = 2.9, PY = -10.05, PXC = (PX0 + PX1) / 2

/** A hipped roof over a rectangle: eaves at ze with overhang ov, ridge at zr along the long side. */
function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, ov = 0.5, t = 0.22) {
  const a0 = x0 - ov, a1 = x1 + ov, b0 = y0 - ov, b1 = y1 + ov
  const hw = (b1 - b0) / 2, ym = (b0 + b1) / 2
  const k = (zr - ze) / hw // pitch from the overhang line
  const r0 = a0 + hw, r1 = a1 - hw
  const A: V3 = [a0, b0, ze], B: V3 = [a1, b0, ze], C: V3 = [a1, b1, ze], D: V3 = [a0, b1, ze]
  const R0: V3 = [r0, ym, zr], R1: V3 = [r1, ym, zr]
  quadO(p, A, B, R1, R0, [0, -1, 1 / k]); quadO(p, C, D, R0, R1, [0, 1, 1 / k])
  triO(p, B, C, R1, [1, 0, 1 / k]); triO(p, D, A, R0, [-1, 0, 1 / k])
  // fascia band and soffit
  const lo = (q: V3): V3 => [q[0], q[1], q[2] - t]
  for (const [u, v, n] of [[A, B, [0, -1, 0]], [B, C, [1, 0, 0]], [C, D, [0, 1, 0]], [D, A, [-1, 0, 0]]] as [V3, V3, V3][]) quadO(p, u, v, lo(v), lo(u), n)
  quadO(p, lo(A), lo(B), lo(C), lo(D), [0, 0, -1])
}

function build() {
  const siding = new Part(), trim = new Part(), dark = new Part(), win = new Part(), brick = new Part()

  // ============================================================ the front block
  box(brick, X0, YF, X1, YM, 0, BASE, null)
  box(siding, X0, YF, X1, YM, BASE, EA, null)
  // corner boards and the cornice
  for (const x of [X0, X1 - 0.3]) for (const y of [YF, YM - 0.3]) box(trim, x - 0.03, y - 0.03, x + 0.33, y + 0.33, BASE, EA - 0.3, null)
  box(trim, X0 - 0.2, YF - 0.2, X1 + 0.2, YM + 0.2, EA - 0.45, EA, null)
  hipRoof(dark, X0, YF, X1, YM, EA, RH, 0.45)

  // ============================================================ the rear block (c. 1785)
  // two storeys, ridge running north–south (NAIP), set in from the front
  // block's east wall, with a red-roofed porch along its east side (photo t)
  box(brick, RX0, YM - 0.2, RX1, YB, 0, BASE, null)
  const RXC = (RX0 + RX1) / 2, RHW = (RX1 - RX0) / 2
  const sec: XY[] = [[RX0, BASE], [RX1, BASE], [RX1, RE], [RXC, RR - 0.15], [RX0, RE]]
  prismY(siding, YM - 0.2, YB, sec)
  roofY(dark, YM - 0.2, YB + 0.4, RXC, RHW, RE, RR, 0.4, 0.22)
  // brick chimneys: one on the north gable, one outside the west wall (photos t, x, j)
  box(brick, RXC - 0.9, YB, RXC + 0.9, YB + 0.8, 0, RE, brick, 0.08)
  box(brick, RXC - 0.6, YB - 0.3, RXC + 0.6, YB + 0.6, RE, RR + 1.0, brick, 0.06)
  box(brick, RX0 - 0.8, 4.6, RX0, 6.4, 0, RE - 0.4, brick, 0.08)
  box(brick, RX0 - 0.6, 4.95, RX0 + 0.3, 6.05, RE - 0.4, RR + 0.6, brick, 0.06)
  // the east porch: a red shed roof on slim columns
  {
    const px = X1 - 0.25, y0 = YM + 0.1, y1 = YB - 0.2, zl = G + 3.5, zh = G + 4.4
    box(trim, RX1, y0, X1, y1, BASE - 0.2, BASE, null)
    for (const y of [y0 + 0.25, (2 * y0 + y1) / 3, (y0 + 2 * y1) / 3, y1 - 0.25]) box(trim, px - 0.13, y - 0.13, px + 0.13, y + 0.13, BASE, zl, null, 0.04)
    prismY(brick, y0 - 0.2, y1 + 0.2, [[RX1, zh + 0.1], [X1 + 0.45, zl - 0.05], [X1 + 0.45, zl - 0.3], [RX1, zh - 0.15]])
  }

  // ============================================================ windows and shutters
  const sash = (f: Face, s: number, w: number, z0: number, h: number, shutters = true) => {
    flatShape(trim, f, [[s - w / 2 - 0.12, z0 - 0.12], [s + w / 2 + 0.12, z0 - 0.12], [s + w / 2 + 0.12, z0 + h + 0.15], [s - w / 2 - 0.12, z0 + h + 0.15]], 0.04)
    flatShape(win, f, [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z0 + h], [s - w / 2, z0 + h]], 0.07)
    if (shutters) for (const sg of [-1, 1]) {
      const a = s + sg * (w / 2 + 0.14), b = a + sg * w * 0.5
      flatShape(dark, f, [[Math.min(a, b), z0 - 0.05], [Math.max(a, b), z0 - 0.05], [Math.max(a, b), z0 + h + 0.05], [Math.min(a, b), z0 + h + 0.05]], 0.07)
    }
  }
  const L1 = G + 1.6, H1 = 2.0, L2 = G + 5.0, H2 = 1.8
  // south front: two bays each side of the portico, both floors (photo x)
  {
    const f: Face = { o: [PXC, YF, 0], n: [0, -1] }
    for (const s of [-6.6, -4.3, 4.3, 6.6].map((v) => v - PXC + 0.15)) { sash(f, s, 0.95, L1, H1); sash(f, s, 0.95, L2, H2) }
    // under the portico: the door with sidelights and transom, and the gallery door above
    flatShape(trim, f, [[-1.2, BASE], [1.2, BASE], [1.2, BASE + 3.0], [-1.2, BASE + 3.0]], 0.04)
    flatShape(win, f, [[-1.05, BASE + 2.45], [1.05, BASE + 2.45], [1.05, BASE + 2.9], [-1.05, BASE + 2.9]], 0.07)
    flatShape(win, f, [[-1.05, BASE + 0.4], [-0.62, BASE + 0.4], [-0.62, BASE + 2.3], [-1.05, BASE + 2.3]], 0.07)
    flatShape(win, f, [[0.62, BASE + 0.4], [1.05, BASE + 0.4], [1.05, BASE + 2.3], [0.62, BASE + 2.3]], 0.07)
    flatShape(siding, f, [[-0.55, BASE], [0.55, BASE], [0.55, BASE + 2.35], [-0.55, BASE + 2.35]], 0.08)
    sash(f, 0, 1.1, G + 4.7, 2.3, false)
  }
  // west and east sides of the front block: two bays
  for (const [x, n] of [[X0, -1], [X1, 1]] as [number, number][]) {
    const f: Face = { o: [x, (YF + YM) / 2, 0], n: [n, 0] }
    for (const s of [-2.0, 2.0]) { sash(f, s, 0.95, L1, H1); sash(f, s, 0.95, L2, H2) }
  }
  // rear block: windows on its west and east walls and the north gable
  for (const [x, n] of [[RX0, -1], [RX1, 1]] as [number, number][]) {
    const g: Face = { o: [x, (YM + YB) / 2, 0], n: [n, 0] }
    for (const s of [-2.2, 2.2]) { if (n < 0 && s * n > 0) continue; sash(g, s, 0.9, L1, 1.8); sash(g, s, 0.9, G + 4.4, 1.6) }
  }
  {
    const f: Face = { o: [RXC0, YB, 0], n: [0, 1] }
    for (const s of [-3.0, 3.0]) { sash(f, s, 0.9, L1, 1.8); sash(f, s, 0.9, G + 4.4, 1.6) }
  }

  // ============================================================ the portico
  {
    const cols = [PX0 + 0.35, PX0 + 1.95, PX1 - 1.95, PX1 - 0.35]
    const yc = PY + 0.4, GAL = G + 4.3, TOP = G + 7.3
    box(brick, PX0, PY, PX1, YF, 0, BASE - 0.15, null)
    box(trim, PX0, PY, PX1, YF, BASE - 0.15, BASE, null)
    const col = (x: number, z0: number, z1: number, r: number) => {
      box(trim, x - r - 0.06, yc - r - 0.06, x + r + 0.06, yc + r + 0.06, z0, z0 + 0.2)
      // an octagonal shaft, bevelled box
      box(trim, x - r, yc - r, x + r, yc + r, z0 + 0.2, z1 - 0.2, null, r * 0.3)
      box(trim, x - r - 0.08, yc - r - 0.08, x + r + 0.08, yc + r + 0.08, z1 - 0.2, z1)
    }
    for (const x of cols) col(x, BASE, GAL - 0.35, 0.25)
    // gallery floor and its rail
    box(trim, PX0, PY, PX1, YF, GAL - 0.35, GAL, trim)
    for (const x of cols) col(x, GAL, TOP, 0.22)
    box(trim, PX0 + 0.1, PY + 0.25, PX1 - 0.1, PY + 0.4, GAL, GAL + 1.0)
    for (const x of [PX0 + 0.25, PX1 - 0.4]) box(trim, x, PY + 0.25, x + 0.15, YF, GAL, GAL + 1.0)
    // entablature and pediment
    box(trim, PX0 - 0.15, PY - 0.15, PX1 + 0.15, YF, TOP, TOP + 0.6)
    const pz = G + 9.3
    prismY(trim, PY - 0.15, YF + 0.5, [[PX0 - 0.15, TOP + 0.6], [PX1 + 0.15, TOP + 0.6], [PXC, pz]])
    // the pediment's roof slopes
    const hw = (PX1 - PX0) / 2 + 0.35, k = (pz - TOP - 0.6) / ((PX1 - PX0) / 2 + 0.15)
    prismY(dark, PY - 0.35, YF + 0.6, [[PXC - hw, pz - hw * k + 0.05], [PXC, pz + 0.22], [PXC + hw, pz - hw * k + 0.05], [PXC + hw, pz - hw * k - 0.15], [PXC, pz], [PXC - hw, pz - hw * k - 0.15]])
  }

  return finishGlb('Mordecai House', [
    { part: siding, material: finish('mor-siding', 0xecdca0) },
    { part: trim, material: PALETTE.trim },
    { part: dark, material: finish('mor-roof', 0x737a7b) },
    { part: win, material: PALETTE.window },
    { part: brick, material: finish('mor-brick', 0xa86553) },
  ], { bearing: 10, height: G + 10.6, replaces: ['way/47738082'] }, 5000)
}

if (import.meta.main) await writeModel('ral-mordecai-house', build())
