/* Presentation adapter. Questions, replies, uploads and sending retain their existing owners. */
(() => {
  'use strict';
  let panel,entry,selected='',filter='all',search='',questions=[],replies=[],busy=false,loaded=false,error='',visible=false;
  const C=window.QuestionInboxCore;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function cards(){
    const d=window.ME_DATA?.[SID]||{};
    return [...(d.오답||[]).map((o,i)=>({...o,id:'t'+i})),...(d.복습대기||[]).map((o,i)=>({...o,id:'w'+i}))].map(o=>({key:ckey(o.id,o.유형),id:'card_'+o.id,title:o.유형,replies:o.답변||[]})).concat({key:'free',id:'card_free',title:'자유질문 · 숙제 질문',replies:d.자유답변||[]});
  }
  const groups=()=>C.build(cards(),questions,replies);
  const fresh=r=>!TEACHER&&isFresh(r.at)&&!seenGet().includes(replySig(r.text,r.at));
  const status=g=>g.replies.some(fresh)?'새 답변':g.waiting?'답변 기다리는 중':g.replies.length?'답변 도착':'질문 기록';
  function mount(){
    if(panel||typeof SID==='undefined'||!SID||!window.ME_DATA?.[SID]||!C)return !!panel;
    const app=document.getElementById('app');if(!app)return false;
    panel=document.createElement('section');panel.id='question-inbox';panel.hidden=true;panel.setAttribute('aria-label','나의 질문과 답변');app.before(panel);
    entry=document.createElement('button');entry.className='qi-entry';entry.textContent='✉ 내 질문 · 선생님 답변 모아보기';entry.onclick=()=>{
      const nav=document.querySelector('#student-home-nav [data-tab="questions"]');if(nav)nav.click();else setVisible(true);
    };app.before(entry);
    new MutationObserver(()=>{entry.hidden=app.hidden||visible;}).observe(app,{attributes:true,attributeFilter:['hidden']});
    panel.addEventListener('click',onClick);
    panel.addEventListener('input',e=>{if(e.target.id==='qi-search'){search=e.target.value;drawBody();}});
    return true;
  }
  function setVisible(on){
    if(!mount())return false;visible=on;panel.hidden=!on;document.body.classList.toggle('question-inbox-open',on);entry.hidden=on||document.getElementById('app').hidden;
    if(on){document.getElementById('app').hidden=true;draw();if(!loaded&&!busy)refresh();}
    return true;
  }
  function draw(){
    panel.innerHTML=`<header class="qi-heading"><div><span class="qi-eyebrow">선생님과 함께, 한 문제씩</span><h1>나의 질문과 답변</h1><p>궁금했던 것부터 선생님 풀이까지, 여기서 이어 봐요.</p></div><button data-qi="ask" class="qi-primary">＋ 새 질문 하기</button></header><div class="qi-controls"><label class="qi-search" for="qi-search"><span aria-hidden="true">⌕</span><input id="qi-search" type="search" placeholder="질문 내용 · 유형 · 답변 찾기" value="${esc(search)}"></label><button data-qi="refresh" ${busy?'disabled':''}>${busy?'불러오는 중…':'↻ 새로고침'}</button><button data-qi="back">오답노트로</button></div><div id="qi-body"></div>`;
    drawBody();
  }
  function drawBody(){
    const all=groups(),query=search.trim().toLocaleLowerCase();
    const counts={all:all.length,new:all.filter(g=>g.replies.some(fresh)).length,answered:all.filter(g=>g.replies.length).length,waiting:all.filter(g=>g.waiting).length};
    const shown=all.filter(g=>(filter==='all'||filter==='new'&&g.replies.some(fresh)||filter==='answered'&&g.replies.length||filter==='waiting'&&g.waiting)&&(!query||[g.title,...g.questions.map(q=>q.text),...g.replies.map(r=>r.text)].join(' ').toLocaleLowerCase().includes(query)));
    if(!shown.some(g=>g.id===selected))selected=shown[0]?.id||'';
    const current=shown.find(g=>g.id===selected);
    panel.querySelector('#qi-body').innerHTML=`<div class="qi-filters" aria-label="대화 필터">${[['all','전체'],['new','새 답변'],['answered','답변 있음'],['waiting','답변 대기']].map(([id,label])=>`<button data-qi="filter" data-filter="${id}" aria-pressed="${filter===id}">${label} <b>${counts[id]}</b></button>`).join('')}</div><p class="qi-load" role="status">${error?esc(error):busy?'최근 질문과 답변을 확인하고 있어요.':IS_DEMO?'미리보기 · 실제 질문을 보내지 않아요.':'질문은 유형별로, 자유질문은 한 대화로 모아 보여요.'}</p><div class="qi-layout"><aside class="qi-list" aria-label="질문 목록">${shown.map(g=>`<button class="qi-item" data-qi="select" data-id="${esc(g.id)}" aria-current="${g.id===selected?'true':'false'}"><span class="qi-item-top"><span class="qi-status ${g.replies.some(fresh)?'qi-new':g.waiting?'qi-wait':'qi-answered'}">${status(g)}</span><time>${esc(g.updated?fmtAt(g.updated):'')}</time></span><strong>${esc(g.title)}</strong><span class="qi-preview">${esc(g.preview||'사진과 답변을 열어 확인해 보세요.')}</span><span class="qi-item-bottom">질문 ${g.questions.length} · 답변 ${g.replies.length}<span>대화 보기 →</span></span></button>`).join('')||`<div class="qi-empty"><span>✉</span><h2>${busy?'질문을 가져오고 있어요':query||filter!=='all'?'찾는 대화가 없어요':error?'기록을 확인하지 못했어요':'아직 질문 기록이 없어요'}</h2><p>${query||filter!=='all'?'검색어나 필터를 바꿔 보세요.':error?'새로고침으로 다시 확인할 수 있어요.':'막힌 문제나 궁금한 내용을 편하게 물어보세요.'}</p></div>`}</aside><article class="qi-detail card" id="qi-detail" tabindex="-1">${current?detail(current):'<div class="qi-empty"><span>☏</span><h2>질문과 답변을 한곳에서</h2><p>대화를 고르면 질문 내용과 선생님 답변이 여기에 보여요.</p></div>'}</article></div>`;
    if(window.renderMathInElement)renderMathInElement(panel.querySelector('#qi-detail'),{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});
  }
  function detail(g){
    const newest=g.replies.at(-1);
    return `<div class="qi-detail-heading"><span class="qi-eyebrow">${g.id==='free'?'자유질문 대화':'유형별 질문 대화'}</span><h2 class="badge">${esc(g.title)}</h2><div class="qi-detail-actions">${newest?'<button class="qi-primary" data-qi="answer">↓ 최근 답변 바로 보기</button>':''}${g.card?'<button data-qi="original">'+(TEACHER?'문제 확인 · 답장 쓰기':'관련 카드 · 이어서 질문')+' ↗</button>':''}</div>${!g.card?'<p class="qi-load">현재 오답 목록에서 빠진 이전 대화예요. 질문과 답변 기록은 여기에서 볼 수 있어요.</p>':''}</div><div class="qi-conversation"><section class="qi-question-section"><h3>내가 질문한 내용 <span>${g.questions.length}</span></h3>${g.questions.length?g.questions.map(q=>`<div class="qi-question"><time>${esc(fmtAt(q.at))}</time><div class="qi-message">${esc(q.text||'이 문제에서 막혔어요.')}</div>${window.QuestionPhoto?.html(q)||''}</div>`).join(''):'<p class="qi-load">'+(error?'질문 내용을 불러오지 못했어요. 새로고침해 주세요.':'연결된 질문 글이 없어요. 선생님이 남긴 답변은 아래에서 볼 수 있어요.')+'</p>'}</section><section class="qi-answer-section"><h3>선생님 답변 <span>${g.replies.length}</span></h3>${g.replies.length?[...g.replies].reverse().map((r,i)=>`<div class="reply qi-reply" ${i===0?'id="qi-latest"':''} data-sig="${replySig(r.text,r.at)}"><div class="rh"><b>${i===0?'가장 최근 답변':'이전 답변'}</b>${fresh(r)?'<span class="qi-status qi-new">NEW</span>':''}<time>${esc(fmtAt(r.at))}</time></div>${replyBody(r.text)}${!TEACHER?`<button class="qi-read" data-qi="read" data-sig="${replySig(r.text,r.at)}">${fresh(r)?'이 답변 읽음으로 표시':'✓ 확인한 답변'}</button>`:''}</div>`).join(''):'<div class="qi-waiting"><b>선생님 답변을 기다리고 있어요</b><p>답변이 올라오면 이 대화에서 확인할 수 있어요.</p></div>'}</section></div>`;
  }
  async function refresh(){
    if(busy)return;if(IS_DEMO||!QPHOTO||SID.length<12){loaded=true;draw();return;}
    busy=true;error='';draw();
    const result=await Promise.allSettled(['questions','replies'].map(async mode=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
      try{const r=await fetch(QPHOTO+'?t='+encodeURIComponent(SID)+'&mode='+mode+'&_='+Date.now(),{signal:controller.signal});if(!r.ok)throw new Error('HTTP');const j=await r.json();if(!Array.isArray(j[mode]))throw new Error('shape');return j[mode];}finally{clearTimeout(timer);}
    }));
    if(result[0].status==='fulfilled')questions=result[0].value;
    if(result[1].status==='fulfilled')replies=result[1].value;
    error=result.some(r=>r.status==='rejected')?'최근 기록 일부를 불러오지 못했어요. 보관된 답변을 먼저 보여드려요. 새로고침해 주세요.':'';
    busy=false;loaded=!error;if(visible)draw();
  }
  function original(id,ask=false){
    setVisible(false);
    const nav=document.querySelector('#student-home-nav [data-tab="notebook"]');if(nav)nav.click();
    const app=document.getElementById('app');app.hidden=false;entry.hidden=false;
    const el=document.getElementById(id);if(!el)return;
    if(TEACHER&&!el.querySelector('.tbox')){const c=cards().find(c=>c.id===id);if(c)teacherTools(el,c.key.split('.')[0],c.key.split('.')[1]||'');}
    if(ask&&!TEACHER&&!IS_DEMO)askOpen(id.replace(/^card_/,''));
    el.scrollIntoView({block:'start',behavior:'smooth'});
    if(typeof markNew==='function')markNew();
  }
  function onClick(e){
    const b=e.target.closest('[data-qi]');if(!b||b.disabled)return;
    const action=b.dataset.qi;
    if(action==='filter'){filter=b.dataset.filter;drawBody();panel.querySelector(`[data-filter="${filter}"]`)?.focus();}
    else if(action==='select'){selected=b.dataset.id;drawBody();const d=panel.querySelector('#qi-detail');d.focus({preventScroll:true});if(innerWidth<760)d.scrollIntoView({block:'start',behavior:'smooth'});}
    else if(action==='refresh')refresh();
    else if(action==='ask')original('card_free',true);
    else if(action==='back'){setVisible(false);const nav=document.querySelector('#student-home-nav [data-tab="notebook"]');if(nav)nav.click();else{document.getElementById('app').hidden=false;entry.hidden=false;}}
    else if(action==='original'){const g=groups().find(g=>g.id===selected);if(g?.card)original(g.card.id);}
    else if(action==='answer')panel.querySelector('#qi-latest')?.scrollIntoView({block:'center',behavior:'smooth'});
    else if(action==='read'){if(!TEACHER&&!IS_DEMO){const y=scrollY;seenAdd(b.dataset.sig);drawBody();window.scrollTo({top:y,behavior:'instant'});panel.querySelector('[data-qi="read"]')?.focus({preventScroll:true});}}
  }
  window.QuestionInbox={setVisible,refresh,original};
  document.addEventListener('DOMContentLoaded',mount);
})();
