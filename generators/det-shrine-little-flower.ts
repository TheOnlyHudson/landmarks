/**
 * National Shrine of the Little Flower Basilica (2100 West 12 Mile Road at
 * Woodward Avenue, Royal Oak, 1929-36, Henry J. McGill
 * with sculptor René Paul Chambellan; Art Deco): procedural, CC0-1.0.
 * bun generators/det-shrine-little-flower.ts
 *
 * Map frame: x east, y north, z up, metres; the catalog bearing is 0. The
 * anchor is the centroid of the OSM multipolygon relation/17370785 (outer
 * way/368140545, a courtyard way/1264966717 cut out): 42.5041420,
 * -83.1708328. The outline takes in the tower, the church and the parish
 * buildings east of it, so all three are drawn.
 *
 * Identity, in order: the Charity Tower at the corner by Woodward, a
 * tapering shaft of pale limestone with chamfered corners, a rounded
 * stepped crown, a cross standing out in relief on every face and on the
 * face towards Woodward the great carved crucifix; the octagonal church of
 * tan rubble stone beside it, its drum ringed by a band of green copper
 * fins and covered by a low stepped green copper roof with a small lantern
 * and cross.
 *
 * Evidence:
 *  - plan: OSM relation/17370785 (Q6978446): the tower's base about 8.5 m
 *    square, turned so its front faces bearing 234 (towards Woodward); the
 *    church; the low link between them; the parish buildings and their
 *    courtyard. The lidar footprint agrees with OSM to a metre.
 *  - lidar: USGS_LPC_MI_31Co_Oakland_2016_LAS_2019 (flown 2016), 1 m grid,
 *    heights above the street (about 2 m over the box's minimum): the
 *    tower's top 31.0 (published as about 34 m, which may count the plinth
 *    and lantern rod); the church: an octagon about 43 m across at 9-10 m,
 *    the drum about 33 m across reaching 13 m, the roof rising to 18.5 at
 *    the centre; the link 6; the parish buildings 4.5-6.
 *  - published: tower 1931, church completed 1936, minor basilica 1998
 *    (Wikipedia "National Shrine of the Little Flower").
 *  - photos: the tower's taper, chamfers, crown, the relief cross on each
 *    face, the crucifix and its halo, the pierced tracery beside the cross;
 *    the church's rubble walls, stepped windows, copper fins and roof.
 *    Colours: pale limestone (`slf-limestone`, floodlit at night as in the
 *    night photo), tan rubble (`slf-rubble`, the church's walls floodlit), palette copper, roof, window.
 *  Estimated: the tower's taper and crown profile and the cross's sizes
 *  from the photos scaled to the lidar; the church's stage heights from
 *  the lidar profile; the parish buildings' plan simplified to rectangles.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - National_Shrine_of_the_Little_Flower,_Royal_Oak,_Michigan_-_20201213_-_01.jpg,
 *    _02, _04 and _05, Andre Carrotflower, CC BY-SA 4.0 (the tower's front,
 *    its base, the tower and church from Woodward)
 *  - National_Shrine_of_the_Little_Flower_Roman_Catholic_Church_(Royal_Oak,_Michigan)_-_exterior.jpg
 *    and ..._Charity_tower_with_Christ's_last_words_from_the_Cross.jpg,
 *    Nheyob, CC BY-SA 3.0
 *  - National_Shrine_of_the_Little_Flower_Basilica_(Royal_Oak_MI).jpg,
 *    Lrgjr72, CC BY-SA 4.0 (at night: the tower floodlit)
 *  - Shrine_of_the_Little_Flower,_Royal_Oak,_Michigan_(64792).jpg, Tichnor
 *    Brothers postcard, public domain
 * USGS NAIP orthophoto (public domain). No commercial imagery.
 *
 * Doubts: the parish buildings east of the church are seen in no photo
 * used here and are plain boxes at lidar heights; the church's north and
 * east sides are drawn like its west side. The sculpture on the tower
 * (angels, evangelists, lettering) is left out but for the crucifix.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, chamfer, circle, rect, save, walls, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, arc, ccw } from './sea-tacoma-union-station'

const R = (s0: number, z0: number, s1: number, z1: number): XY[] => [[s0, z0], [s1, z0], [s1, z1], [s0, z1]]
/** A stepped (Art Deco) arch head: jambs to zs, then two steps in to a flat top. */
const stepped = (sc: number, w: number, z0: number, zs: number): XY[] => {
  const h = w / 2, st = w * 0.22, sh = w * 0.3
  return [[sc - h, z0], [sc + h, z0], [sc + h, zs], [sc + h - st, zs], [sc + h - st, zs + sh], [sc + h - 2 * st, zs + sh], [sc + h - 2 * st, zs + 2 * sh],
    [sc - h + 2 * st, zs + 2 * sh], [sc - h + 2 * st, zs + sh], [sc - h + st, zs + sh], [sc - h + st, zs], [sc - h, zs]]
}
function box(p: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const r = rect(x0, y0, x1, y1); walls(p, r, z0, z1); if (top) cap(top, r, z1)
}
/** Append `src` to `dst`, turned by `deg` counter-clockwise about z and moved by (tx, ty). */
function place(src: Part, dst: Part, deg: number, tx: number, ty: number) {
  const c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180)
  for (let i = 0; i < src.pos.length; i += 3) {
    // stored glTF (X, Y, Z) = map (x, z, -y)
    const X = src.pos[i], Z = src.pos[i + 2], nX = src.nrm[i], nZ = src.nrm[i + 2]
    dst.pos.push(X * c + Z * s + tx, src.pos[i + 1], -X * s + Z * c - ty)
    dst.nrm.push(nX * c + nZ * s, src.nrm[i + 1], -nX * s + nZ * c)
  }
  dst.uv.push(...src.uv)
}

