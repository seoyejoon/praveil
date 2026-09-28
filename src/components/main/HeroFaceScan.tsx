"use client";

import { useEffect, useRef, type RefObject } from "react";
import { FACE_EDGES } from "@/content/face-mesh";
import { reducedMotion } from "@/lib/gsap";

// 첫 화면 영상 위에 그리는 피부 분석 효과
// - 영상 속 얼굴 위치(미리 뽑아 둔 468개 점, 15fps)를 영상 재생 시간에 맞춰 따라감
// - 흐름(10초 반복): 잔잔 → 스캔 선이 이마에서 턱까지 → 그물선 유지 + 분석 점 표시 → 사라짐
// - 마우스를 얼굴 위에 올리면 그 주변 그물선이 밝게 보임

export type HeroPoint = { label: string; en: string; point: number };

const CYCLE = 10;
const SCAN_FROM = 1.2;
const SCAN_TO = 3.8;
const HOLD_TO = 7.6;
const FADE_TO = 8.6;
const GOLD = "182,136,80";
const LIGHT = "255,246,230";

// 얼굴 윤곽 (MediaPipe face oval)
const OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

type FaceData = { frames: number; n: number; fps: number; pts: Float32Array; depth: Float32Array };

async function loadFace(url: string): Promise<FaceData> {
  const buf = await (await fetch(url)).arrayBuffer();
  const hdr = new Uint16Array(buf, 0, 4);
  const [frames, n, q, fps] = hdr;
  const first = new Uint16Array(buf, 8, n * 2);
  const deltas = new Int8Array(buf, 8 + n * 4, (frames - 1) * n * 2);
  const depthRaw = new Uint8Array(buf, 8 + n * 4 + (frames - 1) * n * 2, n);
  const pts = new Float32Array(frames * n * 2);
  const cur = Int32Array.from(first);
  for (let f = 0; f < frames; f++) {
    if (f > 0) for (let k = 0; k < n * 2; k++) cur[k] += deltas[(f - 1) * n * 2 + k];
    for (let k = 0; k < n * 2; k++) pts[f * n * 2 + k] = cur[k] / q;
  }
  // 0 = 먼 쪽(귀 · 옆얼굴), 1 = 가까운 쪽(코 · 볼)
  const depth = Float32Array.from(depthRaw, (v) => 1 - v / 255);
  return { frames, n, fps, pts, depth };
}

