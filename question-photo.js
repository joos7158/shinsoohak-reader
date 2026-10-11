(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuestionPhoto=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  function drivePhoto(value){
    try{
      const u=new URL(String(value||''));
      if(u.protocol!=='https:'||u.hostname!=='drive.google.com'||u.username||u.password)return null;
      const id=(u.pathname.match(/^\/file\/d\/([\w-]+)(?:\/|$)/)||[])[1]||u.searchParams.get('id');
      if(!id||!/^[-\w]{10,200}$/.test(id))return null;
      return {view:'https://drive.google.com/file/d/'+id+'/view',preview:'https://drive.google.com/file/d/'+id+'/preview'};
    }catch{return null;}
  }
  function html(question,cid,key){
    const esc=v=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const photo=drivePhoto(question?.photo);
    if(!photo)return String(question?.text||'').includes('📷')?'<p class="why">사진이 첨부된 질문입니다. 사진 주소를 불러오지 못했어요. 서버 연결을 확인해 주세요.</p>':'';
    // Original Drive permissions remain intact. No public copy, sharing change or proxy.
    return '<div class="question-photo" style="margin-top:10px"><a href="'+photo.view+'" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:9px 14px;border-radius:10px;background:#8a5a00;color:white;text-decoration:none">📷 질문 사진 크게 열기</a>'+ (cid ? '<button class="pbtn" data-board-photo="'+photo.view+'" data-cid="'+esc(cid)+'" data-key="'+esc(key)+'" style="margin:8px 0">✍ 이 사진으로 판서</button>' : '') +'<iframe src="'+photo.preview+'" title="학생이 첨부한 질문 사진" loading="lazy" referrerpolicy="no-referrer" style="display:block;width:100%;height:420px;border:1px solid #ead7aa;border-radius:10px;margin-top:8px;background:white"></iframe><p class="why">사진이 보이지 않으면 위 버튼을 눌러 사진을 보관한 학원 Google 계정으로 열어주세요.</p></div>';
  }
  if(typeof document!=='undefined')document.addEventListener('click',e=>{const b=e.target.closest('[data-board-photo]');if(b&&typeof boardOpen==='function')boardOpen(b.dataset.cid,b.dataset.key,b.dataset.boardPhoto);});
  return {drivePhoto,html};
});
