/**
 * Greyshot Arch, Central Park, near West 61st Street (Calvert Vaux and
 * Jacob Wrey Mould, 1860–62) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-greyshot-arch.ts
 *
 * This file also exports the arch kit used by the other Central Park drive
 * arches (`archBlock`, `profile`, `band`, `qn`, `box`, `post`, …); its own
 * build runs only when it is the main module.
 *
 * Frame (mesh.ts map frame): x along West Drive (bearing 17.8°, NNE), y along
 * the footpath through the arch (bearing 287.8°, WNW: the placement's
 * bearing), z up, metres. z = 0 is the footpath under the arch, the lowest
 * ground under the footprint. Anchor: the centroid of OSM way/385446613
 * (man_made=bridge, bridge:structure=arch, "Greyshot Arch"), which the model
 * draws across in full and so replaces.
 *
 * Evidence
 * - OSM (ODbL): outline way/385446613, a parallelogram 19.6 m along the
 *   drive by 19.4 m along the path (portal face to portal face); West Drive
 *   bridge segment way/648888156 (width 10), the footway on the bridge
 *   way/385446612 and the path under it way/385444825 (bearing 287.9°).
 * - Map terrain (Mapterhorn z15, `bun tools/terrain.ts grid`, bearing 288):
 *   the path at both portals at 0, the drive's plateau 4.0–4.3 m above it.
 *   USGS lidar NY_NewYorkCity (2017 flight), ground returns: path at the east
 *   portal 0.3 m, the drive 4.4–4.6 m (both above ground_min). The model
 *   takes the roadway at 4.3 m; its masonry infill stops at 4.0 m (0.3 m
 *   under the roadway, which the map draws), and the parapets stand on the
 *   faces, so nothing is drawn at road level across the drive.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-greyshot-arch/photos):
 *   Jim.henderson, "Greyshot arch W62 east CP cloudy jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Greyshot_arch_W62_east_CP_cloudy_jeh.jpg
 *     (the east face, square on: arch, pilasters, scroll consoles, urns,
 *     balustrade; used for every proportion below);
 *   Jim.henderson, "Greyshot arch W62 west jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Greyshot_arch_W62_west_jeh.jpg
 *     (the west face: the same arch and balustrade, red brick soffit);
 *   Jim.henderson, "61st St arch Central Park jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:61st_St_arch_Central_Park_jeh.jpg
 *     (a three-quarter view: the wing walls and the balustrade running on
 *     over them).
 * - Estimated from the east photo, scaled to the 4.3 m from the path to the
 *   roadway: span 9.6 m, a flattened (elliptical) arch springing 0.6 m above
 *   the path with its crown at 3.2 m; sandstone archivolt 0.4 m deep;
 *   pilasters 0.8 m wide whose inner edges are 5.6 m from the centre line;
 *   cornice 0.3 m; pierced balustrade 0.85 m (review: the parapet band
 *   is about a fifth of the face's height in the photo) with pedestals over the
 *   pilasters and two between them, urn finials on the pilaster pedestals;
 *   scroll consoles 2.5 m tall at the feet of the pilasters, each ending in
 *   a small urn. The wing walls run on in the plane of the face to the ends
 *   of the OSM outline, where the embankment takes them.
 * - Published (Central Park Conservancy; NYC Parks): built 1860–62 to
 *   designs by Vaux and Mould; grey stone with sandstone trim and carved
 *   panels.
 *
 * Simplified: the balustrade's pierced quatrefoils are drawn as a row of dark
 * openings in a sandstone panel; the carved spandrel panels and the face's
 * diagonal coursing are left out.
 *
 * Doubts: the photos give proportions, not dimensions; the span rests on
 * the terrain's 4.3 m drive height. The west face is drawn as a mirror of
 * the east one (the west photo agrees); the lidar's east portal falls about
 * 2 m inside OSM's outline edge, and OSM was kept.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'

// ===========================================================================
// The arch kit
// ===========================================================================

/** A quad wound to face n. */
export function qn(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.quad(a, b, c, d); else p.quad(d, c, b, a)
}

