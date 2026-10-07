"use client";

import { useEffect, useId, useRef } from "react";

// 카카오맵 약도 서비스 (map.kakao.com > 약도 만들기에서 받은 소스)
// 원래 소스는 페이지를 처음 열 때 한 번만 그리는 방식(document.write)이라,
// 여기서는 불러오는 순서를 바꿔 페이지 이동 · 화면 크기 변경에도 다시 그린다.
const ROUGHMAP = { timestamp: "1790564504316", key: "vh53imoa6rn" };
const LOADER =
  "https://t1.kakaocdn.net/kakaomapweb/roughmap/loader/prod/roughmapLoader.js";

type LanderInstance = { render: () => void; roughmapData?: unknown };
type Lander = new (opts: {
  timestamp: string;
  key: string;
  mapWidth: string;
  mapHeight: string;
}) => LanderInstance;
declare global {
  interface Window {
    daum?: {
      roughmap?: {
        Lander?: Lander;
        instances?: Record<string, LanderInstance>;
      };
    };
  }
}

// 약도 데이터가 도착하면 원래 timestamp 로 칸을 찾으므로, 여러 칸은 하나씩 차례로 그린다
let queue: Promise<void> = Promise.resolve();
function renderOne(timestamp: string, width: number, height: number) {
  queue = queue.then(
    () =>
      new Promise<void>((done) => {
        const rm = window.daum!.roughmap!;
        const inst = new rm.Lander!({
          timestamp,
          key: ROUGHMAP.key,
          mapWidth: String(width),
          mapHeight: String(height),
        });
        rm.instances = rm.instances ?? {};
        rm.instances[ROUGHMAP.timestamp] = inst;
        inst.render();
        const started = Date.now();
        const wait = () =>
          inst.roughmapData || Date.now() - started > 6000
            ? done()
            : setTimeout(wait, 80);
        wait();
      }),
  );
}

let loading: Promise<void> | null = null;

function loadRoughmap() {
  if (window.daum?.roughmap?.Lander) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    // 로더가 document.write 로 넣으려는 스크립트를 가로채 직접 붙인다
    const originalWrite = document.write.bind(document);
    document.write = (...html: string[]) => {
      const src = /src="([^"]+)"/.exec(html.join(""))?.[1];
      if (!src) return;
      const lander = document.createElement("script");
      lander.charset = "UTF-8";
      lander.src = src.startsWith("//") ? `https:${src}` : src;
      lander.onload = () => resolve();
      lander.onerror = () => reject(new Error("roughmap lander"));
      document.head.appendChild(lander);
    };
    const loader = document.createElement("script");
    loader.charset = "UTF-8";
    loader.src = LOADER;
    loader.onload = () => {
      document.write = originalWrite;
      if (window.daum?.roughmap?.Lander) resolve();
    };
    loader.onerror = () => {
      document.write = originalWrite;
      reject(new Error("roughmap loader"));
    };
    document.head.appendChild(loader);
  }).catch((e) => {
    loading = null;
    throw e;
  });
  return loading;
}

type Props = {
  className?: string;
  address?: string;
  coords?: { lat: number; lng: number };
};

export default function KakaoMap({ className = "" }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  // 한 페이지에 약도가 여러 개일 수 있어 칸마다 번호를 다르게 붙인다
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const timestamp = `${ROUGHMAP.timestamp}${uid}`;

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let lastWidth = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const draw = async () => {
      try {
        await loadRoughmap();
      } catch {
        return;
      }
      if (cancelled || !box.isConnected) return;
      const width = Math.round(box.clientWidth);
      const height = Math.round(box.clientHeight);
      if (!width || !height || width === lastWidth) return;
      lastWidth = width;
      const holder = box.querySelector<HTMLDivElement>(
        `#daumRoughmapContainer${timestamp}`,
      );
      if (!holder) return;
      holder.innerHTML = "";
      // 지도를 틀 높이만큼 그림 (아래 카카오맵 막대는 CSS 로 숨김)
      renderOne(timestamp, width, Math.max(200, height));
    };

    draw();
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(draw, 250);
    });
    ro.observe(box);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      ro.disconnect();
    };
  }, [timestamp]);

  // 지도 위 휠: 브라우저 기본 스크롤을 막아 페이지가 같이 올라가지 않게 (지도 확대 · 축소는 그대로)
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const stop = (e: WheelEvent) => e.preventDefault();
    box.addEventListener("wheel", stop, { passive: false });
    return () => box.removeEventListener("wheel", stop);
  }, []);

  return (
    // data-lenis-prevent: 마우스가 지도 위에 있을 때 휠은 지도 확대 · 축소만 (페이지는 안 움직임)
    <div
      ref={boxRef}
      data-lenis-prevent
      className={`kakao-roughmap relative overflow-hidden bg-sand ${className}`}
    >
      <div
        id={`daumRoughmapContainer${timestamp}`}
        className="root_daum_roughmap root_daum_roughmap_landing"
      />
    </div>
  );
}
