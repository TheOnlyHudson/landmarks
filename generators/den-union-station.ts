/**
 * Denver Union Station (1881 wings, rebuilt 1894; 1914 Beaux-Arts central
 * hall, Gove & Walsh; "Travel by Train" signs; 2014 train hall canopy,
 * SOM) — original procedural geometry, CC0-1.0.
 *   bun generators/den-union-station.ts
 *
 * Map frame: x, y, z up, metres, turned by bearing 315: +y points north-west
 * (to the tracks and the train hall), +x north-east along the head house;
 * the Wynkoop Street front faces -y (south-east). Anchor -105.00019,
 * 39.75320 (the lead's point; the area centroid of OSM way/25650822 is
 * 2.2 m from it, at -105.000203, 39.753183). y = 0 is grade: the lidar
 * ground is flat to ±0.5 m across the head house and the canopy's
 * platforms. elevation 0.
 *
 * One placement covers the head house and the 2014 train hall canopy
 * north-west of it (and the small barrel canopy, "Union Station Pavilion",
 * that joins them), since they read as one station and OSM maps the
 * canopy as eight building=roof strips that the map would otherwise draw
 * as boxes. `replaces` lists them.
 *
 * Identity (from the photos below):
 *  1. The red neon "UNION STATION" on an arched steel frame over the clock,
 *     and "TRAVEL by TRAIN" on the cornice, on both the Wynkoop front and
 *     the track side. (kim, preble, kim-hall, keybarbara)
 *  2. The light grey 1914 central block: three tall round-arched windows
 *     between two broad piers, attic blocks at the corners, a lower bay on
 *     each side, the clock in a stone arch, a steep grey roof behind.
 *  3. The dark green iron marquee wrapped round the front and both sides of
 *     the central block. (johnson, helebrant)
 *  4. Two long brownish stone wings with hipped slate roofs and dormers,
 *     ending in taller hipped pavilions. (southwing, helebrant, kim-pano)
 *  5. The white ribbed canopy over the tracks: a ring with an oval opening,
 *     arching high at both ends and swooping low along the sides.
 *     (kim-pano, fulton, kim-hall, NAIP)
 *
 * Lettering: STYLE.md's "Famous signs" exception. The letters are traced
 * from kim (straight on, 39.3 px per metre at the facade, calibrated on
 * the lidar's 23.6 m attic): "UNION STATION" on a 17 m radius about a
 * centre 10.05 m up (baseline 27.05 m at the centre, 24.2 m under the end
 * letters, kim and johnson; the radius tightened from 19.2 so the end
 * letters lean about 34 degrees as in kim and miley), caps 1.8 m, stroke
 * 0.44 m (kim: about 0.5 m), letters about 1.3 m wide with 0.3 m gaps, a
 * blocky sans with square-rounded U, O and S (miley shows the forms
 * clearly); the steel frame's arc rails just under and 0.35 m over the
 * letters; "TRAVEL" and "TRAIN" wide sans caps
 * 1.2 m on a 21.7 m baseline, stroke 0.31 m; the script "by" with its
 * looped b and long y tail tucked under the clock. Built with lettering.ts.
 * The same sign stands on the track side (kim-hall, keybarbara).
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, read
 * with tools/lidar_frame.py at bearing 315; local ground 5.5 m above the
 * box's ground_min. Measured: central block attic blocks and tall part
 * 23.4-23.6; lower side bays 19.8; hall roof 26.3-27.6; sign top 28.3-28.9;
 * marquee top 6.6 (OSM: 5.8-6 m, photos 5.8-7.3 incl. cresting); wing
 * eaves 13.3, wing deck roofs 17.0, pavilion ridges 19.5; canopy edge 6.0,
 * end crowns 12-20 (12-13.6 at the very ends, rising to peaks of 20.3 at
 * x -54 and 18.9 at x 66 by the opening's ends), side bands 6-7, the
 * opening x -45.5..57.5, y 46.5..86.5. Plan: OSM way/25650822 and its
 * parts in this frame (central block x -26.3..25.7, y -25..18.9; wings to
 * x -80.6 and 75). Canopy plan from the lidar (OSM's roof strips cover only
 * the ends).
 * Photo-scaled (kim, johnson, at the lidar's scale): great arches 3.9 m
 * wide (kim: 155 px at 39.4 px/m), glass 7.2 to 15.55 (kim 7.6 to 15.6),
 * springing 13.6, on 6.1 m centres, filling the 18 m between the corner
 * piers; arch surrounds 6.0 m, 0.5 m proud; two pale mullions (three
 * lights) and a transom at 11.9 (kim), STYLE's tracery exception; corner
 * piers 7.6 m; clock 1.45 m radius at 23.8 in a 2.35 m stone arch; ground
 * storey openings 2.4-3.6 m to 5.2 m.
 * Estimated: wing window bays (4.6 m; rectangular in both storeys, as in
 * southwing and fulton), dormer count and size, the side windows of the
 * central block, the canopy's ribs (drawn as shading only, below), its
 * columns (placed, not counted), the hall-end oculi.
 * Adjusted from the lidar by the photos: the hall's mansard edge at 25.3
 * (kim, where the lidar's 26.2 band is likely the sign frame). The
 * canopy's crown follows the lidar (an earlier pass raised the ends to
 * 15-16.5 m from kim-pano, but kim-pano is taken close to the SW end, so
 * its height there is perspective; the lidar profile at y 56-76 is used).
 * Materials: six. The hall's steep mansard shares the dark grey-green of
 * the wing slate roofs, the marquee, the sign frame and the clock ring, so
 * the attic blocks stand clear of it from the front as in kim; its low top
 * stays in the stone finish (light grey in NAIP). Side-bay windows: a tall
 * upper pair (11.8-16.6) and a lower pair (8.2-10.7), each split by a
 * stone mullion (helebrant, kim).
 * The canopy is smooth-shaded with a 0.7 m white edge beam round both
 * edges; its transverse ribs are a 0.9 m ripple on 8 m centres sampled at
 * mid-slope, so the vertices stay level and only the normals swing, giving
 * soft light and shade bands like the ribbed vault in kim-pano and NAIP.
 * Left out: carved cartouches, incised "UNION STATION", the marquee's tie
 * rods and cresting, chimneys, the platform pavilions and glass lift boxes
 * inside the canopy's opening (separate OSM parts, not replaced).
 *
 * Photos (evidence, Wikimedia Commons):
 *  kim       "Main Facade of Denver Union Station, December 2014.jpg",
 *            Isaac Kim, CC BY-SA 4.0 (Wynkoop front, straight on)
 *  johnson   "Union Station - Denver, CO (47572332501).jpg", Melissa
 *            Johnson, CC BY 2.0 (front, straight on)
 *  stokes    "Denver Union Sta(45) - 54486678662.jpg", Michael Stokes,
 *            CC BY 2.0 (front)
 *  believer  "Denver, Colorado (2025) - 03.jpg", Another Believer,
 *            CC BY-SA 4.0 (front, straight on)
 *  helebrant "2015-10-10 13-47-19 USA Denver P JH - 53385032733.jpg", Jan
 *            Helebrant, CC0 (from the south: the Wynkoop front and the
 *            sunlit SW side of the central block, early afternoon)
 *  southwing "South wing PC230154.JPG", Chris Light, CC BY-SA 4.0 (SW wing)
 *  preble    "Travel by Train (Unsplash).jpg", Andrew Preble, CC0 (the sign)
 *  kim-pano  "Denver Union Station Panorama, July 2014.jpg", Isaac Kim,
 *            CC BY-SA 4.0 (canopy and track side)
 *  kim-hall  "Denver Union Station Train Hall.jpg", Isaac Kim, CC BY-SA 3.0
 *  keybarbara "Railroad Tracks Denver Union Station.jpg", Keybarbara,
 *            CC BY-SA 4.0 (track-side sign)
 *  fulton    "Denver Union Station and trainshed, October 2018.jpg", Charles
 *            Fulton, CC BY 2.0 (canopy from the NE footbridge)
 *  dawn      "Denver Union Station at dawn.jpg", Kcorless, CC BY-SA 4.0
 *            (night lighting)
 *  miley     "Denver's Union Station.jpg", H. Michael Miley, CC BY-SA 2.0
 *            (the neon at night)
 *  NAIP      USGS NAIP orthophoto (public domain), plan of the canopy.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the track-side sign is assumed to match the front one exactly;
 * the canopy is a smooth fitted surface (edge 6 m, parabola across the
 * tracks to a crown that varies along them), not its real sail panels;
 * wing window bays are generic; the hall roof is simplified to a steep
 * mansard and a low hip; the mansard is darker than the real mid-grey
 * metal (kim) and kim-pano shows it lighter still; the canopy's fabric panels,
 * fanning struts and tree columns are left out.
 * Terrain (bun tools/terrain.ts check, bearing 315): the site is flat to
 * 0.5 m except the bus-concourse ramp at the NE end between the wing and
 * the canopy, about 4 m down; the drape handles it and the check is ok.
 *
 * Night (dawn, miley): the neon letters glow red; the clock face, central
 * block and canopy are floodlit; the arched windows and ground storey
 * glow; the wings are only faintly lit.
 */
