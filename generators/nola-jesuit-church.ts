/**
 * Church of the Immaculate Conception ("Jesuit Church"), 130 Baronne
 * Street, New Orleans (1857 Moorish Revival design by Fr. John Cambiaso SJ;
 * rebuilt 1928-30 to the same design) — procedural, CC0-1.0, no textures.
 * bun generators/nola-jesuit-church.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 136: model +y runs up the nave
 * from the Baronne Street front (model −y, facing compass 316°) to the
 * sanctuary. Anchor: the area centroid of OSM way/328669272.
 *
 * Identity, in order: the two slim towers at the front corners with their
 * striped horseshoe-arched belfries and green onion domes; the dark
 * brown-red brick front under a cream sawtooth crest; the big cream
 * eight-pointed star window; the three horseshoe-arched doors with striped
 * cream-and-brick voussoirs; the cream inscription band and the arcaded
 * windows over it; the octagonal green dome and lantern over the sanctuary;
 * the tall flat-roofed nave over lower aisles.
 *
 * Evidence
 * - OSM way/328669272 (building=yes, height=38.7 from Microsoft footprints;
 *   the church's own outline, 19.6 x 45.7 m) and node/358399809 (the place
 *   of worship, Q12060694). In the model frame x ±9.8, y −22.8..22.9.
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid in the model frame; ground 0.3 over the grid minimum = z 0.
 *   Front at y −23.3; facade top 25.5 over the centre, 26.5 over the tower
 *   bays; nave x ±6.5, flat roof 25.5 with parapets 26.5; aisles to x ±9.8
 *   at 16.8 (parapet 17.5); towers centred x ±7.5, y −20.5: brick stage to
 *   ~29, belfry crest 34.4 (4.5 m across), onion domes to 39.5; the
 *   sanctuary's octagonal drum (centre y 18, r ~5.8) to 30.3, its dome to
 *   ~37, the lantern to 42.2.
 * - NAIP (USGS, public domain): the two domed towers, the flat grey nave
 *   roof, the green octagonal sanctuary dome.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "130 Baronne -New Orleans CBD.jpg", Karen Apricot, CC BY-SA 2.0:
 *     the front, near face-on — every opening, band and colour
 *     https://commons.wikimedia.org/wiki/File:130_Baronne_-New_Orleans_CBD.jpg
 *   - "Church of the Immaculate Conception - Baronne Street New Orleans -
 *     Jan 2020.jpg", ted bongiovanni, CC BY-SA 2.0: the front from the
 *     north along Baronne, both towers
 *     https://commons.wikimedia.org/wiki/File:Church_of_the_Immaculate_Conception_-_Baronne_Street_New_Orleans_-_Jan_2020.jpg
 *   - "The Roosevelt New Orleans, Waldorf Astoria Roof Pool - Baronne
 *     Street.jpg", Carnaval.com Studios, CC BY 2.0: the front from above
 *     (bay widths, the towers' stages, the nave roof, the sanctuary dome)
 *     https://commons.wikimedia.org/wiki/File:The_Roosevelt_New_Orleans,_Waldorf_Astoria_Roof_Pool_-_Baronne_Street.jpg
 *   - "BarroneAcrossFromRoosevelt3Oct2007Immaculate Conception.jpg",
 *     Infrogmation of New Orleans, CC BY-SA 3.0: the front from the south
 *     https://commons.wikimedia.org/wiki/File:BarroneAcrossFromRoosevelt3Oct2007Immaculate_Conception.jpg
 * - Published: Wikipedia, "Church of the Immaculate Conception (New
 *   Orleans)": 1857 design, rebuilt 1928-30 reusing the design.
 *
 * Measured (lidar): every height named above and the plan. Estimated from
 * the near face-on and elevated photos against the lidar facade top: the
 * bay widths (tower bays 5.4 m, centre 9.0 m), the inscription band
 * (8.6-9.6), the string course (17.0-17.6), the arcaded windows (10.6-16),
 * the star window (centre 21.0, 5.6 m across the points), the upper
 * windows (18.6-23.6), the doors (horseshoe arches 3.6 m outside, to 7.6),
 * the belfry stripes and arches, the onion profile. The side walls and the
 * rear are hemmed in by the hotels either side and are not photographed:
 * their windows are estimated from the facade's rhythm and kept plain.
 * Left out: the polychrome brick diaper and corbel friezes, the
 * inscription lettering, the colonnettes' capitals, the rose tracery.
 *
 * Doubts: no licensed photo shows the sanctuary dome close; its shape is
 * from NAIP and the lidar (octagonal, green), its lantern from the lidar
 * peak only. The towers' crosses return no lidar; their height is scaled
 * from the photos.
 *
 * Dome colour: green patina. The sunlit photos (ted bongiovanni, the
 * Roosevelt roof) and NAIP show green; only the overcast face-on photo
 * reads blue-grey. All three domes share the material.
 *
 * Night: the windows glow (`window`), the front is floodlit (`floodlight`).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, unit, type XY } from './nyc-570-lexington'
import { block, band, wallFrame } from './nyc-city-hall'
import { slabY, slabX, rect, disc, wall, type Side, rectRing, barCross } from './nola-st-patricks-church'

const brick = new Part(), cream = new Part(), roof = new Part(), win = new Part(), patina = new Part(), dark = new Part()

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Horseshoe arch outline (s, z): jambs w apart from z0, the circle running `ext` rad below its centre, top at zTop. */
function horseshoeShape(s: number, w: number, z0: number, zTop: number, ext = 0.35, segs = 12): [number, number][] {
  const r = w / 2 / Math.cos(ext), zc = zTop - r
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0]]
  for (let i = 0; i <= segs; i++) {
    const t = -ext + (Math.PI + 2 * ext) * (i / segs)
    pts.push([s + r * Math.cos(t), zc + r * Math.sin(t)])
  }
  return pts
}
/** A flat horseshoe panel on a wall (fanned from a point below the arch centre). */
function horseshoe(p: Part, side: Side, c: number, t: number, w: number, z0: number, zTop: number, d = 0.05, ext = 0.35) {
  const [a, b, s] = wall(side, c), f = wallFrame(a, b, d), pts = horseshoeShape(s(t), w, z0, zTop, ext)
  const cz = Math.max(z0, zTop - w)
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
    p.tri(f.at(s(t), cz), f.at(A[0], A[1]), f.at(B[0], B[1]))
  }
}
/** Striped voussoirs: the ring rIn..rOut round the arch centre, n blocks alternating parts. */
function voussoirs(pa: Part, pb: Part, side: Side, c: number, t: number, w: number, zTop: number, depth: number, n: number, d = 0.12, ext = 0.35) {
  const [a, b, s] = wall(side, c), f = wallFrame(a, b, d)
  const rIn = w / 2 / Math.cos(ext), zc = zTop - rIn, rOut = rIn + depth
  for (let i = 0; i < n; i++) {
    const t0 = -ext + (Math.PI + 2 * ext) * (i / n), t1 = -ext + (Math.PI + 2 * ext) * ((i + 1) / n)
    const p = i % 2 ? pb : pa
    const P = (r: number, q: number): V3 => f.at(s(t) + r * Math.cos(q), zc + r * Math.sin(q))
    p.quad(P(rIn, t0), P(rOut, t0), P(rOut, t1), P(rIn, t1))
    // the reveal on the outer edge so it reads proud
  }
}
/** Sawtooth (triangular) merlons along a front run at y = yf, x0..x1, base z, depth dd. */
function sawtoothY(p: Part, x0: number, x1: number, yf: number, dd: number, z: number, w: number, h: number) {
  const n = Math.max(1, Math.round((x1 - x0) / (w * 1.25)))
  const pitch = (x1 - x0) / n
  for (let k = 0; k < n; k++) {
    const xc = x0 + pitch * (k + 0.5)
    slabY(p, [[xc - w / 2, z], [xc + w / 2, z], [xc, z + h]], yf, yf + dd)
  }
}
function sawtoothX(p: Part, y0: number, y1: number, xf: number, dd: number, z: number, w: number, h: number) {
  const n = Math.max(1, Math.round((y1 - y0) / (w * 1.25)))
  const pitch = (y1 - y0) / n
  for (let k = 0; k < n; k++) {
    const yc = y0 + pitch * (k + 0.5)
    slabX(p, [[yc - w / 2, z], [yc + w / 2, z], [yc, z + h]], Math.min(xf, xf + dd), Math.max(xf, xf + dd))
  }
}
/** A solid of revolution (n sides) from a profile [z, r], smooth-shaded; a last r near 0 closes it. */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n = 14, phase = 0) {
  // per-profile-point normal (radial, z): average of the adjoining segments' normals
  const segN = prof.slice(1).map(([z1, r1], k) => { const [z0, r0] = prof[k]; const l = Math.hypot(z1 - z0, r1 - r0) || 1; return [(z1 - z0) / l, -(r1 - r0) / l] })
  const ptN = prof.map((_, k) => { const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]; const l = Math.hypot(a[0] + b[0], a[1] + b[1]) || 1; return [(a[0] + b[0]) / l, (a[1] + b[1]) / l] })
  const ang = (i: number) => phase + (i * 2 * Math.PI) / n
  const P = (k: number, i: number): V3 => [cx + Math.max(prof[k][1], 0.001) * Math.cos(ang(i)), cy + Math.max(prof[k][1], 0.001) * Math.sin(ang(i)), prof[k][0]]
  const N = (k: number, i: number): V3 => [ptN[k][0] * Math.cos(ang(i)), ptN[k][0] * Math.sin(ang(i)), ptN[k][1]]
  for (let k = 0; k < prof.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.tri(P(k, i), P(k, j), P(k + 1, j), undefined, undefined, undefined, [N(k, i), N(k, j), N(k + 1, j)])
    if (prof[k + 1][1] > 0.01) p.tri(P(k, i), P(k + 1, j), P(k + 1, i), undefined, undefined, undefined, [N(k, i), N(k + 1, j), N(k + 1, i)])
  }
}
/** A regular polygon ring. */
const ngon = (cx: number, cy: number, r: number, n: number, phase = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(phase + (i * 2 * Math.PI) / n), cy + r * Math.sin(phase + (i * 2 * Math.PI) / n)] as XY)

