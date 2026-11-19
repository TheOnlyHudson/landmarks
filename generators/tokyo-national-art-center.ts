/**
 * The National Art Center, Tokyo (国立新美術館), Roppongi, Minato, Tokyo:
 * procedural, CC0-1.0.  bun generators/tokyo-national-art-center.ts
 *
 * Writes the low model and a detail model (drawn from zoom 16) in one frame.
 * Uses the shared kit in tokyo-metropolitan-government-building.ts.
 *
 * Kisho Kurokawa, opened 2007. A long exhibition box whose south front is
 * wrapped in an undulating curtain wall of glass and pale green glass
 * louvres; behind it a full-height atrium holds two inverted concrete cones
 * (restaurant and café on their tops); the main entrance is a glass cone
 * under a round canopy disc.
 *
 * Plan (OSM way/136048451, building=museum, the only OSM building; the
 * site, way/103425086, is tourism=museum, not a building, and is not
 * replaced): turned to bearing 0 (its walls run north-south and east-west).
 * - The wave: a smooth curve through the outline's wavy south side (OSM),
 *   its bulges deepened by 80% about the mean line between x -75 and +32
 *   (the photos show a deeper wave than OSM's traced edge; estimated),
 *   easing back to OSM at the ends and behind the entrance; it closes back
 *   to the box at both ends. The wall leans out as it rises, 2.6 m over its
 *   height (Guilhem Vellut's upward views, Kakidai 2018 (2)). Its louvres
 *   read in the photos as dense vertical fins with fine horizontal blades:
 *   vertical fins every 3.6 m (1.8 m, 3D, in the detail), horizontal lines
 *   every 5.5 m (blades every 1.4 m in the detail). The circle OSM draws at
 *   the south-east is the entrance canopy, drawn as the disc.
 * - The box: the outline's straight north, east and west sides; its south
 *   wall at y -31.5 (OSM's corner points at -30 to -33).
 * Ground: the map's terrain under the footprint is a level plaza about
 *   7.5 m above a road cut that clips the building's west and south-west
 *   edge (bun tools/terrain.ts grid). The map stands the model on the lowest
 *   ground, so y = 0 is that low ground and the whole building stands on a
 *   7.5 m plinth (the footprint, plain concrete); on the plaza side the
 *   plinth sinks into the terrain and the museum's floor meets the plaza.
 *   elevation stays 0. The plinth's height is read from the terrain grid,
 *   the only evidence for the cut (doubt).
 * Heights above the plaza (estimated, no published figure found): the
 * wave is the skyline from the front (Wiiii, Kakidai 2018 (2): the gallery
 * box behind it never shows over it from eye level), so the box roof is
 * drawn at 19 m with low plant (to 20.6 m), and the wave's top rises and
 * falls boldly, 20 m over its shallow dips to 29 m over its deepest
 * bulges, falling to about 12 m where it wraps the west end and 15 m at the
 * east (Kakidai 2018 (2) and (3), Wiiii's front view, Akonnchiroll's
 * aerial); the larger cone's top 15 m, the smaller 10 m (Daderot's atrium
 * photo); the entrance: a glazed drum 10 m across under a thin grey
 * inverted-cone canopy 26 m across, its rim at 7.5-8 m, about a third of
 * the wave's height (Wiiii: the disc spans about 17 facade bays and a third
 * of the visible facade, and is some 2.6 times the drum's width; OSM's
 * circle is 19 m, so the disc is drawn wider than OSM), and the glass
 * cone's tip at 18.5 m (Kakidai 2018 (2): about 80% of the wave behind it).
 * Colours (daylight): the louvres pale celadon #c5dbd3 to #d6e5df; the glass
 * between them darker blue-green, drawn translucent #8ec3b9, opacity 0.68
 * (the cones show through); the box's walls pale concrete #dcdad4; the
 * canopy and the cone's ribs light steel. At night the whole wave glows gold
 * (Kaz Ish), so the louvres are named `window-2` and the drum `entrance` (in a pale glass green by day).
 *
 * Frame: origin at 139.7264366, 35.6652611, the outline's centroid (the lead's
 * 139.72644, 35.66534 is 9 m north of it); y = 0 is the ground.
 *
 * Photos (Wikimedia Commons):
 * - "National Art Center Tokyo 2008.jpg", Wiiii, CC BY-SA 3.0
 * - "2018 National Art Center, Tokyo.jpg", "... 2.jpg", "... 3.jpg", Kakidai, CC BY-SA 4.0
 * - "The National Art Center, Tokyo 2023.jpg", Akonnchiroll, CC BY-SA 4.0 (aerial)
 * - "National Art Center, Tokyo - DSC06720.JPG", Daderot, CC0 (atrium, cone)
 * - "The National Art Center , Tokyo - panoramio (1).jpg", Kaz Ish, CC BY-SA 3.0 (dusk)
 * - "National Art Center Tokyo (11421004905).jpg", "The National Art Center
 *   @ Tokyo (9082669836).jpg", "National Art Center @ Tokyo (11495214064).jpg",
 *   Guilhem Vellut, CC BY 2.0
 * No lidar (Japan). No look-only sources.
 * Doubts: all heights are photo estimates; the cones' positions in the atrium
 * are placed from the atrium photo and the aerial, not measured; the west
 * (Nogizaka) entrance and the box's rear facades are drawn plain.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, lathe, member, writeModel, type XY, type Layer } from './tokyo-metropolitan-government-building'

// OSM points (frame anchored 9 m north of the centroid), shifted to the centroid.
const OFF: XY = [0.3, 8.8]
const sh = (p: XY): XY => [p[0] + OFF[0], p[1] + OFF[1]]
const BOX_S = -31.5, H = 19, PLAZA = 7.5
const BOX: XY[] = ([[-69.6, BOX_S], [69.3, BOX_S], [69.6, 45.2], [-69.6, 46.2]] as XY[]).map(sh)
// The wave's top line, west to east (OSM, the canopy circle left out)
const WAVE_OSM: XY[] = [[-86.3, -33.5], [-86.3, -42.3], [-79.8, -42.4], [-73.6, -43.1], [-67.6, -46.9], [-63.0, -52.3], [-59.3, -53.1], [-56.0, -52.8], [-51.6, -54.9], [-48.2, -57.7], [-43.9, -63.5], [-39.5, -65.0], [-35.7, -64.0], [-29.8, -60.6], [-25.3, -59.6], [-21.1, -60.1], [-16.7, -63.3], [-14.3, -65.9], [-7.0, -72.2], [-3.5, -72.9], [0.2, -72.7], [7.5, -67.4], [15.2, -61.5], [18.6, -60.2], [22.6, -59.6], [32.0, -61.5], [37.5, -62.3], [42.5, -60.4], [47.8, -53.8], [51.7, -50.8], [55.9, -47.9], [59.5, -45.8], [63.7, -44.0], [66.4, -43.4], [72.5, -43.6], [72.5, -32.0]]
const DISC: XY = sh([44.6, -69.6]), DISC_R = 13

/** Catmull-Rom through the OSM points, `per` samples a span: a smooth wave. */
function smoothLine(pts: XY[], per: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    const n = Math.max(1, Math.round((Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 6) * per))
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

type Lod = { detail: boolean; per: number; louvre: number; mull: number }
const LOW: Lod = { detail: false, per: 1, louvre: 5.5, mull: 3.6 }
const DETAIL: Lod = { detail: true, per: 2.5, louvre: 1.4, mull: 1.8 }

function build(L: Lod): Layer[] {
  const stone = new Part(), glass = new Part(), louvre = new Part(), roof = new Part(), steel = new Part(), lobby = new Part()
  // --- the box
  prism(stone, BOX, 0, H, { roof, lip: 0.8 })
  // rooftop plant and the planted court (aerial)
  prism(roof, ([[-40, 5], [10, 5], [10, 30], [-40, 30]] as XY[]).map(sh), H, H + 1.6, { bevel: 0.3 })
  prism(roof, ([[25, 0], [55, 0], [55, 20], [25, 20]] as XY[]).map(sh), H, H + 1.2, { bevel: 0.3 })

  // --- the wave
  // the bulges deepened about the wave's mean line (photos: the wave reads deeper than OSM's
  // traced top edge), easing back to OSM toward the ends and behind the entrance disc
  const AMP = 1.8, PIV = -62
  const deep = WAVE_OSM.map(([x, y]) => {
    const f = Math.max(0, Math.min(1, (x + 75) / 15)) * Math.max(0, Math.min(1, (32 - x) / 10))
    return [x, PIV + (y - PIV) * (1 + (AMP - 1) * f)] as XY
  })
  const line = smoothLine(deep.map(sh), L.per)
  const n = line.length
  // the top edge: 22 m, falling where the wave wraps the ends, a little higher where it bulges
  const xs = line.map((p) => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs)
  const topZ = (p: XY) => {
    const west = Math.max(0, 1 - (p[0] - x0) / 26), east = Math.max(0, 1 - (x1 - p[0]) / 14)
    const bulge = Math.max(0, Math.min(1, (BOX_S + OFF[1] - p[1] - 22) / 22))
    return 20 + 9 * bulge - 8 * west * west - 5 * east * east
  }
  // outward normal of the line (the atrium is to its north/inside)
  const nrmAt = (i: number): XY => {
    const a = line[Math.max(0, i - 1)], b = line[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    return [dy / l, -dx / l] // the line runs west to east round the south: right-hand normal points out
  }
  const LEAN = 2.6
  const at = (i: number, z: number, out = 0): V3 => {
    const nn = nrmAt(i), top = topZ(line[i]), back = LEAN * (1 - Math.min(1, z / top))
    return [line[i][0] + nn[0] * (out - back), line[i][1] + nn[1] * (out - back), z]
  }
  for (let i = 0; i < n - 1; i++) {
    const ta = topZ(line[i]), tb = topZ(line[i + 1])
    glass.quad(at(i, 0), at(i + 1, 0), at(i + 1, tb), at(i, ta))
    // the horizontal louvres: thin pale lines (3D blades in the detail)
    for (let z = L.louvre; z < Math.min(ta, tb) - 0.3; z += L.louvre) {
      const h = L.detail ? 0.18 : 0.3, d = L.detail ? 0.45 : 0.1
      louvre.quad(at(i, z, d), at(i + 1, z, d), at(i + 1, z + h, d), at(i, z + h, d))
      if (L.detail) {
        louvre.quad(at(i, z + h, 0), at(i, z + h, d), at(i + 1, z + h, d), at(i + 1, z + h, 0))
        louvre.quad(at(i, z, 0), at(i + 1, z, 0), at(i + 1, z, d), at(i, z, d))
      }
    }
    // the coping along the top edge
    louvre.quad(at(i, ta - 1.1, 0.9), at(i + 1, tb - 1.1, 0.9), at(i + 1, tb, 0.9), at(i, ta, 0.9))
    louvre.quad(at(i, ta, 0), at(i, ta, 0.9), at(i + 1, tb, 0.9), at(i + 1, tb, 0))
  }
  // the vertical fins: the facade's dominant lines, at a steady spacing along the wave
  {
    let acc = 0
    for (let i = 0; i < n - 1; i++) {
      acc += Math.hypot(line[i + 1][0] - line[i][0], line[i + 1][1] - line[i][1])
      if (acc < L.mull) continue
      acc = 0
      const nn = nrmAt(i + 1), tz = topZ(line[i + 1]) - 1.1, w = L.detail ? 0.18 : 0.45
      const tng: XY = [-nn[1], nn[0]]
      const Q = (o: number, z: number, d: number): V3 => { const p = at(i + 1, z, d); return [p[0] + tng[0] * o, p[1] + tng[1] * o, z] }
      const d = L.detail ? 1.0 : 0.16, zs = [0, tz * 0.35, tz * 0.7, tz]
      for (let k = 0; k < 3; k++) {
        const z0 = zs[k], z1 = zs[k + 1]
        louvre.quad(Q(-w, z0, d), Q(w, z0, d), Q(w, z1, d), Q(-w, z1, d))
        if (L.detail) { louvre.quad(Q(w, z0, 0), Q(w, z1, 0), Q(w, z1, d), Q(w, z0, d)); louvre.quad(Q(-w, z0, 0), Q(-w, z0, d), Q(-w, z1, d), Q(-w, z1, 0)) }
      }
    }
  }
  // the atrium's roof: from the wave's top down to the box's roof edge, pale with a glass strip
  for (let i = 0; i < n - 1; i++) {
    const a = at(i, topZ(line[i])), b = at(i + 1, topZ(line[i + 1]))
    const ab: V3 = [a[0], BOX_S + OFF[1], H], bb: V3 = [b[0], BOX_S + OFF[1], H]
    if (Math.abs(a[1] - ab[1]) < 0.5 && Math.abs(b[1] - bb[1]) < 0.5) continue
    stone.quad(a, b, bb, ab)
  }
  // the atrium's ends past the box (the west annex and the east return): short north walls closing them
  for (const [xa, xb, z] of [[-86.6, -69.6, topZ(line[0])], [69.3, 72.8, topZ(line[n - 1])]] as [number, number, number][]) {
    const y0 = BOX_S + OFF[1] - 1.6, y1 = BOX_S + OFF[1]
    prism(stone, [[xa + OFF[0], y0], [xb + OFF[0], y0], [xb + OFF[0], y1], [xa + OFF[0], y1]], 0, Math.min(z, H), { bevel: 0.2 })
  }

  // --- the two inverted cones in the atrium, seen through the glass
  for (const [cx, cy, zt, rt, rb] of [[-30 + OFF[0], -48 + OFF[1], 15, 9.5, 3.2], [12 + OFF[0], -47 + OFF[1], 10, 7, 2.6]] as [number, number, number, number, number][]) {
    lathe(stone, [[0, 0], [rb, 0], [rt, zt - 1.2], [rt, zt], [0, zt]], L.detail ? 32 : 16, [cx, cy])
    // the glass rail round the restaurant on its top
    lathe(louvre, [[rt - 0.2, zt], [rt - 0.2, zt + 1.1], [rt - 0.4, zt + 1.1], [rt - 0.4, zt]], L.detail ? 32 : 16, [cx, cy])
  }

  // --- the entrance: a glazed drum under the round canopy disc, a glass cone through it
  {
    const [cx, cy] = DISC, k = L.detail ? 32 : 20
    lathe(lobby, [[0, 0], [5, 0], [5, 4.6], [0, 4.6]], k, [cx, cy])
    // the canopy: a shallow inverted cone, its underside rising from the drum to a thin rim
    lathe(steel, [[0, 4.6], [5, 4.6], [DISC_R, 7.5], [DISC_R, 7.9], [DISC_R - 0.5, 8.1], [0, 8.2]], k, [cx, cy])
    // the cone: ribs from the canopy to the tip, with rings (real members)
    const ribs = L.detail ? 16 : 12, TIP = 18.5, tip: V3 = [cx, cy, TIP], r0 = 4.4, z0 = 8.1
    for (let j = 0; j < ribs; j++) {
      const a = (j / ribs) * Math.PI * 2
      member(steel, [cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), z0], tip, L.detail ? 0.1 : 0.22, 4)
    }
    for (const t of L.detail ? [0, 0.2, 0.4, 0.6, 0.8] : [0, 0.33, 0.66]) {
      const r = r0 * (1 - t), z = z0 + (TIP - z0) * t, m = L.detail ? 16 : 12
      for (let j = 0; j < m; j++) {
        const a0 = (j / m) * Math.PI * 2, a1 = ((j + 1) / m) * Math.PI * 2
        member(steel, [cx + r * Math.cos(a0), cy + r * Math.sin(a0), z], [cx + r * Math.cos(a1), cy + r * Math.sin(a1), z], L.detail ? 0.08 : 0.16, 4)
      }
    }
    // its glazing: a faint translucent cone (same glass as the wave)
    lathe(glass, [[r0, z0], [0.05, TIP]], k, [cx, cy])
  }

  // --- the plaza level: everything above stands PLAZA m up, on a plinth over the footprint, so
  // y = 0 is the low ground at the west (a road cut) and the plinth sinks into the higher ground
  for (const part of [stone, glass, louvre, roof, steel, lobby]) for (let k = 2; k < part.pos.length; k += 3) part.pos[k - 1] += PLAZA
  {
    const ring: XY[] = []
    for (let i = 0; i < n; i++) { const p = at(i, 0); ring.push([p[0], p[1]]) }
    ring.push(sh([69.6, 45.2]), sh([-69.6, 46.2]), sh([-69.6, -32.9]))
    prism(stone, ring, 0, PLAZA, { bevel: 0.2, top: false })
    // the drum's footing under the entrance
    lathe(stone, [[0, 0], [5.4, 0], [5.4, PLAZA], [0, PLAZA]], 20, DISC)
  }
  return [
    { part: stone, material: finish('nact-concrete', 0xdcdad4) },
    { part: glass, material: { name: 'glass', color: 0x8ec3b9, roughness: 0.2, opacity: 0.68, doubleSided: true } },
    { part: louvre, material: { name: 'window-2', color: 0xd8e8e2, roughness: 0.5 } },
    { part: roof, material: PALETTE.roof },
    { part: steel, material: finish('nact-steel', 0xb7bdc1) },
    { part: lobby, material: { ...PALETTE.entrance, color: 0xb9d0ca } },
  ]
}

if (import.meta.main) {
  const meta = { bearing: 0, elevation: 0, height: PLAZA + 29 }
  await writeModel('tokyo-national-art-center', 'tokyo-national-art-center.glb', 'The National Art Center, Tokyo', build(LOW), meta, 6500, 256_000)
  await writeModel('tokyo-national-art-center', 'tokyo-national-art-center.detail.glb', 'The National Art Center, Tokyo', build(DETAIL), meta, 40_000, 1536 * 1024)
}
