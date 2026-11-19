/**
 * Al-Khazneh (the Treasury), Petra: procedural, CC0-1.0.
 * bun generators/petra-al-khazneh.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/petra-al-khazneh.glb, the low model (budget 6,500 tris);
 * - models/petra-al-khazneh.detail.glb, drawn from zoom 16 (budget 40,000):
 *   the same forms with rounder columns, Corinthian capitals with leaves and
 *   volutes, dentils and frieze bosses, and fuller figures.
 *
 * Also exports the small rock-cut kit (boxes, prisms, lathes, figures,
 * capitals) that petra-ad-deir.ts and hegra-qasr-al-farid.ts import, so this
 * generator is merged first. Its own build runs only under import.meta.main.
 *
 * Only the carved facade is modelled, as a shallow slab of rock with the
 * carving cut into it: no cliff, no Siq walls, no terrain.
 *
 * Map frame: x east, y north, z up, metres. Built turned to bearing 249.4:
 * the model's +y (north) runs into the rock, real WSW; the facade faces the
 * model's -y, real ENE (069.4°), out across the plaza to the Siq's outlet.
 * The facing is the long side of the OSM outline (way/488848937: 17.2 m on
 * 159.1°/339.1°, 6.1 m deep); the plaza and the souvenir kiosk way/246334853
 * are on its ENE side, and every frontal photo is taken from there. The
 * anchor is the outline's centroid (35.4515251, 30.3220755); the column
 * centre line is set 2 m in front of it, about where the outline's front
 * edge is (the outline is a rough sketch: 17 m against the real 25 m).
 *
 * Published (cited):
 * - facade 25.3 m wide, 39.1 m high (en.wikipedia "Al-Khazneh", citing
 *   McKenzie); the 39.1 m is taken here as the top of the dressed rock face
 *   above the urn.
 * - six Corinthian columns below, a tholos between two half-pediments above,
 *   Amazons with axes, the Dioscuri with their horses beside the porch,
 *   Tyche on the tholos, Victories in the recesses, eagles on top
 *   (en.wikipedia; Hittorff's restored elevation, below).
 *
 * Measured from the photos (frontal "edit 2" for widths, at 42 px/m at the
 * lower order; Hittorff's elevation for the heights, since every photo is
 * foreshortened upward; the two agree on the lower storey at 16.8 m):
 * - lower columns at x = ±2.85, ±6.65, ±10.8 m, 1.3 m thick, 9.4 m shafts on
 *   0.6 m bases on a 0.9 m stylobate; capitals 1.3 m; entablature
 *   12.2-14.9 m; pediment over the middle four columns (x ±8.7) to 16.8 m.
 * - door 3.2 m wide, 7 m high, with a moulded frame and entablature.
 * - upper storey: base band 14.9-17.4 m, columns to 26.4 m (capitals
 *   included), entablature to 28.6 m, half-pediments rising from the outer
 *   edges to 31 m at their broken inner ends (x ±5.2); tholos 7.1 m across
 *   its cornice, tent roof to 30.6 m, capital, urn to about 35.9 m.
 * - blocks of rough rock left standing above the half-pediments, and the
 *   dressed face up to 39.1 m.
 *
 * Estimated: every depth. From the oblique photos (Dosseman 2404, Argenberg)
 * and Hittorff's plan and section: the porch 6 m deep behind the middle four
 * columns, the side bays 2 m, the upper pavilions 1.6 m, the recesses beside
 * the tholos 3 m; the tholos centred 1.8 m behind the column line. The
 * figures are simplified mannequins at their real size and pose, as far as
 * the eroded reliefs show it.
 *
 * Colour, from daylight photos and pulled to the palette's lightness: the
 * sunlit stone is a pale peach (#efcfb4, #d9bba0 in Argenberg's sunlit
 * view), the shaded and overcast stone a deeper rose-salmon (#bd7f6b,
 * #a87b6a in "edit 2"). The body is a rose-salmon between the two, the carved
 * ornament and figures a little paler, the rough rock around a little
 * redder, the door's dark opening a deep brown-red.
 *
 * Night: Petra by Night lights the facade from the plaza (candles, warm
 * floodlights): the lower storey floodlit, the upper less, tops barely.
 *
 * Elevation 0: the facade stands on the plaza, which the terrain shows.
 *
 * OSM (© OpenStreetMap contributors, ODbL), fetched Nov 2026: way/488848937
 * (building=yes, historic=tomb, tomb=rock-cut, wikidata Q1259626) is the
 * one building under the model. way/246334853 (a kiosk, building=retail)
 * stands 30 m in front of it and is not covered.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - "Al Khazneh Petra edit 2.jpg", Graham Racher (edit by others),
 *   CC BY-SA 2.0, https://commons.wikimedia.org/wiki/File:Al_Khazneh_Petra_edit_2.jpg
 *   (frontal, overcast: proportions, widths, colour in shade)
 * - "Al-Khazneh 2, Petra, Jordan.jpg", Vyacheslav Argenberg, CC BY 4.0,
 *   https://commons.wikimedia.org/wiki/File:Al-Khazneh_2,_Petra,_Jordan.jpg
 *   (frontal, sunlit: upper storey, colour in sun)
 * - "Petra Al Khazneh 2404.jpg", Dosseman, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Petra_Al_Khazneh_2404.jpg
 *   (oblique from the left: porch depth, free columns, side bays)
 * - "Al Khazneh 02.jpg", Bernard Gagnon, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Al_Khazneh_02.jpg
 *   (half-pediment, capitals, entablature close up)
 * - "Restauration du Khasne Petra.jpg", Jacques Ignace Hittorff, public
 *   domain, https://commons.wikimedia.org/wiki/File:Restauration_du_Khasne_Petra.jpg
 *   (restored elevation, section and plan: heights, plan of the porch)
 *
 * Look-only: none.
 *
 * Doubts: the depths are estimates; Hittorff's drawing is a restoration
 * and its figures are idealised, so the figures follow the photos' eroded
 * outlines in pose only. The 39.1 m published height may be meant to the
 * urn's top; the urn here tops out at 35.9 m, as Hittorff and the photos'
 * proportions give it.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'

// ------------------------------------------------------------------ kit ---

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const crossV = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const subV = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const addV = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scaleV = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

/** A flat convex polygon, wound so it faces `out` whichever order it was given in. */
export function face(p: Part, pts: V3[], out: V3) {
  const g = crossV(subV(pts[1], pts[0]), subV(pts[2], pts[0]))
  const ring = dot(g, out) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < ring.length - 1; i++) p.tri(ring[0], ring[i], ring[i + 1])
}

