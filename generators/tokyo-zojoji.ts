/**
 * Zōjō-ji (三縁山 増上寺), Shiba, Tokyo: the Daiden (大殿, main hall,
 * rebuilt 1974) on its podium — procedural, CC0-1.0.
 * bun generators/tokyo-zojoji.ts
 *
 * Writes models/tokyo-zojoji.glb (low) and models/tokyo-zojoji.detail.glb
 * (detail: bracket sets, round columns, balcony and veranda railings,
 * rafter ends, finer roof curves). The Sangedatsumon gate, 150 m east
 * on the same axis, is its own model: tokyo-zojoji-sanmon.ts.
 *
 * Built with the shrine/temple kit exported from tokyo-meiji-jingu.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to the hall's axis:
 * OSM way/751591140's sides run at 6.5° / 96.5°, so the catalog bearing is
 * 6.5. Origin: that outline's centroid (139.7482907, 35.6574261). The hall
 * faces east (+x), down the precinct's axis to the Sanmon and Hibiya-dōri;
 * it is drawn in its own frame, front to -y, and turned a quarter turn.
 *
 * Identity, in order: the two-tiered roof — a broad lower skirt and a tall
 * upper hip-and-gable roof in dark grey tile, the gilt shibi (fish-tail
 * ridge ornaments) at the ridge ends — over a dark-brown timber frame with
 * white plaster walls; the upper storey's balcony; the hall raised a
 * storey on its podium with the great stair up the front; Tokyo Tower
 * rising behind it from the classic view (not part of the model).
 *
 * Evidence:
 *  - OSM way/751591140 (大殿, hipped-and-gabled, 1974): 54.6 × 51.6 m (the
 *    podium), front east. way/751591139 is a small block at its south-east
 *    corner, joined to the Kōshōden; it is covered by the podium's corner and
 *    listed in `replaces`.
 *  - published (ja.wikipedia 増上寺): Daiden rebuilt 1974 in reinforced
 *    concrete in the medieval Buddhist style; no published height found.
 *  - heights (estimates, scaled from KENPEI's frontal view, ~23 px/m at
 *    the doors, and the south-east view): podium 3.6; main storey columns
 *    to 11.0, bracket band to 13.8, lower eave 14.4 at the middle; the skirt
 *    up to the upper storey at 17.0; balcony 17.0-18.3; upper wall to 21.5,
 *    brackets to 23.6, upper eave 24.2, gable foot 27.4, ridge 31.0, shibi
 *    to 33.0 (the upper roof tall and steep, as in the south-east view). Plan: main storey 7 bays, 38 × 36 m; upper storey 28 × 26 m;
 *    lower eaves 48 × 46 m, upper 40 × 38 m (KENPEI front: the lower
 *    roof as wide as the podium, the upper ~0.8 of it).
 *  - colours (daylight photos, pulled to the palette): tile dark charcoal #575b61
 *    (#4f555c-#6c7177 in the photos; darkened in review); timber #6e4a3e (dark brown, lightened);
 *    white plaster #ece8de; podium stone #cfcac0; shibi gilt #d4ab4f;
 *    the doors and lattice dark timber, the bracket bands dark (in
 *    shadow in every photo), the middle door slate (lit at night).
 *  - night: the hall is floodlit and its doors lit (Syced's night photos
 *    of the Bon dance, 2023).
 *  - terrain: see the report; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Zōjō-ji daiden1.jpg and daiden2.jpg, KENPEI, CC BY-SA 3.0 (front; south-east)
 *  - Zojo-ji 20191104e.jpg, 江戸村のとくぞう, CC BY-SA 4.0 (front with the stair)
 *  - Zōjō-ji 3.jpg, 7.jpg, 8.jpg, Syced, CC0 (front at dusk and night)
 *  - Tokyo Zōjō-ji Sangedatsu-mon gate seen from the main temple.jpg, Ymblanter, CC BY-SA 4.0 (axis)
 * No commercial imagery. No look-only references.
 *
 * Left out: the bronze lanterns, the incense burner, the corridor to the
 * Kōshōden (OSM draws it), the board over the door.
 * Doubts: every height is photo-scaled (no published figure); the back
 * (west) and north sides are unphotographed and drawn like the south; the
 * podium's exact plan under the outline.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { box, bar, storey, columns, brackets, platform, jroof, lathe, rbox, rafterEnds, placed, save, type HanokParts, type Mat } from './tokyo-meiji-jingu'

type Sz = { detail: boolean }

function build(S: Sz) {
  const R = { tile: new Part(), wood: new Part(), plaster: new Part(), stone: new Part(), gold: new Part(), win: new Part() }
  // Built front to -y, turned so the front faces east (+x).
  const M = placed(R, Math.PI / 2, 0, 0)
  const PS: HanokParts = { roof: M.tile, stone: M.stone, red: M.plaster, green: M.wood, teal: M.wood, lattice: M.win }
  const PC: HanokParts = { roof: M.tile, stone: M.stone, red: M.wood, green: M.wood, teal: M.wood, lattice: M.win }
  const PR: HanokParts & { edge: Part } = { roof: M.tile, stone: M.tile, red: M.wood, green: M.wood, teal: M.wood, lattice: M.win, edge: M.wood }

  // ---- Podium: a storey of white walls between dark posts ------------------
  const PX = 25.8, PY0 = -21.6, PY1 = 27.3, F = 3.6
  box(M.plaster, -PX, PY0, 0, PX, PY1, F - 0.6, 'bt')
  box(M.wood, -PX - 0.1, PY0 - 0.1, F - 0.6, PX + 0.1, PY1 + 0.1, F, 'b')
  const posts = (x0: number, y0: number, x1: number, y1: number, n: number) => {
    for (let i = 0; i <= n; i++) {
      const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n
      box(M.wood, x - 0.3, y - 0.3, 0, x + 0.3, y + 0.3, F - 0.6, 'bt')
    }
  }
  posts(-PX, PY0 - 0.05, PX, PY0 - 0.05, 10); posts(-PX, PY1 + 0.05, PX, PY1 + 0.05, 10)
  posts(-PX - 0.05, PY0, -PX - 0.05, PY1, 9); posts(PX + 0.05, PY0, PX + 0.05, PY1, 9)
  // The great front stair, between cheek walls, and the side stairs.
  const NS = S.detail ? 15 : 6
  for (let k = 0; k < NS; k++) box(M.stone, -9, PY0 - 5.4 * (NS - k) / NS, 0, 9, PY0, F * (k + 1) / NS, 'bn')
  for (const e of [-1, 1]) box(M.stone, e * 9, PY0 - 5.6, 0, e * 9.8, PY0, F + 0.4, 'bn')
  // Veranda railing round the podium top.
  if (S.detail) {
    const rz = F + 1.0
    for (const [a, b] of [[[-PX + 0.3, PY0 + 0.3], [-9.3, PY0 + 0.3]], [[9.3, PY0 + 0.3], [PX - 0.3, PY0 + 0.3]], [[PX - 0.3, PY0 + 0.3], [PX - 0.3, PY1 - 0.3]], [[PX - 0.3, PY1 - 0.3], [-PX + 0.3, PY1 - 0.3]], [[-PX + 0.3, PY1 - 0.3], [-PX + 0.3, PY0 + 0.3]]] as number[][][]) {
      bar(M.wood, [[a[0], a[1], rz], [b[0], b[1], rz]], 0.22, 0.14, 0.9, true, false)
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 2.2)
      for (let i = 0; i <= n; i++) box(M.wood, a[0] + (b[0] - a[0]) * i / n - 0.1, a[1] + (b[1] - a[1]) * i / n - 0.1, F, a[0] + (b[0] - a[0]) * i / n + 0.1, a[1] + (b[1] - a[1]) * i / n + 0.1, rz, 'b')
    }
  } else {
    // a low solid balustrade band in the low model
    for (const [x0, y0, x1, y1] of [[-PX, PY0, -9.3, PY0 + 0.25], [9.3, PY0, PX, PY0 + 0.25], [PX - 0.25, PY0, PX, PY1], [-PX, PY1 - 0.25, PX, PY1], [-PX, PY0, -PX + 0.25, PY1]])
      box(M.wood, x0, y0, F, x1, y1, F + 0.9, 'b')
  }

  // ---- Main storey: 7 bays × 7, white walls, doors in the front's middle
  // three bays, lattice windows high on the others.
  const xs = [-19, -13.6, -8.4, -2.8, 2.8, 8.4, 13.6, 19], ys = [-17.5, -12.3, -7.2, -2.4, 2.4, 7.2, 12.3, 17.5]
  const yc = 3.0
  const M1 = placed(M, 0, 0, yc)
  const P1: HanokParts = { roof: M1.tile, stone: M1.stone, red: M1.plaster, green: M1.wood, teal: M1.wood, lattice: M1.wood }
  const C1: HanokParts = { ...P1, red: M1.wood }
  const L1 = 11.0
  box(M1.win, -2.6, ys[0] - 0.12, F + 0.3, 2.6, ys[0] - 0.05, L1 - 2.2, 'tb')
  storey(P1, xs, ys, F, L1 - 1.0, L1, (side, bay, n) => (side === 's' && bay >= 2 && bay <= n - 3 ? 'door' : side === 's' || side === 'e' || side === 'w' ? 'high' : 'wall'), { panes: 2 })
  columns(C1, xs, ys, F, L1, 0.5, { n: S.detail ? 12 : 4 })
  const B1 = 13.8
  if (S.detail) brackets(C1, xs, ys, L1, B1, { per: 1, depth: 2.2, width: 0.6, tiers: 3 })
  else {
    box(M1.wood, xs[0], ys[0], L1, xs[7], ys[7], B1, 'tb')
    box(M1.wood, xs[0] - 1.4, ys[0] - 1.4, B1 - 1.2, xs[7] + 1.4, ys[7] + 1.4, B1, 't')
  }
  // Lower roof: the skirt up to the upper storey.
  const UX = 14.0, UY = 13.0, U0 = 17.0
  jroof({ ...PR, roof: M1.tile, stone: M1.tile, red: M1.wood, teal: M1.wood, edge: M1.wood }, { coarse: S.detail ? false : 2, noHips: !S.detail,
    kind: 'skirt', ex: 24.2, ey: 23.0, ze: 14.4, gx: UX + 0.5, gy: UY + 0.5, zg: U0,
    lift: 1.0, flare: 0.8, sag: 0.3, th: 0.75, pow: 2.2, soffit: { bx: 19 + 1.6, by: 17.5 + 1.6, zb: B1 },
    hipRidge: { w: 0.5, h: 0.45 },
  })
  if (S.detail) for (const s of [-1, 1]) {
    rafterEnds(M1.wood, [-19.5, s * 22.6, 13.6], [19.5, s * 22.6, 13.6], 0.7, 0.2, 0.2, 0.3, [0, s, 0])
    rafterEnds(M1.wood, [s * 23.8, -18.5, 13.6], [s * 23.8, 18.5, 13.6], 0.7, 0.2, 0.2, 0.3, [s, 0, 0])
  }

  // ---- Upper storey: balcony, white walls, brackets, the great roof ------
  const uxs = [-UX, -8.4, -2.8, 2.8, 8.4, UX], uys = [-UY, -7.8, -2.6, 2.6, 7.8, UY]
  box(M1.wood, -UX - 1.3, -UY - 1.3, U0, UX + 1.3, UY + 1.3, U0 + 0.35, 'b')
  if (S.detail) for (const [a, b] of [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]] as number[][][])
    bar(M1.wood, [[a[0] * (UX + 1.15), a[1] * (UY + 1.15), U0 + 1.2], [b[0] * (UX + 1.15), b[1] * (UY + 1.15), U0 + 1.2]], 0.2, 0.15, 0.85, true, false)
  else box(M1.wood, -UX - 1.2, -UY - 1.2, U0 + 0.35, UX + 1.2, UY + 1.2, U0 + 1.15, 'b')
  const L2 = 21.5, B2 = 23.6
  storey(P1, uxs, uys, U0 + 0.35, L2 - 0.9, L2, () => 'high', { panes: 3 })
  columns(C1, uxs, uys, U0 + 0.35, L2, 0.42, { n: S.detail ? 10 : 4 })
  if (S.detail) brackets(C1, uxs, uys, L2, B2, { per: 1, depth: 2.0, width: 0.55, tiers: 3 })
  else {
    box(M1.wood, -UX, -UY, L2, UX, UY, B2, 'tb')
    box(M1.wood, -UX - 1.3, -UY - 1.3, B2 - 1.0, UX + 1.3, UY + 1.3, B2, 't')
  }
  const ZR = 31.0
  jroof({ ...PR, roof: M1.tile, stone: M1.tile, red: M1.wood, teal: M1.wood, edge: M1.wood }, { coarse: !S.detail,
    kind: 'paljak', ex: 20.2, ey: 19.0, ze: 24.2, gx: 13.0, gy: 6.4, zg: 27.4, zr: ZR, rx: 11.2,
    lift: 1.0, flare: 0.8, sag: 0.5, th: 0.8, pow: 2.2,
    soffit: { bx: UX + 1.5, by: UY + 1.5, zb: B2 },
    ridge: { h: 1.0, w: 1.0 }, ridgeSag: 0.12, hipRidge: { w: 0.5, h: 0.45 },
  })
  // Gable: white boards and a gilt fitting at the peak.
  for (const e of [-1, 1]) {
    rbox(M1.gold, e * 11.9, 0, 0.12, 0.9, ZR - 2.2, ZR - 0.9)
    // The shibi: a gilt fish tail standing on the ridge end, curling inward.
    const x = e * 11.5, z = ZR + 0.9
    if (S.detail) {
      const pts: V3[] = [[x, 0, z], [x, 0, z + 0.9], [x - e * 0.2, 0, z + 1.6], [x - e * 0.7, 0, z + 2.1], [x - e * 1.2, 0, z + 2.2], [x - e * 1.5, 0, z + 2.0]]
      bar(M1.gold, pts, 0.7, 0.45, 0.45, true, true)
      lathe(M1.gold, x + e * 0.1, 0, [[0.01, z - 0.1], [0.6, z - 0.1], [0.55, z + 0.6], [0.01, z + 0.9]], 8)
    } else {
      box(M1.gold, Math.min(x, x - e * 1.0), -0.35, z, Math.max(x, x - e * 1.0), 0.35, z + 1.2, 'b')
      box(M1.gold, Math.min(x - e * 0.4, x - e * 1.5), -0.3, z + 1.2, Math.max(x - e * 0.4, x - e * 1.5), 0.3, z + 2.0, 'b')
    }
  }
  if (S.detail) for (const s of [-1, 1]) {
    rafterEnds(M1.wood, [-15.5, s * 18.6, 23.4], [15.5, s * 18.6, 23.4], 0.7, 0.2, 0.2, 0.3, [0, s, 0])
    rafterEnds(M1.wood, [s * 19.8, -14.5, 23.4], [s * 19.8, 14.5, 23.4], 0.7, 0.2, 0.2, 0.3, [s, 0, 0])
  }

  const lit = (k: number) => (p: V3, n: V3) => (p[2] < 0.5 ? 0 : n[2] > 0.6 ? 0.3 * k : k)
  const parts: Mat[] = [
    { part: R.tile, material: finish('roof-tile', 0x575b61) },
    { part: R.wood, material: { ...finish('timber-brown', 0x6e4a3e), floodlight: lit(0.8) } },
    { part: R.plaster, material: { ...finish('white-plaster', 0xece8de), floodlight: lit(0.9) } },
    { part: R.stone, material: finish('granite', 0xcfcac0) },
    { part: R.gold, material: { ...finish('gilt', 0xd4ab4f), floodlight: lit(1) } },
    { part: R.win, material: PALETTE.window },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { bearing: 6.5, elevation: 0, height: 33.0, osm: 'way/751591140' }
  await save('Zōjō-ji Daiden', build({ detail: false }), 'tokyo-zojoji.glb', 6500, 250_000, extras)
  await save('Zōjō-ji Daiden', build({ detail: true }), 'tokyo-zojoji.detail.glb', 40_000, 1536 * 1024, extras)
}
