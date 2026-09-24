import { philosophy } from "@/content/home";
import Reveal from "./Reveal";

// 철학 3칸 카드 (어둠 / 밝음 / 어둠)
export default function Philosophy() {
  return (
    <section className="relative z-10 grid md:grid-cols-3">
      {philosophy.map((p, i) => (
        <Reveal
          key={p.en}
          delay={i * 120}
          className={`flex min-h-[300px] flex-col p-8 md:min-h-[420px] md:p-12 lg:p-16 ${
            p.tone === "dark"
              ? "bg-[linear-gradient(97deg,#342f2a_0%,#4a433c_42%,#5a5148_63%,#39342f_100%)] text-white"
              : "bg-[linear-gradient(84deg,#d6caba_0%,#f1ebe1_46%,#e7ded1_68%,#cdbead_100%)] text-ink"
          }`}
        >
          <span
            aria-hidden
            className={`block h-20 w-20 rounded-full border md:h-28 md:w-28 ${
              p.tone === "dark" ? "border-[#ffd899]/50" : "border-ink/30"
            }`}
          />
          <div className="mt-auto pt-10">
            <p className={`font-display text-sm tracking-[0.2em] ${p.tone === "dark" ? "text-[#ffd899]" : "text-mocha"}`}>
              {p.en}
            </p>
            <p className="mt-3 font-serif text-2xl font-medium tracking-tight md:text-[28px]">{p.title}</p>
            <p className={`mt-3 text-[15px] ${p.tone === "dark" ? "text-cream/70" : "text-muted"}`}>{p.body}</p>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