import { Part, type V3, sub, cross } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, type Pt, type StrokeOptions } from './lettering'
import { archShape, box, ccw, cornice, band, hipRoof, onWall, prism, rectShape, save, split, type XY } from './atl-tech-tower'

const stone = new Part(), wing = new Part(), dark = new Part(), win = new Part(), neon = new Part(), white = new Part()

// ── helpers ──
/**
 * lettering.ts's `strokes`, written to weld: faces carry no UVs, the front
 * of a stroke shares its vertices along the path, and the sides of a curve
 * are smooth-shaded (corners too: the sides are only 0.4 m deep), so a sign costs about half the bytes. Same geometry.
 */
function strokes(part: Part, paths: Pt[][], o: StrokeOptions) {
  const h = o.width / 2
  const u2 = (v: Pt): Pt => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
  const O = o.place(0, 0, 0)
  const dir = (q: Pt, w = 0): V3 => sub(o.place(q[0], q[1], w), O)
  const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
  const front = unit(dir([0, 0], 1))
  for (const raw of paths) {
    const pts = raw.filter((q, i) => i === 0 || Math.hypot(q[0] - raw[i - 1][0], q[1] - raw[i - 1][1]) > 1e-6)
    if (pts.length < 2) continue
    const closed = pts.length > 2 && Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 1e-6
    const ring = closed ? pts.slice(0, -1) : pts, n = ring.length
    const L: Pt[] = [], R: Pt[] = [], NL: V3[] = [], sharp: boolean[] = []
    for (let i = 0; i < n; i++) {
      const prev = closed ? ring[(i + n - 1) % n] : ring[Math.max(0, i - 1)], next = closed ? ring[(i + 1) % n] : ring[Math.min(n - 1, i + 1)]
      const d0 = u2(i === 0 && !closed ? [next[0] - ring[i][0], next[1] - ring[i][1]] : [ring[i][0] - prev[0], ring[i][1] - prev[1]])
      const d1 = u2(i === n - 1 && !closed ? [ring[i][0] - prev[0], ring[i][1] - prev[1]] : [next[0] - ring[i][0], next[1] - ring[i][1]])
      const t = u2([d0[0] + d1[0], d0[1] + d1[1]]), nl: Pt = [-t[1], t[0]]
      const k = Math.min(2, 1 / Math.max(0.5, nl[0] * -d0[1] + nl[1] * d0[0]))
      L.push([ring[i][0] + nl[0] * h * k, ring[i][1] + nl[1] * h * k]); R.push([ring[i][0] - nl[0] * h * k, ring[i][1] - nl[1] * h * k])
      NL.push(unit(dir(nl))); sharp.push(false) // sides smooth even at corners: 0.4 m deep, it welds
    }
    const P = (q: Pt, w: number) => o.place(q[0], q[1], w)
    const segs = closed ? n : n - 1
    for (let i = 0; i < segs; i++) {
      const j = (i + 1) % n
      const a = P(R[i], o.depth), b = P(R[j], o.depth), c = P(L[j], o.depth), d = P(L[i], o.depth)
      const ff = [front, front, front]
      const g = cross(sub(b, a), sub(c, a))
      if (g[0] * front[0] + g[1] * front[1] + g[2] * front[2] >= 0) { part.tri(a, b, c, undefined, undefined, undefined, ff); part.tri(a, c, d, undefined, undefined, undefined, ff) }
      else { part.tri(a, c, b, undefined, undefined, undefined, ff); part.tri(a, d, c, undefined, undefined, undefined, ff) }
      const segN = unit(dir([(L[i][0] + L[j][0]) / 2 - (R[i][0] + R[j][0]) / 2, (L[i][1] + L[j][1]) / 2 - (R[i][1] + R[j][1]) / 2]))
      for (const [side, sg] of [[L, 1], [R, -1]] as [Pt[], number][]) {
        const ni: V3 = sharp[i] ? segN : NL[i], nj: V3 = sharp[j] ? segN : NL[j]
        const Ni: V3 = [ni[0] * sg, ni[1] * sg, ni[2] * sg], Nj: V3 = [nj[0] * sg, nj[1] * sg, nj[2] * sg]
        const A = P(side[i], 0), B = P(side[j], 0), C = P(side[j], o.depth), D = P(side[i], o.depth)
        part.tri(A, B, C, undefined, undefined, undefined, [Ni, Nj, Nj]); part.tri(A, C, D, undefined, undefined, undefined, [Ni, Nj, Ni])
      }
    }
    if (!closed) for (const [i, k] of [[0, 1], [n - 1, n - 2]]) {
      const e = unit(dir([ring[i][0] - ring[k][0], ring[i][1] - ring[k][1]]))
      facing(part, [P(L[i], 0), P(R[i], 0), P(R[i], o.depth), P(L[i], o.depth)], e)
    }
  }
}

