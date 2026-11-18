/**
 * Louvre Abu Dhabi, Saadiyat Island (Ateliers Jean Nouvel, opened 2017):
 * procedural, CC0-1.0.
 * bun generators/abu-dhabi-louvre.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/abu-dhabi-louvre.glb (low, under 6,500 triangles): the white
 *   "medina" of gallery cubes and the 180 m dome as two openwork layers of
 *   real bars (two triangular star grids, turned 30 degrees to each other),
 *   with the holes between the bars open, over a solid rim ring.
 * - models/abu-dhabi-louvre.detail.glb (under 40,000): the same cubes and
 *   four lattice layers, each bar a solid with depth (top and both sides):
 *   7.5 m and 12 m grids outside, 7.2 m and 6.1 m grids inside, each turned
 *   and offset, so the layers cross into stars as on the real dome
 *   (eight layers of 7,850 stars, here four).
 *
 * Frame: anchor at the centroid of the OSM outline (way/498046180),
 * 54.3985952, 24.5336433; bearing 49.5, the direction the gallery blocks
 * run (OSM outline edges at 48.7-54.7 and 139-143), so the blocks are
 * axis-aligned in the model. The dome's centre is OSM's dome part
 * (way/403276371, a 20-gon of 182 m) centroid, 54.3984451, 24.5337761.
 *
 * Heights and sizes. Published: dome 180 m across, its highest point 36 m
 * above the ground floor (40 m above sea level), four hidden piers 110 m
 * apart, weight 7,500 t, eight layers of 7,850 stars, 55 buildings of
 * which 23 are galleries (louvreabudhabi.ae "The building"; Wikipedia).
 * The structure is about 7 m thick at the crown (RIBA Journal; not
 * independently confirmed). OSM: outline height 10 m, 3 levels; the dome
 * part min_height 10 m, the rim's underside, used here. Estimated from
 * photos: the dome profile, flatter on top and steeper toward the rim
 * (e02, e04, c04, c05, the architect's model), z = rim + H (1 - (r/R)^2.4);
 * the outer layer meets the rim at 12.4 m; the rim band 2.6 m deep; bar
 * widths about 2 m on the outer layer (e04 crop: the outer bars are about
 * a sixth of a star's width); the gallery cubes 7 to 17 m, two to three
 * storeys of white panels (e02, e04, s02, c07, o04, o08); under the dome
 * every cube clears its underside by at least 2.5 m.
 *
 * Plan. OSM maps the museum as one outline around the whole island
 * complex, with no building parts for the galleries. The cubes here are
 * laid out by splitting the outline's area into blocks of 12-30 m with
 * 4-7 m lanes and canals between (the "medina" of c04/c05), kept inside
 * the outline, with an open plaza and water basin under the dome's centre
 * opening to the sea on the south-west (o02, o07, c10, the architect's
 * model). The layout is a stand-in at the right grain and extent, not a
 * survey of the 55 buildings: no open plan shows them one by one.
 *
 * Colour: gallery walls white #f3f2ee (sunlit panels #f4f4f2 in e04,
 * shaded #c1c8ce in e02, read as white); roofs the same white, a shade
 * darker (c04/c05 show them white). Dome: outer bars light silver #dcdee0 (the dome reads silvery near-white
 * in e02 and the other daylight views; bar pixels #8d8f92 in e02 and
 * #6b6c6e-#76787a in e04 are the shaded sides, so the sunlit tone is used,
 * at the palette's lightness); the lower layers a slightly darker silver
 * #b3b8bc, the shadow detail seen through the holes (e04, o01, o05).
 * (Lead review round 1: lightened from mid-grey #a9abad.) Slot
 * windows and glazed doors slate `window` (e04, o08).
 *
 * Night: the cubes are floodlit (_FLOODLIGHT on the walls); the slots
 * glow as windows; the dome is lit from below and stays itself (not
 * glowing). The sea, the basins and the paving are the map's.
 *
 * Elevation 0. The site is reclaimed land at sea level; the water around
 * and between the buildings is not modelled.
 *
 * Photos (EVIDENCE):
 * - e02 "Louvre Abu Dhabi", Roller Coaster Philosoph, CC BY 2.0, https://www.flickr.com/photos/32916425@N04/39755590230 (dome over the entrance, from the south-east)
 * - e04 "Louvre Abu Dhabi", Roller Coaster Philosoph, CC BY 2.0, https://www.flickr.com/photos/32916425@N04/40671252165 (outer lattice, entrance block)
 * - e01, e05, e08 "Louvre Abu Dhabi", Roller Coaster Philosoph, CC BY 2.0, https://www.flickr.com/photos/32916425@N04/39755569630, .../40852407424, .../41521605722 (cubes, canopy walk)
 * - o01, o02, o05, o07 "Louvre Abu Dhabi", Roller Coaster Philosoph, CC BY 2.0, https://www.flickr.com/photos/32916425@N04/39754585730, .../27693349928, .../41521990142, .../26694416957 (lattice from below, rim, plaza and basin)
 * - o05b "Dome", a.canvas.of.light, CC BY 2.0, https://www.flickr.com/photos/96346885@N04/52568978674
 * - s02 "Abu Dhabi", sergei.gussev, CC BY 2.0, https://www.flickr.com/photos/133200397@N03/48341438347 (cubes in the basin under the dome's edge)
 * - c04, c05 "Jean nouvel, modellino del louvre abu dhabi" / "... loubre ...", Francesco Bini, CC BY-SA 4.0, Wikimedia Commons (the architect's model: plan, dome profile)
 * - c07 "Louvre abu dhabi, interno, cortile coperto 01", Francesco Bini, CC BY-SA 4.0, Wikimedia Commons
 * - c02 "Visitors at Louvre Abu Dhabi", Tasos Lekkas, CC0, Wikimedia Commons
 * - c10 "LouvreAD platforms", Boubloub, CC BY-SA 4.0, Wikimedia Commons
 * Look-only (not relied on): "408 - Louvre Abu Dhabi - Dome And Museum
 * Layers", Leo Reynolds, CC BY-NC-SA 2.0, https://www.flickr.com/photos/49968232@N00/49417996753
 * Facts: https://www.louvreabudhabi.ae/en/about-us/architecture ;
 * https://en.wikipedia.org/wiki/Louvre_Abu_Dhabi ;
 * https://ribaj.com/buildings/too-much-history-louvre-abu-dhabi-ateliers-jean-nouvel
 *
 * Doubts: no open aerial photo, so the dome's profile comes from oblique
 * ground photos and the architect's model; the individual gallery cubes
 * are a generated layout in OSM's outline (see Plan); the plaza's size and
 * its opening to the sea are estimated; the real star pattern (layers at
 * several scales and rotations) is drawn as four triangular grids; the
 * four piers are hidden in the real building and are not drawn.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 49.5
const LNG = 54.3985952, LAT = 24.5336433
const DOME = { lng: 54.3984451, lat: 24.5337761, R: 90 }

// OSM outline (way/498046180), local metres east/north of the anchor.
const OUTLINE: [number, number][] = [
  [-38.7, 113.9], [-67.1, 151.3], [-72.4, 147.8], [-52.4, 120.5], [-95.3, 90.1], [-81.9, 72.2], [-110.7, 50.9], [-101.9, 39.2],
  [-103.6, 27.6], [-138.2, -2.5], [-122.6, -20.4], [-135.9, -32.1], [-96.9, -77.4], [-82.8, -65.9], [-67.3, -87.7], [-55.0, -78.9],
  [-52.7, -82.0], [-64.3, -91.8], [-55.5, -104.7], [-46.0, -97.9], [-40.5, -105.8], [-43.3, -109.1], [-28.1, -129.7], [-36.8, -136.3],
  [-34.5, -139.2], [-12.5, -122.9], [-9.1, -127.5], [-16.3, -132.9], [-7.8, -144.2], [8.0, -132.5], [9.7, -134.7], [3.3, -139.5],
  [7.5, -145.1], [16.4, -138.4], [4.8, -123.3], [10.2, -119.2], [13.3, -123.2], [17.2, -119.2], [18.5, -120.5], [17.3, -121.6],
  [32.2, -138.2], [49.3, -123.2], [47.6, -121.3], [52.6, -116.9], [54.3, -118.8], [81.3, -95.1], [76.0, -88.8], [69.7, -93.8],
  [68.8, -92.8], [56.8, -103.0], [53.4, -98.7], [60.7, -93.0], [41.5, -70.5], [54.4, -59.4], [56.6, -62.0], [52.2, -65.8],
  [60.3, -75.1], [56.4, -78.5], [61.6, -84.5], [68.0, -79.0], [61.9, -71.9], [68.2, -66.5], [60.0, -57.2], [63.6, -54.1],
  [72.4, -64.2], [87.0, -53.8], [86.0, -52.6], [88.5, -50.6], [90.5, -53.0], [92.3, -51.6], [95.2, -55.2], [92.0, -57.7],
  [98.7, -65.5], [101.2, -63.2], [110.7, -73.7], [105.6, -79.0], [110.4, -84.7], [126.7, -70.7], [123.4, -66.8], [120.0, -63.0],
  [114.7, -56.9], [131.6, -44.4], [127.3, -40.2], [130.2, -36.4], [135.1, -32.0], [137.4, -29.8], [140.8, -33.5], [150.9, -24.4],
  [154.1, -17.9], [153.0, -16.7], [158.3, -11.3], [148.6, 0.2], [142.0, -6.3], [124.7, 13.1], [130.9, 18.4], [123.4, 27.0],
  [103.2, 8.2], [97.5, 16.5], [99.2, 17.6], [87.9, 34.1], [91.2, 36.4], [86.2, 43.8], [83.1, 41.7], [65.2, 68.1],
  [85.5, 82.2], [80.3, 90.1], [98.0, 101.9], [86.9, 116.8], [82.9, 122.3], [53.6, 101.5], [47.0, 110.6], [46.0, 112.1],
  [57.8, 120.5], [55.4, 123.9], [49.2, 132.0], [29.6, 117.6], [35.2, 110.0], [21.1, 100.0], [-16.8, 143.3], [-34.6, 128.4],
  [-29.8, 122.2],
]

const TAU = Math.PI * 2
const rad = (d: number) => (d * Math.PI) / 180
const B = rad(BEARING)
/** Compass east/north (m) → model x/y. */
const toModel = (e: number, n: number): [number, number] => [e * Math.cos(B) - n * Math.sin(B), e * Math.sin(B) + n * Math.cos(B)]
const POLY = OUTLINE.map(([e, n]) => toModel(e, n))
const kx = 111320 * Math.cos(rad(LAT)), ky = 110574
const DC = toModel((DOME.lng - LNG) * kx, (DOME.lat - LAT) * ky) // dome centre in model x/y

