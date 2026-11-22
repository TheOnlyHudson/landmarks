/**
 * Rainbow Bridge, Niagara Falls (1941; Richard (Su Min) Lee, Waddell &
 * Hardesty) — procedural, CC0-1.0, no textures.
 * bun generators/niagara-rainbow-bridge.ts
 *
 * The whole bridge inside its OSM outline as one placement: the hingeless
 * steel deck arch over the Niagara gorge, two parallel box ribs with lattice
 * bracing between them, the slender paired spandrel columns standing on the
 * ribs and, past the springings, on the gorge's slopes; the steel deck
 * girder; and the masonry abutments at each rim, each with two tall
 * round-headed arches in its side faces. The Rainbow Tower (carillon) at the
 * Canadian plaza is a separate model and is not drawn here.
 *
 * Also exports `deckArch`, the deck-arch kit the Lewiston–Queenston Bridge
 * (same design family, Hardesty & Hanover) is built with.
 *
 * Frame: x across (+x to the south-west, the upstream / falls side), y
 * along the bridge toward the United States (bearing 136°, the deck ways'
 * axis), z up, metres; origin at the outline's centroid (-79.067744,
 * 43.090276), on the river. The deck is centred 5.1 m to +x (`XC`): OSM's
 * outline edges lie at x = -5 and +15.2 along the straight run.
 *
 * Height. z = 0 is the river under the main span (100.36 m NAVD88, the
 * lidar's bare-earth reading over the water in bridge_ele.py; Mapterhorn's
 * 100.38). Ground under the skewbacks, columns and abutments is the map's
 * terrain above that (`GROUND`, 5 m table in this frame, bun
 * tools/terrain.ts height sampled by the builder's strip script). elevation 0.
 *
 * Roadway heights built to (tools/bridge_ele.py measure 162149070 --every
 * 40, USGS 3DEP NY_3County_2019, lidar lower quartile, spread 0.03-0.10 m;
 * NAVD88 = value + 100.36): 68.06 m at the Canadian end of the outline
 * (y = -217, node 1740821238, 0.14 m over the bare earth), 68.57 at
 * y = -185, 68.88 at y = -141, 69.14 at y = -101, 69.36 at y = -61, 69.56 at
 * the mid-span node 9156307927 (y = +11.8). The lidar returned no road
 * points over the US half (990979149, both NY_3County_2019 and the default
 * survey), so the profile is mirrored about mid-span: a crest parabola
 * 69.56 - 1.5 ((y - 11.6) / 228)^2, within 0.13 m of every reading. None of
 * the ways carries ele.
 *
 * Sources:
 * - OSM: outline relation/14629795 (man_made=bridge, bridge:structure=arch,
 *   wikidata Q717285), y = -217 to +240 with plaza lobes at both ends;
 *   carriageways 162149070 (x = +7) and 990979149 (x = -1), footway
 *   95261283 (x = +13).
 * - Lidar, USGS 3DEP NY_3County_2019 (2019): the roadway heights above.
 * - Map terrain (Mapterhorn): the river 100.38 m from y = -105 to +135, the
 *   gorge slopes, rims 64-68 m up at y = -195 and +200.
 * - Published (Wikipedia "Rainbow Bridge (Niagara Falls)"): 1940-41, 1,450
 *   ft (440 m) long, 960 ft (290 m) main span, 202 ft (62 m) high, four
 *   lanes and a sidewalk, steel arch.
 * - Photos (Wikimedia Commons):
 *   - "Rainbow Bridge (Niagara Falls).jpg" (APK, CC BY-SA 4.0): the
 *     downstream elevation from the river: rib depth, rise, column spacing,
 *     the abutments' two arches each, springings about 18-23 m over the
 *     water;
 *   - "Lewiston-Queenston Bridge from water.jpg" (evoflash on Flickr, CC BY
 *     2.0; in fact the Rainbow Bridge from the Maid of the Mist): the same
 *     elevation, used to scale the abutments (y = -192 to -146 and +162 to
 *     +199) and columns (about 12 m apart);
 *   - "Rainbow Bridge, Niagara Falls (460331) (9449311344).jpg" (Robert
 *     Linsdell, CC BY 2.0): three-quarter view from the Canadian bank: two
 *     box ribs, the lattice bracing between them, paired columns, the
 *     silver-grey paint, lamp posts along the deck;
 *   - "Rainbow Bridge Niagara Falls View from Niagara River Parkway"
 *     (EgorovaSvetlana, CC BY-SA 4.0): the bridge from upstream, far off.
 *
 * Estimated: the springing height (18 m, photos), rib depth (4.2 m) and
 * width (2.2 m), the rib planes (14 m apart), column size (1.1 x 0.9 m),
 * the deck girder's depth (2.2 m under the road), the abutments' arches
 * (10 m wide, crowns 8 m under the road), lamp spacing (30 m). Colours from
 * daylight photos: steel silver-grey (#b9c1c6), abutment stone and concrete
 * grey-beige (#d6cfc0), the arches' shade (#6f767a).
 *
 * Doubts: the US half's roadway (mirrored); the abutments' far faces and
 * plaza structures beyond the rims are not modelled; whether the ribs are
 * floodlit at night (no licensed night photo looked at): only the lamps
 * glow.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { band, bead, chamferedRect, face, footedLoft, groundAt, parabola, stations, strip, type GroundGrid } from './bridge-kit'
import { finish } from './palette'

// ---- The deck-arch kit (shared with niagara-lewiston-queenston-bridge) ---------------------------

export type DeckArchSpec = {
  road: (y: number) => number            // roadway height on the centre line
  gnd: (x: number, y: number) => number  // ground above the water, x from the deck's centre line
  ends: [number, number]                 // deck extent along y
  hw: number                             // deck half-width, to the fascia
  fd: number                             // deck girder depth under the road
  yc: number                             // arch centre
  half: number                           // half-span, springing to springing
  zs: number                             // rib centre-line height at the springings
  depth: number                          // rib depth
  rw: number                             // rib half-width
  ax: number                             // rib planes either side of the centre line
  colStep: number                        // column spacing, from the crown out
  noColumns?: (y: number) => boolean     // where an abutment stands instead
  struts?: number                        // a strut between a column pair every this many metres of height
}

const nrm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A one-sided band in the plane x = u (double-sided material) between two curves. */
export function wallBand(p: Part, u: number, ys: number[], top: (y: number) => number, bot: (y: number) => number) {
  const s = Math.sign(u) || 1
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    face(p, [u, a, bot(a)], [u, b, bot(b)], [u, b, top(b)], [u, a, top(a)], [s, 0, 0])
  }
}