// ---------------------------------------------------------------------------
// Dimensions
// ---------------------------------------------------------------------------

const YF = -23.3, YB = -14.0, YR = 23.0
const W = 9.8, NX = 6.5, TB = 4.4      // half-widths: outer, nave, tower-bay inner edge
const FT = 25.5, TBT = 26.6            // facade top (centre), tower bays
const AIS = 17.2, NAV = 25.5
const TXC = 7.5, TYC = -20.5           // tower centre
const PRO = 0.35                       // tower bays stand proud of the centre bay

// ---------------------------------------------------------------------------
// Nave and aisles
// ---------------------------------------------------------------------------

prism({ wall: brick, win: null, roof: roof, ring: rectRing(-NX, YB, NX, YR), z0: 0, z1: NAV, facade: null, bevel: 0.15 })
for (const s of [-1, 1]) {
  // clerestory parapet, cream coping
  block(brick, s < 0 ? -NX : NX - 0.45, YB, s < 0 ? -NX + 0.45 : NX, YR, NAV, NAV + 0.75)
  block(cream, s < 0 ? -NX - 0.1 : NX - 0.55, YB, s < 0 ? -NX + 0.55 : NX + 0.1, YR, NAV + 0.75, NAV + 0.95)
  // the aisle
  const xa = Math.min(s * NX, s * W), xb = Math.max(s * NX, s * W)
  prism({ wall: brick, win: null, roof: roof, ring: rectRing(xa, YB, xb, YR), z0: 0, z1: AIS - 0.4, facade: null, bevel: 0.12 })
  block(cream, s < 0 ? -W - 0.12 : W - 0.45, YB, s < 0 ? -W + 0.45 : W + 0.12, YR, AIS - 0.4, AIS)
  const side: Side = s < 0 ? 'west' : 'east'
  // clerestory and aisle windows: paired round-arched lights per bay (estimated)
  for (let i = 0; i < 6; i++) {
    const y = YB + 2.2 + i * 5.2
    if (y > 11.5) break // the sanctuary drum rises behind
    for (const d of [-0.6, 0.6]) {
      horseshoe(win, side, s * NX, y + d, 0.8, 19.0, 23.6, 0.05, 0.25)
    }
    horseshoe(win, side, s * W, y, 1.4, 6.0, 13.5, 0.05, 0.25)
  }
}

