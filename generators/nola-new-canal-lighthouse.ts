/**
 * New Canal Lighthouse, West End, New Orleans (1890 house; wrecked by
 * Hurricane Katrina 2005, rebuilt 2012-13 by the Lake Pontchartrain Basin
 * Foundation) — procedural, CC0-1.0, no textures.
 * bun generators/nola-new-canal-lighthouse.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 1.2, the bearing of the OSM
 * outline's walls; model +y faces the lake.
 * Anchor: the area centroid of OSM way/325532727 (building=yes), the
 * lighthouse's red roof in NAIP. (OSM node/12104606418 "New Canal Lighthouse
 * at New Orleans" is a man_made=monitoring_station on it; OSM maps no
 * man_made=lighthouse here.)
 *
 * Identity: a white clapboard house raised a storey on white posts, a
 * veranda with a white balustrade all round its first floor under a red
 * pent roof, a second storey of the same width with black-shuttered windows
 * under a red hipped roof, and on top a square white tower with a shuttered
 * window, a square railed gallery and a glazed lantern with a red cap and a
 * ball finial; an open stair down from the veranda's south-east corner, and
 * a small red-roofed porch room on the west.
 *
 * Evidence
 * - OSM way/325532727: the roof's plan, 11.4 x 11.6 m, with the small west
 *   porch (x = -9.6..-5, y = -3.6..-0.6).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   0.5 m grid read in the model frame (after the 2013 rebuild). Ground
 *   1.2 above the grid minimum. Above it: the pent roof's eaves 8.0; the
 *   upper roof's eaves 11.6-11.8, its top 12.8 by the tower; the gallery
 *   15.7-16.7; the lantern top 18.4; the west porch roof 8.0-8.7.
 * - Terrain (Mapterhorn): flat. elevation 0.
 * - NAIP (USGS, public domain): the red roofs, the white tower and gallery
 *   in the middle.
 * - Photos (Wikimedia Commons, all evidence):
 *   - "New Canal Lighthouse.jpg", Nolabob, CC0: from the south-east (the
 *     posts, the stair, the veranda, both roofs, the tower and lantern)
 *     https://commons.wikimedia.org/wiki/File:New_Canal_Lighthouse.jpg
 *   - "New Canal Lighthouse, New Orleans, August 2025.jpg", abbeyprivate,
 *     CC0: from the lake (the lake face, the west porch's red roof)
 *     https://commons.wikimedia.org/wiki/File:New_Canal_Lighthouse,_New_Orleans,_August_2025.jpg
 *   - "New Basin Canal Lighthouse 2013 - New Orleans, LA.jpg", Spatms,
 *     CC BY-SA 3.0: from the south-west (proportions, the stair)
 *     https://commons.wikimedia.org/wiki/File:New_Basin_Canal_Lighthouse_2013_-_New_Orleans,_LA.jpg
 *   - "New Canal Lighthouse from Lakeshore Drive, New Orleans, 29 October
 *     2016 - 1.jpg", Infrogmation, CC BY-SA 4.0: from the east, far off
 *     https://commons.wikimedia.org/wiki/File:New_Canal_Lighthouse_from_Lakeshore_Drive,_New_Orleans,_29_October_2016_-_1.jpg
 * - Published: Wikipedia "New Canal Light": 1890 square two-storey wooden
 *   house with the lantern on the roof; rebuilt 2012-13 after Katrina.
 *
 * Measured (lidar/OSM): plan, eaves, gallery and lantern heights. Estimated
 * from the photos scaled to those: the first floor 4.0 above the ground, the
 * house 7.6 m square inside a veranda 2 m deep, the second floor walls to
 * 11.4, the tower 2.7 m square to 15.1, the gallery 4.0 m square, the
 * lantern r 0.95 to 17.1 with its cap to 18.0, two shuttered windows a side
 * on each storey, the posts, the stair.
 * Left out: the balusters (a solid white band), the clapboard lines, the
 * fence, the seawall.
 *
 * Night: the lantern and the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, save, circle, type XY } from './atl-flatiron-building'
import { faceOf, fblock, fpanel, qf, tf, type Face } from './nola-gallier-hall'
import { hipRoof, pyramid, lathe } from './nola-noma'

/** A pent (skirt) roof round a square: from the outer eave square at z0 up to the inner square at z1. */
function pentRoof(p: Part, cx: number, cy: number, O: number, I: number, z0: number, z1: number, soffit: Part = p) {
  const o: V3[] = [[cx - O, cy - O, z0], [cx + O, cy - O, z0], [cx + O, cy + O, z0], [cx - O, cy + O, z0]]
  const i: V3[] = [[cx - I, cy - I, z1], [cx + I, cy - I, z1], [cx + I, cy + I, z1], [cx - I, cy + I, z1]]
  const out: V3[] = [[0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]]
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    qf(p, o[k], o[l], i[l], i[k], out[k])
    // the soffit underneath, so the skirt isn't see-through from below
    qf(soffit, o[k], o[l], [i[l][0], i[l][1], z0], [i[k][0], i[k][1], z0], [0, 0, -1])
  }
}

