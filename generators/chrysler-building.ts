/**
 * Chrysler Building (1930), Manhattan: the setback base and its terraces,
 * the white-brick shaft with notched corners, the winged radiator caps at
 * the 31st floor and the steel eagles at the 61st, the brick crown arch,
 * the seven stepped stainless-steel arches with their triangular windows, and
 * the needle. Original procedural geometry, CC0-1.0.
 * bun generators/chrysler-building.ts [out.glb]
 *
 * Frame: bearing 29 (the Manhattan grid), so +y runs up Lexington Avenue and
 * +x towards Third Avenue; z up, metres. Anchor -73.9752851, 40.75151.
 *
 * Evidence
 * - OSM way/42500770 (building=tower, Q11274) and its building:parts, which
 *   carry the massing: the base at 15 (the low east and Lexington parts),
 *   50/56, 70, 80 and 90 m; the shaft to 185 (its notched corners) and 199;
 *   the crown base 199-200 with the eagles (way/2609141xx); the arches'
 *   round parts at 227-272 (way/2609040xx), the 282 m pyramidal envelope and
 *   the needle to 319 m (way/196647417). The four winged radiator caps
 *   (way/260904075, 077, 078, 079; 89-91 m) are extruded from OSM's
 *   outlines.
 * - USGS 3DEP lidar NY_NewYorkCity (2017) at 0.5 m
 *   (~/landmarks-scratch/chrysler/lid.json): the setbacks at 80 and 90 m
 *   agree with OSM; the outer base reads 56 m on both the 42nd and 43rd
 *   Street sides, not OSM's 50, so it is 56 here. The tower's returns are
 *   too sparse to read the crown.
 * - Published (Wikipedia): 319 m to the tip, 77 floors (3.66 m a storey),
 *   William Van Alen; eagles at the 61st floor, radiator-cap ornaments at
 *   the 31st; the crown's terraced arches with triangular windows, lit at
 *   night.
 * - Photos (Wikimedia Commons): "Chrysler Building by David Shankbone
 *   Retouched.jpg" (public domain), "Chrysler Building - 05.jpg" (Carlos
 *   Delgado, CC BY-SA 3.0), "Chrysler Building NYC-20090519-RM-094845.jpg"
 *   (Ermell, CC BY-SA 4.0), "Chrysler Building 2011.jpg" (Valfex,
 *   CC BY-SA 4.0), "Chrysler-Building-New-York-September-2014.jpg"
 *   (Acediscovery, CC BY 4.0), "Chrysler Building (1) 01.jpg"
 *   (PortableNYCTours, CC BY-SA 4.0), "Chrysler Building At Night.jpg"
 *   (Russ Allison Loar, CC BY-SA 4.0), "405 Lexington Avenue - Chrysler
 *   Building Entrance.jpg" (Wiki.cullin, CC BY-SA 4.0), "Chrysler Building
 *   September 2024.jpg" and "Chrysler Building 005.jpg" (Kidfly182,
 *   CC BY 4.0).
 *
 * - The crown and spire, from close-ups: "Chrysler Building spire,
 *   Manhattan, by Carol Highsmith (LOC highsm.04444).jpg" (public domain),
 *   "Top of Chrysler Building (New York) (45192884512).jpg" and "Chrysler
 *   Building Top 2 (New York) (45242016331).jpg" (VillageHero, CC BY-SA 2.0),
 *   "Top of the Chrysler Building 405 Lexington Avenue Manhattan (NY) April
 *   2016 (27238721626).jpg" and "... (27272558555).jpg" (Ron Cogswell,
 *   CC BY 2.0), "Chrysler Building Spire.jpg" (Marc Smith, CC BY-SA 2.0),
 *   "Top of the Chrysler Building in New York City (Unsplash).jpg"
 *   (Jonathan Pease, CC0). The crown's silhouette was measured row by row
 *   in the public-domain Shankbone photo, scaled by the crown base's 28.6 m
 *   (OSM), and checked against the lidar's crown returns (see `tiers`).
 *
 * The 2D wireframe check: the model's orthographic outline (long face) laid
 * over the Shankbone photo's traced outline at 11.2 px/m matches within
 * 1 m from the shaft to the needle. It also moved the shaft's setback to
 * 202.5 m (lidar 202-204; OSM 199) and the eagles up to the top of the
 * 61st-floor band at about 211 m, where the photos show them.
 *
 * The face check: the crown rendered face-on at the same scale beside the
 * photo, with a metre ruler. The triangular windows there rise from behind
 * the arch in front of them about 4 m up a band about 7 m tall, so each
 * window starts behind that arch and stops a little over half way. The
 * crown meets the tower in a brick arch that rises seven storeys over the
 * eagles to 238 m; the first steel arch wraps it as a semicircle, its legs
 * running down beside it to the 61st-floor band, and the second arch's legs
 * are the crown's corners, curving over into that arch.
 *
 * The shaft's windows are from the same photo, 145-200 m face on: three
 * columns of paired windows in the middle of each face, joined by grey
 * spandrels, and a horizontal band of windows each storey across the
 * corners. Drawn storey by storey above the 31st floor, since those shapes
 * are the tower; the 3.66 m storey is 77 floors in 282 m.
 *
 * Estimated: the base's window bays (one panel per 4.4 m bay and three
 * storeys, STYLE.md), the shopfront storey, the entrance portals' size (from the
 * entrance photo) and their place on each front; the arches' heights
 * between the measured widths, the lantern's windows, the arch rims. The
 * antenna arms on the lantern (two levels, about 271 and 281 m in the
 * lidar) are left out as too thin. Earlier versions
 * of this model were styled with Apple Maps as a reference; this rework
 * keeps only shapes the sources above show.
 *
 * Night: the crown's triangular windows glow as `window-2`, its arches are
 * floodlit (`_FLOODLIGHT`, rims fully, the steel vaults half), the shaft's
 * windows glow as `window`.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { ccw, earcut } from './nyc-yankee-stadium'

type XY = [number, number]
const CX = -8.4, CY = 7
const spandrel = new Part(), stone = new Part(), glazing = new Part(), roof = new Part(), silver = new Part(), accent = new Part(), rims = new Part(), crownGlass = new Part()
const BEVEL = .4, RECESS = .65, ARC_SEGMENTS = 9
const norm = (v: V3): V3 => { const l = Math.hypot(...v); return v.map(n => n / l) as V3 }
const add = (a: V3, b: V3): V3 => a.map((v, i) => v + b[i]) as V3
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0,y0],[x1,y0],[x1,y1],[x0,y1]]
function quad(p: Part, v: V3[], normals?: V3[]) {
  p.tri(v[0],v[1],v[2],undefined,undefined,undefined,normals?.slice(0,3))
  p.tri(v[0],v[2],v[3],undefined,undefined,undefined,normals && [normals[0],normals[2],normals[3]])
}
function cap(p: Part, xy: XY[], z: number) {
  for(let i=1;i<xy.length-1;i++) p.tri([xy[0][0],xy[0][1],z],[xy[i][0],xy[i][1],z],[xy[i+1][0],xy[i+1][1],z])
}

// A height field of the union removes all the buried walls of overlapping
// blocks. Only visible walls and terraces consume geometry or draw calls.
const masses = [
  [-40.5,-6.6,15,19,15],[15,4.7,19.5,19,15],[-40.5,18.8,23.3,37.5,56],[-40.5,-25.3,11.6,-16,56],[-40.5,-16,12.6,-6.6,56],
  [-34.8,-19,12.6,-6.6,70],[-34.8,18.8,17.4,31.7,70],
  [-32,-16.5,14.1,-6.4,80],[-32,18.8,14.7,29,80],
  [-22.7,-13.4,5.8,-10.7,90],[-22.6,24.2,6,26,90],
  [-22.7,-10.7,6,24.2,185],
  // the 61st-floor band over the shaft's setback, under the eagles (photo: 30.4 m wide, 201.5-211.5 m)
  [-22.7,-8.2,5.9,22.2,211.5],
]
const upper: XY[] = [[-17.8,-10.7],[1,-10.7],[1,-2.9],[6,-2.9],[6,16.4],[.9,16.4],
  [.9,24.2],[-18.1,24.2],[-18.1,16.6],[-22.7,16.6],[-22.7,-2.5],[-17.8,-2.5]]
function inside(x: number, y: number, polygon: XY[]) {
  let hit = false
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
    const a=polygon[i],b=polygon[j]
    if((a[1]>y)!==(b[1]>y) && x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]) hit=!hit
  }
  return hit
}
const xs = [...new Set([...masses.flatMap(m=>[m[0],m[2]]),...upper.map(p=>p[0])])].sort((a,b)=>a-b)
const ys = [...new Set([...masses.flatMap(m=>[m[1],m[3]]),...upper.map(p=>p[1])])].sort((a,b)=>a-b)
const heights = ys.slice(1).map((_,j)=>xs.slice(1).map((_,i)=> {
  const x=(xs[i]+xs[i+1])/2,y=(ys[j]+ys[j+1])/2
  return Math.max(inside(x,y,upper)?202.5:0,...masses.map(m=>x>m[0]&&x<m[2]&&y>m[1]&&y<m[3]?m[4]:0))
}))
type Wall = { a: XY; b: XY; lo: number; hi: number; start: number; end: number }
const walls: Wall[]=[]
function collect(a: XY,b: XY,lo: number,hi: number) {
  if(hi<=lo) return
  // Merge collinear neighbouring cells, so windows don't restart at grid cuts.
  const old=walls.find(w=>w.lo===lo&&w.hi===hi&&w.b[0]===a[0]&&w.b[1]===a[1]&&
    (w.b[0]-w.a[0])*(b[1]-a[1])===(w.b[1]-w.a[1])*(b[0]-a[0]))
  if(old) old.b=b; else walls.push({a,b,lo,hi,start:0,end:0})
}
// Traverse in each face's winding order to make greedy merging deterministic.
for(let j=0;j<heights.length;j++) for(let i=0;i<heights[j].length;i++) collect([xs[i],ys[j]],[xs[i+1],ys[j]],heights[j-1]?.[i]??0,heights[j][i])
for(let j=heights.length-1;j>=0;j--) for(let i=heights[j].length-1;i>=0;i--) collect([xs[i+1],ys[j+1]],[xs[i],ys[j+1]],heights[j+1]?.[i]??0,heights[j][i])
for(let i=xs.length-2;i>=0;i--) for(let j=0;j<heights.length;j++) collect([xs[i+1],ys[j]],[xs[i+1],ys[j+1]],heights[j][i+1]??0,heights[j][i])
for(let i=0;i<xs.length-1;i++) for(let j=heights.length-1;j>=0;j--) collect([xs[i],ys[j+1]],[xs[i],ys[j]],heights[j][i-1]??0,heights[j][i])

// Convex corners with matching stage heights get a real smooth-shaded chamfer.
const corners: {at:XY; a:XY; b:XY; z:number}[]=[]
for(const a of walls) for(const b of walls) {
  if(a===b||a.lo!==b.lo||a.hi!==b.hi||a.b[0]!==b.a[0]||a.b[1]!==b.a[1]) continue
  const da=[a.b[0]-a.a[0],a.b[1]-a.a[1]],db=[b.b[0]-b.a[0],b.b[1]-b.a[1]]
  if(da[0]*db[1]-da[1]*db[0]<=0) continue
  const la=Math.hypot(...da),lb=Math.hypot(...db),w=Math.min(BEVEL,la*.2,lb*.2)
  a.end=w;b.start=w
  const p:XY=[a.b[0]-da[0]/la*w,a.b[1]-da[1]/la*w],q:XY=[b.a[0]+db[0]/lb*w,b.a[1]+db[1]/lb*w]
  const na:V3=[da[1]/la,-da[0]/la,0],nb:V3=[db[1]/lb,-db[0]/lb,0]
  quad(stone,[[...p,a.lo],[...q,a.lo],[...q,a.hi-BEVEL],[...p,a.hi-BEVEL]],[na,nb,nb,na])
  corners.push({at:a.b,a:p,b:q,z:a.hi})
}

/** Punched windows, as slate panels on the brick: one panel per bay and
 * three storeys (STOREY 3.66 m: 77 floors in 282 m), the brick showing
 * between bays and between groups as piers and spandrels (STYLE.md). The
 * shopfront storey is one tall panel per bay. Flush, 0.06 m proud. */
