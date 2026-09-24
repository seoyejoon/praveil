import type { Doctor } from "@/lib/data";
import { doctorQuote } from "@/content/home";
import ImageSlot from "./ImageSlot";
import Reveal from "./Reveal";

// 좌: 원장 사진(아래 정렬) / 우: 인용문 + 프로필
export default function DoctorProfile({ doctor }: { doctor: Doctor }) {
  return (
    <div className="bg-[linear-gradient(90deg,rgba(255,253,246,0)_0%,#f3eadd_100%),#fffdf6]">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-24 md:grid-cols-10 md:gap-0 md:px-10 md:pt-32">
        <Reveal className="order-2 md:order-1 md:col-span-4 md:col-start-2 md:self-end">
          <ImageSlot label="Doctor" className="aspect-[3/4] w-full" />
        </Reveal>
        <Reveal delay={150} className="order-1 md:order-2 md:col-span-4 md:col-start-7 md:pb-32">
          <span aria-hidden className="block font-serif text-7xl leading-none text-taupe">&ldquo;</span>
          <p className="mt-2 font-serif text-[26px] leading-[1.45] font-medium tracking-tight whitespace-pre-line md:text-4xl md:leading-[1.45]">
            {doctorQuote}
          </p>
          <div className="mt-14 md:mt-24">
            <p className="font-display text-lg tracking-[0.15em] text-mocha">The Praveil Standard</p>
            <p className="mt-4 flex items-baseline gap-3">
              <span className="font-serif text-3xl font-medium">{doctor.name}</span>
              <span className="text-sm text-muted">{doctor.title}</span>
            </p>
            <ul className="mt-8 space-y-2.5 border-t border-ink/15 pt-6 text-[15px] text-muted">
              {doctor.credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
