/**
 * Minnesota State Capitol (1905, Cass Gilbert), Saint Paul: procedural, CC0-1.0.
 * bun generators/msp-minnesota-state-capitol.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's walls run
 * exactly north-south and east-west). The origin is the area centroid of OSM
 * way/927276507 (-93.102225, 44.955238). The building is symmetric about
 * x = 0 (OSM's ends are at -65.7 and +65.9, the domes' axes within 0.2 m of
 * x = 0 and x = ±48.3); the main dome's axis is at (0, -5.3). y = 0 is the
 * ground at the foot of the south front (lidar 266.5 m), the lowest ground
 * under the footprint: the site rises about 2.5 m to the north side and the
 * mall falls away south of the grand stair.
 *
 * Form: a long white-marble block (two wings round a central pavilion and a
 * short north wing) on a rusticated ground storey with round-headed windows,
 * two storeys of windows above, a cornice and a balustrade; the wings' end
 * pavilions carry engaged columns on the long fronts and four-column loggias
 * with grand stairs on the east and west ends; the south pavilion has three
 * arched doors over the grand stair, a loggia of three tall arches behind six
 * columns, an attic, and the gilded Quadriga at the foot of the drum; a low
 * dark saucer dome over each wing (House and Senate) and a third over the
 * north wing, which ends in a pediment over its attic; low hipped skylights. Over the centre a cross-shaped podium, the
 * drum (four diagonal buttresses with urns, paired columns between them, a
 * pedimented window in each of its twelve bays), the attic, the ribbed
 * marble dome (twelve ribs over the column pairs, round lucarnes between them)
 * and the lantern with its gilded ball and finial.
 *
 * Sources
 * - OSM (ODbL): way/927276507 (outline, "Minnesota State Capitol"),
 *   relation/5445480 (type=building, height 223 ft, Q1789816),
 *   relation/5480142 (building:part, 27.5 m; edited 2026-11-18 and left with
 *   inner rings only), relation/5480141 (dome part, 32-55 m) with outer
 *   way/366135017 and the lantern way/368806825 (55-65 m), relation/5480143
 *   and way/368806828 (west and east wing domes, "27.5-32 m" with lantern
 *   parts way/368806829 and way/368806816 "32-35 m"), relation/5481654 (the
 *   podium ring round the drum), way/368952312 (the Quadriga, 27.5-30.5 m,
 *   tourism=artwork, not a building). The plan here is OSM's, made symmetric
 *   (differences under 0.5 m) and with the notch in front of the south loggia
 *   filled (lidar shows the pavilion's roof across it).
 * - USGS 3DEP lidar MN_CentralMissRiver_5_B22 (flown 2022), 1 m grid,
 *   ground_min 262.71 m; heights below are above the south grade (266.5 m):
 *   dome finial 68.2 (published 223 ft = 68.0, used), lantern cornice 64,
 *   lantern base ring 58, dome surface 45 at r 12, 49.7 at r 10, 53.2 at
 *   r 8, 55.1 at r 6, 55.9 at r 5 (measured); drum entablature 41.8 out to
 *   r 15.5 (the paired columns); central podium 28.8-29; pavilion attic 25.4,
 *   its corner blocks 27.3, Quadriga top 31; wing balustrade 22.9-23.2, roof
 *   deck 21.8, wing skylight ridges 26.2; wing saucer domes r 10, crown 29.5
 *   (flagpoles to about 41, left out); north wing dome crown 29.7, its north
 *   pediment apex 31.7, north attic 25.2; south terrace 4.4-4.6 with cheek
 *   walls 5.2, grand stair down to grade 17 m south of it; east and west end
 *   terraces 4.8; statues on pedestals beside the stair 8.5.
 * - USGS NAIP (public domain): red-brown flat roofs, grey saucer domes, the
 *   the north wing's dome, the wing skylights.
 * - Cass Gilbert, "Details of dome, Minnesota State Capitol", sheet 153
 *   (public domain, Commons "Minnesota State Capitol dome drawings.png"):
 *   drum with paired columns and pedimented windows, the diagonal
 *   buttresses, the ribbed dome with its lucarnes, the lantern.
 * - Photos (Wikimedia Commons):
 *   McGhiever, "Minnesota State Capitol 2017.jpg", CC BY-SA 4.0 (south front,
 *   frontal; the elevation: storey heights, bays, the loggia, the Quadriga);
 *   xiquinhosilva, "Minnesota State Capitol - 54147668520.jpg", CC BY 2.0
 *   (from the south-south-east); xiquinhosilva, "Minnesota State Capitol -
 *   54147669410.jpg", CC BY 2.0 (west end portico and stair); Myotus,
 *   "Minnesota State Capitol looking at west entrance.jpg", CC BY 4.0;
 *   AlexiusHoratius, "Minnesota State Capitol from northeast 5.jpg",
 *   CC BY-SA 3.0; Myotus, "MN State Capitol, backside looking
 *   Southwest.jpg", CC BY 4.0 (north and east sides, north pediment);
 *   Thesavagenorwegian, "Minnesota State Capitol from northwest in winter
 *   (1).jpg", CC BY 4.0; Lectrician2, "Minnesota State Capitol Aerial.jpg",
 *   CC BY-SA 4.0; McGhiever, "Minnesota State Capitol night.jpg",
 *   CC BY-SA 4.0 (night).
 * - Published: Cass Gilbert, completed 1905; white Georgia marble; dome after
 *   St Peter's; "Progress of the State" quadriga by Daniel Chester French and
 *   Edward Potter, gilded (Wikipedia, "Minnesota State Capitol").
 * Estimated from the photos (scaled to lidar and OSM): the storey lines
 *   (ground storey to 9.7, frieze 20.4, cornice 21.3), window sizes and bay
 *   spacing (4.76 m on the wings, 5.2 m on the end pavilions, 6.2 m in the
 *   loggia), column positions and sizes, the drum's column pairs at r 14.5,
 *   the buttress size, the dome's lucarne positions, the Quadriga's horses
 *   (drawn as four bold blocks), the end stairs' length (they run past the
 *   lidar crop; the map's terrain gives the ground at their foot).
 * Left out: flagpoles, lamp standards, the six Virtues on the attic, capitals,
 *   balustrade spindles, window hoods, the small skylight dome north of the
 *   drum, the basement areaway.
 * Doubts: the north wing's dome centre (y 24.5) and the pediment's depth are
 *   read from 1 m lidar and NAIP only (no licensed photo shows that roof);
 *   the dome profile is the lidar's (a little fuller than a
 *   hemisphere in the photos' silhouette; the lidar's 1 m cells smear the
 *   ribs and lucarnes); the end stairs' foot; the north front's columns are
 *   seen only obliquely.
 * Night: the dome, drum and lantern are floodlit brightest, the fronts below
 *   less, the south front a little more than the others (`floodlight`); the
 *   windows are `window`.
 */
