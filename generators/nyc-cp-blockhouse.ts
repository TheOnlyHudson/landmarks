/**
 * Blockhouse No. 1, Central Park, on the rock outcrop above the north end
 * of the park (1814, a fort of the War of 1812 line from the Hudson to the
 * Harlem River) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-cp-blockhouse.ts
 *
 * Frame (mesh.ts map frame): x east, y north, z up, metres, bearing 0
 * (the outline is square to north). Anchor: the centroid of OSM
 * way/39243913 (building=fort, "Blockhouse No. 1"), which this model
 * replaces. z = 0 is the ground at the foot of the west wall, the lowest
 * under it.
 *
 * Evidence
 * - OSM (ODbL): the outline way/39243913, 10.1 m by 10.0 m.
 * - HABS NY-443 (Library of Congress, public domain), Frank D. Jones,
 *   sheet 1 of 2: plan, section and four elevations,
 *   https://commons.wikimedia.org/wiki/File:Block_Houses_(Nos._1_and_2),_Central_(110th_Street)_and_Morningside_Parks_(123rd_Street),_New_York,_New_York_County,_NY_HABS_NY,31-NEYO,33-_(sheet_1_of_2).png
 *   Published there: 34 ft 0 in by 33 ft 9 in outside (10.4 by 10.3 m);
 *   walls about 4 ft 3 in (1.3 m) thick, pierced by splayed loopholes, two
 *   a side; the walls 20 ft (6.1 m) high on the west, 19 ft south, 18 ft
 *   east and 17 ft north over the rock; a coping 10½ in thick; the one door
 *   (3 ft wide) in the west wall about two-thirds of the way south, up a
 *   flight of stone steps; the floor inside about 1.2 m over the west
 *   ground.
 * - USGS 3DEP lidar NY_NewYorkCity (2017 flight), 0.5 m crop: the wall
 *   tops 14.5–14.9 m over a lowest ground of 8.4 m by the west wall (6.3 m
 *   high, matching the drawings with the coping); the inside 10.3–10.7 m;
 *   the flagpole's top 23.8 m (15.4 m over the west ground). The lidar's
 *   walls sit about 1 m south of OSM's outline; OSM was kept.
 * - Photos (Wikimedia Commons; copies in
 *   landmarks-scratch/nyc-parks-2/work/nyc-cp-blockhouse/photos):
 *   Sylius, "New York City Blockhouse full view.JPG", public domain,
 *     https://commons.wikimedia.org/wiki/File:New_York_City_Blockhouse_full_view.JPG
 *     (a wall square on: rubble fieldstone, grey below and red-brown
 *     brownstone in the upper courses, a flat coping, the white flagpole);
 *   Гатерас, "Blockhouse New York entrance.JPG", public domain,
 *     https://commons.wikimedia.org/wiki/File:Blockhouse_New_York_entrance.JPG
 *     (the west door: an iron grille under a brick head, stone steps);
 *   Sylius, "New York City Blockhouse & surrounding terrain.JPG", public domain,
 *     https://commons.wikimedia.org/wiki/File:New_York_City_Blockhouse_%26_surrounding_terrain.JPG
 *     (the walls on the bare schist outcrop).
 * - Estimated: the grey lower band to 2.6 m; the loopholes' outer openings
 *   0.35 m square at about 3.1 m.
 *
 * Not modelled: the rock outcrop (the terrain's), the tablet over the
 * door, the splays of the loopholes inside, the iron fence on the rock.
 *
 * Doubts: the loopholes' positions are read from the small HABS
 * elevations; the colour band is a simplification of mixed stone.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { bevelBox, box, qn } from './nyc-greyshot-arch'

const grey = new Part(), brown = new Part(), cope = new Part(), dark = new Part(), pole = new Part()
const HX = 5.05, HY = 5.0, T = 1.3, WALL = 5.85, CT = 0.27, BAND = 2.6

/** A ring of four walls from z0 to z1, outer half-sizes HX, HY, thickness t, with grown edges `g`. */
function walls(p: Part, z0: number, z1: number, g = 0) {
  const x0 = -HX - g, x1 = HX + g, y0 = -HY - g, y1 = HY + g, ix = HX - T - g, iy = HY - T - g
  box(p, x0, x1, y1 - T - 2 * g, y1, z0, z1)
  box(p, x0, x1, y0, y0 + T + 2 * g, z0, z1)
  box(p, x0, -ix, -iy, iy, z0, z1)
  box(p, ix, x1, -iy, iy, z0, z1)
}
walls(grey, 0, BAND)
walls(brown, BAND, WALL)
walls(cope, WALL, WALL + CT, 0.08)

// loopholes: two a side, small dark squares on the outer faces
const port = (cx: number, cy: number, nx: number, ny: number) => {
  const h = 0.175, z0 = 2.95, z1 = 3.3, o = 0.03
  const a: V3 = [cx - ny * h + nx * o, cy + nx * h + ny * o, z0], b: V3 = [cx + ny * h + nx * o, cy - nx * h + ny * o, z0]
  qn(dark, a, b, [b[0], b[1], z1], [a[0], a[1], z1], [nx, ny, 0])
}
for (const t of [-2.4, 2.4]) {
  port(t, HY, 0, 1); port(t, -HY, 0, -1); port(HX, t, 1, 0)
}
port(-HX, 2.2, -1, 0)

// the west door, up its flight of stone steps, under a brick head
const DY = -1.4, DW = 0.46, SILL = 1.25
qn(dark, [-HX - 0.03, DY - DW, SILL], [-HX - 0.03, DY + DW, SILL], [-HX - 0.03, DY + DW, SILL + 2.0], [-HX - 0.03, DY - DW, SILL + 2.0], [-1, 0, 0])
box(brown, -HX - 0.06, -HX + 0.02, DY - DW - 0.2, DY + DW + 0.2, SILL + 2.0, SILL + 2.3)
for (let k = 0; k < 6; k++) {
  const z1 = SILL * (6 - k) / 6, x = -HX - 0.32 * (k + 1)
  box(cope, x, -HX, DY - 0.62, DY + 0.62, 0, z1)
}

// the flagpole in the middle, white, with its ball
const pr: [number, number][] = [[0.16, 1.2], [0.11, 15.1], [0.18, 15.15], [0.18, 15.4], [0.05, 15.45]]
{
  const n = 8, rings = pr.map(([r, z]) => Array.from({ length: n }, (_, k): V3 => [r * Math.cos((2 * Math.PI * k) / n), -1.0 + r * Math.sin((2 * Math.PI * k) / n), z]))
  pole.loft(rings)
  pole.cap(rings[rings.length - 1], true)
}
bevelBox(cope, 0, -1.0, 0.45, 0.45, 0.8, 1.3, 0.08)

finishModel('Blockhouse No. 1', 'nyc-cp-blockhouse', [
  { part: grey, material: { name: 'fieldstone', color: 0xa39e94, roughness: 0.95 } },
  { part: brown, material: { name: 'brownstone', color: 0xa28f85, roughness: 0.95 } },
  { part: cope, material: { name: 'coping', color: 0x8f8a84, roughness: 0.9 } },
  { part: dark, material: { name: 'openings', color: 0x4a4f57, roughness: 0.8 } },
  { part: pole, material: { name: 'flagpole', color: 0xe9e7e2, roughness: 0.5 } },
], { bearing: 0, osm: 'way/39243913', height: 15.45 }, 5000)
