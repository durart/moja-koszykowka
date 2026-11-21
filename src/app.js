import {CATEGORIES,EXERCISES,DEFAULT_PLAN,getCategory} from './catalog.js';
import {freshState,allExercises,findExercise,makePlan,addPlanItem,createSession,addSessionItem,getActive,startItem,toggleComplete,toggleSkip,updateMetric,setSessionStatus,elapsedSeconds,shootingSummary,filterExercises,importState,defaultTraining} from './state.js';
import {load,save} from './storage.js';

const root=document.getElementById('app');
let state=freshState();let tab='home';let categoryFilter='';let levelFilter='';let searchText='';let exerciseDetail=null;let selectedPlanId=null;let selectedHistoryId=null;let targetPlanId=null;let saveQueue=Promise.resolve();let errorText='';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const timeText=n=>`${Math.floor(Math.max(0,n)/60).toString().padStart(2,'0')}:${Math.floor(Math.max(0,n)%60).toString().padStart(2,'0')}`;
const fmtDate=t=>new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(t));
const durationText=sec=>`${Math.ceil(sec/60)} min`;
const active=()=>getActive(state);
const getPlan=id=>state.plans.find(x=>x.id===id);
const sessionIcon=s=>s.mode==='coach'?'👥':'🏀';
function enqueueSave(){saveQueue=saveQueue.catch(()=>{}).then(()=>save(structuredClone(state))).catch(err=>{errorText='Nie udało się zapisać danych: '+err.message;render();});return saveQueue;}
function changed(){enqueueSave();render();}
function nav(label,id,ico){return `<button class="nav-btn ${tab===id?'selected':''}" data-action="nav" data-id="${id}"><span>${ico}</span><small>${label}</small></button>`;}
function button(text,action,id='',cls='btn',extra=''){return `<button type="button" class="${cls}" data-action="${action}" data-id="${esc(id)}" ${extra}>${text}</button>`;}
function header(label='',sub=''){
  const isCoach=state.mode==='coach';
  return `<header class="top"><div class="brand"><span class="brand-ball">🏀</span><div><div class="eyebrow">MOJA KOSZYKÓWKA</div><h1>${esc(label||'Trenuj z celem')}</h1>${sub?`<p>${esc(sub)}</p>`:''}</div></div><button class="mode" data-action="switch-mode" aria-label="Zmień tryb">${isCoach?'👥 Trener':'⛹️ Zawodnik'} <span>⌄</span></button></header>`;
}
function shell(body){
  root.innerHTML=`<div class="app-shell">${header(tab==='home'?'Gotowy do gry?':{catalog:'Baza ćwiczeń',plans:'Moje plany',active:'Aktywny trening',history:'Historia',settings:'Ustawienia'}[tab])}${errorText?`<div class="alert">${esc(errorText)} ${button('×','dismiss-error','','icon-btn')}</div>`:''}<main>${body}</main><nav class="bottom-nav">${nav('Start','home','⌂')}${nav('Ćwiczenia','catalog','◫')}${nav('Plany','plans','▤')}${nav('Trening','active','⏱')}${nav('Historia','history','▥')}${nav('Więcej','settings','⚙')}</nav></div>`;
}
function home(){const sess=active();const completed=state.sessions.filter(s=>s.status==='completed');const hits=completed.reduce((a,s)=>{const x=shootingSummary(s);return [a[0]+x.made,a[1]+x.attempted]},[0,0]);
  return `<section class="hero"><div class="eyebrow">TWOJE BOISKO. TWÓJ POSTĘP.</div><h2>Każdy trening<br><span>ma znaczenie.</span></h2><p>Ćwicz indywidualnie lub prowadź grupę. Wszystko zapisuje się na tym urządzeniu.</p>${sess?button('▶ Wróć do treningu','nav','active','btn btn-light'):button('▶ Rozpocznij trening','new-quick','','btn btn-light')}</section>
  <div class="stats"><div class="stat"><strong>${completed.length}</strong><span>Treningi</span></div><div class="stat"><strong>${EXERCISES.length}</strong><span>Ćwiczenia</span></div><div class="stat"><strong>${hits[1]?Math.round(hits[0]/hits[1]*100)+'%':'—'}</strong><span>Skuteczność</span></div></div>
  <div class="section-head"><h2>Szybki dostęp</h2></div><div class="two-col"><button class="tile" data-action="nav" data-id="catalog"><span class="tile-icon">🎯</span><b>Baza ćwiczeń</b><small>${EXERCISES.length} ćwiczeń</small></button><button class="tile" data-action="nav" data-id="plans"><span class="tile-icon">📋</span><b>Moje plany</b><small>Buduj trening</small></button></div>
  <div class="section-head"><h2>Trening na start</h2></div><div class="panel">${state.mode==='coach'?`<div class="eyebrow">TRYB TRENERA</div><h3>Trening stacyjny</h3><p>Dodaj ćwiczenia do planu, ustaw stanowiska i poprowadź grupę wspólnym timerem.</p>${button('Utwórz plan grupowy','new-plan','','btn btn-secondary')}`:`<div class="eyebrow">TRENING TECHNICZNY</div><h3>Technika — ok. 45 minut</h3><p>Rozgrzewka, kozłowanie, dwutakt, rzuty i schłodzenie. Wszystkie parametry można zmienić.</p>${button('▶ Uruchom gotowy plan','start-default')}`}</div>
  ${completed.length?`<div class="section-head"><h2>Ostatni trening</h2></div>${historyCard(completed[0])}`:''}`;
}
function exerciseCard(e){return `<article class="exercise-card"><button class="exercise-main" data-action="exercise-detail" data-id="${e.id}"><span class="ex-symbol">${getCategory(e.category)?.emoji||'🏀'}</span><span class="ex-content"><b>${esc(e.name)}</b><small>${esc(getCategory(e.category)?.name||'Własne')} · Poziom ${e.level} · ${durationText(e.durationSec)}</small></span><span class="chevron">›</span></button>${button(targetPlanId?'＋ Do planu':active()?'＋ Do treningu':'＋ Dodaj do planu','add-exercise',e.id,'btn btn-mini')}</article>`;}
function catalog(){const list=filterExercises(state,{query:searchText,category:categoryFilter,level:levelFilter});const selected=exerciseDetail&&findExercise(state,exerciseDetail);
  return `${targetPlanId?`<div class="notice">Wybierz ćwiczenia do planu: <b>${esc(getPlan(targetPlanId)?.name||'')}</b> ${button('Zakończ','stop-picking','','btn btn-mini')}</div>`:''}
    <div class="search"><span>⌕</span><input id="catalog-search" placeholder="Szukaj ćwiczenia..." value="${esc(searchText)}" autocomplete="off" aria-label="Szukaj ćwiczenia"/></div>
    <div class="filter-row"><select id="category-filter" aria-label="Kategoria"><option value="">Wszystkie kategorie</option>${CATEGORIES.map(c=>`<option value="${c.id}" ${categoryFilter===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select><select id="level-filter" aria-label="Poziom"><option value="">Każdy poziom</option>${[1,2,3,4].map(i=>`<option value="${i}" ${levelFilter==i?'selected':''}>Poziom ${i}</option>`).join('')}</select></div>
    <div class="section-head"><h2>Ćwiczenia</h2><span class="count">${list.length}</span></div><div class="exercises">${list.length?list.map(exerciseCard).join(''):'<p class="empty">Brak ćwiczeń spełniających warunki.</p>'}</div>
    ${selected?`<div class="sheet-backdrop" data-action="close-detail"><div class="sheet"><div class="sheet-handle"></div><div class="eyebrow">${esc(getCategory(selected.category)?.name||'Własne')} · POZIOM ${selected.level}</div><h2>${esc(selected.name)}</h2><p>${esc(selected.shortDescription)}</p><div class="detail-chips"><span>⏱ ${durationText(selected.durationSec)}</span><span>👥 od ${selected.participantsMin} os.</span><span>🎒 ${esc(selected.equipment.join(', '))}</span></div><h3>Jak wykonać?</h3><ol>${selected.instructions.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p class="muted">${esc(selected.notes||'')}</p>${button('＋ Dodaj ćwiczenie','add-exercise',selected.id)} ${button('Zamknij','close-detail','','btn btn-secondary')}</div></div>`:''}`;
}
function planCard(p){const total=p.items.reduce((a,i)=>a+i.durationSec,0);return `<article class="panel plan-card"><div class="eyebrow">${p.mode==='coach'?'TRENER · STACJE':'ZAWODNIK · PLAN'}</div><h3>${esc(p.name)}</h3><p>${p.items.length} ćwiczeń · ${durationText(total)}</p><div class="actions">${button('Otwórz','open-plan',p.id,'btn btn-secondary')}${button('▶ Start','start-plan',p.id)}${button('Usuń','delete-plan',p.id,'btn btn-quiet')}</div></article>`;}
function plans(){const plan=selectedPlanId&&getPlan(selectedPlanId);if(!plan)return `<div class="intro"><p>Twórz własne jednostki treningowe i uruchamiaj je wielokrotnie.</p>${button('＋ Nowy plan','new-plan')}</div>${state.plans.length?state.plans.map(planCard).join(''):'<div class="empty">Nie masz jeszcze własnych planów.</div>'}`;
  return `<div class="backline">${button('‹ Wszystkie plany','close-plan','','btn btn-quiet')}</div><div class="panel"><div class="eyebrow">${plan.mode==='coach'?'PLAN TRENERA':'PLAN ZAWODNIKA'}</div><h2>${esc(plan.name)}</h2><p>${plan.items.length} ćwiczeń · ${durationText(plan.items.reduce((a,i)=>a+i.durationSec,0))}</p><div class="actions">${button('＋ Dodaj ćwiczenie','pick-plan',plan.id)}${button('▶ Rozpocznij','start-plan',plan.id,'btn btn-secondary')}</div></div><div class="section-head"><h2>Kolejność ćwiczeń</h2></div>
  ${plan.items.map((item,i)=>{const ex=findExercise(state,item.exerciseId);return `<div class="plan-row"><span class="ordinal">${i+1}</span><div class="grow"><b>${esc(ex?.name||'Ćwiczenie niedostępne')}</b><small>${durationText(item.durationSec)} ${plan.mode==='coach'?`· Stacja ${item.station}`:''}</small></div><div class="micro">${button('−','plan-remove',item.id,'mini-icon','aria-label="Usuń ćwiczenie"')}${button('↑','plan-up',item.id,'mini-icon','aria-label="W górę"')}${button('↓','plan-down',item.id,'mini-icon','aria-label="W dół"')}${button('⏱','plan-duration',item.id,'mini-icon','aria-label="Czas"')}${plan.mode==='coach'?button('◉','plan-station',item.id,'mini-icon','aria-label="Zmień stację"'):''}</div></div>`}).join('')||'<p class="empty">Dodaj pierwsze ćwiczenie z katalogu.</p>'}`;
}
function metricControl(item){const r=item.rounds[0];const type=item.definitionSnapshot.metric;const ctr=(label,field,value)=>`<div class="metric-cell"><span>${label}</span><div class="counter">${button('−','metric',`${item.id}:${field}:-1`,'counter-btn',`aria-label="Zmniejsz ${label}"`)}<strong>${value}</strong>${button('+','metric',`${item.id}:${field}:1`,'counter-btn',`aria-label="Zwiększ ${label}"`)}</div></div>`;
  if(type==='shooting')return `<div class="metric-row">${ctr('Trafione','made',r.made)}${ctr('Oddane','attempted',r.attempted)}</div><div class="metric-note">Skuteczność: <b>${r.attempted?(100*r.made/r.attempted).toFixed(1)+'%':'brak danych'}</b></div><p class="hint">Najpierw zwiększ liczbę prób, a następnie trafień.</p>`;
  if(type==='repetitions')return `<div class="metric-row">${ctr('Powtórzenia','count',r.count)}</div>`;
  if(type==='errors')return `<div class="metric-row">${ctr('Straty / błędy','errors',r.errors)}</div>`;
  if(type==='points')return `<div class="metric-row">${ctr('Punkty','count',r.count)}</div>`;
  if(type==='coach_rating')return `<div class="metric-row">${ctr('Ocena (0–5)','coachRating',r.coachRating)}</div>`;
  if(type==='time')return `<div class="metric-row">${ctr('Sekundy','timeSec',r.timeSec)}</div>`;
  return '<p class="hint">To ćwiczenie wymaga tylko oznaczenia wykonania.</p>';
}
function activeView(){const sess=active();if(!sess)return `<div class="empty big"><div class="empty-emoji">🏀</div><h2>Nie masz aktywnego treningu</h2><p>Uruchom gotowy trening lub wybierz swój plan.</p>${button('▶ Szybki trening','new-quick')}${button('Wybierz plan','nav','plans','btn btn-secondary')}</div>`;
  const done=sess.items.filter(i=>i.status==='completed').length;const total=sess.items.length;const activeItem=sess.items.find(i=>i.status==='active')||sess.items.find(i=>i.status==='pending');const summary=shootingSummary(sess);
  return `<div class="session-hero"><div class="eyebrow">${sess.mode==='coach'?'TRENING GRUPOWY':'TRENING INDYWIDUALNY'} · ${sess.status==='paused'?'WSTRZYMANY':'W TOKU'}</div><h2>${esc(sess.title)}</h2><div class="hero-stats"><div><span>Czas</span><strong id="elapsed">${timeText(elapsedSeconds(sess))}</strong></div><div><span>Wykonane</span><strong>${done}/${total}</strong></div><div><span>Rzuty</span><strong>${summary.attempted?summary.made+'/'+summary.attempted:'—'}</strong></div></div><div class="progress"><div style="width:${total?Math.round(done/total*100):0}%"></div></div><div class="actions">${sess.status==='paused'?button('▶ Wznów','resume-session','','btn btn-light'):button('Ⅱ Pauza','pause-session','','btn btn-secondary')}${button('Zakończ','finish-session','','btn btn-quiet')}</div></div>
  ${sess.mode==='coach'?`<div class="panel"><div class="eyebrow">STACJE TRENINGOWE</div><h3>Stacja ${sess.station}</h3><div class="big-timer" id="station-timer">${timeText(sess.stationRemaining)}</div><div class="actions">${button(sess.stationRunning?'Ⅱ Pauza timera':'▶ Start timera',sess.stationRunning?'station-pause':'station-start','','btn btn-secondary')}${button('↻ Reset','station-reset','','btn btn-secondary')}${button('→ Następna stacja','station-next')}</div><p class="hint">Timer stacji nie biegnie po ponownym otwarciu aplikacji. Długość rundy można ustawić w ustawieniach planu.</p></div>`:''}
  <div class="section-head"><h2>Ćwiczenia</h2>${button('＋ Dodaj','pick-active','','btn btn-mini')}</div>
  ${sess.items.length?sess.items.map((item,i)=>{const st=item.status;return `<article class="session-item ${st==='completed'?'is-complete':''}"><div class="session-row"><span class="ordinal">${i+1}</span><button class="item-title" data-action="start-item" data-id="${item.id}"><b>${esc(item.definitionSnapshot.name)}</b><small>${durationText(item.durationSec)} · ${st==='completed'?'Wykonano ✅':st==='skipped'?'Pominięto':st==='active'?'W trakcie':'Oczekuje'} ${sess.mode==='coach'?`· Stacja ${item.station}`:''}</small></button>${button(st==='completed'?'↩ Cofnij':'✓ Wykonano','toggle-item',item.id,st==='completed'?'btn btn-mini undo':'btn btn-mini')}</div>${st==='active'?`<div class="session-body"><p>${esc(item.definitionSnapshot.instructions?.[0]||'')}</p>${metricControl(item)}${button('Pomiń','skip-item',item.id,'btn btn-quiet')}</div>`:''}${st==='skipped'?`<div class="actions">${button('Przywróć','skip-item',item.id,'btn btn-mini')}</div>`:''}</article>`}).join(''):'<p class="empty">Dodaj ćwiczenia do treningu z katalogu.</p>'}
  <div class="footer-actions">${button('＋ Dodaj ćwiczenie spoza planu','pick-active','','btn btn-secondary')}${button('Zakończ trening','finish-session','','btn btn-quiet')}</div>`;
}
function historyCard(s){const done=s.items.filter(i=>i.status==='completed').length;const sum=shootingSummary(s);return `<article class="history-row"><button class="history-main" data-action="history-detail" data-id="${s.id}"><span class="ex-symbol">${sessionIcon(s)}</span><span class="grow"><b>${esc(s.title)}</b><small>${fmtDate(s.startedAt)} · ${timeText(elapsedSeconds(s))} · ${done}/${s.items.length} wykonane ${sum.attempted?`· ${sum.percentage}% rzutów`:''}</small></span><span>›</span></button></article>`;}
function history(){const completed=state.sessions.filter(x=>x.status==='completed');const sess=selectedHistoryId&&completed.find(x=>x.id===selectedHistoryId);if(sess){const summary=shootingSummary(sess);return `${button('‹ Powrót','history-close','','btn btn-quiet')}<div class="panel"><div class="eyebrow">${fmtDate(sess.startedAt)}</div><h2>${esc(sess.title)}</h2><div class="stats"><div class="stat"><strong>${timeText(elapsedSeconds(sess))}</strong><span>Czas</span></div><div class="stat"><strong>${sess.items.filter(x=>x.status==='completed').length}</strong><span>Wykonane</span></div><div class="stat"><strong>${summary.percentage===null?'—':summary.percentage+'%'}</strong><span>Rzuty</span></div></div></div><div class="section-head"><h2>Ćwiczenia</h2></div>${sess.items.map(x=>`<div class="plan-row"><span class="ordinal">${x.status==='completed'?'✓':'–'}</span><div class="grow"><b>${esc(x.definitionSnapshot.name)}</b><small>${esc(x.status)} ${x.definitionSnapshot.metric==='shooting'?`· ${x.rounds[0].made}/${x.rounds[0].attempted}`:''}</small></div></div>`).join('')}`;}
  return `<div class="intro"><p>Wszystkie zakończone treningi pozostają na tym urządzeniu. Podgląd wyników nie zmienia historii.</p></div>${completed.length?completed.map(historyCard).join(''):'<div class="empty">Historia jest pusta. Zakończ pierwszy trening.</div>'}`;
}
function settings(){return `<div class="panel"><div class="eyebrow">TRYB APLIKACJI</div><h3>${state.mode==='coach'?'👥 Trener':'⛹️ Zawodnik'}</h3><p>Możesz zmieniać tryb w dowolnej chwili. Historia pozostaje wspólna.</p>${button('Zmień tryb','switch-mode','','btn btn-secondary')}</div>
  <div class="panel"><div class="eyebrow">BEZPIECZEŃSTWO DANYCH</div><h3>Backup i przywracanie</h3><p>Treningi zapisują się w pamięci tej przeglądarki. Eksportuj kopię JSON, zwłaszcza przed zmianą telefonu.</p><div class="actions">${button('↓ Eksportuj dane','export-data')}${button('↑ Importuj JSON','import-data','','btn btn-secondary')}</div><input id="import-file" type="file" accept="application/json,.json" hidden></div>
  <div class="panel"><div class="eyebrow">PAMIĘĆ</div><h3>Przywróć ustawienia fabryczne</h3><p>Usuwa plany i historię na tym urządzeniu. Przed usunięciem wykonaj eksport.</p>${button('Usuń wszystkie lokalne dane','reset-data','','btn btn-danger')}</div><p class="hint">MVP 0.1 — aplikacja offline, bez kont, bez chmury i bez automatycznego udostępniania wyników.</p>`;}
function render(){shell(({home,catalog,plans,active:activeView,history,settings})[tab]());}
function send(action,id){errorText='';const sess=active();let plan;
  switch(action){
  case 'nav':tab=id;exerciseDetail=null;targetPlanId=null;break;
  case 'dismiss-error':errorText='';break;
  case 'switch-mode':state.mode=state.mode==='coach'?'player':'coach';changed();return;
  case 'start-default':if(sess){tab='active';break;}createSession(state,defaultTraining(state));tab='active';changed();return;
  case 'new-quick':if(sess){tab='active';break;}createSession(state);tab='active';changed();return;
  case 'new-plan':{
    const name=prompt('Nazwa nowego planu:',state.mode==='coach'?'Trening grupowy':'Mój trening');if(name===null)return;
    plan=makePlan(state,{name,mode:state.mode});state.plans.unshift(plan);selectedPlanId=plan.id;tab='plans';changed();return;
  }
  case 'open-plan':selectedPlanId=id;tab='plans';break;
  case 'close-plan':selectedPlanId=null;break;
  case 'delete-plan':if(!confirm('Usunąć wybrany plan? Historia treningów zostanie zachowana.'))return;state.plans=state.plans.filter(p=>p.id!==id);selectedPlanId=null;changed();return;
  case 'pick-plan':targetPlanId=id;tab='catalog';categoryFilter='';searchText='';break;
  case 'stop-picking':selectedPlanId=targetPlanId;targetPlanId=null;tab='plans';break;
  case 'pick-active':if(!sess)return;targetPlanId=null;tab='catalog';searchText='';break;
  case 'add-exercise':{
    if(targetPlanId){plan=getPlan(targetPlanId);if(!plan)return;addPlanItem(state,plan,id);selectedPlanId=plan.id;targetPlanId=null;exerciseDetail=null;tab='plans';changed();return;}
    if(sess){addSessionItem(state,sess,id);exerciseDetail=null;tab='active';changed();return;}
    plan=state.plans[0];if(!plan){plan=makePlan(state,{name:'Mój plan',mode:state.mode});state.plans.unshift(plan);}
    addPlanItem(state,plan,id);selectedPlanId=plan.id;exerciseDetail=null;tab='plans';changed();return;
  }
  case 'exercise-detail':exerciseDetail=id;break;
  case 'close-detail':exerciseDetail=null;break;
  case 'plan-remove':plan=getPlan(selectedPlanId);plan.items=plan.items.filter(x=>x.id!==id);changed();return;
  case 'plan-up':case 'plan-down':{
    plan=getPlan(selectedPlanId);const i=plan.items.findIndex(x=>x.id===id);const j=i+(action==='plan-up'?-1:1);if(i>=0&&j>=0&&j<plan.items.length)[plan.items[i],plan.items[j]]=[plan.items[j],plan.items[i]];changed();return;
  }
  case 'plan-duration':{
    plan=getPlan(selectedPlanId);const item=plan.items.find(x=>x.id===id);const value=prompt('Czas ćwiczenia w minutach:',String(Math.ceil(item.durationSec/60)));if(value===null)return;const minutes=Number(value.replace(',','.'));if(!Number.isFinite(minutes)||minutes<=0||minutes>240){alert('Podaj czas od 0,1 do 240 minut.');return;}item.durationSec=Math.round(minutes*60);changed();return;
  }
  case 'plan-station':plan=getPlan(selectedPlanId);plan.items.find(x=>x.id===id).station=plan.items.find(x=>x.id===id).station%6+1;changed();return;
  case 'start-plan':if(sess){if(!confirm('Masz już aktywny trening. Otworzyć go zamiast rozpoczynać nowy?'))return;tab='active';break;}plan=getPlan(id);if(!plan)return;createSession(state,plan);tab='active';changed();return;
  case 'start-item':if(!sess)return;startItem(sess,id);changed();return;
  case 'toggle-item':if(!sess)return;toggleComplete(sess,id);changed();return;
  case 'skip-item':if(!sess)return;toggleSkip(sess,id);changed();return;
  case 'metric':{
    if(!sess)return;const [itemId,field,change]=id.split(':');updateMetric(sess,itemId,field,Number(change));changed();return;
  }
  case 'pause-session':if(sess){setSessionStatus(sess,'paused');sess.stationRunning=false;changed();}return;
  case 'resume-session':if(sess){setSessionStatus(sess,'active');changed();}return;
  case 'finish-session':if(!sess||!confirm('Zakończyć trening? Niewykonane ćwiczenia pozostaną oznaczone jako oczekujące.'))return;setSessionStatus(sess,'completed');state.activeSessionId=null;selectedHistoryId=sess.id;tab='history';changed();return;
  case 'station-start':if(sess&&sess.mode==='coach'&&sess.status==='active'){sess.stationRunning=true;sess.stationTickedAt=Date.now();changed();}return;
  case 'station-pause':if(sess){stationTick(sess);sess.stationRunning=false;sess.stationTickedAt=null;changed();}return;
  case 'station-reset':if(sess){sess.stationRemaining=sess.stationSeconds;sess.stationRunning=false;sess.stationTickedAt=null;changed();}return;
  case 'station-next':if(sess){sess.station=sess.station%6+1;sess.stationRemaining=sess.stationSeconds;sess.stationRunning=false;sess.stationTickedAt=null;changed();}return;
  case 'history-detail':selectedHistoryId=id;break;
  case 'history-close':selectedHistoryId=null;break;
  case 'export-data':{
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download='moja-koszykowka-kopia-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);return;
  }
  case 'import-data':document.getElementById('import-file')?.click();return;
  case 'reset-data':if(!confirm('Czy na pewno usunąć WSZYSTKIE plany i wyniki? Tego nie można cofnąć bez kopii zapasowej.'))return;state=freshState();tab='home';changed();return;
  }render();
}
function stationTick(sess){if(!sess?.stationRunning||sess.status!=='active')return;const now=Date.now();const delta=Math.floor((now-(sess.stationTickedAt||now))/1000);if(delta>0){sess.stationRemaining=Math.max(0,sess.stationRemaining-delta);sess.stationTickedAt+=delta*1000;if(sess.stationRemaining===0){sess.stationRunning=false;sess.stationTickedAt=null;enqueueSave();}}}
root.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;if(el.classList.contains('sheet-backdrop')&&e.target!==el)return;send(el.dataset.action,el.dataset.id||'');});
root.addEventListener('input',e=>{if(e.target.id==='catalog-search'){const value=e.target.value;const pos=e.target.selectionStart;searchText=value;render();const input=document.getElementById('catalog-search');input?.focus();try{input?.setSelectionRange(pos,pos);}catch{}}});
root.addEventListener('change',async e=>{
  if(e.target.id==='category-filter'){categoryFilter=e.target.value;render();}
  if(e.target.id==='level-filter'){levelFilter=e.target.value;render();}
  if(e.target.id==='import-file'){
    const file=e.target.files?.[0];if(!file)return;
    try{const contents=await file.text();const candidate=importState(contents);if(!confirm(`Zastąpić bieżące dane zawartością pliku ${file.name}? Przed importem warto pobrać kopię.`))return;state=candidate;tab='home';await enqueueSave();render();}catch(err){errorText='Nie udało się wczytać kopii: '+err.message;render();}
  }
});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='hidden')return;const sess=active();if(!sess)return;stationTick(sess);sess.stationRunning=false;sess.stationTickedAt=null;if(sess.status==='active')setSessionStatus(sess,'paused');enqueueSave();});
setInterval(()=>{const sess=active();if(!sess)return;const clock=document.getElementById('elapsed');if(clock)clock.textContent=timeText(elapsedSeconds(sess));if(sess.stationRunning&&sess.status==='active'){stationTick(sess);const st=document.getElementById('station-timer');if(st)st.textContent=timeText(sess.stationRemaining);}},1000);
(async()=>{try{const restored=await load();if(restored){state=importState(restored);const sess=getActive(state);if(sess){if(sess.status==='active'){sess.status='paused';sess.resumedAt=null;}sess.stationRunning=false;sess.stationTickedAt=null;enqueueSave();}}}catch(err){errorText='Nie udało się odczytać pamięci aplikacji. Dane mogą się nie zapisywać: '+err.message;}render();if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});})();
