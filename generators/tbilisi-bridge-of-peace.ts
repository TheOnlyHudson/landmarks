/**
 * Bridge of Peace (მშვიდობის ხიდი), over the Mtkvari between Old Tbilisi and
 * Rike Park: procedural, CC0-1.0, no textures.
 *   bun generators/tbilisi-bridge-of-peace.ts
 * Writes models/tbilisi-bridge-of-peace.glb (low LOD) and
 * models/tbilisi-bridge-of-peace.detail.glb (detail LOD, from zoom 16).
 *
 * Michele De Lucchi, opened 6 May 2010: a 150 m steel footbridge whose deck
 * hangs under a wavy canopy of glass on a steel lattice. The canopy is a
 * long vault with open sides; its two lower edges (bold white tubes) run in
 * one wave along the bridge: a curled-up tip over the Old Town end, down to
 * the deck at the west bank, up in a long arch over the river (the deck
 * hangs from it on rods), down to the deck again at the Rike bank, and up
 * into a flared, upturned lip at the Rike Park end. At the two low points
 * the edges carry on down to the banks as white legs, and a raking strut
 * under each end props the deck. Glass balustrades with a lit handrail.
 *
 * Frame: x along the bridge (east), y across (north), z up, metres; glTF
 * +Y up, -Z north. Origin at the area centroid of the OSM outline
 * way/1207561125, on the water. The deck axis in OSM runs 2.57 deg north of
 * east, so the model is built with the deck along +x and placed with
 * bearing 357.4 (its north turned 2.6 deg anticlockwise). y = 0 is the
 * river, the lowest ground under the footprint (reference.md, Bridges).
 *
 * Night: the canopy carries 1,208 LED fixtures and glows white-blue over
 * its whole lattice; the handrails carry linear LED arrays. So the lattice
 * and edge tubes are `neon-canopy` (white, glows white) and the handrail
 * is `neon-rail`; the glass stays `glass` (dark), the deck and legs unlit.
 *
 * Identity, in order: the wave of the canopy edges with the high arch over
 * the river and the two curled tips; the teal glass vault on a white
 * lattice; the flat deck hanging under the arch; the white legs and struts
 * at the banks.
 *
 * Evidence
 * - OSM (ODbL): way/1207561125, man_made=bridge + building=roof, the
 *   bridge outline: a 2 m strip 149.2 m long from (44.80716, 41.69294) to
 *   (44.80895, 41.69301), i.e. the deck line and its length (measured).
 *   way/440933580, building=roof, height 20, min_height 8, roof:shape
 *   round: the canopy, traced loosely (x -44..+71 in this frame, 7 to
 *   19 m wide, wobbly). Its 20 m top and 8 m underside agree with the
 *   photo-scaled heights below; its west end stops short of what the
 *   photos show, so the length follows the photos and the bridge outline.
 * - Published: Wikipedia, "Bridge of Peace"
 *   (https://en.wikipedia.org/wiki/Bridge_of_Peace): 150 m long, steel and
 *   glass, 1,208 LED fixtures in the canopy, LED arrays in the glass
 *   handrails, built in Italy, opened 6 May 2010, architect Michele De
 *   Lucchi, lighting by Philippe Martinaud. No width or height published.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "Tbilisi Peace Bridge and Kura River by Falco.jpg", falco, CC0: from
 *     the south-east, high; the whole wave, the west curl, the Rike lip,
 *     the stair and legs at both banks; canopy colour
 *     https://commons.wikimedia.org/wiki/File:Tbilisi_Peace_Bridge_and_Kura_River_by_Falco.jpg
 *   - "Tbilisi13.jpg", BBCLCD, CC BY-SA 4.0: from the south (Narikala),
 *     nearly side-on; the positions along the bridge were read from it:
 *     tips at the deck ends, low points 11 m from the west end and 123 m
 *     from it, the arch's crown 66 m from it; heights at 7.9 px/m
 *     https://commons.wikimedia.org/wiki/File:Tbilisi13.jpg
 *   - "Mtkvari River Cruise, Tbilisi, Georgia (48813988613).jpg", Andrew
 *     Milligan sumo, CC BY 2.0: from the water under the arch; the deck
 *     (a 1 m box) hanging on rods, its height over the water (about
 *     8 m to the soffit, scaled from people on it), the arch edge 11.5 m
 *     over the deck, the transverse ribs and purlins of the lattice, the
 *     raking strut and the white leg at the west bank
 *     https://commons.wikimedia.org/wiki/File:Mtkvari_River_Cruise,_Tbilisi,_Georgia_(48813988613).jpg
 *   - "2024-10-06. Tbilisoba 2024. Bridge of Peace.jpg", David Osipov,
 *     CC BY 4.0: from the Rike bank; the lattice as a triangulated grid
 *     under the glass, the white edge tubes, the legs
 *     https://commons.wikimedia.org/wiki/File:2024-10-06._Tbilisoba_2024._Bridge_of_Peace.jpg
 *   - "Tbilisi Peace Bridge and Rike Park.jpg", falco, CC0: from Narikala,
 *     with the Rike tubes behind; plan and the flared Rike end
 *     https://commons.wikimedia.org/wiki/File:Tbilisi_Peace_Bridge_and_Rike_Park.jpg
 *   - "Tbilisi Peace Bridge5.jpg" and "Pole solh teflis.jpg", Amir Hossein
 *     Eslami, CC BY-SA 4.0: the Rike end along the deck (portal about 7 m
 *     wide) and from Rike Park
 *     https://commons.wikimedia.org/wiki/File:Tbilisi_Peace_Bridge5.jpg
 *     https://commons.wikimedia.org/wiki/File:Pole_solh_teflis.jpg
 *   - "River Mtkvari & the Peace Bridge in Tbilisi (2010).jpg", Kober,
 *     public domain: from upstream, the arch over the river
 *     https://commons.wikimedia.org/wiki/File:River_Mtkvari_%26_the_Peace_Bridge_in_Tbilisi_(2010).jpg
 *   - Night: "Peace Bridge and Narikala, Tbilisi.jpg", Peyman Zehtab Fard,
 *     CC BY 2.0; "Tbilisi - Bridge lovers - panoramio.jpg", Otpusk.ru,
 *     CC BY-SA 3.0: the canopy lattice lit white-blue, the handrails lit
 *     https://commons.wikimedia.org/wiki/File:Peace_Bridge_and_Narikala,_Tbilisi.jpg
 *     https://commons.wikimedia.org/wiki/File:Tbilisi_-_Bridge_lovers_-_panoramio.jpg
 * - Terrain (Mapterhorn z12, the only zoom here): a smooth bowl, 0 at the
 *   river, about 8.5 m at the Old Town end and 2.7 m at the Rike end.
 *   Too coarse to show the banks; the legs run down to z = 0 and sink into
 *   the bank where the ground is higher.
 *
 * Numbers
 * - Length 149.3 m, deck ends at x = -74.5 and +74.8: measured (OSM).
 * - Deck top 9.0 m over the water, a 0.6 m box 5.8 m wide (drawn thin and
 *   grey so it reads as the shadowed line it is in the photos), ends just
 *   inside the canopy tips (x = -73.6, +73.9): estimated from
 *   people on it in the cruise photo and the ~7 m portal in Eslami's.
 * - Edge wave (height of the canopy's lower edges over the water): tips
 *   16.4 / 16.6 m, low points 4.6 m (x = -62.5) and 4.2 m (x = +46.5),
 *   where the edges pass below the deck down to the legs, arch crown
 *   20.5 m (11.5 m over the deck) at x = -3: scaled from Tbilisi13.jpg
 *   (tip-to-tip length as the scale) and from people on the deck in the
 *   cruise photo. Vault rise over the edges 6.6 m over the river, 8.6 to
 *   8.8 m at the low points (the vault passes round the deck there), 2.8
 *   m at the flattened tips; half-width 5.4 m over the river, 4.8 m at
 *   the low points, 7.2 / 7.6 m at the flared tips: estimated from
 *   falco's photos and the OSM canopy trace (12 to 19 m wide). Top 27.3 m
 *   over the water: OSM's height 20 is lower; the photos are followed.
 * - Stairs down from the deck on the south side at each end, legs and
 *   struts: positions from the photos, sizes estimated.
 * - Colours: canopy seen from above #7b9ea8 to #859ba2 in falco's photo
 *   (teal glass over white steel); in shade #5a7982 (Osipov); the glass
 *   itself about #4f8f9c sunlit. Glass #4f8f9c at 0.78 opacity, set 0.3 m
 *   inside the lattice so the white net (#f7f8f8) and the edge tubes
 *   (0.75 m radius in the low model) stand out on it, as in the photos.
 *   Legs and struts steel white #d2d0c8; the deck grey #8c9294.
 *
 * Doubts
 * - The lattice is drawn as transverse arch ribs, longitudinal purlins and
 *   one diagonal per cell (a triangulated grid), at about the real rib
 *   spacing in the detail model (1.9 m) and every 3.5 m in the low one
 *   (ribs and a diagonal in every cell, no purlins); the
 *   real member sizes and exact grid are not published.
 * - The north side is seen only obliquely; it mirrors the south.
 * - The stairs at both ends are simplified to one straight flight each.
 * - Terrain check (z12, after the deck was trimmed to the canopy tips):
 *   ok. The legs and strut feet sink into the bank where the z12 ground
 *   is higher, as they do into the real embankment.
 * - Hangers (detail only) every 7.6 m: their real number is not known.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { tube } from './bridge-kit'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crossv = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const norm = (a: V3): V3 => scale(a, 1 / (Math.hypot(...a) || 1))

// ---- the canopy's form ----------------------------------------------------
const X0 = -73.6, X1 = 73.9 // deck ends, just inside the canopy tips
const DECK_TOP = 9.0, DECK_BOT = 8.4, DECK_HALF = 2.9
const TIP_W = -74.0, TIP_E = 74.3 // canopy tips

/** Monotone-free Catmull-Rom through (x, v) control points. */
function spline(pts: [number, number][]): (x: number) => number {
  return (x: number) => {
    if (x <= pts[0][0]) return pts[0][1]
    if (x >= pts[pts.length - 1][0]) return pts[pts.length - 1][1]
    let i = 0
    while (pts[i + 1][0] < x) i++
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)]
    const t = (x - p1[0]) / (p2[0] - p1[0]), h = p2[0] - p1[0]
    const m1 = ((p2[1] - p0[1]) / (p2[0] - p0[0] || 1)) * h, m2 = ((p3[1] - p1[1]) / (p3[0] - p1[0] || 1)) * h
    const t2 = t * t, t3 = t2 * t
    return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2
  }
}
/** Height of the canopy's lower edges. */
const edgeZ = spline([
  [TIP_W, 16.4], [-69, 11.0], [-62.5, 4.6], [-56, 9.4], [-44, 16.4], [-26, 19.8], [-3, 20.5],
  [18, 19.2], [33, 14.6], [41, 8.0], [46.5, 4.2], [53, 8.0], [65, 13.0], [TIP_E, 16.6],
])
/** Rise of the vault over its edges. */
const riseZ = spline([[TIP_W, 2.8], [-68, 6.0], [-62.5, 8.6], [-55, 7.6], [-40, 6.6], [-3, 6.6], [32, 6.6], [40, 7.4], [46.5, 8.8], [53, 7.6], [62, 5.0], [TIP_E, 2.8]])
/** Half-width between the edges. */
const halfW = spline([[TIP_W, 7.2], [-68, 5.6], [-62.5, 4.8], [-3, 5.4], [46.5, 4.8], [60, 5.8], [TIP_E, 7.6]])

