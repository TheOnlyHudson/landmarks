/**
 * Anna Scripps Whitcomb Conservatory, Belle Isle, Detroit (1904, Albert
 * Kahn; dome and glazing rebuilt in aluminium 1953-55): procedural, CC0-1.0.
 * bun generators/det-belle-isle-conservatory.ts
 *
 * Map frame: x, y, z up, metres, turned to the building: +y runs along
 * bearing 342 (the wings' axis, north-north-west), +x along 72. The anchor
 * is the centroid of the OSM outline way/107310050 (42.3362550,
 * -82.9855511). The Palm House dome stands at (-2.5, 0.2); the Cactus and
 * Fernery wing runs +y, the Tropical House wing -y, the Show House sits on
 * the +x side (towards the aquarium) and the glazed entrance vestibule on
 * the -x side, facing the formal garden and the Levi Barbour fountain.
 *
 * Identity, in order: the tall glass Palm House dome (a bell-shaped ribbed
 * dome on a vertical glazed drum, a small glazed lantern with a conical cap
 * and a spike); two long low curvilinear glasshouse wings, each ending in a
 * taller pavilion with a curved hipped roof, a lantern and a lower apsidal
 * end; the Show House with its curved roof and clerestory monitor; white
 * painted frames on silvery glass.
 *
 * Evidence:
 *  - plan: OSM way/107310050 (outline, Q4883646) and its parts:
 *    way/107227748 Palm House (dome, ~22.1 m across), way/107227691 Cactus
 *    and Fernery, way/107227734 Tropical House, way/107227729 Show House,
 *    way/107227718 (west entrance vestibule), way/660572367, way/660572368,
 *    way/660572369 (the links between the dome and the wings).
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid in
 *    this frame. Ground round the building ~1.4 m over the box minimum, flat;
 *    heights above it: lantern cap 21.1, dome crown at r = 4 m ~17.3, at r =
 *    8 m ~14.7, r = 10 m ~12.1, drum top ~7.2; wings' ridge ~6.0, eaves
 *    ~3.0; pavilions ~8.6, their apsidal ends ~5.2; Show House ~6.5-7.5 where the frames return (drawn to 8.8 with its monitor, as the photos show it standing well over the wings);
 *    vestibule 4.6; Show House roof ~6.6 (sparse; drawn to 8.1 with its monitor, from the photos). Glass returns are sparse; the frames carry the heights.
 *  - published: 1904, Albert Kahn; the dome 85 ft (26 m) high to the tip
 *    (Wikipedia, "Belle Isle Conservatory"). The spike's tip at 25 m here.
 *  - photos: proportions of drum, dome, lantern and wings; the ribs; frame
 *    and glass colours; the pavilion roofs; the Show House monitor.
 *  Estimated: the spike (from the published height), the lantern's drum,
 *  the wing and pavilion profiles between lidar points, the mullion spacing.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Detroit_-_Anna_Scripps_Whitcomb_Conservatory_02.jpg, P. Hughes, CC BY-SA
 *    4.0 (west front across the formal garden)
 *  - Belle_Isle_Whitcomb_Conservatory.jpg, Elizabeth McMillan, CC BY-SA 3.0
 *    (the dome from the west-north-west)
 *  - Anna_Scripps_Whitcomb_Conservatory_(3478836789).jpg, PDru2014, CC BY 2.0
 *    (from the south, across the canal)
 *  - Anna_Scripps_Whitcomb_Conservatory,_Belle_Isle,_Detroit,_Michigan.jpg,
 *    SigmaIota, CC BY-SA 4.0 (Show House and dome from the north-east)
 *  - Front_View_of_Conservatory.JPG, JLHA3050, CC BY-SA 3.0 (from the east)
 *  - Conservatory_Final.jpg, Drklinkert, CC BY-SA 4.0 (west front, axial)
 * No look-only sources. No commercial imagery.
 *
 * Glass is opaque (`glass`, dark at night): from outside the glazing reads as
 * a silvery shell, not as a view of the palms. Elevation 0.
 *
 * Doubts: the wings' and pavilions' profiles are simplified to one curved
 * hip each; the Show House monitor's height is estimated. The lily pond is
 * left out (the map's water).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, circle, rect, save, walls, type XY } from './chi-aon-center'
import { lathe } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- helpers

/** Signed area: positive for counter-clockwise. */
const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())

/**
 * A curvilinear glasshouse: walls of the ring to the eave, then a roof whose
 * rings shrink toward the ring's centre (x and y by the same distance, so a
 * long plan ends in a ridge) along a quarter ellipse. Returns the levels so
 * frames can follow the roof.
 */
