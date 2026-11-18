/**
 * Sheikh Zayed Grand Mosque, Abu Dhabi (1994-2007; design led by Yusef
 * Abdelki): procedural, CC0-1.0.
 * bun generators/abu-dhabi-sheikh-zayed-grand-mosque.ts
 *
 * Writes two levels of detail in the same frame and materials:
 * - models/abu-dhabi-sheikh-zayed-grand-mosque.glb (low, under 6,500
 *   triangles), drawn below zoom 16: the domes, the four minarets with their
 *   gold balconies, the hall and the galleries. The galleries keep real
 *   arches cut through their walls, but one opening stands for three real
 *   bays (STYLE.md: thin repeated members at reduced density in a low
 *   model), with a shaded screen down each gallery's middle for its depth;
 *   a bold sawtooth cresting on the galleries, hall front and gate; real
 *   arched recesses on every other facet of the main drum and every fourth
 *   of the side drums.
 * - models/abu-dhabi-sheikh-zayed-grand-mosque.detail.glb (under 40,000),
 *   from zoom 16: every gallery bay at its ~5 m rhythm (170 bays), each a
 *   keyhole (horseshoe) arch cut through both walls of the gallery, paired
 *   marble columns with gold capitals as solids under every pier, shaded
 *   ceilings and floors, pointed merlons every 1.7 m (real about 1.4 m) on
 *   every roof edge, the main and side drums as rings of real arched
 *   openings, the crescent finials, the hall's pointed iwan and portals as
 *   deep shaded recesses, the gate passages, and the minarets' lanterns.
 *
 * Domes (lead review, round 1): onion/Mughal profile from o06, o43 and o77
 * (jemasmith's "Gold crescents" close-up): a short drum, a slight pinch,
 * the bulge overhanging the drum a third of the way up (max radius 1.15x
 * the drum's), then a long taper to a pointed crown; rise about 0.65 of
 * the width for the main dome, 0.7 for the gallery domes.
 *
 * Frame: built along the mosque's axis and placed at bearing 77.5, so model
 * +y runs from the qibla wall (west-south-west) through the prayer hall and
 * the courtyard to the east gate, and +x is the south-south-east side.
 * Bearing from the long sides of the OSM outline (relation/1635169, outer
 * way 93045372), which run at 77.4-77.7 and 347.4-347.6; Wikipedia gives
 * the axis as about 12 degrees south of west. Origin: the outline's
 * centroid, 54.474964, 24.4124059. The mosque's own axis (the mihrab point,
 * the east gate, the courtyard and the line of OSM domes) runs 1.5 m west
 * of the centroid in this frame, so everything is built symmetric about
 * x = AX = -1.5.
 *
 * Plan (OSM, measured in the turned frame, about the axis): outer walls
 * +-86.3 (OSM -84.2 / +88.5, averaged), the qibla wall at y -110.2, the
 * east wall at +109.5; the mihrab block to -123.8 and its point to -126.3;
 * the east gate (+-23.5) and the two east corner blocks (69.5-91.5) to
 * +115.5; the side pavilions (y -92 to -70) to +-91.4. Courtyard (OSM inner
 * way 391867879): +-72.5, y -22.5 to +96.6. Minarets (OSM ways 118727327,
 * 118727328, 118727329, 118727334, man_made=tower): the courtyard's four
 * corners, (+-72.5, -22.3) and (+-72.5, +96.5). Domes (42 OSM
 * building:part=dome inside the outline): main dome (0, -81.5); side domes
 * (+-46, -78), 26 m circles; front dome (0, -37.6), 16 m; mihrab dome
 * (0, -113), 14 m; side-pavilion domes (+-81, -81), 14 m; gate dome
 * (0, 105.6), 13 m; gallery domes, 10 m, along the side galleries and at
 * +-30.5/45.5/60.5 on the front portico and the east gallery. OSM's dome
 * positions scatter 2-3 m about the axis and are mirrored here; the two
 * gallery domes next to the minarets are moved 2-3 m clear of them.
 *
 * Heights and sizes. Published: main dome 32.8 m across (Arab News; SZGMC
 * "The Domes" page: 32.6 m and 84 m), about 85 m high (OSM 85), modelled as
 * a 32.8 m dome whose gold finial tops out at 84.4 m; minarets about 107 m
 * (Wikipedia; its infobox and OSM say 104), modelled to the crescent tip at
 * 107; 82 domes and more than 1,000 columns (Wikipedia). Estimated from
 * photos (scaled by the minaret's 10.4 m shaft, OSM's dome circles and the
 * courtyard's OSM width): minaret square shaft to 46 m, octagon to 63,
 * balconies at 67.5, 86 and 94 m, gold ball at 101 (o44, o76, o53); gallery
 * walls 15.2 m, merlons to 18.4 (o44: 14.5-15.2 and 17.3-18.2; o15: a little
 * lower); arches on a ~5 m bay (o15 and o18: 9-10 arches between the
 * minaret and the east gate, about 3.7 per dome spacing), 3.1 m at the
 * neck, 4.1 m across the horseshoe, crowns at 9.8 m, gold capitals up to
 * the springing (o36, c02); gallery domes crowns 28 m (OSM's 43 m is too
 * tall against o44 and o76); main dome: platform to 45 m, drum 45-54.3,
 * crown 76; side domes: platforms to 34, drums 34-41.2, crowns 59 (OSM 65 to
 * the finial); hall walls 22 m, upper
 * stage 27.5, mihrab block 26.5 with chamfered corners and four slit
 * windows (o06); front entrance block 33 m (OSM height 33; o41, o43) with
 * a deep pointed iwan (9.2 m wide, crown 18, 4.5 m deep) and two pointed
 * portals (4 m, crown 12.5, 2.4 m deep), shaded inside with the doors only
 * at their foot, between pylons standing 1.6 m proud and 3 m above the block
 * (o41, o43);
 * front and mihrab domes, crowns about 47 and 42; side pavilions 30 m
 * (o37); the four towers at the hall's front, 36 m (o41, o43); the east
 * gate (o15, o18): pylons 26.5 m with small domes, centre 26 m with a
 * 7.2 m wide, 15 m high open keyhole passage, links 21.5 m with 3.8 m
 * passages, widths from o15 fitted to OSM's 47 m; east corner blocks 22 m
 * (o76). Floor: the building stands on a podium about 0.8 m above the
 * gardens (steps in o37), and the courtyard is part of the model as the
 * podium's top. Its floral inlay is flat colour, too fine to read at map
 * scale, and is left white. The reflecting pools are water on the map and
 * are not modelled.
 *
 * Counted here (detail): 70 domes (with the minarets' caps; the real 82
 * include roof kiosks and the 14 glass ablution domes this model leaves
 * out), 4 minarets, 170 gallery bays, 340 columns.
 *
 * Colour: marble #f7f6f2 on every outer wall and dome (sunlit marble
 * samples #f5f2ee, o44); flat roofs #ebe8e2, near white; gold #c9a14c
 * (capitals, o36 and c02); shade #a6a39c only inside recesses: gallery
 * interiors, ceilings and floors, portal and drum reveals, which is how they
 * read in o43 and o18; doors gold-brown (o43).
 *
 * Night: the mosque is floodlit; marble carries a _FLOODLIGHT wash, the
 * gallery interiors glow (they are lit, o-night views), windows glow, the
 * doors are `entrance`, gold catches the light. The projected blue-grey
 * clouds are not modelled.
 *
 * Elevation 0. Map terrain: Mapterhorn here is only available at z12 and is
 * a surface model that contains the mosque itself (a 25 m bump over a flat
 * site), so `terrain.ts check --zoom 12` reports the 0.8 m podium top as up
 * to 2.7 m under the drawn ground even after the fill. The site is flat
 * coastal plain in every photo; the model is kept true to the photos.
 *
 * Photos (all EVIDENCE; Flickr via Openverse unless noted):
 * - o01 "Sheikh Zayed Grand Mosque Abu Dhabi", ToGa Wanderings, CC BY 2.0, https://www.flickr.com/photos/69031678@N00/23124197379 (south side, minaret)
 * - o06 "Sheikh Zayed grand mosque", arripay, CC BY-SA 2.0, https://www.flickr.com/photos/27466406@N00/8170052485 (qibla side)
 * - o07 "Sheikh Zayed Grand Mosque", david.gill12, CC BY 2.0, https://www.flickr.com/photos/36398463@N04/16509992640 (outer gallery, panorama)
 * - o09 "Sheikh Zayed Grand Mosque", Rob Alter, CC BY 2.0, https://www.flickr.com/photos/8962474@N05/5586005193 (hall from the west corner)
 * - o10 / o15 / o18 / o53 "Sheikh Zayed Mosque (Abu Dhabi - UAE)", Abdul Awaes, CC BY 2.0, https://www.flickr.com/photos/21578258@N07/5183117666, .../5182517489, .../5183116630, .../5183119152 (east gate, courtyard, minaret)
 * - o36 "Sheikh Zayed Grand Mosque: Colonade and Reflecting Pool", andryn2006, CC BY-SA 2.0, https://www.flickr.com/photos/84985982@N00/17352270175 (keyhole arches, paired columns)
 * - o37 "Sheikh Zayed grand mosque", arripay, CC BY-SA 2.0, https://www.flickr.com/photos/27466406@N00/8170088112 (south side)
 * - o41 "Sheikh Zayed Grand Mosque @ Abu Dhabi", *_*, CC BY 2.0, https://www.flickr.com/photos/22539273@N00/16018362686 (hall from the courtyard)
 * - o43 "Sheikh Zayed, Grand Mosque, Abu Dhabi", Jenny Mackness, CC BY 2.0, https://www.flickr.com/photos/53375223@N00/2417119800 (hall front, frontal)
 * - o44 "Abu Dhabi - 065", Kyle Taylor, Dream It. Do It., CC BY 2.0, https://www.flickr.com/photos/95672737@N00/10884478556 (minaret and courtyard gallery)
 * - o76 "Minaret, Grand Mosque, Abu Dhabi, UAE.", jemasmith, CC BY 2.0, https://www.flickr.com/photos/26085795@N02/3908709741 (minaret stages)
 * - c02 "Abu dhabi, Moschea dello Sceicco Zayed, loggiati, pilastri, capitelli dorati 01 a palmizio.jpg", Francesco Bini, CC BY-SA 4.0, Wikimedia Commons (gold palm capitals)
 * Look-only (looked at for orientation, not relied on for any shape or colour):
 * - "Sheikh-Zayed-Grand-Mosque-Aerial-View", atifnadzir (photo Beno Saradzic), CC BY-ND 2.0, https://www.flickr.com/photos/78863431@N03/16474786640
 * Facts: https://en.wikipedia.org/wiki/Sheikh_Zayed_Grand_Mosque ; https://szgmc.gov.ae/en/domes1 ; https://www.arabnews.com/node/367756
 *
 * Doubts: no open aerial or plan, so the hall's roof (the upper stage, the
 * platforms under the domes, the kiosks) rests on oblique ground photos;
 * the towers at the hall's front (4) are placed from o41 and o43 only; the
 * gallery height and bay differ by up to 15% between photos (15.2 m and
 * 5 m used); the domes other than the main dome are photo estimates; the
 * podium height is estimated from steps; OSM's outline is 2-4 m
 * asymmetric about the axis and the model is symmetric; the flat roofs'
 * colour is a guess.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 77.5
const AX = -1.5 // the mosque's axis in the model's x
const FL = 0.8 // podium / floor level

type Mats = { marble: Part; roof: Part; gold: Part; win: Part; door: Part; shade: Part }

// ---------------------------------------------------------------------------
// Geometry helpers. Local coordinates: u across (axis at u = 0), y along the
// axis, z up. Every face is given its outward normal; Part.tri winds it.

const TAU = Math.PI * 2
type P2 = [number, number]
const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
const W = (p: V3): V3 => [p[0] + AX, p[1], p[2]]

function tri(p: Part, a: V3, b: V3, c: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3]
  p.tri(W(a), W(b), W(c), [0, 0], [0, 0], [0, 0], ns.map(norm))
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const ns = Array.isArray(n[0]) ? (n as V3[]) : [n as V3, n as V3, n as V3, n as V3]
  tri(p, a, b, c, [ns[0], ns[1], ns[2]])
  tri(p, a, c, d, [ns[0], ns[2], ns[3]])
}
function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) tri(p, pts[0], pts[i], pts[i + 1], n)
}

/** Surface of revolution about the vertical axis at (cx, cy); prof = [r, z] bottom to top. */
function lathe(p: Part, cx: number, cy: number, prof: P2[], n: number, o: { smooth?: boolean; phase?: number } = {}) {
  const ph = o.phase ?? 0
  const segN = prof.slice(0, -1).map((q, k) => {
    const dr = prof[k + 1][0] - q[0], dz = prof[k + 1][1] - q[1]
    const l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as P2
  })
  const vN = (k: number, seg: number): P2 => {
    if (!o.smooth) return segN[seg]
    const a = segN[Math.max(0, k - 1)], b = segN[Math.min(segN.length - 1, k)]
    const r = a[0] + b[0], z = a[1] + b[1], l = Math.hypot(r, z) || 1
    return [r / l, z / l]
  }
  const at = (r: number, z: number, t: number): V3 => [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
  const nn = (q: P2, t: number): V3 => [q[0] * Math.cos(t), q[0] * Math.sin(t), q[1]]
  for (let i = 0; i < n; i++) {
    const t0 = ph + (TAU * i) / n, t1 = ph + (TAU * (i + 1)) / n
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      if (r0 < 1e-6 && r1 < 1e-6) continue
      const A = at(r0, z0, t0), B = at(r0, z0, t1), C = at(r1, z1, t1), D = at(r1, z1, t0)
      const nA = nn(vN(k, k), t0), nB = nn(vN(k, k), t1), nC = nn(vN(k + 1, k), t1), nD = nn(vN(k + 1, k), t0)
      if (r0 < 1e-6) tri(p, A, C, D, [nA, nC, nD])
      else if (r1 < 1e-6) tri(p, A, B, C, [nA, nB, nC])
      else quad(p, A, B, C, D, [nA, nB, nC, nD])
    }
  }
}

