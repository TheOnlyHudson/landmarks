/**
 * Factual cross-check (building identity/floor labels only):
 * https://map-american.university-tour.com/mckinley-dollhouse
 * Tour illustrations and photos are not geometry evidence.
 * McKinley Building, American University. The anchor, the angle of its L-shaped
 * historic wings, the curved corner and the infill limits follow the May 2026
 * OpenStreetMap outline (way 90190512), rotated 34 degrees from north:
 * https://www.openstreetmap.org/way/90190512
 * Historic entrance: Dual64bit, CC BY-SA 3.0
 * https://commons.wikimedia.org/wiki/File:AU_McKineyHall_ACC.jpeg
 * Building after renovation: Herrperry123, CC BY-SA 4.0
 * https://commons.wikimedia.org/wiki/File:McKinley_Building_today.jpg
 * SAH describes the two arcaded flanks and colonnaded, copper-domed rotunda:
 * https://sah-archipedia.org/buildings/DC-01-NW37
 * DLR Group documents the glazed entrance on the quad; AU confirms the
 * retained dome. Their photographs are look-only (no reuse terms supplied).
 * https://www.dlrgroup.com/work/american-university-soc/
 * https://www.american.edu/about/sustainability/buildings/mckinley-building.cfm
 * The three-story infill, new stair tower and patinated-metal cladding are
 * documented at https://www.homeanddesign.com/2018/12/21/change-agent/ .
 * Above the common 118.65 m ground reference, the historic roofs rise from
 * 14.5 m at the cornices to 18.5 m on their ridges. The infill main roof
 * is 15.7 m. The copper dome reaches 21.0 m. The spandrels, window rhythm,
 * upper roof surfaces and obscured return facades are simplified.
 * Roof elevations measured from DC OCTO's 2022 lidar (NOAA Digital Coast
 * dataset 9837), via the 1 m building DSM and DEM derivatives at
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/tree/456fd09d67aae857907e8c2b7fa6c19332734bd5
 */
import { Part, type V3 } from './mesh'
import { PALETTE } from './palette'
import { arc, arcCap, arcPanel, arcWall, cbox, column, grow, hip, panel, qf, rect, save, tf, type Rect, type Side } from './dc-white-house'
import { lathe, pslab } from './dc-nga-west'

const stone = new Part(), trim = new Part(), window = new Part()
const roof = new Part(), copper = new Part(), glass = new Part()
const horizontal = rect(-24.25, 12.35, -19.25, -0.1)
const vertical = rect(0.15, 19.18, -12.25, 24.35)
const cx = 12.34, cy = -12.20

function wing(r: Rect) {
  cbox(stone,r,0,13.95)
  cbox(trim,grow(r,0.11),2.76,3.03,{b:0.06})
  cbox(trim,grow(r,0.17),12.38,12.65,{b:0.04})
  cbox(trim,grow(r,0.26),13.43,14.06,{b:0.12})
  cbox(stone,grow(r,-0.08),14.06,14.52,{top:roof})
}

// The wings stop short of the colonnade. Shorter return walls connect them
// to the recessed entrance behind the outer arc of columns.
wing({...horizontal,x1:cx-3.2})
wing({...vertical,y0:cy+3.2})
cbox(stone,rect(cx-4,cx+3.1,cy-3.1,cy+4),0,13.85)
const arcStart = -118, arcEnd = 28
const sector = (r: number) => [[cx,cy] as [number,number],...arc(cx,cy,r,arcStart,arcEnd,24)]
pslab(stone,sector(5.48),0,1.35,0.10)
lathe(stone,cx,cy,[[4.05,1.28],[4.05,13.89]],36)
for (const a of [-98,-63,-28,7]) {
  const rad = a*Math.PI/180
  column(trim,cx+5.94*Math.cos(rad),cy+5.94*Math.sin(rad),0.52,1.35,12.42,12)
}
lathe(trim,cx,cy,[[6.70,12.36],[6.94,12.68],[6.94,13.75],[7.12,13.87],[7.12,14.19],[6.78,14.27]],36)
lathe(stone,cx,cy,[[6.57,14.23],[6.57,15.09],[6.73,15.20],[6.73,15.46]],36)
lathe(copper,cx,cy,[[6.72,15.44],[6.82,15.69],[6.58,16.2],[6.22,17.25],[5.55,18.45],[4.56,19.54],[3.15,20.42],[1.60,21.02],[0.33,21.22]],40)
lathe(copper,cx,cy,[[0.48,21.22],[0.40,21.34],[0.2,21.42]],16)
// Each original wing has a raised, flat-topped ridge about 4 m above its
// eaves. Its width and offset follow the lidar cells above 17.5 m.
hip(roof,rect(-23.72,9.62,-18.47,-0.55),14.51,18.42,4.55,roof,6.18)
hip(roof,rect(0.72,18.53,-7.13,23.76),14.51,18.56,6.14,roof,6.28)
// A sequence of annular treads leaves the full radial stair visible around
// the colonnade. The lower body stops behind the upper landing.
for (let i=0;i<6;i++) {
  const outer=7.10-0.27*i, inner=outer-0.27, z=(i+1)*0.225
  arcWall(trim,cx,cy,outer,-107,17,18,z-0.225,z)
  arcCap(trim,cx,cy,inner,outer,-107,17,18,z)
}
arcCap(trim,cx,cy,3.89,5.48,-107,17,18,1.35)
// Glazed vestibule and stone transom are visible in the openings between
// the rotunda columns. This geometry sits on the inner radius of the porch.
for (const a of [-80,-45,-10]) {
  arcPanel(trim,cx,cy,4.05,a,2.02,1.35,7.02,0.045)
  arcPanel(window,cx,cy,4.05,a,1.69,1.40,4.84,0.080)
  arcPanel(trim,cx,cy,4.05,a,0.10,1.40,4.84,0.104)
  arcPanel(window,cx,cy,4.05,a,1.54,5.11,6.66,0.080)
}

