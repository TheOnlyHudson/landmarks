/**
 * George Washington Bridge (1931; Othmar Ammann, Cass Gilbert; lower level
 * 1962) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-george-washington-bridge.ts
 *
 * The whole bridge as one placement, from the New York anchorage's landward
 * face to the Palisades: both towers, the New York anchorage, the cables'
 * housings where they enter the rock in New Jersey, the four main cables, the
 * suspenders, the two-level deck (the upper level's plate girders, the 1962
 * lower level hung under them, the open truss joining the two along each
 * side), the deck's underside and the two sidewalks, their surfaces included.
 * Writes a low model (simpler towers, cables, the girders as solid bands) and
 * a detail model (the towers in full, the side trusses' lattice, suspenders,
 * railings, floor beams), which a map draws from detailZoom up.
 *
 * Frame: x across the bridge, y along it toward New Jersey, z up, metres;
 * origin midway between the towers' lidar centres, on the water. Placed at
 * bearing 284.46°, the line between those centres (1,063.8 m apart; the
 * published main span is 3,500 ft, 1,067 m).
 *
 * Height. z is NAVD88 + 0.88: Mapterhorn, the map's terrain, lays the Hudson
 * at -0.88 m NAVD88, the lowest ground under the footprint, so every height
 * here lands at its true NAVD88 height on the map. Land feet (the New York
 * tower's pier and legs, the anchorage, the New Jersey housings) run down to
 * Mapterhorn + 0.88 vertex by vertex from tables in this frame. The towers'
 * design heights were measured above the lidar's river (-0.7 m NAVD88), so
 * they are lifted 0.18 m.
 *
 * Roadways built to (lidar, NAVD88; model z is 0.88 higher): the upper level
 * 76.9 m at its crest (y = -50 to +200), 70.8 m at the New York tower, 66.4 m
 * at the anchorage's river face and 65.2 m at its landward face, 75.8 m at
 * the New Jersey tower, 75.4 m where it lands on the Palisades; both
 * carriageways agree within 0.15 m. The lower level 8.4 m below the upper
 * (estimated: the 1962 design's 15 ft clearance under the upper deck plus
 * its 12 ft deck; lidar cannot see it). Pins that put the map's decks on
 * these heights are recorded in the pull request.
 *
 * Sources for the span:
 * - OSM: the outline way/392759062 (man_made=bridge, from the New York
 *   anchorage's landward face to the New Jersey approach cut), the towers
 *   way/741784699 (New Jersey) and way/741784700 (New York), the New York
 *   anchorage way/899357171 (bridge:support=abutment); the upper level's
 *   ways 8028082, 49032026, 1339765260 and 16586045, 9702602, 49036344.
 * - Lidar (USGS 3DEP NY_NewYorkCity, 2017, which covers both banks here;
 *   1 m grids along the whole bridge, and tools/bridge_ele.py every 25 m
 *   along both carriageways): the roadways above; the deck 37 m wide; four
 *   cables in two pairs at |x| 14.7 and 17.5, 82.6 m (centre) at midspan,
 *   a parabola to 181.2 m at the towers; on the side spans 121.2 m at
 *   y = -631 and 72.2 m at -721 (New York), 122.7 m at 629 and 89.6 m at 689
 *   (New Jersey), sagging a little, so they carry the side spans' deck; the
 *   New York anchorage's top 58.7 m either side of the deck, its ground
 *   28-31 m; the New Jersey cables entering the rock 2-3 m above the road at
 *   y = 712.
 * - Published (Wikipedia "George Washington Bridge"; nycroads.com; Port
 *   Authority): side spans 650 ft (NY) and 610 ft (NJ); deck 119 ft wide,
 *   upper roadway 90 ft; four 36 in cables; 592 suspenders; the upper deck
 *   12 ft deep, without stiffening trusses until the lower level added an
 *   open truss along each side joining the two decks; clearance 212 ft at
 *   midspan; the New Jersey cables anchored in tunnels in the Palisades,
 *   the New York ones in a concrete anchorage.
 * - Photos: HAER NY-129-76 (Jet Lowe, public domain; the whole bridge from
 *   above Manhattan: suspenders on the New York side span, the anchorage
 *   block with the deck over it, the deck's girder bands and lattice);
 *   HAER NY-129-27 (Jet Lowe, public domain; the New Jersey cables entering
 *   their fenced housings beside the sidewalk, suspenders on the New Jersey
 *   side span).
 * - Estimated: the truss panels (30 ft, Warren with verticals) and the
 *   girders' depths; suspenders every 60 ft, drawn on alternate cables of a
 *   pair, so half the real ropes; the anchorage's walls plumb and plain, with
 *   a trough the deck runs through; the housings' size (2.4 m high). The
 *   cables are drawn 1.6 m thick, the suspenders 0.44 m.
 *
 * The towers' sources, unchanged:
 *
 * What makes it the George Washington Bridge: the never-clad steel frame.
 * Two square lattice legs, every face filled with big X panels, joined by a
 * tall semicircular arch over the roadway with lattice spandrels above it, a
 * second arch under the deck, and a deep open attic band across the top.
 * Pale grey paint.
 *
 * - OSM: tower outlines way/741784699 (New Jersey) and way/741784700 (New
 *   York), bridge:support=pylon, height 184: 72.5 x 28 m in the bridge frame,
 *   which is the pier.
 * - Lidar (USGS 3DEP NY_NewYorkCity 2017, point cloud cropped to each tower,
 *   heights above the river at about -0.7 m NAVD88): top 184 m (NJ 183.5–
 *   184.4, NY 182–185); legs |x| 16–31 (each about 15 m square, 15.5 m deep
 *   along the bridge), the opening between them about 31 m; the arch crown
 *   (outer edge) about 145 m; cross members under the attic at 176–178 m
 *   and in the spandrel at about 151 and 165 m; the NY pier 5.1 m, the NJ
 *   one 4.5 m.
 * - Published: towers 604 ft (184 m) above the water (Wikipedia; Port
 *   Authority of NY & NJ).
 * - Photos (Wikimedia Commons): "George Washington Bridge (tower structure)"
 *   (Frederika Eilers, CC BY-SA 3.0; the attic, spandrel X panels and arch
 *   ring face-on); "George Washington Bridge west tower and south sidewalk
 *   seen from the west" (Beyond My Ken, CC BY-SA 4.0; the NJ tower's portal
 *   and the legs' inner faces); "2015 George Washington Bridge east tower from
 *   south" (Beyond My Ken, CC BY-SA 4.0; a leg's side face, the arch under
 *   the deck); "George Washington Bridge from Englewood Basin NJ2"
 *   (Acroterion, CC BY-SA 4.0; the NY tower whole, three-quarter from the
 *   north-west); HAER NY-129-18 "George Washington Bridge New York roadway and
 *   tower" (Jet Lowe, public domain; portal face-on from the roadway);
 *   "George Washington Bridge from Ft Tryon Park 06" (Jay Dobkin, CC BY-SA
 *   4.0; the NY tower from the south-east, for the paint).
 * - Estimated from photos: the lower arch (crown about 45 m), the panel
 *   rhythm (four X panels per face below the deck, seven above, square-ish
 *   as in the photos), the attic's ten openings.
 * - Colour: lit steel in daylight photos reads #acb3bd to #e0e2e6, a pale
 *   grey with a faint blue; pulled to the palette's lightness, the bracing a
 *   shade deeper so the X panels read against the posts.
 *
 * The lattice is drawn as broad plates: corner posts, horizontal struts at
 * each panel line, and one X of two wide plates per panel, on every face of
 * each leg, so the legs stay see-through as the real frame is. The low
 * model's towers have solid legs with X plates on their faces.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { box, countParts } from './nyc-manhattan-bridge'
import {
  band, chamferedRect, footedLoft, footedWall, groundAt, merged, movedAlong, parabola, piecewise, ribbon, rod, stations, strip, tube,
  type GroundGrid,
} from './bridge-kit'

// ---- Helpers (shared with the Verrazzano-Narrows and Hell Gate generators) ----

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const avg = (ps: V3[]): V3 => {
  const s: V3 = [0, 0, 0]
  for (const p of ps) { s[0] += p[0]; s[1] += p[1]; s[2] += p[2] }
  return [s[0] / ps.length, s[1] / ps.length, s[2] / ps.length]
}

/** A quad wound to face away from `inside`. */
export function quadOut(p: Part, q: V3[], inside: V3) {
  const n = cross(sub(q[1], q[0]), sub(q[2], q[0]))
  const n2 = cross(sub(q[2], q[0]), sub(q[3], q[0]))
  const m: V3 = [n[0] + n2[0], n[1] + n2[1], n[2] + n2[2]]
  if (dot(m, sub(avg(q), inside)) >= 0) p.quad(q[0], q[1], q[2], q[3])
  else p.quad(q[3], q[2], q[1], q[0])
}

