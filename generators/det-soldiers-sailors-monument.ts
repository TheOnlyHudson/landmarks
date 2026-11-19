/**
 * Michigan Soldiers' and Sailors' Monument, Campus Martius, Detroit (1867-72;
 * Randolph Rogers, sculptor; Alexander Chapoton, architect; the four
 * allegorical women added 1881): procedural, CC0-1.0, no textures.
 * bun generators/det-soldiers-sailors-monument.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor: the centroid of OSM way/107624906 (historic=memorial,
 * memorial=war_memorial, Q6837679, NRHP 84001862; not a building), whose
 * cross-shaped outline (a 2.7 m core square on the compass axes with four
 * diagonal arms) puts the monument's axes on the compass: bearing 0. The
 * front, with the CAMPUS MARTIUS PARK band and the JULY 4 1867 stone, faces
 * -y (south, toward Woodward and the river); Michigania faces it. OSM maps
 * no building here: replaces [].
 *
 * Identity, in order: the stepped pale granite pile rising in octagonal
 * stages to a slim shaft and drum crowned by the bronze Michigania, shield
 * raised and sword drawn; the ring of bronze figures on it (four eagles
 * with raised wings on corner pedestals, four standing soldiers and sailor
 * on the cardinal buttresses, four seated women above them); the bronze
 * medallion panels; the dark granite fountain base with its rounded basins
 * at the corners.
 *
 * Evidence
 * - Lidar: USGS 3DEP USGS_LPC_MI_WayneCo_2017_LAS_2018 (flown 2017), 0.5 m
 *   grid, centred on the anchor. Plaza ground 0.55 m over the grid minimum.
 *   Over it: the dark base ~1.0 m, ~10 m across; the step plateau 2.35 m,
 *   ~7.5-8 m across; corner pedestals with eagles ~4.6-5.3 m at about
 *   (+-2.2, +-1.9); the standing figures' tops 7.8-9.0 m; returns of
 *   10.3-10.6 m (the seated women) and 12.9 m (the shaft); the highest
 *   return 15.75 m at the centre.
 * - Published: Wikipedia "Michigan Soldiers' and Sailors' Monument":
 *   octagonal sections rising from the base; eagles with raised wings;
 *   Navy, Infantry, Cavalry and Artillery; Victory, History, Emancipation
 *   and Union; medallions of Lincoln, Grant, Sherman and Farragut;
 *   Michigania with a sword in her right hand and a raised shield. No
 *   height is published there; the brief's ~18 m is not borne out by the
 *   lidar (15.75 m), so the model is built to ~16.7 m to the shield's top.
 * - Photos (Wikimedia Commons, all evidence), in
 *   SCRATCH/work/det-soldiers-sailors-monument/photos:
 *   - "Michigan Soldiers' and Sailors' Monument.jpg", Milana.mees, CC BY 4.0,
 *     the front, near face-on: every stage, the basins, the steps
 *     https://commons.wikimedia.org/wiki/File:Michigan_Soldiers%27_and_Sailors%27_Monument.jpg
 *   - "Michigan Soldiers' and Sailors' Monument 1.jpg", JJonahJackalope,
 *     CC BY-SA 4.0, front three-quarter
 *     https://commons.wikimedia.org/wiki/File:Michigan_Soldiers%27_and_Sailors%27_Monument_1.jpg
 *   - "Michigan Soldiers' and Sailors' Monument 2.jpg", JJonahJackalope,
 *     CC BY-SA 4.0, another side
 *     https://commons.wikimedia.org/wiki/File:Michigan_Soldiers%27_and_Sailors%27_Monument_2.jpg
 *   - "MichiganSoldiersSailors.jpg", Mikerussell, CC BY-SA 3.0, from further
 *     off: the overall proportions
 *     https://commons.wikimedia.org/wiki/File:MichiganSoldiersSailors.jpg
 *
 * Numbers. Measured: base 0.95, plateau 2.35, eagle pedestals 4.5 (eagles
 * to 5.3), soldiers' tops 8.7, women's tops ~10.6, the plan sizes.
 * Estimated from the Milana.mees photo scaled between those: the core die
 * to 6.3, the second (medallion) stage to 8.8, the shaft to 11.6 and its
 * cornice 12.0, the drum to 13.5, Michigania 2.7 m to her head (16.2; ~18% of the
 * whole in the photo) with the shield to 16.7; core die 3.4 m across with
 * 1.6 m buttresses (scaled from the photo against the 9.2 m base). The figures are simplified heroic bodies in their
 * poses (the sailor with his arm out, the infantryman, cavalryman and
 * artilleryman standing; the women seated); the eagles are a body and two
 * raised wing slabs. Left out: the inscriptions, the wreaths and stars on
 * the drum, the cannon and flags in the figures' hands.
 *
 * Colours: pale granite #c8c4bc in sun -> #e2dfd8; the dark granite base
 * #4f4b46 -> #85807a (kept darker: it reads as the dark ring in every
 * photo); bronze #3d3a35 -> #5d5b54 (the silhouette). Water and the
 * plaza paving are not modelled; the basins' rims stand above the plaza and
 * are. Night: nothing marked lit (no night photo found).
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect, type XY } from './nyc-570-lexington'
import { TAU, smooth, solid, tube, ellipsoid, slab, turnSince, standingFigure } from './nyc-columbus-monument'

const granite = new Part(), dark = new Part(), bronze = new Part()

/** An octagonal (chamfered-square) stage from z0 to z1, half-width h, chamfer c. */
function stage(p: Part, h: number, c: number, z0: number, z1: number, bevel = 0.08) {
  prism({ wall: p, win: null, roof: p, ring: chamferRect(-h, -h, h, h, c), z0, z1, facade: null, bevel })
}
function boxAt(p: Part, cx: number, cy: number, hx: number, hy: number, z0: number, z1: number, bevel = 0.06) {
  prism({ wall: p, win: null, roof: p, ring: chamferRect(cx - hx, cy - hy, cx + hx, cy + hy, 0), z0, z1, facade: null, bevel })
}
/** Run `draw` four times, turned a quarter each time about the centre (the first faces -y). */
function fourWays(p: Part, draw: () => void) {
  for (let k = 0; k < 4; k++) {
    const from = p.pos.length
    draw()
    turnSince(p, from, (k * Math.PI) / 2)
  }
}

