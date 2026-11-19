/**
 * Berlin Hauptbahnhof (gmp von Gerkan, Marg und Partner, 1996-2006):
 * original procedural geometry, CC0-1.0.
 * bun generators/berlin-hauptbahnhof.ts
 * Writes models/berlin-hauptbahnhof.glb (low) and
 * models/berlin-hauptbahnhof.detail.glb (detail, detailZoom 16).
 * Imports the kit from berlin-reichstag.ts (merge that first).
 *
 * Map frame, turned to BEARING 336.5 (the north-south hall and the two
 * office bridges run 23.5 degrees west of north in OSM): +y is compass
 * 336.5, +x compass 66.5. z up, metres. Origin = the fetch centre
 * 13.36945, 52.52502, 0.25 m from the area centroid of OSM
 * relation/3600565.
 *
 * Ground. The east end of the train shed stands on its bridge over the
 * Humboldthafen, so the lowest ground under the footprint is the water
 * (Mapterhorn: 1.8 m above the table's lowest point, the streets round the
 * station 5.5-6.0). z = 0 is that water level and every OSM height (which
 * counts from the street) is raised by ZS = 3.9 m; the walls on land run
 * down to z = 0 and sink into the ground, as STYLE.md asks. (The terrain
 * also shows a 10 m plateau inside the station's footprint: the building
 * itself in the DEM; the map fills it from the ground outside.)
 *
 * What makes it the Hauptbahnhof, and how each is drawn
 * - The east-west train shed: a 320 m glass barrel vault on the track
 *   viaduct, curving with the tracks (its axis turns about 23 degrees from
 *   west to east) and narrowing towards its ends; real 3D glass with its
 *   arched steel ribs and edge beams (the low model: a rib every 13 m; the
 *   detail model: the full diagonal lattice of the grid shell plus the
 *   ribs), the viaduct deck and its piers under it.
 * - The two office bridges ("Buegelbauten", 46 m), straddling the shed:
 *   each a pair of glass legs north and south of the vault carrying the
 *   bridging block over it; glass curtain walls with their steel frame
 *   drawn as pale mullion and transom lines every three storeys.
 * - The north-south hall between them: the glass end walls (cut on the
 *   same skew as the shed), the low glass barrel roof, and the south
 *   entrance canopy.
 *
 * Sources
 * - OSM relation/3600565 (station outline, height 23, wikidata Q1097),
 *   the shed roofs way/11345963 and way/226048334 (8-28 m, round), the
 *   north-south hall roof way/226048335 (23-28, round), the office bridges
 *   way/11348359, way/11348390 (32-46 m), their tops way/128280629,
 *   way/128280630 (46-48) and their legs way/97948311-314 (0-32 m); the
 *   east track viaduct way/195099177 (6.5-8 m), two thirds under the shed's
 *   deck, is replaced too, as are the station's inner parts (platform roofs
 *   way/60203002, /62095731, shops, doors and lifts).
 *   (c) OpenStreetMap contributors, ODbL.
 * - Published (Wikipedia "Berlin Hauptbahnhof"): the east-west hall 321 m
 *   long; the office bridges 46 m high.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Berlin Hauptbahnhof Ostseite HDR.jpg", Ansgar Koreng, CC BY 3.0 (from
 *     the south-east across the Spree: the shed's east end on its bridge,
 *     the office bridges behind),
 *     https://commons.wikimedia.org/wiki/File:Berlin_Hauptbahnhof_Ostseite_HDR.jpg
 *   "Berlin Hauptbahnhof, Ostseite, 170430, ako.jpg", "150524 Berlin
 *     Hauptbahnhof Ostseite.jpg", Ansgar Koreng, CC BY-SA 3.0 de / CC BY 3.0;
 *   "Hauptbahnhof Berlin.jpg", Thomas Wolf (www.foto-tw.de), CC BY-SA 3.0
 *     (the south front: the legs, the hall's glass end, the canopy),
 *     https://commons.wikimedia.org/wiki/File:Hauptbahnhof_Berlin.jpg
 *   "Berlin Hauptbahnhof, Südfassade, 160505, ako.jpg", Ansgar Koreng,
 *     CC BY 3.0;
 *   "Berlin Hauptbahnhof November 2013 02.jpg", Arild Vågen, CC BY-SA 3.0
 *     (inside the shed: the ribs and the diagonal grid);
 *   "View of Berlin Hauptbahnhof from Moltkebrücke, Berlin, 2017.jpg",
 *     DimiTalen, CC0;
 *   "Estación Central, Berlín, Alemania, 2016-04-21, DD 43-45 HDR.JPG",
 *     Diego Delso, CC BY-SA 4.0 (night).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - From OSM: every plan line (the shed's centre and half-width read off
 *   its two outlines at six stations: half-widths 32-36 m), the heights.
 * - Estimated: the vault springing from the track deck at 8.5 m above the
 *   street and its crest at 23.5 m (OSM's 8-28 counts the deck edge; the
 *   photos show the vault starting at the platforms), the viaduct deck
 *   7-8.5 m, the hall's barrel rise 5 m, the canopy at 12 m.
 * - Invented: the piers' spacing under the viaduct; the lattice's pitch
 *   (about 3 m) in the detail model.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { lathe, face, TAU } from './nyc-columbus-monument'
import { writeModel, box } from './london-buckingham-palace'
import { LOW, HIGH, type Q } from './london-albert-memorial'
import { welded, faceOf, fpanel, fp, type XY } from './berlin-reichstag'

export const BEARING = 336.5
const ZS = 3.9

/** The shed's axis (x, y) and half-width, read off OSM (see the header). */
const AXIS: [number, number, number][] = [[-188, 17, 32], [-100, 17, 35], [-20, 5, 36], [21, -6, 36], [78, -24, 35], [118, -40, 31]]

