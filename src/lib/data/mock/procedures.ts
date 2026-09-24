import type { Procedure, ProcedureCategory } from "../types";

export const categories: ProcedureCategory[] = [
  { slug: "lifting", name: "리프팅", nameEn: "Lifting", description: "처진 윤곽과 탄력을 위한 리프팅" },
  { slug: "botox", name: "보톡스", nameEn: "Botox", description: "주름 · 윤곽 · 바디 보톡스" },
  { slug: "filler", name: "필러", nameEn: "Filler", description: "볼륨과 라인을 채우는 필러" },
  { slug: "skin-booster", name: "스킨부스터", nameEn: "Skin Booster", description: "피부 속부터 채우는 스킨부스터" },
  { slug: "toning", name: "색소 · 토닝", nameEn: "Toning", description: "기미 · 잡티 · 착색 개선" },
  { slug: "skin-care", name: "피부관리", nameEn: "Skin Care", description: "진정 · 보습 · 결 관리" },
  { slug: "scar-pore", name: "흉터 · 모공", nameEn: "Scar & Pore", description: "흉터와 모공을 위한 레이저" },
  { slug: "acne", name: "여드름", nameEn: "Acne", description: "여드름 단계별 관리" },
  { slug: "injection", name: "주사", nameEn: "Injection", description: "영양 · 미백 · 바디 주사" },
  { slug: "hair-removal", name: "제모", nameEn: "Hair Removal", description: "여성 · 남성 레이저제모" },
  { slug: "tattoo-removal", name: "문신제거", nameEn: "Tattoo Removal", description: "눈썹 · 아이라인 문신제거" },
];

const p = (categorySlug: string, slug: string, name: string, isSignature = false): Procedure => ({
  categorySlug,
  slug,
  name,
  isSignature,
  prices: [],
});

export const procedures: Procedure[] = [
  p("lifting", "coolsonic", "쿨소닉", true),
  p("lifting", "coolphase", "쿨페이즈", true),
  p("lifting", "shrink-universe", "슈링크 유니버스"),
  p("lifting", "potenza", "포텐자"),
  p("lifting", "clarity-inner-lifting", "클라리티 이너리프팅"),
  p("lifting", "thread-lifting", "실리프팅 (민트실 · 잼버실)"),

  p("botox", "wrinkle-botox", "표정주름 보톡스"),
  p("botox", "jaw-botox", "턱 보톡스"),
  p("botox", "super-jaw-botox", "슈퍼턱 보톡스"),
  p("botox", "special-area-botox", "특수부위 보톡스 (측두근 · 입꼬리 · 팔자)"),
  p("botox", "skin-botox", "스킨보톡스"),
  p("botox", "trapezius-botox", "승모근 보톡스"),
  p("botox", "calf-botox", "종아리 보톡스"),
  p("botox", "hyperhidrosis-botox", "겨드랑이 다한증 보톡스"),

  p("filler", "volume-filler", "볼륨필러", true),
  p("filler", "forehead-filler", "이마 필러"),
  p("filler", "nasolabial-filler", "팔자 필러"),
  p("filler", "lip-filler", "입술 필러"),
  p("filler", "aegyo-filler", "애교 필러"),
  p("filler", "upper-eyelid-filler", "상안검 필러"),
  p("filler", "deep-wrinkle-filler", "깊은주름 필러"),
  p("filler", "neck-wrinkle-filler", "목주름 필러"),

  p("skin-booster", "rejuran-healer", "리쥬란힐러"),
  p("skin-booster", "rejuran-eye", "리쥬란아이"),
  p("skin-booster", "juvelook-skin", "쥬베룩스킨"),
  p("skin-booster", "exosome-isce", "엑소좀 (ISCE)"),
  p("skin-booster", "ultracol", "울트라콜"),
  p("skin-booster", "retuo", "리투오", true),
  p("skin-booster", "ibps-booster-peel", "IBPS 부스터필"),

  p("toning", "pico-toning", "피코토닝 (듀얼토닝)"),
  p("toning", "body-toning", "바디 착색토닝"),
  p("toning", "toning-package", "토닝레이저 패키지"),

  p("skin-care", "ldm", "LDM 물방울 초음파"),
  p("skin-care", "aqua-peel", "아쿠아필링"),
  p("skin-care", "vitamin-ionto", "비타민 이온토"),
  p("skin-care", "cryocell", "크라이오셀"),

  p("scar-pore", "fraxel", "프락셀"),
  p("scar-pore", "pico-fraxel", "피코 프락셀"),
  p("scar-pore", "black-peel", "블랙필"),

  p("acne", "acne-program", "아크네 프로그램"),
  p("acne", "acne-ibps-booster-peel", "아크네 IBPS 부스터필"),
  p("acne", "acne-extraction", "여드름 압출관리"),
  p("acne", "ga-scaling", "GA 스켈링"),

  p("injection", "vitamin-injection", "비타민주사"),
  p("injection", "super-baekok-injection", "슈퍼백옥주사"),
  p("injection", "cinderella-injection", "신데렐라주사"),
  p("injection", "anti-inflammatory-injection", "염증주사"),
  p("injection", "hyalase-injection", "히알라제주사"),
  p("injection", "lipolysis-injection", "지방분해주사"),
  p("injection", "liz-v-fit-injection", "리즈V핏주사"),

  p("hair-removal", "women-laser-hair-removal", "여성 레이저제모"),
  p("hair-removal", "men-laser-hair-removal", "남성 레이저제모"),

  p("tattoo-removal", "eyebrow-tattoo-removal", "눈썹 문신제거"),
  p("tattoo-removal", "eyeliner-tattoo-removal", "아이라인 · 언더라인 문신제거"),
];
