/**
 * Reichstag building, Berlin (Paul Wallot, 1884-1894; rebuilt as the seat of
 * the Bundestag by Foster + Partners, 1992-1999, with the glass dome):
 * original procedural geometry, CC0-1.0.
 * bun generators/berlin-reichstag.ts
 * Writes models/berlin-reichstag.glb (low) and
 * models/berlin-reichstag.detail.glb (detail, detailZoom 16).
 *
 * Exports a small facade kit (`ringOffset`, `ringLoft`, `ringBand`,
 * `faceOf`, `bayWindows`) used by the other berlin-* models of this batch;
 * merge this generator first.
 *
 * Map frame, turned to BEARING 0.35 (the OSM outline's long axis; the corner
 * towers line up 0.33 degrees east of north): +y is north, +x east, z up,
 * metres. z = 0 the Platz der Republik (Mapterhorn: flat to 0.3 m under the
 * footprint; the west stair lands 1-2 m lower). Origin = the area centroid
 * of OSM relation/2201742 (13.376100, 52.518596).
 *
 * What makes it the Reichstag, and how each is drawn
 * - Wallot's neo-Renaissance block in weathered sandstone: a rusticated
 *   base storey, a giant order of engaged columns over two storeys of
 *   windows (round-arched below, pedimented rectangles above), the heavy
 *   entablature and cornice, the parapet with its finials.
 * - The four corner pavilions, each with a big arched window over a
 *   pedimented window between paired columns, carrying the square corner
 *   towers: a plain lower stage with statues at the corners, an upper
 *   stage with three arched windows a side, cornice and attic (to 38.4 m).
 * - The west portico: six Corinthian columns on the podium over the grand
 *   stair, the entablature with "DEM DEUTSCHEN VOLKE" (the frieze band; the
 *   letters are left out), the pediment with its relief of the imperial
 *   arms (figures in the detail model), the two corner piers rising into
 *   lantern finials, and the glass entrance wall behind the columns.
 * - Foster's dome as real 3D: a translucent glass shell (38 m across,
 *   23 m high) on 24 steel ribs with horizontal rings, the open oculus ring
 *   at the top; inside it the two interleaved spiral ramps climbing to the
 *   viewing platform, and the mirrored cone narrowing down to the plenary
 *   hall, its exhaust "hat" and bench on the platform. The low model keeps
 *   the ribs as strips, a few rings, the ramps as bands and the cone; the
 *   detail model has the full lattice (24 ribs x 17 rings), boxed ramps
 *   with glass balustrades and handrails, and the cone's mirror rows.
 * - The two light courts (open to the sky) and the grey roof.
 *
 * Sources
 * - OSM relation/2201742 (outline, height 48, wikidata Q151897) and its
 *   parts: the dome way/120824761 (25-48 m, 37.5 m across), the four towers
 *   way/120824755, /756, /765, /767 (25-41 m, 14.5 m square; the photos give 38.4, see below) and their roof
 *   ways /753, /757, /764, /768; the light courts are the outline's inner
 *   rings. (c) OpenStreetMap contributors, ODbL.
 * - Published: 137.4 x 97.1 m; dome 23.5 m high, 38-40 m across, top 47 m;
 *   24 ribs and 17 rings; two spiral ramps; the mirror cone of 360 mirrors
 *   (Wikipedia "Reichstag building", "Reichstagsgebäude"; Bundestag visitor
 *   material quoted there).
 * - Mapterhorn terrain (bun tools/terrain.ts grid): flat, 2.2-2.9 m above
 *   the table's lowest point all over the footprint.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Reichstagsgebäude von Westen.jpg", Jörg Braukmann, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Reichstagsgeb%C3%A4ude_von_Westen.jpg
 *     (the west front, level: every height, the bays, towers, dome profile);
 *   "Berlin, Reichstagsgebäude -- 2019 -- 6314.jpg", Dietmar Rabich,
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Berlin,_Reichstagsgeb%C3%A4ude_--_2019_--_6314.jpg
 *     (the portico frontal: column spacing, entablature, pediment, piers);
 *   "Berlin, Reichstagsgebäude -- 2019 -- 6317.jpg", Dietmar Rabich,
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Berlin,_Reichstagsgeb%C3%A4ude_--_2019_--_6317.jpg
 *     (the south front and south-west tower from the street);
 *   "Reichstagsgebäude, Berlin-Mitte, 170402, ako.jpg", Ansgar Koreng,
 *     CC BY-SA 3.0 de,
 *     https://commons.wikimedia.org/wiki/File:Reichstagsgeb%C3%A4ude,_Berlin-Mitte,_170402,_ako.jpg
 *     (the north and east fronts across the Spree: central projections);
 *   "Bundestag Berlin Deutschland Reichstagsgebäude - 07.jpg", Norbert Nagel,
 *     CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Bundestag_Berlin_Deutschland_Reichstagsgeb%C3%A4ude_-_07.jpg
 *     (the portico from the side: its depth, the pitched roof behind the
 *     pediment, the corner finials);
 *   "Bundestag Berlin Deutschland Reichstagsgebäude - 03.jpg" and "- 01.jpg",
 *     Norbert Nagel, CC BY-SA 3.0 (the west front, level; "- 01" scaled by
 *     the pavilion's 17.9 m west face gives the tower stages),
 *     https://commons.wikimedia.org/wiki/File:Bundestag_Berlin_Deutschland_Reichstagsgeb%C3%A4ude_-_03.jpg
 *     https://commons.wikimedia.org/wiki/File:Bundestag_Berlin_Deutschland_Reichstagsgeb%C3%A4ude_-_01.jpg
 *   "Berlin Reichstag vom Kollhoff-Tower (S01 0846).jpg", Michael.F.H.Barth,
 *     CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Berlin_Reichstag_vom_Kollhoff-Tower_(S01_0846).jpg
 *     (from above, south: the grey roof, the dome on its base);
 *   "Regierungsviertel, Berlin-Mitte, 170325, ako.jpg", Ansgar Koreng,
 *     CC BY-SA 3.0 de (night: floodlit stone, lit windows, the dome lit),
 *     https://commons.wikimedia.org/wiki/File:Regierungsviertel,_Berlin-Mitte,_170325,_ako.jpg
 *   Dome, inside: "Interior of the Reichstag dome 2015 2.jpg", Perituss, CC0,
 *     https://commons.wikimedia.org/wiki/File:Interior_of_the_Reichstag_dome_2015_2.jpg
 *     (ribs, rings, the cone's top on the platform);
 *   "The Reichstag dome (11851173483).jpg", Fulvio Spada, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:The_Reichstag_dome_(11851173483).jpg
 *     (the mirror cone from the plenary hall, the lattice);
 *   "Reichstag Dome, Berlin (Ank Kumar) 04.jpg", Ank Kumar, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Reichstag_Dome,_Berlin_(Ank_Kumar)_04.jpg
 *     (the exhaust hat and bench on the platform);
 *   "Reichstag Dome designed by the architect Norman Foster, Berlin (Ank
 *     Kumar) ...", Ank Kumar, CC BY-SA 4.0 (the oculus ring).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - From OSM: the whole plan (the ring below is the outline, squared to the
 *   frame and made symmetric north-south to within 0.3 m), tower plan and
 *   height 41, dome diameter and the courts.
 * - Published: dome top 47-48 m (OSM 48), dome height 23 m over its base.
 * - Estimated from the Rabich portico photo (scaled by the 5.6 m column
 *   spacing): podium 6.0, column shafts to 19.9 and capitals to 21.2,
 *   entablature to 24.7, pediment apex 32.0, corner piers to 28.6 and the
 *   finials' tops 37.5; the wings' giant order to 20.8, cornice 24.2,
 *   parapet 25.6; arched windows 7.6-13.4, upper windows 15.6-18.3.
 * - Estimated from Nagel's "- 01" (12.2 px/m on the pavilion): the towers'
 *   stages (lower stage with the statues to 29.9, windowed stage to 35.6,
 *   cornice and attic to 38.4; OSM's 41 reads 2.5 m high against the
 *   photo, as do the portico finials at 37.9), and the pavilion windows (big
 *   arch 15.2-20.3, the pedimented window below 7.6-13.0).
 * - Estimated: the ramps make 1.75 turns each from 25.5 to the platform at
 *   40.7 m (published platform height), 1.8 m wide; the cone runs from
 *   r 1.4 at the dome floor to r 7.2 under the platform.
 * - Invented: the east portal's detail (four engaged columns and a low
 *   pediment as the Koreng photo shows it from afar), the relief figures,
 *   the statues' poses.
 *
 * Doubts: the east front is only seen at an angle; the roof's plant and
 * skylights are left flat; the outer maintenance rail on the dome is left
 * out.
 */
