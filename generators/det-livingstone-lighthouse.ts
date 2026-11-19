/**
 * William Livingstone Memorial Lighthouse, Belle Isle, Detroit (1930,
 * Albert Kahn, sculpture by Géza Maróti; the only marble lighthouse in the
 * US): procedural, CC0-1.0.
 * bun generators/det-livingstone-lighthouse.ts
 *
 * Map frame: x east, y north, z up, metres (bearing 0). The anchor is the
 * centroid of OSM way/107208288 (42.3470236, -82.9543032).
 *
 * Identity, in order: a slender, slightly tapering square marble shaft with
 * fluted (stepped) corners; the frieze of bronze eagles at its top; the
 * octagonal bronze lantern with its flat cap, lit at night; the three slit
 * windows high and low on each face; the door in a projecting marble
 * surround under a carved relief panel; the stepped octagonal platform.
 *
 * Evidence:
 *  - plan: OSM way/107208288 (man_made=lighthouse, marble, height=24.4).
 *    Its 3.7 m circle is smaller than the shaft the photos show (~4.3 m);
 *    the model follows the photos. NAIP 2018 (USGS) shows the white
 *    octagonal platform, ~13 m across, its sides square to north.
 *  - lidar: USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m grid:
 *    the lantern cap 18.3 m over the ground; the platform ~1.0-1.5 m.
 *    The returns on the shaft itself are sparse. OSM's 24.4 m is not borne
 *    out; published heights are 58 ft (17.7 m) for the tower.
 *  - published: 1929-30, Albert Kahn; Géza Maróti's sculpture; marble;
 *    58 ft (Wikipedia, "William Livingstone Memorial Light").
 *  - photos: proportions (scaled to the lidar height), the taper, the
 *    corner flutes, the windows, the door, the frieze and the lantern.
 *  Estimated: the shaft's widths (3.1 m at the base, 2.6 m at the top: the
 *  lead's review measured about 5:1 height to width in four photos), the lantern (2.8 m across), the steps.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Livingstone_Lighthouse.jpg, Drklinkert, CC BY-SA 4.0 (the door face,
 *    close, at dusk with the lantern lit)
 *  - Livingstone_lighthouse.jpg, Gth874m, CC BY-SA 3.0 (the door face and a
 *    side, oblique)
 *  - William_Livingstone_Memorial_Lighthouse.jpg, TracieMichelle, CC BY-SA
 *    4.0 (against the sun, lantern lit)
 *  - William_Livingston_Memorial_Light,_Detroit_December_2016.jpg,
 *    MJCdetroit, CC BY-SA 4.0 (distant, with the platform)
 * No look-only sources. No commercial imagery.
 *
 * Night: the lantern's glazing is `window` (lit); the marble is not
 * floodlit. Doubts: the door's face is not fixed by any photo's known
 * direction; it is put on the west face, towards the path in the aerial.
 * The eagles and the relief are blocks. Elevation 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, rect, save, walls, circle, type XY } from './chi-aon-center'
import { type Face, flatShape, extrudeShape, arc } from './sea-tacoma-union-station'

/** A square of half-width h with each corner cut back in two steps of s. */
function fluted(h: number, s: number): XY[] {
  const q: XY[] = [[h, -h + 2 * s], [h - s, -h + 2 * s], [h - s, -h + s], [h - 2 * s, -h + s], [h - 2 * s, -h]]
  const out: XY[] = []
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2, c = Math.cos(a), sn = Math.sin(a)
    // corner k: rotate the bottom-right corner pattern
    for (const [x, y] of q) out.push([x * c - y * sn, x * sn + y * c])
  }
  const ar = out.reduce((t, a, i) => { const b = out[(i + 1) % out.length]; return t + a[0] * b[1] - b[0] * a[1] }, 0)
  return ar > 0 ? out : out.reverse()
}

