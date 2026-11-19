/**
 * Hotel Monteleone, 214 Royal Street, New Orleans (1908 block; towers of
 * 1954 and later) and its rooftop "HOTEL MONTELEONE" sign — procedural,
 * CC0-1.0, no textures. bun generators/nola-hotel-monteleone.ts
 *
 * Map frame: x = model east, y = model north, z up, metres; origin at the
 * anchor on the ground. Placed at bearing 307.5, square to the French
 * Quarter grid: model +y faces compass 307.5, the Royal Street front; +x
 * runs along Royal toward Bienville (compass 37.5), −x toward Iberville and
 * Canal. Anchor: the area centroid of the three tower buildings below
 * (-90.067849, 29.954243).
 *
 * What is drawn: OSM's way/1175412845 is the hotel's tourism=hotel area,
 * not a building; inside it the hotel's tall blocks are three buildings,
 * all replaced: A way/485366685 (the south-west tower, with its part
 * way/208608980), B way/208608977 (the white 1908 block behind the Royal
 * Street entrance), C way/208608976 (the north-east tower that carries the
 * sign). Left out: the low two- and three-storey wings toward Chartres
 * inside the hotel area (ways 208608975, 208608973, 367725781, 1175415400-
 * 1175415403) and the parking garage (way/208608974) — separate low
 * buildings that read apart from the towers.
 *
 * Identity, in order: the tallest mass in the French Quarter, buff brick
 * towers either side of the white terracotta 1908 block; the red neon
 * "HOTEL MONTELEONE" on its bold white lattice, standing on the
 * north-east tower's roof, turned square to compass 273 (facing west); a
 * heavy cornice band on each block; the white two-storey base along Royal
 * with its arched windows and the entrance canopy.
 *
 * Lettering (STYLE.md "Famous signs" exception): the sign is the hotel's
 * best-known feature, so its two words are built with lettering.ts, traced
 * from Infrogmation's 2025 photo and pasa47's night photo: a condensed
 * square-cut sans (straight stems, O as a chamfered rectangle, M with a
 * short V), "HOTEL" centred over "MONTELEONE", cap height 2.9 m, the
 * words 20.4 m long to match the lidar line.
 *
 * Evidence
 * - OSM: the ways above (levels 15-16, no heights).
 * - Lidar: USGS 3DEP LA_2021GNO_1_C22 (Greater New Orleans, flown 2021-22),
 *   1 m grid read in the model frame; ground 0.3 over the grid minimum.
 *   A: a core 61.5 (x −28..−10, full depth) over shoulders at 53.5;
 *   B: 47.5; C: 52.5; the sign: 47 returns at 62.5-65 on C, fitted to a
 *   line centred (32.9, 4.8), direction (0.826, 0.563), 19 m long — it runs
 *   almost exactly north-south (compass ~3°), so the sign faces west
 *   (compass ~273; pasa47's night photo, taken from the west with the
 *   Marriott behind, reads it) and reads from the usual south-west view.
 *   Its lattice stands on C's roof (52.5) and rises ~11.3 m.
 * - Terrain (Mapterhorn): flat. elevation 0.
 * - Photos (all evidence):
 *   - "French Quarter, New Orleans 1 May 2025 - Hotel Monteleone.jpg",
 *     Infrogmation, CC BY-SA 4.0: the sign on its lattice over the buff
 *     tower, the letterforms, the tower's bays and top frieze
 *     https://commons.wikimedia.org/wiki/File:French_Quarter,_New_Orleans_1_May_2025_-_Hotel_Monteleone.jpg
 *   - "Hotel Monteleone and the Marriott.jpg", pasa47, CC BY 2.0: the sign
 *     lit at night (red neon), its lattice
 *     https://commons.wikimedia.org/wiki/File:Hotel_Monteleone_and_the_Marriott.jpg
 *   - "MaisonBlancheGarageRoof1990Monteleone.jpg", Infrogmation of New
 *     Orleans, CC BY-SA 3.0: the three blocks side by side (buff | white |
 *     buff) and their relative heights
 *     https://commons.wikimedia.org/wiki/File:MaisonBlancheGarageRoof1990Monteleone.jpg
 *   - "Hotel Monteleone (55152089335).jpg", ajay_suresh, CC BY 4.0: the
 *     Royal Street entrance face-on (canopy, arched base windows)
 *     https://commons.wikimedia.org/wiki/File:Hotel_Monteleone_(55152089335).jpg
 *   - "Monteleone NOLA Cake Architecture.jpg" and "Monteleone front fascade
 *     1.jpg", Bart Everson, CC BY 2.0: the white terracotta front's bays
 *     https://commons.wikimedia.org/wiki/File:Monteleone_NOLA_Cake_Architecture.jpg
 *     https://commons.wikimedia.org/wiki/File:Monteleone_front_fascade_1.jpg
 *   - "Hotel Monteleone New Orleans October 2019 exterior.jpg", David
 *     Ohmer, CC BY 2.0: the base and the ornament over the entrance
 *     https://commons.wikimedia.org/wiki/File:Hotel_Monteleone_New_Orleans_October_2019_exterior.jpg
 * - Published: Wikipedia, "Hotel Monteleone": founded 1886, the present
 *   building 1908 with additions (1928, 1954).
 *
 * Measured (lidar): every roof height and the sign's position, angle and
 * top. Estimated: the storey height 3.4 (from 15-16 levels in 52-55 m),
 * the bay pitch (3.6-3.8 m, from the photos' 8 bays on C's face), the sign's
 * letter size and layout (from the photos, fitted to the lidar line), the
 * white base (8 m) and canopy. Invented: the backs of the towers repeat
 * their fronts' bays.
 *
 * Doubts: the lidar footprint and OSM agree only roughly; which tower
 * carries the sign rests on the lidar (the 1990 photo is ambiguous about
 * the viewpoint). The sign's lattice is drawn as a few bold bars, not its
 * real web of diagonals.
 *
 * Night: the letters are `neon` (red), the windows glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, prism, type Facade, type XY } from './nyc-570-lexington'
import { band, block } from './nyc-city-hall'
import { faceOf, fpanel, farch } from './nola-gallier-hall'
import { Pen, strokes, type Pt } from './lettering'

const brick = new Part(), white = new Part(), roof = new Part(), win = new Part(), neon = new Part(), frame = new Part()

// ─── Plan (OSM, model frame) and heights (lidar) ───
const A: XY[] = [[-13.5, 15.5], [-32.0, 15.6], [-32.3, -14.7], [-32.4, -30.0], [-10.8, -30.4], [-10.9, -21.3], [-2.7, -21.3], [-2.5, 0.2], [-10.3, 0.3], [-10.4, 5.1], [-13.5, 5.1]]
const B: XY[] = [[16.2, -6.9], [16.9, -21.4], [1.4, -21.3], [1.4, 0.2], [-2.5, 0.2], [-10.3, 0.3], [-10.4, 5.1], [-13.5, 5.1], [-13.5, 15.5], [2.9, 15.8], [16.2, 16.0]]
const C: XY[] = [[46.9, 16.1], [47.0, -4.0], [26.9, -3.8], [24.1, -3.8], [24.1, -7.0], [16.2, -6.9], [16.2, 16.0]]
const A_CORE: XY[] = [[-28.3, -29.9], [-10.6, -29.9], [-10.6, 15.4], [-28.3, 15.4]]
const HA = 53.5, HA2 = 61.5, HB = 47.5, HC = 52.5

const towerFacade: Facade = { bay: 3.7, ratio: 0.42, floor: 3.4, group: 2, spandrel: 1.3, sill: 1.6, head: 3.2, ground: 8.6, minLength: 3 }
const whiteFacade: Facade = { bay: 3.6, ratio: 0.46, floor: 3.3, group: 2, spandrel: 1.2, sill: 1.6, head: 3.4, ground: 8.6, minLength: 3 }

// ─── The blocks ───
prism({ wall: brick, win, roof, coping: white, ring: A, z0: 0, z1: HA, facade: towerFacade, bevel: 0.35 })
prism({ wall: brick, win, roof, coping: white, ring: A_CORE, z0: HA, z1: HA2, facade: { ...towerFacade, ground: 0, sill: 1.0, head: 1.6 }, bevel: 0.35 })
prism({ wall: white, win, roof, ring: B, z0: 0, z1: HB, facade: whiteFacade, bevel: 0.35 })
prism({ wall: brick, win, roof, coping: white, ring: C, z0: 0, z1: HC, facade: towerFacade, bevel: 0.35 })

// The cornice and frieze bands at each top, the A core's too; a storey band on B.
const ccw = (r: XY[]) => { let s = 0; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] } return s < 0 ? [...r].reverse() : r }
for (const [r, h] of [[A, HA], [A_CORE, HA2], [C, HC]] as [XY[], number][]) {
  band(white, ccw(r), h - 4.2, h - 3.6, 0.25)
  band(white, ccw(r), h - 1.3, h - 0.7, 0.55)
}
band(white, ccw(B), HB - 1.6, HB - 0.6, 0.75)
band(white, ccw(B), 27.2, 27.8, 0.35)

// ─── The white two-storey base along Royal, arched windows, the canopy ───
{
  const x0 = -32.0, x1 = 46.9, y = 16.0
  block(white, x0 - 0.1, y - 0.6, x1 + 0.1, y + 0.35, 0, 8.6)
  block(white, x0 - 0.2, y - 0.6, x1 + 0.2, y + 0.6, 8.6, 9.2)
  const F = faceOf([x1 + 0.1, y + 0.35], [x0 - 0.1, y + 0.35])
  const n = Math.round((x1 - x0) / 4.6), p = (x1 - x0 + 0.2) / n
  for (let k = 0; k < n; k++) {
    const s = (k + 0.5) * p
    if (Math.abs(x1 - s - 3.0) < 3.5) continue // the entrance
    farch(win, F, s, 2.3, 1.4, 6.6, 0.06, 6)
  }
  const sE = x1 + 0.1 - 3.0
  fpanel(win, F, sE - 2.0, sE + 2.0, 0, 4.0, 0.06)
  // the entrance canopy, white, on Royal
  block(white, 3.0 - 4.2, y + 0.35, 3.0 + 4.2, y + 3.6, 4.3, 5.4)
}

// ─── The sign: a bold white lattice standing on C's roof, red neon letters, set across the roof facing west ───
{
  const c: [number, number] = [32.9, 4.8], d: [number, number] = [-0.826, -0.563] // along the sign (the lidar line), the reader's right
  const nrm: [number, number] = [d[1], -d[0]]                                      // toward the reader (compass ~273, west)
  const z0 = HC, H = 2.9
  const place = (u: number, v: number, w: number): V3 => [c[0] + d[0] * u + nrm[0] * w, c[1] + d[1] * u + nrm[1] * w, v]
  // the lattice: posts, rails and two cross braces per bay, bold enough to read
  const L = 21.4, top1 = z0 + 7.2, top2 = z0 + 11.3
  const bar = (u0: number, v0: number, u1: number, v1: number, t = 0.45) => {
    const a = place(u0, v0, -0.4), b = place(u1, v1, -0.4)
    const du = u1 - u0, dv = v1 - v0, l = Math.hypot(du, dv), ou = (-dv / l) * t / 2, ov = (du / l) * t / 2
    const q = (u: number, v: number, w: number) => place(u, v, w)
    const pts = [[u0 + ou, v0 + ov], [u1 + ou, v1 + ov], [u1 - ou, v1 - ov], [u0 - ou, v0 - ov]] as Pt[]
    const ring0 = pts.map(([u, v]) => q(u, v, -0.4 - t / 2)), ring1 = pts.map(([u, v]) => q(u, v, -0.4 + t / 2))
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; frame.quad(ring0[i], ring0[j], ring1[j], ring1[i]); frame.quad(ring0[i], ring1[i], ring1[j], ring0[j]) }
    void a; void b
  }
  const posts = [-L / 2, -L / 4, 0, L / 4, L / 2]
  for (const u of posts) bar(u, z0, u, Math.abs(u) <= L / 4 + 0.01 ? top2 : top1)
  bar(-L / 2, z0 + 0.25, L / 2, z0 + 0.25); bar(-L / 2, top1, L / 2, top1); bar(-L / 4, top2, L / 4, top2)
  for (let k = 0; k < 4; k++) { const ua = posts[k], ub = posts[k + 1]; bar(ua, z0 + 0.25, ub, top1); bar(ub, z0 + 0.25, ua, top1) }
  bar(-L / 4, top1, 0, top2); bar(L / 4, top1, 0, top2); bar(0, top1, -L / 4, top2); bar(0, top1, L / 4, top2)
  // feet: low plinths where the posts stand on the roof
  for (const u of posts) { const [x, y] = place(u, 0, -0.4); block(frame, x - 0.45, y - 0.45, x + 0.45, y + 0.45, z0 - 0.05, z0 + 0.4) }
  // the letters
  const w = 0.55, pitch = 0.72, ch = 0.15
  const glyph: Record<string, (pen: Pen, x: number) => void> = {
    H: (p, x) => { p.moveTo([x, 0]).lineTo([x, 1]); p.moveTo([x + w, 0]).lineTo([x + w, 1]); p.moveTo([x, 0.5]).lineTo([x + w, 0.5]) },
    O: (p, x) => { p.moveTo([x + ch, 0]).lineTo([x + w - ch, 0]).lineTo([x + w, ch]).lineTo([x + w, 1 - ch]).lineTo([x + w - ch, 1]).lineTo([x + ch, 1]).lineTo([x, 1 - ch]).lineTo([x, ch]).lineTo([x + ch, 0]) },
    T: (p, x) => { p.moveTo([x, 1]).lineTo([x + w, 1]); p.moveTo([x + w / 2, 1]).lineTo([x + w / 2, 0]) },
    E: (p, x) => { p.moveTo([x + w, 1]).lineTo([x, 1]).lineTo([x, 0]).lineTo([x + w, 0]); p.moveTo([x, 0.52]).lineTo([x + w * 0.8, 0.52]) },
    L: (p, x) => { p.moveTo([x, 1]).lineTo([x, 0]).lineTo([x + w, 0]) },
    M: (p, x) => { p.moveTo([x, 0]).lineTo([x, 1]).lineTo([x + w / 2, 0.38]).lineTo([x + w, 1]).lineTo([x + w, 0]) },
    N: (p, x) => { p.moveTo([x, 0]).lineTo([x, 1]).lineTo([x + w, 0]).lineTo([x + w, 1]) },
  }
  const word = (s: string, u0: number, v0: number) => {
    const pen = new Pen()
    ;[...s].forEach((ch2, i) => glyph[ch2](pen, i * pitch))
    const len = (s.length - 1) * pitch + w
    strokes(neon, pen.paths, { width: 0.13, depth: 0.12, back: true, place: (u, v, ww) => place(u0 + (u - len / 2) * H, v0 + v * H, ww * H) })
  }
  word('MONTELEONE', 0, z0 + 3.6)
  word('HOTEL', 0, z0 + 3.6 + H + 0.9)
}

finishModel('Hotel Monteleone', 'nola-hotel-monteleone', [
  { part: brick, material: finish('monteleone-brick', 0xd8c49a) },
  { part: white, material: finish('monteleone-terracotta', 0xf1eee6) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: neon, material: finish('neon-monteleone-red', 0xd2452f) },
  { part: frame, material: finish('sign-lattice', 0xf1f1ec) },
], { bearing: 307.5, osm: 'way/208608976', height: 64.3 }, 6500)
