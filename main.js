import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

const stages=[
 {name:'Entrada e acolhimento',short:'Entrada',verb:'A história começa',icon:'🎀',color:0xc33e40,pos:[-7,0,-8.2],camera:[-7,11,2],focus:[-7,0,-8],text:'A família entra em um Natal ainda incompleto e recebe uma identidade compartilhada. A Fita de Autoria é uma hipótese conceitual, não uma tecnologia definida.',quote:'“Guardem esta fita. Ela vai lembrar o que vocês fizeram.”'},
 {name:'Tortuguita',short:'Tortuguita',verb:'Imaginar',icon:'🐢',color:0x338760,pos:[-6.4,0,-2.5],camera:[-13,9,-0.5],focus:[-6.3,0,-2.5],text:'A criança escolhe como seu Natal começa. Essa escolha gera um sinal reconhecível que reaparecerá ao final da experiência.',quote:'“Essa é a nossa.”'},
 {name:'Block',short:'Block',verb:'Fazer acontecer',icon:'⚡',color:0x225ecb,pos:[-6.2,0,5.3],camera:[-13,10,11],focus:[-6.2,0,5.3],text:'Construir, tentar, movimentar e vencer pequenos desafios transforma uma ideia em consequência real. O cenário responde ao esforço da família.',quote:'“Nós fizemos isso acontecer.”'},
 {name:'Butter Toffees',short:'Butter Toffees',verb:'Encontrar o outro',icon:'🤝',color:0xc68d51,pos:[6.0,0,4.9],camera:[13,9,11],focus:[6.0,0,4.9],text:'A família desacelera e descobre que vencer sozinho ou mais rápido não basta: é preciso ceder, esperar e sincronizar o próprio ritmo ao do outro.',quote:'“Só aconteceu porque fizemos juntos.”'},
 {name:'Clímax Arcor',short:'Clímax',verb:'Reconhecer',icon:'✦',color:0xd1a45c,pos:[0.8,0,0.7],camera:[11,13,-4],focus:[0.8,0,0.7],text:'O ambiente revela sinais identificáveis das escolhas e ações da família. As contribuições coletivas enriquecem, mas uma única família deve viver um clímax completo.',quote:'“A nossa está ali.”'},
 {name:'Bon o Bon',short:'Bon o Bon',verb:'Passar adiante',icon:'🎁',color:0xbf3d45,pos:[6.6,0,-5.2],camera:[12,9,-10],focus:[6.6,0,-5.2],text:'O que foi construído ganha significado de presente. Bon o Bon transforma a conquista em um gesto para guardar e compartilhar, não em uma recompensa desconectada.',quote:'“Um é nosso. O outro é para alguém.”'},
 {name:'Saída',short:'Saída',verb:'O Natal continua',icon:'↗',color:0xdca85d,pos:[6,0,-9],camera:[13,9,-13],focus:[6,0,-9],text:'A família sai como autora de algo que não estava pronto quando chegou. O Natal continua na forma como as pessoas cuidam umas das outras.',quote:'“O Natal que criamos segue com a gente.”'}
];
const mount=document.querySelector('#viewport'),labelContainer=document.querySelector('#labels');
const scene=new THREE.Scene();scene.background=new THREE.Color('#132332');scene.fog=new THREE.FogExp2(0x132332,.012);
const camera=new THREE.PerspectiveCamera(40,1,.1,180);camera.position.set(29,35,35);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.6;mount.append(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=10;controls.maxDistance=75;controls.maxPolarAngle=Math.PI/2.05;controls.target.set(0,0,0);
scene.add(new THREE.HemisphereLight(0xb8d9ef,0x142332,2.8));const sun=new THREE.DirectionalLight(0xffd7a7,2.8);sun.position.set(-8,22,13);scene.add(sun);const blue=new THREE.PointLight(0x4c84ff,52,30);blue.position.set(-7,8,4);scene.add(blue);
const objects=[],animated=[],pickMeshes=[],labelPoints=[];let active=-1,tourMode=false,tourTimer=0;
function mat(color,metalness=.2,roughness=.48){return new THREE.MeshStandardMaterial({color,metalness,roughness})}
const materials={gold:mat(0xeac487,.7,.24),cream:mat(0xfff1d7),red:mat(0xb5363d,.4,.32),green:mat(0x175c42,.25,.6),dark:mat(0x192c37,.3,.47),path:mat(0xe9c394,.32,.4),wood:mat(0x75523a),snow:mat(0xe4e8e9)};
function mesh(geo,material,x,y,z,parent=scene){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);parent.add(m);return m}
function box(w,h,d,x,y,z,material,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),material,x,y,z,parent)}
function cylinder(rTop,rBottom,h,x,y,z,material,parent=scene,sides=24){return mesh(new THREE.CylinderGeometry(rTop,rBottom,h,sides),material,x,y,z,parent)}
function ball(r,x,y,z,material,parent=scene){return mesh(new THREE.SphereGeometry(r,12,8),material,x,y,z,parent)}
function arch(x,z,width,height,color){const g=new THREE.Group();scene.add(g);g.position.set(x,0,z);let a=box(.28,height,.3,-width/2,height/2,0,materials.gold,g);box(.28,height,.3,width/2,height/2,0,materials.gold,g);box(width+.5,.28,.3,0,height,0,materials.gold,g);box(width+.2,.22,.4,0,height-.25,0,mat(color),g);return g}
function tree(x,z,s=1){const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);cylinder(.14,.18,.65*s,0,.33*s,0,materials.wood,group);for(let i=0;i<3;i++){const r=(1.05-i*.2)*s;const c=mesh(new THREE.ConeGeometry(r,1.7*s,9),materials.green,0,(1.15+i*.52)*s,0,group);c.rotation.y=i*.35}for(let i=0;i<13;i++){let a=i*2.399,h=(.8+(i%6)*.36)*s,r=(.66-(i%6)*.07)*s;ball(.075*s,Math.cos(a)*r,h,Math.sin(a)*r,i%3===0?materials.red:materials.gold,group)}ball(.17*s,0,2.7*s,materials.gold,group);return group}
function gift(x,z,w=.6,c=materials.red){box(w,w,w,x,w/2,z,c);box(.12,w+.03,w+.05,x,w/2,z,materials.gold);box(w+.04,w+.04,.1,x,w/2,z,materials.gold);ball(.14,x,w+.08,z,materials.gold)}
function stationFootprint(x,z,w,d,color){const g=new THREE.Group();scene.add(g);const m=box(w,.22,d,0,.1,0,mat(color,.16,.5),g);const trim=box(w+.16,.06,d+.16,0,.04,0,materials.gold,g);trim.position.y=.045;g.position.set(x,0,z);return g}
function marker(i){const st=stages[i];const halo=new THREE.Mesh(new THREE.TorusGeometry(.9,.065,8,50),new THREE.MeshBasicMaterial({color:st.color}));halo.rotation.x=Math.PI/2;halo.position.set(st.pos[0],.32,st.pos[2]);scene.add(halo);const pick=mesh(new THREE.CylinderGeometry(1.75,1.75,.4,20),new THREE.MeshBasicMaterial({visible:false}),st.pos[0],.5,st.pos[2]);pick.userData.index=i;pickMeshes.push(pick);const el=document.createElement('div');el.className='float-label';el.textContent=st.short.toUpperCase();labelContainer.append(el);labelPoints.push({pos:new THREE.Vector3(st.pos[0],st.name==='Clímax Arcor'?8.1:4.6,st.pos[2]),element:el});animated.push({object:halo,spin:.006})}
const ground=box(21,.5,21,0,-.35,0,mat(0x243541,.2,.8));box(20,.035,20,0,-.07,0,mat(0x243847,.2,.6));
for(let a=-10;a<=10;a+=2){box(.012,.012,20,a,-.035,0,mat(0x4a5864));box(20,.012,.012,0,-.035,a,mat(0x4a5864))}
for(let i=-10;i<=10;i+=2){ball(.05,i,.04,-10,materials.gold);ball(.05,i,.04,10,materials.gold)}
// Percurso orbital predominantemente unidirecional, conectando os capítulos
const trail=[[-7,-8],[-7,-3],[-6,5],[-2,7],[4,7],[6,5],[4,2],[1,1],[3,-2],[6,-5],[6,-9]];
function lineSegments(points,color=0xe0ad68,r=.105){for(let i=0;i<points.length-1;i++){const a=new THREE.Vector3(points[i][0],.13,points[i][1]),b=new THREE.Vector3(points[i+1][0],.13,points[i+1][1]);const d=b.clone().sub(a);const q=mesh(new THREE.CylinderGeometry(r,r,d.length(),9),new THREE.MeshBasicMaterial({color}),(a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);q.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize())}}
lineSegments(trail);
for(let i=0;i<7;i++)marker(i);
// Entrada
stationFootprint(-7,-8.2,4.2,2.8,0x5f2433);arch(-7,-9.3,3.6,3.5,0x9a2534);for(const p of [[-8.5,-7.8],[-5.6,-8.2],[-9,-9.1]])gift(...p,.5);
for(let j=0;j<3;j++)arch(-7,-8.6+j*.67,3.2-j*.3,2.8+j*.1,0x9a2534);
// Tortuguita
stationFootprint(-6.3,-2.8,6.3,5.8,0x16553b);
for(const p of [[-9,-5],[-9,0],[-4.3,-.8],[-3.8,-5]])tree(...p,.52);
arch(-6.4,-4.4,4.3,2.5,0x1c6a43);
for(let j=0;j<3;j++){let x=-8+j*1.5;let orb=ball(.58,x,1.2,-2,mat([0xc98d58,0x4a9b78,0x6385b5][j],.35,.3));ball(.12,x,1.22,-1.4,materials.gold)}
cylinder(1.1,1.3,.38,-6.2,.28,-.5,materials.wood);
// Block
stationFootprint(-6.1,5.4,6.5,6.8,0x16418b);
for(let i=0;i<16;i++){const w=.75+(i%3)*.18;const x=-8.45+(i%4)*1.47,z=3.1+Math.floor(i/4)*1.33;let h=.45+((i*7)%5)*.36;box(w,h,w,x,h/2+.27,z,i%3===0?materials.gold:mat(i%2?0x347acc:0x1e4b9c,.5,.3))}
arch(-6.2,2.45,5.7,3.15,0x1857bf);
for(let i=0;i<5;i++){const g=box(.38,.38,.38,-8.4+i*1.15,3.65,6.6,i%2?materials.gold:materials.cream);animated.push({object:g,bob:.09,phase:i})}
// Butter Toffees
stationFootprint(6.15,5,6.5,7.2,0x764221);arch(6.1,7.2,5.5,3,0xc08953);
for(let i=0;i<3;i++){let x=3.7+i*2.3;const t=cylinder(.9,.9,.65,x,.47,5.05,mat(0xb17c4e,.4,.27));cylinder(.4,.4,.1,x,.86,5.05,materials.gold);for(let j=0;j<3;j++)ball(.1,x+Math.cos(j*2.1)*.5,1.15,5.05+Math.sin(j*2.1)*.5,materials.gold)}
for(let i=0;i<3;i++){let x=4.2+i*1.9;const s=ball(.65,x,2.65,3.5,mat(0xe6b479,.5,.28));s.scale.set(1.35,.65,.85);animated.push({object:s,bob:.08,phase:i*2})}
// Clímax de reconhecimento: átrio parcialmente velado, não um quarto módulo independente
const center=new THREE.Group();center.position.set(.65,0,.7);scene.add(center);cylinder(3.55,3.8,.55,0,.2,0,materials.red,center);cylinder(3.15,3.22,.15,0,.54,0,materials.gold,center);
for(let j=0;j<12;j++){let a=j*Math.PI/6;const x=Math.cos(a)*3.4,z=Math.sin(a)*3.4;cylinder(.075,.075,4.5,x,2.8,z,materials.gold,center);ball(.18,x,5.05,z,materials.gold,center)}
const ring=mesh(new THREE.TorusGeometry(3.45,.09,8,80),materials.gold,.65,5.1,.7);ring.rotation.x=Math.PI/2;
const crown=new THREE.Group();center.add(crown);for(let i=0;i<5;i++){const ribbon=box(.35,.13,5.7,0,2.2+i*.68,0,materials.red,crown);ribbon.rotation.y=i*.52+i*.3;ribbon.rotation.z=i*.18}tree(.65,.7,1.25);for(let i=0;i<19;i++){const a=i*2.4,r=2.45+(i%3)*.26,h=1.4+(i%4)*.72;const light=ball(.15,Math.cos(a)*r,h,Math.sin(a)*r,i%2?materials.gold:materials.cream,center);animated.push({object:light,bob:.13,phase:i*.42})}
// Bon o Bon
stationFootprint(6.5,-5.2,6.4,4.7,0x742231);arch(6.5,-7.35,5.1,3,0xa5283e);
for(let i=0;i<9;i++){const x=4.25+(i%3)*2.1,z=-5.7+Math.floor(i/3)*1.3;gift(x,z,.57+(i%2)*.17,i%3?materials.red:materials.gold)}
// Saída
stationFootprint(6,-9,4.3,1.8,0x713d3a);arch(6,-9.55,4.4,3.4,0x9a3246);
// Ambiente simplificado de shopping - volumetria esquemática, não levantamento real
for(const z of [-14,14]){const slab=box(31,.45,3,0,7,z,mat(0x617786,.22,.5));box(31,.1,.2,0,8.2,z>0?12.7:-12.7,materials.gold)}
for(const x of [-15,15]){box(3,.42,30,x,7,0,mat(0x617786,.2,.5));box(.2,.1,30,x>0?13.7:-13.7,8.2,0,materials.gold)}
for(const x of [-11.5,11.5])for(const z of [-11.5,11.5]){cylinder(.26,.26,9,x,4.5,z,mat(0x9aa7b0,.4,.4))}
for(const p of [[-9.4,8.7],[8.8,8.7],[-9.5,-7.5],[9,-8.5]])tree(...p,.7);
// Navegação e interface
const list=document.querySelector('#chapter-list');
stages.forEach((s,i)=>{const b=document.createElement('button');b.className='chapter';b.innerHTML='<span class="num">'+String(i+1).padStart(2,'0')+'</span><span class="chapter-icon">'+s.icon+'</span><span><strong>'+s.name+'</strong><small>'+s.verb+'</small></span>';b.addEventListener('click',()=>select(i));list.append(b)});
function select(i){if(i<0||i>=stages.length)return;active=i;const s=stages[i];document.querySelectorAll('.chapter').forEach((b,j)=>b.classList.toggle('selected',j===i));document.querySelector('#detail-count').textContent='ETAPA '+String(i+1).padStart(2,'0')+' / 07';document.querySelector('#detail-title').textContent=s.name+' — '+s.verb;document.querySelector('#detail-text').textContent=s.text;document.querySelector('#detail-quote').textContent=s.quote;targetCamera=new THREE.Vector3(...s.camera);targetLook=new THREE.Vector3(...s.focus)}
let targetCamera=null,targetLook=null;
function overview(){tourMode=false;active=-1;targetCamera=new THREE.Vector3(29,35,35);targetLook=new THREE.Vector3(0,0,0);document.querySelectorAll('.chapter').forEach(b=>b.classList.remove('selected'));document.querySelector('#detail-count').textContent='VISÃO GERAL';document.querySelector('#detail-title').textContent='O Natal se transforma';document.querySelector('#detail-text').textContent='Explore os ambientes em ordem narrativa. Cada etapa modifica o sentido da jornada: imaginar, agir, encontrar o outro, reconhecer e passar adiante.';document.querySelector('#detail-quote').textContent='“A família não visita um Natal pronto.”';document.querySelector('#tour').textContent='▶ Iniciar jornada'}
document.querySelector('#overview').onclick=overview;document.querySelector('#reset').onclick=overview;
document.querySelector('#tour').onclick=()=>{tourMode=!tourMode;document.querySelector('#tour').textContent=tourMode?'Ⅱ Pausar jornada':'▶ Iniciar jornada';if(tourMode){select(active<0?0:active);tourTimer=performance.now()}};
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();renderer.domElement.addEventListener('pointerup',e=>{if(Math.abs(e.movementX)>4||Math.abs(e.movementY)>4)return;const b=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(pickMeshes);if(hits.length){tourMode=false;document.querySelector('#tour').textContent='▶ Iniciar jornada';select(hits[0].object.userData.index)}});
function resize(){const w=mount.clientWidth,h=mount.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}new ResizeObserver(resize).observe(mount);resize();
function loop(now){requestAnimationFrame(loop);if(targetCamera){camera.position.lerp(targetCamera,.048);controls.target.lerp(targetLook,.048);if(camera.position.distanceTo(targetCamera)<.12){targetCamera=null;targetLook=null}}if(tourMode&&now-tourTimer>8500){if(active>=stages.length-1){tourMode=false;document.querySelector('#tour').textContent='▶ Iniciar jornada'}else{select(active+1);tourTimer=now}}for(const a of animated){if(a.spin)a.object.rotation.z+=a.spin;if(a.bob){a.object.position.y+=Math.sin(now*.0015+a.phase)*.0014}}controls.update();for(const p of labelPoints){const v=p.pos.clone().project(camera);const visible=v.z<1&&v.z>-1;const x=(v.x*.5+.5)*mount.clientWidth,y=(-v.y*.5+.5)*mount.clientHeight;p.element.style.transform='translate(-50%,-50%) translate('+x+'px,'+y+'px)';p.element.style.display=visible?'block':'none'}renderer.render(scene,camera)}
overview();requestAnimationFrame(loop);