/** An axis-aligned box. `skip` leaves out faces nobody sees: 'b' bottom, 'n' back (+y). */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip = '') {
  if (x1 - x0 <= 0 || y1 - y0 <= 0 || z1 - z0 <= 0) return
  const c = (x: number, y: number, z: number): V3 => [x, y, z]
  face(p, [c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1)], [0, -1, 0])
  if (!skip.includes('n')) face(p, [c(x0, y1, z0), c(x1, y1, z0), c(x1, y1, z1), c(x0, y1, z1)], [0, 1, 0])
  face(p, [c(x0, y0, z0), c(x0, y1, z0), c(x0, y1, z1), c(x0, y0, z1)], [-1, 0, 0])
  face(p, [c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1)], [1, 0, 0])
  face(p, [c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1)], [0, 0, 1])
  if (!skip.includes('b')) face(p, [c(x0, y0, z0), c(x1, y0, z0), c(x1, y1, z0), c(x0, y1, z0)], [0, 0, -1])
}

/** A box with its front and side top edges chamfered by `b` (a soft cornice or block). */
export function bbox(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0.25) {
  b = Math.min(b, (x1 - x0) / 3, (y1 - y0) / 3, (z1 - z0) / 3)
  // section in x-z, extruded along y, then front face chamfered.
  const sec: [number, number][] = [[x0, z0], [x1, z0], [x1, z1 - b], [x1 - b, z1], [x0 + b, z1], [x0, z1 - b]]
  prismY(p, sec, y0 + b, y1)
  // front chamfer band: from y0+b section to inset front at y0
  const ins: [number, number][] = [[x0 + b, z0], [x1 - b, z0], [x1 - b, z1 - b], [x1 - b, z1 - b], [x0 + b, z1 - b], [x0 + b, z1 - b]]
  const back = sec.map(([x, z]) => [x, y0 + b, z] as V3)
  const front = ins.map(([x, z]) => [x, y0, z] as V3)
  for (let i = 0; i < sec.length; i++) {
    const j = (i + 1) % sec.length
    if (i === 0) continue // the bottom edge stays square
    const q = [back[i], back[j], front[j], front[i]]
    const n = norm(addV(crossV(subV(q[1], q[0]), subV(q[3], q[0])), [0, 0, 0]))
    // outward: away from the box centre
    const cen: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
    const m = scaleV(addV(addV(q[0], q[1]), addV(q[2], q[3])), 0.25)
    const out = dot(n, subV(m, cen)) < 0 ? scaleV(n, -1) : n
    if (Math.hypot(...subV(q[0], q[1])) < 1e-6 && Math.hypot(...subV(q[2], q[3])) < 1e-6) continue
    face(p, uniq(q), out)
  }
  face(p, uniq(front), [0, -1, 0])
}
const uniq = (q: V3[]) => q.filter((v, i) => q.findIndex((w) => Math.hypot(...subV(v, w)) < 1e-6) === i)

/**
 * A convex polygon in the x-z plane (points as [x, z]), extruded along y
 * from y0 (its front, facing -y) to y1. Pediments, gables, steps.
 */
export function prismY(p: Part, sec: [number, number][], y0: number, y1: number, back = true) {
  const f = sec.map(([x, z]) => [x, y0, z] as V3)
  const k = sec.map(([x, z]) => [x, y1, z] as V3)
  face(p, f, [0, -1, 0])
  if (back) face(p, k, [0, 1, 0])
  const cx = sec.reduce((s, q) => s + q[0], 0) / sec.length, cz = sec.reduce((s, q) => s + q[1], 0) / sec.length
  for (let i = 0; i < sec.length; i++) {
    const j = (i + 1) % sec.length
    const dx = sec[j][0] - sec[i][0], dz = sec[j][1] - sec[i][1]
    if (Math.hypot(dx, dz) < 1e-6) continue
    let n: V3 = [dz, 0, -dx]
    const mx = (sec[i][0] + sec[j][0]) / 2 - cx, mz = (sec[i][1] + sec[j][1]) / 2 - cz
    if (n[0] * mx + n[2] * mz < 0) n = [-dz, 0, dx]
    face(p, [f[i], f[j], k[j], k[i]], n)
  }
}

/** A convex polygon in the x-y plane, extruded from z0 to z1 (a plan block). */
export function prismZ(p: Part, plan: [number, number][], z0: number, z1: number, bottom = false) {
  const lo = plan.map(([x, y]) => [x, y, z0] as V3), hi = plan.map(([x, y]) => [x, y, z1] as V3)
  face(p, hi, [0, 0, 1])
  if (bottom) face(p, lo, [0, 0, -1])
  const cx = plan.reduce((s, q) => s + q[0], 0) / plan.length, cy = plan.reduce((s, q) => s + q[1], 0) / plan.length
  for (let i = 0; i < plan.length; i++) {
    const j = (i + 1) % plan.length
    const dx = plan[j][0] - plan[i][0], dy = plan[j][1] - plan[i][1]
    if (Math.hypot(dx, dy) < 1e-6) continue
    let n: V3 = [dy, -dx, 0]
    const mx = (plan[i][0] + plan[j][0]) / 2 - cx, my = (plan[i][1] + plan[j][1]) / 2 - cy
    if (n[0] * mx + n[1] * my < 0) n = [-dy, dx, 0]
    face(p, [lo[i], lo[j], hi[j], hi[i]], n)
  }
}

/**
 * A surface of revolution about the vertical through (cx, cy): `prof` is
 * [radius, z] from bottom to top. Smooth around, creased at every profile
 * point, so mouldings stay crisp. `a0`-`a1` (radians, 0 = facing -y, the
 * facade's front, positive towards +x) limit it to an arc; caps close the
 * ends with a flat top and bottom.
 */
