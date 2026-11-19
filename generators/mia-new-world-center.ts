/**
 * New World Center, Miami Beach (500 17th Street; 2011, Frank Gehry) —
 * original procedural geometry, CC0-1.0.
 * bun generators/mia-new-world-center.ts
 *
 * Map frame: x east, y north (turned to bearing 359, the OSM walls' axis),
 * metres, origin at the anchor on the ground. Anchor = centroid of the OSM
 * outline way/277037894, 25.7916732, -80.1334506. SoundScape Park is to
 * the east (+x), 17th Street to the north.
 *
 * Identity, in order: a plain white box, 92 m long; on its park (east)
 * side the six-storey glass front, through which the white sculptural
 * rehearsal and lobby volumes show, and the curved white shells, convex to
 * the park and stepping down northward, that rise over the roof; the taller
 * white block at the south end over the hall's stage; the plain white
 * projection wall north of the glass (the WALLCAST screen); the wavy
 * entrance canopy with its tumbling white boxes at the north end of the
 * glass; the roof garden's trees.
 *
 * Translucent glass (STYLE.md): seeing the volumes through the glass is
 * the building's identity, so the front and the atrium roof are `glass`,
 * opacity 0.3, double-sided, a clear blue, framed by the white mullion
 * grid; the volumes inside are modelled. Night: the volumes are lit warm
 * (`_FLOODLIGHT`), as the atrium is after dark; the glass itself stays
 * dark.
 *
 * Evidence:
 *  - plan: OSM way/277037894 (only that: way/590186838, which the lead's
 *    note mentions, is a part of the Fillmore 120 m to the north). The
 *    glass front stands ~2.5 m east of the OSM line, at x = 24.4, as the
 *    lidar shows; NAIP (public domain) is offset ~5 m east and was used
 *    only for the atrium's glass roof, the volumes and the trees.
 *  - heights: lidar, USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019
 *    (flown 2019), 1 m grid, above the ground on the west side: main roof
 *    23.2 (parapet 23.8); glass front and atrium roof 25.6; the south
 *    block 25.0 and the tall box over the stage 35.2; the hall's roof
 *    ~28.6; volumes over the roof 31–35; the trees to ~30.
 *  - the sizes and places of the volumes, the canopy and the mullion grid:
 *    estimated from the photos below and the lidar bumps.
 *  - colours: white render, clear glass (photos).
 *
 * Photos:
 *  - Miami_New_World_Center.jpg (Alexf, CC BY-SA 3.0, Commons): the whole
 *    east front from the park
 *  - New World Center By Frank Gehry South Beach (Phillip Pessar, CC BY 2.0,
 *    flickr.com/photos/25955895@N03/32698937694): from the park, the
 *    volumes over the roof and the trees
 *  - New World Center Frank Gehry South Beach and New World Center South
 *    Beach Frank Gehry (Phillip Pessar, CC BY 2.0, flickr 12948466745,
 *    13614320374): the entrance canopy
 *  - New_World_Center_main_entrance_and_lobby.jpg and
 *    New_World_Center_people_watching_wallcast.jpg (Jonathan Schilling,
 *    CC BY-SA 3.0, Commons): canopy and the projection wall at night
 *  - New_World_Center_-_Image01.jpg, _Image02.jpg (miamism, CC BY 2.0,
 *    Commons): the glass front at night
 * No look-only sources. No commercial imagery.
 *
 * Left out: the mullions' finer grid (one bar in three is drawn), the
 * stairs and balconies inside the atrium, the lettering, SoundScape Park's
 * pergolas and projection masts.
 *
 * Doubts: no licensed photo of the west (Drexel Avenue), north (17th
 * Street) or south sides; they are drawn as plain white walls, as the
 * building's other white walls are. Which lidar bumps over the north
 * block are trees and which are volumes is judged from NAIP and the
 * photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, chamfer, inset, panel, rect, save, walls, type XY } from './chi-aon-center'
import { parapet } from './mia-freedom-tower'
import { box, quadF } from './mia-miami-beach-post-office'
import { lathe } from './chi-aon-center'

/** A rounded prism over ring r from z0, its top sloping from zA (west, x min) to zB (east). */
function sail(p: Part, r: XY[], z0: number, zA: number, zB: number) {
  const xs = r.map(q => q[0]), x0 = Math.min(...xs), x1 = Math.max(...xs)
  const zt = (q: XY) => zA + ((q[0] - x0) / (x1 - x0)) * (zB - zA)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zt(b)], [a[0], a[1], zt(a)])
  }
  const c: V3 = [(x0 + x1) / 2, r.reduce((s, q) => s + q[1], 0) / r.length, (zA + zB) / 2 + 0.6]
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.tri([a[0], a[1], zt(a)], [b[0], b[1], zt(b)], c)
  }
}

/**
 * A curved shell, Gehry's sail: a wall `th` thick on an arc of radius r
 * about (cx, cy) from a0 to a1 degrees (counter-clockwise, convex outward),
 * standing from z0 to a crowned top that runs from zA to zB, leaning out
 * by `lean` at the top.
 */