/** A vertical prism over a convex ring (counter-clockwise from above). */
function prism(side: Part | null, top: Part | null, ring: P2[], z0: number, z1: number, bottom: Part | null = null) {
  for (let i = 0; side && i < ring.length; i++) {
    const j = (i + 1) % ring.length
    const [ax, ay] = ring[i], [bx, by] = ring[j]
    quad(side, [ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1], [by - ay, -(bx - ax), 0])
  }
  if (top) face(top, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) face(bottom, [...ring].reverse().map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
const rect = (u0: number, u1: number, y0: number, y1: number, b = 0): P2[] =>
  b > 0
    ? [[u0 + b, y0], [u1 - b, y0], [u1, y0 + b], [u1, y1 - b], [u1 - b, y1], [u0 + b, y1], [u0, y1 - b], [u0, y0 + b]]
    : [[u0, y0], [u1, y0], [u1, y1], [u0, y1]]
function box(side: Part, top: Part | null, u0: number, u1: number, y0: number, y1: number, z0: number, z1: number, b = 0, bottom: Part | null = null) {
  prism(side, top, rect(u0, u1, y0, y1, b), z0, z1, bottom)
}
/** Mirror a builder across the axis (u -> -u). */
const both = (f: (s: number) => void) => { f(1); f(-1) }

// A wall plane: origin o on the face line, unit tangent t, outward normal n.
type Plane = { o: P2; t: P2; n: P2 }
const plane = (o: P2, t: P2, n: P2): Plane => ({ o, t, n })
const at = (pl: Plane, s: number, z: number, d = 0): V3 => [pl.o[0] + pl.t[0] * s + pl.n[0] * d, pl.o[1] + pl.t[1] * s + pl.n[1] * d, z]
const nrm = (pl: Plane, k = 1): V3 => [pl.n[0] * k, pl.n[1] * k, 0]

/** A flat panel on a wall (within 0.06 m of it): rectangle with optional semicircular head. */
function panel(p: Part, pl: Plane, s: number, z0: number, w: number, h: number, arch = true, segs = 6, d = 0.06) {
  const r = w / 2, zs = arch ? z0 + h - r : z0 + h
  const n = nrm(pl)
  quad(p, at(pl, s - r, z0, d), at(pl, s + r, z0, d), at(pl, s + r, zs, d), at(pl, s - r, zs, d), n)
  if (arch) for (let i = 0; i < segs; i++) {
    const a0 = Math.PI - (Math.PI * i) / segs, a1 = Math.PI - (Math.PI * (i + 1)) / segs
    tri(p, at(pl, s, zs, d), at(pl, s + r * Math.cos(a0), zs + r * Math.sin(a0), d), at(pl, s + r * Math.cos(a1), zs + r * Math.sin(a1), d), n)
  }
}

/**
 * The face of a wall bay [x0, x1] x [zs, H] with an arch cut through it.
 * `arc` runs from the left jamb's top (on zs) over the crown to the right
 * jamb's top, and must be star-shaped seen from (ox, oz). The face is tiled
 * by quads between arch points and the points on the bay's outline seen
 * along the same rays.
 */
function archFaceP(p: Part, pl: Plane, d: number, k: number, x0: number, x1: number, zs: number, H: number, arc: P2[], ox: number, oz: number) {
  const ang = (q: P2) => Math.atan2(q[0] - ox, q[1] - oz)
  const corners = [ang([x0, zs]), ang([x0, H]), ang([x1, H]), ang([x1, zs])]
  const pts: [number, P2][] = arc.map((q) => [ang(q), q])
  for (const c of corners) {
    for (let j = 0; j < pts.length - 1; j++) {
      const [a0, q0] = pts[j], [a1, q1] = pts[j + 1]
      if (c > a0 + 1e-9 && c < a1 - 1e-9) {
        const t = (c - a0) / (a1 - a0)
        pts.splice(j + 1, 0, [c, [q0[0] + (q1[0] - q0[0]) * t, q0[1] + (q1[1] - q0[1]) * t]])
        break
      }
    }
  }
  const R = (q: number): P2 => {
    if (q <= corners[0]) return [x0, zs]
    if (q >= corners[3]) return [x1, zs]
    const sx = Math.sin(q), cz_ = Math.cos(q)
    let tBest = Infinity
    if (sx < -1e-9) tBest = Math.min(tBest, (x0 - ox) / sx)
    if (sx > 1e-9) tBest = Math.min(tBest, (x1 - ox) / sx)
    if (cz_ > 1e-9) tBest = Math.min(tBest, (H - oz) / cz_)
    return [ox + sx * tBest, oz + cz_ * tBest]
  }
  const n = nrm(pl, k)
  const P = (q: P2) => at(pl, q[0], q[1], d)
  const same = (a: P2, b: P2) => Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6
  // the corners below the first and last rays, when the origin sits under the springing
  const r0 = R(pts[0][0]), rN = R(pts[pts.length - 1][0])
  if (!same(r0, [x0, zs])) tri(p, P([x0, zs]), P(pts[0][1]), P(r0), n)
  if (!same(rN, [x1, zs])) tri(p, P([x1, zs]), P(rN), P(pts[pts.length - 1][1]), n)
  for (let i = 0; i < pts.length - 1; i++) {
    if (pts[i + 1][0] - pts[i][0] < 1e-9) continue
    const a0 = pts[i][1], a1 = pts[i + 1][1], ra = R(pts[i][0]), rb = R(pts[i + 1][0])
    if (same(ra, rb)) tri(p, P(a0), P(a1), P(ra), n)
    else quad(p, P(a0), P(a1), P(rb), P(ra), n)
  }
}
/** Keyhole (horseshoe) arch points: circle (cx, cz, r) meeting zs at cx +- half. */
function keyhole(cx: number, cz: number, r: number, half: number, seg: number): P2[] {
  const psiJ = Math.PI - Math.asin(Math.min(1, half / r))
  const out: P2[] = []
  for (let i = 0; i <= seg; i++) {
    const q = -psiJ + (2 * psiJ * i) / seg
    out.push([cx + r * Math.sin(q), cz + r * Math.cos(q)])
  }
  return out
}
/** Pointed (two-centred) arch points over jambs at cx +- hw, springing zs. */
function pointed(cx: number, zs: number, hw: number, seg: number, e = 0.55): P2[] {
  const R = hw * (1 + e), off = hw * e, ta = Math.acos(off / R), m = Math.max(2, Math.round(seg / 2))
  const left: P2[] = []
  for (let i = 0; i <= m; i++) {
    const t = Math.PI - ((Math.PI - ta) * i) / m
    left.push([cx + off + R * Math.cos(t), zs + R * Math.sin(t)])
  }
  const right = left.slice(0, -1).reverse().map(([x, z]) => [2 * cx - x, z] as P2)
  return [...left, ...right]
}
function archFace(p: Part, pl: Plane, d: number, k: number, x0: number, x1: number, zs: number, H: number,
  cx: number, cz: number, r: number, half: number, seg: number): P2[] {
  const arc = keyhole(cx, cz, r, half, seg)
  archFaceP(p, pl, d, k, x0, x1, zs, H, arc, cx, cz)
  return arc
}

/**
 * A block face from s = 0 to L, up to H, with portals cut into it. A niche
 * portal is a recess `deep` metres deep, shaded inside, with a door at its
 * back up to `door`; a `pass` portal goes right through to the face `depth`
 * behind (drawn too), as a shaded passage. Heads are keyhole or pointed.
 */
type Portal = { s: number; hw: number; crown: number; pass?: boolean; pointed?: boolean; deep?: number; door?: number }
function portalFace(M: Mats, D: boolean, pl: Plane, L: number, H: number, holes: Portal[], depth = 0) {
  const back = plane(at(pl, L, 0, -depth) as unknown as P2, [-pl.t[0], -pl.t[1]], [-pl.n[0], -pl.n[1]])
  const cuts = [0, ...holes.slice(1).map((h, i) => (holes[i].s + holes[i].hw + h.s - h.hw) / 2), L]
  holes.forEach((h, i) => {
    const seg = D ? 10 : 4
    // springing and arch points for this head, in face coordinates about sc
    const head = (sc: number): { zs: number; arc: P2[]; ox: number; oz: number } => {
      if (h.pointed) {
        const zs = h.crown - h.hw * Math.sqrt(1.55 * 1.55 - 0.55 * 0.55)
        return { zs, arc: pointed(sc, zs, h.hw, seg), ox: sc, oz: zs - 0.4 * h.hw }
      }
      const r = h.hw * 1.15, cz = h.crown - r
      return { zs: cz - Math.sqrt(r * r - h.hw * h.hw), arc: keyhole(sc, cz, r, h.hw, seg), ox: sc, oz: cz }
    }
    const faces: [Plane, number, number][] = [[pl, cuts[i], cuts[i + 1]]]
    if (h.pass) faces.push([back, L - cuts[i + 1], L - cuts[i]])
    let pts: P2[] = [], zs = 0
    for (const [p, x0, x1] of faces) {
      const sc = p === pl ? h.s : L - h.s
      const hd = head(sc)
      quad(M.marble, at(p, x0, FL, 0), at(p, sc - h.hw, FL, 0), at(p, sc - h.hw, hd.zs, 0), at(p, x0, hd.zs, 0), nrm(p))
      quad(M.marble, at(p, sc + h.hw, FL, 0), at(p, x1, FL, 0), at(p, x1, hd.zs, 0), at(p, sc + h.hw, hd.zs, 0), nrm(p))
      archFaceP(M.marble, p, 0, 1, x0, x1, hd.zs, H, hd.arc, hd.ox, hd.oz)
      if (p === pl) { pts = hd.arc; zs = hd.zs }
    }
    const dpt = h.pass ? -depth : -(h.deep ?? 1.6)
    const mid = (pts[0][1] + h.crown) / 2
    for (let j = 0; j < pts.length - 1; j++) {
      const [s0, z0] = pts[j], [s1, z1] = pts[j + 1]
      const n0: V3 = [pl.t[0] * (h.s - s0), pl.t[1] * (h.s - s0), mid - z0], n1: V3 = [pl.t[0] * (h.s - s1), pl.t[1] * (h.s - s1), mid - z1]
      quad(M.shade, at(pl, s0, z0, 0), at(pl, s0, z0, dpt), at(pl, s1, z1, dpt), at(pl, s1, z1, 0), [n0, n0, n1, n1])
    }
    const tR: V3 = [pl.t[0], pl.t[1], 0], tL: V3 = [-pl.t[0], -pl.t[1], 0]
    quad(M.shade, at(pl, h.s - h.hw, FL, 0), at(pl, h.s - h.hw, FL, dpt), at(pl, h.s - h.hw, zs, dpt), at(pl, h.s - h.hw, zs, 0), tR)
    quad(M.shade, at(pl, h.s + h.hw, FL, 0), at(pl, h.s + h.hw, zs, 0), at(pl, h.s + h.hw, zs, dpt), at(pl, h.s + h.hw, FL, dpt), tL)
    if (!h.pass) {
      // back of the recess in shade, the door in gold-brown at its foot
      const db = dpt, n = nrm(pl)
      const ring: P2[] = [[h.s - h.hw, FL], ...pts, [h.s + h.hw, FL]]
      for (let j = 1; j < ring.length - 1; j++) tri(M.shade, at(pl, h.s, FL, db), at(pl, ring[j][0], ring[j][1], db), at(pl, ring[j + 1][0], ring[j + 1][1], db), n)
      tri(M.shade, at(pl, h.s, FL, db), at(pl, ring[0][0], ring[0][1], db), at(pl, ring[1][0], ring[1][1], db), n)
      const dw = Math.min(h.hw * 0.75, 3.2), dh = h.door ?? Math.min(zs - FL, 6)
      quad(M.door, at(pl, h.s - dw, FL, db + 0.05), at(pl, h.s + dw, FL, db + 0.05), at(pl, h.s + dw, FL + dh, db + 0.05), at(pl, h.s - dw, FL + dh, db + 0.05), n)
    }
  })
}

// ---------------------------------------------------------------------------
// Domes and finials.

/** Onion-tending dome, from photos: widest a quarter up, a soft point. */
function onion(rb: number, rm: number, H: number, pick: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8]): P2[] {
  // a slight pinch over the drum, the bulge overhanging it a third of the
  // way up, then a long taper to a pointed crown (o06, o43, o77)
  const all: P2[] = [[rb, 0], [rb * 0.97, 0.035 * H], [rm * 0.95, 0.14 * H], [rm, 0.32 * H], [rm * 0.97, 0.48 * H],
    [rm * 0.87, 0.64 * H], [rm * 0.66, 0.8 * H], [rm * 0.36, 0.93 * H], [0, H]]
  return pick.map((i) => all[i])
}
const RINGS = { full: [0, 1, 2, 3, 4, 5, 6, 7, 8], mid: [0, 1, 2, 3, 5, 6, 7, 8], small: [0, 1, 3, 4, 5, 6, 7, 8], smaller: [0, 1, 3, 5, 7, 8], low: [0, 1, 3, 5, 7, 8], tiny: [0, 1, 3, 5, 7, 8], dot: [0, 3, 6, 8], bulb: [0, 3, 8] }

/** A gold finial standing on z: stacked bulbs, a spike and (in detail) a crescent. h = total height. */
function finial(M: Mats, D: boolean, cx: number, cy: number, z: number, h: number, crescent = true) {
  const k = h / 8.5
  const big = h > 3
  const prof: P2[] = D
    ? big
      ? [[0.95, 0], [0.35, 0.75], [0.95, 2.2], [1.05, 2.8], [0.3, 4.0], [0.65, 4.9], [0.12, 6.0], [0, 6.85]]
      : h > 1.5 ? [[0.95, 0], [1.0, 2.6], [0.3, 4.0], [0, 6.85]] : [[0.6, 0], [0, 8.5]]
    : big ? [[0.9, 0], [1.0, 2.6], [0.3, 4.0], [0, 6.85]] : [[0.6, 0], [0, 8.5]]
  lathe(M.gold, cx, cy, prof.map(([r, zz]) => [r * k, z + zz * k] as P2), D ? (big ? 8 : h > 1.5 ? 6 : 4) : big ? 6 : 4, { smooth: true })
  if (D && crescent) crescentAt(M.gold, cx, cy, z + 7.6 * k, 0.85 * k, 0.12 * k)
}

/** A crescent, horns up, in the u-z plane, centred at (cx, cy, zc). */
function crescentAt(p: Part, cx: number, cy: number, zc: number, R: number, e: number) {
  const m = 6, th = (2.3 * Math.PI) / 4, Wd = R * 0.42
  const O: P2[] = [], I: P2[] = []
  for (let i = 0; i <= m; i++) {
    const q = -th + (2 * th * i) / m
    const ou: P2 = [R * Math.sin(q), -R * Math.cos(q)]
    const w = Wd * Math.cos((q / th) * (Math.PI / 2))
    O.push(ou)
    I.push([ou[0] * (1 - w / R), ou[1] * (1 - w / R)])
  }
  const P = (q: P2, y: number): V3 => [cx + q[0], cy + y, zc + q[1]]
  for (let i = 0; i < m; i++) {
    quad(p, P(O[i], -e), P(O[i + 1], -e), P(I[i + 1], -e), P(I[i], -e), [0, -1, 0])
    quad(p, P(O[i], e), P(I[i], e), P(I[i + 1], e), P(O[i + 1], e), [0, 1, 0])
    const no = (q: P2): V3 => [q[0], 0, q[1]]
    quad(p, P(O[i], -e), P(O[i], e), P(O[i + 1], e), P(O[i + 1], -e), [no(O[i]), no(O[i]), no(O[i + 1]), no(O[i + 1])])
    const ni = (q: P2): V3 => [-q[0], 0, -q[1]]
    quad(p, P(I[i], -e), P(I[i + 1], -e), P(I[i + 1], e), P(I[i], e), [ni(I[i]), ni(I[i + 1]), ni(I[i + 1]), ni(I[i])])
  }
}

/**
 * A dome on a drum: drum from z0 to zs (radius rb, with arched windows),
 * a lip ring, the dome (max radius rm, rise H) and a gold finial of height f.
 */
function domeOnDrum(M: Mats, D: boolean, cx: number, cy: number, z0: number, zs: number, rb: number, rm: number, H: number,
  f: number, nAround: number, windows = 0, crescent = true, rings: number[] = D ? RINGS.full : RINGS.low, arcade = 0) {
  const n = nAround
  // drum: plain, or an arcade of real arched openings every `arcade` facets
  if (arcade > 0) drumArcade(M, D, cx, cy, z0, zs, rb, n, arcade)
  else if (zs - z0 > 0.01) lathe(M.marble, cx, cy, [[rb, z0], [rb, zs]], n, { phase: Math.PI / n })
  // lip under the dome
  if (rb > 6 && D) lathe(M.marble, cx, cy, rb > 12 ? [[rb, zs - 0.35], [rb + 0.35, zs - 0.15], [rb + 0.35, zs + 0.05], [rb, zs + 0.2]] : [[rb + 0.35, zs - 0.15], [rb + 0.35, zs + 0.2]], n, { phase: Math.PI / n })
  lathe(M.marble, cx, cy, onion(rb, rm, H, rings).map(([r, z]) => [r, zs + 0.2 + z] as P2), n, { smooth: true, phase: Math.PI / n })
  finial(M, D, cx, cy, zs + 0.2 + H - 0.15, f, crescent)
  if (windows > 0 && arcade === 0) {
    const ap = (rb * Math.cos(Math.PI / n))
    const fw = 2 * rb * Math.sin(Math.PI / n)
    const h = zs - z0
    for (let i = 0; i < n; i += n / windows) {
      const t = (TAU * i) / n + Math.PI / n + Math.PI / n
      const c: P2 = [cx + ap * Math.cos(t), cy + ap * Math.sin(t)]
      const pl = plane(c, [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)])
      panel(M.win, pl, 0, z0 + h * 0.18, Math.min(fw * 0.6, h * 0.45), h * 0.64, true, D ? 5 : 3)
    }
  }
}

