/**
 * Riverfront Plaza, West and East Towers (901 and 951 East Byrd Street,
 * 1990), Richmond, Virginia — original procedural geometry, CC0-1.0.
 * bun generators/ric-riverfront-plaza.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area-weighted centroid of the two OSM outlines
 * way/225274657 (West) and way/266759715 (East), 37.534791,-77.438922. Their
 * faces run at 37° / 127°, so the catalog bearing is 37 and both towers are
 * square to this frame (+y = 37°, up Byrd Street's grid; +x = 127°).
 *
 * Identity, in order: two identical rose-brown granite towers side by side;
 * stepped (sawtooth) corners, each holding tall dark glass slots that end in
 * round arches; the pale metal mansard roofs above a cornice; punched
 * windows in a regular grid; the low granite podium between them.
 *
 * Evidence:
 *  - plan: OSM outlines, turned into this frame. Each tower ~40 × 70 m with
 *    two 4 m steps at every corner.
 *  - heights, measured: USGS lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown
 *    about 2014), 1–2 m grid. y = 0 is the lowest ground under the model, on
 *    the East tower's river side; the plaza the towers enter from is 7.6 m
 *    up. Both towers alike: eaves 89.8 m, mansard ridge 99.5 m. Published:
 *    312 ft / 95.1 m, 22 floors, both towers (Wikipedia, List of tallest
 *    buildings in Richmond; OSM height 95.1 on both). The ~106 m sometimes
 *    given for the West tower is not borne out: the lidar puts its roof
 *    within 0.5 m of the East tower's.
 *  - podium: not in OSM. Lidar shows a three-storey block (roof 21.6 m)
 *    along the West tower's south side and a lower link (16.8 m) from it to
 *    the East tower. The lidar sits ~2–3 m off the OSM outlines; the podium
 *    is placed against the OSM faces.
 *  - roof: lidar and photos: a steep mansard from the cornice to a ridge
 *    ring, flat inside. The stepped corners rise as gabled bays into it.
 *  - windows: punched, about 3.6 m bays; drawn as narrow panels grouped by two
 *    storeys with granite piers between (estimated from the photos).
 *  - colours: rose-brown granite and a pale mauve-grey metal roof from the
 *    photos, pulled to the palette's lightness.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Riverfront_Plaza_(9741343793).jpg, Ben Schumin, CC BY-SA 2.0 (from the
 *    west, Brown's Island side). https://commons.wikimedia.org/wiki/File:Riverfront_Plaza_(9741343793).jpg
 *  - Federal_Reserve_and_Riverfront_Plaza_(9743453366).jpg, Ben Schumin,
 *    CC BY-SA 2.0 (from the north-west). https://commons.wikimedia.org/wiki/File:Federal_Reserve_and_Riverfront_Plaza_(9743453366).jpg
 *  - Riverfront_Plaza_-01-_(9741267457).jpg, Ben Schumin, CC BY-SA 2.0.
 * No look-only sources. No commercial imagery.
 *
 * Left out: signage, the plaza's arcades and steps, rooftop gear.
 * Doubts: the river (south-east) faces are seen only far off in skyline
 * photos; the corner slots are drawn on the inner step of every corner, as
 * on the faces photographed. The podium's facade is estimated.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, walls, cap, panel, inset, save, rect, block, onWall, spire } from './chi-aon-center'

const WEST: XY[] = [[-8.5, 62.6], [-26.1, 62.5], [-32.8, 62.5], [-32.8, 58.5], [-37.0, 58.7], [-37.4, 54.3], [-41.8, 53.4], [-42.3, 0.6], [-37.6, 1.1], [-37.4, -4.1], [-32.7, -4.0], [-32.9, -7.8], [-11.0, -8.1], [-10.8, -4.3], [-6.2, -4.2], [-5.9, -0.9], [-1.8, -0.5], [-1.8, 24.7], [-1.7, 52.3], [-5.4, 52.2], [-4.8, 57.7], [-8.4, 58.0]]
const EAST: XY[] = [[7.5, -55.0], [7.5, -59.1], [12.1, -59.0], [12.1, -63.0], [33.0, -62.7], [33.0, -59.8], [36.3, -59.8], [36.3, -55.9], [40.9, -55.9], [45.0, -5.2], [36.6, -5.7], [36.5, 0.1], [34.1, 0.1], [34.1, 6.7], [10.4, 6.4], [10.4, 0.9], [6.8, 0.8], [6.9, -4.3], [2.3, -4.4], [2.6, -55.0]]

const EAVE = 89.8, RIDGE = 99.5, PLAZA = 7.6

function tower(ring: XY[], gran: Part, win: Part, roof: Part, metal: Part, ground: number) {
  // Clean the ring of collinear points.
  const r = ring.filter((p, i) => {
    const a = ring[(i - 1 + ring.length) % ring.length], b = ring[(i + 1) % ring.length]
    return Math.abs((p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])) > 1.0
  })
  walls(gran, r, 0, EAVE - 1.6)
  // Cornice: a projecting band under the mansard.
  const cor = inset(r, -0.5)
  walls(gran, r, EAVE - 1.6, EAVE - 1.6, cor)
  walls(gran, cor, EAVE - 1.6, EAVE)
  // Mansard: from the cornice in to a ridge ring, flat inside.
  const ridge = inset(r, 6.5)
  walls(metal, cor, EAVE, RIDGE, ridge)
  cap(roof, ridge, RIDGE)

  // Corner bays: the inner pair of step faces in each corner carry a tall
  // arched glass slot; the bay rises into the mansard as a gable.
  const n = r.length
  const len = (i: number) => Math.hypot(r[(i + 1) % n][0] - r[i][0], r[(i + 1) % n][1] - r[i][1])
  const short = (i: number) => len((i + n) % n) < 7
  for (let i = 0; i < n; i++) {
    const a = r[i], b = r[(i + 1) % n], L = len(i)
    if (L < 7) {
      const inner = short(i - 1) && short(i + 1)
      if (inner) {
        // Arched slot: a panel to the springing, then a half-disc.
        const w = L - 1.4, rr = w / 2, sp = EAVE - 2.2 - rr
        panel(win, a, b, 0.7, L - 0.7, ground + 4, sp, 0.06)
        const { P } = onWall(a, b)
        const c = L / 2
        for (let k = 0; k < 10; k++) {
          const t0 = (Math.PI * k) / 10, t1 = (Math.PI * (k + 1)) / 10
          win.tri(P(c, sp, 0.06), P(c + rr * Math.cos(t0), sp + rr * Math.sin(t0), 0.06), P(c + rr * Math.cos(t1), sp + rr * Math.sin(t1), 0.06))
        }
      } else {
        panelBays(win, a, b, L, ground, 1)
      }
      continue
    }
    panelBays(win, a, b, L, ground, Math.max(1, Math.round((L - 2) / 3.6)))
  }
  // Corner bays: over each pair of inner step faces the granite rises
  // through the mansard as a bay with a steep pyramid cap.
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    if (!(len(i) < 7 && len(j) < 7 && short(i - 1) && short(i + 1) && short(j - 1) && short(j + 1))) continue
    const p1 = r[i], p2 = r[j], p3 = r[(j + 1) % n]
    const W1 = len(i) * 1.6, W2 = len(j) * 1.6
    const u1: XY = [(p2[0] - p1[0]) / len(i), (p2[1] - p1[1]) / len(i)], u2: XY = [(p3[0] - p2[0]) / len(j), (p3[1] - p2[1]) / len(j)]
    const box: XY[] = [[p2[0] - u1[0] * W1, p2[1] - u1[1] * W1], p2, [p2[0] + u2[0] * W2, p2[1] + u2[1] * W2], [p2[0] - u1[0] * W1 + u2[0] * W2, p2[1] - u1[1] * W1 + u2[1] * W2]]
    const cx = box.reduce((s, p) => s + p[0], 0) / 4, cy = box.reduce((s, p) => s + p[1], 0) / 4
    const bev = inset(box, 0.4)
    walls(gran, box, EAVE - 1.6, RIDGE - 1.0)
    walls(gran, box, RIDGE - 1.0, RIDGE - 0.6, bev)
    spire(metal, bev, RIDGE - 0.6, [cx, cy, RIDGE + 3.5])
  }
}

/** Punched windows: `k` bays across a face, two-storey groups, granite between. */
function panelBays(win: Part, a: XY, b: XY, L: number, ground: number, k: number) {
  const end = 0.6, pitch = (L - 2 * end) / k, w = Math.min(pitch * 0.5, pitch - 0.9)
  const z0 = Math.max(PLAZA + 4.0, ground + 4)
  const H = EAVE - 3.0 - z0, nRows = Math.max(1, Math.round(H / 7.6)), rowH = H / nRows
  for (let q = 0; q < k; q++) for (let j = 0; j < nRows; j++) {
    const c = end + (q + 0.5) * pitch
    panel(win, a, b, c - w / 2, c + w / 2, z0 + j * rowH + 0.7, z0 + (j + 1) * rowH - 0.7, 0.05)
  }
}

