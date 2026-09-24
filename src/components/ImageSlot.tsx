// 사진 자리. src가 생기면 사진을, 없으면 베이지 톤 빈 자리를 보여준다.
export default function ImageSlot({
  src,
  alt = "",
  label,
  className = "",
}: {
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-end bg-gradient-to-br from-cream via-sand to-taupe/40 p-4">
          {label && <span className="font-display text-sm tracking-widest text-mocha/70 italic">{label}</span>}
        </div>
      )}
    </div>
  );
}
