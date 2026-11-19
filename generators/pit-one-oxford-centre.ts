/**
 * One Oxford Centre, Pittsburgh (Hellmuth, Obata & Kassabaum, 1983)
 * — original procedural geometry, CC0-1.0.
 * bun generators/pit-one-oxford-centre.ts
 *
 * Map frame turned to the building: +y along bearing 26.5 (Grant Street's
 * grid), +x along 116.5, z up, metres. BEARING 26.5: the OSM outline's long
 * edges run at 26.5/206.5 and 116.3/296.4°, and the four towers' faces follow.
 * Origin = centroid of the OSM outline way/203320241, 40.438027, -79.998575.
 *
 * Identity, in order: four octagonal towers locked together in a pinwheel,
 * stepping up 155 → 171 → 171 → 186 m, the tallest at the north-west; the
 * silver aluminium and blue-grey glass skin in strong horizontal ribbons;
 * the dark double band of the mechanical floors at mid height running round
 * every tower; the small set-back top on each tower; the low retail podium.
 *
 * Evidence
 * - OSM: outline way/203320241 (4 levels, the podium), tower parts
 *   way/743288602 (height 187.5, 46 levels, north-west), way/743288603
 *   (42 levels, north-east), way/743288604 (42 levels, south-west),
 *   way/743288605 (38 levels, south-east). Wikidata Q3497523.
 * - USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019), 0.5 m grid read in
 *   this frame (SCRATCH/work/pit-one-oxford-centre/lidar.json), heights above
 *   the lowest ground under the outline (west; the site rises ≈ 4 m to the
 *   east): north-west tower 186 m; north-east and south-west 171-172 m;
 *   south-east 155-156 m (a 160 m strip on its north edge, its top storey);
 *   the podium 21-23 m, its north strip 16 m. The towers' plans match the OSM
 *   parts within a metre and are drawn from them.
 * - Published: 615 ft (187.5 m), 46 floors, aluminium-and-glass octagonal
 *   towers (Wikipedia "One Oxford Centre").
 * - Photos (Wikimedia Commons): "One Oxford Center, Pittsburgh. 2020-02-18.jpg",
 *   "One Oxford Centre, 2015-03-17, 01.jpg", "One Oxford Centre, 2021-05-11,
 *   01.jpg", "One Oxford Centre, Pittsburgh, 2020-06-29.jpg" and "One Oxford
 *   Centre and Grant Building from South Side Slopes, 2022-09-27.jpg"
 *   (Cbaile19, CC0) — the pinwheel of towers from the south, west and east,
 *   the ribbons, the mechanical bands, the stepped tops; "OneOxfordCenter.jpg"
 *   (TheZachMorrisExperience, CC BY-SA 3.0) and "Oxford Center
 *   (757196905).jpg" (KitAy, CC BY 2.0) — from the street, the colours.
 *   No commercial imagery.
 *
 * Estimated: the ribbons grouped three storeys a band (the real ones are one
 * storey each), glass ≈ 10 m and aluminium ≈ 2.3 m, the aluminium a
 * silver-blue close to the glass so the skin reads as one silver-blue glass
 * with fine ribbons (review round 2), the glass running edge to edge round
 * every chamfer; the mechanical band's
 * height (two dark bands at 100-107 m, about 55% of the tallest tower) from the photos; the set-back tops
 * (1.5 m in, the top 6 m); colours from the daylight photos (the glass a
 * light sky grey-blue, the aluminium a cool silver). Left out: the podium's
 * shopfronts and entrance canopies, rooftop plant.
 *
 * Night: the ribbons are `window-2` (they glow); the rest stays unlit.
 *
 * Review round 2: the OSM tower parts were checked against the 0.5 m lidar.
 * The parts overlap one another by 4-6 m, as the roofs do in lidar (no gap
 * between any two towers at roof level), and the four re-entrant notches
 * where they meet match within about a metre: west 3-3.5 m deep, north
 * ≈ 4 m, east ≈ 2.5-3 m, south ≈ 3 m, each 5-8 m wide. So the massing was
 * kept; the cluster now reads as one because the glass runs edge to edge
 * round every chamfer and into the notches, and the spandrels are thinner
 * and close to the glass tone.
 *
 * Doubts: the podium's north and east faces are lightly photographed;
 * the mechanical band's level on the shorter towers is assumed the same as
 * on the tallest (it reads so in every photo).
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, panel, save, walls, type XY } from './chi-aon-center'

const ID = 'pit-one-oxford-centre'
const ANCHOR: [number, number] = [40.438027, -79.998575]
const BEARING = 26.5

// OSM parts in this frame, counter-clockwise; with their lidar heights.
const TOWERS: { ring: XY[]; h: number }[] = [
  { h: 186, ring: [[-32.3, 3.5], [-23.3, -5.7], [-7.7, -5.9], [-3.4, -1.7], [-3.2, 14.0], [-12.8, 22.8], [-27.4, 22.6], [-32.2, 18.1]] },
  { h: 171.5, ring: [[-5.4, 22.5], [-9.0, 19.0], [-8.5, 0.0], [-7.5, -1.0], [10.8, -0.9], [14.3, 3.1], [14.6, 17.9], [9.7, 22.6]] },
  { h: 171.5, ring: [[-7.5, -1.0], [-8.5, 0.0], [-27.2, 0.2], [-31.8, -4.3], [-31.8, -19.6], [-27.4, -24.1], [-12.3, -24.2], [-7.6, -19.4]] },
  { h: 156, ring: [[10.3, -23.8], [14.6, -19.6], [15.1, -4.3], [9.6, 0.2], [-7.8, 0.1], [-8.8, -0.9], [-8.9, -20.4], [-4.8, -24.2]] },
]
const PODIUM: XY[] = [[-35.8, -25.4], [-27.0, -25.2], [30.5, -25.1], [39.0, -16.2], [39.0, 3.0], [34.8, 6.7], [34.9, 22.8], [19.5, 22.8], [15.7, 26.3], [-35.8, 26.0]]

const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
const ccw = (r: XY[]) => (area(r) > 0 ? r : [...r].reverse())

/** Horizontal ribbons on every face of a ring: bands from `z0` to `z1`, n of them. */
function ribbons(win: Part, r: XY[], z0: number, z1: number, n: number, gap: number, skip: [number, number][] = [], end = 0.5) {
  const step = (z1 - z0) / n
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2.5) continue
    for (let k = 0; k < n; k++) {
      const za = z0 + k * step + gap / 2, zb = z0 + (k + 1) * step - gap / 2
      if (skip.some(([s0, s1]) => zb > s0 && za < s1)) continue
      panel(win, a, b, end, L - end, za, zb)
    }
  }
}
function band(p: Part, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1) continue
    panel(p, a, b, 0.2, L - 0.2, z0, z1, 0.05)
  }
}
function tread(p: Part, o: XY[], i: XY[], z: number) {
  for (let k = 0; k < o.length; k++) {
    const j = (k + 1) % o.length
    p.quad([o[k][0], o[k][1], z], [o[j][0], o[j][1], z], [i[j][0], i[j][1], z], [i[k][0], i[k][1], z])
  }
}

