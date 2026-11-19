/**
 * Taj Mahal, Agra: procedural, CC0-1.0.
 * bun generators/agra-taj-mahal.ts
 *
 * The white marble mausoleum on its square plinth, with the four minarets,
 * the onion dome on its drum and finial, the four chhatris round it, and the
 * iwans (tall arched recesses) on each of the eight faces of the chamfered
 * block. Writes models/agra-taj-mahal.glb (low) and
 * models/agra-taj-mahal.detail.glb (the same with the plinth's blind arcade,
 * the facade pinnacles' finer turning and rounder domes).
 *
 * Ground: elevation 0. `tools/terrain.ts check` could not run (Mapterhorn
 * has no z15 tiles here); the contact sheet's coarser terrain falls about
 * 4 m across the footprint toward the river, so on the map the plinth's
 * south side may sink a few metres into the ground.
 *
 * Map frame: x east, y north, z up, metres. Origin: the centre of the square
 * the four minarets stand on, on the ground at the plinth's foot (the
 * red-sandstone terrace). Bearing 0: OSM's plinth edges run about 0.5 degrees
 * west of north (0.4 m at the corners), left out.
 *
 * OSM (replaced; ODbL): way/375257537 (outline, "Taj Mahal", the plinth with
 * its corner bastions), way/695684926 ("floor", the same outline, height 5),
 * way/375377794 (the block, height 30), way/383059880 (drum, 41),
 * way/383059882 (dome, 60), way/383059866 (finial, 68), and the minaret tops
 * way/375263821, 375263823, 375268420, 375268421, 375268422, 375268423,
 * 375352705, 375352706 (36 to 41 m), with way/375257522, 375257533,
 * 375257534 (untagged rings at the north-west minaret).
 * Left out, as separate OSM buildings the model does not draw: the mosque
 * (way/376367510, "Taj Mahal Masjid") and the jawab (way/376367511) on
 * either side, about 130 m from the centre, both red sandstone; the four
 * riverside corner towers (way/435831218-221) and the minaret-shaped parts
 * of the mosque and jawab (way/915319745-758).
 *
 * Plan. OSM: the plinth 95.5 m east-west between its long edges, with the
 * minarets' centres on its corners (94 to 96 m apart, both ways) and an
 * octagonal bastion r ~4.6 m round each; the block 56.4 m square with
 * chamfers cutting 7.1 to 7.5 m off each corner. Published (Wikipedia,
 * "Taj Mahal"): plinth 95.5 m square, 6 m high; block 57.3 m on its long
 * sides; drum 12 m high; dome 23 m; finial 9.6 m; minarets over 40 m; total
 * 73 m. OSM puts the block and dome 3 to 4 m north of the minarets' centre;
 * the model centres them, as the building is.
 *
 * Heights. Two photos, scaled to the published 73 m finial:
 * - "View of Taj Mahal from Mehtab Bagh gardens.jpg" (full 3888 px file), a
 *   telephoto from about 1 km north at ground level, so nearly
 *   orthographic: 5.88 px a metre from the plinth's top (y 1534 px, 6.5 m)
 *   to the finial's tip (y 1143 px), which makes the dome 29.4 m across
 *   (OSM's dome part: 29.9 m). The drum and dome come from it.
 * - "Taj Mahal, Agra, India edit3.jpg", square on from the south: the front
 *   and back minaret pairs (985 and 601 px apart, 95.5 m in plan) put the
 *   camera 149 m from the front pair, the water channel's vanishing point
 *   gives the horizon, and each depth plane its own scale. The block,
 *   iwans, chhatris and minarets come from it.
 *
 * The dome, traced from the telephoto: the silhouette's half-width, read
 * on every 4th pixel row against the sky (z = 6.5 + (1534 - y) / 5.88),
 * against the drum's inscribed band (r 13.9, 82 px):
 *   z 64.0 r 1.6 (finial's foot)   z 61.3 r 4.7   z 60.6 r 6.3 (lotus rim)
 *   z 58.5 r 7.6    z 57.2 r 9.4    z 55.8 r 10.9   z 54.5 r 12.0
 *   z 53.1 r 12.8   z 51.7 r 13.5   z 50.4 r 14.0   z 49.0 r 14.5
 *   z 47.6 r 14.7   z 46.3 r 14.7 (widest, 1.06 x the band)
 *   z 44.1 r 13.8, where the bulb turns in to meet the drum (by eye; the
 *   chhatris behind spoil the scan below z 46.5).
 * So the bulb swells out of a pinch at the drum (z 44.1) to its widest
 * about a sixth of the way up to the lotus (z 46 to 48), then rounds over
 * in a long convex shoulder; the concave taper to the point is the lotus
 * cap (z 59.6 to 64.3). The south photo (from below, so less reliable at
 * the top) agrees on the widest point: about 4.3 m above the pinch out of
 * 16.6 m to the lotus. The model draws the pinch a little deeper than
 * measured (bulb r 13.2 on a band of 13.9) so it reads on a phone. The
 * drum: plain r 13.3 from the roof to 41.4 m, a moulding, the inscribed
 * band 42 to 44.1 m (published: drum 12 m high, dome 23 m, finial 9.6 m).
 *
 * Estimated (above the terrace, y = 0):
 * - plinth 6.5 m (published 6; brief 6.7);
 * - block walls to 29.5 m, coping to 30.0 m; each pishtaq's crest 35.5 m
 *   (34 to 36 in the two photos);
 * - the iwan: 13.4 m wide, springing 21.5 m, apex 27.8 m (the south photo:
 *   21.2 and 26.6); 5 m deep (depth estimated); its calligraphy frame
 *   19.4 m wide with a 1.4 m band, to 31.8 m, above the side bays' 30 m
 *   parapet (the south photo: outer top 31.3 m, inner 29.2 m);
 * - side and chamfer niches: two tiers, 6 and 5.6 m wide, apexes at 16.5
 *   and 26 m; 1.6 m deep (estimated);
 * - chhatris at (+-16.5, +-16.5), r 4.6 at the eave, dome tips 41.4 m,
 *   finials 44.2 m;
 * - minarets r 2.9 tapering to 2.3, three balconies at 17.2, 27.9 and
 *   39.9 m, an open eight-columned chhatri on top, dome tip 46.5 m, finial
 *   48 m (OSM's minaret tops: 41 m above the plinth, 47.5 m above the
 *   terrace);
 * - pinnacles (guldastas) on the block's eight corners to 36.6 m and
 *   flanking each pishtaq to 40 m.
 * The other sides were checked against the west, east, north and north-east
 * photos below: the four faces are the same.
 *
 * Simplified: the pishtaqs are drawn flush with the wall (the real frames
 * stand a little proud); the iwans' half-domes and facets are a flat back
 * wall in shade, with one dark arched opening for the doorway and the
 * screened window over it; the niches' backs are plain shade (the real
 * ones have small jali screens, too small to draw); the calligraphy frame
 * is a flat inlay-grey band and the spandrels' floral inlay is left out, as
 * are the pietra dura, the dado carving and the niches' own frames; the
 * minarets stand plumb (the real ones lean slightly outward). The stair
 * projection OSM shows at the plinth's south front is left out.
 *
 * Photos (Wikimedia Commons; evidence):
 * - "Taj Mahal, Agra, India edit3.jpg", Yann (edit King of Hearts), CC BY-SA 3.0 (south)
 * - "Taj Mahal sideview west.jpg", Marsmux, CC BY-SA 4.0 (west)
 * - "Taj Mahal from the west side.jpg", Federico.delmonte, CC BY-SA 3.0 (west)
 * - "Taj Mahal East Side.JPG", Bjorn Christian Torrissen, CC BY-SA 3.0 (east)
 * - "View of Taj Mahal from Mehtab Bagh gardens.jpg", LittleDwangs, CC BY-SA 4.0 (north)
 * - "Taj Mahal seen from North-East corner.jpg", KlickIn, CC BY-SA 3.0 (corner detail)
 * - "Aerial View of Taj Mahal by Helicopter.png", Architguptaaviatorflight, CC BY-SA 4.0 (from above, south)
 * - "Aerial view of the Taj Mahal, India Wellcome V0037711.jpg", Wellcome Collection, CC BY 4.0 (from the gate)
 * - "Taj Mahal, Agra at Night.jpg", Gauravkapoor, CC BY 3.0 (night)
 * No look-only sources were used.
 *
 * Night: the brief asks for floodlit marble, and the model carries a
 * floodlight mask over all of it, brightest on the dome. The night photo
 * shows the real building nearly dark (moonlight only), with one lit grille
 * in the south iwan; the model has no `window` material, so nothing glows.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { bandTris, beam, flat, lathe, ngon, prism, type XY } from './sf-de-young'

type Mat = { part: Part; material: MaterialSpec }

const PLINTH = 6.5, HALF_PLINTH = 47.75
const H = 28.5, CH = 7.2 // the block's half width and its chamfer
const WALL = 29.5, COPING = 30.0, CREST = 35.5
const DRUM_R = 13.3, DRUM_TOP = 44.1

/** The pointed (two-centred) arch outline in a face's (u, v), counter-clockwise: w wide centred on u = c, base b, springing s, apex t. */
function arch(c: number, w: number, b: number, s: number, t: number, n: number): XY[] {
  const h = w / 2, rise = t - s
  const R = (h * h + rise * rise) / (2 * h), cx = h - R, a1 = Math.atan2(rise, -cx)
  const out: XY[] = [[c - h, b], [c + h, b]]
  for (let i = 0; i < n; i++) { const a = (a1 * i) / n; out.push([c + cx + R * Math.cos(a), s + R * Math.sin(a)]) }
  out.push([c, t])
  for (let i = n - 1; i >= 0; i--) { const a = (a1 * i) / n; out.push([c - cx - R * Math.cos(a), s + R * Math.sin(a)]) }
  return out
}