function facing(p: Part, pts: V3[], want: V3) {
  const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const ok = n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0
  const q = ok ? pts : [...pts].reverse()
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
type Face = { a: XY; b: XY }
const fpt = (f: Face, s: number, z: number, d = 0): V3 => {
  const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]), t = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L]
  return [f.a[0] + t[0] * s + t[1] * d, f.a[1] + t[1] * s - t[0] * d, z]
}
const fnorm = (f: Face): V3 => { const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]); return [(f.b[1] - f.a[1]) / L, -(f.b[0] - f.a[0]) / L, 0] }
/** A convex (s, z) shape standing `d` metres proud of a face, with its sides. */
function proud(p: Part, f: Face, pts: [number, number][], d: number, sides = true) {
  const n = fnorm(f)
  facing(p, pts.map(([s, z]) => fpt(f, s, z, d)), n)
  if (!sides) return
  const c = pts.reduce((a, q) => [a[0] + q[0] / pts.length, a[1] + q[1] / pts.length], [0, 0])
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    const m = [(A[0] + B[0]) / 2 - c[0], (A[1] + B[1]) / 2 - c[1]]
    const P0 = fpt(f, A[0], A[1], 0), P1 = fpt(f, B[0], B[1], 0)
    const out: V3 = sub(fpt(f, c[0] + m[0], c[1] + m[1]), fpt(f, c[0], c[1]))
    facing(p, [P0, P1, fpt(f, B[0], B[1], d), fpt(f, A[0], A[1], d)], out)
  }
}
/** A semicircular band (voussoirs) on a face: outer face and outer rim. */
function archRing(p: Part, f: Face, sc: number, zs: number, r0: number, r1: number, d: number, seg = 8) {
  const n = fnorm(f)
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI, a1 = ((i + 1) / seg) * Math.PI
    const P = (r: number, a: number, dd: number) => fpt(f, sc + r * Math.cos(a), zs + r * Math.sin(a), dd)
    facing(p, [P(r0, a0, d), P(r1, a0, d), P(r1, a1, d), P(r0, a1, d)], n)
    const am = (a0 + a1) / 2
    facing(p, [P(r1, a0, 0), P(r1, a1, 0), P(r1, a1, d), P(r1, a0, d)], sub(fpt(f, sc + Math.cos(am), zs + Math.sin(am)), fpt(f, sc, zs)))
  }
  // jambs below the springing
  for (const s of [sc - (r0 + r1) / 2, sc + (r0 + r1) / 2]) proud(p, f, rectShape(s - (r1 - r0) / 2, s + (r1 - r0) / 2, zs - 6.4, zs), d)
}
/** A dormer on a roof slope: its face on line `f` at s, standing from z0. */
function dormer(f: Face, s: number, z0: number) {
  const n = fnorm(f), o = fpt(f, s, 0, 0)
  const back: XY = [o[0] - n[0] * 3.2, o[1] - n[1] * 3.2]
  const t: XY = [-n[1], n[0]]
  const c = (u: number, v: number): XY => [o[0] + t[0] * u + n[0] * v, o[1] + t[1] * u + n[1] * v]
  prism(dark, ccw([c(-1.2, 0), c(1.2, 0), c(1.2, -3.2), c(-1.2, -3.2)]), z0, 16.0, null, 0)
  const xs = [c(-1.2, 0)[0], c(1.2, -3.2)[0]], ys = [c(-1.2, 0)[1], c(1.2, -3.2)[1]]
  void back
  hipRoof(dark, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), 16.0, 17.0, 0.25)
  const df: Face = { a: c(-1.2, 0), b: c(1.2, 0) }
  const dfn = fnorm(df)
  const ff = dfn[0] * n[0] + dfn[1] * n[1] > 0 ? df : { a: df.b, b: df.a }
  onWall(win, ff.a, ff.b, rectShape(0.55, 1.85, 14.5, 15.6), 0.05)
}

