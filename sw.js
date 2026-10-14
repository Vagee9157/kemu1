// 网络优先：有网永远拿最新内容，没网用上次缓存的，联网打开过一次就能离线看
const CACHE = 'km1-v14';
const CORE = ['./', 'index.html', 'assets/style.css?v=14', 'assets/data.js?v=14', 'assets/illus.js?v=14', 'assets/pics.js?v=14', 'assets/questions2.js?v=14', 'assets/app.js?v=14', 'assets/signs/manifest.js?v=14', 'manifest.json', 'assets/icons/icon-192.png', 'assets/signs/g_exit.svg', 'assets/signs/g_hospital.svg', 'assets/signs/i_bus.svg', 'assets/signs/i_crossing.svg', 'assets/signs/i_horn.svg', 'assets/signs/i_keep_l.svg', 'assets/signs/i_keep_r.svg', 'assets/signs/i_left.svg', 'assets/signs/i_lr.svg', 'assets/signs/i_meet.svg', 'assets/signs/i_minspeed.svg', 'assets/signs/i_motor.svg', 'assets/signs/i_nonmotor.svg', 'assets/signs/i_oneway.svg', 'assets/signs/i_parking.svg', 'assets/signs/i_right.svg', 'assets/signs/i_round.svg', 'assets/signs/i_sl.svg', 'assets/signs/i_sr.svg', 'assets/signs/i_straight.svg', 'assets/signs/i_uturn.svg', 'assets/signs/i_walk.svg', 'assets/signs/p_axle.svg', 'assets/signs/p_check.svg', 'assets/signs/p_endovertake.svg', 'assets/signs/p_endspeed.svg', 'assets/signs/p_height.svg', 'assets/signs/p_meet.svg', 'assets/signs/p_noentry.svg', 'assets/signs/p_nohorn.svg', 'assets/signs/p_noleft.svg', 'assets/signs/p_nolong.svg', 'assets/signs/p_nolr.svg', 'assets/signs/p_nomotor.svg', 'assets/signs/p_nonmotor.svg', 'assets/signs/p_noovertake.svg', 'assets/signs/p_noparking.svg', 'assets/signs/p_noped.svg', 'assets/signs/p_noright.svg', 'assets/signs/p_nosl.svg', 'assets/signs/p_nostraight.svg', 'assets/signs/p_notruck.svg', 'assets/signs/p_nouturn.svg', 'assets/signs/p_novehicles.svg', 'assets/signs/p_speed.svg', 'assets/signs/p_stop.svg', 'assets/signs/p_weight.svg', 'assets/signs/p_width.svg', 'assets/signs/p_yield.svg', 'assets/signs/w_accident.svg', 'assets/signs/w_bike.svg', 'assets/signs/w_bridge.svg', 'assets/signs/w_bump.svg', 'assets/signs/w_child.svg', 'assets/signs/w_cont.svg', 'assets/signs/w_cross.svg', 'assets/signs/w_curve_l.svg', 'assets/signs/w_curve_r.svg', 'assets/signs/w_danger.svg', 'assets/signs/w_down.svg', 'assets/signs/w_ice.svg', 'assets/signs/w_icy.svg', 'assets/signs/w_merge.svg', 'assets/signs/w_narrow2.svg', 'assets/signs/w_narrow_l.svg', 'assets/signs/w_narrow_r.svg', 'assets/signs/w_ped.svg', 'assets/signs/w_rail_g.svg', 'assets/signs/w_rail_n.svg', 'assets/signs/w_rev.svg', 'assets/signs/w_rock.svg', 'assets/signs/w_round.svg', 'assets/signs/w_signal.svg', 'assets/signs/w_slip.svg', 'assets/signs/w_slow.svg', 'assets/signs/w_t.svg', 'assets/signs/w_tunnel.svg', 'assets/signs/w_twoway.svg', 'assets/signs/w_up.svg', 'assets/signs/w_village.svg', 'assets/signs/w_wind.svg', 'assets/signs/w_work.svg', 'assets/signs/w_y.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then((r) => r || caches.match('index.html')))
  );
});
