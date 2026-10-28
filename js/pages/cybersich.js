(function () {
  'use strict';
  var SS = window.SS, G = SS.G, $ = SS.$, $$ = SS.$$, mk = SS.mk;

  var EN = {
    kick: 'COSSACKS + CYBERPUNK', title: 'Cyber-Sich',
    lead: 'Khortytsia, 2099. The Cossacks swapped horses for hover-bikes and sabres for lasers. Neon Petrykivka glows on every wall, and the council meets as a hologram.',
    s1: '3 days', s2: 'Kharakternyk', s3: 'from 3 dreams', maceHint: 'SPIN<br>THE MACE', artAlt: 'A cyber-Cossack with a neon visor',
    maceAlt: 'Holographic mace: drag or press the arrow keys to spin it',
    ornK: 'ORNAMENT MADE OF CODE', ornT: 'Neon Petrykivka',
    orn1: 'In Cyber-Sich, ornaments are not painted with a brush, they are programmed. Every flower grows from code, every “seed” glows with its own LED.',
    orn2: 'Scroll down and the pattern grows with you. Every visit produces a slightly different pattern.', regrow: 'Grow a new one',
    bandK: 'THE SICH’S INSTRUMENT', bandT: 'Cyber-bandura', bandI: 'Run your cursor or finger across the neon strings. Each string sounds and glows. Turn on the sound at the top of the page.',
    bandAlt: 'Strings of the cyber-bandura', n0: 'Do', n1: 'Re', n2: 'Mi', n3: 'Fa', n4: 'Sol', n5: 'La', n6: 'Ti', n7: 'Do',
    d1n: 'DAY 1', d1t: 'Initiation into cyber-Cossacks', d1: 'You get a call sign, a forelock antenna and your first hopak lesson in zero gravity.',
    d2n: 'DAY 2', d2t: 'Council in a hologram', d2: 'You vote for a new AI hetman and write a letter to the sultan in code.',
    d3n: 'DAY 3', d3t: 'Races over the Dnipro', d3: 'Hover boats, neon rapids and a final firework of Petrykivka.',
    wxT: 'Weather over Khortytsia-2099', wx1: '<b>Neon fog</b> in the morning', wx2: 'Chance of holograms:', wx3: 'Wind from the Dnipro:', wx3u: 'bit/s',
    p1: '<b>An embroidered shirt</b> with backlight', p2: '<b>A power bank</b> for your sabre', p3: '<b>Varenyky</b>, robots don’t cook',
    ctaT: 'Seats at the Sich are limited', ctaP: 'The council accepts no more than 300 travellers per season.'
  };
  var TIPS = [
    ['Слава кібер-козакам! Схопіть булаву і крутніть її щосили.', 'Glory to the cyber-Cossacks! Grab the mace and spin it hard.'],
    ['Петриківка внизу росте, коли ви гортаєте сторінку.', 'The Petrykivka below grows as you scroll.'],
    ['Увімкніть звук і зіграйте на кібер-бандурі.', 'Turn on the sound and play the cyber-bandura.'],
    ['Мої вуса тепер теж з підсвіткою.', 'My moustache has backlight now too.']
  ];

  var petr, petrST = null;
  function grain(x, y, ang, len, col) {
    var w = len * .38;
    var d = 'M0 0C' + w + ' ' + (-len * .3) + ' ' + (w * .7) + ' ' + (-len * .85) + ' 0 ' + (-len) + 'C' + (-w * .7) + ' ' + (-len * .85) + ' ' + (-w) + ' ' + (-len * .3) + ' 0 0Z';
    return mk('path', { d: d, transform: 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')', fill: 'none', stroke: col, 'stroke-width': 3, 'stroke-linecap': 'round', 'class': 'pp' });
  }
  function j(v) { return v + SS.rand(-18, 18); }
  function buildPetr() {
    petr.innerHTML = '';
    var defs = mk('defs', {}), f = mk('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
    f.innerHTML = '<feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>';
    defs.appendChild(f); petr.appendChild(defs);
    var g = mk('g', { filter: 'url(#glow)' }); petr.appendChild(g);
    var PAL = [['#2AF3FF', '#FF2E63', '#FFE45E'], ['#FF2E63', '#FFE45E', '#2AF3FF'], ['#FFE45E', '#2AF3FF', '#FF2E63']][(Math.random() * 3) | 0];
    var stems = [
      { d: 'M200 430C200 360 ' + j(170) + ' 320 ' + j(190) + ' 250S' + j(230) + ' 150 ' + j(200) + ' 110', c: PAL[0] },
      { d: 'M196 330C150 310 ' + j(110) + ' 300 ' + j(80) + ' 250S70 170 ' + j(100) + ' ' + j(150), c: PAL[1] },
      { d: 'M204 300C250 290 ' + j(300) + ' 270 ' + j(320) + ' 220S320 150 ' + j(296) + ' ' + j(130), c: PAL[1] }
    ];
    var step = SS.rand(28, 38);
    stems.forEach(function (s, si) {
      var p = mk('path', { d: s.d, fill: 'none', stroke: s.c, 'stroke-width': 4, 'stroke-linecap': 'round', 'class': 'pp' }); g.appendChild(p);
      var L = p.getTotalLength(), n = 0;
      for (var t = 40; t < L - 20; t += step) {
        var a = p.getPointAtLength(t), b = p.getPointAtLength(t + 1), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        var side = n++ % 2 ? 1 : -1;
        g.appendChild(grain(a.x, a.y, ang + (side > 0 ? -40 : 220), 22 - si * 3, si ? PAL[2] : PAL[0]));
      }
      var end = p.getPointAtLength(L), petals = si ? 7 : 9, R = si ? 26 : 38, col = si ? PAL[2] : PAL[1];
      for (var k = 0; k < petals; k++) g.appendChild(grain(end.x, end.y, (k - (petals - 1) / 2) * (180 / (petals - 1)) * 1.4, R, col));
      g.appendChild(mk('circle', { cx: end.x, cy: end.y, r: si ? 7 : 10, fill: 'none', stroke: PAL[0], 'stroke-width': 3, 'class': 'pp' }));
    });
    for (var i = 0; i < 9; i++) g.appendChild(mk('circle', { cx: 120 + i * 20, cy: 432, r: 3.5, fill: PAL[2], 'class': 'dot' }));
    $$('.pp', petr).forEach(function (e) { var l = e.getTotalLength(); e.style.strokeDasharray = l; e.style.strokeDashoffset = SS.reduce ? 0 : l; });
  }
  function petrScroll() {
    if (!G || !window.ScrollTrigger || SS.reduce) return;
    if (petrST) petrST.kill();
    var tl = G.timeline({ scrollTrigger: { trigger: '.orn', start: 'top 80%', end: 'bottom 45%', scrub: 1, onLeave: function (self) { self.kill(); tl.progress(1); petrST = null; } } });
    tl.to($$('.pp', petr), { strokeDashoffset: 0, stagger: .02, ease: 'none' }).from($$('.dot', petr), { scale: 0, transformOrigin: 'center', stagger: .05 }, '-=.3');
    petrST = tl.scrollTrigger;
  }
  function regrow() {
    if (petrST) { petrST.kill(); petrST = null; }
    buildPetr();
    if (!G || SS.reduce) return;
    G.to($$('.pp', petr), { strokeDashoffset: 0, stagger: .025, duration: .5, ease: 'power1.out' });
    G.from($$('.dot', petr), { scale: 0, transformOrigin: 'center', stagger: .05, delay: .8 });
    SS.pluck(523, .6); setTimeout(function () { SS.pluck(659, .6); }, 150); setTimeout(function () { SS.pluck(784, .8); }, 300);
  }

  function mace() {
    var m = $('#mace'), mg = $('#maceG'), rot = 0, drag = false, lastA = 0, vel = 0, lastT = 0, tw = null;
    function set() { mg.setAttribute('transform', 'rotate(' + rot.toFixed(1) + ' 100 100)'); m.setAttribute('aria-valuenow', Math.round(((rot % 360) + 360) % 360)); }
    function ang(e) { var r = m.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; }
    function charged() {
      SS.toast(SS.L('ВЖУХ! Булава заряджена на повну.', 'WHOOSH! The mace is fully charged.'));
      SS.blip(180, .5, 'sawtooth', .09); SS.noise(.5, .1, 2400);
      if (G) G.fromTo(m, { filter: 'drop-shadow(0 0 46px #FFE45E)' }, { filter: 'drop-shadow(0 0 12px rgba(255,228,94,.7))', duration: 1.4 });
      if (SS.spawn) { var r = m.getBoundingClientRect(); SS.spawn(r.left + r.width / 2, r.top + r.height / 3, 40, 3); }
    }
    m.addEventListener('pointerdown', function (e) { drag = true; m.setPointerCapture(e.pointerId); lastA = ang(e); lastT = performance.now(); vel = 0; if (tw) tw.kill(); });
    m.addEventListener('pointermove', function (e) {
      if (!drag) return; var a = ang(e), d = a - lastA; if (d > 180) d -= 360; if (d < -180) d += 360;
      rot += d; var now = performance.now(); vel = d / Math.max(1, now - lastT) * 16; lastA = a; lastT = now; set();
    });
    var up = function () {
      if (!drag) return; drag = false;
      if (Math.abs(vel) > 12) charged();
      if (!G) return; var o = { r: rot };
      tw = G.to(o, { r: rot + vel * 24, duration: 1.8, ease: 'power3.out', onUpdate: function () { rot = o.r; set(); } });
    };
    m.addEventListener('pointerup', up); m.addEventListener('pointercancel', up);
    m.addEventListener('keydown', function (e) {
      var k = e.key; if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'Enter' && k !== ' ') return; e.preventDefault();
      if (!G) { rot += k === 'ArrowLeft' ? -30 : 30; set(); return; }
      var o = { r: rot }, add = k === 'ArrowLeft' ? -60 : k === 'ArrowRight' ? 60 : 720;
      if (tw) tw.kill(); tw = G.to(o, { r: rot + add, duration: add === 720 ? 1.4 : .5, ease: 'power3.out', onUpdate: function () { rot = o.r; set(); } });
      if (add === 720) charged();
    });
  }

  function bandura() {
    var svg = $('#bandSvg'), sg = $('#strings'), box = $('#bandura');
    var NOTES = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
    var COLS = ['#2AF3FF', '#FF2E63', '#FFE45E', '#2AF3FF', '#FF2E63', '#FFE45E', '#2AF3FF', '#FF2E63'];
    var strings = [], hinted = false;
    NOTES.forEach(function (f, i) {
      var x = 140 + i * 88, top = 40 + Math.abs(i - 3.5) * 6, bot = 260 - Math.abs(i - 3.5) * 6;
      var p = mk('path', { d: 'M' + x + ' ' + top + 'Q' + x + ' 150 ' + x + ' ' + bot, stroke: COLS[i], 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', opacity: .8 });
      sg.appendChild(mk('circle', { cx: x, cy: top, r: 7, fill: '#FFE45E', stroke: '#0C0618', 'stroke-width': 3 }));
      sg.appendChild(p); strings.push({ x: x, top: top, bot: bot, el: p, f: f, o: { b: 0 } });
    });
    function pluck(i, dir) {
      var s = strings[i]; if (!s) return;
      SS.pluck(s.f, .9, 'sawtooth', .07); SS.pluck(s.f * 2, .5, 'triangle', .03);
      if (!SS.soundOn && !hinted) { hinted = true; SS.toast(SS.L('Увімкніть «Звук» угорі, щоб почути бандуру.', 'Turn on Sound at the top to hear the bandura.')); }
      var draw = function () { s.el.setAttribute('d', 'M' + s.x + ' ' + s.top + 'Q' + (s.x + s.o.b) + ' 150 ' + s.x + ' ' + s.bot); };
      if (G && !SS.calm) { G.killTweensOf(s.o); s.o.b = (dir || 1) * 26; G.to(s.o, { b: 0, duration: 1.1, ease: 'elastic.out(1.4,.12)', onUpdate: draw }); G.fromTo(s.el, { opacity: 1, strokeWidth: 9 }, { opacity: .8, strokeWidth: 5, duration: .8 }); }
    }
    function toSvg(e) { var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); }
    var prev = null;
    svg.addEventListener('pointermove', function (e) {
      var p = toSvg(e);
      if (prev) strings.forEach(function (s, i) {
        if ((prev.x - s.x) * (p.x - s.x) < 0 && p.y > s.top && p.y < s.bot) pluck(i, p.x > prev.x ? 1 : -1);
      });
      prev = p;
    });
    svg.addEventListener('pointerleave', function () { prev = null; });
    svg.addEventListener('pointerdown', function (e) {
      var p = toSvg(e); prev = p; svg.setPointerCapture && e.pointerType !== 'mouse' && svg.setPointerCapture(e.pointerId);
      var best = -1, bd = 30; strings.forEach(function (s, i) { var d = Math.abs(s.x - p.x); if (d < bd) { bd = d; best = i; } });
      if (best >= 0) pluck(best, 1);
    });
    box.tabIndex = 0;
    box.addEventListener('keydown', function (e) { var n = parseInt(e.key, 10); if (n >= 1 && n <= 8) { e.preventDefault(); pluck(n - 1, 1); } });
  }

  function ambient() {
    if (!G || SS.reduce) return;
    G.from('.t-art svg', { y: 60, opacity: 0, duration: .9, ease: 'back.out(1.6)' });
    G.from('#mace', { scale: 0, rotation: -180, duration: 1, ease: 'back.out(2)', delay: .4 });
    SS.ambient(G.fromTo('.visor-scan', { attr: { x: 124 } }, { attr: { x: 256 }, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('.chub', { rotation: 6, svgOrigin: '210 92', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('.circuit', { opacity: .3, duration: .4, yoyo: true, repeat: -1, repeatDelay: 1.2, ease: 'steps(2)' }));
  }

  SS.tourPage({
    id: 'cybersich', en: EN, outfit: 'cossack', tips: TIPS, fx: 'sparks',
    drone: { base: 55, type: 'sawtooth', cut: 650, lfo: .2, vol: .035 },
    weather: { temp: [12, 22], vals: [{ id: 'wx-a', min: 55, max: 95, unit: '%' }, { id: 'wx-b', min: 2, max: 9 }] },
    init: function () {
      petr = $('#petr'); buildPetr(); petrScroll(); mace(); bandura(); ambient();
      $('#regrow').addEventListener('click', regrow);
      var t = $('.glitch');
      var syncGlitch = function () { t.setAttribute('data-text', t.textContent); t.setAttribute('aria-label', t.textContent); };
      syncGlitch(); document.addEventListener('ss:lang', syncGlitch);
    }
  });
})();
