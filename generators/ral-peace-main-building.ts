/**
 * Main Building, William Peace University, Raleigh (1857–1872, Greek Revival,
 * NRHP 1973), with the wings OSM draws as the same footprint: procedural,
 * CC0-1.0. bun generators/ral-peace-main-building.ts [out.glb]
 *
 * Footprint: OSM way/47663144 (WakeGIS, unnamed, building=university) is one
 * outline for the Main Building and the wings joined to it: the 4-storey main
 * block with its portico, its rear ells, a low link and a long gabled wing to
 * the west, and a low link stub to the east. The model draws the whole way so
 * the map has nothing left to draw under it; the Main Building in full, the
 * west wing and links as plain masses (see doubts).
 *
 * Frame: x east, y north, z up, metres, turned to bearing 3 (the outline's
 * walls). Origin: the way's area centroid (-78.6378323, 35.7891446).
 * Plan (OSM, model frame): front y -12.4 … -13.0 from x -17 to 44; the
 * portico x 6.1 … 21.3 out to y -16.8 (centre x 13.7, the façade's axis).
 * Read with photo t, the postcard and NAIP as: the four-storey central block
 * x 1.5 … 25.9 (two bays each side of the portico, photo t) with a rear arm
 * x 6 … 19.9 to y 25.7 (NAIP's cross-shaped hipped roof); three-storey links
 * x -5 … 1.5 and 25.9 … 32.4; and gable-fronted three-storey pavilions
 * x -17 … -5 (to y 22.6) and x 32.4 … 44 (to y 16.4), long gabled ranges
 * running north (postcard, NAIP); west link x -26.2 … -16.5, y -7.8 … -3.2; west wing x -43.5 … -26.1,
 * y -27.6 … 16.2 with a south pavilion x -41.9 … -29.7 to y -32.2; east link
 * x 43.5 … 55.2, y -7.7 … -3.9.
 *
 * Ground: Mapterhorn z13 (z14/15 missing over Raleigh) rises ~2.5 m from the
 * north-east corner (lowest, y = 0) to the south front; the front's ground
 * is GF = 2.3, the rear's ~0.7. Walls run down to 0, so the rear shows a
 * taller brick base, as a building on that slope does. Elevation 0.
 *
 * Heights (estimated; no lidar over Wake County): photo-scaled from t with
 * the portico's width (OSM, 15.2 m) as the ruler: arcaded brick ground stage
 * to GF + 3.75, the four giant columns to GF + 15.4, entablature to GF + 16.6,
 * pediment apex GF + 20.7; balcony floors at GF + 3.75, 7.6, 11.45; main
 * eaves GF + 16.2, low hipped roof to GF + 19.0. Links and pavilions: three
 * storeys, eaves GF + 11.0, pavilion gables to GF + 14.6 (postcard: their
 * cornices sit a storey under the main block's). Far west wing (no clear photo):
 * three storeys, eaves GF + 10.5, gable ridge GF + 14.5. Links one or two
 * storeys, flat (white roofs in NAIP).
 *
 * Photos (evidence; local copies in landmarks-scratch/ral/work/ral-peace-main-building):
 *  t  "Peace-College-20080321.jpeg", Jmturner, public domain,
 *     https://commons.wikimedia.org/wiki/File:Peace-College-20080321.jpeg
 *     — the south front square on: portico, balconies, two bays each side,
 *     the pavilions' white-trimmed gables at both edges.
 *  l  "Main Building, William Peace University, Raleigh, NC (27224708037).jpg",
 *     Warren LeMay, CC0, https://commons.wikimedia.org/wiki/File:Main_Building,_William_Peace_University,_Raleigh,_NC_(27224708037).jpg
 *     — the front from far down the lawn.
 *  pc "Peace, A Junior College for Women, Raleigh, N.C." postcard, UNC
 *     Libraries via Flickr, public domain mark,
 *     https://www.flickr.com/photos/122654055@N06/23110302971 — the front and
 *     both wings from the south-west.
 * Aerial: USGS NAIP (public domain): the cross-shaped hipped roof, grey
 * slate, the gabled west wing, white flat links.
 * Look-only: none (State Archives views were listed, not opened).
 *
 * Left out: the balusters (plain rail bands), window sashes and lintels, the
 * fountain, the cupola-less roof's chimneys.
 * Doubts: no licensed photo of the sides or rear: the rear arm's and the
 * pavilions' depths, heights and windows, and the whole far west wing, are
 * estimated from NAIP and the postcard (c. 1930s; check nothing changed).
 * Night: windows are `window`; the portico is not floodlit in evidence.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, flatShape, archShape, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box, quadO, triO } from './nash-tennessee-state-capitol'
import { prismX, prismY, roofX, roofY } from './ral-holy-name-of-jesus-cathedral'

const GF = 2.3 // the front's ground above y = 0
const GR = 0.7 // the rear's
const CX = 13.7 // façade axis
const MX0 = 1.5, MX1 = 25.9, MY0 = -12.7, MY1 = 4.0
const EA = GF + 16.2, RH = GF + 19.0
const PX0 = 6.1, PX1 = 21.3, PY = -16.8

/** A hipped roof over a rectangle: eaves at ze with overhang ov, ridge at zr. */
function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, ov = 0.6, t = 0.3) {
  const a0 = x0 - ov, a1 = x1 + ov, b0 = y0 - ov, b1 = y1 + ov
  const alongX = a1 - a0 >= b1 - b0
  const hw = (alongX ? b1 - b0 : a1 - a0) / 2
  const A: V3 = [a0, b0, ze], B: V3 = [a1, b0, ze], C: V3 = [a1, b1, ze], D: V3 = [a0, b1, ze]
  const k = 1 / ((zr - ze) / hw)
  if (alongX) {
    const ym = (b0 + b1) / 2, R0: V3 = [a0 + hw, ym, zr], R1: V3 = [a1 - hw, ym, zr]
    quadO(p, A, B, R1, R0, [0, -1, k]); quadO(p, C, D, R0, R1, [0, 1, k])
    triO(p, B, C, R1, [1, 0, k]); triO(p, D, A, R0, [-1, 0, k])
  } else {
    const xm = (a0 + a1) / 2, R0: V3 = [xm, b0 + hw, zr], R1: V3 = [xm, b1 - hw, zr]
    quadO(p, D, A, R0, R1, [-1, 0, k]); quadO(p, B, C, R1, R0, [1, 0, k])
    triO(p, A, B, R0, [0, -1, k]); triO(p, C, D, R1, [0, 1, k])
  }
  const lo = (q: V3): V3 => [q[0], q[1], q[2] - t]
  for (const [u, v, n] of [[A, B, [0, -1, 0]], [B, C, [1, 0, 0]], [C, D, [0, 1, 0]], [D, A, [-1, 0, 0]]] as [V3, V3, V3][]) quadO(p, u, v, lo(v), lo(u), n)
  quadO(p, lo(A), lo(B), lo(C), lo(D), [0, 0, -1])
}

