/**
 * Australian War Memorial, Campbell, Canberra: procedural, CC0-1.0.
 * bun generators/canberra-australian-war-memorial.ts
 *
 * Builds with the kit exported by generators/sydney-tower-eye.ts (lathe,
 * prism, box, skin, arch, saveLods) and polyTris from
 * generators/berlin-oberbaum-bridge.ts; merge sydney-tower-eye.ts first.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 37.5: +y runs
 * up the axis from the entrance (facing Anzac Parade, south-west) through
 * the Commemorative Courtyard to the Hall of Memory and Mount Ainslie.
 * Origin at the centroid of OSM's outer way/5090724 (149.148974, -35.280563),
 * the outer ring of the building relation/7527080 whose inner ring,
 * way/520199710, is the courtyard. y = 0 is the forecourt (parade ground)
 * level at the front.
 *
 * Designed by Emil Sodersten and John Crust (1927 competition), opened 1941;
 * Hall of Memory completed 1959. Sandstone, stripped Byzantine.
 *
 * OSM (LPI imagery 2017): main building 11.2 m; Hall of Memory tower
 *   way/520199707 21.7 m; its dome way/520199676 28.7 m with a 7 m roof
 *   height (drum and dome from 21.7 m); the two entrance pylons
 *   way/1575642069 and /70 tagged 15.4 m; the front steps 2.1 m
 *   (way/1489603158-60); 3 m plinths at the pylons' feet (way/520199708-9).
 * Photo-scaled:
 * - the pylons: w9 and w16 (front, forecourt level) both put them 1.7-1.8
 *   times the front wings' 11.2 m, so 20 m (OSM's 15.4 m is not followed).
 * - Hall of Memory (w2, frontal from the courtyard, 14.1 px/m on the hall's
 *   24.6 m face): the hall stands on a terrace 3 m up the courtyard steps;
 *   the main block's cornice at 19 m, two stepped attic tiers to 21.7 m;
 *   the great round-headed window 6 m wide, sill 7.3 m, springing 12.8 m,
 *   head 15.8 m, in a deep arched recess, a door below; the drum 14.8 m
 *   across with small round-headed windows; a low dome (w11: rise about a
 *   third of its span) with meridian ribs and tile courses.
 * - cloisters (w2, w4): round arches on square piers, about 3.9 m pitch,
 *   openings 2.8 m wide over a 1.5 m name-panel dado, heads at 8 m; a
 *   gallery about 4 m deep behind them with the Roll of Honour's bronze
 *   panels on its back wall.
 * - the side and rear galleries' ground-floor windows (w11): tall panels
 *   about 3.6 m apart, sills 1.2 m, heads 4.6 m.
 * Estimated: the entrance pavilion between the pylons (about 10.5 m, w16)
 *   and its round-headed window over the door; the gallery depth; the hall's
 *   window on the faces no photo shows square-on (repeated from the
 *   courtyard face, as w11 shows it on the south-east face).
 * Left out: the Pool of Reflection and the courtyard's paving, beds and
 *   flame (water and ground are the map's); the new Anzac Hall and glazed
 *   courtyard to the north-east and the underground southern entrance
 *   (way/1489659375, layer -1) are separate buildings.
 *
 * Terrain (Mapterhorn z12 only): the z12 tiles slope about 4 m the wrong
 *   way across the footprint (higher at the front); the real site rises
 *   from the parade ground to the hall. The model keeps the photographed
 *   heights from the forecourt level and lets the front sink into the
 *   coarse terrain.
 *
 * Colours from daylight photos: sandstone sunlit #f1e5c6 and #e5d4ae (w11)
 *   -> sandstone 0xe3d1ad; the dome's green-grey patina #9da092 sunlit (w11)
 *   -> 0x7f9887; Roll of Honour bronze, dark; the flat roofs, hidden behind
 *   1.2 m stone parapets, stone-grey 0xc2b9a8.
 * Night: the memorial is floodlit, the hall and dome brightest -> sandstone
 *   and dome carry _FLOODLIGHT; the hall's great windows are `window`.
 *
 * LODs: the low model has 11 cloister arches a side, a 24-sided drum and
 *   16 dome ribs; the detail model (models/canberra-australian-war-memorial.detail.glb)
 *   has all 14 arches with imposts, 32 ribs and five tile courses, the drum's
 *   windows, tracery and more facade windows.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - w2 "AWM canberra 1.jpg", Capital photographer, CC BY-SA 3.0 (the courtyard)
 * - w4 "Australian War Memorial, Canberra, 2017, 05.jpg", Kgbo, CC BY-SA 4.0 (cloister)
 * - w9 "Australian War Memorial front view.jpg", Shkuru Afshar, CC BY-SA 4.0
 * - w10 "Australian War Memorial - Joy of Museums - External.jpg", GordonMakryllos, CC BY-SA 4.0
 * - w11 "Australian War Memorial - panoramio.jpg", Con Tassios, CC BY 3.0 (from the south-east)
 * - w14 "Old Parliament House, Australian War Memorial, Mount Ainslie, Canberra.jpg", Kgbo, CC BY-SA 4.0
 * - w16 "Australian War Memorial, Canberra, 2017, 18.jpg", Kgbo, CC BY-SA 4.0 (front)
 * No look-only references.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, prism, box, skin, arch, face, tube, saveLods, type Layer, type XY } from './sydney-tower-eye'
import { polyTris } from './berlin-oberbaum-bridge'

const WALL = 11.2

// OSM way/5090724 in the frame (outer ring).
const MAIN: XY[] = [[-50.1, -11.0], [-50.4, 1.0], [-49.4, 1.0], [-49.9, 20.5], [-50.3, 20.5], [-50.6, 32.0], [-48.1, 32.1], [-20.9, 32.4], [-21.2, 47.1], [-18.7, 47.2], [-18.7, 49.0], [-9.1, 50.0], [-7.8, 54.3], [-6.2, 56.7], [-3.0, 58.2], [-0.7, 58.5], [1.8, 57.6], [3.5, 56.4], [5.1, 54.9], [6.2, 52.8], [6.9, 49.8], [15.3, 49.6], [15.8, 47.9], [18.2, 47.9], [18.5, 37.9], [18.8, 33.6], [42.6, 34.6], [48.9, 34.8], [49.2, 22.1], [47.9, 22.0], [48.3, 4.4], [49.6, 4.5], [49.8, -8.3], [29.0, -8.9], [29.3, -21.4], [27.3, -21.5], [20.7, -21.7], [21.7, -60.2], [12.6, -60.5], [12.6, -61.6], [9.0, -61.7], [9.0, -63.0], [9.1, -65.6], [6.1, -65.7], [6.0, -65.0], [4.8, -65.1], [-2.7, -65.3], [-3.6, -65.3], [-3.6, -66.0], [-7.0, -66.1], [-7.0, -63.5], [-6.6, -63.5], [-6.7, -62.2], [-10.4, -62.3], [-10.4, -61.8], [-19.7, -62.1], [-19.8, -55.3], [-20.7, -17.8], [-20.8, -16.4], [-20.9, -10.1]]
// The courtyard (inner ring way/520199710), squared up, and the galleries behind its arcades.
const CX0 = -7.5, CX1 = 8.9, CY0 = -59.1, CY1 = -0.8
const GAL = 4.2, ARC_T = 0.9
// notched at the north end where the hall's recessed front stands at the courtyard's end
const COURT_EXP: XY[] = [[CX0 - GAL, CY0], [CX1 + GAL, CY0], [CX1 + GAL, CY1], [8.0, CY1], [8.0, 0.3], [-7.5, 0.3], [-7.5, CY1], [CX0 - GAL, CY1]]
// The front: the entrance pavilion fills MAIN's notch between the pylons.
const PYLONS: XY[][] = [
  [[-6.7, -59.3], [-3.4, -59.2], [-3.3, -65.9], [-6.5, -66.0]],
  [[5.9, -58.9], [8.9, -58.8], [9.1, -65.6], [6.1, -65.7]],
]
const PYLON_H = 20
// Hall of Memory (way/520199707), its four central faces pulled in by the window recess depth.
const HC: XY = [0.2, 12.2]
const REC = 1.2
const HALL: XY[] = [[-12.1, 3.9], [-9.7, 3.9], [-9.6, 2.1], [-7.6, 2.1], [-7.5, -0.9 + REC], [8.0, -0.4 + REC], [7.9, 2.3], [10.2, 2.4], [10.2, 4.8], [12.3 - REC, 4.9], [11.9 - REC, 21.1], [9.3, 21.0], [9.3, 22.8], [7.8, 22.7], [7.7, 25.3 - REC], [-8.0, 24.9 - REC], [-8.0, 22.7], [-9.7, 22.7], [-9.7, 20.2], [-12.5 + REC, 20.2], [-12.1 + REC, 3.9]]
const HALL_CORNICE = 19, HALL_TOP = 21.7
const DRUM_R = 7.4, DRUM_TOP = 23.4, DOME_BASE = 23.8, DOME_TOP = 28.7
const TERRACE = 3

type Set = { stone: Part; trim: Part; win: Part; dome: Part; roof: Part; bronze: Part }
const mk = (): Set => ({ stone: new Part(), trim: new Part(), win: new Part(), dome: new Part(), roof: new Part(), bronze: new Part() })
const low = mk(), det = mk()

const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const ROOF = WALL - 1.2, PARAPET_T = 0.6

/**
 * The parapet's inner face and coping round a counter-clockwise ring: `side` 1
 * when the roof lies inside the ring (an outer wall), -1 when it lies outside
 * (a courtyard's wall).
 */
