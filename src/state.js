import {EXERCISES, DEFAULT_PLAN} from './catalog.js';
export const SCHEMA_VERSION=1;
export const uuid=()=>globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const freshState=()=>({schemaVersion:SCHEMA_VERSION,mode:'player',plans:[],sessions:[],activeSessionId:null,groupNames:[],customExercises:[],settings:{restSec:30,sounds:false},createdAt:new Date().toISOString()});
export const allExercises=(s)=>[...EXERCISES,...(s.customExercises||[])];
export const findExercise=(s,id)=>allExercises(s).find(e=>e.id===id);
export const makePlan=(s,{name,mode=s.mode,items=[]})=>{
  const plan={id:uuid(),name:name.trim() || 'Nowy trening',mode,createdAt:new Date().toISOString(),items:[]};
  for(const row of items){const ex=findExercise(s,row.exerciseId);if(ex)plan.items.push({id:uuid(),exerciseId:ex.id,durationSec:row.durationSec||ex.durationSec,station:row.station||1,phase:row.phase||ex.phase});}
  return plan;
};
export const addPlanItem=(s,plan,exerciseId)=>{
  const ex=findExercise(s,exerciseId);if(!ex)throw Error('Nie znaleziono ćwiczenia');
  plan.items.push({id:uuid(),exerciseId:ex.id,durationSec:ex.durationSec,station:1,phase:ex.phase});
  return plan;
};
export const createSession=(s,plan=null)=>{
  if(s.activeSessionId && s.sessions.some(x=>x.id===s.activeSessionId && x.status!=='completed')) throw Error('Najpierw zakończ aktywny trening');
  const sess={id:uuid(),planId:plan?.id||null,title:plan?.name||'Trening bez planu',mode:plan?.mode||s.mode,status:'active',startedAt:Date.now(),elapsedMs:0,resumedAt:Date.now(),completedAt:null,items:[],notes:'',station:1,stationSeconds:480,stationRemaining:480,stationRunning:false,stationTickedAt:null};
  for(const item of plan?.items||[])addSessionItem(s,sess,item.exerciseId,item);
  s.sessions.unshift(sess);s.activeSessionId=sess.id;return sess;
};
export const addSessionItem=(s,session,exerciseId,config={})=>{
  const ex=findExercise(s,exerciseId);if(!ex)throw Error('Nie znaleziono ćwiczenia');
  const item={id:uuid(),exerciseId,definitionSnapshot:{name:ex.name,category:ex.category,metric:ex.metric,instructions:ex.instructions},status:'pending',durationSec:Number(config.durationSec)||ex.durationSec,station:Number(config.station)||1,phase:config.phase||ex.phase,rounds:[{id:uuid(),made:0,attempted:0,count:0,errors:0,timeSec:0,coachRating:0}],notes:''};
  session.items.push(item);return item;
};
export const getActive=(s)=>s.sessions.find(x=>x.id===s.activeSessionId && ['active','paused'].includes(x.status))||null;
export const startItem=(session,itemId)=>{
  const item=session.items.find(x=>x.id===itemId);if(!item)return false;
  if(item.status!=='completed')item.status='active';return true;
};
export const toggleComplete=(session,itemId)=>{
  const item=session.items.find(x=>x.id===itemId);if(!item)return false;
  item.status=item.status==='completed'?'active':'completed';return true;
};
export const toggleSkip=(session,itemId)=>{
  const item=session.items.find(x=>x.id===itemId);if(!item)return false;
  item.status=item.status==='skipped'?'pending':'skipped';return true;
};
export const updateMetric=(session,itemId,metric,delta)=>{
  const item=session.items.find(x=>x.id===itemId);if(!item)throw Error('Brak ćwiczenia');
  const round=item.rounds[0];const accepted=['made','attempted','count','errors','timeSec','coachRating'];
  if(!accepted.includes(metric)||!Number.isFinite(delta))throw Error('Błędna metryka');
  const before=Number(round[metric])||0;const next=before+delta;
  if(next<0||(metric==='made'&&next>round.attempted)||(metric==='attempted'&&next<round.made)||(metric==='coachRating'&&next>5))return false;
  round[metric]=next;return true;
};
export const setSessionStatus=(session,status)=>{
  if(!['active','paused','completed'].includes(status))throw Error('Nieznany status');
  if(session.status==='active'&&session.resumedAt)session.elapsedMs+=Date.now()-session.resumedAt;
  session.resumedAt=status==='active'?Date.now():null;session.status=status;
  if(status==='completed'){session.completedAt=Date.now();session.stationRunning=false;session.stationTickedAt=null;}
};
export const elapsedSeconds=(session,now=Date.now())=>Math.max(0,Math.floor((session.elapsedMs + (session.status==='active'&&session.resumedAt?now-session.resumedAt:0))/1000));
export const shootingSummary=(session)=>{
  let made=0,attempted=0;for(const item of session.items){if(item.definitionSnapshot.metric==='shooting'){for(const r of item.rounds){made+=r.made||0;attempted+=r.attempted||0;}}}
  return {made,attempted,percentage:attempted?Math.round(1000*made/attempted)/10:null};
};
export const filterExercises=(s,{query='',category='',level='',solo=false}={})=>allExercises(s).filter(e=>(!category||e.category===category)&&(!level||e.level===Number(level))&&(!solo||e.participantsMin<=1)&&(!query||`${e.name} ${e.shortDescription}`.toLocaleLowerCase('pl').includes(query.toLocaleLowerCase('pl'))));
export const importState=(raw)=>{
  const obj=typeof raw==='string'?JSON.parse(raw):raw;
  if(!obj||obj.schemaVersion!==SCHEMA_VERSION||!Array.isArray(obj.plans)||!Array.isArray(obj.sessions)||!['player','coach'].includes(obj.mode))throw Error('Niepoprawna lub nieobsługiwana kopia zapasowa');
  if(obj.plans.length>10000||obj.sessions.length>10000)throw Error('Zbyt duża kopia');
  for(const p of obj.plans){if(typeof p.id!=='string'||!Array.isArray(p.items))throw Error('Niepoprawny plan');}
  for(const ss of obj.sessions){if(typeof ss.id!=='string'||!Array.isArray(ss.items))throw Error('Niepoprawna sesja');}
  return {...freshState(),...obj,activeSessionId:obj.activeSessionId??null};
};
export const defaultTraining=(s)=>makePlan(s,{name:'Technika — 45 minut',mode:'player',items:DEFAULT_PLAN});
