/**
 * Bridgestone Arena (1996 as the Nashville Arena, HOK Sport) — original
 * procedural geometry, CC0-1.0.
 * bun generators/nash-bridgestone-arena.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332 (the
 * downtown grid): +x runs toward 5th Avenue (compass 62°), +y toward
 * Broadway (compass 332°). Anchor = centroid of OSM way/130905914,
 * 36.159175, -86.778495. y = 0 is the lowest ground under the footprint
 * (130.5 m, toward the 5th Avenue / Demonbreun corner).
 *
 * Identity, in order: the tapered blue glass tower at Broadway and 5th
 * with its white rings and the tall lattice radio-tower spire; the huge
 * pale saucer roof, tilted up toward Broadway, whose deep grey soffit
 * overhangs the curved glass entrance at the 5th Avenue corner; the
 * precast blocks along Broadway, 6th Avenue and the south end, where a
 * barrel-topped wing faces Demonbreun.
 *
 * Evidence:
 *  - plan: OSM way/130905914. The roof is a superellipse (n = 3) centred
 *    (0, -4), 65 x 78 m half-axes, matching the lidar's roof edge and
 *    the outline's corner curve; the tower centre (36.3, 92.5) from lidar.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022 flight), 1 m
 *    grid. Roof surface fitted to 3,364 cells (rms 1.8 m): over the 130.5
 *    m base, z = 35.0 + 0.014x + 0.057y - 6.04ρ² + 1.24ρ⁴ (about 35 at
 *    the centre, the rim 26 at the south and 34 at the north). Broadway
 *    block 17.1, 6th Avenue strips 9.4-10, south and east wings 19-24. The
 *    tower: glass cone to 28.4 (top radius 7.8, lidar), white rings to
 *    32.5 (radius 6), the observation drum to 41.5 (radius ~4.8), cap
 *    43.2, spire tip 94 (lidar returns at 96.2 m over the lidar
 *    ground minimum, 91 m over the street). Measured.
 *  - the soffit depth (~12 m at the corner) and the two-storey glass wall
 *    under a white band from Wonderdawg777's 2005 corner view; the cone's
 *    base radius (10 m, 20 m across) from its taper in the same photo
 *    against the lidar top, wider than OSM's 7.5 m bump in the outline,
 *    which traces the cone's upper edge (estimated).
 *  - colours: pale roof (NAIP), grey metal soffit, light precast, blue
 *    glass.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Gaylord Entertainment Center 2005-12-07.jpg, Wonderdawg777, CC BY 2.0
 *    (the tower and the soffit over the corner glass)
 *    https://commons.wikimedia.org/wiki/File:Gaylord_Entertainment_Center_2005-12-07.jpg
 *  - Bridgestone Arena (Northeast corner).JPG, Michael Rivera, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Bridgestone_Arena_(Northeast_corner).JPG
 *  - Bridgestone Arena (North face) 1.JPG and 2.JPG, Michael Rivera, CC
 *    BY-SA 4.0 (the Broadway block, the roof and tower beyond)
 *    https://commons.wikimedia.org/wiki/File:Bridgestone_Arena_(North_face)_1.JPG
 *  - Bridgestone Arena (Southeast corner).JPG, Michael Rivera, CC BY-SA 4.0
 *    (the barrel-topped south wing)
 *    https://commons.wikimedia.org/wiki/File:Bridgestone_Arena_(Southeast_corner).JPG
 *  - Gaylord Entertainment Center, Nashville, Tennessee (97059820).jpg, Ken
 *    Lund, CC BY-SA 2.0 (aerial from the north-east: roof plan)
 *    https://commons.wikimedia.org/wiki/File:Gaylord_Entertainment_Center,_Nashville,_Tennessee_(97059820).jpg
 *  - Bridgestone Arena (97058907).jpg, Ken Lund, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:Bridgestone_Arena_(97058907).jpg
 *  - Tower, Nashville Visitor Center and Bridgestone Arena, Broadway and 5th
 *    Avenue (LeMay), CC BY-SA 2.0 (the spire's rings)
 *    https://commons.wikimedia.org/wiki/File:Tower,_Nashville_Visitor_Center_and_Bridgestone_Arena,_Broadway_and_5th_Avenue,_Nashville,_TN_(54383403502).jpg
 *  - USGS NAIP (public domain): plan, roof colour.
 * No look-only sources. No commercial imagery.
 *
 * Night: the corner glass and the tower glass are windows and glow; the
 * tower's white rings and spire carry floodlight.
 *
 * Left out: signs and the video boards (the brief keeps signage as plain
 * boxes; none is large enough to read here), the roof's vents, the
 * entrance canopies and the Visitor Center kiosk.
 *
 * Doubts: the 6th Avenue and south faces are drawn as plain precast from
 * oblique photos; the soffit's line along the west and south is an
 * estimate (photos show it shallower there).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { box, prism, save, smoothWall, circle, capPoly, type XY } from './atl-westin-peachtree-plaza'
import { quadH, prismV, block } from './nash-ryman-auditorium'

function build() {
  const pre = new Part(), roof = new Part(), soffit = new Part(), win = new Part(), blue = new Part(), white = new Part()

  // ── The saucer ──
  const CX = 0, CY = -4, A = 65, B = 78, NS = 64
  const sp = (t: number, k: number): XY => {
    const c = Math.cos(t), s = Math.sin(t)
    return [CX + k * A * Math.sign(c) * Math.abs(c) ** (2 / 3), CY + k * B * Math.sign(s) * Math.abs(s) ** (2 / 3)]
  }
  const zTop = (x: number, y: number, r2: number) => 35.0 + 0.014 * x + 0.057 * y - 6.04 * r2 + 1.24 * r2 * r2
  const ts = Array.from({ length: NS }, (_, i) => (i / NS) * 2 * Math.PI)
  const ks = [1.0, 0.85, 0.65, 0.42, 0.2]
  const ringAt = (k: number) => ts.map((t) => { const p = sp(t, k); return [p[0], p[1], zTop(p[0], p[1], k * k)] as V3 })
  const rings = ks.map(ringAt)
  for (let r = 0; r < rings.length - 1; r++) {
    for (let i = 0; i < NS; i++) {
      const j = (i + 1) % NS
      quadH(roof, rings[r][i], rings[r][j], rings[r + 1][j], rings[r + 1][i], [0, 0, 1])
    }
  }
  {
    const top = rings[rings.length - 1], c: V3 = [CX, CY, zTop(CX, CY, 0)]
    for (let i = 0; i < NS; i++) roof.tri(c, top[i], top[(i + 1) % NS])
  }
  // Rim fascia and the deep soffit down to the bowl wall.
  const KW = 0.84, WALL = 18.0
  const rim = rings[0], rimLow = rim.map((p) => [p[0], p[1], p[2] - 2.2] as V3)
  const foot = ts.map((t) => { const p = sp(t, KW); return [p[0], p[1], WALL] as V3 })
  for (let i = 0; i < NS; i++) {
    const j = (i + 1) % NS, o: V3 = [rim[i][0] - CX, rim[i][1] - CY, 0]
    quadH(soffit, rimLow[i], rimLow[j], rim[j], rim[i], o)
    quadH(soffit, foot[i], foot[j], rimLow[j], rimLow[i], [-o[0] * 0.3, -o[1] * 0.3, -1])
  }
  // The bowl wall: glass under a white band on the 5th Avenue corner
  // (from about east to north), precast elsewhere.
  for (let i = 0; i < NS; i++) {
    const j = (i + 1) % NS, a = sp(ts[i], KW), b = sp(ts[j], KW), o: V3 = [a[0] - CX, a[1] - CY, 0]
    const tm = (ts[i] + ts[j]) / 2, glassSide = tm > -0.25 && tm < 1.9
    if (glassSide) {
      quadH(blue, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 15.2], [a[0], a[1], 15.2], o)
      quadH(white, [a[0], a[1], 15.2], [b[0], b[1], 15.2], [b[0], b[1], WALL], [a[0], a[1], WALL], o)
    } else quadH(pre, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WALL], [a[0], a[1], WALL], o)
  }
  // Mullion lines on the glass, a few bold ones.
  for (let i = 0; i < NS; i += 2) {
    const tm = ts[i]
    if (!(tm > -0.2 && tm < 1.85)) continue
    const a = sp(tm, KW + 0.003), b = sp(tm + 0.012, KW + 0.003)
    quadH(white, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 15.2], [a[0], a[1], 15.2], [a[0] - CX, a[1] - CY, 0])
  }
  {
    const tmid = 0.8
    for (const z of [6.8]) {
      for (let i = 0; i < NS; i++) {
        const t0 = ts[i], t1 = t0 + (2 * Math.PI) / NS
        if (!(t0 > -0.25 && t1 < 1.95)) continue
        const a = sp(t0, KW + 0.003), b = sp(t1, KW + 0.003)
        quadH(white, [a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], z + 0.5], [a[0], a[1], z + 0.5], [a[0] - CX, a[1] - CY, 0])
      }
    }
    void tmid
  }

  // ── Precast blocks round the bowl ──
  prism(pre, [[-57.6, 78], [28.9, 78], [28.9, 104.8], [-57.6, 106.1]], 0, 17.1, roof, 0.4)
  prism(pre, [[-66.3, 36], [-57.4, 36], [-57.4, 106], [-66.3, 106]], 0, 9.4, roof, 0.3)
  prism(pre, [[-67, -79.2], [-56, -79.2], [-56, 36], [-67, 36]], 0, 10.0, roof, 0.3)
  prism(pre, [[38, -80], [64.2, -80], [64.2, -8], [38, -8]], 0, 19.0, roof, 0.4)
  // Bands of glass on the Broadway block and the 5th Avenue wing.
  // Broadway climbs to the west (lidar ground 4.2 m over the base at x = 28,
  // 10 m at x = -57), so the shopfront band follows the street.
  quadH(win, [-50, 106.0, 10.0], [24, 104.9, 5.6], [24, 104.9, 10.0], [-50, 106.0, 14.4], [0, 1, 0])
  quadH(win, [64.26, -74, 3], [64.26, -14, 3], [64.26, -14, 7.5], [64.26, -74, 7.5], [1, 0, 0])
  // South wing with its barrel top, the arch facing Demonbreun Street.
  {
    const x0 = 15, x1 = 64.2, xm = (x0 + x1) / 2, hw = (x1 - x0) / 2, SPR = 17.5, CR = 24.0
    const prof: XY[] = [[x0, 0], [x1, 0]]
    for (let i = 0; i <= 10; i++) { const a = (i / 10) * Math.PI; prof.push([xm + hw * Math.cos(a), SPR + (CR - SPR) * Math.sin(a)]) }
    prismV(pre, prof.slice(0, 2).concat(prof.slice(2)), [1, 0], [0, 0], -113.8, -80, roof)
    // Glass in the arch, inset from its edges.
    const g: XY[] = []
    for (let i = 0; i <= 10; i++) { const a = (i / 10) * Math.PI; g.push([xm + (hw - 4) * Math.cos(a), SPR - 1 + (CR - SPR - 1.2) * Math.sin(a)]) }
    for (let i = 0; i < 10; i++) {
      const p = g[i], q = g[i + 1]
      quadH(win, [p[0], -113.86, 6], [q[0], -113.86, 6], [q[0], -113.86, q[1]], [p[0], -113.86, p[1]], [0, -1, 0])
    }
  }

  // ── The tower at Broadway and 5th ──
  {
    const C: XY = [36.3, 92.5], N = 16
    // The wide tapered glass cone: radius 10 at the street (photo taper
    // against the lidar top) to 7.8 at its 28.4 m top (lidar), blue glass
    // with pale vertical mullions on every second facet edge.
    const N2 = 24, r0 = 10.0, r1 = 7.8, H = 28.4
    const lo = circle(C, r0, N2), hi = circle(C, r1, N2)
    for (let i = 0; i < N2; i++) {
      const j = (i + 1) % N2, o: V3 = [lo[i][0] + lo[j][0] - 2 * C[0], lo[i][1] + lo[j][1] - 2 * C[1], 0.2]
      quadH(blue, [lo[i][0], lo[i][1], 0], [lo[j][0], lo[j][1], 0], [hi[j][0], hi[j][1], H], [hi[i][0], hi[i][1], H], o)
      if (i % 2) continue
      // A mullion strip 0.35 m wide, 0.08 m proud, centred on vertex i.
      const strip = (r: number, z: number, side: number): V3 => {
        const a0 = Math.atan2(lo[i][1] - C[1], lo[i][0] - C[0]) + side * 0.175 / r
        return [C[0] + (r + 0.08) * Math.cos(a0), C[1] + (r + 0.08) * Math.sin(a0), z]
      }
      quadH(white, strip(r0, 0, -1), strip(r0, 0, 1), strip(r1, H, 1), strip(r1, H, -1), [lo[i][0] - C[0], lo[i][1] - C[1], 0.2])
    }
    // White rings stepping in over the glass, the deck, the observation drum and the cap.
    const drum = (r: number, z0: number, z1: number, p: Part = white) => { smoothWall(p, circle(C, r, N2), z0, z1); capPoly(p, circle(C, r, N2), z1, true); capPoly(p, circle(C, r, N2), z0, false) }
    drum(8.2, H, H + 1.4)
    drum(7.2, H + 1.4, H + 2.7)
    drum(6.2, H + 2.7, 32.5)
    drum(2.6, 32.5, 37.5)
    drum(4.8, 37.5, 41.5, blue)
    drum(5.1, 41.5, 42.2)
    drum(3.0, 42.2, 43.2)
    // The lattice spire: four legs tapering to a mast, with bands.
    const legR = (z: number) => Math.max(0.2, 2.4 * (1 - (z - 43.2) / 40))
    const L = (k: number, z: number): V3 => { const a = Math.PI / 4 + (k * Math.PI) / 2, r = legR(z); return [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z] }
    const strut = (a: V3, b: V3, w: number) => {
      const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], vert = Math.abs(d[2]) > Math.hypot(d[0], d[1])
      const s: V3 = vert ? [w, 0, 0] : [0, 0, w]
      const h = Math.hypot(d[0], d[1]) || 1, t: V3 = vert ? [0, w, 0] : [(-d[1] / h) * w, (d[0] / h) * w, 0]
      const off = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
      const P = (p: V3, k: number): V3 => [p[0] + s[0] * off[k][0] + t[0] * off[k][1], p[1] + s[1] * off[k][0] + t[1] * off[k][1], p[2] + s[2] * off[k][0] + t[2] * off[k][1]]
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        const m: V3 = [s[0] * (off[i][0] + off[j][0]) + t[0] * (off[i][1] + off[j][1]), s[1] * (off[i][0] + off[j][0]) + t[1] * (off[i][1] + off[j][1]), s[2] * (off[i][0] + off[j][0]) + t[2] * (off[i][1] + off[j][1])]
        quadH(white, P(a, i), P(a, j), P(b, j), P(b, i), m)
      }
    }
    for (let k = 0; k < 4; k++) strut(L(k, 43.2), L(k, 80), 0.3)
    for (const z of [48, 54, 60, 66, 72, 78]) for (let k = 0; k < 4; k++) strut(L(k, z), L((k + 1) % 4, z), 0.2)
    for (const [za, zb] of [[43.2, 48], [48, 54], [54, 60], [60, 66], [66, 72]]) for (let k = 0; k < 4; k += 2) strut(L(k, za), L((k + 1) % 4, zb), 0.1)
    strut([C[0], C[1], 79], [C[0], C[1], 94], 0.2)
  }

  const W = { ...finish('arena-white', 0xf0efea), floodlight: (p: V3, n: V3) => (Math.hypot(p[0] - 36.3, p[1] - 92.5) < 9 && p[2] > 28 && n[2] < 0.7 ? 0.8 : 0) }
  return [
    { part: pre, material: finish('arena-precast', 0xd0c9bc) },
    { part: roof, material: finish('arena-roof', 0xe4e6e6) },
    { part: soffit, material: finish('arena-soffit', 0x9ba1a7) },
    { part: win, material: PALETTE.window },
    { part: blue, material: windowVariant(2, 0x5f80a8) },
    { part: white, material: W },
  ]
}

await save('nash-bridgestone-arena', 'Bridgestone Arena', build(), { height: 94, anchor: [36.159175, -86.778495], bearing: 332 })
