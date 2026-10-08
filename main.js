import { stages, symbols, pieces } from './js/narrative.js';
import { freshState, loadState, saveState, transition, balanced, ready, demoState } from './js/state.js';
const $=s=>document.querySelector(s);
const loaded=loadState();let family=loaded.state,active=-1,scene=null,demo=false,playing=false,tourElapsed=0,lastTime=0,lastDemoKey='',audio=null,sound=false;
const durations=[9,10,12,12,11,9,8];
$('#storage-note').hidden=loaded.available;
function shown(){return demo?demoState(active,tourElapsed):family}
function completed(s,i){return [s.received,!!s.symbol,s.blocks===3,s.cooperated,s.revealed,s.shared,s.shared][i]}
const symbolInfo=s=>symbols.find(x=>x.id===s.symbol);
const action=(id,label,extra='')=>`<button class="primary" data-action="${id}" ${extra}>${label}</button>`;
const jump=(i,label)=>`<button class="tool" data-jump="${i}">${label}</button>`;
function prerequisites(s,i){if(i>0&&!s.received)return [0,'Receber minha fita'];if(i>1&&!s.symbol)return [1,'Escolher meu símbolo'];if(i>2&&s.blocks<3)return [2,'Concluir a construção'];if(i>3&&!s.cooperated)return [3,'Encontrar nosso ritmo'];if(i>4&&!s.revealed)return [4,'Revelar nosso Natal'];return null}
function interaction(s){
 if(active<0)return '<div class="interaction"><h4>Como vocês vão transformar o Natal?</h4><p>Uma escolha no jardim, uma construção em conjunto e um encontro de ritmos deixam marcas no cenário.</p><p class="fine">Explore os módulos livremente ou acompanhe a apresentação automática.</p></div>';
 const blocked=prerequisites(s,active);
 if(blocked&&!demo)return `<div class="interaction"><h4>Este capítulo continua a sua história.</h4><p>Para participar, complete primeiro a etapa anterior. Você pode continuar explorando a maquete.</p>${jump(...blocked)}</div>`;
 const lock=demo?'disabled':'';
 let content='';
 if(active===0)content=`<h4>A missão da sua família</h4><p>Recebam uma fita para guardar, simbolicamente, tudo o que vão criar juntos.</p>${s.received?'<p class="success">Sua fita está com vocês. O portal ganhou luz.</p>':action('receive','Receber nossa Fita de Autoria',lock)}<p class="fine">Identidade demonstrativa. A tecnologia física ainda não está definida.</p>`;
 if(active===1)content=`<h4>Como o seu Natal começa?</h4><p>Escolham um símbolo. Ele aparece no jardim e volta a encontrar vocês no clímax.</p><div class="choices">${symbols.map(x=>`<button class="choice" data-symbol="${x.id}" aria-pressed="${s.symbol===x.id}" ${lock}><span class="symbol" aria-hidden="true">${x.glyph}</span>${x.label}</button>`).join('')}</div>${s.symbol?`<p>O símbolo da família: <strong>${symbolInfo(s).label}</strong>.</p>`:''}`;
 if(active===2)content=`<h4>Uma ideia precisa de vocês.</h4><p>${s.blocks===3?'Vocês construíram juntos. A estrutura e a fita ganharam luz.':'Montem uma estrutura que consiga se sustentar: primeiro a base, depois a ponte e, por último, a luz.'}</p><div class="build-slots" aria-label="Construção: ${s.blocks} de 3 peças">${pieces.map((p,i)=>`<span class="${i<s.blocks?'filled':''}">${i<s.blocks?'✓ ':''}${p.label}</span>`).join('')}</div><div class="pieces">${[pieces[2],pieces[0],pieces[1]].map(p=>`<button class="choice" data-piece="${p.id}" ${lock||pieces.findIndex(x=>x.id===p.id)<s.blocks?'disabled':''}><span class="symbol" aria-hidden="true">${p.glyph}</span>${p.label}</button>`).join('')}</div><p class="fine">Sem tempo limite. A conquista é da família.</p>`;
 if(active===3)content=`<h4>Encontrem o ponto juntos.</h4><p>Esticar, ceder, encontrar o ponto e firmar. Ajustem os dois controles perto de 50, mantendo os valores próximos.</p>${s.balance.map((v,i)=>`<label class="slider-row"><span>Pessoa ${i+1}<output id="value-${i}" for="balance-${i}">${Math.round(v)}</output></span><input id="balance-${i}" data-balance="${i}" type="range" min="0" max="100" value="${v}" aria-label="Ritmo da pessoa ${i+1}" ${lock||s.cooperated?'disabled':''}></label>`).join('')}<div class="balance-track" aria-hidden="true"></div><p id="balance-status" class="balance-label">${balanceText(s)}</p>${action('cooperate',s.cooperated?'Encontro firmado':'Firmar nosso encontro',lock||s.cooperated||!balanced(s)?'disabled':'')}<p class="fine">Cada pessoa pode ajustar um controle; uma pessoa também pode experimentar os dois. A rapidez não altera o resultado.</p>`;
 if(active===4)content=`<h4>${s.revealed?'A nossa está ali.':'O Natal tem a marca de vocês.'}</h4><div class="reveal-symbol" aria-label="${symbolInfo(s)?.label||'Símbolo da família'}">${symbolInfo(s)?.glyph||'✧'}</div><ul class="summary"><li>${symbolInfo(s)?.label||'Símbolo'}: a imaginação da família.</li><li>Três peças: o que vocês fizeram acontecer.</li><li>Dois aros unidos: o encontro de vocês.</li></ul>${action('reveal',s.revealed?'Nosso Natal está revelado':'Revelar nosso Natal',lock||s.revealed?'disabled':'')}<p class="fine">Uma única família completa toda a experiência. A forma física do clímax permanece em estudo.</p>`;
 if(active===5)content=`<h4>Para quem o Natal continua?</h4><p>Uma parte da experiência fica com vocês. Outra se transforma em um gesto para alguém.</p>${action('share',s.shared?'O gesto chegou à outra família':'Passar o presente adiante',lock||s.shared?'disabled':'')}<p class="fine">Bon o Bon como presente: hipótese sujeita à validação acadêmica. Embalagem, quantidade e distribuição em estudo.</p>`;
 if(active===6)content=`<h4>O Natal que criamos continua com você.</h4><p>${s.shared?'Vocês imaginaram, construíram, se encontraram e compartilharam. O cenário guarda os sinais dessa história.':'Conheçam cada etapa e levem adiante aquilo que construíram juntos.'}</p><div class="reveal-symbol" aria-hidden="true">${symbolInfo(s)?.glyph||'✧'}</div>${!s.shared&&!demo?jump(5,'Passar o presente adiante'):''}`;
 return `<div class="interaction">${content}</div>`;
}
function balanceText(s){return s.cooperated?'Vocês encontraram um ritmo compartilhado.':balanced(s)?'O ponto de encontro chegou. Agora, firmem.':Math.abs(s.balance[0]-s.balance[1])>30?'Esticar e ceder: aproximem os ritmos.':'Encontrem juntos o centro, perto de 50.'}
function renderPass(s){$('#pass-symbol').textContent=symbolInfo(s)?.glyph||'✧';$('#pass-text').textContent=demo?'Família de demonstração · suas escolhas estão guardadas.':s.shared?'Nossa história agora alcança outra pessoa.':s.symbol?`${symbolInfo(s).label} · o sinal da nossa família.`:s.received?'Sua fita está pronta para receber uma história.':'Uma identidade compartilhada pela família.';$('#milestones').innerHTML=[['Imaginar',!!s.symbol],['Construir',s.blocks===3],['Encontrar',s.cooperated],['Partilhar',s.shared]].map(([text,done])=>`<span class="${done?'done':''}">${done?'✓ ':''}${text}</span>`).join('');$('#reset').disabled=demo}
function render(){const s=shown(),st=stages[active];document.querySelector('.stage').classList.toggle('focused',active>=0);
 $('#detail-count').textContent=st?`ETAPA ${String(active+1).padStart(2,'0')} / 07`:'VISÃO GERAL';
 $('#detail-title').textContent=st?st.name+' · '+st.verb:'Tudo começa com vocês.';
 $('#detail-text').textContent=st?st.text:'Siga a fita vermelha. Imagine, construa e encontre o ritmo de quem está ao seu lado.';
 $('#detail-quote').textContent=st?st.quote:'“Este Natal ainda não existe. E precisamos de vocês para fazê-lo acontecer.”';
 $('#interaction').innerHTML=interaction(s);$('#demo-badge').hidden=!demo;
 $('#scene-caption').textContent=active<0?'Um Natal que ganha vida com vocês.':active===6?'O Natal que criamos continua com você.':st.verb+' · '+st.short;
 $('#mode-label').textContent=demo?(playing?'APRESENTAÇÃO GUIADA':'APRESENTAÇÃO PAUSADA'):'EXPLORAÇÃO LIVRE';
 $('#tour').textContent=demo?(playing?'Pausar':'Continuar apresentação'):'Apresentação guiada';
 $('#restart-tour').hidden=!demo;$('#leave-tour').hidden=!demo;$('#tour-timeline').hidden=!demo;
 $('#continue').hidden=demo;$('#continue').textContent=active<0?'Começar minha jornada':active===6?'Voltar à vista geral':'Continuar a jornada';
 $('#continue').disabled=active>=0&&active<6&&!completed(s,active);
 $('#previous').disabled=active<=0;$('#next').disabled=active===6;
 document.querySelectorAll('.chapter').forEach((b,i)=>{b.classList.toggle('selected',active===i);b.classList.toggle('complete',completed(s,i));b.setAttribute('aria-current',active===i?'step':'false');b.title=stages[i].name+(completed(s,i)?' · concluído':'')});
 renderPass(s);scene?.update(s);
}
function focusDetail(){if(matchMedia('(max-width:800px)').matches)$('#detail').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'})}
function select(i,{fromMarker=false}={}){active=Math.max(-1,Math.min(6,i));$('#feedback').textContent='';if(demo){demo=false;playing=false}render();scene?.focus(active);if(fromMarker)focusDetail();else if(matchMedia('(min-width:801px)').matches)document.querySelector('.panel').scrollTop=0;}
stages.forEach((s,i)=>{const b=document.createElement('button');b.className='chapter';b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label',s.name+' — '+s.verb);b.onclick=()=>select(i);$('#chapter-list').append(b)});
function notify(text){$('#feedback').textContent=text}
function persist(){if(!saveState(family))$('#storage-note').hidden=false}
$('#interaction').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled||demo)return;
 if(b.dataset.jump!==undefined){select(Number(b.dataset.jump));return}
 let a=null,message='';
 if(b.dataset.symbol){a={type:'symbol',id:b.dataset.symbol};message='O jardim reconheceu sua escolha. Esse símbolo voltará no clímax.'}
 if(b.dataset.piece){a={type:'piece',id:b.dataset.piece};if(pieces[family.blocks]?.id!==b.dataset.piece){notify('Ainda não encaixa. Tentem '+pieces[family.blocks].label.toLowerCase()+' primeiro.');return}message=family.blocks===2?'Vocês fizeram acontecer. A construção acendeu!':'Peça encaixada. A construção está ganhando forma.'}
 if(b.dataset.action){a={type:b.dataset.action};message={receive:'Esta fita agora conta a história de vocês.',cooperate:'Vocês encontraram o ponto. Os dois aros vão acompanhar seu símbolo.',reveal:'A nossa está ali: símbolo, construção e encontro reunidos.',share:'O presente chegou. O Natal continua com outra família.'}[a.type]}
 if(!a)return;const next=transition(family,a);if(next===family)return;family=next;persist();render();notify(message);chime();
});
$('#interaction').addEventListener('input',e=>{const el=e.target;if(el.dataset.balance===undefined||demo)return;family=transition(family,{type:'balance',index:Number(el.dataset.balance),value:Number(el.value)});persist();$('#value-'+el.dataset.balance).textContent=el.value;$('#balance-status').textContent=balanceText(family);$('[data-action="cooperate"]').disabled=!balanced(family)||family.cooperated;scene?.update(family)});
$('#continue').onclick=()=>{select(active===6?-1:active+1);focusDetail()};
$('#overview').onclick=()=>select(-1);
$('#zoom-in').onclick=()=>scene?.zoom(.82);$('#zoom-out').onclick=()=>scene?.zoom(1.22);
function move(d){if(demo){active=Math.max(0,Math.min(6,active+d));tourElapsed=0;lastDemoKey='';render();scene?.focus(active)}else select(active<0?0:active+d)}
$('#previous').onclick=()=>move(-1);$('#next').onclick=()=>move(1);
function startTour(){demo=true;playing=true;active=0;tourElapsed=0;lastDemoKey='';notify('');render();scene?.focus(0)}
$('#tour').onclick=()=>{if(!demo)startTour();else{if(active===6&&tourElapsed>=durations[6])startTour();else{playing=!playing;render()}}};
$('#restart-tour').onclick=startTour;$('#leave-tour').onclick=()=>select(active);
function tick(now){const dt=lastTime?Math.max(0,(now-lastTime)/1000):0;lastTime=now;if(demo&&playing&&!document.hidden){tourElapsed+=dt;if(tourElapsed>=durations[active]){if(active<6){active++;tourElapsed=0;lastDemoKey='';scene?.focus(active)}else{tourElapsed=durations[6];playing=false}}const s=shown(),key=[active,s.received,s.symbol,s.blocks,s.cooperated,s.revealed,s.shared,Math.floor(tourElapsed)].join('/');if(key!==lastDemoKey){lastDemoKey=key;render()}scene?.update(s);$('#tour-progress').style.width=(tourElapsed/durations[active]*100)+'%'}requestAnimationFrame(tick)}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing){playing=false;render()}if(document.hidden&&audio)audio.suspend();else if(sound&&audio)audio.resume().catch(()=>{})});
$('#reset').onclick=()=>$('#reset-dialog').showModal();$('#reset-cancel').onclick=()=>$('#reset-dialog').close();$('#reset-confirm').onclick=()=>{family=freshState();persist();$('#reset-dialog').close();select(0)};
$('#about-open').onclick=()=>$('#about').showModal();$('#about-close').onclick=()=>$('#about').close();
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{notify('O navegador não permite tela cheia nesta janela.')}};
document.addEventListener('fullscreenchange',()=>$('#fullscreen').textContent=document.fullscreenElement?'Sair da tela cheia':'Tela cheia');
function chime(){if(!sound||!audio)return;[523.25,659.25,783.99].forEach((f,i)=>{const osc=audio.createOscillator(),gain=audio.createGain(),t=audio.currentTime+i*.1;osc.type='sine';osc.frequency.value=f;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.025,t+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+1);osc.connect(gain).connect(audio.destination);osc.start(t);osc.stop(t+1.1);osc.onended=()=>{osc.disconnect();gain.disconnect()}})}
let ambienceTimer=null;
$('#sound').onclick=async()=>{try{sound=!sound;if(sound){const Context=window.AudioContext||window.webkitAudioContext;if(!Context)throw Error('Audio unavailable');audio??=new Context();await audio.resume();chime();ambienceTimer=setInterval(chime,7000)}else{clearInterval(ambienceTimer);ambienceTimer=null;await audio?.suspend()}$('#sound').textContent=sound?'Som ligado':'Som desligado';$('#sound').setAttribute('aria-pressed',String(sound))}catch{sound=false;clearInterval(ambienceTimer);notify('O áudio não está disponível neste navegador.')}};
function sceneError(message){const node=$('#scene-status');node.hidden=false;node.replaceChildren();const p=document.createElement('p');p.textContent=message;const b=document.createElement('button');b.className='tool';b.textContent='Tentar novamente';b.onclick=()=>location.reload();node.append(p,b);document.body.dataset.sceneReady='error'}
render();requestAnimationFrame(tick);document.body.dataset.uiReady='true';
const timeout=setTimeout(()=>sceneError('A maquete está demorando a carregar. Confira sua conexão. Você pode continuar a jornada no painel.'),20000);
try{const {createScene}=await import('./js/scene.js');scene=createScene({mount:$('#viewport'),labelContainer:$('#labels'),onSelect:i=>select(i,{fromMarker:true}),onError:sceneError});clearTimeout(timeout);$('#scene-status').hidden=true;scene.update(shown());scene.focus(active);document.body.dataset.sceneReady='true'}catch(error){clearTimeout(timeout);console.error('Falha na maquete 3D:',error);sceneError('Não foi possível carregar a maquete 3D. Verifique a conexão e o suporte a WebGL. A jornada no painel continua disponível.')}
