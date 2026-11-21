/**
 * 1 Independent Square (Independent Life Building 1974-, Modis Building to
 * 2011, Wells Fargo Center 2011-2024), Jacksonville — original procedural
 * geometry, CC0-1.0.
 * bun generators/jax-wells-fargo-center.ts
 *
 * KBJ Architects, 1974; 37 storeys, 163 m, the city's tallest building until
 * 1990. A rectangular slab framed in pale granite: solid corner piers and a
 * deep solid band across the top, with dark glass curtain walls set between
 * them, ruled by vertical mullions. At its foot a glazed atrium skirt slopes
 * down on all four sides from about 27 m, and each corner pier runs on down
 * the skirt's hip as a stone buttress to the ground.
 *
 * Frame: x east, y north, z up, metres (glTF +Y up, -Z north). BEARING 14.25:
 * the OSM outlines' edges run 14-14.5° clockwise of the compass, so +x (the
 * tower's long axis) points ESE. Origin = centroid of the outline
 * way/170068028.
 *
 * Evidence
 * - OSM way/170068028 (Wells Fargo Tower, 37 levels, wikidata Q7981655):
 *   the skirt, x -48..48, y -34..37.6 with diagonal ears at the four
 *   corners reaching (±51, ±40.5). Part way/591248455 (height 163, glass):
 *   the tower, x -26..25.7, y -15.3..15.9, corners notched. Roof
 *   way/591253923 (building=roof): the south entrance canopy, x -12..12,
 *   y -48.4..-37.6.
 *   Not included: way/170068034 (Life of the South Building) and the
 *   relation/8330189 next door.
 * - USGS 3DEP lidar FL_Peninsular_FDEM_Duval_2018 (flown 2018), 1 m grid
 *   read in this frame; the street around is ~3.5 m above the grid minimum
 *   (the minimum is the falling ground east toward the river). Above the
 *   street: tower roof 160.5 (rim 161.5); the skirt falls from ~27 at the
 *   tower faces to ~11.5 m four metres out from the edge, and is 9.2 m at its
 *   edge on every side (a vertical glazed wall below); the canopy 5.7. The
 *   tower top reads about a metre wider each way than the OSM part.
 * - Published (Wikipedia "1 Independent Square"; Emporis/CTBUH): 163 m
 *   (535 ft), 37 floors, 1974; renamed from Wells Fargo Center in July 2024.
 * - Photos (Commons):
 *   · "Wells Fargo Center, Jacksonville, FL, US.jpg", Jud McCranie,
 *     CC BY-SA 4.0 (from the south-east, Ocean St: the stone frame and top
 *     band, the skirt and a corner buttress),
 *     https://commons.wikimedia.org/wiki/File:Wells_Fargo_Center,_Jacksonville,_FL,_US.jpg
 *   · "Wells Fargo tower from Forsyth, Ocean Sts.JPG", Michael Rivera,
 *     CC BY-SA 4.0 (from the east),
 *     https://commons.wikimedia.org/wiki/File:Wells_Fargo_tower_from_Forsyth,_Ocean_Sts.JPG
 *   · "Wells Fargo Center JAX.JPG", Jeff Cragar, CC BY-SA 3.0 (inside the
 *     atrium: the sloped skylight on raking beams),
 *     https://commons.wikimedia.org/wiki/File:Wells_Fargo_Center_JAX.JPG
 *
 * Measured: tower plan (OSM, widened 0.5 m a side to the lidar), roof
 * height, skirt heights and slope, canopy height (lidar).
 * Published: total height 163 (drawn 162: lidar roof plus parapet).
 * Estimated from the photos (p1 from the south-east, p3 from the east-
 * south-east): corner piers 3.6 m on each face (about a ninth of the narrow
 * face), standing 0.6 m proud of the glass; the top band 16 m (about 10% of
 * the height); mullion fins every ~5.5 m (the real ones are much finer and
 * denser; thinned out so the glass reads as one dark plane at map distance,
 * not stripes); the buttresses 4 m wide.
 * Invented: none beyond simplification.
 *
 * Night: the curtain walls are `window`, the skirt's vertical walls
 * `entrance`; the sloped atrium skylight is `glass` and stays dark. The
 * Wells Fargo letters at the top came down in 2024 and are not drawn.
 *
 * Doubts: the skirt's foot is hidden by trees in every photo, so its 9 m
 * vertical wall rests on lidar alone; the canopy posts are guessed.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 14.25
const ANCHOR = { lng: -81.65891743, lat: 30.32589845 }

const stone = new Part(), wall = new Part(), sky = new Part(), roof = new Part(), base = new Part()

const TX = 26.5, TY = 16 // tower half-sizes
const TOP = 162, BAND = 16, PIER = 3.6, PROUD = 0.6
const SK_TOP = 27, SK_EDGE = 9.2, SX = 48, SY = 37.6

const rect = (hx: number, hy: number, z: number, cx = 0, cy = 0): V3[] => [
  [cx - hx, cy - hy, z], [cx + hx, cy - hy, z], [cx + hx, cy + hy, z], [cx - hx, cy + hy, z],
]
function box(p: Part, top: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  if (top) top.cap(r(z1), true)
}

// ─── tower: glass core, stone corner piers, the stone top band ───
const GI = PROUD // glass face set back from the piers
wall.loft([rect(TX - GI, TY - GI, SK_TOP - 2), rect(TX - GI, TY - GI, TOP - BAND)])
{
  const bev = 0.5
  stone.loft([rect(TX, TY, TOP - BAND), rect(TX, TY, TOP - bev), rect(TX - bev, TY - bev, TOP)])
  stone.cap(rect(TX, TY, TOP - BAND), false)
  roof.cap(rect(TX - bev, TY - bev, TOP), true)
}
// Corner piers: L-shaped, built as two boxes per corner, from the skirt up to the band.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const x0 = sx < 0 ? -TX : TX - PIER, x1 = sx < 0 ? -TX + PIER : TX
  const y0 = sy < 0 ? -TY : TY - PIER, y1 = sy < 0 ? -TY + PIER : TY
  box(stone, null, x0, x1, y0, y1, SK_TOP - 3, TOP - BAND)
}
// Mullion fins: pale vertical lines on the glass, spaced ~3 m between the piers.
function fins(len: number, place: (s: number) => [number, number, number, number]) {
  const span = 2 * (len - PIER), n = Math.round(span / 5.5)
  for (let i = 1; i < n; i++) {
    const s = -len + PIER + (span * i) / n
    const [x0, x1, y0, y1] = place(s)
    box(stone, null, x0, x1, y0, y1, SK_TOP - 1, TOP - BAND)
  }
}
const FW = 0.2, FD = 0.3
fins(TX, (s) => [s - FW, s + FW, -TY + GI - FD, -TY + GI]) // south
fins(TX, (s) => [s - FW, s + FW, TY - GI, TY - GI + FD]) // north
fins(TY, (s) => [-TX + GI - FD, -TX + GI, s - FW, s + FW]) // west
fins(TY, (s) => [TX - GI, TX - GI + FD, s - FW, s + FW]) // east

// ─── the atrium skirt: a vertical glazed wall, then a hipped glass slope up to the tower ───
base.loft([rect(SX, SY, 0), rect(SX, SY, SK_EDGE)])
{
  const lo = rect(SX, SY, SK_EDGE), hi = rect(TX - GI, TY - GI, SK_TOP)
  sky.loft([lo, hi])
  // a stone kerb along the slope's foot so the edge reads
  stone.loft([rect(SX, SY, SK_EDGE - 0.6), rect(SX, SY, SK_EDGE + 0.15)])
}
// Corner buttresses: the corner piers carried down the hips to the ground at the OSM ears.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const a: [number, number] = [sx * (TX - 1.5), sy * (TY - 1.5)], b: [number, number] = [sx * 50.6, sy * 40.4]
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const ux = dx / l, uy = dy / l, nx = -uy * 2.1, ny = ux * 2.1
  const zA = SK_TOP + 1.5, zB = 6.5
  // corners of the blade: left/right at a and b, bottom and top
  const L = (p: [number, number], z: number): V3 => [p[0] + nx, p[1] + ny, z]
  const R = (p: [number, number], z: number): V3 => [p[0] - nx, p[1] - ny, z]
  // the side faces, wound to face outward whichever corner this is
  const sideL: V3[] = [L(a, 0), L(b, 0), L(b, zB), L(a, zA)]
  const sideR: V3[] = [R(b, 0), R(a, 0), R(a, zA), R(b, zB)]
  const topF: V3[] = [L(a, zA), L(b, zB), R(b, zB), R(a, zA)]
  const endF: V3[] = [L(b, 0), R(b, 0), R(b, zB), L(b, zB)]
  // L is to the left of a→b, so the left face's outward normal is (nx, ny): check winding by cross product
  const flip = (q: V3[]) => {
    const e1 = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], e2 = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
    return [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  }
  const emit = (q: V3[], want: [number, number, number]) => {
    const n = flip(q)
    const ok = n[0] * want[0] + n[1] * want[1] + n[2] * want[2] > 0
    const r = ok ? q : [...q].reverse()
    stone.quad(r[0], r[1], r[2], r[3])
  }
  emit(sideL, [nx, ny, 0]); emit(sideR, [-nx, -ny, 0]); emit(topF, [0, 0, 1]); emit(endF, [ux, uy, 0])
}

// ─── the south entrance canopy (way/591253923) ───
box(stone, roof, -12, 12, -48.4, -SY, 5.0, 5.9)
for (const x of [-11, 11]) box(stone, null, x - 0.35, x + 0.35, -48, -47.3, 0, 5.0)

const parts = [
  { part: stone, material: finish('ils-granite', 0xddd5ca) },
  { part: wall, material: { ...PALETTE.window, color: 0x5f7487 } },
  { part: sky, material: { ...PALETTE.glass, color: 0x7189a0 } },
  { part: base, material: { ...PALETTE.entrance, color: 0x72889a } },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('1 Independent Square', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/170068028', 'way/591248455', 'way/591253923'],
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/jax-wells-fargo-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
