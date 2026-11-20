/**
 * Factual cross-check (building identity/floor labels only):
 * https://map-american.university-tour.com/school-of-international-service-dollhouse
 * Tour illustrations and photos are not geometry evidence.
 * American University School of International Service, Washington, DC.
 * Original procedural model by Salty Pancakes and OpenAI Codex (GPT-6).
 * At the original placement and bearing, the May 2026 OSM boundary is
 * relation/914201, outer way/48082911. The indented stair slot and offset
 * street pavilion follow that boundary. The bowed street face is below the
 * resolution of the footprint.
 * https://www.openstreetmap.org/relation/914201
 * https://www.openstreetmap.org/way/48082911
 *
 * Jeff Watts / American University, CC BY-SA 3.0, oblique aerial:
 * https://commons.wikimedia.org/wiki/File:American_University_School_of_International_Service_building.jpg
 * Herrperry123, CC BY-SA 4.0, formal entrance and solar shades:
 * https://commons.wikimedia.org/wiki/File:School_of_International_Service_Building.jpg
 * AU describes fixed exterior shades, a multilevel atrium, solar hot water,
 * and 3,230 square feet (300 m²) of photovoltaics:
 * https://www.american.edu/about/sustainability/buildings/school-of-international-service.cfm
 *
 * Roof elevations use DC OCTO's 2022 lidar, NOAA Digital Coast 9837. DSM and
 * bare-earth DEM derivatives are archived at:
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/tree/456fd09d67aae857907e8c2b7fa6c19332734bd5
 * Measured above the 118.96 m ground tenth percentile: 14.1 m main roof,
 * 15.4–15.7 m center clerestory, 18.5–18.8 m southwest rooftop structure,
 * and a raised transverse portion at 19.8 m. Glazing divisions, shadow-box
 * depths, array distribution, and fittings are estimated from the two views.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { block, cbox, panel, rect, save, wallRing, type Rect, type Side } from './dc-white-house'

const masonry = new Part(), glazing = new Part(), bronze = new Part()
const roof = new Part(), skylight = new Part(), collectors = new Part()
const parapet = 14.30

function wing(r: Rect, height: number) {
  cbox(masonry,r,0,height-0.22,{c:0.12,b:0.06,top:roof})
  wallRing(masonry,r,0.27,height-0.22,height)
}

wing(rect(-15.6,-3.5,-31.15,26.84),14.26)
wing(rect(1.8,16.65,-31.15,18.62),parapet)
wing(rect(1.8,14.62,18.62,26.62),14.18)
wing(rect(-0.27,16.52,26.62,39.95),14.28)
cbox(glazing,rect(-3.5,1.8,-31.15,26.62),0,14.34)
cbox(glazing,rect(-3.5,-0.27,26.6,33.10),0,14.39)

// Roof monitors have different heights on the campus wing and central spine.
cbox(roof,rect(-13.65,-3.70,-23.63,4.98),14.03,18.59,{b:0.15})
cbox(bronze,rect(-13.46,-3.91,-14.20,-9.03),18.51,19.76,{b:0.08,top:roof})
for (const side of ['w','e'] as const) {
  const x = side === 'w' ? -13.65 : -3.70
  for (const y of [-22.55,-16.26,-7.95,-1.85]) {
    panel(skylight,side,x,y,y+4.48,16.08,18.14)
  }
}
for (const [y0,y1,h] of [[-27.6,18.8,15.72],[18.8,33.2,15.92]]) {
  const x0=-3.95,x1=2.18
  cbox(skylight,rect(x0+.29,x1-.29,y0,y1),14.10,h-.39)
  const lid=(d:number):V3[]=>[[x0,y0,h+d],[x1,y0,h-.46+d],[x1,y1,h-.46+d],[x0,y1,h+d]]
  bronze.loft([lid(-.20),lid(0)])
  roof.cap(lid(0),true)
  bronze.cap(lid(-.20),false)
}

// Keep the gaps between collector racks visible. Six parallel racks
// of rectangular modules approximate the published collector surface area.
function solarRack(x0:number,x1:number,y0:number,y1:number,base:number) {
  const section=(x:number,y:number):V3=>[x,y,base+.13+.52*(y-y0)/(y1-y0)]
  for (let n=0;n<3;n++) {
    const a=x0+(x1-x0)*n/3+.045,b=x0+(x1-x0)*(n+1)/3-.045
    const deck=[section(a,y0),section(b,y0),section(b,y1),section(a,y1)]
    collectors.loft([deck.map(([x,y]):V3=>[x,y,base+.04]),deck])
    collectors.cap(deck,true)
  }
}
for(const y of [-28.7,-18.85,-9.0,.85]) solarRack(4.4,12.48,y,y+8.49,14.08)
for(const y of [8.1,12.1]) solarRack(-13.12,-9.04,y,y+3.6,14.04)

// The southeast glazing and its slight bow turn together around the bays.
const bowStart=-9.4,bowLength=20,segments=16
const curve=(i:number):[number,number]=>[16.65+1.03*Math.sin(Math.PI*i/segments),bowStart+bowLength*i/segments]
const corner=(i:number,height:number,advance=0):V3=>{const [x,y]=curve(i);return [x+advance,y,height]}
for(let i=0;i<segments;i++){
  masonry.quad(corner(i,0),corner(i+1,0),corner(i+1,parapet),corner(i,parapet))
  roof.quad([16.59,curve(i)[1],parapet],corner(i,parapet),corner(i+1,parapet),[16.59,curve(i+1)[1],parapet])
}

function bays(side:Side,face:number,start:number,end:number,count:number,sill:number,head:number,shaded=false){
  const pitch=(end-start)/count
  for(let i=0;i<count;i++){
    const a=start+pitch*i+.38,b=start+pitch*(i+1)-.38,m=(a+b)/2
    panel(glazing,side,face,a,b,sill,head)
    panel(bronze,side,face,m-.055,m+.055,sill,head,.07)
    if(shaded) block(bronze,side,face,a-.09,b+.09,head-.08,head+.10,.70)
  }
}
for(const z of [4.10,7.48,10.86]){
  const top=z+2.47
  bays('e',16.65,-30.7,-9.65,4,z,top,true)
  bays('e',16.65,10.89,18.23,2,z,top)
  bays('e',16.52,27.06,39.50,3,z,top,true)
  bays('w',-15.6,-30.77,26.39,10,z,top)
  bays('n',26.84,-15.23,-3.88,3,z,top,true)
  bays('s',-31.15,-15.2,-3.9,3,z,top)
  bays('s',-31.15,2.18,16.26,3,z,top,true)
  // The fourth segment in each group is a masonry pier.
  for(let i=0;i<segments;i++) if(i%4!==3){
    glazing.quad(corner(i,z,.045),corner(i+1,z,.045),corner(i+1,top,.045),corner(i,top,.045))
  }
}

// A dark frame picks out the stair opening where the avenue pavilion
// steps back. Glazing folds around the corner of the otherwise solid end wall.
panel(glazing,'n',39.95,1.02,4.43,2.32,13.94)
panel(glazing,'w',-.27,33.45,39.48,2.62,13.94)
panel(glazing,'e',14.62,18.83,26.39,1.62,13.93)
for(const z of [5.37,8.75,12.13]){
  block(bronze,'n',39.95,.92,4.53,z,z+.20,.21)
  block(bronze,'w',-.27,33.41,39.55,z,z+.20,.21)
  block(bronze,'e',14.62,18.73,26.52,z,z+.20,.30)
}
for(const y of [18.84,26.02]) cbox(bronze,rect(14.62,15.44,y,y+.40),2.0,14.73,{b:.06})
cbox(bronze,rect(14.58,15.48,18.82,26.43),14.26,14.72,{b:.08,bottom:true})
cbox(bronze,rect(-4.26,1.88,32.61,34.58),14.51,15.07,{b:.08,bottom:true})
cbox(bronze,rect(-4.23,-3.81,33.58,34.40),1.31,14.63)
panel(glazing,'n',33.1,-3.28,-.46,1.32,12.99)
for(const z of [4.81,8.26,11.64]) block(bronze,'n',33.10,-3.46,-.27,z,z+.17,.18)
bays('e',16.65,-21.50,-10.14,2,1.02,3.06)
bays('e',16.52,27.35,39.18,3,1.28,3.24)

await save('dc-school-of-international-service','School of International Service',[
  {part:masonry,material:PALETTE.stone},{part:glazing,material:PALETTE.window},
  {part:bronze,material:finish('bronze-sunshades',0x826754)},
  {part:roof,material:finish('light-roof',0xc7c7bf)},{part:skylight,material:PALETTE.glass},
  {part:collectors,material:finish('solar-collector',0x565f65)},
],{bearing:34,osm:'relation/914201',outer:'way/48082911'})
