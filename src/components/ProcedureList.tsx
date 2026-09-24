import Link from "next/link";
import type { Procedure } from "@/lib/data";

export default function ProcedureList({ procedures }: { procedures: Procedure[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {procedures.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/treatments/${p.categorySlug}/${p.slug}`}
            className="flex items-center justify-between rounded-xl border border-line bg-ivory px-5 py-5 transition hover:border-taupe hover:bg-cream"
          >
            <span>
              {p.name}
              {p.isSignature && <span className="ml-2 text-xs text-mocha">대표</span>}
            </span>
            <span aria-hidden className="text-taupe">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
