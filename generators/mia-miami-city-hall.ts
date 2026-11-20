/**
 * Miami City Hall, Dinner Key (3500 Pan American Drive; 1934, Delano &
 * Aldrich, built as the Pan American Airways seaplane terminal) — original
 * procedural geometry, CC0-1.0.
 * bun generators/mia-miami-city-hall.ts
 *
 * Map frame: model +y points along the bearing (44°, north-east), +x to its
 * right (134°, south-east, toward the bay); the landside front faces -x
 * (314°, the drive circle). Metres; origin at the anchor on the ground.
 * Anchor = centroid of the OSM outline way/435746373, 25.7277285,
 * -80.2338625. The outline's walls run at 44° / 134°.
 *
 * Identity, in order: a white streamline-moderne terminal: the two-storey
 * central block with the frieze of winged globes (blue globes on a gold
 * band) under its parapet and three big glass-block windows over the
 * entrance; the small square penthouse on its roof; the one-storey wings
 * wrapped round it with the long blue canopy over the landside entrance;
 * the lower two-storey bay on the north-east end.
 *
 * Night: windows and the entrance glazing glow; the frieze and walls are
 * floodlit (`floodlight` on the white and the frieze, landside strongest).
 *
 * Evidence:
 *  - plan: OSM outline way/435746373 (height 18.4, historic name Pan
 *    American Seaplane Base and Terminal Building, wikidata Q16981944).
 *    The one-storey base follows it; the upper blocks from lidar.
 *  - heights: lidar, NOAA Digital Coast EPT 10338 (2021 Florida coastal
 *    topobathy, public domain; no USGS 3DEP points here), 0.5 m grid, above
 *    the ground round the building: wings' roofs 4.6 with parapets 5.4;
 *    central block x -9..17.5, y -10..16.5, roof 9.5, parapet 10.6; its
 *    end blocks (y -16..-10, 16.5..22) 8.4; the north-east bay 7.7; the
 *    penthouse 6 x 5.5 m to 13.6. OSM's 18.4 likely counts the flagpole and
 *    mast; the model follows lidar.
 *  - the frieze, glass-block windows, canopy, window rhythm: the photos
 *    below; the 1930s aerial for the massing round the central block.
 *  - colour: white walls, blue canopy fascia and globes, gold frieze band.
 *
 * Photos (Wikimedia Commons):
 *  - Miami_city_hall.jpg (Dtobias, CC BY-SA 3.0), the landside front
 *  - Miami_FL_Pan_Am_Bldg_city_hall02.jpg (Ebyabe, CC BY-SA 3.0), from the
 *    west
 *  - USA_Tour_2019_P127_Miami_Pan_American_Seaplane_Base_and_Terminal_Building.jpg
 *    (Fallaner, CC BY-SA 4.0), from the north
 *  - Pan_American_Miami_Terminal_aerial_view_in_the_1930s.jpg (public
 *    domain), the massing from above
 * No look-only sources. No commercial imagery.
 *
 * Left out: the "MIAMI CITY HALL" letters (small, under the frieze),
 * the frieze's sunburst wings (drawn as the gold band), rooftop mechanical
 * units, the flagpole and mast.
 *
 * Doubts: the bay side (south-east) has no licensed modern photo; its
 * windows follow the landside rhythm. The frieze's motif spacing is
 * estimated from the front photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, chamfer, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { parapet } from './mia-freedom-tower'
import { cols, faces, punched, solid } from './mia-vizcaya'

/** A disc on wall a→b, s along it at height z, `out` proud. */
function disc(p: Part, a: XY, b: XY, s: number, z: number, r: number, out: number, seg = 10) {
  const { P } = onWall(a, b)
  const c = P(s, z, out)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    p.tri(c, P(s + r * Math.cos(t0), z + r * Math.sin(t0), out), P(s + r * Math.cos(t1), z + r * Math.sin(t1), out))
  }
}

