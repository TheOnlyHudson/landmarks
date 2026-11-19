/**
 * Gibson Hall, Tulane University, 6823 St. Charles Avenue, New Orleans
 * (1894, Harrod & Andry; Richardsonian Romanesque) — procedural, CC0-1.0,
 * no textures. bun generators/nola-gibson-hall.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 28.6: the front faces model −y
 * (compass 208.6°) across the oak lawn to St. Charles Avenue; the long bar
 * runs along x. Anchor: the area centroid of OSM way/327443127.
 *
 * Identity, in order: the long, low mass of rough-faced grey-beige stone
 * under a steep dark slate roof with red ridge tiles; the broad central
 * cross gable and the two steep-gabled end pavilions; the ground floor of
 * big round arches (windows and entrances, each entrance with its stair);
 * paired round-arched windows above; the gabled dormers with round-headed
 * windows between little turret pinnacles.
 *
 * Evidence
 * - OSM way/327443127 (building=yes, height=23, levels 4, roof hipped,
 *   name Gibson Hall). Main bar x ±26.6, y −10.0..10.0 in this frame; end
 *   pavilions x ±(26.6..39.3), y −11.1..10.9.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in this frame; ground 0.9 over the grid minimum = z 0.
 *   Main ridge 22.0 along y = 0; eaves ~12.3; central cross gable x ±9.8,
 *   apex 22.4; pavilion ridges 22.0 along y with an outer side gable;
 *   dormers at x ±18.5 to ~17.2. OSM's 23 m agrees.
 * - NAIP (USGS, public domain): the dark slate roofs, the cross ridges.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Tulane University - Gibson Hall from St. Charles Avenue, February
 *     2026.jpg", ajay_suresh, CC BY 4.0: the whole front face-on
 *     https://commons.wikimedia.org/wiki/File:Tulane_University_-_Gibson_Hall_from_St._Charles_Avenue,_February_2026.jpg
 *   - "Gibson Hall (3314289344).jpg", Tulane Public Relations, CC BY 2.0:
 *     the central gable and the wings face-on
 *     https://commons.wikimedia.org/wiki/File:Gibson_Hall_(3314289344).jpg
 *   - "Gibson Hall angle.jpg", Gonk, public domain: the front from the
 *     east (central gable, dormers, pinnacles, the slate roof)
 *     https://commons.wikimedia.org/wiki/File:Gibson_Hall_angle.jpg
 *   - "Gibson Hall, 2019.jpg", EEJCC, CC BY-SA 4.0: the front from the
 *     west, the stairs and the west pavilion
 *     https://commons.wikimedia.org/wiki/File:Gibson_Hall,_2019.jpg
 *   - "Tulane U Mch2013 Gibson Dinwiddie.JPG", Infrogmation of New
 *     Orleans, CC BY-SA 3.0: the east pavilion's side
 *     https://commons.wikimedia.org/wiki/File:Tulane_U_Mch2013_Gibson_Dinwiddie.JPG
 *   - "Gibson at night (5042969964).jpg", Tulane Public Relations, CC BY 2.0
 *     (night: floodlit front, lit windows)
 *     https://commons.wikimedia.org/wiki/File:Gibson_at_night_(5042969964).jpg
 * - Published: Wikipedia, "Gibson Hall (Tulane University)": 1894,
 *   Richardsonian Romanesque, Harrod & Andry.
 *
 * Measured (lidar): every height and the roof plan. Estimated from the
 * face-on photos against the lidar eaves: the storey lines (arches
 * 2.0-5.6 under voussoirs to 6.4, paired windows 7.6-10.4, cornice 12.3),
 * the bay order and spacing, the dormers, the attic windows in the gables.
 * The rear and the ends get the same rhythm, plainer (only partly seen).
 * Left out: the rock-faced texture, carved capitals, the iron railings.
 *
 * Doubts: the rear elevation is not photographed; its windows are invented
 * from the front's rhythm.
 *
 * Night: the front is floodlit (`floodlight`), windows and doors glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { block, archPanel } from './nyc-city-hall'
import { quad, slabY, slabX, wall, rect, rectRing, gableRoof, pinnacle, type Side } from './nola-st-patricks-church'
import { gableRoofX } from './nola-holy-name-of-jesus'

const arch = (p: Part, side: Side, c: number, t: number, w: number, z0: number, zTop: number, d = 0.05, segs = 8) => {
  const [a, b, s] = wall(side, c); archPanel(p, a, b, s(t), w, z0, zTop, d, segs)
}

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), red = new Part(), door = new Part()

  const MX = 26.6, PX = 39.3, FY = -10.0, RY = 10.0, PFY = -11.1, PRY = 10.9
  const EAVE = 12.3, RIDGE = 22.0, CG = 9.8, CAPEX = 22.4
  const PC = (MX + PX) / 2, PH = (PX - MX) / 2

  // ---------------- Masses and roofs ----------------
  prism({ wall: stone, win: null, roof: null, ring: rectRing(-MX, FY, MX, RY), z0: 0, z1: EAVE, facade: null, bevel: 0.15 })
  for (const s of [-1, 1]) prism({ wall: stone, win: null, roof: null, ring: rectRing(s < 0 ? -PX : MX, PFY, s < 0 ? -MX : PX, PRY), z0: 0, z1: EAVE, facade: null, bevel: 0.15 })
  // central cross gable: its front projects a little
  prism({ wall: stone, win: null, roof: null, ring: rectRing(-CG, FY - 0.5, CG, RY + 0.5), z0: 0, z1: EAVE, facade: null, bevel: 0.12 })
  // main roof along x, across the whole length, gabled at the pavilions' outer walls
  gableRoofX(slate, 0, RY, -PX + 0.2, PX - 0.2, EAVE, RIDGE, 0.45)
  for (const s of [-1, 1]) slabX(stone, [[FY + 0.2, EAVE - 0.05], [RY - 0.2, EAVE - 0.05], [0, RIDGE - 0.15]], s < 0 ? -PX : PX - 0.3, s < 0 ? -PX + 0.3 : PX)
  // pavilions: steep front and back gables, ridge along y
  for (const s of [-1, 1]) {
    gableRoof(slate, s * PC, PH, PFY - 0.3, PRY + 0.3, EAVE, RIDGE, 0.4)
    for (const [y0, y1] of [[PFY, PFY + 0.3], [PRY - 0.3, PRY]]) slabY(stone, [[s * PC - PH, EAVE - 0.05], [s * PC + PH, EAVE - 0.05], [s * PC, RIDGE - 0.1]], y0, y1)
    block(red, s * PC - 0.12, PFY - 0.3, s * PC + 0.12, PRY + 0.3, RIDGE - 0.1, RIDGE + 0.3)
  }
  gableRoof(slate, 0, CG, FY - 0.9, RY + 0.9, EAVE, CAPEX, 0.4)
  for (const [y0, y1] of [[FY - 0.5, FY - 0.2], [RY + 0.2, RY + 0.5]]) slabY(stone, [[-CG, EAVE - 0.05], [CG, EAVE - 0.05], [0, CAPEX - 0.1]], y0, y1)
  block(red, -0.12, FY - 0.9, 0.12, RY + 0.9, CAPEX - 0.1, CAPEX + 0.3)
  block(red, -PX + 0.3, -0.12, PX - 0.3, 0.12, RIDGE - 0.1, RIDGE + 0.3)
  // gable copings (pale) on the three front gables
  const coping = (cx: number, hw: number, y: number, apex: number) => {
    for (const s of [-1, 1]) slabY(trim, [[cx + s * (hw + 0.3), EAVE - 0.3], [cx + s * (hw + 0.3), EAVE + 0.25], [cx, apex + 0.45], [cx, apex - 0.1]], y - 0.25, y + 0.15, [cx + s * hw / 2, (EAVE + apex) / 2])
    pinnacle(trim, cx - 0.3, y - 0.25, cx + 0.3, y + 0.35, apex + 0.2, apex + 0.6, apex + 1.4, 0.06)
  }
  coping(0, CG, FY - 0.5, CAPEX)
  for (const s of [-1, 1]) coping(s * PC, PH, PFY, RIDGE)

  // cornice and string courses all round (pale, a little proud)
  const ring: XY[] = [[-PX, PFY], [-MX, PFY], [-MX, FY], [-CG, FY], [-CG, FY - 0.5], [CG, FY - 0.5], [CG, FY], [MX, FY], [MX, PFY], [PX, PFY], [PX, PRY], [MX, PRY], [MX, RY], [CG, RY], [CG, RY + 0.5], [-CG, RY + 0.5], [-CG, RY], [-MX, RY], [-MX, PRY], [-PX, PRY]]
  const band = (z0: number, z1: number, d: number) => {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
      // outward normal for a counter-clockwise ring
      const A: XY = [a[0] + n[0] * d, a[1] + n[1] * d], B: XY = [b[0] + n[0] * d, b[1] + n[1] * d]
      quad(trim, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], [n[0], n[1], 0])
      quad(trim, [A[0], A[1], z1], [B[0], B[1], z1], [b[0], b[1], z1], [a[0], a[1], z1], [0, 0, 1])
    }
  }
  band(EAVE - 0.55, EAVE - 0.05, 0.3)
  band(6.7, 7.0, 0.15)
  band(1.6, 1.9, 0.15)

  // ---------------- Openings ----------------
  // ground floor: a big round arch (window or entrance) per bay; first floor: a pair of arched lights
  type Bay = { x: number; y: number; side: Side; entrance?: boolean }
  const bays: Bay[] = []
  for (const s of [-1, 1]) {
    bays.push({ x: s * 6.3, y: FY - 0.5, side: 'front' }, { x: s * 14.0, y: FY, side: 'front' }, { x: s * 21.5, y: FY, side: 'front', entrance: true })
    bays.push({ x: s * (PC - 3.1), y: PFY, side: 'front' }, { x: s * (PC + 3.1), y: PFY, side: 'front' })
    // the rear, plainer
    for (const x of [6.3, 14.0, 21.5]) bays.push({ x: s * x, y: RY, side: 'rear' })
    bays.push({ x: s * (PC - 3.1), y: PRY, side: 'rear' }, { x: s * (PC + 3.1), y: PRY, side: 'rear' })
  }
  bays.push({ x: 0, y: FY - 0.5, side: 'front', entrance: true }, { x: 0, y: RY + 0.5, side: 'rear' })
  for (const b of bays) {
    const c = b.y, t = b.x, front = b.side === 'front'
    arch(trim, b.side, c, t, 4.5, 1.9, 6.6, 0.04)
    if (b.entrance) {
      arch(door, b.side, c, t, 3.2, 1.9, 5.5, 0.08)
      block(trim, t - 2.4, c - 3.2, t + 2.4, c, 0, 1.0)
      block(trim, t - 2.4, c - 2.0, t + 2.4, c, 1.0, 1.9)
    } else arch(win, b.side, c, t, 3.6, 2.2, 5.6, 0.08)
    for (const d of [-0.75, 0.75]) arch(win, b.side, c, t + (front ? d : -d), 1.05, 7.6, 10.4, 0.06, 6)
    if (!b.entrance) rect(win, b.side, c, t, 1.4, 0.4, 1.3, 0.05)
  }
  // the ends: two bays on each pavilion's outer wall
  for (const s of [-1, 1]) {
    const side: Side = s < 0 ? 'west' : 'east'
    for (const y of [-5.2, 5.2]) {
      arch(trim, side, s * PX, y, 4.1, 1.9, 6.4, 0.04)
      arch(win, side, s * PX, y, 3.2, 2.2, 5.6, 0.08)
      for (const d of [-0.75, 0.75]) arch(win, side, s * PX, y + d, 1.05, 7.6, 10.4, 0.06, 6)
    }
    arch(win, side, s * PX, 0, 1.2, 14.0, 16.4, 0.06, 6)
  }
  // attic windows in the gables
  for (const k of [-1.5, -0.5, 0.5, 1.5]) arch(win, 'front', FY - 0.5, k * 1.6, 1.0, 13.4, 15.6, 0.06, 6)
  for (const k of [-1, 0, 1]) arch(win, 'front', FY - 0.5, k * 1.2, 0.8, 16.8, 18.6, 0.06, 6)
  for (const s of [-1, 1]) {
    for (const k of [-1.5, -0.5, 0.5, 1.5]) arch(win, 'front', PFY, s * PC + k * 1.5, 0.95, 13.4, 15.6, 0.06, 6)
    for (const k of [-0.5, 0.5]) arch(win, 'front', PFY, s * PC + k * 1.2, 0.8, 16.8, 18.4, 0.06, 6)
  }

  // ---------------- Dormers (front) ----------------
  for (const s of [-1, 1]) {
    const x = s * 18.5, hw = 1.9, y0 = FY + 0.05, y1 = FY + 3.0, top = 15.4, apex = 17.3
    // walls and a small gable roof, ridge along y
    prism({ wall: stone, win: null, roof: null, ring: rectRing(x - hw, y0, x + hw, y1), z0: EAVE - 0.6, z1: top, facade: null, bevel: 0.05 })
    slabY(stone, [[x - hw, top - 0.05], [x + hw, top - 0.05], [x, apex]], y0, y0 + 0.3)
    gableRoof(slate, x, hw, y0 - 0.2, y1, top, apex, 0.2)
    arch(trim, 'front', y0, x, 2.3, EAVE + 0.2, 16.0, 0.04)
    arch(win, 'front', y0, x, 1.8, EAVE + 0.4, 15.7, 0.08)
    for (const d of [-1, 1]) pinnacle(trim, x + d * (hw + 0.1) - 0.3, y0 - 0.3, x + d * (hw + 0.1) + 0.3, y0 + 0.3, EAVE - 0.4, top + 0.4, apex + 0.3, 0.05)
  }

  // ---------------- Finish ----------------
  const lit = (p: V3, n: V3): number => (n[1] < -0.5 && p[1] < FY + 0.5 ? (p[2] > EAVE ? 0.6 : 0.9) : 0)
  finishModel('Gibson Hall', 'nola-gibson-hall', [
    { part: stone, material: { ...finish('gibson-stone', 0xd8cfc0), floodlight: lit } },
    { part: trim, material: { ...finish('gibson-trim', 0xe8e1d4), floodlight: lit } },
    { part: slate, material: finish('gibson-slate', 0x777d85) },
    { part: win, material: PALETTE.window },
    { part: red, material: PALETTE.terracotta },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 28.6, osm: 'way/327443127', height: CAPEX + 1.4 }, 6500)
}

if (import.meta.main) build()