export function lathe(p: Part, cx: number, cy: number, prof: [number, number][], seg: number, opts: { a0?: number; a1?: number; top?: boolean; bottom?: boolean } = {}) {
  const a0 = opts.a0 ?? 0, a1 = opts.a1 ?? Math.PI * 2
  const full = Math.abs(a1 - a0 - Math.PI * 2) < 1e-6
  const n = Math.max(3, Math.round((seg * Math.abs(a1 - a0)) / (Math.PI * 2)))
  const ang = Array.from({ length: n + 1 }, (_, i) => a0 + ((a1 - a0) * i) / n)
  const at = (r: number, z: number, a: number): V3 => [cx + r * Math.sin(a), cy - r * Math.cos(a), z]
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    if (Math.abs(r0 - r1) < 1e-9 && Math.abs(z0 - z1) < 1e-9) continue
    const len = Math.hypot(r1 - r0, z1 - z0)
    const nr = (z1 - z0) / len, nz = -(r1 - r0) / len // outward normal in (r, z)
    for (let i = 0; i < n; i++) {
      const aa = ang[i], ab = ang[i + 1]
      const na: V3 = [nr * Math.sin(aa), -nr * Math.cos(aa), nz], nb: V3 = [nr * Math.sin(ab), -nr * Math.cos(ab), nz]
      const A = at(r0, z0, aa), B = at(r0, z0, ab), C = at(r1, z1, ab), D = at(r1, z1, aa)
      if (r0 > 1e-6) p.tri(A, B, C, undefined, undefined, undefined, [na, nb, nb])
      if (r1 > 1e-6) p.tri(A, C, D, undefined, undefined, undefined, [na, nb, na])
    }
  }
  const capAt = (r: number, z: number, up: boolean) => {
    if (r < 1e-6) return
    const c: V3 = [cx, cy, z]
    for (let i = 0; i < n; i++) face(p, [c, at(r, z, ang[i]), at(r, z, ang[i + 1])], [0, 0, up ? 1 : -1])
  }
  if (opts.top !== false) capAt(prof[prof.length - 1][0], prof[prof.length - 1][1], true)
  if (opts.bottom) capAt(prof[0][0], prof[0][1], false)
  if (!full) {
    // close the cut ends of an arc (they mostly run into the rock)
    for (const a of [a0, a1]) {
      const pts: V3[] = [[cx, cy, prof[0][1]], ...prof.map(([r, z]) => at(r, z, a)), [cx, cy, prof[prof.length - 1][1]]]
      const tan: V3 = [Math.cos(a), Math.sin(a), 0]
      const out = a === a0 ? scaleV(tan, -1) : tan
      // fan from the axis; the profile is not convex in general, so strip it
      for (let k = 0; k < prof.length - 1; k++) {
        const q = [[cx, cy, prof[k][1]] as V3, at(prof[k][0], prof[k][1], a), at(prof[k + 1][0], prof[k + 1][1], a), [cx, cy, prof[k + 1][1]] as V3]
        const u = uniq(q)
        if (u.length >= 3) face(p, u, out)
      }
      void pts
    }
  }
}

/** A tapered round limb from a to b (radii r0 at a, r1 at b), with closed ends. */
export function limb(p: Part, a: V3, b: V3, r0: number, r1: number, seg = 6) {
  const axis = norm(subV(b, a))
  const ref: V3 = Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = norm(crossV(axis, ref)), v = crossV(axis, u)
  const ring = (c: V3, r: number) => Array.from({ length: seg }, (_, i) => {
    const t = (i / seg) * Math.PI * 2
    return addV(c, addV(scaleV(u, r * Math.cos(t)), scaleV(v, r * Math.sin(t))))
  })
  const A = ring(a, r0), B = ring(b, r1)
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg
    const t0 = (i / seg) * Math.PI * 2, t1 = (j / seg) * Math.PI * 2
    const n0 = norm(addV(scaleV(u, Math.cos(t0)), scaleV(v, Math.sin(t0))))
    const n1 = norm(addV(scaleV(u, Math.cos(t1)), scaleV(v, Math.sin(t1))))
    p.tri(A[i], A[j], B[j], undefined, undefined, undefined, [n0, n1, n1])
    p.tri(A[i], B[j], B[i], undefined, undefined, undefined, [n0, n1, n0])
  }
  face(p, A, scaleV(axis, -1))
  face(p, B, axis)
}

/** An ellipsoid, smooth-shaded, `seg` around and `rings` from pole to pole. */
export function blob(p: Part, c: V3, r: V3, seg = 8, rings = 5) {
  const pt = (i: number, k: number): [V3, V3] => {
    const th = (k / rings) * Math.PI, ph = (i / seg) * Math.PI * 2
    const s = [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), -Math.cos(th)]
    return [[c[0] + r[0] * s[0], c[1] + r[1] * s[1], c[2] + r[2] * s[2]], norm([s[0] / r[0], s[1] / r[1], s[2] / r[2]])]
  }
  for (let k = 0; k < rings; k++)
    for (let i = 0; i < seg; i++) {
      const [a, na] = pt(i, k), [b, nb] = pt(i + 1, k), [cc, nc] = pt(i + 1, k + 1), [d, nd] = pt(i, k + 1)
      if (k > 0) p.tri(a, b, cc, undefined, undefined, undefined, [na, nb, nc])
      if (k < rings - 1) p.tri(a, cc, d, undefined, undefined, undefined, [na, nc, nd])
    }
}

