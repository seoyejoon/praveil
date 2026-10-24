// 시술 가격 (인천 지역 시세 참고, 1회 · 시작가 · 부가세 별도)을 관리자 DB에 등록
// 서버에서: node --env-file=/opt/psbox-admin-only/.env.local seed-prices.mjs
//  - 관리자에서 이미 가격을 넣은 시술은 건드리지 않음 (비어 있는 것만 채움)
//  - 이후 수정은 관리자 > 시술 가격에서
import pg from "pg";

const row = (label, price, note = "") => ({ label, price, note });
const KR = "국산";
const IMP = "수입";

/** slug → 가격 줄 */
const prices = {
  // 리프팅
  coolsonic: [row("300샷", "20만원~"), row("600샷", "35만원~")],
  coolphase: [row("300샷", "39만원~"), row("600샷", "69만원~")],
  "shrink-universe": [row("300샷", "15만원~"), row("600샷", "27만원~")],
  potenza: [row("얼굴 전체 1회", "20만원~")],
  "clarity-inner-lifting": [row("얼굴 전체 1회", "15만원~")],
  "thread-lifting": [
    row("민트실", "50만원~", "개수 · 부위별 상이"),
    row("잼버실", "30만원~", "개수 · 부위별 상이"),
  ],

  // 필러 (1cc)
  "volume-filler": [row(`${KR} 1cc`, "15만원~"), row(`${IMP} 1cc`, "35만원~")],
  "forehead-filler": [
    row(`${KR} 1cc`, "15만원~"),
    row(`${IMP} 1cc`, "35만원~"),
  ],
  "nasolabial-filler": [
    row(`${KR} 1cc`, "15만원~"),
    row(`${IMP} 1cc`, "35만원~"),
  ],
  "lip-filler": [row(`${KR} 1cc`, "18만원~"), row(`${IMP} 1cc`, "35만원~")],
  "aegyo-filler": [row(`${KR} 1cc`, "18만원~"), row(`${IMP} 1cc`, "35만원~")],
  "upper-eyelid-filler": [row("1cc", "25만원~")],
  "deep-wrinkle-filler": [
    row(`${KR} 1cc`, "15만원~"),
    row(`${IMP} 1cc`, "35만원~"),
  ],
  "neck-wrinkle-filler": [row("1cc", "25만원~")],

  // 보톡스
  "wrinkle-botox": [
    row(`${KR} 1부위`, "2만원~"),
    row(`${IMP} 1부위`, "7만원~"),
  ],
  "jaw-botox": [row(`${KR} 1회`, "3만원~"), row(`${IMP} 1회`, "15만원~")],
  "super-jaw-botox": [row(`${KR} 1회`, "7만원~"), row(`${IMP} 1회`, "25만원~")],
  "special-area-botox": [
    row(`${KR} 1부위`, "3만원~"),
    row(`${IMP} 1부위`, "8만원~"),
  ],
  "skin-botox": [
    row(`${KR} 얼굴 전체`, "15만원~"),
    row(`${IMP} 얼굴 전체`, "35만원~"),
  ],
  "trapezius-botox": [
    row(`${KR} 1회`, "10만원~"),
    row(`${IMP} 1회`, "30만원~"),
  ],
  "calf-botox": [row(`${KR} 1회`, "15만원~"), row(`${IMP} 1회`, "40만원~")],
  "hyperhidrosis-botox": [
    row(`${KR} 양쪽 겨드랑이`, "20만원~"),
    row(`${IMP} 양쪽 겨드랑이`, "45만원~"),
  ],

  // 스킨부스터 · 콜라겐부스터
  retuo: [row("1회", "60만원~")],
  "rejuran-healer": [row("2cc", "22만원~")],
  "exosome-isce": [row("1회", "15만원~")],
  "juvelook-skin": [row("1회", "30만원~")],
  ultracol: [row("1회", "35만원~")],

  // 여드름 · 모공
  "acne-program": [row("1회", "10만원~")],
  "acne-extraction": [row("1회", "5만원~")],
  "ga-scaling": [row("1회", "5만원~")],
  "acne-ibps-booster-peel": [row("1회", "10만원~")],
  "black-peel": [row("1회", "10만원~")],
  fraxel: [row("얼굴 전체 1회", "15만원~")],
  "pico-fraxel": [row("얼굴 전체 1회", "15만원~")],

  // 제모 · 문신제거
  "women-laser-hair-removal": [
    row("겨드랑이 1회", "5만원~"),
    row("인중 · 턱 1회", "5만원~"),
    row("팔 · 다리 1회", "15만원~"),
  ],
  "men-laser-hair-removal": [
    row("인중 · 턱 1회", "10만원~"),
    row("얼굴 전체 1회", "15만원~"),
  ],
  "eyebrow-tattoo-removal": [row("1회", "8만원~")],
  "eyeliner-tattoo-removal": [row("1회", "10만원~")],
};

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const { rows } = await client.query(
    "SELECT id FROM hospitals WHERE status='active' ORDER BY id LIMIT 1",
  );
  if (!rows[0]) throw new Error("활성 병원이 없습니다.");
  const h = rows[0].id;
  let filled = 0;
  const kept = [];
  const missing = [];
  for (const [slug, list] of Object.entries(prices)) {
    const r = await client.query(
      `UPDATE praveil_procedures SET prices = $3::jsonb
       WHERE hospital_id = $1 AND slug = $2
         AND (prices IS NULL OR jsonb_array_length(prices::jsonb) = 0)
       RETURNING slug`,
      [h, slug, JSON.stringify(list)],
    );
    if (r.rowCount) filled++;
    else {
      const e = await client.query(
        "SELECT 1 FROM praveil_procedures WHERE hospital_id = $1 AND slug = $2",
        [h, slug],
      );
      (e.rowCount ? kept : missing).push(slug);
    }
  }
  console.log(`가격 등록 ${filled}건`);
  if (kept.length) console.log(`이미 가격 있음(그대로 둠): ${kept.join(", ")}`);
  if (missing.length) console.log(`DB에 시술 없음: ${missing.join(", ")}`);
  // 리쥬란아이는 취급하지 않으므로 숨김
  const hid = await client.query(
    "UPDATE praveil_procedures SET visible = false WHERE hospital_id = $1 AND slug = 'rejuran-eye' AND visible RETURNING slug",
    [h],
  );
  if (hid.rowCount) console.log("리쥬란아이 숨김");
} finally {
  await client.end();
}
