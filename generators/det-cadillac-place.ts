/**
 * Cadillac Place, the former General Motors Building (3044 West Grand
 * Boulevard, New Center, Detroit, 1919-23, Albert Kahn): procedural, CC0-1.0.
 * bun generators/det-cadillac-place.ts
 *
 * Map frame: x, y, z up, metres, turned to the building's walls: +x runs
 * along bearing 63 (east-north-east, along West Grand Boulevard), +y along
 * 333 (towards the boulevard). The anchor is the centroid of the OSM outline
 * way/545743265 (42.3687983, -83.0754166); the catalog bearing is 333.
 *
 * Identity, in order: the double comb plan, four parallel 15-storey wings
 * crossing a long spine, so that three deep courts open to the boulevard
 * and three to the back; pale grey limestone walls of punched windows,
 * paired on the wing ends; the two-storey colonnade of tall openings under
 * a heavy cornice with green copper cresting on every wing; the two-storey
 * round-arched arcade along the boulevard and the side streets, filling the
 * front courts, with the entrance portico in the middle court.
 *
 * Evidence:
 *  - plan: OSM building:part way/1415650352 (15 levels) is the comb: wings
 *    about 18 m wide and 77.5 m long through the spine, the spine about
 *    17.5 m deep, the ends of the spine standing 1 m proud of the outer
 *    wings. Lidar (below) puts the wings at 18-18.5 m wide on a 45 m pitch
 *    and the whole 154.5 m long, against OSM's 156 m, and about 1.7 m west
 *    of OSM; drawn symmetric about the anchor: wings 18.5 m wide, centres
 *    at x = ±22.6 and ±68.0, ends at ±77.25, spine ±9, wings ±38.8.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid in
 *    this frame. The street around is flat, 3.8-4.1 m over the box's
 *    minimum (a loading pit behind); heights above the street: wing roofs
 *    63.1, their cornice and cresting 64.1; a raised attic over the middle
 *    of the spine 66.8 (x about ±27); mechanical penthouses over the spine
 *    either side 68.8; the courts on both sides filled at 9.4 (two
 *    storeys); a 24 m block closing the middle back court and a 16.5 m
 *    block in the east back court.
 *  - published: 15 storeys, 1923, Albert Kahn, General Motors headquarters
 *    to 1996, now State of Michigan offices (Wikipedia "Cadillac Place";
 *    NRHP 78001518, NHL).
 *  - photos: window rhythm (paired windows in three bays on each wing end,
 *    single windows about 3 m apart on the sides), the colonnade of the
 *    top two storeys and the cornice with its copper cresting, the arcade,
 *    the portico; colours: pale grey limestone (`cadillac-limestone`),
 *    lighter trim, palette copper for the cresting.
 *  Estimated: storey heights (11 storeys of 3.96 m between the arcade's
 *  cornice at 9.4 and the belt under the colonnade at 53), the arch sizes
 *  and spacing, the cornice's depth, from the photos scaled to the lidar.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Detroit_December_2021_08_(Cadillac_Place).jpg, Michael Barera,
 *    CC BY-SA 4.0 (from the west end, West Grand Boulevard and Second Ave)
 *  - Detroit_December_2021_17_(Cadillac_Place).jpg and _18_, Michael
 *    Barera, CC BY-SA 4.0 (the entrance portico in the middle front court)
 *  - Cadillac_Place,_Detroit_-_20201215.jpg, Andre Carrotflower,
 *    CC BY-SA 4.0 (from the east end, along the boulevard)
 *  - General_Motors_building_089833pv.jpg, Historic American Buildings
 *    Survey, 1981, public domain (from the west end)
 *  - CadillacPlaceNewCenterDetroit5.jpg, CadillacPlacefromGrand.jpg,
 *    CadillacPlacefromCassMilwaukeestreets.jpg, Mike Russell, CC BY-SA 3.0
 *  - General_Motors_Building,_New_Center_District,_Detroit,_Mich_(62382).jpg,
 *    Tichnor Brothers postcard, public domain (bird's-eye from the
 *    north-west, showing the comb)
 * USGS NAIP orthophoto (public domain) for the plan and roofs. No
 * commercial imagery.
 *
 * Left out: the 1928 General Motors Research Laboratories along Milwaukee
 * Street behind (way/760809330 with its parts), a separate building joined
 * at the back; the skybridges to the garage and to New Center One; the
 * lettering and clock on the portico.
 *
 * Doubts: the back (south-east) faces of the wings stand about a metre
 * from the laboratories and no photo shows them; they are drawn like the
 * sides. The courts' inner walls are seen only from above in the postcard.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, arc } from './sea-tacoma-union-station'

const WINGS: [number, number][] = [[-77.25, -58.75], [-31.85, -13.35], [13.35, 31.85], [58.75, 77.25]]
const Y = 38.8, S = 9.0, BUMP = 78.25, BY = 8.8
const TOP = 61.0 // top of the wall under the cornice
const BASE = 9.4 // the arcade's cornice and the court fill
const BELT = 53.0 // belt under the colonnade
const ST = (BELT - BASE) / 11 // storeys 3-13

const archR = (sc: number, w: number, z0: number, zs: number, segs = 6): XY[] => [[sc - w / 2, z0], [sc + w / 2, z0], ...arc(sc, zs, w / 2, 0, 180, segs)]
const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]

/** The comb, counter-clockwise. */
function comb(): XY[] {
  const r: XY[] = []
  // the back (south-east): east along y = -Y, dipping to the spine between wings
  WINGS.forEach(([a, b], i) => {
    r.push([a, -Y], [b, -Y])
    if (i < 3) r.push([b, -S], [WINGS[i + 1][0], -S])
  })
  r.push([77.25, -BY], [BUMP, -BY], [BUMP, BY], [77.25, BY])
  ;[...WINGS].reverse().forEach(([a, b], i) => {
    r.push([b, Y], [a, Y])
    if (i < 3) r.push([a, S], [WINGS[2 - i][1], S])
  })
  r.push([-77.25, BY], [-BUMP, BY], [-BUMP, -BY], [-77.25, -BY])
  return r
}

