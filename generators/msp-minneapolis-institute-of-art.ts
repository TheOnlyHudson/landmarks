/**
 * Minneapolis Institute of Art (1915, McKim, Mead & White; additions by
 * Kenzo Tange 1974 and Michael Graves 2006): procedural, CC0-1.0.
 * bun generators/msp-minneapolis-institute-of-art.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (OSM's walls run
 * north-south and east-west). Origin at the area centroid of OSM
 * way/38898412 (-93.274213, 44.958515). y = 0 is the lawn in front of the
 * north portico (lidar 271.0 m); the site is nearly level.
 *
 * Form: the 1915 granite block faces north on 24th Street: a six-column
 * Ionic portico under a pediment, raised on a podium up a grand stair with
 * cheek walls and statue plinths, flanked by long wings (a base storey of
 * tall windows, plain wall, cornice and a set-back attic); behind the
 * portico the higher central hall with its glass skylight ridge. Round it,
 * Kenzo Tange's 1974 white additions with tall dark window slots, and at the
 * south-west Michael Graves's 2006 wing, a little taller. Pale grey roofs.
 *
 * Sources
 * - OSM (ODbL): way/38898412 ("Minneapolis Institute of Art"), the only
 *   building the model covers. Way/374629418 (Children's Theatre Company)
 *   adjoins to the south-east and is a separate building, left drawn;
 *   way/1484059216 stands in the courtyard south of the 1915 block and is
 *   not covered.
 * - USGS 3DEP lidar MN_CentralMissRiver_4_B22 (flown 2022), 1 m grid,
 *   heights above 271.0 m: portico eaves 21.4-21.9, pediment ridge 25.3 on
 *   the portico's axis (x 14), the podium about 4 m with the stair falling
 *   to y 52.6; the 1915 range 19; the central hall 20-21 with a 25 m
 *   skylight ridge; the Tange wings 16-19; the Graves wing 21-22, part 24.
 * - USGS NAIP (public domain): plan and the pale grey roofs, the hall's
 *   skylights.
 * - Photos (Wikimedia Commons, evidence):
 *   McGhiever, "Minneapolis Institute of Art.jpg", CC BY-SA 4.0 (the north
 *   front, frontal: column, entablature and pediment proportions, the wings'
 *   windows and cornice); Alvintrusty, "Minneapolis Institute of Arts.jpg",
 *   CC BY-SA 3.0 (from the north-west); AlexiusHoratius, "Minneapolis
 *   Institute of Art 12.JPG", CC BY-SA 3.0 (from the north-east);
 *   Bmzuckerman, "Neo-Classical - Minneapolis, MN - Minneapolis Institute of
 *   Art (1).jpg", CC BY 4.0; City of Minneapolis Archives, "Minneapolis
 *   Institute of Arts (20721040061).jpg" and "(20526193398).jpg", CC BY 2.0
 *   (Tange's white walls and window slots); Andrew Balfour, "Minneapolis Art
 *   Institute - panoramio.jpg", CC BY 3.0.
 * - Published: McKim, Mead & White, opened 1915; additions by Kenzo Tange
 *   (1974) and Michael Graves (2006) (Wikipedia, "Minneapolis Institute of
 *   Art").
 * Measured (lidar): every height above and the portico's plan.
 * Estimated from the photos: the column height (podium 4.0 to 17.4), the
 *   entablature (17.4-20.6), the wings' cornice (14.6-15.6) and attic, the
 *   wing windows (seven a side, 2.2 x 5.2 m), the stair's treads and cheek
 *   walls, Tange's slot windows (counted roughly, not placed one by one).
 * Doubts: where the 1915 granite ends and Tange's white walls begin is read
 *   from lidar steps and photos, not drawings; the south and courtyard sides
 *   have no good licensed photo and are kept plain; the skylight is drawn as
 *   one glass ridge.
 * Night: the north front and portico are floodlit (`floodlight`); windows
 *   are `window`, the skylight `glass`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { type XY, type Face, ccw, prism, rect, chamfer, flatShape, extrudeShape, lathe, finishGlb, writeModel } from './sea-tacoma-union-station'

// OSM way/38898412, in metres about its centroid (-93.274213, 44.958515),
// less the portico (x 3..24, y 41..48), which is built on its own
const OUTLINE: XY[] = [
  [79, -46], [79, -39], [79, -28], [79, -20], [81, -20], [81, 9], [81, 16], [81, 20], [81, 25], [81, 28], [81, 32], [81, 36], [81, 43],
  [72, 43], [72, 36], [62, 36], [62, 41], [61, 41], [-35, 41], [-35, 36], [-46, 36],
  [-46, 43], [-55, 43], [-55, 36], [-72, 36], [-71, 13], [-71, -18], [-73, -18], [-73, -35], [-73, -39], [-73, -43], [-73, -59],
  [-72, -59], [-68, -59], [-68, -63], [-58, -63], [-58, -64], [-47, -64], [-47, -63], [-38, -63], [-38, -59], [-33, -59], [-33, -55],
  [-29, -55], [-29, -53], [-29, -24], [-33, -24], [-33, -18], [-1, -18], [-1, -25], [0, -25], [3, -25], [8, -25], [8, -19],
  [62, -18], [62, -23], [54, -23], [54, -32], [61, -32], [61, -36], [61, -39], [61, -46], [61, -56], [73, -56], [73, -52], [79, -52],
]
const AX = 14 // the portico's axis (x); the 1915 front is symmetric about it
const FRONT = 41.3 // the 1915 north wall
const PODIUM = 4.0 // the portico's floor, up the grand stair

export function build() {
  const granite = new Part(), white = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part()
  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = roof, c = 0.3) =>
    prism(p, top, c > 0 ? chamfer(rect(x0, y0, x1, y1), c) : rect(x0, y0, x1, y1), z0, z1)

  // ---- the whole footprint: Tange's and Graves's white additions round the 1915 block
  prism(white, roof, ccw(OUTLINE), 0, 17.6)
  // the Graves wing at the south-west, taller (lidar 21-24)
  box(white, -58, -62, -33, -22, 17.6, 21.6)
  box(white, -58, -46, -46, -34, 21.6, 24, roof)
  // Tange's dark window slots and bays on the long white walls (west, south, east)
  const slots = (f: Face, s0: number, s1: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const s = s0 + ((s1 - s0) * (i + 0.5)) / n
      flatShape(win, f, rect(s - 0.7, 3, s + 0.7, 14.5), 0.06)
    }
  }
  slots({ o: [-71.5, -2, 0], n: [-1, 0] }, -14, 14, 4)
  slots({ o: [81, 0, 0], n: [1, 0] }, -18, 30, 6)
  slots({ o: [-45, -63.5, 0], n: [0, -1] }, -9, 9, 3)
  slots({ o: [30, -18, 0], n: [0, -1] }, -18, 18, 4)
  // the white wings' north ends beside the 1915 front: one tall glazed bay each
  for (const [x0, x1] of [[-72, -55], [62, 81]]) flatShape(win, { o: [(x0 + x1) / 2, 36, 0], n: [0, 1] }, rect(-3, 4, 3, 13), 0.06)

  // ---- the 1915 block: granite north range, central hall with its skylight
  box(granite, AX - 48, 19, AX + 48, FRONT, 0, 14.8, roof)
  box(trim, AX - 48.4, 19, AX + 48.4, FRONT + 0.4, 14.6, 15.6, roof) // the main cornice
  box(granite, AX - 47, 19, AX + 47, FRONT - 1.2, 15.6, 18.8, null) // the attic, set back
  box(trim, AX - 47.2, 19, AX + 47.2, FRONT - 1.0, 18.8, 19.2, roof)
  box(granite, AX - 10, -18, AX + 10, FRONT, 0, 21, roof)
  box(trim, AX - 10.3, -18, AX + 10.3, FRONT + 0.2, 20.2, 21.2, roof)
  // glass skylight ridge over the main hall
  for (const [y0, y1] of [[20, 39]]) {
    glass.quad([AX - 7, y0, 21.2], [AX, y0, 24.2], [AX, y1, 24.2], [AX - 7, y1, 21.2])
    glass.quad([AX + 7, y1, 21.2], [AX, y1, 24.2], [AX, y0, 24.2], [AX + 7, y0, 21.2])
    glass.tri([AX - 7, y0, 21.2], [AX + 7, y0, 21.2], [AX, y0, 24.2])
    glass.tri([AX + 7, y1, 21.2], [AX - 7, y1, 21.2], [AX, y1, 24.2])
  }
  // north front: a rusticated base storey with tall windows, plain wall above, frieze band
  const N: Face = { o: [AX, FRONT, 0], n: [0, 1] }
  for (const side of [-1, 1]) {
    // seen from the north, s runs westward (n = +y): s = -(x - AX)
    for (let i = 0; i < 7; i++) {
      const x = side * (13.5 + i * 4.9)
      flatShape(trim, N, rect(-x - 1.5, 4.6, -x + 1.5, 10.6), 0.05)
      flatShape(win, N, rect(-x - 1.1, 5.0, -x + 1.1, 10.2), 0.09)
    }
    flatShape(trim, N, rect(-side * 47.5, 3.6, -side * 10.5, 4.2), 0.05) // the base storey's top band
  }
  flatShape(trim, N, rect(-47.5, 12.6, 47.5, 13.2), 0.05) // frieze line under the cornice

  // ---- the portico: six Ionic columns, entablature, pediment, on a podium up the grand stair
  const PY1 = 47.6
  box(granite, AX - 11, FRONT, AX + 11, PY1 + 0.4, 0, PODIUM, granite)
  for (const [y1, z] of [[49.4, 3.0], [51.0, 2.0], [52.6, 1.0]] as [number, number][]) box(granite, AX - 8.6, PY1 + 0.4, AX + 8.6, y1, 0, z, granite, 0.1)
  for (const s of [-1, 1]) box(granite, AX + s * 8.6, PY1 + 0.4, AX + s * 10.6, 52.6, 0, 4.7, granite) // stair cheeks, statue plinths
  for (const k of [-8.75, -5.25, -1.75, 1.75, 5.25, 8.75]) {
    lathe(granite, AX + k, 46.3, [[1.05, PODIUM], [1.05, PODIUM + 0.5], [0.82, PODIUM + 0.7], [0.72, 16.6], [0.98, 16.9], [0.98, 17.4]], 10)
  }
  // two columns in antis at the back corners
  for (const k of [-8.75, 8.75]) box(granite, AX + k - 0.8, FRONT, AX + k + 0.8, FRONT + 1.2, PODIUM, 17.4, null, 0.1)
  // the doorway in the back wall
  flatShape(win, N, rect(-2.0, PODIUM, 2.0, PODIUM + 8.5), 0.05)
  flatShape(trim, N, rect(-2.8, PODIUM + 8.5, 2.8, PODIUM + 9.3), 0.05)
  box(granite, AX - 10.4, FRONT, AX + 10.4, PY1, 17.4, 19.6, granite) // entablature
  box(trim, AX - 10.6, FRONT, AX + 10.6, PY1 + 0.2, 19.6, 20.6, trim) // its cornice
  // pediment: gable roof, ridge along the axis; tympanum faces north
  const E = 20.6, R = 25.3, x0 = AX - 10.6, x1 = AX + 10.6
  roof.quad([x1, FRONT, E], [x1, PY1 + 0.2, E], [AX, PY1 + 0.2, R], [AX, FRONT, R])
  roof.quad([x0, PY1 + 0.2, E], [x0, FRONT, E], [AX, FRONT, R], [AX, PY1 + 0.2, R])
  granite.tri([x1, PY1 + 0.2, E], [x0, PY1 + 0.2, E], [AX, PY1 + 0.2, R])
  // the raking cornice as a bold pale band
  extrudeShape(trim, { o: [AX, PY1 + 0.2, 0], n: [0, 1] }, [[-10.6, E], [-9.4, E], [0, R - 0.6], [9.4, E], [10.6, E], [0, R]], 0, 0.25)

  const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : p[1] > 40 ? 0.85 : 0)
  return finishGlb('msp-minneapolis-institute-of-art', [
    { part: granite, material: { ...finish('mia-granite', 0xe3e0d8), floodlight: lit } as Swatch },
    { part: white, material: finish('mia-white', 0xf1f0eb) },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } as Swatch },
    { part: roof, material: finish('mia-roof', 0xc9cdcf) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
  ], { name: 'Minneapolis Institute of Art' }, 5000)
}

if (import.meta.main) await writeModel('msp-minneapolis-institute-of-art', build())
