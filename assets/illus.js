/* 考点图解：纯 SVG，颜色走 CSS 变量，跟随浅色/深色主题。
 * 用法：考点正文里放 <div class="illus" data-illus="名字"></div>，app.js 渲染时替换成 ILLUS[名字]()。 */
(() => {
  const F = 'font-family:var(--sans);';
  const T = (x, y, t, size = 11, opt = '') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" style="${F}${opt}" fill="currentColor">${t}</text>`;
  const TL = (x, y, t, size = 11, opt = '') => `<text x="${x}" y="${y}" font-size="${size}" style="${F}${opt}" fill="currentColor">${t}</text>`;
  const svg = (w, h, inner, cls = '') => `<svg viewBox="0 0 ${w} ${h}" class="il ${cls}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  // 限速牌：白底红圈 / 蓝底 最低限速
  const maxSign = (x, y, n, r = 13) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#d7262b" stroke-width="${r * .22}"/><text x="${x}" y="${y + r * .36}" font-size="${r * .9}" text-anchor="middle" font-weight="800" fill="#141414" style="${F}">${n}</text>`;
  const minSign = (x, y, n, r = 13) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1d4fb8"/><text x="${x}" y="${y + r * .36}" font-size="${r * .9}" text-anchor="middle" font-weight="800" fill="#fff" style="${F}">${n}</text>`;
  // 一段俯视的路
  const road = (x, y, w, h, center) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#4a4f57"/>
    <line x1="${x + 6}" y1="${y + 4}" x2="${x + w - 6}" y2="${y + 4}" stroke="#fff" stroke-width="1.5"/><line x1="${x + 6}" y1="${y + h - 4}" x2="${x + w - 6}" y2="${y + h - 4}" stroke="#fff" stroke-width="1.5"/>
    ${center === 'dash' ? `<line x1="${x + 6}" y1="${y + h / 2}" x2="${x + w - 6}" y2="${y + h / 2}" stroke="#f5c400" stroke-width="2" stroke-dasharray="8 6"/>` : center === 'solid' ? `<line x1="${x + 6}" y1="${y + h / 2}" x2="${x + w - 6}" y2="${y + h / 2}" stroke="#f5c400" stroke-width="2"/>` : ''}`;
  // 俯视小车：车头朝 +x
  const car = (x, y, c = 'var(--brand)', flip = false) => `<g transform="translate(${x},${y}) ${flip ? 'scale(-1,1)' : ''}">
    <g fill="#23262b"><rect x="-11" y="-9.5" width="6" height="3.5" rx="1"/><rect x="-11" y="6" width="6" height="3.5" rx="1"/><rect x="5" y="-9.5" width="6" height="3.5" rx="1"/><rect x="5" y="6" width="6" height="3.5" rx="1"/></g>
    <path d="M-15 -5 q0 -3 3 -3 h22 q4 0 6 3 l1 5 l-1 5 q-2 3 -6 3 h-22 q-3 0 -3 -3 z" fill="${c}"/>
    <path d="M1 -5.5 h6 l3.5 5.5 l-3.5 5.5 h-6 z" fill="#fff" opacity=".82"/>
    <path d="M-9 -5 h6 l1.5 5 l-1.5 5 h-6 z" fill="#fff" opacity=".55"/>
    <rect x="-13" y="-5" width="3" height="10" rx="1" fill="#fff" opacity=".3"/>
    <rect x="15" y="-5" width="2.2" height="3" rx=".6" fill="#fff6c8"/><rect x="15" y="2" width="2.2" height="3" rx=".6" fill="#fff6c8"/></g>`;
  const chip = (x, y, w, t, c = 'var(--brand)', ink = '#fff', size = 11) => `<rect x="${x - w / 2}" y="${y - 10}" width="${w}" height="20" rx="10" fill="${c}"/><text x="${x}" y="${y + 4}" font-size="${size}" text-anchor="middle" font-weight="700" fill="${ink}" style="${F}">${t}</text>`;

  const ILLUS = {
    /* 记分五档阶梯 */
    points_ladder(hl) {
      hl = hl ? +hl : 0;
      const steps = [
        [12, 'var(--red)', ['酒驾', '事故逃逸致伤亡', '假牌套牌', '高速逆行倒车掉头', '高速超速 50%+', '超员 100%+', '买卖分']],
        [9, '#e8640c', ['高速违停', '遮挡 / 不挂号牌', '准驾不符', '7 座以上超员 50%']],
        [6, 'var(--amber)', ['闯红灯', '暂扣期间开车', '逃逸仅财损', '占应急车道行驶', '高速超速 20–50%']],
        [3, 'var(--brand)', ['打手持电话', '不让行人 / 校车', '加塞 / 逆行', '高速不按车道', '低于最低时速']],
        [1, 'var(--ok)', ['不系安全带', '灯光使用不当', '违反禁令标志', '不按规定会车', '摩托不戴头盔']],
      ];
      const W = 360, colW = 68, base = 88;
      return svg(W, 144, steps.map(([n, c, items], i) => {
        const x = 6 + i * (colW + 4), h = 22 + (4 - i) * 10, dim = hl && hl !== n;
        return `<g opacity="${dim ? .28 : 1}"><rect x="${x}" y="${base - h}" width="${colW}" height="${h}" rx="6" fill="${c}"/>${hl === n ? `<rect x="${x - 3}" y="${base - h - 3}" width="${colW + 6}" height="${h + 6}" rx="8" fill="none" stroke="${c}" stroke-width="2"/>` : ''}
          <text x="${x + colW / 2}" y="${base - h + 18}" font-size="15" text-anchor="middle" font-weight="800" fill="#fff" style="${F}">${n} 分</text>
          ${items.slice(0, 4).map((t, j) => T(x + colW / 2, base + 14 + j * 11, t, 7.5, 'opacity:.85')).join('')}</g>`;
      }).join('') + `<line x1="4" y1="${base}" x2="${W - 4}" y2="${base}" stroke="currentColor" stroke-opacity=".2"/>`, 'il-ladder');
    },

    /* 没有限速标志时的最高车速 */
    speed_road() {
      const rows = [
        ['城市道路', 'none', 30, 'dash', 50],
        ['公路', 'none', 40, 'dash', 70],
      ];
      return svg(360, 130, rows.map(([name, c1, v1, c2, v2], i) => {
        const y = 14 + i * 60;
        return `${TL(6, y + 20, name, 12, 'font-weight:700')}
          ${road(70, y, 110, 32, c1)}${car(100, y + 16)}${maxSign(160, y + 16, v1, 12)}${T(125, y + 46, '没有中心线', 9.5, 'opacity:.7')}
          ${road(210, y, 140, 32, c2)}${car(240, y + 24)}${car(300, y + 8, 'var(--ink-dim)', true)}${maxSign(330, y + 16, v2, 12)}${T(280, y + 46, '同向只有 1 条车道', 9.5, 'opacity:.7')}`;
      }).join(''));
    },

    /* 高速各车道最低速 */
    highway_lanes() {
      const lanes = [['最左', 110], ['中间', 90], ['最右', 60]];
      return svg(360, 128, `
        <rect x="40" y="8" width="280" height="100" rx="6" fill="#4a4f57"/>
        ${lanes.map(([n, v], i) => { const y = 8 + i * 33.3; return `${i ? `<line x1="46" y1="${y}" x2="314" y2="${y}" stroke="#fff" stroke-width="1.5" stroke-dasharray="8 6"/>` : ''}
          ${TL(48, y + 21, n + '车道', 10, 'fill:#fff;opacity:.85')}${minSign(130, y + 16.6, v, 12)}${car(190, y + 16.6)}${TL(222, y + 21, i === 2 ? '最低 60' : '最低 ' + v, 10, 'fill:#fff;opacity:.85')}`; }).join('')}
        ${maxSign(338, 30, 120, 13)}${T(338, 56, '最高', 9.5, 'opacity:.7')}
        ${T(20, 60, '3 条', 10, 'opacity:.7')}${T(20, 72, '车道', 10, 'opacity:.7')}
        ${T(180, 124, '2 条车道时：左侧最低 100', 10, 'opacity:.75')}`);
    },

    /* 高速低能见度三档 */
    visibility() {
      const cards = [['能见度 < 200 m', 60, '车距 ≥ 100 m', '开雾灯 + 近光 + 示廓'], ['能见度 < 100 m', 40, '车距 ≥ 50 m', '再加开双闪'], ['能见度 < 50 m', 20, '最近出口驶离', '别硬开']];
      return svg(360, 120, cards.map(([h, v, d, l], i) => {
        const x = 4 + i * 118, fog = .25 + i * .3;
        return `<rect x="${x}" y="4" width="112" height="112" rx="12" fill="currentColor" fill-opacity=".06"/>
          <rect x="${x}" y="4" width="112" height="40" rx="12" fill="currentColor" fill-opacity="${fog * .35}"/>
          ${[0, 1, 2].map((k) => `<path d="M${x + 14 + k * 4} ${16 + k * 9} q10 -5 20 0 t20 0 t20 0 t20 0" fill="none" stroke="currentColor" stroke-opacity="${fog}" stroke-width="2"/>`).join('')}
          ${T(x + 56, 60, h, 10.5, 'font-weight:700')}
          ${maxSign(x + 56, 82, v, 14)}
          ${T(x + 56, 108, d, 9.5, 'opacity:.8')}`;
      }).join(''));
    },

    /* 酒精刻度 */
    alcohol() {
      return svg(360, 104, `
        <rect x="20" y="30" width="320" height="16" rx="8" fill="currentColor" fill-opacity=".1"/>
        <rect x="20" y="30" width="80" height="16" rx="8" fill="var(--ok)"/>
        <rect x="100" y="30" width="120" height="16" fill="var(--amber)"/>
        <rect x="220" y="30" width="120" height="16" rx="8" fill="var(--red)"/><rect x="220" y="30" width="20" height="16" fill="var(--red)"/>
        ${T(60, 24, '正常', 10, 'opacity:.7')}${T(160, 24, '饮酒驾驶', 11, 'font-weight:700')}${T(280, 24, '醉酒驾驶', 11, 'font-weight:700')}
        ${chip(100, 62, 44, '20', 'currentColor', 'var(--bg)')}${chip(220, 62, 44, '80', 'currentColor', 'var(--bg)')}
        ${T(100, 82, 'mg / 100mL', 8.5, 'opacity:.6')}${T(220, 82, 'mg / 100mL', 8.5, 'opacity:.6')}
        ${T(100, 98, '饮酒：暂扣 6 个月 · 罚 1000–2000 · 记 12 分', 8.5)}${T(280, 98, '醉驾：吊销 · 刑责 · 5 年内不得重考', 8.5)}`);
    },

    /* 驾驶证有效期时间轴 */
    license_timeline() {
      const pts = [[40, '初领', '6 年'], [160, '换证', '10 年'], [280, '换证', '长期']];
      return svg(360, 106, `
        <line x1="40" y1="40" x2="320" y2="40" stroke="currentColor" stroke-opacity=".25" stroke-width="3"/>
        ${pts.map(([x, a, b], i) => `<circle cx="${x}" cy="40" r="9" fill="var(--brand)"/><text x="${x}" y="44" font-size="9" text-anchor="middle" fill="#fff" font-weight="800" style="${F}">${i + 1}</text>
          ${T(x, 22, a, 10, 'opacity:.7')}${chip(x, 76, 52, b)}`).join('')}
        ${T(100, 58, '每个周期都没记满 12 分', 8.5, 'opacity:.6')}${T(220, 58, '每个周期都没记满 12 分', 8.5, 'opacity:.6')}
        ${T(180, 100, '到期前 90 日内换证 · 过期 1 年以上注销', 9.5)}`);
    },

    /* 实习期 */
    probation() {
      return svg(360, 92, `
        <rect x="20" y="30" width="240" height="18" rx="9" fill="var(--amber)"/><rect x="260" y="30" width="80" height="18" rx="9" fill="currentColor" fill-opacity=".12"/>
        <text x="140" y="43" font-size="10.5" text-anchor="middle" font-weight="800" fill="#3a2300" style="${F}">实习期 12 个月</text>
        ${T(300, 43, '正式', 10, 'opacity:.7')}
        <rect x="24" y="4" width="34" height="18" rx="4" fill="#f5c400" stroke="#141414"/><text x="41" y="17" font-size="9" text-anchor="middle" font-weight="800" fill="#141414" style="${F}">实习</text>
        ${TL(64, 17, '车尾贴实习标志', 10)}
        ${TL(24, 70, '上高速：要有持证 3 年以上的人陪同', 10)}
        ${TL(24, 86, '记满 12 分：注销实习车型资格 · 不得牵引挂车 / 开营运客车', 9.5, 'opacity:.8')}`);
    },

    /* 停车禁区 口50 站30 */
    parking() {
      return svg(360, 150, `
        <rect x="0" y="60" width="360" height="34" fill="#4a4f57"/><rect x="140" y="0" width="34" height="150" fill="#4a4f57"/>
        <circle cx="157" cy="77" r="62" fill="var(--red)" fill-opacity=".12" stroke="var(--red)" stroke-dasharray="4 4"/>
        ${chip(157, 20, 86, '路口 50 m 内禁停', 'var(--red)')}
        <rect x="262" y="42" width="36" height="14" rx="3" fill="var(--brand)"/><text x="280" y="52" font-size="8" text-anchor="middle" fill="#fff" style="${F}">公交站</text>
        <circle cx="280" cy="77" r="40" fill="var(--amber)" fill-opacity=".18" stroke="var(--amber)" stroke-dasharray="4 4"/>
        ${chip(280, 130, 96, '车站 30 m 内禁停', 'var(--amber)', '#3a2300')}
        ${T(72, 128, '道口 · 急弯 · 窄路(<4 m)', 8.5, 'opacity:.8')}${T(72, 140, '桥 · 陡坡 · 隧道 同样 50 m', 8.5, 'opacity:.8')}
        ${T(280, 146, '急救站 · 加油站 · 消防栓同样 30 m', 8.5, 'opacity:.8')}`);
    },

    /* 路口让行三规则 */
    yield_rules() {
      const cross = (x) => `<rect x="${x + 44}" y="0" width="28" height="110" fill="#4a4f57"/><rect x="${x}" y="41" width="116" height="28" fill="#4a4f57"/>`;
      const arrow = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="4" stroke-linecap="round"/><polygon points="0,-5 8,0 0,5" transform="translate(${x2},${y2}) rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI})" fill="${c}"/>`;
      const GO = 'var(--ok)', WAIT = 'var(--red)';
      return svg(360, 136, `
        ${cross(2)}${arrow(16, 55, 50, 55, GO)}${arrow(58, 100, 58, 72, WAIT)}${T(60, 126, '无标志路口：让右方来车', 9.5, 'font-weight:700')}
        ${cross(122)}${arrow(180, 100, 180, 20, GO)}${arrow(178, 100, 178, 74, WAIT)}<path d="M178 74 q0 -14 -16 -14" fill="none" stroke="${WAIT}" stroke-width="4" stroke-linecap="round"/>${T(180, 126, '转弯让直行', 9.5, 'font-weight:700')}
        ${cross(242)}${arrow(300, 100, 300, 68, GO)}<path d="M300 68 q0 -14 -22 -14" fill="none" stroke="${GO}" stroke-width="4" stroke-linecap="round"/>${arrow(300, 12, 300, 40, WAIT)}<path d="M300 40 q0 12 -20 12" fill="none" stroke="${WAIT}" stroke-width="4" stroke-linecap="round"/>${T(300, 126, '对向：右转让左转', 9.5, 'font-weight:700')}
        <rect x="4" y="4" width="8" height="8" rx="2" fill="${GO}"/>${TL(15, 11, '先走', 8.5)}<rect x="40" y="4" width="8" height="8" rx="2" fill="${WAIT}"/>${TL(51, 11, '让', 8.5)}`);
    },

    /* 会车：坡路 / 山路 */
    meeting() {
      return svg(360, 120, `
        <path d="M10 100 L170 40" stroke="#4a4f57" stroke-width="14" stroke-linecap="round"/>
        ${car(50, 84)}${car(130, 56, 'var(--ink-dim)', true)}
        ${chip(50, 108, 60, '上坡先行', 'var(--ok)')}${chip(130, 36, 48, '下坡让', 'var(--red)')}
        ${TL(8, 16, '下坡的已到中途，则下坡先行', 8.5, 'opacity:.7')}
        <path d="M200 20 L200 110" stroke="#8b7355" stroke-width="22"/><path d="M226 20 L226 110" stroke="#4a4f57" stroke-width="30"/>
        ${T(200, 66, '山', 11, 'fill:#fff;font-weight:700')}
        ${car(216, 44, 'var(--red)')}${car(236, 92, 'var(--ok)', true)}
        ${chip(300, 44, 76, '靠山体：让', 'var(--red)')}${chip(300, 92, 84, '不靠山体：先', 'var(--ok)')}`);
    },

    /* 灯光：什么情况开什么灯 */
    lights() {
      const row = (y, name, lamps) => `${TL(6, y + 4, name, 10.5, 'font-weight:700')}${lamps.map((l, i) => chip(150 + i * 70, y, 64, l, 'var(--brand-soft)', 'var(--brand-deep)', 9.5)).join('')}`;
      return svg(360, 150, `
        ${row(14, '超车 / 起步 / 掉头 / 向左', ['左转向灯'])}
        ${row(40, '回原车道 / 靠边停 / 向右', ['右转向灯'])}
        ${row(66, '夜间无路灯', ['前照灯', '示廓灯', '后位灯'])}
        ${row(92, '雾天', ['雾灯', '双闪'])}
        ${row(118, '夜间会车 150 m', ['近光灯'])}
        ${row(144, '夜间过弯 / 坡 / 无灯路口', ['远近交替'])}`);
    },

    /* 车距 */
    following() {
      return svg(360, 118, `
        ${road(10, 10, 340, 34, 'dash')}${car(50, 27)}${car(300, 27, 'var(--ink-dim)')}
        <line x1="70" y1="52" x2="282" y2="52" stroke="var(--brand)" stroke-width="2" marker-end="none"/>
        ${chip(176, 52, 134, '> 100 km/h → ≥ 100 m')}
        ${road(10, 62, 340, 34, 'dash')}${car(50, 79)}${car(200, 79, 'var(--ink-dim)')}
        ${chip(125, 106, 134, '≤ 100 km/h → ≥ 50 m', 'var(--brand-soft)', 'var(--brand-deep)')}`);
    },

    /* 故障停车警告标志距离 */
    warning_triangle() {
      const tri = (x, y) => `<polygon points="${x},${y - 9} ${x + 9},${y + 7} ${x - 9},${y + 7}" fill="#d7262b"/><polygon points="${x},${y - 4} ${x + 4},${y + 4} ${x - 4},${y + 4}" fill="#fff"/>`;
      return svg(360, 100, `
        ${TL(6, 22, '普通道路', 10.5, 'font-weight:700')}${road(70, 6, 280, 30, 'dash')}${car(320, 21, 'var(--red)')}${tri(230, 21)}
        <line x1="236" y1="40" x2="306" y2="40" stroke="currentColor" stroke-opacity=".5"/>${T(271, 50, '车后 50–100 m', 9.5)}
        ${TL(6, 76, '高速公路', 10.5, 'font-weight:700')}${road(70, 60, 280, 30, 'none')}${car(320, 75, 'var(--red)')}${tri(130, 75)}
        <line x1="136" y1="94" x2="306" y2="94" stroke="currentColor" stroke-opacity=".5"/>${T(221, 100, '来车方向 150 m 以外 · 人撤到护栏外', 9.5)}`);
    },

    /* ---- 第二批 ---- */
    exam_rules() {
      const tile = (x, big, small, c) => `<rect x="${x}" y="8" width="106" height="78" rx="12" fill="${c}" fill-opacity=".12"/><text x="${x + 53}" y="50" font-size="26" text-anchor="middle" font-weight="800" fill="${c}" style="${F}">${big}</text>${T(x + 53, 72, small, 10)}`;
      return svg(360, 122, `${tile(6, '100 题', '45 分钟', 'var(--brand)')}${tile(127, '90 分', '及格', 'var(--ok)')}${tile(248, '补考 1 次', '当场', 'var(--amber)')}
        ${T(180, 112, '单选约 60 + 判断约 40 · 科二科三各最多约 5 次 · 学车证明 3 年', 9.5, 'opacity:.75')}`);
    },
    license_classes() {
      const box = (x, y, w, h, c, label, sub) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="1.5"/><text x="${x + 10}" y="${y + 18}" font-size="12" font-weight="800" fill="${c}" style="${F}">${label}</text>${sub ? TL(x + 10, y + 32, sub, 9) : ''}`;
      return svg(360, 120, `${box(6, 6, 190, 108, 'var(--brand)', 'C1 小型汽车', '手动 + 自动都能开')}${box(28, 46, 150, 56, 'var(--ok)', 'C2 小型自动挡', '只能开自动挡')}
        ${box(212, 6, 142, 48, 'var(--amber)', 'C6 轻型牵引挂车', '要单独考，C1 不含')}${box(212, 66, 142, 48, 'var(--red)', 'B / A 大中型', '含 C1、C2，年龄 20–63')}
        `);
    },
    ban_years() {
      const rows = [['隐瞒 / 虚假材料', 1], ['考试作弊', 1], ['一般吊销', 2], ['欺骗贿赂取得', 3], ['吸毒', 3], ['醉驾 / 酒驾营运', 5], ['醉驾营运', 10], ['逃逸犯罪 / 酒驾重大事故', '终生']];
      return svg(360, 150, rows.map(([n, y], i) => { const yy = 10 + i * 17, w = y === '终生' ? 150 : y * 14; const c = y === '终生' ? 'var(--red)' : y >= 5 ? '#e8640c' : y >= 2 ? 'var(--amber)' : 'var(--brand)';
        return `${TL(4, yy + 9, n, 9.5)}<rect x="126" y="${yy}" width="${w}" height="12" rx="6" fill="${c}"/>${TL(132 + w, yy + 9.5, y === '终生' ? '终生不得' : y + ' 年', 9.5, 'font-weight:700')}`; }).join(''));
    },
    full_points_flow() {
      const step = (x, t, c = 'var(--brand)') => `<rect x="${x}" y="22" width="70" height="36" rx="10" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="1.2"/>${T(x + 35, 44, t, 10, 'font-weight:700')}`;
      const arr = (x) => `<path d="M${x} 40 h14" stroke="currentColor" stroke-opacity=".4" stroke-width="2" marker-end="url(#ilah)"/>`;
      return svg(360, 112, `<defs><marker id="ilah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="currentColor" fill-opacity=".5"/></marker></defs>
        ${step(4, '记满 12 分', 'var(--red)')}${arr(76)}${step(94, '扣留驾驶证')}${arr(166)}${step(184, '学习 7 天')}${arr(256)}${step(274, '考科目一', 'var(--ok)')}
        ${T(180, 80, '一个周期内 2 次满分 / 累积 24 分 → 加考科目三', 10)}${T(180, 98, '3 次以上 / 累积 36 分 → 科目二、三都考', 10)}`);
    },
    minus_points() {
      const tile = (x, t, v, c) => `<rect x="${x}" y="8" width="108" height="64" rx="12" fill="${c}" fill-opacity=".12"/>${T(x + 54, 34, t, 10.5, 'font-weight:700')}<text x="${x + 54}" y="60" font-size="18" text-anchor="middle" font-weight="800" fill="${c}" style="${F}">${v}</text>`;
      return svg(360, 100, `${tile(4, '网上学习 30 分钟', '−1 分', 'var(--brand)')}${tile(126, '现场学习 1 小时', '−2 分', 'var(--ok)')}${tile(248, '公益活动 1 小时', '−1 分', 'var(--amber)')}
        ${T(180, 92, '一个周期最多减 6 分 · 实习期、扣证期间不能减', 9.5, 'opacity:.8')}`);
    },
    fines() {
      const rows = [['一般违规', '20–200 元', 1, 'var(--brand)'], ['无证 / 借车给无证 / 超速 50% / 逃逸', '200–2000 元', 2.2, 'var(--amber)'], ['伪造变造 / 套用牌证', '2000–5000 元', 3.4, 'var(--red)'], ['未买交强险', '保费 × 2', 1.8, '#e8640c']];
      return svg(360, 104, rows.map(([n, v, w, c], i) => { const y = 8 + i * 24; return `${TL(4, y + 11, n, 9)}<rect x="190" y="${y}" width="${w * 28}" height="14" rx="7" fill="${c}"/>${TL(196 + w * 28, y + 11, v, 9.5, 'font-weight:700')}`; }).join(''));
    },
    must_have() {
      const item = (x, glyph, t) => `<rect x="${x}" y="6" width="64" height="64" rx="12" fill="currentColor" fill-opacity=".06"/>${glyph}${T(x + 32, 90, t, 9.5)}`;
      const plate = (x) => `<rect x="${x + 12}" y="28" width="40" height="18" rx="3" fill="#1d4fb8"/><text x="${x + 32}" y="41" font-size="8" text-anchor="middle" fill="#fff" font-weight="700" style="${F}">京A·12345</text>`;
      const card = (x, c) => `<rect x="${x + 14}" y="24" width="36" height="26" rx="4" fill="${c}"/><rect x="${x + 18}" y="30" width="10" height="12" rx="2" fill="#fff" opacity=".8"/><rect x="${x + 31}" y="31" width="14" height="2.5" fill="#fff" opacity=".8"/><rect x="${x + 31}" y="37" width="14" height="2.5" fill="#fff" opacity=".8"/>`;
      const shield = (x) => `<path d="M${x + 32} 22 l16 6 v12 q0 12 -16 18 q-16 -6 -16 -18 v-12 z" fill="var(--ok)"/><path d="M${x + 25} 40 l5 5 l10 -10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
      const tag = (x) => `<circle cx="${x + 32}" cy="38" r="14" fill="var(--amber)"/><text x="${x + 32}" y="42" font-size="9" text-anchor="middle" font-weight="800" fill="#3a2300" style="${F}">检验</text>`;
      return svg(360, 100, `${item(10, plate(10), '号牌（前后）')}${item(96, card(96, 'var(--brand)'), '行驶证')}${item(182, card(182, '#5b3fb8'), '驾驶证')}${item(268, shield(268), '交强险')}`);
    },
    registration() {
      return svg(360, 96, `
        <rect x="6" y="8" width="168" height="80" rx="12" fill="var(--brand)" fill-opacity=".1"/>${T(90, 28, '变更登记', 11, 'font-weight:800')}
        ${car(50, 56, '#d7262b')}<path d="M72 56 h16" stroke="currentColor" stroke-opacity=".5" stroke-width="2"/>${car(110, 56, 'var(--brand)')}${T(90, 82, '改颜色 / 换发动机 / 换车身车架', 8.5, 'opacity:.8')}
        <rect x="186" y="8" width="168" height="80" rx="12" fill="var(--ok)" fill-opacity=".1"/>${T(270, 28, '转移登记', 11, 'font-weight:800')}
        ${car(230, 56, 'var(--ok)')}<path d="M252 56 h16" stroke="currentColor" stroke-opacity=".5" stroke-width="2"/><circle cx="292" cy="50" r="7" fill="currentColor" fill-opacity=".5"/><path d="M280 68 q12 -14 24 0" fill="currentColor" fill-opacity=".5"/>${T(270, 82, '车换了主人（过户）', 8.5, 'opacity:.8')}`);
    },
    inspection() {
      const yrs = [2, 4, 6, 8, 10, 11, 12];
      return svg(360, 100, `<line x1="20" y1="44" x2="340" y2="44" stroke="currentColor" stroke-opacity=".25" stroke-width="3"/>
        ${yrs.map((y, i) => { const x = 30 + i * 50, on = y === 6 || y === 10 || y > 10; return `<circle cx="${x}" cy="44" r="${on ? 9 : 6}" fill="${on ? 'var(--red)' : 'var(--ok)'}"/>${T(x, 28, '第 ' + y + ' 年', 9)}${T(x, 70, on ? '上线检验' : '免上线领标', 8.5, on ? 'font-weight:700' : 'opacity:.7')}`; }).join('')}
        ${T(180, 94, '私家车 10 年内只上线 2 次（第 6、10 年）；10 年以上每年 1 次', 9.5)}`);
    },
    overtake() {
      return svg(360, 110, `${road(10, 20, 340, 60, 'dash')}
        ${car(250, 65, 'var(--ink-dim)')}${car(120, 65)}
        <path d="M140 60 q40 -30 90 -25" fill="none" stroke="var(--ok)" stroke-width="3" stroke-dasharray="6 4"/><path d="M230 35 q30 0 60 25" fill="none" stroke="var(--ok)" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#ilah2)"/>
        <defs><marker id="ilah2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="var(--ok)"/></marker></defs>
        ${chip(70, 36, 54, '左转向灯')}${chip(300, 36, 54, '右转向灯')}
        ${T(180, 100, '从前车左侧超越 · 拉开距离后开右灯回原道', 9.5)}`);
    },
    fatigue() {
      return svg(360, 92, `
        <circle cx="46" cy="46" r="30" fill="currentColor" fill-opacity=".06" stroke="currentColor" stroke-opacity=".3" stroke-width="3"/><path d="M46 46 V22 M46 46 L62 56" stroke="var(--red)" stroke-width="4" stroke-linecap="round"/>
        ${chip(130, 36, 110, '连续驾驶 ≤ 4 小时', 'var(--red)')}${chip(130, 62, 110, '停车休息 ≥ 20 分钟', 'var(--ok)')}
        <rect x="236" y="20" width="22" height="40" rx="4" fill="currentColor" fill-opacity=".5"/><line x1="226" y1="68" x2="270" y2="14" stroke="var(--red)" stroke-width="4" stroke-linecap="round"/>
        ${T(300, 36, '不打手持电话', 9.5, 'font-weight:700')}${T(300, 52, '不看视频', 9.5)}${T(300, 68, '下坡不空挡滑行', 9.5)}`);
    },
    ramp() {
      return svg(360, 142, `${road(10, 20, 340, 40, 'dash')}
        <path d="M10 60 L120 60 L60 100 L10 100 Z" fill="#4a4f57"/><path d="M350 60 L240 60 L300 100 L350 100 Z" fill="#4a4f57"/>
        ${car(40, 85)}<path d="M55 82 q30 -10 60 -32" fill="none" stroke="var(--ok)" stroke-width="3" stroke-dasharray="6 4"/>
        ${car(320, 85, 'var(--ink-dim)', true)}<path d="M245 50 q30 10 60 32" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="6 4"/>
        ${chip(80, 128, 136, '驶入：左转向灯 + 加速车道')}${chip(280, 128, 136, '驶离：右转向灯 + 减速车道', 'var(--amber)', '#3a2300')}
        ${T(180, 40, '错过出口 → 继续往前，下一个出口再出', 9.5, 'fill:#fff;opacity:.9')}`);
    },
    traffic_light() {
      const lamp = (x, c) => `<circle cx="${x}" cy="30" r="15" fill="${c}"/>`;
      const cap = (x, a, b, c2) => `${T(x, 66, a, 10.5, 'font-weight:800')}${T(x, 81, b, 8.5)}${T(x, 93, c2, 8.5)}`;
      return svg(360, 150, `
        <rect x="6" y="8" width="348" height="44" rx="12" fill="#222"/>
        ${lamp(60, '#e53935')}${lamp(180, '#fdd835')}${lamp(300, '#43a047')}
        ${cap(60, '红灯 停', '右转弯可通行', '（不妨碍放行车辆行人）')}${cap(180, '黄灯 警示', '已过停止线的可继续', '没过线的停')}${cap(300, '绿灯 行', '转弯让直行', '让被放行的行人')}
        <rect x="6" y="106" width="348" height="38" rx="10" fill="currentColor" fill-opacity=".06"/>
        <circle cx="26" cy="125" r="9" fill="#fdd835"/>${TL(42, 121, '黄灯持续闪烁：注意瞭望，确认安全后通过', 9)}${TL(42, 136, '红叉 / 红箭头 = 本车道禁行；有交警指挥一律听交警', 9)}`);
    },
    accident_flow() {
      const step = (x, y, t, c) => `<rect x="${x}" y="${y}" width="64" height="30" rx="8" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="1.2"/>${T(x + 32, y + 19, t, 9.5, 'font-weight:700')}`;
      const arr = (x, y) => `<path d="M${x} ${y} h10" stroke="currentColor" stroke-opacity=".4" stroke-width="2" marker-end="url(#ilah)"/>`;
      return svg(360, 110, `<defs><marker id="ilah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="currentColor" fill-opacity=".5"/></marker></defs>
        ${TL(4, 24, '有人伤', 10, 'font-weight:800;fill:var(--red)')}${step(44, 8, '停车 + 双闪', 'var(--brand)')}${arr(110, 23)}${step(122, 8, '放三角牌', 'var(--brand)')}${arr(188, 23)}${step(200, 8, '救人 + 报警', 'var(--red)')}${arr(266, 23)}${step(278, 8, '标明位置', 'var(--amber)')}
        ${TL(4, 74, '轻微剐蹭', 10, 'font-weight:800;fill:var(--ok)')}${step(64, 58, '拍照取证', 'var(--ok)')}${arr(130, 73)}${step(142, 58, '先撤离现场', 'var(--ok)')}${arr(208, 73)}${step(220, 58, '自行协商', 'var(--ok)')}
        ${T(180, 104, '逃逸 / 破坏现场 = 全责 · 损失先由交强险赔', 9.5, 'opacity:.85')}`);
    },
    blowout() {
      const tile = (x, t, sub, c, glyph) => `<rect x="${x}" y="6" width="112" height="90" rx="12" fill="${c}" fill-opacity=".12"/>${glyph}${T(x + 56, 72, t, 10.5, 'font-weight:700')}${T(x + 56, 88, sub, 8.5, 'opacity:.8')}`;
      const wheel = (x) => `<circle cx="${x + 56}" cy="38" r="20" fill="none" stroke="var(--brand)" stroke-width="5"/><circle cx="${x + 56}" cy="38" r="5" fill="var(--brand)"/><path d="M${x + 38} 38 h13 M${x + 61} 38 h13 M${x + 56} 43 v15" stroke="var(--brand)" stroke-width="4"/>`;
      const pedal = (x) => `<rect x="${x + 44}" y="22" width="24" height="34" rx="4" fill="var(--ok)" transform="rotate(-12 ${x + 56} 40)"/><path d="M${x + 30} 30 l10 10" stroke="var(--ok)" stroke-width="4" stroke-linecap="round"/>`;
      const ban = (x) => `<rect x="${x + 44}" y="22" width="24" height="34" rx="4" fill="var(--red)" opacity=".5"/><circle cx="${x + 56}" cy="40" r="22" fill="none" stroke="var(--red)" stroke-width="4"/><line x1="${x + 40}" y1="56" x2="${x + 72}" y2="24" stroke="var(--red)" stroke-width="4"/>`;
      return svg(360, 104, `${tile(4, '紧握方向盘', '保持直线', 'var(--brand)', wheel(4))}${tile(124, '松开油门', '让车自己慢下来', 'var(--ok)', pedal(124))}${tile(244, '别急刹', '车速降下来再轻踩', 'var(--red)', ban(244))}`);
    },
    brake_fail() {
      const step = (x, t, sub, c) => `<rect x="${x}" y="10" width="106" height="60" rx="12" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="1.2"/>${T(x + 53, 36, t, 12, 'font-weight:800')}${T(x + 53, 56, sub, 9, 'opacity:.8')}`;
      return svg(360, 98, `${step(4, '① 抢挡减速', '高挡换低挡，发动机制动', 'var(--brand)')}${step(127, '② 缓拉手刹', '不能一下拉死', 'var(--amber)')}${step(250, '③ 避险车道', '或靠山体 / 障碍物', 'var(--red)')}
        ${T(180, 90, '全程先控制方向，别慌着跳车', 9.5, 'opacity:.8')}`);
    },
    emergencies() {
      const tile = (x, t, a, b, c) => `<rect x="${x}" y="6" width="84" height="92" rx="12" fill="${c}" fill-opacity=".12"/>${T(x + 42, 28, t, 11, 'font-weight:800')}${T(x + 42, 52, a, 8.5)}${T(x + 42, 66, b, 8.5)}`;
      return svg(360, 106, `${tile(4, '侧翻', '抓紧方向盘', '脚勾踏板 不跳车', 'var(--amber)')}${tile(94, '落水', '解安全带', '砸侧窗边角', 'var(--brand)')}${tile(184, '着火', '熄火断电', '别开机盖', 'var(--red)')}${tile(274, '正面碰撞', '撞自己这侧：', '躲开方向盘', '#e8640c')}`);
    },
    posture() {
      return svg(360, 110, `
        <circle cx="70" cy="56" r="40" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="7"/><circle cx="70" cy="56" r="9" fill="currentColor" fill-opacity=".5"/>
        <circle cx="34" cy="48" r="8" fill="var(--brand)"/><circle cx="106" cy="48" r="8" fill="var(--brand)"/>
        ${T(28, 12, '9–10 点', 9, 'font-weight:700')}${T(112, 12, '3–4 点', 9, 'font-weight:700')}${T(70, 106, '双手握盘位置', 9.5, 'opacity:.8')}
        ${chip(230, 24, 150, '头枕对准后脑中部 / 耳朵上沿', 'var(--brand-soft)', 'var(--brand-deep)', 9.5)}
        ${chip(230, 52, 150, 'ABS 急刹：一脚踩到底不松', 'var(--brand-soft)', 'var(--brand-deep)', 9.5)}
        ${chip(230, 80, 150, '儿童坐后排 + 安全座椅', 'var(--brand-soft)', 'var(--brand-deep)', 9.5)}`);
    },
    towing() {
      return svg(360, 86, `${road(10, 14, 340, 40, 'none')}${car(70, 34)}${car(230, 34, 'var(--ink-dim)')}
        <line x1="92" y1="34" x2="208" y2="34" stroke="var(--amber)" stroke-width="3"/>
        ${chip(150, 70, 150, '软连接 4–10 m · 最高 30 km/h', 'var(--amber)', '#3a2300', 9.5)}
        ${T(300, 74, '制动失效 → 硬连接', 9.5, 'font-weight:700')}`);
    },
    /* 辟谣：网传"新版记分" vs 现行 163 号令 */
    rumor_check() {
      const rows = [['开车打手持电话', '9 分', '3 分'], ['高速占用应急车道行驶', '9 分 + 罚 2000', '6 分'], ['高速违法停车', '—', '9 分']];
      const head = `${TL(4, 16, '情形', 9.5, 'opacity:.6;font-weight:700')}<rect x="168" y="4" width="88" height="18" rx="9" fill="var(--red)" fill-opacity=".14"/>${T(212, 17, '✗ 网传"新规"', 9.5, 'font-weight:700;fill:var(--red)')}<rect x="266" y="4" width="90" height="18" rx="9" fill="var(--ok)" fill-opacity=".16"/>${T(311, 17, '✓ 现行 163 号令', 9.5, 'font-weight:700;fill:var(--ok)')}`;
      return svg(360, 112, head + rows.map(([k, a, b], i) => { const y = 34 + i * 26;
        return `<line x1="4" y1="${y - 7}" x2="356" y2="${y - 7}" stroke="currentColor" stroke-opacity=".1"/>${TL(4, y + 10, k, 10.5, 'font-weight:600')}${T(212, y + 10, a, 10.5, 'opacity:.55')}${a !== '—' ? `<line x1="${212 - a.length * 4}" y1="${y + 6}" x2="${212 + a.length * 4}" y2="${y + 6}" stroke="var(--red)" stroke-width="1.6"/>` : ''}${T(311, y + 11, b, 13, 'font-weight:800;fill:var(--ok)')}`; }).join(''));
    },
    /* 事故责任与赔偿：交强险先赔 → 不足按过错；三种直接定责 */
    liability() {
      const step = (x, w, t, c) => `<rect x="${x}" y="8" width="${w}" height="34" rx="9" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="1.2"/>${T(x + w / 2, 29, t, 10, 'font-weight:700')}`;
      const arr = (x) => `<path d="M${x} 25 h12" stroke="currentColor" stroke-opacity=".4" stroke-width="2" marker-end="url(#ilah2)"/>`;
      const rule = (y, k, v, c) => `<rect x="4" y="${y}" width="352" height="22" rx="7" fill="${c}" fill-opacity=".1"/>${TL(12, y + 15, k, 10, 'font-weight:600')}<text x="348" y="${y + 15}" font-size="10.5" text-anchor="end" font-weight="800" fill="${c}" style="${F}">${v}</text>`;
      return svg(360, 132, `<defs><marker id="ilah2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="currentColor" fill-opacity=".5"/></marker></defs>
        ${step(4, 84, '事故造成损失', 'var(--ink-dim)')}${arr(92)}${step(108, 116, '交强险限额内先赔', 'var(--brand)')}${arr(228)}${step(244, 112, '不足部分按过错担', 'var(--amber)')}
        ${rule(54, '逃逸 / 故意破坏、伪造现场', '全部责任', 'var(--red)')}${rule(80, '行人、非机动车一方没有过错', '机动车一方担责', 'var(--brand)')}${rule(106, '伤员昏迷', '侧卧防窒息 · 脊柱伤不乱搬', 'var(--ok)')}`);
    },
  };

  window.ILLUS = ILLUS;
})();
