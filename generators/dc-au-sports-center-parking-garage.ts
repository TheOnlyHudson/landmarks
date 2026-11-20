/**
 * Sports Center Parking Garage, American University, Washington, DC.
 * Ground plan and centroid from OSM, May 22, 2026, in the local 33.5° frame.
 * https://www.openstreetmap.org/way/38075679 (OpenStreetMap contributors, ODbL).
 * Height evidence: DC OCTO 2022 airborne lidar, NOAA Digital Coast dataset 9837,
 * 1 m classified-building DSM plus bare earth DEM (NAVD88 metres).
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/blob/456fd09d67aae857907e8c2b7fa6c19332734bd5/data/metadata/lidar_sources.md
 * Seven parking levels and the sports complex: https://aueagles.com/sports/2019/8/15/information-facilities-bender-arena.aspx?id=18
 * Building DSM median 22.1 m above lower-grade datum 111.2 m, with
 * stair/elevator heads near 26 m. AU lists seven levels. Rendered as an open
 * concrete frame with actual inset bays, piers and an unglazed top deck.
 * Slab spacing, pier spacing, circulation core positions and colors estimated;
 * car-level rooftop lidar reflections were excluded from the modeled deck.
 * Upper deck guard edges and striping represent parking use. Positions of
 * the ground portals follow the driveway tunnel and pedestrian passage:
 * https://www.openstreetmap.org/way/38077281
 * https://www.openstreetmap.org/way/394044217
 * https://aueagles.com/sports/2020/3/20/campus-map-directions.aspx
 */
import { capRing, rect, prism, type XY } from './sea-tacoma-union-station'
import { finish } from './palette'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const garage = new SportsShell()
const footprint: XY[] = [
  [-17.48, -37.81], [5.15, -37.64], [9.51, -37.6], [17.58, -37.53], [18.67, -19.27],
  [18.39, 22.82], [19.52, 36.64], [14.58, 37.08], [-14.5, 37.82], [-18.3, 37.81],
  [-18.37, 24.74], [-18.42, 13.57], [-18.43, -14.34], [-18.45, -37.82],
]
// The concrete cores are inset so the voids between the exterior piers stay open.
const deck = 22.1
const tiers = 7
for (let level = 0; level <= tiers; level++) {
  const top = level === 0 ? 0.45 : level * deck / tiers
  prism(garage.wall, garage.roof, footprint, Math.max(0, top - 0.45), top)
  if (level > 0) {
    // The precast spandrels guard the perimeter of each open deck.
    for (let edge = 0; edge < footprint.length; edge++) {
      const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
      const length = Math.hypot(b[0] - a[0], b[1] - a[1])
      const dx = (a[1] - b[1]) / length * 0.24, dy = (b[0] - a[0]) / length * 0.24
      prism(garage.wall, garage.trim, [a, b, [b[0] + dx, b[1] + dy], [a[0] + dx, a[1] + dy]], top, top + 0.72)
    }
  }
}

for (let edge = 0; edge < footprint.length; edge++) {
  const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy)
  const nx = -dy / len, ny = dx / len
  const bays = Math.max(1, Math.round(len / 7.6))
  for (let i = 0; i < bays; i++) {
    const t = (i + 0.5) / bays
    const x = a[0] + dx * t + nx * 0.70, y = a[1] + dy * t + ny * 0.70
    const driveway = (edge === 0 && x < -9.0) || (edge === 12 && y > -29.0 && y < -19.0)
    const passage = edge === 2 && x < 12.5
    prism(garage.trim, null, rect(x - 0.48, y - 0.48, x + 0.48, y + 0.48), driveway || passage ? deck / tiers : 0, deck)

  }
}
// Lidar section shows a pair of heads at the north end and one at the southeast.
for (const [x, y] of [[-15.3, 28.2], [15.1, 25.7], [14.8, -28.0]]) {
  garage.mass(rect(x - 1.85, y - 4.1, x + 1.85, y + 4.1), 0, 26.2)
}
// Keep the top deck visibly open to sky. Marking widths are exaggerated slightly
// at map scale; the parking bays and the stair approach share the central aisle.
for (const side of [-1, 1]) {
  for (let y = -32; y <= 33; y += 2.75) {
    const x = side * 10.0
    capRing(garage.trim, rect(x - 2.4, y, x + 2.4, y + 0.15), deck + 0.035)
  }
}
prism(garage.accent, null, rect(-4.5, -30.0, 4.5, 30.0), 0, deck - 0.45)
await garage.save('dc-au-sports-center-parking-garage', 'Sports Center Parking Garage', 0xd2bea6, finish('garage-interior', 0x716f6b))
