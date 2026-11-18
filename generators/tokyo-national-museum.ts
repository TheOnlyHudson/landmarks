/**
 * Tokyo National Museum, Honkan (東京国立博物館 本館; the former Tokyo
 * Imperial Household Museum main building, 旧東京帝室博物館本館), Ueno Park,
 * Tokyo: procedural, CC0-1.0.  bun generators/tokyo-national-museum.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 *
 * Jin Watanabe's competition design, carried out by the Imperial Household
 * Ministry, 1932-1937, opened 1938; Important Cultural Property (2001). The
 * "Imperial Crown style" (帝冠様式): a long, symmetric, two-storey
 * Western-style body faced in pale beige tile over a granite base, under a
 * huge Japanese hipped-and-gabled (irimoya) roof of dark tile with gently
 * upturned corners; a central entrance porch in granite with its own
 * irimoya roof, its gable to the front, white plaster with curved
 * bargeboards. Identity, in order: the long dark roof over the long beige
 * wall; the porch; the projecting balcony band with its white balustrade
 * at the upper floor; the upper row of windows between pilasters under a
 * deep bracketed cornice; the end blocks with their own, slightly lower
 * roofs.
 *
 * Frame: origin at the outline's centroid (139.776466, 35.718871), bearing
 * 30.38 (the outline's sides run at 30.4 / 120.4 degrees), so the front
 * faces the model's -y (compass 210, south-south-west, toward the pond and
 * the main gate). The plan is symmetric about x = 0.25. The forecourt is
 * level, but the map's terrain dips 2.3 m inside the outline (the ground
 * just outside stands 2.3-2.9 m over the lowest point, tools/terrain.ts
 * check), so y = 0 is that low point and the building stands on the
 * forecourt at ZG = 2.3 m, its granite base run down to y = 0. Heights
 * below are above the forecourt. elevation 0.
 *
 * Plan (OSM relation/2737745, multipolygon: outer way/145344125, two inner
 * courtyards way/203960904 and way/203960905; measured, in this frame):
 * the porch x ±13.65, y -52.7..-36.4; the front range x ±47.2, front wall
 * y -36.5, back to the courtyards at y -7.4; the end blocks |x| 47.2..57.8,
 * their front set back to y -33.4; the side ranges |x| 32.3..57.8 back to
 * y 43.5; the back range y 22.1..43.5 (its middle, |x| < 31.2, set in to
 * 41.0); the central spine |x| < 11.65 between the courtyards
 * (|x| 11.65..32.3, y -7.4..22.1). Published: building area 6,601.8 m2, two
 * storeys and two basements, steel-reinforced concrete, hongawara tile
 * roof, with front entrance porch (Agency for Cultural Affairs, Cultural
 * Heritage Online, 旧東京帝室博物館本館).
 * Heights (estimated: no published height found; scaled from Wiiii's
 * frontal photo of 2010 against the 115 m width of the front): granite
 * base to 1.6 m; the balcony band 15.3-16.4 m; the upper windows
 * 17.0-19.6 m between pilasters at 3.6 m; the cornice and its brackets to
 * 20.6 m; the front roof's eave 21.3 m, its gable foot 24.7 m, ridge 29.8 m
 * (a 0.5 average pitch, Japanese tile; the photos show the ridge some 7 m
 * over the eave from the front, foreshortened); the end blocks' and side
 * ranges' ridges 28.4 m, the back range's 27.2 m; the porch (reworked after review to
 * Wiiii's and TPFUUT's photos: about half the main eave's height, steep and
 * bold): walls and piers to 9.0 m, three openings to 7.6 m between four
 * square piers, a hipped skirt with turned-up corners (eave 9.7 m, rising
 * 2.0 m at the corners), over it a steep gable roof with a curved
 * karahafu-like section, foot 12.4 m, ridge 18.6 m, 18 m wide at its foot,
 * run back to the main wall, its curved white bargeboard with a tile roll,
 * and a ridge-end ornament; the main roofs' corners sweep up 2.2 m on a platform 1.2 m high with steps.
 * Colours (daylight photos): walls beige tile #d8ccb5 (the photos'
 * #cfc2a9, pulled to the palette's lightness); granite base, porch and
 * balustrade #ddd8ce; roof tile dark brown #6f5a52 (the photos' #5a4640,
 * kept dark as the roof is the identity, pulled to charcoal's lightness);
 * the cornice brackets and soffits in a shadowed taupe #a39788; windows the
 * palette window slate.
 * Night: the facade is floodlit (Pocsywe's night photo: the wall and the
 * porch lit warm, the roof dark); the porch's openings glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Tokyo National Museum, Honkan 2010.jpg, Wiiii, CC BY-SA 3.0 (front, frontal, from the pond)
 *  - Tokyo National Museum P9234926.jpg, Kestrel, CC BY-SA 4.0 (south-east, elevated)
 *  - Tokyo National Museum Main Building P1145564.jpg, Kestrel, CC BY-SA 4.0 (porch, south-west)
 *  - Main building of the Tokyo National Museum 20170208.jpg, Suicasmo, CC BY-SA 4.0
 *  - Main building of the Tokyo National Museum.jpg, TPFUUT, CC BY-SA 4.0 (porch close)
 *  - Main building of the Tokyo National Museum 200610a.jpg / 200610l.jpg, 江戸村のとくぞう, CC BY-SA 4.0
 *  - Main building of the Tokyo National Museum 1.jpg / 2.jpg, Christophe95, CC BY-SA 4.0
 *  - Tokyo National Museum main building at night.jpg, Pocsywe, CC0 (night)
 *  - Tokyo National Museum in 2025.jpg, ノボホショコロ, CC BY 4.0 (front, far)
 * Look-only: 上野公園航空写真1984.jpg (MLIT/GSI aerial, attribution licence,
 * tagged look-only): confirms the ring plan round two courtyards and that
 * the roof follows the ring.
 * Doubts: every height is a photo estimate; the rear and courtyard faces
 * are not photographed and are drawn like the front, plainer; how the
 * roofs of the ranges meet at the back corners (drawn as overlapping
 * irimoya roofs); the spine's roof (hidden from the ground; drawn as a
 * lower hipped roof).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { jroof, type HanokParts, quadOut, triOut, bar } from './tokyo-sensoji'
import { prism, capPoly, writeModel, rect, type XY, type Layer } from './tokyo-metropolitan-government-building'

type Lod = { detail: boolean }
const LOW: Lod = { detail: false }
const DETAIL: Lod = { detail: true }

const X0 = 0.25 // the plan's axis of symmetry
/** The forecourt above the lowest map ground under the footprint (tools/terrain.ts check). */
const ZG = 2.3
const ZB = 1.6, ZBAL0 = 15.3, ZBAL1 = 16.4, ZW = 20.6

