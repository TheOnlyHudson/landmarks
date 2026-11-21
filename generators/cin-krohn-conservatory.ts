/**
 * Krohn Conservatory, 1501 Eden Park Drive, Eden Park, Cincinnati (1933,
 * Art Deco aluminium-and-glass conservatory) —
 * original procedural geometry, CC0-1.0.
 * bun generators/cin-krohn-conservatory.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 39.7 (the building's own grid): the Palm House
 * runs along x (compass 129.7, toward the south-east); its tall glass
 * entrance gable faces Eden Park Drive at -x (compass 309.7). The long
 * cross wing runs along y.
 * Anchor = centroid of OSM relation/10390779, -84.490117, 39.115187.
 *
 * Identity (from the photos below):
 *  1. The tall Palm House with its glass entrance gable: vertical glass
 *     walls that round over a shoulder into a pointed, ogee-like gable,
 *     a bold aluminium glazing grid, the doors at its foot.
 *  2. The long, low cross wing either side of it: short walls under big
 *     curved (round-shouldered) whitewashed glass roofs with rounded ends.
 *  3. The tall white boiler chimney behind, and the low service buildings
 *     and show houses at the back.
 *
 * Plan: OSM relation/10390779 and its building:part ways read in the
 * turned frame: Palm House way/1315641821 x -26.6..28.9, y -0.6..17.5;
 * cross wing way/1315641823 x -17.6..-4.7, y -31.4..47.6; flat service
 * block way/1315641827; show houses way/1315641824, /1315641825,
 * /1315641826, /1315641828, /1315641829, /1459086203; chimney
 * way/1315641830. The relation's inner ring (a small court) is left open.
 *
 * Heights: USGS 3DEP lidar OH_StatewideP3_6_B21 (Ohio statewide phase 3,
 * flown about 2021), 1 m grid read in this frame. y = 0 is the lowest
 * ground under the footprint (the south-east corner, lidar ground_min +
 * 4.0); the entrance side stands about 2.3 m higher. Measured: Palm House
 * walls to about 8.4 (6 m above its own ground), ridge 14.7, the curved
 * profile sampled across it; cross wing walls about 5.0, ridge 9.5;
 * service block 6.0; show houses 5.3 to 8.9; chimney top 24.6.
 * Estimated from the photos: the shoulder curve, the glazing grid, the
 * rib spacing, the stone plinth, the entrance doors.
 *
 * Ground: Mapterhorn shows the site about 2.5 m lower at the south-east
 * corner than under the entrance, as lidar does; elevation 0.
 *
 * Night: glass stays dark (STYLE.md, glass roofs stay `glass`); the
 * entrance doors glow.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Krohn Panorama LR.jpg, Greg Hume, CC BY-SA 4.0 (the entrance front
 *    from the north-west, both wings, the chimney)
 *    https://commons.wikimedia.org/wiki/File:Krohn_Panorama_LR.jpg
 *  - KrohnConservatory.jpg, Greg5030 (Greg Hume), CC BY 3.0 (a wing and
 *    the Palm House roof from the west, the chimney)
 *    https://commons.wikimedia.org/wiki/File:KrohnConservatory.jpg
 *  - Krohn Conservatory (Cincinnati, Ohio) entrance.jpg, Michael R.
 *    Johnson, CC BY 2.0 (the entrance from inside: aluminium grid)
 *    https://commons.wikimedia.org/wiki/File:Krohn_Conservatory_(Cincinnati,_Ohio)_entrance.jpg
 * Aerial: USGS NAIP (public domain) for the plan and the roof tones.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the back (south-east) show houses are seen only in the aerial
 * and lidar, not in a photo; their roofs are drawn plain. The rib spacing
 * is sparser than the real glazing bars on purpose (phone size).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, gableRoof, hipRoof, onWall, rectShape, save, type XY } from './atl-tech-tower'

type Prof = [number, number][] // [half-width r, z] from the wall top (r = w) to the ridge (r ~ 0)

/**
 * A glass house over a rectangle, long axis `axis`: walls from 0 to the
 * profile's first z (a stone plinth to `plinth`), then the curved roof as
 * a loft of rectangles; `hip` rounds an end over with the same profile,
 * otherwise the end is a vertical gable in `endP`.
 */
