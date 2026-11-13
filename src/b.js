/* Version B — 精品客製設計 */
const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(seed) { let a = seed * 2654435761 >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
/* contour "island" — the brand image. Each treatment / doctor gets its own seed. */
function contour(seed, { w = 400, h = 300, n = 11, draw = false, bg = true, label = '' } = {}) {
  const r = rng(seed), cx = w * (0.42 + r() * 0.16), cy = h * (0.45 + r() * 0.12), R = Math.min(w, h) * (0.46 + r() * 0.08);
  const harm = [1, 2, 3, 5].map(j => ({ j, a: (0.05 + r() * 0.11) / Math.sqrt(j), p: r() * 6.283 }));
  const brass = 2 + Math.floor(r() * (n - 4));
  let paths = '';
  for (let k = n; k >= 1; k--) {
    const rk = R * Math.pow(k / n, 0.85), pts = [];
    for (let i = 0; i < 120; i++) {
      const th = i / 120 * 6.283; let m = 1;
      harm.forEach(({ j, a, p }) => { m += a * Math.sin(j * th + p + k * 0.18 * j); });
      const sx = 1.25 - 0.1 * (k / n);
      pts.push((cx + Math.cos(th) * rk * m * sx).toFixed(1) + ' ' + (cy + Math.sin(th) * rk * m * 0.86).toFixed(1));
    }
    const cls = k === brass ? 'c-brass' : 'c-line';
    paths += `<path d="M${pts.join('L')}Z" class="${cls}" pathLength="1" style="--d:${(n - k) * 60}ms"/>`;
  }
  return `<svg class="contour ${draw ? 'draw' : ''}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" ${label ? `role="img" aria-label="${label}（示意圖）"` : 'aria-hidden="true"'}>${bg ? `<rect width="${w}" height="${h}" class="c-bg"/>` : ''}${paths}</svg>`;
}
const fig = (seed, label, cls = '', o = {}) => `<figure class="fig ${cls}">${contour(seed, { label, ...o })}<figcaption>示意圖｜正式網站替換為診所實拍</figcaption></figure>`;
const L = (view, text, cls = '') => `<a href="#${view}" class="${cls}">${text}</a>`;
const num = i => String(i + 1).padStart(2, '0');
const vlabel = (zh, en) => `<div class="vlabel" aria-hidden="true"><span class="zh">${zh}</span><span class="en">${en}</span></div>`;
const HERO_SEEDS = [7, 19, 33];
const pageHead = (zh, en, title, intro) => `<header class="phead"><div class="phead-l"><p class="kicker"><span>${en}</span></p><h1>${title}</h1></div>${intro ? `<p class="phead-r">${intro}</p>` : ''}${vlabel(zh, '')}</header>`;
const hoursDL = () => `<dl class="hrs">${CLINIC.hours.map(([d, h]) => `<div><dt>${d}</dt><dd>${h}</dd></div>`).join('')}</dl>`;

const V = {
  thumb(i, kind) { const s = kind === 'hero' ? HERO_SEEDS[i] : kind === 'portrait' ? i : i * 13 + 5; return contour(s, { w: 320, h: kind === 'portrait' ? 340 : 180, n: kind === 'hero' ? 10 : 8 }); },

  shell() {
    document.getElementById('shell-top').innerHTML = `
      <div class="demobar"><div class="gut"><span><b>示範網站</b>｜方案 B・精品客製設計</span><a href="${OTHER_URL}" target="_blank" rel="noopener">查看方案 A・質感模板客製</a></div><p class="gut fic">${CLINIC.fiction}</p></div>
      <header class="hdr"><div class="gut hdr-in">
        <a href="#home" class="logo" aria-label="${CLINIC.name} 首頁"><span class="logo-zh">霧嶼</span><span class="logo-en">WUYU<i>clinic</i></span></a>
        <nav class="hnav" aria-label="主要導覽">${NAV.filter(n => n !== 'contact').map(n => `<a href="#${n}" data-nav="${n}">${PAGE_NAMES[n]}</a>`).join('')}</nav>
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="overlay"><span class="bars" aria-hidden="true"></span>選單</button>
      </div></header>
      <div id="overlay" class="overlay" hidden><div class="gut ov-in">
        <div class="ov-top"><span class="logo-en light">WUYU<i>clinic</i></span><button type="button" class="ov-close">關閉</button></div>
        <ol class="ov-list">${['home', ...NAV, 'backend'].map((n, i) => `<li><a href="#${n}"><span class="ov-n">${num(i)}</span><span class="ov-t">${PAGE_NAMES[n]}</span></a></li>`).join('')}</ol>
        <div class="ov-foot"><span>${CLINIC.address}</span><span>${CLINIC.phone}</span></div>
      </div></div>
      <div id="wipe" aria-hidden="true"></div>
      <a href="#contact" class="capsule" data-capsule>預約諮詢<span aria-hidden="true">→</span></a>`;
    document.getElementById('shell-bottom').innerHTML = `
      <footer class="ftr"><div class="gut">
        <div class="ftr-top"><div class="ftr-brand"><span class="ftr-zh">霧嶼診所</span><span class="ftr-tag">${CLINIC.tagline}</span></div>
          <ul class="ftr-nav">${['home', ...NAV, 'backend'].map(n => `<li>${L(n, PAGE_NAMES[n])}</li>`).join('')}</ul></div>
        <div class="ftr-grid">
          <div><h4>機構資訊　示意</h4><dl class="kv"><div><dt>地址</dt><dd>${CLINIC.address}</dd></div><div><dt>電話</dt><dd>${CLINIC.phone}</dd></div><div><dt>負責醫師</dt><dd>${CLINIC.director}</dd></div><div><dt>診療科別</dt><dd>${CLINIC.depts}</dd></div><div><dt>開業執照</dt><dd>${CLINIC.license}</dd></div></dl></div>
          <div><h4>門診時間</h4>${hoursDL()}</div>
        </div>
        <div class="ftr-note"><p>本網站內容為衛教資訊，${NOTE_EFFECT}</p><p>${CLINIC.fiction}</p></div>
      </div></footer>`;
    const btn = document.querySelector('.menu-btn'), ov = document.getElementById('overlay');
    const set = o => {
      btn.setAttribute('aria-expanded', String(o)); ov.hidden = !o; document.body.classList.toggle('lock', o);
      if (o && !RM()) ov.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' });
      if (o) ov.querySelector('a').focus(); else btn.focus();
    };
    btn.addEventListener('click', () => set(true));
    ov.querySelector('.ov-close').addEventListener('click', () => set(false));
    ov.addEventListener('click', e => { if (e.target.closest('a')) { btn.setAttribute('aria-expanded', 'false'); ov.hidden = true; document.body.classList.remove('lock'); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !ov.hidden) set(false); });
  },

  transition(paint) {
    const w = document.getElementById('wipe');
    if (RM() || !w.animate) { paint(); return; }
    w.style.display = 'block';
    w.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 220, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' }).onfinish = () => {
      paint();
      w.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 260, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' }).onfinish = () => { w.style.display = 'none'; };
      document.getElementById('app').animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 80, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
    };
  },

  home() {
    const d = DOCTORS[0];
    return `
    <section class="hero">
      <div class="mist" aria-hidden="true"><i class="m1"></i><i class="m2"></i><i class="m3"></i></div>
      <div class="hero-map" role="img" aria-label="品牌等高線圖（主視覺示意）">${contour(HERO_SEEDS[S.hero], { w: 900, h: 700, n: 14, draw: true, bg: false })}</div>
      <div class="gut hero-in">
        <h1 class="hero-v" aria-label="${CLINIC.tagline}"><span class="ln"><span>先評估，</span></span><span class="ln"><span>再決定。</span></span></h1>
        <div class="hero-side">
          <p class="hero-en">Wuyu <i>Clinic</i></p>
          <p class="hero-p">${CLINIC.sub}。每一項治療都從醫師當面問診開始，選項、風險與照護方式，都在你決定之前說清楚。</p>
          <div class="hero-cta">${L('treatments', '療程索引', 'lnk')}${L('contact', '預約諮詢', 'lnk')}</div>
        </div>
        <p class="hero-cap">主視覺示意｜正式網站替換為診所實拍或品牌影像</p>
      </div>
    </section>
    <section class="blk" data-rv>${vlabel('療程', 'Treatments')}<div class="gut blk-in">
      <div class="blk-h"><h2>療程索引</h2><p>依治療方式分為光電、注射與手術。每個療程頁都把風險與不適合對象，放在與適應症同等的位置。</p></div>
      <ol class="idx compact">${pubT().map((t, i) => `<li><a href="#t-${t.id}"><span class="idx-n">${num(i)}</span><span class="idx-name">${t.name}<i>${t.en}</i></span><span class="idx-cat">${CATS[t.cat]}</span><span class="idx-go" aria-hidden="true">→</span></a></li>`).join('')}</ol>
    </div></section>
    <section class="blk tone" data-rv>${vlabel('流程', 'Process')}<div class="gut blk-in">
      <div class="blk-h"><h2>從諮詢到回診</h2><p>六個步驟，每一步都有醫師參與。可左右滑動瀏覽。</p></div>
      <ol class="tl" tabindex="0" aria-label="諮詢流程">${FLOW.map(([h, p], i) => `<li><span class="tl-n">${num(i)}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
    </div></section>
    <section class="blk" data-rv>${vlabel('醫師', 'Physicians')}<div class="gut blk-in feat">
      <div class="feat-img">${fig(d.seed, d.name + '醫師照片', 'portrait', { w: 480, h: 560, n: 12 })}</div>
      <div class="feat-t"><p class="kicker"><span>${d.spec}</span></p><h2 class="feat-name">${d.name}<small>${d.title}</small></h2><p>${d.bio}</p>
        <ul class="feat-skill">${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        <div class="feat-others">${DOCTORS.slice(1).map(x => `<a href="#doctors"><span>${x.name}</span><small>${x.spec}</small></a>`).join('')}</div>
        ${L('doctors', '醫師團隊', 'lnk')}</div>
    </div></section>
    <section class="blk" data-rv>${vlabel('衛教', 'Journal')}<div class="gut blk-in">
      <div class="blk-h"><h2>衛教文章</h2><p>由本院醫師撰寫，說明原理、風險與照護。</p></div>
      ${this._journal(ARTICLES.slice(0, 3))}<p class="more-row">${L('articles', '所有文章', 'lnk')}</p>
    </div></section>
    ${this._visit()}`;
  },

  _journal(list) {
    return `<ol class="jr">${list.map(a => `<li><a href="#a-${a.id}"><time><span class="jr-d">${a.date.slice(8)}</span><span class="jr-m">${a.date.slice(0, 7).replace('-', '.')}</span></time><span class="jr-t"><span class="jr-tag">${a.tag}</span><span class="jr-h">${a.title}</span><span class="jr-ex">${a.excerpt}</span></span><span class="jr-a">${dById(a.author).name} 醫師</span></a></li>`).join('')}</ol>`;
  },

  _visit() {
    return `<section class="visit" data-rv><div class="gut visit-in">
      <div><p class="kicker light"><span>Visit</span></p><h2>來診資訊</h2><dl class="kv light"><div><dt>地址</dt><dd>${CLINIC.address}</dd></div><div><dt>電話</dt><dd>${CLINIC.phone}</dd></div></dl>${hoursDL()}${L('contact', '預約諮詢', 'lnk light')}</div>
      <figure class="visit-map">${mapSVG()}<figcaption>地圖示意｜正式網站嵌入地圖服務</figcaption></figure>
    </div></section>`;
  },

  treatments() {
    const list = pubT();
    return `<div class="gut">${pageHead('療程', 'Treatment Index', '療程索引', '以下為本院提供的醫學美容療程。療程是否適合，需經醫師評估。')}</div>
    <section class="gut tlist">
      <div class="filters" role="group" aria-label="療程分類"><button type="button" data-filter="all" aria-pressed="true">全部 <sup>${list.length}</sup></button>${Object.entries(CATS).map(([k, v]) => `<button type="button" data-filter="${k}" aria-pressed="false">${v} <sup>${list.filter(t => t.cat === k).length}</sup></button>`).join('')}</div>
      <div class="tlist-grid">
        <ol class="idx big">${list.map((t, i) => `<li data-cat="${t.cat}"><a href="#t-${t.id}" data-seed="${t.seed}" data-name="${t.name}"><span class="idx-n">${num(i)}</span><span class="idx-name">${t.name}<i>${t.en}</i></span><span class="idx-sum">${t.summary}</span><span class="idx-cat">${CATS[t.cat]}</span><span class="idx-thumb">${contour(t.seed, { w: 200, h: 140, n: 7 })}</span></a></li>`).join('')}</ol>
        <div class="preview" aria-hidden="true"><div class="pv a on">${contour(list[0] ? list[0].seed : 1, { w: 480, h: 600, n: 13 })}</div><div class="pv b"></div><p class="pv-cap"><span class="pv-name">${list[0] ? list[0].name : ''}</span>示意圖｜正式網站替換為診所實拍</p></div>
      </div>
      ${list.length < TREATMENTS.length ? `<p class="hint">有 ${TREATMENTS.length - list.length} 個療程目前在後台設為草稿，因此未顯示。${L('backend', '回到後台示意')}</p>` : ''}
      <p class="fee">${NOTE_FEE}</p>
    </section>`;
  },

  treatment(t) {
    const d = dById(t.doctor), i = TREATMENTS.indexOf(t);
    const chapters = [['principle', '原理'], ['ind', '適應症'], ['info', '療程資訊'], ['before', '治療前須知'], ['care', '術後照護']];
    const next = pubT()[(pubT().indexOf(t) + 1) % pubT().length];
    return `<article class="tx">
      <header class="gut tx-head"><p class="kicker"><span>${L('treatments', '療程索引')}　/　${CATS[t.cat]}　/　${num(i)}</span></p>
        <h1>${t.name}</h1><p class="tx-en">${t.en}</p><p class="tx-sum">${t.summary}</p></header>
      <div class="tx-fig">${fig(t.seed, t.name + '療程情境', 'wide', { w: 1400, h: 520, n: 16, draw: true })}</div>
      <div class="gut tx-grid">
        <nav class="rail" aria-label="章節"><div class="rail-line"><i></i></div><ol>${chapters.map(([id, l], k) => `<li><button type="button" data-ch="${id}"><span>${num(k)}</span>${l}</button></li>`).join('')}</ol>
          <div class="rail-doc"><span class="kicker"><span>主治醫師</span></span><a href="#doctors">${d.name} ${d.title}</a><small>${d.spec}</small></div></nav>
        <div class="tx-body">
          <section id="ch-principle" class="ch" data-rv><h2><span>01</span>原理</h2>${t.principle.map(p => `<p>${p}</p>`).join('')}</section>
          <section id="ch-ind" class="ch" data-rv><h2><span>02</span>適應症</h2><ul class="ln-list">${t.indications.map(x => `<li>${x}</li>`).join('')}</ul></section>
          <section id="ch-info" class="ch" data-rv><h2><span>03</span>療程資訊</h2><dl class="facts">${t.info.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></section>
          <section id="ch-before" class="ch dark" data-rv><h2><span>04</span>治療前須知</h2>
            <div class="dark-grid"><div><h3>可能的副作用與風險</h3><dl class="rk">${t.risks.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
            <div><h3>不適合對象</h3><ul class="ln-list light">${t.contra.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
            ${t.extra ? `<p class="dark-extra">${t.extra}</p>` : ''}</section>
          <section id="ch-care" class="ch" data-rv><h2><span>05</span>術後照護</h2><ul class="ln-list">${t.care.map(x => `<li>${x}</li>`).join('')}</ul></section>
          <div class="statement"><p>${NOTE_EFFECT}</p><p>${NOTE_FEE}</p></div>
          ${t.articles.length ? `<div class="ch"><h2 class="sm">延伸閱讀</h2>${this._journal(t.articles.map(aById))}</div>` : ''}
          <div class="tx-end">${L('contact', '預約諮詢', 'lnk')}${next && next !== t ? `<a class="tx-next" href="#t-${next.id}"><small>下一個療程</small><span>${next.name}</span></a>` : ''}</div>
        </div>
      </div></article>`;
  },

  unpublished(t) {
    return `<div class="gut">${pageHead('療程', 'Unpublished', t.name, '這個療程已在後台轉為草稿，前台暫不顯示。重新發布後就會回到療程索引。')}<p class="more-row">${L('backend', '回到後台示意', 'lnk')}</p></div>`;
  },

  doctors() {
    return `<div class="gut">${pageHead('醫師', 'Physicians', '醫師團隊', '由整形外科與皮膚科專科醫師親自評估、執行與追蹤。人物為示意。')}</div>
    ${DOCTORS.map((d, i) => `<section class="doc ${i % 2 ? 'rev' : ''}" data-rv><div class="gut doc-in">
      <div class="doc-img">${fig(d.seed, d.name + '醫師照片', 'portrait', { w: 480, h: 600, n: 12 })}</div>
      <div class="doc-t"><h2 class="doc-name"><span class="v">${d.name}</span></h2>
        <div class="doc-body"><p class="kicker"><span>${num(i)}　${d.title}・${d.spec}</span></p><p class="doc-bio">${d.bio}</p>
        <h3>專長</h3><ul class="feat-skill">${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        <h3>學經歷</h3><table class="edu"><tbody>${d.edu.map(e => `<tr><td>${e}</td></tr>`).join('')}<tr><td>${d.certs.join('、')}｜${d.cert}</td></tr></tbody></table></div></div>
    </div></section>`).join('')}`;
  },

  articles() {
    return `<div class="gut">${pageHead('衛教', 'Journal', '衛教文章', '由本院醫師撰寫，說明治療原理、風險與照護方式。')}<section class="jr-page">${this._journal(ARTICLES)}</section></div>`;
  },

  article(a) {
    const d = dById(a.author);
    return `<article class="gut art">
      <header class="art-head"><p class="kicker"><span>${L('articles', '衛教文章')}　/　${a.tag}</span></p><h1>${a.title}</h1><p class="art-lead">${a.excerpt}</p></header>
      <div class="art-grid">
        <aside class="margin"><dl><div><dt>撰文</dt><dd><a href="#doctors">${d.name} 醫師</a><small>${d.spec}</small></dd></div><div><dt>日期</dt><dd class="num">${fmtDate(a.date)}</dd></div><div><dt>相關療程</dt><dd>${a.treatments.filter(id => S.pub[id]).map(id => L('t-' + id, tById(id).name)).join('<br>')}</dd></div></dl></aside>
        <div class="art-body">${a.body.map(([h, ps]) => `<h2>${h}</h2>${ps.map(p => `<p>${p}</p>`).join('')}`).join('')}<p class="art-note">${NOTE_ARTICLE}</p></div>
      </div></article>`;
  },

  about() {
    return `<div class="gut">${pageHead('診所', 'About', '關於霧嶼', CLINIC.sub)}</div>
    <section class="gut vals">${ABOUT.values.map(([h, p], i) => `<div class="val" data-rv><span class="val-n">${num(i)}</span><h2>${h}</h2><p>${p}</p></div>`).join('')}</section>
    <section class="blk tone" data-rv>${vlabel('環境', 'Facilities')}<div class="gut blk-in"><div class="blk-h"><h2>設備與環境</h2><p>${ABOUT.permit}</p></div>
      <div class="fac">${ABOUT.facilities.map(([h, p, s]) => `<figure class="fac-i">${contour(s, { w: 360, h: 440, n: 10, label: h })}<figcaption><b>${h}</b>${p}<small>示意圖｜正式網站替換為診所實拍</small></figcaption></figure>`).join('')}</div></div></section>
    <section class="blk" data-rv>${vlabel('流程', 'Process')}<div class="gut blk-in"><div class="blk-h"><h2>諮詢流程</h2><p>同意書可帶回考慮，不需當日決定。</p></div>
      <ol class="vt">${FLOW.map(([h, p], i) => `<li><span class="vt-n">${num(i)}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ol></div></section>
    ${this._visit()}`;
  },

  contact() {
    return `<div class="gut">${pageHead('預約', 'Consultation', '預約諮詢', '送出表單後，診所人員將於門診時間內以電話與你確認時段。療程是否適合，需由醫師當面評估。')}</div>
    <section class="gut ct">
      <form class="ct-form" data-demo-form novalidate>
        <label class="fl"><span>姓名<b>必填</b></span><input id="f-name" required autocomplete="name" placeholder="請輸入姓名"></label>
        <label class="fl"><span>聯絡電話<b>必填</b></span><input id="f-tel" type="tel" required autocomplete="tel" placeholder="09xx-xxx-xxx"></label>
        <label class="fl"><span>Email</span><input id="f-mail" type="email" autocomplete="email" placeholder="選填"></label>
        <label class="fl"><span>想諮詢的項目</span><select id="f-item">${TREATMENTS.map(t => `<option>${t.name}</option>`).join('')}<option>尚未確定，想先諮詢</option></select></label>
        <fieldset class="fl"><legend>希望時段</legend><div class="chips">${['平日午後', '平日晚間', '週六'].map((x, i) => `<label><input type="radio" name="slot" id="f-slot${i}" ${i ? '' : 'checked'}><span>${x}</span></label>`).join('')}</div></fieldset>
        <label class="fl"><span>想詢問的事項</span><textarea id="f-msg" rows="3" placeholder="例如：過去的治療經驗、目前用藥"></textarea></label>
        <label class="agree"><input type="checkbox" id="f-agree" required><span>我了解此表單僅為預約諮詢，療程是否適合需由醫師當面評估</span></label>
        <button class="lnk solid" type="submit">送出預約</button>
        <p role="status" class="formstatus" hidden></p>
      </form>
      <aside class="ct-side"><h2>霧嶼診所</h2><dl class="kv light"><div><dt>地址</dt><dd>${CLINIC.address}</dd></div><div><dt>電話</dt><dd>${CLINIC.phone}</dd></div><div><dt>交通</dt><dd>${CLINIC.transit.join('<br>')}</dd></div></dl>${hoursDL()}
        <figure class="ct-map">${mapSVG()}<figcaption>地圖示意｜正式網站嵌入地圖服務</figcaption></figure></aside>
    </section>`;
  },

  backend({ toast, screens }) {
    return `<div class="gut">${pageHead('後台', 'Backend Guide', '診所人員可以自己做的事', '正式網站採用 WordPress。以下為後台畫面示意：日常更新都是填表單與按按鈕，不需要程式背景。')}</div>
    <section class="gut bk-wrap">${toast}
      <ol class="bk-toc">${screens.map(([h], i) => `<li><button type="button" data-jump="bk${i}"><span>${num(i)}</span>${h}</button></li>`).join('')}</ol>
      ${screens.map(([h, p, frame, pts, demo], i) => `<section class="bk" id="bk${i}"><div class="bk-t"><span class="bk-n">${num(i)}</span><h2>${h}</h2><p>${p}</p><ul class="ln-list">${pts.map(x => `<li>${x}</li>`).join('')}</ul>${demo ? `<p class="demo-note">${demo}</p>` : ''}</div><div class="bk-f">${frame}</div></section>`).join('')}
      <section class="handover"><h2>交付與維護</h2><ul class="ln-list light">${HANDOVER.map(x => `<li>${x}</li>`).join('')}<li>首頁各區塊可由後台調整順序與顯示（方案 B）</li></ul></section>
    </section>`;
  },

  after(r, app) {
    document.querySelector('[data-capsule]').hidden = r.view === 'contact';
    app.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.jump).scrollIntoView({ behavior: RM() ? 'auto' : 'smooth' })));
    // reveal on scroll (only elements below the fold start hidden; everything else is visible at rest)
    if (!RM() && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('rv-pre'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
      app.querySelectorAll('[data-rv]').forEach(el => { if (el.getBoundingClientRect().top > innerHeight * 0.95) { el.classList.add('rv-pre'); io.observe(el); } });
    }
    // treatment index hover preview
    const pv = app.querySelector('.preview');
    if (pv) {
      let front = pv.querySelector('.pv.a'), back = pv.querySelector('.pv.b'), cur = null;
      app.querySelectorAll('.idx.big a').forEach(a => a.addEventListener('mouseenter', () => {
        if (cur === a.dataset.seed) return; cur = a.dataset.seed;
        back.innerHTML = contour(+a.dataset.seed, { w: 480, h: 600, n: 13 });
        back.classList.add('on'); front.classList.remove('on'); [front, back] = [back, front];
        pv.querySelector('.pv-name').textContent = a.dataset.name;
      }));
    }
    // chapter rail
    const rail = app.querySelector('.rail');
    if (rail) {
      const btns = [...rail.querySelectorAll('[data-ch]')], line = rail.querySelector('.rail-line i'), body = app.querySelector('.tx-body');
      btns.forEach(b => b.addEventListener('click', () => document.getElementById('ch-' + b.dataset.ch).scrollIntoView({ behavior: RM() ? 'auto' : 'smooth', block: 'start' })));
      const secs = btns.map(b => document.getElementById('ch-' + b.dataset.ch));
      const onScroll = () => {
        if (!document.body.contains(body)) { removeEventListener('scroll', onScroll); return; }
        const rb = body.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * 0.35 - rb.top) / (rb.height - innerHeight * 0.3)));
        line.style.transform = `scaleY(${p})`;
        let k = 0; secs.forEach((s, j) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) k = j; });
        btns.forEach((b, j) => b.classList.toggle('on', j === k));
      };
      addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
  }
};
