/**
 * Constitution Hall, American University, Washington, DC.
 * Long Nebraska Avenue elevation with a drive through the occupied upper
 * storeys, wider block at the southwest end and a narrower northeast range.
 *
 * Plan: https://www.openstreetmap.org/way/517997411. Bearing 35.07 degrees. Current OSM tunnel way
 * 1059688044 crosses the body at local y=-6.16 m. Its mapped outline
 * breaks at -11.5 and -0.45 m. Passage clearance is estimated (5.3 m).
 * Confirmed as a through-passage by AU:
 * https://www.american.edu/cas/iwsm2026/directions.cfm .
 * DC Zoning Commission 11-07 findings 136–139: six storeys, 62 ft (18.90 m)
 * approved to the main roof; academic and retail rooms along the ground floor.
 * https://www.american.edu/communityrelations/campus-plan/upload/american-university-2021-campus-plan-ctr-appendices-sept-15-2020.pdf
 * Precast panels: structural engineer https://ehlert-bryan.com/project/american-university-east-campus/ .
 * Confirmed completed building: https://www.american.edu/about/sustainability/buildings/east-campus.cfm .
 * Pane widths, colours, lintels, parapet and exact elevations are stylized.
 * Limited elevation evidence: no licensed matching facade photos established.
 * Roof housings follow contiguous returns above the main roof. Ground at anchor.
 *
 * Exports the precast wall and window helpers shared by the four East
 * Campus generators. All geometry is in the building's rotated map frame.
 * 2022 DC OCTO aerial lidar, building-class surface and bare earth:
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * Median roof is 19.8 m above the lower decile of local ground (118.5 m).
 * The plan elevations document a glazed promenade and stacked curtain bays.
 * https://www.american.edu/finance/ppm/upload/exhibit-1-east-campus.pdf
 * Heights and bounds of three roof clusters measured on the 2022 full surface.
 * Glazing divisions and framing widths are diagrammatic.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import {
  capRing, chamfer, finishGlb, flatShape, outward, prism, rect, writeModel,
  type XY,
} from './sea-tacoma-union-station'

export class CampusShell {
  stone = new Part()
  trim = new Part()
  roof = new Part()
  window = new Part()
  entrance = new Part()
  spandrel = new Part()

  /** Vertical precast walls, a pale coping, and a roof face for a concave plan. */
  mass(outline: XY[], base: number, top: number, underside = false) {
    const ring = chamfer(outline, 0.2)
    prism(this.stone, null, ring, base, top - 0.30)
    prism(this.trim, this.roof, ring, top - 0.30, top)
    if (underside) capRing(this.stone, ring, base, false)
  }

  /** Even paired windows laid into one real wall segment, in wall metres. */
  bays(a: XY, b: XY, sill: number, head: number, pitch: number, fill = 0.68) {
    const length = Math.hypot(b[0] - a[0], b[1] - a[1])
    const count = Math.floor(length / pitch)
    if (count < 1) return
    const face = { o: [a[0], a[1], 0] as [number, number, number], n: outward(a, b) }
    const spacing = length / count
    for (let i = 0; i < count; i++) {
      const center = (i + 0.5) * spacing
      const half = Math.min(spacing * fill / 2, spacing / 2 - 0.25)
      flatShape(this.window, face, rect(center - half, sill, center + half, head), 0.035)
    }
  }

  /** Joined glazing across floors, divided with separate opaque mullions and slab covers. */
  curtain(a: XY, b: XY, left: number, right: number, bottom: number, top: number, pitch: number, slabs: number[] = []) {
    const face = { o: [a[0], a[1], 0] as [number, number, number], n: outward(a, b) }
    flatShape(this.window, face, rect(left, bottom, right, top), 0.081)
    const divisions = Math.max(1, Math.round((right - left) / pitch))
    for (let i = 0; i <= divisions; i++) {
      const x = left + i * (right - left) / divisions
      flatShape(this.spandrel, face, rect(x - 0.075, bottom, x + 0.075, top), 0.097)
    }
    for (const z of slabs) flatShape(this.spandrel, face, rect(left, z, right, z + 0.24), 0.103)
  }

  /** Opaque raised service casing, with a metal face and simple cap. */
  casing(plan: XY[], base: number, top: number) {
    const ring = chamfer(plan, 0.18)
    prism(this.spandrel, null, ring, base, top - 0.14)
    prism(this.trim, this.roof, ring, top - 0.14, top)
  }

  /** A glazed lobby strip with a contrasting recessed door represented flush. */
  lobby(a: XY, b: XY, clearHeight: number) {
    const length = Math.hypot(b[0] - a[0], b[1] - a[1])
    const face = { o: [a[0], a[1], 0] as [number, number, number], n: outward(a, b) }
    flatShape(this.spandrel, face, rect(0.6, 0.45, length - 0.6, clearHeight), 0.03)
    this.bays(a, b, 0.75, clearHeight - 0.23, 3.6, 0.87)
    const center = length / 2
    flatShape(this.entrance, face, rect(center - 0.85, 0.10, center + 0.85, 2.5), 0.052)
  }

  async save(id: string, title: string) {
    await writeModel(id, finishGlb(title, [
      { part: this.stone, material: finish('au-precast', 0xe5d9c4) },
      { part: this.trim, material: PALETTE.trim },
      { part: this.roof, material: PALETTE.roof },
      { part: this.window, material: PALETTE.window },
      { part: this.spandrel, material: finish('taupe-metal', 0x998e7c) },
      { part: this.entrance, material: PALETTE.entrance },
    ], {}))
  }
}

