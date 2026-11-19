/**
 * Sensō-ji (金龍山 浅草寺), Asakusa, Tokyo: the Main Hall (Hondō), the
 * Five-storey Pagoda (Gojū-no-tō) and the Hōzōmon gate, as one precinct
 * model — procedural, CC0-1.0.
 * bun generators/tokyo-sensoji.ts
 *
 * Writes models/tokyo-sensoji.glb (low) and models/tokyo-sensoji.detail.glb
 * (detail: real bracket sets, round columns, the pagoda's doors, balcony
 * railings, white rafter ends under the eaves, finer roof curves).
 *
 * This file also exports the temple kit tokyo-kaminarimon.ts builds with
 * (gable roof, lathe, the curved hipped / hipped-and-gabled roof `jroof`
 * copied from the hanok kit in seoul-geunjeongjeon.ts with a coarse option,
 * and small pieces). The model is only written when this file runs itself.
 * `ONLY=hall|pagoda|hozomon OUT=<dir>` writes one building alone, for
 * comparing with photos.
 *
 * Map frame: x east, y north, z up, metres, turned to the precinct's axis:
 * the OSM outlines' sides run at 95.4°, so the catalog bearing is 5.4. The
 * origin is the middle of the three buildings' bounding box (139.7964763,
 * 35.7144178); the hall is centred at (21.35, 37.3), the gate at
 * (21.25, -51.75) on the same axis, the pagoda at (-36.4, -38.5).
 *
 * Identity, in order: the Main Hall's huge steep grey roof, a wide flat
 * skirt and a tall upper slope with big vermilion gables east and west,
 * over a vermilion hall on a granite platform; the vermilion five-storey
 * pagoda with grey eaves and its tall gilt sōrin of nine rings; Hōzōmon, a
 * two-storey vermilion gate with two broad grey roofs and the great red
 * lantern in its middle bay between two bronze lanterns.
 *
 * Evidence:
 *  - OSM: way/91008673 Main Hall (48.7 × 47.6 m: the eaves; height 29.4),
 *    way/173154770 pagoda (18.4 × 17.9 m, height 53.32), way/573271561
 *    Hōzōmon (31.7 × 18.5 m, height 21.7), way/675582837 the halls round
 *    the pagoda (its base hall and the low wings round its court; the
 *    pagoda stands inside it). The outline is tangled, so the wings are
 *    drawn as five plain single-storey hipped blocks (eaves 3.9 m) on
 *    rectangles fitted to its corners, the east, north and south-east ones
 *    roofed in green copper as the amulet halls on the plaza are (Hałun's
 *    pagoda photo), the others grey; the pagoda's base hall low (eave
 *    5.4 m) round the pagoda's ~5 m base.
 *  - published (ja.wikipedia 浅草寺; the temple's own descriptions as quoted
 *    there): Main Hall rebuilt 1958 in reinforced concrete, re-roofed in
 *    titanium tile 2009-10, 34.5 × 32.7 m (7 × 7 bays drawn), its lantern
 *    志ん橋 4.5 m high, 3.5 m across; pagoda rebuilt 1973, ~48 m on a ~5 m
 *    base (OSM's 53.32 m overall used), titanium tile since 2017; Hōzōmon
 *    rebuilt 1964, titanium tile since 2007.
 *  - heights within the buildings, scaled from photos against those totals
 *    (estimates): hall floor 2.8 m, column tops 9.2, eave 11.6 at the
 *    middle, a thin flat skirt up to the gable foot at 15.2, then the steep
 *    tall upper roof to the ridge at 27.9 (+1.25 ridge, ~29 m); the roof's
 *    silhouette from KENPEI's frontal view (the upper face 0.57 of the eave
 *    width at its foot, 0.49 at the ridge: the gables lean in, ridge
 *    ±11.6 m) and the gable's size (about half the side, 12.7 m tall, its
 *    foot just above the eave; vermilion with gilt and white bands for its
 *    carved truss) from Hałun's south-east view. Pagoda (reworked after
 *    review to its slender proportions): on its 5 m base, five vermilion
 *    storeys (bodies 9.2 m wide at the bottom to 7.2 m at the top), eaves
 *    at 12.4, 18.0, 23.6, 29.2 and 34.8 m stepping in from 16 to 13.6 m
 *    across, the top roof to 37.6 m and the gilt sōrin above it to 53.3 m
 *    (Hałun's far view and Kakidai's: the sōrin about a third of the
 *    height). Hōzōmon:
 *    lower eave 10.1, upper storey 11.9-17.1, ridge 20.6 (+0.9; OSM 21.7),
 *    5 × 2 bays, both roofs about as wide as the outline (Christophe95).
 *  - colours (daylight photos): vermilion #c6503f, titanium tile #a2a6a9
 *    (KENPEI's front view in sun; one tile colour for all three buildings,
 *    though the pagoda's roofs read a little darker), white plaster (also
 *    used for the pale granite platforms and steps), green copper #8fb3a2
 *    on the amulet halls, gilt sōrin and ornaments; the open front of the hall and the
 *    Niō bays as dark slate (`window`), lit at night.
 *  - night: the three buildings are floodlit (Kakidai's night photos); the
 *    wings round the pagoda's court are not.
 *  - terrain: `tools/terrain.ts check` ok; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Main Hall, Sensō-ji Temple, Tokyo, 20240824 1104 5619.jpg, Jakub Hałun, CC BY 4.0 (hall, south-east)
 *  - Sensoji-hondo1.jpg, KENPEI, CC BY 3.0 (hall, front)
 *  - Senso-ji Haupthalle 1.jpg, Zairon, CC BY-SA 4.0 (hall, front)
 *  - Side view of Hondo (Main Hall) of Sensoji Temple.JPG, そらみみ (Soramimi), CC BY-SA 4.0 (eaves, roof tile)
 *  - Five-storied Pagoda, Sensoji, Tokyo, 20240824 1103 5616.jpg, Jakub Hałun, CC BY 4.0 (pagoda, far)
 *  - Five-storied Pagoda - Sensoji.jpg, Kakidai, CC BY-SA 4.0 (pagoda and its base hall)
 *  - Hōzōmon from the south.jpg, Christophe95, CC BY-SA 4.0
 *  - Hōzōmon and five-story pagoda.jpg, Kanon (ja.wikipedia), CC BY-SA 3.0 (eaves, lanterns, sōrin)
 *  - Pnorama of Sensoji.jpg, Kakidai, CC BY-SA 4.0 (the precinct from the south, above)
 *  - Sensoji at night 5.JPG, Kakidai, CC BY-SA 3.0 (night: pagoda and Hōzōmon floodlit, the halls beside them dark)
 * No commercial imagery. No look-only references.
 *
 * Left out: the roof ornaments' detail (shachi, the gable's carving drawn as
 * two gilt bars), the giant straw sandals on Hōzōmon's back, the Niō
 * statues (their bays are dark), the incense burner and the smaller halls
 * (Asakusa Shrine, Yogōdō, the water pavilion) which stay as OSM draws them.
 * Doubts: the wings round the pagoda's court (way/675582837) are plain
 * guesses at height and roof (some are green copper in the photos, drawn
 * grey); the hall's interior depth behind the open front; the pagoda's
 * storey heights rest on one far photo; the main hall's platform height.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { box, prism, bar, roof as hipRoof, storey, columns, brackets, platform, type HanokParts, type RoofOpts } from './seoul-geunjeongjeon'
import { finish, PALETTE } from './palette'

export { box, prism, bar, hipRoof, storey, columns, brackets, platform, type HanokParts, type RoofOpts }

export const TAU = Math.PI * 2
export const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A quad wound to face `want`. */
export function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (dot(n, want) >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/** A triangle wound to face `want`. */
export function triOut(p: Part, a: V3, b: V3, c: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (dot(n, want) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** A grid surface P[i][j], smooth-shaded, wound to face `want(i, j)` (default cross(di, dj)). */
export function grid(p: Part, P: V3[][], flip = false) {
  const I = P.length, J = P[0].length
  const N = P.map((row, i) => row.map((_, j) => {
    const di = sub(P[Math.min(I - 1, i + 1)][j], P[Math.max(0, i - 1)][j])
    const dj = sub(P[i][Math.min(J - 1, j + 1)], P[i][Math.max(0, j - 1)])
    const c = cross(di, dj)
    if (Math.hypot(...c) < 1e-9) return null
    const n = norm(c)
    return flip ? [-n[0], -n[1], -n[2]] as V3 : n
  })).map((row, i) => row.map((n, j) => n ?? row[j > 0 ? j - 1 : j + 1] ?? [0, 0, 1] as V3)) as V3[][]
  for (let i = 0; i < I - 1; i++) for (let j = 0; j < J - 1; j++) {
    const a = P[i][j], b = P[i + 1][j], c = P[i + 1][j + 1], d = P[i][j + 1]
    const area = (x: V3, y: V3, z: V3) => Math.hypot(...cross(sub(y, x), sub(z, x)))
    if (area(a, b, c) > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [N[i][j], N[i + 1][j], N[i + 1][j + 1]])
    if (area(a, c, d) > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [N[i][j], N[i + 1][j + 1], N[i][j + 1]])
  }
}

/**
 * A surface of revolution about the vertical axis at (cx, cy), from a profile
 * of [r, z] going upward (outside on the left of travel), `k` sides,
 * smooth-shaded. Caps where r falls to 0.
 */
export function lathe(p: Part, cx: number, cy: number, profile: [number, number][], k = 16, a0 = 0) {
  const rings = profile.map(([r, z]) => Array.from({ length: k + 1 }, (_, i) => {
    const a = a0 + (i / k) * TAU
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  }))
  // grid wants P[i][j]: i around, j up; cross(around, up) points outward.
  const P = Array.from({ length: k + 1 }, (_, i) => rings.map((ring) => ring[i]))
  grid(p, P)
}

/** A horizontal disc (cap) of radius r at z, facing up or down. */
export function disc(p: Part, cx: number, cy: number, r: number, z: number, up: boolean, k = 16, a0 = 0) {
  const c: V3 = [cx, cy, z]
  for (let i = 0; i < k; i++) {
    const a = a0 + (i / k) * TAU, b = a0 + ((i + 1) / k) * TAU
    triOut(p, c, [cx + r * Math.cos(a), cy + r * Math.sin(a), z], [cx + r * Math.cos(b), cy + r * Math.sin(b), z], [0, 0, up ? 1 : -1])
  }
}

/** An ellipsoid-ish blob (lathe of a circle), for heads, jewels and drums. */
export function ball(p: Part, cx: number, cy: number, cz: number, r: number, k = 10, rz = r) {
  const prof: [number, number][] = []
  const m = Math.max(4, Math.round(k / 2))
  for (let j = 0; j <= m; j++) {
    const t = -Math.PI / 2 + (j / m) * Math.PI
    prof.push([Math.max(1e-4, r * Math.cos(t)), cz + rz * Math.sin(t)])
  }
  lathe(p, cx, cy, prof, k)
}

/** A box rotated about the z axis by `rot` radians around its centre (cx, cy). */
export function rbox(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, rot = 0, skip = '') {
  const c = Math.cos(rot), s = Math.sin(rot)
  const at = (x: number, y: number, z: number): V3 => [cx + x * c - y * s, cy + x * s + y * c, z]
  const B = [at(-hx, -hy, z0), at(hx, -hy, z0), at(hx, hy, z0), at(-hx, hy, z0)]
  const T = [at(-hx, -hy, z1), at(hx, -hy, z1), at(hx, hy, z1), at(-hx, hy, z1)]
  const outs: V3[] = [[s, -c, 0], [c, s, 0], [-s, c, 0], [-c, -s, 0]]
  const names = 'sENW'.toLowerCase()
  for (let k = 0; k < 4; k++) {
    if (skip.includes(names[k])) continue
    const l = (k + 1) % 4
    quadOut(p, B[k], B[l], T[l], T[k], outs[k])
  }
  if (!skip.includes('t')) quadOut(p, T[0], T[1], T[2], T[3], [0, 0, 1])
  if (!skip.includes('b')) quadOut(p, B[0], B[1], B[2], B[3], [0, 0, -1])
}

// ---------------------------------------------------------------------------
// The gabled (kirizuma) roof, for gates.

export type GableOpts = {
  cx?: number; cy?: number
  /** Half-length along x (verge to verge) and half-depth (eave to ridge), at the eave's middle. */
  L: number; D: number
  /** Top of the tile at the eave's middle, and at the ridge. */
  ze: number; zr: number
  /** Corner upturn: how much the eave ends rise, from where (fraction of L) and how sharply. */
  lift: number; from?: number; pow?: number
  /** Concavity: 0 straight, ~0.5 the usual. */
  sag?: number
  /** Thickness of the roof slab (tile to soffit). */
  th?: number
  /** The ridge: half-length, height and width; onigawara height at its ends. */
  ridge: { half: number; h: number; w: number; oni: number }
  /** The verge ridges (kudari-mune) along the gable edges, width and height. */
  verge?: { w: number; h: number }
  /** Tile rows (rounded hongawara ribs) running down the slopes: spacing, width, height. */
  ribs?: { step: number; w: number; h: number }
  /** Share of the eave edge that is tile ends (the rest is the white rafter-end line). */
  edge?: number
}

export type GableParts = { tile: Part; soffit: Part; edge: Part; barge: Part }

/** A gable roof whose ridge runs along x. */
export function gableRoof(P: GableParts, o: GableOpts) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0
  const sag = o.sag ?? 0.45, th = o.th ?? 0.5, from = o.from ?? 0.5, pow = o.pow ?? 1.8
  const U = [0, 0.25, 0.45, 0.6, 0.72, 0.82, 0.9, 0.96, 1]
  const us = [...U.slice(1).reverse().map((u) => -u), ...U]
  const T = [0, 0.12, 0.28, 0.48, 0.72, 1]
  const prof = (t: number) => (1 - sag) * t + sag * t * t
  const lift = (u: number, t: number) => {
    const q = Math.max(0, (Math.abs(u) - from) / (1 - from))
    return o.lift * Math.pow(q, pow) * Math.pow(1 - t, 1.2)
  }
  // side s = -1 front (south, -y), +1 back.
  const at = (s: number, u: number, t: number, dz = 0): V3 => [cx + u * o.L, cy + s * o.D * (1 - t), o.ze + (o.zr - o.ze) * prof(t) + lift(u, t) + dz]
  for (const s of [-1, 1]) {
    const top = us.map((u) => T.map((t) => at(s, u, t)))
    const bot = us.map((u) => T.map((t) => at(s, u, t, -th)))
    // Faces: cross(d/du, d/dt) — for s = -1, +x × (+y,+z) points up and out.
    grid(P.tile, top, s > 0)
    grid(P.soffit, bot, s < 0)
    // Eave edge: the upper half tile ends (tile), the lower half rafter ends (edge).
    for (let i = 0; i < us.length - 1; i++) {
      const a = at(s, us[i], 0), b = at(s, us[i + 1], 0)
      const m = th * (o.edge ?? 0.5)
      const out: V3 = [0, s, 0]
      quadOut(P.tile, [a[0], a[1], a[2] - m], [b[0], b[1], b[2] - m], b, a, out)
      quadOut(P.edge, [a[0], a[1], a[2] - th], [b[0], b[1], b[2] - th], [b[0], b[1], b[2] - m], [a[0], a[1], a[2] - m], out)
    }
    if (o.ribs) {
      const n = Math.floor((2 * o.L) / o.ribs.step)
      for (let i = 1; i < n; i++) {
        const u = -1 + (2 * i) / n
        bar(P.tile, T.map((t) => at(s, u, Math.min(t, 0.97))), o.ribs.w, o.ribs.h, 0.05, false, false)
      }
    }
    // Verges: barge boards.
    for (const e of [-1, 1]) {
      const u = e
      for (let j = 0; j < T.length - 1; j++) {
        const a = at(s, u, T[j]), b = at(s, u, T[j + 1])
        quadOut(P.barge, [a[0], a[1], a[2] - th * 1.4], [b[0], b[1], b[2] - th * 1.4], b, a, [e, 0, 0])
      }
      // Underside of the barge board's extra depth.
      // Verge ridge on top.
      if (o.verge) {
        const pts = T.slice().reverse().map((t) => at(s, u * (1 - 0.02), t, 0))
        // stop short of the ridge onigawara; start at the ridge end.
        bar(P.tile, pts, o.verge.w, o.verge.h, 0.1, true, false)
      }
    }
  }
  // The ridge and its onigawara.
  const R = o.ridge
  bar(P.tile, [[cx - R.half, cy, o.zr], [cx + R.half, cy, o.zr]], R.w, R.h, 0.3, true, false)
  for (const e of [-1, 1]) {
    const x = cx + e * R.half
    box(P.tile, x - 0.55, cy - R.w * 0.8, o.zr, x + 0.55, cy + R.w * 0.8, o.zr + R.oni, 'b')
  }
  return { at }
}

// ---------------------------------------------------------------------------
// Japanese temple pieces

/** A round column, smooth, with a capped top hidden under a beam. */
export function column(p: Part, x: number, y: number, z0: number, z1: number, r: number, n = 10) {
  prism(p, x, y, z0, z1, r, r * 0.97, n)
}

/**
 * A ring of rafter ends (taruki-bana) under an eave, as small blocks along a
 * line from a to b at height z, every `step`: the white dashes that read
 * under every Japanese eave.
 */
export function rafterEnds(p: Part, a: V3, b: V3, step: number, w: number, h: number, depth: number, out: V3) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.max(1, Math.floor(L / step))
  const tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L
  for (let i = 0; i <= n; i++) {
    const f = (i + 0.5) / (n + 1)
    const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, z = a[2] + (b[2] - a[2]) * f
    const rot = Math.atan2(ty, tx)
    rbox(p, x + out[0] * depth / 2, y + out[1] * depth / 2, w / 2, depth / 2, z - h / 2, z + h / 2, rot, 'b')
  }
}

export type Mat = { part: Part; material: MaterialSpec }

export async function save(id: string, name: string, parts: Mat[], file: string, maxTri: number, maxBytes: number, extras: Record<string, unknown>) {
  const used = parts.filter((x) => x.part.triangles > 0)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const triangles = used.reduce((s, x) => s + x.part.triangles, 0)
  console.log(used.map((x) => `${x.material.name} ${x.part.triangles}`).join(', '))
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', ...extras })
  if (!process.env.DRAFT && (triangles > maxTri || glb.length > maxBytes)) throw new Error(`${file}: budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = file.startsWith('/') ? file : new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

/**
 * A plain hipped block: walls from 0 to `ze` on the rectangle, and a planar
 * hipped roof overhanging by `over`, rising `rise` to a ridge along the
 * longer side. For the low halls round a precinct.
 */
export function hipBlock(walls: Part, roofP: Part, x0: number, y0: number, x1: number, y1: number, ze: number, rise: number, over = 1.2, band?: Part, detailBands = true) {
  box(walls, x0, y0, 0, x1, y1, ze, 'bt')
  if (band && detailBands) box(band, x0 - 0.02, y0 - 0.02, ze - 1.2, x1 + 0.02, y1 + 0.02, ze - 0.2, 'bt')
  const X0 = x0 - over, X1 = x1 + over, Y0 = y0 - over, Y1 = y1 + over
  const zt = ze + 0.3, zr = zt + rise
  const along = X1 - X0 >= Y1 - Y0
  const hw = along ? (Y1 - Y0) / 2 : (X1 - X0) / 2
  const cx = (X0 + X1) / 2, cy = (Y0 + Y1) / 2
  const r0: V3 = along ? [X0 + hw, cy, zr] : [cx, Y0 + hw, zr]
  const r1: V3 = along ? [X1 - hw, cy, zr] : [cx, Y1 - hw, zr]
  const c: V3[] = [[X0, Y0, zt], [X1, Y0, zt], [X1, Y1, zt], [X0, Y1, zt]]
  // Eave slab edge and soffit.
  box(roofP, X0, Y0, zt - 0.35, X1, Y1, zt, 't')
  if (along) {
    quadOut(roofP, c[0], c[1], r1, r0, [0, -1, 1])
    quadOut(roofP, c[2], c[3], r0, r1, [0, 1, 1])
    triOut(roofP, c[1], c[2], r1, [1, 0, 1])
    triOut(roofP, c[3], c[0], r0, [-1, 0, 1])
  } else {
    quadOut(roofP, c[1], c[2], r1, r0, [1, 0, 1])
    quadOut(roofP, c[3], c[0], r0, r1, [-1, 0, 1])
    triOut(roofP, c[0], c[1], r0, [0, -1, 1])
    triOut(roofP, c[2], c[3], r1, [0, 1, 1])
  }
  bar(roofP, [r0, r1], 0.5, 0.45, 0.1)
}


// ---------------------------------------------------------------------------
// The curved temple roof: the hanok kit's roof (seoul-geunjeongjeon.ts),
// copied so its resolution can drop for a low model (`coarse`).

export function jroof(P: HanokParts, o: RoofOpts & { coarse?: boolean | 2; noHips?: boolean; rx?: number }) {
  const cx = o.cx ?? 0, cy = o.cy ?? 0
  const pow = o.pow ?? 1.6, sag = o.sag ?? 0.5, th = o.th ?? 0.6
  const zr = o.zr ?? o.zg
  const U = o.coarse === 2 ? [0, 0.6, 0.9, 1] : o.coarse ? [0, 0.45, 0.75, 0.92, 1] : [0, 0.3, 0.5, 0.64, 0.75, 0.84, 0.91, 0.96, 1]
  const us = [...U.slice(1).reverse().map((u) => -u), ...U]
  const T = o.kind === 'skirt' ? (o.coarse ? [0, 0.4, 1] : [0, 0.3, 0.65, 1]) : o.coarse ? [0, 0.25, 0.6, 1] : [0, 0.14, 0.33, 0.57, 0.8, 1]
  const prof = (t: number) => (1 - sag) * t + sag * t * t
  // The sweep fades slowly up the slope, so the tile surface rises with the
  // eave to the very tip instead of the eave lifting off as a thin wing.
  const L = (t: number) => Math.pow(1 - t, 1.15)
  // A point on the hip band, in the front (-y) orientation: `A` along-half
  // at the eave, `B` out-distance at the eave; `A1`, `B1` at the gable foot.
  const band = (A: number, B: number, A1: number, B1: number) => (u: number, t: number): [number, number, number] => {
    // The upturn starts a third of the way out from the middle and grows
    // smoothly to the corner.
    const q = Math.max(0, (Math.abs(u) - 0.3) / 0.7), a = Math.pow(q, pow), l = L(t)
    const along = u * (A + (A1 - A) * t + o.flare * l * a)
    const out = B + (B1 - B) * t + o.flare * l * a
    return [along, -out, o.ze + (o.zg - o.ze) * prof(t) + o.lift * l * a]
  }
  // Turn a front-oriented (along, -out) into side k: 0 S, 1 E, 2 N, 3 W.
  const turn = (k: number, [x, y, z]: [number, number, number]): V3 => {
    const r = [[x, y], [-y, x], [-x, -y], [y, -x]][k]
    return [cx + r[0], cy + r[1], z]
  }
  const sides = [0, 1, 2, 3].map((k) => (k % 2 === 0 ? band(o.ex, o.ey, o.gx, o.gy) : band(o.ey, o.ex, o.gy, o.gx)))
  for (let k = 0; k < 4; k++) grid(P.roof, us.map((u) => T.map((t) => turn(k, sides[k](u, t)))))

  // Eave ring (counter-clockwise from above), fascia and soffit.
  const ring: V3[] = []
  for (let k = 0; k < 4; k++) for (const u of us.slice(0, -1)) ring.push(turn(k, sides[k](u, 0)))
  const n = ring.length
  const low = ring.map(([x, y, z]) => [x, y, z - th] as V3)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    P.roof.quad(low[i], low[j], ring[j], ring[i])
  }
  if (o.soffit) {
    const { bx, by, zb } = o.soffit
    const inner: V3[] = []
    for (let k = 0; k < 4; k++) for (const u of us.slice(0, -1)) {
      const [x, y] = k % 2 === 0 ? [u * bx, -by] : [u * by, -bx]
      inner.push(turn(k, [x, y, zb]))
    }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      P.teal.quad(low[i], inner[i], inner[j], low[j])
    }
  }

  // Hip ridges along the corner lines.
  const hr = o.hipRidge ?? { w: 0.36, h: 0.32 }
  for (let k = 0; k < (o.noHips ? 0 : 4); k++) {
    const line = (o.kind === 'skirt' ? [0, 0.3, 1] : o.coarse ? [0, 0.25, 1] : [0, 0.14, 0.33, 0.6, 1]).map((t) => turn(k, sides[k](1, t)))
    // Run the ridge a little past the corner, rising, for the upturned tip.
    const a = line[0], b = line[1], d = norm(sub(a, b))
    const tip: V3 = [a[0] + d[0] * 0.1, a[1] + d[1] * 0.1, a[2] + d[2] * 0.1 + 0.05]
    bar(P.stone, [tip, ...line], hr.w, hr.h, 0.25, true, false)
  }

  const gx = o.gx, gy = o.gy
  if (o.kind === 'skirt') {
    // The white band where the skirt meets the upper storey's wall.
    const w: V3[] = [[cx - gx, cy - gy, o.zg], [cx + gx, cy - gy, o.zg], [cx + gx, cy + gy, o.zg], [cx - gx, cy + gy, o.zg]]
    for (let k = 0; k < 4; k++) bar(P.stone, [w[k], w[(k + 1) % 4]], hr.w, hr.h, 0.1, true, false)
    return
  }

  // Above the gable foot: front and back slopes up to the ridge.
  if (o.kind === 'paljak') {
    const TU = o.coarse ? [0, 0.5, 1] : [0, 0.3, 0.62, 1]
    // rx: the ridge's half-length, when the gables lean in (Sensō-ji's hall).
    const rx = o.rx ?? gx
    const ax = (t: number) => gx + (rx - gx) * t
    const top = (u: number, t: number): [number, number, number] => [u * ax(t), -gy * (1 - t), o.zg + (zr - o.zg) * (t * (1 - sag * 0.4) + sag * 0.4 * t * t)]
    for (const k of [0, 2]) grid(P.roof, (o.coarse ? [-1, 1] : [-1, -0.5, 0, 0.5, 1]).map((u) => TU.map((t) => turn(k, top(u, t)))))
    // Gable triangles, red boarding, facing east and west.
    for (const k of [1, 3]) {
      P.red.tri(turn(k, [-gy, -gx, o.zg]), turn(k, [gy, -gx, o.zg]), turn(k, [0, -rx, zr]))
      // Rake ridges (naerim-maru) down both edges of the gable.
      for (const s of [-1, 1]) bar(P.stone, TU.map((t) => turn(k, [s * gy * (1 - t), -ax(t) - 0.05, o.zg + (zr - o.zg) * (t * (1 - sag * 0.4) + sag * 0.4 * t * t)])), hr.w, hr.h, 0.1, true, false)
    }
  }
  // Main ridge, sagging a little, and its end ornaments.
  const R = o.ridge ?? { h: 1.0, w: 0.9 }
  const rs = o.ridgeSag ?? 0.25
  const rl = (o.rx ?? gx) + (o.kind === 'paljak' ? 0.3 : 0)
  const rpts: V3[] = [-1, -0.6, -0.25, 0.25, 0.6, 1].map((s) => [cx + s * rl, cy, zr + rs * s * s])
  bar(P.stone, rpts, R.w, R.h, 0.6, true, false)
  if (R.ornament) for (const s of [-1, 1]) {
    // Chwidu: a block standing on the ridge end, its top hooked inwards.
    const x = cx + s * rl, z = zr + rs + R.h - 0.1, h = R.ornament
    const x0 = x - s * 1.2, x1 = x + s * 0.15
    box(P.roof, x0, cy - R.w * 0.75, z, x1, cy + R.w * 0.75, z + h * 0.7, 'b')
    box(P.roof, x0 + s * 0.2, cy - R.w * 0.6, z + h * 0.7, x0 + s * 0.85, cy + R.w * 0.6, z + h, 'b')
  }
}


// ===========================================================================
// Sensō-ji: the Main Hall, the Five-storey Pagoda and the Hōzōmon.

type Sz = { detail: boolean }

function buildSensoji(S: Sz) {
  const verm = new Part(), tile = new Part(), plaster = new Part(), gold = new Part(), green = new Part(), win = new Part()
  // Platforms and steps are pale granite, drawn in the plaster white; the sixth
  // material is the green copper of some of the halls round the pagoda.
  const stone = plaster
  // The hanok kit's parts, re-cast for Japanese colouring: lintel bands
  // white between vermilion posts, brackets vermilion on a white frieze,
  // grey ridges, vermilion soffits and gables.
  const forStorey: HanokParts = { roof: tile, stone, red: verm, green: plaster, teal: verm, lattice: win }
  const forBrackets: HanokParts = { roof: tile, stone, red: verm, green: verm, teal: plaster, lattice: win }
  const forRoof: HanokParts = { roof: tile, stone: tile, red: verm, green: verm, teal: verm, lattice: win }

  const all = [verm, tile, plaster, gold, green, win]
  let seen = 0
  const tally = (label: string) => {
    const n = all.reduce((t, p) => t + p.triangles, 0)
    if (process.env.TALLY) console.log(`  ${label}: ${n - seen}`)
    seen = n
  }
  // ONLY=hall|pagoda|hozomon builds one of the three, for comparing with photos.
  const only = process.env.ONLY
  if (!only || only === 'hall') hall(S, forStorey, forBrackets, forRoof, verm, tile, plaster, gold, stone, win, tally)
  if (!only || only === 'pagoda') pagoda(S, forStorey, forBrackets, forRoof, verm, tile, plaster, gold, green, win, tally)
  if (!only || only === 'hozomon') hozomon(S, forStorey, forBrackets, forRoof, verm, tile, plaster, gold, stone, win, tally)

  // Night: the hall, the pagoda and the gate are floodlit; the halls round
  // the pagoda's court are not (only what is above their eaves, or at the
  // hall and the gate, is lit).
  const lit = (p: V3) => p[2] > 9 || p[1] > 12 || (p[0] > 4.5 && p[1] < -40) || (p[2] > 5 && Math.hypot(p[0] + 36.4, p[1] + 38.5) < 9.5)
  const flood = (k: number) => (p: V3, n: V3) => (lit(p) ? k * (n[2] > 0.6 ? 0.3 : 1) : 0)
  const parts: Mat[] = [
    { part: verm, material: { ...finish('sensoji-vermilion', 0xc6503f), floodlight: flood(0.95) } },
    { part: tile, material: finish('titanium-tile', 0xa2a6a9) },
    { part: plaster, material: { ...finish('shikkui-white', 0xeeeae2), floodlight: flood(0.85) } },
    { part: gold, material: { ...finish('gilt', 0xd4ab4f), floodlight: flood(1) } },
    { part: green, material: finish('copper-green', 0x8fb3a2) },
    { part: win, material: PALETTE.window },
  ]
  return parts
}

/** White rafter ends along the straight middle of each eave (the corners sweep up, so they stop short). */
function eaveDashes(p: Part, cx: number, cy: number, ex: number, ey: number, z: number, frac: number) {
  const step = 0.55
  for (const s of [-1, 1]) {
    rafterEnds(p, [cx - ex * frac, cy + s * (ey - 0.35), z], [cx + ex * frac, cy + s * (ey - 0.35), z], step, 0.18, 0.18, 0.3, [0, s, 0])
    rafterEnds(p, [cx + s * (ex - 0.35), cy - ey * frac, z], [cx + s * (ex - 0.35), cy + ey * frac, z], step, 0.18, 0.18, 0.3, [s, 0, 0])
  }
}

// ---- Main Hall (Hondō) -----------------------------------------------------
/** The bracket band: real bracket sets in the detail model, a plain white frieze in the low one. */
function band(S: Sz, PB: HanokParts, xs: number[], ys: number[], z0: number, z1: number, o: { cx: number; cy: number; depth: number; width: number }) {
  if (S.detail) return brackets(PB, xs, ys, z0, z1, { ...o, per: 1, tiers: 2 })
  const X0 = xs[0], X1 = xs[xs.length - 1], Y0 = ys[0], Y1 = ys[ys.length - 1]
  box(PB.teal, o.cx + X0, o.cy + Y0, z0, o.cx + X1, o.cy + Y1, z1, 'tb')
  const d = o.depth * 0.6
  box(PB.green, o.cx + X0 - d, o.cy + Y0 - d, z1 - (z1 - z0) * 0.5, o.cx + X1 + d, o.cy + Y1 + d, z1, 't')
}

function hall(S: Sz, PS: HanokParts, PB: HanokParts, PR: HanokParts, verm: Part, tile: Part, plaster: Part, gold: Part, stone: Part, win: Part, tally: (l: string) => void) {
  const cx = 21.35, cy = 37.3
  const F = 2.8 // floor (top of the platform)
  // Platform: granite base, the stairs at the front and the sides.
  if (S.detail) platform(PS, [{ x0: cx - 20.0, x1: cx + 20.0, y0: cy - 19.2, y1: cy + 19.0, z0: 0, z1: F, rail: false,
    stairs: [{ side: 's', at: cx, width: 16 }, { side: 'e', at: cy - 12, width: 3.5 }, { side: 'w', at: cy - 12, width: 3.5 }] }])
  else {
    box(stone, cx - 20.0, cy - 19.2, 0, cx + 20.0, cy + 19.0, F, 'b')
    // The front flight, in four broad steps.
    for (let k = 0; k < 4; k++) box(stone, cx - 8, cy - 19.2 - 3.6 + k * 0.9, 0, cx + 8, cy - 19.2, F * (k + 1) / 4, 'bn')
  }
  // Vermilion railing round the veranda.
  const rail = (x0: number, y0: number, x1: number, y1: number) => bar(verm, [[x0, y0, F + 0.95], [x1, y1, F + 0.95]], 0.25, 0.2, 0.75, true, false)
  rail(cx - 19.6, cy - 18.8, cx - 8.5, cy - 18.8); rail(cx + 8.5, cy - 18.8, cx + 19.6, cy - 18.8)
  rail(cx - 19.6, cy + 18.6, cx + 19.6, cy + 18.6)
  rail(cx - 19.6, cy - 18.8, cx - 19.6, cy + 18.6); rail(cx + 19.6, cy - 18.8, cx + 19.6, cy + 18.6)

  tally('hall platform+rail')
  // 7 × 7 bays, 34.5 × 32.7 m.
  const xs = [-17.25, -12.4, -7.6, -2.6, 2.6, 7.6, 12.4, 17.25]
  const ys = [-16.35, -11.6, -7.0, -2.4, 2.4, 7.0, 11.6, 16.35]
  const L1 = F + 5.4, L2 = F + 6.4, B1 = F + 8.2
  if (S.detail) storey(PS, xs, ys, F, L1, L2, (side, bay, n) => (side === 's' && bay > 0 && bay < n - 1 ? 'open' : side === 'n' ? 'wall' : 'high'), { cx, cy })
  else {
    box(verm, cx + xs[0], cy + ys[0], F, cx + xs[7], cy + ys[7], L1, 'tbs')
    box(verm, cx + xs[0], cy + ys[0], F, cx + xs[1], cy + ys[0] + 1.0, L1, 'tbn')
    box(verm, cx + xs[6], cy + ys[0], F, cx + xs[7], cy + ys[0] + 1.0, L1, 'tbn')
    box(plaster, cx + xs[0], cy + ys[0], L1, cx + xs[7], cy + ys[7], L2, 'tb')
  }
  // The open front bays: the dark hall inside (lit at night).
  box(win, cx + xs[1], cy + ys[0] + 0.8, F, cx + xs[6], cy + ys[0] + 1.0, L1, 'tb')
  tally('hall storey')
  columns(PS, xs, ys, F, L2, 0.42, { cx, cy, n: S.detail ? 12 : 5 })
  tally('hall columns')
  band(S, PB, xs, ys, L2, B1, { cx, cy, depth: 1.6, width: 0.7 })
  box(stone, cx + xs[0] - 0.3, cy + ys[0] - 0.3, F - 0.05, cx + xs[7] + 0.3, cy + ys[7] + 0.3, F + 0.1, 'b')

  tally('hall brackets')
  // The great roof: hipped-and-gabled, very steep above a wide flat skirt,
  // gables east and west.
  jroof(PR, { coarse: !S.detail,
    cx, cy, kind: 'paljak', ex: 23.6, ey: 23.0, ze: B1 + 0.6, gx: 14.8, gy: 10.2, zg: 15.2, zr: 27.9, rx: 11.6,
    lift: 1.2, flare: 0.8, sag: 0.25, th: 0.85, pow: 1.8,
    soffit: { bx: 17.25 + 1.7, by: 16.35 + 1.7, zb: B1 },
    ridge: { h: 1.25, w: 1.1, ornament: 1.4 }, ridgeSag: 0.15,
    hipRidge: { w: 0.55, h: 0.45 },
  })
  tally('hall roof')
  if (S.detail) eaveDashes(plaster, cx, cy, 23.6, 23.0, B1 + 0.6 - 0.85 - 0.12, 0.7)
  // Gable ornaments: gilt hanging fish (gegyo) at the gable peak and a gilt
  // band along the gable's foot.
  for (const e of [-1, 1]) {
    // On the leaning gable (foot at x 14.8, z 15.2; peak at 11.6, 27.9):
    // the gilt hanging fish, a gilt band at the foot, white and gilt
    // bands across it (its carved, gilded truss).
    const gx = (z: number) => cx + e * (14.8 - (3.2 * (z - 15.2)) / 12.7 + 0.12)
    rbox(gold, gx(24.4), cy, 0.15, 1.5, 23.2, 25.6, 0)
    rbox(gold, gx(15.6), cy, 0.15, 9.6, 15.4, 15.9, 0)
    rbox(plaster, gx(18.6), cy, 0.12, 6.6, 18.0, 19.2, 0)
    rbox(gold, gx(20.8), cy, 0.15, 4.4, 20.4, 21.0, 0)
  }
  // The front porch roof (kōhai): the middle five bays' eave carried lower
  // and further out, over the stairs, on its own columns.
  const zA = B1 + 1.6, zB = B1 - 0.7, yA = cy - 21.0, yB = cy - 25.6, hx = 13.8
  const top = (x: number, y: number, z: number): V3 => [cx + x, y, z]
  for (const [p, dz, want] of [[tile, 0, [0, -1, 1]], [verm, -0.55, [0, 1, -1]]] as [Part, number, V3][])
    quadOut(p, top(-hx, yB, zB + dz), top(hx, yB, zB + dz), top(hx, yA, zA + dz), top(-hx, yA, zA + dz), want)
  box(tile, cx - hx, yB - 0.05, zB - 0.55, cx + hx, yB + 0.05, zB, 'tb')
  for (const e of [-1, 1]) quadOut(tile, top(e * hx, yB, zB - 0.55), top(e * hx, yA, zA - 0.55), top(e * hx, yA, zA), top(e * hx, yB, zB), [e, 0, 0])
  for (const x of [-12.4, -2.6, 2.6, 12.4]) column(verm, cx + x, yB + 1.2, F, zB - 0.5, 0.36, S.detail ? 8 : 5)
  box(verm, cx - hx + 0.4, yB + 0.9, zB - 1.1, cx + hx - 0.4, yB + 1.5, zB - 0.5, '')
  // The great lantern 志ん橋 in the middle bay (4.5 m high, 3.5 m across).
  const lz0 = F + 0.9, lz1 = lz0 + 4.0
  lathe(verm, cx, cy - 17.3, [[0.01, lz0], [1.3, lz0], [1.75, (lz0 + lz1) / 2], [1.3, lz1], [0.01, lz1]], S.detail ? 20 : 8)
  lathe(gold, cx, cy - 17.3, [[0.01, lz0 - 0.35], [1.1, lz0 - 0.35], [1.1, lz0 + 0.05], [0.01, lz0 + 0.05]], S.detail ? 10 : 6)
  box(tile, cx - 0.9, cy - 19.08, lz0 + 1.0, cx + 0.9, cy - 18.95, lz1 - 0.9, 'n')
}

// ---- The Five-storey Pagoda and its hall ------------------------------------
function pagoda(S: Sz, PS: HanokParts, PB: HanokParts, PR: HanokParts, verm: Part, tile: Part, plaster: Part, gold: Part, stone: Part, win: Part, tally: (l: string) => void) {
  const px = -36.4, py = -38.5
  // The halls round the pagoda (way/675582837): the base hall under the
  // pagoda, and the low wings round its court.
  // The wings: single storey, low, so the pagoda stands clear above them;
  // the east and north ones (the amulet halls on the plaza) in green copper.
  const wings: [number, number, number, number, boolean][] = [
    [-57.3, -69.3, -47.7, -40.3, false], // west
    [-47.7, -69.3, -16.1, -59.6, false], // south
    [-16.1, -61.2, 3.4, -49.5, true], // south-east
    [-25.3, -46.3, -13.5, -16.8, true], // east
    [-47.5, -26.5, -25.3, -16.8, true], // north
  ]
  for (const [x0, y0, x1, y1, cu] of wings) hipBlock(verm, cu ? stone : tile, x0, y0, x1, y1, 3.6, 1.6, 0.9, plaster, S.detail)
  tally('pagoda wings')
  // Base hall: a low vermilion hall round the pagoda's 5 m base, its hipped
  // roof rising to the pagoda's first storey.
  const bx0 = -47.7, bx1 = -25.3, by0 = -59.6, by1 = -26.5
  box(verm, bx0 + 1.5, by0 + 1.5, 0, bx1 - 1.5, by1 - 1.5, 5.0, 'bt')
  box(plaster, bx0 + 1.45, by0 + 1.45, 4.0, bx1 - 1.45, by1 - 1.45, 4.8, 'bt')
  box(win, px - 4.6, by1 - 1.6, 0.6, px + 4.6, by1 - 1.4, 3.6, 'tb')
  if (S.detail) for (const x of [-6.8, -2.3, 2.3, 6.8]) column(verm, px + x, by1 - 1.0, 0.6, 5.0, 0.34, 8)
  hipBlockAround(S, PR, tile, verm, bx0, by0, bx1, by1, 5.4, px, py, 5.4, 7.8)

  tally('pagoda base hall')
  // The pagoda: five storeys, slim, each a vermilion body with a balcony, a
  // deep vermilion bracket band and a dark-grey hipped eave, stepping in;
  // then the tall sōrin.
  const st = [
    { w: 4.6, z0: 5.0, eave: 12.4, ex: 8.0 },
    { w: 4.3, z0: 13.9, eave: 18.0, ex: 7.6 },
    { w: 4.0, z0: 19.5, eave: 23.6, ex: 7.3 },
    { w: 3.8, z0: 25.1, eave: 29.2, ex: 7.0 },
    { w: 3.6, z0: 30.7, eave: 34.8, ex: 6.8 },
  ]
  // In the low model the bracket band is vermilion too, with a white line.
  const PBp: HanokParts = S.detail ? PB : { ...PB, teal: verm }
  for (let i = 0; i < 5; i++) {
    const s = st[i], next = st[i + 1]
    const W = s.w
    const b0 = s.eave - 2.0 // bracket band
    const xs = [-W, -W / 3, W / 3, W], ys = xs
    const zw = s.z0
    if (i > 0) {
      // Balcony: a deck and a vermilion railing a little outside the wall.
      box(verm, px - W - 0.6, py - W - 0.6, s.z0, px + W + 0.6, py + W + 0.6, s.z0 + 0.3, 'b')
      if (S.detail) for (const [a, b] of [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]] as [number, number][][])
        bar(verm, [[px + a[0] * (W + 0.5), py + a[1] * (W + 0.5), s.z0 + 1.0], [px + b[0] * (W + 0.5), py + b[1] * (W + 0.5), s.z0 + 1.0]], 0.16, 0.12, 0.65, true, false)
    }
    const cs = S.detail ? xs : [-W, W]
    if (S.detail) storey(PS, cs, cs, zw, b0 - 0.6, b0, (side, bay) => (bay === 1 ? 'door' : 'high'), { cx: px, cy: py, panes: 2 })
    else {
      box(verm, px - W, py - W, zw, px + W, py + W, b0, 'tb')
      box(plaster, px - W - 0.02, py - W - 0.02, b0 - 0.55, px + W + 0.02, py + W + 0.02, b0 - 0.25, 'tb')
    }
    if (S.detail) columns(PS, cs, cs, zw, b0, 0.28, { cx: px, cy: py, n: 10 })
    band(S, PBp, xs, ys, b0, s.eave - 0.35, { cx: px, cy: py, depth: 1.9, width: 0.55 })
    if (next) {
      jroof(PR, { coarse: S.detail ? false : 2, noHips: !S.detail,
        cx: px, cy: py, kind: 'skirt', ex: s.ex, ey: s.ex, ze: s.eave, gx: next.w + 0.65, gy: next.w + 0.65, zg: next.z0 + 0.15,
        lift: 0.8, flare: 0.5, sag: 0.3, th: 0.55, soffit: { bx: W + 1.4, by: W + 1.4, zb: s.eave - 0.35 },
        hipRidge: { w: 0.35, h: 0.3 },
      })
    } else {
      jroof(PR, { coarse: S.detail ? false : 2,
        cx: px, cy: py, kind: 'hip', ex: s.ex, ey: s.ex, ze: s.eave, gx: 0.5, gy: 0, zg: 37.6, zr: 37.6,
        lift: 0.8, flare: 0.5, sag: 0.4, th: 0.55, soffit: { bx: W + 1.4, by: W + 1.4, zb: s.eave - 0.35 },
        hipRidge: { w: 0.35, h: 0.3 }, ridge: { h: 0.3, w: 0.7 },
      })
    }
  }
  tally('pagoda storeys')
  // The sōrin: a square base, the bowl, nine rings on the mast, the flame
  // vane (suien) and the jewel (hōju), gilt; bolder than life so it reads.
  box(gold, px - 1.0, py - 1.0, 37.4, px + 1.0, py + 1.0, 38.3, 'b')
  lathe(gold, px, py, [[0.01, 38.3], [1.0, 38.3], [1.15, 38.9], [0.55, 39.4], [0.01, 39.4]], 10)
  prism(gold, px, py, 39.4, 50.2, S.detail ? 0.2 : 0.32, S.detail ? 0.16 : 0.26, 6)
  for (let k = 0; k < 9; k++) {
    const z = 40.0 + k * 1.05, r = (S.detail ? 1.15 : 1.35) - k * 0.035
    lathe(gold, px, py, S.detail ? [[r - 0.25, z], [r, z + 0.08], [r, z + 0.26], [r - 0.25, z + 0.34]] : [[r - 0.3, z], [r, z + 0.17], [r - 0.3, z + 0.34]], S.detail ? 14 : 5)
  }
  // Suien: two crossed flame vanes; then the jewel to 53.3 m.
  for (const rot of [0, Math.PI / 2]) rbox(gold, px, py, 0.9, 0.06, 49.6, 51.6, rot)
  ball(gold, px, py, 52.2, 0.45, S.detail ? 8 : 6, 0.55)
  ball(gold, px, py, 52.95, 0.25, 6, 0.33)
  tally('sorin')
}

/** The base hall's hipped roof, its ridge ring round the pagoda body. */
function hipBlockAround(S: Sz, PR: HanokParts, tile: Part, verm: Part, x0: number, y0: number, x1: number, y1: number, ze: number, px: number, py: number, w: number, zt: number) {
  // A skirt centred on the hall, rising to a ring about the pagoda: drawn
  // with the kit's skirt about the hall's centre, then the slope from that
  // ring to the pagoda filled flat (the hall's roof deck).
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const hx = (x1 - x0) / 2, hy = (y1 - y0) / 2
  jroof(PR, { coarse: S.detail ? false : 2, noHips: !S.detail,
    cx, cy, kind: 'skirt', ex: hx + 1.2, ey: hy + 1.2, ze, gx: hx - 3.8, gy: hy - 3.8, zg: zt,
    lift: 0.6, flare: 0.4, sag: 0.35, th: 0.6, soffit: { bx: hx - 1.3, by: hy - 1.3, zb: ze - 0.6 },
    hipRidge: { w: 0.4, h: 0.35 },
  })
  box(tile, cx - (hx - 3.8), cy - (hy - 3.8), zt - 0.4, cx + (hx - 3.8), cy + (hy - 3.8), zt, 'b')
}

// ---- Hōzōmon ---------------------------------------------------------------
function hozomon(S: Sz, PS: HanokParts, PB: HanokParts, PR: HanokParts, verm: Part, tile: Part, plaster: Part, gold: Part, stone: Part, win: Part, tally: (l: string) => void) {
  const cx = 21.25, cy = -51.75
  box(stone, cx - 12.2, cy - 5.2, 0, cx + 12.2, cy + 5.2, 0.6, 'b')
  // Lower storey: 5 × 2 bays; the middle three open, the end bays the Niō.
  const xs = [-11.0, -6.6, -2.2, 2.2, 6.6, 11.0], ys = [-4.2, 0, 4.2]
  const L1 = 6.6, L2 = 7.6, B1 = 9.4
  storey(PS, xs, ys, 0.6, L1, L2, (side, bay, n) => ((side === 's' || side === 'n') && bay > 0 && bay < n - 1 ? 'open' : 'wall'), { cx, cy })
  columns(PS, xs, ys, 0.6, L2, 0.45, { cx, cy, n: S.detail ? 12 : 5 })
  for (const x of [-2.2, 2.2]) for (const y of [0]) column(verm, cx + x, cy + y, 0.6, L2, 0.45, 8)
  // The Niō bays: dark grilles in front of the guardians.
  for (const e of [-1, 1]) for (const f of [-1, 1]) box(win, cx + e * 6.85, cy + f * 4.05, 0.9, cx + e * 10.75, cy + f * 4.25, L1 - 0.2, 'tb')
  band(S, PB, xs, ys, L2, B1, { cx, cy, depth: 1.4, width: 0.6 })
  tally('hozo lower')
  // Lower roof: a skirt up to the upper storey.
  const UX = 10.0, UY = 3.6, U0 = 11.9
  jroof(PR, { coarse: S.detail ? false : 2, noHips: !S.detail,
    cx, cy, kind: 'skirt', ex: 15.3, ey: 8.7, ze: 10.1, gx: UX + 0.6, gy: UY + 0.6, zg: U0,
    lift: 0.8, flare: 0.6, sag: 0.3, th: 0.75, soffit: { bx: 11.0 + 1.5, by: 4.2 + 1.5, zb: B1 },
    hipRidge: { w: 0.45, h: 0.4 },
  })
  tally('hozo skirt roof')
  // Upper storey with its balcony.
  const uxs = [-UX, -6.0, -2.0, 2.0, 6.0, UX], uys = [-UY, 0, UY]
  box(verm, cx - UX - 0.9, cy - UY - 0.9, U0, cx + UX + 0.9, cy + UY + 0.9, U0 + 0.35, 'b')
  for (const [a, b] of [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]] as [number, number][][])
    bar(verm, [[cx + a[0] * (UX + 0.8), cy + a[1] * (UY + 0.8), U0 + 1.25], [cx + b[0] * (UX + 0.8), cy + b[1] * (UY + 0.8), U0 + 1.25]], 0.2, 0.15, 0.8, true, false)
  tally('hozo balcony')
  storey(PS, uxs, uys, U0, 14.4, 15.0, () => 'high', { cx, cy })
  tally('hozo up storey')
  columns(PS, uxs, uys, U0, 15.0, 0.38, { cx, cy, n: S.detail ? 10 : 4 })
  tally('hozo up cols')
  band(S, PB, uxs, uys, 15.0, 16.6, { cx, cy, depth: 1.4, width: 0.55 })
  jroof(PR, { coarse: S.detail ? false : 2,
    cx, cy, kind: 'paljak', ex: 14.4, ey: 8.2, ze: 17.1, gx: 7.6, gy: 2.8, zg: 19.0, zr: 20.6,
    lift: 0.9, flare: 0.6, sag: 0.4, th: 0.8,
    soffit: { bx: UX + 1.4, by: UY + 1.4, zb: 16.6 },
    ridge: { h: 0.9, w: 0.9, ornament: 1.1 }, ridgeSag: 0.1, hipRidge: { w: 0.45, h: 0.4 },
  })
  tally('hozo upper')
  tally('hozo upper roof')
  if (S.detail) {
    eaveDashes(plaster, cx, cy, 15.3, 8.7, 10.1 - 0.75 - 0.12, 0.7)
    eaveDashes(plaster, cx, cy, 14.4, 8.2, 17.1 - 0.8 - 0.12, 0.7)
  }
  // The board 浅草寺 on the upper storey, south face.
  box(gold, cx - 0.8, cy - UY - 1.05, 13.0, cx + 0.8, cy - UY - 0.95, 15.6, '')
  box(win, cx - 0.62, cy - UY - 1.1, 13.2, cx + 0.62, cy - UY - 1.05, 15.4, 'n')
  // The lanterns: the great red 小舟町 in the middle bay, a bronze tsuri-dōrō
  // either side.
  tally('hozo board')
  const lz0 = 2.6, lz1 = 6.4
  lathe(verm, cx, cy, [[0.01, lz0], [1.05, lz0], [1.45, (lz0 + lz1) / 2], [1.05, lz1], [0.01, lz1]], S.detail ? 20 : 8)
  lathe(gold, cx, cy, [[0.01, lz0 - 0.3], [0.95, lz0 - 0.3], [0.95, lz0 + 0.05], [0.01, lz0 + 0.05]], S.detail ? 12 : 8)
  lathe(gold, cx, cy, [[0.01, lz1 - 0.05], [0.95, lz1 - 0.05], [0.95, lz1 + 0.3], [0.01, lz1 + 0.3]], S.detail ? 12 : 8)
  box(tile, cx - 0.75, cy - 1.49, 3.3, cx + 0.75, cy - 1.36, 5.7, 'n')
  for (const e of [-1, 1]) {
    const x = cx + e * 4.4
    lathe(tile, x, cy, S.detail ? [[0.01, 3.4], [0.75, 3.4], [0.85, 4.6], [1.1, 5.0], [0.3, 5.6], [0.01, 5.6]] : [[0.01, 3.0], [0.85, 4.6], [1.1, 5.0], [0.01, 5.6]], 6)
    if (S.detail) lathe(gold, x, cy, [[0.01, 2.9], [0.5, 2.9], [0.5, 3.4], [0.01, 3.4]], 6)
  }
  tally('hozo lanterns')
}

if (import.meta.main && process.env.ONLY) {
  const dir = process.env.OUT!
  await save('tokyo-sensoji', 'Sensō-ji', buildSensoji({ detail: false }), `${dir}/${process.env.ONLY}.glb`, 1e9, 1e9, {})
  await save('tokyo-sensoji', 'Sensō-ji', buildSensoji({ detail: true }), `${dir}/${process.env.ONLY}.detail.glb`, 1e9, 1e9, {})
} else if (import.meta.main) {
  const extras = { bearing: 5.4, elevation: 0, height: 53.3, osm: 'way/91008673' }
  await save('tokyo-sensoji', 'Sensō-ji', buildSensoji({ detail: false }), 'tokyo-sensoji.glb', 6500, 250_000, extras)
  await save('tokyo-sensoji', 'Sensō-ji', buildSensoji({ detail: true }), 'tokyo-sensoji.detail.glb', 40_000, 1536 * 1024, extras)
}
