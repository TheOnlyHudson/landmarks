/**
 * Accor Stadium (Stadium Australia; Bligh Lobb Sports Architects with HOK
 * Sport, opened 1999 for the Sydney 2000 Olympics, ends re-roofed in the
 * 2001-2003 reconfiguration), Sydney Olympic Park, Sydney: original
 * procedural geometry, CC0-1.0.
 * bun generators/sydney-accor-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of OSM way/4385777 (the outer way of
 * building relation/1641135 and roof relation/1641134), lng 151.0633843,
 * lat -33.8471191. Bearing 10: the two OSM arch-truss ways (way/119389038,
 * way/119389039, building=stadium) and the long sides of the pitch hole
 * (way/119388917) run at 9.4-10.1 deg, so model +y runs along the arches
 * (north-north-east) and +x across them.
 *
 * Identity, in order:
 *  1. the two white arched roof trusses along the long sides, running the
 *     whole length of the stadium and landing on feet outside both ends
 *     (every photo; plan from OSM; a03 shows them crossing the roof);
 *  2. the pale translucent roof ringing the bowl, high under the arches on
 *     the long sides and lower over the ends, round a rectangular opening
 *     (a03 aerial; p04 inside);
 *  3. the four round spiral ramp towers at the corners, banded with white
 *     ramp parapets and capped by a flat saucer (p01, p03, p05, p08, a03);
 *  4. the silver louvre band across the middle of the east and west
 *     facades, with the concourse glazing above (p01, p02, p03);
 *  5. the bowl's circular plan, r 140 m (OSM outer way, a circle to 1-2 m).
 *
 * Evidence
 *  - Plan (OSM, measured): outer way/4385777 is a circle, radius 139-141 m
 *    about the anchor. Roof opening = roof relation's inner way/119388911
 *    (an octagon, x -64..66, y -106..104), used as is. Pitch hole = building
 *    relation's inner way/119388917 (x -50..46, y -89..81), the foot of the
 *    stands. Arch ways: 14.7 m wide bands centred x -65.0 and +62.4, from
 *    y -158 to +156 (their feet); drawn as triangular trusses 13 m wide on
 *    those centre lines. Spiral towers: OSM way/119388912, 119388913,
 *    119388914 (building=parking) and 119388915, circles r 18 centred
 *    (-131.7, 85.5), (-131.9, -88.7), (133.0, -87.1), (132.8, 90.9).
 *  - Heights (ESTIMATED; no lidar in Australia, no published section found),
 *    all measured from the plaza, which stands 5 m above the field (below):
 *    arch crest 58 m = OSM height=58 on relation/1641135 ("local
 *    knowledge"); the crest-to-tower-cap ratio about 2 in the normal-lens
 *    photo p10 agrees. Arch profile z = 58 (1 - (s/157)^2.9): flat-topped
 *    and steepening to the feet, fitted so it meets the roof rim near the
 *    corners (p01, p03, p11; the a03 aerial shows the legs short and steep
 *    just outside the rim). Truss depth 7 m at the crest, read from the
 *    lattice zone under the top chord in p01/p03. Roof rim 32 m over the
 *    long sides, 25 m over the ends (p10, p01 proportions against the arch
 *    crest and tower caps); end roof front edge 31 m (p04, p12). Spiral
 *    towers: six ramp turns of ~4.5 m, saucer cap at 27-29 m and a plant
 *    drum to 33 m (p01: tower width vs height). Facade bands (louvres 12-26
 *    m, concourse glazing 26-29 m, ground glazing 0-5 m) from p01/p03.
 *  - Field and plaza: the map's terrain (Mapterhorn z14, terrain.ts grid)
 *    shows the bowl about 5 m below the plaza all round, so y = 0 is the
 *    field and the outside of the model (facade, feet, towers) starts at
 *    PLAZA = 5 m, its lowest 5 m sinking into the plaza. Elevation 0: the
 *    terrain already carries the dip. Not confirmed by a drawing; the
 *    photos show the plaza entrances opening onto the concourse above the
 *    lower tier, consistent with a sunken field.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - p01 Adam.J.W.C., "Australia Stadium.jpg", CC BY-SA 2.5 - east facade
 *      head-on (panorama): arch, louvres, towers.
 *      https://commons.wikimedia.org/wiki/File:Australia_Stadium.jpg
 *    - p02 Roadrunnerz45, "Accor Stadium 1.jpg", CC BY-SA 4.0 - east facade
 *      today (Accor sign). https://commons.wikimedia.org/wiki/File:Accor_Stadium_1.jpg
 *    - p03 Phamthuathienvan, "ANZ Stadium Sydney July 2015.jpg", CC BY-SA
 *      3.0 - east facade, both east towers.
 *      https://commons.wikimedia.org/wiki/File:ANZ_Stadium_Sydney_July_2015.jpg
 *    - p04 vijay chennupati, "Clouds hovering over ANZ Stadium
 *      (6801238345).jpg", CC BY 2.0 - inside: arches over the side roofs,
 *      the lower end roof. https://commons.wikimedia.org/wiki/File:Clouds_hovering_over_ANZ_Stadium_(6801238345).jpg
 *    - p05 Adam.J.W.C., "Australia stadium aka ANZ stadium.jpg", CC BY 3.0
 *      - dusk, east facade from the north-east.
 *      https://commons.wikimedia.org/wiki/File:Australia_stadium_aka_ANZ_stadium.jpg
 *    - p06 Adam.J.W.C., "Stadium australia aka ANZ stadium.jpg", CC BY 3.0
 *      - dusk, east facade, tower close up.
 *      https://commons.wikimedia.org/wiki/File:Stadium_australia_aka_ANZ_stadium.jpg
 *    - p08 Simon_sees, "ANZ Stadium (5714943245).jpg", CC BY 2.0 - a spiral
 *      tower from above at night. https://commons.wikimedia.org/wiki/File:ANZ_Stadium_(5714943245).jpg
 *    - p09 State of New South Wales, "Platinum Jubilee- Accor Stadium
 *      Sydney.jpg", CC BY 4.0 - night, arch lit.
 *      https://commons.wikimedia.org/wiki/File:Platinum_Jubilee-_Accor_Stadium_Sydney.jpg
 *    - p10 Maksym Kozlenko, "ANZ Stadium - panoramio (1).jpg", CC BY-SA 3.0
 *      - from the south-east, normal lens: height ratios.
 *      https://commons.wikimedia.org/wiki/File:ANZ_Stadium_-_panoramio_(1).jpg
 *    - p11 Maksym Kozlenko, "ANZ Stadium - panoramio.jpg", CC BY-SA 3.0 -
 *      from Olympic Boulevard. https://commons.wikimedia.org/wiki/File:ANZ_Stadium_-_panoramio.jpg
 *    - p12 Simon_sees, "ANZ Stadium Sydney Olympic Park (7549839028).jpg",
 *      CC BY 2.0 - night, end roof and arch floodlit warm white.
 *      https://commons.wikimedia.org/wiki/File:ANZ_Stadium_Sydney_Olympic_Park_(7549839028).jpg
 *    - a03 Simon_sees, "Sydney Olympic Park (7188330805).jpg", CC BY 2.0 -
 *      aerial oblique from the east: roof, opening, arches, towers.
 *      https://commons.wikimedia.org/wiki/File:Sydney_Olympic_Park_(7188330805).jpg
 *  - Published: en.wikipedia.org "Stadium Australia" (dates, the 2003 end
 *    roofs); OSM tags (architect, height).
 *  No look-only sources were relied on. No commercial imagery. No lidar or
 *  NAIP (outside the US).
 *
 * Invented or simplified: the stands are three plain surfaces seen through
 * the opening; the roof is one sheet with a dark underside; the truss is a
 * triangular Warren truss with fewer, bolder members than the real one;
 * the louvre fins are 13 broad silver panels; the ramps are drawn as level rings,
 * not a helix; entrance canopies, the plaza light towers, the Accor sign and
 * the 2022 south screen are left out. Colours from p01/p03/a03, pulled to
 * the palette: roof pale cream (#e2ddcb), seats grey-blue, trusses white, cladding grey.
 * Night: the trusses and tower parapets are floodlit (p09, p12); the
 * concourse glazing glows (p05, p06). Doubts: every height (see above),
 * especially the end rim and the truss depth; the tower count of turns.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-aon-center'

type XY = [number, number]
const nrm3 = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

/** Smooth-shaded strip between two rings of equal length (closed or open),
 * normals turned to agree with `hint`. */
