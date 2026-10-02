import ArrowSwap from "@/components/ArrowSwap";
import { BLOG_URL, type BlogPost } from "@/lib/blog";

// 네이버 블로그 최신 글 (사진 · 제목 · 날짜, 누르면 블로그 글로 이동)
export default function MainBlog({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="bg-[#f6f3ee] py-24 md:py-32">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-display text-xs tracking-[0.35em] text-gold uppercase">
            Blog
          </p>
          <h2 className="mt-4 text-[34px] leading-[1.2] font-bold tracking-[-0.04em] md:text-[56px]">
            피부 이야기
          </h2>
          <p className="mt-4 text-[15px] text-muted">
            시술과 피부 관리 정보를 블로그에서 꾸준히 전해 드립니다.
          </p>
        </div>
        <a
          href={BLOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative isolate inline-flex shrink-0 items-center gap-3 self-start overflow-hidden rounded-full border border-line bg-white py-2 pr-2 pl-6 text-sm transition-colors duration-500 hover:border-gold hover:text-white md:self-auto"
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
          />
          <span className="relative">블로그 바로가기</span>
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-[#03c75a] text-white transition-colors duration-500 group-hover:bg-white group-hover:text-gold">
            <ArrowSwap />
          </span>
        </a>
      </div>

      <ul className="no-scrollbar mx-auto mt-12 flex max-w-[1600px] snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 md:mt-16 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-10">
        {posts.slice(0, 4).map((p) => (
          <li key={p.link} className="w-[78%] shrink-0 snap-start md:w-auto">
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden rounded-[20px] bg-ivory">
                {p.thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.thumb}
                    alt=""
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
                  />
                )}
              </div>
              <p className="mt-4 font-display text-xs tracking-[0.15em] text-gold">
                {p.date.replaceAll("-", ".")}
              </p>
              <h3 className="mt-2 line-clamp-2 text-[17px] leading-snug font-semibold tracking-[-0.02em] transition group-hover:text-mocha md:text-lg">
                {p.title}
              </h3>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
