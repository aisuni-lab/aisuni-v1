/* AisuniRisographDots — 46 círculos y combinaciones cromáticas únicas, adaptada del HTML de Esteban. */
(()=>{'use strict';
const host=document.querySelector('#info-animation');
if(!host)return;
const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d');
const P={yellow:'#FFDD00',pink:'#FB2D74',vermilion:'#EB3D1E',blue:'#1C77A3',ice:'#C2D7E2',rose:'#F6CDD4',orange:'#EA5C1F',navy:'#0C3C60'};
const concentric=[
  {outer:P.yellow,ring:P.blue,inner:P.pink,ringRatio:.68,innerRatio:.34},{outer:P.pink,ring:P.vermilion,inner:P.yellow,ringRatio:.66,innerRatio:.32},
  {outer:P.blue,ring:P.ice,inner:P.pink,ringRatio:.62,innerRatio:.30},{outer:P.vermilion,ring:P.yellow,inner:P.blue,ringRatio:.65,innerRatio:.32},
  {outer:P.ice,ring:P.pink,inner:P.vermilion,ringRatio:.64,innerRatio:.30},{outer:P.pink,ring:P.rose,inner:P.blue,ringRatio:.68,innerRatio:.34},
  {outer:P.yellow,ring:P.orange,inner:P.navy,ringRatio:.65,innerRatio:.32},{outer:P.blue,ring:P.vermilion,inner:P.yellow,ringRatio:.64,innerRatio:.30},
  {outer:P.vermilion,ring:P.blue,inner:P.ice,ringRatio:.66,innerRatio:.32},{outer:P.rose,ring:P.blue,inner:P.yellow,ringRatio:.68,innerRatio:.34},
  {outer:P.pink,ring:P.blue,inner:P.ice,ringRatio:.62,innerRatio:.30},{outer:P.yellow,ring:P.rose,inner:P.pink,ringRatio:.66,innerRatio:.32},
  {outer:P.blue,ring:P.yellow,inner:P.vermilion,ringRatio:.64,innerRatio:.30},{outer:P.orange,ring:P.ice,inner:P.pink,ringRatio:.65,innerRatio:.32},
  {outer:P.vermilion,inner:P.yellow,innerRatio:.44},{outer:P.rose,inner:P.blue,innerRatio:.46},
  {outer:P.yellow,inner:P.pink,innerRatio:.48},{outer:P.blue,inner:P.yellow,innerRatio:.45},
  {outer:P.pink,inner:P.ice,innerRatio:.42},{outer:P.ice,inner:P.vermilion,innerRatio:.44},
  {outer:P.yellow,inner:P.blue,innerRatio:.46},{outer:P.pink,inner:P.vermilion,innerRatio:.42},
  {outer:P.blue,inner:P.pink,innerRatio:.44},{outer:P.vermilion,inner:P.ice,innerRatio:.40},
  {outer:P.orange,inner:P.yellow,innerRatio:.48},{outer:P.blue,inner:P.rose,innerRatio:.45},
  {outer:P.rose,inner:P.vermilion,innerRatio:.42},{outer:P.ice,inner:P.blue,innerRatio:.46},
  {outer:P.pink,inner:P.yellow,innerRatio:.44},{outer:P.navy,inner:P.yellow,innerRatio:.42},
  {outer:P.vermilion,inner:P.rose,innerRatio:.44},{outer:P.yellow,inner:P.vermilion,innerRatio:.42}
];
const solids=[P.yellow,P.pink,P.blue,P.vermilion,P.ice,P.rose,P.orange,P.navy].map(outer=>({outer}));
const tiers=[{count:4,min:44,max:56,concentric:true},{count:6,min:28,max:37,concentric:true},{count:12,min:16,max:24,concentric:true},{count:14,min:9,max:13},{count:10,min:5,max:7.5}];
const dots=[],pointer={x:-1e3,y:-1e3,prevX:-1e3,prevY:-1e3,vx:0,vy:0,active:false,radius:125};
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,dpr=1,lastWidth=0,lastHeight=0,scale=1,frame=0,concentricIndex=0,solidIndex=0;
const bg=()=>getComputedStyle(host).getPropertyValue('--animation-bg').trim()||'#0A0C10';
function placeDots(){
  for(const tier of tiers)for(let k=0;k<tier.count;k++){
    const radius=(tier.min+Math.random()*(tier.max-tier.min))*scale;
    let x=0,y=0,placed=false,attempts=0;
    while(!placed&&attempts++<1200){const pad=radius+4;x=pad+Math.random()*Math.max(0,width-pad*2);y=pad+Math.random()*Math.max(0,height-pad*2);placed=!dots.some(d=>Math.hypot(x-d.x,y-d.y)<radius+d.radius+Math.max(2,6*scale))}
    if(!placed)continue;
    const style=(tier.concentric||radius>=10)&&concentricIndex<concentric.length?concentric[concentricIndex++]:solids[solidIndex++%solids.length];
    const angle=Math.random()*Math.PI*2,large=radius>25,speed=large ? .08+Math.random()*.1 : .16+Math.random()*.2;
    dots.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,radius,mass:Math.pow(radius,1.8),style});
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
    if(s.ring&&s.ringRatio&&d.radius>11){ctx.beginPath();ctx.arc(d.x,d.y,d.radius*s.ringRatio,0,Math.PI*2);ctx.fillStyle=s.ring;ctx.fill()}
    if(s.inner&&s.innerRatio&&d.radius>7){ctx.beginPath();ctx.arc(d.x,d.y,d.radius*s.innerRatio,0,Math.PI*2);ctx.fillStyle=s.inner;ctx.fill()}
  }
}
function tick(){
  const damping=.988,maxSpeed=3.3,minSpeed=.14,repel=2.1;
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