function build() {
  // --- The dark granite fountain base: an octagon with a rounded basin at each corner. ---
  const ZB = 0.95
  {
    // Split in pieces so the drape keeps it: the octagon as one prism is ~9 m; faces < 4 m.
    const ring: XY[] = chamferRect(-4.6, -4.6, 4.6, 4.6, 2.0)
    prism({ wall: dark, win: null, roof: dark, ring, z0: 0, z1: ZB, facade: null, bevel: 0.1 })
    for (let k = 0; k < 4; k++) {
      const a = TAU / 8 + (k * TAU) / 4, cx = 3.95 * Math.cos(a), cy = 3.95 * Math.sin(a)
      // Basin: a low round bowl with a rolled rim, 1.5 m across the rim's radius.
      const prof: [number, number][] = [[1.05, 0], [1.2, 0.4], [1.3, 0.7], [1.25, 0.8], [1.05, 0.76]]
      smooth(dark, (q) => {
        const rings = prof.map(([r, z]) => Array.from({ length: 14 }, (_, i): V3 => [cx + r * Math.cos((i * TAU) / 14), cy + r * Math.sin((i * TAU) / 14), z]))
        q.loft(rings)
        q.cap(rings[rings.length - 1], true)
      }, 50)
    }
  }

  // --- Four steps up to the plateau (2.35 m), a squared octagon each. ---
  const steps: [number, number, number][] = [[4.0, 1.4, 1.3], [3.65, 1.25, 1.65], [3.3, 1.1, 2.0], [2.95, 0.95, 2.35]]
  let z = ZB
  for (const [h, c, top] of steps) { stage(granite, h, c, z - 0.02, top, 0.05); z = top }
  const ZP = 2.35

  // --- Eagle pedestals on the diagonals, eagles with raised wings. ---
  for (let k = 0; k < 4; k++) {
    const a = TAU / 8 + (k * TAU) / 4, cx = 3.25 * Math.cos(a), cy = 3.25 * Math.sin(a)
    boxAt(granite, cx, cy, 0.62, 0.62, ZP - 0.4, 4.15, 0.06)
    boxAt(granite, cx, cy, 0.7, 0.7, 4.15, 4.5, 0.08)
    smooth(bronze, (q) => {
      const out: V3 = [Math.cos(a), Math.sin(a), 0], side: V3 = [-out[1], out[0], 0]
      const P = (f: number, s: number, u: number): V3 => [cx + out[0] * f + side[0] * s, cy + out[1] * f + side[1] * s, 4.5 + u]
      ellipsoid(q, P(0.05, 0, 0.32), [0.38, 0.22, 0.26], 7, 4, a, -0.5)
      ellipsoid(q, P(0.32, 0, 0.62), [0.13, 0.1, 0.12], 5, 3)
      for (const s of [-1, 1]) slab(q, P(0, s * 0.18, 0.4), side.map((v) => v * s) as V3, [0.15 * out[0], 0.15 * out[1], 1] as V3, [[0, 0], [0.8, 0.25], [0.95, 0.7], [0.55, 0.65], [0.1, 0.35]], 0.08)
    }, 60)
  }

  // --- The core die (2.35-6.3) and its four cardinal buttresses carrying the standing men. ---
  stage(granite, 1.85, 0.5, ZP - 0.02, 2.75, 0.05)
  stage(granite, 1.7, 0.45, 2.75, 6.0, 0.06)
  stage(granite, 1.82, 0.5, 6.0, 6.3, 0.08)
  fourWays(granite, () => {
    boxAt(granite, 0, -2.2, 0.8, 0.6, ZP - 0.02, 5.75, 0.05)
    boxAt(granite, 0, -2.25, 0.9, 0.68, 5.75, 6.0, 0.06)
  })
  // Bronze medallion panels between the buttresses (on the die's diagonal faces), and on the next stage.
  fourWays(bronze, () => {
    slab(bronze, [0, -1.72, 4.3], [1, 0, 0], [0, 0, 1], [[-0.4, -0.75], [0.4, -0.75], [0.4, 0.75], [-0.4, 0.75]], 0.06)
  })
  // The standing men: sailor (front), infantry, cavalry, artillery.
  const men: { arms: (h: number) => V3[][] }[] = [
    { arms: () => [[[-0.27, -1.9, 7.9], [-0.55, -2.25, 7.5], [-0.75, -2.45, 7.2]], [[0.27, -1.9, 7.9], [0.33, -1.95, 7.3], [0.3, -2.0, 6.9]]] },
    { arms: () => [[[-0.27, -1.9, 7.9], [-0.3, -1.95, 7.3], [-0.25, -2.05, 6.85]], [[0.27, -1.9, 7.9], [0.35, -2.05, 7.35], [0.25, -2.2, 7.1]]] },
    { arms: () => [[[-0.27, -1.9, 7.9], [-0.35, -1.95, 7.3], [-0.3, -2.0, 6.9]], [[0.27, -1.9, 7.9], [0.4, -2.0, 7.4], [0.3, -2.15, 7.0]]] },
    { arms: () => [[[-0.27, -1.9, 7.9], [-0.35, -2.0, 7.35], [-0.2, -2.15, 7.0]], [[0.27, -1.9, 7.9], [0.4, -2.0, 7.3], [0.45, -2.05, 6.9]]] },
  ]
  for (let k = 0; k < 4; k++) {
    const from = bronze.pos.length
    smooth(bronze, (q) => standingFigure(q, [0, -2.3, 6.0], 2.7, { arms: men[k].arms(2.7), hat: true }), 60)
    turnSince(bronze, from, (k * Math.PI) / 2)
  }

  // --- Second stage (6.3-8.8), medallions, and buttresses carrying the seated women. ---
  stage(granite, 1.3, 0.42, 6.3, 8.55, 0.06)
  stage(granite, 1.4, 0.46, 8.55, 8.8, 0.08)
  fourWays(granite, () => boxAt(granite, 0, -1.5, 0.58, 0.48, 6.3, 8.6, 0.05))
  fourWays(bronze, () => slab(bronze, [0, -1.33, 7.5], [1, 0, 0], [0, 0, 1], [[-0.45, -0.7], [0.45, -0.7], [0.45, 0.7], [-0.45, 0.7]], 0.06))
  for (let k = 0; k < 4; k++) {
    const from = bronze.pos.length
    smooth(bronze, (q) => seated(q, [0, -1.55, 8.6], 2.0), 60)
    turnSince(bronze, from, (k * Math.PI) / 2)
  }

  // --- Shaft (8.8-12.0), drum (12.0-13.5), Michigania. ---
  stage(granite, 0.92, 0.32, 8.8, 11.6, 0.06)
  stage(granite, 1.05, 0.36, 11.6, 12.0, 0.08)
  stage(granite, 0.7, 0.25, 12.0, 13.2, 0.05)
  stage(granite, 0.8, 0.28, 13.2, 13.5, 0.06)
  smooth(bronze, (q) => {
    standingFigure(q, [0, 0, 13.5], 2.7, {
      arms: [
        [[-0.12 * 2.7, 0, 13.5 + 0.8 * 2.7], [-0.5, -0.3, 15.3], [-0.85, -0.5, 15.05]],     // right arm, sword low out to her right
        [[0.12 * 2.7, 0, 13.5 + 0.8 * 2.7], [0.5, -0.05, 16.15], [0.45, -0.05, 16.45]],      // left arm raised with the shield
      ],
      cloak: true, hat: true,
    })
    // Drapery: her gown widens to the plinth.
    solid(q, [0, 0.4, 0.9].map((t) => Array.from({ length: 10 }, (_, i): V3 => [(0.42 - t * 0.12) * Math.cos((i * TAU) / 10), (0.36 - t * 0.1) * Math.sin((i * TAU) / 10), 13.5 + t])))
  }, 60)
  // The shield: a tall oval held high on her left; the sword, out and down to her right.
  slab(bronze, [0.6, -0.2, 16.0], [0.94, -0.34, 0], [0.15, 0, 1], Array.from({ length: 12 }, (_, i): [number, number] => [0.42 * Math.cos((i * TAU) / 12), 0.7 * Math.sin((i * TAU) / 12)]), 0.1)
  tube(bronze, [[-0.85, -0.5, 15.05], [-1.6, -0.65, 15.15]], [0.06, 0.04], 4)

  const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : 0.7)
  finishModel("Michigan Soldiers' and Sailors' Monument", 'det-soldiers-sailors-monument', [
    { part: granite, material: { name: 'granite', color: 0xe2dfd8, roughness: 0.85, floodlight: flood } },
    { part: dark, material: { name: 'dark-granite', color: 0x85807a, roughness: 0.7 } },
    { part: bronze, material: { name: 'bronze', color: 0x5d5b54, roughness: 0.5 } },
  ], { bearing: 0, osm: 'way/107624906', height: 16.7 }, 6500)
}

