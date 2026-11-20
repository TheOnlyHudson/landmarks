/**
 * SS William G. Mather (1925), Great Lakes bulk freighter, museum ship at
 * the East 9th Street pier, North Coast Harbor, Cleveland — original
 * procedural geometry, CC0-1.0.
 * bun generators/cle-william-g-mather.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * waterline. Anchor = area centroid of the OSM outline way/172623124
 * (building=ship, Q7605487), 41.5093112,-81.6980975. The hull's axis runs
 * at 146.2° and the bow is the south-east end (the lidar puts the pilothouse
 * and its mast there and the stack at the north-west end), so the catalog
 * bearing is 146.2: +y is the bow, +x starboard. The hull runs from
 * y -94.7 (stern) to +93.4 (stem): 188.1 m, published 188.4 m (618 ft).
 *
 * Identity, in order: the long, low black hull with the forward pilothouse
 * block right at the bow and the engine house and tall black stack at the
 * stern, the whole cargo deck between them a row of red hatch covers; the
 * red stripe that runs along the hull under the deck edge and climbs
 * diagonally to the raised forecastle; the white cabins with their red
 * bands.
 *
 * Evidence:
 *  - plan: OSM outline (traced slightly askew; drawn symmetric about the
 *    axis), its parallel body widened to the published beam of 18.9 m
 *    (62 ft; OSM 18.4 m).
 *  - heights, measured: USGS 3DEP lidar OH_Statewide_Phase1_1_2019 (2019),
 *    1 m grid read in this frame, above the lake surface (water returns
 *    and the map's terrain both at 174.55-174.56 m). Spar-deck edge 7.6 m
 *    aft, 7.9 amidships, 8.5 at y 54, 8.8 at the forecastle break; hatch
 *    covers 0.5-1.0 m above it; forecastle deck 11.6 m around the forward
 *    cabins (y 74-76); first cabin level to 14.0 m, pilothouse roof 17.2 m,
 *    the compass deck and radar to 19.9 m; foremast 25.4 m (y 77); aft
 *    deckhouse roof 10.6-11.3 m (y -54 to -92), skylights to 13.4 m; stack
 *    top 19.6 m (y -62 to -68, 5-6 m across in the 1 m cells; drawn
 *    6 m, as fat as the photos show it).
 *  - forms and colours: the photos below. Black hull (the brief's "red-
 *    brown hull" is the red-oxide hatch deck; the hull itself is black in
 *    every photo since 2009, pulled to charcoal); red sheer stripe and
 *    cabin bands; white cabins with grey roofs; black stack with the red
 *    Cleveland-Cliffs ring on each side; the aft deckhouse roof red-brown
 *    and the forward roofs grey (NAIP).
 *  - hatches: the real ship has many narrow red-oxide covers; drawn as 16
 *    broader covers on a grey spar deck so the deck's rhythm reads without
 *    shimmering (the deck between them is darker than the covers).
 *  - elevation 0: OSM maps the ship as a building on the water; terrain.ts
 *    shows the slip flat at lake level under the hull (the pier rises to
 *    1.6 m about 10 m off the port side). y = 0 is the waterline; nothing
 *    below it and no water is modelled.
 *  - night: cabin and pilothouse windows and portholes glow (window).
 *
 * Photos: William G. Mather in Cleveland-2010-04-03-025 (Perry Quan, CC
 * BY-SA 2.0); SS William G. Mather (514086820) (Jim Bowen, CC BY 2.0);
 * Cleveland August 2015 51 (SS William G. Mather) (Michael Barera, CC BY-SA
 * 4.0); William G. Mather Steamship (51267097492) (Erik Drost, CC BY 2.0,
 * silhouette); all Wikimedia Commons. USGS NAIP for the plan, the bow's
 * direction and the roof colours. No commercial imagery.
 * Look-only: none.
 *
 * Left out: the CLEVELAND-CLIFFS and name lettering on the hull (not a
 * sign landmark), railings, the hatch crane and its rails, winches,
 * ventilators, lifeboats and davits, rigging, the gangways.
 *
 * Doubts: the starboard (harbour) side is drawn as the port side; the
 * cabins' window rows are simplified from the port-side photos. The
 * forecastle's height above the lidar's sparse bow returns rests on the
 * photos. The stack's exact diameter is from the lidar's 1 m cells.
 */
import { Part, type V3, cross, sub } from './mesh'
import { PALETTE, finish } from './palette'
import { save, walls, cap, triangulate, inset, lathe, type XY } from './chi-aon-center'