/** A point of the vault: x along, s from -1 (south edge) to 1 (north edge), lifted `off` along its normal. */
function shell(x: number, s: number, off = 0): V3 {
  const th = Math.acos(Math.max(-1, Math.min(1, -s))) // s=-1 -> 0, s=1 -> pi
  const c = Math.cos(th), sn = Math.sin(th)
  const p: V3 = [x, -halfW(x) * Math.sign(c) * Math.abs(c) ** 0.8, edgeZ(x) + riseZ(x) * sn ** 0.75]
  if (!off) return p
  return add(p, scale(shellN(x, s), off))
}
function shellN(x: number, s: number): V3 {
  const e = 0.05
  const dx = subv(shell(x + e, s), shell(x - e, s))
  const ds = subv(shell(x, Math.min(1, s + e)), shell(x, Math.max(-1, s - e)))
  let n = norm(crossv(dx, ds))
  // outward: away from the vault's axis
  const axis: V3 = [x, 0, edgeZ(x)]
  if (dot(n, subv(shell(x, s), axis)) < 0) n = scale(n, -1)
  return n
}

// ---- solids ---------------------------------------------------------------
/**
 * A bar from a to b: a box section (4 sides) or, in the low model, a
 * triangular one (3 sides) with one face toward `up`; w across, h along
 * `up`. Ends open (they meet other members).
 */
