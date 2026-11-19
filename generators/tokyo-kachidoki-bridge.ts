/**
 * Kachidoki Bridge (勝鬨橋; 1940), over the Sumida River between Tsukiji and
 * Kachidoki, Chuo, Tokyo: procedural, CC0-1.0.
 * bun generators/tokyo-kachidoki-bridge.ts
 *
 * The whole bridge, abutment to abutment: two through tied arches with
 * solid riveted ribs, plate hangers and lattice bracing overhead, either
 * side of a double-leaf Chicago-type bascule span (drawn closed), on two
 * masonry piers each carrying two granite operators' houses over the
 * sidewalks. Writes a low model and a detail model (every hanger, the
 * overhead lattice, the portal plates, lamp posts, railings, the houses'
 * arched windows), drawn from zoom 16.
 *
 * Frame: x across the bridge (toward bearing 53.3), y along it toward Tsukiji
 * (bearing 323.3, the outline's long sides), z up, metres; origin at the
 * centre of the man_made=bridge outline (way/549492916), z = 0 the water.
 * The map owns the roadway (Harumi-dori); the model draws the sidewalks on
 * either edge (OSM footways way/228050647 and way/286507872).
 *
 * OSM: way/549492916 the outline (replaced): 246.6 m long, 25.7 m wide, with
 * kinks at y = ±21.3 and ±35 that mark the bascule piers (13.7 m thick, the
 * leaves' 42.6 m clear opening between them).
 *
 * Published (Wikipedia ja "勝鬨橋"): 246 m long, 22 m wide; a 51.6 m
 * double-leaf Chicago-type trunnion bascule (leaves open to 70 degrees),
 * flanked by solid-rib tied arches of 86 m; the machinery in the piers and
 * four small houses at sidewalk level (operator's room, lookout, night
 * duty); lit up at night since 1998; a National Important Cultural Property.
 *
 * Photos (Wikimedia Commons, EVIDENCE): "Kachidokibashi -02.jpg" (Aimaimyi,
 * CC BY-SA 3.0), the side elevation from downstream, scaled at 3.1 px/m on
 * the arch span: the arch's rise ~14.5 m over the deck, 12 hanger panels, the
 * deck ~8 m above the water, the pale piers; "Kachidokibashi -01.jpg"
 * (Aimaimyi, CC BY-SA 3.0): through the arch, the portal plate with its
 * segmental opening, the lattice overhead, the lamp posts; "Kachidoki
 * bashi01.jpg", "02", "03" (Higa4, CC0): the granite houses (two arched
 * windows a face upstairs, the sidewalk passing through an arched
 * opening), the riveted ribs and hangers; "勝鬨橋與隅田川遊船.jpg" (R96340,
 * CC BY-SA 4.0): the plate hangers, the sidewalk brackets, the granite
 * parapet over the pier; night: "勝鬨橋01.jpg" (Ai yamaishi, CC BY 4.0) and
 * "Kachidoki Bashi 20140225.jpg" (Michio_Matsuoka, CC BY 4.0): the arches
 * and piers floodlit, lamps along the roadway.
 *
 * Estimated: the road (8.0 m at mid-river, 6.5 m at the abutments; the
 * banks are 2-5 m in the map's terrain), the ribs' depth (2.2 m) and
 * position (±9.6 m), the houses (8 x 5.2 m, 7 m above the sidewalk), the portal and
 * lattice layout, the bascule girders' depth (3.2 m).
 * Colour: the steel a pale silver-grey with a faint green (#cdcdc5 in shade,
 * #d8dad6 lit), the granite a warm grey (#ccc4b3).
 *
 * Doubts: no photo shows the underside of the bascule span; the deck heights
 * are photo estimates.
 */
import { Part, cross, sub, type MaterialSpec, type V3 } from './mesh'
import { band, bead, stations } from './bridge-kit'
import { loftSolid, one, type Skin } from './sf-golden-gate-bridge'
import { prism, rect, writeModel, type Layer } from './tokyo-metropolitan-government-building'
import { PALETTE, finish } from './palette'

const L = 123.3          // abutment ends
const P0 = 21.3, P1 = 35  // bascule pier faces
const RX = 9.6           // arch rib planes
const SW0 = 10.4, SW1 = 12.85 // sidewalks
const RISE = 14.5, DEPTH = 2.2
const road = (y: number) => 8.0 - 1.5 * (Math.abs(y) / L) ** 2

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function qo(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), want) >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bevel = 0.2) =>
  prism(p, rect((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2), z0, z1, { bevel, roof: p })
function beam(skin: Skin, a: V3, b: V3, w: number, t: number, side: V3) {
  const d = sub(b, a), l = Math.hypot(...d), dn: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const k = dot(side, dn), sv: V3 = [side[0] - dn[0] * k, side[1] - dn[1] * k, side[2] - dn[2] * k], sl = Math.hypot(...sv)
  const Sv: V3 = [sv[0] / sl, sv[1] / sl, sv[2] / sl], Wv = cross(Sv, dn)
  const sec = (o: V3): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [o[0] + Wv[0] * u * w / 2 + Sv[0] * v * t / 2, o[1] + Wv[1] * u * w / 2 + Sv[1] * v * t / 2, o[2] + Wv[2] * u * w / 2 + Sv[2] * v * t / 2] as V3)
  loftSolid(skin, [sec(a), sec(b)], [false, false])
}

