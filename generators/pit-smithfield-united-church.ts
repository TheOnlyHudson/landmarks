/**
 * Smithfield United Church of Christ (1926, Bertram Grosvenor Goodhue;
 * aluminium spire 1936), Smithfield Street, Pittsburgh — original
 * procedural geometry, CC0-1.0.
 * bun generators/pit-smithfield-united-church.ts
 *
 * Builds with the Gothic kit exported by pit-trinity-cathedral.ts and
 * pit-cathedral-of-learning.ts; merge those first.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/118673961, -79.9970761 40.4419276. The outline is a 20.5 x
 * 33.5 m rectangle whose long sides run at 116°/296°; the catalog bearing
 * is 296, so model +y (west-north-west) is the Smithfield Street front and
 * +x (north-north-east) the open side toward Strawberry Way.
 *
 * Identity, in order: the open aluminium lattice spire on its octagonal
 * arcaded lantern, standing on the tall square stone tower at the north
 * corner of the Smithfield Street front; the tower's tall traceried belfry
 * lancets and the arcaded band and balustrade at its top; the steep high
 * nave roof behind; the lower front block beside the tower with the
 * pointed entrances.
 *
 * Evidence:
 *  - plan: OSM outline way/118673961 in this frame, x -10.3..10.2, y
 *    -17..16.9; tower x 0.4..9.9, y 7.4..16.9 (lidar); nave walls x
 *    -8.5..10.2, its front gable at y 8 and its rear at y -11; a flat rear
 *    block y -17..-11; a low strip x -10.3..-8.5 along the neighbour.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid, drawn above the street and then lifted 1.2 m (STREET
 *    below), because y = 0 is the lowest ground under the footprint: the
 *    alley and light well on the -x side, ~1.2 m under Smithfield Street
 *    (lidar 1.0 vs 2.3 above the box minimum; Mapterhorn 0.8-1.0 vs 2.0-2.3).
 *    Above the street:
 *    tower top 46.3, lantern top 51.6 (its cornice), spire returns to 73
 *    within ~2.5 m of the axis (an openwork spire returns little; the
 *    tip is put at 76: the solid needle above the lattice, estimated
 *    from the photos), nave eaves 24, ridge 32.6, front block 21, rear
 *    block 24.5, low strip 12. The 2019 photo puts the spire's base at
 *    about two thirds of the lantern's width (radius 2.75 against 3.9).
 *  - photos (Wikimedia Commons, EVIDENCE):
 *    "Tower of Smithfield Congregational Church, 2000-05 - Lomo Smena 8M.jpg"
 *      https://commons.wikimedia.org/wiki/File:Tower_of_Smithfield_Congregational_Church,_2000-05_-_Lomo_Smena_8M.jpg
 *      Cbaile19, CC0 — the tower top to bottom: belfry lancet, band,
 *      balustrade, lantern, spire.
 *    "Spire, Smithfield United Church, Pittsburgh, 2019-10-24, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Spire,_Smithfield_United_Church,_Pittsburgh,_2019-10-24,_01.jpg
 *      Cbaile19, CC0 — lantern and lattice spire in sun: proportions and
 *      colours.
 *    "Spire of Smithfield United Church, 2025-11-04.jpg"
 *      https://commons.wikimedia.org/wiki/File:Spire_of_Smithfield_United_Church,_2025-11-04.jpg
 *      Cbaile19, CC0 — the spire.
 *    "Pittsburgh, Pennsylvania (8482587031).jpg"
 *      https://commons.wikimedia.org/wiki/File:Pittsburgh,_Pennsylvania_(8482587031).jpg
 *      Doug Kerr, CC BY-SA 2.0 — from Smithfield Street: the tower, its
 *      portal, the nave behind (under netting in 2013).
 *    "Pittsburgh, Pennsylvania (8482583225).jpg"
 *      https://commons.wikimedia.org/wiki/File:Pittsburgh,_Pennsylvania_(8482583225).jpg
 *      Doug Kerr, CC BY-SA 2.0 — the tower and spire in silhouette.
 *  - colour: tan-grey stone, darkened by soot, pulled to the palette's
 *    lightness; the spire's weathered dark aluminium kept dark (it reads as
 *    a dark lattice against the sky) but no darker than charcoal.
 * Estimated: every opening, the lantern (a squat octagon of dark
 * metal and columns in the photos, drawn as a dark octagon with paired
 * arched openings under a pale cornice), the lattice's tiers (drawn at about half the
 * real density, members thicker than real, as STYLE.md asks of thin
 * members), the lantern's arcade, the nave's side windows (the 2013 photo
 * shows the nave under netting).
 *
 * Doubts: the nave and front block are poorly photographed; their windows
 * are plain lancets placed by bay, not traced. The south-south-west side is
 * hard against a neighbour. The tower's top is lit at night in some
 * photos, but no licensed night photo was found: only the windows glow.
 *
 * Left out: the tracery of the arcaded band, the statue niche, crockets,
 * the lattice's scrolls (drawn as diagonal bracing).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, rect, save, walls, type XY } from './chi-aon-center'
import { bar, faces, pier, pointed } from './pit-cathedral-of-learning'
import { box, gable, panel3, ring } from './pit-trinity-cathedral'

/** A flat double-sided strip between two points, `w` wide, its face normal to `n`. */
function strip(p: Part, a: V3, b: V3, w: number, n: V3) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  // side = d x n, normalised
  let s: V3 = [d[1] * n[2] - d[2] * n[1], d[2] * n[0] - d[0] * n[2], d[0] * n[1] - d[1] * n[0]]
  const l = Math.hypot(...s) || 1
  s = [(s[0] / l) * w / 2, (s[1] / l) * w / 2, (s[2] / l) * w / 2]
  const A: V3 = [a[0] - s[0], a[1] - s[1], a[2] - s[2]], B: V3 = [a[0] + s[0], a[1] + s[1], a[2] + s[2]]
  const C: V3 = [b[0] + s[0], b[1] + s[1], b[2] + s[2]], D: V3 = [b[0] - s[0], b[1] - s[1], b[2] - s[2]]
  p.quad(A, B, C, D)
  p.quad(A, D, C, B)
}

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), alu = new Part(), tr = new Part(), dark = new Part()

  // ---- nave x -8.5..10.2, y -11..8: eaves 24, ridge 35.5
  const NX0 = -8.5, NX1 = 10.2, NY0 = -11, NY1 = 8
  walls(stone, rect(NX0, NY0, NX1, NY1), 0, 24)
  gable(roof, stone, NX0, NY0, NX1, NY1, 24, 32.6, 'y', [true, true], 0.4)
  {
    // side windows on the open north-north-east wall, between buttresses
    const [a, b] = faces(NX0, NY0, NX1, NY1)[1]
    for (const s of [3.2, 8.0, 12.8]) {
      pointed(stone, a, b, s - 1.55, s + 1.55, 9.0, 18.6, 0.03)
      pointed(win, a, b, s - 1.3, s + 1.3, 9.3, 18.6, 0.06)
      bar(tr, a, b, [s, 9.3], [s, 19.8], 0.17, 0.1)
    }
    for (const s of [0.6, 5.6, 10.4, 15.2]) pier(stone, a, b, s, 1.0, 0, 21, 1.0, 1.4)
    // the front gable above the front block: a traceried window
    const [fa, fb] = faces(NX0, NY0, NX1, NY1)[2], c = NX1 + 4 // under the gable, beside the tower (x -4)
    pointed(win, fa, fb, c - 1.3, c + 1.3, 22.6, 25.0, 0.04)
    bar(tr, fa, fb, [c, 22.6], [c, 26.6], 0.16, 0.08)
  }
  // ---- the flat rear block y -17..-11 and the low strip on the neighbour side
  walls(stone, rect(NX0, -17, NX1, NY0), 0, 24.5)
  walls(stone, rect(NX0, -17, NX1, NY0), 24.5, 25.3)
  cap(roof, rect(NX0 + 0.4, -16.6, NX1 - 0.4, NY0 - 0.4), 24.6)
  {
    const [a, b] = faces(NX0, -17, NX1, NY0)[1]
    pointed(win, a, b, 2.2, 3.8, 12, 17, 0.04)
    for (const z of [3.5, 7.5]) panel3(win, a, b, 2.4, 3.6, z, z + 2)
  }
  box(stone, -10.3, -17, NX0, 16.9, 0, 12, roof)

  // ---- the front block beside the tower: x -8.5..0.4, y 8..16.9, flat at 21
  const FX0 = NX0, FX1 = 0.4, FY0 = NY1, FY1 = 16.9
  walls(stone, rect(FX0, FY0, FX1, FY1), 0, 21)
  walls(stone, rect(FX0, FY0, FX1, FY1), 21, 22)
  cap(roof, rect(FX0 + 0.4, FY0 + 0.4, FX1 - 0.4, FY1 - 0.4), 21.2)
  {
    const [a, b] = faces(FX0, FY0, FX1, FY1)[2], { L } = onWall(a, b), c = L / 2
    pointed(stone, a, b, c - 2.0, c + 2.0, 8.5, 16.0, 0.03)
    pointed(win, a, b, c - 1.7, c + 1.7, 8.8, 16.0, 0.06)
    for (const ds of [-0.6, 0.6]) bar(tr, a, b, [c + ds, 8.8], [c + ds, 18.4], 0.16, 0.1)
    bar(tr, a, b, [c - 1.65, 13], [c + 1.65, 13], 0.16, 0.1)
    pointed(tr, a, b, c - 1.6, c + 1.6, 0.01, 3.8, 0.05)
    pointed(dark, a, b, c - 1.2, c + 1.2, 0.01, 3.6, 0.1)
    for (const s of [0.5, L - 0.5]) pier(stone, a, b, s, 1.0, 0, 20, 0.6, 1.2)
  }

  // ---- the tower: x 0.4..9.9, y 7.4..16.9, top 45 with band and balustrade
  const TX0 = 0.4, TX1 = 9.9, TY0 = 7.4, TY1 = 16.9, TW = TX1 - TX0, TCX = (TX0 + TX1) / 2, TCY = (TY0 + TY1) / 2
  const TOP = 45
  box(stone, TX0, TY0, TX1, TY1, 0, TOP, null)
  walls(stone, rect(TX0 - 0.35, TY0 - 0.35, TX1 + 0.35, TY1 + 0.35), TOP - 4.2, TOP)
  walls(tr, rect(TX0 - 0.35, TY0 - 0.35, TX1 + 0.35, TY1 + 0.35), TOP, TOP + 1.3)
  cap(roof, rect(TX0 - 0.35, TY0 - 0.35, TX1 + 0.35, TY1 + 0.35), TOP + 0.4)
  for (const [a, b] of faces(TX0, TY0, TX1, TY1)) {
    const c = TW / 2
    // the tall traceried belfry lancet
    pointed(stone, a, b, c - 1.9, c + 1.9, 29.0, 36.6, 0.05)
    pointed(win, a, b, c - 1.55, c + 1.55, 29.4, 36.6, 0.1)
    bar(tr, a, b, [c, 29.4], [c, 38.6], 0.18, 0.14)
    bar(tr, a, b, [c - 1.5, 33.6], [c + 1.5, 33.6], 0.16, 0.14)
    bar(tr, a, b, [0.6, 28.4], [TW - 0.6, 28.4], 0.4, 0.14) // sill band
    // the arcaded band under the top: a row of small dark arches
    for (let i = 0; i < 5; i++) {
      const s = 1.15 + i * ((TW - 2.3) / 4)
      pointed(dark, a, b, s - 0.55, s + 0.55, TOP - 3.4, TOP - 1.6, 0.4)
    }
    // a lancet lower in the shaft
    pointed(win, a, b, c - 0.6, c + 0.6, 18.5, 23.5, 0.04)
    // shallow corner piers
    for (const s of [0.45, TW - 0.45]) pier(stone, a, b, s, 0.9, 0, TOP - 4.2, 0.45, 0)
  }
  {
    // the portal at the tower's foot on Smithfield Street
    const [a, b] = faces(TX0, TY0, TX1, TY1)[2], c = TW / 2
    pointed(tr, a, b, c - 1.8, c + 1.8, 0.01, 4.8, 0.05)
    pointed(dark, a, b, c - 1.3, c + 1.3, 0.01, 4.6, 0.1)
    pointed(win, a, b, c - 0.8, c + 0.8, 8.5, 12.5, 0.04)
  }

  // ---- the lantern: octagonal, arcaded, cornice, small finials at the angles
  // (lidar: the lantern's top 51.6; photos: a squat, dark columned
  // octagon under a pale fretwork cornice, the spire standing inside it)
  const L0 = TOP + 0.4, L1 = 51.0, LR = 3.9
  alu.loft([ring(TCX, TCY, LR, L0, 8), ring(TCX, TCY, LR, L1, 8)])
  tr.loft([ring(TCX, TCY, LR + 0.25, L1, 8), ring(TCX, TCY, LR + 0.25, L1 + 1.2, 8)])
  tr.cap(ring(TCX, TCY, LR + 0.25, L1 + 1.2, 8), true)
  {
    const r = ring(TCX, TCY, LR + 0.01, 0, 8)
    for (let i = 0; i < 8; i++) {
      const a: XY = [r[i][0], r[i][1]], b: XY = [r[(i + 1) % 8][0], r[(i + 1) % 8][1]], { L } = onWall(a, b)
      for (const ds of [-0.55, 0.55]) pointed(dark, a, b, L / 2 + ds - 0.5, L / 2 + ds + 0.5, L0 + 0.9, L1 - 1.6, 0.04)
    }
    for (let i = 0; i < 8; i++) {
      // the small cross-topped finials at the cornice's angles (photo), on
      // every other angle, drawn as slim posts
      if (i % 2) continue
      const p = r[i]
      const q = rect(p[0] - 0.2, p[1] - 0.2, p[0] + 0.2, p[1] + 0.2)
      walls(alu, q, L1 + 1.2, L1 + 3.4)
      for (let k = 0; k < 4; k++) alu.tri([q[k][0], q[k][1], L1 + 3.4], [q[(k + 1) % 4][0], q[(k + 1) % 4][1], L1 + 3.4], [p[0], p[1], L1 + 4.0])
    }
  }

  // ---- the open aluminium spire: eight ribs, rings, diagonal bracing
  const S0 = L1 + 1.2, TIP = 76, SR = 2.75, TIERS = 9, NEEDLE = 72
  const at = (i: number, z: number): V3 => {
    const k = (TIP - z) / (TIP - S0), a = Math.PI / 8 + (i * Math.PI) / 4
    return [TCX + SR * k * Math.cos(a), TCY + SR * k * Math.sin(a), z]
  }
  // tiers get shorter toward the top
  const zs: number[] = []
  for (let t = 0; t <= TIERS; t++) zs.push(S0 + (NEEDLE - S0) * (1 - Math.pow(1 - t / TIERS, 1.2)))
  for (let i = 0; i < 8; i++) {
    // the rib: a square-section member up the corner
    const a0 = at(i, S0), a1 = at(i, NEEDLE)
    const nOut: V3 = [Math.cos(Math.PI / 8 + (i * Math.PI) / 4), Math.sin(Math.PI / 8 + (i * Math.PI) / 4), 0]
    const tang: V3 = [-nOut[1], nOut[0], 0]
    strip(alu, a0, a1, 0.5, nOut)
    strip(alu, a0, a1, 0.5, tang)
  }
  for (let t = 0; t < zs.length; t++) {
    const z = zs[t], w = t === 0 ? 0.7 : 0.4
    for (let i = 0; i < 8; i++) {
      const p = at(i, z), q = at((i + 1) % 8, z)
      const mid: V3 = [(p[0] + q[0]) / 2 - TCX, (p[1] + q[1]) / 2 - TCY, 0.0]
      strip(alu, [p[0], p[1], z - w / 2], [q[0], q[1], z - w / 2], w, mid)
      if (t < zs.length - 1) {
        // an X of bracing in the panel above this ring
        const z1 = zs[t + 1]
        const p1 = at(i, z1), q1 = at((i + 1) % 8, z1)
        strip(alu, p, q1, 0.3, mid)
        strip(alu, q, p1, 0.3, mid)
        const m0: V3 = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, z], m1: V3 = [(p1[0] + q1[0]) / 2, (p1[1] + q1[1]) / 2, z1]
        if (t < 6) strip(alu, m0, m1, 0.26, mid)
      }
    }
  }
  // the finial
  {
    // the solid needle the lattice closes into (photo: its top eighth)
    const f = Array.from({ length: 8 }, (_, i) => at(i, NEEDLE))
    alu.cap(f, false)
    for (let k = 0; k < 8; k++) alu.tri(f[k], f[(k + 1) % 8], [TCX, TCY, TIP])
  }

  // lift everything off the base to the street (see header): vertices at
  // the base stay on y = 0, so walls run down into the low alley side
  const STREET = 1.2
  for (const p of [stone, win, roof, alu, tr, dark]) for (let i = 1; i < p.pos.length; i += 3) if (p.pos[i] > 0.001) p.pos[i] += STREET
  return [
    { part: stone, material: finish('smithfield-stone', 0xb9ac9a) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('slate', 0x7d8289) },
    { part: alu, material: { ...finish('spire-aluminium', 0x6e737a), roughness: 0.5 } },
    { part: tr, material: PALETTE.trim },
    { part: dark, material: finish('opening', 0x4a4f57) },
  ]
}

if (import.meta.main) await save('pit-smithfield-united-church', 'Smithfield United Church of Christ', [40.4419276, -79.9970761], 296, build() as any, 6500)
