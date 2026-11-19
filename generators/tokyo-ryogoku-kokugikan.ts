/**
 * Ryōgoku Kokugikan (両国国技館), the sumo hall, Ryōgoku, Sumida, Tokyo
 * (Kajima, 1984) — procedural, CC0-1.0.
 * bun generators/tokyo-ryogoku-kokugikan.ts
 *
 * Map frame: x across (bearing 103.8°), y along the hall (13.8°), z up,
 * metres; origin on the ground at the centroid of the OSM outline
 * way/76187058 (139.7934835, 35.6969269); catalog bearing 13.8. The main
 * entrance faces west (-x), towards Ryōgoku station.
 *
 * Identity, in order: the great square hipped roof of green copper rising to the gold louvred crown (the 8-sided lantern whose
 * sides open); the band of golden-brown louvres under its deep eave; the
 * green-roofed skirt round the white-tiled ground storey.
 *
 * Evidence:
 *  - OSM: way/76187058, 101 × 94 m with its corners cut ~12 m and a 6 m
 *    entrance wing on the west side (the outline's height tag, 8 m, is the
 *    skirt, not the hall); way/851267846, the crown, 16 m across (tagged
 *    8-12 m, wrong: drawn at its real height), both replaced.
 *  - published (ja.wikipedia 両国国技館): completed 1984, designed by Kajima,
 *    2 floors above ground and 1 below, 39.6 m high; the gold part on the
 *    roof has sides that open in eight sections.
 *  - heights within the hall, estimated from the photos against the
 *    39.6 m total: ground storey to the skirt's eave 10 m, the skirt meeting
 *    the louvre band at 12 m, louvres 12-17.5 m, main eave 18 m (its
 *    copper fascia ~1 m), the roof rising to the crown's foot at 33.8 m;
 *    the roof a plain square, 85.6 m at the eave, inside the outline's cut
 *    corners (Cadman's view: the lower building reaches out beyond it);
 *    crown 33.8-39.6 m (Kinmei's and 江戸村のとくぞう's front views,
 *    Cadman's view from above); the louvre band ~4 m behind the eave.
 *  - colours (daylight photos): roof copper #7e9f95-#96b0a0 (drawn #8aad9f), louvres golden brown
 *    #a8814e, crown ochre-gold #d9b45a (OiMax's close view), white-tiled
 *    walls.
 *  - terrain: see the report; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Ryogoku Kokugikan (Tokyo, JAP).jpg, 江戸村のとくぞう, CC BY-SA 4.0 (west front)
 *  - Ryogoku Kokugikan (taken from Kokugikan Street).jpg, Souka Kinmei, CC BY 4.0
 *  - Ryogoku Great Sumo Hall.jpg, Steve Cadman, CC BY-SA 2.0 (from the north-west, above)
 *  - Top of Ryogoku Kokugikan.jpg, OiMax, CC BY 2.0 (the crown, close)
 *  - Ryogoku Kokugikan-1.jpg, 江戸村のとくぞう, CC BY-SA 3.0
 * No commercial imagery. No look-only references.
 *
 * Left out: the entrance's canopy detail, the banners (nobori), the wing
 * buildings round the hall (separate OSM buildings, not covered).
 * Doubts: the heights inside the 39.6 m are estimates; the east and south
 * sides are seen only from above (drawn like the north).
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { bar, quadOut, triOut, save, type Mat } from './tokyo-sensoji'

type XY = [number, number]
const CX = 2.05, HX = 47.55, HY = 47.0, CH = 12.2

/** A square of half sizes hx, hy about (CX, 0) with its corners cut by ch, CCW. */
const oct = (hx: number, hy: number, ch: number): XY[] => [
  [CX - hx + ch, -hy], [CX + hx - ch, -hy], [CX + hx, -hy + ch], [CX + hx, hy - ch],
  [CX + hx - ch, hy], [CX - hx + ch, hy], [CX - hx, hy - ch], [CX - hx, -hy + ch],
]
const inset = (d: number) => oct(HX - d, HY - d, Math.max(0.5, CH - d * 0.414))

/** Walls of a polygon prism from z0 to z1. */
function walls(p: Part, poly: XY[], z0: number, z1: number) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    quadOut(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [b[1] - a[1], -(b[0] - a[0]), 0])
  }
}
/** A sloped ring between two polygons (same vertex count) at two heights. */
function ring(p: Part, outer: XY[], zo: number, inner: XY[], zi: number, up = true) {
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    quadOut(p, [outer[i][0], outer[i][1], zo], [outer[j][0], outer[j][1], zo], [inner[j][0], inner[j][1], zi], [inner[i][0], inner[i][1], zi], [0, 0, up ? 1 : -1])
  }
}
function cap(p: Part, poly: XY[], z: number, up = true) {
  for (let i = 1; i < poly.length - 1; i++) triOut(p, [poly[0][0], poly[0][1], z], [poly[i][0], poly[i][1], z], [poly[i + 1][0], poly[i + 1][1], z], [0, 0, up ? 1 : -1])
}