/** A seated draped woman facing -y, `h` tall seated, base at `c`. */
function seated(q: Part, c: V3, h: number) {
  const at = (x: number, y: number, z: number): V3 => [c[0] + x * h, c[1] + y * h, c[2] + z * h]
  const ring = (z: number, rx: number, ry: number, dy = 0) => Array.from({ length: 8 }, (_, i): V3 => at(rx * Math.cos((i * TAU) / 8), dy + ry * Math.sin((i * TAU) / 8), z))
  // Seat and lap with the drapery falling to the plinth in front.
  solid(q, [ring(0, 0.24, 0.24, -0.05), ring(0.3, 0.22, 0.24, -0.08), ring(0.42, 0.2, 0.22, 0)])
  // Torso and head.
  solid(q, [ring(0.42, 0.16, 0.12, 0.07), ring(0.7, 0.15, 0.1, 0.07), ring(0.8, 0.12, 0.09, 0.07), ring(0.84, 0.05, 0.05, 0.06)])
  ellipsoid(q, at(0, 0.05, 0.92), [0.06 * h, 0.065 * h, 0.08 * h], 6, 3)
  for (const s of [-1, 1]) tube(q, [at(s * 0.14, 0.07, 0.78), at(s * 0.18, -0.02, 0.58), at(s * 0.1, -0.12, 0.5)], [0.04 * h, 0.035 * h, 0.03 * h], 5)
}

if (import.meta.main) build()
