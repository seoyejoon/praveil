"use client";

import { useEffect, useRef } from "react";
import Logo, { logoShapes } from "@/components/Logo";
import { reducedMotion } from "@/lib/gsap";

// 첫 화면: 어두운 질감 벽 + 금속 간판 로고 (사진 없이 WebGL로 직접 그림)
// - 들어오면 조명이 켜지듯 벽이 서서히 밝아지고, 로고 위로 빛이 한 번 지나감
// - 마우스를 따라 조명이 움직이며 벽 질감 · 로고 반사 · 그림자가 함께 바뀜 (터치 기기는 조명이 천천히 저절로 움직임)
// - WebGL 이 안 되면 같은 색의 평면 로고가 그대로 보임

const LOGO = logoShapes.stacked;
const [, , VBW, VBH] = LOGO.viewBox.split(" ").map(Number);

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;       // 캔버스 (기기 픽셀)
uniform float uDpr;
uniform sampler2D uNoise;
uniform sampler2D uLogo;
uniform vec2 uLogoTexel;
uniform vec4 uRect;      // 로고 텍스처 위치 (CSS px, 왼쪽 위 기준)
uniform vec3 uLight;     // 움직이는 조명 (CSS px)
uniform float uFall;
uniform float uOn;       // 조명 켜짐 0~1
uniform float uSweep;    // 로고 위를 지나가는 빛

// 같은 질감을 돌리고 크기를 바꿔 두 번 겹쳐, 반복 무늬 · 격자 느낌을 없앰
const mat2 ROT = mat2(0.8, -0.6, 0.6, 0.8);
float noiseH(vec2 uv){ return texture2D(uNoise, uv).r * 0.6 + texture2D(uNoise, ROT * uv * 1.7 + 0.37).r * 0.4; }

