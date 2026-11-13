/* Version A — 質感模板客製 */
const HERO_LABELS = ['診所接待大廳', '候診休息區', '一對一諮詢室'];
const ph = (v, label, cls = '') => `<div class="ph v${v % 4} ${cls}" role="img" aria-label="${label}（示意圖）"><span>示意圖｜正式網站替換為診所實拍</span></div>`;
const L = (view, text, cls = '') => `<a href="#${view}" class="${cls}">${text}</a>`;
const crumb = (...items) => `<nav class="crumb" aria-label="麵包屑">${L('home', '首頁')}${items.map(([v, t]) => v ? ` / ${L(v, t)}` : ` / <span>${t}</span>`).join('')}</nav>`;
const banner = (title, sub, crumbs) => `<section class="banner"><div class="wrap">${crumb(...crumbs)}<h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></section>`;
const tCard = t => `<a class="card tcard" href="#t-${t.id}" data-cat="${t.cat}">${ph(t.seed, t.name)}<div class="card-b"><span class="tag">${CATS[t.cat]}</span><h3>${t.name}</h3><p class="en">${t.en}</p><p>${t.summary}</p><span class="more">了解更多 →</span></div></a>`;
const aCard = a => `<a class="card acard" href="#a-${a.id}">${ph(a.seed, a.title)}<div class="card-b"><div class="meta"><span class="tag">${a.tag}</span><time>${fmtDate(a.date)}</time></div><h3>${a.title}</h3><p>${a.excerpt}</p><span class="byline">${dById(a.author).name} 醫師</span></div></a>`;
const hoursList = () => `<dl class="hours">${CLINIC.hours.map(([d, h]) => `<div><dt>${d}</dt><dd>${h}</dd></div>`).join('')}</dl>`;
const ctaCard = () => `<div class="side-card cta"><h3>預約諮詢</h3><p>療程是否適合，需由醫師當面評估。</p><a class="btn" href="#contact">線上預約</a><p class="phone">電話 ${CLINIC.phone}</p></div>`;

