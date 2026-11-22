/**
 * Jacksonville Center for the Performing Arts (Civic Auditorium 1962;
 * Times-Union Center for the Performing Arts after the 1995-97 rebuild,
 * until the newspaper's naming rights lapsed), Jacksonville — original
 * procedural geometry, CC0-1.0.
 * bun generators/jax-times-union-center.ts
 *
 * The riverfront arts centre on Water Street: three halls (the Moran
 * Theater, the Jacoby Symphony Hall and the Terry Theater) under one low
 * beige-stucco podium. From the river it shows a broad drum-shaped lobby
 * behind a colonnade of square piers carrying a deep cornice, with tall
 * glazing set back behind the piers; a second, smaller colonnaded drum
 * rounds the west end. Above the podium rise the plain stucco boxes of the
 * halls: the tallest, the stage house at the east end, then the symphony
 * hall and the west theatre. On Water Street a flat porte-cochère canopy
 * stands before a glazed two-storey lobby.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 14:
 * the outline's main walls run 12.5-14° clockwise of the compass. Origin =
 * centroid of way/170066688.
 *
 * Evidence
 * - OSM way/170066688 ("Jacksonville Center for the Performing Arts",
 *   building=public_building, 3 levels, wikidata Q14686451): the whole
 *   outline, x -86..92, y -55..51; the two drums are arcs in it (south:
 *   centre (-13.8, -15.4), radius 39.9, from -116° to -32°; west: centre
 *   (-59.2, -8), radius 26.5, from 154° to 227°, fitted by hand to its
 *   vertices); the porte-cochère is its northward bump x -28..-9.4,
 *   y 34.3..51.1. The model uses the outline's vertices.
 * - USGS 3DEP lidar FL_Peninsular_FDEM_Duval_2018 (flown 2018), 1 m grid
 *   read in this frame, heights above the lowest ground at the foot (~1.6
 *   above the grid minimum): stage house 35.7 (x 32..51, y -8..25);
 *   symphony hall 22.4 (x -11..31, narrowing south to x -3..4 at y -26);
 *   west theatre 20.9 (x -83..-30, y -22..5); main podium and the south
 *   drum 12.0; west drum ~11; the north-west and south-west wings 7.8;
 *   porte-cochère 7.6.
 * - Published (Wikipedia "Jacksonville Center for the Performing Arts"):
 *   opened 1962 as the Civic Auditorium, rebuilt 1995-97, reopened
 *   February 1997; three venues.
 * - Photos (all Michael Rivera, CC BY-SA 4.0, Commons):
 *   · "Times Union Center taken from near St. Johns River.jpg" (the south
 *     drum's colonnade from the riverwalk),
 *     https://commons.wikimedia.org/wiki/File:Times_Union_Center_taken_from_near_St._Johns_River.jpg
 *   · "Times Union Center taken from end of W Coastline Dr.jpg" (from the
 *     west: the west drum, the glazed west wing, the halls behind),
 *     https://commons.wikimedia.org/wiki/File:Times_Union_Center_taken_from_end_of_W_Coastline_Dr.jpg
 *   · "Times Union Center, Water St 1.jpg" (from Water Street, north-west:
 *     stage house, symphony hall, porte-cochère),
 *     https://commons.wikimedia.org/wiki/File:Times_Union_Center,_Water_St_1.jpg
 *   · "Times Union Center taken from Jacksonville Landing.jpg" (the glazed
 *     lobby under a hall box, head on),
 *     https://commons.wikimedia.org/wiki/File:Times_Union_Center_taken_from_Jacksonville_Landing.jpg
 *
 * Measured: plan (OSM), heights (lidar). Published: dates, names.
 * Estimated from the photos: bold square piers 2 m wide at ~7.5 m spacing
 * (nine on the riverfront arc), the colonnade 4.5 m deep, its entablature
 * 2.8 m deep (about a quarter of the pier height in the riverwalk photo);
 * full-height glazing from the plaza to the soffit behind the piers; the
 * riverfront drum's rim 12.2 m (lidar: rim 13.75 above grid minimum, the
 * model's base 1.6); glazing heights; the stucco colour.
 * Where the outline follows a drum's arc, the 7.8 m podium is pulled in
 * behind the drum's glazing so the colonnade stands open.
 * Left out: the two freestanding Ionic columns on Water Street, the
 * lettering, the rooftop plant, the vents on the hall boxes; the symphony
 * hall's curved upper edge seen from Water Street is drawn as a bevel.
 *
 * Night: lobby glazing `window`; the porte-cochère's lobby `entrance`.
 *
 * Doubts: the east and south-east sides are not photographed; the halls'
 * plans are read from 1 m lidar only.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 14
const ANCHOR = { lng: -81.66240847, lat: 30.32496676 }

type XY = [number, number]
const stucco = new Part(), win = new Part(), roof = new Part(), trim = new Part(), lobby = new Part()

const area2 = (p: XY[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const ccw = (p: XY[]) => (area2(p) < 0 ? [...p].reverse() : p)

/** Ear-clipping triangulation of a simple polygon, counter-clockwise from above. */
function capPoly(part: Part, poly: XY[], z: number, up = true) {
  const idx = poly.map((_, i) => i)
  const area = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => area(a, b, p) > 1e-9 && area(b, c, p) > 1e-9 && area(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (area(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      tri(a, b, c)
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) tri(poly[idx[0]], poly[idx[1]], poly[idx[2]])
  function tri(a: XY, b: XY, c: XY) {
    if (up) part.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
    else part.tri([a[0], a[1], z], [c[0], c[1], z], [b[0], b[1], z])
  }
}

/** A prism: walls (counter-clockwise polygon) and a roof cap; bevelled top edge when bev > 0. */
function mass(poly: XY[], z0: number, z1: number, wall = stucco, bev = 0) {
  const p = ccw(poly)
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1 - bev], [a[0], a[1], z1 - bev])
  }
  if (bev > 0) {
    const inset = insetPoly(p, bev)
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length], c = inset[i], d = inset[(i + 1) % p.length]
      wall.quad([a[0], a[1], z1 - bev], [b[0], b[1], z1 - bev], [d[0], d[1], z1], [c[0], c[1], z1])
    }
    capPoly(roof, inset, z1)
  } else capPoly(roof, p, z1)
}
/** Offset a counter-clockwise polygon inward by d (mitred). */
function insetPoly(p: XY[], d: number): XY[] {
  return p.map((v, i) => {
    const a = p[(i + p.length - 1) % p.length], b = p[(i + 1) % p.length]
    const n1 = norm([-(v[1] - a[1]), v[0] - a[0]]), n2 = norm([-(b[1] - v[1]), b[0] - v[0]])
    const m = norm([n1[0] + n2[0], n1[1] + n2[1]]), k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [v[0] + m[0] * k, v[1] + m[1] * k] as XY
  })
}
const norm = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A window panel on the wall a→b (counter-clockwise from above), between s0..s1 along it. */
function panel(part: Part, a: XY, b: XY, z0: number, z1: number, m = 0.6) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < 2 * m + 1) return
  const ux = (b[0] - a[0]) / l, uy = (b[1] - a[1]) / l, nx = uy * 0.06, ny = -ux * 0.06
  const at = (s: number, z: number): V3 => [a[0] + ux * s + nx, a[1] + uy * s + ny, z]
  part.quad(at(m, z0), at(l - m, z0), at(l - m, z1), at(m, z1))
}

