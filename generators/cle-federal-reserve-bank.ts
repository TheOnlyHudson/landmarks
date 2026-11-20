/**
 * Federal Reserve Bank of Cleveland (1923, Walker and Weeks), East 6th
 * Street and Superior Avenue: procedural, CC0-1.0.
 * bun generators/cle-federal-reserve-bank.ts [out.glb]
 *
 * Frame: x, y, z metres, turned to bearing 56 (+y points north-east, +x
 * south-east), origin at the OSM outline's centroid (-81.6902829,
 * 41.5019401). z = 0 is the street round the block (lidar ground 1.5 m
 * above the box's lowest return, a loading ramp). elevation 0.
 *
 * Form: a Renaissance-revival palazzo block of pink Georgia marble over a
 * granite plinth, 62.6 x 48.2 m: a rusticated two-storey base with tall
 * round-arched windows and a central arched entrance on East 6th, a
 * balustrade over it, ten storeys of punched windows with a string course
 * under the top two, a deep modillion cornice at 50 m, an attic arcade of
 * small round-headed windows set back behind it, and a low green copper hip
 * roof.
 *
 * Sources
 * - OSM (ODbL): way/126820677 (height 61.8, 13 levels, Q4384538), the whole
 *   block, replaced. The low building and connector against the north-east
 *   face (way/390867222, way/333522160) and the 8-storey annex beyond
 *   (way/333522159) are separate and left to the map.
 * - Lidar (measured): USGS 3DEP OH_Statewide_Phase1_1_2019 (public domain,
 *   2019 flight), 1 m grid read in this frame: walls on the OSM rectangle;
 *   cornice top 50.1; parapet 52-53; attic wall 57.9, set back about 2 m;
 *   the copper hip rising to a flat roof at 62.5 about 7 m in (OSM 61.8);
 *   mechanical penthouses up to 66-70 in the middle of the roof.
 * - Published: 1923, Walker and Weeks, pink Georgia marble over a granite
 *   base (Wikipedia, "Federal Reserve Bank of Cleveland").
 * - Photos (Wikimedia Commons, evidence):
 *   - "Federal Reserve Bank — Cleveland, Ohio", Christopher L. Riley,
 *     CC BY-SA 4.0, 2020-09-15,
 *     https://commons.wikimedia.org/wiki/File:Federal_Reserve_Bank_%E2%80%94_Cleveland,_Ohio.jpg
 *     (south corner: the Superior and East 6th faces, base arches,
 *     balustrade, cornice, attic arcade, copper roof edge)
 *   - "Federal Reserve Bank, Cleveland, Ohio LCCN2010630382", Carol M.
 *     Highsmith, public domain,
 *     https://commons.wikimedia.org/wiki/File:Federal_Reserve_Bank,_Cleveland,_Ohio_LCCN2010630382.jpg
 *     (the entrance arch, the flanking arched windows, the rustication)
 *   - "The Federal Reserve Bank of Cleveland, Cleveland, OH (28812473477)",
 *     Warren LeMay, CC0, 2018-07-27,
 *     https://commons.wikimedia.org/wiki/File:The_Federal_Reserve_Bank_of_Cleveland,_Cleveland,_OH_(28812473477).jpg
 *     (the corner from below: window rows, string course, cornice)
 *   - "Superior Avenue, Cleveland, OH (28812510907)", Warren LeMay, CC0,
 *     2018-07-27,
 *     https://commons.wikimedia.org/wiki/File:Superior_Avenue,_Cleveland,_OH_(28812510907).jpg
 *     (the East 6th face with the entrance canopy, the annex beside it)
 * Estimated from the photos: base 15 m (balustrade 13.6-15); ten storeys of
 *   3.1 m from 15 to 46 m, grouped two to a panel; 13 window bays on the
 *   long faces and 10 on the short; the base arches on every second bay;
 *   the string course at 40 m; the attic arches.
 * Left out: the statues, the inscription, the modillions themselves (the
 *   cornice is one deep bevelled band), the railing on the cornice, flags.
 * Doubts: the north-east face is not photographed; it is drawn like the
 *   others above the low building against it.
 * Colours: the marble is a warm pink-tan in sunlit photos, pulled to the
 *   palette's lightness; the roof's copper is green.
 * Night: windows glow; the stone is floodlit faintly near the base.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, inset, walls, cap, cornice, panel, save } from './chi-field-museum'
import { archPanel, parapet } from './cle-city-hall'
import { chamfer } from './sea-columbia-center'

const X = 31.3, Y = 24.1
const BASE = 15, SHAFT = 46, CORN = 50.1, ATTIC = 57.9, ROOF = 62.5

function build() {
  const stone = new Part(), trim = new Part(), win = new Part(), copper = new Part(), roof = new Part(), door = new Part()
  const R = rect(-X, -Y, X, Y), RC = chamfer(R, 0.5) as XY[]

  // The block: base, shaft and frieze, split low into ≤ 5 m pieces for the terrain.
  for (let i = 0; i < RC.length; i++) {
    const a = RC[i], b = RC[(i + 1) % RC.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.ceil(L / 5)
    for (let k = 0; k < m; k++) {
      const P = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const p0 = P(k / m), p1 = P((k + 1) / m)
      stone.quad([p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], 6], [p0[0], p0[1], 6])
    }
  }
  walls(stone, RC, 6, CORN - 1.6)
  // Granite plinth, the balustrade band over the base, the string course, the cornice.
  cornice(trim, R, 0, 1.4, 0.25)
  cornice(trim, R, BASE - 1.6, BASE - 1.0, 0.35)
  parapet(trim, inset(R, -0.35), BASE - 1.0, BASE, 0.5)
  cornice(trim, R, 39.6, 40.4, 0.3)
  cornice(trim, R, CORN - 4.0, CORN, 1.6)
  cap(roof, inset(R, -0.64), CORN)

  // The attic: set back 1.8 m, its own small cornice, a parapet on the cornice.
  const A = inset(R, 1.8)
  walls(stone, chamfer(A, 0.4) as XY[], CORN, ATTIC - 0.8)
  cornice(trim, A, ATTIC - 0.8, ATTIC, 0.4)
  parapet(trim, inset(R, -0.2), CORN, CORN + 1.0, 0.4)

  // Copper hip up to the flat roof, and the penthouse on it.
  const eave = inset(A, -0.16), top = inset(A, 7)
  walls(copper, eave, ATTIC, ROOF, top)
  cap(roof, top, ROOF)
  const pent = rect(-12, -10, 12, 8)
  walls(roof, pent, ROOF, 66.5)
  cap(roof, pent, 66.5)

  // Facades: the same on all four faces.
  for (let i = 0; i < 4; i++) {
    const a = R[i], b = R[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = L > 55 ? 13 : 10, end = 2.4, pitch = (L - 2 * end) / n, w = 1.9
    const cx = (k: number) => end + pitch * (k + 0.5)
    // shaft: ten storeys, two to a panel
    for (let k = 0; k < n; k++) {
      for (let g = 0; g < 5; g++) {
        const z0 = BASE + 0.9 + g * 6.2, z1 = z0 + 4.6
        if (g === 4) { panel(win, a, b, cx(k) - w / 2, cx(k) + w / 2, 40.9, 45.2); continue }
        panel(win, a, b, cx(k) - w / 2, cx(k) + w / 2, z0, Math.min(z1, 39.2))
      }
    }
    // base: tall round-arched windows on every second bay, in pale surrounds
    const arches = Math.floor(n / 2), ap = (L - 2 * end) / arches
    const north = i === 2 // the north-east face stands behind the low building up to 6 m
    for (let k = 0; k < arches; k++) {
      const c = end + ap * (k + 0.5), aw = 4.2
      const entrance = i === 1 && k === Math.floor(arches / 2)
      archPanel(trim, a, b, c - aw / 2 - 0.5, c + aw / 2 + 0.5, north ? 6.4 : 1.6, 8.6, 0.04)
      if (entrance) {
        archPanel(win, a, b, c - aw / 2 - 0.2, c + aw / 2 + 0.2, 6.0, 8.6, 0.08)
        panel(door, a, b, c - 1.4, c + 1.4, 0, 5.6, 0.1)
      } else archPanel(win, a, b, c - aw / 2, c + aw / 2, north ? 6.8 : 2.4, 8.6, 0.08)
    }
    // attic arcade: a small round-headed window over each bay
    const aL = L - 3.6, aend = end - 1.8, apitch = (aL - 2 * aend) / n
    const ia = A[i], ib = A[(i + 1) % 4]
    for (let k = 0; k < n; k++) {
      const c = aend + apitch * (k + 0.5)
      archPanel(win, ia, ib, c - 0.9, c + 0.9, CORN + 1.6, ATTIC - 2.6, 0.05)
    }
  }

  return [
    { part: stone, material: { ...finish('frb-marble', 0xd9bba9), floodlight: (p: number[]) => Math.max(0, 1 - p[2] / 20) * 0.5 } },
    { part: trim, material: finish('frb-marble-trim', 0xe9d4c4) },
    { part: win, material: PALETTE.window },
    { part: copper, material: finish('frb-copper', 0x86a996) },
    { part: roof, material: PALETTE.roof },
    { part: door, material: finish('frb-bronze', 0x6f6457) },
  ]
}

if (import.meta.main) await save('cle-federal-reserve-bank', 'Federal Reserve Bank of Cleveland', [41.5019401, -81.6902829], 56, build() as any)