/** A round column: torus base on a square plinth, tapered shaft. Returns the top of the shaft. */
export function column(p: Part, x: number, y: number, z0: number, z1: number, r: number, seg: number, opts: { plinth?: boolean; arc?: [number, number] } = {}) {
  const arc = opts.arc ? { a0: opts.arc[0], a1: opts.arc[1] } : {}
  const pl = opts.plinth !== false ? 0.22 * r * 2 : 0
  if (pl) {
    if (opts.arc) box(p, x - r * 1.25, x + r * 1.25, y - r * 1.25, y, z0, z0 + pl, 'b')
    else box(p, x - r * 1.25, x + r * 1.25, y - r * 1.25, y + r * 1.25, z0, z0 + pl, 'b')
  }
  const zb = z0 + pl
  const prof: [number, number][] = seg > 14
    ? [[r * 1.18, zb], [r * 1.2, zb + 0.12 * r], [r * 1.12, zb + 0.32 * r], [r * 1.02, zb + 0.4 * r], [r * 1.08, zb + 0.55 * r], [r, zb + 0.7 * r], [r * 0.86, z1 - 0.12], [r * 0.92, z1]]
    : [[r * 1.18, zb], [r * 1.15, zb + 0.35 * r], [r, zb + 0.6 * r], [r * 0.86, z1]]
  lathe(p, x, y, prof, seg, { ...arc, top: false })
  return z1
}

/**
 * A Corinthian capital from z0 to z1 on a shaft of radius r: a bell, and in
 * the detail model two rows of leaves and corner volutes, under a concave
 * square abacus (drawn straight).
 */
export function corinthian(p: Part, x: number, y: number, z0: number, z1: number, r: number, detail: boolean, half = false) {
  const h = z1 - z0, ab = h * 0.16
  const seg = detail ? 16 : 8
  const arc = half ? { a0: -Math.PI / 2, a1: Math.PI / 2 } : {}
  lathe(p, x, y, [[r * 0.9, z0], [r * 0.95, z0 + h * 0.5], [r * 1.25, z1 - ab]], seg, { ...arc, top: false })
  const w = r * 1.55
  box(p, x - w, x + w, y - w, half ? y : y + w, z1 - ab, z1, 'b')
  if (!detail) {
    // the leaves as one bold collar, so it still reads as a leafy capital
    lathe(p, x, y, [[r * 0.92, z0], [r * 1.18, z0 + h * 0.45], [r * 0.95, z0 + h * 0.55]], seg, { ...arc, top: false })
    return
  }
  const n = 8
  for (let row = 0; row < 2; row++)
    for (let i = 0; i < n; i++) {
      const a = ((i + row * 0.5) / n) * Math.PI * 2
      if (half && Math.cos(a) < -0.2) continue
      const s = Math.sin(a), c = -Math.cos(a)
      const rb = r * 0.92, rt = r * (row ? 1.32 : 1.2)
      const zb = z0 + (row ? h * 0.2 : 0), zt = z0 + (row ? h * 0.66 : h * 0.4)
      // a leaf: a thin curved tongue leaning out, with a curled tip
      const w0 = r * 0.34, t = 0.07
      const ux = c, uy = -s // tangent
      const base: V3 = [x + rb * s, y + rb * c, zb], tip: V3 = [x + rt * s, y + rt * c, zt]
      const mid: V3 = [x + (rt * 1.02) * s, y + (rt * 1.02) * c, (zb + zt) / 2]
      const L = (q: V3, w: number, o: number): V3 => [q[0] + ux * w + s * o, q[1] + uy * w + c * o, q[2]]
      const quadL = (q0: V3, q1: V3, wa: number, wb: number) => {
        face(p, [L(q0, -wa, t), L(q0, wa, t), L(q1, wb, t), L(q1, -wb, t)], norm([s, c, 0.4]))
        face(p, [L(q0, -wa, -t), L(q0, wa, -t), L(q1, wb, -t), L(q1, -wb, -t)], norm([-s, -c, -0.2]))
      }
      quadL(base, mid, w0, w0 * 1.1)
      quadL(mid, tip, w0 * 1.1, w0 * 0.5)
      face(p, [L(tip, -w0 * 0.5, t), L(tip, w0 * 0.5, t), [tip[0] + s * 0.18, tip[1] + c * 0.18, tip[2] - 0.12]], [0, 0, 1])
    }
  // corner volutes under the abacus corners
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as [number, number][]) {
    if (half && sy > 0) continue
    const cxv = x + sx * w * 0.86, cyv = y + sy * w * 0.86
    limb(p, [cxv - sx * 0.08, cyv - sy * 0.08, z1 - ab - h * 0.13], [cxv, cyv, z1 - ab - h * 0.03], h * 0.09, h * 0.07, 6)
    limb(p, [x + sx * r * 0.9, y + sy * r * 0.9, z0 + h * 0.55], [cxv - sx * 0.08, cyv - sy * 0.08, z1 - ab - h * 0.13], h * 0.06, h * 0.07, 5)
  }
  // central fleuron on the front of the abacus
  blob(p, [x, y - w - 0.06, z1 - ab / 2], [0.16, 0.1, ab * 0.45], 6, 3)
}

/** A row of dentils under a cornice front at y, from x0 to x1. */
export function dentils(p: Part, x0: number, x1: number, y: number, z0: number, z1: number, step = 0.42) {
  const n = Math.floor((x1 - x0) / step)
  const off = (x1 - x0 - n * step) / 2
  for (let i = 0; i < n; i++) {
    const a = x0 + off + i * step + step * 0.2
    box(p, a, a + step * 0.6, y - 0.18, y + 0.05, z0, z1, 'nb')
  }
}

// ---- figures ---------------------------------------------------------------

export type Pose = {
  /** hand positions relative to the figure's base, metres at h = 1 (x right, y forward(-), z up) */
  lh?: V3
  rh?: V3
  wings?: boolean
  robe?: boolean
  turn?: number
}

/**
 * A standing figure in high relief, `h` tall, standing at (x, y, z) facing
 * -y (out of the facade): a robe or legs, torso, head and two arms. Simple,
 * bold masses: it reads as a figure, not a portrait.
 */
