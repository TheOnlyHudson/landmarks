/**
 * One Thousand Museum (2019, Zaha Hadid Architects), 1000 Biscayne
 * Boulevard, Miami — original procedural geometry, CC0-1.0.
 * bun generators/mia-one-thousand-museum.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM multipolygon relation/9396621
 * (outer ways 676817041 + 676817042), 25.7842263, -80.1901470. The tower's
 * walls run 1.85° anticlockwise of the compass axes, so the catalog bearing
 * is 358.15 and the model is square to its own frame.
 *
 * Identity: the white curving exoskeleton over dark glass. Each face has
 * two inner ribs that rise from a single central leg, swing out to the
 * quarter points, close again and cross in an X at mid-height, then run up
 * to the corners; the four corner columns wrap the chamfered corners and
 * splay out at the foot, where they and the central legs frame two tall
 * semicircular-headed arches per face, filled with white louvres. The
 * lower corner fields between the ribs and the corners carry the white
 * scalloped balconies (drawn as a pale field). On the north and south
 * faces a second X closes near the crown (the "figure eight" seen in
 * Pessar's photo from below). Flat roof with the round helipad.
 *
 * Sources:
 *  - OSM: relation/9396621 (building, 216 m, 62 levels, wikidata
 *    Q19817557); tower part relation/9396620 (outer ways 676817041 +
 *    676817043, 216 m); helipad part way/1105396201 (a circle, 220 m).
 *  - Lidar: USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019, the year of completion), 1 m grid: roof 212.5–215 m above the
 *    street (measured; no 220 m return, so the helipad deck is drawn just
 *    above the roof at 216); tower x -8..30, y -22..14 in the model frame
 *    (measured; OSM's part x -8..32, y -24..13.5); west podium x -32..-8,
 *    25.5–27 m (measured). The strip north of the tower (y 14..24) returns
 *    nothing in the 2019 cloud and is left unbuilt (see doubts).
 *  - Published: 216 m (709 ft), 62 storeys (Wikipedia, CTBUH).
 *  - Estimated from the photos below, scaled by the tower width: rib
 *    paths (node at about half height, ribs reaching the corners at about
 *    0.75 H), arch heads ~26 m, balcony fields up to ~95 m, top flare
 *    0.8 m, rib widths (drawn bolder than real: 3.4 m inner ribs, 2.8 m
 *    corner bands round 3.2 m chamfers, so they read at 80 px). Night: the
 *    exoskeleton carries `_FLOODLIGHT`, strongest at the base and crown —
 *    an estimate; no licensed night photo was found.
 *  - Colours: white exoskeleton, glass a dark slate blue (pulled light),
 *    balcony fields pale grey, louvres mid grey: from the daylight photos.
 *
 * Photos (Wikimedia Commons, daylight):
 *  - One_Thousand_Museum_March_2019.jpg, Godsfriendchuck, CC BY-SA 4.0 —
 *    from Biscayne Bay to the east: the whole tower, the east face's X and
 *    balcony fields, the splayed legs and arches;
 *  - One_Thousand_Museum_Tower_Downtown_Miami_-_Tower.jpg, Phillip Pessar,
 *    CC BY 2.0 — looking up a face: ribs and the crown X;
 *  - One_Thousand_Museum_(50741507697).jpg, Rob Olivera, CC BY 2.0 — the
 *    crown from below, the figure-eight loop;
 *  - 1000_Museum_2020-03_07.jpg and _05.jpg, Teoamez, CC BY-SA 4.0 — the
 *    base: arches with louvres, central leg, corner legs;
 *  - 1000_Museum_2020-03_03.jpg, Teoamez, CC BY-SA 4.0 — the white
 *    perforated podium and its arched entrance.
 * No commercial imagery or 3D tiles. No look-only sources.
 *
 * Doubts: the rib paths are simplified to one pattern per pair of faces;
 * which faces carry the crown X is read from photos whose direction is not
 * certain (assumed north and south). The strip of the OSM outline north of
 * the tower (driveway / low deck) has no lidar returns and no photo, so it
 * is left open. The podium's north end meets Ten Museum Park's podium.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, walls, capRing, face, build, bevel } from './mia-panorama-tower'

const CX = 11.8, CY = -5.0          // tower centre (OSM part / lidar)
const TOP = 214.6                   // roof edge (lidar 212.5–215)
const A = 2.8, C = 3.2, P = 0.8     // corner band width, chamfer, rib proud
const smooth = (a: number, b: number, z: number) => { const t = Math.min(1, Math.max(0, (z - a) / (b - a))); return t * t * (3 - 2 * t) }
// exoskeleton plane half-widths: straight shaft, flaring 0.8 m at the crown
const HX = (z: number) => 18.2 + 0.8 * smooth(185, TOP, z)
const HY = (z: number) => 17.0 + 0.8 * smooth(185, TOP, z)
// corner legs splay out at the foot
const LEG = (z: number) => (z < 38 ? 2.0 * (1 - z / 38) ** 2 : 0)

const exo = new Part(), glass = new Part(), balc = new Part(), louvre = new Part(), roof = new Part(), podium = new Part()

// ---------------- faces ----------------
type Face = { n: XY; t: XY; D: (z: number) => number; H: (z: number) => number; crown: boolean }
const FACES: Face[] = [
  { n: [1, 0], t: [0, 1], D: HX, H: HY, crown: false },   // east
  { n: [0, 1], t: [-1, 0], D: HY, H: HX, crown: true },   // north
  { n: [-1, 0], t: [0, -1], D: HX, H: HY, crown: false }, // west
  { n: [0, -1], t: [1, 0], D: HY, H: HX, crown: true },   // south
]
const U = (f: Face, z: number) => f.H(z) - C - A / 2   // u = ±1 lands in the corner band
const P3 = (f: Face, u: number, z: number, d: number): V3 => [CX + f.n[0] * d + f.t[0] * u, CY + f.n[1] * d + f.t[1] * u, z]

/** Catmull-Rom through control points (u normalised, z m), `per` samples a span. */
function curve(pts: XY[], per = 3): XY[] {
  const out: XY[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)) as XY)
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