function shell(p: Part, cx: number, cy: number, r: number, a0: number, a1: number, z0: number, zA: number, zB: number, lean = 1.2, th = 0.9, n = 9) {
  const pt = (t: number, rr: number, z: number): V3 => {
    const a = (a0 + (a1 - a0) * t) * Math.PI / 180
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z]
  }
  const top = (t: number) => zA + (zB - zA) * t + 1.6 * Math.sin(Math.PI * t)
  const o = (t: number, z: number) => pt(t, r + lean * ((z - z0) / (top(t) - z0)), z)
  const i = (t: number, z: number) => pt(t, r - th + lean * ((z - z0) / (top(t) - z0)), z)
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n
    const a = (t0 + t1) / 2 * (a1 - a0) + a0, out: V3 = [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180), 0]
    const mid = (z0 + top(t0)) / 2
    for (const [zl, zh] of [[z0, mid], [mid, top(t0)]] as [number, number][]) {
      const zl1 = zl === z0 ? z0 : (z0 + top(t1)) / 2, zh1 = zh === mid ? (z0 + top(t1)) / 2 : top(t1)
      quadF(p, o(t0, zl), o(t1, zl1), o(t1, zh1), o(t0, zh), out)
      quadF(p, i(t0, zl), i(t1, zl1), i(t1, zh1), i(t0, zh), [-out[0], -out[1], 0])
    }
    quadF(p, i(t0, top(t0)), i(t1, top(t1)), o(t1, top(t1)), o(t0, top(t0)), [0, 0, 1])
  }
  const tan = (t: number, sgn: number): V3 => { const a = (a0 + (a1 - a0) * t) * Math.PI / 180; return [-Math.sin(a) * sgn, Math.cos(a) * sgn, 0] }
  const m0 = (z0 + top(0)) / 2, m1 = (z0 + top(1)) / 2
  quadF(p, i(0, z0), o(0, z0), o(0, m0), i(0, m0), tan(0, -Math.sign(a1 - a0)))
  quadF(p, i(0, m0), o(0, m0), o(0, top(0)), i(0, top(0)), tan(0, -Math.sign(a1 - a0)))
  quadF(p, i(1, z0), o(1, z0), o(1, m1), i(1, m1), tan(1, Math.sign(a1 - a0)))
  quadF(p, i(1, m1), o(1, m1), o(1, top(1)), i(1, top(1)), tan(1, Math.sign(a1 - a0)))
}

/** A rounded rectangle ring, counter-clockwise. */
const rrect = (x0: number, y0: number, x1: number, y1: number, rad: number) => chamfer(rect(x0, y0, x1, y1), rad)

