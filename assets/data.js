/* 科目一内容数据
 * 依据：道路交通安全法、道路交通安全法实施条例、
 *       机动车驾驶证申领和使用规定（公安部令第162号，2022-04-01施行；经第172号修改，2025-01-01施行）、
 *       道路交通安全违法行为记分管理办法（公安部令第163号，2022-04-01施行）
 * 题目按公开题库常见题型整理改写，答案以法规原文为准。
 */

/* ---------- 交通标志 / 标线小图（纯 SVG，不依赖图片） ---------- */
const SIGNS = {
  stop: `<svg viewBox="0 0 100 100"><polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="#d7262b" stroke="#fff" stroke-width="3"/><text x="50" y="66" font-size="44" text-anchor="middle" fill="#fff" font-weight="700">停</text></svg>`,
  yield: `<svg viewBox="0 0 100 100"><polygon points="4,8 96,8 50,94" fill="#fff" stroke="#d7262b" stroke-width="9" stroke-linejoin="round"/><text x="50" y="52" font-size="30" text-anchor="middle" fill="#111" font-weight="700">让</text></svg>`,
  noEntry: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#d7262b"/><rect x="18" y="41" width="64" height="18" fill="#fff"/></svg>`,
  noVehicles: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#fff" stroke="#d7262b" stroke-width="9"/></svg>`,
  noParking: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#1d4fb8" stroke="#d7262b" stroke-width="9"/><line x1="22" y1="22" x2="78" y2="78" stroke="#d7262b" stroke-width="9"/><line x1="78" y1="22" x2="22" y2="78" stroke="#d7262b" stroke-width="9"/></svg>`,
  noLongParking: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#1d4fb8" stroke="#d7262b" stroke-width="9"/><line x1="22" y1="22" x2="78" y2="78" stroke="#d7262b" stroke-width="9"/></svg>`,
  maxSpeed: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#fff" stroke="#d7262b" stroke-width="9"/><text x="50" y="63" font-size="36" text-anchor="middle" fill="#111" font-weight="700">60</text></svg>`,
  minSpeed: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1d4fb8"/><text x="50" y="63" font-size="36" text-anchor="middle" fill="#fff" font-weight="700">60</text></svg>`,
  endSpeed: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#888" stroke-width="3"/><text x="50" y="63" font-size="36" text-anchor="middle" fill="#999" font-weight="700">40</text><g stroke="#222" stroke-width="3"><line x1="26" y1="80" x2="80" y2="26"/><line x1="20" y1="74" x2="74" y2="20"/><line x1="32" y1="86" x2="86" y2="32"/></g></svg>`,
  danger: `<svg viewBox="0 0 100 100"><polygon points="50,6 96,90 4,90" fill="#f5c400" stroke="#111" stroke-width="6" stroke-linejoin="round"/><rect x="45" y="34" width="10" height="32" rx="2" fill="#111"/><circle cx="50" cy="76" r="5.5" fill="#111"/></svg>`,
  sharpLeft: `<svg viewBox="0 0 100 100"><polygon points="50,6 96,90 4,90" fill="#f5c400" stroke="#111" stroke-width="6" stroke-linejoin="round"/><path d="M58 80 V58 Q58 44 44 44 H38" fill="none" stroke="#111" stroke-width="8"/><polygon points="26,44 40,34 40,54" fill="#111"/></svg>`,
  straight: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1d4fb8"/><rect x="44" y="40" width="12" height="42" fill="#fff"/><polygon points="50,16 70,44 30,44" fill="#fff"/></svg>`,
  guide: `<svg viewBox="0 0 120 80"><rect x="2" y="2" width="116" height="76" rx="8" fill="#127a3a" stroke="#fff" stroke-width="3"/><text x="60" y="34" font-size="18" text-anchor="middle" fill="#fff" font-weight="700">G4 京港澳</text><text x="60" y="60" font-size="14" text-anchor="middle" fill="#fff">出口 2 km</text></svg>`,
  tourist: `<svg viewBox="0 0 120 80"><rect x="2" y="2" width="116" height="76" rx="8" fill="#7a4a1d" stroke="#fff" stroke-width="3"/><text x="60" y="48" font-size="18" text-anchor="middle" fill="#fff" font-weight="700">某某风景区</text></svg>`,
};

// 标线小图：左右各一条车道，中间画分界线
function laneSvg(kind) {
  const W = '#ffffff', Y = '#f5c400';
  const dash = (x, c) => `<line x1="${x}" y1="0" x2="${x}" y2="60" stroke="${c}" stroke-width="4" stroke-dasharray="10 8"/>`;
  const solid = (x, c) => `<line x1="${x}" y1="0" x2="${x}" y2="60" stroke="${c}" stroke-width="4"/>`;
  const m = {
    whiteDash: dash(60, W), whiteSolid: solid(60, W),
    yellowDash: dash(60, Y), yellowSolid: solid(60, Y),
    doubleYellow: solid(55, Y) + solid(65, Y),
    yellowMix: solid(55, Y) + dash(65, Y),
  };
  return `<svg viewBox="0 0 120 60"><rect width="120" height="60" fill="#3d4148"/>${m[kind] || ''}</svg>`;
}

/* ---------- 考点大纲 ----------
 * hot: 2 = 必考高频，1 = 常考，0 = 了解
 * tip: 记忆口诀 / 一句话抓手
 */
