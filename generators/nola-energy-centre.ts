/**
 * Energy Centre (1100 Poydras Street, 1984), New Orleans — original
 * procedural geometry, CC0-1.0.
 * bun generators/nola-energy-centre.ts
 *
 * Plan frame: x across the tower, y along its long faces (model north =
 * 14.5° true), z up, metres; origin at the anchor on the ground. Anchor =
 * centroid of the OSM outline way/328669265 (tower and podium; it carries
 * only the address 1100 Poydras, Energy Centre's published address),
 * 29.9498647, -90.0754935. Long faces at 14.5°, so the catalog bearing is
 * 14.5.
 *
 * Identity, in order: a slab on a parallelogram plan whose two ends are
 * 45° staircases of chamfered teeth (the sawtooth that every view shows);
 * the crown that steps down one tooth at a time toward both ends, so the
 * long faces end in stepped shoulders and the top reads as a chevron; pale
 * granite with blue glass in broad bands wrapping the teeth; the 27 m
 * podium on Poydras.
 *
 * Evidence:
 *  - plan: OSM outline way/328669265 and building:parts way/331227876
 *    (podium), way/331227877 (shaft), way/331227878, way/331227879,
 *    way/331227880 (crown tiers), used as mapped in this frame (each end is
 *    5.8 m teeth: a 2.86 m step, a 4.1 m chamfer, a 2.85 m riser; each
 *    tier drops one tooth at each end).
 *  - heights: USGS 3DEP lidar LA_2021GNO_1_C22 (flown 2021-22), read with
 *    tools/lidar_frame.py; street ≈ 0.3 m above ground_min, taken as
 *    y = 0. Tier roofs 132.0, 139.5, 147.1, 154.4 m, a parapet/beacon to
 *    ~156 m; podium 27.0 m (all measured; OSM tags 138/146/154/162 and 25
 *    are each ~5 m high). Published 530 ft = 161.5 m, 39 floors
 *    (Wikipedia; the published figure likely includes rooftop features).
 *  - facade: blue window ribbons wrapping every tooth with granite bands
 *    between (Nolaguy1208 2013); a grid of large punched windows on the
 *    long faces (Niels Olson 2005). Floors ~3.95 m; grouped two to a band
 *    (STYLE: no per-floor pinstripes). Window bays on the long faces
 *    3.0 m, windows 2.1 m (estimated from the same photo).
 *  - colours: granite pale warm grey-cream in both daylight photos (the
 *    "red granite" of the batch notes is not visible in any photo; kept
 *    pale with a warm hint), glass mid blue, pulled to palette lightness.
 *  - night: the stepped crown is floodlit (batch notes); `_FLOODLIGHT` on
 *    the granite from 128 m up. Not confirmed by an open night photo.
 *
 * Photos (EVIDENCE):
 *  - Energy Centre.jpg, Nolaguy1208, CC BY-SA 4.0 (a sawtooth end)
 *    https://commons.wikimedia.org/wiki/File:Energy_Centre.jpg
 *  - New Orleans Tower Light.jpg, Niels Olson, CC BY-SA 2.0 (long face
 *    and stepped top)
 *    https://commons.wikimedia.org/wiki/File:New_Orleans_Tower_Light.jpg
 *  - NOCBDEnergyCenterLoyola.jpg, Infrogmation, CC BY 2.5 (granite at the
 *    base)
 *    https://commons.wikimedia.org/wiki/File:NOCBDEnergyCenterLoyola.jpg
 *  - 20080106 Hilton Skydeck.JPG, TonyTheTiger, CC BY-SA 3.0 (skyline)
 *    https://commons.wikimedia.org/wiki/File:20080106_Hilton_Skydeck.JPG
 * Look-only: none used. No commercial imagery.
 *
 * Ground: flat. elevation 0.
 *
 * Doubts: only two useful photos of the tower, both old (2005, 2013); the
 * window pattern on the long faces is read from one oblique photo. Which
 * face carries ribbons and which punched windows is inferred. The crown
 * lighting is from the batch notes, not a photo. The podium's faces are
 * drawn plain granite with a glazed ground floor (Infrogmation).
 *
 * Left out: the rooftop beacon, the podium's entrance details, the
 * sculpture garden across Loyola.
 */
