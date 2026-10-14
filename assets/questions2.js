/* 第二批题：看图题（由 pics.js 的目录自动生成）+ 手写补充题。
 * 看图题的干扰项取自同一大类，和真题库的出法一致。 */
(() => {
  const { SIGN_CATALOG, LANE_CATALOG, DASH_CATALOG, GESTURE_CATALOG } = window.PICS;
  // 固定种子的伪随机，保证每次打开题目选项顺序一致（错题本里才对得上）
  let seed = 20261014;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pickDistractors = (pool, self, n, label) => {
    const others = pool.filter((x) => x !== self);
    return shuffle(others).slice(0, n).map(label);
  };
  const single = (ch, hot, sign, q, correct, distractors, exp) => {
    const opts = shuffle([correct, ...distractors]);
    return { ch, hot, type: 'single', sign, q, opts, a: opts.indexOf(correct), exp };
  };
  const out = [];

  /* ---- 交通标志 ---- */
  const CAT_NAME = { warn: '警告标志（黄底黑边三角形）', ban: '禁令标志（白底红圈）', ind: '指示标志（蓝底白图案）', guide: '指路/告示类标志' };
  SIGN_CATALOG.forEach((s, i) => {
    const pool = SIGN_CATALOG.filter((x) => x.cat === s.cat);
    const hot = s.cat === 'guide' ? 0 : 1;
    const exp = `${s.name}，属于${CAT_NAME[s.cat]}。`;
    out.push(single('signal', hot, s.key, '这个标志是何含义？', s.name, pickDistractors(pool, s, 3, (x) => x.name), exp));
    if (i % 3 === 1) {
      const wrong = pool[(i + 1) % pool.length] === s ? pool[(i + 2) % pool.length] : pool[(i + 1) % pool.length];
      const truth = i % 2 === 0;
      out.push({ ch: 'signal', hot, type: 'judge', sign: s.key, q: `这个标志的含义是"${truth ? s.name : wrong.name}"。`, a: truth, exp: truth ? exp : `错。它是"${s.name}"，不是"${wrong.name}"。` });
    }
  });

  /* ---- 道路标线 ---- */
  LANE_CATALOG.forEach((l, i) => {
    out.push(single('signal', 1, l.key, '图中这种标线表示什么？', l.name, pickDistractors(LANE_CATALOG, l, 3, (x) => x.name), l.name));
    if (i % 4 === 2) {
      const wrong = LANE_CATALOG[(i + 3) % LANE_CATALOG.length];
      out.push({ ch: 'signal', hot: 1, type: 'judge', sign: l.key, q: `图中标线是"${wrong.short}"。`, a: false, exp: `错。这是${l.name}。` });
    }
  });

  /* ---- 仪表指示灯 ---- */
  const COLOR_NAME = { red: '红色，表示严重故障或危险，应尽快停车检查', yellow: '黄色，表示故障或提醒，尽快检修', green: '绿色，表示该装置正在工作', blue: '蓝色，表示该装置正在工作' };
  DASH_CATALOG.forEach((d, i) => {
    const exp = `${d.name}。这个灯是${COLOR_NAME[d.color]}。`;
    out.push(single('safe', 1, d.key, '仪表盘上这个指示灯亮起，表示什么？', d.name, pickDistractors(DASH_CATALOG, d, 3, (x) => x.name), exp));
    if (i % 4 === 1) {
      const wrong = DASH_CATALOG[(i + 5) % DASH_CATALOG.length];
      out.push({ ch: 'safe', hot: 1, type: 'judge', sign: d.key, q: `这个指示灯亮起表示"${wrong.name.replace(/（.*?）/, '')}"。`, a: false, exp: `错。这是${d.name}。` });
    }
  });

  /* ---- 交警手势 ---- */
  GESTURE_CATALOG.forEach((g, i) => {
    out.push(single('signal', 1, g.key, '交通警察这个手势是什么信号？', g.name, pickDistractors(GESTURE_CATALOG, g, 3, (x) => x.name), `${g.name}：${g.desc}。判断左右以交警本人为准。`));
    if (i % 2 === 0) {
      const wrong = GESTURE_CATALOG[(i + 3) % GESTURE_CATALOG.length];
      out.push({ ch: 'signal', hot: 1, type: 'judge', sign: g.key, q: `交警这个手势是"${wrong.name}"。`, a: false, exp: `错。这是${g.name}：${g.desc}。` });
    }
  });

  /* ---- 手写补充题 ---- */
  out.push(
    { ch: 'exam', hot: 1, type: 'single', q: '机动车驾驶人在实习期内驾驶机动车，可以牵引挂车吗？', opts: ['可以', '有人陪同就可以', '不得牵引挂车', '只能牵引轻型挂车'], a: 2, exp: '实习期内驾驶的机动车不得牵引挂车。' },
    { ch: 'exam', hot: 1, type: 'judge', q: '持 C2 驾驶证的驾驶人驾驶 C1 车型，属于驾驶与准驾车型不符的机动车，一次记 9 分。', a: true, exp: 'C2 只能开自动挡小型汽车；准驾不符记 9 分。' },
    { ch: 'exam', hot: 1, type: 'single', q: '驾驶证有效期为 6 年，在这 6 年里每个记分周期都没有记满 12 分，换证后有效期是？', opts: ['6 年', '10 年', '20 年', '长期'], a: 1, exp: '6 年 → 10 年 → 长期，逐级换。' },
    { ch: 'exam', hot: 0, type: 'single', q: '驾驶证超过有效期一年以上被注销的，注销未超过 2 年的，怎样恢复？', opts: ['直接补办', '通过科目一考试后恢复', '重考科目一、二、三', '不能恢复'], a: 1, exp: '注销未超过 2 年的，参加科目一考试合格后可以恢复驾驶资格。' },
    { ch: 'exam', hot: 1, type: 'judge', q: '机动车驾驶人在实习期内记满 12 分，注销其实习的准驾车型驾驶资格。', a: true, exp: '实习期记满 12 分直接注销实习车型资格。' },
    { ch: 'exam', hot: 0, type: 'judge', q: '年龄在 70 周岁以上的驾驶人，每年要进行一次身体检查并提交体检证明。', a: true, exp: '70 周岁以上每年体检，在记分周期结束后 30 日内提交。' },

    { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车在普通道路上逆向行驶，一次记多少分？', opts: ['1 分', '3 分', '6 分', '12 分'], a: 1, exp: '普通道路逆行记 3 分；高速公路、城市快速路逆行记 12 分。' },
    { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车不按规定使用灯光，一次记多少分？', opts: ['1 分', '2 分', '3 分', '6 分'], a: 0, exp: '不按规定使用灯光记 1 分。' },
    { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车违反禁令标志、禁止标线指示的，一次记多少分？', opts: ['1 分', '3 分', '6 分', '9 分'], a: 0, exp: '违反禁令标志、禁止标线记 1 分。' },
    { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车不按规定超车、让行，一次记多少分？', opts: ['1 分', '3 分', '6 分', '9 分'], a: 1, exp: '不按规定超车、让行记 3 分。' },
    { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车在高速公路上不按规定车道行驶，一次记多少分？', opts: ['1 分', '3 分', '6 分', '9 分'], a: 1, exp: '高速公路、城市快速路不按规定车道行驶记 3 分。' },
    { ch: 'points', hot: 1, type: 'single', q: '造成致人轻微伤或财产损失的交通事故后逃逸，尚不构成犯罪的，一次记多少分？', opts: ['3 分', '6 分', '9 分', '12 分'], a: 1, exp: '轻微伤/财产损失逃逸记 6 分；致人轻伤以上或死亡逃逸记 12 分。' },
    { ch: 'points', hot: 1, type: 'single', q: '驾驶机动车不按规定避让校车的，一次记多少分？', opts: ['1 分', '3 分', '6 分', '9 分'], a: 1, exp: '不按规定避让校车记 3 分。' },
    { ch: 'points', hot: 1, type: 'judge', q: '驾驶机动车在高速公路上行驶低于规定最低时速的，一次记 3 分。', a: true, exp: '高速低于最低时速记 3 分。' },
    { ch: 'points', hot: 1, type: 'single', q: '驾驶摩托车不戴安全头盔，一次记多少分？', opts: ['不记分', '1 分', '2 分', '3 分'], a: 1, exp: '驾驶摩托车不戴安全头盔记 1 分。' },
    { ch: 'points', hot: 1, type: 'single', q: '使用其他机动车的号牌、行驶证上路，一次记多少分？', opts: ['3 分', '6 分', '9 分', '12 分'], a: 3, exp: '使用伪造、变造或其他机动车的号牌、行驶证记 12 分。' },
    { ch: 'points', hot: 1, type: 'single', q: '驾驶 5 座家用小汽车，载人超过核定人数 100% 以上（如 5 座车坐 10 人），一次记多少分？', opts: ['3 分', '6 分', '9 分', '12 分'], a: 3, exp: '其他载客汽车超员 100% 以上记 12 分；50%–100% 记 6 分；20%–50% 记 3 分。' },
    { ch: 'points', hot: 1, type: 'single', q: '因饮酒后驾驶机动车被处罚后，再次饮酒后驾驶机动车的，怎样处罚？', opts: ['暂扣 6 个月，罚 1000–2000 元', '10 日以下拘留，罚 1000–2000 元，吊销驾驶证', '罚款 5000 元', '警告'], a: 1, exp: '再次饮酒驾驶：10 日以下拘留、1000–2000 元罚款、吊销驾驶证。' },
    { ch: 'points', hot: 1, type: 'single', q: '将机动车交给未取得驾驶证的人驾驶的，处多少罚款？', opts: ['20–200 元', '200–2000 元', '1000–2000 元', '2000–5000 元'], a: 1, exp: '道交法第 99 条：200–2000 元，可并处吊销驾驶证。' },
    { ch: 'points', hot: 0, type: 'judge', q: '公安机关交通管理部门对道路交通安全违法行为的处罚种类包括警告、罚款、暂扣或吊销驾驶证、拘留。', a: true, exp: '四类处罚。' },
    { ch: 'points', hot: 1, type: 'judge', q: '机动车驾驶人在一个记分周期内累积记分达到 12 分，公安机关交通管理部门扣留其机动车驾驶证。', a: true, exp: '满 12 分扣留驾驶证，学习考试后发还。' },

    { ch: 'vehicle', hot: 1, type: 'judge', q: '机动车所有权发生转移的，应当申请转移登记。', a: true, exp: '过户 = 转移登记；改色换发动机 = 变更登记。' },
    { ch: 'vehicle', hot: 1, type: 'judge', q: '已经达到报废标准的机动车，经检验合格后可以继续上路行驶。', a: false, exp: '达到报废标准的机动车不得上道路行驶，应当回收。' },
    { ch: 'vehicle', hot: 0, type: 'single', q: '机动车号牌应当如何悬挂？', opts: ['只挂车后', '只挂车前', '车前、车后指定位置各一块，保持清晰完整', '放在前挡风玻璃内'], a: 2, exp: '前后各一块，不得故意遮挡、污损。' },

    { ch: 'road', hot: 1, type: 'single', q: '通过有交通信号灯控制的交叉路口准备左转弯时，应当怎样行驶？', opts: ['靠路口中心点右侧转弯', '靠路口中心点左侧转弯', '随意转弯', '直接从外侧车道转弯'], a: 1, exp: '左转弯靠路口中心点左侧转弯。' },
    { ch: 'road', hot: 1, type: 'single', q: '通过没有交通信号灯、交通标志、交通标线或交警指挥的交叉路口时，应当怎么做？', opts: ['加速通过', '减速慢行，让右方道路来车先行', '鸣喇叭通过', '让左方道路来车先行'], a: 1, exp: '进入路口前减速慢行、瞭望，让右方来车先行。' },
    { ch: 'road', hot: 1, type: 'single', q: '车辆在道路上发生故障需停车排除时，正确做法是？', opts: ['在原车道停车检修', '立即开启危险报警闪光灯，将车移至不妨碍交通的地方；难以移动的在车后 50–100 米设置警告标志', '放置警告标志后在车道内检修', '打双闪就可以'], a: 1, exp: '实施条例第 60 条。夜间还要开示廓灯和后位灯。' },
    { ch: 'road', hot: 1, type: 'single', q: '机动车在夜间通过没有路灯、照明不良的道路时，应开启什么灯？', opts: ['只开近光灯', '前照灯、示廓灯和后位灯', '雾灯', '危险报警闪光灯'], a: 1, exp: '实施条例第 58 条。' },
    { ch: 'road', hot: 1, type: 'judge', q: '在没有中心隔离设施或没有中心线的道路上会车时，应当减速靠右行驶，并与其他车辆、行人保持必要的安全距离。', a: true, exp: '实施条例第 48 条。' },
    { ch: 'road', hot: 1, type: 'judge', q: '在有障碍的路段会车时，无障碍的一方先行；但有障碍一方已驶入障碍路段而无障碍一方未驶入时，有障碍一方先行。', a: true, exp: '实施条例第 48 条。' },
    { ch: 'road', hot: 1, type: 'single', q: '驾驶机动车在车道减少的路口、路段遇前方停车排队或缓慢行驶时，应当怎样通行？', opts: ['抢先驶入', '每车道一辆依次交替驶入', '借对向车道超越', '鸣喇叭催促'], a: 1, exp: '道交法第 45 条：依次交替通行。' },
    { ch: 'road', hot: 1, type: 'judge', q: '机动车在夜间通过急弯、坡路、拱桥、人行横道或者没有交通信号灯控制的路口时，应当交替使用远近光灯示意。', a: true, exp: '实施条例第 59 条。' },
    { ch: 'road', hot: 1, type: 'single', q: '驾驶机动车经过没有交通信号的道路遇行人横过道路时，应当？', opts: ['鸣喇叭示意行人让车', '加速通过', '避让行人', '保持车速'], a: 2, exp: '道交法第 47 条：应当避让。' },
    { ch: 'road', hot: 1, type: 'judge', q: '机动车载货长度、宽度、高度不得超过规定，载物不得遗洒、飘散。', a: true, exp: '载物超长宽高记 1 分。' },
    { ch: 'road', hot: 0, type: 'single', q: '机动车通过铁路道口，遇道口信号灯两个红灯交替闪烁时，应当？', opts: ['加速通过', '减速通过', '停车等候，禁止通行', '鸣喇叭通过'], a: 2, exp: '两红灯交替闪烁或一个红灯亮，禁止通行。' },
    { ch: 'road', hot: 1, type: 'single', q: '驾驶机动车在禁止鸣喇叭的区域或路段遇紧急情况，可以？', opts: ['连续鸣喇叭', '长鸣喇叭', '不得鸣喇叭，使用灯光示意', '随意鸣喇叭'], a: 2, exp: '禁鸣区不得鸣喇叭，可以用灯光示意。' },
    { ch: 'road', hot: 1, type: 'judge', q: '机动车掉头时，不得妨碍正常行驶的其他车辆和行人的通行。', a: true, exp: '没有禁止掉头标志的地方可以掉头，但不得妨碍他人。' },

    { ch: 'highway', hot: 1, type: 'single', q: '驾驶机动车驶离高速公路时，应当怎样驶出？', opts: ['直接从行车道驶出', '开启右转向灯，驶入减速车道，降低车速后驶离', '在匝道口停车观察后驶出', '开启左转向灯驶出'], a: 1, exp: '实施条例第 80 条。' },
    { ch: 'highway', hot: 1, type: 'judge', q: '机动车在高速公路上发生故障时，车上人员应当迅速转移到右侧路肩上或者应急车道内，并迅速报警。', a: true, exp: '人员撤到护栏外更安全。' },
    { ch: 'highway', hot: 1, type: 'judge', q: '实习期内驾驶人可以独自驾驶机动车上高速公路。', a: false, exp: '实习期上高速必须由持相应或更高准驾车型驾驶证 3 年以上的驾驶人陪同。' },
    { ch: 'highway', hot: 1, type: 'single', q: '高速公路上同方向有 3 条以上车道，中间车道的最低车速是？', opts: ['60 km/h', '80 km/h', '90 km/h', '100 km/h'], a: 2, exp: '最左 110，中间 90。' },
    { ch: 'highway', hot: 1, type: 'single', q: '高速公路上能见度小于 100 米时，正确做法是？', opts: ['开远光灯，车速不超过 60', '开雾灯、近光灯、示廓灯、前后位灯和双闪，车速不超过 40，车距 50 米以上', '车速不超过 20，尽快驶离', '正常行驶'], a: 1, exp: '实施条例第 81 条第二档。' },
    { ch: 'highway', hot: 0, type: 'judge', q: '在高速公路上可以骑、轧车道分界线或在路肩上行驶。', a: false, exp: '明确禁止。' },

    { ch: 'accident', hot: 1, type: 'single', q: '发生交通事故仅造成财产损失、当事人对事实及成因无争议的，应当怎么办？', opts: ['等交警到场', '即行撤离现场，恢复交通，自行协商处理', '双方都留在原地', '报保险后不动'], a: 1, exp: '道交法第 70 条。' },
    { ch: 'accident', hot: 1, type: 'judge', q: '发生交通事故后，当事人故意破坏、伪造现场、毁灭证据的，承担全部责任。', a: true, exp: '与逃逸同样承担全部责任。' },
    { ch: 'accident', hot: 1, type: 'single', q: '抢救因交通事故受伤、怀疑脊柱骨折的伤员时，正确做法是？', opts: ['扶起行走', '背起送医', '不要随意搬动，用硬板担架平抬', '让伤员坐起'], a: 2, exp: '脊柱骨折随意搬动可能造成截瘫。' },
    { ch: 'accident', hot: 0, type: 'single', q: '交通事故造成的损失，首先由谁承担？', opts: ['驾驶人个人', '保险公司在交强险责任限额范围内赔偿', '车主', '双方平摊'], a: 1, exp: '道交法第 76 条：先交强险，不足部分按过错承担。' },

    { ch: 'safe', hot: 1, type: 'single', q: '车辆行驶中发现转向突然失控但仍能保持直线行驶时，应当？', opts: ['紧急制动', '不要紧急制动，轻踩制动使车缓慢停下', '猛打方向', '立即熄火'], a: 1, exp: '紧急制动可能导致车辆甩尾失控。' },
    { ch: 'safe', hot: 1, type: 'judge', q: '驾驶机动车涉水行驶时，应当用低速挡平稳一次通过，途中不换挡、不停车。', a: true, exp: '停车或换挡容易熄火、进水。' },
    { ch: 'safe', hot: 1, type: 'single', q: '山区道路下长坡时，正确的控制车速方法是？', opts: ['空挡滑行', '熄火滑行', '挂低速挡，利用发动机制动', '一直踩制动'], a: 2, exp: '长时间踩制动会导致制动器过热失效。' },
    { ch: 'safe', hot: 1, type: 'single', q: '进入隧道前，驾驶人应当？', opts: ['加速通过', '减速、开启近光灯', '开启远光灯', '鸣喇叭'], a: 1, exp: '隧道内不得超车、停车、倒车、掉头。' },
    { ch: 'safe', hot: 1, type: 'judge', q: '安全气囊必须与安全带配合使用才能起到保护作用。', a: true, exp: '不系安全带时气囊弹出反而可能伤人。' },
    { ch: 'safe', hot: 1, type: 'judge', q: '雨天高速行驶时轮胎与路面之间会形成水膜，导致转向和制动失效，这种现象叫"水滑"。', a: true, exp: '应降速、握稳方向、不急刹。' },
    { ch: 'safe', hot: 0, type: 'single', q: '驾驶人驾车时的头枕高度应当调整到？', opts: ['与肩平齐', '与头部中部平齐（耳朵上沿）', '越高越好', '拆掉'], a: 1, exp: '头枕保护颈椎，太低反而成支点。' },
    { ch: 'safe', hot: 1, type: 'single', q: '机动车在行驶中发动机突然熄火，制动和转向助力随之减弱，正确做法是？', opts: ['猛打方向', '握稳方向盘，用力踩制动，开双闪靠边停车', '立即拉手刹', '继续行驶'], a: 1, exp: '熄火后助力消失，需要更大的力操作。' },
  );

  QUESTIONS.push(...out);
})();
