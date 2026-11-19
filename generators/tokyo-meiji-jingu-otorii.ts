/**
 * The Ōtorii (大鳥居, the great torii) on Meiji Jingu's approach, Yoyogi,
 * Tokyo (1975, Taiwanese cypress) — procedural, CC0-1.0.
 * bun generators/tokyo-meiji-jingu-otorii.ts
 *
 * Writes models/tokyo-meiji-jingu-otorii.glb (low) and
 * models/tokyo-meiji-jingu-otorii.detail.glb (detail: round pillars with
 * their tapered bases, the wedges through the nuki, the three gilt
 * chrysanthemum crests, the kasagi's copper capping).
 *
 * Built with the kit exported from tokyo-meiji-jingu.ts (the shrine itself
 * is tokyo-meiji-jingu, 200 m north-west).
 *
 * Map frame: x east, y north, z up, metres, turned so the kasagi runs along
 * x: OSM way/469908912 (大鳥居, building=roof, height 12, width 17.1) has
 * its long sides at 176.3°, so the catalog bearing is 86.3 and the path
 * passes through along y. Origin: that outline's centroid (139.7013085,
 * 35.6740966).
 *
 * Identity: a myōjin torii of unpainted, weathered cypress — two great
 * round pillars, the double top beam (kasagi over shimaki) curving up at
 * its ends, the tie beam (nuki) running out past the pillars, the short
 * central strut (gakuzuka) and three gilt chrysanthemum crests on the
 * shimaki.
 *
 * Evidence:
 *  - OSM way/469908912: the kasagi's plan, 17.3 × 1.4 m; height 12;
 *    width 17.1. Published (ja.wikipedia 明治神宮; the shrine's own
 *    description of the second torii): 12 m high, 17.1 m kasagi, pillars
 *    1.2 m across, 9.1 m apart, the largest wooden myōjin torii in Japan.
 *  - within (scaled from Saint-Rambert's level front view, the pillar
 *    spacing 9.1 m = 45 px/m): nuki 7.8-8.6, out to ±7.4; shimaki
 *    10.2-11.2; kasagi 11.2-12.0, its ends up 0.4 m; gakuzuka 0.9 m wide;
 *    crests 0.75 m across at x 0 and ±4.5.
 *  - colours: weathered cypress #b3a68f (#8c8578 in shade, #c9b89b in
 *    sun); copper capping charcoal #5d5f5c; crests gilt #d4ab4f.
 *  - night: not lit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Meiji-jingū grand torii d'entrée.jpg, Hyppolyte de Saint-Rambert, CC BY-SA 4.0 (front, level)
 *  - Meiji-jingū grand torii clair.jpg, Hyppolyte de Saint-Rambert, CC BY-SA 4.0 (kasagi, crest, close)
 * No commercial imagery. No look-only references.
 *
 * Doubts: which of the shrine's torii each Commons photo shows (both are
 * matched to this one by its proportions and setting); the kasagi's end cut
 * is simplified.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { bar, lathe, rbox, save, type Mat } from './tokyo-meiji-jingu'

type Sz = { detail: boolean }

function build(S: Sz) {
  const wood = new Part(), cap = new Part(), gold = new Part()
  const PX = 4.55, K = S.detail ? 20 : 8
  // pillars: round, slightly tapered, on a short base
  for (const s of [-1, 1]) {
    lathe(wood, s * PX, 0, S.detail ? [[0.75, 0], [0.75, 0.35], [0.62, 0.5], [0.6, 0.6], [0.55, 10.25]] : [[0.68, 0], [0.55, 10.25]], K)
  }
  // nuki through the pillars, with wedges
  rbox(wood, 0, 0, 7.4, 0.42, 7.8, 8.6, 0, '')
  if (S.detail) for (const s of [-1, 1]) for (const e of [-1, 1]) rbox(wood, s * PX + e * 0.85, -0.5, 0.18, 0.08, 8.0, 8.8, 0, '')
  // gakuzuka
  rbox(wood, 0, 0, 0.45, 0.35, 8.6, 10.2, 0, 'tb')
  // shimaki and kasagi, the kasagi's ends turned up
  const curve = (x: number) => 0.42 * Math.pow(Math.abs(x) / 8.55, 2.2)
  const xs = S.detail ? [-8.55, -7.5, -6, -4, -2, 0, 2, 4, 6, 7.5, 8.55] : [-8.55, -6, 0, 6, 8.55]
  rbox(wood, 0, 0, 7.6, 0.55, 10.2, 11.2, 0, '')
  bar(wood, xs.map((x) => [x, 0, 11.2 + curve(x)] as V3), 1.4, 0.7, 0.0, true, true)
  bar(cap, xs.map((x) => [x * 1.003, 0, 11.9 + curve(x)] as V3), 1.46, 0.12, 0.0, true, false)
  // three gilt crests on the shimaki's faces
  for (const x of [-4.5, 0, 4.5]) for (const s of [-1, 1]) {
    const y = s * 0.56
    if (S.detail) {
      const n = 16, r = 0.38, z = 10.7
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, rr = i % 2 ? r : r * 0.86
        const c: V3 = [x, y + s * 0.04, z], p0: V3 = [x + rr * Math.cos(a0), y + s * 0.02, z + rr * Math.sin(a0)], p1: V3 = [x + r * Math.cos(a1), y + s * 0.02, z + r * Math.sin(a1)]
        if (s > 0) gold.tri(c, p1, p0); else gold.tri(c, p0, p1)
      }
    } else rbox(gold, x, y, 0.36, 0.03, 10.35, 11.05, 0, '')
  }
  const parts: Mat[] = [
    { part: wood, material: finish('cypress-weathered', 0xb3a68f) },
    { part: cap, material: finish('copper-capping', 0x5d5f5c) },
    { part: gold, material: finish('gilt', 0xd4ab4f) },
  ]
  return parts
}

if (import.meta.main) {
  const extras = { bearing: 86.3, elevation: 0, height: 12.4, osm: 'way/469908912' }
  await save('Meiji Jingu Ōtorii', build({ detail: false }), 'tokyo-meiji-jingu-otorii.glb', 6500, 250_000, extras)
  await save('Meiji Jingu Ōtorii', build({ detail: true }), 'tokyo-meiji-jingu-otorii.detail.glb', 40_000, 1536 * 1024, extras)
}