function build() {
  const brick = new Part(), trim = new Part(), slate = new Part(), win = new Part(), dark = new Part()

  // a sash window in a pale frame
  const sash = (f: Face, s: number, z0: number, h: number, w = 1.15, arched = false) => {
    if (arched) {
      flatShape(trim, f, archShape(s, w + 0.3, z0 - 0.15, z0 + h - w / 2, 8), 0.04)
      flatShape(win, f, archShape(s, w, z0, z0 + h - w / 2, 8), 0.07)
    } else {
      flatShape(trim, f, [[s - w / 2 - 0.15, z0 - 0.15], [s + w / 2 + 0.15, z0 - 0.15], [s + w / 2 + 0.15, z0 + h + 0.25], [s - w / 2 - 0.15, z0 + h + 0.25]], 0.04)
      flatShape(win, f, [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z0 + h], [s - w / 2, z0 + h]], 0.07)
    }
  }
  const FLOORS = [0.9, 5.0, 8.85, 12.7] // sills above the front ground
  const H = [2.4, 2.4, 2.3, 2.2]
  const rows = (f: Face, ss: number[], g: number, n = 4) => { for (const s of ss) for (let i = 0; i < n; i++) sash(f, s, g + FLOORS[i], H[i]) }

  // ============================================================ the central block (four storeys)
  box(brick, MX0, MY0, MX1, MY1, 0, EA, null)
  // a white band over the ground storey and the cornice (photo t)
  box(trim, MX0 - 0.08, MY0 - 0.08, MX1 + 0.08, MY1 + 0.08, GF + 3.9, GF + 4.2, null)
  box(trim, MX0 - 0.35, MY0 - 0.35, MX1 + 0.35, MY1 + 0.35, EA - 0.7, EA, null)
  hipRoof(slate, MX0, MY0, MX1, MY1, EA, RH)
  {
    const f: Face = { o: [CX, MY0, 0], n: [0, -1] } // s runs east
    rows(f, [-10.6, -8.1, 8.1, 10.6], GF)
    // the three bays between the columns, behind the balconies: tall doors, the centre arched (photo t)
    for (const s of [-4.45, 0, 4.45]) for (let i = 1; i < 4; i++) sash(f, s, GF + FLOORS[i] - 1.0, H[i] + 1.0, s === 0 ? 1.4 : 1.15, s === 0)
  }
  // the rear arm of the cross (NAIP)
  box(brick, 6.0, MY1 - 0.5, 19.9, 25.7, 0, EA, null)
  box(trim, 5.7, MY1 - 0.5, 20.2, 26.0, EA - 0.6, EA, null)
  hipRoof(slate, 6.0, MY1 - 0.5, 19.9, 25.7, EA, RH - 0.3, 0.5)
  rows({ o: [12.95, 25.7, 0], n: [0, 1] }, [-4.2, 0, 4.2], GR + 0.6)

  // ============================================================ the three-storey wings
  const WE = GF + 11.0, WR = GF + 14.6
  // links between the central block and the end pavilions
  for (const [x0, x1] of [[-5.0, MX0], [MX1, 32.4]] as [number, number][]) {
    box(brick, x0, MY0 + 0.2, x1, MY1 + 9.0, 0, WE, null)
    box(trim, x0 - 0.1, MY0, x1 + 0.1, MY1 + 9.2, WE - 0.5, WE, null)
    hipRoof(slate, x0, MY0 + 0.2, x1, MY1 + 9.0, WE, WE + 1.6, 0.4)
    const f: Face = { o: [(x0 + x1) / 2, MY0 + 0.2, 0], n: [0, -1] }
    for (const s of [-0.9, 0.9]) for (let i = 0; i < 3; i++) sash(f, s * (x1 - x0) / 4.4, GF + FLOORS[i], H[i], 1.0)
  }
  // gable-fronted pavilions, their long gabled ranges running back north (NAIP, postcard)
  const pav = (x0: number, x1: number, y0: number, y1: number) => {
    const xc = (x0 + x1) / 2, hw = (x1 - x0) / 2
    prismY(brick, y0, y1, [[x0, 0], [x1, 0], [x1, WE], [xc, WR - 0.15], [x0, WE]])
    roofY(slate, y0 - 0.45, y1 + 0.4, xc, hw, WE, WR, 0.45, 0.25)
    // the white cornice across the gable foot and its raking edges: a pediment
    prismY(trim, y0 - 0.3, y0 + 0.05, [[x0 - 0.3, WE - 0.45], [x1 + 0.3, WE - 0.45], [x1 + 0.3, WE], [x0 - 0.3, WE]])
    const k = (WR - WE) / hw
    prismY(trim, y0 - 0.5, y0 - 0.2, [[x0 - 0.45, WE - 0.45 * k], [xc, WR + 0.05], [x1 + 0.45, WE - 0.45 * k], [x1 + 0.45, WE - 0.45 * k - 0.3], [xc, WR - 0.25], [x0 - 0.45, WE - 0.45 * k - 0.3]])
    const f: Face = { o: [xc, y0, 0], n: [0, -1] }
    for (const s of [-3.4, 0, 3.4]) for (let i = 0; i < 3; i++) sash(f, s, GF + FLOORS[i], H[i], 1.1)
    flatShape(win, f, Array.from({ length: 12 }, (_, i) => [0.55 * Math.cos((i / 12) * Math.PI * 2), WE + 1.4 + 0.55 * Math.sin((i / 12) * Math.PI * 2)] as XY), 0.06)
    // long sides
    for (const [x, n] of [[x0, -1], [x1, 1]] as [number, number][]) {
      const g: Face = { o: [x, (y0 + y1) / 2, 0], n: [n, 0] }
      const len = y1 - y0, m = Math.floor(len / 4)
      for (let j = 0; j < m; j++) {
        const yy = y0 + 2 + j * (len - 4) / Math.max(1, m - 1)
        if (yy < MY1 + 9.5 && ((n === 1 && x0 < CX) || (n === -1 && x0 > CX))) continue // the links join here
        const sl = n === 1 ? yy - (y0 + y1) / 2 : (y0 + y1) / 2 - yy
        for (let i = 0; i < 3; i++) sash(g, sl, GR + 0.6 + FLOORS[i], H[i], 1.0)
      }
    }
  }
  pav(-17.0, -5.0, -13.0, 22.6)
  pav(32.4, 44.0, -12.4, 16.4)
  // fills behind the links (OSM): the west ell and the east range's inner part
  for (const [x0, y0, x1, y1] of [[-5.0, MY1 + 9.0, 6.0, 15.6], [MX1, MY1 + 9.0, 32.4, 16.4]] as [number, number, number, number][]) {
    box(brick, x0, y0 - 0.2, x1, y1, 0, WE, null)
    hipRoof(slate, x0, y0 - 0.2, x1, y1, WE, WE + 1.4, 0.3)
  }

  // ============================================================ the portico
  {
    const pz0 = GF + 3.75, ctop = GF + 15.4, ent = GF + 16.6, apex = GF + 20.7
    const cols = [CX - 6.7, CX - 2.2, CX + 2.2, CX + 6.7]
    const yc = PY + 1.1
    // arcaded brick ground stage: piers under the columns, round arches between
    box(brick, PX0, PY, PX1, MY0, pz0 - 0.9, pz0, null)
    for (const x of cols) box(brick, x - 1.0, PY, x + 1.0, MY0, 0, pz0 - 0.9, null)
    box(dark, PX0 + 0.1, PY + 0.4, PX1 - 0.1, MY0, 0, pz0 - 0.95, null)
    const f: Face = { o: [CX, PY, 0], n: [0, -1] }
    for (let k = 0; k < 3; k++) {
      const a = cols[k] + 1.0, b = cols[k + 1] - 1.0, s = (a + b) / 2 - CX, w = b - a
      // the spandrel above each arch, in brick, leaving a round-headed opening
      const zs = pz0 - 0.9 - w / 2
      const spandrel: XY[] = [...archShape(s, w, zs, zs, 8).slice(2).reverse(), [s + w / 2, pz0 - 0.9], [s - w / 2, pz0 - 0.9]]
      flatShape(brick, f, spandrel, 0.0)
    }
    // stone sills and bands on the piers
    box(trim, PX0 - 0.05, PY - 0.05, PX1 + 0.05, MY0, pz0 - 0.15, pz0, trim)
    // balconies at three floors, white rails between the columns
    for (const z of [pz0, GF + 7.6, GF + 11.45]) {
      box(trim, PX0, PY + 0.1, PX1, MY0, z - 0.25, z, trim)
      // the rail stands back between the columns, so the columns read in front
      box(trim, PX0 + 0.2, yc - 0.1, PX1 - 0.2, yc + 0.1, z, z + 0.85)
      for (const x of [PX0 + 0.2, PX1 - 0.4]) box(trim, x, yc, x + 0.2, MY0, z, z + 0.85)
    }
    // the four giant columns: round, with a base and a cap
    for (const x of cols) {
      box(trim, x - 1.0, yc - 1.0, x + 1.0, yc + 1.0, pz0, pz0 + 0.4, trim, 0.08)
      const segs = 12, r0 = 0.85, r1 = 0.74
      for (let i = 0; i < segs; i++) {
        const a0 = (i / segs) * Math.PI * 2, a1 = ((i + 1) / segs) * Math.PI * 2
        const P = (a: number, r: number, z: number): V3 => [x + r * Math.cos(a), yc + r * Math.sin(a), z]
        const am = (a0 + a1) / 2
        quadO(trim, P(a0, r0, pz0 + 0.35), P(a1, r0, pz0 + 0.35), P(a1, r1, ctop - 0.5), P(a0, r1, ctop - 0.5), [Math.cos(am), Math.sin(am), 0.01])
      }
      box(trim, x - 1.0, yc - 1.0, x + 1.0, yc + 1.0, ctop - 0.5, ctop, trim, 0.08)
    }
    // entablature and pediment, with the round window in the tympanum
    box(trim, PX0 - 0.3, PY - 0.3, PX1 + 0.3, MY0 + 0.3, ctop, ent)
    const hw = (PX1 - PX0) / 2 + 0.3
    prismY(trim, PY - 0.2, MY0 + 1.0, [[CX - hw + 0.2, ent], [CX + hw - 0.2, ent], [CX, apex - 0.2]])
    const k = (apex - ent) / hw
    prismY(slate, PY - 0.45, MY0 + 2.5, [[CX - hw - 0.25, ent - 0.25 * k + 0.05], [CX, apex + 0.25], [CX + hw + 0.25, ent - 0.25 * k + 0.05], [CX + hw + 0.25, ent - 0.25 * k - 0.2], [CX, apex], [CX - hw - 0.25, ent - 0.25 * k - 0.2]])
    const tf: Face = { o: [CX, PY - 0.2, 0], n: [0, -1] }
    const ring = (r: number): XY[] => Array.from({ length: 14 }, (_, i) => [r * Math.cos((i / 14) * Math.PI * 2), ent + 1.75 + r * Math.sin((i / 14) * Math.PI * 2)] as XY)
    flatShape(win, tf, ring(0.75), 0.06)
    // the main door under the arcade
    flatShape(dark, { o: [CX, MY0, 0], n: [0, -1] }, archShape(0, 1.8, GF, GF + 2.6, 8), 0.06)
  }

  // ============================================================ links and the west wing
  box(brick, -26.2, -7.8, MX0 + 0.1, -3.2, 0, GF + 6.8, null)
  box(trim, -26.4, -8.0, MX0, -3.0, GF + 6.5, GF + 6.9, trim)
  box(brick, 43.9, -7.7, 55.2, -3.9, 0, GF + 4.2, null)
  box(trim, 44.0, -7.9, 55.4, -3.7, GF + 3.9, GF + 4.3, trim)
  for (const [x0, x1, y] of [[-26.2, -17.0, -7.8], [44.0, 55.2, -7.7]] as [number, number, number][]) {
    const f: Face = { o: [(x0 + x1) / 2, y, 0], n: [0, -1] }
    for (const s of [-(x1 - x0) / 4, (x1 - x0) / 4]) sash(f, s, GF + 0.9, 2.3)
  }
  {
    const x0 = -43.5, x1 = -26.1, xc = (x0 + x1) / 2, ze = GF + 10.5, zr = GF + 14.5
    prismY(brick, -27.6, 16.2, [[x0, 0], [x1, 0], [x1, ze], [xc, zr - 0.15], [x0, ze]])
    roofY(slate, -27.6, 16.55, xc, (x1 - x0) / 2, ze, zr, 0.45, 0.25)
    // the south pavilion: a gable facing the lawn, white-trimmed (photo t, pc)
    const p0 = -41.9, p1 = -29.7, pc = (p0 + p1) / 2, pe = GF + 10.5, pr = GF + 14.0
    prismX(brick, p0, p1, [[-32.2, 0], [-27.0, 0], [-27.0, pe], [-29.6, pr - 0.15], [-32.2, pe]])
    roofX(slate, p0 - 0.4, p1 + 0.4, -29.6, 2.6, pe, pr, 0.4, 0.25)
    prismX(trim, p0 - 0.2, p1 + 0.2, [[-32.45, pe - 0.4], [-32.2, pe - 0.4], [-32.2, pe], [-32.45, pe]])
    const f: Face = { o: [pc, -32.2, 0], n: [0, -1] }
    for (const s of [-3.6, 0, 3.6]) for (let i = 0; i < 3; i++) sash(f, s, GF - 0.3 + FLOORS[i], H[i])
    // the wing's long sides
    for (const [x, n] of [[x0, -1], [x1, 1]] as [number, number][]) {
      const g: Face = { o: [x, -6.0, 0], n: [n, 0] }
      const ss = [-18, -14, -10, -6, -2, 2, 6, 10, 14, 18]
      for (const s of ss) {
        if (n === 1 && -6.0 + s > -9.5 && -6.0 + s < -1.5) continue // the west link joins here
        for (let i = 0; i < 3; i++) sash(g, s, GF - 1.0 + FLOORS[i], H[i])
      }
    }
  }

  return finishGlb('Main Building, William Peace University', [
    { part: brick, material: finish('wpu-brick', 0xb26a55) },
    { part: trim, material: PALETTE.trim },
    { part: slate, material: finish('wpu-slate', 0x8b9196) },
    { part: win, material: PALETTE.window },
    { part: dark, material: finish('wpu-shade', 0x5b4a44) },
  ], { bearing: 3, height: GF + 20.95, replaces: ['way/47663144'] }, 6500)
}

if (import.meta.main) await writeModel('ral-peace-main-building', build())
