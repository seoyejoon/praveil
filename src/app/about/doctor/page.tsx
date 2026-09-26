import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import DoctorProfile from "@/components/DoctorProfile";
import { getDoctor } from "@/lib/data";

export const metadata: Metadata = { title: "대표원장 소개" };

export default async function DoctorPage() {
  const doctor = await getDoctor();
  return (
    <AboutPage slug="doctor">
      <section className="pt-10 md:pt-16">
        <DoctorProfile doctor={doctor} />
      </section>
    </AboutPage>
  );
}