function build() {
  const marble = new Part(), bronze = new Part(), glassP = new Part(), win = new Part(), door = new Part()

  // ------------------------------------------------ the stepped octagonal platform
  const oct = (r: number) => circle(0, 0, r / Math.cos(Math.PI / 8), 8, Math.PI / 8)
  for (const [r, z0, z1] of [[6.4, 0, 0.35], [5.9, 0.35, 0.7], [3.9, 0.7, 1.0], [3.5, 1.0, 1.3], [3.1, 1.3, 1.55]] as [number, number, number][]) {
    walls(marble, oct(r), z0, z1); cap(marble, oct(r), z1)
  }

  // ------------------------------------------------ the fluted, tapering shaft
  const B = 1.55, TOP = 15.6, H0 = 1.55, H1 = 1.3, S0 = 0.27, S1 = 0.22
  walls(marble, fluted(H0 + 0.1, S0), B, B + 0.5)
  cap(marble, fluted(H0 + 0.1, S0), B + 0.5)
  walls(marble, fluted(H0, S0), B + 0.5, TOP - 0.9, fluted(H1 + 0.05, S1))
  // the crown: a plain band, the eagles, a cornice under the lantern
  walls(marble, fluted(H1 + 0.05, S1), TOP - 0.9, TOP)
  cap(marble, rect(-H1 - 0.05, -H1 - 0.05, H1 + 0.05, H1 + 0.05), TOP)
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a)
    for (const d of [-1.05, -0.52, 0, 0.52, 1.05]) {
      const x = c * (H1 - 0.02) - s * d, y = s * (H1 - 0.02) + c * d
      const r: XY[] = [[x - 0.14, y - 0.14], [x + 0.14, y - 0.14], [x + 0.14, y + 0.14], [x - 0.14, y + 0.14]]
      walls(bronze, r, TOP - 0.55, TOP + 0.05); cap(bronze, r, TOP + 0.05)
    }
  }

  // ------------------------------------------------ the lantern
  const L = 1.05, oc = (r: number) => circle(0, 0, r, 8, Math.PI / 8)
  walls(bronze, oc(L + 0.15), TOP, TOP + 0.25); cap(bronze, oc(L + 0.15), TOP + 0.25)
  walls(win, oc(L), TOP + 0.25, TOP + 1.8)
  // mullions at the octagon's corners
  for (let k = 0; k < 8; k++) {
    const a = Math.PI / 8 + (k * Math.PI) / 4, r = L + 0.02
    const x = r * Math.cos(a), y = r * Math.sin(a), w = 0.11
    const r2: XY[] = [[x - w, y - w], [x + w, y - w], [x + w, y + w], [x - w, y + w]]
    walls(bronze, r2, TOP + 0.25, TOP + 1.8)
  }
  walls(bronze, oc(L + 0.3), TOP + 1.8, TOP + 2.1)
  cap(bronze, oc(L + 0.3), TOP + 1.8, false)
  // the flat, slightly domed cap and finial
  const cp = oc(L + 0.3)
  for (let i = 0; i < 8; i++) bronze.tri([cp[i][0], cp[i][1], TOP + 2.1], [cp[(i + 1) % 8][0], cp[(i + 1) % 8][1], TOP + 2.1], [0, 0, 18.1])
  walls(bronze, rect(-0.08, -0.08, 0.08, 0.08), 18.1, 18.3)
  void glassP

  // ------------------------------------------------ windows: three slits high and low on each face
  for (let k = 0; k < 4; k++) {
    const n: XY = [Math.cos((k * Math.PI) / 2), Math.sin((k * Math.PI) / 2)]
    const hAt = (z: number) => H0 + (H1 + 0.05 - H0) * ((z - B - 0.5) / (TOP - 0.9 - B - 0.5))
    for (const [z0, z1] of [[7.3, 8.1], [13.6, 14.4]]) {
      const f: Face = { o: [n[0] * (hAt((z0 + z1) / 2) + 0.005), n[1] * (hAt((z0 + z1) / 2) + 0.005), 0], n }
      for (const d of [-0.42, 0, 0.42]) flatShape(win, f, [[d - 0.11, z0], [d + 0.11, z0], ...arc(d, z1, 0.11, 0, 180, 4)], 0.04)
    }
  }

  // ------------------------------------------------ the door face (west): surround, relief, bronze door
  {
    const f: Face = { o: [-H0, 0, 0], n: [-1, 0] }
    extrudeShape(marble, f, [[-0.95, B], [0.95, B], [0.95, B + 3.0], [-0.95, B + 3.0]], 0, 0.3)
    extrudeShape(marble, f, [[-1.05, B + 3.0], [1.05, B + 3.0], [1.05, B + 3.5], [-1.05, B + 3.5]], 0, 0.38)
    const pf: Face = { o: [-H0 - 0.3, 0, 0], n: [-1, 0] }
    flatShape(door, pf, [[-0.55, B], [0.55, B], [0.55, B + 2.6], [-0.55, B + 2.6]], 0.03)
    // the carved relief panel above, a little proud
    extrudeShape(marble, f, [[-0.65, B + 3.6], [0.65, B + 3.6], [0.65, B + 5.6], [-0.65, B + 5.6]], 0, 0.1)
  }

  return [
    { part: marble, material: finish('livingstone-marble', 0xdbd6cc) },
    { part: bronze, material: finish('livingstone-bronze', 0x56645c) },
    { part: win, material: PALETTE.window },
    { part: door, material: finish('livingstone-door', 0x4f5e55) },
  ]
}

if (import.meta.main) await save('det-livingstone-lighthouse', 'William Livingstone Memorial Lighthouse', [42.3470236, -82.9543032], 0, build(), 5000)