/** A face frame on the ring edge a→b (outward normal to its right). */
function faceOf(a: XY, b: XY): { f: Face; L: number } {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  return { f: { o: [a[0], a[1], 0], n: [u[1], -u[0]] }, L }
}

function build() {
  const lime = new Part(), trim = new Part(), win = new Part(), roof = new Part(), copper = new Part(), door = new Part()
  const ring = comb()

  // ---------------------------------------------------------------- the comb, its cornice and cresting
  walls(lime, ring, 0, TOP)
  const c1 = inset(ring, -0.75)
  walls(trim, ring, TOP, TOP, c1) // soffit
  walls(trim, c1, TOP, TOP + 1.7)
  const c2 = inset(c1, 0.4)
  walls(trim, c1, TOP + 1.7, TOP + 2.3, c2)
  const c3 = inset(c2, 0.4)
  walls(copper, c2, TOP + 2.3, 64.1)
  walls(copper, c2, 64.1, 64.1, c3)
  walls(copper, c3, 64.1, 63.1)
  cap(roof, c3, 63.1)
  // belts: the arcade's cornice and the belt under the colonnade
  for (const [z0, z1, d] of [[BASE - 0.7, BASE, 0.3], [BELT - 0.9, BELT, 0.35]] as [number, number, number][]) {
    const o = inset(ring, -d)
    walls(trim, ring, z0, z0, o); walls(trim, o, z0, z1); walls(trim, o, z1, z1, ring)
  }

  // ---------------------------------------------------------------- over the spine: the central attic and the penthouses
  {
    const a = rect(-27, -8.4, 27, 8.4)
    walls(lime, a, 63.1, 66.4); walls(trim, a, 66.4, 66.8, inset(a, 0.3)); cap(roof, inset(a, 0.3), 66.8)
    for (const s of [-1, 1]) {
      const p = s < 0 ? rect(-64, -7, -37, 7) : rect(37, -7, 64, 7)
      walls(roof, p, 63.1, 68.8); cap(roof, p, 68.8)
    }
  }

  // ---------------------------------------------------------------- windows, colonnade and arcade on every face
  const rows: [number, number][] = [[0, 3], [3, 6], [6, 9], [9, 11]].map(([a, b]) => [BASE + a * ST + 1.25, BASE + b * ST - (b === 11 ? 1.2 : 0.55)])
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const { f, L } = faceOf(a, b)
    if (L < 5) continue
    const n = f.n
    const isEnd = Math.abs(L - 18.5) < 0.1 && Math.abs(n[1]) > 0.9 // a wing end
    const front = n[1] > 0.9 && Math.abs(Math.abs(a[1]) - Y) < 0.1 // a wing end on the boulevard
    const outer = Math.abs(n[0]) > 0.9 && Math.abs(Math.abs(a[0]) - 77.25) < 1.1 // the side-street faces of the end wings
    const court = !isEnd && !outer // walls facing a court, above the court fill
    // the window columns
    let cols: { c: number; w: number }[], slots: { c: number; w: number }[]
    if (isEnd) {
      cols = [-5.6, 0, 5.6].map(d => ({ c: L / 2 + d, w: 3.0 }))
      slots = Array.from({ length: 6 }, (_, k) => ({ c: L / 2 + (k - 2.5) * 2.75, w: 1.95 }))
    } else {
      const end = 1.7, k = Math.max(1, Math.round((L - 2 * end) / 3.0)), p = (L - 2 * end) / k
      cols = Array.from({ length: k }, (_, j) => ({ c: end + p * (j + 0.5), w: 1.2 }))
      slots = cols.map(c => ({ c: c.c, w: p - 0.85 }))
    }
    for (const c of cols) for (const [z0, z1] of rows) flatShape(win, f, R(c.c - c.w / 2, z0, c.c + c.w / 2, z1), 0.05)
    for (const s of slots) flatShape(win, f, R(s.c - s.w / 2, BELT + 0.35, s.c + s.w / 2, TOP - 0.3), 0.05)
    // the arcade: round-arched openings two storeys high on the street faces
    if (front || outer) {
      const arches = isEnd ? cols.map(c => c.c) : (() => {
        const k = Math.max(1, Math.round((L - 2.4) / 4.5)), p = (L - 2.4) / k
        return Array.from({ length: k }, (_, j) => 1.2 + p * (j + 0.5))
      })()
      const w = isEnd ? 3.3 : 2.9
      for (const c of arches) flatShape(win, f, archR(c, w, 0.6, BASE - 1.4 - w / 2, 6), 0.05)
    } else if (!court) {
      // the back ends: plain windows on the two lower storeys
      for (const c of cols) flatShape(win, f, R(c.c - c.w / 2, 1.2, c.c + c.w / 2, BASE - 1.4), 0.05)
    }
  }

  // ---------------------------------------------------------------- the court fill: two storeys, arcaded to the boulevard
  for (let i = 0; i < 3; i++) {
    const x0 = WINGS[i][1], x1 = WINGS[i + 1][0], L = x1 - x0, F = Y - 1.2
    const fr = rect(x0, S, x1, F)
    walls(lime, fr, 0, BASE - 0.7); cap(roof, fr, BASE - 0.7)
    // its cornice and a parapet along the front
    const band = rect(x0, F - 0.6, x1, F + 0.3)
    walls(trim, band, BASE - 0.9, BASE + 0.4); cap(trim, band, BASE + 0.4)
    const f: Face = { o: [x1, F, 0], n: [0, 1] } // s runs west from x1
    const k = 6, p = (L - 1.6) / k
    for (let j = 0; j < k; j++) {
      const c = 0.8 + p * (j + 0.5), w = 2.9, zs = BASE - 1.4 - w / 2
      const portal = i === 1 && j >= 2 && j <= 3
      if (portal) {
        flatShape(door, f, R(c - 1.1, 0.0, c + 1.1, 3.4), 0.12)
        flatShape(win, f, archR(c, w, 3.4, zs, 6), 0.05)
      } else flatShape(win, f, archR(c, w, 0.6, zs, 6), 0.05)
    }
    if (i === 1) {
      // the entrance portico: three wide arches between columns, an attic for the name and clock
      const pr = rect(-8.2, F, 8.2, F + 1.4)
      walls(trim, pr, 0, BASE + 2.4); cap(trim, pr, BASE + 2.4)
      const pf: Face = { o: [8.2, F + 1.4, 0], n: [0, 1] }
      for (const c of [3.0, 8.2, 13.4]) {
        flatShape(door, pf, R(c - 1.2, 0.0, c + 1.2, 3.6), 0.06)
        flatShape(win, pf, archR(c, 3.6, 3.6, 5.6, 6), 0.06)
      }
      // the clock pediment over the attic
      const pc = rect(-2.4, F + 0.2, 2.4, F + 1.2)
      walls(trim, pc, BASE + 2.4, BASE + 3.6); cap(trim, pc, BASE + 3.6)
    }
  }
  // the back courts: filled to the same height, then a service lane
  for (let i = 0; i < 3; i++) {
    const x0 = WINGS[i][1], x1 = WINGS[i + 1][0]
    const br = rect(x0, -28, x1, -S)
    walls(lime, br, 0, BASE - 0.7); cap(roof, br, BASE - 0.7)
  }
  // the 24 m block closing the middle back court, and the 16.5 m block in the east one
  {
    const m = rect(WINGS[1][1], -Y, WINGS[2][0], -28)
    walls(lime, m, 0, 23.6); walls(trim, m, 23.6, 24.0, inset(m, 0.3)); cap(roof, inset(m, 0.3), 24.0)
    const fm: Face = { o: [WINGS[2][0], -28, 0], n: [0, 1] }
    const L = WINGS[2][0] - WINGS[1][1]
    for (let j = 0; j < 7; j++) {
      const c = 1.7 + (L - 3.4) / 7 * (j + 0.5)
      for (const [z0, z1] of [[BASE + 0.9, BASE + 6.6], [BASE + 8.6, 22.6]]) flatShape(win, fm, R(c - 0.7, z0, c + 0.7, z1), 0.05)
    }
    const e = rect(36, -26, 54, -S)
    walls(lime, e, 0, 16.5); cap(roof, e, 16.5)
  }

  return [
    { part: lime, material: finish('cadillac-limestone', 0xe6ddcd) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: PALETTE.copper },
    { part: door, material: finish('cadillac-door', 0x7a6248) },
  ]
}

if (import.meta.main) { const b = build(); console.log(b.map(x => x.material.name + ' ' + x.part.triangles).join(', ')); await save('det-cadillac-place', 'Cadillac Place', [42.3687983, -83.0754166], 333, b, 6500) }
