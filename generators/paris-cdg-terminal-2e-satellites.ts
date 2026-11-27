/**
 * Paris-Charles de Gaulle Airport, Terminal 2E's satellites: Hall L
 * (Satellite S3, "La Galerie Parisienne", 2007) and Hall M (Satellite S4,
 * 2012), the two 750 m piers east of 2E's Hall K — procedural, CC0-1.0, no
 * textures.
 * bun generators/paris-cdg-terminal-2e-satellites.ts
 *
 * Writes models/paris-cdg-terminal-2e-satellites.glb (low) and
 * models/paris-cdg-terminal-2e-satellites.detail.glb (detail: the whole
 * landmark again, with mullions, more skylights and glazed jet bridges).
 *
 * Map frame: x = east, y = north, z up, metres. Bearing 0. Anchor: the
 * area-weighted centroid of the two outlines (2.5876468, 49.0045219).
 * y = 0 is the lowest ground under the footprint, the road and people-mover
 * cutting that crosses both halls near their middles; the apron slopes from
 * about 8 m (north) to 4 m (south) over it, and the roofs are level.
 *
 * Identifying features (photos): Hall M, a long glass pier under a dark
 * grey roof pitched gently either side of a ridge, its eaves stepping out in
 * a saw-tooth, one tooth per gate, with a cross-shaped central block under a
 * flat roof and a curved glass front; white jet-bridge pods along both
 * sides; Hall L, a long glass pier under a flat dark roof crossed by rows of
 * linear skylights, gate pods along its sides, a lower central block.
 *
 * Evidence
 * - OSM (API map call, November 2026): Hall L relation/7410183 (outer
 *   way/112194527; its 34 inner rings are small gaps between gate pods and
 *   are roofed over here), Hall M way/170931654 (its outline draws the
 *   jet bridges, cut off by `despur` and drawn as bridges).
 * - Published: dates (fr.wikipedia, "Aéroport Paris-Charles-de-Gaulle":
 *   S3 2007, S4 2012).
 * - Terrain: Mapterhorn z15 (see above).
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Overview_of_Terminals_2E,_gates_L_and_M,_at_the_Paris_Charles_de_Gaulle_Airport_(CDG),_Roissy,_France_(21475287384).jpg
 *     (Charles from Port Chester, CC BY 2.0) both halls from the south-west,
 *     airborne: roofs, saw-tooth eaves, skylights, the central blocks, pods;
 *   https://commons.wikimedia.org/wiki/File:Paris_Charles_de_Gaulle_Airport_(CDG)_-_Overview_of_Terminals_2E_and_2F_(43790637690).jpg
 *     (Charles from Port Chester, CC BY 2.0) the halls from farther off;
 *
 * Numbers (estimated from the photos against the OSM widths): Hall M walls
 * to 22 m over y = 0, ridge 3 m higher, eaves 3–7 m out in the saw-tooth;
 * central block 24 m; Hall L roof 20 m with skylight rows every 12 m; gate
 * pods 12 m; jet bridges at 9.6–12.4 m (the apron's mean 6 m + 3.6…6.4).
 * Doubts: Hall L's west side and the halls' north ends are seen only from
 * far off; the roofs are drawn level over a sloping apron, as they look.
 */
import { type V3 } from './mesh'
import { type XY, quadN, unit, capPoly } from './nyc-570-lexington'
import { prismRing, writeLod, newMats, ccw, simplify, despur, jetBridges, type Mats } from './tokyo-haneda-terminal-1'
import { CDG, glassBlock } from './paris-cdg-terminal-1'
import { bandCuts } from './paris-cdg-terminal-2a-2d'

const AP = 6, M_EAVE = 22, M_RIDGE = 25, M_BLOCK = 24, L_ROOF = 20

