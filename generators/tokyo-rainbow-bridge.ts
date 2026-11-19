/**
 * Rainbow Bridge (レインボーブリッジ, 東京港連絡橋; 1993), Minato, Tokyo:
 * procedural, CC0-1.0.  bun generators/tokyo-rainbow-bridge.ts
 *
 * The whole OSM bridge outline as one placement: the two-deck suspension
 * bridge from the Shibaura anchorage to the Odaiba anchorage (white towers
 * with their arched portals, the main cables, the suspenders, the stiffening
 * truss with the Yurikamome tracks and the Rainbow Promenade walkways on its
 * lower deck) and the Odaiba approach viaduct that the outline runs on over,
 * to its end at Daiba. Writes a low model (towers, anchorages, cables, the
 * truss and approach girders as solid bands) and a detail model (the truss
 * opened into chords and lattice, suspenders, floor beams, railings, more
 * cable lamps), which a map draws from zoom 16.
 *
 * Frame: x across the bridge (toward bearing 201.4), y along it toward
 * Odaiba (bearing 111.4, the line from the Shibaura tower's legs to the
 * Odaiba tower's), z up, metres; origin midway between the towers on the
 * bridge's centre line, z = 0 the water. The map owns the expressway on the
 * upper deck and the general roads on the lower deck; the model draws the
 * walkways and the Yurikamome track bed (the lower deck's outer edges and
 * centre), which OSM maps as footway and light_rail ways on the bridge.
 *
 * OSM (all replaced): relation/18497742 the man_made=bridge outline (its
 * outer way/508040808 runs from the Shibaura anchorage over the whole
 * suspension bridge and on along the Odaiba approach for ~800 m); the
 * towers way/1348279698-1348279701 (Shibaura) and way/1348279694-1348279697
 * (Odaiba): legs 4.4-4.9 x 5 m, 32.4 m apart centre to centre, 126 m, a top
 * strut 117-126 m and a strut 27-31 m; the anchorages way/540211904 +
 * 1348272539, 1348272540, 1348272541 (Shibaura) and way/1348279690-1348279693
 * (Odaiba): a 46 x 69 m base to 30 m, a block to 45 m and two pillars (the
 * cable bents) to 60 m. The tower centres are 568.6 m apart (published
 * 570 m).
 *
 * Published (Wikipedia ja "レインボーブリッジ"; en "Rainbow Bridge (Tokyo)"):
 * suspension bridge 798 m, spans 111.5 + 570 + 111.5 m; towers 126 m above
 * mean sea level; girder clearance 51.27 m at the main span; width 29 m;
 * upper deck the Shuto Expressway Route 11, lower deck the Yurikamome in the
 * middle with general roads either side and the walkways on the outer edges;
 * the towers and cables are lit every night.
 *
 * Roadway heights the model is built to (estimated; no lidar in Japan, and
 * OSM records none): the truss's bottom chord 51.3 m at midspan (the
 * published clearance) and 49.5 m at the towers, falling to 46.3 m at the
 * anchorages (the anchorage block it passes over is 45 m in OSM); the lower
 * deck 2.5 m above the bottom chord (53.8 m at midspan), the upper deck 10 m
 * above the lower (63.8 m at midspan, 62.0 at the towers, 58.8 at the
 * anchorages; the truss ~12.5 m deep, scaled on "West view" against the
 * tower); on the Odaiba approach both fall at 3.2 % to the outline's end
 * (upper ~33 m). The map should carry `height` or `ele` on these ways
 * for its decks to meet the model (docs/bridge-heights.md).
 *
 * Photos (Wikimedia Commons, EVIDENCE): "Rainbow Bridge, Tokyo, South view
 * from Odaiba 20190419 1.jpg" and "Rainbow Bridge, Tokyo, West view 20190419
 * 1.jpg" (DXR, CC BY-SA 4.0): the towers' semicircular portal arches, the
 * strut under the deck with curved haunches, the Warren truss with verticals,
 * the Odaiba anchorage and approach; "Rainbow Bridge (Tokyo) and sky.jpg"
 * (Kakidai, CC BY-SA 4.0): the approach's double deck on portal piers;
 * "Rainbow Bridge, Tokyo 20190320-1.jpg" (Suicasmo, CC BY-SA 4.0); "North
 * walkway @ Rainbow Bridge (14042502824).jpg" (Guilhem Vellut, CC BY 2.0):
 * the walkway inside the truss; night: "Rainbow Bridge (Tokyo) at night.JPG"
 * (Kakidai, CC BY-SA 4.0): towers floodlit white, a string of white lamps
 * along each main cable, the anchorage lit.
 *
 * Estimated from photos: the portal arch (a semicircle 27.8 m across
 * springing at 101.6 m, crown 115.5 m, the beam over it ~10.5 m deep at
 * the crown, scaled on the opening's width), the lower strut's haunches, the
 * seat beam under the truss, the truss's panels (11 m),
 * the cable sag (66.5 m at midspan, 124 m at the saddles), the cables'
 * landing on the pillars at 58 m; suspenders drawn every 19 m (about half
 * the real density), cables 1.5 m thick (about twice the real); the
 * approach's portal piers every ~45 m and its girders' depths.
 * Colours: the steel white (#eef0ee in photos, a faint grey-white), the
 * piers concrete grey, the walkway and track bed grey.
 *
 * Doubts: every height above is estimated; the approach's profile in
 * particular is a straight grade, where the real one curves down onto
 * Daiba. Under the Shibaura anchorage the ground is ~3 m (the map's
 * terrain); the base stands on it.
 */
