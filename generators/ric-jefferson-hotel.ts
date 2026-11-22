/**
 * The Jefferson Hotel, 101 West Franklin Street, Richmond, Virginia (1895,
 * Carrère & Hastings; rebuilt and extended south after the 1901 fire,
 * 1907) — original procedural geometry, CC0-1.0.
 * bun generators/ric-jefferson-hotel.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 37 (the block's walls run at 37° and 127°): the
 * model's "north" is the Franklin Street front, its "south" Main Street,
 * "west" Jefferson Street and "east" Adams Street.
 * Anchor = the area centroid of the three outer ways of OSM
 * relation/15964877 (way/264518639 and the annexes way/264518640,
 * way/264518641): -77.445436, 37.544276.
 *
 * Identity (from the photos below):
 *  1. Two tall square clock towers in buff brick, one on each long side
 *     where the 1895 Franklin Street block meets the 1907 block: a plain
 *     shaft with small arched windows and clock faces, a balustraded
 *     balcony, two arched belfry stages, a cornice and a small dome.
 *  2. The symmetrical Franklin Street front: a central block with a tall
 *     arched loggia, two square belvederes with arched loggias under broad
 *     low hip roofs with deep eaves, and lower end wings.
 *  3. The tall plain 1907 block behind, ten storeys, on a light-court plan.
 *  4. Buff (grey-yellow) brick throughout over a rusticated base, pale
 *     stone cornices and dressings.
 *
 * Plan and heights: USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown
 * 2014), 1 m grid, read in this frame (the generator is written in the
 * lidar grid's frame, centred at -77.44542, 37.54420, and shifted to the
 * anchor at the end). y = 0 is the lowest ground, at the Main Street /
 * Jefferson Street corner; the ground rises about 4.6 m to the Franklin
 * front at its west end and 5.9 m at its east end. Measured above y = 0:
 * the 1907 block 34.9 (with a light court at ~13), the towers' cornice
 * 38.3, belfry cornice ~47.2, dome top 51.9; the belvederes' eaves ~31.5
 * and hip peaks ~34.5; the Franklin centre block 26.8 with its front bay
 * 22.5; the end wings ~21; the west block behind the front ~34; the middle
 * block 18; the east block 24; the east annexes ~16 and ~13. Footprints
 * follow OSM except the west end wing of the Franklin front (x -39.5 ..
 * -30.3 in the lidar frame), which the lidar shows at ~21 m and OSM leaves
 * out; drawn to match the east wing, as the front is symmetrical in the
 * postcards. Estimated from the photos: the tower stage heights and widths,
 * the belvedere loggia, the loggia arches, the window bays.
 *
 * Ground: lidar ground rises from y = 0 at the south-west corner to ~4.6
 * (north-west) and ~5.9 (north-east); facade detail starts at the local
 * ground (`g` below). Elevation 0.
 *
 * Night: the stone and brick are floodlit (the towers most), windows glow.
 *
 * Photos (EVIDENCE):
 *  - Jefferson Hotel Richmond VA.jpg, Mentes at English Wikipedia, public
 *    domain (from Franklin and Jefferson Streets: the west belvedere, the
 *    west tower behind) https://commons.wikimedia.org/wiki/File:Jefferson_Hotel_Richmond_VA.jpg
 *  - Jefferson Hotel, Richmond, VA IMG 4050.JPG, Billy Hathorn, CC BY-SA 3.0
 *    (from Adams Street: the east tower, its dome and stages, the east
 *    belvedere, the 1907 block)
 *    https://commons.wikimedia.org/wiki/File:Jefferson_Hotel,_Richmond,_VA_IMG_4050.JPG
 *  - Jefferson Hotel, Richmond, Va (NYPL b12647398-73903), Detroit
 *    Publishing postcard, public domain (the whole Franklin front and long side)
 *    https://commons.wikimedia.org/wiki/File:Jefferson_Hotel,_Richmond,_Va_(NYPL_b12647398-73903).tiff
 *  - Jefferson Hotel, Richmond, Va., Boston Public Library (Tichnor
 *    postcard), CC BY 2.0 https://www.flickr.com/photos/24029425@N06/8631868928
 *  - USGS NAIP orthoimagery (public domain): roof plan and colours.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the postcards show red tile roofs; today's photos show grey slate,
 * used here. The south (Main Street) and east sides are seen only in the
 * postcard and NAIP; their window bays are generic. The two towers are drawn
 * alike (lidar gives both the same height and plan; the Hathorn photo shows
 * the east one's dome, the Mentes photo the west one's stages).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, hipRoof, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, cornice, edgePanels, save } from './atl-flatiron-building'

const buff = new Part(), stone = new Part(), win = new Part(), flat = new Part(), slate = new Part(), door = new Part()

/** Lidar-frame offset of the anchor (the outline's centroid). */
const OX = -6.23, OY = 5.87
/** Ground above y = 0 under a point, from the lidar ground. */
const g = (x: number, y: number) => Math.max(0, 0.1 + (y + 35) * 0.047 + (x + 37) * 0.03)

