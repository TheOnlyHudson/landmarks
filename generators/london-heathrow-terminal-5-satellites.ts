/**
 * London Heathrow Terminal 5 satellites 5B (opened 2008) and 5C (2011),
 * the two long parallel piers on the apron east of the main building 5A —
 * procedural, CC0-1.0, no textures.
 * bun generators/london-heathrow-terminal-5-satellites.ts
 *
 * Writes models/london-heathrow-terminal-5-satellites.glb (low) and
 * models/london-heathrow-terminal-5-satellites.detail.glb (detail: the whole
 * landmark again, with the V struts of the gate floor at every bay, finer
 * mullions, rooftop plant and glazed jet-bridge links).
 *
 * One placement for both satellites (they are one design, 362 m apart): the
 * anchor is the midpoint between their bodies, so 5B is the block at x ≈ −180
 * and 5C the block at x ≈ +180. Map frame: x = model east, y = model north, z
 * up, metres; bearing −0.35°, as Terminal 5A (london-heathrow-terminal-5.ts,
 * whose kit this imports).
 *
 * Identifying features (photos): two very long, low, uniform piers; a fully
 * glazed gate floor on top of a plainer grey apron-level base, with white
 * branching V struts seen through the glass at every bay; a thin flat roof
 * edge overhanging the glass; the middle of each pier under a shallow curved
 * roof (OSM roof:shape=round), whose arch-topped glass ends rise a little
 * over the flat-roofed ends; jet bridges down both sides.
 *
 * Evidence
 * - OSM: way/23479613 (Heathrow Terminal 5B) with building:part
 *   way/379842246 (roof:shape=round, its middle); way/23479729 (Heathrow
 *   Terminal 5C) with building:part way/379842245 (roof:shape=round). No
 *   heights. The outlines draw every fixed jet-bridge link; `despur` cuts
 *   them off and they are drawn as bridges. 5B: middle x −208.3…−152.2,
 *   y −163.1…140.1 (56 m wide); ends 45 m wide to y −231 and 201.7 (433 m in
 *   all). 5C: x 158.7…202.1 (43 m), y −177.9…167.2, its round part y −125.9…
 *   154.3.
 * - Published: 5B 442 m long, 52 m wide, 19.5 m high; 5C opened 1 June 2011
 *   (Wikipedia, "Heathrow Terminal 5").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:North-East_Corner_of_London_Heathrow_Terminal_5B_-_geograph.org.uk_-_8391446.jpg
 *     (Richard Cooke, CC BY-SA 2.0) 5B's east side from the apron: the
 *     glazed gate floor, the V struts, the roof edge, the grey base;
 *   https://commons.wikimedia.org/wiki/File:North_End_of_Heathrow_Terminal_5B_-_geograph.org.uk_-_8126753.jpg
 *     (Richard Cooke, CC BY-SA 2.0) 5B from the north: the arch-topped glass
 *     end of the curved middle over the lower ends;
 *   https://commons.wikimedia.org/wiki/File:Satellite_building_5b,_Heathrow_Airport_Terminal_5_-_geograph.org.uk_-_8247209.jpg
 *     and https://commons.wikimedia.org/wiki/File:Satellite_building_5b,_Heathrow_Airport_Terminal_5_-_geograph.org.uk_-_8247283.jpg
 *     (Derek Harper, CC BY-SA 2.0) the gate floor close up: the overhang on
 *     brackets, the base, the jet-bridge cores;
 *   https://commons.wikimedia.org/wiki/File:Gate_C62,_London_Heathrow_Terminal_5C_-_geograph.org.uk_-_7866579.jpg
 *     (Richard Cooke, CC BY-SA 2.0) 5C's gate floor inside: the branching
 *     struts and the curved roof beams;
 *   https://commons.wikimedia.org/wiki/File:Heathrow_terminal_5_from_air.JPG
 *     (Clayton Tang, CC BY-SA 3.0) aerial from the south-east: 5B's plan and
 *     pale roof beside 5A.
 * - No lidar.
 *
 * Numbers: crown 19.5 m (published for 5B, used for both); eaves 14.5 m
 * (estimated: the curved middle's arch rises about a quarter of its height over the eave in
 * Cooke's north-end photo); the gate floor glazed from 7.5 m to the eave
 * (estimated from Cooke's and Harper's photos against the jet bridges, which
 * meet it at about 5–8 m); a 2.5 m roof overhang (estimated); V struts every
 * 18 m (estimated from Cooke's photo). Jet bridges at 4.6–8 m (estimated).
 * Doubts: 5C was photographed only inside and from far off; it is drawn as
 * 5B's twin. The rooftop solar arrays seen at the edge in Harper's photo are
 * left out. The apron-level base is drawn plain (its recessed doors and
 * service bays are too fine).
 */