/** An axis-aligned box, its bottom left open (it stands on something). */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  qn(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  qn(p, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0])
  qn(p, [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [-1, 0, 0])
  qn(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  qn(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  if (bottom) qn(p, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1])
}

/** A box with chamfered top edges (a bevelled cap or plinth). */
export function bevelBox(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, bev: number) {
  const zb = z1 - bev
  box(p, cx - hx, cx + hx, cy - hy, cy + hy, z0, zb)
  const lo: V3[] = [[cx - hx, cy - hy, zb], [cx + hx, cy - hy, zb], [cx + hx, cy + hy, zb], [cx - hx, cy + hy, zb]]
  const ix = Math.max(hx - bev, 0.02), iy = Math.max(hy - bev, 0.02)
  const hi: V3[] = [[cx - ix, cy - iy, z1], [cx + ix, cy - iy, z1], [cx + ix, cy + iy, z1], [cx - ix, cy + iy, z1]]
  p.loft([lo, hi])
  p.cap(hi, true)
}

/** A lathe-turned finial or urn: (radius, z) pairs from the foot up, n sides. */
export function urn(p: Part, cx: number, cy: number, prof: [number, number][], n = 8) {
  const rings = prof.map(([r, z]) => Array.from({ length: n }, (_, k): V3 => [cx + r * Math.cos((2 * k * Math.PI) / n + Math.PI / n), cy + r * Math.sin((2 * k * Math.PI) / n + Math.PI / n), z]))
  p.loft(rings)
  p.cap(rings[rings.length - 1], true)
}

/**
 * An arch's intrados from x = −a to +a: [x, z] points. `kind` 'ellipse' is
 * a semi-ellipse (a semicircle when rise = a); 'segment' a circular segment
 * of the given rise. Springing at z = spring.
 */
export function profile(kind: 'ellipse' | 'segment', a: number, rise: number, spring: number, n = 16): [number, number][] {
  const pts: [number, number][] = []
  if (kind === 'ellipse') {
    for (let i = 0; i <= n; i++) {
      const t = Math.PI - (Math.PI * i) / n
      pts.push([a * Math.cos(t), spring + rise * Math.sin(t)])
    }
  } else {
    const R = (a * a + rise * rise) / (2 * rise), zc = spring + rise - R, t0 = Math.asin(a / R)
    for (let i = 0; i <= n; i++) {
      const t = -t0 + (2 * t0 * i) / n
      pts.push([R * Math.sin(t), zc + R * Math.cos(t)])
    }
  }
  pts[0][0] = -a; pts[n][0] = a; pts[0][1] = spring; pts[n][1] = spring
  return pts
}

/** Outward normals (away from the opening) at each point of a profile. */
export function normals(pr: [number, number][], kind: 'ellipse' | 'segment', a: number, rise: number, spring: number): [number, number][] {
  if (kind === 'ellipse') {
    return pr.map(([x, z]) => {
      const nx = x / (a * a), nz = (z - spring) / (rise * rise), l = Math.hypot(nx, nz)
      return [nx / l, nz / l]
    })
  }
  const R = (a * a + rise * rise) / (2 * rise), zc = spring + rise - R
  return pr.map(([x, z]) => [x / R, (z - zc) / R])
}

/** A horizontal band proud of a face at y = s·yf, between lo(x) and hi(x), over the stations xs. */
export function band(p: Part, s: number, yf: number, proud: number, xs: number[], lo: (x: number) => number, hi: (x: number) => number, ends = true) {
  const y = s * (yf + proud), y0 = s * yf
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i], b = xs[i + 1]
    qn(p, [a, y, lo(a)], [b, y, lo(b)], [b, y, hi(b)], [a, y, hi(a)], [0, s, 0])
    qn(p, [a, y0, hi(a)], [b, y0, hi(b)], [b, y, hi(b)], [a, y, hi(a)], [0, 0, 1])
    qn(p, [a, y0, lo(a)], [b, y0, lo(b)], [b, y, lo(b)], [a, y, lo(a)], [0, 0, -1])
  }
  if (ends)
    for (const [x, sx] of [[xs[0], -1], [xs[xs.length - 1], 1]] as [number, number][])
      qn(p, [x, y0, lo(x)], [x, y, lo(x)], [x, y, hi(x)], [x, y0, hi(x)], [sx, 0, 0])
}

