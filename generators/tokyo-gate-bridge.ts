/**
 * Tokyo Gate Bridge (東京ゲートブリッジ; opened 2012), Koto, Tokyo:
 * procedural, CC0-1.0.  bun generators/tokyo-gate-bridge.ts
 *
 * The main bridge, the 760 m three-span continuous truss-and-box girder
 * whose two trusses face each other across the fairway like a pair of
 * dinosaurs: over each main pier a truss stands up above the deck (a long
 * sloping head reaching 155 m into the main span) and hangs below it (a
 * long shallow V over the side span, a short steep one into the main span),
 * with a plain box girder between them at mid-span. Everything is drawn as
 * open 3D members: chords, posts and diagonals in both truss planes, top
 * lateral bracing and cross frames. Writes a low model and a detail model
 * (more bracing, cross frames, the walkway railing, deck lamps), drawn from
 * zoom 16. The approach viaducts beyond the end piers are the map's.
 *
 * Frame: x across the bridge (toward bearing 138.35), y along it toward
 * Wakasu (bearing 48.35, the line through the four main-bridge piers and the
 * carriageways), z up, metres; origin midway between the main piers, z = 0
 * the water. The map owns the carriageways; the model draws the walkway on
 * the north-west (inland) edge of the deck, which OSM maps as
 * way/650017188.
 *
 * OSM: the main bridge's four piers, bridge:support=pier (replaced):
 * way/105230127 and way/105230124 (main piers, 29.4 x 8.4 m, 440 m apart),
 * way/105230115 and way/105230122 (end piers, 23.2 x 6.9 m, 160 m beyond).
 * The carriageways way/150870020 (bridge=cantilever) and way/150870021. OSM
 * maps no man_made=bridge outline here, so `replaces` has none; a map that
 * draws its own piers under bridge ways would draw them under this model
 * too. Adding an outline (the end piers to the end piers) in OSM would fix it.
 *
 * Published (Wikipedia ja "東京ゲートブリッジ"): total 2,618 m; main bridge
 * 760 m, spans 160 + 440 + 160 m, a three-span continuous steel truss and box
 * composite; 87.8 m above datum at the top; clearance 54.6 m; width 23.6 m,
 * four lanes; a walkway on the inland side only; LED illumination by Mikiko
 * Ishii, lit since April 2012.
 *
 * Photos (Wikimedia Commons, EVIDENCE): "Tokyo Gate Bridge -05.jpg"
 * (Aimaimyi, CC BY-SA 3.0), a near-square-on side elevation, scaled at
 * 1.161 px/m on the 440 m main span: the upper trusses from 45 m outside each
 * main pier to 155 m into the main span, their peak (87.8 m published) over
 * the pier, the top chord falling to ~74.5 m at its inner end, a near
 * vertical end post; the lower V from the end pier (deck) to the main pier's
 * top at ~19 m and back up to the deck 46 m into the main span; the deck
 * 55 m at the main piers, ~46.5 m at the end piers; "Tokyo Gate Bridge
 * 2018.jpg" (Kakidai, CC BY-SA 4.0) and "Tokyo Gate Bridge in Tokyo Bay.jpg"
 * (IketaniDaisei, CC BY-SA 4.0): the Warren-with-verticals pattern, the twin
 * pier shafts; "Tokyo-Gate-Bridge Bird's-eye-view.jpg" (MaedaAkihiko, CC BY-SA
 * 4.0): the plan from above, the central plain girder ~120 m; "Tokyo Gate
 * Bridge @ Wakasu Island @ Tokyo (9508161275).jpg" (Guilhem Vellut, CC BY
 * 2.0): the box members, the top lateral bracing, the cross frames;
 * night: "東京ゲートブリッジ 夜景1 - Tokyo Gate-Bridge - panoramio.jpg"
 * (shinohal, CC BY-SA 3.0): the deck lamps along the walkway.
 *
 * Estimated: the deck profile (58.2 m road at mid-span, from the 54.6 m
 * clearance plus a 3.6 m girder; 55 m at the main piers; 48.6 m at the end
 * piers), the panels (~16 m), member sizes (chords 2.2 m, posts and
 * diagonals 1.4-1.6 m, a little heavier than real so they read), the truss
 * planes at the deck's edges (±11.8 m), the piers' shafts.
 * Colour: the steel a pale blue-grey white (photos #e4e9ec in sun); the
 * piers concrete grey.
 *
 * Doubts: the deck heights are photo estimates (no lidar here); the truss
 * panel count is approximate.
 */
