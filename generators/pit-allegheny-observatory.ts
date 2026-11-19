/**
 * Allegheny Observatory (Thorsten E. Billquist, 1912), Riverview Park,
 * Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-allegheny-observatory.ts
 *
 * Imports `drum` and `ring` from pit-hamerschlag-hall.ts (merge that first).
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/253993952, -80.020666 40.482563. The walls run at 1° / 91°,
 * so the catalog bearing is 1: model +x (east) is the entrance front with
 * its portico, -x the big dome.
 *
 * Identity, in order: the three white observatory domes with their
 * shutter strips: the big dome on a tall round drum at the west end, and
 * two smaller domes on round drums at the ends of the entrance front (the
 * north-east one on a tall plain drum, the south-east one ringed by a
 * curved Ionic colonnade); the classical entrance portico (two Ionic
 * columns in antis under a pediment, ALLEGHENY OBSERVATORY in the frieze)
 * up a flight of steps; the long low body between them with a white
 * pierced parapet; buff brick over a rusticated brown sandstone basement,
 * white terracotta cornices and bands; the pilastered Draper/Keeler annex
 * against the big dome's south side.
 *
 * Evidence:
 *  - plan: OSM way/253993952 (the three dome circles: big centre
 *    (-17.5, -2.4) r 7.9, north-east (15.6, 17.6) r 5.3, south-east
 *    (16, -9.7) r 4.4; the annex square x -18.6..-12, y -19.3..-12.2) and
 *    USGS NAIP (public domain) for the body between them (x -9..19,
 *    y -9.5..7.5, and to y 13 in its east part where it meets the
 *    north-east drum), the portico (x 19..23, centred y 4.5) and the
 *    south-east colonnade ring (r 5.5).
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid (sparse returns on the domes), above the ground round the
 *    building (371.8 m NAVD88; the hilltop is level to about a metre):
 *    big dome 24.0 at the top, its foot at 15.6; north-east dome 17.9;
 *    south-east dome 15.0; body parapet 11.2, roof 10.5; portico pediment
 *    12.2; annex 9.5.
 *  - published: completed 1912, architect Thorsten E. Billquist; the
 *    30-inch Thaw refractor in the big dome, the 13-inch Fitz-Clark and
 *    the Keeler reflector in the small ones (Wikipedia, "Allegheny
 *    Observatory"; OSM tags).
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Allegheny Observatory, 2015-05-14, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_Observatory,_2015-05-14,_01.jpg
 *      Cbaile19, CC0 — the portico head-on.
 *    "Allegheny Observatory, 2015-05-14, 04.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_Observatory,_2015-05-14,_04.jpg
 *      Cbaile19, CC0 — the north side: north-east drum, the low wing, the big dome.
 *    "Allegheny Observatory, 2014-10-08, 01.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_Observatory,_2014-10-08,_01.jpg
 *      Cbaile19, CC0 — the south side: big dome, annex, colonnaded dome.
 *    "Allegheny Observatory, 2021-12-23, 01 HDR.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_Observatory,_2021-12-23,_01_HDR.jpg
 *      Cbaile19, CC0 — the whole entrance front from the east lawn.
 *    "Allegheny Observatory, August 2014.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_Observatory,_August_2014.jpg
 *      Niagara, CC BY-SA 3.0 — big dome and annex from the south-west.
 *    "Allegheny Observatory 2007a.jpg"
 *      https://commons.wikimedia.org/wiki/File:Allegheny_Observatory_2007a.jpg
 *      Tom Murphy VII, public domain — the big dome's drum bands and the slit.
 *  - colour: white-painted domes, buff brick, white terracotta, brown
 *    sandstone basement, all pulled to the palette's lightness.
 * Estimated (from the photos scaled to the lidar heights): the drums' band
 * heights, the colonnade (columns 6.6 m), window sizes and counts, the
 * portico's columns, the annex's pilasters; the slits are drawn closed.
 *
 * Left out: the pierced pattern of the parapet, the frieze lettering, the
 * small hatches on the small domes, lamps, the stair walls.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { band, poly } from './pit-allegheny-county-courthouse'
import { pier } from './pit-heinz-chapel'
import { drum, ring } from './pit-hamerschlag-hall'

/** Tangent wall a→b on a drum at angle t (radians), L wide, for panels. */
function onDrum(cx: number, cy: number, r: number, t: number, L: number): [XY, XY] {
  const c: XY = [cx + r * Math.cos(t), cy + r * Math.sin(t)], u: XY = [-Math.sin(t), Math.cos(t)]
  return [[c[0] - (u[0] * L) / 2, c[1] - (u[1] * L) / 2], [c[0] + (u[0] * L) / 2, c[1] + (u[1] * L) / 2]]
}