// ---------------------------------------------------------------------------
// The front
// ---------------------------------------------------------------------------

// Centre bay and the two tower bays (proud), all brick.
prism({ wall: brick, win: null, roof: roof, ring: rectRing(-TB, YF, TB, YB), z0: 0, z1: FT, facade: null, bevel: 0.1 })
for (const s of [-1, 1]) {
  const xa = Math.min(s * TB, s * W), xb = Math.max(s * TB, s * W)
  prism({ wall: brick, win: null, roof: roof, ring: rectRing(xa, YF - PRO, xb, YB), z0: 0, z1: TBT, facade: null, bevel: 0.12 })
}
// Cream bands across the whole front and round the tower bays' outer sides:
// the plinth, the inscription band, the string course, the crest's lines.
const frontBand = (z0: number, z1: number, d: number, sides = true) => {
  block(cream, -TB, YF - d, TB, YF, z0, z1)
  for (const s of [-1, 1]) {
    const xa = Math.min(s * TB, s * W), xb = Math.max(s * TB, s * W)
    block(cream, xa - (s < 0 ? d : 0), YF - PRO - d, xb + (s > 0 ? d : 0), YF - PRO, z0, z1)
    if (sides) block(cream, s < 0 ? -W - d : W, YF - PRO - d, s < 0 ? -W : W + d, YB, z0, z1)
  }
}
frontBand(0, 0.7, 0.12)
frontBand(8.6, 9.7, 0.18)
frontBand(17.0, 17.6, 0.2)
block(cream, -TB, YF - 0.12, TB, YF, FT - 1.1, FT - 0.85)
for (const s of [-1, 1]) block(cream, Math.min(s * TB, s * W) - 0.12, YF - PRO - 0.12, Math.max(s * TB, s * W) + 0.12, YF - PRO, TBT - 1.2, TBT - 0.95)
// The sawtooth crest: cream triangles along the top of the front and the tower bays' sides.
block(cream, -TB, YF - 0.05, TB, YF + 0.45, FT, FT + 0.25)
sawtoothY(cream, -TB, TB, YF - 0.05, 0.4, FT + 0.25, 0.75, 0.95)
for (const s of [-1, 1]) {
  const xa = Math.min(s * TB, s * W), xb = Math.max(s * TB, s * W)
  block(cream, xa, YF - PRO - 0.05, xb, YF - PRO + 0.4, TBT, TBT + 0.25)
  sawtoothY(cream, xa, xb, YF - PRO - 0.05, 0.4, TBT + 0.25, 0.75, 0.95)
  sawtoothX(cream, YF - PRO + 0.2, YB, s * W - (s > 0 ? 0.4 : 0), 0.4 * 1, TBT, 0.75, 0.95)
}

