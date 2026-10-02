"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Field = { enabled: boolean; required: boolean };
export type SignupConfig = {
  enabled: boolean;
  fields: { phone: Field; birthday: Field; gender: Field; address: Field };
} | null;

type Tab = "login" | "signup";

const input =
  "h-12 w-full rounded-xl border border-ink/12 bg-white px-4 text-[15px] outline-none transition placeholder:text-taupe focus:border-mocha focus:ring-4 focus:ring-mocha/10";

async function send(action: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/member/${action}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string; status?: string };
  return { ok: res.ok, ...data };
}

// 로그인 / 회원가입 팝업 (탭으로 전환)
export default function MemberModal({ open, initialTab = "login", config, onClose }: {
  open: boolean;
  initialTab?: Tab;
  config: SignupConfig;
  onClose: () => void;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // 약관 '보기': 페이지를 떠나지 않고 이 창 위에 팝업으로
  const [policy, setPolicy] = useState<{ title: string; body: string } | null>(null);
  async function openPolicy(kind: "terms" | "privacy") {
    const title = kind === "terms" ? "이용약관" : "개인정보 수집 · 이용 동의";
    setPolicy({ title, body: "불러오는 중…" });
    try {
      const r = await fetch(`/api/policy/${kind}`);
      const j = (await r.json()) as { body?: string };
      setPolicy({ title, body: j.body || "내용을 불러오지 못했습니다." });
    } catch {
      setPolicy({ title, body: "내용을 불러오지 못했습니다." });
    }
  }

  useEffect(() => {
    if (!open) return;
    setTab(initialTab);
    setError("");
    setNotice("");
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, initialTab, onClose]);

  if (!open) return null;

  const switchTab = (t: Tab) => {
    setTab(t);
    setError("");
    setNotice("");
  };

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const r = await send("login", { identifier: form.get("identifier"), password: form.get("password") });
    setBusy(false);
    if (!r.ok) return setError(r.error ?? "로그인하지 못했습니다.");
    onClose();
    router.refresh();
  }

  async function onSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();
    if (get("password") !== get("passwordConfirm")) return setError("비밀번호가 서로 다릅니다.");
    if (!form.get("termsAgreed") || !form.get("privacyAgreed")) return setError("이용약관과 개인정보처리방침에 동의해주세요.");
    setBusy(true);
    setError("");
    const r = await send("signup", {
      username: get("username"),
      name: get("name"),
      email: get("email"),
      password: get("password"),
      phone: get("phone"),
      birthday: get("birthday"),
      gender: get("gender"),
      address: get("address"),
      termsAgreed: true,
      privacyAgreed: true,
      marketingAgreed: Boolean(form.get("marketingAgreed")),
    });
    setBusy(false);
    if (!r.ok) return setError(r.error ?? "가입하지 못했습니다.");
    if (r.status === "pending") {
      setNotice(r.message ?? "가입 신청이 완료되었습니다. 승인 후 로그인할 수 있습니다.");
      return setTab("login");
    }
    onClose();
    router.refresh();
  }

  const f = config?.fields;
  const req = (field?: Field) => (field?.required ? " *" : "");

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 backdrop-blur-[2px] sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={tab === "login" ? "로그인" : "회원가입"}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92svh] w-full overflow-y-auto rounded-t-[28px] bg-cream px-6 pt-10 pb-8 shadow-2xl sm:max-w-[440px] sm:rounded-[28px] sm:px-10 sm:pt-12 sm:pb-10"
      >
        <button type="button" onClick={onClose} aria-label="닫기" className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full text-xl text-muted transition hover:bg-ink/5 hover:text-ink">
          ×
        </button>

        <p className="text-center font-display text-2xl tracking-[0.18em]">PRAVEIL</p>
        <p className="mt-1 text-center text-[11px] tracking-[0.3em] text-muted">맑고고운의원</p>

        {/* 탭 */}
        <div role="tablist" className="mt-8 grid grid-cols-2 rounded-full bg-ink/5 p-1">
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => switchTab(t)}
              className={`rounded-full py-2.5 text-sm transition ${tab === t ? "bg-ink text-cream" : "text-muted hover:text-ink"}`}
            >
              {t === "login" ? "로그인" : "회원가입"}
            </button>
          ))}
        </div>

        {!config ? (
          <p className="mt-10 mb-4 text-center text-sm leading-relaxed text-muted">회원 기능을 준비 중입니다.</p>
        ) : tab === "login" ? (
          <form onSubmit={onLogin} className="mt-8 space-y-3">
            {notice && <p className="rounded-xl bg-gold/10 px-4 py-3 text-sm text-mocha">{notice}</p>}
            <input name="identifier" required autoComplete="username" placeholder="아이디 또는 이메일" className={input} />
            <input name="password" type="password" required autoComplete="current-password" placeholder="비밀번호" className={input} />
            {error && <p className="px-1 text-sm text-[#b4443a]">{error}</p>}
            <button disabled={busy} className="mt-3 h-12 w-full rounded-full bg-ink text-[15px] text-cream transition hover:bg-mocha disabled:opacity-60">
              {busy ? "확인 중…" : "로그인"}
            </button>
            <p className="pt-3 text-center text-sm text-muted">
              아직 회원이 아니신가요?{" "}
              <button type="button" onClick={() => switchTab("signup")} className="font-medium text-ink underline underline-offset-4">
                회원가입
              </button>
            </p>
          </form>
        ) : !config.enabled ? (
          <p className="mt-10 mb-4 text-center text-sm text-muted">현재 회원가입을 받고 있지 않습니다.</p>
        ) : (
          <form onSubmit={onSignup} className="mt-8 space-y-3">
            <input name="username" autoComplete="username" placeholder="아이디 * (영문 소문자 · 숫자 4~30자)" pattern="[a-z0-9][a-z0-9._\-]{3,29}" required className={input} />
            <input name="name" required minLength={2} autoComplete="name" placeholder="이름 *" className={input} />
            <input name="email" type="email" required autoComplete="email" placeholder="이메일 *" className={input} />
            {f?.phone.enabled && <input name="phone" type="tel" required={f.phone.required} autoComplete="tel" placeholder={`휴대폰 번호${req(f.phone)}`} className={input} />}
            {f?.birthday.enabled && (
              <label className="block text-xs text-muted">
                생년월일{req(f.birthday)}
                <input name="birthday" type="date" required={f.birthday.required} className={`${input} mt-1`} />
              </label>
            )}
            {f?.gender.enabled && (
              <select name="gender" required={f.gender.required} defaultValue="" className={input}>
                <option value="" disabled>
                  성별{req(f.gender)}
                </option>
                <option value="female">여성</option>
                <option value="male">남성</option>
              </select>
            )}
            {f?.address.enabled && <input name="address" required={f.address.required} autoComplete="street-address" placeholder={`주소${req(f.address)}`} className={input} />}
            <input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="비밀번호 (8자 이상) *" className={input} />
            <input name="passwordConfirm" type="password" required minLength={8} autoComplete="new-password" placeholder="비밀번호 확인 *" className={input} />

            <div className="space-y-2.5 rounded-2xl bg-ivory px-4 py-4 text-sm">
              {[
                { name: "termsAgreed", label: "이용약관 동의 (필수)", href: "/terms" },
                { name: "privacyAgreed", label: "개인정보 수집 · 이용 동의 (필수)", href: "/privacy" },
                { name: "marketingAgreed", label: "이벤트 · 소식 받기 (선택)" },
              ].map((c) => (
                <label key={c.name} className="flex items-center gap-2.5">
                  <input type="checkbox" name={c.name} className="h-4 w-4 accent-[#3a2f28]" />
                  <span className="flex-1">{c.label}</span>
                  {c.href && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        openPolicy(c.href === "/terms" ? "terms" : "privacy");
                      }}
                      className="text-xs text-muted underline underline-offset-2"
                    >
                      보기
                    </button>
                  )}
                </label>
              ))}
            </div>

            {error && <p className="px-1 text-sm text-[#b4443a]">{error}</p>}
            <button disabled={busy} className="mt-2 h-12 w-full rounded-full bg-ink text-[15px] text-cream transition hover:bg-mocha disabled:opacity-60">
              {busy ? "가입 중…" : "가입하기"}
            </button>
          </form>
        )}

        {/* 약관 팝업 */}
        {policy && (
          <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 sm:items-center sm:p-6" onClick={() => setPolicy(null)}>
            <div
              role="dialog"
              aria-modal="true"
              aria-label={policy.title}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85svh] w-full flex-col overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:max-w-[560px] sm:rounded-[24px]"
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <p className="text-[17px] font-semibold">{policy.title}</p>
                <button type="button" onClick={() => setPolicy(null)} aria-label="닫기" className="grid h-9 w-9 place-items-center rounded-full text-xl text-muted hover:bg-ink/5 hover:text-ink">
                  ×
                </button>
              </div>
              <div data-lenis-prevent className="overflow-y-auto overscroll-contain px-6 py-5 text-[14px] leading-relaxed whitespace-pre-line text-ink/80">
                {policy.body}
              </div>
              <div className="border-t border-line p-4">
                <button type="button" onClick={() => setPolicy(null)} className="h-12 w-full rounded-full bg-ink text-[15px] text-cream">
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
