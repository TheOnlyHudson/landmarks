/**
 * Basilica of the Immaculate Conception, 121 East Duval Street,
 * Jacksonville, FL (1907–1910, M. H. Hubbard, Late Gothic Revival, pale
 * grey rock-faced stone, red-tiled spires): procedural, CC0-1.0.
 * bun generators/jax-basilica-immaculate-conception.ts [out.glb]
 *
 * Identity: OSM way/497147278 (building=church, "Immaculate Conception
 * Catholic Church", wikidata Q6004337, basilica=minor).
 *
 * Map frame: x toward 105°, y toward 15° (bearing 15, the outline's edges
 * run 15° / 105°), z up, metres. Origin: the outline's area centroid
 * (-81.655535, 30.329207). The west front on Duval Street faces -y.
 *
 * Plan (OSM, in this frame): front gable y -17.5 between the west tower
 * x -12.8…-6.0, y -19.0…-11.8 and the round east turret (centre 8.7,
 * -16.4, r 2.6); nave and aisles x -9.2…10.1 to y 2.5; transepts
 * x -13.2…13.6, y 2.5…14.1; a half-polygon apse r 5.8 about (0.2, 14.1).
 *
 * Heights: USGS 3DEP lidar FL_Peninsular_FDEM_Duval_2018 (2018 flight),
 * 0.5 m grid, read in this frame, street in front 1.5 m above the crop
 * minimum (measured): nave and transept ridges 22.0, nave eaves ~12.3
 * at x ±6.4, aisle roofs ~10–11, apse roof falling to ~14, turret cone
 * tip ~28, the tower's belfry gables ~33, spire tip 52.0 (highest
 * return). Published: the steeple is 178.5 ft (54.4 m) to the top of its
 * cross (Wikipedia, "Basilica of the Immaculate Conception
 * (Jacksonville, Florida)"). Estimated from photos p1 and p3 against
 * those: tower cornice 19.5, blind-arcade band to 22.5, belfry with its
 * louvred lancet 22.5–28.5, gables to 33, corner pinnacles to 33.5;
 * turret shaft to 15.5, lantern 17–22; front window sill 7.0, apex 16.2;
 * doors 0.6–3.9 with gabled hoods to ~8.
 *
 * Photos (evidence, Wikimedia Commons, all Ebyabe, CC BY-SA 3.0; local
 * copies in landmarks-scratch/jax/work/jax-basilica-immaculate-conception/photos):
 *  p1 https://commons.wikimedia.org/wiki/File:Jax_FL_Immaculate_Conception_Church01.jpg
 *     — the front from the south-south-west, whole.
 *  p2 https://commons.wikimedia.org/wiki/File:Jax_FL_Immaculate_Conception_Church02.jpg
 *     — the portals and steps, close.
 *  p3 https://commons.wikimedia.org/wiki/File:Jax_FL_Immaculate_Conception_Church_tall_pano02.jpg
 *     — the front, frontal.
 * Plan and roof colour also from USGS NAIP (public domain).
 *
 * Left out: crockets, hood moulds, the statue niche, the tower's blind
 * arcade, the spire's lucarnes, the aisles' small cross gables (drawn as
 * a lean-to). Doubts: the flanks, transept ends and apse are not
 * photographed (windows there are generic pointed lancets); the turret
 * lantern's open arcade is drawn as dark louvred panels. Colours: stone
 * 0xdedbd3 (cool pale grey, p1, p3), tile 0xbf6448 (p1, NAIP), doors
 * 0x7e4a36 (p2), green-grey caps and louvres 0x8a9a92 (p1).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Face, type XY, extrudeShape, flatShape, lathe, disc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { box } from './nash-tennessee-state-capitol'
import { prismX, prismY, roofX, roofY } from './ral-holy-name-of-jesus-cathedral'
import { lancet, pointedShape, apexOf } from './ral-first-baptist-church'
import { boxFaces, gablet, spike } from './cola-trinity-cathedral'

const XC = 0.2, NH = 6.4 // nave centre and half width
const YF = -17.5, YB = 14.1 // front wall, apse chord
const RIDGE = 22.0, EAVE = 12.3
const TX0 = -12.8, TX1 = -6.0, TY0 = -19.0, TY1 = -11.8 // tower
const CUT = 22.5, BEL = 28.5, TIP = 52.0
const RX = 8.7, RY = -16.4, RR = 2.65 // turret

function build() {
  const stone = new Part(), trim = new Part(), tile = new Part(), win = new Part(), door = new Part(), cap = new Part()

  // ============================================================ nave (ridge through to the apse), aisles, transepts, apse
  prismY(stone, YF, YB, [[XC - NH, 0], [XC + NH, 0], [XC + NH, EAVE], [XC, RIDGE], [XC - NH, EAVE]])
  roofY(tile, YF + 0.5, YB, XC, NH, EAVE, RIDGE + 0.05, 0.35, 0.3)
  // the front gable stands a little proud of the roof, with a coping
  prismY(stone, YF - 0.25, YF + 0.5, [[XC - NH, 0], [XC + NH, 0], [XC + NH, EAVE + 0.5], [XC, RIDGE + 0.6], [XC - NH, EAVE + 0.5]])
  // aisles: walls to 10, lean-to roofs up to the nave wall
  box(stone, -9.2, TY1, XC - NH, 2.5, 0, 10.0)
  box(stone, XC + NH, -15.0, 10.1, 2.5, 0, 10.0)
  box(stone, 10.1, 1.3, 12.6, 2.8, 0, 5.0) // east vestibule
  prismY(tile, TY1, 2.5, [[-9.4, 9.9], [XC - NH, 11.4], [XC - NH, 11.7], [-9.4, 10.2]])
  prismY(tile, -15.0, 2.5, [[10.3, 9.9], [10.3, 10.2], [XC + NH, 11.7], [XC + NH, 11.4]])
  // transepts: gable walls proud of a cross roof at the nave's ridge
  const TYC = 8.3, THW = 5.8, TE = 14.0
  prismX(stone, -13.2, 13.6, [[TYC - THW, 0], [TYC + THW, 0], [TYC + THW, TE], [TYC, RIDGE], [TYC - THW, TE]])
  roofX(tile, -12.8, 13.2, TYC, THW, TE, RIDGE + 0.05, 0.35, 0.3)
  for (const [xa, xb] of [[-13.2, -12.6], [13.0, 13.6]]) prismX(stone, xa, xb, [[TYC - THW, TE - 0.5], [TYC + THW, TE - 0.5], [TYC + THW, TE + 0.5], [TYC, RIDGE + 0.6], [TYC - THW, TE + 0.5]])
  // apse: half dodecagon, conical tiled roof meeting the nave ridge
  lathe(stone, XC, YB, [[5.8, 0], [5.8, 13.0]], 6, 0, 180)
  lathe(tile, XC, YB, [[6.2, 12.75], [0.02, RIDGE + 0.05]], 6, 0, 180)

  // ============================================================ the west front
  const front: Face = { o: [0, YF - 0.25, 0], n: [0, -1] }
  // the great window: four lights under a pointed head (p1, p3)
  lancet(win, trim, front, XC, 4.8, 7.0, 12.6, 4)
  flatShape(trim, front, [[XC - 0.09, 12.6], [XC + 0.09, 12.6], [XC + 0.09, 15.6], [XC - 0.09, 15.6]], 0.08)
  extrudeShape(stone, front, [[XC - NH + 0.2, 6.6], [XC + NH - 0.2, 6.6], [XC + NH - 0.2, 7.0], [XC - NH + 0.2, 7.0]], 0, 0.2)
  // two small louvres beside the apex niche
  for (const s of [-1.1, 1.1]) lancet(cap, null, front, XC + s, 0.55, 17.4, 18.4)
  // the main portal: a gabled hood, oak doors, a pointed tympanum light
  portal(stone, door, win, front, XC, 2.6, 4.6, 8.4)
  // three small gabled lancets either side of the portal (p2, p3)
  for (const side of [-1, 1]) for (let k = 0; k < 3; k++) {
    const s = XC + side * (3.2 + k * 0.9)
    lancet(win, null, front, s, 0.5, 1.6, 3.4)
    gablet(stone, front, s, 0.86, 3.6, 1.3, 0, 0.25)
  }
  // steps up to the doors
  box(stone, XC - 2.4, YF - 1.6, XC + 2.4, YF - 0.2, 0, 0.3)
  box(stone, XC - 2.0, YF - 1.0, XC + 2.0, YF - 0.2, 0.3, 0.6)

  // ============================================================ the west tower
  box(stone, TX0, TY0, TX1, TY1, 0, CUT)
  const tf = boxFaces(TX0, TY0, TX1, TY1)
  const TC: [number, number] = [(TX0 + TX1) / 2, (TY0 + TY1) / 2]
  // clasping buttresses, stepping in at 9.5
  for (const [x, y] of [[TX0, TY0], [TX1, TY0], [TX0, TY1]]) {
    box(stone, x - 0.6, y - 0.6, x + 0.6, y + 0.6, 0, 9.5, stone, 0.15)
    box(stone, x - 0.45, y - 0.45, x + 0.45, y + 0.45, 9.5, 19.5, stone, 0.12)
  }
  // string course and cornice
  box(stone, TX0 - 0.25, TY0 - 0.25, TX1 + 0.25, TY1 + 0.25, 9.3, 9.7, stone, 0.12)
  box(stone, TX0 - 0.3, TY0 - 0.3, TX1 + 0.3, TY1 + 0.3, 19.5, 20.1, stone, 0.15)
  // the tower door (gabled hood) and a two-light lancet over it on the front and west
  portal(stone, door, win, { o: [0, TY0, 0], n: [0, -1] }, TC[0], 2.2, 4.2, 7.6)
  lancet(win, trim, tf[0], TC[0] - tf[0].o[0], 1.4, 11.2, 14.6, 2)
  lancet(win, trim, tf[3], 0, 1.4, 11.2, 14.6, 2)
  lancet(win, null, tf[1], 0, 1.0, 12.0, 14.8)
  // belfry: a louvred lancet and a gable on every face, pinnacles at the corners
  box(stone, TX0 + 0.3, TY0 + 0.3, TX1 - 0.3, TY1 - 0.3, CUT, BEL)
  const bf = boxFaces(TX0 + 0.3, TY0 + 0.3, TX1 - 0.3, TY1 - 0.3)
  for (const f of bf) {
    const w = Math.abs(f.n[0]) ? TY1 - TY0 - 0.6 : TX1 - TX0 - 0.6
    lancet(cap, trim, f, 0, 2.4, CUT + 0.4, BEL - 0.4, 2)
    for (let k = 1; k <= 3; k++) flatShape(trim, f, [[-1.2, CUT + 0.4 + k * 1.3], [1.2, CUT + 0.4 + k * 1.3], [1.2, CUT + 0.6 + k * 1.3], [-1.2, CUT + 0.6 + k * 1.3]], 0.08)
    gablet(stone, f, 0, w - 0.4, BEL - 0.3, 4.8, -0.9, 0.12)
  }
  for (const [x, y] of [[TX0, TY0], [TX1, TY0], [TX0, TY1], [TX1, TY1]]) spike(stone, stone, x + Math.sign(TC[0] - x) * 0.55, y + Math.sign(TC[1] - y) * 0.55, 0.8, CUT, BEL + 1.6, 33.6)
  // the spire: octagonal red tile, a green cap and a cross
  lathe(tile, TC[0], TC[1], [[2.8, BEL], [0.45, TIP - 1.6]], 8, 22.5, 382.5)
  lathe(cap, TC[0], TC[1], [[0.55, TIP - 1.6], [0.35, TIP - 0.6], [0.02, TIP]], 8, 22.5, 382.5)
  cross(cap, TC[0], TC[1], TIP - 0.1, 2.4, 1.3, 0.24)

  // ============================================================ the east turret
  lathe(stone, RX, RY, [[RR, 0], [RR, 15.5]], 12)
  for (const [z0, z1] of [[6.8, 7.2], [15.5, 16.0]]) {
    lathe(stone, RX, RY, [[RR + 0.2, z0], [RR + 0.2, z1]], 12)
    disc(stone, RX, RY, RR + 0.2, z1, 12)
    disc(stone, RX, RY, RR + 0.2, z0, 12, false)
  }
  const facet = (a: number, r: number): Face => ({ o: [RX + Math.cos(a) * r, RY + Math.sin(a) * r, 0], n: [Math.cos(a), Math.sin(a)] })
  const ap = RR * Math.cos(Math.PI / 12)
  for (const a of [-105, -75, -45, -15, 165, -135]) {
    const f = facet(((a + 0.0) * Math.PI) / 180, ap)
    if (a === -105 || a === -75) lancet(win, null, f, 0, 0.75, 2.4, 6.0)
    lancet(win, null, f, 0, 0.75, 9.6, 13.0)
  }
  // lantern: octagonal, open lancets (dark), gablets at its foot, pinnacles round it
  const LR = 2.0, lap = LR * Math.cos(Math.PI / 8)
  lathe(stone, RX, RY, [[LR, 16.0], [LR, 22.3]], 8, 22.5, 382.5)
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4
    lancet(cap, null, facet(a, lap), 0, 0.85, 17.2, 20.6)
    gablet(stone, facet(a, lap), 0, 1.5, 16.0, 1.6, 0, 0.35)
    const b = a + Math.PI / 8
    spike(stone, stone, RX + Math.cos(b) * (LR + 0.15), RY + Math.sin(b) * (LR + 0.15), 0.35, 16.0, 21.4, 23.2)
  }
  lathe(tile, RX, RY, [[2.35, 22.3], [0.3, 27.4]], 12)
  lathe(cap, RX, RY, [[0.32, 27.4], [0.02, 28.3]], 8)
  disc(tile, RX, RY, 2.35, 22.3, 12, false)
  cross(cap, RX, RY, 28.2, 1.5, 0.9, 0.18)

  // ============================================================ flanks, transept ends and apse (unphotographed: plain lancets)
  for (const [x, n] of [[-9.2, -1], [10.1, 1]] as [number, -1 | 1][]) {
    const f: Face = { o: [x, 0, 0], n: [n, 0] }
    for (const y of n < 0 ? [-8.5, -4.0, 0.5] : [-11.5, -7.5, -3.5, 0.0]) {
      lancet(win, null, f, n * y, 1.4, 3.4, 7.2)
      box(stone, x + n * 0.3 - 0.35, y + 1.9 - 0.4, x + n * 0.3 + 0.35, y + 1.9 + 0.4, 0, 8.5)
    }
  }
  for (const [x, n] of [[-13.2, -1], [13.6, 1]] as [number, -1 | 1][]) {
    const f: Face = { o: [x, TYC, 0], n: [n, 0] }
    lancet(win, trim, f, 0, 3.8, 5.0, 11.0, 3)
    for (const s of [-1, 1]) box(stone, x + n * 0.35 - 0.4, TYC + s * (THW - 0.4) - 0.4, x + n * 0.35 + 0.4, TYC + s * (THW - 0.4) + 0.4, 0, TE + 1.4, stone, 0.1)
  }
  for (let k = 0; k < 6; k++) {
    const a = ((k + 0.5) * Math.PI) / 6
    lancet(win, null, { o: [XC + Math.cos(a) * 5.8 * Math.cos(Math.PI / 12), YB + Math.sin(a) * 5.8 * Math.cos(Math.PI / 12), 0], n: [Math.cos(a), Math.sin(a)] }, 0, 1.2, 4.5, 9.5)
  }

  return finishGlb('Basilica of the Immaculate Conception', [
    { part: stone, material: finish('bic-stone', 0xdedbd3) },
    { part: trim, material: finish('bic-trim', 0xf2f0ea) },
    { part: tile, material: finish('bic-tile', 0xbf6448) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('bic-oak', 0x7e4a36) },
    { part: cap, material: finish('bic-cap', 0x8a9a92) },
  ], { bearing: 15, height: TIP + 2.4, replaces: ['way/497147278'] }, 6500)
}

/** A gabled portal on face f: hood w wide up to apex zg, door leaves to zd, a pointed light above. */
function portal(stone: Part, door: Part, win: Part, f: Face, s: number, w: number, zd: number, zg: number) {
  const h = w / 2 + 0.5
  extrudeShape(stone, f, [[s - h, 0], [s + h, 0], [s + h, zd + 1.6], [s, zg], [s - h, zd + 1.6]], 0, 0.55)
  const g: Face = { o: [f.o[0] + f.n[0] * 0.55, f.o[1] + f.n[1] * 0.55, 0], n: f.n }
  flatShape(door, g, [[s - w / 2, 0.6], [s + w / 2, 0.6], [s + w / 2, zd - 0.6], [s - w / 2, zd - 0.6]], 0.04)
  flatShape(win, g, pointedShape(s, w, zd - 0.45, zd - 0.45, 0.8), 0.04)
  void apexOf
}

/** A latin cross standing at (x, y, z). */
function cross(p: Part, x: number, y: number, z: number, h: number, arm: number, t: number) {
  box(p, x - t / 2, y - t / 2, x + t / 2, y + t / 2, z, z + h)
  box(p, x - arm / 2, y - t / 2, x + arm / 2, y + t / 2, z + h * 0.6, z + h * 0.6 + t)
}

if (import.meta.main) await writeModel('jax-basilica-immaculate-conception', build())
