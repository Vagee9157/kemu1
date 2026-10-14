(() => {
  'use strict';

  /* ---------- 存储：只存在本机浏览器，读写失败也能正常用 ---------- */
  const KEY = 'km1.v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const S = Object.assign({ mastered: {}, wrong: {}, stats: {}, theme: '' }, load());
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
  // 把正文里的图解占位换成真图
  function fillIllus(root) {
    root.querySelectorAll('.illus[data-illus]').forEach((el) => { const f = window.ILLUS && ILLUS[el.dataset.illus]; if (f) el.outerHTML = f(); });
    root.querySelectorAll('.illus[data-sign]').forEach((el) => { el.outerHTML = SIGNS[el.dataset.sign] || ''; });
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
        return `<details class="pt" data-k="${k}" data-hot="${p.hot}">
          <summary>
            <div class="pt-title">${esc(p.t)} ${tag}${m ? '<span class="tag ok"><svg class="i"><use href="#i-check"/></svg>已掌握</span>' : ''}</div>
            <span class="caret"><svg class="i"><use href="#i-chev-r"/></svg></span>
            ${p.tip ? `<div class="pt-tip">${esc(p.tip)}</div>` : ''}
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
          <button class="btn go" data-practice="${c.id}"><svg class="i"><use href="#i-pencil"/></svg>练这章 ${qn} 题</button>
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
    const g = e.target.closest('[data-ch-go]'); if (g) setChapter(g.dataset.chGo);
  });
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
  function renderNumbers() {
    const groups = NUMBERS.map((g) => `<div class="num-group"><h3>${esc(g.g)}</h3>
      <table class="num-table">${g.rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table></div>`).join('');
    const cmp = `<div class="num-group"><h3>易混对比（最容易张冠李戴）</h3><div class="tbl-scroll">
      <table class="cmp-table"><tr><th>考点</th><th>A</th><th>B</th></tr>
      ${CONFUSE.map(([k, a, b]) => `<tr><td>${esc(k)}</td><td class="ans">${esc(a)}</td><td class="ans">${esc(b)}</td></tr>`).join('')}
      </table></div></div>`;
    $('#numbers-box').innerHTML = `<div class="num-grid">${cmp.replace('class="num-group"', 'class="num-group span2"')}${groups}</div>`;
  }
  // ---- 翻卡 ----
  let deck = null; // { cards:[{f,b}], i, left }
  function buildDeck() {
    const cards = [];
    NUMBERS.forEach((g) => g.rows.forEach(([f, b]) => cards.push({ f: `${g.g} · ${f}`, b })));
    CONFUSE.forEach(([k, a, b]) => cards.push({ f: k, b: `${a}  ｜  ${b}` }));
    return shuffle(cards);
  }
  function renderCard() {
    const box = $('#flash');
    if (!deck.cards.length) { box.innerHTML = `<div class="result"><div class="score pass">全会了</div><p>这一轮 ${deck.total} 张都过了。</p><div class="acts"><button class="btn primary" id="flashAgain">再来一轮</button><button class="btn" id="flashQuit">退出翻卡</button></div></div>`; $('#flashAgain').onclick = startFlash; $('#flashQuit').onclick = stopFlash; return; }
    const c = deck.cards[0];
    box.innerHTML = `<div class="flash-head"><button class="btn ghost" id="flashQuit"><svg class="i"><use href="#i-chev-l"/></svg>退出</button><span class="grow">翻卡</span><span class="cnt">剩 ${deck.cards.length} / ${deck.total}</span></div>
      <div class="fcard" id="fcard" tabindex="0"><div class="f-inner"><div class="f-face f-front"><small>问</small><div>${esc(c.f)}</div><em>点一下翻面</em></div><div class="f-face f-back"><small>答</small><div>${esc(c.b)}</div></div></div></div>
      <div class="quiz-nav"><button class="btn" data-flash="no"><svg class="i"><use href="#i-x"/></svg>没记住</button><button class="btn primary" data-flash="ok"><svg class="i"><use href="#i-check"/></svg>记住了</button></div>`;
    $('#fcard').onclick = () => $('#fcard').classList.toggle('flipped');
    $('#flashQuit').onclick = stopFlash;
    box.querySelectorAll('[data-flash]').forEach((b) => { b.onclick = () => { const c = deck.cards.shift(); if (b.dataset.flash === 'no') deck.cards.push(c); renderCard(); }; });
  }
  function startFlash() { deck = { cards: buildDeck() }; deck.total = deck.cards.length; $('#numbers-box').hidden = true; $('#numTools').hidden = true; $('#flash').hidden = false; renderCard(); }
  function stopFlash() { deck = null; $('#flash').hidden = true; $('#numbers-box').hidden = false; $('#numTools').hidden = false; }
  $('#flashBtn').onclick = startFlash;
  document.addEventListener('keydown', (e) => { if (deck && !$('#flash').hidden && e.key === ' ') { e.preventDefault(); $('#fcard')?.classList.toggle('flipped'); } });

  $('#hideAns').onclick = (e) => {
    const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', on);
    $('#numbers-box').classList.toggle('hide-ans', on);
    document.querySelectorAll('#numbers-box .shown').forEach((x) => x.classList.remove('shown'));
  };
  $('#numbers-box').addEventListener('click', (e) => {
    const td = e.target.closest('td'); if (td && $('#numbers-box').classList.contains('hide-ans')) td.classList.toggle('shown');
  });

  /* ---------- 刷题 ---------- */
  let quiz = null; // { list, i, ans: {id: pickedIndex}, mode, title, instant }

  function chAcc(chId) {
    let r = 0, t = 0, done = 0, all = 0;
    QUESTIONS.filter((q) => q.ch === chId).forEach((q) => { all++; const s = S.stats[q.id]; if (s) { done++; r += s.r || 0; t += (s.r || 0) + (s.w || 0); } });
    const acc = t ? Math.round(r / t * 100) : null;
    return { acc, pass: done === all && acc !== null && acc >= 90 };
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
        <button class="mode" data-mode="exam"><b><svg class="i"><use href="#i-timer"/></svg>模拟考试</b><span>随机抽 50 题，交卷后出分，90 分算过</span></button>
        <button class="mode" data-mode="all"><b><svg class="i"><use href="#i-list"/></svg>全部顺序练</b><span>按章节从头到尾 ${QUESTIONS.length} 题</span></button>
        <button class="mode" data-mode="new"><b><svg class="i"><use href="#i-sparkles"/></svg>只做没做过的</b><span>还剩 ${QUESTIONS.length - done} 题</span></button>
      </div>
      <h3 class="sub-h">按章节练</h3>
      <div class="mode-grid">
        ${CHAPTERS.map((c) => {
          const n = QUESTIONS.filter((q) => q.ch === c.id).length; const { acc, pass } = chAcc(c.id);
          return `<button class="mode ${pass ? 'passed' : ''}" data-mode="ch" data-ch="${c.id}"><b>${esc(c.name)}${pass ? '<span class="tag ok"><svg class="i"><use href="#i-check"/></svg>通关</span>' : ''}</b>
            <span>${n} 题 · ${acc === null ? '还没练' : '正确率 ' + acc + '%'}</span>
            <div class="bar"><i style="width:${acc || 0}%"></i></div></button>`;
        }).join('')}
      </div>`;
  }
  $('#quiz-box').addEventListener('click', (e) => {
    const m = e.target.closest('[data-mode]'); if (m) return startQuiz(m.dataset.mode, m.dataset.ch);
    const o = e.target.closest('[data-opt]'); if (o) return pick(+o.dataset.opt);
    const n = e.target.closest('[data-nav]'); if (n) return nav(n.dataset.nav);
    const g = e.target.closest('[data-goto]'); if (g) { show('outline'); setChapter(g.dataset.goto); }
  });

  function startQuiz(mode, ch) {
    let list, title, instant = true;
    if (mode === 'hot') { list = shuffle(QUESTIONS.filter((q) => q.hot)); title = '高频必刷'; }
    else if (mode === 'exam') { list = shuffle(QUESTIONS).slice(0, 50); title = '模拟考试'; instant = false; }
    else if (mode === 'all') { list = CHAPTERS.flatMap((c) => QUESTIONS.filter((q) => q.ch === c.id)); title = '全部顺序练'; }
    else if (mode === 'new') { list = shuffle(QUESTIONS.filter((q) => !S.stats[q.id])); title = '没做过的'; }
    else if (mode === 'ch') { list = QUESTIONS.filter((q) => q.ch === ch); title = CHMAP[ch].name; }
    else if (mode === 'wrong') { list = shuffle(Object.keys(S.wrong).map((id) => QMAP[id]).filter(Boolean)); title = '错题重做'; }
    if (!list || !list.length) { alert(mode === 'new' ? '全部题目都做过了，换个模式吧。' : '这里还没有题。'); return; }
    quiz = { list, i: 0, ans: {}, mode, title, instant, finished: false }; combo = 0;
    show('quiz'); renderQ();
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
        <span class="grow">${esc(quiz.title)}</span><span class="cnt">${i + 1} / ${list.length}</span></div>
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
      return renderQuizHome();
    }
    if (d === 'prev' && quiz.i > 0) quiz.i--;
    if (d === 'next' && quiz.i < quiz.list.length - 1) quiz.i++;
    if (d === 'finish') return finish();
    renderQ(); window.scrollTo(0, 0);
  }

  function finish() {
    const { list, ans, instant } = quiz;
    const unanswered = list.filter((q) => ans[q.id] === undefined).length;
    if (!instant && unanswered && !confirm(`还有 ${unanswered} 题没答，确定交卷吗？`)) return;
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
        ${pass ? '稳了，保持这个状态去考。' : '错题已经收进错题本，重做两遍再来。'}</p>
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
      ${S.wrong[q.id] ? `<div class="cnt">错过 ${S.wrong[q.id]} 次</div>` : ''}</div>`;
  }
  function renderWrong() {
    const list = Object.keys(S.wrong).map((id) => QMAP[id]).filter(Boolean).sort((a, b) => S.wrong[b.id] - S.wrong[a.id]);
    $('#wrong-box').innerHTML = `
      <h2 class="vh">错题本</h2>
      <p class="lead">做错的题自动收进来，按错的次数排。在"重做错题"里答对一次就移出。</p>
      ${list.length ? `<div class="toolbar"><button class="btn primary" id="redo"><svg class="i"><use href="#i-redo"/></svg>重做错题（${list.length}）</button>
        <button class="btn ghost" id="clearWrong"><svg class="i"><use href="#i-trash"/></svg>清空错题本</button></div>${list.map(wrongCard).join('')}`
        : '<div class="empty"><svg class="i"><use href="#i-party"/></svg>还没有错题。去"刷题"做几道吧。</div>'}`;
    const r = $('#redo'); if (r) r.onclick = () => startQuiz('wrong');
    const c = $('#clearWrong'); if (c) c.onclick = () => { if (confirm('确定清空错题本吗？做题记录会保留。')) { S.wrong = {}; save(); refreshStat(); renderWrong(); } };
  }

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
