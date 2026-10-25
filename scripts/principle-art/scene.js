/* Offline, deterministic WebGL illustrations. No network, medical measurements,
 * patient data, or manufacturer assets. Geometry is schematic, not to scale.
 * The website ships the rendered WebP files, never this renderer. */
(() => {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl2', {antialias:true, preserveDrawingBuffer:true});
  if (!gl) throw new Error('WebGL 2 is required for local illustration rendering.');
  const C = {bg:'#1d2a30',skin:'#f6dccb',dermis:'#f0cdb8',fat:'#f6e5c4',fatLight:'#fbecd0',fatEdge:'#efd6ab',fiber:'#d8a48d',muscle:'#c98c7b',clay:'#b47762',dark:'#4a3931',metal:'#d9d4cd',white:'#ffffff',blue:'#bcd6e2',cool:'#bed7df',teal:'#8da5a8',gold:'#a88e6a',heat:'#f2b35c',brown:'#795543',ink:'#2a2724'};
  const rgb = hex => [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
  const add=(a,b)=>a.map((v,i)=>v+b[i]), sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const mul=(a,s)=>a.map(v=>v*s), dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>mul(a,1/(Math.hypot(...a)||1));
  let opaque=[], translucent=[], seed=17, camera;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  function vertex(p,n,c,alpha=1,shine=.2,emission=0) {
    (alpha<1?translucent:opaque).push(...p,...n,...rgb(c),alpha,shine,emission);
  }
  function tri(a,b,c,color,alpha=1,shine=.2,emission=0,normals) {
    const n=norm(cross(sub(b,a),sub(c,a)));
    [a,b,c].forEach((p,i)=>vertex(p,normals?normals[i]:n,color,alpha,shine,emission));
  }
  function quad(a,b,c,d,color,alpha=1,shine=.2) {tri(a,b,c,color,alpha,shine);tri(a,c,d,color,alpha,shine);}
  function ellipsoid(p,r,color,shine=.25,alpha=1,emission=0,segments=20,rings=12) {
    const point=(u,v)=>{const n=[Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)];return {p:add(p,n.map((x,i)=>x*r[i])),n:norm(n.map((x,i)=>x/r[i]))};};
    for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){
      const a=point(i/segments*2*Math.PI,j/rings*Math.PI),b=point((i+1)/segments*2*Math.PI,j/rings*Math.PI),c=point((i+1)/segments*2*Math.PI,(j+1)/rings*Math.PI),d=point(i/segments*2*Math.PI,(j+1)/rings*Math.PI);
      tri(a.p,b.p,c.p,color,alpha,shine,emission,[a.n,b.n,c.n]);tri(a.p,c.p,d.p,color,alpha,shine,emission,[a.n,c.n,d.n]);
    }
  }
  function tube(points,r,color,shine=.25,alpha=1,emission=0,sides=10) {
    const frames=points.map((p,i)=>{const t=norm(sub(points[Math.min(i+1,points.length-1)],points[Math.max(0,i-1)]));const a=norm(cross(t,Math.abs(t[1])>.95?[1,0,0]:[0,1,0]));return {a,b:cross(t,a)};});
    const v=(i,j)=>{const f=frames[i],n=add(mul(f.a,Math.cos(j/sides*2*Math.PI)),mul(f.b,Math.sin(j/sides*2*Math.PI)));return {p:add(points[i],mul(n,typeof r==='function'?r(i/(points.length-1)):r)),n};};
    for(let i=0;i<points.length-1;i++)for(let j=0;j<sides;j++){
      const a=v(i,j),b=v(i,j+1),c=v(i+1,j+1),d=v(i+1,j);
      tri(a.p,b.p,c.p,color,alpha,shine,emission,[a.n,b.n,c.n]);tri(a.p,c.p,d.p,color,alpha,shine,emission,[a.n,c.n,d.n]);
    }
    for(const i of [0,points.length-1])for(let j=0;j<sides;j++)tri(points[i],v(i,j).p,v(i,j+1).p,color,alpha,shine,emission);
  }
  function housing(x,z,profile,color) {
    const sides=64;
    for(let i=0;i<profile.length-1;i++)for(let j=0;j<sides;j++){
      const [y0,r0]=profile[i],[y1,r1]=profile[i+1],slope=(r0-r1)/(y1-y0);
      const at=(y,r,k)=>{const a=k/sides*2*Math.PI;return{p:[x+Math.cos(a)*r,y,z+Math.sin(a)*r],n:norm([Math.cos(a),slope,Math.sin(a)])};};
      const a=at(y0,r0,j),b=at(y0,r0,j+1),c=at(y1,r1,j+1),d=at(y1,r1,j);
      tri(a.p,c.p,b.p,color,1,.8,0,[a.n,c.n,b.n]);tri(a.p,d.p,c.p,color,1,.8,0,[a.n,d.n,c.n]);
    }
  }
  const line=(a,b,r,c,shine=.25,alpha=1)=>tube([a,b],r,c,shine,alpha);
  function curve(fn,count=36){return Array.from({length:count+1},(_,i)=>fn(i/count));}
  // Skin surfaces have a very gentle organic contour; all anatomical depths are illustrative.
  const skinY=x=>2.05+.065*Math.sin(x*1.6)+.035*Math.sin(x*3.3);
  function slab(x0,x1,y0,y1,z0,z1,color,organic=false) {
    const seg=64,yt=x=>organic?skinY(x)+(y1-2.05):y1,yb=x=>organic?skinY(x)+(y0-2.05):y0;
    for(let i=0;i<seg;i++){
      const a=x0+(x1-x0)*i/seg,b=x0+(x1-x0)*(i+1)/seg;
      quad([a,yb(a),z1],[b,yb(b),z1],[b,yt(b),z1],[a,yt(a),z1],color);
      quad([a,yt(a),z1],[b,yt(b),z1],[b,yt(b),z0],[a,yt(a),z0],color);
    }
    quad([x1,y0,z1],[x1,y0,z0],[x1,yt(x1),z0],[x1,yt(x1),z1],color);
    quad([x0,y0,z0],[x0,y0,z1],[x0,yt(x0),z1],[x0,yt(x0),z0],color);
  }
  function skin({width=8.6,x=0,z=0,fibers=true,fat=true}={}) {
    const l=x-width/2,r=x+width/2,front=z+1.15,back=z-1.1;
    slab(l,r,-1.55,-1.25,back,front,C.muscle);
    for(let j=0;j<6;j++)line([l,-1.52+j*.045,front+.005],[r,-1.52+j*.045,front+.005],.012,C.fiber);
    slab(l,r,-1.25,-.12,back,front,C.fat);
    if(fat)for(let row=0;row<3;row++)for(let i=0;i<Math.ceil(width/.48);i++){
      const cx=l+.25+i*.47+(row%2)*.17;
      if(cx>r-.15)continue;
      ellipsoid([cx,-1.04+row*.34,front+.01],[.22+random()*.04,.19+random()*.02,.09],i%3===0?C.fatLight:C.fatEdge,.25,1,0,14,8);
    }
    slab(l,r,-.12,1.85,back,front,C.dermis,true);
    if(fibers)for(let j=0;j<150;j++) {
      const x0=l+.04+random()*(width-.7),len=Math.min(.5+random()*1.3,r-.03-x0),y=.07+random()*1.53,phase=random()*6.28,tilt=(random()-.5)*.28;
      tube(curve(t=>[x0+t*len,y+tilt*t+.055*Math.sin(t*6+phase),front+.008],16),.009+random()*.006,j%3===0?C.skin:C.fiber,.08,1,0,6);
    }
    for(let i=0;i<95;i++){
      const cx=l+.12+random()*(width-.24),cy=.03+random()*1.72;
      ellipsoid([cx,cy,front+.025],[.065,.023,.01],C.clay,.05,1,0,8,5);
    }
    slab(l,r,1.85,2.05,back,front,C.skin,true);
    // Fine surface relief is modeled geometry, not a noise/grain overlay.
    for(let j=0;j<120;j++){
      const xx=l+.04+random()*(width-.25),zz=back+.08+random()*2.04;
      tube(curve(t=>{const px=xx+t*.18;return[px,skinY(px)+.006,zz+.04*Math.sin(t*5)];},8),.004,C.fiber,.1,1,0,5);
    }
    tube(curve(t=>{const xx=l+t*width;return[xx,skinY(xx)-.19,front+.01];},80),.025,C.clay,.1);
  }
  function syringe(tip,dir=[-.65,.75,0],scale=1) {
    const d=norm(dir),at=s=>add(tip,mul(d,s*scale));
    line(tip,at(1.12),.025*scale,C.metal,.95);
    line(at(1.1),at(1.31),.11*scale,C.teal,.5);
    line(at(1.3),at(2.6),.17*scale,C.metal,.85);
    line(at(1.42),at(2.4),.175*scale,C.blue,.6);
    line(at(2.6),at(3.14),.065*scale,C.metal,.8);
    line(at(3.1),at(3.18),.26*scale,C.ink,.5);
    line(at(2.57),at(2.66),.27*scale,C.white,.7);
    for(let i=0;i<6;i++)line(at(1.45+i*.16),at(1.47+i*.16),.178*scale,C.teal,.6);
  }
  function handpiece(x,z=0,mode='rf',scale=1) {
    housing(x,z,[[2.19,.77],[2.3,.79],[2.45,.78],[2.55,.75]],C.metal);
    housing(x,z,[[2.54,.75],[2.64,.78],[2.9,.76],[3.3,.63],[3.7,.43],[4.1,.38],[4.2,.34]],C.ink);
    housing(x,z,[[3.55,.5],[3.64,.46],[3.72,.43]],C.metal);
    ellipsoid([x,2.18,z],[.79*scale,.07,.79*scale],C.cool,.7,1,0,48,12);
    if(mode==='rf'){
      ellipsoid([x,2.07,z+.2],[1.2,.025,.95],C.cool,.4,.38);
      // Broad tissue heating, not HIFU-like focal points.
      ellipsoid([x,.93,1.29],[1.6,.74,.055],C.heat,.1,.25);
      for(let i=0;i<7;i++)tube(curve(t=>[x-1.05+i*.35+.10*Math.sin(t*6),1.84-t*1.6,1.34]),.025,C.heat,.6,.74,.22);
    }
  }
  function lightTip(x,z=.1) {
    housing(x,z,[[2.65,.22],[2.76,.3],[3.03,.39],[3.7,.39],[3.9,.32]],C.metal);
    housing(x,z,[[2.65,.23],[2.72,.26],[2.78,.29]],C.ink);
  }
  function beads(points,color,r=.09) {points.forEach(p=>ellipsoid(p,[r,r,r],color,.65,1,0,14,9));}
  function network(cx,cy,z,size=1,color=C.teal) {
    for(let j=0;j<7;j++)tube(curve(t=>[cx+(t-.5)*size*2,cy+(j-3)*.11+.09*Math.sin(t*13+j),z+.03*Math.cos(t*10+j)]),.024,color,.4);
    for(let j=0;j<6;j++)tube(curve(t=>[cx+(j-2.5)*.25+.1*Math.sin(t*12+j),cy+(t-.5)*size*.9,z+.03]),.019,color,.4);
  }
  function follicle(cx=0,acne=false) {
    const fn=t=>[cx+.28*Math.sin(t*2),1.99-t*2.9,1.35];
    tube(curve(fn),t=>.22+.08*t,C.clay,.3);
    tube(curve(fn),t=>.145+.05*t,C.skin,.35);
    const end=fn(1);ellipsoid(end,[.3,.34,.16],C.clay,.4);
    if(!acne){
      tube(curve(t=>[cx+.12+.23*Math.sin(t*1.7),3.18-t*3.98,1.55]),t=>.037+.035*t,C.dark,.55);
      ellipsoid(add(end,[.035,.07,.16]),[.13,.2,.07],C.brown,.5);
    }else{
      ellipsoid([cx+.05,1.76,1.6],[.22,.22,.095],C.brown,.2);
      for(let i=0;i<14;i++)ellipsoid([cx-.15+random()*.42,1.4+random()*.75,1.65],[.07,.07,.045],C.fatEdge,.2,1,0,12,8);
      ellipsoid([cx+.7,.5,1.37],[.59,.4,.12],C.muscle,.3);
    }
    for(let i=0;i<5;i++)ellipsoid([cx+.45+i*.09,.86+(i%2)*.16,1.38],[.15,.17,.08],C.fatEdge,.25);
  }
  function build(kind) {
    if(kind==='botox'){
      // A magnified neuromuscular junction, intentionally separate from skin depth.
      for(let row=0;row<6;row++){
        const y=-1.35+row*.22;
        line([-3.8,y,.5],[3.8,y,.5],.18,row%2?C.muscle:C.fiber,.32);
        for(let x=-3.6;x<3.8;x+=.16)line([x,y-.12,.66],[x,y+.12,.66],.012,C.clay,.12);
      }
      tube(curve(t=>[-1.9+1.7*t,3.1-2.2*t,-.05]),t=>.22+t*.18,C.fatEdge,.4);
      ellipsoid([-.2,.86,.1],[.91,.56,.49],C.fatLight,.35);
      for(let i=0;i<18;i++)ellipsoid([-1+random()*1.55,.5+random()*.55,.49],[.085,.085,.055],C.gold,.35,1,0,14,8);
      beads([[-.51,.1,.58],[.18,-.02,.55],[.5,.2,.55]],C.gold,.065);
      beads([[-1.15,1.2,.55],[-.93,.82,.69],[-.88,.46,.62]],C.teal,.10);
      syringe([-1.35,1.44,.6],[-.8,.68,0],.58);
      for(let i=0;i<7;i++)tube([[-1.6+i*.53,-.1,.75],[-1.6+i*.53,-.23,.75],[-1.45+i*.53,-.23,.75],[-1.45+i*.53,-.1,.75]],.025,C.blue,.5);
      return;
    }
    if(kind==='laser'){
      // Three independent illustrations prevent confusing ultrasound, RF needles and light.
      for(let k=0;k<3;k++){
        const x=(k-1)*3.15;skin({width:2.7,x,fat:true});
        if(k===0){
          ellipsoid([x,2.65,0],[.82,.5,.52],C.ink,.75);
          for(let i=0;i<9;i++){
            const t=i/9,y=2-t*1.78,r=.7*(1-t)+.03;
            tube(curve(s=>[x+(s-.5)*r*2,y-.1*Math.sin(s*Math.PI),1.29]),.014,C.blue,.5,.7);
          }
          ellipsoid([x,.19,1.31],[.09,.13,.06],C.heat,.6,1,.4);
        }else if(k===1){
          ellipsoid([x,2.83,.25],[.8,.46,.6],C.ink,.65);
          for(let j=0;j<5;j++){
            line([x-.55+j*.275,2.5,1.3],[x-.55+j*.275,.8,1.3],.021,C.metal,.9);
            ellipsoid([x-.55+j*.275,.72,1.31],[.12,.2,.04],C.heat,.5,.65);
          }
        }else{
          lightTip(x);
          for(let j=0;j<3;j++)line([x-.18+j*.18,2.8,1.3],[x-.18+j*.18,.5,1.3],.022,C.heat,.5,.72);
          ellipsoid([x,.47,1.33],[.4,.17,.03],C.heat,.1,.3);
        }
      }
      return;
    }
    skin();
    if(kind==='rf')handpiece(-.25);
    if(kind==='filler'){
      syringe([-1.65,1.18,1.39],[-.65,.8,0],.7);
      for(const [x,y,rx,ry] of [[-1.8,1.14,.59,.18],[.25,-.02,.86,.32],[2,-.86,.7,.18]]){
        ellipsoid([x,y,1.35],[rx,ry,.19],C.blue,.85);
        ellipsoid([x-.15,y+.06,1.53],[rx*.55,ry*.26,.012],C.white,.6,.72);
      }
    }
    if(kind==='matrix'){
      syringe([-.98,1.03,1.42],[-.6,.8,0],.72);
      network(.2,.8,1.39,1.3,C.teal);network(2,.39,1.4,.65,C.teal);network(-2.35,.49,1.4,.65,C.teal);
    }
    if(kind==='collagen'){
      syringe([-.75,1.05,1.4],[-.6,.8,0],.7);
      network(-1.95,.69,1.4,1,C.teal);
      for(let i=0;i<17;i++){
        const x=.6+random()*2.55,y=.2+random()*1.24;
        ellipsoid([x,y,1.4],[.105,.105,.085],C.blue,.7);
      }
    }
    if(kind==='booster'){
      syringe([-.15,1.1,1.45],[-.6,.8,0],.7);
      for(let i=0;i<22;i++)ellipsoid([-2.7+random()*5.4,.15+random()*1.55,1.4],[.075,.075,.05],C.blue,.8);
      // Surface and tissue are both represented; no single mechanism for all boosters.
      ellipsoid([2.15,2.25,.3],[.33,.3,.3],C.blue,.8);
      ellipsoid([2.15,2.09,.3],[.75,.025,.55],C.blue,.6);
    }
    if(kind==='thread'){
      const path=curve(t=>[-3.35+t*6.4,.2+t*.78+.03*Math.sin(t*7),1.43]);
      tube(path,.037,C.blue,.8);
      for(let i=0;i<13;i++){
        const t=.08+i*.066,p=[-3.35+t*6.4,.2+t*.78,1.43];
        tube([add(p,[-.22,.2,.02]),p,add(p,[-.19,-.17,.01])],.028,C.blue,.65);
      }
      // Illustrative barbed thread, not a claim that all thread types share this structure.
      for(let i=0;i<4;i++)tube(curve(t=>[-2.8+t*5.5,-.15+i*.34+.14*Math.sin(t*6),1.3]),.015,C.skin,.2);
    }
    if(kind==='hair'){
      follicle(-.5,false);lightTip(1.75);
      line([1.6,2.67,1.41],[-.1,-.55,1.61],.034,C.heat,.6,.8);
      line([1.85,2.67,1.4],[.08,-.68,1.6],.022,C.heat,.6,.55);
      ellipsoid([-.08,-.55,1.67],[.42,.54,.035],C.heat,.1,.26);
    }
    if(kind==='acne'){
      follicle(-1.45,true);
      // A separate shallow contour represents a residual depressed scar.
      tube(curve(t=>[.85+t*2.4,2.01-.36*Math.sin(t*Math.PI)**3,1.35]),.075,C.clay,.3);
      ellipsoid([2.05,1.95,1.3],[.59,.12,.13],C.fiber,.25);
    }
    if(kind==='pigment'){
      lightTip(-.65);
      for(let j=0;j<3;j++)line([-.84+j*.18,2.67,1.41],[-.84+j*.18,.77,1.41],.022,C.heat,.6,.76);
      for(let i=0;i<30;i++){
        const x=-3.2+random()*2.1,y=.2+random()*1;
        ellipsoid([x,y,1.39],[.09,.085,.055],C.dark,.25,1,0,12,8);
      }
      for(let i=0;i<58;i++){
        const x=.3+random()*2.9,y=.1+random()*1.4;
        ellipsoid([x,y,1.39],[.035,.035,.025],C.dark,.25,1,0,10,6);
      }
      ellipsoid([-.65,.77,1.42],[.28,.28,.02],C.heat,.15,.3);
    }
  }
  function ortho(l,r,b,t,n,f){return [2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(f-n),0,-(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1];}
  function look(eye,target,up=[0,1,0]){const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1];}
  function mm(a,b){return Array.from({length:16},(_,i)=>{const c=Math.floor(i/4),r=i%4;return [0,1,2,3].reduce((s,k)=>s+a[k*4+r]*b[c*4+k],0);});}
  function program(v,f){const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,v));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;}
  const vs=`#version 300 es
    precision highp float;
    layout(location=0) in vec3 position;layout(location=1) in vec3 normal;layout(location=2) in vec4 color;layout(location=3) in vec2 material;
    uniform mat4 vp;uniform mat4 lightVP;out vec3 P;out vec3 N;out vec4 C;out vec2 M;out vec4 S;
    void main(){P=position;N=normal;C=color;M=material;S=lightVP*vec4(position,1.);gl_Position=vp*vec4(position,1.);}`;
  const fs=`#version 300 es
    precision highp float;
    in vec3 P;in vec3 N;in vec4 C;in vec2 M;in vec4 S;uniform vec3 eye;uniform sampler2D shadows;out vec4 outColor;
    void main(){vec3 n=normalize(N);if(!gl_FrontFacing)n=-n;vec3 l=normalize(vec3(-4.,8.,7.)),v=normalize(eye-P),h=normalize(l+v);float d=max(dot(n,l),0.);vec3 q=S.xyz/S.w*.5+.5;float sh=0.;float bias=max(.0018*(1.-d),.0005);
      for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)sh+=q.z-bias>texture(shadows,q.xy+vec2(x,y)/2048.).r?.38:1.;sh/=9.;
      float spec=pow(max(dot(n,h),0.),mix(14.,100.,M.x))*M.x*.7*sh;
      vec3 base=pow(C.rgb,vec3(2.2));float hemi=.35+.13*n.y;float rim=pow(1.-max(dot(n,v),0.),3.)*.13;
      vec3 lit=base*(hemi+d*sh*.85)+vec3(spec)+vec3(.6,.8,.9)*rim+base*M.y;
      outColor=vec4(pow(lit,vec3(1./2.2)),C.a);}`;
  const main=program(vs,fs),shadow=program(`#version 300 es
    layout(location=0) in vec3 position;uniform mat4 vp;void main(){gl_Position=vp*vec4(position,1.);}` ,`#version 300 es
    precision highp float;void main(){}`);
  const shadowTex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,shadowTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT24,2048,2048,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const framebuffer=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,shadowTex,0);gl.drawBuffers([gl.NONE]);gl.readBuffer(gl.NONE);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  function bind(data) {const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);for(const [loc,size,offset]of[[0,3,0],[1,3,3],[2,4,6],[3,2,10]]){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,48,offset*4);}return buf;}
  function project(p) {const q=[...p,1],v=[0,1,2,3].map(r=>q.reduce((s,x,k)=>s+camera[k*4+r]*x,0));return {x:(v[0]/v[3]+1)*50,y:(1-v[1]/v[3])*50};}
  window.renderPrinciple=(kind)=>{
    opaque=[];translucent=[];seed=17;build(kind);
    const eye=kind==='laser'?[3.6,4.5,16]:[4.2,4.6,15.5],target=[0,.85,0];
    camera=mm(ortho(-6.1,6.1,-3.8125,3.8125,.1,60),look(eye,target));
    const lightVP=mm(ortho(-8,8,-7,7,.1,40),look([-7,11,10],[0,0,0]));
    gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);gl.depthMask(true);
    gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.viewport(0,0,2048,2048);gl.clear(gl.DEPTH_BUFFER_BIT);gl.useProgram(shadow);gl.uniformMatrix4fv(gl.getUniformLocation(shadow,'vp'),false,lightVP);const a=bind(opaque);gl.drawArrays(gl.TRIANGLES,0,opaque.length/12);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(...rgb(C.bg),1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(main);gl.uniformMatrix4fv(gl.getUniformLocation(main,'vp'),false,camera);gl.uniformMatrix4fv(gl.getUniformLocation(main,'lightVP'),false,lightVP);gl.uniform3fv(gl.getUniformLocation(main,'eye'),eye);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,shadowTex);gl.uniform1i(gl.getUniformLocation(main,'shadows'),0);gl.drawArrays(gl.TRIANGLES,0,opaque.length/12);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);const b=bind(translucent);gl.drawArrays(gl.TRIANGLES,0,translucent.length/12);gl.depthMask(true);gl.finish();gl.deleteBuffer(a);gl.deleteBuffer(b);
    const targets={
      rf:[[-.25,2.08,1.15],[-.1,1.1,1.4],[2.1,.35,1.3]],
      filler:[[-1.8,1.14,1.5],[.25,-.02,1.5],[2,-.86,1.5]],
      botox:[[-.2,1.25,.55],[-.94,.68,.7],[1.9,-.67,.7]],
      matrix:[[-1,1.03,1.43],[.35,.8,1.43],[2.3,.35,1.4]],
      booster:[[-.15,1.1,1.45],[2.15,2.2,.3],[1.5,.4,1.4]],
      collagen:[[-1.95,.69,1.45],[1.8,.8,1.45]],
      laser:[[-3.15,.2,1.35],[0,.8,1.35],[3.15,.5,1.35]],
      thread:[[-1.8,.4,1.45],[.5,.7,1.45],[2.65,.95,1.45]],
      acne:[[-1.4,1.8,1.65],[-.75,.5,1.5],[2.05,1.8,1.4]],
      hair:[[1.3,2.25,1.4],[-.3,1.2,1.6],[-.1,-.6,1.65]],
      pigment:[[-.65,1.65,1.45],[-2.15,.6,1.45],[2.1,.6,1.45]],
    };
    return {kind,triangles:(opaque.length+translucent.length)/36,marks:targets[kind].map(p=>{const q=project(p);return{x:Math.round(q.x*10)/10,y:Math.round(q.y*10)/10};})};
  };
  window.renderPrinciple(new URLSearchParams(location.search).get('kind')||'rf');
})();
