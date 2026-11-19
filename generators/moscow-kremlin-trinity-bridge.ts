/**
 * Trinity Bridge (Troitsky Most), Moscow Kremlin: procedural, CC0-1.0.
 * bun generators/moscow-kremlin-trinity-bridge.ts
 *
 * The brick bridge of 1516 from the Kutafya Tower over the Alexander
 * Garden (once the Neglinnaya river) to the gate of the Trinity Tower, the
 * public way into the Kremlin. Its identifying features, each in the
 * photos below:
 * - the long brick deck on arches, rising gently to the Trinity gate;
 * - solid parapets on both sides crowned with small swallowtail merlons;
 * - the cobbled walkway between them.
 *
 * Frame: the kit's (x east, y north, z up, metres), turned to bearing
 * 13.93 so the bridge runs along +x from the Kutafya Tower (x = -43.6) to
 * the Trinity Tower's gate block (x = 43.7). Anchor midway between the
 * ends of OSM relation/7707305 (man_made=bridge, 87.3 m long, 9.6-12.3 m
 * wide), whose outline is drawn as mapped (simplified to 0.3 m, without
 * the notches where it meets the Kutafya Tower). The model draws the
 * whole structure inside that outline, walkway included, as
 * docs/reference.md asks of a walking deck.
 *
 * Heights. OSM's parts (API map call, 2026-11-18; relation/3062894 the
 * masonry, 3047663 and 3047665 the body to 5 m, 3047661 the parapets 5-7.5
 * m, and 96 merlon parts 7.5-9 m). The photos on the bridge show a parapet
 * about 1.3 m over the walkway, so the walkway is set at 6.2 m over the
 * map's terrain (z12, read every 10 m, which rises 4 m along the bridge),
 * the parapets' top at 7.5 m and the merlons (1.0 m wide, 0.5 m thick, one
 * every 1.7 m as in the close photo of them) to 9 m. Seven arches a side,
 * their crowns 1.2 m under the walkway, from the painting and the arch
 * photo. A doubt: the garden under the bridge lies lower than the map's
 * coarse terrain shows.
 *
 * Photos (Wikimedia Commons):
 * - "Merlons of Troitsky Bridge in Moscow Kremlin.jpg", Dmitry Ivanov., CC BY-SA 4.0
 * - "Moscow Kremlin, Troitskaya tower and Troitsky bridge (2012).jpg", jimmyweee, CC BY 2.0 (on the bridge, east)
 * - "Moscow, Troitsky Bridge arch (46893417781).jpg", Andrey Filippov, CC BY 2.0 (an arch, from the garden)
 * - "Troitsky bridge (Kremlin, 2020) by shakko 01.jpg" and "... 02.jpg", shakko, CC BY-SA 4.0 (on the bridge, east and west)
 * - "Kremlin Viewed from Gardens - Moscow - Russia.JPG", Adam Jones, CC BY-SA 3.0 (the parapet from below)
 * - "Vasnetsov V Osadu Troitsky Most.jpg", Apollinary Vasnetsov, public domain (the arches, as reconstructed)
 */
import { Kit, groundAt, save, type Ground, type XY } from './moscow-kremlin-towers-kit'
import { PALETTE } from './palette'

/** Mapterhorn z12 in this frame (heights relative to the lowest in the table), rows along y, 10 m apart. */
const GROUND: Ground = {"y0": -70.0, "x0": -70.0, "step": 10.0, "z": [[2.2, 1.1, 0.8, 0.6, 0.7, 1.3, 1.9, 2.4, 2.9, 3.3, 3.8, 4.2, 4.7, 5.4, 6.5], [2.0, 1.0, 0.4, 0.4, 0.5, 0.9, 1.5, 2.2, 3.0, 3.4, 3.7, 3.8, 4.4, 5.3, 6.7], [2.2, 1.2, 0.3, 0.0, 0.3, 0.6, 1.2, 2.0, 2.8, 3.2, 3.5, 3.9, 4.4, 5.3, 6.7], [2.2, 1.0, 0.3, 0.2, 0.3, 0.3, 0.8, 1.8, 2.5, 3.1, 3.6, 4.0, 4.6, 5.7, 7.1], [2.3, 1.5, 0.9, 0.6, 0.5, 0.5, 0.9, 1.6, 2.3, 3.2, 3.7, 4.4, 5.1, 6.1, 7.5], [2.5, 1.8, 1.3, 1.0, 1.0, 1.0, 1.4, 1.8, 2.5, 3.4, 4.2, 5.0, 5.6, 6.5, 7.7], [3.3, 2.6, 1.9, 1.7, 1.8, 1.7, 1.9, 2.3, 2.8, 3.6, 4.5, 5.4, 6.0, 6.7, 8.0], [3.6, 3.0, 2.6, 2.4, 2.3, 2.2, 2.5, 2.7, 3.2, 4.1, 5.1, 5.8, 6.4, 6.9, 8.0], [3.8, 3.4, 3.0, 2.9, 2.8, 2.7, 2.8, 2.8, 3.7, 4.5, 5.5, 6.1, 6.5, 7.0, 7.8], [3.9, 3.7, 3.5, 3.4, 3.2, 3.0, 2.8, 3.0, 3.9, 4.8, 5.5, 6.1, 6.3, 6.7, 7.5], [4.1, 3.8, 3.8, 3.8, 3.5, 3.2, 2.9, 3.0, 3.7, 4.6, 5.2, 5.7, 5.9, 6.4, 7.3], [4.5, 4.0, 3.9, 3.8, 3.7, 3.4, 3.0, 2.8, 3.5, 4.3, 4.8, 5.3, 5.5, 6.0, 7.1], [4.6, 4.3, 4.2, 3.8, 3.8, 3.3, 2.9, 2.8, 3.3, 3.9, 4.2, 4.4, 4.9, 5.8, 6.8], [4.5, 4.3, 4.1, 3.8, 3.7, 3.2, 2.8, 2.5, 3.0, 3.6, 3.8, 3.9, 4.6, 5.6, 6.6], [4.4, 4.3, 4.0, 3.6, 3.4, 2.8, 2.4, 2.5, 2.9, 3.3, 3.3, 3.8, 4.4, 5.3, 6.4]]}
/** OSM relation/7707305's long sides in this frame, from the Kutafya end to the Trinity end. */
const SOUTH: XY[] = [[-43.7, -6.1], [-2.1, -5.35], [2.91, -5.3], [6.83, -5.2], [43.45, -4.51]]
const NORTH: XY[] = [[-43.41, 6.15], [-3.19, 5.3], [-1.44, 5.37], [3.28, 5.3], [7.03, 5.24], [36.63, 4.67], [43.81, 4.54]]

