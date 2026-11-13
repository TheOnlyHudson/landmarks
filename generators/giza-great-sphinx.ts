/**
 * Great Sphinx of Giza: procedural, CC0-1.0.
 * bun generators/giza-great-sphinx.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the Sphinx faces due
 * east, as OSM maps it). The origin is the outline's area centroid; y = 0 is
 * the floor of the hollow it was carved in.
 *
 * Carved c. 2500 BC from the bedrock of the plateau: a recumbent lion with a
 * human head in a nemes headdress, lying in a quarried enclosure below the
 * surrounding ground.
 *
 * Published (Wikipedia, "Great Sphinx of Giza"): 73 m long, 19 m wide,
 * 20 m high.
 * OSM (relation/7728526, a building relation): the outline way/540058405
 * (75 m long, 19 m wide) and its parts: the body way/24585237 (to 11 m), the
 * paws way/540058406 (4 m) and the head way/540058407 (11-20 m). All
 * replaced. Their plans are used for the body's length and width, the paws'
 * reach and the head's position.
 * From photos ("Great Sphinx of Giza, Giza, Egypt6.jpg", Diego Delso, CC BY-SA
 * 3.0, from the east; "Great Sphinx of Giza (أبو الهول).jpg", Petar Milošević,
 * CC BY-SA 4.0, from the south-east): the haunch and back profile, the
 * shoulders rising to the neck, the nemes flaring over the shoulders.
 *
 * Elevation -7: the Sphinx stands in its quarried hollow, whose floor is
 * about 7 m below the plateau around it (the enclosure wall reaches about
 * the Sphinx's chest in the photo from the east). The map's terrain is too
 * coarse to show the hollow (tools/terrain.ts could not check the site:
 * Mapterhorn has no z15 tiles here), so the model is sunk and the map hides
 * the lower body, as it is seen from outside the enclosure.
 *
 * Estimated: every section of the body (nine, between the photos' profile
 * points; the chest narrows under the head, where the nemes' lappets flare
 * over the shoulders, as the photo from the east shows), the head's taper, the paws' width and the gap between them.
 * Left out: the face's features, the stele between the paws, the
 * enclosure.
 *
 * Night: floodlit warm (the Sound and Light show).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { prism, type XY } from './sf-de-young'

const stone = new Part()

/** A rounded section across the body at x: half-width hw, height h. */
function section(x: number, hw: number, h: number, yc = 0): V3[] {
  const pts: [number, number][] = [[1, 0], [1, 0.55], [0.93, 0.8], [0.72, 0.95], [0.38, 1], [0, 1.01], [-0.38, 1], [-0.72, 0.95], [-0.93, 0.8], [-1, 0.55], [-1, 0]]
  return pts.map(([u, v]) => [x, yc + u * hw, v * h])
}
function loftX(sections: V3[][], part: Part) {
  for (let k = 0; k < sections.length - 1; k++) {
    const a = sections[k], b = sections[k + 1]
    for (let i = 0; i < a.length - 1; i++) part.quad(a[i], b[i], b[i + 1], a[i + 1])
  }
  // End caps: fans from the base centre.
  const cap = (s: V3[], flip: boolean) => {
    const c: V3 = [s[0][0], (s[0][1] + s[s.length - 1][1]) / 2, s[5][2] * 0.45]
    for (let i = 0; i < s.length - 1; i++) flip ? part.tri(c, s[i + 1], s[i]) : part.tri(c, s[i], s[i + 1])
    part.tri(s[s.length - 1], s[0], c)
  }
  cap(sections[0], false)
  cap(sections[sections.length - 1], true)
}

// The lion's body: haunch, back, shoulders and chest (x from tail to chest).
const BODY: [number, number, number][] = [
  [-34.4, 5.2, 5.0], [-32.0, 8.3, 8.4], [-27.0, 9.2, 9.6], [-14.0, 9.2, 9.5],
  [0.0, 9.3, 10.2], [8.0, 8.9, 11.2], [14.0, 7.6, 11.8], [19.0, 6.3, 11.0], [22.3, 5.6, 9.0],
]
loftX(BODY.map(([x, hw, h]) => section(x, hw, h)), stone)

// The paws, reaching east, either side of the stele.
for (const yc of [-4.6, 4.6]) {
  const ring: XY[] = [[21.0, yc - 1.9], [39.5, yc - 1.9], [40.7, yc - 1.0], [40.7, yc + 1.0], [39.5, yc + 1.9], [21.0, yc + 1.9]]
  prism(stone, ring, 0, 4.0, stone, 0.5)
}

// The head in its nemes: rounded blocks tapering to the crown, the lappets
// flaring over the shoulders; the face at the front (east).
{
  const xc = 15.3, yc = 0.25
  const levels: [number, number, number][] = [ // z, depth (x), width (y)
    [10.6, 9.4, 12.6], [12.4, 9.2, 11.4], [15.5, 8.6, 8.6], [18.2, 7.8, 6.8], [19.5, 6.6, 5.4], [20.0, 5.0, 3.8],
  ]
  const ring = (z: number, d: number, w: number): V3[] => {
    const r = 0.25 * Math.min(d, w)
    const pts: V3[] = []
    for (const [cx, cy, a0] of [[d / 2 - r, w / 2 - r, 0], [-d / 2 + r, w / 2 - r, 90], [-d / 2 + r, -w / 2 + r, 180], [d / 2 - r, -w / 2 + r, 270]] as [number, number, number][])
      for (let s = 0; s <= 2; s++) {
        const a = ((a0 + s * 45) * Math.PI) / 180
        pts.push([xc + cx + r * Math.cos(a), yc + cy + r * Math.sin(a), z])
      }
    return pts
  }
  const rings = levels.map(([z, d, w]) => ring(z, d, w))
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < rings[k].length; i++) {
      const j = (i + 1) % rings[k].length
      stone.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
    }
  const t = rings[rings.length - 1], c: V3 = [xc, yc, 20.0]
  for (let i = 0; i < t.length; i++) stone.tri(c, t[i], t[(i + 1) % t.length])
  // The face and neck: a block proud of the nemes' front, under the brow.
  const fx0 = xc + 2.5, fx1 = xc + 5.6
  prism(stone, [[fx0, yc - 2.7], [fx1, yc - 2.4], [fx1, yc + 2.4], [fx0, yc + 2.7]], 9.5, 17.6, stone, 0.4)
}

const lit = (_p: V3, n: V3) => (n[2] > 0.9 ? 0.5 : 0.9)
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: stone, material: { ...finish('sphinx-limestone', 0xd8bb90), floodlight: lit } },
]
const triangles = stone.triangles
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Great Sphinx of Giza', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: -7, height: 20,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/giza-great-sphinx.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