// ── central block (1914) ──
const FY = -25.0, BY = 18.9, CX = -0.3, YC = (FY + BY) / 2
const X0 = -26.3, X1 = 25.7
const front: Face = { a: [X0, FY], b: [X1, FY] }, backF: Face = { a: [X1, BY], b: [X0, BY] }
const sU = (u: number) => u + 26 // s along either long face for a symmetric u

// lower side bays to 19.8, the tall part to the cornice at 21.5
for (const [u0, u1] of [[-26, -17], [17, 26]]) {
  const r = ccw([[CX + u0, FY], [CX + u1, FY], [CX + u1, BY], [CX + u0, BY]] as XY[])
  prism(stone, r, 0, 19.8, stone, 0.3)
  cornice(stone, [[CX + u0, FY], [CX + u1, FY], [CX + u1, BY], [CX + u0, BY]] as XY[], 18.2, 0.8, 0.45, stone)
}
const tall: XY[] = [[CX - 17, FY], [CX + 17, FY], [CX + 17, BY], [CX - 17, BY]]
prism(stone, ccw(tall), 0, 21.5, stone, 0.2)
cornice(stone, tall, 20.3, 1.0, 0.7, stone)
// the corner piers and their attic blocks rise to 23.4, the full depth
for (const s of [-1, 1]) {
  const u0 = s < 0 ? -17 : 9.4, u1 = s < 0 ? -9.4 : 17
  box(stone, CX + u0, CX + u1, FY, BY, 21.3, 23.4, stone, 0.35)
  cornice(stone, [[CX + u0, FY], [CX + u1, FY], [CX + u1, BY], [CX + u0, BY]] as XY[], 22.7, 0.5, 0.3, stone)
}
// the great hall: steep grey mansard behind the cornice, low hip on top
{
  const hx0 = CX - 11.2, hx1 = CX + 11.2, hy0 = FY + 0.8, hy1 = BY - 0.8
  const o: XY[] = [[hx0, hy0], [hx1, hy0], [hx1, hy1], [hx0, hy1]]
  const i: XY[] = [[hx0 + 1, hy0 + 1], [hx1 - 1, hy0 + 1], [hx1 - 1, hy1 - 1], [hx0 + 1, hy1 - 1]]
  dark.loft([o.map(([x, y]) => [x, y, 21.4] as V3), i.map(([x, y]) => [x, y, 25.3] as V3)])
  hipRoof(stone, hx0 + 1, hx1 - 1, hy0 + 1, hy1 - 1, 25.3, 27.6, 0)
  // the round oculus at each end of the hall roof
  for (const s of [-1, 1]) {
    const xf = s > 0 ? hx1 - 0.2 : hx0 + 0.2
    const f: Face = s > 0 ? { a: [xf, YC - 3], b: [xf, YC + 3] } : { a: [xf, YC + 3], b: [xf, YC - 3] }
    const circ = (r: number, n = 12): [number, number][] => Array.from({ length: n }, (_, k) => [3 + r * Math.cos((k / n) * 2 * Math.PI), 24.9 + r * Math.sin((k / n) * 2 * Math.PI)])
    proud(stone, f, circ(1.7), 1.1)
    proud(win, f, circ(0.95), 1.16, false)
  }
}

// facade openings on the front and the track side
for (const f of [front, backF]) {
  // three great arched windows, their rusticated surrounds, the piers' panels
  for (const u of [-6.1, 0, 6.1]) {
    onWall(win, f.a, f.b, archShape(sU(u), 3.9, 7.2, 13.6, 10), 0.06)
    archRing(stone, f, sU(u), 13.6, 1.95, 3.0, 0.5)
    // tracery (STYLE's exception): two mullions into three lights, a transom
    for (const m of [-0.65, 0.65]) onWall(stone, f.a, f.b, rectShape(sU(u) + m - 0.1, sU(u) + m + 0.1, 7.2, 15.2), 0.1)
    onWall(stone, f.a, f.b, rectShape(sU(u) - 1.95, sU(u) + 1.95, 11.8, 12.05), 0.1)
  }
  for (const u of [-13.2, 13.2]) proud(stone, f, rectShape(sU(u) - 1.6, sU(u) + 1.6, 9.6, 19.6), 0.25)
  // lower side bays: two framed windows each
  for (const u of [-21.6, 21.6]) {
    for (const [z0, z1] of [[8.2, 10.7], [11.8, 16.6]]) {
      proud(stone, f, rectShape(sU(u) - 1.45, sU(u) + 1.45, z0 - 0.35, z1 + 0.35), 0.15)
      onWall(win, f.a, f.b, rectShape(sU(u) - 1.1, sU(u) + 1.1, z0, z1), 0.21)
      onWall(stone, f.a, f.b, rectShape(sU(u) - 0.1, sU(u) + 0.1, z0, z1), 0.25) // the pair's mullion
    }
  }
  // ground storey: arched doors and windows
  for (const u of [-21.4, -6.1, 0, 6.1, 21.4]) onWall(win, f.a, f.b, archShape(sU(u), 2.4, 1.5, 4.0, 6), 0.06)
  for (const u of [-14.4, 14.4]) onWall(win, f.a, f.b, archShape(sU(u), 3.6, 0, 3.4, 6), 0.06)
}
band(stone, ccw([[X0, FY], [X1, FY], [X1, BY], [X0, BY]]), 0.9, 0.35, 0.12, stone)
band(stone, ccw([[X0, FY], [X1, FY], [X1, BY], [X0, BY]]), 6.2, 0.5, 0.15, stone)