/** A horizontal strip from x0 to x1 following z(y), facing up or down. */
export function flat(p: Part, x0: number, x1: number, ys: number[], z: (y: number) => number, up: boolean) {
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i], b = ys[i + 1]
    face(p, [x0, a, z(a)], [x1, a, z(a)], [x1, b, z(b)], [x0, b, z(b)], nrm([0, up ? -(z(b) - z(a)) : z(b) - z(a), up ? b - a : -(b - a)]))
  }
}

/** A flat round-headed opening in the plane x = u: jambs from zb to zh, then a semicircle of radius r. */
export function archOpening(p: Part, u: number, yc: number, r: number, zb: number, zh: number) {
  const n: V3 = [Math.sign(u) || 1, 0, 0]
  face(p, [u, yc - r, zb], [u, yc + r, zb], [u, yc + r, zh], [u, yc - r, zh], n)
  const seg = 8
  for (let j = 0; j < seg; j++) {
    const t0 = (Math.PI * j) / seg, t1 = (Math.PI * (j + 1)) / seg
    const a: V3 = [u, yc + r * Math.cos(t0), zh + r * Math.sin(t0)], b: V3 = [u, yc + r * Math.cos(t1), zh + r * Math.sin(t1)]
    const c: V3 = [u, yc, zh]
    // wind to face n
    if (n[0] > 0) p.tri(c, a, b); else p.tri(c, b, a)
  }
}

/** A vertical box column, open at its ends, centred at (x, y) from z0 to z1. */
export function column(p: Part, x: number, y: number, z0: number, z1: number, wx: number, wy: number) {
  band(p, x - wx / 2, x + wx / 2, [y - wy / 2, y + wy / 2], () => z1, () => z0, { out: true, in: true, ends: true })
}

