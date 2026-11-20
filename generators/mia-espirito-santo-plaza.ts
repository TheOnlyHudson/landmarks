/**
 * Espírito Santo Plaza (2004, Kohn Pedersen Fox), 1395 Brickell Avenue,
 * Miami — original procedural geometry, CC0-1.0.
 * bun generators/mia-espirito-santo-plaza.ts [out.glb]
 *
 * Uses the ring kit exported from mia-panorama-tower.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 11 (the
 * tower's Brickell Avenue face). Anchor = area centroid of the OSM tower
 * way/300510112, 25.7606824, -80.1916822.
 *
 * Form: a 36-storey glass office/hotel slab. Its west face, on Brickell
 * Avenue, is the identity: a parabolic arch springs from the face's two
 * bottom corners to an apex just under the roof, and inside the arch the
 * glass swells out into a smooth vault, widest at the street (about 6 m out
 * at the base) and fading to the flat face at the arch line, which is lit
 * at night. The arch face runs on up past the roof as a 6 m thick blade to
 * 148 m. The south face is pale, with silver fins and a louvred plant
 * screen near its top; the north-east corner is cut on the diagonal. A
 * 27 m parking podium stands against the east side.
 *
 * Sources:
 *  - OSM: tower way/300510112 (154 m, 36 levels, wikidata Q3058435);
 *    podium way/300510113; building:part way/1185200181 ("Brickell Arch, a
 *    Luxury Collection Hotel", no height), which overlaps the tower's and
 *    the podium's south halves and runs on under the JW Marriott to the
 *    east; it is listed because the model covers half of it.
 *  - Lidar: USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown
 *    2019), 1 m grid in the turned frame. Measured: main roof 133-138 m,
 *    the blade along the west edge 146-148 m and 6 m deep, plan x -15..+19,
 *    y -30..+31 (matches OSM to a metre or two), podium 21-27 m. Returns
 *    west of the roof edge at 50-100 m height on the south half are read
 *    as the swelling lower face.
 *  - Estimated: the bulge depth (6 m) and its shape (linear from the base
 *    to the arch line), the arch apex (138 m), from the photos; fin spacing,
 *    louvre extent, podium openings.
 *
 * Photos (Wikimedia Commons):
 *  - Espirito_Santo_Plaza_Downtown_Miami_20100206.jpg, Averette, CC BY 3.0
 *    — aerial from the west: the arch face, its base bowing out toward
 *    Brickell Avenue;
 *  - Miami_Banco_Espirito_Santo.jpg, Kolossos, CC BY-SA 3.0 — from Brickell
 *    and SE 14th St (south-west): the arch, the blade top, the finned
 *    south face and its louvred plant screen;
 *  - Espiritu_Santos_Plaza_..._Kohn_Pedersen_Fox_120313-3-jikatu-2.jpg,
 *    Jimmy Baikovicius, CC BY-SA 2.0 — night, from the west: the lit arch;
 *  - Espirito_Santo_Plaza_backside.jpg and Espirito_Santo_side.jpg,
 *    Averette, CC BY 3.0 — the east and north sides;
 *  - Espirito_Santo_Bank.jpg, Miami92, public domain — the top from below.
 * No commercial imagery or 3D tiles were used. No look-only sources.
 *
 * Doubts: the face is often described as a concave arch; the aerial photo
 * (base bowing toward the camera) and the lidar wall returns say the glass
 * inside the arch swells outward, and it is drawn so. The central vertical
 * reveal on the arch face is left out (it would read as a full-height dark
 * stripe). The east face's finned slot is drawn as plain glass.
 * Review round 1 asked for a concave face. That was re-checked and kept
 * convex: the lidar has wall returns at 50-100 m up to 9 m west of the
 * roof edge on the south half of the face, which a concave face (receding
 * east at its foot) cannot give, and the aerial photo's base line bows
 * toward the camera. The arch band was widened to 2.6 m so it reads at
 * 80 px, and the glass darkened toward the photos' green-blue.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, bevel, walls, capRing, panels, ringEdges, edgeRect, outward, face, box, build } from './mia-panorama-tower'

const glass = new Part(), fins = new Part(), lines = fins, stone = new Part(), arch = new Part(), roof = new Part(), holes = new Part()

const XW = -15            // the arch face's plane
const Y0 = -30.2, Y1 = 31 // its ends
const W = Y1 - Y0, YC = (Y0 + Y1) / 2
const ROOF = 135, TOP = 148, APEX = 138, D = 6
const LINES: number[] = []
for (let z = 9; z < ROOF - 4; z += 10.6) LINES.push(z)

// the tower plan, counter-clockwise from the arch face's south end
const PLAN: XY[] = [[XW, Y0], [2.1, -29.6], [18.5, -23], [18.8, 19.6], [2, 28.2], [-3.6, Y1], [XW, Y1]]

const seg = (part: Part, a: XY, b: XY, z0: number, z1: number) => {
  const o = outward(a, b)
  face(part, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [o[0], o[1], 0])
}

// ---- the other faces (all but the arch face, edge 6 → 0) ----
for (let i = 0; i < PLAN.length - 1; i++) {
  const a = PLAN[i], b = PLAN[i + 1]
  const o = outward(a, b)
  const south = o[1] < -0.9
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.max(1, Math.ceil(L / 5))
  for (let k = 0; k < n; k++) {
    const p: XY = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
    const q: XY = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
    seg(south ? fins : glass, p, q, 0, 1)
    seg(south ? fins : glass, p, q, 1, ROOF)
  }
}
capRing(roof, PLAN, ROOF)
for (const e of ringEdges(PLAN)) if (e.o[0] > -0.9) for (const z of LINES) edgeRect(lines, e, 0, e.L, z - 0.35, z + 0.35, 0.07)

// south face: glazing bays between the pale fins, a louvred plant screen at the top
{
  const s = ringEdges(PLAN).find((e) => e.o[1] < -0.9)!
  for (let k = 0; k < 6; k++) {
    const s0 = (s.L * k) / 6 + 0.9, s1 = (s.L * (k + 1)) / 6 - 0.9
    for (let z = 6; z < 112; z += 10.5) edgeRect(glass, s, s0, s1, z, z + 8.2, 0.05)
  }
  edgeRect(roof, s, s.L * 0.12, s.L * 0.88, 113, ROOF - 2, 0.05)
}

// ---- the arch face: flat outside the parabola, swelling inside it ----
const archZ = (y: number) => APEX * (1 - ((2 * (y - YC)) / W) ** 2)
const bulge = (y: number, z: number) => D * Math.max(0, 1 - ((2 * (y - YC)) / W) ** 2 - z / APEX)
{
  const NU = 20, ZS = [0, 1, ...LINES, ROOF]
  const P = (i: number, j: number): V3 => { const y = Y0 + (W * i) / NU, z = ZS[j]; return [XW - bulge(y, z), y, z] }
  const N = (i: number, j: number): V3 => {
    // numerical normal of the surface x = XW - bulge(y, z), pointing west
    const y = Y0 + (W * i) / NU, z = ZS[j], h = 0.05
    const dy = (bulge(y + h, z) - bulge(y - h, z)) / (2 * h), dz = (bulge(y, z + h) - bulge(y, z - h)) / (2 * h)
    const v: V3 = [-1, -dy, -dz], l = Math.hypot(...v)
    return [v[0] / l, v[1] / l, v[2] / l]
  }
  for (let i = 0; i < NU; i++)
    for (let j = 0; j < ZS.length - 1; j++) {
      const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1)
      glass.tri(a, b, c, undefined, undefined, undefined, [N(i, j), N(i + 1, j), N(i + 1, j + 1)])
      glass.tri(a, c, d, undefined, undefined, undefined, [N(i, j), N(i + 1, j + 1), N(i, j + 1)])
    }
  // the swell's foot, closed underneath
  const foot: XY[] = []
  for (let i = NU; i >= 0; i--) { const y = Y0 + (W * i) / NU; foot.push([XW - bulge(y, 0), y]) }
  capRing(glass, ccw(foot), 0, false)

  // the arch line: a pale band on the flat face along the parabola (lit at night)
  // set just proud of the facetted surface: the most any grid node of the cell stands out
  const out = (y: number, z: number) => {
    if (z >= ROOF) return XW - 0.12
    const i = Math.floor(((y - Y0) / W) * NU), j = Math.max(0, ZS.findIndex((v) => v > z) - 1)
    let m = 0
    for (const a of [i, i + 1]) for (const b of [j, j + 1]) {
      const yy = Y0 + (W * Math.min(NU, Math.max(0, a))) / NU, zz = ZS[Math.min(ZS.length - 1, b)]
      m = Math.max(m, bulge(yy, zz))
    }
    return XW - m - 0.12
  }
  const M = 48, w = 1.3
  const dz = (y: number) => APEX * (-8 * (y - YC)) / (W * W) // slope of the parabola
  const off = (y: number, sgn: number): [number, number] => { const g = dz(y), l = Math.hypot(1, g); return [y - (sgn * w * g) / l, archZ(y) + (sgn * w) / l] }
  for (let k = 0; k < M; k++) {
    const ya = Y0 + 1.2 + ((W - 2.4) * k) / M, yb = Y0 + 1.2 + ((W - 2.4) * (k + 1)) / M
    const corners = [off(ya, -1), off(yb, -1), off(yb, 1), off(ya, 1)].map(([y, z]) => [y, Math.max(0, z)] as [number, number])
    const x = Math.min(...corners.map(([y, z]) => out(y, z)))
    face(arch, corners.map(([y, z]) => [x, y, z] as V3), [-1, 0, 0])
  }
  // pale floor-group lines across the face, following the swell (on grid rows, so on the facets)
  for (const z of LINES) {
    const j = ZS.indexOf(z)
    for (let i = 0; i < NU; i++) {
      const a = P(i, j), b = P(i + 1, j), na = N(i, j), nb = N(i + 1, j)
      const q = (p: V3, n: V3, dz: number): V3 => [p[0] + n[0] * 0.08, p[1] + n[1] * 0.08, p[2] + dz]
      lines.tri(q(a, na, -0.35), q(b, nb, -0.35), q(b, nb, 0.35), undefined, undefined, undefined, [na, nb, nb])
      lines.tri(q(a, na, -0.35), q(b, nb, 0.35), q(a, na, 0.35), undefined, undefined, undefined, [na, nb, na])
    }
  }
}

// ---- the blade: the arch face carried up past the roof ----
{
  const B: XY[] = [[XW, Y0], [XW + 6, Y0], [XW + 6, Y1], [XW, Y1]]
  walls(B, [[ROOF, TOP, glass]])
  capRing(roof, B, TOP)
}
// roof plant
box(roof, 6, 0, 16, 26, ROOF, ROOF + 4)

// ---- the parking podium to the east (OSM way/300510113) ----
{
  const POD = bevel(ccw([[45.8, 25.8], [39.3, 26.2], [2.0, 28.2], [18.8, 19.6], [18.3, -23.0], [2.1, -29.3], [38.3, -30.6], [44.1, -30.2]]), 0.5)
  walls(POD, [[0, 27, stone]])
  capRing(roof, POD, 27)
  panels(holes, POD, 2, 25, { bay: 11, pier: 1.6, rowH: 7.5, spandrel: 2.8, minEdge: 8 })
}

await build('Espírito Santo Plaza', 'mia-espirito-santo-plaza', [
  { part: glass, material: windowVariant(2, 0x6c939c) },
  { part: fins, material: finish('espirito-fins', 0xcfd2cf) },
  { part: stone, material: finish('espirito-podium', 0xe5dccd) },
  { part: arch, material: finish('neon-espirito-arch', 0xeef3f5) },
  { part: roof, material: PALETTE.roof },
  { part: holes, material: PALETTE.window },
], { bearing: 11, elevation: 0, height: TOP, replaces: ['way/300510112', 'way/300510113', 'way/1185200181'] }, process.argv[2])
