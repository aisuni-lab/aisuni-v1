/* AisuniRisographDots — adaptación del lienzo del HTML entregado por Esteban. */
(()=>{'use strict';
const host=document.querySelector('#info-animation');
if(!host)return;
const canvas=host.querySelector('canvas');
const ctx=canvas.getContext('2d');
const styles=[
  {outer:'#FFDD00',ring:'#1C77A3',inner:'#FB2D74',ringRatio:.68,innerRatio:.34},
  {outer:'#FB2D74',ring:'#EB3D1E',inner:'#FFDD00',ringRatio:.66,innerRatio:.32},
  {outer:'#1C77A3',ring:'#C2D7E2',inner:'#FB2D74',ringRatio:.62,innerRatio:.30},
  {outer:'#EB3D1E',inner:'#FFDD00',innerRatio:.42},
  {outer:'#F6CDD4',inner:'#1C77A3',innerRatio:.45},
  {outer:'#FFDD00',inner:'#FB2D74',innerRatio:.48},
  {outer:'#FFDD00'},{outer:'#FB2D74'},{outer:'#1C77A3'},
  {outer:'#EB3D1E'},{outer:'#C2D7E2'},{outer:'#F6CDD4'}
];
const dots=[];
const pointer={x:-1e3,y:-1e3,prevX:-1e3,prevY:-1e3,vx:0,vy:0,active:false,radius:95};
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,dpr=1,lastWidth=0,lastHeight=0,scale=1,frame=0;
const bg=()=>getComputedStyle(host).getPropertyValue('--animation-bg').trim()||'#0A0C10';
function resize(){
  const rect=host.getBoundingClientRect();
  const nextWidth=Math.max(1,rect.width),nextHeight=Math.max(1,rect.height);
  width=nextWidth;height=nextHeight;dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  scale=Math.max(.42,Math.min(1,width/860));
  if(dots.length&&lastWidth&&lastHeight){
    const fx=width/lastWidth,fy=height/lastHeight;
    dots.forEach(d=>{d.x*=fx;d.y*=fy;d.radius*=Math.min(fx,fy);d.mass=d.radius*d.radius});
  }else if(!dots.length){
    const count=56,maxAttempts=1800;let attempts=0;
    while(dots.length<count&&attempts++<maxAttempts){
      const type=Math.random();let radius=(9+Math.random()*8)*scale;
      if(type>.82)radius=(19+Math.random()*8)*scale;else if(type>.60)radius=(14+Math.random()*4)*scale;
      const pad=radius+5,cx=pad+Math.random()*Math.max(0,width-pad*2),cy=pad+Math.random()*Math.max(0,height-pad*2);
      if(dots.some(d=>Math.hypot(cx-d.x,cy-d.y)<radius+d.radius+Math.max(3,12*scale)))continue;
      const angle=Math.random()*Math.PI*2,speed=(.15+Math.random()*.2)*scale;
      dots.push({x:cx,y:cy,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,radius,mass:radius*radius,style:styles[dots.length%styles.length]});
    }
  }
  lastWidth=width;lastHeight=height;
  paint();
}
function paint(){
  ctx.fillStyle=bg();ctx.fillRect(0,0,width,height);
  dots.forEach(d=>{
    ctx.beginPath();ctx.arc(d.x,d.y,d.radius,0,Math.PI*2);ctx.fillStyle=d.style.outer;ctx.fill();
    if(d.style.ring&&d.style.ringRatio){ctx.beginPath();ctx.arc(d.x,d.y,d.radius*d.style.ringRatio,0,Math.PI*2);ctx.fillStyle=d.style.ring;ctx.fill()}
    if(d.style.inner&&d.style.innerRatio){ctx.beginPath();ctx.arc(d.x,d.y,d.radius*d.style.innerRatio,0,Math.PI*2);ctx.fillStyle=d.style.inner;ctx.fill()}
  });
}
function tick(){
  const damping=.988,maxSpeed=3.2*scale,minSpeed=.18*scale,repel=1.8*scale;
  dots.forEach(d=>{
    if(pointer.active){const dx=d.x-pointer.x,dy=d.y-pointer.y,dist=Math.hypot(dx,dy),radius=pointer.radius*scale;
      if(dist<radius&&dist>.1){const norm=1-dist/radius,push=norm*norm*repel;d.vx+=(dx/dist)*push+pointer.vx*.12*norm;d.vy+=(dy/dist)*push+pointer.vy*.12*norm}}
    d.vx*=damping;d.vy*=damping;const speed=Math.hypot(d.vx,d.vy);
    if(speed>maxSpeed){d.vx=d.vx/speed*maxSpeed;d.vy=d.vy/speed*maxSpeed}
    else if(speed<minSpeed&&speed>.0001){d.vx=d.vx/speed*minSpeed;d.vy=d.vy/speed*minSpeed}
    d.x+=d.vx;d.y+=d.vy;
  });
  pointer.vx*=.5;pointer.vy*=.5;
  for(let pass=0;pass<4;pass++)for(let i=0;i<dots.length;i++){
    const a=dots[i];
    for(let j=i+1;j<dots.length;j++){
      const b=dots[j],dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy),minimum=a.radius+b.radius+.8*scale;
      if(dist<minimum&&dist>.001){const overlap=(minimum-dist)*.5,nx=dx/dist,ny=dy/dist;
        a.x-=nx*overlap;a.y-=ny*overlap;b.x+=nx*overlap;b.y+=ny*overlap;
        const relative=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
        if(relative>0){const impulse=1.88*relative/(a.mass+b.mass);a.vx-=impulse*b.mass*nx;a.vy-=impulse*b.mass*ny;b.vx+=impulse*a.mass*nx;b.vy+=impulse*a.mass*ny}
      }
    }
    const restitution=.85;
    if(a.x-a.radius<0){a.x=a.radius;a.vx=Math.abs(a.vx)*restitution}else if(a.x+a.radius>width){a.x=width-a.radius;a.vx=-Math.abs(a.vx)*restitution}
    if(a.y-a.radius<0){a.y=a.radius;a.vy=Math.abs(a.vy)*restitution}else if(a.y+a.radius>height){a.y=height-a.radius;a.vy=-Math.abs(a.vy)*restitution}
  }
  paint();
  if(!reducedMotion.matches)frame=requestAnimationFrame(tick);
}
function move(e){if(e.pointerType==='touch')return;const r=host.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  if(pointer.prevX!==-1e3){pointer.vx=x-pointer.prevX;pointer.vy=y-pointer.prevY}
  pointer.prevX=pointer.x=x;pointer.prevY=pointer.y=y;pointer.active=true;
}
function leave(){pointer.active=false;pointer.x=pointer.y=pointer.prevX=pointer.prevY=-1e3;pointer.vx=pointer.vy=0}
host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);
new ResizeObserver(resize).observe(host);
new MutationObserver(()=>paint()).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
reducedMotion.addEventListener?.('change',()=>{cancelAnimationFrame(frame);if(!reducedMotion.matches)frame=requestAnimationFrame(tick);else paint()});
resize();if(!reducedMotion.matches)frame=requestAnimationFrame(tick);
})();