import { Part, addGltfTriangles, type V3, type MaterialSpec } from './mesh'
import { lathe, face, tube, ellipsoid, solid, TAU } from './nyc-columbus-monument'
import { writeModel, box, cbox } from './london-buckingham-palace'
import { place, figure, ell, tri, LOW, HIGH, type Q } from './london-albert-memorial'
import { Pen, strokes } from './lettering'

export const BEARING = 0.35

// ===========================================================================
// Kit: orthogonal rings and facades (shared with the other berlin-* models)
// ===========================================================================

export type XY = [number, number]

/** Signed area (positive = counter-clockwise from above). */
export const ringArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2

/** Make a ring counter-clockwise from above. */
export const ccw = (r: XY[]) => (ringArea(r) < 0 ? [...r].reverse() : r)

/** Offset a counter-clockwise ring outward by d (exact for right angles, mitred otherwise). */
export function ringOffset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((v, i) => {
    const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]
    const e1 = [v[0] - a[0], v[1] - a[1]], e2 = [b[0] - v[0], b[1] - v[1]]
    const l1 = Math.hypot(e1[0], e1[1]) || 1, l2 = Math.hypot(e2[0], e2[1]) || 1
    const n1 = [e1[1] / l1, -e1[0] / l1], n2 = [e2[1] / l2, -e2[0] / l2]
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [v[0] + d * (n1[0] + n2[0]) / k, v[1] + d * (n1[1] + n2[1]) / k] as XY
  })
}

const at = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])

/** Walls of a counter-clockwise ring from z0 to z1, facing out (or in, for a court). */
export function ringLoft(p: Part, r: XY[], z0: number, z1: number, inward = false) {
  const rr = inward ? [...r].reverse() : r
  p.loft([at(rr, z0), at(rr, z1)])
}

/** A flat band between two offsets of the same ring (a ledge top, a soffit). */
export function ringBand(p: Part, inner: XY[], outer: XY[], z: number, up: boolean) {
  const n = inner.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [inner[i][0], inner[i][1], z], b: V3 = [outer[i][0], outer[i][1], z], c: V3 = [outer[j][0], outer[j][1], z], d: V3 = [inner[j][0], inner[j][1], z]
    if (up) p.quad(a, b, c, d)
    else p.quad(a, d, c, b)
  }
}

/** A wall face: from a to b along a counter-clockwise ring, outward on the right. */
export type Face = { a: XY; b: XY }
export const faceOf = (a: XY, b: XY): Face => ({ a, b })
export const flen = (f: Face) => Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])
/** Point s along the face, z up, d out from it. */
export const fp = (f: Face, s: number, z: number, d: number): V3 => {
  const L = flen(f), ux = (f.b[0] - f.a[0]) / L, uy = (f.b[1] - f.a[1]) / L
  return [f.a[0] + ux * s + uy * d, f.a[1] + uy * s - ux * d, z]
}

/** A flat panel on a face, d proud of it. */
export function fpanel(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  p.quad(fp(f, s0, z0, d), fp(f, s1, z0, d), fp(f, s1, z1, d), fp(f, s0, z1, d))
}

/** A round-headed panel: jambs to zs, a true semicircle above. */
export function farch(p: Part, f: Face, sc: number, w: number, z0: number, zs: number, d = 0.06, n = 8) {
  const r = w / 2
  fpanel(p, f, sc - r, sc + r, z0, zs, d)
  const c = fp(f, sc, zs, d)
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * i / n, a1 = Math.PI * (i + 1) / n
    p.tri(c, fp(f, sc + r * Math.cos(a0), zs + r * Math.sin(a0), d), fp(f, sc + r * Math.cos(a1), zs + r * Math.sin(a1), d))
  }
}

/** A block standing on a face: front, ends, top (and soffit). */
export function fblock(p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, o: { bottom?: boolean; top?: boolean; ends?: boolean } = {}) {
  const P = (s: number, z: number, d: number) => fp(f, s, z, d)
  p.quad(P(s0, z0, d1), P(s1, z0, d1), P(s1, z1, d1), P(s0, z1, d1))
  if (o.top !== false) p.quad(P(s0, z1, d1), P(s1, z1, d1), P(s1, z1, d0), P(s0, z1, d0))
  if (o.ends !== false) {
    p.quad(P(s0, z0, d0), P(s0, z0, d1), P(s0, z1, d1), P(s0, z1, d0))
    p.quad(P(s1, z0, d1), P(s1, z0, d0), P(s1, z1, d0), P(s1, z1, d1))
  }
  if (o.bottom) p.quad(P(s0, z0, d0), P(s1, z0, d0), P(s1, z0, d1), P(s0, z0, d1))
}

/** A triangular gable block on a face: base s0..s1 at z0, apex h higher, d0..d1 out. */
export function fgable(p: Part, f: Face, s0: number, s1: number, z0: number, h: number, d0: number, d1: number, back = false) {
  const sm = (s0 + s1) / 2, P = (s: number, z: number, d: number) => fp(f, s, z, d)
  p.tri(P(s0, z0, d1), P(s1, z0, d1), P(sm, z0 + h, d1))
  if (back) p.tri(P(s1, z0, d0), P(s0, z0, d0), P(sm, z0 + h, d0))
  p.quad(P(s1, z0, d1), P(s1, z0, d0), P(sm, z0 + h, d0), P(sm, z0 + h, d1))
  p.quad(P(sm, z0 + h, d1), P(sm, z0 + h, d0), P(s0, z0, d0), P(s0, z0, d1))
}

