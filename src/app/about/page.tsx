import { redirect } from "next/navigation";

// 병원소개 첫 페이지는 '프라베일 철학'
export default function AboutIndex() {
  redirect("/about/philosophy");
}