// the sides of the central block in front of the wings
const sideW: Face = { a: [X0, -3.85], b: [X0, FY] }, sideE: Face = { a: [X1, FY], b: [X1, -3.5] }
for (const f of [sideW, sideE]) {
  for (const s of [3.4, 8.4, 13.4, 18.2]) {
    for (const [z0, z1] of [[8.2, 10.7], [11.8, 16.6]]) {
      onWall(win, f.a, f.b, rectShape(s - 1.1, s + 1.1, z0, z1), 0.06)
      onWall(stone, f.a, f.b, rectShape(s - 0.1, s + 0.1, z0, z1), 0.1)
    }
    onWall(win, f.a, f.b, archShape(s, 2.4, 1.5, 4.0, 6), 0.06)
  }
}

// ── the iron marquee: front and both sides of the central block ──
{
  const ring = ccw([[-39.6, -3.85], [-39.6, -7.5], [-32.2, -7.5], [-32.2, -31.3], [31.2, -31.3], [31.2, -7.2], [37, -7.2], [37, -3.5], [X1, -3.5], [X1, FY], [X0, FY], [X0, -3.85]])
  prism(dark, ring, 5.8, 7.0, dark, 0.25, true)
}

// ── the wings (1881/1894): brown stone, hipped slate roofs, dormers ──
const wings = [
  { x0: -80.6, x1: X0, y0: -3.85, y1: 18.88, pav: [-80.6, -47.8], con: [-55, X0] },
  { x0: X1, x1: 75.0, y0: -3.5, y1: 19.1, pav: [41.9, 75.0], con: [X1, 49] },
]
for (const w of wings) {
  const r: XY[] = [[w.x0, w.y0], [w.x1, w.y0], [w.x1, w.y1], [w.x0, w.y1]]
  prism(wing, ccw(r), 0, 13.3, null, 0)
  band(stone, ccw(r), 6.0, 0.45, 0.12, stone)
  cornice(stone, ccw(r), 12.4, 0.9, 0.5, stone)
  band(stone, ccw(r), 0, 0.9, 0.08, null)
  // pavilion hip roof
  hipRoof(dark, w.pav[0], w.pav[1], w.y0, w.y1, 13.3, 19.5, 0.5)
  // connecting wing: hipped deck roof running along x
  {
    const [cx0, cx1] = w.con, ya = w.y0 - 0.5, yb = w.y1 + 0.5
    const prof: [number, number][] = [[ya, 13.0], [w.y0 + 7.8, 17.0], [w.y1 - 6.0, 17.0], [yb, 13.0]]
    for (let k = 0; k < prof.length - 1; k++) {
      const [ya0, za0] = prof[k], [yb0, zb0] = prof[k + 1]
      facing(dark, [[cx0, ya0, za0], [cx1, ya0, za0], [cx1, yb0, zb0], [cx0, yb0, zb0]], [0, 0, 1])
    }
    facing(dark, [[cx0, ya, 13], [cx1, ya, 13], [cx1, yb, 13], [cx0, yb, 13]], [0, 0, -1])
    for (const [x, dir] of [[cx0, -1], [cx1, 1]] as [number, number][]) facing(dark, prof.map(([y, z]) => [x, y, z] as V3), [dir, 0, 0])
  }
  // dormers: two per pavilion slope, one per connecting slope
  const pc = (w.pav[0] + w.pav[1]) / 2, cc = w.x0 < 0 ? -37 : 34 // dormer and door centres
  for (const x of [pc - 9, pc, pc + 9, cc]) {
    dormer({ a: [x - 5, w.y0 + 1.7], b: [x + 5, w.y0 + 1.7] }, 5, 13.0)
    dormer({ a: [x + 5, w.y1 - 1.7], b: [x - 5, w.y1 - 1.7] }, 5, 13.0)
  }
  // windows: two storeys of bays, a framed door in each pavilion front
  const faces: Face[] = w.x0 < 0
    ? [{ a: [w.x0, w.y0], b: [w.x1, w.y0] }, { a: [w.x1, w.y1], b: [w.x0, w.y1] }, { a: [w.x0, w.y1], b: [w.x0, w.y0] }]
    : [{ a: [w.x0, w.y0], b: [w.x1, w.y0] }, { a: [w.x1, w.y1], b: [w.x0, w.y1] }, { a: [w.x1, w.y0], b: [w.x1, w.y1] }]
  faces.forEach((f, fi) => {
    const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
    const n = Math.round((L - 3) / 4.6), step = (L - 3) / n
    for (let k = 0; k < n; k++) {
      const s = 1.5 + step * (k + 0.5), p = fpt(f, s, 0)
      if (fi < 2 && p[0] > -32.5 && p[0] < 31.5) continue // behind the central block
      const door = fi === 0 && Math.abs(p[0] - pc) < step / 2
      if (door) {
        proud(stone, f, archShape(s, 3.6, 0, 3.0, 8), 0.12)
        onWall(win, f.a, f.b, archShape(s, 2.4, 0, 3.0, 6), 0.18)
      } else onWall(win, f.a, f.b, rectShape(s - 1.0, s + 1.0, 1.6, 4.3), 0.06)
      onWall(win, f.a, f.b, rectShape(s - 1.05, s + 1.05, 7.4, 10.9), 0.06)
    }
  })
}

