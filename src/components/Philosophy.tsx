import { philosophy } from "@/content/home";
import PhilosophyIcon from "./PhilosophyIcon";
import Reveal from "./Reveal";

// 철학 3칸 카드 (밝은 톤 3단계). 원 안에 각 주제에 맞는 움직이는 아이콘.
const tones = [
  "bg-[linear-gradient(160deg,#fbf8f3_0%,#f1ebe1_100%)]",
  "bg-[linear-gradient(160deg,#f1ebe1_0%,#e8ded2_100%)]",
  "bg-[linear-gradient(160deg,#e8ded2_0%,#ddd0bf_100%)]",
];

export default function Philosophy() {
  return (
    <section className="relative z-10 grid md:grid-cols-3">
      {philosophy.map((p, i) => (
        <Reveal
          key={p.en}
          delay={i * 120}
          className={`group flex min-h-[320px] flex-col p-8 text-ink md:min-h-[440px] md:p-12 lg:p-16 ${tones[i]}`}
        >
          <span className="relative block h-24 w-24 rounded-full border border-ink/15 bg-ivory/60 p-3 text-mocha transition duration-700 group-hover:border-gold/60 group-hover:bg-ivory md:h-32 md:w-32 md:p-4">
            <PhilosophyIcon type={p.icon} />
          </span>
          <div className="mt-auto pt-10">
            <p className="font-display text-sm tracking-[0.2em] text-mocha">{p.en}</p>
            <p className="mt-3 font-serif text-2xl font-medium tracking-tight md:text-[28px]">{p.title}</p>
            <p className="mt-3 text-[15px] text-muted">{p.body}</p>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