function house(roof: Part, endP: Part, wallP: Part, plinthP: Part, x0: number, x1: number, y0: number, y1: number, axis: 'x' | 'y', prof: Prof, hip: [boolean, boolean], plinth = 1.0) {
  const w = prof[0][0]
  // map (along a, across c) to plan
  const P = (a: number, c: number, z: number): V3 => (axis === 'x' ? [a, c, z] : [c, a, z])
  const [a0, a1, cm] = axis === 'x' ? [x0, x1, (y0 + y1) / 2] : [y0, y1, (x0 + x1) / 2]
  const rings = prof.map(([r, z]) => {
    const d = w - r
    const e0 = hip[0] ? a0 + d : a0, e1 = hip[1] ? a1 - d : a1
    return { e0, e1, r: Math.max(r, 0.02), z }
  })
  // walls and plinth: counter-clockwise from above in plan
  const zw = prof[0][1]
  const ring: XY[] = axis === 'x' ? [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const loftRing = (p: Part, za: number, zb: number) => {
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4]
      p.quad([a[0], a[1], za], [b[0], b[1], za], [b[0], b[1], zb], [a[0], a[1], zb])
    }
  }
  loftRing(plinthP, 0, plinth)
  loftRing(wallP, plinth, zw)
  // P swaps (a, c) for axis y, which mirrors: flip the winding there
  const Q = (p: Part, a: V3, b: V3, c: V3, d: V3) => (axis === 'x' ? p.quad(a, b, c, d) : p.quad(d, c, b, a))
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k], B = rings[k + 1]
    // the two long sides (+c and -c)
    Q(roof, P(A.e0, cm + A.r, A.z), P(B.e0, cm + B.r, B.z), P(B.e1, cm + B.r, B.z), P(A.e1, cm + A.r, A.z))
    Q(roof, P(A.e1, cm - A.r, A.z), P(B.e1, cm - B.r, B.z), P(B.e0, cm - B.r, B.z), P(A.e0, cm - A.r, A.z))
    // the ends
    const pe0 = hip[0] ? roof : endP, pe1 = hip[1] ? roof : endP
    Q(pe0, P(A.e0, cm - A.r, A.z), P(B.e0, cm - B.r, B.z), P(B.e0, cm + B.r, B.z), P(A.e0, cm + A.r, A.z))
    Q(pe1, P(A.e1, cm + A.r, A.z), P(B.e1, cm + B.r, B.z), P(B.e1, cm - B.r, B.z), P(A.e1, cm - A.r, A.z))
  }
  return { P, a0, a1, cm }
}

/** Raised ribs across a vault (axis x or y) at along-positions `at`. */
function ribs(p: Part, axis: 'x' | 'y', cm: number, prof: Prof, at: number[], wdt = 0.3, out = 0.12) {
  const full: Prof = [...prof, ...[...prof].reverse().slice(1).map(([r, z]) => [-r, z] as [number, number])]
  for (const a of at) {
    for (let k = 0; k < full.length - 1; k++) {
      const [r0, z0] = full[k], [r1, z1] = full[k + 1]
      const dr = r1 - r0, dz = z1 - z0, L = Math.hypot(dr, dz)
      void L
      let onr = dz, onz = -dr
      const l = Math.hypot(onr, onz); onr /= l; onz /= l
      const Q = (r: number, z: number, s: number, h: number): V3 => {
        const c = cm + r + onr * h, zz = z + onz * h, aa = a + s
        return axis === 'x' ? [aa, c, zz] : [c, aa, zz]
      }
      const h = wdt / 2
      // top face
      const t = [Q(r0, z0, -h, out), Q(r0, z0, h, out), Q(r1, z1, h, out), Q(r1, z1, -h, out)]
      p.tri(t[0], t[1], t[2]); p.tri(t[0], t[2], t[3])
      p.tri(t[0], t[2], t[1]); p.tri(t[0], t[3], t[2])
    }
  }
}