function strip(p: Part, r0: V3[], r1: V3[], hint: (q: V3) => V3, closed = true) {
  const n = r0.length
  const nv = (k: number, r: V3[]): V3 => {
    const a = r[closed ? (k - 1 + n) % n : Math.max(k - 1, 0)], b = r[closed ? (k + 1) % n : Math.min(k + 1, n - 1)]
    const T = subv(b, a), U = subv(r1[k], r0[k])
    let m = nrm3(crs(T, U))
    if (dot(m, hint(r[k])) < 0) m = [-m[0], -m[1], -m[2]]
    return m
  }
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const j = (i + 1) % n
    const a = r0[i], b = r0[j], c = r1[j], d = r1[i]
    const na = nv(i, r0), nb = nv(j, r0), nc = nv(j, r1), nd = nv(i, r1)
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}
/** Flat-shaded strip (each quad its own normal, turned to agree with hint). */
function flatStrip(p: Part, r0: V3[], r1: V3[], hint: (q: V3) => V3, closed = true) {
  const n = r0.length
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const j = (i + 1) % n
    const a = r0[i], b = r0[j], c = r1[j], d = r1[i]
    let m = nrm3(crs(subv(b, a), subv(d, a)))
    if (dot(m, hint(a)) < 0) m = [-m[0], -m[1], -m[2]]
    p.tri(a, b, c, undefined, undefined, undefined, [m, m, m])
    p.tri(a, c, d, undefined, undefined, undefined, [m, m, m])
  }
}
const OUT = (q: V3): V3 => [q[0], q[1], 0]
const IN = (q: V3): V3 => [-q[0], -q[1], 0]
const UP = (): V3 => [0, 0, 1]
const DOWN = (): V3 => [0, 0, -1]