function walls(M: Mats, r: XY[], top: number, fascia: number, detail: boolean) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue
    M.con.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], AP + 0.5], [a[0], a[1], AP + 0.5])
    M.win.quad([a[0], a[1], AP + 0.5], [b[0], b[1], AP + 0.5], [b[0], b[1], top - fascia], [a[0], a[1], top - fascia])
    M.white.quad([a[0], a[1], top - fascia], [b[0], b[1], top - fascia], [b[0], b[1], top], [a[0], a[1], top])
    if (detail && L > 8) { const k = Math.round(L / 8), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1] * 0.1, -u[0] * 0.1]
      for (let j = 1; j < k; j++) { const c: XY = [a[0] + (b[0] - a[0]) * j / k + n[0], a[1] + (b[1] - a[1]) * j / k + n[1]]; M.white.quad([c[0] - u[0] * 0.25, c[1] - u[1] * 0.25, AP + 0.5], [c[0] + u[0] * 0.25, c[1] + u[1] * 0.25, AP + 0.5], [c[0] + u[0] * 0.25, c[1] + u[1] * 0.25, top - fascia], [c[0] - u[0] * 0.25, c[1] - u[1] * 0.25, top - fascia]) } }
  }
}

function hallM(M: Mats, detail: boolean) {
  const { body: b0, spurs } = despur(SAT_M, 9.5, 40)
  const body = detail ? ccw(b0) : simplify(ccw(b0), 0.8)
  walls(M, body, M_EAVE, 1.6, detail)
  capPoly(M.roof, body, M_EAVE - 0.05)
  // the pitched roof with saw-tooth eaves, bay by bay along the pier
  const { cuts: raw } = bandCuts(body, 22, 1)
  const cuts = raw.filter(Boolean) as [XY, XY][]
  const w = (c: [XY, XY]) => Math.hypot(c[1][0] - c[0][0], c[1][1] - c[0][1])
  for (let i = 0; i < cuts.length - 1; i++) {
    const A = cuts[i], B = cuts[i + 1]
    if (w(A) > 60 || w(B) > 60) continue // the central block has its own flat roof
    for (const side of [0, 1]) {
      const mA: XY = [(A[0][0] + A[1][0]) / 2, (A[0][1] + A[1][1]) / 2], mB: XY = [(B[0][0] + B[1][0]) / 2, (B[0][1] + B[1][1]) / 2]
      const out = (c: [XY, XY], m: XY, d: number): XY => { const e = c[side], L = Math.hypot(e[0] - m[0], e[1] - m[1]); return [e[0] + ((e[0] - m[0]) / L) * d, e[1] + ((e[1] - m[1]) / L) * d] }
      // a tooth: the eave runs out from 3 m at one end of the bay to 7 m at the other
      const eA = out(A, mA, 3), eB = out(B, mB, 7)
      const p: V3[] = [[mA[0], mA[1], M_RIDGE], [mB[0], mB[1], M_RIDGE], [eB[0], eB[1], M_EAVE + 0.2], [eA[0], eA[1], M_EAVE + 0.2]]
      const e1: V3 = [p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]], e2: V3 = [p[3][0] - p[0][0], p[3][1] - p[0][1], p[3][2] - p[0][2]]
      let n = unit([e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]); if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
      quadN(M.roof, p[0], p[1], p[2], p[3], [n, n, n, n])
      // the soffit and the tooth's end face
      quadN(M.roof, [eA[0], eA[1], M_EAVE - 0.4], [eB[0], eB[1], M_EAVE - 0.4], [eB[0], eB[1], M_EAVE + 0.2], [eA[0], eA[1], M_EAVE + 0.2])
      const sB = B[side]
      M.white.quad([sB[0], sB[1], M_EAVE - 0.4], [eB[0], eB[1], M_EAVE - 0.4], [eB[0], eB[1], M_EAVE + 0.2], [sB[0], sB[1], M_EAVE + 0.2])
      M.white.quad([sB[0], sB[1], M_EAVE + 0.2], [eB[0], eB[1], M_EAVE + 0.2], [eB[0], eB[1], M_EAVE - 0.4], [sB[0], sB[1], M_EAVE - 0.4])
      if (detail) for (let k = 1; k < 4; k++) { // skylight dots along the ridge
        const t = k / 4, c: XY = [mA[0] + (mB[0] - mA[0]) * t, mA[1] + (mB[1] - mA[1]) * t], e: XY = [eA[0] + (eB[0] - eA[0]) * t, eA[1] + (eB[1] - eA[1]) * t]
        const q: XY = [c[0] + (e[0] - c[0]) * 0.25, c[1] + (e[1] - c[1]) * 0.25]
        prismRing(M.white, [[q[0] - 0.6, q[1] - 0.6], [q[0] + 0.6, q[1] - 0.6], [q[0] + 0.6, q[1] + 0.6], [q[0] - 0.6, q[1] + 0.6]], M_RIDGE - 1.2, M_RIDGE - 0.4, M.white)
      }
    }
  }
  // the central block: higher, flat-roofed
  const wide = cuts.filter((c) => w(c) > 60).flat()
  if (wide.length > 2) {
    const xs = wide.map((p) => p[0]), ys = wide.map((p) => p[1])
    const r: XY[] = [[Math.min(...xs), Math.min(...ys) - 6], [Math.max(...xs), Math.min(...ys) - 6], [Math.max(...xs), Math.max(...ys) + 6], [Math.min(...xs), Math.max(...ys) + 6]]
    glassBlock({ wall: M.con, win: M.win, trim: M.white, roof: M.roof }, r, M_EAVE - 1, M_BLOCK, { fascia: 1.6 })
    for (let k = 0; k < 3; k++) { const x = (r[0][0] + r[1][0]) / 2 - 16 + k * 16, y = (r[0][1] + r[2][1]) / 2; prismRing(M.white, [[x - 5, y - 3.5], [x + 5, y - 3.5], [x + 5, y + 3.5], [x - 5, y + 3.5]], M_BLOCK, M_BLOCK + 0.6, M.white) }
  }
  jetBridges({ ...M, bridge: M.metal, roof: M.metal }, spurs, { z0: AP + 3.6, z1: AP + 6.4, detail })
}

