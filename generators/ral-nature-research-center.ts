/**
 * Nature Research Center, North Carolina Museum of Natural Sciences,
 * Raleigh (2012; O'Brien Atkins Associates): procedural, CC0-1.0.
 * bun generators/ral-nature-research-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 3 (the OSM
 * walls run at 3°/93°, the street grid). Origin: the area centroid of OSM
 * way/148163972 (-78.640914, 35.782309).
 * y = 0 is the lowest ground under the footprint: the north-east corner at
 * Jones and Salisbury Streets. Mapterhorn (z13; z14–15 tiles are missing
 * here) rises ~1.5 m to the north-west corner and ~3 m to the south side;
 * the walls run down to y = 0 and sink into it. Elevation 0.
 *
 * OSM: way/148163972 "North Carolina Museum of Natural Sciences" (levels 4,
 * no height): 97 × 34 m, the long side on Jones Street (north), with an arc
 * of radius 6.7 m at its north-east corner where the globe stands; drawn
 * from the OSM points, the arc replaced by the globe itself.
 * Published: four storeys, 80,000 sq ft (Wikipedia, "North Carolina Museum
 * of Natural Sciences"); the SECU Daily Planet globe is 70 ft (21.3 m)
 * across, a three-storey theatre inside it, pinned to the building (Clancy
 * & Theys Construction project page; Visit Raleigh; WRAL 2012).
 *
 * No lidar covers Wake County, so heights are estimated:
 *  - the globe: 21.3 m across (published), its foot 0.6 m over the plaza
 *    (r02: it nearly touches a low planter ring, r01); top 22.5 m;
 *  - the main roof 19.5 m: four storeys; in r02 the globe's top stands
 *    over the curtain wall's top (a first pass at 21 m drew the globe
 *    smaller than the photo shows against the wall);
 *  - the atrium lantern (the glass tower rising over the roof in r02, the
 *    glazed strip in NAIP at x 6..16) to 25 m.
 * Plan of the globe: NAIP (USGS, public domain, 0.16 m/px) shows it as a
 * full circle about 20 m across standing proud of the north wall in the
 * corner; the OSM arc is only its foot. Centre taken at (43, 11), so it
 * stands 7 m out from the north wall and touches the east block, as r02
 * and r03 show.
 *
 * Photos (evidence):
 *  r01 "NC Museum Of Natural Sciences Nature Research Center-Daily
 *      Planet.jpeg", Mark Turner, CC0 (opening night 2012): the globe lit
 *      blue with projected light, the Americas on its east face.
 *  r02 "Nature Research Center.jpg", RadioFan, CC BY-SA 3.0 (2013): from
 *      Jones Street: the silver globe with green-brown continents, the
 *      north curtain wall with dense silver fins, the glazed ground floor,
 *      the glass lantern over the roof, the grey stone east block.
 *  r03 Flickr 6878658730 "The World Takes Shape in Raleigh, N.C.", USGS
 *      Landsat, CC BY 2.0 (2012): the globe close up during installation,
 *      silver panels, Africa going on; its size against the workers.
 * Aerial: USGS NAIP (public domain): the roof, the atrium strip, the globe.
 *
 * Colours: the globe's silver panels (r02, r03) a pale blue-silver, the
 * printed continents a muted green-brown; the curtain wall a light glass
 * with pale fins; the stone a cool grey (r02's east block).
 * The continents are a crude hand-drawn map (lon/lat polygons), placed so
 * Africa faces north and the Americas east, as r02 and r03 show.
 * Estimated: every height but the globe's diameter; the bay rhythm.
 * Invented: the south and west fronts (no licensed photo found): stone with
 * grouped windows, like the east block in r02.
 * Left out: the fins' real density (drawn every 3 m), the bridge to the
 * Nature Exploration Center, rooftop plant and terraces, the planters.
 * The globe is on the north-east corner, so the preview's south-west views
 * (and its 80 px phone view) see it behind the building; from Jones and
 * Salisbury Streets it is the first thing seen.
 * Doubts: only two daylight photos, both of the north-east; no Mapillary
 * (no token); the globe's exact centre (NAIP and OSM disagree by ~3 m).
 * Night: the globe is lit by projections (r01): both its materials are
 * `neon-*`, so it glows in its own colours; the curtain wall is a window.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { type XY, type Face, prism, capRing, lathe, disc, finishGlb, writeModel } from './sea-tacoma-union-station'
import { panel, box } from './nash-tennessee-state-capitol'

const ROOF = 19.5, LANTERN = 25
const G: V3 = [43, 11, 0.6 + 10.67], GR = 10.67

// the building, from the OSM ring with the globe's arc taken out
const RING: XY[] = [
  [-48.82, -14.26], [-3.97, -16.08], [48.2, -17.7], [49.24, 0.09], [38.2, 0.4], [37.41, 14.58], [-47.42, 18.33], [-48.2, 0],
]

// a crude world map, lon/lat
const LAND: XY[][] = [
  [[-165, 65], [-140, 70], [-95, 72], [-75, 62], [-55, 50], [-80, 25], [-97, 17], [-80, 8], [-105, 22], [-125, 40], [-165, 58]],
  [[-80, 10], [-60, 10], [-35, -7], [-40, -22], [-65, -55], [-75, -50], [-70, -18], [-81, -5]],
  [[-17, 15], [-5, 35], [10, 37], [32, 31], [43, 12], [51, 11], [40, -15], [20, -35], [12, -17], [9, 4], [-8, 5]],
  [[-10, 36], [-10, 58], [25, 71], [60, 70], [110, 77], [180, 68], [160, 60], [140, 50], [120, 30], [105, 10], [90, 22], [78, 8], [70, 22], [57, 25], [40, 30], [28, 40]],
  [[114, -22], [130, -12], [143, -11], [153, -28], [145, -38], [115, -34]],
  [[-55, 60], [-20, 70], [-25, 82], [-60, 80]],
]
function inPoly(p: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if (yi > p[1] !== yj > p[1] && p[0] < xi + ((p[1] - yi) * (xj - xi)) / (yj - yi)) c = !c
  }
  return c
}
const isLand = (lon: number, lat: number) => lat < -66 || LAND.some((r) => inPoly([lon, lat], r))

function build() {
  const stone = new Part(), glassW = new Part(), trim = new Part(), roof = new Part(), sea = new Part(), land = new Part()

  // ------------------------------------------------------------ the building
  prism(stone, null, RING, 0, ROOF)
  capRing(roof, RING, ROOF, true)
  // parapet coping
  // faces: the north wall (curtain wall east of x = -10), the rest stone with grouped windows
  for (let i = 0; i < RING.length; i++) {
    const a = RING[i], b = RING[(i + 1) % RING.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 8) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const f: Face = { o: [a[0], a[1], 0], n }
    if (i === 5) {
      // Jones Street (s runs west from the globe): the finned curtain wall,
      // then the stone west end with grouped windows
      const s1 = 47 // where the curtain wall ends
      panel(glassW, f, s1 / 2, s1 - 0.6, 0.6, ROOF - 0.8, 0.05)
      for (let s = 1.5; s < s1 - 0.5; s += 3) panel(trim, f, s, 0.35, 5.2, ROOF - 0.8, 0.12)
      panel(trim, f, s1 / 2, s1 - 0.6, 4.9, 5.4, 0.1) // floor line over the glazed ground floor
      for (let s = s1 + 2; s + 6 <= L - 1; s += 7) {
        panel(glassW, f, s + 3, 5, 6, 12.5, 0.05)
        panel(glassW, f, s + 3, 5, 13.5, ROOF - 1.2, 0.05)
      }
    } else {
      // grouped windows: two bands of two storeys
      const bays = Math.max(1, Math.floor((L - 4) / 7))
      const w = (L - 4) / bays
      for (let k = 0; k < bays; k++) {
        const s = 2 + w * (k + 0.5)
        panel(glassW, f, s, w - 2, 1.0, 4.4, 0.05)
        panel(glassW, f, s, w - 2, 6, 12.5, 0.05)
        panel(glassW, f, s, w - 2, 13.5, ROOF - 1.2, 0.05)
      }
    }
  }
  // parapet cap
  for (let i = 0; i < RING.length; i++) {
    const a = RING[i], b = RING[(i + 1) % RING.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    panel(trim, { o: [a[0], a[1], 0], n }, L / 2, L, ROOF - 0.6, ROOF, 0.03)
  }
  // the atrium lantern: glass with fins, over the roof
  prism(glassW, null, [[6, -13], [16, -13.5], [16, 15.6], [6, 16.1]], ROOF, LANTERN)
  capRing(roof, [[6, -13], [16, -13.5], [16, 15.6], [6, 16.1]], LANTERN, true)
  for (const y of [-13.2, 15.8]) for (let x = 7.5; x < 16; x += 2.5) box(trim, x - 0.15, y - 0.25, x + 0.15, y + 0.25, ROOF, LANTERN, trim)

  // ------------------------------------------------------------ the Daily Planet
  // its foot: a low stone ring in a planter
  lathe(stone, G[0], G[1], [[4.2, 0], [4.2, 1.0], [3.6, 1.0]], 16)
  disc(stone, G[0], G[1], 3.6, 1.0, 16)
  const NLAT = 22, NLON = 44
  const P = (lat: number, az: number): V3 => {
    const c = Math.cos(lat)
    return [G[0] + GR * c * Math.sin(az), G[1] + GR * c * Math.cos(az), G[2] + GR * Math.sin(lat)]
  }
  const Nn = (lat: number, az: number): V3 => [Math.cos(lat) * Math.sin(az), Math.cos(lat) * Math.cos(az), Math.sin(lat)]
  for (let i = 0; i < NLAT; i++) {
    const la0 = -Math.PI / 2 + (Math.PI * i) / NLAT, la1 = -Math.PI / 2 + (Math.PI * (i + 1)) / NLAT
    for (let j = 0; j < NLON; j++) {
      const az0 = (2 * Math.PI * j) / NLON, az1 = (2 * Math.PI * (j + 1)) / NLON
      // azimuth (clockwise from north) → longitude: Africa (25°E) faces north, the Americas east
      const azc = ((az0 + az1) / 2) * (180 / Math.PI), latc = ((la0 + la1) / 2) * (180 / Math.PI)
      let lon = 25 - azc
      while (lon < -180) lon += 360
      const part = isLand(lon, latc) ? land : sea
      const a = P(la0, az0), b = P(la0, az1), c = P(la1, az1), d = P(la1, az0)
      const na = Nn(la0, az0), nb = Nn(la0, az1), nc = Nn(la1, az1), nd = Nn(la1, az0)
      if (i > 0) part.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      if (i < NLAT - 1) part.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
  }

  return finishGlb('Nature Research Center', [
    { part: stone, material: finish('nrc-stone', 0xd8d5ce) },
    { part: glassW, material: windowVariant(2, 0x9fb5c6) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: sea, material: finish('neon-globe-sea', 0xbfcad3, 0.4) },
    { part: land, material: finish('neon-globe-land', 0x7f8f5a) },
  ], { bearing: 3, height: LANTERN, replaces: ['way/148163972'] }, 5000)
}

if (import.meta.main) await writeModel('ral-nature-research-center', build())
