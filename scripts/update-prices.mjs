// 병원 가격표(2026-10-31 수정본)로 관리자 DB 시술 가격을 바꿈 (일회용, 실행 후 삭제)
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local update-prices.mjs
//  - 가격은 모두 덮어씀 · 이름 바뀐 시술 4개 수정 · 눈밑 필러 추가
import pg from "pg";

const prices = {
  coolsonic: [
    {
      label: "3000샷 · 1회",
      price: "700,000원",
      note: "",
    },
    {
      label: "7000샷 · 1회",
      price: "1,390,000원",
      note: "",
    },
    {
      label: "눈가 · 이마 · 팔자 전용팁 1000샷 · 1회",
      price: "290,000원",
      note: "",
    },
  ],
  coolphase: [
    {
      label: "300샷 · 1회",
      price: "700,000원",
      note: "",
    },
    {
      label: "300샷 + 쿨소닉 3000샷 · 1회",
      price: "1,260,000원",
      note: "",
    },
    {
      label: "600샷 · 1회",
      price: "1,250,000원",
      note: "",
    },
    {
      label: "600샷 + 쿨소닉 7000샷 · 1회",
      price: "2,350,000원",
      note: "",
    },
  ],
  "shrink-universe": [
    {
      label: "부스터 100샷",
      price: "49,000원",
      note: "",
    },
    {
      label: "부스터 300샷",
      price: "120,000원",
      note: "",
    },
    {
      label: "부스터 600샷",
      price: "190,000원",
      note: "",
    },
    {
      label: "울트라F 100샷",
      price: "39,000원",
      note: "",
    },
    {
      label: "울트라F 300샷",
      price: "99,000원",
      note: "",
    },
    {
      label: "울트라F 600샷",
      price: "163,000원",
      note: "",
    },
  ],
  potenza: [
    {
      label: "1회",
      price: "240,000원",
      note: "",
    },
    {
      label: "3회",
      price: "650,000원",
      note: "",
    },
    {
      label: "5회",
      price: "990,000원",
      note: "",
    },
    {
      label: "포텐자 + PDRN주사 + 재생관리 3회",
      price: "780,000원",
      note: "",
    },
    {
      label: "포텐자 + PDRN주사 + 재생관리 5회",
      price: "1,160,000원",
      note: "",
    },
    {
      label: "포텐자 + PDRN주사 1회",
      price: "290,000원",
      note: "",
    },
    {
      label: "포텐자 + 클라리티 + 물광주사 + 재생관리 3회",
      price: "910,000원",
      note: "",
    },
    {
      label: "포텐자 + 클라리티 + 물광주사 + 재생관리 5회",
      price: "1,360,000원",
      note: "",
    },
    {
      label: "포텐자 + 클라리티 + 물광주사 1회",
      price: "340,000원",
      note: "",
    },
    {
      label: "포텐자 + 클라리티 + 재생관리 3회",
      price: "780,000원",
      note: "",
    },
    {
      label: "포텐자 + 클라리티 + 재생관리 5회",
      price: "1,160,000원",
      note: "",
    },
    {
      label: "포텐자 + 클라리티 1회",
      price: "290,000원",
      note: "",
    },
    {
      label: "펌핑팁 엑소좀 패키지 · 1회",
      price: "390,000원",
      note: "",
    },
    {
      label: "펌핑팁 엑소좀 패키지 · 3회",
      price: "1,050,000원",
      note: "",
    },
    {
      label: "펌핑팁 엑소좀 패키지 · 5회",
      price: "1,560,000원",
      note: "",
    },
    {
      label: "펌핑팁 울트라콜100 · 1회",
      price: "490,000원",
      note: "",
    },
    {
      label: "펌핑팁 울트라콜100 패키지 · 3회",
      price: "1,320,000원",
      note: "",
    },
    {
      label: "펌핑팁 울트라콜100 패키지 · 5회",
      price: "1,960,000원",
      note: "",
    },
    {
      label: "펌핑팁 쥬베룩 패키지 · 1회",
      price: "590,000원",
      note: "",
    },
    {
      label: "펌핑팁 쥬베룩 패키지 · 3회",
      price: "1,590,000원",
      note: "",
    },
    {
      label: "펌핑팁 쥬베룩 패키지 · 5회",
      price: "2,360,000원",
      note: "",
    },
    {
      label: "팁 추가 · RF팁",
      price: "40,000원",
      note: "",
    },
    {
      label: "팁 추가 · 펌핑팁",
      price: "60,000원",
      note: "",
    },
  ],
  "clarity-inner-lifting": [
    {
      label: "3000샷 + LDM재생관리 + PDRN · 3회",
      price: "800,000원",
      note: "",
    },
  ],
  "thread-lifting": [
    {
      label: "QTL실 1줄",
      price: "79,000원",
      note: "",
    },
    {
      label: "잼버실 1줄",
      price: "100,000원",
      note: "",
    },
  ],
  "wrinkle-botox": [
    {
      label: "뉴럭스",
      price: "10,000원",
      note: "",
    },
    {
      label: "코어톡스",
      price: "35,000원",
      note: "",
    },
    {
      label: "제오민",
      price: "70,000원",
      note: "",
    },
  ],
  "jaw-botox": [
    {
      label: "뉴럭스",
      price: "19,000원",
      note: "",
    },
    {
      label: "코어톡스",
      price: "50,000원",
      note: "",
    },
    {
      label: "제오민",
      price: "90,000원",
      note: "",
    },
  ],
  "super-jaw-botox": [
    {
      label: "뉴럭스",
      price: "38,000원",
      note: "",
    },
    {
      label: "코어톡스",
      price: "80,000원",
      note: "",
    },
    {
      label: "제오민",
      price: "120,000원",
      note: "",
    },
  ],
  "special-area-botox": [
    {
      label: "뉴럭스",
      price: "30,000원",
      note: "",
    },
    {
      label: "코어톡스",
      price: "70,000원",
      note: "",
    },
    {
      label: "제오민",
      price: "90,000원",
      note: "",
    },
  ],
  "skin-botox": [
    {
      label: "뉴럭스",
      price: "200,000원",
      note: "",
    },
    {
      label: "코어톡스",
      price: "270,000원",
      note: "",
    },
    {
      label: "제오민",
      price: "320,000원",
      note: "",
    },
    {
      label: "부분스킨보톡스 · 뉴럭스",
      price: "120,000원",
      note: "",
    },
    {
      label: "부분스킨보톡스 · 코어톡스",
      price: "162,000원",
      note: "",
    },
    {
      label: "부분스킨보톡스 · 제오민",
      price: "192,000원",
      note: "",
    },
  ],
  "trapezius-botox": [
    {
      label: "100U · 뉴럭스",
      price: "75,000원",
      note: "",
    },
    {
      label: "100U · 코어톡스",
      price: "130,000원",
      note: "",
    },
    {
      label: "100U · 제오민",
      price: "200,000원",
      note: "",
    },
    {
      label: "200U · 뉴럭스",
      price: "140,000원",
      note: "",
    },
  ],
  "calf-botox": [
    {
      label: "100U · 뉴럭스",
      price: "75,000원",
      note: "",
    },
    {
      label: "100U · 코어톡스",
      price: "130,000원",
      note: "",
    },
    {
      label: "100U · 제오민",
      price: "200,000원",
      note: "",
    },
    {
      label: "200U · 뉴럭스",
      price: "140,000원",
      note: "",
    },
  ],
  "hyperhidrosis-botox": [
    {
      label: "100U · 뉴럭스",
      price: "138,000원",
      note: "",
    },
    {
      label: "100U · 코어톡스",
      price: "200,000원",
      note: "",
    },
    {
      label: "100U · 제오민",
      price: "270,000원",
      note: "",
    },
  ],
  "volume-filler": [
    {
      label: "뉴라미스 1cc",
      price: "139,000원",
      note: "",
    },
    {
      label: "레나 1cc",
      price: "89,000원",
      note: "",
    },
    {
      label: "레스틸렌 1cc",
      price: "250,000원",
      note: "",
    },
    {
      label: "벨로테로 1cc",
      price: "250,000원",
      note: "",
    },
    {
      label: "큐티필 1cc",
      price: "110,000원",
      note: "",
    },
  ],
  "forehead-filler": [
    {
      label: "뉴라미스 1cc",
      price: "139,000원",
      note: "",
    },
    {
      label: "레나 1cc",
      price: "89,000원",
      note: "",
    },
    {
      label: "레스틸렌 1cc",
      price: "250,000원",
      note: "",
    },
    {
      label: "벨로테로 1cc",
      price: "250,000원",
      note: "",
    },
    {
      label: "큐티필 1cc",
      price: "110,000원",
      note: "",
    },
  ],
  "nasolabial-filler": [
    {
      label: "뉴라미스 1cc",
      price: "139,000원",
      note: "",
    },
    {
      label: "레나 1cc",
      price: "89,000원",
      note: "",
    },
    {
      label: "레스틸렌 1cc",
      price: "250,000원",
      note: "",
    },
    {
      label: "벨로테로 1cc",
      price: "250,000원",
      note: "",
    },
    {
      label: "큐티필 1cc",
      price: "110,000원",
      note: "",
    },
  ],
  "lip-filler": [
    {
      label: "뉴라미스 1cc",
      price: "139,000원",
      note: "",
    },
    {
      label: "레나 1cc",
      price: "89,000원",
      note: "",
    },
    {
      label: "레스틸렌 1cc",
      price: "250,000원",
      note: "",
    },
    {
      label: "벨로테로 1cc",
      price: "250,000원",
      note: "",
    },
    {
      label: "큐티필 1cc",
      price: "110,000원",
      note: "",
    },
  ],
  "aegyo-filler": [
    {
      label: "뉴라미스",
      price: "139,000원",
      note: "",
    },
    {
      label: "레나",
      price: "89,000원",
      note: "",
    },
    {
      label: "레스틸렌",
      price: "250,000원",
      note: "",
    },
    {
      label: "벨로테로",
      price: "250,000원",
      note: "",
    },
    {
      label: "큐티필",
      price: "110,000원",
      note: "",
    },
  ],
  "under-eye-filler": [
    {
      label: "뉴라미스",
      price: "180,000원",
      note: "",
    },
    {
      label: "벨로테로 · 레스틸렌",
      price: "290,000원",
      note: "",
    },
  ],
  "upper-eyelid-filler": [
    {
      label: "뉴라미스 1cc",
      price: "190,000원",
      note: "",
    },
    {
      label: "레스틸렌 1cc",
      price: "300,000원",
      note: "",
    },
    {
      label: "벨로테로 1cc",
      price: "300,000원",
      note: "",
    },
  ],
  "deep-wrinkle-filler": [
    {
      label: "벨로테로",
      price: "300,000원",
      note: "",
    },
    {
      label: "뉴라미스",
      price: "190,000원",
      note: "",
    },
    {
      label: "레스틸렌",
      price: "300,000원",
      note: "",
    },
  ],
  "neck-wrinkle-filler": [
    {
      label: "레스틸렌 1cc",
      price: "300,000원",
      note: "",
    },
    {
      label: "벨로테로 1cc",
      price: "300,000원",
      note: "",
    },
  ],
  "rejuran-healer": [
    {
      label: "2cc (모델링 포함)",
      price: "180,000원",
      note: "",
    },
    {
      label: "2cc (인젝터 + 재생관리 + LED)",
      price: "200,000원",
      note: "",
    },
  ],
  "rejuran-eye": [
    {
      label: "눈가 · 입가 · 국소부위",
      price: "120,000원",
      note: "",
    },
  ],
  "juvelook-skin": [
    {
      label: "2cc",
      price: "250,000원",
      note: "",
    },
    {
      label: "3cc",
      price: "390,000원",
      note: "",
    },
    {
      label: "4cc",
      price: "500,000원",
      note: "",
    },
  ],
  "exosome-isce": [
    {
      label: "1회",
      price: "180,000원",
      note: "",
    },
    {
      label: "3회",
      price: "490,000원",
      note: "",
    },
  ],
  ultracol: [
    {
      label: "볼륨부스터 울트라콜200 · 2cc",
      price: "250,000원",
      note: "",
    },
    {
      label: "볼륨부스터 울트라콜200 · 4cc",
      price: "500,000원",
      note: "",
    },
    {
      label: "볼륨부스터 울트라콜200 · 6cc",
      price: "681,900원",
      note: "",
    },
    {
      label: "울트라콜100 · 2cc",
      price: "190,000원",
      note: "",
    },
    {
      label: "울트라콜100 · 3cc",
      price: "290,000원",
      note: "",
    },
    {
      label: "울트라콜100 · 4cc",
      price: "380,000원",
      note: "",
    },
  ],
  retuo: [
    {
      label: "1회",
      price: "600,000원",
      note: "",
    },
    {
      label: "3회",
      price: "1,590,000원",
      note: "",
    },
  ],
  "ibps-booster-peel": [
    {
      label: "1회",
      price: "80,000원",
      note: "",
    },
  ],
  "pico-toning": [
    {
      label: "듀얼토닝 10회",
      price: "790,000원",
      note: "",
    },
    {
      label: "싱글토닝 + 모델링 10회",
      price: "450,000원",
      note: "",
    },
    {
      label: "트리플토닝 10회 + 클라리티 이너리프팅 3회 + IBPS부스터필 3회",
      price: "1,290,000원",
      note: "",
    },
  ],
  "body-toning": [
    {
      label: "A부위 (겨드랑이 · 팔꿈치 · 무릎 · 복숭아뼈 · 꼬리뼈) 1부위 · 1회",
      price: "25,000원",
      note: "",
    },
    {
      label: "A부위 (겨드랑이 · 팔꿈치 · 무릎 · 복숭아뼈 · 꼬리뼈) 1부위 · 5회",
      price: "110,000원",
      note: "",
    },
    {
      label: "B부위 (유두 · 유륜 · 사타구니 · 엉덩이 밑) 1부위 · 1회",
      price: "35,000원",
      note: "",
    },
    {
      label: "B부위 (유두 · 유륜 · 사타구니 · 엉덩이 밑) 1부위 · 5회",
      price: "150,000원",
      note: "",
    },
  ],
  ldm: [
    {
      label: "1회",
      price: "79,000원",
      note: "",
    },
  ],
  "aqua-peel": [
    {
      label: "1회",
      price: "29,000원",
      note: "",
    },
  ],
  "vitamin-ionto": [
    {
      label: "1회",
      price: "50,000원",
      note: "",
    },
  ],
  cryocell: [
    {
      label: "1회",
      price: "50,000원",
      note: "",
    },
  ],
  fraxel: [
    {
      label: "1회",
      price: "100,000원",
      note: "",
    },
    {
      label: "부분 1회",
      price: "60,000원",
      note: "",
    },
  ],
  "pico-fraxel": [
    {
      label: "1회",
      price: "140,000원",
      note: "",
    },
    {
      label: "3회 (진정관리 포함)",
      price: "350,000원",
      note: "",
    },
  ],
  "black-peel": [
    {
      label: "1회",
      price: "90,000원",
      note: "",
    },
  ],
  "acne-program": [
    {
      label: "아크네 프리미엄 패키지",
      price: "550,000원",
      note: "",
    },
    {
      label: "아크네 베이직 프로그램",
      price: "250,000원",
      note: "",
    },
  ],
  "acne-ibps-booster-peel": [
    {
      label: "1회",
      price: "110,000원",
      note: "",
    },
  ],
  "acne-extraction": [
    {
      label: "1회",
      price: "70,000원",
      note: "",
    },
  ],
  "ga-scaling": [
    {
      label: "1회",
      price: "70,000원",
      note: "",
    },
  ],
  "vitamin-injection": [
    {
      label: "1회",
      price: "50,000원",
      note: "",
    },
  ],
  "super-baekok-injection": [
    {
      label: "1회",
      price: "50,000원",
      note: "",
    },
  ],
  "cinderella-injection": [
    {
      label: "1회",
      price: "50,000원",
      note: "",
    },
  ],
  "anti-inflammatory-injection": [
    {
      label: "1개",
      price: "10,000원",
      note: "",
    },
  ],
  "hyalase-injection": [
    {
      label: "1cc",
      price: "120,000원",
      note: "",
    },
  ],
  "lipolysis-injection": [
    {
      label: "국소부위 (팔뚝 · 브래지어밑군살 · 무릎위 · 샤넬라인) 1회",
      price: "170,000원",
      note: "",
    },
    {
      label: "국소부위 (팔뚝 · 브래지어밑군살 · 무릎위 · 샤넬라인) 4회",
      price: "500,000원",
      note: "",
    },
    {
      label: "국소부위 (팔뚝 · 브래지어밑군살 · 무릎위 · 샤넬라인) 8회",
      price: "800,000원",
      note: "",
    },
    {
      label: "복부 · 허벅지 1회",
      price: "290,000원",
      note: "",
    },
    {
      label: "복부 · 허벅지 4회",
      price: "800,000원",
      note: "",
    },
    {
      label: "복부 · 허벅지 8회",
      price: "1,200,000원",
      note: "",
    },
  ],
  "liz-v-fit-injection": [
    {
      label: "5cc",
      price: "50,000원",
      note: "",
    },
  ],
  "women-laser-hair-removal": [
    {
      label: "겨드랑이 · 인중",
      price: "70,000원",
      note: "1년 무제한",
    },
    {
      label: "이마 + 헤어라인",
      price: "150,000원",
      note: "1년 무제한",
    },
    {
      label: "얼굴전체",
      price: "290,000원",
      note: "1년 무제한",
    },
    {
      label: "팔상완",
      price: "250,000원",
      note: "1년 무제한",
    },
    {
      label: "팔하완",
      price: "250,000원",
      note: "1년 무제한",
    },
    {
      label: "팔전체",
      price: "450,000원",
      note: "1년 무제한",
    },
    {
      label: "종아리",
      price: "350,000원",
      note: "1년 무제한",
    },
    {
      label: "비키니라인",
      price: "350,000원",
      note: "1년 무제한",
    },
    {
      label: "무릎 · 발등+발가락 · 손등+손가락",
      price: "100,000원",
      note: "1년 무제한",
    },
    {
      label: "인중 · 겨드랑이",
      price: "50,000원",
      note: "5회 패키지",
    },
    {
      label: "겨드랑이제모 + 토닝",
      price: "150,000원",
      note: "5회 패키지",
    },
    {
      label: "얼굴전체",
      price: "200,000원",
      note: "5회 패키지",
    },
    {
      label: "이마 + 헤어라인",
      price: "110,000원",
      note: "5회 패키지",
    },
    {
      label: "종아리",
      price: "220,000원",
      note: "5회 패키지",
    },
    {
      label: "허벅지",
      price: "300,000원",
      note: "5회 패키지",
    },
    {
      label: "팔상완 · 하완",
      price: "190,000원",
      note: "5회 패키지",
    },
    {
      label: "팔전체",
      price: "350,000원",
      note: "5회 패키지",
    },
    {
      label: "무릎 · 손등+손가락 · 발등+발가락",
      price: "70,000원",
      note: "5회 패키지",
    },
    {
      label: "비키니라인",
      price: "290,000원",
      note: "5회 패키지",
    },
    {
      label: "배렛나루",
      price: "150,000원",
      note: "5회 패키지",
    },
  ],
  "men-laser-hair-removal": [
    {
      label: "인중 + 앞턱",
      price: "180,000원",
      note: "1년 무제한",
    },
    {
      label: "인중 + 앞턱 + 턱밑",
      price: "250,000원",
      note: "1년 무제한",
    },
    {
      label: "겨드랑이",
      price: "100,000원",
      note: "1년 무제한",
    },
    {
      label: "하관전체 (인중+앞턱+턱라인+턱밑+구렛나루+볼)",
      price: "390,000원",
      note: "1년 무제한",
    },
    {
      label: "앞목 · 뒷목",
      price: "100,000원",
      note: "1년 무제한",
    },
    {
      label: "제모 후 진정관리 (회당)",
      price: "10,000원",
      note: "1년 무제한",
    },
    {
      label: "인중 + 앞턱",
      price: "120,000원",
      note: "5회 패키지",
    },
    {
      label: "인중 + 앞턱 + 턱밑",
      price: "180,000원",
      note: "5회 패키지",
    },
    {
      label: "겨드랑이",
      price: "80,000원",
      note: "5회 패키지",
    },
    {
      label: "하관전체 (인중+앞턱+턱라인+턱밑+구렛나루+볼)",
      price: "290,000원",
      note: "5회 패키지",
    },
    {
      label: "앞목 · 뒷목",
      price: "70,000원",
      note: "5회 패키지",
    },
    {
      label: "팔상완 · 팔하완",
      price: "250,000원",
      note: "5회 패키지",
    },
    {
      label: "종아리",
      price: "350,000원",
      note: "5회 패키지",
    },
    {
      label: "허벅지",
      price: "400,000원",
      note: "5회 패키지",
    },
    {
      label: "무릎 · 손등+손가락 · 발등+발가락",
      price: "80,000원",
      note: "5회 패키지",
    },
    {
      label: "배렛나루",
      price: "200,000원",
      note: "5회 패키지",
    },
    {
      label: "배전체",
      price: "400,000원",
      note: "5회 패키지",
    },
    {
      label: "가슴제모",
      price: "500,000원",
      note: "5회 패키지",
    },
    {
      label: "제모 후 진정관리 (회당)",
      price: "10,000원",
      note: "5회 패키지",
    },
  ],
  "eyebrow-tattoo-removal": [
    {
      label: "눈썹",
      price: "150,000원",
      note: "",
    },
  ],
  "eyeliner-tattoo-removal": [
    {
      label: "아이라인",
      price: "100,000원",
      note: "",
    },
    {
      label: "언더라인",
      price: "100,000원",
      note: "",
    },
  ],
};

