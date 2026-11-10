import type { Metadata } from "next";
import { og } from "@/lib/site-url";
import PolicyPage from "@/components/PolicyPage";
import { getPolicy } from "@/lib/data";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  alternates: { canonical: "/privacy" },
    openGraph: og("/privacy"),
};

export default async function PrivacyPage() {
  return (
    <PolicyPage
      en="Privacy Policy"
      title="개인정보처리방침"
      body={await getPolicy("privacy")}
    />
  );
}
