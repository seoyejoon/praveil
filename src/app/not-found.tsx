import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="font-serif text-3xl">404</p>
      <p className="mt-4 text-sm text-mocha">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="mt-10 inline-block text-sm underline underline-offset-4">
        홈으로
      </Link>
    </Container>
  );
}
