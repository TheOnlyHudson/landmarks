/**
 * Cleft Ridge Span, Prospect Park, Brooklyn (Calvert Vaux and Frederick Law
 * Olmsted, 1872; cast in Béton Coignet concrete) — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-cleft-ridge-span.ts
 *
 * Frame: y along the barrel (the path beneath, bearing 123.4°, toward the
 * south-east face), x across it (along Wellhouse Drive overhead), z up,
 * metres; z = 0 the path under the arch. Anchor: the centroid of OSM's
 * man_made=bridge outline way/1481639637 (-73.964904, 40.659945), 20.3 m
 * along the barrel by 7.0 m (the span), which the model draws whole, so
 * `replaces` lists it. The faces' pilasters and wing walls reach past the
 * outline's sides onto the banks.
 *
 * The span carries Wellhouse Drive (way/1388003479, bridge=yes, 6.9 m
 * long, running across the barrel): no road surface is drawn and the top
 * stays open above the masonry's top at 5.15 m, 0.3 m under the roadway's
 * estimated 5.45 m (the cornice's top); the banks are the map's terrain
 * (3.7–5.3 m beside the faces, from `terrain.ts check`).
 *
 * Evidence
 * - OSM way/1481639637 (bridge:structure=arch) and way/1388003479 (ODbL).
 * - Published (NYC Parks; Prospect Park Alliance; Wikipedia "Prospect
 *   Park"): 1872, one of the first concrete arches in the US, cast in
 *   moulded Béton Coignet blocks; the barrel lined with polychrome
 *   geometric panels; restored 1960s and 2000s.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Dave Smith, "Cleft Ridge Span in Prospect Park from East.jpg", CC BY-SA,
 *     https://commons.wikimedia.org/wiki/File:Cleft_Ridge_Span_in_Prospect_Park_from_East.jpg
 *     (the face: arch, roundels, frieze, pilasters with finials, wing walls with urns);
 *   olekinderhook, "The arch under the Cleft Ridge Span - panoramio.jpg", CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:The_arch_under_the_Cleft_Ridge_Span_-_panoramio.jpg
 *     (square on to the face: proportions, scaled by a seated person and bench);
 *   Hikerbackpack, "Cleft Ridge Span Tunnel.jpg", CC BY-SA,
 *     https://commons.wikimedia.org/wiki/File:Cleft_Ridge_Span_Tunnel.jpg
 *     (the other face and the barrel's length).
 *
 * Estimated from the two face photos (the square-on one scaled by a
 * seated person and a bench; the two disagree on the rise, so the middle
 * was taken): span 7.4 m, springing 1.6 m, crown 4.4 m (a flattened
 * ellipse, semi-axes 3.7 × 2.8), archivolt 0.5 m, the frieze right over
 * its crown 4.9–5.3 m, cornice to 5.45 m, low parapet to 6.0 m (lead
 * review: crown to coping matched to the Smith photo); pilasters 0.9 m wide at ±5.85 m
 * with finials and urns; wing walls to ±9.5 m stepping down to 2.0 m,
 * each ending in an urn on a pedestal.
 *
 * Doubts: no lidar (the crop timed out on the loaded machine); the
 * barrel's moulded panels are drawn as one darker colour; the lantern
 * ornaments on the pilasters and the wing walls' exact plan are
 * simplified; the bank heights behind the wing walls are the map's.
 */
import { Part, type V3 } from './mesh'
import { finishModel } from './nyc-570-lexington'
import { quadF, triN, box } from './nyc-prospect-park-boathouse'

const conc = new Part(), ring = new Part(), frieze = new Part(), barrel = new Part(), urn = new Part()

const A = 3.7, B = 2.8, SPR = 1.6, RING = 0.5, FACE = 10.1, HW = 6.3
const FRZ0 = 4.9, FRZ1 = 5.3, CORN = 5.45, PAR = 6.0, PT = 0.5, TOP = 5.15
const N = 16
const ell = (t: number, d = 0): [number, number] => [(A + d) * Math.cos(t), SPR + (B + d) * Math.sin(t)]

/** Where a ray from the springing centre at angle t meets the face's outline (|x| = HW or z = FRZ0). */
function edge(t: number): [number, number] {
  const c = Math.cos(t), s = Math.sin(t)
  const kx = Math.abs(c) > 1e-6 ? HW / Math.abs(c) : Infinity, kz = s > 1e-6 ? (FRZ0 - SPR) / s : Infinity
  const k = Math.min(kx, kz)
  return [c * k, SPR + s * k]
}

