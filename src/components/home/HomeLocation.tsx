import type { Hospital } from "@/lib/data";
import KakaoMap from "@/components/KakaoMap";
import MapLinks from "@/components/MapLinks";
import Reveal from "@/components/Reveal";

const PinIcon = () => (
  <svg viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 text-gold" fill="currentColor" aria-hidden>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 6.2 12.1 6.5 12.4a.7.7 0 0 0 1 0C12.8 21.1 19 14.2 19 9a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gold" fill="currentColor" aria-hidden>
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1l-2.2 2.2Z" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" strokeLinecap="round" />
  </svg>
);

// 오시는 길 (어두운 배경, 아래 푸터와 이어짐): 왼쪽 큰 지도, 오른쪽 병원 사진 · 주소 · 전화 · 진료시간
export default function HomeLocation({ hospital, photo }: { hospital: Hospital; photo: string }) {
  return (
    <section className="bg-[#1d1916] pt-24 pb-20 text-cream md:pt-32 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <p className="font-display text-sm font-medium tracking-[0.2em] text-gold uppercase md:text-base">Visit Us</p>
          <h2 className="mt-3 text-[30px] font-bold tracking-[-0.03em] md:text-[44px]">오시는 길</h2>
        </Reveal>

        <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <Reveal>
            <KakaoMap
              address={hospital.address}
              coords={hospital.coords}
              className="aspect-[4/3] overflow-hidden rounded-[24px] bg-cream lg:aspect-auto lg:h-full lg:min-h-[640px] lg:rounded-[32px]"
            />
          </Reveal>

          <Reveal delay={120} className="flex flex-col">
            <div className="aspect-[16/10] overflow-hidden rounded-[24px] bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="프라베일 맑고고운의원 인포메이션" loading="lazy" className="h-full w-full object-cover" />
            </div>

            <div className="mt-8 flex gap-3">
              <PinIcon />
              <div>
                <p className="text-lg leading-snug font-semibold break-keep md:text-[22px]">
                  {hospital.address} {hospital.addressDetail}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-cream/55">
                  {hospital.directions.slice(0, 3).map((d) => (
                    <li key={d.title} className="break-keep">
                      * {d.title} · {d.body}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-7 border-t border-white/10 pt-7">
              <a href={`tel:${hospital.phone}`} className="flex items-center gap-3 text-2xl font-bold tracking-wide transition hover:text-gold md:text-[28px]">
                <PhoneIcon />
                {hospital.phone}
              </a>

              <div className="mt-7 flex gap-3">
                <ClockIcon />
                <div className="flex-1">
                  <p className="text-lg font-semibold">진료시간</p>
                  <ul className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[15px]">
                    {hospital.hours.map((h) => (
                      <li key={h.label} className="col-span-2 grid grid-cols-subgrid">
                        <span className="whitespace-nowrap text-cream/55">{h.label}</span>
                        <span className={`whitespace-nowrap ${h.closed ? "text-gold" : ""}`}>
                          {h.time}
                          {h.note && <span className="ml-1.5 text-xs text-gold">{h.note}</span>}
                        </span>
                      </li>
                    ))}
                    {hospital.lunch && (
                      <li className="col-span-2 grid grid-cols-subgrid">
                        <span className="whitespace-nowrap text-cream/55">점심시간</span>
                        <span>{hospital.lunch}</span>
                      </li>
                    )}
                  </ul>
                  {hospital.hoursNotice && <p className="mt-3 text-xs text-cream/45">{hospital.hoursNotice}</p>}
                </div>
              </div>
            </div>

            <div className="mt-8 lg:mt-auto lg:pt-8">
              <MapLinks links={hospital.mapLinks} address={hospital.address} name={hospital.name} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
