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

  /* ---------- 主题 ---------- */
  const isDark = () => (S.theme ? S.theme === 'dark' : (document.documentElement.dataset.style === 'c' || matchMedia('(prefers-color-scheme: dark)').matches));
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
  function renderOutline() {
    $('#toc').innerHTML = CHAPTERS.map((c, i) => `<a href="#ch-${c.id}" data-ch="${c.id}"><span class="n">${String(i + 1).padStart(2, '0')}</span>${esc(c.name)}</a>`).join('');
    $('#tocM').innerHTML = CHAPTERS.map((c, i) => `<a href="#ch-${c.id}" data-ch="${c.id}">${String(i + 1).padStart(2, '0')} ${esc(c.name)}</a>`).join('');
    $('#outline-box').innerHTML = CHAPTERS.map((c, ci) => {
      const qn = QUESTIONS.filter((q) => q.ch === c.id).length;
      const pts = c.points.map((p, i) => {
        const k = ptKey(c, i), m = !!S.mastered[k];
        const tag = p.hot === 2 ? '<span class="tag h2">必考</span>' : p.hot === 1 ? '<span class="tag h1">常考</span>' : '';
        return `<details class="pt" data-k="${k}" data-hot="${p.hot}">
          <summary>
            <div class="pt-title">${esc(p.t)} ${tag}${m ? '<span class="tag ok">已掌握</span>' : ''}</div>
            <span class="caret">›</span>
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
          <h3>${esc(c.name)}</h3>
          <button class="btn go" data-practice="${c.id}"><svg class="i"><use href="#i-pen"/></svg>练这章 ${qn} 题</button>
          <p>${esc(c.intro)}</p>
        </div>${pts}</section>`;
    }).join('');
    applyFilter();
    // 滚动时高亮左栏当前章
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) document.querySelectorAll('#toc a').forEach((a) => a.classList.toggle('on', a.dataset.ch === e.target.dataset.ch)); });
      }, { rootMargin: '-80px 0px -70% 0px' });
      document.querySelectorAll('#outline-box section.ch').forEach((s) => io.observe(s));
    }
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
      sec.hidden = !any;
    });
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
    if (e.target.checked && !t) title.insertAdjacentHTML('beforeend', '<span class="tag ok">已掌握</span>');
    if (!e.target.checked && t) t.remove();
  });
  $('#outline-box').addEventListener('click', (e) => {
    const b = e.target.closest('[data-practice]'); if (b) startQuiz('ch', b.dataset.practice);
  });
  ['#toc', '#tocM'].forEach((sel) => $(sel).addEventListener('click', (e) => {
    const a = e.target.closest('a[data-ch]'); if (!a) return;
    e.preventDefault(); document.getElementById('ch-' + a.dataset.ch).scrollIntoView({ behavior: 'smooth' });
  }));

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
    let r = 0, t = 0;
    QUESTIONS.filter((q) => q.ch === chId).forEach((q) => { const s = S.stats[q.id]; if (s) { r += s.r || 0; t += (s.r || 0) + (s.w || 0); } });
    return t ? Math.round(r / t * 100) : null;
  }
  function renderQuizHome() {
    quiz = null;
    const hotN = QUESTIONS.filter((q) => q.hot).length;
    const done = QUESTIONS.filter((q) => S.stats[q.id]).length;
    $('#quiz-box').innerHTML = `
      <h2 class="vh">经典真题</h2>
      <p class="lead">共 ${QUESTIONS.length} 题，覆盖每个必考点。已做过 ${done} 题。练习模式答完立刻出解析；模拟考试交卷再看分数。</p>
      <div class="mode-grid">
        <button class="mode featured" data-mode="hot"><b><svg class="i"><use href="#i-fire"/></svg>高频必刷</b><span>${hotN} 道最常考的题，随机顺序</span></button>
        <button class="mode" data-mode="exam"><b><svg class="i"><use href="#i-clock"/></svg>模拟考试</b><span>随机抽 50 题，交卷后出分，90 分算过</span></button>
        <button class="mode" data-mode="all"><b><svg class="i"><use href="#i-list"/></svg>全部顺序练</b><span>按章节从头到尾 ${QUESTIONS.length} 题</span></button>
        <button class="mode" data-mode="new"><b><svg class="i"><use href="#i-spark"/></svg>只做没做过的</b><span>还剩 ${QUESTIONS.length - done} 题</span></button>
      </div>
      <h3 class="sub-h">按章节练</h3>
      <div class="mode-grid">
        ${CHAPTERS.map((c) => {
          const n = QUESTIONS.filter((q) => q.ch === c.id).length; const acc = chAcc(c.id);
          return `<button class="mode" data-mode="ch" data-ch="${c.id}"><b>${esc(c.name)}</b>
            <span>${n} 题 · ${acc === null ? '还没练' : '正确率 ' + acc + '%'}</span>
            <div class="bar"><i style="width:${acc || 0}%"></i></div></button>`;
        }).join('')}
      </div>`;
  }
  $('#quiz-box').addEventListener('click', (e) => {
    const m = e.target.closest('[data-mode]'); if (m) return startQuiz(m.dataset.mode, m.dataset.ch);
    const o = e.target.closest('[data-opt]'); if (o) return pick(+o.dataset.opt);
    const n = e.target.closest('[data-nav]'); if (n) return nav(n.dataset.nav);
    const g = e.target.closest('[data-goto]'); if (g) { show('outline'); setTimeout(() => document.getElementById('ch-' + g.dataset.goto).scrollIntoView(), 30); }
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
    quiz = { list, i: 0, ans: {}, mode, title, instant, finished: false };
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
    const expHtml = reveal ? `<div class="exp ${ok ? 'ok' : 'no'}"><span class="verdict">${ok ? '答对了' : '答错了'}</span>
        正确答案：<b>${keys[rightIdx(q)]} ${esc(opts[rightIdx(q)])}</b><br>${esc(q.exp)}
        <a href="javascript:void 0" data-goto="${q.ch}">看考点 ›</a></div>` : '';
    const doneN = Object.keys(ans).length;
    const last = i === list.length - 1;
    $('#quiz-box').innerHTML = `
      <div class="quiz-head"><button class="btn ghost" data-nav="home">‹ 返回</button>
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

  function record(q, ok) {
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
      ${list.length ? `<div class="toolbar"><button class="btn primary" id="redo">重做错题（${list.length}）</button>
        <button class="btn ghost" id="clearWrong">清空错题本</button></div>${list.map(wrongCard).join('')}`
        : '<div class="empty">还没有错题。去"刷题"做几道吧。</div>'}`;
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
  renderOutline(); renderNumbers(); refreshStat();
  const start = location.hash.slice(1);
  show(VIEWS.includes(start) ? start : 'outline');
  window.addEventListener('hashchange', () => { const v = location.hash.slice(1); if (VIEWS.includes(v)) show(v); });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
