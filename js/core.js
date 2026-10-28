(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var G = (SS.G = window.gsap || null);
  if (G && window.ScrollTrigger) G.registerPlugin(window.ScrollTrigger);
  var html = document.documentElement;
  var $ = (SS.$ = function (s, r) { return (r || document).querySelector(s); });
  var $$ = (SS.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); });
  var NS = 'http://www.w3.org/2000/svg';
  SS.mk = function (tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; };
  SS.rand = function (a, b) { return a + Math.random() * (b - a); };
  SS.pick = function (arr) { return arr[(Math.random() * arr.length) | 0]; };

  var store = (SS.store = {
    get: function (k, d) { try { var v = localStorage.getItem('ss_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ss_' + k, JSON.stringify(v)); } catch (e) {} }
  });
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  SS.reduce = reduce;
  SS.calm = store.get('calm', reduce);
  SS.lang = store.get('lang', 'ua');
  SS.soundOn = store.get('sound', false);
  SS.page = document.body.getAttribute('data-page') || 'home';
  SS.world = document.body.getAttribute('data-world') || 'home';
  if (SS.calm) html.classList.add('calm');

  SS.TOURS = [
    { id: 'kosmodrom', file: 'Klymchuk_tour-kosmodrom.html', ua: 'Підводний космодром', en: 'Underwater Spaceport', mixUa: ['Космос', 'Океан'], mixEn: ['Space', 'Ocean'], color: '#2BBEF0', days: 4, price: 4 },
    { id: 'cybersich', file: 'Klymchuk_tour-cybersich.html', ua: 'Кібер-Січ', en: 'Cyber-Sich', mixUa: ['Козаччина', 'Кіберпанк'], mixEn: ['Cossacks', 'Cyberpunk'], color: '#FF2E63', days: 3, price: 3 },
    { id: 'lis', file: 'Klymchuk_tour-lis-robotiv.html', ua: 'Ліс роботів', en: 'Robot Forest', mixUa: ['Природа', 'Технології'], mixEn: ['Nature', 'Technology'], color: '#3CCB7F', days: 2, price: 2 },
    { id: 'lab', file: 'Klymchuk_tour-kazkova-laboratoriya.html', ua: 'Казкова лабораторія', en: 'Fairy-tale Lab', mixUa: ['Казка', 'Наука'], mixEn: ['Fairy tale', 'Science'], color: '#7A5CFA', days: 3, price: 3 }
  ];
  SS.tour = function (id) { for (var i = 0; i < SS.TOURS.length; i++) if (SS.TOURS[i].id === id) return SS.TOURS[i]; return null; };

  SS.EN = {};
  SS.UA = {};
  SS.addEN = function (o) { for (var k in o) SS.EN[k] = o[k]; };
  SS.L = function (ua, en) { return SS.lang === 'en' && en != null ? en : ua; };
  SS.addEN({
    'nav.tours': 'Tours', 'nav.build': 'Builder', 'nav.book': 'Booking', 'nav.tickets': 'My tickets', 'nav.home': 'Home',
    'brand': 'Worldseam', 'chip.sound': 'Sound', 'chip.calm': 'Less motion', 'menu.open': 'Open menu', 'menu.close': 'Close menu',
    'loader.t': 'STITCHING WORLDS...', 'loader.skip': 'SKIP',
    'foot.about': 'A travel agency for worlds that never were. We stitch together what does not fit in real life.',
    'foot.worlds': 'Worlds', 'foot.agency': 'Agency', 'foot.how': 'How it works', 'foot.faq': 'Questions',
    'foot.legal1': 'Competition entry for CreDiCo 2026, theme “A mix of worlds: combine the incompatible”.',
    'foot.legal2': 'Author: Serhii Klymchuk. All graphics drawn in code, fonts under SIL OFL.',
    'guide.close': 'Hide hint', 'menu.main': 'Main menu', 'menu.lbl': 'Menu', 'rate5': '5 out of 5', 'guide.btn': 'Stitchy the guide: click for a tip'
  });
  function captureUA(el, key, mode, attr) {
    if (SS.UA[key] != null) return;
    SS.UA[key] = mode === 'attr' ? el.getAttribute(attr) : mode === 'html' ? el.innerHTML : el.textContent;
  }
  SS.applyLang = function () {
    var en = SS.lang === 'en';
    html.lang = en ? 'en' : 'uk';
    $$('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n'); captureUA(el, k, 'text');
      var v = en ? SS.EN[k] : SS.UA[k]; if (v != null) el.textContent = v;
    });
    $$('[data-i18n-html]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-html'); captureUA(el, k, 'html');
      var v = en ? SS.EN[k] : SS.UA[k]; if (v != null) el.innerHTML = v;
    });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); if (p.length < 2) return; var attr = p[0].trim(), k = p[1].trim();
        captureUA(el, k, 'attr', attr); var v = en ? SS.EN[k] : SS.UA[k]; if (v != null) el.setAttribute(attr, v);
      });
    });
    $$('[data-lang]').forEach(function (b) { b.textContent = en ? 'UA' : 'EN'; b.setAttribute('aria-label', en ? 'Перемкнути на українську' : 'Switch to English'); });
    document.dispatchEvent(new CustomEvent('ss:lang', { detail: SS.lang }));
  };

  var NAV = [
    { href: 'index.html#tours', k: 'nav.tours', ua: 'Тури', page: 'tours' },
    { href: 'Klymchuk_constructor.html', k: 'nav.build', ua: 'Конструктор', page: 'constructor' },
    { href: 'Klymchuk_booking.html', k: 'nav.book', ua: 'Бронювання', page: 'booking' },
    { href: 'Klymchuk_booking.html#tickets', k: 'nav.tickets', ua: 'Мої квитки', page: 'tickets' }
  ];
  function logoSVG() {
    return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#FFC93C" stroke="#1A1423" stroke-width="3"/><path d="M24 3a21 21 0 0 0 0 42z" fill="#2BBEF0" stroke="#1A1423" stroke-width="3"/><path d="M24 6v36" stroke="#FF4F9A" stroke-width="3" stroke-dasharray="4 4"/><path d="M19 12l10 4M19 20l10 4M19 28l10 4M19 36l10 4" stroke="#1A1423" stroke-width="2.5" stroke-linecap="round"/></svg>';
  }
  function toggles() {
    return '<button class="chip" type="button" data-lang>EN</button>' +
      '<button class="chip" type="button" data-sound aria-pressed="false">♪ <span data-i18n="chip.sound">Звук</span></button>' +
      '<button class="chip" type="button" data-calm aria-pressed="false" data-i18n="chip.calm">Менше руху</button>';
  }
  function buildHeader() {
    var slot = $('#ss-header'); if (!slot) return;
    var cur = SS.page === 'tour' ? 'tours' : SS.page;
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (n.page === cur ? ' aria-current="page"' : '') + ' data-i18n="' + n.k + '">' + n.ua + '</a>';
    }).join('');
    slot.outerHTML =
      '<header class="top"><div class="wrap">' +
      '<a class="logo" href="index.html" aria-label="Шов Світів" data-i18n-attr="aria-label:brand">' + logoSVG() + '<span data-i18n="brand">Шов Світів</span></a>' +
      '<nav class="nav-links" aria-label="Головне меню" data-i18n-attr="aria-label:menu.main">' + links + '</nav>' +
      '<div class="tgl">' + toggles() + '</div>' +
      '<button class="burger" type="button" aria-expanded="false" aria-controls="ss-menu" data-i18n-attr="aria-label:menu.open" aria-label="Відкрити меню"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h12" stroke="#1A1423" stroke-width="3" stroke-linecap="round"/></svg></button>' +
      '</div></header>' +
      '<div class="thread-progress" aria-hidden="true"><i></i></div>' +
      '<div class="menu" id="ss-menu" hidden role="dialog" aria-modal="true" aria-label="Меню" data-i18n-attr="aria-label:menu.lbl">' +
      '<button class="close" type="button" data-i18n-attr="aria-label:menu.close" aria-label="Закрити меню">×</button>' +
      '<nav><a href="index.html"' + (SS.page === 'home' ? ' aria-current="page"' : '') + ' data-i18n="nav.home">Головна</a>' + links + '</nav>' +
      '<div class="tgl">' + toggles() + '</div></div>';
  }
  function buildFooter() {
    var slot = $('#ss-footer'); if (!slot) return;
    var worlds = SS.TOURS.map(function (t) { return '<li><a href="' + t.file + '" data-tour-name="' + t.id + '">' + t.ua + '</a></li>'; }).join('');
    slot.outerHTML =
      '<footer class="foot"><div class="wrap">' +
      '<div><div class="brand" data-i18n="brand">Шов Світів</div><p data-i18n="foot.about">Турагенція у світи, яких не буває. Зшиваємо те, що в реальності не поєднується.</p></div>' +
      '<div><h4 data-i18n="foot.worlds">Світи</h4><ul>' + worlds + '</ul></div>' +
      '<div><h4 data-i18n="foot.agency">Агенція</h4><ul>' +
      '<li><a href="index.html#how" data-i18n="foot.how">Як це працює</a></li>' +
      '<li><a href="Klymchuk_constructor.html" data-i18n="nav.build">Конструктор</a></li>' +
      '<li><a href="Klymchuk_booking.html" data-i18n="nav.book">Бронювання</a></li>' +
      '<li><a href="index.html#faq" data-i18n="foot.faq">Запитання</a></li></ul></div>' +
      '<div class="legal"><span data-i18n="foot.legal1">Конкурсна робота CreDiCo 2026, тема «Мікс світів: поєднай непоєднуване».</span>' +
      '<span data-i18n="foot.legal2">Автор: Климчук Сергій. Уся графіка намальована кодом, шрифти за ліцензією SIL OFL.</span></div>' +
      '</div></footer>';
  }
  function tourNames() {
    $$('[data-tour-name]').forEach(function (a) { var t = SS.tour(a.getAttribute('data-tour-name')); if (t) a.textContent = SS.L(t.ua, t.en); });
  }

  function initMenu() {
    var menu = $('#ss-menu'), burger = $('.burger'); if (!menu || !burger) return;
    function open() {
      menu.hidden = false; burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden';
      if (G && !SS.calm) { G.fromTo(menu, { clipPath: 'circle(0% at 95% 4%)' }, { clipPath: 'circle(150% at 95% 4%)', duration: .5, ease: 'power3.out' }); G.from($$('nav a', menu), { x: 60, opacity: 0, stagger: .05, duration: .4, delay: .1 }); }
      $('.close', menu).focus();
    }
    function close() { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; burger.focus(); }
    burger.addEventListener('click', open);
    $('.close', menu).addEventListener('click', close);
    menu.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    $$('nav a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.hidden = true; document.body.style.overflow = ''; }); });
  }

  var toastT;
  SS.toast = function (msg, ms) {
    var t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    if (G && !SS.calm) G.fromTo(t, { y: 30, scale: .8 }, { y: 0, scale: 1, duration: .35, ease: 'back.out(3)' });
    clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, ms || 2600);
  };

  var ac = null, drone = null, droneCfg = { base: 110, type: 'triangle', cut: 900, lfo: .15, vol: .035 };
  function ctx() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; } } return ac; }
  SS.blip = function (f, d, type, vol) {
    if (!SS.soundOn || !ctx()) return; f = f || 520; d = d || .12;
    var t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.8, t + d);
    g.gain.setValueAtTime(vol || .07, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .02);
  };
  SS.pluck = function (f, d, type, vol) {
    if (!SS.soundOn || !ctx()) return; d = d || .5;
    var t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), fl = ac.createBiquadFilter();
    o.type = type || 'sawtooth'; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.setValueAtTime(3000, t); fl.frequency.exponentialRampToValueAtTime(300, t + d);
    g.gain.setValueAtTime(vol || .08, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(fl); fl.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .02);
  };
  SS.noise = function (d, vol, freq) {
    if (!SS.soundOn || !ctx()) return; d = d || .3;
    var len = ac.sampleRate * d, buf = ac.createBuffer(1, len, ac.sampleRate), data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = buf; fl.type = 'bandpass'; fl.frequency.value = freq || 1200; g.gain.value = vol || .12;
    s.connect(fl); fl.connect(g); g.connect(ac.destination); s.start();
  };
  function startDrone() {
    if (!ctx()) return; stopDrone(); ac.resume && ac.resume();
    var c = droneCfg, out = ac.createGain(), f = ac.createBiquadFilter();
    out.gain.value = 0; out.connect(ac.destination);
    f.type = 'lowpass'; f.frequency.value = c.cut; f.connect(out);
    var nodes = [c.base, c.base * 1.5, c.base * 2.005].map(function (fr, i) {
      var o = ac.createOscillator(); o.type = c.type; o.frequency.value = fr; o.detune.value = (i - 1) * 7; o.connect(f); o.start(); return o;
    });
    var l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = c.lfo; lg.gain.value = c.cut * .45; l.connect(lg); lg.connect(f.frequency); l.start();
    nodes.push(l);
    out.gain.linearRampToValueAtTime(c.vol, ac.currentTime + 1.5);
    drone = { out: out, nodes: nodes };
  }
  function stopDrone() {
    if (!drone || !ac) return; var d = drone; drone = null;
    d.out.gain.cancelScheduledValues(ac.currentTime); d.out.gain.setValueAtTime(d.out.gain.value, ac.currentTime); d.out.gain.linearRampToValueAtTime(0, ac.currentTime + .4);
    setTimeout(function () { d.nodes.forEach(function (n) { try { n.stop(); } catch (e) {} }); }, 500);
  }
  function setSound(on) {
    SS.soundOn = on; store.set('sound', on);
    $$('[data-sound]').forEach(function (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    if (on) { startDrone(); SS.blip(660); } else stopDrone();
  }
  function setCalm(on) {
    SS.calm = on; store.set('calm', on); html.classList.toggle('calm', on);
    $$('[data-calm]').forEach(function (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    ambient.forEach(function (tw) { on ? tw.pause() : tw.resume(); });
    document.dispatchEvent(new CustomEvent('ss:calm', { detail: on }));
  }
  var ambient = [];
  SS.ambient = function (tw) { if (!tw) return tw; ambient.push(tw); if (SS.calm) tw.pause(); return tw; };

  function initToggles() {
    $$('[data-sound]').forEach(function (b) { b.setAttribute('aria-pressed', SS.soundOn ? 'true' : 'false'); b.addEventListener('click', function () { setSound(!SS.soundOn); }); });
    $$('[data-calm]').forEach(function (b) { b.setAttribute('aria-pressed', SS.calm ? 'true' : 'false'); b.addEventListener('click', function () { setCalm(!SS.calm); }); });
    $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { SS.lang = SS.lang === 'en' ? 'ua' : 'en'; store.set('lang', SS.lang); SS.applyLang(); SS.blip(440); }); });
    if (SS.soundOn) {
      var once = function () { startDrone(); window.removeEventListener('pointerdown', once); window.removeEventListener('keydown', once); };
      window.addEventListener('pointerdown', once); window.addEventListener('keydown', once);
    }
  }

  var WORDS_UA = ['БАМ!', 'ВЖУХ!', 'ДЗИНЬ!', 'ХЛОП!', 'БУМ!', 'ШУХ!', 'ТИЦЬ!', 'ГОП!'];
  var WORDS_EN = ['BAM!', 'WHOOSH!', 'ZAP!', 'POP!', 'BOOM!', 'SWISH!', 'BOING!', 'POW!'];
  var BOOM_C = ['#FFC93C', '#FF4F9A', '#2BBEF0', '#3CCB7F', '#FFE45E', '#C6F432'];
  SS.boom = function (x, y, word) {
    if (SS.calm || !G) return;
    var b = document.createElement('div'); b.className = 'boom';
    b.textContent = word || SS.pick(SS.lang === 'en' ? WORDS_EN : WORDS_UA);
    b.style.color = SS.pick(BOOM_C); document.body.appendChild(b);
    G.set(b, { x: x, y: y, xPercent: -50, yPercent: -50 });
    G.fromTo(b, { scale: 0, rotation: -25 }, { scale: 1, rotation: SS.rand(-15, 15), y: y - 50, duration: .45, ease: 'back.out(3)' });
    G.to(b, { opacity: 0, y: y - 95, duration: .35, delay: .45, onComplete: function () { b.remove(); } });
  };
  function initBoom() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('button,a,[data-boom]');
      if (!t || t.hasAttribute('data-noboom')) return;
      SS.blip(SS.rand(380, 780));
      if (e.clientX || e.clientY) SS.boom(e.clientX, e.clientY);
    });
  }

  function initEyes() {
    var raf = 0, mx = 0, my = 0;
    document.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        $$('.pupil').forEach(function (p) {
          var r = p.getBoundingClientRect(); if (!r.width) return;
          var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          var a = Math.atan2(my - cy, mx - cx), d = Math.min(+(p.getAttribute('data-range') || 5), Math.hypot(mx - cx, my - cy) / 40);
          p.style.transform = 'translate(' + (Math.cos(a) * d).toFixed(2) + 'px,' + (Math.sin(a) * d).toFixed(2) + 'px)';
        });
      });
    }, { passive: true });
  }

  function initProgress() {
    var bar = $('.thread-progress'); if (!bar) return;
    var upd = function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--p', h > 0 ? (scrollY / h).toFixed(4) : 0);
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  var INK = '#1A1423';
  var OUTFIT = {
    none: '',
    space: '<circle r="80" fill="rgba(180,235,255,.22)" stroke="' + INK + '" stroke-width="4"/><path d="M-52-42a68 68 0 0 1 40-26" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/><path d="M0-80v-18" stroke="' + INK + '" stroke-width="4"/><circle cy="-102" r="7" fill="#FF4F9A" stroke="' + INK + '" stroke-width="3"/>',
    cossack: '<path d="M-4-56c-6-30 10-52 40-60-18 16-20 32-8 46 14 16 40 22 48 50-18-20-42-22-62-26" fill="' + INK + '"/>',
    cossackFace: '<path transform="translate(0 18) scale(.58)" d="M0 14c-14-10-36-8-48 6-10 10-20 16-30 14 12 12 36 12 50 0 10-8 20-10 28-10s18 2 28 10c14 12 38 12 50 0-10 2-20-4-30-14-12-14-34-16-48-6z" fill="' + INK + '"/><circle cx="56" cy="22" r="7" fill="none" stroke="#FFE45E" stroke-width="4"/>',
    robot: '<g transform="translate(0 -70)"><path class="gear-hat" d="M0-30l7 9 11-3 1 11 11 2-4 10 8 8-9 6 3 11-11 1-2 11-10-4-6 9-6-9-10 4-2-11-11-1 3-11-9-6 8-8-4-10 11-2 1-11 11 3z" fill="#FF8A3D" stroke="' + INK + '" stroke-width="4"/><circle r="9" fill="#FFFDF7" stroke="' + INK + '" stroke-width="3"/></g><path d="M44-40l18-22" stroke="' + INK + '" stroke-width="4"/><circle cx="64" cy="-64" r="6" fill="#3CCB7F" stroke="' + INK + '" stroke-width="3"/>',
    witch: '<ellipse cx="0" cy="-46" rx="74" ry="13" fill="#7A5CFA" stroke="' + INK + '" stroke-width="4"/><path d="M-46-48C-30-80-10-130 22-150c-8 24-2 44 6 56l18 46z" fill="#7A5CFA" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M-40-58c26 8 58 8 84 0" stroke="#C6F432" stroke-width="7" fill="none"/><path d="M8-96l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#C6F432" stroke="' + INK + '" stroke-width="2"/>',
    conductor: '<path d="M-48-40c0-28 22-44 48-44s48 16 48 44z" fill="#2BBEF0" stroke="' + INK + '" stroke-width="4"/><path d="M-56-42h112l-14 14h-84z" fill="' + INK + '"/><circle cy="-62" r="10" fill="#FFC93C" stroke="' + INK + '" stroke-width="3"/>',
    builder: '<path d="M-52-38c0-32 24-50 52-50s52 18 52 50z" fill="#FFC93C" stroke="' + INK + '" stroke-width="4"/><path d="M-8-86h16v44h-16z" fill="#FF8A3D" stroke="' + INK + '" stroke-width="3"/><rect x="-66" y="-44" width="132" height="12" rx="6" fill="#FFC93C" stroke="' + INK + '" stroke-width="4"/>'
  };
  SS.stibok = function (outfit, group) {
    outfit = outfit || 'none';
    var face = outfit === 'cossack' ? OUTFIT.cossackFace : '<path d="M-16 20q16 14 32 0" stroke="' + INK + '" stroke-width="4" fill="#fff" stroke-linecap="round"/>';
    var g =
      '<g class="st-body">' +
      '<path d="M-30 52q-6 26-22 30M30 52q6 26 22 30" stroke="' + INK + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="-54" cy="84" rx="13" ry="7" fill="' + INK + '"/><ellipse cx="54" cy="84" rx="13" ry="7" fill="' + INK + '"/>' +
      '<circle r="58" fill="#FF4F9A" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M-50-26q40 20 98-6M-56 4q52 26 112-4M-44 36q44 14 88-6M-20-54q-24 50-4 108M22-54q20 54-2 110" stroke="' + INK + '" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>' +
      '<circle cx="-20" cy="-8" r="15" fill="#fff" stroke="' + INK + '" stroke-width="4"/><circle cx="20" cy="-8" r="15" fill="#fff" stroke="' + INK + '" stroke-width="4"/>' +
      '<circle class="pupil" cx="-20" cy="-8" r="6.5" fill="' + INK + '"/><circle class="pupil" cx="20" cy="-8" r="6.5" fill="' + INK + '"/>' +
      face +
      '<circle cx="-38" cy="14" r="7" fill="#FFC93C" opacity=".8"/><circle cx="38" cy="14" r="7" fill="#FFC93C" opacity=".8"/>' +
      '<path d="M52 -6q26 -10 34 -34" stroke="' + INK + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<g transform="translate(86 -42) rotate(-38)"><path d="M0 -44L5 30 0 40-5 30z" fill="#E9E6F2" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round"/><ellipse cy="-32" rx="2.2" ry="6" fill="' + INK + '"/></g>' +
      '<path d="M78 -72c-30 -30 -80 -10 -100 -60" stroke="#FFC93C" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      (OUTFIT[outfit] || '') +
      '</g>';
    return group ? g : '<svg viewBox="-115 -160 230 260" aria-hidden="true">' + g + '</svg>';
  };

  function initGuide(cfg) {
    if (cfg.guide === false) return;
    var tips = cfg.tips || [];
    var wrap = document.createElement('div'); wrap.className = 'guide';
    wrap.innerHTML =
      '<div class="g-bubble" hidden role="status"><span class="g-text"></span><button class="g-x" type="button" data-noboom data-i18n-attr="aria-label:guide.close" aria-label="Сховати підказку">×</button></div>' +
      '<button class="g-btn" type="button" data-noboom data-i18n-attr="aria-label:guide.btn" aria-label="Гід Стібок: натисніть для підказки">' + SS.stibok(cfg.outfit || 'none') + '</button>';
    document.body.appendChild(wrap);
    var bubble = $('.g-bubble', wrap), text = $('.g-text', wrap), btn = $('.g-btn', wrap), i = 0;
    var hideT;
    function autoHide() { clearTimeout(hideT); hideT = setTimeout(function () { if (!bubble.matches(':hover')) bubble.hidden = true; }, 8000); }
    function say(n) {
      if (!tips.length) return; var tip = tips[n % tips.length];
      text.textContent = SS.L(tip[0], tip[1]); bubble.hidden = false; autoHide();
      if (G && !SS.calm) G.fromTo(bubble, { scale: .4, transformOrigin: '100% 100%' }, { scale: 1, duration: .45, ease: 'back.out(3)' });
    }
    SS.guideSay = function (ua, en) { text.textContent = SS.L(ua, en); bubble.hidden = false; autoHide(); if (G && !SS.calm) G.fromTo(bubble, { scale: .6, transformOrigin: '100% 100%' }, { scale: 1, duration: .4, ease: 'back.out(3)' }); };
    btn.addEventListener('click', function () {
      i++; say(i); SS.blip(300, .25, 'triangle');
      if (G && !SS.calm) G.fromTo($('.st-body', btn), { rotation: 0 }, { rotation: 360, svgOrigin: '0 0', duration: .7, ease: 'back.inOut(1.6)' });
    });
    $('.g-x', wrap).addEventListener('click', function () { bubble.hidden = true; });
    document.addEventListener('ss:lang', function () { if (!bubble.hidden && !SS._guideCustom) say(i); });
    if (G && !SS.calm) SS.ambient(G.to($('.st-body', btn), { y: -6, duration: .9, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    setTimeout(function () { say(0); }, cfg.tipDelay || 2600);
  }

  SS.reveal = function (els, opts) {
    if (!G || !window.ScrollTrigger || SS.reduce) return;
    els = typeof els === 'string' ? $$(els) : els; if (!els.length) return;
    opts = opts || {};
    G.from(els, {
      y: opts.y != null ? opts.y : 60, rotation: opts.rot != null ? function (i) { return (i % 2 ? 1 : -1) * opts.rot; } : 0,
      scale: opts.scale || 1, duration: opts.d || .8, stagger: opts.stagger || .12, ease: opts.ease || 'back.out(1.7)',
      scrollTrigger: { trigger: opts.trigger || els[0], start: opts.start || 'top 88%' }
    });
  };
  SS.splitChars = function (el) {
    var t = el.getAttribute('data-split') || el.textContent;
    el.setAttribute('aria-label', t);
    el.innerHTML = t.split(' ').map(function (w) {
      return '<span style="display:inline-block;white-space:nowrap" aria-hidden="true">' + Array.prototype.map.call(w, function (c) { return '<span class="ch">' + c + '</span>'; }).join('') + '</span>';
    }).join(' ');
  };

  function ensureWipe() {
    var w = $('#wipe');
    if (!w) { w = document.createElement('div'); w.id = 'wipe'; w.setAttribute('aria-hidden', 'true'); w.innerHTML = '<span></span><span></span><span></span><span></span><b></b>'; document.body.appendChild(w); }
    return w;
  }
  function wipeOut() {
    var w = ensureWipe();
    try { sessionStorage.removeItem('ss_nav'); } catch (e) {}
    if (!G || SS.calm) { html.classList.remove('entering'); return; }
    G.set($$('span', w), { scaleY: 1 }); html.classList.remove('entering');
    G.to($$('span', w), { scaleY: 0, transformOrigin: 'bottom', stagger: .06, duration: .45, ease: 'power3.out', delay: .05 });
  }
  SS.go = function (href, word) {
    try { sessionStorage.setItem('ss_nav', '1'); } catch (e) {}
    if (!G || SS.calm) { location.href = href; return; }
    var w = ensureWipe(), b = $('b', w);
    b.textContent = word || SS.L('ВЖУХ!', 'WHOOSH!');
    SS.blip(240, .3, 'sawtooth');
    G.timeline({ onComplete: function () { location.href = href; } })
      .to($$('span', w), { scaleY: 1, transformOrigin: 'top', stagger: .06, duration: .35, ease: 'power3.in' })
      .to(b, { scale: 1, rotation: -6, duration: .25, ease: 'back.out(3)' }, '-=.1');
    setTimeout(function () { location.href = href; }, 1500);
  };
  function initLinks() {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
      var href = a.getAttribute('href'); if (!href || a.target || a.hasAttribute('download') || /^(https?:|mailto:|tel:|#)/.test(href)) return;
      var url = new URL(a.href, location.href);
      if (url.pathname === location.pathname) {
        if (url.hash && url.hash !== location.hash) return;
        if (url.hash) return;
      }
      e.preventDefault(); SS.go(a.href, a.getAttribute('data-word'));
    });
    addEventListener('pageshow', function (e) { if (e.persisted && G) { G.set($$('#wipe span'), { scaleY: 0 }); G.set('#wipe b', { scale: 0 }); } });
  }

  function runLoader(done) {
    var ld = $('#loader');
    var first = html.classList.contains('first');
    try { sessionStorage.setItem('ss_seen', '1'); } catch (e) {}
    if (!ld || !first) { done(); return; }
    var finish = function () { html.classList.remove('first'); ld.hidden = true; };
    if (!G || SS.calm) { finish(); done(); return; }
    var bars = $$('.ld-bar i', ld), n = { v: 0 }, cnt = $('#ldn');
    var tl = G.timeline({ onComplete: finish });
    tl.to(n, { v: 100, duration: 1.6, ease: 'power1.inOut', onUpdate: function () { if (cnt) cnt.textContent = (n.v | 0) + '%'; bars.forEach(function (b, i) { b.style.opacity = n.v >= (i + 1) * 10 - 5 ? 1 : 0; }); } })
      .to($('.ld', ld), { scale: .8, opacity: 0, duration: .25 })
      .to($('.thread', ld), { scaleY: 0, transformOrigin: 'top', duration: .25 }, '<')
      .add(done)
      .to($('.half.l', ld), { xPercent: -102, duration: .75, ease: 'power4.inOut' })
      .to($('.half.r', ld), { xPercent: 102, duration: .75, ease: 'power4.inOut' }, '<');
    var skip = $('.skip', ld); if (skip) skip.addEventListener('click', function () { tl.progress(1); });
  }

  SS.boot = function (cfg) {
    cfg = cfg || {};
    if (cfg.en) SS.addEN(cfg.en);
    if (cfg.drone) for (var k in cfg.drone) droneCfg[k] = cfg.drone[k];
    buildHeader(); buildFooter(); initGuide(cfg);
    SS.applyLang(); tourNames();
    document.addEventListener('ss:lang', tourNames);
    initMenu(); initToggles(); initBoom(); initEyes(); initProgress(); initLinks();
    var started = false;
    var start = function () { if (started) return; started = true; if (cfg.init) cfg.init(); if (window.ScrollTrigger) window.ScrollTrigger.refresh(); };
    if (html.classList.contains('entering')) { wipeOut(); start(); try { sessionStorage.setItem('ss_seen', '1'); } catch (e) {} }
    else runLoader(start);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); });
  };
})();
