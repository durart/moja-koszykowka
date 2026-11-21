import test from 'node:test';
import assert from 'node:assert/strict';
import {EXERCISES,CATEGORIES,DEFAULT_PLAN} from '../src/catalog.js';
import {freshState,makePlan,addPlanItem,createSession,addSessionItem,toggleComplete,toggleSkip,startItem,updateMetric,setSessionStatus,shootingSummary,importState,defaultTraining,filterExercises} from '../src/state.js';

test('katalog ma dokładnie 90 unikatowych pozycji w 10 kategoriach',()=>{
  assert.equal(EXERCISES.length,90);
  assert.equal(new Set(EXERCISES.map(x=>x.id)).size,90);
  assert.equal(CATEGORIES.length,10);
  for(const c of CATEGORIES) assert.equal(EXERCISES.filter(e=>e.category===c.id).length,c.count);
  for(const ex of EXERCISES){assert.ok(ex.name&&ex.instructions.length);assert.ok(ex.level>=1&&ex.level<=4);}
});

test('drugi element nie zmienia statusu pierwszego ani duplikatów',()=>{
  const s=freshState();const p=makePlan(s,{name:'Powtarzane',items:[{exerciseId:EXERCISES[0].id},{exerciseId:EXERCISES[0].id},{exerciseId:EXERCISES[0].id}]});const sess=createSession(s,p);
  startItem(sess,sess.items[1].id);toggleComplete(sess,sess.items[1].id);
  assert.equal(sess.items[0].status,'pending');assert.equal(sess.items[1].status,'completed');assert.equal(sess.items[2].status,'pending');
  toggleComplete(sess,sess.items[1].id);
  assert.equal(sess.items[1].status,'active');assert.equal(sess.items[0].status,'pending');
});

test('cofanie wykonania jest możliwe po rozpoczęciu innego ćwiczenia',()=>{
  const s=freshState();const p=defaultTraining(s);const sess=createSession(s,p);const a=sess.items[0];const b=sess.items[1];toggleComplete(sess,a.id);startItem(sess,b.id);toggleComplete(sess,a.id);assert.equal(a.status,'active');assert.equal(b.status,'active');
});

test('dodawanie do aktywnej sesji nie modyfikuje źródłowego planu',()=>{
  const s=freshState();const p=defaultTraining(s);const sess=createSession(s,p);const n=p.items.length;
  const addition=addSessionItem(s,sess,'b-games-01');assert.equal(sess.items.length,n+1);assert.equal(p.items.length,n);assert.notEqual(addition.id,p.items[0].id);
});

test('rzuty: metryki mają poprawne ograniczenia i procent nie jest 0/0',()=>{
  const s=freshState();const p=makePlan(s,{name:'Rzuty',items:[{exerciseId:'b-shooting-01'}]});const sess=createSession(s,p);const id=sess.items[0].id;
  assert.equal(shootingSummary(sess).percentage,null);
  assert.equal(updateMetric(sess,id,'made',1),false);
  assert.equal(updateMetric(sess,id,'attempted',1),true);
  assert.equal(updateMetric(sess,id,'made',1),true);
  assert.equal(updateMetric(sess,id,'attempted',-1),false);
  assert.deepEqual(shootingSummary(sess),{made:1,attempted:1,percentage:100});
  assert.equal(updateMetric(sess,id,'made',-2),false);
  assert.throws(()=>updateMetric(sess,id,'bogus',1));
});

test('ukończenie z niewykonanymi zachowuje status pozostałych',()=>{
  const s=freshState();const sess=createSession(s,defaultTraining(s));toggleComplete(sess,sess.items[2].id);setSessionStatus(sess,'completed');s.activeSessionId=null;
  assert.equal(sess.status,'completed');assert.equal(sess.items[0].status,'pending');assert.equal(sess.items[2].status,'completed');
});

test('plany grupowe i stacje mają odrębne ustawienia',()=>{
  const s=freshState();s.mode='coach';const p=makePlan(s,{name:'Stacje',mode:'coach'});addPlanItem(s,p,'b-passing-01');addPlanItem(s,p,'b-dribbling-01');p.items[1].station=2;const sess=createSession(s,p);
  assert.equal(sess.mode,'coach');assert.equal(sess.items[0].station,1);assert.equal(sess.items[1].station,2);
  assert.equal(sess.stationRemaining,480);
});

test('eksport i import zachowują historię i ustawienia',()=>{
  const s=freshState();s.mode='coach';s.plans.push(makePlan(s,{name:'Plan testowy',items:DEFAULT_PLAN}));const sess=createSession(s,s.plans[0]);sess.items[0].notes='Ćwiczenie poprawne';const copy=importState(JSON.stringify(s));
  assert.deepEqual(copy,s);
  assert.throws(()=>importState('{"schemaVersion":999}'));
  assert.throws(()=>importState('{}'));
});

test('filtrowanie uwzględnia kategorię, poziom i szukaną frazę',()=>{
  const s=freshState();const filtered=filterExercises(s,{category:'shooting',level:'2',query:'rzuty'});
  assert.ok(filtered.length>0);assert.ok(filtered.every(e=>e.category==='shooting'&&e.level===2));
});

test('pominięcie i przywrócenie ćwiczenia zmienia tylko jego status',()=>{
  const s=freshState();const sess=createSession(s,defaultTraining(s));const second=sess.items[1];toggleSkip(sess,second.id);assert.equal(second.status,'skipped');assert.equal(sess.items[0].status,'pending');toggleSkip(sess,second.id);assert.equal(second.status,'pending');
});