const STOREY=3.66,GROUP=3*STOREY,BAY=4.4
function facade(at:(s:number,d:number,z:number)=>V3,l:number,r:number,lo:number,top:number) {
  const width=r-l,n=Math.round(width/BAY)
  if(n<1||top-lo<4) return
  const pitch=width/n,pw=Math.min(pitch*.44,2)
  let z=lo
  if(lo===0) { // shopfronts
    for(let k=0;k<n;k++){const c=l+pitch*(k+.5);quad(glazing,[at(c-pitch*.36,.06,.6),at(c+pitch*.36,.06,.6),at(c+pitch*.36,.06,5.6),at(c-pitch*.36,.06,5.6)])}
    z=6.6
  }
  const rows=Math.floor((top-.8-z)/GROUP)
  if(rows<1) { // a short storey band under a terrace: one row of single-storey windows
    if(top-z<2.6) return
    for(let k=0;k<n;k++){const c=l+pitch*(k+.5);quad(glazing,[at(c-pw/2,.06,z+.7),at(c+pw/2,.06,z+.7),at(c+pw/2,.06,top-.9),at(c-pw/2,.06,top-.9)])}
    return
  }
  const g=(top-.8-z)/rows
  for(let j=0;j<rows;j++) {
    const z0=z+j*g+1.3,z1=z+(j+1)*g-.9
    for(let k=0;k<n;k++){const c=l+pitch*(k+.5);quad(glazing,[at(c-pw/2,.06,z0),at(c+pw/2,.06,z0),at(c+pw/2,.06,z1),at(c-pw/2,.06,z1)])}
  }
}
/** The shaft's four faces, as in the Shankbone photo (145-200 m, face on):
 * the middle of each face, the part that rises to 202.5 m, has three
 * columns of paired windows, each pair 2.9 m wide on a 4.9 m pitch with
 * white piers between; the corners, out to that middle part, have the
 * famous horizontal bands, a dark ribbon of windows each storey running to
 * the corner. Above the 31st-floor setback (90 m) each storey is drawn,
 * since the shapes are what make the tower; below it, between the wings,
 * each pair spans three storeys. `c0`, `c1`: the corner zones' widths. */
