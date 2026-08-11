// 수학일기장 에피소드 데이터 — 야간 파이프라인이 매일 append.
// pw: 오늘의 암호의 SHA-256 hex (소문자·공백제거 후 해시). null이면 암호 코너 숨김.
const DIARY = [
  { day: 1, date: "2026-08-06", topic: "도형의 방정식 복습 6제", youtube: "N4H-tYQL8CY", pw: null },
  { day: 2, date: "2026-08-07", topic: "도형의 방정식 복습", youtube: "cDncrjbnbmQ", pw: "2c4930ad509e4bdce9b3914d6b8b6c8fc20e6c308505e78fe4b150123b35525b" },
  { day: 3, date: "2026-08-08", topic: "도형의 방정식 복습 — 직선족·넓이 이등분", youtube: "yK3I9VaPT8k", pw: "51d24d240d60bc95cc9bfae3146c573382d5b7268032030d9f0691ef25778d43" },
  { day: 4, date: "2026-08-10", topic: "도형의 방정식 복습 — 수직조건·내접원", youtube: "N2W_osAVFjs", pw: "c11d77021b21f5b26b22bb8feae99425fb61eb06de4edf619788b2f01aa034a9" },
  { day: 5, date: "2026-08-11", topic: "도형의 방정식 복습 — 파푸스 중선정리·외심", youtube: "cVeBOwJxpo0", pw: "11fe7c76025a236aaccf9a633262826e48866cc9661fbacfbfd22339a57a9a58" },
];