/** A convex hexahedron from two matching corner loops (a0..a3, b0..b3). */
export function hexa(p: Part, a: V3[], b: V3[], { capA = true, capB = true, skip = [] as number[] } = {}) {
  const c = avg([...a, ...b])
  if (capA) quadOut(p, a, c)
  if (capB) quadOut(p, b, c)
  for (let i = 0; i < 4; i++) {
    if (skip.includes(i)) continue
    const j = (i + 1) % 4
    quadOut(p, [a[i], a[j], b[j], b[i]], c)
  }
}

/** A face frame: maps (a along the face, z up, n into the structure) to a point. */
export type Face = (a: number, z: number, n: number) => V3

/** A plate on a face, a0..a1 by z0..z1, n0..n1 deep; `ends: false` leaves off its hidden a0/a1 ends. */
export function facePlate(p: Part, F: Face, a0: number, a1: number, z0: number, z1: number, n0: number, n1: number, ends = true) {
  hexa(p, [F(a0, z0, n0), F(a1, z0, n0), F(a1, z1, n0), F(a0, z1, n0)],
    [F(a0, z0, n1), F(a1, z0, n1), F(a1, z1, n1), F(a0, z1, n1)], { skip: ends ? [] : [1, 3] })
}

/**
 * An X of two broad plates in a face panel a0..a1 by z0..z1, w wide (measured
 * square to the plate) and n0..n1 deep, clipped to the panel so nothing pokes
 * past it.
 */
export function faceX(p: Part, F: Face, a0: number, a1: number, z0: number, z1: number, w: number, n0: number, n1: number) {
  const h = (w / 2) * Math.hypot(a1 - a0, z1 - z0) / (a1 - a0)
  const lo = (z: number) => Math.max(z0, Math.min(z1, z))
  for (const [za, zb] of [[z0, z1], [z1, z0]]) {
    const q = (n: number): V3[] => [F(a0, lo(za - h), n), F(a1, lo(zb - h), n), F(a1, lo(zb + h), n), F(a0, lo(za + h), n)]
    hexa(p, q(n0), q(n1), { skip: [1, 3] }) // the ends butt into the panel's frame
  }
}

export type LatticeOpts = {
  pw?: number; sh?: number; st?: number; xw?: number; xt?: number; faces?: string[]
  /** Leave out the X in face f's panel k. */
  skipX?: (f: string, k: number) => boolean
  /** Run the corner posts down to this ground (hidden in the pier) rather than stopping at the first level. */
  foot?: (x: number, y: number) => number
}

/**
 * A lattice box: corner posts, struts at `levels` and X panels between them,
 * on whichever of its four faces `faces` names. x0..x1 by y0..y1 in plan.
 */
export function latticeBox(post: Part, brace: Part, x0: number, x1: number, y0: number, y1: number,
  levels: number[], { pw = 3, sh = 2, st = 1.0, xw = 2.2, xt = 0.8, faces = ['s', 'n', 'w', 'e'], skipX = (): boolean => false, foot }: LatticeOpts = {}) {
  const zb = levels[0], zt = levels[levels.length - 1]
  for (const [x, y] of [[x0, y0], [x1 - pw, y0], [x1 - pw, y1 - pw], [x0, y1 - pw]]) {
    if (foot) footedLoft(post, foot, [
      { plan: chamferedRect(x, x + pw, y, y + pw, 0.35), z: 'ground' },
      { plan: chamferedRect(x, x + pw, y, y + pw, 0.35), z: zt },
    ], pw)
    else box(post, x, x + pw, y, y + pw, zb, zt, { r: 0.35, bottom: false })
  }
  const F: Record<string, [Face, number, number]> = {
    s: [(a, z, n) => [a, y0 + n, z], x0 + pw, x1 - pw],
    n: [(a, z, n) => [a, y1 - n, z], x0 + pw, x1 - pw],
    w: [(a, z, n) => [x0 + n, a, z], y0 + pw, y1 - pw],
    e: [(a, z, n) => [x1 - n, a, z], y0 + pw, y1 - pw],
  }
  for (const f of faces) {
    const [Fn, a0, a1] = F[f]
    for (const z of levels) facePlate(post, Fn, a0, a1, Math.max(zb, z - sh / 2), Math.min(zt, z + sh / 2), 0.15, 0.15 + st, false)
    for (let k = 0; k < levels.length - 1; k++) {
      if (skipX(f, k)) continue
      const za = levels[k] + (k === 0 ? sh / 2 : sh / 2), zc = levels[k + 1] - sh / 2
      if (zc - za > 1) faceX(brace, Fn, a0, a1, za, zc, xw, 0.35, 0.35 + xt)
    }
  }
}

/**
 * An arch ring through the depth y0..y1: intrados ri, extrados ro, centre
 * (0, zs), as a barrel of `seg` segments.
 */