const rename = {
  "thread-lifting": "실리프팅 (QTL실 · 잼버실)",
  "super-baekok-injection": "백옥주사",
  "lipolysis-injection": "PRAFIT BODY (바디 지방분해주사)",
  "liz-v-fit-injection": "PRAFIT FACE (얼굴 지방분해주사)",
  "ga-scaling": "GA 스케일링",
};

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query("BEGIN");
  const { rows } = await client.query(
    "SELECT id FROM hospitals WHERE status='active' ORDER BY id LIMIT 1",
  );
  if (!rows[0]) throw new Error("활성 병원이 없습니다.");
  const h = rows[0].id;

  // 눈밑 필러: 애교 필러 바로 뒤 (같은 순서값 + 나중 id)
  const add = await client.query(
    `INSERT INTO praveil_procedures (hospital_id, category_slug, slug, name, is_signature, sort_order, memo)
     SELECT hospital_id, category_slug, 'under-eye-filler', '눈밑 필러', false, sort_order, ''
     FROM praveil_procedures
     WHERE hospital_id = $1 AND slug = 'aegyo-filler'
       AND NOT EXISTS (SELECT 1 FROM praveil_procedures WHERE hospital_id = $1 AND slug = 'under-eye-filler')
     RETURNING slug`,
    [h],
  );
  if (add.rowCount) console.log("눈밑 필러 추가");

  for (const [slug, name] of Object.entries(rename)) {
    const r = await client.query(
      "UPDATE praveil_procedures SET name = $3 WHERE hospital_id = $1 AND slug = $2",
      [h, slug, name],
    );
    console.log(`이름 ${slug}: ${r.rowCount ? "수정" : "없음"}`);
  }

  let n = 0;
  const missing = [];
  for (const [slug, list] of Object.entries(prices)) {
    const r = await client.query(
      "UPDATE praveil_procedures SET prices = $3::jsonb WHERE hospital_id = $1 AND slug = $2",
      [h, slug, JSON.stringify(list)],
    );
    if (r.rowCount) n++;
    else missing.push(slug);
  }
  if (missing.length) throw new Error(`DB에 시술 없음: ${missing.join(", ")}`);
  await client.query("COMMIT");
  console.log(`가격 수정 ${n}건`);
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  await client.end();
}
