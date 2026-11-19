/**
 * Kingdom Centre (Burj al-Mamlaka), Riyadh — original procedural geometry, CC0-1.0.
 * bun generators/riyadh-kingdom-centre.ts
 *
 * This file also exports the small helpers shared by the riyadh-* and
 * jeddah-* generators of the Middle East batch (OSM projection, polygon
 * triangulation, prisms, bevelled boxes, wall panels). Its own build runs
 * only under `import.meta.main`, so merge it before the others.
 *
 * Frame: map frame turned to BEARING 333.6, so local +x runs along the
 * tower's long axis (compass 63.6°, south-west to north-east) and local +y
 * is the north-west broad face's outward normal. Origin = centroid of the
 * OSM tower outline way/264745922.
 *
 * Evidence
 * - OSM way/264745922 (tower outline, height 205), parts way/264745924 and
 *   way/264745925 (the two 302 m end strips), way/984443070 (the sky bridge,
 *   min_height 302), way/264745917 (the mall and hotel podium, height 16,
 *   4 levels). Measured from their nodes in this frame: the lens is 79.2 m
 *   end to end (x ±39.6), 44.8 m across at the middle (y ±22.4); the flat end
 *   faces are 14.6 m wide (y ±7.3) and chamfer out to the lens at x ±36.5,
 *   y ±10; the bridge strip is ~15 m deep.
 * - Published (Wikipedia "Kingdom Centre", CTBUH): 302.3 m to the top, 99
 *   storeys, completed 2002 (Ellerbe Becket with Omrania), sky bridge at the
 *   top spanning the opening, 300 m up.
 * - Commons photos (daylight unless noted), all EVIDENCE:
 *   "Kingdom Centre, Feb2009.jpg" (Francisco Anzola, CC BY 2.0) — near
 *     broadside, the U and bridge proportions;
 *     https://commons.wikimedia.org/wiki/File:Kingdom_Centre,_Feb2009.jpg
 *   "Kingdom Centre.JPG" (King Eliot, CC BY-SA 4.0) — three-quarter, the white
 *     reveal; https://commons.wikimedia.org/wiki/File:Kingdom_Centre.JPG
 *   "KingdomCentre Sideview.JPG" (King Eliot, CC BY-SA 3.0) — end-on, the
 *     narrow end face and the lens depth;
 *     https://commons.wikimedia.org/wiki/File:KingdomCentre_Sideview.JPG
 *   "Kingdom Centre, Riyadh (6129688934).jpg" (Wajahat Mahmood, CC BY-SA 2.0)
 *     — from afar, the opening depth (about a third of the height);
 *     https://commons.wikimedia.org/wiki/File:Kingdom_Centre,_Riyadh_(6129688934).jpg
 *   "Kingdom Tower From King Fahd Road (221506137).jpeg" (Francisco Anzola,
 *     CC BY 3.0) — the podium wings and their stone colour;
 *     https://commons.wikimedia.org/wiki/File:Kingdom_Tower_From_King_Fahd_Road_(221506137).jpeg
 *   "Kingdom Centre, Dec2009.jpg" (Ahmed Rabea, CC BY-SA 2.0) — the inner
 *     reveal from below; https://commons.wikimedia.org/wiki/File:Kingdom_Centre,_Dec2009.jpg
 *   "Kingdom Centre Riyadh 2024.jpeg" (Hamza A. Durrani, CC BY-SA 4.0, night)
 *     — the lit ring and bridge;
 *     https://commons.wikimedia.org/wiki/File:Kingdom_Centre_Riyadh_2024.jpeg
 *
 * Estimated from the photos (scaled to the 79.2 m OSM length and 302 m
 * height): the opening's inner bottom at 203 m (OSM's 205 m outline height
 * agrees), its top corners 8 m in from each end, the U shape, a parabola (half-width
 * 31.5 × √t before the taper, t the height fraction from 203 to 288 m;
 * the near-broadside photo gives 0.69 of the top width at mid-height, √0.5 =
 * 0.71), the
 * top beam 288–302 m in three bands (white, dark glazed bridge, white), the
 * bridge's 15 m depth (OSM strip), the 2.2 m white rim round the opening
 * (a little bolder than the real reveal edge). The small dark recesses on
 * the end faces are left out (they read as noise at map scale). The plan narrows with
 * height: lengthwise to 0.85 of the base at the top (the distant Wajahat
 * Mahmood photo gives a top/base width of 0.81, ~0.85 after allowing for its
 * slight upward view; closer photos read 0.72–0.78 but are foreshortened),
 * and across the lens to 0.7 (the end-on photo). OSM draws the 302 m end
 * strips on the footprint's ends, so the model's ends stand ~6 m inside them
 * at the top. Glass is silver-blue (#aabdcb), a little lighter above 200 m
 * (#b9c8d4) where it catches the sky. Podium walls 16 m (OSM); colour
 * from the podium's own sand-coloured stone in the King Fahd Road photo
 * (#605040 in dusk shade, drawn as #d9c8ae); windows as one tall panel per
 * ~11 m bay.
 *
 * Doubts: the podium's roof (drums, the mall's metal roof) is drawn flat;
 * no licensed aerial of it was found. The map's terrain here (Mapterhorn z12
 * only) shows a ~30 m hump at the tower, which is a surface artefact; the
 * site is flat, elevation 0.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------- helpers --

export type P2 = [number, number]

/** lng/lat → local metres in a frame turned to `bearing` (local +y points to the bearing). */
export function projector(lng0: number, lat0: number, bearing: number) {
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 110574
  const b = (bearing * Math.PI) / 180
  const xh: P2 = [Math.cos(b), -Math.sin(b)], yh: P2 = [Math.sin(b), Math.cos(b)]
  return (lng: number, lat: number): P2 => {
    const e = (lng - lng0) * kx, n = (lat - lat0) * ky
    return [e * xh[0] + n * xh[1], e * yh[0] + n * yh[1]]
  }
}