export function archRing(p: Part, ri: number, ro: number, zs: number, y0: number, y1: number, seg = 12) {
  for (let i = 0; i < seg; i++) {
    const t0 = Math.PI - (Math.PI * i) / seg, t1 = Math.PI - (Math.PI * (i + 1)) / seg
    const P = (r: number, t: number, y: number): V3 => [r * Math.cos(t), y, zs + r * Math.sin(t)]
    hexa(p, [P(ri, t0, y0), P(ri, t1, y0), P(ro, t1, y0), P(ro, t0, y0)], [P(ri, t0, y1), P(ri, t1, y1), P(ro, t1, y1), P(ro, t0, y1)])
  }
}

/**
 * Spandrel plates between an arch's extrados (radius ro, centre (0, zs)) and
 * the rectangle |x| <= hx, z <= z1, in the slab y0..y1.
 */
export function haunches(p: Part, ro: number, zs: number, hx: number, z1: number, y0: number, y1: number, seg = 8) {
  const t0 = ro > hx ? Math.acos(hx / ro) : 0
  for (const s of [-1, 1]) for (let i = 0; i < seg; i++) {
    const ta = t0 + ((Math.PI / 2 - t0) * i) / seg, tb = t0 + ((Math.PI / 2 - t0) * (i + 1)) / seg
    const xa = s * ro * Math.cos(ta), xb = s * ro * Math.cos(tb)
    const za = Math.min(z1, zs + ro * Math.sin(ta)), zb = Math.min(z1, zs + ro * Math.sin(tb))
    const q = (y: number): V3[] => [[xa, y, za], [xb, y, zb], [xb, y, z1], [xa, y, z1]]
    if (z1 - Math.min(za, zb) > 0.05) hexa(p, q(y0), q(y1))
  }
  // Below the arch's foot, if the extrados is narrower than the rectangle.
  if (ro < hx) for (const s of [-1, 1]) {
    const q = (y: number): V3[] => [[s * ro, y, zs], [s * hx, y, zs], [s * hx, y, z1], [s * ro, y, z1]]
    hexa(p, q(y0), q(y1))
  }
}


// ---- The tower ------------------------------------------------------------------

/** The towers' design heights are above the lidar's river (-0.7 m NAVD88); the frame's 0 is -0.88. */
const LIFT = 0.18

type TowerParts = { steel: Part; brace: Part; pier: Part }

/**
 * One tower about its own centre: `deck` is the upper roadway there, `pierTop`
 * its pier's top, and `ground` the land under it, if it stands on land. Without
 * `ground` the pier stands on the water at z = 0. `simple` is the low model's:
 * solid legs with X plates on their faces, fewer arch segments, a plainer attic.
 */
function tower({ steel, brace, pier }: TowerParts, deck: number, pierTop: number,
  ground?: (x: number, y: number) => number, simple = false) {
  const PIER = pierTop
  const DECK0 = deck - 11.8, DECK = deck // underside of the lower level's girders, upper roadway
  const LOW_SPRING = 42 + LIFT           // lower arch
  const SPRING = 127 + LIFT              // upper arch
  const SPAN1 = 146.5 + LIFT, SPAN2 = 161.5 + LIFT // spandrel struts
  const ATTIC = 176 + LIFT, TOP = 184 + LIFT       // attic band

  const XI = 15.0, XO = 31.0             // legs, |x|
  const D = 7.75                         // half depth along the bridge
  const R = XI, RO = XI + 2.4            // arch intrados at the legs' inner faces; ring 2.4 m
  const seg = simple ? 8 : 12

  if (ground) {
    const outer = chamferedRect(-36.2, 36.2, -14, 14, 0.8), step = chamferedRect(-34.5, 34.5, -11, 11, 0.6)
    const s = simple ? 9 : 5
    footedLoft(pier, ground, [
      { plan: outer, z: 'ground' },
      { plan: outer, z: PIER - 0.8 },
      { plan: step, z: PIER - 0.8 },
      { plan: step, z: PIER - 0.3 },
      { plan: chamferedRect(-34.2, 34.2, -10.7, 10.7, 0.48), z: PIER },
    ], s)
    footedLoft(pier, ground, [{ plan: step, z: 'ground' }, { plan: step, z: PIER - 0.8 }], s, false)
  } else {
    box(pier, -36.2, 36.2, -14, 14, 0, PIER - 0.8, { r: 0.8, bottom: false })
    box(pier, -34.5, 34.5, -11, 11, PIER - 0.8, PIER, { r: 0.6, top: 0.3, bottom: false })
  }

  const front: Face = (a, z, n) => [a, -D + n, z]
  const back: Face = (a, z, n) => [a, D - n, z]
  if (simple) {
    // Solid legs, an X plate in each of three panels on every face but the inner one.
    const panels: [number, number][] = [[PIER + 1, DECK0 - 1], [DECK + 1, (DECK + ATTIC) / 2 - 1], [(DECK + ATTIC) / 2 + 1, ATTIC - 1]]
    for (const s of [-1, 1]) {
      const [x0, x1] = s > 0 ? [XI, XO] : [-XO, -XI]
      const plan = chamferedRect(x0, x1, -D, D, 0.5)
      if (ground) footedLoft(steel, ground, [{ plan, z: 'ground' }, { plan, z: ATTIC }], 6)
      else box(steel, x0, x1, -D, D, PIER, ATTIC, { r: 0.5, bottom: false })
      const side: Face = (a, z, n) => [s * (XO + 0.3 - n), a, z]
      const legFront: Face = (a, z, n) => [a, -D - 0.3 + n, z]
      const legBack: Face = (a, z, n) => [a, D + 0.3 - n, z]
      for (const [z0, z1] of panels) {
        faceX(brace, side, -D + 0.6, D - 0.6, z0, z1, 2.4, 0, 0.3)
        faceX(brace, legFront, x0 + 0.6, x1 - 0.6, z0, z1, 2.4, 0, 0.3)
        faceX(brace, legBack, x0 + 0.6, x1 - 0.6, z0, z1, 2.4, 0, 0.3)
      }
    }
  } else {
    // Four X panels on each face below the deck, the deck zone, seven above.
    const levels = [PIER]
    for (let k = 1; k <= 4; k++) levels.push(PIER + ((DECK0 - PIER) * k) / 4)
    levels.push(DECK)
    for (let k = 1; k <= 7; k++) levels.push(DECK + ((ATTIC - DECK) * k) / 7)
    for (const s of [-1, 1]) {
      const [x0, x1] = s > 0 ? [XI, XO] : [-XO, -XI]
      latticeBox(steel, brace, x0, x1, -D, D, levels, {
        // The deck zone of the inner face stays open: the sidewalks pass through it.
        skipX: (f, k) => (f === (s > 0 ? 'w' : 'e') && k === 4),
        foot: ground,
      })
    }
  }

  // Upper portal: the arch ring, spandrels to the first strut, then lattice up to the attic.
  archRing(steel, R - 0.01, RO, SPRING, -D + 0.5, D - 0.5, seg)
  const slabs = simple ? [[-D + 0.4, D - 0.4]] : [[-D + 0.4, -D + 1.6], [D - 1.6, D - 0.4]]
  for (const [y0, y1] of slabs) haunches(brace, RO, SPRING, XI, SPAN1 - 1, y0, y1, simple ? 4 : 8)
  for (const F of [front, back]) {
    for (const z of [SPAN1, SPAN2]) facePlate(steel, F, -XI, XI, z - 1, z + 1, 0.15, 1.15)
    for (const [z0, z1] of [[SPAN1 + 1, SPAN2 - 1], [SPAN2 + 1, ATTIC - 1]])
      for (let i = 0; i < 3; i++) {
        const a0 = -XI + (2 * XI * i) / 3, a1 = -XI + (2 * XI * (i + 1)) / 3
        faceX(brace, F, a0, a1, z0, z1, 2.2, 0.35, 1.15)
        if (i > 0) facePlate(steel, F, a0 - 0.6, a0 + 0.6, z0, z1, 0.25, 1.05)
      }
  }

  // Lower portal: an arch under the deck, its spandrels up to the deck's underside.
  archRing(steel, R - 0.01, RO, LOW_SPRING, -D + 0.5, D - 0.5, seg)
  for (const [y0, y1] of slabs) haunches(brace, RO, LOW_SPRING, XI, DECK0, y0, y1, simple ? 4 : 8)

  // The attic: a beam, posts between open bays, a capping slab; side faces with two bays each.
  const AT0 = ATTIC, AT1 = ATTIC + 2.2, CAP0 = TOP - 1.6
  const bays = simple ? 5 : 10
  for (const F of [front, back]) {
    facePlate(steel, F, -XO, XO, AT0, AT1, 0, 1.4)
    for (let i = 0; i <= bays; i++) {
      const a = -XO + (2 * XO * i) / bays
      const w = i === 0 || i === bays ? 3 : 1.4
      const a0 = i === 0 ? -XO : i === bays ? XO - w : a - w / 2
      facePlate(steel, F, a0, a0 + w, AT1, CAP0, 0, 1.4)
    }
  }
  for (const s of [-1, 1]) {
    const side: Face = (a, z, n) => [s * (XO - n), a, z]
    facePlate(steel, side, -D + 1.4, D - 1.4, AT0, AT1, 0, 1.4)
    facePlate(steel, side, -0.7, 0.7, AT1, CAP0, 0, 1.4)
  }
  box(steel, -XO - 0.3, XO + 0.3, -D - 0.3, D + 0.3, CAP0, TOP, { r: 0.4, top: 0.3, bot: 0.3, bottom: true })
}

