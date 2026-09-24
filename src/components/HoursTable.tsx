import type { Hospital } from "@/lib/data";

export default function HoursTable({ hospital }: { hospital: Hospital }) {
  return (
    <div>
      <dl className="divide-y divide-line border-y border-line">
        {hospital.hours.map((h) => (
          <div key={h.label} className="flex justify-between py-4 text-sm md:text-base">
            <dt>{h.label}</dt>
            <dd className={h.closed ? "text-taupe" : ""}>
              {h.time}
              {h.note && <span className="ml-2 text-xs text-mocha">{h.note}</span>}
            </dd>
          </div>
        ))}
        <div className="flex justify-between py-4 text-sm md:text-base">
          <dt>점심시간</dt>
          <dd>{hospital.lunch}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-mocha">{hospital.hoursNotice}</p>
    </div>
  );
}