const SHAFT:{a:XY;b:XY;c0:number;c1:number}[]=[
  {a:[-22.7,-10.7],b:[6,-10.7],c0:4.9,c1:5},
  {a:[6,-10.7],b:[6,24.2],c0:7.8,c1:7.8},
  {a:[6,24.2],b:[-22.7,24.2],c0:5.1,c1:4.6},
  {a:[-22.7,24.2],b:[-22.7,-10.7],c0:7.6,c1:8.2},
]
const onPlane=(w:Wall,f:typeof SHAFT[0])=>{
  const ex=f.b[0]-f.a[0],ey=f.b[1]-f.a[1],L=Math.hypot(ex,ey)
  const off=(p:XY)=>((p[0]-f.a[0])*ey-(p[1]-f.a[1])*ex)/L
  const wx=w.b[0]-w.a[0],wy=w.b[1]-w.a[1]
  return Math.abs(off(w.a))<.01&&Math.abs(off(w.b))<.01&&wx*ex+wy*ey>0
}
for(const f of SHAFT) {
  const L=Math.hypot(f.b[0]-f.a[0],f.b[1]-f.a[1]),dx=(f.b[0]-f.a[0])/L,dy=(f.b[1]-f.a[1])/L
  const at=(s:number,d:number,z:number):V3=>[f.a[0]+s*dx+d*dy,f.a[1]+s*dy-d*dx,z]
  const mine=walls.filter(w=>onPlane(w,f)).map(w=>{const s0=(w.a[0]-f.a[0])*dx+(w.a[1]-f.a[1])*dy,s1=s0+Math.hypot(w.b[0]-w.a[0],w.b[1]-w.a[1]);return {l:s0+w.start,r:s1-w.end,lo:w.lo,top:w.hi-BEVEL}})
  const covered=(s:number,z:number)=>mine.some(w=>s>=w.l-.01&&s<=w.r+.01&&z>=w.lo+.3&&z<=w.top-.3)
  const span:Record<number,[number,number]>={}
  const panel=(s0:number,s1:number,z0:number,z1:number,col?:number)=>{
    if(![s0,(s0+s1)/2,s1].every(s=>covered(s,z0)&&covered(s,z1)))return
    quad(glazing,[at(s0,.06,z0),at(s1,.06,z0),at(s1,.06,z1),at(s0,.06,z1)])
    if(col!==undefined){const r=span[col]??=[z0,z1];r[0]=Math.min(r[0],z0);r[1]=Math.max(r[1],z1)}
  }
  // a corner band runs on the longest stretch of its wall that stands there
  const band=(s0:number,s1:number,z0:number,z1:number)=>{
    let best:[number,number]|undefined,run:number|undefined
    for(let s=s0;s<=s1+1e-6;s+=.1){
      const ok=covered(s,z0)&&covered(s,z1)
      if(ok&&run===undefined)run=s
      if(run!==undefined&&(!ok||s+.1>s1+1e-6)){const e=ok?s:s-.1;if(!best||e-run>best[1]-best[0])best=[run,e];run=undefined}
    }
    if(best&&best[1]-best[0]>1.2)panel(best[0]+(best[0]>s0+.05?.4:0),best[1]-(best[1]<s1-.05?.4:0),z0,z1)
  }
  const mid=(f.c0+L-f.c1)/2
  // the grey-brick spandrels that join each column's windows into a stripe
  for(let k=-21;k<33;k++) {
    const zs=90+k*STOREY
    if(k<0) { // below the setback: one panel per pair and three storeys
      if((k+21)%3)continue
      for(const c of [-4.9,0,4.9]) panel(mid+c-1.45,mid+c+1.45,zs+1.1,zs+3*STOREY-.8)
      continue
    }
    for(const c of [-4.9,0,4.9]) panel(mid+c-1.45,mid+c+1.45,zs+1,zs+2.7,c)
    band(BEVEL+.3,f.c0-.9,zs+1.1,zs+2.6);band(L-f.c1+.9,L-BEVEL-.3,zs+1.1,zs+2.6)
  }
  // the grey-brick spandrels between a column's windows, which join the
  // pairs into the face's vertical stripes
  for(const [c,[z0,z1]] of Object.entries(span)) {
    const s0=mid+Number(c)-1.6,s1=mid+Number(c)+1.6
    quad(spandrel,[at(s0,.03,z0-.5),at(s1,.03,z0-.5),at(s1,.03,z1+.5),at(s0,.03,z1+.5)])
  }
}
for(const w of walls) {
  const length=Math.hypot(w.b[0]-w.a[0],w.b[1]-w.a[1]),dx=(w.b[0]-w.a[0])/length,dy=(w.b[1]-w.a[1])/length
  const normal:V3=[dy,-dx,0]
  const at=(s:number,d:number,z:number):V3=>[w.a[0]+s*dx+d*dy,w.a[1]+s*dy-d*dx,z]
  const l=w.start,r=length-w.end,top=w.hi-BEVEL
  quad(stone,[at(l,0,w.lo),at(r,0,w.lo),at(r,0,top),at(l,0,top)])
  if(!SHAFT.some(f=>onPlane(w,f)))facade(at,l,r,w.lo,top)
  // A broad white roof edge, smoothly bevelled into a quiet rose terrace.
  const upperNormal=norm(add(normal,[0,0,1]))
  quad(stone,[at(l,0,top),at(r,0,top),at(r,-BEVEL,w.hi),at(l,-BEVEL,w.hi)],[normal,normal,upperNormal,upperNormal])
  quad(stone,[at(l,-BEVEL,w.hi),at(r,-BEVEL,w.hi),at(r,-.95,w.hi),at(l,-.95,w.hi)])
}

