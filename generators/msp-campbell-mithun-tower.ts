/**
 * Two22 (222 South Ninth Street; Piper Jaffray Tower 1985-2000, Campbell
 * Mithun Tower 2000-2019; 1985, Hammel Green & Abrahamson), Minneapolis —
 * original procedural geometry, CC0-1.0.
 * bun generators/msp-campbell-mithun-tower.ts [out.glb]
 *
 * Identity: the brief's "Campbell Mithun Tower (222 South Ninth)" is OSM
 * way/44684851, named "Two22", tagged old_name:2000-2019 "Campbell Mithun
 * Tower", old_name:1985-2000 "Piper Jaffray Tower", wikidata Q932489, at
 * 222 South 9th Street, next to St. Olaf Catholic Church. Its anchor is the
 * outline's centroid (-93.2700840, 44.9737586), 120 m east of the brief's
 * approximate point. Photos show reflective blue glass and a silver-glass
 * ridge, not copper gables.
 *
 * Map frame: x east, y north, z up, metres, turned to the downtown street
 * grid (placement bearing 31°). Origin at the anchor, on the lowest ground
 * under it.
 *
 * Form: a 49 x 50 m tower of reflective blue glass. A slab of silver glass
 * runs diagonally across it from the north face to the east face and rises
 * to 177 m; on either side the roof steps down in diagonal terraces, three
 * a side, so every face ends in a sawtooth against the sky, and where the
 * slab meets the east and north faces it shows as a full-height silver
 * strip framed by white fins that stand a little above the roof. A low
 * lobby wing (12.5 m, and 9 m to the south) fills the outline's west strip.
 *
 * Sources
 * - OSM: outline way/44684851 (height 177, 42 levels, glass).
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_4_B22, flown 2022; the
 *   upper floors are high-noise class 18 in this dataset and were read with
 *   it kept; ground 257.7 m NAVD88): the tower's extent (x -12.8..36.3,
 *   y -25.9..24), the ridge at 177 m between the diagonal lines x+y = 12 and
 *   26 (model metres), terraces at 162, 152 and 142 m to the north-east and
 *   147, 142 and 137 m to the south-west, each about 10-12 m wide; the west
 *   wing 12.5 m and 7-10 m.
 * - Published: 177 m (579 ft), 42 storeys, 1985 (Wikipedia, "Two22").
 * - Photos (Wikimedia Commons, evidence):
 *   AlexiusHoratius, "Campbell Mithun Tower 1.jpg", CC BY-SA 3.0 (from the
 *     south): the blue glass, the sawtooth south face, the silver slab and
 *     its white fins. https://commons.wikimedia.org/wiki/File:Campbell_Mithun_Tower_1.jpg
 *   Farragutful, "St. Olaf Catholic Church - Minneapolis 01.jpg",
 *     CC BY-SA 4.0 (from the north-west, over St. Olaf): the stepped
 *     profile from the other side.
 *     https://commons.wikimedia.org/wiki/File:St._Olaf_Catholic_Church_-_Minneapolis_01.jpg
 *   Chad Davis, "Two22, Minneapolis (52064245436).jpg", CC BY 2.0: the
 *     crown's sawtooth and the silver slab close up.
 *     https://commons.wikimedia.org/wiki/File:Two22,_Minneapolis_(52064245436).jpg
 *
 * Measured: everything in plan and height above. The terrace lines are
 * drawn at 45° in the model's frame (the lidar's run within a few degrees).
 * From Chad Davis's crown photo: each lidar terrace is drawn as two steps,
 * the half nearer the ridge 2.5 m higher (the photo shows twice as many
 * steps as the 1.5 m lidar sampling separates); a middle fin on each end.
 * Estimated: the floor lines (every three storeys), the fins' width (1.2 m)
 * and their 3 m rise over the roof, the wing's facade.
 *
 * Night: the glass is office curtain wall, so it is `window` and glows; no
 * crown lighting is evidenced.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Prism, ccw, capRing, wallEdge, edgeBase, edgePanels, finishGlb } from './sea-rainier-square-tower'

/** Clip a counter-clockwise convex polygon to lo <= x + y <= hi. */
function band(poly: XY[], lo: number, hi: number): XY[] {
  const clip = (p: XY[], keep: (q: XY) => number): XY[] => {
    const out: XY[] = []
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length], fa = keep(a), fb = keep(b)
      if (fa >= 0) out.push(a)
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
    }
    return out
  }
  return ccw(clip(clip(poly, (q) => q[0] + q[1] - lo), (q) => hi - q[0] - q[1]))
}

