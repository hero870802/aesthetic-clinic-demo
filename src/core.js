/* Shared router, state and backend mock. Each version defines window.V (renderer). */
const S = { pub: Object.fromEntries(TREATMENTS.map(t => [t.id, true])), hero: 0, picker: false, toast: '' };
const pubT = () => TREATMENTS.filter(t => S.pub[t.id]);
const ROUTES = ['home', 'treatments', 'doctors', 'articles', 'about', 'contact', 'backend'];
const PAGE_NAMES = { home: '首頁', treatments: '療程項目', doctors: '醫師團隊', articles: '最新消息', about: '關於診所', contact: '預約諮詢', backend: '後台操作說明' };
const NAV = ['treatments', 'doctors', 'articles', 'about', 'contact'];

function parseRoute() {
  const h = (location.hash || '#home').slice(1);
  if (ROUTES.includes(h)) return { view: h };
  if (h.startsWith('t-') && tById(h.slice(2))) return { view: 'treatment', item: tById(h.slice(2)) };
  if (h.startsWith('a-') && aById(h.slice(2))) return { view: 'article', item: aById(h.slice(2)) };
  return { view: 'home' };
}

function pageTitle(r) {
  const base = r.item ? (r.item.name || r.item.title) : PAGE_NAMES[r.view];
  return (r.view === 'home' ? CLINIC.name + '｜' + CLINIC.tagline : base + '｜' + CLINIC.name) + '（示意）';
}

function renderView(r) {
  if (r.view === 'treatment' && !S.pub[r.item.id]) return V.unpublished(r.item);
  if (r.view === 'treatment') return V.treatment(r.item);
  if (r.view === 'article') return V.article(r.item);
  if (r.view === 'backend') return V.backend(backendHTML());
  return V[r.view]();
}

let firstRender = true;
function route(opts = {}) {
  const r = parseRoute();
  const app = document.getElementById('app');
  const paint = () => {
    app.innerHTML = renderView(r);
    document.title = pageTitle(r);
    if (!opts.keepScroll) window.scrollTo(0, 0);
    document.querySelectorAll('[data-nav]').forEach(a => {
      const cur = a.dataset.nav === r.view || (r.view === 'treatment' && a.dataset.nav === 'treatments') || (r.view === 'article' && a.dataset.nav === 'articles');
      a.classList.toggle('is-current', cur);
      if (cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    bindCommon(app);
    V.after && V.after(r, app, firstRender);
    if (!firstRender && !opts.keepScroll) { const h1 = app.querySelector('h1'); if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); } }
    firstRender = false;
  };
  if (!firstRender && !opts.keepScroll && V.transition) V.transition(paint); else paint();
}

function bindCommon(root) {
  root.querySelectorAll('form[data-demo-form]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const st = f.querySelector('[role="status"]');
    if (!f.checkValidity()) { f.reportValidity(); return; }
    st.textContent = '此為示範網站，資料並未送出。正式網站將寄送至診所信箱並寫入後台「聯絡表單紀錄」。';
    st.hidden = false;
  }));
  root.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    const c = btn.dataset.filter;
    root.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
    root.querySelectorAll('[data-cat]').forEach(el => { el.hidden = !(c === 'all' || el.dataset.cat === c); });
  }));
  // backend interactions
  root.querySelectorAll('[data-toggle-pub]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.togglePub; S.pub[id] = !S.pub[id];
    S.toast = S.pub[id] ? `「${tById(id).name}」已重新發布，前台療程列表與首頁已恢復顯示。` : `「${tById(id).name}」已轉為草稿（下架）。到前台療程列表看看，它已經不見了；內容仍保留在後台。`;
    route({ keepScroll: true });
  }));
  root.querySelectorAll('[data-open-picker]').forEach(b => b.addEventListener('click', () => { S.picker = !S.picker; route({ keepScroll: true }); }));
  root.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => {
    S.hero = +b.dataset.pick; S.picker = false; S.toast = '首頁主視覺已更換。回到首頁就能看到新的圖片。'; route({ keepScroll: true });
  }));
  const chk = root.querySelector('#wp-summary');
  if (chk) {
    const out = root.querySelector('#wp-summary-check');
    const run = () => {
      const v = chk.value; const hits = BANNED.filter(w => v.includes(w));
      const count = root.querySelector('#wp-summary-count'); count.textContent = `${[...v].length} / 40 字`;
      if (!hits.length) { out.className = 'wp-check ok'; out.textContent = '用詞檢查通過，可以發布。'; return; }
      const re = new RegExp('(' + hits.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
      const safe = v.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      out.className = 'wp-check warn';
      out.innerHTML = '<strong>發布前提醒：</strong>以下標示的詞語可能違反醫療廣告規範，建議改寫。<div class="wp-check-text">' + safe.replace(re, '<mark>$1</mark>') + '</div>';
    };
    chk.addEventListener('input', run); run();
  }
}

