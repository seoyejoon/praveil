"use client";

import { useEffect, useRef } from "react";
import { FACE_EDGES, FACE_VERTICES } from "@/content/face-mesh";
import { reducedMotion } from "@/lib/gsap";

// 피부 분석 장면: 빛나는 점으로 된 3D 얼굴을 스캔 라인이 위에서 아래로 훑고,
// 지나간 부위마다 분석 항목 카드가 선으로 이어지며 나타난다.
// - 얼굴은 천천히 좌우로 돌고, 마우스를 따라 방향이 바뀐다
// - 마우스 주변 점은 돋보기처럼 밝고 크게
// - video 를 넣으면 얼굴 뒤에 영상이 깔리고 점 · 선은 그 위에 은은하게 겹친다 (모델 영상 준비 후)

export type ScanItem = { label: string; en: string; point: number; side: "left" | "right"; top: number };

const CYCLE = 9; // 초: 한 번 훑고 카드가 모두 뜬 뒤 다시 시작
const SCAN_TIME = 3.6;
const BEIGE = "227,207,174";

export default function FaceScan({ items, video }: { items: ScanItem[]; video?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d")!;
    const still = reducedMotion();
    const n = FACE_VERTICES.length / 3;
    const proj = new Float32Array(n * 3); // 화면 x, y, 깊이
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999 };
    const start = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      mouse.px = e.clientX - r.left;
      mouse.py = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.tx = 0;
      mouse.ty = 0;
      mouse.px = mouse.py = -9999;
    };
    window.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    const frame = (now: number) => {
      const t = still ? 5 : (now - start) / 1000;
      const cycleT = t % CYCLE;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // 회전 + 원근
      const yaw = Math.sin(t * 0.35) * 0.32 + mouse.x * 0.45;
      const pitch = -0.06 + mouse.y * 0.18;
      const cy = Math.cos(yaw),
        sy = Math.sin(yaw),
        cp = Math.cos(pitch),
        sp = Math.sin(pitch);
      const scale = Math.min(w, h) / 21;
      const cx0 = w / 2,
        cy0 = h * 0.5;
      let minY = Infinity,
        maxY = -Infinity;
      for (let i = 0; i < n; i++) {
        const x = FACE_VERTICES[i * 3],
          y = FACE_VERTICES[i * 3 + 1],
          z = FACE_VERTICES[i * 3 + 2] - 2;
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const f = 34 / (34 - z2);
        const px = cx0 + x1 * scale * f;
        const py = cy0 - y1 * scale * f;
        proj[i * 3] = px;
        proj[i * 3 + 1] = py;
        proj[i * 3 + 2] = z2;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }

      // 스캔 라인 위치 (위 → 아래)
      const scanP = Math.min(1, cycleT / SCAN_TIME);
      const scanY = minY - 20 + (maxY - minY + 40) * easeInOut(scanP);
      const scanning = cycleT < SCAN_TIME + 0.3;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // 바깥 안내 원 (천천히 회전하는 눈금)
      const ringR = (maxY - minY) * 0.62;
      ctx.save();
      ctx.translate(cx0, cy0);
      ctx.rotate(t * 0.08);
      ctx.strokeStyle = `rgba(${BEIGE},0.14)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.stroke();
      for (let k = 0; k < 72; k++) {
        const a = (k / 72) * Math.PI * 2;
        const len = k % 6 === 0 ? 10 : 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * ringR, Math.sin(a) * ringR);
        ctx.lineTo(Math.cos(a) * (ringR - len), Math.sin(a) * (ringR - len));
        ctx.stroke();
      }
      ctx.restore();

      // 선
      ctx.lineWidth = 0.6;
      for (let e = 0; e < FACE_EDGES.length; e += 2) {
        const a = FACE_EDGES[e] * 3,
          b = FACE_EDGES[e + 1] * 3;
        const depth = (proj[a + 2] + proj[b + 2]) / 2;
        const my = (proj[a + 1] + proj[b + 1]) / 2;
        const near = scanning ? Math.max(0, 1 - Math.abs(my - scanY) / 38) : 0;
        const alpha = (video ? 0.05 : 0.07) + Math.max(0, (depth + 2) / 10) * 0.16 + near * 0.6;
        ctx.strokeStyle = `rgba(${BEIGE},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(proj[a], proj[a + 1]);
        ctx.lineTo(proj[b], proj[b + 1]);
        ctx.stroke();
      }

      // 점 (스캔 라인 · 마우스 근처는 밝고 크게)
      for (let i = 0; i < n; i++) {
        const px = proj[i * 3],
          py = proj[i * 3 + 1],
          z = proj[i * 3 + 2];
        const near = scanning ? Math.max(0, 1 - Math.abs(py - scanY) / 26) : 0;
        const dm = Math.hypot(px - mouse.px, py - mouse.py);
        const lens = Math.max(0, 1 - dm / 110);
        const r = 0.8 + Math.max(0, (z + 2) / 10) * 0.9 + near * 1.6 + lens * 1.8;
        const alpha = 0.25 + Math.max(0, (z + 2) / 10) * 0.45 + near * 0.5 + lens * 0.5;
        ctx.fillStyle = near > 0.5 || lens > 0.4 ? `rgba(255,248,236,${Math.min(1, alpha)})` : `rgba(${BEIGE},${Math.min(1, alpha)})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 스캔 라인
      if (scanning) {
        const left = cx0 - ringR * 1.05,
          right = cx0 + ringR * 1.05;
        const g = ctx.createLinearGradient(0, scanY - 60, 0, scanY);
        g.addColorStop(0, `rgba(${BEIGE},0)`);
        g.addColorStop(1, `rgba(${BEIGE},0.16)`);
        ctx.fillStyle = g;
        ctx.fillRect(left, scanY - 60, right - left, 60);
        const lg = ctx.createLinearGradient(left, 0, right, 0);
        lg.addColorStop(0, `rgba(${BEIGE},0)`);
        lg.addColorStop(0.5, `rgba(255,244,226,0.95)`);
        lg.addColorStop(1, `rgba(${BEIGE},0)`);
        ctx.strokeStyle = lg;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(left, scanY);
        ctx.lineTo(right, scanY);
        ctx.stroke();
      }

      // 마우스 돋보기 원
      if (mouse.px > 0) {
        ctx.strokeStyle = `rgba(${BEIGE},0.35)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.px, mouse.py, 110, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 분석 카드: 스캔 라인이 그 부위를 지나면 나타나고, 선으로 연결
      const fadeOut = cycleT > CYCLE - 0.6;
      items.forEach((item, i) => {
        const card = cardRefs.current[i];
        if (!card) return;
        const px = proj[item.point * 3],
          py = proj[item.point * 3 + 1];
        const shown = !fadeOut && (still || !scanning || scanY > py);
        card.dataset.on = shown ? "1" : "0";
        if (!shown) return;
        const cr = card.getBoundingClientRect();
        const wr = wrap.getBoundingClientRect();
        const ax = item.side === "left" ? cr.right - wr.left : cr.left - wr.left;
        const ay = cr.top - wr.top + cr.height / 2;
        ctx.strokeStyle = `rgba(${BEIGE},0.55)`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        const elbow = item.side === "left" ? ax + 24 : ax - 24;
        ctx.lineTo(elbow, ay);
        ctx.lineTo(ax, ay);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,248,236,1)";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${BEIGE},0.5)`;
        ctx.beginPath();
        ctx.arc(px, py, 7 + Math.sin(t * 4 + i) * 2, 0, Math.PI * 2);
        ctx.stroke();
      });

      if (!still) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [items, video]);

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      {video && (
        <video className="absolute inset-0 h-full w-full object-cover opacity-80" src={video} autoPlay muted loop playsInline />
      )}
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />
      {items.map((item, i) => (
        <div
          key={item.label}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          data-on="0"
          className={`scan-card absolute w-[92px] rounded-xl border border-white/15 bg-white/[0.06] px-2.5 py-2 backdrop-blur-md md:w-[150px] md:rounded-2xl md:px-3.5 md:py-3 ${
            item.side === "left" ? "left-0" : "right-0"
          }`}
          style={{ top: `${item.top}%`, ["--v" as string]: `${58 + ((i * 37) % 30)}%` }}
        >
          <p className="font-display text-[8px] tracking-[0.2em] text-[#e3cfae] uppercase md:text-[9px] md:tracking-[0.25em]">{item.en}</p>
          <p className="mt-0.5 text-[12px] font-medium text-white md:mt-1 md:text-[13px]">{item.label}</p>
          <span className="mt-1.5 block h-[2px] md:mt-2.5 md:h-[3px] overflow-hidden rounded-full bg-white/10">
            <span className="scan-bar block h-full rounded-full bg-gradient-to-r from-[#c9ae85] to-[#f3e3c8]" />
          </span>
        </div>
      ))}
    </div>
  );
}

function easeInOut(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