import { Part, cross, sub, type MaterialSpec, type V3 } from './mesh'
import { band, tube, rod, bead, along, stations, parabola, strip } from './bridge-kit'
import { prism, rect, writeModel, type Layer } from './tokyo-metropolitan-government-building'
import { finish } from './palette'
import { loftSolid, one } from './sf-golden-gate-bridge'

const TY = 284.8          // towers at y = ±TY
const LEGX = 16.2         // leg centres
const LEGHX = 2.4, LEGHY = 2.6
const TOP = 126
const ANCH = 396.8        // the suspended structure ends at the anchorage face (OSM outline)
const CX = 15.5           // cable and truss planes
const SADDLE = 124, LOW = 66.5
const BENT = { y: 406.5, x: 19.8, z: 58 }

/** Truss bottom chord height along the suspension bridge. */
const bot = (y: number): number => {
  const a = Math.abs(y)
  if (a <= TY) return 51.3 - (1.8 * a * a) / (TY * TY)
  return 49.5 - ((49.5 - 46.3) * (a - TY)) / (ANCH - TY)
}
const lower = (y: number) => bot(y) + 2.5
const upper = (y: number) => lower(y) + 10
const mainCable = (y: number) => LOW + (SADDLE - LOW) * (y / TY) ** 2
const sideCable = parabola([TY, SADDLE], [(TY + BENT.y) / 2, (SADDLE + BENT.z) / 2 - 7], [BENT.y, BENT.z])
const cableZ = (y: number) => (Math.abs(y) <= TY ? mainCable(y) : sideCable(Math.abs(y)))
const cableX = (y: number) => (Math.abs(y) <= TY ? CX : CX + ((BENT.x - CX) * (Math.abs(y) - TY)) / (BENT.y - TY))

