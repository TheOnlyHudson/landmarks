/**
 * Stephen Foster Memorial (University of Pittsburgh, 1935-1937, Charles Z.
 * Klauder), Forbes Avenue beside the Cathedral of Learning, Oakland,
 * Pittsburgh — original procedural geometry, CC0-1.0.
 * bun generators/pit-stephen-foster-memorial.ts
 *
 * Imports the Gothic helpers from pit-heinz-chapel.ts and the
 * Richardsonian kit's `poly`/`band`/`wallsSplit` from
 * pit-allegheny-county-courthouse.ts; both must be merged first.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/121051329, -79.9527510 40.4438080. The main walls run at
 * 341° / 71°, so the catalog bearing is 341: model -y faces south-south-east
 * (the twin-portal entrance toward Forbes Avenue), +y north-north-west (the
 * stage end, toward the Cathedral of Learning), -x the lawn side with the
 * octagonal shrine, +x the Bigelow Boulevard side.
 *
 * Identity, in order: the tall, blank limestone auditorium block (the
 * Charity Randall Theatre) whose side walls rise to stepped, gabled
 * shoulders, each with a great blind pointed arch, and a slender
 * stair turret in the middle of each side ending in one short spire at
 * the parapet (the auditorium's buttresses are plain, flat-topped
 * blocks); the octagonal
 * memorial shrine on the lawn side, its tall traceried lancets under
 * crocketed gablets and a low pale-green copper dome; the low entrance block
 * on Forbes with two pointed portals and red doors between buttresses;
 * the lower stage house behind; pale Indiana limestone matching the
 * Cathedral of Learning; pale weathered-copper roofs.
 *
 * Evidence:
 *  - plan: OSM outline way/121051329 turned into this frame: auditorium
 *    x -5.5..14, y -11.3..8.7; stage house y 8.7..23.4 narrowing to the
 *    north; shrine octagon centred (-18, -0.8), 12 m across; the link
 *    between them; entrance block x -4.3..11.9, y -20.7..-11.3.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid, above the lowest ground (the Forbes side, 266.6 m NAVD88;
 *    the ground rises ~1.5 m to the west lawn and ~3.5 m to the north):
 *    auditorium roof 21.5-22.5, its gabled side parapets to ~23.5; stage
 *    house 18.5-19.5; shrine parapet 13.5-14; link 6; entrance block 7.5.
 *  - published: dedicated 1937, Charles Klauder, limestone to match the
 *    Cathedral of Learning; theatre and the Stephen Foster museum shrine
 *    (Wikipedia, "Stephen Foster Memorial").
 *  - photos (Wikimedia Commons, all EVIDENCE):
 *    "Stephen Foster Memorial, Oakland, Pittsburgh, 2026-10-23-4.jpg"
 *      https://commons.wikimedia.org/wiki/File:Stephen_Foster_Memorial,_Oakland,_Pittsburgh,_2026-10-23-4.jpg
 *      Cbaile19, CC0 — from the west lawn: the shrine, the auditorium's
 *      west wall with its blind arch and turret, the link.
 *    "Stephen Foster Memorial, Oakland, Pittsburgh, 2026-10-23-3.jpg"
 *      https://commons.wikimedia.org/wiki/File:Stephen_Foster_Memorial,_Oakland,_Pittsburgh,_2026-10-23-3.jpg
 *      Cbaile19, CC0 — the same side, wider.
 *    "Stephen Foster Memorial, Oakland, Pittsburgh, 2021-11-09, 04.jpg"
 *      https://commons.wikimedia.org/wiki/File:Stephen_Foster_Memorial,_Oakland,_Pittsburgh,_2021-11-09,_04.jpg
 *      Cbaile19, CC0 — from the south-east: the east wall, its turret,
 *      the stepped shoulders, the low blocks and the portals.
 *    "Stephen Foster Memorial, Oakland, Pittsburgh, 2021-11-09, 02.jpg"
 *      https://commons.wikimedia.org/wiki/File:Stephen_Foster_Memorial,_Oakland,_Pittsburgh,_2021-11-09,_02.jpg
 *      Cbaile19, CC0 — the twin portals and steps head-on.
 *    "Stephen Foster Memorial, Oakland, Pittsburgh, 2021-11-09, 03.jpg"
 *      https://commons.wikimedia.org/wiki/File:Stephen_Foster_Memorial,_Oakland,_Pittsburgh,_2021-11-09,_03.jpg
 *      Cbaile19, CC0 — the shrine from the lawn.
 *    "StephenFosterRear.jpg"
 *      https://commons.wikimedia.org/wiki/File:StephenFosterRear.jpg
 *      Crazypaco, CC BY 2.5 — the stage end from the north.
 *    "PittStephenFosterMemorial front.jpg"
 *      https://commons.wikimedia.org/wiki/File:PittStephenFosterMemorial_front.jpg
 *      Christopher Lancaster, CC BY-SA 2.0 — the front with the turrets.
 *    USGS NAIP orthophoto (public domain): plan and the green copper roofs.
 *  - colour: limestone pale grey-buff, the Cathedral of Learning's tone;
 *    roofs pale weathered copper #96b8ae, from the NAIP roof (sampled
 *    ~#87a8a0, aerials read dark) and the shrine dome in photo b4; doors
 *    red, as photographed.
 * Pinnacles: only where photos show them: the shrine's buttresses (b4),
 *    the two outer entrance piers (a2), one short turret spire (b3).
 * Estimated: the shoulder profile of the side parapets, the blind arches,
 * the turrets' size and height (spire tip ~24.4 m, level with the
 * parapet in photo b3), the shrine's lancets and gablets, the portal sizes.
 * Doubts: the stage house's walls are seen only from the north in one
 * small photo and are drawn plain. The lidar shows low (~7 m) blocks
 * against the east wall beyond the OSM outline (x 14-18), seen in the
 * south-east photo; OSM doesn't map them, so they are left out. The hall's
 * south wall above the entrance block is drawn plain between two piers
 * (the photos show a banner there).
 *
 * Left out: carving, the shrine's tracery detail beyond a mullion and Y
 * fork, the crockets, lamps, the sign, railings.
 *
 * Night: the walls are washed by campus lights (a light `floodlight` low
 * down, the shrine more); the shrine's lancets glow; the doors glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, rect, save, walls, type XY } from './chi-aon-center'
import { band, grow, poly, wallsSplit } from './pit-allegheny-county-courthouse'
import { greatWindow, headH, pier, pointed } from './pit-heinz-chapel'

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), tr = new Part(), door = new Part()

  // ---- the auditorium block
  const X0 = -5.5, X1 = 14, Y0 = -11.3, Y1 = 8.7, EAVE = 21.5
  wallsSplit(stone, rect(X0, Y0, X1, Y1), 0, EAVE)
  band(stone, rect(X0, Y0, X1, Y1), grow([X0, Y0, X1, Y1], 0.3), 0, 1.2, 0.01)
  cap(roof, rect(X0, Y0, X1, Y1), EAVE - 0.6)
  // front and back parapets, thin
  for (const [ya, yb] of [[Y0, Y0 + 0.6], [Y1 - 0.6, Y1]]) {
    walls(stone, rect(X0, ya, X1, yb), EAVE - 0.6, EAVE + 0.4); cap(stone, rect(X0, ya, X1, yb), EAVE + 0.4)
  }
  // the side walls rise in stepped shoulders to a low gable (photos), 0.8 m thick
  const shoulder: [number, number][] = [[Y0, EAVE + 0.4], [Y0 + 3.2, EAVE + 0.4], [Y0 + 3.2, EAVE + 1.0], [Y0 + 7.5, 23.6], [Y1 - 7.5, 23.6], [Y1 - 3.2, EAVE + 1.0], [Y1 - 3.2, EAVE + 0.4], [Y1, EAVE + 0.4]]
  for (const [x, sx] of [[X0, -1], [X1, 1]] as [number, number][]) {
    const xi = x - sx * 0.8
    for (let i = 0; i < shoulder.length - 1; i++) {
      const [ya, za] = shoulder[i], [yb, zb] = shoulder[i + 1], zl = EAVE - 0.6
      if (ya !== yb) {
        poly(stone, [[x, ya, zl], [x, yb, zl], [x, yb, zb], [x, ya, za]], [sx, 0, 0])
        poly(stone, [[xi, ya, zl], [xi, yb, zl], [xi, yb, zb], [xi, ya, za]], [-sx, 0, 0])
        poly(stone, [[x, ya, za], [x, yb, zb], [xi, yb, zb], [xi, ya, za]], [0, 0, 1])
      } else poly(stone, [[x, ya, za], [x, yb, zb], [xi, yb, zb], [xi, ya, za]], [0, zb > za ? -1 : 1, 0])
    }
  }
  // blind pointed arches on the side walls (outline in trim), turret between
  for (const [a, b] of [[[X1, Y0], [X1, Y1]], [[X0, Y1], [X0, Y0]]] as [XY, XY][]) {
    const { L } = onWall(a, b)
    for (const c of [4.6, L - 4.6]) {
      pointed(tr, a, b, c - 3.1, c + 3.1, 7.5, 19.8 - headH(6.2), 0.03)
      pointed(stone, a, b, c - 2.6, c + 2.6, 7.5, 19.8 - headH(6.2), 0.07)
    }
    // the stair turret: a slim shaft ending in one short spire level with the
    // parapet (photo b3); no corner pinnacles
    const s = L / 2
    pier(stone, a, b, s, 3.4, 0, 21.4, 1.6, 0)
    const { P } = onWall(a, b)
    const t0 = P(s, 0, 0.8)
    const tr0: XY[] = rect(t0[0] - 1.0, t0[1] - 1.0, t0[0] + 1.0, t0[1] + 1.0)
    walls(stone, tr0, 21.4, 22.4)
    const tip: V3 = [t0[0], t0[1], 24.4]
    for (let i = 0; i < 4; i++) { const p0 = tr0[i], p1 = tr0[(i + 1) % 4]; poly(stone, [[p0[0], p0[1], 22.4], [p1[0], p1[1], 22.4], tip], [(p0[0] + p1[0]) / 2 - t0[0], (p0[1] + p1[1]) / 2 - t0[1], 0.6]) }
    const fa = P(s - 1.7, 0, 1.6), fb = P(s + 1.7, 0, 1.6)
    const A: XY = [fa[0], fa[1]], B: XY = [fb[0], fb[1]]
    greatWindow(win, tr, A, B, 1.05, 2.35, 9.5, 19.5, 2, [14.5], 0.16)
    pointed(door, A, B, 0.9, 2.5, 1.5, 3.6, 0.05)
  }
  // the front wall above the entrance block: two plain stepped buttresses,
  // flat-topped under the parapet (photos a4, c2: no pinnacles)
  {
    const a: XY = [X0, Y0], b: XY = [X1, Y0]
    for (const s of [3.2, 16.3]) { pier(stone, a, b, s, 1.6, 7.5, 15.5, 1.4, 0); pier(stone, a, b, s, 1.6, 15.5, 21.4, 0.8, 0) }
  }

  // ---- stage house behind, to 19 m
  const stage: XY[] = [[-5.5, Y1], [12.8, Y1], [12.7, 16.1], [11.3, 17.8], [6.7, 20.6], [5.3, 23.3], [1.8, 23.4], [0.4, 20.5], [-2.9, 18.6], [-4.8, 17.3], [-5.3, 15.4]]
  wallsSplit(stone, stage, 0, 19.0)
  band(stone, stage, stage.map(([x, y]) => [x + (x - 3.6) * 0.03, y + (y - 15) * 0.03] as XY), 18.4, 19.4, 0.2)
  cap(roof, stage, 19.0)
  {
    const { P } = onWall([5.3, 23.3], [1.8, 23.4])
    void P
    pointed(door, [5.3, 23.3], [1.8, 23.4], 0.9, 2.6, 3.5, 5.6, 0.05)
  }

  // ---- the link to the shrine, 6 m
  const link: XY[] = [[-12.6, -5.8], [X0, -5.8], [X0, 5.0], [-12.6, 5.0]]
  wallsSplit(stone, link, 0, 6.0)
  band(stone, link, grow([-12.6, -5.8, X0, 5.0], 0.2), 5.4, 6.0, 0.2)
  cap(roof, link, 6.0)
  for (const [a, b] of [[[-12.6, -5.8], [X0, -5.8]], [[X0, 5.0], [-12.6, 5.0]]] as [XY, XY][]) {
    const { L } = onWall(a, b)
    greatWindow(win, tr, a, b, L / 2 - 1.6, L / 2 + 1.6, 2.4, 4.4, 4, [], 0.15)
  }

  // ---- the octagonal shrine: lancets under gablets, buttresses, copper dome
  {
    const CX = -18, CY = -0.6, R = 6.3, WALL = 12.4, PAR = 13.8
    const ang = (i: number) => Math.PI / 8 + (i * Math.PI) / 4
    const oct: XY[] = Array.from({ length: 8 }, (_, i) => [CX + R * Math.cos(ang(i)), CY + R * Math.sin(ang(i))] as XY)
    wallsSplit(stone, oct, 0, PAR)
    band(stone, oct, oct.map(([x, y]) => [CX + (x - CX) * 1.04, CY + (y - CY) * 1.04] as XY), 0, 1.0, 0.01)
    const inner = oct.map(([x, y]) => [CX + (x - CX) * 0.9, CY + (y - CY) * 0.9] as XY)
    walls(stone, [...inner].reverse(), WALL, PAR)
    for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; stone.quad([oct[i][0], oct[i][1], PAR], [oct[j][0], oct[j][1], PAR], [inner[j][0], inner[j][1], PAR], [inner[i][0], inner[i][1], PAR]) }
    // low dome from inside the parapet
    const prof: XY[] = [[R * 0.9, WALL], [R * 0.82, 13.9], [R * 0.6, 15.0], [R * 0.3, 15.6], [0, 15.8]]
    for (let i = 0; i < 8; i++) {
      const a0 = ang(i), a1 = ang(i + 1)
      for (let k = 0; k < prof.length - 1; k++) {
        const p = (r: number, z: number, a: number): V3 => [CX + r * Math.cos(a) * Math.cos(Math.PI / 8) / Math.cos(Math.PI / 8), CY + r * Math.sin(a), z]
        const q = [p(prof[k][0], prof[k][1], a0), p(prof[k][0], prof[k][1], a1), p(prof[k + 1][0], prof[k + 1][1], a1), p(prof[k + 1][0], prof[k + 1][1], a0)]
        poly(roof, q, [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 1.2])
      }
    }
    for (let i = 0; i < 8; i++) {
      const a = oct[i], b = oct[(i + 1) % 8]
      const { L } = onWall(a, b)
      const mx = (a[0] + b[0]) / 2
      if (mx > CX + R * 0.8) continue // the face against the link
      greatWindow(win, tr, a, b, L / 2 - 0.9, L / 2 + 0.9, 3.0, 9.4, 2, [], 0.16)
      // the gablet over the lancet, in trim, rising through the parapet
      const { P } = onWall(a, b)
      poly(tr, [P(L / 2 - 1.7, 10.6, 0.1), P(L / 2 + 1.7, 10.6, 0.1), P(L / 2, 14.6, 0.1)], [Math.cos(ang(i) + Math.PI / 8), Math.sin(ang(i) + Math.PI / 8), 0])
    }
    // buttresses at the corners, each with a pinnacle
    for (let i = 0; i < 8; i++) {
      const [x, y] = oct[i], ux = (x - CX) / R, uy = (y - CY) / R
      const r: XY[] = [[x - uy * 0.4, y + ux * 0.4], [x - uy * 0.4 + ux * 0.9, y + ux * 0.4 + uy * 0.9], [x + uy * 0.4 + ux * 0.9, y - ux * 0.4 + uy * 0.9], [x + uy * 0.4, y - ux * 0.4]].reverse() as XY[]
      const ccw = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[1][1] - r[0][1]) * (r[2][0] - r[0][0]) > 0 ? r : [...r].reverse()
      walls(stone, ccw, 0, 14.4)
      const t: V3 = [x + ux * 0.45, y + uy * 0.45, 16.4]
      for (let k = 0; k < 4; k++) { const p0 = ccw[k], p1 = ccw[(k + 1) % 4]; poly(stone, [[p0[0], p0[1], 14.4], [p1[0], p1[1], 14.4], t], [(p0[0] + p1[0]) / 2 - t[0], (p0[1] + p1[1]) / 2 - t[1], 0.5]) }
    }
  }

  // ---- the entrance block on Forbes: two pointed portals between buttresses
  {
    const r: [number, number, number, number] = [-4.3, -20.7, 11.9, Y0]
    wallsSplit(stone, rect(...r), 0, 7.5)
    band(stone, rect(...r), grow(r, 0.25), 6.9, 7.5, 0.2)
    cap(roof, rect(...r), 7.5)
    const a: XY = [r[0], r[1]], b: XY = [r[2], r[1]]
    const { L } = onWall(a, b)
    // the outer piers rise into the small openwork pinnacles of photo a2; the middle one stops flat at the cornice
    for (const s of [0.9, L - 0.9]) pier(stone, a, b, s, 1.5, 0, 10.2, 1.0, 1.8)
    pier(stone, a, b, L / 2, 1.5, 0, 7.5, 0.6, 0)
    for (const c of [L / 4 + 0.4, (3 * L) / 4 - 0.4]) {
      pointed(stone, a, b, c - 2.3, c + 2.3, 1.6, 6.0, 0.15)
      pointed(door, a, b, c - 1.25, c + 1.25, 1.6, 4.6, 0.2)
      pointed(win, a, b, c - 1.25, c + 1.25, 4.75, 5.6, 0.2)
      const { P } = onWall(a, b)
      poly(tr, [P(c - 2.6, 7.5, 0.17), P(c + 2.6, 7.5, 0.17), P(c, 10.4, 0.17)], [0, -1, 0])
    }
    // the steps up to the doors
    for (let i = 0; i < 6; i++) {
      const y0 = r[1] - 3.2 + i * 0.5, z = 0.28 * (i + 1)
      wallsSplit(stone, rect(r[0] + 1.6, y0, r[2] - 1.6, r[1]), 0, z, 6)
      cap(stone, rect(r[0] + 1.6, y0, r[2] - 1.6, r[1]), z)
    }
    // side windows
    for (const [p, q] of [[[r[2], r[1]], [r[2], r[3]]], [[r[0], r[3]], [r[0], r[1]]]] as [XY, XY][]) {
      const { L: l } = onWall(p, q)
      greatWindow(win, tr, p, q, l / 2 - 1.3, l / 2 + 1.3, 2.4, 4.4, 3, [], 0.15)
    }
  }

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0.05 : p[0] < -11 ? 0.6 : Math.max(0, 0.45 - p[2] / 40))
  return [
    { part: stone, material: { ...finish('limestone', 0xddd5c3), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('copper', 0x96b8ae) },
    { part: tr, material: { ...PALETTE.trim, floodlight: lit } },
    { part: door, material: finish('entrance', 0xa8564a) },
  ]
}

if (import.meta.main) await save('pit-stephen-foster-memorial', 'Stephen Foster Memorial', [40.443808, -79.952751], 341, build() as any, 5000)