/** An engaged half column on a face (detail) or a flat pilaster (low). */
export function engaged(p: Part, f: Face, s: number, z0: number, z1: number, r: number, round: boolean, n = 8) {
  if (!round) return fblock(p, f, s - r, s + r, z0, z1, 0, r * 0.7, { top: false })
  const ring = (z: number, rr: number): V3[] => Array.from({ length: n + 1 }, (_, i) => fp(f, s + rr * Math.cos(Math.PI * i / n), z, rr * Math.sin(Math.PI * i / n)))
  const a = ring(z0, r), b = ring(z1, r * 0.92)
  for (let i = 0; i < n; i++) p.quad(a[i + 1], a[i], b[i], b[i + 1])
}

/**
 * The standard Wallot bay, centred at s on a face: a small arched window in
 * the rusticated base, a round-arched window and a pedimented window over it.
 */
export function bayWindows(win: Part, trim: Part, f: Face, s: number, Q: Q, dBase: number) {
  const n = Q.detail ? 10 : 6
  if (Q.detail) farch(win, f, s, 1.5, 1.6, 3.4, dBase + 0.05, 8)
  else fpanel(win, f, s - 0.75, s + 0.75, 1.6, 4.0, 0.05)
  if (!Q.detail) farch(trim, f, s, 3.1, 7.3, 12.2, 0.03, 4)
  farch(win, f, s, 2.4, 7.6, 12.2, 0.05, n)
  fpanel(win, f, s - 0.95, s + 0.95, 15.6, 18.3, 0.05)
  if (Q.detail) {
    // Stone surrounds: the arch's archivolt and keystone, the upper window's sill and pediment.
    const arcPts: V3[] = []
    for (let i = 0; i <= 10; i++) { const a = Math.PI * i / 10; arcPts.push(fp(f, s + 1.45 * Math.cos(a), 12.2 + 1.45 * Math.sin(a), 0.12)) }
    tube(trim, arcPts, arcPts.map(() => 0.16), 4)
    fblock(trim, f, s - 0.25, s + 0.25, 13.1, 13.9, 0, 0.22)
    fblock(trim, f, s - 1.25, s + 1.25, 7.3, 7.6, 0, 0.25, { bottom: true })
    fblock(trim, f, s - 1.2, s + 1.2, 15.3, 15.6, 0, 0.22, { bottom: true })
    for (const e of [-1, 1]) fblock(trim, f, s + e * 1.1 - 0.15, s + e * 1.1 + 0.15, 15.6, 18.5, 0, 0.14)
    fblock(trim, f, s - 1.35, s + 1.35, 18.4, 18.7, 0, 0.3, { bottom: true })
    fgable(trim, f, s - 1.35, s + 1.35, 18.7, 0.9, 0, 0.3)
  } else {
    const P = (u: number, z: number) => fp(f, u, z, 0.12)
    trim.tri(P(s - 1.25, 18.55), P(s + 1.25, 18.55), P(s, 19.35))
  }
}

// ===========================================================================
// The Reichstag
// ===========================================================================

// Heights (see the header).
const Z_PL = 6.0 // the rusticated base's top
const Z_CAP = 20.8 // giant order's capitals
const Z_ENT = 23.0 // entablature top
const Z_COR = 24.2 // cornice top
const Z_PAR = 25.6 // parapet top
let Z_ROOF = 24.7 // the roof behind the parapet (the low model raises it to the parapet)

/** The outline, counter-clockwise, squared and made symmetric (see the header). */
function outline(detail: boolean): XY[] {
  // North-east quarter, from the east front's centre round to the north front's centre.
  const ne: XY[] = [
    [51.5, 0], [51.5, 14.4],
    ...(detail ? [[44.0, 14.4], [44.0, 19.4], [43.2, 19.4], [43.2, 47.6], [43.9, 47.6], [43.9, 50.4]] as XY[] : [[43.2, 14.4], [43.2, 50.4]] as XY[]),
    // The pavilions' notched outer corners (the low model cuts them diagonally, inside the notch).
    [46.6, 50.4], [46.6, 62.7], ...(detail ? [[43.9, 62.7], [43.9, 65.5], [41.2, 65.5]] as XY[] : []), [41.2, 68.2],
    [28.7, 68.2], [28.7, 65.5], [25.9, 65.5], [25.9, 64.4],
    ...(detail ? [[9.0, 64.4], [9.0, 65.6]] as XY[] : []),
  ]
  // North-west quarter: mirrored, with the west front's own centre (behind the portico).
  const nw: XY[] = ne.slice(detail ? 5 : 3).map(([x, y]) => [-x, y] as XY).reverse()
  const north = [...ne, [0, detail ? 65.6 : 64.4] as XY, ...nw, [-43.2, 19.4] as XY, [-45.0, 19.4] as XY, [-45.0, 0] as XY]
  const south = north.slice(1, -1).map(([x, y]) => [x, -y] as XY).reverse()
  return ccw([...north, ...south])
}

/** Pavilion centres (the corner towers stand on them). */
const PAV: XY[] = [[35.0, 56.6], [-35.0, 56.6], [-35.0, -56.6], [35.0, -56.6]]

/** The dome's profile: radius and height at parameter t in 0..1 (base to the oculus ring). */
const DOME = { Z0: 25.0, R: 19.0, Hd: 24.07, th: Math.acos(5.6 / 19.0) }
const domeAt = (t: number) => { const a = DOME.th * t; return { r: DOME.R * Math.cos(a), z: DOME.Z0 + DOME.Hd * Math.sin(a) } }
/** The dome's radius at height z. */
const domeR = (z: number) => DOME.R * Math.cos(Math.asin(Math.min(1, Math.max(0, (z - DOME.Z0) / DOME.Hd))))