function parapet(p: Part, ring: XY[], side: 1 | -1) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.3) continue
    const inw: XY = [(-(b[1] - a[1]) / L) * side, ((b[0] - a[0]) / L) * side]
    const Q = (q: XY, o: number, z: number): V3 => [q[0] + inw[0] * o, q[1] + inw[1] * o, z]
    face(p, [Q(a, PARAPET_T, ROOF), Q(b, PARAPET_T, ROOF), Q(b, PARAPET_T, WALL), Q(a, PARAPET_T, WALL)], [inw[0], inw[1], 0])
    face(p, [Q(a, 0, WALL), Q(b, 0, WALL), Q(b, PARAPET_T, WALL), Q(a, PARAPET_T, WALL)], [0, 0, 1])
  }
}

/** Panels on an outer wall a→b (outside on the right): `n` windows, each w wide, z0..z1. */
function wallWindows(p: Part, a: XY, b: XY, w: number, pitch: number, z0: number, z1: number, out = 0.04) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const count = Math.floor((L - 2) / pitch)
  if (count < 1) return
  const s0 = (L - (count - 1) * pitch) / 2
  for (let k = 0; k < count; k++) {
    const s = s0 + k * pitch
    const P = (t: number, z: number): V3 => [a[0] + u[0] * t + n[0] * out, a[1] + u[1] * t + n[1] * out, z]
    face(p, [P(s - w / 2, z0), P(s + w / 2, z0), P(s + w / 2, z1), P(s - w / 2, z1)], [n[0], n[1], 0])
  }
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  // ---- Main building: walls round the courtyard and galleries, a flat roof -------------------------
  const outer = area2(MAIN) > 0 ? MAIN : [...MAIN].reverse()
  prism(s.stone, outer, 0, WALL, { top: false, holes: [COURT_EXP] })
  // flat roofs 1.2 m down behind stone parapets, so from the ground only the parapets show (w9, w16)
  for (const [a, b, c] of polyTris(outer, [COURT_EXP])) face(s.roof, [[a[0], a[1], ROOF], [b[0], b[1], ROOF], [c[0], c[1], ROOF]], [0, 0, 1])
  parapet(s.stone, outer, 1)
  parapet(s.stone, area2(COURT_EXP) > 0 ? COURT_EXP : [...COURT_EXP].reverse(), -1)
  // a low parapet coping: a pale band round the outer wall top
  for (let i = 0; i < outer.length; i++) {
    const a = outer[i], b = outer[(i + 1) % outer.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1.5) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const P = (q: XY, z: number, o: number): V3 => [q[0] + n[0] * o, q[1] + n[1] * o, z]
    face(s.trim, [P(a, WALL - 0.7, 0.05), P(b, WALL - 0.7, 0.05), P(b, WALL - 0.5, 0.05), P(a, WALL - 0.5, 0.05)], [n[0], n[1], 0])
    // ground-floor windows on the side and rear galleries (the front wings are blank)
    const my = (a[1] + b[1]) / 2
    if (L > 8 && my > -50) wallWindows(s.win, a, b, 1.7, d ? 3.6 : 4.4, 1.2, 4.6)
    if (d && L > 8 && my > -50) wallWindows(s.win, a, b, 0.5, 7.2, 7.4, 8.6)
  }

  // ---- Cloisters: arcades on the courtyard's long sides, galleries roofed behind ----------------
  const ARCH_H = 8.0, SILL = 1.5
  const n = d ? 14 : 11
  const pitch = (CY1 - CY0 - 2.4) / n
  const holes: XY[][] = []
  const W = pitch * 0.72
  for (let k = 0; k < n; k++) {
    const c = 1.2 + pitch * (k + 0.5)
    holes.push(arch(c - W / 2, c + W / 2, SILL, ARCH_H - W / 2, false, d ? 10 : 6))
  }
  const L = CY1 - CY0
  // west arcade: wall line x = CX0 - ARC_T, projecting to CX0, running north
  skin(s.stone, null, [CX0 - ARC_T, CY0], [CX0 - ARC_T, CY1], 0, WALL, ARC_T, holes, { through: false, ends: false })
  // east arcade, running south (holes mirrored so they line up with the west side)
  const holesE = holes.map((h) => h.map(([t, z]) => [L - t, z] as XY))
  skin(s.stone, null, [CX1 + ARC_T, CY1], [CX1 + ARC_T, CY0], 0, WALL, ARC_T, holesE, { through: false, ends: false })
  // the arcade's back face (inside the gallery), so the holes are open through the wall
  skin(s.stone, null, [CX0 - ARC_T, CY1], [CX0 - ARC_T, CY0], 0, WALL, 0.001, holes.map((h) => h.map(([t, z]) => [L - t, z] as XY)), { ends: false, top: false })
  skin(s.stone, null, [CX1 + ARC_T, CY0], [CX1 + ARC_T, CY1], 0, WALL, 0.001, holes, { ends: false, top: false })
  // gallery ceilings/roofs over the cloister walks
  for (const [x0, x1] of [[CX0 - GAL, CX0], [CX1, CX1 + GAL]]) {
    prism(s.stone, [[x0, CY0], [x1, CY0], [x1, CY1], [x0, CY1]], ARCH_H + 0.6, ROOF, { top: false, bottom: true })
    face(s.roof, [[x0, CY0, ROOF], [x1, CY0, ROOF], [x1, CY1, ROOF], [x0, CY1, ROOF]], [0, 0, 1])
  }
  // the courtyard's two end walls above the galleries are the main block's; the Roll of Honour on the galleries' back walls
  for (const [x, nx] of [[CX0 - GAL + 0.05, 1], [CX1 + GAL - 0.05, -1]] as [number, number][]) {
    const segs = d ? 14 : 1
    for (let k = 0; k < segs; k++) {
      const y0 = CY0 + 1.5 + ((L - 3) * k) / segs + (segs > 1 ? 0.15 : 0), y1 = CY0 + 1.5 + ((L - 3) * (k + 1)) / segs - (segs > 1 ? 0.15 : 0)
      face(s.bronze, [[x, y0, 0.8], [x, y1, 0.8], [x, y1, 3.6], [x, y0, 3.6]], [nx, 0, 0])
    }
  }
  if (d) {
    // imposts at the springing of each arch, on the courtyard faces
    for (let k = 0; k <= n; k++) {
      const yy = CY0 + 1.2 + pitch * k
      for (const x of [CX0 + 0.08, CX1 - 0.08]) box(s.trim, [x, yy], 0.12, (pitch - W) / 2 + 0.1, ARCH_H - W / 2 - 0.35, ARCH_H - W / 2, 0, { bottom: true })
    }
    // the name-panel dado band
    for (const x of [CX0 + 0.04, CX1 - 0.04]) {
      const nx = x < 0 ? 1 : -1
      face(s.trim, [[x, CY0 + 1, 1.3], [x, CY1 - 1, 1.3], [x, CY1 - 1, 1.5], [x, CY0 + 1, 1.5]].map((q) => q as V3), [nx, 0, 0])
    }
  }

  // ---- Front: pylons, entrance pavilion, plinths, steps -------------------------------------------
  for (const pl of PYLONS) prism(s.stone, pl, 0, PYLON_H)
  for (const pl of PYLONS) {
    // a coping band at the pylons' tops
    const c = pl.reduce((acc, q) => [acc[0] + q[0] / 4, acc[1] + q[1] / 4], [0, 0])
    box(s.trim, c as XY, 1.75, 3.55, PYLON_H - 0.8, PYLON_H - 0.4, -0.02)
  }
  prism(s.stone, [[-3.4, -64.6], [6.0, -64.6], [5.95, -59.0], [-3.35, -59.1]], 0, 10.4)
  prism(s.stone, [[-2.2, -63.8], [4.8, -63.8], [4.8, -59.0], [-2.2, -59.0]], 10.4, 11.6)
  // door and round-headed window over it, on the pavilion's front (south-west) face
  {
    const fy = -64.6 - 0.05
    face(s.bronze, [[-0.6, fy, 2.1], [3.2, fy, 2.1], [3.2, fy, 5.6], [-0.6, fy, 5.6]], [0, -1, 0])
    face(s.trim, [[-1.0, fy + 0.02, 2.1], [3.6, fy + 0.02, 2.1], [3.6, fy + 0.02, 6.0], [-1.0, fy + 0.02, 6.0]], [0, -1, 0])
    const ar = arch(-0.2, 2.8, 6.8, 7.9, false, 8)
    for (const [a, b, c] of polyTris(ar)) face(s.win, [[a[0], fy, a[1]], [b[0], fy, b[1]], [c[0], fy, c[1]]], [0, -1, 0])
  }
  prism(s.stone, [[4.7, -59.0], [4.8, -65.1], [6.0, -65.0], [6.1, -65.7], [9.1, -65.6], [9.0, -63.0], [6.0, -63.1], [5.9, -58.9]], 0, 3)
  prism(s.stone, [[-3.7, -59.2], [-3.6, -63.4], [-7.0, -63.5], [-7.0, -66.1], [-3.6, -66.0], [-3.6, -65.3], [-2.7, -65.3], [-2.9, -59.2]], 0, 3)
  // the front steps (OSM 2.1 m), six risers, between the pylons' plinths
  for (let k = 0; k < 6; k++) {
    const y0 = -76.4 + k * 1.7
    prism(s.stone, [[-4.9, y0], [7.5, y0], [7.5, -65.3], [-4.9, -65.3]], 0, ((k + 1) * 2.1) / 6)
  }

  // ---- Hall of Memory -------------------------------------------------------------------------------
  // terrace and steps up from the courtyard to the hall door
  prism(s.stone, [[-6.5, CY1 - 6], [7.9, CY1 - 6], [7.9, CY1], [-6.5, CY1]], 0, TERRACE)
  prism(s.stone, HALL, 0, HALL_CORNICE)
  // the four window recesses: skins on the pulled-in faces, with the great arch and (front) the door
  const faces: [XY, XY][] = [
    [[-7.5, -0.9 + REC], [8.0, -0.4 + REC]], // south-west, the courtyard face
    [[12.3 - REC, 4.9], [11.9 - REC, 21.1]],
    [[7.7, 25.3 - REC], [-8.0, 24.9 - REC]],
    [[-12.5 + REC, 20.2], [-12.1 + REC, 3.9]],
  ]
  faces.forEach(([a0, b0], fi) => {
    // the ring is counter-clockwise, so each face as listed has the outside on its right
    const [a, b] = [a0, b0]
    const Lf = Math.hypot(b[0] - a[0], b[1] - a[1])
    const c = Lf / 2
    const hw = 3.0
    const hs: XY[][] = [arch(c - hw, c + hw, 7.3, 12.8, false, d ? 12 : 8)]
    if (fi === 0) hs.push([[c - 1.3, TERRACE], [c + 1.3, TERRACE], [c + 1.3, 6.3], [c - 1.3, 6.3]])
    skin(s.stone, s.win, a, b, 0, HALL_CORNICE, REC, hs, { ends: true })
    // the outer arch ring round the recess, proud of the face
    const u: XY = [(b[0] - a[0]) / Lf, (b[1] - a[1]) / Lf], nn: XY = [u[1], -u[0]]
    const Wp = (t: number, z: number, o: number): V3 => [a[0] + u[0] * t + nn[0] * o, a[1] + u[1] * t + nn[1] * o, z]
    const seg = d ? 14 : 8
    for (let i = 0; i < seg; i++) {
      const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg
      const r0 = hw + 0.15, r1 = hw + 0.85
      const q = (r: number, t: number, o: number) => Wp(c + r * Math.cos(t), 12.8 + r * Math.sin(t), o)
      face(s.trim, [q(r1, t0, REC + 0.12), q(r1, t1, REC + 0.12), q(r0, t1, REC + 0.12), q(r0, t0, REC + 0.12)], [nn[0], nn[1], 0])
      face(s.trim, [q(r1, t0, REC), q(r1, t1, REC), q(r1, t1, REC + 0.12), q(r1, t0, REC + 0.12)], [Math.cos((t0 + t1) / 2) * u[0], Math.cos((t0 + t1) / 2) * u[1], Math.sin((t0 + t1) / 2)])
    }
    // tracery: four mullions and two transoms, trim bars in the window
    const bars: [number, number, number, number][] = []
    for (let k = 1; k <= 4; k++) { const t = c - hw + (2 * hw * k) / 5; bars.push([t - 0.1, t + 0.1, 7.3, 12.8 + Math.sqrt(Math.max(0, hw * hw - (t - c) ** 2)) - 0.1]) }
    for (const z of [9.2, 11.1]) bars.push([c - hw, c + hw, z - 0.1, z + 0.1])
    for (const [t0, t1, z0, z1] of bars) face(s.trim, [Wp(t0, z0, 0.07), Wp(t1, z0, 0.07), Wp(t1, z1, 0.07), Wp(t0, z1, 0.07)], [nn[0], nn[1], 0])
    if (fi === 0) face(s.bronze, [Wp(c - 1.25, TERRACE, 0.07), Wp(c + 1.25, TERRACE, 0.07), Wp(c + 1.25, 6.2, 0.07), Wp(c - 1.25, 6.2, 0.07)], [nn[0], nn[1], 0])
  })
  // cornice band and the stepped attic
  const sq = (h: number, k = 1): XY[] => [[HC[0] - h * k, HC[1] - h], [HC[0] + h * k, HC[1] - h], [HC[0] + h * k, HC[1] + h], [HC[0] - h * k, HC[1] + h]]
  prism(s.trim, [[-8.1, -0.9], [8.6, -0.4], [12.4, 4.4], [12.0, 21.6], [8.2, 25.8], [-8.5, 25.4], [-12.6, 20.7], [-12.2, 3.4]], HALL_CORNICE - 0.5, HALL_CORNICE, { bottom: true })
  prism(s.stone, sq(11.2), HALL_CORNICE, 20.4)
  prism(s.stone, sq(9.6), 20.4, HALL_TOP)
  // corner blocks stepping up the attic (w11)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]])
    box(s.stone, [HC[0] + sx * 9.4, HC[1] + sy * 9.4], 1.6, 1.6, 20.4, 21.2)

  // ---- Drum and dome -------------------------------------------------------------------------------
  const NS = d ? 40 : 24
  lathe(s.stone, HC, [[DRUM_R, HALL_TOP], [DRUM_R, DRUM_TOP]], NS)
  lathe(s.trim, HC, [[DRUM_R, DRUM_TOP], [DRUM_R + 0.4, DRUM_TOP + 0.1], [DRUM_R + 0.4, DOME_BASE], [DRUM_R - 0.1, DOME_BASE]], NS, { crease: 30 })
  // small round-headed windows round the drum
  const nwin = d ? 16 : 8
  for (let i = 0; i < nwin; i++) {
    const t = (i / nwin) * Math.PI * 2 + Math.PI / nwin
    const cs = Math.cos(t), sn = Math.sin(t)
    const r = DRUM_R + 0.04
    const P = (w: number, z: number): V3 => [HC[0] + cs * r - sn * w, HC[1] + sn * r + cs * w, z]
    const ar = arch(-0.35, 0.35, 22.2, 22.75, false, d ? 6 : 4)
    for (const [a, b, c] of polyTris(ar)) face(s.win, [P(a[0], a[1]), P(b[0], b[1]), P(c[0], c[1])], [cs, sn, 0])
  }
  // the dome: a segmental profile, rise a third of the span
  const R0 = DRUM_R + 0.1, rise = DOME_TOP - DOME_BASE
  const sphR = (R0 * R0 + rise * rise) / (2 * rise), zc = DOME_TOP - sphR
  const prof: [number, number][] = []
  const K = d ? 10 : 6
  const a0 = Math.asin(R0 / sphR)
  for (let k = 0; k <= K; k++) {
    const a = a0 * (1 - k / K)
    prof.push([sphR * Math.sin(a), zc + sphR * Math.cos(a)])
  }
  prof[prof.length - 1][0] = 0
  lathe(s.dome, HC, prof, NS)
  // tile pattern: meridian ribs and (detail) horizontal tile courses, raised on the dome
  const ribs = d ? 32 : 16
  for (let i = 0; i < ribs; i++) {
    const t = (i / ribs) * Math.PI * 2
    const pts: V3[] = prof.slice(0, -1).map(([r, z]) => {
      const a = Math.asin(Math.min(1, r / sphR)), off = 0.09
      return [HC[0] + Math.cos(t) * (r + off * Math.sin(a)), HC[1] + Math.sin(t) * (r + off * Math.sin(a)), z + off * Math.cos(a)] as V3
    })
    tube(s.dome, pts, d ? 0.11 : 0.14, d ? 4 : 3)
  }
  if (d) for (let k = 1; k <= 5; k++) {
    const a = a0 * (1 - k / 6.5)
    const r = sphR * Math.sin(a), z = zc + sphR * Math.cos(a)
    lathe(s.dome, HC, [[r + 0.02, z - 0.1], [r + 0.1, z - 0.05], [r + 0.1, z + 0.05], [r + 0.02, z + 0.1]].map(([rr, zz]) => [rr, zz]) as [number, number][], NS)
  }
  // lantern ring at the crown
  lathe(s.trim, HC, [[0.9, DOME_TOP - 0.15], [0.9, DOME_TOP + 0.25], [0.01, DOME_TOP + 0.3]], 12, { crease: 30 })
}