// Merge exposed roof cells without adding a parapet around each grid cell.
const used=new Set<string>()
for(let j=0;j<heights.length;j++) for(let i=0;i<heights[j].length;i++) {
  const h=heights[j][i];if(!h||used.has(`${i},${j}`))continue
  let end=i+1;while(end<heights[j].length&&heights[j][end]===h&&!used.has(`${end},${j}`))end++
  let row=j+1;while(row<heights.length&&Array.from({length:end-i},(_,k)=>i+k).every(k=>heights[row][k]===h&&!used.has(`${k},${row}`)))row++
  for(let yy=j;yy<row;yy++)for(let xx=i;xx<end;xx++)used.add(`${xx},${yy}`)
  let polygon=rect(xs[i],ys[j],xs[end],ys[row])
  for(const corner of corners.filter(c=>c.z===h&&polygon.some(p=>p[0]===c.at[0]&&p[1]===c.at[1]))) {
    const a=corner.a,b=corner.b,side=(p:XY)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])
    const clipped:XY[]=[]
    for(let k=0;k<polygon.length;k++) {
      const p=polygon[k],q=polygon[(k+1)%polygon.length],sp=side(p),sq=side(q)
      if(sp>=0)clipped.push(p)
      if((sp>=0)!==(sq>=0)){const t=sp/(sp-sq);clipped.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])])}
    }
    polygon=clipped
  }
  cap(roof,polygon,h-.06)
}