function build() {
  const white = new Part(), roof = new Part(), win = new Part(), blue = new Part(), gold = new Part()

  // --- One-storey base on the OSM outline (counter-clockwise).
  const BASE: XY[] = ([[-14.1, 26.7], [15.3, 26.2], [18.3, 26.1], [17.2, 16.4], [20.3, 12.9], [28.8, 13.1], [29.1, -7.6], [22.1, -8.0], [18.3, -11.8], [17.9, -20.9], [9.5, -21.4], [9.1, -22.8], [6.1, -22.9], [-5.8, -23.2], [-5.9, -21.5], [-14.5, -21.8]] as XY[]).reverse()
  // Long faces split so the map's terrain drape follows them.
  walls(white, BASE, 0, 4.6)
  parapet(white, BASE, 4.6, 5.4, 0.3)
  cap(roof, inset(BASE, 0.3), 4.7)
  for (let i = 0; i < BASE.length; i++) {
    const a = BASE[i], b = BASE[(i + 1) % BASE.length], L = onWall(a, b).L
    if (L < 6) continue
    panel(blue, a, b, 0, L, 4.0, 4.25, 0.05) // a thin blue line under the parapet
    // Punched windows, one per bay.
    const n = Math.max(1, Math.round(L / 4.2))
    const isFront = Math.abs(a[0] + 14.3) < 0.6 && Math.abs(b[0] + 14.3) < 0.6
    if (isFront) continue
    punched(win, a, b, cols(L, n, 2.0), 1.7, [[1.2, 3.3]])
  }

  // --- Landside front (x = -14.3): the entrance glazing under the blue canopy.
  {
    const a: XY = [-14.5, -21.8], b: XY = [-14.1, 26.7], L = onWall(a, b).L
    // a→b runs +y along x ≈ -14.3, but the ring goes the other way; draw on b→a.
    const A = b, B = a
    const m = L / 2 - 0.8 // the canopy is centred on the central block (y ≈ 3.25)
    panel(win, A, B, m - 9, m + 9, 0.3, 3.2, 0.05)
    for (const s of [m - 15.5, m - 12.5, m + 12.5, m + 15.5]) panel(win, A, B, s - 1.0, s + 1.0, 1.2, 3.3, 0.05)
    // Canopy: a slab 2.6 m deep with a blue fascia.
    const { P } = onWall(A, B)
    const z0 = 3.3, z1 = 4.15, s0 = m - 11, s1 = m + 11, d = 3.0
    blue.quad(P(s0, z0, d), P(s1, z0, d), P(s1, z1, d), P(s0, z1, d))
    blue.quad(P(s1, z0, 0), P(s1, z0, d), P(s1, z1, d), P(s1, z1, 0))
    blue.quad(P(s0, z0, d), P(s0, z0, 0), P(s0, z1, 0), P(s0, z1, d))
    white.quad(P(s0, z1, 0), P(s0, z1, d), P(s1, z1, d), P(s1, z1, 0))
    white.quad(P(s0, z0, 0), P(s1, z0, 0), P(s1, z0, d), P(s0, z0, d))
  }

  // --- Central block and its lower end blocks.
  const CB = [-9, -10, 17.5, 16.5] as const
  solid(white, CB[0], CB[1], CB[2], CB[3], 0, 9.5, roof)
  parapet(white, rect(CB[0], CB[1], CB[2], CB[3]), 9.5, 10.6, 0.3)
  for (const e of [[-9, -16, 17.5, -10], [-9, 16.5, 17.5, 22]]) {
    solid(white, e[0], e[1], e[2], e[3], 0, 7.6, roof)
    parapet(white, rect(e[0], e[1], e[2], e[3]), 7.6, 8.4, 0.3)
  }
  // The north-east bay with cut corners.
  const BAY = chamfer(rect(-4, 22, 10, 26.4), 2.2)
  walls(white, BAY, 0, 7.0)
  parapet(white, BAY, 7.0, 7.7, 0.3)
  cap(roof, inset(BAY, 0.3), 7.1)
  for (let i = 0; i < BAY.length; i++) {
    const a = BAY[i], b = BAY[(i + 1) % BAY.length], L = onWall(a, b).L
    if (L > 2.5 && (a[1] > 22.5 || b[1] > 22.5)) panel(win, a, b, 0.5, L - 0.5, 5.4, 6.6, 0.05)
  }

  // Frieze on all four faces of the central block: gold band, blue globes.
  for (const [a, b] of faces(CB[0], CB[1], CB[2], CB[3])) {
    const L = onWall(a, b).L
    panel(gold, a, b, 0.3, L - 0.3, 9.0, 10.35, 0.06)
    panel(blue, a, b, 0.3, L - 0.3, 8.75, 9.0, 0.06)
    const n = Math.floor((L - 1) / 2.4)
    for (let k = 0; k < n; k++) disc(blue, a, b, (L - (n - 1) * 2.4) / 2 + k * 2.4, 9.67, 0.55, 0.09)
  }
  // Upper windows: three glass-block panels over the entrance, punched
  // windows round the rest.
  {
    const [s, e, n, w] = faces(CB[0], CB[1], CB[2], CB[3])
    const L = CB[3] - CB[1], m = L / 2
    panel(win, w[0], w[1], m - 7.2, m - 3.6, 5.2, 7.7, 0.05)
    panel(win, w[0], w[1], m - 2.4, m + 2.4, 5.2, 7.7, 0.05)
    panel(win, w[0], w[1], m + 3.6, m + 7.2, 5.2, 7.7, 0.05)
    punched(win, w[0], w[1], [1.6, L - 1.6], 1.3, [[5.8, 7.2]])
    punched(win, e[0], e[1], cols(L, 7, 2), 1.6, [[5.6, 7.4]])
    for (const f of [s, n]) punched(win, f[0], f[1], cols(CB[2] - CB[0], 5, 2.5), 1.6, [[5.6, 7.4]])
  }
  for (const eb of [[-9, -16, 17.5, -10], [-9, 16.5, 17.5, 22]]) {
    const [s, e, n, w] = faces(eb[0], eb[1], eb[2], eb[3])
    for (const f of [w, e]) punched(win, f[0], f[1], [3], 2.2, [[5.4, 6.9]])
    for (const f of eb[1] < 0 ? [s] : [n]) punched(win, f[0], f[1], cols(eb[2] - eb[0], 5, 2.5), 1.6, [[5.4, 6.9]])
  }

  // Penthouse.
  solid(white, -1, 0, 5, 5.5, 9.5, 13.6, white)

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : p[0] < 0 ? 0.75 : 0.45)
  return [
    { part: white, material: { ...finish('mch-white', 0xf4f2ec), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: blue, material: { ...finish('mch-blue', 0x4f82b8), floodlight: lit } },
    { part: gold, material: { ...finish('mch-gold', 0xd9bb6c), floodlight: lit } },
  ]
}

if (import.meta.main) await save('mia-miami-city-hall', 'Miami City Hall', [25.7277285, -80.2338625], 44, build(), 5000)