/**
 * A deck arch: two box ribs on a parabola from springing to springing, the
 * lattice between them, paired columns from the ribs (and from the ground
 * past them) up to the deck girder, skewbacks under the springings, and the
 * deck's fascia girders and soffit. Nothing is drawn at road level.
 */
export function deckArch(s: DeckArchSpec, steel: Part, conc: Part) {
  const { road, gnd, hw, fd, yc, half, zs, depth, rw, ax } = s
  const ya = yc - half, yb = yc + half
  const soffit = (y: number) => road(y) - fd
  const centre = parabola([ya, zs], [yc, soffit(yc) - depth / 2 - 0.05], [yb, zs])
  const ext = (y: number) => Math.min(centre(y) + depth / 2, soffit(y) - 0.05)
  const intr = (y: number) => Math.min(centre(y) - depth / 2, ext(y) - 0.6)
  const ribYs = stations(ya, yb, 7.5)

  // Ribs.
  for (const sd of [-1, 1]) band(steel, sd * (ax - rw), sd * (ax + rw), ribYs, ext, intr)

  // Lattice between the ribs at their underside: a strut at every column station, an X in every panel.
  const panel = stations(ya, yb, s.colStep)
  panel.forEach((y, i) => {
    const z = intr(y) + 0.3
    const t = nrm([0, 1, (intr(y + 0.5) - intr(y - 0.5))])
    const n = nrm([0, -t[2], t[1]])
    if (i > 0 && i < panel.length - 1) strip(steel, [-ax, y, z], [ax, y, z], 0.7, n)
    if (i < panel.length - 1) {
      const y2 = panel[i + 1], z2 = intr(y2) + 0.3
      strip(steel, [-ax, y, z], [ax, y2, z2], 0.45, n)
      strip(steel, [ax, y, z], [-ax, y2, z2], 0.45, n)
    }
  })

  // Skewbacks: concrete blocks from the slope up past each springing.
  for (const [y0, sgn] of [[ya, -1], [yb, 1]] as [number, number][]) {
    const yIn = y0 - sgn * 3, yOut = y0 + sgn * 5, xo = ax + rw + 1.2
    const zTop = Math.max(zs + depth / 2 + 0.6, ...[-xo, 0, xo].flatMap((x) => [yIn, y0, yOut].map((y) => gnd(x, y) + 0.6)))
    footedLoft(conc, gnd, [
      { plan: chamferedRect(-ax - rw - 1.2, ax + rw + 1.2, Math.min(yIn, yOut), Math.max(yIn, yOut), 0.5), z: 'ground' },
      { plan: chamferedRect(-ax - rw - 1.2, ax + rw + 1.2, Math.min(yIn, yOut), Math.max(yIn, yOut), 0.5), z: zTop },
    ], 3)
  }

  // Columns, out from the crown both ways.
  const [e0, e1] = s.ends
  for (let k = -60; k <= 60; k++) {
    const y = yc + k * s.colStep
    if (y < e0 + 2 || y > e1 - 2 || s.noColumns?.(y)) continue
    const top = soffit(y)
    const onRib = y > ya + 1.5 && y < yb - 1.5
    for (const sd of [-1, 1]) {
      const x = sd * ax
      if (onRib) {
        const z0 = ext(y)
        if (top - z0 < 1.2) continue
        column(steel, x, y, z0, top, 0.9, 1.1)
      } else {
        const g = gnd(x, y)
        if (top - g < 1.0) continue
        footedLoft(steel, gnd, [
          { plan: chamferedRect(x - 0.45, x + 0.45, y - 0.55, y + 0.55, 0), z: 'ground' },
          { plan: chamferedRect(x - 0.45, x + 0.45, y - 0.55, y + 0.55, 0), z: top },
        ], 50, false)
      }
    }
    // Struts between the pair on tall columns.
    const base = onRib ? ext(y) : Math.max(gnd(-ax, y), gnd(ax, y))
    if (s.struts && top - base > s.struts) {
      const n = Math.floor((top - base) / s.struts)
      for (let j = 1; j <= n; j++) {
        const z = base + ((top - base) * j) / (n + 1)
        band(steel, -ax + 0.45, ax - 0.45, [y - 0.3, y + 0.3], () => z + 0.4, () => z - 0.4, { top: true, bottom: true, out: true, in: true, ends: true })
      }
    }
  }

  // Deck: fascia girders and parapets, coping, soffit, cap beams over the column pairs.
  const ys = stations(e0, e1, 10)
  for (const sd of [-1, 1]) {
    wallBand(steel, sd * hw, ys, (y) => road(y) + 1.1, soffit)
    flat(steel, sd * (hw - 0.4), sd * hw, ys, (y) => road(y) + 1.1, true)
  }
  flat(steel, -hw, hw, ys, soffit, false)
}