/** A face from a to b (a counter-clockwise ring's edge, so outward is to its right): maps (u, v, depth in) to the map frame. */
function face(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const n: V3 = [t[1], -t[0], 0]
  const P = (u: number, v: number, d = 0): V3 => [a[0] + t[0] * u - n[0] * d, a[1] + t[1] * u - n[1] * d, v]
  return { L, t, n, P }
}

type Face = ReturnType<typeof face>

/** Flat triangles of `rings` (outline and holes, in u, v) on the face plane, `d` in (negative: proud), facing out. */
function fill(p: Part, f: Face, rings: XY[][], d = 0) {
  for (const [A, B, C] of bandTris(rings)) p.tri(f.P(A[0], A[1], d), f.P(B[0], B[1], d), f.P(C[0], C[1], d), undefined, undefined, undefined, [f.n, f.n, f.n])
}

/** A recess behind the hole `ring` (counter-clockwise in u, v): reveals `depth` deep, and its back wall on `back`. */
function recess(walls: Part, back: Part, f: Face, ring: XY[], depth: number) {
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length], du = B[0] - A[0], dv = B[1] - A[1], l = Math.hypot(du, dv) || 1
    // pointing into the hole: left of the edge in (u, v)
    const iu = -dv / l, iv = du / l
    const n: V3 = [f.t[0] * iu, f.t[1] * iu, iv]
    walls.tri(f.P(A[0], A[1]), f.P(B[0], B[1]), f.P(B[0], B[1], depth), undefined, undefined, undefined, [n, n, n])
    walls.tri(f.P(A[0], A[1]), f.P(B[0], B[1], depth), f.P(A[0], A[1], depth), undefined, undefined, undefined, [n, n, n])
  }
  fill(back, f, [ring], depth)
}

