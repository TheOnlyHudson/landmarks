/**
 * Doha Tower (Burj Qatar, Burj Doha), West Bay, Doha (Ateliers Jean Nouvel,
 * 2012) — original procedural geometry, CC0-1.0.
 * bun generators/doha-tower.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/doha-tower.glb (low, ≤ 6,500 triangles): the screen as a real
 *   shell standing 1 m proud of the glass, cut with large octagonal openings;
 * - models/doha-tower.detail.glb (from zoom 16, ≤ 40,000): the same screen
 *   at a finer, staggered pattern, with reveals through its depth.
 *
 * Frame: map frame (bearing 0; the tower is round). Origin = centre of the
 * OSM tower part way/153463305 (51.5283457, 25.3174308).
 *
 * Evidence
 * - OSM way/153463305 (building:part "Doha Tower", height 205, 44 levels):
 *   a circle 50.4 m across — the screen's outer diameter here. Its podium
 *   outline way/1473564907 (building=office, a circle 79 m across, no
 *   height) is drawn as a 5 m ring and replaced.
 * - Published (CTBUH; Wikipedia "Doha Tower"): 238 m to the tip, 46 floors,
 *   completed 2012; a cylinder with a domed top and a spire, wrapped in an
 *   aluminium sun screen of layered mashrabiya patterns over blue glass.
 * - Photos (EVIDENCE):
 *   Rami Mansour, "Doha Tower" (CC BY 2.0) — the whole tower from the
 *     Corniche, little perspective: the bullet profile, dome and spire,
 *     https://www.flickr.com/photos/90186311@N03/8333623360 and
 *     https://www.flickr.com/photos/90186311@N03/8333618026 (closer);
 *   Marco Zanferrari, "Zoom on Burj Qatar" and "Burj Qatar" (CC BY-SA 2.0) — the screen pattern close up and under
 *     construction, https://www.flickr.com/photos/13808203@N02/4000683810 and /4000683784;
 *   Paul Keller, "doha skyline" (CC BY 2.0) — the dome and spire, https://www.flickr.com/photos/18259771@N00/5114619419;
 *   mattk1979, "Burj Doha - Qatar" (CC BY-SA 2.0) — night, the screen lit gold, https://www.flickr.com/photos/24879135@N04/33318888968.
 *
 * Profile (estimated from Mansour's full view, scaled to 238 m with the
 * spire's 26 m from the same photo, and to OSM's 25.2 m radius): the screen
 * radius 24.6 m at the foot, 25.2 m from 60 to 120 m, easing in to 21 m at
 * 175 m, then the bullet dome closing at 212 m; the spire from 212 to 238 m.
 * The real screen is ~1 m outside the glass; here the glass is drawn 1.2 m
 * inside the screen. The screen pattern (layered stars and circles) is drawn
 * as staggered octagonal openings (detail; a third of the cell) or small
 * diamonds (low; 15% of the cell), the solid dominating as in the photos: 22 × 26 cells in the low model, 28 × 36
 * (detail).
 * Colour: the screen is silver aluminium (sunlit #8a8a88 under a hazy sky,
 * shaded #415160 where the blue glass shows through), drawn #bfc1c2; the
 * glass behind dark blue-grey #46505c, so the small openings read as shadow
 * and the whole reads as uniform silver-grey aluminium by day, as in the photos. At night the screen is lit gold from within:
 * the glass is `window`, so it glows through the openings.
 *
 * Doubts: the podium ring's height is estimated (no photo shows it clearly
 * past the palms); the profile rests on one distant photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { lathe, otri, writeModel, type Mat } from './doha-museum-of-islamic-art'

const ANCHOR = { lng: 51.5283457, lat: 25.3174308 }
const TOP = 212, TIP = 238

/** Screen radius at height h. */
const HS = 163, RS = 23.6
const PROFILE: [number, number][] = [[0, 24.6], [30, 24.9], [60, 25.2], [120, 25.2], [145, 24.6], [HS, RS],
  ...Array.from({ length: 12 }, (_, k) => { const h = HS + ((TOP - HS) * (k + 1)) / 12; const t = (h - HS) / (TOP - HS); return [h, RS * Math.sqrt(Math.max(0, 1 - t * t))] as [number, number] })]
function R(h: number) {
  for (let i = 0; i + 1 < PROFILE.length; i++) {
    const [h0, r0] = PROFILE[i], [h1, r1] = PROFILE[i + 1]
    if (h <= h1) { const t = (h - h0) / (h1 - h0), s = h0 >= HS ? t : t * t * (3 - 2 * t); return r0 + (r1 - r0) * (i === 0 ? t : s) }
  }
  return 0
}

