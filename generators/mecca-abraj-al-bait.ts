/**
 * Abraj Al Bait (the Clock Towers) with the Makkah Royal Clock Tower, Mecca:
 * procedural, CC0-1.0.
 * bun generators/mecca-abraj-al-bait.ts
 *
 * Sources, numbers and doubts: the SOURCES comment below the imports.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

/* SOURCES ------------------------------------------------------------------
 *
 * Writes two levels of detail in the same frame:
 * - models/mecca-abraj-al-bait.glb, the low model (budget 6,500 tris);
 * - models/mecca-abraj-al-bait.detail.glb, from zoom 16 (budget 40,000):
 *   the same forms with 3-storey window groups, pointed-arch window heads
 *   cut as real recesses on the podium and the clock tower's capital, the
 *   dial's minute ring and corner rosettes, finer crown gables and spire fins.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the complex is laid
 * out on the compass, its clock faces looking N/S/E/W). The anchor
 * (39.825702, 21.418775) is the area centroid of the OSM outline
 * relation/12896421 (its three outer rings). Everything is authored about the
 * clock tower's axis, which sits at C = (-16.7, -71.95) from the anchor.
 *
 * Ground: y = 0 is the Haram-side street on the north front, which the
 * published heights are measured from. Mapterhorn here is only z12 (z13-15
 * 404) and shows the complex as a broad hump: about 6 m above the Haram
 * plaza along the north front, 25-35 m over the southern half (the old
 * Jabal Bulbul / Ajyad hill and the towers themselves in the surface model).
 * The south walls sink into it; elevation 0.
 *
 * Published (cited):
 * - Clock tower 601 m to the crescent tip, roof 508 m, top floor 494 m,
 *   observatory 484 m, spire 93 m, crescent 21 m across; four clock faces
 *   43 x 43 m; minute hand 23 m, hour hand 17 m (Wikipedia "Abraj Al Bait",
 *   infobox and "Clock" section, fetched Nov 2026; CTBUH lists 601 m).
 * - Hajar and Zamzam towers 279 m (58 floors), Al Maqam and Qibla 232 m
 *   (61 floors), Al Safa and Marwah 220 m (46 floors) (Wikipedia table).
 *   OSM tags Safa/Marwah 232 m; the published 220 m is used.
 * - Architects Dar Al-Handasah and SL Rasch; 2002-2012.
 *
 * OSM (© OpenStreetMap contributors, ODbL), fetched Nov 2026:
 * - relation/12896421 outline (three outers: way/210564295 the podium and
 *   central towers, way/958867188 Qibla's crown ring, way/966404299 Maqam).
 * - way/958867184 the podium, height 80; the clock tower's own 3D parts
 *   way/958867030-958867189 (shaft 80-356, capital 356-416.5, display band
 *   416.5-426, clock stage 426-469, Allah stage and turrets 469-505, glass
 *   crown 493-532, spire base 532-577, crescent 577-601), relation/12896422
 *   (the gold ring at 469-493).
 * - tower parts way/457669754 Safa, 457669755 Marwah, 457669758 Zamzam,
 *   457669759 Hajar, 457669762 Qibla, 457669764 Maqam (min_height 80 on the
 *   podium; Qibla and Maqam 51 on their own podiums way/958867180-181);
 *   north-front entrance steps way/958867182 (67 m), 958867183 (50 m),
 *   958867187 (55 m); NW strip way/958867189 (30 m); E wedge 958867179 (36 m).
 * - Plan positions in this frame (tower axis at 0,0; u east, v north):
 *   shaft x ±40, y -24..+24 (OSM); Hajar u 45-105, v -20..+66; Marwah
 *   u 28-81, v 82-177; Qibla/Maqam |u| 97-186, v -2..63; podium (OSM
 *   way/958867184, used as traced) north front at v 153-155, the entrance
 *   steps (as traced) to v 171.
 *
 * Estimated (from the photos below, scaled against the published heights):
 * - The OSM traces of the twin towers differ by 10-20 m from side to side,
 *   and the complex is symmetric about the clock tower's N-S axis, so each
 *   pair is drawn mirrored: Zamzam = Hajar's OSM outline mirrored, Safa =
 *   Marwah's (the narrower of each pair, so neither reaches into the
 *   neighbouring Abraj As Safwah, way/210564288), Qibla = Maqam = the average
 *   of the two OSM traces. Where a mirrored tower is narrower than its own
 *   OSM trace, the 80 m podium (as traced) shows. The NW 30 m strip and the
 *   E 36 m wedge stay one-sided, as OSM maps them.
 * - Clock tower shaft 80 x 56 m (OSM has 80 x 48; the 2008-12 aerial and the
 *   night photo show the E/W faces nearly as wide as the clock stage, which
 *   needs 61 m for its 43 m faces between corner turrets). Capital 83 x 63
 *   (356-403), display band 85 x 65 (403-426, its green strip 410.5-421.5),
 *   clock stage 63 x 61 with 9.8 m corner turrets to 490, their slender
 *   gold pinnacles to 516 (rising clearly above the 494 m stage top, as in
 *   every photo).
 *   Stage heights measured off "Clock Tower Makkah from Marwa" (2.34 px/m,
 *   scaled from the 601 m tip and the 43 m clock square).
 * - Dial 37 m across inside the 43 m gold square, rim 39 m; hour bars,
 *   hands (minute 17 + 4 m tail, hour 12.5 + 3 m tail: the published lengths
 *   include the tails) set at ten past ten.
 * - Allah stage 469-494: white panel 36 m wide under a pointed gable, in a
 *   gold border (lettering left out; a plain gold medallion in the detail).
 * - Crown: faceted teal glass "jewel" 494-522 (r 14.1 at 503.5; 28 m wide,
 *   0.45 of the clock stage's width, as measured off the same photo), on a
 *   gold ring, gold spire 522-580 with ribs,
 *   crescent 584-601 (21 m outer diameter, horns up to 601, facing N/S).
 * - Hotel tower crowns (Zamzam, Hajar, Qibla, Maqam): two white tiers, each
 *   an overhanging cornice, a sloped skirt, a row of pointed gables and
 *   upswept horns leaning out at every corner; then a small glass pyramid
 *   and a spike. Top 24 m (279 m towers) or 21 m (232 m towers).
 * - Display band 403-426: brown by day (as in every daylight photo), with
 *   raised gold strips above and below the script line and, in the detail
 *   model, a row of raised gold script panels (no lettering). Safa and Marwah are flat-topped
 *   (older, 2007-08), with a parapet and a plant room.
 * - Facades: vertical teal-green glass bays between sand stone piers,
 *   broken by stone bands every ~40 m (low) or 3 storeys (detail).
 *
 * Colours from daylight photos, pulled to the palette's lightness:
 * warm salmon-buff stone #dcc0a6, the clock tower's upper stages and
 * turrets brown-pink #a98672, grey-teal glass #86a3a1 in panels about as
 * wide as the stone piers between them, gold #cfa54c, the dial, the Allah
 * panel and the hotel crowns white, the glass cupola grey-teal #6a9e92.
 * Night: the dials, Allah panels and hotel crowns glow white (`neon-clock`;
 * the crowns' frames are lit white in the night photo), the cupola glows
 * (`neon-green`), the gold spire, crescent, frames and pinnacles are
 * floodlit, and the hotel windows glow as `window`.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - "Makkah Royal Clock Tower in 2012", King Eliot, CC BY-SA 4.0 (from N:
 *   clock, Allah panel, capital, crowns of the flanking towers),
 *   https://commons.wikimedia.org/wiki/File:Makkah_Royal_Clock_Tower_in_2012.jpg
 * - "Clock Tower Makkah from Marwa", King Eliot, CC BY-SA 4.0 (from NE),
 *   https://commons.wikimedia.org/wiki/File:Clock_Tower_Makkah_from_Marwa.jpg
 * - "Clock Tower Makkah 2", King Eliot, CC BY-SA 4.0 (from NE, crowns),
 *   https://commons.wikimedia.org/wiki/File:Clock_Tower_Makkah_2.jpg
 * - "Clock Tower Makkah in morning", King Eliot, CC BY-SA 4.0 (from NW),
 *   https://commons.wikimedia.org/wiki/File:Clock_Tower_Makkah_in_morning.jpg
 * - "CLOCK TOWER FROM SOUR", Sajetpa at Malayalam Wikipedia, CC BY-SA 3.0
 *   (from the south, far, under construction: massing only),
 *   https://commons.wikimedia.org/wiki/File:CLOCK_TOWER_FROM_SOUR.JPG
 * - "Royal Makkah Clock Tower's Spire and Crescent", Ez-17-93, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:Royal_Makkah_Clock_Tower%27s_Spire_and_Crescent.jpg
 * - "Aerial View of Abraj Al Bait Under Construction", Fadi El Benni of Al
 *   Jazeera English, CC BY-SA 2.0 (from the W, plan and both clock faces),
 *   https://commons.wikimedia.org/wiki/File:Aerial_View_of_Abraj_Al_Bait_Under_Construction.jpg
 * - "Makkah Clock Tower at night, Saudi Arabia (1)", Richard Mortel, CC BY
 *   2.0 (night: green dials, band and Allah panel),
 *   https://commons.wikimedia.org/wiki/File:Makkah_Clock_Tower_at_night,_Saudi_Arabia_(1)_(52501885245).jpg
 * - "ClockTower Makkah", King Eliot, CC BY-SA 4.0 (north entrance, podium),
 *   https://commons.wikimedia.org/wiki/File:ClockTower_Makkah.jpg
 * - "Abraj al bait Clock 4", King Eliot, CC BY-SA 4.0 (clock stage, day),
 *   https://commons.wikimedia.org/wiki/File:Abraj_al_bait_Clock_4.jpg
 *
 * Look-only: none.
 *
 * Doubts:
 * - The south and west sides: no licensed daylight photo shows them whole;
 *   they are drawn as the mirrored north/east sides.
 * - The shaft depth (56 m here, 48 m in OSM) and the clock stage plan.
 * - The real dials and display band glow green at night. Here the dial is
 *   white and the band brown by day, as they are, so the dials glow white
 *   and the band stays unlit; only the grey-teal cupola glows, faintly
 *   green. The green night look is mostly lost to keep the day colours right.
 * - The low model's facades use few, large grouped panels (one bay per
 *   20 m, about 66 m tall on the hotels) to pay for the crowns within
 *   250 KB; the detail model has 3-storey groups.
 * - The hotel towers' crown gables are simplified to one row of pointed
 *   gables; the real crowns have two tiers of upswept eaves.
 * - No calligraphy (the Allah panel, the band's verses): left plain.
 */

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
type P2 = [number, number]

