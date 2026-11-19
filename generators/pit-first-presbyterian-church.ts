/**
 * First Presbyterian Church of Pittsburgh (1905, Theophilus P. Chandler Jr.),
 * Sixth Avenue — original procedural geometry, CC0-1.0.
 * bun generators/pit-first-presbyterian-church.ts
 *
 * Builds with the Gothic kit exported by pit-trinity-cathedral.ts and
 * pit-heinz-chapel.ts; merge those first.
 *
 * Map frame of the model: x, y, z up, metres; origin at the anchor on the
 * lowest ground under the footprint. Anchor = area centroid of the OSM
 * outline way/118672858, -79.9991195 40.4415087. Its walls run at 27.5°, so
 * the catalog bearing is 27.5: model +y (north-north-east) is the Sixth
 * Avenue front, -y the Oliver Avenue end; Trinity Cathedral's churchyard is
 * on the +x side.
 *
 * Identity, in order: the Sixth Avenue front of two square towers with
 * tall slender corner pinnacles, a pierced parapet and a pinnacled gablet
 * in the middle of each face, three tall belfry lancets on every face; the
 * steep gable between them with the great traceried window and an oculus;
 * the pale limestone porch of three gabled arches with pinnacles, and a
 * gabled portal at the foot of each tower; the long steep slate roof with
 * gabled dormers on the aisle roofs; grey-brown sandstone.
 *
 * Evidence:
 *  - plan: OSM outline way/118672858 turned into this frame: towers x
 *    -13.2..-5.2 and 2.4..10.4, y 22.4..30.6; nave with aisles x
 *    -12.5..10.4 from y -26.5; the east wing x 10.4..16, y -28.6..-2. The
 *    lidar matches the outline to about a metre.
 *  - heights, measured: USGS 3DEP lidar PA_WesternPA_2_2019 (flight 2019),
 *    0.5 m grid. y = 0 is the Oliver Avenue sidewalk; Sixth Avenue is ~2 m
 *    higher (lidar ground), so the front stands on z 2. Above y = 0: tower
 *    parapets 34 to 35, pinnacle tips 40 (both towers alike: the lidar and
 *    the head-on photo show them equal, though the brief called them
 *    unequal; the east tower is about a metre wider), front gable 24.5,
 *    nave ridge 23 with its eaves at 16 over a short clerestory (lidar:
 *    16 at the wall, 19.8 two metres in), aisle roofs 11.5-13, the east
 *    wing's ridge 15.7 (lidar 13.5-15.7; the churchyard photo shows its
 *    north gable). Corner pinnacles to 42: the head-on photo puts them
 *    7.3 m above the parapet (the lidar's 40.6 misses the thin tips).
 *  - photos (Wikimedia Commons, EVIDENCE):
 *    "First Presbyterian Church of Pittsburgh in 2016.jpg"
 *      https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church_of_Pittsburgh_in_2016.jpg
 *      Dllu, CC BY-SA 4.0 — the front head-on; every front proportion is
 *      scaled from it against the 24 m front width.
 *    "First Presbyterian Church rises over Sixth Avenue in Pittsburgh, Pennsylvania.jpg"
 *      https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church_rises_over_Sixth_Avenue_in_Pittsburgh,_Pennsylvania.jpg
 *      Adam W. Ritchey, CC BY-SA 4.0 — the front towers.
 *    "First Presbyterian Church, Pittsburgh, 2015-09-10, 02.jpg"
 *      https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church,_Pittsburgh,_2015-09-10,_02.jpg
 *      Cbaile19, CC0 — the limestone porch.
 *    "First Presbyterian Church of Pittsburgh - IMG 7539.JPG"
 *      https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church_of_Pittsburgh_-_IMG_7539.JPG
 *      Daderot, public domain — the east side from Trinity's churchyard:
 *      aisle lancets, roof dormers, the east wing's gable.
 *    "First Presbyterian Church of Pittsburgh - IMG 7534.JPG"
 *      https://commons.wikimedia.org/wiki/File:First_Presbyterian_Church_of_Pittsburgh_-_IMG_7534.JPG
 *      Daderot, public domain — the Oliver Avenue end: the rear gable's
 *      traceried window and the plain east wing.
 *    "Rear of Trinity Cathedral and First Presbyterian Church, Pittsburgh, 2023-11-15.jpg"
 *      https://commons.wikimedia.org/wiki/File:Rear_of_Trinity_Cathedral_and_First_Presbyterian_Church,_Pittsburgh,_2023-11-15.jpg
 *      Cbaile19, CC0 — the same end along Oliver Avenue.
 *  - colour: mottled grey-brown sandstone, pulled to the palette's
 *    lightness; pale grey limestone for the porch, pinnacles and tracery;
 *    grey slate; oak doors.
 * Estimated: all openings, the porch, the pinnacles, the tower stages
 * (from the 2016 photo scaled to the lidar), the dormers' count and size,
 * the east wing's roof (the lidar cannot settle its pitch).
 *
 * Doubts: the west side faces a narrow gap to a tower and no photo shows
 * it; it is drawn as the mirror of the east side. Night: no licensed night
 * photo; only the windows and the porch lanterns' doors (entrance) glow.
 *
 * Left out: the stairs and railings in front of the porch, the openwork of
 * the parapets (drawn solid), crockets, glazing bars, the iron fence, the
 * great window's fine tracery (drawn as four mullions, a transom, a rose
 * of six spokes and two roundels in the head).
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, onWall, rect, save, walls, type XY } from './chi-aon-center'
import { bar, faces, pier, pointed } from './pit-heinz-chapel'
import { box, gable, gablet, lean, panel3, pinnacle, rose, wallBlock } from './pit-trinity-cathedral'

function build() {
  const stone = new Part(), win = new Part(), slate = new Part(), lime = new Part(), door = new Part()
  const G = 2 // Sixth Avenue ground

  // ---- nave and aisles, y -26.5..22.4
  const NY0 = -26.5, NY1 = 22.4
  const MX0 = -6.5, MX1 = 3.5 // the steep main roof's walls
  const AX0 = -12.5, AX1 = 10.4 // the aisle walls
  walls(stone, rect(MX0, NY0, MX1, NY1), 0, 16)
  gable(slate, stone, MX0, NY0, MX1, NY1, 16, 23, 'y', [true, false])
  for (const [x0, x1, side] of [[AX0, MX0, 'x1'], [MX1, AX1, 'x0']] as [number, number, 'x0' | 'x1'][]) {
    box(stone, x0, NY0, x1, NY1, 0, 11.5, null)
    lean(slate, stone, x0, NY0, x1, NY1, 11.5, 13, side)
  }
  // aisle windows between buttresses, gabled dormers on the aisle roofs
  for (const [a, b] of [faces(AX0, NY0, AX1, NY1)[1], faces(AX0, NY0, AX1, NY1)[3]]) {
    const { L, n } = onWall(a, b)
    const east = n[0] > 0
    for (let k = 0; k < 6; k++) {
      const yb = 18 - k * 4.6 // bay centre in y
      if (east && yb < -2) continue // the east wing covers the south bays
      const s = east ? yb - NY0 : NY1 - yb
      pointed(win, a, b, s - 0.85, s + 0.85, 3.2, 8.0, 0.04)
      bar(lime, a, b, [s, 3.2], [s, 8.0], 0.16)
      pier(stone, a, b, s + 2.3, 0.8, 0, 10.5, 0.7, 1.0)
      // the clerestory above: a two-light pointed window per bay
      {
        const cx = east ? MX1 : MX0
        const ca: XY = [cx, east ? NY0 : NY1], cb: XY = [cx, east ? NY1 : NY0]
        pointed(win, ca, cb, s - 0.8, s + 0.8, 13.5, 14.8, 0.04)
        bar(lime, ca, cb, [s, 13.5], [s, 15.6], 0.14)
      }
      // the dormer: a small gable standing on the aisle roof
      const x = east ? AX1 - 2.6 : AX0 + 2.6, ox = east ? 1 : -1
      const da: XY = [x, east ? yb - 1.4 : yb + 1.4], db: XY = [x, east ? yb + 1.4 : yb - 1.4]
      gablet(stone, slate, da, db, 1.4, 2.8, 11.5 + 1.0, 15.8, 2.8)
      for (const ds of [-0.45, 0.45]) pointed(win, da, db, 1.4 + ds - 0.32, 1.4 + ds + 0.32, 12.7, 13.8, 0.04, 1, 3)
      void ox
    }
    void L
  }
  // the rear (Oliver Avenue) gable: big traceried window between pinnacled buttresses
  {
    const [a, b] = faces(MX0, NY0, MX1, NY1)[0]
    const c = (MX1 - MX0) / 2
    pointed(win, a, b, c - 2.6, c + 2.6, 6, 15.5, 0.04, 0.62)
    for (const ds of [-1.3, 0, 1.3]) bar(lime, a, b, [c + ds, 6], [c + ds, 17.2], 0.16)
    bar(lime, a, b, [c - 2.55, 15.5], [c + 2.55, 15.5], 0.16)
    for (const s of [0.4, MX1 - MX0 - 0.4]) { pier(stone, a, b, s, 0.9, 0, 19, 0.8, 0); pinnacle(lime, a[0] + (s < 1 ? 0.45 : MX1 - MX0 - 0.45), NY0 - 0.4, 0.8, 19, 20.5, 23.5) }
    for (const [x0, x1] of [[AX0, MX0], [MX1, AX1]]) {
      const [ea, eb] = faces(x0, NY0, x1, NY1)[0], { L } = onWall(ea, eb)
      pointed(win, ea, eb, L / 2 - 0.9, L / 2 + 0.9, 3.5, 8.0, 0.04)
    }
  }

  // ---- the east wing (x 10.4..16, y -28.6..-2), gable to the churchyard
  box(stone, AX1, -28.6, 16, -2, 0, 11.5, null)
  gable(slate, stone, AX1, -28.6, 16, -2, 11.5, 15.7, 'y', [true, true], 0.25)
  {
    const [a, b] = faces(AX1, -28.6, 16, -2)[2], { L } = onWall(a, b)
    pointed(win, a, b, L / 2 - 1.4, L / 2 + 1.4, 5.0, 10.4, 0.04)
    bar(lime, a, b, [L / 2, 5.0], [L / 2, 12.4], 0.16)
    const [sa, sb] = faces(AX1, -28.6, 16, -2)[0], { L: sl } = onWall(sa, sb)
    for (const z of [5.5, 9.5]) panel3(win, sa, sb, sl / 2 - 0.55, sl / 2 + 0.55, z, z + 1.8)
    panel3(door, sa, sb, sl / 2 - 0.8, sl / 2 + 0.8, 0, 2.6)
    const [ea, eb] = faces(AX1, -28.6, 16, -2)[1]
    for (let s = 3; s < 25; s += 4.5) panel3(win, ea, eb, s - 0.5, s + 0.5, 6, 8.2)
  }

  // ---- the front gable between the towers (x -5.2..2.4, front at y 30.6)
  const FX0 = -5.2, FX1 = 2.4, FY = 30.6, FC = (FX0 + FX1) / 2
  walls(stone, rect(FX0, NY1, FX1, FY), 0, 16)
  gable(slate, stone, FX0, NY1, FX1, FY, 16, 24.5, 'y', [false, true], 0.1)
  {
    const [a, b] = faces(FX0, NY1, FX1, FY)[2], c = FX1 - FC // runs from x 2.4 to -5.2
    // the great window: a broad two-centred arch, five lights, a rose in the head
    pointed(lime, a, b, c - 3.3, c + 3.3, 10.6, 17.6, 0.03, 0.72)
    pointed(win, a, b, c - 2.95, c + 2.95, 11.0, 17.6, 0.06, 0.72)
    for (const ds of [-1.8, -0.6, 0.6, 1.8]) bar(lime, a, b, [c + ds, 11.0], [c + ds, 17.8], 0.17, 0.1)
    bar(lime, a, b, [c - 2.9, 17.6], [c + 2.9, 17.6], 0.17, 0.1)
    // the rose in the head: a pale ring with six spokes (the photo's
    // wheel of twelve petals over the lights, drawn bold)
    {
      const { P } = onWall(a, b), zc = 19.9, R = 1.55, n = 16
      for (let i = 0; i < n; i++) {
        const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI
        const o = (t: number, r: number) => P(c + r * Math.cos(t), zc + r * Math.sin(t), 0.1)
        lime.quad(o(t0, R - 0.22), o(t0, R), o(t1, R), o(t1, R - 0.22))
      }
      for (let i = 0; i < 3; i++) {
        const t = (i * Math.PI) / 3 + Math.PI / 2
        bar(lime, a, b, [c - R * Math.cos(t), zc - R * Math.sin(t)], [c + R * Math.cos(t), zc + R * Math.sin(t)], 0.15, 0.1)
      }
      // the two lesser roundels either side of it, over the outer lights
      for (const ds of [-1.8, 1.8]) for (let i = 0; i < 10; i++) {
        const t0 = (i / 10) * 2 * Math.PI, t1 = ((i + 1) / 10) * 2 * Math.PI, r = 0.6
        const o = (t: number, rr: number) => P(c + ds + rr * Math.cos(t), 18.5 + rr * Math.sin(t), 0.1)
        lime.quad(o(t0, r - 0.16), o(t0, r), o(t1, r), o(t1, r - 0.16))
      }
    }
    rose(lime, null, a, b, c, 19.4, 1.15, 0, 12)
    rose(win, null, a, b, c, 19.4, 0.85, 0, 12)
    rose(win, lime, a, b, c, 22.4, 0.55, 0, 10)
    // the limestone porch: three gabled arches with pinnacles, doors up the stair
    wallBlock(lime, a, b, c - 3.6, c + 3.6, -0.2, 0.9, 0, G + 2.8)
    for (const ds of [-2.35, 0, 2.35]) {
      const w = ds === 0 ? 2.5 : 2.0, top = ds === 0 ? 12.6 : 11.4
      wallBlock(lime, a, b, c + ds - w / 2 - 0.2, c + ds + w / 2 + 0.2, -0.2, 0.9, G + 2.8, G + 7.0)
      gablet(lime, slate, [a[0], a[1] + 0.9] as XY, [b[0], b[1] + 0.9] as XY, c + ds, w + 0.4, G + 7.0, top, 1.1, 0)
      pointed(door, [a[0], a[1] + 0.9] as XY, [b[0], b[1] + 0.9] as XY, c + ds - w / 2 + 0.25, c + ds + w / 2 - 0.25, G + 2.8, G + 6.4, 0.04)
    }
    for (const ds of [-3.55, -1.2, 1.2, 3.55]) {
      const { P } = onWall(a, b), p = P(c + ds, 0, 0.75)
      pinnacle(lime, p[0], p[1], 0.55, G + 2.8, G + 7.6, G + 9.6)
    }
    // the basement door under the porch, at street level
    pointed(door, [a[0], a[1] + 0.9] as XY, [b[0], b[1] + 0.9] as XY, c - 0.7, c + 0.7, G, G + 2.0, 0.04)
  }

  // ---- the two towers
  const TOP = 34, TW = 8
  for (const [x0, porchSide] of [[-13.2, 1], [2.4, -1]] as [number, number][]) {
    const x1 = x0 + TW, y0 = NY1, y1 = FY, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    box(stone, x0, y0, x1, y1, 0, TOP, null)
    const tf = faces(x0, y0, x1, y1)
    // the corbel table under the belfry and the parapet band
    walls(stone, rect(x0 - 0.25, y0 - 0.25, x1 + 0.25, y1 + 0.25), 24.0, 24.9)
    walls(lime, rect(x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3), TOP, TOP + 1.4)
    cap(slate, rect(x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3), TOP + 0.6)
    walls(lime, rect(x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3), TOP - 0.6, TOP)
    for (const k of [0, 1, 2, 3]) {
      const [a, b] = tf[k]
      // three tall belfry lancets, each with a mullion
      for (const ds of [-2.25, 0, 2.25]) {
        pointed(lime, a, b, TW / 2 + ds - 0.85, TW / 2 + ds + 0.85, 25.6, 30.4, 0.03)
        pointed(win, a, b, TW / 2 + ds - 0.65, TW / 2 + ds + 0.65, 25.9, 30.4, 0.06)
        bar(lime, a, b, [TW / 2 + ds, 25.9], [TW / 2 + ds, 30.9], 0.15, 0.09)
      }
      // side faces: two traceried two-light windows low down; a slit lancet higher
      if (k === 1 || k === 3) for (const [z0, zs] of [[4.2, 7.6], [12.2, 15.6]]) {
        pointed(win, a, b, TW / 2 - 1.1, TW / 2 + 1.1, z0, zs, 0.04)
        bar(lime, a, b, [TW / 2, z0], [TW / 2, zs + 0.9], 0.16)
      }
      // the pinnacled gablet on the parapet
      pointed(win, a, b, TW / 2 - 0.25, TW / 2 + 0.25, 17.2, 18.6, 0.04)
      gablet(lime, slate, a, b, TW / 2, 2.4, TOP + 1.4, TOP + 3.6, 0.6, 0.3)
      const { P } = onWall(a, b)
      for (const ds of [-1.3, 1.3]) { const p = P(TW / 2 + ds, 0, 0.0); pinnacle(lime, p[0], p[1], 0.35, TOP + 1.4, TOP + 2.6, TOP + 3.8) }
      const t = P(TW / 2, 0, 0.0)
      pinnacle(lime, t[0], t[1], 0.3, TOP + 3.4, TOP + 3.8, TOP + 4.6)
      // angle buttresses stepping in, to the corbel table
      for (const s of [0.5, TW - 0.5]) {
        pier(stone, a, b, s, 1.0, 0, 11, 1.1, 0.8)
        pier(stone, a, b, s, 0.9, 11, 23.5, 0.7, 0.8)
      }
    }
    // the corner pinnacles, tall and slender
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) pinnacle(lime, x, y, 1.0, TOP - 2, TOP + 3.4, 42)
    // the tower's portal on the Sixth Avenue face: gabled, with oak doors
    {
      const [a, b] = tf[2], c = TW / 2 + porchSide * 0.0
      wallBlock(lime, a, b, c - 1.9, c + 1.9, -0.1, 0.6, 0, G + 2.8)
      wallBlock(stone, a, b, c - 1.9, c + 1.9, -0.1, 0.6, G + 2.8, G + 7.3)
      const fa: XY = [a[0], a[1] + 0.6], fb: XY = [b[0], b[1] + 0.6]
      gablet(lime, slate, fa, fb, c, 3.8, G + 7.3, G + 9.6, 0.7, 0)
      pointed(lime, fa, fb, c - 1.45, c + 1.45, G + 2.8, G + 5.6, 0.03)
      pointed(door, fa, fb, c - 1.1, c + 1.1, G + 2.8, G + 5.4, 0.06)
      // a lancet above the portal
      pointed(win, a, b, c - 0.45, c + 0.45, 13.2, 15.6, 0.04)
    }
    void cx; void cy
  }

  return [
    { part: stone, material: finish('fp-sandstone', 0xb7ab9e) },
    { part: win, material: PALETTE.window },
    { part: slate, material: finish('slate', 0x7d8289) },
    { part: lime, material: finish('fp-limestone', 0xe6dfd3) },
    { part: door, material: finish('door-oak', 0x9a6a45) },
  ]
}

if (import.meta.main) await save('pit-first-presbyterian-church', 'First Presbyterian Church of Pittsburgh', [40.4415087, -79.9991195], 27.5, build() as any, 6500)
