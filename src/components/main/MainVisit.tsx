import type { Hospital } from "@/lib/data";
import KakaoMap from "@/components/KakaoMap";
import MapLinks from "@/components/MapLinks";
import Reveal from "@/components/Reveal";

// 진료시간 · 오시는 길 요약 (아래 검정 푸터와 이어지는 밝은 회색)
export default function MainVisit({ hospital }: { hospital: Hospital }) {
  return (
    <section className="bg-ivory px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <p className="font-display text-xs tracking-[0.35em] text-black/50 uppercase md:text-sm">Visit</p>
        <Reveal variant="line" className="mt-6 text-[34px] leading-[1.2] font-bold tracking-[-0.04em] md:text-[56px]">
          <span>
            <span>진료시간 · 오시는 길</span>
          </span>
        </Reveal>

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <Reveal variant="clip">
            <KakaoMap address={hospital.address} coords={hospital.coords} className="aspect-[4/3] overflow-hidden bg-sand lg:aspect-auto lg:h-full lg:min-h-[560px]" />
          </Reveal>

          <div className="flex flex-col">
            <div className="border-t border-black pt-6">
              <p className="font-display text-xs tracking-[0.3em] text-black/45 uppercase">Address</p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                {hospital.address}
                <br />
                {hospital.addressDetail}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-black/55">
                {hospital.directions.slice(0, 3).map((d) => (
                  <li key={d.title}>
                    {d.title} · {d.body}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-black/15 pt-6">
              <p className="font-display text-xs tracking-[0.3em] text-black/45 uppercase">Hours</p>
              <ul className="mt-4 grid grid-cols-[auto_1fr] gap-x-10 gap-y-2.5 text-[15px] md:text-base">
                {hospital.hours.map((h) => (
                  <li key={h.label} className="col-span-2 grid grid-cols-subgrid">
                    <span className="whitespace-nowrap text-black/55">{h.label}</span>
                    <span className={`whitespace-nowrap font-medium ${h.closed ? "text-black/40" : ""}`}>
                      {h.time}
                      {h.note && <span className="ml-2 text-xs text-black/50">{h.note}</span>}
                    </span>
                  </li>
                ))}
                {hospital.lunch && (
                  <li className="col-span-2 grid grid-cols-subgrid">
                    <span className="text-black/55">점심시간</span>
                    <span className="font-medium">{hospital.lunch}</span>
                  </li>
                )}
              </ul>
              {hospital.hoursNotice && <p className="mt-3 text-xs text-black/45">{hospital.hoursNotice}</p>}
            </div>

            <div className="mt-10 border-t border-black/15 pt-6">
              <p className="font-display text-xs tracking-[0.3em] text-black/45 uppercase">Contact</p>
              <a href={`tel:${hospital.phone}`} className="mt-3 block font-display text-[40px] leading-none font-light tracking-[0.02em] md:text-[56px]">
                {hospital.phone}
              </a>
            </div>

            <div className="mt-10 lg:mt-auto lg:pt-10">
              <MapLinks links={hospital.mapLinks} address={hospital.address} name={hospital.name} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
