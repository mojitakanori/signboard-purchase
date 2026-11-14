/* ページ別ロジック。body[data-page] に対応する init_xxx が common.js から呼ばれる */
const $ = (s, r = document) => r.querySelector(s);

/* ---------- HOME ---------- */
function init_home() {}

/* ---------- PRODUCTS ---------- */
function init_products() {
  breadcrumb([["中古看板販売"]]);
  const f = $("#filterForm"), grid = $("#productGrid");
  f.cat.innerHTML = `<option value="">すべて</option>` + TYPES.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");
  if (qs("cat")) f.cat.value = qs("cat");
  const bands = { "": [0, Infinity], a: [0, 50000], b: [50000, 100000], c: [100000, 300000], d: [300000, Infinity] };
  const apply = () => {
    const kw = f.kw.value.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      const t = typeOf(p.cat).name;
      const hit = !kw || [p.name, p.no, t, p.material, p.desc].join(" ").toLowerCase().includes(kw);
      const [lo, hi] = bands[f.price.value];
      return hit && (!f.cat.value || p.cat === f.cat.value) && p.price >= lo && p.price < hi && (!f.status.value || p.status === f.status.value);
    });
    const s = f.sort.value;
    list.sort((a, b) => s === "low" ? a.price - b.price : s === "high" ? b.price - a.price : b.date.localeCompare(a.date));
    $("#count").textContent = list.length;
    grid.innerHTML = list.length ? list.map(productCard).join("") : "";
    $("#noResult").hidden = list.length > 0;
  };
  f.addEventListener("input", apply); f.addEventListener("change", apply);
  f.addEventListener("submit", (e) => { e.preventDefault(); apply(); });
  f.addEventListener("reset", () => setTimeout(apply));
  apply();
}

