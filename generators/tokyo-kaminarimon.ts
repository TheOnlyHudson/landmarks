/**
 * Kaminarimon (雷門, Fūraijinmon), the outer gate of Sensō-ji, Asakusa,
 * Tokyo — procedural, CC0-1.0.
 * bun generators/tokyo-kaminarimon.ts
 *
 * Built with the temple kit exported from tokyo-sensoji.ts (and, through it,
 * the hanok kit in seoul-geunjeongjeon.ts).
 *
 * Map frame: x along the gate (east), y through it (north), z up, metres;
 * origin on the ground at the centroid of the OSM outline way/173154849.
 * The outline's long sides run at 94.6°, so the catalog bearing is 4.6; the
 * front, with the lantern's 雷門, faces south (-y) onto Kaminarimon-dōri,
 * and Nakamise runs north from the back.
 *
 * Identity, in order: the huge red chōchin lantern hung in the middle bay,
 * its black 雷門 written top to bottom on the front, brass fittings top and
 * bottom; the vermilion gate of three bays under one heavy grey-tiled gabled
 * roof with deep eaves turned up at the ends, the white plaster frieze and
 * the white line of rafter ends under the eaves; Fūjin and Raijin in the side
 * bays behind green lattice fences, Raijin's ring of gilt drums; the green
 * board 金龍山 over the passage.
 *
 * Evidence:
 *  - plan: OSM way/173154849 (17.4 × 12.5 m: the roof outline), the roof
 *    eaves taken from it (L 8.7, D 6.25 m). Published (the gate's tourist
 *    and Wikipedia entries): rebuilt 1960 in reinforced concrete, an
 *    eight-legged gate (hakkyakumon) with a kirizuma (gabled) roof of hongawara
 *    tile, frontage 11.4 m, height 11.7 m (OSM height 11.7), area 69.3 m²
 *    (so ~6.1 m deep). The brief called the roof hip-and-gable; the published
 *    description and every photo show a plain gable, which is followed.
 *  - lantern (ja.wikipedia, 雷門): 3.9 m high, 3.3 m across, ~700 kg. Drawn
 *    3.9 m with its brass (2.0-5.9 m), the paper barrel 2.3-5.55 m, its top
 *    just under the tie beam and the board, as in the front photos.
 *  - heights within the gate, scaled from Daderot's level front view
 *    (columns ~88 px/m): tie beam top 5.75 m; lattice fences 0-2.3 m; green
 *    transom grilles 4.8-5.3 m; white frieze 5.75-7.0 m; eave 8.0 m at the
 *    middle, the ends swept up 1.1 m; the roof slab thin (0.32 m: tile ends
 *    over a white line of rafter ends); ridge 10.45 m, its cap to 11.25 and
 *    the onigawara to 11.7 m (published). Round 2 of review: the roof had
 *    read as a heavy slab (~40% of the height); it is now ~30%, as in
 *    Christophe95's front photo. Columns at x ±2.5 and ±5.35 m
 *    (middle bay 5.0, side bays 2.85 m), three rows 3.05 m apart.
 *  - statues: Fūjin (east, with his wind bag) and Raijin (west, with his
 *    drums) facing south, Tenryū and Kinryū facing north (Wikipedia; photos
 *    of both faces). Drawn as simple dark figures on cloud pedestals.
 *  - colours (daylight photos): vermilion #cd5541, lantern red #c8282d,
 *    tile #6e7378-#9a9ea3, white plaster, green lattice #4a7d6c (pulled
 *    lighter), brass.
 *  - lettering: 雷 over 門, traced as heavy brush strokes from the front
 *    photos (Daderot; Christophe95 2018), each character ~1.7 m tall and
 *    ~2.8 m round the lantern. The back's 風雷神門 (Ph0kin's photo) is one
 *    column of four smaller characters, in the detail model only, as is the
 *    white edging of the strokes.
 *  - terrain: see the report; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Kaminarimon (outer gate), Sensoji Temple, Akakusa, Tokyo.jpg, Daderot, public domain (front, level)
 *  - Kaminarimon in 2018.jpg, Christophe95, CC BY-SA 4.0 (front, roof ends)
 *  - Kaminarimon1.jpg, KENPEI, CC BY 3.0 (front)
 *  - Senso-ji Kaminarimon 1.jpg and 3.jpg, Zairon, CC BY-SA 4.0
 *  - Kaminarimon reverse.jpg, Ph0kin, public domain (the back, north face)
 *  - Lantern of Kaminarimon Gate.JPG and (3).JPG, Tokumeigakarinoaoshima, CC0 (lantern, brass base)
 *  - Pnorama of Sensoji.jpg, Kakidai, CC BY-SA 4.0 (the roof from above, from the south)
 * No commercial imagery. No look-only references.
 *
 * Left out: the inscriptions on the brass and the board's gilt characters,
 * the wire mesh in front of the statues, the small lanterns and plaques.
 * Doubts: the depth of the eaves (from OSM only), the gable-end framing
 * (only seen at a slant), the statues' poses (simplified).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes, type Pt } from './lettering'
import { box, prism, bar, lathe, disc, ball, rbox, gableRoof, column, rafterEnds, quadOut, triOut, save, type Mat } from './tokyo-sensoji'

type Sizes = { detail: boolean }

function build(S: Sizes) {
  const verm = new Part(), tile = new Part(), plaster = new Part(), red = new Part(), gold = new Part(), green = new Part()
  const K = S.detail ? 2 : 1

  const XS = [-5.35, -2.5, 2.5, 5.35]
  const YS = [-3.05, 0, 3.05]
  const BEAM = 5.75 // top of the tie beams
  const FR = 7.0 // top of the frieze
  const ZE = 8.0 // eave top at the middle

  // Stone footing under the whole gate.
  box(tile, -5.95, -3.6, 0, 5.95, 3.6, 0.22, 'b')

  // Columns: the four main pillars on the middle row are heavier.
  for (const x of XS) for (const y of YS) {
    const r = y === 0 ? 0.43 : 0.36
    prism(tile, x, y, 0.22, 0.42, r + 0.12, r + 0.08, 8)
    column(verm, x, y, 0.42, BEAM - 0.1, r, S.detail ? 12 : 8)
  }
  // Tie beams along the three rows and across the ends, and a second lower
  // beam (nuki) at 4.5-4.8 m in the side bays.
  for (const y of YS) {
    box(verm, -5.75, y - 0.28, BEAM - 0.45, 5.75, y + 0.28, BEAM, '')
    for (const s of [-1, 1]) box(verm, s * 2.5, y - 0.2, 4.45, s * 5.35, y + 0.2, 4.8, 'tb')
  }
  for (const x of [-5.35, 5.35]) box(verm, x - 0.26, -3.3, BEAM - 0.45, x + 0.26, 3.3, BEAM, 'tb')

  // Side bays, front and back: the statue niches. The green lattice fence
  // across the front of each, the transom grille above the lower beam, and the
  // back wall on the middle row.
  for (const s of [-1, 1]) for (const f of [-1, 1]) {
    const x0 = s * 2.5, x1 = s * 5.35, y = f * 3.05
    const xa = Math.min(x0, x1) + 0.3, xb = Math.max(x0, x1) - 0.3
    // Low wall: green boarding, a red rail and green pickets.
    box(green, xa, y - 0.1, 0.22, xb, y + 0.1, 1.45, 'b')
    box(verm, xa, y - 0.14, 1.45, xb, y + 0.14, 1.62, 'b')
    const n = S.detail ? 11 : 6
    for (let i = 0; i < n; i++) {
      const x = xa + (xb - xa) * (i + 0.5) / n
      box(green, x - 0.06, y - 0.05, 1.62, x + 0.06, y + 0.05, 2.25, 'b')
    }
    box(green, xa, y - 0.05, 2.15, xb, y + 0.05, 2.28, '')
    // Transom grille between the beams.
    box(green, xa, y - 0.08, 4.8, xb, y + 0.08, BEAM - 0.45, 'tb')
    // The niche: floor (pedestal base) and a dark-red back wall on the middle row.
    box(verm, xa, -0.12, 0.22, xb, 0.12, 4.45, 'tb')
    // Statue on a cloud pedestal.
    statue(S, s, f, tile, gold, plaster)
  }
  // Closed ends: plastered walls in the end bays.
  for (const x of [-5.35, 5.35]) for (const f of [-1, 1]) {
    const y0 = f < 0 ? -3.05 : 0, y1 = f < 0 ? 0 : 3.05
    box(verm, x - 0.12, y0 + 0.3, 0.22, x + 0.12, y1 - 0.3, 4.45, 'tb')
    box(plaster, x - 0.1, y0 + 0.3, 4.8, x + 0.1, y1 - 0.3, BEAM - 0.45, 'tb')
  }

  // The passage ceiling, over the middle bay and the niches.
  box(verm, -5.6, -3.25, BEAM - 0.05, 5.6, 3.25, BEAM + 0.05, '')

  // The frieze: white plaster panels between the bracket sets, on the front,
  // back and ends, and the bracket sets (masugumi) at every column.
  box(plaster, -5.5, -3.2, BEAM, 5.5, 3.2, FR, 'tb')
  const set = (x: number, y: number, nx: number, ny: number) => {
    for (let k = 0; k < 3; k++) {
      const d = 0.35 + 0.45 * k, w = 0.6 + 0.25 * k, za = BEAM + k * 0.32, zb = za + 0.3
      const cx = x + nx * d / 2, cy = y + ny * d / 2
      box(verm, cx - (nx ? d / 2 : w / 2), cy - (ny ? d / 2 : w / 2), za, cx + (nx ? d / 2 : w / 2), cy + (ny ? d / 2 : w / 2), zb, 'b')
    }
  }
  const mids = (a: number[]) => a.flatMap((v, i) => (i < a.length - 1 ? [v, (v + a[i + 1]) / 2] : [v]))
  for (const x of mids(XS)) { set(x, -3.2, 0, -1); set(x, 3.2, 0, 1) }
  for (const y of [-3.05, 0, 3.05]) { set(5.5, y, 1, 0); set(-5.5, y, -1, 0) }
  // The eave beam on the brackets, then the rafter zone up to the soffit.
  box(verm, -6.2, -4.05, FR, 6.2, -3.4, FR + 0.25, 'b')
  box(verm, -6.2, 3.4, FR, 6.2, 4.05, FR + 0.25, 'b')
  // The wall over the frieze, up under the roof (closes the roof space).
  box(verm, -5.9, -3.4, FR, 5.9, 3.4, 8.35, 'b')

  // The board 金龍山 over the passage, front; 風雷神門's board on the back.
  for (const f of [-1, 1]) {
    const y = f * 3.45
    box(gold, -1.35, y - 0.1, 5.6, 1.35, y + 0.1, 6.6, '')
    box(green, -1.18, y + f * 0.1, 5.72, 1.18, y + f * 0.16, 6.48, f < 0 ? 'n' : 's')
  }

  // The roof: kirizuma, eaves turned up at the ends.
  const roofParts = { tile, soffit: verm, edge: plaster, barge: verm }
  const g = gableRoof(roofParts, {
    L: 8.7, D: 6.25, ze: ZE, zr: 10.45, lift: 1.1, from: 0.35, pow: 2.0, sag: 0.4, th: 0.32, edge: 0.4,
    ridge: { half: 7.4, h: 0.8, w: 0.7, oni: 1.25 },
    ribs: S.detail ? { step: 0.6, w: 0.16, h: 0.09 } : undefined,
    verge: { w: 0.4, h: 0.32 },
  })
  // The gable walls under the overhang: plaster with a vermilion frame.
  for (const e of [-1, 1]) {
    const x = e * 5.9
    const zt = (y: number) => g.at(y < 0 ? -1 : 1, x / 8.7, 1 - Math.abs(y) / 6.25)[2] - 0.6
    const pts: V3[] = [[x, -3.4, FR + 0.3], [x, 3.4, FR + 0.3], [x, 0, zt(0)]]
    triOut(plaster, pts[0], pts[1], [x, 0, zt(0) - 0.1], [e, 0, 0])
    box(verm, x - 0.15, -0.2, FR + 0.3, x + 0.15, 0.2, zt(0), 'b')
    box(verm, x - 0.12, -3.4, FR + 1.3, x + 0.12, 3.4, FR + 1.6, '')
  }
  // White rafter ends under the eaves (detail only); a pale band otherwise
  // comes from the eave edge.
  if (S.detail) {
    for (const f of [-1, 1]) {
      rafterEnds(plaster, [-6.0, f * 4.4, FR + 0.55], [6.0, f * 4.4, FR + 0.55], 0.42, 0.16, 0.16, 0.1, [0, f, 0])
    }
  }

  // The lantern.
  lantern(S, red, gold, tile, plaster)

  const flood = (k: number) => (_: V3, n: V3) => k * (n[2] > 0.6 ? 0.3 : 1)
  const parts: Mat[] = [
    { part: verm, material: { ...finish('kaminarimon-vermilion', 0xc95844), floodlight: flood(0.9) } },
    { part: tile, material: finish('kawara-grey', 0x72777d) },
    { part: plaster, material: { ...finish('shikkui-white', 0xeeeae2), floodlight: flood(0.8) } },
    { part: red, material: { ...finish('chochin-red', 0xc73a33), floodlight: flood(1) } },
    { part: gold, material: { ...finish('gilt-brass', 0xd0a752), floodlight: flood(0.8) } },
    { part: green, material: finish('lattice-green', 0x5f917c) },
  ]
  return parts
}

/** One of the four guardian figures, in the bay on side s (−1 west, +1 east), facing f (−1 south, +1 north). */
function statue(S: Sizes, s: number, f: number, dark: Part, gold: Part, pale: Part) {
  const cx = s * 3.92, cy = f * 1.55
  // Cloud pedestal.
  lathe(dark, cx, cy, [[0.01, 0.22], [1.0, 0.22], [1.15, 0.6], [0.95, 0.9], [1.05, 1.2], [0.7, 1.45], [0.01, 1.45]], S.detail ? 12 : 8)
  // Figure: legs, body, head; arms raised.
  const k = S.detail ? 10 : 7
  lathe(dark, cx, cy, [[0.01, 1.45], [0.55, 1.45], [0.6, 2.2], [0.5, 2.9], [0.58, 3.3], [0.3, 3.55], [0.01, 3.55]], k)
  ball(dark, cx, cy + f * 0.05, 3.85, 0.32, k)
  for (const a of [-1, 1]) {
    const sx = cx + a * 0.55
    // Fūjin and Raijin brandish their arms; Tenryū and Kinryū stand still.
    if (f < 0) bar(dark, [[sx, cy, 3.25], [sx + a * 0.45, cy + f * 0.2, 3.7], [sx + a * 0.35, cy + f * 0.25, 4.15]], 0.24, 0.12, 0.12)
    else bar(dark, [[sx, cy, 3.3], [sx + a * 0.12, cy + f * 0.15, 2.6], [sx + a * 0.05, cy + f * 0.3, 2.2]], 0.22, 0.11, 0.11)
  }
  const raijin = s < 0 && f < 0, fujin = s > 0 && f < 0
  if (raijin) {
    // The ring of drums behind Raijin.
    const n = S.detail ? 9 : 7
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (0.05 + 0.9 * i / (n - 1))
      const x = cx + 1.0 * Math.cos(a), z = 2.95 + 1.05 * Math.sin(a)
      const y = cy + 0.55
      rbox(gold, x, y, 0.2, 0.08, z - 0.2, z + 0.2, 0)
    }
  }
  if (fujin) {
    // The wind bag, a loop over his head.
    const pts: V3[] = []
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI * i / 8
      pts.push([cx + 0.95 * Math.cos(a), cy + 0.45, 3.4 + 0.85 * Math.sin(a)])
    }
    bar(pale, pts, 0.32, 0.18, 0.18)
  }
}

