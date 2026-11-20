/**
 * North Carolina Museum of Art, West Building, Raleigh (Thomas Phifer and
 * Partners, 2010): procedural, CC0-1.0.
 * bun generators/ral-ncma-west-building.ts [out.glb]
 *
 * A long, low, single-storey pavilion: walls of anodised aluminium panels,
 * glass walls where it opens onto its garden courts, and a roof of many
 * parallel curved light scoops ("eyebrows") running the length of it.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 6.2, so x runs
 * along the building's long walls (bearing 96.2).
 * Origin: the centroid of OSM way/99269122 "West Building"
 * (-78.703789, 35.811059).
 * y = 0 is the lowest ground under the footprint; Mapterhorn (z13) puts
 * most of the site about G = 1 m above it, rising to ~3.5 m at the
 * north-east corner. Elevation 0.
 *
 * Plan (measured): OSM way/99269122, used as drawn; NAIP confirms it. Its
 * notches are the garden courts: the entrance court on the west, the slot
 * courts from the south and east (dark in NAIP: reflecting pools), and the
 * planted courts on the south and north. Every wall that faces a court (its
 * outward ray meets the building again) is glazed (n30 shows one, floor to
 * roof); the outer walls are aluminium (n31).
 * Heights (no lidar in Wake County): walls 8.2 m over the ground, from n30
 * (the court's glass wall is two tall lights) and n31; the scoops rise
 * about 2 m over the roof deck (n30, their rounded ends over the parapet);
 * estimated.
 * The scoops: NAIP shows parallel ridges along x about 5.2 m apart; drawn
 * as continuous vaults 4.6 m wide with a long curved south side and a
 * steeper glazed north face (the north light they catch), clipped to the
 * plan 0.8 m inside the parapet. Their division into separate scoops
 * (NAIP shows faint breaks) is left out.
 * The walls: vertical aluminium panels about 3.2 m wide, folded so
 * alternate panels catch the light differently (n31's striping): drawn as a
 * shallow sawtooth 0.45 m deep.
 *
 * Photos (evidence):
 *  n30 "North Carolina Art Museum - panoramio.jpg", Sam Shaber, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:North_Carolina_Art_Museum_-_panoramio.jpg
 *  n31 "North Carolina Art Museum Entrance - panoramio.jpg", Sam Shaber, CC BY-SA 3.0
 *      https://commons.wikimedia.org/wiki/File:North_Carolina_Art_Museum_Entrance_-_panoramio.jpg
 * Aerial: USGS NAIP (public domain): plan, courts, the scoop rows.
 *
 * Colours: silver anodised aluminium; white scoops; pale reflective glass.
 * Left out: the reflecting pools and gardens (out of scope), the entrance
 * canopy and doors (no photo places them), rooftop equipment.
 * Doubts: only two licensed exterior photos were found, both from the
 * south-west; the other sides follow NAIP and the same wall system. Heights
 * are estimated. The scoops' exact profile is simplified.
 * Night: the court glass glows; the scoops' glazed faces stay dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, ccw, capRing, outward, finishGlb, writeModel } from './sea-tacoma-union-station'
import { quadO } from './nash-tennessee-state-capitol'

const RAW: XY[] = [[-59.6, -4.3], [-59.8, -30.7], [-18.3, -30.8], [-17.7, 0.3], [-12.3, 0.2], [-12.9, -30.3], [29.3, -31.0], [29.7, -7.9], [51.1, -8.3], [50.6, -32.0], [77.0, -32.5], [77.6, 1.3], [46.7, 1.8], [46.8, 7.5], [77.8, 6.9], [78.3, 32.9], [20.7, 33.9], [20.1, 1.9], [-0.9, 2.3], [-0.2, 34.3], [-58.8, 35.3], [-59.1, 17.2], [-35.2, 16.7], [-35.3, -4.7]]
const C: XY = [10.1, 1.4]
const PLAN = ccw(RAW.map(([x, y]) => [x - C[0], y - C[1]] as XY))
const G = 1.0, TOP = G + 8.2, DECK = TOP - 0.5, SCOOP = 2.0, PITCH = 5.2, SW = 4.6

function build() {
  const alu = new Part(), roof = new Part(), scoop = new Part(), glaze = new Part(), dark = new Part()
  let y0 = 1e9, y1 = -1e9
  for (const [, y] of PLAN) { y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
  const inside = (x: number, y: number) => {
    let c = false
    for (let i = 0, j = PLAN.length - 1; i < PLAN.length; j = i++) {
      const [xi, yi] = PLAN[i], [xj, yj] = PLAN[j]
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
    }
    return c
  }
  // an outer wall: its outward ray never meets the building again (a court wall's does)
  const onBox = (a: XY, b: XY) => {
    const n = outward(a, b)
    for (const t of [0.25, 0.5, 0.75]) {
      const m: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      for (let d = 1; d < 70; d += 1) if (inside(m[0] + n[0] * d, m[1] + n[1] * d)) return false
    }
    return true
  }

  // ------------------------------------------------------------ the walls
  for (let i = 0; i < PLAN.length; i++) {
    const a = PLAN[i], b = PLAN[(i + 1) % PLAN.length]
    const n = outward(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const P = (s: number, d: number, z: number): V3 => [a[0] + ((b[0] - a[0]) / L) * s + n[0] * d, a[1] + ((b[1] - a[1]) / L) * s + n[1] * d, z]
    const out: V3 = [n[0], n[1], 0]
    // the coping, a little proud
    quadO(alu, P(0, 0.12, TOP - 0.45), P(L, 0.12, TOP - 0.45), P(L, 0.12, TOP), P(0, 0.12, TOP), out)
    quadO(alu, P(0, 0, TOP), P(L, 0, TOP), P(L, 0.12, TOP), P(0, 0.12, TOP), [0, 0, 1])
    if (onBox(a, b)) {
      // folded aluminium panels, in pieces no longer than ~3.2 m
      const k = Math.max(1, Math.round(L / 3.2)), w = L / k
      for (let j = 0; j < k; j++) {
        const d0 = j % 2 ? 0.45 : 0, d1 = j % 2 ? 0 : 0.45
        const s0 = j * w, s1 = (j + 1) * w
        const e0 = j === 0 ? 0 : d0, e1 = j === k - 1 ? 0 : d1
        quadO(alu, P(s0, e0, 0), P(s1, e1, 0), P(s1, e1, TOP - 0.45), P(s0, e0, TOP - 0.45), out)
      }
    } else {
      // a court wall: the aluminium frame, then glass floor to roof with fins
      quadO(alu, P(0, 0, 0), P(L, 0, 0), P(L, 0, TOP - 0.45), P(0, 0, TOP - 0.45), out)
      quadO(glaze, P(0.4, 0.06, G + 0.1), P(L - 0.4, 0.06, G + 0.1), P(L - 0.4, 0.06, TOP - 0.7), P(0.4, 0.06, TOP - 0.7), out)
      const k = Math.max(1, Math.round(L / 3.0))
      for (let j = 1; j < k; j++) {
        const s = (j * L) / k
        quadO(alu, P(s - 0.13, 0.1, G + 0.1), P(s + 0.13, 0.1, G + 0.1), P(s + 0.13, 0.1, TOP - 0.7), P(s - 0.13, 0.1, TOP - 0.7), out)
      }
      // a transom line between the two tall lights (n30)
      const zt = G + 3.9
      quadO(alu, P(0.4, 0.1, zt), P(L - 0.4, 0.1, zt), P(L - 0.4, 0.1, zt + 0.25), P(0.4, 0.1, zt + 0.25), out)
    }
  }
  // the roof deck inside the parapet
  capRing(roof, PLAN, DECK)

  // ------------------------------------------------------------ the scoops
  // x-intervals inside the plan at a given y
  const span = (y: number): [number, number][] => {
    const xs: number[] = []
    for (let i = 0; i < PLAN.length; i++) {
      const [ax, ay] = PLAN[i], [bx, by] = PLAN[(i + 1) % PLAN.length]
      if ((ay > y) !== (by > y)) xs.push(ax + ((y - ay) * (bx - ax)) / (by - ay))
    }
    xs.sort((p, q) => p - q)
    const out: [number, number][] = []
    for (let i = 0; i + 1 < xs.length; i += 2) out.push([xs[i], xs[i + 1]])
    return out
  }
  const clip = (A: [number, number][], B: [number, number][]) => {
    const out: [number, number][] = []
    for (const [a0, a1] of A) for (const [b0, b1] of B) { const l = Math.max(a0, b0), r = Math.min(a1, b1); if (r > l) out.push([l, r]) }
    return out
  }
  // profile across a scoop, from its south foot (v = 0) to its north foot (v = SW)
  const PROF: [number, number][] = []
  const NS = 6, PEAK = 3.7
  for (let i = 0; i <= NS; i++) {
    const t = i / NS, a = (t * Math.PI) / 2
    PROF.push([PEAK * (1 - Math.cos(a)), SCOOP * Math.sin(a)]) // the long curved south side
  }
  const lastCurve = PROF.length - 1
  PROF.push([PEAK + 0.55, SCOOP * 0.7], [SW, 0]) // the steeper north face, glazed
  for (let yc = y0 + 0.8 + SW / 2; yc + SW / 2 < y1 - 0.8; yc += PITCH) {
    const ya = yc - SW / 2, yb = yc + SW / 2
    let iv = clip(clip(span(ya - 0.8), span(yc)), span(yb + 0.8))
    iv = iv.map(([l, r]) => [l + 0.8, r - 0.8] as [number, number]).filter(([l, r]) => r - l > 3)
    for (const [l, r] of iv) {
      for (let i = 0; i + 1 < PROF.length; i++) {
        const [va, za] = PROF[i], [vb, zb] = PROF[i + 1]
        const part = i >= lastCurve ? dark : scoop
        const nrm: V3 = [0, -(zb - za), vb - va] // outward across the profile
        quadO(part, [l, ya + va, DECK + za], [r, ya + va, DECK + za], [r, ya + vb, DECK + zb], [l, ya + vb, DECK + zb], nrm)
      }
      // the end walls of the scoop
      for (const [x, s] of [[l, -1], [r, 1]] as const) {
        for (let i = 1; i + 1 < PROF.length; i++) {
          const A: V3 = [x, ya, DECK], B: V3 = [x, ya + PROF[i][0], DECK + PROF[i][1]], D: V3 = [x, ya + PROF[i + 1][0], DECK + PROF[i + 1][1]]
          const u = [B[1] - A[1], B[2] - A[2]], v = [D[1] - A[1], D[2] - A[2]]
          const cx = u[0] * v[1] - u[1] * v[0] // x-component of the normal
          if ((cx > 0 ? 1 : -1) === s) scoop.tri(A, B, D)
          else scoop.tri(A, D, B)
        }
      }
    }
  }

  return finishGlb('North Carolina Museum of Art, West Building', [
    { part: alu, material: finish('ncma-aluminium', 0xd2d6d9) },
    { part: roof, material: PALETTE.roof },
    { part: scoop, material: finish('ncma-scoop', 0xf2f1ec) },
    { part: glaze, material: windowVariant(2, 0xa9bfd1) },
    { part: dark, material: PALETTE.glass },
  ], { bearing: 6.2, height: DECK + SCOOP, replaces: ['way/99269122'] }, 5000)
}

if (import.meta.main) await writeModel('ral-ncma-west-building', build())
