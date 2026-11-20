/**
 * Denver International Airport, Jeppesen Terminal (1995, Fentress Bradburn
 * Architects; tensioned PTFE-fibreglass roof by Horst Berger / Severud) —
 * original procedural geometry, CC0-1.0.
 * bun generators/den-airport-terminal.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the lowest ground
 * under the footprint (the south end, by the transit plaza pit). Bearing 0:
 * the terminal's walls run within a degree of north–south. Anchor
 * -104.673821, 39.849602, the centroid of OSM relation/4428836 ("Jeppesen
 * Terminal", outer way/206608379). The plan below is drawn about the lidar
 * box centre (-104.6738, 39.8494) and moved onto the anchor at the end
 * (x + 1.79, y - 22.28).
 *
 * Identity (photos below):
 *  1. The white tent roof: two rows of 17 peaks (34) running the length of
 *     the Great Hall, each a steep concave cone of fabric from a mast cap,
 *     creased valleys between the peaks, the fabric between the rows held
 *     up as a vault on transverse ridges.          (dia, pd, aerial, NAIP)
 *  2. Four taller peaks in each row: two pairs either side of the middle.
 *                                            (lidar; visible in dia, aerial)
 *  3. White mast caps with a dark glass band and a spike on every peak.
 *                                                            (pd, dia)
 *  4. The big arched ends: the end bays' fabric sweeps down to the corners
 *     over a glazed end wall.                                      (pd)
 *  5. A row of small white tent canopies along both long eaves, over the
 *     departures curbs, and the flat-roofed, glass-walled terminal body
 *     under it all.                                     (dia, pd, NAIP, lidar)
 *
 * Heights: USGS 3DEP lidar CO_DRCOG_2_2020 (flown 2020), 1 m grid, half
 * 175 m, ground_min 1625.2 m, which is also the lowest map terrain under
 * the footprint (Mapterhorn 1625.4 m, at the south end); model z = lidar
 * height above ground_min. Measured: the peaks (local maxima in the DSM)
 * stand in two rows at x = -23.6 and 18.0 (raw frame), 18.4 m apart along
 * y from 143.5 to -151.5; heights 54.0 (most), 60–62 (j = 5, 6, 10, 11),
 * 48.2 (the end peaks). The vault between the rows 44 at the peak lines and
 * 42 between bays; valleys along a row 40–41; the fabric's outer edge 35
 * in line with a mast and 30.5 between masts, at x = -46.8 and 41.2; the end
 * arches about 36–37.5. Flat body roof 30.5; the wings' mono-pitch roofs
 * rise from 30.7 to 35.2 toward the hall; small curb tents 37 over a 32
 * eave strip. The north neck (OSM's outline north of y = 152) is 25.9 where
 * the lidar box reaches it (to y = 175) and assumed flat beyond.
 *
 * Estimated: the fabric between the measured points (a concave cone from
 * each cap, profile exponent 2.4, fitted to the lidar sections at y = -5,
 * -13, -44 and x = -24); the cap size (2.2 m radius, 2.5 m tall, from the
 * photos against the peak spacing); the spikes (2.5 m, thin, photos only:
 * the lidar does not see them); the window bands on the body (from pd and
 * dia, grouped per 9.2 m bay); the small curb tents' plan (10 x 10 m, the
 * NAIP scallops). The peak spacing is drawn regular (18.44 m); the lidar's
 * spacing varies 16–21 m, mostly from where on each cap the maximum fell.
 *
 * What the model covers: the whole outline of relation/4428836 — the Great
 * Hall under the tent, the flat-roofed side wings (ticketing, baggage) and
 * the north neck toward the Concourse A bridge. It ends at the outline:
 * Garage East/West (way/206629411, way/206629422), the curbside canopies
 * over the departures roadways (way/318989106, way/318989615), the Westin
 * (way/348668321), the transit-centre canopies (way/348668325,
 * way/589135822) and the A bridge are left to the map. The elevated
 * roadways around it (the departures deck at 25 m) are not modelled, so the
 * body's walls run down to the ground as the map's terrain shows it.
 *
 * Photos (evidence, Wikimedia Commons):
 *  pd      "Denver international airport.jpg", unknown author, public domain
 *          (an end bay and arch from the south, with the curtain wall)
 *  dia     "Denver International Airport.jpg", CC BY-SA 3.0 (the long side
 *          across the airfield)
 *  aerial  "Aerial view of Jeppesen Terminal, Denver International Airport
 *          (2025).jpg", Steve Morgan, CC BY-SA 4.0 (from the east, above)
 *  night   "Pre-Sunrise at Denver International Airport (2016).jpg", Jeff
 *          Turner, CC BY 2.0 (the lit tent at night)
 *  south   "Jeppesen Terminal at DEN Airport, south view, Aug 2014.jpg",
 *          Sunnya343, CC BY-SA 4.0 (inside: the arched south glass wall)
 *  imtn    "Denver International Airport Jeppesen Terminal 2007.jpg", imtn,
 *          CC BY-SA 2.5 (inside: clerestory triangles under the fabric)
 * USGS NAIP orthophoto (public domain) for the plan and the curb tents.
 * No look-only sources. No commercial imagery.
 *
 * Night (night photo): the fabric glows warm from the lights inside, so it
 * carries _FLOODLIGHT; the curtain walls and the end glass are `window`.
 * The cap bands and clerestories are `glass` and stay dark.
 *
 * Doubts: the lidar dates from 2020 (the Great Hall renovation since then
 * has not changed the roof); the end arches' curve between the measured
 * points; the body facades are mostly hidden behind the roadway decks and
 * garages in reality and are drawn as plain grouped glass bands.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, onWall, rectShape, ccw, type XY } from './atl-tech-tower'
import { save } from './atl-flatiron-building'

const fabric = new Part(), shade = new Part(), body = new Part(), roof = new Part(), win = new Part(), glass = new Part()

// ── Measured layout (raw frame about the lidar centre) ──
const XC = -2.8, ROW = 20.8, UE = 44 // vault centre line, peak rows at XC ± ROW, outer fabric edge at XC ± UE
const N = 17, DY = 18.44, YC = -4, VB = DY / 2, VEND = 7.5
const ys = Array.from({ length: N }, (_, j) => YC + (8 - j) * DY)
const peakH = (j: number) => (j === 0 || j === N - 1 ? 48.2 : [5, 6, 10, 11].includes(j) ? 60.5 : 54)
const ROOF = 30.5, CAP_R = 2.2, CAP_H = 2.5, K = 2.4

// ── The fabric, toned: faces turned north (away from the sun and the usual
// view) take the slightly darker shade so the folds read ──
function ftri(a: V3, b: V3, c: V3) {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2]
  let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
  if (nz < 0) { [b, c] = [c, b]; nx = -nx; ny = -ny; nz = -nz }
  const l = Math.hypot(nx, ny, nz) || 1
  ;(ny / l > 0.18 ? shade : fabric).tri(a, b, c)
}

// A smooth-shaded upward sheet over a grid of rings (closed round if
// `closed`): each corner's normal is the mean of its faces' normals, so the
// cone reads as one soft surface and its corners weld; the creases between
// cells stay sharp. Faces are toned as in ftri.
function smoothSheet(rings: V3[][], closed: boolean) {
  const K1 = rings.length, M = rings[0].length, Q = closed ? M : M - 1
  const fn = (a: V3, b: V3, c: V3): V3 => {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2]
    let n: V3 = [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx]
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
    const l = Math.hypot(...n) || 1
    return [n[0] / l, n[1] / l, n[2] / l]
  }
  const acc: V3[][] = rings.map((r) => r.map(() => [0, 0, 0] as V3))
  const faceN: V3[][] = []
  for (let k = 0; k < K1 - 1; k++) {
    faceN.push([])
    for (let i = 0; i < Q; i++) {
      const i2 = (i + 1) % M
      const n = fn(rings[k][i], rings[k][i2], rings[k + 1][i2])
      faceN[k].push(n)
      for (const [kk, ii] of [[k, i], [k, i2], [k + 1, i], [k + 1, i2]]) for (let c = 0; c < 3; c++) acc[kk][ii][c] += n[c]
    }
  }
  const vn = acc.map((r) => r.map((n) => { const l = Math.hypot(...n) || 1; return [n[0] / l, n[1] / l, n[2] / l] as V3 }))
  for (let k = 0; k < K1 - 1; k++) {
    for (let i = 0; i < Q; i++) {
      const i2 = (i + 1) % M
      const p = k === K1 - 2 || faceN[k][i][1] > 0.18 ? shade : fabric // the skirts into the valleys, and north faces
      p.tri(rings[k][i], rings[k][i2], rings[k + 1][i2], undefined, undefined, undefined, [vn[k][i], vn[k][i2], vn[k + 1][i2]])
      p.tri(rings[k][i], rings[k + 1][i2], rings[k + 1][i], undefined, undefined, undefined, [vn[k][i], vn[k + 1][i2], vn[k + 1][i]])
    }
  }
}

// Boundary heights of a peak's cell, in (u from the centre line, v from the
// peak along y). `endSide` marks the outer half of an end bay.
const ridge = (v: number) => 42 + 2 * Math.cos((Math.PI * v) / DY) ** 2
const valley = (u: number) => (u <= ROW ? 42 - 1.6 * (u / ROW) : ROOF + 9.9 * Math.pow(1 - (u - ROW) / (UE - ROW), 1.2))
const eave = (v: number) => ROOF + 4.5 * Math.cos((Math.PI * v) / DY) ** 2
const ARCH = 37 // the end arches' crown (lidar 36–37.5), one round curve down to the corners
const arch = (u: number) => ROOF + (ARCH - ROOF) * Math.pow(Math.max(0, 1 - (u / UE) ** 2), 0.6)
function hb(u: number, v: number, vmax: number, endSide: boolean): number {
  const av = Math.abs(v)
  if (endSide) {
    const f = av / vmax
    if (Math.abs(av - vmax) < 1e-6) return arch(u)
    if (u < 1e-6) return 44 + (ARCH - 44) * f
    return 35 + (ROOF - 35) * f // outer edge
  }
  if (Math.abs(av - vmax) < 1e-6) return valley(u)
  if (u < 1e-6) return ridge(v)
  return eave(v)
}

const TS = [0, 0.18, 0.5, 1]
for (let j = 0; j < N; j++) {
  for (const s of [-1, 1]) {
    const py = ys[j], px = XC + s * ROW, H = peakH(j)
    const vN = j === 0 ? VEND : VB, vS = j === N - 1 ? VEND : VB // cell reach north / south
    // the cell's perimeter in (u, v), counter-clockwise in plan once mapped
    const per: [number, number][] = []
    const vs = (a: number, b: number) => [0, 1 / 3, 2 / 3].map((f) => a + (b - a) * f)
    for (const v of vs(-vS, vN)) per.push([UE, v]) // outer edge, south → north
    for (const u of vs(UE, 0)) per.push([u, vN]) // north edge, outer → centre
    for (const v of vs(vN, -vS)) per.push([0, v]) // centre line, north → south
    for (const u of vs(0, UE)) per.push([u, -vS]) // south edge, centre → outer
    const rings: V3[][] = TS.map((t) =>
      per.map(([u, v]) => {
        const bx = XC + s * u, by = py + v
        const dx = bx - px, dy = by - py, d = Math.hypot(dx, dy)
        const r = CAP_R + t * (d - CAP_R)
        const endSide = (j === 0 && v > 0) || (j === N - 1 && v < 0)
        const Hb = hb(u, v, v > 0 ? vN : vS, endSide)
        const z = Hb + (H - CAP_H - Hb) * Math.pow(1 - t, K)
        return [px + (dx / d) * r, py + (dy / d) * r, z] as V3
      }),
    )
    smoothSheet(rings, true)
    // the clerestory under the raised outer edge
    const xo = XC + s * UE
    const ePts: [number, number][] = []
    for (let i = 0; i <= 6; i++) {
      const v = -vS + ((vN + vS) * i) / 6
      ePts.push([v, hb(UE, v, v > 0 ? vN : vS, (j === 0 && v > 0) || (j === N - 1 && v < 0))])
    }
    for (let i = 0; i < 6; i++) {
      const [v0, z0] = ePts[i], [v1, z1] = ePts[i + 1]
      const a: V3 = [xo, py + v0, ROOF], b: V3 = [xo, py + v1, ROOF], c: V3 = [xo, py + v1, z1], d: V3 = [xo, py + v0, z0]
      if (s > 0) glass.quad(a, b, c, d)
      else glass.quad(b, a, d, c)
    }
    // the mast cap: white drum, dark glass band, a low cone and the spike
    const capRing = (r: number, z: number): V3[] => Array.from({ length: 6 }, (_, i) => [px + r * Math.cos((i / 6) * Math.PI * 2), py + r * Math.sin((i / 6) * Math.PI * 2), z])
    glass.loft([capRing(CAP_R, H - CAP_H - 0.6), capRing(CAP_R, H - 1.1)])
    fabric.loft([capRing(CAP_R, H - 1.1), capRing(0.6, H)])
    const tip: V3 = [px, py, H + 2.5], base = capRing(0.6, H).filter((_, i) => i % 2 === 0)
    for (let i = 0; i < 3; i++) body.tri(base[i], base[(i + 1) % 3], tip)
  }
}

// The end walls' glazed tympana, under the arches (north y = 151, south y = -159)
const yN = ys[0] + VEND, yS = ys[N - 1] - VEND
for (const [ye, out] of [[yN, 1], [yS, -1]] as [number, number][]) {
  const us = [-UE, -40, -34, -26, -16, 0, 16, 26, 34, 40, UE]
  for (let i = 0; i < us.length - 1; i++) {
    const u0 = us[i], u1 = us[i + 1]
    const a: V3 = [XC + u0, ye, ROOF], b: V3 = [XC + u1, ye, ROOF], c: V3 = [XC + u1, ye, arch(Math.abs(u1))], d: V3 = [XC + u0, ye, arch(Math.abs(u0))]
    if (out < 0) glass.quad(a, b, c, d)
    else glass.quad(b, a, d, c)
  }
}

// ── The body: the outline (scallops straightened) at the flat roof height ──
const plan: XY[] = ccw([
  [-55, 152], [-55, 142], [-43, 142], [-43, 134], [-80, 134], [-80, 131], [-89.5, 125], [-89.5, -127], [-81, -137], [-81, -142],
  [XC - UE, -142], [XC - UE, yS], [XC + UE, yS], [XC + UE, -142], [76, -142], [76, -138], [85.5, -131], [85.5, 124],
  [78, 130], [78, 134], [41, 134], [41, 142], [51, 142], [51, 152],
])
prism(body, plan, 0, ROOF, roof, 0.4)
// the north neck toward the Concourse A bridge
const neck: XY[] = ccw([[-35, 152], [32, 152], [33, 240], [58, 239], [58, 229], [69, 229], [69, 237], [64, 240], [45, 247], [-48, 248], [-61, 244], [-61, 240], [-33, 240]])
prism(body, neck, 0, 25.9, roof, 0.4)

// The wings' mono-pitch roofs, rising toward the hall
function wedge(xLow: number, xHigh: number, y0: number, y1: number, zLow: number, zHigh: number) {
  const s = Math.sign(xHigh - xLow)
  const a: V3 = [xLow, y0, zLow], b: V3 = [xHigh, y0, zHigh], c: V3 = [xHigh, y1, zHigh], d: V3 = [xLow, y1, zLow]
  const A: V3 = [xHigh, y0, ROOF], B: V3 = [xHigh, y1, ROOF]
  if (s > 0) roof.quad(a, b, c, d)
  else roof.quad(b, a, d, c)
  // the high end's face, and the two triangular ends
  if (s > 0) body.quad(A, B, c, b)
  else body.quad(B, A, b, c)
  const tri = (p: V3, q: V3, r: V3, flip: boolean) => (flip ? body.tri(p, r, q) : body.tri(p, q, r))
  tri([xLow, y0, ROOF], A, b, s < 0)
  tri([xLow, y1, ROOF], c, B, s < 0)
}
wedge(-74, XC - UE - 3.2, -126, 124, ROOF + 0.2, 35.2)
wedge(66, XC + UE + 3, -126, 124, ROOF + 0.2, 35.2)

// The small curb tents along both eaves, one per bay, between the masts
for (const [x0, x1] of [[-90, -79], [75, 86]]) {
  for (let n = -7; n <= 6; n++) {
    const y = YC + VB + n * DY, cx = (x0 + x1) / 2
    const base: V3[] = [[x0, y - 5, ROOF], [x1, y - 5, ROOF], [x1, y + 5, ROOF], [x0, y + 5, ROOF]]
    const mid = base.map(([x, yy]) => [cx + (x - cx) * 0.45, y + (yy - y) * 0.45, ROOF + 3.4] as V3)
    const top: V3 = [cx, y, 37]
    for (let i = 0; i < 4; i++) {
      const i2 = (i + 1) % 4
      ftri(base[i], base[i2], mid[i2])
      ftri(base[i], mid[i2], mid[i])
      ftri(mid[i], mid[i2], top)
    }
  }
}

// ── Facades: grouped glass bands per bay ──
const faces: [XY[], number][] = [[plan, ROOF], [neck, 25.9]]
for (const [ring, top] of faces) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // the glazed south end wall under the arch is one curtain wall
    if (top === ROOF && Math.abs(a[1] - yS) < 0.01 && Math.abs(b[1] - yS) < 0.01) {
      for (let m = 0; m < 10; m++) onWall(win, a, b, rectShape(1 + ((L - 2) * m) / 10 + 0.4, 1 + ((L - 2) * (m + 1)) / 10 - 0.4, 4, ROOF - 0.6), 0.05)
      continue
    }
    const k = Math.floor(L / 9.2)
    if (k < 1) continue
    const w = L / k
    for (let m = 0; m < k; m++) {
      const s0 = m * w + 0.8, s1 = (m + 1) * w - 0.8
      onWall(win, a, b, rectShape(s0, s1, 4, 9.5), 0.05)
      onWall(win, a, b, rectShape(s0, s1, top - 9, top - 1.4), 0.05)
    }
  }
}

// ── Move onto the anchor ──
const OX = -1.79, OY = 22.28
for (const p of [fabric, shade, body, roof, win, glass]) {
  for (let i = 0; i < p.pos.length; i += 3) {
    p.pos[i] -= OX
    p.pos[i + 2] += OY // glTF z = -y
  }
}

const glow = (_p: V3, n: V3) => (n[2] > -0.2 ? 0.85 : 0.3)
console.log([fabric, shade, body, roof, win, glass].map((p) => p.triangles).join(" "))
await save('den-airport-terminal', 'Denver International Airport, Jeppesen Terminal', [
  { part: fabric, material: { ...finish('den-ptfe', 0xf6f4ee), floodlight: glow } },
  { part: shade, material: { ...finish('den-ptfe-shade', 0xd9dde2), floodlight: glow } },
  { part: body, material: finish('den-terminal-body', 0xe4e0d8) },
  { part: roof, material: finish('den-terminal-roof', 0xc9cdd0) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
], { height: 63, anchor: [39.849602, -104.673821], bearing: 0 }, 6500)