// ── the signs, front and track side ──
type Place = (u: number, v: number, w: number) => V3
const H1 = 1.8, R1 = 17, ZC = 10.05, H2 = 1.2, Z2 = 21.7
function glyph(ch: string, k: number, ex = 0): [Pen, number] {
  const p = new Pen()
  switch (ch) {
    case 'U': { const W = 0.64 + ex; p.moveTo([k, 1]).lineTo([k, 0.3]).cubicTo([k, 0.05], [W / 2 - 0.1, k], [W / 2, k], 2).cubicTo([W / 2 + 0.1, k], [W - k, 0.05], [W - k, 0.3], 2).lineTo([W - k, 1]); return [p, W] }
    case 'N': { const W = 0.64 + ex; p.moveTo([k, 0]).lineTo([k, 1 - k * 0.5]).lineTo([W - k, k * 0.5]).lineTo([W - k, 1]); return [p, W] }
    case 'I': p.moveTo([k, 0]).lineTo([k, 1]); return [p, 2 * k]
    case 'O': {
      const W = 0.68 + ex, r = 0.2, a = k, b = W - k, c = k, d = 1 - k
      p.moveTo([a, c + r]).lineTo([a, d - r]).quadTo([a, d], [a + r, d], 2).lineTo([b - r, d]).quadTo([b, d], [b, d - r], 2).lineTo([b, c + r]).quadTo([b, c], [b - r, c], 2).lineTo([a + r, c]).quadTo([a, c], [a, c + r], 2)
      return [p, W]
    }
    case 'S': {
      const W = 0.64 + ex, a = k, b = W - k, r = 0.13
      p.moveTo([b, 0.78]).lineTo([b, 1 - k - r * 0.3]).quadTo([b, 1 - k], [b - r, 1 - k], 2).lineTo([a + r, 1 - k]).quadTo([a, 1 - k], [a, 1 - k - r], 2).lineTo([a, 0.5 + r]).quadTo([a, 0.5], [a + r, 0.5], 2)
        .lineTo([b - r, 0.5]).quadTo([b, 0.5], [b, 0.5 - r], 2).lineTo([b, k + r]).quadTo([b, k], [b - r, k], 2).lineTo([a + r, k]).quadTo([a, k], [a, k + r * 0.3], 2).lineTo([a, 0.22])
      return [p, W]
    }
    case 'T': { const W = ex > 0 ? 0.74 : k > 0.12 ? 0.86 : 0.66; p.moveTo([0, 1 - k]).lineTo([W, 1 - k]); p.moveTo([W / 2, 1 - k]).lineTo([W / 2, 0]); return [p, W] }
    case 'A': { const W = ex > 0 ? 0.8 : k > 0.12 ? 0.92 : 0.68; p.moveTo([k * 0.6, 0]).lineTo([W / 2 - 0.07, 1 - k]).lineTo([W / 2 + 0.07, 1 - k]).lineTo([W - k * 0.6, 0]); p.moveTo([W * 0.25, 0.32]).lineTo([W * 0.75, 0.32]); return [p, W] }
    case 'V': { const W = 0.9; p.moveTo([k * 0.6, 1]).lineTo([W / 2 - 0.06, k]).lineTo([W / 2 + 0.06, k]).lineTo([W - k * 0.6, 1]); return [p, W] }
    case 'E': { const W = 0.72; p.moveTo([W, 1 - k]).lineTo([k, 1 - k]).lineTo([k, k]).lineTo([W, k]); p.moveTo([k, 0.5]).lineTo([W - 0.12, 0.5]); return [p, W] }
    case 'L': { const W = 0.68; p.moveTo([k, 1]).lineTo([k, k]).lineTo([W, k]); return [p, W] }
    case 'R': {
      const W = 0.82
      p.moveTo([k, 0]).lineTo([k, 1 - k]).lineTo([W - 0.3, 1 - k]).cubicTo([W - k + 0.04, 1 - k], [W - k + 0.04, 0.48], [W - 0.3, 0.48], 3).lineTo([k, 0.48])
      p.moveTo([W * 0.5, 0.48]).lineTo([W - k * 0.6, 0]); return [p, W]
    }
  }
  return [p, 0.3]
}
function word(text: string, k: number, gap: number, ex = 0): [Pen, number] {
  const p = new Pen()
  let u = 0
  for (const ch of text) {
    if (ch === ' ') { u += ex > 0 ? 0.7 : 0.9; continue }
    const [g, W] = glyph(ch, k, ex)
    p.add(g, u)
    u += W + gap
  }
  return [p, u - gap]
}
// the script "by", traced from kim (units of H2, origin at the b's foot)
function by(): Pen {
  const p = new Pen()
  p.moveTo([-0.05, 0.45]).cubicTo([0.25, 0.75], [0.42, 1.12], [0.25, 1.12], 3).cubicTo([0.1, 1.12], [0.05, 0.6], [0.0, 0.02], 3)
    .cubicTo([0.1, 0.4], [0.5, 0.55], [0.48, 0.25], 3).cubicTo([0.46, 0.0], [0.15, -0.02], [0.12, 0.12], 2)
  p.moveTo([0.48, 0.25]).cubicTo([0.6, 0.35], [0.62, 0.55], [0.66, 0.55], 2).cubicTo([0.62, 0.2], [0.68, 0.0], [0.82, 0.05], 2)
    .cubicTo([0.95, 0.12], [1.0, 0.4], [1.04, 0.56], 2).lineTo([0.96, -0.1]).cubicTo([0.9, -0.5], [0.55, -0.6], [0.45, -0.35], 3)
  return p
}
function sign(back: boolean) {
  const sx = back ? -1 : 1, plane = back ? BY - 1.2 : FY + 1.2, out = back ? 1 : -1
  // "UNION STATION" on its arc
  const [p1, L1] = word('UNION STATION', 0.125, 0.17, 0.12)
  const arc: Place = (u, v, w) => {
    const th = (u - L1 / 2) * H1 / R1, r = R1 + v * H1
    return [CX + sx * r * Math.sin(th), plane + out * w, ZC + r * Math.cos(th)]
  }
  strokes(neon, p1.paths, { width: 0.44, depth: 0.4, place: arc })
  // the steel frame: two arc rails and four posts behind the letters
  const rail = (r: number) => {
    const n = 10, a0 = -0.64, a1 = 0.64
    for (let i = 0; i < n; i++) {
      const t0 = a0 + ((a1 - a0) * i) / n, t1 = a0 + ((a1 - a0) * (i + 1)) / n
      const P = (t: number, rr: number, y: number): V3 => [CX + sx * rr * Math.sin(t), y, ZC + rr * Math.cos(t)]
      const y = plane - out * 0.35
      facing(dark, [P(t0, r - 0.12, y), P(t1, r - 0.12, y), P(t1, r + 0.12, y), P(t0, r + 0.12, y)], [0, out, 0])
    }
  }
  rail(R1 - 0.1); rail(R1 + 2.15)
  for (const t of [-0.48, -0.19, 0.19, 0.48]) {
    const x = CX + sx * (R1 + 2.15) * Math.sin(t), ztop = ZC + (R1 + 2.15) * Math.cos(t), y = plane - out * 0.35
    box(dark, x - 0.12, x + 0.12, y - 0.12, y + 0.12, 21.3, ztop, dark, 0)
  }
  // "TRAVEL by TRAIN" on the cornice
  const straight = (u0: number): Place => (u, v, w) => [CX + sx * (u0 + u * H2), (back ? BY - 0.4 : FY + 0.4) + out * w, Z2 + v * H2]
  const [p2] = word('TRAVEL', 0.12, 0.35)
  strokes(neon, p2.paths, { width: 0.31, depth: 0.35, place: straight(-9.2) })
  const [p3] = word('TRAIN', 0.12, 0.35)
  strokes(neon, p3.paths, { width: 0.31, depth: 0.35, place: straight(2.85) })
  strokes(neon, by().paths, { width: 0.22, depth: 0.35, place: straight(0.65) })
  // the clock in its stone arch
  const fc: Face = back ? { a: [X1, plane - out * 0.9], b: [X0, plane - out * 0.9] } : { a: [X0, plane - out * 0.9], b: [X1, plane - out * 0.9] }
  const s0 = back ? X1 - CX : CX - X0
  proud(stone, fc, archShape(s0, 4.7, 21.4, 23.95, 10), 0.9)
  const circ = (r: number, n = 14): [number, number][] => Array.from({ length: n }, (_, k) => [s0 - 0.25 * sx + r * Math.cos((k / n) * 2 * Math.PI), 23.84 + r * Math.sin((k / n) * 2 * Math.PI)])
  proud(dark, fc, circ(1.5), 0.96, false) // the dark numeral ring
  proud(white, fc, circ(0.95), 1.0, false) // the white face
  const hc = s0 - 0.25 * sx // the hands
  proud(dark, fc, [[hc - 0.06, 23.84], [hc + 0.06, 23.84], [hc + 0.06, 24.6], [hc - 0.06, 24.6]], 1.03, false)
  proud(dark, fc, [[hc, 23.78], [hc + 0.55, 23.78], [hc + 0.55, 23.9], [hc, 23.9]], 1.03, false)
}
sign(false)
sign(true)

