/**
 * United States Post Office, Miami Beach (1300 Washington Avenue; 1937,
 * Howard L. Cheney, PWA Depression Moderne) — original procedural
 * geometry, CC0-1.0.
 * bun generators/mia-miami-beach-post-office.ts
 *
 * Also exports two small helpers (`box`, `quadF`) that mia-colony-hotel,
 * mia-carlyle-hotel, mia-new-world-center and mia-1111-lincoln-road import;
 * the post office model is only written when this file runs itself.
 *
 * Map frame: x east, y north (turned to bearing 359, the OSM walls' axis),
 * metres, origin at the anchor on the ground. Anchor = centroid of the OSM
 * outline way/316984493, 25.7845510, -80.1325568.
 *
 * Identity, in order: the white drum of the rotunda at the corner of
 * Washington Avenue and 13th Street, with its coral-stone cornice, low
 * dome and the small cylindrical lantern with its railing crown; the tall
 * projecting entrance portal on the corner diagonal (pale frame, coral
 * surround, glass-block window over bronze doors) with the planter walls
 * either side and the wide pink steps; the plain one-storey wings either
 * side with tall windows and a coral coping.
 *
 * Night: windows and the glass-block window glow (`window`), the doors are
 * `entrance`; the drum and portal carry a gentle `_FLOODLIGHT` on the
 * street side, as the building is lit from the plaza lamps.
 *
 * Evidence:
 *  - plan: OSM outline way/316984493 (the wings; its SE arc traces the
 *    drum). Drum centre (10.6, -18.3), radius 6.9, fitted to the OSM arc
 *    and checked against the lidar. USGS NAIP (public domain) shows the
 *    drum, the lantern and the flat wing roofs; it sits ~5 m east of OSM
 *    and the lidar, so OSM was followed.
 *  - heights: lidar, USGS 3DEP FL_TopobathyFLKeysNOAA_Hydroflattened_2019
 *    (flown 2019), 0.5 m grid, above the street (~0.9 m over the lowest
 *    ground return): wings 6.5 with the coping to 7.1; drum eave (cornice)
 *    10.9, dome to 12.2; lantern top ~16.6, radius ~1.1 (measured; the
 *    drum stands about 1.55 times the wings' coping, as the photos show).
 *  - portal on the diagonal between the two wings (bearing ~122°), its
 *    width, height and the planter walls and steps: estimated from the
 *    photos below, scaled by the drum's radius.
 *  - colours: white-cream stucco, pink coral-stone trim and steps (photos).
 *
 * Photos (Wikimedia Commons):
 *  - Miami_Beach_Post_Office_33139_-_Washington_Avenue_13th_Street_South_Beach_01.jpg,
 *    _02, _03 (Daniel Di Palma, CC BY-SA 4.0): the portal and drum
 *  - Miami_Beach_Post_Office.JPG (Infrogmation of New Orleans, CC BY 3.0):
 *    from across Washington Avenue, both wings
 *  - US_Post_Office,_Miami_Beach,_FL,_USA.jpg (Lou Fernando, CC BY-SA 4.0)
 *  - Miami_Beach_-_U.S._Post_Office.jpg (postcard, public domain)
 *  - Art_Deco_Post_Office_South_Beach_(12948494703).jpg (Phillip Pessar,
 *    CC BY 2.0)
 * No look-only sources. No commercial imagery.
 *
 * Left out: the "UNITED STATES POST OFFICE" lettering and the eagle (not a
 * famous sign, too fine), the drum's shallow pilaster lines, the lantern's
 * small windows' mullions, railings, the flagpole.
 *
 * Doubts: no licensed photo of the west and north (alley) sides; their
 * windows follow the south wing's rhythm. The portal's exact bearing is
 * taken as the middle of the drum's free arc.
 */
import { Part, type V3, cross, sub } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, onWall, panel, save, walls, type XY } from './chi-aon-center'
import { parapet } from './mia-freedom-tower'
import { punched, cols } from './mia-vizcaya'

// ---------------------------------------------------------------------------
// Helpers shared by this builder's mia- models.

