/**
 * South Beach lifeguard tower, 13th Street, Miami Beach — original
 * procedural geometry, CC0-1.0.
 * bun generators/mia-lifeguard-tower.ts
 *
 * Which tower: the stand at the foot of 13th Street, OSM way/567439901
 * (building=lifeguard_tower, named "Candy Colored Lifeguard Tower"; 13th
 * Street meets the beach at the same latitude, 25.7839). It is drawn as
 * it stands since the post-2018 rebuild (William Lane's later series): a
 * red cabin clad in vertical ribs that wrap over its rounded top, an orange
 * side room, two red flat wing roofs, a yellow deck and fascia ("13 ST"),
 * an orange "MIAMI BEACH" beam, splayed orange legs with grey steel
 * X-bracing, yellow sled skids, and a red ramp down the ocean side. The
 * 2010s stars-and-stripes tower at this street (Summerbrize 2012, Gzzz
 * 2016 on Commons) has been replaced and is not what is modelled.
 *
 * Map frame: x east, y north, z up, metres; built turned to the OSM
 * square's sides (bearing 7.5), so +x faces the ocean. Anchor = centroid
 * of way/567439901 (25.783829, -80.1278776). y = 0 is the sand.
 *
 * Evidence:
 *  - plan: OSM way/567439901, a 3.7 m square at 7.5 deg (the deck and
 *    cabin); USGS NAIP shows the red roof over the west part and the
 *    yellow deck on the east (ocean) side.
 *  - elevations and colours: Anthony Quintano's 2020 collage (the 13 ST
 *    tower seen square from the land side), scaled at 135 px/m from the
 *    3.7 m deck: skids to 0.4 m, deck underside 1.5, fascia to 1.7,
 *    railing 2.65, wings 3.6-3.8, cabin top 4.2; red cabin 1.9 m wide,
 *    orange side room, wings 3.4 m across.
 *  - the ocean side and the ramp: Radomianin's 2018 photo of a tower of the
 *    same series (the deck, railing and ramp layout), and the ramp's red
 *    stringer seen under the deck in the collage.
 *  - estimated: cabin depth (2.45 m of the 3.7), ramp length and side,
 *    the front windows. Railings are drawn as a top rail and posts only.
 * No lidar: the 2019 flight is before this tower and it is too small.
 *
 * Night: unlit.
 *
 * Photos:
 *  - "Miami Beach Lifeguard Towers Collage - Flickr - Anthony Quintano.jpg",
 *    Anthony Quintano, CC BY 2.0 (Wikimedia Commons; 12 July 2020)
 *  - "Lifeguard stand, Miami Beach.jpg", Radomianin, CC BY-SA 4.0
 *    (Wikimedia Commons; 30 August 2018; another tower of the series)
 *  - USGS NAIP orthophoto (public domain)
 * Look-only: none.
 *
 * Doubts: only the land side of this tower is photographed openly; the
 * ocean side follows its sister tower. The tower may be repainted again.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-aon-center'
import { box, hexa, poly, strut } from './mia-marine-stadium'

function build() {
  const red = new Part(), orange = new Part(), yellow = new Part(), steel = new Part(), win = new Part()

  const X0 = -1.85, X1 = 1.85, Y0 = -1.85, Y1 = 1.85
  // --- sled skids and the base frame ---
  for (const y of [-1.95, 1.95]) box(yellow, -2.1, 2.1, y - 0.15, y + 0.15, 0, 0.2)
  for (const x of [-1.7, 1.7]) box(yellow, x - 0.15, x + 0.15, -2.1, 2.1, 0.2, 0.4)

  // --- splayed legs and X bracing ---
  const legs: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (const [sx, sy] of legs) {
    hexa(orange, [
      [sx * 1.85 - 0.15, sy * 1.85 - 0.15, 0.4], [sx * 1.85 + 0.15, sy * 1.85 - 0.15, 0.4], [sx * 1.85 + 0.15, sy * 1.85 + 0.15, 0.4], [sx * 1.85 - 0.15, sy * 1.85 + 0.15, 0.4],
      [sx * 1.45 - 0.13, sy * 1.45 - 0.13, 1.5], [sx * 1.45 + 0.13, sy * 1.45 - 0.13, 1.5], [sx * 1.45 + 0.13, sy * 1.45 + 0.13, 1.5], [sx * 1.45 - 0.13, sy * 1.45 + 0.13, 1.5],
    ])
  }
  const leg = (sx: number, sy: number, z: number): V3 => {
    const t = (z - 0.4) / 1.1, r = 1.85 - 0.4 * t
    return [sx * r, sy * r, z]
  }
  for (const [a, b] of [[0, 1], [1, 2], [2, 3], [3, 0]]) {
    const [ax, ay] = legs[a], [bx, by] = legs[b]
    strut(steel, leg(ax, ay, 0.5), leg(bx, by, 1.4), 0.14)
    strut(steel, leg(bx, by, 0.5), leg(ax, ay, 1.4), 0.14)
  }
  // the MIAMI BEACH beam across the land side and the ocean side
  for (const x of [-1.62, 1.62]) box(orange, x - 0.1, x + 0.1, -1.5, 1.5, 1.09, 1.33)

  // --- deck and fascia ---
  box(yellow, X0, X1, Y0, Y1, 1.5, 1.7)

  // --- cabin: orange room, red ribbed cabin with a rounded top ---
  const CX0 = X0, CX1 = 0.6
  box(orange, CX0 + 0.05, CX1 - 0.05, 0.95, 1.55, 1.7, 3.6) // side room (north)
  const RW = 0.95, RR = 0.35, ZT = 4.2
  // section across y with rounded top corners, extruded along x
  const sect: [number, number][] = [[-RW, 1.7]]
  for (let i = 0; i <= 4; i++) { const a = Math.PI - (i * Math.PI) / 8; sect.push([-RW + RR + RR * Math.cos(a), ZT - RR + RR * Math.sin(a)]) }
  for (let i = 4; i >= 0; i--) { const a = (i * Math.PI) / 8; sect.push([RW - RR + RR * Math.cos(a), ZT - RR + RR * Math.sin(a)]) }
  sect.push([RW, 1.7])
  for (let i = 0; i < sect.length - 1; i++) {
    const [y0, z0] = sect[i], [y1, z1] = sect[i + 1]
    const n: V3 = [0, z1 - z0, -(y1 - y0)]
    poly(red, [[CX0, y0, z0], [CX1, y0, z0], [CX1, y1, z1], [CX0, y1, z1]], [0, -n[1], -n[2]])
  }
  for (const [x, s] of [[CX0, -1], [CX1, 1]] as [number, number][]) {
    const pts = sect.map(([y, z]): V3 => [x, y, z])
    poly(red, pts, [s, 0, 0])
  }
  // windows: small one at the back, a wide one and the door glass in front
  poly(win, [[CX0 - 0.03, -0.18, 3.1], [CX0 - 0.03, 0.18, 3.1], [CX0 - 0.03, 0.18, 3.45], [CX0 - 0.03, -0.18, 3.45]], [-1, 0, 0])
  poly(win, [[CX1 + 0.03, -0.75, 2.6], [CX1 + 0.03, 0.75, 2.6], [CX1 + 0.03, 0.75, 3.55], [CX1 + 0.03, -0.75, 3.55]], [1, 0, 0])
  for (const s of [-1, 1]) poly(win, [[CX0 + 0.5, s * (RW + 0.03), 2.7], [CX1 - 0.5, s * (RW + 0.03), 2.7], [CX1 - 0.5, s * (RW + 0.03), 3.45], [CX0 + 0.5, s * (RW + 0.03), 3.45]], [0, s, 0])

  // --- the two red wing roofs ---
  box(red, CX0 - 0.05, CX1 + 0.25, -1.75, -RW + 0.02, 3.6, 3.8)
  box(red, CX0 - 0.05, CX1 + 0.25, RW - 0.02, 1.75, 3.6, 3.8)

  // --- railings round the deck: posts and a top rail ---
  const rail = (a: V3, b: V3) => box(yellow, Math.min(a[0], b[0]) - 0.05, Math.max(a[0], b[0]) + 0.05, Math.min(a[1], b[1]) - 0.05, Math.max(a[1], b[1]) + 0.05, 2.55, 2.65)
  rail([CX1, Y0 + 0.08, 0], [X1 - 0.08, Y0 + 0.08, 0])
  rail([X1 - 0.08, Y0 + 0.08, 0], [X1 - 0.08, Y1 - 0.08, 0])
  rail([CX1, Y1 - 0.08, 0], [X1 - 0.08, Y1 - 0.08, 0])
  rail([X0 + 0.08, Y0 + 0.08, 0], [CX0 + 0.08, -RW, 0])
  for (const [x, y] of [[X1 - 0.08, Y0 + 0.08], [X1 - 0.08, Y1 - 0.08], [CX1 + 0.6, Y0 + 0.08], [CX1 + 0.6, Y1 - 0.08], [X1 - 0.08, 0]] as [number, number][])
    box(yellow, x - 0.05, x + 0.05, y - 0.05, y + 0.05, 1.7, 2.55)

  // --- stair ramp down the ocean side, from the deck's north end to the south ---
  const RX0 = X1, RX1 = X1 + 0.75
  const YB = -2.3, YT = 1.3
  const ramp = (y: number) => 1.7 * Math.max(0, (y - YB) / (YT - YB))
  hexa(yellow, [[RX0, YB, 0], [RX1, YB, 0], [RX1, YT, ramp(YT) - 0.15], [RX0, YT, ramp(YT) - 0.15], [RX0, YB, 0.12], [RX1, YB, 0.12], [RX1, YT, ramp(YT)], [RX0, YT, ramp(YT)]])
  for (const x of [RX0 - 0.04, RX1 + 0.04]) {
    const s = x < RX0 ? -1 : 1
    poly(red, [[x, YB, 0], [x, YT, ramp(YT) - 0.35], [x, YT, ramp(YT) + 0.15], [x, YB, 0.3]], [s, 0, 0])
  }

  return [
    { part: red, material: finish('lg-red', 0xd9524a) },
    { part: orange, material: finish('lg-orange', 0xee8d34) },
    { part: yellow, material: finish('lg-yellow', 0xf0cd3c) },
    { part: steel, material: finish('lg-steel', 0x8b9196) },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('mia-lifeguard-tower', 'South Beach Lifeguard Tower (13th Street)', [25.783829, -80.1278776], 7.5, build(), 5000)
