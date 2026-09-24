import type { Doctor } from "@/lib/data";
import Container from "./Container";

export default function DoctorProfile({ doctor }: { doctor: Doctor }) {
  return (
    <Container className="grid items-center gap-10 md:grid-cols-2">
      <div className="aspect-[4/5] rounded-2xl bg-sand" aria-label="원장 사진 (촬영 전)" />
      <div>
        <p className="text-xs tracking-[0.3em] text-mocha uppercase">Doctor</p>
        <h2 className="mt-3 font-serif text-2xl md:text-3xl">
          {doctor.title} {doctor.name}
        </h2>
        <ul className="mt-8 space-y-3 text-sm md:text-base">
          {doctor.credentials.map((c) => (
            <li key={c} className="border-b border-line pb-3">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
