/**
 * Immaculate Heart of Mary Church (William P. Ginther, 1904), Polish Hill,
 * Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-immaculate-heart-of-mary.ts
 *
 * Imports `drum` and `ring` from pit-hamerschlag-hall.ts (merge that first).
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/542970157, -79.967940 40.456377. The walls run at 357° /
 * 87°, so the catalog bearing is 357: model +y (north) is the long
 * entrance side with the two towers at its ends and the pedimented centre
 * between them, the great dome over the middle; +x (east) the chancel.
 *
 * Identity, in order: the great green dome on a tall green drum ringed by
 * paired columns and round-arched windows, with its lantern; the two
 * square towers with banded red brick and buff stone stages, louvred
 * round-arched belfries, round oculi and green bell-shaped domes with
 * lanterns; the long red brick church between them with buff pilasters,
 * a heavy cornice, round-arched windows and the pedimented centre; the
 * hill site, falling to the north (the Polish Cathedral style, Wikipedia).
 *
 * Evidence:
 *  - plan: OSM way/542970157 (x -24.5..24, y -15.8..15; its two round
 *    bumps on the north side are the towers, here square towers centred
 *    x -16.5 and 12.5, y 13.5, from the lidar and the photos) turned into
 *    this frame; the dome centred (-2, -1) from the lidar.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid (sparse returns), above the lowest ground at the north-west
 *    corner (269.5 m NAVD88; the ground rises 4-5 m to the south side):
 *    main roof 19.3; drum cornice ring 28.5 (radius 8.5); dome surface
 *    36-38.5 at radius 5; highest return 46.6 (lantern and cross); tower
 *    domes 37-38; east annex 9.
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Immaculate Heart of Mary, Polish Hill, 2022-03-24, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Immaculate_Heart_of_Mary,_Polish_Hill,_2022-03-24,_01.jpg
 *      Cbaile19, CC0 — dome and drum, a tower's stages, from the west.
 *    "Immaculate Heart of Mary, Polish Hill, 2022-03-24, 02.jpg"
 *      https://commons.wikimedia.org/wiki/File:Immaculate_Heart_of_Mary,_Polish_Hill,_2022-03-24,_02.jpg
 *      Cbaile19, CC0 — the north side, towers, pedimented centre.
 *    "Polish Hill from Herr's Island Railroad Bridge, 2015-06-28, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Polish_Hill_from_Herr%E2%80%99s_Island_Railroad_Bridge,_2015-06-28,_01.jpg
 *      Cbaile19, CC0 — the whole church from afar: towers, dome, colours.
 *    "Immaculate Heart of Mary Church, Polish Hill, seen from Troy Hill, 2026-10-05-1.jpg"
 *      https://commons.wikimedia.org/wiki/File:Immaculate_Heart_of_Mary_Church,_Polish_Hill,_seen_from_Troy_Hill,_2026-10-05-1.jpg
 *      Cbaile19, CC0 — from the north across the valley.
 *    "PolishHillChurch.jpg"
 *      https://commons.wikimedia.org/wiki/File:PolishHillChurch.jpg
 *      Fo2grfr, CC BY-SA 4.0.
 *  - colour: red brick and buff stone dressings, pale green painted
 *    copper domes and drum, pulled to the palette's lightness.
 * Estimated (from the photos scaled to the lidar heights): the tower
 * stages (belfry 21.5-27.9, oculus stage to 31.5, dome to 36, lantern to
 * 38), the drum's columns and windows, the dome's profile, the pediment
 * (apex 23.5), window sizes and counts. Doubt: the south and east sides
 * are seen in no photo used here and are drawn like the north side, plain.
 *
 * Left out: the cross finials, the statues, the clock faces (drawn as
 * plain oculi), the urns at the tower corners.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { arch, band, boxFaces, poly } from './pit-allegheny-county-courthouse'
import { pier } from './pit-heinz-chapel'
import { drum, ring } from './pit-hamerschlag-hall'

/** A round window (oculus) of radius r centred s, z on wall a→b. */
function oculus(p: Part, a: XY, b: XY, s: number, z: number, r: number, out = 0.06, seg = 12) {
  const { P } = onWall(a, b), c = P(s, z, out)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * 2 * Math.PI, t1 = ((i + 1) / seg) * 2 * Math.PI
    p.tri(c, P(s + r * Math.cos(t0), z + r * Math.sin(t0), out), P(s + r * Math.cos(t1), z + r * Math.sin(t1), out))
  }
}

