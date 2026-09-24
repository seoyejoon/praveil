import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import HoursTable from "@/components/HoursTable";
import { getHospital } from "@/lib/data";

export const metadata: Metadata = { title: "오시는 길" };

export default async function LocationPage() {
  const hospital = await getHospital();

  return (
    <>
      <PageHeader en="Location" title="오시는 길" />
      <Container className="py-12 md:py-16">
        {/* 지도: 주소 확정 후 네이버/카카오 지도 연결 */}
        <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-cream text-sm text-taupe">
          지도 영역
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-xl">주소 · 연락처</h2>
            <p className="mt-4">
              {hospital.address} {hospital.addressDetail}
            </p>
            <p className="mt-2">
              <a href={`tel:${hospital.phone}`} className="underline underline-offset-4">
                {hospital.phone}
              </a>
            </p>
            <dl className="mt-8 space-y-4">
              {hospital.directions.map((d) => (
                <div key={d.title}>
                  <dt className="text-sm font-medium">{d.title}</dt>
                  <dd className="mt-1 text-sm text-mocha">{d.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="mb-4 font-serif text-xl">진료시간</h2>
            <HoursTable hospital={hospital} />
          </div>
        </div>
      </Container>
    </>
  );
}
