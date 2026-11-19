/**
 * Book Tower (1265 Washington Boulevard, Detroit, 1926, Louis Kamper) —
 * original procedural geometry, CC0-1.0.
 * bun generators/det-book-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/107366469 ("Book Tower"),
 * 42.3334992,-83.0515469. Its walls run due north-south and east-west, so
 * the bearing is 0. The outline is 34.6 m east-west by 21.0 m north-south;
 * the 1917 Book Building (way/107366470, 13 storeys) adjoins it on the
 * south along the whole face and is a separate building the map keeps
 * drawing, so `replaces` lists only way/107366469.
 *
 * Identity, in order: the steep green copper hip roof with its ridge running
 * east-west; the tall Italian Renaissance crown — a heavy cornice at the top
 * of the ornate section, then a colonnade of free-standing columns in front
 * of tall round-headed windows, then a balustraded cornice; the plain buff
 * shaft below with paired windows; the caryatid band at the Book Building's
 * cornice line.
 *
 * Evidence:
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid read
 *    in this frame. Ground flat (±0.5 m). The outline's edge ring to
 *    115.7 m (the main cornice); the wall behind it inset ~1.5-2 m, to
 *    130-131 m (the colonnade stage and its balustrade); the hip roof from
 *    about x ±13, y ±7.5 at 131 m to a ridge at 141 m along y = 0,
 *    x -8..10; one spike to 147 m (an antenna, left out). The Book Building
 *    to the south at 55.6 m. Published height 144.78 m (OSM), 38 storeys.
 *  - photos: the ornate section starts ~0.69 of the cornice height
 *    (~91 m, scaled in Albert duce's photo), with a second band ~97 m;
 *    window pairs and bay counts; the caryatid band at ~50-56 m; the
 *    colonnade's arched windows (6 bays on the long faces, 4 on the short).
 *  - floor plan (Kamper, public domain): the tower block at the north end
 *    of the Book Building, ~105 ft deep east-west, matching OSM.
 *  - colour: buff limestone, pulled to the palette (`book-limestone`); the
 *    roof's copper from the photos and OSM roof:colour #7e9a9e, as
 *    `book-copper`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Book_Tower.jpg, Gregory C. Bachleda, CC BY-SA 4.0 (crown and copper
 *    roof, during the restoration)
 *  - Book_Tower_2010.jpg, Albert duce, CC BY 3.0 (whole west face with the
 *    Book Building)
 *  - Booktower.JPG, Dav (no machine-readable author), CC BY-SA 2.5 (crown
 *    and hip roof from afar)
 *  - Booktower_from_Washington_Boulevard,_detroit.jpg, Mikerussell,
 *    CC BY-SA 3.0 (shaft, caryatid band, crown)
 *  - BookTower_Detroit.jpg, Mikerussell, CC BY 2.5 (crown in the skyline)
 *  - Book_Bldg_and_Tower_typical_office_floor_plan.png, Louis Kamper,
 *    public domain
 * No look-only sources. No commercial imagery.
 *
 * Doubts: every open photo found predates the 2022 restoration, when the
 * soot-darkened ornate crown was cleaned; the crown is drawn in the same
 * cleaned buff stone as the shaft, with lighter trim, which is how the
 * restored tower is described. The south face below the Book Building's
 * roof (55.6 m) is a party wall and has no windows. The colonnade is drawn
 * as round columns on the cornice ledge; the corner aediculae and dormers
 * are simplified to raised blocks.
 *
 * Left out: carved ornament, the caryatids themselves (two trim bands at
 * 47-56 m stand for them), mullions, antennas.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, lathe, panel, rect, save, walls, type XY } from './chi-aon-center'

const HX = 17.3, HY = 10.5
const SHAFT = 91, BAND2 = 97, CORNICE = 115.7, COLTOP = 131, RIDGE = 141.5

/** Window panels on one wall a→b: `n` bays of width w, centred, over the given storey groups. */
export function wallBays(p: Part, a: XY, b: XY, n: number, w: number, groups: [number, number][], out = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), pitch = (L - 2.4) / n
  for (let k = 0; k < n; k++) {
    const c = 1.2 + pitch * (k + 0.5)
    for (const [z0, z1] of groups) panel(p, a, b, c - w / 2, c + w / 2, z0, z1, out)
  }
}

/** A round-headed panel on wall a→b, jambs s0..s1 from z0 to spring line zs. */
export function archPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 8) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  p.quad(P(s0, z0), P(s1, z0), P(s1, zs), P(s0, zs))
  const c = (s0 + s1) / 2, r = (s1 - s0) / 2
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    p.tri(P(c, zs), P(c + r * Math.cos(t0), zs + r * Math.sin(t0)), P(c + r * Math.cos(t1), zs + r * Math.sin(t1)))
  }
}