import { Part } from './mesh'
import { finish, windowVariant } from './palette'
import { type XY, walls, cap, inset, onWall, panel, area, save } from './chi-aon-center'

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
const pts = (s: string): XY[] => s.trim().split(/\)\s*\(/).map(t => t.replace(/[()]/g, '').split(',').map(Number) as XY)

// OSM parts in this frame (tools osmlocal, bearing 14.5).
const T0 = pts('(17.78,-1.24) (17.55,58.17) (13.66,58.17) (10.10,54.66) (10.11,51.86) (7.26,51.84) (4.04,48.67) (4.05,46.00) (1.32,45.98) (-2.09,42.62) (-2.08,39.96) (-4.79,39.95) (-8.30,36.48) (-8.29,33.70) (-11.14,33.68) (-14.08,30.77) (-14.07,27.93) (-16.97,27.91) (-20.16,24.76) (-20.34,-34.57) (-15.95,-34.57) (-12.76,-31.42) (-12.72,-28.53) (-9.86,-28.56) (-6.92,-25.65) (-6.88,-22.82) (-4.08,-22.85) (-0.58,-19.38) (-0.54,-16.69) (2.13,-16.71) (5.53,-13.35) (5.57,-10.63) (8.26,-10.65) (11.47,-7.48) (11.51,-4.64) (14.32,-4.67)')
const T1 = pts('(-20.32,-28.09) (-15.80,-28.09) (-12.61,-24.94) (-12.57,-22.05) (-9.71,-22.08) (-6.77,-19.17) (-6.73,-16.35) (-3.94,-16.37) (-0.43,-12.90) (-0.39,-10.21) (2.28,-10.23) (5.68,-6.87) (5.72,-4.15) (8.41,-4.17) (11.62,-1.00) (11.66,1.84) (14.47,1.81) (17.77,5.07) (17.58,52.53) (13.64,52.54) (10.09,49.02) (10.09,46.23) (7.23,46.21) (4.02,43.04) (4.04,40.37) (1.30,40.35) (-2.10,36.98) (-2.09,34.33) (-4.81,34.31) (-8.32,30.85) (-8.30,28.06) (-11.16,28.03) (-14.09,25.14) (-14.08,22.28) (-17.00,22.26) (-20.18,19.12)')
const T2 = pts('(-20.30,-22.15) (-20.20,12.87) (-17.02,16.01) (-14.11,16.03) (-14.12,18.87) (-11.18,21.78) (-8.33,21.80) (-8.34,24.58) (-4.83,28.05) (-2.12,28.06) (-2.13,30.72) (1.28,34.08) (4.01,34.10) (4.00,36.78) (7.21,39.95) (10.07,39.97) (10.06,42.77) (13.62,46.28) (17.60,46.27) (17.74,10.85) (14.60,7.74) (11.78,7.76) (11.75,4.92) (8.53,1.75) (5.84,1.79) (5.81,-0.94) (2.41,-4.30) (-0.26,-4.28) (-0.30,-6.98) (-3.81,-10.44) (-6.60,-10.41) (-6.65,-13.24) (-9.58,-16.15) (-12.45,-16.13) (-12.48,-19.01) (-15.67,-22.17)')
const T3 = pts('(-20.28,-16.15) (-15.54,-16.16) (-12.36,-13.01) (-12.32,-10.12) (-9.46,-10.14) (-6.52,-7.24) (-6.48,-4.41) (-3.68,-4.44) (-0.17,-0.97) (-0.14,1.73) (2.53,1.70) (5.93,5.06) (5.97,7.79) (8.66,7.77) (11.87,10.94) (11.91,13.78) (14.71,13.75) (17.72,16.71) (17.62,40.26) (13.42,40.27) (9.86,36.75) (9.88,33.95) (7.02,33.93) (3.81,30.77) (3.82,28.09) (1.08,28.07) (-2.33,24.71) (-2.31,22.05) (-5.02,22.03) (-8.54,18.57) (-8.53,15.78) (-11.37,15.77) (-14.31,12.86) (-14.30,10.02) (-17.21,10.00) (-20.22,7.03)')
const POD = pts('(17.78,-1.24) (17.93,-38.01) (12.05,-44.37) (-20.37,-44.05) (-20.34,-34.57) (-15.95,-34.57) (-12.76,-31.42) (-12.72,-28.53) (-9.86,-28.56) (-6.92,-25.65) (-6.88,-22.82) (-4.08,-22.85) (-0.58,-19.38) (-0.54,-16.69) (2.13,-16.71) (5.53,-13.35) (5.57,-10.63) (8.26,-10.65) (11.47,-7.48) (11.51,-4.64) (14.32,-4.67)')
const H = [132.0, 139.5, 147.1, 154.4], PODH = 27.0, FL = 3.95

