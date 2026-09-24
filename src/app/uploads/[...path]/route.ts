import { readFile } from "node:fs/promises";
import path from "node:path";

// 관리자에서 올린 이미지(/uploads/...)를 보여준다.
// 운영 서버에서는 Nginx가 /uploads/ 를 먼저 처리하므로 이 코드는 로컬 테스트용 예비 경로다.
const types: Record<string, string> = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".avif": "image/avif" };

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const root = process.env.UPLOAD_DIR;
  const segments = (await params).path;
  if (!root || segments.some((s) => !s || s === "." || s === ".." || s.includes("\\"))) return new Response(null, { status: 404 });
  const file = path.resolve(root, ...segments);
  const type = types[path.extname(file).toLowerCase()];
  if (!type || !file.startsWith(path.resolve(root) + path.sep)) return new Response(null, { status: 404 });
  try {
    const data = await readFile(file);
    return new Response(data, { headers: { "content-type": type, "cache-control": "public, max-age=86400", "x-content-type-options": "nosniff" } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
