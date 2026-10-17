/* Each question owns its answer area. Existing upload, pen and send paths are reused. */
(() => {
  'use strict';
  let panel,entry,filter='all',search='',questions=[],replies=[],busy=false,loaded=false,error='',visible=false,openedOnce=false;
  const opened=new Set(),composers=new Map(),C=window.QuestionInboxCore;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function cards(){const d=window.ME_DATA?.[SID]||{};return [...(d.오답||[]).map((o,i)=>({...o,id:'t'+i})),...(d.복습대기||[]).map((o,i)=>({...o,id:'w'+i}))].map(o=>({key:ckey(o.id,o.유형),id:'card_'+o.id,title:o.유형,replies:o.답변||[]})).concat({key:'free',id:'card_free',title:'자유질문 · 숙제 질문',replies:d.자유답변||[]});}
  const data=()=>C.problems(cards(),questions,replies);
  const fresh=r=>!TEACHER&&isFresh(r.at)&&!seenGet().includes(replySig(r.text,r.at));
  const status=g=>g.replies.length?(g.replies.some(fresh)?'새 답변':'답변 있음'):g.uncertain?'연결 확인 필요':'답변 대기';
  function mount(){
    if(panel||typeof SID==='undefined'||!SID||!window.ME_DATA?.[SID]||!C)return !!panel;
    const app=document.getElementById('app');if(!app)return false;
    panel=document.createElement('section');panel.id='question-inbox';panel.hidden=true;panel.setAttribute('aria-label','문제별 질문과 답변');app.before(panel);
    entry=document.createElement('button');entry.className='qi-entry';entry.textContent='✉ 문제별 질문 · 답변 확인';entry.onclick=()=>{const nav=document.querySelector('#student-home-nav [data-tab="questions"]');if(nav)nav.click();else setVisible(true);};app.before(entry);
    new MutationObserver(()=>{entry.hidden=app.hidden||visible;}).observe(app,{attributes:true,attributeFilter:['hidden']});
    panel.addEventListener('click',onClick);
    panel.addEventListener('input',e=>{if(e.target.id==='qi-search'){search=e.target.value;drawBody();}});
    panel.addEventListener('toggle',e=>{const el=e.target;if(el.matches('details[data-question]')){if(el.open)opened.add(el.dataset.question);else opened.delete(el.dataset.question);}},true);
    return true;
  }
  function setVisible(on){
    if(!mount())return false;const wasVisible=visible;visible=on;panel.hidden=!on;document.body.classList.toggle('question-inbox-open',on);entry.hidden=on||document.getElementById('app').hidden;
    if(on){document.getElementById('app').hidden=true;draw();if((!loaded||!wasVisible)&&!busy)refresh();}return true;
  }
  function draw(){
    panel.innerHTML=`<header class="qi-heading"><div><span class="qi-eyebrow">선생님과 함께, 한 문제씩</span><h1>문제별 질문과 답변</h1><p>각 문제에 답변이 왔는지 확인하고, 바로 아래에서 읽어 보세요.</p></div><button data-qi="ask" class="qi-primary">＋ 새 질문 하기</button></header><div class="qi-controls"><label class="qi-search" for="qi-search"><span aria-hidden="true">⌕</span><input id="qi-search" type="search" placeholder="질문 내용 · 유형 · 답변 찾기" value="${esc(search)}"></label><button data-qi="refresh" ${busy?'disabled':''}>${busy?'불러오는 중…':'↻ 새로고침'}</button><button data-qi="back">오답노트로</button></div><div id="qi-body"></div>`;drawBody();
  }
  function drawBody(){
    const {items,unlinked}=data(),query=search.trim().toLocaleLowerCase();
    const counts={all:items.length,new:items.filter(g=>g.replies.some(fresh)).length,answered:items.filter(g=>g.replies.length).length,waiting:items.filter(g=>g.waiting).length,uncertain:items.filter(g=>g.uncertain).length};
    const shown=items.filter(g=>(filter==='all'||filter==='new'&&g.replies.some(fresh)||filter==='answered'&&g.replies.length||filter==='waiting'&&g.waiting||filter==='uncertain'&&g.uncertain)&&(!query||[g.title,...g.questions.map(q=>q.text),...g.replies.map(r=>C.answerText(r.text))].join(' ').toLocaleLowerCase().includes(query)));
    if(!openedOnce&&items.length){opened.add((items.find(g=>g.replies.some(fresh))||items[0]).id);openedOnce=true;}
    const filters=[['all','전체 문제'],['new','새 답변'],['answered','답변 있음'],['waiting','답변 대기'],...(counts.uncertain?[['uncertain','연결 확인']]:[])];
    panel.querySelector('#qi-body').innerHTML=`<div class="qi-filters" aria-label="문제 필터">${filters.map(([id,label])=>`<button data-qi="filter" data-filter="${id}" aria-pressed="${filter===id}">${label} <b>${counts[id]}</b></button>`).join('')}</div><p class="qi-load" role="status">${error?esc(error):busy?'최근 질문과 답변을 확인하고 있어요.':IS_DEMO?'미리보기 · 실제 질문을 보내지 않아요.':'질문 하나에 카드 하나. 답변도 해당 문제 아래에 표시돼요.'}</p><div class="qi-problem-list">${shown.map((g,i)=>problem(g,i)).join('')||`<div class="qi-empty"><span>✉</span><h2>${busy?'질문을 가져오고 있어요':query||filter!=='all'?'조건에 맞는 문제가 없어요':error?'질문 기록을 확인하지 못했어요':'아직 질문 기록이 없어요'}</h2><p>${query||filter!=='all'?'검색어나 필터를 바꿔 보세요.':error?'새로고침으로 다시 확인할 수 있어요.':'궁금한 문제를 편하게 물어보세요.'}</p></div>`}</div>${unlinked.length?`<section class="qi-unlinked"><h2>문제 연결을 확인할 이전 답변 <span>${unlinked.reduce((n,g)=>n+g.replies.length,0)}</span></h2><p>예전에는 여러 질문의 답변이 함께 저장됐어요. 어느 문제의 답인지 확실하지 않은 기록은 여기에 보관했어요.</p>${unlinked.map(g=>`<details class="qi-old-answer"><summary>${esc(g.title)} · 이전 답변 ${g.replies.length}개</summary>${answerList(g)}</details>`).join('')}</section>`:''}`;
    composers.forEach((host,id)=>{const slot=panel.querySelector(`[data-composer="${id}"]`);if(slot)slot.append(host);});
    if(window.renderMathInElement)renderMathInElement(panel.querySelector('#qi-body'),{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});
  }
  function problem(g,i){
    const q=g.question,has=g.replies.length>0,tone=has?'qi-answered':g.uncertain?'qi-check':'qi-wait';
    return `<details class="qi-problem card ${has?'has-answer':''}" data-question="${g.id}" ${opened.has(g.id)?'open':''}><summary><span class="qi-number">질문 ${String(i+1).padStart(2,'0')}</span><span class="qi-problem-title"><strong>${esc(q.text.replace(/^「[^」]*」\s*[—-]?\s*/,'')||g.title)}</strong><span>${esc(g.title)} · ${esc(fmtAt(q.at))}</span></span><span class="qi-problem-state"><span class="qi-status ${tone}">${status(g)}</span><b>${has?`답변 ${g.replies.length}개 보기`:g.uncertain?'이전 답변 확인':'질문 내용 보기'} <span class="qi-chevron" aria-hidden="true">⌄</span></b></span></summary><div class="qi-problem-body"><div class="qi-question"><div class="qi-question-label">내가 질문한 문제</div><div class="qi-message">${esc(q.text)}</div>${window.QuestionPhoto?.html(q)||''}${g.card?`<button data-qi="original" data-id="${g.id}" class="qi-context">${g.card.key==='free'?'이어서 질문하기':'관련 오답 카드 보기'} ↗</button>`:''}</div><section class="qi-inline-answers" aria-label="이 문제의 답변"><h3>이 문제에 대한 선생님 답변 <span>${g.replies.length}</span></h3>${has?answerList(g):g.uncertain?'<div class="qi-uncertain"><b>이전 답변의 문제 연결을 확인하고 있어요</b><p>아래 ‘문제 연결을 확인할 이전 답변’에서 기존 답변을 볼 수 있어요.</p></div>':'<div class="qi-waiting"><b>아직 이 문제의 답변이 없어요</b><p>선생님이 답하면 이 자리에 표시돼요.</p></div>'}</section>${TEACHER?`<button class="qi-primary" data-qi="reply-question" data-id="${g.id}">✎ 이 문제에 답하기</button><div data-composer="${g.id}"></div>`:''}</div></details>`;
  }
  function answerList(g){return [...g.replies].reverse().map(r=>`<div class="reply qi-reply" data-sig="${replySig(r.text,r.at)}"><div class="rh"><b>선생님 답변</b>${fresh(r)?'<span class="qi-status qi-new">NEW</span>':''}<time>${esc(fmtAt(r.at))}</time></div>${replyBody(r.text)}${!TEACHER?`<button class="qi-read" data-qi="read" data-sig="${replySig(r.text,r.at)}">${fresh(r)?'이 답변 읽음으로 표시':'✓ 확인한 답변'}</button>`:''}</div>`).join('');}
  async function refresh(){
    if(busy)return;if(IS_DEMO||!QPHOTO||SID.length<12){loaded=true;draw();return;}
    busy=true;error='';draw();
    const result=await Promise.allSettled(['questions','replies'].map(async mode=>{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);try{const r=await fetch(QPHOTO+'?t='+encodeURIComponent(SID)+'&mode='+mode+'&_='+Date.now(),{signal:controller.signal});if(!r.ok)throw new Error('HTTP');const j=await r.json();if(!Array.isArray(j[mode]))throw new Error('shape');return j[mode];}finally{clearTimeout(timer);}}));
    if(result[0].status==='fulfilled')questions=result[0].value;if(result[1].status==='fulfilled')replies=result[1].value;
    error=result.some(r=>r.status==='rejected')?'최근 기록 일부를 불러오지 못했어요. 보관된 답변을 먼저 보여드려요. 새로고침해 주세요.':'';
    busy=false;loaded=!error;if(visible)draw();
  }
  function original(id,ask=false){
    setVisible(false);const nav=document.querySelector('#student-home-nav [data-tab="notebook"]');if(nav)nav.click();
    document.getElementById('app').hidden=false;entry.hidden=false;const el=document.getElementById(id);if(!el)return;
    if(TEACHER&&!el.querySelector('.tbox')){const c=cards().find(c=>c.id===id);if(c)teacherTools(el,c.key.split('.')[0],c.key.split('.')[1]||'');}
    if(ask&&!TEACHER&&!IS_DEMO)askOpen(id.replace(/^card_/,''));el.scrollIntoView({block:'start',behavior:'smooth'});if(typeof markNew==='function')markNew();
  }
  function compose(id){
    if(!TEACHER)return;const g=data().items.find(g=>g.id===id);if(!g)return;
    const slot=panel.querySelector(`[data-composer="${id}"]`);if(!slot)return;
    let host=composers.get(id);
    if(!host){const key=/^(?:free|[tw]\d+\.[a-f0-9]{4})$/.test(g.replyKey)?g.replyKey:'free';host=document.createElement('div');host.className='qi-composer card';host.id='qi-compose-'+id;host.innerHTML=`<span class="badge">${esc(g.title)}</span>`;slot.append(host);composers.set(id,host);teacherTools(host,key,'',{...g.question,text:g.question.rawText,card:key,type:g.title});}
    else slot.append(host);
    host.querySelector('textarea')?.focus();
  }
  function bindReply(cid,id){
    if(!TEACHER||!/^q-[a-f0-9]{16}$/.test(id))return;
    const host=document.getElementById(cid),q=host?.querySelector(`[data-qi-question="${id}"]`);if(!q)return;
    host.dataset.questionId=id;
    host.querySelectorAll('[data-qi-question]').forEach(el=>el.classList.toggle('qi-selected-question',el===q));
    let label=host.querySelector('.qi-reply-target');
    const ta=document.getElementById('tr_'+cid);if(!label&&ta){label=document.createElement('p');label.className='qi-reply-target';ta.before(label);}
    if(label)label.textContent='선택한 질문에 답변합니다: '+q.querySelector('.qi-question-copy').textContent.trim();
    if(ta){ta.maxLength=1900;ta.focus();}
  }
  function onClick(e){
    const b=e.target.closest('[data-qi]');if(!b||b.disabled)return;const action=b.dataset.qi;
    if(action==='filter'){filter=b.dataset.filter;drawBody();panel.querySelector(`[data-filter="${filter}"]`)?.focus();}
    else if(action==='refresh')refresh();
    else if(action==='ask')original('card_free',true);
    else if(action==='back'){setVisible(false);const nav=document.querySelector('#student-home-nav [data-tab="notebook"]');if(nav)nav.click();else{document.getElementById('app').hidden=false;entry.hidden=false;}}
    else if(action==='original'){const g=data().items.find(g=>g.id===b.dataset.id);if(g?.card)original(g.card.id,g.card.key==='free');}
    else if(action==='reply-question')compose(b.dataset.id);
    else if(action==='read'&&!TEACHER&&!IS_DEMO){const y=scrollY;seenAdd(b.dataset.sig);drawBody();window.scrollTo({top:y,behavior:'instant'});}
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-qi-bind]');if(b)bindReply(b.dataset.cid,b.dataset.qiBind);});
  window.QuestionInbox={setVisible,refresh,original,bindReply};document.addEventListener('DOMContentLoaded',mount);
})();