/**
 * A drum as an arcade: n flat facets; every `every`-th one has a real arched
 * opening 0.9 m deep (round head, sill, jambs and soffit), the rest are
 * solid. A shaded core behind the openings closes the view.
 */
function drumArcade(M: Mats, D: boolean, cx: number, cy: number, z0: number, zs: number, r: number, n: number, every: number) {
  const ap = r * Math.cos(Math.PI / n), fw = 2 * r * Math.sin(Math.PI / n), h = zs - z0
  const T = 0.9, seg = D ? 6 : 3
  for (let i = 0; i < n; i++) {
    const t = (TAU * i) / n
    const pl = plane([cx + ap * Math.cos(t), cy + ap * Math.sin(t)], [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)])
    const x0 = -fw / 2, x1 = fw / 2, nn = nrm(pl)
    if (i % every) {
      quad(M.marble, at(pl, x0, z0), at(pl, x1, z0), at(pl, x1, zs), at(pl, x0, zs), nn)
      continue
    }
    const hw = Math.min(fw * (every > 1 ? 0.34 : 0.3), h * 0.22), zb = z0 + h * 0.14, zsp = z0 + h * 0.62
    const arc = keyhole(0, zsp, hw * 1.0001, hw, seg)
    quad(M.marble, at(pl, x0, z0), at(pl, x1, z0), at(pl, x1, zb), at(pl, x0, zb), nn)
    quad(M.marble, at(pl, x0, zb), at(pl, -hw, zb), at(pl, -hw, zsp), at(pl, x0, zsp), nn)
    quad(M.marble, at(pl, hw, zb), at(pl, x1, zb), at(pl, x1, zsp), at(pl, hw, zsp), nn)
    archFaceP(M.marble, pl, 0, 1, x0, x1, zsp, zs, arc, 0, zsp)
    for (let j = 0; j < arc.length - 1; j++) {
      const [s0, q0] = arc[j], [s1, q1] = arc[j + 1]
      const n0: V3 = [-pl.t[0] * s0, -pl.t[1] * s0, zsp - q0], n1: V3 = [-pl.t[0] * s1, -pl.t[1] * s1, zsp - q1]
      quad(M.shade, at(pl, s0, q0, 0), at(pl, s0, q0, -T), at(pl, s1, q1, -T), at(pl, s1, q1, 0), [n0, n0, n1, n1])
    }
    quad(M.shade, at(pl, -hw, zb, 0), at(pl, -hw, zb, -T), at(pl, -hw, zsp, -T), at(pl, -hw, zsp, 0), [pl.t[0], pl.t[1], 0])
    quad(M.shade, at(pl, hw, zb, 0), at(pl, hw, zsp, 0), at(pl, hw, zsp, -T), at(pl, hw, zb, -T), [-pl.t[0], -pl.t[1], 0])
    quad(M.shade, at(pl, -hw, zb, 0), at(pl, hw, zb, 0), at(pl, hw, zb, -T), at(pl, -hw, zb, -T), [0, 0, 1])
    // the back of the opening
    const ring: P2[] = [[-hw, zb], ...arc, [hw, zb]]
    for (let j = 1; j < ring.length - 1; j++) tri(M.win, at(pl, 0, zb, -T), at(pl, ring[j][0], ring[j][1], -T), at(pl, ring[j + 1][0], ring[j + 1][1], -T), nn)
    tri(M.win, at(pl, 0, zb, -T), at(pl, ring[0][0], ring[0][1], -T), at(pl, ring[1][0], ring[1][1], -T), nn)
  }
}