export function figure(p: Part, x: number, y: number, z: number, h: number, pose: Pose = {}, detail = false) {
  const seg = detail ? 10 : 6
  const S = (q: V3): V3 => [x + q[0] * h, y + q[1] * h, z + q[2] * h]
  if (pose.robe !== false) {
    lathe(p, x, y, [[0.15 * h, z], [0.125 * h, z + 0.3 * h], [0.11 * h, z + 0.52 * h]], seg, { top: false })
  } else {
    limb(p, S([-0.06, 0, 0]), S([-0.055, 0, 0.5]), 0.05 * h, 0.07 * h, seg)
    limb(p, S([0.07, -0.04, 0]), S([0.055, 0, 0.5]), 0.05 * h, 0.07 * h, seg)
  }
  lathe(p, x, y, [[0.11 * h, z + 0.5 * h], [0.1 * h, z + 0.62 * h], [0.13 * h, z + 0.78 * h], [0.06 * h, z + 0.82 * h]], seg, { top: true })
  limb(p, S([0, 0, 0.8]), S([0, 0, 0.86]), 0.035 * h, 0.035 * h, Math.max(5, seg - 2))
  blob(p, S([0, -0.01, 0.92]), [0.06 * h, 0.065 * h, 0.075 * h], seg, detail ? 5 : 4)
  const sh = (sx: number): V3 => [sx * 0.13, 0, 0.77]
  const lh = pose.lh ?? [-0.17, -0.05, 0.45], rh = pose.rh ?? [0.17, -0.05, 0.45]
  for (const [sx, hand] of [[-1, lh], [1, rh]] as [number, V3][]) {
    const s = sh(sx)
    const el: V3 = [(s[0] + hand[0]) / 2 + sx * 0.04, (s[1] + hand[1]) / 2, (s[2] + hand[2]) / 2 - 0.03]
    limb(p, S(s), S(el), 0.04 * h, 0.033 * h, Math.max(5, seg - 3))
    limb(p, S(el), S(hand), 0.033 * h, 0.028 * h, Math.max(5, seg - 3))
  }
  if (pose.wings) {
    for (const sx of [-1, 1]) {
      const sec: [number, number][] = [[sx * 0.08, 0.78], [sx * 0.34, 0.98], [sx * 0.3, 0.6], [sx * 0.12, 0.42]].map(([a, b]) => [x + a * h, z + b * h])
      prismY(p, sx < 0 ? sec.reverse() : sec, y + 0.04 * h, y + 0.12 * h)
    }
  }
}

/** A horse in relief, standing, `l` long nose to tail, facing +x when dir = 1. */
export function horse(p: Part, x: number, y: number, z: number, l: number, dir: 1 | -1, detail = false) {
  const seg = detail ? 9 : 6
  const H = (q: V3): V3 => [x + dir * q[0] * l, y + q[1] * l, z + q[2] * l]
  blob(p, H([0, 0, 0.52]), [0.36 * l, 0.14 * l, 0.16 * l], seg, detail ? 5 : 4)
  limb(p, H([0.28, 0, 0.58]), H([0.42, 0, 0.86]), 0.08 * l, 0.06 * l, seg) // neck
  limb(p, H([0.4, 0, 0.88]), H([0.56, 0, 0.74]), 0.065 * l, 0.04 * l, seg) // head
  for (const [fx, fy] of [[0.24, -0.06], [0.22, 0.06], [-0.24, -0.06], [-0.26, 0.06]] as [number, number][])
    limb(p, H([fx, fy, 0.45]), H([fx + (fx > 0 ? 0.03 : -0.02), fy, 0]), 0.05 * l, 0.03 * l, Math.max(4, seg - 2))
  limb(p, H([-0.34, 0, 0.6]), H([-0.44, 0, 0.3]), 0.04 * l, 0.025 * l, Math.max(4, seg - 2)) // tail
}

/** An eagle (or other bird) perched, wings half spread, `s` tall. */
export function eagle(p: Part, x: number, y: number, z: number, s: number, detail = false) {
  const seg = detail ? 8 : 6
  blob(p, [x, y, z + 0.45 * s], [0.22 * s, 0.25 * s, 0.38 * s], seg, 4)
  blob(p, [x, y - 0.1 * s, z + 0.9 * s], [0.13 * s, 0.15 * s, 0.13 * s], seg, 4)
  for (const sx of [-1, 1]) {
    const sec: [number, number][] = [[sx * 0.15, 0.25], [sx * 0.5, 0.55], [sx * 0.42, 0.95], [sx * 0.15, 0.75]].map(([a, b]) => [x + a * s, z + b * s])
    prismY(p, sx < 0 ? sec.reverse() : sec, y - 0.05 * s, y + 0.15 * s)
  }
}

/** A recumbent lion (or sphinx), `l` long, facing out (-y) when side = 0, along ±x otherwise. */
export function lion(p: Part, x: number, y: number, z: number, l: number, dir: 1 | -1, detail = false) {
  const seg = detail ? 8 : 6
  blob(p, [x, y, z + 0.18 * l], [0.42 * l, 0.17 * l, 0.18 * l], seg, 4)
  blob(p, [x + dir * 0.38 * l, y - 0.02 * l, z + 0.36 * l], [0.16 * l, 0.15 * l, 0.17 * l], seg, 4)
  limb(p, [x + dir * 0.3 * l, y - 0.08 * l, z + 0.05 * l], [x + dir * 0.6 * l, y - 0.08 * l, z + 0.04 * l], 0.06 * l, 0.05 * l, Math.max(4, seg - 2))
}

/** Shift everything in a part along y (map frame), after building. */
export function shiftY(p: Part, dy: number) {
  // Part stores glTF coordinates: (x, z, -y)
  for (let i = 2; i < p.pos.length; i += 3) p.pos[i] -= dy
}

