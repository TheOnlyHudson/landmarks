/**
 * Dr Chau Chak Wing Building (UTS Business School), Ultimo, Sydney:
 * procedural, CC0-1.0.
 * bun generators/sydney-uts-chau-chak-wing.ts
 *
 * Map frame: x across the building towards the Goods Line (compass 68.4),
 * y along it (compass 338.4, towards Ultimo Road), z up, metres; the
 * catalog bearing is 338.4. Origin at the OSM outline's area centroid
 * (way/337700228, 151.201293, -33.8809072); y = 0 at ground level.
 *
 * Frank Gehry (Gehry Partners), completed November 2014: brick "squashed
 * paper bag" volumes of different heights in 320,000 custom bricks, their
 * walls bulging, folding and rolling, with square projecting windows; the
 * west side is a curtain of tilted, shattered glass planes; vertical glass
 * slots join the brick volumes.
 *
 * Published: 12 floors (Wikipedia infobox; "13-storey tower" in its text),
 * 16,030 m2, 320,000 bricks (Wikipedia, UTS). No published height.
 * OSM: the outline way/337700228 (building=university, 12 levels). Plans
 * are OSM's; the split into volumes is from the photos.
 *
 * Volumes (estimated from photos, 3.6 m storeys counted on v4, v1):
 * - east range along the Goods Line, 4 storeys to 15 m (v4: the low band
 *   in front of the tall block, full length);
 * - the tall block behind it, 11 storeys, its curved top rising from 39 m
 *   (south) to 43 m (north) (v1, v4), its east wall with two deep vertical
 *   folds and a bulging roll overhanging the east range (v4, u021);
 * - the north block on Ultimo Road, 10 storeys to about 38 m, rounded at
 *   its north-east corner, its top leaning (v1, v4), behind the east range;
 * - the south block, 7 storeys to 26 m, rippled all over (u021, v5);
 * - the west glass curtain, faceted planes to 36 m (u024, g6);
 * - the rooftop plant screen, low and grey, to 44.2 m (v4).
 * The brick waves are real geometry: every brick wall is a displaced
 * surface (lead review round 2: three drapes on the tall block's east face sag
 * out up to 7 m at mid-height and tuck back at the top, between two folds
 * 4.5 m deep; a 3 m rolled overhang above the east range, whose own
 * parapet rolls out 2.6 m; the roof lines undulate +-1.5 m; ripples 1.5 m), and each window lies in the local
 * plane of the bent wall, tilted with it, not a texture.
 * Windows: square, about 2.1 m, projecting on steel frames (v1, v4).
 * Estimated: every height (storey counts times 3.6 m), the volumes' extents
 * in plan, the waves' placement and amplitude (by eye from v4, v5, u021).
 * Left out: the brick relief dots, the interior stairs, louvres.
 *
 * Colours (sampled): sunlit brick #bea271, #aa9774 (v4) -> 0xcdb28a sandy golden-beige (lead review: sunlit ~#cdb28a)
 * brown brick; windows reflect blue -> window 0x5d7c99; the glass curtain
 * window-2 0x86a7c0; window frames pale steel -> trim; roofs roof.
 *
 * LODs: the low model samples the brick surfaces every 2.6 m (12 rings)
 * with flat window panes; the detail model every 1.2 m (22 rings), each
 * window in a steel frame box standing proud of the wall, and mullions on
 * the glass facets.
 *
 * Night: windows and the glass curtain are lit (window, window-2).
 *
 * Photos (Wikimedia Commons; all evidence):
 * - v1 "Dr Chau Chak Wing Building from The Goods Line (27438092220).jpg", Rob Deutscher, CC BY 2.0 (north-east)
 * - v3 "Dr Chau Chak Wing Building 7906.jpg", Summerdrought, CC BY-SA 4.0 (east, from below)
 * - v4 "Dr. Chau Chak Wing Building, University of Technology Sydney.jpg", Brickworks Limited, CC BY-SA 2.0 (east, elevated)
 * - v5 "Warped 2 ( In Explore) - Flickr - bobarcpics.jpg", Rob Deutscher, CC BY 2.0 (brick waves)
 * - u021 "Dr Chau Chak Wing building 021.jpg", Sardaka, CC0 (rolled brick wall)
 * - u024 "Dr Chau Chak Wing building 024.jpg", Sardaka, CC0 (shattered glass facade)
 * - g6 "Frank Gehry's Dr Chau Chak Wing Building (6).jpg", Hpeterswald, CC BY-SA 4.0 (glass and brick)
 * No look-only references.
 *
 * Doubts: no photo from above or from the west at a distance, so the
 * volumes' plan split and heights are estimates; the glass curtain's
 * facets are drawn in the spirit of u024, not plane by plane.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { polyTris } from './berlin-oberbaum-bridge'
import { face, prism, saveLods, type Layer, type XY } from './sydney-tower-eye'

type Set = { brick: Part; win: Part; glass: Part; trim: Part; roof: Part }
const mk = (): Set => ({ brick: new Part(), win: new Part(), glass: new Part(), trim: new Part(), roof: new Part() })
const low = mk(), det = mk()

/** A rounded rectangle path, counter-clockwise, corners of radius r. */
function rr(x0: number, y0: number, x1: number, y1: number, r: number, seg = 3): XY[] {
  const out: XY[] = []
  const cs: [number, number, number][] = [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]]
  for (const [cx, cy, a0] of cs) for (let i = 0; i <= seg; i++) { const t = a0 + (i / seg) * (Math.PI / 2); out.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]) }
  return out
}