// ---------------------------------------------------------------------------
// The gallery arcades.

// Section of every gallery (estimated from o07, o36, o44; see the header).
const BAY = 5.0, ARCH_R = 2.05, ARCH_HALF = 1.55, ARCH_CROWN = 9.8
const WALL_TOP = 15.2, MERLON_TOP = 18.0
const SLAB = 1.1 // arcade wall thickness

type RunOpt = { back?: boolean; merlons?: boolean; cornice?: boolean; cols?: boolean; thin?: boolean }

/**
 * One arcade face along a plane, from s = 0 to L in nb bays: the arched
 * wall from the springing to WALL_TOP with real openings, the piers (paired
 * columns with gold capitals in detail; square piers with a gold capital
 * band in the low model), the cornice and the merlons.
 */
function arcadeRun(M: Mats, D: boolean, pl: Plane, L: number, nb: number, o: RunOpt = {}) {
  const w = L / nb
  const T = o.thin ? 0.7 : SLAB
  const seg = D ? 6 : 4
  // keyhole arch: 4.4 m at the springing, 5.2 m across, crown 10.7 m (detail);
  // the low model's double bays get a wider, flatter horseshoe
  // detail: the real ~5 m bay, a 3.1 m neck and a 4.1 m horseshoe, crown 9.8;
  // low: one opening per three bays, a round horseshoe on wide piers
  const hh = D ? ARCH_HALF * (w / BAY) : Math.min(w / 2 - 1.2, 4.2)
  const r = D ? hh * (ARCH_R / ARCH_HALF) : hh * 1.05
  const cz = (D ? ARCH_CROWN : 10.5) - r
  const zs = cz - Math.sqrt(r * r - hh * hh)
  const capTop = zs, colTop = zs - 1.1
  const fwd = nrm(pl)
  for (let i = 0; i < nb; i++) {
    const x0 = i * w, x1 = x0 + w, cx = (x0 + x1) / 2
    const arc = archFace(M.marble, pl, 0, 1, x0, x1, zs, WALL_TOP, cx, cz, r, hh, seg)
    if (o.back ?? D) archFace(M.shade, pl, -T, -1, x0, x1, zs, WALL_TOP, cx, cz, r, hh, seg)
    // intrados, smooth, facing the arch's centre
    for (let j = 0; j < arc.length - 1; j++) {
      const [s0, z0] = arc[j], [s1, z1] = arc[j + 1]
      const n0: V3 = [pl.t[0] * (cx - s0), pl.t[1] * (cx - s0), cz - z0]
      const n1: V3 = [pl.t[0] * (cx - s1), pl.t[1] * (cx - s1), cz - z1]
      quad(M.marble, at(pl, s0, z0, 0), at(pl, s0, z0, -T), at(pl, s1, z1, -T), at(pl, s1, z1, 0), [n0, n0, n1, n1])
    }
    // undersides of the wall over the piers
    const down: V3 = [0, 0, -1]
    if (D) quad(M.marble, at(pl, x0, zs, 0), at(pl, x0, zs, -T), at(pl, cx - hh, zs, -T), at(pl, cx - hh, zs, 0), down)
    if (D) quad(M.marble, at(pl, cx + hh, zs, 0), at(pl, cx + hh, zs, -T), at(pl, x1, zs, -T), at(pl, x1, zs, 0), down)
  }
  // run ends
  for (const [s, k] of (D ? [[0, -1], [L, 1]] : []) as [number, number][]) {
    const n: V3 = [pl.t[0] * k, pl.t[1] * k, 0]
    quad(M.marble, at(pl, s, zs, 0), at(pl, s, zs, -T), at(pl, s, WALL_TOP, -T), at(pl, s, WALL_TOP, 0), n)
  }
  // piers
  for (let i = 0; i <= nb; i++) {
    const s = Math.min(L - 0.35, Math.max(0.35, i * w))
    if (D) {
      const offs = i === 0 || i === nb ? [0] : [-0.42, 0.42]
      for (const ds of offs) {
        const c = at(pl, s + ds, 0, -T / 2)
        lathe(M.marble, c[0], c[1], [[0.27, FL], [0.27, colTop]], 6, { phase: Math.PI / 6 })
        lathe(M.gold, c[0], c[1], [[0.27, colTop], [0.56, capTop]], 6, { phase: Math.PI / 6 })
      }
    } else {
      // a square pier, its three outer sides, with a gold capital band
      const a = Math.max(0, s - 0.75), b = Math.min(L, s + 0.75)
      const zc = zs - 0.9
      quad(M.marble, at(pl, a, FL, 0), at(pl, b, FL, 0), at(pl, b, zc, 0), at(pl, a, zc, 0), fwd)
      quad(M.marble, at(pl, a, zc, 0), at(pl, b, zc, 0), at(pl, b, zs, 0), at(pl, a, zs, 0), fwd)
    }
  }
  if (o.cornice !== false && D) {
    // cornice band, proud of the face
    const z0 = WALL_TOP - 0.45, z1 = WALL_TOP + 0.45
    quad(M.marble, at(pl, 0, z0, 0.3), at(pl, L, z0, 0.3), at(pl, L, z1, 0.3), at(pl, 0, z1, 0.3), fwd)
    quad(M.marble, at(pl, 0, z1, 0.3), at(pl, L, z1, 0.3), at(pl, L, z1, -0.2), at(pl, 0, z1, -0.2), [0, 0, 1])
    quad(M.marble, at(pl, 0, z0, 0.3), at(pl, 0, z0, 0), at(pl, L, z0, 0), at(pl, L, z0, 0.3), [0, 0, -1])
    for (const [s, k] of [[0, -1], [L, 1]] as [number, number][]) {
      const n: V3 = [pl.t[0] * k, pl.t[1] * k, 0]
      quad(M.marble, at(pl, s, z0, 0), at(pl, s, z0, 0.3), at(pl, s, z1, 0.3), at(pl, s, z1, 0), n)
    }
  }
  if (o.merlons !== false) parapet(M, D, pl, L, WALL_TOP + 0.45, MERLON_TOP, 0.1)
}

