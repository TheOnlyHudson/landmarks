import { describe, expect, test } from 'bun:test'
import { along, bead, chamferedRect, footedLoft, truss } from '../generators/bridge-kit'
import { Part, type V3 } from '../generators/mesh'

const expectClose = (a: number[][], b: number[][]) => {
  expect(a.length).toBe(b.length)
  a.forEach((v, i) => v.forEach((c, k) => expect(c).toBeCloseTo(b[i][k], 4)))
}

describe('bridge kit lights', () => {
  test('along spreads points evenly by length, half a gap in from each end', () => {
    const path: V3[] = [[0, 0, 0], [0, 10, 0], [0, 10, 30]]
    const points = along(path, 4)
    expect(points).toHaveLength(4)
    // 40 m long, so a light every 10 m from 5 m in: one on the first leg, three up the second.
    expectClose(points, [[0, 5, 0], [0, 10, 5], [0, 10, 15], [0, 10, 25]])
    expect(along([[1, 2, 3]], 2)).toEqual([[1, 2, 3], [1, 2, 3]])
    expect(along([], 3)).toEqual([])
  })

  test('a bead is a closed solid of 12 faces, or 4 for a low model', () => {
    for (const [tetra, faces] of [[false, 12], [true, 4]] as const) {
      const part = new Part()
      bead(part, [5, 5, 5], 1, tetra)
      expect(part.triangles).toBe(faces)
      // Closed and wound outward: the signed volume is positive.
      let volume = 0
      for (let i = 0; i < part.pos.length; i += 9) {
        const [a, b, c] = [0, 3, 6].map((k) => part.pos.slice(i + k, i + k + 3))
        volume += a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])
      }
      expect(volume).toBeGreaterThan(0)
    }
  })
})

describe('footed loft', () => {
  // A 20 x 10 m pier on ground sloping from 1 m (west) to 6 m (east), its top at 4 m.
  const ground = (x: number) => 3.5 + x / 4
  const part = new Part()
  footedLoft(part, ground, [
    { plan: chamferedRect(-10, 10, -5, 5, 0.5), z: 'ground' },
    { plan: chamferedRect(-10, 10, -5, 5, 0.5), z: 4 },
  ], 2)
  // Part stores glTF order (x, y up, -z); back to the frame's (x, y, z up).
  const verts = Array.from({ length: part.pos.length / 3 }, (_, i) => [part.pos[i * 3], -part.pos[i * 3 + 2], part.pos[i * 3 + 1]])

  test('stands on the ground and never reaches below it', () => {
    for (const [x, , z] of verts) expect(z).toBeGreaterThanOrEqual(ground(x) - 1e-6)
    // Feet all round, at most 2 m apart along the long sides.
    const feet = verts.filter(([x, , z]) => Math.abs(z - ground(x)) < 1e-6 && z < 4)
    const south = [...new Set(feet.filter(([, y]) => y === -5).map(([x]) => x))].sort((a, b) => a - b)
    expect(south[0]).toBeLessThan(-6)
    for (let i = 1; i < south.length; i++) expect(south[i] - south[i - 1]).toBeLessThanOrEqual(2 + 1e-6)
  })

  test('stops at the ground where the ground rises over it, and faces outward', () => {
    // East of x = 2 the ground is above the top: nothing is drawn but the top, lifted onto it.
    for (let t = 0; t < part.pos.length; t += 9) {
      const [a, b, c] = [0, 3, 6].map((k) => [part.pos[t + k], -part.pos[t + k + 2], part.pos[t + k + 1]])
      const n = [
        (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
        (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
        (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
      ]
      const m = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3]
      // Walls point away from the centre in plan; the top points up.
      if (Math.abs(n[2]) < 1e-6) expect(n[0] * m[0] + n[1] * m[1]).toBeGreaterThan(0)
      else expect(n[2]).toBeGreaterThan(0)
      if (Math.abs(n[2]) < 1e-6) expect(Math.min(a[0], b[0], c[0])).toBeLessThan(2 + 1e-6)
    }
  })
})

describe('truss', () => {
  // Web strips in the plane x = 0: [y, z] of each strip's four corners, a strip per two triangles.
  const strips = (web: Part) => {
    const out: number[][][] = []
    for (let i = 0; i < web.pos.length; i += 18) {
      const pts: number[][] = []
      for (let k = 0; k < 18; k += 3) pts.push([-web.pos[i + k + 2], web.pos[i + k + 1]]) // glTF (x, z, -y) back to (y, z)
      out.push(pts)
    }
    return out
  }
  const build = (opts: Parameters<typeof truss>[6], bot = (_y: number) => 0) => {
    const chords = new Part(), web = new Part()
    truss(chords, web, 0, [0, 5, 10, 15], () => 8, bot, { topD: 1, botD: 1, ...opts })
    return strips(web)
  }
  const isPost = (s: number[][]) => Math.max(...s.map((p) => p[0])) - Math.min(...s.map((p) => p[0])) < 1
  const width = (s: number[][]) => Math.max(...s.map((p) => p[0])) - Math.min(...s.map((p) => p[0]))

  test('a post at every panel point and one diagonal per panel', () => {
    const web = build({ member: 0.8, post: 0.4 })
    expect(web.filter(isPost)).toHaveLength(4)
    expect(web.filter((s) => !isPost(s))).toHaveLength(3)
    for (const s of web.filter(isPost)) expect(width(s)).toBeCloseTo(0.4, 4)
  })

  test('flip turns every diagonal the other way', () => {
    // The first diagonal's top end: at y = 0 by default, at y = 5 flipped.
    const topEnd = (flip: boolean) => {
      const d = build({ flip }).filter((s) => !isPost(s))[0]
      const top = d.filter((p) => p[1] > 6.5)
      return top.reduce((a, p) => a + p[0], 0) / top.length
    }
    expect(topEnd(false)).toBeCloseTo(0, 0)
    expect(topEnd(true)).toBeCloseTo(5, 0)
  })

  test('no web where the chords close up', () => {
    // The bottom chord rises to meet the top past y = 10: only the posts at 0 and 5 and the diagonal between them remain.
    const web = build({ minWeb: 1.5 }, (y) => (y > 7.5 ? 6 : 0))
    expect(web.filter(isPost)).toHaveLength(2)
    expect(web.filter((s) => !isPost(s))).toHaveLength(1)
  })
})
