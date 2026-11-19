/**
 * Fushimi-yagura (伏見櫓), the Imperial Palace (old Edo Castle, Nishinomaru),
 * Tokyo: the two-storey corner turret, the tamon-yagura (long wall
 * building) running east from it, and the ishigaki (stone wall) they stand
 * on — procedural, CC0-1.0.
 * bun generators/tokyo-fushimi-yagura.ts
 *
 * Writes models/tokyo-fushimi-yagura.glb (low) and
 * models/tokyo-fushimi-yagura.detail.glb (detail: finer roof curves, ridge
 * ornaments as shachi, window grilles, the wall's capstones).
 *
 * Built with the shrine/temple kit exported from tokyo-meiji-jingu.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to OSM way/184212776
 * (伏見櫓), whose long sides run at 92° (bearing 2). Origin: that outline's
 * centroid (139.7529555, 35.6806070). The turret faces south over the
 * Nijūbashi moat; its west side drops to the Dōkanbori.
 *
 * Identity, in order: the white plastered turret with two grey tile roofs,
 * the upper one hip-and-gable with its gable to the south, a small gable
 * (chidori-hafu) on the lower roof; the long low white tamon running off it
 * under one grey roof; the dark rows of small windows; the battered grey
 * ishigaki under both, rising from the grass bank over the moat.
 *
 * Evidence:
 *  - OSM way/184212776 (one outline for both): turret x -20.7..-2.7,
 *    y -6.8..9.4; tamon x -0.7..29.5, y -5.4..2.0; a short link between.
 *    No height tags. The two Nijūbashi bridges (way/43933152, the iron
 *    bridge; way/1071262143, the double-arched stone bridge) are 50 m and
 *    150 m off to the east and south-east; they are not part of this model
 *    (see the report).
 *  - published (ja.wikipedia 伏見櫓): a two-storey yagura of the Edo period
 *    with tamon running from both sides; one of the three yagura of Edo
 *    Castle still standing. No published height found.
 *  - terrain (Mapterhorn, `terrain.ts grid`): the inner ground north of the
 *    turret ~23-24 m; the bank falls south to the moat (~4 m) and west; the
 *    DEM smooths the wall into the bank. The ishigaki is drawn from the
 *    model's base (the lowest ground under its foot) to the floor at 7.5 m,
 *    battered on its south and west faces; the map's bank covers its lower
 *    part, as the grass bank does in reality. With the map's fill the
 *    inner (north) ground lies ~6.5 m above the base, so 7.5 leaves a
 *    metre of wall showing inside and ~6-7 m over the bank (photos: 4-6 m).
 *  - heights above the floor (estimates, scaled from Tokuzo's and Zairon's
 *    photos, the tamon's wall ~3.4 m as the scale): turret first storey to
 *    4.0, lower eave 4.3, the skirt to the second storey at 6.0, second
 *    storey to 8.8, upper eave 9.1, gable foot 10.6, ridge 12.0; tamon wall
 *    3.4, eave 3.7, ridge 6.2. The second storey 10 × 8.6 m (about 0.6 of
 *    the first, as in the photos).
 *  - colours (daylight photos, pulled to the palette): plaster #f1efe9;
 *    tile #72777e (#5b6067 in the photos); the ishigaki's andesite #a29e96
 *    (#7d7a75-#9a968e); windows charcoal #4a4f57 (they do not glow).
 *  - night: the turret and tamon are floodlit (lit-up views from the
 *    plaza); the windows stay dark.
 *  - terrain check: see the report; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Fushimi Yagura 190504a.jpg, 江戸村のとくぞう, CC BY-SA 4.0 (south-east, the wall and bank)
 *  - Kaiserpalast Fushimi Yagura 1.jpg and 2.jpg, Zairon, CC BY-SA 4.0 (south-east, over the stone bridge)
 *  - Edo-jo fushimi-yagura.jpg, kamoseiro, CC BY-SA 3.0 (south)
 *  - KokyoFushimiYaguraM1070.jpg, Fg2, public domain (south)
 *  - Imperial Palace Tokyo Fushimi Yagura Keep 1.JPG and 2.JPG, CC BY-SA 3.0 (south-east; south-west over the moat)
 *  - Stone Bridge of Main Gate, Iron Bridge of Main Gate and Fushimi-Yagura of The Imperial Palace.JPG, そらみみ (Soramimi), CC BY-SA 4.0 (the composition)
 * No commercial imagery. No look-only references.
 *
 * Left out: the short tamon wing to the turret's west (not in OSM), the
 * bridges, the pines on the bank.
 * Doubts: the turret's plan comes from OSM only (17.6 × 15.5 m looks large
 * for the photos; the walls are set 0.5 m in from it); the floor's height
 * above the bank rests on the coarse DEM; the north (inner) sides are not
 * photographed and drawn plain.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, bar, jroof, rbox, placed, save, type HanokParts, type Mat } from './tokyo-meiji-jingu'

type Sz = { detail: boolean }
const F = 7.5

function build(S: Sz) {
  const plaster = new Part(), tile = new Part(), stone = new Part(), win = new Part()
  const PR: HanokParts & { edge: Part } = { roof: tile, stone: tile, red: plaster, green: plaster, teal: plaster, lattice: win, edge: plaster }

  // ---- The ishigaki: battered south and west faces, vertical elsewhere ---
  const top: V3[] = [[-20.7, -6.8, F], [-2.7, -6.8, F], [-2.7, -5.4, F], [29.5, -5.4, F], [29.5, 2.0, F], [-2.7, 2.0, F], [-2.7, 9.4, F], [-20.7, 9.4, F]]
  const B = 2.6 // batter at the foot
  const bot: V3[] = [[-20.7 - B, -6.8 - B, 0], [-2.7, -6.8 - B, 0], [-2.7, -5.4 - B, 0], [29.5, -5.4 - B, 0], [29.5, 2.0, 0], [-2.7, 2.0, 0], [-2.7, 9.4, 0], [-20.7 - B, 9.4, 0]]
  // two lifts, the face curving (sori) slightly steeper at the top
  const mid: V3[] = bot.map((p, i) => [p[0] + (top[i][0] - p[0]) * 0.6, p[1] + (top[i][1] - p[1]) * 0.6, F * 0.5])
  stone.loft([bot, mid, top])
  stone.cap(top.slice(0, 2).concat([top[6], top[7]]) as V3[], true)
  stone.cap([top[2], top[3], top[4], top[5]], true)
  if (S.detail) {
    // capstones along the south and west edges
    bar(stone, [[-20.7, -6.6, F], [-2.9, -6.6, F]], 0.5, 0.25, 0.0, true, false)
    bar(stone, [[-2.7, -5.2, F], [29.3, -5.2, F]], 0.5, 0.25, 0.0, true, false)
    bar(stone, [[-20.5, -6.8, F], [-20.5, 9.2, F]], 0.5, 0.25, 0.0, true, false)
  }

  // ---- Windows: dark, slightly recessed panels with grilles in detail ----
  const window = (x: number, y: number, w: number, z0: number, z1: number, face: 's' | 'n' | 'e' | 'w') => {
    const o = 0.04
    const q = (a: V3, b: V3, c: V3, d: V3) => win.quad(a, b, c, d)
    if (face === 's') q([x - w / 2, y - o, z0], [x + w / 2, y - o, z0], [x + w / 2, y - o, z1], [x - w / 2, y - o, z1])
    if (face === 'n') q([x + w / 2, y + o, z0], [x - w / 2, y + o, z0], [x - w / 2, y + o, z1], [x + w / 2, y + o, z1])
    if (face === 'e') q([x + o, y - w / 2, z0], [x + o, y + w / 2, z0], [x + o, y + w / 2, z1], [x + o, y - w / 2, z1])
    if (face === 'w') q([x - o, y + w / 2, z0], [x - o, y - w / 2, z0], [x - o, y - w / 2, z1], [x - o, y + w / 2, z1])
    if (S.detail && (face === 's' || face === 'n')) {
      const n = Math.max(2, Math.round(w / 0.3))
      for (let i = 1; i < n; i++) {
        const xx = x - w / 2 + (w * i) / n, yy = face === 's' ? y - 0.1 : y + 0.1
        rbox(plaster, xx, yy, 0.04, 0.06, z0, z1, 0, 'tb')
      }
    }
  }

  // ---- The turret ---------------------------------------------------------
  const T0 = { x0: -20.2, x1: -3.2, y0: -6.3, y1: 8.9 }
  box(plaster, T0.x0, T0.y0, F, T0.x1, T0.y1, F + 4.0, 'b')
  for (const x of [-17.6, -14.3, -11.0, -7.7, -5.4]) window(x, T0.y0, 1.2, F + 1.6, F + 2.8, 's')
  for (const y of [-3.6, 0.4, 4.4, 7.4]) window(T0.x0, y, 1.2, F + 1.6, F + 2.8, 'w')
  const cx = (T0.x0 + T0.x1) / 2, cy = (T0.y0 + T0.y1) / 2
  const U = { hx: 5.0, hy: 4.3 }
  jroof(PR, { coarse: S.detail ? false : 2, noHips: !S.detail, cx, cy,
    kind: 'skirt', ex: (T0.x1 - T0.x0) / 2 + 1.5, ey: (T0.y1 - T0.y0) / 2 + 1.5, ze: F + 4.4, gx: U.hx + 0.3, gy: U.hy + 0.3, zg: F + 6.0,
    lift: 0.6, flare: 0.5, sag: 0.25, th: 0.45, pow: 2.4, soffit: { bx: (T0.x1 - T0.x0) / 2, by: (T0.y1 - T0.y0) / 2, zb: F + 4.0 },
    hipRidge: { w: 0.35, h: 0.3 },
  })
  // the chidori-hafu: a small gable standing on the lower roof's south slope
  {
    const gx = cx, gy = T0.y0 - 0.2, zb = F + 4.9, w = 2.6, h = 1.7, d = 3.2
    const A: V3 = [gx - w, gy, zb], Bp: V3 = [gx + w, gy, zb], Tp: V3 = [gx, gy, zb + h]
    plaster.tri(A, Bp, Tp)
    for (const s of [-1, 1]) {
      const e: V3 = [gx + s * (w + 0.3), gy - 0.3, zb - 0.15], t: V3 = [gx, gy - 0.3, zb + h + 0.25]
      const e2: V3 = [e[0], e[1] + d, e[2] + 0.9], t2: V3 = [t[0], t[1] + d, t[2]]
      if (s < 0) tile.quad(e, t, t2, e2); else tile.quad(t, e, e2, t2)
    }
  }
  // second storey and the upper roof (gable to the south)
  box(plaster, cx - U.hx, cy - U.hy, F + 5.8, cx + U.hx, cy + U.hy, F + 8.8, 'b')
  for (const x of [-3.2, 0, 3.2]) window(cx + x, cy - U.hy, 1.1, F + 6.9, F + 7.9, 's')
  for (const y of [-2.2, 2.2]) window(cx - U.hx, cy + y, 1.1, F + 6.9, F + 7.9, 'w')
  // turned so the ridge runs north-south and the gables face south and north
  const Q = placed({ tile, plaster, win }, Math.PI / 2, cx, cy)
  jroof({ roof: Q.tile, stone: Q.tile, red: Q.plaster, green: Q.plaster, teal: Q.plaster, lattice: Q.win, edge: Q.plaster }, { coarse: !S.detail, cx: 0, cy: 0,
    kind: 'paljak', ex: U.hy + 2.0, ey: U.hx + 2.0, ze: F + 9.1, gx: U.hy * 0.62, gy: U.hx * 0.45, zg: F + 10.6, zr: F + 12.0, rx: U.hy * 0.55,
    lift: 0.8, flare: 0.6, sag: 0.45, th: 0.45, pow: 2.2, soffit: { bx: U.hy, by: U.hx, zb: F + 8.8 },
    ridge: { h: 0.5, w: 0.55 }, ridgeSag: 0.05, hipRidge: { w: 0.3, h: 0.28 },
  })

  // ---- The tamon (and the link to the turret) -------------------------------
  const TM = { x0: -0.7, x1: 29.5, y0: -5.4, y1: 2.0 }
  box(plaster, -3.2, -3.9, F, -0.7, -2.6, F + 3.0, 'b')
  box(plaster, TM.x0, TM.y0 + 0.3, F, TM.x1, TM.y1 - 0.3, F + 3.4, 'b')
  for (let x = 1.6; x < TM.x1 - 1; x += 2.6) window(x, TM.y0 + 0.3, 1.0, F + 1.4, F + 2.4, 's')
  const tx = (TM.x0 + TM.x1) / 2, ty = (TM.y0 + TM.y1) / 2, hx = (TM.x1 - TM.x0) / 2, hy = (TM.y1 - TM.y0) / 2
  jroof(PR, { coarse: S.detail ? false : 2, lite: !S.detail, cx: tx, cy: ty,
    kind: 'paljak', ex: hx + 0.9, ey: hy + 0.9, ze: F + 3.7, gx: hx - 1.5, gy: hy * 0.45, zg: F + 5.0, zr: F + 6.2, rx: hx - 2.0,
    lift: 0.3, flare: 0.2, sag: 0.3, th: 0.4, pow: 3.0, soffit: { bx: hx, by: hy - 0.3, zb: F + 3.4 },
    ridge: { h: 0.4, w: 0.5 }, ridgeSag: 0.0, hipRidge: { w: 0.3, h: 0.25 },
  })

  // ---- Shachi on the ridge ends --------------------------------------------
  const shachi = (x: number, y: number, z: number, dir: number, along: 'x' | 'y') => {
    if (S.detail) {
      const P = (a: number, h: number): V3 => (along === 'x' ? [x + dir * a, y, z + h] : [x, y + dir * a, z + h])
      bar(tile, [P(0, 0), P(-0.2, 0.5), P(-0.15, 0.9), P(0.15, 1.2)], 0.3, 0.25, 0.25, true, true)
    } else rbox(tile, x, y, 0.25, 0.25, z, z + 1.0, 0, 'b')
  }
  shachi(cx, cy - U.hy * 0.55 - 0.3, F + 12.4, -1, 'y'); shachi(cx, cy + U.hy * 0.55 + 0.3, F + 12.4, 1, 'y')
  shachi(tx - (hx - 2.0) - 0.3, ty, F + 6.5, -1, 'x'); shachi(tx + (hx - 2.0) + 0.3, ty, F + 6.5, 1, 'x')

  const lit = (p: V3, n: V3) => (p[2] < F ? 0 : n[2] > 0.6 ? 0.3 : 0.9)
  const parts: Mat[] = [
    { part: plaster, material: { ...finish('white-plaster', 0xf1efe9), floodlight: lit } },
    { part: tile, material: finish('roof-tile', 0x72777e) },
    { part: stone, material: finish('ishigaki', 0xa29e96) },
    { part: win, material: finish('charcoal', 0x4a4f57) },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { bearing: 2, elevation: 0, height: 21.0, osm: 'way/184212776' }
  await save('Fushimi-yagura', build({ detail: false }), 'tokyo-fushimi-yagura.glb', 6500, 250_000, extras)
  await save('Fushimi-yagura', build({ detail: true }), 'tokyo-fushimi-yagura.detail.glb', 40_000, 1536 * 1024, extras)
}