/** A pier standing `d` proud of wall a→b, s0..s1 along it, z0..z1 up it: front and two sides. */
export function pier(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, o: number, z: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
  p.quad(P(s0, d, z0), P(s1, d, z0), P(s1, d, z1), P(s0, d, z1))
  p.quad(P(s0, 0, z0), P(s0, d, z0), P(s0, d, z1), P(s0, 0, z1))
  p.quad(P(s1, d, z0), P(s1, 0, z0), P(s1, 0, z1), P(s1, d, z1))
}

/** A projecting cornice band: a bevelled ring `d` proud of ring r, from z0 to z1. */
export function band(p: Part, top: Part, r: XY[], z0: number, z1: number, d: number) {
  const o = inset(r, -d)
  cap(p, o, z0, false) // soffit
  walls(p, o, z0, z1 - 0.3)
  walls(p, o, z1 - 0.3, z1, inset(o, 0.3))
  cap(top, inset(o, 0.3), z1)
}

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part(), copper = new Part(), door = new Part()
  const outline = rect(-HX, -HY, HX, HY)
  const faces: { a: XY; b: XY; long: boolean; south: boolean }[] = outline.map((a, i) => {
    const b = outline[(i + 1) % 4]
    return { a, b, long: Math.abs(b[0] - a[0]) > 20, south: a[1] < 0 && b[1] < 0 }
  })

  // ---- shaft to the main cornice
  walls(stone, outline, 0, CORNICE - 1.6)
  // the main cornice, 0.9 m proud
  band(trim, roof, outline, CORNICE - 1.6, CORNICE, 0.9)
  // string courses at the start of the ornate section and the caryatid line
  band(trim, roof, outline, SHAFT - 1.0, SHAFT, 0.45)
  band(trim, roof, outline, BAND2 - 0.8, BAND2, 0.35)
  band(trim, roof, outline, 55.0, 56.0, 0.4)
  band(trim, roof, outline, 47.0, 47.8, 0.3)
  // projecting corner piers of the ornate section
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x0 = sx < 0 ? -HX - 0.4 : HX - 2.0, y0 = sy < 0 ? -HY - 0.4 : HY - 2.0
    walls(stone, rect(x0, y0, x0 + 2.4, y0 + 2.4), SHAFT, CORNICE - 1.6)
  }
  band(trim, roof, outline, 6.0, 6.8, 0.3)

  // ---- colonnade stage, inset 1.6 m, and its balustraded top
  const col = inset(outline, 1.6)
  walls(stone, col, CORNICE, COLTOP - 1.2)
  band(trim, roof, col, COLTOP - 1.2, COLTOP, 1.0)
  // corner aediculae: raised blocks at the four corners of the balustrade
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = sx * (HX - 1.6 - 1.4), cy = sy * (HY - 1.6 - 1.4)
    block(trim, roof, rect(cx - 1.7, cy - 1.7, cx + 1.7, cy + 1.7), COLTOP, COLTOP + 3.2, 0.4)
  }
  // columns standing on the cornice ledge, in front of the inset wall
  const colR = 0.55
  const prof: XY[] = [[colR, CORNICE], [colR * 0.85, COLTOP - 1.2]]
  for (const f of faces) {
    const n = f.long ? 6 : 4
    const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
    const u: XY = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L], nn: XY = [u[1], -u[0]]
    const pitch = (L - 3.2 * 2) / n
    for (let k = 0; k <= n; k++) {
      const s = 3.2 + k * pitch
      const cx = f.a[0] + u[0] * s - nn[0] * 0.85, cy = f.a[1] + u[1] * s - nn[1] * 0.85
      lathe(trim, cx, cy, prof, 8)
    }
    // arched windows between the columns, on the inset wall
    const a2: XY = [f.a[0] - nn[0] * 1.6 + u[0] * 1.6, f.a[1] - nn[1] * 1.6 + u[1] * 1.6]
    const b2: XY = [f.b[0] - nn[0] * 1.6 - u[0] * 1.6, f.b[1] - nn[1] * 1.6 - u[1] * 1.6]
    for (let k = 0; k < n; k++) {
      const s = 3.2 - 1.6 + (k + 0.5) * pitch
      const w = Math.min(pitch - 1.5, 3.2)
      archPanel(win, a2, b2, s - w / 2, s + w / 2, CORNICE + 1.0, COLTOP - 2.6 - w / 2, 0.05, 8)
    }
  }

  // ---- the copper hip roof
  const RX = HX - 1.6 - 1.2, RY = HY - 1.6 - 1.2 // 14.5 × 7.7 half
  const eave = COLTOP - 0.6
  const r0: V3[] = [[-RX, -RY, eave], [RX, -RY, eave], [RX, RY, eave], [-RX, RY, eave]]
  const rg = RX - RY
  const A: V3 = [-rg, 0, RIDGE], B: V3 = [rg, 0, RIDGE]
  copper.quad(r0[0], r0[1], B, A)
  copper.quad(r0[2], r0[3], A, B)
  copper.tri(r0[1], r0[2], B)
  copper.tri(r0[3], r0[0], A)
  // dormers on the long slopes: small gabled stone boxes
  for (const sy of [-1, 1]) for (const dx of [-5, 0, 5]) {
    const y0 = sy * (RY - 0.6), y1 = sy * (RY - 3.4), z0 = eave, z1 = eave + 3.0
    const ya = Math.min(y0, y1), yb = Math.max(y0, y1)
    walls(trim, rect(dx - 0.9, ya, dx + 0.9, yb), z0, z1)
    const top: XY[] = rect(dx - 1.1, ya - 0.2, dx + 1.1, yb + 0.2)
    for (let i = 0; i < 4; i++) copper.tri([top[i][0], top[i][1], z1], [top[(i + 1) % 4][0], top[(i + 1) % 4][1], z1], [dx, (ya + yb) / 2, z1 + 1.1])
    const fa: XY = sy > 0 ? [dx - 0.9, y0] : [dx + 0.9, y0], fb: XY = sy > 0 ? [dx + 0.9, y0] : [dx - 0.9, y0]
    panel(win, fb, fa, 0.45, 1.35, z0 + 0.5, z1 - 0.4, 0.05)
  }

  // ---- windows
  // shaft: paired windows grouped three storeys (~3.6 m a floor) to a panel
  const shaftGroups: [number, number][] = []
  for (let z = 8.0; z + 9.6 < 47; z += 12.0) shaftGroups.push([z, z + 9.6])
  shaftGroups.push([48.6, 54.3])
  const upperGroups: [number, number][] = []
  for (let z = 57.4; z + 9.5 < SHAFT - 1.4; z += 11.0) upperGroups.push([z, z + 9.4])
  const ornate: [number, number][] = [[SHAFT + 0.8, BAND2 - 1.4], [BAND2 + 0.9, BAND2 + 7.6], [BAND2 + 8.6, CORNICE - 2.4]]
  for (const f of faces) {
    const n = f.long ? 9 : 5, w = f.long ? 1.5 : 1.7
    // west face only: the main entrance on Washington Boulevard
    if (!f.south) wallBays(win, f.a, f.b, n, w, shaftGroups)
    wallBays(win, f.a, f.b, n, w, upperGroups)
    wallBays(win, f.a, f.b, n, w * 1.55, ornate)
    // pilasters of the ornate section, in trim, between the bays
    const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]), pitch = (L - 2.4) / n
    for (let k = 0; k <= n; k++) {
      const s = 1.2 + pitch * k
      pier(trim, f.a, f.b, s - 0.4, s + 0.4, SHAFT, CORNICE - 1.6, 0.3)
    }
    // the caryatid band: a pale panel group under the 56 m course
    // ground-floor storefronts
    if (!f.south) wallBays(win, f.a, f.b, f.long ? 6 : 4, f.long ? 3.8 : 3.4, [[1.2, 5.4]], 0.05)
  }
  // main entrance, west face (a→b runs south along x = -HX)
  panel(door, [-HX, HY], [-HX, -HY], 8.5, 12.5, 0, 4.2, 0.08)
  panel(trim, [-HX, HY], [-HX, -HY], 8.0, 13.0, 4.2, 5.4, 0.1)

  // Night: the restored crown is floodlit from the cornice up.
  const flood = (p: V3, n: V3) => (p[2] < SHAFT ? 0 : n[2] > 0.7 ? 0.2 : 0.5 + 0.5 * Math.min(1, (p[2] - SHAFT) / 40))
  return [
    { part: stone, material: { ...finish('book-limestone', 0xe5d8c0), floodlight: flood } },
    { part: trim, material: { ...PALETTE.trim, floodlight: flood } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: { ...finish('book-copper', 0x7fa898), floodlight: (p: V3) => (p[2] > COLTOP ? 0.35 : 0) } },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('det-book-tower', 'Book Tower', [42.3334992, -83.0515469], 0, build(), 5000)
