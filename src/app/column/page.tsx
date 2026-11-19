import { permanentRedirect } from "next/navigation";

// /column → 원장칼럼 목록
export default function ColumnIndex() {
  permanentRedirect("/notice?type=column");
}
