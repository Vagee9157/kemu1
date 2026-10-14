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
    points_ladder() {
      const steps = [
        [12, 'var(--red)', ['酒驾', '事故逃逸致伤亡', '假牌套牌', '高速逆行倒车掉头', '高速超速 50%+', '超员 100%+', '买卖分']],
        [9, '#e8640c', ['高速违停', '遮挡 / 不挂号牌', '准驾不符', '7 座以上超员 50%']],
        [6, 'var(--amber)', ['闯红灯', '暂扣期间开车', '逃逸仅财损', '占应急车道行驶', '高速超速 20–50%']],
        [3, 'var(--brand)', ['打手持电话', '不让行人 / 校车', '加塞 / 逆行', '高速不按车道', '低于最低时速']],
        [1, 'var(--ok)', ['不系安全带', '灯光使用不当', '违反禁令标志', '不按规定会车', '摩托不戴头盔']],
      ];
      const W = 360, colW = 68, base = 88;
      return svg(W, 144, steps.map(([n, c, items], i) => {
        const x = 6 + i * (colW + 4), h = 22 + (4 - i) * 10;
        return `<rect x="${x}" y="${base - h}" width="${colW}" height="${h}" rx="6" fill="${c}"/>
          <text x="${x + colW / 2}" y="${base - h + 18}" font-size="15" text-anchor="middle" font-weight="800" fill="#fff" style="${F}">${n} 分</text>
          ${items.slice(0, 4).map((t, j) => T(x + colW / 2, base + 14 + j * 11, t, 7.5, 'opacity:.85')).join('')}`;
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
  };

  window.ILLUS = ILLUS;
})();