function build() {
  const copper = new Part(), louvre = new Part(), wall = new Part(), win = new Part(), dark = new Part()

  // Ground storey: white tile, with a band of glazing round it, and the
  // west entrance wing.
  const G = inset(1.5)
  walls(wall, G, 0, 10)
  walls(win, inset(1.45), 2.2, 6.0)
  // Split the glazing by piers: draw piers in front every ~9 m.
  for (let i = 0; i < G.length; i++) {
    const a = G[i], b = G[(i + 1) % G.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 9))
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [t[1], -t[0]]
    for (let k = 0; k <= n; k++) {
      const c: XY = [a[0] + t[0] * L * k / n, a[1] + t[1] * L * k / n]
      const P = (u: number, out: number, z: number): V3 => [c[0] + t[0] * u + o[0] * out, c[1] + t[1] * u + o[1] * out, z]
      quadOut(wall, P(-0.7, 0.12, 2.0), P(0.7, 0.12, 2.0), P(0.7, 0.12, 6.2), P(-0.7, 0.12, 6.2), [o[0], o[1], 0])
    }
  }
  // The west wing: low, with the main doors.
  const W: XY[] = [[-51.7, -30.6], [-45.0, -30.6], [-45.0, 30.0], [-51.7, 30.0]]
  walls(wall, W, 0, 8.5)
  cap(copper, W, 8.5)
  quadOut(win, [-51.75, -12, 0.3], [-51.75, 12, 0.3], [-51.75, 12, 5.2], [-51.75, -12, 5.2], [-1, 0, 0])
  // The skirt: green copper from its eave up to the louvre band.
  const S0 = oct(HX - 0.2, HY - 0.2, CH), S1 = oct(38.5, 38.5, 0.01)
  ring(copper, S0, 10, S1, 12)
  ring(dark, inset(1.5), 9.6, S0, 9.6, false)
  walls(copper, S0, 9.6, 10)
  // The louvre band: horizontal golden-brown slats standing out of a dark wall.
  walls(dark, S1, 12, 17.5)
  for (let z = 12.4; z < 17.2; z += 0.9) {
    const L = oct(38.8, 38.8, 0.01)
    walls(louvre, L, z, z + 0.45)
    ring(louvre, L, z + 0.45, S1, z + 0.45)
  }
  // The main roof: eave fascia, soffit, and the eight copper planes up to
  // the crown.
  const E = oct(42.8, 42.8, 0.01), C0 = oct(8.6, 8.6, 2.6).map(([x, y]) => [x - CX + 1.1, y + 0.9] as XY)
  walls(copper, E, 17.1, 18.1)
  ring(dark, S1, 17.5, E, 17.1, false)
  ring(copper, E, 18.1, C0, 33.8)
  // Hip ridges up the eight corners.
  for (let i = 0; i < 8; i += 2) bar(copper, [[E[i][0], E[i][1], 18.2], [C0[i][0], C0[i][1], 33.9]], 0.7, 0.4, 0.1, false, false)

  // The crown: an eight-sided lantern of gold louvres round a dark core.
  const C = (d: number) => oct(8.0 + d, 8.0 + d, 2.4 + d * 0.414).map(([x, y]) => [x - CX + 1.1, y + 0.9] as XY)
  walls(dark, C(-0.4), 33.8, 39.0)
  for (let z = 34.0; z < 38.6; z += 0.82) {
    walls(louvre, C(0), z, z + 0.48)
    ring(louvre, C(0), z + 0.48, C(-0.4), z + 0.48)
    ring(louvre, C(-0.4), z, C(0), z, false)
  }
  walls(louvre, C(0.15), 38.7, 39.6)
  cap(louvre, C(0.15), 39.6)

  const flood = (_: V3, n: V3) => (n[2] > 0.6 ? 0.3 : 0.9)
  const parts: Mat[] = [
    { part: copper, material: finish('kokugikan-copper', 0x8aad9f) },
    { part: louvre, material: { ...finish('louvre-gold', 0xc9a35e), floodlight: flood } },
    { part: wall, material: finish('white-tile', 0xe7e4dd) },
    { part: win, material: PALETTE.window },
    { part: dark, material: finish('louvre-shadow', 0x5d5a55) },
  ]
  return parts
}

if (import.meta.main) {
  await save('tokyo-ryogoku-kokugikan', 'Ryōgoku Kokugikan', build(), 'tokyo-ryogoku-kokugikan.glb', 5000, 250_000, { bearing: 13.8, elevation: 0, height: 39.6, osm: 'way/76187058' })
}