// Doors: three horseshoe arches with striped voussoirs, a round window in the tympanum.
const doorAt = (x: number, yc: number, w: number, zTop: number, cols: boolean) => {
  horseshoe(dark, 'front', yc, x, w, 0.7, zTop, 0.05)                // the tympanum's recess
  rect(dark, 'front', yc - 0.02, x, w * 0.7, 0.7, 5.0, 0.1)           // the doors
  block(cream, x - w * 0.4, yc - 0.3, x + w * 0.4, yc, 5.0, 5.35)     // the lintel
  disc(win, 'front', yc, x, zTop - w * 0.5, w * 0.24, 0.09, 12)       // the rose
  disc(cream, 'front', yc, x, zTop - w * 0.5, w * 0.31, 0.07, 12)
  voussoirs(cream, brick, 'front', yc, x, w, zTop, 0.6, 15, 0.14)
  if (cols) for (const d of [-1, 1]) {
    block(cream, x + d * (w / 2 + 0.05) - 0.25, yc - 0.6, x + d * (w / 2 + 0.05) + 0.25, yc, 0.7, 1.0)
    block(brick, x + d * (w / 2 + 0.05) - 0.17, yc - 0.5, x + d * (w / 2 + 0.05) + 0.17, yc - 0.1, 1.0, 4.9)
    block(cream, x + d * (w / 2 + 0.05) - 0.27, yc - 0.6, x + d * (w / 2 + 0.05) + 0.27, yc, 4.9, 5.35)
  }
  block(cream, x - w / 2 - 0.4, yc - 0.9, x + w / 2 + 0.4, yc, 0, 0.35)  // the step
}
doorAt(0, YF, 3.3, 7.9, true)
for (const s of [-1, 1]) doorAt(s * TXC, YF - PRO, 3.1, 7.7, false)
// Brick-panel insets with cream frames flanking the centre door (the terracotta panels).
for (const s of [-1, 1]) for (const z of [2.2, 5.6]) {
  rect(cream, 'front', YF, s * 3.3, 0.95, z, z + 1.0, 0.06)
  rect(brick, 'front', YF, s * 3.3, 0.62, z + 0.17, z + 0.83, 0.1)
}

