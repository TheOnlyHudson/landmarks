/**
 * Regional Enterprise Tower, the former Alcoa Building (1953, Harrison &
 * Abramovitz with Altenhof & Bown), 425 Sixth Avenue, Pittsburgh — original
 * procedural geometry, CC0-1.0.
 * bun generators/pit-regional-enterprise-tower.ts
 *
 * Map frame: x, y, z up, metres; origin at the anchor on the lowest ground
 * under the footprint. Anchor = area centroid of the OSM outline
 * way/289791891, -79.9967891 40.4415118. Its walls run at 29.5°, so the
 * catalog bearing is 29.5 and the plan is square to this frame.
 *
 * Identity, in order: a plain 30-storey prism of two offset slabs (a
 * stepped, notched plan), sheathed entirely in stamped silver aluminium
 * with small rounded windows, which from any distance reads as a quilted
 * grey-silver skin with a fine rhythm of window bays; the top two storeys
 * with large louvre openings, one per bay group, under a flat top; the
 * recessed glass lobby at the foot.
 *
 * The quilting is drawn as broad panel rhythm (the brief asks for that, not
 * a dot grid): each face is divided into bay groups of three window columns
 * by three storeys; each group has one window panel, 0.62 of its width and 0.4
 * of its height, in the light reflective glass colour (the windows read
 * pale in every daylight photo), so the aluminium shows round it as piers and spandrels in
 * the proportion the photos show (more metal than glass). Each group's
 * metal is also faceted into a shallow four-sided pyramid round its panel,
 * so the skin catches light the way the stamped panels do, at a scale that
 * reads on a map.
 *
 * Evidence:
 *  - plan: OSM outline way/289791891, made rectilinear in this frame: the
 *    east slab x -4.75..14.3, y -30.5..21.2, the west slab x -16.9..-4.75,
 *    y -6.6..28.5. The lidar footprint is the same shape about 2 m longer
 *    to the south-south-west; OSM is followed, as docs/evidence.md asks.
 *  - height: roof 125.5 above the lowest ground (lidar PA_WesternPA_2_2019,
 *    flight 2019: roof 128-130 m above the box's ground minimum, ground
 *    under the tower 3-7 m); published 125 m (410 ft), 30 storeys. OSM's
 *    `height=120` is low.
 *  - photos (Wikimedia Commons, EVIDENCE):
 *    "Alcoa Building, 2024-05-16.jpg"
 *      https://commons.wikimedia.org/wiki/File:Alcoa_Building,_2024-05-16.jpg
 *      Cbaile19, CC0 — from Mellon Square: plan steps, panel rhythm, the
 *      louvred top storeys, colour.
 *    "Alcoa Building, 2015-04-23.jpg"
 *      https://commons.wikimedia.org/wiki/File:Alcoa_Building,_2015-04-23.jpg
 *      Cbaile19, CC0 — full height from the street.
 *    "Regional Enterprise Tower and U.S. Steel Tower.jpg"
 *      https://commons.wikimedia.org/wiki/File:Regional_Enterprise_Tower_and_U.S._Steel_Tower.jpg
 *      Dllu, CC BY-SA 4.0 — the slabs from the other side.
 *    "Old ALCOA headquarters (20961064299).jpg"
 *      https://commons.wikimedia.org/wiki/File:Old_ALCOA_headquarters_(20961064299).jpg
 *      Roy Luck, CC BY 2.0 — the panels close up.
 *    "ALCOA Building Entrance (Pittsburgh).jpg"
 *      https://commons.wikimedia.org/wiki/File:ALCOA_Building_Entrance_(Pittsburgh).jpg
 *      Nicholas Traub (HABS), public domain — the glazed lobby and canopy.
 *    "Perspective view from southwest of the Alcoa Building" (HABS PA-...)
 *      https://commons.wikimedia.org/wiki/File:PERSPECTIVE_VIEW_FROM_SOUTHWEST_OF_THE_ALCOA_BUILDING,_A_WELL-KNOWN_PITTSBURGH_LANDMARK_LOCATED_ON_SIXTH_AVENUE_AND_WILLIAM_PENN_PLACE_(RIGHT)._-_ALCOA_Building,_425_Sixth_Avenue,_Pittsburgh,_Allegheny_County,_PA_HABS_PA-6658-3.tif
 *      Nicholas Traub (HABS), public domain — the whole tower.
 *  - colour: the aluminium is a mid silver-grey, pulled to the palette's
 *    lightness; windows a light
 *    window variant (#a9bfd1); the louvres darker grey in a metal frame,
 *    wide and low as the photos show them.
 * Estimated: storey height (125.5 m less the lobby and the louvred top,
 * over 28 storeys), the window bay width (1.83 m, six columns on the
 * 12.7 m end faces, counted on the 2024 photo), the lobby's height and
 * setback, the louvre size.
 *
 * Doubts: the plan step at x -4.75 differs by about a metre between the two
 * slabs in OSM and lidar; it is made one line. Night: the offices' windows
 * glow; the louvres stay dark; the lobby glass glows (`window-2`).
 *
 * Left out: the individual window frames and rounded corners, the entrance
 * canopy fins, rooftop plant.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { area, cap, onWall, save, walls, type XY } from './chi-aon-center'

function build() {
  const alu = new Part(), win = new Part(), lobby = new Part(), louvre = new Part(), roof = new Part()

  const XS = -4.75
  let plan: XY[] = [[XS, -30.5], [14.3, -30.5], [14.3, 21.2], [XS, 21.2], [XS, 28.5], [-16.9, 28.5], [-16.9, -6.6], [XS, -6.6]]
  if (area(plan) < 0) plan = plan.reverse()
  const TOP = 125.5, LOBBY = 7.8, CROWN = 118.2, SET = 1.2
  const STOREY = (CROWN - LOBBY) / 30 * 1.0 // 30 storeys of office between lobby and louvres
  const BAY = 1.83

  // recessed lobby glass, aluminium columns at the group lines
  const inner = plan.map((p, i) => {
    // inset each edge by SET (rectilinear ring: move each corner along both adjacent normals)
    const a = plan[(i - 1 + plan.length) % plan.length], b = plan[(i + 1) % plan.length]
    const n1 = onWall(a, p).n, n2 = onWall(p, b).n
    const cr = (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])
    const k = cr > 0 ? 1 : 1
    return [p[0] - (n1[0] + n2[0]) * SET * k, p[1] - (n1[1] + n2[1]) * SET * k] as XY
  })
  walls(lobby, inner, 0, LOBBY)
  // the soffit over the lobby
  for (let i = 0; i < plan.length; i++) {
    const j = (i + 1) % plan.length
    const A: V3 = [plan[i][0], plan[i][1], LOBBY], B: V3 = [plan[j][0], plan[j][1], LOBBY], C: V3 = [inner[j][0], inner[j][1], LOBBY], D: V3 = [inner[i][0], inner[i][1], LOBBY]
    alu.quad(A, D, C, B)
  }

  // the shaft: aluminium walls, faceted per bay group, with window panels
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length]
    const { L, P } = onWall(a, b)
    const cols = Math.max(1, Math.round(L / BAY))
    const groups = Math.max(1, Math.round(cols / 3)), gw = L / groups
    // lobby columns
    for (let g = 0; g <= groups; g++) {
      const s = Math.min(L - 0.35, Math.max(0.35, g * gw))
      const r: XY[] = [P(s - 0.35, 0, 0), P(s + 0.35, 0, 0), P(s + 0.35, 0, -SET), P(s - 0.35, 0, -SET)].map((v) => [v[0], v[1]] as XY)
      walls(alu, area(r) < 0 ? r.reverse() : r, 0, LOBBY)
    }
    const rowsN = 10, rh = (CROWN - LOBBY) / rowsN
    for (let g = 0; g < groups; g++) {
      const s0 = g * gw, s1 = s0 + gw, sc = (s0 + s1) / 2
      for (let r = 0; r < rowsN; r++) {
        const z0 = LOBBY + r * rh, z1 = z0 + rh, zc = (z0 + z1) / 2
        // a shallow pyramid: the group's metal rises 0.5 m to its centre panel
        const pw = gw * 0.62, ph = rh * 0.4, out = 0.5
        const o0: V3[] = [P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1)]
        const o1: V3[] = [P(sc - pw / 2, zc - ph / 2, out), P(sc + pw / 2, zc - ph / 2, out), P(sc + pw / 2, zc + ph / 2, out), P(sc - pw / 2, zc + ph / 2, out)]
        for (let k = 0; k < 4; k++) alu.quad(o0[k], o0[(k + 1) % 4], o1[(k + 1) % 4], o1[k])
        win.quad(...(o1.map((v): V3 => {
          const { n } = onWall(a, b)
          return [v[0] + n[0] * 0.03, v[1] + n[1] * 0.03, v[2]]
        }) as [V3, V3, V3, V3]))
        void STOREY
      }
      // the louvred top storeys: one big opening per group
      alu.quad(P(s0, CROWN), P(s1, CROWN), P(s1, TOP), P(s0, TOP))
      // (photos: wide, low openings with a metal storey above them)
      alu.quad(P(sc - gw * 0.42, CROWN + 1.9, 0.12), P(sc + gw * 0.42, CROWN + 1.9, 0.12), P(sc + gw * 0.42, TOP - 2.1, 0.12), P(sc - gw * 0.42, TOP - 2.1, 0.12))
      louvre.quad(P(sc - gw * 0.38, CROWN + 2.2, 0.16), P(sc + gw * 0.38, CROWN + 2.2, 0.16), P(sc + gw * 0.38, TOP - 2.4, 0.16), P(sc - gw * 0.38, TOP - 2.4, 0.16))
    }
  }
  // the flat top, a thin coping
  const cop = plan.map((p) => p)
  walls(alu, cop, TOP, TOP + 0.3)
  cap(roof, plan, TOP + 0.3)

  return [
    { part: alu, material: { ...finish('alcoa-aluminium', 0xa3a3a8), roughness: 0.55 } },
    { part: win, material: windowVariant(1, 0x7b8a97) },
    { part: lobby, material: windowVariant(2, 0x9fb3c0) },
    { part: louvre, material: finish('louvre', 0x6d737a) },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('pit-regional-enterprise-tower', 'Regional Enterprise Tower', [40.4415118, -79.9967891], 29.5, build() as any, 5000)
