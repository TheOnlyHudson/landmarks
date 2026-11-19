/**
 * Detroit Masonic Temple (500 Temple Street, Detroit, 1920-26, George D.
 * Mason): procedural, CC0-1.0.
 * bun generators/det-masonic-temple.ts
 *
 * Map frame: x, y, z up, metres, turned to the building's walls: +y runs
 * along bearing 336.8 (north-north-west, away from Temple Street), +x
 * along 66.8 (east-north-east, along Temple Street towards Cass Avenue).
 * The Temple Street front is the -y face. The anchor is the centroid of the
 * OSM outline way/68995397 (42.3417379, -83.0601393).
 *
 * Identity, in order: the pale limestone ritual tower at the west end, its
 * front a deep central bay between two massive turreted piers, filled by a
 * great pointed arch over four tall window strips, with lower crenellated
 * wings either side; the long theatre wing in the middle with nine tall
 * arched windows and a green-domed turret at each end; the plainer ten-storey
 * east tower at the Cass end; the three arched portals at the tower's foot.
 *
 * Evidence:
 *  - plan: OSM way/68995397 (Detroit Masonic Temple, 14 levels, Q1907270).
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 1 m grid read in
 *    this frame (Temple Street about 1.5 m above the box's ground_min).
 *    Measured, above the street: the ritual tower's core x -48..-30 at 57.5,
 *    its front towers and turrets 60-63, the back turrets 61; its wings
 *    x -62..-48 and -30..-14 at 48-50; the theatre's front range
 *    y -26..-18 at 24.5 and the hall behind at 30.5-31.5; the east tower
 *    x 40..58, y -24..4 at 43-44.5, its front annex (y -30..-24) 24.6 and
 *    its back range 27-29.
 *  - published: 1926, George D. Mason, neo-Gothic, 14-storey ritual tower
 *    (Wikipedia, "Detroit Masonic Temple"; NRHP 80001921).
 *  - photos: the front elevation (bays, windows and their heads, the arch,
 *    turrets, the portals), the theatre's nine windows and the domes, the
 *    east tower's windows; colours: pale grey-buff limestone (`masonic-stone`),
 *    green copper domes (`patina`).
 *  Estimated (from the photos, scaled to the lidar heights): window sizes,
 *  the arch, the turrets' size, the portals.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Detroit_Masonic_Temple.jpg, JJonahJackalope, CC BY-SA 4.0 (the front
 *    from the south, from a height: the whole elevation)
 *  - Detroit_December_2019_16_(Detroit_Masonic_Temple).jpg, Michael Barera,
 *    CC BY-SA 4.0 (from the south-east)
 *  - Masonic_Temple_as_seen_from_Cass_Park,_Detroit_-_20201215.jpg, Andre
 *    Carrotflower, CC BY-SA 4.0 (the tower from the south-west)
 *  - Detroit_Masonic_Temple,_Temple_Street,_Cass_Park,_Midtown,_Detroit,_MI_-_53013593078.jpg
 *    and -_53013586448.jpg, w_lemay, CC0 (the theatre wing; the portals)
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north (back) and west sides are unphotographed here; they are
 * given the same window rhythm, plainer. The tower's carved tracery, the
 * pinnacles on its piers and the arcade under its parapet are left out or
 * drawn as plain blocks. The small north wing (x 0..24, y 28..36) is folded
 * into the hall.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, circle, inset, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, arc, lathe } from './sea-tacoma-union-station'

const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** An equilateral-ish pointed window (k < 1 flattens it): jambs z0..zs, then the head. */
function pointed(sc: number, w: number, z0: number, zs: number, segs = 3): XY[] {
  const h = w / 2
  return [[sc - h, z0], [sc + h, z0], ...arc(sc - h, zs, w, 0, 60, segs), ...arc(sc + h, zs, w, 120, 180, segs).slice(1)]
}
const archR = (sc: number, w: number, z0: number, zs: number, segs = 6): XY[] => [[sc - w / 2, z0], [sc + w / 2, z0], ...arc(sc, zs, w / 2, 0, 180, segs)]
/** A block with a bevelled parapet and its roof. */
function block(stone: Part, roof: Part, r: XY[], z0: number, z1: number, bev = 0.4) {
  walls(stone, r, z0, z1 - bev)
  walls(stone, r, z1 - bev, z1, inset(r, bev))
  cap(roof, inset(r, bev), z1)
}
/** Merlons along the edges of a ring at height z. */
function merlons(stone: Part, r: XY[], z: number, h = 1.3, w = 1.2, pitch = 2.9, t = 0.5) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const k = Math.max(1, Math.floor(L / pitch))
    for (let j = 0; j < k; j++) {
      const s = (L / k) * (j + 0.5)
      const c: XY = [a[0] + u[0] * s - n[0] * t / 2, a[1] + u[1] * s - n[1] * t / 2]
      const q: XY[] = [
        [c[0] - u[0] * w / 2 - n[0] * t / 2, c[1] - u[1] * w / 2 - n[1] * t / 2],
        [c[0] + u[0] * w / 2 - n[0] * t / 2, c[1] + u[1] * w / 2 - n[1] * t / 2],
        [c[0] + u[0] * w / 2 + n[0] * t / 2, c[1] + u[1] * w / 2 + n[1] * t / 2],
        [c[0] - u[0] * w / 2 + n[0] * t / 2, c[1] - u[1] * w / 2 + n[1] * t / 2],
      ]
      const ccw = ((q[1][0] - q[0][0]) * (q[2][1] - q[0][1]) - (q[1][1] - q[0][1]) * (q[2][0] - q[0][0])) > 0 ? q : [...q].reverse()
      walls(stone, ccw, z, z + h); cap(stone, ccw, z + h)
    }
  }
}
/** An octagonal turret from z0 to z1 with a crenellated or domed top. */
function turret(stone: Part, top: Part, cx: number, cy: number, r: number, z0: number, z1: number, kind: 'crenel' | 'dome') {
  const ring = circle(cx, cy, r, 8, Math.PI / 8)
  walls(stone, ring, z0, z1)
  if (kind === 'crenel') {
    const lip = circle(cx, cy, r + 0.3, 8, Math.PI / 8)
    walls(stone, lip, z1 - 1.0, z1 + 0.2)
    cap(stone, lip, z1 + 0.2)
    cap(stone, lip, z1 - 1.0, false)
    for (let k = 0; k < 8; k += 2) {
      const a = Math.PI / 8 + (k * Math.PI) / 4 + Math.PI / 8, c: XY = [cx + (r - 0.1) * Math.cos(a), cy + (r - 0.1) * Math.sin(a)]
      const q = rect(c[0] - 0.45, c[1] - 0.45, c[0] + 0.45, c[1] + 0.45)
      walls(stone, q, z1 + 0.2, z1 + 1.4); cap(stone, q, z1 + 1.4)
    }
  } else {
    const lip = circle(cx, cy, r + 0.25, 8, Math.PI / 8)
    walls(stone, lip, z1, z1 + 0.6); cap(stone, lip, z1 + 0.6); cap(stone, lip, z1, false)
    lathe(top, cx, cy, [[r * 0.95, z1 + 0.6], [r * 0.95, z1 + 1.1], [r * 0.85, z1 + 1.9], [r * 0.55, z1 + 2.6], [r * 0.15, z1 + 3.0], [0.12, z1 + 3.8], [0.01, z1 + 4.1]], 10)
  }
}

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), green = new Part(), trim = new Part(), door = new Part()
  const FY = -25.3 // the Temple Street front of the tower and theatre
  const south: Face = { o: [0, FY, 0], n: [0, -1] } // s = x on this face (t = [1, 0])

  // ---------------------------------------------------------------- the ritual tower
  const CORE = rect(-48, FY, -30, 25.8), WW = rect(-61.9, FY, -48, 25.8), WE = rect(-30, FY, -14, 24.9)
  block(stone, roof, WW, 0, 49.6)
  block(stone, roof, WE, 0, 49.6)
  block(stone, roof, CORE, 0, 57.5)
  merlons(stone, inset(WW, 0.1), 49.6)
  merlons(stone, inset(WE, 0.1), 49.6)
  // the front: the deep bay between two great piers, the piers rising as turreted towers
  for (const x of [-48, -30]) {
    const p = rect(x - 2.6, FY - 0.6, x + 2.6, FY + 6)
    walls(stone, p, 0, 59.8); cap(roof, p, 59.8)
    turret(stone, green, x, FY + 1.6, 2.2, 59.8, 62.4, 'crenel')
  }
  // the back corners of the core
  for (const x of [-46.5, -31.5]) turret(stone, green, x, 23.8, 1.9, 57.5, 61.0, 'crenel')
  merlons(stone, [[-45.4, FY + 0.2], [-32.6, FY + 0.2], [-32.6, 25.6], [-45.4, 25.6]], 57.5)
  // the corner turrets of the wings (octagonal stair turrets up the outer corners)
  for (const [x, y] of [[-61.4, FY + 0.6], [-14.6, FY + 0.6]] as XY[]) turret(stone, green, x, y, 1.5, 0, 52.4, 'crenel')

  // the great pointed arch and its window strips
  {
    // a recessed face: the bay is set back 1.2 m behind the piers
    const bay: Face = { o: [0, FY - 0.02, 0], n: [0, -1] }
    flatShape(trim, bay, pointed(-39, 12.4, 10.5, 41.0, 6), 0.03) // the arch's pale surround
    flatShape(win, bay, pointed(-39, 11.2, 11.2, 41.0, 6), 0.06)
    // stone mullion piers dividing it into four lights, and transoms at the storey groups
    for (const x of [-41.8, -39, -36.2]) flatShape(trim, bay, R(x - 0.35, 11.2, x + 0.35, x === -39 ? 49.5 : 45.5), 0.09)
    for (const z of [22.5, 33.5]) flatShape(trim, bay, R(-44.6, z - 0.5, -33.4, z + 0.5), 0.09)
    flatShape(stone, bay, R(-44.6, 41.8, -33.4, 43.0), 0.1) // the band under the head
  }
  // the wings' front: paired lancets in two bays each, and a small arcade high up
  for (const x0 of [-61.9, -30]) {
    const L = x0 < -40 ? 13.9 : 16, cs = [x0 + L * 0.3, x0 + L * 0.7]
    for (const c of cs) for (const d of [-0.85, 0.85]) {
      flatShape(win, south, pointed(c + d, 1.3, 13, 37.5, 2), 0.05)
      flatShape(win, south, R(c + d - 0.65, 4.5, c + d + 0.65, 11.5), 0.05)
    }
    for (let k = 0; k < 5; k++) flatShape(win, south, archR(x0 + 1.8 + k * (L - 3.6) / 4, 1.0, 42.5, 44.6, 4), 0.05)
  }
  // the three arched portals at the tower's foot, in a pale surround
  for (const x of [-43.2, -39, -34.8]) {
    flatShape(trim, south, pointed(x, 3.9, 0, 5.4, 4), 0.07)
    flatShape(door, south, R(x - 1.3, 0, x + 1.3, 4.0), 0.1)
    flatShape(win, south, pointed(x, 2.6, 4.1, 5.4, 4).slice(0), 0.1)
  }
  // side and back walls of the tower: tall window strips in pairs
  const strips = (f: Face, s0: number, s1: number, n: number, z0: number, z1: number) => {
    for (let k = 0; k < n; k++) {
      const c = s0 + ((k + 0.5) * (s1 - s0)) / n
      for (const d of [-0.8, 0.8]) for (const [a, b] of [[z0, (z0 + z1) / 2 - 0.6], [(z0 + z1) / 2 + 0.6, z1]]) flatShape(win, f, b === z1 ? pointed(c + d, 1.2, a, b - 1.0, 2) : R(c + d - 0.6, a, c + d + 0.6, b), 0.05)
    }
  }
  const west: Face = { o: [-61.9, 0, 0], n: [-1, 0] } // s = -y
  strips(west, -24, 24, 8, 6, 46)
  const back: Face = { o: [0, 25.8, 0], n: [0, 1] } // s = -x
  strips(back, 14.6, 61.4, 8, 6, 46)
  // the core above the wings, east and west faces
  const coreW: Face = { o: [-48, 0, 0], n: [-1, 0] }, coreE: Face = { o: [-30, 0, 0], n: [1, 0] }
  strips(coreW, -18, 18, 5, 50.5, 56)
  strips(coreE, -18, 18, 5, 50.5, 56)
  const wingE: Face = { o: [-14, 0, 0], n: [1, 0] } // s = y; above the theatre hall
  strips(wingE, -20, 22, 6, 32, 47)

  // ---------------------------------------------------------------- the theatre wing
  {
    const front = rect(-14, -25.8, 36, -18)
    block(stone, roof, front, 0, 24.5)
    const hall = rect(-14, -18, 40, 28.3)
    block(stone, roof, hall, 0, 31.0)
    const fz: Face = { o: [0, -25.8, 0], n: [0, -1] }
    // nine tall arched windows between flat piers, with two stone mullions and a transom
    for (let k = 0; k < 9; k++) {
      const c = -14 + 50 * (k + 0.5) / 9
      flatShape(trim, fz, archR(c, 3.4, 7.6, 19.5, 6), 0.03)
      flatShape(win, fz, archR(c, 2.8, 8.0, 19.5, 6), 0.06)
      for (const d of [-0.47, 0.47]) flatShape(trim, fz, R(c + d - 0.09, 8.0, c + d + 0.09, 20.4), 0.09)
      flatShape(trim, fz, R(c - 1.4, 14.2, c + 1.4, 14.5), 0.09)
      // ground floor doors and windows under them
      flatShape(k % 2 ? win : door, fz, R(c - 1.1, 0, c + 1.1, 3.6), 0.06)
    }
    extrudeShape(stone, fz, R(-14, 21.6, 36, 22.6), 0, 0.3) // cornice
    // the attic: a row of small windows along the hall's front over the cornice
    const hz: Face = { o: [0, -18, 0], n: [0, -1] }
    for (let k = 0; k < 16; k++) flatShape(win, hz, R(-12 + k * 3.1, 26.0, -12 + k * 3.1 + 1.5, 28.6), 0.05)
    // domed turrets at both ends
    for (const x of [-13.2, 35.2]) turret(stone, green, x, -25.0, 1.9, 0, 27.6, 'dome')
    // the hall's side windows (west, visible over nothing; east above the east tower's back range)
    const hallE: Face = { o: [40, 0, 0], n: [1, 0] }
    for (let k = 0; k < 6; k++) flatShape(win, hallE, R(5 + k * 3.8, 29.0 - 0.2, 6.6 + k * 3.8, 30.3 - 0.2), 0.05)
    const hallN: Face = { o: [0, 28.3, 0], n: [0, 1] }
    for (let k = 0; k < 8; k++) flatShape(win, hallN, archR(12 - k * 6.5, 2.4, 9, 19, 5), 0.05)
  }

  // ---------------------------------------------------------------- the east tower
  {
    const tw = rect(40, -24, 58.3, 4)
    block(stone, roof, tw, 0, 43.8)
    merlons(stone, inset(tw, 0.1), 43.8, 1.0, 1.2, 2.6)
    const annex = rect(43.2, -30, 58.3, -24)
    block(stone, roof, annex, 0, 24.6)
    const backR = rect(40, 4, 58.3, 27.3)
    block(stone, roof, backR, 0, 28.6)
    const link = rect(36, -25.8, 40, 27.3)
    block(stone, roof, link, 0, 27.0)
    // windows: punched pairs in groups, tall paired lights on the top storeys
    const tf: Face = { o: [0, -24, 0], n: [0, -1] }, ef: Face = { o: [58.3, 0, 0], n: [1, 0] }, af: Face = { o: [0, -30, 0], n: [0, -1] }
    for (const c of [44.5, 49.15, 53.8]) {
      for (const d of [-0.8, 0.8]) {
        flatShape(win, tf, R(c + d - 0.55, 26.5, c + d + 0.55, 31.8), 0.05)
        flatShape(win, tf, pointed(c + d, 1.1, 33.0, 39.5, 2), 0.05)
      }
      for (const d of [-0.8, 0.8]) for (const [a, b] of [[3.8, 9.5], [11.0, 16.6], [18.0, 22.4]]) flatShape(win, af, R(c + d - 0.55, a, c + d + 0.55, b), 0.05)
    }
    for (let k = 0; k < 5; k++) {
      const c = -21 + k * 5.5 // along +y on the east face: s = y
      for (const d of [-0.8, 0.8]) {
        flatShape(win, ef, R(c + d - 0.55, 4, c + d + 0.55, 14), 0.05)
        flatShape(win, ef, R(c + d - 0.55, 15.5, c + d + 0.55, 25.5), 0.05)
        flatShape(win, ef, pointed(c + d, 1.1, 27, 39.5, 2), 0.05)
      }
    }
    for (let k = 0; k < 4; k++) {
      const c = 8 + k * 5
      for (const d of [-0.8, 0.8]) for (const [a, b] of [[4, 12], [14, 25]]) flatShape(win, ef, R(c + d - 0.55, a, c + d + 0.55, b), 0.05)
    }
    flatShape(door, af, R(48.5, 0, 53, 3.4), 0.06)
  }

  return [
    { part: stone, material: finish('masonic-stone', 0xe6dac4) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: green, material: PALETTE.patina },
    { part: trim, material: PALETTE.trim },
    { part: door, material: finish('masonic-door', 0x8a6f55) },
  ]
}

if (import.meta.main) await save('det-masonic-temple', 'Detroit Masonic Temple', [42.3417379, -83.0601393], 336.8, build(), 6500)