function hallL(M: Mats, detail: boolean) {
  const outer = SAT_L.find((r) => r.role === 'outer')!.ring
  const { body: b0, spurs } = despur(outer, 9.5, 40)
  const body = detail ? ccw(b0) : simplify(ccw(b0), 0.8)
  walls(M, body, L_ROOF, 1.8, detail)
  capPoly(M.roof, body, L_ROOF)
  // the skylight rows: white-framed slots straight across the roof, on the pier's axis
  const n0 = body.length, mx = body.reduce((t, p) => t + p[0], 0) / n0, my = body.reduce((t, p) => t + p[1], 0) / n0
  let sxx = 0, syy = 0, sxy = 0
  for (const [x, y] of body) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my) }
  const th = 0.5 * Math.atan2(2 * sxy, sxx - syy), ax: XY = [Math.cos(th), Math.sin(th)], ay: XY = [-ax[1], ax[0]]
  const pr = body.map(([x, y]) => (x - mx) * ax[0] + (y - my) * ax[1]), s0 = Math.min(...pr) + 10, s1 = Math.max(...pr) - 10
  const step = detail ? 12 : 18
  for (let q = s0; q <= s1; q += step) {
    const c: XY = [mx + ax[0] * q - ay[0] * 4, my + ax[1] * q - ay[1] * 4], h = 13, w = 1.6
    const r: XY[] = [[c[0] - ay[0] * h - ax[0] * w, c[1] - ay[1] * h - ax[1] * w], [c[0] - ay[0] * h + ax[0] * w, c[1] - ay[1] * h + ax[1] * w], [c[0] + ay[0] * h + ax[0] * w, c[1] + ay[1] * h + ax[1] * w], [c[0] + ay[0] * h - ax[0] * w, c[1] + ay[1] * h - ax[1] * w]]
    prismRing(M.white, r, L_ROOF - 0.1, L_ROOF + 1.2, M.white)
  }
  jetBridges({ ...M, bridge: M.metal, roof: M.metal }, spurs, { z0: AP + 3.6, z1: AP + 6.4, detail })
}

