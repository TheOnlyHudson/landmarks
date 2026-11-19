/**
 * Sports Center (Bender Arena), American University, Washington, DC.
 * Ground plan and centroid from OSM, May 22, 2026, in the local 33.5° frame.
 * https://www.openstreetmap.org/way/33899314 (OpenStreetMap contributors, ODbL).
 * Height evidence: DC OCTO 2022 airborne lidar, NOAA Digital Coast dataset 9837,
 * 1 m classified-building DSM plus bare earth DEM (NAVD88 metres).
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * Complex and component buildings: https://aueagles.com/sports/2019/8/15/information-facilities-bender-arena.aspx?id=18
 * Photovoltaic array across Bender and Meltzer roofs: https://www.american.edu/about/sustainability/buildings/meltzer-athletic-center.cfm
 * Roof survey relative to ground p10 106.6 m: arena deck 15.8 m high,
 * aquatic/secondary roofs 10.6–17 m, east tower 27.4–30.7 m.
 * The painted deck represents the documented pre-solar appearance. The AU
 * mark is a simplified geometric rendition of the university's monogram.
 * https://commons.wikimedia.org/wiki/File:American_University_logo.svg
 * https://virtualglobetrotting.com/map/american-university/
 * Re-surveyed rooftop housings at 17.9–18.1 m, a two-stage eastern riser
 * and a 17.6 m equipment group above the secondary roof. The central housing
 * behind the university mark has been suppressed for legibility.
 * A seven-step approach and campus sidewalk meet the north sports frontage:
 * https://www.openstreetmap.org/way/38094383
 * Placement, paint colors, entrance heights and facade openings are approximate.
 * No openly licensed current close-range exterior photographs established.
 */
import { Shape } from 'three'
import { Part } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { ccw, capRing, extrudeShape, flatShape, outward, prism, rect, finishGlb, writeModel, type XY } from './sea-tacoma-union-station'

/** Single-sided grouped glazing and common flat-roof details. Local y points north. */
export class SportsShell {
  wall = new Part()
  roof = new Part()
  trim = new Part()
  glazing = new Part()
  accent = new Part()
  detail = new Part()

  mass(outline: XY[], base: number, top: number, roofSurface = this.roof) {
    prism(this.wall, null, outline, base, top - 0.36)
    prism(this.trim, roofSurface, outline, top - 0.36, top)
  }

  bays(a: XY, b: XY, sill: number, head: number, desiredBay: number, fill: number, part = this.glazing) {
    const length = Math.hypot(b[0] - a[0], b[1] - a[1])
    const count = Math.max(1, Math.round(length / desiredBay))
    const bay = length / count
    const face = { o: [a[0], a[1], 0] as [number, number, number], n: outward(a, b) }
    for (let i = 0; i < count; i++) {
      const middle = (i + 0.5) * bay
      flatShape(part, face, rect(middle - bay * fill / 2, sill, middle + bay * fill / 2, head), 0.035)
    }
  }

  /** Framed rectangles on vertical wall segments, specified in metres from endpoint a. */
  face(part: Part, a: XY, b: XY, start: number, end: number, bottom: number, top: number, depth = 0.055) {
    const plane = { o: [a[0], a[1], 0] as [number, number, number], n: outward(a, b) }
    const panel = rect(start, bottom, end, top)
    if (depth <= 0.07) flatShape(part, plane, panel, depth)
    else extrudeShape(part, plane, panel, 0.02, depth)
  }

  /** Low-slope survey roof, with fascia thickness proportionate to a small building. */
  utilityRoof(outline: XY[], corners: number[], fascia: number) {
    const plinth = 0.15
    prism(this.trim, null, outline, 0, plinth)
    const roofVertex = (i: number, dz = 0): [number, number, number] =>
      [outline[i][0], outline[i][1], corners[i] + dz]
    for (let i = 0; i < outline.length; i++) {
      const next = (i + 1) % outline.length
      this.wall.quad([outline[i][0], outline[i][1], plinth], [outline[next][0], outline[next][1], plinth],
        roofVertex(next, -fascia), roofVertex(i, -fascia))
      this.trim.quad(roofVertex(i, -fascia), roofVertex(next, -fascia), roofVertex(next), roofVertex(i))
    }
    this.roof.quad(roofVertex(0), roofVertex(1), roofVertex(2), roofVertex(3))
  }

