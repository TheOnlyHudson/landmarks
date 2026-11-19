/** Campus footprints in local metres (x east, y north, z up before catalog bearing).
 * Roof facets are precomputed from each eave polygon so ridges stop at wing joints.
 * An opening belongs to one wall; no projecting window boxes or textures.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { area, cap, lathe, onWall, panel, save, triangulate, walls, type XY } from './chi-aon-center'

type WindowRow = [sill: number, head: number]
export interface CampusWing {
  outline: XY[]
  eave: number
  rows: WindowRow[]
  bayWidth: number
  pierWidth: number
  minimumWall?: number
  blankEdges?: number[]
  bottom?: number
  base?: number
  band?: number
  roofFaces?: V3[][]
  archRow?: number
  portico?: { edge: number; width: number; depth: number; height: number; columns: number; arcades?: boolean; piers?: boolean; pediment?: boolean }
}
export interface CampusBuilding {
  id: string
  name: string
  anchor: XY
  bearing: number
  masonry: number
  accent: number
  roof: number
  wings: CampusWing[]
}

export async function buildCampusBuilding(building: CampusBuilding) {
  const body = new Part(), trim = new Part(), roof = new Part(), windows = new Part()
  for (const wing of building.wings) {
    const ring = wing.outline
    const bottom = wing.bottom ?? 0
    const base = wing.base ?? bottom
    if (base > bottom) walls(trim, ring, bottom, base)
    if (wing.band !== undefined) {
      walls(body, ring, base, wing.band)
      walls(trim, ring, wing.band, wing.band + 0.34)
      walls(body, ring, wing.band + 0.34, wing.eave - 0.32)
    } else walls(body, ring, base, wing.eave - 0.32)
    walls(trim, ring, wing.eave - 0.32, wing.eave)
    if (wing.roofFaces) {
      for (const face of wing.roofFaces) {
        const xy: XY[] = face.map(([x,y]) => [x,y])
        const vertices = area(xy) < 0 ? [...face].reverse() : face
        const plan: XY[] = vertices.map(([x,y]) => [x,y])
        for (const [a,b,c] of triangulate(plan)) roof.tri(vertices[a],vertices[b],vertices[c])
      }
    } else cap(roof, ring, wing.eave)
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const wall = onWall(a,b)
      if (wall.L < (wing.minimumWall ?? 4) || wing.blankEdges?.includes(i)) continue
      const count = Math.max(1, Math.round(wall.L / (wing.bayWidth + wing.pierWidth)))
      const pitch = wall.L / count
      const width = Math.min(wing.bayWidth, pitch - Math.min(wing.pierWidth, pitch * .48))
      for (let bay = 0; bay < count; bay++) {
        const s = pitch * (bay + .5)
        for (const [index,[sill,head]] of wing.rows.entries()) {
          const arch = wing.archRow === index ? Math.min(width / 2, (head-sill)*.45) : 0
          panel(windows,a,b,s-width/2,s+width/2,sill,head-arch)
          if (arch) {
            const center = wall.P(s,head-arch,.04)
            for (let j = 0; j < 10; j++) {
              const arc = (t: number) => wall.P(s + width/2*Math.cos(t),head-arch+arch*Math.sin(t),.04)
              windows.tri(center,arc(Math.PI*j/10),arc(Math.PI*(j+1)/10))
            }
          }
        }
      }
    }
    const entry = wing.portico
    if (entry) {
      const a = ring[entry.edge], b = ring[(entry.edge + 1) % ring.length]
      const wall = onWall(a,b), w = Math.min(entry.width,wall.L*.92)
      const left = (wall.L-w)/2, right = left+w, d = entry.depth, h = entry.height
      const point = (s:number,out:number): XY => wall.P(s,0,out).slice(0,2) as XY
      const porch = [point(left,d),point(right,d),point(right,0),point(left,0)]
      walls(trim,porch,h-.5,h)
      cap(trim,porch,h-.5,false)
      if (entry.piers) {
        for (const start of [left, right - 1.25]) {
          const pier = [point(start,d), point(start+1.25,d), point(start+1.25,0), point(start,0)]
          walls(trim,pier,0,h-.5)
        }
      }
      const inset = entry.piers ? w * .35 : .45
      for (let i=0; i<entry.columns; i++) {
        const s = left + inset + (w - 2*inset)*i/(entry.columns-1)
        const [x,y] = point(s,d-.42)
        lathe(trim,x,y,[[.38,0],[.38,.34],[.28,.44],[.27,h-.84],[.39,h-.68],[.39,h-.5]],10)
      }
      if (entry.arcades) {
        // Between each pair of piers, build the stone above the curved opening.
        const span = (w - .9) / (entry.columns - 1)
        for (let arch = 0; arch < entry.columns - 1; arch++) {
          const center = left + .45 + (arch + .5) * span
          const radius = span / 2 - .25
          const curve = (step: number) => {
            const a = Math.PI * (1 - step / 10)
            return wall.P(center + radius * Math.cos(a), h - .52 - radius + radius * Math.sin(a), d)
          }
          for (let j=0; j<10; j++) {
            const u = curve(j), v = curve(j+1)
            trim.quad(u,v,[v[0],v[1],h-.48],[u[0],u[1],h-.48])
          }
        }
      }
      if (entry.pediment) {
        const mid = (left+right)/2, peak = h + Math.min(2.5,w*.17)
        const A = wall.P(left,h,d), B = wall.P(right,h,d), C = wall.P(mid,peak,d)
        trim.tri(A,B,C)
        roof.quad(A,C,wall.P(mid,peak,0),wall.P(left,h,0))
        roof.quad(C,B,wall.P(right,h,0),wall.P(mid,peak,0))
      } else cap(roof,porch,h)
      panel(windows,a,b,wall.L/2-1,wall.L/2+1,0,Math.min(3.6,h-.55),.055)
    }
  }
  await save(building.id,building.name,building.anchor,building.bearing,[
    {part:body,material:finish('masonry',building.masonry)}, {part:trim,material:finish('stone-trim',building.accent)},
    {part:roof,material:finish('roof',building.roof)}, {part:windows,material:PALETTE.window},
  ])
}