/**
 * Move parts built in the water frame across by \`xc\` and down so the lowest foot is at z = 0, as the
 * map stands a model on the lowest ground under it (its feet follow the terrain from there). Returns
 * how far down they moved: the river's height below the model's origin.
 */
export function settle(parts: Part[], xc: number): number {
  let lo = Infinity
  for (const p of parts) for (let i = 1; i < p.pos.length; i += 3) lo = Math.min(lo, p.pos[i])
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += xc; p.pos[i + 1] -= lo }
  return lo
}

// ---- The Rainbow Bridge ---------------------------------------------------------------------------

// Map terrain (Mapterhorn) minus the river's reading (100.38 m), 5 m apart in the anchor's frame
// (x across from -30 to +40, y along from -230 to +250).
const GROUND: GroundGrid = {"y0":-230,"x0":-30,"step":5,"z":[[67.7,67.7,67.8,67.8,67.8,67.8,68.4,68.4,68.5,68.4,67.8,68.2,68.1,67.7,67.6],[67.8,67.8,67.8,67.8,67.8,67.8,68.1,68.5,68.5,67.9,67.9,68.2,67.8,67.8,67.7],[67.8,67.8,67.8,67.8,67.9,68.0,68.0,68.0,68.0,68.0,68.0,67.9,67.8,67.8,67.9],[67.8,67.9,68.0,68.0,68.0,68.1,68.1,68.1,68.0,68.0,68.0,67.9,67.8,67.0,65.4],[66.8,67.5,68.0,68.1,68.1,68.1,67.7,67.1,66.8,66.3,66.0,64.8,62.4,60.1,60.0],[65.6,66.4,67.2,67.9,67.8,67.2,66.6,66.0,65.3,64.5,63.5,61.6,60.0,60.0,60.0],[64.5,65.3,65.9,63.9,64.7,65.7,65.4,64.8,64.2,63.3,61.7,60.1,59.9,59.9,60.0],[63.3,63.9,60.2,58.9,60.0,61.2,62.3,63.2,63.0,62.3,61.0,60.1,60.0,60.0,60.0],[62.0,57.6,54.0,54.1,55.2,56.4,57.6,58.8,59.9,60.8,60.3,60.2,60.2,60.2,59.9],[55.4,49.8,48.9,49.3,50.5,51.7,52.9,54.0,55.2,56.0,53.7,53.4,53.3,51.6,49.8],[46.6,44.4,44.0,44.6,45.8,47.0,48.2,49.6,49.1,45.8,43.2,42.7,42.5,42.7,42.9],[43.2,40.1,39.2,39.9,41.3,43.0,43.7,41.9,39.6,39.3,39.3,39.3,39.4,39.4,39.3],[40.1,37.8,36.8,36.5,37.4,37.3,36.0,35.7,35.5,35.6,35.5,35.8,36.7,36.4,35.4],[36.2,35.3,33.4,33.1,32.3,32.0,31.7,31.8,31.8,31.6,31.2,31.4,32.7,32.4,31.3],[32.3,31.6,30.3,29.5,28.8,28.0,28.2,28.1,28.0,27.8,27.5,27.3,28.2,28.1,27.5],[28.7,28.3,27.6,26.6,25.6,25.2,25.0,25.0,24.9,24.8,24.5,24.2,24.1,23.9,23.3],[26.0,25.7,25.2,24.6,23.9,23.4,22.9,22.4,22.1,21.6,21.2,20.9,20.5,20.1,19.7],[23.2,22.9,22.7,22.2,21.7,21.0,20.4,20.1,19.6,19.0,18.1,17.2,17.0,16.7,16.6],[20.0,19.7,19.1,18.8,18.5,18.3,18.1,17.8,17.2,16.2,15.2,14.2,13.8,14.0,14.4],[16.2,15.8,15.1,14.6,14.7,14.8,15.2,15.2,14.7,13.7,12.8,11.8,10.6,10.4,10.7],[12.0,11.8,11.2,11.3,11.5,12.2,12.8,12.9,12.6,11.7,10.7,9.7,8.8,8.1,8.0],[8.3,8.0,7.8,8.8,9.4,9.9,10.8,10.7,10.5,9.6,9.0,8.4,7.6,6.7,7.0],[6.1,5.6,5.6,6.4,7.7,8.1,8.0,8.2,7.9,7.2,6.5,5.8,4.6,4.0,4.4],[4.5,4.1,4.2,4.5,5.2,5.0,4.9,4.8,5.1,4.7,4.3,3.9,3.2,2.1,1.6],[3.1,2.7,2.8,3.1,3.0,2.8,2.3,1.7,1.7,1.8,1.4,1.5,1.9,1.4,0],[0.6,0.7,0.6,0.6,0.4,0.1,0.0,0,0,0,0,0,0.0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0.0,0.1,0.1,0.1,0.1,0.1,0.1,0],[1.6,1.7,1.7,1.7,1.7,2.1,2.8,2.8,3.3,4.0,3.9,3.8,3.5,3.0,1.9],[4.8,5.3,5.9,6.7,6.4,6.5,6.7,6.7,7.4,8.2,8.8,8.1,7.2,7.0,6.4],[7.6,8.9,9.6,10.6,10.4,10.1,10.2,10.4,11.3,12.2,12.9,11.8,11.2,12.3,12.0],[11.1,12.6,13.3,14.2,13.7,13.2,13.4,13.8,14.6,15.4,16.2,15.3,16.0,17.0,17.0],[14.5,15.3,16.3,16.9,16.6,16.3,17.1,17.5,18.2,18.8,19.5,18.8,20.1,20.8,20.7],[18.0,18.6,19.4,19.8,19.5,20.2,21.1,21.6,22.1,22.7,23.1,22.5,23.6,23.9,23.1],[21.5,22.1,22.8,23.1,22.7,23.4,24.0,24.6,25.4,26.0,26.9,26.6,27.5,27.3,26.0],[24.7,25.8,26.4,26.8,26.7,27.0,27.9,28.6,29.2,29.8,30.4,30.2,30.9,30.7,29.2],[28.3,29.5,30.0,30.4,30.5,31.2,31.9,32.3,32.8,33.2,33.7,33.6,34.7,34.0,33.0],[32.2,33.4,34.2,34.4,34.7,35.2,35.6,35.8,36.1,36.5,36.9,37.1,37.9,37.2,36.4],[35.9,37.4,38.4,38.7,39.1,40.7,42.9,44.2,44.6,44.9,45.2,45.2,46.0,46.2,47.5],[39.9,41.0,40.8,42.0,45.1,46.5,48.3,50.4,53.0,55.4,57.4,58.2,59.0,58.5,60.0],[44.8,48.8,51.8,54.1,55.7,56.8,57.6,58.7,59.5,60.5,61.1,61.9,62.6,62.6,62.9],[57.0,60.8,62.0,62.3,62.5,62.5,62.6,62.7,62.7,62.8,62.9,62.8,62.3,62.3,62.5],[62.5,62.4,62.5,63.1,63.4,63.5,63.5,63.6,63.6,63.8,63.7,63.5,62.7,62.2,62.3],[62.2,62.3,63.1,63.9,64.3,64.4,64.4,64.5,64.6,64.6,64.6,64.1,63.3,62.8,62.5],[62.5,63.2,64.1,64.7,65.2,65.3,65.4,65.4,65.5,65.5,65.3,64.8,64.3,63.6,62.9],[63.8,64.5,65.1,65.6,66.0,66.2,66.3,66.3,66.4,66.3,66.1,65.6,65.3,64.6,64.4],[65.5,66.0,66.3,66.7,67.0,67.1,67.2,67.3,67.2,67.2,66.9,66.7,66.3,66.0,66.0],[67.5,67.7,67.8,67.9,68.0,68.1,68.1,68.2,68.1,68.1,67.9,67.8,67.6,67.6,67.5],[68.2,68.3,68.2,68.3,68.4,68.4,68.5,68.5,68.5,68.4,68.4,68.4,68.3,68.2,68.2],[68.2,68.2,68.2,68.3,68.4,68.4,68.5,68.5,68.5,68.4,68.4,68.4,68.3,68.2,68.2],[68.2,68.1,68.2,68.2,68.3,68.4,68.4,68.5,68.5,68.4,68.4,68.4,68.3,68.3,68.2]]}
const XC = 5.1
const gnd = (u: number, y: number) => Math.max(0, groundAt(GROUND, u + XC, y))
const road = (y: number) => 69.56 - 1.5 * (Math.min(Math.abs(y - 11.6), 240) / 228) ** 2

