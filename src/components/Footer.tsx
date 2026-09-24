import type { Hospital } from "@/lib/data";
import Container from "./Container";

export default function Footer({ hospital }: { hospital: Hospital }) {
  return (
    <footer className="border-t border-line bg-cream pt-12 pb-28 text-sm text-mocha md:pb-12">
      <Container className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="font-serif text-lg text-espresso">PRAVEIL</p>
          <p className="mt-1">{hospital.name}</p>
          <dl className="mt-6 space-y-1 text-xs leading-relaxed">
            <div>
              <dt className="inline">대표원장 </dt>
              <dd className="inline">{hospital.director}</dd>
              <span className="mx-2">|</span>
              <dt className="inline">사업자등록번호 </dt>
              <dd className="inline">{hospital.businessNumber}</dd>
            </div>
            <div>
              <dt className="inline">주소 </dt>
              <dd className="inline">
                {hospital.address} {hospital.addressDetail}
              </dd>
            </div>
            <div>
              <dt className="inline">대표전화 </dt>
              <dd className="inline">{hospital.phone}</dd>
            </div>
          </dl>
        </div>
        <div className="md:text-right">
          <ul className="space-y-1 text-xs">
            {hospital.hours.map((h) => (
              <li key={h.label}>
                {h.label} {h.time}
                {h.note && ` (${h.note})`}
              </li>
            ))}
            <li>점심시간 {hospital.lunch}</li>
          </ul>
          <p className="mt-6 text-xs">© {new Date().getFullYear()} PRAVEIL. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
