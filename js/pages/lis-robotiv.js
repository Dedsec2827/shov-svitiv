(function () {
  'use strict';
  var SS = window.SS, G = SS.G, $ = SS.$, $$ = SS.$$;
  var INK = '#16241A';

  var EN = {
    kick: 'NATURE + TECHNOLOGY', title: 'Robot Forest',
    lead: 'Here trees grow out of gears and the leaves double as solar panels. The fireflies turned out to be drones, mushrooms charge phones, and the forester kindly asks you not to forget to oil the pines.',
    s1: '2 days', s2: 'Mechanologist', s3: 'from 2 dreams', artAlt: 'A robot tree with a gear instead of a crown',
    gK: 'INTERACTIVE', gT: 'Wake up the forest', gI: 'The trees fell asleep and are waiting for a charge. Click each one to start its gears. When all five come alive, something lovely happens. The firefly drones follow your cursor.',
    groveAlt: 'A forest of five robot trees', charge: 'Forest charge:', reset: 'Put the forest back to sleep',
    d1n: 'DAY 1', d1t: 'The gear trail', d1: 'A walk with robot forester Gvyntomyr, an oak-oiling lesson and a night in a hollow with a power socket.',
    d2n: 'DAY 2', d2t: 'Hunting for mushroom power', d2: 'We pick power-bank mushrooms, launch firefly drones and watch the sun charge the leaves.',
    wxT: 'Robot Forest weather', wx1: '<b>Sunny</b>, leaves are charging', wx2: 'Oil humidity:', wx3: 'Drones in the air:',
    p1: '<b>An oil can</b> with a spout for the trees', p2: '<b>A cable</b> of any type, the mushrooms are universal', p3: '<b>A raincoat</b>, sometimes it rains screws',
    ctaT: 'The forest is open all year', ctaP: 'In winter the trees switch on heating, so it’s never cold.'
  };
  var TIPS = [
    ['Дерева сплять. Клацніть по кожному, щоб завести шестерні.', 'The trees are asleep. Click each one to wind up its gears.'],
    ['Світлячки-дрони люблять ваш курсор. Поводіть ним над лісом.', 'The firefly drones love your cursor. Move it over the forest.'],
    ['Гриби теж клікабельні. Вони заряджають телефони.', 'The mushrooms are clickable too. They charge phones.'],
    ['Мій капелюх-шестерня крутиться, коли я думаю.', 'My gear hat spins when I think.']
  ];
  var TREES = [{ x: 120, y: 440, s: .8, c: '#3CCB7F' }, { x: 300, y: 420, s: 1.05, c: '#FF8A3D' }, { x: 500, y: 450, s: 1.25, c: '#3CCB7F' }, { x: 700, y: 425, s: .95, c: '#FFC93C' }, { x: 880, y: 445, s: .85, c: '#FF4F9A' }];

  function gearPath(r, teeth, depth) {
    var d = '', n = teeth * 2;
    for (var i = 0; i < n; i++) {
      var a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2, rr = i % 2 ? r : r + depth;
      d += (i ? 'L' : 'M') + (Math.cos(a0) * rr).toFixed(1) + ' ' + (Math.sin(a0) * rr).toFixed(1) + 'L' + (Math.cos(a1) * rr).toFixed(1) + ' ' + (Math.sin(a1) * rr).toFixed(1);
    }
    return d + 'Z';
  }
  function treeSVG(c, awake) {
    var leaves = '';
    for (var k = 0; k < 8; k++) {
      var a = k / 8 * Math.PI * 2, lx = Math.cos(a) * 76, ly = -150 + Math.sin(a) * 76;
      leaves += '<path class="leaf" d="M0 0C10 -10 26 -8 30 0C26 8 10 10 0 0Z" transform="translate(' + lx.toFixed(1) + ' ' + ly.toFixed(1) + ') rotate(' + (a * 180 / Math.PI).toFixed(0) + ')" fill="#3CCB7F" stroke="' + INK + '" stroke-width="3"/>';
    }
    return '<path d="M-16 0C-30 0-40 6-48 14M16 0C30 0 40 6 48 14" stroke="' + INK + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<rect class="trunk" x="-16" y="-122" width="32" height="124" rx="4" fill="#8B5A2B" stroke="' + INK + '" stroke-width="5"/>' +
      '<circle cx="-6" cy="-104" r="3.5" fill="' + INK + '"/><circle cx="6" cy="-40" r="3.5" fill="' + INK + '"/>' +
      '<rect x="-11" y="-82" width="22" height="18" rx="3" fill="' + INK + '"/><circle class="lamp" cx="0" cy="-73" r="5" fill="' + (awake ? '#3CCB7F' : '#FF4F9A') + '"/>' +
      '<path d="M-14 -96l-36-20M14 -88l36-18" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/><circle cx="-52" cy="-117" r="7" fill="#E9E6F2" stroke="' + INK + '" stroke-width="3"/><circle cx="52" cy="-107" r="7" fill="#E9E6F2" stroke="' + INK + '" stroke-width="3"/>' +
      '<g class="leaves">' + leaves + '</g>' +
      '<g class="crown"><path d="' + gearPath(58, 11, 12) + '" transform="translate(0 -150)" fill="' + c + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/></g>' +
      '<circle cx="0" cy="-150" r="34" fill="#FFFDF7" stroke="' + INK + '" stroke-width="5"/>' +
      '<g class="eyes-closed"' + (awake ? ' opacity="0"' : '') + '><path d="M-20 -150q8 6 14 0M6 -150q8 6 14 0" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"/><text x="22" y="-182" font-family="Unbounded, sans-serif" font-weight="900" font-size="18" fill="' + INK + '">z</text></g>' +
      '<g class="eyes-open"' + (awake ? '' : ' opacity="0"') + '><circle cx="-13" cy="-152" r="8" fill="#fff" stroke="' + INK + '" stroke-width="3"/><circle cx="13" cy="-152" r="8" fill="#fff" stroke="' + INK + '" stroke-width="3"/><circle class="pupil" data-range="3" cx="-13" cy="-152" r="4" fill="' + INK + '"/><circle class="pupil" data-range="3" cx="13" cy="-152" r="4" fill="' + INK + '"/><path d="M-8 -136q8 6 16 0" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>';
  }
  function shroomSVG(x, y, s, c) {
    return '<g class="shroom" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" tabindex="0" role="button" aria-label="' + SS.L('Гриб-зарядка', 'Charger mushroom') + '">' +
      '<rect x="-9" y="-26" width="18" height="28" rx="4" fill="#FFFDF7" stroke="' + INK + '" stroke-width="4"/>' +
      '<path class="cap" d="M-34 -24c0-24 16-36 34-36s34 12 34 36z" fill="' + c + '" stroke="' + INK + '" stroke-width="4"/>' +
      '<circle cx="-14" cy="-38" r="5" fill="#FFFDF7"/><circle cx="12" cy="-44" r="4" fill="#FFFDF7"/>' +
      '<path d="M-3 -16l6 -6v6l6 -6" stroke="' + INK + '" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>';
  }

  function hero() {
    var s = $('#heroArt');
    s.innerHTML =
      '<circle cx="260" cy="230" r="210" fill="#BDEBFF" stroke="' + INK + '" stroke-width="6"/>' +
      '<circle cx="380" cy="120" r="34" fill="#FFC93C" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M70 360 Q 260 300 450 360 L 450 420 Q 260 470 70 420Z" fill="#3CCB7F" stroke="' + INK + '" stroke-width="5"/>' +
      '<g transform="translate(250 382) scale(1.25)" class="hTree">' + treeSVG('#FF8A3D', true) + '</g>' +
      shroomSVG(400, 392, 1.1, '#FF4F9A') + shroomSVG(110, 388, .9, '#FFC93C') +
      '<g class="hDrone"><ellipse cx="420" cy="230" rx="12" ry="9" fill="#FFE45E" stroke="' + INK + '" stroke-width="3"/><path d="M406 220h-10M434 220h10" stroke="' + INK + '" stroke-width="3"/><circle cx="420" cy="230" r="18" fill="#FFE45E" opacity=".25"/></g>' +
      '<g class="hDrone2"><ellipse cx="110" cy="200" rx="10" ry="8" fill="#FFE45E" stroke="' + INK + '" stroke-width="3"/><path d="M98 191h-9M122 191h9" stroke="' + INK + '" stroke-width="3"/><circle cx="110" cy="200" r="16" fill="#FFE45E" opacity=".25"/></g>';
    if (!G || SS.reduce) return;
    G.from(s, { scale: .85, rotation: 5, opacity: 0, duration: .9, ease: 'back.out(1.7)' });
    SS.ambient(G.to('.hTree .crown path', { rotation: 360, transformOrigin: '50% 50%', duration: 9, repeat: -1, ease: 'none' }));
    SS.ambient(G.to('.hDrone', { x: -40, y: 30, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('.hDrone2', { x: 50, y: -20, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('.hTree .leaf', { scale: 1.2, transformOrigin: '0 0', duration: .8, yoyo: true, repeat: -1, stagger: .1, ease: 'sine.inOut' }));
  }

  function lerpC(a, b, t) {
    var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16); }), pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16); });
    return '#' + pa.map(function (v, i) { return ('0' + Math.round(v + (pb[i] - v) * t).toString(16)).slice(-2); }).join('');
  }

  function grove() {
    var tg = $('#trees'), sg = $('#shrooms'), box = $('#grove'), cells = $$('.battery .cells i'), cnt = $('#chargeN');
    var awake = TREES.map(function () { return false; }), spins = [], finale = false;
    TREES.forEach(function (t, i) {
      var outer = SS.mk('g', { transform: 'translate(' + t.x + ' ' + t.y + ') scale(' + t.s + ')' });
      var g = SS.mk('g', { 'class': 'tree', tabindex: '0', role: 'button', 'aria-pressed': 'false', 'aria-label': SS.L('Дерево-робот ', 'Robot tree ') + (i + 1) });
      g.innerHTML = treeSVG(t.c, false); outer.appendChild(g); tg.appendChild(outer);
      G && G.set($$('.leaf', g), { scale: 0, transformOrigin: '0 0' });
      var act = function () { toggle(i, g); };
      g.addEventListener('click', act);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    });
    sg.innerHTML = shroomSVG(210, 470, .9, '#FF4F9A') + shroomSVG(410, 482, .7, '#FFC93C') + shroomSVG(600, 474, .8, '#7A5CFA') + shroomSVG(790, 478, .75, '#FF4F9A');
    $$('.shroom', sg).forEach(function (m) {
      var f = function (e) {
        SS.toast(SS.L('Гриб зарядив ваш телефон на ' + (Math.round(SS.rand(20, 99))) + '%. Дякуйте грибу!', 'The mushroom charged your phone to ' + Math.round(SS.rand(20, 99)) + '%. Say thanks!'));
        SS.blip(900, .3, 'square', .04);
        if (G && !SS.calm) G.fromTo($('.cap', m), { scaleY: .6, transformOrigin: '50% 100%' }, { scaleY: 1, duration: .6, ease: 'elastic.out(1.2,.3)' });
        if (e.clientX) SS.boom(e.clientX, e.clientY, SS.L('ДЗЗЗ!', 'BZZZ!'));
      };
      m.addEventListener('click', f);
      m.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(e); } });
    });
    function sky() {
      var n = awake.filter(Boolean).length, t = n / 5;
      var col = lerpC('#33406E', '#BDEBFF', t);
      if (G && !SS.calm) { G.to('#sky', { attr: { fill: col }, duration: .8 }); G.to('#sun', { attr: { cy: 470 - t * 360 }, duration: 1.2, ease: 'back.out(1.4)' }); }
      else { $('#sky').setAttribute('fill', col); $('#sun').setAttribute('cy', 470 - t * 360); }
      cells.forEach(function (c, i) { c.classList.toggle('on', i < n); });
      cnt.textContent = n + '/5';
    }
    function toggle(i, g) {
      if (finale) return;
      awake[i] = !awake[i]; var on = awake[i];
      g.setAttribute('aria-pressed', on ? 'true' : 'false');
      $('.lamp', g).setAttribute('fill', on ? '#3CCB7F' : '#FF4F9A');
      if (G) {
        G.to($('.eyes-closed', g), { opacity: on ? 0 : 1, duration: .2 });
        G.to($('.eyes-open', g), { opacity: on ? 1 : 0, duration: .2 });
        G.to($$('.leaf', g), { scale: on ? 1 : 0, stagger: .04, duration: .4, ease: on ? 'back.out(3)' : 'power2.in' });
        if (spins[i]) { spins[i].kill(); spins[i] = null; }
        if (on) spins[i] = SS.ambient(G.to($('.crown path', g), { rotation: '+=360', transformOrigin: '50% 50%', duration: 4 + i, repeat: -1, ease: 'none' }));
        if (!SS.calm) G.fromTo(g, { y: 0 }, { y: -14, duration: .18, yoyo: true, repeat: 1, ease: 'power2.out' });
      } else {
        $('.eyes-closed', g).setAttribute('opacity', on ? 0 : 1); $('.eyes-open', g).setAttribute('opacity', on ? 1 : 0);
      }
      SS.pluck(on ? 330 + i * 60 : 200, .4, 'square', .05);
      sky();
      if (awake.every(Boolean)) win();
    }
    function win() {
      finale = true;
      SS.toast(SS.L('Ліс прокинувся! Дрони кажуть вам «дякую».', 'The forest is awake! The drones say thank you.'), 3500);
      if (SS.guideSay) SS.guideSay('Ура! Ліс ожив. Подивіться, як дрони водять хоровод.', 'Hooray! The forest is alive. Watch the drones dance in a circle.');
      [523, 659, 784, 1047].forEach(function (f, k) { setTimeout(function () { SS.pluck(f, .6, 'triangle', .07); }, k * 140); });
      if (G && !SS.calm) G.fromTo('.shroom .cap', { attr: { fill: '#FFE45E' } }, { attr: { fill: '#FFE45E' }, duration: .3, yoyo: true, repeat: 5 });
      drones.formation = true;
      setTimeout(function () { finale = false; drones.formation = false; }, 6000);
    }
    $('#resetGrove').addEventListener('click', function () {
      TREES.forEach(function (t, i) { if (awake[i]) toggle(i, $$('.tree', tg)[i]); });
      finale = false; drones.formation = false;
    });
    document.addEventListener('ss:lang', function () { $$('.tree', tg).forEach(function (g, i) { g.setAttribute('aria-label', SS.L('Дерево-робот ', 'Robot tree ') + (i + 1)); }); $$('.shroom', sg).forEach(function (m) { m.setAttribute('aria-label', SS.L('Гриб-зарядка', 'Charger mushroom')); }); });
    sky();

    var cv = $('#droneCv'), c = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), W = 0, H = 0, visible = false;
    var drones = { list: [], formation: false }, mx = -1, my = -1, t0 = performance.now();
    function rs() { var r = box.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; }
    rs(); addEventListener('resize', rs);
    for (var i = 0; i < 36; i++) drones.list.push({ x: Math.random() * 1000, y: SS.rand(60, 360), vx: 0, vy: 0, ph: Math.random() * 6.28, home: { x: Math.random() * 1000, y: SS.rand(60, 340) } });
    box.addEventListener('pointermove', function (e) { var r = box.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width * 1000; my = (e.clientY - r.top) / r.height * 520; }, { passive: true });
    box.addEventListener('pointerleave', function () { mx = -1; });
    function frame(now) {
      if (!visible) return;
      var t = (now - t0) / 1000, n = awake.filter(Boolean).length, active = 6 + n * 6, sc = W / 1000;
      c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
      drones.list.forEach(function (d, i) {
        if (i >= active) return;
        var tx, ty;
        if (drones.formation) { var a = i / active * Math.PI * 2 + t * .8; tx = 500 + Math.cos(a) * 200; ty = 230 + Math.sin(a) * 120; }
        else if (mx >= 0) { var a2 = d.ph + t * 2; tx = mx + Math.cos(a2) * (30 + i % 5 * 12); ty = my + Math.sin(a2) * (24 + i % 4 * 10); }
        else { tx = d.home.x + Math.sin(t * .7 + d.ph) * 40; ty = d.home.y + Math.cos(t * .9 + d.ph) * 30; }
        if (SS.calm) { d.x = tx; d.y = ty; } else { d.vx += (tx - d.x) * .004; d.vy += (ty - d.y) * .004; d.vx *= .92; d.vy *= .92; d.x += d.vx; d.y += d.vy; }
        var x = d.x * sc, y = d.y * sc, glow = .55 + .45 * Math.sin(t * 6 + d.ph);
        c.globalAlpha = .35 * glow; c.fillStyle = '#FFE45E'; c.beginPath(); c.arc(x, y, 12 * sc + 4, 0, 6.28); c.fill();
        c.globalAlpha = 1; c.fillStyle = '#FFE45E'; c.strokeStyle = INK; c.lineWidth = 2;
        c.beginPath(); c.ellipse(x, y, 6 * sc + 2, 4.5 * sc + 2, 0, 0, 6.28); c.fill(); c.stroke();
        c.beginPath(); var pw = Math.abs(Math.sin(t * 40 + i)) * (6 * sc + 3); c.moveTo(x - pw, y - 6 * sc - 2); c.lineTo(x + pw, y - 6 * sc - 2); c.stroke();
      });
      requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { var v = en[0].isIntersecting; if (v && !visible) { visible = true; rs(); requestAnimationFrame(frame); } else if (!v) visible = false; }).observe(box);
    else { visible = true; requestAnimationFrame(frame); }
  }

  SS.tourPage({
    id: 'lis', en: EN, outfit: 'robot', tips: TIPS, fx: 'leaves',
    drone: { base: 98, type: 'triangle', cut: 1200, lfo: .3, vol: .03 },
    weather: { temp: [16, 26], vals: [{ id: 'wx-a', min: 25, max: 70, unit: '%' }, { id: 'wx-b', min: 80, max: 260 }] },
    init: function () { hero(); grove(); }
  });
})();
