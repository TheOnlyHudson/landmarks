/**
 * Cleveland Harbor Coast Guard Station (1940, J. Milton Dyer; closed 1976,
 * NRHP 76001390), Whiskey Island, Cleveland: procedural, CC0-1.0.
 * bun generators/cle-coast-guard-station.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 329 (the long
 * wing's axis: +y points 329°, from the boathouse to the tower). Origin: the
 * anchor -81.7126 41.5029, at the lowest ground under the model.
 *
 * Identity, in order: the tall white cylindrical lookout tower with the flat
 * slab fin rising past its top, the band of lookout windows under an
 * overhanging disc roof; the white two-storey station block with its
 * angled, chamfered entrance court and cantilevered entrance canopy; the
 * long one-storey wing under a thin overhanging roof slab, running south to
 * the boathouse with its glazed "pilot house" on the roof and its recessed
 * boat-door bays on both long sides,
 * framed by curved fins, and the deep slab over the slip end with its
 * sweeping corner fins; the plain garage across
 * the court. Shipboard streamlining throughout: flat roofs, thin slabs,
 * horizontal window bands, an oval window.
 *
 * Evidence:
 *  - OSM ways 122152516 (the station), 122152517 (the garage), 925599866
 *    (building:part, the pilot house), 925599867 (the entrance canopy,
 *    amenity=shelter), 925599868 (the watchtower part). No heights in OSM.
 *    OSM sits about 4 m west of the lidar at the tower and 2-3 m off
 *    elsewhere; the model follows the lidar (and NAIP).
 *  - lidar: USGS 3DEP OH_Statewide_Phase1_1_2019 (flown 2019), 0.5 m grid
 *    centred on the anchor. Heights (above the island's ground, ~1.3 m above
 *    the lake): block roof 7.0; tower disc 19.5, its top 20.8, the fin 22.1;
 *    wing and boathouse roof 5.3; pilot house 7.2; roof slabs (canopies)
 *    ~4.3-4.5; annex 3.8; garage 4.2. Plan of every mass from the same grid.
 *    Model heights are lidar minus 0.3 m, so the island ground is at 1.0
 *    and the walls run down to the slip edge at the boathouse's south end
 *    (the map's terrain: ~0.4-0.6 there, 1.0-1.6 under the rest).
 *  - USGS NAIP (public domain): plan, grey flat roofs, the rounded pilot
 *    house. (The "Cleveland" script painted on the roof is not modelled.)
 *  - published: 1940, J. Milton Dyer, NRHP 1976 (OSM tags; NRHP 76001390).
 *  Estimated from photos: tower shaft 4.4 m across (the lidar disc is 6 m),
 *  the lookout band, the fin's section, every window and door, the fins'
 *  curve, canopy depths.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Historic_U.S._Coast_Guard_Station_in_Cleveland_(50873316108).jpg and
 *    (50874020746).jpg, Erik Drost, CC BY 2.0 (from the west, across the
 *    river mouth: the whole west side)
 *  - U.S._Coast_Guard,_Cleveland_Harbor_Station.jpg, Douglas Sacha,
 *    CC BY-SA 4.0 (from the east: boathouse door bay and fins)
 *  - Old_Cleveland_Coast_Guard_Station,_Whiskey_Island,_Cleveland,_OH
 *    (28569037307, 28569039867, 28569039497, 28569040307, 28569038297),
 *    Warren LeMay, CC0 (the court faces, the tower and fin close, the
 *    boathouse doors, the oval window)
 *  - Former_Coast_Guard_station.jpg, k_e_lewis, CC BY 2.0 (night, from
 *    the court, with the garage)
 * No look-only sources. No commercial imagery.
 *
 * Night: windows are `window` (lit); the lookout band too. Not floodlit.
 * Doubts: the fins' exact curve and reach (the slip walls in the lidar run
 * ~6 m south of the boathouse); the south (slip) face is unphotographed and
 * drawn plain; the east bay's doors are drawn like the west's; the window counts on the north and south faces are
 * estimated (few photos of them).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, circle, inset, type XY } from './chi-aon-center'

/** Ring with every edge split into pieces no longer than `max`. */
function densify(r: XY[], max = 5): XY[] {
  const out: XY[] = []
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / max))
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  })
  return out
}
function walls(p: Part, r: XY[], z0: number, z1: number) {
  const d = densify(r)
  for (let i = 0; i < d.length; i++) {
    const j = (i + 1) % d.length
    p.quad([d[i][0], d[i][1], z0], [d[j][0], d[j][1], z0], [d[j][0], d[j][1], z1], [d[i][0], d[i][1], z1])
  }
}
/** A slab: walls and both caps. */
function slab(p: Part, r: XY[], z0: number, z1: number) {
  walls(p, r, z0, z1); cap(p, r, z1); cap(p, r, z0, false)
}
/** A flat-roofed mass with a parapet: white walls, grey roof inside the parapet. */
function mass(wall: Part, roof: Part, r: XY[], z0: number, h: number, par = 0.35, t = 0.3) {
  const inn = inset(r, t)
  walls(wall, r, z0, h + par)
  walls(wall, [...inn].reverse(), h, h + par)
  for (let k = 0; k < r.length; k++) {
    const l = (k + 1) % r.length
    wall.quad([inn[k][0], inn[k][1], h + par], [r[k][0], r[k][1], h + par], [r[l][0], r[l][1], h + par], [inn[l][0], inn[l][1], h + par])
  }
  cap(roof, inn, h)
}
/** A flat panel on an axis-aligned wall: outward normal n, plane at coordinate d, centre c along the wall (s = t·p, t = (-n.y, n.x)). */
function panel(p: Part, n: XY, d: number, c: number, w: number, z0: number, z1: number, out = 0.04) {
  const t: XY = [-n[1], n[0]], o: XY = [n[0] * (d + out), n[1] * (d + out)]
  const pt = (s: number, z: number): V3 => [o[0] + t[0] * (c + s), o[1] + t[1] * (c + s), z]
  p.quad(pt(-w / 2, z0), pt(w / 2, z0), pt(w / 2, z1), pt(-w / 2, z1))
}
/** A stadium-shaped (oval) flat window on an axis-aligned wall. */
function ovalPanel(p: Part, n: XY, d: number, c: number, w: number, zc: number, h: number, out = 0.04, seg = 8) {
  const t: XY = [-n[1], n[0]], o: XY = [n[0] * (d + out), n[1] * (d + out)], r = h / 2
  const pts: [number, number][] = []
  for (let k = 0; k <= seg; k++) { const a = -Math.PI / 2 + (k / seg) * Math.PI; pts.push([w / 2 - r + r * Math.cos(a), r * Math.sin(a)]) }
  for (let k = 0; k <= seg; k++) { const a = Math.PI / 2 + (k / seg) * Math.PI; pts.push([-w / 2 + r + r * Math.cos(a), r * Math.sin(a)]) }
  const P = ([s, z]: [number, number]): V3 => [o[0] + t[0] * (c + s), o[1] + t[1] * (c + s), zc + z]
  const ctr: V3 = P([0, 0])
  for (let k = 0; k < pts.length; k++) p.tri(ctr, P(pts[k]), P(pts[(k + 1) % pts.length]))
}
/** Smooth vertical cylinder sides. */
function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 16, top = true) {
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * 2 * Math.PI, b = ((k + 1) / seg) * 2 * Math.PI
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    const A: V3 = [cx + r * na[0], cy + r * na[1], z0], B: V3 = [cx + r * nb[0], cy + r * nb[1], z0]
    const C: V3 = [B[0], B[1], z1], D: V3 = [A[0], A[1], z1]
    p.tri(A, B, C, undefined, undefined, undefined, [na, nb, nb]); p.tri(A, C, D, undefined, undefined, undefined, [na, nb, na])
  }
  if (top) cap(p, circle(cx, cy, r, seg), z1)
}

