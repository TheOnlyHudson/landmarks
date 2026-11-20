/**
 * Faena Forum (2016, OMA / Rem Koolhaas and Shohei Shigematsu), 3300-3390
 * Collins Avenue, Miami Beach — original procedural geometry, CC0-1.0.
 * bun generators/mia-faena-forum.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/639617563
 * (25.8081753, -80.1241511). Bearing 0: the drum is round and the cube is
 * drawn turned 8.8° clockwise inside this frame, as OSM has it.
 *
 * Identity: two white volumes side by side — a drum (east) and a cube
 * (west) — whose walls are pierced all over by irregular angular openings
 * (triangles, trapezoids, pentagons) that leave a white diagonal web; the
 * drum's base is cut away in a sweeping curve over the plaza, so it seems
 * to float; a red vertical banner on the drum.
 *
 * Sources:
 *  - OSM: way/639617563 (building=yes, name Faena Forum; no height). The
 *    drum: circle about (10.6, -2.9), radius 13.9 (fitted to the outline's
 *    arc); the cube: its west edge (-25.4, -4.6)→(-22.1, 16.2) and north
 *    edge at -8.8°, about 22 m square, measured from the outline.
 *  - Lidar: NOAA Digital Coast EPT 10338 (2021 Florida coastal topobathy,
 *    public domain), 0.5 m grid: cube roof 23 m above the ground round it,
 *    drum roof 21.5 (21–22.5, falling slightly to the south); footprints
 *    agree with OSM within ~1 m. Measured.
 *  - Mapterhorn terrain: flat (about 1 m).
 *  - Estimated from the photos: the openings' sizes (1.5–3.5 m) and
 *    density (drawn as a jittered triangular lattice, each cell shrunk to
 *    leave the white web; a share of cells left solid), the drum's
 *    undercut (rising to ~6 m over the south-east plaza, glazed lobby set
 *    4 m back beneath it), the glass wall on the cube's north face, the
 *    banner (1.6 m wide).
 *  - Colours: white precast concrete; openings dark glass pulled light.
 *  - Night: the openings are `window` (they glow); the undercut lobby
 *    glazing `entrance`.
 *
 * Photos (Wikimedia Commons, daylight):
 *  - Faena_Event_Forum_(1).jpg, Tamanoeconomico, CC BY-SA 4.0 — drum and
 *    cube from the street, the undercut drum base;
 *  - Faena_Event_Forum_(2).jpg, Tamanoeconomico, CC BY-SA 4.0 — the cube's
 *    openings and its glass corner;
 *  - Faena_District_Miami_Beach_-_Faena_Forum_Reflecting_Pool.jpg, Daniel
 *    Di Palma, CC BY-SA 4.0 — the soffit over the plaza and pool;
 *  - Faena_District_Miami_Beach_-_Faena_Forum_Staircase_03.jpg, Daniel Di
 *    Palma, CC BY-SA 4.0 — the lobby under the drum;
 *  - Miami_Beach_-_3300_Collins_Avenue.jpg, P. Hughes, CC BY 4.0 — the
 *    drum from Collins Avenue with the red banner.
 * No look-only sources. No commercial imagery or 3D tiles.
 *
 * Doubts: the opening pattern is a stand-in with the right character and
 * density, not a trace of the real one. Which side the undercut and the
 * cube's glass wall face is read from photos whose directions are inferred
 * (undercut toward the plaza on the south-east; glass on the cube's north
 * face, west half); the banner's position (east, toward Collins Avenue)
 * likewise.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { type XY, ccw, walls, capRing, face, build, outward } from './mia-panorama-tower'

const white = new Part(), win = new Part(), glass = new Part(), roof = new Part(), red = new Part(), entr = new Part()

// deterministic random
let seed = 20161130
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }

const DC: XY = [10.6, -2.9], DR = 13.9, DTOP = 21.5, CTOP = 23
const ND = 32
// the drum's base: rises over the south-east plaza
const D2R = Math.PI / 180
const undercut = (a: number) => { // a in degrees, math angle
  let d = ((a + 40 + 540) % 360) - 180 // distance from -40°
  const t = Math.max(0, 1 - Math.abs(d) / 105)
  return 6.5 * Math.min(1, 1.6 * t * t * (3 - 2 * t))
}

/**
 * Irregular openings on a surface given as (u metres along it, z) → point
 * and normal: a jittered triangular lattice, each cell shrunk toward its
 * centre to leave the white web, about a quarter left solid.
 */