const CHAPTERS = [
  {
    id: 'exam', name: '驾驶证与考试', icon: '🪪',
    intro: '每次必出 8–10 题，全是"数字题"，背准就是白送分。',
    points: [
      { t: '科目一怎么考', hot: 1, body: `
        <div class="illus" data-illus="exam_rules"></div>
        <ul>
          <li><b>100 题、45 分钟、90 分及格</b>，每题 1 分；通常是单选题 60 道 + 判断题 40 道，电脑上机、交卷即出成绩。</li>
          <li>一次考试不合格，<b>当场可补考一次</b>；补考仍不合格，本次考试结束，需重新预约。</li>
          <li>科目一合格后才能预约科目二、三；<b>学习驾驶证明有效期 3 年</b>，3 年内考不完，已考合格科目作废。</li>
          <li>科目二、科目三（道路驾驶）<b>每个科目预约考试次数不超过 5 次</b>，第 5 次仍不合格，已考合格的其他科目成绩作废。</li>
        </ul>`, tip: '100 题 45 分钟 90 分；学车证明 3 年；二三科各 5 次。' },
      { t: '准驾车型（C1 / C2 必背）', hot: 2, body: `
        <div class="illus" data-illus="license_classes"></div>
        <table>
          <tr><th>代号</th><th>车型</th><th>准驾的其他车型</th></tr>
          <tr><td>C1</td><td>小型汽车</td><td>C2、C3、C4</td></tr>
          <tr><td>C2</td><td>小型自动挡汽车</td><td>—</td></tr>
          <tr><td>C6</td><td>轻型牵引挂车</td><td>—（需单独考）</td></tr>
          <tr><td>B1</td><td>中型客车</td><td>C1、C2、C3、C4、M</td></tr>
          <tr><td>B2</td><td>大型货车</td><td>C1、C2、C3、C4、M</td></tr>
          <tr><td>A1</td><td>大型客车</td><td>A3、B1、B2、C1、C2、C3、C4、M</td></tr>
          <tr><td>A2</td><td>重型牵引挂车</td><td>B1、B2、C1、C2、C3、C4、C6、M</td></tr>
        </table>
        <p>驾驶<b>与准驾车型不符</b>的机动车：一次记 <b>9 分</b>。</p>`, tip: 'C1 能开 C2，C2 不能开 C1。' },
      { t: '申领条件与"多少年内不得申领"', hot: 2, body: `
        <div class="illus" data-illus="ban_years"></div>
        <ul>
          <li>申请小型汽车（C1/C2）：<b>年满 18 周岁、没有年龄上限</b>；70 周岁以上申领需通过记忆力、判断力、反应力等<b>能力测试</b>。</li>
          <li>普通二轮、三轮摩托车：18–<b>70</b> 周岁；大型客车、重型牵引挂车：22–<b>63</b> 周岁；中型客车、大型货车、城市公交车：20–63 周岁。63 周岁以上通过能力测试可申请延长大中型客货车准驾资格，最长 3 年（公安部令第 172 号，2025-01-01 起施行，老题库里的"60 周岁"已经过时）。</li>
          <li><b>隐瞒情况、提供虚假材料</b>申领：不予受理，<b>1 年内</b>不得再次申领。</li>
          <li>考试中<b>作弊</b>（替考等）：已考科目成绩作废，<b>1 年内</b>不得再次申领。</li>
          <li>以<b>欺骗、贿赂</b>等不正当手段取得驾驶证被撤销：<b>3 年内</b>不得再次申领。</li>
          <li>因其他情形驾驶证被<b>吊销</b>：<b>2 年内</b>不得重新申领。</li>
          <li><b>醉驾</b>、饮酒后驾驶营运车被吊销：<b>5 年内</b>不得；醉驾营运车：10 年内不得。</li>
          <li>交通肇事<b>逃逸构成犯罪</b>、饮酒/醉酒驾驶发生重大事故构成犯罪：<b>终生不得</b>重新取得。</li>
          <li>3 年内有<b>吸食、注射毒品</b>行为，或解除强制隔离戒毒措施未满 <b>3 年</b>：不得申请。</li>
          <li>有器质性心脏病、癫痫、美尼尔氏症、眩晕症、癔病、震颤麻痹、精神病、痴呆等妨碍安全驾驶疾病的：不得申请。</li>
        </ul>`, tip: '假材料 1 年、作弊 1 年、吊销 2 年、骗证 3 年、醉驾 5 年、醉驾营运 10 年、逃逸/酒驾重大事故终生。' },
      { t: '实习期', hot: 2, body: `
        <div class="illus" data-illus="probation"></div>
        <ul>
          <li>初次申领驾驶证后 <b>12 个月</b>为实习期，车身后部粘贴或悬挂统一式样的<b>实习标志</b>。</li>
          <li>实习期内上<b>高速公路</b>：应当由持相应或更高准驾车型驾驶证 <b>3 年以上</b>的驾驶人陪同。</li>
          <li>实习期内<b>不得驾驶</b>：公共汽车、营运客车、执行任务的警车/消防车/救护车/工程救险车，以及载有爆炸物品、易燃易爆化学物品、剧毒或放射性等危险物品的机动车；驾驶的机动车<b>不得牵引挂车</b>。</li>
          <li>实习期内记满 12 分：<b>注销</b>其实习的准驾车型驾驶资格。</li>
        </ul>`, tip: '实习 12 个月、贴标志；上高速要 3 年老司机陪。' },
      { t: '驾驶证有效期、换证、注销', hot: 1, body: `
        <div class="illus" data-illus="license_timeline"></div>
        <ul>
          <li>有效期分 <b>6 年、10 年、长期</b>。初领 6 年；6 年内每个记分周期都没记满 12 分 → 换 10 年；10 年内每个周期都没记满 → 换长期。</li>
          <li>有效期满前 <b>90 日内</b>申请换证。</li>
          <li>联系方式、住址等信息变化：<b>30 日内</b>备案。</li>
          <li>驾驶证遗失、损毁：向车管所申请<b>补领</b>。</li>
          <li><b>超过有效期 1 年以上</b>未换证：驾驶证被注销（2 年内可通过考科目一恢复）。</li>
          <li><b>70 周岁以上</b>的驾驶人：<b>每年</b>进行一次身体检查，在记分周期结束后 30 日内提交体检证明。</li>
        </ul>`, tip: '6-10-长期；换证提前 90 天；信息变更 30 天；过期 1 年注销。' },
    ],
  },
  {
    id: 'points', name: '记分与处罚', icon: '⚖️',
    intro: '最容易丢分的一章：同一类违法，"在哪条路""超多少"记分不一样。',
    points: [
      { t: '先辟谣：现行记分规则就是 2022 年那版', hot: 1, body: `
        <ul>
          <li>现行《道路交通安全违法行为记分管理办法》是公安部令第 163 号，<b>2022-04-01</b> 起施行，之后<b>没有再修订</b>。</li>
          <li>网上流传的"2026 年 6 月 1 日起新版记分""高速打电话记 9 分""占应急车道记 9 分罚 2000"等说法，是把 2022 年那次改动（取消 2 分档、新设 9 分档）翻炒出来的自媒体稿，<b>考试不按它</b>。</li>
          <li>正确答案仍是：开车打手持电话 3 分；高速占用应急车道<b>行驶 6 分</b>；高速违法<b>停车 9 分</b>。</li>
          <li>《道路交通安全法》的修订草案 2026-08 刚提请全国人大常委会一审，<b>尚未生效</b>，题库还没跟进。</li>
        </ul>`, tip: '记分规则 = 2022 版 163 号令，别信"2026 新规"。' },
      { t: '记分周期与满分', hot: 2, body: `
        <div class="illus" data-illus="points_ladder"></div>
        <ul>
          <li>记分周期 <b>12 个月</b>，满分 <b>12 分</b>，从初次领取驾驶证之日起连续计算。</li>
          <li>一次记分分值有 5 档：<b>12、9、6、3、1</b> 分。</li>
          <li>周期结束累积未满 12 分：本周期记分清除（有罚款逾期未缴的，对应记分转入下一周期）。</li>
          <li>情节轻微、给予<b>警告</b>处罚的，免予记分。</li>
        </ul>`, tip: '12 个月一周期，12 分封顶；12-9-6-3-1 五档。' },
      { t: '记满 12 分怎么办', hot: 1, body: `
        <div class="illus" data-illus="full_points_flow"></div>
        <ul>
          <li>交管部门<b>扣留驾驶证</b>，参加为期 <b>7 天</b>的道路交通安全法律法规学习（现场+网络累计不少于 5 天，其中现场不少于 2 天）。</li>
          <li>学习后参加<b>科目一考试</b>，不合格的 10 日后可预约重考。</li>
          <li>一个周期内<b>二次</b>记满 12 分或累积 24 分以上：还要考<b>科目三</b>（道路驾驶）。</li>
          <li><b>三次以上</b>记满或累积 36 分以上：科目二、科目三都要考。</li>
        </ul>`, tip: '满分 → 扣证 + 7 天学习 + 考科目一；两次加考科目三，三次科目二三都考。' },
      { t: '学习减分', hot: 1, body: `
        <div class="illus" data-illus="minus_points"></div>
        <ul>
          <li>处理完违法后累积未满 12 分，可参加交通安全教育<b>扣减记分</b>，一个周期最多扣减 <b>6 分</b>。</li>
          <li>网上学习 3 日内累计满 30 分钟且考试合格：扣 1 分；现场学习满 1 小时且考试合格：扣 2 分；参加交通安全公益活动满 1 小时：扣 1 分。</li>
          <li><b>实习期内</b>、驾驶证被扣留/暂扣期间、近 3 个周期有酒驾/逃逸/套牌/买卖分记录的，不能减分。</li>
        </ul>`, tip: '一个周期最多减 6 分；实习期不能减。' },
      { t: '一次记 12 分（小车相关）', hot: 2, body: `
        <div class="illus" data-illus="points_ladder:12"></div>
        <ul>
          <li><b>饮酒后</b>驾驶机动车。</li>
          <li>造成致人<b>轻伤以上或死亡</b>的事故后<b>逃逸</b>，尚不构成犯罪。</li>
          <li>使用<b>伪造、变造</b>的号牌/行驶证/驾驶证，或使用<b>其他机动车</b>的号牌、行驶证。</li>
          <li>驾驶其他载客汽车（如家用 5 座车）载人<b>超过核定人数 100% 以上</b>。</li>
          <li>驾驶小车在<b>高速公路、城市快速路</b>上超速 <b>50% 以上</b>。</li>
          <li>在<b>高速公路、城市快速路</b>上<b>倒车、逆行、穿越中央分隔带掉头</b>。</li>
          <li>代替实际驾驶人接受处罚和记分<b>牟取经济利益</b>（买卖分）。</li>
        </ul>`, tip: '酒、逃、假、超员翻倍、高速超速五成、高速倒逆掉、卖分。' },
      { t: '一次记 9 分', hot: 1, body: `
        <div class="illus" data-illus="points_ladder:9"></div>
        <ul>
          <li>在<b>高速公路或城市快速路</b>上<b>违法停车</b>。</li>
          <li>驾驶<b>未悬挂号牌</b>或<b>故意遮挡、污损号牌</b>的机动车上路。</li>
          <li>驾驶<b>与准驾车型不符</b>的机动车。</li>
          <li>驾驶 <b>7 座以上</b>载客汽车载人超员 <b>50% 以上未达 100%</b>。</li>
          <li><b>未取得校车驾驶资格</b>驾驶校车。</li>
        </ul>`, tip: '高速违停、遮挡号牌、准驾不符 → 9 分。' },
      { t: '一次记 6 分', hot: 2, body: `
        <div class="illus" data-illus="points_ladder:6"></div>
        <ul>
          <li><b>不按交通信号灯指示通行</b>（闯红灯）。</li>
          <li>驾驶证<b>被暂扣或扣留期间</b>驾驶机动车。</li>
          <li>造成<b>轻微伤或财产损失</b>的事故后逃逸，尚不构成犯罪。</li>
          <li>在<b>高速公路、城市快速路</b>上违法<b>占用应急车道行驶</b>。</li>
          <li>小车在<b>高速/快速路</b>上超速 <b>20% 以上未达 50%</b>；在普通道路超速 50% 以上。</li>
          <li>其他载客汽车载人超员 <b>50% 以上未达 100%</b>。</li>
        </ul>`, tip: '闯红灯 6 分；高速"违停 9、占应急车道行驶 6"别混。' },
      { t: '一次记 3 分', hot: 2, body: `
        <div class="illus" data-illus="points_ladder:3"></div>
        <ul>
          <li>在<b>高速公路或城市快速路</b>上<b>不按规定车道行驶</b>。</li>
          <li><b>不按规定超车、让行</b>，或在普通道路上<b>逆行</b>。</li>
          <li>遇前方停车排队或缓慢行驶时，<b>借道超车、占用对面车道、穿插等候车辆</b>。</li>
          <li>驾驶时<b>拨打、接听手持电话</b>等妨碍安全驾驶的行为。</li>
          <li>行经人行横道<b>不按规定减速、停车、避让行人</b>。</li>
          <li><b>不按规定避让校车</b>。</li>
          <li><b>不按规定安装号牌</b>上路。</li>
          <li>车辆故障、事故停车后，<b>不按规定使用灯光或设置警告标志</b>。</li>
          <li>在<b>高速公路</b>上行驶<b>低于规定最低时速</b>。</li>
          <li>小车在<b>普通道路</b>超速 <b>20% 以上未达 50%</b>；载人超员 20% 以上未达 50%。</li>
        </ul>`, tip: '打手机、不让行人、不让校车、加塞、高速低于最低速 → 3 分。' },
      { t: '一次记 1 分', hot: 1, body: `
        <div class="illus" data-illus="points_ladder:1"></div>
        <ul>
          <li><b>不按规定会车</b>，或在普通道路上<b>不按规定倒车、掉头</b>。</li>
          <li><b>不按规定使用灯光</b>。</li>
          <li>违反<b>禁令标志、禁止标线</b>指示。</li>
          <li>驾驶人<b>未按规定系安全带</b>。</li>
          <li>驾驶摩托车<b>不戴安全头盔</b>。</li>
          <li>驾驶<b>未按规定定期检验</b>的机动车上路（小车）。</li>
          <li>载货<b>长、宽、高超过规定</b>。</li>
        </ul>`, tip: '灯光、会车、禁令标志标线、安全带、头盔 → 1 分。' },
      { t: '酒驾与醉驾（必考）', hot: 2, body: `
        <div class="illus" data-illus="alcohol"></div>
        <table>
          <tr><th>情形</th><th>处罚</th></tr>
          <tr><td>饮酒驾驶<br><small>血液酒精 ≥20 mg/100mL 且 &lt;80</small></td><td>暂扣驾驶证 <b>6 个月</b>，罚款 <b>1000–2000 元</b>，记 12 分</td></tr>
          <tr><td>因饮酒驾驶被处罚后<b>再次</b>饮酒驾驶</td><td>10 日以下拘留，罚款 1000–2000 元，<b>吊销</b>驾驶证</td></tr>
          <tr><td>醉酒驾驶<br><small>≥80 mg/100mL</small></td><td>约束至酒醒，<b>吊销</b>，追究刑事责任，<b>5 年内</b>不得重新取得</td></tr>
          <tr><td>饮酒驾驶营运机动车</td><td><b>15 日</b>拘留，罚款 <b>5000 元</b>，吊销，5 年内不得重新取得</td></tr>
          <tr><td>醉酒驾驶营运机动车</td><td>吊销，刑责，<b>10 年内</b>不得重新取得，重新取得后不得驾驶营运车</td></tr>
          <tr><td>饮酒/醉酒驾驶发生重大事故构成犯罪</td><td>吊销，刑责，<b>终生</b>不得重新取得</td></tr>
        </table>`, tip: '20 饮酒 80 醉；饮酒扣 6 月罚 1–2 千；醉驾吊销 5 年。' },
      { t: '其他高频罚则', hot: 1, body: `
        <div class="illus" data-illus="fines"></div>
        <ul>
          <li>一般违反通行规定：<b>警告或 20–200 元</b>罚款。</li>
          <li>违法停车、驾驶人<b>不在现场</b>：20–200 元罚款，可<b>拖移车辆</b>。</li>
          <li>以下情形罚 <b>200–2000 元</b>：未取得驾驶证/驾驶证被吊销或暂扣期间驾驶（可并处 15 日以下拘留）；把车交给无证人员驾驶（可并处吊销）；超速 50% 以上（可并处吊销）；事故后逃逸尚不构成犯罪（可并处 15 日以下拘留）。</li>
          <li><b>伪造、变造或使用伪造、变造的号牌/行驶证/驾驶证</b>：收缴，扣留机动车，15 日以下拘留，罚款 <b>2000–5000 元</b>；使用其他车辆号牌、行驶证：扣留机动车，罚款 2000–5000 元。</li>
          <li>未投保<b>交强险</b>：扣留机动车，罚款为应缴保险费的 <b>2 倍</b>。</li>
          <li>处罚种类：<b>警告、罚款、暂扣或吊销驾驶证、拘留</b>。</li>
        </ul>`, tip: '无证、借车给无证、超速五成、逃逸 → 200–2000；假牌 → 2000–5000；没交强险 → 2 倍保费。' },
    ],
  },
  {
    id: 'vehicle', name: '机动车登记与上路条件', icon: '🚗',
    intro: '题少但稳定，记住"哪些情况要登记、多少天内"。',
    points: [
      { t: '上路必备', hot: 1, body: `
        <div class="illus" data-illus="must_have"></div>
        <ul>
          <li>机动车经<b>公安机关交通管理部门登记</b>后，方可上道路行驶；尚未登记的需临时上路，应取得<b>临时通行牌证</b>。</li>
          <li>上路应当悬挂机动车号牌，放置检验合格标志，随车携带<b>行驶证、驾驶证</b>（"交管 12123"上的电子驾驶证（2021 年底起）、电子行驶证（2024-12-02 起）已在全国推行，与纸质证件同等效力）；号牌应悬挂在车前、车后指定位置，保持清晰完整，<b>不得故意遮挡、污损</b>。</li>
          <li>未悬挂号牌、未放置检验合格标志、未随车携带行驶证/驾驶证：交警可<b>扣留机动车</b>。</li>
          <li>机动车应当依法投保<b>机动车交通事故责任强制保险（交强险）</b>。</li>
          <li>达到报废标准的机动车<b>不得上道路行驶</b>；拼装车、报废车禁止上路。</li>
        </ul>`, tip: '没登记不能上路；号牌前后都要挂，不能遮。' },
      { t: '变更登记与转移登记', hot: 1, body: `
        <div class="illus" data-illus="registration"></div>
        <ul>
          <li><b>改变车身颜色、更换发动机、更换车身或车架</b>、因质量问题更换整车、营运与非营运性质转换等：申请<b>变更登记</b>。</li>
          <li>机动车所有权转移（<b>过户</b>）：申请<b>转移登记</b>。</li>
          <li>擅自改变已登记的结构、构造或特征：不得上路，应恢复原状。</li>
          <li>机动车用作抵押：申请<b>抵押登记</b>。</li>
        </ul>`, tip: '车自己变了 → 变更；车换主人了 → 转移。' },
      { t: '安全技术检验周期（现行政策）', hot: 1, body: `
        <div class="illus" data-illus="inspection"></div>
        <table>
          <tr><th>车辆</th><th>检验周期</th></tr>
          <tr><td>私家车（9 座及以下非营运小微型载客汽车，面包车除外）</td><td><b>10 年内只上线 2 次</b>：第 6 年、第 10 年；第 2、4、8 年免上线，在"交管 12123"申领检验标志即可；<b>10 年以上每年 1 次</b></td></tr>
          <tr><td>摩托车</td><td>与私家车相同：10 年内只上线 2 次（第 6 年、第 10 年），其余年份每 2 年领一次检验标志；10 年以上每年 1 次</td></tr>
          <tr><td>营运载客汽车</td><td>5 年内每年 1 次；超过 5 年每 6 个月 1 次</td></tr>
          <tr><td>载货汽车、大中型非营运载客汽车</td><td>10 年内每年 1 次；超过 10 年每 6 个月 1 次</td></tr>
        </table>
        <p class="note">私家车这一行是公安部 2022-10-01 起实施的便民政策，"15 年以上半年一检"已取消。《实施条例》第 16 条的老口径（6 年内 2 年一检、超 6 年每年、超 15 年半年）题库已基本更新，遇到老题按"6 年内每 2 年 1 次"选。</p>`, tip: '私家车 10 年内只在第 6、10 年上线；10 年后每年一次。' },
    ],
  },
  {
    id: 'road', name: '道路通行规定', icon: '🛣️',
    intro: '分值最大的一章，约 30 题。速度、让行、停车三块最常考。',
    points: [
      { t: '没有限速标志时的最高车速', hot: 2, body: `
        <div class="illus" data-illus="speed_road"></div>
        
        <p>有限速标志、标线的，按标志标线行驶。</p>`, tip: '城 30/50，公路 40/70（先无线，后一车道）。' },
      { t: '最高不超过 30 km/h 的情形', hot: 2, body: `
        <div class="sign-row"><figure><div class="illus" data-sign="w_curve_r"></div><figcaption>急弯</figcaption></figure><figure><div class="illus" data-sign="w_bridge"></div><figcaption>窄桥</figcaption></figure><figure><div class="illus" data-sign="w_rail_n"></div><figcaption>铁路道口</figcaption></figure><figure><div class="illus" data-sign="w_narrow2"></div><figcaption>窄路</figcaption></figure><figure><div class="illus" data-sign="w_slip"></div><figcaption>泥泞易滑</figcaption></figure><figure><div class="illus" data-sign="w_icy"></div><figcaption>冰雪</figcaption></figure></div>
        <ul>
          <li>进出非机动车道。</li>
          <li>通过<b>铁路道口、急弯路、窄路、窄桥</b>。</li>
          <li>进行<b>掉头、转弯、下陡坡</b>。</li>
          <li>遇雾、雨、雪、沙尘、冰雹，<b>能见度在 50 米以内</b>。</li>
          <li>在<b>冰雪、泥泞</b>的道路上行驶。</li>
          <li><b>牵引</b>发生故障的机动车。</li>
        </ul>
        <p class="warn">易错：普通道路能见度 50 米以内是 <b>30</b>；高速公路能见度 50 米以内是 <b>20</b>。</p>`, tip: '"弯桥道口掉转坡，雾雪泥泞拖故障"——一律 30。' },
      { t: '超车', hot: 2, body: `
        <div class="illus" data-illus="overtake"></div>
        <div class="sign-row"><figure><div class="illus" data-sign="p_noovertake"></div><figcaption>禁止超车</figcaption></figure><figure><div class="illus" data-sign="p_endovertake"></div><figcaption>解除禁止超车</figcaption></figure></div>
        <p>超车时：提前开启<b>左转向灯</b>，变换使用远、近光灯或鸣喇叭，确认安全后<b>从前车左侧</b>超越，与被超车辆拉开必要距离后，开启右转向灯驶回原车道。</p>
        <p><b>不得超车</b>的情形：</p>
        <ul>
          <li>前车正在<b>左转弯、掉头、超车</b>。</li>
          <li>与对面来车<b>有会车可能</b>。</li>
          <li>前车为执行紧急任务的<b>警车、消防车、救护车、工程救险车</b>。</li>
          <li>行经<b>铁路道口、交叉路口、窄桥、弯道、陡坡、隧道、人行横道</b>、市区交通流量大的路段等没有超车条件的地方。</li>
        </ul>
        <p>被超车时：在条件许可的情况下，应当<b>降低速度、靠右让路</b>。</p>`, tip: '左侧超；前车转/掉/超不超，有会车不超，特种车不超，路口弯坡桥隧不超。' },
      { t: '会车', hot: 2, body: `
        <div class="illus" data-illus="meeting"></div>
        <ul>
          <li>没有中心隔离设施或中心线的道路：<b>减速靠右</b>，与其他车辆、行人保持安全距离。</li>
          <li>有障碍的路段：<b>无障碍的一方先行</b>；但有障碍的一方已驶入障碍路段而无障碍的一方未驶入时，有障碍的一方先行。</li>
          <li>狭窄的坡路：<b>上坡的一方先行</b>；但下坡的一方已行至中途而上坡的一方未上坡时，下坡的一方先行。</li>
          <li>狭窄的山路：<b>不靠山体的一方先行</b>。</li>
          <li>夜间会车：距对向来车 <b>150 米以外</b>改用近光灯；在窄路、窄桥与非机动车会车时使用近光灯。</li>
        </ul>`, tip: '无障碍先、上坡先、不靠山先；夜里 150 米换近光。' },
      { t: '路口通行与让行', hot: 2, body: `
        <div class="illus" data-illus="yield_rules"></div>
        <p><b>有信号灯的路口：</b></p>
        <ul>
          <li>划有导向车道的，按所需行进方向驶入导向车道。</li>
          <li>准备进入<b>环形路口</b>的，让<b>已在路口内</b>的机动车先行。</li>
          <li>向左转弯时，<b>靠路口中心点左侧</b>转弯。</li>
          <li>遇停止信号时，依次停在停止线以外；没有停止线的，停在路口以外。</li>
          <li>向右转弯遇同车道前车正在等候放行信号时，<b>依次停车等候</b>（不能绕过去）。</li>
        </ul>
        <p><b>没有信号灯、也没有交警的路口：</b></p>
        <ul>
          <li>有交通标志、标线控制的，让<b>优先通行</b>的一方先行。</li>
          <li>没有标志标线控制的，进入路口前<b>停车瞭望，让右方道路的来车先行</b>。</li>
          <li><b>转弯的</b>机动车让<b>直行的</b>车辆先行。</li>
          <li>相对方向行驶的<b>右转弯</b>机动车让<b>左转弯</b>车辆先行。</li>
        </ul>
        <p>前方路口交通阻塞时，<b>不得进入路口</b>，依次停在路口以外等候。车道减少的路段、路口遇停车排队时，<b>每车道一辆依次交替</b>驶入。</p>`, tip: '"右方先、直行先、左转先于对向右转、环内先"。' },
      { t: '掉头与倒车', hot: 1, body: `
        <div class="sign-row"><figure><div class="illus" data-sign="p_nouturn"></div><figcaption>禁止掉头</figcaption></figure><figure><div class="illus" data-sign="i_uturn"></div><figcaption>允许掉头</figcaption></figure><figure><div class="illus" data-sign="p_noleft"></div><figcaption>禁止左转（也不能掉头）</figcaption></figure></div>
        <ul>
          <li><b>不得掉头</b>：有禁止掉头或禁止左转弯标志、标线的地点，以及<b>铁路道口、人行横道、桥梁、急弯、陡坡、隧道</b>或容易发生危险的路段。没有禁止掉头标志的地方可以掉头，但不得妨碍正常行驶的其他车辆和行人。</li>
          <li><b>不得倒车</b>：<b>铁路道口、交叉路口、单行路、桥梁、急弯、陡坡、隧道</b>中。倒车应当察明车后情况，确认安全后倒车。</li>
          <li><b>高速公路</b>上一律不得倒车、逆行、掉头（记 12 分）。</li>
        </ul>`, tip: '"道口路口单行路，桥弯坡隧"不倒车；"禁左"的地方也不能掉头。' },
      { t: '停车规定（口 50 站 30）', hot: 2, body: `
        <div class="illus" data-illus="parking"></div>
        <ul>
          <li>设有禁停标志标线的路段、机动车道与非机动车道/人行道之间设有隔离设施的路段、<b>人行横道、施工地段</b>：不得停车。</li>
          <li><b>交叉路口、铁路道口、急弯路、宽度不足 4 米的窄路、桥梁、陡坡、隧道</b>以及距离上述地点 <b>50 米以内</b>：不得停车。</li>
          <li><b>公共汽车站、急救站、加油站、消防栓或消防队（站）门前</b>以及距离上述地点 <b>30 米以内</b>：除使用上述设施的以外，不得停车。</li>
          <li>车辆停稳前不得开车门和上下人员；开关车门不得妨碍其他车辆和行人。</li>
          <li>路边临时停车应<b>紧靠道路右侧</b>，驾驶人<b>不得离车</b>，上下人员或装卸物品后立即驶离。</li>
        </ul>`, tip: '"口 50 站 30"：路口道口弯桥坡隧 50 米，车站急救加油消防 30 米。' },
      { t: '灯光与喇叭', hot: 2, body: `
        <div class="illus" data-illus="lights"></div>
        <ul>
          <li><b>左转向灯</b>：向左转弯、向左变道、准备超车、驶离停车地点、掉头。</li>
          <li><b>右转向灯</b>：向右转弯、向右变道、超车完毕驶回原车道、靠路边停车。</li>
          <li>夜间无路灯、照明不良或遇雾雨雪等低能见度：开启<b>前照灯、示廓灯和后位灯</b>；同方向后车与前车近距离行驶时<b>不得使用远光灯</b>。</li>
          <li><b>雾天</b>：开启<b>雾灯和危险报警闪光灯</b>。</li>
          <li>夜间通过急弯、坡路、拱桥、人行横道或没有信号灯控制的路口：<b>交替使用远近光灯</b>示意。</li>
          <li>驶近急弯、坡道顶端等影响视距的路段，以及超车或遇紧急情况：减速慢行，并<b>鸣喇叭</b>示意。</li>
          <li>在<b>禁止鸣喇叭</b>的区域或路段不得鸣喇叭。</li>
          <li>进入<b>环形路口</b>不用开转向灯，驶出环形路口时开启<b>右转向灯</b>。</li>
        </ul>`, tip: '往左（含超车、起步、掉头）开左灯；往右（含回原道、靠边停）开右灯；雾天 = 雾灯 + 双闪。' },
      { t: '行人、校车、特种车', hot: 1, body: `
        <div class="sign-row"><figure><div class="illus" data-sign="w_ped"></div><figcaption>注意行人</figcaption></figure><figure><div class="illus" data-sign="w_child"></div><figcaption>注意儿童</figcaption></figure><figure><div class="illus" data-sign="i_crossing"></div><figcaption>人行横道（指示）</figcaption></figure><figure><div class="illus" data-sign="l_zebra"></div><figcaption>人行横道线</figcaption></figure></div>
        <ul>
          <li>行经<b>人行横道</b>：应当减速行驶；遇行人正在通过人行横道，应当<b>停车让行</b>。</li>
          <li>行经没有交通信号的道路，遇行人横过道路：应当<b>避让</b>。</li>
          <li>遇<b>盲人</b>（持白色手杖）、老人、儿童：减速慢行，必要时停车避让。</li>
          <li><b>校车</b>停靠并开启危险报警闪光灯上下学生时：同方向只有 1 条车道的，后方车辆<b>停车等待，不得超越</b>；有 2 条以上车道的，校车停靠车道后方的车辆应停车等待，相邻车道的车辆应减速通过。</li>
          <li>遇执行紧急任务的<b>警车、消防车、救护车、工程救险车</b>：应当<b>让行</b>，不得超越。</li>
          <li>前方车辆停车排队或缓慢行驶时：<b>不得借道超车、占用对面车道、穿插等候车辆</b>。</li>
        </ul>`, tip: '人行横道减速，有人就停；校车停，你也停。' },
      { t: '驾驶中禁止的行为', hot: 1, body: `
        <div class="illus" data-illus="fatigue"></div>
        <ul>
          <li>车门、车厢没有关好时行车。</li>
          <li>在驾驶室前后窗范围内悬挂、放置<b>妨碍视线</b>的物品。</li>
          <li><b>拨打接听手持电话、观看电视</b>等妨碍安全驾驶的行为。</li>
          <li><b>下陡坡时熄火或空挡滑行</b>。</li>
          <li>向道路上抛撒物品。</li>
          <li><b>连续驾驶超过 4 小时</b>未停车休息或停车休息<b>少于 20 分钟</b>。</li>
          <li>驾驶人、乘车人应当按规定使用<b>安全带</b>；摩托车驾驶人及乘坐人员应当戴<b>安全头盔</b>。</li>
        </ul>`, tip: '疲劳驾驶：4 小时要歇，歇够 20 分钟。' },
      { t: '铁路道口、漫水路、牵引', hot: 1, body: `
        <div class="sign-row"><figure><div class="illus" data-sign="w_rail_g"></div><figcaption>有人看守道口</figcaption></figure><figure><div class="illus" data-sign="w_rail_n"></div><figcaption>无人看守道口</figcaption></figure><figure><div class="illus" data-sign="w_water"></div><figcaption>注意积水</figcaption></figure></div>
        <div class="illus" data-illus="towing"></div>
        <ul>
          <li><b>铁路道口</b>：按信号或管理人员指挥通行；没有的，<b>减速或停车，确认安全后通过</b>。道口信号灯两个红灯交替闪烁或一个红灯亮：禁止通行。</li>
          <li><b>漫水路、漫水桥</b>：停车察明水情，确认安全后<b>低速通过</b>。</li>
          <li>牵引故障车：被牵引车除驾驶人外不得载人，不得拖带挂车；被牵引车宽度不得大于牵引车；软连接时两车距离<b>大于 4 米小于 10 米</b>；被牵引车制动失效的，使用<b>硬连接</b>；两车均开启危险报警闪光灯；最高车速 30 km/h。</li>
          <li>转向或照明、信号装置失效的故障车，应当使用<b>专用清障车</b>拖曳。摩托车不得牵引车辆或被其他车辆牵引。</li>
        </ul>`, tip: '软连接 4–10 米，制动失效用硬连接。' },
    ],
  },
  {
    id: 'highway', name: '高速公路', icon: '🚀',
    intro: '每次 6–8 题，数字密集：速度、车距、能见度三张表要背熟。',
    points: [
      { t: '哪些不能上高速', hot: 1, body: `
        <div class="sign-row"><figure><div class="illus" data-sign="g_exit"></div><figcaption>高速出口预告</figcaption></figure><figure><div class="illus" data-sign="i_minspeed"></div><figcaption>最低限速</figcaption></figure></div>
        <p>行人、非机动车、拖拉机、轮式专用机械车、铰接式客车、全挂拖斗车，以及其他<b>设计最高时速低于 70 公里</b>的机动车，不得进入高速公路。</p>
        <p>实习期内上高速需持证 3 年以上的驾驶人陪同。</p>`, tip: '设计时速低于 70 不能上高速。' },
      { t: '高速限速与车道最低速', hot: 2, body: `
        <div class="illus" data-illus="highway_lanes"></div>
        <ul>
          <li>最高车速不得超过 <b>120</b> km/h，最低车速不得低于 <b>60</b> km/h。</li>
          <li>小型载客汽车最高 120；其他机动车最高 <b>100</b>；摩托车最高 <b>80</b>。</li>
          <li>同方向 <b>2 条车道</b>：左侧车道最低 <b>100</b> km/h。</li>
          <li>同方向 3 条以上车道：最左侧车道最低 <b>110</b>，中间车道最低 <b>90</b>。</li>
          <li>道路限速标志标明的车速与上述规定不一致的，<b>按标志</b>行驶。</li>
        </ul>`, tip: '120 / 60；两车道左 100；三车道左 110 中 90。' },
      { t: '车距', hot: 2, body: `
        <div class="illus" data-illus="following"></div>
        <ul>
          <li>车速超过 <b>100</b> km/h：与同车道前车保持 <b>100 米以上</b>。</li>
          <li>车速低于 100 km/h：距离可适当缩短，但最小不得少于 <b>50 米</b>。</li>
        </ul>`, tip: '过百留百，不过百也不少于 50。' },
      { t: '低能见度（雾雨雪）', hot: 2, body: `
        <div class="illus" data-illus="visibility"></div>
        `, tip: '"200-60-100，100-40-50，50-20 赶快走"。' },
      { t: '进出高速与禁止行为', hot: 1, body: `
        <div class="illus" data-illus="ramp"></div>
        <ul>
          <li>从匝道驶入：开启<b>左转向灯</b>，在<b>加速车道</b>提速，在不妨碍已在高速公路内车辆正常行驶的情况下驶入车道。</li>
          <li>驶离：开启<b>右转向灯</b>，驶入<b>减速车道</b>，降低车速后驶离。</li>
          <li><b>错过出口</b>：继续向前行驶，从下一个出口驶出。</li>
          <li>不得：<b>倒车、逆行、穿越中央分隔带掉头</b>或在车道内停车；在匝道、加速车道或减速车道上超车；骑、轧车道分界线或在路肩上行驶；非紧急情况时在<b>应急车道</b>行驶或停车；试车或学习驾驶。</li>
        </ul>`, tip: '进高速开左灯走加速道；出高速开右灯走减速道；错过出口就往前。' },
      { t: '高速上故障或事故', hot: 2, body: `
        <div class="illus" data-illus="warning_triangle"></div>
        <ul>
          <li>立即开启<b>危险报警闪光灯</b>，尽量把车移到<b>应急车道</b>或右侧路肩。</li>
          <li>在来车方向 <b>150 米以外</b>设置警告标志（普通道路为车后 <b>50–100 米</b>），夜间还应开启示廓灯和后位灯。</li>
          <li>车上人员应当<b>迅速转移到右侧路肩上或应急车道内</b>（护栏外更安全），并迅速报警。</li>
          <li>不能正常行驶的，由<b>救援车、清障车</b>拖曳、牵引，不得用其他车辆随意拖拽。</li>
        </ul>`, tip: '高速 150 米外放三角牌，普通路 50–100 米；人往护栏外撤。' },
    ],
  },
  {
    id: 'signal', name: '信号灯、标志、标线、手势', icon: '🚦',
    intro: '看图题集中在这里。先按"颜色 + 形状"把大类认出来，题目就排除掉一大半。',
    points: [
      { t: '交通信号灯', hot: 2, body: `
        <div class="illus" data-illus="traffic_light"></div>
        <div class="sign-row"><figure><div class="illus" data-sign="w_signal"></div><figcaption>注意信号灯</figcaption></figure><figure><div class="illus" data-sign="d_hazard"></div><figcaption>双闪开关</figcaption></figure></div>
        <ul>
          <li><b>绿灯</b>：准许通行，但转弯的车辆不得妨碍被放行的直行车辆、行人通行。</li>
          <li><b>黄灯</b>：已越过停止线的车辆可以继续通行；未越过的应当停车。</li>
          <li><b>红灯</b>：禁止通行；但<b>右转弯</b>车辆在不妨碍被放行的车辆、行人通行的情况下可以通行（有右转箭头灯的按箭头灯）。</li>
          <li><b>黄灯持续闪烁</b>（闪光警告信号灯）：提示注意瞭望，确认安全后通过。</li>
          <li><b>车道信号灯</b>：绿色箭头灯亮，本车道准许按箭头方向通行；红色叉形灯或箭头灯亮，本车道禁止通行。</li>
          <li><b>交通警察现场指挥时</b>，按交警指挥通行（优先于信号灯）。</li>
        </ul>`, tip: '有交警听交警；红灯右转要"不妨碍"。' },
      { t: '交通标志：按颜色形状认大类', hot: 2, body: `
        <div class="sign-row">
          <figure>${SIGNS.danger}<figcaption>警告：黄底黑边黑图案，正三角形</figcaption></figure>
          <figure>${SIGNS.noVehicles}<figcaption>禁令：白底红圈，多为圆形</figcaption></figure>
          <figure>${SIGNS.straight}<figcaption>指示：蓝底白图案，圆形/方形</figcaption></figure>
          <figure>${SIGNS.guide}<figcaption>指路：高速为绿底，一般道路为蓝底</figcaption></figure>
          <figure>${SIGNS.tourist}<figcaption>旅游区：棕色底</figcaption></figure>
        </div>
        <p>特例：<b>停车让行</b>是红色八角形，<b>减速让行</b>是顶角朝下的倒三角形，二者都属于禁令标志。</p>
        <p>2022 年新国标（GB 5768.2-2022，2022-10-01 起）新增了一批标志，近两年题库开始出现：电动汽车充电站（蓝底指路类）、注意积水（黄三角警告）、禁止电动自行车驶入（红圈禁令）、<b>交通事故管理区</b>（<b>粉红色底</b>，提示前方正在处理事故，减速绕行）。</p>`, tip: '黄三角警告，红圈禁令，蓝色指示，绿色高速指路，棕色旅游，粉色事故管理区。' },
      { t: '最容易认错的几组标志', hot: 2, body: `
        <div class="sign-row">
          <figure>${SIGNS.stop}<figcaption>停车让行：必须停车瞭望</figcaption></figure>
          <figure>${SIGNS.yield}<figcaption>减速让行：减速或停车让干道先行</figcaption></figure>
          <figure>${SIGNS.noEntry}<figcaption>禁止驶入（红底白横杠）</figcaption></figure>
          <figure>${SIGNS.noVehicles}<figcaption>禁止通行（白底红圈，什么都没有）</figcaption></figure>
          <figure>${SIGNS.noParking}<figcaption>禁止停车（蓝底红叉）</figcaption></figure>
          <figure>${SIGNS.noLongParking}<figcaption>禁止长时停车（蓝底单斜杠）</figcaption></figure>
          <figure>${SIGNS.maxSpeed}<figcaption>限制速度：最高 60</figcaption></figure>
          <figure>${SIGNS.minSpeed}<figcaption>最低限速：不低于 60（蓝底）</figcaption></figure>
          <figure>${SIGNS.endSpeed}<figcaption>解除限制速度</figcaption></figure>
        </div>`, tip: '红圈白底 = 最高限速；蓝底白字 = 最低限速；叉 = 禁止停车，一道杠 = 禁止长时停车。' },
      { t: '道路标线', hot: 2, body: `
        <div class="lane-grid">
          <figure>${laneSvg('whiteDash')}<figcaption><b>白色虚线</b>：同向车道分界线，可越线变道</figcaption></figure>
          <figure>${laneSvg('whiteSolid')}<figcaption><b>白色实线</b>：同向车道分界线/路口导向车道线，不得越线</figcaption></figure>
          <figure>${laneSvg('yellowDash')}<figcaption><b>黄色虚线</b>：对向车道分界线，可越线超车、掉头</figcaption></figure>
          <figure>${laneSvg('yellowSolid')}<figcaption><b>黄色实线</b>：对向车道分界线，禁止跨越</figcaption></figure>
          <figure>${laneSvg('doubleYellow')}<figcaption><b>双黄实线</b>：严格禁止跨越、压线</figcaption></figure>
          <figure>${laneSvg('yellowMix')}<figcaption><b>黄色虚实线</b>：<b>实线一侧禁止</b>越线，虚线一侧准许</figcaption></figure>
        </div>
        <ul>
          <li>路口<b>双白实线</b>：停车让行线；<b>双白虚线</b>：减速让行线。</li>
          <li><b>白色菱形</b>：前方有人行横道（人行横道预告标识）。</li>
          <li><b>黄色网状线</b>：禁止以任何原因停车（路口、单位门口）。</li>
          <li><b>导流线</b>（白色 V 形或斜纹）：不得压线或越线行驶。</li>
          <li>路侧<b>黄色虚线</b>：禁止长时停车；路侧<b>黄色实线</b>：禁止停车（含临时停车）。</li>
        </ul>`, tip: '白分同向黄分对向，虚线能过实线不能；虚实线看自己这一侧。' },
      { t: '交警手势（8 种）', hot: 1, body: `
        <div class="gest-grid" data-gest></div>
        <ul>
          <li>共 <b>8 种</b>：停止、直行、左转弯、左转弯待转、右转弯、变道、减速慢行、示意车辆靠边停车。</li>
          <li>判断方向一律以<b>交警本人的左右</b>为准，不要按自己（驾驶人）视角。</li>
          <li>记法：<b>左转弯 = 右臂前伸 + 左臂摆</b>；<b>右转弯 = 左臂前伸 + 右臂摆</b>；一只手举高 = 停止，再加右臂前伸 = 靠边停车。</li>
        </ul>`, tip: '左转：右臂前伸 + 左臂摆；右转：左臂前伸 + 右臂摆。' },
    ],
  },
  {
    id: 'accident', name: '事故处理', icon: '🚑',
    intro: '题少但答案非常固定：先救人、再报警、能撤就撤。',
    points: [
      { t: '发生事故后的处置顺序', hot: 2, body: `
        <div class="illus" data-illus="accident_flow"></div>
        <ul>
          <li>立即<b>停车，保护现场</b>；开启危险报警闪光灯，按规定设置警告标志。</li>
          <li>造成人身伤亡：立即<b>抢救受伤人员</b>，并迅速报警；因抢救伤员变动现场的，应当<b>标明位置</b>。</li>
          <li>未造成人身伤亡，当事人对事实及成因无争议的：可以<b>即行撤离现场</b>，恢复交通，自行协商处理。</li>
          <li><b>仅造成轻微财产损失、基本事实清楚</b>的：当事人<b>应当先撤离现场再协商</b>处理（拍照取证后撤离）。</li>
          <li>自行协商需记录事故时间、地点、对方姓名联系方式、车牌号、驾驶证号、保险凭证号、碰撞部位，并共同签名。</li>
        </ul>`, tip: '有伤：救人 + 报警 + 标位置；轻微剐蹭：拍照后先撤再协商。' },
      { t: '责任与赔偿要点', hot: 1, body: `
        <ul>
          <li>当事人<b>逃逸</b>，或故意破坏、伪造现场、毁灭证据的，承担<b>全部责任</b>。</li>
          <li>事故造成损失，先由<b>交强险</b>在责任限额内赔偿；不足部分按过错责任承担。</li>
          <li>机动车与非机动车驾驶人、行人之间发生事故，非机动车一方/行人没有过错的，由机动车一方承担赔偿责任。</li>
          <li>伤员急救：先止血、包扎、固定，再搬运；昏迷伤员<b>侧卧</b>防止窒息；疑似脊柱骨折不要随意搬动，不能让伤员自己走动。</li>
        </ul>`, tip: '逃逸全责；交强险先赔。' },
    ],
  },
  {
    id: 'safe', name: '安全驾驶与紧急避险', icon: '🛟',
    intro: '常识题，答题原则：控制方向 > 减速 > 停车；绝大多数情况不选"紧急制动""猛打方向"。',
    points: [
      { t: '爆胎、转向失控、侧滑', hot: 2, body: `
        <div class="illus" data-illus="blowout"></div>
        <ul>
          <li><b>爆胎</b>：双手紧握方向盘保持方向，松抬加速踏板缓慢减速，<b>不要紧急制动</b>；车速降下来后再轻踩制动，停到路边。</li>
          <li><b>转向突然失控</b>：车辆尚能保持直线行驶时，不要紧急制动，轻踩制动使车缓慢停下；已偏离方向、事故无法避免时，<b>果断连续踩踏、放松制动踏板</b>，尽量缩短停车距离。</li>
          <li><b>侧滑</b>：松抬加速踏板，<b>向侧滑的一侧</b>（车尾甩向哪边）适当转动方向盘修正，不可紧急制动、猛打方向。</li>
        </ul>`, tip: '爆胎：握稳方向、松油门、别急刹。侧滑：往滑的方向回轮。' },
      { t: '制动失效', hot: 1, body: `
        <div class="illus" data-illus="brake_fail"></div>
        <ul>
          <li>保持冷静，<b>控制方向</b>；<b>抢挡减速</b>（由高速挡换入低速挡），利用发动机制动。</li>
          <li>配合<b>驻车制动</b>（手刹）缓慢拉紧，不可一下拉死，以免侧滑甩尾。</li>
          <li>下长坡制动失效：首先抢挡，利用道路边专设的<b>紧急避险车道</b>，或靠向山体、利用路边障碍物减速。</li>
        </ul>`, tip: '刹车失灵：先抢挡，再手刹，最后撞山/进避险车道。' },
      { t: '碰撞、翻车、落水、着火', hot: 1, body: `
        <div class="illus" data-illus="emergencies"></div>
        <ul>
          <li><b>正面碰撞</b>不可避免：撞击部位不在驾驶人一侧时，双手紧握方向盘，两腿向前蹬直，身体后倾；撞击部位靠近驾驶座时，<b>迅速躲离方向盘</b>，将两脚抬起。</li>
          <li><b>侧翻</b>：紧握方向盘，两脚勾住踏板，使身体固定，随车翻转；不要跳车。</li>
          <li><b>落水</b>：保持冷静，解开安全带；车门打不开时，等车内水位上升、内外压力平衡后再开门，或用安全锤敲击<b>侧窗玻璃边角</b>逃生。</li>
          <li><b>发动机着火</b>：迅速停车熄火，切断电源和油路，用灭火器或覆盖物灭火，<b>不要打开发动机舱盖</b>（防止进入大量空气助燃），人员撤离并报警。</li>
          <li>加油时：熄火，禁止吸烟、使用明火，不要使用手机。</li>
        </ul>`, tip: '着火别开机盖；落水砸侧窗边角；翻车不跳车。' },
      { t: '恶劣天气与特殊路况', hot: 1, body: `
        <div class="sign-row"><figure><div class="illus" data-sign="w_slip"></div><figcaption>易滑</figcaption></figure><figure><div class="illus" data-sign="w_ice"></div><figcaption>雨雪天</figcaption></figure><figure><div class="illus" data-sign="w_water"></div><figcaption>积水</figcaption></figure><figure><div class="illus" data-sign="w_wind"></div><figcaption>横风</figcaption></figure><figure><div class="illus" data-sign="w_tunnel"></div><figcaption>隧道</figcaption></figure><figure><div class="illus" data-sign="d_fog_f"></div><figcaption>前雾灯</figcaption></figure></div>
        <ul>
          <li><b>雨天</b>：降低车速，加大跟车距离；高速行驶时轮胎与路面间形成水膜产生"水滑"，应握稳方向盘、逐渐降速，<b>不要急踩制动</b>。</li>
          <li><b>雾天</b>：开启雾灯、近光灯、危险报警闪光灯，<b>不要使用远光灯</b>（雾中光线散射反而看不清），必要时鸣喇叭提示。</li>
          <li><b>冰雪路</b>：降低车速，加大车距，轻踩制动，尽量<b>沿着前车车辙</b>行驶，避免急转方向。</li>
          <li><b>涉水</b>：先停车察明水情，用低速挡平稳一次通过，途中不换挡、不停车；涉水后<b>间断轻踩制动踏板</b>，使制动器恢复效能。</li>
          <li><b>山区下长坡</b>：用低速挡，利用发动机制动控制车速，<b>不得空挡滑行或熄火滑行</b>。</li>
          <li><b>隧道</b>：进入前减速、开启近光灯，隧道内不得超车、停车、倒车、掉头；出隧道注意横风和"白洞"效应（眩目）。</li>
          <li><b>夜间</b>：视线差，降低车速；跟车、会车不用远光灯；被对向远光晃眼时，减速、目视<b>右侧路边</b>，必要时停车。</li>
          <li>长时间高速行驶后易产生"<b>速度错觉</b>"，低估实际车速，应多看速度表。</li>
        </ul>`, tip: '雨天别急刹、雾天别远光、冰雪走车辙、涉水一次过、下坡别空挡。' },
      { t: '驾驶姿势与安全装置', hot: 1, body: `
        <div class="illus" data-illus="posture"></div>
        <ul>
          <li>握方向盘：左手在 <b>9–10 点</b>位置，右手在 <b>3–4 点</b>位置。</li>
          <li><b>安全带</b>：腰带系在髋骨部位，肩带斜跨肩部中央、不要压颈；安全气囊必须与安全带配合使用。</li>
          <li><b>头枕</b>：调整到头部（耳朵上沿/后脑中部）高度，追尾时保护颈椎。</li>
          <li><b>ABS</b>：紧急制动时<b>用力一脚踩到底</b>，不要反复点刹；ABS 防止车轮抱死，制动时仍能控制方向。</li>
          <li><b>儿童</b>：乘车应坐在后排，使用儿童安全座椅；<b>不要把后向式儿童座椅装在有安全气囊的副驾驶位</b>。</li>
          <li>起步前：检查车辆、环视四周，开启左转向灯，观察后方交通，确认安全后起步。</li>
        </ul>`, tip: 'ABS 一脚到底不松；儿童不坐副驾。' },
      { t: '仪表盘指示灯', hot: 1, body: `
        <div class="sign-row"><figure><div class="illus" data-sign="d_oil"></div><figcaption>机油压力</figcaption></figure><figure><div class="illus" data-sign="d_battery"></div><figcaption>充电</figcaption></figure><figure><div class="illus" data-sign="d_coolant"></div><figcaption>水温</figcaption></figure><figure><div class="illus" data-sign="d_brake"></div><figcaption>制动</figcaption></figure><figure><div class="illus" data-sign="d_belt"></div><figcaption>安全带</figcaption></figure><figure><div class="illus" data-sign="d_engine"></div><figcaption>发动机</figcaption></figure><figure><div class="illus" data-sign="d_abs"></div><figcaption>ABS</figcaption></figure><figure><div class="illus" data-sign="d_tpms"></div><figcaption>胎压</figcaption></figure><figure><div class="illus" data-sign="d_fuel"></div><figcaption>燃油</figcaption></figure><figure><div class="illus" data-sign="d_high"></div><figcaption>远光</figcaption></figure><figure><div class="illus" data-sign="d_low"></div><figcaption>近光</figcaption></figure><figure><div class="illus" data-sign="d_fog_f"></div><figcaption>前雾灯</figcaption></figure><figure><div class="illus" data-sign="d_fog_r"></div><figcaption>后雾灯</figcaption></figure><figure><div class="illus" data-sign="d_hazard"></div><figcaption>双闪</figcaption></figure></div>
        <p>先看颜色：<b class="c-red">红色</b> = 严重故障/危险，必须尽快停车；<b class="c-yel">黄色</b> = 故障或提醒，尽快检修；<b class="c-grn">绿色</b>/<b class="c-blu">蓝色</b> = 某装置正在工作。</p>
        <table>
          <tr><th>图案</th><th>含义</th></tr>
          <tr><td>油壶 + 油滴</td><td><b class="c-red">机油压力</b>报警</td></tr>
          <tr><td>蓄电池（＋ －）</td><td><b class="c-red">充电系统</b>故障（发电机不充电）</td></tr>
          <tr><td>温度计插在水波上</td><td><b class="c-red">冷却液温度</b>过高</td></tr>
          <tr><td>圆圈里一个"！"／（P）</td><td><b class="c-red">制动系统</b>故障／驻车制动未松</td></tr>
          <tr><td>坐着的人 + 斜带</td><td><b class="c-red">安全带</b>未系</td></tr>
          <tr><td>发动机外形</td><td><b class="c-yel">发动机故障</b></td></tr>
          <tr><td>圆圈里"ABS"</td><td><b class="c-yel">ABS</b> 故障</td></tr>
          <tr><td>轮胎截面里"！"</td><td><b class="c-yel">胎压</b>异常</td></tr>
          <tr><td>加油机</td><td><b class="c-yel">燃油不足</b></td></tr>
          <tr><td>灯 + 平直光线</td><td><b class="c-blu">远光灯</b>开启</td></tr>
          <tr><td>灯 + 向下斜光线</td><td><b class="c-grn">近光灯</b>开启</td></tr>
          <tr><td>灯光被波浪线穿过（光线朝左）</td><td><b class="c-grn">前雾灯</b>开启</td></tr>
          <tr><td>同上（光线朝右）</td><td><b class="c-yel">后雾灯</b>开启</td></tr>
          <tr><td>两个背对的小灯</td><td><b class="c-grn">示廓灯</b>（小灯）开启</td></tr>
          <tr><td>红色双三角</td><td><b class="c-red">危险报警闪光灯</b>（双闪）开关</td></tr>
          <tr><td>电池 + 闪电 / "READY"</td><td>新能源车：<b class="c-grn">READY</b> 亮表示<b>已上电可行驶</b>（电机没声音，别误以为没启动）</td></tr>
          <tr><td>电池里一个"！"</td><td><b class="c-yel">动力电池</b>故障或电量过低，尽快充电或检修</td></tr>
          <tr><td>乌龟图案</td><td><b class="c-yel">动力受限</b>（电量低/过热），车速会被限制</td></tr>
        </table>`, tip: '红停车、黄检修、绿蓝在工作；远光是蓝的。' },
    ],
  },
];