const pl = (t: [number, number][]) => (y: number) => {
  if (y <= t[0][0]) return t[0][1]
  for (let i = 1; i < t.length; i++) if (y <= t[i][0]) {
    const [y0, v0] = t[i - 1], [y1, v1] = t[i]
    return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0)
  }
  return t[t.length - 1][1]
}
const Y0 = -94.7, Y1 = 93.4
// Half-beam, from the OSM outline, symmetric.
const hw = pl([[Y0, 0], [-94.3, 1.9], [-93, 3.3], [-91.6, 4.6], [-87.7, 6.0], [-82.4, 7.0], [-70, 8.4], [-55, 9.4], [61, 9.4], [68, 9.2], [75.3, 8.5], [80, 7.6], [85, 6.4], [88.5, 4.8], [91, 3.0], [92.7, 1.6], [Y1, 0]])
// Hull top: the spar deck's sheer, then the raised forecastle.
const top = pl([[Y0, 8.4], [-60, 8.0], [-36, 7.6], [0, 7.9], [30, 8.1], [54, 8.5], [64, 8.8], [73, 11.6], [Y1, 12.0]])

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function face(p: Part, pts: V3[], want: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const r = dot(g, want) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < r.length - 1; i++) p.tri(r[0], r[i], r[i + 1])
}