function inside(x: number, y: number, poly = POLY) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

// Deterministic random numbers, so the layout is the same every build.
let seed = 20171108
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32)

// ------------------------------------------------------------------ dome ---
type Layer = { rim: number; apex: number; s: number; rot: number; w: number; depth: number; seg: number; ox?: number; oy?: number }
const P_EXP = 2.4
const zOf = (L: Layer, r: number) => L.rim + (L.apex - L.rim) * (1 - Math.min(1, r / DOME.R) ** P_EXP)
/** Surface normal of a layer at plan offset (dx, dy) from the dome centre. */
function nOf(L: Layer, dx: number, dy: number): V3 {
  const r = Math.hypot(dx, dy) || 1e-6
  const dzdr = -(L.apex - L.rim) * P_EXP * (Math.min(1, r / DOME.R) ** (P_EXP - 1)) / DOME.R
  const n: V3 = [-dzdr * (dx / r), -dzdr * (dy / r), 1]
  const l = Math.hypot(...n)
  return [n[0] / l, n[1] / l, n[2] / l]
}

const OUTER: Layer[] = [
  { rim: 12.4, apex: 36.0, s: 7.5, rot: 0, w: 1.45, depth: 0.7, seg: 9, ox: 3.1, oy: 1.7 },
  { rim: 11.9, apex: 34.0, s: 12, rot: 17, w: 2.2, depth: 0.7, seg: 9, ox: -2.2, oy: 4.4 },
]
const INNER: Layer[] = [
  { rim: 11.4, apex: 32.0, s: 7.2, rot: 41, w: 1.2, depth: 0.6, seg: 9, ox: 1.3, oy: -2.9 },
  { rim: 10.9, apex: 30.0, s: 6.1, rot: 8, w: 1.1, depth: 0.6, seg: 9, ox: -3.4, oy: -0.8 },
]
const RIM_IN = DOME.R - 2.4 // the lattice runs into the rim band

