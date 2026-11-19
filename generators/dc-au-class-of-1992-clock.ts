/**
 * Class of 1992 Clock, Eric Friedheim Quadrangle, American University.
 * https://commons.wikimedia.org/wiki/File:Clock_of_American_University.jpg
 * https://www.american.edu/admissions/international/upload/2025-2026-international-toss-piece.pdf
 * The small top return inside the planter is 4.5 m above ground in the
 * District's 2022 surface model. The OSM paths 38078432 and 38078433
 * enclose it. The proportions of the dial, case and pedestal are estimates.
 */
import { Part } from './mesh'
import { finish } from './palette'
import { arc, extrudeShape, flatShape, onFace, finishGlb, lathe, prism, rect, writeModel, type Face, type XY } from './sea-tacoma-union-station'

const iron = new Part(), bronze = new Part(), enamel = new Part(), ink = new Part()
prism(iron, iron, rect(-.31,-.31,.31,.31), 0, .1)
prism(iron, iron, rect(-.26,-.26,.26,.26), .1, 1.04)
for (const n of [[0,1],[1,0],[0,-1],[-1,0]] as XY[]) {
  const face: Face = {o:[0,0,0], n}
  flatShape(bronze, face, [[-.18,.19],[.18,.19],[.18,.84],[0,.95],[-.18,.84]], .265)
}
lathe(iron, 0, 0, [[.28,1.04],[.27,1.12],[.15,1.24],[.16,1.29],[.12,1.36],
  [.105,1.49],[.079,2.96],[.14,3.01],[.14,3.12],[.105,3.15]], 20)
const dialZ = 3.72
const circle = (radius: number): XY[] => arc(0,dialZ,radius,0,360,48).slice(0,-1)
const front: Face = {o:[0,0,0], n:[0,1]}
extrudeShape(iron, front, circle(.55), -.13, .13)
const crest: XY[] = [[-.48,3.96],[-.54,4.15],[-.42,4.15],[-.30,4.21],[-.20,4.32],
  [-.10,4.35],[-.055,4.43],[0,4.50],[.055,4.43],[.10,4.35],[.20,4.32],
  [.30,4.21],[.42,4.15],[.54,4.15],[.48,3.96]]
for (const n of [[0,1],[0,-1]] as XY[]) {
  const f: Face = {o:[0,0,0], n}
  extrudeShape(iron, f, crest, 0, .105)
  extrudeShape(iron, f, circle(.525), .13, .155)
  flatShape(bronze, f, circle(.491), .160)
  flatShape(enamel, f, circle(.459), .164)
  // Orient each small Roman numeral out from the hub along its own radius.
  const hours = ['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI']
  const stroke = (p: XY,q: XY,thickness: number) => {
    const length=Math.hypot(q[0]-p[0],q[1]-p[1])
    const dx=-(q[1]-p[1])*thickness/(2*length), dy=(q[0]-p[0])*thickness/(2*length)
    ink.quad(onFace(f,p[0]+dx,p[1]+dy,.171),onFace(f,p[0]-dx,p[1]-dy,.171),
      onFace(f,q[0]-dx,q[1]-dy,.171),onFace(f,q[0]+dx,q[1]+dy,.171))
  }
  hours.forEach((label,h) => {
    const a=h*Math.PI/6, c=Math.cos(a), s=Math.sin(a)
    const pt=(u:number,v:number):XY=>[c*u+s*v,dialZ-s*u+c*v]
    for (let i=0;i<label.length;i++) {
      const u=(i-(label.length-1)/2)*.032, character=label[i]
      if (character==='I') stroke(pt(u,.330),pt(u,.403),.009)
      else {
        stroke(pt(u-.014,.403),pt(u+(character==='X'?.014:0),.330),.008)
        stroke(pt(u+.014,.403),pt(u-(character==='X'?.014:0),.330),.008)
      }
    }
  })
  // A fixed display time keeps the two faces consistent from either approach.
  stroke([0,dialZ],[-.14,dialZ+.13],.027)
  stroke([0,dialZ],[.14,dialZ+.255],.019)
  flatShape(ink,f,arc(0,dialZ,.031,0,360,7).slice(0,-1),.176)
}
await writeModel('dc-au-class-of-1992-clock', finishGlb('Class of 1992 Clock', [
  {part:iron,material:finish('painted-iron',0x38413f)},
  {part:bronze,material:finish('bronze-trim',0x80735b)},
  {part:enamel,material:finish('window-clock-dial',0xf3ddab)},
  {part:ink,material:finish('clock-hands-and-numerals',0x2b2b29)},
], {}))
