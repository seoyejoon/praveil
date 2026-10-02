// 버튼 화살표: 평소엔 가만히, 마우스를 올리면 오른쪽으로 빠지고 새 화살표가 왼쪽에서 부드럽게 들어옴
// (부모에 group 클래스 필요)
const path = (
  <path
    d="M3 8h10M9 4l4 4-4 4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

export default function ArrowSwap() {
  const base =
    "absolute inset-0 h-full w-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none";
  return (
    <span aria-hidden className="relative block h-3.5 w-3.5 overflow-hidden">
      <svg
        viewBox="0 0 16 16"
        className={`${base} group-hover:translate-x-[160%]`}
      >
        {path}
      </svg>
      <svg
        viewBox="0 0 16 16"
        className={`${base} -translate-x-[160%] delay-75 group-hover:translate-x-0`}
      >
        {path}
      </svg>
    </span>
  );
}