// ---- The span ---------------------------------------------------------------------

const TY = 531.9                 // tower centres at y = ±TY
const FACE = 8.1                 // the towers' faces, from their centre lines
const YM = -789, YN = 702        // the deck's ends: the anchorage's landward face, the Palisades
const ANCHOR = [-789, -716, -704] // the anchorage: landward face, main block's river face, its front step
const CUT = 704                  // the New Jersey cables' housings, from here to CUT + 12

/** The upper roadway (lidar, both carriageways, every 50 m), model z = NAVD88 + 0.88. */
const road = piecewise([
  [-790, 66.12], [-740, 67.14], [-690, 68.24], [-640, 69.29], [-590, 70.42], [-540, 71.55], [-490, 72.62],
  [-440, 73.66], [-390, 74.51], [-340, 75.32], [-290, 75.98], [-240, 76.56], [-190, 77.01], [-140, 77.34],
  [-90, 77.54], [-40, 77.70], [10, 77.71], [60, 77.74], [110, 77.76], [160, 77.77], [210, 77.71], [260, 77.60],
  [310, 77.49], [360, 77.38], [410, 77.15], [460, 76.94], [510, 76.73], [560, 76.49], [610, 76.26], [660, 76.10],
  [702, 76.28],
])
const LEVEL = 8.4                // the lower roadway below the upper
const lower = (y: number) => road(y) - LEVEL
const UPPER_GIRDER = 3.7         // the upper deck's depth under its roadway (12 ft)
const LOWER_GIRDER = 3.4         // the lower deck's under its own
const PARAPET = 1.0              // the lower level's side girder rises this far above its roadway
const underUpper = (y: number) => road(y) - UPPER_GIRDER
const underLower = (y: number) => lower(y) - LOWER_GIRDER

const EDGE = 18.35               // the deck's outer edge
const SIDE = 17.85               // the side girders' and truss's inner face
const WALK = [14.0, SIDE]        // the sidewalks, beside the roadway
const WALK_UP = 0.2
const CABLES = [-17.5, -14.7, 14.7, 17.5]
const CABLE_R = 0.8
const LOW_C = 82.63, SADDLE = 181.2
const PANEL = 9.14               // truss panels, 30 ft
const HANGER = 18.29             // suspender bands, 60 ft

const mainCable = (y: number) => LOW_C + (SADDLE - LOW_C) * (y / TY) ** 2
const nyCable = parabola([-TY, SADDLE], [-630.9, 121.2], [-720.9, 72.2])
const njCable = parabola([TY, SADDLE], [629.1, 122.7], [689.1, 89.6])
const cable = (y: number) => (Math.abs(y) <= TY ? mainCable(y) : y < 0 ? nyCable(y) : njCable(y))
const NY_CABLE_END = -748, NJ_CABLE_END = 708 // where the free cables end, entering masonry or rock

const spans: [number, number][] = [[YM, -TY - FACE], [-TY + FACE, TY - FACE], [TY + FACE, YN]]
const curve = ([a, b]: [number, number], step: number) => stations(a, b, step)

