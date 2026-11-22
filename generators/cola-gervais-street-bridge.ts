/**
 * Gervais Street Bridge, Columbia, South Carolina: the 1928 open-spandrel
 * reinforced-concrete arch bridge carrying Gervais Street (US 1 / US 378)
 * over the Congaree River. One model for the whole structure, as
 * "Bridges" in docs/reference.md asks: piers, arch ribs, spandrel columns
 * and their little arched heads, the deck's underside, the cantilevered
 * sidewalks, the balustrades and the lamp standards. The map draws the
 * four-lane roadway; the model draws nothing across it.
 *
 * Frame: built turned to the bridge's axis, bearing 68.7° (OSM outline,
 * principal axis), so +y here runs east-north-east along the deck and +x
 * across it to the south-south-east. Origin at the outline's centre.
 *
 * Sources
 * - OSM way/988676527 (man_made=bridge, bridge:structure=arch): the outline,
 *   16.4 m wide and 429.6 m long, with the pier pilasters drawn as 0.3–0.5 m
 *   bumps on both edges every 42.3 m (ten piers, y = -189.5 + 42.34 i). The
 *   road is way/158971449 (two nodes, no ele).
 * - USGS 3DEP lidar SC_SavannahPeeDee_2_2019 via tools/bridge_ele.py measure
 *   158971449 --every 40: roadway 49.96 m (NAVD88) at the west end, 50.84 m
 *   near midspan, 50.43 m 70 m from the east end, spread 0.02–0.04 m; river
 *   surface (bare earth under the deck) 36.8 m.
 * - Map terrain (tools/terrain.ts grid, Mapterhorn z15): lowest ground under
 *   the footprint 36.19 m, the river 0.6 m above that; banks rise to about
 *   13.7 m at both ends.
 * - Photos (EVIDENCE):
 *   - Jack E. Boucher, HAER SC-16 (public domain, Library of Congress), via
 *     Commons: "SOUTH SIDE, LOOKING NORTHEAST, HORIZONTAL FORMAT" (19-8),
 *     "GENERAL VIEW, LOOKING NORTH" (19-1), "DETAIL, TYPICAL LIGHT STANDARD"
 *     (19-10).
 *     https://commons.wikimedia.org/wiki/File:SOUTH_SIDE,_LOOKING_NORTHEAST,_HORIZONTAL_FORMAT_-_Gervais_Street_Bridge,_Gervais_Street_spanning_Congaree_River,_Columbia,_Richland_County,_SC_HAER_SC,40-COLUM,19-8.tif
 *     https://commons.wikimedia.org/wiki/File:GENERAL_VIEW,_LOOKING_NORTH_-_Gervais_Street_Bridge,_Gervais_Street_spanning_Congaree_River,_Columbia,_Richland_County,_SC_HAER_SC,40-COLUM,19-1.tif
 *     https://commons.wikimedia.org/wiki/File:DETAIL,_TYPICAL_LIGHT_STANDARD_-_Gervais_Street_Bridge,_Gervais_Street_spanning_Congaree_River,_Columbia,_Richland_County,_SC_HAER_SC,40-COLUM,19-10.tif
 *   - Reyvato, "Gervais Street Bridge-NE view.JPG" and "…-West End, NE
 *     View.JPG", CC BY-SA 3.0 (colour of the concrete).
 *     https://commons.wikimedia.org/wiki/File:Gervais_Street_Bridge-NE_view.JPG
 *     https://commons.wikimedia.org/wiki/File:Gervais_Street_Bridge-West_End,_NE_View.JPG
 *
 * Numbers
 * - Measured: outline width and length, pier spacing and pilaster size
 *   (OSM); roadway heights and the river (lidar); y = 0 (map terrain).
 * - Roadway the model is built to: road(y) = 14.65 - 1.91e-5 y² m above
 *   y = 0 (36.19 m NAVD88), a parabola through the lidar readings (13.8 m
 *   at both ends, 14.65 m at midspan; every reading within 0.05 m). OSM has
 *   no ele on the road, so the map guesses the deck from the ground; a
 *   straight deck between the landed ends would sit up to 0.85 m under the
 *   model at midspan. If it does, tag the crest per docs/bridge-heights.md
 *   rather than change the model.
 * - Estimated from the HAER photos (scaled from the 16.4 m deck and the
 *   42.3 m pier pitch): two ribs, one under each edge, 1.8 m wide, 1.6 m
 *   deep at the springing and 1.0 m at the crown; springing 2.6 m above
 *   the base, crown intrados 2.3 m under the road; footings 3.2 m tall;
 *   spandrel columns 0.8 m at a 3.9 m pitch; deck 1.0 m deep with the
 *   sidewalk cornice to 1.4 m; balustrade 0.9 m; lamp standards about 5 m
 *   over the sidewalk (the HAER scale photo, 19-11).
 * - Invented: the end spans' springing at the abutments (no photo shows
 *   the banks under the ends clearly); the abutments run down to y = 0 and
 *   the map's terrain hides what is under the banks.
 * - Simplified: the brackets under the sidewalk cornice, the cross struts
 *   between the ribs, the balusters (a solid rail) and the lamp ornament.
 *
 * Night: the lamp lanterns are `lamp`.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, qf, rect, tf } from './dc-white-house'
import { earcut, saveModel, type XY } from './dc-nga-west'

const CONCRETE = finish('gervais-concrete', 0xdcd5c6)
const WALK = finish('gervais-walk', 0xc4c0b8)
const IRON = finish('gervais-lamp-standard', 0x5b5e58)
const LAMP = { ...finish('lamp', 0x3f4240), name: 'lamp' }

// ---- Plan and heights (see header).
const HALF = 8.2 // deck half-width, outer face of the cornice and balustrade
const END = 214.8 // abutment faces, the outline's ends
const PITCH = 42.34
const PIERS = Array.from({ length: 10 }, (_, i) => -189.5 + PITCH * i)
const road = (y: number) => 14.65 - 1.91e-5 * y * y
const DECK = 1.0 // road to deck underside
const RIB_X = [4.7, 6.5] // rib from x = 4.7 to 6.5 (mirrored)
const SPRING = 2.6
const PIER_HALF = 1.6 // pier shaft half-length along y above the footing

/** A box between two y stations whose bottom and top follow functions of y (sampled at the ends). */
function beam(p: Part, x0: number, x1: number, ys: number[], zb: (y: number) => number, zt: (y: number) => number,
  o: { top?: boolean; bottom?: boolean; ends?: boolean; inner?: boolean; outer?: boolean } = {}) {
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    const A0: V3 = [x0, a, zb(a)], B0: V3 = [x0, b, zb(b)], A1: V3 = [x1, a, zb(a)], B1: V3 = [x1, b, zb(b)]
    const At0: V3 = [x0, a, zt(a)], Bt0: V3 = [x0, b, zt(b)], At1: V3 = [x1, a, zt(a)], Bt1: V3 = [x1, b, zt(b)]
    if (o.top !== false) qf(p, At0, At1, Bt1, Bt0, [0, 0, 1])
    if (o.bottom !== false) qf(p, A0, A1, B1, B0, [0, 0, -1])
    if (o.inner !== false) qf(p, A0, B0, Bt0, At0, [-1, 0, 0])
    if (o.outer !== false) qf(p, A1, B1, Bt1, At1, [1, 0, 0])
  }
  if (o.ends !== false) {
    const a = ys[0], b = ys[ys.length - 1]
    qf(p, [x0, a, zb(a)], [x1, a, zb(a)], [x1, a, zt(a)], [x0, a, zt(a)], [0, -1, 0])
    qf(p, [x0, b, zb(b)], [x1, b, zb(b)], [x1, b, zt(b)], [x0, b, zt(b)], [0, 1, 0])
  }
}