/** The clock tower's axis, from the anchor. */
const C: P2 = [-16.7, -71.95]
const BEARING = 0
const P = (u: number, v: number, z: number): V3 => [u + C[0], v + C[1], z]

type Mats = { stone: Part; bronze: Part; win: Part; gold: Part; white: Part; green: Part }

// ------------------------------------------------------------ plan data ---
/** Outlines in the tower frame (u east, v north), counter-clockwise. */
const mirror = (poly: P2[]): P2[] => poly.map(([u, v]) => [-u, v] as P2).reverse()
/** OSM way/457669759 (Hajar); Zamzam is drawn as its mirror. */
const HAJAR: P2[] = [[48.5, 66.5], [79.3, 60.0], [105.3, -3.2], [88.8, -8.2], [82.9, -7.6], [52.4, -20.2], [45.5, -3.3]]
/** OSM way/457669755 (Marwah); Safa is drawn as its mirror. */
const MARWAH: P2[] = [[29.6, 157.2], [53.6, 176.6], [79.3, 104.2], [81.1, 94.2], [48.2, 82.5], [40.2, 92.2], [27.8, 127.0]]
const MAQAM: P2[] = [[110, 0], [175, 19], [184, 32], [160, 58], [112, 52], [103, 10]]
/** OSM way/958867184, the 80 m podium, as traced. */
const PODIUM: P2[] = [[-123.5, 86.8], [-89.6, 75.5], [-90.4, 54.7], [-91.4, 30.7], [-92.7, 12.6], [-90.3, 12.2], [-91.0, -3.0], [-85.6, -2.6], [-60.6, -19.5], [-41.0, -23.6], [-40.1, -23.8], [39.7, -23.8], [41.0, -23.5], [52.4, -20.2], [82.9, -7.6], [88.8, -8.2], [105.3, -3.2], [79.3, 60.0], [71.6, 88.2], [81.6, 91.8], [79.7, 101.8], [53.6, 176.6], [53.2, 177.4], [36.7, 164.2], [30.6, 159.4], [23.2, 153.4], [-33.9, 155.2], [-42.1, 161.7], [-48.8, 166.9], [-68.6, 182.4], [-121.9, 90.2]]
/** North-front entrance steps: OSM way/958867182 (67 m), 958867183 (50 m), 958867187 (55 m). */
const ENT67: P2[] = [[-42.1, 161.7], [-33.9, 155.2], [23.2, 153.4], [30.6, 159.4]]
const ENT50: P2[] = [[-48.8, 166.9], [36.7, 164.2], [30.6, 159.4], [-42.1, 161.7]]
const ENT55: P2[] = [[-13.3, 170.7], [19.4, 169.7], [19.1, 159.8], [-13.6, 160.7]]
/** OSM way/958867189 (NW strip, 30 m) and way/958867179 (E wedge, 36 m). */
const NW_STRIP: P2[] = [[-77, 189.6], [-132.2, 95.6], [-121.9, 90.1], [-68.6, 182.4]].reverse() as P2[]
const E_WEDGE: P2[] = [[156.2, 59.9], [181.5, 40.4], [165.8, 63.3]]