/**
 * An observatory dome: a hemisphere of radius R springing at zs, with the
 * closed shutter strip (w wide, h proud) running over the crown from the
 * foot on the `t` side to past the top.
 */
function dome(p: Part, cx: number, cy: number, R: number, zs: number, t: number, w = 2.2, h = 0.35, seg = 20) {
  const prof: XY[] = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 7) * (Math.PI / 2)
    return [R * Math.cos(a), zs + R * Math.sin(a)] as XY
  })
  lathe(p, cx, cy, prof, seg)
  const dir: XY = [Math.cos(t), Math.sin(t)], side: XY = [-dir[1], dir[0]]
  const n = 9, a0 = 0.02, a1 = Math.PI / 2 + 0.35
  const pt = (a: number, s: number, rr: number): V3 => {
    const k = Math.sqrt(Math.max(0, rr * rr - s * s))
    return [cx + dir[0] * k * Math.cos(a) + side[0] * s, cy + dir[1] * k * Math.cos(a) + side[1] * s, zs + k * Math.sin(a)]
  }
  for (let i = 0; i < n; i++) {
    const b0 = a0 + ((a1 - a0) * i) / n, b1 = a0 + ((a1 - a0) * (i + 1)) / n
    const out: V3 = [dir[0] * Math.cos((b0 + b1) / 2), dir[1] * Math.cos((b0 + b1) / 2), Math.sin((b0 + b1) / 2)]
    poly(p, [pt(b0, -w / 2, R + h), pt(b0, w / 2, R + h), pt(b1, w / 2, R + h), pt(b1, -w / 2, R + h)], out)
    poly(p, [pt(b0, w / 2, R - 0.2), pt(b1, w / 2, R - 0.2), pt(b1, w / 2, R + h), pt(b0, w / 2, R + h)], [side[0], side[1], 0])
    poly(p, [pt(b0, -w / 2, R - 0.2), pt(b1, -w / 2, R - 0.2), pt(b1, -w / 2, R + h), pt(b0, -w / 2, R + h)], [-side[0], -side[1], 0])
  }
  poly(p, [pt(a0, -w / 2, R - 0.2), pt(a0, w / 2, R - 0.2), pt(a0, w / 2, R + h), pt(a0, -w / 2, R + h)], [dir[0], dir[1], -0.2])
  poly(p, [pt(a1, -w / 2, R - 0.2), pt(a1, w / 2, R - 0.2), pt(a1, w / 2, R + h), pt(a1, -w / 2, R + h)], [-dir[0], -dir[1], 0.3])
}

/** A drum's white band: a projecting ring (lip) from z0 to z1 at radius r + d over a drum of radius r. */
function lip(p: Part, cx: number, cy: number, r: number, d: number, z0: number, z1: number, rTop: number, seg = 20) {
  drum(p, cx, cy, r + d, z0, r + d, z1, seg)
  ring(p, cx, cy, r + d, r, z0, false, seg)
  ring(p, cx, cy, r + d, rTop, z1, true, seg)
}

