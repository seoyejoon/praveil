import type { Metadata } from "next";
import MainBest from "@/components/main/MainBest";
import MainDoctor from "@/components/main/MainDoctor";
import MainHero from "@/components/main/MainHero";
import MainScan from "@/components/main/MainScan";
import MainNews from "@/components/main/MainNews";
import MainSpace from "@/components/main/MainSpace";
import MainTreatments from "@/components/main/MainTreatments";
import MainWhy from "@/components/main/MainWhy";
import {
  mainBest,
  mainCategoryImage,
  mainDoctor,
  mainHero,
  mainScan,
  mainSpace,
  mainWhy,
} from "@/content/main";
import { sitemap } from "@/content/sitemap";
import { findTreatment } from "@/content/treatments";
import { getDoctor, getNotices } from "@/lib/data";
import { coverOf } from "@/lib/notice";

// 메인 (2026.10 리뉴얼): 첫 화면(모델 영상) → 피부 분석 → 대표 시술 4종 → 특장점 → 대표원장 → 진료 분야 → 공간 → 소식 (진료시간 · 오시는 길은 푸터와 한 화면)
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [doctor, notices] = await Promise.all([getDoctor(), getNotices()]);

  return (
    <>
      {/* 검색엔진 · AI 가 이 페이지의 주제를 알 수 있게 하는 대표 제목 (화면에는 보이지 않음) */}
      <h1 className="sr-only">
        인천 남동구 피부과 프라베일 맑고고운의원 — 대표원장 책임 진료, 쿨소닉 ·
        쿨페이즈 리프팅 · 필러 · 스킨부스터
      </h1>
      <MainHero {...mainHero} />
      <MainScan {...mainScan} />
      <MainBest
        {...mainBest}
        items={mainBest.items.map((it) => {
          const t = findTreatment(it.href);
          return {
            ...it,
            headline: it.headline ?? t?.headline,
            points: t?.points.map((p) => p.title),
          };
        })}
      />
      <MainWhy {...mainWhy} />
      <MainDoctor {...mainDoctor} name={doctor.name} title={doctor.title} />
      <MainTreatments
        sections={sitemap.filter((s) => s.treatment)}
        images={mainCategoryImage}
      />
      <MainSpace {...mainSpace} />
      <MainNews
        items={notices.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          summary: n.summary,
          createdAt: n.createdAt,
          cover: coverOf(n),
        }))}
      />
    </>
  );
}
