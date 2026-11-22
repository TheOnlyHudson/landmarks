/**
 * Tredegar Iron Works (the Pattern Building, "Historic Tredegar"),
 * Richmond — procedural, CC0-1.0, no textures.
 * bun generators/ric-tredegar-iron-works.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the centre of the
 * OSM outline way/266751753 (lng -77.4458134, lat 37.5353721), a 16 x 34 m
 * rectangle whose long walls run at 174°. The model is placed at bearing
 * 174, so model +y (north) is the south gable over the museum plaza, the
 * one painted "HISTORIC ★ TREDEGAR".
 *
 * What it is: the brick Pattern Building of the Tredegar Iron Works (1850s
 * to 1860s, beside the Haxall Canal's millrace): a plain three-storey gabled
 * block of red brick, sooty dark low down, with tall round-headed windows
 * in segmental brick arches on every floor, a low-pitched grey slate roof,
 * and on the south gable a broad black painted band with the lettering.
 *
 * Covers and replaces: way/266751753.
 *
 * Evidence
 * - OSM (measured): the outline, x -8..8, y -17..17. OSM's height 12.2 is
 *   measured from the uphill north end (see below); the lidar replaces it.
 * - USGS 3DEP lidar USGS_LPC_VA_Sandy_2014_LAS_2015 (flown 2014), 1 m grid,
 *   read every 2 m in this frame (measured): the plaza at the south gable
 *   3.0; the ground at the north end 8.5 (the building is set into the
 *   slope up from the river); the millrace beside it 0.1; eaves 18.2, ridge
 *   21.8. Model z = lidar - 3.0 (y = 0 is the plaza the doors open on): eaves
 *   15.2, ridge 18.8. The north end's lowest 5.5 m sinks into the hill.
 * - Photos (Wikimedia Commons, EVIDENCE; each at
 *   https://commons.wikimedia.org/wiki/File:<name with underscores>):
 *   "Tredegar Iron Works in Richmond Virginia.jpg" (Dmbebber, CC BY-SA
 *   4.0), the south gable: three bays of round-headed openings, arched
 *   doors below, the black band between the second and third floors, the
 *   east side's windows; "American Civil War Museum at Tredegar
 *   Ironworks.jpg" (American Civil War Museum, CC BY-SA 4.0), a drone view
 *   from the south: the proportions, the grey slate roof, eleven bays along
 *   the side, the gable windows; "The ruins of Tredegar Iron Works -
 *   panoramio.jpg" (olekinderhook, CC BY 3.0), the side over the race.
 *   HABS photos (public domain) of the gable end confirm the window rhythm.
 * - Colours from the photos: red-orange brick (pulled to the palette's
 *   lightness), the black band (drawn charcoal), grey slate roof.
 * - Estimated: window sizes (1.5 m wide, scaled to the 16 m gable);
 *   storey heights (about 5 m, from the eaves); the ground floor's
 *   openings on the long sides drawn only on the southern half, where the
 *   ground is low.
 * - Simplified: no lettering on the band (a painted sign, not a famous
 *   one); no glass stair tower (a separate modern addition); no sooty
 *   shading on the lower brick.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, panel, rect, gable, arc, block, type Side } from './dc-white-house'
import { saveModel } from './dc-nga-west'

const brick = new Part(), roof = new Part(), win = new Part(), band = new Part()

const X = 8, Y = 17, EAVE = 15.2, RIDGE = 18.8

/** A round-headed opening: jambs and a semicircular head, flat on a wall. */
function archPanel(p: Part, side: Side, at: number, c: number, w: number, z0: number, zs: number, d = 0.05) {
  panel(p, side, at, c - w / 2, c + w / 2, z0, zs, d)
  const pts = arc(0, 0, w / 2, 0, 180, 8)
  const sgn = side === 's' || side === 'w' ? -1 : 1
  const n: V3 = side === 's' ? [0, -1, 0] : side === 'n' ? [0, 1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const P = (q: [number, number]): V3 => (side === 's' || side === 'n' ? [c + q[0], at + sgn * d, zs + q[1]] : [at + sgn * d, c + q[0], zs + q[1]])
  for (let k = 0; k < pts.length - 1; k++) {
    const t: V3[] = [P([0, 0]), P(pts[k]), P(pts[k + 1])]
    const f = [t[1][0] - t[0][0], t[1][1] - t[0][1], t[1][2] - t[0][2]], g = [t[2][0] - t[0][0], t[2][1] - t[0][1], t[2][2] - t[0][2]]
    const cr = [f[1] * g[2] - f[2] * g[1], f[2] * g[0] - f[0] * g[2], f[0] * g[1] - f[1] * g[0]]
    if (cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] >= 0) p.tri(t[0], t[1], t[2])
    else p.tri(t[0], t[2], t[1])
  }
}

// ---- walls, a brick eaves course, the slate roof
cbox(brick, rect(-X, X, -Y, Y), 0, EAVE, { top: false })
cbox(brick, grow(rect(-X, X, -Y, Y), 0.2), EAVE - 0.5, EAVE, { bottom: true, top: false })
// the gable ends at the wall plane, the slate overhanging them a little
gable(roof, brick, rect(-X, X, -Y, Y), EAVE, RIDGE - 0.05, true)
gable(roof, brick, grow(rect(-X, X, -Y, Y), 0.35, 0.35), EAVE, RIDGE + 0.12, true, [false, false])

// ---- the long sides: eleven bays, three floors of round-headed windows
const W = 1.5
const floors: [number, number][] = [[1.4, 3.6], [6.0, 8.6], [11.0, 13.2]]
for (const [side, at] of [['e', X], ['w', -X]] as [Side, number][]) {
  for (let k = 0; k < 11; k++) {
    const c = -Y + 1.6 + (k + 0.5) * ((2 * Y - 3.2) / 11)
    floors.forEach(([z0, zs], f) => {
      if (f === 0 && c < 0) return // below the hill on the north half
      archPanel(win, side, at, c, W, z0, zs)
    })
  }
}

// ---- the south gable (model north): three bays; arched doors below, the
// black band between the second and third floors, a window in the gable
for (const c of [-4.7, 0, 4.7]) {
  archPanel(win, 'n', Y, c, 2.0, 0, 2.6)
  archPanel(win, 'n', Y, c, W + 0.2, 4.6, 8.0)
  archPanel(win, 'n', Y, c, W + 0.2, 11.2, 13.5)
}
block(band, 'n', Y, -X, X, 9.3, 11.0, 0.04, true, true)
archPanel(win, 'n', Y, 0, 1.2, 15.4, 16.4)
// north gable: the upper floors and the gable window only (uphill end)
for (const c of [-4.7, 0, 4.7]) {
  archPanel(win, 's', -Y, c, W, 6.6, 8.6)
  archPanel(win, 's', -Y, c, W, 11.0, 13.2)
}
archPanel(win, 's', -Y, 0, 1.2, 15.4, 16.4)

if (import.meta.main) {
  await saveModel('ric-tredegar-iron-works', 'Tredegar Iron Works', [
    { part: brick, material: finish('tredegar-brick', 0xbd7c62) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: band, material: finish('tredegar-sign-band', 0x4a4f57) },
  ], { source: 'generators/ric-tredegar-iron-works.ts', bearing: 174, osm: 'way/266751753', height: RIDGE }, 5000)
}