// ─── the podium: the whole outline at the wings' 7.8 m, without the porte-cochère bump ───
// Where the outline follows a drum's arc it is pulled in behind the drum's glazing, so the
// colonnade stands open in front of full-height glass (the podium must not wall it up).
const DRUMS = [
  { c: [-13.8, -15.4] as XY, R: 39.9, a0: -116, a1: -32, h: 12.2 }, // the riverfront drum
  { c: [-59.2, -8] as XY, R: 26.5, a0: 154, a1: 227, h: 11.0 }, // the west drum
]
const DRUM_DEPTH = 4.5, DRUM_CORN = 2.8
const pulled = new Set<string>()
const pullIn = (v: XY): XY => {
  for (const d of DRUMS) {
    const dx = v[0] - d.c[0], dy = v[1] - d.c[1], r = Math.hypot(dx, dy)
    let t = (Math.atan2(dy, dx) * 180) / Math.PI
    if (t < d.a0 - 1) t += 360
    if (r > d.R - 4 && t >= d.a0 - 1 && t <= d.a1 + 1) {
      const k = (d.R - DRUM_DEPTH - 0.3) / r, q: XY = [d.c[0] + dx * k, d.c[1] + dy * k]
      pulled.add(q.join()); return q
    }
  }
  return v
}
const OUTLINE: XY[] = ccw(([
  [-73.17, 25.87], [-41.66, 26.62], [-41.92, 34.26], [-28.11, 34.27], [-9.43, 34.13], [41.35, 34.03], [48.62, 35.06],
  [54.07, 36.66], [79.18, 46.05], [83.74, 30.81], [85.12, 31.13], [88.41, 26.42], [90.71, 21.29], [91.71, 17.2],
  [91.82, 10.8], [90.69, 5.28], [89.69, 2.49], [88.38, 2.3], [89.49, -12.91], [62.94, -12.9], [55.17, -13.56],
  [47.06, -15.09], [13.53, -27.83], [15.35, -32.76], [18.96, -34.85], [21.49, -29.99], [22.73, -30.69], [19.97, -36.63],
  [17.32, -40.47], [11.51, -45.86], [4.78, -50.66], [-2.78, -53.77], [-10.04, -55.4], [-17.59, -55.24], [-25.04, -53.68],
  [-31.47, -51.19], [-30.88, -49.66], [-25.7, -51.8], [-24.19, -47.69], [-26.07, -42.69], [-28.24, -43.53], [-30.72, -36.49],
  [-60.31, -46.07], [-61.79, -40.35], [-65.52, -28.59], [-65.85, -25.81], [-77.47, -27.63], [-81.66, -23.59], [-84.05, -18.97],
  [-85.41, -14.91], [-86.1, -11.15], [-85.83, -4.43], [-84.51, -0.22], [-82.53, 3.07], [-71.45, 4.94],
] as XY[]).map(pullIn))
mass(OUTLINE, 0, 7.8)
// glazing round the low wings (photo from the west): a band on every podium wall outside the drums
for (let i = 0; i < OUTLINE.length; i++) {
  const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length]
  if (!pulled.has(a.join()) && !pulled.has(b.join())) panel(win, a, b, 0.5, 6.4)
}

