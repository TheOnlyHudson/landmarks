/**
 * Anderson House, Little & Browne, 1902–05. Original procedural study.
 * OSM way/66646611 (May 2026 extract): https://www.openstreetmap.org/way/66646611
 * Published architectural description: NPS NHL nomination pp.4–5:
 * https://npgallery.nps.gov/NRHP/GetAsset/548abe2d-6b5f-498c-bf0f-eb61942fac68
 * 85 ft central facade, 30 ft wings projecting 40 ft; rear terrace recess 15 ft.
 * DC OCTO 2022 lidar DSM above footprint p10 ground (23.686 m NAVD88): main
 * roof median 19.98m, wings 19.07/19.16m, portico 12.59m, rear terrace 6.69m.
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * Cornices, small windows, gateway dimensions and chimney positions are estimates.
 * Identified photo references, VISUAL COMPARISON PENDING (download blocked):
 * https://commons.wikimedia.org/wiki/File:Larz_Anderson_House_-_Washington,_D.C..jpg
 * AgnosticPreachersKid, CC BY-SA 3.0, 2008.
 * https://www.loc.gov/pictures/item/dc0009.photos.027161p/ — HABS DC-255,
 * northeast front, National Park Service, public domain.
 * These unviewed photos were not used to measure shape or color.
 * The documented U court, semicircular four-column portico, paired gateway
 * arches and garden terrace are modeled. Capitals/pediments are abstract;
 * fine sculpture, exact rustication, interior rooms and dormers are omitted.
 * Window glow is a presentation convention, not a verified lighting survey.
 */