type F = [XY, XY]
type R = { x0: number; x1: number; y0: number; y1: number }
const faces = (r: R): Record<'s' | 'e' | 'n' | 'w', F> => ({
  s: [[r.x0, r.y0], [r.x1, r.y0]],
  e: [[r.x1, r.y0], [r.x1, r.y1]],
  n: [[r.x1, r.y1], [r.x0, r.y1]],
  w: [[r.x0, r.y1], [r.x0, r.y0]],
})
const ring = (r: R, d = 0): XY[] => [[r.x0 - d, r.y0 - d], [r.x1 + d, r.y0 - d], [r.x1 + d, r.y1 + d], [r.x0 - d, r.y1 + d]]
const fground = (f: F) => Math.max(g(f[0][0], f[0][1]), g(f[1][0], f[1][1]))

/**
 * A brick block with a rusticated stone base, a cornice, a flat roof and
 * grouped window panels (two storeys a panel) on the listed faces.
 */
function block(r: R, h: number, fs: ('s' | 'e' | 'n' | 'w')[], o: { bay?: number; base?: number; corn?: number; roof?: Part | null } = {}) {
  box(buff, r.x0, r.x1, r.y0, r.y1, 0, h, o.roof === undefined ? flat : o.roof, 0.2)
  cornice(stone, ring(r), h - 1.1, 0.9, o.corn ?? 0.7, null)
  const F = faces(r)
  for (const k of fs) {
    const f = F[k], z0 = fground(f)
    // rusticated base: a stone band to the first-floor sill
    const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
    onWall(stone, f[0], f[1], rectShape(0, L, 0, z0 + (o.base ?? 4.2)), 0.12)
    edgePanels(win, f[0], f[1], z0 + (o.base ?? 4.2) + 0.9, h - 1.8, { group: 7.4, gap: 2.6, bay: o.bay ?? 3.8, pier: 2.1, margin: 1.4, out: 0.06 })
    // ground-floor openings
    edgePanels(win, f[0], f[1], z0 + 1.0, z0 + (o.base ?? 4.2) - 0.5, { group: 9, gap: 0, bay: o.bay ?? 3.6, pier: 1.9, margin: 1.6, out: 0.15 })
  }
}

// ── The 1907 block (Main Street half), with its light court ──
block({ x0: -37.1, x1: -23.3, y0: -35.2, y1: 17 }, 34.9, ['s', 'w'])
block({ x0: -8.3, x1: 5.7, y0: -35.2, y1: 17 }, 34.9, ['s', 'e'])
block({ x0: -23.3, x1: -8.3, y0: 2.5, y1: 17 }, 34.9, [])
block({ x0: -23.3, x1: -8.3, y0: -35.2, y1: 2.5 }, 13, ['s'], { corn: 0.4 })
// the court's inner walls carry windows too (seen from above)
for (const f of [[[-23.3, -35.2 + 0.01], [-23.3, 2.5]], [[-8.3, 2.5], [-8.3, -35.2 + 0.01]], [[-8.3, 2.5], [-23.3, 2.5]]] as F[]) {
  const ff: F = [f[1], f[0]]
  edgePanels(win, ff[0], ff[1], 14.5, 33, { group: 7.4, gap: 2.6, bay: 3.8, pier: 2.1, margin: 1.4, out: 0.06 })
}

