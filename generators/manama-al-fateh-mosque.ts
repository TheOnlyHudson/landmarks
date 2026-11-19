/**
 * Al Fateh Grand Mosque (Ahmed Al Fateh Islamic Centre), Juffair, Manama
 * (1987-88): procedural, CC0-1.0.
 * bun generators/manama-al-fateh-mosque.ts
 *
 * A sand-coloured stone mosque, 100 x 75 m: a prayer hall under the great
 * fluted fibreglass dome at the qibla (west-south-west) end, two 70 m
 * minarets at its outer corners, domed portal blocks beside them, tall
 * domed iwan porches in the middle of both long sides, an arcaded court
 * wing to the east and the main domed entrance iwan on the east front. The
 * walls carry deep pointed-arch bays with lattice windows, a rose band and
 * rose square-kufic panels under the parapet, and (detail model) a stepped
 * crenellation all round.
 *
 * Frame: bearing 336 (model +x runs along the building's long axis to
 * 066 deg, the entrance side; -x is the qibla wall). Origin: centroid of
 * OSM way/29253447, 50.5983385, 26.2189900, which lies on the building's
 * symmetry axis (the minarets are mirrored about it to 0.1 m).
 *
 * Evidence
 * - OSM way/29253447 (building=mosque, wikidata Q2086076, start 1988): the
 *   outline, read in the turned frame: hall x -43..2, side porches x 2..13
 *   projecting to |y| 40.5, court wing x 13..42 (|y| <= 32.4), east porch
 *   x 42..54.4 (|y| <= 7.7); the narrower qibla end (|y| <= 27.3, x < -33)
 *   with the minaret bases in its corners. Minarets: node/12609342949
 *   (x -34.4, y 35.3) and node/12609342950 (x -35.7, y -35.4).
 * - Published: 100 x 75 m; main dome 24 m outer diameter, fibreglass,
 *   "the world's largest fibreglass dome"; teak doors; capacity 7,000
 *   (en.wikipedia.org/wiki/Al_Fateh_Grand_Mosque). Minarets 70 m, dome
 *   height 16 m (structurae.net/en/structures/al-fateh-grand-mosque).
 * - Photos, all EVIDENCE:
 *   p1 "Al Fateh outside.jpg", أبو الشاي حليب, CC BY-SA 4.0: the long side
 *     (6 lattice arch bays), the corner portal with its dome, the side iwan
 *     porch with its dome, both minarets, rose band and kufic panels.
 *     https://commons.wikimedia.org/wiki/File:Al_Fateh_outside.jpg
 *   p2 "Al Fateh Grand Mosque.jpg", Dobroš, CC BY-SA 4.0: the same side
 *     under overcast sky; people for scale.
 *     https://commons.wikimedia.org/wiki/File:Al_Fateh_Grand_Mosque.jpg
 *   p3 "AlFatehMosque.jpg", XIDME, CC BY 4.0: aerial from the east, the
 *     entrance front, dome and minarets in plan.
 *     https://commons.wikimedia.org/wiki/File:AlFatehMosque.jpg
 *   p4-p6 "Manama al-Fateh Grand Mosque Exterior Norden 1/2/3.jpg", Zairon,
 *     CC BY-SA 4.0: from the north, the dome's ribs and scalloped band, the
 *     minaret stages (square base, shaft with lattice slots, muqarnas
 *     corbel, arcaded loggia, cap dome, finial with crescent).
 *     https://commons.wikimedia.org/wiki/File:Manama_al-Fateh_Grand_Mosque_Exterior_Norden_1.jpg
 *   p7 "Main Al-Fateh Mosque Entrance, Bahrain.jpg", Ahmed Sadoon, CC BY 4.0:
 *     the open court with its pointed arcades.
 *     https://commons.wikimedia.org/wiki/File:Main_Al-Fateh_Mosque_Entrance,_Bahrain.jpg
 *   p8 "Manama al-Fateh Grand Mosque Interior Innenhof 5.jpg", Zairon,
 *     CC BY-SA 4.0: the court arcade, its depth and arch shape.
 *     https://commons.wikimedia.org/wiki/File:Manama_al-Fateh_Grand_Mosque_Interior_Innenhof_5.jpg
 *
 * Estimated from the photos (scaled by the 70 m minarets, the 24 m dome and
 * people in p2): hall walls 15 m; corner portal blocks 18 m; side and east
 * iwan porches 19 m, arches 8.4 m wide springing at 11 m; raised dome block
 * 20.5 m; drum to 23 m, dome to 36 m, finial to 40.5 m; court wing 12 m;
 * lattice bays 3 m wide at 4 m pitch, springing at 9 m; small domes
 * 8-9 m across; minaret stages as listed in `minaret()`.
 * Colours (sunlit and overcast, p1, p2, p5): walls #d8c5af/#c0aa91 ->
 * #e6d4bc; dome #e3d2c3 -> #efe6d8; rose band and kufic panels
 * #a28474/#8f7e79 (mixed with stone) -> #cf9a8c; doors dark teak -> #8a6244;
 * finials gold.
 *
 * Lead review round 1: the lattice screens are light warm brown-cream
 * (#cdb391, the lit `window` material), set back 1 m in real reveals; the
 * side and east iwans are enlarged to the photo's proportion (8.4 and 10 m
 * wide, apex within 2 m of the parapet, 4-5 m deep), with lattice screens
 * round their teak doors and smaller arched doorways in their side walls;
 * the minarets stand exactly at the two OSM nodes.
 *
 * Night: the stone and dome are floodlit (`_FLOODLIGHT` on vertical faces);
 * the lattice windows are `window` and glow.
 *
 * Doubts: no published plan; the dome's position along the hall, the
 * interior court's size and the qibla wall's openings are estimated from p3
 * and p7. The two small bumps on the qibla wall in OSM (mihrab buttresses)
 * are left out. The dome's surface pattern is drawn as ribs only.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { oq, ot, triCount, type P2 } from './riyadh-kingdom-centre'

const ANCHOR = { lng: 50.5983385, lat: 26.21899 }
const BEARING = 336

type Bay = { c: number; w: number; zs: number; d: number; z0?: number; back?: 'window' | 'stone' | 'door'; panels?: boolean; side?: boolean }

function build(detail: boolean) {
  const stone = new Part(), dome = new Part(), rose = new Part(), win = new Part(), teak = new Part(), gold = new Part()
  const HS = detail ? 6 : 3 // segments per half arch

  /** Pointed-arch points from the left springing over the apex to the right one, as (s, z). */
  const archPts = (c: number, w: number, zs: number): [number, number][] => {
    const r = 0.78 * w, out: [number, number][] = []
    const ta = Math.acos((w / 2 - r) / r)
    for (let k = 0; k <= HS; k++) { const t = Math.PI + ((ta - Math.PI) * k) / HS; out.push([c - w / 2 + r + r * Math.cos(t), zs + r * Math.sin(t)]) }
    for (let k = HS - 1; k >= 0; k--) { const [s, z] = out[k]; out.push([2 * c - s, z]) }
    return out
  }

  /**
   * A wall face a→b (outward normal `o`) from z0 to zTop, with pointed-arch
   * bays cut into it: real reveals and soffits, and a back panel at depth d.
   */
  function face(a: P2, b: P2, o: P2, z0: number, zTop: number, bays: Bay[], band = true) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const P = (s: number, z: number, d = 0): V3 => [a[0] + t[0] * s - o[0] * d, a[1] + t[1] * s - o[1] * d, z]
    const N: V3 = [o[0], o[1], 0]
    const plain = (s0: number, s1: number) => {
      const n = Math.max(1, Math.ceil((s1 - s0) / (detail ? 6 : 12)))
      for (let k = 0; k < n; k++) { const u0 = s0 + ((s1 - s0) * k) / n, u1 = s0 + ((s1 - s0) * (k + 1)) / n; oq(stone, P(u0, z0), P(u1, z0), P(u1, zTop), P(u0, zTop), N) }
    }
    let s = 0
    for (const bay of [...bays].sort((p, q) => p.c - q.c)) {
      const { c, w, zs, d } = bay, bz = bay.z0 ?? z0
      if (c - w / 2 > s + 0.01) plain(s, c - w / 2)
      s = c + w / 2
      const pts = archPts(c, w, zs)
      // sill below a raised opening
      if (bz > z0) oq(stone, P(c - w / 2, z0), P(c + w / 2, z0), P(c + w / 2, bz), P(c - w / 2, bz), N)
      // spandrel above the arch
      for (let k = 0; k + 1 < pts.length; k++) oq(stone, P(pts[k][0], pts[k][1]), P(pts[k + 1][0], pts[k + 1][1]), P(pts[k + 1][0], zTop), P(pts[k][0], zTop), N)
      // reveals: jambs and the soffit
      oq(stone, P(c - w / 2, bz), P(c - w / 2, bz, d), P(c - w / 2, zs, d), P(c - w / 2, zs), [t[0], t[1], 0])
      oq(stone, P(c + w / 2, bz), P(c + w / 2, bz, d), P(c + w / 2, zs, d), P(c + w / 2, zs), [-t[0], -t[1], 0])
      for (let k = 0; k + 1 < pts.length; k++) {
        const ms = (pts[k][0] + pts[k + 1][0]) / 2
        oq(stone, P(pts[k][0], pts[k][1]), P(pts[k + 1][0], pts[k + 1][1]), P(pts[k + 1][0], pts[k + 1][1], d), P(pts[k][0], pts[k][1], d), [t[0] * (c - ms), t[1] * (c - ms), -1])
      }
      if (bz > z0 + 0.01) oq(stone, P(c - w / 2, bz), P(c + w / 2, bz), P(c + w / 2, bz, d), P(c - w / 2, bz, d), [0, 0, 1])
      // back panel
      const shape: [number, number][] = [[c - w / 2, bz], [c + w / 2, bz], ...pts.slice().reverse()]
      const back = bay.back ?? 'window'
      const bp = back === 'stone' ? stone : win // iwans: lattice screen round the doors
      for (let k = 1; k + 1 < shape.length; k++) ot(bp, P(shape[0][0], shape[0][1], d), P(shape[k][0], shape[k][1], d), P(shape[k + 1][0], shape[k + 1][1], d), N)
      if (back === 'door') {
        const dw = Math.min(w * 0.55, 4.2), dh = Math.min(zs * 0.62, 6)
        oq(teak, P(c - dw / 2, bz, d - 0.06), P(c + dw / 2, bz, d - 0.06), P(c + dw / 2, bz + dh, d - 0.06), P(c - dw / 2, bz + dh, d - 0.06), N)
        // lattice fanlight in the arch head
        const fp = archPts(c, w * 0.62, zs + 0.5)
        const fs: [number, number][] = [[c - w * 0.31, bz + dh + 0.8], [c + w * 0.31, bz + dh + 0.8], ...fp.slice().reverse()]
        for (let k = 1; k + 1 < fs.length; k++) ot(win, P(fs[0][0], fs[0][1], d - 0.06), P(fs[k][0], fs[k][1], d - 0.06), P(fs[k + 1][0], fs[k + 1][1], d - 0.06), N)
      }
      // smaller arched openings in the iwan's side walls (p1): recessed doorways on each jamb
      if (bay.side) for (const sg of [-1, 1]) {
        const js = c + (sg * w) / 2, dd = d / 2, ow = Math.min(2.4, d * 0.6), ozs = Math.min(5.5, zs * 0.55)
        // on the jamb plane (normal along -sg * t), param along depth
        const J = (dep: number, z: number, inset = 0): V3 => [a[0] + t[0] * (js - sg * inset) - o[0] * dep, a[1] + t[1] * (js - sg * inset) - o[1] * dep, z]
        const ap = archPts(dd, ow, ozs)
        const shp: [number, number][] = [[dd - ow / 2, bz], [dd + ow / 2, bz], ...ap.slice().reverse()]
        for (let k = 1; k + 1 < shp.length; k++) ot(teak, J(shp[0][0], shp[0][1], 0.05), J(shp[k][0], shp[k][1], 0.05), J(shp[k + 1][0], shp[k + 1][1], 0.05), [-sg * t[0], -sg * t[1], 0])
      }
      // rose square-kufic panels flanking a big portal
      if (bay.panels) for (const sg of [-1, 1]) {
        const pc = c + sg * (w / 2 + 1.9)
        oq(rose, P(pc - 1.3, 3.2, -0.05), P(pc + 1.3, 3.2, -0.05), P(pc + 1.3, 5.0, -0.05), P(pc - 1.3, 5.0, -0.05), N)
      }
    }
    if (s < L - 0.01) plain(s, L)
    // the rose band under the parapet, and (detail) the stepped crenellation
    if (band) {
      oq(rose, P(0, zTop - 1.7, -0.05), P(L, zTop - 1.7, -0.05), P(L, zTop - 1.0, -0.05), P(0, zTop - 1.0, -0.05), N)
      if (detail) {
        const n = Math.floor(L / 1.5)
        for (let k = 0; k < n; k++) merlon(P((k + 0.5) * (L / n), zTop, 0.25), t, o)
      }
    }
  }
  /** A stepped merlon, 1 m wide, 1.05 m tall, 0.35 m thick, standing at p on the wall line. */
  const STEP: P2[] = [[-0.5, 0], [0.5, 0], [0.5, 0.45], [0.3, 0.45], [0.3, 0.8], [0.12, 0.8], [0.12, 1.05], [-0.12, 1.05], [-0.12, 0.8], [-0.3, 0.8], [-0.3, 0.45], [-0.5, 0.45]]
  function merlon(p: V3, t: P2, o: P2) {
    const Q = ([u, v]: P2, d: number): V3 => [p[0] + t[0] * u + o[0] * d, p[1] + t[1] * u + o[1] * d, p[2] + v]
    const tris = [[0, 1, 2], [0, 2, 11], [3, 4, 9], [3, 9, 10], [5, 6, 7], [5, 7, 8]]
    for (const [i, j, k] of tris) {
      ot(rose, Q(STEP[i], 0.18), Q(STEP[j], 0.18), Q(STEP[k], 0.18), [o[0], o[1], 0])
      ot(rose, Q(STEP[i], -0.18), Q(STEP[j], -0.18), Q(STEP[k], -0.18), [-o[0], -o[1], 0])
    }
    for (let i = 0; i < STEP.length; i++) {
      const A = STEP[i], B = STEP[(i + 1) % STEP.length]
      const ex = B[0] - A[0], ev = B[1] - A[1]
      oq(rose, Q(A, 0.18), Q(B, 0.18), Q(B, -0.18), Q(A, -0.18), [t[0] * ev, t[1] * ev, -ex])
    }
  }

  type Faces = { s?: Bay[]; n?: Bay[]; w?: Bay[]; e?: Bay[] }
  /** A rectangular block x0..x1, y0..y1, z0..h, with arch bays per face (positions measured from the face's left end seen from outside). */
  function block(x0: number, x1: number, y0: number, y1: number, h: number, f: Faces = {}, opt: { z0?: number; skip?: string; band?: boolean } = {}) {
    const z0 = opt.z0 ?? 0, band = opt.band ?? true
    if (!opt.skip?.includes('s')) face([x0, y0], [x1, y0], [0, -1], z0, h, f.s ?? [], band)
    if (!opt.skip?.includes('e')) face([x1, y0], [x1, y1], [1, 0], z0, h, f.e ?? [], band)
    if (!opt.skip?.includes('n')) face([x1, y1], [x0, y1], [0, 1], z0, h, f.n ?? [], band)
    if (!opt.skip?.includes('w')) face([x0, y1], [x0, y0], [-1, 0], z0, h, f.w ?? [], band)
    oq(stone, [x0, y0, h], [x1, y0, h], [x1, y1, h], [x0, y1, h], [0, 0, 1])
  }
  const row = (start: number, pitch: number, n: number, b: Omit<Bay, 'c'>): Bay[] => Array.from({ length: n }, (_, k) => ({ ...b, c: start + pitch * k }))
  const lattice = (start: number, n: number, pitch = 4): Bay[] => row(start, pitch, n, { w: 3.0, zs: 9.0, d: 1.0, z0: 0.8 })
  const iwan = (c: number): Bay[] => [{ c, w: 8.4, zs: 11, d: 4.2, back: 'door', panels: true, side: true }]

  // ---------------- the prayer hall ----------------
  // long middle stretch with the six lattice bays per side (x -21.9..1.9)
  block(-21.9, 1.9, -38.1, 38.1, 15, { s: lattice(2, 6), n: lattice(2, 6) }, { skip: 'we' })
  // between the corner portals (x -32.9..-21.9), the narrower qibla end (x -43.2..-32.9)
  block(-32.9, -21.9, -27, 27, 15, {}, { skip: 'nsew' })
  block(-43.2, -32.9, -27.3, 27.3, 15, { w: lattice(6.5, 5, 9.6).map((b) => ({ ...b, w: 3 })), s: lattice(5.2, 1), n: lattice(5.2, 1) }, { skip: 'e' })
  // the corner portal blocks beside the minarets, each with a small dome
  for (const sg of [1, -1]) {
    const y0 = sg > 0 ? 27 : -38.1, y1 = sg > 0 ? 38.1 : -27
    const portal: Bay[] = [{ c: 5.5, w: 4.6, zs: 7.5, d: 2.2, back: 'door', panels: false }]
    block(-32.9, -21.9, y0, y1, 18, sg > 0 ? { n: portal } : { s: portal })
    smallDome(-27.4, sg * 32.6, 18, 4.0)
  }
  // the raised block under the dome, with a clerestory of small arches
  const clere = detail ? row(4, 4, 7, { w: 1.8, zs: 18.2, d: 0.6, z0: 16 }) : []
  block(-33, -5, -14, 14, 20.5, { s: clere, n: clere, e: clere, w: clere }, { z0: 14 })
  if (!detail) {
    // low model: the clerestory as flush panels, four a side
    for (const [a, b, o] of [[[-33, -14], [-5, -14], [0, -1]], [[-5, -14], [-5, 14], [1, 0]], [[-5, 14], [-33, 14], [0, 1]], [[-33, 14], [-33, -14], [-1, 0]]] as [P2, P2, P2][]) {
      const L = 28, t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      for (let k = 0; k < 4; k++) {
        const c = 5 + 6 * k, Q = (s: number, z: number): V3 => [a[0] + t[0] * s + o[0] * 0.05, a[1] + t[1] * s + o[1] * 0.05, z]
        oq(win, Q(c - 1.2, 16), Q(c + 1.2, 16), Q(c + 1.2, 18.6), Q(c - 1.2, 18.6), [o[0], o[1], 0])
      }
    }
  }
  greatDome(-19, 0)

  // ---------------- side iwan porches and the link between them ----------------
  block(1.9, 12.9, -28, 28, 15, {}, { skip: 'we' })
  for (const sg of [1, -1]) {
    const y0 = sg > 0 ? 28 : -40.5, y1 = sg > 0 ? 40.5 : -28
    block(1.9, 12.9, y0, y1, 19, sg > 0 ? { n: iwan(5.5) } : { s: iwan(5.5) })
    smallDome(7.4, sg * 34.2, 19, 5.0)
  }

  // ---------------- the court wing: outer bays, inner arcades round the open court ----------------
  const arcade = (start: number, n: number, pitch: number): Bay[] => row(start, pitch, n, { w: 3.4, zs: 6.5, d: 3.5, back: 'stone' })
  const outer = (start: number, n: number, pitch: number): Bay[] => row(start, pitch, n, { w: 3.0, zs: 6.4, d: 0.8, z0: 0.8 })
  block(12.9, 41.9, 24, 32.4, 12, { n: detail ? outer(3.3, 6, 4.5) : outer(4.2, 4, 6.8), s: arcade(4.6, 5, 5) }, { skip: 'we' })
  block(12.9, 41.9, -32.4, -24, 12, { s: detail ? outer(3.3, 6, 4.5) : outer(4.2, 4, 6.8), n: arcade(4.6, 5, 5) }, { skip: 'we' })
  block(12.9, 18.5, -24, 24, 12, { e: detail ? arcade(4, 9, 5) : arcade(4.5, 7, 6.5) }, { skip: 'nsw' })
  block(36.5, 41.9, -24, 24, 12, { w: detail ? arcade(4, 9, 5) : arcade(4.5, 7, 6.5), e: [...row(3.4, 4.6, 4, { w: 3.0, zs: 6.4, d: 3, back: 'stone' }), ...row(31.4, 4.6, 4, { w: 3.0, zs: 6.4, d: 3, back: 'stone' })] }, { skip: 'ns' })
  // the court corners' east and west end faces
  face([41.9, -32.4], [41.9, -24], [1, 0], 0, 12, [{ c: 4.2, w: 3.0, zs: 6.4, d: 3, back: 'stone' }])
  face([41.9, 24], [41.9, 32.4], [1, 0], 0, 12, [{ c: 4.2, w: 3.0, zs: 6.4, d: 3, back: 'stone' }])
  face([12.9, 32.4], [12.9, 28], [-1, 0], 0, 12, [], false)
  face([12.9, -28], [12.9, -32.4], [-1, 0], 0, 12, [], false)

  // ---------------- the main entrance iwan on the east front ----------------
  block(41.9, 54.4, -7.7, 7.7, 19, { e: [{ c: 7.7, w: 10, zs: 9.9, d: 5, back: 'door', panels: false, side: true }] }, { skip: 'w' })
  smallDome(48.2, 0, 19, 4.6)

  // ---------------- minarets ----------------
  // exactly at the OSM minaret nodes
  minaret(-34.37, 35.27) // node/12609342949
  minaret(-35.67, -35.43) // node/12609342950

  // ================= helpers that draw round things =================
  function turned(p: Part, cx: number, cy: number, prof: [number, number][], seg: number, flute = 0) {
    // smooth-shaded surface of revolution from a (r, z) profile; `flute` > 0 adds ribs
    const R = (r: number, i: number) => r * (flute && i % 2 ? 1 - flute : 1)
    for (let k = 0; k + 1 < prof.length; k++) {
      const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
      const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
      for (let i = 0; i < seg; i++) {
        const a0 = (2 * Math.PI * i) / seg, a1 = (2 * Math.PI * (i + 1)) / seg
        const n = (a: number): V3 => [(Math.cos(a) * dz) / l, (Math.sin(a) * dz) / l, -dr / l]
        const Pt = (r: number, z: number, a: number, j: number): V3 => [cx + R(r, j) * Math.cos(a), cy + R(r, j) * Math.sin(a), z]
        const A = Pt(r0, z0, a0, i), B = Pt(r0, z0, a1, i + 1), C = Pt(r1, z1, a1, i + 1), D = Pt(r1, z1, a0, i)
        if (r1 < 1e-3) { p.tri(A, B, [cx, cy, z1], undefined, undefined, undefined, [n(a0), n(a1), [0, 0, 1]]); continue }
        if (r0 < 1e-3) { p.tri([cx, cy, z0], C, D, undefined, undefined, undefined, [[0, 0, -1], n(a1), n(a0)]); continue }
        p.tri(A, B, C, undefined, undefined, undefined, [n(a0), n(a1), n(a1)])
        p.tri(A, C, D, undefined, undefined, undefined, [n(a0), n(a1), n(a0)])
      }
    }
  }
  function finial(cx: number, cy: number, z: number, s: number) {
    // gold rod with two orbs and a crescent turned to the qibla axis
    if (detail) turned(gold, cx, cy, [[0.14 * s, z], [0.14 * s, z + 0.6 * s], [0.42 * s, z + 0.85 * s], [0.42 * s, z + 1.1 * s], [0.12 * s, z + 1.35 * s], [0.12 * s, z + 1.7 * s], [0.3 * s, z + 1.9 * s], [0.3 * s, z + 2.1 * s], [0.08 * s, z + 2.3 * s], [0, z + 2.4 * s]], 8)
    else turned(gold, cx, cy, [[0.16 * s, z], [0.42 * s, z + 0.95 * s], [0.14 * s, z + 1.5 * s], [0.3 * s, z + 2.0 * s], [0, z + 2.4 * s]], 6)
    const cz = z + 3.0 * s, ro = 0.62 * s, ri = 0.5 * s, n = detail ? 10 : 4
    const ring: V3[] = [], inner: V3[] = []
    for (let k = 0; k <= n; k++) {
      const a = -Math.PI * 0.85 + (1.7 * Math.PI * k) / n
      ring.push([cx, cy + ro * Math.sin(a), cz - ro * Math.cos(a)])
      inner.push([cx, cy + ri * Math.sin(a) * 0.85, cz - ri * Math.cos(a) * 0.85 + 0.14 * s])
    }
    for (let k = 0; k < n; k++) for (const sx of [1, -1]) {
      const off = (p: V3): V3 => [p[0] + sx * 0.06 * s, p[1], p[2]]
      oq(gold, off(ring[k]), off(ring[k + 1]), off(inner[k + 1]), off(inner[k]), [sx, 0, 0])
    }
  }
  function smallDome(cx: number, cy: number, z: number, r: number) {
    const seg = detail ? 20 : 10, prof: [number, number][] = [[r * 1.08, z], [r * 1.08, z + 0.6], [r, z + 0.6], [r, z + 1.2]]
    const n = detail ? 7 : 3
    for (let k = 1; k <= n; k++) { const a = (Math.PI / 2) * (k / n); prof.push([r * Math.cos(a) + (k === n ? 0 : 0), z + 1.2 + r * 1.05 * Math.sin(a)]) }
    turned(dome, cx, cy, prof, seg)
    finial(cx, cy, z + 1.2 + r * 1.05, 0.9)
  }
  function greatDome(cx: number, cy: number) {
    const seg = detail ? 48 : 24, n = detail ? 10 : 6, R = 12
    // the drum (a band of small arched panels on the detail model), then the ribbed dome
    turned(dome, cx, cy, [[R + 0.4, 20.5], [R + 0.4, 21.3], [R, 21.3], [R, 23]], seg)
    const prof: [number, number][] = [[R, 23]]
    for (let k = 1; k <= n; k++) { const a = (Math.PI / 2) * (k / n); prof.push([R * Math.cos(a), 23 + 13 * Math.sin(a)]) }
    turned(dome, cx, cy, prof.slice(0, -1).concat([[0.6, 35.9], [0, 36]]), seg, 0.03)
    // the scalloped band near the dome's foot, as raised arch panels (rose-tinted shadow lines in p4)
    if (detail) {
      const m = 32
      for (let i = 0; i < m; i++) {
        const a0 = (2 * Math.PI * i) / m, a1 = (2 * Math.PI * (i + 1)) / m, am = (a0 + a1) / 2
        const r = R * Math.cos((Math.PI / 2) * 0.18) + 0.12
        const pt = (a: number, z: number): V3 => [cx + (r + 0.05) * Math.cos(a), cy + (r + 0.05) * Math.sin(a), z]
        ot(rose, pt(a0, 24.6), pt(a1, 24.6), pt(am, 26.4), [Math.cos(am), Math.sin(am), 0.3])
      }
    }
    finial(cx, cy, 35.9, 1.9)
  }
  function minaret(cx: number, cy: number) {
    const oct = 8
    // square base to the hall roof, bevelled
    const b = 3.2, bv = 0.4
    const sq = (z: number, h: number): V3[] => [[-h + bv, -h], [h - bv, -h], [h, -h + bv], [h, h - bv], [h - bv, h], [-h + bv, h], [-h, h - bv], [-h, -h + bv]].map(([x, y]) => [cx + x, cy + y, z] as V3)
    stone.loft([sq(0, b), sq(17, b)])
    // a moulded transition to the octagon
    const ring = (r: number, z: number, rot = Math.PI / 8): V3[] => Array.from({ length: oct }, (_, k) => { const a = rot + (2 * Math.PI * k) / oct; return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3 })
    stone.loft([sq(17, b), ring(3.1, 18.5)])
    oq(stone, ...(sq(17, b).slice(0, 4) as [V3, V3, V3, V3]), [0, 0, 1])
    // the octagonal shaft with a ring at 31 m
    stone.loft([ring(3.1, 18.5), ring(2.9, 30.5)])
    rose.loft([ring(2.9, 30.5), ring(3.25, 30.9), ring(3.25, 31.6), ring(2.9, 32)])
    stone.loft([ring(2.9, 32), ring(2.75, 49.5)])
    // lattice slot windows on alternate faces
    for (let k = 0; k < oct; k += 2) {
      const a = (2 * Math.PI * k) / oct + Math.PI / 4 - Math.PI / 8 + Math.PI / 8
      const ca = Math.cos(a), sa = Math.sin(a), tx = -sa, ty = ca
      for (const [z0, z1, r0, r1] of [[21, 28.5, 2.92, 2.85], [34, 47, 2.82, 2.74]]) {
        const ap = 0.92 // apothem factor of the octagon
        const Q = (u: number, z: number, r: number): V3 => [cx + ca * (r * ap + 0.04) + tx * u, cy + sa * (r * ap + 0.04) + ty * u, z]
        oq(win, Q(-0.45, z0, r0), Q(0.45, z0, r0), Q(0.45, z1, r1), Q(-0.45, z1, r1), [ca, sa, 0])
      }
    }
    // muqarnas corbel flaring out to the balcony, the balcony parapet
    stone.loft([ring(2.75, 49.5), ring(3.0, 50.6), ring(3.55, 51.4), ring(3.95, 52.2)])
    rose.loft([ring(3.95, 52.2), ring(3.95, 53.5)])
    stone.loft([ring(3.95, 53.5), ring(3.3, 53.6)])
    // the loggia: a dark core and eight piers, so its arched openings are real
    const seg = detail ? 16 : 8
    turned(win, cx, cy, [[2.1, 53.6], [2.1, 58.6]], seg)
    for (let k = 0; k < oct; k++) {
      const a = (2 * Math.PI * k) / oct, r = 2.75, c = Math.cos(a), s = Math.sin(a)
      const pw = 0.42, pd = 0.45
      const Q = (u: number, d: number, z: number): V3 => [cx + c * (r + d) - s * u, cy + s * (r + d) + c * u, z]
      for (const [p0, p1, n] of [[[-pw, pd], [pw, pd], [c, s, 0]], [[pw, -pd], [-pw, -pd], [-c, -s, 0]], [[pw, pd], [pw, -pd], [-s, c, 0]], [[-pw, -pd], [-pw, pd], [s, -c, 0]]] as [P2, P2, V3][])
        oq(stone, Q(p0[0], p0[1], 53.6), Q(p1[0], p1[1], 53.6), Q(p1[0], p1[1], 58.6), Q(p0[0], p0[1], 58.6), n)
    }
    // arch heads between the piers: a ring band with pointed cut-outs is too fine; a solid lintel band
    stone.loft([ring(3.25, 58.6), ring(3.25, 59.6)])
    oq(stone, ring(3.25, 58.6)[0], ring(3.25, 58.6)[1], ring(2.1, 58.6)[1], ring(2.1, 58.6)[0], [0, 0, -1])
    for (let k = 0; k < oct; k++) { const r0 = ring(3.25, 58.6), r1 = ring(2.1, 58.6), j = (k + 1) % oct; oq(stone, r0[k], r0[j], r1[j], r1[k], [0, 0, -1]) }
    // cornice, upper drum, cap dome and finial
    turned(stone, cx, cy, [[3.25, 59.6], [3.6, 60.2], [3.6, 60.8], [2.3, 61.0], [2.3, 63.0], [2.55, 63.2], [2.55, 63.5]], seg)
    const cap: [number, number][] = [[2.55, 63.5]]
    const nd = detail ? 7 : 4
    for (let k = 1; k <= nd; k++) { const a = (Math.PI / 2) * (k / nd); cap.push([2.55 * Math.cos(a) * (1 - 0.15 * Math.sin(a * 2)), 63.5 + 3.1 * Math.sin(a)]) }
    turned(dome, cx, cy, cap, seg)
    finial(cx, cy, 66.6, 1.15)
  }

  const flood = (_p: V3, n: V3) => (Math.abs(n[2]) < 0.6 ? 0.8 : 0.2)
  return [
    { part: stone, material: { ...finish('fateh-stone', 0xe6d4bc), floodlight: flood } },
    { part: dome, material: { ...finish('fateh-dome', 0xefe6d8), floodlight: flood } },
    { part: rose, material: finish('fateh-rose', 0xcf9a8c) },
    { part: win, material: { ...PALETTE.window, color: 0xcdb391 } },
    { part: teak, material: finish('fateh-teak', 0x8a6244) },
    { part: gold, material: finish('fateh-gold', 0xc9a24a, 0.5) },
  ]
}

if (import.meta.main) {
  for (const [file, detail, maxTri, maxBytes] of [['manama-al-fateh-mosque.glb', false, 6500, 256000], ['manama-al-fateh-mosque.detail.glb', true, 40000, 1536 * 1024]] as const) {
    const parts = build(detail)
    const triangles = triCount(parts)
    if (triangles > maxTri) throw new Error(`Triangle budget exceeded: ${triangles}`)
    const glb = writeGlb('Al Fateh Grand Mosque', parts, {
      license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 70,
      frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
      replaces: ['way/29253447'],
    })
    if (glb.length > maxBytes) throw new Error(`File budget exceeded: ${glb.length}`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
  }
}
