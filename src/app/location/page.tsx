import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import LocationInfo from "@/components/LocationInfo";
import { getHospital } from "@/lib/data";

export const metadata: Metadata = { title: "오시는 길" };

export default async function LocationPage() {
  const hospital = await getHospital();

  return (
    <>
      <PageHeader en="Location" title="오시는 길" />
      <Container className="py-12 md:py-16">
        <LocationInfo hospital={hospital} />

        <dl className="mt-14 grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          {hospital.directions.map((d) => (
            <div key={d.title}>
              <dt className="font-medium">{d.title}</dt>
              <dd className="mt-1 text-sm text-mocha">{d.body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </>
  );
}