// ── Behind the Franklin front ──
block({ x0: -36.2, x1: -23, y0: 17, y1: 41.5 }, 34, ['w'])
block({ x0: -23, x1: -3, y0: 17, y1: 41.5 }, 18, [])
block({ x0: -3, x1: 7.9, y0: 17, y1: 36 }, 24, ['e'])
block({ x0: 5.7, x1: 26.2, y0: 17, y1: 27 }, 17, ['e', 'n'], { bay: 4 })
// the east annexes (way/264518640, way/264518641)
block({ x0: 9.5, x1: 31.3, y0: -33.6, y1: -2 }, 16.5, ['s', 'e', 'n'], { bay: 4.5 })
block({ x0: 31.3, x1: 43.3, y0: -31.5, y1: -5.2 }, 13, ['s', 'e', 'n'], { bay: 4.5 })

// ── The Franklin Street front, symmetrical about x = -16.5 ──
const FY = 59.6
const CX = -16.5
const mir = (r: R): R => ({ x0: 2 * CX - r.x1, x1: 2 * CX - r.x0, y0: r.y0, y1: r.y1 })
// end wings
const EW: R = { x0: -2.7, x1: 6.5, y0: 40.3, y1: 55.6 }
block(EW, 21, ['n', 'e'])
block(mir(EW), 21, ['n', 'w'])
// centre block, its taller back and lower loggia bay in front
block({ x0: -23.5, x1: -9.5, y0: 41.5, y1: 51 }, 26.8, [])
{
  const r: R = { x0: -23.5, x1: -9.5, y0: 50.5, y1: FY - 0.6 }
  box(buff, r.x0, r.x1, r.y0, r.y1, 0, 22.5, flat, 0.2)
  cornice(stone, ring(r), 21.4, 0.9, 0.7, null)
  const f = faces(r).n, z0 = fground(f)
  // rusticated ground storey with three doors, a balcony, three tall arches
  onWall(stone, f[0], f[1], rectShape(0, 14, 0, z0 + 5.2), 0.12)
  for (const s of [3.0, 7.0, 11.0]) {
    onWall(door, f[0], f[1], archShape(s, 2.0, z0, z0 + 2.6, 8), 0.18)
    onWall(stone, f[0], f[1], archShape(s, 3.4, z0 + 5.6, z0 + 12.2, 10), 0.08)
    onWall(win, f[0], f[1], archShape(s, 2.8, z0 + 5.9, z0 + 12.2, 10), 0.14)
    onWall(win, f[0], f[1], rectShape(s - 1.0, s + 1.0, z0 + 15.2, z0 + 17.6), 0.08)
  }
  box(stone, r.x0, r.x1, r.y1 - 0.2, r.y1 + 0.9, z0 + 5.2, z0 + 5.8, stone, 0.1, true)
  // front steps
  box(stone, r.x0 + 2, r.x1 - 2, r.y1, r.y1 + 1.6, 0, z0 + 0.6, stone, 0.1)
}
// belvederes: brick shaft, arched loggia storey, low hip roof with deep eaves
function belvedere(r: R) {
  const EAVE = 31.4, LOG = 26.6
  box(buff, r.x0, r.x1, r.y0, r.y1, 0, EAVE, null, 0)
  cornice(stone, ring(r), LOG - 0.9, 0.9, 0.35, null) // balustrade ledge
  const F = faces(r), z0 = fground(F.n)
  for (const k of ['n', 'e', 'w', 's'] as const) {
    const f = F[k], L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
    if (k === 'n') onWall(stone, f[0], f[1], rectShape(0, L, 0, z0 + 5.2), 0.12)
    // the loggia: two arches with an oculus between
    for (const s of [L * 0.28, L * 0.72]) {
      onWall(stone, f[0], f[1], archShape(s, 2.6, LOG, LOG + 2.4, 8), 0.06)
      onWall(win, f[0], f[1], archShape(s, 2.0, LOG + 0.1, LOG + 2.5, 8), 0.1)
    }
    const oc: [number, number][] = Array.from({ length: 10 }, (_, i) => [L / 2 + 0.45 * Math.cos((i / 10) * Math.PI * 2), LOG + 3.4 + 0.45 * Math.sin((i / 10) * Math.PI * 2)])
    onWall(win, f[0], f[1], oc, 0.08)
    // window bays below: paired windows grouped two storeys a panel
    if (k !== 's') edgePanels(win, f[0], f[1], z0 + 6.1, LOG - 1.6, { group: 7.0, gap: 2.4, bay: 2.8, pier: 1.5, margin: 1.5, out: 0.06 })
  }
  hipRoof(slate, r.x0, r.x1, r.y0, r.y1, EAVE, 34.5, 1.3)
  box(stone, r.x0 - 1.3, r.x1 + 1.3, r.y0 - 1.3, r.y1 + 1.3, EAVE - 0.5, EAVE, null, 0, true)
}
const BV: R = { x0: -9.9, x1: -2.7, y0: 48.6, y1: FY }
belvedere(BV)
belvedere(mir(BV))

