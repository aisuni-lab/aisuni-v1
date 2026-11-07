/* AisuniRisographDots — jerarquía pronunciada de tamaños, adaptada del HTML de Esteban. */
(()=>{'use strict';
const host=document.querySelector('#info-animation');
if(!host)return;
const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d');
const heroStyles=[
  {outer:'#FFDD00',ring:'#1C77A3',inner:'#FB2D74',ringRatio:.68,innerRatio:.34},
  {outer:'#FB2D74',ring:'#EB3D1E',inner:'#FFDD00',ringRatio:.66,innerRatio:.32},
  {outer:'#1C77A3',ring:'#C2D7E2',inner:'#FB2D74',ringRatio:.62,innerRatio:.30},
  {outer:'#EB3D1E',inner:'#FFDD00',innerRatio:.44}
];
const standardStyles=[
  {outer:'#FFDD00',inner:'#1C77A3',innerRatio:.45},
  {outer:'#FB2D74',inner:'#EB3D1E',innerRatio:.42},
  {outer:'#F6CDD4',inner:'#1C77A3',innerRatio:.46},
  {outer:'#FFDD00'},{outer:'#FB2D74'},{outer:'#1C77A3'},
  {outer:'#EB3D1E'},{outer:'#C2D7E2'},{outer:'#F6CDD4'}
];
const tiers=[
  {count:3,min:46,max:58,hero:true},
  {count:5,min:30,max:38,hero:true},
  {count:10,min:17,max:24},
  {count:12,min:9,max:13},
  {count:8,min:5,max:7}
];
const dots=[],pointer={x:-1e3,y:-1e3,prevX:-1e3,prevY:-1e3,vx:0,vy:0,active:false,radius:125};
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,dpr=1,lastWidth=0,lastHeight=0,scale=1,frame=0;
const bg=()=>getComputedStyle(host).getPropertyValue('--animation-bg').trim()||'#0A0C10';
function placeDots(){
  let index=0;
  for(const tier of tiers)for(let k=0;k<tier.count;k++){
    const radius=(tier.min+Math.random()*(tier.max-tier.min))*scale;
    let x=0,y=0,placed=false,attempts=0;
    while(!placed&&attempts++<1200){
      const pad=radius+4;
      x=pad+Math.random()*Math.max(0,width-pad*2);
      y=pad+Math.random()*Math.max(0,height-pad*2);
      placed=!dots.some(other=>Math.hypot(x-other.x,y-other.y)<radius+other.radius+Math.max(2,8*scale));
    }
    if(!placed)continue;
    const styles=tier.hero?heroStyles:standardStyles,angle=Math.random()*Math.PI*2;
    const speed=tier.hero ? .08+Math.random()*.1 : .18+Math.random()*.22;
    dots.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,radius,mass:Math.pow(radius,1.8),style:styles[index%styles.length]});
    index++;
  }
}
function resize(){
  const rect=host.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
  dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  scale=Math.max(.42,Math.min(1,width/860));
  if(dots.length&&lastWidth&&lastHeight){const fx=width/lastWidth,fy=height/lastHeight,f=Math.min(fx,fy);dots.forEach(d=>{d.x*=fx;d.y*=fy;d.radius*=f;d.mass=Math.pow(d.radius,1.8)})}
  else if(!dots.length)placeDots();
  lastWidth=width;lastHeight=height;paint();
}
function paint(){
  ctx.fillStyle=bg();ctx.fillRect(0,0,width,height);
  for(const d of [...dots].sort((a,b)=>b.radius-a.radius)){
    const s=d.style;ctx.beginPath();ctx.arc(d.x,d.y,d.radius,0,Math.PI*2);ctx.fillStyle=s.outer;ctx.fill();
    if(s.ring&&s.ringRatio&&d.radius>12){ctx.beginPath();ctx.arc(d.x,d.y,d.radius*s.ringRatio,0,Math.PI*2);ctx.fillStyle=s.ring;ctx.fill()}
    if(s.inner&&s.innerRatio&&d.radius>8){ctx.beginPath();ctx.arc(d.x,d.y,d.radius*s.innerRatio,0,Math.PI*2);ctx.fillStyle=s.inner;ctx.fill()}
  }
}
function tick(){
  const damping=.988,maxSpeed=3.4,minSpeed=.14,repel=2.2;
  for(const d of dots){
    if(pointer.active){const dx=d.x-pointer.x,dy=d.y-pointer.y,dist=Math.hypot(dx,dy),radius=pointer.radius*scale+d.radius*.4;
      if(dist<radius&&dist>.1){const norm=1-dist/radius,factor=Math.min(2,140/(d.radius+30)),push=norm*norm*repel*factor;d.vx+=(dx/dist)*push+pointer.vx*.12*norm*factor*.5;d.vy+=(dy/dist)*push+pointer.vy*.12*norm*factor*.5}}
    d.vx*=damping;d.vy*=damping;const speed=Math.hypot(d.vx,d.vy);
    if(speed>maxSpeed){d.vx=d.vx/speed*maxSpeed;d.vy=d.vy/speed*maxSpeed}else if(speed<minSpeed&&speed>.0001){d.vx=d.vx/speed*minSpeed;d.vy=d.vy/speed*minSpeed}
    d.x+=d.vx;d.y+=d.vy;
  }
  pointer.vx*=.5;pointer.vy*=.5;
  for(let pass=0;pass<4;pass++)for(let i=0;i<dots.length;i++){
    const a=dots[i];
    for(let j=i+1;j<dots.length;j++){
      const b=dots[j],dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy),minimum=a.radius+b.radius+.8*scale;
      if(dist<minimum&&dist>.001){const overlap=(minimum-dist)*.5,nx=dx/dist,ny=dy/dist,total=a.mass+b.mass,w1=b.mass/total,w2=a.mass/total;
        a.x-=nx*overlap*2*w1;a.y-=ny*overlap*2*w1;b.x+=nx*overlap*2*w2;b.y+=ny*overlap*2*w2;
        const relative=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
        if(relative>0){const impulse=1.88*relative/total;a.vx-=impulse*b.mass*nx;a.vy-=impulse*b.mass*ny;b.vx+=impulse*a.mass*nx;b.vy+=impulse*a.mass*ny}}
    }
    const restitution=.85;
    if(a.x-a.radius<0){a.x=a.radius;a.vx=Math.abs(a.vx)*restitution}else if(a.x+a.radius>width){a.x=width-a.radius;a.vx=-Math.abs(a.vx)*restitution}
    if(a.y-a.radius<0){a.y=a.radius;a.vy=Math.abs(a.vy)*restitution}else if(a.y+a.radius>height){a.y=height-a.radius;a.vy=-Math.abs(a.vy)*restitution}
  }
  paint();if(!reducedMotion.matches)frame=requestAnimationFrame(tick);
}
function move(e){if(e.pointerType==='touch')return;const r=host.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(pointer.prevX!==-1e3){pointer.vx=x-pointer.prevX;pointer.vy=y-pointer.prevY}pointer.prevX=pointer.x=x;pointer.prevY=pointer.y=y;pointer.active=true}
function leave(){pointer.active=false;pointer.x=pointer.y=pointer.prevX=pointer.prevY=-1e3;pointer.vx=pointer.vy=0}
host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);new ResizeObserver(resize).observe(host);
new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
reducedMotion.addEventListener?.('change',()=>{cancelAnimationFrame(frame);if(!reducedMotion.matches)frame=requestAnimationFrame(tick);else paint()});
resize();if(!reducedMotion.matches)frame=requestAnimationFrame(tick);
})();