export type ArchSpec = {
  /** Portal face to portal face, along y. */
  D: number
  /** Half the face's length along x (to the ends of the wing walls). */
  W: number
  /** The top of each face wall (cornice or coping top) at x. */
  top: (x: number) => number
  /** The infill between the faces stops here (0.3 m under the roadway), over |x| ≤ F. */
  fill: number
  F: number
  /** Face-wall thickness behind each portal face. */
  t: number
  kind: 'ellipse' | 'segment'
  a: number
  rise: number
  spring: number
  /** Archivolt (voussoir ring) depth and how far it stands proud of the face. */
  ring: number
  proud: number
  /** Draw the ring down the jambs to the path as well (voussoir-and-jamb surround). */
  jambs?: boolean
  /** Stations along the wall top where it isn't flat. */
  xsTop?: number[]
  /** Draw only this much barrel and infill behind each face (the middle is under the terrain). */
  portal?: number
  n?: number
}

export type ArchParts = { face: Part; ring: Part; barrel: Part; fill: Part }

/**
 * The masonry of a drive arch: both portal faces with the opening cut out,
 * the archivolts, the jambs and the barrel through, the face walls' tops
 * and ends, and the infill between them stopping under the roadway.
 * Returns the intrados and the ring's outer curve, for bands and panels.
 */
