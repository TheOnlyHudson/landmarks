/**
 * Auckland War Memorial Museum (Tāmaki Paenga Hira), Auckland Domain:
 * procedural, CC0-1.0.
 * bun generators/auckland-war-memorial-museum.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 0.5 (the long
 * sides of OSM's outline run 0.3-0.8 degrees clockwise of north). Origin:
 * the area centroid of the outline way/23906678, moved 0.5 m west onto the
 * building's axis of symmetry (the portico's centre). y = 0 is the lowest
 * ground under the footprint; the museum stands on the flat top of the
 * Domain's hill (Mapterhorn z12 reads a 6.8 m plateau under it, falling to
 * about 5 m at the east and west edges, a z12 smear of the building and the
 * mound; photos show the ground level along every facade, so the model is
 * built level and its lowest 1-2 m sink at the edges).
 *
 * The 1929 building (Grierson, Aimer & Draffin) is the northern block: the
 * Greek Doric portico of eight columns facing the harbour, plain Portland
 * stone wings with two rows of tall windows, and a stepped attic over the
 * centre. The 1960 extension carries the walls south round two courts and
 * ends in a semicircular rotunda (the south entrance), which since 2006
 * holds the Grand Atrium: a copper "bowl" under a wavy glass-and-timber
 * roof that rises above the rotunda's attic (Noel Lane Architects).
 *
 * OSM (heights tagged by mappers): outline way/23906678 (14 m, 5 levels);
 * parts: portico way/832497384 (14 m), eight columns way/832497376-383
 * (12 m, about 2.3 m across), central attic way/832497385 (19 m), wing attic
 * blocks way/832497373 and way/832497374 (16 m), the glass ridge roof over
 * the centre way/832497375 (19-20.9 m), the atrium roof way/832497372 (dome,
 * 14-20.3 m, r 23.5); the south entrance canopy way/1315620264 (building=
 * roof, glass). All are drawn and replaced.
 *
 * Photo-scaled (columns 12 m from OSM as the scale):
 * - stylobate 1.6 m (p2, eight steps); column shafts r 1.0 tapering to 0.85,
 *   capitals to 13.0 m; architrave and triglyph frieze to 14.9, cornice to
 *   15.6 (p11, p2); the wings' cornice continues the portico's (p9, p11);
 *   parapet to 16.6; central attic to 19.5 (p11: 4 m over the cornice) with
 *   a stone step to 20.4 and the glass ridge to 21.9.
 * - windows: two rows, lower 3.0-7.2 m, upper 8.6-13.0 m, about 2.1 m wide,
 *   with a carved panel under each upper window (p2); bays about 5.2 m on
 *   the long sides (p10, p11).
 * - rotunda (p4, d3): 13 bays, lower windows 3.0-6.0, upper windows
 *   7.6-13.2 m 3.2 m wide with a band of green glass across the middle,
 *   frieze and cornice to 15.6, a set-back attic drum to 18.0 (the rear
 *   corner blocks rise with it); the glass roof reaches nearly to the attic
 *   (r 27.6, wider than OSM's 23.5 part, as d3 shows), its copper-edged rim
 *   waving from about 18 m (west) to 20.6 m (east) over a glazed clerestory,
 *   its crown at 23 m (d3, p8, d1).
 * - south canopy: glass at 5.6 m on slender posts (p4).
 * Estimated: bay counts on the wing ends (three) and wing fronts (four) are
 *   read loosely from p9, p10 and p11; the north steps' depth; the attic
 *   steps; the rotunda attic's set-back.
 * Left out: the inscriptions and carved friezes (a plain band), the light
 *   wells inside the 1929 block, lamp standards, the Court of Honour and the
 *   Cenotaph (separate), the copper bowl inside the atrium (not seen outside).
 *
 * Colours: Portland stone from p2 (sunlit #e2c4a6 at golden hour), p10/p11
 * (overcast #aa9ea0) and p4 (#8e959c shade) -> a pale cream-grey 0xe9e2d4,
 * cornices and columns a shade lighter 0xf3eee4; windows dark grey-blue
 * (palette); the rotunda's green spandrel glass #347173 and the roof glass
 * (#707f92, p8) as one blue-green glass 0x8fb0b6; the roof rim copper-bronze
 * from d3 -> 0x8f6a5a; flat roofs palette grey.
 *
 * Night: the stone is floodlit warm from below (p9, evening); windows and
 * the portico doors are `window`; the glass roof stays dark.
 *
 * Detail model (models/auckland-war-memorial-museum.detail.glb): fluted
 * columns (20 flutes) with echinus and abacus, triglyphs and mutules on the
 * frieze, carved panels and sills under the windows, clerestory mullions and
 * the glass roof's ribs, the canopy's beams.
 *
 * Photos (Wikimedia Commons):
 * - p1 "Aerial photograph of Auckland War Memorial Museum (1958).jpg", Whites Aviation, CC BY 4.0 (plan, during the 1960 extension)
 * - p2 "Auckland Museum (5931983261).jpg", possumgirl2, CC BY-SA 2.0 (portico, east wing)
 * - p4 "Auckland War Memorial Museum - Tāmaki Paenga Hira - External.jpg", Joyofmuseums, CC BY-SA 4.0 (south rotunda)
 * - p8 "Auckland War Memorial Museum from Birdwood Crescent, Parnell.jpg", Bjankuloski06, CC BY 4.0 (from the east, glass roof)
 * - p9 "Auckland War Memorial Museum in 2019 (evening) - 51087183122.jpg", Daan Hoffmann / Auckland War Memorial Museum, CC BY 2.0
 * - p10 "Auckland War Memorial Museum in 2019 - 51087183007.jpg", Daan Hoffmann / Auckland War Memorial Museum, CC BY 2.0
 * - p11 "Auckland War Memorial Museum in 2021.jpg", Daan Hoffmann / Auckland War Memorial Museum, CC BY 2.0
 * - d1 "Auckland Museum New Dome.jpg", Ingolfson, public domain
 * - d2 "Auckland Museum Model Stage II.jpg", Ingolfson, public domain (architect's model: plan and roofs)
 * - d3 "Auckland Museum With Rear Round Facade I.jpg", Ingolfson, public domain (rotunda and glass roof)
 * Look-only: none.
 * Doubts: which wing faces carry how many bays; the wing attic blocks'
 * height (OSM 16 m, drawn 17.8); the attic top was under scaffolding in p8.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { polyTris } from './berlin-oberbaum-bridge'
import { face, lathe, prism, box, skin, bar, ccw, saveLods, type XY, type Layer } from './auckland-sky-tower'

const TAU = Math.PI * 2
const C: XY = [0, -35.6], R = 31.3 // rotunda centre and radius
const CORNICE = 15.6, PARAPET = 16.6, BELT = 14.9

// ---- plan ------------------------------------------------------------------------------------------------
const rot: XY[] = []
{
  const a0 = Math.atan2(-45.4 - C[1], 29.4), a1 = Math.PI - a0 // -18.4 deg to -161.6 deg (through south)
  const n = 13
  for (let i = 0; i <= n; i++) {
    const a = a0 - ((a0 - (a1 - TAU)) * i) / n
    rot.push([C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)])
  }
}
const half: XY[] = [[19.2, 57.4], [19.2, 55.2], [43.6, 55.2], [43.6, 37.3], [38.3, 37.3], [38.3, 32.5], [39.0, 32.5], [39.0, -45.4]]
const PLAN: XY[] = ccw([
  ...half,
  ...rot,
  ...[...half].reverse().map(([x, y]) => [-x, y] as XY),
])

/** Miter offset of a ccw polygon, outward by d (negative: inward). */
function offset(poly: XY[], d: number): XY[] {
  const n = poly.length
  return poly.map((p, i) => {
    const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n]
    const e0: XY = [p[0] - a[0], p[1] - a[1]], e1: XY = [b[0] - p[0], b[1] - p[1]]
    const l0 = Math.hypot(...e0), l1 = Math.hypot(...e1)
    const n0: XY = [e0[1] / l0, -e0[0] / l0], n1: XY = [e1[1] / l1, -e1[0] / l1]
    const m: XY = [n0[0] + n1[0], n0[1] + n1[1]], k = 1 + n0[0] * n1[0] + n0[1] * n1[1]
    return [p[0] + (m[0] * d) / k, p[1] + (m[1] * d) / k]
  })
}
/** A flat cap over a polygon (with holes) at z, facing up or down. */
function cap(p: Part, poly: XY[], z: number, up = true, holes: XY[][] = []) {
  for (const [a, b, c] of polyTris(ccw(poly), holes)) face(p, [[a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z]], [0, 0, up ? 1 : -1])
}

