import type { Hospital } from "@/lib/data";
import HoursTable from "./HoursTable";
import KakaoMap from "./KakaoMap";
import MapLinks from "./MapLinks";

// 좌: 카카오맵 / 우: 진료시간 · 대표번호 · 다른 지도 앱
export default function LocationInfo({ hospital }: { hospital: Hospital }) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-14">
      <KakaoMap address={hospital.address} coords={hospital.coords} className="aspect-square md:aspect-auto md:min-h-[480px]" />

      <div className="flex flex-col gap-10">
        <HoursTable hospital={hospital} />

        <div>
          <p className="text-xs tracking-[0.2em] text-mocha uppercase">Tel</p>
          <a href={`tel:${hospital.phone}`} className="mt-2 block font-serif text-3xl md:text-4xl">
            {hospital.phone}
          </a>
          <p className="mt-3 text-sm text-mocha">
            {hospital.address} {hospital.addressDetail}
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs tracking-[0.2em] text-mocha uppercase">Other Maps</p>
          <MapLinks links={hospital.mapLinks} />
        </div>
      </div>
    </div>
  );
}
