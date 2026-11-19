/**
 * Bahrain World Trade Center, Manama (Atkins, 2004-2008): procedural, CC0-1.0.
 * bun generators/manama-bahrain-world-trade-center.ts
 *
 * Two 240 m sail towers, mirror images across a 31.7 m gap, joined by three
 * sky bridges that each carry a 29 m three-bladed wind turbine facing the
 * Gulf (north). Each tower's plan is an aerofoil-like lens from OSM, flat on
 * the inner face. Each tower is one loft: at every height the lens is cut
 * at depth U(z) = UMAX (1 - z/H)^1.15, one smooth, slightly concave sail
 * edge from the base corner to the tip (the cut face is the sail), and
 * above half the height the shaft narrows along the axis in a pointed ogive,
 * so each tower ends in its own sharp tip (lead review round 1: the earlier
 * wing-plus-block profile read stiff, and the side view was a slab).
 * Facade zones follow the sail: blue diagrid glass on the inner face and a
 * strip beside it, deep blue bay glass with white slabs every three floors,
 * the outer 55% of the sail's depth light silver louvres, a white rim on
 * the sail edge, and a dark blue glass crown above 80% of the height.
 *
 * Frame: bearing 330 (model +y is the gap axis, pointing to the sea side
 * the turbines face; +x is the east tower). Origin: the symmetry centre,
 * midway between the two OSM inner faces, at 50.5814311, 26.2396087, about
 * 6 m from the centroid of outline way/275949355.
 *
 * Evidence
 * - OSM way/275949355 (Bahrain World Trade Center, building, 10 m: the
 *   footprint of both towers and the ground between them), tower parts
 *   way/1472237505 (west) and way/1472237506 (east), 10-240 m, and bridge
 *   parts way/1472237507/-508/-509 (60-70, 90-100, 120-130 m). The inner
 *   faces in OSM run at bearings 148-152 (axis 330 used). The two tower
 *   outlines, turned into the axis frame, agree to a few metres and are
 *   averaged and mirrored here (plan table PLAN_F / PLAN_B).
 *   Moda Mall, way/1448610358 (10 m, the shopping-mall podium wrapping the
 *   towers) is left to the map: it is a separate 57,000 m2 building.
 * - Published: 240 m, 50 floors, three 29 m turbines (225 kW each) facing
 *   north, completed 2008 (en.wikipedia.org/wiki/Bahrain_World_Trade_Center);
 *   the bridges span 31.7 m (Arabian Business, "A wind power world first in
 *   Bahrain", arabianbusiness.com/abnews/a-wind-power-world-first-in-bahrain-60436).
 *   OSM's inner faces are only 19.4 m apart, against the published 31.7 m
 *   span and the photos (gap = turbine diameter in g01), so each tower is
 *   moved 6 m outward from its OSM line.
 * - Photos, all EVIDENCE:
 *   g01 "Bahrain WTC (46220337331).jpg", Gabby Canonizado, CC BY 2.0, from
 *     the north-west (camera 311 deg, 606 m): front view, the gap, all three
 *     turbines, the layered sails, white rims, bays, blue inner strip.
 *     https://commons.wikimedia.org/wiki/File:Bahrain_WTC_(46220337331).jpg
 *   z02 "Manama Bahrain World Trade Centre & Bahrain Financial Harbour 2.jpg",
 *     Zairon, CC BY-SA 4.0: near side-on, the narrow shaft and pointed crown.
 *     https://commons.wikimedia.org/wiki/File:Manama_Bahrain_World_Trade_Centre_%26_Bahrain_Financial_Harbour_2.jpg
 *   z01 "Manama Bahrain World Trade Centre & Bahrain Financial Harbour 1.jpg",
 *     Zairon, CC BY-SA 4.0. https://commons.wikimedia.org/wiki/File:Manama_Bahrain_World_Trade_Centre_%26_Bahrain_Financial_Harbour_1.jpg
 *   s14 "Manama Manama Skyline 14.jpg", Zairon, CC BY-SA 4.0: front view in sun.
 *     https://commons.wikimedia.org/wiki/File:Manama_Manama_Skyline_14.jpg
 *   k01 "Bahrain World Trade Center" (Flickr 4556003834), Petr Kadlec,
 *     CC BY-SA 2.0: from the south, silver flank, green bays, blue diagrid.
 *     https://www.flickr.com/photos/24306078@N00/4556003834
 *   a01 "Bahrain World Trade Center" (Flickr 2253519840), abcdz2000,
 *     CC BY-SA 2.0: bridges, nacelles and blades close up.
 *     https://www.flickr.com/photos/15543596@N05/2253519840
 *   d01 "002 Bahrain World Trade Center" (Flickr 11707319545), mrsdkrebs,
 *     CC BY 2.0: from below, bridge pods and rotor in front of the beam.
 *     https://www.flickr.com/photos/56041749@N02/11707319545
 *   n01 "Bahrain World trade Center .jpg", B.alotaby, CC BY-SA 4.0: dusk.
 *     https://commons.wikimedia.org/wiki/File:Bahrain_World_trade_Center_.jpg
 *   f01 "Bahrain World Trade Center (30040380192).jpg", Francisco Anzola,
 *     CC BY 2.0, from the south-west (222 deg).
 *     https://commons.wikimedia.org/wiki/File:Bahrain_World_Trade_Center_(30040380192).jpg
 *
 * Measured from g01 (scaled by the 240 m height, checked by the 29 m
 * rotors): hub heights 51, 90 and 128 m; the sail edge passes 0.57 of the
 * depth at 0.53 of the height and 0.19 at 0.76; the crown above ~0.8 is
 * only blue glass; the gap equals the rotor diameter. From z02: the shaft
 * keeps its width to about half the height, then narrows to a point.
 * Colours sampled (sunlit and overcast, g01, k01, a01, d01): silver flank
 * #8c928e/#97b3c0/#70767d -> #ccd6de (lighter silver louvres); blue diagrid
 * #49647d/#516479, saturated blue in sun (s14) -> #46699a; bay glass -> #4f78a6
 * (deeper, more saturated blue, lead review round 1); rims white -> trim;
 * bridges and nacelles dark grey -> charcoal #4a4f57.
 * Estimated: the back walls' bay strip (narrower than the front, k01); the
 * bridge beam 3 x 2.6 m with pods 2.4 m across at its ends; nacelle 9 m;
 * the entrance drum between the towers (r 10 m, 7 m, canopy r 14.5 m, g01).
 *
 * Night (n01, dusk): the silver louvred office glass glows warm and the bay
 * glass stays dark (`window-3` lit; bays `bwtc-bay-glass`); the blue diagrid strips and crown
 * blades stay dark blue (`glass`).
 * Rotors are their own nodes (pivot at the hub), static.
 *
 * Doubts: no aerial; the plan is OSM's, its scale checked only against
 * g01. The real inner faces curve slightly (an S-shaped venturi); drawn
 * flat. Louvres and the diagrid are drawn as plain colour.
 */