const place=(face:number,s:number,d:number,z:number):V3=> {
  const a=face*Math.PI/2;return [CX+s*Math.cos(a)-d*Math.sin(a),CY+s*Math.sin(a)+d*Math.cos(a),z]
}
const faceNormal=(face:number):V3=>[-Math.sin(face*Math.PI/2),Math.cos(face*Math.PI/2),0]
// The seven steel arches, traced from the crown's outline in the public-
// domain front photo (Shankbone), scaled by the shaft's 34.9 m long face
// (OSM) at 11.2 px/m, which puts the crown-base roof at 201.5 m (lidar 202).
// Each arch is a shell whose sides lean in as it rises: on its side faces it
// is `db` from the axis at its haunch `zb` and `dt` at its apex `zt`, which
// is the scallop each tier makes in the outline. The seventh is the pointed
// top under the needle. Photo widths: 28.9 at 228, 25.6 at 240, 21.2 at
// 251, 17.0 at 260, 12.6 at 268, 8.5 at 275, 4.8 at 284, 1.9 at 295 m.
// The lidar's crown returns agree within about 5%.
// The first arch (Shankbone photo, face check at the same scale) wraps the
// brick arch below it: a stilted semicircle `hw` wide each side whose legs
// run down beside the brick arch to the 61st-floor band, with brick corner
// piers beyond them; its face stands `db` out up to `dz`, then leans in.
// The second arch's legs are the crown's corners: they rise from the band
// beside the first arch and curve over into it (the photos' outer bright
// verticals), so the crown grows out of the tower without a ledge. `span`
// narrows a face to its arch's legs; `dk` gives a face's distance from the
// axis at heights, in place of the straight lean from `db` to `dt`.
type Tier={zb:number;zt:number;db:number;dt:number;hw?:number;span?:number;dk?:[number,number][]}
const tiers:Tier[]=[
  {zb:211.5,zt:246.8,db:12.8,dt:11.2,hw:9.5,span:9.75,dk:[[211.5,12.8],[238.5,12.8],[246.8,11.2]]},
  {zb:211.5,zt:254.1,db:12.5,dt:10,hw:11.3,dk:[[211.5,12.5],[238.5,12.5],[246.8,11],[254.1,10]]},
  {zb:240,zt:261.4,db:10,dt:8,dk:[[240,10],[256,9.8],[261.4,8]]},
  {zb:257,zt:268.5,db:7.9,dt:6.3,dk:[[257,7.9],[263.5,7.6],[268.5,6.3]]},
  {zb:264,zt:275.5,db:5.5,dt:4.25},
  {zb:271,zt:284.5,db:3.9,dt:2.4},
  {zb:279,zt:295.5,db:2.2,dt:.75},
]
// The brick arch on each face: 14.9 m wide, its top at 238 m, seven storeys
// and a round-headed window over the eagles.
const BRICK={r:7.45,spring:230.55}
const arc=(r:number,apex:number,s:number)=>apex-r+Math.sqrt(Math.max(0,r*r-s*s))

/** Upper shaft: three grey recessed columns, including a tall central round
 * arch, inside the large masonry arch on each of the four faces. */
for(let f=0;f<4;f++) {
  const d=f%2?14.3:14.9,r=BRICK.r,spring=BRICK.spring,n=faceNormal(f),SILL=212.5
  const at=(s:number,inset:number,z:number)=>place(f,s,d+inset,z)
  // Front wall is tiled between three aperture silhouettes, leaving raised piers.
  const openings=[{l:-5.7,r:-3.4,top:233.5,round:false},{l:-2.4,r:2.4,top:236.5,round:true},{l:3.4,r:5.7,top:233.5,round:false}]
  let last=-r
  const topAt=(s:number)=>spring+Math.sqrt(Math.max(0,r*r-s*s))
  function pier(l:number,rr:number) {
    const cuts=[l,...Array.from({length:ARC_SEGMENTS-1},(_,i)=>-r*Math.cos((i+1)*Math.PI/ARC_SEGMENTS)).filter(s=>s>l&&s<rr),rr]
    for(let k=0;k<cuts.length-1;k++)quad(stone,[at(cuts[k+1],0,200),at(cuts[k],0,200),at(cuts[k],0,topAt(cuts[k])),at(cuts[k+1],0,topAt(cuts[k+1]))])
  }
  for(const o of openings) {
    pier(last,o.l)
    const rad=(o.r-o.l)/2,c=(o.l+o.r)/2,spr=o.top-rad,segments=o.round?6:1
    // Lower sill; surrounding wall above the aperture follows the masonry arch.
    quad(stone,[at(o.r,0,200),at(o.l,0,200),at(o.l,0,SILL),at(o.r,0,SILL)])
    const contour:XY[]=[[o.r,SILL],[o.l,SILL]]
    for(let k=0;k<=segments;k++) {
      const s=o.round?c-rad*Math.cos(k*Math.PI/segments):k===0?o.l:o.r
      const z=o.round?spr+rad*Math.sin(k*Math.PI/segments):o.top
      contour.push([s,z])
    }
    // Recess perimeter: each grey panel is physically behind its white lip.
    const inn=contour.map(([s,z]):XY=>[c+(s-c)*.86,z===SILL?SILL+.35:z-.35])
    for(let k=0;k<contour.length;k++) {
      const j=(k+1)%contour.length,p=contour[k],q=contour[j],ip=inn[k],iq=inn[j]
      quad(stone,[at(p[0],0,p[1]),at(q[0],0,q[1]),at(iq[0],-RECESS,iq[1]),at(ip[0],-RECESS,ip[1])],[n,n,n,n])
    }
    const center=at(c,-RECESS,(SILL+o.top)/2)
    for(let k=0;k<inn.length;k++){const j=(k+1)%inn.length;glazing.tri(center,at(inn[k][0],-RECESS,inn[k][1]),at(inn[j][0],-RECESS,inn[j][1]))}
    for(let k=2;k<contour.length-1;k++) {
      const p=contour[k],q=contour[k+1]
      quad(stone,[at(q[0],0,q[1]),at(p[0],0,p[1]),at(p[0],0,topAt(p[0])),at(q[0],0,topAt(q[0]))])
    }
    last=o.r
  }
  pier(last,r)
  // Close the two side returns of the masonry shoulder behind the glazing.
  for(const side of [-1,1]) {
    const points=[at(side*r,0,200),at(side*r,-2.4,200),at(side*r,-2.4,spring),at(side*r,0,spring)]
    quad(stone,side===1?points:points.reverse())
  }
  // A smooth .45m bevel around the large round shoulder.
  for(let j=0;j<ARC_SEGMENTS;j++) {
    const a=j*Math.PI/ARC_SEGMENTS,b=(j+1)*Math.PI/ARC_SEGMENTS
    const p=(t:number,rr:number,dd:number)=>place(f,-rr*Math.cos(t),dd,spring+rr*Math.sin(t))
    quad(stone,[p(a,r,d),p(b,r,d),p(b,r+.45,d-.4),p(a,r+.45,d-.4)],[n,n,norm(add(n,[0,0,1])),norm(add(n,[0,0,1]))])
    // the arch's top, back to the first steel arch's face
    quad(stone,[p(a,r+.45,d-.4),p(b,r+.45,d-.4),p(b,r+.45,d-2.6),p(a,r+.45,d-2.6)])
  }
}

