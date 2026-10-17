(()=>{'use strict';
const $=s=>document.querySelector(s),root=document.documentElement,esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=new URL('./',document.baseURI).href;
const asset=path=>{if(!path)return '';if(/^(https?:|data:|blob:|\/\/)/i.test(path))return path;return base+path.replace(/^\//,'')};
const categories=['Todos','Sistemas','Algoritmos','Tipografía','Simulación','Collage','Patrones','Procesos','Interfaces'];let data={proyectos:[],archivo:[],content:{}},filter='Todos',current=null,sequence=[],seqIndex=0,mediaIndex=0,tab='concept',lastFocus=null;
function nyc(){const now=new Date();$('#nyc-clock').textContent='NYC · '+new Intl.DateTimeFormat('en-GB',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now)}nyc();setInterval(nyc,1000);$('#copyright-year').textContent=new Date().getFullYear();
$('#theme-button').onclick=()=>{let t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('aisuni-theme',t)}catch(e){}};
$('#menu-button').onclick=()=>{const open=$('#nav').classList.toggle('open');$('#menu-button').setAttribute('aria-expanded',String(open))};document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{$('#nav').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false')}));
function preview(el,item){
if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
const h=$('#hover-preview');
let caption=h.querySelector('.hover-preview-caption');
if(!caption){caption=document.createElement('div');caption.className='hover-preview-caption';caption.innerHTML='<strong class="hover-preview-title"></strong><span class="hover-preview-tools"></span>';h.appendChild(caption)}
el.addEventListener('mouseenter',()=>{
const im=h.querySelector('img');im.src=asset(item.image);im.alt=item.title||'';
caption.querySelector('.hover-preview-title').textContent=item.title||'';
caption.querySelector('.hover-preview-tools').textContent=item.tools||item.categoryTag||item.category||'';
h.style.display='block';
});
el.addEventListener('mousemove',e=>{
const width=h.offsetWidth||290,height=h.offsetHeight||300,pad=12;
let left=e.clientX+20,top=e.clientY+18;
if(left+width+pad>innerWidth)left=e.clientX-width-20;
if(top+height+pad>innerHeight)top=e.clientY-height-18;
h.style.left=Math.max(pad,Math.min(left,innerWidth-width-pad))+'px';
h.style.top=Math.max(pad,Math.min(top,innerHeight-height-pad))+'px';
});
el.addEventListener('mouseleave',()=>{h.style.display='none'});
}
function makeRow(item){const el=document.createElement('button');el.type='button';el.className='project-row';el.innerHTML=`<span class="project-num">${esc(item.num)}</span><span class="project-name">${esc(item.title)}<small>${esc(item.categoryTag)}</small></span><img class="project-thumb" loading="lazy" src="${esc(asset(item.image))}" alt="Vista previa de ${esc(item.title)}"><span class="project-meta">${esc(item.categoryTag)}</span><span class="project-year">${esc(item.year)}</span><span class="project-arrow">→</span>`;el.onclick=()=>openModal('proyectos',item.id);preview(el,item);return el}
function renderProjects(){const host=$('#project-list');host.replaceChildren();const shown=data.proyectos.filter(x=>filter==='Todos'||x.category===filter||(x.categoryTag||'').split(/\s*[&/,]\s*/).includes(filter));if(!shown.length){host.innerHTML='<p class="copy">No hay proyectos en esta disciplina.</p>';return}shown.forEach(i=>host.appendChild(makeRow(i)))}
function renderFilters(){let f=$('#filters');categories.forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=c;b.className=c===filter?'active':'';b.setAttribute('aria-pressed',String(c===filter));b.onclick=()=>{filter=c;[...f.children].forEach(btn=>{btn.classList.toggle('active',btn.textContent===c);btn.setAttribute('aria-pressed',String(btn.textContent===c))});renderProjects()};f.appendChild(b)})}
function renderArchive(){const a=$('#archive-list');a.replaceChildren();$('#archive-count').textContent=String(data.archivo.length).padStart(2,'0');data.archivo.forEach(item=>{const b=document.createElement('button');b.className='archive-card';b.innerHTML=`<img loading="lazy" src="${esc(asset(item.image))}" alt="${esc(item.title)}"><div class="archive-card-info"><span class="mono">${esc(item.num)}</span><div><strong>${esc(item.title)}</strong><span class="archive-meta">${esc(item.category)} · ${esc(item.year)} · ${esc(item.status)}</span></div><span aria-hidden="true">↗</span></div>`;b.onclick=()=>openModal('archivo',item.id);preview(b,item);a.appendChild(b)})}
// El número editorial manda; los nuevos registros aparecen primero.
function orderNewestFirst(items){return [...(items||[])].sort((a,b)=>{const n=x=>{const v=String(x.num??'').match(/\d+/);return v?Number(v[0]):-1};return n(b)-n(a)||Number(b.year||0)-Number(a.year||0)||String(a.id||'').localeCompare(String(b.id||''))})}
function renderInformationLists(){
 const section=document.querySelector('#info');if(!section)return;
 let host=section.querySelector('#info-lists');if(!host){host=document.createElement('div');host.id='info-lists';host.className='info-lists';section.appendChild(host)}
 host.replaceChildren();
 const cols=[{key:'colaboraciones',fallback:'CLIENTES & COLABORACIONES SELECCIONADAS'},{key:'actividades',fallback:'CHARLAS, EXPOSICIONES & PUBLICACIONES'}];
 cols.forEach(({key,fallback})=>{
   const source=(data.content||{})[key]||{},col=document.createElement('div');col.className='info-list-column';
   const heading=document.createElement('h3');heading.className='info-list-heading';heading.textContent=source.title||fallback;col.appendChild(heading);
   const rows=Array.isArray(source.entries)?source.entries:[];
   rows.forEach(e=>{const r=document.createElement('div');r.className='info-list-entry';
     if(key==='actividades'){
       const year=document.createElement('span');year.className='info-entry-year';year.textContent=String(e.year||'');r.appendChild(year)
     }
     const primary=document.createElement('div');primary.className='info-entry-name';
     const title=String(e.name||e.title||'');
     if(e.url&&/^https:\/\//i.test(e.url)){const a=document.createElement('a');a.href=e.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=title;primary.appendChild(a)}else primary.textContent=title;
     if(e.description){const desc=document.createElement('span');desc.className='info-entry-description';desc.textContent=' — '+String(e.description);primary.appendChild(desc)}
     r.appendChild(primary);
     const meta=document.createElement('span');meta.className='info-entry-meta';meta.textContent=String(e.location||e.note||'');r.appendChild(meta);col.appendChild(r)
   });host.appendChild(col)
 })
}
function renderContent(){renderInformationLists();const c=data.content||{};const hero=c.portada||{};$('#hero-label').textContent=hero.label||'ARCHIVO ACTIVO';if(hero.title)$('#hero-title').textContent=hero.title;if(hero.body)$('#hero-body').innerHTML=hero.body;const heroImg=$('#hero-figure');heroImg.hidden=!hero.image;$('#hero-grid').classList.toggle('has-image',!!hero.image);if(hero.image)$('#hero-image').src=asset(hero.image);const info=c.info||{};if(info.title)$('#info-title').textContent=info.title;if(info.body)$('#info-body').innerHTML=info.body;if(info.image)$('#info-image').src=asset(info.image);if(Array.isArray(info.tags))$('#info-tags').innerHTML=info.tags.map(t=>`<span>${esc(t)}</span>`).join('');const ct=c.contacto||{};$('#contact-title').textContent=ct.title||'Contacto';$('#contact-body').innerHTML=ct.body||'';const email=ct.email||'contacto@aisuni.art';$('#email-link').textContent=email;$('#email-link').href='mailto:'+encodeURIComponent(email);$('#copy-email').onclick=async()=>{try{await navigator.clipboard.writeText(email);toast('¡Copiado!')}catch(e){toast('Selecciona el correo para copiarlo')}};$('#social').innerHTML=(ct.links||[]).filter(l=>/^https:\/\//.test(l.url||'')).map(l=>`<a target="_blank" rel="noopener noreferrer" href="${esc(l.url)}">${esc(l.label)} ↗</a>`).join('')}
function toast(str){const t=$('#toast');t.textContent=str;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),1900)}
function gallery(item){let raw=(Array.isArray(item.media)&&item.media.length?item.media:item.gallery||[]);if(!raw.length&&item.image)raw=[item.image];return raw.map(entry=>{let m=typeof entry==='string'?{src:entry}:entry||{};let src=m.src||m.url||'';let type=(m.type||(/\.(mp4)(\?|$)/i.test(src)?'mp4':/youtube\.com|youtu\.be/.test(src)?'youtube':/vimeo\.com/.test(src)?'vimeo':'image')).toLowerCase();return {...m,src,type}}).filter(x=>x.src)}
function videoEmbed(m){try{let u=new URL(m.src);if(m.type==='youtube'&&['youtube.com','www.youtube.com','m.youtube.com','youtu.be','www.youtube-nocookie.com'].includes(u.hostname)){let id=u.hostname.includes('youtu.be')?u.pathname.slice(1):u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop();if(/^[\w-]{11}$/.test(id))return 'https://www.youtube-nocookie.com/embed/'+id}if(m.type==='vimeo'&&['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(u.hostname)){let id=u.pathname.split('/').filter(Boolean).pop();if(/^\d+$/.test(id))return 'https://player.vimeo.com/video/'+id}}catch(e){}return null}
function showMedia(){const m=gallery(current)[mediaIndex],main=$('#media-main');main.replaceChildren();if(!m)return;if(m.type==='image'){const el=document.createElement('img');el.src=asset(m.src);el.alt=m.alt||current.title;main.appendChild(el)}else if(m.type==='mp4'){const el=document.createElement('video');el.src=asset(m.src);el.controls=true;el.playsInline=true;el.preload='metadata';if(m.poster)el.poster=asset(m.poster);main.appendChild(el)}else{const url=videoEmbed(m);if(url){const iframe=document.createElement('iframe');iframe.src=url;iframe.title=m.alt||current.title+' video';iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;main.appendChild(iframe)}else main.textContent='Enlace de video no válido.'}const bar=$('#media-thumbs');bar.replaceChildren();gallery(current).forEach((x,i)=>{let b=document.createElement('button');b.type='button';b.className=i===mediaIndex?'selected':'';b.setAttribute('aria-label','Mostrar recurso '+(i+1));if(x.type==='image'||x.poster){let im=document.createElement('img');im.src=asset(x.type==='image'?x.src:x.poster);im.alt='';b.appendChild(im)}else b.innerHTML='<span class="thumb-video">▶ '+esc(x.type.toUpperCase())+'</span>';b.onclick=()=>{mediaIndex=i;showMedia()};bar.appendChild(b)});const active=bar.querySelector('.selected');if(active)active.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'})}
// Divide las secciones a partir de encabezados HTML producidos por Jekyll.
// Admite: ## Concepto, ## Concepto & Enfoque, ## Proceso,
// ## Proceso & Algoritmo, encabezados con <a>/<span>, entidades y acentos.
function splitDocumentation(item){
  const original=String(item.concept||'');
  const existing=String(item.process||'').trim();
  if(!original.trim()){item.concept='';item.process=existing;return;}
  const template=document.createElement('template');
  template.innerHTML=original;
  const root=template.content;
  const normalize=str=>String(str||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
  const headingKind=text=>{
    const h=normalize(text).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
    if(/^proceso(?: (?:y )?algoritmo(?:s)?)?$/.test(h)||h.startsWith('proceso algoritmo')||h.startsWith('proceso y algoritmo'))return 'process';
    if(/^concepto(?: (?:y )?enfoque)?$/.test(h))return 'concept';
    return null;
  };
  const headings=[...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>headingKind(h.textContent));
  // Markdown compilado con saltos de línea escapados: por seguridad
  // también se acepta el formato Markdown original si algún template lo entrega.
  if(!headings.length){
    const parts=original.split(/(?:^|\n)#{1,6}\s+Proceso(?:\s*(?:&|y|\+)\s*Algoritmos?)?\s*(?:\r?\n|$)/i);
    if(parts.length>1){item.concept=parts.shift().replace(/(?:^|\n)#{1,6}\s+Concepto(?:\s*(?:&|y|\+)\s*Enfoque)?[^\n]*\n?/i,'').trim();item.process=parts.join('\n').trim()||existing;return;}
    item.concept=original;item.process=existing;return;
  }
  const sections={concept:[],process:[]};
  let active='concept';
  for(const node of [...root.childNodes]){
    if(node.nodeType===1&&/^H[1-6]$/.test(node.nodeName)){
      const kind=headingKind(node.textContent);
      if(kind){active=kind;continue;}
    }
    const holder=document.createElement('div');holder.appendChild(node.cloneNode(true));
    sections[active].push(holder.innerHTML);
  }
  item.concept=sections.concept.join('').trim();
  item.process=sections.process.join('').trim()||existing;
}
function showTab(){document.querySelectorAll('.detail-tabs button').forEach(b=>b.setAttribute('aria-selected',String(b.id===(tab==='concept'?'tab-concept':'tab-process'))));$('#modal-text').innerHTML=current[tab]||'<p>No hay documentación disponible todavía.</p>'}
function populate(){let item=current;$('#modal-type').textContent=sequence===data.proyectos?'PROYECTO':'ARCHIVO ACTIVO';$('#modal-title').textContent=item.title;$('#modal-category').textContent=item.categoryTag||item.category;$('#modal-client').textContent=item.client||'—';$('#modal-year').textContent=item.year||'—';$('#modal-tools').textContent=item.tools||'—';$('#modal-status').textContent=item.status||'—';$('#modal-counter').textContent=String(seqIndex+1).padStart(2,'0')+' / '+String(sequence.length).padStart(2,'0');mediaIndex=0;tab='concept';showTab();showMedia()}
function openModal(collection,id){sequence=data[collection]||[];seqIndex=sequence.findIndex(i=>i.id===id);if(seqIndex<0)return;current=sequence[seqIndex];lastFocus=document.activeElement;$('#hover-preview').style.display='none';$('#modal').classList.add('open');$('#modal').setAttribute('aria-hidden','false');document.body.classList.add('modal-open');populate();$('#close-modal').focus();history.replaceState(null,'','#'+encodeURIComponent(collection)+'/'+encodeURIComponent(id))}
function closeModal(){if(!current)return;$('#modal').classList.remove('open');$('#modal').setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');$('#media-main').replaceChildren();current=null;history.replaceState(null,'','#proyectos');lastFocus?.focus?.()}
function changeItem(delta){if(!current)return;seqIndex=(seqIndex+delta+sequence.length)%sequence.length;current=sequence[seqIndex];populate();history.replaceState(null,'','#'+(sequence===data.proyectos?'proyectos':'archivo')+'/'+encodeURIComponent(current.id))}
$('#close-modal').onclick=closeModal;$('#prev-item').onclick=()=>changeItem(-1);$('#next-item').onclick=()=>changeItem(1);$('#tab-concept').onclick=()=>{tab='concept';showTab()};$('#tab-process').onclick=()=>{tab='process';showTab()};$('#modal').addEventListener('click',e=>{if(e.target===$('#modal'))closeModal()});document.addEventListener('keydown',e=>{if(!current)return;if(e.key==='Escape'){e.preventDefault();closeModal()}else if(e.key==='ArrowLeft'){e.preventDefault();changeItem(-1)}else if(e.key==='ArrowRight'){e.preventDefault();changeItem(1)}else if(e.key==='Tab'){const focus=[...$('#modal').querySelectorAll('button,a[href],iframe,video')].filter(el=>!el.disabled);let first=focus[0],last=focus[focus.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
async function init(){renderFilters();let json;try{const res=await fetch(asset('data.json')+'?v='+Date.now(),{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);json=await res.json();if(!json||!Array.isArray(json.proyectos)||!Array.isArray(json.archivo))throw Error('data.json incompleto');}catch(e){if(location.protocol==='file:'){try{json=JSON.parse($('#aisuni-fallback')?.textContent||'null')}catch(_){json=null}}if(!json){const msg='No se pudo cargar data.json ('+String(e.message||e)+'). Revisa GitHub Actions → última ejecución → build, y confirma que Pages usa GitHub Actions. No se muestran datos antiguos como si fueran actuales.';$('#project-list').replaceChildren();const el=document.createElement('p');el.className='load-error';el.textContent=msg;$('#project-list').appendChild(el);console.error('AISUNI:',msg);return}}data=json;data.proyectos=orderNewestFirst(data.proyectos);data.archivo=orderNewestFirst(data.archivo);[...data.proyectos,...data.archivo].forEach(splitDocumentation);renderContent();renderProjects();renderArchive();let match=decodeURIComponent(location.hash.slice(1)).match(/^(proyectos|archivo)\/(.+)$/);if(match)openModal(match[1],match[2])}init();
})();