/** Resample a closed path at about `step` metres, keeping its corners; returns points and arc lengths. */
function resample(path: XY[], step: number): { p: XY[]; s: number[]; L: number } {
  const p: XY[] = [], s: number[] = []
  let acc = 0
  for (let i = 0; i < path.length; i++) {
    const a = path[i], b = path[(i + 1) % path.length]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(l / step))
    for (let k = 0; k < n; k++) { p.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]); s.push(acc + (l * k) / n) }
    acc += l
  }
  return { p, s, L: acc }
}

type Wave = (s: number, z: number, n: XY, q: XY) => number
type Vol = { path: XY[]; z0: number; top: (q: XY) => number; wave: Wave; res?: [number, number, number, number]; wins?: { from: number; storey: number; bay: number; skip?: (s: number, q: XY, n: XY) => boolean } }

/**
 * A brick volume whose walls are a displaced surface: each wall point moves
 * along its plan normal by wave(s, z). Smooth normals from the surface.
 * Square windows sit on the wall, on frames standing proud of it.
 */
function volume(s: Set, d: boolean, v: Vol) {
  // mesh density: [low step, low rings, detail step, detail rings]
  const R = v.res ?? [2.6, 10, 1.2, 22]
  const { p, s: arc } = resample(v.path, d ? R[2] : R[0])
  const n = p.length, K = d ? R[3] : R[1]
  const nrm: XY[] = p.map((_, i) => {
    const a = p[(i + n - 1) % n], b = p[(i + 1) % n]
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1
    return [ty / l, -tx / l]
  })
  const zAt = (i: number, k: number) => { const zt = v.top(p[i]); return v.z0 + ((zt - v.z0) * k) / K }
  const P = (i: number, k: number): V3 => {
    const z = zAt(i, k), w = v.wave(arc[i], z, nrm[i], p[i])
    return [p[i][0] + nrm[i][0] * w, p[i][1] + nrm[i][1] * w, z]
  }
  const G: V3[][] = []
  for (let k = 0; k <= K; k++) G.push(Array.from({ length: n }, (_, i) => P(i, k)))
  const N = (i: number, k: number): V3 => {
    const a = G[k][(i + n - 1) % n], b = G[k][(i + 1) % n], c = G[Math.max(0, k - 1)][i], e = G[Math.min(K, k + 1)][i]
    const t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], u: V3 = [e[0] - c[0], e[1] - c[1], e[2] - c[2]]
    const x: V3 = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]]
    const l = Math.hypot(...x) || 1
    return [x[0] / l, x[1] / l, x[2] / l]
  }
  for (let k = 0; k < K; k++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      s.brick.tri(G[k][i], G[k][j], G[k + 1][j], undefined, undefined, undefined, [N(i, k), N(j, k), N(j, k + 1)])
      s.brick.tri(G[k][i], G[k + 1][j], G[k + 1][i], undefined, undefined, undefined, [N(i, k), N(j, k + 1), N(i, k + 1)])
    }
  // the roof: a parapet lip and a flat (tilted) roof over the top ring
  const T = G[K]
  for (const [a, b, c] of polyTris(T.map((q) => [q[0], q[1]] as XY))) {
    const zz = (q: XY) => { let best = 0, bd = 1e9; T.forEach((t, i) => { const dd = Math.hypot(t[0] - q[0], t[1] - q[1]); if (dd < bd) { bd = dd; best = i } }); return T[best][2] - 0.6 }
    face(s.roof, [[a[0], a[1], zz(a)], [b[0], b[1], zz(b)], [c[0], c[1], zz(c)]], [0, 0, 1])
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = T[i], b = T[j]
    const ai: V3 = [a[0] - nrm[i][0] * 0.4, a[1] - nrm[i][1] * 0.4, a[2]], bi: V3 = [b[0] - nrm[j][0] * 0.4, b[1] - nrm[j][1] * 0.4, b[2]]
    face(s.brick, [a, b, bi, ai], [0, 0, 1])
    face(s.brick, [ai, bi, [bi[0], bi[1], bi[2] - 0.6], [ai[0], ai[1], ai[2] - 0.6]], [-(nrm[i][0] + nrm[j][0]) / 2, -(nrm[i][1] + nrm[j][1]) / 2, 0])
  }
  // windows: square, on a bay grid along the wall, one per storey
  if (!v.wins) return
  const W = v.wins
  const { p: wp, s: ws } = resample(v.path, W.bay)
  const m = wp.length
  for (let i = 0; i < m; i++) {
    const a = wp[(i + m - 1) % m], b = wp[(i + 1) % m]
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1
    const nn: XY = [ty / l, -tx / l], tt: XY = [tx / l, ty / l]
    // skip window spots near corners (where the path turns)
    const a2 = wp[i], b2 = wp[(i + 1) % m], c2 = wp[(i + m - 1) % m]
    const turn = Math.abs((b2[0] - a2[0]) * (a2[1] - c2[1]) - (b2[1] - a2[1]) * (a2[0] - c2[0])) / ((Math.hypot(b2[0] - a2[0], b2[1] - a2[1]) * Math.hypot(a2[0] - c2[0], a2[1] - c2[1])) || 1)
    if (turn > 0.3) continue
    if (W.skip?.(ws[i], wp[i], nn)) continue
    for (let z = W.from; z + 2.6 < v.top(wp[i]) - 1.0; z += W.storey) {
      const zc = z + 1.6, h = 1.05
      // the wall's displacement here and its local surface frame: each window lies in the bent wall (tilted with it)
      const w0 = v.wave(ws[i], zc, nn, wp[i])
      const dws = (v.wave(ws[i] + 0.6, zc, nn, wp[i]) - v.wave(ws[i] - 0.6, zc, nn, wp[i])) / 1.2
      const dwz = (v.wave(ws[i], zc + 0.6, nn, wp[i]) - v.wave(ws[i], zc - 0.6, nn, wp[i])) / 1.2
      const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
      const U = unit([tt[0] + nn[0] * dws, tt[1] + nn[1] * dws, 0])
      const Dz: V3 = [nn[0] * dwz, nn[1] * dwz, 1]
      const N = unit([U[1] * Dz[2] - U[2] * Dz[1], U[2] * Dz[0] - U[0] * Dz[2], U[0] * Dz[1] - U[1] * Dz[0]])
      const V = unit([N[1] * U[2] - N[2] * U[1], N[2] * U[0] - N[0] * U[2], N[0] * U[1] - N[1] * U[0]])
      // stand the pane proud enough to clear the curved wall under its corners
      let out = 0.3
      for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const wc = v.wave(ws[i] + a * h, zc + b * h, nn, wp[i]) - (w0 + dws * a * h + dwz * b * h)
        out = Math.max(out, 0.3 + wc)
      }
      const c: V3 = [wp[i][0] + nn[0] * w0 + N[0] * out, wp[i][1] + nn[1] * w0 + N[1] * out, zc + N[2] * out]
      const q = (u: number, vv: number): V3 => [c[0] + (U[0] * u + V[0] * vv) * h, c[1] + (U[1] * u + V[1] * vv) * h, c[2] + (U[2] * u + V[2] * vv) * h]
      face(s.win, [q(-1, -1), q(1, -1), q(1, 1), q(-1, 1)], N)
      if (d) {
        // the steel frame: a box rim round the pane, back to the wall
        const back = -(out + 0.1)
        const qb = (u: number, vv: number, o: number): V3 => { const t = q(u, vv); return [t[0] + N[0] * o, t[1] + N[1] * o, t[2] + N[2] * o] }
        const corners: [number, number][] = [[-1.12, -1.12], [1.12, -1.12], [1.12, 1.12], [-1.12, 1.12]]
        for (let e = 0; e < 4; e++) {
          const [u0, v0] = corners[e], [u1, v1] = corners[(e + 1) % 4]
          const mu = (u0 + u1) / 2, mv = (v0 + v1) / 2
          const mid: V3 = [U[0] * mu + V[0] * mv, U[1] * mu + V[1] * mv, U[2] * mu + V[2] * mv]
          face(s.trim, [qb(u0, v0, 0.02), qb(u1, v1, 0.02), qb(u1, v1, back), qb(u0, v0, back)], mid)
          face(s.trim, [qb(u0, v0, 0.02), qb(u1, v1, 0.02), qb(u1 * 0.93, v1 * 0.93, 0.02), qb(u0 * 0.93, v0 * 0.93, 0.02)], N)
        }
      }
    }
  }
}

