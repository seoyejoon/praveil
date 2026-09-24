import type { Feature } from "@/lib/data";
import Reveal from "./Reveal";

export default function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="grid border-t border-espresso/20 sm:grid-cols-2 lg:grid-cols-5">
      {features.map((f, i) => (
        <Reveal
          as="li"
          key={f.title}
          delay={i * 100}
          className="border-b border-espresso/20 py-8 sm:px-6 lg:border-b-0 lg:border-l lg:first:border-l-0 lg:first:pl-0"
        >
          <p className="font-display text-3xl text-gold">0{i + 1}</p>
          <p className="mt-6 font-medium">{f.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-mocha">{f.description}</p>
        </Reveal>
      ))}
    </ul>
  );
}