// Mapterhorn + 0.88 in this frame: rows along y from y0, columns across from x0.
const NY_TOWER: GroundGrid = { y0: -16, x0: -38, step: 2, z: [
  [3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 4.0, 4.1, 4.1, 4.2, 4.3, 4.3, 4.4, 4.4, 4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 5.0, 5.0, 5.1, 5.1, 5.1, 5.0, 4.9, 4.7, 4.5, 4.3, 4.0, 3.8, 3.5, 3.3],
  [3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 4.0, 3.9, 3.9, 4.0, 4.0, 4.0, 4.1, 4.2, 4.3, 4.3, 4.4, 4.5, 4.5, 4.6, 4.7, 4.8, 4.8, 4.9, 4.9, 5.0, 5.1, 5.2, 5.2, 5.2, 5.2, 5.1, 5.0, 4.8, 4.6, 4.4, 4.0, 3.3, 3.1],
  [3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 4.0, 4.0, 4.0, 4.1, 4.2, 4.2, 4.3, 4.4, 4.5, 4.5, 4.6, 4.7, 4.8, 4.9, 4.9, 5.0, 5.0, 5.1, 5.2, 5.2, 5.3, 5.3, 5.3, 5.3, 5.2, 5.3, 5.2, 4.4, 3.3, 3.0],
  [3.8, 3.8, 3.8, 3.8, 3.9, 3.9, 3.9, 3.9, 3.9, 4.0, 4.0, 4.0, 4.1, 4.1, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 4.6, 4.7, 4.8, 4.9, 5.0, 5.0, 5.1, 5.1, 5.2, 5.3, 5.3, 5.3, 5.4, 5.4, 5.5, 5.5, 4.4, 3.2, 2.9],
  [3.8, 3.7, 3.7, 3.8, 3.8, 3.8, 3.8, 3.9, 3.9, 4.0, 4.0, 4.0, 4.0, 4.1, 4.1, 4.3, 4.3, 4.4, 4.5, 4.6, 4.6, 4.7, 4.8, 4.8, 4.9, 5.0, 5.0, 5.0, 5.1, 5.1, 5.1, 5.2, 5.4, 5.4, 5.4, 5.4, 4.4, 3.1, 2.9],
  [3.7, 3.7, 3.7, 3.7, 3.8, 3.8, 3.9, 3.9, 3.9, 4.0, 4.0, 3.9, 4.0, 4.1, 4.1, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 4.6, 4.8, 4.8, 4.9, 4.9, 4.9, 4.9, 5.0, 5.0, 4.9, 5.0, 5.2, 5.4, 5.4, 5.4, 4.6, 3.2, 2.8],
  [3.6, 3.6, 3.7, 3.7, 3.8, 3.8, 3.8, 3.9, 3.9, 4.0, 4.0, 3.9, 3.9, 4.0, 4.1, 4.2, 4.2, 4.3, 4.4, 4.5, 4.6, 4.6, 4.7, 4.7, 4.7, 4.8, 4.8, 4.8, 4.9, 4.8, 4.7, 4.9, 5.1, 5.2, 5.4, 5.3, 4.7, 3.3, 2.8],
  [3.6, 3.6, 3.7, 3.8, 3.8, 3.8, 3.8, 3.9, 3.9, 4.0, 3.9, 3.9, 3.9, 4.0, 4.1, 4.1, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 4.6, 4.6, 4.7, 4.7, 4.7, 4.7, 4.7, 4.7, 4.5, 4.7, 4.9, 5.1, 5.3, 5.3, 4.6, 3.2, 2.8],
  [3.6, 3.6, 3.7, 3.8, 3.8, 3.8, 3.9, 3.9, 3.9, 4.0, 3.9, 3.9, 3.9, 4.0, 4.0, 4.1, 4.2, 4.3, 4.3, 4.4, 4.5, 4.5, 4.5, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6, 4.5, 4.4, 4.5, 4.7, 4.9, 5.1, 5.3, 4.8, 3.0, 2.7],
  [3.5, 3.5, 3.7, 3.7, 3.8, 3.8, 3.8, 3.9, 3.9, 3.9, 3.9, 3.9, 3.8, 3.9, 4.0, 4.0, 4.1, 4.2, 4.3, 4.3, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.5, 4.5, 4.5, 4.3, 4.2, 4.3, 4.5, 4.7, 4.8, 5.2, 4.7, 3.0, 2.6],
  [3.5, 3.5, 3.6, 3.7, 3.8, 3.8, 3.8, 3.9, 3.9, 4.0, 3.9, 3.8, 3.8, 3.9, 4.0, 4.0, 4.1, 4.2, 4.2, 4.3, 4.3, 4.3, 4.3, 4.3, 4.3, 4.3, 4.4, 4.4, 4.4, 4.2, 4.0, 4.1, 4.3, 4.4, 4.7, 5.1, 4.4, 2.8, 2.4],
  [3.5, 3.5, 3.6, 3.7, 3.8, 3.8, 3.8, 3.9, 3.9, 3.9, 3.9, 3.8, 3.8, 3.8, 3.9, 4.0, 4.1, 4.1, 4.1, 4.1, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.3, 4.3, 4.0, 3.8, 3.9, 4.0, 4.1, 4.5, 5.1, 4.4, 2.4, 2.1],
  [3.4, 3.4, 3.5, 3.7, 3.8, 3.8, 3.8, 3.9, 3.9, 3.9, 3.9, 3.8, 3.8, 3.8, 3.9, 3.9, 4.0, 4.0, 4.0, 4.0, 4.0, 4.1, 4.1, 4.1, 4.1, 4.1, 4.1, 4.1, 4.1, 3.9, 3.6, 3.7, 3.7, 3.8, 4.3, 4.9, 4.6, 2.2, 1.7],
  [3.4, 3.4, 3.5, 3.6, 3.7, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.8, 3.8, 3.8, 3.8, 3.8, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 3.7, 3.4, 3.4, 3.1, 3.3, 3.8, 4.7, 4.0, 2.1, 1.5],
  [3.4, 3.4, 3.6, 3.6, 3.7, 3.8, 3.9, 3.9, 3.9, 3.9, 3.9, 3.8, 3.7, 3.7, 3.7, 3.7, 3.8, 3.8, 3.8, 3.8, 3.8, 3.8, 3.8, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.5, 3.2, 2.8, 2.6, 2.5, 2.7, 3.0, 2.5, 1.5, 1.3],
  [3.4, 3.5, 3.6, 3.6, 3.7, 3.8, 3.8, 3.8, 3.8, 3.8, 3.8, 3.7, 3.7, 3.6, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.8, 3.8, 3.7, 3.8, 3.6, 3.3, 2.9, 2.5, 2.3, 2.0, 1.8, 1.6, 1.4, 1.2, 1.1],
  [3.4, 3.4, 3.5, 3.6, 3.7, 3.7, 3.8, 3.8, 3.7, 3.7, 3.7, 3.7, 3.6, 3.6, 3.6, 3.5, 3.5, 3.5, 3.5, 3.5, 3.4, 3.4, 3.4, 3.4, 3.4, 3.3, 3.4, 3.3, 3.1, 2.9, 2.6, 2.4, 2.1, 1.8, 1.6, 1.4, 1.2, 1.1, 1.1],
] }
const NY_ANCHORAGE: GroundGrid = { y0: -794, x0: -32, step: 4, z: [
  [31.4, 31.4, 31.3, 31.3, 31.4, 31.4, 31.5, 31.6, 31.7, 31.8, 31.8, 31.9, 31.9, 32.0, 31.9, 32.3, 32.4],
  [31.2, 31.2, 31.1, 31.2, 31.3, 31.4, 31.4, 31.4, 31.5, 31.6, 31.6, 31.7, 31.7, 31.8, 31.8, 31.9, 32.4],
  [30.9, 31.1, 31.0, 31.1, 31.1, 31.2, 31.3, 31.3, 31.4, 31.4, 31.5, 31.5, 31.6, 31.6, 31.6, 31.6, 32.1],
  [30.7, 30.8, 30.9, 31.0, 31.0, 31.1, 31.1, 31.2, 31.2, 31.2, 31.3, 31.3, 31.3, 31.4, 31.4, 31.4, 31.7],
  [30.5, 30.6, 30.7, 30.8, 30.9, 30.9, 30.9, 30.9, 31.0, 31.0, 31.0, 31.1, 31.1, 31.1, 31.2, 31.1, 31.2],
  [30.3, 30.5, 30.6, 30.7, 30.8, 30.8, 30.8, 30.8, 30.8, 30.9, 30.9, 30.9, 31.0, 31.0, 31.0, 31.0, 30.9],
  [30.2, 30.4, 30.6, 30.6, 30.7, 30.7, 30.7, 30.7, 30.7, 30.7, 30.7, 30.8, 30.8, 30.8, 30.8, 30.7, 30.9],
  [30.1, 30.4, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.5, 30.3],
  [30.0, 30.4, 30.5, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.6, 30.3, 29.9],
  [29.9, 30.3, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.2, 29.7],
  [29.9, 30.3, 30.6, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.5, 30.4, 30.4, 30.4, 30.4, 30.0, 29.5],
  [29.8, 30.2, 30.4, 30.4, 30.4, 30.4, 30.4, 30.4, 30.4, 30.4, 30.4, 30.4, 30.4, 30.4, 30.3, 29.7, 29.2],
  [29.7, 30.2, 30.3, 30.3, 30.3, 30.4, 30.4, 30.3, 30.3, 30.2, 30.1, 30.1, 30.0, 29.9, 29.8, 29.5, 29.0],
  [29.7, 30.1, 30.3, 30.3, 30.2, 30.1, 30.0, 30.0, 29.9, 29.8, 29.7, 29.6, 29.6, 29.5, 29.4, 29.2, 28.8],
  [29.6, 30.0, 30.2, 30.1, 30.1, 30.0, 29.9, 29.8, 29.8, 29.7, 29.6, 29.5, 29.5, 29.4, 29.3, 29.1, 28.7],
  [29.7, 29.9, 30.1, 30.0, 29.9, 29.9, 29.8, 29.7, 29.6, 29.5, 29.4, 29.3, 29.3, 29.2, 29.1, 29.0, 28.7],
  [29.4, 30.0, 30.0, 29.9, 29.7, 29.6, 29.6, 29.5, 29.4, 29.3, 29.3, 29.2, 29.1, 29.0, 28.9, 28.9, 28.7],
  [29.3, 29.7, 29.9, 29.8, 29.7, 29.6, 29.4, 29.3, 29.2, 29.2, 29.1, 29.0, 28.9, 28.8, 28.8, 28.8, 28.7],
  [29.2, 29.7, 29.8, 29.7, 29.6, 29.5, 29.4, 29.3, 29.1, 29.0, 28.9, 28.8, 28.7, 28.6, 28.6, 28.6, 28.5],
  [29.2, 29.6, 29.7, 29.6, 29.5, 29.4, 29.3, 29.2, 29.0, 28.9, 28.8, 28.7, 28.6, 28.5, 28.4, 28.2, 28.0],
  [29.2, 29.4, 29.7, 29.5, 29.4, 29.3, 29.1, 29.0, 28.9, 28.8, 28.7, 28.5, 28.4, 28.3, 28.2, 28.0, 27.7],
  [29.2, 29.4, 29.7, 29.8, 29.3, 29.1, 29.0, 28.8, 28.7, 28.6, 28.5, 28.4, 28.2, 28.1, 28.0, 27.7, 27.2],
  [29.4, 29.5, 29.8, 29.9, 29.6, 29.2, 28.8, 28.7, 28.5, 28.4, 28.3, 28.2, 28.0, 27.8, 27.6, 27.1, 26.5],
  [29.5, 29.7, 29.8, 29.8, 29.7, 29.4, 29.0, 28.6, 28.4, 28.2, 28.0, 27.8, 27.5, 27.1, 26.7, 26.4, 26.4],
  [29.6, 29.7, 29.8, 29.8, 29.5, 29.1, 28.7, 28.3, 27.9, 27.5, 27.1, 26.8, 26.6, 26.5, 26.6, 26.6, 26.6],
] }
const NJ_END: GroundGrid = { y0: 684, x0: -24, step: 2, z: [
  [63.7, 63.7, 63.5, 63.4, 62.8, 62.4, 62.1, 62.1, 62.1, 62.1, 62.1, 62.0, 62.0, 62.0, 62.0, 62.0, 62.0, 62.2, 62.8, 63.0, 63.0, 62.8, 62.8, 62.9, 63.1],
  [65.2, 65.1, 64.7, 64.2, 63.8, 63.3, 62.9, 62.7, 62.7, 62.7, 62.6, 62.6, 62.6, 62.6, 62.6, 62.5, 62.8, 63.1, 63.4, 63.3, 63.1, 63.0, 63.0, 63.2, 63.8],
  [66.7, 66.3, 65.5, 64.8, 64.5, 64.2, 63.8, 63.4, 63.2, 63.2, 63.2, 63.2, 63.1, 63.1, 63.1, 63.2, 63.5, 63.7, 63.7, 63.5, 63.2, 63.0, 63.2, 63.6, 64.4],
  [68.0, 67.3, 65.9, 65.1, 64.9, 64.8, 64.6, 64.3, 63.9, 63.8, 63.7, 63.7, 63.7, 63.7, 63.7, 64.0, 64.1, 64.1, 63.9, 63.7, 63.4, 63.4, 63.7, 64.2, 65.0],
  [68.7, 67.9, 66.3, 65.3, 65.3, 65.2, 65.1, 64.9, 64.7, 64.5, 64.3, 64.2, 64.2, 64.3, 64.4, 64.5, 64.4, 64.3, 64.2, 63.9, 63.7, 63.8, 64.3, 64.9, 65.9],
  [69.0, 68.0, 66.6, 65.7, 65.6, 65.6, 65.5, 65.5, 65.3, 65.1, 65.0, 64.9, 64.9, 64.9, 65.0, 64.8, 64.8, 64.8, 64.7, 64.4, 64.3, 64.1, 64.9, 65.7, 67.6],
  [69.8, 68.3, 66.8, 66.5, 66.4, 66.7, 67.1, 67.3, 66.6, 67.3, 67.4, 66.8, 67.1, 67.7, 67.5, 67.3, 68.0, 68.2, 67.9, 67.6, 67.0, 65.4, 65.5, 66.8, 69.8],
  [71.4, 70.0, 68.6, 69.8, 70.4, 71.7, 72.4, 72.9, 73.4, 73.3, 73.0, 72.5, 73.2, 73.4, 73.1, 74.3, 74.2, 74.0, 74.2, 74.1, 72.1, 69.2, 67.5, 68.9, 72.4],
  [73.7, 73.6, 73.3, 74.5, 75.1, 75.7, 75.8, 76.0, 76.2, 76.0, 76.0, 76.0, 76.2, 76.1, 76.0, 76.1, 76.1, 76.1, 76.1, 76.2, 75.8, 74.2, 71.7, 72.1, 75.5],
  [76.5, 76.2, 76.2, 76.4, 76.5, 76.3, 76.2, 76.2, 76.3, 76.2, 76.3, 76.3, 76.3, 76.3, 76.3, 76.2, 76.2, 76.2, 76.1, 76.2, 76.5, 76.3, 75.2, 75.5, 78.5],
  [78.9, 77.1, 76.6, 76.6, 76.5, 76.3, 76.2, 76.2, 76.3, 76.3, 76.3, 76.3, 76.3, 76.3, 76.3, 76.3, 76.2, 76.2, 76.2, 76.3, 76.6, 76.6, 76.6, 77.4, 80.2],
  [79.8, 77.1, 76.7, 76.7, 76.6, 76.4, 76.3, 76.3, 76.3, 76.3, 76.3, 76.3, 76.4, 76.3, 76.3, 76.3, 76.3, 76.2, 76.2, 76.4, 76.6, 76.7, 76.7, 77.3, 80.3],
  [80.3, 77.4, 76.7, 76.7, 76.7, 76.4, 76.3, 76.3, 76.3, 76.3, 76.3, 76.4, 76.4, 76.4, 76.3, 76.3, 76.3, 76.3, 76.3, 76.4, 76.6, 76.7, 76.8, 77.3, 81.0],
  [81.2, 77.8, 76.8, 76.8, 76.7, 76.5, 76.3, 76.3, 76.3, 76.3, 76.3, 76.4, 76.4, 76.4, 76.4, 76.3, 76.3, 76.3, 76.3, 76.4, 76.6, 76.8, 76.8, 77.7, 82.1],
  [81.2, 77.5, 76.8, 76.8, 76.7, 76.5, 76.3, 76.4, 76.4, 76.4, 76.4, 76.4, 76.4, 76.4, 76.4, 76.4, 76.3, 76.3, 76.3, 76.4, 76.7, 76.9, 76.8, 77.7, 82.2],
  [81.0, 77.3, 76.8, 76.8, 76.8, 76.5, 76.4, 76.4, 76.4, 76.4, 76.4, 76.4, 76.5, 76.4, 76.3, 76.4, 76.4, 76.4, 76.4, 76.5, 76.8, 76.9, 76.8, 77.3, 82.1],
  [81.1, 77.7, 76.9, 76.8, 76.8, 76.6, 76.4, 76.4, 76.4, 76.4, 76.5, 76.5, 76.5, 76.4, 76.3, 76.4, 76.4, 76.4, 76.4, 76.6, 76.8, 76.8, 76.9, 77.5, 81.8],
  [82.0, 78.1, 76.9, 76.9, 76.8, 76.6, 76.5, 76.5, 76.5, 76.5, 76.5, 76.5, 76.6, 76.5, 76.5, 76.5, 76.4, 76.4, 76.4, 76.6, 76.8, 76.9, 76.9, 78.1, 82.1],
  [82.9, 78.1, 76.9, 76.9, 76.9, 76.7, 76.5, 76.5, 76.5, 76.5, 76.6, 76.6, 76.6, 76.5, 76.5, 76.5, 76.5, 76.5, 76.5, 76.6, 76.9, 76.9, 77.0, 78.0, 82.0],
  [82.7, 78.2, 77.0, 76.9, 76.9, 76.7, 76.6, 76.6, 76.6, 76.6, 76.6, 76.6, 76.6, 76.6, 76.6, 76.5, 76.5, 76.5, 76.5, 76.7, 76.9, 77.0, 76.9, 77.6, 81.4],
] }

