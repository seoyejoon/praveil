import type { Doctor } from "@/lib/data";
import Container from "./Container";
import ImageSlot from "./ImageSlot";
import Reveal from "./Reveal";

export default function DoctorProfile({ doctor }: { doctor: Doctor }) {
  return (
    <Container className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
      <Reveal className="md:col-span-5">
        <ImageSlot label="Doctor" className="aspect-[4/5] rounded-t-full" />
      </Reveal>
      <Reveal delay={150} className="md:col-span-7">
        <p className="font-display text-3xl text-taupe italic md:text-5xl">Doctor</p>
        <p className="mt-8 font-serif text-xl leading-relaxed md:text-2xl md:leading-relaxed">
          {/* 임시 문구: 원장님 인사말 확정 후 교체 */}
          &ldquo;피부마다 맞는 방법은 다릅니다.
          <br />
          상담부터 시술까지 직접 책임지겠습니다.&rdquo;
        </p>
        <p className="mt-8 text-sm text-mocha">{doctor.title}</p>
        <p className="mt-1 font-serif text-2xl">{doctor.name}</p>
        <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm md:text-base">
          {doctor.credentials.map((c) => (
            <li key={c} className="flex gap-3">
              <span className="mt-2.5 h-px w-3 shrink-0 bg-taupe" />
              {c}
            </li>
          ))}
        </ul>
      </Reveal>
    </Container>
  );
}