// ---- Materials and output ----------------------------------------------------------------------------
const hallLit = (p: V3, n: V3) => {
  const inHall = Math.abs(p[0] - HC[0]) < 13.5 && Math.abs(p[1] - HC[1]) < 14.5
  const up = n[2] > 0.8 ? 0.35 : 1
  return (inHall ? 0.9 : p[1] < -55 ? 0.7 : 0.35) * up
}
const STONE: MaterialSpec = { ...finish('sandstone', 0xe3d1ad), floodlight: hallLit }
const TRIM: MaterialSpec = { ...finish('sandstone-trim', 0xf0e3c6), floodlight: hallLit }
const DOME: MaterialSpec = { ...finish('dome-patina', 0x7f9887), floodlight: (_p, n) => (n[2] > 0.9 ? 0.3 : 0.7) }
const BRONZE: MaterialSpec = finish('bronze', 0x6f5d4c, 0.6)
const layers = (s: Set): Layer[] => [
  { part: s.stone, material: STONE },
  { part: s.trim, material: TRIM },
  { part: s.win, material: PALETTE.window },
  { part: s.dome, material: DOME },
  { part: s.roof, material: finish('roof-stone', 0xc2b9a8) },
  { part: s.bronze, material: BRONZE },
]

if (import.meta.main) {
  await saveLods('canberra-australian-war-memorial', 'Australian War Memorial', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid on the forecourt level',
    bearing: 37.5, height: DOME_TOP + 0.3,
  }, 6500)
}