function build() {
  const brick = new Part(), buff = new Part(), green = new Part(), win = new Part(), roof = new Part()

  const X0 = -24.5, X1 = 18, Y0 = -15.8, Y1 = 13.5, AX = -2 // main body; the facade's axis
  const CORN = 18.2, ROOF = 19.3
  // ---- the main body: red brick over a buff base, buff cornice, flat roof
  const body = rect(X0, Y0, X1, Y1)
  walls(buff, body, 0, 3.0)
  walls(brick, body, 3.0, CORN)
  band(buff, body, rect(X0 - 0.5, Y0 - 0.5, X1 + 0.5, Y1 + 0.5), CORN, ROOF + 0.3, 0.3)
  cap(roof, rect(X0 - 0.5, Y0 - 0.5, X1 + 0.5, Y1 + 0.5), ROOF + 0.25)
  // the chancel to the east at full height, the low annex round it
  const ch = rect(X1, -7, 22.5, 3)
  walls(brick, ch, 0, CORN)
  band(buff, ch, rect(X1, -7.4, 22.9, 3.4), CORN, ROOF, 0.3)
  cap(roof, rect(X1, -7.4, 22.9, 3.4), ROOF - 0.05)
  for (const [y0, y1] of [[-15.8, -7], [3, 13.5]]) {
    const r = rect(X1, y0, 24.2, y1)
    walls(brick, r, 0, 9.0)
    band(buff, r, rect(X1, y0 - 0.3, 24.5, y1 + 0.3), 9.0, 9.6, 0.2)
    cap(roof, rect(X1, y0 - 0.3, 24.5, y1 + 0.3), 9.55)
    const [fa, fb] = boxFaces([X1, y0, 24.2, y1])[1], { L } = onWall(fa, fb)
    for (const s of [L / 3, (2 * L) / 3]) arch(win, fa, fb, s - 0.7, s + 0.7, 5.6, 7.4, 0.05, 6)
  }

  // bays: buff pilasters, two tiers of round-arched windows (lower tier above the uphill ground)
  const bays = (fa: XY, fb: XY, n: number, s0: number, s1: number, low: number) => {
    const pitch = (s1 - s0) / n
    for (let i = 0; i <= n; i++) pier(buff, fa, fb, s0 + pitch * i, 0.9, 3.0, CORN, 0.3)
    for (let i = 0; i < n; i++) {
      const s = s0 + pitch * (i + 0.5)
      arch(buff, fa, fb, s - 1.15, s + 1.15, 9.0, 14.6, 0.04, 8)
      arch(win, fa, fb, s - 0.9, s + 0.9, 9.3, 14.6, 0.07, 8)
      if (low > 0) { arch(buff, fa, fb, s - 0.8, s + 0.8, low - 0.2, low + 2.2, 0.04, 6); arch(win, fa, fb, s - 0.6, s + 0.6, low, low + 2.2, 0.07, 6) }
    }
  }
  // north side between the towers, the pedimented centre on its axis
  {
    const fa: XY = [X1, Y1], fb: XY = [X0, Y1], { L } = onWall(fa, fb)
    const sAx = X1 - AX // the axis along this wall
    bays(fa, fb, 1, X1 - 9.2, sAx - 5.6, 3.6)
    bays(fa, fb, 1, sAx + 5.6, X1 + 13.2, 3.6)
    // the pedimented centre: four buff pilasters, entablature, pediment, the door
    const pr = rect(AX - 5.6, Y1, AX + 5.6, Y1 + 0.8)
    walls(brick, pr, 0, CORN)
    for (const dx of [-5.2, -1.8, 1.8, 5.2]) pier(buff, fa, fb, sAx - dx, 1.0, 0, CORN, 1.1)
    band(buff, pr, rect(AX - 5.9, Y1, AX + 5.9, Y1 + 1.2), CORN - 1.2, ROOF + 0.3, 0.3)
    poly(buff, [[AX - 5.9, Y1 + 1.2, ROOF + 0.3], [AX + 5.9, Y1 + 1.2, ROOF + 0.3], [AX, Y1 + 1.2, 23.6]], [0, 1, 0])
    poly(roof, [[AX - 5.9, Y1 + 1.2, ROOF + 0.3], [AX, Y1 + 1.2, 23.6], [AX, Y1 - 1.5, 23.6], [AX - 5.9, Y1 - 1.5, ROOF + 0.3]], [-1, 0, 3])
    poly(roof, [[AX + 5.9, Y1 + 1.2, ROOF + 0.3], [AX, Y1 + 1.2, 23.6], [AX, Y1 - 1.5, 23.6], [AX + 5.9, Y1 - 1.5, ROOF + 0.3]], [1, 0, 3])
    const da: XY = [AX + 5.6, Y1 + 0.8], db: XY = [AX - 5.6, Y1 + 0.8], dl = onWall(da, db).L
    arch(buff, da, db, dl / 2 - 1.6, dl / 2 + 1.6, 0.8, 4.6, 0.04, 8)
    arch(win, da, db, dl / 2 - 1.2, dl / 2 + 1.2, 0.8, 4.6, 0.08, 8)
    for (const s of [dl / 2 - 3.5, dl / 2 + 3.5]) { arch(win, da, db, s - 0.6, s + 0.6, 2.0, 4.2, 0.06, 6) }
    arch(buff, da, db, dl / 2 - 1.5, dl / 2 + 1.5, 9.0, 14.6, 0.04, 8)
    arch(win, da, db, dl / 2 - 1.2, dl / 2 + 1.2, 9.3, 14.6, 0.07, 8)
    void L
  }
  // south side (uphill: windows start above its ground), west and east ends
  bays([X0, Y0], [X1, Y0], 8, 1.5, X1 - X0 - 1.5, 0)
  bays([X0, Y1], [X0, Y0], 5, 4.5, Y1 - Y0 - 1.5, 4.0)

  // ---- the towers: banded stages, belfries, oculi, bell domes and lanterns
  for (const cx of [-16.5, 12.5]) {
    const cy = 13.5, h = 3.3
    const r: [number, number, number, number] = [cx - h, cy - h, cx + h, cy + h]
    walls(buff, rect(r[0], r[1], r[2], r[3]), 0, 3.0)
    walls(brick, rect(r[0], r[1], r[2], r[3]), 3.0, 31.5)
    // buff bands and cornices
    for (const [z0, z1, d] of [[CORN, ROOF + 0.3, 0.35], [21.0, 21.6, 0.15], [27.4, 28.2, 0.4], [31.0, 31.8, 0.45], [24.5, 24.9, 0.12], [13.5, 14.0, 0.12], [8.0, 8.4, 0.12]] as [number, number, number][])
      band(buff, rect(r[0], r[1], r[2], r[3]), rect(r[0] - d, r[1] - d, r[2] + d, r[3] + d), z0, z1, Math.min(0.25, (z1 - z0) / 2))
    for (const [fa, fb] of boxFaces(r)) {
      const { L } = onWall(fa, fb)
      // quoins: buff corner strips
      for (const s of [0.35, L - 0.35]) pier(buff, fa, fb, s, 0.7, 3.0, 31.0, 0.06)
      // belfry: a tall louvred round-arched opening in a buff surround
      arch(buff, fa, fb, L / 2 - 1.5, L / 2 + 1.5, 21.6, 25.6, 0.07, 8)
      arch(roof, fa, fb, L / 2 - 1.1, L / 2 + 1.1, 22.0, 25.6, 0.1, 8)
      // the pair of small arched windows below it, the oculus above
      for (const s of [L / 2 - 0.9, L / 2 + 0.9]) arch(win, fa, fb, s - 0.45, s + 0.45, 19.6, 20.4, 0.07, 6)
      oculus(buff, fa, fb, L / 2, 29.6, 1.15, 0.07)
      oculus(win, fa, fb, L / 2, 29.6, 0.8, 0.1)
      // the lower windows of the tower
      arch(win, fa, fb, L / 2 - 0.7, L / 2 + 0.7, 9.4, 12.6, 0.07, 6)
    }
    // the bell dome: a bulbous ribbed profile, a small lantern, a cap
    const dome: XY[] = [[3.6, 31.8], [3.65, 32.4], [3.4, 33.6], [2.9, 34.7], [2.2, 35.5], [1.3, 36.0], [0.9, 36.1]]
    lathe(green, cx, cy, dome, 12)
    drum(green, cx, cy, 0.8, 36.1, 0.8, 37.2, 8)
    drum(green, cx, cy, 1.0, 37.2, 1.0, 37.5, 8)
    lathe(green, cx, cy, [[1.0, 37.5], [0.6, 38.0], [0.12, 38.6], [0, 38.6]], 8)
    ring(green, cx, cy, 1.0, 0.8, 37.2, false, 8)
  }

  // ---- the great dome: green drum with paired columns and arched windows, the dome, the lantern
  {
    const cx = AX, cy = -1, R = 7.6
    // a square brick base rising out of the roof, then the drum
    walls(brick, rect(cx - 8.6, cy - 8.6, cx + 8.6, cy + 8.6), ROOF, 21.2)
    band(buff, rect(cx - 8.6, cy - 8.6, cx + 8.6, cy + 8.6), rect(cx - 8.9, cy - 8.9, cx + 8.9, cy + 8.9), 21.2, 21.8, 0.25)
    cap(roof, rect(cx - 8.9, cy - 8.9, cx + 8.9, cy + 8.9), 21.75)
    drum(green, cx, cy, R, 21.8, R, 26.6, 24)
    // eight arched windows between paired columns
    for (let k = 0; k < 8; k++) {
      const t = (k / 8) * 2 * Math.PI + Math.PI / 8
      const c: XY = [cx + R * Math.cos(t), cy + R * Math.sin(t)], u: XY = [-Math.sin(t), Math.cos(t)]
      const a: XY = [c[0] - u[0] * 1.2, c[1] - u[1] * 1.2], b: XY = [c[0] + u[0] * 1.2, c[1] + u[1] * 1.2]
      arch(win, a, b, 0.35, 2.05, 22.6, 25.3, 0.12, 8)
      for (const dt of [-0.21, -0.14]) {
        const tt = t + Math.PI / 8 + dt + 0.175
        drum(green, cx + (R + 0.35) * Math.cos(tt), cy + (R + 0.35) * Math.sin(tt), 0.28, 21.8, 0.25, 26.4, 8)
      }
    }
    // entablature, the projecting cornice (r 8.5 measured), the attic
    drum(green, cx, cy, R + 0.55, 26.6, R + 0.55, 27.6, 24)
    ring(green, cx, cy, R + 0.55, R, 26.6, false, 24)
    drum(green, cx, cy, R + 0.95, 27.6, R + 0.95, 28.4, 24)
    ring(green, cx, cy, R + 0.95, R + 0.55, 27.6, false, 24)
    ring(green, cx, cy, R + 0.95, R - 0.1, 28.4, true, 24)
    drum(green, cx, cy, R - 0.1, 28.4, R - 0.1, 29.6, 24)
    ring(green, cx, cy, R - 0.1, R - 0.3, 29.6, true, 24)
    // the dome: a tall ribbed profile, stilted over a hemisphere
    const prof: XY[] = []
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * (Math.PI / 2)
      prof.push([(R - 0.3) * Math.cos(a) * (1 - 0.72 * (i / 8) ** 3) + 0.0, 29.6 + 10.2 * Math.sin(a)])
    }
    prof[prof.length - 1] = [1.9, 39.8]
    lathe(green, cx, cy, prof, 24)
    // the ribs: eight raised bands down the dome
    for (let k = 0; k < 8; k++) {
      const t = (k / 8) * 2 * Math.PI
      for (let i = 0; i < 8; i++) {
        const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
        const P = (rr: number, z: number, s: number, o: number): V3 => [cx + (rr + o) * Math.cos(t) - Math.sin(t) * s, cy + (rr + o) * Math.sin(t) + Math.cos(t) * s, z]
        poly(green, [P(r0, z0, -0.22, 0.12), P(r0, z0, 0.22, 0.12), P(r1, z1, 0.22, 0.12), P(r1, z1, -0.22, 0.12)], [Math.cos(t), Math.sin(t), (r0 - r1) / Math.max(0.1, z1 - z0)])
      }
    }
    // the lantern: columns round a small drum, a cap, the finial
    ring(green, cx, cy, 1.9, 0, 39.8, true, 12)
    drum(green, cx, cy, 1.5, 39.8, 1.5, 42.6, 12)
    for (let k = 0; k < 6; k++) {
      const t = (k / 6) * 2 * Math.PI
      const [a, b] = [[cx + 1.5 * Math.cos(t - 0.3), cy + 1.5 * Math.sin(t - 0.3)], [cx + 1.5 * Math.cos(t + 0.3), cy + 1.5 * Math.sin(t + 0.3)]] as [XY, XY]
      arch(win, a, b, 0.1, 0.8, 40.3, 41.6, 0.04, 6)
    }
    drum(green, cx, cy, 1.85, 42.6, 1.85, 43.1, 12)
    ring(green, cx, cy, 1.85, 1.5, 42.6, false, 12)
    lathe(green, cx, cy, [[1.85, 43.1], [1.3, 44.2], [0.5, 45.0], [0.25, 46.2], [0, 46.6]], 12)
  }

  return [
    { part: brick, material: finish('red-brick', 0xb8705f) },
    { part: buff, material: finish('buff-stone', 0xe6d8b8) },
    { part: green, material: finish('green-copper', 0xa6c4a2) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('pit-immaculate-heart-of-mary', 'Immaculate Heart of Mary Church', [40.456377, -79.96794], 357, build() as any, 6500)
