// 대표 시술(BEST) 표시: 글자 대신 베이지 점이 은은하게 퍼지는 강조 표시
export default function BestMark({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex h-2 w-2 shrink-0 ${className}`} title="대표 시술">
      <span className="absolute inset-0 animate-ping rounded-full bg-gold opacity-60 [animation-duration:1.8s]" />
      <span className="relative h-2 w-2 rounded-full bg-gold" />
      <span className="sr-only">대표 시술</span>
    </span>
  );
}