/** A rib: a flat-fronted band `w` wide along a path of (u metres, z) on a face. */
function rib(part: Part, f: Face, path: XY[], w: number) {
  const L: XY[] = [], R: XY[] = []
  path.forEach((p, i) => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)]
    let du = b[0] - a[0], dz = b[1] - a[1]; const l = Math.hypot(du, dz) || 1; du /= l; dz /= l
    L.push([p[0] - dz * w / 2, p[1] + du * w / 2]); R.push([p[0] + dz * w / 2, p[1] - du * w / 2])
  })
  const fr = (q: XY) => P3(f, q[0], Math.max(0, q[1]), f.D(q[1]) + P), bk = (q: XY) => P3(f, q[0], Math.max(0, q[1]), f.D(q[1]) - 0.6)
  const nrm: V3 = [f.n[0], f.n[1], 0]
  for (let i = 0; i < path.length - 1; i++) {
    face(part, [fr(L[i]), fr(R[i]), fr(R[i + 1]), fr(L[i + 1])], nrm)
    for (const [S, s] of [[L, 1], [R, -1]] as [XY[], number][]) {
      const du = S[i + 1][0] - S[i][0], dz = S[i + 1][1] - S[i][1], l = Math.hypot(du, dz) || 1
      const pu = (-dz / l) * s, pz = (du / l) * s // outward from the band, in (u, z)
      face(part, [fr(S[i]), fr(S[i + 1]), bk(S[i + 1]), bk(S[i])], [f.t[0] * pu, f.t[1] * pu, pz])
    }
  }
}

/** Normalised control points → metres on face f. */
const toM = (f: Face, pts: XY[]) => pts.map(([u, z]) => [u * U(f, z), z] as XY)

const INNER: XY[] = [[0, 0], [-0.03, 12], [-0.16, 24], [-0.42, 40], [-0.52, 58], [-0.46, 78], [-0.24, 95], [0, 107], [0.3, 124], [0.68, 143], [0.94, 160], [1.02, 172]]
const SPRING = 20, PIER = 2.4, APRON = 32 // arch springing, half central leg, apron top
const CROWN: XY[] = [[-1.02, 146], [-0.8, 160], [-0.4, 178], [0, 191], [0.3, 202], [0.52, TOP - 0.4]]