/** The deck along a span: girder bands, soffits and sidewalks; with `detail`, trusses, railings and floor beams. */
function deck(span: [number, number], steel: Part, shade: Part, walk: Part, web: Part | null) {
  const ys = curve(span, web ? 20 : 50)
  for (const s of [-1, 1]) {
    const [i, o] = [s * SIDE, s * EDGE]
    const faces = { out: true, in: true, top: true, bottom: true, ends: true }
    band(steel, i, o, ys, (y) => road(y) - 0.3, underUpper, faces)
    band(steel, i, o, ys, (y) => lower(y) + PARAPET, underLower, faces)
    band(walk, s * WALK[0], s * WALK[1], ys, (y) => road(y) + WALK_UP, (y) => road(y) - 0.3, { top: true, in: true, ends: true })
    if (!web) continue
    // The open truss between the levels: a post at every panel point, one diagonal per panel, alternating.
    const xc = (s * (SIDE + EDGE)) / 2, ps = curve(span, PANEL), top = underUpper, bot = (y: number) => lower(y) + PARAPET
    for (let k = 0; k < ps.length; k++) {
      strip(web, [xc, ps[k], bot(ps[k])], [xc, ps[k], top(ps[k])], 0.45, [1, 0, 0])
      if (k + 1 < ps.length) {
        const [ya, yb] = k % 2 ? [ps[k], ps[k + 1]] : [ps[k + 1], ps[k]]
        strip(web, [xc, ya, bot(ya)], [xc, yb, top(yb)], 0.45, [1, 0, 0])
      }
    }
    // Railing on the sidewalk's outer edge: a top rail on posts.
    band(steel, s * (EDGE - 0.12), s * EDGE, ys, (y) => road(y) + 1.4, (y) => road(y) + 1.2)
    for (const y of stations(span[0], span[1], 7.6).slice(1, -1)) rod(steel, [s * (EDGE - 0.06), y, road(y) - 0.3], [s * (EDGE - 0.06), y, road(y) + 1.25], 0.07, 3)
  }
  // The undersides of both levels, facing down.
  band(shade, -SIDE, SIDE, ys, underUpper, underUpper, { bottom: true })
  band(shade, -SIDE, SIDE, ys, underLower, underLower, { bottom: true })
  if (web) for (const y of stations(span[0], span[1], 2 * PANEL).slice(1, -1))
    band(shade, -SIDE, SIDE, [y - 0.3, y + 0.3], () => underLower(y), () => underLower(y) - 0.7, { bottom: true, ends: true })
}