function build() {
  const alu = new Part(), win = new Part(), roof = new Part(), mech = new Part(), base = new Part()

  // --- Podium. ---
  const pod = ccw(PODIUM)
  walls(base, pod, 0, 22)
  cap(roof, pod, 22)
  ribbons(win, pod, 4, 21, 2, 3.2)

  // --- Towers: shaft, mechanical bands, set-back top. ---
  const MECH: [number, number][] = [[100, 102.2], [104.8, 107]]
  for (const { ring, h } of TOWERS) {
    const r = ccw(ring), top = inset(r, 1.5)
    walls(alu, r, 22, h - 6)
    tread(alu, r, top, h - 6)
    walls(alu, top, h - 6, h)
    cap(roof, top, h)
    // glass runs edge to edge round the chamfers and into the notches, so
    // the four towers read as one faceted cluster, not four cylinders
    ribbons(win, r, 23.5, 99, 6, 2.3, [], 0)
    ribbons(win, r, 108, h - 6, Math.round((h - 114) / 11.6), 2.3, [], 0)
    for (const [z0, z1] of MECH) band(mech, r, z0, z1)
    ribbons(win, top, h - 5.2, h - 1.2, 1, 0.8)
  }

  return [
    { part: alu, material: finish('oxford-aluminium', 0xc3ccd3, 0.5) },
    { part: win, material: windowVariant(2, 0xa9bfd1) },
    { part: roof, material: PALETTE.roof },
    { part: mech, material: finish('oxford-louvre', 0x5d6670, 0.6) },
    { part: base, material: finish('oxford-podium', 0xc9c4bb) },
  ]
}

if (import.meta.main) await save(ID, 'One Oxford Centre', ANCHOR, BEARING, build(), 5000)