/** One arch tier, on each face: the leaning face from the haunch line up
 * to the arch, the arch's top running back to the axis (the four meet as a
 * cross vault, scalloped at the corners as the real crown is), a bright rim
 * along the arch, and the triangular windows fanned across the face, flush. */
const SEG=8
// A tier's arch on a face, at s across it: full-width and round (pointed for
// the last), or stilted `hw` wide with flat shoulders beyond.
const archOf=(t:Tier,k:number)=>(s:number)=> {
  const a=Math.abs(s)
  if(t.hw!==undefined) {const spr=t.zt-t.hw;return a>=t.hw?spr:spr+Math.sqrt(t.hw*t.hw-a*a)}
  const u=Math.min(1,a/t.db),q=k===tiers.length-1?1-u:Math.sqrt(1-u*u)
  return t.zb+(t.zt-t.zb)*q
}
function tier(t:Tier,k:number) {
  const pointed=k===tiers.length-1,arch=archOf(t,k)
  const W=t.span??t.db,zc=(u:number)=>arch(u*W)
  const dk=t.dk??[[t.zb,t.db],[t.zt,t.dt]]
  const dc=(z:number)=>{
    if(z<=dk[0][0]) return dk[0][1]
    for(let i=1;i<dk.length;i++) if(z<=dk[i][0]) return dk[i-1][1]+(dk[i][1]-dk[i-1][1])*(z-dk[i-1][0])/(dk[i][0]-dk[i-1][0])
    return dk[dk.length-1][1]
  }
  const thick=Math.min(1.3,(t.zt-(t.hw!==undefined?t.zt-t.hw:t.zb))*.1),proud=Math.min(.35,t.db*.04)
  // columns across the face; a stilted arch adds its legs and finer steps
  const us=t.hw===undefined?Array.from({length:SEG+1},(_,j)=>-1+2*j/SEG)
    :[-1,...Array.from({length:SEG+1},(_,j)=>-t.hw!*Math.cos(j*Math.PI/SEG)/W),1]
  for(let f=0;f<4;f++) {
    const n=faceNormal(f)
    for(let j=0;j<us.length-1;j++) {
      const u0=us[j],u1=us[j+1],z0=zc(u0),z1=zc(u1)
      const top0=place(f,u0*W,dc(z0),z0),top1=place(f,u1*W,dc(z1),z1)
      const bot0=place(f,u0*W,t.db,t.zb),bot1=place(f,u1*W,t.db,t.zb)
      quad(silver,[bot1,bot0,top0,top1])
      // the top runs back to the axis; a stilted arch's flat shoulders only
      // back to the next arch's face, so they don't cut across the front
      const shoulder=t.hw!==undefined&&Math.abs(u0*W)>=t.hw-.01&&Math.abs(u1*W)>=t.hw-.01
      const back=(z:number)=>{if(!shoulder||!tiers[k+1]) return 0;const nx=tiers[k+1];return Math.max(0,(nx.dk?nx.dk.find(q=>q[0]>=z)?.[1]??nx.dt:nx.db+(nx.dt-nx.db)*(z-nx.zb)/(nx.zt-nx.zb))-.3)}
      quad(silver,[top0,place(f,u0*W,back(z0),z0),place(f,u1*W,back(z1),z1),top1],[norm(add(n,[0,0,1])),[0,0,1],[0,0,1],norm(add(n,[0,0,1]))])
      // the rim: a band just under the arch, standing proud (not along a
      // stilted arch's flat shoulders)
      if(shoulder) continue
      const lo=(u:number,z:number,d:number)=>place(f,u*W,dc(z-thick)+d,z-thick)
      const hi=(u:number,z:number,d:number)=>place(f,u*W,dc(z)+d,z)
      rims.quad(lo(u1,z1,proud),lo(u0,z0,proud),hi(u0,z0,proud),hi(u1,z1,proud))
    }
    // where a narrowed face ends, a return back to the next arch's face
    if(t.span!==undefined) {
      const nx=tiers[k+1],ndk=nx.dk!,nd=(z:number)=>{for(let i=1;i<ndk.length;i++) if(z<=ndk[i][0]) return ndk[i-1][1]+(ndk[i][1]-ndk[i-1][1])*(z-ndk[i-1][0])/(ndk[i][0]-ndk[i-1][0]);return ndk[ndk.length-1][1]}
      const zTop=zc(1)
      for(const side of [-1,1]) {
        const v=[place(f,side*W,dc(t.zb),t.zb),place(f,side*W,nd(t.zb)-.05,t.zb),place(f,side*W,nd(zTop)-.05,zTop),place(f,side*W,dc(zTop),zTop)]
        quad(silver,side>0?v:[v[1],v[0],v[3],v[2]])
      }
    }
    // a stilted arch's legs: bright bands down beside the brick arch
    if(t.hw!==undefined) for(const side of [-1,1]) {
      const spr=t.zt-t.hw,o=side*t.hw,i=side*(t.hw-thick)
      const L=(sv:number,z:number)=>place(f,sv,dc(z)+proud,z)
      const v=[L(i,t.zb),L(o,t.zb),L(o,spr),L(i,spr)]
      rims.quad(...(side>0?v:[v[1],v[0],v[3],v[2]]) as [V3,V3,V3,V3])
    }
    // triangular windows, fanned: each base runs down behind the arch in
    // front, so the window shows whole from that arch up; the tip reaches a
    // little over half way to this tier's own arch (photos: about 4 m of a
    // 7 m band).
    const count=t.db>9?5:t.db>5?4:t.db>3?3:pointed?1:2,spread=.8
    const front=(sv:number)=>k===0?arc(BRICK.r+.45,BRICK.spring+BRICK.r+.45,sv):archOf(tiers[k-1],k-1)(sv)
    if(k===0) {
      // round the brick arch they fan out from its centre, from behind its
      // rim a little over half way to this arch
      const R=BRICK.r+.45
      for(const deg of [-60,-40,-20,0,20,40,60]) {
        const a=deg*Math.PI/180,dir=[Math.sin(a),Math.cos(a)],half=.14
        let out=R;while(out<R+12&&BRICK.spring+(out+.1)*dir[1]<arch((out+.1)*dir[0]))out+=.1
        const rr=R+(out-R)*.55,p=(r:number,da:number):V3=>{const b=a+da;return place(f,r*Math.sin(b),dc(BRICK.spring+r*Math.cos(b))+.06,BRICK.spring+r*Math.cos(b))}
        crownGlass.tri(p(R-.9,half),p(rr,0),p(R-.9,-half))
      }
      continue
    }
    for(let i=0;i<count;i++) {
      const u=-spread+2*spread*(i+.5)/count,w=.32/count*1.6
      const lo=(uu:number)=>Math.max(t.zb,front(uu*W)-.9)
      const z1=front(u*W)+(zc(u)-front(u*W))*.55
      if(z1-front(u*W)<.9) continue
      const v=(uu:number,z:number)=>place(f,uu*W,dc(z)+.06,z)
      crownGlass.tri(v(u+w,lo(u+w)),v(u+w*.15+(u*.15),z1),v(u-w,lo(u-w)))
    }
  }
}
tiers.forEach(tier)

