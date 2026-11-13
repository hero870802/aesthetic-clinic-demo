/* Version A — 質感模板客製 (premium template look: bento hero, arch frames, serif display, warm neutrals) */
const RMa = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const pic = (key, alt, cls = '', pos = '', label = '示意圖') => `<figure class="pic ${cls}"><img src="${IMG(key)}" alt="${alt}（示意圖）" loading="lazy" decoding="async"${pos ? ` style="object-position:${pos}"` : ''}><figcaption>${label}</figcaption></figure>`;
const L = (view, text, cls = '') => `<a href="#${view}" class="${cls}">${text}</a>`;
const ARROW = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
const crumb = (...items) => `<nav class="crumb" aria-label="麵包屑">${L('home', '首頁')}${items.map(([v, t]) => v ? `<span>/</span>${L(v, t)}` : `<span>/</span><span>${t}</span>`).join('')}</nav>`;
const banner = (key, title, sub, crumbs) => `<section class="banner"><img src="${IMG(BANNERS[key] || 'hero-1')}" alt="" class="banner-bg"><div class="wrap banner-in">${crumb(...crumbs)}<h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div><span class="banner-tag">示意圖</span></section>`;
const eyebrow = t => `<p class="eyebrow">${t}</p>`;
const tCard = t => `<a class="card tcard" href="#t-${t.id}" data-cat="${t.cat}">${pic(t.photo, t.name, 'r43', t.pos)}<div class="card-b"><span class="tag">${CATS[t.cat]}</span><h3>${t.name}</h3><p class="en">${t.en}</p><p>${t.summary}</p><span class="more">了解療程 ${ARROW}</span></div></a>`;
const aCard = a => `<a class="card acard" href="#a-${a.id}">${pic(a.photo, a.title, 'r169')}<div class="card-b"><div class="meta"><span class="tag">${a.tag}</span><time>${fmtDate(a.date)}</time></div><h3>${a.title}</h3><p>${a.excerpt}</p></div></a>`;
const hoursList = () => `<dl class="hours">${CLINIC.hours.map(([d, h]) => `<div><dt>${d}</dt><dd>${h}</dd></div>`).join('')}</dl>`;
const ctaCard = () => `<div class="side-card cta"><h3>預約諮詢</h3><p>線上表單 24 小時受理，於門診時間回覆。</p><a class="btn" href="#contact">線上預約</a><p class="phone">電話 ${CLINIC.phone}</p></div>`;
const badge = () => `<div class="badge" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="bp" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs><text><textPath href="#bp">CONSULTATION FIRST · WUYU CLINIC · </textPath></text></svg><span>預約<br>諮詢</span></div>`;
const ICONS = {
  doc: '<svg viewBox="0 0 32 32"><circle cx="16" cy="10" r="5"/><path d="M6 28c1-6 5-9 10-9s9 3 10 9"/><path d="M13 19l3 4 3-4"/></svg>',
  list: '<svg viewBox="0 0 32 32"><rect x="7" y="5" width="18" height="23" rx="2"/><path d="M11 12h10M11 17h10M11 22h6"/></svg>',
  loop: '<svg viewBox="0 0 32 32"><path d="M25 12a10 10 0 1 0 1 7"/><path d="M26 6v6h-6"/></svg>',
  shield: '<svg viewBox="0 0 32 32"><path d="M16 4l10 4v7c0 7-5 11-10 13-5-2-10-6-10-13V8z"/><path d="M11 16l4 4 6-7"/></svg>'
};