function build() {
  const hull = new Part(), red = new Part(), white = new Part(), win = new Part(), roof = new Part()

  // ------------------------------------------------------------- hull
  const ys: number[] = [Y0, -94.3, -93, -91.6, -89.5, -87.7, -85, -82.4, -78, -74, -70, -65, -60, -55]
  for (let y = -50; y <= 60; y += 5) ys.push(y)
  ys.push(64, 66, 68, 70, 73, 75.3, 78, 80, 82.5, 85, 87, 88.5, 90, 91, 92, 92.7, Y1)
  // A ring counter-clockwise from above: starboard side bow-ward, port aft.
  const ring: XY[] = [...ys.slice(0, -1).map((y) => [hw(y), y] as XY), [0, Y1], ...ys.slice(1, -1).reverse().map((y) => [-hw(y), y] as XY), [0, Y0]]
  const uniq = ring.filter((p, i) => i === 0 || Math.hypot(p[0] - ring[i - 1][0], p[1] - ring[i - 1][1]) > 1e-6)
  for (let i = 0; i < uniq.length; i++) {
    const a = uniq[i], b = uniq[(i + 1) % uniq.length]
    hull.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], top(b[1])], [a[0], a[1], top(a[1])])
  }
  // The spar deck, grey, following the sheer, in strips across.
  for (let i = 0; i < ys.length - 1; i++) {
    const y0 = ys[i], y1 = ys[i + 1], a = hw(y0), b = hw(y1)
    face(roof, [[-a, y0, top(y0)], [a, y0, top(y0)], [b, y1, top(y1)], [-b, y1, top(y1)]].filter((v, k, arr) => arr.findIndex((u) => u[0] === v[0] && u[1] === v[1]) === k) as V3[], [0, 0, 1])
  }

  // The red stripe under the deck edge, and its climb to the forecastle.
  const stripe = (y: number): [number, number] => {
    if (y < 60) return [top(y) - 1.95, top(y) - 1.05]
    const t = Math.min(1, (y - 60) / 12)
    const z0 = top(60) - 1.95 + t * (10.7 - (top(60) - 1.95))
    return [z0, z0 + 0.9]
  }
  const sy: number[] = [-85, -82.4, -78, -74, -70, -65, -60, -55]
  for (let y = -50; y <= 60; y += 5) sy.push(y)
  sy.push(63, 66, 69, 72)
  for (const s of [1, -1]) for (let i = 0; i < sy.length - 1; i++) {
    const y0 = sy[i], y1 = sy[i + 1], [a0, a1] = stripe(y0), [b0, b1] = stripe(y1)
    const x0 = s * (hw(y0) + 0.05), x1 = s * (hw(y1) + 0.05)
    face(red, [[x0, y0, a0], [x1, y1, b0], [x1, y1, b1], [x0, y0, a1]], [s, 0, 0])
  }

  // Hatch covers along the cargo deck.
  const bbox = (wall: Part, topP: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0.25) => {
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], i = inset(r, b)
    walls(wall, r, z0, z1 - b); walls(wall, r, z1 - b, z1, i); cap(topP, i, z1)
  }
  for (let k = 0; k < 16; k++) {
    const y0 = -50 + k * 6.8, y1 = y0 + 4.6, z = top((y0 + y1) / 2)
    bbox(red, red, -6.8, 6.8, y0, y1, z - 0.1, z + 0.8)
  }

  // ------------------------------------------------- forward cabins
  /** A deckhouse following the hull, inset `d`, between y0 and y1. */
  const house = (d: number, y0: number, y1: number, n = 8): XY[] => {
    const yy = Array.from({ length: n + 1 }, (_, i) => y0 + ((y1 - y0) * i) / n)
    return [...yy.map((y) => [Math.max(0.5, hw(y) - d), y] as XY), ...[...yy].reverse().map((y) => [-Math.max(0.5, hw(y) - d), y] as XY)]
  }
  const fc = 11.6
  const lowF = house(1.0, 74.5, 90.5)
  walls(white, lowF, fc - 0.2, 13.6)
  const bandF = house(0.8, 76, 90.7)
  walls(red, bandF, 13.6, 14.8)
  cap(roof, bandF, 14.8)
  // The pilothouse, its window band, and the compass deck above.
  const ph: XY[] = [[6.2, 80], [6.2, 88.6], [4.6, 90.3], [-4.6, 90.3], [-6.2, 88.6], [-6.2, 80]].reverse() as XY[]
  const phc: XY[] = [[6.2, 80], [6.2, 88.6], [4.6, 90.3], [-4.6, 90.3], [-6.2, 88.6], [-6.2, 80]]
  // counter-clockwise from above
  const ccw = (r: XY[]) => (r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) > 0 ? r : [...r].reverse())
  const P = ccw(phc)
  void ph
  walls(white, P, 14.8, 17.2)
  cap(roof, P, 17.2)
  walls(white, ccw([[2.6, 82], [2.6, 86.5], [-2.6, 86.5], [-2.6, 82]]), 17.2, 18.6)
  cap(roof, ccw([[2.6, 82], [2.6, 86.5], [-2.6, 86.5], [-2.6, 82]]), 18.6)
  // Window bands: pilothouse all round but the back; portholes below.
  const band = (r: XY[], z0: number, z1: number, skipBack: number | null, seg = 2.2, gap = 0.6) => {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 1.5) continue
      if (skipBack !== null && Math.abs(a[1] - skipBack) < 0.01 && Math.abs(b[1] - skipBack) < 0.01) continue
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      const k = Math.max(1, Math.round(L / (seg + gap))), w = L / k
      for (let q = 0; q < k; q++) {
        const s0 = q * w + gap / 2, s1 = (q + 1) * w - gap / 2
        const Q = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.05, a[1] + u[1] * s + n[1] * 0.05, z]
        face(win, [Q(s0, z0), Q(s1, z0), Q(s1, z1), Q(s0, z1)], [n[0], n[1], 0])
      }
    }
  }
  band(P, 15.7, 16.7, 80, 1.6, 0.35)
  band(ccw(lowF), 12.4, 13.0, 74.5, 0.8, 1.1)
  // Foremast on the cabin roof behind the pilothouse, with its yard.
  const tube = (p: Part, A: V3, B: V3, r: number, n = 6) => {
    const ring = (C: V3) => Array.from({ length: n }, (_, k) => [C[0] + r * Math.cos((k / n) * 2 * Math.PI), C[1] + r * Math.sin((k / n) * 2 * Math.PI), C[2]] as V3)
    const a = ring(A), b = ring(B)
    for (let k = 0; k < n; k++) { const j = (k + 1) % n; face(p, [a[k], a[j], b[j], b[k]], sub(a[k], A)) }
    face(p, b, [0, 0, 1])
  }
  tube(hull, [0, 77.5, 14.8], [0, 77.5, 25.3], 0.3)
  face(hull, [[-3, 77.4, 21.6], [3, 77.4, 21.6], [3, 77.4, 21.9], [-3, 77.4, 21.9]], [0, 1, 0])
  face(hull, [[-3, 77.6, 21.6], [3, 77.6, 21.6], [3, 77.6, 21.9], [-3, 77.6, 21.9]], [0, -1, 0])

  // ---------------------------------------------------- aft deckhouse
  const aft = house(1.3, -92.3, -54, 12)
  walls(white, aft, 7.5, 10.1)
  walls(red, aft, 10.1, 10.6)
  cap(red, aft, 10.6)
  band(ccw(aft), 8.9, 9.5, null, 0.7, 1.4)
  // Skylights and the engine-room casing on the roof.
  const sk: XY[] = ccw([[3.2, -86], [3.2, -72], [-3.2, -72], [-3.2, -86]])
  walls(white, sk, 10.6, 12.6); cap(roof, sk, 12.6)
  // The stack, black, with the red Cliffs ring on each side.
  lathe(hull, 0, -65, [[3.0, 10.5], [3.0, 19.0], [3.15, 19.0], [3.15, 19.6], [2.6, 19.6], [0, 19.4]], 16)
  for (const s of [1, -1]) {
    const pts: V3[] = [], zc = 17.0, r = 1.1
    for (let k = 0; k < 12; k++) {
      const t = (k / 12) * 2 * Math.PI, y = -65 + r * Math.cos(t), z = zc + r * Math.sin(t)
      const x = Math.sqrt(Math.max(0, 3.0 * 3.0 - (y + 65) ** 2)) + 0.04
      pts.push([s * x, y, z])
    }
    face(red, pts, [s, 0, 0])
  }

  return [
    { part: hull, material: finish('mather-black', 0x4a4f57) },
    { part: red, material: finish('mather-red', 0xb4483f) },
    { part: white, material: finish('mather-white', 0xf1ede6) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('cle-william-g-mather', 'SS William G. Mather', [41.5093112, -81.6980975], 146.2, build(), 6500)