import { Part, writeGlb, type V3, type NodeSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { oq, ot, triCount } from './riyadh-kingdom-centre'

const ANCHOR = { lng: 50.5814311, lat: 26.2396087 }
const BEARING = 330
const H = 240
const G = 31.7 // gap between the inner faces
const SC = 0.72 // plan scale along the axis: z02 shows the shaft ~34 m wide, OSM 47 m
const SU = 1.12 // plan scale across the gap: g01 shows each tower ~12% deeper than OSM

// Canonical tower plan: u = distance out from the inner face, v along the axis (+ = sea side).
const PLAN_F: [number, number][] = [[0, 17], [3, 18.3], [8, 21], [16, 25], [25.5, 28], [35, 28], [43, 26], [50, 22], [59, 13]]
const PLAN_B: [number, number][] = [[0, -17], [5, -19], [10, -20], [20, -17.5], [30, -14], [40, -8.5], [48, -3.5], [54, 3], [59, 13]]
const UMAX = 59 * SU
const CS = 0.08 * UMAX // the blue diagrid strip beside the inner face
const P_SAIL = 1.15 // the sail's outer edge: u = UMAX (1 - z/H)^P, a little concave (g01, lead review)
const ZT = 0.5 * H // where the shaft starts to narrow to its point along the axis (z02)
const ZC = 0.8 * H // above this the tower is only the glass crown
const WING = 0.45 // the outer part of the sail (u > WING * U(z)) is the light louvred band

const interp = (t: [number, number][], u: number) => {
  for (let i = 0; i + 1 < t.length; i++) {
    const [u0, v0] = t[i], [u1, v1] = t[i + 1]
    if (u <= u1) return v0 + ((v1 - v0) * (u - u0)) / (u1 - u0 || 1)
  }
  return t[t.length - 1][1]
}
const vF = (u: number) => interp(PLAN_F, u / SU) * SC
const vB = (u: number) => interp(PLAN_B, u / SU) * SC
/** The sail's depth across the gap at height z: one smooth curve from the base corner to the tip. */
const U = (z: number) => UMAX * Math.pow(Math.max(0, 1 - z / H), P_SAIL)
/** The shaft's width factor along the axis: full to ZT, then a pointed ogive to the tip. */
const Gv = (z: number) => (z <= ZT ? 1 : Math.cos((Math.PI / 2) * Math.min(1, (z - ZT) / (H - ZT))))

function build(detail: boolean) {
  const silver = new Part(), bays = new Part(), blue = new Part(), crown = blue, white = new Part(), dark = new Part()
  const rotors: Part[] = [new Part(), new Part(), new Part()], blades: Part[] = [new Part(), new Part(), new Part()]
  // Each tower is one loft of rings up the height. A ring is the plan lens cut at depth U(z)
  // (fixed fractions s of U(z) along the front and back walls) and narrowed along the axis by Gv(z),
  // so the outer cut face is the sail and the whole tower runs to one point at the inner face.
  const NS = detail ? 14 : 9
  const S = Array.from({ length: NS + 1 }, (_, k) => k / NS)
  // levels: every 13.5 m a 0.9 m slab band (three floors), plus the crown
  const levels: number[] = [0]
  for (let z = 13.5; z < ZC; z += 13.5) levels.push(z - 0.9, z)
  for (let k = 1; k <= (detail ? 12 : 7); k++) levels.push(ZC + ((H - 0.4 - ZC) * k) / (detail ? 12 : 7))
  const isSlab = (k: number) => k > 0 && k < levels.length && levels[k] - levels[k - 1] < 1
  for (const s of [1, -1]) {
    const P = (u: number, v: number, z: number): V3 => [s * (G / 2 + u), v, z]
    const ring = (z: number) => {
      const Uz = Math.max(U(z), 0.4), g = Gv(z), out: { p: V3; u: number; side: number }[] = []
      for (const t of S) { const u = Uz * t; out.push({ p: P(u, vB(u) * g, z), u, side: -1 }) }
      for (const t of [...S].reverse()) { const u = Uz * t; out.push({ p: P(u, vF(u) * g, z), u, side: 1 }) }
      return out
    }
    const rings = levels.map(ring)
    const n = rings[0].length
    for (let k = 0; k + 1 < rings.length; k++) {
      const r0 = rings[k], r1 = rings[k + 1], zm = (levels[k] + levels[k + 1]) / 2, slab = isSlab(k + 1)
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        const a = r0[i], b = r0[j], c = r1[j], d = r1[i]
        // outward hint: away from the plan's middle, and up for the sloped sail face
        const mu = (a.u + b.u) / 2, Uz = U(zm)
        const inner = i === n - 1 // the inner face, between the two u = 0 corners
        const cut = i === NS // the sail face, between the back and front ends of the cut
        const hint: V3 = inner ? [-s, 0, 0] : cut ? [s, 0, 0.6] : [s * 0.05, a.side, 0]
        const frac = mu / Math.max(Uz, 0.4)
        let part: Part
        if (zm > ZC) part = crown
        else if (inner || mu < CS) part = blue
        else if (cut) part = silver
        else if (frac > 0.95) part = white // the white rim along the sail edge
        else if (frac > WING) part = silver // the light louvred band of the sail
        else part = slab ? white : bays
        oq(part, a.p, b.p, c.p, d.p, hint)
      }
    }
    // the tip
    const top = rings[rings.length - 1], tip = P(0, 0, H)
    for (let i = 0; i < n; i++) ot(crown, top[i].p, top[(i + 1) % n].p, tip, [s * 0.2, top[i].side, 1])
    // detail only: the inner face's diagrid (k01, d01)
    if (detail) {
      const v0 = vB(0), v1 = vF(0), w = 0.45
      for (const sl of [2, -2]) for (let c = -2 * (v1 - v0); c < ZT + 2 * (v1 - v0); c += 16) {
        const zA = (v: number) => sl * (v - v0) + c
        const vAt = (z: number) => v0 + (z - c) / sl
        const ta = Math.max(v0, Math.min(vAt(0), vAt(ZT))), tb = Math.min(v1, Math.max(vAt(0), vAt(ZT)))
        if (tb - ta < 0.5) continue
        const kk = w / Math.hypot(1, sl), dv = -sl * kk, dz = kk
        const Q = (v: number, z: number): V3 => P(-0.08, v, Math.min(ZT, Math.max(0, z)))
        oq(white, Q(ta - dv, zA(ta) - dz), Q(tb - dv, zA(tb) - dz), Q(tb + dv, zA(tb) + dz), Q(ta + dv, zA(ta) + dz), [-s, 0, 0])
      }
    }
  }

  // ---- sky bridges, pods, nacelles and rotors ----
  const HUBS = [51, 90, 128]
  const spindle = (p: Part, ax: 'x' | 'y', c: V3, half: number, prof: [number, number][], seg = 8) => {
    // a turned shape along x or y: prof = [(t in -1..1, radius)]
    for (let k = 0; k + 1 < prof.length; k++) {
      for (let i = 0; i < seg; i++) {
        const a0 = (2 * Math.PI * i) / seg, a1 = (2 * Math.PI * (i + 1)) / seg
        const pt = (t: number, r: number, a: number): V3 => ax === 'x'
          ? [c[0] + t * half, c[1] + r * Math.cos(a), c[2] + r * Math.sin(a)]
          : [c[0] + r * Math.cos(a), c[1] + t * half, c[2] + r * Math.sin(a)]
        const [t0, q0] = prof[k], [t1, q1] = prof[k + 1]
        const mid = (a0 + a1) / 2
        const hint: V3 = ax === 'x' ? [(q0 - q1) * 0.3, Math.cos(mid), Math.sin(mid)] : [Math.cos(mid), (q0 - q1) * 0.3, Math.sin(mid)]
        if (q0 < 1e-3) ot(p, pt(t0, 0, 0), pt(t1, q1, a1), pt(t1, q1, a0), hint)
        else if (q1 < 1e-3) ot(p, pt(t0, q0, a0), pt(t0, q0, a1), pt(t1, 0, 0), hint)
        else oq(p, pt(t0, q0, a0), pt(t0, q0, a1), pt(t1, q1, a1), pt(t1, q1, a0), hint)
      }
    }
  }
  const nodes: NodeSpec[] = []
  HUBS.forEach((zh, k) => {
    // beam, 3 m wide and 2.6 m deep, between the inner faces
    const y0 = -1.5, y1 = 1.5, zb0 = zh - 1.3, zb1 = zh + 1.3
    for (const [a, b, c, d, n] of [
      [[-G / 2, y0, zb0], [G / 2, y0, zb0], [G / 2, y0, zb1], [-G / 2, y0, zb1], [0, -1, 0]],
      [[-G / 2, y1, zb0], [G / 2, y1, zb0], [G / 2, y1, zb1], [-G / 2, y1, zb1], [0, 1, 0]],
      [[-G / 2, y0, zb1], [G / 2, y0, zb1], [G / 2, y1, zb1], [-G / 2, y1, zb1], [0, 0, 1]],
      [[-G / 2, y0, zb0], [G / 2, y0, zb0], [G / 2, y1, zb0], [-G / 2, y1, zb0], [0, 0, -1]],
    ] as [V3, V3, V3, V3, V3][]) oq(dark, a, b, c, d, n)
    // the pods at both ends, where the beam meets the towers
    for (const s of [1, -1]) spindle(dark, 'x', [s * (G / 2 - 3.2), 0, zh], 3.4, [[-1, 0.01], [-0.6, 1.9], [0.2, 2.4], [1, 2.4]].map(([t, r]) => [s * t, r]) as [number, number][])
    // the nacelle on the beam's middle, the hub in front (sea side)
    spindle(dark, 'y', [0, -0.5, zh], 4.5, [[-1, 0.01], [-0.7, 1.3], [0.6, 1.6], [1, 1.5]])
    const rotor = rotors[k], bl = blades[k]
    spindle(rotor, 'y', [0, 0.6, 0], 1.0, [[-1, 1.45], [0.1, 1.2], [1, 0.01]])
    for (let b = 0; b < 3; b++) {
      const a = Math.PI / 2 + (2 * Math.PI * b) / 3 + k * 0.5
      const r: V3 = [Math.cos(a), 0, Math.sin(a)], tg: V3 = [-Math.sin(a), 0, Math.cos(a)]
      const sec = (rad: number, chord: number, th: number, tw: number): V3[] => {
        const cx = Math.cos(tw), sx = Math.sin(tw)
        const cd: V3 = [tg[0] * cx, sx, tg[2] * cx], td: V3 = [-tg[0] * sx, cx, -tg[2] * sx]
        const o: V3 = [r[0] * rad, 0.6, r[2] * rad]
        return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([p, q]) => [o[0] + cd[0] * chord * p / 2 + td[0] * th * q / 2, o[1] + cd[1] * chord * p / 2 + td[1] * th * q / 2, o[2] + cd[2] * chord * p / 2 + td[2] * th * q / 2] as V3)
      }
      const stations = detail ? [[1.0, 1.0, 0.6, 0.35], [3.5, 2.3, 0.5, 0.3], [9, 1.6, 0.4, 0.2], [14.5, 0.8, 0.25, 0.1]] : [[1.0, 1.0, 0.6, 0.35], [3.5, 2.3, 0.5, 0.3], [14.5, 0.9, 0.3, 0.12]]
      const secs = stations.map(([rad, ch, th, tw]) => sec(rad, ch, th, tw))
      for (let q = 0; q + 1 < secs.length; q++) for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4, m = [0, 1, 2].map((d) => (secs[q][i][d] + secs[q][j][d]) / 2 - (secs[q][0][d] + secs[q][2][d]) / 2) as V3
        oq(bl, secs[q][i], secs[q][j], secs[q + 1][j], secs[q + 1][i], m)
      }
      const tip = secs[secs.length - 1]
      oq(bl, tip[0], tip[1], tip[2], tip[3], r)
    }
    nodes.push({ name: `rotor-${k + 1}`, translation: [0, 4.0, zh], parts: [{ part: rotor, material: mats.metal }, { part: bl, material: mats.trim }] })
  })

  // ---- the entrance drum between the towers, on the sea side ----
  {
    const SEG = detail ? 24 : 16, cy = 8, R = 10, Rc = 14.5, h = 7
    const pt = (r: number, i: number, z: number): V3 => [r * Math.cos((2 * Math.PI * i) / SEG), cy + r * Math.sin((2 * Math.PI * i) / SEG), z]
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG, m: V3 = [Math.cos((2 * Math.PI * (i + 0.5)) / SEG), Math.sin((2 * Math.PI * (i + 0.5)) / SEG), 0]
      oq(bays, pt(R, i, 0), pt(R, j, 0), pt(R, j, h), pt(R, i, h), m)
      oq(white, pt(Rc, i, h), pt(Rc, j, h), pt(Rc, j, h + 1), pt(Rc, i, h + 1), m)
      ot(white, [0, cy, h + 1], pt(Rc, i, h + 1), pt(Rc, j, h + 1), [0, 0, 1])
      ot(white, [0, cy, h], pt(Rc, j, h), pt(Rc, i, h), [0, 0, -1])
    }
  }

  const parts = [
    { part: silver, material: mats.silver },
    { part: bays, material: mats.window },
    { part: blue, material: mats.blue },
    { part: white, material: mats.trim },
    { part: dark, material: mats.metal },
  ]
  return { parts, nodes }
}

const mats = {
  silver: windowVariant(3, 0xccd6de),
  window: finish('bwtc-bay-glass', 0x4f78a6, 0.35),
  blue: { name: 'glass', color: 0x46699a, roughness: 0.24 },
  trim: PALETTE.trim,
  metal: finish('bwtc-steel', 0x4a4f57, 0.6),
}

if (import.meta.main) {
  for (const [file, detail, maxTri, maxBytes] of [['manama-bahrain-world-trade-center.glb', false, 6500, 256000], ['manama-bahrain-world-trade-center.detail.glb', true, 40000, 1536 * 1024]] as const) {
    const { parts, nodes } = build(detail)
    const triangles = triCount(parts) + nodes.reduce((n, nd) => n + triCount(nd.parts), 0)
    if (triangles > maxTri) throw new Error(`Triangle budget exceeded: ${triangles}`)
    const glb = writeGlb('Bahrain World Trade Center', parts, {
      license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H,
      frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
      replaces: ['way/275949355', 'way/1472237505', 'way/1472237506', 'way/1472237507', 'way/1472237508', 'way/1472237509'],
    }, { nodes })
    if (glb.length > maxBytes) throw new Error(`File budget exceeded: ${glb.length}`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
  }
}
