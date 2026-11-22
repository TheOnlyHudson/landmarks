/**
 * Holy Trinity Greek Orthodox Cathedral (1923-25, Pope & Burton with N. A.
 * Dokas), 279 South 300 West, Salt Lake City: procedural, CC0-1.0.
 * bun generators/slc-holy-trinity-cathedral.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, bearing 0. The church faces west
 * onto 300 West. Origin: the middle of OSM way/224554405 (-111.899087,
 * 40.763129). y = 0 is the ground (the site is flat; the portico stands on a
 * raised stone landing reached by steps).
 *
 * Form: a Byzantine-revival church of orange-tan brick with cream stone
 * trim, on a cross plan: a nave (x -11..-0.9), transepts (x -0.9..9.1) with
 * gabled ends each holding a great round-arched window, a lower sanctuary
 * and a small apse to the east. Red-brown tile roofs. Over the crossing a
 * wide twelve-sided drum ringed with round-arched windows under a shallow
 * lead-grey dome. On the west front two square brick towers, each topped by
 * an octagonal arcaded belfry and a grey ribbed dome with a cross, and
 * between them a recessed portico of six stone columns carrying brick
 * arches under a stone pediment, the nave's gable rising behind it.
 *
 * Sources
 * - OSM (ODbL): way/224554405 (outline, Holy Trinity Cathedral, Q4499832,
 *   NRHP 75001816).
 * - USGS NAIP (public domain): roof plan, the crossing dome's place and size
 *   (about 9.5 m across), the tile roofs' colour.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   Tricia Simpson, "Holy Trinity Cathedral, Salt Lake City.jpg", CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Holy_Trinity_Cathedral,_Salt_Lake_City.jpg
 *     (from the south-west: towers, belfries, domes, south side, transept window);
 *   Tamanoeconomico, "Holy Trinity Greek Orthodox Church (1).jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Holy_Trinity_Greek_Orthodox_Church_(1).jpg
 *     (from the south-west, wider: relative heights of the domes and roofs);
 *   Chris Light, "Holy Trinity 4963.jpg", CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Holy_Trinity_4963.jpg
 *     (the portico close up: six columns, five arches, the pediment, doors).
 * Estimated from the photos, scaled to OSM's 17 m front: towers 4.4 m square,
 *   shafts to 14.8 m, belfries to 19.3, domes to 22.2, crosses 23.6; nave
 *   eaves 10, ridge 12.2; drum to 14.0, crossing dome to 16.25, cross 17.6;
 *   portico pediment apex 10.6; window sizes.
 * Left out: the side stairs and railings, lamp posts, the fence, the
 *   inscribed stone, the dome ribs (too fine), the corbel tables.
 * Doubts: the north and east sides are in no photo used; drawn as mirrors of
 *   the south and as a plain sanctuary with two windows and an apse.
 * Night: windows `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Face, prism, rect, arc, flatShape, extrudeShape, archShape, archBand, lathe, capRing, finishGlb, writeModel } from './sea-tacoma-union-station'

const EV = 10, RID = 12.2

/** A gabled roof over a rectangle, ridge along x or y, with gable-end walls. */
function gable(roof: Part, wall: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number, alongX: boolean, over = 0.4) {
  if (alongX) {
    const ym = (y0 + y1) / 2
    for (const [ya, yb] of [[y0 - over, ym], [y1 + over, ym]]) {
      const za = ze - over * (zr - ze) / ((y1 - y0) / 2)
      const q: V3[] = [[x0 - over, ya, za], [x1 + over, ya, za], [x1 + over, yb, zr], [x0 - over, yb, zr]]
      roof.quad(...((ya < ym ? q : [q[1], q[0], q[3], q[2]]) as [V3, V3, V3, V3]))
    }
    for (const x of [x0, x1]) {
      const t: V3[] = [[x, y0, ze], [x, y1, ze], [x, ym, zr]]
      if (x === x1) wall.tri(t[0], t[1], t[2]); else wall.tri(t[1], t[0], t[2])
    }
  } else {
    const xm = (x0 + x1) / 2
    for (const [xa, xb] of [[x0 - over, xm], [x1 + over, xm]]) {
      const za = ze - over * (zr - ze) / ((x1 - x0) / 2)
      const q: V3[] = [[xa, y0 - over, za], [xa, y1 + over, za], [xb, y1 + over, zr], [xb, y0 - over, zr]]
      roof.quad(...((xa > xm ? q : [q[1], q[0], q[3], q[2]]) as [V3, V3, V3, V3]))
    }
    for (const y of [y0, y1]) {
      const t: V3[] = [[x0, y, ze], [x1, y, ze], [xm, y, zr]]
      if (y === y0) wall.tri(t[0], t[1], t[2]); else wall.tri(t[1], t[0], t[2])
    }
  }
}