if (import.meta.main) {
  const hall = new CampusShell()
  const top = 19.8, clear = 5.3
  const body: XY[] = [
  [-8.77, -0.45], [-8.62, -6.14], [-8.47, -11.53], [-8.46, -12.41],
  [-9.32, -12.48], [-9.19, -21.04], [-5.53, -20.98], [-5.17, -38.4],
  [-0.79, -38.15], [-0.88, -40.82], [11.64, -40.28], [10.95, -12.07],
  [7.42, -12.19], [7.39, -11.29], [7.21, -6.19], [7.0, -0.04],
  [5.59, 40.94], [1.83, 40.9], [1.77, 42.67], [-9.93, 42.4],
]
  const south = body.slice(2, 14)
  const north = [...body.slice(15), body[0]]
  prism(hall.stone, null, chamfer(south, 0.18), 0, clear)
  prism(hall.stone, null, chamfer(north, 0.18), 0, clear)
  hall.mass(body, clear, top)
  capRing(hall.stone, [body[2], body[13], body[15], body[0]], clear, false)

  for (let f = 0; f < 5; f++) {
    const sill = 5.8 + f * 2.76
    for (let i = 0; i < body.length; i++) {
      hall.bays(body[i], body[(i + 1) % body.length], sill, sill + 1.86, 4.0)
    }
  }
  hall.lobby(body[10], body[11], 4.35)
  hall.lobby(body[15], body[16], 4.2)
  hall.bays(body[19], body[0], 0.92, 4.4, 4.2, 0.76)
  hall.bays(body[6], body[7], 0.92, 4.4, 4.2, 0.76)
  // The street side faces the Nebraska promenade. Continuous glazing ends
  // at either jamb of the vehicle passage. Keep the underside completely open.
  hall.curtain(body[19], body[0], 0.5, 41.9, 0.4, 4.63, 2.7, [3.1])
  hall.curtain(body[6], body[7], 0.45, 16.90, 0.4, 4.63, 2.7, [3.1])
  const slabLevels = [5.20, 8.05, 10.81, 13.57, 16.33]
  hall.curtain(body[19], body[0], 0.42, 5.63, 4.84, 19.22, 1.73, slabLevels)
  hall.curtain(body[4], body[5], 0.32, 6.03, 0.5, 19.22, 1.8, slabLevels)

  // Compact raised roof groups follow the full-return surface, including
  // the L-shaped one above the widened southwest wing.
  hall.casing([[-5.4, -19.7], [1.3, -19.7], [1.3, -27.9], [4.45, -27.9],
    [4.45, -18.7], [1.5, -15.8], [-5.4, -15.8]], top, 21.37)
  hall.casing(rect(-1.15, -10.7, 1.95, -1.8), top, 21.16)
  hall.casing(rect(-2.1, 9.05, 0.9, 18.0), top, 21.18)
  await hall.save('dc-au-constitution-hall', 'Constitution Hall')
}
