(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuestionInboxCore=api;})(globalThis,function(){
  'use strict';
  const time=v=>Number.isFinite(Date.parse(v))?Date.parse(v):0;
  const clean=v=>String(v||'').replace(/\s*\[카드:[^\]]+\]\s*$/,'').replace(/^🙋(?:자유)?질문(?:사진)?\s*[—-]?\s*/,'').trim();
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
      g.questions.push({...q,text:clean(raw),kind:'question'});
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
      g.preview=clean(q?.text||r?.text).replace(/(?:✍IMG|🎬VIDEO)\s+\S+/g,'').replace(/https?:\/\/\S+/g,'첨부 자료');
      return g;
    }).sort((a,b)=>b.updated-a.updated);
  }
  return {build,time,clean};
});
