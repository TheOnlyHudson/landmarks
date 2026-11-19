/**
 * Caesars Superdome, New Orleans (1975, Curtis and Davis with Edward B.
 * Silverstein and Associates and Nolan, Norman & Nolan; renovated 2021-24).
 * Procedural, CC0-1.0, no textures.
 * bun generators/nola-caesars-superdome.ts [out.glb]
 *
 * What makes it read as itself: the huge low white dome; the tall flared
 * wall of vertical metal panels, pinched at the waist and overhanging at
 * the rim (the hourglass profile), a warm champagne-bronze metal that
 * contrasts with the white roof; a dark band of window slots at
 * mid-height; and the podium it stands on, a panelled band over a dark
 * glazed concourse with tapered piers, ringed by the plaza deck.
 *
 * Frame: x east, y north, z up, metres (written as glTF +Y up, -Z north).
 * Bearing 0 (round). The anchor is the area centroid of OSM way/126815370,
 * the outer ring of relation/4598860 (-90.0810878, 29.9510518). The dome is
 * centred on OSM's inner ring way/25890330, 0.6 m east and 0.7 m north of
 * the anchor (the lidar's best-fit centre is about 2 m from it, within the
 * usual lidar/OSM offset). z = 0 is the street (lidar ground_min + 0.6 m);
 * elevation 0. The site is flat (Mapterhorn relief 1.5 m over the box).
 *
 * Sources
 * - OSM: relation/4598860 "Caesars Superdome" (height=22, wrong: that is
 *   about the podium's roof), outer way/126815370 (the podium's rounded
 *   square, 259 m across, corners at r 139 m), inner way/25890330
 *   (building:part=roof, the dome, r 110.1-110.8 m; height 53.6, roof:height
 *   82.3). Podium outline: every other node of way/126815370 plus corners.
 * - Lidar, USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown
 *   2021-22, mid-renovation; the renovation changed cladding colour, not the
 *   form), 1 m grid, rings about the fitted centre (measured above street):
 *   dome crown 83.8; 83.5 at r 10, 82.7 at 20, 81.3 at 30, 79.4 at 40, 76.9
 *   at 50, 73.8 at 60, 70.1 at 70, 65.7 at 80, 60.7 at 90, 57.8 at 95, 54.7
 *   at 100, 52.3 at 104; the gutter 46.1-46.9 at r 108; the rim flat at
 *   50.9-51.2 from r 110 to 113.5; the podium roof 19.0-19.9 out to the
 *   OSM outline; the plaza deck outside it 7.0-8.4 (median 7.9).
 * - Published: 273 ft (83 m) high, dome 680 ft (210 m) across, opened 1975
 *   (Wikipedia, "Caesars Superdome"); lidar crown 83.8 m agrees.
 * - NAIP (USGS, public domain): the white roof, the podium's grey roof
 *   terrace, the plaza deck and the garages round it.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   p01 "Caesars Superdome New Orleans, LA.jpg", Glimmergloss, CC0, from the
 *     west garage roof (post-2021): the wall profile, measured by pixel
 *     scale against the 227 m lip: foot r ~118, waist r ~108.8 at z ~37,
 *     lip r ~113.5; slots at z ~30; the podium band;
 *   p02 "Caesars Superdome - Home of the New Orleans Saints - 4 Feb 2026.jpg",
 *     ajay_suresh, CC BY 4.0: the current silver-beige panels, the band,
 *     the tapered piers and the glazed concourse at Gate C;
 *   "Louisiana Superdome on Poydras Street, New Orleans 30 Jan 2025 - 02..12",
 *     Infrogmation, CC BY-SA 4.0: the north side;
 *   "Superdome from Claiborne Avenue New Orleans, 16 November 2023 - 1/2/3",
 *     Infrogmation, CC BY-SA 4.0: from the west, slots, colours;
 *   "New Orleans Central Business District 28 Oct 2024 - Superdome",
 *     Infrogmation, CC BY-SA 4.0: colours of the wall and the band;
 *   "New Orleans from the Air September 2019 - Superdome and Arena",
 *     George Bannister, CC BY 2.0: aerial from the south-south-west;
 *   "FEMA - 37399 - The Louisiana Superdome - repaired", Ed Edahl/FEMA,
 *     public domain (2008, before the renovation): aerial from the
 *     north-east, the panel rhythm, podium and deck;
 *   "Caesars Superdome illuminated at night, April 2025", Paul Lowry,
 *     CC BY 2.0: the wall washed in colour LEDs at night.
 * - Look-only: none.
 *
 * Estimated: 48 panels (the real wall has more, narrower ones; 48 keeps
 * them readable), each folded 1.1 m along its centre line; the slot
 * band at z 29.0-30.9 (p01), drawn flush as eight long runs of four
 * panels, one every 45 degrees (review round 1: evenly spaced, symmetric); the
 * concourse level from the deck (7.9) to 10.6 and the band from there to
 * the 20.2 m parapet (proportions from p02); 48 piers; the colours from p02,
 * p01 and the 2024 photo, pulled to the palette's lightness: cladding
 * champagne-bronze #c0a782 (p01 west and Infrogmation 2025 north; review
 * round 1), the podium band grey-tan concrete #a9a193, darker than the
 * wall, the podium's lower walls and roof terrace #b4ada0, roof white
 * #f1efea.
 * Night: the real wall is washed with vertical bands of colour LEDs.
 * Every other panel is `neon-superdome-led` in the cladding's own colour
 * (identical by day, glowing gold at night); the panels between carry a
 * warm _FLOODLIGHT wash, so the drum reads as vertical lit bands. One
 * colour stands in for the real changing colours. Slots and concourse
 * glazing are `window`.
 * Left out: the CAESARS SUPERDOME lettering on the roof and band, the roof
 * logo, the plaza deck and ramps outside the outline (OSM
 * relation/4597536, a 10 m ring round the podium; lidar says 7.9 m), the
 * garages, the old stepped roof rings (the new white roof reads smooth).
 *
 * Doubts: the wall's profile below the rim is from one photo (p01), not
 * lidar, which can't see under the overhang; slot positions are
 * approximate; the podium band's colour differs between photos (tan in
 * 2023-24, near the cladding's colour in 2026; grey-tan chosen in review).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------------------
// Numbers. z above the street (lidar street level = ground_min + 0.6 m).

const DECK = 7.9 // the plaza deck round the podium, lidar
const ENTRY = 10.6 // top of the glazed concourse level under the podium band (photos)
const PODIUM = 19.2 // podium roof, lidar (19.6-20.5 above ground_min)
const PARAPET = 20.2 // podium parapet, estimated
const RIM = 51.0 // top of the flared wall, lidar 51.0-51.2
const GUTTER = 47.2 // roof gutter inside the rim, lidar 46.1-46.9 at r 108
const RIM_IN = 110 // inner edge of the rim's flat top, lidar
const DOME_EDGE = 107.5 // where the dome springs, lidar
const PANELS = 48 // wall panels round the drum (fewer and wider than the real ones)
const FOLD = 1.1 // how far each panel's centre line stands proud of its edges

/** The flared wall's profile, [z, r]: foot on the podium roof, waist, rim. */
const WALL: [number, number][] = [
  [PODIUM, 118.0],
  [20.4, 117.6],
  [22.0, 116.2],
  [24.0, 114.6],
  [26.5, 112.9],
  [29.0, 111.4], // window-slot band from here...
  [30.9, 110.6], // ...to here
  [33.5, 109.6],
  [36.8, 108.8],
  [40.0, 109.3],
  [43.0, 110.9],
  [45.8, 112.4],
  [48.3, 113.4],
  [50.6, 113.7], // the lip
]
const SLOT_ROW = 5 // WALL[5]..WALL[6]

