/**
 * James Scott Memorial Fountain, Belle Isle, Detroit (1925, Cass Gilbert,
 * sculpture by Herbert Adams; white Vermont marble): procedural, CC0-1.0.
 * bun generators/det-scott-fountain.ts
 *
 * Map frame: x, y, z up, metres, turned to the fountain's axis: +y runs
 * along bearing 65 (east-north-east), from the fountain to the seated
 * bronze statue of James Scott that faces it across the plaza; +x along
 * 155. The anchor is the centre of the basin, the centroid of OSM way
 * 107194267 (the central structure, 42.3350263, -82.9993263).
 *
 * Identity, in order: the great round lower basin with its low marble rim;
 * the stepped central island rising in tiers; the round drum carved with
 * relief panels; the pedestal with its figures and the wide shallow top
 * bowl; four recumbent marble lions on plinths at the diagonals; the seated
 * bronze James Scott on his granite pedestal at the head of the axis.
 *
 * Evidence:
 *  - plan: OSM relation/9146545 (James Scott Memorial Fountain, Cass
 *    Gilbert, 1925): outer member way/107194067 (the basin rim, marble,
 *    radius 16.6-17.5 m) and way/107194267 (building=yes, height 2.5, the
 *    central structure, 8.3 m across); node/6160033107 (the statue, 34.7 m
 *    from the centre at bearing 65). The relation's other members,
 *    way/657720548 and way/657720560, are the river landing 40-70 m west,
 *    not drawn.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid,
 *    read radially. Plaza ~3.9-4.0 m over the box minimum; over it: rim
 *    top ~0.6, water ~0.3, lower terrace ~1.0 (r 8-10 m), second tier
 *    ~1.7-2.0 (r 5-7 m), drum top 4.4 (r ~4.3 m), top bowl rim 7.3 (r
 *    ~2.6 m); the statue's head ~2.4 over its plaza (sparse).
 *  - published: 1925, Cass Gilbert; Herbert Adams's statue of Scott;
 *    Vermont marble (Wikipedia, "James Scott Memorial Fountain").
 *  - photos: tiers, drum and bowl proportions, the lions and their plinths,
 *    the statue's pose and pedestal, colours.
 *  Estimated: the lions' size and plinths, the tier outlines (drawn round;
 *    the real lower terrace has lobed basins), the pedestal figures, the
 *    statue's size.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - JSMFFULL.jpg, Mkrajenke12, CC BY-SA 4.0 (along the axis, from the west)
 *  - James_Scott_Fountain_-_Detroit_Michigan.jpg, Mikerussell, CC BY-SA 3.0
 *  - James_Scott_statue_and_fountain_-_Detroit_Michigan.jpg, Mikerussell,
 *    CC BY-SA 3.0 (statue, steps and fountain from the south-east)
 *  - James_Scott_Fountain.jpg, Drklinkert, CC BY-SA 4.0 (statue and fountain)
 *  - JSMFLOWERBASIN.jpg, Mkrajenke12, CC BY-SA 4.0 (the lower basins)
 * No look-only sources. No commercial imagery.
 *
 * Water is not drawn (the map draws the basin's water, OSM way/107194067 is
 * natural=water). The marble is floodlit at night, as on the illuminated
 * postcards. Elevation 0.
 *
 * Doubts: the lobed lower basins and the turtles, masks and dolphins are
 * simplified away; the statue's steps down to Fountain Drive are left to
 * the terrain.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cap, rect, save, walls, type XY } from './chi-aon-center'
import { lathe } from './sea-tacoma-union-station'

const ccw = (r: XY[]) => (r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) > 0 ? r : [...r].reverse())

/** A box turned by angle a (radians) about its centre (cx, cy). */
function obox(p: Part, cx: number, cy: number, a: number, hx: number, hy: number, z0: number, z1: number, top = true) {
  const c = Math.cos(a), s = Math.sin(a)
  const r = ccw(([[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]] as XY[]).map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c] as XY))
  walls(p, r, z0, z1)
  if (top) cap(p, r, z1)
}

/** A recumbent lion facing outward along angle a, lying on z0: body, haunch, raised head and mane. */
function lion(p: Part, cx: number, cy: number, a: number, z0: number) {
  const c = Math.cos(a), s = Math.sin(a)
  const at = (d: number): [number, number] => [cx + c * d, cy + s * d]
  obox(p, ...at(-0.15), a, 1.05, 0.45, z0, z0 + 0.65) // body
  obox(p, ...at(-0.75), a, 0.45, 0.5, z0, z0 + 0.8) // haunch
  obox(p, ...at(0.55), a, 0.4, 0.55, z0 + 0.3, z0 + 1.35) // mane
  obox(p, ...at(0.95), a, 0.3, 0.3, z0 + 0.65, z0 + 1.2) // muzzle
  obox(p, ...at(1.05), a, 0.32, 0.18, z0, z0 + 0.18) // paws
}

