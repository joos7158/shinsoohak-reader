/* Records only the visible teaching canvas and an explicitly enabled microphone. */
(function(root){
  'use strict';
  const MIME_TYPES=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4'];
  function mimeType(Recorder){return MIME_TYPES.find(t=>Recorder.isTypeSupported(t))||'';}
  function crop(canvas,wrap){
    const c=canvas.getBoundingClientRect(), w=wrap.getBoundingClientRect();
    const left=Math.max(c.left,w.left),top=Math.max(c.top,w.top);
    const width=Math.max(0,Math.min(c.right,w.right)-left),height=Math.max(0,Math.min(c.bottom,w.bottom)-top);
    return {x:(left-c.left)*canvas.width/c.width,y:(top-c.top)*canvas.height/c.height,
      width:width*canvas.width/c.width,height:height*canvas.height/c.height,
      left:left-w.left,top:top-w.top,viewW:w.width,viewH:w.height,cssW:width,cssH:height};
  }
  if(typeof module==='object'&&module.exports){module.exports={mimeType,crop};return;}
  let session=null, result=null, resultURL='', panel=null, message=null, button=null, previewButton=null;
  let dbPromise;
  let activeBoard=null;
  async function playReply(button,options){
    if(button.disabled)return;button.disabled=true;button.textContent='영상을 불러오는 중…';
    try{
      const res=await fetch(options.endpoint+'?mode=replyVideo&t='+encodeURIComponent(options.token)+'&id='+encodeURIComponent(options.id),{referrerPolicy:'no-referrer'});
      const data=await res.json();if(!data.video||!['video/webm','video/mp4'].includes(data.mime))throw new Error('unavailable');
      const bytes=Uint8Array.from(atob(data.video),c=>c.charCodeAt(0));
      const url=URL.createObjectURL(new Blob([bytes],{type:data.mime}));
      const player=document.createElement('video');player.controls=true;player.playsInline=true;player.style.cssText='width:100%;max-height:70vh;background:#111';player.src=url;
      const holder=button.parentNode;holder.replaceChildren(player);const link=document.createElement('a');link.href=url;link.download='선생님-풀이.'+(data.mime==='video/mp4'?'mp4':'webm');link.textContent='영상 저장';holder.appendChild(link);
      window.addEventListener('pagehide',()=>URL.revokeObjectURL(url),{once:true});
      player.play().catch(()=>{});
    }catch(e){button.disabled=false;button.textContent='영상을 불러오지 못했어요 · 다시 시도';}
  }
  const attachments=new Map();
  function attach(cid){
    if(!result||!cid)return false;
    if(result.blob.size>20*1024*1024){alert('영상 답장 첨부는 20MB까지 가능해요. 이 영상은 저장·공유를 이용하거나 짧게 다시 녹화해 주세요.');return false;}
    if(result.cid!==cid&&!confirm('최근 녹화 영상을 현재 질문의 답장에 붙일까요? 영상 내용을 먼저 확인해 주세요.'))return false;
    attachments.set(cid,{blob:result.blob,id:crypto.randomUUID()});
    const box=document.getElementById('pf_'+cid);
    if(box){box.replaceChildren();const note=document.createElement('span');note.textContent='🎬 녹화 영상 첨부됨 ('+(result.blob.size/1048576).toFixed(1)+'MB) — 아래 답 보내기를 누르면 학생에게 전달됩니다. ';box.appendChild(note);const remove=document.createElement('button');remove.className='pbtn';remove.textContent='영상 떼기';remove.onclick=()=>{attachments.delete(cid);box.replaceChildren();};box.appendChild(remove);}
    if(panel){panel.querySelector('video').pause();panel.hidden=true;}
    if(document.getElementById('board'))root.boardClose();
    box?.scrollIntoView({block:'center',behavior:'smooth'});
    return true;
  }
  async function encoded(cid){const item=attachments.get(cid);if(!item)return null;const mime=item.blob.type.split(';')[0];return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({video:reader.result,requestId:item.id});reader.onerror=()=>reject(reader.error);reader.readAsDataURL(new Blob([item.blob],{type:mime}));});}
  const busy=()=>!!session;
  function db(){return dbPromise||(dbPromise=new Promise((resolve,reject)=>{
    const req=indexedDB.open('shinsoohak-board-recording',1);
    req.onupgradeneeded=()=>req.result.createObjectStore('drafts');
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  }));}
  async function save(value){const database=await db();return new Promise((resolve,reject)=>{
    const tx=database.transaction('drafts','readwrite');
    if(value)tx.objectStore('drafts').put(value,'latest');else tx.objectStore('drafts').delete('latest');
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });}
  function status(text){if(message)message.textContent=text;}
  function label(){if(button){button.textContent=session?(session.recorder?'■ 녹화 종료':'마이크 연결 취소'):'🎙 필기·목소리 녹화';button.disabled=false;}if(previewButton)previewButton.disabled=busy();}
  function cleanup(s){clearInterval(s.timer);clearInterval(s.paint);s.mic?.getTracks().forEach(t=>t.stop());s.stream?.getTracks().forEach(t=>t.stop());}
  function fileName(){return '수학-풀이-'+new Date().toISOString().replace(/[:.]/g,'-')+(result.blob.type.includes('mp4')?'.mp4':'.webm');}
  function showResult(){
    if(!result)return;
    if(resultURL)URL.revokeObjectURL(resultURL);resultURL=URL.createObjectURL(result.blob);
    panel?.remove();panel=document.createElement('section');panel.className='board-recording-result';
    panel.style.cssText='position:fixed;bottom:12px;right:12px;z-index:10001;background:#fff;padding:16px;border:2px solid #b98530;border-radius:16px;box-shadow:0 8px 40px #0004;width:min(420px,calc(100vw - 48px));max-height:85vh;overflow:auto;touch-action:auto';
    panel.innerHTML='<strong>🎬 녹화한 풀이</strong><p data-note style="font-size:13px">목소리와 필기를 확인한 뒤 저장하세요. 학생에게 자동 전송되지 않습니다.</p><video controls playsinline style="width:100%;max-height:40vh;background:#eee"></video><p style="display:flex;gap:8px;flex-wrap:wrap"><a class="pbtn" data-download>영상 저장</a><button class="pbtn" data-share>공유하기</button><button class="pbtn" data-hide>접기</button><button class="pbtn" data-delete>삭제</button></p>';
    panel.querySelector('video').src=resultURL;
    const attachButton=document.createElement('button');attachButton.className='pbtn';attachButton.style.cssText='background:#2e7d32;color:#fff';attachButton.textContent='🎬 영상 답장에 붙이기';attachButton.onclick=()=>attach(activeBoard?.cid||result.cid);panel.querySelector('p:last-child').prepend(attachButton);
    const link=panel.querySelector('[data-download]');link.href=resultURL;link.download=fileName();
    const share=panel.querySelector('[data-share]');
    const file=new File([result.blob],fileName(),{type:result.blob.type});
    share.hidden=!navigator.canShare?.({files:[file]});
    share.onclick=async()=>{try{await navigator.share({files:[file],title:'수학 풀이 설명'});}catch(e){if(e.name!=='AbortError')panel.querySelector('[data-note]').textContent='공유하지 못했어요. 영상 저장 버튼으로 파일을 보관해 주세요.';}};
    panel.querySelector('[data-hide]').onclick=()=>{panel.querySelector('video').pause();panel.hidden=true;};
    panel.querySelector('[data-delete]').onclick=async()=>{if(!confirm('이 기기에 보관한 녹화 영상을 삭제할까요?'))return;try{await save(null);}catch(e){}result=null;URL.revokeObjectURL(resultURL);resultURL='';panel.remove();panel=null;};
    (document.getElementById('board')||document.body).appendChild(panel);
  }
  async function start(board){
    if(session){stop();return;}
    if(!board.bg||document.querySelector('#board .bmsg')){status('문제 사진이 준비된 뒤 녹화해 주세요.');return;}
    if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream){status('이 브라우저는 녹화를 지원하지 않아요. 최신 Chrome 또는 삼성 인터넷에서 열어주세요.');return;}
    if(result&&!confirm('이전 녹화는 새 녹화가 끝나면 교체됩니다. 필요한 영상은 먼저 저장해 주세요. 새로 녹화할까요?'))return;
    if(panel){panel.querySelector('video').pause();panel.hidden=true;}
    const s=session={board,mic:null,stream:null,recorder:null,chunks:[],bytes:0};label();status('마이크 사용을 허용해 주세요.');
    try{
      s.mic=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
      if(session!==s){cleanup(s);return;}
      const wrap=document.querySelector('#board .bwrap'),out=document.createElement('canvas');
      const rect=wrap.getBoundingClientRect(),scale=Math.min(1,1280/rect.width,1440/rect.height);
      out.width=Math.max(2,Math.floor(rect.width*scale/2)*2);out.height=Math.max(2,Math.floor(rect.height*scale/2)*2);
      const ctx=out.getContext('2d');
      const paint=()=>{
        const r=crop(board.cv,wrap);ctx.fillStyle='#fff';ctx.fillRect(0,0,out.width,out.height);
        if(!r.width||!r.height)return;
        const k=Math.min(out.width/r.viewW,out.height/r.viewH),dx=(out.width-r.viewW*k)/2,dy=(out.height-r.viewH*k)/2;
        ctx.drawImage(board.cv,r.x,r.y,r.width,r.height,dx+r.left*k,dy+r.top*k,r.cssW*k,r.cssH*k);
      };
      paint();s.stream=out.captureStream(15);s.mic.getAudioTracks().forEach(t=>s.stream.addTrack(t));
      const type=mimeType(MediaRecorder);s.recorder=new MediaRecorder(s.stream,{...(type?{mimeType:type}:{}),videoBitsPerSecond:1800000,audioBitsPerSecond:64000});
      s.recorder.ondataavailable=e=>{if(e.data.size){s.chunks.push(e.data);s.bytes+=e.data.size;if(s.bytes>=100*1024*1024)stop('파일 크기 한도에 도달해 녹화를 마쳤어요.');}};
      s.recorder.onerror=()=>{s.error=true;stop('녹화가 중단됐어요. 남아 있는 영상을 확인해 주세요.');};
      s.recorder.onstop=async()=>{
        cleanup(s);if(session===s)session=null;label();
        if(!s.chunks.length){status('녹화된 내용이 없어요. 다시 시도해 주세요.');return;}
        result={blob:new Blob(s.chunks,{type:s.recorder.mimeType||s.chunks[0].type}),created:Date.now(),cid:board.cid};
        showResult();status(s.error?'중단된 영상을 확인하고 저장해 주세요.':'녹화 완료 · 미리보기에서 목소리와 필기를 확인하세요.');
        try{await save(result);}catch(e){if(panel)panel.querySelector('[data-note]').textContent='기기 임시 보관에 실패했어요. 페이지를 닫기 전에 반드시 영상 저장을 눌러주세요.';}
      };
      s.mic.getAudioTracks().forEach(t=>t.onended=()=>stop('마이크 연결이 끊겨 녹화를 마쳤어요.'));
      s.recorder.start(1000);s.started=Date.now();s.paint=setInterval(()=>{try{paint();}catch(e){s.error=true;stop();}},66);
      s.timer=setInterval(()=>{const sec=Math.floor((Date.now()-s.started)/1000);status('🔴 녹화 중 '+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')+' · 문제와 필기, 목소리가 함께 녹화됩니다.');if(sec>=600)stop('10분 녹화를 마쳤어요.');},500);label();status('🔴 녹화 중 0:00 · 필기하면서 설명해 주세요.');
    }catch(e){cleanup(s);if(session===s)session=null;label();status(e.name==='NotAllowedError'?'마이크 권한이 필요해요. 주소창의 사이트 설정에서 마이크를 허용한 뒤 다시 눌러주세요.':e.name==='NotFoundError'?'마이크를 찾지 못했어요. 연결 상태를 확인해 주세요.':'녹화를 시작하지 못했어요. 마이크가 다른 앱에서 사용 중인지 확인해 주세요.');}
  }
  function stop(reason){const s=session;if(!s)return;if(s.recorder&&s.recorder.state!=='inactive'){s.recorder.stop();label();if(button)button.disabled=true;}else if(!s.recorder){session=null;cleanup(s);label();}if(reason)status(reason);}
  function mount(board){
    activeBoard=board;
    const bar=document.querySelector('#board .btb');
    button=document.createElement('button');button.className='pbtn';button.style.cssText='background:#b42335;color:white;border-color:#b42335';button.onclick=()=>start(board);bar.appendChild(button);label();
    const preview=previewButton=document.createElement('button');preview.className='pbtn';preview.textContent='최근 녹화 보기';preview.onclick=()=>result?showResult():status('아직 녹화한 영상이 없어요.');bar.appendChild(preview);
    message=document.createElement('div');message.setAttribute('role','status');message.style.cssText='flex-basis:100%;font-size:13px;color:#74390a';message.textContent='녹화 버튼을 누르면 마이크를 연결합니다. 최대 10분 · 영상은 이 기기에 보관됩니다.';bar.appendChild(message);
  }
  function beforeClose(){if(busy()){status('먼저 녹화 종료 또는 마이크 연결 취소를 눌러주세요.');return false;}if(panel)document.body.appendChild(panel);return true;}
  window.addEventListener('beforeunload',e=>{if(busy()){e.preventDefault();e.returnValue='';}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&busy())stop('화면을 벗어나 녹화를 마쳤어요.');});
  root.BoardRecorder={mount,beforeClose,stop,busy,attach,encoded,playReply,has:cid=>attachments.has(cid),clear:cid=>attachments.delete(cid),hasResult:()=>!!result};
  db().then(database=>{const tx=database.transaction('drafts');const req=tx.objectStore('drafts').get('latest');req.onsuccess=()=>{if(!result&&!session&&req.result?.blob){result=req.result;}};}).catch(()=>{});
})(typeof window!=='undefined'?window:globalThis);