export const area2 = (p: P2[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
/** Counter-clockwise from above, closing point dropped. */
export function ccw(p: P2[]): P2[] {
  let q = p.slice()
  if (q.length > 1 && q[0][0] === q[q.length - 1][0] && q[0][1] === q[q.length - 1][1]) q.pop()
  return area2(q) < 0 ? q.reverse() : q
}

/** Ear-clipping triangulation of a simple CCW polygon: index triples. */
export function earcut(p: P2[]): [number, number, number][] {
  const idx = p.map((_, i) => i), out: [number, number, number][] = []
  const crossz = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: P2, a: P2, b: P2, c: P2) => crossz(a, b, q) >= -1e-9 && crossz(b, c, q) >= -1e-9 && crossz(c, a, q) >= -1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = p[i0], b = p[i1], c = p[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(p[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) { idx.splice(0, 1) } // degenerate: drop a point rather than loop
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat horizontal cap over a CCW polygon. */
export function capPoly(part: Part, p: P2[], z: number, up = true) {
  for (const [a, b, c] of earcut(p)) {
    const A: V3 = [p[a][0], p[a][1], z], B: V3 = [p[b][0], p[b][1], z], C: V3 = [p[c][0], p[c][1], z]
    if (up) part.tri(A, B, C); else part.tri(A, C, B)
  }
}

/** Vertical walls round a CCW polygon, split into pieces no longer than `maxLen` (terrain drape). */
export function walls(part: Part, p: P2[], z0: number, z1: number, maxLen = 5) {
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / maxLen))
    for (let k = 0; k < n; k++) {
      const s = k / n, t = (k + 1) / n
      const pa: P2 = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s]
      const pb: P2 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      part.quad([pa[0], pa[1], z0], [pb[0], pb[1], z0], [pb[0], pb[1], z1], [pa[0], pa[1], z1])
    }
  }
}

/** A polygon prism with a top cap. */
export function prism(part: Part, p: P2[], z0: number, z1: number, top: Part = part) {
  walls(part, p, z0, z1)
  capPoly(top, p, z1, true)
}

/** Inset a CCW polygon by d (miter, fine for gentle corners). */
export function inset(p: P2[], d: number): P2[] {
  const n = p.length
  return p.map((c, i) => {
    const a = p[(i + n - 1) % n], b = p[(i + 1) % n]
    const e1 = norm2([c[0] - a[0], c[1] - a[1]]), e2 = norm2([b[0] - c[0], b[1] - c[1]])
    const n1: P2 = [-e1[1], e1[0]], n2: P2 = [-e2[1], e2[0]] // inward (left) normals
    const m = norm2([n1[0] + n2[0], n1[1] + n2[1]])
    const cos = Math.max(0.35, m[0] * n1[0] + m[1] * n1[1])
    return [c[0] + (m[0] * d) / cos, c[1] + (m[1] * d) / cos]
  })
}
export const norm2 = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/**
 * A box in plan centred at (cx, cy), turned by `rot` radians, half-sizes
 * hx, hy, from z0 to z1, with chamfered vertical edges and a bevelled top lip.
 */