function openings(L: number, z0: number, z1: number, at: (u: number, z: number) => V3, nrm: (u: number) => V3, skip: (u: number, z: number) => boolean) {
  const DX = 3.5, DZ = 3.3
  const nc = Math.max(2, Math.round(L / DX)), dx = L / nc, nr = Math.max(1, Math.round((z1 - z0) / DZ)), dz = (z1 - z0) / nr
  const P: XY[][] = []
  for (let j = 0; j <= nr; j++) {
    const row: XY[] = []
    for (let i = -1; i <= nc + 1; i++) {
      const edge = j === 0 || j === nr
      row.push([(i + (j % 2) * 0.5) * dx + (rnd() - 0.5) * 1.6, z0 + j * dz + (edge ? 0 : (rnd() - 0.5) * 1.4)])
    }
    P.push(row)
  }
  for (let j = 0; j < nr; j++) {
    const A = P[j], B = P[j + 1], odd = j % 2 === 1
    for (let i = 0; i < A.length - 1; i++) {
      // about half the cells open as one quad (a trapezoid), the rest as two triangles
      const cr = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
      const cv = [cr(A[i], A[i + 1], B[i + 1]), cr(A[i + 1], B[i + 1], B[i]), cr(B[i + 1], B[i], A[i]), cr(B[i], A[i], A[i + 1])]
      const quad = rnd() < 0.5 && (cv.every((v) => v > 0) || cv.every((v) => v < 0))
      const tris: XY[][] = quad ? [[A[i], A[i + 1], B[i + 1], B[i]]] : odd ? [[A[i], A[i + 1], B[i + 1]], [A[i], B[i + 1], B[i]]] : [[A[i], A[i + 1], B[i]], [A[i + 1], B[i + 1], B[i]]]
      for (const t of tris) {
        if (rnd() < 0.2) continue
        const c: XY = [t.reduce((m, p) => m + p[0], 0) / t.length, t.reduce((m, p) => m + p[1], 0) / t.length]
        const s = (t.length === 4 ? 0.55 : 0.5) + rnd() * 0.16
        const q = t.map(([u, z]) => [c[0] + (u - c[0]) * s, c[1] + (z - c[1]) * s] as XY)
        if (q.some(([u, z]) => u < 0.8 || u > L - 0.8 || skip(u, z))) continue
        // ccw seen from outside: u runs to the right when facing the wall
        for (let k = 1; k < q.length - 1; k++) {
          const o = [q[0], q[k], q[k + 1]]
          win.tri(at(o[0][0], o[0][1]), at(o[1][0], o[1][1]), at(o[2][0], o[2][1]), undefined, undefined, undefined, o.map(([u]) => nrm(u)) as V3[])
        }
      }
    }
  }
}

