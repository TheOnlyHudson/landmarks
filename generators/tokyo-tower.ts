/**
 * Tokyo Tower (東京タワー, officially 日本電波塔), Shiba Park, Minato, Tokyo:
 * procedural, CC0-1.0.
 * bun generators/tokyo-tower.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/tokyo-tower.glb, the low model: the lattice as open 3D members
 *   (four solid leg tubes, a ring girder and an X brace on every face of
 *   every panel, the four arches), within 6,500 triangles;
 * - models/tokyo-tower.detail.glb, drawn from zoom 16: the same frame with
 *   the legs as open four-chord lattice columns, a diamond and a centre
 *   post in every panel, plan bracing at every ring, double arches, an open
 *   lattice antenna and all 180 Landmark Light fittings.
 *
 * Map frame: x east, y north, z up, metres. Built with its faces on the
 * axes; the placement's bearing (34) turns them to OSM's faces, which point
 * 34, 124, 214 and 304 degrees (legs at 79, 169, 259, 349). The origin is
 * the tower's axis, the common centre of OSM's ring parts (the main and top
 * deck ways and the pyramid-ring relations), not the centroid of the
 * outline, which is FootTown's irregular plan; y = 0 is the ground.
 *
 * Completed 1958 (Tachū Naitō with Nikken Sekkei). A self-supporting steel
 * lattice tower painted in aviation international orange and white, on four
 * splayed legs joined by arches, carrying the two-storey Main Deck and the
 * Top Deck, under a broadcast antenna; FootTown, a four-storey block, stands
 * between the legs.
 *
 * Published (ja.wikipedia "東京タワー"):
 * - 333 m (332.9 m since the 2012 antenna work; OSM tags 332.6);
 * - legs 88.0 m apart, centre to centre (followed: the Azabudai photo's
 *   leg spread against the deck agrees; OSM's concrete piers sit 3 m further
 *   in, at 81.7 m, and are replaced);
 * - Main Deck 125 m above the ground (about 150 m above sea level, the figure
 *   the tower advertises), two storeys from 120 m;
 * - Top Deck 223.55 m above the ground (about 250 m above sea level);
 * - the digital antenna, a cylinder 13 m across and 11 m high;
 * - paint: below the Main Deck all orange, the deck white; above it seven
 *   equal bands, orange and white, from the deck to the tip (since 1986);
 * - Landmark Light: 180 floodlights aimed at the frame (12 on the digital
 *   antenna, 16 at the Top Deck, 40 between the decks, 16 under the Main
 *   Deck, 84 from the deck down to FootTown's roof, 12 at the legs),
 *   washing the whole tower warm orange from dusk to midnight.
 *
 * OSM (all within the tower, all replaced):
 * - relation/4247312 the tower (outline way/30526374, FootTown's plan),
 *   relation/4247313 FootTown (4 levels, 20 m), relation/3915931's parts;
 * - the concrete leg piers way/1244967004-007 (6.7 m square, 7 m tall) at
 *   37.4-44.3 m from the axis on both axes;
 * - the legs as skillion strips 0-40 m (way/1244967008-009,
 *   way/1245318714-743): from the pier to the 40 m ring, their inner edges
 *   rising to within 12 m of the face centre at 40 m (the arches);
 * - pyramid-ring relations 17133569-578 with rings at 40, 53, 66, 77, 88, 97,
 *   106 and 120 m (outer half-sides 26, 21, 17, 15.5, 14.2, 12.8, 11.3,
 *   9.8 m): the panel levels of the lower frame, used as the ring levels;
 * - the Main Deck way/313815246 120-130 m, a square 29.5 m across with 5 m
 *   chamfered corners; the Top Deck ways 313815247, 1244966985-986, a ring
 *   12.6 m across at 224-251 m; the antenna ways 1244966987-990;
 * - elevator and stair shafts way/1245337009-011.
 *
 * From photos (scaled on "Tokyo Tower during daytime.jpg", 8.39 px/m at
 * full size, a near-level view from Roppongi; its tip and Top Deck give the
 * same scale as the published heights):
 * - the Main Deck box 118.5-130.3 m: a recessed lower storey and a wider,
 *   outward-leaning upper storey of tall windows in a white frame, over a
 *   sloping soffit (Jakub Hałun's view from below);
 * - the Top Deck glazing 224-227 m in a white ring;
 * - white lattice 217-241 m; the digital antenna drum 241-252 m, a white
 *   ribbed lower half and an orange finned upper half;
 * - the antenna: orange lattice 254-276 m (with four rods round its foot to
 *   266 m), white 276-304 m, an orange box 304-314 m, the orange mast to the
 *   tip;
 * - the band edges at 159, 188, 217, 246, 275 and 304 m, matching the seven
 *   equal bands of 29 m from 130 m, and OSM's colour tags;
 * - the frame: a ring girder at every panel level and a big X in every
 *   panel, the X crossings boxed by diamonds (Ymblanter's close-ups); the
 *   arches spring from the legs' inner edges and peak just under the 40 m
 *   ring; a dark glazed lift shaft rises in the middle from FootTown's roof to
 *   the deck;
 * - FootTown's walls a dark mauve brown (halun), the roof grey.
 *
 * Measured on "Tokyo Tower seen from Azabudai Hills JP Tower 33F.jpg" (a
 * near face-on view, scaled on the deck, 30 m across): the legs' outer edge
 * at 15, 37, 55, 72, 89, 106 and 118 m (half-sides 40.6, 29.3, 22.0, 16.5,
 * 13.0, 11.0, 10.0 m, within 2 m of OSM's rings), the arch's crown just
 * under the 40 m ring and its springing at the legs' inner edges at ~20 m,
 * the lift shaft ~9.5 m across.
 *
 * Estimated: the leg centre line between the measured heights (a monotone
 * spline); above the deck its taper (OSM's 8.3 m at 217 m, the photos 7.3-
 * 9.8 m depending on the view angle); the leg tubes' width (7 m at the
 * piers, 2.4 m at the deck); member sizes, drawn heavier than real so
 * the frame reads (low model: ring girders 1.5 m, braces 1.2 m; detail model
 * about two thirds); the panel spacing above the deck (three panels per
 * band); the arch's shape (a quarter ellipse each side, kept inside the
 * legs); the lift shaft's depth (7.5 m); the deck's
 * window bays; FootTown's ground-floor glazing (south and west, as in Ian
 * Muttoo's night photo), 20 m from OSM.
 * Left out: the dish antennas on the upper frame, the stairs, the railings,
 * the rooftop plant on FootTown.
 *
 * Terrain: the map's terrain under the tower is a 4 m deep flat pit where
 * FootTown stands, with 8 m round it; y = 0 is the pit, so the north-east leg
 * stands at its real ground and the other three piers sink 3-4 m into the
 * slope. Elevation 0.
 *
 * Night: the Landmark Light, 180 floodlights inside the frame that make the
 * whole lattice glow gold-amber from dusk to midnight (Kakidai's night
 * photo; the lit lattice there samples #f2a23a-#ffb347). The orange
 * structure that carries the light (the legs, the arches, the ring girders,
 * the upper corner chords, the lower antenna, the box and mast, the drum's
 * fins) has a `neon-landmark-light` skin 0.12 m proud of its members, as
 * tokyo-skytree's `neon-skytree-iki` carries its illumination. Neon shows
 * its own colour by day and glows in it at night, so its colour is a
 * compromise: #ea7428, an orange a shade yellower than the paint, which by
 * day reads as the same orange tower and at night glows orange-gold (a true
 * amber such as #f0902a turned the legs visibly yellow by day; tried and
 * rejected). The white bands carry no skin: they are floodlit and read warm
 * white at night, as in the photo. The X braces keep a `floodlight` wash and
 * show their orange between the glowing lines. The deck frame is floodlit
 * and its glazing (`window`) glows warm white; FootTown's ground floor glows.
 * The detail model also has the 180 fittings as small beads in the same
 * neon, in their published numbers.
 * The lift shaft is drawn 9.5 x 7.5 m in FootTown's dark brown: glass behind
 * steel that reads as a dark column through the lattice (#5d3e42-#703f3a on
 * the Azabudai photo and Ymblanter's close-up), unlit at night.
 *
 * Colours (daylight photos, sunlit pixels averaged): the orange #eb5924
 * ("during daytime"), #df5434 ("2023"), #dd6a56 (Azabudai, hazy), drawn
 * #e8552a; the white bands #f2f0eb; FootTown's walls #685150 in sun and
 * #231825-#383b3e in shade (Hałun, Ymblanter), a dark brown, drawn #765f5c
 * (pulled lighter, as STYLE.md asks of large dark walls); the piers grey.
 *
 * Photos (Wikimedia Commons):
 * - "Tokyo Tower during daytime.jpg", Laitr Keiows, CC BY-SA 3.0 (heights, bands)
 * - "Tokyo Tower seen from Azabudai Hills JP Tower 33F.jpg", Syced, CC0 (frame, arches, FootTown, deck)
 * - "Tokyo Tower as seen from Mori Tower.jpg", Daniel L. Lu, CC BY-SA 4.0 (silhouette from the west)
 * - "Tokyo Tower 2023.jpg", Akonnchiroll, CC BY-SA 4.0 (bands, deck)
 * - "Tokyo Tower seen from Tokyo Tower-dori street.jpg", Ymblanter, CC BY-SA 4.0 (arches, frame)
 * - "Tokyo Tower lower part seen from Tokyo Tower-dori street.jpg", Ymblanter, CC BY-SA 4.0 (bracing, shaft)
 * - "Tokyo Tower, Tokyo, 20240821 1724 5273.jpg", Jakub Hałun, CC BY 4.0 (deck soffit, FootTown)
 * - "Base of Tokyo Tower in 2006 (245873545).jpg", Ian Muttoo, CC BY-SA 2.0 (piers, FootTown, night)
 * - "Tokyo Tower at night 2.JPG", Kakidai, CC BY-SA 3.0 (Landmark Light)
 * - "Tokyo Tower and Roppongi Hills Mori Tower seen from Hamamatsucho.jpg", Syced, CC0 (upper frame, drum, antenna from the east)
 * Look-only: none.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const lerpV = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/** A quad whose winding is chosen so it faces the way its normals do. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}

/** A flat quad facing `n`. */
function flat(p: Part, Q: V3[], n: V3) {
  face(p, Q, [n, n, n, n])
}