function build(detail: boolean): Mats {
  const M: Mats = { stone: new Part(), bronze: new Part(), win: new Part(), gold: new Part(), white: new Part(), green: new Part() }

  // ---------------------------------------------------------- primitives ---
  const triN = (p: Part, a: V3, b: V3, c: V3, n: V3) => p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  const quadN = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { triN(p, a, b, c, n); triN(p, a, c, d, n) }

  const area = (poly: P2[]) => poly.reduce((s, a, i) => { const b = poly[(i + 1) % poly.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
  const ccw = (poly: P2[]) => (area(poly) < 0 ? [...poly].reverse() : poly)
  /** Ear clipping of a simple ccw polygon; returns index triples. */
  function triangulate(poly: P2[]): [number, number, number][] {
    const idx = poly.map((_, i) => i), out: [number, number, number][] = []
    const crs = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    const inside = (p: P2, a: P2, b: P2, c: P2) => crs(a, b, p) > 1e-9 && crs(b, c, p) > 1e-9 && crs(c, a, p) > 1e-9
    let guard = 0
    while (idx.length > 3 && guard++ < 1000) {
      for (let k = 0; k < idx.length; k++) {
        const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
        const a = poly[i0], b = poly[i1], c = poly[i2]
        if (crs(a, b, c) <= 1e-9) continue
        if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
        out.push([i0, i1, i2]); idx.splice(k, 1); break
      }
    }
    if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
    return out
  }
  /** Flat horizontal cap over a simple polygon (tower frame). */
  function capPoly(p: Part, poly: P2[], z: number, up = true) {
    const q = ccw(poly)
    for (const [a, b, c] of triangulate(q)) {
      const A = P(q[a][0], q[a][1], z), B = P(q[b][0], q[b][1], z), Cc = P(q[c][0], q[c][1], z)
      triN(p, A, B, Cc, [0, 0, up ? 1 : -1])
    }
  }
  /** Vertical walls of a polygon from z0 to z1 (flat-shaded). */
  function walls(p: Part, poly: P2[], z0: number, z1: number) {
    const q = ccw(poly)
    for (let i = 0; i < q.length; i++) {
      const a = q[i], b = q[(i + 1) % q.length]
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < 1e-6) continue
      const n: V3 = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0]
      quadN(p, P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1), n)
    }
  }
  /** A block: walls + top cap (+ bottom optional). */
  function block(p: Part, poly: P2[], z0: number, z1: number, top: Part | null = p) {
    walls(p, poly, z0, z1)
    if (top) capPoly(top, poly, z1, true)
  }
  /** Offset a ccw polygon outward by d (mitred). */
  function offset(poly: P2[], d: number): P2[] {
    const q = ccw(poly), n = q.length
    return q.map((v, i) => {
      const a = q[(i + n - 1) % n], b = q[(i + 1) % n]
      const e1 = [v[0] - a[0], v[1] - a[1]], e2 = [b[0] - v[0], b[1] - v[1]]
      const l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1])
      const n1 = [e1[1] / l1, -e1[0] / l1], n2 = [e2[1] / l2, -e2[0] / l2]
      const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
      return [v[0] + (d * (n1[0] + n2[0])) / k, v[1] + (d * (n1[1] + n2[1])) / k] as P2
    })
  }
  const centroid = (poly: P2[]): P2 => {
    let A = 0, x = 0, y = 0
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], c = a[0] * b[1] - b[0] * a[1]
      A += c; x += (a[0] + b[0]) * c; y += (a[1] + b[1]) * c
    }
    return [x / (3 * A), y / (3 * A)]
  }
  const scaleTo = (poly: P2[], c: P2, k: number): P2[] => poly.map(([u, v]) => [c[0] + (u - c[0]) * k, c[1] + (v - c[1]) * k] as P2)
  /** A loft between two rings of equal length (sloped band), normals from geometry. */
  function loftRings(p: Part, r0: V3[], r1: V3[], inside: V3) {
    const n = r0.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const q = [r0[i], r0[j], r1[j], r1[i]]
      let m = cross(sub(q[1], q[0]), sub(q[3], q[0]))
      if (Math.hypot(...m) < 1e-9) m = cross(sub(q[2], q[1]), sub(q[3], q[1]))
      m = unit(m)
      const c = mul(q.reduce(add, [0, 0, 0] as V3), 0.25)
      if (dot(m, sub(c, inside)) < 0) m = mul(m, -1)
      quadN(p, q[0], q[1], q[2], q[3], m)
    }
  }

  /**
   * Surface of revolution about tower-frame (cu, cv): profile [r, z] bottom
   * to top, `segs` around. Smooth across bends under `smooth` degrees,
   * faceted (flat per column) when `facet`.
   */
  function lathe(p: Part, cu: number, cv: number, prof: P2[], segs: number, opts: { phase?: number; smooth?: number; facet?: boolean } = {}) {
    const { phase = 0, smooth = 40, facet = false } = opts
    const bandN = prof.slice(0, -1).map(([r0, z0], b) => {
      const [r1, z1] = prof[b + 1], er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
      return [ez / l, -er / l] as P2
    })
    const lim = Math.cos((smooth * Math.PI) / 180)
    const vn = (b: number, end: 0 | 1): P2 => {
      const own = bandN[b], o = bandN[b + (end ? 1 : -1)]
      if (!o || own[0] * o[0] + own[1] * o[1] < lim) return own
      const s = [own[0] + o[0], own[1] + o[1]], l = Math.hypot(s[0], s[1])
      return [s[0] / l, s[1] / l]
    }
    for (let b = 0; b < prof.length - 1; b++) {
      const [r0, z0] = prof[b], [r1, z1] = prof[b + 1]
      if (r0 === 0 && r1 === 0) continue
      const n0 = vn(b, 0), n1 = vn(b, 1)
      for (let i = 0; i < segs; i++) {
        const ta = phase + (TAU * i) / segs, tb = phase + (TAU * (i + 1)) / segs, tm = (ta + tb) / 2
        const pt = (r: number, t: number, z: number) => P(cu + r * Math.cos(t), cv + r * Math.sin(t), z)
        const N = (nn: P2, t: number): V3 => unit([nn[0] * Math.cos(t), nn[0] * Math.sin(t), nn[1]])
        const ta2 = facet ? tm : ta, tb2 = facet ? tm : tb
        const A = pt(r0, ta, z0), B = pt(r0, tb, z0), Ct = pt(r1, tb, z1), D = pt(r1, ta, z1)
        if (r0 > 0) p.tri(A, B, Ct, undefined, undefined, undefined, [N(n0, ta2), N(n0, tb2), N(n1, tb2)])
        if (r1 > 0) p.tri(A, Ct, D, undefined, undefined, undefined, [N(n0, ta2), N(n1, tb2), N(n1, ta2)])
      }
    }
  }
  function discCap(p: Part, cu: number, cv: number, r: number, z: number, segs: number, up = true, phase = 0) {
    const ring: V3[] = []
    for (let i = 0; i < segs; i++) { const t = phase + (TAU * i) / segs; ring.push(P(cu + r * Math.cos(t), cv + r * Math.sin(t), z)) }
    for (let i = 1; i < segs - 1; i++) triN(p, ring[0], ring[i], ring[i + 1], [0, 0, up ? 1 : -1])
  }

  // ------------------------------------------------- face-frame helpers ---
  /** A vertical face: origin (u, v) on the wall, outward unit n. s runs to the viewer's right. */
  type Face = { o: P2; n: P2 }
  const FP = (F: Face, s: number, t: number, d: number): V3 => {
    const r: P2 = [-F.n[1], F.n[0]]
    return P(F.o[0] + r[0] * s + F.n[0] * d, F.o[1] + r[1] * s + F.n[1] * d, t)
  }
  /** Extrude a convex ccw polygon in the face's (s, t) plane from depth d0 to d1: front and sides. */
  function fslab(p: Part, F: Face, pts: P2[], d0: number, d1: number, back = false) {
    const r: P2 = [-F.n[1], F.n[0]]
    const nF: V3 = [F.n[0], F.n[1], 0]
    const front = pts.map(([s, t]) => FP(F, s, t, d1))
    for (let i = 1; i < front.length - 1; i++) triN(p, front[0], front[i], front[i + 1], nF)
    if (back) { const bk = pts.map(([s, t]) => FP(F, s, t, d0)); for (let i = 1; i < bk.length - 1; i++) triN(p, bk[0], bk[i + 1], bk[i], mul(nF, -1)) }
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      const e = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(e[0], e[1]); if (l < 1e-6) continue
      const os = e[1] / l, ot = -e[0] / l
      const n: V3 = [r[0] * os, r[1] * os, ot]
      quadN(p, FP(F, a[0], a[1], d0), FP(F, b[0], b[1], d0), FP(F, b[0], b[1], d1), FP(F, a[0], a[1], d1), n)
    }
  }
  /** A flat panel in the face plane at depth d (window panels). */
  function fpanel(p: Part, F: Face, pts: P2[], d: number) {
    const nF: V3 = [F.n[0], F.n[1], 0]
    const q = pts.map(([s, t]) => FP(F, s, t, d))
    for (let i = 1; i < q.length - 1; i++) triN(p, q[0], q[i], q[i + 1], nF)
  }
  const rectST = (s0: number, s1: number, t0: number, t1: number): P2[] => [[s0, t0], [s1, t0], [s1, t1], [s0, t1]]
  const ngonST = (cs: number, ct: number, r: number, n: number, ph = 0): P2[] =>
    Array.from({ length: n }, (_, i) => [cs + r * Math.cos(ph + (TAU * i) / n), ct + r * Math.sin(ph + (TAU * i) / n)] as P2)
  /** A bar in the face plane from the centre outwards at angle a (from +s, ccw), with a tail. */
  const barST = (cs: number, ct: number, a: number, len: number, tail: number, w0: number, w1: number): P2[] => {
    const c = Math.cos(a), s = Math.sin(a), px = -s, py = c
    const A: P2 = [cs - c * tail, ct - s * tail]
    const B: P2 = [cs + c * len, ct + s * len]
    return [[A[0] - px * w0, A[1] - py * w0], [B[0] - px * w1, B[1] - py * w1], [B[0] + c * w1 * 1.8, B[1] + s * w1 * 1.8], [B[0] + px * w1, B[1] + py * w1], [A[0] + px * w0, A[1] + py * w0]]
  }
  /** An annulus in the face plane: front ring at d1 plus outer and inner walls. */
  function fring(p: Part, F: Face, cs: number, ct: number, r0: number, r1: number, d0: number, d1: number, n: number) {
    const nF: V3 = [F.n[0], F.n[1], 0]
    const r: P2 = [-F.n[1], F.n[0]]
    for (let i = 0; i < n; i++) {
      const a = (TAU * i) / n, b = (TAU * (i + 1)) / n
      const pt = (rr: number, ang: number, d: number) => FP(F, cs + rr * Math.cos(ang), ct + rr * Math.sin(ang), d)
      quadN(p, pt(r0, a, d1), pt(r0, b, d1), pt(r1, b, d1), pt(r1, a, d1), nF)
      const no = (ang: number): V3 => [r[0] * Math.cos(ang), r[1] * Math.cos(ang), Math.sin(ang)]
      p.tri(pt(r1, a, d0), pt(r1, b, d0), pt(r1, b, d1), undefined, undefined, undefined, [no(a), no(b), no(b)])
      p.tri(pt(r1, a, d0), pt(r1, b, d1), pt(r1, a, d1), undefined, undefined, undefined, [no(a), no(b), no(a)])
      const ni = (ang: number): V3 => mul(no(ang), -1)
      p.tri(pt(r0, a, d0), pt(r0, b, d1), pt(r0, b, d0), undefined, undefined, undefined, [ni(a), ni(b), ni(b)])
      p.tri(pt(r0, a, d0), pt(r0, a, d1), pt(r0, b, d1), undefined, undefined, undefined, [ni(a), ni(a), ni(b)])
    }
  }
  /** The faces of an axis-aligned rectangle centred on the tower axis: N, E, S, W. */
  const faces = (hu: number, hv: number): Array<Face & { half: number }> => [
    { o: [0, hv], n: [0, 1], half: hu },
    { o: [hu, 0], n: [1, 0], half: hv },
    { o: [0, -hv], n: [0, -1], half: hu },
    { o: [-hu, 0], n: [-1, 0], half: hv },
  ]
  /** A pointed (two-centred) arch outline, convex, base t0 to apex. */
  const pointedST = (s0: number, s1: number, t0: number, tSpring: number, segs: number): P2[] => {
    const w = s1 - s0, R = w * 0.85, cL = s0 + R, cR = s1 - R
    const apexT = tSpring + Math.sqrt(R * R - (w / 2) ** 2)
    const pts: P2[] = [[s0, t0], [s1, t0], [s1, tSpring]]
    // right side arc: centre at cL, from angle 0 up to the apex
    const aTop = Math.acos((w / 2) / R)
    for (let i = 1; i < segs; i++) { const a = (aTop * i) / segs; pts.push([cL + R * Math.cos(a) - (cL + R - s1), tSpring + R * Math.sin(a)]) }
    pts.push([(s0 + s1) / 2, apexT])
    for (let i = segs - 1; i >= 1; i--) { const a = (aTop * i) / segs; pts.push([cR - R * Math.cos(a) + (s0 - (cR - R)), tSpring + R * Math.sin(a)]) }
    pts.push([s0, tSpring])
    return pts
  }

  // ------------------------------------------------------- facade bays ---
  /**
   * Window panels along every edge of a polygon between z0 and z1: bays of
   * about `bay` m with piers, rows of `row` m with spandrels. Edges shorter
   * than 1.5 bays get one panel if over 6 m.
   */
  function facadePoly(p: Part, poly: P2[], z0: number, z1: number, bay: number, row: number, opts: { pier?: number; spand?: number; corner?: number; arch?: boolean } = {}) {
    const { pier = 1.6, spand = 2.2, corner = 2.5, arch = false } = opts
    const q = ccw(poly)
    const rows = Math.max(1, Math.round((z1 - z0) / row)), rh = (z1 - z0) / rows
    for (let i = 0; i < q.length; i++) {
      const a = q[i], b = q[(i + 1) % q.length]
      const l = Math.hypot(b[0] - a[0], b[1] - a[1])
      const usable = l - 2 * corner
      if (usable < 5) continue
      const nb = Math.max(1, Math.round(usable / bay)), bw = usable / nb
      const n: P2 = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
      const F: Face = { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], n }
      for (let k = 0; k < nb; k++) {
        const s0 = -l / 2 + corner + k * bw + pier / 2, s1 = s0 + bw - pier
        for (let r = 0; r < rows; r++) {
          const t0 = z0 + r * rh + spand / 2, t1 = z0 + (r + 1) * rh - spand / 2
          if (arch && s1 - s0 < (t1 - t0)) {
            const pts = pointedST(s0, s1, t0, t1 - (s1 - s0) * 0.55, 3)
            fpanel(p, F, pts, 0.06)
          } else fpanel(p, F, rectST(s0, s1, t0, t1), 0.06)
        }
      }
    }
  }

  // ============================================================= PODIUM ===
  const ZP = 80
  block(M.stone, PODIUM, 0, ZP, null)
  capPoly(M.stone, PODIUM, ZP)
  // parapet ring on the podium edge (north and sides), stone, slightly proud
  // windows: two-storey arched groups
  facadePoly(M.win, PODIUM, 6, ZP - 4, detail ? 6.5 : 22, detail ? 9.5 : 24, { pier: detail ? 3 : 9, spand: detail ? 2.6 : 5, corner: 3, arch: detail })
  // north-front entrance steps (OSM 958867182/183/187), as traced
  block(M.stone, ENT67, 0, 67)
  block(M.stone, ENT50, 0, 50)
  block(M.stone, ENT55, 0, 55)
  {
    // the great portal: a pointed arch cut into the 55 m block's north face,
    // a real recess 4 m deep with its glazing at the back.
    const ex = ENT55[1][0] - ENT55[0][0], ey = ENT55[1][1] - ENT55[0][1], el = Math.hypot(ex, ey)
    const F: Face = { o: [(ENT55[0][0] + ENT55[1][0]) / 2, (ENT55[0][1] + ENT55[1][1]) / 2], n: [-ey / el, ex / el] }
    const arch = pointedST(-10, 10, 0.3, 30, detail ? 8 : 4)
    // frame around the opening: stone surround standing 0.6 m proud
    fslab(M.stone, F, rectST(-13, 13, 0.3, 46), 0, 0.6)
    // the recess: dark glazing at the back plus side reveals (window inside)
    fpanel(M.win, F, arch, 0.62)
    if (detail) {
      // gold outline of the arch
      const ring = pointedST(-11, 11, 0.3, 30, 8)
      for (let i = 2; i < ring.length - 1; i++) fslab(M.gold, F, [ring[i], ring[i + 1], [ring[i + 1][0] * 0.92, ring[i + 1][1] - 0.9], [ring[i][0] * 0.92, ring[i][1] - 0.9]].map(([s, t]) => [s, t] as P2), 0.6, 0.85)
      // windows on the flanking 67 m block above the portal
      facadePoly(M.win, ENT67, 56, 66, 6, 10, { corner: 2 })
    }
    facadePoly(M.win, ENT50, 6, 48, detail ? 6 : 12, detail ? 9 : 14, { corner: 6, arch: detail })
  }
  // NW strip (30 m) and E wedge (36 m), one-sided as OSM maps them
  block(M.stone, NW_STRIP, 0, 30)
  facadePoly(M.win, NW_STRIP, 5, 28, detail ? 6 : 12, detail ? 8 : 12, { corner: 2 })
  block(M.stone, E_WEDGE, 0, 36)

  // ========================================================= HOTEL TOWERS ===
  /** A tower with grouped glass bays and either a crown of pointed gables or a flat top. */
  function hotelTower(poly: P2[], zBase: number, H: number, crown: boolean) {
    const cH = crown ? (H > 260 ? 24 : 21) : 0
    const zb = H - cH - (crown ? 0 : 4)
    block(M.stone, poly, zBase, zb, null)
    facadePoly(M.win, poly, zBase + 3, zb - 3, detail ? 7.5 : 20, detail ? 10 : 66, { pier: detail ? 3.8 : 10, spand: detail ? 1.6 : 5, corner: 4 })
    const c = centroid(ccw(poly))
    if (!crown) {
      // cornice, parapet and plant room
      const ring = offset(poly, 1.2)
      walls(M.stone, ring, zb, zb + 1.6); capPoly(M.stone, ring, zb + 1.6); capPoly(M.stone, ring, zb, false)
      walls(M.stone, poly, zb + 1.6, zb + 4)
      capPoly(M.stone, poly, zb + 4)
      block(M.stone, scaleTo(ccw(poly), c, 0.45), zb + 4, zb + 9)
      return
    }
    // Crown: two white tiers of upswept, spiky eaves (cornice, sloped skirt,
    // a row of pointed gables, horns at the corners), then a small grey-teal
    // glass pyramid and a spike.
    const q = ccw(poly)
    const W = M.white
    /** One tier: a cornice ring at z, a skirt up to `inner` at z + rise, gables, horns. */
    const tier = (outer: P2[], inner: P2[], z: number, corn: number, rise: number, gh: number, horn: number) => {
      walls(W, outer, z, z + corn); capPoly(W, outer, z, false)
      const zt = z + corn
      loftRings(W, outer.map(([u, v]) => P(u, v, zt)), inner.map(([u, v]) => P(u, v, zt + rise)), P(c[0], c[1], zt - 10))
      const n = outer.length, gw = detail ? 6 : 13
      for (let i = 0; i < n; i++) {
        const a = outer[i], b = outer[(i + 1) % n]
        const l = Math.hypot(b[0] - a[0], b[1] - a[1])
        const e: P2 = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], nn: P2 = [e[1], -e[0]]
        const ng = Math.floor((l - 6) / gw)
        if (ng >= 1) {
          const F: Face = { o: [(a[0] + b[0]) / 2 - nn[0] * 0.4, (a[1] + b[1]) / 2 - nn[1] * 0.4], n: nn }
          const span = ng * gw
          for (let k = 0; k < ng; k++) {
            const s0 = -span / 2 + k * gw + 0.3, s1 = s0 + gw - 0.6
            const tri: P2[] = [[s0, zt], [s1, zt], [(s0 + s1) / 2, zt + gh]]
            if (detail) fslab(W, F, tri, -0.6, 0, true)
            else { fpanel(W, F, tri, 0); fpanel(W, { o: F.o, n: [-nn[0], -nn[1]] }, tri.map(([ss, tt]) => [-ss, tt] as P2).reverse(), 0.6) }
          }
        }
        // an upswept horn at the corner: a slim pyramid leaning outwards
        const pv = outer[(i + n - 1) % n]
        const d1: P2 = [a[0] - pv[0], a[1] - pv[1]], d2: P2 = [a[0] - b[0], a[1] - b[1]]
        const l1 = Math.hypot(...d1), l2 = Math.hypot(...d2)
        let out: P2 = [d1[0] / l1 + d2[0] / l2, d1[1] / l1 + d2[1] / l2]
        const lo = Math.hypot(...out) || 1; out = [out[0] / lo, out[1] / lo]
        const tip = P(a[0] + out[0] * horn * 0.35, a[1] + out[1] * horn * 0.35, zt + horn)
        const w = 1.3, base = [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([x, y]) => P(a[0] - out[0] * 0.8 + x * w, a[1] - out[1] * 0.8 + y * w, zt))
        for (let k = 0; k < 4; k++) {
          const p0 = base[k], p1 = base[(k + 1) % 4]
          let m = unit(cross(sub(p1, p0), sub(tip, p0)))
          const ctr = P(a[0] - out[0] * 0.8, a[1] - out[1] * 0.8, zt + horn * 0.3)
          if (dot(m, sub(mul(add(add(p0, p1), tip), 1 / 3), ctr)) < 0) m = mul(m, -1)
          triN(W, p0, p1, tip, m)
        }
      }
    }
    const o1 = offset(q, 2.4), i1 = scaleTo(q, c, 0.78)
    tier(o1, i1, zb, 1.8, 4.5, cH * 0.36, cH * 0.55)
    const o2 = offset(i1, 0.8), i2 = scaleTo(q, c, 0.5)
    tier(o2, i2, zb + 6.3, 1.5, 4, cH * 0.3, cH * 0.45)
    // glass pyramid and the spike
    const zg = zb + 11.8, r3 = scaleTo(q, c, 0.12)
    loftRings(M.win, i2.map(([u, v]) => P(u, v, zg)), r3.map(([u, v]) => P(u, v, H - 2)), P(c[0], c[1], zg - 5))
    capPoly(W, r3, H - 2)
    lathe(W, c[0], c[1], [[1.4, H - 2], [0, H + 5]], detail ? 8 : 4)
  }
  hotelTower(HAJAR, ZP, 279, true)
  hotelTower(mirror(HAJAR), ZP, 279, true)
  hotelTower(MARWAH, ZP, 220, false)
  hotelTower(mirror(MARWAH), ZP, 220, false)
  // Qibla and Maqam on their own 51 m podiums: the podium is the tower's own footprint
  for (const poly of [MAQAM, mirror(MAQAM)]) {
    block(M.stone, poly, 0, 51, null)
    facadePoly(M.win, poly, 5, 49, detail ? 6.5 : 20, detail ? 9 : 44, { pier: detail ? 3 : 9, spand: detail ? 2.4 : 6, corner: 3, arch: detail })
    // a stone band at the podium top
    const ring = offset(poly, 0.8)
    walls(M.stone, ring, 49, 52); capPoly(M.stone, ring, 52, false)
    hotelTower(poly, 52, 232, true)
  }

  // =========================================================== CLOCK TOWER ===
  const ZS = 356 // shaft top
  const ZCap = 403, ZBand = 426, ZClock = 469, ZStage = 494
  const SU = 40, SV = 28 // shaft half sizes
  // shaft: notched corners (two steps of 1.8 m)
  const notch = (hu: number, hv: number, s: number): P2[] => {
    const pts: P2[] = []
    const corners: P2[] = [[hu, -hv], [hu, hv], [-hu, hv], [-hu, -hv]]
    // ccw from SE corner: each corner replaced by a 2-step notch
    const sgn = [[1, -1], [1, 1], [-1, 1], [-1, -1]]
    for (let k = 0; k < 4; k++) {
      const [x, y] = corners[k], [sx, sy] = sgn[k]
      // entering the corner along the previous edge, leaving along the next
      if (k % 2 === 0) { // SE: coming from S edge (moving +x) then up E edge
        pts.push([x - sx * 2 * s, y], [x - sx * 2 * s, y - sy * s], [x - sx * s, y - sy * s], [x - sx * s, y - sy * 2 * s], [x, y - sy * 2 * s])
      } else { // NE: coming up E edge then moving -x along N edge
        pts.push([x, y - sy * 2 * s], [x - sx * s, y - sy * 2 * s], [x - sx * s, y - sy * s], [x - sx * 2 * s, y - sy * s], [x - sx * 2 * s, y])
      }
    }
    return pts
  }
  const shaft = notch(SU, SV, 1.8)
  walls(M.stone, shaft, 0, ZS)
  // shaft glass: bays across each face between the notched corners
  for (const F of faces(SU, SV)) {
    const bays = F.half > 35 ? (detail ? 12 : 7) : (detail ? 8 : 5)
    const span = (F.half - 5) * 2, bw = span / bays
    const rowsH = detail ? 9.2 : 39
    const zLo = F.n[1] < 0 ? 8 : ZP + 2
    const rows = Math.round((ZS - 6 - zLo) / rowsH), rh = (ZS - 6 - zLo) / rows
    for (let k = 0; k < bays; k++) {
      const pr = detail ? 2.8 : 5, s0 = -F.half + 5 + k * bw + pr / 2, s1 = s0 + bw - pr
      for (let r = 0; r < rows; r++) fpanel(M.win, F, rectST(s0, s1, zLo + r * rh + (detail ? 0.6 : 1.2), zLo + (r + 1) * rh - (detail ? 0.6 : 1.2)), 0.06)
    }
    // corner pier strips stay stone; a stone band at the shaft top
  }
  // ledge at the shaft top
  { const r = [[-SU - 0.8, -SV - 0.8], [SU + 0.8, -SV - 0.8], [SU + 0.8, SV + 0.8], [-SU - 0.8, SV + 0.8]] as P2[]; walls(M.stone, r, ZS - 3, ZS); capPoly(M.stone, r, ZS - 3, false) }

  // capital 356-416.5: bronze body, pilasters, two tiers of tall windows
  const KU = 41.5, KV = 31.5
  const capRect: P2[] = [[-KU, -KV], [KU, -KV], [KU, KV], [-KU, KV]]
  walls(M.bronze, capRect, ZS, ZCap)
  capPoly(M.bronze, capRect, ZS, false)
  for (const F of faces(KU, KV)) {
    const nP = F.half > 35 ? (detail ? 13 : 6) : (detail ? 10 : 5)
    const span = F.half * 2 - 4, pw = span / (nP - 1)
    for (let k = 0; k < nP; k++) {
      const s = -F.half + 2 + k * pw
      fslab(M.bronze, F, rectST(s - 0.9, s + 0.9, ZS + 1, ZCap - 2), 0, 1.0)
    }
    // ledge between the tiers
    fslab(M.bronze, F, rectST(-F.half, F.half, 379.5, 381.5), 0, 1.3)
    for (let k = 0; k < nP - 1; k++) {
      const s0 = -F.half + 2 + k * pw + 1.8, s1 = s0 + pw - 3.6
      for (const [t0, t1] of [[359, 378.5], [383, 400.5]]) {
        const pts = detail ? pointedST(s0, s1, t0, t1 - (s1 - s0) * 0.5, 4) : rectST(s0, s1, t0, t1)
        fpanel(M.win, F, pts, 0.06)
      }
    }
  }
  // display band 403-426: projecting bronze frame with the green band
  const BU = 42.5, BV = 32.5
  const bandRect: P2[] = [[-BU, -BV], [BU, -BV], [BU, BV], [-BU, BV]]
  walls(M.bronze, bandRect, ZCap, ZBand)
  capPoly(M.bronze, bandRect, ZCap, false)
  capPoly(M.bronze, bandRect, ZBand, true)
  for (const F of faces(BU, BV)) {
    // the band's script line: brown by day with raised gold strips above and
    // below, and (detail) a row of raised gold script panels between them
    fslab(M.gold, F, rectST(-F.half + 2.5, F.half - 2.5, 420.3, 421.6), 0, 0.45)
    fslab(M.gold, F, rectST(-F.half + 2.5, F.half - 2.5, 410.2, 411.5), 0, 0.45)
    if (detail) {
      const nS = Math.floor((F.half * 2 - 7) / 4.2)
      for (let k = 0; k < nS; k++) {
        const s0 = -((nS * 4.2) / 2) + k * 4.2 + 0.5
        fslab(M.gold, F, rectST(s0, s0 + 3.2, 413 + (k % 2) * 0.8, 418.6 - ((k + 1) % 2) * 0.8), 0, 0.3)
      }
    } else fpanel(M.gold, F, rectST(-F.half + 6, F.half - 6, 414.6, 416.2), 0.12)
    // a moulded ledge at the band's foot
    fslab(M.bronze, F, rectST(-F.half, F.half, ZCap, ZCap + 2.5), 0, 0.8)
  }
  // small gold finials on the band's corners
  if (detail) for (const [su, sv] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    lathe(M.gold, su * (BU - 1.2), sv * (BV - 1.2), [[1.1, ZBand], [1.1, ZBand + 1.5], [0.7, ZBand + 2.5], [0, ZBand + 5]], 6)
  }

  // clock stage 426-494: bronze block with corner turrets
  const AU = 31.5, AV = 30.5, T = 9.8
  const stage: P2[] = [[-AU, -AV], [AU, -AV], [AU, AV], [-AU, AV]]
  walls(M.bronze, stage, ZBand, ZStage)
  capPoly(M.bronze, stage, ZStage)
  for (const [su, sv] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const u0 = su * (AU + 0.8), u1 = su * (AU + 0.8 - T), v0 = sv * (AV + 0.8), v1 = sv * (AV + 0.8 - T)
    const sq: P2[] = [[Math.min(u0, u1), Math.min(v0, v1)], [Math.max(u0, u1), Math.min(v0, v1)], [Math.max(u0, u1), Math.max(v0, v1)], [Math.min(u0, u1), Math.max(v0, v1)]]
    block(M.bronze, sq, ZBand, 490)
    const cu = (u0 + u1) / 2, cv = (v0 + v1) / 2
    // gold ring at the clock's top and the gold dome with its finial
    const ring = offset(sq, 0.35)
    walls(M.gold, ring, 466.5, 469.5); capPoly(M.gold, ring, 469.5); capPoly(M.gold, ring, 466.5, false)
    lathe(M.gold, cu, cv, (detail ? [[4.9, 490], [4.9, 492], [4.1, 493.5], [3.9, 497], [2.6, 501], [1.4, 505.5], [0.7, 509], [1.0, 510.5], [0, 516]] : [[4.9, 490], [4.9, 492], [3.4, 497], [1.4, 506], [0, 516]]) as P2[], detail ? 12 : 6)
    if (detail) {
      // vertical gold grooves on the turret faces
      for (const F of [{ o: [cu, sv * (AV + 0.8)] as P2, n: [0, sv] as P2 }, { o: [su * (AU + 0.8), cv] as P2, n: [su, 0] as P2 }]) {
        const Fs = { o: F.o, n: F.n }
        const cs = F.n[0] === 0 ? (cu * (F.n[1] > 0 ? -1 : 1) - 0) : (cv * (F.n[0] > 0 ? 1 : -1))
        void cs
        for (const ds of [-2.4, 0, 2.4]) {
          const s = (F.n[0] === 0 ? -F.n[1] * (cu - F.o[0]) : F.n[0] * (cv - F.o[1])) + ds
          fslab(M.gold, Fs, rectST(s - 0.45, s + 0.45, 429, 464), 0, 0.25)
        }
      }
    }
  }

  // the four clock faces
  const H10 = (Math.PI / 2) - (10 + 10 / 60) * (TAU / 12) // hour hand at 10:10
  const M10 = (Math.PI / 2) - 10 * (TAU / 60) // minute hand at 2
  for (const F of faces(AU, AV)) {
    const ct = 447.5, cs = 0
    // gold square frame (43 m), standing 0.9 m proud
    fslab(M.gold, F, rectST(-21.5, 21.5, 426.2, 468.8), 0, 0.9)
    // white dial
    const segs = detail ? 48 : 16
    fslab(M.white, F, ngonST(cs, ct, 18.5, segs, Math.PI / segs), 0.9, 1.25)
    // gold rim ring (a real raised rim around the dial)
    fring(M.gold, F, cs, ct, 18.4, 19.6, 0.9, 1.8, segs)
    // hour bars (bronze), radial, bolder at 12/3/6/9
    for (let h = 0; h < 12; h++) {
      const a = (Math.PI / 2) - h * (TAU / 12)
      const major = h % 3 === 0
      const r0 = major ? 12.4 : 13.6, r1 = 17.2, w = major ? 1.15 : 0.7
      const c = Math.cos(a), s = Math.sin(a), px = -s, py = c
      const bar: P2[] = [[cs + c * r0 - px * w, ct + s * r0 - py * w], [cs + c * r1 - px * w, ct + s * r1 - py * w], [cs + c * r1 + px * w, ct + s * r1 + py * w], [cs + c * r0 + px * w, ct + s * r0 + py * w]]
      if (major || detail) fslab(M.bronze, F, bar, 1.25, 1.5)
      else fpanel(M.bronze, F, bar, 1.32)
    }
    if (detail) {
      // inner chapter ring and minute dots
      fring(M.gold, F, cs, ct, 10.6, 11.2, 1.25, 1.45, 40)
      for (let m = 0; m < 60; m++) {
        if (m % 5 === 0) continue
        const a = (TAU * m) / 60
        fslab(M.bronze, F, ngonST(cs + Math.cos(a) * 17.6, ct + Math.sin(a) * 17.6, 0.32, 5), 1.25, 1.4)
      }
      // corner rosettes on the gold square
      for (const [ss, tt] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        fslab(M.gold, F, ngonST(cs + ss * 18.6, ct + tt * 18.6, 2.0, 8, Math.PI / 8), 0.9, 1.4)
        fslab(M.gold, F, ngonST(cs + ss * 18.6, ct + tt * 18.6, 1.0, 6), 1.4, 1.75)
      }
      // central medallion (the palm-and-swords emblem, plain)
      fring(M.gold, F, cs, ct, 3.3, 4.4, 1.25, 1.55, 24)
    }
    // hands: hour (12.5 + 3 tail) and minute (17 + 4 tail), bronze, the minute in front
    fslab(M.bronze, F, barST(cs, ct, H10, 12.5, 3, 0.9, 0.55), 1.55, 1.95)
    fslab(M.bronze, F, barST(cs, ct, M10, 17, 4, 0.7, 0.4), 1.95, 2.3)
    fslab(M.gold, F, ngonST(cs, ct, 1.3, 10), 2.3, 2.6)

    // Allah stage 469-494: white panel under a pointed gable in a gold border
    const gable: P2[] = [[-18, 470.3], [18, 470.3], [18, 483], [13, 487.5], [6.5, 490.6], [0, 492.4], [-6.5, 490.6], [-13, 487.5], [-18, 483]]
    const border = gable.map(([s, t]) => [s * 1.07, 469.6 + (t - 469.6) * 1.06] as P2)
    fslab(M.gold, F, border, 0, 0.45)
    fslab(M.white, F, gable, 0.45, 0.7)
    if (detail) {
      fring(M.gold, F, 0, 479.5, 3.4, 4.4, 0.7, 0.95, 24)
      fslab(M.gold, F, ngonST(0, 479.5, 1.6, 8, Math.PI / 8), 0.7, 1.0)
    }
  }

  // crown: faceted teal glass jewel with gold ribs
  const jewel: P2[] = [[10.2, ZStage + 1.5], [13.4, 498.5], [14.1, 503.5], [13.5, 509], [11.3, 514.5], [8, 519], [5.2, 522]]
  lathe(M.green, 0, 0, jewel, 8, { phase: Math.PI / 8, facet: true, smooth: 50 })
  discCap(M.gold, 0, 0, 5.2, 522, 8, true, Math.PI / 8)
  // gold ribs on the jewel's eight edges
  for (let k = 0; k < 8; k++) {
    const t = (TAU * k) / 8 + Math.PI / 8 + Math.PI / 8 // edges of the faceted lathe sit between columns
    const ta = (TAU * k) / 8 + Math.PI / 8
    const c = Math.cos(ta), s = Math.sin(ta)
    void t
    const sec = jewel.map(([r, z]) => [r + 0.25, z] as P2)
    for (let b = 0; b < sec.length - 1; b++) {
      const [r0, z0] = sec[b], [r1, z1] = sec[b + 1]
      const w = 0.45
      const px = -s * w, py = c * w
      const a0 = P(c * r0 + px, s * r0 + py, z0), b0 = P(c * r0 - px, s * r0 - py, z0)
      const a1 = P(c * r1 + px, s * r1 + py, z1), b1 = P(c * r1 - px, s * r1 - py, z1)
      const out: V3 = unit([c * (z1 - z0), s * (z1 - z0), -(r1 - r0)])
      quadN(M.gold, b0, a0, a1, b1, out)
    }
  }
  // gold collar ring at the jewel's foot
  lathe(M.gold, 0, 0, [[13.4, ZStage - 0.2], [13.4, ZStage + 2.2], [10.2, ZStage + 2.2]], detail ? 24 : 8)

  // spire 522-580: gold, a drum, a long tapered shaft with ribs, a bulb
  const spire: P2[] = !detail ? [[5.2, 522], [5.2, 528], [4.4, 530], [3.4, 556], [2.2, 569], [3.0, 573], [0.9, 580.5]] : [[5.2, 522], [5.4, 526], [4.6, 529], [4.6, 537], [3.6, 540], [3.4, 556], [2.6, 563], [2.2, 569], [3.0, 572.5], [2.8, 575.5], [1.4, 578.5], [0.9, 580.5]]
  lathe(M.gold, 0, 0, spire, detail ? 16 : 8, { smooth: 30 })
  // eight tall fins on the spire (the gold lattice reads as ribs)
  const fins = detail ? 8 : 4
  for (let k = 0; k < fins; k++) {
    const a = (TAU * k) / fins + Math.PI / 4
    const c = Math.cos(a), s = Math.sin(a)
    const F: Face = { o: [0, 0], n: [-s, c] } // face plane through the axis, containing direction (c, s)
    // in this face frame, s-axis = r = (-n.v, n.u) = (-c, -s): so radial distance r -> s = -r
    fslab(M.gold, F, [[-3.4, 538], [-6.0, 541], [-4.6, 562], [-2.4, 570]].map(([ss, tt]) => [ss, tt] as P2).reverse(), -0.35, 0.35, true)
  }
  // crescent 580-601, horns up, in the E-W plane (seen face-on from N and S)
  {
    const R = 10.5, cz = 594.4
    const segs = detail ? 28 : 12
    const off = 4.6 // inner circle centre raised
    const Ri = 8.4
    const th = detail ? 1.8 : 2.2
    // horn tips: intersections of the two circles
    const yI = (R * R - Ri * Ri + off * off) / (2 * off) // height of intersection from outer centre
    const xI = Math.sqrt(Math.max(0, R * R - yI * yI))
    const aStart = Math.atan2(yI, xI), aEnd = Math.PI - aStart
    // outer arc goes the long way round, below: from aEnd (left tip) down to aStart+2PI (right tip)
    const outer: P2[] = [], inner: P2[] = []
    for (let i = 0; i <= segs; i++) {
      const a = aEnd + ((aStart + TAU - aEnd) * i) / segs
      outer.push([R * Math.cos(a), cz + R * Math.sin(a)])
    }
    const bStart = Math.atan2(yI - off, xI), bEnd = Math.PI - bStart
    for (let i = 0; i <= segs; i++) {
      const a = bEnd + ((bStart + TAU - bEnd) * i) / segs
      inner.push([Ri * Math.cos(a), cz + off + Ri * Math.sin(a)])
    }
    const F: Face = { o: [0, 0], n: [0, 1] }
    // front and back faces as quad strips, plus outer and inner walls
    for (const side of [1, -1]) {
      const Fs: Face = side > 0 ? F : { o: [0, 0], n: [0, -1] }
      const d = th / 2
      for (let i = 0; i < segs; i++) {
        // face-frame s for the back face is mirrored
        const m = (p: P2): P2 => [side > 0 ? p[0] : -p[0], p[1]]
        const q = [m(outer[i]), m(outer[i + 1]), m(inner[i + 1]), m(inner[i])]
        fpanel(M.gold, Fs, side > 0 ? q.slice().reverse() : q, d)
      }
    }
    for (let i = 0; i < segs; i++) {
      for (const [ring, sign] of [[outer, 1], [inner, -1]] as [P2[], number][]) {
        const a = ring[i], b = ring[i + 1]
        const A0 = FP(F, a[0], a[1], -th / 2), A1 = FP(F, a[0], a[1], th / 2), B0 = FP(F, b[0], b[1], -th / 2), B1 = FP(F, b[0], b[1], th / 2)
        const cc: V3 = sign > 0 ? P(0, 0, cz) : P(0, 0, cz + off)
        const mid: V3 = mul(add(A0, B1), 0.5)
        let n = unit(sub(mid, cc)); n = [n[0], 0 * n[1] + n[1], n[2]]
        if (sign < 0) n = mul(n, -1)
        n = unit([n[0], 0, n[2]])
        quadN(M.gold, A0, B0, B1, A1, n)
      }
    }
    // stem from the spire into the crescent's bottom
    lathe(M.gold, 0, 0, [[1.0, 579.5], [1.0, 584.6], [0, 584.6]], 6)
  }

  return M
}

