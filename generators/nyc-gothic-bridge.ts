/**
 * Gothic Bridge (Bridge No. 28), Central Park, over the bridle path north of
 * the Reservoir (Calvert Vaux and Jacob Wrey Mould, 1864; cast by Cornell
 * Iron Works) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-gothic-bridge.ts
 *
 * This file also exports the cast-iron footbridge pieces used by Bridges
 * No. 24 and No. 27 (`ironRailing`, `strip`, `curveBand`, `flatStrip`); its
 * own build runs only when it is the main module.
 *
 * Frame (mesh.ts map frame): x along the bridge (bearing 139.8°, SE), y
 * across it (the placement's bearing, 49.8°, along the bridle path below),
 * z up, metres; z = 0 is the bridle path under the arch, the lowest ground
 * under the footprint. Anchor: the middle of OSM way/179679731 (footway,
 * bridge=yes, surface=wood, "Bridge No. 28", alt_name "Gothic Bridge"),
 * 28.6 m end to end. OSM maps no man_made=bridge outline or building here
 * (the nearest buildings, the North Gate House way/278363027 and
 * way/817397167, stand 25–35 m east), so `replaces` is empty. The walkway's
 * deck is the model's (a footbridge); the paths beyond its ends are the map's.
 *
 * Evidence
 * - OSM (ODbL): the footway on the bridge way/179679731.
 * - Map terrain (Mapterhorn z15, `bun tools/terrain.ts grid`, bearing 49.8):
 *   the bridle path under the arch 1.4–1.5 m over the table's low corner;
 *   the banks at the bridge's ends 2–3.4 m above the path (the north-west
 *   bank is the higher). The stone abutments run down to z = 0 and the
 *   banks bury their lower parts.
 * - HAER NY-194 (Library of Congress, public domain), Jet Lowe:
 *   "View from bridlepath looking southwest, side elevation of bridge"
 *     (153C-2), https://commons.wikimedia.org/wiki/File:View_from_bridlepath_looking_southwest,_side_elevation_of_bridge_-_Central_Park_Bridges,_Gothic_Arch,_Spanning_bridlepath_south_of_tennis_courts_at_northwest_edge_of_Reservoir,_HAER_NY,31-NEYO,153C-2.tif
 *     (square-on: used for every proportion below);
 *   "Three-quarter view from pedestrian path level, looking southeast"
 *     (153C-3), https://commons.wikimedia.org/wiki/File:Three-quarter_view_from_pedestrian_path_level,_looking_southeast,_showing_balustrade_and_west_elevation_of_bridge_-_Central_Park_Bridges,_Gothic_Arch,_Spanning_bridlepath_south_HAER_NY,31-NEYO,153C-3.tif
 *     (the walkway's width, the railing's loops, the stone abutment under
 *     the deck's end, the finials at the arch's feet).
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-gothic-bridge/photos):
 *   Jim.henderson, "Gothic Bridge 28 east cloudy jeh.jpg", CC0,
 *     https://commons.wikimedia.org/wiki/File:Gothic_Bridge_28_east_cloudy_jeh.jpg
 *     (the east face from the bridle path: today's pale cream paint, the
 *     tracery, the finials);
 *   Jim.henderson, "Gothic Bridge north of Central Park Reservoir PM jeh.jpg",
 *     CC0, https://commons.wikimedia.org/wiki/File:Gothic_Bridge_north_of_Central_Park_Reservoir_PM_jeh.jpg
 *     (a three-quarter view from the south-west in sun).
 * - Estimated from 153C-2 scaled to the OSM length (28.6 m, 0.029 m a
 *   pixel): walkway 4.3 m above the path at midspan, 3.85 m at the ends;
 *   railing 1.0 m (35 px against the 383 px opening: 0.09 of the 11.2 m
 *   span); fascia 0.5 m; the arch opening 11.2 m wide at its
 *   widest (1.45 m up), 10 m at the path, crown of the intrados 3.3 m (a
 *   slightly horseshoe ellipse); arch rib 0.45 m; the haunch ribs sweep from
 *   the arch's feet to the fascia 12.5 m out; walkway 4.0 m between the
 *   railings (153C-3, against the 1.1 m railing).
 * - Published (Central Park Conservancy; HAER): cast-iron arch footbridge of
 *   1864 over the bridle path, Gothic tracery in the spandrels.
 *
 * Simplified: the spandrels' openwork is a dark panel with three cream
 * lancet loops each side (the real tracery has cusps and foliage); the
 * railing's quatrefoil loops are a cream band with one row of dark openings
 * on its outer face; the abutments are drawn only as a 0.9 m block under
 * each deck end (the banks bury the rest),
 * and its scrolled ends are left straight; the crown ornament is a boss.
 *
 * Doubts: dimensions are photo-scaled, not measured; HAER's drawings for
 * this bridge weren't found online, and no lidar was read. Both faces are
 * drawn alike (the photos of either face agree).
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { box, qn, steps, urn } from './nyc-greyshot-arch'

// ===========================================================================
// Cast-iron footbridge pieces (shared with Bridges No. 24 and No. 27)
// ===========================================================================

/** A strip on the plane y = s·yo between lo(x) and hi(x), facing s·out along y. */
export function strip(p: Part, s: number, yo: number, xs: number[], lo: (x: number) => number, hi: (x: number) => number, out = 1) {
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i], b = xs[i + 1]
    if (hi(a) - lo(a) < 1e-4 && hi(b) - lo(b) < 1e-4) continue
    qn(p, [a, s * yo, lo(a)], [b, s * yo, lo(b)], [b, s * yo, hi(b)], [a, s * yo, hi(a)], [0, s * out, 0])
  }
}

