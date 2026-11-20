/**
 * Cleveland Museum of Art, 11150 East Boulevard, Wade Park, University
 * Circle, Cleveland: procedural, CC0-1.0. The whole museum as OSM maps it:
 * the 1916 white-marble building (Hubbell and Benes), the 1958 and 1971
 * (Marcel Breuer) wings to the north and north-west, and Rafael Viñoly's
 * 2009-2013 east and west wings and glass-roofed Ames Family Atrium.
 * bun generators/cle-museum-of-art.ts [out.glb]
 *
 * Frame: x, y, z metres, turned to bearing 352.5 (+y north to the north
 * entrance and garage, -y south to the 1916 front and Wade Lagoon), origin
 * at the OSM outline's area centroid (-81.6118035, 41.5090292). z = 0 is
 * the lowest ground under the footprint, on the west side above the Doan
 * Brook valley (lidar 6.5 m over the box's lowest return); East Boulevard
 * and the north drive are 7.0 m up, the 1916 south terrace 8.7. elevation 0.
 *
 * Form: the white-marble 1916 block with its tetrastyle Ionic portico in
 * antis before a shaded porch, end bays with two columns in antis, the
 * pediment, a plain attic and a glass hip roof with a cross gable
 * on the axis; behind it the Ames Family Atrium, a curved glass roof falling
 * north between Viñoly's grey east and west wings (low glazed pavilions at
 * their south ends, the west wing's angled west wall, the east wing's
 * stepped edge); north of the atrium the pale 1958 band with its four
 * service towers; the north blocks round the north entrance and its
 * concrete canopy on posts; Breuer's 1971 wing with its curved wall to the
 * north-west.
 *
 * Sources
 * - OSM (ODbL): outline way/109114109 (Cleveland Museum of Art, wikidata
 *   Q130255573, which Wikidata gives as "Cleveland Museum of Art building";
 *   the institution is Q657415), with its parts way/420174175 (the 1916
 *   building) and way/420173649 (the atrium, glass roof), and the north
 *   entrance canopy way/349671512 (building=roof), all replaced. The
 *   parking garage way/202861542 is separate and left to the map.
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 1 m grid read in this frame. Above z = 0: 1916 cornice
 *   and attic 21.6-23.1, glass hip ridge 26.7, axis gable 27.4; atrium roof
 *   27.3 at the south edge to 24.5 at the north; wings 19.3, their south
 *   pavilions and the east steps 11.8; the 1958 band 28.9, its towers 36.1;
 *   north blocks 23.5 (west), 19.5 (centre), 19.3 (east), 13 (far east);
 *   Breuer wing 11.8; penthouses 22.5-23.4.
 * - USGS NAIP (public domain): plan, roof colours, the glass roofs.
 * - Published: 1916 building by Hubbell and Benes; 1971 Breuer wing;
 *   Rafael Viñoly's renovation and expansion, 2005-2013, with the atrium
 *   (Wikipedia, "Cleveland Museum of Art").
 * - Photos (EVIDENCE):
 *   - "Cleveland Museum of Art aerial.jpg", Percival Kestreltail, CC BY-SA
 *     4.0, https://commons.wikimedia.org/wiki/File:Cleveland_Museum_of_Art_aerial.jpg
 *     (from the south, above: every roof, the portico, the wings)
 *   - "Cleveland Museum of Art.jpg", "Cleveland Museum of Art 01.jpg",
 *     "Cleveland Museum of Art 2013.jpg", "Cleveland Museum of Art south
 *     entrance 2012.jpg", "Cleveland Museum of Art and Wade Park Lagoon
 *     (8114544737).jpg", Erik Drost, CC BY 2.0, e.g.
 *     https://commons.wikimedia.org/wiki/File:Cleveland_Museum_of_Art_south_entrance_2012.jpg
 *     (the south front, portico columns, the doors)
 *   - "Cleveland Museum of Art north entrance.jpg", edwardhblake, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Cleveland_Museum_of_Art_north_entrance.jpg
 *   - "Cleveland Museum of Art Breuer Entrance.jpg", Heidi Strean, CC BY
 *     2.0, https://commons.wikimedia.org/wiki/File:Cleveland_Museum_of_Art_Breuer_Entrance.jpg
 *     (the canopy and the banded grey wings)
 *   - "Cleveland Museum of Art - Cleveland, OH.jpg", Upstateherd, CC BY-SA
 *     4.0, https://commons.wikimedia.org/wiki/File:Cleveland_Museum_of_Art_-_Cleveland,_OH.jpg
 * The 1916 front (rebuilt after review: its columns did not read). The
 *   portico pavilion is 17.2 m wide on the axis x = 11 (lidar ridge at x
 *   11-12), 3 m proud of the wings; its porch floor 11.4 and pediment
 *   ridge 26.4 (lidar, drawn 26.8 to the raking cornice) and its eaves
 *   23.9 (drawn 23.7) are lidar. Between them, scaled from Erik Drost's
 *   head-on photos (m3, m4): four free-standing Ionic columns (14 sides,
 *   r 0.62) 11.4-19.2 at x = TC +-1.55, +-4.7, in antis between 2.2 m antae;
 *   entablature to the wing cornice 21.6; the pavilion's attic to 23.7. The
 *   porch is 4 m deep (cut into the block to 2 m behind the wing face), its
 *   walls and ceiling in a shaded-marble finish, with three glazed bronze
 *   doors (window). The end bays (12 m, from the aerial m2 and m4): two
 *   Ionic columns in antis (r 0.45, 10.6-17.6) in a 6.4 m x 1.4 m shaded
 *   recess under a plain frieze, and pilaster strips at the bays' edges.
 *   The wings between are plain ashlar in every photo, so they stay plain.
 * Estimated from the photos: the steps, the basement window row, the wings' glass bands and
 *   pavilion glazing, the canopy height (6.2 m over the drive) and posts.
 * Left out: the banding of the granite walls (drawn plain grey), the
 *   banners, the great stairs and terraces down to the lagoon (paving, the
 *   map's), the sloped lawn over the west wing's lower floor (OSM's
 *   diagonal west lobe is ground in the lidar), rooftop plant.
 * Doubts: the north and north-west blocks are drawn from lidar and the
 *   aerial; their facades are not photographed here.
 * Night: windows and the porch doors (window material) glow; the 1916
 *   front and its shaded porch are floodlit; the glass roofs stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, cap, block, cornice, panel, column, gableY, rakingCornice } from './chi-field-museum'
import { parapet } from './cle-city-hall'
import { type Block, buildBlocks, wallQuad, writeModel } from './cle-200-public-square'
import { ccw, finishGlb } from './sea-columbia-center'

// Levels above the lowest ground under the footprint (the west side, lidar
// 6.5 m over the box's lowest return).
const STREET = 7.0 // East Boulevard and the north drive
const TERRACE = 8.7 // the 1916 building's south terrace, top of the great stairs

function build() {
  const marble = new Part(), granite = new Part(), win = new Part(), glass = new Part(), roof = new Part(), shade = new Part()

  // ---- the 1916 building: a marble block, its portico pavilion and glass hip roof
  const T0 = -34.0, T1 = 55.6, TC = 11.0 // ends and axis (lidar: the pediment ridge at x 11-12, the ends -34.5 and 56.5)
  const TY0 = -65.8, TY1 = -31.7, CORN = 21.6, ATT = 23.1
  const TEMPLE = rect(T0, TY0, T1, TY1)
  // The portico's porch and the end bays' recesses are cut into the front wall.
  const PI0 = TC - 6.4, PI1 = TC + 6.4, YR = TY0 + 2.0 // porch between the antae, its back wall
  const EW = 12, ER = 3.2, ED = 1.4 // end bays: width, recess half-width, recess depth
  const E0 = T0 + EW / 2, E1 = T1 - EW / 2
  const TRING: XY[] = [[T0, TY0], [E0 - ER, TY0], [E0 - ER, TY0 + ED], [E0 + ER, TY0 + ED], [E0 + ER, TY0], [PI0, TY0], [PI0, YR], [PI1, YR], [PI1, TY0], [E1 - ER, TY0], [E1 - ER, TY0 + ED], [E1 + ER, TY0 + ED], [E1 + ER, TY0], [T1, TY0], [T1, TY1], [T0, TY1]]
  const blocks: Block[] = [
    { ring: TRING, z1: CORN, wall: marble, roof, kind: 'temple', grid: null, solid: true },
    // the Viñoly west wing (its west wall angled as OSM), and its low south pavilion
    { ring: ccw([[-72.4, 6.4], [-65.8, -11.8], [-58.9, -30.2], [-56.8, -38], [-36.0, -38], [-36.0, 4.4], [-48, 4.4], [-48, 27.4], [-72.7, 27.2]]), z1: 19.3, wall: granite, roof, kind: 'wing', grid: null },
    { ring: ccw([[-56.8, -38], [-55.8, -40.9], [-53.6, -53.0], [-36.0, -53.0], [-36.0, -38]]), z1: 11.8, wall: granite, roof, kind: 'wing', grid: null },
    // the Viñoly east wing, its stepped east edge and low south pavilion
    { ring: ccw([[59.0, -40], [77.6, -40], [77.6, -28.9], [80.4, -28.8], [80.3, -16.2], [84.0, -16.0], [84.0, 27.5], [59.0, 27.5]]), z1: 19.3, wall: granite, roof, kind: 'wing', grid: null },
    { ring: ccw([[57.0, -48.5], [63.2, -51.7], [75.0, -52.0], [77.6, -40], [57.0, -40]]), z1: 11.8, wall: granite, roof, kind: 'wing', grid: null },
    { ring: ccw([[84.0, -4.7], [88.2, -4.6], [88.3, 7.2], [93.2, 7.2], [93.4, 27.5], [84.0, 27.5]]), z1: 11.8, wall: granite, roof, kind: 'wing', grid: null },
    // the band north of the atrium (1958 wing), the highest flat roof
    { ring: rect(-48, 4.4, 59, 20), z1: 28.9, wall: marble, roof, kind: 'band', grid: null },
    // north blocks (1958 and 1971 wings, round the north entrance)
    { ring: ccw([[-60, 20], [-11, 20], [-11, 55.5], [-23.2, 55.6], [-23.4, 61.2], [-28.2, 61.2], [-28.2, 49.5], [-48.1, 49.7], [-48.6, 53.9], [-60, 54]]), z1: 23.5, wall: granite, roof, kind: 'north', grid: null },
    { ring: ccw([[-11, 20], [32.8, 20], [32.8, 32.7], [32.7, 52.4], [-2.7, 52.7], [-2.7, 49.2], [-11, 49.2]]), z1: 19.5, wall: granite, roof, kind: 'north', grid: null },
    { ring: ccw([[45.6, 20], [93.4, 20], [93.3, 27.5], [105.3, 27.6], [105.1, 49.8], [96.8, 49.9], [96.8, 55.6], [54.8, 55.5], [54.9, 61.7], [50.3, 61.5], [50.1, 52.5], [45.4, 52.4], [45.4, 46.7]]), z1: 19.3, wall: granite, roof, kind: 'north', grid: null },
    { ring: rect(96.8, 27.6, 105.2, 49.8), z1: 13.0, wall: granite, roof, kind: 'north', grid: null },
    // Breuer's 1971 wing, its curved granite-striped wall to the north-west
    {
      ring: ccw([[-60, 27.4], [-60, 54], [-115.8, 54.5], [-115.3, 51.9], [-114.1, 48.1], [-112.3, 44.5], [-110.4, 41.4], [-108.1, 38.3], [-105.4, 35.9], [-101.9, 33.0], [-98.1, 31.3], [-94.0, 29.5], [-90.2, 28.7], [-86.8, 27.9], [-83.0, 27.8], [-80.3, 27.8], [-72.7, 27.2]]),
      z1: 11.8, wall: granite, roof, kind: 'breuer', grid: null,
    },
    // penthouses (lidar)
    { ring: rect(52, 22, 62, 48), z1: 23.4, z0: 19.3, wall: granite, roof, kind: 'pent', grid: null },
    { ring: rect(70, 28, 80, 46), z1: 23.4, z0: 19.3, wall: granite, roof, kind: 'pent', grid: null },
    { ring: rect(-1, 24, 7, 36), z1: 22.5, z0: 19.5, wall: granite, roof, kind: 'pent', grid: null },
  ]
  // the four service towers on the 1958 band
  for (const [x0, x1] of [[-48, -41], [-37.5, -30.5], [50.5, 57], [62.5, 69]]) {
    blocks.push({ ring: rect(x0, 6.5, x1, 18.5), z1: 36.1, z0: 28.9, wall: marble, roof, kind: 'tower', grid: null })
  }
  buildBlocks(blocks, win)

  // ---- the 1916 building's details
  // attic over the cornice, and the cornice
  cornice(marble, TEMPLE, CORN - 1.0, CORN, 0.6)
  parapet(marble, TEMPLE, CORN, ATT, 0.6)
  // the glass hip roof (ridge along x) with the central gable over the portico axis
  {
    const e = 0.6, x0 = T0 + e, x1 = T1 - e, y0 = TY0 + e, y1 = TY1 - e, z0 = ATT - 0.4, z1 = 26.7, inset = 9
    const A: V3 = [x0 + inset, (y0 + y1) / 2, z1], B: V3 = [x1 - inset, (y0 + y1) / 2, z1]
    glass.quad([x0, y0, z0], [x1, y0, z0], B, A)
    glass.quad([x1, y1, z0], [x0, y1, z0], A, B)
    glass.tri([x1, y0, z0], [x1, y1, z0], B)
    glass.tri([x0, y1, z0], [x0, y0, z0], A)
    // the cross gable over the axis, front to back, a little higher
    gableY(glass, marble, TC - 6.5, TC + 6.5, y0, y1, z0 + 1.6, 27.4)
  }
  // the basement's window row on the long faces
  for (const [a, b] of [[[T0, TY0], [T1, TY0]], [[T1, TY1], [T0, TY1]]] as [XY, XY][]) {
    for (let k = 0; k < 9; k++) {
      const s = 4 + k * 10, mid = Math.abs(a[0] < b[0] ? a[0] + s + 2.5 - TC : a[0] - s - 2.5 - TC)
      if (mid < 10) continue // the pavilion
      panel(win, a, b, s, s + 5, TERRACE + 0.6, TERRACE + 2.0, 0.06)
    }
  }
  for (const [a, b] of [[[T1, TY0], [T1, TY1]], [[T0, TY1], [T0, TY0]]] as [XY, XY][]) {
    for (let k = 0; k < 3; k++) {
      const s = 3 + k * 10.5
      panel(win, a, b, s, s + 5, TERRACE + 0.6, TERRACE + 2.0, 0.06)
    }
  }
  // the portico pavilion (rebuilt after review). Scaled from Erik Drost's
  // head-on photos (m3, m4) against the lidar pediment ridge (26.4 over
  // z = 0) and porch terrace (11.4): wide antae, four free-standing Ionic
  // columns in antis before a shaded porch 4 m deep with three bronze-and-
  // glass doors, the entablature, the pavilion's attic and the pediment.
  {
    const x0 = TC - 8.6, x1 = TC + 8.6, yF = -68.8, yW = TY0
    const FLOOR = 11.4, CAP = 19.2, ENT = 21.6, PATT = 23.7, APEX = 26.8
    // the podium under the porch and antae
    const PAV: XY[] = rect(x0, yF, x1, yW)
    for (let i = 0; i < 4; i++) wallQuad(marble, PAV[i], PAV[(i + 1) % 4], 0, FLOOR)
    cap(marble, rect(x0, yF, x1, YR), FLOOR)
    // antae: broad marble piers from the floor to the entablature
    for (const [s0, s1] of [[x0, PI0], [PI1, x1]]) block(marble, null, rect(s0, yF, s1, yW + 0.01), FLOOR, CAP, 0.15)
    // the porch in shadow: back wall, the antae's inner faces, ceiling
    panel(shade, [PI0, YR], [PI1, YR], 0, PI1 - PI0, FLOOR, CAP, 0.03)
    panel(shade, [PI0, yF], [PI0, YR], 0, YR - yF, FLOOR, CAP, 0.03)
    panel(shade, [PI1, YR], [PI1, yF], 0, YR - yF, FLOOR, CAP, 0.03)
    cap(shade, rect(PI0, yF, PI1, YR), CAP, false)
    // three doors in the back wall
    for (const c of [-3.3, 0, 3.3]) panel(win, [PI0, YR], [PI1, YR], 6.4 + c - 0.8, 6.4 + c + 0.8, FLOOR, FLOOR + 4.2, 0.07)
    // the four Ionic columns
    for (const c of [-4.7, -1.55, 1.55, 4.7]) column(marble, marble, TC + c, yF + 1.0, FLOOR, CAP, 0.62, 14)
    // entablature, the pavilion's attic over it, pediment
    const E = rect(x0, yF, x1, YR)
    block(marble, null, E, CAP, PATT, 0)
    cornice(marble, E, ENT - 0.7, ENT, 0.45)
    cornice(marble, E, PATT - 0.6, PATT, 0.45)
    gableY(glass, marble, x0 - 0.35, x1 + 0.35, yF - 0.4, YR, PATT, APEX)
    rakingCornice(marble, x0 - 0.35, x1 + 0.35, yF - 0.4, -1, PATT, APEX, 0.75, 0.45)
    // the steps up to the porch from the terrace
    for (let s = 0; s < 3; s++) {
      const z = TERRACE + ((FLOOR - TERRACE) * (s + 1)) / 3
      const Rr = rect(x0 - 2 + s * 0.4, yF - 4.5 + s * 1.3, x1 + 2 - s * 0.4, yF)
      for (let i = 0; i < 4; i++) wallQuad(marble, Rr[i], Rr[(i + 1) % 4], 0, z)
      cap(marble, Rr, z)
    }
  }
  // the end bays: two Ionic columns in antis in a shaded recess, under a
  // plain frieze to the cornice, with pilaster strips at the bay's edges
  for (const ex of [E0, E1]) {
    const y0 = TY0, y1 = TY0 + ED, FL = 10.6, TOPC = 17.6
    block(marble, null, rect(ex - ER, y0, ex + ER, y1), 0, FL, 0) // the sill under the recess
    block(marble, null, rect(ex - ER, y0, ex + ER, y1), TOPC, CORN - 1.0, 0) // the lintel over it
    panel(shade, [ex - ER, y1], [ex + ER, y1], 0, 2 * ER, FL, TOPC, 0.03)
    panel(shade, [ex - ER, y0], [ex - ER, y1], 0, ED, FL, TOPC, 0.03)
    panel(shade, [ex + ER, y1], [ex + ER, y0], 0, ED, FL, TOPC, 0.03)
    cap(shade, rect(ex - ER, y0, ex + ER, y1), TOPC - 0.01, false)
    panel(win, [ex - ER, y1], [ex + ER, y1], ER - 0.9, ER + 0.9, FL, FL + 4.6, 0.06)
    for (const c of [-1.55, 1.55]) column(marble, marble, ex + c, y0 + 0.65, FL, TOPC, 0.45, 12)
    for (const px of [ex - EW / 2 + 0.2, ex - ER - 1.2, ex + ER + 0.2, ex + EW / 2 - 1.2]) {
      const pa = Math.max(T0, px), pb = Math.min(T1, px + 1.0)
      block(marble, null, rect(pa, y0 - 0.3, pb, y0 + 0.01), FL, CORN - 1.0, 0.1)
    }
  }

  // ---- the atrium: a curved glass roof between the wings, falling north
  {
    const x0 = -36, x1 = 59, y0 = TY1, y1 = 4.4, nx = 12, ny = 6
    const zAt = (x: number, y: number) => {
      const t = (y - y0) / (y1 - y0), u = Math.abs((x - (x0 + x1) / 2) / ((x1 - x0) / 2))
      return 24.5 + 2.8 * Math.cos((t * Math.PI) / 2) - 1.6 * u ** 4
    }
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < ny; j++) {
        const xa = x0 + ((x1 - x0) * i) / nx, xb = x0 + ((x1 - x0) * (i + 1)) / nx
        const ya = y0 + ((y1 - y0) * j) / ny, yb = y0 + ((y1 - y0) * (j + 1)) / ny
        glass.quad([xa, ya, zAt(xa, ya)], [xb, ya, zAt(xb, ya)], [xb, yb, zAt(xb, yb)], [xa, yb, zAt(xa, yb)])
      }
    // glazed walls under its edges: south over the 1916 attic, and the ends over the wings
    for (let i = 0; i < nx; i++) {
      const xa = x0 + ((x1 - x0) * i) / nx, xb = x0 + ((x1 - x0) * (i + 1)) / nx
      glass.quad([xb, y0, ATT], [xa, y0, ATT], [xa, y0, zAt(xa, y0)], [xb, y0, zAt(xb, y0)])
    }
    for (let j = 0; j < ny; j++) {
      const ya = y0 + ((y1 - y0) * j) / ny, yb = y0 + ((y1 - y0) * (j + 1)) / ny
      glass.quad([x1, ya, 19.3], [x1, yb, 19.3], [x1, yb, zAt(x1, yb)], [x1, ya, zAt(x1, ya)])
      glass.quad([x0, yb, 19.3], [x0, ya, 19.3], [x0, ya, zAt(x0, ya)], [x0, yb, zAt(x0, yb)])
    }
    // the atrium's floor-to-roof glass between the wings' south ends and the 1916 building
    // is hidden behind them; nothing else to draw inside.
  }

  // ---- the Viñoly wings' glazed south pavilions and window bands
  const band = (a: XY, b: XY, s0: number, s1: number, z0: number, z1: number) => panel(win, a, b, s0, s1, z0, z1, 0.06)
  band([-53.6, -53.0], [-36.0, -53.0], 1.0, 16.6, TERRACE, 10.8) // west pavilion south face
  band([57.0, -48.5], [63.2, -51.7], 0.5, 6.4, TERRACE, 10.8)
  band([63.2, -51.7], [75.0, -52.0], 0.8, 11.0, TERRACE, 10.8) // east pavilion south face
  // the wings' long glass bands, upper floors, on the outer faces
  band([-58.9, -30.2], [-65.8, -11.8], 1.5, 18, 12.0, 17.5)
  band([77.6, -38.9], [77.6, -28.9], 0.8, 9.2, 12.0, 17.5)
  band([80.3, -28.8], [80.3, -16.2], 0.8, 11.8, 12.0, 17.5)
  band([84.0, -16.0], [84.0, -4.7], 0.8, 10.5, 12.0, 17.5)
  // the north entrance's glass front under the canopy
  band([-2.7, 52.7], [-11, 52.7], 0.5, 7.8, STREET, STREET + 4.5)

  // ---- the north entrance canopy (OSM building=roof): a concrete slab on posts
  {
    const x0 = -11, x1 = -2.9, y0 = 52.7, y1 = 83.4, z = STREET + 6.2
    const R = rect(x0, y0, x1, y1)
    for (let i = 0; i < 4; i++) wallQuad(marble, R[i], R[(i + 1) % 4], z, z + 0.9)
    cap(marble, R, z + 0.9)
    cap(marble, R, z, false)
    for (const yy of [64, 75, 82.4]) for (const xx of [x0 + 0.6, x1 - 0.6]) {
      const P = rect(xx - 0.35, yy - 0.35, xx + 0.35, yy + 0.35)
      for (let i = 0; i < 4; i++) wallQuad(marble, P[i], P[(i + 1) % 4], 0, z)
    }
  }

  const flood = (p: V3, n: V3) => (p[1] < -60 && n[2] < 0.6 ? Math.max(0, 1 - p[2] / 30) * 0.8 : 0)
  return finishGlb('cle-museum-of-art', 'Cleveland Museum of Art', [
    { part: marble, material: { ...finish('cma-marble', 0xebe6dc), floodlight: flood } as typeof PALETTE.window },
    { part: granite, material: finish('cma-granite', 0x9fa2a5) },
    { part: win, material: PALETTE.window },
    { part: glass, material: { ...PALETTE.glass, color: 0x93a8b6 } },
    { part: roof, material: finish('cma-roof', 0xa39a8e) },
    // the shaded porch and recesses: marble in shadow, as the photos show it
    { part: shade, material: { ...finish('cma-porch-shade', 0x8e8981), floodlight: flood } as typeof PALETTE.window },
  ], { bearing: 352.5, height: 36.1, replaces: ['way/109114109', 'way/420174175', 'way/420173649', 'way/349671512'] }, 6500)
}

if (import.meta.main) await writeModel('cle-museum-of-art', build())