// The outline's two sides on the Odaiba approach, in this frame (OSM).
const NSIDE: [number, number][] = [[-15.2, 396.9], [-16.3, 471.9], [-19.3, 515.4], [-25.6, 552.0], [-34.6, 579.9], [-54.4, 624.2], [-69.8, 648.9], [-94.1, 680.8], [-131.6, 721.6], [-160.1, 747.2], [-216.7, 797.5], [-259.7, 838.0], [-302.3, 885.9], [-335.8, 927.3], [-360.6, 969.2], [-378.9, 1008.1], [-390.8, 1056.3], [-393.1, 1085.4], [-391.9, 1114.9], [-381.4, 1164.5]]
const SSIDE: [number, number][] = [[15.6, 397.8], [14.9, 472.0], [10.6, 519.0], [2.0, 569.9], [-17.2, 621.3], [-39.9, 668.4], [-63.1, 699.7], [-153.4, 802.8], [-221.7, 869.4], [-266.5, 918.7], [-291.2, 951.8], [-313.8, 989.6], [-332.0, 1037.9], [-339.2, 1073.8], [-340.6, 1094.2], [-341.9, 1115.1], [-338.0, 1137.3], [-360, 1152]]

type P2 = [number, number]
function resample(line: P2[], step: number): P2[] {
  const out: P2[] = [line[0]]
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step))
    for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  return out
}
const nearestOn = (p: P2, line: P2[]): P2 => {
  let best: P2 = line[0], bd = Infinity
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i], dx = b[0] - a[0], dy = b[1] - a[1]
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)))
    const q: P2 = [a[0] + dx * t, a[1] + dy * t], d = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (d < bd) { bd = d; best = q }
  }
  return best
}
/** The approach's centre line and half-width, from the Odaiba anchorage face to the outline's end. */
type Station = { c: P2; hw: number; s: number }
function approach(step: number): Station[] {
  const out: Station[] = []
  let s = 0
  for (const p of resample(NSIDE, step)) {
    const q = nearestOn(p, SSIDE)
    const c: P2 = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
    if (out.length) s += Math.hypot(c[0] - out[out.length - 1].c[0], c[1] - out[out.length - 1].c[1])
    out.push({ c, hw: Math.min(17, Math.hypot(p[0] - q[0], p[1] - q[1]) / 2), s })
  }
  return out
}
const apUpper = (s: number) => upper(ANCH) - 0.032 * s

/** A box girder along a centre line: two side faces and a soffit, with an end cap at each end. */
function ribbon(p: Part, st: Station[], hw: (k: number) => number | [number, number], top: (k: number) => number, bottom: (k: number) => number, faces = { sides: true, soffit: true, top: false }) {
  const frame = (k: number) => {
    const a = st[Math.max(0, k - 1)].c, b = st[Math.min(st.length - 1, k + 1)].c
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1
    return { n: [ty / l, -tx / l] as P2 } // right-hand normal
  }
  const at = (k: number, side: number, z: number): V3 => { const { n } = frame(k); const c = st[k].c, h = hw(k), w = typeof h === 'number' ? h * side : side < 0 ? h[0] : h[1]; return [c[0] + n[0] * w, c[1] + n[1] * w, z] }
  for (let k = 0; k < st.length - 1; k++) {
    for (const side of [-1, 1]) {
      const n = frame(k).n, out: V3 = [n[0] * side, n[1] * side, 0]
      if (faces.sides) qo(p, at(k, side, bottom(k)), at(k + 1, side, bottom(k + 1)), at(k + 1, side, top(k + 1)), at(k, side, top(k)), out)
    }
    if (faces.soffit) qo(p, at(k, -1, bottom(k)), at(k + 1, -1, bottom(k + 1)), at(k + 1, 1, bottom(k + 1)), at(k, 1, bottom(k)), [0, 0, -1])
    if (faces.top) qo(p, at(k, -1, top(k)), at(k + 1, -1, top(k + 1)), at(k + 1, 1, top(k + 1)), at(k, 1, top(k)), [0, 0, 1])
  }
  const last = st.length - 1
  for (const [k, s] of [[0, -1], [last, 1]] as [number, number][]) {
    const a = st[Math.max(0, k - 1)].c, b = st[Math.min(last, k + 1)].c
    qo(p, at(k, -1, bottom(k)), at(k, 1, bottom(k)), at(k, 1, top(k)), at(k, -1, top(k)), [(b[0] - a[0]) * s, (b[1] - a[1]) * s, 0])
  }
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function qo(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), want) >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bevel = 0.3) =>
  prism(p, rect((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2), z0, z1, { bevel, roof: p })

/**
 * A plate in the x-z plane between two legs, from y0 to y1: its underside
 * follows zb(x) (an arch or haunches), its top is flat at zt.
 */
function plate(p: Part, x0: number, x1: number, y0: number, y1: number, zb: (x: number) => number, zt: number, n: number) {
  const xs = stations(x0, x1, (x1 - x0) / n)
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1]
    for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) qo(p, [a, y, zb(a)], [b, y, zb(b)], [b, y, zt], [a, y, zt], [0, s, 0])
    const m = (a + b) / 2, e = 0.01, slope = (zb(m + e) - zb(m - e)) / (2 * e)
    qo(p, [a, y0, zb(a)], [b, y0, zb(b)], [b, y1, zb(b)], [a, y1, zb(a)], [slope, 0, -1])
  }
  qo(p, [x0, y0, zt], [x1, y0, zt], [x1, y1, zt], [x0, y1, zt], [0, 0, 1])
}