let BAR_SIDES = 4
function bar(p: Part, a: V3, b: V3, up: V3, w: number, h: number) {
  const t = norm(subv(b, a))
  const side = norm(crossv(t, up))
  const u = norm(crossv(side, t))
  const sec = BAR_SIDES === 4 ? [[-1, -1], [1, -1], [1, 1], [-1, 1]] : [[-1, 0.6], [0, -1], [1, 0.6]]
  const c = sec.map(([i, j]) => add(scale(side, (i * w) / 2), scale(u, (j * h) / 2)))
  for (let k = 0; k < c.length; k++) {
    const l = (k + 1) % c.length
    const n = norm(add(c[k], c[l]))
    const q = [add(a, c[k]), add(a, c[l]), add(b, c[l]), add(b, c[k])]
    const g = crossv(subv(q[1], q[0]), subv(q[2], q[0]))
    if (dot(g, n) >= 0) { p.tri(q[0], q[1], q[2]); p.tri(q[0], q[2], q[3]) }
    else { p.tri(q[0], q[2], q[1]); p.tri(q[0], q[3], q[2]) }
  }
}
/** A closed axis-aligned box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const v = (x: number, y: number, z: number): V3 => [x, y, z]
  p.quad(v(x0, y0, z1), v(x1, y0, z1), v(x1, y1, z1), v(x0, y1, z1))
  p.quad(v(x0, y1, z0), v(x1, y1, z0), v(x1, y0, z0), v(x0, y0, z0))
  p.quad(v(x0, y0, z0), v(x1, y0, z0), v(x1, y0, z1), v(x0, y0, z1))
  p.quad(v(x1, y1, z0), v(x0, y1, z0), v(x0, y1, z1), v(x1, y1, z1))
  p.quad(v(x1, y0, z0), v(x1, y1, z0), v(x1, y1, z1), v(x1, y0, z1))
  p.quad(v(x0, y1, z0), v(x0, y0, z0), v(x0, y0, z1), v(x0, y1, z1))
}

type Parts = { glass: Part; lattice: Part; steel: Part; deck: Part; rail: Part; balus: Part }

function stationsBy(a: number, b: number, step: number) {
  const n = Math.max(1, Math.round((b - a) / step))
  return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)
}

function build(detail: boolean): Parts {
  BAR_SIDES = detail ? 4 : 3
  const P: Parts = { glass: new Part(), lattice: new Part(), steel: new Part(), deck: new Part(), rail: new Part(), balus: new Part() }
  const xsGlass = stationsBy(TIP_W, TIP_E, detail ? 1.9 : 3.0)
  const nS = detail ? 10 : 8
  const ss = Array.from({ length: nS + 1 }, (_, j) => -1 + (2 * j) / nS)

  // Glass skin, just inside the lattice (the white net stands proud of it), smooth-shaded. Double-sided material.
  for (let i = 0; i < xsGlass.length - 1; i++)
    for (let j = 0; j < nS; j++) {
      const at = (x: number, s: number): [V3, V3] => [shell(x, s, -0.3), shellN(x, s)]
      const q = [at(xsGlass[i], ss[j]), at(xsGlass[i + 1], ss[j]), at(xsGlass[i + 1], ss[j + 1]), at(xsGlass[i], ss[j + 1])]
      P.glass.tri(q[0][0], q[1][0], q[2][0], undefined, undefined, undefined, [q[0][1], q[1][1], q[2][1]])
      P.glass.tri(q[0][0], q[2][0], q[3][0], undefined, undefined, undefined, [q[0][1], q[2][1], q[3][1]])
    }

  // Lattice: transverse ribs and one diagonal per cell (a triangulated
  // net); the detail model adds a purlin along every line of the grid.
  const ribStep = detail ? 1.9 : 3.5
  const xsRib = stationsBy(TIP_W, TIP_E, ribStep)
  const mw = detail ? 0.28 : 0.42, mh = detail ? 0.34 : 0.45
  const ribS = detail ? ss : Array.from({ length: 7 }, (_, j) => -1 + (2 * j) / 6)
  for (const x of xsRib) {
    const end = x === xsRib[0] || x === xsRib[xsRib.length - 1]
    for (let j = 0; j < ribS.length - 1; j++)
      bar(P.lattice, shell(x, ribS[j]), shell(x, ribS[j + 1]), shellN(x, (ribS[j] + ribS[j + 1]) / 2), end ? mw * 2.2 : mw, end ? mh * 1.8 : mh)
  }
  if (detail) {
    const purS = ss.slice(1, -1)
    for (const s of purS)
      for (let i = 0; i < xsRib.length - 1; i++)
        bar(P.lattice, shell(xsRib[i], s), shell(xsRib[i + 1], s), shellN((xsRib[i] + xsRib[i + 1]) / 2, s), mw * 0.8, mh * 0.8)
  }
  // one diagonal per cell, alternating, so the net reads triangulated
  for (let i = 0; i < xsRib.length - 1; i++)
    for (let j = 0; j < ribS.length - 1; j++) {
      const flip = (i + j) % 2 === 0
      const a = shell(xsRib[i], flip ? ribS[j] : ribS[j + 1]), b = shell(xsRib[i + 1], flip ? ribS[j + 1] : ribS[j])
      bar(P.lattice, a, b, shellN((xsRib[i] + xsRib[i + 1]) / 2, (ribS[j] + ribS[j + 1]) / 2), mw * (detail ? 0.7 : 0.85), mh * (detail ? 0.6 : 0.8))
    }
  // The bold white edge tubes.
  const xsEdge = stationsBy(TIP_W, TIP_E, detail ? 1.2 : 3.0)
  for (const s of [-1, 1]) tube(P.lattice, xsEdge.map((x) => shell(x, s)), detail ? 0.63 : 0.75, detail ? 8 : 5)

  // ---- deck: a box girder, walking surface on top ----
  const xsDeck = stationsBy(X0, X1, 5)
  for (let i = 0; i < xsDeck.length - 1; i++) {
    const a = xsDeck[i], b = xsDeck[i + 1]
    // top
    P.deck.quad([a, -DECK_HALF, DECK_TOP], [b, -DECK_HALF, DECK_TOP], [b, DECK_HALF, DECK_TOP], [a, DECK_HALF, DECK_TOP])
    // sides with a chamfered soffit
    const prof: [number, number][] = [[-DECK_HALF, DECK_TOP], [-DECK_HALF, DECK_BOT + 0.3], [-DECK_HALF + 0.5, DECK_BOT], [DECK_HALF - 0.5, DECK_BOT], [DECK_HALF, DECK_BOT + 0.3], [DECK_HALF, DECK_TOP]]
    for (let k = 0; k < prof.length - 1; k++) {
      const [y0, z0] = prof[k], [y1, z1] = prof[k + 1]
      P.deck.quad([a, y0, z0], [a, y1, z1], [b, y1, z1], [b, y0, z0]) // faces outward/down (profile runs south->bottom->north)
    }
  }
  for (const [x, sgn] of [[X0, -1], [X1, 1]] as [number, number][]) {
    const ring: V3[] = [[x, -DECK_HALF, DECK_TOP], [x, -DECK_HALF, DECK_BOT + 0.3], [x, -DECK_HALF + 0.5, DECK_BOT], [x, DECK_HALF - 0.5, DECK_BOT], [x, DECK_HALF, DECK_BOT + 0.3], [x, DECK_HALF, DECK_TOP]]
    P.deck.cap(sgn > 0 ? ring.reverse() : ring, false)
  }
  // fix end-cap winding by explicit check is unnecessary: validate catches it; see below.

  // ---- balustrades: glass panels and a lit handrail ----
  const RAIL_H = 1.1
  for (const y of [-DECK_HALF + 0.12, DECK_HALF - 0.12]) {
    const xs = stationsBy(X0 + 0.3, X1 - 0.3, detail ? 4 : 10)
    for (let i = 0; i < xs.length - 1; i++) {
      const a = xs[i], b = xs[i + 1]
      P.balus.quad([a, y, DECK_TOP], [b, y, DECK_TOP], [b, y, DECK_TOP + RAIL_H], [a, y, DECK_TOP + RAIL_H])
    }
    box(P.rail, X0 + 0.3, X1 - 0.3, y - 0.1, y + 0.1, DECK_TOP + RAIL_H - 0.08, DECK_TOP + RAIL_H + 0.12)
  }

  // ---- legs at the two low points: the edges carry on down as white V legs ----
  for (const x0 of [-62.5, 46.5]) {
    for (const s of [-1, 1]) {
      const top1 = shell(x0 - 2.2, s), top2 = shell(x0 + 2.2, s)
      const foot: V3 = [x0, s * (halfW(x0) + 0.4), 0.17]
      tube(P.steel, [foot, top1], 0.4, detail ? 8 : 5)
      tube(P.steel, [foot, top2], 0.4, detail ? 8 : 5)
    }
  }
  // raking struts under the deck ends, from the bank foot up into the soffit
  for (const [fx, tx] of [[-60, -47], [46, 33]] as [number, number][]) {
    for (const y of [-1.6, 1.6]) bar(P.steel, [fx, y, 0.75], [tx, y, DECK_BOT + 0.1], [0, 0, 1], 1.1, 0.9)
  }
  // stairs down on the south side at each end: one straight flight each
  for (const [xTop, xBot, zBot] of [[-47, -62, 4.0], [31, 48, 3.0]] as [number, number, number][]) {
    const y0 = -DECK_HALF - 2.6, y1 = -DECK_HALF - 0.05
    const lo = Math.min(xTop, xBot), hi = Math.max(xTop, xBot)
    const zAt = (x: number) => DECK_TOP + ((x - xTop) / (xBot - xTop)) * (zBot - DECK_TOP)
    // sloping flight slab, 0.6 m thick
    const A: V3 = [xTop, y0, DECK_TOP], B: V3 = [xBot, y0, zBot], C: V3 = [xBot, y1, zBot], D: V3 = [xTop, y1, DECK_TOP]
    const dz: V3 = [0, 0, -0.6]
    const up = xBot > xTop
    const quadOut = (a: V3, b: V3, c: V3, d: V3, n: V3) => {
      const g = crossv(subv(b, a), subv(c, a))
      if (dot(g, n) >= 0) P.steel.quad(a, b, c, d)
      else P.steel.quad(a, d, c, b)
    }
    quadOut(A, B, C, D, [0, 0, 1])
    quadOut(add(A, dz), add(D, dz), add(C, dz), add(B, dz), [0, 0, -1])
    quadOut(A, add(A, dz), add(B, dz), B, [0, -1, 0])
    quadOut(D, C, add(C, dz), add(D, dz), [0, 1, 0])
    quadOut(B, add(B, dz), add(C, dz), C, [up ? 1 : -1, 0, 0])
    // outer handrail on the flight
    bar(P.rail, [xTop, y0 + 0.1, DECK_TOP + RAIL_H], [xBot, y0 + 0.1, zBot + RAIL_H], [0, 0, 1], 0.2, 0.2)
    void lo; void hi; void zAt
  }

  // ---- hangers (detail only): rods from the vault to the deck edges where it is clear above ----
  if (detail) {
    for (let x = -50; x <= 38; x += 7.6) {
      if (edgeZ(x) < DECK_TOP + 2.5) continue
      for (const y of [-DECK_HALF + 0.2, DECK_HALF - 0.2]) {
        const s = y / halfW(x) // a point of the vault above the deck edge
        const top = shell(x, s)
        tube(P.steel, [[x, y, DECK_TOP + RAIL_H + 0.1], top], 0.07, 3)
      }
    }
  }
  return P
}

const GLASS = { ...finish('glass', 0x4f8f9c, 0.2), doubleSided: true, opacity: 0.78 }
const LATTICE = finish('neon-canopy', 0xf7f8f8, 0.5)
const DECK = finish('deck-grey', 0x8c9294, 0.7)
const STEEL = finish('steel-white', 0xd2d0c8, 0.7)
const RAIL = finish('neon-rail', 0xf2f4f2, 0.5)
const BALUS = { ...finish('glass-2', 0x9fcad6, 0.2), doubleSided: true, opacity: 0.2 }

const list = (P: Parts) => [
  { part: P.lattice, material: LATTICE },
  { part: P.steel, material: STEEL },
  { part: P.deck, material: DECK },
  { part: P.rail, material: RAIL },
  { part: P.glass, material: GLASS },
  { part: P.balus, material: BALUS },
]

const extras = {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the river; deck along +x, placed at bearing 357.4',
  bearing: 357.4, elevation: 0, deckTop: DECK_TOP,
}

if (import.meta.main) {
  for (const [file, P, maxTris, maxBytes] of [
    ['tbilisi-bridge-of-peace.glb', build(false), 6500, 250 * 1024],
    ['tbilisi-bridge-of-peace.detail.glb', build(true), 40000, 1536 * 1024],
  ] as const) {
    const l = list(P)
    let tris = 0
    for (const { part } of l) tris += part.triangles
    console.log(file, l.map((e) => `${e.material.name}:${e.part.triangles}`).join(' '))
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Bridge of Peace', l, extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