/**
 * Crenellation: a low band and the pointed merlons on it. Detail: about the
 * real 1.4 m spacing, each a pointed blade seen from both sides; low: a bold
 * sawtooth at 3.6 m, front only.
 */
let lowCrest = false // the low model crests only the galleries, the hall front and the gate
function parapet(M: Mats, D: boolean, pl: Plane, L: number, z0: number, z1: number, d: number, back = true, merlons = true) {
  const band = z0 + (D ? 0.5 : 0.6)
  const T = 0.4
  quad(M.marble, at(pl, 0, z0, d), at(pl, L, z0, d), at(pl, L, band, d), at(pl, 0, band, d), nrm(pl))
  if (back && D) quad(M.marble, at(pl, 0, z0, d - T), at(pl, 0, band, d - T), at(pl, L, band, d - T), at(pl, L, z0, d - T), nrm(pl, -1))
  if (D) quad(M.marble, at(pl, 0, band, d), at(pl, L, band, d), at(pl, L, band, d - T), at(pl, 0, band, d - T), [0, 0, 1])
  if (!merlons || (!D && !lowCrest)) return
  const sp = D ? 1.7 : 5.0, nM = Math.max(1, Math.floor(L / sp)), off = (L - (nM - 1) * sp) / 2
  const h = Math.max(1.2, z1 - band) * (D ? 1 : 1.15), w = D ? 0.5 : 0.85
  for (let i = 0; i < nM; i++) {
    const s0 = off + i * sp
    tri(M.marble, at(pl, s0 - w, band, d), at(pl, s0 + w, band, d), at(pl, s0, band + h, d), nrm(pl))
    if (D && back) tri(M.marble, at(pl, s0 + w, band, d - T), at(pl, s0 - w, band, d - T), at(pl, s0, band + h, d - T), nrm(pl, -1))
  }
}

// ---------------------------------------------------------------------------
// Minarets.

function minaret(M: Mats, D: boolean, cx: number, cy: number) {
  const n8 = 8, nR = D ? 12 : 8
  // plinth and square shaft with chamfered corners
  if (D) box(M.marble, M.marble, cx - 5.6, cx + 5.6, cy - 5.6, cy + 5.6, FL, FL + 2.5, 1.2)
  box(M.marble, null, cx - 5.2, cx + 5.2, cy - 5.2, cy + 5.2, D ? FL + 2.5 : FL, 46, 1.1)
  // sloped chamfer from the square to the octagon
  const oct = (r: number): P2[] => Array.from({ length: 8 }, (_, i) => {
    const t = (TAU * i) / 8 + Math.PI / 8
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as P2
  })
  const sq = rect(cx - 5.2, cx + 5.2, cy - 5.2, cy + 5.2, 1.1), o = oct(5.6)
  for (let i = 0; i < 8; i++) {
    const a = sq[i], b = sq[(i + 1) % 8]
    const ni = nearest(o, a), nj = nearest(o, b)
    quad(M.marble, [a[0], a[1], 46], [b[0], b[1], 46], [o[nj][0], o[nj][1], 48], [o[ni][0], o[ni][1], 48],
      [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 4])
  }
  const P8 = { phase: Math.PI / 8 }
  // octagonal stage, corbel, balcony 1
  lathe(M.marble, cx, cy, D ? [[5.6, 48], [5.6, 63], [6.0, 64.3], [6.8, 66.6], [7.0, 67.5]] : [[5.6, 48], [5.6, 63], [7.0, 67.5]], n8, P8)
  balcony(M, D, cx, cy, 67.5, 7.0, 7.3, 1.2)
  // shaft (its spiral lattice is flat carving), corbel, balcony 2
  lathe(M.marble, cx, cy, D ? [[3.5, 68.2], [3.5, 83.6], [3.9, 84.6], [4.6, 86.0]] : [[3.5, 68.2], [3.5, 83.6], [4.6, 86.0]], nR, {})
  balcony(M, D, cx, cy, 86.0, 4.6, 4.9, 1.0)
  // lantern: columns round a dark core, entablature, balcony 3
  if (D) {
    lathe(M.win, cx, cy, [[1.7, 86.6], [1.7, 92.6]], 8, {})
    for (let i = 0; i < 8; i++) {
      const t = (TAU * i) / 8
      lathe(M.marble, cx + 2.55 * Math.cos(t), cy + 2.55 * Math.sin(t), [[0.28, 86.6], [0.28, 92.6]], 4, { phase: t })
    }
    lathe(M.marble, cx, cy, [[2.9, 92.6], [2.9, 93.4], [3.2, 93.9]], nR, {})
  } else lathe(M.marble, cx, cy, [[2.2, 86.6], [2.2, 92.6], [3.2, 93.9]], 8, {})
  balcony(M, D, cx, cy, 93.9, 3.2, 3.4, 0.8)
  // top drum, small dome, gold finial: ball, spire, crescent
  lathe(M.marble, cx, cy, [[1.85, 94.4], [1.85, 96.8], ...onion(1.85, 2.1, 2.2, D ? RINGS.small : RINGS.bulb).slice(1).map(([r, z]) => [r, 96.8 + z] as P2)], nR, { smooth: true })
  const g: P2[] = D
    ? [[0.45, 98.8], [0.9, 99.9], [1.25, 100.6], [1.25, 101.4], [0.8, 102.1], [0.3, 102.4], [0.3, 103.1], [0.55, 103.5], [0.12, 104.8], [0.08, 105.85], [0, 105.9]]
    : [[0.5, 98.8], [1.35, 100.8], [0.2, 102.6], [0, 107.0]]
  lathe(M.gold, cx, cy, g, D ? 8 : 5, { smooth: true })
  if (D) crescentAt(M.gold, cx, cy, 106.75, 0.95, 0.12)
  // square shaft: arched windows, small gold balconies; octagon: tall niches
  for (let f = 0; f < 4; f++) {
    const t = (f * Math.PI) / 2
    const nn: P2 = [Math.cos(t), Math.sin(t)]
    const pl = plane([cx + nn[0] * 5.2, cy + nn[1] * 5.2], [-nn[1], nn[0]], nn)
    if (D) {
      for (const s of [-1.6, 1.6]) {
        panel(M.win, pl, s, 27.5, 1.0, 3.0, true, 4)
        panel(M.win, pl, s, 41.9, 1.0, 3.0, true, 4)
        for (const z of [26.6, 41.0]) {
          const b0 = at(pl, s - 0.6, 0, 0), b1 = at(pl, s + 0.6, 0, 0.55)
          box(M.gold, null, Math.min(b0[0], b1[0]), Math.max(b0[0], b1[0]), Math.min(b0[1], b1[1]), Math.max(b0[1], b1[1]), z, z + 0.8, 0, M.gold)
        }
      }
    }
  }
  for (let i = 0; i < 8; i++) {
    if (!D) continue
    const t = (TAU * i) / 8
    const ap = 5.6 * Math.cos(Math.PI / 8)
    const pl = plane([cx + ap * Math.cos(t), cy + ap * Math.sin(t)], [-Math.sin(t), Math.cos(t)], [Math.cos(t), Math.sin(t)])
    panel(M.win, pl, 0, 51.5, 1.5, 8.5, true, D ? 4 : 2)
  }
}

