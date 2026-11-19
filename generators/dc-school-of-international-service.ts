/**
 * American University, School of International Service, Washington, DC.
 * Original procedural model by Salty Pancakes and OpenAI Codex (GPT-6).
 *
 * OSM way/48082911, from the 2021-01-13 Geofabrik DC snapshot preserved in
 * https://github.com/rustprooflabs/pgosm-flex/tree/main/tests/data .
 * Approximate area centroid -77.0884149, 38.9357380. The two wings run
 * along Nebraska Avenue at bearing 34 degrees. In this rotated frame the
 * avenue is on the +x side, the main entrance court at the +y end.
 * The outline gives the 33 m body width, 71.5 m length, the projecting
 * street wing and the recessed glazed link. It has no height tags.
 *
 * Jeff Watts / American University, CC BY-SA 3.0 (oblique aerial):
 * https://commons.wikimedia.org/wiki/File:American_University_School_of_International_Service_building.jpg
 * Shows pale masonry, the glazed spine with a projecting metal roof,
 * the bowed street bay and a pair of long roofs with collectors.
 * Herrperry123, CC BY-SA 4.0 (street entrance):
 * https://commons.wikimedia.org/wiki/File:School_of_International_Service_Building.jpg
 * Shows the vertical slot beside the pale end wall, bronze entrance surround,
 * three upper rows of windows and projecting shades. Public building facts:
 * https://www.american.edu/about/sustainability/buildings/school-of-international-service.cfm
 *
 * Heights (17.2 m street eave, 20.4 m atrium crest), curvature, panels,
 * shade depth, collector layout and roof setbacks are estimates scaled
 * from those photos. The campus-side elevation is simplified. The model
 * represents above-ground architecture only. No measured night lighting.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { block, cbox, panel, rect, save, type Side } from './dc-white-house'

const masonry = new Part(), glazing = new Part(), bronze = new Part()
const roof = new Part(), skylight = new Part(), collectors = new Part()
const parapet = 17.2

function wing(x0: number, x1: number, y0: number, y1: number, h: number) {
  cbox(masonry, rect(x0, x1, y0, y1), 0, h, { c: 0.18, b: 0.12, top: roof })
}

// A glazed spine connects the parallel wings. The street wing steps back
// around the glazed entrance before projecting beyond the campus wing.
wing(-17.1, -3.4, -32.6, 25.4, 16.6)
wing(1.6, 15.8, -32.6, 17.5, parapet)
wing(1.6, 12.65, 17.5, 24.8, 16.7)
wing(-1.8, 15.9, 24.8, 38.7, parapet)
cbox(glazing, rect(-3.4, 1.6, -32.6, 24.8), 0, 17.7)
cbox(glazing, rect(-4.3, -1.8, 24.8, 32.4), 0, 18.7)

// The corners of the sloping clerestory remain visible above both roof decks.
for (const [y0, y1, h] of [[-31.4, 19.2, 19.4], [19.2, 32.8, 20.4]]) {
  const x0 = -4.5, x1 = 2.1
  cbox(skylight, rect(x0 + 0.3, x1 - 0.3, y0, y1), 16.5, h - 0.5)
  const lower = (x: number) => h - 0.12 * (x - x0)
  const cap = (offset: number): V3[] => [
    [x0, y0, lower(x0) + offset], [x1, y0, lower(x1) + offset],
    [x1, y1, lower(x1) + offset], [x0, y1, lower(x0) + offset],
  ]
  bronze.loft([cap(-0.35), cap(0)])
  roof.cap(cap(0), true)
  bronze.cap(cap(-0.35), false)
}

// A shallow arc rises out of the straight masonry under the street windows.
const curved: [number, number][] = []
for (let i = 0; i <= 12; i++) {
  const t = i / 12
  curved.push([15.8 + 1.85 * Math.sin(Math.PI * t), -10.5 + t * 20])
}
for (let i = 1; i < curved.length; i++) {
  const [a, b] = [curved[i - 1], curved[i]]
  const p = (v: number[], z: number): V3 => [v[0], v[1], z]
  masonry.quad(p(a, 0), p(b, 0), p(b, parapet), p(a, parapet))
  const ya = a[1], yb = b[1]
  roof.quad([15.74, ya, parapet], p(a, parapet), p(b, parapet), [15.74, yb, parapet])
}

// Collector racks and a flat light-coloured strip beside the clerestory
// give the long, shallow roofs their characteristic divided appearance.
for (const [x0, x1, base] of [[-15.8, -7, 16.6], [4.5, 13.9, parapet]]) {
  for (const y0 of [-29, -18.5, -8, 2.5]) {
    const low = base + 0.12, high = base + 1.2
    const deck: V3[] = [[x0, y0, low], [x1, y0, low], [x1, y0 + 9.7, high], [x0, y0 + 9.7, high]]
    collectors.loft([deck.map(([x, y]) => [x, y, base + 0.04]), deck])
    collectors.cap(deck, true)
  }
}

// Broad glazed openings, with the bronze solar shades set above the glass.
function bays(side: Side, face: number, start: number, end: number, count: number,
  sill: number, head: number, shaded = false) {
  const pitch = (end - start) / count
  for (let i = 0; i < count; i++) {
    const a = start + pitch * i + 0.35, b = start + pitch * (i + 1) - 0.35
    panel(glazing, side, face, a, b, sill, head)
    if (shaded) block(bronze, side, face, a - 0.1, b + 0.1, head - 0.23, head + 0.14, 0.8)
  }
}

for (const z of [5.0, 9.0, 13.0]) {
  bays('e', 15.8, -31.8, -10.6, 4, z, z + 2.7, true)
  bays('e', 15.8, 9.7, 17.1, 2, z, z + 2.7)
  bays('e', 15.9, 25.35, 38.2, 3, z, z + 2.7, true)
  bays('w', -17.1, -32.1, 24.9, 10, z, z + 2.6)
  bays('n', 25.4, -16.8, -4.0, 3, z, z + 2.6, true)
  bays('s', -32.6, -16.6, -3.8, 3, z, z + 2.6)
  bays('s', -32.6, 2.0, 15.2, 3, z, z + 2.6, true)
  // Three banks of windows turn around the curved limestone wall.
  for (let bay = 0; bay < 3; bay++) {
    for (let j = 0; j < 3; j++) {
      const a = curved[4 * bay + j], b = curved[4 * bay + j + 1]
      const face = (v: number[], height: number): V3 => [v[0] + 0.04, v[1], height]
      glazing.quad(face(a, z), face(b, z), face(b, z + 2.7), face(a, z + 2.7))
    }
  }
}

// The tall, mostly blank end wall frames a narrow vertical ribbon on its
// atrium side. Immediately behind it a stair window hangs in a bronze frame.
panel(glazing, 'n', 38.7, -0.2, 3.5, 3.2, 16.9)
for (const z of [7.2, 11.1, 15]) block(bronze, 'n', 38.7, -0.28, 3.58, z, z+0.28, 0.23)
panel(glazing, 'e', 12.65, 17.6, 24.6, 2.4, 16.5)
for (const z of [6.2, 10.1, 14.0]) block(bronze, 'e', 12.65, 17.5, 24.7, z, z+0.26, 0.38)
for (const y of [17.7, 24.25]) {
  cbox(bronze, rect(12.66, 13.55, y, y+0.38), 3.0, 17.85, { b: 0.08 })
}
cbox(bronze, rect(12.6, 13.6, 17.65, 24.8), 17.25, 17.85, { b: 0.12, bottom: true })

// At campus level the glazed entrance sits between the wings. The extended
// clerestory roof shades the doors; its outer frame is open below the beam.
cbox(bronze, rect(-4.9, 1.9, 31.7, 34.2), 18.65, 19.25, { b: 0.1, bottom: true })
cbox(bronze, rect(-4.85, -4.32, 33.15, 34.1), 2.3, 18.7)
panel(glazing, 'n', 32.4, -4.2, -1.9, 2.6, 6.2)
for (const z of [6.1, 10.0, 13.9, 17.6]) block(bronze, 'n', 32.4, -4.3, -1.8, z, z+0.22, 0.23)
panel(glazing, 'w', -1.8, 32.6, 38.35, 4.0, 16.8)
for (const z of [7.2, 11.1, 15.0]) block(bronze, 'w', -1.8, 32.6, 38.35, z, z + 0.26, 0.25)
cbox(bronze, rect(-2.5, 0.0, 24.5, 39.7), 17.15, 17.74, { b: 0.12, bottom: true })
bays('e', 15.8, -21.5, -11.2, 2, 1.8, 4.1)
bays('e', 15.9, 25.8, 37.8, 3, 2.3, 4.1)

await save('dc-school-of-international-service', 'School of International Service', [
  { part: masonry, material: PALETTE.stone }, { part: glazing, material: PALETTE.window },
  { part: bronze, material: finish('bronze-sunshades', 0x826754) },
  { part: roof, material: finish('light-roof', 0xc7c7bf) },
  { part: skylight, material: PALETTE.glass },
  { part: collectors, material: finish('solar-collector', 0x565f65) },
], { bearing: 34, osm: 'way/48082911' })
