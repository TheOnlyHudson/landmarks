/**
 * JW Marriott Nashville (201 8th Avenue South), Nashville (2018, Gensler)
 * — original procedural geometry, CC0-1.0.
 * bun generators/nash-jw-marriott.ts [out.glb]
 * (Uses the small kit exported by generators/nash-pinnacle.ts.)
 *
 * Identity: OSM way/454073460 ("J.W. Marriott", building=hotel) is the
 * whole site: the 33-storey oval tower and the podium it stands on
 * (ballrooms and garage), between 8th Ave, Demonbreun and the Music City
 * Center. The photos and the aerial show one curved glass tower on it, with
 * the JW MARRIOTT sign and the rooftop restaurant ring at its north end:
 * the tower is the hotel.
 *
 * Map frame: x, y in plan, z up, metres; origin at the anchor on the lowest
 * ground under the footprint (the podium's north-east corner, on 7th Ave;
 * the ground rises ~7 m to the south-west). Anchor = area centroid of
 * way/454073460 (36.1560184, -86.7810751). Bearing 62° (the street grid):
 * +y faces 62°, +x faces 152°. The tower stands in the north-west part of
 * the site, its long axis at bearing 18°, centred at (-40.0, 25.2).
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the tall oval glass tower (a rounded lozenge about 62 x 27 m), its
 *   glass running up flat to a level rim;
 * - the rooftop restaurant ring: a two-storey glazed band cantilevered
 *   round the tower's north end, its arms tapering back along both sides,
 *   with a pale soffit and fascia (2-3 storeys below the rim);
 * - pale horizontal floor bands round the glass (drawn every three floors);
 * - the low pale-stone podium round it, its ground-floor glazing set on
 *   each wall's own ground (the site rises ~7 m to the south-west).
 *
 * Evidence
 * - OSM: way/454073460 (hotel, no height, no parts). Read in this frame;
 *   its west strip (x < -62) and south-west lobe are open ground in the
 *   lidar and NAIP (a drive), so the podium stops at x = -62 there.
 * - Lidar: USGS 3DEP TN_DavidsonCo_1_2022 (2022 flight), 1 m grid, read in
 *   this frame and in one turned to 22° to fit the oval. Base = the lowest
 *   ground under the footprint, 3.0 m above the box's ground_min. Measured
 *   above it: the rim 119.4 m (both ends), roof inside it 113.4-117 m; the
 *   restaurant ring's roof 113.5 m, reaching ~5.5 m past the rim at the
 *   north tip; the oval 62 m long at the top (68 m with the ring) and 27 m
 *   wide; podium 17 m (west), 18.8 m (centre), 21.2 m (east), 16.5 m (the
 *   7th Ave edge).
 * - Published: 33 storeys, opened 2018 (Wikipedia "JW Marriott Nashville").
 * - NAIP (USDA, public domain): the oval plan and the pool in the podium.
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   JW Marriott Nashville 8-28-2019.jpg, JayWells11, CC BY-SA 4.0 (from the
 *     south-west, low: floor bands, the ring, the stone podium);
 *   JW Marriott Hotel, 8th Avenue and Demonbreun Street, Nashville, TN
 *     (54384668350), Warren LeMay, CC BY-SA 2.0 (the ring and sign from the
 *     north-west, used to scale the ring's height);
 *   JW Marriott Nashville during a storm.jpg, TennesseeEditor, CC BY-SA 4.0
 *     (broadside from the south-east, far: proportions, podium).
 *   No look-only sources were used. No commercial imagery.
 * - Colours from those photos, pulled to the palette: pale sky-blue
 *   reflective glass, pale warm-grey bands and ring, pale beige stone
 *   podium.
 * - Night: the hotel floors and the restaurant ring glow (window,
 *   window-2).
 *
 * Estimated: the ring's soffit height (106 m, from LeMay's photo) and how
 *   far its arms run back; the oval's exponent (from NAIP); the podium's
 *   ground-floor glazing (one band all round).
 * Left out: the JW MARRIOTT letters (a plain hotel sign), the pool deck.
 * Doubts: the podium's south and east faces have no close photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, at, poly, ccw, bevel, prism, walls, cap, panels, save, type Layer } from './nash-pinnacle'

const RIM = 119.4, ROOF_IN = 116.8
const RING_Z0 = 105.5, RING_Z1 = 113.5
const N = 36

// the tower's own frame: v along the axis (bearing 18°), u across
const C: XY = [-40.0, 25.2]
const AX: XY = [Math.sin(-44 * Math.PI / 180), Math.cos(-44 * Math.PI / 180)]
const RT: XY = [AX[1], -AX[0]]
const T = (u: number, v: number): XY => [C[0] + u * RT[0] + v * AX[0], C[1] + u * RT[1] + v * AX[1]]

// the oval: a superellipse, half-length 31 (centred 2.5 m south), half-width 13.5
const HL = 31, HW = 13.5, VC = -2.5, EXP = 2.6
const sg = (x: number) => Math.sign(x) * Math.abs(x) ** (2 / EXP)
const ovalUV = (t: number, grow = 0): [number, number] => [(HW + grow) * sg(Math.cos(t)), VC + (HL + grow) * sg(Math.sin(t))]
const oval = (grow = 0): XY[] => Array.from({ length: N }, (_, i) => { const [u, v] = ovalUV((2 * Math.PI * i) / N, grow); return T(u, v) })

/** Clip a ring to x0 <= x < x1 (Sutherland-Hodgman, two half-planes). */
function clipX(r: XY[], x0: number, x1: number): XY[] {
  const half = (p: XY[], keep: (q: XY) => boolean, X: number) => {
    const out: XY[] = []
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length]
      if (keep(a)) out.push(a)
      if (keep(a) !== keep(b)) { const t = (X - a[0]) / (b[0] - a[0]); out.push([X, a[1] + t * (b[1] - a[1])]) }
    }
    return out
  }
  return half(half(r, (q) => q[0] >= x0, x0), (q) => q[0] <= x1, x1)
}

