/**
 * Haus der Kulturen der Welt (the former Kongresshalle, Hugh Stubbins,
 * 1956-1957; roof rebuilt 1984-1987), Berlin-Tiergarten, with the
 * Carillon (1987) to its south-east: original procedural geometry, CC0-1.0.
 * bun generators/berlin-haus-der-kulturen.ts
 * Imports the kit from berlin-reichstag.ts and berlin-chancellery.ts
 * (merge those first).
 *
 * Map frame, BEARING 0 (the hall's axes run north-south and east-west):
 * +y north, +x east, z up, metres. z = 0 the forecourt (Mapterhorn: flat
 * to 0.6 m). Origin = the area centroid of OSM way/1065864180 (the shift
 * from the fetch centre, 13.36484, 52.51879, is applied at the end).
 *
 * What makes it the "pregnant oyster", and how each is drawn
 * - The swooping white shell roof: an eye-shaped saddle in plan (81 m long, 63 m
 *   across), resting on its two points east and west on the podium and
 *   rising in the two great edge arches north and south (to 33 m, leaning outward), the
 *   shell sagging between them; the fat white edge beam, the pale soffit
 *   with the ring of lamps under each arch (lamps glow at night).
 * - Under it, the auditorium drum clad in copper-orange panels, flaring out
 *   as it rises, on its ring of foyer glass.
 * - The broad podium (8.5 m) with its glazed, recessed ground storey, the
 *   colonnade of eleven columns along the south front, the grand stair up
 *   from between the pool halves, and the long ramps and stairs east and
 *   west.
 * - The reflecting pool's stone edge (the water is the map's).
 * - The Carillon, 140 m to the south-east: four tall slabs of dark granite
 *   round the open bell shaft, under the projecting flat cap (42 m).
 *
 * Sources
 * - OSM way/1065864180 (outline, wikidata Q704933) and its parts: the roof
 *   way/9377007 (19.5-20, diagonal_pass), the drum way/263544356 (8.5-15)
 *   and way/263544357 (15-19.5), the podium relation/3471655 (8-8.5) and
 *   relation/3539307 (8), the colonnade way/259759251-261 (8 m), the
 *   stairs and ramps way/258741778, /781, /783, way/259067893, /894,
 *   way/259068134, way/259587878, /880, the canopy way/277437200; the pool
 *   way/182511971 (water=reflecting_pool); the Carillon way/1065494287
 *   (42 m, roof colour #63666e, wikidata Q896244) and its parts way/1065489040-043
 *   (the slabs), way/1066425171 (bell tower) and way/37410673 (the cap). (c) OpenStreetMap
 *   contributors, ODbL.
 * - Photos (Wikimedia Commons), opened and compared:
 *   "Haus der Kulturen der Welt, Blaue Stunde, Berlin, 160521, ako.jpg" and
 *     "... 160521, ako (1).jpg", Ansgar Koreng, CC BY-SA 3.0 de (the south
 *     front over the pool, frontal, at dusk: the arch, the drum, the lamps,
 *     the stair),
 *     https://commons.wikimedia.org/wiki/File:Haus_der_Kulturen_der_Welt,_Blaue_Stunde,_Berlin,_160521,_ako.jpg
 *   "Haus der Kulturen der Welt, Berlin, 150607, ako.jpg", Ansgar Koreng,
 *     CC BY-SA 3.0 de (the west stair and ramp);
 *   "Berlin Kongresshalle BW 1.jpg" and "BW 3", Berthold Werner,
 *     CC BY-SA 3.0 (the roof edge from the terrace, the flared drum on its
 *     foyer glass),
 *     https://commons.wikimedia.org/wiki/File:Berlin_Kongresshalle_BW_1.jpg
 *   "Haus der Kulturen der Welt 01.jpg", Mihael Grmek, CC BY-SA 3.0;
 *   "Haus der Kulturen der Welt (31740982332).jpg", Billie Grace Ward,
 *     CC BY 2.0 (the south front frontal: podium, colonnade, arch);
 *   "Haus der Kulturen der Welt, Berlin.jpg", Chris Vollmer, CC BY-SA 4.0
 *     (the drum's panels and the soffit lamps close up);
 *   Carillon: "150515 Carillon (Berlin-Tiergarten).jpg", Ansgar Koreng,
 *     CC BY 3.0 de; "Carillon Berlin-Tiergarten.jpg", DanielMichaelPerry,
 *     CC0; "Carillon (Berlin-Tiergarten)-msu-1053-.jpg", Matthias Süßen,
 *     CC BY-SA 4.0 (the slabs and the cap from below).
 * - Look-only: none.
 *
 * Measured / published / estimated
 * - From OSM: every plan line, the podium 8.5, the Carillon's plan and
 *   height.
 * - Estimated from the photos: the drum (foyer glass 8.5-11, panels
 *   11-19.5 (OSM's top), radius 24.2 flaring to 27); the shell (tips
 *   8.6, centre 24, edge arches 33 m, leaning out 0.28 m per metre of rise: OSM's flat 19.5-20 is a
 *   simplification; in Ward's frontal photo the arch stands about 1.4
 *   times the drum's top); edge beam 1.2-2.4 m.
 * - Estimated: the Carillon's slabs (4.6 m wide, 2 m slots) and cap
 *   (40.5-42, 1.4 m overhang); the pool coping (0.5 m wide, 0.35 m high).
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { lathe, face, tube, ellipsoid, TAU } from './nyc-columbus-monument'
import { writeModel, box, cbox } from './london-buckingham-palace'
import { LOW, HIGH, type Q } from './london-albert-memorial'
import { welded, ringOffset, ringLoft, ringBand, ccw, faceOf, fpanel, flen, type XY } from './berlin-kit'

export const BEARING = 0
/** Area centroid of the outline in the fetch frame; computed by the header's method. */
const C0: XY = [-0.69, 6.92]