const nearest = (ring: P2[], p: P2) => {
  let bi = 0, bd = Infinity
  ring.forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; bi = i } })
  return bi
}
function balcony(M: Mats, D: boolean, cx: number, cy: number, z: number, r0: number, r: number, rail: number) {
  const n = D ? 12 : 8
  // floor slab: underside, edge and top
  lathe(M.marble, cx, cy, D ? [[r0, z - 0.05], [r, z], [r, z + 0.4], [0, z + 0.4]] : [[r, z + 0.4], [0, z + 0.4]], n, D ? {} : { phase: Math.PI / 8 })
  // gold balustrade, both sides drawn
  lathe(M.gold, cx, cy, [[r - 0.05, z + 0.4], [r - 0.05, z + 0.4 + rail]], n, D ? {} : { phase: Math.PI / 8 })
  if (D) {
    lathe(M.gold, cx, cy, [[r - 0.2, z + 0.4 + rail], [r - 0.2, z + 0.4]], n, {})
  }
}

// ---------------------------------------------------------------------------
// The mosque.

// Plan (see the header).
const UO = 86.3 // outer side walls
const UC = 72.5 // courtyard side faces, hall side walls
const YQ = -110.2 // qibla wall
const YF = -22.5 // courtyard's west edge (front portico face)
const YH = -36 // hall front wall behind the portico
const YE = 96.6 // courtyard's east edge
const YO = 109.5 // east outer wall
const MIN: P2[] = [[UC, -22.3], [-UC, -22.3], [UC, 96.5], [-UC, 96.5]]
const MH = 5.6 // minaret plinth half-width