if (import.meta.main) {
  const white = new Part(), red = new Part(), win = new Part(), dark = new Part(), deck = new Part()

  const CX = 0.75, CY = 0.2
  const FLOOR = 4.2, PENT0 = 8.0, PENT1 = 9.2, WALL2 = 11.3, EAVE = 11.6, TOWER0 = 12.8, GAL = 14.8, LANT = 16.9
  const H = 4.0 // half the house
  const V = 5.35 // half the veranda deck
  const R = 5.7 // half the pent roof at its eaves

  // ── posts and the deck ──
  const posts = [-V + 0.25, -V / 3, V / 3, V - 0.25]
  for (const px of posts) for (const py of posts) {
    box(white, CX + px - 0.2, CX + px + 0.2, CY + py - 0.2, CY + py + 0.2, 0, FLOOR - 0.3, null, 0.05)
  }
  box(deck, CX - V, CX + V, CY - V, CY + V, FLOOR - 0.35, FLOOR, deck, 0.05, true)

  // ── the first floor: the house, the veranda posts and balustrade, the pent roof ──
  box(white, CX - H, CX + H, CY - H, CY + H, FLOOR, WALL2, null, 0.0)
  for (let k = 0; k < 6; k++) {
    const t = -V + 0.15 + ((2 * V - 0.3) * k) / 5
    for (const [x, y] of [[t, -V + 0.15], [t, V - 0.15], [-V + 0.15, t], [V - 0.15, t]] as XY[]) {
      box(white, CX + x - 0.11, CX + x + 0.11, CY + y - 0.11, CY + y + 0.11, FLOOR, PENT0, null, 0.0)
    }
  }
  // the balustrade: a white band round the deck edge, open where the stair lands
  const ring: XY[] = [[CX - V, CY - V], [CX + V, CY - V], [CX + V, CY + V], [CX - V, CY + V]]
  for (let k = 0; k < 4; k++) {
    const F = faceOf(ring[k], ring[(k + 1) % 4])
    const spans: [number, number][] = k === 1 ? [[1.4, F.L]] : [[0, F.L]]
    for (const [s0, s1] of spans) {
      fblock(white, F, s0, s1, FLOOR, FLOOR + 1.0, 0.0, -0.08)
      fblock(white, F, s0, s1, FLOOR + 0.95, FLOOR + 1.08, 0.06, -0.14)
    }
  }
  pentRoof(red, CX, CY, R, H, PENT0, PENT1, white)

  // windows with black shutters on each face of both storeys, and the doors
  const faces: Face[] = [faceOf([CX - H, CY - H], [CX + H, CY - H]), faceOf([CX + H, CY - H], [CX + H, CY + H]), faceOf([CX + H, CY + H], [CX - H, CY + H]), faceOf([CX - H, CY + H], [CX - H, CY - H])]
  const shuttered = (F: Face, s: number, z0: number, z1: number) => {
    fpanel(win, F, s - 0.5, s + 0.5, z0, z1, 0.05)
    fblock(dark, F, s - 0.98, s - 0.55, z0, z1, 0.08, -0.02)
    fblock(dark, F, s + 0.55, s + 0.98, z0, z1, 0.08, -0.02)
    fblock(white, F, s - 0.75, s + 0.75, z1, z1 + 0.18, 0.1, -0.02)
  }
  faces.forEach((F, k) => {
    for (const s of [2.1, 2 * H - 2.1]) shuttered(F, s, FLOOR + 1.0, FLOOR + 3.0)
    for (const s of [2.1, 2 * H - 2.1]) shuttered(F, s, PENT1 + 0.25, WALL2 - 0.4)
    if (k === 0) fpanel(win, F, H - 0.55, H + 0.55, FLOOR, FLOOR + 2.6, 0.06) // the door off the veranda
  })

  // ── the upper hipped roof and the tower ──
  const T = 1.05 // half the tower
  const E = H + 0.45 // half the upper roof at its eaves
  box(white, CX - E, CX + E, CY - E, CY + E, WALL2, EAVE, null, 0.0, true) // the eaves fascia
  pentRoof(red, CX, CY, E, T, EAVE, TOWER0, white)
  box(white, CX - T, CX + T, CY - T, CY + T, EAVE, GAL, null, 0.0)
  for (const F of [faceOf([CX - T, CY - T], [CX + T, CY - T]), faceOf([CX + T, CY - T], [CX + T, CY + T]), faceOf([CX + T, CY + T], [CX - T, CY + T]), faceOf([CX - T, CY + T], [CX - T, CY - T])]) {
    fpanel(win, F, T - 0.35, T + 0.35, TOWER0 + 0.25, GAL - 0.6, 0.05)
    fblock(dark, F, T - 0.7, T - 0.4, TOWER0 + 0.25, GAL - 0.6, 0.08, -0.02)
    fblock(dark, F, T + 0.4, T + 0.7, TOWER0 + 0.25, GAL - 0.6, 0.08, -0.02)
  }
  // the gallery: a square deck with a bracketed edge and its white railing
  const G = 1.85
  box(white, CX - G, CX + G, CY - G, CY + G, GAL, GAL + 0.3, deck, 0.06, true)
  for (const sg of [-1, 1]) for (const sh of [-1, 1]) {
    // brackets under the gallery's corners
    const bx = CX + sg * (T + 0.05), by = CY + sh * (T + 0.05)
    box(white, Math.min(bx, bx + sg * 0.6), Math.max(bx, bx + sg * 0.6), Math.min(by, by + sh * 0.6), Math.max(by, by + sh * 0.6), GAL - 0.7, GAL, null, 0.0)
  }
  const gRing: XY[] = [[CX - G, CY - G], [CX + G, CY - G], [CX + G, CY + G], [CX - G, CY + G]]
  for (let k = 0; k < 4; k++) {
    const F = faceOf(gRing[k], gRing[(k + 1) % 4])
    fblock(white, F, 0, F.L, GAL + 0.3, GAL + 1.25, 0.0, -0.08)
  }
  // the lantern: octagonal glazing, a red cap and the ball finial
  const LR = 0.8
  const oct = circle([CX, CY], LR, 8, Math.PI / 8)
  prism(white, oct, GAL + 0.3, GAL + 0.75, null, 0.0)
  prism(win, circle([CX, CY], LR * 0.96, 8, Math.PI / 8), GAL + 0.75, LANT, null, 0.0)
  prism(red, circle([CX, CY], LR + 0.18, 8, Math.PI / 8), LANT, LANT + 0.15, null, 0.0, true)
  lathe(red, CX, CY, [[LR + 0.15, LANT + 0.15], [0.25, LANT + 0.85], [0.0, LANT + 0.9]], 8)
  lathe(red, CX, CY, [[0.05, LANT + 0.85], [0.2, LANT + 0.95], [0.22, LANT + 1.1], [0.15, LANT + 1.25], [0.0, LANT + 1.3]], 8)

  // ── the open stair off the veranda's south-east corner, down eastward (lidar: 6.0, 4.9, 3.1 at x = +8, +9, +10) ──
  const SY0 = CY - V + 0.1, SY1 = SY0 + 1.2
  const sx0 = CX + V // the top, at the deck's east edge
  const run = 6.0, nSteps = 9
  for (let k = 0; k < nSteps; k++) {
    const xa = sx0 + (run * k) / nSteps, xb = sx0 + (run * (k + 1)) / nSteps
    const z = FLOOR - ((FLOOR - 0.2) * (k + 1)) / nSteps
    box(deck, xa, xb, SY0, SY1, Math.max(0, z - 0.25), z + 0.2, deck, 0.0, true)
  }
  // its white stringers with the handrail on top (one solid band a side)
  for (const y of [SY0 - 0.04, SY1 + 0.04]) {
    const a: V3 = [sx0, y, FLOOR + 1.0], b: V3 = [sx0 + run, y, 1.0], c: V3 = [sx0 + run, y, 0.0], d: V3 = [sx0, y, FLOOR - 0.6]
    qf(white, a, b, c, d, [0, -1, 0])
    qf(white, a, d, c, b, [0, 1, 0])
  }
  for (const x of [sx0 + run - 0.1, sx0 + run * 0.5]) for (const y of [SY0, SY1]) box(white, x - 0.1, x + 0.1, y - 0.1, y + 0.1, 0, FLOOR * (1 - (x - sx0) / run) + 0.6, null, 0.0)

  // ── the west porch: a deck at the veranda's level under a small red hipped roof ──
  const wx0 = CX - 10.35, wx1 = CX - V, wy0 = CY - 3.8, wy1 = CY - 0.8
  box(deck, wx0, wx1, wy0, wy1, FLOOR - 0.35, FLOOR, deck, 0.05, true)
  for (const [x, y] of [[wx0 + 0.15, wy0 + 0.15], [wx0 + 0.15, wy1 - 0.15]] as XY[]) {
    box(white, x - 0.12, x + 0.12, y - 0.12, y + 0.12, 0, PENT0 - 0.3, null, 0.0)
  }
  // a small white room on the porch, with a window to the lake and one to the west
  box(white, wx0 + 0.3, wx1, wy0 + 0.3, wy1 - 0.3, FLOOR, PENT0 - 0.45, null, 0.0)
  fpanel(win, faceOf([wx1, wy1 - 0.3], [wx0 + 0.3, wy1 - 0.3]), 1.2, 2.4, FLOOR + 1.0, FLOOR + 2.8)
  fpanel(win, faceOf([wx0 + 0.3, wy1 - 0.3], [wx0 + 0.3, wy0 + 0.3]), 0.8, 1.6, FLOOR + 1.0, FLOOR + 2.8)
  box(white, wx0 - 0.25, wx1 + 0.4, wy0 - 0.25, wy1 + 0.25, PENT0 - 0.45, PENT0 - 0.3, null, 0.0, true)
  hipRoof(red, wx0 - 0.25, wx1 + 0.4, wy0 - 0.25, wy1 + 0.25, PENT0 - 0.3, PENT0 + 0.6)
  void tf; void pyramid; void dark

  const lit = (p: V3, n: V3) => (p[2] > GAL ? 0.8 : 0)
  await save('nola-new-canal-lighthouse', 'New Canal Lighthouse', [
    { part: white, material: { ...finish('lighthouse-white', 0xf4f2ed), floodlight: lit } },
    { part: red, material: finish('lighthouse-red', 0xc0524a) },
    { part: deck, material: finish('lighthouse-deck', 0xd9d6cf) },
    { part: dark, material: finish('lighthouse-shutter', 0x4a4f57) },
    { part: win, material: PALETTE.window },
  ], { bearing: 1.2, osm: 'way/325532727', height: LANT + 1.3 }, 5000)
}
