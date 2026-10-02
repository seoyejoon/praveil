// 네이버 블로그 최신 글 (RSS) — 1시간마다 새로 가져옴, 실패하면 빈 목록
export const BLOG_URL = "https://blog.naver.com/newrizzclinic";
const RSS_URL = "https://rss.blog.naver.com/newrizzclinic.xml";

export type BlogPost = {
  title: string;
  link: string;
  date: string;
  category: string;
  thumb?: string;
};

const cdata = (s = "") =>
  s
    .replace(/^\s*<!\[CDATA\[/, "")
    .replace(/\]\]>\s*$/, "")
    .trim();
const pick = (xml: string, tag: string) =>
  cdata(xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]);

// "구월동 피부과 | 실제 제목" 같은 검색용 머리말을 떼고 가장 긴 조각을 제목으로
const cleanTitle = (t: string) =>
  t
    .split("|")
    .map((s) => s.trim())
    .sort((a, b) => b.length - a.length)[0] ?? t;

/** 인천점 · 공통 글만 (잠실점 글 제외) */
export async function getBlogPosts(limit = 8): Promise<BlogPost[]> {
  try {
    const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .map(([, it]) => {
        const thumb = pick(it, "description").match(
          /<img[^>]+src="([^"]+)"/,
        )?.[1];
        return {
          title: cleanTitle(pick(it, "title")),
          link: pick(it, "link").split("?")[0],
          date: new Date(pick(it, "pubDate")).toISOString().slice(0, 10),
          category: pick(it, "category"),
          thumb: thumb?.replace(/\?type=\w+$/, "?type=w2"),
        };
      })
      .filter(
        (p) => !p.category.includes("잠실") || p.category.includes("공통"),
      )
      .slice(0, limit);
  } catch {
    return [];
  }
}
