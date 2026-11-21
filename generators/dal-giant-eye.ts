/**
 * Eye ("the Giant Eyeball", Tony Tasset, 2007; in Dallas since 2013), the
 * sculpture garden at 1601 Main Street, Downtown Dallas. Original procedural
 * geometry, CC0-1.0.
 *
 *   bun generators/dal-giant-eye.ts
 *
 * Map frame: x east, y north, z up, metres. The model is built with the
 * gaze toward -y (south). The catalog bearing of 346 turns it to look
 * toward 166°, south-south-east down the lot to Main Street. Main Street
 * (OSM way/574051362) runs at 76°, and the lot runs square to it. The origin is
 * the sphere's centre in plan: the eyeball's top in the NAIP orthophoto
 * sits within about 3 m of the OSM artwork node/12093271661 ("The Eye"),
 * whose position is used. It is not a building in OSM, so it replaces
 * nothing. The lawn is level, and y = 0 is the lawn.
 *
 * Identity: a giant white eyeball on a lawn, with a blue iris and black
 * pupil staring straight out.
 *
 * Evidence:
 *  - Published: 30 ft (9.1 m) tall fibreglass and resin sphere (Wikidata
 *    Q122272837; Carol M. Highsmith's LoC caption "'The Eye,' a
 *    30-foot-tall eyeball sculpture in Dallas, Texas", public domain).
 *  - USGS NAIP orthophoto (public domain): the round white top in the
 *    lot north of Main Street, about 9 m across.
 *  - Photos (Flickr via Openverse):
 *    e1 "Giant Eyeball, Dallas", Sharon Mollerus, CC BY 2.0,
 *       https://www.flickr.com/photos/38315261@N00/35077984153, face on;
 *    e2 same author and licence, /35727921102, three-quarter from the left;
 *    e3 /29121634527 and e4 /53737791359, same author, 2018 and 2024;
 *    e5 "Downtown Dallas Eye", Chasqui (Luis Tamayo), CC BY-SA 2.0,
 *       https://www.flickr.com/photos/77887212@N00/11452656535, from Main
 *       Street down the lot.
 *  - Measured off e1 and e5: the iris spans 0.49 of the sphere's width face
 *    on, a 29.5° half-angle from the gaze axis; the pupil spans 0.24,
 *    14°. The pupil's centre is at 0.54 of the height in both photos, so
 *    the gaze is tilted up about 4° (estimated).
 *  - Colour: a warm white sclera (#efe9e0). The iris is a mid blue,
 *    darkening to a navy rim at its edge, and the pupil is near black. It is
 *    drawn charcoal #4a4f57, the palette's darkest.
 *
 * Left out: the red veins painted on the sclera, which are too fine to read
 * at map scale, and the iris's streaks. Night: no open night photo was
 * found, so nothing is lit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const SCLERA = finish('eye-sclera', 0xefe9e0, 0.5)
const IRIS = finish('eye-iris', 0x5a8fc2, 0.5)
const RIM = finish('eye-iris-rim', 0x41597a, 0.5)
const PUPIL = finish('eye-pupil', 0x4a4f57, 0.4)

const R = 9.14 / 2
const UP = (4 * Math.PI) / 180

// The gaze axis and two axes square to it.
const g: V3 = [0, -Math.cos(UP), Math.sin(UP)]
const e1: V3 = [1, 0, 0]
const e2: V3 = [g[1] * e1[2] - g[2] * e1[1], g[2] * e1[0] - g[0] * e1[2], g[0] * e1[1] - g[1] * e1[0]]

const deg = (d: number) => (d * Math.PI) / 180
// Polar rings from the gaze axis: pupil, iris, rim, then the sclera on round.
const rings = [0, 7, 14, 19, 24, 27, 29.5, 36, 45, 56, 68, 80, 92, 104, 116, 128, 140, 152, 164, 180].map(deg)
const matOf = (t: number) => (t < deg(14) + 1e-6 ? 'pupil' : t < deg(27) + 1e-6 ? 'iris' : t < deg(29.5) + 1e-6 ? 'rim' : 'sclera')
const NP = 40

const dir = (t: number, p: number): V3 => {
  const s = Math.sin(t), c = Math.cos(t), cp = Math.cos(p), sp = Math.sin(p)
  return [0, 1, 2].map((k) => c * g[k] + s * (cp * e1[k] + sp * e2[k])) as V3
}
// Sit the sphere so its lowest vertex is on the lawn.
let minZ = Infinity
for (const t of rings) for (let j = 0; j < NP; j++) minZ = Math.min(minZ, R * dir(t, (2 * Math.PI * j) / NP)[2])
const CZ = -minZ
const pt = (n: V3): V3 => [R * n[0], R * n[1], CZ + R * n[2]]

const parts = { pupil: new Part(), iris: new Part(), rim: new Part(), sclera: new Part() }
for (let i = 0; i < rings.length - 1; i++) {
  const t0 = rings[i], t1 = rings[i + 1]
  const part = parts[matOf((t0 + t1) / 2)]
  for (let j = 0; j < NP; j++) {
    const p0 = (2 * Math.PI * j) / NP, p1 = (2 * Math.PI * (j + 1)) / NP
    const a = dir(t0, p0), b = dir(t0, p1), c = dir(t1, p1), d = dir(t1, p0)
    if (i > 0) part.tri(pt(a), pt(d), pt(b), undefined, undefined, undefined, [a, d, b])
    if (i < rings.length - 2) part.tri(pt(b), pt(d), pt(c), undefined, undefined, undefined, [b, d, c])
  }
}

const list = [
  { part: parts.sclera, material: SCLERA },
  { part: parts.iris, material: IRIS },
  { part: parts.rim, material: RIM },
  { part: parts.pupil, material: PUPIL },
]
const tris = list.reduce((s, p) => s + p.part.triangles, 0)
if (tris > 5000) throw new Error(`over budget: ${tris} triangles`)
const glb = writeGlb('Eye', list, {
  title: 'Eye',
  artist: 'Tony Tasset',
  license: 'CC0-1.0',
  source: 'generators/dal-giant-eye.ts',
})
const out = process.argv[2] ?? new URL('../models/dal-giant-eye.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