// Middle level: arcaded windows of cusped horseshoe lights on cream colonnettes.
const arcade = (yc: number, x0: number, x1: number, n: number, z0: number, zTop: number) => {
  const pitch = (x1 - x0) / n, w = pitch * 0.72
  rect(cream, 'front', yc, (x0 + x1) / 2, x1 - x0 + 0.5, z0 - 0.55, z0, 0.12)          // sill
  for (let k = 0; k < n; k++) {
    const x = x0 + pitch * (k + 0.5)
    horseshoe(cream, 'front', yc, x, pitch * 0.98, z0, zTop + 0.35, 0.06, 0.2)
    horseshoe(win, 'front', yc, x, w, z0, zTop, 0.1, 0.2)
  }
}
arcade(YF, -2.4, 2.4, 4, 10.6, 16.0)
for (const s of [-1, 1]) {
  arcade(YF, s * 3.65 - 0.5, s * 3.65 + 0.5, 1, 10.9, 15.8)
  arcade(YF - PRO, s * TXC - 1.25, s * TXC + 1.25, 2, 10.6, 15.8)
}

// Upper level: the eight-pointed star in the centre, twin lights under a hood in each tower bay.
{
  const zc = 21.0, ro = 3.0, ri = 2.15
  const star = (r1: number, r2: number): [number, number][] => Array.from({ length: 16 }, (_, i) => {
    const a = Math.PI / 2 + (i * Math.PI) / 8, r = i % 2 ? r2 : r1
    return [r * Math.cos(a), zc + r * Math.sin(a)] as [number, number]
  })
  slabY(cream, star(ro, ro * 0.76), YF - 0.25, YF, [0, zc])
  slabY(win, star(ri * 1.02, ri * 0.74), YF - 0.32, YF - 0.2, [0, zc])
  disc(cream, 'front', YF - 0.32, 0, zc, 0.45, 0.05, 10)
  for (let k = 0; k < 8; k++) {           // the rose's spokes
    const a = (k * Math.PI) / 4, r0 = 0.45, r1 = ri * 0.8
    const [A, B] = [[Math.cos(a) * r0, zc + Math.sin(a) * r0], [Math.cos(a) * r1, zc + Math.sin(a) * r1]]
    const nx = -Math.sin(a) * 0.08, nz = Math.cos(a) * 0.08
    slabY(cream, [[A[0] - nx, A[1] - nz], [B[0] - nx, B[1] - nz], [B[0] + nx, B[1] + nz], [A[0] + nx, A[1] + nz]], YF - 0.36, YF - 0.3)
  }
}
for (const s of [-1, 1]) {
  const x = s * TXC, yc = YF - PRO
  horseshoe(cream, 'front', yc, x, 2.9, 18.3, 24.1, 0.06, 0.3)
  horseshoe(brick, 'front', yc, x, 2.3, 18.6, 23.5, 0.1, 0.3)
  for (const d of [-0.55, 0.55]) horseshoe(win, 'front', yc, x + d, 0.75, 18.7, 22.2, 0.14, 0.2)
  disc(cream, 'front', yc, x, 22.9, 0.35, 0.14, 8)
}