/* ---------- Backend mock (shared by both versions) ---------- */
const ICON = {
  lock: '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  img: '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="5.5" cy="6.5" r="1.4" fill="currentColor"/><path d="M2 12l4-4 3 3 2-2 3 3" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  pin: '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.4 4.5 8.5 4.5 8.5s4.5-5.1 4.5-8.5A4.5 4.5 0 0 0 8 1.5z" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="6" r="1.6" fill="currentColor"/></svg>'
};

function wpFrame(active, title, body, url) {
  const menu = [['dash', '控制台'], ['treat', '療程'], ['doc', '醫師'], ['post', '最新消息'], ['media', '媒體庫'], ['home', '首頁設定'], ['form', '聯絡表單紀錄']];
  return `<div class="wp-scroll"><div class="wp" role="img" aria-label="WordPress 後台示意畫面：${title}">
    <div class="wp-bar"><span class="wp-logo">W</span><span>${CLINIC.name}（示意）</span><span class="wp-bar-r">嗨，診所管理員</span></div>
    <div class="wp-body">
      <nav class="wp-menu">${menu.map(([k, l]) => `<span class="${k === active ? 'on' : ''}">${l}</span>`).join('')}</nav>
      <div class="wp-main"><div class="wp-h"><span>${title}</span>${url ? `<span class="wp-btn ghost">${url}</span>` : ''}</div>${body}</div>
    </div></div></div>`;
}

