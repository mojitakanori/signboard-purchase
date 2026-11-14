/* 共通コンポーネント：ヘッダー／フッター／カード／パンくず／FAQ／仮画像 */
const ICONS = {
  camera: '<path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  truck: '<path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  recycle: '<path d="M21 12a9 9 0 0 1-15.5 6.2M3 12A9 9 0 0 1 18.5 5.8"/><path d="M18 2v4h-4M6 22v-4h4"/>',
  yen: '<circle cx="12" cy="12" r="9"/><path d="M9 8l3 4 3-4M12 12v6M9 14h6M9 17h6"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  leaf: '<path d="M5 19C5 10 10 4 20 4c0 10-6 15-15 15zM5 19l8-8"/>',
  arrow: '<path d="M9 6l6 6-6 6"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chat: '<path d="M4 5h16v11H11l-5 4v-4H4z"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2"/>',
  upload: '<path d="M12 16V5M7 10l5-5 5 5M4 19h16"/>',
  cash: '<rect x="3" y="7" width="18" height="11" rx="2"/><circle cx="12" cy="12.5" r="2.5"/>',
};
const icon = (n, cls = "") =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;

const qs = (k) => new URLSearchParams(location.search).get(k);
const yen = (n) => "¥" + n.toLocaleString("ja-JP");
const fmtDate = (s) => s.replace(/^(\d+)-(\d+)-(\d+)$/, (_, y, m, d) => `${y}年${+m}月${+d}日`);
const escHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---- 仮画像（SVGをdata URIで生成）。実画像が用意できたらURLに差し替え ---- */
const PAL = [["#c8302b", "#fff"], ["#1f5bb5", "#fff"], ["#2a7d4f", "#fff"], ["#e0a100", "#222"], ["#5b3a8c", "#fff"], ["#222b3a", "#ffd54a"]];
function sbImg(kind, label = "", seed = 0) {
  const [c, t] = PAL[seed % PAL.length];
  const fs = (w, n = 1) => Math.max(12, Math.min(34, w / Math.max(n, 1)));
  const L = escHtml(label);
  const n = label.length;
  let g = "";
  switch (kind) {
    case "pole":
      g = `<rect x="192" y="140" width="16" height="140" fill="#7b8797"/><rect x="95" y="35" width="210" height="115" rx="6" fill="${c}" stroke="#fff" stroke-width="4"/><text x="200" y="104" font-size="${fs(190, n)}" font-weight="700" text-anchor="middle" fill="${t}">${L}</text>`; break;
    case "wall":
      g = `<rect x="30" y="30" width="340" height="250" fill="#aab4c2"/><rect x="50" y="200" width="60" height="80" fill="#8794a6"/><rect x="290" y="200" width="60" height="80" fill="#8794a6"/><rect x="55" y="75" width="290" height="80" rx="4" fill="${c}"/><text x="200" y="127" font-size="${fs(260, n)}" font-weight="700" text-anchor="middle" fill="${t}">${L}</text>`; break;
    case "led":
      g = `<rect x="150" y="20" width="100" height="250" rx="8" fill="#1c1f2b"/><rect x="158" y="28" width="84" height="234" rx="5" fill="${c}"/><text x="200" y="${150 - n * 11}" font-size="26" font-weight="700" text-anchor="middle" fill="${t}">${[...label].map((ch, i) => `<tspan x="200" dy="${i ? 28 : 0}">${escHtml(ch)}</tspan>`).join("")}</text>`; break;
    case "stand":
      g = `<path d="M130 270 L170 60 L230 60 L270 270" fill="none" stroke="#5b4636" stroke-width="8"/><path d="M146 235 L176 70 L224 70 L254 235Z" fill="${c}"/><text x="200" y="165" font-size="${fs(80, n)}" font-weight="700" text-anchor="middle" fill="${t}">${L}</text>`; break;
    case "channel":
      g = `<rect x="20" y="40" width="360" height="220" fill="#b8c1ce"/><text x="200" y="215" font-size="190" font-weight="900" text-anchor="middle" fill="#6d7888" stroke="#3a4352" stroke-width="2">${L.slice(0, 2)}</text>`; break;
    case "digital":
      g = `<rect x="60" y="30" width="280" height="170" rx="8" fill="#10131c"/><rect x="70" y="40" width="260" height="150" fill="${c}"/><text x="200" y="125" font-size="${fs(220, n)}" font-weight="700" text-anchor="middle" fill="${t}">${L}</text><rect x="190" y="200" width="20" height="55" fill="#555"/><rect x="140" y="255" width="120" height="10" rx="3" fill="#333"/>`; break;
    case "plate":
      g = `<rect x="30" y="30" width="340" height="250" fill="#c9d1dc"/><rect x="110" y="100" width="180" height="90" fill="#222b3a" stroke="#d9b45a" stroke-width="5"/><text x="200" y="157" font-size="${fs(150, n)}" font-weight="700" text-anchor="middle" fill="#e6c36a">${L}</text>`; break;
    case "empty":
      g = `<rect x="30" y="30" width="340" height="250" fill="#aab4c2"/><rect x="55" y="75" width="290" height="80" fill="none" stroke="#8794a6" stroke-width="3" stroke-dasharray="8 6"/><circle cx="62" cy="82" r="4" fill="#6d7888"/><circle cx="338" cy="82" r="4" fill="#6d7888"/><circle cx="62" cy="148" r="4" fill="#6d7888"/><circle cx="338" cy="148" r="4" fill="#6d7888"/>`; break;
    case "banner":
      g = `<rect x="40" y="50" width="320" height="190" rx="10" fill="${c}"/><rect x="70" y="85" width="180" height="14" rx="4" fill="#ffffff" opacity=".85"/><rect x="70" y="115" width="240" height="10" rx="4" fill="#ffffff" opacity=".5"/><rect x="70" y="137" width="200" height="10" rx="4" fill="#ffffff" opacity=".5"/><text x="200" y="215" font-size="${fs(260, n)}" font-weight="700" text-anchor="middle" fill="${t}">${L}</text>`; break;
    default:
      g = `<rect x="70" y="60" width="130" height="170" fill="${c}" stroke="#fff" stroke-width="3"/><rect x="190" y="90" width="140" height="150" fill="#1f5bb5" stroke="#fff" stroke-width="3"/><text x="200" y="160" font-size="26" font-weight="700" text-anchor="middle" fill="#fff">${L}</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3fa"/><stop offset="1" stop-color="#cfd9e6"/></linearGradient></defs><rect width="400" height="300" fill="url(#b)"/><rect y="272" width="400" height="28" fill="#aebacb"/>${g}<text x="392" y="293" font-size="10" text-anchor="end" fill="#5d6778" font-family="sans-serif">仮画像</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
const typeOf = (id) => TYPES.find((t) => t.id === id) || TYPES[7];
const prodImg = (p, i = 0) => {
  const t = typeOf(p.cat), labs = [t.label, t.label, "裏面", "傷部分"];
  return i === 3 ? sbImg("empty", "", 0) : sbImg(t.kind, labs[i], p.seed + i);
};

/* ---- ヘッダー・フッター ---- */
const NAV = [
  ["ホーム", "index.html", "home"], ["はじめての方へ", "index.html#flow", ""], ["買取できる看板", "index.html#types", ""],
  ["買取の流れ", "index.html#flow", ""], ["施工・撤去サービス", "index.html#features", ""], ["中古看板販売", "products.html", "products"],
  ["事例紹介", "results.html", "results"], ["よくある質問", "contact.html", ""], ["会社概要", "company.html", "company"],
];
function renderHeader() {
  const page = document.body.dataset.page || "";
  const active = (k) => (k === page || (k === "products" && page === "product-detail") || (k === "results" && page === "result-detail") || (k === "column" && page === "column-detail")) ? "on" : "";
  const nav = NAV.map(([l, h, k]) => `<a href="${h}" class="${k ? active(k) : ""}">${l}</a>`).join("");
  document.getElementById("site-header").outerHTML = `
  <header class="site-header">
    <div class="hdr-top">
      <a class="logo" href="index.html" aria-label="${SITE.name} トップへ"><b>看板<em>買取</em>ドットJP</b><small>by COCODAKE</small></a>
      <p class="hdr-tag"><strong>その看板、捨てる前に売りませんか？</strong>店舗閉鎖・移転・改装で不要になった看板を専門買取</p>
      ${SITE.tel ? `<a class="hdr-tel" href="tel:${SITE.tel.replace(/-/g, "")}">${icon("phone")}<span><b>${SITE.tel}</b><small>${SITE.telHours}</small></span></a>` : ""}
      <a class="btn btn-primary" href="assessment.html"><i class="i-cam"></i>無料査定を申し込む<b class="chev">›</b></a>
      <button class="menu-btn" id="menuBtn" aria-label="メニューを開く" aria-expanded="false"><span class="bars"><i></i><i></i><i></i></span></button>
    </div>
    <div class="hdr-nav"><div class="in"><nav class="gnav" aria-label="グローバルナビ">${nav}</nav><a class="btn btn-line" href="${SITE.lineUrl}"><i class="i-line"></i>LINEで無料査定</a></div></div>
  </header>
  <div class="drawer" id="drawer"><nav aria-label="モバイルメニュー"><button class="close" id="menuClose" aria-label="閉じる">${icon("close")}</button>
    ${NAV.map(([l, h]) => `<a class="lnk" href="${h}">${l}</a>`).join("")}
    <a class="lnk" href="contact.html">お問い合わせ</a>
    <a class="btn btn-primary btn-block" href="assessment.html">${icon("camera")}無料査定を申し込む</a>
    <a class="btn btn-line btn-block" href="${SITE.lineUrl}">${icon("chat")}LINEで無料査定</a>
    ${SITE.tel ? `<a class="btn btn-outline btn-block" href="tel:${SITE.tel.replace(/-/g, "")}">${icon("phone")}${SITE.tel}</a>` : ""}</nav></div>`;
  const d = document.getElementById("drawer"), b = document.getElementById("menuBtn");
  const set = (o) => { d.classList.toggle("open", o); b.setAttribute("aria-expanded", o); document.body.style.overflow = o ? "hidden" : ""; };
  b.onclick = () => set(true);
  document.getElementById("menuClose").onclick = () => set(false);
  d.onclick = (e) => { if (e.target === d || e.target.closest("a")) set(false); };
  document.addEventListener("keydown", (e) => e.key === "Escape" && set(false));
}
function renderFooter() {
  document.getElementById("site-footer").outerHTML = `
  <footer class="site-footer"><div class="container">
    <div class="ft-grid">
      <div><a class="logo" href="index.html"><b>看板<em>買取</em>ドットJP</b><small>by COCODAKE</small></a>
        <p class="ft-about">店舗閉鎖・移転・改装で不要になった看板の買取査定・撤去・再販売を行うサービスです。</p>
        ${SITE.tel ? `<p class="ft-tel">${SITE.tel}</p><p style="font-size:12px">${SITE.telHours}</p>` : ""}</div>
      <div><h4>買取サービス</h4><ul><li><a href="assessment.html">無料買取査定</a></li><li><a href="index.html#types">買取できる看板</a></li><li><a href="index.html#flow">買取の流れ</a></li><li><a href="results.html">買取実績</a></li></ul></div>
      <div><h4>中古看板・情報</h4><ul><li><a href="products.html">中古看板販売</a></li><li><a href="column.html">お役立ち記事</a></li><li><a href="index.html#faq">よくある質問</a></li></ul></div>
      <div><h4>サイト情報</h4><ul><li><a href="company.html">会社概要</a></li><li><a href="contact.html">お問い合わせ</a></li><li><a href="privacy.html">プライバシーポリシー</a></li></ul></div>
    </div>
    <p class="ft-demo">※ 本サイトはデモ（MVP）です。掲載している商品・価格・実績・記事・数値はすべてサンプルであり、実在するものではありません。</p>
    <p class="copy">© ${new Date().getFullYear()} ${SITE.name}（デモサイト）</p>
  </div></footer>
  <div class="sticky-cta"><a class="btn btn-primary" href="assessment.html"><i class="i-cam"></i>無料査定</a><a class="btn btn-line" href="${SITE.lineUrl}"><i class="i-line"></i>LINE相談</a></div>`;
}

/* ---- 部品 ---- */
function breadcrumb(items) {
  const el = document.getElementById("breadcrumb");
  if (!el) return;
  el.outerHTML = `<nav class="breadcrumb" aria-label="パンくず"><div class="container"><ol>${[["ホーム", "index.html"], ...items].map(([l, h]) => `<li>${h ? `<a href="${h}">${escHtml(l)}</a>` : escHtml(l)}</li>`).join("")}</ol></div></nav>`;
}
function productCard(p) {
  const t = typeOf(p.cat);
  return `<a class="card ${p.status === "sold" ? "sold-img" : ""}" href="product-detail.html?id=${p.id}">
    <div class="thumb"><img src="${prodImg(p)}" alt="${escHtml(p.name)}" loading="lazy"><span class="status ${p.status}">${STATUS[p.status]}</span></div>
    <div class="body"><span class="tag">${t.name}</span><h3>${escHtml(p.name)}</h3><span class="pno">商品番号：${p.no}</span>
    <div class="price">${yen(p.price)}<small>（税込・サンプル）</small></div>
    <div class="meta"><span>サイズ：${p.size}</span><span>状態：${CONDITION[p.condition]}</span></div></div></a>`;
}
function resultCard(r) {
  return `<article class="card"><div class="thumb"><img src="${sbImg(r.kind, typeOf(TYPES.find((t) => t.kind === r.kind)?.id).label, r.seed)}" alt="${escHtml(r.title)}" loading="lazy"></div>
    <div class="body"><span class="tag">${r.type}</span><h3>${escHtml(r.title)}</h3>
    <div class="meta"><span>地域：${r.area}</span><span>時期：${r.period}</span></div><p class="desc">${escHtml(r.summary)}</p>
    <div class="foot"><a class="btn btn-outline btn-sm" href="result-detail.html?id=${r.id}">詳細を見る${icon("arrow")}</a></div></div></article>`;
}
function articleCard(a) {
  return `<a class="card" href="column-detail.html?id=${a.id}"><div class="thumb"><img src="${sbImg("banner", a.cat, a.seed)}" alt="" loading="lazy"></div>
    <div class="body"><div class="meta"><span class="tag">${a.cat}</span><span>${fmtDate(a.date)}</span></div><h3>${escHtml(a.title)}</h3><p class="desc">${escHtml(a.excerpt)}</p></div></a>`;
}
function ctaSection(title = "まずは無料査定から。写真を送るだけで簡単です", cls = "") {
  return `<div class="cta ${cls}"><div><h${cls ? 3 : 2}>${title}</h${cls ? 3 : 2}><p>店舗閉鎖・移転・改装で不要になった看板をお気軽にご相談ください。</p></div>
    <div class="cta-btns"><a class="btn btn-primary btn-lg" href="assessment.html">${icon("camera")}無料査定を申し込む</a><a class="btn btn-line btn-lg" href="${SITE.lineUrl}">${icon("chat")}LINEで査定</a>
    ${SITE.tel ? `<a class="tel" href="tel:${SITE.tel.replace(/-/g, "")}">${icon("phone")}<span>${SITE.tel}<small>${SITE.telHours}</small></span></a>` : ""}</div></div>`;
}
function renderPagination(el, total, page, perPage, onChange) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) { el.innerHTML = ""; return; }
  let h = `<button ${page === 1 ? "disabled" : ""} data-p="${page - 1}" aria-label="前へ">‹</button>`;
  for (let i = 1; i <= pages; i++) h += `<button class="${i === page ? "on" : ""}" data-p="${i}">${i}</button>`;
  h += `<button ${page === pages ? "disabled" : ""} data-p="${page + 1}" aria-label="次へ">›</button>`;
  el.innerHTML = h;
  el.onclick = (e) => { const b = e.target.closest("button[data-p]"); if (b && !b.disabled) onChange(+b.dataset.p); };
}
function renderFaq(el, list) {
  el.innerHTML = list.map((f, i) => `<div class="faq-item"><button class="faq-q" aria-expanded="false" aria-controls="fa${i}">${escHtml(f.q)}</button><div class="faq-a" id="fa${i}" hidden>${escHtml(f.a)}</div></div>`).join("");
  el.onclick = (e) => {
    const b = e.target.closest(".faq-q"); if (!b) return;
    const open = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", !open);
    document.getElementById(b.getAttribute("aria-controls")).hidden = open;
  };
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader(); renderFooter();
  const fn = window["init_" + (document.body.dataset.page || "").replace(/-/g, "_")];
  if (fn) fn();
});
