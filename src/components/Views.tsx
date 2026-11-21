import { Eye } from "lucide-react";

// 게시글 조회수 (눈 아이콘 + 숫자). 값이 없으면(관리자 DB 연결 전 임시 글) 그리지 않는다.
export default function Views({
  count,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  if (typeof count !== "number") return null;
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Eye className="h-3.5 w-3.5" strokeWidth={1.6} />
      <span className="sr-only">조회수</span>
      {count.toLocaleString("ko-KR")}
    </span>
  );
}