export default function HeroFaceScan({
  videoRef,
  dataUrl,
  points,
  onPhase,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  dataUrl: string;
  points: HeroPoint[];
  onPhase?: (scanning: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas?.parentElement;
    if (!canvas || !wrap || reducedMotion()) return;
    const ctx = canvas.getContext("2d")!;
    let face: FaceData | null = null;
    let raf = 0,
      w = 0,
      h = 0,
      dpr = 1,
      visible = true,
      start = 0,
      lastScan = false;
    let cur = new Float32Array(0);
    const mouse = { x: -9999, y: -9999, a: 0 };

    loadFace(dataUrl)
      .then((d) => {
        face = d;
        cur = new Float32Array(d.n * 2);
        start = performance.now();
      })
      .catch(() => {});

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) {
      window.addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(wrap);

    // 알파값별로 선을 묶어 한 번에 그림
    const BUCKETS = 12;
    const paths: Path2D[] = [];

    function draw(now: number) {
      raf = 0;
      if (!visible) return;
      raf = requestAnimationFrame(draw);
      const video = videoRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!face || !video || !video.videoWidth) return;

      // 영상이 화면을 덮는 방식(object-cover)과 똑같이 좌표 변환
      const vw = video.videoWidth,
        vh = video.videoHeight;
      const s = Math.max(w / vw, h / vh);
      const dw = vw * s,
        dh = vh * s;
      const posX = w < 1024 ? 0.52 : 0.5;
      const ox = (w - dw) * posX,
        oy = (h - dh) / 2;

      // 영상 시간 → 얼굴 점 (앞뒤 프레임 사이를 부드럽게)
      const { n, fps, frames, pts, depth } = face;
      const ft = Math.min(frames - 1.001, video.currentTime * fps);
      const f0 = Math.floor(ft),
        k = ft - f0;
      const a0 = f0 * n * 2,
        a1 = (f0 + 1) * n * 2;
      let minY = Infinity,
        maxY = -Infinity,
        minX = Infinity,
        maxX = -Infinity;
      for (let i = 0; i < n * 2; i += 2) {
        const x = ox + (pts[a0 + i] + (pts[a1 + i] - pts[a0 + i]) * k) * dw;
        const y = oy + (pts[a0 + i + 1] + (pts[a1 + i + 1] - pts[a0 + i + 1]) * k) * dh;
        cur[i] = x;
        cur[i + 1] = y;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }

      // 흐름
      const c = ((now - start) / 1000) % CYCLE;
      const scanP = clamp01((c - SCAN_FROM) / (SCAN_TO - SCAN_FROM));
      const scanning = c > SCAN_FROM && c < SCAN_TO + 0.2;
      const pad = (maxY - minY) * 0.08;
      const scanY = minY - pad + (maxY - minY + pad * 2) * easeInOut(scanP);
      // 그물선 전체 밝기: 스캔 동안 켜지고, 유지 뒤 서서히 사라짐
      const meshOn = c < SCAN_FROM ? 0 : c < HOLD_TO ? 1 : 1 - clamp01((c - HOLD_TO) / (FADE_TO - HOLD_TO));
      if (scanning !== lastScan) {
        lastScan = scanning;
        onPhase?.(scanning);
      }

      // 마우스 돋보기 (얼굴 근처일 때만)
      const onFace = mouse.x > minX - 60 && mouse.x < maxX + 60 && mouse.y > minY - 60 && mouse.y < maxY + 60;
      mouse.a += ((onFace ? 1 : 0) - mouse.a) * 0.08;
      const lensR = (maxX - minX) * 0.38;

      for (let b = 0; b < BUCKETS; b++) paths[b] = new Path2D();
      for (let e = 0; e < FACE_EDGES.length; e += 2) {
        const p = FACE_EDGES[e] * 2,
          q = FACE_EDGES[e + 1] * 2;
        const x1 = cur[p],
          y1 = cur[p + 1],
          x2 = cur[q],
          y2 = cur[q + 1];
        const my = (y1 + y2) / 2,
          mx = (x1 + x2) / 2;
        const d = (depth[FACE_EDGES[e]] + depth[FACE_EDGES[e + 1]]) / 2;
        // 스캔 선이 지나간 곳만 켜짐, 선 근처는 더 밝게
        const passed = my < scanY || scanP >= 1 ? 1 : 0;
        const band = scanning ? Math.max(0, 1 - Math.abs(my - scanY) / ((maxY - minY) * 0.07)) : 0;
        const lens = mouse.a > 0.01 ? Math.max(0, 1 - Math.hypot(mx - mouse.x, my - mouse.y) / lensR) * mouse.a : 0;
        const alpha = passed * meshOn * (0.22 + d * 0.38) + band * 0.9 + lens * 0.8;
        if (alpha < 0.02) continue;
        const bi = Math.min(BUCKETS - 1, Math.floor(alpha * BUCKETS));
        paths[bi].moveTo(x1, y1);
        paths[bi].lineTo(x2, y2);
      }
      ctx.lineWidth = w < 768 ? 0.6 : 0.8;
      for (let b = 0; b < BUCKETS; b++) {
        const al = Math.min(1, (b + 0.5) / BUCKETS);
        const bright = b > BUCKETS * 0.65;
        // 밝은 선(스캔 선 근처 · 돋보기)은 금빛으로 번지게
        ctx.shadowBlur = bright ? 8 : 0;
        ctx.shadowColor = `rgba(${GOLD},0.9)`;
        ctx.strokeStyle = bright ? `rgba(${LIGHT},${al})` : `rgba(${GOLD},${al})`;
        ctx.stroke(paths[b]);
      }
      ctx.shadowBlur = 0;

      // 얼굴 윤곽: 스캔 선이 지나간 만큼 빛나며 그려짐
      if (meshOn > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, scanP >= 1 ? h : scanY);
        ctx.clip();
        ctx.beginPath();
        OVAL.forEach((i, j) => (j ? ctx.lineTo(cur[i * 2], cur[i * 2 + 1]) : ctx.moveTo(cur[i * 2], cur[i * 2 + 1])));
        ctx.closePath();
        ctx.shadowColor = `rgba(${GOLD},0.9)`;
        ctx.shadowBlur = 14;
        ctx.strokeStyle = `rgba(${LIGHT},${0.85 * meshOn})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // 스캔 선: 얼굴 폭만큼, 양 끝은 흐리게
      if (scanning && scanP > 0 && scanP < 1) {
        const l = minX - (maxX - minX) * 0.12,
          r = maxX + (maxX - minX) * 0.12;
        // 선 위쪽으로 번지는 빛 (가장자리는 둥글게 흐려짐)
        ctx.save();
        ctx.translate((l + r) / 2, scanY);
        ctx.scale((r - l) / 2, (maxY - minY) * 0.2);
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        glow.addColorStop(0, `rgba(${GOLD},0.32)`);
        glow.addColorStop(1, `rgba(${GOLD},0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(-1, -1, 2, 1);
        ctx.restore();
        const lg = ctx.createLinearGradient(l, 0, r, 0);
        lg.addColorStop(0, `rgba(${LIGHT},0)`);
        lg.addColorStop(0.2, `rgba(${LIGHT},0.95)`);
        lg.addColorStop(0.8, `rgba(${LIGHT},0.95)`);
        lg.addColorStop(1, `rgba(${LIGHT},0)`);
        ctx.save();
        ctx.shadowColor = `rgba(${GOLD},1)`;
        ctx.shadowBlur = 22;
        ctx.strokeStyle = lg;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(l, scanY);
        ctx.lineTo(r, scanY);
        ctx.stroke();
        ctx.restore();
      }

      // 분석 점 + 표시: 스캔이 끝나면 차례로 나타남
      // 태블릿 이하: 점 바로 옆에 표시 (오른쪽에 줄 세울 자리가 없음)
      const mobile = w < 1024;
      points.forEach((pt, i) => {
        const tag = tagRefs.current[i];
        if (!tag) return;
        const appear = SCAN_TO + 0.2 + i * 0.45;
        const on = c > appear && c < HOLD_TO;
        tag.dataset.on = on ? "1" : "0";
        if (!on) return;
        const px = cur[pt.point * 2],
          py = cur[pt.point * 2 + 1];
        // PC: 얼굴 오른쪽으로 줄 세움 / 모바일: 점 바로 옆
        const tx = mobile ? Math.min(w - tag.offsetWidth - 12, px + 18) : maxX + (maxX - minX) * 0.28;
        const ty = mobile ? py - tag.offsetHeight / 2 : minY + (maxY - minY) * (0.12 + i * 0.22);
        tag.style.transform = `translate(${tx}px, ${ty}px)`;
        const k = clamp01((c - appear) / 0.5);
        ctx.strokeStyle = `rgba(${GOLD},${0.8 * k})`;
        ctx.lineWidth = 1;
        if (!mobile) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          const ex = px + (tx - px) * easeInOut(k);
          const ey = py + (ty + tag.offsetHeight / 2 - py) * easeInOut(k);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${LIGHT},1)`;
        ctx.save();
        ctx.shadowColor = `rgba(${GOLD},1)`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        ctx.arc(px, py, 7 + Math.sin(now / 250 + i) * 2.5, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [videoRef, dataUrl, points, onPhase]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      {points.map((pt, i) => (
        <div
          key={pt.label}
          ref={(el) => {
            tagRefs.current[i] = el;
          }}
          data-on="0"
          aria-hidden
          className="hero-tag pointer-events-none absolute top-0 left-0 flex items-center gap-2 rounded-full border border-white/70 bg-white/80 md:bg-white/55 py-1.5 pr-3.5 pl-2 shadow-[0_8px_24px_-12px_rgba(125,102,73,0.45)] backdrop-blur-md md:py-2 md:pr-4 md:pl-2.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="text-[11px] font-medium text-ink md:text-[13px]">{pt.label}</span>
          <span className="hidden font-display text-[9px] tracking-[0.2em] text-mocha uppercase md:inline">{pt.en}</span>
        </div>
      ))}
    </>
  );
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
function easeInOut(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
