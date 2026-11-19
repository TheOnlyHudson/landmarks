/**
 * Wells Fargo Place (Minnesota World Trade Center, 1987), Saint Paul —
 * original procedural geometry, CC0-1.0.
 * bun generators/msp-wells-fargo-place.ts [out.glb]
 *
 * Map frame: x, y, z up, metres, turned by the placement bearing 10 deg so
 * +x runs along the tower's long axis (bearing 100); the tower sits at 45
 * deg to the downtown grid on its block. Origin at -93.0955, 44.9479, on the
 * lowest ground (the site falls ~5 m to the east).
 *
 * Form: a 37-storey tower of rose-brown granite and dark glass, a long
 * slab with chamfered corners and, on both long faces, a glassy bay in two
 * steps whose tops stop short of the roof (142 and 132 m); the top storeys
 * step in at the corners; a raised south-east corner carries the gold
 * WELLS FARGO sign. It stands on a 15.5 m podium filling the OSM outline,
 * with the glazed cone of the atrium rotunda on it.
 *
 * Identity check: the brief called the crown pointed/pyramidal. The photos
 * and lidar show a flat roof with stepped corners, so it is drawn flat.
 * The brief's ~166 m is also not borne out: published 471 ft (144 m), lidar
 * roof ~146 m above the lowest ground; class-18 points to ~211 m off the
 * roof's east edge are birds/noise, ignored.
 *
 * Sources
 * - OSM: outline relation/21068271 (ways 45782559, 1546427311, 1535651509),
 *   used as the podium; tower parts way/1054128109-111 (128/136/144 m, 33-37
 *   levels) agree with the lidar tiers.
 * - Lidar (measured, USGS 3DEP MN_CentralMissRiver_5_B22, flown ~2022,
 *   class 18 kept): core 55 x 20 m to 146 m, bands 34 m wide to 142 m, bays
 *   to 132-133 m, raised SE corner ~157 m, podium 15.5 m, rotunda ~24 m.
 * - USGS NAIP (public domain): the podium roof and the glazed rotunda.
 * - Published: 1987, 37 floors, 471 ft / 144 m (Wikipedia, "Wells Fargo
 *   Place").
 * - Photos (Wikimedia Commons, all evidence):
 *   AlexiusHoratius, "Wells Fargo Saint Paul 2.JPG", CC BY-SA 3.0: granite, glass, sign.
 *     https://commons.wikimedia.org/wiki/File:Wells_Fargo_Saint_Paul_2.JPG
 *   Gabriel Vanslette, "World Trade Center St. Paul, MN - panoramio.jpg", CC BY 3.0:
 *     the stepped corners at the top. https://commons.wikimedia.org/wiki/File:World_Trade_Center_St._Paul,_MN_-_panoramio.jpg
 *   Jon Platek, "Wells Fargo building 1 - panoramio.jpg", CC BY-SA 3.0.
 *     https://commons.wikimedia.org/wiki/File:Wells_Fargo_building_1_-_panoramio.jpg
 *
 * Estimated: window grouping (three storeys, 3.6 m bays), the top corner
 * step (from 134 m), the sign's size and place; colours from photos.
 *
 * Night: windows glow; the sign is `neon-wells-fargo-gold`.
 *
 * Doubts: the podium's facades and its parts (several OSM building:parts
 * inside the outline at 4-5 levels) are drawn as one 15.5 m block; the sign
 * lettering is a plain lit panel (not a landmark sign).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Prism, ccw, chamfer, capRing, wallEdge, edgeBase, outward, framer, finishGlb } from './sea-rainier-square-tower'

const LNG = -93.0955, LAT = 44.9479, BEARING = 10
const F = framer(LNG, LAT, BEARING)
/** The OSM outline (relation/21068271: ways 45782559, 1546427311, 1535651509 chained). */
const OUTLINE: [number, number][] = [[-93.0956864, 44.9483198], [-93.0956247, 44.9483580], [-93.0954746, 44.9483409], [-93.0954176, 44.9482853], [-93.0953866, 44.9482813], [-93.0953323, 44.9482273], [-93.0953076, 44.9482243], [-93.0952338, 44.9481521], [-93.0952406, 44.9481151], [-93.0952658, 44.9481029], [-93.0952128, 44.9480497], [-93.0951216, 44.9480967], [-93.0949385, 44.9479060], [-93.0947395, 44.9480029], [-93.0946455, 44.9479044], [-93.0946559, 44.9478991], [-93.0948596, 44.9477763], [-93.0952094, 44.9476104], [-93.0956373, 44.9474002], [-93.0957336, 44.9473528], [-93.0957438, 44.9473633], [-93.0957551, 44.9473750], [-93.0957873, 44.9474082], [-93.0958268, 44.9474137], [-93.0958379, 44.9474248], [-93.0958508, 44.9474381], [-93.0958456, 44.9474579], [-93.0958438, 44.9474646], [-93.0958786, 44.9474959], [-93.0960130, 44.9474316], [-93.0964040, 44.9478350], [-93.0965064, 44.9479412], [-93.0964764, 44.9479565], [-93.0964937, 44.9479756], [-93.0964872, 44.9480022], [-93.0964746, 44.9480084], [-93.0964981, 44.9480318], [-93.0964444, 44.9480593], [-93.0964192, 44.9480347], [-93.0963168, 44.9480873], [-93.0962228, 44.9481356], [-93.0961878, 44.9481014], [-93.0960210, 44.9481871], [-93.0959933, 44.9481595], [-93.0959348, 44.9481889], [-93.0959476, 44.9482021], [-93.0959393, 44.9482423], [-93.0958444, 44.9482897], [-93.0958077, 44.9482852], [-93.0957316, 44.9483256]]