if (import.meta.main) {
  const glass = new Part(), glass2 = new Part(), frame = new Part(), stone = new Part(), roof = new Part(), door = new Part()

  // ── the Palm House: along x, entrance gable at -x ──
  const PH: Prof = [[9.05, 8.4], [8.75, 9.7], [8.1, 10.7], [7.1, 11.4], [5.6, 11.9], [4.2, 12.4], [2.8, 13.1], [1.4, 14.0], [0, 14.9]]
  const PX0 = -26.6, PX1 = 28.9, PY0 = -0.6, PY1 = 17.5, PCM = (PY0 + PY1) / 2
  house(glass, glass2, glass2, stone, PX0, PX1, PY0, PY1, 'x', PH, [false, false], 2.8)

  // ── the cross wing: along y, rounded (hipped) ends ──
  const WG: Prof = [[6.45, 5.0], [6.1, 6.1], [5.4, 7.0], [4.4, 7.8], [3.0, 8.6], [1.4, 9.2], [0, 9.5]]
  const WX0 = -17.6, WX1 = -4.7, WCM = (WX0 + WX1) / 2
  house(glass, glass, glass, stone, WX0, WX1, -31.4, 47.6, 'y', WG, [true, true], 1.3)

  // ribs: Palm House every ~4.6 m, wing every ~6 m (kept sparse for phone size)
  ribs(frame, 'x', PCM, PH, Array.from({ length: 11 }, (_, i) => PX0 + 0.3 + i * ((PX1 - PX0 - 0.6) / 10)), 0.35, 0.1)
  ribs(frame, 'y', WCM, WG, [-24, -18, -12, -6, 20, 26, 32, 38, 44], 0.3, 0.08)

  // eave lines (a pale frame band at the wall head)
  const band = (x0: number, x1: number, y0: number, y1: number, z: number, h = 0.35, o = 0.08) => {
    const r: XY[] = [[x0 - o, y0 - o], [x1 + o, y0 - o], [x1 + o, y1 + o], [x0 - o, y1 + o]]
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4]
      frame.quad([a[0], a[1], z - h], [b[0], b[1], z - h], [b[0], b[1], z], [a[0], a[1], z])
    }
  }
  band(PX0, PX1, PY0, PY1, 8.4)
  band(WX0, WX1, -31.4, 47.6, 5.0)

  // ── the entrance gable's aluminium grid (both Palm House ends) ──
  const zAt = (r: number) => {
    const a = Math.abs(r)
    for (let k = 0; k < PH.length - 1; k++) {
      const [r0, z0] = PH[k], [r1, z1] = PH[k + 1]
      if (a <= r0 && a >= r1) return z0 + (z1 - z0) * (r0 - a) / (r0 - r1)
    }
    return PH[0][1]
  }
  for (const end of [-1, 1]) {
    const x = end < 0 ? PX0 : PX1
    // outside to the right of a→b
    const a: XY = end < 0 ? [x, PY1] : [x, PY0], b: XY = end < 0 ? [x, PY0] : [x, PY1]
    const W = PY1 - PY0
    const sToR = (s: number) => (end < 0 ? PY1 - s : PY0 + s) - PCM
    const zb = end < 0 ? 2.3 : 0.0 // the real ground at each end
    // mullions
    const nM = 8
    for (let i = 0; i <= nM; i++) {
      const s = 0.25 + i * (W - 0.5) / nM
      const top = zAt(sToR(s)) - 0.15
      const hw = i === 0 || i === nM ? 0.25 : 0.12
      onWall(frame, a, b, rectShape(s - hw, s + hw, zb, top), 0.08)
    }
    // transoms at the door head, the shoulder and above
    for (const z of [zb + 3.4, 8.4, 11.2]) {
      const r = 9.05
      let s0 = 0.1, s1 = W - 0.1
      if (z > 8.4) {
        // inside the profile at this height
        let rr = 0
        for (let k = 0; k < PH.length - 1; k++) { const [r0, z0] = PH[k], [r1, z1] = PH[k + 1]; if (z >= z0 && z <= z1) rr = r0 + (r1 - r0) * (z - z0) / (z1 - z0) }
        s0 = W / 2 - rr + 0.2; s1 = W / 2 + rr - 0.2
      }
      void r
      onWall(frame, a, b, rectShape(s0, s1, z - 0.15, z + 0.15), 0.09)
    }
    // the gable's edge band, following the profile
    for (const sgn of [-1, 1]) {
      for (let k = 0; k < PH.length - 1; k++) {
        const [r0, z0] = PH[k], [r1, z1] = PH[k + 1]
        const s0 = W / 2 + sgn * r0, s1 = W / 2 + sgn * r1
        const t = 0.4
        const q: [number, number][] = [[s0, z0], [s1, z1], [s1, z1 - t], [s0, z0 - t]]
        onWall(frame, a, b, q, 0.1)
      }
    }
  }
  // the entrance: doors and a flat canopy at the foot of the -x gable
  {
    const a: XY = [PX0, PY1], b: XY = [PX0, PY0], W = PY1 - PY0
    onWall(door, a, b, rectShape(W / 2 - 2.6, W / 2 + 2.6, 2.3, 5.2), 0.12)
    box(frame, PX0 - 2.2, PX0, PCM - 3.4, PCM + 3.4, 5.4, 5.8, frame, 0.1)
  }

  // ── service block (flat, white stone) and the low show houses at the back ──
  {
    const ring: XY[] = [[3.7, -4.8], [3.8, -12.6], [9.7, -12.6], [9.5, -19.7], [24.2, -19.9], [24.3, -17.1], [22.4, -17.1], [22.4, -15.2], [24.3, -15.3], [24.4, -12.3], [22.4, -12.3], [22.4, -7.3], [17.2, -7.3], [17.2, -4.1], [9.7, -4.2], [9.7, -4.7]]
    // simplify: two boxes
    box(stone, 3.7, 17.2, -12.6, -4.1, 0, 6.0, roof, 0.3)
    box(stone, 9.5, 24.3, -19.9, -7.3, 0, 6.0, roof, 0.3)
    void ring
    for (const [x0, x1, y0, y1] of [[3.7, 17.2, -12.6, -4.1], [9.5, 24.3, -19.9, -7.3]] as const) {
      // a coping line and a few windows
      const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
      void r
    }
    onWall(door, [24.3, -19.9], [24.3, -7.3], rectShape(1.5, 4.0, 0.0, 2.8), 0.06)
    for (const s of [6.5, 9.5]) onWall(door, [24.3, -19.9], [24.3, -7.3], rectShape(s, s + 1.8, 2.6, 4.4), 0.06)
  }
  // chimney: tall white stack
  box(stone, 22.3, 24.5, -17.3, -15.1, 0, 24.0, stone, 0.2)
  box(frame, 22.1, 24.7, -17.5, -14.9, 23.6, 24.6, roof, 0.15)

  // show houses (glass, plain hipped and gabled roofs on low walls)
  const showHip = (x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number) => {
    box(stone, x0, x1, y0, y1, 0, 1.0, null, 0)
    box(glass2, x0, x1, y0, y1, 1.0, eave, null, 0)
    hipRoof(glass, x0, x1, y0, y1, eave, ridge, 0.15)
  }
  showHip(-0.4, 15.6, -33.7, -23.5, 4.0, 6.7)
  showHip(15.6, 22.8, -33.7, -19.8, 5.5, 8.9)
  // gabled houses
  box(stone, -8.1, 9.6, -19.7, -12.5, 0, 1.0, null, 0)
  box(glass2, -8.1, 9.6, -19.7, -12.5, 1.0, 3.4, null, 0)
  gableRoof(glass, glass2, -8.1, 9.6, -19.7, -12.5, 3.4, 6.2, 'x', 0.15, 0.1)
  box(glass2, -3.2, 3.7, -12.5, -4.8, 0, 3.4, null, 0)
  gableRoof(glass, glass2, -3.2, 3.7, -12.5, -4.8, 3.4, 6.2, 'y', 0.15, 0.1)
  box(glass2, -7.0, 2.9, -27.5, -24.8, 0, 4.0, null, 0)
  gableRoof(glass, glass2, -7.0, 2.9, -27.5, -24.8, 4.0, 5.3, 'x', 0.1, 0.1)
  box(glass2, 9.5, 15.7, -23.5, -19.7, 0, 5.5, glass, 0.1)

  await save('cin-krohn-conservatory', 'Krohn Conservatory', [
    { part: glass, material: { name: 'glass', color: 0xd9e2e6, roughness: 0.3 } },
    { part: glass2, material: { name: 'glass-2', color: 0xa9bfcc, roughness: 0.24 } },
    { part: frame, material: finish('krohn-aluminium', 0xf4f4f0) },
    { part: stone, material: PALETTE.stone },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ], { height: 24.6, anchor: [39.115187, -84.490117], bearing: 39.7 })
}