/** The great chōchin: a ribbed paper barrel on brass, lettered 雷門 on the front. */
function lantern(S: Sizes, red: Part, gold: Part, black: Part, white?: Part) {
  const Z0 = 2.3, Z1 = 5.55, H = Z1 - Z0
  const rOf = (z: number) => {
    const t = (z - Z0) / H
    return 1.22 + 0.43 * Math.sin(Math.PI * t)
  }
  // The body, with its bamboo ribs: a shallow groove every ~0.3 m in the
  // detail model, a smooth barrel in the low one.
  const prof: [number, number][] = []
  const n = S.detail ? 26 : 10
  for (let i = 0; i <= n; i++) {
    const z = Z0 + H * i / n
    const groove = S.detail && i % 2 === 1 ? -0.035 : 0
    prof.push([rOf(z) + groove, z])
  }
  const k = S.detail ? 32 : 18
  lathe(red, 0, 0, [[0.01, Z0], [rOf(Z0) - 0.02, Z0], ...prof, [0.01, Z1]], k)
  // Brass: the base ring with its dragon-head lugs, the top ring and the hanger.
  lathe(gold, 0, 0, [[0.01, 1.98], [1.05, 1.98], [1.12, 2.05], [1.12, 2.3], [1.2, 2.34], [0.01, 2.34]], S.detail ? 16 : 10)
  lathe(gold, 0, 0, [[0.01, 5.53], [1.15, 5.53], [1.15, 5.85], [0.4, 5.9], [0.4, 6.2], [0.01, 6.2]], S.detail ? 16 : 10)
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * Math.PI / 2
    rbox(gold, 1.12 * Math.cos(a), 1.12 * Math.sin(a), 0.16, 0.16, 2.0, 2.4, a)
  }
  // Black rims at the paper's top and bottom.
  lathe(black, 0, 0, [[rOf(Z0) + 0.01, Z0 + 0.02], [rOf(Z0 + 0.18) + 0.02, Z0 + 0.18]], k)
  lathe(black, 0, 0, [[rOf(Z1 - 0.18) + 0.02, Z1 - 0.18], [rOf(Z1) + 0.01, Z1 - 0.02]], k)

  // Lettering on the barrel. u (arc metres, reader's right = east), v up.
  const placeOn = (phi0: number) => (u: number, v: number, w: number): V3 => {
    const r = rOf(v) + 0.012 + w
    const a = phi0 + u / rOf(v)
    return [r * Math.sin(a), -r * Math.cos(a), v]
  }
  // Characters drawn in a unit box (u -0.5..0.5, v 0..1), scaled to metres.
  // Long strokes are cut into short pieces so they follow the barrel's curve.
  const glyph = (pen: Pen, segs: Pt[][], ox: number, oz: number, sx: number, sz: number) => {
    for (const s of segs) {
      const q = s.map(([u, v]) => [ox + u * sx, oz + v * sz] as Pt)
      pen.moveTo(q[0])
      for (let i = 1; i < q.length; i++) {
        const a = q[i - 1], b = q[i]
        const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.3))
        for (let k = 1; k <= n; k++) pen.lineTo([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
      }
    }
  }
  const front = new Pen()
  glyph(front, RAI, 0, 3.98, 3.1, 1.52)
  glyph(front, MON, 0, 2.42, 3.0, 1.48)
  // Black brush strokes with the white edging they have on the lantern.
  strokes(black, front.paths, { width: 0.27, depth: 0.035, place: placeOn(0) })
  if (white && S.detail) strokes(white, front.paths, { width: 0.42, depth: 0.015, place: placeOn(0) })
  if (S.detail) {
    // The back: 風雷神門 in one column, top to bottom.
    const back = new Pen()
    glyph(back, FU, 0, 4.72, 1.9, 0.72)
    glyph(back, RAI, 0, 3.93, 1.9, 0.72)
    glyph(back, SHIN, 0, 3.14, 1.9, 0.72)
    glyph(back, MON, 0, 2.38, 1.9, 0.72)
    strokes(black, back.paths, { width: 0.14, depth: 0.035, place: placeOn(Math.PI) })
    if (white) strokes(white, back.paths, { width: 0.22, depth: 0.015, place: placeOn(Math.PI) })
  }
}

