/**
 * Berliner Dom (Berlin Cathedral), Lustgarten: procedural, CC0-1.0.
 * bun generators/berlin-dom.ts   (writes models/berlin-dom.glb and the
 * detail model models/berlin-dom.detail.glb)
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 58.5: the
 * model's north is the building's rear (east-north-east), its south the
 * main front on the Lustgarten, its +x the Spree side (OSM's long walls run
 * at 58.5 and 148.5 degrees). Origin: on the main dome's axis across, and
 * the middle of the outline's box along, 13.401070 52.519120; y = 0 at the
 * ground (Mapterhorn varies under 1 m across the site).
 *
 * Identity (from the photos below):
 *  1. The great green copper dome on its tall columned drum, with ribs,
 *     oculi, a ring of angels at its foot, and the gilded lantern cap, ball
 *     and cross (98 m).
 *  2. Four corner towers with smaller copper domes and gilt balls: the two
 *     on the front taller, the two at the rear short.
 *  3. The west front: a great round-arched portal between paired giant
 *     columns, a sculpture group and cross over it, pedimented porticoes at
 *     the towers' feet.
 *  4. Grey-beige sandstone throughout, darkened by soot, in a giant order of
 *     pilasters over a rusticated ground floor, with a balustraded attic.
 *  5. Pediments on the transept fronts either side of the drum.
 *
 * Plan: OSM way/313670734 (outline) and its parts: the main body
 * way/438382390 (to 28 m); the drum way/438396411 (28-50) and dome
 * way/24044997 (50-75); the lantern way/438418249 (74-82); the front towers
 * way/230017202/203 (28-45) with domes way/42349274/275 (45-52); the rear
 * towers way/438455948/949 (28-33) with domes way/438455947/950 (33-37); the
 * transept gables way/438396412/413 (28-32); the front: gable
 * way/230017199 (28-33.5), the giant columns way/438517032-035 (9-25.5) on
 * pedestals way/438517038/039 (to 9) under entablatures way/438517040/041,
 * attic blocks way/230017198/201, way/438417815/816, small domes
 * way/438417818/819; the tower porticoes way/438780222-227; the side porch
 * way/438517037; the low annex on the Spree side way/230353888-895 (15-17 m).
 *
 * Published (German Wikipedia, "Berliner Dom"): 1894-1905, Julius Carl
 * Raschdorff; today 90 m long and 98 m high (to the cross); the dome and the
 * four tower tops were rebuilt simplified and 16 m lower after the war (the
 * lantern restored 2006-08); a ring of 20 copper angels round the dome's
 * foot; a gallery round the dome at 50 m; the dome cross 15 m tall.
 *
 * Heights: OSM's part heights, corrected from photos where they disagree.
 * "Berlin Cathedral from Muehlendammbruecke.jpg" (telephoto, scaled from the
 * dome's OSM width, 38.4 m): the drum from about 29 m, the dome springing
 * at 55 m and rising about 23.5 m (a stilted dome, not a hemisphere) to the
 * lantern at 79 m; the lantern 8.5 m; ball and cross to 98 m. The front
 * towers' domes reach about 58 m with their balls at about 60 m in that
 * photo and in "View from Humboldtbox" (OSM's 52 m is drawn as the dome's
 * springing). Main cornice 24.5-26 m, attic to 28.8 m.
 *
 * Second round (review): the stone darkened to the photos' sooty brown-
 * grey; the portico of free-standing paired columns round the great arch
 * against its shadowed back wall, with bronze figures between the pairs;
 * column pairs on the corner pavilions; pediments over the side doors and
 * windows; aedicules (pilasters and pediments) round the drum windows; the
 * bronze statues on the attic, the pavilions, the towers' corners and the
 * 20 angels round the dome drawn in the low model too, as bold robed
 * silhouettes (the detail model has heads, plinths and finer columns).
 *
 * Third round: columns, entablatures, pedestals and pediments in a
 * lighter carved stone against the darker walls and shadowed recesses;
 * engaged column pairs either side of the side bays, so the giant order
 * runs across the whole front; a bronze cartouche over the arch. The
 * detail model adds capitals with abaci, window surrounds with keystones,
 * more balustrade statues, and balustrades on the drum gallery and side
 * attics. The low model's copper carries no floodlight (size limit).
 *
 * Estimated: the drum's 16 columns as 8 pairs, its 8 big arched windows;
 * the dome's 16 ribs and two rows of oculi (photos show more, finer ribs);
 * the facade bays and window sizes; the tower belfries' arches; the
 * statues, drawn as simple figures (angels with wings round the dome,
 * figures on the front attic and the towers), only in the detail model;
 * the rear apse drawn as a half-cylinder at the body's height.
 * Left out: the mosaics, reliefs, cartouches, the side colonnade on the
 * Lustgarten, the railings.
 *
 * Night: the stone is floodlit (`_FLOODLIGHT`), the copper dome lit from
 * below more faintly; windows glow.
 *
 * Photos (evidence, Wikimedia Commons):
 * - "Berliner Dom November 2013.jpg", Arild Vågen, CC BY-SA 3.0 (from the north-west)
 *   https://commons.wikimedia.org/wiki/File:Berliner_Dom_November_2013.jpg
 * - "Berliner Dom, Ostseite, 160402, ako.jpg", Ansgar Koreng, CC BY-SA 3.0 de (Spree side)
 *   https://commons.wikimedia.org/wiki/File:Berliner_Dom,_Ostseite,_160402,_ako.jpg
 * - "View from Humboldtbox - Berlin Cathedral.jpg", A.Savin, CC BY-SA 3.0 (front, high)
 *   https://commons.wikimedia.org/wiki/File:View_from_Humboldtbox_-_Berlin_Cathedral.jpg
 * - "2023 Berliner Dom - Westfassade -- 04.jpg", Chainwit., CC BY 4.0
 *   https://commons.wikimedia.org/wiki/File:2023_Berliner_Dom_-_Westfassade_--_04.jpg
 * - "Berlin Cathedral from Muehlendammbruecke.jpg", Mathias Krumbholz, CC BY-SA 3.0 (telephoto, night)
 *   https://commons.wikimedia.org/wiki/File:Berlin_Cathedral_from_Muehlendammbruecke.jpg
 * - "Berliner Dom (Berlin-Mitte).Laterne.09030066.ajb.jpg", Ajepbah, CC BY-SA 3.0 de (lantern)
 *   https://commons.wikimedia.org/wiki/File:Berliner_Dom_(Berlin-Mitte).Laterne.09030066.ajb.jpg
 * - "20240815 Berlin Cathedral 03.jpg", Flocci Nivis, CC BY 4.0
 *   https://commons.wikimedia.org/wiki/File:20240815_Berlin_Cathedral_03.jpg
 * - "Berliner Dom, Westfassade, Nacht, 160309, ako.jpg", Ansgar Koreng, CC BY-SA 3.0 de (night)
 *   https://commons.wikimedia.org/wiki/File:Berliner_Dom,_Westfassade,_Nacht,_160309,_ako.jpg
 * - "Berliner Dom 2015.jpg", Tuxyso, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Berliner_Dom_2015.jpg
 * - "2019 - Berliner Dom an der Spree.jpg", Moahim, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:2019_-_Berliner_Dom_an_der_Spree.jpg
 * Look-only: none.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, ccw, cornice, prism, save, type XY } from './atl-flatiron-building'
import { archShape, gableRoof, onWall, rectShape } from './atl-tech-tower'
import { lathe, ribbedDome, flat } from './berlin-fernsehturm'

const TAU = Math.PI * 2

async function build(low: boolean) {
  const stone = new Part(), copper = new Part(), gold = new Part(), win = new Part(), roof = new Part()
  const light = new Part() // columns, entablatures, pediments: the cleaner, lighter carved stone
  const K = low ? 18 : 40 // segments round the main dome

  // ── Plan ──
  const BODY_X0 = -29.5, BODY_X1 = 30.0, FRONT = -33.6, REAR = 32.4
  const ROOF = 28, CORN = 24.5
  const FT: XY[] = [[-33.1, -26.6], [33.1, -26.6]] // front towers' centres
  const RT: XY[] = [[-28.2, 27.3], [28.2, 27.3]]   // rear towers'
  const DC: XY = [0, 3.7]                          // the dome's axis

  /** A block with the body's cornice and attic. */
  function block(ring: XY[], h = ROOF) {
    ring = ccw(ring)
    prism(stone, ring, 0, h, roof, 0)
    cornice(stone, ring, CORN, 1.5, 0.7, null)
    cornice(stone, ring, h - 0.2, 1.0, 0.35, stone)
    // ground-floor rustication line and plinth
    cornice(stone, ring, 8.6, 0.6, 0.3, null)
  }
  const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  // Main body, the front towers' bases, the rear towers' bases.
  block(rect(BODY_X0, BODY_X1, FRONT, REAR))
  for (const [cx, cy] of FT) block(rect(cx - 7, cx + 7, cy - 10.1, cy + 7.2))
  for (const [cx, cy] of RT) block(rect(cx - 4.9, cx + 4.9, cy - 5, cy + 5.1))
  // Rear apse (the remains of the crypt church side), a half drum.
  {
    const ring: XY[] = []
    for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI; ring.push([1.0 + 6.2 * Math.cos(a), REAR - 0.5 + 5.4 * Math.sin(a)]) }
    prism(stone, ccw(ring), 0, 24, roof, 0.3)
  }
  // Spree-side annex (15-17 m) and the west side porch (17.5 m).
  for (const [x0, x1, y0, y1, h] of [[30.0, 44.1, -6.9, 15.3, 17], [30.0, 39.0, -17.6, -6.9, 15], [30.0, 38.7, 15.3, 23.3, 15], [44.1, 45.8, -3.8, 12.3, 14]] as number[][]) {
    prism(stone, ccw(rect(x0, x1, y0, y1)), 0, h, roof, 0.3)
    cornice(stone, ccw(rect(x0, x1, y0, y1)), h - 1.2, 1.0, 0.4, null)
  }
  prism(stone, ccw(rect(-33.3, BODY_X0, -2.6, 8.5)), 0, 15, null, 0)
  gableRoof(stone, stone, -33.3, BODY_X0 + 0.5, -2.6, 8.5, 15, 17.5, 'y', 0.3, 0.3)

  // ── Facade windows: ground floor and main floor, bays of about 5.6 m ──
  function facade(a: XY, b: XY, skip?: (s: number) => boolean) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const bays = Math.max(1, Math.round((L - 2) / 5.6)), w = (L - 2) / bays
    for (let k = 0; k < bays; k++) {
      const s = 1 + (k + 0.5) * w
      if (skip?.(s)) continue
      onWall(win, a, b, rectShape(s - 0.9, s + 0.9, 3.0, 6.6), 0.05)
      onWall(win, a, b, archShape(s, 2.0, 11.0, 17.6, low ? 4 : 8), 0.05)
      if (!low) {
        // carved surrounds: an arched frame with a keystone, a framed ground window
        onWall(light, a, b, archShape(s, 2.8, 10.6, 17.6, 8), 0.03)
        onWall(light, a, b, rectShape(s - 0.25, s + 0.25, 18.4, 19.3), 0.07)
        onWall(light, a, b, rectShape(s - 1.2, s + 1.2, 2.7, 6.9), 0.03)
        onWall(light, a, b, rectShape(s - 1.35, s + 1.35, 10.2, 10.6), 0.07)
      }
      // a pale stone pediment band over the main-floor window
      if (!low) onWall(stone, a, b, rectShape(s - 1.5, s + 1.5, 19.4, 20.1), 0.25)
      // pilasters between bays (the giant order)
      if (k < bays - 1) onWall(stone, a, b, rectShape(s + w / 2 - 0.55, s + w / 2 + 0.55, 9.2, CORN), 0.3)
      if (!low) onWall(win, a, b, rectShape(s - 0.6, s + 0.6, 21.3, 23.3), 0.05)
    }
  }
  // Each wall runs with the outside on its right; the Spree side is behind the annex.
  facade([BODY_X0, REAR], [BODY_X0, 8.5])
  facade([BODY_X0, -2.6], [BODY_X0, -16.4])
  facade([22.0, REAR], [6.0, REAR])
  facade([-4.0, REAR], [-23.3, REAR])
  for (const [cx, cy] of FT) {
    const x0 = cx - 7, x1 = cx + 7, y0 = cy - 10.1, y1 = cy + 7.2
    facade([x0, y0], [x1, y0]) // front face
    if (cx < 0) facade([x0, y1], [x0, y0])
    else facade([x1, y0], [x1, y1])
  }
  if (!low) for (const [cx, cy] of RT) {
    const x0 = cx - 4.9, x1 = cx + 4.9, y1 = cy + 5.1
    facade([x1, y1], [x0, y1])
  }
  // Annex windows
  if (!low) { facade([44.1, -6.9], [44.1, -3.8]); facade([39.0, -17.6], [39.0, -6.9]); facade([38.7, 15.3], [38.7, 23.3]) }

  // ── The west front between the towers ──
  {
    const a: XY = [FT[0][0] + 7, FRONT], b: XY = [FT[1][0] - 7, FRONT]
    const L = b[0] - a[0], m = -a[0] // s of x = 0
    // The great portal: a deep round arch, dark, in a stone frame.
    onWall(stone, a, b, archShape(m, 13.5, 0.4, 16.2, 12), 0.12)
    onWall(roof, a, b, archShape(m, 10.6, 0.4, 16.0, 12), 0.2)
    // its doors and the glazed lunette over them
    onWall(win, a, b, rectShape(m - 2.6, m + 2.6, 0.4, 7.2), 0.26)
    onWall(win, a, b, archShape(m, 5.2, 8.0, 10.6, 8), 0.26)
    // Side bays of the front: windows.
    for (const s of [m - 19.5, m + 19.5]) onWall(win, a, b, archShape(s, 2.6, 11, 18, 8), 0.05)
    // The portico: paired giant columns either side of the arch, standing
    // free 2 m in front of the wall on pedestals, under projecting
    // entablature blocks (OSM: pedestals to 9 m, columns 9-25.5 m, blocks
    // to 27.5 m).
    const column = (c: XY, z0: number, z1: number, r: number) => {
      if (low) lathe([[r, z0], [r, z1 - 0.7], [r * 1.3, z1], [0, z1]], () => light, 6, 40, c, Math.PI / 6)
      else {
        // base, shaft, flared Corinthian capital and a square abacus
        lathe([[r * 1.3, z0], [r * 1.3, z0 + 0.6], [r, z0 + 0.9], [r, z1 - 1.4], [r * 1.12, z1 - 1.0], [r * 1.4, z1 - 0.35], [r * 1.4, z1 - 0.3], [0, z1 - 0.3]], () => light, 12, 40, c)
        box(light, c[0] - r * 1.5, c[0] + r * 1.5, c[1] - r * 1.5, c[1] + r * 1.5, z1 - 0.3, z1, null, 0)
      }
    }
    for (const side of [-1, 1]) {
      const cx = side * 11.5
      box(light, cx - 4.0, cx + 4.0, FRONT - 3.8, FRONT, 0, 9, light, 0.3)
      box(light, cx - 4.4, cx + 4.4, FRONT - 4.2, FRONT, 25.0, 27.9, light, 0.3)
      for (const dx of [-2.2, 2.2]) column([cx + dx, FRONT - 2.2], 9, 25, 0.9)
      // the pilasters behind them on the wall
      if (!low) for (const dx of [-2.2, 2.2]) onWall(stone, a, b, rectShape(m + cx + dx - 0.7, m + cx + dx + 0.7, 9, 25), 0.3)
      // the portico's shadowed back wall, so the free-standing columns
      // read against it as in the photos
      onWall(roof, a, b, rectShape(m + cx - 3.8, m + cx + 3.8, 9, 25), 0.06)
    }
    // Pediments over the side doors and the windows above them.
    for (const s0 of [m - 19.5, m + 19.5]) {
      const x = a[0] + s0
      onWall(win, a, b, archShape(s0, 2.2, 0.3, 4.6, 8), 0.06)
      box(light, x - 1.9, x + 1.9, FRONT - 0.8, FRONT, 6.0, 6.6, null, 0)
      gableRoof(light, light, x - 1.9, x + 1.9, FRONT - 0.8, FRONT, 6.6, 7.8, 'y', 0.15, 0.05)
      box(light, x - 1.9, x + 1.9, FRONT - 0.8, FRONT, 18.6, 19.2, null, 0)
      gableRoof(light, light, x - 1.9, x + 1.9, FRONT - 0.8, FRONT, 19.2, 20.6, 'y', 0.15, 0.05)
    }
    // Engaged column pairs either side of the side bays, carrying the
    // giant order across the whole front, each against a shadowed strip
    // under its own entablature block.
    for (const x of [-23.4, -16.9, 16.9, 23.4]) {
      onWall(roof, a, b, rectShape(m + x - 1.25, m + x + 1.25, 9, 25), 0.05)
      box(light, x - 1.4, x + 1.4, FRONT - 1.8, FRONT, 25.0, 27.4, light, low ? 0 : 0.15)
      box(light, x - 1.25, x + 1.25, FRONT - 1.6, FRONT, 0, 9, low ? null : light, low ? 0 : 0.1)
      for (const dx of [-0.6, 0.6]) column([x + dx, FRONT - 0.85], 9, 25, 0.5)
    }
    // Column pairs on the corner pavilions' fronts, either side of their porticoes.
    for (const [cx, cy] of FT) {
      const fy = cy - 10.1
      for (const side of [-1, 1]) {
        const px = cx + side * 5.9
        box(light, px - 1.3, px + 1.3, fy - 2.4, fy, 0, 9, light, low ? 0 : 0.2)
        box(light, px - 1.5, px + 1.5, fy - 2.6, fy, 25.0, 27.6, light, low ? 0 : 0.2)
        for (const dx of [-0.65, 0.65]) column([px + dx, fy - 1.3], 9, 25, 0.5)
        // the shadowed wall behind the pair
        onWall(roof, [cx - 7, fy], [cx + 7, fy], rectShape(px - cx + 7 - 1.2, px - cx + 7 + 1.2, 9.0, 25.0), 0.05)
      }
    }
    // The attic group over the portal: a raised block with a segmental
    // pediment (way/230017199, to 33.5 m) and the gilt cross over it.
    box(stone, -4.5, 4.5, FRONT - 0.6, FRONT + 4, ROOF, 31.2, stone, 0.25)
    gableRoof(light, light, -4.8, 4.8, FRONT - 0.8, FRONT + 4.2, 31.2, 33.5, 'y', 0.3, 0.3)
    // The cartouche over the great arch: a bronze shield in a pale frame.
    {
      const oval = (rx: number, rz: number, zc: number, n: number): [number, number][] =>
        Array.from({ length: n }, (_, k) => [m + rx * Math.cos((k / n) * Math.PI * 2), zc + rz * Math.sin((k / n) * Math.PI * 2)] as [number, number])
      onWall(light, a, b, oval(2.6, 2.3, 25.3, low ? 8 : 16), 0.45)
      onWall(copper, a, b, oval(1.9, 1.7, 25.3, low ? 8 : 16), 0.6)
      if (!low) onWall(gold, a, b, [[m - 1.0, 27.4], [m + 1.0, 27.4], [m + 0.7, 28.3], [m - 0.7, 28.3]], 0.62)
    }
    lathe([[0.25, 33.4], [0.25, 37.0], [0, 37.0]], () => gold, low ? 4 : 6, 40, [0, FRONT + 1.5])
    box(gold, -0.9, 0.9, FRONT + 1.3, FRONT + 1.7, 35.6, 36.0, null, 0)
    // Pedimented porticoes at the towers' feet (way/438780222-225).
    for (const [cx] of FT) {
      box(stone, cx - 4.5, cx + 4.5, FRONT - 4.6, FRONT - 3.1, 0, 14.5, light, 0.2)
      gableRoof(light, light, cx - 4.8, cx + 4.8, FRONT - 4.8, FRONT - 3.1, 14.5, 17, 'y', 0.2, 0.1)
      onWall(win, [cx - 4.5, FRONT - 4.6], [cx + 4.5, FRONT - 4.6], archShape(4.5, 3.2, 0.4, 8.6, 8), 0.05)
    }
  }
  // Transept pediments either side of the drum (way/438396412/413).
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? BODY_X0 - 0.5 : 18.5, x1 = side < 0 ? -18.5 : BODY_X1 + 0.5
    box(stone, Math.min(x0, x1), Math.max(x0, x1), -6.8, 14.8, ROOF, 29.6, null, 0)
    gableRoof(roof, stone, Math.min(x0, x1), Math.max(x0, x1), -6.8, 14.8, 29.6, 33, 'x', 0.3, 0.4)
  }

  // ── The drum ──
  const DR = 17.6, D0 = ROOF, D1 = 48.5, ATT1 = 54.2
  lathe([[22.2, D0], [22.2, D0 + 2.6], [DR + 0.4, D0 + 2.6]], (b) => (b === 1 ? roof : stone), K, 20, DC)
  lathe([[DR, D0 + 2.6], [DR, D1]], () => stone, K, 50, DC, Math.PI / K)
  // entablature, attic with the gallery, and the ring the angels sit on
  lathe([[DR, D1], [20.6, D1 + 0.6], [20.6, D1 + 2.2], [19.8, D1 + 2.4], [18.6, D1 + 2.4], [18.6, ATT1 - 0.6], [19.2, ATT1 - 0.3], [19.2, ATT1], [17.9, ATT1]], (b) => (b === 3 ? roof : stone), K, 20, DC)
  // 8 pairs of columns round the drum, with the big arched windows between.
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * TAU
    for (const da of [-0.075, 0.075]) {
      const c: XY = [DC[0] + 19.6 * Math.cos(a + da), DC[1] + 19.6 * Math.sin(a + da)]
      if (low) box(light, c[0] - 0.7, c[0] + 0.7, c[1] - 0.7, c[1] + 0.7, D0 + 2.6, D1 + 0.4, null, 0)
      else lathe([[0.95, D0 + 2.6], [0.95, D0 + 3.3], [0.72, D0 + 3.6], [0.72, D1 - 0.8], [0.95, D1 - 0.3], [0.95, D1 + 0.6], [0, D1 + 0.6]], () => light, 10, 40, c)
    }
    // The window in the bay between this pair and the next.
    const b = ((i + 1) / 8) * TAU
    const d: XY = [Math.cos(b), Math.sin(b)], t: XY = [-Math.sin(b), Math.cos(b)]
    const P = (s: number, z: number): V3 => [DC[0] + d[0] * (DR + 0.05) + t[0] * s, DC[1] + d[1] * (DR + 0.05) + t[1] * s, z]
    const arch = archShape(0, 4.4, 34.0, 43.0, low ? 4 : 8)
    const q = arch.map(([s, z]) => P(s, z))
    for (let k = 1; k < q.length - 1; k++) flatTri(win, q[0], q[k], q[k + 1], [d[0], d[1], 0])
    // The aedicule round the window: pilasters either side and a pediment.
    const out = (s: number, z: number, o: number): V3 => [DC[0] + d[0] * (DR + o) + t[0] * s, DC[1] + d[1] * (DR + o) + t[1] * s, z]
    const nd: V3 = [d[0], d[1], 0], nt: V3 = [t[0], t[1], 0]
    for (const sgn of [-1, 1]) {
      const s0 = sgn * 2.7, s1 = sgn * 3.4
      flat(stone, [out(s0, 33.4, 0.45), out(s1, 33.4, 0.45), out(s1, 45.6, 0.45), out(s0, 45.6, 0.45)], nd)
      flat(stone, [out(sgn > 0 ? s0 : s1, 33.4, 0), out(sgn > 0 ? s0 : s1, 33.4, 0.45), out(sgn > 0 ? s0 : s1, 45.6, 0.45), out(sgn > 0 ? s0 : s1, 45.6, 0)], sgn > 0 ? [-t[0], -t[1], 0] : nt)
    }
    {
      const z0 = 45.6, zt = 47.8, o = 0.7, w2 = 3.7
      const A = out(-w2, z0, o), B = out(w2, z0, o), C = out(0, zt, o)
      flatTri(light, A, B, C, nd)
      const A0 = out(-w2, z0, 0), B0 = out(w2, z0, 0), C0 = out(0, zt, 0)
      const up1: V3 = [nd[0] * 0, nd[1] * 0, 1]
      flat(light, [A, C, C0, A0], [-t[0] * 0.6, -t[1] * 0.6, 0.8])
      flat(light, [C, B, B0, C0], [t[0] * 0.6, t[1] * 0.6, 0.8])
      flat(light, [A0, B0, B, A], [0, 0, -1])
      void up1
    }
    // attic windows
    const q2 = rectShape(-1.4, 1.4, 51.4, 53.2).map(([s, z]) => [DC[0] + d[0] * 18.65 + t[0] * s, DC[1] + d[1] * 18.65 + t[1] * s, z] as V3)
    if (!low) { flatTri(win, q2[0], q2[1], q2[2], [d[0], d[1], 0]); flatTri(win, q2[0], q2[2], q2[3], [d[0], d[1], 0]) }
  }

  // ── The main dome: stilted, ribbed, with oculi ──
  const DOME: [number, number][] = [[18.0, ATT1], [17.9, 57.5], [17.3, 61.5], [15.9, 65.8], [13.6, 70.0], [10.3, 74.0], [6.6, 77.2], [3.9, 78.8]]
  ribbedDome(copper, copper, DOME, K, low ? 12 : 24, low ? 1.5 : 0.9, low ? 0.45 : 0.3, DC, 0, DOME.length - 1, Math.PI / (low ? 12 : 24))
  lathe([[3.9, 78.8], [0, 78.8]], () => copper, 12, 40, DC)
  // Oculi: two rows, dark, in bulging copper frames.
  {
    const rows: [number, number, number][] = low ? [[17.55, 59.2, 0.95]] : [[17.55, 59.2, 0.95], [12.9, 70.8, 0.7]]
    const nPer = low ? 12 : 24
    for (const [r, z, rad] of rows) {
      for (let i = 0; i < nPer; i++) {
        const a = (i / nPer) * TAU
        const d: XY = [Math.cos(a), Math.sin(a)], t: XY = [-Math.sin(a), Math.cos(a)]
        const slope = z > 65 ? 0.6 : 0.15 // lean back with the dome
        const nrm: V3 = [d[0], d[1], slope]
        const NO = low ? 5 : 8
        const ring = (rr: number, out: number) => Array.from({ length: NO }, (_, k) => {
          const u = rr * Math.cos((k / NO) * TAU), v = rr * Math.sin((k / NO) * TAU)
          return [DC[0] + d[0] * (r + out - v * slope) + t[0] * u, DC[1] + d[1] * (r + out - v * slope) + t[1] * u, z + v] as V3
        })
        const outer = ring(rad + 0.3, 0.35), inner = ring(rad, 0.42)
        if (!low) for (let k = 0; k < 8; k++) {
          const l = (k + 1) % 8
          flat(copper, [outer[k], outer[l], inner[l], inner[k]], nrm)
        }
        for (let k = 1; k < NO - 1; k++) flatTri(win, inner[0], inner[k], inner[k + 1], nrm)
      }
    }
  }
  // The lantern: copper columns round a glazed drum, the gilt flared cap,
  // ball and cross.
  lathe([[4.0, 78.6], [4.0, 79.3], [3.4, 79.3]], () => gold, low ? 10 : 16, 20, DC)
  lathe([[2.6, 79.3], [2.6, 83.6]], () => win, 12, 50, DC)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU, c: XY = [DC[0] + 3.3 * Math.cos(a), DC[1] + 3.3 * Math.sin(a)]
    lathe([[0.32, 79.3], [0.32, 83.8], [0, 83.8]], () => copper, low ? 4 : 6, 50, c)
  }
  lathe([[3.7, 83.6], [3.7, 84.3], [3.0, 84.6], [2.0, 85.4], [1.1, 86.6], [0.75, 88.0], [0.6, 89.0], [0, 89.0]], () => gold, low ? 8 : 16, 50, DC)
  lathe([[0.12, 89.0], [0.12, 89.5]], () => gold, 6, 50, DC)
  {
    const S: [number, number][] = []
    for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * Math.PI; S.push([0.75 * Math.cos(a), 90.2 + 0.75 * Math.sin(a)]) }
    S[0][0] = 0.001
    lathe(S, () => gold, low ? 8 : 10, 50, DC)
  }
  // The cross, 7 m: a square shaft and arms.
  box(gold, DC[0] - 0.3, DC[0] + 0.3, DC[1] - 0.3, DC[1] + 0.3, 90.9, 98, gold, low ? 0 : 0.05)
  box(gold, DC[0] - 0.3, DC[0] + 0.3, DC[1] - 1.8, DC[1] + 1.8, 95.4, 96.0, gold, low ? 0 : 0.05)
  box(gold, DC[0] - 1.8, DC[0] + 1.8, DC[1] - 0.3, DC[1] + 0.3, 95.4, 96.0, gold, low ? 0 : 0.05)

  // ── Corner towers ──
  function tower(c: XY, h: number, z0: number, belfry: [number, number], domeZ: number, domeR: number, domeTop: number, ballR: number) {
    const sq = (hh: number): XY[] => ccw(rect(c[0] - hh, c[0] + hh, c[1] - hh, c[1] + hh))
    prism(stone, sq(h), z0, belfry[1], null, 0)
    cornice(stone, sq(h), belfry[0] - 0.6, 0.6, 0.3, null)
    cornice(stone, sq(h), belfry[1], 1.2, 0.55, roof)
    // belfry arches on each face, and corner piers proud
    const faces: [XY, XY][] = [[[c[0] - h, c[1] - h], [c[0] + h, c[1] - h]], [[c[0] + h, c[1] - h], [c[0] + h, c[1] + h]], [[c[0] + h, c[1] + h], [c[0] - h, c[1] + h]], [[c[0] - h, c[1] + h], [c[0] - h, c[1] - h]]]
    const bw = h * 0.8
    for (const [a, b] of faces) {
      onWall(win, a, b, archShape(h, bw, belfry[0] + 0.3, belfry[1] - 1.0 - bw / 2, low ? 6 : 8), 0.05)
      if (!low) {
        onWall(stone, a, b, rectShape(0.2, 1.1, belfry[0], belfry[1]), 0.35)
        onWall(stone, a, b, rectShape(2 * h - 1.1, 2 * h - 0.2, belfry[0], belfry[1]), 0.35)
      }
    }
    // tambour and dome
    const tz = belfry[1] + 1.2
    lathe([[domeR + 0.5, tz], [domeR + 0.5, domeZ - 0.3], [domeR + 0.8, domeZ], [domeR, domeZ]], () => stone, low ? 12 : 20, 30, c)
    const dh = domeTop - domeZ
    const prof: [number, number][] = [[domeR, domeZ], [domeR * 0.97, domeZ + dh * 0.3], [domeR * 0.85, domeZ + dh * 0.6], [domeR * 0.6, domeZ + dh * 0.85], [domeR * 0.22, domeTop]]
    if (low) lathe(prof, () => copper, 8, 50, c)
    else ribbedDome(copper, copper, prof, 20, 8, 0.5, 0.18, c, 0, prof.length - 1, Math.PI / 8)
    lathe([[domeR * 0.22, domeTop], [domeR * 0.16, domeTop + 0.6], [domeR * 0.12, domeTop + 1.3], [0, domeTop + 1.3]], () => copper, 8, 40, c)
    const S: [number, number][] = []
    for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + (i / 5) * Math.PI; S.push([Math.max(0.001, ballR * Math.cos(a)), domeTop + 1.3 + ballR + ballR * Math.sin(a)]) }
    lathe(S, () => gold, low ? 6 : 8, 50, c)
  }
  for (const c of FT) tower(c, 5.8, ROOF, [33.0, 46.5], 50.3, 4.3, 57.8, 0.6)
  for (const c of RT) tower(c, 3.9, ROOF, [29.3, 35.0], 37.4, 2.9, 41.4, 0.45)

  // ── Statues: bold green bronze silhouettes in both models ──
  {
    /** A standing figure on a plinth: robe, shoulders, head; `wings` for the angels. */
    const figure = (c: XY, z: number, h: number, facing: number, part: Part, wings: boolean) => {
      const f: XY = [Math.cos(facing), Math.sin(facing)]
      if (low) {
        // a robed figure in one lathe: robe, shoulders, head
        lathe([[h * 0.2, z], [h * 0.12, z + h * 0.74], [h * 0.085, z + h * 0.84], [0, z + h]], () => part, 4, 40, c, Math.PI / 4)
      } else {
        box(stone, c[0] - h * 0.18, c[0] + h * 0.18, c[1] - h * 0.18, c[1] + h * 0.18, z, z + h * 0.12, null, 0.05)
        lathe([[h * 0.16, z + h * 0.12], [h * 0.13, z + h * 0.55], [h * 0.11, z + h * 0.78], [h * 0.06, z + h * 0.82]], () => part, 6, 40, c)
        const head: [number, number][] = [[0.001, z + h * 0.8], [h * 0.065, z + h * 0.86], [h * 0.06, z + h * 0.93], [0.001, z + h * 0.98]]
        lathe(head, () => part, 6, 60, c)
      }
      if (wings) {
        for (const s of [-1, 1]) {
          const side: XY = [-f[1] * s, f[0] * s]
          const root: V3 = [c[0] + side[0] * h * 0.08 - f[0] * h * 0.06, c[1] + side[1] * h * 0.08 - f[1] * h * 0.06, z + h * 0.72]
          const tip: V3 = [c[0] + side[0] * h * 0.42 - f[0] * h * 0.2, c[1] + side[1] * h * 0.42 - f[1] * h * 0.2, z + h * 1.02]
          const low2: V3 = [c[0] + side[0] * h * 0.16 - f[0] * h * 0.14, c[1] + side[1] * h * 0.16 - f[1] * h * 0.14, z + h * 0.3]
          part.tri(root, tip, low2); part.tri(root, low2, tip)
        }
      }
    }
    // The 20 angels round the dome's foot, on the attic ring.
    for (let i = 0; i < 20; i++) {
      const a = ((i + 0.5) / 20) * TAU
      figure([DC[0] + 19.0 * Math.cos(a), DC[1] + 19.0 * Math.sin(a)], ATT1, low ? 4.0 : 3.4, a, copper, true)
    }
    // Figures on the front attic and over the columns, and on the towers' corners.
    for (const x of [-13.7, -9.3, 9.3, 13.7]) figure([x, FRONT - 2.2], 27.9, low ? 4.2 : 3.6, -Math.PI / 2, copper, false)
    for (const x of [-21, 21]) figure([x, FRONT + 0.6], 28.8, low ? 3.8 : 3.2, -Math.PI / 2, copper, false)
    // and over the corner pavilions' columns
    for (const [cx, cy] of FT) for (const side of [-1, 1]) figure([cx + side * 5.9, cy - 11.4], 27.6, low ? 3.8 : 3.2, -Math.PI / 2, copper, false)
    figure([0, FRONT + 1.5], 31.2, 2.4, -Math.PI / 2, copper, true)
    // the bronze figures standing between the portico's column pairs
    for (const x of [-11.5, 11.5]) figure([x, FRONT - 1.0], 9, low ? 4.6 : 4.2, -Math.PI / 2, copper, false)
    for (const [cx, cy] of FT) for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) figure([cx + sx * 5.6, cy + sy * 5.6], 46.2, low ? 3.4 : 2.8, Math.atan2(sy, sx), copper, false)
    if (!low) {
      // more figures along the front balustrade and on the transept gables
      for (const x of [-24.5, -17.5, 17.5, 24.5]) figure([x, FRONT + 0.6], 28.8, 3.0, -Math.PI / 2, copper, false)
      for (const sx of [-1, 1]) for (const y of [-6.4, 4.0, 14.4]) figure([sx * (sx < 0 ? -BODY_X0 + 0.3 : BODY_X1 + 0.3), y], y === 4.0 ? 33.0 : 29.6, 3.0, sx < 0 ? Math.PI : 0, copper, y === 4.0)
      // the drum gallery's balustrade
      for (let i = 0; i < 64; i++) {
        const an = (i / 64) * TAU, c: XY = [DC[0] + 20.2 * Math.cos(an), DC[1] + 20.2 * Math.sin(an)]
        box(light, c[0] - 0.16, c[0] + 0.16, c[1] - 0.16, c[1] + 0.16, D1 + 2.2, D1 + 3.2, null, 0)
      }
      lathe([[20.4, D1 + 3.2], [20.4, D1 + 3.45], [19.9, D1 + 3.45], [19.9, D1 + 3.2]], () => light, 40, 20, DC)
      // balustrade along the side attics
      for (const x of [BODY_X0 + 0.25, BODY_X1 - 0.25]) for (let y = -19; y <= 30; y += 1.2) if (y < -7.5 || y > 15.5) box(stone, x - 0.2, x + 0.2, y - 0.2, y + 0.2, ROOF, ROOF + 1.1, null, 0)
    }
    // Balustrade posts along the attic's front (detail only).
    if (!low) for (let x = -24; x <= 24; x += 1.2) if (Math.abs(x) > 5.5) box(stone, x - 0.2, x + 0.2, FRONT + 0.1, FRONT + 0.5, ROOF, ROOF + 1.1, null, 0)
  }

  // ── Output ──
  // Sandstone: the photos' dark, sooty brown-grey (about #7c6f5e, a touch
  // lighter for the map's shading); flat roofs and the portico's shadowed
  // walls a dark grey; copper: the dome's blue-green patina; gold: the
  // lantern cap, balls and crosses.
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : p[2] < 60 ? 0.9 : 0.6)
  const domeLit = (p: V3, n: V3) => (p[2] < 70 ? 0.45 : 0.25)
  const parts = [
    { part: stone, material: { ...finish('dom-sandstone', 0x857866), floodlight: lit } },
    { part: copper, material: low ? finish('dom-copper', 0x6c9d8d) : { ...finish('dom-copper', 0x6c9d8d), floodlight: domeLit } },
    { part: light, material: { ...finish('dom-sandstone-light', 0xb4a68e), floodlight: lit } },
    { part: gold, material: finish('dom-gilt', 0xd1a548, 0.5) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('dom-roof', 0x5e6164) },
  ]
  const extras = { bearing: 58.5, elevation: 0, height: 98 }
  if (process.env.DEBUG) console.log(parts.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
  if (low) return save('berlin-dom', 'Berliner Dom', parts, extras, 6500)
  const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb('Berliner Dom', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east; metres; origin at the ground anchor', ...extras })
  if (tris > 40000 || glb.length > 1_500_000) throw new Error(`detail over budget: ${tris} triangles, ${glb.length} bytes`)
  await Bun.write(new URL('../models/berlin-dom.detail.glb', import.meta.url).pathname, glb)
  console.log(parts.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
  console.log(`models/berlin-dom.detail.glb: ${tris} triangles, ${glb.length} bytes`)
}

/** A flat triangle facing `n`. */
function flatTri(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const f = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (f[0] * n[0] + f[1] * n[1] + f[2] * n[2] >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

await build(true)
await build(false)
void capPoly