// ─── main block at 12 m ───
const MAIN: XY[] = [
  [-40, -30], [13.53, -27.83], [47.06, -15.09], [55.17, -13.56], [62.94, -12.9], [89.49, -12.91], [88.38, 2.3], [89.69, 2.49],
  [90.69, 5.28], [91.82, 10.8], [91.71, 17.2], [90.71, 21.29], [88.41, 26.42], [85.12, 31.13], [83.74, 30.81], [79.18, 46.05],
  [54.07, 36.66], [48.62, 35.06], [41.35, 34.03], [-9.43, 34.13], [-28.11, 34.27], [-40, 34.26],
]
mass(MAIN, 0, 12.0, stucco, 0.4)
// the glazed lobby along Water Street, behind the porte-cochère
panel(lobby, [-9.43, 34.13], [-28.11, 34.27], 0.4, 6.4, 0.4)
panel(win, [41.35, 34.03], [-9.43, 34.13], 6.8, 11.0, 1.0)
panel(win, [-9.43, 34.13], [-28.11, 34.27], 6.8, 11.0, 0.4)
panel(win, [-28.11, 34.27], [-40, 34.26], 6.8, 11.0, 0.6)
panel(win, [41.35, 34.03], [-9.43, 34.13], 0.5, 5.6, 1.0)

