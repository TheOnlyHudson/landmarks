/**
 * Holocaust Memorial Miami Beach (Holocaust Memorial of the Greater Miami
 * Jewish Federation, 1990, Kenneth Treister; 1933-1945 Meridian Avenue) —
 * original procedural geometry, CC0-1.0.
 * bun generators/mia-holocaust-memorial.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The memorial is laid
 * out on circles about the sculpture, so the anchor is their common centre
 * (25.7954878, -80.1362087): the centre of the Jerusalem-stone enclosure
 * as lidar and OSM's mural wall way/588999185 both draw it, 11 m west and
 * 4 m south of the centroid of OSM's monument outline way/92334592 (an
 * area that also takes in the entrance walk and lawn).
 *
 * y = 0 is the floor of the sunken plaza inside the enclosure, the lowest
 * ground under the model (lidar 0.5 m below the pond and the paths).
 *
 * Identity, in order: the 13 m oxidised-bronze forearm and hand ("Sculpture
 * of Love and Anguish") reaching up from the middle of the round plaza, its
 * lower half crowded with climbing figures; the low round wall of pale
 * Jerusalem stone around the plaza, black granite inside (the names); the
 * stone tunnel leading into it from the east-south-east; the half-ring
 * pergola (Arbor of History) on the far side of the pond.
 * The pond (natural=water way/588999171) is the map's and is not modelled.
 *
 * Evidence:
 *  - lidar FL_TopobathyFLKeysNOAA_Hydroflattened_2019 (flown 2019), 0.5 m
 *    grid (measured, above the plaza): enclosure wall a circle r 10.5, top
 *    2.45; pond and paths outside +0.5; arm top 14.5 just west of the
 *    centre (x -0.5), a second return at 11.5 two metres west (the thumb);
 *    the tunnel walls 2.5-3.2 high running out at about 113 deg, 4 m wide.
 *  - OSM: mural walls way/588999185 (the enclosure and the tunnel's walls)
 *    and way/588999179 (the granite wall of the pergola, an arc r ~31
 *    from bearing 190 round the east to 50); the ring path way/92334600
 *    (r 29); the tunnel footway way/92334586 (covered).
 *  - published: the arm 42 ft (12.8 m) (Treister; Wikipedia); with its
 *    base mound that agrees with lidar's 14.5.
 *  - photos (proportions scaled from the 2.45 m wall): forearm ~2 m thick,
 *    the figure-crowded base flaring to ~4.4 m; the hand ~2.6 m across,
 *    fingers spread and reaching up; figures 1.8-2 m tall in the plaza.
 *  - estimated: the pergola (stone posts every 3 m, timber joists, 3.2 m
 *    high, under trees in lidar), the tunnel's portal, the hand's pose
 *    (palm across west-east with the thumb to the west, from lidar's thumb
 *    return; fingers curl a little south as in Di Palma 18), number and
 *    places of the standing figures.
 *  - colour: bronze verdigris green, Jerusalem stone cream, black granite
 *    pulled to charcoal, weathered timber.
 *
 * Night: the arm is floodlit from the plaza (`floodlight` on the bronze);
 * nothing else is lit.
 *
 * Photos (Wikimedia Commons):
 *  - "Memoriale dell'olocausto di Miami Beach.jpg", Giu.gent93, CC BY-SA 4.0
 *    (across the pond: wall, arm, pergola posts behind)
 *  - "Holocaust Memorial Miami Beach.jpg", Ricardo Olbera Liriano,
 *    CC BY-SA 4.0 (the figure-crowded base)
 *  - "Miami Beach - South Beach Monuments - Holocaust Memorial 01/12/14/18.jpg",
 *    Daniel Di Palma, CC BY-SA 4.0 (pergola and photo wall; plaza figures;
 *    the arm over the wall from across the pond)
 * Look-only: none.
 *
 * Doubts: the hand's compass orientation (no photo gives its direction for
 * certain); the pergola's posts and height; small sculpture (lying figures,
 * the Lone Child) left out.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './chi-aon-center'
import { box, hexa, poly } from './mia-marine-stadium'

const D2R = Math.PI / 180
/** Point at compass bearing b (deg), radius r, height z. */
const at = (b: number, r: number, z: number): V3 => [r * Math.sin(b * D2R), r * Math.cos(b * D2R), z]

/** A deterministic wobble in [-1, 1]. */
const noise = (i: number, j: number) => {
  const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453
  return (s - Math.floor(s)) * 2 - 1
}

