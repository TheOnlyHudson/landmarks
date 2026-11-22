/**
 * Toronto Power Generating Station (1906, E. J. Lennox; closed 1974),
 * Niagara Parkway, Niagara Falls, Ontario: procedural, CC0-1.0.
 * bun generators/niagara-toronto-power-station.ts
 *
 * Map frame: x east, y north, z up, metres, built turned to the building's
 * long axis: bearing 313.1 (the colonnade line in OSM). In this frame the
 * Niagara Parkway front with the colonnades faces -x (south-west) and the
 * river faces +x. Anchor = centroid of the OSM outline way/60783696,
 * 43.072038, -79.073727. y = 0 is the lowest ground under the footprint.
 *
 * Identity: a long, low Beaux-Arts hall of pale grey-buff Indiana-type
 * limestone: two long Ionic colonnades along the Parkway front, a tall
 * plain attic block at the centre with a pedimented portico in front of
 * it, end pavilions, a round colonnaded bay at the north end, and a low
 * hipped grey roof hidden behind the attic.
 *
 * Evidence:
 * - plan and heights: OSM, mapped in detail (building:part ways
 *   1524784210-1524785544): base 0-10 m; the wings and end pavilions
 *   10-20 m with a 4 m hipped roof (roof:colour #696969); the colonnade
 *   entablatures 10-12 m; the central block 26 m; the portico 10-11.5 m
 *   with a gabled pediment to 16 m, ridge across; the north round bay
 *   10-12 m; columns 0.5-10 m on 0.5 m porch floors; the column
 *   positions (3.9 m apart) from the column parts.
 * - the wall line of the wings above the colonnades: OSM part 10-20 m
 *   (x = -13.5); walls drawn to 16 m, the hipped roof 16-20 m.
 * - colour: building:colour #EEDFCC in OSM; the photos read a cooler
 *   grey-buff, used here (#dcd2bf).
 * - window rhythm (tall windows behind the colonnades, arched windows on
 *   the river side, small attic windows; the centre block and the end
 *   pavilions' lower walls blank, with the centre block's heavy cornice
 *   at about 20.5 m) from the photos; the hipped roof drawn lower (2.4 m
 *   rise, not OSM's 4 m) since the street photos barely show it;
 *   the river side only from a distant view from the Skylon Tower.
 *
 * Photos (Wikimedia Commons), all EVIDENCE:
 * - "Toronto Power Generating Station (in 2019).jpg", Gotanero, CC BY-SA
 *   4.0 (the whole Parkway front, west)
 * - "Front of the Toronto Power Generating Station.jpg", Frank McPhee,
 *   CC BY-SA 4.0 (centre block and portico from the north-west)
 * - "Toronto Power Generating Station Niagara 2010.jpg", Mike Garrett,
 *   CC BY 2.0 (the north round bay and colonnade, from the north-west)
 * - "Horseshoe Falls from Skylon Tower (DSCF1755) (52784671536).jpg",
 *   PascalHD, CC BY 2.0 (the river side and roof, far off, from the north)
 * No lidar (Ontario). No commercial imagery.
 *
 * Estimated: column diameter (1.1 m), cornice and attic bands, window
 * sizes. Left out: urns, carving, the balustrades' balusters, railings,
 * the forebay works on the river side.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, circle, panel, save, walls, type XY } from './chi-aon-center'
import { archPanel, densify, gableRoof, hipRoof, rect } from './niagara-table-rock-centre'

/** A round column: shaft r from z0 to z1, a square plinth and capital. */
function column(p: Part, cap_: Part, x: number, y: number, r: number, z0: number, z1: number) {
  block(cap_, null, rect(x - r - 0.15, y - r - 0.15, x + r + 0.15, y + r + 0.15), z0, z0 + 0.4, 0)
  walls(p, circle(x, y, r, 8, Math.PI / 8), z0 + 0.4, z1 - 0.5)
  block(cap_, null, rect(x - r - 0.25, y - r - 0.25, x + r + 0.25, y + r + 0.25), z1 - 0.5, z1, 0)
}

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part()
  const W = -13.5, E = 17.3 // the wings' Parkway wall and the river wall
  const NS = 53.1, NN = 68.6, SS = -64.9, SN = -49.75 // end pavilions
  const CS = -12.3, CN = 15.4 // the centre block

  // --- the body: end pavilions and wings to the attic cornice at 16 m
  const bodyRing: XY[] = [[-17, SS], [E, SS], [E, NN], [-18, NN], [-18, NS], [W, NS], [W, CN], [-19.4, CN], [-19.4, CS], [W, CS], [W, SN], [-17, SN]]
  walls(stone, densify(bodyRing, 6), 0, 16)
  // the cornice: a pale band at 15.2-16 standing out a little all round
  walls(trim, densify(bodyRing, 12).map(([x, y]) => [x, y] as XY), 15.2, 16)
  hipRoof(roof, W, SS, E, NN, 16, 2.4, 0.3, 0.3, trim) // low: barely seen over the attic in the street photos
  // the pavilions' strip west of the wings: flat, behind a parapet
  cap(roof, rect(-17, SS + 0.3, W, SN), 15.6)
  cap(roof, rect(-18, NS, W, NN - 0.3), 15.6)
  // a pale string course at 10-12 m round the base (the entablature line)
  for (const [a, b] of [[[E, SS], [E, NN]], [[-17, SS], [E, SS]], [[E, NN], [-18, NN]], [[-18, NN], [-18, NS]], [[-17, SN], [-17, SS]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(trim, a, b, 0, L, 10, 11.4, 0.08)
  }

  // --- the two colonnades on the Parkway front: porch floor, columns at
  // 3.9 m, the entablature 10-12 m on them
  const CX = -14.85
  for (const [y0, y1] of [[SN, CS], [CN, NS]] as [number, number][]) {
    block(stone, stone, rect(-16.2, y0, W, y1), 0, 0.5, 0)
    const ent = rect(-16.25, y0, W, y1)
    block(trim, trim, ent, 10, 12, 0)
    cap(trim, ent, 10, false)
    const n = Math.round((y1 - y0 - 2) / 3.9)
    for (let k = 0; k <= n; k++) {
      const y = y0 + 1.2 + ((y1 - y0 - 2.4) * k) / n
      column(stone, trim, CX, y, 0.55, 0.5, 10)
      // the tall window in the recessed wall between this column and the next
      if (k < n) {
        const ym = y + (y1 - y0 - 2.4) / n / 2
        panel(win, [W, y1], [W, y0], y1 - ym - 0.9, y1 - ym + 0.9, 1.6, 8.6, 0.05)
      }
    }
    // a balustrade on the entablature, in front of the attic wall
    block(stone, trim, rect(-16.1, y0 + 0.2, -15.3, y1 - 0.2), 12, 13.2, 0.1)
  }

  // --- the centre block, 26 m, flat-topped behind its cornice
  const cb = rect(-19.4, CS, 5, CN)
  walls(stone, cb, 16, 25.2)
  walls(trim, cb, 25.2, 26)
  cap(roof, rect(-19.0, CS + 0.4, 4.6, CN - 0.4), 25.6)
  walls(trim, rect(-19.0, CS + 0.4, 4.6, CN - 0.4).reverse(), 25.6, 26)
  for (const [a, b] of [[[-19.4, CN], [-19.4, CS]], [[-19.4, CS], [5, CS]], [[5, CN], [-19.4, CN]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(trim, a, b, 0, L, 22.6, 23.2, 0.06)
  }
  // the centre block is blank stone (Frank McPhee's photo): a heavy cornice two thirds up, the attic above
  {
    const o = rect(-19.9, CS - 0.5, 5.5, CN + 0.5)
    walls(trim, o, 20.4, 21.4); walls(trim, o, 21.4, 21.4, rect(-19.4, CS, 5, CN)); walls(trim, rect(-19.4, CS, 5, CN), 20.4, 20.4, o)
  }
  walls(stone, [[-19.4, CS], [W, CS], [W, CN], [-19.4, CN]].reverse() as XY[], 0, 0.01)

  // --- the portico: six columns, entablature, the pediment (ridge across)
  const PX0 = -23.9, PX1 = -19.4, PY0 = -7.8, PY1 = 10.9
  block(stone, stone, rect(PX0, PY0, PX1, PY1), 0, 0.5, 0)
  for (let k = 0; k < 6; k++) column(stone, trim, -23.0, PY0 + 0.9 + ((PY1 - PY0 - 1.8) * k) / 5, 0.55, 0.5, 10)
  for (const y of [PY0 + 0.9, PY1 - 0.9]) column(stone, trim, -20.4, y, 0.55, 0.5, 10)
  const pe = rect(PX0, PY0, PX1, PY1)
  block(trim, null, pe, 10, 11.5, 0)
  cap(trim, pe, 10, false)
  gableRoof(roof, trim, PX0, PY0, PX1, PY1, 11.5, 4.5, true, 0.35, 0.3)
  // the doorway behind the portico
  panel(win, [-19.4, CN], [-19.4, CS], 11.9, 15.9, 0.5, 7.0, 0.05)

  // --- the north round bay: a drum, six columns on a half circle, the entablature
  const RC: XY = [1.8, NN]
  const half = (r: number, n = 10): XY[] => Array.from({ length: n + 1 }, (_, i) => [RC[0] + r * Math.cos(Math.PI * (1 - i / n)), RC[1] + r * Math.sin(Math.PI * (1 - i / n))] as XY)
  const drum = half(4.3)
  walls(stone, drum.slice().reverse().map(([x, y]) => [x, y] as XY).reverse(), 0, 10)
  const rim = half(5.9)
  const ringTop = [...rim, ...half(4.0).reverse()]
  block(trim, trim, ringTop.length ? rim.concat([[RC[0] + 0, RC[1]]] as XY[]) : rim, 10, 12, 0)
  cap(trim, rim.concat([[RC[0], RC[1]]] as XY[]), 10, false)
  for (let k = 0; k <= 5; k++) {
    const t = Math.PI * (1 - k / 5)
    column(stone, trim, RC[0] + 5.2 * Math.cos(t), RC[1] + 5.2 * Math.sin(t), 0.5, 0, 10)
  }
  block(stone, trim, half(4.2).concat([[RC[0], RC[1]]] as XY[]), 12, 13.4, 0.2)

  // --- the river side: arched windows in the base, square ones in the attic
  for (const [y0, y1] of [[SS, NN]] as [number, number][]) {
    const n = Math.round((y1 - y0 - 6) / 6.6)
    for (let k = 0; k < n; k++) {
      const s = 3 + ((y1 - y0 - 6) * (k + 0.5)) / n
      archPanel(win, [E, y0], [E, y1], s - 1.3, s + 1.3, 1.6, 7.2, 0.05, 6)
      panel(win, [E, y0], [E, y1], s - 1.0, s + 1.0, 12.4, 14.4, 0.05)
    }
  }
  // the end pavilions' Parkway faces and ends: blank rusticated stone below, small attic windows
  for (const [a, b] of [[[-17, SN], [-17, SS]], [[-18, NN], [-18, NS]], [[-17, SS], [E, SS]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const s of [L / 2 - 5.2, L / 2 + 5.2]) if (s > 1.5 && s < L - 1.5) panel(win, a, b, s - 1, s + 1, 12.4, 14.4, 0.05)
  }

  return [
    { part: stone, material: finish('tpgs-limestone', 0xdcd2bf) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('niagara-toronto-power-station', 'Toronto Power Generating Station', [43.072038, -79.073727], 313.1, build())