/** A closed rectangular tube along a polyline: four sides, no ends;
 * w across (horizontal), h up. */
function tube(p: Part, path: V3[], w: number, h: number) {
  const secs = path.map((P, k) => {
    const T = nrm3(subv(path[Math.min(k + 1, path.length - 1)], path[Math.max(k - 1, 0)]))
    let S = crs(T, [0, 0, 1])
    if (Math.hypot(...S) < 1e-3) S = [1, 0, 0]
    S = nrm3(S)
    const U = nrm3(crs(S, T))
    return [add(add(P, S, w / 2), U, h / 2), add(add(P, S, -w / 2), U, h / 2), add(add(P, S, -w / 2), U, -h / 2), add(add(P, S, w / 2), U, -h / 2)].map((q) => [q, P] as [V3, V3])
  })
  for (let k = 0; k < secs.length - 1; k++) {
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const a = secs[k][i][0], b = secs[k][j][0], c = secs[k + 1][j][0], d = secs[k + 1][i][0]
      // Smooth (radial) corner normals: the bar reads round, and corners
      // shared along the bar keep the file small.
      const na = nrm3(subv(a, secs[k][i][1])), nb = nrm3(subv(b, secs[k][j][1]))
      const nc = nrm3(subv(c, secs[k + 1][j][1])), nd = nrm3(subv(d, secs[k + 1][i][1]))
      p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
  }
}

// ---------------------------------------------------------------------------
// Plan, in the model frame (bearing 10).

const BEARING = 10
const N = 56
const PHI = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
const R_OUT = 140 // OSM outer way: a circle

/** Roof opening: OSM inner way/119388911. */
const OPENING: XY[] = [[33.7, -105.5], [66.3, -72.2], [64.5, 75.2], [35.3, 104.4], [-34.8, 103.8], [-64.0, 73.0], [-63.9, -71.3], [-35.1, -106.2]]
/** Foot of the stands: OSM inner way/119388917. */
const FIELD: XY[] = [[-16.9, 80.2], [-5.6, 81.0], [7.4, 80.3], [18.2, 79.2], [31.1, 74.5], [44.4, 57.3], [45.5, -63.5], [35.2, -79.3], [25.0, -85.1], [14.4, -87.0], [4.2, -88.8], [-7.1, -87.8], [-17.4, -86.6], [-26.9, -84.3], [-37.3, -79.6], [-48.9, -63.1], [-50.4, 52.1], [-38.3, 72.2], [-26.7, 77.8]]
const CEN: XY = [0.6, -2.5] // shared centre of the inner shapes, for polar rays