export function archBlock(spec: ArchSpec, P: ArchParts) {
  const { D, W, top, fill, F, t, kind, a, rise, spring, ring, proud } = spec
  const n = spec.n ?? 16
  const pr = profile(kind, a, rise, spring, n)
  const nr = normals(pr, kind, a, rise, spring)
  const outer = pr.map(([x, z], i): [number, number] => [x + nr[i][0] * ring, z + nr[i][1] * ring])
  const intr = (x: number) => {
    for (let i = 0; i < n; i++) {
      const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
      if (x >= x0 - 1e-9 && x <= x1 + 1e-9) return z0 + ((z1 - z0) * (x - x0)) / Math.max(x1 - x0, 1e-9)
    }
    return 0
  }
  const half = D / 2
  const extra = (spec.xsTop ?? []).filter((x) => Math.abs(x) > a + 1e-6 && Math.abs(x) < W - 1e-6)
  const outL = [-W, ...extra.filter((x) => x < 0), -a].sort((p, q) => p - q)
  const outR = [a, ...extra.filter((x) => x > 0), W].sort((p, q) => p - q)
  for (const s of [-1, 1]) {
    const y = s * half, nf: V3 = [0, s, 0]
    // the face outside the opening, from the ground to the top
    for (const xs of [outL, outR])
      for (let i = 0; i + 1 < xs.length; i++) {
        const p = xs[i], q = xs[i + 1]
        qn(P.face, [p, y, 0], [q, y, 0], [q, y, top(q)], [p, y, top(p)], nf)
      }
    // over the opening, from the intrados to the top
    for (let i = 0; i < n; i++) {
      const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
      qn(P.face, [x0, y, z0], [x1, y, z1], [x1, y, top(x1)], [x0, y, top(x0)], nf)
    }
    // the archivolt, proud of the face
    const yr = s * (half + proud)
    for (let i = 0; i < n; i++) {
      const [x0, z0] = pr[i], [x1, z1] = pr[i + 1], [u0, w0] = outer[i], [u1, w1] = outer[i + 1]
      qn(P.ring, [x0, yr, z0], [x1, yr, z1], [u1, yr, w1], [u0, yr, w0], nf)
      const din: V3 = [-(nr[i][0] + nr[i + 1][0]) / 2, 0, -(nr[i][1] + nr[i + 1][1]) / 2]
      qn(P.ring, [x0, y, z0], [x1, y, z1], [x1, yr, z1], [x0, yr, z0], din)
      qn(P.ring, [u0, y, w0], [u1, y, w1], [u1, yr, w1], [u0, yr, w0], [-din[0], 0, -din[2]])
    }
    if (spec.jambs) {
      for (const sx of [-1, 1]) {
        const xi = sx * a, xo = sx * (a + ring)
        qn(P.ring, [xi, yr, 0], [xo, yr, 0], [xo, yr, spring], [xi, yr, spring], nf)
        qn(P.ring, [xi, y, 0], [xi, yr, 0], [xi, yr, spring], [xi, y, spring], [-sx, 0, 0])
        qn(P.ring, [xo, y, 0], [xo, yr, 0], [xo, yr, spring], [xo, y, spring], [sx, 0, 0])
      }
    } else {
      // the ring's feet: small returns where it lands on the springing
      for (const i of [0, n]) {
        const [x0, z0] = pr[i], [u0, w0] = outer[i]
        qn(P.ring, [x0, y, z0], [u0, y, w0], [u0, yr, w0], [x0, yr, z0], [0, 0, -1])
      }
    }
    // the wall top over its thickness, and its inner face down to the infill
    const xsAll = [...outL, ...pr.map((p) => p[0]).slice(1, -1), ...outR]
    const yi = s * (half - t)
    for (let i = 0; i + 1 < xsAll.length; i++) {
      const p = xsAll[i], q = xsAll[i + 1]
      qn(P.face, [p, y, top(p)], [q, y, top(q)], [q, yi, top(q)], [p, yi, top(p)], [0, 0, 1])
      const lp = Math.abs(p) < F - 1e-6 ? fill : 0, lq = Math.abs(q) < F - 1e-6 ? fill : 0
      if (Math.abs(p) >= F - 1e-6 || Math.abs(q) >= F - 1e-6) {
        if (Math.abs(p) >= a && Math.abs(q) >= a) qn(P.face, [p, yi, 0], [q, yi, 0], [q, yi, top(q)], [p, yi, top(p)], [0, -s, 0])
      } else if (top(p) > lp + 1e-3 || top(q) > lq + 1e-3) qn(P.face, [p, yi, lp], [q, yi, lq], [q, yi, top(q)], [p, yi, top(p)], [0, -s, 0])
    }
    // the wall ends
    for (const sx of [-1, 1]) {
      const x = sx * W
      qn(P.face, [x, y, 0], [x, yi, 0], [x, yi, top(x)], [x, y, top(x)], [sx, 0, 0])
    }
  }
  // jambs and barrel: through the whole length, or `portal` deep behind each face
  const P0 = spec.portal ? Math.max(half - spec.portal, 0.5) : 0
  const runs: [number, number][] = spec.portal ? [[-half, -P0], [P0, half]] : [[-half, half]]
  const yi = half - t
  for (const [y0, y1] of runs) {
    for (const sx of [-1, 1]) {
      const x = sx * a
      qn(P.barrel, [x, y0, 0], [x, y1, 0], [x, y1, spring], [x, y0, spring], [-sx, 0, 0])
    }
    for (let i = 0; i < n; i++) {
      const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
      const din: V3 = [-(nr[i][0] + nr[i + 1][0]) / 2, 0, -(nr[i][1] + nr[i + 1][1]) / 2]
      qn(P.barrel, [x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0], din)
    }
    // the infill under the roadway between the face walls, and its ends
    const f0 = Math.max(y0, -yi), f1 = Math.min(y1, yi)
    qn(P.fill, [-F, f0, fill], [F, f0, fill], [F, f1, fill], [-F, f1, fill], [0, 0, 1])
    for (const sx of [-1, 1]) {
      const x = sx * F
      if (F < W - 1e-6) qn(P.fill, [x, f0, 0], [x, f1, 0], [x, f1, fill], [x, f0, fill], [sx, 0, 0])
    }
  }
  // where the barrel stops, a wall closes the infill around the opening
  if (spec.portal)
    for (const s of [-1, 1]) {
      const y = s * P0, nf: V3 = [0, -s, 0]
      qn(P.fill, [-F, y, 0], [-a, y, 0], [-a, y, fill], [-F, y, fill], nf)
      qn(P.fill, [a, y, 0], [F, y, 0], [F, y, fill], [a, y, fill], nf)
      for (let i = 0; i < n; i++) {
        const [x0, z0] = pr[i], [x1, z1] = pr[i + 1]
        qn(P.fill, [x0, y, z0], [x1, y, z1], [x1, y, fill], [x0, y, fill], nf)
      }
    }
  return { pr, outer, intr }
}