/** The dome above the street, measured ring by ring in the lidar, [r, z]. */
const DOME: [number, number][] = [
  [DOME_EDGE, 49.6], [104, 52.3], [100, 54.7], [95, 57.8], [90, 60.7], [80, 65.7], [70, 70.1],
  [60, 73.8], [50, 76.9], [40, 79.4], [30, 81.3], [20, 82.7], [10, 83.5], [0, 83.8],
]
const DOME_SEG = 48

/**
 * The podium: OSM way/126815370 (outer of relation/4598860), every other
 * node plus the four corners, in metres from its area centroid (the anchor),
 * counter-clockwise.
 */
const OUTLINE: [number, number][] = [[-61.2, 119.7], [-71.1, 109.0], [-80.4, 97.7], [-89.0, 85.8], [-96.8, 73.5], [-103.8, 60.7], [-109.8, 48.0], [-115.4, 34.0], [-120.1, 19.9], [-123.8, 5.8], [-126.6, -8.5], [-128.5, -23.2], [-129.5, -37.2], [-129.4, -51.1], [-120.1, -60.9], [-109.4, -70.9], [-98.0, -80.3], [-86.1, -88.8], [-73.9, -96.5], [-60.8, -103.8], [-47.9, -109.8], [-34.6, -115.1], [-20.2, -119.9], [-6.1, -123.5], [8.2, -126.3], [22.8, -128.3], [37.3, -129.3], [51.2, -129.5], [61.4, -119.9], [71.1, -109.4], [80.2, -98.2], [88.7, -86.4], [100.0, -68.1], [109.4, -48.9], [115.4, -33.8], [119.8, -20.3], [123.5, -6.2], [126.2, 7.9], [128.2, 23.1], [129.1, 37.4], [129.3, 50.9], [119.9, 61.1], [109.5, 70.9], [98.2, 80.3], [86.3, 89.0], [74.3, 96.7], [61.3, 103.9], [47.9, 110.2], [34.2, 115.6], [19.9, 120.2], [6.1, 123.7], [-8.8, 126.5], [-23.2, 128.2], [-37.2, 129.0], [-51.6, 128.9]]