/** Surface of revolution from [r, z]; the left-hand side of the profile is outside. */
function lathe(profile: [number, number][], pick: (z: number) => Part, k: number, phase = 0) {
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const part = pick((z0 + z1) / 2)
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    const n = [ez / l, -er / l]
    const N = (a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const a0 = phase + (s / k) * TAU, a1 = phase + ((s + 1) / k) * TAU
      const q = [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)]
      const nn = [N(a0), N(a1), N(a1), N(a0)]
      if (r0 === 0) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(part, q, nn)
    }
  }
}

/**
 * A straight structural member from a to b: a prism of `sides` faces, `r`
 * from its axis to each edge, one edge turned away from the tower's axis.
 * Open-ended: its ends sit in the joints. Nothing goes below the ground.
 */
function member(p: Part, a: V3, b: V3, r: number, sides = 3) {
  const t = unit(sub(b, a))
  const m = mul(add(a, b), 0.5)
  let out: V3 = Math.hypot(m[0], m[1]) < 1e-6 ? [1, 0, 0] : unit([m[0], m[1], 0])
  let u = sub(out, mul(t, dot(out, t)))
  if (Math.hypot(...u) < 1e-6) u = Math.abs(t[2]) < 0.9 ? unit(cross(t, [0, 0, 1])) : unit(cross(t, [1, 0, 0]))
  u = unit(u)
  const v = unit(cross(t, u))
  const off = (k: number): V3 => {
    const ang = (k / sides) * TAU
    return add(mul(u, r * Math.cos(ang)), mul(v, r * Math.sin(ang)))
  }
  const g = (q: V3): V3 => [q[0], q[1], Math.max(0, q[2])]
  for (let k = 0; k < sides; k++) {
    const o0 = off(k), o1 = off(k + 1)
    const n0 = unit(o0), n1 = unit(o1)
    face(p, [g(add(a, o0)), g(add(a, o1)), g(add(b, o1)), g(add(b, o0))], [n0, n1, n1, n0])
  }
}