function build() {
  const brick = new Part(), sand = new Part(), trim = new Part(), white = new Part(), win = new Part(), roof = new Part()

  // ---- the body: basement, brick walls, white cornice and pierced parapet
  const BASE = 2.8, CORN = 9.4, PAR = 11.2, ROOF = 10.5
  const body: XY[] = [[-9, -9.5], [19, -9.5], [19, 13], [8, 13], [8, 7.5], [-9, 7.5]]
  walls(sand, body, 0, BASE)
  walls(brick, body, BASE, CORN - 0.6)
  band(trim, body, [[-9.35, -9.85], [19.35, -9.85], [19.35, 13.35], [8.35, 13.35], [8.35, 7.85], [-9.35, 7.85]], CORN - 0.6, CORN, 0.25)
  walls(trim, body, CORN, PAR)
  const inner: XY[] = [[-8.6, -9.1], [18.6, -9.1], [18.6, 12.6], [8.4, 12.6], [8.4, 7.1], [-8.6, 7.1]]
  walls(trim, [...inner].reverse(), ROOF, PAR)
  for (let i = 0; i < body.length; i++) {
    const j = (i + 1) % body.length
    trim.quad([body[i][0], body[i][1], PAR], [body[j][0], body[j][1], PAR], [inner[j][0], inner[j][1], PAR], [inner[i][0], inner[i][1], PAR])
  }
  cap(roof, inner, ROOF)

  // windows: white-framed on the main floor, small ones in the basement
  const wins = (fa: XY, fb: XY, ss: number[], w = 2.6) => {
    for (const s of ss) {
      panel(trim, fa, fb, s - w / 2 - 0.35, s + w / 2 + 0.35, BASE + 1.0, BASE + 4.6, 0.04)
      panel(win, fa, fb, s - w / 2 + 0.1, s + w / 2 - 0.1, BASE + 1.35, BASE + 4.25, 0.07)
      panel(win, fa, fb, s - 0.5, s + 0.5, 0.7, 1.9, 0.04)
    }
  }
  wins([-9, -9.5], [19, -9.5], [-2.5, 2.5, 7.5]) // south, west of the colonnade drum
  wins([8, 7.5], [-9, 7.5], [3.5, 9.5, 14.0]) // north
  wins([19, -9.5], [19, 13], [8.0, 20.5]) // east front, either side of the portico
  wins([19, 13], [8, 13], [5.5], 2.0)

  // ---- the portico: steps, two Ionic columns in antis, pediment
  const PY = 4.5, PX0 = 19, PX1 = 23, PH = 3.6
  walls(sand, rect(PX0, PY - PH, PX1, PY + PH), 0, BASE)
  cap(sand, rect(PX0, PY - PH, PX1, PY + PH), BASE)
  for (let i = 0; i < 6; i++) {
    const r = rect(PX1, PY - 2.2, PX1 + 3.6 - i * 0.6, PY + 2.2)
    walls(sand, r, 0, (BASE * (i + 1)) / 6)
    cap(sand, r, (BASE * (i + 1)) / 6)
  }
  const COL = 9.4, ENT = 11.0, APEX = 12.3
  for (const y of [PY - PH + 0.45, PY + PH - 0.45]) walls(trim, rect(PX1 - 0.9, y - 0.45, PX1, y + 0.45), BASE, COL)
  for (const y of [PY - 1.3, PY + 1.3]) {
    drum(trim, PX1 - 0.45, y, 0.36, BASE, 0.32, COL - 0.4, 10)
    drum(trim, PX1 - 0.45, y, 0.5, COL - 0.4, 0.5, COL, 10)
  }
  panel(trim, [PX0, PY - PH], [PX0, PY + PH], PH - 1.2, PH + 1.2, BASE, BASE + 4.7, 0.04)
  panel(win, [PX0, PY - PH], [PX0, PY + PH], PH - 0.85, PH + 0.85, BASE, BASE + 4.3, 0.07)
  walls(trim, rect(PX0, PY - PH, PX1 + 0.1, PY + PH), COL, ENT)
  trim.quad([PX0, PY - PH, COL], [PX0, PY + PH, COL], [PX1 + 0.1, PY + PH, COL], [PX1 + 0.1, PY - PH, COL]) // soffit
  poly(trim, [[PX1 + 0.1, PY - PH, ENT], [PX1 + 0.1, PY + PH, ENT], [PX1 + 0.1, PY, APEX]], [1, 0, 0])
  poly(roof, [[PX0, PY - PH - 0.2, ENT], [PX1 + 0.3, PY - PH - 0.2, ENT], [PX1 + 0.3, PY, APEX + 0.1], [PX0, PY, APEX + 0.1]], [0, -1, 2.5])
  poly(roof, [[PX0, PY + PH + 0.2, ENT], [PX1 + 0.3, PY + PH + 0.2, ENT], [PX1 + 0.3, PY, APEX + 0.1], [PX0, PY, APEX + 0.1]], [0, 1, 2.5])

  // ---- the big dome: drum, white bands, dome with its slit
  const BX = -17.5, BY = -2.6, BR = 8.0
  drum(sand, BX, BY, BR + 0.15, 0, BR + 0.15, 2.6, 24)
  ring(sand, BX, BY, BR + 0.15, BR, 2.6, true, 24)
  drum(brick, BX, BY, BR, 2.6, BR, 10.6, 24)
  drum(trim, BX, BY, BR, 10.6, BR, 12.4, 24)
  lip(trim, BX, BY, BR, 0.4, 12.4, 13.1, BR - 0.1, 24)
  drum(trim, BX, BY, BR - 0.1, 13.1, BR - 0.1, 14.6, 24)
  lip(trim, BX, BY, BR - 0.1, 0.4, 14.6, 15.3, BR - 0.3, 24)
  dome(white, BX, BY, BR - 0.3, 15.3, -Math.PI / 2 + 0.25, 2.6, 0.6, 24)
  for (const t of [Math.PI * 0.75, Math.PI, Math.PI * 1.25, Math.PI * 0.5]) {
    const [a, b] = onDrum(BX, BY, BR, t, 1.6), { L } = onWall(a, b)
    panel(trim, a, b, L / 2 - 0.65, L / 2 + 0.65, 5.4, 7.6, 0.04)
    panel(win, a, b, L / 2 - 0.45, L / 2 + 0.45, 5.6, 7.3, 0.08)
    panel(win, a, b, L / 2 - 0.4, L / 2 + 0.4, 0.6, 2.0, 0.19)
  }

  // ---- the Draper/Keeler annex against the big dome's south side
  {
    const r = rect(-20.5, -20.0, -11.5, -10.0)
    walls(sand, r, 0, BASE)
    cap(sand, r, BASE)
    const top = rect(-20.2, -19.7, -11.8, -10.0)
    walls(brick, top, BASE, 8.6)
    band(trim, top, rect(-20.55, -20.05, -11.45, -10.0), 8.6, 9.5, 0.25)
    cap(roof, top, 9.45)
    for (const [fa, fb] of [[top[0], top[1]], [top[1], top[2]], [top[3], top[0]]] as [XY, XY][]) {
      const { L } = onWall(fa, fb)
      for (const s of [0.4, L - 0.4]) pier(trim, fa, fb, s, 0.8, BASE, 8.6, 0.25)
      for (const s of [L * 0.32, L * 0.68]) pier(trim, fa, fb, s, 0.7, BASE, 8.6, 0.2)
      panel(win, fa, fb, L / 2 - 0.7, L / 2 + 0.7, BASE + 0.4, BASE + 4.6, 0.05)
      for (const s of [L * 0.16, L * 0.84]) panel(win, fa, fb, s - 0.4, s + 0.4, BASE + 1.4, BASE + 3.6, 0.05)
    }
  }

  // ---- the north-east dome on its tall plain drum
  {
    const cx = 15.2, cy = 18.2, r = 5.4
    drum(sand, cx, cy, r + 0.1, 0, r + 0.1, 1.7, 20)
    ring(sand, cx, cy, r + 0.1, r, 1.7, true, 20)
    drum(brick, cx, cy, r, 1.7, r, 9.4, 20)
    lip(trim, cx, cy, r, 0.45, 9.4, 9.9, r - 0.1)
    drum(trim, cx, cy, r - 0.1, 9.9, r - 0.1, 12.0, 20)
    lip(trim, cx, cy, r - 0.1, 0.3, 12.0, 12.5, r - 0.15)
    dome(white, cx, cy, r - 0.15, 12.5, Math.PI / 2 - 0.4, 1.6, 0.4, 20)
    for (const t of [0, Math.PI * 0.35, Math.PI * 0.7, -Math.PI * 0.3]) {
      const [a, b] = onDrum(cx, cy, r, t, 1.4), { L } = onWall(a, b)
      panel(trim, a, b, L / 2 - 0.6, L / 2 + 0.6, 4.4, 6.6, 0.04)
      panel(win, a, b, L / 2 - 0.42, L / 2 + 0.42, 4.6, 6.3, 0.08)
    }
  }

  // ---- the south-east dome inside its curved colonnade
  {
    const cx = 15.6, cy = -9.3, r = 4.3, RU = 4.8, RC = 5.6, TOP = 7.6, ER = 8.6
    drum(brick, cx, cy, r, 0, r, ER, 20)
    drum(sand, cx, cy, RC + 0.4, 0, RC + 0.4, 1.0, 24)
    ring(sand, cx, cy, RC + 0.4, r, 1.0, true, 24)
    const inBody = (x: number, y: number) => x > -9 && x < 19 && y > -9.5 && y < 13
    for (let k = 0; k < 16; k++) {
      const t = (k / 16) * 2 * Math.PI
      const x = cx + RC * Math.cos(t), y = cy + RC * Math.sin(t)
      if (inBody(x, y)) continue
      drum(trim, x, y, 0.32, 1.0, 0.28, TOP - 0.35, 8)
      drum(trim, x, y, 0.42, TOP - 0.35, 0.42, TOP, 8)
    }
    drum(trim, cx, cy, RC + 0.45, TOP, RC + 0.45, ER, 24)
    ring(trim, cx, cy, RC + 0.45, r, TOP, false, 24)
    ring(roof, cx, cy, RC + 0.45, RU, ER, true, 24)
    for (const t of [-Math.PI * 0.75, -Math.PI * 0.5, -Math.PI * 0.25, 0]) {
      const [a, b] = onDrum(cx, cy, r, t, 1.4), { L } = onWall(a, b)
      panel(win, a, b, L / 2 - 0.5, L / 2 + 0.5, 3.0, 6.2, 0.05)
    }
    drum(trim, cx, cy, RU, ER, RU, 10.4, 20)
    lip(trim, cx, cy, RU, 0.3, 10.4, 10.9, RU - 0.2)
    for (const t of [-Math.PI * 0.6, -Math.PI * 0.2, Math.PI * 0.2]) {
      const [a, b] = onDrum(cx, cy, RU, t, 1.4), { L } = onWall(a, b)
      panel(win, a, b, L / 2 - 0.45, L / 2 + 0.45, 9.0, 10.1, 0.05)
    }
    dome(white, cx, cy, RU - 0.2, 10.9, -Math.PI / 2 - 0.5, 1.5, 0.35, 20)
  }

  return [
    { part: brick, material: finish('buff-brick', 0xdcd0b2) },
    { part: sand, material: finish('sandstone', 0xcfae8c) },
    { part: trim, material: PALETTE.trim },
    { part: white, material: finish('dome-white', 0xe8e9e6, 0.6) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('pit-allegheny-observatory', 'Allegheny Observatory', [40.482563, -80.020666], 1, build() as any, 6500)
