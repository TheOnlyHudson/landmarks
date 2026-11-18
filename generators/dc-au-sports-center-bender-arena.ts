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
 * Surveyed roof breaks were simplified to broad volumes. Solar panel count
 * and arrangement, facade bays and finish colors are graphic estimates.
 * No openly licensed current close-range exterior photographs established.
 */
import { Part } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { capRing, flatShape, outward, prism, rect, finishGlb, writeModel, type XY } from './sea-tacoma-union-station'

/** Single-sided grouped glazing and common flat-roof details. Local y points north. */
export class SportsShell {
  wall = new Part()
  roof = new Part()
  trim = new Part()
  glazing = new Part()
  accent = new Part()
  detail = new Part()

  mass(outline: XY[], base: number, top: number) {
    prism(this.wall, null, outline, base, top - 0.36)
    prism(this.trim, this.roof, outline, top - 0.36, top)
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

  solar(x: number, y: number, columns: number, rows: number, z: number, width: number, depth: number) {
    // Group neighboring modules into tables, leaving visible maintenance aisles.
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < columns; i++) {
        const x0 = x + i * (width + 0.62), y0 = y + j * (depth + 0.9)
        capRing(this.accent, rect(x0, y0, x0 + width, y0 + depth), z)
      }
    }
  }

  async save(id: string, title: string, wallColor: number, accent = finish('photovoltaic', 0x586c80, 0.4), detail: Swatch = PALETTE.entrance) {
    await writeModel(id, finishGlb(title, [
      { part: this.wall, material: finish('campus-masonry', wallColor) },
      { part: this.roof, material: PALETTE.roof },
      { part: this.trim, material: PALETTE.trim },
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
  arena.mass(arenaRoof, 4.8, 15.8)
  arena.mass(poolWing, 4.8, 10.6)
  arena.mass(southWing, 4.8, 14.1)
  arena.mass(eastWing, 10.6, 16.8)
  const eastTower: XY[] = [
  [53.05, 20], [42, 20], [42, 8], [52.99, 8],
]
  arena.mass(eastTower, 16.8, 27.4)
  arena.mass(rect(40.0, -3.5, 47.0, 8.0), 14.1, 30.7)

  arena.solar(-38, -33, 4, 10, 15.92, 10.2, 6.0)
  for (const y of [-15.8, 19]) {
    prism(arena.roof, arena.trim, rect(-36, y, -25, y + 2.2), 15.8, 17.75)
    prism(arena.roof, arena.trim, rect(-17, y, -6, y + 2.2), 15.8, 17.75)
  }
  arena.bays(footprint[1], footprint[2], 7.4, 10.4, 6.0, 0.60)
  arena.bays(footprint[11], footprint[12], 4.2, 8.0, 5.8, 0.57)
  arena.bays(footprint[8], footprint[9], 3.0, 8.8, 4.7, 0.74)
  await arena.save('dc-au-sports-center-bender-arena', 'Sports Center (Bender Arena)', 0xba9986)
}
