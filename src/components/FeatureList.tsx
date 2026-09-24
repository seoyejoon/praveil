import type { Feature } from "@/lib/data";

export default function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {features.map((f, i) => (
        <li key={f.title} className="rounded-2xl bg-ivory p-6">
          <p className="font-serif text-sm text-taupe">0{i + 1}</p>
          <p className="mt-3 font-medium">{f.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-mocha">{f.description}</p>
        </li>
      ))}
    </ul>
  );
}
