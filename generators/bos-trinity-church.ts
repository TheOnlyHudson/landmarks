/**
 * Trinity Church, Copley Square, Boston (1872–77, H. H. Richardson; west
 * porch and towers 1894–97, Shepley, Rutan & Coolidge) — original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-trinity-church.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 340: the church sits on the Back Bay grid like the
 * Boston Public Library across the square, so x runs down the nave from the
 * west porch on Copley Square (-x) to the apse on Clarendon Street (+x), +y
 * is Boylston Street and -y St. James Avenue (the Hancock Tower's side).
 * Anchor = Nominatim's centre of OSM relation/64066, -71.0754254, 42.3500677,
 * which falls just north-east of the crossing.
 *
 * Identity (from the photos below):
 *  1. The massive square crossing tower: pale granite with red sandstone
 *     bands, two tiers of arched openings, a round turret with a conical cap
 *     at each corner, a gabled dormer with an oculus and a small arcade on
 *     each face, and a steep red clay-tile pyramid with a cross.
 *  2. The west front on Copley Square: a deep porch of three round arches
 *     under gables (the wide middle one higher), the five-light arcade with
 *     the checkered sandstone band and cornice above it, and the two short
 *     west towers with gablets, corner pinnacles and stone spires.
 *  3. The Greek-cross plan: short nave and transepts with steep grey slate
 *     roofs, transept gables with two tall arched windows and a round window.
 *  4. The round apse on Clarendon Street with its ring of arched windows and
 *     its half-cone slate roof.
 *  5. Polychrome: buff-pink Dedham granite walls, red-brown Longmeadow
 *     sandstone trim (arches, bands, cornices, spires, turret caps, porch).
 *
 * Plan: OSM relation/64066 (outer way/29650722 and way/823008375, inner
 * way/29650723, the cloister garth) and its building:part ways, turned to
 * bearing 340 and squared up (OSM's walls run within 1° of the grid):
 * porch x -39.9..-34.6, y -25.6..3.6; west towers x -34.6..-28, y
 * -25.5..-18.9 and -3.1..3.5; nave x -34.6..-15.8, y -19..-3; low aisles
 * x -28..-15.8 outside it; crossing tower x -15.8..0.6, y -19.2..-2.8;
 * transepts to y 8.3 and -28.9; chancel x 0.6..7.6, y -20.6..-1.4; apse
 * radius 9.6 about (7.6, -11); sacristy x 0.6..7.6, y -28.5..-20.6; north
 * chapel x 0.6..12, y -1.4..8.4; cloister walks and garth x 4..27, y 1..29;
 * parish house x 8.5..26.9, y 12.5..29.3 with its bay to 32.1. The crossing
 * tower is drawn square (16.4 m), as published, centred on the nave axis.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid, read
 * with tools/lidar_frame.py; y = 0 is the ground round the church (2.5 above
 * the grid's ground_min; the site is flat, Mapterhorn varies < 1 m).
 * Measured: tower eaves 38.5, pyramid surface to 54 at 1.5 m from the apex
 * (apex drawn 55.5), the cross to 62.2 (published 211 ft / 64 m in OSM);
 * nave and transept eaves 15.2, ridges 23.8; chancel ridge 23.5 and apse
 * eaves 16.5; west towers' walls 25.3, spires to 34 (OSM's 45 is wrong);
 * the west front's cornice 21.2; porch about 9, its middle gable 11.2;
 * low aisles 7.5; north chapel eaves 9.5, ridge 13; cloister walks 6–7.5;
 * parish house eaves 12.5, hip ridge 21.5; sacristy about 10–13.5.
 *
 * Estimated from the photos (Townsend's square-on west front scaled between
 * the porch gable and the lidar cornice; Edgarel and Farragutful for the
 * tower): the porch arches (middle 4.6 m wide to 8.0, sides 3.0 m to 7.0),
 * the arcade (five lights 1.7 m wide, 10–17 m), the checkered band at
 * 18–19.6, the tower windows (two arched lights a face at 25–31, a
 * five-bay belfry arcade at 32–37), the dormers (4.8 m wide, apex 48.5),
 * the corner turrets (radius 2.0 on the corners, cones to 47), the west
 * spires (octagonal, 2.1 m base radius, tip 34.6 against lidar 34.1), the sacristy's
 * round bay (radius 3.7, cone to 14.5), the transept windows and
 * round window, the apse windows, the parish house windows.
 *
 * Ground: flat (Mapterhorn 0.9–1.4 m across the site, lidar ground within
 * 0.5 m); elevation 0. The porch steps are left to the map.
 *
 * Night: the west front, the porch and the crossing tower are floodlit
 * (warm white on the stone, faces looking up barely lit); the stained
 * glass is drawn as `window` and glows faintly. No openly licensed night
 * photo was found; the MIT Libraries' Flickr night views (CC BY-NC, look-only)
 * were looked at but are 1950s and show nothing useful.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Trinity Church, Boston,Mass.jpg, Townsendma30, CC BY-SA 4.0 (west
 *    front, square on) https://commons.wikimedia.org/wiki/File:Trinity_Church,_Boston,Mass.jpg
 *  - Trinity Church Boston.jpg, Choinowski, CC BY-SA 4.0 (west front from
 *    Copley Square) https://commons.wikimedia.org/wiki/File:Trinity_Church_Boston.jpg
 *  - Trinity Church, Boston, Massachusetts - front oblique view.JPG, Daderot,
 *    CC BY-SA 3.0 (from the north-west)
 *    https://commons.wikimedia.org/wiki/File:Trinity_Church,_Boston,_Massachusetts_-_front_oblique_view.JPG
 *  - Trinity Church - Boston 01.jpg, Farragutful, CC BY-SA 4.0 (the apse
 *    and tower from Clarendon St / St. James Ave, south-east)
 *    https://commons.wikimedia.org/wiki/File:Trinity_Church_-_Boston_01.jpg
 *  - Boston - Trinity Church - panoramio.jpg, Edgar El, CC BY 3.0 (north
 *    transept and tower) https://commons.wikimedia.org/wiki/File:Boston_-_Trinity_Church_-_panoramio.jpg
 *  - Trinity Church - Boston, MA - DSC04257.jpg, Daderot, CC0 (west front
 *    upper stages) https://commons.wikimedia.org/wiki/File:Trinity_Church_-_Boston,_MA_-_DSC04257.jpg
 *  - Boston Trinity Church Copley Square 04.jpg, Miguel Hermoso Cuesta,
 *    CC BY-SA 4.0 (west front) https://commons.wikimedia.org/wiki/File:Boston_Trinity_Church_Copley_Square_04.jpg
 *  - 2017 Prudential Skywalk - Trinity Church (ENE).jpg, Beyond My Ken,
 *    CC BY-SA 4.0 (from above, west-south-west: roofs, parish house)
 *    https://commons.wikimedia.org/wiki/File:2017_Prudential_Skywalk_-_Trinity_Church_(ENE).jpg
 *  - Trinitychurch bostn.JPG, Luciof, CC BY-SA 3.0 (from above, west)
 *    https://commons.wikimedia.org/wiki/File:Trinitychurch_bostn.JPG
 * No commercial imagery.
 *
 * Doubts: the north (Boylston St) side of the nave and the parish house are
 * seen only from above and through trees; their windows are drawn plainly.
 * The sacristy's round bay is placed from one photo and the lidar. The
 * cloister arcades, the porch's columns and statues, the carved friezes and
 * the checkered patterns are drawn as plain sandstone bands. The tower's
 * crockets and the dormers' small pinnacles are left out.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, band, box, gableRoof, hipRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { circle, smoothWall } from './atl-flatiron-building'

const granite = new Part(), sand = new Part(), tile = new Part(), slate = new Part(), win = new Part(), door = new Part()

/** A quad or triangle wound to face `n`. */
function faceOut(p: Part, pts: V3[], n: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = g[0] * n[0] + g[1] * n[1] + g[2] * n[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

type F = [XY, XY]
/** The four faces of a box, each run with its outside to the right (onWall's convention). */
const faces = (x0: number, x1: number, y0: number, y1: number) => ({
  W: [[x0, y1], [x0, y0]] as F, E: [[x1, y0], [x1, y1]] as F,
  S: [[x0, y0], [x1, y0]] as F, N: [[x1, y1], [x0, y1]] as F,
})
const flen = (f: F) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
/** A round-headed window: a sandstone arch ring round a slate panel. */
function arched(f: F, s: number, w: number, z0: number, zs: number, ring = 0.35, glass = win) {
  onWall(sand, f[0], f[1], archShape(s, w + 2 * ring, z0 - 0.15, zs, 10), 0.04)
  onWall(glass, f[0], f[1], archShape(s, w, z0, zs, 10), 0.08)
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

const AX = -11.0 // the nave axis

// ── West porch ──
const PX0 = -39.9, PX1 = -34.6, PY0 = -25.6, PY1 = 3.6, PH = 8.6
{
  box(sand, PX0, PX1, PY0, PY1, 0, 5.4, null, 0)
  box(granite, PX0, PX1, PY0, PY1, 5.4, PH - 0.5, null, 0)
  box(sand, PX0 - 0.15, PX1, PY0 - 0.15, PY1 + 0.15, PH - 0.5, PH, slate, 0.15)
  // three gables, the middle one wider and higher
  const gab = (yc: number, w: number, top: number) => {
    gableRoof(slate, granite, PX0 - 0.2, PX1, yc - w / 2, yc + w / 2, PH, top, 'x', 0.25, 0.2)
    // sandstone copings up the rakes
    for (const k of [-1, 1]) {
      const sec = (y: number, z: number): V3[] => [[PX0 - 0.45, y, z], [PX0 + 0.15, y, z], [PX0 + 0.15, y, z - 0.45], [PX0 - 0.45, y, z - 0.45]]
      sand.sweep([sec(yc + k * (w / 2 + 0.25), PH + 0.15), sec(yc, top + 0.3)])
    }
  }
  gab(AX, 9.6, 11.4)
  gab(-21.6, 5.0, 10.4)
  gab(-0.4, 5.0, 10.4)
  const P = faces(PX0, PX1, PY0, PY1)
  // the arches on the front: s runs north to south along the west face
  const sW = (y: number) => PY1 - y
  const portal = (f: F, s: number, w: number, zs: number) => {
    onWall(sand, f[0], f[1], archShape(s, w + 2.0, 0, zs + 0.2, 10), 0.05)
    onWall(door, f[0], f[1], archShape(s, w, 0, zs, 10), 0.1)
  }
  portal(P.W, sW(AX), 4.6, 5.7)
  portal(P.W, sW(-21.6), 3.0, 5.5)
  portal(P.W, sW(-0.4), 3.0, 5.5)
  // and one on each end of the porch
  portal(P.S, flen(P.S) / 2, 2.6, 5.0)
  portal(P.N, flen(P.N) / 2, 2.6, 5.0)
}

// ── Nave, with the west front's screen wall ──
const NX0 = -34.6, NX1 = -15.8, NY0 = AX - 8, NY1 = AX + 8, NE = 15.2, NR = 23.8, WF = 21.2
box(granite, NX0, NX1, NY0, NY1, 0, NE, null, 0)
gableRoof(slate, granite, NX0, NX1, NY0, NY1, NE, NR, 'x', 0.4, 0.2)
// the screen: the front wall carried up to the cornice
box(granite, NX0, NX0 + 1.0, NY0, NY1, NE, WF - 0.6, null, 0)
box(sand, NX0 - 0.3, NX0 + 1.2, NY0, NY1, WF - 0.6, WF, slate, 0.15)
box(sand, NX0 - 0.12, NX0 + 0.5, NY0, NY1, 17.9, 19.6, null, 0) // the checkered band
{
  const W = faces(NX0, NX1, NY0, NY1).W
  // the five-light arcade over the porch: lights 1.7 m wide on 2.25 m centres
  onWall(sand, W[0], W[1], rectShape(8 - 5.95, 8 + 5.95, PH, 16.3), 0.03)
  for (let k = -2; k <= 2; k++) arched(W, 8 + k * 2.25, 1.7, PH + 0.6, 16.3, 0.28)
}

// ── Low aisles either side of the nave ──
for (const [y0, y1] of [[AX - 14.3, NY0], [NY1, AX + 14.3]]) {
  box(granite, -28.0, NX1, y0, y1, 0, 7.5, slate, 0.3)
  const f = faces(-28.0, NX1, y0, y1)
  const out = y0 < AX ? f.S : f.N
  for (const s of [3.5, 8.6]) arched(out, s, 1.3, 2.4, 5.2)
}
// clerestory: two arched lights a side above the aisles
{
  const f = faces(NX0, NX1, NY0, NY1)
  for (const s of [3.4, 8.6]) {
    arched(f.S, flen(f.S) - s, 1.5, 9.0, 12.6)
    arched(f.N, s, 1.5, 9.0, 12.6)
  }
}

// ── West towers ──
for (const yc of [AX - 11.2, AX + 11.2]) {
  const xc = -31.3, h = 3.3, top = 25.3
  box(granite, xc - h, xc + h, yc - h, yc + h, 0, WF - 0.6, null, 0)
  band(sand, rect(xc - h, xc + h, yc - h, yc + h), 17.9, 1.7, 0.08, null)
  band(sand, rect(xc - h, xc + h, yc - h, yc + h), WF - 0.6, 0.6, 0.3)
  band(sand, rect(xc - h, xc + h, yc - h, yc + h), 11.7, 0.5, 0.15)
  // belfry stage
  const b = 2.9
  box(granite, xc - b, xc + b, yc - b, yc + b, WF, top, null, 0)
  const F4 = faces(xc - h, xc + h, yc - h, yc + h), B4 = faces(xc - b, xc + b, yc - b, yc + b)
  // paired arched windows on the west face and the outer side
  const outer = yc < AX ? F4.S : F4.N
  for (const f of [F4.W, outer]) for (const d of [-0.85, 0.85]) arched(f, h + d, 1.05, 12.8, 16.1, 0.22)
  // the belfry's paired openings on every face, a gablet over each face
  for (const f of [B4.W, B4.E, B4.S, B4.N]) for (const d of [-0.65, 0.65]) arched(f, b + d, 0.8, WF + 0.9, 23.6, 0.2, door)
  gableRoof(sand, granite, xc - b, xc + b, yc - 1.6, yc + 1.6, top - 0.4, top + 1.2, 'x', 0.15, 0.15)
  gableRoof(sand, granite, xc - 1.6, xc + 1.6, yc - b, yc + b, top - 0.4, top + 1.2, 'y', 0.15, 0.15)
  // corner pinnacles and the stone spire
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) revolve(sand, [xc + sx * (b - 0.25), yc + sy * (b - 0.25)], [[0.34, top - 0.6], [0.34, top + 0.3], [0, top + 2.4]], 4, Math.PI / 4, true)
  revolve(sand, [xc, yc], [[2.1, top - 0.2], [2.1, top + 0.2], [0, 34.6]], 8, Math.PI / 8, true)
}

// ── Crossing tower ──
const TC: XY = [-7.6, AX], TH = 8.2, TE = 38.5, TAPEX = 55.5
const TX0 = TC[0] - TH, TX1 = TC[0] + TH, TY0 = TC[1] - TH, TY1 = TC[1] + TH
{
  const ring = rect(TX0, TX1, TY0, TY1), T = faces(TX0, TX1, TY0, TY1)
  box(granite, TX0, TX1, TY0, TY1, 0, TE, null, 0)
  band(sand, ring, 24.2, 0.7, 0.15, null)
  band(sand, ring, 31.4, 0.6, 0.15, null)
  band(sand, ring, TE - 0.9, 0.9, 0.35)
  for (const f of [T.W, T.E, T.S, T.N]) {
    // lower stage: two tall paired lights
    for (const d of [-3.4, 3.4]) {
      onWall(sand, f[0], f[1], rectShape(TH + d - 2.0, TH + d + 2.0, 25.1, 31.2), 0.03)
      for (const e of [-0.95, 0.95]) onWall(win, f[0], f[1], archShape(TH + d + e, 1.4, 25.5, 29.9, 8), 0.07)
    }
    // belfry: a wide middle arch between two pairs of narrow ones
    arched(f, TH, 2.6, 32.4, 35.6, 0.35, door)
    for (const d of [-5.0, -3.4, 3.4, 5.0]) arched(f, TH + d, 1.0, 32.8, 36.1, 0.2, door)
  }
  // corner turrets: down to the aisle roofs, conical sandstone caps
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const c: XY = [TC[0] + sx * TH, TC[1] + sy * TH], r = 2.0
    smoothWall(granite, circle(c, r, 12), 7.5, 40.4)
    band(sand, circle(c, r, 12), 24.2, 0.7, 0.12, null)
    band(sand, circle(c, r, 12), 31.4, 0.6, 0.12, null)
    revolve(sand, c, [[r + 0.25, 40.2], [r + 0.25, 40.6], [0, 47.2]], 12, 0, false, true)
  }
  // the red tile pyramid and the cross
  const o = TH + 0.5
  const base: V3[] = [[TX0 - 0.5, TY0 - 0.5, TE], [TX1 + 0.5, TY0 - 0.5, TE], [TX1 + 0.5, TY1 + 0.5, TE], [TX0 - 0.5, TY1 + 0.5, TE]]
  const apex: V3 = [TC[0], TC[1], TAPEX]
  for (let i = 0; i < 4; i++) tile.tri(base[i], base[(i + 1) % 4], apex)
  void o
  revolve(slate, TC, [[0.3, TAPEX - 0.6], [0.3, TAPEX + 1.0], [0.12, TAPEX + 1.3], [0.12, 62.2], [0, 62.4]], 6, 0, true, false)
  box(slate, TC[0] - 0.1, TC[0] + 0.1, TC[1] - 1.1, TC[1] + 1.1, 60.0, 60.4, slate, 0)
  // a gabled dormer on each face: granite gable with an arcade and oculus
  for (const f of [T.W, T.E, T.S, T.N]) {
    const [a, b] = f, L = flen(f), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
    const P = (s: number, d: number, z: number): V3 => [a[0] + t[0] * s + nn[0] * d, a[1] + t[1] * s + nn[1] * d, z]
    const nOut: V3 = [nn[0], nn[1], 0]
    const w = 2.4, s0 = TH - w, s1 = TH + w, z0 = TE - 1.5, ze = 42.5, za = 48.5, D = -5.5
    faceOut(granite, [P(s0, 0.15, z0), P(s1, 0.15, z0), P(s1, 0.15, ze), P(TH, 0.15, za), P(s0, 0.15, ze)], nOut)
    for (const [s, sgn] of [[s0, -1], [s1, 1]] as [number, number][]) faceOut(granite, [P(s, 0.15, z0), P(s, D, z0), P(s, D, ze), P(s, 0.15, ze)], [t[0] * sgn, t[1] * sgn, 0])
    // the dormer's roof, tile, a little overhang
    for (const [s, sgn] of [[s0 - 0.3, -1], [s1 + 0.3, 1]] as [number, number][]) {
      const zs = ze - 0.3 * ((za - ze) / w)
      faceOut(tile, [P(s, 0.45, zs), P(TH, 0.45, za + 0.1), P(TH, D, za + 0.1), P(s, D, zs)], [t[0] * sgn, t[1] * sgn, 1])
    }
    // sandstone copings and string course, the arcade, the oculus
    for (const sgn of [-1, 1]) {
      const sec = (s: number, z: number): V3[] => [P(s, 0.5, z), P(s, 0.5, z - 0.5), P(s, -0.2, z - 0.5), P(s, -0.2, z)]
      sand.sweep([sec(TH + sgn * (w + 0.3), ze), sec(TH, za + 0.25)])
    }
    onWall(sand, a, b, rectShape(s0, s1, 40.6, 41.0), 0.2)
    for (const d of [-1.3, 0, 1.3]) onWall(door, a, b, archShape(TH + d, 0.8, 38.6, 39.9, 8), 0.22)
    const ring = (r: number) => Array.from({ length: 12 }, (_, i) => [TH + r * Math.cos((i / 12) * Math.PI * 2), 44.6 + r * Math.sin((i / 12) * Math.PI * 2)] as [number, number])
    onWall(sand, a, b, ring(0.95), 0.2)
    onWall(win, a, b, ring(0.65), 0.24)
  }
}

// ── Transepts ──
for (const [y0, y1, north] of [[TY1, 8.3, true], [-28.9, TY0, false]] as [number, number, boolean][]) {
  box(granite, TX0, TX1, y0, y1, 0, NE, null, 0)
  gableRoof(slate, granite, TX0, TX1, y0, y1, NE, NR, 'y', 0.4, 0.2)
  const f = faces(TX0, TX1, y0, y1), g = north ? f.N : f.S, L = flen(g)
  // the gable: two tall arched windows under a round window
  for (const d of [-2.3, 2.3]) arched(g, L / 2 + d, 2.0, 4.6, 11.4, 0.4)
  const ring = (r: number, z: number) => Array.from({ length: 16 }, (_, i) => [L / 2 + r * Math.cos((i / 16) * Math.PI * 2), z + r * Math.sin((i / 16) * Math.PI * 2)] as [number, number])
  onWall(sand, g[0], g[1], ring(2.6, 17.4), 0.04)
  onWall(win, g[0], g[1], ring(2.0, 17.4), 0.08)
  onWall(sand, g[0], g[1], rectShape(0.5, L - 0.5, 2.6, 3.3), 0.04)
  // a light on each side wall clear of the aisles
  const sides = [f.W, f.E]
  for (const sw of sides) {
    const Ls = flen(sw), mid = Ls / 2
    arched(sw, mid, 1.5, 7.5, 11.8)
  }
}

// ── Chancel and apse ──
const CX0 = TX1, CX1 = 7.6, CR = 9.6, CE = 16.5, CRID = 23.5
box(granite, CX0, CX1, AX - CR, AX + CR, 0, CE, null, 0)
gableRoof(slate, null, CX0, CX1, AX - CR, AX + CR, CE, CRID, 'x', 0.4, 0)
{
  const n = 10, ring: XY[] = Array.from({ length: n + 1 }, (_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI
    return [CX1 + CR * Math.cos(a), AX + CR * Math.sin(a)] as XY
  })
  const apex: V3 = [CX1, AX, CRID], ov = (p: XY, k: number): XY => [CX1 + (p[0] - CX1) * k, AX + (p[1] - AX) * k]
  const kO = (CR + 0.4) / CR, zO = CE - 0.4 * ((CRID - CE) / CR)
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[i + 1]
    granite.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], CE], [a[0], a[1], CE])
    const A = ov(a, kO), B = ov(b, kO)
    slate.tri([A[0], A[1], zO], [B[0], B[1], zO], apex)
    slate.quad([a[0], a[1], CE], [b[0], b[1], CE], [B[0], B[1], zO], [A[0], A[1], zO])
    // sandstone bands: the sill course and the eaves
    for (const [z, h] of [[8.6, 0.6], [CE - 0.7, 0.7]]) {
      const A2 = ov(a, (CR + 0.14) / CR), B2 = ov(b, (CR + 0.14) / CR)
      sand.quad([A2[0], A2[1], z], [B2[0], B2[1], z], [B2[0], B2[1], z + h], [A2[0], A2[1], z + h])
      sand.quad([a[0], a[1], z + h], [b[0], b[1], z + h], [B2[0], B2[1], z + h], [A2[0], A2[1], z + h])
    }
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (i > 0 && i < n - 1) arched([a, b], L / 2, 1.5, 9.6, 13.6, 0.3)
    if (i > 0 && i < n - 1) onWall(win, a, b, rectShape(L / 2 - 0.5, L / 2 + 0.5, 3.6, 5.6), 0.06)
  }
}

