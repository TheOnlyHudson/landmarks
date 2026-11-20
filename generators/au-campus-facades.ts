/** Close-range elevations. Openings are cut out of the front plane so their
 * reveals cast shadows and the metal sash stays inside the masonry face. */
import { Part, type V3 } from './mesh'
import { onWall, type XY } from './chi-aon-center'
import type { CampusWing } from './au-campus-building'

export type Sash = 'plain' | 'two-over-two' | 'six-over-six' | 'grouped' | 'sliding' | 'spandrel'

type Parts = {body: Part; trim: Part; frame: Part; windows: Part}
type Wall = ReturnType<typeof onWall>
function face(part: Part, wall: Wall, lo: number, hi: number, sill: number, head: number, depth = 0) {
  if (hi-lo < .002 || head-sill < .002) return
  const {P} = wall
  part.quad(P(lo,sill,depth),P(hi,sill,depth),P(hi,head,depth),P(lo,head,depth))
}

/** One face between two rows of windows, split at material changes. */
function masonry(parts: Parts, wall: Wall, wing: CampusWing, lo: number, hi: number, z0: number, z1: number) {
  const base = wing.base ?? wing.bottom ?? 0, cornice = wing.eave - .32
  const cuts = [z0,...[base,wing.band,wing.band === undefined ? undefined : wing.band+.34,cornice]
    .filter((v): v is number => v !== undefined && v>z0 && v<z1).sort((a,b)=>a-b),z1]
  for (let i=1;i<cuts.length;i++) {
    const mid=(cuts[i]+cuts[i-1])/2
    const trim=mid<base || mid>=cornice || (wing.band!==undefined && mid>=wing.band && mid<=wing.band+.34)
    face(trim ? parts.trim : parts.body,wall,lo,hi,cuts[i-1],cuts[i])
  }
}

function opening(parts: Parts, wall: Wall, s: number, width: number, sill: number, head: number, arch: number, style: Sash) {
  const {P}=wall, left=s-width/2, right=s+width/2, spring=head-arch
  const depth=style==='spandrel' ? -.28 : -.14
  const contour: XY[]=[[left,sill],[right,sill],[right,spring]]
  if (arch) {
    for(let j=1;j<=12;j++){
      const t=j*Math.PI/12
      contour.push([s+width/2*Math.cos(t),spring+arch*Math.sin(t)])
    }
    // Solid spandrels above the curved head.
    for(let j=2;j<contour.length-1;j++){
      const a=contour[j],b=contour[j+1]
      parts.body.quad(P(b[0],b[1]),P(a[0],a[1]),P(a[0],head),P(b[0],head))
    }
  } else contour.push([left,head])
  const hub=P(s,(sill+spring)/2,depth)
  for(let j=0;j<contour.length;j++) {
    const a=contour[j],b=contour[(j+1)%contour.length]
    const A=P(...a),B=P(...b),innerA=P(a[0],a[1],depth),innerB=P(b[0],b[1],depth)
    parts.trim.quad(A,B,innerB,innerA)
    parts.windows.tri(hub,innerA,innerB)
  }
  const glazing=depth+.018
  const rim=Math.min(.07,width*.08,(spring-sill)*.1)
  face(parts.frame,wall,left,left+rim,sill,spring,glazing)
  face(parts.frame,wall,right-rim,right,sill,spring,glazing)
  face(parts.frame,wall,left,right,sill,sill+rim,glazing)
  if(!arch) face(parts.frame,wall,left,right,head-rim,head,glazing)
  const lights=style==='six-over-six'||style==='grouped'?3:style==='two-over-two'||style==='sliding'?2:1
  for(let j=1;j<lights;j++){
    const x=left+j*width/lights
    face(parts.frame,wall,x-.025,x+.025,sill,spring,glazing+.006)
  }
  const rails=style==='six-over-six'?3:style==='two-over-two'||style==='grouped'?1:0
  for(let j=1;j<=rails;j++) {
    const h=sill+(spring-sill)*j/(rails+1)
    face(parts.frame,wall,left,right,h-.025,h+.025,glazing+.01)
  }
  if(style==='six-over-six') {
    const shutter=Math.min(.38,width*.29)
    face(parts.frame,wall,left-shutter,left-.045,sill,spring,.035)
    face(parts.frame,wall,right+.045,right+shutter,sill,spring,.035)
  }
}

export function detailedWall(parts: Parts, wing: CampusWing, edge: number, style: Sash) {
  const a=wing.outline[edge],b=wing.outline[(edge+1)%wing.outline.length]
  const wall=onWall(a,b), bottom=wing.bottom??0
  const rows=wing.rows.filter(([s,h])=>s>=bottom-.001&&h<=wing.eave+.001&&h>s+.1)
  if(wall.L<(wing.minimumWall??4)||wing.blankEdges?.includes(edge)||!rows.length){
    masonry(parts,wall,wing,0,wall.L,bottom,wing.eave)
    return
  }
  const count=wing.bayCounts?.[edge]??Math.max(1,Math.round(wall.L/(wing.bayWidth+wing.pierWidth)))
  const pitch=wall.L/count, width=Math.min(wing.bayWidth,pitch-Math.min(wing.pierWidth,pitch*.48))
  for(let bay=0;bay<count;bay++){
    const s=pitch*(bay+.5), left=s-width/2, right=s+width/2
    masonry(parts,wall,wing,bay*pitch,left,bottom,wing.eave)
    masonry(parts,wall,wing,right,(bay+1)*pitch,bottom,wing.eave)
    let last=bottom
    for(const [row,[sill,head]] of rows.entries()){
      if (style==='spandrel' && row>0) face(parts.frame,wall,left,right,last,sill,-.01)
      else masonry(parts,wall,wing,left,right,last,sill)
      const arch=wing.archRow===row?Math.min(width/2,(head-sill)*.45):0
      opening(parts,wall,s,width,sill,head,arch,style)
      last=head
    }
    masonry(parts,wall,wing,left,right,last,wing.eave)
  }
}

export function entranceSteps(trim: Part, a: XY, b: XY, width: number, depth: number, count: number) {
  const {P,L}=onWall(a,b), left=(L-width)/2, right=left+width
  for(let i=0;i<count;i++){
    const z=(count-i)*.15,d=depth+(i+1)*.31
    const v=(s:number,h:number,out:number):V3=>P(s,h,out)
    trim.quad(v(left,z,d),v(right,z,d),v(right,z,d-.31),v(left,z,d-.31))
    trim.quad(v(left,0,d),v(right,0,d),v(right,z,d),v(left,z,d))
    trim.quad(v(left,0,d-.31),v(left,0,d),v(left,z,d),v(left,z,d-.31))
    trim.quad(v(right,0,d),v(right,0,d-.31),v(right,z,d-.31),v(right,z,d))
  }
  trim.quad(P(left,count*.15,depth),P(right,count*.15,depth),P(right,count*.15),P(left,count*.15))
}