for (const sg of [-1, 1]) {
  const y = sg * FACE, n: V3 = [0, sg, 0], P = (x: number, z: number, d = 0): V3 => [x, y + sg * d, z]
  // The face above the springing, ring to outline, in angular strips (corners added).
  const cA = Math.atan2(FRZ0 - SPR, HW), ts: number[] = []
  for (let k = 0; k <= N; k++) ts.push((Math.PI * k) / N)
  ts.push(cA, Math.PI - cA); ts.sort((a, b) => a - b)
  for (let i = 0; i < ts.length - 1; i++) {
    const [x0, z0] = ell(ts[i], RING), [x1, z1] = ell(ts[i + 1], RING), [ex0, ez0] = edge(ts[i]), [ex1, ez1] = edge(ts[i + 1])
    quadF(conc, P(x0, z0), P(x1, z1), P(ex1, ez1), P(ex0, ez0), n)
    // The archivolt: a band 0.08 proud, its outer edge closed.
    const [ix0, iz0] = ell(ts[i]), [ix1, iz1] = ell(ts[i + 1])
    quadF(ring, P(ix0, iz0, 0.08), P(ix1, iz1, 0.08), P(x1, z1, 0.08), P(x0, z0, 0.08), n)
    const tm = (ts[i] + ts[i + 1]) / 2
    quadF(ring, P(x0, z0), P(x1, z1), P(x1, z1, 0.08), P(x0, z0, 0.08), [Math.cos(tm), 0, Math.sin(tm)])
    // The barrel's soffit, face to face, facing in.
    if (sg > 0) quadF(barrel, [ix0, -FACE, iz0], [ix1, -FACE, iz1], [ix1, FACE, iz1], [ix0, FACE, iz0], [-Math.cos(tm), 0, -Math.sin(tm)])
  }
  // Below the springing: the piers' faces beside the opening.
  for (const s of [-1, 1]) quadF(conc, P(s * A, 0), P(s * HW, 0), P(s * HW, SPR), P(s * A, SPR), n)
  // The archivolt's jambs down to its plinth, and a plinth band along the face's foot.
  for (const s of [-1, 1]) {
    const x0 = s * A, x1 = s * (A + RING)
    quadF(ring, P(x0, 0.45, 0.08), P(x1, 0.45, 0.08), P(x1, SPR, 0.08), P(x0, SPR, 0.08), n)
    quadF(ring, P(x1, 0.45), P(x1, SPR), P(x1, SPR, 0.08), P(x1, 0.45, 0.08), [s, 0, 0])
    box(ring, Math.min(x0, x1 + s * 0.1), sg > 0 ? y - 0.05 : y - 0.15, Math.max(x0, x1 + s * 0.1), sg > 0 ? y + 0.15 : y + 0.05, 0, 0.45)
  }
  // Roundels in the spandrels.
  for (const s of [-1, 1]) {
    const cx = s * 4.85, cz = 4.2, rr = 0.5
    for (let k = 0; k < 12; k++) {
      const a0 = (k * Math.PI) / 6, a1 = ((k + 1) * Math.PI) / 6
      triN(ring, P(cx, cz, 0.1), P(cx + rr * Math.cos(a0), cz + rr * Math.sin(a0), 0.1), P(cx + rr * Math.cos(a1), cz + rr * Math.sin(a1), 0.1), n)
      quadF(ring, P(cx + rr * Math.cos(a0), cz + rr * Math.sin(a0)), P(cx + rr * Math.cos(a1), cz + rr * Math.sin(a1)), P(cx + rr * Math.cos(a1), cz + rr * Math.sin(a1), 0.1), P(cx + rr * Math.cos(a0), cz + rr * Math.sin(a0), 0.1), [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)])
    }
  }
  // The polychrome frieze, the cornice and the parapet with its coping.
  const yo = (d: number) => y + sg * d
  box(frieze, -HW, Math.min(yo(0.1), yo(-PT)), HW, Math.max(yo(0.1), yo(-PT)), FRZ0, FRZ1)
  box(ring, -HW - 0.1, Math.min(yo(0.25), yo(-PT)), HW + 0.1, Math.max(yo(0.25), yo(-PT)), FRZ1, CORN)
  box(conc, -HW, Math.min(yo(0.05), yo(-PT)), HW, Math.max(yo(0.05), yo(-PT)), CORN, PAR - 0.15)
  box(ring, -HW - 0.05, Math.min(yo(0.12), yo(-PT - 0.07)), HW + 0.05, Math.max(yo(0.12), yo(-PT - 0.07)), PAR - 0.15, PAR)
  // Pilasters with stepped finials and an urn, at the face's ends.
  for (const s of [-1, 1]) {
    const x0 = s * (HW - 0.9), x1 = s * HW, lo = Math.min(x0, x1), hi = Math.max(x0, x1)
    box(conc, lo - 0.05, Math.min(yo(0.3), yo(-PT - 0.1)), hi + 0.05, Math.max(yo(0.3), yo(-PT - 0.1)), 0, PAR + 0.2)
    box(ring, lo + 0.1, Math.min(yo(0.22), yo(-PT)), hi - 0.1, Math.max(yo(0.22), yo(-PT)), PAR + 0.2, PAR + 0.7)
    box(ring, lo + 0.22, Math.min(yo(0.1), yo(-PT + 0.12)), hi - 0.22, Math.max(yo(0.1), yo(-PT + 0.12)), PAR + 0.7, PAR + 0.95)
    vase((lo + hi) / 2, yo(-0.15), PAR + 0.95, 0.55)
    // The wing wall stepping down onto the bank, ending in an urn on a pedestal.
    const w0 = s * HW, w1 = s * 9.5, wl = Math.min(w0, w1), wh = Math.max(w0, w1), ya = Math.min(yo(0.05), yo(-PT)), yb = Math.max(yo(0.05), yo(-PT))
    const zt = (x: number) => 4.8 - (2.8 * (Math.abs(x) - HW)) / (9.5 - HW)
    for (const [xa, xb] of [[wl, wh]]) {
      const ta = zt(xa), tb = zt(xb)
      quadF(conc, [xa, ya, 0], [xb, ya, 0], [xb, ya, tb], [xa, ya, ta], [0, -1, 0])
      quadF(conc, [xa, yb, 0], [xb, yb, 0], [xb, yb, tb], [xa, yb, ta], [0, 1, 0])
      quadF(ring, [xa, ya - 0.06, ta], [xb, ya - 0.06, tb], [xb, yb + 0.06, tb + 0.0], [xa, yb + 0.06, ta], [0, 0, 1])
    }
    box(conc, w1 - 0.5, ya - 0.2, w1 + 0.5, yb + 0.2, 0, 2.3)
    box(ring, w1 - 0.6, ya - 0.3, w1 + 0.6, yb + 0.3, 2.3, 2.5)
    vase(w1, (ya + yb) / 2, 2.5, 0.75)
  }
}
/** An urn: foot, bowl and lip, radius r at the lip. */
function vase(x: number, y: number, z: number, r: number) {
  const ring8 = (rr: number, zz: number): V3[] => Array.from({ length: 10 }, (_, k) => [x + rr * Math.cos((k * Math.PI) / 5), y + rr * Math.sin((k * Math.PI) / 5), zz])
  const rings = [ring8(r * 0.45, z), ring8(r * 0.3, z + r * 0.35), ring8(r * 0.75, z + r * 0.75), ring8(r, z + r * 1.3), ring8(r * 1.05, z + r * 1.45)]
  urn.loft(rings)
  urn.cap(rings[rings.length - 1], true)
}
// The barrel's walls below the springing; the abutments' sides between the faces
// (in the banks) and the masonry's top under the drive, 0.3 m under the roadway.
for (const s of [-1, 1]) {
  quadF(barrel, [s * A, -FACE, 0], [s * A, FACE, 0], [s * A, FACE, SPR], [s * A, -FACE, SPR], [-s, 0, 0])
  quadF(conc, [s * HW, -FACE, 0], [s * HW, FACE, 0], [s * HW, FACE, TOP], [s * HW, -FACE, TOP], [s, 0, 0])
}
quadF(conc, [-HW, -FACE + PT, TOP], [HW, -FACE + PT, TOP], [HW, FACE - PT, TOP], [-HW, FACE - PT, TOP], [0, 0, 1])

finishModel('Cleft Ridge Span', 'nyc-cleft-ridge-span', [
  { part: conc, material: { name: 'beton-coignet', color: 0xa39b8a, roughness: 0.9 } },
  { part: ring, material: { name: 'mouldings', color: 0xb3ab99, roughness: 0.9 } },
  { part: frieze, material: { name: 'polychrome-frieze', color: 0xa98a7c, roughness: 0.9 } },
  { part: barrel, material: { name: 'barrel-panels', color: 0x8e8070, roughness: 0.9 } },
  { part: urn, material: { name: 'urns', color: 0xa8a090, roughness: 0.9 } },
], { bearing: 123.4, osm: 'way/1481639637', height: 7.9 })