const CX = -12 // the tower's centre line across its long axis (lidar)
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const trap = (yBase: number, yTip: number, hb: number, ht: number): XY[] => ccw([[CX - hb, yBase], [CX + hb, yBase], [CX + ht, yTip], [CX - ht, yTip]])

type G = { bay: number; w: number; group: number; sp: number; foot: number; head: number; inset: number }
/** Window panels on edge i of ring r, storey groups counted from z = 0. */
function panels(part: Part, r: XY[], i: number, z0: number, z1: number, g: G) {
  const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 2 * g.inset + 1.2) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = outward(a, b), pr = 0.06
  const k = Math.max(1, Math.round((L - 2 * g.inset) / g.bay)), step = (L - 2 * g.inset) / k, w = Math.min(g.w, step - 0.6)
  const P = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * pr, a[1] + t[1] * u + n[1] * pr, z]
  const lo0 = z0 + g.foot, hi0 = z1 - g.head
  for (let m = Math.floor(lo0 / g.group); m * g.group < hi0; m++) {
    const lo = Math.max(m * g.group + g.sp / 2, lo0), hi = Math.min((m + 1) * g.group - g.sp / 2, hi0)
    if (hi - lo < 1.5) continue
    for (let j = 0; j < k; j++) { const c = g.inset + (j + 0.5) * step; part.quad(P(c - w / 2, lo), P(c + w / 2, lo), P(c + w / 2, hi), P(c - w / 2, hi)) }
  }
}