// ─── colonnaded drums ───
function drum(c: XY, R: number, a0: number, a1: number, h: number, pierEvery = 7.5) {
  const n = Math.max(6, Math.round(((a1 - a0) / 360) * 48))
  const P = (r: number, t: number): XY => [c[0] + r * Math.cos((t * Math.PI) / 180), c[1] + r * Math.sin((t * Math.PI) / 180)]
  const ts = Array.from({ length: n + 1 }, (_, i) => a0 + ((a1 - a0) * i) / n)
  const DEPTH = DRUM_DEPTH, CORN = DRUM_CORN, hs = h - CORN
  for (let i = 0; i < n; i++) {
    const t0 = ts[i], t1 = ts[i + 1]
    const o0 = P(R, t0), o1 = P(R, t1), g0 = P(R - DEPTH, t0), g1 = P(R - DEPTH, t1)
    // cornice face, bevelled lip, roof
    trim.quad([o0[0], o0[1], hs], [o1[0], o1[1], hs], [o1[0], o1[1], h - 0.4], [o0[0], o0[1], h - 0.4])
    const i0 = P(R - 0.4, t0), i1 = P(R - 0.4, t1)
    trim.quad([o0[0], o0[1], h - 0.4], [o1[0], o1[1], h - 0.4], [i1[0], i1[1], h], [i0[0], i0[1], h])
    roof.tri([c[0], c[1], h], [i0[0], i0[1], h], [i1[0], i1[1], h])
    // soffit, facing down
    trim.quad([o0[0], o0[1], hs], [g0[0], g0[1], hs], [g1[0], g1[1], hs], [o1[0], o1[1], hs])
    // glazing set back behind the piers
    win.quad([g0[0], g0[1], 0.3], [g1[0], g1[1], 0.3], [g1[0], g1[1], hs], [g0[0], g0[1], hs])
  }
  // radial end walls, from the centre out to the arc
  const e0 = P(R, a0), e1 = P(R, a1)
  stucco.quad([c[0], c[1], 0], [e0[0], e0[1], 0], [e0[0], e0[1], h], [c[0], c[1], h])
  stucco.quad([e1[0], e1[1], 0], [c[0], c[1], 0], [c[0], c[1], h], [e1[0], e1[1], h])
  // square piers on the arc
  const arcLen = ((a1 - a0) * Math.PI * R) / 180, np = Math.max(2, Math.round(arcLen / pierEvery))
  for (let k = 0; k <= np; k++) {
    const t = a0 + ((a1 - a0) * k) / np, [px, py] = P(R - 1.2, t)
    const ux = -Math.sin((t * Math.PI) / 180), uy = Math.cos((t * Math.PI) / 180), rx = -uy, ry = ux
    const w = 1.0 // bold 2 m square piers
    const q = (s: number, r: number, z: number): V3 => [px + ux * s - rx * r, py + uy * s - ry * r, z]
    const ring = (z: number): V3[] => [q(-w, -w, z), q(-w, w, z), q(w, w, z), q(w, -w, z)]
    const rr = ring(0)
    const cw = (rr[1][0] - rr[0][0]) * (rr[2][1] - rr[0][1]) - (rr[1][1] - rr[0][1]) * (rr[2][0] - rr[0][0]) < 0
    trim.loft(cw ? [ring(0).reverse(), ring(hs).reverse()] : [ring(0), ring(hs)])
  }
}
for (const d of DRUMS) drum(d.c, d.R, d.a0, d.a1, d.h)

// ─── the halls ───
mass([[-83, -16], [-80, -22], [-30, -22], [-30, 5], [-70, 5], [-78, 2], [-83, -6]], 0, 20.9, stucco, 0.6) // west theatre
mass([[-11, 27], [-11, -13], [-3, -16], [-3, -26], [4, -26], [18, -21], [31, -9], [31, 27]], 0, 22.4, stucco, 1.2) // symphony hall
mass([[32, -8], [51, -8], [51, 25], [32, 25]], 0, 35.7, stucco, 0.6) // stage house

// ─── the porte-cochère on Water Street ───
{
  const x0 = -28.0, x1 = -9.5, y0 = 34.3, y1 = 51.1, z0 = 6.6, z1 = 7.6
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  trim.loft([r(z0), r(z1)]); roof.cap(r(z1), true); trim.cap(r(z0), false)
  for (const x of [x0 + 1.2, x1 - 1.2]) for (const y of [y1 - 1.5, (y0 + y1) / 2]) {
    const c = (z: number): V3[] => [[x - 0.4, y - 0.4, z], [x + 0.4, y - 0.4, z], [x + 0.4, y + 0.4, z], [x - 0.4, y + 0.4, z]]
    trim.loft([c(0), c(z0)])
  }
}

const parts = [
  { part: stucco, material: finish('jcpa-stucco', 0xe5d8c3) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: { ...PALETTE.window, color: 0x66889a } },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x6f8794 } },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Jacksonville Center for the Performing Arts', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 35.7,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/170066688'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jax-times-union-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
