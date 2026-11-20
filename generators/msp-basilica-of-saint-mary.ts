/**
 * Basilica of Saint Mary (1907-1914, Emmanuel Masqueray), Minneapolis:
 * procedural, CC0-1.0.
 * bun generators/msp-basilica-of-saint-mary.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's walls run within
 * 0.3 deg of north-south). Origin at the area centroid of OSM way/39422725
 * (-93.286272, 44.973102). The church is symmetric about x = 0 (OSM's sides
 * at -18.5 and +18.6, the dome's axis at x = 0 in lidar). y = 0 is the grade
 * at the front (lidar 256.0 m), the lowest ground under the footprint; the
 * site rises about 4.5 m to the apse, where the walls sink into the ground.
 *
 * Form: a white granite Beaux-Arts church facing south. A low outer storey
 * (balustraded, small windows) wraps the tall nave, whose walls carry big
 * round-headed windows under a cornice and a low grey roof; the choir runs
 * on north of the crossing to a half-octagon apse. The front: twin square
 * towers with a tall open arched belfry, cornice, stepped crown with corner
 * urns and a small finial; between them the centre bay with the great rose
 * window in an arched surround, under a pediment with a cross; a portico of
 * six columns before three arched doors, with statue plinths on its
 * balustrade, up a flight of steps the width of the front; small domed side
 * porches beside the towers. Over the crossing a square drum with chamfered
 * corners and paired arched windows, a balustrade with urns, the steep dark
 * ribbed dome, and a tall dark lantern with a bell cap, ball and cross.
 *
 * Sources
 * - OSM (ODbL): way/39422725 (building=basilica, "Basilica of Saint Mary"),
 *   building:part way/355582735 (the dome's square), way/355582736 and
 *   way/355582737 (the two tower crowns, pyramidal). No heights tagged.
 * - USGS 3DEP lidar MN_CentralMissRiver_4_B22 (flown 2022; read keeping
 *   class 18, which holds the upper dome in this flight), 1 m grid, heights
 *   above the front grade: outer storey 11; nave eaves 25, ridge 30; front
 *   pediment 31-34; towers' body 36, belfry cornice 38-40, crowns to 42;
 *   portico top 11-14, reaching 5 m in front of OSM's wall; apse 21-24;
 *   drum and its urns 40-45 out to r 9; dome 52 at r 7, 56 at r 5, 58 at
 *   r 3; lantern 60-66; the cross 73 (one cell; thin, may under-read).
 * - USGS NAIP (public domain): plan, the low grey nave roof, the square drum.
 * - Photos (Wikimedia Commons, evidence):
 *   Carol M. Highsmith, "Basilica of Saint Mary, Loring Park, Minneapolis,
 *     Minnesota" (LCCN2011630777), public domain (from the south-west: the
 *     front, towers, portico, rose, side elevation, side porch dome);
 *   Bobak Ha'Eri, "2008-0705-BasilicaStMary.jpg", CC BY 3.0 (from the
 *     south-west, raised: dome, drum, tower crowns, pediment);
 *   Tony Webster, "The Basilica of Saint Mary, Minneapolis (23507228666).jpg",
 *     CC BY-SA 2.0 (aerial from the south: the drum, dome and lantern);
 *   Alex Begin, "Basilica of Saint Mary (Minneapolis).jpg", CC BY-SA 2.0
 *     (from the south-east);
 *   w_lemay, "Basilica of Saint Mary from Harmon Place, Loring Park,
 *     Minneapolis, MN", CC BY-SA 2.0 (from the east: the dome over the
 *     side); w_lemay, "Basilica of Saint Mary, Hennepin Avenue and 17th
 *     Street ...", CC BY-SA 2.0;
 *   Greg Gjerdingen, "Basilica of Saint Mary from I-94 in Minneapolis
 *     (25771397495).jpg", CC BY 2.0 (front from the south-east).
 * - Published: Emmanuel Louis Masqueray, built 1907-1914, white granite,
 *   first basilica in the United States (Wikipedia, "Basilica of Saint Mary
 *   (Minneapolis)"; NRHP 1975).
 * Measured (lidar): every height above, the dome profile, the tower and drum
 *   plans, the portico's depth.
 * Estimated from the photos: window sizes and bay spacing (five big windows
 *   per side of the nave, two in the choir), the belfry openings, the rose's
 *   size (6.4 m glass in an 8.8 m frame) and height, the portico's columns
 *   and arches, the steps (three treads standing for the flight, to 2.4 m),
 *   the side porches (only the west one is photographed; mirrored), the
 *   drum's windows, eight dome ribs.
 * Left out: statues, urns other than the drum's and towers', the dome's
 *   lucarnes, capitals, balusters, lamp posts.
 * Doubts: the rear (choir, apse) is seen only from far off and in lidar; the
 *   dome is dark weathered copper, drawn charcoal grey-blue as it reads in
 *   the photos; the east side porch is assumed to mirror the west one.
 * Night: the granite is floodlit (`floodlight`), the dome and towers more
 *   than the walls below; windows are `window`, the doors `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, prism, rect, chamfer, flatShape, extrudeShape, archShape, lathe, arc, capRing, onFace, finishGlb, writeModel } from './sea-tacoma-union-station'

// ---------------------------------------------------------------- dimensions (m, above the front grade, lidar 256.0)
const FY = -35.7 // the front wall (south)
const AISLE_X = 18.5, AISLE_Z = 11, AISLE_Y1 = 14.8 // the low outer storey
const NAVE_X = 15, NAVE_Z = 25, RIDGE = 30, CHOIR_Y1 = 36.6
const DOME_Y = 23.2 // the dome's axis (x = 0)
const TW_X0 = 7.3, TW_X1 = 15.0, TW_Y1 = -27.6 // towers: x from TW_X0 to TW_X1 (mirrored), y from FY to TW_Y1
const CORNICE = 27, BELL0 = 29.5, BELL1 = 36, TOWER_TOP = 37.6
const PORT_X = 8.5, PORT_Y0 = -41, PORT_Z = 12.4 // the entrance portico
const FLOOR = 2.4 // the portico's floor, up the front steps

const mirror = (f: (s: 1 | -1) => void) => { f(1); f(-1) }

export function build() {
  const granite = new Part(), trim = new Part(), dark = new Part(), roof = new Part(), win = new Part(), door = new Part()

  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = p, c = 0) => {
    const r = rect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1))
    prism(p, top, c > 0 ? chamfer(r, c) : r, z0, z1)
  }
  /** A gable roof, ridge along y, with gable ends in `end`. */
  const gable = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, end: Part) => {
    const xm = (x0 + x1) / 2
    roof.quad([x1, y0, z0], [x1, y1, z0], [xm, y1, z1], [xm, y0, z1])
    roof.quad([x0, y1, z0], [x0, y0, z0], [xm, y0, z1], [xm, y1, z1])
    end.tri([x0, y0, z0], [x1, y0, z0], [xm, y0, z1])
    end.tri([x1, y1, z0], [x0, y1, z0], [xm, y1, z1])
  }
  const S: Face = { o: [0, FY, 0], n: [0, -1] } // the front
  const sideFace = (s: 1 | -1, x: number): Face => ({ o: [s * x, 0, 0], n: [s, 0] })
  /** A round-headed window with a pale surround. */
  const archWin = (f: Face, sc: number, w: number, z0: number, zs: number, d = 0.06, sur = 0.35) => {
    if (sur > 0) extrudeShape(trim, f, archShape(sc, w + 2 * sur, z0 - sur, zs, 10), 0, d)
    flatShape(win, f, archShape(sc, w, z0, zs, 10), d + 0.03)
  }

  // ---- the body: low outer storey, the tall nave and choir, the apse
  box(granite, -AISLE_X, FY, AISLE_X, AISLE_Y1, 0, AISLE_Z, roof)
  box(trim, -AISLE_X - 0.3, FY - 0.1, AISLE_X + 0.3, AISLE_Y1 + 0.3, AISLE_Z, AISLE_Z + 0.8, roof) // balustrade
  box(granite, -NAVE_X, FY, NAVE_X, CHOIR_Y1, 0, NAVE_Z, null)
  box(trim, -NAVE_X - 0.4, FY, NAVE_X + 0.4, CHOIR_Y1 + 0.4, NAVE_Z - 0.9, NAVE_Z + 0.2, null) // cornice
  gable(-NAVE_X - 0.4, NAVE_X + 0.4, FY + 0.5, CHOIR_Y1 + 0.4, NAVE_Z + 0.2, RIDGE, granite)
  // the apse: half an octagon behind the choir
  const apse: XY[] = ([[-7.5, CHOIR_Y1 - 1], [7.5, CHOIR_Y1 - 1], ...arc(0, CHOIR_Y1 - 1, 7.5, 0, 180, 4).slice(1, -1).map(([x, y]) => [x, CHOIR_Y1 - 1 + (y - (CHOIR_Y1 - 1)) * 0.85] as XY)] as XY[]).reverse()
  const apseR: XY[] = [[7.5, CHOIR_Y1 - 1], ...arc(0, CHOIR_Y1 - 1, 7.5, 0, 180, 4).slice(1, -1).map(([x, y]) => [x, CHOIR_Y1 - 1 + (y - (CHOIR_Y1 - 1)) * 0.85] as XY), [-7.5, CHOIR_Y1 - 1]]
  prism(granite, null, apseR, 0, 21)
  prism(trim, null, apseR.map(([x, y]) => [x * 1.04, CHOIR_Y1 - 1 + (y - CHOIR_Y1 + 1) * 1.04] as XY), 20.2, 21.2)
  // its roof: a low half-cone
  for (let i = 0; i < apseR.length - 1; i++) {
    const a = apseR[i], b = apseR[i + 1]
    roof.tri([a[0] * 1.04, CHOIR_Y1 - 1 + (a[1] - CHOIR_Y1 + 1) * 1.04, 21.2], [b[0] * 1.04, CHOIR_Y1 - 1 + (b[1] - CHOIR_Y1 + 1) * 1.04, 21.2], [0, CHOIR_Y1 - 1, 24.5])
  }
  void apse
  // apse windows
  for (let i = 0; i < apseR.length - 1; i++) {
    const a = apseR[i], b = apseR[i + 1], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    if (n[1] < 0.2) continue
    archWin({ o: [m[0], m[1], 0], n }, 0, 1.8, 11, 16.5)
  }

  // ---- side elevations: big round-headed windows above, smaller below
  mirror((s) => {
    const up = sideFace(s, NAVE_X), lo = sideFace(s, AISLE_X)
    for (const y of [-21.5, -14.5, -7.5, -0.5, 6.5]) {
      archWin(up, -s * y, 3.0, 14, 20.5)
      flatShape(win, lo, rect(-s * y - 1.1, 3.2, -s * y + 1.1, 8.2), 0.06)
    }
    for (const y of [20, 30]) archWin(up, -s * y, 2.6, 8, 17)
  })

  // ---- the front: towers, centre bay with the rose, pediment
  mirror((s) => {
    const x0 = s * TW_X0, x1 = s * TW_X1
    box(granite, x0, FY - 0.6, x1, TW_Y1, 0, CORNICE, null, 0.3)
    box(trim, x0 + s * -0.3, FY - 1.0, x1 + s * 0.4, TW_Y1 + 0.4, CORNICE - 1.2, CORNICE, trim, 0.2)
    // belfry stage
    box(granite, x0 + s * 0.35, FY - 0.25, x1 - s * 0.35, TW_Y1 - 0.35, CORNICE, TOWER_TOP - 1, null, 0.3)
    box(trim, x0, FY - 0.6, x1, TW_Y1, TOWER_TOP - 1, TOWER_TOP, trim, 0.2)
    // crown: a stepped attic, corner urns, a small lantern and finial
    const cx = s * (TW_X0 + TW_X1) / 2, cy = (FY + TW_Y1) / 2 - 0.3
    box(granite, cx - 2.6, cy - 3.6, cx + 2.6, cy + 3.6, TOWER_TOP, TOWER_TOP + 1.4, trim, 0.2)
    for (const dx of [-2.9, 2.9]) for (const dy of [-3.9, 3.9]) lathe(trim, cx + dx, cy + dy, [[0.45, TOWER_TOP], [0.5, TOWER_TOP + 0.9], [0.3, TOWER_TOP + 1.6], [0, TOWER_TOP + 1.9]], 6)
    lathe(granite, cx, cy, [[1.5, TOWER_TOP + 1.4], [1.5, TOWER_TOP + 2.6], [1.1, TOWER_TOP + 3.2], [0.4, TOWER_TOP + 3.6], [0.25, TOWER_TOP + 4.6], [0, TOWER_TOP + 4.9]], 8)
    // belfry openings: one tall arch on each outer face
    const tw = TW_X1 - TW_X0 - 0.7
    const faces: { f: Face; c: number; w: number }[] = [
      { f: { o: [0, FY - 0.25, 0], n: [0, -1] }, c: cx, w: tw },
      { f: { o: [s * (TW_X1 - 0.35), 0, 0], n: [s, 0] }, c: -s * cy, w: TW_Y1 - FY - 0.6 },
      { f: { o: [0, TW_Y1 - 0.35, 0], n: [0, 1] }, c: -cx, w: tw },
    ]
    for (const { f, c } of faces) {
      extrudeShape(trim, f, archShape(c, 3.2, BELL0 - 0.35, BELL1 - 2.2, 10), 0, 0.06)
      flatShape(dark, f, archShape(c, 2.5, BELL0, BELL1 - 2.2, 10), 0.1)
    }
    void faces[0].w
    // tower windows on the front and the outer side
    archWin(S, cx, 2.0, 14.5, 21)
    flatShape(win, S, rect(cx - 1.0, 4, cx + 1.0, 8.5), 0.66)
    archWin({ o: [s * TW_X1, 0, 0], n: [s, 0] }, -s * cy, 2.0, 14.5, 21)
    // small domed side porch at the outer storey, beside the tower
    const px = s * (AISLE_X + 1.6)
    box(granite, s * AISLE_X, -32.5, px, -26.5, 0, 6.6, trim)
    lathe(dark, px - s * 0.2, -29.5, [[2.6, 6.6], [2.4, 7.6], [1.6, 8.6], [0, 9.1]], 10, s > 0 ? -90 : 90, s > 0 ? 90 : 270)
    flatShape(door, { o: [px, 0, 0], n: [s, 0] }, archShape(s * 29.5, 1.8, 0, 3.4, 8), 0.06)
  })
  // the centre bay between the towers: cornice, pediment, rose window
  box(trim, -TW_X0, FY - 0.6, TW_X0, FY + 1, CORNICE - 1.2, CORNICE, trim)
  const pedZ = 33.8
  const ped: XY[] = [[-TW_X0, CORNICE], [TW_X0, CORNICE], [0, pedZ]]
  extrudeShape(granite, { o: [0, FY + 1, 0], n: [0, -1] }, ped, -1.0, 1.6)
  box(granite, -1.2, FY - 1, 1.2, FY + 0.6, pedZ - 1, pedZ + 1.4, trim) // the cross's plinth
  box(trim, -0.15, FY - 0.4, 0.15, FY + 0.1, pedZ + 1.4, pedZ + 3.4, null)
  box(trim, -0.8, FY - 0.4, 0.8, FY + 0.1, pedZ + 2.6, pedZ + 2.9, null)
  // the rose: a round frame in an arched surround, the window, a few spokes
  const RZ = 18.6
  extrudeShape(trim, S, archShape(0, 10.4, 12.6, RZ, 12), 0, 0.12)
  extrudeShape(granite, S, arc(0, RZ, 4.4, 0, 360, 16).slice(0, -1), 0.12, 0.45)
  flatShape(win, S, arc(0, RZ, 3.2, 0, 360, 16).slice(0, -1), 0.5)
  extrudeShape(trim, S, arc(0, RZ, 0.9, 0, 360, 10).slice(0, -1), 0.5, 0.62)
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4, c = Math.cos(a), sn = Math.sin(a), w = 0.12
    extrudeShape(trim, S, [[0.9 * c - w * sn, RZ + 0.9 * sn + w * c], [3.2 * c - w * sn, RZ + 3.2 * sn + w * c], [3.2 * c + w * sn, RZ + 3.2 * sn - w * c], [0.9 * c + w * sn, RZ + 0.9 * sn - w * c]], 0.5, 0.58, false)
  }

  // ---- the portico: three arches behind six columns, flat top with balustrade
  box(granite, -PORT_X, PORT_Y0, PORT_X, FY + 0.5, 0, FLOOR, granite)
  box(granite, -PORT_X, PORT_Y0 + 1.6, PORT_X, FY + 0.5, FLOOR, PORT_Z - 2, null) // the back wall behind the arcade
  const P: Face = { o: [0, PORT_Y0 + 1.6, 0], n: [0, -1] }
  for (const c of [-4.3, 0, 4.3]) {
    flatShape(dark, P, archShape(c, 3.0, FLOOR, FLOOR + 5.2, 10), 0.04)
    flatShape(door, P, rect(c - 1.0, FLOOR, c + 1.0, FLOOR + 3.6), 0.08)
  }
  box(trim, -PORT_X - 0.3, PORT_Y0 - 0.3, PORT_X + 0.3, FY + 0.5, PORT_Z - 2, PORT_Z - 0.6, trim) // entablature
  box(granite, -PORT_X, PORT_Y0, PORT_X, FY + 0.5, PORT_Z - 0.6, PORT_Z, trim) // balustrade
  for (const x of [-7.5, -6.3, -2.15, 2.15, 6.3, 7.5]) lathe(trim, x, PORT_Y0 + 0.6, [[0.42, FLOOR], [0.38, PORT_Z - 2]], 8)
  for (const x of [-7.5, 7.5]) box(trim, x - 0.8, PORT_Y0 - 0.1, x + 0.8, PORT_Y0 + 1.3, PORT_Z, PORT_Z + 1.6, trim) // statue plinths
  // front steps, the full width of the front
  for (const [y0, z] of [[-45.4, 0.8], [-44, 1.6], [-42.6, 2.4]] as [number, number][]) box(granite, -12.5, y0, 12.5, PORT_Y0, 0, z, roof)

  // ---- the crossing: drum, balustrade and corner urns, the dark ribbed dome, lantern
  const drum = chamfer(rect(-8.8, DOME_Y - 8.8, 8.8, DOME_Y + 8.8), 3.0)
  prism(granite, roof, drum, NAVE_Z, 42)
  prism(trim, trim, chamfer(rect(-9.2, DOME_Y - 9.2, 9.2, DOME_Y + 9.2), 3.1), 41.2, 42.4)
  prism(granite, null, chamfer(rect(-8.4, DOME_Y - 8.4, 8.4, DOME_Y + 8.4), 2.9), 42.4, 43.6)
  for (const [dx, dy] of [[-6.6, -6.6], [6.6, -6.6], [-6.6, 6.6], [6.6, 6.6], [0, -8.4], [0, 8.4], [-8.4, 0], [8.4, 0]])
    lathe(trim, dx, DOME_Y + dy, [[0.55, 43.6], [0.6, 44.4], [0.35, 45.2], [0, 45.5]], 6)
  // drum windows: two arched lights on each straight face
  for (const [n, o] of [[[0, -1], [0, DOME_Y - 8.8, 0]], [[0, 1], [0, DOME_Y + 8.8, 0]], [[-1, 0], [-8.8, DOME_Y, 0]], [[1, 0], [8.8, DOME_Y, 0]]] as [XY, V3][]) {
    const f: Face = { o, n }
    for (const c of [-1.7, 1.7]) archWin(f, c, 1.9, 31, 37.5, 0.06, 0.3)
  }
  // dome: steep-sided, a little taller than a hemisphere (lidar profile)
  const prof: [number, number][] = [[7.7, 43.6], [7.6, 46.5], [7.3, 49.5], [6.7, 52], [5.7, 54.3], [4.4, 56.2], [2.8, 57.7], [1.7, 58.3]]
  lathe(dark, 0, DOME_Y, prof, 16)
  // ribs: eight pale bands
  for (let k = 0; k < 8; k++) {
    const a = (k * 45 * Math.PI) / 180
    for (let i = 0; i < prof.length - 1; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1], w = 0.28
      const P0 = (r: number, z: number, side: number, out: number): V3 => [(r + out) * Math.cos(a) - side * w * Math.sin(a), DOME_Y + (r + out) * Math.sin(a) + side * w * Math.cos(a), z + out * 0.3]
      trim.quad(P0(r0, z0, -1, 0.12), P0(r0, z0, 1, 0.12), P0(r1, z1, 1, 0.12), P0(r1, z1, -1, 0.12))
    }
  }
  // lantern: open arcade (dark), a bell-shaped cap, ball and cross
  lathe(dark, 0, DOME_Y, [[1.9, 58.2], [1.9, 58.8], [1.6, 58.8], [1.6, 63.2], [2.0, 63.2], [2.0, 63.8], [1.5, 64.6], [0.9, 66.2], [0.45, 67.2], [0.6, 67.8], [0.35, 68.4], [0, 68.6]], 10)
  box(dark, -0.15, DOME_Y - 0.15, 0.15, DOME_Y + 0.15, 68.4, 72.6, null)
  box(dark, -1.0, DOME_Y - 0.15, 1.0, DOME_Y + 0.15, 70.9, 71.3, null)

  // Night: the basilica is floodlit, the dome and towers brightest.
  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.25 : p[2] > 24 ? 0.85 : 0.6)
  return finishGlb('msp-basilica-of-saint-mary', [
    { part: granite, material: { ...finish('basilica-granite', 0xe9e6df), floodlight: lit } as Swatch },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } as Swatch },
    { part: dark, material: { ...finish('basilica-dome', 0x59616b, 0.6), floodlight: (p: V3) => (p[2] > 40 ? 0.6 : 0) } as Swatch },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: { ...PALETTE.entrance, color: 0x8a6a4a } },
  ], { name: 'Basilica of Saint Mary' }, 6500)
}

if (import.meta.main) await writeModel('msp-basilica-of-saint-mary', build())
