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
/* photo frame: muted duotone photo + brand contour overlay + 示意 label (bottom-left) */
const ph = (key, alt, cls = '', o = {}) => `<figure class="ph ${cls}"><div class="ph-in"><img src="${IMG(key)}" alt="${alt}（示意圖）" loading="${o.eager ? 'eager' : 'lazy'}" decoding="async"${o.pos ? ` style="object-position:${o.pos}"` : ''}></div>${o.seed != null ? contour(o.seed, { w: 400, h: 500, n: o.n || 7, bg: false }) : ''}<figcaption${o.vid ? ' data-vid-label' : ''}>${o.label ?? '示意圖'}</figcaption></figure>`;
const L = (view, text, cls = '') => `<a href="#${view}" class="${cls}">${text}</a>`;
const num = i => String(i + 1).padStart(2, '0');
const vlabel = (zh, en) => `<div class="vlabel" aria-hidden="true"><span class="zh">${zh}</span><span class="en">${en}</span></div>`;
const pageHead = (zh, en, title, intro, key) => `<header class="phead${key ? ' has-img' : ''}"><div class="phead-l"><p class="kicker"><span>${en}</span></p><h1 data-split>${title}</h1>${intro ? `<p class="phead-r">${intro}</p>` : ''}</div>${key ? ph(key, title, 'phead-img', { seed: zh.charCodeAt(0) % 97 }) : ''}</header>`;
const hoursDL = () => `<dl class="hrs">${CLINIC.hours.map(([d, h]) => `<div><dt>${d}</dt><dd>${h}</dd></div>`).join('')}</dl>`;
const gnum = t => num(pubT().indexOf(t));
let sessionCat = null;
const HERO_SEEDS = [7, 19, 33];
const V = {
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
      <a href="#contact" class="capsule" data-capsule><i class="beam" aria-hidden="true"></i>預約諮詢<span aria-hidden="true">→</span></a>`;
    document.getElementById('shell-bottom').innerHTML = `
      <footer class="ftr"><div class="gut">
        <div class="ftr-top"><div class="ftr-brand"><span class="ftr-zh">霧嶼診所</span><span class="ftr-tag">皮膚科・整形外科｜台北大安</span></div>
          <ul class="ftr-nav">${['home', ...NAV, 'backend'].map(n => `<li>${L(n, PAGE_NAMES[n])}</li>`).join('')}</ul></div>
        <div class="ftr-grid">
          <div><h4>機構資訊　示意</h4><dl class="kv"><div><dt>地址</dt><dd>${CLINIC.address}</dd></div><div><dt>電話</dt><dd>${CLINIC.phone}</dd></div><div><dt>負責醫師</dt><dd>${CLINIC.director}</dd></div><div><dt>診療科別</dt><dd>${CLINIC.depts}</dd></div><div><dt>開業執照</dt><dd>${CLINIC.license}</dd></div></dl></div>
          <div><h4>門診時間</h4>${hoursDL()}</div>
        </div>
        <div class="ftr-note"><p>本網站內容為衛教資訊，${NOTE_EFFECT}</p><p>網站照片取自商用授權圖庫，僅為示意。</p></div>
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
    document.addEventListener('click', e => { const g = e.target.closest('[data-go-cat]'); if (g) sessionCat = g.dataset.goCat; const d = e.target.closest('[data-doc]'); if (d) sessionDoc = d.dataset.doc; });
    // magnetic capsule (pointer devices only)
    const cap = document.querySelector('[data-capsule]');
    if (matchMedia('(hover:hover) and (pointer:fine)').matches && !RM()) {
      cap.addEventListener('pointermove', e => { const b = cap.getBoundingClientRect(); cap.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * 0.25}px,${(e.clientY - b.top - b.height / 2) * 0.35}px)`; });
      cap.addEventListener('pointerleave', () => { cap.style.transform = ''; });
    }
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
    const d = DOCTORS[0], list = pubT();
    return `
    <section class="hero" data-spot>
      <div class="mist" aria-hidden="true"><i class="m1"></i><i class="m2"></i><i class="m3"></i></div>
      <div class="spot" aria-hidden="true"></div>
      <div class="hero-map" aria-hidden="true">${contour(HERO_SEEDS[S.hero], { w: 900, h: 700, n: 14, draw: true, bg: false })}</div>
      <div class="gut hero-in">
        <h1 class="hero-v" aria-label="${CLINIC.name}"><span class="ln"><span data-chars>霧嶼</span></span><span class="ln"><span data-chars>診所</span></span></h1>
        <div class="hero-side">
          <p class="hero-en">Wuyu <i>Clinic</i></p>
          <p class="hero-p">台北・皮膚科與整形外科</p>
          <div class="hero-cta">${L('treatments', '療程索引', 'lnk')}${L('contact', '預約諮詢', 'lnk')}</div>
        </div>
        <div class="hero-photo" data-hero-video>${ph(HERO_IMGS[S.hero], HERO_LABELS[S.hero], 'tall', { eager: true, vid: true, seed: HERO_SEEDS[S.hero], n: 9, label: '示意圖｜' + HERO_LABELS[S.hero] })}</div>
      </div>
    </section>
    <section class="blk" data-rv>${vlabel('療程', 'Treatments')}<div class="gut blk-in">
      <div class="blk-h"><h2 data-split>療程索引</h2><p>依治療方式分為光電、注射、手術與皮膚保養，共 ${list.length} 項。每個療程頁都把風險與不適合對象，放在與適應症同等的位置。</p></div>
      <div class="cats">${Object.entries(CATS).map(([k, v], ci) => { const items = list.filter(t => t.cat === k); return `<div class="cat" data-stagger>
        <a href="#treatments" data-go-cat="${k}" class="cat-img" aria-label="${v}療程">${ph(POOL[k][0], v + '療程', '', { seed: 300 + ci * 17, n: 6 })}</a>
        <div class="cat-h"><span class="cat-n">${num(ci)}</span><h3>${v}</h3><sup>${items.length}</sup></div>
        <ol class="cat-list">${items.map(t => `<li><a href="#t-${t.id}"><span class="cl-n">${gnum(t)}</span><span class="cl-t">${t.name}</span><span class="cl-go" aria-hidden="true">→</span></a></li>`).join('')}</ol></div>`; }).join('')}</div>
      <p class="more-row">${L('treatments', '完整療程索引', 'lnk')}</p>
    </div></section>
    <section class="blk tone" data-rv>${vlabel('流程', 'Process')}<div class="gut blk-in">
      <div class="blk-h"><h2 data-split>諮詢流程</h2><p>共六個步驟，可左右滑動瀏覽。</p></div>
      <ol class="tl" tabindex="0" aria-label="諮詢流程">${FLOW.map(([h, p], i) => `<li data-stagger><span class="tl-n">${num(i)}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
    </div></section>
    <section class="blk" data-rv>${vlabel('醫師', 'Physicians')}<div class="gut blk-in feat">
      <div class="feat-img">${ph(d.photo, d.name + '醫師', 'portrait', { seed: d.seed, label: '人物示意' })}</div>
      <div class="feat-t"><p class="kicker"><span>${d.spec}</span></p><h2 class="feat-name" data-split>${d.name}<small>${d.title}</small></h2><p>${d.bio}</p>
        <ul class="feat-skill">${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        <div class="feat-others">${DOCTORS.slice(1).map(x => `<a href="#doctors" data-doc="${x.id}">${ph(x.photo, x.name + '醫師', 'mini', { label: '' })}<span><b>${x.name}</b><small>${x.spec}</small></span></a>`).join('')}</div>
        ${L('doctors', '醫師團隊', 'lnk')}</div>
    </div></section>
    <section class="quote" data-rv><div class="gut"><p class="q" data-words>醫學美容從評估開始。了解你的需求、皮膚與組織狀況，再一起討論是否需要治療。</p><p class="q-by">霧嶼診所　看診原則</p></div></section>
    <section class="blk" data-rv>${vlabel('消息', 'News')}<div class="gut blk-in">
      <div class="blk-h"><h2 data-split>最新消息</h2><p>門診時間異動、醫師門診調整與就醫須知。</p></div>
      ${this._journal(ARTICLES.slice(0, 3))}<p class="more-row">${L('articles', '所有消息', 'lnk')}</p>
    </div></section>
    ${this._visit()}`;
  },

  _journal(list) {
    return `<ol class="jr">${list.map(a => `<li data-stagger><a href="#a-${a.id}"><time><span class="jr-d">${a.date.slice(8)}</span><span class="jr-m">${a.date.slice(0, 7).replace('-', '.')}</span></time><span class="jr-t"><span class="jr-tag">${a.tag}</span><span class="jr-h">${a.title}</span><span class="jr-ex">${a.excerpt}</span></span>${ph(a.photo, a.title, 'jr-img')}</a></li>`).join('')}</ol>`;
  },

  _visit() {
    return `<section class="visit" data-rv><div class="gut visit-in">
      <div><p class="kicker light"><span>Visit</span></p><h2>來診資訊</h2><dl class="kv light"><div><dt>地址</dt><dd>${CLINIC.address}</dd></div><div><dt>電話</dt><dd>${CLINIC.phone}</dd></div></dl>${hoursDL()}${L('contact', '預約諮詢', 'lnk light')}</div>
      <figure class="visit-map">${mapSVG()}<figcaption>地圖示意｜正式網站嵌入地圖服務</figcaption></figure>
    </div></section>`;
  },

  treatments() {
    const list = pubT(), first = list[0];
    return `<div class="gut">${pageHead('療程', 'Treatment Index', '療程索引', '以下為本院提供的醫學美容療程。療程是否適合，需經醫師評估。')}</div>
    <section class="gut tlist">
      <div class="filters" role="group" aria-label="療程分類"><button type="button" data-filter="all" aria-pressed="true">全部 <sup>${list.length}</sup></button>${Object.entries(CATS).map(([k, v]) => `<button type="button" data-filter="${k}" aria-pressed="false">${v} <sup>${list.filter(t => t.cat === k).length}</sup></button>`).join('')}</div>
      <div class="tlist-grid">
        <div class="tgroups">${Object.entries(CATS).map(([k, v], ci) => { const items = list.filter(t => t.cat === k); return items.length ? `<div class="tgroup" data-cat="${k}">
          <div class="tg-h"><span class="cat-n">${num(ci)}</span><h2>${v}</h2><p>${CAT_DESC[k]}</p></div>
          <ol class="idx big">${items.map(t => `<li data-stagger><a href="#t-${t.id}" data-photo="${t.photo}" data-pos="${t.pos}" data-name="${t.name}"><span class="idx-n">${gnum(t)}</span><span class="idx-name">${t.name}<i>${t.en}</i></span><span class="idx-sum">${t.summary}</span><span class="idx-thumb">${ph(t.photo, t.name, '', { pos: t.pos, label: '' })}</span></a></li>`).join('')}</ol></div>` : ''; }).join('')}</div>
        <div class="preview" aria-hidden="true">${first ? `<div class="pv a on"><img src="${IMG(first.photo)}" alt="" style="object-position:${first.pos}"></div><div class="pv b"><img alt=""></div>${contour(500, { w: 480, h: 600, n: 9, bg: false })}<p class="pv-cap"><span class="pv-name">${first.name}</span>示意圖</p>` : ''}</div>
      </div>
      ${list.length < TREATMENTS.length ? `<p class="hint">有 ${TREATMENTS.length - list.length} 個療程目前在後台設為草稿，因此未顯示。${L('backend', '回到後台示意')}</p>` : ''}
      <p class="fee">${NOTE_FEE}${NOTE_DEVICE}</p>
    </section>`;
  },

  treatment(t) {
    const d = dById(t.doctor);
    const chapters = [['principle', '原理'], ['ind', '適應症'], ['info', '療程資訊'], ['before', '治療前須知'], ['care', '術後照護']];
    const same = pubT().filter(x => x.cat === t.cat);
    const next = same.length > 1 ? same[(same.indexOf(t) + 1) % same.length] : null;
    return `<article class="tx">
      <header class="gut tx-head"><p class="kicker"><span>${L('treatments', '療程索引')}　/　${CATS[t.cat]}　/　${gnum(t)}</span></p>
        <h1 data-split>${t.name}</h1><p class="tx-en">${t.en}</p><p class="tx-sum">${t.summary}</p></header>
      <div class="tx-fig">${ph(t.photo, t.name + '療程情境', 'wide', { pos: t.pos, seed: t.seed, n: 12, eager: true })}</div>
      <div class="gut tx-grid">
        <nav class="rail" aria-label="章節"><div class="rail-line"><i></i></div><ol>${chapters.map(([id, l], k) => `<li><button type="button" data-ch="${id}"><span>${num(k)}</span>${l}</button></li>`).join('')}</ol>
          <div class="rail-doc"><span class="kicker"><span>主治醫師</span></span><a href="#doctors" data-doc="${d.id}">${d.name} ${d.title}</a><small>${d.spec}</small></div></nav>
        <div class="tx-body">
          <section id="ch-principle" class="ch" data-rv><h2><span>01</span>原理</h2>${t.principle.map(p => `<p>${p}</p>`).join('')}</section>
          <section id="ch-ind" class="ch" data-rv><h2><span>02</span>適應症</h2><ul class="ln-list">${t.indications.map(x => `<li>${x}</li>`).join('')}</ul></section>
          <section id="ch-info" class="ch" data-rv><h2><span>03</span>療程資訊</h2><dl class="facts">${t.info.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></section>
          <section id="ch-before" class="ch dark" data-rv><h2><span>04</span>治療前須知</h2>
            <div class="dark-grid"><div><h3>可能的副作用與風險</h3><dl class="rk">${t.risks.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
            <div><h3>不適合對象</h3><ul class="ln-list light">${t.contra.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
            ${t.extra ? `<p class="dark-extra">${t.extra}</p>` : ''}</section>
          <section id="ch-care" class="ch" data-rv><h2><span>05</span>術後照護</h2><ul class="ln-list">${t.care.map(x => `<li>${x}</li>`).join('')}</ul></section>
          <div class="statement"><p>${NOTE_EFFECT}</p><p>${NOTE_FEE}</p><p>${NOTE_DEVICE}</p></div>
          ${t.articles.length ? `<div class="ch"><h2 class="sm">相關公告</h2>${this._journal(t.articles.map(aById))}</div>` : ''}
          <div class="tx-end">${L('contact', '預約諮詢', 'lnk')}${next ? `<a class="tx-next" href="#t-${next.id}"><small>同類下一個療程　${CATS[t.cat]}</small><span>${next.name}</span></a>` : ''}</div>
        </div>
      </div></article>`;
  },

  unpublished(t) {
    return `<div class="gut">${pageHead('療程', 'Unpublished', t.name, '這個療程已在後台轉為草稿，前台暫不顯示。重新發布後就會回到療程索引。')}<p class="more-row">${L('backend', '回到後台示意', 'lnk')}</p></div>`;
  },

  doctors() {
    return `<div class="gut">${pageHead('醫師', 'Physicians', '醫師團隊', '由整形外科與皮膚科專科醫師親自評估、執行與追蹤。人物與照片皆為示意。')}</div>
    ${DOCTORS.map((d, i) => `<section class="doc ${i % 2 ? 'rev' : ''}" id="doc-${d.id}" data-rv><div class="gut doc-in">
      <div class="doc-img">${ph(d.photo, d.name + '醫師', 'portrait', { seed: d.seed, label: '人物示意' })}</div>
      <div class="doc-t"><h2 class="doc-name"><span class="v">${d.name}</span></h2>
        <div class="doc-body"><p class="kicker"><span>${num(i)}　${d.title}・${d.spec}</span></p><p class="doc-bio">${d.bio}</p>
        <h3>專長</h3><ul class="feat-skill">${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        <h3>學經歷</h3><table class="edu"><tbody>${d.edu.map(e => `<tr><td>${e}</td></tr>`).join('')}<tr><td>${d.certs.join('、')}｜${d.cert}</td></tr></tbody></table></div></div>
    </div></section>`).join('')}`;
  },

  articles() {
    return `<div class="gut">${pageHead('消息', 'News', '最新消息', '門診時間異動、醫師門診調整與就醫須知。')}<section class="jr-page">${this._journal(ARTICLES)}</section></div>`;
  },

  article(a) {
    const d = a.doctor ? dById(a.doctor) : null;
    return `<article class="gut art">
      <header class="art-head"><p class="kicker"><span>${L('articles', '最新消息')}　/　${a.tag}</span></p><h1 data-split>${a.title}</h1><p class="art-lead">${a.excerpt}</p></header>
      ${ph(a.photo, a.title, 'art-fig', { seed: a.seed, n: 8 })}
      <div class="art-grid">
        <aside class="margin"><dl><div><dt>發布</dt><dd>${byName(a)}</dd></div><div><dt>日期</dt><dd class="num">${fmtDate(a.date)}</dd></div>${d ? `<div><dt>相關醫師</dt><dd><a href="#doctors" data-doc="${d.id}">${d.name} 醫師</a><small>${d.spec}</small></dd></div>` : ''}${a.treatments.some(id => S.pub[id]) ? `<div><dt>相關療程</dt><dd>${a.treatments.filter(id => S.pub[id]).map(id => L('t-' + id, tById(id).name)).join('<br>')}</dd></div>` : ''}</dl></aside>
        <div class="art-body">${a.body.map(([h, ps]) => `<h2>${h}</h2>${ps.map(p => `<p>${p}</p>`).join('')}`).join('')}<p class="art-note">${NOTE_ARTICLE}</p></div>
      </div></article>`;
  },

  about() {
    return `<div class="gut">${pageHead('診所', 'About', '關於霧嶼', CLINIC.sub, 'about-0')}</div>
    <section class="gut vals">${ABOUT.values.map(([h, p], i) => `<div class="val" data-stagger><span class="val-n">${num(i)}</span><h2>${h}</h2><p>${p}</p></div>`).join('')}</section>
    <section class="blk tone" data-rv>${vlabel('環境', 'Facilities')}<div class="gut blk-in"><div class="blk-h"><h2 data-split>設備與環境</h2><p>${ABOUT.permit}</p></div>
      <div class="fac">${ABOUT.facilities.map(([h, p, s, k]) => `<figure class="fac-i" data-stagger>${ph(k, h, 'r34', { seed: s, n: 6 })}<figcaption><b>${h}</b>${p}</figcaption></figure>`).join('')}</div></div></section>
    <section class="blk" data-rv>${vlabel('流程', 'Process')}<div class="gut blk-in"><div class="blk-h"><h2 data-split>諮詢流程</h2><p>同意書可帶回考慮，不需當日決定。</p></div>
      <ol class="vt">${FLOW.map(([h, p], i) => `<li data-stagger><span class="vt-n">${num(i)}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ol></div></section>
    ${this._visit()}`;
  },

  contact() {
    return `<div class="gut">${pageHead('預約', 'Consultation', '預約諮詢', '送出表單後，診所人員將於門診時間內以電話與你確認時段。')}</div>
    <section class="gut ct">
      <form class="ct-form" data-demo-form novalidate>
        <label class="fl"><span>姓名<b>必填</b></span><input id="f-name" required autocomplete="name" placeholder="請輸入姓名"></label>
        <label class="fl"><span>聯絡電話<b>必填</b></span><input id="f-tel" type="tel" required autocomplete="tel" placeholder="09xx-xxx-xxx"></label>
        <label class="fl"><span>Email</span><input id="f-mail" type="email" autocomplete="email" placeholder="選填"></label>
        <label class="fl"><span>想諮詢的項目</span><select id="f-item">${Object.entries(CATS).map(([k, v]) => `<optgroup label="${v}">${TREATMENTS.filter(t => t.cat === k).map(t => `<option>${t.name}</option>`).join('')}</optgroup>`).join('')}<option>尚未確定，想先諮詢</option></select></label>
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
    return `<div class="gut">${pageHead('後台', 'Backend Guide', '後台操作說明', '正式網站採用 WordPress，以下為後台畫面示意。')}</div>
    <section class="gut bk-wrap">${toast}
      <ol class="bk-toc">${screens.map(([h], i) => `<li><button type="button" data-jump="bk${i}"><span>${num(i)}</span>${h}</button></li>`).join('')}</ol>
      ${screens.map(([h, p, frame, pts, demo], i) => `<section class="bk" id="bk${i}"><div class="bk-t"><span class="bk-n">${num(i)}</span><h2>${h}</h2><p>${p}</p><ul class="ln-list">${pts.map(x => `<li>${x}</li>`).join('')}</ul>${demo ? `<p class="demo-note">${demo}</p>` : ''}</div><div class="bk-f">${frame}</div></section>`).join('')}
      <section class="handover"><h2>交付與維護</h2><ul class="ln-list light">${HANDOVER.map(x => `<li>${x}</li>`).join('')}<li>首頁各區塊可由後台調整順序與顯示（方案 B）</li><li>動態效果以 GSAP 與 CSS 製作，可直接整合進 WordPress 佈景主題</li></ul></section>
    </section>`;
  },

  after(r, app) {
    if (r.view === 'home') heroVideo(app, '../assets/vid/b-hero.mp4', HERO_LABELS[0]);
    document.querySelector('[data-capsule]').hidden = r.view === 'contact';
    app.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.jump).scrollIntoView({ behavior: RM() ? 'auto' : 'smooth' })));
    if (r.view === 'treatments' && sessionCat) { const b = app.querySelector(`[data-filter="${sessionCat}"]`); sessionCat = null; if (b) b.click(); }
    if (r.view === 'doctors' && sessionDoc) { const el = document.getElementById('doc-' + sessionDoc); sessionDoc = null; if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 30); }
    // treatment index hover preview (photo crossfade)
    const pv = app.querySelector('.preview');
    if (pv) {
      let front = pv.querySelector('.pv.a'), back = pv.querySelector('.pv.b'), cur = null;
      app.querySelectorAll('.idx.big a').forEach(a => a.addEventListener('mouseenter', () => {
        if (cur === a) return; cur = a;
        const img = back.querySelector('img'); img.src = IMG(a.dataset.photo); img.style.objectPosition = a.dataset.pos;
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
    if (RM()) return;
    if (window.gsap && window.ScrollTrigger) motion(app); else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('rv-pre'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
      app.querySelectorAll('[data-rv]').forEach(el => { if (el.getBoundingClientRect().top > innerHeight * 0.95) { el.classList.add('rv-pre'); io.observe(el); } });
    }
  }
};
let sessionDoc = null;

/* ---------- Motion layer (GSAP 3 + ScrollTrigger). Everything is visible without it. ---------- */
const below = el => el.getBoundingClientRect().top > innerHeight * 0.92;
function splitChars(el) {
  if (el.dataset.done) return [...el.querySelectorAll('.ch-s')];
  el.dataset.done = 1;
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) { const f = document.createDocumentFragment(); [...n.textContent].forEach(c => { const s = document.createElement('span'); s.className = 'ch-s'; s.textContent = c; f.appendChild(s); }); n.replaceWith(f); }
    else if (n.nodeType === 1 && n.tagName !== 'SMALL') walk(n);
  });
  walk(el); return [...el.querySelectorAll('.ch-s')];
}
function motion(app) {
  const g = window.gsap, ST = window.ScrollTrigger;
  g.registerPlugin(ST);
  ST.getAll().forEach(t => t.kill());
  document.documentElement.classList.add('gs');
  // 1. hero: per-character blur-in (Magic UI "blur fade" style)
  app.querySelectorAll('.hero-v [data-chars]').forEach((el, i) => {
    const cs = splitChars(el);
    g.fromTo(cs, { opacity: 0, filter: 'blur(14px)', yPercent: 30 }, { opacity: 1, filter: 'blur(0px)', yPercent: 0, duration: 1.1, ease: 'power3.out', stagger: 0.07, delay: 0.15 + i * 0.32, clearProps: 'filter' });
  });
  const side = app.querySelector('.hero-side');
  if (side) g.fromTo(side.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.1, delay: 0.7 });
  const hp = app.querySelector('.hero-photo .ph');
  if (hp) {
    g.fromTo(hp, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', delay: 0.2 });
    g.fromTo(hp.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 2, ease: 'expo.out', delay: 0.2 });
  }
  // 2. hero parallax: contour map drifts, photo lifts while scrolling away
  const hero = app.querySelector('.hero');
  if (hero) {
    g.to('.hero-map', { yPercent: -18, rotate: -3, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    g.to('.hero-photo', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    // 3. mist spotlight follows the pointer (Aceternity "spotlight" idea)
    const spot = hero.querySelector('.spot');
    const qx = g.quickTo(spot, 'x', { duration: 0.8, ease: 'power3' }), qy = g.quickTo(spot, 'y', { duration: 0.8, ease: 'power3' });
    hero.addEventListener('pointermove', e => { const b = hero.getBoundingClientRect(); qx(e.clientX - b.left); qy(e.clientY - b.top); hero.classList.add('lit'); });
    hero.addEventListener('pointerleave', () => hero.classList.remove('lit'));
  }
  // 4. headings: blur-in on scroll (per char)
  app.querySelectorAll('[data-split]').forEach(el => {
    const cs = splitChars(el), from = { opacity: 0, filter: 'blur(10px)', y: 14 };
    const to = { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.035, clearProps: 'filter' };
    if (below(el)) { g.set(cs, from); g.to(cs, { ...to, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }); }
    else g.fromTo(cs, from, { ...to, delay: 0.1 });
  });
  // 5. quote: words light up while scrolling (React Bits "scroll reveal")
  app.querySelectorAll('[data-words]').forEach(el => {
    const cs = splitChars(el);
    g.fromTo(cs, { opacity: 0.16 }, { opacity: 1, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  });
  // 6. photos: clip reveal + inner parallax
  app.querySelectorAll('.ph:not(.mini):not(.jr-img)').forEach(f => {
    if (f.closest('.hero-photo') || f.closest('.idx-thumb')) return;
    const img = f.querySelector('img');
    if (below(f)) g.fromTo(f, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 88%', once: true } });
    g.fromTo(img, { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  // 7. contour overlays draw themselves in
  app.querySelectorAll('.ph .contour path').forEach(p => { p.style.strokeDasharray = 1; });
  app.querySelectorAll('.ph .contour').forEach(svg => {
    g.fromTo(svg.querySelectorAll('path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.08, scrollTrigger: { trigger: svg, start: 'top 90%', once: true } });
  });
  // 8. lists / cards: batch stagger in
  const items = [...app.querySelectorAll('[data-stagger]')].filter(below);
  if (items.length) {
    g.set(items, { opacity: 0, y: 26 });
    ST.batch(items, { start: 'top 92%', once: true, onEnter: b => g.to(b, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 }) });
  }
  // 9. sections without their own motion: soft rise
  app.querySelectorAll('[data-rv]').forEach(el => {
    if (!below(el) || el.querySelector('[data-stagger]')) return;
    g.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  ST.refresh();
}
