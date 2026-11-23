/**
 * Jane's Carousel, Brooklyn Bridge Park (DUMBO): procedural, CC0-1.0.
 * bun generators/nyc-janes-carousel.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the OSM square runs
 * north-south to within 0.1°). The origin is the centroid of OSM
 * way/223183095 (attraction=carousel, material=glass), on the plinth.
 *
 * The landmark. The 1922 Philadelphia Toboggan Company carousel (PTC #6;
 * 48 horses, two chariots), restored by Jane Walentas and opened in 2011
 * in a pavilion by Jean Nouvel (Wikipedia, "Jane's Carousel"): a square
 * clear box of tall glass panels in a slender pale mint-grey steel frame,
 * some of them folding accordion doors that stack at the corners in summer,
 * a thin flat roof slab with a white fascia and a big round skylight (the
 * oculus) over the carousel, four round columns inside, all on a low grey
 * granite plinth with broad steps on the boardwalk side. Inside, the cream
 * and gold round canopy with its painted oval shields and bulbs, the honey
 * wooden platform and the painted horses.
 *
 * Numbers:
 *   box 21.7 x 21.8 m: OSM way/223183095 (lidar shows the same 22 m).
 *   roof 8.35 m above the plinth: measured, lidar (USGS NY_NewYorkCity,
 *     2017 flight, after the 2011 opening): roof 11.6 m and plinth/plaza
 *     3.25 m above the box's ground_min. OSM's height=7 is low.
 *   oculus radius 6.2 m, skylight 0.4 m below the roof: measured, lidar
 *     (the returns drop 0.3–0.5 m and thin out over a ~13 m circle), and
 *     the photo "Jane's Carousel, Dumbo Brooklyn in July 2017" (the oculus
 *     spans a little over half the roof).
 *   fascia 1.0 m: estimated from the same photo (about an eighth of the
 *     wall height).
 *   mullions: the photos show ~16 panels a side (1.35 m); drawn at half
 *     that density, 8 bays a side, as STYLE.md asks for thin members.
 *   columns, four, 0.6 m round, at (±6.8, ±6.8): estimated. One shows
 *     through the west wall in the 2017 photo and "Janes Carousel glass
 *     house BB jeh", the others are hidden by the carousel.
 *   plinth: the real granite plinth is the ground level of the whole
 *     carousel plaza (lidar: 3.2–3.3 m all round within 16 m; the map's
 *     terrain is flat there too), stepping down ~0.9 m to the boardwalk on
 *     the south and east beyond the model. Only a granite curb 1.2 m wide
 *     round the box is drawn, so the box reads as standing on a base. It
 *     is 0.45 m tall because the map's terrain rises 0.28 m across the
 *     footprint and buried a 0.2 m curb; the box keeps its 8.35 m over it
 *     (less 0.2 m), so the roof is at 8.6 m.
 *   colours: frame and fascia pale mint-grey, from all the photos; the
 *     canopy top is a grey-olive in the 2017 and 2019 photos, drawn instead
 *     in the lit cream so the carousel reads through the oculus from above
 *     (a grey top vanished at phone size); the rim and shields are gold.
 *   carousel: platform radius 6.6 m, canopy radius 7.2 m, canopy rim 3.4–
 *     4.4 m, shields to 5.1 m, cone to 6.0 m: estimated from the photos
 *     (the canopy spans about two thirds of the box; its crest sits well
 *     below the fascia). 18 shields round the rim, as in "Jane's Carousel
 *     in 2025". Horses: the outer two rows only (18 + 15), as bold blocks.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Jane's Carousel, Dumbo Brooklyn in July 2017", MusikAnimal, CC BY-SA 4.0
 *     (from the Brooklyn Bridge, above, south-east: roof, oculus, plinth)
 *   "Jane's Carousel in 2025", Enciclopedia1993, CC BY 4.0 (the canopy,
 *     horses and the oculus from inside)
 *   "Janes Carousel glass house BB jeh", Jim.henderson, CC0 (from the
 *     south-east, closed: the folding panels, the frame, the steps)
 *   "Janes Carousel Bklyn sunset jeh", Jim.henderson, CC0 (from the east)
 *   "Janes Carousel glass house MB jeh", Jim.henderson, CC0 (from the
 *     south, under the Manhattan Bridge)
 *   "Jane's Carousel" (Cubie King), CC BY-SA 3.0 (from the north-east,
 *     over the water)
 *   "Jane's Carousel 2019 (Manhattan Bridge in background)", Wgreaves,
 *     CC BY-SA 4.0 (open, the soffit and the corner door stacks)
 * Look-only: none.
 *
 * Night. The carousel is lit inside the box: the canopy rim, its shields and
 * bulbs are `neon-janes-canopy` (cream gold) and the canopy's cone and
 * underside, the centre drum and the white horses are `window`, so they glow warm; the glass is
 * `glass` (translucent, stays dark) and the frame is unlit.
 *
 * Doubts: the column positions; the carousel's real diameter (no published
 * figure found; estimated from photos); the folded door stacks of the open
 * pavilion are not drawn (the box is shown closed, as in winter).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { finish } from './palette'
import { finishModel, quadN, unit } from './nyc-570-lexington'

const TAU = Math.PI * 2
const HX = 10.85, HY = 10.9            // half sizes of the box (OSM)
const CURB = 0.45, CURB_W = 1.2        // granite curb round the box
const ROOF = 8.35 + CURB - 0.2, FASCIA = 1.0, SOFFIT = ROOF - FASCIA
const OCULUS = 6.2, SKY = ROOF - 0.4

const steel = new Part(), glass = new Part(), granite = new Part()
const canopy = new Part(), lit = new Part(), wood = new Part()

/** An axis-aligned box with all six faces, outward. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bottom = false) {
  p.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
  if (bottom) p.quad([x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0])
  p.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1])
  p.quad([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1])
  p.quad([x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1])
  p.quad([x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1])
}

/** A box turned to bearing b about its own centre (cx, cy): u along, w across. */
function obox(p: Part, cx: number, cy: number, b: number, u: number, w: number, z0: number, z1: number) {
  const ca = Math.cos(b), sa = Math.sin(b)
  const P = (du: number, dw: number, z: number): V3 => [cx + du * ca - dw * sa, cy + du * sa + dw * ca, z]
  const c = [P(-u, -w, 0), P(u, -w, 0), P(u, w, 0), P(-u, w, 0)]
  const at = (k: number, z: number): V3 => [c[k][0], c[k][1], z]
  p.quad(at(0, z1), at(1, z1), at(2, z1), at(3, z1))
  for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; p.quad(at(k, z0), at(l, z0), at(l, z1), at(k, z1)) }
}