/** A quad wound so that it faces along `want`. */
export function quadF(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/**
 * A box in the frame of wall a→b: s0..s1 along it, o0..o1 out from it
 * (positive = outside), z0..z1. Draws the four sides and the top (and the
 * bottom with `bottom`).
 */
export function box(p: Part, a: XY, b: XY, s0: number, s1: number, o0: number, o1: number, z0: number, z1: number, bottom = false) {
  const { P, u, n } = onWall(a, b)
  const U: V3 = [u[0], u[1], 0], N: V3 = [n[0], n[1], 0]
  quadF(p, P(s0, z0, o1), P(s1, z0, o1), P(s1, z1, o1), P(s0, z1, o1), N)
  quadF(p, P(s0, z0, o0), P(s1, z0, o0), P(s1, z1, o0), P(s0, z1, o0), [-N[0], -N[1], 0])
  quadF(p, P(s1, z0, o0), P(s1, z0, o1), P(s1, z1, o1), P(s1, z1, o0), U)
  quadF(p, P(s0, z0, o0), P(s0, z0, o1), P(s0, z1, o1), P(s0, z1, o0), [-U[0], -U[1], 0])
  quadF(p, P(s0, z1, o0), P(s1, z1, o0), P(s1, z1, o1), P(s0, z1, o1), [0, 0, 1])
  if (bottom) quadF(p, P(s0, z0, o0), P(s1, z0, o0), P(s1, z0, o1), P(s0, z0, o1), [0, 0, -1])
}

// ---------------------------------------------------------------------------
// Post office

const C: XY = [10.6, -18.3], R = 6.9

function build() {
  const stucco = new Part(), coral = new Part(), win = new Part(), roof = new Part(), door = new Part(), metal = new Part()

  // --- Wings: the OSM ring, its arc drawn just inside the drum.
  const arc: XY[] = []
  for (let k = 0; k <= 8; k++) {
    const t = (-75 + (85 * k) / 8) * Math.PI / 180
    arc.push([C[0] + (R - 0.15) * Math.cos(t), C[1] + (R - 0.15) * Math.sin(t)])
  }
  const ring: XY[] = [[-9.0, -3.1], [-8.8, -28.3], [10.4, -28.2], [10.4, -25.0], ...arc, [19.0, -16.6], [18.7, 11.3], [28.1, 11.3], [28.0, 22.5], [1.3, 22.3], [1.4, 11.3], [-21.7, 11.1], [-21.6, -3.2]]
  const WALL = 6.4, COPE = 7.1
  walls(stucco, ring, 0, WALL)
  parapet(coral, ring, WALL, COPE, 0.35)
  cap(roof, inset(ring, 0.35), 6.65)

  // Tall windows on the street fronts and plainer ones round the back.
  const win2: [number, number][] = [[1.6, 5.6]]
  const wallsOf = (pts: XY[]) => pts.map((p, i) => [p, pts[(i + 1) % pts.length]] as [XY, XY])
  for (const [a, b] of wallsOf(ring)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) continue
    const n = Math.max(1, Math.round((L - 3) / 3.6))
    punched(win, a, b, cols(L, n, 2.2), 1.3, win2)
  }

  // --- Drum, cornice, low dome, lantern.
  const SEG = 32
  lathe(stucco, C[0], C[1], [[R, 0], [R, 10.3]], SEG)
  lathe(coral, C[0], C[1], [[R, 10.3], [R + 0.3, 10.45], [R + 0.3, 10.9], [R - 0.4, 10.95]], SEG)
  lathe(roof, C[0], C[1], [[R - 0.4, 10.95], [R * 0.7, 11.7], [R * 0.35, 12.15], [1.3, 12.25], [0, 12.25]], SEG)
  const LR = 1.3
  lathe(stucco, C[0], C[1], [[LR, 12.0], [LR, 15.8]], 16)
  lathe(coral, C[0], C[1], [[LR, 15.8], [LR + 0.15, 15.85], [LR + 0.15, 16.1], [0, 16.1]], 16)
  // The railing crown: a ring of thin posts drawn as an open band.
  lathe(metal, C[0], C[1], [[LR + 0.05, 16.1], [LR + 0.05, 16.6]], 16)
  lathe(metal, C[0], C[1], [[LR - 0.03, 16.6], [LR - 0.03, 16.1]], 16)
  // Lantern windows: four tall slots.
  for (let k = 0; k < 4; k++) {
    const t = (-32.5 + 90 * k) * Math.PI / 180
    const u: XY = [-Math.sin(t), Math.cos(t)]
    const m: XY = [C[0] + (LR + 0.04) * Math.cos(t), C[1] + (LR + 0.04) * Math.sin(t)]
    panel(win, [m[0] - u[0], m[1] - u[1]], [m[0] + u[0], m[1] + u[1]], 0.7, 1.3, 13.2, 15.3, 0)
  }

  // --- Portal on the diagonal between the wings.
  const t = -32.5 * Math.PI / 180
  const u: XY = [-Math.sin(t), Math.cos(t)]
  const F: XY = [C[0] + R * Math.cos(t), C[1] + R * Math.sin(t)]
  const a: XY = [F[0] - 10 * u[0], F[1] - 10 * u[1]], b: XY = [F[0] + 10 * u[0], F[1] + 10 * u[1]]
  // Pale frame, coral surround, glass block over the doors.
  box(stucco, a, b, 7.5, 12.5, -1.5, 1.5, 0, 9.2)
  box(coral, a, b, 8.1, 11.9, -1.0, 1.6, 0, 8.7)
  panel(win, a, b, 8.85, 11.15, 3.95, 8.3, 1.62)
  panel(door, a, b, 8.85, 11.15, 1.0, 3.7, 1.62)
  // The eagle's block over the portal, on the drum.
  box(coral, a, b, 9.3, 10.7, -0.6, 0.35, 9.2, 10.2)
  // Planter walls either side, and the steps.
  box(stucco, a, b, 3.2, 7.5, -1.5, 2.2, 0, 2.6)
  box(stucco, a, b, 12.5, 16.8, -1.5, 2.2, 0, 2.6)
  for (const [k, o] of [[0, 3.9], [1, 3.2], [2, 2.5]] as [number, number][])
    box(coral, a, b, 3.0 + 0.3 * k, 17.0 - 0.3 * k, 1.5, o, 0, 0.3 * (k + 1))
  // A plaque either side of the portal on the planters is too small; left out.

  const lit = (p: V3, n: V3) => {
    const d = Math.hypot(p[0] - C[0], p[1] - C[1])
    if (d > R + 4 || n[2] > 0.7) return 0
    const face = (n[0] * Math.cos(t) + n[1] * Math.sin(t))
    return face > 0 ? 0.25 + 0.3 * face : 0
  }
  return [
    { part: stucco, material: { ...finish('mbpo-stucco', 0xf3ece0), floodlight: lit } },
    { part: coral, material: { ...finish('mbpo-coral', 0xdcb4a2), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
    { part: metal, material: PALETTE.metal },
  ]
}

if (import.meta.main) await save('mia-miami-beach-post-office', 'Miami Beach Post Office', [25.784551, -80.1325568], 359, build(), 5000)