// ── The two clock towers ──
function tower(cx: number, cy: number) {
  const H = 2.7
  const sq = (h: number, z0: number, z1: number, p: Part, bev = 0.1, bottom = false) => box(p, cx - h, cx + h, cy - h, cy + h, z0, z1, p, bev, bottom)
  const fs = (h: number): F[] => [
    [[cx - h, cy - h], [cx + h, cy - h]], [[cx + h, cy - h], [cx + h, cy + h]],
    [[cx + h, cy + h], [cx - h, cy + h]], [[cx - h, cy + h], [cx - h, cy - h]],
  ]
  sq(H, 0, 37.6, buff, 0)
  // quoin-like stone corner strips and the shaft's small arched windows
  for (const [a, b] of fs(H)) {
    for (const z of [26.5, 30.5]) onWall(win, a, b, archShape(H, 0.8, z, z + 1.2, 6), 0.06)
    // clock face
    const cl: [number, number][] = Array.from({ length: 14 }, (_, i) => [H + 1.25 * Math.cos((i / 14) * Math.PI * 2), 35.4 + 1.25 * Math.sin((i / 14) * Math.PI * 2)])
    onWall(stone, a, b, cl, 0.08)
    const cl2: [number, number][] = cl.map(([s, z]) => [H + (s - H) * 0.8, 35.4 + (z - 35.4) * 0.8])
    onWall(slate, a, b, cl2, 0.12)
  }
  // main cornice and the balustraded balcony
  sq(H + 0.45, 37.6, 38.3, stone, 0.15, true)
  sq(H + 0.35, 38.3, 39.1, stone, 0.05)
  // belfry stage 1: one big arch a face
  sq(H - 0.25, 39.1, 42.6, buff, 0)
  for (const [a, b] of fs(H - 0.25)) {
    onWall(stone, a, b, archShape(H - 0.25, 2.9, 39.2, 41.0, 8), 0.05)
    onWall(win, a, b, archShape(H - 0.25, 2.3, 39.3, 41.0, 8), 0.09)
  }
  sq(H + 0.1, 42.6, 43.2, stone, 0.1, true)
  // belfry stage 2: narrower, one arch a face
  sq(H - 0.6, 43.2, 46.5, buff, 0)
  for (const [a, b] of fs(H - 0.6)) {
    onWall(stone, a, b, archShape(H - 0.6, 2.4, 43.3, 45.0, 8), 0.05)
    onWall(win, a, b, archShape(H - 0.6, 1.8, 43.4, 45.0, 8), 0.09)
  }
  sq(H - 0.2, 46.5, 47.2, stone, 0.15, true)
  // the dome and its finial
  revolve(slate, [cx, cy], [[1.85, 47.2], [1.8, 48.4], [1.5, 49.9], [0.95, 50.9], [0.35, 51.4], [0.2, 51.6], [0.2, 52.0], [0, 52.3]], 12, 0)
}
tower(-34.4, 39.6)
tower(0.6, 38.6)

// shift from the lidar frame to the anchor
for (const p of [buff, stone, win, flat, slate, door]) {
  for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= OX; p.pos[i + 2] += OY } // glTF z = -north
}

const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[2] > 36 ? 1 : 0.7)
await save('ric-jefferson-hotel', 'The Jefferson Hotel', [
  { part: buff, material: { ...finish('jefferson-buff', 0xe3d8c2), floodlight: lit } },
  { part: stone, material: { ...finish('jefferson-stone', 0xf1e9db), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: flat, material: finish('jefferson-flat-roof', 0xb3a998) },
  { part: slate, material: finish('jefferson-slate', 0x8a9299) },
  { part: door, material: finish('jefferson-door', 0x7a6a58) },
], { height: 52.3, anchor: [37.544276, -77.445436], bearing: 37 })
