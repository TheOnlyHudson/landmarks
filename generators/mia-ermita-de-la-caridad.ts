/**
 * Ermita de la Caridad (National Shrine of Our Lady of Charity), Coconut
 * Grove, Miami (3609 South Miami Avenue; 1973, José Pérez-Benitoa) —
 * original procedural geometry, CC0-1.0.
 * bun generators/mia-ermita-de-la-caridad.ts
 *
 * Map frame: x east, y north (bearing 0), metres; origin at the anchor on
 * the ground. Anchor = centroid of the OSM outline way/453575835,
 * 25.7408749, -80.2113951. The entrance faces west (-x), toward the drive;
 * the round back faces the bay.
 *
 * Identity, in order: the tall concave cone of dark brown copper rising to
 * a gold cap, a slender finial with its ring and cross; the ring of white
 * sloping pylons and the band of glass (the clerestory with the mural)
 * under its eave; the low white battered base, round toward the bay, with
 * the two broad inscribed wing walls flanking the entrance porch.
 *
 * Night: the clerestory glows (`window`), the porch's doors glow; the
 * white walls and the cone are floodlit from below (`floodlight`).
 *
 * Evidence:
 *  - plan: OSM outline way/453575835 (building=church, height 29.5): the
 *    base's arc toward the bay fitted to its arc points (radius ~16.5
 *    round (3.8, -1.5)); the front wings and porch simplified from it and
 *    the photos, symmetric about the cone's axis (y = -1.5). USGS NAIP.
 *  - heights: lidar, NOAA Digital Coast EPT 10338 (2021 Florida coastal
 *    topobathy, public domain; no USGS 3DEP points here), 0.5 m grid, above
 *    the ground (2.0 m over the dataset's lowest return): base walls ~4.6,
 *    wing walls and porch ~6; the cone centred at (3.5, -2), ~9 m up at
 *    r = 7, ~12 at r = 4, ~18 at r = 2, tip return 26.5. OSM's 29.5
 *    includes the finial, which lidar barely sees; the cross's top (~30)
 *    is scaled from Pessar's photo.
 *  - the cone's profile (near-straight sides over a short flared eave), eave height (9.5), the pylons, the
 *    clerestory band: from the photos, scaled by the eave's diameter
 *    (~16.4 m).
 *  - colour: white base and pylons, dark brown copper cone (pulled light,
 *    kept dark because the dark cone is the landmark), gold cap.
 *
 * Photos:
 *  - flickr.com/photos/25955895@N03/9481503960 "Ermita De La Caridad"
 *    (Phillip Pessar, CC BY 2.0), the entrance front from the west
 *  - flickr.com/photos/28426323@N08/3664387272 "Ermita de la Caridad"
 *    (leoncillo sabino, CC BY 2.0), from above, north-west
 *  - flickr.com/photos/28426323@N08/7750929872 "Miami Ermita de la Caridad
 *    2012" (leoncillo sabino, CC BY 2.0), the side entrance
 *  - commons: ERMITA_DE_LA_CARIDAD_DEL_COBRE-MIAMI_-_panoramio.jpg (Ivan
 *    Curra, CC BY-SA 3.0), from the south-west
 * No look-only sources. No commercial imagery.
 *
 * Left out: the inscriptions, the seams on the copper, the mural (inside),
 * the side porch, the shrine's outbuildings and the bayfront walk.
 *
 * Doubts: the base's plan on the north-west, where OSM's outline has small
 * notches (side entrance, planters), is drawn as the symmetric twin of the
 * south-west; no licensed photo from the bay side.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, save, walls, type XY } from './chi-aon-center'
import { faces, solid } from './mia-vizcaya'
import { panel } from './chi-aon-center'

function build() {
  const white = new Part(), roof = new Part(), win = new Part(), copper = new Part(), gold = new Part()
  const CX = 3.5, CY = -1.5

  // --- Base: battered white walls round the bay side, a flat front.
  const R = 16.5, BX = 3.8
  const base: XY[] = [[-12, -14.5]]
  for (let k = 0; k <= 22; k++) {
    const t = ((-110 + (220 * k) / 22) * Math.PI) / 180
    base.push([BX + R * Math.cos(t), CY + R * Math.sin(t)])
  }
  base.push([-12, 11.5])
  const top = inset(base, 1.1)
  // Split into a low skirt and the battered wall above it, so long faces follow the ground.
  walls(white, base, 0, 0.6)
  walls(white, base, 0.6, 4.6, top)
  cap(roof, top, 4.6)

  // --- The two inscribed wing walls flanking the porch: trapezoids, their
  // outer ends sloping to the ground.
  const wingWall = (y0: number, y1: number, outerAtY0: boolean) => {
    const x0 = -12.4, x1 = -9.0, h = 6.0, slope = 3.0
    const yt0 = outerAtY0 ? y0 + slope : y0, yt1 = outerAtY0 ? y1 : y1 - slope
    // front, back
    white.quad([x0, y1, 0], [x0, y0, 0], [x0, yt0, h], [x0, yt1, h])
    white.quad([x1, y0, 0], [x1, y1, 0], [x1, yt1, h], [x1, yt0, h])
    // top
    white.quad([x0, yt0, h], [x1, yt0, h], [x1, yt1, h], [x0, yt1, h])
    // ends
    white.quad([x0, y0, 0], [x1, y0, 0], [x1, yt0, h], [x0, yt0, h])
    white.quad([x1, y1, 0], [x0, y1, 0], [x0, yt1, h], [x1, yt1, h])
  }
  wingWall(CY - 13, CY - 3.2, true)
  wingWall(CY + 3.2, CY + 13, false)

  // --- The entrance porch on the axis, its doors and the canopy over them.
  solid(white, -14.2, CY - 3.2, -12.0, CY + 3.2, 0, 5.4, white)
  {
    const [, , , w] = faces(-14.2, CY - 3.2, -12.0, CY + 3.2)
    panel(win, w[0], w[1], 1.3, 5.1, 0.6, 3.6, 0.05)
  }

  // --- Drum: white below, the glass clerestory band, under the cone's eave.
  lathe(white, CX, CY, [[7.0, 4.6], [7.0, 7.3], [0, 7.3]], 24)
  lathe(win, CX, CY, [[6.85, 7.3], [6.85, 9.4]], 24)

  // Six white pylons round the drum, battered, running up under the eave.
  for (let k = 0; k < 6; k++) {
    const t = (k * Math.PI) / 3, c = Math.cos(t), s = Math.sin(t), u = [-s, c]
    const P = (r: number, w: number, z: number): V3 => [CX + c * r + u[0] * w, CY + s * r + u[1] * w, z]
    const hw = 0.7
    const r0 = 6.4, rb = 10.4, rt = 8.4, zb = 4.6, zt = 9.7
    // outer sloping face
    white.quad(P(rb, -hw, zb), P(rb, hw, zb), P(rt, hw, zt), P(rt, -hw, zt))
    // sides
    white.quad(P(r0, -hw, zb), P(rb, -hw, zb), P(rt, -hw, zt), P(r0, -hw, zt))
    white.quad(P(rb, hw, zb), P(r0, hw, zb), P(r0, hw, zt), P(rt, hw, zt))
    // top
    white.quad(P(r0, -hw, zt), P(rt, -hw, zt), P(rt, hw, zt), P(r0, hw, zt))
  }

  // --- The cone: concave, dark copper, with its eave's underside.
  lathe(copper, CX, CY, [[6.6, 9.4], [8.3, 9.4], [8.3, 9.7], [7.5, 10.6], [6.3, 12.6], [4.6, 15.6], [2.8, 18.9], [1.05, 23.4], [0, 23.4]], 24)
  // Gold cap and finial: cap, rod, the ring, the cross.
  lathe(gold, CX, CY, [[1.1, 23.4], [1.1, 23.7], [0.18, 26.4], [0.18, 30.6], [0, 30.6]], 12)
  const ringAt = (zc: number, r: number, w: number) => {
    // A flat ring in the x-z plane (facing ±y) and another in the y-z plane.
    for (const ax of [0, 1]) for (let i = 0; i < 16; i++) {
      const a0 = (i / 16) * 2 * Math.PI, a1 = ((i + 1) / 16) * 2 * Math.PI
      const p = (a: number, rr: number): V3 => ax === 0 ? [CX + rr * Math.cos(a), CY, zc + rr * Math.sin(a)] : [CX, CY + rr * Math.cos(a), zc + rr * Math.sin(a)]
      gold.quad(p(a0, r - w), p(a1, r - w), p(a1, r), p(a0, r))
      gold.quad(p(a1, r - w), p(a0, r - w), p(a0, r), p(a1, r))
    }
  }
  ringAt(28.4, 1.3, 0.22)
  solid(gold, CX - 1.4, CY - 0.1, CX + 1.4, CY + 0.1, 28.3, 28.5) // cross arm (x)
  solid(gold, CX - 0.1, CY - 1.4, CX + 0.1, CY + 1.4, 28.3, 28.5) // cross arm (y)

  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : p[2] < 10 ? 0.7 : 0.45)
  return [
    { part: white, material: { ...finish('er-white', 0xf2eee5), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: copper, material: { ...finish('er-copper', 0x7a5545), floodlight: (p: V3) => (p[2] < 16 ? 0.5 : 0.3) } },
    { part: gold, material: finish('er-gold', 0xd4b062) },
  ]
}

if (import.meta.main) await save('mia-ermita-de-la-caridad', 'Ermita de la Caridad', [25.7408749, -80.2113951], 0, build(), 5000)