type Level = { ring: XY[]; z: number }
function glasshouse(glass: Part, trim: Part, ring0: XY[], eave: number, top: number, o: { base?: number; ridge?: number; steps?: number; mullion?: number; sill?: Part; z0?: number } = {}) {
  const Z = o.z0 ?? 0
  const ring = ccw(ring0)
  const xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1])
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2
  const hx = (Math.max(...xs) - Math.min(...xs)) / 2, hy = (Math.max(...ys) - Math.min(...ys)) / 2
  const ridge = o.ridge ?? 0.35, steps = o.steps ?? 6, base = o.base ?? 0.7
  const D = Math.min(hx, hy) - ridge
  const levels: Level[] = []
  for (let k = 0; k <= steps; k++) {
    const t = (k / steps) * Math.PI / 2
    const d = D * (1 - Math.cos(t)), z = Z + eave + (top - eave) * Math.sin(t)
    // inset by d on both axes: points on a long side keep their place along it
    const sh = (v: number, h: number) => Math.sign(v) * Math.max(Math.abs(v) - d * Math.min(1, Math.abs(v) / Math.max(h - D, 1e-3)), Math.min(Math.abs(v), h - D))
    levels.push({ ring: ring.map(([x, y]) => [cx + sh(x - cx, hx), cy + sh(y - cy, hy)] as XY), z })
  }
  // the sill, the glazed walls and the roof
  const sill = o.sill ?? trim
  if (base > 0) walls(sill, ring, Z, Z + base)
  walls(glass, ring, Z + base, Z + eave)
  for (let k = 0; k < steps; k++) walls(glass, levels[k].ring, levels[k].z, levels[k + 1].z, levels[k + 1].ring)
  cap(glass, levels[steps].ring, levels[steps].z)
  // the eave band, a little proud
  const out = (r: XY[], d: number) => r.map(([x, y]) => [cx + (x - cx) * (1 + d / hx), cy + (y - cy) * (1 + d / hy)] as XY)
  walls(trim, out(ring, 0.06), Z + eave - 0.3, Z + eave + 0.05)
  // mullions: white bars up the walls and over the roof, every `mullion` metres
  const step = o.mullion ?? 0
  if (step > 0) for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.round(L / step)
    if (n < 2) continue
    for (let q = 1; q < n; q++) frameBar(trim, levels, i, q / n, Z + base, 0.09)
  }
  return levels
}

/** A white bar up the wall and over the roof at fraction f along edge i of every level. */
function frameBar(p: Part, levels: Level[], i: number, f: number, base: number, w: number) {
  const at = (lv: Level): XY => {
    const r = lv.ring, a = r[i], b = r[(i + 1) % r.length]
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
  }
  const r0 = levels[0].ring, a = r0[i], b = r0[(i + 1) % r0.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const pts: V3[] = [[...at(levels[0]), base] as V3, ...levels.map((lv) => [...at(lv), lv.z] as V3)]
  for (let k = 0; k < pts.length - 1; k++) {
    const A = pts[k], B = pts[k + 1]
    // push the bar out along the wall's normal and, on the roof, up a little
    const off = (P: V3, kk: number): V3 => [P[0] + n[0] * 0.07, P[1] + n[1] * 0.07, P[2] + (kk > 1 ? 0.05 : 0)]
    const A2 = off(A, k), B2 = off(B, k + 1)
    p.quad([A2[0] - u[0] * w, A2[1] - u[1] * w, A2[2]], [A2[0] + u[0] * w, A2[1] + u[1] * w, A2[2]], [B2[0] + u[0] * w, B2[1] + u[1] * w, B2[2]], [B2[0] - u[0] * w, B2[1] - u[1] * w, B2[2]])
  }
}

/** A rib strip lying on a lathed surface at azimuth a (degrees), from a (r, z) profile. */
function rib(p: Part, cx: number, cy: number, prof: XY[], a: number, w: number, lift = 0.07) {
  const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180)
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const L = Math.hypot(r1 - r0, z1 - z0) || 1, nr = (z1 - z0) / L, nz = -(r1 - r0) / L
    const P = (r: number, z: number, side: number): V3 => {
      const rr = r + nr * lift, zz = z + nz * lift
      return [cx + rr * c - s * side * w, cy + rr * s + c * side * w, zz]
    }
    p.quad(P(r0, z0, -1), P(r0, z0, 1), P(r1, z1, 1), P(r1, z1, -1))
  }
}

// ---------------------------------------------------------------- the model