type M = { wall: Part; stone: Part; tile: Part; win: Part; trim: Part }

/** Copy `src` into `dst` turned 90 degrees counter-clockwise (map frame) and moved by (dx, dy). */
function turnInto(src: Part, dst: Part, dx: number, dy: number, quarter = 1) {
  // Part stores glTF (X, Y, Z) = (x, z, -y). A quarter turn ccw in the map
  // frame, (x, y) -> (-y, x), is (X, Z) -> (Z, -X) in glTF.
  for (let i = 0; i < src.pos.length; i += 3) {
    let X = src.pos[i], Z = src.pos[i + 2], nX = src.nrm[i], nZ = src.nrm[i + 2]
    for (let q = 0; q < quarter; q++) { [X, Z] = [Z, -X]; [nX, nZ] = [nZ, -nX] }
    dst.pos.push(X + dx, src.pos[i + 1], Z - dy)
    dst.nrm.push(nX, src.nrm[i + 1], nZ)
    dst.uv.push(src.uv[(i / 3) * 2], src.uv[(i / 3) * 2 + 1])
  }
}

/** The facade treatment along one wall from a to b (outward to the right of a->b). */
function facade(m: M, L: Lod, a: XY, b: XY, o: { ground?: 'tall' | 'small' | 'none'; bay?: number; ze?: number; skip?: [number, number] } = {}) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, out: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  const N: V3 = [n[0], n[1], 0]
  const ze = o.ze ?? ZW
  // the balcony band: a slab projecting 0.7 m with a white balustrade
  const bal = (s0: number, s1: number) => {
    quadOut(m.stone, P(s0, ZBAL0, 0.7), P(s1, ZBAL0, 0.7), P(s1, ZBAL1, 0.7), P(s0, ZBAL1, 0.7), N)
    quadOut(m.stone, P(s0, ZBAL0, 0), P(s1, ZBAL0, 0), P(s1, ZBAL0, 0.7), P(s0, ZBAL0, 0.7), [0, 0, -1])
    quadOut(m.stone, P(s0, ZBAL1, 0.7), P(s1, ZBAL1, 0.7), P(s1, ZBAL1, 0), P(s0, ZBAL1, 0), [0, 0, 1])
    // balustrade rail (solid, low) at the band's edge
    quadOut(m.stone, P(s0, ZBAL1, 0.68), P(s1, ZBAL1, 0.68), P(s1, ZBAL1 + 0.9, 0.68), P(s0, ZBAL1 + 0.9, 0.68), N)
    quadOut(m.stone, P(s0, ZBAL1 + 0.9, 0.68), P(s1, ZBAL1 + 0.9, 0.68), P(s1, ZBAL1 + 0.9, 0.5), P(s0, ZBAL1 + 0.9, 0.5), [0, 0, 1])
    quadOut(m.stone, P(s1, ZBAL1 + 0.9, 0.5), P(s0, ZBAL1 + 0.9, 0.5), P(s0, ZBAL1, 0.5), P(s1, ZBAL1, 0.5), [-n[0], -n[1], 0])
    for (const s of [s0, s1]) {
      const sgn = s === s0 ? -1 : 1
      quadOut(m.stone, P(s, ZBAL0, 0), P(s, ZBAL0, 0.7), P(s, ZBAL1 + (sgn ? 0.9 : 0), 0.7), P(s, ZBAL1, 0), [u[0] * sgn, u[1] * sgn, 0])
    }
  }
  bal(0.3, len - 0.3)
  // the cornice band and brackets under the eaves: a taupe band, proud
  quadOut(m.trim, P(0, ze - 0.9, 0.35), P(len, ze - 0.9, 0.35), P(len, ze, 0.35), P(0, ze, 0.35), N)
  quadOut(m.trim, P(0, ze - 0.9, 0), P(len, ze - 0.9, 0), P(len, ze - 0.9, 0.35), P(0, ze - 0.9, 0.35), [0, 0, -1])
  // the granite base
  quadOut(m.stone, P(0, 0, 0.12), P(len, 0, 0.12), P(len, ZB, 0.12), P(0, ZB, 0.12), N)
  // bays: upper windows between pilasters; ground-floor tall windows
  const bay = o.bay ?? 3.6
  const nb = Math.max(1, Math.round((len - 2) / bay)), bw = (len - 2) / nb
  for (let k = 0; k < nb; k++) {
    const s0 = 1 + k * bw, sm = s0 + bw / 2
    if (o.skip && sm > o.skip[0] && sm < o.skip[1]) continue
    // upper window
    quadOut(m.win, P(sm - bw * 0.3, 17.0, 0.06), P(sm + bw * 0.3, 17.0, 0.06), P(sm + bw * 0.3, 19.4, 0.06), P(sm - bw * 0.3, 19.4, 0.06), N)
    // the pilaster to its left (the wall between)
    if (L.detail) {
      const ps = s0
      quadOut(m.wall, P(ps - 0.35, ZBAL1, 0.25), P(ps + 0.35, ZBAL1, 0.25), P(ps + 0.35, ze - 0.9, 0.25), P(ps - 0.35, ze - 0.9, 0.25), N)
      for (const sg of [-1, 1]) quadOut(m.wall, P(ps + 0.35 * sg, ZBAL1, 0), P(ps + 0.35 * sg, ZBAL1, 0.25), P(ps + 0.35 * sg, ze - 0.9, 0.25), P(ps + 0.35 * sg, ze - 0.9, 0), [u[0] * sg, u[1] * sg, 0])
      // brackets under the cornice
      for (const t of [0.25, 0.5, 0.75]) {
        const s = s0 + bw * t
        bracket(m.trim, P(s, ze - 0.9, 0.35), N, u)
      }
    }
  }
  // ground floor windows: tall, in pairs of bays
  if ((o.ground ?? 'tall') !== 'none') {
    const gb = bay * 2, ng = Math.max(1, Math.round((len - 4) / gb)), gw = (len - 4) / ng
    for (let k = 0; k < ng; k++) {
      const sm = 2 + gw * (k + 0.5)
      if (o.skip && sm > o.skip[0] - 2 && sm < o.skip[1] + 2) continue
      const z0 = o.ground === 'small' ? 4.0 : 3.0, z1 = o.ground === 'small' ? 7.5 : 12.6, hw = o.ground === 'small' ? 0.9 : 1.1
      quadOut(m.win, P(sm - hw, z0, 0.06), P(sm + hw, z0, 0.06), P(sm + hw, z1, 0.06), P(sm - hw, z1, 0.06), N)
      if (L.detail) {
        // a stone surround
        quadOut(m.stone, P(sm - hw - 0.35, z0 - 0.35, 0.04), P(sm + hw + 0.35, z0 - 0.35, 0.04), P(sm + hw + 0.35, z1 + 0.35, 0.04), P(sm - hw - 0.35, z1 + 0.35, 0.04), N)
      }
    }
  }
}