/** An axis-aligned square tube lofted through [half-side, z, centre x, centre y] stations, capped on top. */
function tube(p: Part, st: Array<[number, number, number, number]>, capTop = true) {
  const ring = ([h, z, cx, cy]: [number, number, number, number]): V3[] => [
    [cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z],
  ]
  const rings = st.map(ring)
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const b0 = rings[k][i], b1 = rings[k][j], t0 = rings[k + 1][i], t1 = rings[k + 1][j]
      const n = unit(cross(sub(b1, b0), sub(t0, b0)))
      flat(p, [b0, b1, t1, t0], n)
    }
  if (capTop) p.cap(rings[rings.length - 1], true)
}

/** A lamp bead: a small octahedron. */
function bead(p: Part, c: V3, r: number) {
  const X: V3[] = [[r, 0, 0], [0, r, 0], [-r, 0, 0], [0, -r, 0]]
  const top = add(c, [0, 0, r]), bot = add(c, [0, 0, -r])
  for (let i = 0; i < 4; i++) {
    const a = add(c, X[i]), b = add(c, X[(i + 1) % 4])
    p.tri(a, b, top)
    p.tri(b, a, bot)
  }
}

// --------------------------------------------------------------- the shape ---
/** Monotone cubic (Fritsch-Carlson) through [z, value] stations. */
function smoothTable(pts: Array<[number, number]>) {
  const n = pts.length, d: number[] = [], m: number[] = []
  for (let i = 0; i < n - 1; i++) d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]))
  for (let i = 0; i < n; i++) m.push(i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2)
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = Math.hypot(a, b)
    if (h > 3) { m[i] = (3 * a * d[i]) / h; m[i + 1] = (3 * b * d[i]) / h }
  }
  return (z: number) => {
    let i = 0
    while (i < n - 2 && z > pts[i + 1][0]) i++
    const [z0, v0] = pts[i], [z1, v1] = pts[i + 1], h = z1 - z0, t = Math.min(1, Math.max(0, (z - z0) / h))
    const t2 = t * t, t3 = t2 * t
    return (2 * t3 - 3 * t2 + 1) * v0 + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * v1 + (t3 - t2) * h * m[i + 1]
  }
}
/**
 * Half-side of the leg centre lines: 44 m at the ground (the published 88 m
 * between leg centres), then the outer edge measured on the Azabudai photo
 * against the deck (and within 2 m of OSM's rings), less half a leg; above
 * the deck a near-straight taper to the Top Deck, where the lattice is about
 * 8.4 m wide (OSM; the Azabudai and Hamamatsucho photos give 7.3-8.6 m).
 */