const POOL: XY[] = [[-43.2, -49.1], [-43.6, -117.9], [-20.4, -118.0], [-20.4, -66.2], [-7.5, -66.3], [-7.7, -117.5], [40.3, -117.6], [40.4, -49.4], [-7.5, -49.2], [-20.3, -49.2]]

export function build(Q: Q) {
  const conc = new Part(), drum = new Part(), win = new Part(), roof = new Part(), gran = new Part(), lamp = new Part()
  const D = Q.detail
  const ZP = 8.5, YC = -5.35

  // ===== Podium ============================================================
  {
    const x0 = -45.2, x1 = 44.9, y0 = -34.0, y1 = 54.0
    const ring: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    // Recessed glazed ground storey, the concrete fascia above, the terrace.
    const inner = ringOffset(ring, -2.0)
    ringLoft(win, inner, 0, 6.3)
    ringLoft(gran, ring, 6.3, ZP)
    ringBand(gran, inner, ring, 6.3, false)
    for (const [a, b, c, d] of [[[x0, y0], [x1, y0], [x1, y1], [x0, y1]]] as XY[][]) roof.quad([a[0], a[1], ZP], [b[0], b[1], ZP], [c[0], c[1], ZP], [d[0], d[1], ZP])
    // Piers at the corners holding the fascia.
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[]) cbox(gran, x - (x < 0 ? 0 : 2.2), y - (y < 0 ? 0 : 2.2), x + (x < 0 ? 2.2 : 0), y + (y < 0 ? 2.2 : 0), 0, 6.3, 0)
    // The south colonnade under the terrace's edge.
    box(gran, x0, -36.6, x1, y0, 7.5, ZP, true)
    conc.quad([x0, -36.6, 7.5], [x0, y0, 7.5], [x1, y0, 7.5], [x1, -36.6, 7.5])
    for (const x of [-43.9, -35.3, -26.65, -18.1, -9.5, -0.9, 7.75, 16.35, 24.95, 33.55, 42.15]) lathe(conc, [[0.45, 0], [0.45, 7.5]], D ? 12 : 6, x, -35.5, false)
    // The grand stair from the forecourt between the pool halves: flight, landing, flight, bridge.
    const sx0 = -20.3, sx1 = -7.5, n = D ? 10 : 5
    for (let k = 0; k < n; k++) box(conc, sx0, -66.3 + 5.6 * k / n, sx1, -60.7, 0, 4 * (k + 1) / n)
    for (let k = 0; k < n; k++) box(conc, sx0, -56.1 + 5.1 * k / n, sx1, -51.0, 4, 4 + 4.5 * (k + 1) / n)
    box(conc, sx0, -51.0, sx1, -36.6, 7.4, ZP)
    conc.quad([sx0, -51, 7.4], [sx0, -36.6, 7.4], [sx1, -36.6, 7.4], [sx1, -51, 7.4])
    for (const x of [sx0 - 0.4, sx1]) box(conc, x, -66.3, x + 0.4, -36.6, 0, ZP + 1.0)
    // East and west: a long ramp up to 5 m, then the stair to the terrace, white parapets on piers.
    for (const e of [-1, 1]) {
      const xa = e * 79.0, xb = e * 39.0, xc = e * 26.6, ya = 15.0, yb = 22.1, t = 0.6
      const slab = (xs: number, xe: number, zs: number, ze: number) => {
        const lo = Math.min(xs, xe), hi = Math.max(xs, xe), zl = xs < xe ? zs : ze, zh = xs < xe ? ze : zs
        face(conc, [lo, ya, zl], [hi, ya, zh], [hi, yb, zh], [lo, yb, zl], [0, 18, -50])
        face(conc, [lo, ya, zl - t], [lo, yb, zl - t], [hi, yb, zh - t], [hi, ya, zh - t], [0, 18, 50])
        for (const y of [ya, yb]) {
          face(conc, [lo, y, zl - t], [hi, y, zh - t], [hi, y, zh + 1.1], [lo, y, zl + 1.1], [0, 18.5, zh])
          face(conc, [hi, y, zh - t], [lo, y, zl - t], [lo, y, zl + 1.1], [hi, y, zh + 1.1], [0, y + (y === ya ? -1 : 1) * 0.0 + (y === ya ? 5 : -5), zh])
        }
      }
      slab(xa, xb, 0.6, 5.0)
      slab(xb, xc, 5.0, ZP)
      for (const f of [0.3, 0.6, 0.85]) {
        const x = xa + (xb - xa) * f, z = 0.3 + 4.7 * f
        cbox(conc, x - 0.5, ya + 2.5, x + 0.5, yb - 2.5, 0, z - 0.6, 0)
      }
    }
    // The canopy on the north-east.
    box(conc, 24.1, 22.0, 36.4, 54.4, 9.0, 9.5)
    conc.quad([24.1, 22.0, 9.0], [24.1, 54.4, 9.0], [36.4, 54.4, 9.0], [36.4, 22.0, 9.0])
  }

  // ===== The drum ============================================================
  {
    const m = D ? 48 : 24
    lathe(win, [[23.5, ZP], [23.5, 11.0]], m, 0, YC, false)
    lathe(drum, [[23.5, 11.0], [24.2, 11.4], [27.0, 19.5]], m, 0, YC, false)
    lathe(roof, [[27.0, 19.5], [12.0, 20.0], [0.2, 20.2]], m, 0, YC, true)
    // The panels' joints (detail): thin vertical ribs.
    if (D) for (let k = 0; k < 64; k++) {
      const a = k * TAU / 64
      tube(conc, [[24.3 * Math.cos(a), YC + 24.3 * Math.sin(a), 11.5], [27.1 * Math.cos(a), YC + 27.1 * Math.sin(a), 19.4]], [0.06, 0.06], 3)
    }
  }

  // ===== The shell roof =======================================================
  {
    const L = 40.5, W = 31.35, zt = 8.6, zc = 24.0, ze = 33.0, th = 0.7, lean = 0.28
    const nu = D ? 40 : 18, nv = D ? 16 : 8
    const P = (u: number, v: number, dz = 0): V3 => {
      // The edge arches rise steeply from the points (a pointed oval) and lean outward as they rise.
      const s = 1 - u * u, zl = zt + (zc - zt) * s, zE = zt + (ze - zt) * Math.pow(s, 0.55)
      const z = zl + (zE - zl) * v * v
      return [L * u, YC + v * W * s + v * Math.abs(v) * lean * (z - zt), z + dz]
    }
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const u0 = -1 + 2 * i / nu, u1 = -1 + 2 * (i + 1) / nu, v0 = -1 + 2 * j / nv, v1 = -1 + 2 * (j + 1) / nv
      conc.quad(P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1))
      conc.quad(P(u0, v0, -th), P(u0, v1, -th), P(u1, v1, -th), P(u1, v0, -th))
    }
    // The edge beam along both arches, and the lamps under it.
    for (const v of [-1, 1]) {
      const pts: V3[] = Array.from({ length: nu + 1 }, (_, i) => { const p = P(-1 + 2 * i / nu, v, -0.4); return [p[0], p[1] + v * 0.4, p[2]] })
      tube(conc, pts, pts.map((_, i) => { const u = -1 + 2 * i / nu; return 0.6 + 0.6 * (1 - u * u) }), D ? 8 : 6)
      const nl = D ? 40 : 30
      for (let k = 1; k < nl; k++) {
        // On the beam's outer underside, so the ring of lights reads from the front.
        const u = -0.92 + 1.84 * k / nl, p0 = P(u, v, -0.4), p: V3 = [p0[0], p0[1] + v * 1.2, p0[2] - 0.9]
        if (p[2] < 10) continue
        ellipsoid(lamp, p, [0.42, 0.42, 0.34], 4, 2)
      }
    }
    // The two points' abutments on the podium.
    for (const e of [-1, 1]) cbox(conc, e > 0 ? L - 3 : -L - 1, YC - 2.0, e > 0 ? L + 1 : -L + 3, YC + 2.0, ZP, zt + 0.4, 0.3)
  }

  // ===== The reflecting pool's coping =========================================
  {
    const r = ccw(POOL), o = ringOffset(r, 0.5)
    ringLoft(conc, o, 0, 0.35)
    ringBand(conc, r, o, 0.35, true)
    ringLoft(conc, r, 0, 0.35, true)
  }

  // ===== The Carillon ========================================================
  {
    const cx = 143.8, cy = -113.05, H = 42.0, h = 6.2, slot = 1.0
    // Four slabs, one per side, leaving open slots at the corners' middles.
    for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
      const xa = cx + (sx > 0 ? slot : -h), xb = cx + (sx > 0 ? h : -slot), ya = cy + (sy > 0 ? slot : -h), yb = cy + (sy > 0 ? h : -slot)
      cbox(gran, xa, ya, xb, yb, 0, H - 1.5, D ? 0.2 : 0)
    }
    // The bell shaft's frame inside the slots (dark), and the cap.
    box(gran, cx - slot, cy - slot, cx + slot, cy + slot, 0, 4.0)
    cbox(roof, cx - h - 1.4, cy - h - 1.4, cx + h + 1.4, cy + h + 1.4, H - 1.5, H, D ? 0.2 : 0)
    roof.quad([cx - h - 1.4, cy - h - 1.4, H - 1.5], [cx - h - 1.4, cy + h + 1.4, H - 1.5], [cx + h + 1.4, cy + h + 1.4, H - 1.5], [cx + h + 1.4, cy - h - 1.4, H - 1.5])
    if (D) for (let k = 0; k < 6; k++) lathe(gran, [[0.05, 30 - k * 3.5], [0.6, 28.6 - k * 3.5], [0.7, 28.1 - k * 3.5]], 8, cx, cy, true)
  }

  for (const p of [conc, drum, win, roof, gran, lamp]) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] -= C0[0]; p.pos[i + 2] += C0[1] }
  return { conc, drum, win, roof, gran, lamp }
}

function write(Q: Q, file: string, maxTris: number) {
  const b = build(Q)
  writeModel('Haus der Kulturen der Welt', 'berlin-haus-der-kulturen', [
    { part: welded(b.conc), material: { ...mat('hkw-concrete', 0xe8e6e0), floodlight: (p: V3, n: V3) => (p[2] > 9 && n[2] < -0.2 ? 1 : p[2] > 12 ? 0.35 : 0) } },
    { part: welded(b.drum), material: { ...mat('hkw-copper', 0xc97f4c), floodlight: () => 0.8 } },
    { part: welded(b.win), material: mat('window', 0x64798a, 0.35) },
    { part: welded(b.roof), material: mat('roof', 0x9da6ad) },
    { part: welded(b.gran), material: mat('hkw-dark', 0x55514d, 0.5) },
    { part: welded(b.lamp), material: mat('lamp', 0xd9d4c4, 0.5) },
  ], { bearing: BEARING, osm: 'way/1065864180', height: 42 }, maxTris, file)
}

function mat(name: string, color: number, roughness = 0.85): MaterialSpec {
  return { name, color, roughness }
}
void faceOf; void fpanel; void flen

if (import.meta.main) {
  write(LOW, 'berlin-haus-der-kulturen', 5000)
}