// Brush-stroke centre lines, traced from the lantern photos (unit box).
const RAI: Pt[][] = [
  // 雨
  [[-0.3, 0.98], [0.3, 0.98]],
  [[-0.44, 0.7], [-0.44, 0.86], [0.44, 0.86], [0.44, 0.68], [0.36, 0.64]],
  [[0, 0.98], [0, 0.6]],
  [[-0.32, 0.79], [-0.16, 0.74]], [[-0.32, 0.68], [-0.16, 0.63]],
  [[0.16, 0.79], [0.32, 0.74]], [[0.16, 0.68], [0.32, 0.63]],
  // 田
  [[-0.36, 0.52], [-0.36, 0.02], [0.36, 0.02], [0.36, 0.52], [-0.36, 0.52]],
  [[-0.36, 0.27], [0.36, 0.27]],
  [[0, 0.52], [0, 0.02]],
]
const MON: Pt[][] = [
  [[-0.42, 1], [-0.42, 0]],
  [[-0.42, 0.95], [-0.08, 0.95], [-0.08, 0.58], [-0.42, 0.58]],
  [[-0.42, 0.77], [-0.08, 0.77]],
  [[0.08, 0.95], [0.42, 0.95], [0.42, 0.08], [0.3, 0.0]],
  [[0.08, 0.95], [0.08, 0.58], [0.42, 0.58]],
  [[0.08, 0.77], [0.42, 0.77]],
]
const FU: Pt[][] = [
  [[-0.38, 0.0], [-0.34, 0.5], [-0.34, 0.95], [0.3, 0.95], [0.3, 0.2], [0.44, 0.0]],
  [[-0.18, 0.78], [0.14, 0.78]],
  [[-0.2, 0.62], [-0.2, 0.18], [0.16, 0.18], [0.16, 0.62], [-0.2, 0.62]],
  [[-0.02, 0.62], [-0.02, 0.1]],
]
const SHIN: Pt[][] = [
  [[-0.42, 0.88], [-0.22, 0.88], [-0.36, 0.6]],
  [[-0.3, 0.98], [-0.3, 0.0]],
  [[-0.3, 0.6], [-0.42, 0.42]],
  [[-0.06, 0.8], [-0.06, 0.3], [0.4, 0.3], [0.4, 0.8], [-0.06, 0.8]],
  [[-0.06, 0.55], [0.4, 0.55]],
  [[0.17, 1.0], [0.17, 0.0]],
]

if (import.meta.main) {
  const extras = { bearing: 4.6, elevation: 0, height: 11.7, osm: 'way/173154849' }
  await save('tokyo-kaminarimon', 'Kaminarimon', build({ detail: false }), 'tokyo-kaminarimon.glb', 6500, 250_000, extras)
  await save('tokyo-kaminarimon', 'Kaminarimon', build({ detail: true }), 'tokyo-kaminarimon.detail.glb', 40_000, 1536 * 1024, extras)
}