/* ---------- 数字速记（可遮住答案自测） ---------- */
const NUMBERS = [
  { g: '驾驶证', rows: [
    ['科目一题量 / 时长 / 及格', '100 题 / 45 分钟 / 90 分'],
    ['学习驾驶证明有效期', '3 年'],
    ['科目二、三每科预约考试次数', '最多 5 次'],
    ['实习期', '12 个月'],
    ['实习期上高速陪同人驾龄', '3 年以上'],
    ['驾驶证有效期', '6 年 / 10 年 / 长期'],
    ['换证', '有效期满前 90 日内'],
    ['信息变更备案', '30 日内'],
    ['过期未换证被注销', '超过有效期 1 年以上'],
    ['小车申请年龄', '18 周岁以上，无上限（70 周岁以上需能力测试）'],
    ['普通摩托车 / 大中型客货车 年龄上限', '70 / 63 周岁（2025 起）'],
    ['私家车上线检验', '第 6 年、第 10 年；10 年后每年'],
  ]},
  { g: '不得再申领', rows: [
    ['隐瞒情况、提供虚假材料', '1 年'],
    ['考试作弊', '1 年'],
    ['驾驶证被吊销（一般情形）', '2 年'],
    ['欺骗、贿赂取得驾驶证被撤销', '3 年'],
    ['吸毒或解除强制戒毒未满', '3 年'],
    ['醉驾 / 饮酒驾驶营运车被吊销', '5 年'],
    ['醉驾营运车被吊销', '10 年'],
    ['逃逸构成犯罪 / 酒驾重大事故构成犯罪', '终生'],
  ]},
  { g: '记分与酒驾', rows: [
    ['记分周期 / 满分', '12 个月 / 12 分'],
    ['一次记分档位', '12、9、6、3、1'],
    ['满 12 分学习天数', '7 天'],
    ['学习减分上限', '每周期 6 分'],
    ['饮酒驾驶血液酒精含量', '≥ 20 mg/100mL'],
    ['醉酒驾驶血液酒精含量', '≥ 80 mg/100mL'],
    ['饮酒驾驶处罚', '暂扣 6 个月，罚 1000–2000 元'],
    ['饮酒驾驶营运车', '拘留 15 日，罚 5000 元，吊销'],
    ['无证驾驶罚款', '200–2000 元，可拘留 15 日以下'],
    ['伪造变造号牌证件罚款', '2000–5000 元，拘留 15 日以下'],
    ['未买交强险罚款', '应缴保费的 2 倍'],
  ]},
  { g: '速度', rows: [
    ['城市道路 无中心线', '30 km/h'],
    ['公路 无中心线', '40 km/h'],
    ['城市道路 同向 1 条机动车道', '50 km/h'],
    ['公路 同向 1 条机动车道', '70 km/h'],
    ['弯桥道口、掉头转弯下陡坡、冰雪泥泞、牵引故障车', '30 km/h'],
    ['普通道路 能见度 50 米以内', '30 km/h'],
    ['高速 最高 / 最低', '120 / 60 km/h'],
    ['高速 小型载客汽车 / 其他机动车 / 摩托车', '120 / 100 / 80 km/h'],
    ['高速 同向 2 车道 左侧最低', '100 km/h'],
    ['高速 同向 3 车道 最左 / 中间最低', '110 / 90 km/h'],
    ['不能上高速的设计时速', '低于 70 km/h'],
  ]},
  { g: '距离', rows: [
    ['夜间会车改近光', '150 米以外'],
    ['路口、道口、急弯、窄路、桥梁、陡坡、隧道 禁停', '50 米以内'],
    ['公交站、急救站、加油站、消防栓 禁停', '30 米以内'],
    ['窄路宽度（禁停）', '不足 4 米'],
    ['普通道路 故障警告标志', '车后 50–100 米'],
    ['高速 故障警告标志', '来车方向 150 米以外'],
    ['高速车距 车速 > 100', '100 米以上'],
    ['高速车距 车速 ≤ 100', '不少于 50 米'],
    ['软连接牵引距离', '大于 4 米，小于 10 米'],
  ]},
  { g: '高速低能见度', rows: [
    ['能见度 < 200 米', '≤ 60 km/h，车距 ≥ 100 米'],
    ['能见度 < 100 米', '≤ 40 km/h，车距 ≥ 50 米，加开双闪'],
    ['能见度 < 50 米', '≤ 20 km/h，尽快从最近出口驶离'],
  ]},
  { g: '时间', rows: [
    ['连续驾驶不得超过', '4 小时'],
    ['停车休息不少于', '20 分钟'],
  ]},
];