function archedBay(side: Side, at: number, along: number, width=2.55) {
  const ns=side==='n'||side==='s'
  const sign=side==='n'||side==='e'?1:-1
  const normal: V3=ns?[0,sign,0]:[sign,0,0]
  const point=(d:number,h:number,offset:number):V3=>ns?[along+d,at+sign*offset,h]:[at+sign*offset,along+d,h]
  const r=width/2, spring=10.31
  panel(window,side,at,along-r,along+r,4.1,spring,0.08)
  for(let i=0;i<8;i++){
    const a=Math.PI*i/8,b=Math.PI*(i+1)/8
    const p=(t:number,w:number,offset:number)=>point(w*Math.cos(t),spring+w*Math.sin(t),offset)
    tf(window,point(0,spring,0.08),p(a,r,0.08),p(b,r,0.08),normal)
    qf(trim,p(a,r,0.10),p(a,r+0.21,0.10),p(b,r+0.21,0.10),p(b,r,0.10),normal)
  }
  panel(trim,side,at,along-r-0.23,along+r+0.23,3.89,4.13,0.12)
  panel(trim,side,at,along-r,along+r,8.07,8.26,0.12)
  panel(trim,side,at,along-.055,along+.055,4.1,spring,0.13)
  panel(trim,side,at,along-r,along+r,spring-.07,spring+.08,0.12)
  panel(window,side,at,along-r+0.18,along+r-0.18,0.81,2.28)
}
for (const x of [-21.3,-16.75,-12.2,-7.65,-3.10,1.45,6]) archedBay('s',horizontal.y0,x)
for (const y of [-5.75,-1.19,3.37,7.93,12.49,17.05,21.61]) archedBay('e',vertical.x1,y)
for (const x of [3.65,9.65,15.65]) archedBay('n',vertical.y1,x,3.05)
for (const y of [-16,-9.7,-3.4]) archedBay('w',horizontal.x0,y,3.05)

// The inserted three-storey building occupies the inside corner of the L.
// The lidar grid contains a low roof at x=-8..0 on the lower south
// part of the infill. Its 12 m terrace sits below the 15.7 m copper rim.
const infillShape: [number,number][]=[
  [-16.35,-0.25],[-8.05,-0.25],[-8.05,5.5],[0.12,5.5],[0.12,16.35],[-16.35,16.35],
]
pslab(copper,infillShape,0,15.68,0.08,roof)
cbox(copper,rect(-8.10,0.12,-0.25,5.55),0,11.99,{b:0.05,top:roof})
const stair=rect(-21.9,-16.32,-2.60,0.10)
cbox(stone,stair,0,15.88,{top:roof})
panel(glass,'n',16.35,-15.65,-7.18,2.55,11.55)
panel(glass,'n',16.35,-6.43,-0.50,0.50,12.54)
panel(glass,'w',-16.35,0.53,15.50,2.55,11.55)
for (const z of [5.32,8.41]) {
  panel(copper,'n',16.35,-15.65,-0.50,z,z+0.27,0.09)
  panel(copper,'w',-16.35,0.53,15.50,z,z+0.27,0.09)
}
for (const x of [-13.6,-11.6,-9.6,-5.1,-2.88]) panel(trim,'n',16.35,x,x+0.10,2.55,11.55,0.11)
for (const y of [2.9,5.7,8.5,11.3,14.1]) panel(trim,'w',-16.35,y,y+0.10,2.55,11.55,0.11)

await save('dc-au-mckinley-building','McKinley Building',[
  {part:stone,material:PALETTE.stone},{part:trim,material:PALETTE.trim},
  {part:roof,material:PALETTE.roof},{part:copper,material:PALETTE.copper},
  {part:glass,material:PALETTE.glass},{part:window,material:PALETTE.window},
],{osm:'way/90190512',bearing:34})