/** Stations from a to b, n steps. */
export const steps = (a: number, b: number, k: number) => Array.from({ length: k + 1 }, (_, i) => a + ((b - a) * i) / k)

// ===========================================================================
// Greyshot Arch
// ===========================================================================

function build() {
  const face = new Part(), sand = new Part(), brick = new Part(), dark = new Part()
  const ROAD = 4.3, TOP = 4.3, W = 9.8, D = 19.4, half = D / 2
  const A = 4.8, RISE = 2.6, SPRING = 0.6
  const CORN = 0.3, PIL0 = 5.6, PIL1 = 6.4

  archBlock({ D, W, top: () => TOP, fill: ROAD - 0.3, F: W, t: 0.9, kind: 'ellipse', a: A, rise: RISE, spring: SPRING, ring: 0.4, proud: 0.08, n: 18 },
    { face, ring: sand, barrel: brick, fill: face })

  for (const s of [-1, 1]) {
    const yf = s * half
    // the cornice under the balustrade, the full length of the face
    band(sand, s, half, 0.2, [-W, W], () => TOP - CORN, () => TOP)
    // a low plinth course at the foot of the face, outside the opening
    for (const sx of [-1, 1]) band(sand, s, half, 0.06, sx < 0 ? [-W, -A] : [A, W], () => 0, () => 0.45)
    // the pilasters
    for (const sx of [-1, 1]) {
      const x0 = sx < 0 ? -PIL1 : PIL0, x1 = sx < 0 ? -PIL0 : PIL1
      band(sand, s, half, 0.22, [x0, x1], () => 0, () => TOP - CORN)
      // the scroll console at the pilaster's foot: a quarter-round sweep down
      // from the pilaster to a pedestal carrying a small urn
      const xa = sx * PIL1, xb = sx * 8.2
      const curve = steps(0, 1, 6).map((u): [number, number] => [xa + (xb - xa) * u, 0.75 + 1.75 * Math.cos((u * Math.PI) / 2)])
      const yo = s * (half + 0.55)
      for (let i = 0; i < 6; i++) {
        const [x0c, z0c] = curve[i], [x1c, z1c] = curve[i + 1]
        qn(sand, [x0c, yo, 0], [x1c, yo, 0], [x1c, yo, z1c], [x0c, yo, z0c], [0, s, 0])
        qn(sand, [x0c, yf, 0], [x1c, yf, 0], [x1c, yf, z1c], [x0c, yf, z0c], [0, -s, 0])
        const nx = -(z1c - z0c), nz = Math.abs(x1c - x0c)
        qn(sand, [x0c, yf, z0c], [x1c, yf, z1c], [x1c, yo, z1c], [x0c, yo, z0c], [sx * Math.sign(nx || 1) * Math.abs(nx), 0, nz])
      }
      qn(sand, [xb, yf, 0], [xb, yo, 0], [xb, yo, 0.75], [xb, yf, 0.75], [sx, 0, 0])
      const xu = sx * 8.55, yu = s * (half + 0.4)
      bevelBox(sand, xu, yu, 0.38, 0.38, 0, 0.75, 0.08)
      urn(sand, xu, yu, [[0.14, 0.75], [0.1, 0.85], [0.3, 1.05], [0.34, 1.3], [0.22, 1.45], [0.08, 1.6]], 8)
    }
    // the balustrade: plinth, pierced panels (dark inset in a sandstone
    // frame), coping, and pedestals
    const yb = s * (half - 0.15), th = 0.17
    const Z0 = TOP, Z1 = TOP + 0.85
    const posts = [-W + 0.35, -6.0, -1.95, 1.95, 6.0, W - 0.35]
    for (let k = 0; k + 1 < posts.length; k++) {
      const x0 = posts[k] + 0.4, x1 = posts[k + 1] - 0.4
      box(sand, x0, x1, yb - th - 0.05, yb + th + 0.05, Z0, Z0 + 0.12)
      box(sand, x0, x1, yb - th - 0.06, yb + th + 0.06, Z1 - 0.12, Z1)
      box(sand, x0, x1, yb - th + 0.04, yb + th - 0.04, Z0 + 0.12, Z1 - 0.12)
      // the piercings: a row of dark quatrefoil-sized openings on both faces
      const nh = Math.max(1, Math.round((x1 - x0) / 0.5))
      for (let j = 0; j < nh; j++) {
        const xc = x0 + ((x1 - x0) * (j + 0.5)) / nh, zc = (Z0 + Z1) / 2, r = 0.17
        for (const side of [-1, 1]) {
          const yy = yb + side * (th - 0.02)
          const pts = Array.from({ length: 6 }, (_, q): V3 => [xc + r * Math.cos((q * Math.PI) / 3), yy, zc + r * Math.sin((q * Math.PI) / 3)])
          for (let q = 1; q < 5; q++) {
            const g = (pts[q][0] - pts[0][0]) * (pts[q + 1][2] - pts[0][2]) - (pts[q][2] - pts[0][2]) * (pts[q + 1][0] - pts[0][0])
            // face normal along -y when g > 0 (x × z = -y)
            if ((g > 0 ? -1 : 1) === side) dark.tri(pts[0], pts[q], pts[q + 1]); else dark.tri(pts[0], pts[q + 1], pts[q])
          }
        }
      }
    }
    for (const x of posts) {
      const big = Math.abs(Math.abs(x) - 6.0) < 0.01
      const h = big ? 0.42 : 0.4
      bevelBox(sand, x, yb, h, 0.3, Z0, Z1 + 0.12, 0.06)
      bevelBox(sand, x, yb, h + 0.06, 0.36, Z1 + 0.12, Z1 + 0.24, 0.06)
      if (big) urn(sand, x, yb, [[0.16, Z1 + 0.24], [0.12, Z1 + 0.32], [0.28, Z1 + 0.5], [0.3, Z1 + 0.7], [0.18, Z1 + 0.82], [0.06, Z1 + 0.95]], 8)
    }
  }

  finishModel('Greyshot Arch', 'nyc-greyshot-arch', [
    { part: face, material: { name: 'stone', color: 0xb8b4aa, roughness: 0.9 } },
    { part: sand, material: { name: 'sandstone', color: 0xb3a385, roughness: 0.9 } },
    { part: dark, material: { name: 'openwork', color: 0x8a8372, roughness: 0.9 } },
    { part: brick, material: { name: 'brick', color: 0x9e6253, roughness: 0.9 } },
  ], { bearing: 287.8, osm: 'way/385446613', height: TOP + 0.85 + 0.95 }, 5000)
}

if (import.meta.main) build()