/** Is (x, y) inside ring r? */
function inside(r: XY[], x: number, y: number) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

function build() {
  const gran = new Part(), win = new Part(), roof = new Part(), base = new Part(), pod = new Part()
  const tiers = [T0, T1, T2, T3].map(ccw)
  const podR = ccw(POD)

  tiers.forEach((r, k) => {
    const z0 = k === 0 ? 0 : H[k - 1] - 0.3, z1 = H[k]
    walls(gran, r, z0, z1 - 0.4)
    const i = inset(r, 0.25)
    walls(gran, r, z1 - 0.4, z1, i)
    cap(roof, i, z1)
    // window bands, two floors to a band
    const zb = k === 0 ? 0 : H[k - 1]
    for (let e = 0; e < r.length; e++) {
      const a = r[e], b = r[(e + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 2) continue
      const { P } = onWall(a, b), m = P(L / 2, 0, 0.6)
      // the bottom of this wall: the podium roof where it stands on it, else the street
      const onPod = k === 0 && inside(podR, m[0], m[1])
      let lo = k === 0 ? (onPod ? PODH : 5.5) : zb + 0.9
      const hi = z1 - 1.6
      if (hi - lo < 2) continue
      const rows: [number, number][] = []
      if (k === 0) {
        if (!onPod) rows.push([0.4, 4.6]) // glazed ground floor
        const g = 2 * FL, n = Math.floor((hi - lo) / g)
        for (let q = 0; q < n; q++) rows.push([lo + q * g + 1.6, lo + (q + 1) * g - 1.6])
        lo += n * g
        if (hi - lo > 2.5) rows.push([lo + 1.0, hi])
      } else rows.push([lo + 0.6, hi])
      if (L > 20) {
        // long face: punched windows, 3.0 m bays
        const nb = Math.round(L / 3.0), bay = L / nb
        for (let q = 0; q < nb; q++) for (const [r0, r1] of rows) panel(r0 < 5 ? base : win, a, b, q * bay + 0.45, (q + 1) * bay - 0.45, r0, r1, 0.05)
      } else {
        for (const [r0, r1] of rows) panel(r0 < 5 ? base : win, a, b, 0.15, L - 0.15, r0, r1, 0.05)
      }
    }
  })

  // ---- Podium (27 m), granite with a glazed ground floor and a band of windows.
  walls(pod, podR, 0, PODH - 0.4)
  const pi = inset(podR, 0.3)
  walls(pod, podR, PODH - 0.4, PODH, pi)
  cap(roof, pi, PODH)
  for (let e = 0; e < podR.length; e++) {
    const a = podR[e], b = podR[(e + 1) % podR.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) continue
    const { P } = onWall(a, b), m = P(L / 2, 0, 1.0)
    if (inside(tiers[0], m[0], m[1])) continue
    const nb = Math.max(1, Math.round(L / 6)), bay = L / nb
    for (let q = 0; q < nb; q++) {
      panel(base, a, b, q * bay + 0.6, (q + 1) * bay - 0.6, 0.4, 6.0, 0.05)
      panel(win, a, b, q * bay + 0.9, (q + 1) * bay - 0.9, 9.0, 23.5, 0.05)
    }
  }

  const granite = { ...finish('ec-granite', 0xe9ded2), floodlight: (p: number[]) => (p[2] > 128 ? Math.min(1, (p[2] - 128) / 8) : 0) }
  return [
    { part: gran, material: granite },
    { part: win, material: windowVariant(2, 0x5f7f9c) },
    { part: base, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    { part: roof, material: { name: 'roof', color: 0x9da6ad, roughness: 0.85 } },
    { part: pod, material: finish('ec-granite-base', 0xded2c5) },
  ]
}

if (import.meta.main) await save('nola-energy-centre', 'Energy Centre', [29.9498647, -90.0754935], 14.5, build() as any, 6500)
