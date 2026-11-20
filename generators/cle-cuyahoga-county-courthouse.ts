/**
 * Cuyahoga County Courthouse (1 West Lakeside Avenue, 1912, Lehman &
 * Schmitt, Charles Morris as consultant), the Group Plan's twin of City Hall
 * on the lakefront bluff: procedural, CC0-1.0.
 * bun generators/cle-cuyahoga-county-courthouse.ts [out.glb]
 *
 * Built with `groupPlanHall` from cle-city-hall.ts (merge that first).
 *
 * Identity check: OSM names the outline way/207984519 "Cuyahoga County
 * Criminal Court", but that is the 1912 courthouse. Its outline is City
 * Hall's twin (117 x 61 m, the same pavilion and corner steps), it stands
 * on Lakeside Avenue west of Ontario Street opposite City Hall across the
 * Mall, and it carries a height (22.86 m) that fits the five-storey
 * courthouse, not the 26-storey Justice Center tower on Ontario and St.
 * Clair. The lidar roof (flat, a pedimented centre) and every photo below
 * agree. The name tag in OSM should be fixed; the model keeps the way.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 325.9 (the
 * long walls run 56.0° / 236.0°): the Lakeside front faces model south.
 * Origin at the outline's centroid (-81.697011, 41.503397). z = 0 is the
 * floor of the areaway round the building (lidar ground 2.3 m below the
 * sidewalks), the lowest ground the outline touches.
 *
 * Identity, in order: the long pale granite palazzo with a giant Ionic
 * order of engaged columns over an arcaded rusticated base on all four
 * sides and a balustrade; the centre pavilion with six columns in antis
 * before three tall round-arched windows, three arched bronze doors and
 * the steps on Lakeside; above it the attic with its six statues and a low
 * pediment with a copper roof running back from it.
 *
 * Evidence:
 *  - plan: OSM way/207984519 (no parts): 116.7 x 61.3 m; centre pavilion
 *    29 m wide, piers 1.3 m and landing 3.6 m proud on Lakeside, 2.5 m proud
 *    on the rear.
 *  - heights: measured, USGS 3DEP OH_Statewide_Phase1_1_2019 (2019 flight),
 *    1 m grid, above the areaway: flat roof 25.1, the front balustrade
 *    27.9, the centre attic 30.5, the pediment's ridge 34.9 running ~18 m
 *    back from the front. (OSM's 22.86 m is the roof above the street.)
 *  - order and base: Tim Evanson's square-on view of the centre, scaled to
 *    the lidar: base to 11.5, columns to 22.7, entablature to 25.1. Bays
 *    ~3.5 m (Cards84664's view of the east end counts ~18 columns).
 *  - statues: six figures on the cornice in front of the attic (Evanson,
 *    Mike Russell), above the columns.
 *  - colour: warmer, buff-grey granite than City Hall's (Cards84664 2019,
 *    Evanson); the pediment roof's green copper (Cards84664).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Cuyahoga_County_Courthouse_(28040216874).jpg, Tim Evanson, CC BY-SA 2.0 (front, S)
 *  - Cuyahoga_County_Courthouse.jpg, Mike Russell, CC BY-SA 3.0 (front, SW)
 *  - Cuyahoga_County_Courthouse.png, Cards84664, CC BY-SA 4.0 (front and E end, from the E)
 *  - Cuyahoga_County_Courthouse_(27420332197).jpg, Warren LeMay, CC0
 * No look-only sources. No commercial imagery.
 *
 * Steps and doors: the map's terrain puts the Lakeside sidewalk ~3.7 m
 * above the model's base (the lidar says 2.3; the 2 m terrain smooths the
 * areaway), so the four treads rise from 3.7 to door sills at 4.7, about
 * 1 m higher than the lidar would put them.
 *
 * Doubts: the rear (lake) side is not in any photo used; it is drawn like
 * City Hall's rear (engaged columns on the pavilion), which the lidar's
 * plan supports. The roof's light courts (lidar) are left out, as are the
 * capitals, balusters, window frames and the two seated bronzes on the steps.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { rect, inset, cap, block, lathe, gableY, rakingCornice, save } from './chi-field-museum'
import { groupPlanHall, type HallSpec } from './cle-city-hall'

function build() {
  const W = 58.3, yF = -30.6, yR = 30.7, P = 14.5, pF = -33.2, pR = 33.2
  const spec: HallSpec = {
    W, yF, yR, P, pF, pR,
    street: 2.3, doorSill: 4.7, stepsFrom: 3.7, baseTop: 11.5, colTop: 22.7, cornTop: 25.1, balTop: 27.9, atticTop: 30.5,
    bay: 3.5, endPier: 3.4, colR: 0.65, loggiaArched: true,
  }
  const h = groupPlanHall(spec)

  // Flat roof inside the balustrade, and on the attic.
  cap(h.roof, inset(rect(-W, yF, W, yR), 0.8), spec.cornTop)
  cap(h.roof, inset(rect(-P, pF, P, pR), -0.18), spec.atticTop)

  // The pediment: a low copper gable running 18 m back from the front.
  const gx = 13.6, gz0 = spec.atticTop, gz1 = 34.9, gy0 = pF + 0.05, gy1 = pF + 18
  gableY(h.copper, h.stone, -gx, gx, gy0, gy1, gz0, gz1)
  rakingCornice(h.trim, -gx - 0.3, gx + 0.3, gy0, -1, gz0 - 0.1, gz1 + 0.15, 0.7, 0.45)

  // Six statues on the cornice in front of the attic.
  for (const x of [-9.0, -7.2, -2.4, 2.4, 7.2, 9.0]) {
    const cy = pF - 0.15
    block(h.trim, h.trim, rect(x - 0.6, cy - 0.6, x + 0.6, cy + 0.6), spec.cornTop, spec.cornTop + 0.8, 0.1)
    lathe(h.trim, x, cy, [[0.5, spec.cornTop + 0.8], [0.45, spec.cornTop + 2.2], [0.4, spec.cornTop + 3.0], [0.24, spec.cornTop + 3.2], [0.28, spec.cornTop + 3.5], [0.0, spec.cornTop + 3.75]], 8)
  }

  return [
    { part: h.stone, material: finish('cle-courthouse-granite', 0xdcd4c6) },
    { part: h.trim, material: finish('cle-courthouse-granite-trim', 0xebe5da) },
    { part: h.win, material: PALETTE.window },
    { part: h.copper, material: finish('cle-hall-copper', 0x8db39f) },
    { part: h.roof, material: PALETTE.roof },
    { part: h.door, material: finish('cle-hall-bronze', 0x6f6c5c) },
  ]
}

if (import.meta.main) await save('cle-cuyahoga-county-courthouse', 'Cuyahoga County Courthouse', [41.503397, -81.697011], 325.9, build(), 6500)