/**
 * One layer: three families of parallel bars 60 degrees apart, which
 * together tile the dome in triangles (two layers turned 30 degrees make
 * six-pointed stars). Each bar follows the layer's surface; with `sides`
 * it is a solid of the layer's depth, else a ribbon (double-sided).
 */
function lattice(part: Part, L: Layer, sides: boolean) {
  const h = (L.s * Math.sqrt(3)) / 2
  for (let fam = 0; fam < 3; fam++) {
    const a = rad(L.rot + fam * 60)
    const d: [number, number] = [Math.cos(a), Math.sin(a)], q: [number, number] = [-Math.sin(a), Math.cos(a)]
    const lift = fam * 0.06 // keep crossing tops apart
    const off = q[0] * (L.ox ?? 0) + q[1] * (L.oy ?? 0) // the layer's lattice origin, off the dome's centre
    for (let k = -Math.ceil(RIM_IN / h) - 1; k <= Math.ceil(RIM_IN / h) + 1; k++) {
      const o = k * h + off
      if (Math.abs(o) > RIM_IN - 0.5) continue
      const half = Math.sqrt(RIM_IN ** 2 - o * o)
      const n = Math.max(1, Math.ceil((2 * half) / L.seg))
      const at = (t: number, side: number): [number, number] => [q[0] * (o + side) + d[0] * t, q[1] * (o + side) + d[1] * t]
      for (let i = 0; i < n; i++) {
        const t0 = -half + (2 * half * i) / n, t1 = -half + (2 * half * (i + 1)) / n
        const P = (t: number, side: number, down = 0): V3 => {
          const [x, y] = at(t, side)
          return [DC[0] + x, DC[1] + y, zOf(L, Math.hypot(x, y)) + lift - down]
        }
        const N = (t: number, side: number): V3 => { const [x, y] = at(t, side); return nOf(L, x, y) }
        const hw = L.w / 2
        const a0 = P(t0, -hw), a1 = P(t1, -hw), b1 = P(t1, hw), b0 = P(t0, hw)
        part.tri(a0, a1, b1, [0, 0], [0, 0], [0, 0], [N(t0, -hw), N(t1, -hw), N(t1, hw)])
        part.tri(a0, b1, b0, [0, 0], [0, 0], [0, 0], [N(t0, -hw), N(t1, hw), N(t0, hw)])
        if (!sides) continue
        const dn = L.depth
        const qa: V3 = [-q[0], -q[1], 0], qb: V3 = [q[0], q[1], 0]
        const a0d = P(t0, -hw, dn), a1d = P(t1, -hw, dn), b0d = P(t0, hw, dn), b1d = P(t1, hw, dn)
        part.tri(a0, a0d, a1d, [0, 0], [0, 0], [0, 0], [qa, qa, qa]); part.tri(a0, a1d, a1, [0, 0], [0, 0], [0, 0], [qa, qa, qa])
        part.tri(b0, b1d, b0d, [0, 0], [0, 0], [0, 0], [qb, qb, qb]); part.tri(b0, b1, b1d, [0, 0], [0, 0], [0, 0], [qb, qb, qb])
      }
    }
  }
}