/** Distance from CEN along angle phi to the polygon's edge. */
function polarR(poly: XY[], phi: number): number {
  const d: XY = [Math.cos(phi), Math.sin(phi)]
  let best = Infinity
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const e: XY = [b[0] - a[0], b[1] - a[1]], w: XY = [a[0] - CEN[0], a[1] - CEN[1]]
    const den = d[0] * e[1] - d[1] * e[0]
    if (Math.abs(den) < 1e-9) continue
    const t = (w[0] * e[1] - w[1] * e[0]) / den, u = (w[0] * d[1] - w[1] * d[0]) / den
    if (t > 0 && u >= -1e-6 && u <= 1 + 1e-6) best = Math.min(best, t)
  }
  return best
}
const onPoly = (poly: XY[], phi: number): XY => { const r = polarR(poly, phi); return [CEN[0] + r * Math.cos(phi), CEN[1] + r * Math.sin(phi)] }
/** The outer circle point on the same ray from CEN. */
function onCircle(phi: number): XY {
  const d: XY = [Math.cos(phi), Math.sin(phi)]
  const b = CEN[0] * d[0] + CEN[1] * d[1], c = CEN[0] ** 2 + CEN[1] ** 2 - R_OUT ** 2
  const t = -b + Math.sqrt(b * b - c)
  return [CEN[0] + t * d[0], CEN[1] + t * d[1]]
}

// ---------------------------------------------------------------------------
// Heights (estimated; see header).

/** The plaza round the stadium stands this far above the field (y = 0):
 * read from the map's terrain, which shows the bowl ~5 m below the plaza
 * all round (terrain.ts grid); see header. Every outside height is from it. */
const PLAZA = 5
const CREST = 58, FOOT = 157, POW = 2.9
const ARCH_X = [-65.0, 62.4]
const archZ = (s: number) => PLAZA + CREST * Math.max(0, 1 - Math.pow(Math.abs(s) / FOOT, POW))
const DEPTH = (s: number) => 7 * Math.max(0, 1 - (s / FOOT) ** 2)
const archBot = (s: number) => archZ(s) - DEPTH(s)
/** Roof rim over the bowl wall: 32 over the long sides, 25 over the ends. */
const rimZ = (x: number, y: number) => { const c = x / Math.hypot(x, y); return PLAZA + 25 + 7 * c * c }
/** Roof's inner edge round the opening. */
function innerZ(x: number, y: number) {
  const t = Math.min(1, Math.abs(x) / 64)
  return PLAZA + 31 + (archBot(y) - PLAZA - 31) * t * t
}

const at = (q: XY, z: number): V3 => [q[0], q[1], z]

