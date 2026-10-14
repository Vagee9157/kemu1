/* 看图题图库：交通标志 / 标线 / 仪表指示灯 / 交警手势，全部是内联 SVG。
 * 每个目录项 { key, name, cat }，SVG 存进 SIGNS[key]，题目用 sign: key 引用。 */
(() => {
  const K = '#141414', W = '#ffffff', R = '#d7262b', B = '#1d4fb8', Y = '#f5c400', G = '#127a3a';
  const svg = (inner, vb = '0 0 100 100') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const st = (c = K, w = 6) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

  /* ---- 底板 ---- */
  const warn = (g) => svg(`<polygon points="50,5 97,90 3,90" fill="${Y}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><g transform="translate(0,6)">${g}</g>`);
  const ban = (g, slash = true) => svg(`<circle cx="50" cy="50" r="43" fill="${W}" stroke="${R}" stroke-width="9"/>${g}${slash ? `<line x1="22" y1="78" x2="78" y2="22" stroke="${R}" stroke-width="8"/>` : ''}`);
  const banRed = (g) => svg(`<circle cx="50" cy="50" r="46" fill="${R}"/>${g}`);
  const ind = (g) => svg(`<circle cx="50" cy="50" r="46" fill="${B}"/>${g}`);
  const indSq = (g) => svg(`<rect x="4" y="4" width="92" height="92" rx="6" fill="${B}"/>${g}`);
  const endSign = (g) => svg(`<circle cx="50" cy="50" r="44" fill="${W}" stroke="#9a9a9a" stroke-width="4"/>${g}<g stroke="${K}" stroke-width="3"><line x1="22" y1="84" x2="84" y2="22"/><line x1="16" y1="76" x2="76" y2="16"/><line x1="30" y1="90" x2="90" y2="30"/></g>`);
  const board = (bg, g, vb = '0 0 120 80') => svg(`<rect x="2" y="2" width="116" height="76" rx="7" fill="${bg}" stroke="${W}" stroke-width="3"/>${g}`, vb);

  /* ---- 常用图形 ---- */
  const arrowUp = (c = K, x = 50, y1 = 82, y2 = 22, w = 9) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 + 10}" ${st(c, w)}/><polygon points="${x},${y2} ${x - 12},${y2 + 16} ${x + 12},${y2 + 16}" fill="${c}"/>`;
  const turnArrow = (c, dir) => { // 直角转弯箭头，dir=1 右 -1 左
    const s = dir === 1 ? '' : 'transform="scale(-1,1) translate(-100,0)"';
    return `<g ${s}><path d="M38 82 V48 Q38 36 50 36 H62" ${st(c, 9)}/><polygon points="78,36 60,24 60,48" fill="${c}"/></g>`;
  };
  const curve = (c, dir) => { const s = dir === 1 ? '' : 'transform="scale(-1,1) translate(-100,0)"'; return `<g ${s}><path d="M42 80 V52 Q42 42 54 42 H60" ${st(c, 8)}/><polygon points="74,42 58,32 58,52" fill="${c}"/></g>`; };
  const car = (c = K, x = 50, y = 56, s = 1) => `<g transform="translate(${x},${y}) scale(${s})" fill="${c}"><path d="M-30 6 L-24 -10 L-8 -18 H10 L24 -10 L30 6 V12 H-30 Z"/><circle cx="-18" cy="14" r="6" fill="${c}"/><circle cx="18" cy="14" r="6" fill="${c}"/></g>`;
  const carFront = (c = K, x = 50, y = 52, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-24 10 L-20 -8 Q-18 -18 -8 -18 H8 Q18 -18 20 -8 L24 10 V18 H-24 Z" fill="${c}"/><rect x="-16" y="-12" width="32" height="10" rx="2" fill="${W}"/></g>`;
  const person = (c = K, x = 50, y = 50, s = 1) => `<g transform="translate(${x},${y}) scale(${s})" fill="${c}"><circle cx="0" cy="-26" r="7"/><path d="M-6 -16 H6 L10 4 H4 L8 28 H-2 L-4 10 L-8 28 H-16 L-8 2 H-12 Z"/><path d="M4 -14 L18 -2 L14 2 L2 -6 Z"/></g>`;
  const bike = (c = K, x = 50, y = 56, s = 1) => `<g transform="translate(${x},${y}) scale(${s})" ${st(c, 5)}><circle cx="-18" cy="8" r="12"/><circle cx="18" cy="8" r="12"/><path d="M-18 8 L-6 -12 H10 L18 8 M-6 -12 L0 8 H-18 M4 -16 h10"/></g>`;
  const horn = (c = K) => `<path d="M26 40 H40 L58 26 V74 L40 60 H26 Z" fill="${c}"/><path d="M66 36 Q78 50 66 64 M72 28 Q90 50 72 72" ${st(c, 5)}/>`;
  const trafficLight = () => `<rect x="38" y="20" width="24" height="56" rx="5" fill="${K}"/><circle cx="50" cy="31" r="6" fill="${R}"/><circle cx="50" cy="48" r="6" fill="${Y}"/><circle cx="50" cy="65" r="6" fill="${G}"/>`;
  const txt = (t, x = 50, y = 62, size = 30, c = K, weight = 700) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="${c}" font-weight="${weight}" font-family="Arial,Helvetica,sans-serif">${t}</text>`;

  /* ================= 交通标志 ================= */
  const SIGN_CATALOG = [
    // —— 警告标志 ——
    { key: 'w_cross', name: '十字交叉路口', cat: 'warn', svg: warn(`<path d="M50 26 V78 M28 52 H72" ${st(K, 10)}/>`) },
    { key: 'w_t', name: 'T 形交叉路口', cat: 'warn', svg: warn(`<path d="M28 44 H72 M50 44 V80" ${st(K, 10)}/>`) },
    { key: 'w_y', name: 'Y 形交叉路口', cat: 'warn', svg: warn(`<path d="M50 80 V56 L32 36 M50 56 L68 36" ${st(K, 10)}/>`) },
    { key: 'w_round', name: '环形交叉路口', cat: 'warn', svg: warn(`<circle cx="50" cy="54" r="14" ${st(K, 7)}/><polygon points="50,26 42,38 58,38" fill="${K}"/><polygon points="30,70 44,72 36,58" fill="${K}"/><polygon points="70,70 56,72 64,58" fill="${K}"/>`) },
    { key: 'w_curve_r', name: '向右急弯路', cat: 'warn', svg: warn(curve(K, 1)) },
    { key: 'w_curve_l', name: '向左急弯路', cat: 'warn', svg: warn(curve(K, -1)) },
    { key: 'w_rev', name: '反向弯路', cat: 'warn', svg: warn(`<path d="M40 82 V66 Q40 58 48 58 H54 Q62 58 62 50 V44 Q62 36 54 36" ${st(K, 8)}/><polygon points="40,36 56,26 56,46" fill="${K}"/>`) },
    { key: 'w_cont', name: '连续弯路', cat: 'warn', svg: warn(`<path d="M44 82 V72 Q44 64 52 64 Q60 64 60 56 Q60 48 52 48 Q44 48 44 40 V36" ${st(K, 8)}/><polygon points="44,26 34,40 54,40" fill="${K}"/>`) },
    { key: 'w_up', name: '上陡坡', cat: 'warn', svg: warn(`<polygon points="22,76 78,76 78,40" fill="${K}"/>${txt('10%', 46, 72, 13, K)}`) },
    { key: 'w_down', name: '下陡坡', cat: 'warn', svg: warn(`<polygon points="22,76 78,76 22,40" fill="${K}"/>${txt('10%', 54, 72, 13, K)}`) },
    { key: 'w_narrow2', name: '两侧变窄', cat: 'warn', svg: warn(`<path d="M30 80 L40 48 V30 M70 80 L60 48 V30" ${st(K, 8)}/>`) },
    { key: 'w_narrow_r', name: '右侧变窄', cat: 'warn', svg: warn(`<path d="M34 80 V30 M70 80 L58 48 V30" ${st(K, 8)}/>`) },
    { key: 'w_bridge', name: '窄桥', cat: 'warn', svg: warn(`<path d="M28 80 V62 L38 50 V34 M72 80 V62 L62 50 V34" ${st(K, 8)}/>`) },
    { key: 'w_twoway', name: '双向交通', cat: 'warn', svg: warn(`<g transform="translate(-12,0)">${arrowUp(K, 50, 80, 30, 8)}</g><g transform="translate(12,0) rotate(180 50 55)">${arrowUp(K, 50, 80, 30, 8)}</g>`) },
    { key: 'w_bump', name: '路面不平', cat: 'warn', svg: warn(`<path d="M22 66 Q31 50 40 66 Q49 82 58 66 Q67 50 76 66" ${st(K, 7)}/><rect x="22" y="70" width="56" height="7" fill="${K}"/>`) },
    { key: 'w_slip', name: '易滑', cat: 'warn', svg: warn(`<g transform="rotate(-18 50 50)">${car(K, 50, 50, .9)}</g><path d="M26 78 Q34 70 40 78 M50 80 Q58 72 64 80" ${st(K, 5)}/>`) },
    { key: 'w_ped', name: '注意行人', cat: 'warn', svg: warn(person(K, 50, 56, 1)) },
    { key: 'w_child', name: '注意儿童', cat: 'warn', svg: warn(`${person(K, 40, 58, .8)}${person(K, 60, 60, .65)}`) },
    { key: 'w_bike', name: '注意非机动车', cat: 'warn', svg: warn(bike(K, 50, 58, .9)) },
    { key: 'w_rock', name: '注意落石', cat: 'warn', svg: warn(`<polygon points="30,80 30,36 48,80" fill="${K}"/><circle cx="56" cy="46" r="4" fill="${K}"/><circle cx="64" cy="58" r="5" fill="${K}"/><circle cx="58" cy="70" r="4" fill="${K}"/>`) },
    { key: 'w_rail_g', name: '有人看守铁路道口', cat: 'warn', svg: warn(`<path d="M24 46 H76 M24 60 H76 M24 74 H76 M34 40 V80 M50 40 V80 M66 40 V80" ${st(K, 5)}/>`) },
    { key: 'w_rail_n', name: '无人看守铁路道口', cat: 'warn', svg: warn(`<rect x="30" y="40" width="32" height="26" rx="4" fill="${K}"/><rect x="62" y="48" width="12" height="18" fill="${K}"/><circle cx="38" cy="72" r="5" fill="${K}"/><circle cx="54" cy="72" r="5" fill="${K}"/><circle cx="68" cy="72" r="5" fill="${K}"/>`) },
    { key: 'w_signal', name: '注意信号灯', cat: 'warn', svg: warn(`<g transform="translate(0,4) scale(.85) translate(9,8)">${trafficLight()}</g>`) },
    { key: 'w_slow', name: '慢行', cat: 'warn', svg: warn(txt('慢', 50, 76, 36)) },
    { key: 'w_work', name: '施工', cat: 'warn', svg: warn(`<circle cx="36" cy="34" r="6" fill="${K}"/><path d="M28 44 L44 42 L58 56 L52 62 L44 56 L40 80 H28 Z" fill="${K}"/><path d="M50 56 L66 70" ${st(K, 5)}/><path d="M62 68 L74 64 L78 76 L68 80 Z" fill="${K}"/><path d="M48 80 Q64 68 82 80 Z" fill="${K}"/>`) },
    { key: 'w_accident', name: '事故易发路段', cat: 'warn', svg: warn(`${car(K, 34, 62, .6)}${car(K, 66, 62, .6)}<path d="M50 36 L54 48 L62 46 L56 54 L60 62 L50 56 L40 62 L44 54 L38 46 L46 48 Z" fill="${K}"/>`) },
    { key: 'w_tunnel', name: '隧道', cat: 'warn', svg: warn(`<path d="M28 80 V52 Q28 34 50 34 Q72 34 72 52 V80 Z" fill="${K}"/><path d="M36 80 V54 Q36 42 50 42 Q64 42 64 54 V80 Z" fill="${Y}"/>`) },
    { key: 'w_water', name: '注意积水', cat: 'warn', svg: warn(`${car(K, 50, 48, .8)}<path d="M22 66 Q30 58 38 66 T54 66 T70 66 T86 66 M22 76 Q30 68 38 76 T54 76 T70 76 T86 76" ${st(K, 4)}/>`) },
    { key: 'w_village', name: '村庄', cat: 'warn', svg: warn(`<path d="M26 80 V56 L40 42 L54 56 V80 Z" fill="${K}"/><path d="M58 80 V62 L68 52 L78 62 V80 Z" fill="${K}"/>`) },
    { key: 'w_wind', name: '注意横风', cat: 'warn', svg: warn(`<path d="M30 80 V34" ${st(K, 6)}/><path d="M30 36 L74 44 L30 54 Z" fill="${K}"/>`) },
    { key: 'w_ice', name: '注意雨（雪）天', cat: 'warn', svg: warn(`<path d="M34 40 Q50 24 66 40 Q76 48 62 52 H36 Q24 48 34 40 Z" fill="${K}"/><path d="M40 60 L36 72 M50 60 L46 72 M60 60 L56 72" ${st(K, 5)}/>`) },
    { key: 'w_danger', name: '注意危险', cat: 'warn', svg: warn(`<rect x="45" y="30" width="10" height="32" rx="2" fill="${K}"/><circle cx="50" cy="72" r="5.5" fill="${K}"/>`) },
    { key: 'w_merge', name: '注意合流（右侧）', cat: 'warn', svg: warn(`<path d="M40 82 V30 M62 82 V66 Q62 56 52 52" ${st(K, 8)}/><polygon points="40,26 30,40 50,40" fill="${K}"/>`) },

    // —— 禁令标志 ——
    { key: 'p_noentry', name: '禁止驶入', cat: 'ban', svg: banRed(`<rect x="18" y="41" width="64" height="18" fill="${W}"/>`) },
    { key: 'p_novehicles', name: '禁止通行', cat: 'ban', svg: ban('', false) },
    { key: 'p_nomotor', name: '禁止机动车驶入', cat: 'ban', svg: ban(carFront(K, 50, 54, .9)) },
    { key: 'p_nonmotor', name: '禁止非机动车进入', cat: 'ban', svg: ban(bike(K, 50, 54, .85)) },
    { key: 'p_noped', name: '禁止行人进入', cat: 'ban', svg: ban(person(K, 50, 52, .9)) },
    { key: 'p_noleft', name: '禁止向左转弯', cat: 'ban', svg: ban(turnArrow(K, -1)) },
    { key: 'p_noright', name: '禁止向右转弯', cat: 'ban', svg: ban(turnArrow(K, 1)) },
    { key: 'p_nostraight', name: '禁止直行', cat: 'ban', svg: ban(arrowUp(K, 50, 80, 24)) },
    { key: 'p_nouturn', name: '禁止掉头', cat: 'ban', svg: ban(`<path d="M62 80 V44 Q62 30 48 30 Q34 30 34 44 V54" ${st(K, 9)}/><polygon points="34,70 22,52 46,52" fill="${K}"/>`) },
    { key: 'p_noovertake', name: '禁止超车', cat: 'ban', svg: ban(`${carFront(R, 36, 54, .75)}${carFront(K, 64, 54, .75)}`, false) },
    { key: 'p_endovertake', name: '解除禁止超车', cat: 'ban', svg: endSign(`${carFront('#9a9a9a', 36, 54, .75)}${carFront('#9a9a9a', 64, 54, .75)}`) },
    { key: 'p_nohorn', name: '禁止鸣喇叭', cat: 'ban', svg: ban(horn(K)) },
    { key: 'p_height', name: '限制高度 3.5 米', cat: 'ban', svg: ban(`<polygon points="50,20 40,32 60,32" fill="${K}"/><polygon points="50,80 40,68 60,68" fill="${K}"/>${txt('4.5m', 50, 58, 20)}`, false) },
    { key: 'p_width', name: '限制宽度 3 米', cat: 'ban', svg: ban(`<polygon points="20,50 32,40 32,60" fill="${K}"/><polygon points="80,50 68,40 68,60" fill="${K}"/>${txt('3m', 50, 58, 22)}`, false) },
    { key: 'p_weight', name: '限制质量 10 吨', cat: 'ban', svg: ban(txt('10t', 50, 61, 30), false) },
    { key: 'p_stop', name: '停车让行', cat: 'ban', svg: svg(`<polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="${R}" stroke="${W}" stroke-width="3"/>${txt('停', 50, 66, 44, W)}`) },
    { key: 'p_yield', name: '减速让行', cat: 'ban', svg: svg(`<polygon points="4,8 96,8 50,94" fill="${W}" stroke="${R}" stroke-width="9" stroke-linejoin="round"/>${txt('让', 50, 52, 30)}`) },
    { key: 'p_meet', name: '会车让行', cat: 'ban', svg: ban(`<g transform="translate(-12,0)">${arrowUp(R, 50, 76, 30, 8)}</g><g transform="translate(12,0) rotate(180 50 53)">${arrowUp(K, 50, 76, 30, 8)}</g>`, false) },
    { key: 'p_noparking', name: '禁止车辆临时或长时停放', cat: 'ban', svg: svg(`<circle cx="50" cy="50" r="42" fill="${B}" stroke="${R}" stroke-width="9"/><line x1="22" y1="22" x2="78" y2="78" stroke="${R}" stroke-width="9"/><line x1="78" y1="22" x2="22" y2="78" stroke="${R}" stroke-width="9"/>`) },
    { key: 'p_nolong', name: '禁止车辆长时停放', cat: 'ban', svg: svg(`<circle cx="50" cy="50" r="42" fill="${B}" stroke="${R}" stroke-width="9"/><line x1="22" y1="22" x2="78" y2="78" stroke="${R}" stroke-width="9"/>`) },
    { key: 'p_speed', name: '限制速度 60', cat: 'ban', svg: ban(txt('60', 50, 63, 36), false) },
    { key: 'p_endspeed', name: '解除限制速度', cat: 'ban', svg: endSign(txt('40', 50, 63, 36, '#9a9a9a')) },
    { key: 'p_noebike', name: '禁止电动自行车进入', cat: 'ban', svg: ban(`${bike(K, 50, 56, .8)}<path d="M44 30 L52 18 L50 28 L58 26 L48 40 L50 32 Z" fill="${K}"/>`) },
    { key: 'p_notruck', name: '禁止载货汽车驶入', cat: 'ban', svg: ban(`<path d="M24 62 V36 H58 V48 H74 L80 58 V62 Z" fill="${K}"/><circle cx="34" cy="66" r="6" fill="${K}"/><circle cx="68" cy="66" r="6" fill="${K}"/>`) },
    { key: 'p_check', name: '停车检查', cat: 'ban', svg: ban(txt('检查', 50, 60, 26), false) },

    // —— 指示标志 ——
    { key: 'i_straight', name: '直行', cat: 'ind', svg: ind(arrowUp(W, 50, 82, 18)) },
    { key: 'i_left', name: '向左转弯', cat: 'ind', svg: ind(turnArrow(W, -1)) },
    { key: 'i_right', name: '向右转弯', cat: 'ind', svg: ind(turnArrow(W, 1)) },
    { key: 'i_sr', name: '直行和向右转弯', cat: 'ind', svg: ind(`<g transform="translate(-10,0)">${arrowUp(W, 50, 82, 20, 8)}</g><path d="M40 60 H58" ${st(W, 8)}/><polygon points="76,60 58,48 58,72" fill="${W}"/>`) },
    { key: 'i_sl', name: '直行和向左转弯', cat: 'ind', svg: ind(`<g transform="translate(10,0)">${arrowUp(W, 50, 82, 20, 8)}</g><path d="M60 60 H42" ${st(W, 8)}/><polygon points="24,60 42,48 42,72" fill="${W}"/>`) },
    { key: 'i_lr', name: '向左和向右转弯', cat: 'ind', svg: ind(`<path d="M50 82 V54 Q50 44 40 44 H34 M50 54 Q50 44 60 44 H66" ${st(W, 8)}/><polygon points="20,44 36,34 36,54" fill="${W}"/><polygon points="80,44 64,34 64,54" fill="${W}"/>`) },
    { key: 'i_keep_r', name: '靠右侧道路行驶', cat: 'ind', svg: ind(`<path d="M34 82 V58 L62 38" ${st(W, 9)}/><polygon points="76,28 68,50 52,38" fill="${W}"/>`) },
    { key: 'i_keep_l', name: '靠左侧道路行驶', cat: 'ind', svg: ind(`<path d="M66 82 V58 L38 38" ${st(W, 9)}/><polygon points="24,28 32,50 48,38" fill="${W}"/>`) },
    { key: 'i_round', name: '环岛行驶', cat: 'ind', svg: ind(`<circle cx="50" cy="52" r="16" ${st(W, 7)}/><polygon points="50,22 41,34 59,34" fill="${W}"/><polygon points="28,70 43,72 35,58" fill="${W}"/><polygon points="72,70 57,72 65,58" fill="${W}"/>`) },
    { key: 'i_uturn', name: '允许掉头', cat: 'ind', svg: ind(`<path d="M62 80 V44 Q62 30 48 30 Q34 30 34 44 V54" ${st(W, 9)}/><polygon points="34,70 22,52 46,52" fill="${W}"/>`) },
    { key: 'i_motor', name: '机动车行驶', cat: 'ind', svg: ind(carFront(W, 50, 54, .9)) },
    { key: 'i_nonmotor', name: '非机动车行驶', cat: 'ind', svg: ind(bike(W, 50, 54, .85)) },
    { key: 'i_walk', name: '步行', cat: 'ind', svg: ind(person(W, 50, 52, .9)) },
    { key: 'i_horn', name: '鸣喇叭', cat: 'ind', svg: ind(horn(W)) },
    { key: 'i_minspeed', name: '最低限速 60', cat: 'ind', svg: ind(txt('60', 50, 63, 36, W)) },
    { key: 'i_oneway', name: '单行路（直行）', cat: 'ind', svg: indSq(`<path d="M50 82 V32" ${st(W, 10)}/><polygon points="50,14 34,36 66,36" fill="${W}"/>`) },
    { key: 'i_crossing', name: '人行横道', cat: 'ind', svg: indSq(`<polygon points="50,8 94,88 6,88" fill="${W}"/><g fill="${K}"><rect x="30" y="66" width="40" height="4"/><rect x="26" y="74" width="48" height="4"/><rect x="22" y="82" width="56" height="4"/></g>${person(K, 50, 58, .7)}`) },
    { key: 'i_bus', name: '公交线路专用车道', cat: 'ind', svg: indSq(`<rect x="22" y="30" width="56" height="34" rx="6" fill="${W}"/><rect x="28" y="36" width="44" height="12" fill="${B}"/><circle cx="34" cy="70" r="6" fill="${W}"/><circle cx="66" cy="70" r="6" fill="${W}"/>`) },
    { key: 'i_parking', name: '停车位', cat: 'ind', svg: indSq(txt('P', 50, 70, 60, W)) },

    // —— 指路 / 其他 ——
    { key: 'g_exit', name: '高速公路出口预告', cat: 'guide', svg: board(G, `${txt('出口', 60, 36, 18, W)}${txt('2 km', 60, 62, 16, W, 500)}`) },
    { key: 'g_charge', name: '电动汽车充电站', cat: 'guide', svg: board(B, `<rect x="40" y="22" width="26" height="40" rx="4" fill="${W}"/><rect x="48" y="16" width="10" height="8" fill="${W}"/><path d="M55 30 L46 46 H54 L50 58 L62 40 H54 Z" fill="${B}"/><path d="M70 40 H80 V56 Q80 64 72 64" ${st(W, 4)}/>`) },
    { key: 'g_service', name: '服务区', cat: 'guide', svg: board(G, `<path d="M30 24 V56 M24 24 V36 Q24 42 30 42 Q36 42 36 36 V24" ${st(W, 4)}/><path d="M48 24 Q58 24 58 36 Q58 44 50 46 V56" ${st(W, 4)}/><rect x="70" y="36" width="26" height="14" rx="3" fill="${W}"/><path d="M70 50 V58 M96 50 V58" ${st(W, 4)}/>`) },
    { key: 'm_accident', name: '前方交通事故（事故管理区）', cat: 'guide', svg: board('#e8609a', `${txt('前方事故', 60, 38, 17, W)}${txt('减速慢行', 60, 62, 15, W, 500)}`) },
    { key: 'g_tourist', name: '旅游区方向', cat: 'guide', svg: board('#7a4a1d', `${txt('某某风景区', 60, 48, 18, W)}`) },
    { key: 'g_hospital', name: '医院（告示标志）', cat: 'guide', svg: board('#2f6fbf', `<rect x="52" y="22" width="16" height="36" fill="${W}"/><rect x="42" y="32" width="36" height="16" fill="${W}"/>`) },
    // —— 补充常考 ——
    { key: 'w_narrow_l', name: '左侧变窄', cat: 'warn', svg: warn(`<path d="M66 80 V30 M30 80 L42 48 V30" ${st(K, 8)}/>`) },
    { key: 'w_icy', name: '注意路面结冰', cat: 'warn', svg: warn(`<g transform="translate(50,56)" ${st(K, 5)}><path d="M0 -26 V26 M-22 -13 L22 13 M-22 13 L22 -13"/><path d="M-7 -19 L0 -13 L7 -19 M-7 19 L0 13 L7 19 M-22 -1 L-14 -4 L-16 -13 M22 -1 L14 -4 L16 -13 M-22 1 L-14 4 L-16 13 M22 1 L14 4 L16 13"/></g>`) },
    { key: 'p_nosl', name: '禁止直行和向左转弯', cat: 'ban', svg: ban(`<g transform="translate(10,0)">${arrowUp(K, 50, 82, 20, 8)}</g><path d="M60 60 H42" ${st(K, 8)}/><polygon points="24,60 42,48 42,72" fill="${K}"/>`) },
    { key: 'p_nolr', name: '禁止向左向右转弯', cat: 'ban', svg: ban(`<path d="M50 82 V54 Q50 44 40 44 H34 M50 54 Q50 44 60 44 H66" ${st(K, 8)}/><polygon points="20,44 36,34 36,54" fill="${K}"/><polygon points="80,44 64,34 64,54" fill="${K}"/>`) },
    { key: 'p_axle', name: '限制轴重 10 吨', cat: 'ban', svg: ban(`${txt('10t', 50, 52, 24)}<rect x="24" y="60" width="52" height="6" fill="${K}"/><circle cx="32" cy="74" r="7" fill="${K}"/><circle cx="68" cy="74" r="7" fill="${K}"/>`, false) },
    { key: 'i_meet', name: '会车先行', cat: 'ind', svg: ind(`<g transform="translate(12,0)">${arrowUp(W, 50, 82, 20, 9)}</g><g transform="translate(-12,0) rotate(180 50 55)">${arrowUp(R, 50, 76, 34, 7)}</g>`) },
  ];

  /* ================= 道路标线 ================= */
  const road = (g, vb = '0 0 120 80') => svg(`<rect width="120" height="80" fill="#3d4148"/>${g}`, vb);
  const lane = (x, c, dash) => `<line x1="${x}" y1="0" x2="${x}" y2="80" stroke="${c}" stroke-width="4" ${dash ? 'stroke-dasharray="10 8"' : ''}/>`;
  const edges = `${lane(8, W, false)}${lane(112, W, false)}`;
  const arrowOnRoad = (path) => `<path d="${path}" fill="${W}"/>`;
  const LANE_CATALOG = [
    { key: 'l_white_dash', name: '白色虚线：同向车道分界，可越线变道', short: '白色虚线', svg: road(edges + lane(60, W, true)) },
    { key: 'l_white_solid', name: '白色实线：同向车道分界，不得越线', short: '白色实线', svg: road(edges + lane(60, W, false)) },
    { key: 'l_yellow_dash', name: '黄色虚线：对向车道分界，可越线超车、掉头', short: '黄色虚线', svg: road(edges + lane(60, Y, true)) },
    { key: 'l_yellow_solid', name: '黄色实线：对向车道分界，禁止跨越', short: '黄色实线', svg: road(edges + lane(60, Y, false)) },
    { key: 'l_double_yellow', name: '双黄实线：严禁跨越、压线', short: '双黄实线', svg: road(edges + lane(55, Y, false) + lane(65, Y, false)) },
    { key: 'l_yellow_mix', name: '黄色虚实线：实线一侧禁止越线，虚线一侧准许', short: '黄色虚实线', svg: road(edges + lane(55, Y, false) + lane(65, Y, true)) },
    { key: 'l_stop', name: '停止线：遇停止信号在线外停车', short: '停止线', svg: road(`${edges}${lane(60, Y, false)}<rect x="8" y="22" width="52" height="6" fill="${W}"/>`) },
    { key: 'l_yield_stop', name: '停车让行线（双白实线）', short: '停车让行线', svg: road(`${edges}${lane(60, Y, false)}<rect x="8" y="22" width="52" height="4" fill="${W}"/><rect x="8" y="30" width="52" height="4" fill="${W}"/>`) },
    { key: 'l_yield_slow', name: '减速让行线（双白虚线）', short: '减速让行线', svg: road(`${edges}${lane(60, Y, false)}<line x1="8" y1="24" x2="60" y2="24" stroke="${W}" stroke-width="4" stroke-dasharray="8 5"/><line x1="8" y1="32" x2="60" y2="32" stroke="${W}" stroke-width="4" stroke-dasharray="8 5"/>`) },
    { key: 'l_zebra', name: '人行横道线：减速，遇行人停车让行', short: '人行横道线', svg: road(`${edges}<g fill="${W}">${[18, 32, 46, 60, 74, 88].map((x) => `<rect x="${x}" y="28" width="9" height="26"/>`).join('')}</g>`) },
    { key: 'l_diamond', name: '人行横道预告标识（白色菱形）', short: '菱形预告标识', svg: road(`${edges}${lane(60, Y, false)}<polygon points="34,30 44,50 34,70 24,50" fill="${W}"/><polygon points="86,30 96,50 86,70 76,50" fill="${W}"/>`) },
    { key: 'l_grid', name: '黄色网状线：禁止以任何原因停车', short: '黄色网状线', svg: road(`${edges}<rect x="30" y="16" width="60" height="48" fill="none" stroke="${Y}" stroke-width="3"/><path d="M30 16 L90 64 M30 64 L90 16 M30 40 L60 16 M60 64 L90 40 M30 40 L60 64 M60 16 L90 40" stroke="${Y}" stroke-width="2.5"/>`) },
    { key: 'l_chevron', name: '导流线：不得压线或越线行驶', short: '导流线', svg: road(`${edges}<polygon points="60,6 100,74 20,74" fill="none" stroke="${W}" stroke-width="3"/><path d="M60 20 L45 52 M60 20 L75 52 M60 36 L52 62 M60 36 L68 62" stroke="${W}" stroke-width="2.5"/>`) },
    { key: 'l_rumble', name: '减速标线：提示降低车速', short: '减速标线', svg: road(`${edges}${lane(60, Y, false)}<g fill="${W}">${[12, 24, 36, 48].map((y) => `<rect x="10" y="${y}" width="12" height="4"/><rect x="98" y="${y}" width="12" height="4"/>`).join('')}</g>`) },
    { key: 'l_edge_yellow_solid', name: '路边黄色实线：禁止停车（含临时）', short: '路边黄实线', svg: road(`${lane(8, W, false)}${lane(60, W, true)}<line x1="110" y1="0" x2="110" y2="80" stroke="${Y}" stroke-width="5"/>`) },
    { key: 'l_edge_yellow_dash', name: '路边黄色虚线：禁止长时停车，可临时停', short: '路边黄虚线', svg: road(`${lane(8, W, false)}${lane(60, W, true)}<line x1="110" y1="0" x2="110" y2="80" stroke="${Y}" stroke-width="5" stroke-dasharray="10 8"/>`) },
    { key: 'l_arrow_s', name: '直行导向箭头', short: '直行箭头', svg: road(`${edges}${lane(60, W, true)}${arrowOnRoad('M34 70 V36 H28 L38 14 L48 36 H42 V70 Z')}`) },
    { key: 'l_arrow_u', name: '掉头导向箭头', short: '掉头箭头', svg: road(`${edges}${lane(60, W, true)}${arrowOnRoad('M42 70 V34 Q42 22 30 22 Q20 22 20 34 V40 H14 L24 56 L34 40 H28 V34 Q28 30 32 30 Q36 30 36 34 V70 Z')}`) },
    { key: 'l_arrow_sl', name: '直行或左转导向箭头', short: '直行或左转箭头', svg: road(`${edges}${lane(60, W, true)}${arrowOnRoad('M34 70 V36 H28 L38 14 L48 36 H42 V70 Z')}${arrowOnRoad('M34 48 H24 L22 54 L14 44 L22 34 L24 40 H34 Z')}`) },
    { key: 'l_bus', name: '公交专用车道', short: '公交专用道', svg: road(`${edges}${lane(60, W, false)}<text x="86" y="52" font-size="16" text-anchor="middle" fill="${W}" font-weight="700" font-family="sans-serif" writing-mode="tb">公交</text>`) },
    { key: 'l_wait', name: '左转弯待转区', short: '左转待转区', svg: road(`${edges}${lane(60, Y, false)}<rect x="8" y="22" width="52" height="6" fill="${W}"/><rect x="14" y="4" width="40" height="14" fill="none" stroke="${W}" stroke-width="2.5" stroke-dasharray="4 3"/>`) },
    { key: 'l_park', name: '停车位标线', short: '停车位', svg: road(`${lane(8, W, false)}${lane(60, W, true)}<g fill="none" stroke="${W}" stroke-width="2.5"><rect x="88" y="4" width="24" height="22"/><rect x="88" y="30" width="24" height="22"/><rect x="88" y="56" width="24" height="22"/></g>`) },
    { key: 'l_tidal', name: '可变导向车道线（锯齿线）', short: '可变导向车道', svg: road(`${edges}${lane(60, W, false)}<path d="M36 0 V80 M36 4 L42 4 M36 14 L42 14 M36 24 L42 24 M36 34 L42 34 M36 44 L42 44 M36 54 L42 54 M36 64 L42 64 M36 74 L42 74 M84 0 V80 M84 4 L78 4 M84 14 L78 14 M84 24 L78 24 M84 34 L78 34 M84 44 L78 44 M84 54 L78 54 M84 64 L78 64 M84 74 L78 74" stroke="${W}" stroke-width="3"/>`) },
  ];

  /* ================= 仪表指示灯 ================= */
  const panel = (g, color) => svg(`<rect width="100" height="100" rx="18" fill="#1c1f24"/><g fill="${color}" stroke="${color}">${g}</g>`);
  const CR = '#ff4d3d', CY = '#ffb400', CG = '#4ade80', CB = '#5aa9ff', CW = '#dfe6ee';
  const lamp = (c, down) => `<path d="M30 40 Q30 28 44 28 H56 Q66 28 66 40 V60 Q66 72 56 72 H44 Q30 72 30 60 Z" fill="${c}" stroke="none"/>${[36, 50, 64].map((y) => `<line x1="70" y1="${y}" x2="92" y2="${down ? y + 6 : y}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`).join('')}`;
  const DASH_CATALOG = [
    { key: 'd_oil', name: '机油压力报警灯', color: 'red', svg: panel(`<path d="M16 52 H66 L82 38 L88 44 L72 58 V70 Q72 76 66 76 H16 Z" stroke="none"/><path d="M30 52 V46 Q30 40 36 40 H48 Q54 40 54 46 V52" fill="none" stroke-width="5" stroke-linecap="round"/><circle cx="88" cy="66" r="4" stroke="none"/>`, CR) },
    { key: 'd_battery', name: '蓄电池充电指示灯', color: 'red', svg: panel(`<rect x="18" y="34" width="64" height="40" rx="4" fill="none" stroke-width="5"/><rect x="30" y="26" width="12" height="8" stroke="none"/><rect x="58" y="26" width="12" height="8" stroke="none"/><path d="M30 54 H44 M37 47 V61 M56 54 H70" stroke-width="5" stroke-linecap="round"/>`, CR) },
    { key: 'd_coolant', name: '冷却液温度报警灯', color: 'red', svg: panel(`<rect x="44" y="18" width="12" height="40" rx="6" fill="none" stroke-width="5"/><circle cx="50" cy="60" r="10" stroke="none"/><path d="M20 76 Q30 68 40 76 T60 76 T80 76 M20 88 Q30 80 40 88 T60 88 T80 88" fill="none" stroke-width="4" stroke-linecap="round"/>`, CR) },
    { key: 'd_brake', name: '制动系统故障灯', color: 'red', svg: panel(`<circle cx="50" cy="50" r="22" fill="none" stroke-width="5"/><path d="M18 36 Q10 50 18 64 M82 36 Q90 50 82 64" fill="none" stroke-width="5" stroke-linecap="round"/><rect x="46" y="36" width="8" height="18" rx="2" stroke="none"/><circle cx="50" cy="62" r="4" stroke="none"/>`, CR) },
    { key: 'd_parkbrake', name: '驻车制动（手刹）指示灯', color: 'red', svg: panel(`<circle cx="50" cy="50" r="22" fill="none" stroke-width="5"/><path d="M18 36 Q10 50 18 64 M82 36 Q90 50 82 64" fill="none" stroke-width="5" stroke-linecap="round"/><text x="50" y="59" font-size="26" text-anchor="middle" font-weight="700" font-family="Arial" stroke="none">P</text>`, CR) },
    { key: 'd_belt', name: '安全带未系提示灯', color: 'red', svg: panel(`<circle cx="50" cy="22" r="9" stroke="none"/><path d="M36 40 H64 L68 80 H32 Z" stroke="none"/><path d="M28 36 L72 78" stroke="#1c1f24" stroke-width="8" stroke-linecap="round"/><path d="M28 36 L72 78" stroke-width="3" stroke-linecap="round"/>`, CR) },
    { key: 'd_airbag', name: '安全气囊故障灯', color: 'red', svg: panel(`<circle cx="36" cy="26" r="8" stroke="none"/><path d="M28 40 H44 V62 Q44 70 36 70 H28 V86 H18 V40 Z" stroke="none"/><circle cx="66" cy="60" r="18" fill="none" stroke-width="5"/>`, CR) },
    { key: 'd_door', name: '车门未关提示灯', color: 'red', svg: panel(`<path d="M30 30 H70 Q76 30 76 36 V70 H24 V36 Q24 30 30 30 Z" fill="none" stroke-width="5"/><path d="M10 40 L24 36 M10 64 L24 70 M90 40 L76 36 M90 64 L76 70" stroke-width="4" stroke-linecap="round"/>`, CR) },
    { key: 'd_hazard', name: '危险报警闪光灯（双闪）', color: 'red', svg: panel(`<polygon points="50,16 88,82 12,82" fill="none" stroke-width="6" stroke-linejoin="round"/><polygon points="50,36 72,74 28,74" fill="none" stroke-width="5" stroke-linejoin="round"/>`, CR) },
    { key: 'd_engine', name: '发动机故障灯', color: 'yellow', svg: panel(`<path d="M30 42 H40 V34 H56 L62 42 H74 V66 H66 L60 74 H40 L34 66 H24 V50 H30 Z" stroke="none"/><rect x="12" y="52" width="12" height="8" stroke="none"/><rect x="42" y="26" width="10" height="8" stroke="none"/>`, CY) },
    { key: 'd_abs', name: 'ABS 防抱死系统故障灯', color: 'yellow', svg: panel(`<circle cx="50" cy="50" r="22" fill="none" stroke-width="5"/><path d="M18 36 Q10 50 18 64 M82 36 Q90 50 82 64" fill="none" stroke-width="5" stroke-linecap="round"/><text x="50" y="57" font-size="17" text-anchor="middle" font-weight="700" font-family="Arial" stroke="none">ABS</text>`, CY) },
    { key: 'd_tpms', name: '胎压报警灯', color: 'yellow', svg: panel(`<path d="M24 36 Q24 24 36 24 H64 Q76 24 76 36 V60 Q76 74 64 76 H36 Q24 74 24 60 Z" fill="none" stroke-width="6"/><path d="M18 76 Q50 92 82 76" fill="none" stroke-width="6" stroke-linecap="round"/><rect x="46" y="36" width="8" height="18" rx="2" stroke="none"/><circle cx="50" cy="63" r="4" stroke="none"/>`, CY) },
    { key: 'd_fuel', name: '燃油量不足指示灯', color: 'yellow', svg: panel(`<rect x="22" y="24" width="36" height="56" rx="4" stroke="none"/><rect x="28" y="30" width="24" height="16" fill="#1c1f24" stroke="none"/><path d="M62 40 H72 V66 Q72 74 80 74 Q86 74 86 66 V46 L78 38" fill="none" stroke-width="4" stroke-linecap="round"/>`, CY) },
    { key: 'd_eps', name: '转向助力系统故障灯', color: 'yellow', svg: panel(`<circle cx="46" cy="50" r="24" fill="none" stroke-width="5"/><circle cx="46" cy="50" r="7" stroke="none"/><path d="M22 50 H39 M53 50 H70 M46 57 V74" stroke-width="5"/><rect x="76" y="34" width="8" height="20" rx="2" stroke="none"/><circle cx="80" cy="64" r="4" stroke="none"/>`, CY) },
    { key: 'd_esp', name: '车身稳定系统（ESP）工作/故障灯', color: 'yellow', svg: panel(`${carFront(CY, 50, 48, 1)}<path d="M16 66 Q24 72 16 78 Q8 84 16 90 M84 66 Q76 72 84 78 Q92 84 84 90" fill="none" stroke-width="4" stroke-linecap="round"/>`, CY) },
    { key: 'd_washer', name: '玻璃清洗液不足指示灯', color: 'yellow', svg: panel(`<path d="M20 60 Q50 40 80 60 L74 78 H26 Z" fill="none" stroke-width="5" stroke-linejoin="round"/><path d="M50 28 V44 M38 36 L46 44 M62 36 L54 44" stroke-width="4" stroke-linecap="round"/>`, CY) },
    { key: 'd_lowbat', name: '动力电池电量低/故障（新能源车）', color: 'yellow', svg: panel(`<rect x="18" y="34" width="60" height="36" rx="4" fill="none" stroke-width="5"/><rect x="78" y="44" width="8" height="16" stroke="none"/><rect x="44" y="40" width="8" height="16" rx="2" stroke="none"/><circle cx="48" cy="63" r="4" stroke="none"/>`, CY) },
    { key: 'd_turtle', name: '动力受限（乌龟灯，新能源车）', color: 'yellow', svg: panel(`<ellipse cx="50" cy="54" rx="26" ry="16" stroke="none"/><circle cx="80" cy="50" r="7" stroke="none"/><path d="M28 68 L22 78 M44 70 L42 80 M58 70 L60 80 M72 66 L78 76" stroke-width="5" stroke-linecap="round"/><path d="M36 48 L50 42 L64 48" fill="none" stroke="#1c1f24" stroke-width="3"/>`, CY) },
    { key: 'd_high', name: '远光灯指示灯', color: 'blue', svg: panel(lamp(CB, false), CB) },
    { key: 'd_low', name: '近光灯指示灯', color: 'green', svg: panel(lamp(CG, true), CG) },
    { key: 'd_fog_f', name: '前雾灯指示灯', color: 'green', svg: panel(`${lamp(CG, true)}<path d="M76 30 Q68 50 76 70" fill="none" stroke="${CG}" stroke-width="4"/>`, CG) },
    { key: 'd_fog_r', name: '后雾灯指示灯', color: 'yellow', svg: panel(`${lamp(CY, false)}<path d="M76 30 Q68 50 76 70" fill="none" stroke="${CY}" stroke-width="4"/>`, CY) },
    { key: 'd_pos', name: '示廓灯（位置灯）指示灯', color: 'green', svg: panel(`<path d="M40 36 Q28 36 28 50 Q28 64 40 64 Z M60 36 Q72 36 72 50 Q72 64 60 64 Z" stroke="none"/><path d="M8 40 L22 44 M8 50 H22 M8 60 L22 56 M92 40 L78 44 M92 50 H78 M92 60 L78 56" stroke-width="3.5" stroke-linecap="round"/>`, CG) },
    { key: 'd_turn', name: '转向灯指示灯', color: 'green', svg: panel(`<polygon points="10,50 36,26 36,40 60,40 60,60 36,60 36,74" stroke="none"/><polygon points="90,50 64,26 64,40 62,40 62,60 64,60 64,74" fill="none" stroke-width="4" stroke-linejoin="round"/>`, CG) },
    { key: 'd_ready', name: 'READY 可行驶指示（新能源车）', color: 'green', svg: panel(`<text x="50" y="58" font-size="22" text-anchor="middle" font-weight="700" font-family="Arial" stroke="none">READY</text>`, CG) },
    { key: 'd_cruise', name: '定速巡航指示灯', color: 'green', svg: panel(`<circle cx="50" cy="56" r="26" fill="none" stroke-width="5" stroke-dasharray="6 8"/><path d="M50 56 L66 40" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="56" r="5" stroke="none"/>`, CG) },
  ];

  /* ================= 交警手势 ================= */
  // 正面图，按公安部手势示意图风格：深蓝制服、白帽、白手套。交警的左臂在画面右侧（x>50），右臂在画面左侧。
  const U = '#24508f', U2 = '#1a3c6e', SKIN = '#f3cda8', GL = '#ffffff';
  const officer = (arms) => svg(`
    <defs><marker id="ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#d7262b"/></marker></defs>
    <rect width="100" height="120" fill="#eef2f7"/>
    <ellipse cx="50" cy="113" rx="18" ry="3" fill="#c9d2dc"/>
    <!-- 腿 / 鞋 -->
    <path d="M41 70 H49 L48 108 H40 Z M51 70 H59 L60 108 H52 Z" fill="${U2}"/>
    <path d="M38 108 H49 V111 H37 Z M51 108 H62 V111 H51 Z" fill="#111"/>
    <!-- 上衣 -->
    <path d="M40 31 Q50 27 60 31 L63 72 H37 Z" fill="${U}"/>
    <path d="M37 72 H63 V75 H37 Z" fill="#111"/><rect x="48" y="71" width="4" height="4" fill="#d9b24a"/>
    <path d="M50 31 L46 40 L50 46 L54 40 Z" fill="#8fb0dd"/>
    <circle cx="50" cy="50" r="1.3" fill="#d9b24a"/><circle cx="50" cy="58" r="1.3" fill="#d9b24a"/>
    <!-- 反光背心边 -->
    <path d="M42 33 L45 68 M58 33 L55 68" stroke="#e8edf3" stroke-width="2.2" stroke-linecap="round"/>
    ${arms}
    <!-- 头 / 帽 -->
    <path d="M44 20 Q50 26 56 20 V14 H44 Z" fill="${SKIN}"/>
    <circle cx="50" cy="14" r="7.5" fill="${SKIN}"/>
    <path d="M41.5 13 Q50 2 58.5 13 Z" fill="#fff"/><rect x="41" y="12" width="18" height="3.5" rx="1" fill="${U2}"/>
    <path d="M42 15.5 H58 L56 18 H44 Z" fill="#111"/>
    <circle cx="50" cy="9.5" r="1.6" fill="#d9b24a"/>`, '0 0 100 120');
  // 手臂：从肩到手，白手套；palm=true 画成向前平伸（朝向观察者）的手掌
  const limb = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${U}" stroke-width="8" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e8edf3" stroke-width="1.2" stroke-dasharray="0 11 3 100" stroke-linecap="round"/>`;
  const glove = (x, y) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${GL}" stroke="#b9c3cf" stroke-width=".8"/>`;
  const palm = (x, y) => `<rect x="${x - 5.5}" y="${y - 7}" width="11" height="14" rx="3" fill="${GL}" stroke="#b9c3cf" stroke-width=".8"/>${[-4, -1.3, 1.4, 4.1].map((dx) => `<rect x="${x + dx - 1.1}" y="${y - 11}" width="2.2" height="5" rx="1" fill="${GL}" stroke="#b9c3cf" stroke-width=".6"/>`).join('')}`;
  const L = (x, y) => limb(59, 33, x, y) + glove(x, y);          // 左臂（画面右）
  const Rr = (x, y) => limb(41, 33, x, y) + glove(x, y);         // 右臂（画面左）
  const Lf = () => limb(59, 33, 62, 46) + palm(62, 50);          // 左臂向前平伸
  const Rf = () => limb(41, 33, 38, 46) + palm(38, 50);          // 右臂向前平伸
  const swing = (d) => `<path d="${d}" fill="none" stroke="#d7262b" stroke-width="2.4" stroke-dasharray="4 3" marker-end="url(#ah)"/>`;
  const GESTURE_CATALOG = [
    { key: 'h_stop', name: '停止信号', desc: '左臂由前向上直伸，掌心向前', svg: officer(Rr(37, 66) + limb(59, 33, 70, 16) + palm(70, 13)) },
    { key: 'h_straight', name: '直行信号', desc: '左臂向左平伸掌心向前；右臂向右平伸掌心向前，然后右臂向左前方摆动', svg: officer(L(93, 33) + Rr(7, 33) + swing('M10 41 Q28 54 46 48')) },
    { key: 'h_left', name: '左转弯信号', desc: '右臂向前平伸掌心向前；左臂与手掌平直向右前方摆动', svg: officer(Rf() + L(92, 44) + swing('M88 51 Q70 62 52 56')) },
    { key: 'h_left_wait', name: '左转弯待转信号', desc: '左臂向左下方平伸与身体成 45°，掌心向下，上下摆动', svg: officer(Rr(37, 66) + L(80, 60) + swing('M91 48 L91 64') + swing('M96 66 L96 50')) },
    { key: 'h_right', name: '右转弯信号', desc: '左臂向前平伸掌心向前；右臂与手掌平直向左前方摆动', svg: officer(Lf() + Rr(8, 44) + swing('M12 51 Q30 62 48 56')) },
    { key: 'h_lane', name: '变道信号', desc: '右臂向前平伸掌心向左，右臂向左水平摆动', svg: officer(Rf() + L(63, 66) + swing('M46 50 Q58 44 74 48')) },
    { key: 'h_slow', name: '减速慢行信号', desc: '右臂向右平伸掌心向下，右臂与手掌平直向下方摆动', svg: officer(Rr(7, 33) + L(63, 66) + swing('M12 40 L12 56')) },
    { key: 'h_pull', name: '示意车辆靠边停车信号', desc: '左臂由前向上直伸掌心向前；右臂向前平伸掌心向左，向左水平摆动', svg: officer(limb(59, 33, 70, 16) + palm(70, 13) + Rf() + swing('M46 50 Q58 44 74 48')) },
  ];

  /* ---- 合并进 SIGNS，并导出目录 ---- */
  // 有国标原图（assets/signs/<key>.svg，来自 Wikimedia Commons）的标志优先用原图，没有的用手画 svg
  const FILES = window.SIGN_FILES || {};
  [...SIGN_CATALOG, ...LANE_CATALOG, ...DASH_CATALOG, ...GESTURE_CATALOG].forEach((it) => {
    const f = FILES[it.key], d = (window.DASH_FILES || {})[it.key];
    if (d) { SIGNS[it.key] = `<span class="lamp lamp-${it.color}" role="img" aria-label="${it.name}" style="--m:url('${new URL('assets/dash/' + it.key + '.svg', document.baseURI).href}')"></span>`; return; }
    SIGNS[it.key] = f ? `<img src="assets/signs/${it.key}.svg${f.v ? '?v=' + f.v : ''}" alt="${it.name}" class="${f.wide ? 'wide' : ''}" loading="lazy">` : it.svg;
  });
  window.PICS = { SIGN_CATALOG, LANE_CATALOG, DASH_CATALOG, GESTURE_CATALOG };
})();