// ----------------------------------------------------------------- write ---
// Night: gold floodlit (spire, crescent, frames, domes); the turrets and
// bronze upper stages lightly; dials glow white (neon-clock) and the band
// and glass crown green (neon-green); windows glow.
const goldLit = (p: V3, n: V3) => (n[2] > 0.85 ? 0.4 : 1)
const bronzeLit = (p: V3, n: V3) => (p[2] > 420 ? (n[2] > 0.85 ? 0.3 : 0.75) : p[2] > 350 ? 0.35 : 0)
function materials(M: Mats): Array<{ part: Part; material: MaterialSpec }> {
  return [
    { part: M.stone, material: finish('abraj-stone', 0xdcc0a6) },
    { part: M.bronze, material: { ...finish('abraj-bronze-stone', 0xa98672), floodlight: bronzeLit } },
    { part: M.win, material: { ...PALETTE.window, color: 0x86a3a1 } },
    { part: M.gold, material: { ...finish('abraj-gold', 0xcfa54c, 0.5), floodlight: goldLit } },
    { part: M.white, material: finish('neon-clock', 0xf3f1ea, 0.6) },
    { part: M.green, material: finish('neon-green', 0x6a9e92, 0.4) },
  ]
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Abraj Al Bait', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: BEARING, elevation: 0, height: 601,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes, ${triangles} tris`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  await write('mecca-abraj-al-bait.glb', materials(build(false)), 6500, 250_000)
  await write('mecca-abraj-al-bait.detail.glb', materials(build(true)), 40_000, 1536 * 1024)
}