function build() {
  const brick = new Part(), stone = new Part(), tile = new Part(), win = new Part(), lead = new Part()

  /** A round-arched window with a stone sill. */
  const W = (f: Face, s: number, w: number, z0: number, z1: number, bars = 0) => {
    extrudeShape(stone, f, rect(s - w / 2 - 0.2, z0 - 0.25, s + w / 2 + 0.2, z0), 0, 0.12)
    flatShape(brick, f, archShape(s, w + 0.5, z0, z1 - w / 2, 10), 0.03) // the brick arch ring
    flatShape(win, f, archShape(s, w, z0, z1 - w / 2, 10), 0.06)
    for (let k = 1; k <= bars; k++) {
      const b = s - w / 2 + (w * k) / (bars + 1)
      flatShape(stone, f, rect(b - 0.08, z0, b + 0.08, z1 - w / 2), 0.09)
    }
  }

  // ------------------------------------------------------------ nave, transepts, sanctuary, apse
  prism(brick, null, rect(-11.05, -7.7, -0.85, 7.7), 0, EV)
  gable(tile, brick, -11.05, -7.7, -0.85, 7.7, EV, RID, true)
  prism(brick, null, rect(-0.85, -9.4, 9.05, 9.4), 0, EV)
  gable(tile, brick, -0.85, -9.4, 9.05, 9.4, EV, RID, false)
  prism(brick, null, rect(9.05, -7.6, 15.0, 7.6), 0, 8.8)
  gable(tile, brick, 9.05, -7.6, 15.0, 7.6, 8.8, 11.0, true)
  {
    const apse: XY[] = [[15.0, -4.8], [15.9, -3.6], [16.5, -1.3], [16.5, 1.3], [15.9, 3.6], [15.0, 4.8]]
    prism(brick, null, apse, 0, 7.0)
    capRing(tile, apse, 7.0)
  }
  // stone string course and eaves cornices
  for (const r of [rect(-11.15, -7.8, -0.85, 7.8), rect(-0.95, -9.5, 9.15, 9.5), rect(9.05, -7.7, 15.1, 7.7)]) prism(stone, null, r, 2.6, 2.9)
  // side windows of the nave (four a side) and the sanctuary (two a side)
  for (const e of [-1, 1]) {
    const f: Face = { o: [0, e * 7.7, 0], n: [0, e] }
    for (const x of [-9.2, -6.7, -4.2, -1.9]) W(f, e < 0 ? x : -x, 1.3, 3.4, 8.6)
    const fs: Face = { o: [12, e * 7.6, 0], n: [0, e] }
    for (const x of [-1.6, 1.6]) W(fs, x, 1.2, 3.2, 7.4)
    // transept gable end: the great round-arched window with three lights and a small rondel
    const ft: Face = { o: [4.1, e * 9.4, 0], n: [0, e] }
    W(ft, 0, 3.8, 3.4, 10.4, 2)
    extrudeShape(stone, ft, rect(-5.0, EV - 0.3, 5.0, EV), 0, 0.15)
  }

  // ------------------------------------------------------------ the crossing: drum and dome
  {
    const cx = 4.1, R = 4.2, n = 12
    const ring: XY[] = arc(cx, 0, R, 0, 360, n).slice(0, -1)
    prism(brick, null, ring, 11.0, 14.0, 0)
    prism(stone, null, arc(cx, 0, R + 0.3, 0, 360, n).slice(0, -1), 13.8, 14.2, 0)
    for (let i = 0; i < n; i++) {
      const a = ring[i], b = ring[(i + 1) % n], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const l = Math.hypot(m[0] - cx, m[1])
      const f: Face = { o: [m[0], m[1], 0], n: [(m[0] - cx) / l, m[1] / l] }
      flatShape(win, f, archShape(0, 1.1, 12.2, 13.1, 6), 0.04)
    }
    lathe(lead, cx, 0, [[R + 0.25, 14.2], [4.1, 14.8], [3.5, 15.4], [2.5, 15.9], [1.2, 16.2], [0.01, 16.25]], 16)
    lathe(stone, cx, 0, [[0.35, 16.15], [0.3, 16.5], [0.01, 16.6]], 6)
    prism(stone, stone, rect(cx - 0.07, -0.07, cx + 0.07, 0.07), 16.5, 17.6)
    prism(stone, stone, rect(cx - 0.07, -0.4, cx + 0.07, 0.4), 17.1, 17.25)
  }

  // ------------------------------------------------------------ the west front
  const FX = -15.45 // tower faces
  for (const e of [-1, 1]) {
    const y0 = e < 0 ? -8.75 : 4.35, y1 = e < 0 ? -4.35 : 8.75
    const tw = rect(FX, y0, FX + 4.4, y1)
    prism(brick, null, tw, 0, 14.6)
    prism(stone, null, rect(FX - 0.1, y0 - 0.1, FX + 4.5, y1 + 0.1), 0, 1.2) // stone base
    prism(stone, stone, rect(FX - 0.25, y0 - 0.25, FX + 4.65, y1 + 0.25), 14.2, 14.8) // cornice
    const ym = (y0 + y1) / 2, xm = FX + 2.2
    // tall narrow round-arched windows in the shaft, west and outer faces
    const fw: Face = { o: [FX, ym, 0], n: [-1, 0] }
    W(fw, 0, 0.9, 6.0, 9.2)
    W(fw, 0, 0.9, 10.6, 13.4)
    const fo: Face = { o: [xm, e < 0 ? y0 : y1, 0], n: [0, e] }
    W(fo, 0, 0.9, 6.0, 9.2)
    W(fo, 0, 0.9, 10.6, 13.4)
    // the octagonal arcaded belfry
    const R = 1.95
    const oct: XY[] = arc(xm, ym, R, 22.5, 382.5, 8).slice(0, -1)
    prism(stone, null, oct, 14.8, 18.9, 0)
    for (let i = 0; i < 8; i++) {
      const a = oct[i], b = oct[(i + 1) % 8], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const l = Math.hypot(m[0] - xm, m[1] - ym)
      flatShape(lead, { o: [m[0], m[1], 0], n: [(m[0] - xm) / l, (m[1] - ym) / l] }, archShape(0, 0.95, 15.3, 17.9, 6), 0.04)
    }
    prism(stone, stone, arc(xm, ym, R + 0.3, 22.5, 382.5, 8).slice(0, -1), 18.9, 19.3, 0)
    lathe(lead, xm, ym, [[R + 0.05, 19.3], [2.0, 19.9], [1.8, 20.7], [1.3, 21.5], [0.6, 22.0], [0.01, 22.2]], 12)
    prism(stone, stone, rect(xm - 0.07, ym - 0.07, xm + 0.07, ym + 0.07), 22.1, 23.6)
    prism(stone, stone, rect(xm - 0.07, ym - 0.45, xm + 0.07, ym + 0.45), 22.95, 23.1)
  }
  // the recessed portico: landing, back wall with doors, six columns, five arches, pediment
  {
    const PX = -13.2 // the door wall
    prism(stone, stone, rect(-16.6, -4.35, PX, 4.35), 0, 1.2) // the raised landing
    const fd: Face = { o: [PX, 0, 0], n: [-1, 0] }
    for (const s of [-2.6, 0, 2.6]) flatShape(lead, fd, rect(s - 0.9, 1.2, s + 0.9, 4.4), 0.04) // dark wooden doors
    flatShape(win, fd, arc(0, 7.3, 0.9, 0, 360, 12).slice(0, -1), 0.04) // the round window over the doors
    // columns
    for (const y of [-4.0, -2.4, -0.8, 0.8, 2.4, 4.0]) {
      lathe(stone, -15.9, y, [[0.3, 1.2], [0.28, 5.6], [0.42, 5.7], [0.42, 6.1], [0.01, 6.12]], 8)
    }
    // arcade wall over the columns, with brick arches open below
    const fa: Face = { o: [-16.2, 0, 0], n: [-1, 0] }
    const wallTop = 8.6
    // build the face as a slab with arch-shaped openings: solid brick piers above each column + spandrels
    const arches = [-3.2, -1.6, 0, 1.6, 3.2]
    for (let i = 0; i <= arches.length; i++) {
      const a = i === 0 ? -4.35 : arches[i - 1] + 0.7, b = i === arches.length ? 4.35 : arches[i] - 0.7
      if (b > a) extrudeShape(brick, fa, rect(a, 6.1, b, wallTop), 0, 0.6)
    }
    for (const c of arches) {
      extrudeShape(brick, fa, [[c - 0.7, 6.8], [c - 0.7, wallTop], [c + 0.7, wallTop], [c + 0.7, 6.8], ...arc(c, 6.8, 0.7, 0, 180, 6).slice(1, -1)].reverse() as XY[], 0, 0.6)
      flatShape(brick, fa, archBand(c, 6.8, 0.7, 0.8, 6.8, 8), 0.64) // the brick voussoirs
      flatShape(lead, { o: [PX, 0, 0], n: [-1, 0] }, archShape(c, 1.4, 6.1, 6.8, 8), 0.03) // the shadowed arch opening
    }
    // the stone entablature and pediment
    prism(stone, stone, rect(-16.6, -4.35, PX, 4.35), wallTop, wallTop + 0.5)
    gable(tile, stone, -16.6, -4.35, PX + 1.0, 4.35, wallTop + 0.5, 10.6, true, 0.3)
    // the door wall at the back of the portico, up to the nave's eaves
    prism(brick, null, rect(PX, -4.35, -11.0, 4.35), 0, EV)
  }

  return finishGlb('Holy Trinity Cathedral', [
    { part: brick, material: finish('slc-htc-brick', 0xc98e68) },
    { part: stone, material: finish('slc-htc-stone', 0xece3d2) },
    { part: tile, material: finish('slc-htc-tile', 0xb0705a) },
    { part: win, material: PALETTE.window },
    { part: lead, material: finish('slc-htc-lead', 0x6e7479) },
  ], { bearing: 0, height: 23.6, replaces: ['way/224554405'] }, 5000)
}

if (import.meta.main) await writeModel('slc-holy-trinity-cathedral', build())