import { type V3 } from './mesh'
import { PALETTE } from './palette'
import { type XY, quadN } from './nyc-570-lexington'
import { despur, jetBridges, prismRing, newMats, writeLod, type Mats } from './tokyo-haneda-terminal-1'
import { LHR, arcRoof, band, type WallPlane } from './london-heathrow-terminal-5'

// ===========================================================================
// OSM data, in this frame (bearing −0.35, anchor −0.4786920, 51.4710260)
// ===========================================================================

/** OSM way/23479613 (5B) */
const T5B: XY[] = [[-152.2,-89.8],[-152.1,-155.5],[-137.4,-160.9],[-135.2,-160.8],[-135.2,-159.7],[-127.0,-159.7],[-127.0,-163.4],[-124.2,-163.4],[-124.2,-167.0],[-135.3,-167.0],[-135.3,-163.4],[-138.0,-163.5],[-152.1,-158.1],[-152.1,-163.1],[-157.9,-163.1],[-157.8,-231.0],[-158.5,-231.0],[-158.1,-232.9],[-137.9,-236.1],[-135.3,-236.2],[-135.3,-234.8],[-127.2,-234.8],[-127.2,-238.9],[-124.3,-238.9],[-124.3,-241.6],[-135.3,-241.6],[-135.3,-239.5],[-137.7,-239.5],[-160.9,-234.9],[-161.4,-231.0],[-199.1,-231.0],[-199.1,-234.3],[-216.2,-254.9],[-218.7,-255.1],[-227.2,-255.1],[-227.2,-251.8],[-230.0,-251.9],[-230.0,-248.7],[-218.6,-248.7],[-218.7,-252.7],[-217.6,-252.6],[-201.9,-233.3],[-201.9,-231.0],[-203.0,-231.0],[-203.0,-163.1],[-208.2,-163.1],[-221.1,-180.8],[-223.8,-180.8],[-231.9,-180.8],[-231.9,-176.9],[-235.0,-176.9],[-235.0,-173.9],[-223.8,-173.9],[-223.8,-179.0],[-222.6,-178.6],[-210.9,-161.9],[-208.2,-161.4],[-208.2,-107.2],[-223.7,-107.1],[-231.8,-107.1],[-231.8,-103.3],[-234.9,-103.3],[-234.9,-100.4],[-223.7,-100.4],[-223.7,-105.0],[-208.2,-104.7],[-208.3,-47.2],[-222.3,-34.5],[-223.7,-34.4],[-231.7,-34.4],[-231.7,-30.5],[-234.8,-30.5],[-234.8,-27.3],[-223.6,-27.3],[-223.7,-31.9],[-221.6,-32.1],[-208.3,-44.7],[-208.3,36.8],[-221.7,41.6],[-223.6,41.7],[-231.6,41.7],[-231.6,45.1],[-234.8,45.1],[-234.8,48.4],[-223.6,48.4],[-223.6,43.7],[-222.5,43.6],[-208.3,39.1],[-208.4,97.0],[-222.3,114.4],[-223.5,114.5],[-231.6,114.5],[-231.6,118.4],[-234.7,118.5],[-234.7,121.5],[-223.5,121.4],[-223.5,117.1],[-221.4,116.8],[-208.4,101.0],[-208.4,140.1],[-202.1,140.1],[-202.1,167.9],[-204.9,167.8],[-221.9,188.9],[-223.4,188.9],[-231.5,188.9],[-231.5,193.0],[-234.6,193.0],[-234.6,195.7],[-223.4,195.7],[-223.4,191.6],[-221.3,191.7],[-203.9,170.8],[-202.1,170.7],[-202.1,201.7],[-196.7,201.7],[-196.8,206.7],[-201.3,239.6],[-223.3,263.9],[-231.4,263.9],[-231.4,268.0],[-234.5,268.0],[-234.5,270.9],[-223.3,270.9],[-223.3,266.5],[-221.2,266.3],[-199.0,240.6],[-194.1,206.2],[-194.0,201.7],[-165.7,201.7],[-165.6,206.5],[-161.0,234.1],[-160.9,290.7],[-131.6,297.1],[-129.3,297.1],[-129.3,298.1],[-121.2,298.1],[-121.2,294.3],[-118.5,294.3],[-118.5,291.6],[-129.3,291.7],[-129.3,294.5],[-131.9,294.3],[-158.6,288.8],[-158.5,233.7],[-163.1,206.3],[-163.0,201.8],[-157.4,201.8],[-157.4,170.7],[-155.6,170.8],[-137.4,198.6],[-134.9,198.6],[-134.9,199.6],[-126.7,199.6],[-126.8,195.7],[-123.8,195.7],[-123.8,192.8],[-134.9,192.8],[-134.9,195.8],[-136.6,195.7],[-154.5,168.3],[-157.4,168.3],[-157.4,140.1],[-152.3,140.1],[-152.3,82.3],[-137.4,91.8],[-135.0,91.7],[-135.0,92.8],[-126.9,92.8],[-126.9,89.2],[-123.9,89.2],[-123.9,85.6],[-135.0,85.6],[-135.0,89.2],[-136.8,89.1],[-152.3,79.6],[-152.2,7.5],[-137.5,1.4],[-135.1,1.3],[-135.1,2.8],[-127.1,2.8],[-127.1,-0.9],[-124.0,-0.9],[-124.0,-3.8],[-135.1,-3.8],[-135.1,-1.1],[-138.2,-1.1],[-152.2,4.1],[-152.2,-87.4],[-137.8,-86.8],[-135.2,-86.9],[-135.2,-85.8],[-127.1,-85.9],[-127.1,-89.5],[-124.1,-89.5],[-124.1,-92.9],[-135.2,-92.9],[-135.2,-89.2],[-137.4,-89.5]]
/** OSM way/23479729 (5C) */
const T5C: XY[] = [[158.8,-15.1],[158.9,76.9],[157.7,76.9],[140.1,54.9],[138.0,54.9],[138.0,54.1],[123.2,54.1],[123.2,62.9],[136.0,62.9],[136.0,59.2],[138.0,59.2],[138.0,57.7],[139.4,58.2],[157.6,80.3],[158.9,80.5],[159.0,112.9],[158.1,112.9],[138.6,163.9],[138.1,164.0],[138.1,163.3],[123.4,163.3],[123.4,171.2],[136.1,171.2],[136.1,167.4],[138.1,167.4],[138.1,166.5],[140.4,166.4],[159.0,116.7],[159.0,149.0],[157.6,149.1],[144.7,187.9],[153.9,226.2],[153.6,254.8],[139.2,269.4],[138.2,269.5],[138.2,268.3],[123.5,268.3],[123.5,277.0],[136.2,277.0],[136.2,273.6],[138.3,273.6],[138.3,271.6],[140.6,271.7],[156.4,256.1],[156.7,226.6],[147.8,188.0],[158.2,153.6],[159.0,153.4],[159.0,154.3],[159.0,167.2],[202.2,167.2],[202.3,163.0],[211.1,189.6],[201.1,222.6],[201.1,255.7],[218.0,293.6],[220.6,293.4],[220.6,294.3],[235.3,294.3],[235.3,286.0],[222.8,286.0],[222.8,289.9],[220.6,289.9],[220.6,290.6],[219.2,290.5],[203.6,255.5],[203.4,222.7],[214.3,190.7],[202.3,156.1],[202.2,154.3],[202.2,123.2],[215.2,146.7],[217.3,204.6],[220.5,204.5],[220.5,205.7],[235.2,205.7],[235.2,197.6],[222.7,197.6],[222.7,201.1],[220.5,201.1],[220.5,202.0],[219.7,202.1],[218.1,147.0],[202.2,118.6],[202.1,76.4],[218.5,100.5],[220.3,100.4],[220.4,102.4],[235.1,102.4],[235.0,93.9],[222.5,93.9],[222.5,97.6],[220.3,97.6],[220.3,98.2],[219.3,98.1],[202.1,72.7],[202.0,-3.1],[218.2,11.0],[220.2,10.9],[220.2,12.0],[234.9,12.0],[234.9,4.1],[222.4,4.1],[222.4,7.7],[220.2,7.7],[220.2,8.4],[219.0,8.4],[202.0,-6.0],[201.9,-79.7],[218.4,-88.0],[220.1,-88.2],[220.1,-87.0],[234.8,-87.0],[234.8,-95.7],[222.3,-95.7],[222.3,-91.6],[220.1,-91.6],[218.0,-91.4],[201.9,-82.6],[201.9,-125.9],[201.9,-129.1],[211.0,-153.1],[225.4,-161.5],[227.0,-161.3],[227.0,-160.4],[239.4,-160.4],[239.4,-167.7],[227.0,-167.7],[227.0,-163.6],[224.5,-163.5],[209.5,-155.2],[201.8,-134.6],[201.8,-177.9],[158.6,-177.9],[158.7,-125.9],[158.0,-125.8],[137.4,-157.6],[133.9,-183.3],[131.3,-182.9],[118.5,-182.8],[118.5,-175.8],[131.3,-175.8],[131.3,-179.6],[131.8,-179.5],[135.1,-156.8],[157.1,-123.4],[158.7,-123.4],[158.7,-91.0],[157.5,-91.0],[133.4,-109.5],[131.4,-109.3],[118.6,-109.3],[118.6,-101.9],[131.4,-101.9],[131.4,-106.5],[132.7,-106.4],[157.1,-88.0],[158.7,-88.0],[158.8,-18.4],[157.7,-18.2],[133.2,-35.5],[131.5,-35.0],[118.7,-35.0],[118.7,-27.9],[131.5,-27.9],[131.5,-32.9],[132.8,-32.8],[157.5,-15.4]]

