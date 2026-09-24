"use client";

import { useEffect, useRef, useState } from "react";

type KakaoMaps = {
  load: (cb: () => void) => void;
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (el: HTMLElement, opts: { center: unknown; level: number }) => unknown;
  Marker: new (opts: { position: unknown; map: unknown }) => unknown;
  services: {
    Status: { OK: string };
    Geocoder: new () => {
      addressSearch: (addr: string, cb: (result: { x: string; y: string }[], status: string) => void) => void;
    };
  };
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

type Props = { address: string; coords?: { lat: number; lng: number }; className?: string };

// 카카오맵: 앱 키(NEXT_PUBLIC_KAKAO_MAP_KEY)가 있으면 지도를 띄운다. 좌표가 없으면 주소로 위치를 찾는다.
// 키가 없으면 자리만 표시한다.
export default function KakaoMap({ address, coords, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const ready = Boolean(appKey);

  useEffect(() => {
    if (!ready) return;

    const drawAt = (lat: number, lng: number) => {
      const { maps } = window.kakao!;
      const center = new maps.LatLng(lat, lng);
      const map = new maps.Map(ref.current!, { center, level: 3 });
      new maps.Marker({ position: center, map });
    };

    const draw = () =>
      window.kakao!.maps.load(() => {
        if (coords) return drawAt(coords.lat, coords.lng);
        const { services } = window.kakao!.maps;
        new services.Geocoder().addressSearch(address, (result, status) => {
          if (status === services.Status.OK && result[0]) drawAt(Number(result[0].y), Number(result[0].x));
          else setFailed(true);
        });
      });

    if (window.kakao?.maps) return draw();

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = draw;
    script.onerror = () => setFailed(true);
    document.head.appendChild(script);
  }, [ready, address, coords]);

  return (
    <div ref={ref} className={`overflow-hidden rounded-2xl bg-cream ${className}`}>
      {(!ready || failed) && (
        <div className="flex h-full items-center justify-center text-sm text-taupe">카카오맵 연동 예정</div>
      )}
    </div>
  );
}
