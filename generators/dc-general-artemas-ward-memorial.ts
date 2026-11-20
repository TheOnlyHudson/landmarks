/**
 * General Artemas Ward Memorial. Leonard Crunelle, dedicated 1938.
 * The Smithsonian records a 10 x 5 x 4 ft bronze, on a granite pedestal
 * of approximately the same dimensions. NPS describes Ward's actual cloak,
 * his uncovered head, left leg forward, tricorne tucked under his bent
 * left arm, his gloves, and his lowered right hand drawing the cloak forward.
 * https://www.si.edu/object/siris_ari_20337
 * https://www.nps.gov/places/000/general-artemas-ward-memorial.htm
 * https://npgallery.nps.gov/GetAsset/02a5e435-1136-47ed-8e21-766045bab418
 * Photo references: NPS / Claire Hassler (government work, public domain)
 * and Aaron Siirila, CC BY-SA 2.5, Katzen Arts Center behind the figure:
 * https://commons.wikimedia.org/wiki/File:Statue_in_Ward_Circle,_Washington,_DC.jpg
 * OSM way/1059688028 maps the square setting around the monument. Origin
 * at its center. The southeast approach and NW/SE axis are visible in the
 * full-return 2022 DC lidar (6.30 m peak over the surrounding ground and
 * hedge opening to the southeast). Face direction estimated along that
 * axis rather than surveyed. Facing local -Y; +X is the figure's left.
 * https://www.openstreetmap.org/way/1059688028
 * https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9837/dc2022_wash_dc_metadata.html
 * The portrait, cloth folds, cloak clasp, shoes and granite joints are
 * interpreted in the round. Incised lettering omitted at this scale.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { body, ellipsoid, prism, rect, tube } from './dc-wwii-memorial'
import { finishGlb, writeModel } from './sea-tacoma-union-station'

const stone = new Part()
const bronze = new Part()
const cape = new Part()
const highlights = new Part()
const dark = new Part()
const plinth = 3.048

// Shallow footing, plain dressed-granite inscription block and cap.
prism(stone, rect(0, 0, 1.08, 0.88, 0, 0.025), 0, 0.12, 0.025)
prism(stone, rect(0, 0, 0.91, 0.74, 0, 0.02), 0.12, 0.27, 0.025)
function stoneRing(x: number, y: number, z: number): V3[] {
  return rect(0, 0, x, y, 0, 0.014).map(([a, b]) => [a, b, z])
}
stone.loft([stoneRing(0.82, 0.655, 0.27), stoneRing(0.79, 0.635, 0.34),
  stoneRing(0.735, 0.585, 2.94), stoneRing(0.76, 0.61, 2.97)])
prism(stone, rect(0, 0, 0.76, 0.61, 0, 0.018), 2.97, plinth, 0.017)
prism(dark, rect(0, 0, 0.645, 0.48, 0, 0.065), 0, 0.063, 0.016)

// A high boot, its folded top and a heel, beneath fitted breeches.
// The forward foot points slightly outward. The rear knee is gently bent.
for (const [side, y] of [[-1, 0.18], [1, -0.185]]) {
  const x = side * 0.214
  const toe: V3 = [x + side * 0.033, y - 0.15, 0.134]
  body(dark, [[0.065, 0.117, 0.235, toe[0], toe[1]], [0.089, 0.123, 0.246, toe[0], toe[1]],
    [0.149, 0.112, 0.222, toe[0], toe[1]], [0.207, 0.088, 0.12, x, y - 0.055]], 10)
  body(bronze, [[0.13, 0.106, 0.13, x, y], [0.285, 0.103, 0.10, x, y + 0.015],
    [0.53, 0.117, 0.125, x, y + 0.035], [0.78, 0.135, 0.145, x, y + 0.017],
    [0.855, 0.135, 0.14, x, y]], 10)
  body(highlights, [[0.79, 0.138, 0.155, x, y + 0.009], [0.875, 0.149, 0.153, x, y],
    [0.902, 0.141, 0.147, x, y]], 10)
  body(bronze, [[0.88, 0.118, 0.119, x, y], [0.98, 0.157, 0.151, x, y - 0.03],
    [1.18, 0.173, 0.169, side * 0.195, y * 0.75], [1.49, 0.182, 0.196, side * 0.166, y * 0.37],
    [1.62, 0.148, 0.17, side * 0.16, y * 0.29]], 10)
}

// Uniform with long skirts flaring around the hips and cut back at front.
body(bronze, [[1.44, 0.33, 0.21, 0, 0.05], [1.67, 0.292, 0.199, 0, 0.01],
  [1.91, 0.322, 0.222, 0, 0.004], [2.19, 0.39, 0.239, 0, 0.006],
  [2.40, 0.415, 0.217, 0, 0.019], [2.49, 0.29, 0.17, 0, 0.014],
  [2.54, 0.175, 0.125, 0, 0.01]], 16)
for (const side of [-1, 1]) {
  const face = (a: V3, b: V3, c: V3, d: V3) => {
    if (side === 1) bronze.quad(a, b, c, d)
    else bronze.quad(d, c, b, a)
  }
  const at = (x: number, y: number, z: number): V3 => [side * x, y, z]
  face(at(0.05, -0.226, 1.65), at(0.28, -0.146, 1.68), at(0.387, -0.135, 1.04), at(0.255, -0.186, 0.99))
  face(at(0.28, -0.146, 1.68), at(0.32, 0.075, 1.67), at(0.39, 0.13, 0.95), at(0.387, -0.135, 1.04))
  tube(highlights, [at(0.22,-0.12,2.465),at(0.206,-0.215,2.39),at(0.245,-0.182,2.33),at(0.116,-0.233,2.08),at(0.055,-0.215,1.77)],
    [0.049,0.061,0.052,0.039,0.019], [0.014,0.018,0.018,0.016,0.012], 7, {ref:[1,0,0]})
  for (let i = 0; i < 5; i++) {
    const u = i / 4
    ellipsoid(highlights, at(0.084 + 0.053*u,-0.212 - 0.015*u,1.76+i*0.105), [0.021,0.013,0.022], 6, 3)
  }
}
body(highlights, [[2.42,0.16,0.142,0,-0.009],[2.48,0.153,0.148,0,-0.012],
  [2.56,0.119,0.119,0,-0.022]], 12)
tube(highlights, [[0.01,-0.15,2.48],[0.012,-0.219,2.407],[-0.032,-0.239,2.315],[0.013,-0.235,2.235]],
  [0.078,0.082,0.065,0.039],[0.032,0.030,0.023,0.017],7,{ref:[1,0,0]})

// A continuous mantle from the nape and shoulder line to the asymmetric
// hem. Long ridges widen below the gathers; an open front reveals both legs.
const mantle: V3[][] = []
for (const [z,rx,ry,fold] of [[0.54,0.52,0.37,0.068],[0.87,0.51,0.365,0.062],
  [1.32,0.49,0.34,0.052],[1.75,0.48,0.325,0.042],[2.12,0.495,0.295,0.029],
  [2.36,0.49,0.237,0.021],[2.50,0.285,0.171,0.015],[2.55,0.155,0.123,0.009]]) {
  const row: V3[] = []
  for (let i=0; i<=30; i++) {
    const a=(-38 + i*252/30)*Math.PI/180
    const r=fold*(Math.cos(11*a+0.42*z)+0.38*Math.cos(6*a-0.24*z))
    const gather=Math.max(0,Math.cos(a+0.28))**3
    const hem=(1-Math.min(1,(z-0.54)/1.1))*(0.54*gather+0.045*Math.sin(4*a))
    row.push([(rx+r)*Math.cos(a),(ry+r)*Math.sin(a)+0.083,z+hem])
  }
  mantle.push(row)
}
for (let j=0;j<mantle.length-1;j++) {
  for (let i=0;i<mantle[j].length-1;i++) {
    const a=mantle[j][i],b=mantle[j][i+1],c=mantle[j+1][i+1],d=mantle[j+1][i]
    cape.quad(a,b,c,d)
    const inner=(v:V3):V3=>[v[0]*0.95,0.083+(v[1]-0.083)*0.95,v[2]+0.008]
    cape.quad(inner(d),inner(c),inner(b),inner(a))
    if(j===0) cape.quad(b,a,inner(a),inner(b))
  }
}
for (const index of [0,30]) {
  const edge=mantle.map(row=>row[index])
  tube(highlights,edge,edge.map(()=>0.023),edge.map(()=>0.028),6)
}

// Left elbow is away from the waist, forearm folded over the hat and gloves.
tube(bronze,[[0.34,0.01,2.397],[0.46,0.01,2.235],[0.535,-0.013,1.95],[0.537,-0.105,1.885],
  [0.447,-0.225,1.95],[0.346,-0.277,2.022]], [0.156,0.144,0.117,0.12,0.111,0.084],
  [0.155,0.138,0.124,0.112,0.100,0.08],10)
tube(bronze,[[-0.35,0.011,2.40],[-0.459,-0.012,2.23],[-0.506,-0.039,2.01],[-0.493,-0.147,1.77],[-0.472,-0.213,1.57]],
  [0.157,0.144,0.125,0.107,0.082],[0.158,0.145,0.12,0.105,0.077],10)
ellipsoid(highlights,[-0.472,-0.228,1.49],[0.091,0.067,0.127],9,5)
ellipsoid(highlights,[0.324,-0.284,2.033],[0.111,0.086,0.072],9,5)
for(const off of [-0.042,-0.009,0.026])
  tube(highlights,[[0.34+off,-0.306,2.002],[0.31+off,-0.327,1.939],[0.32+off,-0.335,1.889]],[0.020,0.018,0.012],undefined,5)

// The tricorne is carried edge-up against the side, three curled corners
// surrounding a domed crown. Its broad tip clears the silhouette of the cape.
const hatRings: V3[][]=[[],[],[]]
for(let i=0;i<24;i++) {
  const a=2*Math.PI*i/24, wave=Math.cos(3*a-0.6)
  const radius=0.26+0.048*wave
  for(const [j,f,lift] of [[0,0.51,0],[1,0.84,0.038],[2,1,0.056-0.041*wave]]) {
    hatRings[j].push([0.485+0.48*radius*f*Math.cos(a)+lift,-0.065+radius*f*Math.cos(a),
      2.055+radius*f*Math.sin(a)])
  }
}
for(let j=0;j<2;j++) for(let i=0;i<24;i++) {
  const k=(i+1)%24,a=hatRings[j][i],b=hatRings[j+1][i],c=hatRings[j+1][k],d=hatRings[j][k]
  dark.quad(a,b,c,d);dark.quad(d,c,b,a)
}
ellipsoid(dark,[0.522,-0.060,2.056],[0.123,0.157,0.154],12,6)

// Portrait: full cheeks, projecting brow and nose, firm chin and dressed
// hair swept back around bare temples. Features share the bronze casting.
body(bronze,[[2.51,0.098,0.095,0,-0.014],[2.67,0.108,0.10,0,-0.025]],12)
body(highlights,[[2.627,0.076,0.087,0,-0.055],[2.657,0.112,0.121,0,-0.051],
  [2.714,0.151,0.142,0,-0.042],[2.796,0.174,0.157,0,-0.034],
  [2.868,0.169,0.158,0,-0.025],[2.962,0.160,0.153,0,-0.006],[3.017,0.115,0.114,0,0.003],
  [3.029,0.048,0.057,0,0.012]],16)
for(const side of [-1,1]) {
  ellipsoid(bronze,[side*0.164,-0.015,2.815],[0.038,0.045,0.068],8,5)
  tube(bronze,[[side*0.025,-0.183,2.862],[side*0.072,-0.18,2.874],[side*0.121,-0.153,2.857]],
    [0.017,0.026,0.013],[0.017,0.021,0.013],6)
  tube(dark,[[side*0.037,-0.184,2.841],[side*0.077,-0.183,2.844],[side*0.103,-0.166,2.838]],
    [0.005,0.008,0.004],undefined,5)
}
tube(highlights,[[0,-0.179,2.867],[0,-0.193,2.822],[0,-0.221,2.788],[0,-0.205,2.775]],
  [0.022,0.024,0.040,0.028],[0.014,0.025,0.030,0.018],8,{ref:[1,0,0]})
tube(bronze,[[-0.063,-0.165,2.733],[0,-0.190,2.729],[0.059,-0.168,2.733]],[0.005,0.012,0.005],undefined,5)
body(cape,[[2.89,0.143,0.145,0,0.042],[2.968,0.173,0.162,0,0.024],
  [3.026,0.117,0.122,0,0.021],[3.048,0.044,0.049,0,0.02]],16)
for(const side of [-1,1]) {
  for(let k=0;k<3;k++) {
    const y=-0.02+k*0.071
    tube(cape,[[side*0.111,y,2.985],[side*0.171,y+0.018,2.907],[side*0.157,y+0.028,2.804],[side*0.127,y+0.046,2.761]],
      [0.033,0.038,0.041,0.024],undefined,6)
  }
}
ellipsoid(cape,[0,0.143,2.723],[0.095,0.09,0.127],9,5)

// Cast cannon breech and round shot are part of the sculpted base.
tube(bronze,[[-0.19,0.316,0.177],[-0.06,0.332,0.246],[0.20,0.328,0.358],[0.27,0.33,0.388]],
  [0.135,0.16,0.125,0.063],undefined,12)
ellipsoid(bronze,[0.399,-0.17,0.175],[0.119,0.117,0.115],10,5)

for(const part of [bronze,cape,highlights,dark]) {
  for(let i=1;i<part.pos.length;i+=3) part.pos[i]+=plinth
}
await writeModel('dc-general-artemas-ward-memorial',finishGlb('General Artemas Ward Memorial',[
  {part:stone,material:finish('ward-granite',0xbdb6a8)},
  {part:bronze,material:finish('cast-bronze',0x678478)},
  {part:cape,material:finish('bronze-shadow',0x59786c)},
  {part:highlights,material:finish('bronze-highlights',0x779286)},
  {part:dark,material:finish('aged-bronze',0x4c675d)},
],{}))
