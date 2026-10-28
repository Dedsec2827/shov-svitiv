(function () {
  'use strict';
  var SS = window.SS, G = SS.G, $ = SS.$, $$ = SS.$$, mk = SS.mk;
  var INK = '#0A0F26';

  var EN = {
    kick: 'SPACE + OCEAN', title: 'Underwater Spaceport',
    lead: 'The world’s only spaceport on the sea floor. The rockets look like jellyfish, the astronauts swim in flippers, and instead of a countdown they switch on the sonar.',
    s1: '4 days', s2: 'Aquanaut', s3: 'from 4 dreams', scrollHint: '↓ SCROLL TO DIVE', artAlt: 'A jellyfish rocket crosses the border between space and sea',
    diveAlt: 'Animation of a dive from orbit to the sea floor, driven by scrolling', gaugeT: 'ALTIMETER-DEPTH GAUGE',
    d1n: 'DAY 1', d1t: 'Down to the floor', d1: 'A bathyscaphe lift, a briefing from the octopus dispatcher and your first night in a cabin overlooking the fish.',
    d2n: 'DAY 2', d2t: 'Reef training', d2: 'Zero gravity is all around anyway, so we train right among the corals. Swimming in a spacesuit is mandatory.',
    d3n: 'DAY 3', d3t: 'Jellyfish rocket launch', d3: 'A sonar countdown, a cloud of bubbles and an exit from the water straight into orbit.',
    d4n: 'DAY 4', d4t: 'Splashdown', d4: 'Coming back with a splash. Lunch on board comes in tubes: seaweed soup and a starry dessert.',
    wxT: 'Spaceport weather', wx1: '<b>Calm</b> in the vacuum', wx2: 'Surface waves:', wx2u: 'points', wx3: 'Meteorites:', wx3u: 'per hour',
    p1: '<b>Flippers</b> with jet propulsion', p2: '<b>An aquarium helmet</b> (fish included)', p3: '<b>A towel</b>, you’ll need it in space too',
    ctaT: 'Launches every Thursday at 10:00', ctaP: 'Mariana Trench local time.'
  };
  var TIPS = [
    ['Гортайте вниз, і ми зануримося з орбіти просто на дно.', 'Scroll down and we’ll dive from orbit straight to the floor.'],
    ['Клікніть по сцені занурення, щоб випустити бульбашки.', 'Click the dive scene to release bubbles.'],
    ['Медуза летить за вашим курсором. Вона дуже допитлива.', 'The jellyfish follows your cursor. It is very curious.'],
    ['Мій шолом протікає, але рибкам подобається.', 'My helmet leaks, but the fish like it.']
  ];
  var ZONES = [
    { to: 150, ua: 'Орбіта', en: 'Orbit', cap: ['Ми на орбіті. Пристебніться, далі тільки вниз!', 'We are in orbit. Buckle up, it’s all downhill from here!'] },
    { to: 330, ua: 'Стратосфера', en: 'Stratosphere', cap: ['Супутник махає нам антеною. Махайте у відповідь.', 'A satellite waves its antenna at us. Wave back.'] },
    { to: 450, ua: 'Хмари', en: 'Clouds', cap: ['Хмари м’які, але проходити крізь них треба швидко.', 'Clouds are soft, but go through them quickly.'] },
    { to: 520, ua: 'Поверхня моря', en: 'Sea surface', cap: ['ПЛЮХ! Вітаємо в океані. Космос лишився нагорі.', 'SPLASH! Welcome to the ocean. Space stays upstairs.'] },
    { to: 800, ua: 'Кораловий риф', en: 'Coral reef', cap: ['Рибки думають, що ми прибульці. Вони мають рацію.', 'The fish think we are aliens. They’re right.'] },
    { to: 1001, ua: 'Глибоководний космодром', en: 'Deep-sea spaceport', cap: ['Ось і стартовий майданчик. Наступна зупинка: зорі!', 'Here is the launch pad. Next stop: the stars!'] }
  ];

  function heroArt() {
    var hs = $('#hStars');
    for (var i = 0; i < 28; i++) hs.appendChild(mk('circle', { cx: Math.random() * 520, cy: Math.random() * 230, r: SS.rand(1, 2.6), fill: i % 6 ? '#FFFDF7' : '#FFC93C', 'class': 'hs' }));
    var hb = $('#hBubbles');
    for (var j = 0; j < 12; j++) hb.appendChild(mk('circle', { cx: SS.rand(60, 460), cy: 490, r: SS.rand(3, 9), fill: 'none', stroke: '#FFFDF7', 'stroke-width': 3, 'class': 'hb' }));
    if (!G || SS.reduce) return;
    G.from('.t-art svg', { scale: .8, rotation: -8, opacity: 0, duration: .9, ease: 'back.out(1.7)' });
    SS.ambient(G.to('.hJelly', { y: -16, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('.hJelly .tent', { attr: { d: 'M 206 262 c 8 34 -8 56 4 86 M 236 266 c -4 34 10 58 -2 92 M 266 268 c 4 34 -10 56 2 90 M 296 266 c -4 30 6 48 -4 76 M 320 258 c -4 24 4 38 -4 58' }, duration: 1, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('#hWater', { attr: { d: 'M 0 250 Q 65 272 130 250 T 260 250 T 390 250 T 520 250 V 480 H 0 Z' }, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('.fishA', { x: -300, duration: 9, repeat: -1, ease: 'none' }));
    $$('.hs').forEach(function (s) { SS.ambient(G.to(s, { opacity: .2, duration: SS.rand(.5, 1.5), yoyo: true, repeat: -1, delay: Math.random() * 2 })); });
    $$('.hb').forEach(function (b) { SS.ambient(G.to(b, { attr: { cy: 250 }, opacity: 0, duration: SS.rand(3, 6), repeat: -1, delay: Math.random() * 4, ease: 'none' })); });
  }

  function dive() {
    var sec = $('#dive'), cv = $('#diveCv'), c = cv.getContext('2d'), gVal = $('#gVal'), gZone = $('#gZone'), capT = $('#dCapT');
    var W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1), visible = false, t0 = performance.now(), time = 0;
    var mx = .5, my = .5, jx = .5, zone = -1, wasUnder = false, burst = [];
    function rs() { var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; }
    rs(); addEventListener('resize', rs);
    function rnd(seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }
    var stars = [], fish = [], weeds = [], bubbles = [];
    for (var i = 0; i < 90; i++) stars.push({ x: rnd(i), d: rnd(i + 100) * 430, r: 1 + rnd(i + 200) * 2.2, tw: rnd(i + 300) * 6 });
    var FC = ['#FFC93C', '#FF4F9A', '#3CCB7F', '#FF8A3D', '#FFFDF7'];
    for (var f = 0; f < 16; f++) fish.push({ x: rnd(f + 400), d: 540 + rnd(f + 500) * 380, s: .6 + rnd(f + 600) * .8, sp: (.02 + rnd(f + 700) * .04) * (rnd(f + 800) > .5 ? 1 : -1), c: FC[f % FC.length] });
    for (var w = 0; w < 14; w++) weeds.push({ x: w / 13 + (rnd(w + 900) - .5) * .05, h: 40 + rnd(w + 950) * 70, c: w % 3 ? '#3CCB7F' : '#FF4F9A' });
    for (var b = 0; b < 40; b++) bubbles.push({ x: rnd(b + 1000), d: 470 + rnd(b + 1100) * 530, r: 2 + rnd(b + 1200) * 6, sp: 10 + rnd(b + 1300) * 30 });

    function lerpC(a, b2, t) {
      var pa = [parseInt(a.substr(1, 2), 16), parseInt(a.substr(3, 2), 16), parseInt(a.substr(5, 2), 16)], pb = [parseInt(b2.substr(1, 2), 16), parseInt(b2.substr(3, 2), 16), parseInt(b2.substr(5, 2), 16)];
      return 'rgb(' + pa.map(function (v, i2) { return Math.round(v + (pb[i2] - v) * t); }).join(',') + ')';
    }
    function skyCol(d) {
      if (d < 200) return '#0A0B2A'; if (d < 330) return lerpC('#0A0B2A', '#3B3BA8', (d - 200) / 130); return lerpC('#3B3BA8', '#8FD8FF', Math.min(1, (d - 330) / 120));
    }
    function waterCol(d) { var t = Math.min(1, Math.max(0, (d - 450) / 550)); return t < .5 ? lerpC('#2BBEF0', '#1466B8', t * 2) : lerpC('#1466B8', '#071A3D', (t - .5) * 2); }

    function prog() {
      var r = sec.getBoundingClientRect(), total = sec.offsetHeight - (H || innerHeight);
      return Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    }
    function outline(lw) { c.lineWidth = lw || 3; c.strokeStyle = INK; c.lineJoin = 'round'; c.lineCap = 'round'; }

    function drawFish(x, y, s, dir, col) {
      c.save(); c.translate(x, y); c.scale(dir < 0 ? -s : s, s);
      outline(3); c.fillStyle = col;
      c.beginPath(); c.moveTo(-28, 0); c.quadraticCurveTo(0, -22, 26, 0); c.quadraticCurveTo(0, 22, -28, 0); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(-26, 0); c.lineTo(-44, -14); c.lineTo(-44, 14); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = INK; c.beginPath(); c.arc(14, -3, 3.2, 0, 6.28); c.fill();
      c.restore();
    }
    function drawCloud(x, y, s) {
      c.save(); c.translate(x, y); c.scale(s, s); outline(3.5); c.fillStyle = '#FFFDF7';
      c.beginPath(); c.arc(-40, 6, 22, Math.PI * .5, Math.PI * 1.5); c.arc(-14, -14, 26, Math.PI, Math.PI * 1.9); c.arc(22, -10, 22, Math.PI * 1.1, Math.PI * 1.95); c.arc(44, 6, 18, Math.PI * 1.5, Math.PI * .5); c.closePath(); c.fill(); c.stroke();
      c.restore();
    }
    function drawPlanet(x, y, r) {
      outline(4); c.fillStyle = '#FFC93C'; c.beginPath(); c.arc(x, y, r, 0, 6.28); c.fill(); c.stroke();
      c.fillStyle = 'rgba(10,15,38,.18)'; c.beginPath(); c.arc(x - r * .3, y - r * .2, r * .22, 0, 6.28); c.arc(x + r * .35, y + r * .3, r * .14, 0, 6.28); c.fill();
      c.strokeStyle = '#FF4F9A'; c.lineWidth = 6; c.beginPath(); c.ellipse(x, y + 4, r * 1.8, r * .35, -.25, 0, 6.28); c.stroke();
    }
    function drawSat(x, y, s, a) {
      c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); outline(3);
      c.fillStyle = '#2BBEF0'; c.fillRect(-60, -12, 36, 24); c.strokeRect(-60, -12, 36, 24); c.fillRect(24, -12, 36, 24); c.strokeRect(24, -12, 36, 24);
      c.fillStyle = '#FFFDF7'; c.beginPath(); c.rect(-20, -18, 40, 36); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(0, -18); c.lineTo(0, -36); c.stroke(); c.fillStyle = '#FF4F9A'; c.beginPath(); c.arc(0, -38, 5, 0, 6.28); c.fill(); c.stroke();
      c.restore();
    }
    function drawJelly(x, y, s, under) {
      c.save(); c.translate(x, y); c.scale(s, s);
      var tt = time;
      if (!under) {
        c.fillStyle = '#FFC93C'; outline(3);
        c.beginPath(); c.moveTo(-18, 34); c.quadraticCurveTo(0, 80 + Math.sin(tt * 30) * 10, 18, 34); c.fill(); c.stroke();
      } else {
        c.strokeStyle = '#FFFDF7'; c.lineWidth = 2.5;
        for (var k = 0; k < 6; k++) { var by = 50 + ((tt * 60 + k * 22) % 130); c.globalAlpha = 1 - (by - 50) / 130; c.beginPath(); c.arc(Math.sin(tt * 3 + k) * 10, -by + 140, 3 + k % 3 * 2, 0, 6.28); c.stroke(); }
        c.globalAlpha = 1;
      }
      outline(5);
      for (var i2 = 0; i2 < 5; i2++) {
        var x0 = -40 + i2 * 20; c.beginPath(); c.moveTo(x0, 18);
        c.bezierCurveTo(x0 + Math.sin(tt * 3 + i2) * 12, 50, x0 - Math.sin(tt * 3 + i2) * 12, 80, x0 + Math.sin(tt * 2.6 + i2) * 8, 108); c.stroke();
      }
      c.fillStyle = '#FF4F9A'; outline(5);
      c.beginPath(); c.moveTo(-64, 18); c.bezierCurveTo(-64, -46, -30, -78, 0, -78); c.bezierCurveTo(30, -78, 64, -46, 64, 18);
      for (var k2 = 0; k2 < 4; k2++) c.quadraticCurveTo(48 - k2 * 32, 30, 32 - k2 * 32, 18);
      c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#FFC93C'; c.beginPath(); c.moveTo(-14, -74); c.lineTo(0, -108); c.lineTo(14, -74); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#2BBEF0'; c.lineWidth = 4; c.beginPath(); c.arc(0, -50, 10, 0, 6.28); c.fill(); c.stroke();
      var ex = (mx - jx) * 8, ey = (my - .5) * 6;
      [-18, 18].forEach(function (o) { c.fillStyle = '#fff'; c.lineWidth = 4; c.beginPath(); c.arc(o, -18, 12, 0, 6.28); c.fill(); c.stroke(); c.fillStyle = INK; c.beginPath(); c.arc(o + Math.max(-5, Math.min(5, ex)), -18 + Math.max(-4, Math.min(4, ey)), 5.5, 0, 6.28); c.fill(); });
      c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 10, .2, Math.PI - .2); c.stroke();
      c.restore();
    }
    function drawPad(x, y, s) {
      c.save(); c.translate(x, y); c.scale(s, s); outline(4);
      c.fillStyle = '#FFC93C'; c.beginPath(); c.rect(-160, -14, 320, 28); c.fill(); c.stroke();
      c.fillStyle = INK; for (var i3 = -150; i3 < 150; i3 += 40) { c.beginPath(); c.moveTo(i3, -14); c.lineTo(i3 + 20, -14); c.lineTo(i3 + 4, 14); c.lineTo(i3 - 16, 14); c.closePath(); c.fill(); }
      c.strokeStyle = 'rgba(42,243,255,' + (.5 + Math.sin(time * 4) * .3) + ')'; c.lineWidth = 6; c.beginPath(); c.ellipse(0, -30, 120, 26, 0, 0, 6.28); c.stroke();
      outline(4); c.fillStyle = '#FF4F9A'; c.fillRect(-200, -120, 26, 106); c.strokeRect(-200, -120, 26, 106); c.fillRect(174, -120, 26, 106); c.strokeRect(174, -120, 26, 106);
      c.fillStyle = '#FFFDF7'; c.beginPath(); c.rect(-90, -170, 180, 44); c.fill(); c.stroke();
      c.fillStyle = INK; c.font = '700 22px Unbounded, Arial Black, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(SS.L('СТАРТ', 'LAUNCH'), 0, -147);
      c.restore();
    }

    function frame(now) {
      if (!visible) return;
      if (!SS.calm) time = (now - t0) / 1000;
      var p = prog(), camD = 125 + p * 750, k = H / 250, u = Math.min(W, H) / 600;
      var Y = function (d) { return H / 2 + (d - camD) * k; };
      jx += (mx - jx) * .06;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      var topD = camD - 125, surfY = Y(450);
      var grd = c.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, skyCol(topD)); grd.addColorStop(1, skyCol(Math.min(450, camD + 125)));
      c.fillStyle = grd; c.fillRect(0, 0, W, H);
      stars.forEach(function (s) { var y = Y(s.d); if (y < -5 || y > Math.min(H, surfY)) return; var a = Math.max(0, 1 - s.d / 380) * (.6 + .4 * Math.sin(time * 2 + s.tw)); c.globalAlpha = a; c.fillStyle = '#FFFDF7'; c.beginPath(); c.arc(s.x * W, y, s.r, 0, 6.28); c.fill(); });
      c.globalAlpha = 1;
      var py = Y(70); if (py > -200 && py < H + 200) drawPlanet(W * .24, py, 54 * u);
      var sy = Y(230); if (sy > -100 && sy < H + 100) drawSat(W * .74 + Math.sin(time * .5) * 20, sy, u * 1.1, Math.sin(time) * .2);
      [[.2, 360, 1.1], [.7, 390, 1.4], [.45, 420, .9], [.9, 345, .8]].forEach(function (cl) { var y = Y(cl[1]); if (y > -100 && y < H + 100) drawCloud(((cl[0] + time * .01) % 1.2 - .1) * W, y, cl[2] * u * 1.3); });
      if (surfY < H) {
        var wg = c.createLinearGradient(0, Math.max(0, surfY), 0, H); wg.addColorStop(0, waterCol(Math.max(450, topD))); wg.addColorStop(1, waterCol(camD + 125));
        c.fillStyle = wg; c.beginPath(); c.moveTo(0, H);
        for (var x = 0; x <= W + 20; x += 20) c.lineTo(x, surfY + Math.sin(x / 60 + time * 2) * 8);
        c.lineTo(W, H); c.closePath(); c.fill();
        outline(4); c.beginPath(); for (var x2 = 0; x2 <= W + 20; x2 += 20) { var yy = surfY + Math.sin(x2 / 60 + time * 2) * 8; x2 ? c.lineTo(x2, yy) : c.moveTo(x2, yy); } c.stroke();
        c.strokeStyle = 'rgba(255,253,247,.8)'; c.lineWidth = 2.5;
        bubbles.forEach(function (b2) { var d = b2.d - ((time * b2.sp) % 300); if (d < 455) d += 300; var y = Y(d); if (y < surfY || y > H) return; c.beginPath(); c.arc(b2.x * W + Math.sin(time + b2.d) * 6, y, b2.r, 0, 6.28); c.stroke(); });
        fish.forEach(function (f2) { var y = Y(f2.d); if (y < surfY + 20 || y > H + 40) return; var xx = (((f2.x + time * f2.sp) % 1.2) + 1.2) % 1.2 - .1; drawFish(xx * W, y + Math.sin(time * 2 + f2.d) * 6, f2.s * u * 1.4, f2.sp, f2.c); });
        var floorY = Y(1000);
        if (floorY < H + 160) {
          c.fillStyle = '#E8C77A'; outline(4); c.beginPath(); c.moveTo(0, floorY - 20); c.quadraticCurveTo(W * .25, floorY - 50, W * .5, floorY - 24); c.quadraticCurveTo(W * .75, floorY - 4, W, floorY - 30); c.lineTo(W, H + 10); c.lineTo(0, H + 10); c.closePath(); c.fill(); c.stroke();
          weeds.forEach(function (wd) { var bx = wd.x * W, by = floorY - 26; c.fillStyle = wd.c; outline(3); c.beginPath(); c.moveTo(bx - 8, by); c.quadraticCurveTo(bx + Math.sin(time * 2 + wd.x * 9) * 16, by - wd.h * u * .8, bx + Math.sin(time * 1.6 + wd.x * 7) * 10, by - wd.h * u * 1.6); c.quadraticCurveTo(bx + 10, by - wd.h * u * .7, bx + 8, by); c.closePath(); c.fill(); c.stroke(); });
          drawPad(W * .5, floorY - 40, u * 1.1);
        }
      }
      burst = burst.filter(function (q) { return q.l > 0; });
      burst.forEach(function (q) { q.x += q.vx; q.y += q.vy; q.vy += q.g; q.l -= .02; c.globalAlpha = Math.max(0, q.l); if (q.star) { c.fillStyle = '#FFE45E'; c.fillRect(q.x, q.y, 4, 4); } else { c.strokeStyle = '#FFFDF7'; c.lineWidth = 2.5; c.beginPath(); c.arc(q.x, q.y, q.r, 0, 6.28); c.stroke(); } });
      c.globalAlpha = 1;
      var under = camD > 455;
      drawJelly(jx * W, H * .5 + Math.sin(time * 1.6) * 12, u * 1.15, under);
      var txt = camD < 450 ? '+' + Math.round((450 - camD) / 450 * 400) + SS.L(' км', ' km') : '−' + Math.round((camD - 450) / 550 * 11000).toLocaleString('uk-UA') + SS.L(' м', ' m');
      gVal.textContent = txt;
      var zi = 0; while (zi < ZONES.length - 1 && camD >= ZONES[zi].to) zi++;
      if (zi !== zone) {
        zone = zi; gZone.textContent = SS.L(ZONES[zi].ua, ZONES[zi].en); capT.textContent = SS.L(ZONES[zi].cap[0], ZONES[zi].cap[1]);
        if (G && !SS.calm) G.fromTo('#dCap', { scale: .7, rotation: -3 }, { scale: 1, rotation: 0, duration: .45, ease: 'back.out(3)' });
        SS.blip(300 + zi * 80, .15, 'sine');
      }
      if (under !== wasUnder) { wasUnder = under; SS.noise(.6, .14, under ? 700 : 1800); if (under) SS.boom(W * .5 + cv.getBoundingClientRect().left, cv.getBoundingClientRect().top + H * .4, SS.L('ПЛЮХ!', 'SPLASH!')); }
      requestAnimationFrame(frame);
    }
    document.addEventListener('ss:lang', function () { zone = -1; });
    cv.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; }, { passive: true });
    cv.addEventListener('click', function (e) {
      var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, under = wasUnder;
      for (var i4 = 0; i4 < 24; i4++) burst.push({ x: x, y: y, vx: SS.rand(-3, 3), vy: under ? SS.rand(-4, -.5) : SS.rand(-3, 3), g: under ? -.03 : 0, r: SS.rand(2, 7), l: 1, star: !under });
      SS.boom(e.clientX, e.clientY, under ? SS.L('БУЛЬ!', 'BLUB!') : SS.L('ДЗИНЬ!', 'TWINKLE!'));
      SS.blip(under ? 220 : 880, .2, 'sine');
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { var v = en[0].isIntersecting; if (v && !visible) { visible = true; rs(); requestAnimationFrame(frame); } else if (!v) visible = false; }).observe(sec);
    } else { visible = true; requestAnimationFrame(frame); }
  }

  SS.tourPage({
    id: 'kosmodrom', en: EN, outfit: 'space', tips: TIPS, fx: 'bubbles',
    drone: { base: 73.4, type: 'sine', cut: 500, lfo: .08, vol: .05 },
    weather: { temp: [-8, 14], vals: [{ id: 'wx-a', min: 1, max: 5 }, { id: 'wx-b', min: 0, max: 9 }] },
    init: function () { heroArt(); dive(); }
  });
})();
