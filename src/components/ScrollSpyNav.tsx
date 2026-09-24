"use client";

import { useEffect, useState } from "react";

// 상세 페이지 왼쪽 목차. 보고 있는 섹션이 강조된다
export default function ScrollSpyNav({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="목차">
      <ul className="space-y-1 border-l border-ink/15">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={`-ml-px block border-l py-2 pl-5 text-[15px] transition ${
                active === it.id ? "border-gold text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {it.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