// ---------------------------------------------------------------------------
// Helpers.

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => {
  const l = Math.hypot(...a) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
/** Compass angle t (radians clockwise from north), radius r, height z. */
/** The dome's centre from the anchor: the centre of OSM's inner ring way/25890330. */
const CX = 0.6, CY = 0.7
const polar = (t: number, r: number, z: number): V3 => [CX + Math.sin(t) * r, CY + Math.cos(t) * r, z]
const dirOf = (t: number): V3 => [Math.sin(t), Math.cos(t), 0]
const UP: V3 = [0, 0, 1], DOWN: V3 = [0, 0, -1]

/** A quad wound to face `hint`; per-corner normals make it smooth, else flat. */
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const g = cross(sub(P[2], P[0]), sub(P[3], P[0]))
  const o = dot(add(f, g), hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns ? o.map((i) => unit(ns[i])) : undefined
  const tri = (a: number, b: number, c: number) => {
    const A = P[o[a]], B = P[o[b]], C = P[o[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[a], n[b], n[c]])
  }
  tri(0, 1, 2)
  tri(0, 2, 3)
}
function tri(p: Part, a: V3, b: V3, c: V3, hint: V3) {
  const f = cross(sub(b, a), sub(c, a))
  if (Math.hypot(...f) < 1e-9) return
  if (dot(f, hint) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/**
 * Triangulate the flat ring between two closed loops around the origin
 * (both star-shaped about it) by sweeping round in angle.
 */
function zipper(p: Part, outer: V3[], inner: V3[], hint: V3) {
  const ang = (v: V3) => Math.atan2(v[1], v[0])
  const prep = (loop: V3[]) => {
    let pts = [...loop]
    // make it counter-clockwise from above
    let area = 0
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      area += a[0] * b[1] - b[0] * a[1]
    }
    if (area < 0) pts.reverse()
    let k = 0
    for (let i = 1; i < pts.length; i++) {
      const ai = (ang(pts[i]) + 2 * Math.PI) % (2 * Math.PI), ak = (ang(pts[k]) + 2 * Math.PI) % (2 * Math.PI)
      if (ai < ak) k = i
    }
    pts = [...pts.slice(k), ...pts.slice(0, k)]
    const a0 = (ang(pts[0]) + 2 * Math.PI) % (2 * Math.PI)
    const angles = pts.map((v) => {
      let a = (ang(v) + 2 * Math.PI) % (2 * Math.PI)
      if (a < a0 - 1e-9) a += 2 * Math.PI
      return a
    })
    return { pts: [...pts, pts[0]], angles: [...angles, a0 + 2 * Math.PI] }
  }
  const A = prep(outer), B = prep(inner)
  let i = 0, j = 0
  const na = A.pts.length - 1, nb = B.pts.length - 1
  while (i < na || j < nb) {
    if (j >= nb || (i < na && A.angles[i + 1] <= B.angles[j + 1])) {
      tri(p, A.pts[i], A.pts[i + 1], B.pts[j], hint)
      i++
    } else {
      tri(p, A.pts[i], B.pts[j + 1], B.pts[j], hint)
      j++
    }
  }
}

/** A closed polygon offset inwards by d (convex, counter-clockwise). */
function inset(poly: [number, number][], d: number): [number, number][] {
  const n = poly.length
  return poly.map((p, i) => {
    const a = poly[(i - 1 + n) % n], b = poly[(i + 1) % n]
    const e1 = unit([p[0] - a[0], p[1] - a[1], 0]), e2 = unit([b[0] - p[0], b[1] - p[1], 0])
    // inward normals of a counter-clockwise polygon point left of each edge
    const n1: V3 = [-e1[1], e1[0], 0], n2: V3 = [-e2[1], e2[0], 0]
    const m = unit(add(n1, n2))
    const k = d / Math.max(0.3, dot(m, n1))
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}

// ---------------------------------------------------------------------------
// Parts.

const cladding = new Part() // the flared wall and its lip
const led = new Part() // every other wall panel: the colour LED wash at night, cladding by day
const roofWhite = new Part() // the dome
const band = new Part() // the podium's panelled band and parapet
const concrete = new Part() // the podium below the plaza, piers, ledges, its roof terrace, the gutter
const glazing = new Part() // window slots on the wall, the concourse glazing

// ---------------------------------------------------------------------------
// The flared wall: PANELS panels, each folded slightly along its centre line
// so neighbouring halves catch the light differently and the drum reads as a
// ring of tall vertical panels. Smooth up the profile, creased at each fold.
const COLS = PANELS * 2
const colAngle = (c: number) => (c / COLS) * 2 * Math.PI
/** The fold fades out at the foot and toward the lip, so the rim stays a clean circle. */
const foldAt = (k: number) => FOLD * Math.min(1, k / 2, (WALL.length - 1 - k) / 3 + 0.15)
const colR = (c: number, r: number, k = 1) => (c % 2 ? r + foldAt(k) : r)
const wallPt = (c: number, k: number): V3 => polar(colAngle(c), colR(c, WALL[k][1], k), WALL[k][0])
const wallRing = (k: number) => Array.from({ length: COLS }, (_, c) => wallPt(c, k))

/** Window slots: a dark band at mid-height in eight long, evenly spaced runs (p01). */
const SLOT_PATTERN = [1, 1, 1, 1, 0, 0] // eight long slots, one every 6 panels (45 degrees)
const isSlot = (panel: number) => SLOT_PATTERN[panel % SLOT_PATTERN.length] === 1

for (let c = 0; c < COLS; c++) {
  const c1 = (c + 1) % COLS
  const panel = Math.floor(c / 2)
  for (let k = 0; k < WALL.length - 1; k++) {
    const P = [wallPt(c, k), wallPt(c1, k), wallPt(c1, k + 1), wallPt(c, k + 1)]
    // Normal of this half-panel at each row: horizontal edge x profile tangent.
    const nAt = (kk: number) => {
      const h = sub(wallPt(c1, kk), wallPt(c, kk))
      const lo = Math.max(0, kk - 1), hi = Math.min(WALL.length - 1, kk + 1)
      const v = sub(add(wallPt(c, hi), wallPt(c1, hi)), add(wallPt(c, lo), wallPt(c1, lo)))
      let n = unit(cross(h, v))
      const out = dirOf((colAngle(c) + colAngle(c + 1)) / 2)
      if (dot(n, out) < 0) n = scale(n, -1)
      return n
    }
    const n0 = nAt(k), n1 = nAt(k + 1)
    const target = k === SLOT_ROW && isSlot(panel) ? glazing : panel % 2 === 0 ? led : cladding
    const out = dirOf((colAngle(c) + colAngle(c + 1)) / 2)
    quad(target, P, out, [n0, n0, n1, n1])
  }
}

// The lip: a 0.4 m chamfer from the wall's top edge to the rim's flat top,
// the flat top in to the gutter, the gutter, and the step up to the dome.
{
  const top = WALL.length - 1
  const lipTop = (c: number): V3 => polar(colAngle(c), WALL[top][1] - 0.4, RIM)
  for (let c = 0; c < COLS; c++) {
    const c1 = (c + 1) % COLS
    const out = dirOf((colAngle(c) + colAngle(c + 1)) / 2)
    quad(cladding, [wallPt(c, top), wallPt(c1, top), lipTop(c1), lipTop(c)], add(out, UP))
    quad(cladding, [lipTop(c), lipTop(c1), polar(colAngle(c1), RIM_IN, RIM), polar(colAngle(c), RIM_IN, RIM)], UP)
    // inner face of the rim, facing the dome
    quad(cladding, [polar(colAngle(c), RIM_IN, RIM), polar(colAngle(c1), RIM_IN, RIM), polar(colAngle(c1), RIM_IN, GUTTER), polar(colAngle(c), RIM_IN, GUTTER)], scale(out, -1))
    quad(concrete, [polar(colAngle(c), RIM_IN, GUTTER), polar(colAngle(c1), RIM_IN, GUTTER), polar(colAngle(c1), DOME_EDGE, GUTTER), polar(colAngle(c), DOME_EDGE, GUTTER)], UP)
    quad(concrete, [polar(colAngle(c), DOME_EDGE, GUTTER), polar(colAngle(c1), DOME_EDGE, GUTTER), polar(colAngle(c1), DOME_EDGE, DOME[0][1]), polar(colAngle(c), DOME_EDGE, DOME[0][1])], out)
  }
}

// ---------------------------------------------------------------------------
// The dome: a smooth shell through the measured rings. Its outer ring has the
// wall's 96 points so it closes on the gutter step; the rest has 48.
{
  const zR = (r: number) => {
    for (let i = 0; i < DOME.length - 1; i++) {
      const [r0, z0] = DOME[i], [r1, z1] = DOME[i + 1]
      if (r <= r0 && r >= r1) return z0 + ((z1 - z0) * (r - r0)) / (r1 - r0)
    }
    return DOME[DOME.length - 1][1]
  }
  const slope = (r: number) => (zR(Math.max(0, r - 1.5)) - zR(Math.min(DOME_EDGE, r + 1.5))) / (Math.min(DOME_EDGE, r + 1.5) - Math.max(0, r - 1.5))
  const nrm = (t: number, r: number): V3 => {
    const s = slope(r) // drop per metre outward
    return unit([Math.sin(t) * s, Math.cos(t) * s, 1])
  }
  const ang = (i: number, n: number) => (i / n) * 2 * Math.PI
  // Outer band: 96-point ring at the edge to the 48-point ring at r = 104.
  const r0 = DOME[0][0], r1 = DOME[1][0]
  for (let j = 0; j < DOME_SEG; j++) {
    const ta = ang(j, DOME_SEG), tb = ang(j + 1, DOME_SEG), tm = ang(2 * j + 1, COLS)
    const o0 = polar(ta, r0, zR(r0)), om = polar(tm, r0, zR(r0)), o1 = polar(tb, r0, zR(r0))
    const i0 = polar(ta, r1, zR(r1)), i1 = polar(tb, r1, zR(r1))
    const no0 = nrm(ta, r0), nom = nrm(tm, r0), no1 = nrm(tb, r0), ni0 = nrm(ta, r1), ni1 = nrm(tb, r1)
    roofWhite.tri(o0, om, i0, undefined, undefined, undefined, [no0, nom, ni0])
    roofWhite.tri(om, i1, i0, undefined, undefined, undefined, [nom, ni1, ni0])
    roofWhite.tri(om, o1, i1, undefined, undefined, undefined, [nom, no1, ni1])
  }
  for (let k = 1; k < DOME.length - 1; k++) {
    const ra = DOME[k][0], rb = DOME[k + 1][0]
    for (let j = 0; j < DOME_SEG; j++) {
      const ta = ang(j, DOME_SEG), tb = ang(j + 1, DOME_SEG)
      if (rb === 0) {
        roofWhite.tri(polar(ta, ra, zR(ra)), polar(tb, ra, zR(ra)), [CX, CY, zR(0)], undefined, undefined, undefined, [nrm(ta, ra), nrm(tb, ra), UP])
        continue
      }
      quad(roofWhite, [polar(ta, ra, zR(ra)), polar(tb, ra, zR(ra)), polar(tb, rb, zR(rb)), polar(ta, rb, zR(rb))], UP,
        [nrm(ta, ra), nrm(tb, ra), nrm(tb, rb), nrm(ta, rb)])
    }
  }
}

// ---------------------------------------------------------------------------
// The podium, on the OSM outline: concrete from the street to the plaza deck,
// the glazed concourse level set back behind tapered piers, the panelled band
// above it, a low parapet and the flat roof terrace in to the wall's foot.
{
  const SET = 1.5 // concourse glazing set back
  const outer = OUTLINE
  const recess = inset(OUTLINE, SET)
  const par = inset(OUTLINE, 0.6)
  const n = outer.length
  const at = (p: [number, number], z: number): V3 => [p[0], p[1], z]
  const outN = (i: number): V3 => {
    const a = outer[i], b = outer[(i + 1) % n]
    return unit([b[1] - a[1], -(b[0] - a[0]), 0])
  }
  // Split each edge into pieces no longer than 5 m near the ground, so the
  // map's terrain drape follows them.
  for (let i = 0; i < n; i++) {
    const i1 = (i + 1) % n, o = outN(i)
    const a = outer[i], b = outer[i1]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.max(1, Math.ceil(L / 5))
    for (let s = 0; s < m; s++) {
      const p = (u: number): [number, number] => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]
      quad(concrete, [at(p(s / m), 0), at(p((s + 1) / m), 0), at(p((s + 1) / m), DECK), at(p(s / m), DECK)], o)
    }
    // ledge at deck level
    quad(concrete, [at(a, DECK), at(b, DECK), at(recess[i1], DECK), at(recess[i], DECK)], UP)
    // concourse glazing
    quad(glazing, [at(recess[i], DECK), at(recess[i1], DECK), at(recess[i1], ENTRY), at(recess[i], ENTRY)], o)
    // soffit under the band
    quad(band, [at(recess[i], ENTRY), at(recess[i1], ENTRY), at(b, ENTRY), at(a, ENTRY)], DOWN)
    // the band and the parapet's outer face, with a small chamfer on top
    quad(band, [at(a, ENTRY), at(b, ENTRY), at(b, PARAPET - 0.3), at(a, PARAPET - 0.3)], o)
    const ca = inset(OUTLINE, 0.3)
    quad(band, [at(a, PARAPET - 0.3), at(b, PARAPET - 0.3), at(ca[i1], PARAPET), at(ca[i], PARAPET)], add(o, UP))
    quad(band, [at(ca[i], PARAPET), at(ca[i1], PARAPET), at(par[i1], PARAPET), at(par[i], PARAPET)], UP)
    quad(band, [at(par[i], PARAPET), at(par[i1], PARAPET), at(par[i1], PODIUM), at(par[i], PODIUM)], scale(o, -1))
  }
  // Tapered piers in the concourse level, every ~17 m along the outline.
  {
    const len: number[] = [0]
    for (let i = 0; i < n; i++) {
      const a = outer[i], b = outer[(i + 1) % n]
      len.push(len[i] + Math.hypot(b[0] - a[0], b[1] - a[1]))
    }
    const total = len[n], count = 48
    for (let k = 0; k < count; k++) {
      const s = ((k + 0.5) / count) * total
      let i = 0
      while (len[i + 1] < s) i++
      const a = outer[i], b = outer[(i + 1) % n], u = (s - len[i]) / (len[i + 1] - len[i])
      const e = unit([b[0] - a[0], b[1] - a[1], 0]), o = outN(i), inw = scale(o, -1)
      const c: V3 = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 0]
      const P = (w: number, d: number, z: number): V3 => add(add(add(c, scale(e, w)), scale(inw, d)), [0, 0, z])
      const wb = 0.7, wt = 1.4, d = SET + 0.1
      quad(concrete, [P(-wb, 0, DECK), P(wb, 0, DECK), P(wt, 0, ENTRY), P(-wt, 0, ENTRY)], o)
      quad(concrete, [P(wb, 0, DECK), P(wb, d, DECK), P(wt, d, ENTRY), P(wt, 0, ENTRY)], e)
      quad(concrete, [P(-wb, d, DECK), P(-wb, 0, DECK), P(-wt, 0, ENTRY), P(-wt, d, ENTRY)], scale(e, -1))
    }
  }
  // The roof terrace, from the parapet's inner face to the wall's foot.
  {
    let m = Infinity
    for (let i = 0; i < n; i++) {
      const a = par[i], b = par[(i + 1) % n], ab = [b[0] - a[0], b[1] - a[1]]
      const u = Math.max(0, Math.min(1, ((CX - a[0]) * ab[0] + (CY - a[1]) * ab[1]) / (ab[0] ** 2 + ab[1] ** 2)))
      m = Math.min(m, Math.hypot(a[0] + ab[0] * u - CX, a[1] + ab[1] * u - CY))
    }
    console.log(`podium parapet clearance from the wall's foot: ${(m - WALL[0][1]).toFixed(2)} m`)
  }
  zipper(concrete, par.map((p) => at(p, PODIUM)), wallRing(0), UP)
}

// ---------------------------------------------------------------------------

/** Night: the cladding is washed with colour LEDs; brightest on the waist. */
const wallLight = (p: V3, nv: V3) => {
  const side = Math.hypot(nv[0], nv[1])
  if (p[2] < PODIUM - 0.1 || p[2] > RIM + 0.1) return 0
  return Math.min(1, side * 1.15) * (0.75 + 0.25 * Math.sin(Math.PI * Math.min(1, Math.max(0, (p[2] - PODIUM) / (RIM - PODIUM)))))
}

/** Champagne-bronze, pulled to the palette's lightness (p01, Infrogmation 2025). */
const CLAD = 0xc0a782

const parts = [
  { part: cladding, material: { ...finish('superdome-cladding', CLAD), floodlight: wallLight } },
  { part: led, material: finish('neon-superdome-led', CLAD) },
  { part: roofWhite, material: finish('superdome-roof', 0xf1efea) },
  { part: band, material: finish('superdome-band', 0xa9a193) },
  { part: concrete, material: finish('superdome-concrete', 0xb4ada0) },
  { part: glazing, material: PALETTE.window },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(22), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Caesars Superdome', parts, {
  license: 'CC0-1.0', bearing: 0, anchor: [29.9510518, -90.0810878], height: DOME[DOME.length - 1][1],
  frame: 'Y up, -Z north, +X east, metres; origin at street level under the anchor',
  replaces: ['relation/4598860', 'way/25890330', 'way/126815370'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/nola-caesars-superdome.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