export function build() {
  const k = new Kit([0, 0], { materials: { green: { ...PALETTE.roof, name: 'roof' } } })
  const at = (p: XY[], x: number): number => {
    for (let i = 1; i < p.length; i++) if (x <= p[i][0]) return p[i - 1][1] + ((p[i][1] - p[i - 1][1]) * (x - p[i - 1][0])) / (p[i][0] - p[i - 1][0])
    return p[p.length - 1][1]
  }
  const xs: number[] = []
  for (let x = -43.6; x < 43.6; x += 3.0) xs.push(x)
  xs.push(43.6)
  const g0 = Math.min(...xs.flatMap((x) => [groundAt(GROUND, x, at(SOUTH, x)), groundAt(GROUND, x, at(NORTH, x))]))
  const G = (x: number, y: number) => groundAt(GROUND, x, y) - g0
  const deck = (x: number) => {
    const t = (x + 43.6) / 87.2
    return (1 - t) * (G(-43.6, 0) + 6.2) + t * (G(43.6, 0) + 6.2)
  }
  const PH = 1.3, PT = 0.5
  // Side walls from the ground to the parapet's top, and the parapets' inner faces and tops.
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i], b = xs[i + 1]
    const sa: XY = [a, at(SOUTH, a)], sb: XY = [b, at(SOUTH, b)], na: XY = [a, at(NORTH, a)], nb: XY = [b, at(NORTH, b)]
    k.quad('brick', k.v(sa, G(...sa)), k.v(sb, G(...sb)), k.v(sb, deck(b) + PH), k.v(sa, deck(a) + PH), [0, -1, 0])
    k.quad('brick', k.v(nb, G(...nb)), k.v(na, G(...na)), k.v(na, deck(a) + PH), k.v(nb, deck(b) + PH), [0, 1, 0])
    const si = (p: XY): XY => [p[0], p[1] + PT], ni = (p: XY): XY => [p[0], p[1] - PT]
    k.quad('brick', k.v(si(sa), deck(a)), k.v(si(sa), deck(a) + PH), k.v(si(sb), deck(b) + PH), k.v(si(sb), deck(b)), [0, 1, 0])
    k.quad('brick', k.v(ni(nb), deck(b)), k.v(ni(nb), deck(b) + PH), k.v(ni(na), deck(a) + PH), k.v(ni(na), deck(a)), [0, -1, 0])
    k.quad('brick', k.v(sa, deck(a) + PH), k.v(sb, deck(b) + PH), k.v(si(sb), deck(b) + PH), k.v(si(sa), deck(a) + PH), [0, 0, 1])
    k.quad('brick', k.v(nb, deck(b) + PH), k.v(na, deck(a) + PH), k.v(ni(na), deck(a) + PH), k.v(ni(nb), deck(b) + PH), [0, 0, 1])
    // The cobbled walkway.
    k.quad('green', k.v(si(sa), deck(a)), k.v(si(sb), deck(b)), k.v(ni(nb), deck(b)), k.v(ni(na), deck(a)), [0, 0, 1])
  }
  // End walls where the bridge meets the towers.
  for (const x of [-43.6, 43.6]) {
    const s: XY = [x, at(SOUTH, x)], n: XY = [x, at(NORTH, x)]
    k.quad('brick', k.v(s, G(...s)), k.v(n, G(...n)), k.v(n, deck(x)), k.v(s, deck(x)), [x < 0 ? -1 : 1, 0, 0])
  }
  // Seven arches a side.
  for (let i = 0; i < 7; i++) {
    const xc = -36 + i * 12.0
    for (const side of [SOUTH, NORTH]) {
      const y = at(side, xc), e: XY = side === SOUTH ? [1, 0] : [-1, 0]
      const z0 = Math.max(G(xc - 3, y), G(xc + 3, y))
      k.panel([xc, y], e, z0, deck(xc) - 1.2, Math.min(7.0, 2 * (deck(xc) - 1.2 - z0) - 0.4), 'round', 'dark', 0.06)
    }
  }
  // Merlons on both parapets, facing out.
  for (let x = -42.6; x <= 42.8; x += 1.7) {
    k.merlon([x, at(SOUTH, x)], [1, 0], deck(x) + PH, 1.0, 1.5, PT)
    k.merlon([x, at(NORTH, x)], [-1, 0], deck(x) + PH, 1.0, 1.5, PT)
  }
  return k
}

if (import.meta.main) await save('moscow-kremlin-trinity-bridge', 'Trinity Bridge', build(), 6500)