function build() {
  const marble = new Part(), relief = new Part(), bronze = new Part(), granite = new Part()

  // ------------------------------------------------ the lower basin's rim
  lathe(marble, 0, 0, [[17.3, 0], [17.3, 0.6], [17.45, 0.62], [17.45, 0.78], [16.55, 0.78], [16.55, 0.62], [16.7, 0.6], [16.7, 0.25]], 40)

  // ------------------------------------------------ the central island, in tiers
  lathe(marble, 0, 0, [[9.6, 0], [9.6, 0.95], [9.75, 1.0], [9.75, 1.25], [9.1, 1.25], [9.1, 0.95], [7.2, 0.95]], 32)
  lathe(marble, 0, 0, [[7.2, 0.95], [7.2, 1.75], [7.35, 1.8], [7.35, 2.0], [5.7, 2.0]], 32)
  lathe(marble, 0, 0, [[5.7, 2.0], [5.7, 2.3], [5.15, 2.3], [5.15, 2.6], [4.6, 2.6]], 32)
  // the drum, with carved panels between pilasters, and its lip
  lathe(marble, 0, 0, [[4.6, 2.6], [4.6, 2.85], [4.3, 2.95], [4.3, 4.05], [4.55, 4.15], [4.55, 4.45], [1.7, 4.45]], 32)
  for (let k = 0; k < 16; k++) {
    const a = ((k + 0.5) / 16) * 2 * Math.PI
    obox(relief, 4.3 * Math.cos(a), 4.3 * Math.sin(a), a, 0.12, 0.2, 2.95, 4.05)
  }
  for (let k = 0; k < 16; k++) {
    const a0 = (k / 16) * 2 * Math.PI + 0.06, a1 = ((k + 1) / 16) * 2 * Math.PI - 0.06
    // a recessed relief panel: a slightly darker flat face just proud of the drum
    const P = (a: number, z: number): V3 => [4.33 * Math.cos(a), 4.33 * Math.sin(a), z]
    const am = (a0 + a1) / 2
    relief.quad(P(a0 + 0.07, 3.1), P(am, 3.1), P(am, 3.9), P(a0 + 0.07, 3.9))
    relief.quad(P(am, 3.1), P(a1 - 0.07, 3.1), P(a1 - 0.07, 3.9), P(am, 3.9))
  }
  // the pedestal, its figures, the stem and the top bowl
  lathe(marble, 0, 0, [[1.7, 4.45], [1.7, 5.4], [1.3, 5.55], [0.85, 5.7], [0.85, 6.15], [1.1, 6.3], [2.0, 6.85], [2.75, 7.1], [2.75, 7.4], [2.45, 7.4], [1.2, 7.1], [0.0, 7.0]], 24)
  for (let k = 0; k < 4; k++) {
    const a = ((k + 0.5) / 4) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a)
    obox(marble, 1.95 * c, 1.95 * s, a, 0.35, 0.4, 4.45, 5.3)
    obox(marble, 2.05 * c, 2.05 * s, a, 0.22, 0.22, 5.3, 5.7)
    // the masks between them
    const b = (k / 4) * 2 * Math.PI
    obox(relief, 1.78 * Math.cos(b), 1.78 * Math.sin(b), b, 0.1, 0.35, 4.7, 5.3)
  }

  // ------------------------------------------------ four lions on plinths at the diagonals
  for (const deg of [45, 135, 225, 315]) {
    const a = (deg * Math.PI) / 180, r = 8.6, cx = r * Math.cos(a), cy = r * Math.sin(a)
    obox(marble, cx, cy, a, 1.55, 0.75, 0.95, 2.1)
    obox(marble, cx, cy, a, 1.65, 0.85, 2.1, 2.25)
    lion(marble, cx, cy, a, 2.25)
  }
  // urns at the cardinal points of the lower terrace
  for (const deg of [0, 90, 180, 270]) {
    const a = (deg * Math.PI) / 180
    lathe(marble, 9.35 * Math.cos(a), 9.35 * Math.sin(a), [[0.35, 1.25], [0.25, 1.45], [0.55, 1.9], [0.55, 2.0], [0.0, 2.0]], 8)
  }

  // ------------------------------------------------ James Scott, seated, facing the fountain (-y)
  {
    const Y = 34.7
    obox(granite, 0, Y, 0, 2.2, 2.7, 0, 0.45)
    obox(granite, 0, Y, 0, 1.55, 2.0, 0.45, 2.5)
    obox(granite, 0, Y, 0, 1.75, 2.2, 2.5, 2.75)
    // the chair, the figure, the head
    obox(bronze, 0, Y + 0.7, 0, 1.0, 0.35, 2.75, 5.75) // chair back
    obox(bronze, 0, Y + 0.05, 0, 1.0, 0.65, 2.75, 3.85) // seat and lap
    obox(bronze, 0, Y - 0.8, 0, 0.7, 0.4, 2.75, 3.75) // legs
    obox(bronze, 0, Y + 0.2, 0, 0.62, 0.45, 3.85, 5.15) // torso
    obox(bronze, 0, Y + 0.12, 0, 0.24, 0.26, 5.15, 5.65) // head
    for (const x of [-0.88, 0.88]) obox(bronze, x, Y - 0.05, 0, 0.14, 0.6, 3.85, 4.2) // arms of the chair
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.85)
  const marbleM = { ...finish('scott-marble', 0xdcd6ca), floodlight: lit }
  const reliefM = { ...finish('scott-marble-relief', 0xc6bfb1), floodlight: lit }
  return [
    { part: marble, material: marbleM },
    { part: relief, material: reliefM },
    { part: granite, material: finish('scott-granite', 0xb5beb2) },
    { part: bronze, material: finish('scott-bronze', 0x6c705f) },
  ]
}

if (import.meta.main) await save('det-scott-fountain', 'James Scott Memorial Fountain', [42.3350263, -82.9993263], 65, build(), 5000)