function build(detail: boolean) {
  const M: Mats = newMats(['con', 'roof', 'win', 'white', 'metal', 'glass'])
  hallM(M, detail)
  hallL(M, detail)
  return [
    { part: M.con, material: CDG.concrete },
    { part: M.roof, material: CDG.deck },
    { part: M.win, material: CDG.window },
    { part: M.white, material: CDG.white },
    { part: M.metal, material: CDG.metal },
    { part: M.glass, material: CDG.glass },
  ]
}

// ===========================================================================
// OSM data, in this frame (bearing 0, anchor 2.5876468, 49.0045219)
// ===========================================================================
/** relation/7410183 */
const SAT_L: { role: string; ring: XY[] }[] = [{role:"outer",ring:[[-145.2,-224.6],[-164.2,-226.2],[-163.5,-234.1],[-158.9,-290.8],[-140.9,-289.4],[-141.1,-287.4],[-134.0,-286.9],[-131.7,-314.1],[-139.0,-314.6],[-139.3,-311.5],[-156.8,-312.9],[-151.4,-378.3],[-133.2,-376.8],[-134.6,-359.7],[-127.5,-359.2],[-125.7,-382.2],[-132.7,-382.8],[-132.8,-381.4],[-150.4,-382.8],[-149.5,-394.0],[-151.4,-394.2],[-150.9,-401.1],[-183.8,-403.7],[-184.3,-397.1],[-186.3,-397.2],[-187.8,-378.9],[-196.2,-379.6],[-199.2,-379.8],[-198.7,-385.8],[-203.7,-386.2],[-204.2,-380.5],[-212.1,-381.2],[-212.4,-377.8],[-207.6,-377.4],[-208.8,-363.2],[-213.8,-363.6],[-222.9,-251.3],[-237.7,-69.8],[-238.1,-65.2],[-238.9,-55.8],[-239.9,-42.8],[-240.8,-32.7],[-240.9,-30.5],[-241.7,-21.1],[-242.1,-16.9],[-242.3,-14.4],[-242.6,-9.8],[-242.8,-7.2],[-243.7,2.8],[-246.4,36.2],[-247.2,46.5],[-247.6,56.6],[-249.1,74.7],[-250.5,86.5],[-271.3,341.1],[-261.9,341.9],[-262.8,352.8],[-271.0,352.1],[-271.3,355.9],[-263.2,356.5],[-263.7,361.7],[-259.6,362.0],[-258.0,342.1],[-252.0,342.6],[-243.7,343.2],[-244.3,350.3],[-210.1,353.1],[-208.4,332.1],[-206.9,332.2],[-204.6,305.0],[-189.5,306.2],[-189.6,308.4],[-182.8,309.0],[-180.7,283.1],[-187.8,282.6],[-187.8,283.5],[-202.8,282.3],[-199.0,235.5],[-183.8,236.7],[-184.1,239.5],[-176.9,240.1],[-174.6,212.4],[-181.9,211.8],[-182.0,213.0],[-197.1,211.8],[-193.4,166.3],[-178.3,167.5],[-178.5,169.8],[-171.5,170.4],[-169.3,143.5],[-176.0,142.9],[-176.2,144.8],[-191.5,143.5],[-188.6,107.6],[-173.1,108.9],[-173.3,110.9],[-166.1,111.4],[-164.0,85.0],[-170.7,84.5],[-170.8,85.0],[-186.7,83.7],[-184.6,57.5],[-163.7,59.1],[-163.3,54.0],[-159.6,8.9],[-159.1,2.5],[-158.3,-6.7],[-157.0,-22.9],[-156.3,-30.9],[-155.6,-39.6],[-179.2,-41.5],[-178.3,-52.0],[-173.4,-112.5],[-155.2,-111.0],[-155.4,-108.8],[-148.3,-108.2],[-146.3,-132.8],[-146.1,-135.3],[-153.0,-135.9],[-153.2,-132.8],[-171.7,-134.2],[-166.2,-201.3],[-147.6,-199.5],[-147.7,-198.0],[-141.2,-197.4],[-138.7,-224.7],[-145.2,-225.3]]},{role:"inner",ring:[[-145.6,-220.2],[-147.2,-203.5],[-165.9,-205.4],[-164.5,-221.9]]},{role:"inner",ring:[[-204.2,300.0],[-203.1,286.4],[-188.1,287.3],[-189.1,301.0]]},{role:"inner",ring:[[-171.2,89.5],[-172.5,103.2],[-188.2,101.9],[-187.8,97.4],[-187.0,88.1]]},{role:"inner",ring:[[-176.5,148.3],[-177.8,162.6],[-193.0,161.5],[-191.8,146.9]]},{role:"inner",ring:[[-197.4,216.0],[-182.3,217.4],[-183.5,232.3],[-198.7,231.1]]},{role:"inner",ring:[[-173.1,-115.9],[-172.0,-129.4],[-153.6,-128.1],[-155.0,-114.7]]},{role:"inner",ring:[[-140.6,-292.9],[-139.5,-307.2],[-157.1,-308.2],[-158.5,-294.3]]},{role:"inner",ring:[[-204.2,-318.0],[-192.9,-317.3],[-191.6,-333.2],[-202.9,-334.0]]},{role:"inner",ring:[[-200.7,-360.9],[-189.3,-360.2],[-188.0,-376.3],[-199.4,-377.1]]},{role:"inner",ring:[[-202.7,-336.4],[-191.4,-335.8],[-189.6,-356.9],[-201.0,-357.4]]},{role:"inner",ring:[[-218.0,-149.8],[-206.8,-149.1],[-205.4,-165.2],[-216.7,-165.8]]},{role:"inner",ring:[[-214.8,-188.4],[-216.4,-169.0],[-205.2,-168.1],[-203.6,-187.6]]},{role:"inner",ring:[[-218.3,-146.2],[-219.9,-126.4],[-208.7,-125.5],[-207.1,-145.3]]},{role:"inner",ring:[[-238.3,99.4],[-227.7,100.2],[-226.2,80.2],[-242.1,79.0],[-243.1,93.5],[-237.9,93.9]]},{role:"inner",ring:[[-250.6,249.1],[-249.3,233.2],[-238.2,234.0],[-239.5,249.9]]},{role:"inner",ring:[[-254.3,294.6],[-255.8,313.5],[-244.5,314.4],[-243.0,295.5]]},{role:"inner",ring:[[-243.7,165.2],[-242.4,149.5],[-231.7,150.4],[-232.9,166.1]]},{role:"inner",ring:[[-249.0,229.9],[-237.9,230.5],[-236.4,211.0],[-247.4,210.5]]},{role:"inner",ring:[[-242.2,146.5],[-231.4,147.0],[-229.8,127.1],[-240.6,126.6]]},{role:"inner",ring:[[-254.0,291.3],[-242.8,292.2],[-241.5,276.5],[-252.8,275.6]]},{role:"inner",ring:[[-247.2,207.4],[-236.2,208.4],[-234.9,192.2],[-245.9,191.3]]},{role:"inner",ring:[[-240.3,123.4],[-229.6,123.8],[-228.3,107.7],[-239.0,107.3]]},{role:"inner",ring:[[-252.5,272.8],[-241.3,273.3],[-239.8,253.9],[-250.9,253.4]]},{role:"inner",ring:[[-257.4,332.6],[-246.0,333.6],[-244.8,317.4],[-256.1,316.4]]},{role:"inner",ring:[[-245.6,188.4],[-234.7,189.1],[-233.2,169.7],[-244.0,169.0]]},{role:"inner",ring:[[-211.1,-233.6],[-199.9,-232.8],[-198.5,-248.8],[-209.8,-249.7]]},{role:"inner",ring:[[-209.6,-252.5],[-198.3,-251.8],[-196.6,-272.1],[-207.9,-272.8]]},{role:"inner",ring:[[-206.1,-295.0],[-194.8,-294.4],[-193.1,-314.4],[-204.5,-314.9]]},{role:"inner",ring:[[-207.6,-275.9],[-196.4,-275.1],[-195.1,-290.8],[-206.4,-291.7]]},{role:"inner",ring:[[-214.5,-191.5],[-203.4,-190.4],[-202.0,-206.6],[-213.2,-207.8]]},{role:"inner",ring:[[-213.1,-209.9],[-201.8,-209.2],[-200.1,-229.4],[-211.4,-230.0]]},{role:"inner",ring:[[-221.4,-107.6],[-210.2,-106.9],[-208.9,-122.8],[-220.1,-123.5]]},{role:"inner",ring:[[-223.2,-85.3],[-212.1,-84.7],[-210.5,-104.1],[-221.7,-104.7]]},{role:"inner",ring:[[-223.5,-81.7],[-212.4,-80.8],[-213.7,-64.7],[-224.8,-65.6]]}]
/** way/170931654 */
const SAT_M: XY[] = [[262.5,-114.9],[268.9,-195.4],[305.6,-192.8],[306.4,-200.0],[269.5,-202.0],[276.1,-283.7],[313.1,-280.7],[313.8,-287.2],[276.6,-289.9],[281.2,-349.9],[246.4,-354.0],[247.9,-368.5],[313.9,-363.3],[314.2,-367.0],[244.1,-373.1],[242.1,-354.5],[240.4,-354.9],[237.2,-316.7],[202.0,-320.0],[201.4,-313.4],[236.7,-311.1],[231.2,-245.1],[195.7,-248.1],[195.1,-241.8],[230.7,-239.5],[224.6,-174.5],[190.2,-177.6],[189.7,-170.8],[224.0,-168.5],[218.3,-102.6],[185.0,-105.4],[184.0,-99.2],[217.7,-97.0],[212.0,-29.1],[177.1,-31.6],[176.9,-25.5],[211.2,-23.3],[210.6,-15.5],[120.0,-21.8],[119.1,-11.1],[118.6,-3.8],[117.0,16.8],[116.7,21.6],[116.4,26.4],[115.9,35.3],[113.7,63.3],[112.8,72.9],[112.4,77.3],[111.6,86.8],[205.0,96.0],[199.0,169.2],[160.2,166.8],[159.9,173.1],[198.3,175.9],[192.9,239.3],[156.5,236.2],[156.0,242.6],[192.3,245.5],[186.4,310.7],[151.5,308.2],[151.1,314.2],[185.9,316.9],[181.4,370.2],[183.6,370.3],[182.6,382.5],[148.2,380.4],[148.0,384.0],[186.2,386.8],[187.0,382.9],[216.1,384.8],[218.0,373.3],[222.5,373.4],[226.9,320.4],[263.8,323.0],[264.5,316.7],[227.4,314.6],[234.1,233.3],[270.9,235.8],[271.5,230.5],[234.6,227.0],[241.5,144.9],[278.8,148.1],[279.1,142.2],[241.8,140.3],[245.2,99.4],[249.2,99.7],[284.8,102.2],[285.8,91.5],[287.1,77.4],[289.6,50.3],[290.5,39.8],[290.9,35.9],[291.2,32.5],[291.6,29.0],[292.9,14.6],[295.2,-10.5],[274.3,-11.3],[259.3,-13.2],[254.2,-13.6],[261.9,-109.1],[298.0,-105.8],[298.5,-111.6]]

if (import.meta.main) {
  const extras = { bearing: 0, osm: 'way/170931654', height: M_RIDGE }
  writeLod('Paris-CDG Terminal 2E Halls L and M', 'paris-cdg-terminal-2e-satellites.glb', build(false), extras, 8000, 250_000)
  writeLod('Paris-CDG Terminal 2E Halls L and M', 'paris-cdg-terminal-2e-satellites.detail.glb', build(true), extras, 40_000, 1_500_000)
}
