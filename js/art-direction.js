import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/**
 * Cenografia conceitual V3.
 * Inspirada nos renders de referência, sem alegar fidelidade construtiva ao Shopping Eldorado.
 * Mantém todas as interações e âncoras da cena original.
 *
 * Detalhes mais densos no desktop; geometria e instâncias econômicas em telas pequenas.
 */
export function enrichScenography({ scene, materials }) {
  const high = innerWidth > 850 && (navigator.deviceMemory || 4) >= 4;
  const radial = high ? 20 : 12;
  const points = high ? 64 : 32;
  const smooth = high ? 5 : 3;
  const THREEv = THREE;
  const palette = {
    velvet: new THREE.MeshPhysicalMaterial({color:0x982332,roughness:.5,metalness:.2,clearcoat:.38,clearcoatRoughness:.36,side:THREE.DoubleSide}),
    ruby: new THREE.MeshPhysicalMaterial({color:0xc83d43,roughness:.22,metalness:.45,clearcoat:1,clearcoatRoughness:.13}),
    gold: new THREE.MeshPhysicalMaterial({color:0xdcb773,metalness:.88,roughness:.18,clearcoat:.7}),
    brass: new THREE.MeshStandardMaterial({color:0x9c683c,metalness:.72,roughness:.3}),
    glow: new THREE.MeshBasicMaterial({color:0xffd69a}),
    star: new THREE.MeshStandardMaterial({color:0xffd891,emissive:0xf3a548,emissiveIntensity:1.1,metalness:.25,roughness:.2,side:THREE.DoubleSide}),
    chocolate: new THREE.MeshPhysicalMaterial({color:0x4c241a,metalness:.08,roughness:.24,clearcoat:.8,clearcoatRoughness:.18}),
    cocoa: new THREE.MeshPhysicalMaterial({color:0x76412a,roughness:.33,metalness:.05,clearcoat:.58}),
    caramel: new THREE.MeshPhysicalMaterial({color:0xb97935,metalness:.3,roughness:.23,clearcoat:1,clearcoatRoughness:.08}),
    caramelLight: new THREE.MeshPhysicalMaterial({color:0xe6ab66,metalness:.46,roughness:.19,clearcoat:1}),
    emerald: new THREE.MeshPhysicalMaterial({color:0x286848,roughness:.36,metalness:.18,clearcoat:.3}),
    leaf: new THREE.MeshStandardMaterial({color:0x3d8755,roughness:.55}),
    pine: new THREE.MeshStandardMaterial({color:0x133f34,roughness:.66}),
    leafGold: new THREE.MeshStandardMaterial({color:0x8fac67,roughness:.5,metalness:.1}),
    blue: new THREE.MeshPhysicalMaterial({color:0x204eaa,roughness:.22,metalness:.5,clearcoat:.8}),
    cobalt: new THREE.MeshPhysicalMaterial({color:0x123477,roughness:.32,metalness:.32,clearcoat:.7}),
    snow: new THREE.MeshStandardMaterial({color:0xf0dfbf,roughness:.76}),
    clear: new THREE.MeshPhysicalMaterial({color:0xffe1b0,transparent:true,opacity:.18,depthWrite:false,metalness:0,roughness:.12,clearcoat:1,side:THREE.DoubleSide})
  };
  const beads=[];
  const groups = {};
  function group(key,x=0,y=0,z=0) {
    const g = new THREE.Group();g.name='Cenografia detalhada — '+key;g.position.set(x,y,z);scene.add(g);groups[key]=g;return g;
  }
  function add(geometry,material,parent,x=0,y=0,z=0) {
    const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=!material.transparent;m.receiveShadow=true;parent.add(m);return m;
  }
  function sphere(parent,material,r,x,y,z,sx=1,sy=1,sz=1) {
    const m=add(new THREE.SphereGeometry(r,radial*2,radial),material,parent,x,y,z);m.scale.set(sx,sy,sz);return m;
  }
  function round(parent,material,w,h,d,x,y,z,r=.12) {
    const m=add(new RoundedBoxGeometry(w,h,d,smooth,Math.min(r,w*.24,h*.24,d*.24)),material,parent,x,y,z);return m;
  }
  function cylinder(parent,material,rt,rb,h,x,y,z) {
    return add(new THREE.CylinderGeometry(rt,rb,h,radial*2,1),material,parent,x,y,z);
  }
  function torus(parent,material,r,t,x,y,z,rx=0,ry=0,rz=0) {
    const m=add(new THREE.TorusGeometry(r,t,radial,points),material,parent,x,y,z);m.rotation.set(rx,ry,rz);return m;
  }
  function curve(parent,material,coords,r=.04,res=points) {
    const c=new THREE.CatmullRomCurve3(coords.map(p=>new THREE.Vector3(...p)));
    const m=add(new THREE.TubeGeometry(c,res,r,high?10:6,false),material,parent);return m;
  }
  function star(parent,x,y,z,size=.3,mat=palette.star) {
    const shape=new THREE.Shape();
    for(let i=0;i<10;i++){
      const a=Math.PI/2-i*Math.PI/5,r=(i%2?.37:1)*size;
      const px=Math.cos(a)*r,py=Math.sin(a)*r;
      if(i===0)shape.moveTo(px,py);else shape.lineTo(px,py);
    }
    shape.closePath();
    return add(new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelThickness:.018,bevelSize:.015,bevelSegments:high?3:2,steps:1}),mat,parent,x,y,z);
  }
  function bow(parent,x,y,z,s=1) {
    const knot=sphere(parent,palette.ruby,.23*s,x,y,z,1.1,.8,.58);
    for(const side of [-1,1]){
      const loop=torus(parent,palette.velvet,.51*s,.125*s,x+side*.5*s,y+.15*s,z-.02*s);
      loop.scale.set(1.22,.67,1);
      const pipe=torus(parent,palette.gold,.51*s,.024*s,x+side*.5*s,y+.15*s,z+.06*s);
      pipe.scale.set(1.22,.67,1);
      const tail=curve(parent,palette.velvet,[[x,y-.08*s,z],[x+side*.4*s,y-.7*s,z-.05*s],[x+side*.7*s,y-1.4*s,z+.1*s]],.13*s);
      curve(parent,palette.gold,[[x,y-.08*s,z+.07],[x+side*.4*s,y-.7*s,z+.03],[x+side*.7*s,y-1.4*s,z+.18]],.022*s);
    }
    return knot;
  }
  function glitterArc(parent,x,z,w,h,trim=palette.gold){
    const arc=[];
    for(let i=0;i<=points;i++){
      const t=i/points*Math.PI;
      arc.push([x+Math.cos(t)*w*.5,h+Math.sin(t)*.57,z]);
      if(i%Math.max(1,Math.round(points/18))===0){
        const a=arc[arc.length-1];beads.push([a[0],a[1],a[2]]);
      }
    }
    curve(parent,trim,arc,.12);
    curve(parent,palette.star,arc.map(p=>[p[0],p[1]-.12,p[2]-.03]),.017);
    for(const side of [-1,1]){
      const px=x+side*w*.5;
      curve(parent,trim,[[px,.25,z],[px,1.4,z],[px,h,z]],.1);
      for(let j=0;j<10;j++)beads.push([px,.45+j*(h-.45)/9,z]);
    }
  }
  function holidayTree(parent,x,z,s=.9){
    const stump=cylinder(parent,palette.brass,.13*s,.17*s,.7*s,x,.4*s,z);
    const heights=[.7,1.1,1.48,1.82];
    heights.forEach((h,i)=>{
      const cone=add(new THREE.ConeGeometry((1.12-i*.17)*s,1.4*s,radial,high?4:2),palette.pine,parent,x,h*s,z);
      cone.rotation.y=i*.3;
    });
    for(let i=0;i<15;i++){
      const a=i*2.399,r=(.7-(i%4)*.12)*s,y=(.7+(i%6)*.27)*s;
      const orb=sphere(parent,i%4?palette.gold:palette.ruby,.065*s,x+Math.cos(a)*r,y,z+Math.sin(a)*r);
    }
    star(parent,x,2.1*s,z,.22*s);
    return stump;
  }
  function clusters(parent,x,z,size=1){
    for(let i=0;i<5;i++){
      const a=i*2.399,r=(.35+(i%2)*.25)*size;
      const bush=sphere(parent,i%3?palette.emerald:palette.leaf,.52*size,x+Math.cos(a)*r,.36*size,z+Math.sin(a)*r,1,.62,1);
    }
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3;
      const leaf=sphere(parent,palette.leafGold,.25*size,x+Math.cos(a)*.5*size,.6*size,z+Math.sin(a)*.48*size,1.6,.23,.72);
      leaf.rotation.y=a;
    }
  }
  function gift(parent,x,y,z,s=.6){
    round(parent,palette.ruby,s,s,s,x,y+s*.5,z,.09);
    round(parent,palette.gold,.13*s,s*1.04,s*1.05,x,y+s*.5,z,.018);
    round(parent,palette.gold,s*1.05,s*1.04,.11*s,x,y+s*.5,z,.02);
    bow(parent,x,y+s*1.1,z,s*.3);
  }
  const entry=group('Entrada');
  glitterArc(entry,-7,-9.38,3.55,3.57);
  bow(entry,-7,5.18,-9.35,1.15);
  holidayTree(entry,-9.45,-9.25,.54);
  holidayTree(entry,-4.45,-9.25,.54);
  for(const [x,z,s] of [[-9.2,-8.25,.52],[-8.9,-9.6,.45],[-5.1,-8.85,.62],[-4.65,-7.6,.4]])gift(entry,x,0,z,s);
  for(let k=0;k<9;k++){const x=-8.5+k*.37;star(entry,x,3.3+Math.sin(k)*.2,-8.65,.065);}
  for(let k=0;k<4;k++)curve(entry,palette.gold,[[-8.8+k*.12,.16,-9.3],[-8.7+k*.12,.38,-8.5],[-8.2+k*.12,.25,-7.8]],.017);

  const garden=group('Tortuguita · imaginar');
  for(const [x,z] of [[-8.9,-5.1],[-4,-4.9],[-9,-.65],[-3.6,-.75]])clusters(garden,x,z,.6);
  for(let i=0;i<4;i++)glitterArc(garden,-6.2,-4.9+i*.95,3.9-i*.23,2.15+i*.12,palette.emerald);
  // A Tortuguita tem volume próprio: casco, placas, rosto e gorro natalino.
  const mascot=new THREE.Group();mascot.position.set(-4.25,.25,-1.9);mascot.rotation.y=-.65;mascot.scale.setScalar(.75);garden.add(mascot);
  sphere(mascot,palette.emerald,.95,0,1.15,0,1.25,.78,1.18);
  sphere(mascot,palette.leafGold,.76,0,1.43,0,1.37,.35,1.42);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;const plate=sphere(mascot,i%2?palette.leaf:palette.emerald,.31,Math.cos(a)*.65,1.62,Math.sin(a)*.66,1,.24,.85);plate.rotation.y=a}
  sphere(mascot,palette.snow,.61,0,1.13,-.96,1.13,.88,1.03);
  for(const side of [-1,1]){
    sphere(mascot,palette.snow,.21,side*.28,1.36,-1.42,.9,1.1,.55);
    sphere(mascot,palette.cobalt,.12,side*.28,1.38,-1.59);
    sphere(mascot,palette.gold,.045,side*.25,1.43,-1.69);
    sphere(mascot,palette.emerald,.29,side*.68,.5,-.47,.82,1.1,.91);
    sphere(mascot,palette.emerald,.27,side*.63,.5,.62,.9,.9,.85);
  }
  const hat=add(new THREE.ConeGeometry(.46,.9,radial*2,4),palette.ruby,mascot,0,2.02,-1.02);hat.rotation.z=-.2;
  torus(mascot,palette.snow,.4,.09,0,1.68,-1.02,Math.PI/2);
  sphere(mascot,palette.snow,.13,-.22,2.42,-1.02);
  for(const [x,z,c] of [[-8.45,-2.65,palette.star],[-7.1,-1.8,palette.emerald],[-5.35,-4.2,palette.ruby],[-4.9,-.6,palette.blue]]){
    cylinder(garden,palette.brass,.43,.55,.65,x,.45,z);
    sphere(garden,c,.49,x,1.17,z,.96,1.05,.75);
    torus(garden,palette.gold,.42,.035,x,1.15,z,Math.PI/2);
  }
  for(let k=0;k<8;k++){const x=-8.6+k*.55;star(garden,x,2.72+Math.sin(k*1.9)*.28,-4.5,.11);}

  const block=group('Block · fazer acontecer');
  glitterArc(block,-6.2,2.4,5.55,3.2,palette.gold);
  // Barras de chocolate facetadas e relevos com bevel real.
  function tablet(x,y,z,w,h,d,rows=2,cols=3){
    round(block,palette.chocolate,w,h,d,x,y,z,.16);
    const cellW=w/(cols+0.2),cellH=h/(rows+.3);
    for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
      round(block,palette.cocoa,cellW*.87,cellH*.83,d*.13,x+(i-(cols-1)/2)*cellW,y+(j-(rows-1)/2)*cellH,z+d*.54,.065);
    }
  }
  tablet(-8.85,2.23,6.85,.85,1.5,.32,3,2);
  tablet(-4.08,2.1,7.65,1.05,1.6,.32,3,2);
  tablet(-6.4,.76,7.8,2,.94,.32,2,4);
  // Estruturas de ação mais sofisticadas, mas sem exigir escalada.
  for(let i=0;i<4;i++){
    const x=-8.5+i*1.45;
    const panel=round(block,i%2?palette.cobalt:palette.blue,1.03,1.4,.2,x,1.75,7.57,.13);
    round(block,palette.gold,.86,.09,.25,x,2.43,7.58,.02);
    star(block,x,1.7,7.72,.29,i%2?palette.star:palette.gold);
  }
  for(let i=0;i<7;i++){
    const x=-8.5+i*.72,y=3.95+Math.sin(i*1.2)*.24;
    sphere(block,i%2?palette.star:palette.gold,.12,x,y,3.15);
  }
  for(let i=0;i<4;i++)curve(block,palette.gold,[[-8.8+i*.03,.3,4.1],[-8.8+i*.04,1.25,4.7],[-8.8+i*.09,2.2,5.25]],.018);
  
  const butter=group('Butter Toffees · encontrar o outro');
  glitterArc(butter,6.1,7.1,5.5,3.05,palette.caramelLight);
  // Cobertura de caramelo em espirais concêntricas, com laços de luz.
  for(let ring=0;ring<3;ring++){
    const coords=[];
    for(let i=0;i<=points*2;i++){
      const t=i/(points*2)*Math.PI*2.25,r=1.75+ring*.28;
      coords.push([6.15+Math.cos(t)*r,3.13+ring*.19+Math.sin(t*1.2)*.16,5.35+Math.sin(t)*r*.73]);
    }
    curve(butter,ring%2?palette.gold:palette.caramel,coords,.19-ring*.035,points*2);
  }
  // Toffee escultórico com embalagem torcendo nas pontas.
  sphere(butter,palette.caramel,.78,7.45,3.35,6.6,1.3,.56,.72);
  for(const side of [-1,1]){
    const twist=new THREE.Group();twist.position.set(7.45+side*1.0,3.35,6.6);twist.rotation.z=side*.32;butter.add(twist);
    const wrap=add(new THREE.ConeGeometry(.5,.76,radial*2,4),palette.gold,twist,side*.3,0,0);
    wrap.rotation.z=side*Math.PI/2;
    torus(twist,palette.gold,.21,.044,side*.03,0,0,0,Math.PI/2);
  }
  for(let i=0;i<3;i++){
    const x=3.7+i*2.3;
    torus(butter,palette.caramelLight,.75,.095,x,.95,5.05,Math.PI/2);
    const coils=[];
    for(let j=0;j<=points;j++){
      const t=j/points*Math.PI*2.5,r=.5-j/points*.24;
      coils.push([x+Math.cos(t)*r,1.015+j/points*.13,5.05+Math.sin(t)*r]);
    }
    curve(butter,palette.cocoa,coils,.052);
  }
  for(let i=0;i<4;i++){
    sphere(butter,palette.caramelLight,.22,3.15+i*1.84,2.35+Math.sin(i*1.2)*.38,7.95,1.3,.65,1.2);
  }

  const climax=group('Arcor · reconhecimento');
  const cx=.65,cz=.7,r=3.35;
  // Doze nervuras curvas formam o grande laço arquitetônico sobre o clímax.
  for(let i=0;i<12;i++){
    const a=i/12*Math.PI*2;
    const coords=[];
    for(let j=0;j<=points;j++){
      const t=j/points,rr=r*Math.pow(1-t,.67);
      coords.push([cx+Math.cos(a)*rr,.65+Math.sin(t*Math.PI*.5)*6.0,cz+Math.sin(a)*rr]);
    }
    curve(climax,i%3?palette.gold:palette.velvet,coords,i%3?.055:.13);
    if(i%2===0){
      for(let j=1;j<4;j++){const p=coords[Math.floor(j*points/4)];star(climax,p[0],p[1],p[2],.11);}
    }
  }
  torus(climax,palette.gold,3.22,.13,cx,4.7,cz,Math.PI/2);
  torus(climax,palette.velvet,2.9,.14,cx,4.45,cz,Math.PI/2);
  const top=star(climax,cx,6.72,cz,.48);top.rotation.y=Math.PI/4;
  bow(climax,cx,5.96,cz,1.05);
  for(let k=0;k<24;k++){
    const a=k*Math.PI/12,radius=2.95;
    const x=cx+Math.cos(a)*radius,z=cz+Math.sin(a)*radius;
    sphere(climax,k%4?palette.gold:palette.ruby,.095,x,3.85+(k%3)*.2,z);
    if(k%3===0)star(climax,x,3.05,z,.21);
  }

  const bon=group('Bon o Bon · partilha');
  glitterArc(bon,6.5,-7.27,5.0,3.05);
  bow(bon,6.5,4.6,-7.28,.9);
  // Expositores arredondados e bombons de chocolate com invólucros.
  for(let i=0;i<8;i++){
    const x=4.0+(i%4)*1.45,z=-4.55+Math.floor(i/4)*1.25;
    cylinder(bon,palette.gold,.47,.49,.42,x,.42,z);
    sphere(bon,palette.chocolate,.29,x,.91,z,1,.82,1);
    torus(bon,palette.caramelLight,.22,.025,x,.91,z,Math.PI/2);
    star(bon,x,1.26,z,.1);
  }
  for(const [x,z,s] of [[3.8,-6.5,.5],[9,-6.5,.43],[8.75,-4.05,.4]])gift(bon,x,0,z,s);
  holidayTree(bon,9.1,-3.6,.51);

  const exit=group('Saída');
  glitterArc(exit,6,-9.48,4.25,3.35);
  bow(exit,6,4.95,-9.51,.7);
  for(const [x,z] of [[3.6,-8.8],[8.3,-8.8]])holidayTree(exit,x,z,.45);
  for(const [x,z,s] of [[4.4,-9.15,.3],[8,-9.2,.31]])gift(exit,x,0,z,s);

  // Átrio comercial de referência: fachadas e guarda-corpos genéricos, sem planta oficial.
  const mall=group('Átrio conceitual do Shopping Eldorado');
  const metal=new THREE.MeshStandardMaterial({color:0x7f8b90,metalness:.82,roughness:.23});
  const glass=new THREE.MeshPhysicalMaterial({color:0xd5e6e8,transparent:true,opacity:.18,depthWrite:false,roughness:.12,metalness:.08,side:THREE.DoubleSide});
  for(const z of [-12.75,12.75]){
    round(mall,metal,29,.08,.15,0,8.25,z,.025);
    for(let i=-13;i<=13;i+=1.6)cylinder(mall,metal,.025,.025,1.12,i,7.6,z);
    round(mall,glass,28,1.1,.045,0,7.6,z,.015);
  }
  for(const x of [-13.75,13.75]){
    round(mall,metal,.15,.08,28,x,8.25,0,.025);
    for(let i=-13;i<=13;i+=1.6)cylinder(mall,metal,.024,.024,1.12,x,7.6,i);
    round(mall,glass,.045,1.1,28,x,7.6,0,.015);
  }
  for(const [x,z] of [[-11,-11.2],[11,-11.2],[-11,11.2],[11,11.2]]){
    for(let i=0;i<3;i++)torus(mall,palette.gold,.37+i*.27,.028,x,8.65+i*.2,z,Math.PI/2);
    star(mall,x,7.35,z,.22);
  }

  // Pontos brilhantes repetidos num único draw call: preserva polígonos e desempenho.
  const geometry=new THREE.SphereGeometry(.049,high?12:8,high?8:6);
  const bulbMesh=new THREE.InstancedMesh(geometry,palette.glow,beads.length);
  const dummy=new THREE.Object3D();
  beads.forEach((p,i)=>{dummy.position.set(...p);dummy.scale.setScalar((i%7===0)?1.5:1);dummy.updateMatrix();bulbMesh.setMatrixAt(i,dummy.matrix)});
  bulbMesh.instanceMatrix.needsUpdate=true;bulbMesh.castShadow=false;bulbMesh.frustumCulled=false;scene.add(bulbMesh);

  return {high,decorations:beads.length,sectors:Object.keys(groups).length};
}