function build() {
  const roof = new Part(), white = new Part(), grey = new Part(), win = new Part(), seats = new Part()

  // --- The bowl wall: a circle, recessed glazed ground floor, cladding,
  // concourse window band, and on the long sides the silver louvre band.
  const circ = (r: number, z: (x: number, y: number) => number) => PHI.map((f): V3 => { const x = r * Math.cos(f), y = r * Math.sin(f); return [x, y, z(x, y)] })
  const zc = (k: number) => () => (k ? PLAZA + k : 0)
  strip(win, circ(R_OUT - 2.5, zc(0)), circ(R_OUT - 2.5, zc(5)), OUT)
  strip(grey, circ(R_OUT - 2.5, zc(5)), circ(R_OUT, zc(5)), DOWN)
  strip(grey, circ(R_OUT, zc(5)), circ(R_OUT, (x, y) => rimZ(x, y) - 1.6), OUT)
  // Rim fascia (the roof's edge beam), white.
  strip(white, circ(R_OUT, (x, y) => rimZ(x, y) - 1.6), circ(R_OUT + 0.6, (x, y) => rimZ(x, y) - 1.2), (q) => [q[0], q[1], -40])
  strip(white, circ(R_OUT + 0.6, (x, y) => rimZ(x, y) - 1.2), circ(R_OUT + 0.6, (x, y) => rimZ(x, y) + 0.3), OUT)

  // Arc helpers for panels on the wall.
  const arc = (r: number, f0: number, f1: number, z: number, n: number) => Array.from({ length: n + 1 }, (_, k): V3 => { const f = f0 + ((f1 - f0) * k) / n; return [r * Math.cos(f), r * Math.sin(f), z] })
  const deg = Math.PI / 180
  // Louvre band and the concourse glazing over it, across the middle of the
  // east and west sides (p01, p03): +-26 deg about each.
  for (const c of [0, Math.PI]) {
    const f0 = c - 26 * deg, f1 = c + 26 * deg, n = 12, RL = R_OUT + 1.2
    // Broad vertical louvre panels with narrow gaps between them, the
    // rhythm of the fins grouped (no per-fin stripes).
    const NP = 13, GAP = 0.7 * deg, step = (f1 - f0) / NP
    for (let k = 0; k < NP; k++) {
      const fa = f0 + k * step + GAP / 2, fb = f0 + (k + 1) * step - GAP / 2
      flatStrip(white, arc(RL, fa, fb, PLAZA + 12, 1), arc(RL, fa, fb, PLAZA + 25.5, 1), OUT, false)
      flatStrip(white, arc(R_OUT, fa, fb, PLAZA + 25.5, 1), arc(RL, fa, fb, PLAZA + 25.5, 1), UP, false)
      flatStrip(white, arc(R_OUT, fa, fb, PLAZA + 12, 1), arc(RL, fa, fb, PLAZA + 12, 1), DOWN, false)
      for (const [f, sg] of [[fa, -1], [fb, 1]] as [number, number][]) {
        const t: V3 = [-Math.sin(f) * sg, Math.cos(f) * sg, 0]
        const p0 = arc(R_OUT, f, f, PLAZA + 12, 1)[0], p1 = arc(RL, f, f, PLAZA + 12, 1)[0]
        white.tri(p0, p1, [p1[0], p1[1], PLAZA + 25.5], undefined, undefined, undefined, [t, t, t])
        white.tri(p0, [p1[0], p1[1], PLAZA + 25.5], [p0[0], p0[1], PLAZA + 25.5], undefined, undefined, undefined, [t, t, t])
      }
    }
    strip(win, arc(R_OUT + 0.05, f0, f1, PLAZA + 26, n), arc(R_OUT + 0.05, f0, f1, PLAZA + 28.2, n), OUT, false)
  }
  // Concourse window band round the rest of the bowl (p05, p12).
  for (const [a0, a1] of [[26, 154], [206, 334]]) {
    const n = 16
    strip(win, arc(R_OUT + 0.05, a0 * deg, a1 * deg, PLAZA + 9, n), arc(R_OUT + 0.05, a0 * deg, a1 * deg, PLAZA + 11.5, n), OUT, false)
  }

  // --- The roof: from the rim up to the opening, pale translucent sheet on
  // top, dark underside below.
  const NR = 3
  const roofRing = (t: number, dz = 0) => PHI.map((f): V3 => {
    const o = onCircle(f), i = onPoly(OPENING, f)
    const zo = rimZ(o[0], o[1]) + 0.3, zi = innerZ(i[0], i[1])
    const q: XY = [o[0] + (i[0] - o[0]) * t, o[1] + (i[1] - o[1]) * t]
    return at(q, zo + (zi - zo) * (1 - (1 - t) ** 1.25) + dz)
  })
  for (let k = 0; k < NR; k++) strip(roof, roofRing(k / NR), roofRing((k + 1) / NR), UP)
  strip(seats, roofRing(0, -1.2), roofRing(1, -1.2), DOWN)
  // The front edge of the roof round the opening (a fascia), white.
  strip(white, roofRing(1, -1.2), roofRing(1), IN)

  // --- The stands, seen through the opening.
  const standRing = (t: number, z: number | ((q: XY) => number)) => PHI.map((f): V3 => {
    const a = onPoly(FIELD, f), o = onCircle(f)
    const q: XY = [a[0] + (o[0] - a[0]) * t, a[1] + (o[1] - a[1]) * t]
    return at(q, typeof z === 'number' ? z : z(q))
  })
  strip(grey, standRing(0, 0), standRing(0, 1.5), IN)
  strip(seats, standRing(0, 1.5), standRing(0.28, 14), (q) => [-q[0], -q[1], 2])
  strip(grey, standRing(0.28, 14), standRing(0.28, 17), IN)
  strip(seats, standRing(0.28, 17), standRing(0.8, (q) => rimZ(q[0], q[1]) - 3), (q) => [-q[0], -q[1], 2])

  // --- The arch trusses: a triangular Warren truss on each OSM arch line,
  // top chord over the centre, two bottom chords 6.5 m either side.
  const NS = 24, HALF = 6.5
  for (const ax of ARCH_X) {
    const sAt = (k: number) => -FOOT + (2 * FOOT * k) / NS
    const top = Array.from({ length: NS + 1 }, (_, k): V3 => [ax, sAt(k), Math.max(PLAZA + 2.2, archZ(sAt(k)))])
    // Bottom chords converge on the top chord at the feet.
    const bot = (side: number) => Array.from({ length: NS + 1 }, (_, k): V3 => {
      const s = sAt(k), w = HALF * Math.min(1, (FOOT - Math.abs(s)) / 30)
      return [ax + side * w, s, Math.max(PLAZA + 1.6, archBot(s))]
    })
    const bL = bot(-1), bR = bot(1)
    tube(white, top, 3.6, 3.6)
    tube(white, bL, 2.2, 2.2)
    tube(white, bR, 2.2, 2.2)
    // Diagonals: zig-zag from each bottom node up to the top chord.
    for (let k = 1; k < NS - 1; k += 2) {
      for (const b of [bL, bR]) {
        tube(white, [b[k], top[k + 1]], 1.4, 1.4)
        tube(white, [top[k + 1], b[k + 2]], 1.4, 1.4)
      }
    }
    // The roof's rafters, white V-props from the rim up to the truss's
    // outer bottom chord over the long-side roof (p01, p03).
    const sgn = Math.sign(ax), bo = sgn < 0 ? bL : bR
    for (let k = 1; k < NS; k += 2) {
      const s = sAt(k)
      if (Math.abs(s) > 112) continue
      const rx = sgn * Math.sqrt(R_OUT ** 2 - s * s)
      const rim: V3 = [rx, s, rimZ(rx, s) + 0.8]
      tube(white, [rim, bo[k - 1]], 1.2, 1.2)
      tube(white, [rim, bo[k + 1]], 1.2, 1.2)
    }
    // Concrete feet.
    for (const s of [-FOOT, FOOT]) {
      const y = s + (s < 0 ? -1 : 1) * 1.5
      const box: V3[] = [[ax - 4, y - 4, 0], [ax + 4, y - 4, 0], [ax + 4, y + 4, 0], [ax - 4, y + 4, 0]]
      grey.loft([box, box.map((q): V3 => [q[0], q[1], PLAZA + 3])])
      grey.cap(box.map((q): V3 => [q[0], q[1], PLAZA + 3]), true)
    }
  }

  // --- The spiral ramp towers: a grey core, six white ramp parapets, the
  // saucer cap and its plant drum.
  const TOWERS: XY[] = [[-131.7, 85.5], [-131.9, -88.7], [133.0, -87.1], [132.8, 90.9]]
  const NT = 14
  const tc = (c: XY, r: number, z: number) => Array.from({ length: NT }, (_, k): V3 => { const f = (k / NT) * 2 * Math.PI; return [c[0] + r * Math.cos(f), c[1] + r * Math.sin(f), z] })
  for (const c of TOWERS) {
    const o = (q: V3): V3 => [q[0] - c[0], q[1] - c[1], 0]
    strip(grey, tc(c, 11, 0), tc(c, 11, PLAZA + 27), o)
    for (let k = 0; k < 6; k++) {
      const z0 = PLAZA + 2.6 + 4.2 * k, z1 = z0 + 1.4
      strip(white, tc(c, 18, z0), tc(c, 18, z1), o)
      strip(white, tc(c, 18, z1), tc(c, 11, z1), UP)
    }
    // Saucer: underside flat at 26.4, rim at 27, rising to the drum at 29.
    const Z = PLAZA
    strip(white, tc(c, 11, Z + 26.4), tc(c, 21, Z + 26.8), DOWN)
    strip(white, tc(c, 21, Z + 26.8), tc(c, 21, Z + 27.3), o)
    strip(white, tc(c, 21, Z + 27.3), tc(c, 8, Z + 29), UP)
    strip(grey, tc(c, 8, Z + 29), tc(c, 8, Z + 33), o)
    grey.cap(tc(c, 8, Z + 33), true)
  }

  // Night: the trusses and tower parapets are floodlit warm white (p09,
  // p12); faces looking straight up barely.
  const flood = (_p: V3, n: V3) => (n[2] > 0.9 ? 0.25 : 0.85)
  return [
    { part: roof, material: finish('accor-roof', 0xe2ddcb) },
    { part: white, material: { ...finish('accor-truss', 0xf2f1ec), floodlight: flood } },
    { part: grey, material: finish('accor-cladding', 0xb8b9b6) },
    { part: win, material: PALETTE.window },
    { part: seats, material: finish('accor-seats', 0x92a9b7) },
  ]
}

if (import.meta.main) await save('sydney-accor-stadium', 'Accor Stadium', [-33.8471191, 151.0633843], BEARING, build(), 6500)