/**
 * Where each sidewalk leaves the deck over the New York anchorage, flaring
 * out to its stairs: OSM's ways 46593991 and 46593266 in this frame, [x, y],
 * from inside the sidewalk to the outline's end.
 */
const FLARES: [number, number][][] = [
  [[16.3, -710], [17.8, -721.9], [19.5, -733.8], [21, -745.7], [22, -757.7], [23, -769.6], [24.1, -781.6], [24.3, YM]],
  [[-15.7, -719.3], [-16.8, -731.3], [-17.9, -743.2], [-19, -755.2], [-20.1, -767.1], [-20.3, -779.1], [-20.4, YM]],
]
const FLARE_WIDTH = 3.0

/** Through a tower: the two undersides between its legs. */
function portal(t: number, shade: Part) {
  const ys = [t - FACE, t + FACE]
  for (const z of [underUpper, underLower]) band(shade, -14.8, 14.8, ys, z, z, { bottom: true })
}

/** A main cable, anchorage to rock, its ends running into the masonry and the cliff. */
const cablePath = (x: number, step: number): V3[] => [
  [x, NY_CABLE_END - 6, underLower(NY_CABLE_END) - 2],
  ...stations(NY_CABLE_END, NJ_CABLE_END, step).map((y) => [x, y, cable(y)] as V3),
  [x, CUT + 9, 75.5],
]