/** The rim: a solid ring band with a sloped top, smooth-shaded. */
function rim(part: Part, seg: number) {
  const top = OUTER[0]
  const r0 = RIM_IN - 0.6, r1 = DOME.R + 0.4
  const zTop0 = zOf(top, r0) + 0.15, zTop1 = 12.3, zBot = 9.8
  for (let i = 0; i < seg; i++) {
    const a0 = (TAU * i) / seg, a1 = (TAU * (i + 1)) / seg
    const c0: [number, number] = [Math.cos(a0), Math.sin(a0)], c1: [number, number] = [Math.cos(a1), Math.sin(a1)]
    const p = (c: [number, number], r: number, z: number): V3 => [DC[0] + c[0] * r, DC[1] + c[1] * r, z]
    const out = (c: [number, number]): V3 => [c[0], c[1], 0]
    const inn = (c: [number, number]): V3 => [-c[0], -c[1], 0]
    const up = (c: [number, number]): V3 => { const t = 0.35; const l = Math.hypot(t, 1); return [c[0] * t / l, c[1] * t / l, 1 / l] }
    const dn: V3 = [0, 0, -1]
    // sloped top
    part.tri(p(c0, r0, zTop0), p(c0, r1, zTop1), p(c1, r1, zTop1), [0, 0], [0, 0], [0, 0], [up(c0), up(c0), up(c1)])
    part.tri(p(c0, r0, zTop0), p(c1, r1, zTop1), p(c1, r0, zTop0), [0, 0], [0, 0], [0, 0], [up(c0), up(c1), up(c1)])
    // outer face
    part.tri(p(c0, r1, zBot), p(c1, r1, zBot), p(c1, r1, zTop1), [0, 0], [0, 0], [0, 0], [out(c0), out(c1), out(c1)])
    part.tri(p(c0, r1, zBot), p(c1, r1, zTop1), p(c0, r1, zTop1), [0, 0], [0, 0], [0, 0], [out(c0), out(c1), out(c0)])
    // inner face and soffit
    part.tri(p(c0, r0, zBot), p(c0, r0, zTop0), p(c1, r0, zTop0), [0, 0], [0, 0], [0, 0], [inn(c0), inn(c0), inn(c1)])
    part.tri(p(c0, r0, zBot), p(c1, r0, zTop0), p(c1, r0, zBot), [0, 0], [0, 0], [0, 0], [inn(c0), inn(c1), inn(c1)])
    part.tri(p(c0, r0, zBot), p(c1, r1, zBot), p(c0, r1, zBot), [0, 0], [0, 0], [0, 0], [dn, dn, dn])
    part.tri(p(c0, r0, zBot), p(c1, r0, zBot), p(c1, r1, zBot), [0, 0], [0, 0], [0, 0], [dn, dn, dn])
  }
}

