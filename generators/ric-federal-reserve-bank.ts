/**
 * Federal Reserve Bank of Richmond (701 East Byrd Street, 1978, Minoru
 * Yamasaki), Richmond, Virginia — original procedural geometry, CC0-1.0.
 * bun generators/ric-federal-reserve-bank.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/113029210,
 * 37.535676,-77.440595. Its faces run at 37.6° / 127.6°, so the catalog
 * bearing is 37.6 and the tower is square to this frame.
 *
 * Identity, in order: the plain white aluminium box, nothing but height; the
 * close-set narrow vertical window slots, Yamasaki's signature, running from
 * a thin base band to a solid white top band; the dark glazed corner faces,
 * which read as a full-height dark notch at every corner; the shaft standing
 * on a recessed, glazed lobby storey.
 *
 * Evidence:
 *  - plan: OSM outline way/113029210, a 45.6 m square whose four corners are
 *    cut by a 45° corner face ~5.3 m wide, standing ~1.7 m proud of the face
 *    planes. Turned into this frame; the corners made identical, as built.
 *  - height: 119.8 m to the roof, published (393 ft, 26 floors; Wikipedia,
 *    List of tallest buildings in Richmond; OSM height 119.786). Lidar
 *    USGS_LPC_VA_Sandy_2014_LAS_2015 (flown about 2014) reads the flat roof
 *    at 119.0–119.5 m over the raised plaza the tower stands on; y = 0 is
 *    that plaza.
 *  - bands and lobby, estimated from Ben Schumin's photo of the south-west
 *    and south-east faces against the published height: lobby storey ~8.5 m,
 *    bottom band ~2.5 m, top band ~6.8 m.
 *  - slots: the real faces carry about forty slots each; drawn at about half
 *    that density (24 per face, 0.95 m slot on a 1.6 m pitch, so the face keeps its real half-dark tone) so they read on
 *    a phone without shimmering. Not split into floor groups: the real slots
 *    run unbroken, and that is the look.
 *  - colours: a cool white aluminium finish; slots and corner glass the
 *    palette window.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  - Federal_Reserve_Bank,_Richmond,_Virginia.jpg, Ben Schumin, CC BY-SA 3.0
 *    (from the south, Canal Walk). https://commons.wikimedia.org/wiki/File:Federal_Reserve_Bank,_Richmond,_Virginia.jpg
 *  - Federal_Reserve_Bank_building_-01-_(9741337905).jpg, Ben Schumin,
 *    CC BY-SA 2.0 (from the south-east). https://commons.wikimedia.org/wiki/File:Federal_Reserve_Bank_building_-01-_(9741337905).jpg
 *  - Federal_Reserve_and_Riverfront_Plaza_(9743453366).jpg, Ben Schumin,
 *    CC BY-SA 2.0. https://commons.wikimedia.org/wiki/File:Federal_Reserve_and_Riverfront_Plaza_(9743453366).jpg
 * No look-only sources. No commercial imagery.
 *
 * Left out: the brick terraces and garden walls round the plaza (landscape,
 * not in the outline), rooftop gear, the window-washing rig.
 * Doubts: the north faces are not photographed; drawn as the others (the
 * tower is symmetric). The lobby's depth is estimated.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, walls, cap, parapetRoof, panel, inset, save, turn } from './chi-aon-center'

// One corner of the OSM outline (south-east, in this frame), regularised:
// face plane at 22.8 m, the 45° corner face from (22.8+1.7) out.
const F = 22.8, P = 1.7, C = 19.4 // face half-width, corner projection, where the corner face starts
const corner: XY[] = [[C, -F], [C + 1.6, -F - P + 0.1], [F + P + 0.1, -C - 1.6], [F, -C]]
const RING: XY[] = [0, 90, 180, 270].flatMap(a => turn(corner, a))

function build() {
  const alu = new Part(), win = new Part(), roof = new Part()
  const TOP = 119.8, LOBBY = 8.5, B0 = 11.0, B1 = 113.0

  // Lobby: glazed storey set back 2.5 m under the shaft.
  const lob: XY[] = [[-F + 2.5, -F + 2.5], [F - 2.5, -F + 2.5], [F - 2.5, F - 2.5], [-F + 2.5, F - 2.5]]
  walls(alu, lob, 0, LOBBY)
  for (let i = 0; i < lob.length; i++) {
    const a = lob[i], b = lob[(i + 1) % lob.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 10) {
      const n = 6, w = (L - 2) / n
      for (let k = 0; k < n; k++) panel(win, a, b, 1 + k * w + 0.35, 1 + (k + 1) * w - 0.35, 0.3, LOBBY - 1.2, 0.05)
    }
  }
  // Soffit under the shaft.
  cap(alu, RING, LOBBY, false)
  // Corner piers carry the shaft down to the plaza at each corner.
  for (const a of [0, 90, 180, 270]) {
    const pier = turn([[C - 0.4, -F + 0.2], [C + 1.6, -F - P + 0.1], [F + P + 0.1, -C - 1.6], [F - 0.2, -C + 0.4], [F - 2.0, -F + 2.0]] as XY[], a)
    walls(alu, pier, 0, LOBBY)
  }

  // Shaft, with a bevelled roof edge and a shallow parapet.
  walls(alu, RING, LOBBY, TOP - 0.4)
  const top = inset(RING, 0.4)
  walls(alu, RING, TOP - 0.4, TOP, top)
  parapetRoof(alu, roof, top, TOP, 0.6, 0.9)
  cap(roof, inset(RING, 1.0), TOP - 0.9)

  // Slots on the four main faces; dark glass on the corner faces.
  const N = 24, PITCH = 1.6, SLOT = 0.95
  for (let i = 0; i < RING.length; i++) {
    const a = RING[i], b = RING[(i + 1) % RING.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 30) {
      const s0 = (L - (N - 1) * PITCH - SLOT) / 2
      for (let k = 0; k < N; k++) panel(win, a, b, s0 + k * PITCH, s0 + k * PITCH + SLOT, B0, B1, 0.05)
    } else if (L > 4) {
      panel(win, a, b, 0.5, L - 0.5, LOBBY + 0.6, TOP - 2.2, 0.05)
    }
  }

  return [
    { part: alu, material: finish('fed-aluminium', 0xeceeed) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('ric-federal-reserve-bank', 'Federal Reserve Bank of Richmond', [37.535676, -77.440595], 37.6, build())