function build(D: boolean): Mats {
  const M: Mats = { marble: new Part(), roof: new Part(), gold: new Part(), win: new Part(), door: new Part(), shade: new Part() }
  const lowBay = (n: number) => (D ? n : Math.max(1, Math.round(n / 3)))

  // --- podium: the floor of the whole outline, courtyard included -------------
  {
    const nx = D ? 4 : 2, ny = D ? 5 : 3
    const u0 = -UO, u1 = UO, y0 = YQ, y1 = YO
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const a = u0 + ((u1 - u0) * i) / nx, b = u0 + ((u1 - u0) * (i + 1)) / nx
      const c = y0 + ((y1 - y0) * j) / ny, d = y0 + ((y1 - y0) * (j + 1)) / ny
      quad(M.marble, [a, c, FL], [b, c, FL], [b, d, FL], [a, d, FL], [0, 0, 1])
    }
    prism(M.marble, null, rect(u0, u1, y0, y1), 0, FL)
    // the courtyard's floral inlay is flat colour, too fine to read at map scale: left white
  }

  lowCrest = true
  // --- galleries -------------------------------------------------------------
  const arc = (o: P2, t: P2, n: P2, L: number, nb: number, opt: RunOpt = {}) => arcadeRun(M, D, plane(o, t, n), L, lowBay(nb), opt)
  both((k) => {
    // side galleries, courtyard face: from the west minaret to the east one
    const ya = -22.3 + MH, yb = 96.5 - MH
    arc([k * UC, k > 0 ? yb : ya], [0, k > 0 ? -1 : 1], [-k, 0], yb - ya, 22)
    // their middle row of columns (detail): a thin arcade
    // side galleries, outer face: qibla corner to the side pavilion, pavilion to the east corner block
    arc([k * UO, k > 0 ? -92 : YQ], [0, k > 0 ? -1 : 1], [k, 0], -92 - YQ, 4, { back: false })
    arc([k * UO, k > 0 ? 91.5 : YF], [0, k > 0 ? -1 : 1], [k, 0], 91.5 - YF, 23)
    arc([k * UO, k > 0 ? YF : -70], [0, k > 0 ? -1 : 1], [k, 0], YF + 70, 9, { back: false })
    // gallery roofs between the faces
    const roof = (u0: number, u1: number, y0: number, y1: number) => {
      const n = Math.max(1, Math.round((y1 - y0) / 20))
      for (let i = 0; i < n; i++) {
        const a = y0 + ((y1 - y0) * i) / n, b = y0 + ((y1 - y0) * (i + 1)) / n
        quad(M.roof, [u0, a, WALL_TOP], [u1, a, WALL_TOP], [u1, b, WALL_TOP], [u0, b, WALL_TOP], [0, 0, 1])
        if (D) quad(M.shade, [u0, a, WALL_TOP - 0.8], [u0, b, WALL_TOP - 0.8], [u1, b, WALL_TOP - 0.8], [u1, a, WALL_TOP - 0.8], [0, 0, -1])
      }
    }
    const [ua, ub] = k > 0 ? [UC, UO] : [-UO, -UC]
    roof(ua, ub, YQ, -92)
    roof(ua, ub, -70, 91.5)
    if (!D) {
      const um = k * 79.4
      quad(M.shade, [um, YF, FL], [um, 91.5, FL], [um, 91.5, WALL_TOP], [um, YF, WALL_TOP], [k, 0, 0])
      quad(M.shade, [um, YF, FL], [um, YF, WALL_TOP], [um, 91.5, WALL_TOP], [um, 91.5, FL], [-k, 0, 0])
    }
    // back wall of the gallery along the hall (the hall's side wall stands at UC)
    // east gallery: courtyard face and outer face between the gate and the corner block
    const xa = 23.4, xb = 72.5 - MH
    arc([k > 0 ? k * xa : k * xb, YE], [1, 0], [0, -1], xb - xa, 9)
    arc([k > 0 ? k * 69.5 : k * xa, YO], [-1, 0], [0, 1], 69.5 - xa, 9)
    const [ea, eb] = k > 0 ? [xa, 69.5] : [-69.5, -xa]
    quad(M.roof, [ea, YE, WALL_TOP], [eb, YE, WALL_TOP], [eb, YO, WALL_TOP], [ea, YO, WALL_TOP], [0, 0, 1])
    if (D) quad(M.shade, [ea, YE + SLAB, WALL_TOP - 0.8], [ea, YO - SLAB, WALL_TOP - 0.8], [eb, YO - SLAB, WALL_TOP - 0.8], [eb, YE + SLAB, WALL_TOP - 0.8], [0, 0, -1])
    // low model: a shaded screen down the gallery's middle stands for its far wall
    if (!D) {
      quad(M.shade, [ea, 103, FL], [eb, 103, FL], [eb, 103, WALL_TOP], [ea, 103, WALL_TOP], [0, 1, 0])
      quad(M.shade, [ea, 103, FL], [ea, 103, WALL_TOP], [eb, 103, WALL_TOP], [eb, 103, FL], [0, -1, 0])
    }
    // front portico: courtyard face, gate block to the west minaret
    const pa = 26, pb = UC - MH
    arc([k > 0 ? k * pa : k * pb, YF], [1, 0], [0, 1], pb - pa, 8, { back: false })
    const [qa, qb] = k > 0 ? [pa, UC] : [-UC, -pa]
    quad(M.roof, [qa, YH, WALL_TOP], [qb, YH, WALL_TOP], [qb, YF, WALL_TOP], [qa, YF, WALL_TOP], [0, 0, 1])
    if (D) quad(M.shade, [qa, YH, WALL_TOP - 0.8], [qa, YF - SLAB, WALL_TOP - 0.8], [qb, YF - SLAB, WALL_TOP - 0.8], [qb, YH, WALL_TOP - 0.8], [0, 0, -1])
  })

  // gallery floors, in shade (they read dark through the arches, as in o43 and o18)
  {
    const zf = FL + 0.03
    const fl = (u0: number, u1: number, y0: number, y1: number) => quad(M.shade, [u0, y0, zf], [u1, y0, zf], [u1, y1, zf], [u0, y1, zf], [0, 0, 1])
    both((k) => {
      const [a, b] = k > 0 ? [UC, UO] : [-UO, -UC]
      fl(a, b, YQ, -92); fl(a, b, -70, 91.5)
      const [c, d] = k > 0 ? [23.5, 69.5] : [-69.5, -23.5]
      fl(c, d, YE, YO)
      const [e, f] = k > 0 ? [26, UC] : [-UC, -26]
      fl(e, f, YH, YF)
    })
  }
  lowCrest = false
  // --- arcade domes (10 m), on the gallery roofs ------------------------------
  const smallDome = (cx: number, cy: number) =>
    domeOnDrum(M, D, cx, cy, D ? WALL_TOP : WALL_TOP + 2.6, WALL_TOP + 2.6, 4.35, 5.0, 7.2, 2.2, D ? 10 : 6, 0, false, D ? RINGS.smaller : RINGS.bulb)
  both((k) => {
    for (const y of [85.3, 69.3, 53.3, 37.3, 21.3, 5.3, -10.7, -33.0, -47.5, -62.0, -101.0]) smallDome(k * 79.4, y)
    for (const u of [30.5, 45.5, 60.5]) { smallDome(k * u, -30.2); smallDome(k * u, 103.0) }
  })

  // --- minarets ---------------------------------------------------------------
  for (const [u, y] of MIN) minaret(M, D, u, y)

  // --- east corner blocks and the east gate --------------------------------------
  both((k) => {
    const [a, b] = k > 0 ? [69.5, 91.5] : [-91.5, -69.5]
    box(M.marble, M.roof, a, b, 91.5, 115.5, FL, 22, 0.5)
    for (const pl of [plane([k > 0 ? b : a, 103.5], [0, 1], [k, 0]), plane([(a + b) / 2, 115.5], [1, 0], [0, 1])]) {
      for (const s of [-5.5, 0, 5.5]) {
        if (D) panel(M.win, pl, s, 13.5, 1.6, 4.2, true, 5)
        if (D) panel(M.win, pl, s, 6.0, 1.6, 4.2, true, 5)
      }
    }
    for (const [pl, L] of [
      [plane([a, 115.5], [1, 0], [0, 1]), b - a],
      [plane([k > 0 ? b : a, k > 0 ? 91.5 : 115.5], [0, k > 0 ? 1 : -1], [k, 0]), 24],
    ] as [Plane, number][]) parapet(M, D, pl, L, 22, 24.4, 0)
  })
  {
    lowCrest = true
    // east gate (o10, o15, o18): two tall pylons with small domes, low links
    // with open keyhole passages, and the taller centre with the main passage
    // and the gate dome; widths from o15 fitted to OSM's 47 m.
    const y0 = YE, y1 = 115.3, dep = y1 - y0
    const gc = 11, gl = 16.5, gx = 23.5, HC = 26, HL = 21.5, HP = 26.5
    portalFace(M, D, plane([-gc, y1], [1, 0], [0, 1]), 2 * gc, HC, [{ s: gc, hw: 3.6, crown: 15, pass: true }], dep)
    quad(M.roof, [-gc, y0, HC], [gc, y0, HC], [gc, y1, HC], [-gc, y1, HC], [0, 0, 1])
    for (const p of [plane([-gc, y1], [1, 0], [0, 1]), plane([gc, y0], [-1, 0], [0, -1])]) parapet(M, D, p, 2 * gc, HC, HC + 1.6, 0)
    both((k) => {
      const [a0, a1] = k > 0 ? [gc, gl] : [-gl, -gc]
      portalFace(M, D, plane([a0, y1], [1, 0], [0, 1]), a1 - a0, HL, [{ s: (a1 - a0) / 2, hw: 1.9, crown: 11, pass: true }], dep)
      quad(M.roof, [a0, y0, HL], [a1, y0, HL], [a1, y1, HL], [a0, y1, HL], [0, 0, 1])
      quad(M.marble, [k * gc, y0, HL], [k * gc, y1, HL], [k * gc, y1, HC], [k * gc, y0, HC], [k, 0, 0])
      // pylon
      const [p0, p1] = k > 0 ? [gl, gx] : [-gx, -gl]
      box(M.marble, M.roof, p0, p1, y0 - 0.3, y1 + 0.3, FL, HP, 0.3)
      quad(M.marble, [k * gl, y0, HL], [k * gl, y1, HL], [k * gl, y1, HP], [k * gl, y0, HP], [-k, 0, 0])
      for (const yy of [y0 - 0.3, y1 + 0.3]) {
        const pl = yy > 100 ? plane([p0, yy], [1, 0], [0, 1]) : plane([p1, yy], [-1, 0], [0, -1])
        if (D) panel(M.win, pl, 3.5, 17.5, 1.6, 4.5, true, 5)
        if (D) panel(M.marble, pl, 3.5, 4.0, 4.6, 9.5, false, 1, 0.15)
      }
      domeOnDrum(M, D, k * 20, 99.8, HP, HP + 1.4, 2.3, 2.65, 3.8, 1.6, D ? 10 : 6, 0, false, D ? RINGS.smaller : RINGS.dot)
      if (D) domeOnDrum(M, D, k * 20, 112.1, HP, HP + 1.4, 2.3, 2.65, 3.8, 1.6, 10, 0, false, RINGS.smaller)
    })
    lowCrest = false
    domeOnDrum(M, D, 0, 105.95, HC, HC + 3.2, 5.65, 6.5, 8.6, 3.8, D ? 20 : 10, D ? 10 : 0, true, D ? RINGS.mid : RINGS.dot)
  }

  // --- prayer hall ------------------------------------------------------------
  {
    // lower body: the qibla wall outside; inside the galleries its walls are in shade
    box(M.marble, M.roof, -UC, UC, YQ, YH, WALL_TOP, 22)
    quad(M.marble, [UC, YQ, FL], [-UC, YQ, FL], [-UC, YQ, WALL_TOP], [UC, YQ, WALL_TOP], [0, -1, 0])
    for (const k of [-1, 1]) quad(M.shade, [k * UC, YQ, FL], [k * UC, YH, FL], [k * UC, YH, WALL_TOP], [k * UC, YQ, WALL_TOP], [k, 0, 0])
    quad(M.shade, [-UC, YH, FL], [UC, YH, FL], [UC, YH, WALL_TOP], [-UC, YH, WALL_TOP], [0, 1, 0])
    const rear = plane([UC, YQ], [-1, 0], [0, -1])
    parapet(M, D, rear, 2 * UC, 22, 24.0, 0)
    both((k) => parapet(M, D, plane([k * UC, k > 0 ? YQ : YH], [0, k > 0 ? 1 : -1], [k, 0]), YH - YQ, 22, 24.0, 0, true, false))
    // upper stage
    box(M.marble, M.roof, -64, 64, -106, -44, 22, 27.5)
    parapet(M, D, plane([64, -106], [-1, 0], [0, -1]), 128, 27.5, 28.9, 0)
    parapet(M, D, plane([-64, -44], [1, 0], [0, 1]), 128, 27.5, 28.9, 0)
    both((k) => parapet(M, D, plane([k * 64, k > 0 ? -106 : -44], [0, k > 0 ? 1 : -1], [k, 0]), 62, 27.5, 28.9, 0, true, false))
    // rear (qibla) wall: windows in two rows and the side portals
    both((k) => {
      for (let i = 0; i < 6; i++) {
        const s = 72.5 + k * (30 + i * 7)
        if (D) panel(M.win, rear, s, 4.0, 1.0, 2.6, false)
        if (D) panel(M.win, rear, s, 9.5, 1.0, 2.0, false)
      }
      // shallow projecting frames with an arched door
      const s = 72.5 + k * 40
      const a = at(rear, s - 4.5, 0, 0), b = at(rear, s + 4.5, 0, 0.6)
      box(M.marble, M.roof, Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1]), FL, 21)
      const fpl = plane([at(rear, 0, 0, 0.6)[0], at(rear, 0, 0, 0.6)[1]], rear.t, rear.n)
      panel(M.door, fpl, s, FL, 2.8, 6.2, true, D ? 6 : 3)
      if (D) panel(M.win, fpl, s, 11.5, 2.2, 6.0, true, 6)
      // upper-stage windows
      for (const j of [0, 1]) panel(M.win, plane([0, -106], [-1, 0], [0, -1]), -k * (54 - j * 4) , 23.0, 1.2, 3.6, true, D ? 4 : 2)
    })
    // side walls of the hall above the galleries: windows
    both((k) => {
      const pl = plane([k * UC, k > 0 ? YQ : YH], [0, k > 0 ? 1 : -1], [k, 0])
      if (D) for (let i = 0; i < 8; i++) panel(M.win, pl, 6 + i * 9.6, 16.8, 1.6, 4.0, true, 4)
    })

    // mihrab block (rear) with its point and slit windows
    prism(M.marble, M.roof, [[-8.5, -123.8], [8.5, -123.8], [11.5, -120.8], [11.5, -104], [-11.5, -104], [-11.5, -120.8]], FL, 26.5)
    tri(M.marble, [-2.8, -123.8, FL], [0, -126.3, FL], [0, -126.3, 20], [-1, -1.1, 0])
    tri(M.marble, [-2.8, -123.8, FL], [0, -126.3, 20], [-2.8, -123.8, 20], [-1, -1.1, 0])
    tri(M.marble, [0, -126.3, FL], [2.8, -123.8, FL], [2.8, -123.8, 20], [1, -1.1, 0])
    tri(M.marble, [0, -126.3, FL], [2.8, -123.8, 20], [0, -126.3, 20], [1, -1.1, 0])
    tri(M.marble, [-2.8, -123.8, 20], [0, -126.3, 20], [2.8, -123.8, 20], [0, 0, 1])
    const mp = plane([8.5, -123.8], [-1, 0], [0, -1])
    for (const s of [2.9, 6.9, 10.1, 14.1]) panel(M.win, mp, s, 3.5, 1.1, 17.5, true, D ? 5 : 2)
    parapet(M, D, mp, 17, 26.5, 28.0, 0)
    both((k) => {
      const ch = plane([k * 8.5, -123.8], [k * 3 / 4.243, 3 / 4.243], [k * 3 / 4.243, -3 / 4.243])
      if (D) panel(M.win, ch, 2.12, 5.5, 1.0, 14.5, true, 5)
      parapet(M, D, ch, 4.243, 26.5, 28.0, 0)
      parapet(M, D, plane([k * 11.5, k > 0 ? -120.8 : -110.2], [0, k > 0 ? 1 : -1], [k, 0]), 10.6, 26.5, 28.0, 0)
    })
    domeOnDrum(M, D, 0, -113, 26.5, 32.4, 6.1, 7.0, 9.4, 4.2, D ? 20 : 10, D ? 10 : 0, true, D ? RINGS.mid : RINGS.dot)

    lowCrest = true
    // front entrance block: three keyhole portals cut into the face
    const gx = 26, gy0 = -46, gy1 = YF + 0.5, H = 33
    {
      const pl = plane([-gx, gy1], [1, 0], [0, 1])
      // o41/o43: a deep pointed iwan in the middle, smaller pointed portals either side
      portalFace(M, D, pl, 2 * gx, H, [
        { s: 13.2, hw: 2.0, crown: 12.5, pointed: true, deep: 2.4, door: 5.5 },
        { s: 26, hw: 4.6, crown: 18, pointed: true, deep: 4.5, door: 8.5 },
        { s: 38.8, hw: 2.0, crown: 12.5, pointed: true, deep: 2.4, door: 5.5 },
      ])
      for (const s of [-1, 1]) quad(M.marble, [s * gx, gy0, FL], [s * gx, gy1, FL], [s * gx, gy1, H], [s * gx, gy0, H], [s, 0, 0])
      quad(M.roof, [-gx, gy0, H], [gx, gy0, H], [gx, gy1, H], [-gx, gy1, H], [0, 0, 1])
      quad(M.marble, [gx, gy0, 22], [-gx, gy0, 22], [-gx, gy0, H], [gx, gy0, H], [0, -1, 0])
      parapet(M, D, pl, 2 * gx, H, H + 1.6, 0)
      // corner pylons, proud of the face and a little taller
      both((k) => {
        const [a0, a1] = k > 0 ? [gx - 7.5, gx + 0.5] : [-gx - 0.5, -gx + 7.5]
        box(M.marble, M.roof, a0, a1, gy1 - 3, gy1 + 1.6, FL, H + 3, 0.3)
        parapet(M, D, plane([a0, gy1 + 1.6], [1, 0], [0, 1]), a1 - a0, H + 3, H + 4.6, 0)
      })
      // windows on the block's sides above the portico roof
      both((k) => {
        const sp = plane([k * gx, k > 0 ? gy0 : gy1], [0, k > 0 ? 1 : -1], [k, 0])
        if (D) for (const s of [6, 12, 18]) panel(M.win, sp, s, 19.5, 1.5, 6, true, 5)
      })
    }
    lowCrest = false
    domeOnDrum(M, D, 0, -37.6, H, H + 3.8, 7.0, 8.0, 10.6, 4.6, D ? 24 : 12, D ? 12 : 0, true, D ? RINGS.mid : RINGS.dot)

    // central core and the main dome
    box(M.marble, M.roof, -20, 20, -101.5, -61.5, 27.5, 45, 3)
    for (const [pl, L] of [
      [plane([-17, -61.5], [1, 0], [0, 1]), 34], [plane([17, -101.5], [-1, 0], [0, -1]), 34],
      [plane([20, -98.5], [0, 1], [1, 0]), 34], [plane([-20, -64.5], [0, -1], [-1, 0]), 34],
    ] as [Plane, number][]) {
      parapet(M, D, pl, L, 45, 46.6, 0)
      if (D) for (const s of [6, 12, 22, 28]) panel(M.win, pl, s, 33.5, 1.6, 6.4, true, D ? 5 : 2)
    }
    domeOnDrum(M, D, 0, -81.5, 45, 54.3, 14.25, 16.4, 21.5, 8.5, D ? 24 : 16, 0, true, D ? RINGS.full : RINGS.low, D ? 1 : 2)
    // the eight kiosks round the drum
    for (let i = 0; i < 8; i++) {
      const t = (TAU * i) / 8 + Math.PI / 8
      if (D) domeOnDrum(M, D, 17.6 * Math.cos(t), -81.5 + 17.6 * Math.sin(t), 45, 47.4, 1.55, 1.8, 2.7, 1.2, 8, 0, false, RINGS.dot)
    }

    // side domes on their platforms, with four kiosks each
    both((k) => {
      const cx = k * 46, cy = -78
      box(M.marble, M.roof, cx - 14.5, cx + 14.5, cy - 14.5, cy + 14.5, 27.5, 34, 2.5)
      domeOnDrum(M, D, cx, cy, 34, 41.2, 11.4, 13.1, 17.6, 6.4, D ? 20 : 12, 0, true, D ? RINGS.mid : RINGS.low, D ? 1 : 4)
      if (D) for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) domeOnDrum(M, D, cx + a * 12, cy + b * 12, 34, 36.2, 1.4, 1.65, 2.5, 1.0, 8, 0, false, RINGS.dot)
    })

    // four towers at the hall's front corners
    for (const u of [-62, -30, 30, 62]) {
      box(M.marble, M.roof, u - 3.3, u + 3.3, -61.3, -54.7, 22, 36.2, D ? 0.4 : 0)
      for (let f = 0; f < 4; f++) {
        const t = (f * Math.PI) / 2, n: P2 = [Math.cos(t), Math.sin(t)]
        if (D || f % 2) panel(M.win, plane([u + n[0] * 3.3, -58 + n[1] * 3.3], [-n[1], n[0]], n), 0, 29.2, 1.6, 5.0, true, D ? 5 : 2)
      }
      domeOnDrum(M, D, u, -58, D ? 36.2 : 37.4, 37.4, 2.75, 3.2, 4.6, 2.0, D ? 10 : 8, 0, false, D ? RINGS.smaller : RINGS.bulb)
    }

    // side pavilions, their portal and dome
    both((k) => {
      const [a, b] = k > 0 ? [UC, 91.4] : [-91.4, -UC]
      box(M.marble, M.roof, a, b, -92, -70, FL, 30, 0.4)
      const pl = plane([k > 0 ? b : a, k > 0 ? -92 : -70], [0, k > 0 ? 1 : -1], [k, 0])
      panel(M.door, pl, 11, FL, 4.2, 8.4, true, D ? 8 : 4)
      panel(M.win, pl, 11, 13, 3.0, 9.0, true, D ? 6 : 3)
      parapet(M, D, pl, 22, 30, 31.4, 0)
      for (const [pp, L] of [
        [plane([a, -70], [1, 0], [0, 1]), b - a], [plane([b, -92], [-1, 0], [0, -1]), b - a],
      ] as [Plane, number][]) {
        parapet(M, D, pp, L, 30, 31.4, 0)
        if (D) panel(M.win, pp, (b - a) / 2, 18.5, 1.8, 6.0, true, 5)
      }
      domeOnDrum(M, D, k * 81.5, -81, 30, 33.6, 6.1, 7.0, 9.4, 4.0, D ? 16 : 10, D ? 8 : 0, true, D ? RINGS.mid : RINGS.dot)
    })
  }
  return M
}

// ----------------------------------------------------------------- write ---
const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.3 : p[2] < 1 ? 0.2 : 0.8)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.marble, material: { ...finish('szgm-marble', 0xf7f6f2), floodlight: lit } },
    { part: M.roof, material: finish('szgm-roof', 0xebe8e2) },
    { part: M.gold, material: { ...finish('szgm-gold', 0xc9a14c, 0.5), floodlight: () => 0.7 } },
    { part: M.win, material: PALETTE.window },
    { part: M.door, material: { ...PALETTE.entrance, color: 0xb99c62 } },
    { part: M.shade, material: { ...finish('szgm-shade', 0xa6a39c), floodlight: () => 0.85 } },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  const glb = writeGlb('Sheikh Zayed Grand Mosque', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: BEARING, elevation: 0, height: 107,
  })
  console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  await Bun.write(new URL(`../models/${file}`, import.meta.url).pathname, glb)
}

if (import.meta.main) {
  await write('abu-dhabi-sheikh-zayed-grand-mosque.glb', materials(build(false)), 6500, 250_000)
  await write('abu-dhabi-sheikh-zayed-grand-mosque.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
}