/** A plate in the y–z plane, extruded across x0..x1: both faces and the rim edges flagged in `rim`. */
function plate(p: Part, poly: XY[], x0: number, x1: number, rim: (i: number) => boolean = () => true, only = 0) {
  for (const [a, b, c] of earcut(poly)) {
    for (const [x, s] of ([[x0, -1], [x1, 1]] as [number, number][]).filter(([, s]) => !only || s === only))
      tf(p, [x, poly[a][0], poly[a][1]], [x, poly[b][0], poly[b][1]], [x, poly[c][0], poly[c][1]], [s, 0, 0])
  }
  // outward normal of each edge in the y–z plane, from the polygon's winding
  let area = 0
  for (let i = 0; i < poly.length; i++) { const u = poly[i], v = poly[(i + 1) % poly.length]; area += u[0] * v[1] - v[0] * u[1] }
  const sg = area > 0 ? 1 : -1
  for (let i = 0; i < poly.length; i++) {
    if (!rim(i)) continue
    const u = poly[i], v = poly[(i + 1) % poly.length]
    const n: V3 = [0, sg * (v[1] - u[1]), -sg * (v[0] - u[0])]
    qf(p, [x0, u[0], u[1]], [x1, u[0], u[1]], [x1, v[0], v[1]], [x0, v[0], v[1]], n)
  }
}