// ---------------------------------------------------------------- the Charity Tower, in its own frame (front = -y)
const TOWER: XY = [-54.1, -28.6], TURN = -54 // the front faces bearing 234
function tower(stone: Part, win: Part, bronze: Part, door: Part) {
  const sq = (h: number, c: number) => chamfer(rect(-h, -h, h, h), c)
  // the plinth
  box(stone, stone, -5.0, -5.0, 5.0, 5.0, 0, 2.2)
  // the shaft: chamfered square, tapering
  const s0 = sq(4.25, 1.3), s1 = sq(3.75, 1.2)
  walls(stone, s0, 2.2, 25.5, s1)
  // the crown: rounding in over five metres
  const crown: [number, number, number][] = [[25.5, 3.75, 1.2], [27.3, 3.65, 1.4], [29.0, 3.4, 1.7], [30.3, 3.0, 1.7], [31.0, 2.5, 1.5]]
  for (let k = 0; k < crown.length - 1; k++) walls(stone, sq(crown[k][1], crown[k][2]), crown[k][0], crown[k + 1][0], sq(crown[k + 1][1], crown[k + 1][2]))
  cap(stone, sq(2.5, 1.5), 31.0)
  // the four faces: a cross in relief, pierced tracery in the chamfers beside it
  const faces: Face[] = [
    { o: [0, -4.0, 0], n: [0, -1] }, { o: [4.0, 0, 0], n: [1, 0] }, { o: [0, 4.0, 0], n: [0, 1] }, { o: [-4.0, 0, 0], n: [-1, 0] },
  ]
  faces.forEach((f, i) => {
    extrudeShape(stone, f, R(-1.7, 3.2, 1.7, 25.2), -0.3, 0.9)
    extrudeShape(stone, f, R(-2.6, 20.6, 2.6, 23.8), -0.3, 0.9)
    if (i === 0) {
      // the crucifix: the figure, its arms, the halo
      extrudeShape(stone, f, R(-0.6, 14.2, 0.6, 21.8), 0.8, 1.7)
      extrudeShape(stone, f, [[-0.3, 14.2], [0.3, 14.2], [0.0, 13.2]], 0.8, 1.6)
      extrudeShape(stone, f, R(-2.4, 21.4, 2.4, 22.2), 0.8, 1.7)
      extrudeShape(bronze, f, arc(0, 23.0, 0.95, 0, 360, 10).slice(0, 10), 0.85, 1.2)
      extrudeShape(stone, f, arc(0, 22.8, 0.5, 0, 360, 8).slice(0, 8), 1.2, 1.8)
      // the 'Charity' door in the base
      flatShape(stone, { o: [0, -5.0, 0], n: [0, -1] }, R(-1.4, 0, 1.4, 4.2), 0.25)
      flatShape(door, { o: [0, -5.0, 0], n: [0, -1] }, R(-0.7, 0.3, 0.7, 2.8), 0.3)
    }
  })
  // the pierced tracery: columns of dark openings either side of each face's cross, below its arms
  const half = (z: number) => 4.25 - 0.5 * (z - 2.2) / 23.3 // the shaft's taper
  for (const f of faces) for (const sx of [-2.3, 2.3]) for (const [z0, z1] of [[4.6, 9.4], [10.2, 15.0], [15.8, 20.2]]) {
    const d = half((z0 + z1) / 2)
    const g: Face = { o: [f.n[0] * d, f.n[1] * d, 0], n: f.n }
    flatShape(win, g, R(sx - 0.3, z0, sx + 0.3, z1), 0.04)
  }
}