// the OSM outline in this frame, rounded to 0.1 m
const SITE: XY[] = [
  [-4.2, -12.5], [-54.6, -12.5], [-51.1, -16.5], [-50.2, -18.5], [-49.8, -20.5], [-50.9, -26.3], [-54.6, -30.4],
  [-56.8, -31.6], [-61.2, -32.2], [-66.2, -30.4], [-66.0, 46.6], [-65.5, 47.9], [-64.4, 49.1], [-59.8, 50.8],
  [-57.6, 50.6], [-39.5, 41.8], [-34.2, 44.5], [-29.4, 46.8], [-14.3, 42.0], [0.0, 42.6], [2.7, 43.8], [18.6, 50.6],
  [37.0, 51.3], [42.7, 49.6], [48.3, 45.3], [50.9, 41.2], [50.3, -51.9], [48.1, -51.9], [48.0, -65.8], [-4.6, -65.7],
]
// the podium: the outline without its open west strip and lobe (lidar ground)
const PODIUM: XY[] = [[-4.2, -12.5], [-62.0, -12.5], [-62.0, 49.9], ...SITE.slice(13)]

function build(): Layer[] {
  const glass = new Part()   // the tower's curtain wall (glows at night)
  const ring = new Part()    // the restaurant ring's glazing (glows at night)
  const trim = new Part()    // pale floor bands, the ring's soffit and fascia, the rim
  const stone = new Part()   // the podium
  const roof = new Part()

  // --- the podium, in four height zones ---
  const zones: [number, number, number][] = [[-70, -30, 17.0], [-30, 12, 18.8], [12, 42, 21.2], [42, 60, 16.5]]
  for (const [x0, x1, h] of zones) {
    const r = ccw(clipX(PODIUM, x0, x1))
    if (r.length < 3) continue
    prism(stone, r, 0, h, roof)
    // ground-floor glazing, set on each wall's own ground (lidar: the site
    // rises ~7 m from the north-east corner to the south-west)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 4) continue
      const g = Math.max(0, 4.0 - 0.023 * (a[0] + b[0]) / 2 - 0.0265 * (a[1] + b[1]) / 2)
      if (g + 6.2 < h - 2) panels(glass, a, b, [[g + 1.2, g + 6.2]], 6.5, 1.4)
    }
  }

  // --- the oval tower, from the ground (its north-west side stands on the street) ---
  const o = ccw(oval())
  walls(glass, o, 0, 16)
  walls(glass, o, 16, RIM)
  // the rim and the roof set into it
  const inner = ccw(oval(-1.0))
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    trim.quad(at(o[i], RIM), at(o[j], RIM), at(inner[j], RIM), at(inner[i], RIM))
    trim.quad(at(inner[j], RIM), at(inner[i], RIM), at(inner[i], ROOF_IN), at(inner[j], ROOF_IN))
  }
  cap(roof, inner, ROOF_IN)

  // floor bands: 0.45 m tall, 0.12 m proud, every three floors (3.4 m) above the podium
  const band = (r: XY[], z: number, out: number, h: number, p: Part) => {
    const g = r.map((q, i) => {
      const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
      return [q[0] + (dy / l) * out, q[1] - (dx / l) * out] as XY
    })
    for (let i = 0; i < r.length; i++) {
      const j = (i + 1) % r.length
      p.quad(at(g[i], z), at(g[j], z), at(g[j], z + h), at(g[i], z + h))
      p.quad(at(r[i], z + h), at(g[i], z + h), at(g[j], z + h), at(r[j], z + h))
    }
  }
  for (let z = 22.5; z < RING_Z0 - 2; z += 3 * 3.4) band(o, z, 0.12, 0.45, trim)
  band(o, RIM - 1.0, 0.12, 0.6, trim)

  // --- the restaurant ring round the north end ---
  // outward reach d(t): 5.5 m at the tip (t = 90°), tapering to 0 about 100° either side
  const reach = (t: number) => { const dd = Math.abs(t - Math.PI / 2); return dd < 1.8 ? 5.8 * Math.cos((dd / 1.8) * Math.PI / 2) : 0 }
  const M = 32
  const pts: { a: XY; b: XY }[] = []
  for (let k = 0; k <= M; k++) {
    const t = Math.PI / 2 - 1.8 + (3.6 * k) / M
    const [u, v] = ovalUV(t), d = reach(t)
    const [u2, v2] = ovalUV(t, d)
    pts.push({ a: T(u, v), b: T(u2, v2) })
  }
  // sides are wound with the oval (counter-clockwise from above), so a→next runs with the outside on the right
  const S0 = RING_Z0, S1 = RING_Z0 + 1.2, G1 = RING_Z1 - 1.3
  for (let k = 0; k < M; k++) {
    const p = pts[k], q = pts[k + 1]
    // outward = away from the oval's centre line, across the edge
    const mid: XY = [(p.b[0] + q.b[0]) / 2 - (p.a[0] + q.a[0]) / 2, (p.b[1] + q.b[1]) / 2 - (p.a[1] + q.a[1]) / 2]
    const out: V3 = [mid[0], mid[1], 0]
    const face = (pp: Part, z0: number, z1: number) => poly(pp, [at(p.b, z0), at(q.b, z0), at(q.b, z1), at(p.b, z1)], out)
    face(trim, S0, S1); face(ring, S1, G1); face(trim, G1, RING_Z1)
    poly(trim, [at(p.a, S0), at(q.a, S0), at(q.b, S0), at(p.b, S0)], [0, 0, -1])
    poly(trim, [at(p.a, RING_Z1), at(q.a, RING_Z1), at(q.b, RING_Z1), at(p.b, RING_Z1)], [0, 0, 1])
  }

  return [
    { part: glass, material: { ...PALETTE.window, color: 0x9ab2c8 } },
    { part: ring, material: { ...PALETTE.window, name: 'window-2', color: 0x6d8296 } },
    { part: trim, material: finish('jw-band', 0xdcd6cc) },
    { part: stone, material: finish('jw-stone', 0xddd2c2) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  await save('nash-jw-marriott', 'JW Marriott Nashville', build(), {
    bearing: 62, height: RIM, replaces: ['way/454073460'],
  })
}