function build() {
  const white = new Part(), roof = new Part(), win = new Part(), dark = new Part(), doorP = new Part()
  const G = 1.0 // the island's ground in the model

  // ------------------------------------------------ the two-storey station block, with its chamfered court corner
  const BLOCK: XY[] = [[-7, -1.5], [2.5, -1.5], [2.5, 8], [7.5, 12.8], [13.5, 12.8], [13.5, 22.5], [-7, 22.5]]
  mass(white, roof, BLOCK, 0, 8.0)
  // the entrance canopy along the chamfer and a little along both wings (OSM shelter)
  slab(white, [[2.5, 3.5], [4.6, 3.5], [4.6, 7.2], [8.3, 10.7], [11, 10.7], [11, 12.8], [7.5, 12.8], [2.5, 8]], 4.85, 5.2)
  // the annex east of the block
  mass(white, roof, rect(13.5, 13, 18.5, 22.5), 0, 4.8, 0.4, 0.25)

  // ------------------------------------------------ the lookout tower and its fin
  const TX = -2.5, TY = 18, TR = 2.0
  cyl(white, TX, TY, TR, 8.0, 18.5, 16, false)
  cyl(win, TX, TY, TR - 0.05, 18.5, 19.8, 16, false)
  { // the overhanging disc roof
    const d = circle(TX, TY, 3.0, 16)
    walls(white, d, 19.8, 20.4); cap(white, d, 20.4); cap(white, d, 19.8, false)
  }
  cyl(dark, TX, TY, 1.5, 20.4, 21.6, 12)
  // the fin: a flat slab on the tower's south side, from the block roof past the top
  slab(white, rect(TX - 0.75, TY - TR - 1.3, TX + 0.75, TY - TR + 0.4), 8.0, 23.0)
  // two small round ports in the shaft facing the court
  for (const z of [11.5, 14.5]) {
    const a = Math.PI / 4, n: XY = [Math.cos(a), Math.sin(a)]
    const c: V3 = [TX + n[0] * (TR + 0.03), TY + n[1] * (TR + 0.03), z]
    const t: V3 = [-n[1], n[0], 0]
    for (let k = 0; k < 8; k++) {
      const a0 = (k / 8) * 2 * Math.PI, a1 = ((k + 1) / 8) * 2 * Math.PI, r = 0.45
      win.tri(c, [c[0] + t[0] * r * Math.cos(a0), c[1] + t[1] * r * Math.cos(a0), z + r * Math.sin(a0)], [c[0] + t[0] * r * Math.cos(a1), c[1] + t[1] * r * Math.cos(a1), z + r * Math.sin(a1)])
    }
  }

  // ------------------------------------------------ the one-storey wing and the boathouse
  const WING = rect(-7.5, -17, 2, -1.5)
  mass(white, roof, WING, 0, 6.3, 0.3, 0.25)
  const BH: XY[] = rect(-11.5, -37.5, 4, -17)
  mass(white, roof, BH, 0, 6.3, 0.3, 0.25)
  // the thin roof slab (canopy) wrapping the wing and the boathouse
  slab(white, rect(-8.5, -17, -7.5, -1.5), 4.95, 5.3)
  slab(white, rect(2, -17, 3, -1.5), 4.95, 5.3)
  slab(white, [[-12.5, -40.5], [5.2, -40.5], [5.2, -17], [4, -17], [4, -37.5], [-11.5, -37.5], [-11.5, -17], [-12.5, -17]], 4.95, 5.3)
  // the pilot house on the boathouse roof: rounded plan, window band, overhanging cap
  {
    const ph = densify([[-7.4, -34], [0.9, -34], [1.5, -33.4], [1.5, -23.1], [0.9, -22.5], [-7.4, -22.5], [-8, -23.1], [-8, -33.4]], 6)
    walls(white, ph, 6.3, 6.75)
    walls(win, ph, 6.75, 7.75)
    const capR = inset(ph, -0.2)
    walls(white, capR, 7.75, 8.2); cap(white, capR, 8.2); cap(white, capR, 7.75, false)
  }
  // the boat-door bays on both long sides (west and east), under the roof slab:
  // three doors each, cream with a row of dark oval lights
  for (const [n, d] of [[[-1, 0], 11.5], [[1, 0], 4]] as [XY, number][]) {
    const along = (y: number) => y * n[0]
    for (const y of [-24.4, -29.2, -34.0]) {
      panel(doorP, n, d, along(y), 4.4, 0, G + 3.7)
      for (const dy of [-1.2, 0, 1.2]) ovalPanel(win, n, d, along(y + dy), 1.0, G + 2.7, 0.45, 0.07, 4)
    }
    // the fin at the bay's north end: a plate square to the wall, its outer edge
    // bowing out from the slab's edge and back in at the foot
    const X = (o: number) => n[0] * (d + o), th = 0.2, y = -21.6
    const prof: [number, number][] = []
    for (let k = 0; k <= 6; k++) { const a = (k / 6) * Math.PI; prof.push([0.35 + 0.65 * (k / 6) + 0.45 * Math.sin(a), 5.0 * (k / 6)]) }
    for (const s2 of [-1, 1]) {
      const pts: V3[] = [[X(0), y + s2 * th, 0], ...prof.map(([o, z]) => [X(o), y + s2 * th, z] as V3), [X(0), y + s2 * th, 5.0]]
      for (let k = 1; k < pts.length - 1; k++) { white.tri(pts[0], pts[k], pts[k + 1]); white.tri(pts[0], pts[k + 1], pts[k]) }
    }
    for (let k = 0; k < prof.length - 1; k++) {
      const [o0, z0] = prof[k], [o1, z1] = prof[k + 1]
      const A: V3 = [X(o0), y - th, z0], B: V3 = [X(o1), y - th, z1], C: V3 = [X(o1), y + th, z1], D: V3 = [X(o0), y + th, z0]
      white.quad(A, B, C, D); white.quad(D, C, B, A)
    }
  }
  // the curved fins at the south corners: plates in the plane of the long walls,
  // sweeping from the deep south slab's edge down and out to the slip walls
  for (const x of [-12.1, 4.9]) {
    const prof: [number, number][] = [[-37.5, 0], [-37.5, 5.3]]
    for (let k = 0; k <= 8; k++) {
      const a = (k / 8) * Math.PI / 2
      prof.push([-40.5 - 4.0 * (1 - Math.cos(a)), 5.3 * (1 - Math.sin(a))])
    }
    const th = 0.2
    for (const s of [-1, 1]) {
      const xx = x + s * th
      const pts = prof.map(([y, z]) => [xx, y, z] as V3)
      for (let k = 1; k < pts.length - 1; k++) {
        if (s > 0) white.tri(pts[0], pts[k + 1], pts[k]); else white.tri(pts[0], pts[k], pts[k + 1])
      }
    }
    for (let k = 1; k < prof.length - 1; k++) {
      const [y0, z0] = prof[k], [y1, z1] = prof[k + 1]
      white.quad([x - th, y0, z0], [x - th, y1, z1], [x + th, y1, z1], [x + th, y0, z0])
    }
  }
  // ------------------------------------------------ the garage across the court
  mass(white, roof, rect(23.5, 15, 36, 22.5), 0, 5.2, 0.4, 0.25)
  for (const x of [26.2, 29.75, 33.3]) panel(dark, [0, -1], -15, x, 2.9, G, G + 3.0)

  // ------------------------------------------------ windows (multi-pane steel windows, grouped)
  const W = (n: XY, d: number, ys: number[], w: number, z0: number, z1: number) => { for (const c of ys) panel(win, n, d, c, w, z0, z1) }
  // block, west face (x = -7): ground floor and upper floor
  W([-1, 0], 7, [0.5, 4.0, 9.5, 13.5, 20.5].map(y => -y), 1.6, G + 1.0, G + 2.6)
  W([-1, 0], 7, [0.5, 4.0, 9.5, 13.5].map(y => -y), 1.6, G + 4.0, G + 5.6)
  panel(dark, [-1, 0], 7, -6.8, 1.0, G, G + 2.3)
  // block, the court faces: the south wing's east face (x = 2.5), the chamfer, the north arm's south face (y = 12.8)
  W([1, 0], 2.5, [0.5, 4.5], 1.8, G + 4.0, G + 5.6)
  W([1, 0], 2.5, [0.5], 1.8, G + 1.0, G + 2.6)
  {
    // the chamfer face from (2.5,8) to (7.5,12.8)
    const a: XY = [2.5, 8], b: XY = [7.5, 12.8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    const at = (s: number, z: number, o = 0.04): V3 => [a[0] + u[0] * s + nn[0] * o, a[1] + u[1] * s + nn[1] * o, z]
    for (const [s0, s1, z0, z1, part] of [[0.6, 2.4, G + 4.0, G + 5.6, win], [2.6, 4.3, G + 4.0, G + 5.6, win], [4.5, 6.3, G + 4.0, G + 5.6, win],
      [0.8, 2.3, G + 1.0, G + 2.6, win], [2.9, 4.0, G, G + 2.3, dark], [4.6, 6.1, G + 1.0, G + 2.6, win]] as [number, number, number, number, Part][])
      part.quad(at(s0, z0), at(s1, z0), at(s1, z1), at(s0, z1))
  }
  W([0, -1], -12.8, [-9.5, -12].map(x => -x), 1.6, G + 4.0, G + 5.6)
  W([0, -1], -12.8, [-12].map(x => -x), 1.6, G + 1.0, G + 2.6)
  // north face (y = 22.5) and east face (x = 13.5 above the annex)
  W([0, 1], 22.5, [-5, 0, 4, 9].map(x => -x), 1.6, G + 4.0, G + 5.6)
  W([0, 1], 22.5, [-5, 4, 9].map(x => -x), 1.6, G + 1.0, G + 2.6)
  W([1, 0], 13.5, [15.5, 20], 1.6, G + 4.5, G + 5.6)
  // the block's south face above the wing roof (y = -1.5)
  W([0, -1], 1.5, [-5, -1, 1.5].map(x => x), 1.4, 7.0, 7.4)
  // the wing: west face (x = -7.5) the oval window and the big window; east face a long band
  ovalPanel(win, [-1, 0], 7.5, 5.0, 3.6, G + 1.9, 1.3)
  panel(win, [-1, 0], 7.5, 11.5, 4.5, G + 1.4, G + 3.2)
  panel(dark, [-1, 0], 7.5, 2.0, 1.0, G, G + 2.3)
  panel(win, [1, 0], 2, -10, 5.5, G + 1.6, G + 3.2)
  panel(win, [1, 0], 2, -4.5, 1.6, G + 1.4, G + 3.0)
  // the boathouse's south end: a row of windows under the slab

  return [
    { part: white, material: finish('station-white', 0xf1efe9) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: dark, material: finish('station-dark', 0x51575d) },
    { part: doorP, material: PALETTE.trim },
  ]
}

if (import.meta.main) await save('cle-coast-guard-station', 'Cleveland Harbor Coast Guard Station', [41.5029, -81.7126], 329, build(), 5000)