void main(){
  vec2 size = uRes / uDpr;
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;

  // 벽 질감 (부클레 · 스타코 느낌): 높이 → 기울기 → 법선
  vec2 nuv = p / (512.0 * 0.9);
  float e = 1.0 / 512.0;
  float h = noiseH(nuv);
  float hx = noiseH(nuv + vec2(e, 0.0)) - noiseH(nuv - vec2(e, 0.0));
  float hy = noiseH(nuv + vec2(0.0, e)) - noiseH(nuv - vec2(0.0, e));
  vec3 N = normalize(vec3(-hx * 4.2, -hy * 4.2, 1.0));

  // 로고 (R: 글자, G: 모서리용 살짝 흐림, B: 그림자용 많이 흐림)
  vec2 luv = (p - uRect.xy) / uRect.zw;
  float inside = step(0.0, luv.x) * step(luv.x, 1.0) * step(0.0, luv.y) * step(luv.y, 1.0);
  vec4 T = texture2D(uLogo, luv) * inside;
  float m = T.r;
  float gx = texture2D(uLogo, luv + vec2(uLogoTexel.x, 0.0)).g - texture2D(uLogo, luv - vec2(uLogoTexel.x, 0.0)).g;
  float gy = texture2D(uLogo, luv + vec2(0.0, uLogoTexel.y)).g - texture2D(uLogo, luv - vec2(0.0, uLogoTexel.y)).g;
  vec3 NL = normalize(vec3(-gx * 4.0, -gy * 4.0, 1.0) * inside + vec3(0.0, 0.0, 1.0 - inside));

  vec3 lc = vec3(1.0, 0.86, 0.70);
  vec3 P = vec3(p, h * 6.0 + m * 14.0);
  vec3 toL = uLight - P;
  float d = length(toL);
  vec3 Ld = toL / d;
  float att = 1.0 / (1.0 + pow(d / uFall, 2.0));

  // 위에서 벽을 스치듯 비추는 조명 (질감이 살아남)
  vec3 Lt = normalize(vec3(0.0, -1.0, 0.45));
  float cx = (p.x - size.x * 0.5) / (size.x * 0.42);
  float topMask = exp(-cx * cx) * (1.0 - smoothstep(0.0, size.y * 1.05, p.y));

  // 벽
  vec3 wallAlb = vec3(0.15, 0.118, 0.092) * (0.85 + 0.3 * h);
  float dif = max(dot(N, Ld), 0.0) * att * 2.2 + max(dot(N, Lt), 0.0) * topMask * 0.38;
  vec2 sdir = normalize(p - uLight.xy + 0.001);
  float shadow = texture2D(uLogo, luv - sdir * 9.0 / uRect.zw).b * inside;
  vec3 wall = wallAlb * (0.03 + dif * (1.0 - 0.5 * shadow)) * lc;

  // 로고: 샴페인 골드 금속
  vec3 gold = vec3(0.78, 0.60, 0.38);
  vec3 V = vec3(0.0, 0.0, 1.0);
  float difL = max(dot(NL, Ld), 0.0) * att * 1.1 + max(dot(NL, Lt), 0.0) * topMask * 0.3;
  float spec = pow(max(dot(NL, normalize(Ld + V)), 0.0), 48.0) * att * 1.6;
  float specTop = pow(max(dot(NL, normalize(Lt + V)), 0.0), 16.0) * topMask * 0.35;
  float brushed = 0.8 + 0.4 * texture2D(uNoise, vec2(p.x / 1400.0, p.y / 2.5)).r;
  float sweep = exp(-pow((luv.x + luv.y * 0.5 - uSweep) * 5.0, 2.0));
  vec3 logo = gold * (0.08 + difL) + gold * lc * ((spec + specTop) * brushed * 1.4 + sweep * 1.1);

  vec3 col = mix(wall, logo, m) * uOn;

  // 가장자리 어둡게
  vec2 q = p / size - 0.5;
  col *= 1.0 - 1.4 * dot(q * vec2(0.9, 1.1), q * vec2(0.9, 1.1));

  col = col / (1.0 + col * 0.5);
  col = pow(col, vec3(1.0 / 2.2));
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

// 이어 붙여도 티 나지 않는 벽 질감 (값 노이즈를 여러 겹)
function makeNoise(size: number) {
  const out = new Uint8Array(size * size);
  const acc = new Float32Array(size * size);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const layers: [number, number, boolean][] = [
    [16, 0.3, false],
    [32, 0.25, true],
    [64, 0.25, false],
    [128, 0.2, false],
  ];
  for (const [cells, amp, ridged] of layers) {
    const g = Array.from({ length: cells * cells }, rnd);
    const step = size / cells;
    for (let y = 0; y < size; y++) {
      const fy = y / step,
        y0 = Math.floor(fy),
        ty = fy - y0,
        sy = ty * ty * (3 - 2 * ty);
      for (let x = 0; x < size; x++) {
        const fx = x / step,
          x0 = Math.floor(fx),
          tx = fx - x0,
          sx = tx * tx * (3 - 2 * tx);
        const a = g[(y0 % cells) * cells + (x0 % cells)],
          b = g[(y0 % cells) * cells + ((x0 + 1) % cells)],
          c = g[((y0 + 1) % cells) * cells + (x0 % cells)],
          d = g[((y0 + 1) % cells) * cells + ((x0 + 1) % cells)];
        let v = a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
        if (ridged) v = 1 - Math.abs(v * 2 - 1);
        acc[y * size + x] += v * amp;
      }
    }
  }
  for (let i = 0; i < acc.length; i++) out[i] = Math.max(0, Math.min(255, acc[i] * 255));
  return out;
}

// 가로 · 세로로 3번씩 상자 흐림 ≈ 가우시안
function blur(src: Float32Array, w: number, h: number, r: number) {
  const a = src.slice();
  const b = new Float32Array(src.length);
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) {
      let s = 0;
      for (let x = -r; x <= r; x++) s += a[y * w + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) {
        b[y * w + x] = s / (2 * r + 1);
        s += a[y * w + Math.min(w - 1, x + r + 1)] - a[y * w + Math.max(0, x - r)];
      }
    }
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let y = -r; y <= r; y++) s += b[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = s / (2 * r + 1);
        s += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x];
      }
    }
  }
  return a;
}

const LW = 1000; // 로고 텍스처 폭 (글자 부분)
const PAD = 60;

function makeLogo() {
  const lh = Math.round((LW * VBH) / VBW);
  const w = LW + PAD * 2,
    h = lh + PAD * 2;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.translate(PAD, PAD);
  g.scale(LW / VBW, lh / VBH);
  g.fill(new Path2D(LOGO.d), "evenodd");
  const img = g.getImageData(0, 0, w, h).data;
  const sharp = new Float32Array(w * h);
  for (let i = 0; i < sharp.length; i++) sharp[i] = img[i * 4 + 3] / 255;
  const soft = blur(sharp, w, h, 2);
  const shadow = blur(sharp, w, h, 9);
  const out = new Uint8Array(w * h * 4);
  for (let i = 0; i < sharp.length; i++) {
    out[i * 4] = sharp[i] * 255;
    out[i * 4 + 1] = soft[i] * 255;
    out[i * 4 + 2] = shadow[i] * 255;
    out[i * 4 + 3] = 255;
  }
  return { data: out, w, h };
}