export async function writeModel(id: string, title: string, parts: Array<{ part: Part; material: MaterialSpec }>, extras: Record<string, unknown>, maxTris: number, maxBytes: number, suffix = '') {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}${suffix}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(title, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  if (glb.length > maxBytes) throw new Error(`${id}${suffix}: size budget exceeded: ${glb.length} bytes, ${triangles} tris`)
  const out = new URL(`../models/${id}${suffix}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ------------------------------------------------------------- the model ---

const BEARING = 249.4
/** The column centre line sits this far in front of (south of) the anchor. */
const FRONT = -2.0

type Mats = { body: Part; carve: Part; rock: Part; dark: Part }

function build(detail: boolean): Mats {
  const M: Mats = { body: new Part(), carve: new Part(), rock: new Part(), dark: new Part() }
  const { body, carve, rock, dark } = M
  const cseg = detail ? 20 : 10
  const W = 12.65 // half the facade's width

  // ---- the slab of rock the facade is cut from ----
  const TOP = 39.1, BACK = 7.2
  // sides and top, behind everything; the porch is cut into the middle
  box(rock, -13.6, -7.3, 2.0, BACK, 0, TOP, 'b')
  box(rock, 7.3, 13.6, 2.0, BACK, 0, TOP, 'b')
  box(rock, -7.3, -6.0, 2.0, BACK, 12.2, TOP, 'b')
  box(rock, 6.0, 7.3, 2.0, BACK, 12.2, TOP, 'b')
  // behind the porch, with the doorway cut 1.6 m into it (built below)
  // above the porch: solid under and over the upper storey; in it, the
  // rock stands back behind the tholos (1.5 m) and the recesses (3 m)
  box(rock, -6.0, 6.0, 1.5, 6.0, 12.2, 17.4, 'b')
  box(rock, -6.0, 6.0, 1.5, 6.0, 28.6, TOP, 'b')
  box(rock, -3.4, 3.4, 1.5, 6.0, 17.4, 28.6, 'b')
  for (const s of [-1, 1]) {
    box(rock, s < 0 ? -5.2 : 3.4, s < 0 ? -3.4 : 5.2, 3.0, 6.0, 17.4, 28.6, 'b')
    box(rock, s < 0 ? -6.0 : 5.2, s < 0 ? -5.2 : 6.0, 2.0, 6.0, 17.4, 28.6, 'b')
  }
  // the dressed face projects a little at the sides, framing the carving
  box(rock, -13.6, -W - 0.05, 0.6, 2.0, 0, TOP, 'b')
  box(rock, W + 0.05, 13.6, 0.6, 2.0, 0, TOP, 'b')
  // rough blocks left standing above the half-pediments
  for (const s of [-1, 1]) {
    const [a, b] = s < 0 ? [-10.4, -6.1] : [6.1, 10.4]
    bbox(body, a, b, 0.1, 2.0, 29.2, 37.6, 0.4)
  }
  // the overhang of the cut at the top
  box(rock, -13.6, 13.6, 0.9, 2.0, TOP - 0.7, TOP, 'b')

  // ---- lower storey ----
  const ZS = 0.9 // stylobate top
  // stylobate and steps
  box(body, -W, W, -1.7, 2.0, 0, ZS, 'b')
  box(body, -4.2, 4.2, -2.3, -1.7, 0, ZS * 0.5, 'b')
  // porch floor runs back into the porch
  box(body, -6.0, 6.0, 2.0, 6.0, 0, ZS + 0.5, 'b')
  // antae at the outer edges, with the outer columns engaged on them
  for (const s of [-1, 1]) {
    const [a, b] = s < 0 ? [-W, -11.5] : [11.5, W]
    box(body, a, b, -0.3, 2.0, ZS, 12.2, 'b')
  }
  // side bays: back wall at y = 2 (the rock), relief panels; side walls
  for (const s of [-1, 1]) {
    // the pier between side bay and porch, behind the second column
    const [a, b] = s < 0 ? [-7.3, -6.0] : [6.0, 7.3]
    box(body, a, b, 0.7, BACK, 0, 12.2, 'b')
    // a pilaster on the pier's front, behind the column
    box(body, a + 0.15, b - 0.15, 0.55, 0.7, ZS, 12.2, 'b')
    // relief pedestal and the Dioscurus with his horse
    const cx = s * 8.9
    box(body, cx - 1.3, cx + 1.3, 1.4, 2.0, ZS, 2.3, 'b')
    horse(carve, cx + s * 0.25, 1.7, 2.3, 3.0, s < 0 ? -1 : 1, detail)
    figure(carve, cx - s * 0.85, 1.6, 2.3, 3.6, { lh: [-0.2, -0.05, 0.55], rh: [0.2, -0.05, 0.55], robe: false }, detail)
  }
  // porch: back wall at y = 6 (the rock) with the door, side walls on the piers
  // door: frame, opening, entablature over it
  const DW = 1.6, DH = ZS + 0.5 + 7.0
  // the rock behind the porch, cut round the doorway, which is a real
  // 0.9 m recess with its dark depths at the back
  box(rock, -6.0, -DW, 6.0, BACK, 0, TOP, 'b')
  box(rock, DW, 6.0, 6.0, BACK, 0, TOP, 'b')
  box(rock, -DW, DW, 6.0, BACK, DH, TOP, 'b')
  box(rock, -DW, DW, 6.0, BACK, 0, ZS + 0.5, 'b')
  box(dark, -DW, DW, 6.9, BACK - 0.2, ZS + 0.5, DH, 'b')
  box(rock, -DW, DW, BACK - 0.2, BACK, ZS + 0.5, DH, 'b')
  // door jambs and lintel stand proud of the wall
  for (const s of [-1, 1]) box(body, s < 0 ? -DW - 0.7 : DW, s < 0 ? -DW : DW + 0.7, 5.75, 6.0, ZS + 0.5, DH + 0.5, 'b')
  box(body, -DW - 0.9, DW + 0.9, 5.6, 6.0, DH + 0.5, DH + 1.4, 'b')
  box(body, -DW - 1.1, DW + 1.1, 5.45, 6.0, DH + 1.4, DH + 1.8, 'b')
  // pilasters flanking the door on the porch's back wall
  for (const s of [-1, 1]) box(body, s * 4.0 - 0.45, s * 4.0 + 0.45, 5.7, 6.0, ZS + 0.5, 12.2, 'b')
  // side-chamber doors in the porch's side walls
  for (const s of [-1, 1]) box(dark, s < 0 ? -6.1 : 5.88, s < 0 ? -5.88 : 6.1, 3.0, 4.6, ZS + 0.5, ZS + 0.5 + 4.2, 'b')

  // six columns
  const cols = [-10.8, -6.65, -2.85, 2.85, 6.65, 10.8]
  const R = 0.65, ZC = 10.9, ZK = 12.2
  for (const x of cols) {
    column(body, x, 0, ZS, ZC, R, cseg)
    corinthian(carve, x, 0, ZC, ZK, R * 0.86, detail)
  }
  // entablature: architrave, frieze, cornice; over the full width
  const EF = -0.75 // its front
  box(body, -W, W, EF + 0.1, 2.0, ZK, 13.0, '')
  box(body, -W, W, EF + 0.2, 2.0, 13.0, 13.9, 'b')
  bbox(body, -W - 0.3, W + 0.3, EF - 0.4, 2.0, 13.9, 14.9, 0.3)
  if (detail) {
    dentils(carve, -W, W, EF - 0.05, 13.75, 13.95)
    // frieze: scrolls and bosses (rinceau) as a row of bold bosses
    for (let i = 0; i < 24; i++) {
      const x = -W + 0.6 + (i * (2 * W - 1.2)) / 23
      blob(carve, [x, EF + 0.2, 13.45], [0.32, 0.12, 0.3], 6, 3)
    }
  }
  // the soffit of the porch roof lies at ZK; the entablature's underside closes it
  // pediment over the middle four columns
  const PX = 8.7, PZ = 14.9, PA = 16.85
  prismY(body, [[-PX, PZ], [PX, PZ], [0, PA]], EF - 0.3, 1.5)
  // raking cornices, bold
  for (const s of [-1, 1]) {
    const sec: [number, number][] = s < 0
      ? [[-PX - 0.35, PZ - 0.05], [-PX + 0.25, PZ - 0.05], [0, PA - 0.15], [0, PA + 0.45]]
      : [[PX - 0.25, PZ - 0.05], [PX + 0.35, PZ - 0.05], [0, PA + 0.45], [0, PA - 0.15]]
    prismY(carve, sec, EF - 0.55, 1.5)
  }
  // tympanum: the recessed field and its central relief
  if (detail) {
    blob(carve, [0, EF - 0.25, PZ + 0.75], [0.75, 0.2, 0.55], 8, 4)
    for (const s of [-1, 1]) for (let i = 1; i <= 3; i++) blob(carve, [s * (0.6 + i * 1.5), EF - 0.22, PZ + 0.45 + (3 - i) * 0.12], [0.55, 0.15, 0.22], 6, 3)
  } else blob(carve, [0, EF - 0.25, PZ + 0.7], [0.8, 0.25, 0.55], 6, 3)
  // acroterion on the apex
  blob(carve, [0, EF + 0.1, PA + 0.55], [0.55, 0.4, 0.5], detail ? 8 : 6, 4)
  // lions (eroded) on the cornice above the outer bays
  for (const s of [-1, 1]) lion(carve, s * 10.9, EF + 0.6, 14.9, 2.0, s < 0 ? 1 : -1, detail)

  // ---- upper storey ----
  const UB = 17.4, UC = 25.4, UK = 26.4, UE = 28.6
  // base band (attic), running the full width over the lower cornice
  box(body, -W, W, -0.35, 2.0, 14.9, UB, 'b')
  if (detail) for (let i = 0; i < 26; i++) {
    const x = -W + 0.5 + (i * (2 * W - 1.0)) / 25
    if (Math.abs(x) < PX + 0.2) continue // the pediment hides the middle
    blob(carve, [x, -0.38, 16.3], [0.28, 0.1, 0.28], 6, 3)
  }
  box(body, -W - 0.15, W + 0.15, -0.6, 2.0, UB - 0.35, UB, 'b')

  const UR = 0.55
  // side pavilions
  for (const s of [-1, 1]) {
    const xo = s * 11.0, xi = s * 6.75
    const [a, b] = s < 0 ? [-W, -5.2] : [5.2, W]
    // back wall with the Amazon on her pedestal
    box(rock, a, b, 1.6, 2.0, UB, UE, 'b')
    const cx = s * 8.9
    box(body, cx - 1.0, cx + 1.0, 0.9, 1.6, UB, UB + 1.7, 'b')
    box(body, cx - 1.15, cx + 1.15, 0.8, 1.6, UB + 1.7, UB + 1.95, 'b')
    // Amazon: double axe raised over her head in one hand
    const up: V3 = [s * -0.05, -0.05, 1.08]
    figure(carve, cx, 1.25, UB + 1.95, 3.6, s < 0 ? { rh: up, lh: [-0.2, -0.06, 0.5] } : { lh: [-up[0], up[1], up[2]], rh: [0.2, -0.06, 0.5] }, detail)
    const ax = cx + s * -0.05 * 3.6
    box(carve, ax - 0.06, ax + 0.06, 1.05, 1.2, UB + 1.95 + 3.0, UB + 1.95 + 4.3)
    box(carve, ax - 0.55, ax + 0.55, 1.0, 1.2, UB + 1.95 + 3.95, UB + 1.95 + 4.35)
    // columns: two in front, one on the inner corner at the back
    for (const x of [xo, xi]) {
      column(body, x, 0, UB, UC, UR, cseg)
      corinthian(carve, x, 0, UC, UK, UR * 0.86, detail)
    }
    // the outer anta behind the outer column
    box(body, s < 0 ? -W : W - 0.9, s < 0 ? -W + 0.9 : W, 0.2, 1.6, UB, UK, 'b')
    // entablature and the half-pediment, broken at the inner end
    box(body, a, b, -0.65, 1.6, UK, UK + 0.8, 'b')
    box(body, a, b, -0.55, 1.6, UK + 0.8, UK + 1.5, 'b')
    bbox(body, a - (s < 0 ? 0.3 : 0), b + (s > 0 ? 0.3 : 0), -1.05, 1.6, UK + 1.5, UE, 0.25)
    if (detail) dentils(carve, a, b, -0.75, UK + 1.35, UK + 1.55)
    const xo2 = s < 0 ? a - 0.3 : b + 0.3, xi2 = s < 0 ? b : a
    const apex = 31.0
    const tri: [number, number][] = s < 0 ? [[xo2, UE], [xi2, UE], [xi2, apex]] : [[xi2, UE], [xo2, UE], [xi2, apex]]
    prismY(body, tri, -0.6, 1.6)
    const rake: [number, number][] = s < 0
      ? [[xo2 - 0.1, UE - 0.05], [xo2 + 0.6, UE - 0.05], [xi2, apex - 0.2], [xi2, apex + 0.45]]
      : [[xo2 - 0.6, UE - 0.05], [xo2 + 0.1, UE - 0.05], [xi2, apex + 0.45], [xi2, apex - 0.2]]
    prismY(carve, rake, -0.95, 1.6)
    // eagles at both ends of the half-pediment
    eagle(carve, xi2 - s * 0.9, 0.3, apex - 0.3, 1.9, detail)
    eagle(carve, xo2 - s * 0.9, 0.3, UE, 1.7, detail)
  }
  // recesses beside the tholos, with a Victory each and a column at the back
  for (const s of [-1, 1]) {
    const [a, b] = s < 0 ? [-5.2, -3.4] : [3.4, 5.2]
    box(body, a, b, 1.6, 3.0, UK + 0.8, UE, 'b') // the soffit over it
    figure(carve, s * 4.3, 2.75, UB + 1.2, 3.1, { wings: true, lh: [-0.16, -0.1, 0.62], rh: [0.16, -0.1, 0.62] }, detail)
    box(body, s * 4.3 - 0.7, s * 4.3 + 0.7, 2.3, 3.0, UB, UB + 1.2, 'b')
    column(body, s * 5.55, 1.75, UB, UC, UR * 0.85, cseg)
    corinthian(carve, s * 5.55, 1.75, UC, UK, UR * 0.75, detail)
  }
  // the tholos
  const TX = 0, TY = 1.8, TR = 2.9
  lathe(body, TX, TY, [[2.25, UB], [2.25, UK]], detail ? 32 : 16, { a0: -Math.PI * 0.62, a1: Math.PI * 0.62 }) // cella drum
  // Tyche on her pedestal on the drum's front
  box(body, -0.75, 0.75, TY - 2.75, TY - 2.0, UB, UB + 1.6, 'b')
  box(body, -0.9, 0.9, TY - 2.9, TY - 2.0, UB + 1.6, UB + 1.85, 'b')
  figure(carve, 0, TY - 2.35, UB + 1.85, 3.5, { lh: [-0.18, -0.12, 0.55], rh: [0.12, -0.15, 0.7] }, detail)
  blob(carve, [0.12 * 3.5 + 0.1, TY - 2.35 - 0.5, UB + 1.85 + 0.82 * 3.5], [0.22, 0.2, 0.45], 6, 3) // cornucopia
  for (const deg of [-100, -42, 42, 100]) {
    const a = (deg * Math.PI) / 180
    const x = TX + TR * Math.sin(a), y = TY - TR * Math.cos(a)
    column(body, x, y, UB, UC, UR, cseg)
    corinthian(carve, x, y, UC, UK, UR * 0.86, detail)
  }
  // tholos entablature ring, roof, capital and urn
  const ring: [number, number][] = [[TR + 0.75, UK], [TR + 0.75, UK + 1.4], [TR + 1.1, UK + 1.55], [TR + 1.15, UE - 0.2], [TR + 0.9, UE]]
  const arc = { a0: -Math.PI * 0.7, a1: Math.PI * 0.7 }
  lathe(body, TX, TY, [[TR - 0.6, UK], ...ring], detail ? 32 : 16, { ...arc, top: false })
  // the tent roof, slightly concave, rising out of the ring
  lathe(body, TX, TY, [[TR + 0.9, UE], [TR * 0.75, UE + 0.55], [1.5, UE + 1.35], [0.9, UE + 2.0]], detail ? 32 : 16, { ...arc, top: true })
  if (detail) for (let i = -6; i <= 6; i++) {
    // the scalloped (acanthus) rim of the roof
    const a = (i / 6) * Math.PI * 0.62
    blob(carve, [TX + (TR + 0.95) * Math.sin(a), TY - (TR + 0.95) * Math.cos(a), UE + 0.1], [0.28, 0.28, 0.35], 5, 3)
  }
  const ZU = UE + 2.0
  lathe(carve, TX, TY, [[0.75, ZU], [0.8, ZU + 0.5], [1.2, ZU + 1.0], [1.35, ZU + 1.25]], detail ? 16 : 10, { top: true }) // capital
  // the urn
  const urn: [number, number][] = [[0.55, ZU + 1.25], [0.45, ZU + 1.55], [0.75, ZU + 1.85], [1.0, ZU + 2.55], [0.95, ZU + 3.1], [0.55, ZU + 3.45], [0.6, ZU + 3.65], [0.35, ZU + 3.95], [0.12, ZU + 4.2]]
  lathe(carve, TX, TY, urn, detail ? 18 : 10, { top: true })

  for (const part of Object.values(M)) shiftY(part, FRONT)
  return M
}

// Night: Petra by Night lights the facade from the plaza; the lower storey
// most, the upper less, faces looking up and the rock barely.
const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : n[1] > 0.5 ? 0 : p[2] < 17 ? 0.85 : p[2] < 32 ? 0.6 : 0.35)
const litRock = (p: V3, n: V3) => (n[1] < -0.5 && p[2] < 30 ? 0.3 : 0.1)

function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.body, material: { ...finish('khazneh-sandstone', 0xe6ad94), floodlight: lit } },
    { part: M.carve, material: { ...finish('khazneh-carving', 0xebbca4), floodlight: lit } },
    { part: M.rock, material: { ...finish('khazneh-rock', 0xc98270), floodlight: litRock } },
    { part: M.dark, material: finish('khazneh-shadow', 0x6e4a40) },
  ]
}

if (import.meta.main) {
  const extras = { bearing: BEARING, elevation: 0, height: 39.1 }
  await writeModel('petra-al-khazneh', 'Al-Khazneh', materials(build(false)), extras, 6500, 250_000)
  await writeModel('petra-al-khazneh', 'Al-Khazneh', materials(build(true)), extras, 40_000, 1536 * 1024, '.detail')
}