/** A smooth vertical cylinder wall, outward (or inward with `inward`). */
function cyl(p: Part, cx: number, cy: number, r0: number, r1: number, z0: number, z1: number, n: number, inward = false, phase = 0) {
  for (let k = 0; k < n; k++) {
    const a = phase + (k / n) * TAU, b = phase + ((k + 1) / n) * TAU
    const s = inward ? -1 : 1
    const slope = (r0 - r1) / (z1 - z0)
    const na = unit([s * Math.cos(a), s * Math.sin(a), s * slope]), nb = unit([s * Math.cos(b), s * Math.sin(b), s * slope])
    const A0: V3 = [cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), z0], B0: V3 = [cx + r0 * Math.cos(b), cy + r0 * Math.sin(b), z0]
    const A1: V3 = [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), z1], B1: V3 = [cx + r1 * Math.cos(b), cy + r1 * Math.sin(b), z1]
    quadN(p, A0, B0, B1, A1, [na, nb, nb, na])
  }
}

/** A flat disc (up or down). */
function disc(p: Part, cx: number, cy: number, r: number, z: number, n: number, up = true) {
  for (let k = 0; k < n; k++) {
    const a = (k / n) * TAU, b = ((k + 1) / n) * TAU
    const c: V3 = [cx, cy, z], A: V3 = [cx + r * Math.cos(a), cy + r * Math.sin(a), z], B: V3 = [cx + r * Math.cos(b), cy + r * Math.sin(b), z]
    if (up) p.tri(c, A, B); else p.tri(c, B, A)
  }
}

// ------------------------------------------------------------ the plinth ---
// A low granite curb round the box: top and sides only (the ground is the map's).
{
  const X = HX + CURB_W, Y = HY + CURB_W
  granite.quad([-X, -Y, CURB], [X, -Y, CURB], [X, Y, CURB], [-X, Y, CURB])
  granite.quad([-X, -Y, 0], [X, -Y, 0], [X, -Y, CURB], [-X, -Y, CURB])
  granite.quad([X, -Y, 0], [X, Y, 0], [X, Y, CURB], [X, -Y, CURB])
  granite.quad([X, Y, 0], [-X, Y, 0], [-X, Y, CURB], [X, Y, CURB])
  granite.quad([-X, Y, 0], [-X, -Y, 0], [-X, -Y, CURB], [-X, Y, CURB])
}