function build() {
  const lime = new Part(), rubble = new Part(), win = new Part(), copper = new Part(), roof = new Part(), door = new Part()

  // ---------------------------------------------------------------- the tower
  {
    const ts = new Part(), tw = new Part(), tb = new Part(), td = new Part()
    tower(ts, tw, tb, td)
    place(ts, lime, TURN, ...TOWER); place(tw, win, TURN, ...TOWER); place(tb, copper, TURN, ...TOWER); place(td, door, TURN, ...TOWER)
  }

  // ---------------------------------------------------------------- the octagonal church
  const C: XY = [-18.5, -2.5], c8 = Math.cos(Math.PI / 8)
  const oct = (ap: number) => circle(C[0], C[1], ap / c8, 8, Math.PI / 8)
  {
    const lo = oct(21.5)
    walls(rubble, lo, 0, 9.4)
    const lip = oct(21.8)
    walls(lime, lip, 9.4, 10.0); walls(lime, lo, 9.4, 9.4, lip); cap(roof, lip, 10.0)
    const dr = oct(16.3)
    walls(rubble, dr, 10.0, 11.9)
    walls(lime, oct(16.5), 11.9, 12.2)
    walls(copper, oct(16.4), 12.2, 13.4)
    // the roof: low, stepped, flat-faced green copper; lantern and cross
    const tiers: [number, number][] = [[17.0, 13.4], [10.6, 15.9], [10.0, 16.5], [3.0, 18.5]]
    for (let k = 0; k < tiers.length - 1; k++) walls(copper, oct(tiers[k][0]), tiers[k][1], tiers[k + 1][1], oct(tiers[k + 1][0]))
    walls(copper, oct(2.4), 18.5, 19.8); walls(copper, oct(2.4), 19.8, 19.8, oct(2.9))
    for (let i = 0; i < 8; i++) { const r = oct(2.9), a = r[i], b = r[(i + 1) % 8]; copper.tri([a[0], a[1], 19.8], [b[0], b[1], 19.8], [C[0], C[1], 20.9]) }
    box(lime, lime, C[0] - 0.1, C[1] - 0.1, C[0] + 0.1, C[1] + 0.1, 20.9, 23.2)
    box(lime, lime, C[0] - 0.6, C[1] - 0.1, C[0] + 0.6, C[1] + 0.1, 22.1, 22.35)
    // faces: stepped windows, the doors west, south and north, the copper fins' glazing
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4, n: XY = [Math.cos(a), Math.sin(a)]
      const t: XY = [-n[1], n[0]]
      const L = 2 * 21.5 * Math.tan(Math.PI / 8)
      const f: Face = { o: [C[0] + n[0] * 21.5, C[1] + n[1] * 21.5, 0], n }
      const entry = k === 2 || k === 4 || k === 6 // north, west, south
      for (const d of entry ? [-5.5, 5.5] : [-5.0, 0, 5.0]) {
        flatShape(lime, f, stepped(d, 2.0, 2.2, 7.0), 0.03)
        flatShape(win, f, stepped(d, 1.4, 2.5, 7.0), 0.06)
      }
      if (entry) {
        flatShape(lime, f, stepped(0, 4.4, 0, 4.4), 0.04)
        flatShape(door, f, stepped(0, 2.6, 0, 3.4), 0.08)
      }
      const fd: Face = { o: [C[0] + n[0] * 16.4, C[1] + n[1] * 16.4, 0], n }
      const Ld = 2 * 16.4 * Math.tan(Math.PI / 8)
      for (let j = 0; j < 6; j++) flatShape(win, fd, R(-Ld / 2 + (j + 0.5) * Ld / 6 - 0.35, 12.4, -Ld / 2 + (j + 0.5) * Ld / 6 + 0.35, 13.2), 0.06)
      void L; void t
    }
  }

  // ---------------------------------------------------------------- the link to the tower, the north porches
  {
    const link = ccw([[-53.3, -19.4], [-40.8, -10.5], [-30.5, -17.0], [-32.2, -22.3], [-44.5, -30.3], [-49.0, -30.3]])
    walls(rubble, link, 0, 5.4)
    walls(lime, link, 5.4, 6.0); cap(roof, link, 6.0)
    box(rubble, roof, -16.4, 17.0, -12.7, 27.9, 0, 9.0)
    box(rubble, roof, -11.9, 17.0, 2.4, 28.3, 0, 6.5)
  }

  // ---------------------------------------------------------------- the parish buildings
  const blocks: [number, number, number, number, number][] = [
    [2.4, 16.2, 39.6, 28.8, 6.0], // north range
    [22.8, -5.7, 36.6, 16.2, 6.0], // east range
    [2.0, -10.0, 5.4, 16.2, 5.0], // west link beside the church
    [9.2, -12.8, 33.4, -5.2, 4.8], // south range
    [33.4, -11.6, 56.5, -1.0, 4.8], // the long wing east
    [36.6, -1.0, 40.6, 5.1, 4.8],
    [53.5, -9.5, 64.5, -4.0, 4.8],
    [29.9, -23.4, 33.6, -12.2, 6.0],
    [20.6, -29.6, 33.0, -23.4, 6.0],
  ]
  for (const [x0, y0, x1, y1, h] of blocks) {
    const r = rect(x0, y0, x1, y1)
    walls(rubble, r, 0, h - 0.4); walls(lime, r, h - 0.4, h); cap(roof, r, h)
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 6) continue
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], f: Face = { o: [a[0], a[1], 0], n: [u[1], -u[0]] }
      const k = Math.floor((L - 2) / 4)
      for (let j = 0; j < k; j++) {
        const c = (L - (k - 1) * 4) / 2 + j * 4
        flatShape(win, f, R(c - 0.8, 1.2, c + 0.8, h - 1.6), 0.05)
      }
    }
  }

  // only the tower is floodlit: brightest low down, faces looking up barely
  const flood = (p: V3, n: V3) => Math.hypot(p[0] - TOWER[0], p[1] - TOWER[1]) > 8 ? 0 : n[2] > 0.8 ? 0.15 : 0.9 - 0.25 * Math.min(1, p[2] / 31)
  return [
    { part: lime, material: { ...finish('slf-limestone', 0xd9cfbd), floodlight: flood } },
    // the church's walls are floodlit too (night photo); the parish buildings are not
    { part: rubble, material: { ...finish('slf-rubble', 0xcdbb9c), floodlight: (p: V3, n: V3) => (Math.hypot(p[0] + 18.5, p[1] + 2.5) < 24 && n[2] < 0.5 ? 0.7 : 0) } },
    { part: win, material: PALETTE.window },
    { part: copper, material: PALETTE.copper },
    { part: roof, material: PALETTE.roof },
    { part: door, material: finish('slf-door', 0x6e5038) },
  ]
}

if (import.meta.main) { const b = build(); console.log(b.map(x => x.material.name + ' ' + x.part.triangles).join(', ')); await save('det-shrine-little-flower', 'National Shrine of the Little Flower Basilica', [42.504142, -83.1708328], 0, b, 6500) }
