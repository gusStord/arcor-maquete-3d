import test from 'node:test';
import assert from 'node:assert/strict';
import { freshState, normalize, transition, balanced, ready, demoState } from '../js/state.js';
test('a family can complete the whole journey with any of the four symbols',()=>{
 for(const id of ['star','heart','tree','gift']){
  let s=freshState();
  for(const action of [{type:'receive'},{type:'symbol',id},{type:'piece',id:'base'},{type:'piece',id:'bridge'},{type:'piece',id:'spark'},{type:'balance',index:0,value:50},{type:'balance',index:1,value:50},{type:'cooperate'},{type:'reveal'},{type:'share'}])s=transition(s,action);
  assert.equal(s.symbol,id);assert.equal(s.shared,true);assert.deepEqual(normalize(JSON.parse(JSON.stringify(s))),s);
 }
});
test('out-of-order actions cannot fabricate a completed journey',()=>{
 const s=freshState();for(const action of [{type:'symbol',id:'star'},{type:'piece',id:'base'},{type:'cooperate'},{type:'reveal'},{type:'share'}])assert.equal(transition(s,action),s);
 let t=transition(transition(s,{type:'receive'}),{type:'symbol',id:'star'});assert.equal(transition(t,{type:'piece',id:'spark'}),t);assert.equal(ready(t),false);
});
test('cooperation requires two nearby controls around the shared center',()=>{
 assert.equal(balanced({...freshState(),balance:[20,20]}),false);assert.equal(balanced({...freshState(),balance:[45,55]}),false);assert.equal(balanced({...freshState(),balance:[48,52]}),true);
});
test('a new symbol preserves achievements but requires a new recognition and gift',()=>{
 const s={received:true,symbol:'star',blocks:3,balance:[50,50],cooperated:true,revealed:true,shared:true};const next=transition(s,{type:'symbol',id:'heart'});assert.equal(next.blocks,3);assert.equal(next.cooperated,true);assert.equal(next.revealed,false);assert.equal(next.shared,false);assert.equal(s.symbol,'star');
});
test('corrupt storage is bounded and cannot inject symbols or skip prerequisites',()=>{
 assert.deepEqual(normalize(null),freshState());assert.equal(normalize({received:true,symbol:'<script>',blocks:99,cooperated:true,revealed:true,shared:true}).shared,false);assert.deepEqual(normalize({balance:[NaN,Infinity]}).balance,[20,80]);assert.deepEqual(normalize({balance:[-500,200]}).balance,[0,100]);
});
test('demo progress is isolated, ordered and complete through the exit',()=>{
 const own=freshState();for(let i=0;i<7;i++)for(let t=0;t<12;t++){const d=demoState(i,t);assert.deepEqual(normalize(d),d)}assert.equal(demoState(6,0).shared,true);assert.deepEqual(own,freshState());assert.equal(demoState(4,2).revealed,false);assert.equal(demoState(4,3).revealed,true);
});