// ------------------------------------------------------------ the box ---
// Glass walls 0.12 m inside the frame line, one sheet a side, translucent.
{
  const gx = HX - 0.12, gy = HY - 0.12
  glass.quad([-gx, -gy, CURB], [gx, -gy, CURB], [gx, -gy, SOFFIT], [-gx, -gy, SOFFIT])
  glass.quad([gx, -gy, CURB], [gx, gy, CURB], [gx, gy, SOFFIT], [gx, -gy, SOFFIT])
  glass.quad([gx, gy, CURB], [-gx, gy, CURB], [-gx, gy, SOFFIT], [gx, gy, SOFFIT])
  glass.quad([-gx, gy, CURB], [-gx, -gy, CURB], [-gx, -gy, SOFFIT], [-gx, gy, SOFFIT])
}
// Corner posts, the sill, and mullions at half the real density (8 bays a side).
const POST = 0.42, MUL = 0.16, SILL = 0.3
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const x0 = sx < 0 ? -HX : HX - POST, y0 = sy < 0 ? -HY : HY - POST
  box(steel, x0, y0, CURB, x0 + POST, y0 + POST, SOFFIT)
}
const BAYS = 8
for (let k = 0; k <= BAYS; k++) {
  const tx = -HX + POST + ((2 * HX - 2 * POST) * k) / BAYS, ty = -HY + POST + ((2 * HY - 2 * POST) * k) / BAYS
  // sill bars run the full side once; mullions only between the posts
  if (k > 0 && k < BAYS) {
    box(steel, tx - MUL / 2, -HY, CURB, tx + MUL / 2, -HY + 0.18, SOFFIT)       // south
    box(steel, tx - MUL / 2, HY - 0.18, CURB, tx + MUL / 2, HY, SOFFIT)         // north
    box(steel, -HX, ty - MUL / 2, CURB, -HX + 0.18, ty + MUL / 2, SOFFIT)       // west
    box(steel, HX - 0.18, ty - MUL / 2, CURB, HX, ty + MUL / 2, SOFFIT)         // east
  }
}
box(steel, -HX + POST, -HY, CURB, HX - POST, -HY + 0.2, CURB + SILL)
box(steel, -HX + POST, HY - 0.2, CURB, HX - POST, HY, CURB + SILL)
box(steel, -HX, -HY + POST, CURB, -HX + 0.2, HY - POST, CURB + SILL)
box(steel, HX - 0.2, -HY + POST, CURB, HX, HY - POST, CURB + SILL)

// Four round columns inside, under the roof.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) cyl(steel, sx * 6.8, sy * 6.8, 0.3, 0.3, CURB, SOFFIT, 12)

// The roof slab: fascia walls, the top and the soffit as a square ring round
// the oculus, the oculus's inner wall and its skylight.
{
  steel.quad([-HX, -HY, SOFFIT], [HX, -HY, SOFFIT], [HX, -HY, ROOF], [-HX, -HY, ROOF])
  steel.quad([HX, -HY, SOFFIT], [HX, HY, SOFFIT], [HX, HY, ROOF], [HX, -HY, ROOF])
  steel.quad([HX, HY, SOFFIT], [-HX, HY, SOFFIT], [-HX, HY, ROOF], [HX, HY, ROOF])
  steel.quad([-HX, HY, SOFFIT], [-HX, -HY, SOFFIT], [-HX, -HY, ROOF], [-HX, HY, ROOF])
  const N = 32
  const sq = (a: number): [number, number] => {
    const c = Math.cos(a), s = Math.sin(a), m = Math.max(Math.abs(c) / HX, Math.abs(s) / HY)
    return [c / m, s / m]
  }
  for (let k = 0; k < N; k++) {
    const a = (k / N) * TAU, b = ((k + 1) / N) * TAU
    const [ox0, oy0] = sq(a), [ox1, oy1] = sq(b)
    const ix0 = OCULUS * Math.cos(a), iy0 = OCULUS * Math.sin(a), ix1 = OCULUS * Math.cos(b), iy1 = OCULUS * Math.sin(b)
    steel.quad([ix0, iy0, ROOF], [ox0, oy0, ROOF], [ox1, oy1, ROOF], [ix1, iy1, ROOF])
    steel.quad([ix1, iy1, SOFFIT], [ox1, oy1, SOFFIT], [ox0, oy0, SOFFIT], [ix0, iy0, SOFFIT])
  }
  cyl(steel, 0, 0, OCULUS, OCULUS, SKY, ROOF, N, true)
  cyl(steel, 0, 0, OCULUS, OCULUS, SOFFIT, SKY - 0.05, N, true)
  disc(glass, 0, 0, OCULUS, SKY, N)
  // The skylight's radial ribs and its small centre ring, as in the photos.
  // Drawn at half their real count (8 of 16), thin, so the carousel shows through.
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * TAU + TAU / 16
    obox(steel, (OCULUS / 2 + 0.6) * Math.cos(a), (OCULUS / 2 + 0.6) * Math.sin(a), a, OCULUS / 2 - 0.6, 0.06, SKY - 0.2, SKY + 0.04)
  }
  cyl(steel, 0, 0, 1.2, 1.2, SKY - 0.2, SKY + 0.04, 16)
}