function build() {
  const granite = new Part(), roof = new Part(), win = new Part(), win2 = new Part(), glass = new Part(), sign = new Part()
  const prisms: Prism[] = []
  const add = (ring: XY[], z1: number, kind: string, z0 = 0) => prisms.push({ ring, z1, z0, wall: granite, roof, kind })

  // ---- the podium: the whole OSM outline, 15.5 m (lidar)
  const POD = 15.5
  add(ccw(OUTLINE.map(F)), POD, 'podium')
  // ---- the tower, set diagonally on its block: a long chamfered slab with stepped bays on both long faces
  const TOP = 146, CORE_STEP = 134
  add(chamfer(rect(CX - 27.5, 18.5, CX + 27.5, 38.5), 4.5), CORE_STEP, 'core')
  add(chamfer(rect(CX - 27.5, 18.5, CX + 27.5, 38.5), 8.0), TOP, 'core', CORE_STEP)
  add(chamfer(rect(CX - 17, 14.5, CX + 17, 18.6), 0.5), 142, 'band')
  add(chamfer(rect(CX - 17, 38.4, CX + 17, 43.5), 0.5), 142, 'band')
  add(trap(14.6, 8.5, 10, 5), 132, 'bay')
  add(trap(43.4, 51.5, 12, 4.5), 133, 'bay')

  const core: G = { bay: 3.6, w: 3.0, group: 11.7, sp: 1.4, foot: 1.2, head: 1.6, inset: 1.2 }
  const glassy: G = { bay: 3.0, w: 2.6, group: 11.7, sp: 1.0, foot: 1.2, head: 1.4, inset: 0.8 }
  const pod: G = { bay: 5, w: 3.6, group: 5.2, sp: 1.6, foot: 0.8, head: 1.6, inset: 1.5 }
  for (const Q of prisms) {
    const r = Q.ring
    for (let i = 0; i < r.length; i++) {
      const z0 = edgeBase(Q.kind === 'podium' ? prisms : [prisms[0], Q], Q, i)
      if (z0 >= Q.z1 - 0.01) continue
      wallEdge(granite, r, i, z0, Q.z1)
      panels(Q.kind === 'core' || Q.kind === 'podium' ? win : win2, r, i, z0, Q.z1, Q.kind === 'podium' ? pod : Q.kind === 'core' ? core : glassy)
    }
    capRing(roof, r, Q.z1)
  }
  // a parapet lip round the top
  { const r = chamfer(rect(CX - 27.5, 18.5, CX + 27.5, 38.5), 8.0)
    const o = chamfer(rect(CX - 27.8, 18.2, CX + 27.8, 38.8), 8.1)
    for (let i = 0; i < o.length; i++) wallEdge(granite, o, i, TOP - 1.2, TOP + 0.6)
    for (let i = 0; i < o.length; i++) { const j = (i + 1) % o.length
      granite.quad([o[i][0], o[i][1], TOP + 0.6], [o[j][0], o[j][1], TOP + 0.6], [r[j % r.length][0], r[j % r.length][1], TOP + 0.6], [r[i % r.length][0], r[i % r.length][1], TOP + 0.6]) } }

  // the raised south-east corner with the gold WELLS FARGO sign on it (lidar: ~157 m)
  { const x0 = CX + 15, x1 = CX + 26.5, y0 = 18.5, y1 = 21
    const r = rect(x0, y0, x1, y1)
    for (let i = 0; i < 4; i++) wallEdge(granite, r, i, TOP, TOP + 9)
    capRing(roof, r, TOP + 9)
    const P = (x: number, z: number): V3 => [x, y0 - 0.12, z]
    sign.quad(P(x0 + 0.6, TOP + 3), P(x1 - 0.6, TOP + 3), P(x1 - 0.6, TOP + 7.4), P(x0 + 0.6, TOP + 7.4)) }

  // the atrium rotunda on the podium: a drum and a glazed cone (NAIP)
  { const c = F([-93.0957464, 44.9479224]), n = 16, R = 12
    const ring: XY[] = Array.from({ length: n }, (_, i) => [c[0] + R * Math.cos((2 * Math.PI * i) / n), c[1] + R * Math.sin((2 * Math.PI * i) / n)])
    for (let i = 0; i < n; i++) wallEdge(granite, ring, i, POD, POD + 1.6, 40)
    const top: V3 = [c[0], c[1], POD + 8.5]
    for (let i = 0; i < n; i++) { const a = ring[i], b = ring[(i + 1) % n]; glass.tri([a[0], a[1], POD + 1.6], [b[0], b[1], POD + 1.6], top) } }

  return finishGlb('msp-wells-fargo-place', 'Wells Fargo Place', [
    { part: granite, material: finish('wfp-granite', 0xb58a77) },
    { part: roof, material: { ...PALETTE.roof, color: 0xb9b2a6 } },
    { part: win, material: { ...PALETTE.window, color: 0x56606e } },
    { part: win2, material: windowVariant(2, 0x4f5d6e) },
    { part: glass, material: PALETTE.glass },
    { part: sign, material: finish('neon-wells-fargo-gold', 0xe2b84a) },
  ], { bearing: BEARING, height: TOP + 9, replaces: ['relation/21068271'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/msp-wells-fargo-place.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
