/**
 * Huntington Bank Building (the Union Trust Building, 1924, Graham,
 * Anderson, Probst & White; now The 925 Building), Euclid Avenue at East
 * 9th Street, Cleveland: procedural, CC0-1.0.
 * bun generators/cle-huntington-bank-building.ts [out.glb]
 *
 * Model frame: x and y in metres, turned to bearing 326.5 (+y runs up East
 * 9th Street, roughly north-north-west; +x roughly east-north-east), z up.
 * The origin is the OSM multipolygon's area centroid (-81.6864767,
 * 41.5009482); z = 0 is the lowest street under the footprint (the north
 * side, lidar 199.07 m NAVD88). Euclid Avenue's sidewalk is about 2.3 m
 * higher and East 9th's rises from 1 m to 2.4 m southwards; the base walls
 * there run down into it.
 *
 * Form: a 21-storey limestone block filling the whole lot between Euclid
 * Avenue and East 9th, wedge-cut on its Euclid side. Six base storeys fill
 * the lot; above them two light courts (a long one on the west, a wide one
 * on the east) cut the block into an E. On the two street fronts a giant
 * Ionic colonnade, four storeys tall, stands in front of recessed glazing
 * between solid corner piers; over it a mezzanine and the base cornice. The
 * shaft has evenly spaced punched windows; a string course, an attic zone
 * of tall paired windows and a heavy dentilled cornice finish it. The back
 * and the courts are grey-brown brick. Behind the cornice, set back, the
 * roof steps up in attic storeys and a penthouse band (lidar).
 *
 * Sources
 * - OSM (ODbL): relation/4682394 (multipolygon: outer way/189749442, inner
 *   way/333475714 and way/333475715, the light courts; height 88,
 *   21 levels, Q5945254). Plan from OSM, the courts nudged to the lidar's
 *   edges (the west court is 11.5 m wide in the lidar, 15 m in OSM).
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 1 m grid, in this frame. Court floors (the base's roof)
 *   26-27 m; main cornice and roof edge 78.8-79.3 m; attic roofs 82.1 m
 *   (west wing, the bar south of the east court, the centre) and 84.4 m
 *   (north wing); a penthouse band along the south-east party wall 87-93 m
 *   (drawn 88.5 m); a penthouse on the north-east 83.6 m. All above z = 0.
 * - Published: 21 storeys, 289 ft (88 m) (Wikipedia, "The 925 Building";
 *   OSM height 88), which the penthouse band agrees with.
 * - Photos (evidence): Geowizical, "925 Building Cleveland (June 2024)"
 *   (Wikimedia Commons, CC BY-SA 4.0; from the Euclid-E. 9th corner: the
 *   colonnades, corner piers, the base cornice, the shaft, the attic zone
 *   and cornice; storey counts and proportions);
 *   https://commons.wikimedia.org/wiki/File:925_Building_Cleveland_(June_2024).jpg
 *   Warren LeMay, "Union Trust Building, Cleveland, OH (27420310167)",
 *   "Huntington Bank Building, Cleveland, OH (27732086677)" and
 *   "(28726176668)" (Commons, CC0; the Euclid colonnade close up, the
 *   block from afar);
 *   https://commons.wikimedia.org/wiki/File:Union_Trust_Building,_Cleveland,_OH_(27420310167).jpg
 *   Ryan, "Huntington Building" (Commons, CC BY 2.0; the colonnade and
 *   mezzanine at night); https://commons.wikimedia.org/wiki/File:Huntington_Building.jpg
 *   Tim Evanson, "NE facade 03 - Union Trust Building (32232126358)",
 *   "N corner main building - Union Trust Building (46103418621)",
 *   "Facade - 925 Euclid (43224241085)", "Break between buildings - Union
 *   Trust Building (32232050578)" (Commons, CC BY-SA 2.0; the brick rear
 *   with stone quoins, the stone north corner, the columns side on).
 *   https://commons.wikimedia.org/wiki/File:NE_facade_03_-_Union_Trust_Building_(32232126358).jpg
 * Estimated (from the photos, scaled to the lidar): colonnade to 19.6 m,
 *   column radius 0.95 m (a little bold), recess 2.2 m, corner piers 4.5 m (south-west) and
 *   6 m (the far ends); 13 columns on E. 9th, 7 on Euclid; mezzanine
 *   19.6-25 m, base cornice 25-26.3 m; shaft storeys 3.39 m in three-storey
 *   panel groups; string course 67-68 m; attic windows 68.5-76 m; cornice
 *   77-78.8 m, parapet to 79.3 m; window rhythm 2.8 m, drawn as one panel per pair of windows (5.6 m bays).
 * Colours: the limestone is a warm light grey in sunlit photos (~#c4bfb2),
 *   pulled to the palette's lightness; the rear brick grey-brown (#8b827b),
 *   pulled lighter.
 * Left out: the Ionic capitals' volutes, the dentils, the lettering, the
 *   entrance canopies, the antenna.
 * Doubts: the east face and the courts are brick from one photo of the
 *   rear; the south face of the east part (over an open lot) is assumed
 *   stone at the base and brick above. The attic and penthouse levels are
 *   lidar only (no photo shows the roof). The lidar shows a lower strip
 *   (18-33 m) along the far east face that is drawn at full height.
 *   The 35 m buildings in the Euclid wedge south-east (way/333475713 and
 *   beyond) are separate and not part of the model.
 * Night: the office windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, walls, cap, cornice, column, save } from './chi-field-museum'
import { panels, wallQuad, type Grid } from './cle-200-public-square'

const Z = { colTop: 19.6, mezz: 25.0, base: 26.3, string0: 67.0, string1: 68.0, corn0: 77.0, corn: 78.8, roof: 79.3 }

// Outer ring, counter-clockwise (way/189749442 in this frame)
const S1: XY = [-5.5, -59.8], S2: XY = [14.2, -14.8], S3: XY = [13.9, -3.4], S4: XY = [68.5, -2.7]
const N1: XY = [68.1, 37.5], N2: XY = [-47.9, 35.7], W1: XY = [-48.2, -42.1]
const OUT: XY[] = [S1, S2, S3, S4, N1, N2, W1]

// The light courts (lidar edges)
const WC = { x0: -31, x1: -19.5, y0: -31, y1: 19 }
const EC = { x0: 0.5, x1: 45.5, y0: 6, y1: 20 }
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// lines for the roof pieces
const euclidY = (x: number) => -42.1 - (17.7 / 42.7) * (x + 48.2)
const northY = (x: number) => 35.7 + (1.8 / 116) * (x + 47.9)
const southY = (x: number) => -3.4 + (0.7 / 54.6) * (x - 13.9)

const shaft: Grid = { bay: 3.0, pier: 2.6, group: 3 * 3.39, spandrel: 2.0, from: Z.base, edge: 1.6, head: 0, foot: 0.7 }
const attic: Grid = { bay: 3.0, pier: 2.6, group: 8.5, spandrel: 0, from: Z.string1, edge: 1.8, head: 0.8, foot: 0.5 }
const court: Grid = { bay: 3.0, pier: 2.6, group: 3 * 3.39, spandrel: 1.5, from: Z.base, edge: 1.4, head: 0, foot: 0.7 }

function build() {
  const stone = new Part(), trim = new Part(), brick = new Part(), win = new Part(), roof = new Part()

  const onEdge = (a: XY, b: XY) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, d: number): XY => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d]
    return { L, u, n, P }
  }

  /** The giant colonnade on wall a→b between corner piers pA and pB: columns before recessed glazing. */
  const colonnade = (a: XY, b: XY, pA: number, pB: number, count: number) => {
    const { L, P } = onEdge(a, b), d = 2.2, r = 0.95
    wallQuad(stone, a, P(pA, 0), 0, Z.colTop)
    wallQuad(stone, P(L - pB, 0), b, 0, Z.colTop)
    // pier returns, facing into the colonnade
    wallQuad(stone, P(pA, 0), P(pA, -d), 0, Z.colTop)
    wallQuad(stone, P(L - pB, -d), P(L - pB, 0), 0, Z.colTop)
    // the recessed wall and its glazing
    const r0 = P(pA, -d), r1 = P(L - pB, -d)
    wallQuad(stone, r0, r1, 0, Z.colTop)
    const sp = (L - pA - pB) / (count + 1)
    for (let k = 0; k <= count; k++) {
      const s0 = k * sp + (k ? r + 0.12 : 0.5), s1 = (k + 1) * sp - (k < count ? r + 0.12 : 0.5)
      const A = (s: number, z: number): V3 => { const p = P(pA + s, -d + 0.06); return [p[0], p[1], z] }
      for (const [z0, z1] of [[0.5, 9.3], [9.9, 19.2]]) win.quad(A(s0, z0), A(s1, z0), A(s1, z1), A(s0, z1))
    }
    // the soffit over the colonnade
    {
      const f0 = P(pA, 0), f1 = P(L - pB, 0)
      stone.quad([f0[0], f0[1], Z.colTop], [r0[0], r0[1], Z.colTop], [r1[0], r1[1], Z.colTop], [f1[0], f1[1], Z.colTop])
    }
    // the columns
    for (let k = 1; k <= count; k++) {
      const c = P(pA + k * sp, -d / 2)
      column(trim, trim, c[0], c[1], 0, Z.colTop, r, 8)
    }
  }

  // ------------------------------------------------------------ outer walls
  type Face = { a: XY; b: XY; kind: 'street' | 'colonnade' | 'brick' | 'lot'; cols?: [number, number, number]; from?: number }
  const faces: Face[] = [
    { a: S1, b: S2, kind: 'brick', from: 33.5 }, // over the 35 m neighbour
    { a: S2, b: S3, kind: 'brick', from: 33.5 },
    { a: S3, b: S4, kind: 'lot' },
    { a: S4, b: N1, kind: 'brick' },
    { a: N1, b: N2, kind: 'street' },
    { a: N2, b: W1, kind: 'colonnade', cols: [6, 4.5, 13] }, // East 9th
    { a: W1, b: S1, kind: 'colonnade', cols: [4.5, 6, 7] }, // Euclid
  ]
  for (const f of faces) {
    const isStone = f.kind === 'street' || f.kind === 'colonnade'
    const upper = isStone ? stone : brick
    if (f.kind === 'colonnade') {
      colonnade(f.a, f.b, f.cols![0], f.cols![1], f.cols![2])
      wallQuad(stone, f.a, f.b, Z.colTop, Z.base)
    } else {
      wallQuad(f.kind === 'lot' || f.kind === 'street' ? stone : brick, f.a, f.b, 0, Z.base)
    }
    wallQuad(upper, f.a, f.b, Z.base, Z.roof)
    // windows
    if (isStone) {
      panels(win, f.a, f.b, Z.colTop, Z.mezz, { ...shaft, group: 20, from: Z.colTop, foot: 1.6, head: 0.6 })
      panels(win, f.a, f.b, Z.base, Z.string0, shaft)
      panels(win, f.a, f.b, Z.string1, Z.corn0, attic)
      if (f.kind === 'street') panels(win, f.a, f.b, 0, Z.colTop, { ...shaft, bay: 2.4, pier: 2.0, group: 9.8, from: 0, foot: 1.2, edge: 3 })
    } else {
      if (f.kind === 'lot' || (f.kind === 'brick' && f.from === undefined)) panels(win, f.a, f.b, 0, Z.colTop, { ...shaft, bay: 2.4, pier: 2.0, group: 9.8, from: 0, foot: 1.2, edge: 3 })
      panels(win, f.a, f.b, f.from ?? Z.base, Z.corn0, { ...court, group: 3 * 3.39, from: Z.base })
    }
  }
  // bands round the whole block: the base cornice, the string course, the main cornice
  cornice(trim, OUT, Z.mezz, Z.base, 0.8)
  cornice(trim, OUT, Z.string0, Z.string1, 0.3)
  cornice(trim, OUT, Z.corn0, Z.corn, 1.3)

  // ------------------------------------------------------------ the light courts
  for (const c of [WC, EC]) {
    const ring = rect(c.x0, c.y0, c.x1, c.y1).reverse() // walls face into the court
    walls(brick, ring, Z.base, Z.roof)
    for (let i = 0; i < 4; i++) panels(win, ring[i], ring[(i + 1) % 4], Z.base, Z.corn0, court)
    cap(roof, rect(c.x0, c.y0, c.x1, c.y1), Z.base)
  }

  // ------------------------------------------------------------ the main roof, in pieces round the courts
  const pieces: XY[][] = [
    [W1, [WC.x0, euclidY(WC.x0)], [WC.x0, northY(WC.x0)], N2],
    [[WC.x0, euclidY(WC.x0)], [WC.x1, euclidY(WC.x1)], [WC.x1, WC.y0], [WC.x0, WC.y0]],
    [[WC.x0, WC.y1], [WC.x1, WC.y1], [WC.x1, northY(WC.x1)], [WC.x0, northY(WC.x0)]],
    [[WC.x1, euclidY(WC.x1)], S1, [EC.x0, -59.8 + 45 * ((EC.x0 + 5.5) / 19.7)], [EC.x0, northY(EC.x0)], [WC.x1, northY(WC.x1)]],
    [[EC.x0, -59.8 + 45 * ((EC.x0 + 5.5) / 19.7)], S2, S3, [EC.x1, southY(EC.x1)], [EC.x1, EC.y0], [EC.x0, EC.y0]],
    [[EC.x0, EC.y1], [EC.x1, EC.y1], [EC.x1, northY(EC.x1)], [EC.x0, northY(EC.x0)]],
    [[EC.x1, southY(EC.x1)], S4, N1, [EC.x1, northY(EC.x1)]],
  ]
  for (const p of pieces) cap(roof, p, Z.roof)

  // ------------------------------------------------------------ attic storeys and penthouses, set back (lidar)
  const raised = (ring: XY[], top: number) => {
    walls(brick, ring, Z.roof, top)
    cap(roof, ring, top)
  }
  raised(rect(-46, -32, WC.x0, 20), 82.1) // west wing
  raised(rect(-35, 20, 37, 34), 84.4) // north wing
  raised(rect(WC.x1, -9, EC.x0, 20), 82.1) // centre
  raised(rect(EC.x0, -2.2, 44, EC.y0), 82.1) // the bar south of the east court
  raised(rect(50, 22, 62, 30), 83.6) // north-east penthouse
  raised([[-27, -37.5], [-16, -49.5], [-3.8, -54.0], [12.4, -9], [WC.x1, -9], [WC.x1, WC.y0], [-27, WC.y0]], 88.5) // penthouse band

  return [
    { part: stone, material: finish('cle-union-trust-limestone', 0xd6d0c3) },
    { part: trim, material: finish('cle-union-trust-trim', 0xe4dfd3) },
    { part: brick, material: finish('cle-union-trust-brick', 0xa59b90) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('cle-huntington-bank-building', 'Huntington Bank Building', [41.5009482, -81.6864767], 326.5, build(), 6500)
