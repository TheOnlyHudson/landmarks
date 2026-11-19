/**
 * Nebraska Hall, American University, Washington, DC. Measured outline
 * https://www.openstreetmap.org/way/38606608 . Rotated 34.26 degrees.
 * The residence and its 2013 addition form a mirrored pair along a single
 * spine, one enlarged cross wing at each end and a curved projecting front.
 * The contractor records brick and precast cladding and the 4-level section:
 * https://grunley.com/portfolio-project/american-university-nebraska-residence-hall/
 * AU's 2011 campus plan describes three stories to Nebraska Avenue and an
 * exposed lower fourth at the rear. Identical roof lines were required.
 * https://www.american.edu/finance/ppm/upload/campus-plan-document-for-web.pdf
 * Rear reference (2019), Ser Amantio di Nicolao, CC BY-SA 3.0:
 * https://commons.wikimedia.org/wiki/File:Rear_view_of_Nebraska_Hall_on_the_campus_of_American_University.jpg
 * Window rhythm, sills, cornice and brick color approximated. Grade
 * differences expose four floors at the low end. Positive roof returns
 * on the older cross wing are modeled as a single raised enclosure.
 * 2022 DC OCTO lidar, building-class returns above local ground P10:
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * Main roof 12.2 m, upper enclosure 16.5 m, base datum 119.1 m.
 */
import { CampusShell } from './dc-au-constitution-hall'
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { chamfer, finishGlb, prism, writeModel, type XY } from './sea-tacoma-union-station'

const hall = new CampusShell()
const brick = new Part()
hall.trim = hall.stone
const plan: XY[] = [
  [-7.86, -33.73], [-25.31, -33.83], [-25.3, -49.31], [-11.23, -49.29],
  [-11.13, -48.49], [-0.07, -48.49], [-0.05, -49.28], [23.62, -49.23],
  [23.16, -33.4], [3.69, -33.67], [3.63, -31.92], [3.56, -29.95],
  [5.46, -29.91], [5.18, -9.27], [3.77, -9.33], [3.85, -5.02],
  [8.68, -4.99], [9.37, -1.11], [9.7, 2.99], [9.35, 6.95],
  [8.35, 10.69], [3.61, 10.71], [3.57, 11.79], [4.45, 36.47],
  [3.54, 36.52], [3.58, 41.01], [25.33, 40.28], [25.59, 56.16],
  [13.59, 56.07], [13.6, 55.32], [5.33, 55.27], [5.29, 56.01],
  [-5.82, 55.92], [-5.62, 49.71], [-12.63, 49.71], [-12.57, 38.55],
  [-11.89, 38.54], [-11.86, 33.32], [-12.54, 33.32], [-12.41, 11.98],
  [-11.67, 11.98], [-11.72, 6.66], [-12.39, 6.66], [-12.27, -4.28],
  [-9.26, -4.32], [-9.19, -9.38], [-10.37, -9.36], [-10.09, -29.9],
  [-7.84, -29.9],
]
const ring = chamfer(plan, 0.14)
prism(hall.stone, null, ring, 0, 1.35)
prism(brick, null, ring, 1.35, 11.85)
prism(hall.trim, hall.roof, ring, 11.85, 12.2)
hall.mass([[-13.4, -41.9], [3.8, -41.9], [3.8, -36.4], [-13.4, -36.4]], 12.2, 16.5)
for (const [i, a] of plan.entries()) {
  const b = plan[(i + 1) % plan.length]
  const width = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (width < 3.6) continue
  const arc = i >= 16 && i <= 20
  for (let f = 0; f < 4; f++) {
    const sill = 0.66 + 3.08 * f
    if (arc && f === 0) continue
    hall.bays(a, b, sill, sill + 1.61, arc ? 3.4 : 3.8, arc ? 0.81 : 0.55)
  }
}
hall.lobby(plan[18], plan[19], 2.9)
await writeModel('dc-au-nebraska-hall', finishGlb('Nebraska Hall', [
  { part: brick, material: finish('brick', 0xc9987c) }, { part: hall.stone, material: PALETTE.stone },
  { part: hall.roof, material: PALETTE.roof },
  { part: hall.window, material: PALETTE.window }, { part: hall.spandrel, material: PALETTE.metal },
  { part: hall.entrance, material: PALETTE.entrance },
], {}))