/** A strip across y from o0 to o1 (times s) along z(x), facing up or down. */
export function flatStrip(p: Part, s: number, o0: number, o1: number, xs: number[], z: (x: number) => number, up: boolean) {
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i], b = xs[i + 1]
    qn(p, [a, s * o0, z(a)], [b, s * o0, z(b)], [b, s * o1, z(b)], [a, s * o1, z(a)], [0, 0, up ? 1 : -1])
  }
}

/**
 * A rib following a curve in the x–z plane: the band between `inner` and
 * `outer` (matched point lists) on the face y = s·yf, with its two edges
 * returned back to y = s·yb.
 */
export function curveBand(p: Part, s: number, yb: number, yf: number, inner: [number, number][], outer: [number, number][]) {
  for (let i = 0; i + 1 < inner.length; i++) {
    const [x0, z0] = inner[i], [x1, z1] = inner[i + 1], [u0, w0] = outer[i], [u1, w1] = outer[i + 1]
    qn(p, [x0, s * yf, z0], [x1, s * yf, z1], [u1, s * yf, w1], [u0, s * yf, w0], [0, s, 0])
    // edge faces: the inner edge faces away from the outer one, and back
    const mi: V3 = [(x0 + x1 - u0 - u1) / 2, 0, (z0 + z1 - w0 - w1) / 2]
    qn(p, [x0, s * yb, z0], [x1, s * yb, z1], [x1, s * yf, z1], [x0, s * yf, z0], mi)
    qn(p, [u0, s * yb, w0], [u1, s * yb, w1], [u1, s * yf, w1], [u0, s * yf, w0], [-mi[0], 0, -mi[2]])
  }
}

/** A hexagonal dark piercing on the plane y = yy, facing ny (±1). */
function piercing(p: Part, x: number, yy: number, zc: number, r: number, ny: number) {
  const pts = Array.from({ length: 6 }, (_, k): V3 => [x + r * Math.cos((k * Math.PI) / 3), yy, zc + r * Math.sin((k * Math.PI) / 3)])
  for (let k = 1; k < 5; k++) {
    const g = (pts[k][0] - pts[0][0]) * (pts[k + 1][2] - pts[0][2]) - (pts[k][2] - pts[0][2]) * (pts[k + 1][0] - pts[0][0])
    if ((g > 0 ? -1 : 1) === ny) p.tri(pts[0], pts[k], pts[k + 1]); else p.tri(pts[0], pts[k + 1], pts[k])
  }
}

export type RailingSpec = {
  /** Half length along x, and the railing's line (|y|). */
  half: number
  hw: number
  /** Walkway top at x. */
  deck: (x: number) => number
  height: number
  /** Post stations (x); the piercings skip them. */
  posts: number[]
  pitch?: number
  r?: number
}

/**
 * A cast-iron railing on both sides: a band in the paint colour (bottom rail,
 * an openwork panel, top rail) with a row of dark openings on each face,
 * a flat top rail, and square posts with knob caps.
 */