/**
 * One arch span between faces ya and yb: a rib on each side, the spandrel
 * columns standing on it and the arched heads between them under the deck.
 */
function span(c: Part, ya: number, yb: number, springA: number, springB: number) {
  const ym = (ya + yb) / 2, half = (yb - ya) / 2
  const crownI = road(ym) - DECK - 1.0
  // circular segment through (ya, springA), (ym, crownI), (yb, springB) — springs are equal except at the ends
  const spring = Math.min(springA, springB)
  const rise = crownI - spring, R = (half * half + rise * rise) / (2 * rise), zc = crownI - R
  const intra = (y: number) => zc + Math.sqrt(Math.max(0, R * R - (y - ym) ** 2))
  const depth = (y: number) => 1.0 + 0.6 * ((y - ym) / half) ** 2
  const extra = (y: number) => intra(y) + depth(y)
  const deckU = (y: number) => road(y) - DECK
  const SEG = 8
  for (const s of [-1, 1]) {
    const [xa, xb] = s < 0 ? [-RIB_X[1], -RIB_X[0]] : [RIB_X[0], RIB_X[1]]
    // the rib
    const pts = Array.from({ length: SEG + 1 }, (_, k) => ya + ((yb - ya) * k) / SEG)
    for (let k = 0; k < SEG; k++) {
      const a = pts[k], b = pts[k + 1]
      const nI = (y: number): V3 => [0, ym - y, zc - intra(y)]
      const mI = nI((a + b) / 2)
      qf(c, [xa, a, intra(a)], [xb, a, intra(a)], [xb, b, intra(b)], [xa, b, intra(b)], mI)
      qf(c, [xa, a, intra(a)], [xa, b, intra(b)], [xa, b, extra(b)], [xa, a, extra(a)], [-1, 0, 0])
      qf(c, [xb, a, intra(a)], [xb, b, intra(b)], [xb, b, extra(b)], [xb, a, extra(a)], [1, 0, 0])
    }
    // spandrel: columns at a 3.9 m pitch from the crown outwards, arched heads between
    const cols: number[] = []
    for (let u = 3.9; u < half - 1.0; u += 3.9) cols.push(ym - u, ym + u)
    cols.sort((p, q) => p - q)
    const stations = [ya, ...cols, yb]
    for (const y of cols) {
      const z0 = extra(y) - 0.3, z1 = deckU(y)
      if (z1 - z0 < 0.6) continue
      // three sides: the face toward the other rib is left open (it is only ever seen through an opening)
      const xo = s < 0 ? xa : xb, xi = s < 0 ? xb : xa
      qf(c, [xo, y - 0.4, z0], [xo, y + 0.4, z0], [xo, y + 0.4, z1], [xo, y - 0.4, z1], [s, 0, 0])
      for (const e of [-1, 1]) qf(c, [xa, y + e * 0.4, z0], [xb, y + e * 0.4, z0], [xb, y + e * 0.4, z1], [xa, y + e * 0.4, z1], [0, e, 0])
      void xi
    }
    for (let i = 0; i < stations.length - 1; i++) {
      const a = stations[i] + (i === 0 ? 0 : 0.4), b = stations[i + 1] - (i === stations.length - 2 ? 0 : 0.4)
      const top = deckU((a + b) / 2) + 0.05
      const low = Math.min(extra(a), extra(b))
      const r = (b - a) / 2
      const avail = top - 0.45 - Math.max(extra(a), extra(b))
      if (avail < 0.8) {
        // too shallow for an opening: a solid web down into the rib
        plate(c, [[a, low - 0.3], [b, low - 0.3], [b, top], [a, top]], xa, xb, () => false, s)
        continue
      }
      // the opening's head: a semicircle where there is room, a flatter segment near the crown
      const h = Math.min(r, avail * 0.55), sp = top - 0.45 - h
      const R2 = (r * r + h * h) / (2 * h), zc2 = sp + h - R2, f0 = Math.atan2(sp - zc2, r)
      const poly: XY[] = [[a, top], [a, sp]]
      const n = 4
      for (let k = 1; k < n; k++) {
        const t = Math.PI - f0 - ((Math.PI - 2 * f0) * k) / n
        poly.push([(a + b) / 2 + R2 * Math.cos(t), zc2 + R2 * Math.sin(t)])
      }
      poly.push([b, sp], [b, top])
      plate(c, poly, xa, xb, (k) => k >= 1 && k <= n, s) // only the soffit; the top is under the deck, the ends against columns
    }
  }
}

