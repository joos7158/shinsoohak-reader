(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StudentHomeCore=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const ITEMS=[['bowl','우유그릇',1,'decor','🥛'],['cushion','푹신방석',2,'decor','☁'],['yarn','털실뭉치',3,'decor','🧶'],['fish','생선간식',5,'decor','🐟'],['bell','방울목걸이',7,'accessory','🔔'],['plant','화분',9,'decor','🪴'],['frame','추억액자',12,'decor','🖼'],['ribbon','리본',15,'accessory','🎀'],['rug','꽃무늬러그',18,'decor','🌸'],['scarf','목도리',21,'accessory','🧣'],['music','오르골',25,'decor','♫'],['crown','황금왕관',30,'accessory','👑']].map(([id,name,at,kind,icon])=>Object.freeze({id,name,at,kind,icon}));
  const number=x=>Number.isSafeInteger(x)&&x>=0?x:0;
  function parse(raw){try{const v=typeof raw==='string'?JSON.parse(raw):raw;return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch{return {};}}
  function diaryCount(raw){return Object.entries(parse(raw)).filter(([k,v])=>/^\d+$/.test(k)&&v===true).length;}
  function points(reward,diary1,diary2){return Math.max(number(reward?.stamps),diaryCount(diary1),diaryCount(diary2));}
  function restore(raw,count){const p=parse(raw),owned=ITEMS.filter(i=>i.at<=count);return {choice:['homework','questions','notebook'].includes(p.choice)?p.choice:'homework',petName:typeof p.petName==='string'?p.petName.trim().slice(0,12)||'모모':'모모',accessory:owned.some(i=>i.kind==='accessory'&&i.id===p.accessory)?p.accessory:null,decorations:owned.filter(i=>i.kind==='decor'&&(!Array.isArray(p.decorations)||p.decorations.includes(i.id))).map(i=>i.id),target:ITEMS.some(i=>i.id===p.target&&i.at>count)?p.target:ITEMS.find(i=>i.at>count)?.id||null,marks:parse(p.marks)};}
  function equip(state,id,count){const item=ITEMS.find(i=>i.id===id&&i.at<=count);if(!item)return false;if(item.kind==='accessory')state.accessory=state.accessory===id?null:id;else state.decorations=state.decorations.includes(id)?state.decorations.filter(x=>x!==id):[...state.decorations,id];return true;}
  function setTarget(state,id,count){if(!ITEMS.some(i=>i.id===id&&i.at>count))return false;state.target=id;return true;}
  function toggleMark(state,row){if(!row?.active)return false;const key=row.id+':'+row.revision;state.marks[key]=!state.marks[key];return true;}
  return {ITEMS,points,restore,equip,setTarget,toggleMark,diaryCount};
});
