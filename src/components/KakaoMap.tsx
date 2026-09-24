"use client";

import { useEffect, useRef, useState } from "react";

type KakaoMaps = {
  load: (cb: () => void) => void;
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (el: HTMLElement, opts: { center: unknown; level: number }) => unknown;
  Marker: new (opts: { position: unknown; map: unknown }) => unknown;
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

// 카카오맵: 앱 키(NEXT_PUBLIC_KAKAO_MAP_KEY)와 좌표가 준비되면 지도가 뜨고, 그 전에는 자리만 표시한다.
export default function KakaoMap({ coords, className = "" }: { coords?: { lat: number; lng: number }; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const ready = Boolean(appKey && coords);

  useEffect(() => {
    if (!ready || !coords) return;

    const draw = () =>
      window.kakao!.maps.load(() => {
        const { maps } = window.kakao!;
        const center = new maps.LatLng(coords.lat, coords.lng);
        const map = new maps.Map(ref.current!, { center, level: 3 });
        new maps.Marker({ position: center, map });
      });

    if (window.kakao?.maps) return draw();

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = draw;
    script.onerror = () => setFailed(true);
    document.head.appendChild(script);
  }, [ready, coords]);

  return (
    <div ref={ref} className={`overflow-hidden rounded-2xl bg-cream ${className}`}>
      {(!ready || failed) && (
        <div className="flex h-full items-center justify-center text-sm text-taupe">카카오맵 연동 예정</div>
      )}
    </div>
  );
}
