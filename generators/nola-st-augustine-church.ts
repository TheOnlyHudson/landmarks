/**
 * St. Augustine Catholic Church, 1210 Governor Nicholls Street, Tremé, New
 * Orleans (1841-42; J. N. B. de Pouilly) — procedural, CC0-1.0, no textures.
 * bun generators/nola-st-augustine-church.ts
 *
 * Identity, in order: the white stuccoed Greek Revival front on Henriette
 * Delille Street, a pediment with an oculus over a great semicircular
 * lunette and the tall central door, between pilasters; the square bell
 * tower at the front's north-east corner, in stages, with arched louvred
 * openings and a bell-shaped copper cupola and cross; the long nave with a
 * clerestory of round windows over lower lean-to aisles whose walls carry
 * rows of grilled windows; the light roof; the dormered rectory behind.
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * area centroid of OSM way/345285965 (−90.0663200, 29.9653815). Placed at
 * bearing 307.4: model +y runs up the nave from the front (model −y, facing
 * compass 127.4°, Henriette Delille Street) to the rectory; model +x faces
 * Governor Nicholls Street's side of the block (compass 37.4°).
 *
 * The OSM way is one outline over the whole parish group: the church, its
 * sacristy wing (south-west), a low back building, a hip-roofed square block
 * behind the north-east aisle and the two-and-a-half-storey rectory with
 * dormers at the back. The model draws all of them (the rest as plain
 * massing), since replacing the way hides them all.
 *
 * Evidence
 * - OSM way/345285965 (building=church, height=18.7 from Microsoft
 *   footprints — that is not the tower: the lidar gives 23).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in the model frame (ground ≈ +0.35 over the reference
 *   used; all heights below are above ground). Nave x −10.2..0.2, eaves
 *   10.5, ridge 12.9 at x −5, front at y −38.4; the sanctuary bay behind
 *   (y −9..1) lower, ridge ~11.3; aisles x −14.8..−10.2 and 0.2..4.6, lean-to
 *   roofs (dark in the photos) 6.6 at the nave falling to ~5.8; sacristy wing x −19..−10,
 *   y −7..4.5, ~5.8; back building x −14.5..−3, y 7.5..16, ~6.5; square block
 *   x 0.5..15.5, y −9..12, eaves ~8, hipped to 11.4; rectory x −2.4..16.6,
 *   y 13..40.5, eaves ~9.4, ridge 14.4 along y at x ≈ 6.5; the tower x
 *   5..10.6, y −38.6..−33, top 22.3-23.5. Trees over the north-east yard
 *   (x 6..16, y −10..−34) are ignored.
 * - NAIP (USGS, public domain): the white membrane roofs of the church, the
 *   dark roof and dormers of the rectory, the grey hipped square block.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "St augustine church 23 march 2023.jpg", Ryan Nixon, CC BY-SA 4.0:
 *     front and north-east corner with the tower (stages, louvres, cupola)
 *     https://commons.wikimedia.org/wiki/File:St_augustine_church_23_march_2023.jpg
 *   - "AugustineTreme14Jan2008AboveFront.jpg", Infrogmation of New Orleans,
 *     CC BY-SA 3.0: the front and the south-west side from the vacant lot
 *     https://commons.wikimedia.org/wiki/File:AugustineTreme14Jan2008AboveFront.jpg
 *   - "AugustineTreme14Jan2008AboveA.jpg", Infrogmation of New Orleans,
 *     CC BY-SA 3.0: the south-west side, clerestory oculi, aisle, rectory
 *     https://commons.wikimedia.org/wiki/File:AugustineTreme14Jan2008AboveA.jpg
 *   - "St Augustine Church, Treme, New Orleans 21 Feb 2025.jpg", Infrogmation,
 *     CC BY-SA 4.0: the front face-on in perspective, the grilled windows
 *     https://commons.wikimedia.org/wiki/File:St_Augustine_Church,_Treme,_New_Orleans_21_Feb_2025.jpg
 *   - "St Augustine Church Cupola New Orleans.jpg", Howie Luvzus, CC BY 2.0:
 *     the cupola (copper, green patina over brown) and the tower top
 *     https://commons.wikimedia.org/wiki/File:St_Augustine_Church_Cupola_New_Orleans.jpg
 *   - "St Augustine Church New Orleans 3 Nov 2020 01/02.jpg", Infrogmation of
 *     New Orleans, CC BY-SA 4.0: the church from the rear across the lot
 *     https://commons.wikimedia.org/wiki/File:St_Augustine_Church_New_Orleans_3_Nov_2020_01.jpg
 * - Published: Wikipedia, "St. Augustine Church (New Orleans)": 1841-42,
 *   J. N. B. de Pouilly; the second-oldest African-American Catholic parish.
 *
 * Measured (lidar): every height and the plan above. Estimated from the
 * photos against the lidar: the tower's stages (10.5 / 15.0 / 18.6, cupola to
 * 22.4, cross to 23.6), its openings, the front's pilasters, door (1.9 × 4.2),
 * lunette (3.6 wide, top 8.6), oculus, the clerestory oculi (r 0.55, 3.6 m
 * apart) and the aisle windows. The aisle fronts rise to the nave's
 * entablature as one wall with the pediment over the middle (photos). The rectory, square block, sacristy and back
 * building are plain massing at their lidar heights (dormers from NAIP).
 *
 * Doubts: the north-east side is behind trees in every photo, so its windows
 * mirror the south-west side. Whether the tower's lowest stage is flush with
 * the front (drawn flush) is not clear from the photos. The brief described a
 * central tower; every photo and the lidar put it at the corner.
 *
 * Night: windows and the lunette glow (`window`); the front and tower are
 * lightly floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, circle, type XY } from './nyc-570-lexington'
import { block, box, hipRoof, band } from './nyc-city-hall'
import { quad, slabY, slabX, gableRoof, arch, rect, disc, rectRing, barCross, type Side } from './nola-st-patricks-church'

function build() {
  const stucco = new Part(), trim = new Part(), roof = new Part(), slate = new Part(), win = new Part(), copper = new Part()

  // ---- Plan (lidar) ----
  const NX0 = -10.2, NX1 = 0.2, FY = -38.4, NY1 = -9.0   // nave
  const EAVE = 10.5, RIDGE = 12.9
  const AX0 = -14.8, AX1 = 4.6, AEAVE = 5.8, AHIGH = 6.6  // aisles (lean-to)
  const TX0 = 5.0, TX1 = 10.6, TY0 = -38.6, TY1 = -33.0  // tower
  const cx = (NX0 + NX1) / 2

  // ---- Nave and its front gable ----
  prism({ wall: stucco, win: null, roof: null, ring: rectRing(NX0, FY, NX1, NY1), z0: 0, z1: EAVE, facade: null, bevel: 0.15 })
  gableRoof(roof, cx, (NX1 - NX0) / 2, FY + 0.3, NY1, EAVE, RIDGE, 0.35)
  // front pediment wall, raised a little over the roof, and its raking cornice
  slabY(stucco, [[NX0, EAVE - 0.1], [NX1, EAVE - 0.1], [cx, RIDGE + 0.5]], FY, FY + 0.5)
  slabY(trim, [[NX0 - 0.35, EAVE - 0.1], [NX1 + 0.35, EAVE - 0.1], [NX1 + 0.35, EAVE + 0.35], [cx, RIDGE + 0.85], [NX0 - 0.35, EAVE + 0.35]], FY - 0.35, FY + 0.1, [cx, EAVE + 0.6])
  block(trim, NX0 - 0.3, FY - 0.4, NX1 + 0.3, FY + 0.2, EAVE - 0.8, EAVE - 0.1)   // entablature
  // pilasters on the nave front
  for (const x of [NX0 + 0.35, cx - 3.0, cx + 3.0, NX1 - 0.35]) block(trim, x - 0.35, FY - 0.32, x + 0.35, FY, 0, EAVE - 0.8)
  block(trim, NX0 - 0.1, FY - 0.45, NX1 + 0.1, FY, 0, 0.7)   // plinth
  // door with its surround and entablature; the lunette; the oculus
  rect(trim, 'front', FY - 0.32, cx, 2.9, 0.7, 5.0, 0.06)
  rect(slate, 'front', FY - 0.32, cx, 1.9, 0.7, 4.6, 0.1)
  block(trim, cx - 1.75, FY - 0.6, cx + 1.75, FY - 0.32, 5.0, 5.4)
  arch(trim, 'front', FY - 0.32, cx, 4.2, 5.8, 8.95, 0.06)
  arch(win, 'front', FY - 0.32, cx, 3.6, 6.1, 8.6, 0.1)
  for (const dx of [-0.9, 0, 0.9]) rect(trim, 'front', FY - 0.32, cx + dx, 0.14, 6.1, dx === 0 ? 8.5 : 8.1, 0.13)
  disc(trim, 'front', FY, cx, 11.75, 0.85, 0.08, 14)
  disc(win, 'front', FY, cx, 11.75, 0.6, 0.12, 14)
  // tall round-headed niches either side of the door
  for (const s of [-1, 1]) arch(win, 'front', FY - 0.32, cx + s * 4.6, 1.1, 2.6, 7.6, 0.06)

  // ---- Aisles: lean-to roofs, fronts with parapets, grilled windows ----
  for (const [x0, x1] of [[AX0, NX0], [NX1, AX1]] as [number, number][]) {
    const outer = x0 < cx ? x0 : x1, inner = x0 < cx ? x1 : x0
    prism({ wall: stucco, win: null, roof: null, ring: rectRing(x0, FY, x1, NY1), z0: 0, z1: AEAVE, facade: null, bevel: 0.15 })
    // the lean-to roof, from the nave wall down to the outer wall
    quad(slate, [inner, FY + 0.6, AHIGH], [inner, NY1, AHIGH], [outer + (outer < inner ? -0.3 : 0.3), NY1, AEAVE - 0.1], [outer + (outer < inner ? -0.3 : 0.3), FY + 0.6, AEAVE - 0.1],
      [outer < inner ? -(AHIGH - AEAVE) / (inner - outer) : (AHIGH - AEAVE) / (outer - inner), 0, 1])
    slabY(stucco, [[x0, AEAVE - 0.1], [x1, AEAVE - 0.1], [inner, AHIGH]], NY1 - 0.3, NY1)
    // front: wall up to a flat parapet, a cornice, a tall window
    // the front runs up to the nave's entablature as one wall, a flat parapet over it
    block(stucco, x0, FY, x1, FY + 0.6, AEAVE - 0.2, EAVE - 0.1)
    block(trim, x0 - 0.2, FY - 0.4, x1 + 0.2, FY + 0.6, EAVE - 0.8, EAVE - 0.1)
    block(trim, x0 - 0.1, FY - 0.3, x0 + 0.6, FY, 0, EAVE - 0.8)
    block(trim, x1 - 0.6, FY - 0.3, x1 + 0.1, FY, 0, EAVE - 0.8)
    rect(win, 'front', FY, (x0 + x1) / 2, 1.3, 2.4, 6.4, 0.06)
    rect(win, 'front', FY, (x0 + x1) / 2, 1.3, 7.2, 8.6, 0.06)
    // side wall: a row of grilled windows high in the wall, a cornice at the eaves
    const side: Side = outer < inner ? 'west' : 'east'
    block(trim, outer < inner ? outer - 0.3 : outer - 0.1, FY, outer < inner ? outer + 0.1 : outer + 0.3, NY1, AEAVE - 0.55, AEAVE - 0.05)
    for (let y = FY + 3.4; y < NY1 - 1.5; y += 3.6) {
      rect(win, side, outer, y, 1.9, 3.3, 4.7, 0.06)   // the grilled windows high in the aisle wall
    }
  }
  // Clerestory: round windows along both nave walls over the aisle roofs.
  for (let y = FY + 3.4; y < NY1 - 1.0; y += 3.6) {
    disc(win, 'west', NX0, y, 8.5, 0.7, 0.06, 12)
    disc(win, 'east', NX1, y, 8.5, 0.7, 0.06, 12)
  }
  for (const s of [-1, 1]) block(trim, s < 0 ? NX0 - 0.3 : NX1 - 0.05, FY, s < 0 ? NX0 + 0.05 : NX1 + 0.3, NY1, EAVE - 0.45, EAVE)

  // ---- Sanctuary bay behind the nave (lower) ----
  prism({ wall: stucco, win: null, roof: null, ring: rectRing(AX0 + 0.6, NY1, AX1 - 3.9, 1.0), z0: 0, z1: 9.2, facade: null, bevel: 0.15 })
  gableRoof(roof, (AX0 + 0.6 + AX1 - 3.9) / 2, (AX1 - 3.9 - AX0 - 0.6) / 2, NY1 - 0.2, 1.3, 9.2, 11.3, 0.3)
  slabY(stucco, [[AX0 + 0.6, 9.1], [AX1 - 3.9, 9.1], [(AX0 + 0.6 + AX1 - 3.9) / 2, 11.2]], 0.7, 1.0)
  // sacristy wing (south-west), back building, square block, rectory
  box(stucco, null, -19.0, -7.0, AX0 + 0.6, 4.5, 0, 5.0, 0.2)
  hipRoof(roof, -19.3, -7.3, AX0 + 0.6, 4.8, 5.0, 1.0)
  box(stucco, null, -14.5, 1.0, -3.0, 16.0, 0, 5.4, 0.2)
  hipRoof(slate, -14.8, 0.7, -2.7, 16.3, 5.4, 1.4)
  box(stucco, null, 0.5, -9.0, 15.5, 12.5, 0, 8.0, 0.2)
  hipRoof(slate, 0.2, -9.3, 15.8, 12.8, 8.0, 3.4)
  for (const y of [-6.5, -2.5, 1.5, 5.5, 9.5]) for (const z of [1.2, 4.9]) rect(win, 'east', 15.5, y, 1.1, z, z + 2.0, 0.05)
  // rectory: two and a half storeys, ridge along y, dormers on both slopes
  {
    const x0 = -2.4, x1 = 16.6, y0 = 12.5, y1 = 40.5, e = 9.4, r = 14.4, mx = (x0 + x1) / 2
    box(stucco, null, x0, y0, x1, y1, 0, e, 0.2)
    gableRoof(slate, mx, (x1 - x0) / 2, y0 - 0.3, y1 + 0.3, e, r, 0.4)
    slabY(stucco, [[x0, e - 0.05], [x1, e - 0.05], [mx, r - 0.1]], y1 - 0.3, y1)
    slabY(stucco, [[x0, e - 0.05], [x1, e - 0.05], [mx, r - 0.1]], y0, y0 + 0.3)
    block(trim, x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15, 4.5, 4.75)   // gallery line
    const k = (r - e) / ((x1 - x0) / 2)
    for (const s of [-1, 1]) for (let y = y0 + 3.0; y < y1 - 2; y += 5.0) {
      const xs = s < 0 ? x0 + 2.2 : x1 - 2.2, zb = e + 2.2 * k
      // dormer: a small gabled box standing on the slope, facing out
      const xo = s < 0 ? x0 + 1.1 : x1 - 1.1
      block(stucco, Math.min(xo, xs), y - 0.8, Math.max(xo, xs), y + 0.8, e + 0.6, zb + 1.3)
      slabX(slate, [[y - 1.0, zb + 1.2], [y + 1.0, zb + 1.2], [y, zb + 2.0]], Math.min(xo - s * 0.1, xs), Math.max(xo - s * 0.1, xs))
      rect(win, s < 0 ? 'west' : 'east', xo, y, 0.8, e + 0.9, zb + 0.9, 0.05)
    }
    for (const y of [16, 20.5, 25, 29.5, 34, 38]) for (const z of [1.3, 5.6]) {
      rect(win, 'west', x0, y, 1.2, z, z + 2.3, 0.05)
      rect(win, 'east', x1, y, 1.2, z, z + 2.3, 0.05)
    }
    for (const x of [1.5, 5.0, 8.5, 12.0]) for (const z of [1.3, 5.6]) rect(win, 'rear', y1, x, 1.2, z, z + 2.3, 0.05)
  }

  // ---- The tower ----
  {
    const tcx = (TX0 + TX1) / 2, tcy = (TY0 + TY1) / 2, H = (TX1 - TX0) / 2
    const S1 = EAVE, S2 = 15.0, S3 = 18.6
    prism({ wall: stucco, win: null, roof: null, ring: rectRing(TX0, TY0, TX1, TY1), z0: 0, z1: S2, facade: null, bevel: 0.12 })
    const h2 = H - 0.35
    prism({ wall: stucco, win: null, roof: stucco, ring: rectRing(tcx - h2, tcy - h2, tcx + h2, tcy + h2), z0: S2, z1: S3, facade: null, bevel: 0.1 })
    band(trim, rectRing(TX0, TY0, TX1, TY1), S1 - 0.4, S1, 0.25)
    band(trim, rectRing(TX0, TY0, TX1, TY1), S2 - 0.5, S2, 0.3)
    band(trim, rectRing(tcx - h2, tcy - h2, tcx + h2, tcy + h2), S3 - 0.5, S3, 0.3)
    // corner pilasters on stages 1-2 and 3
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const px = tcx + sx * (H - 0.3), py = tcy + sy * (H - 0.3)
      block(trim, px - 0.42, py - 0.42, px + 0.42, py + 0.42, 0, S2 - 0.5)
      const qx = tcx + sx * (h2 - 0.25), qy = tcy + sy * (h2 - 0.25)
      block(trim, qx - 0.35, qy - 0.35, qx + 0.35, qy + 0.35, S2, S3 - 0.5)
    }
    // openings on the three free faces (front, east, rear above the roofs) and the west above the nave
    const faces: [Side, number][] = [['front', TY0], ['east', TX1], ['rear', TY1], ['west', TX0]]
    for (const [side, c] of faces) {
      const t = side === 'front' || side === 'rear' ? tcx : tcy
      const c2 = side === 'front' ? tcy - h2 : side === 'rear' ? tcy + h2 : side === 'east' ? tcx + h2 : tcx - h2
      arch(trim, side, c, t, 1.7, S1 + 0.5, S2 - 1.2, 0.05)
      arch(slate, side, c, t, 1.25, S1 + 0.7, S2 - 1.45, 0.09)
      arch(trim, side, c2, t, 1.55, S2 + 0.4, S3 - 0.85, 0.05)
      arch(slate, side, c2, t, 1.15, S2 + 0.55, S3 - 1.05, 0.09)
      if (side === 'front' || side === 'east') {
        arch(win, side, c, t, 1.3, 3.0, 8.4, 0.06)   // the tall window of the lowest stage
      }
    }
    // cupola: a bell-shaped (ogee) copper dome on a low drum, a lantern finial and the cross
    const prof: [number, number][] = [[1.95, S3], [1.95, S3 + 0.4], [1.85, S3 + 1.2], [1.55, S3 + 2.0], [1.05, S3 + 2.8], [0.55, S3 + 3.4], [0.22, S3 + 3.8], [0.2, S3 + 4.0]]
    const N = 12
    const rings = prof.map(([r, z]) => circle(tcx, tcy, r, N, Math.PI / N).map(([x, y]) => [x, y, z] as V3))
    for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < N; i++) {
      const j = (i + 1) % N, a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
      const nm = (p: V3, kk: number): V3 => { const dr = prof[Math.max(0, kk - 1)][0] - prof[Math.min(prof.length - 1, kk + 1)][0], dz = prof[Math.min(prof.length - 1, kk + 1)][1] - prof[Math.max(0, kk - 1)][1]; const l = Math.hypot(dz, dr); const ux = (p[0] - tcx), uy = (p[1] - tcy), lu = Math.hypot(ux, uy) || 1; return [ux / lu * dz / l, uy / lu * dz / l, dr / l] }
      copper.tri(a, b, c, undefined, undefined, undefined, [nm(a, k), nm(b, k), nm(c, k + 1)])
      copper.tri(a, c, d, undefined, undefined, undefined, [nm(a, k), nm(c, k + 1), nm(d, k + 1)])
    }
    copper.cap(rings[rings.length - 1], true)
    block(slate, tcx - 0.07, tcy - 0.07, tcx + 0.07, tcy + 0.07, S3 + 4.0, 23.6)
    block(slate, tcx - 0.45, tcy - 0.07, tcx + 0.45, tcy + 0.07, 22.75, 22.9)
    void barCross
  }

  // ---- Finish ----
  const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.2 : p[1] < -36 || (p[0] > 4.8 && p[1] < -32) ? 0.9 : 0.15)
  finishModel('St. Augustine Church', 'nola-st-augustine-church', [
    { part: stucco, material: { ...finish('stucco', 0xeeebe4), floodlight: lit } },
    { part: trim, material: { ...finish('stucco-trim', 0xfaf8f3), floodlight: lit } },
    { part: roof, material: finish('membrane-roof', 0xc9ccca) },
    { part: slate, material: finish('slate', 0x5f646a) },
    { part: win, material: PALETTE.window },
    { part: copper, material: finish('cupola-copper', 0x94725c) },
  ], { bearing: 307.4, osm: 'way/345285965', height: 23.6 }, 5000)
}

if (import.meta.main) build()