const L = smoothTable([[0, 44], [14.7, 37.8], [37, 27.1], [54.5, 20.25], [72, 15.0], [89, 11.65], [106, 9.75], [118.5, 8.82], [130, 7.6], [170, 5.6], [223, 3.5], [241, 3.2]])
/** Width of a leg tube below the deck. */
const W = (z: number) => 2 + 5 * Math.exp(-z / 45)
/** The leg's inner edge, along a face. */
const E = (z: number) => L(z) - W(z) / 2
const DECK0 = 118.5, DECK1 = 130.3
/** How far the Landmark Light skin stands proud of the members it lights. */
const GLOW = 0.12
/** Whether the ring girders carry the skin too (they then read cream, not amber). */
const RING_GLOW = true
const BAND0 = 130, BAND = 29 // seven equal bands from the deck to the tip
const isWhite = (z: number) => z >= BAND0 && Math.floor((z - BAND0) / BAND) % 2 === 1

/** Ring levels of the lower frame (OSM), and of the upper frame (three panels per band). */
const LOWER = [40, 53, 66, 77, 88, 97, 106, 112]
const UPPER = [DECK1, ...Array.from({ length: 9 }, (_, k) => BAND0 + (BAND / 3) * (k + 1)), 222.5]
const TOPL = [227.6, 234.3, 241]

/** The leg centre at corner (sx, sy). */
const leg = (sx: number, sy: number, z: number): V3 => [sx * L(z), sy * L(z), z]
/** The four faces, as their two corners counter-clockwise from outside. */
const FACES: Array<[[number, number], [number, number]]> = [
  [[-1, -1], [1, -1]], // south
  [[1, -1], [1, 1]],   // east
  [[1, 1], [-1, 1]],   // north
  [[-1, 1], [-1, -1]], // west
]
const CORNERS: Array<[number, number]> = [[1, 1], [-1, 1], [-1, -1], [1, -1]]

type Sizes = {
  detail: boolean
  ring: number; diag: number; sub: number // member radii, lower frame
  ringU: number; diagU: number            // upper frame
  legU: number                            // half-width of the upper corner chords
  arch: number
  k: number                               // segments round the round parts
  lamp: number
}
const LOW: Sizes = { detail: false, ring: 0.95, diag: 0.75, sub: 0, ringU: 0.78, diagU: 0.64, legU: 0.95, arch: 0.85, k: 16, lamp: 0.9 }
const DETAIL: Sizes = { detail: true, ring: 0.62, diag: 0.5, sub: 0.36, ringU: 0.42, diagU: 0.32, legU: 0.55, arch: 0.55, k: 24, lamp: 0.7 }