/** The New York anchorage: a block footed on the ground, a trough down its middle where the deck runs. */
function anchorage(p: Part) {
  const g = (x: number, y: number) => groundAt(NY_ANCHORAGE, x, y)
  const [Y0, Y1, Y2] = ANCHOR
  const W = 27.5, WF = 23.2, T = SIDE + 0.75
  const SHOULDER = 59.6                                    // lidar 58.7 m NAVD88
  const mid = (y: number) => underLower(y) - 0.25
  const high = () => SHOULDER, low = (_x: number, y: number) => mid(y)
  const wall = (a: [number, number], b: [number, number], n: V3, top: (x: number, y: number) => number = high) => footedWall(p, a, b, g, top, n)
  wall([-W, Y0], [-T, Y0], [0, -1, 0]); wall([-T, Y0], [T, Y0], [0, -1, 0], low); wall([T, Y0], [W, Y0], [0, -1, 0])
  for (const s of [-1, 1]) {
    wall([s * W, Y0], [s * W, Y1], [s, 0, 0])
    wall([s * W, Y1], [s * WF, Y1], [0, 1, 0])
    wall([s * WF, Y1], [s * WF, Y2], [s, 0, 0])
  }
  wall([-WF, Y2], [-T, Y2], [0, 1, 0]); wall([-T, Y2], [T, Y2], [0, 1, 0], low); wall([T, Y2], [WF, Y2], [0, 1, 0])
  const ys = stations(Y0, Y2, 6)
  for (const s of [-1, 1]) {
    band(p, s * T, s * W, stations(Y0, Y1, 6), () => SHOULDER, () => SHOULDER, { top: true })
    band(p, s * T, s * WF, stations(Y1, Y2, 6), () => SHOULDER, () => SHOULDER, { top: true })
    // The trough's walls, from the shoulders down to its floor.
    footedWall(p, [s * T, Y0], [s * T, Y2], low, high, [-s, 0, 0], 6)
  }
  band(p, -T, T, ys, mid, mid, { top: true })
}

/** The New Jersey cables' housings, a low concrete box round each pair where it enters the rock. */
function housings(p: Part) {
  const g = (x: number, y: number) => groundAt(NJ_END, x, y)
  for (const s of [-1, 1]) {
    const plan = chamferedRect(s > 0 ? 13.2 : -19.0, s > 0 ? 19.0 : -13.2, CUT, CUT + 12, 0.4)
    footedLoft(p, g, [{ plan, z: 'ground' }, { plan, z: 79.2 }], 3)
  }
}

if (import.meta.main) {
  const nyGround = (x: number, y: number) => groundAt(NY_TOWER, x, y)
  const towers = (simple: boolean): TowerParts => {
    const nj = { steel: new Part(), brace: new Part(), pier: new Part() }
    const ny = { steel: new Part(), brace: new Part(), pier: new Part() }
    tower(nj, road(TY), 4.5 + LIFT, undefined, simple)
    tower(ny, road(-TY), 5.1 + LIFT, nyGround, simple)
    const both = (k: keyof TowerParts) => merged(movedAlong(nj[k], TY), movedAlong(ny[k], -TY))
    return { steel: both('steel'), brace: both('brace'), pier: both('pier') }
  }
  const far = towers(true), near = towers(false)

  const steelLow = new Part(), shadeLow = new Part(), walkLow = new Part()
  const steelDetail = new Part(), shadeDetail = new Part(), walkDetail = new Part(), web = new Part()
  for (const span of spans) {
    deck(span, steelLow, shadeLow, walkLow, null)
    deck(span, steelDetail, shadeDetail, walkDetail, web)
  }
  for (const line of FLARES) for (const p of [walkLow, walkDetail]) ribbon(p, line.map(([x, y]) => [x, y, road(y) + WALK_UP] as V3), FLARE_WIDTH, WALK_UP + 0.3)
  for (const t of [-TY, TY]) for (const p of [shadeLow, shadeDetail]) portal(t, p)

  const cablesLow = new Part(), cablesDetail = new Part()
  for (const x of CABLES) {
    tube(cablesLow, cablePath(x, 60), CABLE_R, 5)
    tube(cablesDetail, cablePath(x, 12), CABLE_R, 8)
  }

  // Suspenders every 60 ft along each side, on the pair's two cables in turn, down to the girders.
  const wires = new Part()
  for (let k = -Math.ceil(-YM / HANGER); k * HANGER <= YN; k++) {
    const y = k * HANGER
    if (Math.abs(Math.abs(y) - TY) < FACE + 6 || y < NY_CABLE_END + 20 || y > NJ_CABLE_END - 10) continue
    for (const s of [-1, 1]) {
      const x = CABLES[s > 0 ? 2 + (k & 1) : 1 - (k & 1)]
      const z0 = road(y) - 0.3, z1 = cable(y) - CABLE_R * 0.6
      if (z1 - z0 > 2) rod(wires, [x, y, z0], [x, y, z1], 0.22, 4)
    }
  }

  const masonry = new Part(), concreteLow = new Part()
  anchorage(masonry)
  housings(concreteLow)

  const STEEL: Swatch = finish('gwb-steel', 0xbfc5ca)
  const BRACE: Swatch = finish('gwb-steel-shade', 0xa5adb4)
  const CONCRETE: Swatch = finish('pier-concrete', 0xd2cabb)
  const GRANITE: Swatch = finish('granite', 0xc9bfae)
  const low = [
    { part: merged(far.steel, steelLow, cablesLow), material: STEEL },
    { part: merged(far.brace, shadeLow), material: BRACE },
    { part: merged(far.pier, concreteLow, walkLow), material: CONCRETE },
    { part: masonry, material: GRANITE },
  ]
  const detail = [
    { part: merged(near.steel, steelDetail, web, cablesDetail), material: { ...STEEL, doubleSided: true } },
    { part: merged(near.brace, shadeDetail), material: BRACE },
    { part: merged(near.pier, concreteLow, walkDetail), material: CONCRETE },
    { part: masonry, material: GRANITE },
    // Last: a map draws wires by their coverage, blending them over what is already drawn.
    { part: wires, material: { name: 'wire-steel', color: 0xbfc5ca } },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
    datum: 'z = NAVD88 + 0.88, the map terrain\'s reading of the Hudson', bearing: 284.46, elevation: 0,
    towers: [-TY, TY], ends: [YM, YN],
    roadwayCrest: road(110), roadwayAtTowers: [road(-TY), road(TY)], roadwayEnds: [road(YM), road(YN)], lowerLevelBelow: LEVEL,
  }
  for (const [file, list, maxTris, maxBytes] of [
    ['nyc-george-washington-bridge.glb', low, 6500, 250 * 1024],
    ['nyc-george-washington-bridge.detail.glb', detail, 40000, 1536 * 1024],
  ] as const) {
    const tris = countParts([...list])
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('George Washington Bridge', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
