/**
 * Abraham S. Kay Spiritual Life Center, American University. Local coordinates
 * east/north/up, metres. The base follows OSM way 90191072 (May 2026 extract)
 * https://www.openstreetmap.org/way/90191072 . The southwest steps and
 * the inset doors face the central quad. The curved returns and offset of the
 * upper drum are derived from the circular arcs in that footprint.
 *
 * AU's history describes the two levels, five narrow Creation windows on the
 * northern wall, smaller side windows and the 16-foot gilded bronze flame:
 * https://www.american.edu/student-affairs/kay/kay-history.cfm
 * Distant quad view: Herrperry123, CC BY-SA 4.0,
 * https://commons.wikimedia.org/wiki/File:Eric_Freidheim_Quadrangle.jpg .
 * In the local frame, the lower roof median is 4.95 m above a common 119.92 m
 * ground reference and the center roof rises to 12.55 m. The narrow flame
 * was not captured by the raster, so its published height is added on top.
 * Roof elevations measured from DC OCTO's 2022 lidar (NOAA Digital Coast
 * dataset 9837), via the 1 m building DSM and DEM derivatives at
 * https://github.com/kameronlee/heat-aware-pedestrian-routing/tree/456fd09d67aae857907e8c2b7fa6c19332734bd5
 * Steps, door grouping, and width and twist of the
 * flame elements are estimates. The flame is an abstract impression. The
 * illuminated night-time flame is documented in the AU tour gallery caption:
 * https://stagefive.qa.app.adoraexperiences.com/american-university/gallery .
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { arcCap, arcPanel, arcWall, save } from './dc-white-house'
import { circle, lathe, pslab, type XY } from './dc-nga-west'

const stone = new Part(), roof = new Part(), glass = new Part(), gold = new Part(), trim = new Part()
const base: XY[] = [
  [14.6,-4.8],[14,-7.2],[12.9,-7],[10.8,-11.3],[6.1,-8.3],[4.3,-10],[2.9,-10.9],
  [0.5,-11.6],[-1.1,-11.7],[-1.2,-15.8],[-3.8,-15.6],[-6.4,-14.9],[-9.3,-13.2],
  [-10.9,-11.9],[-12.5,-9.9],[-14,-7.2],[-10.4,-5.4],[-10.9,-3.8],[-11.1,-1.3],
  [-10.9,0.4],[-9.9,2.7],[-14.6,5.5],[-13.2,7.6],[-11.4,9.3],[-12,10.2],
  [-7.8,12.8],[-3,14.1],[1.9,13.8],[4.3,13.1],[6.5,12.1],[10.4,9],[13.2,4.9],[14.7,0.2],
]
const cx = -0.9, cy = -1.2
// On the quad the low perimeter roof extends past the inset entrance.
const recessedBase: XY[] = base.map(([x,y]) => {
  const a = (Math.atan2(y-cy,x-cx)*180/Math.PI+360)%360
  const dist = Math.hypot(x-cx,y-cy)
  return a>203 && a<270 && dist>10.6 ? [cx+(x-cx)*10.6/dist,cy+(y-cy)*10.6/dist]:[x,y]
})
pslab(stone,recessedBase,0,4.68,0.04)
pslab(trim,base,4.67,4.96,0.08,roof)
lathe(stone,cx,cy,[[10.62,4.88],[10.62,10.93],[10.57,11.12]],48)
lathe(trim,cx,cy,[[10.56,10.95],[10.82,11.01],[10.82,11.23],[10.62,11.34]],48)
lathe(roof,cx,cy,[[10.62,11.33],[8.2,11.63],[4.2,12.12],[0.97,12.52]],48)
for (const angle of [66,78,90,102,114]) arcPanel(glass,cx,cy,10.62,angle,0.74,5.32,10.75)
for (const angle of [-24,155]) arcPanel(glass,cx,cy,10.62,angle,0.68,5.69,10.40)
for (const angle of [220,230,240,250,260]) arcPanel(glass,cx,cy,10.6,angle,1.52,1.0,4.34)
for (let i = 0; i < 5; i++) {
  const radius = 15.05 - 0.78 * i, z = 1.07 + 0.16 * i
  arcWall(trim, cx, cy, radius, 205, 264, 12, z - 0.16, z)
  arcCap(trim, cx, cy, 10.2, radius, 205, 264, 12, z)
}

// Four overlapping, bending bronze leaves. Each is a closed loft with a
// tapering elliptical section which keeps the gaps legible from above.
function flameLeaf(azimuth: number, reach: number, height: number, lean: number) {
  const angle = azimuth * Math.PI / 180, dx = Math.cos(angle), dy = Math.sin(angle)
  const stages: [number,number,number,number][] = [
    [0,0.10,0.27,0], [0.30,0.37,0.64,0.08], [0.56,0.83,0.48,0.16],
    [0.80,1.0,0.25,0.34], [1,lean,0.025,0.50],
  ]
  const sections = stages.map(([t,r,w,twist]) => circle(0,0,1,8).map(([u,v]): V3 => [
    cx + dx*r*reach - dy*(u*w + twist) + dx*v*w*0.26,
    cy + dy*r*reach + dx*(u*w + twist) + dy*v*w*0.26,
    12.52+t*height,
  ]).reverse())
  gold.loft(sections)
  gold.cap(sections.at(-1)!,true)
}
flameLeaf(15,1.43,4.88,0.67)
flameLeaf(116,1.20,3.72,0.65)
flameLeaf(204,1.43,3.19,0.84)
flameLeaf(294,0.98,4.22,0.58)

await save('dc-au-kay-spiritual-life-center','Kay Spiritual Life Center',[
  {part:stone,material:PALETTE.stone},{part:trim,material:PALETTE.trim},
  {part:roof,material:PALETTE.roof},{part:glass,material:PALETTE.window},
  {part:gold,material:{...finish('gold-leaf-bronze',0xc6a157,0.37),floodlight:()=>0.93}},
],{osm:'way/90191072',bearing:0})