// ===========================================================================
// One satellite
// ===========================================================================

const EAVE = 14.5, CROWN = 19.5, GLAZE0 = 7.5, OVER = 2.5

type Sat = {
  /** the curved middle: x0, x1, y0, y1 */
  mid: [number, number, number, number]
  /** the flat-roofed ends: x0, x1, y0, y1 each */
  ends: [number, number, number, number][]
}

/**
 * The four walls of a box x0…x1, y0…y1 up to `z1`: the grey base, the
 * glazed gate floor from GLAZE0 to the eave with V struts and mullions.
 * `skip` leaves out the wall on a side ('s' or 'n') that abuts another block.
 */
function walls(M: Mats, x0: number, x1: number, y0: number, y1: number, z1: number, detail: boolean, skip: string[] = []) {
  const sides: { a: XY; b: XY; n: V3; key: string }[] = [
    { a: [x0, y0], b: [x1, y0], n: [0, -1, 0], key: 's' },
    { a: [x1, y0], b: [x1, y1], n: [1, 0, 0], key: 'e' },
    { a: [x1, y1], b: [x0, y1], n: [0, 1, 0], key: 'n' },
    { a: [x0, y1], b: [x0, y0], n: [-1, 0, 0], key: 'w' },
  ]
  for (const { a, b, n, key } of sides) {
    if (skip.includes(key)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
    const W: WallPlane = { o: [a[0], a[1], 0], u, v: [0, 0, 1], n }
    const P = (s: number, t: number, d = 0): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, t]
    quadN(M.wall, P(0, 0), P(L, 0), P(L, GLAZE0), P(0, GLAZE0), [n, n, n, n])
    quadN(M.win, P(0, GLAZE0), P(L, GLAZE0), P(L, z1), P(0, z1), [n, n, n, n])
    // a pale sill band at the gate floor, mullions, the V struts behind the glass
    band(M.trim, W, [0, GLAZE0 + 0.3], [L, GLAZE0 + 0.3], 0.6)
    const step = detail ? 4.5 : 9
    for (let s = step; s < L - 1; s += step) band(M.trim, W, [s, GLAZE0 + 0.6], [s, z1 - 0.2], detail ? 0.25 : 0.4)
    if (L > 30) {
      const bay = 18, nb = Math.max(1, Math.round(L / bay)), pitch = L / nb
      for (let k = 0; k < nb; k++) {
        const s = pitch * (k + 0.5)
        band(M.trim, W, [s, GLAZE0 + 0.8], [s - 3.2, z1 - 0.4], detail ? 0.5 : 0.7, 0.09)
        band(M.trim, W, [s, GLAZE0 + 0.8], [s + 3.2, z1 - 0.4], detail ? 0.5 : 0.7, 0.09)
        band(M.trim, W, [s, GLAZE0 + 0.6], [s, GLAZE0 + 2.6], detail ? 0.5 : 0.7, 0.09)
      }
    }
    // the base: a dark-ish recessed ground storey reads as a window band at the doors (detail only)
    if (detail) band(M.win, W, [2, 2.2], [L - 2, 2.2], 2.6, 0.04)
  }
}