function build(s: Sizes) {
  const orange = new Part() // international orange steel (floodlit)
  const white = new Part()  // the white bands and the deck frame (floodlit)
  const glass = new Part()  // deck glazing, FootTown's glazing (lit)
  const town = new Part()   // FootTown's walls
  const grey = new Part()   // roofs, piers
  const lamps = new Part()  // Landmark Light (neon): the skin on the lit structure, and the fittings
  const paint = (z: number) => (isWhite(z) ? white : orange)
  const bar = (a: V3, b: V3, r: number, sides = 3, glow = false) => {
    member(paint((a[2] + b[2]) / 2), a, b, r, sides)
    if (glow && !isWhite((a[2] + b[2]) / 2)) member(lamps, a, b, r + GLOW, sides)
  }

  // --- Piers (OSM: 6.7 m square, 7 m tall), tapering a little.
  for (const [sx, sy] of CORNERS) tube(grey, [[3.6, 0, sx * L(0), sy * L(0)], [3.0, 7, sx * L(7), sy * L(7)]])

  // --- Legs, from the ground to the deck.
  const legZ = [0, 7, 14, 21, 28, 34, 40, 46.5, 53, 59.5, 66, 77, 88, 97, 106, 112, 119]
  for (const [sx, sy] of CORNERS) {
    if (!s.detail) {
      tube(orange, legZ.map((z) => [W(z) / 2, z, sx * L(z), sy * L(z)] as [number, number, number, number]), false)
      // the leg's Landmark Light skin (see Night): a slightly fatter box
      for (let i = 0; i < legZ.length - 1; i += 2) {
        const z0 = legZ[i], z1 = legZ[Math.min(i + 2, legZ.length - 1)]
        member(lamps, leg(sx, sy, z0), leg(sx, sy, z1), (W((z0 + z1) / 2) / 2 + GLOW) * Math.SQRT2, 4)
      }
      continue
    }
    // Detail: an open box column, four chords, battens and zig-zag lacing.
    const zs: number[] = []
    for (let i = 0; i < legZ.length - 1; i++) zs.push(legZ[i], (legZ[i] + legZ[i + 1]) / 2)
    zs.push(legZ[legZ.length - 1])
    const chord = (cx: number, cy: number, z: number): V3 => {
      const h = W(z) / 2 - 0.45
      return [sx * L(z) + cx * h, sy * L(z) + cy * h, z]
    }
    const cs: Array<[number, number]> = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    for (let i = 0; i < zs.length - 1; i++) {
      const z0 = zs[i], z1 = zs[i + 1]
      for (let c = 0; c < 4; c++) {
        const [ax, ay] = cs[c], [bx, by] = cs[(c + 1) % 4]
        member(orange, chord(ax, ay, z0), chord(ax, ay, z1), 0.62, 4)
        member(lamps, chord(ax, ay, z0), chord(ax, ay, z1), 0.62 + GLOW, 4)
        member(orange, chord(ax, ay, z1), chord(bx, by, z1), 0.3, 3)
        // lacing alternates direction storey by storey
        if (i % 2 === 0) member(orange, chord(ax, ay, z0), chord(bx, by, z1), 0.26, 3)
        else member(orange, chord(bx, by, z0), chord(ax, ay, z1), 0.26, 3)
      }
    }
  }

  // --- Arches: in each face, from the legs' inner edges up to just under the
  // 40 m ring; a quarter ellipse each side, kept inside the legs.
  const ZS = 20, APEX = 38.6
  const archPt = (side: number, t: number, f: number, inset = 0): V3 => {
    // t: 0 at the springing, 1 at the apex; returns in face f's frame.
    const phi = (t * Math.PI) / 2
    const z = ZS + (APEX - ZS) * Math.sin(phi) - inset
    const x = Math.min((E(ZS) - inset) * Math.cos(phi), E(z) - 0.3) * side
    return faceXY(f, x, z)
  }
  /** A point on face f at along-face offset x (from its centre) and height z. */
  function faceXY(f: number, x: number, z: number): V3 {
    const [a, b] = FACES[f]
    const A = leg(a[0], a[1], z), B = leg(b[0], b[1], z)
    const mid = lerpV(A, B, 0.5)
    const dir = unit(sub(B, A))
    return add(mid, mul(dir, x))
  }
  const NA = s.detail ? 12 : 7
  for (let f = 0; f < 4; f++)
    for (const side of [-1, 1]) {
      for (let i = 0; i < NA; i++) {
        bar(archPt(side, i / NA, f), archPt(side, (i + 1) / NA, f), s.arch, s.detail ? 4 : 3, true)
        if (s.detail) {
          // the arch's inner flange and its lacing
          bar(archPt(side, i / NA, f, 1.6), archPt(side, (i + 1) / NA, f, 1.6), 0.32)
          bar(archPt(side, i / NA, f), archPt(side, (i + 1) / NA, f, 1.6), 0.22)
        }
      }
      // spandrel posts from the arch up to the 40 m ring
      for (const t of s.detail ? [0.45, 0.62, 0.8] : [0.62]) {
        const p0 = archPt(side, t, f)
        const p1 = faceXY(f, alongX(f, p0), 40)
        bar(p0, p1, s.diag * 0.8)
      }
    }
  /** The along-face offset of a point on face f. */
  function alongX(f: number, p: V3) {
    const [a, b] = FACES[f]
    const A = leg(a[0], a[1], p[2]), B = leg(b[0], b[1], p[2])
    return dot(sub(p, lerpV(A, B, 0.5)), unit(sub(B, A)))
  }
  // A low ring between the legs above FootTown's roof, behind the arches'
  // springing: the legs are tied there (photos).
  for (let f = 0; f < 4; f++)
    for (const side of [-1, 1]) bar(faceXY(f, side * (E(24) + 0.2), 24), archPt(side, 0.48, f), s.diag * 0.8)

  // --- The lower frame: a ring girder at every level, an X in every panel.
  const panels = (levels: number[], ring: number, diag: number, sub: number, centre: boolean, plan: boolean) => {
    for (let k = 0; k < levels.length; k++) {
      const z1 = levels[k]
      for (let f = 0; f < 4; f++) {
        const [a, b] = FACES[f]
        const A1 = leg(a[0], a[1], z1), B1 = leg(b[0], b[1], z1)
        bar(A1, B1, ring, 3, RING_GLOW)
        if (plan) {
          // plan bracing: corner to the next face's centre, a diamond in plan
          const M = lerpV(A1, B1, 0.5), [c, d] = FACES[(f + 1) % 4]
          const M2 = lerpV(leg(c[0], c[1], z1), leg(d[0], d[1], z1), 0.5)
          bar(M, M2, sub)
        }
        if (k === 0) continue
        const z0 = levels[k - 1]
        const A0 = leg(a[0], a[1], z0), B0 = leg(b[0], b[1], z0)
        bar(A0, B1, diag)
        bar(B0, A1, diag)
        if (sub > 0) {
          // the diamond round the X's crossing, and a centre post
          const mA = lerpV(A0, A1, 0.5), mB = lerpV(B0, B1, 0.5)
          const m0 = lerpV(A0, B0, 0.5), m1 = lerpV(A1, B1, 0.5)
          bar(mA, m1, sub); bar(m1, mB, sub); bar(mB, m0, sub); bar(m0, mA, sub)
          if (centre) bar(m0, m1, sub)
        }
      }
    }
  }
  panels(LOWER, s.ring, s.diag, s.sub, true, s.detail)

  // --- Upper frame: deck to Top Deck, then the white lattice to the drum.
  const legU = (z: number) => s.legU * (1 - (0.3 * (z - DECK1)) / (241 - DECK1))
  const upLegs = [...UPPER.slice(0, -1), 222.5, ...TOPL]
  for (const [sx, sy] of CORNERS)
    for (let i = 0; i < upLegs.length - 1; i++)
      bar(leg(sx, sy, i === 0 ? 112 : upLegs[i]), leg(sx, sy, upLegs[i + 1]), legU(upLegs[i]) * 1.414, 4, true)
  panels(UPPER, s.ringU, s.diagU, s.detail ? s.sub * 0.7 : 0, false, s.detail)
  panels(TOPL, s.ringU * 0.9, s.diagU * 0.9, 0, false, false)

  // --- The lift shaft, FootTown's roof to the deck: glass behind steel, read dark.
  const shaft = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, pp = glass) => {
    const Q = (x: number, y: number, z: number): V3 => [x, y, z]
    const glass = pp
    flat(glass, [Q(x0, y0, z0), Q(x1, y0, z0), Q(x1, y0, z1), Q(x0, y0, z1)], [0, -1, 0])
    flat(glass, [Q(x1, y0, z0), Q(x1, y1, z0), Q(x1, y1, z1), Q(x1, y0, z1)], [1, 0, 0])
    flat(glass, [Q(x1, y1, z0), Q(x0, y1, z0), Q(x0, y1, z1), Q(x1, y1, z1)], [0, 1, 0])
    flat(glass, [Q(x0, y1, z0), Q(x0, y0, z0), Q(x0, y0, z1), Q(x0, y1, z1)], [-1, 0, 0])
  }
  shaft(-4.75, 4.75, -3.75, 3.75, 20, 112.5, town)
  // the shaft's frame lines, every second panel
  for (const z of [40, 66, 88, 106]) {
    shaft(-5.15, 5.15, -4.15, 4.15, z - 0.6, z + 0.6, orange)
  }

  // --- Main Deck: soffit, a recessed lower storey, a ledge, a leaning upper
  // storey with tall windows between white piers, a grey roof.
  const oct = (h: number, c: number, z: number): V3[] => [
    [-h + c, -h, z], [h - c, -h, z], [h, -h + c, z], [h, h - c, z],
    [h - c, h, z], [-h + c, h, z], [-h, h - c, z], [-h, -h + c, z],
  ]
  const loftOct = (p: Part, rings: V3[][]) => {
    for (let k = 0; k < rings.length - 1; k++)
      for (let i = 0; i < 8; i++) {
        const j = (i + 1) % 8
        const b0 = rings[k][i], b1 = rings[k][j], t0 = rings[k + 1][i], t1 = rings[k + 1][j]
        flat(p, [b0, b1, t1, t0], unit(cross(sub(b1, b0), sub(t0, b0))))
      }
  }
  const soffit0 = oct(L(112) + 1.4, 2.4, 112), lower0 = oct(13.6, 4.5, DECK0)
  loftOct(white, [soffit0, lower0])
  grey.cap(soffit0, false)
  const lowTop = oct(13.6, 4.5, 123.6)
  loftOct(white, [lower0, lowTop])
  const ledge0 = oct(14.4, 4.9, 123.6), ledge1 = oct(14.4, 4.9, 124.3)
  white.cap(lowTop, false) // underside of the ledge overhang (a ring, drawn full)
  loftOct(white, [ledge0, ledge1])
  const up1 = oct(15.1, 5.2, DECK1)
  loftOct(white, [ledge1, up1])
  const parapet = oct(15.1, 5.2, DECK1 + 0.5)
  loftOct(white, [up1, parapet])
  white.cap(parapet, true) // the deck's roof reads pale from the towers round it
  // Windows: panels standing 0.05 m proud of each face, between white piers.
  const windows = (r0: V3[], r1: V3[], zr0: number, zr1: number, bays: (len: number) => number, pier: number, lift = 0.05) => {
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      const b0 = r0[i], b1 = r0[j], t0 = r1[i], t1 = r1[j]
      const n = unit(cross(sub(b1, b0), sub(t0, b0)))
      const at = (u: number, v: number): V3 => add(lerpV(lerpV(b0, b1, u), lerpV(t0, t1, u), v), mul(n, lift))
      const len = Math.hypot(b1[0] - b0[0], b1[1] - b0[1])
      const nb = bays(len), pu = pier / len
      for (let w = 0; w < nb; w++) {
        const u0 = w / nb + pu / 2, u1 = (w + 1) / nb - pu / 2
        flat(glass, [at(u0, zr0), at(u1, zr0), at(u1, zr1), at(u0, zr1)], n)
      }
    }
  }
  windows(ledge1, up1, 0.2, 0.8, (l) => Math.max(1, Math.round(l / 4)), 0.9)
  windows(lower0, lowTop, 0.22, 0.75, (l) => Math.max(1, Math.round(l / 5)), 0.9)

  // --- Top Deck: a white ring with its glazing, round the lattice.
  const K = s.k
  lathe([[L(222.3) - 0.6, 222.3], [6.3, 222.6], [6.9, 223.4], [6.9, 223.8]], () => white, K, Math.PI / K)
  lathe([[6.9, 223.8], [6.75, 226.7]], () => glass, K, Math.PI / K)
  lathe([[6.75, 226.7], [7.0, 227.0], [7.0, 227.5], [5.4, 227.8], [L(227.8) + 0.4, 228]], () => white, K, Math.PI / K)

  // --- The digital antenna: a drum 13 m across and 11 m high (published);
  // white and ribbed below, orange and finned above (photos).
  const drum: [number, number][] = [[L(241) - 0.4, 240.8], [6.3, 241]]
  const rib = s.detail ? 1.35 : 2.7
  for (let z = 241; z < 246.4; z += rib) drum.push([6.3, z + 0.05], [6.55, z + 0.25], [6.55, z + rib - 0.3], [6.3, z + rib - 0.05])
  drum.push([6.3, 246.5])
  for (let z = 246.5; z < 252.3; z += 1.45) drum.push([6.35, z + 0.05], [6.75, z + 0.3], [6.75, z + 0.6], [6.35, z + 0.85], [6.35, z + 1.45])
  drum.push([5.0, 252.6], [3.4, 252.9])
  lathe(drum, (z) => (z < 246.5 ? white : orange), s.detail ? K : 16, Math.PI / 16)
  // the drum's Landmark Light skin, over its orange fins
  lathe([[6.4, 246.5], [6.9, 246.7], [6.9, 252.2], [5.1, 252.75]], () => lamps, s.detail ? 16 : 12, Math.PI / 12)

  // --- Antenna (photo): orange lattice 254-276 m with rods round its foot,
  // white to 304 m, an orange box to 314 m, the mast to the tip.
  lathe([[3.4, 252.9], [3.2, 254], [0.01, 254.05]], () => orange, 12)
  const ant = (z: number) => 1.65 - (0.6 * (z - 254)) / (304 - 254)
  if (s.detail) {
    const lv: number[] = []
    for (let z = 254; z < 304; z += 3.5) lv.push(z)
    lv.push(304)
    for (const [sx, sy] of CORNERS)
      for (let i = 0; i < lv.length - 1; i++) {
        const a: V3 = [sx * ant(lv[i]), sy * ant(lv[i]), lv[i]], b: V3 = [sx * ant(lv[i + 1]), sy * ant(lv[i + 1]), lv[i + 1]]
        member(paint((lv[i] + lv[i + 1]) / 2), a, b, 0.28, 4)
      }
    for (let k = 1; k < lv.length; k++)
      for (let f = 0; f < 4; f++) {
        const [a, b] = FACES[f]
        const z0 = lv[k - 1], z1 = lv[k]
        const A0: V3 = [a[0] * ant(z0), a[1] * ant(z0), z0], B0: V3 = [b[0] * ant(z0), b[1] * ant(z0), z0]
        const A1: V3 = [a[0] * ant(z1), a[1] * ant(z1), z1], B1: V3 = [b[0] * ant(z1), b[1] * ant(z1), z1]
        member(paint((z0 + z1) / 2), A1, B1, 0.16, 3)
        member(paint((z0 + z1) / 2), k % 2 ? A0 : B0, k % 2 ? B1 : A1, 0.13, 3)
      }
    // a slim mast inside, which reads through the open lattice
    member(orange, [0, 0, 254], [0, 0, 276], 0.6, 6)
    member(white, [0, 0, 276], [0, 0, 304], 0.5, 6)
  } else {
    tube(orange, [[ant(254), 254, 0, 0], [ant(275), 275, 0, 0]], false)
    tube(white, [[ant(275), 275, 0, 0], [ant(304), 304, 0, 0]], false)
    member(lamps, [0, 0, 254], [0, 0, 275], (ant(264) + GLOW) * Math.SQRT2, 4)
  }
  for (const [sx, sy] of CORNERS) member(orange, [sx * 2.6, sy * 2.6, 254], [sx * 2.1, sy * 2.1, 266.5], s.detail ? 0.22 : 0.3, 3)
  tube(orange, [[1.1, 304, 0, 0], [1.05, 308, 0, 0], [1.3, 308.1, 0, 0], [1.3, 313.6, 0, 0], [0.6, 314, 0, 0]])
  member(orange, [0, 0, 313.9], [0, 0, 333], s.detail ? 0.42 : 0.5, 6)
  member(lamps, [0, 0, 304], [0, 0, 314], 1.3 * Math.SQRT2 + GLOW, 4)
  member(lamps, [0, 0, 314], [0, 0, 333], (s.detail ? 0.42 : 0.5) + GLOW, 6)

  // --- FootTown (OSM relation/4247313): 20 m, mauve-brown walls, grey roof,
  // a white cornice, glazed ground floor on the south and west.
  const FT: V3[] = [[37.9, 22.5, 0], [-38.2, 22.0, 0], [-38.7, -23.6, 0], [16.4, -23.7, 0], [16.4, -27.1, 0], [19.8, -30.0, 0], [37.8, -29.6, 0]]
  const at = (z: number) => FT.map(([x, y]) => [x, y, z] as V3)
  town.loft([at(0), at(19.2)])
  white.loft([at(19.2), at(20)])
  grey.cap(at(20), true)
  for (let i = 0; i < FT.length; i++) {
    const a = FT[i], b = FT[(i + 1) % FT.length]
    const n = unit([b[1] - a[1], a[0] - b[0], 0])
    if (!(n[1] < -0.7 || n[0] < -0.7)) continue // south and west fronts
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (len < 6) continue
    const bays = Math.round(len / 7)
    for (let w = 0; w < bays; w++) {
      const u0 = (w + 0.08) / bays, u1 = (w + 0.92) / bays
      const p0 = add(lerpV(a, b, u0), mul(n, 0.05)), p1 = add(lerpV(a, b, u1), mul(n, 0.05))
      flat(glass, [add(p0, [0, 0, 1.2]), add(p1, [0, 0, 1.2]), add(p1, [0, 0, 4.6]), add(p0, [0, 0, 4.6])], n)
    }
  }

  // --- Detail: the white dish antennas hung on the upper frame (photos show
  // a few dozen, most on the orange bands' corners); a disc facing out.
  if (s.detail) {
    const dish = (c: V3, out: V3, r: number) => {
      const front = add(c, mul(out, 0.8))
      member(white, c, front, r, 10)
      const u = unit(cross(out, [0, 0, 1])), v = unit(cross(u, out))
      for (let k = 0; k < 10; k++) {
        const a0 = (k / 10) * TAU, a1 = ((k + 1) / 10) * TAU
        const p0 = add(front, add(mul(u, r * Math.cos(a0)), mul(v, r * Math.sin(a0))))
        const p1 = add(front, add(mul(u, r * Math.cos(a1)), mul(v, r * Math.sin(a1))))
        white.tri(front, p0, p1, undefined, undefined, undefined, [out, out, out])
      }
    }
    const spots: Array<[number, number]> = [[143, 0.5], [150, 0.15], [176, 0.85], [196, 0.5], [203, 0.2], [212, 0.75], [231, 0.5], [237, 0.3]]
    spots.forEach(([z, u], i) => {
      for (let f = 0; f < 4; f++) {
        if ((i + f) % 2) continue
        const [a, b] = FACES[f]
        const p = lerpV(leg(a[0], a[1], z), leg(b[0], b[1], z), u)
        const out = unit([b[1] - a[1], a[0] - b[0], 0]) // the face's outward normal
        dish(add(p, mul(out, 0.4)), out, z > 225 ? 0.9 : 1.2)
      }
    })
  }

  // --- Landmark Light fittings (published counts; the low model keeps the
  // legs' and the deck's).
  const lampAt: V3[] = []
  for (const [sx, sy] of CORNERS) {
    // 12 at the legs: three per leg, mounted on its inner faces at FootTown's roof, aimed up
    const z = 20.8
    for (const [dx, dy] of [[-1, 0], [0, -1], [-1, -1]]) {
      const c = leg(sx, sy, z)
      lampAt.push([c[0] + sx * dx * (W(z) / 2 + 0.5), c[1] + sy * dy * (W(z) / 2 + 0.5), z])
    }
  }
  // 16 under the Main Deck, on the top ring girders, aimed up at the soffit
  for (let f = 0; f < 4; f++)
    for (const u of [0.2, 0.4, 0.6, 0.8]) {
      const [a, b] = FACES[f]
      const p = lerpV(leg(a[0], a[1], 112), leg(b[0], b[1], 112), u)
      const out = unit([p[0], p[1], 0])
      lampAt.push(add(p, add(mul(out, 1.3), [0, 0, -0.6])))
    }
  if (s.detail) {
    // 84 from the deck down to FootTown's roof: three per face on seven rings
    for (const z of LOWER.slice(0, 7))
      for (let f = 0; f < 4; f++)
        for (const u of [0.25, 0.5, 0.75]) {
          const [a, b] = FACES[f]
          const p = lerpV(leg(a[0], a[1], z), leg(b[0], b[1], z), u)
          lampAt.push([p[0] * 0.92, p[1] * 0.92, z + 0.9])
        }
    // 40 between the decks: ten per face on the upper rings
    for (const z of UPPER.slice(1, 6))
      for (let f = 0; f < 4; f++)
        for (const u of [0.3, 0.7]) {
          const [a, b] = FACES[f]
          const p = lerpV(leg(a[0], a[1], z), leg(b[0], b[1], z), u)
          lampAt.push([p[0] * 0.85, p[1] * 0.85, z + 0.6])
        }
    // 16 at the Top Deck, 12 on the digital antenna
    for (let i = 0; i < 16; i++) lampAt.push([7.3 * Math.cos((i / 16) * TAU), 7.3 * Math.sin((i / 16) * TAU), 228])
    for (let i = 0; i < 12; i++) lampAt.push([5.6 * Math.cos((i / 12) * TAU), 5.6 * Math.sin((i / 12) * TAU), 253.3])
  }
  if (s.detail) for (const c of lampAt) bead(lamps, c, s.lamp)

  // The Landmark Light washes the frame from inside: full on the members'
  // sides, less on faces looking up; the deck frame takes a little.
  const lit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.45 : 0.95)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: orange, material: { ...finish('tokyo-tower-orange', 0xe8552a), floodlight: lit } },
    { part: white, material: { ...finish('tokyo-tower-white', 0xf2f0eb), floodlight: (p, n) => (p[2] < 30 ? 0 : lit(p, n) * 0.85) } },
    { part: glass, material: PALETTE.window },
    { part: town, material: finish('foottown-brown', 0x765f5c) },
    { part: grey, material: PALETTE.roof },
    { part: lamps, material: finish('neon-landmark-light', 0xea7428) },
  ]
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Tokyo Tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 34, elevation: 0, height: 333,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

await write('tokyo-tower.glb', build(LOW), 6500, 250_000)
await write('tokyo-tower.detail.glb', build(DETAIL), 40_000, 1536 * 1024)