/** A straight box member from a to b, w wide by t thick (t along `side`), open at the ends. */
function beamRaw(p: Part, a: V3, b: V3, w: number, t: number, side: V3) {
  const d = sub(b, a), l = Math.hypot(...d), dn: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const k = dot(side, dn), sv: V3 = [side[0] - dn[0] * k, side[1] - dn[1] * k, side[2] - dn[2] * k], sl = Math.hypot(...sv)
  const Sv: V3 = [sv[0] / sl, sv[1] / sl, sv[2] / sl], Wv = cross(Sv, dn)
  const sec = (o: V3): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [o[0] + Wv[0] * u * w / 2 + Sv[0] * v * t / 2, o[1] + Wv[1] * u * w / 2 + Sv[1] * v * t / 2, o[2] + Wv[2] * u * w / 2 + Sv[2] * v * t / 2] as V3)
  loftSolid(one(p), [sec(a), sec(b)], [false, false])
}

type Lod = { detail: boolean }

function build({ detail }: Lod): Layer[] {
  const white = new Part(), web = new Part()
  const S = white
  const shade = new Part(), concrete = new Part(), deck = new Part(), lamp = new Part()
  const beam = (_: Part, a: V3, b: V3, w: number, t: number, side: V3) => beamRaw(white, a, b, w, t, side)

  // ---- Towers ---------------------------------------------------------------
  for (const ty of [-TY, TY]) {
    // the pier, rounded ends
    const pier: [number, number][] = []
    for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (Math.PI * i) / 8; pier.push([20 + 6 * Math.cos(a), ty + 6 * Math.sin(a)]) }
    for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 + (Math.PI * i) / 8; pier.push([-20 + 6 * Math.cos(a), ty + 6 * Math.sin(a)]) }
    prism(concrete, pier, 0, 4, { bevel: 0.2, roof: concrete })
    for (const s of [-1, 1]) {
      // legs: a little wider at the foot
      prism(white, [[s * LEGX - LEGHX - 0.5, ty - LEGHY - 0.4], [s * LEGX + LEGHX + 0.5, ty - LEGHY - 0.4], [s * LEGX + LEGHX + 0.5, ty + LEGHY + 0.4], [s * LEGX - LEGHX - 0.5, ty + LEGHY + 0.4]], 4, 45, { bevel: 0.5, roof: white })
      box(white, s * LEGX - LEGHX, s * LEGX + LEGHX, ty - LEGHY, ty + LEGHY, 45, TOP, 0.5)
      // saddle hood
      box(white, s * LEGX - 1.8, s * LEGX + 1.8, ty - 3.2, ty + 3.2, TOP, TOP + 1.6, 0.6)
    }
    const xi = LEGX - LEGHX // inner faces
    const R = xi, SPRING = 101.6
    plate(white, -xi, xi, ty - 2.2, ty + 2.2, (x) => SPRING + Math.sqrt(Math.max(0, R * R - x * x)), TOP, detail ? 24 : 12)
    // the strut under the deck, with curved haunches
    const H = 6
    plate(white, -xi, xi, ty - 2.0, ty + 2.0, (x) => { const d = xi - Math.abs(x); return d >= H ? 27 : 27 - H + Math.sqrt(Math.max(0, H * H - (H - d) ** 2)) }, 33, detail ? 16 : 8)
    // the seat beam under the truss
    box(white, -xi, xi, ty - 2.4, ty + 2.4, bot(ty) - 3, bot(ty) - 0.2, 0.3)
  }

  // ---- Anchorages (OSM): base, block, cable bents ----------------------------
  for (const s of [-1, 1]) {
    const y = (a: number, b: number): [number, number] => (s > 0 ? [a, b] : [-b, -a])
    const g = s < 0 ? 2.2 : 0 // Shibaura stands on ~3 m of land, Odaiba in the water
    box(white, -22.4, 23.0, ...y(393.6, 462.5), g, 30, 0.6)
    box(white, -22.4, 23.0, ...y(393.6, 441.3), 30, 45, 0.6)
    for (const [x0, x1] of [[-22.4, -16.8], [17.2, 23.0]]) box(white, x0, x1, ...y(393.6, 419.5), 45, 60, 0.4)
  }

  // ---- The stiffening truss --------------------------------------------------
  const spans: [number, number][] = [[-ANCH, -TY - 3], [-TY + 3, TY - 3], [TY + 3, ANCH]]
  const PANEL = 11
  const topC = (y: number) => upper(y) - 0.4
  for (const span of spans) {
    const curve = stations(span[0], span[1], detail ? 30 : 48)
    const panels = stations(span[0], span[1], PANEL)
    // the stiffening truss: in each plane, top and bottom chords as box
    // members ~10 m apart, a post at every panel point and a diagonal in
    // every panel (Warren with verticals); deep enough to read as the band
    // between the two decks that it is
    const tp = stations(span[0], span[1], detail ? PANEL : 2 * PANEL)
    const CH = detail ? 1.4 : 1.8, M = detail ? 1.1 : 1.6
    for (const s of [-1, 1]) {
      const x = s * CX
      band(white, x - 0.6, x + 0.6, curve, topC, (y) => topC(y) - CH, { out: true, in: true, top: true, bottom: true, ends: true })
      band(white, x - 0.6, x + 0.6, curve, (y) => bot(y) + CH, bot, { out: true, in: true, top: true, bottom: true, ends: true })
      tp.forEach((y, i) => {
        beam(S, [x, y, bot(y) + CH], [x, y, topC(y) - CH], M, 1.0, [1, 0, 0])
        if (i < tp.length - 1) {
          const v = tp[i + 1], [a, b] = i % 2 ? [y, v] : [v, y]
          beam(S, [x, a, bot(a) + CH * 0.6], [x, b, topC(b) - CH * 0.6], M, 1.0, [1, 0, 0])
        }
      })
      if (detail) {
        // upper deck railing
        band(white, s * (CX - 0.15) - 0.1, s * (CX - 0.15) + 0.1, curve, (y) => upper(y) + 1.1, (y) => upper(y) + 0.9)
        for (const y of stations(span[0], span[1], 4.75)) rod(white, [s * (CX - 0.15), y, upper(y) - 0.4], [s * (CX - 0.15), y, upper(y) + 0.95], 0.07, 3)
      }
    }
    // the two deck slabs, their tops kept 0.3 m under the map's roadways: the
    // lower deck (with the walkways and track bed the model owns on it) and
    // the upper deck, each with a fascia between the truss planes
    band(shade, -CX + 0.6, CX - 0.6, curve, (y) => lower(y) - 0.4, (y) => lower(y) - 1.6, { bottom: true, out: true, ends: true })
    band(shade, -CX + 0.6, CX - 0.6, curve, bot, (y) => bot(y) - 0.01, { bottom: true })
    for (const s of [-1, 1]) band(deck, s * 12.6, s * 14.9, curve, lower, (y) => lower(y) - 0.4, { top: true })
    band(deck, -2.6, 4.6, curve, (y) => lower(y) + 0.25, (y) => lower(y) - 0.4, { top: true, out: true, in: true })
    band(shade, -CX + 0.6, CX - 0.6, curve, (y) => upper(y) - 0.3, (y) => upper(y) - 1.8, { bottom: true, out: true, ends: true })
    if (detail) for (let i = 0; i < panels.length; i += 2) {
      const y = panels[i]
      band(shade, -CX, CX, [y - 0.3, y + 0.3], () => bot(y) + 1.2, () => bot(y), { bottom: true, ends: true })
      if (i + 2 < panels.length) for (const [a, b] of [[-1, 1], [1, -1]]) strip(web, [a * CX, y, bot(y) + 0.6], [b * CX, panels[i + 2], bot(panels[i + 2]) + 0.6], 0.5, [0, 0, 1])
    }
    // suspenders
    if (detail) for (const y of stations(span[0], span[1], 19)) {
      if (Math.abs(Math.abs(y) - TY) < 6 || Math.abs(y) > BENT.y - 30) continue
      for (const s of [-1, 1]) {
        const z1 = cableZ(y) - 0.6, x1 = s * cableX(y)
        if (z1 - topC(y) > 1.5) rod(white, [s * CX, y, topC(y)], [x1, y, z1], 0.2, 4)
      }
    }
  }

  // ---- Main cables and their lamps --------------------------------------------
  for (const s of [-1, 1]) {
    const pts = (step: number): V3[] => [
      [s * BENT.x, -BENT.y, BENT.z],
      ...stations(-BENT.y, BENT.y, step).filter((y) => Math.abs(y) < BENT.y - 0.5).map((y) => [s * cableX(y), y, cableZ(y)] as V3),
      [s * BENT.x, BENT.y, BENT.z],
    ]
    tube(white, pts(detail ? 8 : 40), 0.75, detail ? 8 : 5)
    // lamps strung along the cable, a little above it
    const main = stations(-TY, TY, 4).map((y) => [s * cableX(y), y, cableZ(y) + 1.1] as V3)
    for (const c of along(main, detail ? 56 : 14)) bead(lamp, c, detail ? 0.55 : 0.8, !detail)
    for (const sy of [-1, 1]) {
      const side = stations(TY + 4, BENT.y - 4, 4).map((y) => [s * cableX(y), sy * y, cableZ(y) + 1.1] as V3)
      for (const c of along(side, detail ? 12 : 3)) bead(lamp, c, detail ? 0.55 : 0.8, !detail)
    }
  }

  // ---- The Odaiba approach -----------------------------------------------------
  const st = approach(detail ? 12 : 34).filter((q) => !process.env.RB_SPAN_ONLY || q.c[1] < 470)
  const U = (k: number) => apUpper(st[k].s), L = (k: number) => apUpper(st[k].s) - 10
  // the upper deck's box girder (the expressway is ~22 m wide here)
  ribbon(white, st, () => 11.5, (k) => U(k) - 0.4, (k) => U(k) - 3.2)
  // the lower deck's girder, the full width of the outline
  ribbon(white, st, (k) => st[k].hw, (k) => L(k) - 0.4, (k) => L(k) - 2.8)
  // its walkways and track bed
  for (const r of [(k: number) => [st[k].hw - 2.4, st[k].hw] as [number, number], (k: number) => [-st[k].hw, -st[k].hw + 2.4] as [number, number]])
    ribbon(deck, st, r, (k) => L(k), (k) => L(k) - 0.4, { sides: false, soffit: false, top: true })
  ribbon(deck, st, () => [-3.6, 3.6], (k) => L(k) + 0.25, (k) => L(k) - 0.4, { sides: true, soffit: false, top: true })
  // portal piers every ~45 m: two columns outside the lower girder, a beam
  // under each deck
  let next = 30
  for (let k = 1; k < st.length - 1; k++) {
    if (st[k].s < next) continue
    next = st[k].s + 45
    const a = st[k - 1].c, b = st[k + 1].c, tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty)
    const n: P2 = [ty / l, -tx / l], t: P2 = [tx / l, ty / l], c = st[k].c, w = st[k].hw + 1.6
    const col = (side: number) => {
      const o: P2 = [c[0] + n[0] * w * side, c[1] + n[1] * w * side]
      prism(concrete, [[-1.2, -1.2], [1.2, -1.2], [1.2, 1.2], [-1.2, 1.2]].map(([u, v]) => [o[0] + n[0] * u + t[0] * v, o[1] + n[1] * u + t[1] * v] as [number, number]), 0, U(k) - 3.2, { bevel: detail ? 0.3 : 0, roof: concrete })
    }
    col(-1); col(1)
    for (const [z0, z1] of [[L(k) - 4.6, L(k) - 2.8], [U(k) - 5.0, U(k) - 3.2]]) {
      const ring = [[-w - 1.2, -1.0], [w + 1.2, -1.0], [w + 1.2, 1.0], [-w - 1.2, 1.0]].map(([u, v]) => [c[0] + n[0] * u + t[0] * v, c[1] + n[1] * u + t[1] * v] as [number, number])
      prism(concrete, ring, z0, z1, { bevel: detail ? 0.2 : 0, roof: concrete })
    }
  }

  // ---- Night: towers and anchorages floodlit -------------------------------
  const lit = (p: V3, n: V3) => {
    const y = Math.abs(p[1])
    const tower = Math.abs(y - TY) < 9 && p[2] > 3
    const anch = y > 390 && y < 465 && Math.abs(p[0]) < 25 && p[2] < 61
    if (!tower && !anch) return 0
    return n[2] > 0.7 ? 0.25 : 0.95
  }
  return [
    { part: white, material: { ...finish('rainbow-white', 0xeceeec), floodlight: lit } as MaterialSpec },
    { part: web, material: { ...finish('rainbow-truss', 0xe4e7e6), doubleSided: true } },
    { part: shade, material: finish('rainbow-soffit', 0xbcc1c3) },
    { part: concrete, material: finish('rainbow-concrete', 0xcfd0cc) },
    { part: deck, material: finish('rainbow-deck', 0xa7abab) },
    { part: lamp, material: finish('lamp-rainbow', 0xd9dcda) },
  ]
}

if (import.meta.main && process.env.RB_SPAN_ONLY) {
  // inspection only: the suspension bridge without the approach, to the scratch file named
  const { writeGlb } = await import('./mesh')
  await Bun.write(process.env.RB_SPAN_ONLY, writeGlb('Rainbow Bridge', build({ detail: process.env.RB_LOW ? false : true }), {}))
} else if (import.meta.main) {
  const meta = { bearing: 111.4, elevation: 0, height: TOP + 1.6, towers: [-TY, TY], roadway: { upperMidspan: upper(0), upperTowers: upper(TY), upperAnchorages: upper(ANCH), lowerMidspan: lower(0), lowerTowers: lower(TY) } }
  await writeModel('tokyo-rainbow-bridge', 'tokyo-rainbow-bridge.glb', 'Rainbow Bridge', build({ detail: false }), meta, 6500, 250 * 1024)
  await writeModel('tokyo-rainbow-bridge', 'tokyo-rainbow-bridge.detail.glb', 'Rainbow Bridge', build({ detail: true }), meta, 40000, 1536 * 1024)
}
