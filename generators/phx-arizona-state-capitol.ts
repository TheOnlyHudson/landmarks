/**
 * Arizona State Capitol, Phoenix (1900, James Riely Gordon; west additions
 * 1918 and 1938), now the Arizona Capitol Museum — original procedural
 * geometry, CC0-1.0.
 * bun generators/phx-arizona-state-capitol.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground on the
 * dome's axis. Bearing 0: the OSM walls run north–south and east–west.
 * Anchor -112.0970127, 33.4481265, the dome's centre in the lidar (4.75 m
 * east of the centre of OSM's dome part way/1171874692, which sits off the
 * dome; the 1900 block's own centre in OSM agrees with the lidar).
 *
 * What is drawn: OSM way/30694422 ("Arizona State Capitol") and its part:
 * the 1900 building facing east, the narrower 1918 link and the 1938 west
 * block. The 1974 Executive Tower (way/30694495) touches the west block
 * but is its own OSM outline, and the House (way/30694396) and Senate
 * (way/30694386) buildings stand apart across the courtyards, so all three
 * are left to the map.
 *
 * Identity (from the photos below):
 *  1. The low copper dome over the centre, on a short drum, crowned by the
 *     Winged Victory weathervane, a winged figure with one arm raised.
 *                                                  (main, l7131, l0021)
 *  2. The east front: a central pavilion with four giant columns over
 *     three arched entrances and a pediment with scrollwork.
 *                                                  (main, l9204, l1905)
 *  3. Two materials in bands: a rusticated grey granite ground storey with
 *     round-headed windows, and tan Arizona tuff above.  (a80635, l4452)
 *  4. A frieze of round windows under the cornice, and a flat-topped
 *     parapet with low hip roofs and two small dark roof lanterns.
 *                                                  (a80635, l8778, l8813)
 *  5. The plainer, taller 1918/1938 additions behind, in the same bands.
 *                                                  (l2467, l7874, l6816)
 *
 * Plan: OSM way/30694422 moved into this frame (x - 17.4, y - 2.95 from
 * OSM's raw local metres about -112.0972, 33.4481), squared and made
 * symmetric north–south about the dome. The 1900 block is drawn 1 m wider
 * each side than OSM (x -11.25..11.25), where the lidar puts its walls; the
 * east pavilion projects to x 14.6 at y ±8.4. The 1918 link is x
 * -29.7..-11.25, y ±9.8; the 1938 block x -50.9..-29.7, y -26.5..25.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020, 1 m grid, read with
 * tools/lidar_frame.py; ground_min 324.25 m, y = 0 here is 3.0 m above it
 * (the site is flat within 0.3 m). Measured (model metres): the 1900
 * block's cornice 15.1, its low hip roof to about 16.8, the pediment 17.3 (drawn 18.6: the lidar's 1 m cells clip its thin apex, and the photos show it rising nearly to the dome's base);
 * the dome springs at about 18 (radius 8.8) and its crown is 23.2; the top
 * of the weathervane 28.4; the roof lanterns 19–19.9; the 1918 link 18.8
 * and the 1938 block 18.5, both flat.
 *
 * Estimated: the storey lines, window rows and bays, from the w_lemay
 * photos scaled to the lidar cornice; the drum's height; the dome's
 * profile between lidar rings; the statue's proportions (a figure about
 * 4.5 m tall on a ball, wings raised, the right arm up with a torch); the
 * column spacing; the west additions' windows (fewer photos; drawn as
 * plain rows like l2467). Left out: the scrollwork and lettering in the
 * pediment, balustrades, the 1938 block's rooftop plant room.
 *
 * Photos (evidence, Wikimedia Commons; all w_lemay, CC BY-SA 2.0, titled
 * "Arizona State Capitol, Washington Street and 17th Avenue, Phoenix, AZ"
 * with the suffix given, unless noted):
 *  main   (no suffix) the east front
 *  l9204  "- 54441819204" east front, closer
 *  l1905  "- 54442001905" the portico
 *  l7131  "- 54441627131" north-east corner and dome
 *  l0021  "- 54441630021" the dome and the Winged Victory
 *  l2467  "- 54440772467" the west additions
 *  l8778  "- 54441878778" south front and the roof lanterns
 *  a80635 "AZ State Capitol Building 80635.JPG", CC BY 2.5 (south-east)
 *  jiang  "Arizona State Capitol Daytime December 2021.jpg", David Jiang,
 *         CC BY-SA 4.0 (from Wesley Bolin Plaza, east)
 * No look-only sources. No commercial imagery.
 *
 * Roofs: all flat, set 1–1.2 m down behind a parapet with no overhang; on
 * the 1900 block the parapet is the attic carrying the frieze of round
 * windows. Granite also covers the hidden flat roofs and the two roof
 * lanterns, to keep a material for the statue.
 * The porch: the wall behind the four columns is a dark recess (`entrance`,
 * with the doors), the columns 1.5 m clear of it; the pediment's scrollwork
 * is a darker copper-toned relief band. The dome is drawn faceted with 16
 * raised ribs and a grey band at its foot.
 * The Winged Victory is drawn white and about a third bolder than life
 * (wings 2 m out each side, top 29.3 m against the lidar's 28.4) so it reads
 * as a winged figure on a phone.
 *
 * Night: the east front and the dome are floodlit, the statue brightest;
 * windows glow; the porch recess and doors are `entrance`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, capPoly, ccw, cornice, gableRoof, hipRoof, offset, onWall, prism, rectShape, revolve, save, wall, type XY } from './atl-tech-tower'
import { ledge } from './atl-flatiron-building'

// Granite also covers the flat roofs and the roof lanterns, which the parapet
// hides; that frees a material for the white statue.
const tuff = new Part(), granite = new Part(), copper = new Part(), statue = new Part(), win = new Part(), door = new Part()
const roof = granite

// A flat roof set down behind a parapet: the walls rise to `top`, the
// parapet's inner face drops to the roof at `top - depth`, no overhang.
function parapetRoof(ring: XY[], top: number, depth: number) {
  const inner = offset(ring, -0.45)
  wall(tuff, [...inner].reverse(), top - depth, top)
  ledge(tuff, ring, inner, top)
  capPoly(roof, inner, top - depth, true)
}

const BASE = 4.6, EAVE = 15.1, WEST = 18.5, LINK = 18.8

// ── The 1900 block: granite ground storey, tuff above, cornice, low hips ──
const main = ccw([[-11.25, -28.4], [11.25, -28.4], [11.25, -8.4], [12.6, -8.4], [12.6, 8.4], [11.25, 8.4], [11.25, 28.4], [-11.25, 28.4]])
prism(granite, main, 0, BASE, null, 0)
prism(tuff, main, BASE, EAVE, null, 0)
cornice(tuff, main, BASE - 0.3, 0.5, 0.15, null)
// the main cornice, then the attic (the parapet) with its round windows and a
// coping; the roof is flat, 1.2 m down behind it
cornice(tuff, main, 12.9, 0.8, 0.5, null)
cornice(tuff, main, EAVE - 0.4, 0.4, 0.2, null)
parapetRoof(main, EAVE, 1.2)
// two small dark roof lanterns north and south of the dome
for (const s of [-1, 1]) {
  box(roof, -2, 1.5, s * 16 - 1.75, s * 16 + 1.75, 13.9, 18.6, roof, 0.2)
  hipRoof(roof, -2, 1.5, s * 16 - 1.75, s * 16 + 1.75, 18.6, 19.8, 0.2)
}

// The east portico: base with three arched doors; above it a two-storey porch,
// four columns standing clear of its dark recessed back wall; a large
// pediment with its scrollwork drawn as a darker relief band.
prism(granite, ccw([[12.6, -8.4], [15, -8.4], [15, 8.4], [12.6, 8.4]]), 0, BASE, tuff, 0.2)
onWall(door, [12.6, -6.9], [12.6, 6.9], rectShape(0, 13.8, BASE, 12.9), 0.03)
for (const y of [-3.3, 0, 3.3]) {
  onWall(door, [15, -8.4], [15, 8.4], rectShape(8.4 + y - 1.1, 8.4 + y + 1.1, 0, 2.6))
  onWall(win, [15, -8.4], [15, 8.4], archShape(8.4 + y, 2.2, 2.6, 2.6, 6).slice(2))
}
for (const y of [-5.1, -1.7, 1.7, 5.1]) revolve(tuff, [14.1, y], [[0.66, BASE], [0.56, 12.9]], 10, 0, false, false)
for (const y of [-7.7, 7.7]) box(tuff, 12.6, 14.8, y - 0.7, y + 0.7, BASE, 12.9, null, 0.15) // end piers
box(tuff, 12.6, 15, -8.4, 8.4, 12.9, EAVE, null, 0.2)
cornice(tuff, ccw([[12.6, -8.4], [15, -8.4], [15, 8.4], [12.6, 8.4]]), EAVE - 0.5, 0.5, 0.35, null)
gableRoof(roof, tuff, 4, 15.2, -8.8, 8.8, EAVE, 19.2, 'x', 0.15, 0.45)
// the scrollwork: a broad darker band across the tympanum
onWall(copper, [15.2, -8.8], [15.2, 8.8], [[4.6, EAVE + 0.75], [13, EAVE + 0.75], [12.2, EAVE + 1.6], [10.4, EAVE + 2.3], [7.2, EAVE + 2.3], [5.4, EAVE + 1.6]], 0.04)

// ── The 1918 link and the 1938 west block ──
const link = ccw([[-29.7, -9.8], [-11.25, -9.8], [-11.25, 9.8], [-29.7, 9.8]])
const west = ccw([[-50.9, -26.5], [-29.7, -26.5], [-29.7, 25], [-50.9, 25]])
for (const [ring, top] of [[link, LINK], [west, WEST]] as const) {
  prism(granite, ring, 0, BASE, null, 0)
  prism(tuff, ring, BASE, top, null, 0)
  cornice(tuff, ring, BASE - 0.3, 0.5, 0.15, null)
  cornice(tuff, ring, top - 1.6, 0.7, 0.35, null)
  parapetRoof(ring, top, 1)
}

// ── Windows ──
type Row = [number, number, 'arch' | 'rect']
const OLD: Row[] = [[1.2, 3.2, 'arch'], [5.4, 8.1, 'rect'], [8.8, 10.7, 'rect'], [11.2, 12.5, 'rect']]
const NEW: Row[] = [[1.2, 3.2, 'arch'], [5.4, 7.8, 'rect'], [8.8, 11.2, 'rect'], [12.2, 14.6, 'rect'], [15.4, 17.2, 'rect']]
function windows(ring: XY[], rows: Row[], bay: number, skip: (p: XY, a: XY, b: XY) => boolean, oculi = false) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.floor(L / bay)
    for (let j = 0; j < k; j++) {
      const s = ((j + 0.5) * L) / k
      if (skip([a[0] + ((b[0] - a[0]) * s) / L, a[1] + ((b[1] - a[1]) * s) / L], a, b)) continue
      for (const [z0, z1, kind] of rows) onWall(win, a, b, kind === 'arch' ? archShape(s, 1.3, z0, z1, 6) : rectShape(s - 0.65, s + 0.65, z0, z1))
      if (oculi) onWall(win, a, b, Array.from({ length: 8 }, (_, q) => [s + 0.38 * Math.cos((q / 8) * Math.PI * 2), 14.15 + 0.38 * Math.sin((q / 8) * Math.PI * 2)] as [number, number]))
    }
  }
}
// bays hidden where the blocks meet, and the portico's front (drawn below)
const hidden = (p: XY) => (Math.abs(p[0] + 11.25) < 0.01 || Math.abs(p[0] + 29.7) < 0.01) && Math.abs(p[1]) < 10.6
windows(main, OLD, 3.4, (p) => hidden(p) || Math.abs(p[0] - 12.6) < 0.01, true)
// the portico's wall behind the columns: three bays, upper floors only
for (const y of [-3.3, 0, 3.3]) for (const [z0, z1] of OLD.slice(1)) onWall(win, [12.6, -8.4], [12.6, 8.4], rectShape(8.4 + y - 0.75, 8.4 + y + 0.75, z0, z1), 0.06)
windows(link, NEW, 3.4, hidden)
windows(west, NEW, 3.4, hidden)

// ── The dome and the Winged Victory ──
const N = 16
revolve(tuff, [0, 0], [[9, 15], [9, 17.4], [9.4, 17.6], [9.4, 18.1], [8.8, 18.1]], N, Math.PI / N, true, false)
const domeProf: [number, number][] = Array.from({ length: 7 }, (_, i) => {
  const r = 8.8 - (i / 6) * (8.8 - 1.1)
  return [r, 18.1 + 5.1 * Math.sqrt(1 - (r / 8.8) ** 2)]
})
revolve(copper, [0, 0], [...domeProf, [1.1, 23.6], [0, 23.6]], N, Math.PI / N, true, false)
// the dark band at the dome's foot and raised ribs between the copper panels
revolve(granite, [0, 0], [[9.45, 18.1], [9.45, 18.5], [8.75, 18.75], [8.6, 18.75]], N, Math.PI / N, true, false)
for (let i = 0; i < N; i++) {
  const a = (i / N) * Math.PI * 2, c: XY = [Math.cos(a), Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
  for (let k = 0; k < domeProf.length - 1; k++) {
    const [r0, z0] = domeProf[k], [r1, z1] = domeProf[k + 1]
    const P = (r: number, z: number, w: number, o: number): V3 => [c[0] * (r + o) + t[0] * w, c[1] * (r + o) + t[1] * w, z]
    const ws = 0.16
    granite.quad(P(r0, z0, -ws, 0.12), P(r0, z0, ws, 0.12), P(r1, z1, ws, 0.12), P(r1, z1, -ws, 0.12))
  }
}

// The Winged Victory: a ball, a robed figure facing east, the right arm raised
// with a torch, the wings spread high to the north and south. Drawn about a
// third bolder than life so it reads as a winged figure on a phone.
revolve(statue, [0, 0], [[0, 23.5], [0.55, 23.75], [0.62, 24.1], [0.35, 24.45], [0.65, 24.7], [0.55, 26.3], [0.42, 27.1], [0.22, 27.3], [0.3, 27.5], [0.28, 27.8], [0, 28]], 8, 0, true, true)
box(statue, -0.12, 0.16, -0.62, -0.38, 26.6, 28.6, statue, 0.05) // the raised arm
revolve(statue, [0.02, -0.5], [[0, 28.6], [0.24, 28.7], [0.2, 29.05], [0, 29.1]], 6, 0, true, true) // the torch
// a wing: a thick plate from the shoulder out and up
function wing(side: number) {
  const pts: [number, number][] = [[0.15, 26.1], [0.35, 27.3], [1.2, 29.1], [2.05, 29.3], [1.8, 28], [1, 26.5]]
  const back = -0.25, th = 0.18
  const P = ([d, z]: [number, number], x: number): V3 => [x, side * d, z]
  const front = pts.map((q) => P(q, back + th)), rear = pts.map((q) => P(q, back))
  const n = pts.length
  for (let i = 1; i < n - 1; i++) {
    if (side > 0) { statue.tri(front[0], front[i], front[i + 1]); statue.tri(rear[0], rear[i + 1], rear[i]) }
    else { statue.tri(front[0], front[i + 1], front[i]); statue.tri(rear[0], rear[i], rear[i + 1]) }
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (side > 0) statue.quad(rear[i], rear[j], front[j], front[i])
    else statue.quad(rear[i], front[i], front[j], rear[j])
  }
}
wing(1); wing(-1)

await save('phx-arizona-state-capitol', 'Arizona State Capitol', [
  { part: tuff, material: { ...finish('capitol-tuff', 0xe2cfae), floodlight: (p, n) => (n[2] < 0.5 && p[0] > -11.5 ? 0.6 : 0) } },
  { part: granite, material: { ...finish('capitol-granite', 0xb9b7b0), floodlight: (p, n) => (p[2] > 17 ? 0.7 : n[2] < 0.5 && p[0] > -11.5 ? 0.5 : 0) } },
  { part: copper, material: { ...finish('capitol-copper', 0xd69d80), floodlight: () => 0.9 } },
  { part: statue, material: { ...finish('capitol-statue', 0xf3f1ec), floodlight: () => 1 } },
  { part: win, material: PALETTE.window },
  { part: door, material: { ...PALETTE.entrance, color: 0x6b5f53 } },
], { height: 29.3, anchor: [33.4481265, -112.0970127], bearing: 0 }, 6500)