import { Part, cross, sub, type MaterialSpec, type V3 } from './mesh'
import { loftSolid, one, type Skin } from './sf-golden-gate-bridge'
import { band, bead, stations } from './bridge-kit'
import { prism, rect, writeModel, type Layer } from './tokyo-metropolitan-government-building'
import { finish } from './palette'

const PIER = 220, END = 381
const PX = 11.8                 // truss planes
const PEAK = 87.8

/** The road along the main bridge. */
const road = (y: number): number => {
  const a = Math.abs(y)
  return a <= PIER ? 58.2 - 3.2 * (a / PIER) ** 2 : 55 - 0.04 * (a - PIER)
}
const GIRDER = 3.6
/** Piecewise-linear through [u, z] points, undefined outside. */
const pl = (pts: [number, number][]) => (u: number): number | undefined => {
  if (u < pts[0][0] || u > pts[pts.length - 1][0]) return undefined
  for (let i = 1; i < pts.length; i++) if (u <= pts[i][0]) { const [u0, z0] = pts[i - 1], [u1, z1] = pts[i]; return z0 + ((z1 - z0) * (u - u0)) / (u1 - u0) }
  return pts[pts.length - 1][1]
}
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function qo(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), want) >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}

/** A straight box member from a to b, w wide by t thick (t along `side`), open at the ends (they sit in joints). */
function beam(skin: Skin, a: V3, b: V3, w: number, t: number, side: V3) {
  const d = sub(b, a), l = Math.hypot(...d), dn: V3 = [d[0] / l, d[1] / l, d[2] / l]
  const k = dot(side, dn), sv: V3 = [side[0] - dn[0] * k, side[1] - dn[1] * k, side[2] - dn[2] * k], sl = Math.hypot(...sv)
  const Sv: V3 = [sv[0] / sl, sv[1] / sl, sv[2] / sl], Wv = cross(Sv, dn)
  const sec = (o: V3): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [o[0] + Wv[0] * u * w / 2 + Sv[0] * v * t / 2, o[1] + Wv[1] * u * w / 2 + Sv[1] * v * t / 2, o[2] + Wv[2] * u * w / 2 + Sv[2] * v * t / 2] as V3)
  loftSolid(skin, [sec(a), sec(b)], [false, false])
}

type Lod = { detail: boolean }