/* 易混对比：一行一组，最容易张冠李戴 */
const CONFUSE = [
  ['能见度 50 米以内', '普通道路 30 km/h', '高速公路 20 km/h 并尽快驶离'],
  ['故障警告标志', '普通道路 车后 50–100 米', '高速公路 来车方向 150 米以外'],
  ['高速上违法', '违法停车 9 分', '占用应急车道行驶 6 分'],
  ['逃逸（尚不构成犯罪）', '致人轻伤以上或死亡 12 分', '轻微伤或财产损失 6 分'],
  ['小车超速（高速 / 快速路）', '20%–50% 记 6 分', '50% 以上记 12 分'],
  ['小车超速（普通道路）', '20%–50% 记 3 分', '50% 以上记 6 分'],
  ['会车先行', '狭窄坡路：上坡先行', '狭窄山路：不靠山体一方先行'],
  ['路口让行', '转弯让直行', '对向右转让左转'],
  ['限速标志', '白底红圈 = 最高限速', '蓝底白字 = 最低限速'],
  ['禁止停车类', '红叉 = 禁止停车', '单斜杠 = 禁止长时停车'],
  ['让行线 / 标志', '停车让行：八角形 / 双白实线', '减速让行：倒三角 / 双白虚线'],
  ['路侧黄线', '黄色虚线 = 禁止长时停车', '黄色实线 = 禁止停车'],
  ['酒精含量', '≥ 20 饮酒驾驶', '≥ 80 醉酒驾驶'],
];