// ── Sacristy south of the chancel ──
// a gabled block against the transept and a round bay with a conical roof
// (Farragutful's photo, left of the apse)
box(granite, CX0, 4.2, -28.5, AX - CR, 0, 9.5, null, 0)
gableRoof(slate, null, CX0, 4.2, -28.5, AX - CR, 9.5, 12.5, 'x', 0.3, 0)
{
  const c: XY = [4.2, -24.6], r = 3.7
  const ring = circle(c, r, 14)
  smoothWall(granite, ring, 0, 9.5)
  band(sand, ring, 3.0, 0.5, 0.1, null)
  revolve(slate, c, [[r + 0.35, 9.2], [r + 0.35, 9.5], [0, 14.5]], 14, 0, false, true)
  for (let i = 0; i < 4; i++) {
    const a0 = -Math.PI / 2 + ((i + 0.5) / 5) * Math.PI, a1 = a0 + 0.35
    const A: XY = [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)], B: XY = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)]
    arched([A, B], 0.65, 0.9, 4.4, 7.4, 0.2)
  }
}

// ── North chapel, cloister walks and parish house ──
box(granite, CX0, 12.0, AX + CR, 8.4, 0, 9.5, null, 0)
gableRoof(slate, granite, CX0, 12.0, AX + CR, 8.4, 9.5, 13.0, 'x', 0.35, 0.2)
box(granite, 8.5, 12.0, 8.4, 12.5, 0, 9.5, slate, 0.3)
{
  const f = faces(CX0, 12.0, AX + CR, 8.4)
  for (const s of [2.4, 5.6]) arched(f.N, flen(f.N) - s, 1.2, 3.2, 6.6)
}
// cloister walks round the garth (x 12..23.7, y 4.7..12.5, left open)
box(granite, 4.2, 8.5, 8.4, 29.2, 0, 5.2, null, 0)
gableRoof(slate, granite, 4.2, 8.5, 8.4, 29.2, 5.2, 7.4, 'y', 0.3, 0.1)
box(granite, 12.0, 27.1, 0.9, 4.7, 0, 5.0, null, 0)
gableRoof(slate, granite, 12.0, 27.1, 0.9, 4.7, 5.0, 7.0, 'x', 0.3, 0.1)
box(granite, 23.7, 27.1, 4.7, 12.5, 0, 5.0, null, 0)
gableRoof(slate, null, 23.7, 27.1, 4.7, 12.5, 5.0, 7.0, 'y', 0.3, 0)
{
  const W = faces(4.2, 8.5, 8.4, 29.2).W
  for (let k = 0; k < 6; k++) arched(W, 1.8 + k * 3.45, 1.4, 0.9, 3.3, 0.25, door)
  const S = faces(12.0, 27.1, 0.9, 4.7).S
  for (let k = 0; k < 5; k++) arched(S, 1.6 + k * 3.0, 1.4, 0.9, 3.2, 0.25, door)
}
{
  const X0 = 8.5, X1 = 26.9, Y0 = 12.5, Y1 = 29.3, E = 12.5
  box(granite, X0, X1, Y0, Y1, 0, E, null, 0)
  hipRoof(slate, X0, X1, Y0, Y1, E, 21.5, 0.4)
  box(granite, 21.7, 26.5, Y1, 32.1, 0, E - 1.5, null, 0)
  hipRoof(slate, 21.7, 26.5, Y1 - 1.0, 32.1, E - 1.5, 15.5, 0.35)
  band(sand, rect(X0, X1, Y0, Y1), 6.6, 0.5, 0.1, null)
  const f = faces(X0, X1, Y0, Y1)
  for (let k = 0; k < 4; k++) {
    for (const z of [[2.6, 4.9], [7.8, 10.2]]) arched(f.N, 1.8 + k * 3.0, 1.3, z[0], z[1], 0.25)
  }
  for (let k = 0; k < 5; k++) for (const z of [[2.6, 4.9], [7.8, 10.2]]) arched(f.E, 6.0 + k * 2.2, 1.2, z[0], z[1], 0.25)
  for (let k = 0; k < 5; k++) arched(f.W, 2.5 + k * 3.0, 1.3, 7.8, 10.2, 0.25)
}

// ── Night: floodlit west front, porch and crossing tower ──
const lit = (p: V3, n: V3) => {
  if (n[2] > 0.7) return 0.15
  const front = p[0] < -27.5, tower = p[0] > TX0 - 2.5 && p[0] < TX1 + 2.5 && p[1] > TY0 - 2.5 && p[1] < TY1 + 2.5 && p[2] > 20
  return front ? 0.85 : tower ? 0.8 : 0
}
await save('bos-trinity-church', 'Trinity Church', [
  { part: granite, material: { ...finish('trinity-granite', 0xc7a58a), floodlight: lit } },
  { part: sand, material: { ...finish('trinity-sandstone', 0x9a5a46), floodlight: lit } },
  { part: tile, material: { ...finish('trinity-tile', 0xc9643f), floodlight: lit } },
  { part: slate, material: finish('trinity-slate', 0x8f99a1) },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('trinity-door', 0x4f3934) },
], { height: 62.4, anchor: [42.3500677, -71.0754254], bearing: 340 }, 6500)
