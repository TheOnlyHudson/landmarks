/**
 * Country Music Hall of Fame and Museum (2001, Tuck-Hinton Architects;
 * expanded 2014) — original procedural geometry, CC0-1.0.
 * bun generators/nash-country-music-hall-of-fame.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332 (the
 * downtown grid): +x runs toward 4th Avenue (compass 62°), +y toward
 * Demonbreun Street and the park (compass 332°). Anchor = centroid of OSM
 * way/130905919, 36.158163, -86.776110. y = 0 is the lowest ground under
 * the footprint (127.7 m, at the 4th Avenue foot of the rotunda).
 *
 * Only the museum is modelled. Its south face meets the Omni Nashville
 * Hotel (way/464660187, another builder's) along y = -46.3; the hotel and
 * the bridge between them stay the map's.
 *
 * Identity, in order: the long concave front facing the park, a grey wall
 * whose top sweeps up at the 5th Avenue end into a sharp tail fin like a
 * 1950s Cadillac, with tall dark "piano key" windows in groups of two and
 * three over a dark glass band and a red-framed glazed ground floor; the
 * rotunda at the 4th Avenue corner, a sandstone-footed concrete drum with
 * a glazed upper drum, a copper brim and stepped discs like a stack of 78s,
 * and the WSM radio-tower spire; behind, the tall glass hall under a thin
 * winged roof with upturned ends; the bass-clef plan of curve and circle.
 *
 * Evidence:
 *  - plan: OSM way/130905919 and its parts way/795839526 (the curved roof),
 *    way/795839527, way/795839528. The front curve is a least-squares
 *    circle through the 26 nodes of way/795839526 (centre 9.5, 87.1;
 *    r 67.0 m, residuals under 0.8 m). The rotunda: centre (32.3, 43.5),
 *    r 14.7, from the outline's arc. The garden between the curve and the
 *    straight north edge is open (lidar shows ground and trees there).
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022 flight), 1 m
 *    grid. Over the 127.7 m base: the roof behind the curve rises from
 *    23.8 at y = -2 to 31 at the fin end (a plane, 0.16 rise per metre);
 *    the fin's tip 34.0 (drawn 35, the blade is thinner than a lidar cell), cantilevered ~7 m past the outline's corner (the
 *    lidar draws its blade out to (-55, 58)); rotunda drum 15.4, its
 *    parapet 17.8, brim 24.7, discs 26.5 and 28.2, cap 29.0; the high hall
 *    39.7 at its north edge falling to 33.9 at its south; the side blocks
 *    33 and 27.5. Measured.
 *  - spire: ~15 m over the cap (estimated from Brett Lane's panoramio view
 *    against the measured rotunda), top 44 m.
 *  - piano keys: groups of two and three slots, 1.1 m wide, sills at 14 m,
 *    heads following the wall's top (from the photos; estimated).
 *  - colours: grey precast concrete, buff sandstone, red window frames,
 *    copper-brown brim and discs, dark glass.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Country Music Hall of Fame and Museum, Nashville USA - panoramio.jpg,
 *    The Erica Chang, CC BY 3.0 (the front from the park)
 *    https://commons.wikimedia.org/wiki/File:Country_Music_Hall_of_Fame_and_Museum,_Nashville_USA_-_panoramio.jpg
 *  - Country Music Hall of Fame (Northeast corner).JPG, Michael Rivera,
 *    CC BY-SA 4.0 (the rotunda)
 *    https://commons.wikimedia.org/wiki/File:Country_Music_Hall_of_Fame_(Northeast_corner).JPG
 *  - Country Music Hall of Fame (Northwest corner) 2.JPG, Michael Rivera,
 *    CC BY-SA 4.0 (the fin end and the curve)
 *    https://commons.wikimedia.org/wiki/File:Country_Music_Hall_of_Fame_(Northwest_corner)_2.JPG
 *  - Country Music Hall of Fame, 5th Ave side 1.JPG and 2.JPG, Michael
 *    Rivera, CC BY-SA 4.0 (the 5th Avenue face)
 *    https://commons.wikimedia.org/wiki/File:Country_Music_Hall_of_Fame,_5th_Ave_side_1.JPG
 *  - Country Music Hall of Fame 2022a.jpg, Antony-22, CC BY-SA 4.0 (wide
 *    view with the rotunda and fin)
 *    https://commons.wikimedia.org/wiki/File:Country_Music_Hall_of_Fame_2022a.jpg
 *  - Country Music Hall of Fame Nashville.jpg, Karakorhummel, CC BY-SA 4.0
 *    (rotunda stack, the winged roof of the high hall, black and white)
 *    https://commons.wikimedia.org/wiki/File:Country_Music_Hall_of_Fame_Nashville.jpg
 *  - Country Music Hall of Fame - edwardhblake.jpg, edwardhblake, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Country_Music_Hall_of_Fame_-_edwardhblake.jpg
 *  - USGS NAIP (public domain): plan.
 * No look-only sources. No commercial imagery.
 *
 * Night: piano-key slots and the glazed floors are `window`; the rotunda's
 * drum and the fin wall carry floodlight.
 *
 * Left out: the "music staff" bars on the drum (drawn as a band), the
 * lettered garden wall's letters, banners, the garden's planting.
 *
 * Doubts: the south and 5th Avenue faces are drawn plain from two photos;
 * the high hall's roof flare is read from one black-and-white photo; the
 * spire's height is estimated; whether the garden has any canopy at its
 * north edge (lidar shows a ~11 m line there; drawn here only as the low
 * lettered wall the photos show).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, prism, save, smoothWall, circle, type XY } from './atl-westin-peachtree-plaza'
import { quadH, triH, block } from './nash-ryman-auditorium'

function build() {
  const conc = new Part(), win = new Part(), red = new Part(), copper = new Part(), roof = new Part(), sand = new Part()

  // ── The front curve ──
  const CX = 9.46, CY = 87.13, R = 67.04
  const arcAt = (x: number): XY => [x, CY - Math.sqrt(R * R - (x - CX) ** 2)]
  const roofZ = (y: number) => 23.8 + 0.16 * (y + 2)
  const XE = 38.0, XW = -47.5
  const NA = 26
  const arc: XY[] = Array.from({ length: NA + 1 }, (_, i) => arcAt(XE + ((XW - XE) * i) / NA)) // east → west
  // The curve bends out to the outline's corner at the fin end.
  arc.push([-49.9, 50.3])

  // ── North block (behind the curve), roof a plane rising north ──
  const north: XY[] = [[46.5, -2], ...arc, [-50.5, -2]]
  {
    // Walls to the sloped roof.
    for (let i = 0; i < north.length; i++) {
      const a = north[i], b = north[(i + 1) % north.length]
      quadH(conc, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], roofZ(b[1])], [a[0], a[1], roofZ(a[1])], [b[1] - a[1], -(b[0] - a[0]), 0])
    }
    const tmp = new Part()
    capPoly(tmp, north, 0, true)
    for (let k = 0; k < tmp.pos.length; k += 9) {
      const v = [0, 3, 6].map((o) => { const x = tmp.pos[k + o], y = -tmp.pos[k + o + 2]; return [x, y, roofZ(y)] as V3 })
      roof.tri(v[0], v[1], v[2])
    }
  }
  // The front wall along the curve: a grey parapet band 0.9 above the roof,
  // sweeping up at the west end into the fin, whose blade overhangs ~7 m.
  const finUp = (x: number) => Math.max(0, (-x + 5) / 55) ** 2 * 2.8
  const topAt = (p: XY) => roofZ(p[1]) + 0.9 + finUp(p[0])
  {
    const pts = arc.slice(0, NA + 1)
    // Tangent-normal offsets of the band (outward = toward the circle's centre).
    const off = (p: XY, d: number): XY => { const dx = CX - p[0], dy = CY - p[1], l = Math.hypot(dx, dy); return [p[0] + (dx / l) * d, p[1] + (dy / l) * d] }
    for (let i = 0; i < pts.length - 1; i++) {
      const a = off(pts[i], 0.6), b = off(pts[i + 1], 0.6), ai = off(pts[i], -0.6), bi = off(pts[i + 1], -0.6)
      const za = topAt(pts[i]), zb = topAt(pts[i + 1])
      const out: V3 = [CX - (a[0] + b[0]) / 2, CY - (a[1] + b[1]) / 2, 0]
      quadH(conc, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zb], [a[0], a[1], za], out)
      quadH(conc, [ai[0], ai[1], roofZ(pts[i][1]) - 0.2], [bi[0], bi[1], roofZ(pts[i + 1][1]) - 0.2], [bi[0], bi[1], zb], [ai[0], ai[1], za], [-out[0], -out[1], 0])
      quadH(conc, [a[0], a[1], za], [b[0], b[1], zb], [bi[0], bi[1], zb], [ai[0], ai[1], za], [0, 0, 1])
    }
    // The fin blade: from the curve's west end out past the corner, its top
    // rising to 34 m and its end edge raking outward.
    const p0 = pts[pts.length - 1], z0 = topAt(p0)
    const tip: XY = [-55.0, 57.5], foot: XY = [-49.9, 50.3]
    const dir: XY = [tip[0] - p0[0], tip[1] - p0[1]], dl = Math.hypot(dir[0], dir[1]), nn: XY = [-dir[1] / dl * 1.0, dir[0] / dl * 1.0]
    const prof: [XY, number, number][] = [[p0, 0, z0], [foot, 0, 32.6], [tip, 21, 35.0]]
    for (let i = 0; i < prof.length - 1; i++) {
      const [a, za0, za1] = prof[i], [b, zb0, zb1] = prof[i + 1]
      const A0: V3 = [a[0] + nn[0], a[1] + nn[1], za0], A1: V3 = [a[0] + nn[0], a[1] + nn[1], za1], B0: V3 = [b[0] + nn[0], b[1] + nn[1], zb0], B1: V3 = [b[0] + nn[0], b[1] + nn[1], zb1]
      const C0: V3 = [a[0] - nn[0], a[1] - nn[1], za0], C1: V3 = [a[0] - nn[0], a[1] - nn[1], za1], D0: V3 = [b[0] - nn[0], b[1] - nn[1], zb0], D1: V3 = [b[0] - nn[0], b[1] - nn[1], zb1]
      const o: V3 = [nn[0], nn[1], 0]
      quadH(conc, A0, B0, B1, A1, o)
      quadH(conc, C0, D0, D1, C1, [-o[0], -o[1], 0])
      quadH(conc, A1, B1, D1, C1, [0, 0, 1])
      quadH(conc, A0, B0, D0, C0, [0, 0, -1])
      if (i === prof.length - 2) quadH(conc, B0, D0, D1, B1, [dir[0], dir[1], 0])
    }
  }
  // On the curve's face: red-framed glazed ground floor, the dark glass
  // band, then the piano-key slots.
  {
    const OUT = 0.68
    const P = (x: number, z: number, d = OUT): V3 => { const p = arcAt(x), dx = CX - p[0], dy = CY - p[1], l = Math.hypot(dx, dy); return [p[0] + (dx / l) * d, p[1] + (dy / l) * d, z] }
    const nrm = (x: number): V3 => { const p = arcAt(x); return [CX - p[0], CY - p[1], 0] }
    const xs = Array.from({ length: NA + 1 }, (_, i) => XE - 3 + ((XW + 1 - XE + 3) * i) / NA)
    for (let i = 0; i < NA; i++) {
      const xa = xs[i], xb = xs[i + 1], n = nrm((xa + xb) / 2)
      // Red frame band and glass ground floor, 0..6.5.
      quadH(red, P(xa, 0.4), P(xb, 0.4), P(xb, 6.6), P(xa, 6.6), n)
      quadH(win, P(xa + 0.25, 0.8, OUT + 0.04), P(xb - 0.25, 0.8, OUT + 0.04), P(xb - 0.25, 6.0, OUT + 0.04), P(xa + 0.25, 6.0, OUT + 0.04), n)
      // Dark glass band, leaning out at its top.
      quadH(win, P(xa, 6.6, OUT + 0.4), P(xb, 6.6, OUT + 0.4), P(xb, 11.0, OUT + 0.05), P(xa, 11.0, OUT + 0.05), n)
    }
    // Piano keys: groups of 2 and 3 slots, sills at 13.5, heads 2.5 m below the wall top.
    let x = XE - 7, g = 0
    while (x > XW + 4) {
      const k = g % 2 ? 3 : 2
      for (let j = 0; j < k; j++) {
        const xa = x - j * 1.9, xb = xa - 1.15
        const top = Math.min(topAt(arcAt(xa)), topAt(arcAt(xb))) - 2.6
        quadH(win, P(xa, 13.5), P(xb, 13.5), P(xb, top), P(xa, top), nrm(xa))
      }
      x -= k * 1.9 + 3.4
      g++
    }
  }

  // Link between the curve's east end and the rotunda.
  prism(conc, [[36.5, 24.5], [46.5, -2], [47, 30], [36, 33]], 0, 15.4, roof, 0.3)

  // ── The garden's north edge: the low lettered wall, a light beam above ──
  {
    const xa = -36, xb = 17
    box(conc, xa, xb, 43.6, 44.6, 0, 3.0, conc, 0.15)
  }

  // ── South blocks, meeting the Omni at y = -46.3 ──
  const YS = -46.3
  prism(conc, [[-52.6, YS], [-34, YS], [-34, -2], [-52.6, -2]], 0, 27.5, roof, 0.4)
  prism(conc, [[-34, YS], [-12, YS], [-12, -2], [-34, -2]], 0, 33.0, roof, 0.4)
  prism(conc, [[28, YS], [44, YS], [44, -2], [28, -2]], 0, 33.0, roof, 0.4)
  prism(conc, [[44, YS], [53.7, YS], [53.7, -6.1], [44, -6.1]], 0, 27.5, roof, 0.4)
  prism(conc, [[-12, YS], [28, YS], [28, -36], [-12, -36]], 0, 32.8, roof, 0.4)
  // 5th Avenue face: bronze vertical cladding and glass of the 2014 wing.
  for (let i = 0; i < 9; i++) {
    const y0 = -42 + i * 4.4
    block(copper, -53.0, -52.6, y0, y0 + 2.2, 4.5, 26.5)
  }
  quadH(win, [-52.68, -42, 4.5], [-52.68, -3, 4.5], [-52.68, -3, 26.5], [-52.68, -42, 26.5], [-1, 0, 0])
  quadH(sand, [-52.7, -44, 0], [-52.7, -1, 0], [-52.7, -1, 4.2], [-52.7, -44, 4.2], [-1, 0, 0])

  // ── The high hall: glass clerestory under the winged roof ──
  {
    const x0 = -12, x1 = 28, y0 = -36, y1 = 6
    const hz = (y: number) => 33.9 + (y - y0) * (39.7 - 33.9) / (y1 - y0)
    const ring: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4], n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
      quadH(conc, [a[0], a[1], 24], [b[0], b[1], 24], [b[0], b[1], 28.5], [a[0], a[1], 28.5], n)
      quadH(win, [a[0], a[1], 28.5], [b[0], b[1], 28.5], [b[0], b[1], hz(b[1]) - 0.8], [a[0], a[1], hz(a[1]) - 0.8], n)
    }
    // Winged roof slab: overhangs 3.5 m, its east and west ends flaring up.
    const flare = (x: number) => Math.max(0, (Math.abs(x - 8) - 15) / 8.5) ** 2 * 2.4
    const sx = [-16.5, -14, -11, -7, 0, 8, 16, 23, 27, 30, 32.5]
    const yA = y0 - 3, yB = y1 + 3.5, T = 0.7
    for (let i = 0; i < sx.length - 1; i++) {
      const a = sx[i], b = sx[i + 1]
      const t = (x: number, y: number) => hz(y) - 0.8 + T + flare(x)
      quadH(roof, [a, yA, t(a, yA)], [b, yA, t(b, yA)], [b, yB, t(b, yB)], [a, yB, t(a, yB)], [0, 0, 1])
      quadH(conc, [a, yA, t(a, yA) - T], [b, yA, t(b, yA) - T], [b, yB, t(b, yB) - T], [a, yB, t(a, yB) - T], [0, 0, -1])
      for (const [y, s] of [[yA, -1], [yB, 1]] as [number, number][]) quadH(conc, [a, y, t(a, y) - T], [b, y, t(b, y) - T], [b, y, t(b, y)], [a, y, t(a, y)], [0, s, 0])
    }
    for (const [x, s] of [[sx[0], -1], [sx[sx.length - 1], 1]] as [number, number][]) {
      const t = (y: number) => hz(y) - 0.8 + T + flare(x)
      quadH(conc, [x, yA, t(yA) - T], [x, yB, t(yB) - T], [x, yB, t(yB)], [x, yA, t(yA)], [s, 0, 0])
    }
  }

  // ── The rotunda ──
  {
    const C: XY = [32.3, 43.5], N = 24
    const ring = (r: number, n = N) => circle(C, r, n, Math.PI / n)
    // Sandstone footing, concrete drum leaning in slightly, its "staff" band.
    smoothWall(sand, ring(14.9), 0, 4.2)
    capPoly(sand, ring(14.9), 4.2, true)
    {
      const a = ring(14.7), b = ring(14.2)
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N, mx = (a[i][0] + a[j][0]) / 2 - C[0], my = (a[i][1] + a[j][1]) / 2 - C[1]
        quadH(conc, [a[i][0], a[i][1], 4.2], [a[j][0], a[j][1], 4.2], [b[j][0], b[j][1], 15.4], [b[i][0], b[i][1], 15.4], [mx, my, 0.03])
      }
      prism(conc, ring(14.35), 15.4, 17.8, roof, 0.3)
      // Bars of the staff band, flush dark panels round the drum's top.
      for (let i = 0; i < N; i += 1) {
        const t0 = (i + 0.35) / N * 2 * Math.PI, t1 = (i + 0.65) / N * 2 * Math.PI, rr = 14.42
        const P = (t: number, z: number): V3 => [C[0] + rr * Math.cos(t), C[1] + rr * Math.sin(t), z]
        quadH(copper, P(t0, 15.9), P(t1, 15.9), P(t1, 17.2), P(t0, 17.2), [Math.cos((t0 + t1) / 2), Math.sin((t0 + t1) / 2), 0])
      }
    }
    // Glazed upper drum with stone piers.
    smoothWall(win, ring(11.0), 17.8, 23.3)
    for (let i = 0; i < 8; i++) {
      const t = (i / 8) * 2 * Math.PI, c: XY = [C[0] + 11.2 * Math.cos(t), C[1] + 11.2 * Math.sin(t)]
      prism(conc, circle(c, 0.9, 6), 17.8, 23.3, conc, 0.1)
    }
    // Copper brim and the stacked discs, then the cap.
    // Each record is a thin copper rim with a shallow cone up to the next.
    const cone = (r0: number, z0: number, r1: number, z1: number) => {
      const a = ring(r0, 32), b = ring(r1, 32)
      for (let i = 0; i < 32; i++) { const j = (i + 1) % 32; quadH(copper, [a[i][0], a[i][1], z0], [a[j][0], a[j][1], z0], [b[j][0], b[j][1], z1], [b[i][0], b[i][1], z1], [a[i][0] - C[0], a[i][1] - C[1], 4]) }
    }
    const rim = (r: number, z0: number, z1: number) => { smoothWall(copper, ring(r, 32), z0, z1); capPoly(conc, ring(r, 32), z0, false) }
    rim(13.4, 23.3, 24.1); cone(13.4, 24.1, 9.2, 24.7)
    rim(9.2, 24.7, 25.6); cone(9.2, 25.6, 5.8, 26.5)
    rim(5.8, 26.5, 27.4); cone(5.8, 27.4, 2.6, 28.2)
    rim(2.6, 28.2, 28.7); capPoly(copper, ring(2.6, 32), 28.7, true)
    // The WSM-style lattice spire: four raking legs, braced, to a needle.
    const legs = (z: number) => 1.9 * (1 - (z - 29) / 15) + 0.08
    const L = (k: number, z: number): V3 => { const r = legs(z), a = Math.PI / 4 + (k * Math.PI) / 2; return [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z] }
    const strut = (a: V3, b: V3, w: number) => {
      const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
      const s: V3 = Math.abs(d[2]) > 0.5 ? [w, 0, 0] : [0, 0, w], t: V3 = Math.abs(d[2]) > 0.5 ? [0, w, 0] : [-d[1] / Math.hypot(d[0], d[1]) * w, d[0] / Math.hypot(d[0], d[1]) * w, 0]
      const c = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => (p: V3): V3 => [p[0] + s[0] * i + t[0] * j, p[1] + s[1] * i + t[1] * j, p[2] + s[2] * i + t[2] * j])
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4, m: V3 = [(s[0] * ([-1, 1, 1, -1][i] + [-1, 1, 1, -1][j]) + t[0] * ([-1, -1, 1, 1][i] + [-1, -1, 1, 1][j])), (s[1] * ([-1, 1, 1, -1][i] + [-1, 1, 1, -1][j]) + t[1] * ([-1, -1, 1, 1][i] + [-1, -1, 1, 1][j])), (s[2] * ([-1, 1, 1, -1][i] + [-1, 1, 1, -1][j]) + t[2] * ([-1, -1, 1, 1][i] + [-1, -1, 1, 1][j]))]
        quadH(roof, c[i](a), c[j](a), c[j](b), c[i](b), m)
      }
    }
    for (let k = 0; k < 4; k++) strut(L(k, 29), L(k, 43), 0.16)
    for (const z of [31.5, 34.5, 37.5, 40.5]) for (let k = 0; k < 4; k++) strut(L(k, z), L((k + 1) % 4, z), 0.11)
    for (let k = 0; k < 4; k++) strut(L(k, 31.5), L((k + 1) % 4, 34.5), 0.08)
    strut([C[0], C[1], 42.5], [C[0], C[1], 46], 0.08)
  }

  const concM = { ...finish('cmhof-concrete', 0xccc8c0), floodlight: (p: V3, n: V3) => (n[2] > 0.6 ? 0 : Math.hypot(p[0] - 32.3, p[1] - 43.5) < 15.2 && p[2] < 18 ? 0.7 : p[1] > 18 && p[2] > 12 ? 0.45 : 0) }
  return [
    { part: conc, material: concM },
    { part: win, material: PALETTE.window },
    { part: red, material: finish('cmhof-red', 0xa94a3f) },
    { part: copper, material: finish('cmhof-copper', 0x9a6a50) },
    { part: roof, material: PALETTE.roof },
    { part: sand, material: finish('cmhof-sandstone', 0xcdb48e) },
  ]
}

await save('nash-country-music-hall-of-fame', 'Country Music Hall of Fame and Museum', build(), { height: 46, anchor: [36.158163, -86.776110], bearing: 332 })
