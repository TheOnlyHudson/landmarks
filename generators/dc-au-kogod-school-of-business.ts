/**
 * Kogod School of Business, American University. The former John Sherman
 * Myers Law Building, a short linking bay and a second pavilion span 81 m
 * along the campus grid. Plan extents and the right-angled returns were
 * measured from the May 2026 OSM outline, way 90190738, in a 34-degree frame.
 * https://www.openstreetmap.org/way/90190738
 *
 * Former south building: Senordesupremo (public domain), 2006
 * https://commons.wikimedia.org/wiki/File:Kogod.JPG
 * Massachusetts Avenue end: Ser Amantio di Nicolao, CC BY-SA 3.0, 2019
 * https://commons.wikimedia.org/wiki/File:Kogod_School_of_Business_at_American_University.jpg
 * Quad context: Herrperry123, CC BY-SA 4.0
 * https://commons.wikimedia.org/wiki/File:Eric_Freidheim_Quadrangle.jpg
 * Hartman-Cox documents the traditional-style addition, link and conversion
 * of the adjoining building. AU's history identifies the former law school.
 * https://www.hartmancox.com/kogod-school-of-business-addition
 * https://www.american.edu/events/inauguration/history-walk/11.cfm
 * The north portico faces the approach from Massachusetts Avenue. Its rounded
 * segment, entrance landing, window grouping and surrounds are stylised.
 * The common 117.81 m ground datum puts the lower roofs near 10.5–11.4 m,
 * parapets at 12.7 m, and the distinctive north rooftop enclosure at 15.9 m.
 * Internal partitions and materials inside the enclosure were not verified.
 * The bays and exterior finishes are estimates. Architect photos are look-only.
 * Roof elevations measured from DC OCTO's 2022 lidar (NOAA Digital Coast
 * dataset 9837), via the 1 m building DSM and DEM derivatives at
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/tree/456fd09d67aae857907e8c2b7fa6c19332734bd5
 */
import { Part } from './mesh'
import { PALETTE } from './palette'
import { arc, cbox, column, grow, panel, rect, save, wallRing, type Rect, type Side } from './dc-white-house'
import { pslab, type XY } from './dc-nga-west'

const stone=new Part(), trim=new Part(), roof=new Part(), window=new Part(), door=new Part()
function pavilion(r:Rect,eaves:number) {
  cbox(stone,r,0,eaves-0.52,{top:false})
  cbox(trim,grow(r,0.11),0.84,1.14,{b:0.06})
  cbox(trim,grow(r,0.12),eaves-1.55,eaves-1.29,{b:0.06})
  cbox(stone,grow(r,0.05),eaves-0.52,eaves-0.2)
  cbox(trim,grow(r,0.17),eaves-0.20,eaves,{b:0.07,top:roof})
  wallRing(stone,grow(r,-0.04),0.28,eaves,eaves+0.35)
}

// The two terminal bays project 2.3 m beyond the recessed quad elevation.
const old=rect(-10.02,10.27,-37.48,8.38),eaves=11.28
pavilion(old,eaves)
for(const [lo,hi] of [[-37.48,-21.1],[-7.83,8.38]]) {
  pavilion(rect(10.20,12.56,lo,hi),eaves)
}
// Former lecture building and connecting wing of the 2009 expansion.
const north=rect(-15.03,10.50,17.59,35.43)
pavilion(north,11.95)
const link=rect(-6.42,8.41,8.36,17.61)
pavilion(link,10.58)

// The lidar shows a raised rectangular screen atop the former lecture hall,
// with a broad core and an open gap along its east edge.
cbox(roof,rect(-3.72,3.53,21.26,33.95),12.21,15.86,{b:0.12})
cbox(stone,rect(-10.68,7.25,20.95,22.05),12.21,15.79,{b:0.08,top:roof})
cbox(stone,rect(6.57,7.26,21.94,34.52),12.21,15.82,{b:0.08,top:roof})
cbox(stone,rect(-4.89,7.24,33.64,34.57),12.21,15.83,{b:0.08,top:roof})

