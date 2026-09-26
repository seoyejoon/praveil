// 상단 메뉴 구성. '시술안내' 하위 메뉴는 관리자의 시술 분류에서 자동으로 채운다.
import { aboutSections } from "@/content/pages";

export type NavChild = { href: string; label: string };
export type NavItem = { href: string; label: string; en: string; children: NavChild[] };

export function buildNav(categories: { slug: string; name: string }[]): NavItem[] {
  return [
    {
      href: "/about",
      label: "병원소개",
      en: "About",
      children: aboutSections.map((s) => ({ href: `/about/${s.slug}`, label: s.label })),
    },
    {
      href: "/treatments",
      label: "시술안내",
      en: "Treatments",
      children: categories.map((c) => ({ href: `/treatments/${c.slug}`, label: c.name })),
    },
    {
      href: "/notice",
      label: "공지 · 이벤트",
      en: "News",
      children: [
        { href: "/notice?type=notice", label: "공지사항" },
        { href: "/notice?type=event", label: "이벤트" },
      ],
    },
    {
      href: "/location",
      label: "오시는 길",
      en: "Location",
      children: [
        { href: "/location#hours", label: "진료시간 · 오시는 길" },
        { href: "/location#directions", label: "찾아오시는 방법" },
      ],
    },
  ];
}
