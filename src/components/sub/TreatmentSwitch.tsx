"use client";

import { ArrowLeftRight } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// 한 페이지 안에서 하위 시술을 바꿔 보기 (예: 스킨부스터 → 리쥬란힐러 · 엑소좀)
// - 서버는 모든 시술을 그려 둠 (검색엔진이 다 읽게). 화면에 붙은 뒤에는 고른 것만 남김 (같은 id 가 겹치지 않게)
// - 주소: ?type=exosome (첫 번째 시술은 주소 그대로)
// - 첫 화면 제목 아래 버튼: 맨 위에서 바꿈
// - 화면 아래 떠 있는 버튼: 지금 읽던 섹션 그대로 다른 시술로 바꿈
type Variant = { key: string; label: string };
type Ctx = {
  variants: Variant[];
  active: number;
  select: (i: number, keep: boolean) => void;
};

const SwitchContext = createContext<Ctx | null>(null);
const HEADER = 120;

// 섹션 제목에서 시술 이름 · 조사를 빼고 비교 ("리쥬란힐러, 어떤 시술인가요?" = "엑소좀, 어떤 시술인가요?")
const signature = (el: Element, labels: string[]) => {
  let t = el.querySelector("h2")?.textContent ?? "";
  for (const l of labels) t = t.split(l).join("");
  return t.replace(/^\s*(을|를|은|는|이|가|의|,)\s*/, "").trim();
};

export default function TreatmentSwitch({
  variants,
  children,
}: {
  variants: Variant[];
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const pending = useRef<{ sig: string; index: number; ratio: number } | null>(
    null,
  );
  const labels = variants.map((v) => v.label);

  useEffect(() => {
    const key = new URLSearchParams(location.search).get("type");
    const i = variants.findIndex((v) => v.key === key);
    if (i > 0) setActive(i);
    setMounted(true);
  }, [variants]);

  const sections = () =>
    Array.from(box.current?.querySelectorAll("section") ?? []).filter((s) =>
      s.querySelector("h2"),
    );

  const select = useCallback(
    (i: number, keep: boolean) => {
      if (i === active) return;
      pending.current = null;
      if (keep) {
        // 지금 화면 위쪽에 걸친 섹션과, 그 안에서 얼마나 읽었는지
        const list = sections();
        let index = -1;
        list.forEach((s, n) => {
          if (s.getBoundingClientRect().top <= HEADER) index = n;
        });
        if (index >= 0) {
          const r = list[index].getBoundingClientRect();
          pending.current = {
            sig: signature(list[index], labels),
            index,
            ratio: Math.min(1, (HEADER - r.top) / r.height),
          };
        }
      }
      setActive(i);
      const url = new URL(location.href);
      if (i === 0) url.searchParams.delete("type");
      else url.searchParams.set("type", variants[i].key);
      history.replaceState(history.state, "", url);
      if (!keep) window.scrollTo({ top: 0 });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active, variants],
  );

  // 바꾼 뒤: 같은 섹션(제목이 같은 것, 없으면 같은 순서)으로 이동
  useLayoutEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    const list = sections();
    const target =
      list.find((s) => signature(s, labels) === p.sig) ??
      list[Math.min(p.index, list.length - 1)];
    if (!target) return;
    const r = target.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + r.top - HEADER + p.ratio * r.height,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <SwitchContext.Provider value={{ variants, active, select }}>
      <div ref={box}>
        {children.map((child, i) =>
          i === active ? (
            <div key={variants[i].key} data-variant={variants[i].key}>
              {child}
            </div>
          ) : mounted ? null : (
            <div key={variants[i].key} data-variant={variants[i].key} hidden>
              {child}
            </div>
          ),
        )}
      </div>
      <FloatingSwitch />
    </SwitchContext.Provider>
  );
}

/** 첫 화면 제목 아래 전환 버튼 */
export function HeroSwitch() {
  const ctx = useContext(SwitchContext);
  if (!ctx) return null;
  return (
    <div
      role="tablist"
      aria-label="시술 선택"
      className="inline-flex rounded-full border border-ink/10 bg-white/70 p-1 backdrop-blur-sm"
    >
      {ctx.variants.map((v, i) => {
        const on = i === ctx.active;
        return (
          <button
            key={v.key}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => ctx.select(i, false)}
            className={`rounded-full px-5 py-2.5 text-[14px] transition duration-300 md:px-7 md:text-[15px] ${on ? "bg-ink font-semibold text-white" : "text-ink/60 hover:text-ink"}`}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}

/** 화면 아래 떠 있는 전환 버튼 (첫 화면을 지나면 나타나고, 맨 아래 상담 안내 근처에선 숨김) */
function FloatingSwitch() {
  const ctx = useContext(SwitchContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector("footer");
      const nearEnd = footer
        ? footer.getBoundingClientRect().top < innerHeight
        : false;
      setShow(scrollY > innerHeight * 0.7 && !nearEnd);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  if (!ctx) return null;
  return (
    <div
      className={`fixed bottom-5 left-1/2 z-30 -translate-x-1/2 transition-[opacity,translate] duration-500 md:bottom-8 ${show ? "" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <div
        role="tablist"
        aria-label="같은 내용으로 다른 시술 보기"
        className="flex items-center gap-1 rounded-full bg-espresso/95 p-1.5 pl-3 text-white shadow-[0_12px_32px_-12px_rgba(40,30,20,0.55)] backdrop-blur-md"
      >
        <ArrowLeftRight
          aria-hidden
          className="mr-1 h-4 w-4 shrink-0 text-taupe"
          strokeWidth={1.6}
        />
        {ctx.variants.map((v, i) => {
          const on = i === ctx.active;
          return (
            <button
              key={v.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => ctx.select(i, true)}
              className={`rounded-full px-4 py-2 text-[13px] whitespace-nowrap transition duration-300 md:px-5 md:text-sm ${on ? "bg-white font-semibold text-ink" : "text-white/70 hover:text-white"}`}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