/** Catmull-Rom along AXIS at s in 0..1: point, unit tangent, half-width. */
function axisAt(s: number) {
  const n = AXIS.length - 1, f = Math.min(n - 1e-6, Math.max(0, s * n)), i = Math.floor(f), t = f - i
  const P = (k: number) => AXIS[Math.max(0, Math.min(n, k))]
  const cr = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t)
  const g = (k: 0 | 1 | 2) => cr(P(i - 1)[k], P(i)[k], P(i + 1)[k], P(i + 2)[k])
  const e = 1e-4, s2 = Math.min(1, s + e), s1 = Math.max(0, s - e)
  const pt: [number, number, number] = [g(0), g(1), g(2)]
  return { pt, s1, s2 }
}
function frameAt(s: number) {
  const a = axisAt(s).pt, b = axisAt(Math.min(1, s + 0.002)).pt, c = axisAt(Math.max(0, s - 0.002)).pt
  const tx = b[0] - c[0], ty = b[1] - c[1], L = Math.hypot(tx, ty)
  // Left normal (towards +y side when running east).
  return { x: a[0], y: a[1], hw: a[2], tx: tx / L, ty: ty / L, nx: -ty / L, ny: tx / L }
}

export function build(Q: Q) {
  const glass = new Part(), steel = new Part(), win = new Part(), trim = new Part(), conc = new Part(), roof = new Part()
  const D = Q.detail

  // ===== The east-west shed ===================================================
  const ZD = ZS + 8.5, ZC = ZS + 23.5 // deck top / vault springing, crest
  const NS = D ? 72 : 26, NL = D ? 20 : 10 // sections along, segments across
  const vault = (s: number, u: number, dr = 0): V3 => {
    // u in -1..1 across; elliptical section; dr pushes along the section's normal (approx.).
    const f = frameAt(s), hw = f.hw * (1 - 0.06 * Math.pow(2 * s - 1, 8))
    const a = Math.acos(Math.max(-1, Math.min(1, u))), cy = Math.cos(a), sz = Math.sin(a)
    const r = hw + dr, h = ZC - ZD + dr
    return [f.x + f.nx * r * cy, f.y + f.ny * r * cy, ZD + h * sz]
  }
  const uAt = (j: number) => Math.cos(Math.PI * (1 - j / NL)) // denser at the springings
  for (let i = 0; i < NS; i++) for (let j = 0; j < NL; j++) {
    const s0 = i / NS, s1 = (i + 1) / NS, u0 = uAt(j), u1 = uAt(j + 1)
    face(glass, vault(s0, u0), vault(s1, u0), vault(s1, u1), vault(s0, u1), [frameAt(s0).x, frameAt(s0).y, ZD])
  }
  // Ribs: arched, every ~13 m (low) or ~4.5 m (detail), box section in the detail model.
  const ribs = D ? 36 : 28
  const ribSeg = D ? 20 : 10
  for (let k = 0; k <= ribs; k++) {
    const s = k / ribs
    for (let j = 0; j < ribSeg; j++) {
      const u0 = Math.cos(Math.PI * (1 - j / ribSeg)), u1 = Math.cos(Math.PI * (1 - (j + 1) / ribSeg))
      const f = frameAt(s), w = D ? 0.22 : 0.35
      const off = (p: V3, d: number): V3 => [p[0] + f.tx * d, p[1] + f.ty * d, p[2]]
      const a0 = vault(s, u0, 0.12), a1 = vault(s, u1, 0.12), b0 = vault(s, u0, D ? -0.45 : 0.12), b1 = vault(s, u1, D ? -0.45 : 0.12)
      const ins: V3 = [f.x, f.y, ZD]
      face(steel, off(a0, -w), off(a1, -w), off(a1, w), off(a0, w), ins)
      if (D) {
        face(steel, off(b0, -w), off(b0, w), off(b1, w), off(b1, -w), [f.x, f.y, ZC + 10])
        face(steel, off(a0, -w), off(b0, -w), off(b1, -w), off(a1, -w), off(a0, 5))
        face(steel, off(a0, w), off(a1, w), off(b1, w), off(b0, w), off(a0, -5))
      }
    }
  }
  // The diagonal lattice of the grid shell (detail): two families of lines.
  if (D) {
    const nd = 90, steps = 22
    for (const sgn of [1, -1]) for (let k = 0; k < nd; k++) {
      const pts: V3[] = []
      for (let q = 0; q <= steps; q++) {
        const u = -1 + 2 * q / steps, s = (k / nd) + sgn * (u + 1) * 0.06
        if (s < 0 || s > 1) { if (pts.length) break; else continue }
        pts.push(vault(s, Math.sin(u * Math.PI / 2), 0.08))
      }
      for (let q = 0; q < pts.length - 1; q++) {
        const a = pts[q], b = pts[q + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, w = 0.07
        const nx = -dy / L * w, ny = dx / L * w
        steel.quad([a[0] - nx, a[1] - ny, a[2]], [a[0] + nx, a[1] + ny, a[2]], [b[0] + nx, b[1] + ny, b[2]], [b[0] - nx, b[1] - ny, b[2]])
        steel.quad([b[0] - nx, b[1] - ny, b[2]], [b[0] + nx, b[1] + ny, b[2]], [a[0] + nx, a[1] + ny, a[2]], [a[0] - nx, a[1] - ny, a[2]])
      }
    }
  }
  // Edge beams along both springings, and the viaduct deck with its piers.
  for (const side of [-1, 1]) {
    for (let i = 0; i < NS; i++) {
      const p0 = vault(i / NS, side, 0), p1 = vault((i + 1) / NS, side, 0)
      const f0 = frameAt(i / NS), f1 = frameAt((i + 1) / NS)
      const q0: V3 = [p0[0] + f0.nx * side * 0.6, p0[1] + f0.ny * side * 0.6, p0[2]], q1: V3 = [p1[0] + f1.nx * side * 0.6, p1[1] + f1.ny * side * 0.6, p1[2]]
      face(steel, [q0[0], q0[1], ZD - 1.6], [q1[0], q1[1], ZD - 1.6], [q1[0], q1[1], ZD + 0.9], [q0[0], q0[1], ZD + 0.9], [f0.x, f0.y, ZD])
      face(steel, [q0[0], q0[1], ZD + 0.9], [q1[0], q1[1], ZD + 0.9], [p1[0], p1[1], ZD + 0.9], [p0[0], p0[1], ZD + 0.9], [f0.x, f0.y, 0])
    }
  }
  for (let i = 0; i < NS; i++) {
    const s0 = i / NS, s1 = (i + 1) / NS
    const e = (s: number, side: number): V3 => { const f = frameAt(s); return [f.x + f.nx * side * (f.hw + 0.6), f.y + f.ny * side * (f.hw + 0.6), ZD - 1.6] }
    face(conc, e(s0, -1), e(s1, -1), e(s1, 1), e(s0, 1), [frameAt(s0).x, frameAt(s0).y, ZD + 5])
  }
  {
    const nP = D ? 18 : 9
    for (let k = 0; k <= nP; k++) {
      const s = 0.03 + 0.94 * k / nP, f = frameAt(s)
      if (Math.abs(f.x) < 44) continue
      for (const l of [-0.65, 0, 0.65]) lathe(conc, [[1.0, 0], [1.0, ZD - 1.6]], D ? 10 : 6, f.x + f.nx * l * f.hw, f.y + f.ny * l * f.hw, false)
    }
  }

  // ===== The office bridges ===================================================
  const ZB0 = ZS + 32, ZB1 = ZS + 46, ZT = ZS + 48
  const bridges = [
    { x0: -41.8, x1: -20.3, legs: [[-78.6, -29.2], [43.1, 103.1]], top: [-34.9, -25.3, -70.9, 92.8] },
    { x0: 20.5, x1: 41.6, legs: [[29.8, 75.2], [-105.8, -44.2]], top: [25.9, 35.3, -96.3, 69.2] },
  ]
  for (const b of bridges) {
    const yA = Math.min(...b.legs.flat()), yB = Math.max(...b.legs.flat())
    const glazed = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) => {
      box(win, x0, y0, x1, y1, z0, z1, false)
      // The steel frame: mullions every ~7.5 m, transoms every three storeys.
      const ring: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
      for (let k = 0; k < 4; k++) {
        const f = faceOf(ring[k], ring[(k + 1) % 4]), L = Math.hypot(ring[(k + 1) % 4][0] - ring[k][0], ring[(k + 1) % 4][1] - ring[k][1])
        const nm = Math.max(1, Math.round(L / 7.5))
        for (let m = 0; m <= nm; m++) { const s = Math.min(L - 0.25, Math.max(0.25, L * m / nm)); fpanel(trim, f, s - 0.25, s + 0.25, Math.max(z0, ZS), z1, 0.06) }
        for (let z = z0 + 11.4; z < z1 - 1; z += 11.4) if (z > ZS) fpanel(trim, f, 0, L, z - 0.3, z + 0.3, 0.06)
        fpanel(trim, f, 0, L, z1 - 1.0, z1, 0.06)
      }
    }
    for (const [y0, y1] of b.legs) glazed(b.x0, y0, b.x1, y1, 0, ZB0)
    glazed(b.x0, yA, b.x1, yB, ZB0, ZB1)
    // The X-bracing of the bridging block's long faces, bay by bay.
    for (const [a, c] of [[[b.x1, yA], [b.x1, yB]], [[b.x0, yB], [b.x0, yA]]] as [XY, XY][]) {
      const f = faceOf(a, c), L = Math.abs(yB - yA), nb = Math.round(L / 22), w = 0.45, d = 0.12
      for (let k = 0; k < nb; k++) {
        const s0 = L * k / nb, s1 = L * (k + 1) / nb
        for (const [u0, u1] of [[s0, s1], [s1, s0]]) {
          const dz = ZB1 - ZB0 - 1, ds = u1 - u0, l = Math.hypot(ds, dz), ox = -dz / l * w, oz = ds / l * w
          const P = (u: number, z: number) => fp(f, u, z, d)
          const q0 = P(u0 + ox, ZB0 + oz), q1 = P(u1 + ox, ZB1 - 1 + oz), q2 = P(u1 - ox, ZB1 - 1 - oz), q3 = P(u0 - ox, ZB0 - oz)
          face(trim, q0, q1, q2, q3, fp(f, (u0 + u1) / 2, (ZB0 + ZB1) / 2, -5))
        }
      }
    }
    win.quad([b.x0, yA, ZB0], [b.x0, yB, ZB0], [b.x1, yB, ZB0], [b.x1, yA, ZB0])
    roof.quad([b.x0, yA, ZB1], [b.x1, yA, ZB1], [b.x1, yB, ZB1], [b.x0, yB, ZB1])
    const [tx0, tx1, ty0, ty1] = b.top
    box(roof, tx0, ty0, tx1, ty1, ZB1, ZT)
  }

  // ===== The north-south hall =================================================
  {
    const X0 = -20.3, X1 = 20.5, ZE = ZS + 23, ZR = ZS + 28
    // Ends and the shed's edges as lines y = a + b x (from OSM).
    const southEnd = (x: number) => -95 + (x - X0) * (-17 / 40.8), northEnd = (x: number) => 110 + (x - X0) * (-17 / 40.8)
    const shedS = (x: number) => -31 + (x - X0) * (-11 / 40.8), shedN = (x: number) => 41 + (x - X0) * (-11 / 40.8)
    const n = D ? 14 : 8, along = D ? 10 : 4
    const zr = (t: number) => ZE + (ZR - ZE) * Math.sin(Math.PI * t)
    for (const [ya, yb] of [[southEnd, shedS], [shedN, northEnd]] as [(x: number) => number, (x: number) => number][]) {
      for (let i = 0; i < n; i++) for (let k = 0; k < along; k++) {
        const t0 = i / n, t1 = (i + 1) / n, x0 = X0 + (X1 - X0) * t0, x1 = X0 + (X1 - X0) * t1
        const y = (x: number, f: number) => ya(x) + (yb(x) - ya(x)) * f
        face(glass, [x0, y(x0, k / along), zr(t0)], [x1, y(x1, k / along), zr(t1)], [x1, y(x1, (k + 1) / along), zr(t1)], [x0, y(x0, (k + 1) / along), zr(t0)], [0, y(0, 0.5), 0])
      }
      // Arched ribs across the hall roof.
      for (let k = 0; k <= along; k += D ? 1 : 2) for (let i = 0; i < n; i++) {
        const t0 = i / n, t1 = (i + 1) / n, x0 = X0 + (X1 - X0) * t0, x1 = X0 + (X1 - X0) * t1
        const y0 = ya(x0) + (yb(x0) - ya(x0)) * k / along, y1 = ya(x1) + (yb(x1) - ya(x1)) * k / along
        steel.quad([x0, y0 - 0.25, zr(t0) + 0.1], [x1, y1 - 0.25, zr(t1) + 0.1], [x1, y1 + 0.25, zr(t1) + 0.1], [x0, y0 + 0.25, zr(t0) + 0.1])
      }
    }
    // The glass end walls (with their gable under the barrel) and their frame.
    for (const end of [southEnd, northEnd]) {
      const out = end === southEnd ? -1 : 1
      for (let i = 0; i < n; i++) {
        const t0 = i / n, t1 = (i + 1) / n, x0 = X0 + (X1 - X0) * t0, x1 = X0 + (X1 - X0) * t1
        face(win, [x0, end(x0), 0], [x1, end(x1), 0], [x1, end(x1), zr(t1)], [x0, end(x0), zr(t0)], [0, end(0) - out * 5, 10])
      }
      for (let m = 0; m <= 6; m++) {
        const x = X0 + 0.4 + (X1 - X0 - 0.8) * m / 6, y = end(x) + out * 0.08
        face(trim, [x - 0.3, y, 0], [x + 0.3, y, 0], [x + 0.3, y, zr((x - X0) / (X1 - X0))], [x - 0.3, y, zr((x - X0) / (X1 - X0))], [x, y - out * 5, 10])
      }
    }
    // The south entrance canopy.
    {
      const zc = ZS + 12, y0 = southEnd(0) - 16
      const P = (x: number, f: number, z: number): V3 => [x, southEnd(x) + (f ? -16 : 0), z]
      face(steel, P(X0 - 3, 0, zc), P(X1 + 3, 0, zc), P(X1 + 3, 1, zc), P(X0 - 3, 1, zc), [0, y0, zc - 5])
      face(steel, P(X0 - 3, 0, zc - 0.8), P(X0 - 3, 1, zc - 0.8), P(X1 + 3, 1, zc - 0.8), P(X1 + 3, 0, zc - 0.8), [0, y0, zc + 5])
      face(steel, P(X0 - 3, 1, zc - 0.8), P(X0 - 3, 1, zc), P(X1 + 3, 1, zc), P(X1 + 3, 1, zc - 0.8), [0, 0, zc])
      for (const x of [X0 + 6, X1 - 6]) lathe(steel, [[0.4, ZS - 1], [0.4, zc - 0.8]], 6, x, southEnd(x) - 13, false)
    }
  }
  return { glass, steel, win, trim, conc, roof }
}

function write(Q: Q, file: string, maxTris: number) {
  const b = build(Q)
  writeModel('Berlin Hauptbahnhof', 'berlin-hauptbahnhof', [
    { part: welded(b.glass), material: { ...mat('glass', 0x5d717a, 0.24), doubleSided: true } },
    { part: welded(b.steel), material: { ...mat('hbf-steel', 0x52595e, 0.5), floodlight: (p: V3, n: V3) => (n[2] < -0.2 ? 0.7 : 0.15) } },
    { part: welded(b.win), material: mat('window', 0x4f6a6a, 0.35) },
    { part: welded(b.trim), material: mat('trim', 0x3f4549) },
    { part: welded(b.conc), material: mat('hbf-concrete', 0xb9b6ae) },
    { part: welded(b.roof), material: mat('roof', 0x9da6ad) },
  ], { bearing: BEARING, osm: 'relation/3600565', height: ZS + 48 }, maxTris, file)
}

function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}
void TAU

if (import.meta.main) {
  write(LOW, 'berlin-hauptbahnhof', 6500)
  write(HIGH, 'berlin-hauptbahnhof.detail', 40000)
}