/* ---------- 经典题 ----------
 * type: judge（a: true/false）| single（a: 选项下标）
 * hot: 是否高频；ch: 对应章节 id；sign: 题图（SIGNS 的 key）
 */
const QUESTIONS = [
  // —— 驾驶证与考试 ——
  { ch: 'exam', hot: 1, type: 'single', q: '初次申领的机动车驾驶证的有效期为多少年？', opts: ['3 年', '5 年', '6 年', '12 年'], a: 2, exp: '驾驶证有效期分 6 年、10 年和长期，初次申领为 6 年。' },
  { ch: 'exam', hot: 1, type: 'single', q: '机动车驾驶人初次申领驾驶证后的实习期是多长时间？', opts: ['6 个月', '12 个月', '16 个月', '18 个月'], a: 1, exp: '初次申领驾驶证后 12 个月为实习期。' },
  { ch: 'exam', hot: 1, type: 'judge', q: '实习期内驾驶机动车上高速公路行驶，应当由持相应或者更高准驾车型驾驶证三年以上的驾驶人陪同。', a: true, exp: '原文规定，陪同人须持证 3 年以上，且准驾车型相同或更高。' },
  { ch: 'exam', hot: 0, type: 'judge', q: '实习期内的驾驶人可以驾驶执行任务的救护车。', a: false, exp: '实习期内不得驾驶公共汽车、营运客车以及执行任务的警车、消防车、救护车、工程救险车和载有危险物品的机动车。' },
  { ch: 'exam', hot: 1, type: 'single', q: '机动车驾驶人应当于驾驶证有效期满前多长时间内申请换证？', opts: ['30 日', '60 日', '90 日', '6 个月'], a: 2, exp: '有效期满前 90 日内申请换证。' },
  { ch: 'exam', hot: 0, type: 'single', q: '驾驶人联系电话、联系地址等信息发生变化，应当在多少日内向车管所备案？', opts: ['10 日', '15 日', '30 日', '60 日'], a: 2, exp: '信息发生变化的，应当在 30 日内备案。' },
  { ch: 'exam', hot: 1, type: 'single', q: '申请人以欺骗、贿赂等不正当手段取得驾驶证被依法撤销的，多长时间内不得再次申领？', opts: ['1 年', '2 年', '3 年', '5 年'], a: 2, exp: '欺骗、贿赂取得被撤销：3 年内不得再次申领。隐瞒/虚假材料是 1 年。' },
  { ch: 'exam', hot: 0, type: 'single', q: '申请人隐瞒有关情况或者提供虚假材料申领驾驶证的，多长时间内不得再次申领？', opts: ['6 个月', '1 年', '2 年', '3 年'], a: 1, exp: '隐瞒情况、提供虚假材料：不予受理，1 年内不得再次申领。' },
  { ch: 'exam', hot: 0, type: 'single', q: '驾驶证被吊销（一般情形）的，多长时间内不得重新申领？', opts: ['6 个月', '1 年', '2 年', '5 年'], a: 2, exp: '因一般违法被吊销，2 年内不得重新申领；醉驾等特殊情形年限更长。' },
  { ch: 'exam', hot: 1, type: 'judge', q: '持有小型汽车（C1）驾驶证的驾驶人，可以驾驶小型自动挡汽车。', a: true, exp: 'C1 准驾 C2、C3、C4。反过来 C2 不能开手动挡 C1。' },
  { ch: 'exam', hot: 1, type: 'judge', q: '持有小型自动挡汽车（C2）驾驶证的驾驶人，可以驾驶手动挡小型汽车。', a: false, exp: 'C2 只能驾驶小型自动挡汽车，驾驶 C1 车型属于准驾车型不符，记 9 分。' },
  { ch: 'exam', hot: 0, type: 'judge', q: '机动车驾驶证有效期满后超过一年以上未换证的，驾驶证将被注销。', a: true, exp: '超过有效期 1 年以上未换证，车管所注销驾驶证。' },
  { ch: 'exam', hot: 0, type: 'single', q: '按 2025 年起施行的规定，申请大型客车、重型牵引挂车驾驶证的年龄条件是？', opts: ['20–60 周岁', '22–60 周岁', '22–63 周岁', '18 周岁以上'], a: 2, exp: '公安部令第 172 号把大中型客货车年龄上限由 60 延长到 63 周岁，并可通过能力测试再延长最多 3 年。' },
  { ch: 'exam', hot: 0, type: 'judge', q: '有器质性心脏病、癫痫病、美尼尔氏症、眩晕症等妨碍安全驾驶疾病的人，不得申请机动车驾驶证。', a: true, exp: '这些疾病都属于法定不得申领的情形。' },

  // —— 记分与处罚 ——
  { ch: 'points', hot: 1, type: 'single', q: '道路交通安全违法行为累积记分的周期是多长时间？', opts: ['3 个月', '6 个月', '12 个月', '24 个月'], a: 2, exp: '记分周期为 12 个月，满分 12 分，从初次领证之日起连续计算。' },
  { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车在道路上饮酒后驾驶，一次记多少分？', opts: ['3 分', '6 分', '9 分', '12 分'], a: 3, exp: '饮酒后驾驶机动车，一次记 12 分。' },
  { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车不按交通信号灯指示通行（闯红灯），一次记多少分？', opts: ['1 分', '3 分', '6 分', '12 分'], a: 2, exp: '不按交通信号灯指示通行，一次记 6 分。' },
  { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车在高速公路上违法停车，一次记多少分？', opts: ['3 分', '6 分', '9 分', '12 分'], a: 2, exp: '在高速公路或城市快速路上违法停车，记 9 分。注意与"占用应急车道行驶 6 分"区分。' },
  { ch: 'points', hot: 0, type: 'single', q: '驾驶机动车在高速公路上倒车、逆行、穿越中央分隔带掉头的，一次记多少分？', opts: ['3 分', '6 分', '9 分', '12 分'], a: 3, exp: '高速公路、城市快速路上倒车、逆行、穿越中央分隔带掉头，记 12 分。' },
  { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车行驶时拨打、接听手持电话，一次记多少分？', opts: ['1 分', '2 分', '3 分', '9 分'], a: 2, exp: '拨打接听手持电话等妨碍安全驾驶的行为，记 3 分。网传"高速打电话记 9 分"不是现行规定。' },
  { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车行经人行横道，不按规定减速、停车、避让行人的，一次记多少分？', opts: ['1 分', '3 分', '6 分', '9 分'], a: 1, exp: '不礼让行人，记 3 分。' },
  { ch: 'points', hot: 1, type: 'single', q: '驾驶未悬挂机动车号牌或者故意遮挡、污损号牌的机动车上路，一次记多少分？', opts: ['3 分', '6 分', '9 分', '12 分'], a: 2, exp: '未挂号牌或故意遮挡、污损号牌，记 9 分；使用伪造变造号牌则是 12 分。' },
  { ch: 'points', hot: 1, type: 'single', q: '驾驶人未按规定系安全带，一次记多少分？', opts: ['1 分', '2 分', '3 分', '不记分'], a: 0, exp: '驾驶人未按规定系安全带，记 1 分。' },
  { ch: 'points', hot: 1, type: 'single', q: '驾驶小型汽车在高速公路上超过规定时速 50% 以上，一次记多少分？', opts: ['3 分', '6 分', '9 分', '12 分'], a: 3, exp: '小车在高速/快速路上超速 50% 以上记 12 分；20%–50% 记 6 分。' },
  { ch: 'points', hot: 0, type: 'single', q: '驾驶小型汽车在普通城市道路上超过规定时速 20% 以上未达到 50%，一次记多少分？', opts: ['1 分', '3 分', '6 分', '9 分'], a: 1, exp: '小车在高速、快速路以外的道路超速 20%–50%，记 3 分；50% 以上记 6 分。' },
  { ch: 'points', hot: 0, type: 'single', q: '机动车驾驶证被暂扣期间驾驶机动车，一次记多少分？', opts: ['3 分', '6 分', '9 分', '12 分'], a: 1, exp: '驾驶证被暂扣或扣留期间驾驶，记 6 分。' },
  { ch: 'points', hot: 0, type: 'single', q: '驾驶人在一个记分周期内累积记分达到 12 分的，应参加为期几天的道路交通安全法律法规学习？', opts: ['3 天', '5 天', '7 天', '15 天'], a: 2, exp: '满 12 分：扣留驾驶证，参加 7 天学习，再考科目一。' },
  { ch: 'points', hot: 0, type: 'judge', q: '一个记分周期内两次累积记分达到 12 分的，除考科目一外，还需要参加道路驾驶技能（科目三）考试。', a: true, exp: '二次满分或累积 24 分以上加考科目三；三次以上加考科目二和科目三。' },
  { ch: 'points', hot: 0, type: 'judge', q: '交通违法行为情节轻微，给予警告处罚的，免予记分。', a: true, exp: '记分管理办法第 28 条。' },
  { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车在高速公路上非紧急情况占用应急车道行驶，一次记多少分？', opts: ['3 分', '6 分', '9 分', '12 分'], a: 1, exp: '占用应急车道行驶记 6 分；高速违法停车才是 9 分。两者别混。' },
  { ch: 'points', hot: 1, type: 'single', q: '饮酒后驾驶机动车的（首次），处暂扣驾驶证多长时间？', opts: ['1 个月', '3 个月', '6 个月', '12 个月'], a: 2, exp: '饮酒后驾驶：暂扣 6 个月，并处 1000–2000 元罚款。' },
  { ch: 'points', hot: 1, type: 'single', q: '醉酒驾驶机动车，被吊销驾驶证后多长时间内不得重新取得驾驶证？', opts: ['1 年', '2 年', '5 年', '终生'], a: 2, exp: '醉驾：吊销，追究刑事责任，5 年内不得重新取得；醉驾营运车 10 年。' },
  { ch: 'points', hot: 0, type: 'single', q: '饮酒后或者醉酒驾驶机动车发生重大交通事故，构成犯罪的，由公安机关吊销驾驶证，多长时间内不得重新取得？', opts: ['5 年', '10 年', '20 年', '终生'], a: 3, exp: '构成犯罪的重大事故：终生不得重新取得。' },
  { ch: 'points', hot: 1, type: 'judge', q: '车辆驾驶人血液中的酒精含量大于或等于 20mg/100mL、小于 80mg/100mL 属于饮酒驾驶。', a: true, exp: '≥20 为饮酒驾驶，≥80 为醉酒驾驶。' },
  { ch: 'points', hot: 0, type: 'single', q: '未取得驾驶证驾驶机动车的，处多少元罚款？', opts: ['20–200 元', '200–2000 元', '1000–2000 元', '2000–5000 元'], a: 1, exp: '无证驾驶：200–2000 元罚款，可并处 15 日以下拘留。' },
  { ch: 'points', hot: 0, type: 'single', q: '使用伪造、变造的机动车号牌，除收缴、扣留车辆外，还会受到什么处罚？', opts: ['20–200 元罚款', '200–2000 元罚款', '15 日以下拘留，并处 2000–5000 元罚款', '只记 12 分'], a: 2, exp: '道交法第 96 条：15 日以下拘留并处 2000–5000 元罚款，同时记 12 分。' },
  { ch: 'points', hot: 0, type: 'single', q: '机动车所有人未按规定投保交强险的，处罚款的标准是？', opts: ['200 元', '1000 元', '应缴保险费的 2 倍', '应缴保险费的 5 倍'], a: 2, exp: '扣留机动车，处依照规定投保最低责任限额应缴纳保险费的 2 倍罚款。' },
  { ch: 'points', hot: 0, type: 'judge', q: '在一个记分周期内，驾驶人累积记分未满 12 分的，可以参加学习减分，最多可以扣减 12 分。', a: false, exp: '一个记分周期最多扣减 6 分；实习期内不能减分。' },

  // —— 登记 ——
  { ch: 'vehicle', hot: 0, type: 'judge', q: '尚未登记的机动车，需要临时上道路行驶的，应当取得临时通行牌证。', a: true, exp: '道交法第 8 条。' },
  { ch: 'vehicle', hot: 1, type: 'judge', q: '改变机动车车身颜色、更换发动机、车身或者车架的，应当申请变更登记。', a: true, exp: '这些都属于变更登记的情形；车辆过户是转移登记。' },
  { ch: 'vehicle', hot: 1, type: 'single', q: '按现行政策，非营运小微型载客汽车（私家车）10 年内需要上线检验几次？', opts: ['每年 1 次', '2 次：第 6 年和第 10 年', '3 次：第 4、6、10 年', '不用上线'], a: 1, exp: '第 2、4、8 年免上线申领检验标志，第 6、10 年上线；10 年以上每年 1 次。' },
  { ch: 'vehicle', hot: 0, type: 'single', q: '小型、微型非营运载客汽车 6 年以内每多长时间检验 1 次？（老题口径）', opts: ['每年', '每 2 年', '每 3 年', '每 6 个月'], a: 1, exp: '《实施条例》第 16 条原文：6 年内每 2 年 1 次。遇到这样的老题仍按它选。' },
  { ch: 'vehicle', hot: 0, type: 'judge', q: '驾驶机动车上道路行驶，未放置检验合格标志、未随车携带行驶证的，交通警察可以扣留机动车。', a: true, exp: '道交法第 95 条：可以扣留机动车，通知当事人提供相应牌证、标志或补办手续。' },

  // —— 道路通行 ——
  { ch: 'road', hot: 1, type: 'single', q: '在没有道路中心线的城市道路上，机动车最高速度不得超过多少？', opts: ['30 km/h', '40 km/h', '50 km/h', '70 km/h'], a: 0, exp: '没有中心线：城市道路 30，公路 40。' },
  { ch: 'road', hot: 1, type: 'single', q: '在同方向只有 1 条机动车道的公路上，机动车最高速度不得超过多少？', opts: ['40 km/h', '50 km/h', '60 km/h', '70 km/h'], a: 3, exp: '同方向 1 条机动车道：城市道路 50，公路 70。' },
  { ch: 'road', hot: 0, type: 'single', q: '驾驶机动车通过急弯路、窄路、窄桥时，最高速度不能超过多少？', opts: ['20 km/h', '30 km/h', '40 km/h', '50 km/h'], a: 1, exp: '弯、窄路、窄桥、铁路道口、掉头、转弯、下陡坡等情形最高 30。' },
  { ch: 'road', hot: 1, type: 'single', q: '在普通道路上遇雾、雨、雪等天气，能见度在 50 米以内时，最高速度不能超过多少？', opts: ['20 km/h', '30 km/h', '40 km/h', '50 km/h'], a: 1, exp: '普通道路是 30；高速公路能见度 50 米以内才是 20。这是高频易错题。' },
  { ch: 'road', hot: 0, type: 'single', q: '牵引发生故障的机动车时，最高车速不得超过多少？', opts: ['20 km/h', '30 km/h', '40 km/h', '50 km/h'], a: 1, exp: '牵引故障机动车属于最高 30 km/h 的情形。' },
  { ch: 'road', hot: 0, type: 'judge', q: '前车正在左转弯时，后车可以从前车右侧超越。', a: false, exp: '前车正在左转弯、掉头、超车时不得超车；而且超车应从左侧超越。' },
  { ch: 'road', hot: 0, type: 'single', q: '以下哪种情况可以超车？', opts: ['前车为执行紧急任务的救护车', '与对面来车有会车可能', '前车正常行驶，左侧车道无车，道路视线良好', '行经交叉路口'], a: 2, exp: '其余三项均为法定不得超车的情形。' },
  { ch: 'road', hot: 1, type: 'single', q: '在狭窄的坡路上会车，正确的通行原则是？', opts: ['下坡的一方先行', '上坡的一方先行', '空车让重车', '车速快的先行'], a: 1, exp: '狭窄坡路上坡的一方先行；但下坡一方已行至中途而上坡一方未上坡时，下坡一方先行。' },
  { ch: 'road', hot: 0, type: 'single', q: '在狭窄的山路上会车，哪一方先行？', opts: ['靠山体的一方', '不靠山体的一方', '上坡的一方', '先到的一方'], a: 1, exp: '不靠山体的一方（靠悬崖一侧）先行，靠山体一方让行。' },
  { ch: 'road', hot: 1, type: 'single', q: '夜间会车，应当在距对向来车多远以外改用近光灯？', opts: ['50 米', '100 米', '150 米', '200 米'], a: 2, exp: '夜间会车 150 米以外改用近光灯。' },
  { ch: 'road', hot: 1, type: 'single', q: '在没有交通信号灯、也没有交通标志标线控制的路口，应当如何通行？', opts: ['左方道路来车先行', '让右方道路的来车先行', '车速快的先行', '大车先行'], a: 1, exp: '进入路口前停车瞭望，让右方道路的来车先行。' },
  { ch: 'road', hot: 1, type: 'judge', q: '在没有方向指示信号灯的路口，转弯的机动车应当让直行的车辆先行。', a: true, exp: '转弯让直行；相对方向的右转弯让左转弯。' },
  { ch: 'road', hot: 0, type: 'judge', q: '相对方向行驶的右转弯机动车应当让左转弯的车辆先行。', a: true, exp: '实施条例第 51、52 条均有此规定。' },
  { ch: 'road', hot: 0, type: 'judge', q: '准备进入环形路口时，应当让已在路口内的机动车先行。', a: true, exp: '环内车辆优先。' },
  { ch: 'road', hot: 0, type: 'judge', q: '机动车遇前方路口交通阻塞时，可以先驶入路口内等候。', a: false, exp: '应当依次停在路口以外等候，不得进入路口，否则会造成路口锁死。' },
  { ch: 'road', hot: 1, type: 'single', q: '以下哪个地点可以掉头？', opts: ['铁路道口', '人行横道', '没有禁止掉头标志、不影响其他车辆和行人的路段', '隧道内'], a: 2, exp: '铁路道口、人行横道、桥梁、急弯、陡坡、隧道等不得掉头。' },
  { ch: 'road', hot: 0, type: 'judge', q: '机动车在有禁止左转弯标志的路口可以掉头。', a: false, exp: '有禁止掉头或禁止左转弯标志、标线的地点，不得掉头。' },
  { ch: 'road', hot: 0, type: 'single', q: '以下哪个地点可以倒车？', opts: ['单行路', '交叉路口', '隧道', '停车场内确认安全后'], a: 3, exp: '铁路道口、交叉路口、单行路、桥梁、急弯、陡坡、隧道中不得倒车。' },
  { ch: 'road', hot: 1, type: 'single', q: '在交叉路口、铁路道口、急弯路、桥梁、陡坡、隧道以及距离上述地点多远以内的路段不得停车？', opts: ['20 米', '30 米', '50 米', '100 米'], a: 2, exp: '"口 50"：路口、道口、急弯、窄路、桥梁、陡坡、隧道 50 米以内不得停车。' },
  { ch: 'road', hot: 1, type: 'single', q: '公共汽车站、急救站、加油站、消防栓或者消防队门前以及距离上述地点多远以内的路段，除使用上述设施的以外，不得停车？', opts: ['10 米', '20 米', '30 米', '50 米'], a: 2, exp: '"站 30"：车站、急救站、加油站、消防设施 30 米以内不得停车。' },
  { ch: 'road', hot: 0, type: 'judge', q: '在宽度不足 4 米的窄路上不得停车。', a: true, exp: '宽度不足 4 米的窄路及其 50 米以内不得停车。' },
  { ch: 'road', hot: 0, type: 'single', q: '超车完毕驶回原车道时，应当开启什么灯？', opts: ['左转向灯', '右转向灯', '危险报警闪光灯', '不用开灯'], a: 1, exp: '向右变道、超车完毕驶回原车道、靠路边停车，开右转向灯。' },
  { ch: 'road', hot: 0, type: 'single', q: '车辆驶离停车地点（起步）时，应当开启什么灯？', opts: ['左转向灯', '右转向灯', '危险报警闪光灯', '近光灯'], a: 0, exp: '驶离停车地点、掉头、准备超车、向左变道都开左转向灯。' },
  { ch: 'road', hot: 1, type: 'single', q: '在雾天行驶，应当开启哪些灯？', opts: ['远光灯', '雾灯和危险报警闪光灯', '只开示廓灯', '左转向灯'], a: 1, exp: '实施条例第 58 条：雾天行驶应当开启雾灯和危险报警闪光灯；不要用远光。' },
  { ch: 'road', hot: 0, type: 'judge', q: '夜间同方向近距离跟车行驶时，后车可以使用远光灯。', a: false, exp: '同方向后车与前车近距离行驶时不得使用远光灯，会晃到前车后视镜。' },
  { ch: 'road', hot: 0, type: 'judge', q: '夜间通过没有交通信号灯控制的路口时，应当交替使用远近光灯示意。', a: true, exp: '急弯、坡路、拱桥、人行横道、无信号灯路口，夜间交替使用远近光灯。' },
  { ch: 'road', hot: 1, type: 'judge', q: '驾驶机动车行经人行横道时，遇行人正在通过人行横道，应当停车让行。', a: true, exp: '行经人行横道减速，有行人通过时停车让行，否则记 3 分。' },
  { ch: 'road', hot: 0, type: 'single', q: '同方向只有一条机动车道，前方校车停车上下学生时，后方车辆应当怎么做？', opts: ['鸣喇叭催促', '从左侧绕行超越', '停车等待，不得超越', '减速通过'], a: 2, exp: '只有一条车道时停车等待不得超越；两条以上车道，相邻车道减速通过。' },
  { ch: 'road', hot: 0, type: 'judge', q: '前方机动车停车排队等候时，可以借对向车道超越。', a: false, exp: '不得借道超车、占用对面车道、穿插等候车辆，记 3 分。' },
  { ch: 'road', hot: 1, type: 'single', q: '连续驾驶机动车超过多少小时，应当停车休息且不少于 20 分钟？', opts: ['2 小时', '3 小时', '4 小时', '5 小时'], a: 2, exp: '连续驾驶不得超过 4 小时，停车休息不少于 20 分钟。' },
  { ch: 'road', hot: 0, type: 'judge', q: '驾驶机动车下陡坡时可以熄火或者空挡滑行以节省燃油。', a: false, exp: '下陡坡熄火或空挡滑行是法定禁止行为，会导致制动和转向助力失效、车速失控。' },
  { ch: 'road', hot: 0, type: 'single', q: '使用软连接牵引故障车时，牵引车与被牵引车之间的距离应当？', opts: ['小于 4 米', '大于 4 米小于 10 米', '大于 10 米', '没有要求'], a: 1, exp: '软连接距离大于 4 米小于 10 米；制动失效的要用硬连接。' },
  { ch: 'road', hot: 0, type: 'judge', q: '被牵引的故障车，除驾驶人外还可以搭载乘客。', a: false, exp: '被牵引的机动车除驾驶人外不得载人，不得拖带挂车。' },
  { ch: 'road', hot: 1, type: 'single', q: '普通道路上车辆发生故障难以移动时，应在车后多远处设置警告标志？', opts: ['10–20 米', '30–50 米', '50–100 米', '150 米以外'], a: 2, exp: '普通道路车后 50–100 米；高速公路来车方向 150 米以外。' },
  { ch: 'road', hot: 0, type: 'judge', q: '驶入环形路口时应开启右转向灯。', a: false, exp: '进入环形路口不用开启转向灯，驶出环形路口时开启右转向灯。' },

  // —— 高速 ——
  { ch: 'highway', hot: 1, type: 'single', q: '高速公路上，小型载客汽车最高车速不得超过多少？', opts: ['100 km/h', '110 km/h', '120 km/h', '130 km/h'], a: 2, exp: '小型载客汽车最高 120，其他机动车 100，摩托车 80。' },
  { ch: 'highway', hot: 1, type: 'single', q: '高速公路上机动车最低车速不得低于多少？', opts: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'], a: 1, exp: '最低不得低于 60；低于最低时速记 3 分。' },
  { ch: 'highway', hot: 1, type: 'single', q: '同方向有 3 条以上车道的高速公路，最左侧车道的最低车速是多少？', opts: ['90 km/h', '100 km/h', '110 km/h', '120 km/h'], a: 2, exp: '3 条以上车道：最左 110，中间 90；2 条车道左侧 100。' },
  { ch: 'highway', hot: 0, type: 'single', q: '同方向有 2 条车道的高速公路，左侧车道的最低车速是多少？', opts: ['60 km/h', '90 km/h', '100 km/h', '110 km/h'], a: 2, exp: '2 条车道左侧最低 100。' },
  { ch: 'highway', hot: 1, type: 'single', q: '在高速公路上车速超过 100 km/h 时，应与同车道前车保持多少米以上距离？', opts: ['50 米', '80 米', '100 米', '150 米'], a: 2, exp: '超过 100 时保持 100 米以上；低于 100 时不得少于 50 米。' },
  { ch: 'highway', hot: 1, type: 'single', q: '高速公路上能见度小于 200 米时，车速不得超过多少，与同车道前车保持多少距离？', opts: ['80 km/h，100 米', '60 km/h，100 米以上', '40 km/h，50 米以上', '20 km/h，尽快驶离'], a: 1, exp: '<200 米：60、100 米；<100 米：40、50 米；<50 米：20、尽快驶离。' },
  { ch: 'highway', hot: 0, type: 'single', q: '高速公路上能见度小于 50 米时，应当怎么做？', opts: ['开远光灯快速通过', '车速不超过 40 km/h', '车速不超过 20 km/h，从最近出口尽快驶离', '在应急车道停车等待'], a: 2, exp: '能见度小于 50 米：不超过 20 km/h，并从最近的出口尽快驶离高速公路。' },
  { ch: 'highway', hot: 0, type: 'single', q: '设计最高时速低于多少的机动车，不得进入高速公路？', opts: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'], a: 2, exp: '道交法第 67 条：设计最高时速低于 70 公里的机动车不得进入高速公路。' },
  { ch: 'highway', hot: 1, type: 'judge', q: '在高速公路上错过出口时，可以在确认安全后倒车回到出口。', a: false, exp: '应继续向前从下一个出口驶出。高速倒车记 12 分。' },
  { ch: 'highway', hot: 0, type: 'judge', q: '驾驶机动车从匝道驶入高速公路，应当开启左转向灯，在不妨碍已在高速公路内的机动车正常行驶的情况下驶入车道。', a: true, exp: '实施条例第 79 条。' },
  { ch: 'highway', hot: 1, type: 'single', q: '机动车在高速公路上发生故障，警告标志应设置在来车方向多远以外？', opts: ['50 米', '100 米', '150 米', '200 米'], a: 2, exp: '高速公路 150 米以外；车上人员迅速转移到右侧路肩或应急车道内并报警。' },
  { ch: 'highway', hot: 0, type: 'judge', q: '在高速公路上，非紧急情况可以在应急车道内短暂停车休息。', a: false, exp: '非紧急情况不得在应急车道行驶或停车。高速违停记 9 分，占用应急车道行驶记 6 分。' },
  { ch: 'highway', hot: 0, type: 'judge', q: '在高速公路的加速车道或减速车道上可以超车。', a: false, exp: '不得在匝道、加速车道或减速车道上超车。' },

  // —— 信号标志标线 ——
  { ch: 'signal', hot: 1, type: 'judge', q: '黄灯亮时，已越过停止线的车辆可以继续通行。', a: true, exp: '未越过停止线的应当停车。' },
  { ch: 'signal', hot: 1, type: 'judge', q: '红灯亮时，右转弯的车辆在不妨碍被放行的车辆、行人通行的情况下，可以通行。', a: true, exp: '设有右转箭头信号灯的，按箭头灯通行。' },
  { ch: 'signal', hot: 0, type: 'judge', q: '绿灯亮时，转弯的车辆可以优先于被放行的直行车辆和行人通行。', a: false, exp: '绿灯时转弯车辆不得妨碍被放行的直行车辆、行人通行。' },
  { ch: 'signal', hot: 0, type: 'single', q: '路口黄灯持续闪烁时，应当怎么做？', opts: ['禁止通行', '加速通过', '注意瞭望，确认安全后通过', '停车等待绿灯'], a: 2, exp: '闪光警告信号灯为持续闪烁的黄灯，提示注意瞭望，确认安全后通过。' },
  { ch: 'signal', hot: 0, type: 'judge', q: '路口有交通警察现场指挥时，应当按照交通警察的指挥通行。', a: true, exp: '交警指挥优先于信号灯和标志标线。' },
  { ch: 'signal', hot: 1, type: 'single', sign: 'stop', q: '这个标志是何含义？', opts: ['减速让行', '停车让行', '禁止通行', '会车让行'], a: 1, exp: '红色八角形是停车让行，必须在停止线以外停车瞭望。' },
  { ch: 'signal', hot: 1, type: 'single', sign: 'yield', q: '这个标志是何含义？', opts: ['停车让行', '注意危险', '减速让行', '禁止驶入'], a: 2, exp: '顶角朝下的倒三角形是减速让行。' },
  { ch: 'signal', hot: 1, type: 'single', sign: 'noEntry', q: '这个标志是何含义？', opts: ['禁止通行', '禁止驶入', '禁止停车', '限制宽度'], a: 1, exp: '红底白横杠是禁止驶入；白底红圈中间什么都没有是禁止通行。' },
  { ch: 'signal', hot: 0, type: 'single', sign: 'noVehicles', q: '这个标志是何含义？', opts: ['禁止通行', '禁止驶入', '解除禁令', '道路封闭'], a: 0, exp: '白底红圈、中间无图案，表示禁止一切车辆和行人通行。' },
  { ch: 'signal', hot: 1, type: 'single', sign: 'noParking', q: '这个标志是何含义？', opts: ['禁止长时停车', '禁止停车', '禁止通行', '禁止掉头'], a: 1, exp: '蓝底红圈红叉是禁止停车（临时停车也不行）；只有一道斜杠是禁止长时停车。' },
  { ch: 'signal', hot: 0, type: 'single', sign: 'noLongParking', q: '这个标志是何含义？', opts: ['禁止停车', '禁止长时停车', '禁止驶入', '禁止左转'], a: 1, exp: '单斜杠：禁止长时停车，允许临时停车上下人员、装卸物品。' },
  { ch: 'signal', hot: 1, type: 'single', sign: 'minSpeed', q: '这个标志是何含义？', opts: ['最高限速 60 km/h', '最低限速 60 km/h', '解除限速', '路段编号 60'], a: 1, exp: '蓝底白字为指示标志，表示最低限速；白底红圈为最高限速。' },
  { ch: 'signal', hot: 0, type: 'single', sign: 'maxSpeed', q: '这个标志是何含义？', opts: ['最高限速 60 km/h', '最低限速 60 km/h', '建议速度 60 km/h', '限重 60 吨'], a: 0, exp: '白底红圈黑字是限制速度（最高速度）。' },
  { ch: 'signal', hot: 1, type: 'single', q: '警告标志的颜色和形状是？', opts: ['蓝底白图案，圆形', '白底红圈，圆形', '黄底黑边黑图案，三角形', '绿底白字，长方形'], a: 2, exp: '警告：黄三角；禁令：红圈；指示：蓝色；高速指路：绿色。' },
  { ch: 'signal', hot: 0, type: 'single', q: '高速公路的指路标志是什么颜色？', opts: ['蓝底白字', '绿底白字', '棕底白字', '黄底黑字'], a: 1, exp: '高速公路和城市快速路指路标志为绿底，一般道路为蓝底，旅游区为棕底。' },
  { ch: 'signal', hot: 0, type: 'judge', q: '路中心的黄色虚实线，实线一侧的车辆禁止越线，虚线一侧的车辆准许越线。', a: true, exp: '看靠近自己一侧的线型。' },
  { ch: 'signal', hot: 0, type: 'judge', q: '路中心的双黄实线，在没有来车时可以越线超车。', a: false, exp: '双黄实线严格禁止跨越、压线。' },
  { ch: 'signal', hot: 0, type: 'judge', q: '白色虚线用于分隔同向行驶的车道，在保证安全的前提下可以越线变道。', a: true, exp: '白色实线不可越线。' },
  { ch: 'signal', hot: 1, type: 'single', q: '路口的黄色网状线表示什么？', opts: ['可以临时停车', '禁止以任何原因停车', '公交车专用', '减速让行'], a: 1, exp: '网状线：禁止以任何原因停车，避免堵死路口或出入口。' },
  { ch: 'signal', hot: 0, type: 'single', q: '路面上的白色菱形标识表示什么？', opts: ['前方有学校', '前方有人行横道', '前方是路口', '减速丘'], a: 1, exp: '白色菱形是人行横道预告标识，应减速准备让行。' },
  { ch: 'signal', hot: 0, type: 'single', q: '交通警察的指挥手势共有几种？', opts: ['6 种', '7 种', '8 种', '10 种'], a: 2, exp: '停止、直行、左转弯、左转弯待转、右转弯、变道、减速慢行、示意车辆靠边停车，共 8 种。' },

  // —— 事故 ——
  { ch: 'accident', hot: 1, type: 'single', q: '发生交通事故造成人员受伤时，驾驶人首先应该怎么做？', opts: ['立即离开现场找人帮忙', '立即抢救受伤人员，并迅速报警', '先与对方协商赔偿', '先移动车辆恢复交通'], a: 1, exp: '有人员伤亡：立即抢救伤员、迅速报警；因抢救变动现场的要标明位置。' },
  { ch: 'accident', hot: 1, type: 'judge', q: '发生仅造成轻微财产损失、基本事实清楚的交通事故，当事人应当先撤离现场再进行协商处理。', a: true, exp: '道交法第 70 条。拍照固定证据后撤离，避免堵车和二次事故。' },
  { ch: 'accident', hot: 0, type: 'judge', q: '因抢救受伤人员变动现场的，应当标明位置。', a: true, exp: '便于事后认定事故责任。' },
  { ch: 'accident', hot: 1, type: 'judge', q: '发生交通事故后当事人逃逸的，逃逸的当事人承担全部责任。', a: true, exp: '逃逸或故意破坏、伪造现场、毁灭证据的，承担全部责任。' },
  { ch: 'accident', hot: 0, type: 'single', q: '救助昏迷的受伤人员，应采取什么体位以防窒息？', opts: ['仰卧', '侧卧', '俯卧', '坐姿'], a: 1, exp: '侧卧位，防止呕吐物、舌根后坠堵塞气道。' },

  // —— 安全驾驶 ——
  { ch: 'safe', hot: 1, type: 'single', q: '行驶中轮胎突然爆裂，以下做法正确的是？', opts: ['迅速踩制动减速', '紧握方向盘，松抬加速踏板，缓慢减速', '急转方向驶向路边', '立即拉紧驻车制动'], a: 1, exp: '爆胎时紧急制动或猛打方向极易翻车，应握稳方向、松油门、待车速降低后再轻踩制动。' },
  { ch: 'safe', hot: 1, type: 'single', q: '车辆发生侧滑时，应该怎么做？', opts: ['紧急制动', '向侧滑相反方向猛打方向', '松抬加速踏板，向侧滑的一侧适当转动方向盘', '加速冲出'], a: 2, exp: '车尾往哪边甩，方向盘就往哪边适当修正，同时松油门，切忌急刹和猛打方向。' },
  { ch: 'safe', hot: 1, type: 'single', q: '下长坡时制动突然失效，驾驶人首先应该怎么做？', opts: ['迅速跳车', '抢挡减速，利用发动机制动', '熄火', '紧急拉紧驻车制动'], a: 1, exp: '先控制方向、抢挡减速，再缓拉驻车制动，必要时利用避险车道或路边障碍物。' },
  { ch: 'safe', hot: 1, type: 'judge', q: '发动机着火时，应迅速打开发动机舱盖灭火。', a: false, exp: '打开舱盖会进入大量空气使火势加大，应熄火断油断电，用灭火器从缝隙处灭火。' },
  { ch: 'safe', hot: 0, type: 'single', q: '车辆落水后车门无法打开时，应当怎么做？', opts: ['用力敲击前挡风玻璃中央', '等水快灌满、内外压力接近时开门，或用安全锤敲击侧窗玻璃边角', '一直打电话等待救援', '踩油门把车开出来'], a: 1, exp: '侧窗玻璃边角最容易击碎；前挡风是夹层玻璃很难砸开。' },
  { ch: 'safe', hot: 0, type: 'single', q: '雾天行驶，以下做法错误的是？', opts: ['开启雾灯和危险报警闪光灯', '降低车速，加大车距', '开启远光灯以增加照射距离', '必要时鸣喇叭提示'], a: 2, exp: '雾中使用远光灯，光线被雾气散射形成白茫茫一片，反而看不清。' },
  { ch: 'safe', hot: 0, type: 'single', q: '机动车涉水后，应当怎样恢复制动效能？', opts: ['高速行驶一段距离', '间断轻踩制动踏板', '连续猛踩制动踏板', '停车晾干'], a: 1, exp: '间断轻踩制动踏板，利用摩擦生热排出制动器里的水分。' },
  { ch: 'safe', hot: 0, type: 'judge', q: '在雨天高速行驶时出现"水滑"现象，应握稳方向盘，逐渐降低车速，不要急踩制动。', a: true, exp: '急刹会使车辆失控侧滑。' },
  { ch: 'safe', hot: 0, type: 'judge', q: '在冰雪路面行驶，应尽量沿着前车车辙行驶，并降低车速、加大车距。', a: true, exp: '车辙处积雪被压实或已融化，附着力相对更好。' },
  { ch: 'safe', hot: 1, type: 'judge', q: '装有 ABS 的车辆紧急制动时，应用力踩制动踏板，不要反复点刹。', a: true, exp: 'ABS 会自动"点刹"防止车轮抱死，人为松踩反而延长制动距离。' },
  { ch: 'safe', hot: 0, type: 'single', q: '驾驶时双手握方向盘的正确位置是？', opts: ['左手 10–11 点，右手 1–2 点', '左手 9–10 点，右手 3–4 点', '左手 7–8 点，右手 4–5 点', '单手 12 点'], a: 1, exp: '左手 9–10 点、右手 3–4 点，转向时操控最稳定。' },
  { ch: 'safe', hot: 0, type: 'judge', q: '可以把后向式儿童安全座椅安装在有安全气囊的副驾驶座位上。', a: false, exp: '气囊弹出时会直接撞击儿童座椅，造成严重伤害。儿童应坐后排。' },
  { ch: 'safe', hot: 1, type: 'single', q: '仪表盘上红色"油壶滴油"图案的指示灯亮起，表示什么？', opts: ['燃油不足', '机油压力过低', '发动机故障', '需要更换机油滤芯'], a: 1, exp: '红色油壶 = 机油压力报警，应尽快靠边停车熄火检查；燃油不足是黄色加油机图案。' },
  { ch: 'safe', hot: 1, type: 'single', q: '仪表盘上蓝色、灯光平直射出的指示灯亮起，表示什么？', opts: ['近光灯开启', '远光灯开启', '前雾灯开启', '示廓灯开启'], a: 1, exp: '远光灯指示灯是蓝色、光线平直；近光灯为绿色、光线向下斜。' },
  { ch: 'safe', hot: 0, type: 'single', q: '仪表盘上"温度计插在水波上"的红色指示灯亮起，表示什么？', opts: ['空调故障', '冷却液温度过高', '车内温度过高', '机油温度过低'], a: 1, exp: '冷却液温度报警，应停车怠速散热，不要立即打开水箱盖以免烫伤。' },
  { ch: 'safe', hot: 0, type: 'single', q: '正面碰撞不可避免、撞击部位靠近驾驶人座位时，驾驶人应当？', opts: ['紧握方向盘，两腿蹬直', '迅速躲离方向盘，将两脚抬起', '跳车逃生', '猛打方向'], a: 1, exp: '撞击部位不在驾驶人一侧时才是"紧握方向盘、两腿蹬直、身体后倾"。' },
  { ch: 'safe', hot: 0, type: 'judge', q: '车辆发生侧翻时，驾驶人应紧握方向盘，两脚勾住踏板，使身体固定，随车翻转。', a: true, exp: '不要试图跳车，以免被车辆压伤。' },
  { ch: 'safe', hot: 0, type: 'judge', q: '长时间在高速公路上行驶，驾驶人容易低估实际车速，应多注意观察速度表。', a: true, exp: '这种现象称为"速度错觉"。' },
  { ch: 'safe', hot: 0, type: 'single', q: '夜间行车被对向来车的远光灯晃眼时，应当怎么做？', opts: ['也开远光灯回敬', '减速，目视道路右侧边缘，必要时停车', '加速驶离', '闭眼继续驾驶'], a: 1, exp: '避开强光，看右侧路边保持方向，降低车速。' },
];