// ------------------------------------------------------------ the carousel ---
const PT = CURB + 0.45                       // platform top
cyl(wood, 0, 0, 6.6, 6.6, CURB, PT, 32)
disc(wood, 0, 0, 6.6, PT, 32)
// The centre drum with its painted panels, lit at night.
cyl(lit, 0, 0, 1.8, 1.8, PT, 3.5, 16)
// The canopy: underside, the gold rim band with its bulbs, the shields on top,
// and the cream cone up to the centre pole's cap.
{
  const N = 24, R0 = 7.2, RB = 3.45, RT = 4.4
  for (let k = 0; k < N; k++) {
    const a = (k / N) * TAU, b = ((k + 1) / N) * TAU
    lit.quad([1.8 * Math.cos(b), 1.8 * Math.sin(b), RB + 0.3], [R0 * Math.cos(b), R0 * Math.sin(b), RB],
      [R0 * Math.cos(a), R0 * Math.sin(a), RB], [1.8 * Math.cos(a), 1.8 * Math.sin(a), RB + 0.3])
  }
  cyl(canopy, 0, 0, R0, R0, RB, RT, N)
  // A scalloped valance under the rim: small teeth, one per segment.
  for (let k = 0; k < N; k++) {
    const a = ((k + 0.5) / N) * TAU, b = a + TAU / N * 0.45, c = a - TAU / N * 0.45
    canopy.tri([R0 * Math.cos(c), R0 * Math.sin(c), RB], [R0 * Math.cos(b), R0 * Math.sin(b), RB], [R0 * Math.cos(a), R0 * Math.sin(a), RB - 0.35])
  }
  // 18 oval shields standing on the rim, with lower crests between them.
  for (let k = 0; k < 18; k++) {
    const a = (k / 18) * TAU, t = a + Math.PI / 2
    obox(canopy, 7.05 * Math.cos(a), 7.05 * Math.sin(a), t, 0.62, 0.12, RT - 0.05, RT + 0.75)
    const a2 = ((k + 0.5) / 18) * TAU
    obox(canopy, 7.05 * Math.cos(a2), 7.05 * Math.sin(a2), a2 + Math.PI / 2, 0.35, 0.1, RT - 0.05, RT + 0.4)
  }
  // The cone, from just inside the rim to the centre.
  cyl(lit, 0, 0, R0 - 0.15, 0.7, RT - 0.02, 6.0, N)
  disc(lit, 0, 0, 0.7, 6.0, 12)
  cyl(canopy, 0, 0, 0.35, 0.15, 6.0, 6.6, 8)
}
// Horses: the outer two rows, facing anticlockwise (the way an American
// carousel turns), brown and white alternating, as bold blocks.
function horse(p: Part, r: number, a: number) {
  const cx = r * Math.cos(a), cy = r * Math.sin(a), t = a + Math.PI / 2     // t: direction of travel
  const along = (d: number): [number, number] => [cx + d * Math.cos(t), cy + d * Math.sin(t)]
  obox(p, cx, cy, t, 0.72, 0.2, PT + 0.95, PT + 1.45)                     // body
  const [hx, hy] = along(0.7)
  obox(p, hx, hy, t + 0.5, 0.26, 0.14, PT + 1.3, PT + 2.05)               // neck and head, reared
  obox(p, cx, cy, t, 0.58, 0.13, PT + 0.15, PT + 0.95)                    // legs, as one block
}
for (let k = 0; k < 18; k++) horse(k % 2 ? wood : lit, 5.9, (k / 18) * TAU)
for (let k = 0; k < 15; k++) horse(k % 3 === 1 ? lit : wood, 4.55, ((k + 0.5) / 15) * TAU)

const parts: { part: Part; material: MaterialSpec }[] = [
  { part: glass, material: { name: 'glass', color: 0x8fcbe0, roughness: 0.2, opacity: 0.24, doubleSided: true } },
  { part: steel, material: finish('janes-steel', 0xd3e6df) },
  { part: granite, material: finish('janes-granite', 0xb4b7b6) },
  { part: canopy, material: finish('neon-janes-canopy', 0xe2b65a) },
  { part: lit, material: { name: 'window', color: 0xead7ad, roughness: 0.6 } },
  { part: wood, material: finish('janes-wood', 0xb07a4c) },
]
finishModel("Jane's Carousel", 'nyc-janes-carousel', parts, {
  bearing: 0, elevation: 0, height: ROOF, osm: 'way/223183095',
})
