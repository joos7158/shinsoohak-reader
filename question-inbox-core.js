(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuestionInboxCore=api;})(globalThis,function(){
  'use strict';
  const time=v=>Number.isFinite(Date.parse(v))?Date.parse(v):0;
  const clean=v=>String(v||'').replace(/\s*\[카드:[^\]]+\]\s*$/,'').replace(/^🙋(?:자유)?질문(?:사진)?\s*[—-]?\s*/,'').trim();
  const answerId=v=>(String(v||'').match(/^\[질문ID:(q-[a-f0-9]{16})\]\r?\n/)||[])[1]||'';
  const answerText=v=>String(v||'').replace(/^\[질문ID:q-[a-f0-9]{16}\]\r?\n/,'');
  function questionId(q){
    const value=String(q.at||'').trim()+'\n'+String(q.rawText??q.text??'').trim();
    let a=2166136261,b=3339675911;
    for(const ch of value){a=Math.imul(a^ch.codePointAt(0),16777619)>>>0;b=Math.imul(b^ch.codePointAt(0),2246822519)>>>0;}
    return 'q-'+a.toString(16).padStart(8,'0')+b.toString(16).padStart(8,'0');
  }
  function tagAnswer(id,text){return /^q-[a-f0-9]{16}$/.test(id)?`[질문ID:${id}]\n${answerText(text)}`:String(text||'');}
  function build(cards,questions,replies){
    const groups=new Map();
    function identity(key,title){
      if(key==='free')return {id:'free',title:'자유질문 · 숙제 질문',card:cards.find(c=>c.key==='free')};
      const hash=String(key||'').split('.')[1];
      const matches=cards.filter(c=>c.key!=='free'&&((hash&&c.key.split('.')[1]===hash)||(!hash&&title&&c.title===title)));
      // A historical card may change position; only a unique match is safe.
      const card=matches.length===1&&(!title||matches[0].title===title)?matches[0]:null;
      return {id:card?.key||key||'type:'+title,title:title||card?.title||'이전 질문',card};
    }
    function get(key,title){const meta=identity(key,title);if(!groups.has(meta.id))groups.set(meta.id,{...meta,questions:[],replies:[]});return groups.get(meta.id);}
    questions.forEach((q,i)=>{
      const raw=String(q.text||''),key=(raw.match(/\[카드:([^\]]+)\]/)||[])[1]||(/^🙋자유질문/.test(raw)?'free':'');
      const title=(raw.match(/「([^」]+)」/)||[])[1]||'';
      const g=get(key||(!title?'unlinked:'+i:''),title);
      g.questions.push({...q,rawText:raw,text:clean(raw),kind:'question'});
    });
    [...cards.flatMap(c=>(c.replies||[]).map(r=>({card:c.key,type:c.key==='free'?'':c.title,text:r.답,at:r.at}))),...replies].forEach(r=>{
      if(!r.text)return;
      const g=get(r.card,r.type),stamp=time(r.at);
      if(!g.replies.some(x=>x.text===r.text&&(time(x.at)===stamp||String(x.at).slice(0,10)===String(r.at).slice(0,10))))g.replies.push({...r,kind:'reply'});
    });
    return [...groups.values()].map(g=>{
      g.questions.sort((a,b)=>time(a.at)-time(b.at));g.replies.sort((a,b)=>time(a.at)-time(b.at));
      const q=g.questions.at(-1),r=g.replies.at(-1);
      g.waiting=!!q&&(!r||(time(q.at)>0&&time(r.at)>0&&time(q.at)>time(r.at)));
      g.updated=Math.max(time(q?.at),time(r?.at));
      g.preview=clean(q?.text||answerText(r?.text)).replace(/(?:✍IMG|🎬VIDEO)\s+\S+/g,'').replace(/https?:\/\/\S+/g,'첨부 자료');
      return g;
    }).sort((a,b)=>b.updated-a.updated);
  }
  function problems(cards,questions,replies){
    const grouped=build(cards,questions,replies),rows=[],byId=new Map(),unlinked=[];
    grouped.forEach(g=>g.questions.forEach(q=>{
      const id=questionId(q);if(byId.has(id))return;
      const key=(q.rawText.match(/\[카드:([^\]]+)\]/)||[])[1]||(g.id==='free'?'free':g.card?.key||g.id);
      const row={...g,id,groupId:g.id,questions:[q],replies:[],replyKey:key,question:q,updated:time(q.at),unlinked:false,uncertain:false};
      byId.set(id,row);rows.push(row);
    }));
    grouped.forEach(g=>{
      const own=rows.filter(r=>r.groupId===g.id),loose=[];
      g.replies.forEach(r=>{
        const explicit=answerId(r.text),target=explicit?byId.get(explicit):null;
        if(target){target.replies.push(r);return;}
        // Historical answers have only a card/type key. Never guess between multiple questions.
        const only=own.length===1?own[0]:null;
        if(!explicit&&only&&time(r.at)&&time(only.question.at)&&time(r.at)>=time(only.question.at)){only.replies.push(r);return;}
        loose.push(r);
      });
      if(loose.length){
        own.filter(r=>!r.replies.length).forEach(r=>r.uncertain=true);
        unlinked.push({...g,id:'unlinked:'+g.id,questions:[],replies:loose,unlinked:true,waiting:false,updated:Math.max(...loose.map(r=>time(r.at)))});
      }
    });
    rows.forEach(r=>{r.replies.sort((a,b)=>time(a.at)-time(b.at));r.waiting=!r.replies.length&&!r.uncertain;r.updated=Math.max(r.updated,...r.replies.map(a=>time(a.at)));});
    return {items:rows.sort((a,b)=>b.updated-a.updated),unlinked:unlinked.sort((a,b)=>b.updated-a.updated)};
  }
  return {build,problems,time,clean,questionId,answerId,answerText,tagAnswer};
});
