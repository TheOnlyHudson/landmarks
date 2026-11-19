/**
 * Sangedatsumon (三解脱門, the Sanmon) of Zōjō-ji, Shiba, Tokyo (1622,
 * Important Cultural Property) — procedural, CC0-1.0.
 * bun generators/tokyo-zojoji-sanmon.ts
 *
 * Writes models/tokyo-zojoji-sanmon.glb (low) and
 * models/tokyo-zojoji-sanmon.detail.glb (detail: bracket sets, round
 * columns, balcony railing, rafter ends, finer roof curves).
 *
 * Built with the shrine/temple kit exported from tokyo-meiji-jingu.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to the gate's axis:
 * OSM way/30516556's sides run at 6.7° / 96.7°, so the catalog bearing is
 * 6.7. Origin: that outline's centroid (139.7499997, 35.6572607). The gate
 * faces east onto Hibiya-dōri, 150 m in front of the Daiden
 * (tokyo-zojoji); it is drawn in its own frame, front to -y, and turned a
 * quarter turn.
 *
 * Identity, in order: a vermilion two-storey Zen gate (nijūmon), five bays
 * wide with three open passages, under two broad grey tiled roofs — a
 * lower pent roof and an upper hip-and-gable roof — the balcony with its
 * vermilion railing round the upper storey; the dark bracket zones under
 * both eaves; the round columns on black stone bases.
 *
 * Evidence:
 *  - OSM way/30516556 (三解脱門, height 21, 1622): 28.4 × 16.8 m, taken as
 *    the eaves; height 21 m published (ja.wikipedia 増上寺: 三解脱門, 高さ
 *    21 m, 5 bays, 3 passages, 2 storeys, irimoya, hongawara tile; the OSM
 *    roof:shape "gabled" is wrong, every photo shows hip-and-gable).
 *  - heights within (estimates, scaled from KENPEI's front view against
 *    the 21 m total): columns to 5.8, bracket band to 7.8, lower eave 8.3;
 *    upper floor and balcony 9.6-10.8; upper wall to 12.6, brackets to
 *    14.2, upper eave 14.8, gable foot 17.9, ridge 20.0, its cap to 21.0.
 *    Review round 2: both roofs run the full 30 m of the eaves with longer
 *    ridges (the upper ridge ±10.2), so the gate reads ~1.5:1 wide to tall
 *    as in KENPEI's front view.
 *    Plan: columns 6 × 3 at 4.2 m (21.0 × 9.4 m), the upper storey
 *    19.0 × 7.6 m, both roofs out to the outline.
 *  - colours (daylight photos, pulled to the palette): vermilion #a63d2e
 *    (re-sampled: #9f382a-#b0412f in sun); tile dark charcoal #55595e; the bracket zones dark #5d4640; column
 *    bases and plinth dark granite #8f8c87; the board's gilt.
 *  - night: lit from the street; a modest floodlight on the vermilion.
 *  - terrain: see the report; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Zojo-ji sanmon.jpg, KENPEI, CC BY-SA 3.0 (front, east)
 *  - Sangedatsumon (4082946574).jpg, Yoshikazu TAKADA, CC BY 2.0 (passage, columns)
 *  - Tokyo Zōjō-ji Sangedatsu-mon gate seen from the main temple.jpg, Ymblanter, CC BY-SA 4.0 (back, west, far)
 * No commercial imagery. No look-only references.
 *
 * Left out: the Shaka triad and the sixteen rakan inside the upper storey,
 * the stairs' side towers (sanrō) at the ends, the gate's doors.
 * Doubts: the back (west) and the ends are only seen far off; the upper
 * storey's windows are drawn as dark panels; heights are photo-scaled.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, bar, prism, columns, brackets, jroof, rafterEnds, placed, save, type HanokParts, type Mat } from './tokyo-meiji-jingu'

type Sz = { detail: boolean }

function build(S: Sz) {
  const R = { verm: new Part(), tile: new Part(), dark: new Part(), stone: new Part(), gold: new Part() }
  const M = placed(R, Math.PI / 2, 0, 0)
  const PC: HanokParts = { roof: M.tile, stone: M.stone, red: M.verm, green: M.verm, teal: M.dark, lattice: M.dark }
  const PR: HanokParts & { edge: Part } = { roof: M.tile, stone: M.tile, red: M.verm, green: M.verm, teal: M.dark, lattice: M.dark, edge: M.verm }

  // Plinth and its steps.
  box(M.stone, -12.8, -6.2, 0, 12.8, 6.2, 0.5, 'b')
  for (const s of [-1, 1]) box(M.stone, -11, s > 0 ? 6.2 : -7.0, 0, 11, s > 0 ? 7.0 : -6.2, 0.25, 'b')
  // Lower storey: 5 bays × 2; the middle three open, the end bays closed.
  const xs = [-10.5, -6.3, -2.1, 2.1, 6.3, 10.5], ys = [-4.7, 0, 4.7]
  const C = 5.8, B1 = 7.8
  columns(PC, xs, ys, 0.5, C, 0.55, { base: 0.5, n: S.detail ? 12 : 6 })
  for (const x of [-2.1, 2.1]) box(M.stone, x - 0.8, -0.8, 0.5, x + 0.8, 0.8, 1.0, 'b')
  for (const x of [-2.1, 2.1]) prism(M.verm, x, 0, 1.0, C, 0.55, 0.52, S.detail ? 12 : 6)
  // End bays: vermilion walls with dark grilles (the Niō behind), front and back.
  for (const e of [-1, 1]) {
    const x0 = Math.min(e * 6.3, e * 10.5), x1 = Math.max(e * 6.3, e * 10.5)
    box(M.verm, x0, -0.25, 0.5, x1, 0.25, C - 0.8, 'b')
    for (const s of [-1, 1]) {
      const y = s * 4.75
      box(M.verm, x0 + 0.4, y - 0.15, 0.5, x1 - 0.4, y + 0.15, 1.6, 'b')
      box(M.dark, x0 + 0.5, y - 0.1, 1.6, x1 - 0.5, y + 0.1, C - 1.4, 'b')
    }
    box(M.verm, x0, -4.85, C - 1.4, x1, 4.85, C - 0.8, 'b')
  }
  // Tie beams, then the dark bracket zone up to the lower eave.
  box(M.verm, -10.9, -5.1, C - 0.8, 10.9, 5.1, C, 'b')
  if (S.detail) brackets(PC, xs, [-4.7, 4.7], C, B1, { per: 1, depth: 2.0, width: 0.6, tiers: 3 })
  else {
    box(M.dark, -10.5, -4.7, C, 10.5, 4.7, B1, 'tb')
    box(M.verm, -12.2, -6.4, B1 - 0.6, 12.2, 6.4, B1, 't')
  }
  // Lower (pent) roof up to the upper storey.
  const UX = 10.0, UY = 3.8, U0 = 9.6
  jroof(PR, { coarse: S.detail ? false : 2, noHips: !S.detail,
    kind: 'skirt', ex: 15.0, ey: 8.6, ze: 8.3, gx: UX + 0.9, gy: UY + 0.9, zg: U0,
    lift: 0.8, flare: 0.8, sag: 0.25, th: 0.45, pow: 2.2, soffit: { bx: 10.5 + 1.8, by: 4.7 + 1.8, zb: B1 },
    hipRidge: { w: 0.45, h: 0.4 },
  })
  if (S.detail) for (const s of [-1, 1]) {
    rafterEnds(M.verm, [-11.5, s * 8.3, 7.6], [11.5, s * 8.3, 7.6], 0.6, 0.18, 0.18, 0.3, [0, s, 0])
    rafterEnds(M.verm, [s * 14.7, -5.5, 7.6], [s * 14.7, 5.5, 7.6], 0.6, 0.18, 0.18, 0.3, [s, 0, 0])
  }
  // Balcony deck and railing.
  box(M.verm, -UX - 1.6, -UY - 1.6, U0, UX + 1.6, UY + 1.6, U0 + 0.3, 'b')
  if (S.detail) {
    for (const [a, b] of [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]] as number[][][]) {
      const P0: V3 = [a[0] * (UX + 1.45), a[1] * (UY + 1.45), U0 + 1.15], P1: V3 = [b[0] * (UX + 1.45), b[1] * (UY + 1.45), U0 + 1.15]
      bar(M.verm, [P0, P1], 0.2, 0.14, 0.85, true, false)
      const L = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]), n = Math.round(L / 1.8)
      for (let i = 0; i <= n; i++) { const x = P0[0] + (P1[0] - P0[0]) * i / n, y = P0[1] + (P1[1] - P0[1]) * i / n; box(M.verm, x - 0.09, y - 0.09, U0 + 0.3, x + 0.09, y + 0.09, U0 + 1.15, 'b') }
    }
  } else box(M.verm, -UX - 1.5, -UY - 1.5, U0 + 0.3, UX + 1.5, UY + 1.5, U0 + 1.2, 'b')
  // Upper storey: vermilion walls with a band of dark windows, the board.
  const L2 = 12.6, B2 = 14.2
  box(M.verm, -UX, -UY, U0 + 0.3, UX, UY, L2, 'b')
  for (const s of [-1, 1]) for (const [a, b] of [[-8.6, -3.4], [-2.6, 2.6], [3.4, 8.6]]) {
    const y = s * (UY + 0.04)
    const q: V3[] = [[a, y, 10.9], [b, y, 10.9], [b, y, 12.1], [a, y, 12.1]]
    if (s < 0) M.dark.quad(q[0], q[1], q[2], q[3]); else M.dark.quad(q[1], q[0], q[3], q[2])
  }
  const uxs = [-UX, -5.7, -1.9, 1.9, 5.7, UX], uys = [-UY, 0, UY]
  if (S.detail) columns(PC, uxs, uys, U0 + 0.3, L2, 0.4, { n: 10 })
  box(M.gold, -1.2, -UY - 0.3, 11.0, 1.2, -UY - 0.12, 12.2, 'b')
  if (S.detail) brackets(PC, uxs, uys, L2, B2, { per: 1, depth: 2.0, width: 0.55, tiers: 3 })
  else {
    box(M.dark, -UX, -UY, L2, UX, UY, B2, 'tb')
    box(M.verm, -UX - 1.6, -UY - 1.6, B2 - 0.6, UX + 1.6, UY + 1.6, B2, 't')
  }
  jroof(PR, { coarse: !S.detail,
    kind: 'paljak', ex: 15.0, ey: 8.6, ze: 14.8, gx: 11.0, gy: 3.4, zg: 17.9, zr: 20.0, rx: 10.2,
    lift: 0.9, flare: 0.8, sag: 0.45, th: 0.45, pow: 2.2,
    soffit: { bx: UX + 1.7, by: UY + 1.7, zb: B2 },
    ridge: { h: 0.6, w: 0.8, ornament: 0.7 }, ridgeSag: 0.1, hipRidge: { w: 0.45, h: 0.4 },
  })
  if (S.detail) for (const s of [-1, 1]) {
    rafterEnds(M.verm, [-11.5, s * 8.3, 14.1], [11.5, s * 8.3, 14.1], 0.6, 0.18, 0.18, 0.3, [0, s, 0])
    rafterEnds(M.verm, [s * 14.7, -5.5, 14.1], [s * 14.7, 5.5, 14.1], 0.6, 0.18, 0.18, 0.3, [s, 0, 0])
  }

  const lit = (k: number) => (p: V3, n: V3) => (n[2] > 0.6 ? 0.3 * k : k)
  const parts: Mat[] = [
    { part: R.verm, material: { ...finish('vermilion', 0xa63d2e), floodlight: lit(0.7) } },
    { part: R.tile, material: finish('roof-tile', 0x55595e) },
    { part: R.dark, material: finish('bracket-shadow', 0x5d4640) },
    { part: R.stone, material: finish('dark-granite', 0x8f8c87) },
    { part: R.gold, material: finish('gilt', 0xd4ab4f) },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { bearing: 6.7, elevation: 0, height: 21, osm: 'way/30516556' }
  await save('Zōjō-ji Sangedatsumon', build({ detail: false }), 'tokyo-zojoji-sanmon.glb', 6500, 250_000, extras)
  await save('Zōjō-ji Sangedatsumon', build({ detail: true }), 'tokyo-zojoji-sanmon.detail.glb', 40_000, 1536 * 1024, extras)
}