type Set = { stone: Part; trim: Part; win: Part; glass: Part; roof: Part; copper: Part }
const mk = (): Set => ({ stone: new Part(), trim: new Part(), win: new Part(), glass: new Part(), roof: new Part(), copper: new Part() })
const low = mk(), det = mk()

/** Window holes in wall coordinates for a wall of length L with `bays` evenly spaced bays. */
function bayHoles(L: number, bays: number, margin: number, rows: [number, number][], w: number): XY[][] {
  const out: XY[][] = []
  if (bays <= 0) return out
  const span = L - 2 * margin, step = bays > 1 ? span / (bays - 1) : 0
  for (let k = 0; k < bays; k++) {
    const s = bays > 1 ? margin + k * step : L / 2
    for (const [z0, z1] of rows) out.push([[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s - w / 2, z1]])
  }
  return out
}
const ROWS: [number, number][] = [[3.0, 7.2], [8.6, 13.0]]

for (const [s, d] of [[low, false], [det, true]] as [Set, boolean][]) {
  // -- the body: walls to the belt course, roof inside the parapet
  prism(s.stone, PLAN, 0, BELT, { top: false })
  // frieze band and projecting cornice
  prism(s.trim, offset(PLAN, 0.42), BELT - 0.9, BELT, { top: false, bottom: true })
  prism(s.trim, offset(PLAN, 0.8), BELT, CORNICE, { top: false, bottom: true })
  // parapet ring and the roof
  const inner = offset(PLAN, -0.7)
  prism(s.stone, PLAN, CORNICE - 0.4, PARAPET, { holes: [inner] })
  cap(s.trim, offset(PLAN, 0.8), CORNICE, true, [PLAN])
  cap(s.roof, inner, CORNICE - 0.4)

  // -- facades: skins with real window reveals on every straight wall
  const n = PLAN.length
  for (let i = 0; i < n; i++) {
    const a = PLAN[i], b = PLAN[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    const onRot = Math.hypot(mx - C[0], my - C[1]) > R - 0.6 && my < -45.3
    let holes: XY[][] = []
    let rotunda = false
    if (onRot) {
      rotunda = true
      const isDoor = Math.abs(mx) < 1.5
      holes = isDoor
        ? [[[L / 2 - 1.8, 0.0], [L / 2 + 1.8, 0.0], [L / 2 + 1.8, 4.6], [L / 2 - 1.8, 4.6]], [[L / 2 - 1.6, 7.6], [L / 2 + 1.6, 7.6], [L / 2 + 1.6, 13.2], [L / 2 - 1.6, 13.2]]]
        : [[[L / 2 - 1.0, 3.0], [L / 2 + 1.0, 3.0], [L / 2 + 1.0, 6.0], [L / 2 - 1.0, 6.0]], [[L / 2 - 1.6, 7.6], [L / 2 + 1.6, 7.6], [L / 2 + 1.6, 13.2], [L / 2 - 1.6, 13.2]]]
    } else if (Math.abs(Math.abs(mx) - 39.0) < 0.1 && L > 40) holes = bayHoles(L, 15, 4.2, ROWS, 2.1) // long sides
    else if (Math.abs(my - 55.2) < 0.1 && L > 20) holes = bayHoles(L, 4, 4.0, ROWS, 2.1) // wing fronts
    else if (Math.abs(Math.abs(mx) - 43.6) < 0.1) holes = bayHoles(L, 5, 2.6, ROWS, 2.0) // wing ends (p9, p11: five bays)
    else if (Math.abs(my + 45.4) < 0.1 && L > 8) holes = bayHoles(L, 2, 2.8, ROWS, 2.1) // rear corners
    else if (Math.abs(my - 57.4) < 0.1) {
      // behind the portico: three doors between the middle columns, with transoms
      holes = [-7.16, 0, 7.16].map((x) => {
        const sx = x + L / 2
        return [[sx - 1.3, 1.6], [sx + 1.3, 1.6], [sx + 1.3, 7.4], [sx - 1.3, 7.4]] as XY[]
      })
    }
    skin(s.stone, s.win, a, b, 0, BELT - 0.9, 0.35, holes, { top: false })
    // the rotunda's green glass band across each upper window
    if (rotunda) {
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
      const W = (sv: number, z: number, dd: number): V3 => [a[0] + u[0] * sv + nn[0] * dd, a[1] + u[1] * sv + nn[1] * dd, z]
      face(s.glass, [W(L / 2 - 1.6, 9.9, 0.07), W(L / 2 + 1.6, 9.9, 0.07), W(L / 2 + 1.6, 11.0, 0.07), W(L / 2 - 1.6, 11.0, 0.07)], [nn[0], nn[1], 0])
    }
    // detail: a carved panel and sill under each upper window, and window bars
    if (d) {
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
      const W = (sv: number, z: number, dd: number): V3 => [a[0] + u[0] * sv + nn[0] * dd, a[1] + u[1] * sv + nn[1] * dd, z]
      for (const h of holes) {
        const s0 = h[0][0], s1 = h[1][0], z0 = h[0][1], z1 = h[2][1]
        if (z0 > 2 && z0 < 9) {
          // sill
          bar(s.trim, W(s0 - 0.25, z0 - 0.12, 0.5), W(s1 + 0.25, z0 - 0.12, 0.5), 0.3, 0.24, [0, 0, 1])
        }
        if (z0 > 8 && !rotunda) {
          // carved panel below the upper sill
          const pz0 = z0 - 1.25, pz1 = z0 - 0.3
          for (const [q0, q1] of [[s0, s1]]) {
            face(s.trim, [W(q0, pz0, 0.47), W(q1, pz0, 0.47), W(q1, pz1, 0.47), W(q0, pz1, 0.47)], [nn[0], nn[1], 0])
            face(s.trim, [W(q0, pz1, 0.35), W(q1, pz1, 0.35), W(q1, pz1, 0.47), W(q0, pz1, 0.47)], [0, 0, 1])
            face(s.trim, [W(q0, pz0, 0.47), W(q1, pz0, 0.47), W(q1, pz0, 0.35), W(q0, pz0, 0.35)], [0, 0, -1])
            face(s.trim, [W(q0, pz0, 0.35), W(q0, pz0, 0.47), W(q0, pz1, 0.47), W(q0, pz1, 0.35)], [-u[0], -u[1], 0])
            face(s.trim, [W(q1, pz0, 0.47), W(q1, pz0, 0.35), W(q1, pz1, 0.35), W(q1, pz1, 0.47)], [u[0], u[1], 0])
          }
        }
        // glazing bars: one mullion and a transom, flush
        if (z1 - z0 > 2.5 && s1 - s0 > 1.8) {
          const sm = (s0 + s1) / 2, zt = z0 + (z1 - z0) * 0.68
          face(s.trim, [W(sm - 0.08, z0, 0.1), W(sm + 0.08, z0, 0.1), W(sm + 0.08, z1, 0.1), W(sm - 0.08, z1, 0.1)], [nn[0], nn[1], 0])
          face(s.trim, [W(s0, zt - 0.08, 0.1), W(s1, zt - 0.08, 0.1), W(s1, zt + 0.08, 0.1), W(s0, zt + 0.08, 0.1)], [nn[0], nn[1], 0])
        }
      }
    }
  }

  // -- the galleries' raised roofs between the 1929 block and the rotunda (d2: two east-west halls with
  //    ridged skylights, courts between), drawn as low gabled roofs
  for (const yc of [4.0, 18.0]) {
    const x0 = -24, x1 = 24, hy = 4.2, z0 = CORNICE - 0.4, ze = CORNICE + 1.0, zr = CORNICE + 2.6
    box(s.stone, [0, yc], x1, hy, z0, ze, 0, { top: false })
    face(s.roof, [[x0, yc - hy, ze], [x1, yc - hy, ze], [x1, yc, zr], [x0, yc, zr]], [0, -(zr - ze), hy])
    face(s.roof, [[x1, yc + hy, ze], [x0, yc + hy, ze], [x0, yc, zr], [x1, yc, zr]], [0, zr - ze, hy])
    face(s.stone, [[x0, yc - hy, ze], [x0, yc, zr], [x0, yc + hy, ze]], [-1, 0, 0])
    face(s.stone, [[x1, yc - hy, ze], [x1, yc + hy, ze], [x1, yc, zr]], [1, 0, 0])
    { const zs = ze + (zr - ze) * (1 - 1.6 / hy) + 0.05; face(s.glass, [[x0 + 3, yc - 1.6, zs], [x1 - 3, yc - 1.6, zs], [x1 - 3, yc, zr + 0.05], [x0 + 3, yc, zr + 0.05]], [0, -(zr - ze), hy]) } // skylight strip
  }

  // -- the rotunda's set-back attic drum
  const ra0 = Math.atan2(rot[0][1] - C[1], rot[0][0] - C[0]), ra1 = ra0 - Math.PI * 0.795
  lathe(s.stone, C, [[R - 0.9, CORNICE - 0.4], [R - 0.9, 18.0], [R - 2.9, 18.0], [R - 2.9, CORNICE - 0.4]], d ? 40 : 16, { arc: [ra1, ra0] })

  // -- the rear corner blocks either side of the rotunda stand to the attic's height (d3)
  for (const sg of [-1, 1]) box(s.stone, [sg * 34.2, -41.6], 4.8, 3.8, CORNICE - 0.4, 18.0)

  // -- wing attic blocks and the central attic
  for (const sg of [-1, 1]) box(s.stone, [sg * 27.6, 46], 8.9, 4.0, CORNICE - 0.4, 17.8)
  prism(s.stone, [[-10.5, 36.1], [10.5, 36.1], [10.5, 39.6], [18.6, 39.6], [18.6, 52.7], [15.45, 52.7], [15.45, 56.1], [-15.45, 56.1], [-15.45, 52.7], [-18.6, 52.7], [-18.6, 39.6], [-10.5, 39.6]], CORNICE - 0.4, 19.5)
  // attic cornice lip
  prism(s.trim, [[-10.8, 35.8], [10.8, 35.8], [10.8, 39.3], [18.9, 39.3], [18.9, 53.0], [15.75, 53.0], [15.75, 56.4], [-15.75, 56.4], [-15.75, 53.0], [-18.9, 53.0], [-18.9, 39.3], [-10.8, 39.3]], 18.9, 19.5, { bottom: true })
  box(s.stone, [0, 46.4], 8.5, 7.9, 19.5, 20.4)
  // glass ridge roof, ridge east-west
  {
    const x0 = -6.6, x1 = 6.6, y0 = 38.8, y1 = 54.0, z0 = 20.4, zr = 21.9, ym = (y0 + y1) / 2
    face(s.glass, [[x0, y0, z0], [x1, y0, z0], [x1, ym, zr], [x0, ym, zr]], [0, -(zr - z0), ym - y0])
    face(s.glass, [[x1, y1, z0], [x0, y1, z0], [x0, ym, zr], [x1, ym, zr]], [0, zr - z0, ym - y0])
    face(s.glass, [[x0, y0, z0], [x0, ym, zr], [x0, y1, z0]], [-1, 0, 0])
    face(s.glass, [[x1, y0, z0], [x1, y1, z0], [x1, ym, zr]], [1, 0, 0])
  }

  // -- the portico: stylobate, steps, eight Greek Doric columns, entablature, blocking course
  const PX = 15.45, PY0 = 57.4, PY1 = 61.7, STY = 1.6, COLY = 59.5, CAP = 13.0
  box(s.trim, [0, (PY0 + PY1) / 2], PX, (PY1 - PY0) / 2, 0, STY)
  for (let k = 0; k < 6; k++) box(s.trim, [0, PY1 + 0.27 + k * 0.54], 11.5, 0.27 + 0.0, 0, STY - (k + 1) * (STY / 7))
  const cols = [-12.53, -8.95, -5.37, -1.79, 1.79, 5.37, 8.95, 12.53]
  for (const x of cols) {
    const c: XY = [x, COLY]
    if (d) {
      // fluted shaft: 20 flutes as a star profile in plan, lofted with entasis
      const F = 20, rings: V3[][] = []
      for (const [z, r] of [[STY, 1.0], [STY + 4, 0.98], [STY + 8, 0.93], [CAP - 1.3, 0.86]] as [number, number][]) {
        const ring: V3[] = []
        for (let i = 0; i < F * 2; i++) {
          const a = (i / (F * 2)) * TAU, rr = i % 2 ? r * 0.93 : r
          ring.push([x + rr * Math.cos(a), COLY + rr * Math.sin(a), z])
        }
        rings.push(ring)
      }
      for (let k = 0; k < rings.length - 1; k++) {
        const A = rings[k], B = rings[k + 1], m = A.length
        for (let i = 0; i < m; i++) {
          const j = (i + 1) % m
          const am = ((i + 0.5) / m) * TAU
          face(s.trim, [A[i], A[j], B[j], B[i]], [Math.cos(am), Math.sin(am), 0.03])
        }
      }
      lathe(s.trim, c, [[0.86, CAP - 1.3], [0.86, CAP - 1.05], [0.9, CAP - 0.95], [1.12, CAP - 0.62], [1.22, CAP - 0.5]], 24, { crease: 50 })
    } else {
      lathe(s.trim, c, [[1.0, STY], [0.97, STY + 6], [0.86, CAP - 1.0], [0.9, CAP - 0.9], [1.18, CAP - 0.5]], 12, { crease: 50 })
    }
    box(s.trim, c, 1.28, 1.28, CAP - 0.5, CAP, 0, { bottom: true })
  }
  // architrave, frieze (set back), cornice, blocking course
  box(s.trim, [0, (PY0 + 60.85) / 2], PX, (60.85 - PY0) / 2, CAP, CAP + 1.0, 0, { bottom: true })
  box(s.stone, [0, (PY0 + 60.7) / 2], PX - 0.1, (60.7 - PY0) / 2, CAP + 1.0, BELT, 0)
  box(s.trim, [0, (PY0 + 61.4) / 2], PX + 0.5, (61.4 - PY0) / 2, BELT, CORNICE, 0, { bottom: true })
  box(s.stone, [0, (PY0 + 61.0) / 2], PX, (61.0 - PY0) / 2, CORNICE, PARAPET + 0.3, 0)
  if (d) {
    // triglyphs over each column and between, and mutule blocks under the cornice
    for (let i = 0; i < 15; i++) {
      const x = -12.53 + i * 1.79
      box(s.trim, [x, 60.78], 0.42, 0.1, CAP + 1.0, BELT, 0)
    }
    for (let i = 0; i < 17; i++) {
      const x = -14.32 + i * 1.79
      box(s.trim, [x, 61.1], 0.35, 0.28, BELT - 0.12, BELT, 0, { bottom: true })
    }
    // antae on the wall behind the end columns
    for (const sg of [-1, 1]) box(s.trim, [sg * 14.8, PY0 + 0.25], 0.8, 0.25, STY, CAP + 0.0, 0)
  }
  // portico ceiling
  cap(s.trim, [[-PX, PY0], [PX, PY0], [PX, 60.85], [-PX, 60.85]], CAP - 0.02, false)

  // -- the atrium's glass roof: copper rim waving over a glazed clerestory, a shallow shell over the bowl
  const DR = 27.6, APEX = 23.0, DC: XY = [0, -35.6]
  const rim = (t: number) => 19.0 + 1.3 * Math.cos(t) + 0.35 * Math.cos(2 * t)
  const NA = d ? 72 : 32, NR = d ? 10 : 5
  const pt = (rr: number, t: number): V3 => {
    const q = rr / DR, z = rim(t) + 0.45 + (APEX - rim(t) - 0.45) * (1 - q * q)
    return [DC[0] + rr * Math.cos(t), DC[1] + rr * Math.sin(t), z]
  }
  for (let i = 0; i < NA; i++) {
    const t0 = (i / NA) * TAU, t1 = ((i + 1) / NA) * TAU
    // clerestory band from the roof to the rim
    const b0: V3 = [DC[0] + DR * Math.cos(t0), DC[1] + DR * Math.sin(t0), CORNICE - 0.4]
    const b1: V3 = [DC[0] + DR * Math.cos(t1), DC[1] + DR * Math.sin(t1), CORNICE - 0.4]
    const r0: V3 = [b0[0], b0[1], rim(t0)], r1: V3 = [b1[0], b1[1], rim(t1)]
    const tm = (t0 + t1) / 2, on: V3 = [Math.cos(tm), Math.sin(tm), 0]
    face(s.glass, [b0, b1, r1, r0], on)
    // copper rim fascia, standing a little proud
    const o = (p: V3, dd: number, dz: number): V3 => [p[0] + on[0] * dd, p[1] + on[1] * dd, p[2] + dz]
    face(s.copper, [o(r0, 0.35, -0.1), o(r1, 0.35, -0.1), o(r1, 0.35, 0.55), o(r0, 0.35, 0.55)], on)
    face(s.copper, [o(r0, 0, 0.55), o(r0, 0.35, 0.55), o(r1, 0.35, 0.55), o(r1, 0, 0.55)], [0, 0, 1])
    face(s.copper, [o(r0, 0.35, -0.1), o(r0, 0, -0.1), o(r1, 0, -0.1), o(r1, 0.35, -0.1)], [0, 0, -1])
    // shell
    for (let k = 0; k < NR; k++) {
      const ra = DR * (1 - k / NR), rb = DR * (1 - (k + 1) / NR)
      const A = pt(ra, t0), B = pt(ra, t1), Cc = pt(rb, t1), D = pt(rb, t0)
      const q = (ra + rb) / 2 / DR, slope = 2 * (APEX - rim(tm)) * q / DR
      const nrm: V3 = [Math.cos(tm) * slope, Math.sin(tm) * slope, 1]
      if (rb < 1e-6) face(s.glass, [A, B, Cc], nrm)
      else face(s.glass, [A, B, Cc, D], nrm)
    }
    if (d && i % 3 === 0) {
      // ribs over the shell and mullions in the clerestory
      const pts: V3[] = []
      for (let k = 0; k <= NR; k++) { const p = pt(DR * (1 - k / NR), t0); pts.push([p[0], p[1], p[2] + 0.12]) }
      for (let k = 0; k < pts.length - 1; k++) bar(s.copper, pts[k], pts[k + 1], 0.22, 0.18, [0, 0, 1])
      bar(s.copper, [b0[0] + Math.cos(t0) * 0.08, b0[1] + Math.sin(t0) * 0.08, b0[2]], [r0[0] + Math.cos(t0) * 0.08, r0[1] + Math.sin(t0) * 0.08, r0[2]], 0.16, 0.16, [Math.cos(t0), Math.sin(t0), 0])
    }
  }

  // -- the south entrance canopy: a glass ring sector on slender posts
  {
    const ta = -118 * Math.PI / 180, tb = -62 * Math.PI / 180, r0 = R + 0.4, r1 = R + 9.4, Z = 5.6, T = 0.3, m = d ? 20 : 10
    for (let i = 0; i < m; i++) {
      const t0 = ta + ((tb - ta) * i) / m, t1 = ta + ((tb - ta) * (i + 1)) / m
      const P = (r: number, t: number, z: number): V3 => [C[0] + r * Math.cos(t), C[1] + r * Math.sin(t), z]
      face(s.glass, [P(r0, t0, Z + T), P(r1, t0, Z + T), P(r1, t1, Z + T), P(r0, t1, Z + T)], [0, 0, 1])
      face(s.glass, [P(r0, t0, Z), P(r0, t1, Z), P(r1, t1, Z), P(r1, t0, Z)], [0, 0, -1])
      const tm = (t0 + t1) / 2
      face(s.trim, [P(r1, t0, Z - 0.15), P(r1, t1, Z - 0.15), P(r1, t1, Z + T + 0.05), P(r1, t0, Z + T + 0.05)], [Math.cos(tm), Math.sin(tm), 0])
    }
    const P = (r: number, t: number, z: number): V3 => [C[0] + r * Math.cos(t), C[1] + r * Math.sin(t), z]
    for (const tdeg of [-114, -100, -80, -66]) {
      const t = (tdeg * Math.PI) / 180
      bar(s.trim, P(R + 8.4, t, 0), P(R + 8.4, t, 5.6), 0.35, 0.35)
    }
    if (d) for (let i = 0; i <= 8; i++) {
      const t = ta + ((tb - ta) * i) / 8
      bar(s.trim, P(R + 0.4, t, 5.45), P(R + 9.3, t, 5.45), 0.18, 0.3)
    }
  }
}

// ---- Materials and output --------------------------------------------------------------------------------

const wash = (p: V3, n: V3) => (n[2] > 0.6 ? 0.2 : p[2] < 17 ? 0.85 - p[2] * 0.015 : 0.45)
const STONE: MaterialSpec = { ...finish('portland-stone', 0xe9e2d4), floodlight: wash }
const TRIM: MaterialSpec = { ...PALETTE.trim, color: 0xf3eee4, floodlight: wash }
const WIN: MaterialSpec = PALETTE.window
const GLASS: MaterialSpec = { ...PALETTE.glass, color: 0x8fb0b6 }
const ROOF: MaterialSpec = { ...PALETTE.roof, color: 0xc4c4bf } // pale concrete roofs (p1 aerial, d2 model)
const COPPER: MaterialSpec = finish('atrium-copper', 0x8f6a5a, 0.6)
const layers = (s: Set): Layer[] => [
  { part: s.stone, material: STONE },
  { part: s.trim, material: TRIM },
  { part: s.win, material: WIN },
  { part: s.glass, material: GLASS },
  { part: s.roof, material: ROOF },
  { part: s.copper, material: COPPER },
]

if (import.meta.main) {
  await saveLods('auckland-war-memorial-museum', 'Auckland War Memorial Museum', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; turned to bearing 0.5; origin on the portico axis at the outline centroid',
    bearing: 0.5, height: 23,
  }, 6500)
}