export default function LogoWall({ onReady }: { onReady?: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u = {
      res: U("uRes"),
      dpr: U("uDpr"),
      rect: U("uRect"),
      light: U("uLight"),
      fall: U("uFall"),
      on: U("uOn"),
      sweep: U("uSweep"),
      texel: U("uLogoTexel"),
    };

    // 텍스처: 벽 질감 (반복) + 로고
    const NS = 512;
    const noiseTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, noiseTex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, NS, NS, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, makeNoise(NS));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(U("uNoise"), 0);

    const logo = makeLogo();
    const logoTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, logoTex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, logo.w, logo.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, logo.data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(U("uLogo"), 1);
    gl.uniform2f(u.texel, 1 / logo.w, 1 / logo.h);

    let w = 0,
      h = 0,
      dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 2 : 1.5);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      // 로고 크기 · 위치 (화면 가운데보다 살짝 위)
      const lw = w < 768 ? w * 0.5 : Math.min(400, Math.max(240, w * 0.2));
      const s = lw / LW;
      const rw = logo.w * s,
        rh = logo.h * s;
      gl.uniform4f(u.rect, w / 2 - rw / 2, h * 0.44 - rh / 2, rw, rh);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.dpr, dpr);
      gl.uniform1f(u.fall, Math.max(w, h) * 0.42);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const still = reducedMotion();
    const fine = window.matchMedia("(pointer: fine)").matches;
    const light = { x: w * 0.5, y: h * 0.3, tx: w * 0.5, ty: h * 0.3, hover: false };
    // 글자 층이 위에 덮여 있어 창 전체에서 마우스를 받고, 이 화면 안일 때만 조명을 옮김
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left,
        y = e.clientY - r.top;
      light.hover = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (!light.hover) return;
      light.tx = (x / r.width) * w;
      light.ty = (y / r.height) * h;
    };
    const onLeave = () => (light.hover = false);
    if (fine && !still) {
      window.addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    let raf = 0,
      visible = true,
      ready = false;
    const start = performance.now();
    let last = 0;
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf && !still) raf = requestAnimationFrame(draw);
    });
    io.observe(wrap);

    function draw(now: number) {
      raf = 0;
      const t = (now - start) / 1000;
      // 조명이 켜지는 등장 (0.3초 뒤부터 2초 동안)
      const on = still ? 1 : easeOut(clamp01((t - 0.3) / 2));
      // 마우스가 없으면 조명이 천천히 저절로 움직임
      if (!light.hover) {
        light.tx = w * (0.5 + Math.sin(t * 0.35) * 0.22);
        light.ty = h * (0.34 + Math.cos(t * 0.27) * 0.1);
      }
      // 화면 속도(fps)와 상관없이 같은 빠르기로 따라감
      const k = 1 - Math.exp(-Math.min(0.1, t - last) * 3.5);
      last = t;
      light.x += (light.tx - light.x) * k;
      light.y += (light.ty - light.y) * k;
      gl!.uniform3f(u.light, light.x, light.y, Math.min(w, h) * 0.45);
      gl!.uniform1f(u.on, on);
      gl!.uniform1f(u.sweep, still ? -2 : -0.6 + clamp01((t - 1.6) / 1.8) * 2.4);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!ready) {
        ready = true;
        canvas!.style.opacity = "1";
        onReady?.();
      }
      if (visible && !still) raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [onReady]);

  return (
    <div ref={wrapRef} className="absolute inset-0 bg-[#1b1714]">
      {/* WebGL 이 안 될 때 보이는 평면 로고 */}
      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(60%_50%_at_50%_30%,#3a322b,#1b1714)] pb-[12vh]">
        <Logo variant="stacked" className="w-[50vw] text-[#b9a07a] md:w-[20vw] md:max-w-[400px] md:min-w-[240px]" />
      </div>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700" />
    </div>
  );
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
function easeOut(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