function build() {
  const white = new Part(), vol = new Part(), glass = new Part(), roof = new Part(), garden = new Part()

  const W = -21.6, E = 21.8, G = 24.4, S = -46.1, N = 45.7, AS = -32.0, AN = 14.0
  // --- The white box: north block, west bar, south block.
  const north = rect(W, AN, E, N), westBar = rect(W, AS, -15.0, AN), south = rect(W, S, G, AS)
  for (const r of [north, westBar]) { walls(white, r, 0, 23.2); parapet(white, r, 23.2, 23.8, 0.35) }
  cap(roof, inset(north, 0.35), 23.0)
  cap(roof, inset(westBar, 0.35), 23.0)
  walls(white, south, 0, 25.0); parapet(white, south, 25.0, 25.5, 0.35); cap(roof, inset(south, 0.35), 24.8)
  // The tall box over the stage, with its stepped top.
  const stage = rect(-17.0, -46.0, 17.0, -34.5)
  walls(white, stage, 24.8, 35.2); cap(roof, stage, 35.2)
  // The hall between the bars, its east wall seen through the glass.
  const hall = rect(-15.0, AS, 13.0, AN)
  walls(white, hall, 0, 28.6); cap(roof, hall, 28.6)
  // A volume on the hall's roof at the west.
  // Shells over the hall's roof, convex to the park, stepping down northward.
  shell(white, -16.0, -25.0, 9.0, -55, 50, 28.4, 34.6, 31.4, 1.6)
  shell(white, -13.0, -11.0, 8.0, -60, 45, 28.4, 33.0, 30.0, 1.4)
  shell(white, -15.0, 1.0, 8.0, -45, 55, 28.4, 33.4, 31.6, 1.4)

  // --- Atrium: glass front and roof, framed in white.
  const fa: XY = [G, AS], fb: XY = [G, AN]
  const L = AN - AS, TOP = 25.6
  glass.quad([G, AS, 0], [G, AN, 0], [G, AN, TOP], [G, AS, TOP])
  glass.quad([13.0, AS, TOP], [G, AS, TOP], [G, AN, TOP], [13.0, AN, TOP])
  // The north and south ends of the atrium: the blocks' walls already close them
  // (south block to x = 24.4; the north block stops at x = 21.8, so a white return).
  walls(white, [[E, AN], [G, AN], [G, AN + 0.4], [E, AN + 0.4]], 0, TOP)
  // Mullion grid: verticals every ~5.1 m, transoms at the floor groups, the edges.
  for (let k = 0; k <= 9; k++) { const s = (L * k) / 9; panel(white, fa, fb, Math.max(0, s - 0.18), Math.min(L, s + 0.18), 0, TOP, 0.06) }
  for (const z of [0.15, 5.4, 10.4, 15.4, 20.4, TOP - 0.25]) panel(white, fa, fb, 0, L, z - 0.15, z + 0.15, 0.07)
  box(white, fa, fb, -0.2, L + 0.2, -0.3, 0.3, TOP, TOP + 0.6)
  // The glass roof's frame along its west edge.
  box(white, [13.0, AN], [13.0, AS], 0, L, -0.2, 0.4, TOP - 0.3, TOP + 0.3)

  // --- Volumes in the atrium, seen through the glass and rising above it.
  shell(vol, 11.0, -25.0, 9.0, -50, 48, 0, 31.6, 29.0, 1.8, 1.2)
  shell(vol, 11.5, -12.0, 8.0, -55, 45, 0, 29.6, 26.8, 1.6, 1.2)
  sail(vol, rrect(13.6, -4.0, 20.0, 4.5, 2.4), 0, 22.0, 18.5)
  box(vol, [13.0, 7.0], [13.0, 12.5], 0, 5.5, -0.1, 5.0, 0, 14.0) // the lobby's stair tower

  // --- Entrance canopy and its tumbling boxes, at the north end of the glass.
  const cz = 4.8
  const wave: [number, number][] = [[-3.0, 0], [2.0, 0.8], [7.0, -0.2], [12.5, 0.6]]
  for (let k = 0; k < wave.length - 1; k++) {
    const [y0, d0] = wave[k], [y1, d1] = wave[k + 1]
    const A: V3 = [G, y0, cz + d0], B: V3 = [G, y1, cz + d1], C: V3 = [G + 6.5, y1, cz + d1 + 0.4], D: V3 = [G + 6.5, y0, cz + d0 + 0.4]
    quadF(white, A, B, C, D, [0, 0, -1])
    const up = (q: V3): V3 => [q[0], q[1], q[2] + 0.35]
    quadF(white, up(A), up(B), up(C), up(D), [0, 0, 1])
    quadF(white, C, D, up(D), up(C), [1, 0, 0])
  }
  const tilt = (x: number, y: number, z: number, w: number, d: number, h: number, a: number) => {
    const c = Math.cos(a), s = Math.sin(a)
    const P = (u: number, v: number, t: number): V3 => [x + u, y + v * c - t * s, z + v * s + t * c]
    const pts = [[-w, -d, 0], [w, -d, 0], [w, d, 0], [-w, d, 0]].map(([u, v]) => [P(u, v, 0), P(u, v, h)])
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, out: V3 = [((pts[i][0][0] + pts[j][0][0]) / 2) - x, ((pts[i][0][1] + pts[j][0][1]) / 2) - y, 0]
      quadF(white, pts[i][0], pts[j][0], pts[j][1], pts[i][1], out)
    }
    quadF(white, pts[0][1], pts[1][1], pts[2][1], pts[3][1], [0, -s, c])
  }
  tilt(G + 3.0, 13.4, 3.8, 3.0, 1.8, 4.6, 0.35)
  tilt(G + 2.4, 16.4, 6.2, 2.4, 1.5, 3.6, -0.5)

  // --- Roof garden over the north block: lawn and a few trees.
  cap(garden, rect(-13.0, 15.0, 12.0, 32.0), 23.05)
  const trees: [number, number, number][] = [[-10, 18, 2.4], [-4, 22, 2.8], [2, 18, 2.4], [8, 22, 2.6], [-9, 28, 2.4], [-2, 29, 2.6], [5, 28, 2.2], [10, 30, 2.4]]
  for (const [x, y, r] of trees) lathe(garden, x, y, [[0.01, 23.0], [r * 0.8, 24.2 + r * 0.6], [r, 24.6 + r], [r * 0.6, 25.4 + r * 1.6], [0.01, 25.8 + r * 1.8]], 7)

  const lit = (_p: V3, n: V3) => (n[2] > 0.6 ? 0.25 : 0.75)
  return [
    { part: white, material: finish('nwc-white', 0xfbfaf6) },
    { part: vol, material: { ...finish('nwc-volumes', 0xf8f6f0), floodlight: lit } },
    { part: glass, material: { name: 'glass', color: 0x7fc4de, roughness: 0.2, opacity: 0.3, doubleSided: true } },
    { part: roof, material: PALETTE.roof },
    { part: garden, material: finish('nwc-garden', 0x86a37a) },
  ]
}

if (import.meta.main) await save('mia-new-world-center', 'New World Center', [25.7916732, -80.1334506], 359, build(), 5000)
