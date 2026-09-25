import type { Hospital } from "@/lib/data";
import KakaoMap from "@/components/KakaoMap";
import MapLinks from "@/components/MapLinks";
import Reveal from "@/components/Reveal";

// 오시는 길 (밝은 배경, 바로 아래 푸터와 이어짐): 왼쪽 지도, 오른쪽 주소 · 진료시간 · 연락처
export default function HomeLocation({ hospital }: { hospital: Hospital }) {
  return (
    <section className="bg-ivory pt-24 pb-2 md:pt-32 md:pb-4">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <KakaoMap address={hospital.address} coords={hospital.coords} className="aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto lg:h-full lg:min-h-[520px]" />
        </Reveal>

        <div className="order-1 flex flex-col lg:order-2">
          <Reveal>
            <p className="font-display text-base tracking-[0.12em] text-gold md:text-lg">( Visit Us )</p>
            <h2 className="mt-4 font-serif text-[30px] font-medium tracking-[-0.04em] md:text-[44px]">오시는 길</h2>
          </Reveal>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 md:mt-14">
            <Reveal>
              <h3 className="font-display text-xl text-mocha md:text-2xl">Address</h3>
              <p className="mt-4 text-[15px] leading-relaxed font-medium md:text-base">
                {hospital.address}
                <br />
                {hospital.addressDetail}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted">
                {hospital.directions.slice(0, 3).map((d) => (
                  <li key={d.title}>
                    <span className="mr-2 text-mocha">{d.title}</span>
                    {d.body}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120}>
              <h3 className="font-display text-xl text-mocha md:text-2xl">Clinic Hours</h3>
              <ul className="mt-4 space-y-2 text-[15px]">
                {hospital.hours.map((h) => (
                  <li key={h.label} className="flex gap-4">
                    <span className="w-28 shrink-0 text-muted">· {h.label}</span>
                    <span className={h.closed ? "text-mocha" : ""}>
                      {h.time}
                      {h.note && <span className="ml-1.5 text-xs text-mocha">{h.note}</span>}
                    </span>
                  </li>
                ))}
                {hospital.lunch && (
                  <li className="flex gap-4">
                    <span className="w-28 shrink-0 text-muted">· 점심시간</span>
                    <span>{hospital.lunch}</span>
                  </li>
                )}
              </ul>
              {hospital.hoursNotice && <p className="mt-3 text-xs text-taupe">{hospital.hoursNotice}</p>}
            </Reveal>
          </div>

          <Reveal className="mt-10 border-t border-ink/10 pt-8 lg:mt-auto">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h3 className="font-display text-xl text-mocha md:text-2xl">Contact</h3>
                <a href={`tel:${hospital.phone}`} className="mt-2 block font-serif text-3xl tracking-wide md:text-4xl">
                  {hospital.phone}
                </a>
              </div>
              <div className="w-full sm:w-64">
                <MapLinks links={hospital.mapLinks} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