// ── the train hall canopy (2014) ──
{
  const Cx = [-80, -72, -66, -60, -54, -48, -42, -30, -15, 0, 15, 30, 42, 48, 54, 60, 66, 72, 79]
  const Cz = [12, 12.5, 15.5, 17.5, 20, 19, 16, 10.5, 8.5, 7.8, 7.8, 8.2, 10.5, 13, 15, 17, 19, 16.5, 16.5]
  const crown = (x: number) => {
    if (x <= Cx[0]) return Cz[0]
    for (let i = 0; i < Cx.length - 1; i++) if (x <= Cx[i + 1]) { const t = (x - Cx[i]) / (Cx[i + 1] - Cx[i]); return Cz[i] + (Cz[i + 1] - Cz[i]) * (t * t * (3 - 2 * t)) }
    return Cz[Cz.length - 1]
  }
  const YM = 66, YH = 27, E = 6.0
  const height = (x: number, y: number) => {
    const u = (y - YM) / YH
    return E + (crown(x) - E) * Math.max(0, 1 - u * u) + 0.9 * (0.5 - 0.5 * Math.sin((2 * Math.PI * (x + 80)) / 8)) * Math.max(0, 1 - u * u * 0.6)
  }
  // outer plan: a rounded rectangle; the opening a superellipse
  const OX = -0.5, OA = 79.5, HX = 6, HA = 51.5, HY = 66.5, HB = 20
  const outerHalf = (x: number) => YH * Math.pow(Math.max(0, 1 - Math.pow(Math.abs((x - OX) / OA), 6)), 1 / 6)
  const holeHalf = (x: number) => { const q = Math.abs((x - HX) / HA); return q >= 1 ? 0 : HB * Math.pow(1 - Math.pow(q, 4), 0.25) }
  const xs: number[] = []
  for (let x = OX - OA; x <= OX + OA + 1e-6; x += 4) xs.push(Math.min(x, OX + OA))
  if (xs[xs.length - 1] < OX + OA - 0.01) xs.push(OX + OA)
  const J = 4
  const cols = xs.map((x) => {
    const oh = Math.max(outerHalf(x), 0.5), hh = Math.min(holeHalf(x), oh - 1)
    const lo: V3[] = [], hi: V3[] = []
    for (let j = 0; j <= J; j++) {
      const t = j / J
      const y1 = YM - oh + (HY - hh - (YM - oh)) * t, y2 = HY + hh + (YM + oh - HY - hh) * t
      lo.push([x, y1, height(x, y1)]); hi.push([x, y2, height(x, y2)])
    }
    return { lo, hi, hole: hh > 0.3 }
  })
  const nrmAt = (p: V3): V3 => {
    const e = 0.5, dx = (height(p[0] + e, p[1]) - height(p[0] - e, p[1])) / (2 * e), dy = (height(p[0], p[1] + e) - height(p[0], p[1] - e)) / (2 * e)
    const l = Math.hypot(dx, dy, 1)
    return [-dx / l, -dy / l, 1 / l]
  }
  // smooth-shaded, so the surface welds into one light mesh
  const smoothQuad = (a: V3, b: V3, c: V3, d: V3) => {
    white.tri(a, b, c, undefined, undefined, undefined, [nrmAt(a), nrmAt(b), nrmAt(c)])
    white.tri(a, c, d, undefined, undefined, undefined, [nrmAt(a), nrmAt(c), nrmAt(d)])
  }
  for (let i = 0; i < cols.length - 1; i++) {
    const A = cols[i], B = cols[i + 1]
    for (const band of ['lo', 'hi'] as const) for (let j = 0; j < J; j++) {
      smoothQuad(A[band][j], B[band][j], B[band][j + 1], A[band][j + 1])
    }
    if (!A.hole || !B.hole) smoothQuad(A.lo[J], B.lo[J], B.hi[0], A.hi[0])
  }
  // a 0.7 m white edge beam round the outside and the opening
  const edge = (pts: V3[], outward: (i: number) => V3) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], na = outward(i), nb = outward(i + 1)
      const A: V3 = [a[0], a[1], a[2] - 0.7], B: V3 = [b[0], b[1], b[2] - 0.7]
      white.tri(A, B, b, undefined, undefined, undefined, [na, nb, nb]); white.tri(A, b, a, undefined, undefined, undefined, [na, nb, na])
    }
  }
  const horiz = (pts: V3[], sgn: number) => (i: number): V3 => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    return [(sgn * dy) / l, (-sgn * dx) / l, 0]
  }
  const outer = [...cols.map((c) => c.lo[0]), ...[...cols].reverse().map((c) => c.hi[J])]
  outer.push(outer[0])
  edge(outer, horiz(outer, 1))
  const inner = cols.filter((c) => c.hole)
  const ring = [...inner.map((c) => c.lo[J]), ...[...inner].reverse().map((c) => c.hi[0])]
  ring.push(ring[0])
  edge(ring, horiz(ring, -1))
  // columns: round white posts at the opening's edges and under the ends
  const post = (x: number, y: number) => {
    const z = height(x, y), n = 6, r = 0.4
    for (let k = 0; k < n; k++) {
      const a0 = (k / n) * 2 * Math.PI, a1 = ((k + 1) / n) * 2 * Math.PI
      const P = (a: number, zz: number): V3 => [x + r * Math.cos(a), y + r * Math.sin(a), zz]
      const N0: V3 = [Math.cos(a0), Math.sin(a0), 0], N1: V3 = [Math.cos(a1), Math.sin(a1), 0]
      white.tri(P(a0, 0), P(a1, 0), P(a1, z), undefined, undefined, undefined, [N0, N1, N1])
      white.tri(P(a0, 0), P(a1, z), P(a0, z), undefined, undefined, undefined, [N0, N1, N0])
    }
  }
  for (const x of [-36, -18, 0, 18, 36, 50]) { post(x, HY - holeHalf(x) - 1.2); post(x, HY + holeHalf(x) + 1.2) }
  for (const x of [-74, -62, 68]) for (const y of [46, 56, 76, 86]) post(x, y)
}