/* ---------- PRODUCT DETAIL ---------- */
function init_product_detail() {
  const p = PRODUCTS.find((x) => x.id === qs("id")) || PRODUCTS[0];
  const t = typeOf(p.cat);
  document.title = `${p.name}｜中古看板販売｜${SITE.name}`;
  breadcrumb([["中古看板販売", "products.html"], [p.name]]);
  const sold = p.status === "sold";
  const rows = [["商品番号", p.no], ["看板の種類", t.name], ["サイズ", p.size], ["材質・仕様", p.material], ["使用年数", p.years], ["商品の状態", CONDITION[p.condition]],
    ["傷・劣化など", p.damage], ["保管場所", p.location], ["引き渡し条件", p.delivery]];
  const related = PRODUCTS.filter((x) => x.id !== p.id && x.cat === p.cat).concat(PRODUCTS.filter((x) => x.id !== p.id && x.cat !== p.cat && x.status !== "sold")).slice(0, 4);
  $("#content").innerHTML = `
  <div class="notice">※ サンプルデータです。実在の商品・価格ではありません。</div>
  <div class="pd-layout">
    <div class="gallery"><div class="main"><img id="mainImg" src="${prodImg(p, 0)}" alt="${escHtml(p.name)}"></div>
      <div class="thumbs">${[0, 1, 2, 3].map((i) => `<button class="${i ? "" : "on"}" data-i="${i}" aria-label="写真${i + 1}"><img src="${prodImg(p, i)}" alt=""></button>`).join("")}</div></div>
    <div class="pd-info"><span class="tag">${t.name}</span><h1>${escHtml(p.name)}</h1>
      <div class="meta" style="font-size:13px;color:var(--sub)">商品番号：${p.no}　<span class="status ${p.status}" style="position:static;display:inline-block">${STATUS[p.status]}</span></div>
      <div class="pd-price">${yen(p.price)}<small> （税込・サンプル価格）</small></div>
      <table class="spec">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${escHtml(v)}</td></tr>`).join("")}</table>
      <div class="pd-btns">
        <a class="btn btn-primary btn-lg" href="contact.html?product=${p.id}">${icon("mail")}${sold ? "類似商品について問い合わせる" : "この商品について問い合わせる"}</a>
        <a class="btn btn-line" href="${SITE.lineUrl}">${icon("chat")}LINEで問い合わせ</a>
        ${SITE.tel ? `<a class="btn btn-outline" href="tel:${SITE.tel.replace(/-/g, "")}">${icon("phone")}${SITE.tel}</a>` : ""}</div></div>
  </div>
  <div class="desc-block"><h2>商品説明</h2><p>${escHtml(p.desc)}</p></div>
  <div class="desc-block"><h2>関連商品</h2><div class="grid grid-4 compact">${related.map(productCard).join("")}</div></div>`;
  document.querySelector(".thumbs").onclick = (e) => {
    const b = e.target.closest("button"); if (!b) return;
    document.querySelectorAll(".thumbs button").forEach((x) => x.classList.toggle("on", x === b));
    $("#mainImg").src = prodImg(p, +b.dataset.i);
  };
}

/* ---------- RESULTS ---------- */
function init_results() {
  breadcrumb([["買取実績"]]);
  $("#resultGrid").innerHTML = RESULTS.map(resultCard).join("");
}
function init_result_detail() {
  const r = RESULTS.find((x) => x.id === qs("id")) || RESULTS[0];
  document.title = `${r.title}｜買取実績｜${SITE.name}`;
  breadcrumb([["買取実績", "results.html"], [r.title]]);
  const t = TYPES.find((x) => x.kind === r.kind);
  $("#content").innerHTML = `
  <div class="notice">※ サンプル事例です。実在の実績ではありません。</div>
  <h1 style="font-size:26px;color:var(--navy);margin-bottom:12px">${escHtml(r.title)}</h1>
  <table class="spec"><tr><th>看板の種類</th><td>${r.type}</td></tr><tr><th>サイズ</th><td>${r.size}</td></tr><tr><th>買取地域</th><td>${r.area}</td></tr><tr><th>買取時期</th><td>${r.period}</td></tr></table>
  <div class="desc-block"><h2>買取・撤去の概要</h2><p>${escHtml(r.overview)}</p></div>
  <div class="desc-block"><h2>作業前後の写真</h2><div class="ba"><figure><figcaption>BEFORE</figcaption><img src="${sbImg(r.kind, t.label, r.seed)}" alt="作業前"></figure><figure><figcaption>AFTER</figcaption><img src="${sbImg("empty", "", 0)}" alt="作業後"></figure></div></div>
  <div class="desc-block"><h2>作業内容</h2><ol class="work-list">${r.works.map((w) => `<li>${w}</li>`).join("")}</ol></div>
  <div style="margin-top:40px">${ctaSection("同じような看板をお持ちですか？まずは無料査定へ")}</div>
  <div class="desc-block"><h2>ほかの買取実績</h2><div class="grid grid-3">${RESULTS.filter((x) => x.id !== r.id).slice(0, 3).map(resultCard).join("")}</div></div>`;
}

/* ---------- COLUMN ---------- */
function init_column() {
  breadcrumb([["お役立ち記事"]]);
  const per = 4; let page = 1;
  const draw = () => {
    $("#articleGrid").innerHTML = ARTICLES.slice((page - 1) * per, page * per).map(articleCard).join("");
    renderPagination($("#pager"), ARTICLES.length, page, per, (n) => { page = n; draw(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  };
  draw();
}
function init_column_detail() {
  const a = ARTICLES.find((x) => x.id === qs("id")) || ARTICLES[0];
  document.title = `${a.title}｜${SITE.name}`;
  breadcrumb([["お役立ち記事", "column.html"], [a.title]]);
  const body = a.sections.map((s, i) => `<h2 id="s${i}">${s.h}</h2>${s.p.map((x) => `<p>${x}</p>`).join("")}${i === 1 ? ctaSection("看板の売却・撤去、まずは無料査定へ", "inline") : ""}`).join("");
  const rel = ARTICLES.filter((x) => x.id !== a.id).slice(0, 3);
  $("#content").innerHTML = `
  <div class="art-layout"><article>
    <div class="art-head"><div class="art-meta"><span class="tag">${a.cat}</span><time>${fmtDate(a.date)}</time><span>（サンプル記事）</span></div><h1>${escHtml(a.title)}</h1></div>
    <div class="art-eye"><img src="${sbImg("banner", a.cat, a.seed)}" alt=""></div>
    <div class="toc"><b>目次</b><ol>${a.sections.map((s, i) => `<li><a href="#s${i}">${s.h}</a></li>`).join("")}</ol></div>
    <div class="art-body">${body}</div>
    ${ctaSection("看板の売却・撤去のご相談は無料です")}
    <div class="desc-block"><h2>関連記事</h2><div class="grid grid-3">${rel.map(articleCard).join("")}</div></div></article>
    <aside><div class="sticky-side"><div class="side-box"><h3>無料査定</h3><p style="font-size:13px;color:var(--sub);margin-bottom:10px">写真を送るだけで査定いたします。</p>
      <a class="btn btn-primary btn-block" href="assessment.html">${icon("camera")}無料査定を申し込む</a><a class="btn btn-line btn-block" style="margin-top:8px" href="${SITE.lineUrl}">LINEで査定</a></div>
      <div class="side-box"><h3>人気の記事</h3><ul class="side-list">${ARTICLES.map((x) => `<li><a href="column-detail.html?id=${x.id}">${x.title}</a></li>`).join("")}</ul></div></div></aside></div>`;
}

/* ---------- FORMS (共通) ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_RE = /^[0-9０-９\-－+()（）\s]{9,}$/;
function validateField(el) {
  const wrap = el.closest(".field, .agree"); if (!wrap) return true;
  let msg = "";
  const v = el.type === "checkbox" ? el.checked : el.value.trim();
  if (el.required && !v) msg = el.type === "checkbox" ? "同意が必要です" : "この項目は必須です";
  else if (v && el.type === "email" && !EMAIL_RE.test(v)) msg = "メールアドレスの形式が正しくありません";
  else if (v && el.type === "tel" && !TEL_RE.test(v)) msg = "電話番号の形式が正しくありません";
  else if (v && el.type === "number" && (+v < +(el.min || 0))) msg = `${el.min}以上の数値を入力してください`;
  wrap.classList.toggle("has-error", !!msg);
  let e = wrap.querySelector(".err");
  if (!e) { e = document.createElement("p"); e.className = "err"; wrap.appendChild(e); }
  e.textContent = msg;
  return !msg;
}
function validateForm(form) {
  let first = null, ok = true;
  form.querySelectorAll("input,select,textarea").forEach((el) => { if (!validateField(el)) { ok = false; first = first || el; } });
  if (first) first.focus();
  return ok;
}
/* 入力→確認→完了（デモ）のフローを組み立てる */
function setupFlow({ form, getFiles, prefix }) {
  const confirmV = $("#confirmView"), doneV = $("#doneView"), box = $("#formView");
  const ind = document.querySelectorAll(".steps-ind li");
  const show = (n) => { box.hidden = n !== 0; confirmV.hidden = n !== 1; doneV.hidden = n !== 2; ind.forEach((li, i) => li.classList.toggle("on", i === n)); $("#flowTop").scrollIntoView({ behavior: "smooth" }); };
  form.addEventListener("blur", (e) => e.target.matches("input,select,textarea") && validateField(e.target), true);
  form.addEventListener("change", (e) => e.target.matches("input,select,textarea") && e.target.closest(".has-error") && validateField(e.target));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const rows = [];
    form.querySelectorAll("[data-label]").forEach((el) => {
      let v = el.tagName === "SELECT" ? el.selectedOptions[0]?.textContent : el.value;
      if (el.type === "checkbox") v = el.checked ? "同意する" : "";
      if (el.dataset.group) return;
      rows.push([el.dataset.label, v || "（未入力）"]);
    });
    const files = getFiles ? getFiles() : null;
    if (files) rows.splice(rows.findIndex(([k]) => k === "設置場所・所在地"), 0, ["看板写真", files.length ? files.map((f) => f.name).join("\n") : "（なし）"]);
    $("#confirmBody").innerHTML = rows.map(([k, v]) => `<tr><th>${escHtml(k)}</th><td>${escHtml(v)}</td></tr>`).join("");
    show(1);
  });
  $("#backBtn").onclick = () => show(0);
  $("#sendBtn").onclick = () => {
    $("#receiptNo").textContent = prefix + "-" + String(Date.now()).slice(-6);
    show(2);
  };
  $("#resetBtn")?.addEventListener("click", () => { form.reset(); form.querySelectorAll(".has-error").forEach((w) => w.classList.remove("has-error")); window.__clearFiles?.(); show(0); });
}

/* ---------- ASSESSMENT ---------- */
function init_assessment() {
  breadcrumb([["無料買取査定"]]);
  const form = $("#assessForm");
  form.type.innerHTML = `<option value="">選択してください</option>` + TYPES.map((t) => `<option value="${t.name}">${t.name}（${t.sub}）</option>`).join("") + `<option value="複数・不明">複数・不明</option>`;
  let files = [];
  const input = $("#photos"), prev = $("#previews");
  const sync = () => {
    const dt = new DataTransfer(); files.forEach((f) => dt.items.add(f)); input.files = dt.files;
    prev.innerHTML = "";
    files.forEach((f, i) => {
      const fig = document.createElement("figure");
      const img = document.createElement("img"); img.src = URL.createObjectURL(f); img.alt = f.name;
      const cap = document.createElement("figcaption"); cap.textContent = f.name;
      const b = document.createElement("button"); b.type = "button"; b.textContent = "×"; b.setAttribute("aria-label", "削除");
      b.onclick = () => { files.splice(i, 1); sync(); };
      fig.append(img, cap, b); prev.appendChild(fig);
    });
  };
  window.__clearFiles = () => { files = []; sync(); $("#photoErr").textContent = ""; };
  input.addEventListener("change", () => {
    const err = [];
    [...input.files].forEach((f) => {
      if (!f.type.startsWith("image/")) err.push(`${f.name}：画像ファイルではありません`);
      else if (f.size > 10 * 1024 * 1024) err.push(`${f.name}：10MBを超えています`);
      else if (files.length >= 10) err.push("写真は最大10枚までです");
      else files.push(f);
    });
    $("#photoErr").textContent = err.join(" / ");
    sync();
  });
  setupFlow({ form, getFiles: () => files, prefix: "DEMO-A" });
}

/* ---------- CONTACT ---------- */
function init_contact() {
  breadcrumb([["お問い合わせ"]]);
  const form = $("#contactForm");
  const p = PRODUCTS.find((x) => x.id === qs("product"));
  if (p) {
    $("#productRef").hidden = false;
    $("#productRef").innerHTML = `<img src="${prodImg(p)}" alt=""><div><b>お問い合わせ対象の商品</b><br>${escHtml(p.name)}<br><span class="pno">商品番号：${p.no}</span></div>`;
    form.kind.value = "中古看板の購入について";
    form.message.value = `【対象商品】${p.name}（商品番号：${p.no}）\n\n`;
    form.insertAdjacentHTML("beforeend", `<input type="hidden" data-label="対象商品" data-hidden value="${escHtml(p.name)}（${p.no}）">`);
  }
  setupFlow({ form, prefix: "DEMO-C" });
}

/* ---------- STATIC ---------- */
function init_company() { breadcrumb([["会社概要"]]); }
function init_privacy() { breadcrumb([["プライバシーポリシー"]]); }