const g = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2))

// ---- Volumes (plan in the frame; OSM outline x -21..18.5, y -33..34) -------------------------------------------

const VOLS: Vol[] = [
  // east range on the Goods Line: 4 storeys, gentle ripples, a roll at its parapet
  {
    path: rr(8.5, -31, 18.2, 31.5, 2.5), z0: 0, top: (q) => 15 + 0.8 * Math.sin(q[1] / 4.5), res: [2.4, 8, 1.1, 18],
    // ripples, and the parapet rolled out into a clear bulging overhang (v4)
    wave: (s, z) => 1.1 * Math.sin(s / 5.5 + z / 6) * g(z, 7, 6) + 2.6 * g(z, 13.4, 1.5) * (0.75 + 0.25 * Math.sin(s / 6)),
    wins: { from: 0.6, storey: 3.7, bay: 3.8, skip: (_s, q, n) => n[0] < -0.5 && q[0] < 9.5 },
  },
  // the tall block: 11 storeys, two deep vertical folds and a bulging roll over the east range
  {
    path: rr(-8, -24, 11.5, 20, 4), z0: 0, res: [1.7, 15, 0.9, 30],
    // the roof line rises north and undulates +-1.5 m along the facade (v4)
    top: (q) => 39 + (4 * (q[1] + 24)) / 44 + 1.5 * Math.sin(q[1] / 5 + 0.7) + 0.8 * Math.sin(q[0] / 4),
    wave: (s, z, n, q) => {
      const east = Math.max(0, n[0])
      // two deep folds between three big drapes; the drapes sag out up to 7 m at mid-height and tuck back at the top
      const folds = -4.5 * (g(q[1], -6, 2.4) + g(q[1], 8.5, 2.2)) * east * (0.35 + 0.65 * g(z, 28, 14))
      const t = Math.max(0, Math.min(1, (z - 15) / 26)), sag = Math.sin(Math.PI * t) ** 1.2
      const drape = 7.0 * (g(q[1], -15, 4.2) + g(q[1], 1.2, 3.6) + g(q[1], 15, 3.2)) * east * sag - 1.0 * east * g(z, 41, 2.5)
      const roll = 3.0 * g(z, 17.5, 2.0) * east + drape // the rolled overhang above the east range
      const ripple = 1.5 * Math.sin(s / 5.0 + z / 6.0) * Math.sin(z / 10 + s / 13)
      return folds + roll + ripple + 1.2 * g(z, 41, 2.4)
    },
    wins: { from: 15.8, storey: 3.6, bay: 3.4, skip: (_s, q, n) => n[0] < -0.5 || (Math.abs(q[1] + 6) < 1.8 || Math.abs(q[1] - 9) < 1.8) },
  },
  // north block on Ultimo Road: 9 storeys, a leaning top, rounded at its north-east corner
  {
    path: rr(-1.0, 18.5, 11.8, 33.8, 5), z0: 0, top: (q) => 38.5 - 0.25 * (q[0] - 5) + 0.6 * Math.cos(q[1] / 3),
    wave: (s, z) => 1.3 * Math.sin(s / 6 + z / 8) * Math.sin(z / 11 + 0.5) + 1.6 * g(z, 33, 2.6),
    wins: { from: 0.8, storey: 3.6, bay: 3.6, skip: (_s, q, n) => n[0] < -0.6 && q[0] < 0 },
  },
  // the south block: 7 storeys, rippled all over (u021)
  {
    path: rr(-16.5, -32.5, 8.8, -22.5, 4), z0: 0, top: (q) => 26 + 0.8 * Math.sin(q[0] / 3.5),
    wave: (s, z) => 1.8 * Math.sin(s / 4.2 + z / 5) * Math.sin(z / 7) + 2.0 * g(z, 24, 1.8) + 1.5 * g(z, 12, 1.8),
    wins: { from: 0.8, storey: 3.6, bay: 3.5 },
  },
]