function build({ detail }: Lod): Layer[] {
  const steel = new Part(), soffit = new Part(), concrete = new Part(), walk = new Part(), lamp = new Part()
  const S = one(steel)
  const CH = detail ? 2.2 : 2.6, MEM = detail ? 1.4 : 1.9, TH = detail ? 1.6 : 2.0

  // ---- The deck: a box girder from end pier to end pier ------------------------
  const ys = stations(-END, END, 20)
  for (const s of [-1, 1]) band(steel, s * (PX - 0.3), s * (PX + 0.4), ys, (y) => road(y) - 0.3, (y) => road(y) - GIRDER, { out: true, top: true, bottom: true, ends: true })
  band(soffit, -PX + 0.3, PX - 0.3, ys, (y) => road(y) - 0.6, (y) => road(y) - GIRDER, { bottom: true, ends: true })
  // the walkway on the north-west edge, and its railing
  band(walk, -PX + 0.3, -PX + 2.8, ys, (y) => road(y) + 0.15, (y) => road(y) - 0.3, { top: true, in: true })
  if (detail) {
    band(steel, -PX + 0.2, -PX + 0.4, ys, (y) => road(y) + 1.3, (y) => road(y) + 1.1, { out: true, in: true, top: true })
    band(steel, PX - 0.4, PX - 0.2, ys, (y) => road(y) + 1.1, (y) => road(y) + 0.9, { out: true, in: true, top: true })
  }
  for (const y of stations(-END + 10, END - 10, detail ? 36 : 72)) bead(lamp, [-PX + 0.6, y, road(y) + (detail ? 9 : 1.2)], detail ? 0.45 : 0.7, !detail)
  if (detail) for (const y of stations(-END + 10, END - 10, 36)) beam(S, [-PX + 0.6, y, road(y)], [-PX + 0.6, y, road(y) + 8.6], 0.25, 0.25, [1, 0, 0])

  // ---- The two "dinosaurs" -----------------------------------------------------
  for (const side of [-1, 1]) {
    const yAt = (u: number) => side * (PIER - u) // u: metres from the main pier toward mid-span
    const D = (u: number) => road(yAt(u))
    // top chord above the deck, bottom chord below it (photo-scaled, see header)
    const top = pl([[-45, D(-45) - 0.3], [-3, PEAK], [145, 74.5], [155, D(155) - 0.3]])
    const bot = pl([[-161, D(-161) - GIRDER], [0, 19], [46, D(46) - GIRDER]])
    // panel points
    const P = detail ? 16 : 16
    const us = [...stations(-161, -45, 116 / Math.round(116 / P)), ...stations(-45, 0, 45 / 3).slice(1), ...stations(0, 46, 46 / 3).slice(1), ...stations(46, 155, 109 / Math.round(109 / P)).slice(1)]
    for (const x of [-PX, PX]) {
      const at = (u: number, z: number): V3 => [x, yAt(u), z]
      const deckTop = (u: number) => D(u) - 0.3, deckBot = (u: number) => D(u) - GIRDER
      // chords
      for (let i = 0; i < us.length - 1; i++) {
        const a = us[i], b = us[i + 1]
        const ta = top(a), tb = top(b)
        if (ta !== undefined && tb !== undefined && (a >= -45 && b <= 155)) beam(S, at(a, ta), at(b, tb), CH, TH + 0.4, [1, 0, 0])
        const ba = bot(a), bb = bot(b)
        if (ba !== undefined && bb !== undefined && b <= 46) beam(S, at(a, ba), at(b, bb), CH, TH + 0.4, [1, 0, 0])
      }
      // posts and diagonals, above and below the deck
      for (let i = 0; i < us.length; i++) {
        const u = us[i], t = top(u), b = bot(u)
        if (t !== undefined && t > deckTop(u) + 1) beam(S, at(u, deckTop(u)), at(u, t), MEM, TH, [1, 0, 0])
        if (b !== undefined && b < deckBot(u) - 1) beam(S, at(u, b), at(u, deckBot(u)), MEM, TH, [1, 0, 0])
        if (i === us.length - 1) continue
        const v = us[i + 1], tv = top(v), bv = bot(v)
        const down = i % 2 === 0
        if (t !== undefined && tv !== undefined && Math.max(t - deckTop(u), tv - deckTop(v)) > 1) {
          if (down) beam(S, at(u, t), at(v, deckTop(v)), MEM, TH, [1, 0, 0])
          else beam(S, at(u, deckTop(u)), at(v, tv), MEM, TH, [1, 0, 0])
        }
        if (b !== undefined && bv !== undefined && Math.max(deckBot(u) - b, deckBot(v) - bv) > 1) {
          if (down) beam(S, at(u, deckBot(u)), at(v, bv), MEM, TH, [1, 0, 0])
          else beam(S, at(u, b), at(v, deckBot(v)), MEM, TH, [1, 0, 0])
        }
      }
    }
    // cross bracing between the planes: struts along the top chord, X lateral
    // bracing in the detail, cross frames under the deck
    for (let i = 0; i < us.length; i++) {
      const u = us[i], t = top(u), b = bot(u)
      if (t !== undefined && t > D(u) + 3) {
        beam(S, [-PX, yAt(u), t - 0.6], [PX, yAt(u), t - 0.6], MEM, MEM, [0, 1, 0])
        const v = us[i + 1], tv = v !== undefined ? top(v) : undefined
        if (detail && tv !== undefined && tv > D(v) + 3) {
          beam(S, [-PX, yAt(u), t - 0.6], [PX, yAt(v), tv - 0.6], 0.8, 0.8, [0, 0, 1])
          beam(S, [PX, yAt(u), t - 0.6], [-PX, yAt(v), tv - 0.6], 0.8, 0.8, [0, 0, 1])
        }
      }
      if (b !== undefined && b < D(u) - GIRDER - 3) {
        beam(S, [-PX, yAt(u), b + 0.6], [PX, yAt(u), b + 0.6], MEM, MEM, [0, 1, 0])
        if (detail) {
          beam(S, [-PX, yAt(u), b + 0.6], [PX, yAt(u), D(u) - GIRDER], 0.8, 0.8, [0, 1, 0])
          beam(S, [PX, yAt(u), b + 0.6], [-PX, yAt(u), D(u) - GIRDER], 0.8, 0.8, [0, 1, 0])
        }
      }
    }

    // ---- Piers ------------------------------------------------------------------
    const yp = side * PIER, ye = side * END
    for (const s of [-1, 1]) {
      prism(concrete, rect(s * 9.8, yp, 4.9, 4.2), 0, 18.4, { bevel: 0.4, roof: concrete })
      prism(concrete, rect(s * 8.3, ye, 3.3, 3.4), 0, road(ye) - GIRDER - 1.2, { bevel: 0.4, roof: concrete })
    }
    prism(concrete, rect(0, yp, 15.2, 4.6), 15.4, 18.4, { bevel: 0.3, roof: concrete })
    prism(concrete, rect(0, ye, 12.2, 3.6), road(ye) - GIRDER - 3.2, road(ye) - GIRDER - 0.1, { bevel: 0.3, roof: concrete })
    // the truss's bearing node on the main pier
    for (const s of [-1, 1]) prism(steel, rect(s * PX, yp, 1.8, 2.4), 18.4, 19.6, { bevel: 0.2, roof: steel })
  }

  const lit = (p: V3, n: V3) => (p[2] > 18 && Math.abs(Math.abs(p[1]) - PIER) < 170 ? (n[2] > 0.7 ? 0.3 : 0.75) : 0)
  return [
    { part: steel, material: { ...finish('gate-steel', 0xe3e8eb), floodlight: lit } as MaterialSpec },
    { part: soffit, material: finish('gate-soffit', 0xb9c0c4) },
    { part: concrete, material: finish('gate-concrete', 0xc9cac6) },
    { part: walk, material: finish('gate-walkway', 0xa9adad) },
    { part: lamp, material: finish('lamp-gate', 0xd5d9db) },
  ]
}

if (import.meta.main) {
  const meta = { bearing: 48.35, elevation: 0, height: PEAK + 1, roadway: { midspan: road(0), mainPiers: road(PIER), endPiers: road(END) } }
  await writeModel('tokyo-gate-bridge', 'tokyo-gate-bridge.glb', 'Tokyo Gate Bridge', build({ detail: false }), meta, 6500, 250 * 1024)
  await writeModel('tokyo-gate-bridge', 'tokyo-gate-bridge.detail.glb', 'Tokyo Gate Bridge', build({ detail: true }), meta, 40000, 1536 * 1024)
}