// Bold faceted eagle/hood silhouettes; the small eyes, feathers and ribs go.
function eagle(x:number,y:number,dx:number,dy:number,z:number,scale=1) {
  const l=Math.hypot(dx,dy);dx/=l;dy/=l
  const at=(u:number,v:number,h:number):V3=>[x+scale*(u*dx-v*dy),y+scale*(u*dy+v*dx),z+scale*h]
  const a=at(-1,-1,-.6),b=at(-1,1,-.6),c=at(2.5,.45,.5),d=at(2.5,-.45,.5),tip=at(3.85,0,.45),ridge=at(2.55,0,1.35)
  silver.tri(a,b,ridge);silver.tri(b,c,ridge);silver.tri(c,tip,ridge);silver.tri(tip,d,ridge);silver.tri(d,a,ridge)
  silver.tri(a,d,c);silver.tri(a,c,b);silver.tri(c,d,tip)
}
// The eagles: two at each corner of the 61st-floor band, at its top (photo:
// about 211 m, not on the shaft's setback at 201.5), looking out diagonally.
for(const [cx,cy,dx,dy] of [[-22.7,-8.2,-1,-1],[5.9,-8.2,1,-1],[-22.7,22.2,-1,1],[5.9,22.2,1,1]])
  for(const [ox,oy] of [[0,-dy*2.2],[-dx*2.2,0]]) eagle(cx+ox,cy+oy,dx,dy,210.3,1.15)