export function ironRailing(paint: Part, dark: Part, R: RailingSpec) {
  const { half, hw, deck, height } = R
  const pitch = R.pitch ?? 0.5, r = R.r ?? 0.2
  const all = steps(-half, half, 24)
  for (const s of [-1, 1]) {
    for (const [o, out] of [[hw + 0.06, 1], [hw - 0.06, -1]] as [number, number][]) {
      strip(paint, s, o, all, deck, (x) => deck(x) + height, out)
      // one row of piercings, on the outer face only, so the near and far
      // railings don't stack into two rows of holes
      if (out < 0) continue
      for (let x = -half + 0.5; x <= half - 0.45; x += pitch) {
        if (R.posts.some((q) => Math.abs(x - q) < 0.35)) continue
        piercing(dark, x, s * (o + out * 0.012), deck(x) + height / 2 + 0.02, r, s * out)
      }
    }
    flatStrip(paint, s, hw - 0.1, hw + 0.1, all, (x) => deck(x) + height, true)
    for (const sx of [-1, 1]) {
      const x = sx * half
      qn(paint, [x, s * (hw - 0.06), deck(x)], [x, s * (hw + 0.06), deck(x)], [x, s * (hw + 0.06), deck(x) + height], [x, s * (hw - 0.06), deck(x) + height], [sx, 0, 0])
    }
    for (const x of R.posts) {
      const y = s * hw, z = deck(x)
      box(paint, x - 0.1, x + 0.1, y - 0.1, y + 0.1, z, z + height + 0.12)
      urn(paint, x, y, [[0.08, z + height + 0.12], [0.12, z + height + 0.2], [0.09, z + height + 0.3], [0.02, z + height + 0.36]], 6)
    }
  }
}

/** A pointed (equilateral) lancet outline as a band of width w on y = yy, facing ny: jambs from zb(x) up to the spring zs. */
export function lancet(p: Part, xc: number, h: number, w: number, zs: number, zb: (x: number) => number, yy: number, ny: number) {
  const n = 5
  const ring = (hh: number, rad: number): [number, number][] => {
    const t1 = Math.acos(-h / rad)
    const left = steps(Math.PI, t1, n).map((t): [number, number] => [xc + h + rad * Math.cos(t), zs + rad * Math.sin(t)])
    const right = left.slice().reverse().map(([x, z]): [number, number] => [2 * xc - x, z])
    return [[xc - hh, zb(xc - hh)], ...left, ...right.slice(1), [xc + hh, zb(xc + hh)]]
  }
  const o = ring(h, 2 * h), i = ring(h - w, 2 * h - w)
  for (let k = 0; k + 1 < o.length; k++) {
    const a = o[k], b = o[k + 1], c = i[k + 1], d = i[k]
    qn(p, [a[0], yy, a[1]], [b[0], yy, b[1]], [c[0], yy, c[1]], [d[0], yy, d[1]], [0, ny, 0])
  }
}

// ===========================================================================
// Gothic Bridge
// ===========================================================================