function lights(side:Side,at:number,along:number,width:number,base=1.43,head=9.49) {
  const a0=along-width/2,a1=along+width/2
  panel(window,side,at,a0,a1,base,head)
  panel(trim,side,at,a0-0.16,a1+0.16,base-0.18,base+0.03,0.12)
  panel(stone,side,at,a0,a1,base+(head-base)*0.46,base+(head-base)*0.46+0.29,0.10)
  panel(trim,side,at,along-0.055,along+0.055,base,head,0.12)
}
for (const y of [-34.55,-29.32,-24.12,-4.92,0.28,5.52]) lights('e',12.56,y,3.05)
for (const y of [-18.32,-14.45,-10.54]) lights('e',10.27,y,2.63)
for (const y of [-34.8,-29.1,-23.4,-17.7,-12,-6.3,-0.6,5.1]) lights('w',-10.02,y,3.12)
for (const y of [10.81,15.14]) {
  lights('e',8.41,y,2.9,1.4,8.81)
  lights('w',-6.42,y,2.9,1.4,8.81)
}
for (const y of [20.49,25.99,31.49]) {
  lights('e',10.5,y,3.5,1.34,10.06)
  lights('w',-15.03,y,3.5,1.34,10.06)
}

// The older quad-end porch is a shallow rectangle within the mapped
// projection. Three broad front openings are recessed behind its columns.
for (const x of [-3.35,1.48,6.28]) panel(door,'s',-37.48,x-1.08,x+1.08,1.01,4.31)
for (const x of [-8.11,9.39]) lights('s',-37.48,x,2.25)
for (let i=0;i<4;i++) cbox(trim,rect(-5.92,8.82,-41.40+i*0.32,-37.47),i*0.23,0.23+i*0.23)
for (const x of [-5.17,-0.68,3.59,8.02]) column(trim,x,-39.98,0.39,0.92,8.93,12)
cbox(stone,rect(-5.98,8.86,-41.17,-37.44),8.93,10.15,{b:0.11})
cbox(trim,rect(-6.06,8.94,-41.24,-37.42),10.15,10.47,{b:0.12,top:roof})

// The bowed entablature spans the north doors. A circular segment with a
// rear chord gives the colonnade a shallow middle projection at the entrance.
const centerX=-2.23,centerY=27.52
function bow(radius:number):XY[] {
  const curve=arc(centerX,centerY,radius,48,132,16)
  return [[curve[0][0],35.34],...curve,[curve.at(-1)![0],35.34]]
}
for (let i=0;i<5;i++) pslab(trim,bow(11.54-i*0.23),i*0.19,(i+1)*0.19,0.04)
for (const degrees of [51,77,103,129]) {
  const theta=degrees*Math.PI/180
  column(trim,centerX+10.74*Math.cos(theta),centerY+10.74*Math.sin(theta),0.48,0.95,9.82,16)
}
pslab(stone,bow(11.36),9.77,11.39,0.10)
pslab(trim,bow(11.50),11.36,11.67,0.095,roof)
for (const x of [-6.10,-2.23,1.64]) {
  panel(door,'n',35.43,x-1.16,x+1.16,1.02,4.05,0.08)
  panel(window,'n',35.43,x-1.16,x+1.16,4.34,8.94)
}
for (const x of [-12.31,7.84]) lights('n',35.43,x,3.18,1.36,9.92)

await save('dc-au-kogod-school-of-business','Kogod School of Business',[
  {part:stone,material:PALETTE.stone},{part:trim,material:PALETTE.trim},
  {part:roof,material:PALETTE.roof},{part:window,material:PALETTE.window},
  {part:door,material:PALETTE.entrance},
],{osm:'way/90190738',bearing:34})
