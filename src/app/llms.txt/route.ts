import { faqDetail, faqPlain } from "@/content/faq-detail";
import { sitemap } from "@/content/sitemap";
import { treatmentGuide } from "@/content/treatment-guide";
import { getDoctor, getHospital } from "@/lib/data";
import { isOpen } from "@/lib/preview-lock";
import { SITE_URL } from "@/lib/site-url";

// AI 검색(ChatGPT · Perplexity · Gemini 등)이 병원을 빠르게 이해하도록 돕는 요약 안내 (llmstxt.org 형식)
// 공개 중인 페이지만 싣는다 (컨펌 기간 잠금 반영)
export const revalidate = 3600;

export async function GET() {
  const [h, doctor] = await Promise.all([getHospital(), getDoctor()]);
  const treatments = sitemap
    .filter((s) => s.treatment)
    .flatMap((s) => s.pages)
    .filter((p) => isOpen(p.href) && treatmentGuide[p.href]);

  const lines = [
    `# ${h.name}`,
    "",
    `> 인천 남동구 ${h.address.split(" ").slice(2, 4).join(" ")}의 피부과 의원. 대표원장 ${doctor.name}이 상담부터 시술까지 직접 책임 진료합니다.`,
    "",
    "## 병원 정보",
    `- 주소: ${h.address} ${h.addressDetail}`,
    `- 전화: ${h.phone}`,
    `- 대표원장: ${doctor.name}`,
    ...h.hours.map(
      (x) => `- ${x.label}: ${x.time}${x.note ? ` (${x.note})` : ""}`,
    ),
    h.lunch ? `- 점심시간: ${h.lunch}` : "",
    `- 예약: ${h.naverReservationUrl}`,
    "",
    "## 시술 안내",
    ...treatments.map(
      (p) =>
        `- [${p.label}](${SITE_URL}${p.href}): ${treatmentGuide[p.href].answer}`,
    ),
    "",
    ...treatments.flatMap((p) => {
      const faq = faqDetail[p.href];
      if (!faq) return [];
      return [
        `## ${p.label} 자주 묻는 질문`,
        ...faq.map((f) => `### ${f.q}\n${faqPlain(f.a)}`),
        "",
      ];
    }),
    "## 커뮤니티",
    `- [공지사항](${SITE_URL}/notice)`,
    `- [이벤트](${SITE_URL}/notice?type=event)`,
    `- [전후사진](${SITE_URL}/before-after): 시술 전 사진은 의료법에 따라 회원에게만 공개`,
    "",
    "※ 시술 효과와 유지 기간은 개인에 따라 다르며, 정확한 상담은 내원 진료를 통해 안내합니다.",
  ];
  return new Response(lines.filter((l) => l !== undefined).join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