const rect = (u0: number, u1: number, v0: number, v1: number): XY[] => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]

/** Walls round a ring from z0 to z1 in pieces no longer than `seg`, so the map's drape can bend them. */
function walls(p: Part, ring: XY[], z0: number, z1: number, seg = 5) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / seg))
    for (let k = 0; k < n; k++) {
      const A: XY = [a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]
      const B: XY = [a[0] + ((b[0] - a[0]) * (k + 1)) / n, a[1] + ((b[1] - a[1]) * (k + 1)) / n]
      p.quad([...A, z0], [...B, z0], [...B, z1], [...A, z1])
    }
  }
}

/** A small domed pavilion (chhatri) at c: platform r, columns, eave, onion dome to `tip`, finial to `top`. */
function chhatri(m: Part, gold: Part, c: XY, z: number, r: number, tip: number, top: number, seg: number, cols: number) {
  const rc = r * 0.82, colTop = z + (tip - z) * 0.55, eave = colTop + (tip - z) * 0.06
  prism(m, ngon(c[0], c[1], r, 8, Math.PI / 8), z, z + 0.12 * (tip - z), m)
  const z1 = z + 0.12 * (tip - z)
  for (const q of ngon(c[0], c[1], rc, cols, Math.PI / 8)) lathe(m, [[r * 0.09, z1], [r * 0.09, colTop]], 4, q, Math.PI / 4)
  // the eave (chhajja): a sloped skirt and its slab
  const R = rc * 0.98, h = tip - eave
  lathe(m, [[r * 1.08, colTop - 0.25 * (r / 4)], [R * 0.92, eave]], 8, c, Math.PI / 8, false)
  flat(m, ngon(c[0], c[1], r * 1.08, 8, Math.PI / 8), colTop - 0.25 * (r / 4), false)
  lathe(m, [[R * 0.92, eave], [R * 1.05, eave + h * 0.28], [R * 0.86, eave + h * 0.6], [R * 0.4, eave + h * 0.86], [0, tip]], seg, c)
  lathe(gold, [[r * 0.1, tip - 0.1], [r * 0.12, tip + (top - tip) * 0.4], [0, top]], 4, c)
}