for (const f of FACES) {
  for (const s of [1, -1]) {
    const mir = (pts: XY[]) => pts.map(([u, z]) => [u * s, z] as XY)
    const inner = curve(toM(f, mir(INNER)))
    rib(exo, f, inner, 3.4)
    if (f.crown) rib(exo, f, curve(toM(f, mir(CROWN))), 3.4)

    // the arch between the corner leg and the central leg: a real semicircle
    const uAt = (z: number) => { for (let i = 0; i < inner.length - 1; i++) if (inner[i + 1][1] >= z) { const t = (z - inner[i][1]) / (inner[i + 1][1] - inner[i][1]); return inner[i][0] + t * (inner[i + 1][0] - inner[i][0]) } return inner[inner.length - 1][0] }
    const spring = SPRING
    const x0 = -s * (f.H(spring) - C - A), x1 = -s * PIER
    const cu = (x0 + x1) / 2, r = Math.abs(x1 - x0) / 2
    const q = (a: number, d: number, dz = 0): V3 => P3(f, cu + s * Math.cos(a) * r, spring + Math.sin(a) * r + dz, d)
    const n: V3 = [f.n[0], f.n[1], 0]
    const dF = f.D(10) + 0.5, dB = f.D(10) - 1.9 // apron face, recessed louvres
    // louvre field filling the arch
    face(louvre, [P3(f, x0, 0, dB), P3(f, x1, 0, dB), P3(f, x1, spring, dB), P3(f, x0, spring, dB)], n)
    for (let k = 0; k < 10; k++) {
      const a0 = (Math.PI * k) / 10, a1 = (Math.PI * (k + 1)) / 10
      face(louvre, [P3(f, cu, spring, dB), q(a0, dB), q(a1, dB)], n)
      // white spandrel over the arch up to the apron top, and the arch soffit
      face(exo, [q(a0, dF), q(a1, dF), P3(f, cu + s * Math.cos(a1) * r, APRON, dF), P3(f, cu + s * Math.cos(a0) * r, APRON, dF)], n)
      const m = (a0 + a1) / 2
      face(exo, [q(a0, dF), q(a0, dB), q(a1, dB), q(a1, dF)], [-f.t[0] * s * Math.cos(m), -f.t[1] * s * Math.cos(m), -Math.sin(m)])
    }
    // the jambs (the arch's reveals)
    face(exo, [P3(f, x1, 0, dF), P3(f, x1, spring, dF), P3(f, x1, spring, dB), P3(f, x1, 0, dB)], [-f.t[0] * s, -f.t[1] * s, 0])
    face(exo, [P3(f, x0, 0, dF), P3(f, x0, 0, dB), P3(f, x0, spring, dB), P3(f, x0, spring, dF)], [f.t[0] * s, f.t[1] * s, 0])
    // the central leg (half of it; the mirror draws the other half)
    face(exo, [P3(f, x1, 0, dF), P3(f, 0, 0, dF), P3(f, 0, spring, dF), P3(f, x1, spring, dF)], n)
    // the apron's top edge, a short soffit up to the ribs
    face(exo, [P3(f, x0, APRON, dF), P3(f, 0, APRON, dF), P3(f, 0, APRON, f.D(APRON) - 1), P3(f, x0, APRON, f.D(APRON) - 1)], [0, 0, 1])
    // pale balcony field between the rib and the corner band, above the arch
    const zs: number[] = []; for (let z = APRON; z < 96; z += 6) zs.push(z); zs.push(96)
    const dc = (z: number) => f.D(z) - 1 + 0.06
    for (let i = 0; i < zs.length - 1; i++) {
      const z0 = zs[i], z1 = zs[i + 1], e0 = -s * (f.H(z0) - C - A + 0.3), e1 = -s * (f.H(z1) - C - A + 0.3)
      face(balc, [P3(f, e0, z0, dc(z0)), P3(f, uAt(z0), z0, dc(z0)), P3(f, uAt(z1), z1, dc(z1)), P3(f, e1, z1, dc(z1))], [f.n[0], f.n[1], 0])
    }
  }
}

// ---------------- glass core ----------------
const ring = (X: number, Y: number, c: number): XY[] => [[X, Y - c], [X - c, Y], [-X + c, Y], [-X, Y - c], [-X, -Y + c], [-X + c, -Y], [X - c, -Y], [X, -Y + c]].map(([x, y]) => [x + CX, y + CY] as XY)
const coreAt = (z: number, inset = 1) => ring(HX(z) - inset, HY(z) - inset, C + 0.6)
walls(coreAt(0, 1.9), [[0, 22, louvre]])
capRing(louvre, coreAt(0, 1.9), 22)
const LV = [22, 120, 185, 195, 205, TOP]
for (let i = 0; i < LV.length - 1; i++) {
  const a = coreAt(LV[i]), b = coreAt(LV[i + 1])
  for (let k = 0; k < a.length; k++) {
    const j = (k + 1) % a.length
    const e = [b[j][0] - a[k][0], b[j][1] - a[k][1]]
    const n: V3 = [a[j][1] - a[k][1], -(a[j][0] - a[k][0]), 0]
    const l = Math.hypot(n[0], n[1]); n[0] /= l; n[1] /= l; void e
    face(glass, [[a[k][0], a[k][1], LV[i]], [a[j][0], a[j][1], LV[i]], [b[j][0], b[j][1], LV[i + 1]], [b[k][0], b[k][1], LV[i + 1]]], n)
  }
}