/** The arch span from y0 to y1 (y0 < y1): rib centreline height at y. */
function arch(y0: number, y1: number) {
  const half = (y1 - y0) / 2, ym = (y0 + y1) / 2
  const R = (half * half + RISE * RISE) / (2 * RISE)
  const zEnd = (road(y0) + road(y1)) / 2 + 0.6
  return (y: number) => zEnd + Math.sqrt(Math.max(0, R * R - (y - ym) ** 2)) - (R - RISE)
}

type Lod = { detail: boolean }

function build({ detail }: Lod): Layer[] {
  const steel = new Part(), shade = new Part(), stone = new Part(), win = new Part(), walk = new Part(), lamp = new Part()
  const S = one(steel)

  // ---- Sidewalks, from end to end, with their parapets ---------------------
  const all = stations(-L, L, 8)
  for (const s of [-1, 1]) {
    band(walk, s * SW0, s * SW1, all, (y) => road(y) + 0.15, (y) => road(y) - 0.35, { top: true })
    band(shade, s * SW0, s * SW1, all, (y) => road(y) - 0.35, (y) => road(y) - 1.1, { bottom: true, out: true, ends: true })
    // the parapet: a railing on the arch spans, granite over the piers
    const rail = (ys: number[]) => detail
      ? (band(steel, s * (SW1 - 0.12), s * SW1, ys, (y) => road(y) + 1.15, (y) => road(y) + 0.95, { out: true, in: true, top: true }),
        ys.slice(0, -1).forEach((_, i) => { for (const y of stations(ys[i], ys[i + 1], 2)) beam(S, [s * (SW1 - 0.06), y, road(y) + 0.1], [s * (SW1 - 0.06), y, road(y) + 0.97], 0.12, 0.12, [1, 0, 0]) }))
      : band(steel, s * (SW1 - 0.15), s * SW1, ys, (y) => road(y) + 1.05, (y) => road(y) + 0.1, { out: true, in: true, top: true })
    for (const sy of [-1, 1]) {
      rail(stations(sy > 0 ? P1 : -L, sy > 0 ? L : -P1, 8))
      band(stone, s * (SW1 - 0.45), s * SW1 + s * 0.15, stations(sy > 0 ? P0 - 2 : -P1, sy > 0 ? P1 : -P0 + 2, 4), (y) => road(y) + 1.0, (y) => road(y) - 1.1, { out: true, in: true, top: true, ends: true })
    }
    rail(stations(-P0 + 2, P0 - 2, 8))
  }

  // ---- The two arch spans ------------------------------------------------------
  for (const sy of [-1, 1]) {
    const y0 = sy > 0 ? P1 : -L, y1 = sy > 0 ? L : -P1
    const z = arch(y0, y1)
    const n = detail ? 32 : 14
    const ys = stations(y0 + 0.5, y1 - 0.5, (y1 - y0 - 1) / n)
    // the ribs: solid, swept along the arc
    for (const s of [-1, 1]) {
      for (let i = 0; i < ys.length - 1; i++) {
        const a = ys[i], b = ys[i + 1]
        const ring = (y: number): V3[] => {
          const e = 0.05, t: [number, number] = [2 * e, z(y + e) - z(y - e)], tl = Math.hypot(...t)
          const ny = -t[1] / tl, nz = t[0] / tl // normal to the arc, upward
          const c: V3 = [s * RX, y, z(y)]
          return [[-0.6, -1], [0.6, -1], [0.6, 1], [-0.6, 1]].map(([u, v]) => [c[0] + u, c[1] + ny * v * DEPTH / 2, c[2] + nz * v * DEPTH / 2] as V3)
        }
        loftSolid(S, [ring(a), ring(b)], [i === 0, i === ys.length - 2])
      }
      // the tie girder along the curb
      band(steel, s * (RX - 0.5), s * (RX + 0.5), stations(y0, y1, 8), (y) => road(y) + 1.0, (y) => road(y) - 2.4, { out: true, in: true, top: true, bottom: true, ends: true })
    }
    // hangers (flat plates), struts and lattice overhead
    const panels = 12
    for (let k = 1; k < panels; k++) {
      if (!detail && k % 2) continue
      const y = y0 + ((y1 - y0) * k) / panels
      const top = z(y) - DEPTH / 2
      for (const s of [-1, 1]) beam(S, [s * RX, y, road(y) + 1.0], [s * RX, y, top + 0.2], detail ? 1.1 : 1.4, detail ? 0.45 : 0.6, [1, 0, 0])
      // lamp posts on the tie, inside the roadway
      for (const s of [-1, 1]) {
        if (detail) beam(S, [s * (RX - 0.7), y, road(y) + 1.0], [s * (RX - 0.7), y, road(y) + 3.6], 0.16, 0.16, [1, 0, 0])
        bead(lamp, [s * (RX - 0.7), y, road(y) + 3.9], detail ? 0.35 : 0.5, !detail)
      }
    }
    // overhead: struts between the ribs where the clearance allows, X lattice
    const clear = (y: number) => z(y) - DEPTH / 2 - road(y) > 7
    const sts = Array.from({ length: panels + 1 }, (_, k) => y0 + ((y1 - y0) * k) / panels).filter(clear)
    sts.forEach((y, i) => {
      const zt = z(y) - 0.2
      beam(S, [-RX, y, zt], [RX, y, zt], detail ? 0.9 : 1.2, detail ? 1.4 : 1.8, [0, 0, 1])
      if (detail && i < sts.length - 1) {
        const v = sts[i + 1], zv = z(v) - 0.2
        beam(S, [-RX, y, zt], [RX, v, zv], 0.6, 0.6, [0, 0, 1])
        beam(S, [RX, y, zt], [-RX, v, zv], 0.6, 0.6, [0, 0, 1])
      }
    })
    // the portal plates at the first and last struts, with a segmental opening
    for (const y of [sts[0], sts[sts.length - 1]]) {
      const zt = z(y) - 0.2, zs = road(y) + 6.2, zc = road(y) + 7.6, w = RX - 0.6
      const r = (w * w + (zc - zs) ** 2) / (2 * (zc - zs))
      const under = (x: number) => zc - r + Math.sqrt(Math.max(0, r * r - x * x))
      const xs = stations(-w, w, (2 * w) / (detail ? 14 : 6))
      for (let i = 0; i < xs.length - 1; i++) {
        const a = xs[i], b = xs[i + 1]
        for (const [yy, f] of [[y - 0.35, -1], [y + 0.35, 1]] as [number, number][]) qo(steel, [a, yy, under(a)], [b, yy, under(b)], [b, yy, zt], [a, yy, zt], [0, f, 0])
        qo(shade, [a, y - 0.35, under(a)], [b, y - 0.35, under(b)], [b, y + 0.35, under(b)], [a, y + 0.35, under(a)], [0, 0, -1])
      }
    }
    // the roadway's underside
    band(shade, -RX + 0.5, RX - 0.5, stations(y0, y1, 8), (y) => road(y) - 0.5, (y) => road(y) - 2.2, { bottom: true, ends: true })
    // the abutment, from the bank up to the deck
    box(stone, -SW1 - 0.2, SW1 + 0.2, sy > 0 ? L - 3 : -L, sy > 0 ? L : -L + 3, 2.0, road(sy * L) - 1.1, 0.3)
  }

  // ---- The bascule span: two leaves, closed ---------------------------------
  const bys = stations(-P0, P0, 6)
  for (const s of [-1, 1]) band(steel, s * (RX - 0.45), s * (RX + 0.45), bys, (y) => road(y) - 0.2, (y) => road(y) - 3.2, { out: true, in: true, bottom: true })
  band(shade, -RX + 0.5, RX - 0.5, bys, (y) => road(y) - 0.5, (y) => road(y) - 2.6, { bottom: true })
  if (detail) for (const y of stations(-P0 + 2, P0 - 2, 5.3)) band(shade, -RX, RX, [y - 0.25, y + 0.25], () => road(y) - 0.5, () => road(y) - 3.0, { bottom: true, ends: true })

  // ---- Piers and the operators' houses --------------------------------------
  for (const sy of [-1, 1]) {
    const ya = sy * P0, yb = sy * P1, y0 = Math.min(ya, yb), y1 = Math.max(ya, yb)
    // the pier, a little wider than the bridge, its nose rounded
    box(stone, -SW1 - 1.6, SW1 + 1.6, y0, y1, 0, road(ya) - 1.1, 0.5)
    box(stone, -SW1 - 1.2, SW1 + 1.2, y0 + 0.4, y1 - 0.4, 0, 1.2, 0.3)
    // the roadway's deck over the pier (the counterweight pits below it)
    band(shade, -RX + 0.5, RX - 0.5, [y0, y1], (y) => road(y) - 0.5, (y) => road(y) - 1.1, { bottom: true })
    // houses: over each sidewalk, the walk passing through an arched opening
    for (const s of [-1, 1]) {
      const hy0 = (y0 + y1) / 2 - 4, hy1 = (y0 + y1) / 2 + 4, zr = road(ya), top = zr + 7.0
      const xi = s * (SW0 - 0.4), xo = s * (SW1 + 1.4)
      const [xa, xb] = s > 0 ? [xi, xo] : [xo, xi]
      // the two legs either side of the passage, and the storey over it
      box(stone, Math.min(xi, s * SW0), Math.max(xi, s * SW0), hy0, hy1, zr - 0.35, top - 0.6)
      box(stone, Math.min(s * SW1, xo), Math.max(s * SW1, xo), hy0, hy1, zr - 0.35, top - 0.6)
      box(stone, xa, xb, hy0, hy1, zr + 3.0, top - 0.6)
      box(stone, xa - 0.3, xb + 0.3, hy0 - 0.3, hy1 + 0.3, top - 0.6, top, 0.15)
      // the passage's arched head, in the end faces
      for (const [yy, f] of [[hy0 - 0.02, -1], [hy1 + 0.02, 1]] as [number, number][]) {
        const r = (SW1 - SW0) / 2, xc = s * (SW0 + SW1) / 2
        const xs = stations(-r, r, r / (detail ? 5 : 2))
        for (let i = 0; i < xs.length - 1; i++) {
          const ua = xs[i], ub = xs[i + 1], za = zr + 2.0 + Math.sqrt(Math.max(0, r * r - ua * ua)) * 0.6, zb = zr + 2.0 + Math.sqrt(Math.max(0, r * r - ub * ub)) * 0.6
          qo(stone, [xc + ua, yy, za], [xc + ub, yy, zb], [xc + ub, yy, zr + 3.0], [xc + ua, yy, zr + 3.0], [0, f, 0])
        }
      }
      // upstairs: two arched windows on each long face, one on the river end
      for (const [face, n] of [[hy0, -1], [hy1, 1]] as [number, number][]) for (const k of [0.3, 0.7]) {
        const xc = xa + (xb - xa) * k, yy = face + n * 0.04, w = 0.75
        const pts: V3[] = []
        for (let i = 0; i <= (detail ? 8 : 4); i++) { const a = (Math.PI * i) / (detail ? 8 : 4); pts.push([xc + w * Math.cos(a), yy, zr + 5.2 + w * Math.sin(a)]) }
        qo(win, [xc - w, yy, zr + 3.6], [xc + w, yy, zr + 3.6], [xc + w, yy, zr + 5.2], [xc - w, yy, zr + 5.2], [0, n, 0])
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i], b = pts[i + 1], c: V3 = [xc, yy, zr + 5.2]
          if (dot(cross(sub(b, a), sub(c, a)), [0, n, 0]) >= 0) win.tri(a, b, c); else win.tri(a, c, b)
        }
      }
      const xe = xo + s * 0.04
      qo(win, [xe, hy0 + 3, zr + 3.6], [xe, hy1 - 3, zr + 3.6], [xe, hy1 - 3, zr + 5.6], [xe, hy0 + 3, zr + 5.6], [s, 0, 0])
    }
  }

  // ---- Night: arches and piers floodlit ---------------------------------------
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 0.9)
  return [
    { part: steel, material: { ...finish('kachidoki-steel', 0xd3d6cf), floodlight: (p: V3, n: V3) => (p[2] > road(p[1]) + 1.2 ? lit(p, n) : 0.2) } as MaterialSpec },
    { part: shade, material: finish('kachidoki-soffit', 0xa3a8a6) },
    { part: stone, material: { ...finish('kachidoki-granite', 0xd4d0c6), floodlight: lit } as MaterialSpec },
    { part: win, material: PALETTE.window },
    { part: walk, material: finish('kachidoki-paving', 0xa9a7a1) },
    { part: lamp, material: finish('lamp-kachidoki', 0xc9ccc6) },
  ]
}

if (import.meta.main) {
  const meta = { bearing: 323.3, elevation: 0, height: road(0) + RISE + 2, roadway: { centre: road(0), ends: road(L) } }
  await writeModel('tokyo-kachidoki-bridge', 'tokyo-kachidoki-bridge.glb', 'Kachidoki Bridge', build({ detail: false }), meta, 5000, 250 * 1024)
  await writeModel('tokyo-kachidoki-bridge', 'tokyo-kachidoki-bridge.detail.glb', 'Kachidoki Bridge', build({ detail: true }), meta, 40000, 1536 * 1024)
}