function build() {
  const blue = new Part(), silver = new Part(), trim = new Part(), roof = new Part(), wing = new Part(), wingWin = new Part(), lines = roof
  const T: XY[] = [[-12.8, -25.9], [36.3, -25.9], [36.3, 24], [-12.8, 24]]
  const RIDGE = 177
  // the diagonal terraces (x + y bands), south-west to north-east
  const bands: [number, number, number, Part][] = [
    [-60, -16, 137, blue], [-16, -3, 142, blue], [-3, 12, 147, blue],
    [12, 26, RIDGE, silver],
    [26, 38, 162, blue], [38, 49, 152, blue], [49, 80, 142, blue],
  ]
  const prisms: Prism[] = []
  for (const [lo, hi, z1, part] of bands) {
    if (part === silver) { prisms.push({ ring: band(T, lo, hi), z1, wall: part, roof, kind: 'ridge' }); continue }
    // each lidar terrace is two steps in the crown photo: the half nearer the ridge 2.5 m higher
    const m = (Math.max(lo, -40) + Math.min(hi, 61)) / 2, nearHi = hi <= 12
    prisms.push({ ring: band(T, lo, m), z1: nearHi ? z1 : z1 + 2.5, wall: part, roof, kind: 'glass' })
    prisms.push({ ring: band(T, m, hi), z1: nearHi ? z1 + 2.5 : z1, wall: part, roof, kind: 'glass' })
  }
  prisms.push({ ring: ccw([[-22.7, -4.2], [-12.8, -4.2], [-12.8, 24.4], [-22.7, 24.4]]), z1: 12.5, wall: wing, roof, kind: 'wing' })
  prisms.push({ ring: ccw([[-19.2, -25.7], [-12.8, -25.8], [-12.8, -4.2], [-19.2, -4.2]]), z1: 9, wall: wing, roof, kind: 'wing' })

  const FLOOR = 3 * 4.05
  for (const Q of prisms) {
    const r = Q.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(prisms, Q, i)
      if (z0 >= Q.z1 - 0.01) continue
      wallEdge(Q.wall, r, i, z0, Q.z1)
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 0.5) continue
      if (Q.kind === 'wing') { edgePanels(wingWin, r, i, z0, Q.z1, { group: 4.2, spandrel: 1.2, pier: 1.2, bayW: 5, head: 1.2, foot: 1.0 }, false); continue }
      // grey floor lines on the curtain wall (the roof's colour, so they stay quiet at phone size), every three storeys, and a coping line at the top
      const n: XY = [(b[1] - a[1]) / L * 0.06, -(b[0] - a[0]) / L * 0.06]
      const line = (z: number, h: number) => lines.quad([a[0] + n[0], a[1] + n[1], z], [b[0] + n[0], b[1] + n[1], z], [b[0] + n[0], b[1] + n[1], z + h], [a[0] + n[0], a[1] + n[1], z + h])
      for (let z = Math.ceil((z0 + 3) / FLOOR) * FLOOR; z < Q.z1 - 3; z += FLOOR) line(z, 0.45)
      line(Q.z1 - 0.9, 0.9)
    }
    capRing(roof, r, Q.z1)
  }

  // ---- white fins where the ridge slab meets the outer faces, standing 3 m proud of the roof
  const fin = (p: XY, along: XY, out: XY) => {
    const w = 0.6, d = 0.9, top = RIDGE + 3
    const c = (s: number, o: number, z: number): V3 => [p[0] + along[0] * s + out[0] * o, p[1] + along[1] * s + out[1] * o, z]
    trim.quad(c(-w, d, 0), c(w, d, 0), c(w, d, top), c(-w, d, top))
    trim.quad(c(w, d, 0), c(w, -0.2, 0), c(w, -0.2, top), c(w, d, top))
    trim.quad(c(-w, -0.2, 0), c(-w, d, 0), c(-w, d, top), c(-w, -0.2, top))
    trim.quad(c(-w, d, top), c(w, d, top), c(w, -0.2, top), c(-w, -0.2, top))
    trim.quad(c(w, -0.2, RIDGE), c(-w, -0.2, RIDGE), c(-w, -0.2, top), c(w, -0.2, top))
  }
  // east face x = 36.3: the ridge spans y = 12 - 36.3 .. 26 - 36.3
  fin([36.3, 12 - 36.3], [0, 1], [1, 0]); fin([36.3, 26 - 36.3], [0, 1], [1, 0])
  // north face y = 24: x = 12 - 24 .. 26 - 24
  fin([12 - 24, 24], [-1, 0], [0, 1]); fin([26 - 24, 24], [-1, 0], [0, 1])
  // and a middle fin on each end of the slab, from the crown down to the terraces
  fin([36.3, 19 - 36.3], [0, 1], [1, 0]); fin([19 - 24, 24], [-1, 0], [0, 1])

  return finishGlb('msp-campbell-mithun-tower', 'Two22 (Campbell Mithun Tower)', [
    { part: blue, material: { ...PALETTE.window, color: 0x6382b2 } },
    { part: silver, material: windowVariant(2, 0xaebccb) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: wing, material: finish('two22-stone', 0xd9d2c6) },
    { part: wingWin, material: windowVariant(3, 0x64798a) },
  ], { bearing: 31, height: RIDGE + 3, replaces: ['way/44684851'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-campbell-mithun-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