// ---------------- corner columns ----------------
const ZC = [0, 6, 12, 18, 24, 30, 38, 120, 185, 195, 205, TOP + 0.4]
for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  const rings = ZC.map((z) => {
    const X = HX(z) + LEG(z), Y = HY(z) + LEG(z)
    let pts: XY[] = [[X + P, Y - C - A], [X + P, Y - C], [X - C, Y + P], [X - C - A, Y + P], [X - C - A, Y - C - A]]
    pts = pts.map(([x, y]) => [CX + sx * x, CY + sy * y] as XY)
    if (sx * sy < 0) pts.reverse()
    return pts.map(([x, y]) => [x, y, z] as V3)
  })
  for (let k = 0; k < rings.length - 1; k++) {
    const a = rings[k], b = rings[k + 1]
    for (let i = 0; i < a.length; i++) {
      const j = (i + 1) % a.length
      const n: V3 = [a[j][1] - a[i][1], -(a[j][0] - a[i][0]), 0]; const l = Math.hypot(n[0], n[1]); n[0] /= l; n[1] /= l
      face(exo, [a[i], a[j], b[j], b[i]], n)
    }
  }
  face(exo, rings[rings.length - 1], [0, 0, 1])
}

// ---------------- crown: white rim, roof, helipad ----------------
const rim = ring(HX(TOP) + 0.2, HY(TOP) + 0.2, C + 0.4)
walls(rim, [[TOP - 1.6, TOP, exo]])
capRing(exo, rim, TOP - 1.6, false)
capRing(roof, rim, TOP)
const pad = (r: number, z: number): XY[] => Array.from({ length: 16 }, (_, k) => [CX + r * Math.cos((k * Math.PI) / 8), CY + r * Math.sin((k * Math.PI) / 8)] as XY)
walls(pad(4, 0), [[TOP, TOP + 1, roof]])
walls(pad(8, 0), [[TOP + 1, TOP + 1.6, exo]])
capRing(exo, pad(8, 0), TOP + 1, false)
capRing(exo, pad(8, 0), TOP + 1.6)

// ---------------- west podium (parking, pool deck on top) ----------------
const POD: XY[] = bevel(ccw([[-32.4, -24.0], [-7.4, -24.0], [-7.4, 22.6], [-32.4, 22.6]]), 2.5)
walls(POD, [[0, 26, podium]])
capRing(roof, POD, 26)
// arched entrance on the south front (Teoamez 03): a semicircular-headed opening
{
  const cxE = -20, w = 9, zS = 6, y = -24.0 - 0.06, n: V3 = [0, -1, 0]
  face(louvre, [[cxE - w / 2, y, 0.3], [cxE + w / 2, y, 0.3], [cxE + w / 2, y, zS], [cxE - w / 2, y, zS]], n)
  for (let k = 0; k < 10; k++) {
    const a0 = (Math.PI * k) / 10, a1 = (Math.PI * (k + 1)) / 10
    face(louvre, [[cxE, y, zS], [cxE + Math.cos(a0) * w / 2, y, zS + Math.sin(a0) * w / 2], [cxE + Math.cos(a1) * w / 2, y, zS + Math.sin(a1) * w / 2]], n)
  }
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[2] < 60 ? 0.9 : p[2] > 180 ? 0.7 : 0.45)
if (import.meta.main) {
  await build('One Thousand Museum', 'mia-one-thousand-museum', [
    { part: exo, material: { ...finish('otm-exoskeleton', 0xf2f0eb), floodlight: lit } },
    { part: glass, material: windowVariant(2, 0x56718a) },
    { part: balc, material: windowVariant(3, 0x93a5b3) },
    { part: louvre, material: finish('otm-louvre', 0x939ca3) },
    { part: roof, material: PALETTE.roof },
    { part: podium, material: finish('otm-podium', 0xe7e4dd) },
  ], { bearing: 358.15, elevation: 0, height: TOP + 1.6, replaces: ['relation/9396621', 'relation/9396620', 'way/1105396201'] }, process.argv[2], 6500)
}