  /** A non-illuminated service entrance; dimensions and position are approximations. */
  serviceDoor(a: XY, b: XY, center: number, width: number, height: number) {
    this.face(this.trim, a, b, center - width / 2 - 0.075, center + width / 2 + 0.075, 0.16, height + 0.08)
    this.face(this.accent, a, b, center - width / 2, center + width / 2, 0.17, height, 0.07)
  }

  solar(x: number, y: number, columns: number, rows: number, z: number, width: number, depth: number) {
    // Group neighboring modules into tables, leaving visible maintenance aisles.
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < columns; i++) {
        const x0 = x + i * (width + 0.62), y0 = y + j * (depth + 0.9)
        capRing(this.accent, rect(x0, y0, x0 + width, y0 + depth), z)
      }
    }
  }

  async save(id: string, title: string, wallColor: number, accent = finish('photovoltaic', 0x586c80, 0.4), detail: Swatch = PALETTE.entrance, trim: Swatch = PALETTE.trim) {
    await writeModel(id, finishGlb(title, [
      { part: this.wall, material: finish('campus-masonry', wallColor) },
      { part: this.roof, material: PALETTE.roof },
      { part: this.trim, material: trim },
      { part: this.glazing, material: PALETTE.window },
      { part: this.accent, material: accent },
      { part: this.detail, material: detail },
    ], {}))
  }
}

