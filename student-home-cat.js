/* Code-native illustration: same earned item IDs, a new character and room.
   2026-10-15 박사 냥이 — 학사모·흰 가운·오답노트+연필. 입체감은 그라데이션+부드러운 그림자로.
   이전 그림은 student-home-cat.js.bak_20261015_doctorcat */
window.CuteCat = {
  _n: 0,
  // Photo attachments use body landmarks, separately from the SVG fallback.
  // Coordinates are in the room viewBox; happy sprites have their own entries.
  PHOTO_ATTACHMENTS: {
    doctor: {neck:[200,192], ear:[259,83], crown:[200,56]},
    doctor_happy: {neck:[200,192], ear:[259,83], crown:[200,56]},
    detective: {neck:[200,192], ear:[259,83], crown:[200,56]},
    detective_happy: {neck:[200,192], ear:[259,83], crown:[200,56]},
    builder: {neck:[200,192], ear:[259,83], crown:[200,56]},
    builder_happy: {neck:[200,192], ear:[259,83], crown:[200,56]},
    idea: {neck:[200,192], ear:[259,83], crown:[200,56]},
    idea_happy: {neck:[200,192], ear:[259,83], crown:[200,56]},
    time: {neck:[200,192], ear:[259,83], crown:[200,56]},
    time_happy: {neck:[200,192], ear:[259,83], crown:[200,56]},
  },
  // 성격별 고양이 — 오답 성향 판독(student_home_persona.py)으로 고름. 아이 화면엔 이 이름만 나간다.
  PERSONAS: {
    doctor:   {name:'박사냥', icon:'🎓', hold:'오답노트와 연필', lines:['어서 와! 오늘은 뭐부터 해볼까?','틀린 문제는 보물이야. 같이 열어 보자!','오답노트 한 장이면 오늘 공부 반은 끝!'], happy:'골골골… 같이 있으니까 좋다 ♡'},
    detective:{name:'꼼꼼 탐정냥', icon:'🔍', hold:'돋보기', lines:['오늘도 숨은 실수 찾으러 가 볼까? 🔍','답 쓰기 전에 한 번 더 — 그게 탐정의 비밀이야','어제보다 한 군데만 더 꼼꼼하게!'], happy:'골골… 탐정 파트너 최고야 ♡'},
    builder:  {name:'기초 튼튼냥', icon:'📚', hold:'두꺼운 책', lines:['오늘 배운 공식, 나한테 설명해 줄래?','튼튼한 기초 위에 높이높이 쌓자!','모르는 말 하나만 찾아도 오늘은 성공이야'], happy:'골골… 너랑 공부하면 든든해 ♡'},
    idea:     {name:'반짝 아이디어냥', icon:'💡', hold:'반짝이는 전구', lines:['뭘 구하는지 한 줄로 먼저 말해 보자 💡','막히면 그림부터 슥슥 그려 보는 거야!','번뜩! 오늘의 아이디어는 뭘까?'], happy:'골골… 머릿속에 불이 켜졌어 ♡'},
    time:     {name:'시간 마법사냥', icon:'⏳', hold:'모래시계', lines:['아는 문제부터 콕콕 잡자 ⏳','어려운 건 표시해 두고 다음으로 휙!','오늘은 시간 마법 한 번 써 볼까?'], happy:'골골… 너랑 있으면 시간이 순삭이야 ♡'},
  },
  // 성격별 방 소품(student-home-core ITEMS 의 who) — wall=선반·벽, floor=왼쪽 바닥
  PDECOR: {
    p_det1:['wall','<g transform="translate(121 47)"><ellipse rx="17" ry="5" fill="#8a6a4a"/><path d="M-12 0q0-17 12-17q12 0 12 17z" fill="#a9845c"/><path d="M-12-6h24M-7-14v14M0-17v17M7-14v14" stroke="#7a5a3c" stroke-width="1.2" opacity=".6"/><circle cy="-18" r="2.5" fill="#7a5a3c"/></g>'],
    p_det2:['wall','<rect x="292" y="136" width="52" height="40" rx="4" fill="#d9a46f" stroke="#b9834f" stroke-width="3"/><rect x="298" y="142" width="14" height="12" fill="#fff8e7" transform="rotate(-6 305 148)"/><rect x="322" y="141" width="15" height="13" fill="#e7f3ff"/><rect x="306" y="158" width="16" height="12" fill="#ffeef3" transform="rotate(5 314 164)"/><path d="M305 145L329 146L314 162Z" stroke="#e05a5a" stroke-width="1.3" fill="none"/><g fill="#e05a5a"><circle cx="305" cy="145" r="2"/><circle cx="329" cy="146" r="2"/><circle cx="314" cy="162" r="2"/></g>'],
    p_det3:['floor','<g fill="#b9a0d8" opacity=".75">'+[[24,290,-20],[44,276,10],[30,258,-15],[52,244,12]].map(([x,y,r])=>`<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="5" ry="4.5"/><circle cx="-5" cy="-6" r="2"/><circle cx="0" cy="-8" r="2"/><circle cx="5" cy="-6" r="2"/></g>`).join('')+'</g>'],
    p_bld1:['wall','<g transform="translate(121 52)"><path d="M-14 0q0-17 14-17q14 0 14 17z" fill="#ffc94d"/><rect x="-17" y="-2" width="34" height="4" rx="2" fill="#f0a830"/><path d="M0-17v15" stroke="#f0a830" stroke-width="3"/><ellipse cx="-6" cy="-10" rx="3" ry="4" fill="#fff" opacity=".5"/></g>'],
    p_bld2:['wall','<rect x="292" y="134" width="50" height="42" rx="3" fill="#5b8fd1"/><path d="M297 139h40M297 147h40M297 155h40M297 163h40M297 171h40M302 136v38M312 136v38M322 136v38M332 136v38" stroke="#7fa9e0" stroke-width=".8"/><path d="M302 168L332 168L302 144Z" stroke="#fff" stroke-width="2" fill="none"/><path d="M302 162h6v6" stroke="#fff" stroke-width="1.5" fill="none"/>'],
    p_bld3:['floor','<rect x="22" y="274" width="34" height="18" rx="3" fill="#f28b82"/><rect x="26" y="258" width="26" height="16" rx="3" fill="#7fc8a9"/><rect x="31" y="244" width="16" height="14" rx="3" fill="#ffd36e"/><path d="M39 247v8M35 251h8" stroke="#fff" stroke-width="2"/>'],
    p_ida1:['wall','<path d="M108 46l30-12-13 17-4-5z" fill="#fff" stroke="#9fb7e0" stroke-width="1.5" stroke-linejoin="round"/><path d="M121 46l4 5" stroke="#9fb7e0" stroke-width="1.5"/><path d="M96 50h7m-9 5h6" stroke="#c9d6ee" stroke-width="2" stroke-linecap="round"/>'],
    p_ida2:['wall','<path d="M135 14q75 22 150 0" stroke="#b9a7d6" stroke-width="1.5" fill="none"/>'+[150,172,194,216,238,260].map((x,i)=>{const y=14+11*(1-((x-210)/75)**2);const c=['#ffe066','#ffb3c6','#9fe0c8'][i%3];return `<circle cx="${x}" cy="${y+6}" r="7" fill="${c}" opacity=".35"/><ellipse cx="${x}" cy="${y+6}" rx="3.5" ry="5" fill="${c}"/>`;}).join('')],
    p_ida3:['floor','<g transform="translate(40 276) rotate(-12)"><path d="M-18 0q0-14 18-14q20 0 20 12q0 8-9 7q-6-1-6 5q0 6-7 6q-16 0-16-16z" fill="#f3d7a8" stroke="#d9b47c" stroke-width="1.5"/><circle cx="-8" cy="-6" r="3.5" fill="#f28b82"/><circle cx="2" cy="-9" r="3.5" fill="#7fc8a9"/><circle cx="11" cy="-5" r="3.5" fill="#7fa9e0"/><circle cx="-8" cy="4" r="3.5" fill="#ffd36e"/><ellipse cx="4" cy="3" rx="3" ry="2.5" fill="#fff"/></g>'],
    p_tim1:['wall','<path d="M112 52L131 31" stroke="#8c6bc4" stroke-width="3" stroke-linecap="round"/><path d="M133 20l2.5 5.5 6 .5-4.5 4 1.5 6-5.5-3-5.5 3 1.5-6-4.5-4 6-.5z" fill="#ffd36e" stroke="#e8b44a" stroke-width="1"/><circle cx="143" cy="38" r="1.5" fill="#ffd36e"/>'],
    p_tim2:['wall','<circle cx="318" cy="156" r="20" fill="#fff" stroke="#b79be0" stroke-width="5"/><path d="M318 156v-11M318 156l8 5" stroke="#6b5a8a" stroke-width="2.5" stroke-linecap="round"/><circle cx="318" cy="156" r="2" fill="#6b5a8a"/><g fill="#c9b8e8"><circle cx="318" cy="141" r="1.5"/><circle cx="333" cy="156" r="1.5"/><circle cx="318" cy="171" r="1.5"/><circle cx="303" cy="156" r="1.5"/></g>'],
    p_tim3:['floor','<path d="M44 250a21 21 0 1 0 15 36a17 17 0 1 1-15-36z" fill="#ffe08a" stroke="#e8c15a" stroke-width="1.5"/><circle cx="36" cy="270" r="2" fill="#7a6a50"/><ellipse cx="40" cy="277" rx="3.5" ry="2" fill="#f7b0b8" opacity=".8"/>'],
    p_doc1:['wall','<g fill="#dff4fb" fill-opacity=".6" stroke="#6b5a8a" stroke-width="2"><circle cx="114" cy="46" r="6"/><circle cx="130" cy="46" r="6"/></g><path d="M120 46h4" stroke="#6b5a8a" stroke-width="2"/>'],
    p_doc2:['wall','<rect x="292" y="134" width="52" height="40" rx="3" fill="#3f6b5c" stroke="#c99a6b" stroke-width="4"/><text x="318" y="159" text-anchor="middle" font-size="13" fill="#f5f5ec" font-family="Georgia,serif" font-style="italic">a²+b²</text><rect x="326" y="168" width="10" height="3" fill="#fff"/>'],
    p_doc3:['floor','<g transform="translate(40 268)"><path d="M-10 22h20" stroke="#b9834f" stroke-width="4" stroke-linecap="round"/><path d="M0 22v-6" stroke="#b9834f" stroke-width="3"/><circle cy="-2" r="15" fill="#8fc9e8"/><path d="M-9-9q6 2 4 8q-4 3-2 8M4-14q5 6 10 4M2 4q6-2 9 4" fill="none" stroke="#9ed49a" stroke-width="4" stroke-linecap="round"/><path d="M-17-2a17 17 0 0 0 34 0" stroke="#d9a46f" stroke-width="2" fill="none" transform="rotate(-20)"/></g>'],
  },
  pdecor(rewards, pid, slot){ return Object.entries(this.PDECOR).filter(([id,[sl]])=>sl===slot&&id.startsWith({detective:'p_det',builder:'p_bld',idea:'p_ida',time:'p_tim',doctor:'p_doc'}[pid])).map(([id,[,svg]])=>`<g data-cat="${id}" ${rewards.decorations.includes(id)?'':'hidden="hidden" style="display:none"'}>${svg}</g>`).join(''); },
  persona(id){ return this.PERSONAS[id] ? id : 'doctor'; },
  line(id, happy){ const P=this.PERSONAS[this.persona(id)]; if(happy) return P.happy; const d=Math.floor(Date.now()/864e5); return P.lines[d%P.lines.length]; },
  art(rewards, evening=false, happy=false, personaId='doctor') {
    const u = 'dc' + (++window.CuteCat._n);
    const pid = this.persona(personaId), P = this.PERSONAS[pid];
    const photo = window.STUDENT_HOME_PERSONA?.images?.[pid];
    const up = ['detective','idea','time'].includes(pid);
    const akey = happy && window.STUDENT_HOME_PERSONA?.images?.[pid+'_happy'] ? pid+'_happy' : pid;
    const points = this.PHOTO_ATTACHMENTS[akey];
    const attach = id => {
      if (!photo) return '';
      const spec = {
        bell:[points.neck, .8, [200,200]],
        scarf:[points.neck, .8, [200,200]],
        ribbon:[points.ear, .72, [261,112]],
        crown:[points.crown, .8, [200,80]],
      }[id];
      if (!spec) return '';
      const [at,scale,origin] = spec;
      return ` transform="translate(${at[0]} ${at[1]}) scale(${scale}) translate(${-origin[0]} ${-origin[1]})"`;
    };
    const show=id=>rewards.accessory===id||rewards.decorations.includes(id);
    const layer=(id,part,svg)=>`<g data-cat="${part}"${attach(id)} ${show(id)?'':'hidden="hidden" style="display:none"'}>${svg.replaceAll('${u}',u)}</g>`;
    const tie = !show('bell') && !show('scarf');
    const cap = !show('crown');
    const eye = (x) => happy
      ? `<path d="M${x-14} ${141}q14-15 28 0" stroke="#3a2f45" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
      : `<g class="kitten-eye"><ellipse cx="${x}" cy="138" rx="17" ry="19.5" fill="#2a3447"/>
         <ellipse cx="${x}" cy="139" rx="14.5" ry="17" fill="url(#iris${u})"/>
         <ellipse cx="${x}" cy="142" rx="7" ry="9" fill="#14202e"/>
         <ellipse cx="${x}" cy="147" rx="9" ry="4" fill="#9ff1f2" opacity=".45"/>
         <circle cx="${x-6}" cy="130" r="5.6" fill="#fff"/><circle cx="${x+6}" cy="146" r="2.4" fill="#fff"/></g>`;
    return `<svg class="roomsvg cute-room ${happy?'is-happy':''}" viewBox="0 0 400 300" role="img" aria-label="${P.hold}을(를) 든 ${P.name}와 내가 꾸민 작은 방">
    <defs>
      <radialGradient id="wall${u}" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="${evening?'#efe9fb':'#f3fbf6'}"/><stop offset="1" stop-color="${evening?'#ddd4f2':'#dcf1e6'}"/></radialGradient>
      <radialGradient id="fur${u}" cx=".38" cy=".28" r=".85"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#fdf8fc"/><stop offset="1" stop-color="#e2d5ee"/></radialGradient>
      <radialGradient id="paw${u}" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#eadff1"/></radialGradient>
      <radialGradient id="iris${u}" cx=".5" cy=".62" r=".62"><stop offset="0" stop-color="#9ef0ee"/><stop offset=".5" stop-color="#3fb3c9"/><stop offset="1" stop-color="#1c5a7c"/></radialGradient>
      <radialGradient id="blush${u}"><stop offset="0" stop-color="#ff9fbb" stop-opacity=".75"/><stop offset="1" stop-color="#ff9fbb" stop-opacity="0"/></radialGradient>
      <linearGradient id="gown${u}" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe3ef"/></linearGradient>
      <linearGradient id="cap${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7666b8"/><stop offset="1" stop-color="#43377a"/></linearGradient>
      <linearGradient id="ear${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6a9c0"/><stop offset="1" stop-color="#fbd3df"/></linearGradient>
      <linearGradient id="note${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb3a7"/><stop offset="1" stop-color="#ef8b8e"/></linearGradient>
      <radialGradient id="gold${u}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff2b8"/><stop offset=".5" stop-color="#ffcf63"/><stop offset="1" stop-color="#d99a35"/></radialGradient>
      <filter id="soft${u}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#7a5f93" flood-opacity=".22"/></filter>
    </defs>
    <rect width="400" height="300" rx="28" fill="url(#wall${u})"/>
    <path d="M0 223 Q200 204 400 223 V300 H0Z" fill="#e9e3f9"/>
    <path d="M25 226H375" stroke="#d7cfea" stroke-width="2"/>
    <rect x="287" y="26" width="80" height="103" rx="38" fill="#fff" stroke="#f4d8c4" stroke-width="7"/>
    <path d="M295 79V64A32 32 0 0 1 359 64V119H295Z" fill="${evening?'#b7afd9':'#cde8ef'}"/>
    <circle cx="337" cy="55" r="13" fill="${evening?'#fff4ca':'#ffda8c'}"/>
    <path d="M327 29V123M290 81H365" stroke="#fff" stroke-width="5"/>
    <path d="M40 54h90" stroke="#ddc7b7" stroke-width="7" stroke-linecap="round"/>
    <rect x="51" y="27" width="15" height="24" rx="3" fill="#e1c5eb" transform="rotate(-8 58 39)"/><rect x="70" y="22" width="14" height="29" rx="3" fill="#add9cc"/><rect x="87" y="32" width="19" height="19" rx="3" fill="#ffd394"/>
    <g fill="#c9bde6" opacity=".55" font-family="Georgia,serif" font-style="italic"><text x="20" y="160" font-size="15">x²</text><text x="250" y="30" font-size="13">π</text><text x="362" y="165" font-size="14">√</text></g>
    <g fill="#ead7ce"><circle cx="153" cy="35" r="3"/><circle cx="269" cy="153" r="3"/><path d="M44 129l3-7 3 7 7 3-7 3-3 7-3-7-7-3z"/></g>
    ${this.pdecor(rewards,pid,'wall')}
    ${layer('frame','item12','<rect x="31" y="73" width="52" height="55" rx="8" fill="#dfb391"/><rect x="36" y="78" width="42" height="45" rx="5" fill="#fffaf2"/><path d="M46 100q-5-15 11-8q16-7 11 8l-11 12z" fill="#f6a9ba"/>')}
    <ellipse cx="202" cy="268" rx="96" ry="15" fill="#c9bce2" opacity=".55"/>
    ${layer('rug','item18','<ellipse cx="201" cy="266" rx="166" ry="28" fill="#e5f0df"/><ellipse cx="201" cy="266" rx="149" ry="20" fill="none" stroke="#b9d6b3" stroke-width="3" stroke-dasharray="5 8"/>')}
    ${layer('cushion','item2','<ellipse cx="200" cy="262" rx="92" ry="24" fill="#eba6be"/><ellipse cx="200" cy="257" rx="88" ry="21" fill="#ffd0df"/><path d="M130 258q70 17 140 0" fill="none" stroke="#f4b5cb" stroke-width="2"/>')}
    <g class="kitten"><g class="kitten-character">
      ${photo?`<image class="kitten-photo" href="${(happy&&window.STUDENT_HOME_PERSONA.images[pid+'_happy'])||photo}" x="80" y="30" width="240" height="245" preserveAspectRatio="xMidYMax meet"/>`:''}
      <g class="kitten-svg" ${photo?'hidden="hidden" style="display:none"':''}>
      <g class="kitten-tail">
        <path d="M244 250C296 256 322 222 306 182" stroke="#e6dbef" stroke-width="24" fill="none" stroke-linecap="round"/>
        <path d="M244 247C292 252 316 222 303 186" stroke="#fffbfe" stroke-width="13" fill="none" stroke-linecap="round" opacity=".8"/>
        <path d="M244 250C296 256 322 222 306 182" pathLength="100" stroke="#d6c4ef" stroke-width="24" fill="none" stroke-dasharray="0 58 6 9 6 9 12 100"/>
        <path d="M307 187L306 182" stroke="#d6c4ef" stroke-width="24" stroke-linecap="round"/>
      </g>
      <path d="M146 268Q142 210 172 192H228Q258 210 254 268Z" fill="url(#gown${u})" filter="url(#soft${u})"/>
      <path d="M181 193L200 232L219 193Z" fill="url(#fur${u})"/>
      <path d="M178 193L197 236M222 193L203 236" stroke="#cdd2e2" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M200 236V266" stroke="#d6dbe8" stroke-width="2"/>
      <ellipse cx="172" cy="268" rx="20" ry="11" fill="url(#paw${u})" stroke="#e0d3ea" stroke-width="1.5"/><ellipse cx="228" cy="268" rx="20" ry="11" fill="url(#paw${u})" stroke="#e0d3ea" stroke-width="1.5"/>
      <path d="M166 272v-5m7 6v-6m7 5v-5M220 272v-5m7 6v-6m7 5v-5" stroke="#dccbe6" stroke-width="2" stroke-linecap="round"/>
      <path d="M128 106L120 52Q121 40 133 47L176 80Z" fill="url(#fur${u})" stroke="#e6d9ee" stroke-width="2" stroke-linejoin="round"/>
      <path d="M272 106L280 52Q279 40 267 47L224 80Z" fill="url(#fur${u})" stroke="#e6d9ee" stroke-width="2" stroke-linejoin="round"/>
      <path d="M136 96L130 60L162 83Z" fill="url(#ear${u})"/><path d="M264 96L270 60L238 83Z" fill="url(#ear${u})"/>
      <path d="M133 70l9 10m-6-2 7 5M267 70l-9 10m6-2-7 5" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/>
      <path d="M120 136Q118 72 200 70Q282 72 280 136Q278 196 200 198Q122 196 120 136Z" fill="url(#fur${u})" filter="url(#soft${u})"/>
      <path d="M124 150q-7 12 2 20q-1 10 9 12M276 150q7 12-2 20q1 10-9 12" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M187 92q2 9 5 15M200 90v17M213 92q-2 9-5 15" stroke="#ccb6ea" stroke-width="5.5" stroke-linecap="round" opacity=".85"/>
      <ellipse cx="149" cy="166" rx="21" ry="13" fill="url(#blush${u})"/><ellipse cx="251" cy="166" rx="21" ry="13" fill="url(#blush${u})"/>
      <g class="kitten-eyes">${eye(166)}${eye(234)}</g>
      <path d="M194 158q6-4 12 0q-1 5-6 7q-5-2-6-7z" fill="#f48fac"/>
      <path d="M200 165q-1 9-10 7m10-7q1 9 10 7" stroke="#8a5d6c" fill="none" stroke-width="2.5" stroke-linecap="round"/>
      ${happy?'<path d="M195 172q5 9 10 0z" fill="#f47d9b"/>':''}
      <path d="M126 152l-20-4m20 12-19 3m168-11 20-4m-20 12 19 3" stroke="#d9c9de" stroke-width="2" stroke-linecap="round"/>
      ${tie?`<g filter="url(#soft${u})"><path d="M200 200L181 190Q177 200 181 211Z" fill="#7fd8bd"/><path d="M200 200L219 190Q223 200 219 211Z" fill="#7fd8bd"/><path d="M185 195q-2 5 0 11M215 195q2 5 0 11" stroke="#5fbfa3" stroke-width="2" fill="none"/><rect x="194" y="194" width="12" height="12" rx="4" fill="#62c7a8"/></g>`:''}
      <g class="kitten-note">
        <path d="M168 210Q150 228 166 244" stroke="url(#gown${u})" stroke-width="21" fill="none" stroke-linecap="round"/>
        ${({
          doctor:`<g transform="rotate(-6 200 240)" filter="url(#soft${u})">
          <rect x="170" y="218" width="60" height="44" rx="5" fill="url(#note${u})"/>
          <rect x="170" y="218" width="7" height="44" rx="3" fill="#d96d78"/>
          <rect x="183" y="226" width="40" height="15" rx="4" fill="#fff7ef"/>
          <text x="203" y="237" font-size="9" font-weight="700" text-anchor="middle" fill="#b85a6c" font-family="Pretendard,'Malgun Gothic',sans-serif">오답노트</text>
          <path d="M190 250l5 5 10-10" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>`,
          builder:`<g transform="rotate(-4 200 240)" filter="url(#soft${u})">
          <rect x="166" y="214" width="68" height="50" rx="5" fill="#7fb4e6"/><rect x="170" y="258" width="62" height="7" rx="2" fill="#fffaf0"/><path d="M172 261h58" stroke="#e6dccb" stroke-width="1.5"/>
          <rect x="166" y="214" width="9" height="50" rx="3" fill="#5c93cc"/>
          <rect x="182" y="224" width="42" height="16" rx="4" fill="#fffaf0"/>
          <text x="203" y="236" font-size="10" font-weight="700" text-anchor="middle" fill="#3f73a8" font-family="Pretendard,'Malgun Gothic',sans-serif">수학 기초</text>
          <path d="M196 246h16" stroke="#ffd36e" stroke-width="4" stroke-linecap="round"/>
        </g>`,
          detective:`<g transform="rotate(-6 200 240)" filter="url(#soft${u})"><rect x="174" y="228" width="50" height="34" rx="5" fill="url(#note${u})"/><rect x="186" y="235" width="30" height="11" rx="3" fill="#fff7ef"/></g>`,
          idea:`<g transform="rotate(-6 200 240)" filter="url(#soft${u})"><rect x="174" y="228" width="50" height="34" rx="5" fill="#b8e3d2"/><path d="M184 240h30m-30 8h22" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`,
          time:`<g transform="rotate(-6 200 240)" filter="url(#soft${u})"><rect x="174" y="228" width="50" height="34" rx="5" fill="#d9c8f2"/><path d="M184 240h30m-30 8h22" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`,
        })[pid]}
        <ellipse cx="170" cy="243" rx="12" ry="10" fill="url(#paw${u})" stroke="#e0d3ea" stroke-width="1.5"/>
        <path d="${up?'M230 208Q250 214 250 204':'M232 210Q252 222 240 236'}" stroke="url(#gown${u})" stroke-width="21" fill="none" stroke-linecap="round"/>
        ${({
          doctor:`<g transform="rotate(-38 246 222)"><rect x="236" y="196" width="10" height="44" rx="2" fill="#ffd36e"/><rect x="236" y="196" width="3.5" height="44" fill="#ffe7a8"/><rect x="236" y="190" width="10" height="7" rx="2" fill="#f7a0b6"/><rect x="236" y="196" width="10" height="3" fill="#c9c3d6"/><path d="M236 240l5 11 5-11z" fill="#f6dcb6"/><path d="M239.5 247l1.5 4 1.5-4z" fill="#555"/></g>`,
          builder:'',
          detective:`<g filter="url(#soft${u})"><path d="M244 226L262 196" stroke="#8a5a3c" stroke-width="8" stroke-linecap="round"/><circle cx="268" cy="184" r="19" fill="#dff6fb" fill-opacity=".75" stroke="#d6a548" stroke-width="5.5"/><path d="M258 177q5-6 12-6" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`,
          idea:`<g class="kitten-glow"><circle cx="262" cy="182" r="30" fill="#fff3a6" opacity=".55"/><path d="M262 140v-8M232 152l-6-6M292 152l6-6M226 182h-8M298 182h8" stroke="#ffd34d" stroke-width="3.5" stroke-linecap="round"/></g><g filter="url(#soft${u})"><circle cx="262" cy="180" r="17" fill="#ffe680"/><path d="M256 182l3 6 3-8 3 8 3-6" stroke="#f0a92b" stroke-width="2" fill="none" stroke-linejoin="round"/><rect x="253" y="195" width="18" height="12" rx="3" fill="#b9bccb"/><path d="M253 199h18m-18 4h18" stroke="#9196a8" stroke-width="1.5"/><circle cx="256" cy="173" r="4" fill="#fff" opacity=".8"/></g>`,
          time:`<g filter="url(#soft${u})" transform="rotate(10 262 200)"><rect x="244" y="168" width="36" height="7" rx="3" fill="#a77ad6"/><rect x="244" y="225" width="36" height="7" rx="3" fill="#a77ad6"/><path d="M250 175h24q0 18-12 25q12 7 12 25h-24q0-18 12-25q-12-7-12-25z" fill="#eef8ff" fill-opacity=".85" stroke="#c3b4e3" stroke-width="2"/><path d="M254 182h16q-2 9-8 13q-6-4-8-13zM262 204l-1 1v4q-8 3-10 15h22q-2-12-10-15z" fill="#ffcf70"/><path d="M262 197v8" stroke="#ffcf70" stroke-width="1.5"/></g>`,
        })[pid]}
        <ellipse cx="${up?252:238}" cy="${up?202:234}" rx="12" ry="10" fill="url(#paw${u})" stroke="#e0d3ea" stroke-width="1.5"/>
      </g>
      ${cap?`<g class="kitten-cap" transform="rotate(-7 200 70)">
        <path d="M150 96Q152 66 200 64Q248 66 250 96Q200 84 150 96Z" fill="url(#cap${u})"/>
        <path d="M132 61L200 83L268 61L268 66L200 88L132 66Z" fill="#2e2556"/>
        <path d="M200 37L268 61L200 83L132 61Z" fill="url(#cap${u})"/>
        <path d="M200 41L258 61" stroke="#9d8fda" stroke-width="2" opacity=".6"/>
        <g class="kitten-tassel"><path d="M200 60Q236 62 262 64V92" stroke="#f3c55a" stroke-width="2.6" fill="none"/><path d="M257 90h10l2 14q-7 4-14 0z" fill="#f3c55a"/><path d="M260 94v10m4-10v10" stroke="#d9a73c" stroke-width="1.2"/></g>
        <circle cx="200" cy="60" r="4.5" fill="#f7cf6a"/>
      </g>`:''}
      </g>
      <g class="kitten-acc" filter="url(#soft${u})">
      ${layer('bell','acc7','<path d="M160 191q40 15 80 0" stroke="#9d86d4" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M162 189q38 13 76 0" stroke="#cbbcf0" stroke-width="3.5" fill="none" stroke-linecap="round"/><g class="bellg"><circle cx="200" cy="205" r="11" fill="url(#gold${u})" stroke="#c9963f" stroke-width="1.5"/><path d="M195 208h10m-5 0v5" stroke="#ac8856" stroke-width="2"/><circle cx="197" cy="201" r="2.5" fill="#fff3ce"/></g>')}
      ${layer('ribbon','acc14','<path d="M262 108q-34-32-32 1q0 14 31 7q32 14 28-6q-2-19-27-2" fill="#ed99b3" stroke="#d783a0" stroke-width="2"/><path d="M240 104q8 6 18 6M282 104q-8 6-18 6" stroke="#c86f8f" stroke-width="2" fill="none" opacity=".6"/><ellipse cx="241" cy="98" rx="5" ry="3" fill="#fff" opacity=".55" transform="rotate(-25 241 98)"/><ellipse cx="278" cy="99" rx="4" ry="2.5" fill="#fff" opacity=".45"/><circle cx="261" cy="112" r="8" fill="#f7bccf" stroke="#d783a0" stroke-width="1.5"/><circle cx="258" cy="109" r="2.5" fill="#fff" opacity=".7"/>')}
      ${layer('scarf','acc21','<path d="M158 192q42 18 84 0" fill="none" stroke="#8fc9c0" stroke-width="15" stroke-linecap="round"/><path d="M226 201v26" stroke="#8fc9c0" stroke-width="16" stroke-linecap="round"/><path d="M219 223h14" stroke="#d6f0e8" stroke-width="4"/><path d="M160 196q40 16 80 0" stroke="#6fb0a6" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/><path d="M168 186q32 12 64 0" stroke="#c6ece4" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="3 5"/><path d="M226 206v14" stroke="#b5e3da" stroke-width="3" stroke-dasharray="3 4"/>')}
      ${layer('crown','acc30','<path d="M171 80l-8-31 23 16 14-28 14 28 23-16-8 31z" fill="url(#gold${u})" stroke="#c9963f" stroke-width="2"/><rect x="170" y="74" width="60" height="7" rx="3" fill="#e9b04f"/><circle cx="200" cy="68" r="5" fill="#f58fb0" stroke="#fff" stroke-width="1"/><circle cx="183" cy="74" r="3" fill="#7fd8bd"/><circle cx="217" cy="74" r="3" fill="#8fb8f0"/><path d="M178 60l4 12" stroke="#fff6d6" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>')}
      </g>
    </g></g>
    ${layer('bowl','item1','<ellipse cx="91" cy="265" rx="25" ry="8" fill="#b5cfe4"/><path d="M65 255h52l-5 11q-22 9-43-1z" fill="#abc6e2"/><ellipse cx="91" cy="255" rx="26" ry="8" fill="#e6f2ff"/><ellipse cx="91" cy="255" rx="20" ry="5" fill="#fffdf3"/>')}
    ${layer('yarn','item3','<circle cx="336" cy="265" r="17" fill="#b9a5dd"/><path d="M325 253q3 18 23 20m-30-6q20-17 28-10m-11-8q-4 19 10 30q15 10 28-2" stroke="#957ebe" stroke-width="2" fill="none"/>')}
    ${layer('fish','item5','<g transform="translate(48 220) rotate(-12)"><ellipse rx="18" ry="9" fill="#f3b1ab"/><path d="M15 0l12-9v18z" fill="#f3b1ab"/><circle cx="-10" cy="-2" r="2" fill="#806664"/></g>')}
    ${layer('plant','item9','<path d="M358 227v-34" stroke="#7dab91" stroke-width="4"/><ellipse cx="348" cy="199" rx="9" ry="16" fill="#a8cfb3" transform="rotate(-35 348 199)"/><ellipse cx="368" cy="190" rx="9" ry="16" fill="#88bca0" transform="rotate(32 368 190)"/><path d="M341 219h35l-5 30h-25z" fill="#efa79c"/><path d="M345 225h27" stroke="#ffd2c7" stroke-width="4"/>')}
    ${layer('music','item25','<rect x="24" y="173" width="36" height="27" rx="7" fill="#e4b786"/><path d="M30 180h25" stroke="#f7dcba" stroke-width="3"/><path d="M39 164v-18l13-3v16m-13 4q-11-4-9 3q3 6 9-3m13-4q-10-4-9 3q3 6 9-3" fill="#9e88b9"/>')}
    ${this.pdecor(rewards,pid,'floor')}
    <g class="pat-hearts" ${happy?'':'hidden="hidden" style="display:none"'} fill="#ef9bb6"><path d="M105 86q-15-18-23-5q-7 12 23 27q28-19 20-29q-10-10-20 7"/><path d="M299 150q-9-12-15-3q-4 8 15 18q18-12 13-19q-7-6-13 4"/></g>
    </svg>`;
  }
};