// The winged radiator caps at the 31st-floor corners: OSM's traced outlines
// (way/260904075, 077, 078, 079; 89-91 m), extruded in steel.
const WINGS:XY[][]=[
  [[-23.3,29.9],[-20.0,26.6],[-22.3,27.3],[-22.4,26.7],[-21.9,25.9],[-22.5,25.9],[-22.5,25.3],[-23.1,26.1],[-24.1,26.1],[-23.5,23.8],[-26.2,27.0],[-25.9,27.3],[-25.3,27.4],[-25.3,27.8],[-25.2,28.1],[-25.0,28.5],[-24.7,28.7],[-24.3,28.9],[-24.1,29.0],[-23.6,28.9],[-23.6,29.6]],
  [[9.8,26.9],[6.7,23.4],[7.2,25.7],[6.6,25.8],[6.0,25.4],[6.0,25.9],[5.3,25.9],[6.0,26.5],[5.9,27.5],[3.7,26.7],[6.8,29.7],[7.1,29.3],[7.2,28.7],[7.6,28.8],[7.9,28.7],[8.3,28.5],[8.6,28.2],[8.8,27.9],[8.8,27.6],[8.8,27.1],[9.5,27.2]],
  [[-23.9,-13.1],[-23.3,-13.2],[-22.7,-12.8],[-22.7,-13.4],[-22.0,-13.4],[-22.7,-13.9],[-22.6,-14.9],[-20.4,-14.1],[-23.5,-17.1],[-23.8,-16.7],[-23.8,-16.1],[-24.2,-16.2],[-24.6,-16.1],[-25.0,-15.9],[-25.2,-15.6],[-25.5,-15.3],[-25.5,-15.0],[-25.5,-14.5],[-26.2,-14.6],[-26.5,-14.3],[-23.4,-10.8]],
  [[6.7,-17.1],[3.3,-14.0],[5.6,-14.6],[5.7,-13.9],[5.3,-13.3],[5.8,-13.3],[5.8,-12.6],[6.4,-13.3],[7.4,-13.3],[6.7,-11.0],[9.5,-14.1],[9.2,-14.4],[8.6,-14.5],[8.6,-14.9],[8.6,-15.3],[8.3,-15.6],[8.1,-15.9],[7.7,-16.1],[7.5,-16.2],[7.0,-16.1],[7.0,-16.8]],
]
// Thinned to 0.3 m (Douglas-Peucker): at 90 m the finer kinks don't read.
function thin(pts:XY[],tol:number):XY[] {
  if(pts.length<3)return pts
  const a=pts[0],b=pts[pts.length-1],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1
  let best=0,at=0
  for(let i=1;i<pts.length-1;i++){const d=Math.abs((b[0]-a[0])*(pts[i][1]-a[1])-(b[1]-a[1])*(pts[i][0]-a[0]))/l;if(d>best){best=d;at=i}}
  return best<tol?[a,b]:[...thin(pts.slice(0,at+1),tol).slice(0,-1),...thin(pts.slice(at),tol)]
}
for(const w0 of WINGS) {
  const w=ccw(thin([...w0,w0[0]],.3).slice(0,-1))
  for(const [i,j,k] of earcut(w)){silver.tri([...w[i],91],[...w[j],91],[...w[k],91]);silver.tri([...w[i],89],[...w[k],89],[...w[j],89])}
  for(let i=0;i<w.length;i++){const p=w[i],q=w[(i+1)%w.length];silver.quad([...p,89],[...q,89],[...q,91],[...p,91])}
}

/** The steel entrance portals on Lexington Avenue (405, centred on the
 * front) and on 42nd Street: tall glazed doorways under a pointed head in a
 * stainless surround, as in "405 Lexington Avenue - Chrysler Building
 * Entrance.jpg". Flush shapes, proud of the shopfronts. */
function portal(at:(s:number,z:number,d:number)=>V3) {
  const shape=(w:number,h:number,apex:number,d:number):V3[]=>[at(-w,0,d),at(w,0,d),at(w,h,d),at(0,apex,d),at(-w,h,d)]
  const st=shape(4.4,9,13.2,.2),gl=shape(3.4,8.4,11.8,.26)
  for(const [p,v] of [[silver,st],[glazing,gl]] as [Part,V3[]][]) for(let i=1;i<v.length-1;i++) p.tri(v[0],v[i],v[i+1])
}
portal((s,z,d)=>[-40.5-d,6-s,z] as V3)
portal((s,z,d)=>[-14+s,-25.3-d,z] as V3)

// Same 319m tip and 2.3m needle base, with eight sides and a cool shaded edge.
/** The needle, from the close-ups (Highsmith, VillageHero, Ron Cogswell,
 * Tony Hisgett): from a collar at the pointed tier's tip, 296 m, 24 m to the
 * 319 m tip. Eight-sided. */
const NEEDLE:[number,number][]=[[295,.75],[296.5,.55],[307,.3],[319,0]]
const oct=(z:number,a:number)=>Array.from({length:8},(_,i):V3=>{const t=(i+.5)*Math.PI/4,R=a/Math.cos(Math.PI/8);return [CX+R*Math.cos(t),CY+R*Math.sin(t),z]})
const nr=NEEDLE.slice(0,-1).map(([z,a])=>oct(z,a))
silver.loft(nr)
for(let i=0;i<8;i++) silver.tri(nr[nr.length-1][i],nr[nr.length-1][(i+1)%8],[CX,CY,319])

const parts:{part:Part;material:MaterialSpec}[]=[
  {part:stone,material:finish('chrysler-brick',0xe9e6df)},
  {part:spandrel,material:finish('chrysler-spandrel',0xb3b5b5)},
  {part:glazing,material:PALETTE.window},
  {part:roof,material:PALETTE.roof},
  {part:silver,material:{...finish('chrysler-steel',0xc9d0d4,.42),floodlight:(p)=>p[2]>200&&p[2]<296?.3:0}},
  {part:rims,material:{...finish('chrysler-steel-rim',0xf3f5f6,.35),doubleSided:true,floodlight:(p)=>p[2]>200&&p[2]<296?.75:0}},
  {part:crownGlass,material:{...windowVariant(2,0x4b565e),doubleSided:true}},
]
const triangles=parts.reduce((sum,p)=>sum+p.part.triangles,0)
const glb=writeGlb('Chrysler Building',parts,{frame:'Y up, -Z north, +X east; metres; ground anchor',anchor:[40.75151,-73.9752851],bearing:29,crown:tiers,license:'CC0-1.0',bevelMetres:BEVEL})
if(triangles>6500||glb.length>250000)throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out=process.argv[2]??new URL('../models/chrysler-building.glb',import.meta.url).pathname
await Bun.write(out,glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length/1024).toFixed(1)} KiB); ${walls.length} exposed facade patches`)