function build() {
  const c = new Part(), walk = new Part(), iron = new Part(), lamp = new Part()

  // ---- Piers: a stepped footing in the river, a shaft up to the deck, a pilaster at each edge.
  for (const y of PIERS) {
    cbox(c, rect(-9.4, 9.4, y - 3.2, y + 3.2), 0, 1.6)
    cbox(c, rect(-8.8, 8.8, y - 2.6, y + 2.6), 1.6, 3.2, { c: 0.9 })
    cbox(c, rect(-6.9, 6.9, y - PIER_HALF, y + PIER_HALF), 3.2, road(y) - DECK, { top: false })
    for (const s of [-1, 1]) {
      const [x0, x1] = s < 0 ? [-HALF - 0.4, -6.9] : [6.9, HALF + 0.4]
      cbox(c, rect(x0, x1, y - 1.3, y + 1.3), 3.2, road(y) + 1.35)
    }
  }

  // ---- Abutments at both ends, down to y = 0 (the banks hide them).
  for (const s of [-1, 1]) {
    const y0 = s < 0 ? -END : END - 4.0, y1 = s < 0 ? -END + 4.0 : END
    cbox(c, rect(-HALF - 0.4, HALF + 0.4, y0, y1), 0, road(s * END) - 0.3, { b: 0.2 })
  }

  // ---- Arch spans: nine between the piers, and the shorter end spans to the abutments.
  for (let i = 0; i < PIERS.length - 1; i++) span(c, PIERS[i] + PIER_HALF, PIERS[i + 1] - PIER_HALF, SPRING, SPRING)
  span(c, -END + 4.0, PIERS[0] - PIER_HALF, SPRING, SPRING)
  span(c, PIERS[PIERS.length - 1] + PIER_HALF, END - 4.0, SPRING, SPRING)

  // ---- Deck: the slab under the roadway (0.3 m under it), the sidewalks with their cornice, the balustrades.
  const ys: number[] = []
  for (let y = -END; y < END - 1e-6; y += PITCH) ys.push(y)
  ys.push(END)
  beam(c, -RIB_X[0] - 1.2, RIB_X[0] + 1.2, ys, (y) => road(y) - DECK, (y) => road(y) - 0.3, { inner: false, outer: false, ends: false })
  for (const s of [-1, 1]) {
    const io = (a: number, b: number): [number, number] => (s < 0 ? [-b, -a] : [a, b])
    // cornice and sidewalk slab: from inside the ribs out to the edge
    const [cx0, cx1] = io(RIB_X[0] - 0.2, HALF)
    beam(c, cx0, cx1, ys, (y) => road(y) - DECK - 0.4, (y) => road(y) + 0.1, { top: false, inner: false, ends: false })
    // the cornice's lip, a bevel along the outer bottom edge
    const [wx0, wx1] = io(RIB_X[0] - 0.2, HALF - 0.35)
    beam(walk, wx0, wx1, ys, (y) => road(y) + 0.1, (y) => road(y) + 0.15, { bottom: false, ends: false, outer: false })
    // balustrade, a solid rail with a bevelled cap
    const [bx0, bx1] = io(HALF - 0.35, HALF)
    beam(c, bx0, bx1, ys, (y) => road(y) + 0.1, (y) => road(y) + 1.0, { bottom: false, ends: false })
  }

  // ---- Lamp standards: one on each pier pilaster, a taller pair on each abutment.
  const standard = (x: number, y: number, z: number, big: boolean) => {
    const w = big ? 0.9 : 0.6
    if (big) cbox(c, rect(x - w, x + w, y - w, y + w), z, z + 2.0)
    const z1 = z + (big ? 2.0 : 1.2)
    cbox(iron, rect(x - 0.22, x + 0.22, y - 0.22, y + 0.22), z1, z1 + 3.3, { top: false })
    cbox(lamp, rect(x - 0.38, x + 0.38, y - 0.38, y + 0.38), z1 + 3.3, z1 + 4.5, { top: false })
    cbox(iron, rect(x - 0.45, x + 0.45, y - 0.45, y + 0.45), z1 + 4.5, z1 + 4.75)
  }
  for (const y of PIERS) for (const s of [-1, 1]) standard(s * (HALF - 0.2), y, road(y) + 0.15, false)
  for (const e of [-1, 1]) for (const s of [-1, 1]) standard(s * (HALF - 0.4), e * (END - 1.2), road(e * END) + 0.15, true)

  return [
    { part: c, material: CONCRETE },
    { part: walk, material: WALK },
    { part: iron, material: IRON },
    { part: lamp, material: LAMP },
  ]
}

if (import.meta.main && process.env.CROP) {
  // review aid: only the stretch between two piers' worth of spans, written to a scratch path
  const { writeGlb } = await import('./mesh')
  const keep = (part: Part) => {
    const q = new Part()
    for (let i = 0; i < part.pos.length; i += 9) {
      const ys = [part.pos[i + 2], part.pos[i + 5], part.pos[i + 8]].map((v) => -v)
      if (ys.every((y) => y > Number(process.env.Y0 ?? -46) && y < Number(process.env.Y1 ?? 82))) { q.pos.push(...part.pos.slice(i, i + 9)); q.nrm.push(...part.nrm.slice(i, i + 9)); q.uv.push(...part.uv.slice((i / 9) * 6, (i / 9) * 6 + 6)) }
    }
    return q
  }
  await Bun.write(process.env.CROP, writeGlb('crop', build().map(({ part, material }) => ({ part: keep(part), material }))))
} else if (import.meta.main) {
  await saveModel('cola-gervais-street-bridge', 'Gervais Street Bridge', build(), { source: "generators/cola-gervais-street-bridge.ts" }, 6500)
}
