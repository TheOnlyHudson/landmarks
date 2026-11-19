/**
 * U.S. Customs House, 701 Broadway, Nashville (1877–82, William Appleton
 * Potter; extended 1903 and 1916) — original procedural geometry, CC0-1.0.
 * bun generators/nash-customs-house.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 332, so +y
 * points out of the Broadway front (north-north-west) and +x runs along
 * Broadway toward 6th Avenue. Anchor = area centroid of OSM
 * way/130905910, 36.158775, -86.781306. The façade axis (the tower) is at
 * x = -0.6. y = 0 is the lowest ground under the footprint (the rear east
 * corner, lidar 3.1 m above the box's ground_min); Broadway in front of
 * the tower is 2.8 m higher, falling to 0.7 at the east end.
 *
 * Identity, in order: the tall central clock tower on the Broadway front:
 * a rough grey stone shaft, a pale belfry stage with paired traceried
 * lancets between octagonal corner turrets, a gallery, the clock stage
 * and a steep slate pyramid spire; the triple pointed entrance porch under
 * a steep gable at its foot; the two steep gabled end bays of the front
 * block with their great traceried windows; storeys of pointed twin
 * windows and a top storey of square-headed triplets; the dark hipped
 * roofs; behind, the lower hipped pavilions of the 1903/1916 extensions
 * set back on either side, joined by a long mansard rear wing.
 *
 * Evidence:
 *  - plan: OSM way/130905910 (the whole Customs House, extensions
 *    included) and its tower part way/1040975824 (7.2 m square), checked
 *    against the lidar: front block x -24.4..23.2, y 0..24.5; tower
 *    x -4.2..3.0, y 18.4..25.4; porch y 24.5..26.6; pavilions x
 *    -44.6..-29.6 and 27.4..42.4, y -18..10; rear wing y -18..-4; low
 *    connectors between. The U.S. Courthouse (way/130905894) stands
 *    ~25 m to the east and is a separate building; not modelled.
 *  - heights: USGS 3DEP lidar TN_DavidsonCo_1_2022 (2022), 1 m grid in the
 *    model frame. Above y = 0: front block eaves 23.4, its hipped roof to
 *    a flat top at 27.6, front gables 29.9; belfry-turret pinnacles
 *    ~37–38.6, clock stage to ~46, spire 56.8; pavilion eaves 20.7, ridges 26.4–26.7; rear wing
 *    20.5 to a flat top at 23.9; connectors 10.1; porch ~11–12. Measured.
 *  - storeys, windows, the porch and the tower stages from LeMay's square
 *    view of the front (54384290121) and Jameson's north-east view,
 *    scaled to the lidar (estimated).
 *  - colours: grey limestone (sampled #beb6a3, pulled light), paler
 *    dressings, dark grey slate, red-brown doors.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - FederalOfficeBuildingNashville.jpg, Andrew Jameson, CC BY-SA 3.0
 *    (north-east) https://commons.wikimedia.org/wiki/File:FederalOfficeBuildingNashville.jpg
 *  - Old Customs House, Broadway and 7th Avenue, Nashville, TN -
 *    54384290121, 54384485214, 54384285416, 54384289811, w_lemay (Warren
 *    LeMay), CC BY-SA 2.0 (front square on, north-west across 7th Avenue,
 *    rear extension, tower)
 *    https://commons.wikimedia.org/wiki/File:Old_Customs_House,_Broadway_and_7th_Avenue,_Nashville,_TN_-_54384290121.jpg
 *    https://commons.wikimedia.org/wiki/File:Old_Customs_House,_Broadway_and_7th_Avenue,_Nashville,_TN_-_54384485214.jpg
 *  - Nashville Customs House 2022b.jpg, Brianlokelly, CC BY-SA 4.0 (the
 *    long side and rear wing)
 *    https://commons.wikimedia.org/wiki/File:Nashville_Customs_House_2022b.jpg
 *  - USGS NAIP (public domain): plan.
 * No look-only sources. No commercial imagery.
 *
 * Night: windows glow; doors are `entrance`; the front and the tower carry
 * floodlight.
 *
 * Left out: carving, crockets, the lettering over the door, chimneys,
 * finials and cresting, railings, steps' cheek walls, dormers on the rear
 * wing (drawn as a plain mansard), the light wells.
 *
 * Doubts: the rear wing and the pavilions' back faces are only seen
 * obliquely; their windows are drawn as an even rhythm of pointed
 * two-storey panels; the tower's stage heights are photo-scaled between
 * the lidar eave and spire.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, prism, save, type XY } from './atl-westin-peachtree-plaza'
import { opening, shape, rectOn, band, prismV, block, type Face } from './nash-ryman-auditorium'
import { wf, rect, chamfered, taper, type Side } from './nash-downtown-presbyterian'

/** A hipped roof over a rectangle: from the eaves at ze up to an inset top at zt (flat if `inset` < half the short side). */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zt: number, inset: number, over = 0.4) {
  const a = rect(x0 - over, y0 - over, x1 + over, y1 + over)
  const i = Math.min(inset + over, (Math.min(x1 - x0, y1 - y0) + 2 * over) / 2 - 0.05)
  const b = rect(x0 - over + i, y0 - over + i, x1 + over - i, y1 + over - i)
  taper(p, a, b, ze, zt)
  capPoly(p, a, ze, false)
}
/** A pointed or round window with a pale surround and hood. */
function win2(trim: Part, glass: Part, f: Face, s: number, w: number, z0: number, zs: number, head: 'round' | 'pointed' | 'flat' = 'pointed', sur = 0.2) {
  if (head === 'flat') {
    rectOn(trim, f, s - w / 2 - sur, s + w / 2 + sur, z0 - sur, zs + sur, 0.04)
    rectOn(glass, f, s - w / 2, s + w / 2, z0, zs, 0.08)
    return
  }
  shape(trim, f, opening(s, w + 2 * sur, z0 - sur, zs, head, 8), 0.04)
  shape(glass, f, opening(s, w, z0, zs, head, 8), 0.08)
}

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), door = new Part()

  const C = -0.6 // façade axis
  const FX0 = -24.4, FX1 = 23.2, FY0 = 0, FY1 = 24.5, FE = 23.4, FT = 27.6
  const TX0 = C - 3.6, TX1 = C + 3.6, TY0 = 18.4, TY1 = 25.4
  const BASE = 4.8 // top of the raised basement at the front
  // storey bands (model z)
  const S1 = [6.0, 9.4], S2 = [11.4, 14.8], S3 = [16.8, 19.8]

  // ── Front block ──
  prism(trim, rect(FX0 - 0.15, FY0, FX1 + 0.15, FY1 + 0.15), 0, BASE, trim, 0.05)
  prism(stone, rect(FX0, FY0, FX1, FY1), BASE, FE - 1.0, stone, 0.01)
  block(trim, FX0 - 0.45, FX1 + 0.45, FY0 - 0.2, FY1 + 0.45, FE - 1.0, FE)
  hip(slate, FX0, FY0, FX1, FY1, FE, FT, 7.0)
  // string courses
  {
    const { f } = wf('N', FY1, FX0, FX1)
    for (const z of [10.4, 15.9]) band(trim, f, 0, f.L, z, z + 0.35, 0.12)
    for (const dir of ['E', 'W'] as Side[]) {
      const { f: g } = wf(dir, dir === 'E' ? FX1 : FX0, FY0, FY1)
      for (const z of [10.4, 15.9]) band(trim, g, 0, g.L, z, z + 0.35, 0.12)
    }
  }
  // front: flanking bays and the gabled end bays
  {
    const { f, s } = wf('N', FY1, FX0, FX1)
    for (const sg of [-1, 1]) {
      for (const d of [5.6, 9.4]) {
        const x = C + sg * d
        for (const k of [-0.55, 0.55]) {
          win2(trim, win, f, s(x + k), 0.8, S1[0], S1[1] - 0.4)
          win2(trim, win, f, s(x + k), 0.8, S2[0], S2[1] - 0.4)
        }
        win2(trim, win, f, s(x), 2.4, S3[0], S3[1], 'flat', 0.2)
      }
      // gabled end bay: arcades of four, then the great window in the gable
      const xc = C + sg * 17.5
      prismV(stone, [[xc - 6.0, FE - 0.6], [xc + 6.0, FE - 0.6], [xc, 29.9]], [1, 0], [0, 0], 11.0, FY1 + 0.35, slate)
      for (const sx of [-1, 1]) {
        const a: V3 = [xc + sx * 6.2, FY1 + 0.5, FE - 0.7], b: V3 = [xc, FY1 + 0.5, 30.25], a2: V3 = [xc + sx * 6.2, FY1 - 0.4, FE - 0.7], b2: V3 = [xc, FY1 - 0.4, 30.25]
        const tq = (p: V3, q: V3, r: V3, t: V3, h: V3) => {
          const u = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], v = [r[0] - p[0], r[1] - p[1], r[2] - p[2]]
          const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
          if (n[0] * h[0] + n[1] * h[1] + n[2] * h[2] < 0) trim.quad(t, r, q, p)
          else trim.quad(p, q, r, t)
        }
        tq(a, b, b2, a2, [sx * 0.7, 0, 0.7])
        tq([a[0], a[1], a[2] - 0.45], [b[0], b[1], b[2] - 0.45], b, a, [0, 1, 0])
      }
      const { f: G } = wf('N', FY1 + 0.35, xc - 6, xc + 6)
      const gc = G.L / 2
      for (let i = 0; i < 4; i++) {
        const k = gc + (i - 1.5) * 2.0
        win2(trim, win, G, k, 1.0, S1[0], S1[1] - 0.4)
        win2(trim, win, G, k, 1.0, S2[0], S2[1] - 0.4)
      }
      shape(trim, G, opening(gc, 7.0, 16.5, 20.6, 'pointed', 12), 0.04)
      shape(win, G, opening(gc, 6.2, 16.8, 20.6, 'pointed', 12), 0.08)
      for (const d of [-1.86, -0.62, 0.62, 1.86]) rectOn(trim, G, gc + d - 0.09, gc + d + 0.09, 16.8, 20.6 + Math.sqrt(Math.max(0, 6.2 * 6.2 - (3.1 + Math.abs(d)) ** 2)) * 0.7, 0.11)
      rectOn(trim, G, gc - 3.1, gc + 3.1, 20.4, 20.65, 0.11)
    }
    // dormers either side of the tower
    for (const sg of [-1, 1]) {
      const x = C + sg * 7.5
      block(stone, x - 1.4, x + 1.4, FY1 - 1.6, FY1 - 0.2, FE - 0.2, FE + 2.6)
      prismV(stone, [[x - 1.6, FE + 2.5], [x + 1.6, FE + 2.5], [x, FE + 4.4]], [1, 0], [0, 0], FY1 - 2.0, FY1 - 0.2, slate)
      const { f: D } = wf('N', FY1 - 0.2, x - 1.4, x + 1.4)
      win2(trim, win, D, 1.4, 0.9, FE + 0.4, FE + 2.0, 'round', 0.18)
    }
  }
  // sides of the front block
  for (const [dir, X] of [['E', FX1], ['W', FX0]] as [Side, number][]) {
    const { f, s } = wf(dir, X, FY0, FY1)
    for (const y of [3.0, 7.4, 11.8, 16.2, 20.6]) {
      for (const k of [-0.55, 0.55]) {
        win2(trim, win, f, s(y + k), 0.8, S1[0], S1[1] - 0.4)
        win2(trim, win, f, s(y + k), 0.8, S2[0], S2[1] - 0.4)
      }
      win2(trim, win, f, s(y), 2.2, S3[0], S3[1], 'flat', 0.2)
      win2(trim, win, f, s(y), 1.6, 1.8, 3.6, 'flat', 0.15)
    }
  }

  // ── Entrance porch: three pointed doorways under a steep central gable ──
  {
    const PX0 = C - 9.5, PX1 = C + 9.5, PY0 = FY1, PY1 = 26.6, PT = 10.6
    prism(stone, rect(PX0, PY0, PX1, PY1), 0, PT - 0.6, stone, 0.01)
    block(trim, PX0 - 0.2, PX1 + 0.2, PY0, PY1 + 0.25, PT - 0.6, PT)
    prismV(stone, [[C - 3.6, PT - 0.3], [C + 3.6, PT - 0.3], [C, 14.4]], [1, 0], [0, 0], PY0, PY1, slate)
    const { f, s } = wf('N', PY1, PX0, PX1)
    for (const [d, w] of [[-6.0, 2.6], [0, 3.4], [6.0, 2.6]] as [number, number][]) {
      shape(trim, f, opening(s(C + d), w + 1.0, 2.8, 4.8 + w * 0.2, 'pointed', 10), 0.05)
      rectOn(door, f, s(C + d) - w / 2 + 0.25, s(C + d) + w / 2 - 0.25, 3.0, 5.6 + w * 0.2, 0.09)
      shape(win, f, opening(s(C + d), w - 0.5, 5.6 + w * 0.2, 5.65 + w * 0.2, 'pointed', 8), 0.1)
    }
    // three small lancets in the gable
    for (const d of [-0.7, 0, 0.7]) win2(trim, win, f, s(C + d), 0.4, 11.0, d ? 11.9 : 12.3, 'pointed', 0.1)
    // steps up to the doors
    for (let i = 0; i < 4; i++) block(trim, PX0 - 0.6, PX1 + 0.6, PY1 + i * 0.4, PY1 + (i + 1) * 0.4, 0, 2.8 - i * 0.6)
  }

  // ── The tower ──
  {
    const cx = C, cy = (TY0 + TY1) / 2, h = 3.6
    const T1 = 27.0, T2 = 35.5, T3 = 37.0, T4 = 46.0, SP = 55.8, FIN = 56.8
    prism(stone, rect(cx - h, cy - h + 0.05, cx + h, cy + h - 0.05), FE - 1.0, T1 - 0.5, stone, 0.01)
    block(trim, cx - h - 0.25, cx + h + 0.25, cy - h - 0.2, cy + h + 0.2, T1 - 0.5, T1)
    {
      const { f } = wf('N', TY1, cx - h, cx + h)
      win2(trim, win, f, h, 2.6, 17.4, 19.4, 'round', 0.3)
      for (const k of [-0.6, 0.6]) win2(trim, win, f, h + k, 0.7, 15.0, 16.6, 'pointed', 0.12)
    }
    // belfry: pale stone, paired traceried lancets on each face, corner turrets
    prism(trim, rect(cx - h + 0.3, cy - h + 0.3, cx + h - 0.3, cy + h - 0.3), T1, T2, trim, 0.01)
    for (const [dir, c, lo, hi] of [['N', cy + h - 0.3, cx - h, cx + h], ['S', cy - h + 0.3, cx - h, cx + h], ['E', cx + h - 0.3, cy - h, cy + h], ['W', cx - h + 0.3, cy - h, cy + h]] as [Side, number, number, number][]) {
      const { f } = wf(dir, c, lo, hi)
      for (const k of [-0.95, 0.95]) {
        shape(win, f, opening(f.L / 2 + k, 1.1, 28.6, 32.6, 'pointed', 8), 0.06)
        rectOn(trim, f, f.L / 2 + k - 0.07, f.L / 2 + k + 0.07, 28.6, 33.3, 0.09)
      }
    }
    // gallery band
    block(stone, cx - h - 0.15, cx + h + 0.15, cy - h - 0.15, cy + h + 0.15, T2, T3)
    // clock stage
    prism(trim, rect(cx - 2.6, cy - 2.6, cx + 2.6, cy + 2.6), T3, T4, trim, 0.01)
    for (const [dir, c, lo, hi] of [['N', cy + 2.6, cx - 2.6, cx + 2.6], ['S', cy - 2.6, cx - 2.6, cx + 2.6], ['E', cx + 2.6, cy - 2.6, cy + 2.6], ['W', cx - 2.6, cy - 2.6, cy + 2.6]] as [Side, number, number, number][]) {
      const { f } = wf(dir, c, lo, hi)
      for (const k of [-0.7, 0.7]) shape(win, f, opening(f.L / 2 + k, 0.6, 38.4, 40.0, 'pointed', 6), 0.06)
    }
    block(stone, cx - 3.1, cx + 3.1, cy - 3.1, cy + 3.1, T4 - 0.4, T4)
    for (const [dir, c, lo, hi] of [['N', cy + 2.6, cx - 2.6, cx + 2.6], ['S', cy - 2.6, cx - 2.6, cx + 2.6], ['E', cx + 2.6, cy - 2.6, cy + 2.6], ['W', cx - 2.6, cy - 2.6, cy + 2.6]] as [Side, number, number, number][]) {
      const { f } = wf(dir, c, lo, hi)
      const ring: XY[] = Array.from({ length: 12 }, (_, i) => [f.L / 2 + 1.1 * Math.cos((i / 12) * Math.PI * 2), 42.6 + 1.1 * Math.sin((i / 12) * Math.PI * 2)])
      shape(stone, f, ring.map(([a, b]) => [f.L / 2 + (a - f.L / 2) * 1.2, 42.6 + (b - 42.6) * 1.2] as XY), 0.04)
      shape(trim, f, ring, 0.07)
    }
    // corner turrets with pinnacles
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const x = cx + sx * (h - 0.1), y = cy + sy * (h - 0.1)
      taper(trim, chamfered(x, y, 0.75, 0.75, 0.3), chamfered(x, y, 0.75, 0.75, 0.3), T1 - 1.5, T3 - 0.6, null)
      taper(trim, chamfered(x, y, 0.85, 0.85, 0.34), chamfered(x, y, 0.05, 0.05, 0.02), T3 - 0.6, 38.6)
    }
    // the steep slate spire, a lucarne on each face, finial
    taper(slate, rect(cx - 3.0, cy - 3.0, cx + 3.0, cy + 3.0), rect(cx - 0.15, cy - 0.15, cx + 0.15, cy + 0.15), T4, SP)
    for (const [ax, ay] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const lx = cx + ax * 2.1, ly = cy + ay * 2.1
      if (ax === 0) prismV(trim, [[lx - 0.7, T4 + 1.2], [lx + 0.7, T4 + 1.2], [lx, T4 + 3.2]], [1, 0], [0, 0], ly - 0.8, ly + 0.8, trim)
      else prismV(trim, [[ly - 0.7, T4 + 1.2], [ly + 0.7, T4 + 1.2], [ly, T4 + 3.2]], [0, 1], [0, 0], -lx - 0.8, -lx + 0.8, trim)
      block(trim, lx - (ax ? 0.8 : 0.7), lx + (ax ? 0.8 : 0.7), ly - (ay ? 0.8 : 0.7), ly + (ay ? 0.8 : 0.7), T4 - 0.2, T4 + 1.25)
    }
    taper(trim, chamfered(cx, cy, 0.2, 0.2, 0.08), chamfered(cx, cy, 0.03, 0.03, 0.01), SP - 0.3, FIN)
  }

  // ── Pavilions (1903/1916), rear wing and the low connectors ──
  const PE = 20.7
  const pav = (x0: number, x1: number) => {
    prism(trim, rect(x0 - 0.1, -18, x1 + 0.1, 10.1), 0, 2.2, trim, 0.05)
    prism(stone, rect(x0, -18, x1, 10), 2.2, PE - 0.8, stone, 0.01)
    block(trim, x0 - 0.35, x1 + 0.35, -4, 10.35, PE - 0.8, PE)
    hip(slate, x0, -4, x1, 10, PE, 26.5, 20)
    for (const [dir, c, lo, hi] of [['N', 10, x0, x1], ['E', x1, -4, 10], ['W', x0, -4, 10]] as [Side, number, number, number][]) {
      const { f } = wf(dir, c, lo, hi)
      const n = Math.max(2, Math.round(f.L / 3.4)), bw = f.L / n
      for (let i = 0; i < n; i++) {
        const sc = bw * (i + 0.5)
        if ((dir === 'E' && x1 < 0) || (dir === 'W' && x0 > 0)) continue // faces against the connectors
        win2(trim, win, f, sc, 1.2, 4.2, 9.0)
        win2(trim, win, f, sc, 1.2, 10.4, 15.0)
        win2(trim, win, f, sc, 1.6, 16.4, 19.0, 'flat', 0.15)
      }
      band(trim, f, 0, f.L, 9.8, 10.1, 0.1)
    }
  }
  pav(-44.6, -29.6)
  pav(27.4, 42.4)
  // rear wing: across the whole width, a mansard to a flat top
  {
    const x0 = -44.6, x1 = 42.4, y0 = -18, y1 = -4
    prism(stone, rect(x0, y0, x1, y1), 2.2, 20.5, stone, 0.01)
    block(trim, x0 - 0.3, x1 + 0.3, y0 - 0.3, y1, 19.9, 20.5)
    taper(slate, rect(x0, y0, x1, y1), rect(x0 + 2, y0 + 2, x1 - 2, y1 - 2), 20.5, 23.9)
    for (const [dir, c, lo, hi] of [['S', y0, x0, x1], ['E', x1, y0, y1], ['W', x0, y0, y1]] as [Side, number, number, number][]) {
      const { f } = wf(dir, c, lo, hi)
      const n = Math.max(2, Math.round(f.L / 3.4)), bw = f.L / n
      for (let i = 0; i < n; i++) {
        const sc = bw * (i + 0.5)
        win2(trim, win, f, sc, 1.2, 4.2, 9.0)
        win2(trim, win, f, sc, 1.2, 10.4, 15.0)
        win2(trim, win, f, sc, 1.6, 16.4, 19.0, 'flat', 0.15)
        if (dir === 'S' && i % 2 === 0) {
          // dormers on the mansard
          const p = f.P(sc, 0, 0)
          block(slate, p[0] - 0.9, p[0] + 0.9, y0 + 0.4, y0 + 1.6, 20.4, 23.0)
          const { f: D } = wf('S', y0 + 0.4, p[0] - 0.9, p[0] + 0.9)
          rectOn(win, D, 0.45, 1.35, 21.0, 22.5, 0.06)
        }
      }
    }
    prism(trim, rect(x0 - 0.1, y0 - 0.1, x1 + 0.1, y1), 0, 2.2, trim, 0.05)
  }
  // connectors (courtyard infill, ~10 m)
  prism(stone, rect(-29.6, -4, FX0, 10), 0, 10.1, slate, 0.2)
  prism(stone, rect(FX1, -4, 27.4, 10), 0, 10.1, slate, 0.2)
  prism(stone, rect(FX0, -4, FX1, FY0), 0, 10.1, slate, 0.2)

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[1] > 15 && n[1] > 0.5 ? 0.8 : p[1] > 15 && Math.abs(p[0] - C) < 5 ? 0.7 : 0)
  return [
    { part: stone, material: { ...finish('customs-limestone', 0xd3ccbb), floodlight: flood } },
    { part: trim, material: { ...finish('customs-dressings', 0xe9e4d8), floodlight: flood } },
    { part: slate, material: finish('customs-slate', 0x777d84) },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x8a6448 } },
  ]
}

if (import.meta.main) {
  await save('nash-customs-house', 'U.S. Customs House', build(), { height: 56.8, anchor: [36.158775, -86.781306], bearing: 332 }, 6500)
}
