/**
 * 520 Newport Center Drive, Newport Beach — original procedural model.
 * Creator: Coping3174. Modeling assistant: Codex (GPT-6).
 * Run: bun generators/nb-520-newport-center-drive.ts
 * Optional massing study: --massing <output.glb> (use a scratch directory).
 *
 * Evidence and dimensions
 * - OSM way/953585213: addressed tower outline, downloaded 2026-11-19.
 *   https://www.openstreetmap.org/way/953585213
 *   Measured outline: about 37.0 m east–west by 46.5 m north–south;
 *   anchor (-117.8710989, 33.6163038), bearing -0.55 degrees. The OSM
 *   height=6.4 is inconsistent with the tower and is deliberately unused.
 * - CTBUH: 96 m / 315 ft, completed 2015, 20 floors.
 *   https://www.skyscrapercenter.com/building/520-newport-center-drive/27156
 * - Pei Cobb Freed & Partners: 17 typical floors, 30 ft structural bays,
 *   15 ft cantilevered corners, 28 ft lobby, travertine and glass.
 *   https://www.pcf-p.com/projects/520-newport-center-drive/
 * - Nine photographs supplied by the user on 2026-11-19, expressly for
 *   modeling. License not supplied; these are look-only references, not
 *   CC0 photos, and are not embedded or redistributed with this model.
 *   Matching copies on the architect's project page credit RMA Architectural
 *   Photography (front/entry) and Joshua White Photography (sunset/oblique).
 *   This draft has not had an open-photo provenance review for publication.
 *
 * Five identifying features, numbered against the supplied photographs:
 * 1. Tall unstepped rectangular volume (3, 5, 7, 8).
 * 2. Cream travertine lattice with narrow, deep side reveals (1, 6, 9).
 * 3. Taller top glazing band and a plain solid parapet (3, 5, 7, 8).
 * 4. Double-height recessed glass lobby behind square piers (2, 4, 6).
 * 5. Unsupported outer corners above an open colonnade (2, 6).
 *
 * Estimates: facade piers 1.65 m, typical band 1.25 m, glazing recess
 * 0.65 m, lobby inset 3.8 m, crown window sill 86.55 m and parapet 3 m.
 * Normal floor pitch is inferred from 17 typical rows within the measured
 * silhouette, not surveyed floor levels. Structural bay spacing is fitted
 * to the OSM envelope (9.25/9.30 m instead of the nominal 9.144 m).
 * Roof: a recessed pale deck, low service enclosure and two broad plant
 * groups approximate the aerial photograph; exact plant layout unknown.
 * Upper facades are repeated on all four sides from the visible grid;
 * unseen service doors and rooftop equipment details are not invented.
 * Terrain check: Mapterhorn z15 relief 0.28 m over the footprint; no
 * visible top is buried. Base remains at ground, elevation 0.
 *
 * Low LOD combines alternate typical floor rows to avoid map-size shimmer;
 * detail LOD keeps all 17 rows and restrained glazing divisions. Both keep
 * the taller penthouse row, real horizontal bay count, and lobby openings.
 * Night uses warm window/entrance materials only. The sunset reference
 * supports occupied windows but does not establish a floodlight scheme.
 * No landscaping, plaza surface, neighboring towers or parking structure.
 * Local x=east, y=north, z=up; mesh.ts exports +Y up / -Z north in metres.
 */
import { Part, writeGlb } from './mesh'
import { PALETTE, finish } from './palette'
import { rect, prism, edges, facePanel, soften, wall } from './nyc-432-park'

const ID = 'nb-520-newport-center-drive'
const W = 37, D = 46.5, H = 96
const LOBBY = 8.5344, BODY = 10, CROWN = 85.3, CAP = 93
const PITCH = (CROWN - BODY) / 17
const PIER = 1.65, RECESS = 0.65
const outline = rect(-W / 2, W / 2, -D / 2, D / 2)