export function box(part: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, bev = 0.4, rot = 0, top: Part = part) {
  const c = Math.cos(rot), s = Math.sin(rot)
  const ring = (z: number, i: number): V3[] => {
    const a = hx - i, b = hy - i, e = Math.min(bev, a * 0.5, b * 0.5)
    return ([[-a + e, -b], [a - e, -b], [a, -b + e], [a, b - e], [a - e, b], [-a + e, b], [-a, b - e], [-a, -b + e]] as P2[])
      .map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c, z] as V3)
  }
  const b2 = Math.min(bev, (z1 - z0) / 3)
  const r0 = ring(z0, 0), r1 = ring(z1 - b2, 0), r2 = ring(z1, b2)
  part.loft([r0, r1])
  top.loft([r1, r2])
  top.cap(r2, true)
}

/**
 * Flat panels on a wall segment a→b (outward = right of a→b, CCW polygon),
 * `n` bays between z0 and z1, piers of `pier` between them and `margin` at the ends.
 */
export function panels(part: Part, a: P2, b: P2, z0: number, z1: number, n: number, pier = 1.2, margin = 1.2, off = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = norm2([b[0] - a[0], b[1] - a[1]]), o: P2 = [t[1], -t[0]]
  const w = (L - 2 * margin - (n - 1) * pier) / n
  if (w <= 0.3) return
  for (let k = 0; k < n; k++) {
    const s0 = margin + k * (w + pier), s1 = s0 + w
    const P = (s: number, z: number): V3 => [a[0] + t[0] * s + o[0] * off, a[1] + t[1] * s + o[1] * off, z]
    part.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
  }
}

/** A flat quad wound so its face points along `hint` (flipped if needed). */
export function oq(part: Part, a: V3, b: V3, c: V3, d: V3, hint: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] >= 0) part.quad(a, b, c, d); else part.quad(a, d, c, b)
}
/** A flat triangle wound to face along `hint`. */
export function ot(part: Part, a: V3, b: V3, c: V3, hint: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] >= 0) part.tri(a, b, c); else part.tri(a, c, b)
}

export const triCount = (parts: { part: Part }[]) => parts.reduce((n, { part }) => n + part.triangles, 0)

// ------------------------------------------------------------------ model --

export const KC = { lng: 46.6744106, lat: 24.7113479, bearing: 333.6 }

const PODIUM_LL: P2[] = [
  [46.6746606, 24.7127842], [46.6746507, 24.7126052], [46.6745199, 24.7125446], [46.6744583, 24.7115170],
  [46.6744011, 24.7115053], [46.6743853, 24.7114988], [46.6743222, 24.7114755], [46.6742644, 24.7114456],
  [46.6742197, 24.7114155], [46.6733753, 24.7120096], [46.6732300, 24.7119538], [46.6730850, 24.7120642],
  [46.6730868, 24.7120054], [46.6730228, 24.7119222], [46.6729828, 24.7118298], [46.6729643, 24.7117323],
  [46.6729743, 24.7116317], [46.6730096, 24.7115317], [46.6730653, 24.7114465], [46.6731471, 24.7113687],
  [46.6731452, 24.7112873], [46.6730824, 24.7112873], [46.6730955, 24.7111420], [46.6731181, 24.7110265],
  [46.6731618, 24.7108912], [46.6732285, 24.7107449], [46.6733021, 24.7106266], [46.6734127, 24.7104860],
  [46.6735299, 24.7103669], [46.6735715, 24.7104180], [46.6736163, 24.7103721], [46.6736271, 24.7103033],
  [46.6736384, 24.7102280], [46.6737086, 24.7101112], [46.6738155, 24.7100193], [46.6739268, 24.7099545],
  [46.6740857, 24.7099236], [46.6741679, 24.7098403], [46.6741768, 24.7100319], [46.6743146, 24.7100835],
  [46.6743825, 24.7110725], [46.6744076, 24.7110779], [46.6744560, 24.7110933], [46.6745001, 24.7111079],
  [46.6745180, 24.7111170], [46.6745744, 24.7111449], [46.6745771, 24.7111467], [46.6746276, 24.7111810],
  [46.6746429, 24.7111948], [46.6754857, 24.7105951], [46.6756387, 24.7106603], [46.6757710, 24.7105491],
  [46.6757224, 24.7110686], [46.6754484, 24.7115822], [46.6754707, 24.7116427], [46.6756592, 24.7116219],
  [46.6756612, 24.7117007], [46.6756527, 24.7117756], [46.6756239, 24.7118597], [46.6755789, 24.7119302],
  [46.6755203, 24.7120018], [46.6754349, 24.7120558], [46.6753462, 24.7118759], [46.6752993, 24.7118885],
  [46.6750235, 24.7124308],
]

