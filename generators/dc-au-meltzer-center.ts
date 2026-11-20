/**
 * Alan and Amy Meltzer Center for Athletic Performance, American University, Washington, DC.
 * Ground plan and centroid from OSM, May 22, 2026, in the local 33.5° frame.
 * https://www.openstreetmap.org/way/1509229469 (OpenStreetMap contributors, ODbL).
 * Building, photovoltaic array and green roof: https://www.american.edu/about/sustainability/buildings/meltzer-athletic-center.cfm
 * Published design heights and floor counts: https://www.american.edu/communityrelations/campus-plan/meltzer-center-feedback-and-reponses.cfm
 * May 2026 mapping records the completed building and adjacent SCAN as
 * separate ways. Two stories, with high gym volume and a roof approximately
 * 51 feet above design grade in the university's published response.
 * Masonry, glazing, a roof garden, solar array and screened plant are documented.
 * Roof zones, panel grouping, wall details and colors are estimates. The 2022
 * lidar flight predates construction. The zoning application's material schedule,
 * roof-zone labels, gym volume, main canopy and acoustic screens informed the
 * massing. Individual tiers, north roof line, fascia and mullions are schematic.
 * https://www.american.edu/communityrelations/campus-plan/upload/american-university-further-processing-of-application-20-31b.pdf
 * https://www.american.edu/finance/news/meltzer-center-first-au-net-zero-facility-and-on-track-to-leed-platinum.cfm
 * No current open facade imagery established.
 */
import { rect, prism, type XY } from './sea-tacoma-union-station'
import { finish } from './palette'
import { SportsShell } from './dc-au-sports-center-bender-arena'

const center = new SportsShell()
const footprint: XY[] = [
  [49.8, -16.4], [33.54, -16.9], [34.09, 24.71], [-28.32, 24.81], [-28.89, 4.57],
  [-38.56, 5.69], [-37.94, -24.36], [-10.28, -24.87], [-9.51, -21.09], [-2.79, -21.49],
  [-3.32, -17.46], [16.84, -17.84], [15.84, -24.85], [33.5, -23.37], [32.79, -20.56],
  [48.69, -20.89],
]
const roof = 15.4
// Two storeys of support space wrap a tall clear-span court. The narrow
// field-facing entrance projects from the middle of the stepped south edge.
const lowerRoof = 6.35, galleryRoof = 11.8
center.mass(footprint, 0, lowerRoof)
const gallery: XY[] = [
  [33.5, -23.37], [33.54, -16.9], [34.09, 24.71], [-28.32, 24.81],
  [-28.89, 4.57], [-28.89, -24.53], [-10.28, -24.87], [-9.51, -21.09],
  [-2.79, -21.49], [-3.32, -17.46], [16.84, -17.84], [15.84, -24.85],
]
center.mass(gallery, lowerRoof, galleryRoof)
const gym: XY[] = [[-28.6, -6.7], [33.65, -6.7], [34.09, 24.71], [-28.32, 24.81]]
center.mass(gym, galleryRoof, roof)
prism(center.roof, center.detail, rect(-26.8, -16.5, 31.9, -7.0), galleryRoof, galleryRoof + 0.08)
prism(center.roof, center.detail, rect(-36.4, -21.9, -29.5, 2.6), lowerRoof, lowerRoof + 0.08)
center.solar(-25.3, -5.4, 5, 5, roof + 0.18, 8.9, 4.5)
const screen = rect(24.5, -4.5, 31.3, 17.8)
prism(center.trim, center.roof, screen, roof, roof + 2.3)
for (const side of [1, 3]) center.bays(screen[side], screen[(side + 1) % 4], roof + 0.35, roof + 1.96, 4.8, 0.88, center.roof)

// The court's north wall has a high window band. Its field-facing side
// rises above the vegetated roof of the lower gallery.
center.bays(gym[2], gym[3], 10.1, 13.9, 6.5, 0.61)
center.bays(gym[0], gym[1], 12.45, 14.35, 8.1, 0.68)
for (const edge of [2, 3, 4, 5, 6, 11, 12]) {
  const a = footprint[edge], b = footprint[(edge + 1) % footprint.length]
  center.bays(a, b, 0.95, 5.15, 5.1, edge === 6 ? 0.76 : 0.38)
}
for (const edge of [6, 9, 10]) {
  const a = gallery[edge], b = gallery[(edge + 1) % gallery.length]
  center.bays(a, b, 6.95, 10.8, 4.3, 0.72)
}
const entryA = footprint[10], entryB = footprint[11]
center.face(center.roof, entryA, entryB, 0.15, 19.85, 0.30, 10.7, 0.022)
for (const [sill, head] of [[0.55, 4.7], [5.3, 10.4]]) {
  center.bays(entryA, entryB, sill, head, 3.4, 0.93)
}
center.face(center.roof, entryA, entryB, 0.05, 19.95, 10.72, 11.32, 2.2)
for (const start of [1.9, 8.5, 15.1]) {
  center.face(center.trim, entryA, entryB, start, start + 0.46, 0.22, 10.71, 0.12)
}
await center.save('dc-au-meltzer-center', 'Alan and Amy Meltzer Center for Athletic Performance', 0xdbccb4, undefined, finish('planted-roof', 0x99a380))