const ENDS: [number, number] = [-217, 212]       // where the deck lands on the plazas
const ABUT: [number, number][] = [[-192, -146], [162, 199]]
const HW = 10.1

if (import.meta.main) {
  const steel = new Part(), stone = new Part(), shade = new Part(), lamps = new Part()
  deckArch({
    road, gnd, ends: ENDS, hw: HW, fd: 2.2, yc: 11.6, half: 145, zs: 18, depth: 4.2, rw: 1.1, ax: 7.0, colStep: 12.2,
    noColumns: (y) => ABUT.some(([a, b]) => y > a - 1 && y < b + 1), struts: 22,
  }, steel, stone)

  // Abutments: masonry blocks from the slope to just under the roadway, two round-headed arches in each side.
  for (const [a, b] of ABUT) {
    const w = HW + 0.3
    footedLoft(stone, gnd, [
      { plan: chamferedRect(-w, w, a, b, 0.4), z: 'ground' },
      { plan: chamferedRect(-w, w, a, b, 0.4), z: road((a + b) / 2) - 0.4 },
    ], 4)
    const L = b - a
    for (const t of [0.27, 0.73]) {
      const y = a + L * t, r = 5.0, zh = road(y) - 8 - r
      const zb = Math.max(gnd(-w, y), gnd(w, y)) + 0.5
      if (zh - zb > 2) for (const sd of [-1, 1]) archOpening(shade, sd * (w + 0.05), y, r, zb, zh)
    }
    // A string course at deck level.
    for (const sd of [-1, 1]) wallBand(stone, sd * (w + 0.35), [a, b], (y) => road(y) - 0.4, (y) => road(y) - 1.6)
  }

  // Lamp posts along both parapets.
  for (const y of stations(-180, 180, 30)) for (const sd of [-1, 1]) bead(lamps, [sd * (HW - 0.4), y, road(y) + 9], 0.6, true)

  const all = [steel, stone, shade, lamps]
  const DROP = settle(all, XC)
  const STEEL: MaterialSpec = { ...finish('arch-steel', 0xb9c1c6), doubleSided: true }
  const STONE: MaterialSpec = { ...finish('abutment-stone', 0xd6cfc0), doubleSided: true }
  const SHADE: MaterialSpec = { ...finish('arch-shade', 0x6f767a), doubleSided: true }
  const LAMP: MaterialSpec = { name: 'lamp', color: 0x9aa3a8 }
  const parts = [{ part: steel, material: STEEL }, { part: stone, material: STONE }, { part: shade, material: SHADE }, { part: lamps, material: LAMP }]
  console.log(parts.map((q) => `${q.material.name} ${q.part.triangles}`).join(', '))
  const tris = parts.reduce((n, { part }) => n + part.triangles, 0)
  const glb = writeGlb('Rainbow Bridge', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the river (100.36 m NAVD88)',
    bearing: 136, elevation: 0, deckCentre: XC, riverBelowOrigin: DROP, roadway: { canadianEnd: road(ENDS[0]), crown: road(11.6), usEnd: road(ENDS[1]) },
  })
  if (tris > 6500) throw new Error(`${tris} triangles, over 6500`)
  await Bun.write(new URL('../models/niagara-rainbow-bridge.glb', import.meta.url), glb)
  console.log(`niagara-rainbow-bridge.glb: ${tris} triangles, ${glb.length} bytes`)
}