function backendHTML() {
  const toast = S.toast ? `<div class="wp-toast" role="status">${S.toast}</div>` : '';
  S.toast = '';
  const heroThumb = wpImg(HERO_IMGS[S.hero]);
  const pickers = [0, 1, 2].map(i => `<button type="button" class="wp-pick ${i === S.hero ? 'sel' : ''}" data-pick="${i}" aria-label="選用圖片 ${i + 1}">${wpImg(HERO_IMGS[i])}<span>${HERO_IMGS[i]}.jpg</span></button>`).join('');

  const s1 = wpFrame('home', '首頁設定', `
    <div class="wp-card">
      <div class="wp-label">首頁主視覺</div>
      <div class="wp-imgfield"><div class="wp-thumb">${heroThumb}</div>
        <div class="wp-imgmeta"><div class="wp-row"><button type="button" class="wp-btn" data-open-picker>${S.picker ? '收起媒體庫' : '更換圖片'}</button><span class="wp-btn ghost">移除</span></div>
        <div class="wp-hint">建議尺寸 1920 × 1080 像素，JPG 或 WebP</div>
        <div class="wp-label sm">替代文字 <em>有助於搜尋引擎</em></div><div class="wp-input">診所接待大廳</div></div></div>
      ${S.picker ? `<div class="wp-picker"><div class="wp-label sm">從媒體庫選擇圖片</div><div class="wp-pickgrid">${pickers}</div></div>` : ''}
    </div>
    <div class="wp-card"><div class="wp-label">各內頁橫幅</div>
      <div class="wp-banners">${['療程項目', '醫師團隊', '最新消息', '關於診所'].map((l, i) => `<div><div class="wp-thumb sm">${wpImg([BANNERS.treatments, BANNERS.doctors, BANNERS.articles, BANNERS.about][i])}</div><span>${l}</span><span class="wp-link">更換</span></div>`).join('')}</div>
    </div>`);

  const s2 = wpFrame('media', '媒體庫', `
    <div class="wp-drop">${ICON.img}<span>將檔案拖曳到這裡，或 <u>選擇檔案</u> 上傳</span></div>
    <div class="wp-media">${['hero-0', 'light-0', 'inject-1', 'care-1', 'surgery-1', 'news-0', 'about-0', 'hero-2'].map((k, i) => `<div class="wp-thumb ${i === 1 ? 'sel' : ''}">${wpImg(k)}</div>`).join('')}</div>
    <div class="wp-row end"><span class="wp-hint">已選取 1 張</span><span class="wp-btn">選用這張圖片</span></div>`);

  const rows = TREATMENTS.slice(0, 8).map(t => `<tr class="${S.pub[t.id] ? '' : 'draft'}"><td><strong>${t.name}</strong><div class="wp-rowact"><span class="wp-link">編輯</span><span class="wp-link">快速編輯</span><button type="button" class="wp-link btn" data-toggle-pub="${t.id}">${S.pub[t.id] ? '轉為草稿（下架）' : '重新發布'}</button><span class="wp-link danger">移至回收桶</span></div></td><td>${CATS[t.cat]}</td><td><span class="wp-status ${S.pub[t.id] ? 'pub' : 'dr'}">${S.pub[t.id] ? '已發布' : '草稿'}</span></td><td class="num">2026.11.0${(t.seed % 9) + 1}</td></tr>`).join('') + `<tr><td colspan="4" class="wp-more">…共 ${TREATMENTS.length} 項，第 1 頁／共 3 頁</td></tr>`;
  const s3 = wpFrame('treat', '療程', `
    <div class="wp-row"><span class="wp-btn">新增療程</span><span class="wp-hint">全部 (${TREATMENTS.length})｜已發布 (${pubT().length})｜草稿 (${TREATMENTS.length - pubT().length})</span></div>
    <table class="wp-table"><thead><tr><th>名稱</th><th>分類</th><th>狀態</th><th>修改日期</th></tr></thead><tbody>${rows}</tbody></table>`);

  const t = TREATMENTS[0];
  const s4 = wpFrame('treat', '編輯療程：' + t.name, `
    <div class="wp-notice">發布前自動檢查：內容含有不建議使用的詞語時，會以底色標示並提醒修改。</div>
    <div class="wp-edit"><div class="wp-fields">
      <div class="wp-input lg">${t.name}</div>
      <label class="wp-label" for="wp-summary">一句話簡介 <em>限 40 字</em></label>
      <input id="wp-summary" class="wp-input live" maxlength="40" value="${t.summary}">
      <div class="wp-row between"><span class="wp-hint">請描述治療方式，不寫療效承諾或比較用語</span><span class="wp-hint" id="wp-summary-count"></span></div>
      <div id="wp-summary-check" class="wp-check" aria-live="polite"></div>
      <div class="wp-label">原理</div><div class="wp-input tall">${t.principle[0]}</div>
      <div class="wp-label">適應症 <em>可增減列</em></div>
      ${t.indications.map(i => `<div class="wp-input rep">${i}<span>−</span></div>`).join('')}<span class="wp-link">＋ 新增一列</span>
      <div class="wp-label">療程資訊</div><div class="wp-grid4">${t.info.map(([k, v]) => `<div><span class="wp-hint">${k}</span><div class="wp-input">${v.slice(0, 14)}…</div></div>`).join('')}</div>
      <div class="wp-label">可能的副作用與風險 <b class="req">必填</b></div><div class="wp-input tall">${t.risks[0][1]}</div><div class="wp-hint">未填寫無法發布</div>
      <div class="wp-label">不適合對象 <b class="req">必填</b>　術後照護 <b class="req">必填</b></div><div class="wp-input">已填寫 ${t.contra.length} 項／${t.care.length} 項</div>
      <div class="wp-label">固定聲明 ${ICON.lock}</div><div class="wp-input locked">${ICON.lock} ${NOTE_EFFECT}${NOTE_DEVICE}</div><div class="wp-hint">由系統自動帶入每個療程頁，無法刪除</div>
      <div class="wp-label">療程主圖</div><div class="wp-row"><div class="wp-thumb xs">${wpImg(t.photo)}</div><span class="wp-hint">請勿上傳術前術後比較照片</span></div>
      <div class="wp-hint sep">依規定不刊登優惠與價格促銷資訊，因此不設價格欄位。</div>
    </div>
    <aside class="wp-side"><div class="wp-box"><div class="wp-label">發布</div><div class="wp-hint">狀態：<strong>${S.pub[t.id] ? '已發布' : '草稿'}</strong></div><div class="wp-hint">可見度：公開</div><div class="wp-row between"><span class="wp-link">預覽</span><span class="wp-btn">更新</span></div></div>
      <div class="wp-box"><div class="wp-label">療程分類</div>${Object.entries(CATS).map(([k, v]) => `<div class="wp-hint"><span class="wp-cb ${k === t.cat ? 'on' : ''}"></span>${v}</div>`).join('')}</div>
      <div class="wp-box"><div class="wp-label">主治醫師</div><div class="wp-input">${dById(t.doctor).name} ▾</div></div></aside></div>`);

  const a = ARTICLES[0];
  const s5 = wpFrame('post', '最新消息', `
    <div class="wp-row"><span class="wp-btn">新增文章</span></div>
    <table class="wp-table"><thead><tr><th>標題</th><th>發布單位</th><th>日期</th></tr></thead><tbody>${ARTICLES.map(x => `<tr><td><strong>${x.title}</strong><div class="wp-rowact"><span class="wp-link">編輯</span><span class="wp-link danger">刪除</span></div></td><td>${byName(x)}</td><td class="num">${fmtDate(x.date)}</td></tr>`).join('')}</tbody></table>
    <div class="wp-edit mt"><div class="wp-fields"><div class="wp-input lg">${a.title}</div>
      <div class="wp-toolbar"><b>B</b><i>I</i><span>H2</span><span>H3</span><span>• 清單</span><span>連結</span><span>${ICON.img}</span></div>
      <div class="wp-input tall doc"><strong>${a.body[0][0]}</strong><br>${a.body[0][1][0]}</div></div>
    <aside class="wp-side"><div class="wp-box"><div class="wp-label">分類</div><div class="wp-input">${a.tag} ▾</div></div><div class="wp-box"><div class="wp-label">相關療程</div>${TREATMENTS.filter(x => ['btx', 'ha', 'caha'].includes(x.id)).map(x => `<div class="wp-hint"><span class="wp-cb ${a.treatments.includes(x.id) ? 'on' : ''}"></span>${x.name}</div>`).join('')}</div><div class="wp-box"><div class="wp-label">精選圖片</div><div class="wp-thumb xs">${wpImg(a.photo)}</div></div></aside></div>`);

  const d = DOCTORS[1];
  const s6 = wpFrame('doc', '編輯醫師：' + d.name, `
    <div class="wp-edit"><div class="wp-fields">
      <div class="wp-grid2"><div><div class="wp-label">姓名</div><div class="wp-input">${d.name}</div></div><div><div class="wp-label">職稱</div><div class="wp-input">${d.title}</div></div><div><div class="wp-label">專科別</div><div class="wp-input">${d.spec}</div></div><div><div class="wp-label">專科證書字號</div><div class="wp-input">${d.cert}</div></div></div>
      <div class="wp-label">學經歷 <em>可增減列，可拖曳排序</em></div>${d.edu.slice(0, 3).map(e => `<div class="wp-input rep">${e}<span>−</span></div>`).join('')}<span class="wp-link">＋ 新增一列</span>
      <div class="wp-label">專長</div><div class="wp-input">${d.skills.join('、')}</div>
    </div><aside class="wp-side"><div class="wp-box"><div class="wp-label">醫師照片</div><div class="wp-thumb">${wpImg(d.photo)}</div><span class="wp-link">更換照片</span></div><div class="wp-box"><div class="wp-label">顯示順序</div><div class="wp-input">2</div></div></aside></div>`);

  const screens = [
    ['更換首頁與內頁圖片', '首頁主視覺與各內頁橫幅都在「首頁設定」裡更換。點「更換圖片」，從媒體庫選一張，按下更新就完成。', s1, ['點「更換圖片」開啟媒體庫', '選擇圖片後自動套用', '替代文字讓搜尋引擎看懂圖片'], '示範互動：試著點「更換圖片」並選一張，再回首頁看看。重新整理後還原。'],
    ['上傳與管理圖片', '所有圖片集中在媒體庫。上傳一次，首頁、療程、文章都能重複選用。', s2, ['拖曳上傳，不需另外裁切工具', '同一張圖可用在多個頁面'], ''],
    ['新增、調整、下架療程', '療程列表一眼看到每個項目的狀態。「轉為草稿」就是下架：前台立刻不顯示，但內容保留，隨時可以重新發布。', s3, ['「新增療程」建立新項目', '「轉為草稿」下架，不會刪除內容', '「移至回收桶」才是刪除，30 天內可復原'], '示範互動：試著把一個療程「轉為草稿」，再到前台療程列表看看。重新整理後還原。'],
    ['療程內容用填表的方式編輯', '每個欄位對應前台的一個區塊，填好就會自動排版。風險、不適合對象、術後照護設為必填，固定聲明由系統帶入。', s4, ['欄位與前台區塊一一對應', '必填欄位沒填無法發布', '用詞檢查提醒可能違規的字詞'], '示範互動：在「一句話簡介」試著輸入療效承諾類的字詞，看看提醒怎麼出現。'],
    ['新增、編輯、刪除最新消息', '發公告就像用 Word：輸入標題與內文，選擇分類（門診公告、醫師門診、就醫須知），發布後自動出現在首頁與最新消息列表。', s5, ['所見即所得的編輯器', '選擇分類，前台自動歸類', '勾選相關療程，公告會顯示在療程頁'], ''],
    ['更新醫師資料', '醫師異動、新增學經歷或更換照片，都在醫師頁面填表完成，前台醫師介紹會同步更新。', s6, ['學經歷可增減與排序', '顯示順序決定前台排列'], '']
  ];
  return { toast, screens };
}