/** A flat roof slab overhanging x0…x1, y0…y1 by `over` on the open sides. */
function flatRoof(M: Mats, x0: number, x1: number, y0: number, y1: number, z: number, over: number, overS: number, overN: number) {
  const X0 = x0 - over, X1 = x1 + over, Y0 = y0 - overS, Y1 = y1 + overN
  prismRing(M.trim, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], z - 0.9, z, null, M.trim)
  prismRing(M.roof, [[X0 + 0.6, Y0 + 0.6], [X1 - 0.6, Y0 + 0.6], [X1 - 0.6, Y1 - 0.6], [X0 + 0.6, Y1 - 0.6]], z - 0.2, z + 0.15, M.roof)
}

function satellite(M: Mats, s: Sat, outline: XY[], detail: boolean) {
  const [mx0, mx1, my0, my1] = s.mid
  // the curved middle
  walls(M, mx0, mx1, my0, my1, EAVE, detail)
  const { zBot, xs } = arcRoof(M.roof, M.trim, { x0: mx0 - OVER, x1: mx1 + OVER, y0: my0 - 1.2, y1: my1 + 1.2, zEdge: EAVE + 0.2, rise: CROWN - EAVE - 0.2, pow: 1, depth: 1.0, n: detail ? 16 : 10 })
  // its arch-topped glass ends, over the flat ends' roofs
  for (const [y, sgn] of [[my0, -1], [my1, 1]] as [number, number][]) {
    const nE: V3 = [0, sgn, 0]
    const pts = [mx0, ...xs.filter((x) => x > mx0 + 0.3 && x < mx1 - 0.3), mx1]
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1]
      quadN(M.win, [p, y, EAVE], [q, y, EAVE], [q, y, zBot(q)], [p, y, zBot(p)], [nE, nE, nE, nE])
    }
    if (detail) for (let k = 1; k < 6; k++) { const x = mx0 + ((mx1 - mx0) * k) / 6; quadN(M.trim, [x - 0.2, y + sgn * 0.06, EAVE], [x + 0.2, y + sgn * 0.06, EAVE], [x + 0.2, y + sgn * 0.06, zBot(x) - 0.1], [x - 0.2, y + sgn * 0.06, zBot(x) - 0.1], [nE, nE, nE, nE]) }
  }
  // a pale eave band round the middle under the curved roof
  // the flat ends
  for (const [x0, x1, y0, y1] of s.ends) {
    const south = y1 <= my0 + 0.01
    walls(M, x0, x1, y0, y1, EAVE - 0.9, detail, [south ? 'n' : 's'])
    flatRoof(M, x0, x1, y0, y1, EAVE, OVER, south ? OVER : 0, south ? 0 : OVER)
    if (detail) { // rooftop plant
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
      prismRing(M.wall, [[cx - 8, cy - 10], [cx + 8, cy - 10], [cx + 8, cy + 10], [cx - 8, cy + 10]], EAVE, EAVE + 2.4, M.roof)
    }
  }
  // jet bridges from the outline's spurs
  const { spurs } = despur(outline, 9.5, 20)
  jetBridges({ ...M, roof: M.wall }, spurs.filter((p) => p.length >= 4), { z0: 4.6, z1: 8.0, detail })
}

function build(detail: boolean) {
  const M = newMats(['roof', 'win', 'trim', 'wall', 'bridge', 'glass'])
  satellite(M, { mid: [-208.3, -152.2, -163.1, 140.1], ends: [[-203.0, -157.9, -231.0, -163.1], [-202.1, -157.4, 140.1, 201.7]] }, T5B, detail)
  satellite(M, { mid: [158.7, 202.1, -125.9, 154.3], ends: [[158.7, 202.1, -177.9, -125.9], [158.7, 202.1, 154.3, 167.2]] }, T5C, detail)
  return [
    { part: M.roof, material: LHR.roof },
    { part: M.win, material: LHR.window },
    { part: M.trim, material: LHR.white },
    { part: M.wall, material: LHR.panel },
    { part: M.bridge, material: LHR.bridge },
    { part: M.glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) {
  const extras = { bearing: -0.35, osm: 'way/23479613', height: CROWN }
  writeLod('Heathrow Terminal 5B and 5C', 'london-heathrow-terminal-5-satellites.glb', build(false), extras, 8000, 250_000)
  writeLod('Heathrow Terminal 5B and 5C', 'london-heathrow-terminal-5-satellites.detail.glb', build(true), extras, 40_000, 1_500_000)
}
