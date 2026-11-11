// 로컬 칼럼 화면(브라우저 콘솔)에서 실행: 관리자 CSS 중 칼럼 본문에 걸리는 규칙만 뽑아 문자열로 돌려준다.
// device 를 "desktop" · "mobile" 로 한 번씩 돌려 extracted-desktop.css · extracted-mobile.css 로 저장한다.
const extract = async (device) => {
  document.querySelector(".pvc .column-preview-device").classList.add(device);
  const pc = document.querySelector(".pvc .column-content");
  const els = [pc, ...pc.querySelectorAll("*")];
  const anc = []; let a = pc.parentElement; while (a && !a.classList.contains("pvc")) { anc.push(a); a = a.parentElement; } anc.push(a);
  const strip = (s) => s.replace(/::?(before|after|marker|placeholder|selection|first-letter|first-line)\b/g, "").replace(/:(hover|focus|focus-visible|focus-within|active|visited)\b/g, "");
  const want = /column-(content|summary|tip|point|faq|table|image|gallery|video|code)|doctor-column-article|public-post-page|DoctorColumnArticle_/;
  const editorOnly = /tiptap|ProseMirror|column-editor|column-rich-editor|column-format|column-insert|column-block/;
  const other = device === "desktop" ? /\.mobile\b/ : /\.desktop\b/;
  const splitter = /,(?![^()]*[)])/;
  const hits = (list, s) => { try { const t = strip(s); return list.some((e) => e.matches(t)); } catch { return false; } };
  const out = [];
  const visit = (rules, wrap) => {
    for (const r of rules) {
      if (r instanceof CSSMediaRule) { visit(r.cssRules, [...wrap, "@media " + r.media.mediaText]); continue; }
      if (r instanceof CSSContainerRule) { visit(r.cssRules, [...wrap, "@container " + r.containerQuery]); continue; }
      if (r instanceof CSSLayerBlockRule) { visit(r.cssRules, [...wrap, "@layer " + r.name]); continue; }
      if (r instanceof CSSSupportsRule) { visit(r.cssRules, [...wrap, "@supports " + r.conditionText]); continue; }
      if (r instanceof CSSStyleRule) {
        const keep = r.selectorText.split(splitter).map((s) => s.trim())
          .filter((s) => (hits(els, s) ? true : hits(anc, s) ? false : want.test(s) && !editorOnly.test(s) && !other.test(s)));
        if (keep.length) out.push({ wrap, text: keep.join(", ") + " { " + r.style.cssText + " }" });
        continue;
      }
      if (r instanceof CSSKeyframesRule) out.push({ wrap, text: r.cssText });
    }
  };
  for (const f of ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]) {
    const txt = await (await fetch("/__admincss/" + f + ".css")).text();
    const sh = new CSSStyleSheet();
    sh.replaceSync(txt.replace(/@import\s+url\([^)]*\)[^;]*;/g, ""));
    visit(sh.cssRules, []);
  }
  document.querySelector(".pvc .column-preview-device").classList.remove(device);
  return out.map((o) => { let t = o.text; for (const w of [...o.wrap].reverse()) t = w + " { " + t + " }"; return t; }).join("\n");
};
// 콘솔에서 await extract("desktop") 처럼 부른다
globalThis.extract = extract;