// --------------------------------------------------------------- galleries ---
type Block = { x0: number; y0: number; x1: number; y1: number; h: number }
const UNDER = (r: number) => (r >= DOME.R + 1 ? Infinity : 10 + (29 - 10) * (1 - Math.min(1, r / DOME.R) ** P_EXP))
const PLAZA = { r: 30 }
/** The open water basin: the plaza under the centre and its opening to the sea, south-west. */
function inPlaza(x: number, y: number) {
  const dx = x - DC[0], dy = y - DC[1]
  if (Math.hypot(dx, dy) < PLAZA.r) return true
  const a = rad(225 - BEARING) // compass 225 in the model frame (x right, y up)
  const dir: [number, number] = [Math.sin(a), Math.cos(a)]
  const along = dx * dir[0] + dy * dir[1], across = Math.abs(-dx * dir[1] + dy * dir[0])
  return along > 0 && across < 19
}

function layout(): Block[] {
  const xs = POLY.map((p) => p[0]), ys = POLY.map((p) => p[1])
  const out: Block[] = []
  const split = (x0: number, y0: number, x1: number, y1: number, depth: number, force = false) => {
    const w = x1 - x0, d = y1 - y0
    if ((force || w > 26 || d > 26) && depth < 14 && (w > 14 || d > 14)) {
      const gap = 4 + rnd() * 3
      const t = 0.35 + rnd() * 0.3
      if (w >= d) { const m = x0 + w * t; split(x0, y0, m - gap / 2, y1, depth + 1); split(m + gap / 2, y0, x1, y1, depth + 1) }
      else { const m = y0 + d * t; split(x0, y0, x1, m - gap / 2, depth + 1); split(x0, m + gap / 2, x1, y1, depth + 1) }
      return
    }
    if (w < 7 || d < 7) return
    const pts: [number, number][] = []
    for (const fx of [0, 0.5, 1]) for (const fy of [0, 0.5, 1]) pts.push([x0 + w * fx, y0 + d * fy])
    const ins = pts.filter(([x, y]) => inside(x, y) && !inPlaza(x, y)).length
    if (ins === 0) return
    if (ins < pts.length) { if (w > 14 || d > 14) split(x0, y0, x1, y1, depth, true); return }
    if (rnd() < 0.08) return // a courtyard or canal
    // Height: two to three storeys, clear of the dome's underside.
    let clear = Infinity
    for (const [x, y] of pts) clear = Math.min(clear, UNDER(Math.hypot(x - DC[0], y - DC[1])) - 2.5)
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as [number, number][])
      clear = Math.min(clear, UNDER(Math.hypot(x - DC[0], y - DC[1])) - 2.5)
    const want = [7.5, 9.5, 11.5, 13.5, 15.5, 17][Math.floor(rnd() * 6)]
    const h = Math.min(want, clear)
    if (h < 6) return
    out.push({ x0, y0, x1, y1, h })
  }
  split(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 0)
  return out
}

