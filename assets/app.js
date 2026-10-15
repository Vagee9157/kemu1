(() => {
  'use strict';

  /* ---------- 存储：只存在本机浏览器，读写失败也能正常用 ---------- */
  const KEY = 'km1.v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const S = Object.assign({ mastered: {}, wrong: {}, stats: {}, theme: '', fold: {}, fc: {} }, load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* 无痕模式等情况忽略 */ } };

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // 题目 id 用题干哈希，以后加题、调顺序都不会串号
  const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = (h * 33 ^ s.charCodeAt(i)) >>> 0; return h.toString(36); };
  QUESTIONS.forEach((q) => { q.id = hash(q.q + (q.sign || '')); });
  const QMAP = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
  const CHMAP = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));
  const ptKey = (c, i) => c.id + ':' + i;
  const totalPts = CHAPTERS.reduce((n, c) => n + c.points.length, 0);
  // 章节头的小插图：从标志库里挑三个代表
  const CH_ART = { exam: ['p_check', 'w_slow', 'i_parking'], points: ['p_speed', 'p_nohorn', 'p_noparking'], vehicle: ['i_motor', 'p_notruck', 'g_charge'], road: ['p_yield', 'i_sr', 'i_crossing'], highway: ['g_exit', 'i_minspeed', 'p_nostraight'], signal: ['w_signal', 'p_stop', 'i_round'], accident: ['w_accident', 'm_accident', 'd_hazard'], safe: ['w_slip', 'd_abs', 'd_tpms'] };
  const chArt = (id) => `<div class="ch-art">${(CH_ART[id] || []).map((k) => SIGNS[k] || '').join('')}</div>`;
  // 收起状态的缩略图：取正文里第一张图（图解 / 标志 / 手势）
  function thumbOf(body) {
    const m = body.match(/data-(illus|sign|gest)(?:="([^"]*)")?/);
    if (!m) return '';
    if (m[1] === 'illus') { const [name, arg] = m[2].split(':'); const f = window.ILLUS && ILLUS[name]; return f ? `<div class="pt-thumb il-thumb">${f(arg)}</div>` : ''; }
    if (m[1] === 'gest') return `<div class="pt-thumb">${SIGNS.h_stop || ''}</div>`;
    const keys = [...body.matchAll(/data-sign="([^"]+)"/g)].map((x) => x[1]).slice(0, 2);
    return `<div class="pt-thumb signs">${keys.map((k) => SIGNS[k] || '').join('')}</div>`;
  }
  // 必考默认展开；用户手动收起/展开过的按用户的来
  const isOpen = (k, p) => (k in S.fold ? !S.fold[k] : p.hot === 2);
  // 把正文里的图解占位换成真图
  function fillIllus(root) {
    root.querySelectorAll('.illus[data-illus]').forEach((el) => { const [name, arg] = el.dataset.illus.split(':'); const f = window.ILLUS && ILLUS[name]; if (f) el.outerHTML = f(arg); });
    root.querySelectorAll('.illus[data-sign]').forEach((el) => { el.outerHTML = SIGNS[el.dataset.sign] || ''; });
    root.querySelectorAll('[data-gest]').forEach((el) => {
      el.innerHTML = (window.PICS ? PICS.GESTURE_CATALOG : []).map((g) => `<figure>${SIGNS[g.key] || g.svg}<figcaption><b>${esc(g.name)}</b><span>${esc(g.desc)}</span></figcaption></figure>`).join('');
    });
  }

  /* ---------- 主题 ---------- */
  const isDark = () => (S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  const applyTheme = () => {
    if (S.theme) document.documentElement.dataset.theme = S.theme; else delete document.documentElement.dataset.theme;
    const u = $('#themeBtn use'); if (u) u.setAttribute('href', isDark() ? '#i-sun' : '#i-moon');
  };
  applyTheme();
  $('#themeBtn').onclick = () => {
    S.theme = isDark() ? 'light' : 'dark'; applyTheme(); save();
  };

  /* ---------- 顶栏统计 ---------- */
  function refreshStat() {
    const m = Object.keys(S.mastered).length;
    let r = 0, t = 0;
    Object.values(S.stats).forEach((s) => { r += s.r || 0; t += (s.r || 0) + (s.w || 0); });
    const acc = t ? Math.round(r / t * 100) + '%' : '—';
    const C = 2 * Math.PI * 31, pct = m / totalPts;
    $('#ring').innerHTML = `<svg viewBox="0 0 72 72" aria-hidden="true"><circle class="bg" cx="36" cy="36" r="31"/><circle class="fg" cx="36" cy="36" r="31" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>
      <dl><dt>已掌握</dt><dd>${m} / ${totalPts}</dd><dt>做题</dt><dd>${t}</dd><dt>正确率</dt><dd>${acc}</dd></dl>`;
    const w = Object.keys(S.wrong).length;
    $('#wrongBadge').textContent = w ? ` ${w}` : '';
  }

  /* ---------- 导航 ---------- */
  const VIEWS = ['outline', 'numbers', 'quiz', 'wrong'];
  function show(v) {
    VIEWS.forEach((x) => { $('#view-' + x).hidden = x !== v; });
    document.querySelectorAll('nav.tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.view === v));
    if (v === 'wrong') renderWrong();
    if (v === 'quiz' && !quiz) renderQuizHome();
    if (location.hash.slice(1) !== v) history.replaceState(null, '', '#' + v);
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('nav.tabs button').forEach((b) => { b.onclick = () => show(b.dataset.view); });

  /* ---------- 考点大纲 ---------- */
  const filt = { q: '', hot: false, hideM: false };
  let curCh = CHMAP[S.ch] ? S.ch : CHAPTERS[0].id;
  function setChapter(id, scroll = true) {
    curCh = id; S.ch = id; save();
    document.querySelectorAll('#toc a, #tocM a').forEach((a) => a.classList.toggle('on', a.dataset.ch === id));
    const pill = document.querySelector(`#tocM a[data-ch="${id}"]`); if (pill) pill.scrollIntoView({ block: 'nearest', inline: 'center' });
    applyFilter();
    if (scroll) { const top = $('#view-outline .toolbar').getBoundingClientRect().top + window.scrollY - 70; window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' }); }
  }
  function renderOutline() {
    $('#toc').innerHTML = CHAPTERS.map((c, i) => `<a href="#ch-${c.id}" data-ch="${c.id}"><span class="n">${String(i + 1).padStart(2, '0')}</span>${esc(c.name)}</a>`).join('');
    $('#tocM').innerHTML = `<button class="toc-toggle" id="tocToggle" aria-expanded="false"><svg class="i"><use href="#i-menu"/></svg>目录</button>` +
      CHAPTERS.map((c, i) => `<a href="#ch-${c.id}" data-ch="${c.id}">${String(i + 1).padStart(2, '0')} ${esc(c.name)}</a>`).join('');
    renderTocTree();
    $('#outline-box').innerHTML = CHAPTERS.map((c, ci) => {
      const qn = QUESTIONS.filter((q) => q.ch === c.id).length;
      const pts = c.points.map((p, i) => {
        const k = ptKey(c, i), m = !!S.mastered[k];
        const tag = p.hot === 2 ? '<span class="tag h2">必考</span>' : p.hot === 1 ? '<span class="tag h1">常考</span>' : '';
        return `<details class="pt" data-k="${k}" data-hot="${p.hot}" ${isOpen(k, p) ? 'open' : ''}>
          <summary>
            <div class="pt-title">${esc(p.t)} ${tag}${m ? '<span class="tag ok"><svg class="i"><use href="#i-check"/></svg>已掌握</span>' : ''}</div>
            ${thumbOf(p.body)}
            <span class="caret"><svg class="i"><use href="#i-chev-r"/></svg></span>
            ${p.tip ? `<div class="pt-tip"><i>记</i><span>${esc(p.tip)}</span></div>` : ''}
          </summary>
          <div class="pt-body"><div class="tbl-scroll">${p.body}</div>
            <div class="pt-foot">
              <label class="master"><input type="checkbox" data-master="${k}" ${m ? 'checked' : ''}> 这条我记住了</label>
            </div>
          </div>
        </details>`;
      }).join('');
      return `<section class="ch" id="ch-${c.id}" data-ch="${c.id}">
        <div class="ch-head"><span class="num">${String(ci + 1).padStart(2, '0')}</span>
          <h3>${esc(c.name)}${chArt(c.id)}</h3>
          <div class="go"><button class="btn ghost" data-fold-all="${c.id}">全部展开</button><button class="btn" data-practice="${c.id}"><svg class="i"><use href="#i-pencil"/></svg>练这章 ${qn} 题</button></div>
          <p>${esc(c.intro)}</p>
        </div>${pts}
        <div class="ch-nav">
          ${ci > 0 ? `<button class="btn" data-ch-go="${CHAPTERS[ci - 1].id}"><svg class="i"><use href="#i-chev-l"/></svg>${esc(CHAPTERS[ci - 1].name)}</button>` : '<span></span>'}
          ${ci < CHAPTERS.length - 1 ? `<button class="btn primary" data-ch-go="${CHAPTERS[ci + 1].id}">${esc(CHAPTERS[ci + 1].name)}<svg class="i"><use href="#i-chev-r"/></svg></button>` : `<button class="btn primary" data-practice="${c.id}">全部看完了，去刷题</button>`}
        </div></section>`;
    }).join('');
    fillIllus($('#outline-box'));
    setChapter(curCh, false);
  }
  // 手机端两级目录树：章节 → 考点标题
  function renderTocTree() {
    $('#tocTree').innerHTML = CHAPTERS.map((c, i) => {
      const done = c.points.filter((p, j) => S.mastered[ptKey(c, j)]).length;
      return `<details class="tt-ch" ${i === 0 ? 'open' : ''}>
        <summary><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(c.name)}</span><span class="m">${done}/${c.points.length}</span><svg class="i"><use href="#i-chev-d"/></svg></summary>
        <div class="tt-pts">${c.points.map((p, j) => `<a href="#" data-pt="${ptKey(c, j)}" class="${S.mastered[ptKey(c, j)] ? 'done' : ''}"><i class="dot ${p.hot === 2 ? 'on' : ''}"></i>${esc(p.t)}</a>`).join('')}</div>
      </details>`;
    }).join('');
  }
  function applyFilter() {
    const q = filt.q.trim().toLowerCase();
    document.querySelectorAll('#outline-box section.ch').forEach((sec) => {
      let any = false;
      sec.querySelectorAll('details.pt').forEach((d) => {
        const okHot = !filt.hot || d.dataset.hot === '2';
        const okM = !filt.hideM || !S.mastered[d.dataset.k];
        const okQ = !q || d.textContent.toLowerCase().includes(q);
        const vis = okHot && okM && okQ;
        d.hidden = !vis; if (vis) any = true;
        if (q && vis) d.open = true;
      });
      sec.hidden = q ? !any : sec.dataset.ch !== curCh;
    });
    $('#searchHint').hidden = !q;
    CHAPTERS.forEach((c) => syncFoldBtn(c.id));
  }
  $('#search').addEventListener('input', (e) => { filt.q = e.target.value; applyFilter(); });
  $('#onlyHot').onclick = (e) => { filt.hot = !filt.hot; e.currentTarget.setAttribute('aria-pressed', filt.hot); applyFilter(); };
  $('#hideMastered').onclick = (e) => { filt.hideM = !filt.hideM; e.currentTarget.setAttribute('aria-pressed', filt.hideM); applyFilter(); };
  $('#outline-box').addEventListener('change', (e) => {
    const k = e.target.dataset.master; if (!k) return;
    if (e.target.checked) S.mastered[k] = 1; else delete S.mastered[k];
    save(); refreshStat();
    const title = e.target.closest('details').querySelector('.pt-title');
    const t = title.querySelector('.tag.ok');
    if (e.target.checked && !t) title.insertAdjacentHTML('beforeend', '<span class="tag ok"><svg class="i"><use href="#i-check"/></svg>已掌握</span>');
    if (!e.target.checked && t) t.remove();
  });
  $('#outline-box').addEventListener('click', (e) => {
    const b = e.target.closest('[data-practice]'); if (b) return startQuiz('ch', b.dataset.practice);
    const g = e.target.closest('[data-ch-go]'); if (g) return setChapter(g.dataset.chGo);
    const f = e.target.closest('[data-fold-all]');
    if (f) {
      const ds = [...document.querySelectorAll(`#ch-${f.dataset.foldAll} details.pt:not([hidden])`)];
      const open = ds.some((d) => !d.open);
      ds.forEach((d) => { d.open = open; S.fold[d.dataset.k] = open ? 0 : 1; });
      save(); syncFoldBtn(f.dataset.foldAll); return;
    }
    // 用户点标题展开/收起：记下来，下次按这个状态显示
    const sm = e.target.closest('details.pt > summary');
    if (sm) { const d = sm.parentElement; setTimeout(() => { S.fold[d.dataset.k] = d.open ? 0 : 1; save(); syncFoldBtn(d.closest('section.ch').dataset.ch); }, 0); }
  });
  function syncFoldBtn(ch) {
    const b = document.querySelector(`[data-fold-all="${ch}"]`); if (!b) return;
    const ds = [...document.querySelectorAll(`#ch-${ch} details.pt:not([hidden])`)];
    b.textContent = ds.length && ds.every((d) => d.open) ? '全部收起' : '全部展开';
  }
  ['#toc', '#tocM'].forEach((sel) => $(sel).addEventListener('click', (e) => {
    const a = e.target.closest('a[data-ch]'); if (!a) return;
    e.preventDefault(); if (filt.q) { filt.q = ''; $('#search').value = ''; } setChapter(a.dataset.ch);
  }));
  $('#tocM').addEventListener('click', (e) => {
    const b = e.target.closest('#tocToggle'); if (!b) return;
    const open = $('#tocTree').hidden; $('#tocTree').hidden = !open; b.setAttribute('aria-expanded', open);
    if (open) renderTocTree();
  });
  $('#tocTree').addEventListener('click', (e) => {
    const a = e.target.closest('a[data-pt]'); if (!a) return;
    e.preventDefault();
    const d = document.querySelector(`details.pt[data-k="${a.dataset.pt}"]`); if (!d) return;
    // 被筛选藏起来的先放出来
    filt.q = ''; $('#search').value = ''; filt.hot = false; $('#onlyHot').setAttribute('aria-pressed', 'false'); filt.hideM = false; $('#hideMastered').setAttribute('aria-pressed', 'false');
    setChapter(a.dataset.pt.split(':')[0], false);
    d.open = true; $('#tocTree').hidden = true; $('#tocToggle').setAttribute('aria-expanded', 'false');
    setTimeout(() => d.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  });

  /* ---------- 数字速记 ---------- */
  // 每条速记一个 id（问题文字哈希），翻卡"没记住"的存进 S.fc，速记页标星、可单独筛出来
  const CARDS = [];
  NUMBERS.forEach((g) => g.rows.forEach(([f, b]) => CARDS.push({ id: 'n' + hash(g.g + f), f: `${g.g} · ${f}`, b })));
  CONFUSE.forEach(([k, a, b, pics]) => CARDS.push({ id: 'c' + hash(k), f: `易混：${k}`, b: `${a}  ｜  ${b}`, pics }));
  const missN = () => CARDS.filter((c) => S.fc[c.id]).length;
  // 看图记数字：复用考点图解，每张配一句口诀
  const VISUAL = [
    { t: '记分五档：12 · 9 · 6 · 3 · 1', il: 'points_ladder', tip: '酒驾、逃逸、假牌、高速逆行倒车掉头 12；高速违法停车 9；超速 20–50%（高速）6；开车打手持电话 3；高速、快速路上不系安全带 1。' },
    { t: '不得再申领：1 · 2 · 3 · 5 · 10 · 终生', il: 'ban_years', tip: '骗、作弊 1 年，吊销 2 年，骗证吸毒 3 年，醉驾 5 年，醉驾营运 10 年，逃逸犯罪终生。' },
    { t: '高速低能见度三档', il: 'visibility', tip: '200 米：60 / 100；100 米：40 / 50；50 米：20 走出口。' },
    { t: '没有限速标志时的最高车速', il: 'speed_road', tip: '没中线：城 30 路 40；单车道：城 50 路 70。' },
    { t: '高速各车道最低车速', il: 'highway_lanes', tip: '两车道左 100；三车道左 110、中 90；右侧不低于 60。' },
  ].filter((v) => window.ILLUS && ILLUS[v.il]);
  const fcMark = (id) => (S.fc[id] ? '<span class="miss" title="翻卡时没记住">★</span>' : '');
  const picOf = (k) => (k && SIGNS[k] ? `<span class="cmp-pic">${SIGNS[k]}</span>` : '');
  function renderNumbers() {
    const vis = `<div class="num-sec vis-sec"><h3 class="sec-h">看图记数字</h3><div class="vis-grid">${VISUAL.map((v) => `<div class="vis-card"><h4>${esc(v.t)}</h4>${ILLUS[v.il]()}<p class="tipline"><i>记</i><span>${esc(v.tip)}</span></p></div>`).join('')}</div></div>`;
    const cmp = `<div class="num-sec"><h3 class="sec-h">易混对比 <small>最容易张冠李戴</small></h3><div class="cmp-grid">${CONFUSE.map(([k, a, b, pics]) => {
      const id = 'c' + hash(k);
      return `<div class="cmp-card" data-fc="${id}"><h4>${esc(k)}${fcMark(id)}</h4><div class="cmp-ab">
        <div class="side a">${picOf(pics && pics[0])}<span class="ans">${esc(a)}</span></div>
        <span class="vs">VS</span>
        <div class="side b">${picOf(pics && pics[1])}<span class="ans">${esc(b)}</span></div></div></div>`;
    }).join('')}</div></div>`;
    const groups = `<div class="num-sec"><h3 class="sec-h">分组背数字</h3><div class="num-grid">${NUMBERS.map((g) => `<div class="num-group"><h3>${esc(g.g)}</h3>
      ${g.tip ? `<p class="tipline"><i>记</i><span>${esc(g.tip)}</span></p>` : ''}
      <ul class="num-list">${g.rows.map(([k, v]) => { const id = 'n' + hash(g.g + k); return `<li data-fc="${id}"><span class="k">${esc(k)}${fcMark(id)}</span><b class="ans">${esc(v)}</b></li>`; }).join('')}</ul></div>`).join('')}</div></div>`;
    $('#numbers-box').innerHTML = vis + cmp + groups;
    const n = missN(), mb = $('#onlyMiss');
    mb.hidden = !n && mb.getAttribute('aria-pressed') !== 'true';
    mb.textContent = `只看没记住 ${n}`;
    applyMiss();
  }
  function applyMiss() {
    const on = $('#onlyMiss').getAttribute('aria-pressed') === 'true';
    $('#numbers-box').classList.toggle('only-miss', on);
    document.querySelectorAll('#numbers-box [data-fc]').forEach((el) => { el.hidden = on && !S.fc[el.dataset.fc]; });
    document.querySelectorAll('#numbers-box .num-group, #numbers-box .num-sec').forEach((g) => { g.hidden = on && !g.querySelector('[data-fc]:not([hidden])'); });
  }
  $('#onlyMiss').onclick = (e) => { e.currentTarget.setAttribute('aria-pressed', e.currentTarget.getAttribute('aria-pressed') !== 'true'); applyMiss(); };
  // ---- 翻卡：没记住的先出，"只看没记住"打开时只练这些 ----
  let deck = null;
  function buildDeck() {
    const only = $('#onlyMiss').getAttribute('aria-pressed') === 'true';
    const miss = shuffle(CARDS.filter((c) => S.fc[c.id]));
    return only && miss.length ? miss : miss.concat(shuffle(CARDS.filter((c) => !S.fc[c.id])));
  }
  function renderCard() {
    const box = $('#flash');
    if (!deck.cards.length) { box.innerHTML = `<div class="result"><div class="score pass">全会了</div><p>这一轮 ${deck.total} 张都过了。</p><div class="acts"><button class="btn primary" id="flashAgain">再来一轮</button><button class="btn" id="flashQuit">退出翻卡</button></div></div>`; $('#flashAgain').onclick = startFlash; $('#flashQuit').onclick = stopFlash; return; }
    const c = deck.cards[0];
    const back = c.pics ? `<div class="f-pics">${c.b.split('  ｜  ').map((t, i) => `<figure>${picOf(c.pics[i])}<figcaption>${esc(t)}</figcaption></figure>`).join('')}</div>` : `<div>${esc(c.b)}</div>`;
    box.innerHTML = `<div class="flash-head"><button class="btn ghost" id="flashQuit"><svg class="i"><use href="#i-chev-l"/></svg>退出</button><span class="grow">翻卡</span><span class="cnt">剩 ${deck.cards.length} / ${deck.total}</span></div>
      <div class="fcard" id="fcard" tabindex="0"><div class="f-inner"><div class="f-face f-front"><small>问${S.fc[c.id] ? ' · 上次没记住' : ''}</small><div>${esc(c.f)}</div><em>点一下翻面</em></div><div class="f-face f-back"><small>答</small>${back}</div></div></div>
      <div class="quiz-nav"><button class="btn" data-flash="no"><svg class="i"><use href="#i-x"/></svg>没记住</button><button class="btn primary" data-flash="ok"><svg class="i"><use href="#i-check"/></svg>记住了</button></div>`;
    $('#fcard').onclick = () => $('#fcard').classList.toggle('flipped');
    $('#flashQuit').onclick = stopFlash;
    box.querySelectorAll('[data-flash]').forEach((b) => { b.onclick = () => {
      const c = deck.cards.shift();
      if (b.dataset.flash === 'no') { S.fc[c.id] = 1; deck.cards.push(c); } else delete S.fc[c.id];
      save(); renderCard();
    }; });
  }
  function startFlash() { deck = { cards: buildDeck() }; deck.total = deck.cards.length; $('#numbers-box').hidden = true; $('#numTools').hidden = true; $('#flash').hidden = false; renderCard(); window.scrollTo(0, 0); }
  function stopFlash() { deck = null; $('#flash').hidden = true; $('#numbers-box').hidden = false; $('#numTools').hidden = false; renderNumbers(); }
  $('#flashBtn').onclick = startFlash;
  document.addEventListener('keydown', (e) => { if (deck && !$('#flash').hidden && e.key === ' ') { e.preventDefault(); $('#fcard')?.classList.toggle('flipped'); } });

  $('#hideAns').onclick = (e) => {
    const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', on);
    $('#numbers-box').classList.toggle('hide-ans', on);
    document.querySelectorAll('#numbers-box .shown').forEach((x) => x.classList.remove('shown'));
  };
  $('#numbers-box').addEventListener('click', (e) => {
    const t = e.target.closest('.ans'); if (t && $('#numbers-box').classList.contains('hide-ans')) t.classList.toggle('shown');
  });

  /* ---------- 刷题 ---------- */
  let quiz = null; // { list, i, ans: {id: pickedIndex}, mode, title, instant }

  function chAcc(chId) {
    let r = 0, t = 0, done = 0, all = 0;
    QUESTIONS.filter((q) => q.ch === chId).forEach((q) => { all++; const s = S.stats[q.id]; if (s) { done++; r += s.r || 0; t += (s.r || 0) + (s.w || 0); } });
    const acc = t ? Math.round(r / t * 100) : null;
    return { acc, done, pass: done === all && acc !== null && acc >= 90 };
  }
  function renderQuizHome() {
    quiz = null;
    const hotN = QUESTIONS.filter((q) => q.hot).length;
    const done = QUESTIONS.filter((q) => S.stats[q.id]).length;
    $('#quiz-box').innerHTML = `
      <h2 class="vh">经典真题</h2>
      <p class="lead">共 ${QUESTIONS.length} 题，覆盖每个必考点。已做过 ${done} 题。练习模式答完立刻出解析；模拟考试交卷再看分数。</p>
      <div class="mode-grid">
        <button class="mode featured" data-mode="hot"><b><svg class="i"><use href="#i-flame"/></svg>高频必刷</b><span>${hotN} 道最常考的题，随机顺序</span></button>
        <button class="mode" data-mode="exam"><b><svg class="i"><use href="#i-timer"/></svg>模拟考试</b><span>按真考：100 题（判断 30 + 单选 70）· 45 分钟 · 90 分及格</span></button>
        <button class="mode" data-mode="sprint"><b><svg class="i"><use href="#i-flame"/></svg>考前冲刺</b><span>${sprintList().length ? `错题 + 还没拿稳的高频题，共 ${sprintList().length} 道` : '先刷几道题，这里会自动凑出你的薄弱题'}</span></button>
        <button class="mode" data-mode="all"><b><svg class="i"><use href="#i-list"/></svg>全部顺序练</b><span>按章节从头到尾 ${QUESTIONS.length} 题</span></button>
        <button class="mode" data-mode="new"><b><svg class="i"><use href="#i-sparkles"/></svg>只做没做过的</b><span>还剩 ${QUESTIONS.length - done} 题</span></button>
      </div>
      <h3 class="sub-h">按章节练</h3>
      <div class="mode-grid">
        ${(() => {
          // 正确率低于 90 的标"薄弱"，最低的一章标"最弱"
          const accs = CHAPTERS.map((c) => chAcc(c.id).acc).filter((a) => a !== null && a < 90);
          const worst = accs.length ? Math.min(...accs) : null;
          return CHAPTERS.map((c) => {
            const n = QUESTIONS.filter((q) => q.ch === c.id).length; const { acc, pass, done } = chAcc(c.id);
            const weak = acc !== null && acc < 90;
            const tag = pass ? '<span class="tag ok"><svg class="i"><use href="#i-check"/></svg>通关</span>' : weak ? `<span class="tag h2">${acc === worst ? '最弱' : '薄弱'}</span>` : '';
            return `<button class="mode ${pass ? 'passed' : ''} ${weak ? 'weak' : ''}" data-mode="ch" data-ch="${c.id}"><b>${esc(c.name)}${tag}</b>
              <span>做过 ${done} / ${n} · ${acc === null ? '还没练' : '正确率 ' + acc + '%'}</span>
              <div class="bar"><i style="width:${acc || 0}%"></i></div></button>`;
          }).join('');
        })()}
      </div>`;
  }
  $('#quiz-box').addEventListener('click', (e) => {
    const m = e.target.closest('[data-mode]'); if (m) return startQuiz(m.dataset.mode, m.dataset.ch);
    const o = e.target.closest('[data-opt]'); if (o) return pick(+o.dataset.opt);
    const n = e.target.closest('[data-nav]'); if (n) return nav(n.dataset.nav);
    const g = e.target.closest('[data-goto]'); if (g) { show('outline'); setChapter(g.dataset.goto); }
  });

  // 模拟考试组卷：按各章分值配额抽 100 题，判断 30 / 单选 70，判断题在前（同真考）
  const EXAM_QUOTA = { exam: 9, points: 14, vehicle: 5, road: 28, highway: 7, signal: 22, accident: 5, safe: 10 };
  const EXAM_MIN = 45;
  function examPaper() {
    const J = [], Sg = [];
    CHAPTERS.forEach((c) => {
      const n = EXAM_QUOTA[c.id] || 0;
      const js = shuffle(QUESTIONS.filter((q) => q.ch === c.id && q.type === 'judge'));
      const ss = shuffle(QUESTIONS.filter((q) => q.ch === c.id && q.type === 'single'));
      let nj = Math.min(js.length, Math.round(n * 0.3)), ns = Math.min(ss.length, n - nj);
      nj = Math.min(js.length, n - ns);
      J.push(...js.slice(0, nj)); Sg.push(...ss.slice(0, ns));
    });
    // 凑不满的从剩下的题里补，再把判断 / 单选调到 30 / 70
    const used = new Set([...J, ...Sg]);
    const rest = shuffle(QUESTIONS.filter((q) => !used.has(q)));
    while (J.length + Sg.length < 100 && rest.length) { const q = rest.pop(); (q.type === 'judge' ? J : Sg).push(q); }
    const restJ = rest.filter((q) => q.type === 'judge'), restS = rest.filter((q) => q.type === 'single');
    while (J.length > 30 && restS.length) { J.splice(Math.random() * J.length | 0, 1); Sg.push(restS.pop()); }
    while (J.length < 30 && restJ.length && Sg.length) { Sg.splice(Math.random() * Sg.length | 0, 1); J.push(restJ.pop()); }
    return shuffle(J).concat(shuffle(Sg));
  }
  // 考前冲刺：错题本 + 高频题里还没拿稳的（没做过 / 错的次数不少于对的）+ 翻卡没记住的数字所在章节的高频题
  const FC_CH = { 驾驶证: 'exam', 不得再申领: 'exam', 记分与酒驾: 'points', 速度: 'road', 距离: 'road', 高速低能见度: 'highway', 时间: 'safe' };
  function sprintList() {
    const wrong = Object.keys(S.wrong).map((id) => QMAP[id]).filter(Boolean);
    const shaky = QUESTIONS.filter((q) => { if (!q.hot || S.wrong[q.id]) return false; const st = S.stats[q.id]; return st && st.w >= st.r; });
    const fcCh = new Set(CARDS.filter((c) => S.fc[c.id] && c.id[0] === 'n').map((c) => FC_CH[c.f.split(' · ')[0]]).filter(Boolean));
    const seen = new Set([...wrong, ...shaky]);
    const fcQ = QUESTIONS.filter((q) => q.hot && fcCh.has(q.ch) && !seen.has(q) && !(S.stats[q.id] && S.stats[q.id].w === 0 && S.stats[q.id].r >= 2));
    return [...shuffle(wrong), ...shuffle(shaky), ...shuffle(fcQ)].slice(0, 80);
  }
  let timer = null;
  const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
  function tick() {
    const el = $('#qtimer'); if (!quiz || !quiz.deadline) return;
    const left = Math.max(0, quiz.deadline - Date.now());
    if (el) { const m = Math.floor(left / 60000), sec = Math.floor(left % 60000 / 1000); el.textContent = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`; el.classList.toggle('low', left < 5 * 60000); }
    if (!left && !quiz.finished) { stopTimer(); alert('45 分钟到，自动交卷。'); finish(true); }
  }
  function startQuiz(mode, ch) {
    let list, title, instant = true;
    if (mode === 'hot') { list = shuffle(QUESTIONS.filter((q) => q.hot)); title = '高频必刷'; }
    else if (mode === 'exam') { list = examPaper(); title = '模拟考试'; instant = false; }
    else if (mode === 'sprint') { list = sprintList(); title = '考前冲刺'; }
    else if (mode === 'all') { list = CHAPTERS.flatMap((c) => QUESTIONS.filter((q) => q.ch === c.id)); title = '全部顺序练'; }
    else if (mode === 'new') { list = shuffle(QUESTIONS.filter((q) => !S.stats[q.id])); title = '没做过的'; }
    else if (mode === 'ch') { list = QUESTIONS.filter((q) => q.ch === ch); title = CHMAP[ch].name; }
    else if (mode === 'wrong') { list = shuffle(Object.keys(S.wrong).map((id) => QMAP[id]).filter((q) => q && (!ch || q.ch === ch))); title = ch ? `错题重做 · ${CHMAP[ch].name}` : '错题重做'; }
    if (!list || !list.length) { alert(mode === 'new' ? '全部题目都做过了，换个模式吧。' : mode === 'sprint' ? '还没有薄弱题：先刷几道高频题，或者在速记里翻翻卡。' : '这里还没有题。'); return; }
    stopTimer();
    quiz = { list, i: 0, ans: {}, mode, title, instant, finished: false, deadline: mode === 'exam' ? Date.now() + EXAM_MIN * 60000 : 0 }; combo = 0;
    show('quiz'); renderQ();
    if (quiz.deadline) timer = setInterval(tick, 1000);
  }

  const isRight = (q, p) => (q.type === 'judge' ? (p === 0) === q.a : p === q.a);
  const rightIdx = (q) => (q.type === 'judge' ? (q.a ? 0 : 1) : q.a);

  function renderQ() {
    const { list, i, ans, instant } = quiz;
    const q = list[i];
    const picked = ans[q.id];
    const answered = picked !== undefined;
    const reveal = answered && instant;
    const opts = q.type === 'judge' ? ['正确', '错误'] : q.opts;
    const keys = q.type === 'judge' ? ['✓', '✗'] : ['A', 'B', 'C', 'D'];
    const optHtml = opts.map((o, k) => {
      let cls = 'opt';
      if (reveal) { if (k === rightIdx(q)) cls += ' right'; else if (k === picked) cls += ' wrong'; }
      else if (answered && k === picked) cls += ' picked';
      return `<button class="${cls}" data-opt="${k}" ${reveal ? 'disabled' : ''}><span class="k">${keys[k]}</span><span>${esc(o)}</span></button>`;
    }).join('');
    const ok = answered && isRight(q, picked);
    const expHtml = reveal ? `<div class="exp ${ok ? 'ok' : 'no'}"><span class="verdict">${ok ? '<svg class="i"><use href="#i-check"/></svg>答对了' : '<svg class="i"><use href="#i-x"/></svg>答错了'}</span>
        正确答案：<b>${keys[rightIdx(q)]} ${esc(opts[rightIdx(q)])}</b><br>${esc(q.exp)}
        <a href="javascript:void 0" data-goto="${q.ch}">看考点<svg class="i"><use href="#i-chev-r"/></svg></a></div>` : '';
    const doneN = Object.keys(ans).length;
    const last = i === list.length - 1;
    $('#quiz-box').innerHTML = `
      <div class="quiz-head"><button class="btn ghost" data-nav="home"><svg class="i"><use href="#i-chev-l"/></svg>返回</button>
        <span class="grow">${esc(quiz.title)}</span>${quiz.deadline && !quiz.finished ? '<span class="qtimer" id="qtimer"></span>' : ''}<span class="cnt">${i + 1} / ${list.length}</span></div>
      <div class="bar" style="margin:-4px 0 12px"><i style="width:${doneN / list.length * 100}%"></i></div>
      <div class="qcard">
        <div class="qmeta"><span class="qtype">${q.type === 'judge' ? '判断题' : '单选题'}</span><span class="qtype">${esc(CHMAP[q.ch].name)}</span>${q.hot ? '<span class="tag h2">高频</span>' : ''}</div>
        <p class="qtext">${esc(q.q)}</p>
        ${q.sign ? `<div class="qsign">${SIGNS[q.sign]}</div>` : ''}
        <div class="opts ${q.type === 'judge' ? 'judge' : ''}">${optHtml}</div>
        ${expHtml}
      </div>
      <div class="quiz-nav">
        <button class="btn" data-nav="prev" ${i === 0 ? 'disabled' : ''}>上一题</button>
        ${last ? `<button class="btn primary" data-nav="finish">${instant ? '看结果' : '交卷'}</button>`
               : `<button class="btn primary" data-nav="next">下一题</button>`}
      </div>`;
    if (quiz.deadline) tick();
  }

  let combo = 0;
  function record(q, ok) {
    combo = ok ? combo + 1 : 0;
    const s = S.stats[q.id] || (S.stats[q.id] = { r: 0, w: 0 });
    if (ok) { s.r++; if (quiz.mode === 'wrong') delete S.wrong[q.id]; }
    else { s.w++; S.wrong[q.id] = (S.wrong[q.id] || 0) + 1; }
    save(); refreshStat();
  }

  function pick(k) {
    const q = quiz.list[quiz.i];
    if (quiz.instant) {
      if (quiz.ans[q.id] !== undefined) return;
      quiz.ans[q.id] = k; record(q, isRight(q, k)); renderQ();
      if (combo >= 3) { const c = document.createElement('div'); c.className = 'combo'; c.textContent = `连对 ×${combo}`; $('.qcard').appendChild(c); setTimeout(() => c.remove(), 1400); }
    } else {
      quiz.ans[q.id] = k; // 模拟考可以改答案，交卷时统一记录
      if (quiz.i < quiz.list.length - 1) { quiz.i++; } renderQ();
    }
  }

  function nav(d) {
    if (d === 'home') {
      if (quiz && !quiz.instant && !quiz.finished && Object.keys(quiz.ans).length && !confirm('模拟考还没交卷，确定退出吗？')) return;
      stopTimer(); return renderQuizHome();
    }
    if (d === 'prev' && quiz.i > 0) quiz.i--;
    if (d === 'next' && quiz.i < quiz.list.length - 1) quiz.i++;
    if (d === 'finish') return finish();
    renderQ(); window.scrollTo(0, 0);
  }

  function finish(forced) {
    const { list, ans, instant } = quiz;
    const unanswered = list.filter((q) => ans[q.id] === undefined).length;
    if (!forced && !instant && unanswered && !confirm(`还有 ${unanswered} 题没答，确定交卷吗？`)) return;
    stopTimer();
    if (!instant) list.forEach((q) => { if (ans[q.id] !== undefined) record(q, isRight(q, ans[q.id])); else record(q, false); });
    quiz.finished = true;
    const right = list.filter((q) => ans[q.id] !== undefined && isRight(q, ans[q.id])).length;
    const pct = Math.round(right / list.length * 100);
    const pass = pct >= 90;
    const wrongs = list.filter((q) => !(ans[q.id] !== undefined && isRight(q, ans[q.id])));
    $('#quiz-box').innerHTML = `
      <div class="result">
        <div class="score ${pass ? 'pass' : 'fail'}">${pct}<small style="font-size:20px">分</small></div>
        <p>${esc(quiz.title)} · 答对 ${right} / ${list.length}${instant ? '' : '（按百分制折算，90 分及格）'}<br>
        ${quiz.mode === 'exam' ? `用时 ${Math.min(EXAM_MIN, Math.ceil((Date.now() - (quiz.deadline - EXAM_MIN * 60000)) / 60000))} 分钟 · ` : ''}${pass ? '稳了，保持这个状态去考。' : quiz.mode === 'exam' && wrongs.length > 10 ? '真考错满 11 题就判不及格，错题已收进错题本，重做两遍再来。' : '错题已经收进错题本，重做两遍再来。'}</p>
        ${wrongs.length ? `<div class="by-ch">${CHAPTERS.map((c) => { const n = wrongs.filter((q) => q.ch === c.id).length; return n ? `<button class="chip" data-goto="${c.id}">${esc(c.name)} 错 ${n}</button>` : ''; }).join('')}</div>` : ''}
        <div class="acts">
          ${wrongs.length ? '<button class="btn primary" data-mode="wrong">重做错题本</button>' : ''}
          <button class="btn" data-nav="home">返回题库</button>
        </div>
      </div>
      ${!instant && wrongs.length ? `<h3 class="sub-h" style="margin-top:18px">本次错题</h3>${wrongs.map(wrongCard).join('')}` : ''}`;
    window.scrollTo(0, 0);
  }

  /* ---------- 错题本 ---------- */
  function wrongCard(q) {
    const opts = q.type === 'judge' ? ['正确', '错误'] : q.opts;
    const keys = q.type === 'judge' ? ['✓', '✗'] : ['A', 'B', 'C', 'D'];
    const optsLine = q.type === 'single' ? `<div class="e">${opts.map((o, k) => keys[k] + '. ' + esc(o)).join('　')}</div>` : '';
    return `<div class="wrong-item">${q.sign ? SIGNS[q.sign] : ''}
      <div class="q">${esc(q.q)}</div>${optsLine}
      <div class="a">答案：${keys[rightIdx(q)]} ${esc(opts[rightIdx(q)])}</div>
      <div class="e">${esc(q.exp)}</div>
      <div class="w-foot">${S.wrong[q.id] ? `<span class="cnt">错过 ${S.wrong[q.id]} 次</span>` : '<span></span>'}<a href="javascript:void 0" data-goto="${q.ch}">回考点<svg class="i"><use href="#i-chev-r"/></svg></a></div></div>`;
  }
  function renderWrong() {
    const all = Object.keys(S.wrong).map((id) => QMAP[id]).filter(Boolean);
    const groups = CHAPTERS.map((c) => ({ c, list: all.filter((q) => q.ch === c.id).sort((a, b) => S.wrong[b.id] - S.wrong[a.id]) })).filter((g) => g.list.length).sort((a, b) => b.list.length - a.list.length);
    $('#wrong-box').innerHTML = `
      <h2 class="vh">错题本</h2>
      <p class="lead">做错的题自动收进来，按章节分组、错得多的章节排前面。在"重做错题"里答对一次就移出。</p>
      ${all.length ? `<div class="toolbar"><button class="btn primary" data-redo=""><svg class="i"><use href="#i-redo"/></svg>重做全部错题（${all.length}）</button>
        <button class="btn ghost" id="clearWrong"><svg class="i"><use href="#i-trash"/></svg>清空错题本</button></div>
        <div class="by-ch">${groups.map((g) => `<a class="chip" href="#wch-${g.c.id}">${esc(g.c.name)} ${g.list.length}</a>`).join('')}</div>
        ${groups.map((g) => `<section class="w-group" id="wch-${g.c.id}"><div class="w-head"><h3>${esc(g.c.name)} <small>${g.list.length} 题</small></h3>
          <button class="btn" data-redo="${g.c.id}"><svg class="i"><use href="#i-redo"/></svg>重做这章</button><button class="btn ghost" data-goto="${g.c.id}">看考点</button></div>
          ${g.list.map(wrongCard).join('')}</section>`).join('')}`
        : '<div class="empty"><svg class="i"><use href="#i-party"/></svg>还没有错题。去"刷题"做几道吧。</div>'}`;
    const c = $('#clearWrong'); if (c) c.onclick = () => { if (confirm('确定清空错题本吗？做题记录会保留。')) { S.wrong = {}; save(); refreshStat(); renderWrong(); } };
  }
  $('#wrong-box').addEventListener('click', (e) => {
    const r = e.target.closest('[data-redo]'); if (r) return startQuiz('wrong', r.dataset.redo || undefined);
    const g = e.target.closest('[data-goto]'); if (g) { show('outline'); setChapter(g.dataset.goto); return; }
    const a = e.target.closest('a.chip[href^="#wch-"]'); if (a) { e.preventDefault(); document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  /* ---------- 键盘：1-4 / A-D 选，回车或 → 下一题 ---------- */
  document.addEventListener('keydown', (e) => {
    if (!quiz || $('#view-quiz').hidden || e.target.tagName === 'INPUT' || !$('.qcard')) return;
    const k = e.key.toLowerCase();
    const map = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
    if (k in map) { const btn = document.querySelector(`[data-opt="${map[k]}"]`); if (btn && !btn.disabled) pick(map[k]); }
    else if (k === 'enter' || k === 'arrowright') { const b = document.querySelector('[data-nav="next"],[data-nav="finish"]'); if (b) b.click(); }
    else if (k === 'arrowleft') nav('prev');
  });

  /* ---------- 启动 ---------- */
  // 页首文案里的数量跟着题库走
  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setTxt('cntPts', totalPts); setTxt('cntQ', QUESTIONS.length); setTxt('cntPic', Math.floor(QUESTIONS.filter((q) => q.sign).length / 10) * 10);
  renderOutline(); renderNumbers(); refreshStat();
  const start = location.hash.slice(1);
  show(VIEWS.includes(start) ? start : 'outline');
  window.addEventListener('hashchange', () => { const v = location.hash.slice(1); if (VIEWS.includes(v)) show(v); });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