function build(Q: Q) {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part(), steel = new Part()
  const D = Q.detail
  Z_ROOF = D ? 24.7 : Z_PAR
  const ring = outline(D)

  // ===== Shell: base, walls, entablature, cornice, parapet ===================
  const rPl = ringOffset(ring, 0.4), rEnt = ringOffset(ring, 0.7), rCor = ringOffset(ring, 1.25), rPar = ringOffset(ring, 0.35), rIn = ringOffset(ring, -0.3)
  if (D) {
    ringLoft(stone, rPl, 0, Z_PL)
    ringBand(trim, ring, rPl, Z_PL, true)
    ringLoft(stone, ring, Z_PL, Z_CAP)
    ringLoft(stone, rEnt, Z_CAP, Z_ENT - 0.4)
    ringLoft(trim, rEnt, Z_ENT - 0.4, Z_ENT)
    ringBand(stone, ring, rEnt, Z_CAP, false)
  } else {
    // The rusticated base storey stands proud of the wall above.
    ringLoft(stone, rPl, 0, Z_PL)
    ringBand(trim, ring, rPl, Z_PL, true)
    ringLoft(stone, ring, Z_PL, Z_CAP)
    ringLoft(stone, rEnt, Z_CAP, Z_ENT)
  }
  // Rustication: the base storey's horizontal joints, as dark grooves (detail).
  if (D) {
    const rG = ringOffset(ring, 0.42)
    for (let k = 1; k <= 3; k++) {
      const z = k * Z_PL / 4
      for (let i = 0; i < rG.length; i++) {
        const a = rG[i], b = rG[(i + 1) % rG.length]
        roof.quad([a[0], a[1], z - 0.07], [b[0], b[1], z - 0.07], [b[0], b[1], z + 0.07], [a[0], a[1], z + 0.07])
      }
    }
  }
  ringLoft(trim, rCor, Z_ENT, Z_COR)
  if (D) ringBand(trim, rEnt, rCor, Z_ENT, false)
  ringBand(trim, rPar, rCor, Z_COR, true)
  ringLoft(stone, rPar, Z_COR, Z_PAR)
  if (D) {
    ringBand(stone, rIn, rPar, Z_PAR, true)
    ringLoft(stone, rIn, Z_ROOF, Z_PAR, true)
  } else ringBand(stone, rIn, rPar, Z_PAR, true)

  // ===== Roof (grey), as rectangles inside the parapet ========================
  const flat = (x0: number, y0: number, x1: number, y1: number, z = Z_ROOF) => roof.quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z])
  const CX = 14.1, CY0 = 25.6, CY1 = 41.1 // light courts
  flat(-42.9, -CY0, 42.9, CY0)
  for (const s of [-1, 1]) {
    const ya = s > 0 ? CY0 : -CY1, yb = s > 0 ? CY1 : -CY0
    flat(-42.9, ya, -CX - 0.3, yb); flat(CX + 0.3, ya, 42.9, yb)
    flat(-42.9, s > 0 ? CY1 : -47.9, 42.9, s > 0 ? 47.9 : -CY1)
    flat(-26.3, s > 0 ? 47.9 : -64.1, 26.3, s > 0 ? 64.1 : -47.9)
    flat(-8.7, s > 0 ? 64.1 : -65.3, 8.7, s > 0 ? 65.3 : -64.1)
    // Pavilions' roofs and their projections.
    for (const sx of [-1, 1]) {
      const [px, py] = [sx * 35.0, s * 56.6]
      flat(px - 8.7, py - 8.7, px + 8.7, py + 8.7)
      flat(sx > 0 ? px + 8.7 : px - 11.3, py - 5.9, sx > 0 ? px + 11.3 : px - 8.7, py + 5.9)
      flat(px - 6.0, s > 0 ? py + 8.7 : py - 11.3, px + 6.0, s > 0 ? py + 11.3 : py - 8.7)
    }
  }
  flat(42.9, -19.1, 43.7, 19.1); flat(43.7, -14.1, 51.2, 14.1); flat(-44.7, -19.1, -42.9, 19.1)

  // ===== The light courts: inner walls with windows ===========================
  for (const s of [-1, 1]) {
    const y0 = s > 0 ? CY0 : -CY1, y1 = s > 0 ? CY1 : -CY0
    const court: XY[] = [[-CX, y0], [CX, y0], [CX, y1], [-CX, y1]]
    ringLoft(stone, court, 0, Z_ROOF, true)
    // A band of windows on each long side.
    for (const yy of [y0, y1]) {
      const out = yy === y0 ? 1 : -1 // the wall faces into the court
      const f: Face = out > 0 ? faceOf([CX, yy], [-CX, yy]) : faceOf([-CX, yy], [CX, yy])
      void f
      for (let k = 0; k < 5; k++) {
        const x = -CX + 2.8 + k * 5.6
        for (const [z0, z1] of D ? [[2, 5], [8, 13], [15.5, 19]] : []) {
          const yw = yy + out * 0.05
          face(win, [x - 1.1, yw, z0], [x + 1.1, yw, z0], [x + 1.1, yw, z1], [x - 1.1, yw, z1], [x, yy - out * 2, (z0 + z1) / 2])
        }
      }
    }
  }

  // ===== Wings: bays with the giant order ====================================
  const wing = (f: Face, n: number, padA = 0, padB = 0) => {
    const L = flen(f) - padA - padB, w = L / n
    for (let k = 0; k <= n; k++) {
      const s = padA + Math.min(L - 0.65, Math.max(0.65, k * w))
      engaged(stone, f, s, D ? Z_PL : 0, D ? Z_CAP - 0.9 : Z_CAP, D ? 0.62 : 0.75, D, 8)
      if (D) fblock(trim, f, s - 0.8, s + 0.8, Z_CAP - 0.9, Z_CAP, 0, 0.75, { top: false, bottom: true })
      if (D) fblock(trim, f, s - 0.85, s + 0.85, Z_PL, Z_PL + 0.6, 0, 0.75)
      // Finial on the parapet over each column (detail).
      if (D) {
        const c = fp(f, s, 0, 0.0)
        lathe(trim, [[0.42, Z_PAR], [0.2, Z_PAR + 0.7], [0.32, Z_PAR + 1.2], [0.05, Z_PAR + 2.0]], 5, c[0], c[1])
      }
    }
    for (let k = 0; k < n; k++) bayWindows(win, trim, f, padA + (k + 0.5) * w, Q, 0.4)
  }
  // West and east long fronts.
  for (const s of [-1, 1]) {
    const yA = s > 0 ? 47.6 : -19.4, yB = s > 0 ? 19.4 : -47.6
    wing(faceOf([-43.2, yA], [-43.2, yB]), 5)
    wing(faceOf([43.2, -yA], [43.2, -yB]), 5)
  }
  // North and south fronts' wings (3 bays a side of the centre).
  for (const s of [-1, 1]) for (const sx of [-1, 1]) {
    const y = s * 64.4
    const xa = sx * 25.9, xb = sx * 9.0
    // Counter-clockwise: the north front runs east to west, the south front west to east.
    const f = s > 0 ? faceOf(sx > 0 ? [xa, y] : [xb, y], sx > 0 ? [xb, y] : [xa, y]) : faceOf(sx > 0 ? [xb, y] : [xa, y], sx > 0 ? [xa, y] : [xb, y])
    wing(f, 3)
  }

  // ===== Pavilion fronts, and the north and south centres =====================
  /** The big arched window over a pedimented window, between paired columns. */
  const pavFront = (f: Face, attic: boolean) => {
    const L = flen(f), c = L / 2
    for (const e of [-1, 1]) for (const o of [3.75, 5.55]) {
      engaged(stone, f, c + e * o, D ? Z_PL : 0, D ? Z_CAP - 0.9 : Z_CAP, 0.65, D, 8)
      if (D) fblock(trim, f, c + e * o - 0.85, c + e * o + 0.85, Z_CAP - 0.9, Z_CAP, 0, 0.8, { top: false, bottom: true })
    }
    farch(win, f, c, 4.6, 15.2, 17.9, 0.05, D ? 12 : 8)
    fpanel(win, f, c - 1.3, c + 1.3, 7.6, 13.0, 0.05)
    // The aedicula: pediment and its columns, and the arch's archivolt.
    fblock(trim, f, c - 1.9, c + 1.9, 13.2, 13.7, 0, 0.45, { bottom: true })
    fgable(trim, f, c - 1.9, c + 1.9, 13.7, 1.2, 0, 0.45)
    if (D) {
      for (const e of [-1, 1]) fblock(trim, f, c + e * 1.6 - 0.22, c + e * 1.6 + 0.22, 7.4, 13.2, 0, 0.3)
      const pts: V3[] = []
      for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; pts.push(fp(f, c + 2.6 * Math.cos(a), 17.9 + 2.6 * Math.sin(a), 0.15)) }
      tube(trim, pts, pts.map(() => 0.22), 4)
      fblock(trim, f, c - 0.35, c + 0.35, 20.2, 20.8, 0, 0.3)
      fblock(trim, f, c - 2.6, c + 2.6, 14.9, 15.2, 0, 0.3, { bottom: true })
      farch(win, f, c - L / 2 + 1.2, 1.4, 1.6, 3.4, 0.45, 6)
      farch(win, f, c + L / 2 - 1.2, 1.4, 1.6, 3.4, 0.45, 6)
    }
    farch(win, f, c, 1.6, 1.6, 3.4, 0.45, D ? 8 : 4)
    if (attic) {
      // A raised attic over the centre, with a statue group (detail).
      fblock(stone, f, c - 6.0, c + 6.0, Z_PAR - 0.2, Z_PAR + 1.6, -1.5, 0.5)
      fblock(trim, f, c - 6.2, c + 6.2, Z_PAR + 1.6, Z_PAR + 2.0, -1.5, 0.7, { bottom: true })
    }
  }
  for (const [px, py] of PAV) {
    const sx = Math.sign(px), sy = Math.sign(py)
    // The outer east/west face (x = +-46.6) and the outer north/south face (y = +-68.2).
    const fx = sx > 0 ? faceOf([46.6, py - 6.15], [46.6, py + 6.15]) : faceOf([-46.6, py + 6.15], [-46.6, py - 6.15])
    const fy = sy > 0 ? faceOf([px + 6.25, 68.2], [px - 6.25, 68.2]) : faceOf([px - 6.25, -68.2], [px + 6.25, -68.2])
    pavFront(fx, false)
    pavFront(fy, false)
  }
  for (const s of [-1, 1]) pavFront(s > 0 ? faceOf([9.0, 65.6], [-9.0, 65.6]) : faceOf([-9.0, -65.6], [9.0, -65.6]), true)

  // ===== Corner towers ======================================================
  for (const [px, py] of PAV) {
    const H = 7.25
    cbox(stone, px - H, py - H, px + H, py + H, Z_ROOF, 29.4, D ? 0.4 : 0)
    if (D) cbox(trim, px - H - 0.3, py - H - 0.3, px + H + 0.3, py + H + 0.3, 29.3, 29.9, 0)
    cbox(stone, px - 7.0, py - 7.0, px + 7.0, py + 7.0, D ? 29.9 : 29.4, 35.6, D ? 0.4 : 0)
    cbox(trim, px - 7.55, py - 7.55, px + 7.55, py + 7.55, 35.6, 36.5, D ? 0.3 : 0)
    cbox(stone, px - 7.1, py - 7.1, px + 7.1, py + 7.1, 36.5, D ? 38.0 : 38.4, 0)
    if (D) cbox(trim, px - 7.25, py - 7.25, px + 7.25, py + 7.25, 38.0, 38.4, 0)
    roof.quad([px - 6.6, py - 6.6, 38.42], [px + 6.6, py - 6.6, 38.42], [px + 6.6, py + 6.6, 38.42], [px - 6.6, py + 6.6, 38.42])
    // The corner turrets on the attic: square pedestals with obelisk finials.
    for (const [cx, cy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
      const x = px + cx * 6.4, y = py + cy * 6.4
      if (D) cbox(stone, x - 0.7, y - 0.7, x + 0.7, y + 0.7, 38.4, 39.6, 0)
      lathe(trim, D ? [[0.55, 39.6], [0.45, 40.0], [0.38, 41.6], [0.12, 42.4], [0.02, 42.6]] : [[0.6, 38.4], [0.3, 41.6], [0.02, 42.5]], D ? 8 : 4, x, y)
    }
    // Three arched windows a side on the upper stage, pilasters between.
    for (let k = 0; k < 4; k++) {
      const c: XY[] = [[px + 7, py + 7], [px - 7, py + 7], [px - 7, py - 7], [px + 7, py - 7]]
      const f = faceOf(c[k], c[(k + 1) % 4])
      for (const s of [3.0, 7.0, 11.0]) {
        if (D) farch(win, f, s, 1.7, 30.8, 33.5, 0.05, 8)
        else fpanel(win, f, s - 0.85, s + 0.85, 30.8, 34.2, 0.05)
      }
      if (D) {
        for (const s of [1.0, 5.0, 9.0, 13.0]) fblock(stone, f, s - 0.45, s + 0.45, 29.9, 35.6, 0, 0.3, { top: false })
        fblock(trim, f, 0.6, 13.4, 30.5, 30.8, 0, 0.25, { bottom: true })
      }
    }
    // Statues on the pavilion's parapet at the tower's corners.
    if (D) {
      for (const [cx, cy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
        const x = px + cx * 8.3, y = py + cy * 8.3
        cbox(stone, x - 0.75, y - 0.75, x + 0.75, y + 0.75, Z_ROOF, Z_PAR + 1.0, 0.15)
        place(stone, [x, y, Z_PAR + 1.0], Math.atan2(cy, cx) - Math.PI / 2, 1, (q) => figure(q, { tube: 4, ell: 5, rows: 3, ring: 6, detail: true }, 3.4, {
          arms: [[[0.13, 0, 0.78], [0.17, 0.08, 0.6], [0.14, 0.18, 0.5]], [[-0.13, 0, 0.78], [-0.2, 0.02, 0.62], [-0.22, 0.05, 0.45]]], girth: 1.35,
        }), 88)
      }
    } else {
      for (const [cx, cy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
        const x = px + cx * 8.3, y = py + cy * 8.3
        box(stone, x - 0.7, y - 0.7, x + 0.7, y + 0.7, Z_ROOF, Z_PAR + 0.8)
        // A statue group in the round: body and head.
        lathe(stone, [[0.75, Z_PAR + 0.8], [0.45, Z_PAR + 2.4], [0.02, Z_PAR + 3.4]], 4, x, y)
      }
    }
  }

  // ===== West portico =======================================================
  {
    const XB = -45.0, XF = -51.9, YP = 15.75
    const fW = faceOf([XB, 19.4], [XB, -19.4]) // the wall behind, facing west
    // Podium and the grand stair down to the square.
    box(stone, XF, -YP, XB, YP, 0, Z_PL)
    trim.quad([XF - 0.3, -YP, Z_PL], [XB, -YP, Z_PL], [XB, YP, Z_PL], [XF - 0.3, YP, Z_PL])
    const nSt = D ? 12 : 4, run = 9.6
    for (let k = 0; k < nSt; k++) {
      const z1 = Z_PL * (nSt - k) / nSt, x0 = XF - run * (k + 1) / nSt
      box(stone, x0, -12.6, XF - run * k / nSt, 12.6, 0, z1)
    }
    // The stair's cheek walls.
    for (const s of [-1, 1]) cbox(stone, XF - run - 0.4, s > 0 ? 12.6 : -15.4, XF, s > 0 ? 15.4 : -12.6, 0, D ? 3.2 : 3.0, D ? 0.2 : 0)
    // The entrance glazing between the inner columns, and the relief panels beside it.
    // The loggia: the glass entrance wall across the whole back, dark behind the columns.
    fpanel(win, fW, 19.4 - 15.6, 19.4 + 15.6, Z_PL, 21.3, 0.04)
    for (const e of [-1, 1]) {
      fblock(stone, fW, 19.4 + e * 11.2 - 2.0, 19.4 + e * 11.2 + 2.0, Z_PL, 21.3, 0, 0.12)
      fblock(trim, fW, 19.4 + e * 11.2 - 1.6, 19.4 + e * 11.2 + 1.6, 8.0, 18.6, 0.12, 0.3)
      if (D) {
        // The arms and figures of the panels: a shield over a cartouche.
        const c = fp(fW, 19.4 + e * 11.2, 14.5, 0.25)
        ellipsoid(trim, c, [0.25, 1.1, 1.6], 8, 4)
        ellipsoid(trim, fp(fW, 19.4 + e * 11.2, 10.6, 0.25), [0.2, 0.9, 1.1], 8, 4)
      }
    }
    // Columns: six in front, two behind at the ends.
    const cols: XY[] = [-14.0, -8.4, -2.8, 2.8, 8.4, 14.0].map((y) => [-50.4, y] as XY)
    if (D) cols.push([-46.6, -14.0], [-46.6, 14.0])
    for (const [x, y] of cols) {
      box(stone, x - 1.2, y - 1.2, x + 1.2, y + 1.2, Z_PL, Z_PL + 0.9)
      lathe(stone, [[1.05, Z_PL + 0.9], [1.0, Z_PL + 1.3], [0.9, 19.9]], D ? 16 : 8, x, y, false)
      lathe(trim, [[0.9, 19.9], [1.3, 21.0]], D ? 16 : 8, x, y, false)
      box(trim, x - 1.35, y - 1.35, x + 1.35, y + 1.35, 21.0, 21.3)
      if (D) for (let k = 0; k < 8; k++) {
        const a = k * TAU / 8
        ellipsoid(trim, [x + 0.95 * Math.cos(a), y + 0.95 * Math.sin(a), 20.2], [0.28, 0.28, 0.5], 5, 2)
      }
    }
    // Entablature: architrave, the inscription frieze, cornice.
    box(stone, XF + 0.4, -YP, XB, YP, 21.3, 22.4)
    box(trim, XF + 0.3, -YP, XB, YP, 22.4, 23.9)
    win.quad([XF + 0.4, -YP, 21.3], [XF + 0.4, YP, 21.3], [XB, YP, 21.3], [XB, -YP, 21.3])
    // "DEM DEUTSCHEN VOLKE" on the frieze, in dark bronze letters (detail): Roman capitals.
    if (D) {
      const G: Record<string, [number, (p: Pen) => void]> = {
        D: [0.72, (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.32, 1]).cubicTo([0.78, 1], [0.78, 0], [0.32, 0]).lineTo([0, 0]) }],
        E: [0.56, (p) => { p.moveTo([0.56, 1]).lineTo([0, 1]).lineTo([0, 0]).lineTo([0.56, 0]); p.moveTo([0, 0.5]).lineTo([0.42, 0.5]) }],
        M: [0.86, (p) => { p.moveTo([0, 0]).lineTo([0.04, 1]).lineTo([0.43, 0.12]).lineTo([0.82, 1]).lineTo([0.86, 0]) }],
        U: [0.64, (p) => { p.moveTo([0, 1]).lineTo([0, 0.32]).cubicTo([0, -0.1], [0.64, -0.1], [0.64, 0.32]).lineTo([0.64, 1]) }],
        T: [0.62, (p) => { p.moveTo([0, 1]).lineTo([0.62, 1]); p.moveTo([0.31, 1]).lineTo([0.31, 0]) }],
        S: [0.58, (p) => { p.moveTo([0.56, 0.86]).cubicTo([0.42, 1.06], [0.02, 1.0], [0.04, 0.73]).cubicTo([0.07, 0.5], [0.58, 0.55], [0.58, 0.26]).cubicTo([0.58, -0.06], [0.1, -0.05], [0.0, 0.16]) }],
        C: [0.64, (p) => { p.moveTo([0.62, 0.84]).cubicTo([0.45, 1.08], [0, 1.0], [0, 0.5]).cubicTo([0, 0], [0.45, -0.08], [0.62, 0.16]) }],
        H: [0.64, (p) => { p.moveTo([0, 0]).lineTo([0, 1]); p.moveTo([0.64, 0]).lineTo([0.64, 1]); p.moveTo([0, 0.5]).lineTo([0.64, 0.5]) }],
        N: [0.66, (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.66, 0]).lineTo([0.66, 1]) }],
        V: [0.66, (p) => { p.moveTo([0, 1]).lineTo([0.33, 0]).lineTo([0.66, 1]) }],
        O: [0.8, (p) => { p.circle([0.4, 0.5], 0.4, 0.5, 14) }],
        L: [0.52, (p) => { p.moveTo([0, 1]).lineTo([0, 0]).lineTo([0.52, 0]) }],
        K: [0.64, (p) => { p.moveTo([0, 0]).lineTo([0, 1]); p.moveTo([0.62, 1]).lineTo([0.02, 0.42]); p.moveTo([0.2, 0.6]).lineTo([0.64, 0]) }],
      }
      const text = 'DEM DEUTSCHEN VOLKE', gap = 0.22, space = 0.55
      const width = [...text].reduce((w, ch) => w + (ch === ' ' ? space : G[ch][0] + gap), -gap)
      const pen = new Pen()
      let u = -width / 2
      for (const ch of text) {
        if (ch === ' ') { u += space; continue }
        const g = new Pen(); G[ch][1](g); pen.add(g, u, 0); u += G[ch][0] + gap
      }
      const cap = 0.95, xf = XF + 0.3
      strokes(roof, pen.paths, { width: 0.13, depth: 0.08, place: (uu, v, w) => [xf - w * cap, -uu * cap, 22.67 + v * cap] })
    }
    cbox(trim, XF - 0.4, -YP - 0.5, XB, YP + 0.5, 23.9, 24.7, 0)
    // Pediment: tympanum, raking cornices and the pitched roof behind.
    const ZA = 32.0, Y2 = YP + 0.5
    face(stone, [XF - 0.1, -Y2 + 0.8, 24.7], [XF - 0.1, Y2 - 0.8, 24.7], [XF - 0.1, 0.01, ZA - 0.9], [XF - 0.1, -0.01, ZA - 0.9], [0, 0, 28])
    for (const s of [-1, 1]) {
      // Raking cornice (a sloped bar along the gable's edge).
      const a: V3 = [XF - 0.5, s * Y2, 24.7], b: V3 = [XF - 0.5, 0, ZA]
      const a2: V3 = [XF - 0.5, s * (Y2 - 1.2), 24.7], b2: V3 = [XF - 0.5, 0, ZA - 1.05]
      face(trim, a, b, b2, a2, [0, 0, 28])
      // Pitched roof from the gable back to the attic.
      face(roof, [XF - 0.5, s * Y2, 24.7], [XF - 0.5, 0, ZA], [-46.0, 0, ZA], [-46.0, s * Y2, 24.7], [-46, 0, 20])
    }
    // The attic behind the pediment, between the corner piers.
    cbox(stone, -46.0, -15.6, -39.5, 15.6, Z_ROOF, 30.6, 0)
    cbox(trim, -46.4, -16.0, -39.2, 16.0, 30.6, 31.2, 0)
    if (D) {
      // The relief: the imperial arms held by figures, a frieze of reclining figures to the corners.
      ellipsoid(trim, [XF + 0.05, 0, 27.6], [0.5, 1.7, 2.1], 10, 5)
      ellipsoid(trim, [XF + 0.05, 0, 30.0], [0.4, 1.0, 0.7], 8, 4)
      for (const s of [-1, 1]) {
        for (const [y, z, h] of [[3.2, 24.8, 4.4], [6.4, 24.8, 3.4], [9.6, 24.8, 2.4]]) {
          place(trim, [XF + 0.3, s * y, z], s > 0 ? Math.PI : 0, 1, (q) => figure(q, { tube: 4, ell: 5, rows: 3, ring: 6, detail: true }, h, {
            arms: [[[0.13, 0, 0.78], [0.25, 0.1, 0.9], [0.28, 0.12, 1.0]], [[-0.13, 0, 0.78], [-0.2, 0.05, 0.6], [-0.15, 0.1, 0.5]]], girth: 1.3,
          }), 88, 0, 0)
        }
        ellipsoid(trim, [XF + 0.3, s * 12.6, 25.5], [0.45, 1.8, 0.6], 8, 4)
      }
    }
    // The corner piers rising into lantern finials.
    for (const s of [-1, 1]) {
      const y0 = s > 0 ? 15.6 : -19.4, y1 = s > 0 ? 19.4 : -15.6, yc = s * 17.5
      cbox(stone, -48.6, y0, -44.6, y1, Z_PL, 28.6, D ? 0.3 : 0)
      cbox(trim, -48.9, y0 - 0.3, -44.3, y1 + 0.3, 27.9, 28.6, 0)
      const xc = -46.6
      cbox(stone, xc - 1.7, yc - 1.7, xc + 1.7, yc + 1.7, 28.6, 31.2, D ? 0.25 : 0)
      cbox(trim, xc - 1.9, yc - 1.9, xc + 1.9, yc + 1.9, 31.2, 31.6, 0)
      lathe(trim, D
        ? [[1.55, 31.6], [1.25, 32.0], [1.4, 33.6], [1.05, 34.8], [1.25, 35.3], [0.7, 35.9], [0.6, 36.7], [0.3, 37.1], [0.38, 37.4], [0.05, 37.9]]
        : [[1.5, 31.6], [1.35, 33.6], [1.15, 35.3], [0.55, 36.6], [0.05, 37.9]], D ? 12 : 6, xc, yc)
    }
  }

  // ===== East portal: projecting centre with engaged columns and a pediment =====
  {
    const f = faceOf([51.5, -14.4], [51.5, 14.4])
    for (const s of [1.4, 7.6, 13.0, 15.8, 21.2, 27.4]) {
      engaged(stone, f, s, D ? Z_PL : 0, D ? Z_CAP - 0.9 : Z_CAP, 0.7, D, 8)
      if (D) fblock(trim, f, s - 0.9, s + 0.9, Z_CAP - 0.9, Z_CAP, 0, 0.85, { top: false, bottom: true })
    }
    for (const s of [4.5, 24.3]) bayWindows(win, trim, f, s, Q, 0.4)
    farch(win, f, 14.4, 4.0, 7.4, 16.8, 0.05, D ? 12 : 8)
    fgable(trim, f, -0.8, 29.6, Z_PAR, 4.6, -2.0, 0.9, true)
  }

  // ===== Foster's dome =======================================================
  {
    const { Z0 } = DOME
    const NS = 24, NR = D ? 16 : 8
    // Its base drum on the roof (the roof terrace's edge), grey.
    if (D) {
      lathe(roof, [[19.6, Z_ROOF], [19.6, Z0 + 0.2]], 48, 0, 0, false)
      ringBandCircle(roof, 0, 19.6, Z0 + 0.2, 48)
    }
    // Glass between the ribs.
    const P = (i: number, k: number, dr = 0): V3 => {
      const { r, z } = domeAt(k / NR), a = i * TAU / NS
      return [(r + dr) * Math.cos(a), (r + dr) * Math.sin(a), z]
    }
    for (let k = 0; k < NR; k++) for (let i = 0; i < NS; i++) glass.quad(P(i, k), P(i + 1, k), P(i + 1, k + 1), P(i, k + 1))
    // Ribs and rings.
    if (D) {
      // Box-section ribs straddling the glass, and the 17 rings.
      for (let i = 0; i < NS; i++) {
        const a = i * TAU / NS, ca = Math.cos(a), sa = Math.sin(a), ux = -sa, uy = ca
        for (let k = 0; k < NR; k++) {
          const sec = (kk: number): V3[] => {
            const { r, z } = domeAt(kk / NR), t = DOME.th * kk / NR
            const nx = Math.cos(t), nz = Math.sin(t) // outward normal of the profile (approx.)
            const o = (dr: number, w: number): V3 => [ (r + dr * nx) * ca + w * ux, (r + dr * nx) * sa + w * uy, z + dr * nz * 0.6]
            return [o(0.08, -0.17), o(0.08, 0.17), o(-0.5, 0.17), o(-0.5, -0.17)]
          }
          const s0 = sec(k), s1 = sec(k + 1)
          const cen = [...s0, ...s1].reduce((m, v) => [m[0] + v[0] / 8, m[1] + v[1] / 8, m[2] + v[2] / 8] as V3, [0, 0, 0] as V3)
          for (let j = 0; j < 4; j++) { const l = (j + 1) % 4; face(steel, s0[l], s0[j], s1[j], s1[l], cen) }
        }
      }
      for (let k = 0; k <= NR; k++) {
        const { r, z } = domeAt(k / NR), th = k === NR ? 0.5 : 0.11
        const n = NS
        const rr = (dr: number, dz: number) => Array.from({ length: n }, (_, i): V3 => [(r + dr) * Math.cos(i * TAU / n), (r + dr) * Math.sin(i * TAU / n), z + dz])
        const a = rr(0.06, -th), b = rr(0.06, th), c = rr(-0.3, th), d = rr(-0.3, -th)
        steel.loft([a, b]); steel.loft([c, d]); steel.loft([b, c]); steel.loft([d, a])
      }
    } else {
      for (let i = 0; i < NS; i++) {
        const a = i * TAU / NS, ux = -Math.sin(a) * 0.2, uy = Math.cos(a) * 0.2
        for (let k = 0; k < NR; k++) {
          const p0 = P(i, k, 0.07), p1 = P(i, k + 1, 0.07)
          steel.quad([p0[0] - ux, p0[1] - uy, p0[2]], [p0[0] + ux, p0[1] + uy, p0[2]], [p1[0] + ux, p1[1] + uy, p1[2]], [p1[0] - ux, p1[1] - uy, p1[2]])
        }
      }
      for (const k of [2, 4, 6, 8]) {
        const { r, z } = domeAt(k / NR), th = k === NR ? 0.45 : k === 0 ? 0.3 : 0.12
        const rr = (dz: number, dr: number) => Array.from({ length: NS }, (_, i): V3 => [(r + dr) * Math.cos(i * TAU / NS), (r + dr) * Math.sin(i * TAU / NS), z + dz])
        steel.loft([rr(-th, 0.09), rr(th, 0.09)])
        if (k === NR) { steel.loft([rr(th, 0.09), rr(th, -0.5)]) }
      }
    }
    // The two spiral ramps, interleaved, hugging the glass.
    const zA = Z0 + 0.5, zB = 40.7, turns = 1.75, W = 1.8
    const nSeg = D ? 96 : 18
    for (const a0 of [Math.PI, 0]) {
      const pts = (t: number) => {
        const z = zA + (zB - zA) * t, a = a0 + turns * TAU * t, ro = domeR(z) - 0.7, ri = ro - W
        return { z, a, ro, ri }
      }
      for (let k = 0; k < nSeg; k++) {
        const A = pts(k / nSeg), B = pts((k + 1) / nSeg)
        const p = (s: typeof A, r: number, dz: number): V3 => [r * Math.cos(s.a), r * Math.sin(s.a), s.z + dz]
        const th = D ? 0.4 : 0.3
        // Deck top and underside, inner and outer edges.
        face(steel, p(A, A.ri, 0), p(B, B.ri, 0), p(B, B.ro, 0), p(A, A.ro, 0), p(A, (A.ri + A.ro) / 2, -5))
        face(steel, p(A, A.ri, -th), p(A, A.ro, -th), p(B, B.ro, -th), p(B, B.ri, -th), p(A, (A.ri + A.ro) / 2, 5))
        const mA = p(A, (A.ri + A.ro) / 2, -th / 2)
        if (D) {
          face(steel, p(A, A.ri, 0), p(A, A.ri, -th), p(B, B.ri, -th), p(B, B.ri, 0), mA)
          face(steel, p(A, A.ro, 0), p(B, B.ro, 0), p(B, B.ro, -th), p(A, A.ro, -th), mA)
        }
        if (D) {
          // Glass balustrades both sides, with a handrail.
          for (const r of [A.ri + 0.05, A.ro - 0.05]) {
            const rb = r === A.ri + 0.05 ? B.ri + 0.05 : B.ro - 0.05
            glass.quad(p(A, r, 0), p(B, rb, 0), p(B, rb, 1.1), p(A, r, 1.1))
            const h0 = p(A, r, 1.1), h1 = p(B, rb, 1.1)
            steel.quad([h0[0], h0[1], h0[2]], [h1[0], h1[1], h1[2]], [h1[0], h1[1], h1[2] + 0.08], [h0[0], h0[1], h0[2] + 0.08])
            steel.quad([h1[0], h1[1], h1[2]], [h0[0], h0[1], h0[2]], [h0[0], h0[1], h0[2] + 0.08], [h1[0], h1[1], h1[2] + 0.08])
          }
        }
      }
    }
    // The viewing platform at the ramps' top.
    {
      const n = D ? 48 : 16, r0 = 4.2, r1 = domeR(zB) - 0.7
      const ringAt = (r: number, z: number) => Array.from({ length: n }, (_, i): V3 => [r * Math.cos(i * TAU / n), r * Math.sin(i * TAU / n), z])
      const o0 = ringAt(r1, zB), o1 = ringAt(r1, zB - 0.45), i0 = ringAt(r0, zB), i1 = ringAt(r0, zB - 0.45)
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        steel.quad(i0[i], o0[i], o0[j], i0[j])
        steel.quad(i1[i], i1[j], o1[j], o1[i])
      }
      steel.loft([o1, o0])
    }
    // The mirror cone from the dome floor up to the platform, its hat and bench.
    {
      const n = D ? 24 : 10
      const prof: [number, number][] = D
        ? Array.from({ length: 13 }, (_, k) => { const t = k / 12; return [1.4 + 5.8 * Math.pow(t, 1.6) + (k % 2 ? 0.12 : 0), Z0 + 0.2 + (zB - 0.5 - Z0 - 0.2) * t] as [number, number] })
        : [[1.4, Z0 + 0.2], [2.6, Z0 + 6.0], [4.6, Z0 + 11.5], [7.2, zB - 0.5]]
      lathe(steel, prof, n, 0, 0, false)
      lathe(steel, [[5.3, zB], [5.3, zB + 0.5], [4.0, zB + 0.5]], n, 0, 0, false)
      lathe(steel, D ? [[4.0, zB + 0.5], [3.8, zB + 1.5], [3.3, zB + 2.6], [2.8, zB + 3.4], [2.9, zB + 3.6], [2.6, zB + 3.7]] : [[4.0, zB + 0.5], [3.1, zB + 3.0], [2.6, zB + 3.6]], n, 0, 0, true)
    }
  }

  return { stone, trim, roof, win, glass, steel }
}