import { Part, type V3, cross, sub } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, archShape, lathe, arc, outward, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'

const BELT = 9.7, FRIEZE = 20.4, CORN = 21.3, PAR = 23.0, ATTIC = 25.4
const DY = -5.3 // the dome's axis
const WDX = 48.35 // the wing domes' axes, x = ±WDX, y = DY

// The outline, east half, counter-clockwise from the south front's centre.
const EAST: XY[] = [
  [16.4, -28.0], [16.4, -22.5], [40.2, -22.5], [40.2, -25.05], [56.5, -25.05], [56.5, -23.1], [62.55, -23.1], [62.55, -17.1],
  [65.8, -17.1], [65.8, 6.5], [62.85, 6.5], [62.85, 13.0], [57.0, 13.0], [57.0, 15.1], [39.7, 15.1], [39.7, 12.95],
  [21.75, 12.95], [21.75, 14.8], [16.1, 14.8], [16.1, 33.0], [16.9, 33.0], [16.9, 40.55], [12.0, 40.55], [12.0, 41.3],
]
const OUT: XY[] = [...EAST, ...EAST.slice().reverse().map(([x, y]) => [-x, y] as XY)]

/** A planar polygon, wound to face along `hint`. */
function poly(part: Part, pts: V3[], hint: V3) {
  const p = pts.filter((q, i) => { const r = pts[(i + 1) % pts.length]; return Math.hypot(q[0] - r[0], q[1] - r[1], q[2] - r[2]) > 1e-6 })
  if (p.length < 3) return
  const n: V3 = [0, 0, 0]
  for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]) }
  const q = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? p.slice().reverse() : p
  for (let i = 1; i < q.length - 1; i++) q && part.tri(q[0], q[i], q[i + 1])
}
/** A solid under a (convex) top polygon, walls down to z = 0. */
function solid(part: Part, top: V3[]) {
  const cx = top.reduce((s, p) => s + p[0], 0) / top.length, cy = top.reduce((s, p) => s + p[1], 0) / top.length
  poly(part, top, [0, 0, 1])
  top.forEach((a, i) => {
    const b = top[(i + 1) % top.length]
    if (a[2] < 0.01 && b[2] < 0.01) return
    poly(part, [[a[0], a[1], 0], [b[0], b[1], 0], b, a], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0])
  })
}
const box = (part: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, top: Part | null = part) =>
  prism(part, top, rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1)), z0, z1)