/** The west curtain of shattered glass: tilted triangular facets between a jagged outer line and the volumes. */
function glassCurtain(s: Set, d: boolean) {
  const ys = [-22.5, -14, -5, 4, 12, 19.5]
  const xs = [-17.2, -18.8, -17.5, -20.6, -20.4, -19.8] // the OSM west edge, sampled
  const zs = d ? [0, 6, 12, 18, 24, 30, 36] : [0, 12, 24, 36]
  // jagged offsets per node (fixed pseudo-random, up to 1.4 m), so the planes tilt like u024's
  const jig = (i: number, k: number) => (k === 0 ? 0 : ((i + k) % 2 ? -2.0 : 1.2) + 1.4 * Math.sin(i * 12.9898 + k * 78.233) * Math.sin(i * 3.1 + k * 1.7))
  const node = (i: number, k: number): V3 => [xs[i] + jig(i, k), ys[i], zs[k] + (k === zs.length - 1 ? 2.0 * Math.sin(i * 1.3) : 0)]
  for (let k = 0; k < zs.length - 1; k++)
    for (let i = 0; i < ys.length - 1; i++) {
      const a = node(i, k), b = node(i + 1, k), c = node(i + 1, k + 1), e = node(i, k + 1)
      // outward is -x; split each cell along alternating diagonals
      if ((i + k) % 2) { face(s.glass, [a, b, c], [-1, 0, 0]); face(s.glass, [a, c, e], [-1, 0, 0]) } else { face(s.glass, [a, b, e], [-1, 0, 0]); face(s.glass, [b, c, e], [-1, 0, 0]) }
    }
  // its frame lines (mullions on the facet edges) in the detail model
  for (let k = 0; k < zs.length; k++) for (let i = 0; i < ys.length - 1; i++) {
    const a = node(i, k), b = node(i + 1, k)
    face(s.trim, [[a[0] - 0.05, a[1], Math.max(0, a[2] - 0.12)], [b[0] - 0.05, b[1], Math.max(0, b[2] - 0.12)], [b[0] - 0.05, b[1], b[2] + 0.12], [a[0] - 0.05, a[1], a[2] + 0.12]], [-1, 0, 0])
  }
  for (let i = 0; i < ys.length; i++) for (let k = 0; k < zs.length - 1; k++) {
    const a = node(i, k), b = node(i, k + 1)
    face(s.trim, [[a[0] - 0.06, a[1] - 0.15, a[2]], [a[0] - 0.06, a[1] + 0.15, a[2]], [b[0] - 0.06, b[1] + 0.15, b[2]], [b[0] - 0.06, b[1] - 0.15, b[2]]], [-1, 0, 0])
  }
  // the volume behind the glass, to the tall block (its top and ends)
  const top = zs[zs.length - 1]
  const back: XY[] = [[-8, -22.5], [-8, 19.5]]
  const ring: XY[] = [...ys.map((y, i) => [xs[i] + 0.6, y] as XY).reverse(), ...back]
  // flat roof over the curtain block at its lowest top
  for (const [a, b, c] of polyTris(ring)) face(s.roof, [[a[0], a[1], top - 0.3], [b[0], b[1], top - 0.3], [c[0], c[1], top - 0.3]], [0, 0, 1])
  // end walls (glass) at the south and north
  const sN = node(0, 0), nN = node(ys.length - 1, 0)
  face(s.glass, [[sN[0], sN[1], 0], [-8, sN[1], 0], [-8, sN[1], top], [node(0, zs.length - 1)[0], sN[1], top]], [0, -1, 0])
  face(s.glass, [[nN[0], nN[1], 0], [nN[0], nN[1], top], [-8, nN[1], top], [-8, nN[1], 0]], [0, 1, 0])
  // the jagged top edge: close the gap between the facets' top and the roof
  for (let i = 0; i < ys.length - 1; i++) {
    const a = node(i, zs.length - 1), b = node(i + 1, zs.length - 1)
    face(s.glass, [a, b, [b[0] + 0.6, b[1], top - 0.3], [a[0] + 0.6, a[1], top - 0.3]], [0, 0, 1])
  }
}

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  for (const v of VOLS) volume(s, d, v)
  glassCurtain(s, d)
  // the vertical glass slot between the tall and north blocks (v1)
  prism(s.glass, [[9.5, 19.0], [11.6, 19.0], [11.6, 21.5], [9.5, 21.5]], 15, 39, { top: true })
  // the rooftop plant screen (v4): a pale louvred box
  prism(s.roof, [[-3, -10], [7, -10], [7, 4], [-3, 4]], 40, 44.2, { top: true })
  // the main entrance on Ultimo Road (u006): a tall glass portal in the north notch
  prism(s.glass, [[-4.2, 18.6], [-1.0, 19.6], [-1.0, 32.1], [-4.6, 25.3]], 0, 12, { top: true })
}

// ---- Materials and output --------------------------------------------------------------------------------
const BRICK: MaterialSpec = finish('sandstock-brick', 0xcdb28a)
const WIN: MaterialSpec = { ...PALETTE.window, color: 0x5d7c99 }
const GL: MaterialSpec = windowVariant(2, 0x86a7c0)
const layers = (s: Set): Layer[] => [
  { part: s.brick, material: BRICK },
  { part: s.win, material: WIN },
  { part: s.glass, material: GL },
  { part: s.trim, material: PALETTE.trim },
  { part: s.roof, material: PALETTE.roof },
]

if (import.meta.main) {
  await saveLods('sydney-uts-chau-chak-wing', 'Dr Chau Chak Wing Building', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, ground level', bearing: 338.4,
  }, 6500)
}