let tab = 'light';
const V = {
  shell() {
    document.getElementById('shell-top').innerHTML = `
      <div class="demobar"><div class="wrap"><span><b>示範網站</b>｜方案 A・質感模板客製</span><a href="${OTHER_URL}">查看方案 B・精品客製設計 ${ARROW}</a></div><p class="wrap fic">${CLINIC.fiction}</p></div>
      <div class="topbar"><div class="wrap"><span>${ICON.pin} ${CLINIC.address}</span><span>門診 週一至週五 12:00–21:00｜週六 10:30–18:00</span><span>電話 ${CLINIC.phone}</span></div></div>
      <header class="hdr"><div class="wrap">
        <a href="#home" class="logo"><span class="logo-zh">${CLINIC.name}</span><span class="logo-en">WUYU CLINIC</span></a>
        <button class="burger" type="button" aria-expanded="false" aria-controls="mainnav"><span></span><span></span><span></span><span class="sr-only">選單</span></button>
        <nav id="mainnav" class="nav">${NAV.filter(n => n !== 'contact').map(n => `<a href="#${n}" data-nav="${n}">${PAGE_NAMES[n]}</a>`).join('')}<a href="#contact" data-nav="contact" class="btn sm">預約諮詢</a></nav>
      </div></header>`;
    document.getElementById('shell-bottom').innerHTML = `
      <footer class="ftr"><div class="wrap">
        <p class="ftr-word" aria-hidden="true">WUYU CLINIC</p>
        <div class="ftr-grid">
          <div><div class="logo light"><span class="logo-zh">${CLINIC.name}</span><span class="logo-en">WUYU CLINIC</span></div><p>${CLINIC.sub}。</p></div>
          <div><h4>網站導覽</h4><ul>${['home', ...NAV].map(n => `<li>${L(n, PAGE_NAMES[n])}</li>`).join('')}<li>${L('backend', '後台操作說明')}</li></ul></div>
          <div><h4>療程分類</h4><ul>${Object.entries(CATS).map(([k, v]) => `<li><a href="#treatments" data-go-cat="${k}">${v}</a></li>`).join('')}</ul><h4 class="mt">門診時間</h4>${hoursList()}</div>
          <div><h4>機構資訊（示意）</h4><ul class="info"><li>${CLINIC.address}</li><li>電話 ${CLINIC.phone}</li><li>負責醫師 ${CLINIC.director}</li><li>診療科別 ${CLINIC.depts}</li><li>開業執照 ${CLINIC.license}</li></ul></div>
        </div>
        <div class="ftr-note"><p>本網站內容為衛教資訊，${NOTE_EFFECT}</p><p>網站照片取自商用授權圖庫，僅為示意。</p></div>
      </div></footer>`;
    const b = document.querySelector('.burger'), nav = document.getElementById('mainnav');
    b.addEventListener('click', () => { const o = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', String(!o)); nav.classList.toggle('open', !o); });
    nav.addEventListener('click', e => { if (e.target.closest('a')) { b.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });
    document.addEventListener('click', e => { const g = e.target.closest('[data-go-cat]'); if (g) sessionCat = g.dataset.goCat; });
    const hdr = document.querySelector('.hdr');
    addEventListener('scroll', () => hdr.classList.toggle('small', scrollY > 140), { passive: true });
  },

  transition(paint) { const app = document.getElementById('app'); app.classList.add('fade'); setTimeout(() => { paint(); app.classList.remove('fade'); }, 160); },

  home() {
    const d = DOCTORS;
    const cats = Object.keys(CATS);
    return `
    <section class="hero"><div class="wrap hero-grid">
      <div class="hero-main" data-hero-video>
        <img src="${IMG(HERO_IMGS[S.hero])}" alt="${HERO_LABELS[S.hero]}（示意圖）" class="hero-img">
        <div class="hero-t">${eyebrow('WUYU CLINIC')}<h1 class="hero-name">霧嶼診所</h1><p>台北・皮膚科與整形外科</p>
          <div class="row">${L('treatments', '認識療程', 'btn light')}${L('contact', '預約諮詢', 'btn ghost')}</div></div>
        ${badge()}<span class="pic-tag" data-vid-label>示意圖｜${HERO_LABELS[S.hero]}</span>
      </div>
      <div class="hero-side">
        <div class="hcard hours-card"><p class="eyebrow">Opening Hours</p><h2>門診時間</h2>${hoursList()}<a class="lnk" href="#contact">線上預約 ${ARROW}</a></div>
        <a class="hcard photo-card" href="#doctors">${pic('about-2', '醫師團隊', 'fill')}<div class="pc-t"><p class="eyebrow">Our Physicians</p><h2>醫師團隊</h2><p>整形外科與皮膚科專科醫師</p></div></a>
      </div>
    </div></section>
    <section class="facts"><div class="wrap"><div class="facts-in">${[[DOCTORS.length, '位專科醫師', '整形外科、皮膚科'], [TREATMENTS.length, '項療程說明', '每項皆列風險與照護'], [4, '大療程分類', '光電、注射、手術、保養'], [FLOW.length, '個諮詢步驟', '同意書可帶回考慮']].map(([n, u, s]) => `<div><p class="fact-n"><span data-count="${n}">${n}</span><small>${u}</small></p><p>${s}</p></div>`).join('')}</div></div></section>
    <section class="sec feat-sec" data-rv><div class="wrap">
      <div class="feat4">${[['doc', '專科醫師看診', '由醫師親自問診與檢查，不建議的治療會直接告知。'], ['list', '風險逐項說明', '療程頁列出副作用、不適合對象與照護方式。'], ['loop', '回診時間依療程安排', '治療後依需要安排回診，有疑問可隨時來電。'], ['shield', '藥品醫材具許可證', '使用之藥品與醫材皆具衛生福利部許可證。']].map(([i, h, p]) => `<div class="f4"><span class="ico">${ICONS[i]}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
    </div></section>
    <section class="sec alt" data-rv><div class="wrap split-intro">
      <div class="stack">${pic('about-0', '診所走廊', 'arch')}${pic('hero-2', '諮詢室', 'r11 over')}</div>
      <div class="intro-t">${eyebrow('About Wuyu')}<h2>關於霧嶼</h2><p>由整形外科與皮膚科專科醫師看診，療程分為光電、注射、手術與皮膚保養四類。</p>
        <ul class="checks">${ABOUT.values.map(([h, p]) => `<li><b>${h}</b>${p}</li>`).join('')}</ul>${L('about', '認識診所 ' + ARROW, 'btn line')}</div>
    </div></section>
    <section class="sec" data-rv><div class="wrap">
      <div class="sec-h center">${eyebrow('Treatments')}<h2>療程項目</h2><p>依治療方式分為四大類，點選分類查看項目。每個療程頁都列出適應症、風險與照護方式。</p></div>
      <div class="tx-tabs" role="tablist" aria-label="療程分類">${cats.map(k => `<button type="button" role="tab" data-tab="${k}" aria-selected="${k === tab}">${CATS[k]}<small>${pubT().filter(t => t.cat === k).length}</small></button>`).join('')}</div>
      ${cats.map(k => { const items = pubT().filter(t => t.cat === k); const p = TREATMENTS.find(t => t.cat === k); return `<div class="tx-panel" role="tabpanel" data-panel="${k}" ${k === tab ? '' : 'hidden'}>
        ${pic(p.photo, CATS[k], 'r54')}
        <div class="tx-panel-t"><h3>${CATS[k]}療程</h3><p>${CAT_DESC[k]}</p><ul class="tx-links">${items.map(t => `<li>${L('t-' + t.id, `<span>${t.name}</span><small>${t.en}</small>${ARROW}`)}</li>`).join('')}</ul>${L('treatments', '查看全部療程 ' + ARROW, 'btn line')}</div></div>`; }).join('')}
    </div></section>
    <section class="sec alt" data-rv><div class="wrap">
      <div class="sec-h center">${eyebrow('Process')}<h2>諮詢流程</h2><p>從預約到回診的六個步驟。</p></div>
      <ol class="steps">${FLOW.map(([h, p], i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
    </div></section>
    <section class="sec" data-rv><div class="wrap">
      <div class="sec-h row-between"><div>${eyebrow('Physicians')}<h2>醫師團隊</h2><p>由整形外科與皮膚科專科醫師親自評估與執行。</p></div>${L('doctors', '認識醫師 ' + ARROW, 'btn line')}</div>
      <div class="grid3">${d.map(x => `<a class="dcard" href="#doctors">${pic(x.photo, x.name + '醫師', 'arch', '', '人物示意')}<div class="dcard-b"><h3>${x.name}<small>${x.title}</small></h3><p class="spec">${x.spec}</p><p>${x.skills.slice(0, 3).join('・')}</p></div></a>`).join('')}</div>
    </div></section>
    <section class="cta-band" data-rv><img src="${IMG('hero-1')}" alt="" class="cta-bg"><div class="wrap cta-in">${eyebrow('Consultation')}<h2>預約諮詢</h2><p>線上填表或來電預約，診所人員會回電確認時段。</p>${L('contact', '預約諮詢', 'btn light')}</div><span class="banner-tag">示意圖</span></section>
    <section class="sec" data-rv><div class="wrap">
      <div class="sec-h row-between"><div>${eyebrow('News')}<h2>最新消息</h2><p>門診時間異動、醫師門診調整與就醫須知。</p></div>${L('articles', '所有消息 ' + ARROW, 'btn line')}</div>
      <div class="news-grid">${aCard(ARTICLES[0])}<ul class="news-list">${ARTICLES.slice(1).map(a => `<li><a href="#a-${a.id}"><time><b>${a.date.slice(8)}</b>${a.date.slice(0, 7).replace('-', '.')}</time><span><small class="tag">${a.tag}</small>${a.title}</span>${ARROW}</a></li>`).join('')}</ul></div>
    </div></section>
    <section class="sec alt info-sec" data-rv><div class="wrap grid2">
      <div class="icard"><h3>交通資訊</h3><p>${CLINIC.address}</p><ul class="dots">${CLINIC.transit.map(x => `<li>${x}</li>`).join('')}</ul>${mapSVG()}</div>
      <div class="icard dark"><h3>預約諮詢</h3><p>電話 ${CLINIC.phone}</p><p>線上表單 24 小時受理，於門診時間內回覆。</p>${L('contact', '前往預約', 'btn light')}</div>
    </div></section>`;
  },

  treatments() {
    const list = pubT();
    return banner('treatments', '療程項目', '以下為本院提供的醫學美容療程。療程是否適合需經醫師評估。', [[null, '療程項目']]) + `
    <div class="pillbar"><div class="wrap"><div class="tabs" role="group" aria-label="療程分類"><button type="button" data-filter="all" aria-pressed="true">全部<small>${list.length}</small></button>${Object.entries(CATS).map(([k, v]) => `<button type="button" data-filter="${k}" aria-pressed="false">${v}<small>${list.filter(t => t.cat === k).length}</small></button>`).join('')}</div></div></div>
    <section class="sec tight"><div class="wrap">
      ${Object.entries(CATS).map(([k, v]) => { const items = list.filter(t => t.cat === k); return items.length ? `<div class="cat-group" data-cat="${k}"><div class="cat-h"><h2>${v}</h2><p>${CAT_DESC[k]}</p></div><div class="grid3">${items.map(tCard).join('')}</div></div>` : ''; }).join('')}
      ${list.length < TREATMENTS.length ? `<p class="hint">有 ${TREATMENTS.length - list.length} 個療程目前在後台設為草稿，因此未顯示。${L('backend', '回到後台示意')}</p>` : ''}
      <p class="fee">${NOTE_FEE}${NOTE_DEVICE}</p></div></section>`;
  },

  treatment(t) {
    const d = dById(t.doctor);
    const same = pubT().filter(x => x.cat === t.cat && x.id !== t.id);
    return banner('treatments', t.name, t.en + '｜' + CATS[t.cat] + '療程', [['treatments', '療程項目'], [null, t.name]]) + `
    <section class="sec tight"><div class="wrap layout">
      <article class="main">
        <p class="lead">${t.summary}</p>
        ${pic(t.photo, t.name + '療程情境', 'r169', t.pos)}
        <dl class="factbar">${t.info.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        <h2>療程原理</h2>${t.principle.map(p => `<p>${p}</p>`).join('')}
        <h2>適應症</h2><ul class="checks plain">${t.indications.map(i => `<li>${i}</li>`).join('')}</ul>
        <details open class="acc risk"><summary><h2>可能的副作用與風險</h2></summary><dl class="risks">${t.risks.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></details>
        <details open class="acc"><summary><h2>不適合對象</h2></summary><ul class="dots">${t.contra.map(i => `<li>${i}</li>`).join('')}</ul></details>
        <details open class="acc"><summary><h2>術後照護</h2></summary><ul class="dots">${t.care.map(i => `<li>${i}</li>`).join('')}</ul></details>
        ${t.extra ? `<p class="extra">${t.extra}</p>` : ''}
        <div class="notice"><p><strong>${NOTE_EFFECT}</strong></p><p>${NOTE_FEE}</p><p>${NOTE_DEVICE}</p></div>
        ${t.articles.length ? `<h2>相關公告</h2><div class="grid2">${t.articles.map(id => aCard(aById(id))).join('')}</div>` : ''}
      </article>
      <aside class="side">
        ${ctaCard()}
        <div class="side-card"><h3>主治醫師</h3><a class="doc-mini" href="#doctors">${pic(d.photo, d.name, 'avatar', '', '')}<span><b>${d.name} ${d.title}</b><small>${d.spec}</small></span></a></div>
        ${same.length ? `<div class="side-card"><h3>同類療程</h3><ul class="links">${same.map(x => `<li>${L('t-' + x.id, x.name + ARROW)}</li>`).join('')}</ul></div>` : ''}
        <div class="side-card"><h3>門診時間</h3>${hoursList()}</div>
      </aside></div></section>`;
  },

  unpublished(t) {
    return banner('treatments', t.name, '此療程目前未公開', [['treatments', '療程項目'], [null, t.name]]) + `<section class="sec"><div class="wrap narrow"><p>這個療程已在後台轉為草稿，前台暫不顯示。重新發布後就會回到療程列表。</p><p>${L('backend', '回到後台示意', 'btn')}</p></div></section>`;
  },

  doctors() {
    return banner('doctors', '醫師團隊', '由整形外科與皮膚科專科醫師親自評估、執行與追蹤。', [[null, '醫師團隊']]) + `
    <section class="sec tight"><div class="wrap doc-list">${DOCTORS.map(d => `
      <article class="doc" id="doc-${d.id}" data-rv>${pic(d.photo, d.name + '醫師', 'arch', '', '人物示意')}<div class="doc-b">
        ${eyebrow(d.spec)}<h2>${d.name}<small>${d.title}</small></h2><p class="bio">${d.bio}</p>
        <h3>專長</h3><ul class="chips">${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        <details class="acc sm" open><summary><h3>學經歷與證書</h3></summary><ul class="dots">${d.edu.map(s => `<li>${s}</li>`).join('')}</ul><p class="cert">${d.certs.join('、')}｜${d.cert}</p></details>
        <p class="hint">人物與照片皆為示意</p></div></article>`).join('')}</div></section>`;
  },

  articles() {
    return banner('articles', '最新消息', '門診時間異動、醫師門診調整與就醫須知。', [[null, '最新消息']]) + `
    <section class="sec tight"><div class="wrap layout"><div class="main"><div class="list">${ARTICLES.map(a => `
      <a class="card row-card" href="#a-${a.id}">${pic(a.photo, a.title)}<div class="card-b"><div class="meta"><span class="tag">${a.tag}</span><time>${fmtDate(a.date)}</time></div><h2>${a.title}</h2><p>${a.excerpt}</p><span class="more">閱讀全文 ${ARROW}</span></div></a>`).join('')}</div></div>
      <aside class="side"><div class="side-card"><h3>消息分類</h3><ul class="links">${['門診公告', '醫師門診', '就醫須知'].map(c => `<li><span>${c}</span><small>${ARTICLES.filter(a => a.tag === c).length}</small></li>`).join('')}</ul></div>${ctaCard()}</aside></div></section>`;
  },

  article(a) {
    const d = a.doctor ? dById(a.doctor) : null;
    return banner('articles', a.title, '', [['articles', '最新消息'], [null, a.tag]]) + `
    <section class="sec tight"><div class="wrap layout"><article class="main prose">
      <div class="meta"><span class="tag">${a.tag}</span><time>${fmtDate(a.date)}</time><span>發布｜${byName(a)}</span></div>
      <p class="lead">${a.excerpt}</p>
      ${pic(a.photo, a.title, 'r169')}
      ${a.body.map(([h, ps]) => `<h2>${h}</h2>${ps.map(p => `<p>${p}</p>`).join('')}`).join('')}
      <div class="notice"><p>${NOTE_ARTICLE}</p></div>
    </article><aside class="side">
      ${d ? `<div class="side-card"><h3>相關醫師</h3><a class="doc-mini" href="#doctors">${pic(d.photo, d.name, 'avatar', '', '')}<span><b>${d.name} ${d.title}</b><small>${d.spec}</small></span></a></div>` : ''}
      ${a.treatments.some(id => S.pub[id]) ? `<div class="side-card"><h3>相關療程</h3><ul class="links">${a.treatments.filter(id => S.pub[id]).map(id => `<li>${L('t-' + id, tById(id).name + ARROW)}</li>`).join('')}</ul></div>` : ''}
      ${ctaCard()}</aside></div></section>`;
  },

  about() {
    return banner('about', '關於診所', CLINIC.sub, [[null, '關於診所']]) + `
    <section class="sec"><div class="wrap">${ABOUT.values.map(([h, p], i) => `<div class="split ${i % 2 ? 'rev' : ''}" data-rv>${pic(ABOUT_IMGS[i], h, i % 2 ? 'r43' : 'arch')}<div>${eyebrow('0' + (i + 1))}<h2>${h}</h2><p>${p}</p></div></div>`).join('')}</div></section>
    <section class="sec alt" data-rv><div class="wrap"><div class="sec-h center">${eyebrow('Facilities')}<h2>設備與環境</h2><p>${ABOUT.permit}</p></div>
      <div class="grid4">${ABOUT.facilities.map(([h, p, s, k]) => `<div class="fac">${pic(k, h, 'r34')}<h3>${h}</h3><p>${p}</p></div>`).join('')}</div></div></section>
    <section class="sec" data-rv><div class="wrap"><div class="sec-h center">${eyebrow('Process')}<h2>諮詢流程</h2></div><ol class="steps">${FLOW.map(([h, p], i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol></div></section>
    <section class="sec alt" data-rv><div class="wrap grid2"><div class="icard"><h3>診所資訊</h3><ul class="info dark"><li>${CLINIC.address}</li><li>電話 ${CLINIC.phone}</li><li>負責醫師 ${CLINIC.director}</li><li>診療科別 ${CLINIC.depts}</li><li>開業執照 ${CLINIC.license}</li></ul></div><div class="icard"><h3>門診時間</h3>${hoursList()}</div></div></section>`;
  },

  contact() {
    return banner('contact', '預約諮詢', '送出表單後，診所人員將於門診時間內以電話與你確認時段。', [[null, '預約諮詢']]) + `
    <section class="sec alt tight"><div class="wrap layout">
      <form class="main form" data-demo-form novalidate>
        <h2>線上預約表單</h2>
        <div class="f2"><label>姓名 <b>必填</b><input id="f-name" required autocomplete="name"></label><label>聯絡電話 <b>必填</b><input id="f-tel" type="tel" required autocomplete="tel"></label></div>
        <label>Email<input id="f-mail" type="email" autocomplete="email"></label>
        <div class="f2"><label>想諮詢的項目<select id="f-item">${Object.entries(CATS).map(([k, v]) => `<optgroup label="${v}">${TREATMENTS.filter(t => t.cat === k).map(t => `<option>${t.name}</option>`).join('')}</optgroup>`).join('')}<option>尚未確定，想先諮詢</option></select></label>
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
    return banner('backend', '後台操作說明', '正式網站採用 WordPress，以下為後台畫面示意。', [[null, '後台操作說明']]) + `
    <section class="sec tight"><div class="wrap">${toast}
      <nav class="toc" aria-label="本頁內容">${screens.map(([h], i) => `<button type="button" data-jump="bk${i}">${h}</button>`).join('')}</nav>
      ${screens.map(([h, p, frame, pts, demo], i) => `<section class="bk" id="bk${i}"><div class="bk-t"><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h2>${h}</h2><p>${p}</p><ul class="checks plain">${pts.map(x => `<li>${x}</li>`).join('')}</ul>${demo ? `<p class="demo-note">${demo}</p>` : ''}</div></div>${frame}</section>`).join('')}
      <section class="handover"><h2>交付與維護</h2><ul class="checks plain">${HANDOVER.map(x => `<li>${x}</li>`).join('')}</ul></section>
    </div></section>`;
  },

  after(r, app, first) {
    if (r.view === 'home') heroVideo(app, '../assets/vid/a-hero.mp4', HERO_LABELS[0]);
    app.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.jump).scrollIntoView({ behavior: RMa() ? 'auto' : 'smooth' })));
    app.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
      tab = b.dataset.tab;
      app.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
      app.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== tab; if (!p.hidden && !RMa()) p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220 }); });
    }));
    if (r.view === 'treatments' && sessionCat) { const b = app.querySelector(`[data-filter="${sessionCat}"]`); sessionCat = null; if (b) b.click(); }
    if (RMa()) return;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('rv-pre'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
      app.querySelectorAll('[data-rv]').forEach(el => { if (el.getBoundingClientRect().top > innerHeight * 0.92) { el.classList.add('rv-pre'); io.observe(el); } });
    }
    app.querySelectorAll('[data-count]').forEach(el => {
      const n = +el.dataset.count, t0 = performance.now();
      const step = t => { const p = Math.min(1, (t - t0) / 900); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }
};
let sessionCat = null;