function build(detail: boolean): Mat[] {
  const screen = new Part(), glass = new Part(), spire = new Part(), podium = new Part(), podGlass = new Part()
  const GAP = 1.2

  // the blue glass body
  const prof: [number, number][] = []
  for (let h = 0; h < TOP - 3; h += detail ? 4 : 8) prof.push([Math.max(0.5, R(h) - GAP), h])
  prof.push([0, TOP - GAP - 0.5])
  lathe(glass, 0, 0, prof, detail ? 40 : 20, true)

  // the screen: cells between h0 and the dome, each a frame round an octagonal opening
  const N = detail ? 28 : 22, H0 = 6, H1 = detail ? 204 : 196
  const rows = detail ? 36 : 26
  const hs = (k: number) => H0 + ((H1 - H0) * k) / rows
  const depth = 0.5
  // smooth radial normals, so neighbouring cells share their corners in the GLB
  const rn = (p: V3): V3 => { const l = Math.hypot(p[0], p[1]) || 1; return [p[0] / l, p[1] / l, 0] }
  const S = (a: V3, b: V3, c: V3) => screen.tri(a, b, c, [0, 0], [0, 0], [0, 0], [rn(a), rn(b), rn(c)])
  const pt = (th: number, h: number, dr = 0): V3 => { const r = R(h) + dr; return [r * Math.cos(th), r * Math.sin(th), h] }
  for (let j = 0; j < rows; j++) {
    const h0 = hs(j), h1 = hs(j + 1), off = (j % 2) * 0.5
    // fewer, wider cells near the dome where the circumference shrinks
    const n = Math.max(6, Math.round((N * R((h0 + h1) / 2)) / 25.2))
    for (let i = 0; i < n; i++) {
      const t0 = ((i + off) * 2 * Math.PI) / n, t1 = ((i + 1 + off) * 2 * Math.PI) / n
      const P = (u: number, v: number, dr = 0) => pt(t0 + (t1 - t0) * u, h0 + (h1 - h0) * v, dr)
      const out = (u: number, v: number): V3 => { const th = t0 + (t1 - t0) * u; return [Math.cos(th), Math.sin(th), 0.15] }
      if (!detail) {
        // the low model: a diamond opening in each cell, so the screen reads as a net
        const C: [number, number][] = [[0, 0], [1, 0], [1, 1], [0, 1]], f = 0.55
        const D: [number, number][] = [[0.5, 0.5 - 0.5 * f], [0.5 + 0.5 * f, 0.5], [0.5, 0.5 + 0.5 * f], [0.5 - 0.5 * f, 0.5]]
        for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; S(P(...C[k]), P(...C[l]), P(...D[k])); S(P(...C[l]), P(...D[l]), P(...D[k])) }
        continue
      }
      // boundary of the square and the octagon at the same 8 bearings
      const m = 0.2 // bar width as a fraction of the cell
      const sq: [number, number][] = [], oc: [number, number][] = []
      for (let k = 0; k < 8; k++) {
        const a = (Math.PI / 4) * k + Math.PI / 8, c = Math.cos(a), s = Math.sin(a)
        const sc = 0.5 / Math.max(Math.abs(c), Math.abs(s))
        sq.push([0.5 + c * sc, 0.5 + s * sc]); oc.push([0.5 + c * (0.5 - m), 0.5 + s * (0.5 - m)])
      }
      // square corners between the octagon bearings, so the frame fills the cell
      const corners: [number, number][] = [[1, 1], [0, 1], [0, 0], [1, 0]]
      for (let k = 0; k < 8; k++) {
        const l = (k + 1) % 8
        S(P(...sq[k]), P(...sq[l]), P(...oc[l]))
        S(P(...sq[k]), P(...oc[l]), P(...oc[k]))
        if (k % 2 === 0) S(P(...sq[k]), P(...corners[k / 2]), P(...sq[l]))
        if (detail) {
          const a = P(...oc[k]), b = P(...oc[l]), c2 = P(...oc[l], -depth), d = P(...oc[k], -depth)
          const ctr = P(0.5, 0.5)
          const toC = (p: V3): V3 => { const v: V3 = [ctr[0] - p[0], ctr[1] - p[1], ctr[2] - p[2]]; const q = Math.hypot(...v) || 1; return [v[0] / q, v[1] / q, v[2] / q] }
          screen.tri(a, b, c2, [0, 0], [0, 0], [0, 0], [toC(a), toC(b), toC(b)])
          screen.tri(a, c2, d, [0, 0], [0, 0], [0, 0], [toC(a), toC(b), toC(a)])
        }
      }
    }
  }
  // the dome cap above the patterned zone: solid aluminium, and its foot ring
  {
    const p: [number, number][] = []
    for (let h = H1; h < TOP; h += 2) p.push([R(h), h])
    p.push([0, TOP])
    lathe(screen, 0, 0, p, detail ? 40 : 20, true)
    // the plain band at the foot, under the pattern
    lathe(screen, 0, 0, [[R(H0) - 0.02, 4.5], [R(H0) - 0.02, H0]], detail ? 40 : 20, true)
  }
  // the spire
  lathe(spire, 0, 0, [[2.2, TOP - 1.5], [1.6, TOP + 2], [0.9, TOP + 10], [0.35, TIP - 2], [0, TIP]], detail ? 12 : 8, true)

  // the podium ring (OSM way/1473564907): a 5 m glazed ring round the foot
  lathe(podGlass, 0, 0, [[38.4, 0], [38.4, 4.0]], detail ? 48 : 24, true)
  lathe(podium, 0, 0, [[39.2, 4.0], [39.2, 5.0], [24.4, 5.0]], detail ? 48 : 24, true)

  return [
    { part: screen, material: { ...finish('doha-tower-screen', 0xbfc1c2, 0.5), floodlight: (p: V3, n: V3) => (n[2] > 0.9 ? 0.2 : 0.55) } },
    { part: glass, material: { ...PALETTE.window, color: 0x46505c } },
    { part: spire, material: finish('doha-tower-spire', 0xd9dbdc, 0.4) },
    { part: podium, material: PALETTE.stone },
    { part: podGlass, material: { ...PALETTE.entrance, name: 'entrance' } },
  ]
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: 0, height: TIP }
  await writeModel('doha-tower.glb', 'Doha Tower', build(false), 6500, 250 * 1024, extras)
  await writeModel('doha-tower.detail.glb', 'Doha Tower', build(true), 40000, 1536 * 1024, extras)
}