function build() {
  const stone = new Part(), granite = new Part(), bronze = new Part(), wood = new Part()

  // ---------------------------------------------- the enclosure wall ---
  const R_OUT = 10.8, R_IN = 10.3, WALL = 2.45
  const T_B = 113, GAP = 11 // tunnel bearing and the gap's half-angle
  const N = 40
  for (let i = 0; i < N; i++) {
    const b0 = T_B + GAP + (i * (360 - 2 * GAP)) / N, b1 = T_B + GAP + ((i + 1) * (360 - 2 * GAP)) / N
    const o0 = at(b0, R_OUT, 0), o1 = at(b1, R_OUT, 0)
    poly(stone, [o0, o1, at(b1, R_OUT, WALL), at(b0, R_OUT, WALL)], [o0[0] + o1[0], o0[1] + o1[1], 0])
    poly(granite, [at(b0, R_IN, 0), at(b1, R_IN, 0), at(b1, R_IN, WALL - 0.25), at(b0, R_IN, WALL - 0.25)], [-(o0[0] + o1[0]), -(o0[1] + o1[1]), 0])
    poly(stone, [at(b0, R_IN, WALL - 0.25), at(b1, R_IN, WALL - 0.25), at(b1, R_IN, WALL), at(b0, R_IN, WALL)], [-(o0[0] + o1[0]), -(o0[1] + o1[1]), 0])
    poly(stone, [at(b0, R_IN, WALL), at(b1, R_IN, WALL), at(b1, R_OUT + 0.15, WALL), at(b0, R_OUT + 0.15, WALL)], [0, 0, 1])
    poly(stone, [at(b0, R_OUT + 0.15, WALL - 0.3), at(b1, R_OUT + 0.15, WALL - 0.3), at(b1, R_OUT + 0.15, WALL), at(b0, R_OUT + 0.15, WALL)], [o0[0] + o1[0], o0[1] + o1[1], 0])
    poly(stone, [at(b0, R_OUT, WALL - 0.3), at(b1, R_OUT, WALL - 0.3), at(b1, R_OUT + 0.15, WALL - 0.3), at(b0, R_OUT + 0.15, WALL - 0.3)], [0, 0, -1])
  }

  // ----------------------------------------------------- the tunnel ---
  // A roofed stone passage on the 113 deg axis, from the wall to r 24.
  const u: V3 = [Math.sin(T_B * D2R), Math.cos(T_B * D2R), 0], v: V3 = [-u[1], u[0], 0]
  const P = (s: number, w: number, z: number): V3 => [u[0] * s + v[0] * w, u[1] * s + v[1] * w, z]
  const S0 = 9.9, S1 = 24, HW = 2.1, IW = 1.1
  const top = (s: number) => 2.7 + (0.7 * (s - S0)) / (S1 - S0)
  const cuts = [S0, 14.6, 19.3, S1]
  for (let k = 0; k < cuts.length - 1; k++) {
    const a = cuts[k], b = cuts[k + 1]
    hexa(stone, [P(a, -HW, 0), P(b, -HW, 0), P(b, HW, 0), P(a, HW, 0), P(a, -HW, top(a)), P(b, -HW, top(b)), P(b, HW, top(b)), P(a, HW, top(a))])
    // a darker band of granite along each flank (the names inside show at the mouths only)
  }
  // portals: dark openings at both ends
  poly(granite, [P(S1 + 0.04, -IW, 0), P(S1 + 0.04, IW, 0), P(S1 + 0.04, IW, top(S1) - 0.6), P(S1 + 0.04, -IW, top(S1) - 0.6)], u)
  poly(granite, [P(S0 - 0.04, -IW, 0), P(S0 - 0.04, IW, 0), P(S0 - 0.04, IW, top(S0) - 0.5), P(S0 - 0.04, -IW, top(S0) - 0.5)], [-u[0], -u[1], 0])

  // ------------------------------------------------- the pergola ring ---
  const B0 = 50, B1 = 190, R_POST = 27.6, R_WALL = 31.0, H = 3.2
  const NP = 25
  for (let i = 0; i <= NP; i++) {
    const b = B0 + ((B1 - B0) * i) / NP
    const c = at(b, R_POST, 0), t: V3 = [Math.cos(b * D2R), -Math.sin(b * D2R), 0], n: V3 = [Math.sin(b * D2R), Math.cos(b * D2R), 0]
    const q = (s: number, r: number, z: number): V3 => [c[0] + t[0] * s + n[0] * r, c[1] + t[1] * s + n[1] * r, z]
    hexa(stone, [q(-0.35, -0.35, 0), q(0.35, -0.35, 0), q(0.35, 0.35, 0), q(-0.35, 0.35, 0), q(-0.35, -0.35, H - 0.35), q(0.35, -0.35, H - 0.35), q(0.35, 0.35, H - 0.35), q(-0.35, 0.35, H - 0.35)])
    // radial joist from the post to the granite wall
    hexa(wood, [q(-0.22, -0.7, H - 0.35), q(0.22, -0.7, H - 0.35), q(0.22, R_WALL - R_POST + 0.5, H - 0.35), q(-0.22, R_WALL - R_POST + 0.5, H - 0.35),
      q(-0.22, -0.7, H), q(0.22, -0.7, H), q(0.22, R_WALL - R_POST + 0.5, H), q(-0.22, R_WALL - R_POST + 0.5, H)])
  }
  const NS = 28
  for (let i = 0; i < NS; i++) {
    const b0 = B0 + ((B1 - B0) * i) / NS, b1 = B0 + ((B1 - B0) * (i + 1)) / NS
    const nrm: V3 = [Math.sin(((b0 + b1) / 2) * D2R), Math.cos(((b0 + b1) / 2) * D2R), 0]
    // beam along the posts
    const ring = (r0: number, r1: number, z0: number, z1: number, p: Part, outer: Part = p) => {
      poly(outer, [at(b0, r1, z0), at(b1, r1, z0), at(b1, r1, z1), at(b0, r1, z1)], nrm)
      poly(p, [at(b0, r0, z0), at(b1, r0, z0), at(b1, r0, z1), at(b0, r0, z1)], [-nrm[0], -nrm[1], 0])
      poly(p, [at(b0, r0, z1), at(b1, r0, z1), at(b1, r1, z1), at(b0, r1, z1)], [0, 0, 1])
      poly(p, [at(b0, r0, z0), at(b1, r0, z0), at(b1, r1, z0), at(b0, r1, z0)], [0, 0, -1])
    }
    ring(R_POST - 0.3, R_POST + 0.3, H - 0.75, H - 0.35, wood)
    // the black granite photo wall (faces the walk), stone behind, capped
    ring(R_WALL - 0.25, R_WALL + 0.25, 0, 2.5, granite, stone)
    ring(R_WALL - 0.3, R_WALL + 0.3, 2.5, 2.75, stone)
  }
  // end faces of the granite wall
  for (const b of [B0, B1]) {
    const t: V3 = [Math.cos(b * D2R), -Math.sin(b * D2R), 0]
    const s = b === B0 ? -1 : 1
    poly(granite, [at(b, R_WALL - 0.25, 0), at(b, R_WALL + 0.25, 0), at(b, R_WALL + 0.25, 2.5), at(b, R_WALL - 0.25, 2.5)], [t[0] * s, t[1] * s, 0])
    poly(stone, [at(b, R_WALL - 0.3, 2.5), at(b, R_WALL + 0.3, 2.5), at(b, R_WALL + 0.3, 2.75), at(b, R_WALL - 0.3, 2.75)], [t[0] * s, t[1] * s, 0])
  }

  // ------------------------------------------------------ the arm ---
  const AX = -0.5, AY = -0.4 // arm axis (lidar)
  // Radius profile up the arm: the crowd of figures at the base, the
  // forearm, the wrist. Lumpy below 7 m (figures), smooth above.
  const prof: [number, number, number][] = [ // [z, r, lumpiness]
    [0, 2.2, 0.45], [0.9, 2.05, 0.45], [2.0, 1.85, 0.45], [3.2, 1.65, 0.4], [4.4, 1.5, 0.35], [5.6, 1.35, 0.3],
    [6.8, 1.2, 0.22], [8.0, 1.1, 0.1], [9.2, 1.0, 0.04], [10.2, 0.95, 0], [10.9, 0.9, 0],
  ]
  const SEG = 14
  const ringPts = prof.map(([z, r, l], j) =>
    Array.from({ length: SEG }, (_, i): V3 => {
      const a = (i / SEG) * 2 * Math.PI + j * 0.35
      const rr = r * (1 + l * 0.6 * noise(i, j))
      // the forearm is a little flattened across the palm's plane
      return [AX + rr * Math.cos(a) * 1.05, AY + rr * Math.sin(a) * 0.9, z + (l > 0 && j > 0 ? l * 0.5 * noise(j, i) : 0)]
    }))
  bronze.loft(ringPts)

  // the hand: palm across x, thin in y, flaring from the wrist
  const W0 = 10.9, W1 = 12.4
  const palmBot: V3[] = [[AX - 0.95, AY - 0.42, W0], [AX + 0.95, AY - 0.42, W0], [AX + 0.95, AY + 0.42, W0], [AX - 0.95, AY + 0.42, W0]]
  // close the wrist under the palm with the arm's top ring
  const topRing = ringPts[ringPts.length - 1]
  for (let i = 0; i < SEG; i++) {
    const a = topRing[i], b = topRing[(i + 1) % SEG]
    const c: V3 = [AX, AY, W0]
    poly(bronze, [a, b, c], [0, 0, 1])
  }
  const palmTop: V3[] = [[AX - 1.3, AY - 0.4, W1], [AX + 1.25, AY - 0.4, W1], [AX + 1.25, AY + 0.4, W1], [AX - 1.3, AY + 0.4, W1]]
  hexa(bronze, [...palmBot, ...palmTop])
  // four fingers spread like a fan, reaching up and curling south
  const fingers: [number, number, number][] = [ // [x at the knuckle, length, spread deg]
    [-0.95, 1.9, -14], [-0.32, 2.3, -4], [0.32, 2.15, 5], [0.95, 1.7, 15],
  ]
  for (const [fx, L, sp] of fingers) {
    const s = Math.sin(sp * D2R), c = Math.cos(sp * D2R)
    const base: V3 = [AX + fx, AY, W1]
    const k1: V3 = [base[0] + s * L * 0.55, base[1] - 0.12, W1 + c * L * 0.55]
    const tip: V3 = [base[0] + s * L, base[1] - 0.55, W1 + c * L * 0.95]
    const seg = (a: V3, b: V3, w0: number, w1: number) => {
      const sq = (p: V3, w: number): V3[] => [[p[0] - w, p[1] - w, p[2]], [p[0] + w, p[1] - w, p[2]], [p[0] + w, p[1] + w, p[2]], [p[0] - w, p[1] + w, p[2]]]
      hexa(bronze, [...sq(a, w0), ...sq(b, w1)])
    }
    seg(base, k1, 0.3, 0.27)
    seg(k1, tip, 0.27, 0.21)
  }
  // the thumb, out to the west and up
  {
    const base: V3 = [AX - 1.0, AY + 0.05, 11.3], k1: V3 = [AX - 1.75, AY - 0.05, 11.8], tip: V3 = [AX - 2.15, AY - 0.3, 12.7]
    const sq = (p: V3, w: number): V3[] => [[p[0] - w, p[1] - w, p[2]], [p[0] + w, p[1] - w, p[2]], [p[0] + w, p[1] + w, p[2]], [p[0] - w, p[1] + w, p[2]]]
    hexa(bronze, [...sq(base, 0.32), ...sq(k1, 0.28)])
    hexa(bronze, [...sq(k1, 0.28), ...sq(tip, 0.2)])
  }

  // ------------------------------------------- figures in the plaza ---
  const figs: [number, number, number][] = [ // [bearing, radius, height]
    [20, 5.2, 1.9], [75, 6.3, 1.8], [150, 5.0, 2.0], [205, 6.6, 1.7], [255, 4.8, 1.9], [320, 6.0, 1.8], [340, 4.4, 2.1],
  ]
  for (const [b, r, h] of figs) {
    const c = at(b, r, 0)
    const body = (x: number, y: number, w: number, d: number, z0: number, z1: number, w1 = w, d1 = d): V3[] =>
      [[x - w, y - d, z0], [x + w, y - d, z0], [x + w, y + d, z0], [x - w, y + d, z0], [x - w1, y - d1, z1], [x + w1, y - d1, z1], [x + w1, y + d1, z1], [x - w1, y + d1, z1]]
    hexa(bronze, body(c[0], c[1], 0.22, 0.16, 0, h * 0.5, 0.26, 0.17))
    hexa(bronze, body(c[0], c[1], 0.26, 0.17, h * 0.5, h * 0.84, 0.22, 0.15))
    hexa(bronze, body(c[0], c[1], 0.12, 0.12, h * 0.84, h, 0.13, 0.13))
  }

  const lit = (p: V3, n: V3) => {
    if (Math.hypot(p[0] - AX, p[1] - AY) > 3.5) return 0
    return n[2] > 0.8 ? 0.3 : 0.85
  }
  return [
    { part: stone, material: finish('hm-jerusalem-stone', 0xece1cc) },
    { part: granite, material: finish('hm-granite', 0x4a4f57) },
    { part: bronze, material: { ...finish('hm-bronze', 0x5e9886), floodlight: lit } },
    { part: wood, material: finish('hm-timber', 0x8f7d68) },
  ]
}

if (import.meta.main) await save('mia-holocaust-memorial', 'Holocaust Memorial Miami Beach', [25.7954878, -80.1362087], 0, build(), 5000)