function build() {
  const paint = new Part(), dark = new Part(), stone = new Part(), wood = new Part()
  const HALF = 14.3, DECK_MID = 4.3, DECK_END = 3.85, RAIL = 1.0, FASCIA = 0.5
  const deck = (x: number) => DECK_END + (DECK_MID - DECK_END) * (1 - (x / HALF) ** 2)
  const FB = (x: number) => deck(x) - FASCIA
  // the arch: a slightly horseshoe ellipse, widest 1.45 m up
  const A = 5.6, ZC = 1.45, BU = 1.85, BL = 3.2, RIB = 0.45, XC = 12.5
  const FY = 2.2, PY = 2.1, HW = 2.0, FF = 2.27 // rib face, panel plane, railing line, fascia face
  const phi0 = Math.asin(ZC / BL)
  const intr: [number, number][] = [], nrm: [number, number][] = []
  const push = (x: number, z: number, b: number) => {
    intr.push([x, z])
    const nx = x / (A * A), nz = (z - ZC) / (b * b), l = Math.hypot(nx, nz)
    nrm.push([nx / l, nz / l])
  }
  for (const f of steps(phi0, 0, 3)) push(-A * Math.cos(f), ZC - BL * Math.sin(f), BL)
  for (const t of steps(0, Math.PI, 18).slice(1, -1)) push(-A * Math.cos(t), ZC + BU * Math.sin(t), BU)
  for (const f of steps(0, phi0, 3)) push(A * Math.cos(f), ZC - BL * Math.sin(f), BL)
  const outer = intr.map(([x, z], i): [number, number] => [x + nrm[i][0] * RIB, Math.max(0, z + nrm[i][1] * RIB)])
  const iUp = (x: number) => ZC + BU * Math.sqrt(Math.max(0, 1 - (x / A) ** 2))
  const chord = (x: number) => {
    const u = (Math.abs(x) - A) / (XC - A)
    return FB(XC) * (1 - (1 - u) ** 2)
  }
  const L = steps(-XC, -A, 12), M = steps(-A, A, 18), Rr = steps(A, XC, 12)
  const all = steps(-HALF, HALF, 28)

  for (const s of [-1, 1]) {
    // the spandrels' openwork: a dark panel behind the ribs and tracery
    for (const xs of [L, Rr]) strip(dark, s, PY, xs, chord, FB)
    strip(dark, s, PY, M, iUp, FB)
    // the arch rib and the haunch ribs, cream, proud of the panel
    curveBand(paint, s, PY, FY, intr, outer)
    for (const sx of [-1, 1]) {
      const xs = sx < 0 ? L : Rr
      curveBand(paint, s, PY, FY, xs.map((x): [number, number] => [x, chord(x)]), xs.map((x): [number, number] => [x, Math.min(chord(x) + 0.5, FB(x) + 0.2)]))
      // three lancet loops in each spandrel
      for (const xc of [6.6, 7.6, 8.6]) {
        const zs = FB(xc) - Math.sqrt(3) * 0.45 - 0.08
        lancet(paint, sx * xc, 0.45, 0.13, zs, (x) => Math.min(zs, chord(x) + 0.25), s * (PY + 0.04), s)
      }
    }
    // the fascia: from FB to the walkway, the full length, with a moulding
    strip(paint, s, FF, all, FB, deck)
    flatStrip(paint, s, PY, FF, all, FB, false)
    flatStrip(paint, s, HW, FF + 0.07, all, deck, true)
    strip(paint, s, FF + 0.07, all, (x) => deck(x) - 0.16, deck)
    flatStrip(paint, s, FF, FF + 0.07, all, (x) => deck(x) - 0.16, false)
    // the crown boss
    box(paint, -0.55, 0.55, s < 0 ? -FF - 0.1 : FF, s < 0 ? -FF : FF + 0.1, FB(0) + 0.08, deck(0) - 0.2)
    // finials at the arch's feet
    for (const sx of [-1, 1]) {
      const x = sx * (A + 0.05), y = s * (FY + 0.3)
      box(paint, x - 0.28, x + 0.28, y - 0.28, y + 0.28, 0, 0.35)
      urn(paint, x, y, [[0.22, 0.35], [0.16, 0.45], [0.2, 0.62], [0.12, 0.85], [0.02, 1.05]], 8)
    }
  }
  // the soffits: under the arch rib and the haunch ribs, across the width
  for (let i = 0; i + 1 < intr.length; i++) {
    const [x0, z0] = intr[i], [x1, z1] = intr[i + 1]
    qn(dark, [x0, -PY, z0], [x1, -PY, z1], [x1, PY, z1], [x0, PY, z0], [-(nrm[i][0] + nrm[i + 1][0]), 0, -(nrm[i][1] + nrm[i + 1][1])])
  }
  for (const xs of [L, Rr]) flatStrip(dark, 1, -PY, PY, xs, chord, false)
  // under the deck's ends, beyond the haunch ribs
  for (const xs of [steps(-HALF, -XC, 2), steps(XC, HALF, 2)]) flatStrip(paint, 1, -FF, FF, xs, FB, false)
  // the walkway and the deck's end faces
  flatStrip(wood, 1, -HW, HW, all, deck, true)
  for (const sx of [-1, 1]) {
    const x = sx * HALF
    qn(paint, [x, -FF, FB(x)], [x, FF, FB(x)], [x, FF, deck(x)], [x, -FF, deck(x)], [sx, 0, 0])
  }
  // the stone abutments under the deck's ends (the banks bury most of them)
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? -HALF : HALF - 0.9, x1 = sx < 0 ? -HALF + 0.9 : HALF
    box(stone, x0, x1, -FF + 0.05, FF - 0.05, 0, FB(HALF) - 0.02)
  }
  // the railing
  const posts = [-HALF + 0.15, ...steps(-5, 5, 10).map((k) => k * 2.6), HALF - 0.15]
  ironRailing(paint, dark, { half: HALF, hw: HW, deck, height: RAIL, posts, pitch: 0.62, r: 0.36 })

  finishModel('Gothic Bridge', 'nyc-gothic-bridge', [
    { part: paint, material: { name: 'cast-iron-cream', color: 0xe2ddcd, roughness: 0.7 } },
    { part: dark, material: { name: 'openwork', color: 0x8c897e, roughness: 0.9 } },
    { part: stone, material: { name: 'stone', color: 0x8a7d70, roughness: 0.9 } },
    { part: wood, material: { name: 'walkway', color: 0x9a8670, roughness: 0.9 } },
  ], { bearing: 49.8, height: DECK_MID + RAIL + 0.36 }, 5000)
}

if (import.meta.main) build()
