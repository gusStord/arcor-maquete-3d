import { symbols, pieces } from './narrative.js';
export const STORAGE_KEY = 'arcor-family-v2';
export const freshState = () => ({ received:false, symbol:null, blocks:0, balance:[20,80], cooperated:false, revealed:false, shared:false });
export function normalize(raw) {
 const s=freshState();
 if(!raw || typeof raw!=='object') return s;
 s.received=raw.received===true;
 s.symbol=s.received && symbols.some(x=>x.id===raw.symbol)?raw.symbol:null;
 s.blocks=s.symbol && Number.isInteger(raw.blocks)?Math.max(0,Math.min(3,raw.blocks)):0;
 if(Array.isArray(raw.balance) && raw.balance.length===2 && raw.balance.every(Number.isFinite)) s.balance=raw.balance.map(x=>Math.max(0,Math.min(100,x)));
 s.cooperated=s.blocks===3 && raw.cooperated===true;
 s.revealed=s.cooperated && raw.revealed===true;
 s.shared=s.revealed && raw.shared===true;
 return s;
}
export const balanced=s=>s.balance.every(v=>Math.abs(v-50)<=5) && Math.abs(s.balance[0]-s.balance[1])<=5;
export const ready=s=>!!s.symbol && s.blocks===3 && s.cooperated;
export function transition(s, action) {
 const n={...s,balance:[...s.balance]};
 switch(action.type){
 case 'receive':n.received=true;break;
 case 'symbol':if(!s.received || !symbols.some(x=>x.id===action.id))return s;n.symbol=action.id;n.revealed=false;n.shared=false;break;
 case 'piece':if(!s.symbol || s.blocks>=3 || pieces[s.blocks].id!==action.id)return s;n.blocks++;break;
 case 'balance':if(s.blocks!==3 || s.cooperated || ![0,1].includes(action.index) || !Number.isFinite(action.value))return s;n.balance[action.index]=Math.max(0,Math.min(100,action.value));break;
 case 'cooperate':if(s.blocks!==3 || !balanced(s))return s;n.cooperated=true;break;
 case 'reveal':if(!ready(s))return s;n.revealed=true;break;
 case 'share':if(!s.revealed)return s;n.shared=true;break;
 default:return s;
 }return n;
}
export function loadState(){try{return {state:normalize(JSON.parse(sessionStorage.getItem(STORAGE_KEY))),available:true}}catch{return {state:freshState(),available:false}}}
export function saveState(s){try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(s));return true}catch{return false}}
// The guided presentation owns an isolated state; it never writes family storage.
export function demoState(stage, seconds){
 const s=freshState();
 s.received=stage>0 || seconds>=2;
 s.symbol=stage>1 || stage===1&&seconds>=3?'star':null;
 s.blocks=stage>2?3:stage===2?Math.min(3,Math.max(0,Math.floor((seconds-1)/2))):0;
 s.balance=stage>3?[50,50]:stage===3?[Math.min(50,20+seconds*5),Math.max(50,80-seconds*5)]:[20,80];
 s.cooperated=stage>3 || stage===3&&seconds>=7;
 s.revealed=stage>4 || stage===4&&seconds>=3;
 s.shared=stage>5 || stage===5&&seconds>=4;
 return s;
}