/** A flat disc annulus (or disc, r0 = 0) at z, facing up. */
function ringBandCircle(p: Part, r0: number, r1: number, z: number, n: number) {
  for (let i = 0; i < n; i++) {
    const a = i * TAU / n, b = (i + 1) * TAU / n
    const o0: V3 = [r1 * Math.cos(a), r1 * Math.sin(a), z], o1: V3 = [r1 * Math.cos(b), r1 * Math.sin(b), z]
    if (r0 <= 0) p.tri([0, 0, z], o0, o1)
    else p.quad([r0 * Math.cos(a), r0 * Math.sin(a), z], o0, o1, [r0 * Math.cos(b), r0 * Math.sin(b), z])
  }
}

/**
 * Re-shade a part smooth within `crease` degrees: coplanar and gently curved
 * neighbours then share their corners, which keeps the file small.
 */
export function welded(p: Part, crease = 35): Part {
  const q = new Part()
  addGltfTriangles(q, Float32Array.from(p.pos), Uint32Array.from({ length: p.pos.length / 3 }, (_, i) => i), { creaseDegrees: crease })
  return q
}

function write(Q: Q, file: string, maxTris: number) {
  const b = build(Q)
  const [stone, trim, roof, win, glass, steel] = [b.stone, b.trim, b.roof, b.win, b.glass, b.steel].map((p) => welded(p))
  const lit = (p: V3, n: V3) => (n[2] > 0.9 ? 0.25 : p[2] < 42 ? 0.85 : 0.5)
  writeModel('Reichstag building', 'berlin-reichstag', [
    { part: stone, material: { ...mat('reichstag-sandstone', 0xb2a68e), floodlight: lit } },
    { part: trim, material: Q.detail ? { ...mat('trim', 0xc4b9a1), floodlight: lit } : mat('trim', 0xc4b9a1) },
    { part: roof, material: mat('roof', 0x6f7579) },
    { part: win, material: mat('window', 0x667d84, 0.35) },
    { part: glass, material: { ...mat('glass', 0x86a0b0, 0.2), opacity: 0.45, doubleSided: true } },
    // The dome's steel, ramps and mirror cone: lit from inside at night.
    { part: steel, material: { ...mat('reichstag-steel', 0xc9ced2, 0.4), floodlight: (p) => (p[2] > 25 ? 0.9 : 0) } },
  ], { bearing: BEARING, osm: 'relation/2201742', height: 48.0 }, maxTris, file)
}

function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}
void solid; void ell; void tri

if (import.meta.main) {
  write(LOW, 'berlin-reichstag', 6500)
  write(HIGH, 'berlin-reichstag.detail', 40000)
}