// ======================= the cube =======================
const NW: XY = [-22.1, 16.2], ex: XY = [Math.cos(-8.8 * D2R), Math.sin(-8.8 * D2R)], dn: XY = [-ex[1], ex[0]] // ex east-ish, dn north-ish
const S = 22
const SW: XY = [NW[0] - dn[0] * S, NW[1] - dn[1] * S]
const cpt = (a: number, b: number): XY => [SW[0] + ex[0] * a + dn[0] * b, SW[1] + ex[1] * a + dn[1] * b]
const CUBE = ccw([cpt(0, 0), cpt(S, 0), cpt(S, S), cpt(0, S)])
walls(CUBE, [[0, CTOP, white]])
capRing(roof, CUBE, CTOP)
{ // parapet lip
  const lipIn = CUBE.map(([x, y]) => { const cx = SW[0] + (ex[0] + dn[0]) * S / 2, cy = SW[1] + (ex[1] + dn[1]) * S / 2; const k = 1 - 0.6 / (S / 2); return [cx + (x - cx) * k, cy + (y - cy) * k] as XY })
  walls(lipIn.slice().reverse(), [[CTOP, CTOP + 0.7, white]])
  walls(CUBE, [[CTOP, CTOP + 0.7, white]])
  for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; face(white, [[CUBE[k][0], CUBE[k][1], CTOP + 0.7], [CUBE[j][0], CUBE[j][1], CTOP + 0.7], [lipIn[j][0], lipIn[j][1], CTOP + 0.7], [lipIn[k][0], lipIn[k][1], CTOP + 0.7]], [0, 0, 1]) }
}
CUBE.forEach((a, i) => {
  const b = CUBE[(i + 1) % 4], o = outward(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const at = (u: number, z: number): V3 => [a[0] + t[0] * u + o[0] * 0.06, a[1] + t[1] * u + o[1] * 0.06, z]
  const n: V3 = [o[0], o[1], 0]
  const north = o[1] > 0.7
  // the glass wall on the north face, its west half, upper floors (Tamanoeconomico 2)
  const gl = (u: number, z: number) => north && u > L * 0.5 && z > 7
  if (north) face(glass, [at(L * 0.52, 7.6), at(L - 0.9, 7.6), at(L - 0.9, CTOP - 1.2), at(L * 0.52, CTOP - 1.2)], n)
  openings(L, 1.2, CTOP - 1, at, () => n, (u, z) => gl(u, z) || (north && u > L * 0.48 && z > 6.4))
})

// ======================= the drum =======================
const dAng = (k: number) => (360 * k) / ND
const dpt = (r: number, a: number): XY => [DC[0] + r * Math.cos(a * D2R), DC[1] + r * Math.sin(a * D2R)]
const radial = (a: number): V3 => [Math.cos(a * D2R), Math.sin(a * D2R), 0]
for (let k = 0; k < ND; k++) {
  const a0 = dAng(k), a1 = dAng(k + 1), p0 = dpt(DR, a0), p1 = dpt(DR, a1), u0 = undercut(a0), u1 = undercut(a1)
  white.tri([p0[0], p0[1], u0], [p1[0], p1[1], u1], [p1[0], p1[1], DTOP], undefined, undefined, undefined, [radial(a0), radial(a1), radial(a1)])
  white.tri([p0[0], p0[1], u0], [p1[0], p1[1], DTOP], [p0[0], p0[1], DTOP], undefined, undefined, undefined, [radial(a0), radial(a1), radial(a0)])
  if (u0 > 0.05 || u1 > 0.05) {
    // the soffit under the lifted rim, back to the lobby glazing 4 m in
    const q0 = dpt(DR - 4, a0), q1 = dpt(DR - 4, a1)
    face(white, [[p0[0], p0[1], u0], [q0[0], q0[1], u0], [q1[0], q1[1], u1], [p1[0], p1[1], u1]], [0, 0, -1])
    const n0 = radial(a0), n1 = radial(a1)
    entr.tri([q0[0], q0[1], 0], [q1[0], q1[1], 0], [q1[0], q1[1], u1], undefined, undefined, undefined, [n0, n1, n1])
    entr.tri([q0[0], q0[1], 0], [q1[0], q1[1], u1], [q0[0], q0[1], u0], undefined, undefined, undefined, [n0, n1, n0])
  }
}
// flat roof with a low rim
{
  const outer = Array.from({ length: ND }, (_, k) => dpt(DR, dAng(k))), inner = Array.from({ length: ND }, (_, k) => dpt(DR - 0.6, dAng(k)))
  walls(outer, [[DTOP, DTOP + 0.7, white]])
  walls(inner.slice().reverse(), [[DTOP, DTOP + 0.7, white]])
  for (let k = 0; k < ND; k++) { const j = (k + 1) % ND; face(white, [[outer[k][0], outer[k][1], DTOP + 0.7], [outer[j][0], outer[j][1], DTOP + 0.7], [inner[j][0], inner[j][1], DTOP + 0.7], [inner[k][0], inner[k][1], DTOP + 0.7]], [0, 0, 1]) }
  capRing(roof, inner, DTOP)
}
// openings on the drum; u = arc length from angle 0 (east), anticlockwise
{
  const L = 2 * Math.PI * DR
  const chord = (a: number) => { // radius of the drawn facet at angle a (deg)
    const step = 360 / ND, k = Math.floor((((a % 360) + 360) % 360) / step), mid = (k + 0.5) * step
    return (DR * Math.cos((step / 2) * D2R)) / Math.cos((a - mid) * D2R)
  }
  const at = (u: number, z: number): V3 => { const a = (u / DR) / D2R; const r = chord(a) + 0.2; return [DC[0] + r * Math.cos(a * D2R), DC[1] + r * Math.sin(a * D2R), z] }
  const BAN = 8 // the banner's angle (toward Collins Avenue, east)
  const banU = (BAN * D2R) * DR
  openings(L, 1.0, DTOP - 1, at, (u) => radial((u / DR) / D2R), (u, z) => z < undercut((u / DR) / D2R) + 1.3 || Math.abs(u - banU) < 1.6 || Math.abs(u - banU - L) < 1.6)
  // the red banner
  const w = 0.8, r = DR + 0.18, n = radial(BAN)
  const tg: XY = [-Math.sin(BAN * D2R), Math.cos(BAN * D2R)], c = dpt(r, BAN)
  const B = (s: number, z: number): V3 => [c[0] + tg[0] * s, c[1] + tg[1] * s, z]
  face(red, [B(-w, 4.5), B(w, 4.5), B(w, 18.5), B(-w, 18.5)], n)
}

if (import.meta.main) {
  await build('Faena Forum', 'mia-faena-forum', [
    { part: white, material: finish('ff-white', 0xf3f1ec) },
    { part: win, material: { name: 'window', color: 0x5e7384, roughness: 0.35 } },
    { part: glass, material: { name: 'window-2', color: 0x7f98aa, roughness: 0.3 } },
    { part: roof, material: PALETTE.roof },
    { part: red, material: finish('ff-banner-red', 0xb8403a) },
    { part: entr, material: PALETTE.entrance },
  ], { bearing: 0, elevation: 0, height: CTOP + 0.7, replaces: ['way/639617563'] }, process.argv[2], 5000)
}