function build() {
  const gran = new Part(), win = new Part(), roof = new Part(), metal = new Part()
  tower(WEST, gran, win, roof, metal, PLAZA)
  tower(EAST, gran, win, roof, metal, 0)

  // Podium: three storeys along the West tower's south face, and the lower
  // link across to the East tower.
  const pod = rect(-42.0, -28.5, -6.0, -8.0)
  block(gran, roof, pod, 0, 21.6, 0.4)
  const link = rect(-6.0, -26.0, 2.6, -6.0)
  block(gran, roof, link, 0, 16.8, 0.4)
  for (const [ring, top] of [[pod, 21.6], [link, 16.8]] as [XY[], number][]) {
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (i === 2) continue // against the tower
      const k = Math.max(1, Math.round(L / 4.5)), w = (L - 2) / k
      for (let q = 0; q < k; q++) panel(win, a, b, 1 + q * w + 0.6, 1 + (q + 1) * w - 0.6, PLAZA + 1.0, top - 2.0, 0.05)
    }
  }

  return [
    { part: gran, material: finish('rfp-granite', 0xc4a290) },
    { part: win, material: PALETTE.window },
    { part: metal, material: finish('rfp-roof', 0xb3a8a6) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('ric-riverfront-plaza', 'Riverfront Plaza', [37.534791, -77.438922], 37, build())