// ── Union Station Pavilion: the white barrel canopy to the train hall ──
{
  const y0 = 19.6, y1 = 39.5, xs = 8
  const z = (x: number) => 4.6 + 1.4 * (1 - (x / 7) ** 2)
  for (let i = 0; i < xs; i++) {
    const xa = -7 + (14 * i) / xs, xb = -7 + (14 * (i + 1)) / xs
    for (let j = 0; j < 4; j++) {
      const ya = y0 + ((y1 - y0) * j) / 4, yb = y0 + ((y1 - y0) * (j + 1)) / 4
      facing(white, [[CX + xa, ya, z(xa)], [CX + xb, ya, z(xb)], [CX + xb, yb, z(xb)], [CX + xa, yb, z(xa)]], [0, 0, 1])
    }
  }
  for (const s of [-1, 1]) {
    facing(white, [[CX + 7 * s, y0, 4.1], [CX + 7 * s, y1, 4.1], [CX + 7 * s, y1, 4.6], [CX + 7 * s, y0, 4.6]], [s, 0, 0])
    for (const y of [24, 31, 38]) box(white, CX + 6.6 * s - 0.2, CX + 6.6 * s + 0.2, y - 0.2, y + 0.2, 0, 4.3, null, 0)
  }
}

const central = (p: V3) => p[0] > CX - 26.5 && p[0] < CX + 26.5 && p[1] < BY + 0.5
await save('den-union-station', 'Denver Union Station', [
  { part: stone, material: { ...finish('dus-stone', 0xdedad2), floodlight: (p, n) => (central(p) ? (Math.abs(n[2]) < 0.5 ? 0.85 : 0.2) : 0.2) } },
  { part: wing, material: { ...finish('dus-rhyolite', 0xb6a69c), floodlight: () => 0.15 } },
  { part: dark, material: finish('dus-slate', 0x646d6c) },
  { part: win, material: PALETTE.window },
  { part: neon, material: finish('neon-dus-red', 0xe8684a, 0.5) },
  { part: white, material: { ...finish('dus-canopy', 0xeeebe4, 0.6), doubleSided: true, floodlight: (p, n) => (p[2] > 21 ? 1 : n[2] > 0.7 ? 0.3 : 0.6) } },
], { height: 28.9, anchor: [39.7532, -105.00019], bearing: 315 }, 6500)