/** A box with a chamfered top edge. */
function block(wall: Part, roof: Part, b: Block, ch = 0.45) {
  const { x0, y0, x1, y1, h } = b
  const c: [number, number][] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const ci: [number, number][] = [[x0 + ch, y0 + ch], [x1 - ch, y0 + ch], [x1 - ch, y1 - ch], [x0 + ch, y1 - ch]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    wall.quad([c[i][0], c[i][1], 0], [c[j][0], c[j][1], 0], [c[j][0], c[j][1], h - ch], [c[i][0], c[i][1], h - ch])
    wall.quad([c[i][0], c[i][1], h - ch], [c[j][0], c[j][1], h - ch], [ci[j][0], ci[j][1], h], [ci[i][0], ci[i][1], h])
  }
  roof.quad([ci[0][0], ci[0][1], h], [ci[1][0], ci[1][1], h], [ci[2][0], ci[2][1], h], [ci[3][0], ci[3][1], h])
}

/** A slot window or a glazed door on one face, 0.05 m proud of the wall. */
function openings(win: Part, b: Block, detail: boolean) {
  const faces: Array<[[number, number], [number, number], [number, number]]> = [
    [[b.x0, b.y0], [b.x1, b.y0], [0, -1]], [[b.x1, b.y0], [b.x1, b.y1], [1, 0]],
    [[b.x1, b.y1], [b.x0, b.y1], [0, 1]], [[b.x0, b.y1], [b.x0, b.y0], [-1, 0]],
  ]
  for (const [p, q, n] of faces) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (L < 12 || rnd() < (detail ? 0.35 : 0.55)) continue
    const kind = rnd()
    // a wide band window (e04, o08), or a tall slot (e01), or a door at the foot
    const [w, z0, z1] = kind < 0.4 ? [Math.min(9, L * 0.45), b.h * 0.45, b.h * 0.45 + 2.6] : kind < 0.75 ? [2.2, 2.5, Math.min(b.h - 2, 8)] : [3.6, 0, 3.4]
    if (z1 - z0 < 1.5) continue
    const t = 0.2 + rnd() * 0.6
    const cx = p[0] + (q[0] - p[0]) * t, cy = p[1] + (q[1] - p[1]) * t
    const ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L
    const tc = Math.min(Math.max(t * L, w / 2 + 1.5), L - w / 2 - 1.5) - t * L
    const mx = cx + ux * tc + n[0] * 0.05, my = cy + uy * tc + n[1] * 0.05
    const A: V3 = [mx - ux * w / 2, my - uy * w / 2, z0], Bv: V3 = [mx + ux * w / 2, my + uy * w / 2, z0]
    win.quad(A, Bv, [Bv[0], Bv[1], z1], [A[0], A[1], z1])
  }
}

// ------------------------------------------------------------------ build ---
type Mats = { wall: Part; roof: Part; dome: Part; inner: Part; win: Part }
function build(detail: boolean): Mats {
  seed = 20171108
  const M: Mats = { wall: new Part(), roof: new Part(), dome: new Part(), inner: new Part(), win: new Part() }
  const blocks = layout()
  for (const b of blocks) { block(M.wall, M.roof, b); openings(M.win, b, detail) }
  if (detail) {
    lattice(M.dome, OUTER[0], true); lattice(M.dome, OUTER[1], true)
    lattice(M.inner, INNER[0], true); lattice(M.inner, INNER[1], true)
  } else {
    lattice(M.dome, OUTER[0], false)
    lattice(M.inner, OUTER[1], false)
  }
  rim(M.dome, detail ? 64 : 40)
  console.log(`${blocks.length} gallery blocks`)
  return M
}

const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.7)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.wall, material: { ...finish('louvre-white', 0xf3f2ee), floodlight: lit } },
    { part: M.roof, material: finish('louvre-roof', 0xe6e5e1) },
    { part: M.dome, material: { ...finish('louvre-dome', 0xdcdee0, 0.45), doubleSided: true } },
    { part: M.inner, material: { ...finish('louvre-dome-inner', 0xb3b8bc, 0.5), doubleSided: true } },
    { part: M.win, material: PALETTE.window },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Louvre Abu Dhabi', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: BEARING, elevation: 0, height: 36,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

if (import.meta.main) {
  await write('abu-dhabi-louvre.glb', materials(build(false)), 6500, 250_000)
  await write('abu-dhabi-louvre.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
}