function build(detail: boolean): Mat[] {
  const marble = new Part(), shade = new Part(), inlay = new Part(), opening = new Part(), gold = new Part()
  const SEG = detail ? 32 : 24, MSEG = detail ? 16 : 10, AN = detail ? 5 : 3

  // The plinth: a square 95.5 m across, octagonal bastions on its corners under the minarets.
  const sq: XY[] = [[-HALF_PLINTH, -HALF_PLINTH], [HALF_PLINTH, -HALF_PLINTH], [HALF_PLINTH, HALF_PLINTH], [-HALF_PLINTH, HALF_PLINTH]]
  walls(marble, sq, 0, PLINTH)
  // its top, in 12 m cells so it bends with the drape
  const cells = 8, cw = (2 * HALF_PLINTH) / cells
  for (let i = 0; i < cells; i++) for (let j = 0; j < cells; j++) {
    const x0 = -HALF_PLINTH + i * cw, y0 = -HALF_PLINTH + j * cw
    marble.quad([x0, y0, PLINTH], [x0 + cw, y0, PLINTH], [x0 + cw, y0 + cw, PLINTH], [x0, y0 + cw, PLINTH])
  }
  const corners: XY[] = [[HALF_PLINTH, HALF_PLINTH], [-HALF_PLINTH, HALF_PLINTH], [-HALF_PLINTH, -HALF_PLINTH], [HALF_PLINTH, -HALF_PLINTH]]
  for (const c of corners) prism(marble, ngon(c[0], c[1], 4.9, 8, Math.PI / 8), 0, PLINTH + 0.4, marble, 0.3)
  // The blind arcade round the plinth (detail only: at map distance it is a grey shimmer).
  if (detail) {
    for (let s = 0; s < 4; s++) {
      const f = face(sq[s], sq[(s + 1) % 4]), n = 26, pitch = (f.L - 10) / n
      for (let k = 0; k < n; k++) fill(shade, f, [arch(5 + pitch * (k + 0.5), pitch * 0.62, 1.0, 3.6, 4.9, 3)], -0.04)
    }
  }

  // The block: an octagon with long faces and chamfers.
  const oct: XY[] = [[-H + CH, -H], [H - CH, -H], [H, -H + CH], [H, H - CH], [H - CH, H], [-H + CH, H], [-H, H - CH], [-H, -H + CH]]
  const NICHE = (c: number, w: number) => [arch(c, w, PLINTH, 13.6, 16.5, AN), arch(c, w, 17.8, 23.4, 26.0, AN)]
  for (let i = 0; i < 8; i++) {
    const f = face(oct[i], oct[(i + 1) % 8]), L = f.L
    const holes: XY[][] = []
    if (i % 2 === 0) {
      // a long face: the iwan in its pishtaq, a pair of stacked niches each side
      const iwan = arch(L / 2, 13.4, PLINTH, 21.5, 27.8, AN + 1)
      holes.push(iwan)
      for (const c of [L / 2 - 15.6, L / 2 + 15.6]) holes.push(...NICHE(c, 6.0))
      for (const h of holes) recess(marble, shade, f, h, h === iwan ? 5 : 1.6)
      // the dark opening at the back of the iwan: its doorway and the screened window over it, one tall arch
      fill(opening, f, [arch(L / 2, 5.0, PLINTH, 16.0, 19.0, 3)], 4.96)
      // the calligraphy frame round the iwan, rising above the side bays' parapet
      const fr = 1.4, fw = 19.4, ft = 31.8
      fill(inlay, f, [rect(L / 2 - fw / 2, L / 2 + fw / 2, PLINTH, ft), rect(L / 2 - fw / 2 + fr, L / 2 + fw / 2 - fr, PLINTH, ft - fr)], -0.04)
      const c0 = f.P(L / 2, 0, 1.0)
      prism(marble, [[-10.2, -1.0], [10.2, -1.0], [10.2, 1.0], [-10.2, 1.0]].map(([u, w]) => [c0[0] + f.t[0] * u - f.n[0] * w, c0[1] + f.t[1] * u - f.n[1] * w] as XY), WALL, CREST, marble, 0.25)
      // pinnacles flanking the pishtaq
      for (const u of [L / 2 - 10.2, L / 2 + 10.2]) {
        const q = f.P(u, 0, 0)
        lathe(marble, [[0.75, PLINTH], [0.75, 38.0], [1.0, 38.5], [0, 40.0]], MSEG > 10 ? 8 : 6, [q[0], q[1]], 0, true)
      }
    } else {
      holes.push(...NICHE(L / 2, 5.6))
      for (const h of holes) recess(marble, shade, f, h, 1.6)
    }
    fill(marble, f, [rect(0, L, PLINTH, WALL), ...holes])
  }
  // coping, roof, and the corner pinnacles
  prism(marble, oct.map(([x, y]) => [x * (H + 0.3) / H, y * (H + 0.3) / H] as XY), WALL, COPING, marble, 0.2)
  for (const q of oct) lathe(marble, [[0.85, PLINTH], [0.85, 34.6], [1.1, 35.1], [0, 36.6]], MSEG > 10 ? 8 : 6, q, 0, true)

  // The drum: the plain cylinder, a moulding, the inscribed band, and the lip the bulb sits on (heights and radii in the header).
  lathe(marble, [[DRUM_R, COPING], [DRUM_R, 41.4], [13.8, 41.6], [13.8, 41.9], [13.6, 42.0], [13.6, 43.7], [13.9, 43.8], [13.9, 44.1], [13.2, DRUM_TOP]], SEG, [0, 0], 0, false)
  // The onion dome, traced from the north telephoto: pinched where it leaves the drum, swelling to r 14.7, a long convex shoulder to the lotus.
  lathe(marble, [[13.2, 44.1], [14.1, 45.0], [14.7, 46.3], [14.7, 47.6], [14.5, 49.0], [14.0, 50.4], [13.5, 51.7], [12.8, 53.1], [12.0, 54.5], [10.9, 55.8], [9.4, 57.2], [7.6, 58.5], [6.4, 59.6]], SEG)
  // the lotus cap: a petal rim, then the concave taper to the finial's foot; then the gilt finial, stacked bulbs and the spike
  lathe(marble, [[6.4, 59.6], [6.5, 60.0], [5.9, 60.6], [4.7, 61.3], [3.0, 62.6], [1.6, 64.0], [1.0, 64.3]], SEG, [0, 0], 0, true)
  flat(marble, ngon(0, 0, 1.0, SEG, 0), 64.3)
  lathe(gold, [[0.5, 64.2], [1.1, 65.0], [0.4, 65.8], [0.95, 66.7], [0.3, 67.7], [0.75, 68.4], [0.25, 69.2], [0.35, 70.5], [0.12, 71.5], [0, 73]], 8)

  // The four chhatris round the drum.
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) chhatri(marble, gold, [16.5 * sx, 16.5 * sy], COPING, 4.6, 41.4, 44.2, detail ? 16 : 12, 8)

  // The minarets, on the plinth's corners: a pedestal, the tapering shaft broken by three balconies, a chhatri.
  const BAL = [17.2, 27.9, 39.9]
  for (const c of corners) {
    prism(marble, ngon(c[0], c[1], 3.5, 8, Math.PI / 8), PLINTH + 0.4, PLINTH + 1.6, marble, 0.2)
    const rAt = (h: number) => 2.9 - ((h - PLINTH) * 0.6) / (BAL[2] - PLINTH)
    let z0 = PLINTH + 1.6
    for (const b of BAL) {
      lathe(marble, [[rAt(z0), z0], [rAt(b - 1.2), b - 1.2]], MSEG, c, 0, true)
      // the balcony: corbelled under, a slab, a low parapet
      lathe(marble, [[rAt(b - 1.2), b - 1.2], [rAt(b) + 0.9, b], [rAt(b) + 0.9, b + 0.9]], MSEG, c, 0, true)
      flat(marble, ngon(c[0], c[1], rAt(b) + 0.9, MSEG, 0), b + 0.9)
      z0 = b + 0.9
    }
    chhatri(marble, gold, c, BAL[2] + 0.9, 3.0, 46.5, 48.0, detail ? 12 : 10, 8)
  }

  // Night: the marble floodlit, the dome brightest, tops less.
  const lit = (p: V3, n: V3) => (n[2] > 0.85 ? 0.45 : p[2] > DRUM_TOP - 2 && Math.hypot(p[0], p[1]) < 15 ? 1 : 0.85)
  return [
    { part: marble, material: { ...finish('taj-marble', 0xefe7da), floodlight: lit } },
    { part: shade, material: { ...finish('taj-marble-shade', 0xbcb0a0), floodlight: () => 0.55 } },
    { part: inlay, material: { ...finish('taj-inlay', 0xaea290), floodlight: () => 0.7 } },
    { part: opening, material: finish('taj-opening', 0x5f5850) },
    { part: gold, material: { ...finish('taj-finial', 0xc8a456, 0.5), floodlight: () => 0.8 } },
  ].filter((p) => p.part.triangles > 0)
}

async function write(file: string, parts: Mat[], limit: number, bytes: number) {
  const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > limit) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Taj Mahal', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height: 73,
  })
  if (glb.length > bytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

await write('agra-taj-mahal.glb', build(false), 6500, 250_000)
await write('agra-taj-mahal.detail.glb', build(true), 40_000, 1536 * 1024)