function build() {
  const proj = projector(KC.lng, KC.lat, KC.bearing)

  const glassP = new Part(), glassTopP = new Part(), trimP = new Part(), darkP = new Part(), stoneP = new Part(), roofP = new Part()
  // The tower is drawn in its footprint's coordinates into its own parts, then
  // warped so its plan shrinks with height (see TAPER_X / TAPER_Y), then merged.
  const tGlass = new Part(), tGlassTop = new Part(), tTrim = new Part(), tDark = new Part(), tRoof = new Part()
  const H = 302, EX = 39.6, EY = 7.3, LX = 36.5, LY = 10, BULGE = 22.4
  const Z_BOT = 203, Z_TOP_IN = 288, X_TOP_IN = 31.5

  // Lens half-depth at x (|x| ≤ LX), and its outward normal on the +y face.
  const lensY = (x: number) => LY + (BULGE - LY) * (1 - (x / LX) ** 2)
  const lensN = (x: number, side: number): V3 => {
    const dy = (BULGE - LY) * (-2 * x) / (LX * LX)
    const l = Math.hypot(dy, 1)
    return [(-dy * side) / l, side / l, 0]
  }
  // The opening's inner edge: half-width at height fraction t (0 at the bottom, 1 under the bridge).
  const uX = (t: number) => X_TOP_IN * Math.sqrt(t)

  // Columns across the lens: dense through the U, coarser in the horns.
  const NU = 20
  const xs = new Set<number>()
  for (let i = 0; i <= NU; i++) { const x = uX(i / NU); xs.add(+x.toFixed(4)); xs.add(+(-x).toFixed(4)) }
  for (let x = X_TOP_IN; x < LX; x += 1.7) { xs.add(+x.toFixed(4)); xs.add(+(-x).toFixed(4)) }
  xs.add(LX); xs.add(-LX)
  const cols = [...xs].sort((a, b) => a - b)
  // Top of the solid at column x: the U edge inside the opening, the roof outside.
  const topAt = (x: number) => {
    const ax = Math.abs(x)
    if (ax >= X_TOP_IN - 1e-6) return H
    // invert uX by bisection
    let lo = 0, hi = 1
    for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (uX(m) < ax) lo = m; else hi = m }
    return Z_BOT + (Z_TOP_IN - Z_BOT) * lo
  }

  // Broad faces (both sides) and the U reveal, column by column.
  const sn = (p: Part, a: V3, b: V3, c: V3, d: V3, na: V3, nb: V3) => {
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nb])
    p.tri(a, c, d, undefined, undefined, undefined, [na, nb, na])
  }
  for (let i = 0; i + 1 < cols.length; i++) {
    const x0 = cols[i], x1 = cols[i + 1], t0 = topAt(x0), t1 = topAt(x1)
    for (const side of [1, -1]) {
      const y0 = lensY(x0) * side, y1 = lensY(x1) * side
      const n0 = lensN(x0, side), n1 = lensN(x1, side)
      // split vertically into bands so the faces drape and shade evenly
      const zb = Math.min(t0, t1)
      const bands = [0, 40, 80, 120, 160, 200].filter((z) => z < zb).concat([zb])
      for (let k = 0; k + 1 < bands.length; k++)
        sn(bands[k] >= 200 ? tGlassTop : tGlass, [x0, y0, bands[k]], [x1, y1, bands[k]], [x1, y1, bands[k + 1]], [x0, y0, bands[k + 1]], n0, n1)
      // the sloped remainder up to the U edge
      if (Math.abs(t0 - t1) > 1e-6) {
        const hi: V3 = t1 > t0 ? [x1, y1, t1] : [x0, y0, t0], nh = t1 > t0 ? n1 : n0
        tGlassTop.tri([x0, y0, zb], [x1, y1, zb], hi, undefined, undefined, undefined, [n0, n1, nh])
      }
    }
    // The reveal / roof over this column: from the -y face to the +y face.
    const ya0 = lensY(x0), ya1 = lensY(x1)
    const inU = Math.abs(x0) < X_TOP_IN - 1e-6 || Math.abs(x1) < X_TOP_IN - 1e-6
    const tgt = inU ? tTrim : tRoof
    oq(tgt, [x0, -ya0, t0], [x0, ya0, t0], [x1, ya1, t1], [x1, -ya1, t1], [0, 0, 1])
  }
  // Inner faces of the horns where the opening meets the bridge (x = ±X_TOP_IN, 288–302).
  for (const s of [1, -1]) {
    const x = s * X_TOP_IN, y = lensY(x)
    const a: V3 = [x, -y, Z_TOP_IN], b: V3 = [x, y, Z_TOP_IN], c: V3 = [x, y, H], d: V3 = [x, -y, H]
    oq(tTrim, a, b, c, d, [-s, 0, 0])
  }

  // End faces and their chamfers, full height, and the horn-end roofs.
  for (const s of [1, -1]) {
    const ring: P2[] = [[s * LX, -LY * s], [s * EX, -EY * s], [s * EX, EY * s], [s * LX, LY * s]]
    for (let i = 0; i < 3; i++) {
      const a = ring[i], b = ring[i + 1]
      for (const [za, zb] of [[0, 100], [100, 200], [200, H]]) oq(za >= 200 ? tGlassTop : tGlass, [a[0], a[1], za], [b[0], b[1], za], [b[0], b[1], zb], [a[0], a[1], zb], [s, 0, 0])
    }
    capPoly(tRoof, ccw(ring), H)
  }

  // White rim round the opening on both broad faces (1.4 m wide, flush).
  {
    const RIM = 2.2, N = 28
    const edge: [number, number][] = [] // (x, z) along the U from the left top corner to the right
    for (let i = N; i >= 0; i--) { const t = i / N; edge.push([-uX(t), Z_BOT + (Z_TOP_IN - Z_BOT) * t]) }
    for (let i = 1; i <= N; i++) { const t = i / N; edge.push([uX(t), Z_BOT + (Z_TOP_IN - Z_BOT) * t]) }
    // offset outwards (into the solid) in the elevation plane
    const off = edge.map(([x, z], i) => {
      const p = edge[Math.max(0, i - 1)], q = edge[Math.min(edge.length - 1, i + 1)]
      const tx = q[0] - p[0], tz = q[1] - p[1], l = Math.hypot(tx, tz)
      return [x + (tz / l) * RIM, z - (tx / l) * RIM] as [number, number]
    })
    for (const side of [1, -1]) {
      for (let i = 0; i + 1 < edge.length; i++) {
        const P = ([x, z]: [number, number]): V3 => { const y = (lensY(x) + 0.06) * side; return [x, y, z] }
        const a = P(edge[i]), b = P(edge[i + 1]), c = P(off[i + 1]), d = P(off[i])
        oq(tTrim, a, b, c, d, [0, side, 0])
      }
    }
  }

  // The top beam: white, the dark glazed sky bridge, white, between the horns.
  {
    const BY = 7.5
    const seg = (p: Part, z0: number, z1: number, y: number) => {
      const x0 = -X_TOP_IN, x1 = X_TOP_IN
      oq(p, [x0, -y, z0], [x1, -y, z0], [x1, -y, z1], [x0, -y, z1], [0, -1, 0])
      oq(p, [x1, y, z0], [x0, y, z0], [x0, y, z1], [x1, y, z1], [0, 1, 0])
    }
    seg(tTrim, Z_TOP_IN, 292.5, BY)
    seg(tDark, 292.5, 297, BY - 0.4)
    seg(tTrim, 297, H, BY)
    // ledges where the glazing steps back, the underside and the roof
    const x0 = -X_TOP_IN, x1 = X_TOP_IN
    oq(tTrim, [x0, -BY, 292.5], [x1, -BY, 292.5], [x1, -BY + 0.4, 292.5], [x0, -BY + 0.4, 292.5], [0, 0, 1])
    oq(tTrim, [x1, BY, 292.5], [x0, BY, 292.5], [x0, BY - 0.4, 292.5], [x1, BY - 0.4, 292.5], [0, 0, 1])
    oq(tTrim, [x0, -BY + 0.4, 297], [x1, -BY + 0.4, 297], [x1, -BY, 297], [x0, -BY, 297], [0, 0, -1])
    oq(tTrim, [x1, BY - 0.4, 297], [x0, BY - 0.4, 297], [x0, BY, 297], [x1, BY, 297], [0, 0, -1])
    oq(tTrim, [x0, BY, Z_TOP_IN], [x1, BY, Z_TOP_IN], [x1, -BY, Z_TOP_IN], [x0, -BY, Z_TOP_IN], [0, 0, -1])
    oq(tRoof, [x0, -BY, H], [x1, -BY, H], [x1, BY, H], [x0, BY, H], [0, 0, 1])
  }


  // Warp the tower: the plan narrows with height. Lengthwise to 0.85 of the
  // base at the top (TAPER_X), across the lens to 0.7 (TAPER_Y). Part stores
  // glTF positions (x, z, -y), so x is index 0 and the map's y is -index 2.
  const TAPER_X = 0.15, TAPER_Y = 0.3
  for (const p of [tGlass, tGlassTop, tTrim, tDark, tRoof]) {
    for (let i = 0; i < p.pos.length; i += 3) {
      const t = p.pos[i + 1] / H
      p.pos[i] *= 1 - TAPER_X * t
      p.pos[i + 2] *= 1 - TAPER_Y * t
    }
  }
  const merge = (into: Part, from: Part) => { into.pos.push(...from.pos); into.nrm.push(...from.nrm); into.uv.push(...from.uv) }
  merge(glassP, tGlass); merge(glassTopP, tGlassTop); merge(trimP, tTrim); merge(darkP, tDark); merge(roofP, tRoof)

  // ---- Podium: the mall and hotel wings, 16 m, cut round the tower. ----
  const pod = ccw(PODIUM_LL.map(([lo, la]) => proj(lo, la)))
  const PH = 16
  walls(stoneP, pod, 0, PH)
  // a pale parapet band and the roof
  const podIn = inset(pod, 0.6)
  capPoly(roofP, podIn, PH - 0.5)
  for (let i = 0; i < pod.length; i++) {
    const a = pod[i], b = pod[(i + 1) % pod.length], ai = podIn[i], bi = podIn[(i + 1) % pod.length]
    oq(trimP, [a[0], a[1], PH], [b[0], b[1], PH], [bi[0], bi[1], PH], [ai[0], ai[1], PH], [0, 0, 1]) // parapet top
    const tin = norm2([b[0] - a[0], b[1] - a[1]])
    oq(stoneP, [bi[0], bi[1], PH - 0.5], [ai[0], ai[1], PH - 0.5], [ai[0], ai[1], PH], [bi[0], bi[1], PH], [-tin[1], tin[0], 0]) // parapet inner face
    // window panels: grouped across the upper storeys, ~11 m bays
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // skip the short walls that run against the tower
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    if (Math.abs(mx) < 42 && Math.abs(my) < 26) continue
    if (L < 4) continue
    // one tall panel per bay over the upper floors, wall showing between as piers
    const n = Math.max(1, Math.round(L / 11))
    panels(darkP, a, b, 4.0, 13.2, n, 2.4, 1.6)
  }

  const parts = [
    { part: glassP, material: { ...PALETTE.glass, color: 0xaabdcb, roughness: 0.3 } },
    { part: glassTopP, material: { name: 'glass-2', color: 0xb9c8d4, roughness: 0.3 } },
    { part: trimP, material: { ...finish('aluminium-white', 0xeef0ee), floodlight: (p: V3, n: V3) => (p[2] > 190 ? 1 : 0) } },
    { part: darkP, material: PALETTE.window },
    { part: stoneP, material: finish('podium-stone', 0xd9c8ae) },
    { part: roofP, material: PALETTE.roof },
  ]
  return { parts, height: H }
}

if (import.meta.main) {
  const { parts, height } = build()
  const triangles = triCount(parts)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Kingdom Centre', parts, {
    license: 'CC0-1.0', bearing: KC.bearing, elevation: 0, anchor: [KC.lat, KC.lng], height,
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    replaces: ['way/264745922', 'way/264745924', 'way/264745925', 'way/984443070', 'way/264745917'],
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/riyadh-kingdom-centre.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