import {Part,type V3} from './mesh'
import {PALETTE,finish} from './palette'
import {block,cap,walls,rect,lathe,panel,onWall,save,type XY} from './chi-aon-center'
const stone=new Part(),trim=new Part(),roof=new Part(),glass=new Part(),doors=new Part()
function box(p:Part,x0:number,y0:number,x1:number,y1:number,z0:number,z1:number,b=.08){block(p,p,rect(x0,y0,x1,y1),z0,z1,b)}
function mass(x0:number,y0:number,x1:number,y1:number,h:number){
 block(stone,roof,rect(x0,y0,x1,y1),0,h,.12)
 for(const [z,w] of [[5.65,.14],[h-.5,.22],[h-.18,.3]])box(trim,x0-w,y0-w,x1+w,y1+w,z,z+.18)
}
function hip(x0:number,y0:number,x1:number,y1:number,eave:number,ridge:number){
 const r=rect(x0,y0,x1,y1),d=Math.min((x1-x0)/2,(y1-y0)/2)*.82,top=rect(x0+d,y0+d,x1-d,y1-d)
 walls(roof,r,eave,ridge,top);cap(roof,top,ridge)
}
const footprint:XY[]=[[-21.89,3.36],[-22.2,18.03],[-10.89,17.92],[-11.04,6.43],[-5.26,6.58],[5.06,6.83],[6.94,6.87],[6.89,8.45],[11.02,8.55],[10.74,18.72],[21.37,18.98],[22.25,-12.49],[17.79,-12.68],[17.89,-14.78],[7.17,-15.04],[7.12,-14.3],[-10.57,-14.72],[-10.56,-15.44],[-20.45,-15.88],[-21.02,-14.75]]
footprint.reverse();block(stone,roof,footprint,0,6.65,.08)
mass(-20.8,-10.5,21,6.5,16.5);mass(-21.45,-15.1,-11.3,17.6,16.3);mass(11.2,-13.1,21.3,18.3,16.3);mass(7.3,-14.4,17.6,-9.6,16.3)
hip(-20.8,-10.5,21,6.5,16.5,20.05);hip(-21.45,-15.1,-11.3,17.6,16.3,20.05);hip(11.2,-13.1,21.3,18.3,16.3,20.05);hip(7.3,-14.4,17.6,-9.6,16.3,19.4)
function win(a:XY,b:XY,s:number,w:number,z0:number,z1:number,arch=false){
 const {P}=onWall(a,b)
 if(!arch)panel(glass,a,b,s-w/2,s+w/2,z0,z1)
 else{const spring=z1-w/2;panel(glass,a,b,s-w/2,s+w/2,z0,spring)
 for(let i=0;i<10;i++){const t=i*Math.PI/10,u=(i+1)*Math.PI/10;glass.tri(P(s,spring,.04),P(s+w/2*Math.cos(t),spring+w/2*Math.sin(t),.04),P(s+w/2*Math.cos(u),spring+w/2*Math.sin(u),.04))}}
 if(!arch)panel(trim,a,b,s-w/2-.18,s+w/2+.18,z1+.08,z1+.32,.06)
}
function elevation(a:XY,b:XY,n:number){const L=onWall(a,b).L;for(let i=0;i<n;i++){const s=(i+.5)*L/n;win(a,b,s,1.9,7,11.1);win(a,b,s,1.35,13.2,14.75)}}
elevation([-11.3,17.6],[-21.45,17.6],3);elevation([21.3,18.3],[11.2,18.3],3)
elevation([-21.45,17.6],[-21.45,-15.1],7);elevation([21.3,-13.1],[21.3,18.3],7)
elevation([-11.3,6.5],[-11.3,17.6],2);elevation([11.2,18.3],[11.2,8.55],2);elevation([11.2,6.5],[-11.3,6.5],7)
const fa:XY=[11.2,6.5],fb:XY=[-11.3,6.5];panel(doors,fa,fb,10,12.4,.35,4.45,.06);win(fa,fb,11.2,2.4,3.4,5.15,true)
function column(x:number,y:number,z0:number,z1:number,r=.42){
 box(trim,x-r*1.5,y-r*1.5,x+r*1.5,y+r*1.5,z0,z0+.65)
 lathe(trim,x,y,[[r*1.15,z0+.65],[r,z0+.83],[r*.87,z1-.48],[r*1.25,z1-.38],[r*1.4,z1-.16]],10)
 box(trim,x-r*1.5,y-r*1.5,x+r*1.5,y+r*1.5,z1-.18,z1)
}
const curve:XY[]=[];for(let i=0;i<=16;i++){const a=i*Math.PI/16;curve.push([5.15*Math.cos(a),6.6+5.7*Math.sin(a)])}
for(const angle of [27,69,111,153]){const a=angle*Math.PI/180;column(4.7*Math.cos(a),6.6+5.1*Math.sin(a),.15,11.45,.43)}
block(trim,roof,curve,11.45,12.05,.12)
for(let i=0;i<16;i++){const a=curve[i],b=curve[i+1],v=onWall(a,b);panel(trim,a,b,0,v.L,12.65,12.86,0);for(let j=0;j<2;j++){const p=v.P(v.L*(j+.5)/2,12.05);box(trim,p[0]-.075,p[1]-.075,p[0]+.075,p[1]+.075,12.05,12.65,0)}}
function pediment(cx:number,y:number,width:number,z:number,rise:number){
 const a:V3=[cx-width/2,y,z],b:V3=[cx+width/2,y,z],c:V3=[cx,y,z+rise];trim.tri(b,a,c);trim.tri([a[0],y-.45,z],[b[0],y-.45,z],[cx,y-.45,z+rise]);trim.quad(a,b,[b[0],y-.45,z],[a[0],y-.45,z]);trim.quad(c,a,[a[0],y-.45,z],[cx,y-.45,z+rise]);trim.quad(b,c,[cx,y-.45,z+rise],[b[0],y-.45,z])
}
pediment(0,6.86,12.4,16.55,2.65)
for(let edge=0;edge<footprint.length;edge++){
 const a=footprint[edge],b=footprint[(edge+1)%footprint.length],L=onWall(a,b).L
 if(L<5)continue
 const n=Math.max(1,Math.round(L/5.8));for(let i=0;i<n;i++)win(a,b,(i+.5)*L/n,1.7,1.5,4.8)
}
elevation([-11.3,-10.5],[11.2,-10.5],5)
for(const x of [-5,-2,2,5])column(x,-10.65,6.8,15.95,.28)
for(const [a,b] of [[[-20.8,-15.15],[-11.3,-15.15]],[[7.3,-14.45],[17.6,-14.45]]] as [XY,XY][]){const L=onWall(a,b).L;win(a,b,L/2,2.4,7,12,true);for(const dx of [-2.4,2.4])win(a,b,L/2+dx,1.2,7,10.8)}
box(stone,-6.7,17.5,6.7,18.1,0,3.1);box(trim,-6.85,17.4,6.85,18.2,3.1,3.35)
function segmentPediment(cx:number,y:number,w:number,z:number,h:number){
 const radius=w*w/(8*h)+h/2,cy=z+h-radius,theta=Math.asin(w/2/radius)
 const pts:V3[]=Array.from({length:13},(_,i)=>{const a=-theta+2*theta*i/12;return [cx+radius*Math.sin(a),y,cy+radius*Math.cos(a)]})
 const center:V3=[cx,y,z]
 for(let i=0;i<12;i++){const a=pts[i],b=pts[i+1],A:V3=[a[0],y-.45,a[2]],B:V3=[b[0],y-.45,b[2]];trim.tri(center,b,a);trim.tri([cx,y-.45,z],A,B);trim.quad(a,b,B,A)}
}
function gateway(cx:number){const r=1.65,z=3,outer=2.25,y=18.05,depth=.65
 for(const side of [-1,1]){box(stone,cx+side*2-.4,y-depth,cx+side*2+.4,y,0,z);column(cx+side*2.35,y+.05,0,5.05,.22)}
 for(let i=0;i<12;i++){const a=i*Math.PI/12,b=(i+1)*Math.PI/12;const P=(rr:number,t:number,yy:number):V3=>[cx+rr*Math.cos(t),yy,z+rr*Math.sin(t)];stone.quad(P(r,b,y),P(r,a,y),P(outer,a,y),P(outer,b,y));stone.quad(P(r,a,y-depth),P(r,b,y-depth),P(outer,b,y-depth),P(outer,a,y-depth));stone.quad(P(r,a,y),P(r,b,y),P(r,b,y-depth),P(r,a,y-depth));stone.quad(P(outer,b,y),P(outer,a,y),P(outer,a,y-depth),P(outer,b,y-depth))}
 box(trim,cx-2.7,y-.7,cx+2.7,y+.2,5.15,5.45);segmentPediment(cx,y+.2,5.3,5.45,.9)
}
gateway(-8.8);gateway(8.8)
for(const x of [-17,16])for(const y of [-5,11]){box(stone,x-.55,y-.6,x+.55,y+.6,18.3,21.65);box(trim,x-.65,y-.7,x+.65,y+.7,21.5,21.85)}
await save('dc-anderson-house','Anderson House',[-77.04771675,38.91071298],25.4,[{part:stone,material:finish('limestone',0xdacdb8)},{part:trim,material:PALETTE.trim},{part:roof,material:finish('slate-roof',0x777d80)},{part:glass,material:PALETTE.window},{part:doors,material:finish('oak-doors',0x705b49)}])