function build(detail: boolean, massing = false) {
  const stone = new Part(), trim = new Part(), glass = new Part()
  const roof = new Part(), metal = new Part(), entrance = new Part()
  const block = (part: Part, x: number, y: number, w: number, d: number,
    z0: number, z1: number, bevel = 0.16) =>
    prism(part, rect(x - w / 2, x + w / 2, y - d / 2, y + d / 2), z0, z1,
      { bevel, bottom: true })

  const bands: [number, number][] = [[LOBBY, BODY]]
  for (let i = detail ? 1 : 2; i < 17; i += detail ? 1 : 2)
    bands.push([BODY + i * PITCH - (detail ? 1.25 : 1.6), BODY + i * PITCH])
  bands.push([CROWN, CROWN + 1.25])
  const pierSpans: [number, number][] = [[0, LOBBY]]
  if (!massing) bands.forEach(([, top], i) => pierSpans.push([top, bands[i + 1]?.[0] ?? CAP]))

  // Each face has half-width corner bays. Columns stop short of corners.
  // West/east: 4 full bays + 2 half bays. North/south: 3 full + 2 half.
  for (const [a, b] of edges(outline)) {
    const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy)
    const ux = dx / length, uy = dy / length
    const bays = Math.abs(dx) > 1 ? 4 : 5
    const pitch = length / bays
    for (let i = 0; i < bays; i++) {
      const s = (i + 0.5) * pitch
      const x = a[0] + ux * s - uy * PIER / 2
      const y = a[1] + uy * s + ux * PIER / 2
      // Stop at each beam: no coincident stone faces at frame crossings.
      for (const [lo, hi] of pierSpans)
        prism(stone, rect(x - PIER / 2, x + PIER / 2, y - PIER / 2, y + PIER / 2),
          lo, hi, { bevel: 0.3, top: null })
    }
  }

  // Glazing is a solid backed volume; deep frames stand in front of it.
  prism(glass, rect(-W / 2 + RECESS, W / 2 - RECESS,
    -D / 2 + RECESS, D / 2 - RECESS), LOBBY, CAP, { bevel: 0.12, top: roof })
  if (massing) {
    prism(stone, outline, LOBBY, CAP, { bevel: 0.4, top: null, bottom: true })
  } else {
    // Solid floor plates give the cantilever its real depth and soffit.
    const band = (z0: number, z1: number) => prism(stone, outline, z0, z1,
      { bevel: 0.25, bottom: true })
    for (const [lo, hi] of bands) band(lo, hi)

    if (detail) {
      // Four wide lights per full bay, fewer in the cantilevered end bays.
      for (const [a, b] of edges(outline)) {
        const length = Math.hypot(b[0] - a[0], b[1] - a[1])
        const bays = Math.abs(b[0] - a[0]) > 1 ? 4 : 5
        const pitch = length / bays
        const limits = [0, ...Array.from({ length: bays }, (_, i) => (i + 0.5) * pitch), length]
        for (let bay = 0; bay < limits.length - 1; bay++) {
          const left = limits[bay] + (bay ? PIER / 2 : 0.15)
          const right = limits[bay + 1] - (bay < bays ? PIER / 2 : 0.15)
          const count = bay === 0 || bay === bays ? 2 : 4
          for (let k = 1; k < count; k++) {
            const at = left + (right - left) * k / count
            facePanel(metal, a, b, at - 0.065, at + 0.065, BODY, CAP, -RECESS + 0.025)
          }
          // The narrow return next to each pier is recessed behind the
          // main glazing, as the close-up shows; a pale reveal catches light.
          if (bay < bays) facePanel(trim, a, b, right - 0.18, right, BODY, CAP, -RECESS + 0.035)
        }
      }
    }
  }

  // Open portico: the lobby is set well behind its freestanding piers.
  const lobby = rect(-W / 2 + 3.8, W / 2 - 3.8, -D / 2 + 3.8, D / 2 - 3.8)
  prism(glass, lobby, 0, LOBBY, { bevel: 0.08, top: stone })
  edges(lobby).forEach(([a, b], face) => {
    const length = Math.hypot(b[0] - a[0], b[1] - a[1])
    const lights = Math.round(length / 2.6)
    for (let i = 1; i < lights; i++) {
      const s = i * length / lights
      facePanel(metal, a, b, s - 0.10, s + 0.10, 0, LOBBY)
    }
    facePanel(metal, a, b, 0, length, 3.25, 3.45)
    // Main entrance faces west, toward the central campus court.
    if (face === 3) {
      facePanel(entrance, a, b, length / 2 - 1.7, length / 2 + 1.7, 0.12, 3.25, 0.045)
      facePanel(metal, a, b, length / 2 - 0.07, length / 2 + 0.07, 0.12, 3.25, 0.055)
    }
  })

  // Plain parapet around a lower roof, keeping the flat skyline.
  const outer = soften(outline, 0.28)
  const inner = soften(rect(-W / 2 + 1.3, W / 2 - 1.3, -D / 2 + 1.3, D / 2 - 1.3), 0.28)
  wall(stone, outer, CAP, H)
  wall(stone, { points: [...inner.points].reverse(), normals: [...inner.normals].reverse().map(n => [-n[0], -n[1], 0]) }, 93.6, H)
  outer.points.forEach((a, i) => {
    const j = (i + 1) % outer.points.length, b = outer.points[j]
    stone.quad([...inner.points[i], H], [...a, H], [...b, H], [...inner.points[j], H])
  })
  block(roof, 0, 0, W - 2.6, D - 2.6, CAP, 93.6, 0)
  if (!massing) {
    block(trim, 3, 3, 12, 16, 93.6, 94.7, 0.3)
    block(roof, -10, 11, 5, 7, 93.6, 95.1, 0.25)
    block(roof, -10, -7, 5, 9, 93.6, 94.9, 0.25)
  }

  return [
    { part: stone, material: finish('travertine', 0xeae5d9) },
    { part: trim, material: PALETTE.trim },
    { part: glass, material: { ...PALETTE.window, color: 0x71899e } },
    { part: roof, material: PALETTE.roof },
    { part: metal, material: finish('metal', 0x878d90) },
    { part: entrance, material: { ...PALETTE.entrance, color: 0x7b919e } },
  ].filter(({ part }) => part.triangles > 0)
}

if (import.meta.main) {
  const massing = process.argv.includes('--massing')
  const massingOutput = process.argv[process.argv.indexOf('--massing') + 1]
  if (massing && (!massingOutput || !massingOutput.endsWith('.glb')))
    throw new Error('--massing requires an output .glb path')
  for (const detail of massing ? [false] : [false, true]) {
    const parts = build(detail, massing)
    const triangles = parts.reduce((n, p) => n + p.part.triangles, 0)
    const bytes = writeGlb('520 Newport Center Drive', parts, {
      license: 'CC0-1.0', creator: 'Coping3174', height: H,
      frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
      note: 'Draft; user-supplied photo licenses unverified. See generator evidence.',
    })
    if (triangles > (detail ? 40000 : 5000) || bytes.length > (detail ? 1500000 : 250000))
      throw new Error(`Model budget exceeded: ${triangles} triangles / ${bytes.length} bytes`)
    const path = massing ? massingOutput
      : new URL(`../models/${ID}${detail ? '.detail' : ''}.glb`, import.meta.url).pathname
    await Bun.write(path, bytes)
    console.log(`${path}: ${triangles} triangles, ${bytes.length} bytes`)
  }
}