function offset(r: XY[], d: number): XY[] {
  return r.map((q, i) => {
    const a = outward(r[(i - 1 + r.length) % r.length], q), b = outward(q, r[(i + 1) % r.length])
    const k = 1 + a[0] * b[0] + a[1] * b[1]
    return [q[0] + (d * (a[0] + b[0])) / k, q[1] + (d * (a[1] + b[1])) / k]
  })
}
const column = (part: Part, x: number, y: number, r: number, z0: number, z1: number, segs = 8) => lathe(part, x, y, [[r, z0], [r * 0.9, z1]], segs)

// Faces: s along the wall, seen from outside. South: s = x; north: s = -x; east: s = y; west: s = -y.
const south = (y: number): Face => ({ o: [0, y, 0], n: [0, -1] })
const north = (y: number): Face => ({ o: [0, y, 0], n: [0, 1] })
const east = (x: number): Face => ({ o: [x, 0, 0], n: [1, 0] })
const west = (x: number): Face => ({ o: [x, 0, 0], n: [-1, 0] })

function build() {
  const marble = new Part(), trim = new Part(), win = new Part(), flat = new Part(), lead = new Part(), gold = new Part()
  const W = (f: Face, s: number, w: number, z0: number, z1: number) => flatShape(win, f, rect(s - w / 2, z0, s + w / 2, z1), 0.06)
  const A = (f: Face, s: number, w: number, z0: number, zs: number) => flatShape(win, f, archShape(s, w, z0, zs, 4), 0.06)
  const O = (f: Face, s: number, z: number, r: number) => flatShape(win, f, arc(s, z, r, 0, 360, 12).slice(0, -1), 0.06)
  /** A standard wing bay: round-headed ground-storey window, two windows above. */
  const bay = (f: Face, s: number) => { A(f, s, 1.9, 3.4, 6.3); W(f, s, 1.7, 10.6, 13.8); W(f, s, 1.7, 15.6, 18.2) }
  /** An engaged column in front of face f at s. */
  const engaged = (f: Face, s: number, r = 0.5) => {
    const t: XY = [-f.n[1], f.n[0]]
    column(trim, f.o[0] + t[0] * s + f.n[0] * 0.3, f.o[1] + t[1] * s + f.n[1] * 0.3, r, BELT, FRIEZE, 6)
  }
  const mir = (fn: (sx: number) => void) => { fn(1); fn(-1) }

  // ------------------------------------------------------------ the body
  prism(marble, null, OUT, 0, FRIEZE)
  const corn = chamfer(offset(OUT, 0.45), 0.3)
  prism(trim, null, corn, FRIEZE, CORN)
  // the balustrade, drawn solid, 0.6 m thick; the roof deck 1.2 m below its top
  const inner = offset(OUT, -0.6), DECK = PAR - 1.2
  prism(trim, null, OUT, CORN, PAR)
  prism(trim, null, inner.slice().reverse(), DECK, PAR)
  OUT.forEach((a, i) => { const j = (i + 1) % OUT.length, b = OUT[j], c = inner[j], d = inner[i]; poly(trim, [[a[0], a[1], PAR], [b[0], b[1], PAR], [c[0], c[1], PAR], [d[0], d[1], PAR]], [0, 0, 1]) })
  capRing(flat, inner, DECK)

  // the central block's attic, the pavilion's raised corner blocks
  const cen = rect(-16.4, -28, 16.4, 14.8)
  prism(marble, null, cen, PAR - 0.02, ATTIC - 0.6)
  prism(trim, flat, chamfer(offset(cen, 0.3), 0.25), ATTIC - 0.6, ATTIC)
  mir((sx) => {
    box(marble, sx * 10.0, -28.0, ATTIC - 0.02, sx * 16.4, -22.0, 26.7, null)
    prism(trim, trim, chamfer(rect(Math.min(sx * 9.8, sx * 16.6), -28.2, Math.max(sx * 9.8, sx * 16.6), -21.8), 0.2), 26.7, 27.3)
  })

  // the wings' skylights: low hipped lead roofs between the centre and the wing domes
  mir((sx) => {
    const x0 = sx * 17.5, x1 = sx * 37.5, y0 = -10.0, y1 = -0.6, yc = (y0 + y1) / 2, z0 = PAR, z1 = 26.2, i = 3.5 * sx
    poly(lead, [[x0, y0, z0], [x1, y0, z0], [x1 - i, yc, z1], [x0 + i, yc, z1]], [0, -1, 1])
    poly(lead, [[x0, y1, z0], [x1, y1, z0], [x1 - i, yc, z1], [x0 + i, yc, z1]], [0, 1, 1])
    poly(lead, [[x1, y0, z0], [x1, y1, z0], [x1 - i, yc, z1]], [sx, 0, 1])
    poly(lead, [[x0, y0, z0], [x0, y1, z0], [x0 + i, yc, z1]], [-sx, 0, 1])
  })

  // the wing domes: a marble ring, a low ribbed lead saucer, a railed lantern ring
  mir((sx) => {
    lathe(trim, sx * WDX, DY, [[9.9, PAR - 1.2], [9.9, 24.0], [9.5, 24.0]], 16)
    lathe(lead, sx * WDX, DY, [[9.5, 24.0], [8.6, 25.9], [6.2, 27.8], [2.8, 28.9], [2.6, 29.6], [0.01, 29.8]], 16)
  })

  // the north wing: a pitched skylight roof, and the north pediment over its attic
  {
    const e = 13.5
    lathe(trim, 0, 24.5, [[9.6, PAR - 1.2], [9.6, 24.0], [9.2, 24.0]], 16)
    lathe(lead, 0, 24.5, [[9.2, 24.0], [8.3, 25.9], [6.0, 27.7], [2.8, 28.9], [2.6, 29.5], [0.01, 29.7]], 16)
    const att = rect(-16.9, 33.0, 16.9, 40.55)
    prism(marble, null, att, PAR - 0.02, 24.6)
    prism(trim, flat, chamfer(offset(att, 0.3), 0.25), 24.6, 25.2)
    const p0 = 32.2, p1 = 34.8, zb = 26.6, apex = 31.7
    box(trim, -e, p0, PAR, e, p1, zb)
    poly(marble, [[-e, p1, zb], [e, p1, zb], [0, p1, apex]], [0, 1, 0])
    poly(marble, [[-e, p0, zb], [e, p0, zb], [0, p0, apex]], [0, -1, 0])
    for (const sx of [-1, 1]) poly(trim, [[sx * (e + 0.3), p0, zb - 0.2], [sx * (e + 0.3), p1 + 0.3, zb - 0.2], [0, p1 + 0.3, apex + 0.3], [0, p0, apex + 0.3]], [sx, 0, 1])
  }

  // ------------------------------------------------------------ facades
  mir((sx) => {
    // the long fronts: wing middles (5 bays), end pavilions (3 bays framed by columns), the stepped corners
    const mids = [0, 1, 2, 3, 4].map((k) => 18.78 + 4.76 * k)
    for (const x of mids) bay(south(-22.5), sx * x)
    bay(north(14.8), -sx * mids[0])
    for (const x of mids.slice(1)) bay(north(12.95), -sx * x)
    for (const [f, sgn, yStep, xStep] of [[south(-25.05), 1, -23.1, 59.55], [north(15.1), -1, 13.0, 59.9]] as [Face, number, number, number][]) {
      for (const d of [-5.2, 0, 5.2]) bay(f, sgn * sx * (WDX + d))
      for (const d of [-7.4, -3.1, -2.1, 2.1, 3.1, 7.4]) engaged(f, sgn * sx * (WDX + d))
      bay(sgn > 0 ? south(yStep) : north(yStep), sgn * sx * xStep)
    }
    // the east and west ends: four free columns in a loggia between engaged pairs, stepped side bays
    const ef = sx > 0 ? east(65.8) : west(-65.8), es = (y: number) => sx * y
    for (const d of [-6.2, -3.1, 0, 3.1, 6.2]) {
      const y = DY + d
      if (Math.abs(d) < 4) { flatShape(lead, ef, rect(es(y) - 1.0, 4.8, es(y) + 1.0, 7.4), 0.07); flatShape(win, ef, archShape(es(y), 2.0, 7.4, 7.4, 6), 0.06) }
      else A(ef, es(y), 2.0, 4.8, 7.4)
      W(ef, es(y), 2.0, 10.4, 18.6) // the loggia's shadowed bays, behind the free columns
    }
    for (const d of [-9.9, 9.9]) A(ef, es(DY + d), 1.8, 4.6, 7.4)
    for (const d of [-1.55, 1.55, -4.65, 4.65]) column(trim, sx * 66.9, DY + d, 0.6, BELT, FRIEZE, 8)
    for (const d of [-11.0, -7.75, 7.75, 11.0]) engaged(ef, es(DY + d), 0.55)
    for (const [x, y] of [[62.55, -20.1], [62.85, 9.75]]) {
      const f = sx > 0 ? east(sx * x) : west(sx * x)
      A(f, sx * y, 1.9, 3.4, 6.3); W(f, sx * y, 1.7, 11.0, 14.6); O(f, sx * y, 18.3, 0.7)
    }
    // the north wing's sides
    const nf = sx > 0 ? east(16.1) : west(-16.1)
    for (const y of [17.1, 21.65, 26.2, 30.75]) bay(nf, sx * y)
    bay(sx > 0 ? east(16.9) : west(-16.9), sx * 36.8)
  })

  // the south pavilion: three doors over the stair, the loggia's three arches behind six columns, side bays
  {
    const f = south(-28.0)
    for (const x of [-6.2, 0, 6.2]) {
      flatShape(lead, f, rect(x - 1.5, 4.4, x + 1.5, 7.0), 0.07)
      flatShape(win, f, archShape(x, 3.0, 7.0, 7.0, 8), 0.06)
      flatShape(win, f, archShape(x, 3.9, 10.8, 16.0, 8), 0.06)
      extrudeShape(trim, f, rect(x - 2.2, 9.7, x + 2.2, 10.5), 0, 0.5) // the balustrade under each arch
    }
    for (const x of [-13.2, 13.2]) { A(f, x, 1.8, 4.7, 7.6); W(f, x, 1.7, 11.1, 14.7); O(f, x, 18.0, 0.75) }
    for (const x of [-9.2, -4.0, -2.9, 2.9, 4.0, 9.2]) {
      column(trim, x, -28.75, 0.6, BELT, FRIEZE - 0.6, 10)
      box(trim, x - 0.75, -29.5, FRIEZE - 0.6, x + 0.75, -28.0, FRIEZE)
    }
    // the north front: six columns before five bays, the north doors
    const nf = north(41.3)
    for (const x of [-7.6, -3.8, 0, 3.8, 7.6]) {
      if (x === 0) { flatShape(lead, nf, rect(-1.2, 4.5, 1.2, 7.2), 0.07); flatShape(win, nf, archShape(0, 2.4, 7.2, 7.2, 6), 0.06) }
      else A(nf, -x, 1.9, 4.5, 7.2)
      W(nf, -x, 1.7, 10.6, 13.8); W(nf, -x, 1.7, 15.6, 18.2)
    }
    for (const x of [-9.5, -5.7, -1.9, 1.9, 5.7, 9.5]) column(trim, x, 42.1, 0.55, BELT, FRIEZE, 6)
  }

  // ------------------------------------------------------------ stairs and terraces
  {
    // the south terrace and grand stair, between cheek walls; statues on pedestals at its foot
    box(marble, -12.5, -34.5, 0, 12.5, -28.0, 4.4)
    solid(marble, [[-10.5, -50, 0.5], [10.5, -50, 0.5], [10.5, -34.5, 4.4], [-10.5, -34.5, 4.4]])
    for (const sx of [-1, 1]) {
      const a = sx * 10.5, b = sx * 12.5
      solid(marble, [[Math.min(a, b), -50, 1.0], [Math.max(a, b), -50, 1.0], [Math.max(a, b), -34.5, 5.2], [Math.min(a, b), -34.5, 5.2]])
      box(marble, Math.min(a, b), -34.5, 0, Math.max(a, b), -28.0, 5.2)
      box(marble, sx * 13.9, -41.1, 0, sx * 16.1, -38.9, 5.0)
      lathe(lead, sx * 15, -40, [[0.7, 5.0], [0.6, 7.4], [0.35, 8.0], [0.01, 8.5]], 8)
    }
    // the east and west end terraces and stairs
    for (const sx of [-1, 1]) {
      const x0 = sx * 65.8, x1 = sx * 70.5, x2 = sx * 80.5, lo = (a: number, b: number) => Math.min(a, b), hi = (a: number, b: number) => Math.max(a, b)
      box(marble, x0, DY - 9.5, 0, x1, DY + 9.5, 4.8)
      solid(marble, [[x1, DY - 8, 4.8], [x2, DY - 8, 0.8], [x2, DY + 8, 0.8], [x1, DY + 8, 4.8]])
      for (const sy of [-1, 1]) {
        const ya = DY + sy * 8, yb = DY + sy * 9.5
        solid(marble, [[x1, lo(ya, yb), 5.6], [x2, lo(ya, yb), 1.6], [x2, hi(ya, yb), 1.6], [x1, hi(ya, yb), 5.6]])
      }
      void lo; void hi; void x2
    }
    // the north terrace and steps
    box(marble, -8.5, 41.3, 0, 8.5, 44.5, 4.5)
    solid(marble, [[-6, 44.5, 4.5], [6, 44.5, 4.5], [6, 49, 2.6], [-6, 49, 2.6]])
  }

  // ------------------------------------------------------------ the Quadriga, gilded, on its plinth at the foot of the drum
  {
    box(marble, -3.6, -25.8, ATTIC - 0.02, 3.6, -21.6, 27.4)
    for (const x of [-2.1, -0.7, 0.7, 2.1]) {
      box(gold, x - 0.4, -25.4, 27.4, x + 0.4, -23.3, 29.5)
      solid(gold, [[x - 0.3, -26.2, 30.7], [x + 0.3, -26.2, 30.7], [x + 0.3, -25.0, 30.1], [x - 0.3, -25.0, 30.1]].map(([a, b, c]) => [a, b, c] as V3))
    }
    box(gold, -1.4, -23.3, 27.4, 1.4, -22.0, 28.8)
    lathe(gold, 0, -22.6, [[0.5, 28.8], [0.35, 30.6], [0.2, 31.0], [0.01, 31.1]], 8)
    for (const sx of [-1, 1]) lathe(gold, sx * 3.0, -25.2, [[0.4, 27.4], [0.3, 29.4], [0.01, 29.7]], 8)
  }

  // ------------------------------------------------------------ podium, drum, dome, lantern
  const oct = chamfer(rect(-16, DY - 16, 16, DY + 16), 6)
  prism(marble, null, oct, ATTIC - 0.02, 28.2)
  prism(trim, trim, chamfer(offset(oct, 0.3), 0.3), 28.2, 28.8)
  const D0 = 28.8, DR = 12.8, COLTOP = 40.2, ENT = 41.8
  lathe(marble, 0, DY, [[DR, D0], [DR, COLTOP]], 28)
  lathe(trim, 0, DY, [[DR, COLTOP], [15.4, COLTOP], [15.4, ENT], [13.2, ENT]], 28)
  lathe(marble, 0, DY, [[13.2, ENT], [13.2, 45.0]], 28)
  lathe(trim, 0, DY, [[13.2, 45.0], [13.6, 45.6], [12.7, 45.6]], 28)
  const P = (a: number, r: number, z: number, t = 0): V3 => [Math.cos(a) * r - Math.sin(a) * t, DY + Math.sin(a) * r + Math.cos(a) * t, z]
  for (let k = 0; k < 12; k++) {
    const a = ((15 + 30 * k) * Math.PI) / 180
    if (k % 3 === 1) {
      // a diagonal buttress with two columns on its face, a stepped cap and an urn
      const ring = (r0: number, r1: number, h: number): XY[] => [P(a, r0, 0, -h), P(a, r1, 0, -h), P(a, r1, 0, h), P(a, r0, 0, h)].map((p) => [p[0], p[1]] as XY)
      prism(marble, null, ring(12.4, 15.9, 2.4), D0, ENT)
      prism(trim, null, ring(12.4, 16.2, 2.6), ENT, ENT + 0.6)
      prism(marble, trim, ring(12.9, 15.5, 2.0), ENT + 0.6, 43.6)
      for (const t of [-1.3, 1.3]) { const p = P(a, 16.4, 0, t); column(trim, p[0], p[1], 0.5, D0, COLTOP, 6) }
      const u = P(a, 14.2, 0)
      lathe(trim, u[0], u[1], [[1.1, 43.6], [1.1, 44.4], [0.6, 45.4], [0.01, 46.3]], 8)
    } else {
      for (const t of [-0.75, 0.75]) { const p = P(a, 14.5, 0, t); column(trim, p[0], p[1], 0.55, D0, COLTOP, 6) }
    }
    // the window in the bay before this pair, with its pediment
    const aw = ((30 * k) * Math.PI) / 180, f: Face = { o: [Math.cos(aw) * DR, DY + Math.sin(aw) * DR, 0], n: [Math.cos(aw), Math.sin(aw)] }
    W(f, 0, 1.8, 31.2, 37.4)
    extrudeShape(trim, f, [[-1.3, 37.8], [1.3, 37.8], [0, 38.9]], 0, 0.3)
  }
  // the dome: a near-hemisphere on the attic (lidar profile), twelve ribs, round lucarnes
  const RA = 12.7, RB = 11.2, Z0 = 45.6, RING = 4.0
  const zAt = (r: number) => Z0 + RB * Math.sqrt(Math.max(0, 1 - (r / RA) ** 2))
  const prof: [number, number][] = []
  for (let k = 0; k <= 10; k++) { const r = RA - ((RA - RING) * k) / 10; prof.push([r, zAt(r)]) }
  // finer near the base, where the ellipse turns fastest
  prof.splice(1, 0, [12.6, zAt(12.6)], [12.4, zAt(12.4)])
  lathe(marble, 0, DY, prof, 28)
  const nrm = (r: number, z: number): [number, number] => { const a = r / (RA * RA), b = (z - Z0) / (RB * RB), l = Math.hypot(a, b); return [a / l, b / l] }
  const RW = 0.45, RD = 0.4
  for (let k = 0; k < 12; k++) {
    const a = ((15 + 30 * k) * Math.PI) / 180
    const Q = (r: number, z: number, t: number, d: number): V3 => { const [nr, nz] = nrm(r, z); return P(a, r + nr * d, z + nz * d, t) }
    const pts = [prof[0], prof[2], ...prof.slice(5).filter((_, i) => i % 3 === 0), prof[prof.length - 1]].filter((p, i, a) => a.indexOf(p) === i)
    for (let i = 0; i + 1 < pts.length; i++) {
      const [r0, z0] = pts[i], [r1, z1] = pts[i + 1], [nr, nz] = nrm((r0 + r1) / 2, (z0 + z1) / 2)
      const out: V3 = [Math.cos(a) * nr, Math.sin(a) * nr, nz], side: V3 = [-Math.sin(a), Math.cos(a), 0]
      poly(marble, [Q(r0, z0, -RW, RD), Q(r0, z0, RW, RD), Q(r1, z1, RW, RD), Q(r1, z1, -RW, RD)], out)
      poly(marble, [Q(r0, z0, RW, -0.05), Q(r1, z1, RW, -0.05), Q(r1, z1, RW, RD), Q(r0, z0, RW, RD)], side)
      poly(marble, [Q(r0, z0, -RW, -0.05), Q(r1, z1, -RW, -0.05), Q(r1, z1, -RW, RD), Q(r0, z0, -RW, RD)], [-side[0], -side[1], 0])
    }
  }
  const lucarne = (a: number, r: number, rad: number) => {
    const z = zAt(r), [nr, nz] = nrm(r, z), n: V3 = [Math.cos(a) * nr, Math.sin(a) * nr, nz], u: V3 = [-Math.sin(a), Math.cos(a), 0]
    const v = cross(n, u), c = P(a, r + nr * 0.08, z + nz * 0.08)
    const ring: V3[] = []
    for (let i = 0; i < 10; i++) { const t = (i / 10) * 2 * Math.PI; ring.push([c[0] + (u[0] * Math.cos(t) + v[0] * Math.sin(t)) * rad, c[1] + (u[1] * Math.cos(t) + v[1] * Math.sin(t)) * rad, c[2] + (u[2] * Math.cos(t) + v[2] * Math.sin(t)) * rad]) }
    poly(win, ring, n)
  }
  for (let k = 0; k < 12; k++) { const a = ((30 * k) * Math.PI) / 180; lucarne(a, 11.4, 0.95); lucarne(a, 8.3, 0.6) }
  void sub
  // the lantern
  const zr = zAt(RING)
  lathe(trim, 0, DY, [[4.4, zr - 0.4], [4.4, 57.2], [4.6, 57.2], [4.6, 57.7], [2.6, 57.7]], 12)
  lathe(marble, 0, DY, [[2.6, 57.7], [2.6, 62.4]], 12)
  for (let k = 0; k < 8; k++) {
    const a = ((k + 0.5) / 8) * 2 * Math.PI, p = P(a, 3.05, 0)
    column(trim, p[0], p[1], 0.32, 57.7, 62.4, 6)
    const aw = (k / 8) * 2 * Math.PI
    W({ o: [Math.cos(aw) * 2.6, DY + Math.sin(aw) * 2.6, 0], n: [Math.cos(aw), Math.sin(aw)] }, 0, 0.9, 58.6, 61.6)
  }
  lathe(trim, 0, DY, [[2.6, 62.4], [3.5, 62.4], [3.5, 63.0], [2.9, 63.0], [2.6, 63.5], [1.6, 64.2], [0.8, 64.5]], 12)
  lathe(gold, 0, DY, [[0.8, 64.5], [0.5, 64.8], [0.85, 65.2], [0.9, 65.6], [0.55, 66.0], [0.3, 66.4], [0.12, 67.6], [0.01, 68.0]], 10)

  // ------------------------------------------------------------ materials and night
  // Floodlit: the dome, drum and lantern brightest; the south front next; the
  // other fronts dimmer. Faces looking up catch little.
  const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.25 : p[2] > 28 ? 1 : n[1] < -0.5 ? 0.85 : 0.55)
  const marbleM = { ...finish('msc-marble', 0xece9e2), floodlight: lit }
  const trimM = { ...PALETTE.trim, floodlight: lit }
  const goldM = { ...finish('msc-gold', 0xd8b24c, 0.5), floodlight: () => 1 }
  return finishGlb('Minnesota State Capitol', [
    { part: marble, material: marbleM },
    { part: trim, material: trimM },
    { part: win, material: PALETTE.window },
    { part: flat, material: PALETTE.terracotta },
    { part: lead, material: finish('msc-lead', 0x8e979c) },
    { part: gold, material: goldM },
  ], {
    bearing: 0, height: 68.0,
    replaces: ['relation/5445480', 'relation/5480142', 'way/927276507', 'relation/5480141', 'relation/5480143', 'relation/5481654', 'way/366135017', 'way/368806825', 'way/368806828', 'way/368806816', 'way/368806829'],
  }, 6500)
}

if (import.meta.main) await writeModel('msp-minnesota-state-capitol', build())