/** A small corbel under the cornice: a block stepping out. */
function bracket(p: Part, at: V3, n: V3, u: XY) {
  const w = 0.22
  const Q = (s: number, z: number, out: number): V3 => [at[0] + u[0] * s + n[0] * out, at[1] + u[1] * s + n[1] * out, at[2] + z]
  quadOut(p, Q(-w, -0.7, 0), Q(w, -0.7, 0), Q(w, 0, 0.55), Q(-w, 0, 0.55), [n[0], n[1], -0.6])
  triOut(p, Q(-w, -0.7, 0), Q(-w, 0, 0.55), Q(-w, 0, 0), [-u[0], -u[1], 0])
  triOut(p, Q(w, -0.7, 0), Q(w, 0, 0), Q(w, 0, 0.55), [u[0], u[1], 0])
}

function build(L: Lod) {
  const m: M = { wall: new Part(), stone: new Part(), tile: new Part(), win: new Part(), trim: new Part() }
  const D = L.detail
  const x = (v: number) => X0 + v
  // ------------------------------------------------------------ the body
  // front range + end blocks + side ranges + back range, as one ring with
  // two courtyards; walls drawn per block
  const FY = -36.5, EY = -33.4, BY = 43.5, BYM = 41.0
  // the outer outline (counter-clockwise), symmetric
  const half: XY[] = [[0, FY], [47.2, FY], [47.2, EY], [57.8, EY], [57.8, BY], [31.2, BY], [31.2, BYM], [0, BYM]]
  const outer: XY[] = [...half.slice(1, -1).map(([a, b]) => [x(a), b] as XY), ...[...half].reverse().slice(1, -1).map(([a, b]) => [x(-a), b] as XY)]
  // walls of the outer ring: beige from the base to the cornice
  prism(m.wall, outer, 0, ZW, { bevel: 0.4, top: false })
  // courtyards: inner walls (face into the court)
  const courts: XY[][] = [rect(x(22.0), 7.35, 10.3, 14.75), rect(x(-22.0), 7.35, 10.3, 14.75)]
  for (const c of courts) {
    const r = [...c].reverse()
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4]
      quadOut(m.wall, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 17.6], [a[0], a[1], 17.6], [(a[0] + b[0]) / 2 - c.reduce((t, q) => t + q[0] / 4, 0), (a[1] + b[1]) / 2 - c.reduce((t, q) => t + q[1] / 4, 0), 0].map((v) => -v) as V3)
    }
  }
  // flat roof under the tiled roofs (hidden; closes the top where roofs leave gaps)
  // facades: front (left of porch, right of porch), end blocks, sides, back
  const front: Array<[XY, XY, object]> = [
    [[x(-47.2), FY], [x(47.2), FY], { skip: [47.2 - 14.2, 47.2 + 14.2] }],
    [[x(47.2), EY], [x(57.8), EY], { ground: 'small' }],
    [[x(-57.8), EY], [x(-47.2), EY], { ground: 'small' }],
    [[x(57.8), EY], [x(57.8), BY], {}],
    [[x(-57.8), BY], [x(-57.8), EY], {}],
    [[x(57.8), BY], [x(31.2), BY], { ground: 'small' }],
    [[x(-31.2), BY], [x(-57.8), BY], { ground: 'small' }],
    [[x(31.2), BYM], [x(-31.2), BYM], { ground: 'small' }],
  ]
  for (const [a, b, o] of front) facade(m, L, a, b, o as never)
  // the end blocks' face is a little plainer: a round medallion in the detail
  if (D) for (const s of [-1, 1]) {
    const cx = x(s * 52.5), k = 16
    const ring = (r: number, out: number) => Array.from({ length: k }, (_, i) => { const a = (i / k) * Math.PI * 2; return [cx + r * Math.cos(a), EY - out, 12 + r * Math.sin(a)] as V3 })
    fan(m.stone, ring(1.6, 0.05), [0, -1, 0])
  }

  // ------------------------------------------------------------ roofs
  const tileParts: HanokParts = { roof: m.tile, stone: m.tile, red: m.tile, green: m.trim, teal: m.trim, lattice: m.win }
  const coarse = D ? false : true
  // the front range: ridge along x, gables at the ends
  jroof(tileParts, {
    coarse, cx: x(0), cy: (FY - 7.4) / 2, kind: 'paljak',
    ex: 47.2 + 2.4, ey: 14.55 + 2.6, ze: 21.3, gx: 43.5, gy: 8.5, zg: 24.7, zr: 29.8, rx: 43.5,
    lift: 2.2, flare: 1.3, sag: 0.4, th: 0.7, pow: 2.4,
    soffit: { bx: 47.2 + 0.3, by: 14.55 + 0.3, zb: ZW },
    ridge: { h: 0.9, w: 0.9, ornament: D ? 1.3 : 0 }, ridgeSag: 0.1, hipRidge: { w: 0.45, h: 0.35 },
  })
  // the side ranges (with the end blocks): ridge along y, built along x and turned
  for (const s of [-1, 1]) {
    const tmp: M = { wall: new Part(), stone: new Part(), tile: new Part(), win: new Part(), trim: new Part() }
    const tp: HanokParts = { roof: tmp.tile, stone: tmp.tile, red: tmp.tile, green: tmp.trim, teal: tmp.trim, lattice: tmp.win }
    const len = BY - EY, hw = (57.8 - 32.3) / 2
    jroof(tp, {
      coarse, cx: 0, cy: 0, kind: 'paljak',
      ex: len / 2 + 2.2, ey: hw + 2.4, ze: 21.0, gx: len / 2 - 3.5, gy: 7.0, zg: 24.2, zr: 28.4, rx: len / 2 - 3.5,
      lift: 2.0, flare: 1.2, sag: 0.4, th: 0.7, pow: 2.4,
      soffit: { bx: len / 2 + 0.3, by: hw + 0.3, zb: ZW },
      ridge: { h: 0.8, w: 0.8, ornament: D ? 1.1 : 0 }, ridgeSag: 0.1, hipRidge: { w: 0.42, h: 0.32 },
    })
    // turned a quarter: the build's x becomes y; centre at (x(s * 45.05), (EY + BY) / 2)
    turnInto(tmp.tile, m.tile, x(s * 45.05), (EY + BY) / 2)
    turnInto(tmp.trim, m.trim, x(s * 45.05), (EY + BY) / 2)
  }
  // the back range
  jroof(tileParts, {
    coarse, cx: x(0), cy: (22.1 + BYM) / 2, kind: 'paljak',
    ex: 32.3 + 1.0, ey: (BYM - 22.1) / 2 + 2.2, ze: 20.8, gx: 29.0, gy: 5.0, zg: 23.6, zr: 27.2, rx: 29.0,
    lift: 0.6, flare: 0.4, sag: 0.35, th: 0.6, pow: 1.8,
    soffit: { bx: 32.3, by: (BYM - 22.1) / 2 + 0.3, zb: ZW },
    ridge: { h: 0.7, w: 0.7 }, ridgeSag: 0.05, hipRidge: { w: 0.4, h: 0.3 },
  })
  // the spine between the courtyards: a lower hipped roof, ridge along y
  {
    const tmp: M = { wall: new Part(), stone: new Part(), tile: new Part(), win: new Part(), trim: new Part() }
    const tp: HanokParts = { roof: tmp.tile, stone: tmp.tile, red: tmp.tile, green: tmp.trim, teal: tmp.trim, lattice: tmp.win }
    jroof(tp, {
      coarse: D ? true : 2, cx: 0, cy: 0, kind: 'hip',
      ex: 16.5, ey: 11.65 + 1.2, ze: 19.6, gx: 6.0, gy: 0, zg: 26.0, zr: 26.0,
      lift: 0.3, flare: 0.2, sag: 0.3, th: 0.5, ridge: { h: 0.6, w: 0.6 }, hipRidge: { w: 0.35, h: 0.25 },
    })
    turnInto(tmp.tile, m.tile, x(0), 7.35)
    turnInto(tmp.trim, m.trim, x(0), 7.35)
    // its walls above the courts' roofs (the court walls stop at 17.6)
    for (const s of [-1, 1]) quadOut(m.wall, [x(s * 11.65), -7.4, 17.6], [x(s * 11.65), 22.1, 17.6], [x(s * 11.65), 22.1, 19.6], [x(s * 11.65), -7.4, 19.6], [s, 0, 0])
  }
  // the courtyard-side walls of the ranges between 17.6 and the roofs are
  // under the roofs' soffits; close the courts' rims with a taupe band
  for (const c of courts) prism(m.trim, c, 17.6, 18.0, { bevel: 0.05, top: false })

  // ------------------------------------------------------------ the porch
  {
    const px0 = -13.65, px1 = 13.65, py0 = -52.7, py1 = FY
    const zf = 1.2 // the porch floor
    // platform and steps (front), granite
    prism(m.stone, [[x(px0 - 1.0), py0 - 1.2], [x(px1 + 1.0), py0 - 1.2], [x(px1 + 1.0), py1], [x(px0 - 1.0), py1]], 0, zf, { bevel: 0.1 })
    for (let i = 0; i < 4; i++) {
      const d = 1.2 + 0.4 * (i + 1), z = zf - 0.3 * (i + 1)
      prism(m.stone, [[x(-9 - 0.5 * i), py0 - d], [x(9 + 0.5 * i), py0 - d], [x(9 + 0.5 * i), py0 - 1.2], [x(-9 - 0.5 * i), py0 - 1.2]], 0, z + 0.3, { bevel: 0.03 })
    }
    // the porch body: granite walls to 9.0 m, the front open in three tall
    // bays between four square piers
    const ZP = 9.0
    const ring: XY[] = [[x(px0), py0], [x(px1), py0], [x(px1), py1], [x(px0), py1]]
    prism(m.stone, ring, zf, ZP, { bevel: 0.3, top: false })
    capPoly(m.stone, ring, ZP)
    const bays = [[-10.4, -4.4], [-2.9, 2.9], [4.4, 10.4]]
    for (const [s0, s1] of bays) {
      quadOut(m.win, [x(s0), py0 - 0.06, zf + 0.1], [x(s1), py0 - 0.06, zf + 0.1], [x(s1), py0 - 0.06, 7.6], [x(s0), py0 - 0.06, 7.6], [0, -1, 0])
    }
    for (const sx of [-1, 1]) {
      quadOut(m.win, [x(sx * (px1 + 0.06)), -48.5, zf + 0.1], [x(sx * (px1 + 0.06)), -41.5, zf + 0.1], [x(sx * (px1 + 0.06)), -41.5, 7.0], [x(sx * (px1 + 0.06)), -48.5, 7.0], [sx, 0, 0])
    }
    // the four piers stand proud of the front, under a lintel band
    for (const s of [-12.0, -3.65, 3.65, 12.0]) prism(m.stone, rect(x(s), py0 - 0.35, 0.8, 0.4), zf, 7.8, { bevel: 0.12, top: false })
    prism(m.stone, [[x(px0 - 0.1), py0 - 0.8], [x(px1 + 0.1), py0 - 0.8], [x(px1 + 0.1), py0], [x(px0 - 0.1), py0]], 7.6, ZP, { bevel: 0.12 })
    if (D) for (let k = 0; k < 14; k++) {
      // rafter-like brackets under the porch eaves (front)
      const xx = -12.6 + k * 1.94
      prism(m.trim, rect(x(xx), py0 - 1.2, 0.18, 0.45), ZP - 0.35, ZP + 0.05, { bevel: 0.02 })
    }

    // The porch roof: a hipped skirt with turned-up corners all round, and
    // over it a steep gable roof whose section is the curved (karahafu-like)
    // profile of its front bargeboards, run back to the main wall. Built
    // here directly (the kit's skirt for the lower roof).
    const ZE = 9.7, ZG2 = 12.4, ZR = 18.6
    const ox = 2.6 // overhang
    const yb = py1 + 0.6, yf = py0 - ox // roof extent front to back
    const cyR = (yf + yb) / 2, eyR = (yb - yf) / 2, exR = (px1 - px0) / 2 + ox
    const gw = 9.0 // the gable's half-width at its foot
    const gyIn = eyR - 1.3 // the skirt's inner edge in y (the gable stands 1.3 m in from the front eave)
    const skirt: HanokParts = { roof: m.tile, stone: m.tile, red: m.tile, green: m.trim, teal: m.trim, lattice: m.win }
    jroof(skirt, {
      coarse: D ? false : true, cx: x(0), cy: cyR, kind: 'skirt',
      ex: exR, ey: eyR, ze: ZE, gx: gw, gy: gyIn, zg: ZG2,
      lift: 2.0, flare: 1.1, sag: 0.4, th: 0.6, pow: 1.7,
      soffit: { bx: (px1 - px0) / 2 + 0.2, by: (py1 - py0) / 2, zb: ZP },
      hipRidge: { w: 0.4, h: 0.35 },
    })
    // the curved section: high in the middle, convex over the top, falling
    // concave to the feet and flicking out past them (t = |x| / gw)
    const prof = (t: number) => {
      const tt = Math.min(1, t)
      let z = ZG2 + (ZR - ZG2) * 0.5 * (1 + Math.cos(Math.PI * Math.pow(tt, 0.9)))
      if (t > 1) z = ZG2 - 0.25 * (t - 1) / 0.18 + 0.9 * Math.pow((t - 1) / 0.18, 2.2)
      return z
    }
    const K = D ? 28 : 14
    const ts: number[] = []
    for (let i = 0; i <= K; i++) ts.push(-1.18 + (2.36 * i) / K)
    const yg = cyR - gyIn // the gable's plane
    const ys = D ? [yg - 0.3, yg + 2, yg + 5, yb] : [yg - 0.3, yb]
    // the tiled upper roof: the profile run from the gable back to the wall
    for (let j = 0; j < ys.length - 1; j++) for (let i = 0; i < K; i++) {
      const t0 = ts[i], t1 = ts[i + 1]
      const A: V3 = [x(t0 * gw), ys[j], prof(Math.abs(t0)) + 0.35], B: V3 = [x(t1 * gw), ys[j], prof(Math.abs(t1)) + 0.35]
      const Cc: V3 = [x(t1 * gw), ys[j + 1], prof(Math.abs(t1)) + 0.35], Dd: V3 = [x(t0 * gw), ys[j + 1], prof(Math.abs(t0)) + 0.35]
      const mx = (t0 + t1) / 2
      const slope = (prof(Math.abs(t1)) - prof(Math.abs(t0))) / ((t1 - t0) * gw)
      quadOut(m.tile, A, B, Cc, Dd, [-slope, 0, 1])
      void mx
    }
    // the gable face (white plaster) under the curve, and the bargeboards
    const face: V3[] = []
    for (let i = 0; i <= K; i++) { const t = ts[i]; if (Math.abs(t) <= 1.0001) face.push([x(t * gw), yg - 0.25, prof(Math.abs(t))]) }
    for (let i = 0; i < face.length - 1; i++) quadOut(m.wall, [face[i][0], yg - 0.25, ZG2 - 0.3], [face[i + 1][0], yg - 0.25, ZG2 - 0.3], face[i + 1], face[i], [0, -1, 0])
    const board: V3[] = ts.map((t) => [x(t * gw), yg - 0.45, prof(Math.abs(t)) + 0.05] as V3)
    bar(m.stone, board, 0.55, 0.5, 0.45, true, true) // the white curved bargeboard
    bar(m.tile, board.map(([a, b2, c]) => [a, b2 + 0.05, c + 0.45] as V3), 0.75, 0.3, 0.05, true, false) // its tile roll on top
    // the ridge back from the gable, and its ornament (onigawara) at the front
    bar(m.tile, [[x(0), yg - 0.3, ZR + 0.35], [x(0), yb, ZR + 0.35]], 0.9, 0.7, 0.1, true, false)
    prism(m.tile, rect(x(0), yg + 0.2, 0.7, 0.45), ZR + 0.6, ZR + 2.0, { bevel: 0.15 })
    // a crest (gegyo) at the gable's apex
    if (D) {
      const k = 10, ring2 = (r: number, out: number) => Array.from({ length: k }, (_, i) => { const a2 = (i / k) * Math.PI * 2; return [x(r * Math.cos(a2)), yg - 0.5 - out, ZR - 1.5 + r * Math.sin(a2)] as V3 })
      fan(m.trim, ring2(0.6, 0), [0, -1, 0])
    }
  }

  // The map's terrain inside the footprint is 2.3 m below the forecourt all
  // round (tools/terrain.ts check: the ground just outside stands 2.3-2.9 m
  // over the lowest point, which lies inside the outline). Lift the building
  // onto the forecourt and run its granite base down to y = 0.
  for (const p of Object.values(m)) for (let i = 1; i < p.pos.length; i += 3) p.pos[i] += ZG
  prism(m.stone, outer, 0, ZG + 0.05, { bevel: 0.2, top: false })
  prism(m.stone, [[x(-14.65), -54.0], [x(14.65), -54.0], [x(14.65), -36.0], [x(-14.65), -36.0]], 0, ZG + 0.05, { bevel: 0.2, top: false })
  prism(m.stone, [[x(-11), -55.0], [x(11), -55.0], [x(11), -53.9], [x(-11), -53.9]], 0, ZG + 0.05, { bevel: 0.05, top: false })

  // night: the walls and porch are floodlit; the roof is not
  const flood = (k: number) => (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 * k : p[2] < 22 ? k : 0)
  return [
    { part: m.wall, material: { ...finish('beige-tile', 0xd8ccb5), floodlight: flood(0.8) } },
    { part: m.stone, material: { ...finish('granite', 0xddd8ce), floodlight: flood(0.8) } },
    { part: m.tile, material: finish('roof-tile-brown', 0x6f5a52) },
    { part: m.win, material: PALETTE.window },
    { part: m.trim, material: finish('cornice-taupe', 0xa39788) },
  ] as Layer[]
}

function fan(p: Part, ring: V3[], n: V3) {
  const c: V3 = ring.reduce((m, q) => [m[0] + q[0] / ring.length, m[1] + q[1] / ring.length, m[2] + q[2] / ring.length], [0, 0, 0] as V3)
  for (let i = 0; i < ring.length; i++) triOut(p, c, ring[i], ring[(i + 1) % ring.length], n)
}

if (import.meta.main) {
  const meta = { generator: 'generators/tokyo-national-museum.ts' }
  await writeModel('tokyo-national-museum', 'tokyo-national-museum.glb', 'Tokyo National Museum, Honkan', build(LOW), meta, 6500, 250_000)
  await writeModel('tokyo-national-museum', 'tokyo-national-museum.detail.glb', 'Tokyo National Museum, Honkan', build(DETAIL), meta, 40_000, 1536 * 1024)
}