const wpImg = k => `<img src="${IMG(k)}" alt="" loading="lazy">`;
const HANDOVER = ['網域、主機、後台管理員帳號均以診所名義申請與持有，完工時交付完整帳號資料與操作手冊', '提供到院或線上操作教學，並附錄影與圖文手冊', '版型或項目調整需求，於提出後 14 天內處理完成', '維護方式與費用於報價單說明'];

window.addEventListener('hashchange', () => route());
window.addEventListener('DOMContentLoaded', () => { V.shell(); route(); });

function mapSVG() {
  return `<svg class="mapsvg" viewBox="0 0 600 300" role="img" aria-label="地圖示意">
    <rect width="600" height="300" class="m-bg"/>
    <path d="M0 210 L600 170" class="m-main"/><path d="M180 0 L230 300" class="m-main"/>
    <path d="M0 90 L600 60 M0 270 L600 240 M60 0 L90 300 M380 0 L410 300 M520 0 L540 300" class="m-road"/>
    <path d="M440 0 C430 80 470 140 600 150" class="m-river"/>
    <rect x="250" y="80" width="110" height="70" class="m-park"/>
    <g transform="translate(312 186)"><circle r="18" class="m-pin-halo"/><circle r="7" class="m-pin"/></g>
    <text x="330" y="224" class="m-label">霧嶼診所（示意）</text>
    <text x="196" y="40" class="m-label sm" transform="rotate(80 196 40)">澄嶼街</text>
    <g transform="translate(110 188)"><rect x="-9" y="-9" width="18" height="18" rx="4" class="m-mrt"/><text y="4" class="m-mrt-t">M</text></g>
  </svg>`;
}