const V = {
  thumb(i, kind) { return `<div class="ph v${i % 4} mini" aria-hidden="true"></div>`; },

  shell() {
    document.getElementById('shell-top').innerHTML = `
      <div class="demobar"><div class="wrap"><span><b>示範網站</b>｜方案 A・質感模板客製</span><a href="${OTHER_URL}" target="_blank" rel="noopener">查看方案 B・精品客製設計 →</a></div><p class="wrap fic">${CLINIC.fiction}</p></div>
      <div class="topbar"><div class="wrap"><span>${ICON.pin} ${CLINIC.address}</span><span>門診電話 ${CLINIC.phone}</span></div></div>
      <header class="hdr"><div class="wrap">
        <a href="#home" class="logo"><span class="logo-zh">${CLINIC.name}</span><span class="logo-en">${CLINIC.en}</span></a>
        <button class="burger" type="button" aria-expanded="false" aria-controls="mainnav"><span></span><span></span><span></span><span class="sr-only">選單</span></button>
        <nav id="mainnav" class="nav">${NAV.filter(n => n !== 'contact').map(n => `<a href="#${n}" data-nav="${n}">${PAGE_NAMES[n]}</a>`).join('')}<a href="#contact" data-nav="contact" class="btn sm">預約諮詢</a></nav>
      </div></header>`;
    document.getElementById('shell-bottom').innerHTML = `
      <footer class="ftr"><div class="wrap ftr-grid">
        <div><div class="logo light"><span class="logo-zh">${CLINIC.name}</span><span class="logo-en">${CLINIC.en}</span></div><p>${CLINIC.sub}</p></div>
        <div><h4>網站導覽</h4><ul>${['home', ...NAV].map(n => `<li>${L(n, PAGE_NAMES[n])}</li>`).join('')}<li>${L('backend', '後台操作說明')}</li></ul></div>
        <div><h4>門診時間</h4>${hoursList()}</div>
        <div><h4>機構資訊（示意）</h4><ul class="info"><li>${CLINIC.address}</li><li>電話 ${CLINIC.phone}</li><li>負責醫師 ${CLINIC.director}</li><li>診療科別 ${CLINIC.depts}</li><li>開業執照 ${CLINIC.license}</li></ul></div>
      </div><div class="wrap ftr-note"><p>本網站內容為衛教資訊，${NOTE_EFFECT}</p><p>${CLINIC.fiction}</p></div></footer>`;
    const b = document.querySelector('.burger'), nav = document.getElementById('mainnav');
    b.addEventListener('click', () => { const o = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', String(!o)); nav.classList.toggle('open', !o); });
    nav.addEventListener('click', e => { if (e.target.closest('a')) { b.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });
  },

  transition(paint) { const app = document.getElementById('app'); app.classList.add('fade'); setTimeout(() => { paint(); app.classList.remove('fade'); }, 150); },

  home() {
    const groups = Object.entries(CATS).map(([k, v]) => ({ k, v, items: pubT().filter(t => t.cat === k) })).filter(g => g.items.length);
    return `
    <section class="hero"><div class="wrap hero-grid">
      <div class="hero-t"><p class="eyebrow">${CLINIC.sub}</p><h1>${CLINIC.tagline}</h1><p>每一項醫學美容治療，都從醫師當面問診開始。我們會說明可行的選項、可能的風險與照護方式，讓你在充分了解後再做決定。</p>
        <div class="row">${L('treatments', '認識療程', 'btn')}${L('contact', '預約諮詢', 'btn line')}</div></div>
      <div class="hero-i">${ph(S.hero, HERO_LABELS[S.hero], 'tall')}<span class="ph-cap">${HERO_LABELS[S.hero]}</span></div>
    </div></section>
    <section class="sec"><div class="wrap"><div class="sec-h"><h2>療程項目</h2><p>依治療方式分為三大類，點選了解原理、適應症與風險。</p></div>
      <div class="grid3">${groups.map(g => `<div class="card cat"><span class="tag">${g.v}</span><h3>${g.v}療程</h3><ul>${g.items.map(t => `<li>${L('t-' + t.id, t.name + ' <small>' + t.en + '</small>')}</li>`).join('')}</ul>${L('treatments', '查看全部 →', 'more')}</div>`).join('')}</div></div></section>
    <section class="sec alt"><div class="wrap"><div class="sec-h"><h2>諮詢流程</h2><p>從預約到回診，每一步都有醫師參與。</p></div>
      <ol class="steps">${FLOW.slice(0, 4).map(([h, p], i) => `<li><span class="n">${i + 1}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol><p class="center">${L('about', '完整流程與診所介紹 →', 'more')}</p></div></section>
    <section class="sec"><div class="wrap"><div class="sec-h"><h2>醫師團隊</h2><p>由整形外科與皮膚科專科醫師親自評估與執行。</p></div>
      <div class="grid3">${DOCTORS.map(d => `<a class="card dcard" href="#doctors">${ph(d.seed, d.name + '醫師照片', 'portrait')}<div class="card-b"><h3>${d.name} <small>${d.title}</small></h3><p class="spec">${d.spec}</p><p>${d.skills.join('、')}</p></div></a>`).join('')}</div></div></section>
    <section class="sec alt"><div class="wrap"><div class="sec-h row-between"><div><h2>衛教文章</h2><p>由本院醫師撰寫的治療知識與照護說明。</p></div>${L('articles', '所有文章 →', 'more')}</div>
      <div class="grid3">${ARTICLES.slice(0, 3).map(aCard).join('')}</div></div></section>
    <section class="infoband"><div class="wrap grid2">
      <div><h2>門診資訊</h2>${hoursList()}<p>${CLINIC.address}<br>電話 ${CLINIC.phone}</p></div>
      <div class="cta-box"><h2>預約諮詢</h2><p>送出表單後，診所人員將於門診時間內以電話與你確認時段。</p>${L('contact', '前往預約', 'btn light')}</div>
    </div></section>`;
  },

  treatments() {
    return banner('療程項目', '以下為本院提供的醫學美容療程。療程是否適合需經醫師評估。', [[null, '療程項目']]) + `
    <section class="sec"><div class="wrap">
      <div class="tabs" role="group" aria-label="療程分類"><button type="button" data-filter="all" aria-pressed="true">全部</button>${Object.entries(CATS).map(([k, v]) => `<button type="button" data-filter="${k}" aria-pressed="false">${v}</button>`).join('')}</div>
      <div class="grid3">${pubT().map(tCard).join('')}</div>
      ${pubT().length < TREATMENTS.length ? `<p class="hint">有 ${TREATMENTS.length - pubT().length} 個療程目前在後台設為草稿，因此未顯示。${L('backend', '回到後台示意')}</p>` : ''}
      <p class="fee">${NOTE_FEE}</p></div></section>`;
  },

  treatment(t) {
    const d = dById(t.doctor);
    const others = pubT().filter(x => x.id !== t.id);
    return banner(t.name, t.en + '｜' + CATS[t.cat] + '療程', [['treatments', '療程項目'], [null, t.name]]) + `
    <section class="sec"><div class="wrap layout">
      <article class="main">
        <p class="lead">${t.summary}</p>
        ${ph(t.seed, t.name + '療程情境')}
        <h2>療程原理</h2>${t.principle.map(p => `<p>${p}</p>`).join('')}
        <h2>適應症</h2><ul class="checks">${t.indications.map(i => `<li>${i}</li>`).join('')}</ul>
        <h2>療程資訊</h2><dl class="infogrid">${t.info.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        <details open class="acc"><summary><h2>可能的副作用與風險</h2></summary><dl class="risks">${t.risks.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></details>
        <details open class="acc"><summary><h2>不適合對象</h2></summary><ul class="dots">${t.contra.map(i => `<li>${i}</li>`).join('')}</ul></details>
        <details open class="acc"><summary><h2>術後照護</h2></summary><ul class="dots">${t.care.map(i => `<li>${i}</li>`).join('')}</ul></details>
        ${t.extra ? `<p class="extra">${t.extra}</p>` : ''}
        <div class="notice"><p><strong>${NOTE_EFFECT}</strong></p><p>${NOTE_FEE}</p></div>
        ${t.articles.length ? `<h2>相關衛教文章</h2><div class="grid2">${t.articles.map(id => aCard(aById(id))).join('')}</div>` : ''}
      </article>
      <aside class="side">
        ${ctaCard()}
        <div class="side-card"><h3>主治醫師</h3><a class="doc-mini" href="#doctors">${ph(d.seed, d.name, 'avatar')}<span><b>${d.name} ${d.title}</b><small>${d.spec}</small></span></a></div>
        <div class="side-card"><h3>其他療程</h3><ul class="links">${others.map(x => `<li>${L('t-' + x.id, x.name)}</li>`).join('')}</ul></div>
        <div class="side-card"><h3>門診時間</h3>${hoursList()}</div>
      </aside></div></section>`;
  },

  unpublished(t) {
    return banner(t.name, '此療程目前未公開', [['treatments', '療程項目'], [null, t.name]]) + `<section class="sec"><div class="wrap narrow"><p>這個療程已在後台轉為草稿，前台暫不顯示。重新發布後就會回到療程列表。</p><p>${L('backend', '回到後台示意', 'btn')}</p></div></section>`;
  },

  doctors() {
    return banner('醫師團隊', '由整形外科與皮膚科專科醫師親自評估、執行與追蹤。', [[null, '醫師團隊']]) + `
    <section class="sec"><div class="wrap"><div class="grid3">${DOCTORS.map(d => `
      <article class="card doc">${ph(d.seed, d.name + '醫師照片', 'portrait')}<div class="card-b">
        <h2>${d.name} <small>${d.title}</small></h2><p class="spec">${d.spec}</p><p>${d.bio}</p>
        <h3>專長</h3><ul class="dots">${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        <details class="acc sm"><summary><h3>學經歷與證書</h3></summary><ul class="dots">${d.edu.map(s => `<li>${s}</li>`).join('')}</ul><p class="cert">${d.certs.join('、')}<br>${d.cert}</p></details>
        <p class="hint">人物為示意</p></div></article>`).join('')}</div></div></section>`;
  },

  articles() {
    return banner('衛教文章', '由本院醫師撰寫，說明治療原理、風險與照護方式。', [[null, '衛教文章']]) + `
    <section class="sec"><div class="wrap layout"><div class="main"><div class="list">${ARTICLES.map(a => `
      <a class="card row-card" href="#a-${a.id}">${ph(a.seed, a.title)}<div class="card-b"><div class="meta"><span class="tag">${a.tag}</span><time>${fmtDate(a.date)}</time></div><h2>${a.title}</h2><p>${a.excerpt}</p><span class="byline">${dById(a.author).name} 醫師</span></div></a>`).join('')}</div></div>
      <aside class="side"><div class="side-card"><h3>文章分類</h3><ul class="links">${Object.values(CATS).map(c => `<li><span>${c}</span><small>${ARTICLES.filter(a => a.tag === c).length}</small></li>`).join('')}</ul></div>
      <div class="side-card"><h3>相關療程</h3><ul class="links">${pubT().map(x => `<li>${L('t-' + x.id, x.name)}</li>`).join('')}</ul></div></aside></div></section>`;
  },

  article(a) {
    const d = dById(a.author);
    return banner(a.title, '', [['articles', '衛教文章'], [null, a.tag]]) + `
    <section class="sec"><div class="wrap layout"><article class="main prose">
      <div class="meta"><span class="tag">${a.tag}</span><time>${fmtDate(a.date)}</time><a href="#doctors">撰文｜${d.name} 醫師</a></div>
      <p class="lead">${a.excerpt}</p>
      ${a.body.map(([h, ps]) => `<h2>${h}</h2>${ps.map(p => `<p>${p}</p>`).join('')}`).join('')}
      <div class="notice"><p>${NOTE_ARTICLE}</p></div>
    </article><aside class="side">
      <div class="side-card"><h3>撰文醫師</h3><a class="doc-mini" href="#doctors">${ph(d.seed, d.name, 'avatar')}<span><b>${d.name} ${d.title}</b><small>${d.spec}</small></span></a></div>
      <div class="side-card"><h3>相關療程</h3><ul class="links">${a.treatments.filter(id => S.pub[id]).map(id => `<li>${L('t-' + id, tById(id).name)}</li>`).join('')}</ul></div>
      ${ctaCard()}</aside></div></section>`;
  },

  about() {
    return banner('關於診所', CLINIC.sub, [[null, '關於診所']]) + `
    <section class="sec"><div class="wrap">${ABOUT.values.map(([h, p], i) => `<div class="split ${i % 2 ? 'rev' : ''}">${ph(i + 4, h)}<div><h2>${h}</h2><p>${p}</p></div></div>`).join('')}</div></section>
    <section class="sec alt"><div class="wrap"><div class="sec-h"><h2>設備與環境</h2><p>${ABOUT.permit}</p></div>
      <div class="grid4">${ABOUT.facilities.map(([h, p, s]) => `<div class="card">${ph(s, h)}<div class="card-b"><h3>${h}</h3><p>${p}</p></div></div>`).join('')}</div></div></section>
    <section class="sec"><div class="wrap"><div class="sec-h"><h2>諮詢流程</h2></div><ol class="steps six">${FLOW.map(([h, p], i) => `<li><span class="n">${i + 1}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol></div></section>
    <section class="sec alt"><div class="wrap grid2"><div><h2>診所資訊</h2><ul class="info dark"><li>${CLINIC.address}</li><li>電話 ${CLINIC.phone}</li><li>負責醫師 ${CLINIC.director}</li><li>診療科別 ${CLINIC.depts}</li><li>開業執照 ${CLINIC.license}</li></ul></div><div><h2>門診時間</h2>${hoursList()}</div></div></section>`;
  },

  contact() {
    return banner('預約諮詢', '送出表單後，診所人員將於門診時間內以電話與你確認時段。療程是否適合，需由醫師當面評估。', [[null, '預約諮詢']]) + `
    <section class="sec"><div class="wrap layout">
      <form class="main form" data-demo-form novalidate>
        <div class="f2"><label>姓名 <b>必填</b><input id="f-name" required autocomplete="name"></label><label>聯絡電話 <b>必填</b><input id="f-tel" type="tel" required autocomplete="tel"></label></div>
        <label>Email<input id="f-mail" type="email" autocomplete="email"></label>
        <div class="f2"><label>想諮詢的項目<select id="f-item">${TREATMENTS.map(t => `<option>${t.name}</option>`).join('')}<option>尚未確定，想先諮詢</option></select></label>
        <fieldset><legend>希望時段</legend><div class="radios">${['平日午後', '平日晚間', '週六'].map((x, i) => `<label class="r"><input type="radio" name="slot" id="f-slot${i}" ${i ? '' : 'checked'}>${x}</label>`).join('')}</div></fieldset></div>
        <label>想詢問的事項<textarea id="f-msg" rows="4"></textarea></label>
        <label class="chk"><input type="checkbox" id="f-agree" required>我了解此表單僅為預約諮詢，療程是否適合需由醫師當面評估</label>
        <button class="btn" type="submit">送出預約</button>
        <p role="status" class="formstatus" hidden></p>
      </form>
      <aside class="side"><div class="side-card"><h3>診所資訊</h3><ul class="info dark"><li>${CLINIC.address}</li><li>電話 ${CLINIC.phone}</li></ul><h3>門診時間</h3>${hoursList()}<h3>交通方式</h3><ul class="dots">${CLINIC.transit.map(x => `<li>${x}</li>`).join('')}</ul></div></aside>
    </div><div class="wrap"><figure class="map">${mapSVG()}<figcaption>地圖示意｜正式網站嵌入地圖服務</figcaption></figure></div></section>`;
  },

  backend({ toast, screens }) {
    return banner('診所人員可以自己做的事', '正式網站採用 WordPress。以下為後台畫面示意：日常更新都是填表單與按按鈕，不需要程式背景。', [[null, '後台操作說明']]) + `
    <section class="sec"><div class="wrap">${toast}
      <nav class="toc" aria-label="本頁內容">${screens.map(([h], i) => `<button type="button" data-jump="bk${i}">${h}</button>`).join('')}</nav>
      ${screens.map(([h, p, frame, pts, demo], i) => `<section class="bk" id="bk${i}"><div class="bk-t"><span class="n">${i + 1}</span><div><h2>${h}</h2><p>${p}</p><ul class="checks">${pts.map(x => `<li>${x}</li>`).join('')}</ul>${demo ? `<p class="demo-note">${demo}</p>` : ''}</div></div>${frame}</section>`).join('')}
      <section class="handover"><h2>交付與維護</h2><ul class="checks">${HANDOVER.map(x => `<li>${x}</li>`).join('')}</ul></section>
    </div></section>`;
  },

  after(r, app) {
    app.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.jump).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })));
  }
};
