import type { Metadata } from "next";
import { og } from "@/lib/site-url";
import PolicyPage from "@/components/PolicyPage";
import { getPolicy } from "@/lib/data";

export const metadata: Metadata = {
  title: "이용약관",
  alternates: { canonical: "/terms" },
    openGraph: og("/terms"),
};

export default async function TermsPage() {
  return (
    <PolicyPage
      en="Terms of Service"
      title="이용약관"
      body={await getPolicy("terms")}
    />
  );
}