// ---------------------------------------------------------------------------
// The towers
// ---------------------------------------------------------------------------

for (const s of [-1, 1]) {
  const cx = s * TXC, cy = TYC, h = 2.3
  // the square brick stage over the facade, its cream sawtooth crest
  prism({ wall: brick, win: null, roof: brick, ring: rectRing(cx - h, cy - h, cx + h, cy + h), z0: TBT - 0.5, z1: 29.2, facade: null, bevel: 0.1 })
  for (const side of ['front', 'rear'] as const) {
    const yf = side === 'front' ? cy - h - 0.05 : cy + h - 0.35
    sawtoothY(cream, cx - h, cx + h, yf, 0.4, 29.2, 0.7, 0.8)
  }
  for (const d of [-1, 1]) sawtoothX(cream, cy - h, cy + h, cx + d * h - (d > 0 ? 0.4 : 0), 0.4, 29.2, 0.7, 0.8)
  // the octagonal belfry: brick with cream stripes, a horseshoe opening on every face
  const R = 2.05 / Math.cos(Math.PI / 8), oct = ngon(cx, cy, R, 8, Math.PI / 8)
  prism({ wall: brick, win: null, roof: cream, ring: oct, z0: 29.0, z1: 34.0, facade: null, bevel: 0.06 })
  for (const [z0, z1] of [[29.9, 30.3], [31.0, 31.3], [32.1, 32.4], [33.2, 33.5]]) band(cream, oct, z0, z1, 0.04)
  for (let k = 0; k < 8; k++) {
    const a = oct[k], b = oct[(k + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const f = wallFrame(a, b, 0.07), pts = horseshoeShape(L / 2, 1.05, 30.3, 33.1, 0.3, 8)
    for (let i = 0; i < pts.length; i++) {
      const A = pts[i], B = pts[(i + 1) % pts.length]
      if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
      dark.tri(f.at(L / 2, 31.2), f.at(A[0], A[1]), f.at(B[0], B[1]))
    }
  }
  // the cream crown: a cornice with small teeth, the drum, the onion dome and its cross
  band(cream, oct, 34.0, 34.45, 0.22)
  for (let k = 0; k < 8; k++) {
    const a = oct[k], b = oct[(k + 1) % 8], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const ux = (b[0] - a[0]), uy = (b[1] - a[1]), L = Math.hypot(ux, uy)
    const ex = ux / L * 0.3, ey = uy / L * 0.3, nx = (m[0] - cx) / 2.05 * 0.12, ny = (m[1] - cy) / 2.05 * 0.12
    block(cream, Math.min(m[0] - ex, m[0] + ex) + nx - 0.12, Math.min(m[1] - ey, m[1] + ey) + ny - 0.12, Math.max(m[0] - ex, m[0] + ex) + nx + 0.12, Math.max(m[1] - ey, m[1] + ey) + ny + 0.12, 34.45, 35.0)
  }
  lathe(cream, cx, cy, [[34.4, 1.7], [35.4, 1.7]], 14)
  lathe(patina, cx, cy, [[35.4, 1.6], [35.8, 1.95], [36.4, 2.12], [37.0, 2.02], [37.6, 1.62], [38.2, 1.0], [38.7, 0.45], [39.1, 0.16], [39.5, 0.05]], 14)
  block(patina, cx - 0.09, cy - 0.09, cx + 0.09, cy + 0.09, 39.3, 40.3)
  barCross(dark, cx, cy, 40.2, 1.3, 0.75, 0.13)
}

// ---------------------------------------------------------------------------
// The sanctuary dome
// ---------------------------------------------------------------------------

{
  const cx = 0, cy = 17.6, R = 5.6
  const oct = ngon(cx, cy, R, 8, Math.PI / 8)
  prism({ wall: brick, win: null, roof: null, ring: oct, z0: NAV - 0.5, z1: 30.3, facade: null, bevel: 0.06 })
  band(cream, oct, 29.8, 30.4, 0.25)
  for (let k = 0; k < 8; k++) {
    const a = oct[k], b = oct[(k + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const f = wallFrame(a, b, 0.05), pts = horseshoeShape(L / 2, 1.3, 26.6, 29.4, 0.25, 8)
    for (let i = 0; i < pts.length; i++) {
      const A = pts[i], B = pts[(i + 1) % pts.length]
      if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
      win.tri(f.at(L / 2, 28.0), f.at(A[0], A[1]), f.at(B[0], B[1]))
    }
  }
  // the eight-sided dome (faceted, a curved profile), the lantern and its cap
  const prof: [number, number][] = [[30.4, R + 0.1], [32.4, R * 0.86], [34.3, R * 0.62], [35.8, R * 0.38], [36.8, 1.15]]
  const rings = prof.map(([z, r]) => ngon(cx, cy, r, 8, Math.PI / 8).map(([x, y]) => [x, y, z] as V3))
  patina.loft(rings)
  patina.cap(rings[rings.length - 1], true)
  const lan = ngon(cx, cy, 1.05, 8, Math.PI / 8)
  prism({ wall: cream, win: null, roof: null, ring: lan, z0: 36.7, z1: 40.0, facade: null, bevel: 0.04 })
  for (let k = 0; k < 8; k += 1) {
    const a = lan[k], b = lan[(k + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const f = wallFrame(a, b, 0.04)
    win.quad(f.at(L / 2 - 0.22, 37.4), f.at(L / 2 + 0.22, 37.4), f.at(L / 2 + 0.22, 39.3), f.at(L / 2 - 0.22, 39.3))
  }
  lathe(patina, cx, cy, [[40.0, 1.25], [40.3, 1.25], [41.4, 0.5], [42.0, 0.08]], 8, Math.PI / 8)
  barCross(dark, cx, cy, 41.9, 1.1, 0.6, 0.12)
}
// The rear wall's cream coping over the aisles' ends.
block(cream, -W, YR - 0.1, W, YR + 0.12, AIS - 0.4, AIS)

// ---------------------------------------------------------------------------
// Finish
// ---------------------------------------------------------------------------

const lit = (p: V3, n: V3): number => {
  const up = n[2] > 0.7 ? 0.3 : 1
  if (p[1] < YB && n[1] < -0.3) return up
  if (p[1] < YB || p[2] > 29) return 0.6 * up
  return 0.05 * up
}
finishModel('Church of the Immaculate Conception', 'nola-jesuit-church', [
  { part: brick, material: { ...finish('jes-brick', 0x7c4b40), floodlight: lit } },
  { part: cream, material: { ...finish('jes-cream', 0xf3e8d0), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: patina, material: finish('jes-patina', 0x8fb7a2) },
  { part: dark, material: finish('jes-dark', 0x4e4440) },
], { bearing: 136, osm: 'way/328669272', height: 43.0 }, 6500)
