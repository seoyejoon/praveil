import { NextResponse } from "next/server";
import { getPolicy } from "@/lib/data";

// 회원가입 창에서 '보기'를 누르면 약관 원문을 팝업으로 보여 주기 위한 읽기 전용 주소
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params;
  if (kind !== "terms" && kind !== "privacy")
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ body: await getPolicy(kind) });
}
