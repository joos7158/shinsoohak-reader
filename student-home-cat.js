/* Code-native illustration: same earned item IDs, a new character and room. */
window.CuteCat = {
  art(rewards, evening=false, happy=false) {
    const show=id=>rewards.accessory===id||rewards.decorations.includes(id);
    const layer=(id,part,svg)=>`<g data-cat="${part}" ${show(id)?'':'hidden="hidden"'}>${svg}</g>`;
    return `<svg class="roomsvg cute-room ${happy?'is-happy':''}" viewBox="0 0 400 300" role="img" aria-label="볼이 발그레한 아기 고양이와 내가 꾸민 작은 방">
    <rect width="400" height="300" rx="28" fill="${evening?'#e7e1f6':'#fff3e9'}"/>
    <path d="M0 223 Q200 204 400 223 V300 H0Z" fill="#e9e3f9"/>
    <path d="M25 226H375" stroke="#d7cfea" stroke-width="2"/>
    <rect x="287" y="26" width="80" height="103" rx="38" fill="#fff" stroke="#f4d8c4" stroke-width="7"/>
    <path d="M295 79V64A32 32 0 0 1 359 64V119H295Z" fill="${evening?'#b7afd9':'#cde8ef'}"/>
    <circle cx="337" cy="55" r="13" fill="${evening?'#fff4ca':'#ffda8c'}"/>
    <path d="M327 29V123M290 81H365" stroke="#fff" stroke-width="5"/>
    <path d="M40 54h90" stroke="#ddc7b7" stroke-width="7" stroke-linecap="round"/>
    <rect x="51" y="27" width="15" height="24" rx="3" fill="#e1c5eb" transform="rotate(-8 58 39)"/><rect x="70" y="22" width="14" height="29" rx="3" fill="#add9cc"/><rect x="87" y="32" width="19" height="19" rx="3" fill="#ffd394"/>
    <g fill="#ead7ce"><circle cx="153" cy="35" r="3"/><circle cx="269" cy="153" r="3"/><path d="M44 129l3-7 3 7 7 3-7 3-3 7-3-7-7-3z"/></g>
    ${layer('frame','item12','<rect x="31" y="73" width="52" height="55" rx="8" fill="#dfb391"/><rect x="36" y="78" width="42" height="45" rx="5" fill="#fffaf2"/><path d="M46 100q-5-15 11-8q16-7 11 8l-11 12z" fill="#f6a9ba"/>')}
    <ellipse cx="204" cy="257" rx="118" ry="19" fill="#d1c5e7" opacity=".5"/>
    ${layer('rug','item18','<ellipse cx="201" cy="264" rx="166" ry="28" fill="#e5f0df"/><ellipse cx="201" cy="264" rx="149" ry="20" fill="none" stroke="#b9d6b3" stroke-width="3" stroke-dasharray="5 8"/>')}
    ${layer('cushion','item2','<ellipse cx="196" cy="251" rx="86" ry="25" fill="#eba6be"/><ellipse cx="196" cy="246" rx="82" ry="22" fill="#ffd0df"/><path d="M130 247q66 18 132 0" fill="none" stroke="#f4b5cb" stroke-width="2"/>')}
    <g class="kitten">
    <path class="kitten-tail" d="M264 224q56 10 43-34q-6-13-14-1q-5 12-20 9" fill="#f8cead" stroke="#edbb98" stroke-width="2"/>
    <ellipse cx="199" cy="207" rx="65" ry="49" fill="#ffdfbd" stroke="#edbd9d" stroke-width="2"/>
    <ellipse cx="199" cy="215" rx="40" ry="34" fill="#fff4e1"/>
    <ellipse cx="162" cy="245" rx="23" ry="13" fill="#fff0d8" stroke="#edbd9d" stroke-width="2"/><ellipse cx="234" cy="245" rx="23" ry="13" fill="#fff0d8" stroke="#edbd9d" stroke-width="2"/>
    <path d="M129 117Q102 37 145 60L171 88M229 87L261 59Q292 44 275 119" fill="#ffdfbd" stroke="#edbd9d" stroke-width="3" stroke-linejoin="round"/>
    <path d="M131 98L124 68Q135 67 151 90M252 90L269 69L266 102" fill="#f3acb1"/>
    <path d="M116 128Q119 78 196 80Q276 76 283 126Q300 182 243 194Q194 207 147 190Q105 179 116 128" fill="#ffe6c8" stroke="#edbd9d" stroke-width="2.5"/>
    <path d="M180 82l6 17M198 80v17M216 81l-5 18" stroke="#f1bf92" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="143" cy="157" rx="18" ry="10" fill="#f4acb2" opacity=".7"/><ellipse cx="255" cy="157" rx="18" ry="10" fill="#f4acb2" opacity=".7"/>
    <g class="kitten-eyes"><ellipse cx="161" cy="139" rx="8" ry="11" fill="#604e50"/><ellipse cx="236" cy="139" rx="8" ry="11" fill="#604e50"/><circle cx="158" cy="135" r="2.5" fill="white"/><circle cx="233" cy="135" r="2.5" fill="white"/></g>
    <path d="M194 153q5-4 10 0l-5 5z" fill="#b6807f"/><path d="M199 158q-1 13-12 5m12-5q1 13 12 5" stroke="#896566" fill="none" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M122 145l-14-3m15 10-14 2m164-9 15-3m-14 11 14 2" stroke="#d0a087" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="155" cy="209" rx="15" ry="20" fill="#ffead0" transform="rotate(-22 155 209)"/><ellipse cx="243" cy="208" rx="15" ry="20" fill="#ffead0" transform="rotate(22 243 208)"/>
    ${layer('bell','acc7','<path d="M158 190q41 17 82 0" stroke="#b4a0df" stroke-width="9" fill="none" stroke-linecap="round"/><g class="bellg"><circle cx="200" cy="202" r="11" fill="#ffcf70" stroke="#deb46b" stroke-width="2"/><path d="M195 205h10m-5 0v5" stroke="#ac8856" stroke-width="2"/><circle cx="197" cy="198" r="2.5" fill="#fff3ce"/></g>')}
    ${layer('ribbon','acc14','<path d="M255 94q-34-32-32 1q0 14 31 7q32 14 28-6q-2-19-27-2" fill="#ed99b3" stroke="#d783a0" stroke-width="2"/><circle cx="254" cy="98" r="8" fill="#f7bccf"/>')}
    ${layer('scarf','acc21','<path d="M157 188q42 18 84 0" fill="none" stroke="#8fc9c0" stroke-width="15" stroke-linecap="round"/><path d="M222 197v36" stroke="#8fc9c0" stroke-width="16" stroke-linecap="round"/><path d="M215 229h14" stroke="#d6f0e8" stroke-width="4"/>')}
    ${layer('crown','acc30','<path d="M173 82l-8-29 22 15 13-26 14 26 21-15-8 29z" fill="#ffce70" stroke="#e2ac55" stroke-width="2"/><circle cx="200" cy="71" r="5" fill="#f5aabd"/>')}
    </g>
    ${layer('bowl','item1','<ellipse cx="91" cy="265" rx="25" ry="8" fill="#b5cfe4"/><path d="M65 255h52l-5 11q-22 9-43-1z" fill="#abc6e2"/><ellipse cx="91" cy="255" rx="26" ry="8" fill="#e6f2ff"/><ellipse cx="91" cy="255" rx="20" ry="5" fill="#fffdf3"/>')}
    ${layer('yarn','item3','<circle cx="312" cy="263" r="17" fill="#b9a5dd"/><path d="M301 251q3 18 23 20m-30-6q20-17 28-10m-11-8q-4 19 10 30q15 10 28-2" stroke="#957ebe" stroke-width="2" fill="none"/>')}
    ${layer('fish','item5','<g transform="translate(48 220) rotate(-12)"><ellipse rx="18" ry="9" fill="#f3b1ab"/><path d="M15 0l12-9v18z" fill="#f3b1ab"/><circle cx="-10" cy="-2" r="2" fill="#806664"/></g>')}
    ${layer('plant','item9','<path d="M348 227v-34" stroke="#7dab91" stroke-width="4"/><ellipse cx="338" cy="199" rx="9" ry="16" fill="#a8cfb3" transform="rotate(-35 338 199)"/><ellipse cx="358" cy="190" rx="9" ry="16" fill="#88bca0" transform="rotate(32 358 190)"/><path d="M331 219h35l-5 30h-25z" fill="#efa79c"/><path d="M335 225h27" stroke="#ffd2c7" stroke-width="4"/>')}
    ${layer('music','item25','<rect x="24" y="173" width="36" height="27" rx="7" fill="#e4b786"/><path d="M30 180h25" stroke="#f7dcba" stroke-width="3"/><path d="M39 164v-18l13-3v16m-13 4q-11-4-9 3q3 6 9-3m13-4q-10-4-9 3q3 6 9-3" fill="#9e88b9"/>')}
    <g class="pat-hearts" ${happy?'':'hidden="hidden"'} fill="#ef9bb6"><path d="M105 86q-15-18-23-5q-7 12 23 27q28-19 20-29q-10-10-20 7"/><path d="M289 104q-9-12-15-3q-4 8 15 18q18-12 13-19q-7-6-13 4"/></g>
    </svg>`;
  }
};
