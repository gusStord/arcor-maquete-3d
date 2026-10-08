import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { stages } from './narrative.js';
import { enrichScenography } from './art-direction.js';
export function createScene({mount,labelContainer,onSelect,onError}) {
const scene=new THREE.Scene();scene.background=new THREE.Color('#172631');scene.fog=new THREE.FogExp2(0x172631,.008);
const camera=new THREE.PerspectiveCamera(40,1,.1,180);camera.position.set(28,32,32);
const renderer=new THREE.WebGLRenderer({antialias:window.innerWidth>800,alpha:false,powerPreference:"high-performance"});renderer.setPixelRatio(Math.min(devicePixelRatio,window.innerWidth<800?1.35:1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=window.innerWidth>800;renderer.shadowMap.type=THREE.PCFSoftShadowMap;mount.append(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=5;controls.maxDistance=62;controls.enablePan=false;controls.maxPolarAngle=Math.PI/2.05;controls.target.set(0,0,0);
scene.add(new THREE.HemisphereLight(0xc5d9ec,0x2e2022,1.8));const sun=new THREE.DirectionalLight(0xffe0b3,2.5);sun.position.set(-8,22,13);scene.add(sun);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-18,right:18,top:18,bottom:-18,near:1,far:60});sun.shadow.bias=-.001;const blue=new THREE.PointLight(0x729aff,28,20);blue.position.set(-7,8,4);scene.add(blue);
const objects=[],animated=[],pickMeshes=[],labelPoints=[];let active=-1;
const materialCache=new Map();
function mat(color,metalness=.2,roughness=.48){const key=[color,metalness,roughness].join('/');if(!materialCache.has(key))materialCache.set(key,new THREE.MeshStandardMaterial({color,metalness,roughness}));return materialCache.get(key)}
const materials={gold:mat(0xeac487,.7,.24),cream:mat(0xfff1d7),red:mat(0xb5363d,.4,.32),green:mat(0x175c42,.25,.6),dark:mat(0x192c37,.3,.47),path:mat(0xe9c394,.32,.4),wood:mat(0x69442e,.05,.75),snow:mat(0xe4e8e9)};
function mesh(geo,material,x,y,z,parent=scene){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);parent.add(m);m.castShadow=true;m.receiveShadow=true;return m}
function box(w,h,d,x,y,z,material,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),material,x,y,z,parent)}
function cylinder(rTop,rBottom,h,x,y,z,material,parent=scene,sides=24){return mesh(new THREE.CylinderGeometry(rTop,rBottom,h,sides),material,x,y,z,parent)}
function ball(r,x,y,z,material,parent=scene){return mesh(new THREE.SphereGeometry(r,12,8),material,x,y,z,parent)}
function arch(x,z,width,height,color){const g=new THREE.Group();scene.add(g);g.position.set(x,0,z);let a=box(.28,height,.3,-width/2,height/2,0,materials.gold,g);box(.28,height,.3,width/2,height/2,0,materials.gold,g);box(width+.5,.28,.3,0,height,0,materials.gold,g);box(width+.2,.22,.4,0,height-.25,0,mat(color),g);return g}
function tree(x,z,s=1){const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);cylinder(.14,.18,.65*s,0,.33*s,0,materials.wood,group);for(let i=0;i<3;i++){const r=(1.05-i*.2)*s;const c=mesh(new THREE.ConeGeometry(r,1.7*s,9),materials.green,0,(1.15+i*.52)*s,0,group);c.rotation.y=i*.35}for(let i=0;i<13;i++){let a=i*2.399,h=(.8+(i%6)*.36)*s,r=(.66-(i%6)*.07)*s;ball(.075*s,Math.cos(a)*r,h,Math.sin(a)*r,i%3===0?materials.red:materials.gold,group)}ball(.17*s,0,2.7*s,0,materials.gold,group);return group}
function gift(x,z,w=.6,c=materials.red){box(w,w,w,x,w/2,z,c);box(.12,w+.03,w+.05,x,w/2,z,materials.gold);box(w+.04,w+.04,.1,x,w/2,z,materials.gold);ball(.14,x,w+.08,z,materials.gold)}
function stationFootprint(x,z,w,d,color){const g=new THREE.Group();scene.add(g);const m=box(w,.22,d,0,.1,0,mat(color,.16,.5),g);const trim=box(w+.16,.06,d+.16,0,.04,0,materials.gold,g);trim.position.y=.045;g.position.set(x,0,z);return g}
function marker(i){const st=stages[i];const halo=new THREE.Mesh(new THREE.TorusGeometry(.9,.065,8,50),new THREE.MeshBasicMaterial({color:st.color}));halo.rotation.x=Math.PI/2;halo.position.set(st.pos[0],.32,st.pos[2]);scene.add(halo);const pick=mesh(new THREE.CylinderGeometry(1.75,1.75,.4,20),new THREE.MeshBasicMaterial({visible:false}),st.pos[0],.5,st.pos[2]);pick.userData.index=i;pickMeshes.push(pick);const el=document.createElement('button');el.className='float-label';el.innerHTML='<small>'+String(i+1).padStart(2,'0')+'</small>'+st.short;el.setAttribute('aria-label','Explorar '+st.name);el.onclick=()=>onSelect(i);labelContainer.append(el);labelPoints.push({pos:new THREE.Vector3(st.pos[0],st.name==='Clímax Arcor'?10.4:4.2,st.pos[2]),element:el,index:i});animated.push({object:halo,spin:.006})}
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
stationFootprint(-6.3,-2.8,6.3,5.8,0x254f40);
for(const p of [[-9,-5],[-9,0],[-4.3,-.8],[-3.8,-5]])tree(...p,.52);
arch(-6.4,-4.4,4.3,2.5,0x1c6a43);
for(let j=0;j<3;j++){let x=-8+j*1.5;let orb=ball(.58,x,1.2,-2,mat([0xc98d58,0x4a9b78,0x6385b5][j],.35,.3));ball(.12,x,1.22,-1.4,materials.gold)}
cylinder(1.1,1.3,.38,-6.2,.28,-.5,materials.wood);
// Block
stationFootprint(-6.1,5.4,6.5,6.8,0x273d57);
for(let i=0;i<16;i++){const w=.75+(i%3)*.18;const x=-8.45+(i%4)*1.47,z=3.1+Math.floor(i/4)*1.33;let h=.45+((i*7)%5)*.36;box(w,h,w,x,h/2+.27,z,i%3===0?materials.gold:mat(i%2?0x523024:0x734632,.12,.33))}
arch(-6.2,2.45,5.7,3.15,0x1857bf);
for(let i=0;i<5;i++){const g=box(.38,.38,.38,-8.4+i*1.15,3.65,6.6,i%2?materials.gold:materials.cream);animated.push({object:g,bob:.09,phase:i})}
// Butter Toffees
stationFootprint(6.15,5,6.5,7.2,0x67452e);arch(6.1,7.2,5.5,3,0xc08953);
for(let i=0;i<3;i++){let x=3.7+i*2.3;const t=cylinder(.9,.9,.65,x,.47,5.05,mat(0xb17c4e,.4,.27));cylinder(.4,.4,.1,x,.86,5.05,materials.gold);for(let j=0;j<3;j++)ball(.1,x+Math.cos(j*2.1)*.5,1.15,5.05+Math.sin(j*2.1)*.5,materials.gold)}
for(let i=0;i<3;i++){let x=4.2+i*1.9;const s=ball(.65,x,2.65,3.5,mat(0xe6b479,.5,.28));s.scale.set(1.35,.65,.85);animated.push({object:s,bob:.08,phase:i*2})}
// Clímax de reconhecimento: átrio parcialmente velado, não um quarto módulo independente
const center=new THREE.Group();center.position.set(.65,0,.7);scene.add(center);cylinder(3.55,3.8,.55,0,.2,0,materials.red,center);cylinder(3.15,3.22,.15,0,.54,0,materials.gold,center);
for(let j=0;j<12;j++){let a=j*Math.PI/6;const x=Math.cos(a)*3.4,z=Math.sin(a)*3.4;cylinder(.075,.075,4.5,x,2.8,z,materials.gold,center);ball(.18,x,5.05,z,materials.gold,center)}
const ring=mesh(new THREE.TorusGeometry(3.45,.09,8,80),materials.gold,.65,5.1,.7);ring.rotation.x=Math.PI/2;
const crown=new THREE.Group();center.add(crown);for(let i=0;i<5;i++){const ribbon=box(.35,.13,3.6,0,.8+i*.33,0,materials.red,crown);ribbon.rotation.y=i*.52+i*.3;ribbon.rotation.z=i*.18}tree(.65,.7,1.25);for(let i=0;i<19;i++){const a=i*2.4,r=2.45+(i%3)*.26,h=1.4+(i%4)*.72;const light=ball(.15,Math.cos(a)*r,h,Math.sin(a)*r,i%2?materials.gold:materials.cream,center);animated.push({object:light,bob:.13,phase:i*.42})}
// Bon o Bon
stationFootprint(6.5,-5.2,6.4,4.7,0x672736);arch(6.5,-7.35,5.1,3,0xa5283e);
for(let i=0;i<9;i++){const x=4.25+(i%3)*2.1,z=-5.7+Math.floor(i/3)*1.3;gift(x,z,.57+(i%2)*.17,i%3?materials.red:materials.gold)}
// Saída
stationFootprint(6,-9,4.3,1.8,0x713d3a);arch(6,-9.55,4.4,3.4,0x9a3246);
// Ambiente simplificado de shopping - volumetria esquemática, não levantamento real
for(const z of [-14,14]){const slab=box(31,.45,3,0,7,z,mat(0x617786,.22,.5));box(31,.1,.2,0,8.2,z>0?12.7:-12.7,materials.gold)}
for(const x of [-15,15]){box(3,.42,30,x,7,0,mat(0x617786,.2,.5));box(.2,.1,30,x>0?13.7:-13.7,8.2,0,materials.gold)}
for(const x of [-11.5,11.5])for(const z of [-11.5,11.5]){cylinder(.26,.26,9,x,4.5,z,mat(0x9aa7b0,.4,.4))}
for(const p of [[-9.4,8.7],[8.8,8.7],[-9.5,-7.5],[9,-8.5]])tree(...p,.7);
// Consolidate the inherited static geometry by shared material: fewer draw calls.
scene.updateMatrixWorld(true);
const moving=new Set(animated.map(a=>a.object)),batches=new Map();
scene.traverse(o=>{if(o.isMesh&&!moving.has(o)&&!pickMeshes.includes(o)&&!Array.isArray(o.material)){const key=o.material.uuid;const batch=batches.get(key)||{material:o.material,items:[]};batch.items.push(o);batches.set(key,batch)}});
for(const {material,items} of batches.values()){
 if(items.length<2)continue;
 const copies=items.map(o=>{const g=o.geometry.clone();g.applyMatrix4(o.matrixWorld);return g});
 const merged=mergeGeometries(copies,false);copies.forEach(g=>g.dispose());
 if(merged){const m=new THREE.Mesh(merged,material);m.castShadow=true;m.receiveShadow=true;scene.add(m);items.forEach(o=>o.removeFromParent())}
}
const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
const env=pmrem.fromScene(room,.06);scene.environment=env.texture;room.dispose();pmrem.dispose();
// Material detail stays fully navigable and procedural; no image backdrop.
function grainTexture(){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#98765b';ctx.fillRect(0,0,128,128);for(let i=0;i<128;i++){ctx.fillStyle=`rgba(45,24,12,${.06+(Math.sin(i*32.7)*.5+.5)*.12})`;ctx.fillRect(i,0,1,128)}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,1);t.colorSpace=THREE.SRGBColorSpace;return t}
materials.wood.map=grainTexture();materials.wood.needsUpdate=true;
const satin=new THREE.MeshStandardMaterial({color:0x9f2634,metalness:.38,roughness:.36,side:THREE.DoubleSide});
const warmGlow=new THREE.MeshStandardMaterial({color:0xffd79b,emissive:0xffa841,emissiveIntensity:.35,roughness:.25,metalness:.3});
const copper=new THREE.MeshStandardMaterial({color:0xbd8650,metalness:.65,roughness:.28});
const journeyCurve=new THREE.CatmullRomCurve3(trail.map((p,i)=>new THREE.Vector3(p[0],3.6+Math.sin(i*.9)*.55,p[1])));
const ribbonVertices=[],ribbonIndices=[];
for(let i=0;i<=220;i++){const p=journeyCurve.getPointAt(i/220),t=journeyCurve.getTangentAt(i/220),side=new THREE.Vector3(-t.z,0,t.x).normalize().multiplyScalar(.24);ribbonVertices.push(p.x+side.x,p.y+.05*Math.sin(i*.1),p.z+side.z,p.x-side.x,p.y-.05*Math.sin(i*.1),p.z-side.z);if(i<220){const a=i*2;ribbonIndices.push(a,a+1,a+2,a+1,a+3,a+2)}}
const ribbonGeo=new THREE.BufferGeometry();ribbonGeo.setAttribute('position',new THREE.Float32BufferAttribute(ribbonVertices,3));ribbonGeo.setIndex(ribbonIndices);ribbonGeo.computeVertexNormals();const ribbon=new THREE.Mesh(ribbonGeo,satin);ribbon.castShadow=true;scene.add(ribbon);
for(const side of [-1,1]){const pts=[];for(let i=0;i<=80;i++){const p=journeyCurve.getPointAt(i/80),t=journeyCurve.getTangentAt(i/80);p.add(new THREE.Vector3(-t.z,0,t.x).normalize().multiplyScalar(.24*side));pts.push(p)}mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),160,.016,5,false),materials.gold,0,0,0)}
const bulbs=new THREE.InstancedMesh(new THREE.SphereGeometry(.058,8,6),warmGlow,70);const dummy=new THREE.Object3D();for(let i=0;i<70;i++){dummy.position.copy(journeyCurve.getPointAt(i/69));dummy.position.y-=.18;dummy.updateMatrix();bulbs.setMatrixAt(i,dummy.matrix)}scene.add(bulbs);
// Curved arches, chocolate tablets and caramel ribbons add detail to the base.
for(const [x,z,w,h] of [[-7,-9.3,3.6,3.5],[-6.4,-4.4,4.3,2.5],[6.1,7.2,5.5,3],[6.5,-7.35,5.1,3]]){
 const pts=[];for(let j=0;j<=30;j++){const a=j/30*Math.PI;pts.push(new THREE.Vector3(x+Math.cos(a)*w/2,h+Math.sin(a)*.7,z))}
 mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),32,.12,8,false),materials.gold,0,0,0);
}
for(let i=0;i<9;i++){const x=-8.25+(i%3)*.65,z=5.8+Math.floor(i/3)*.66;box(.58,.18,.58,x,2.15,z,mat(0x79482e,.05,.28));box(.44,.04,.44,x,2.26,z,mat(0x9a6241,.08,.35))}
const caramelPoints=[];for(let i=0;i<=60;i++){const a=i/60*Math.PI*3;caramelPoints.push(new THREE.Vector3(6+Math.cos(a)*1.65,1.1+i/60*1.3,5+Math.sin(a)*.6))}
mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(caramelPoints),64,.12,10,false),copper,0,0,0);
// Extra detail inspired by the photographic concept references.
const scenicDetail=enrichScenography({scene,materials});
// A calm, legible rest area sits between Block and Butter Toffees.
for(const z of [8.1,9]){box(2.3,.16,.48,.4,.55,z,materials.wood);for(const x of [-.4,1.2])box(.1,.5,.35,x,.25,z,materials.gold)}
function sign(text,x,y,z,width=3,color='#ecd09e'){
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=160;const ctx=canvas.getContext('2d');ctx.fillStyle='#172b39';ctx.fillRect(0,0,768,160);ctx.strokeStyle='#cba15f';ctx.lineWidth=6;ctx.strokeRect(8,8,752,144);ctx.fillStyle=color;ctx.font='600 55px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,80,720);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const m=mesh(new THREE.PlaneGeometry(width,width*160/768),new THREE.MeshStandardMaterial({map:texture,roughness:.6,side:THREE.DoubleSide}),x,y,z);m.castShadow=false;return m;
}
sign('ARCOR',-7,3.65,-9.08,2.3);sign('Tortuguita',-6.4,2.9,-4.17,3.2);sign('BLOCK',-6.2,3.5,2.7,2.8);sign('Butter Toffees',6.1,3.35,7.45,3.3);sign('Bon o Bon',6.5,3.25,-7.08,3);sign('RESPIRO',.4,.8,8,1.9);sign('O Natal continua',6,3.55,-9.28,3.3);
// Small stylized families establish scale; they do not pretend to be scanned people.
const familyGroups=[];
function person(x,z,height,color,parent=scene){const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);const k=height/1.72;g.scale.setScalar(k);const cloth=mat(color,.03,.8),skin=mat(0xd3aa85,.02,.78);cylinder(.19,.24,.68,0,1.02,0,cloth,g,10);ball(.17,0,1.56,0,skin,g);for(const side of [-1,1]){const leg=cylinder(.07,.065,.62,side*.1,.36,0,materials.dark,g,8);const arm=cylinder(.055,.05,.52,side*.24,1,0,cloth,g,8);arm.rotation.z=side*.12;box(.13,.09,.26,side*.1,.06,.04,materials.dark,g)}return g}
function family(x,z,angle=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);person(-.46,0,1.72,0x9a4546,g);person(.42,0,1.65,0xc8ae87,g);person(0,.45,1.07,0x3b8090,g);familyGroups.push(g);return g}
const arriving=family(-7,-11);family(-8.4,-.3,.8);family(-3.3,6.5,-1);family(8,5.8,2);family(3.7,-6.1,.4);const receiving=family(8.2,-3.3,-1);
// Waiting figures and low rails remain outside the activity platforms.
for(const [x,z] of [[-10.4,-2],[-10.4,5],[10.4,4],[10.4,-4]]){person(x,z,1.65,0x6c7981);person(x,z+.8,1.12,0xbc8860);cylinder(.035,.035,.7,x-.3,.35,z,materials.gold);cylinder(.035,.035,.7,x-.3,.35,z+1.2,materials.gold);box(.035,.035,1.2,x-.3,.67,z+.6,materials.red)}
const liveBuild=new THREE.Group();liveBuild.position.set(-6.2,.4,4.6);scene.add(liveBuild);const buildParts=[];
for(let i=0;i<3;i++){const g=new THREE.Group();liveBuild.add(g);g.position.y=i*.85;box(2-i*.42,.64,1.1,0,.32,0,mat(i===2?0xd8b072:0x9a5838,.28,.34),g);box(1.9-i*.42,.06,1.16,0,.67,0,warmGlow,g);buildParts.push(g)}
const balanceGroup=new THREE.Group();balanceGroup.position.set(6,1.35,5);scene.add(balanceGroup);
const balanceOrbs=[ball(.23,-1,0,0,warmGlow,balanceGroup),ball(.23,1,0,0,warmGlow,balanceGroup)];
const balanceBridge=mesh(new THREE.TorusGeometry(.72,.07,8,48),warmGlow,0,0,0,balanceGroup);balanceBridge.rotation.x=Math.PI/2;
const recognition=new THREE.Group();recognition.position.set(.65,6.3,.7);scene.add(recognition);
const plinth=[];for(let i=0;i<3;i++)plinth.push(box(1.9-i*.25,.24,1.25,0,-1.3+i*.27,0,materials.gold,recognition));
const linked=[];for(const a of [-.22,.22]){const ring=mesh(new THREE.TorusGeometry(1.35,.065,8,64),warmGlow,a,.1,0,recognition);ring.rotation.y=a*2;linked.push(ring)}
const revealLight=new THREE.PointLight(0xffbe64,0,14);revealLight.position.set(.65,5,.7);scene.add(revealLight);
const veilMat=new THREE.MeshStandardMaterial({color:0x651f2c,metalness:.1,roughness:.87,transparent:true,opacity:.92,side:THREE.DoubleSide,depthWrite:false});
const veil=mesh(new THREE.CylinderGeometry(2.2,2.6,3.7,48,1,true,Math.PI*.18,Math.PI*1.15),veilMat,.65,2.6,.7);veil.castShadow=false;
function symbolObject(id){const g=new THREE.Group();let pts=[];
 if(id==='star'){for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?.42:.95;pts.push([Math.cos(a)*r,Math.sin(a)*r])}}
 if(id==='tree')pts=[[0,1],[.7,.1],[.38,.1],[.95,-.65],[.18,-.65],[.18,-1],[-.18,-1],[-.18,-.65],[-.95,-.65],[-.38,.1],[-.7,.1]];
 if(id==='heart'){for(let i=0;i<60;i++){const t=i/60*Math.PI*2;pts.push([16*Math.sin(t)**3/18,(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/18])}}
 if(id==='gift'){box(1.45,1.4,.35,0,0,0,satin,g);box(.2,1.5,.4,0,0,0,warmGlow,g);box(1.55,.18,.4,0,.2,0,warmGlow,g);for(const side of [-1,1]){const b=mesh(new THREE.TorusGeometry(.25,.065,8,24),warmGlow,side*.25,.9,0,g);b.scale.y=.65}return g}
 const sh=new THREE.Shape();pts.forEach((p,i)=>i?sh.lineTo(...p):sh.moveTo(...p));sh.closePath();const m=mesh(new THREE.ExtrudeGeometry(sh,{depth:.18,bevelEnabled:true,bevelThickness:.06,bevelSize:.045,bevelSegments:2,steps:1}),warmGlow,0,0,0,g);m.castShadow=true;return g;
}
let gardenSymbol=null,centerSymbol=null,lastSymbol=null;
const gardenAnchor=new THREE.Group();gardenAnchor.position.set(-6.2,2.25,-2);scene.add(gardenAnchor);
const giftMove=new THREE.Group();giftMove.position.set(4.7,1.25,-5);scene.add(giftMove);box(.65,.65,.65,0,0,0,satin,giftMove);box(.1,.68,.68,0,0,0,materials.gold,giftMove);box(.68,.68,.1,0,0,0,materials.gold,giftMove);
const familyRibbon=mesh(new THREE.TorusGeometry(.23,.05,8,32),satin,-7,1.25,-8.2);familyRibbon.rotation.y=Math.PI/2;
const portalGlow=new THREE.MeshStandardMaterial({color:0x8b6641,emissive:0xffb05b,emissiveIntensity:0,roughness:.25});
for(let i=0;i<14;i++){const a=i/13*Math.PI;ball(.08,-7+Math.cos(a)*1.8,3.5+Math.sin(a)*.7,-9.22,portalGlow)}
let viewState={received:false,symbol:null,blocks:0,balance:[20,80],cooperated:false,revealed:false,shared:false};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let targetCamera=null,targetLook=null,lastTime=0,elapsed=0,revealAmount=0,giftAmount=0,renderAlive=true;
function disposeSymbol(g){if(!g)return;g.traverse(o=>{if(o.geometry)o.geometry.dispose()});g.removeFromParent()}
function updateState(s){viewState=s;
 if(s.symbol!==lastSymbol){disposeSymbol(gardenSymbol);disposeSymbol(centerSymbol);lastSymbol=s.symbol;if(s.symbol){gardenSymbol=symbolObject(s.symbol);gardenSymbol.scale.setScalar(.75);gardenAnchor.add(gardenSymbol);centerSymbol=symbolObject(s.symbol);recognition.add(centerSymbol)}}
 buildParts.forEach((g,i)=>g.visible=i<s.blocks);plinth.forEach((g,i)=>g.visible=i<s.blocks);linked.forEach(g=>g.visible=s.cooperated);familyRibbon.visible=s.received;
 warmGlow.emissiveIntensity=.2+Number(!!s.symbol)*.3+s.blocks*.14+Number(s.cooperated)*.4;
 recognition.visible=s.revealed;gardenAnchor.visible=!!s.symbol;
 portalGlow.emissiveIntensity=s.received?2.7:0;
}
function goTo(i){active=i;const st=stages[i];targetCamera=st?new THREE.Vector3(...st.camera):new THREE.Vector3(28,32,32);targetLook=st?new THREE.Vector3(...st.focus):new THREE.Vector3(0,0,0);if(mount.clientWidth<600&&i<0)targetCamera.multiplyScalar(1.2);if(reduced){camera.position.copy(targetCamera);controls.target.copy(targetLook);targetCamera=null;targetLook=null}labelPoints.forEach(p=>p.element.classList.toggle('selected',p.index===i));}
controls.addEventListener('start',()=>{targetCamera=null;targetLook=null});
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null,activePointers=new Set(),gestured=false;
renderer.domElement.addEventListener('pointerdown',e=>{activePointers.add(e.pointerId);if(activePointers.size>1)gestured=true;else{gestured=false;down={x:e.clientX,y:e.clientY,id:e.pointerId}}});
renderer.domElement.addEventListener('pointermove',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)gestured=true});
renderer.domElement.addEventListener('pointercancel',e=>{activePointers.delete(e.pointerId);down=null;gestured=true});
renderer.domElement.addEventListener('pointerup',e=>{activePointers.delete(e.pointerId);if(!down||gestured||down.id!==e.pointerId)return;down=null;const b=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(pickMeshes);if(hits.length)onSelect(hits[0].object.userData.index)});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderAlive=false;onError('A visualização 3D foi interrompida pelo navegador. Sua jornada continua disponível no painel. Recarregue para recuperar a maquete.')});
function resize(){const w=Math.max(1,mount.clientWidth),h=Math.max(1,mount.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}new ResizeObserver(resize).observe(mount);resize();
function tick(now){if(!renderAlive)return;requestAnimationFrame(tick);if(document.hidden){lastTime=now;return}const dt=Math.min(.05,(now-(lastTime||now))/1000);lastTime=now;elapsed+=dt;
 if(targetCamera){const t=1-Math.exp(-5*dt);camera.position.lerp(targetCamera,t);controls.target.lerp(targetLook,t);if(camera.position.distanceTo(targetCamera)<.02){targetCamera=null;targetLook=null}}
 if(!reduced){for(const a of animated){if(a.baseY===undefined)a.baseY=a.object.position.y;if(a.spin)a.object.rotation.z+=a.spin*60*dt;if(a.bob)a.object.position.y=a.baseY+Math.sin(elapsed*1.5+a.phase)*a.bob}familyGroups.forEach((g,i)=>{g.rotation.z=Math.sin(elapsed*.8+i)*.004});if(gardenSymbol)gardenSymbol.rotation.y=Math.sin(elapsed*.7)*.25}
 const ease=reduced?1:1-Math.exp(-3*dt);revealAmount+=(Number(viewState.revealed)-revealAmount)*ease;giftAmount+=(Number(viewState.shared)-giftAmount)*ease;
 arriving.position.z+=((viewState.received?-8.1:-11)-arriving.position.z)*ease;
 recognition.scale.setScalar(.35+revealAmount*.85);if(centerSymbol)centerSymbol.quaternion.copy(camera.quaternion);
 veilMat.opacity=.92*(1-revealAmount);veil.visible=revealAmount<.99;revealLight.intensity=revealAmount*65;
 giftMove.position.set(4.7+giftAmount*3.1,1.25+Math.sin(giftAmount*Math.PI)*1.8,-5+giftAmount*1.7);giftMove.rotation.y=giftAmount*Math.PI;giftMove.visible=viewState.revealed;
 balanceOrbs.forEach((o,i)=>{o.position.x=(i===0?-1:1)*(1.3-viewState.balance[i]/100);o.position.y=(viewState.balance[i]-50)*.018});balanceBridge.scale.setScalar(viewState.cooperated?1:Math.max(.15,1-Math.abs(viewState.balance[0]-viewState.balance[1])/100));
 controls.update();camera.updateMatrixWorld();
 const occupied=[];labelPoints.sort((a,b)=>(b.index===active)-(a.index===active));
 for(const p of labelPoints){const v=p.pos.clone().project(camera),x=(v.x*.5+.5)*mount.clientWidth,y=(-v.y*.5+.5)*mount.clientHeight;let visible=(active<0||p.index===active)&&v.z<1&&v.z>-1&&x>45&&x<mount.clientWidth-45&&y>150&&y<mount.clientHeight-185;const w=p.element.offsetWidth||110;if(occupied.some(q=>Math.abs(x-q.x)<(w+q.w)/2+6&&Math.abs(y-q.y)<36))visible=false;if(visible)occupied.push({x,y,w});p.element.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px)`;p.element.hidden=!visible}
 try{renderer.render(scene,camera)}catch(error){renderAlive=false;console.error('Renderização interrompida:',error);onError('A maquete não conseguiu continuar a renderização. Sua jornada está salva; tente recarregar.')} 
}
goTo(-1);updateState(viewState);requestAnimationFrame(tick);
return {update:updateState,focus:goTo,zoom(factor){targetCamera=null;targetLook=null;const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*factor,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);controls.update()},metrics:()=>({drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,highDetail:scenicDetail.high})};
}
