import snapshot from "@/content/naver-reviews.json";

const formatDate = (date: string) => date.replaceAll("-", ".");

function Arrow() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="ba-arrow h-3.5 w-3.5">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 네이버 방문자 리뷰: 카드가 천천히 옆으로 흐름 (마우스를 올리면 멈춤, 모바일은 손으로 넘김)
export default function NaverReviews() {
  const reviews = snapshot.reviews.slice(0, 8);

  const card = (r: (typeof reviews)[number], hidden = false) => (
    <li
      key={(hidden ? "dup-" : "") + r.id}
      aria-hidden={hidden || undefined}
      className="flex w-[300px] shrink-0 snap-start flex-col rounded-[24px] border border-line bg-white p-7 transition duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_20px_40px_-24px_rgba(60,40,20,.35)] md:w-[360px] md:p-8"
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden
          className="h-7 font-display text-[44px] leading-[0.9] text-gold/70"
        >
          “
        </span>
        <span className="rounded-full bg-ivory px-3 py-1 text-xs text-muted">
          {r.verification} 인증
        </span>
      </div>
      <p className="mt-4 line-clamp-4 flex-1 text-[15px] leading-[1.8] whitespace-pre-line text-ink/85">
        {r.excerpt}
        {r.hasMore ? "…" : ""}
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <span
          aria-hidden
          className="grid h-9 w-9 place-items-center rounded-full bg-[#03c75a] text-xs font-bold text-white"
        >
          N
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{r.author}</p>
          <p className="text-xs text-muted">
            방문일 {formatDate(r.visitDate)} · {r.waitTime}
          </p>
        </div>
      </div>
    </li>
  );

  return (
    <section
      id="naver-reviews"
      aria-label="네이버 방문자 리뷰"
      className="overflow-hidden bg-[#f6f3ee] py-20 md:py-28"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
            Reviews
          </p>
          <h2 className="mt-4 text-[26px] leading-snug font-semibold tracking-[-0.03em] md:text-[36px]">
            네이버 방문자 리뷰
          </h2>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted">
            <span>
              <strong className="font-display text-[22px] font-normal text-ink md:text-[26px]">
                {snapshot.visitorReviewListCount.toLocaleString("ko-KR")}
                {snapshot.visitorReviewListCount >= 999 ? "+" : ""}
              </strong>{" "}
              건의 방문자 리뷰
            </span>
            <span className="text-xs">
              {formatDate(snapshot.capturedOn)} 기준 · 명칭 변경 전(
              {snapshot.placeNameAtCapture}) 방문 후기
            </span>
          </p>
        </div>
        <a
          href={snapshot.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex shrink-0 items-center gap-3 self-start overflow-hidden rounded-full border border-line bg-white py-2 pr-2 pl-6 text-sm transition-colors duration-500 hover:border-gold hover:text-white md:self-auto"
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
          />
          <span className="relative">네이버에서 전체 보기</span>
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-[#03c75a] text-white transition-colors duration-500 group-hover:bg-white group-hover:text-gold">
            <Arrow />
          </span>
        </a>
      </div>

      {/* 흐르는 카드 줄: 같은 목록을 두 번 이어 붙여 끊김 없이 반복 */}
      <div className="review-marquee no-scrollbar mt-12 overflow-x-auto md:mt-16">
        <ul className="review-track flex w-max gap-4 px-5 md:gap-5 md:px-10">
          {reviews.map((r) => card(r))}
          {reviews.map((r) => card(r, true))}
        </ul>
      </div>

      <p className="mx-auto mt-8 max-w-[1400px] px-5 text-xs text-muted/80 md:px-10">
        출처: 네이버 플레이스 · {snapshot.placeNameAtCapture} 방문자 리뷰{" "}
        {reviews.length}건 일부 발췌 (원문 그대로) · 개인의 경험이며 결과는
        사람마다 다를 수 있습니다.
      </p>
    </section>
  );
}