if (import.meta.main) {
  const arena = new SportsShell()
  const footprint: XY[] = [
  [-41.81, -38.96], [6.78, -38.9], [43.27, -38.85], [43.39, -16.45], [49.07, -16.44],
  [49.12, -5.27], [49.19, 7.8], [52.99, 7.81], [53.05, 20.47], [32.84, 20.45],
  [32.87, 25.28], [32.89, 41.54], [10.75, 41.42], [10.75, 39.8], [-45.28, 39.51],
  [-45.29, 30.41], [-45.3, 28.07], [-44.92, -28.23], [-44.89, -31.28],
]
  arena.mass(footprint, 0, 4.8)
  // The arena's main span and the pool/service wing have different roof levels.
  const arenaRoof: XY[] = [
  [10.75, -38.89], [10.75, 39.8], [-42, 39.53], [-42, -38.49], [-41.81, -38.96],
  [6.78, -38.9],
]
  const poolWing: XY[] = [
  [10.75, 41.42], [10.75, 39.8], [10.75, 3], [49.16, 3], [49.19, 7.8],
  [52.99, 7.81], [53.05, 20.47], [32.84, 20.45], [32.87, 25.28], [32.89, 41.54],
]
  const southWing: XY[] = [
  [49.16, 3], [10.75, 3], [10.75, -38.89], [43.27, -38.85], [43.39, -16.45],
  [49.07, -16.44], [49.12, -5.27],
]
  const eastWing: XY[] = [
  [32.84, 20.45], [32.84, 3], [49.16, 3], [49.19, 7.8], [52.99, 7.81],
  [53.05, 20.47],
]
  arena.mass(arenaRoof, 4.8, 15.8, arena.trim)
  arena.mass(poolWing, 4.8, 10.6)
  arena.mass(southWing, 4.8, 14.1)
  arena.mass(eastWing, 10.6, 16.8)
  const eastTower: XY[] = [
  [53.05, 20], [42, 20], [42, 8], [52.99, 8],
]
  arena.mass(eastTower, 16.8, 27.4)
  arena.mass(rect(40.0, -3.5, 47.0, 8.0), 14.1, 30.7)

  // Paint the mark between the surveyed rooftop housings. Its lettering runs
  // along the long axis of the arena, readable from the campus's west side.
  // Draw the colored fields of the supplied university mark on white paint.
  // Their boundaries define both interlocking letters, including the shared
  // crossbar, the curved serifs, and the open bowl at the lower edge.
  // Artboard coordinates run right and down from the top left of the paint.
  const metresPerUnit = 28 / 826
  const paint = (part: Part, shape: Shape) => {
    const ring: XY[] = shape.getPoints(10).map(({x, y}) => [
      -16 + (429 - y) * metresPerUnit,
      2 + (413 - x) * metresPerUnit,
    ])
    capRing(part, ccw(ring), 15.85)
  }
  // The blue field wraps the left foot of the A and the falling stem of the U.
  paint(arena.accent, new Shape()
    .moveTo(0, 0)
    .lineTo(410, 0)
    .lineTo(232, 443)
    .bezierCurveTo(201, 522, 175, 559, 110, 568)
    .lineTo(110, 582)
    .lineTo(355, 582)
    .lineTo(355, 568)
    .bezierCurveTo(272, 556, 248, 542, 258, 487)
    .bezierCurveTo(262, 462, 276, 419, 290, 382)
    .bezierCurveTo(364, 393, 378, 409, 378, 482)
    .lineTo(378, 684)
    .bezierCurveTo(377, 763, 390, 821, 444, 858)
    .lineTo(0, 858))
  // The split inside the A continues the vertical color division.
  paint(arena.accent, new Shape()
    .moveTo(414, 69)
    .lineTo(414, 371)
    .lineTo(295, 371))
  paint(arena.detail, new Shape()
    .moveTo(414, 69)
    .lineTo(532, 371)
    .lineTo(414, 371))
  // The upper red field leaves a swept serif between the A and the right stem.
  paint(arena.detail, new Shape()
    .moveTo(475, 0)
    .lineTo(826, 0)
    .lineTo(826, 371)
    .lineTo(643, 371)
    .lineTo(643, 382)
    .bezierCurveTo(732, 390, 747, 423, 748, 507)
    .lineTo(748, 564)
    .bezierCurveTo(708, 556, 686, 525, 664, 475))
  // The inner red bowl defines the curved bottom of the U.
  paint(arena.detail, new Shape()
    .moveTo(537, 383)
    .lineTo(569, 468)
    .bezierCurveTo(592, 537, 571, 556, 493, 569)
    .lineTo(493, 582)
    .lineTo(748, 582)
    .lineTo(748, 679)
    .bezierCurveTo(747, 792, 718, 855, 611, 855)
    .bezierCurveTo(502, 855, 441, 801, 441, 687)
    .lineTo(441, 486)
    .bezierCurveTo(441, 410, 452, 397, 537, 383))
  // The lower right red corner shapes the outside of the U.
  paint(arena.detail, new Shape()
    .moveTo(826, 387)
    .lineTo(826, 858)
    .lineTo(699, 858)
    .bezierCurveTo(754, 818, 772, 761, 773, 683)
    .lineTo(778, 500)
    .bezierCurveTo(780, 427, 790, 403, 826, 387))
  for (const [x, y, width, depth, z] of [
    [-36.8, -17.4, 11.8, 3.4, 17.97], [-21, -17.4, 11.1, 4.1, 18.05],
    [-36.7, 17.3, 11.5, 4.5, 17.97], [-21.8, 17.6, 11.7, 4.3, 18.06],
    [34.3, -24.7, 7.3, 3.5, 17.6], [28.4, -30.6, 3.3, 6.2, 18.0],
  ]) {
    const base = x < 0 ? 15.8 : 14.1
    prism(arena.roof, arena.trim, rect(x, y, x + width, y + depth), base, z)
    arena.face(arena.roof, [x, y], [x + width, y], 0.3, width - 0.3, z - 0.36, z - 0.23)
  }
  // The east service core descends in three steps to the lower wing.
  arena.mass(rect(44.4, 13.4, 52.5, 19.0), 27.4, 27.8)
  arena.bays([40, -3.5], [47, -3.5], 23.3, 28.6, 3.5, 0.65)
  // Wide paired openings mark the north arrival at the head of the mapped steps.
  const northA = footprint[13], northB = footprint[14]
  arena.face(arena.roof, northA, northB, 24.5, 35.0, 1.0, 4.5)
  for (const start of [25.05, 27.45, 29.85, 32.25]) {
    arena.face(arena.glazing, northA, northB, start, start + 2.12, 1.12, 3.95, 0.07)
  }
  arena.face(arena.trim, northA, northB, 24.2, 35.3, 4.30, 4.62, 0.58)

  arena.bays(footprint[1], footprint[2], 7.4, 10.4, 6.0, 0.60)
  arena.bays(footprint[11], footprint[12], 4.2, 8.0, 5.8, 0.57)
  arena.bays(footprint[8], footprint[9], 3.0, 8.8, 4.7, 0.74)
  await arena.save('dc-au-sports-center-bender-arena', 'Sports Center (Bender Arena)', 0xba9986,
    finish('au-roof-blue', 0x8bb3d2), finish('au-roof-red', 0xdc7877), finish('arena-roof-white', 0xf9f8f4))
}