function build() {
  const glass = new Part(), trim = new Part(), stone = new Part(), door = new Part()

  // ------------------------------------------------ the Palm House
  const CX = -2.5, CY = 0.2, R = 11.0, DRUM = 7.2, SEG = 20
  const drum = circle(CX, CY, R, SEG, Math.PI / SEG)
  walls(stone, drum, 0, 0.9)
  walls(glass, drum, 0.9, DRUM - 0.5)
  // cornice band at the drum top, a little proud
  const drumOut = circle(CX, CY, R + 0.18, SEG, Math.PI / SEG)
  walls(trim, drumOut, DRUM - 0.6, DRUM)
  cap(trim, drumOut, DRUM)
  // mullions on the drum, one per facet corner and one mid-facet
  for (let i = 0; i < SEG * 2; i++) {
    const a = ((i + 0.5) / (SEG * 2)) * 2 * Math.PI + (i % 2 ? 0 : 0)
    const t = (i / (SEG * 2)) * 2 * Math.PI + Math.PI / SEG
    const rr = i % 2 ? R * Math.cos(Math.PI / SEG) + 0.06 : R + 0.06
    const w = 0.12, c = Math.cos(t), s = Math.sin(t)
    void a
    trim.quad([CX + rr * c + s * w, CY + rr * s - c * w, 0.9], [CX + rr * c - s * w, CY + rr * s + c * w, 0.9], [CX + rr * c - s * w, CY + rr * s + c * w, DRUM - 0.6], [CX + rr * c + s * w, CY + rr * s - c * w, DRUM - 0.6])
  }
  // a frame band halfway up the drum
  walls(trim, circle(CX, CY, R + 0.08, SEG, Math.PI / SEG), 3.6, 3.85)
  // the dome: a quarter ellipse from the drum to the crown
  const DR = R - 0.15, CROWN = 18.2, DOME: XY[] = []
  for (let k = 0; k <= 9; k++) {
    const t = (k / 9) * Math.PI / 2
    const r = DR * Math.cos(t), z = DRUM + (CROWN - DRUM) * Math.sin(t)
    if (r < 3.2) { DOME.push([3.2, DRUM + (CROWN - DRUM) * Math.sqrt(1 - (3.2 / DR) ** 2)]); break }
    DOME.push([r, z])
  }
  lathe(glass, CX, CY, DOME as [number, number][], 24)
  for (let k = 0; k < 20; k++) rib(trim, CX, CY, DOME, (k * 360) / 20 + 9, 0.16)
  // two rings round the dome
  for (const kk of [3, 6]) {
    const [r, z] = DOME[kk]
    lathe(trim, CX, CY, [[r + 0.12, z - 0.18], [r + 0.12, z + 0.18]], 24)
  }
  // the lantern: a glazed drum, a trim ring, a conical cap and the spike
  const LB = DOME[DOME.length - 1][1]
  lathe(trim, CX, CY, [[3.4, LB - 0.2], [3.4, LB + 0.35]], 16)
  lathe(glass, CX, CY, [[3.1, LB + 0.35], [3.1, LB + 1.7]], 16)
  lathe(trim, CX, CY, [[3.75, LB + 1.7], [3.75, LB + 2.0]], 16)
  lathe(glass, CX, CY, [[3.75, LB + 2.0], [0.4, CROWN + 2.9], [0.12, CROWN + 3.1]], 16)
  lathe(trim, CX, CY, [[0.14, CROWN + 3.1], [0.05, 25.0], [0.001, 25.05]], 6)
  disc(trim, CX, CY, 3.4, LB - 0.2, 16, false)

  // ------------------------------------------------ the west entrance vestibule
  {
    const r = rect(-19.1, -4.85, -12.0, 5.1)
    walls(stone, r, 0, 0.9)
    walls(glass, r, 0.9, 4.2)
    walls(trim, r.map(([x, y]) => [x < -15 ? x - 0.08 : x, y < 0 ? y - 0.08 : y + 0.08] as XY), 4.2, 4.6)
    cap(glass, rect(-19.1, -4.85, -12.0, 5.1), 4.6)
    for (const y of [-2.5, 0, 2.5]) trim.quad([-19.17, y + 0.12, 0.9], [-19.17, y - 0.12, 0.9], [-19.17, y - 0.12, 4.2], [-19.17, y + 0.12, 4.2])
    // the doors, in a white frame
    trim.quad([-19.15, 1.6, 0], [-19.15, -1.6, 0], [-19.15, -1.6, 3.0], [-19.15, 1.6, 3.0])
    door.quad([-19.2, 1.2, 0], [-19.2, -1.2, 0], [-19.2, -1.2, 2.6], [-19.2, 1.2, 2.6])
  }

  // ------------------------------------------------ the wings and their pavilions
  for (const s of [1, -1]) {
    const Y = (y: number) => s * y
    // the wing, from inside the dome to the pavilion
    glasshouse(glass, trim, rect(-7.3, Math.min(Y(8.0), Y(26.4)), 2.45, Math.max(Y(8.0), Y(26.4))), 3.0, 6.0, { mullion: 2.6, sill: stone })
    // the pavilion
    const pv = rect(-8.8, Math.min(Y(26.0), Y(35.9)), 4.05, Math.max(Y(26.0), Y(35.9)))
    const lv = glasshouse(glass, trim, pv, 4.2, 8.4, { ridge: 1.3, mullion: 2.6, sill: stone })
    // its lantern: a little glazed box with a pyramid cap
    const top = lv[lv.length - 1], cy = Y(30.95)
    const lr = rect(-3.6, cy - 1.6, -1.1, cy + 1.6)
    walls(trim, lr, top.z - 0.1, top.z + 0.25)
    walls(glass, lr, top.z + 0.25, top.z + 1.05)
    const lc = rect(-3.8, cy - 1.8, -0.9, cy + 1.8)
    walls(trim, lc, top.z + 1.05, top.z + 1.25)
    cap(trim, lc, top.z + 1.05, false)
    for (let i = 0; i < 4; i++) {
      const a = lc[i], b = lc[(i + 1) % 4]
      glass.tri([a[0], a[1], top.z + 1.25], [b[0], b[1], top.z + 1.25], [-2.35, cy, top.z + 2.0])
    }
    // the apsidal end, lower, with chamfered corners
    const e0 = 35.9, e1 = 41.2
    const end: XY[] = [[-7.3, Y(e0)], [2.55, Y(e0)], [2.55, Y(38.9)], [0.0, Y(e1)], [-4.85, Y(e1)], [-7.3, Y(38.8)]]
    glasshouse(glass, trim, end, 3.2, 5.3, { ridge: 0.6, mullion: 2.4, sill: stone })
  }

  // ------------------------------------------------ the Show House
  {
    const sh: XY[] = [[9.6, -8.75], [12.0, -11.1], [16.95, -11.1], [19.3, -8.8], [19.3, 8.8], [16.8, 11.18], [12.0, 11.18], [9.6, 8.76]]
    const lv = glasshouse(glass, trim, sh, 3.6, 6.8, { ridge: 1.7, steps: 5, mullion: 2.4, sill: stone })
    // the clerestory monitor along the ridge, with its own curved roof
    const top = lv[lv.length - 1]
    const xs = top.ring.map((p) => p[0]), ys = top.ring.map((p) => p[1])
    const m: XY[] = [[Math.min(...xs) + 0.1, Math.min(...ys) + 1.2], [Math.max(...xs) - 0.1, Math.min(...ys) + 1.2], [Math.max(...xs) - 0.1, Math.max(...ys) - 1.2], [Math.min(...xs) + 0.1, Math.max(...ys) - 1.2]]
    glasshouse(glass, trim, m, 1.2, 2.2, { ridge: 0.3, steps: 3, base: 0.0, z0: top.z - 0.2 })
    // side vestibules (west towards the dome, east towards the aquarium)
    for (const r of [rect(8.6, -4.6, 9.7, 4.95), rect(19.2, -4.85, 21.15, 4.93)]) {
      walls(stone, r, 0, 0.7); walls(glass, r, 0.7, 3.4); cap(trim, r, 3.4)
    }
  }

  return [
    { part: glass, material: finish('glass', 0xa9bccb, 0.24) },
    { part: trim, material: PALETTE.trim },
    { part: stone, material: PALETTE.stone },
    { part: door, material: PALETTE.entrance },
  ]
}

/** A disc cap at height z (up or down). */
function disc(part: Part, cx: number, cy: number, r: number, z: number, segs: number, up = true) {
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * 2 * Math.PI, b = ((i + 1) / segs) * 2 * Math.PI
    const A: V3 = [cx + r * Math.cos(a), cy + r * Math.sin(a), z], B: V3 = [cx + r * Math.cos(b), cy + r * Math.sin(b), z]
    if (up) part.tri([cx, cy, z], A, B); else part.tri([cx, cy, z], B, A)
  }
}

if (import.meta.main) await save('det-belle-isle-conservatory', 'Anna Scripps Whitcomb Conservatory', [42.336255, -82.9855511], 342, build(), 5000)
