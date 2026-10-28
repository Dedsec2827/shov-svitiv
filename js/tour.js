(function () {
  'use strict';
  var SS = window.SS, G = SS.G, $ = SS.$, $$ = SS.$$;

  SS.addEN({
    'tc.back': '← All worlds', 'tc.dur': 'Duration', 'tc.class': 'Class', 'tc.price': 'Price', 'tc.book': 'Book a seat',
    'tc.prog': 'Tour programme', 'tc.pack': 'What to bring', 'tc.more': 'Other worlds', 'tc.moreSub': 'The seam does not end here. Pick your next stop.',
    'tc.soundHint': 'Turn on the sound for the full atmosphere'
  });

  SS.cursorFX = function (kind) {
    var cv = document.createElement('canvas'); cv.className = 'overlay-canvas'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    var c = cv.getContext('2d'), parts = [], dpr = Math.min(2, window.devicePixelRatio || 1), running = false;
    function rs() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; }
    rs(); addEventListener('resize', rs);
    var COL = { bubbles: ['#FFFDF7', '#8BE3FF'], sparks: ['#2AF3FF', '#FF2E63', '#FFE45E'], leaves: ['#3CCB7F', '#FF8A3D', '#FFC93C'], stars: ['#C6F432', '#FF4F9A', '#FFFDF7'] }[kind];
    SS.spawn = function (x, y, n, power) {
      if (SS.calm) return;
      for (var i = 0; i < n; i++) {
        var p = power || 1;
        parts.push({ x: x, y: y, vx: SS.rand(-1.2, 1.2) * p, vy: (kind === 'bubbles' ? SS.rand(-1.6, -.4) : kind === 'leaves' ? SS.rand(-.6, .4) : SS.rand(-1.8, .6)) * p, l: 1, r: SS.rand(2, kind === 'bubbles' ? 7 : 4), c: SS.pick(COL), a: Math.random() * 6.28, s: SS.rand(-.1, .1) });
      }
      if (!running) { running = true; requestAnimationFrame(loop); }
    };
    var last = 0;
    addEventListener('pointermove', function (e) {
      if (SS.calm) return; var now = performance.now(); if (now - last < 24) return; last = now;
      SS.spawn(e.clientX, e.clientY, kind === 'sparks' ? 2 : 1);
    }, { passive: true });
    function loop() {
      c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter(function (p) { return p.l > 0; });
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i]; p.x += p.vx; p.y += p.vy; p.l -= kind === 'bubbles' ? .012 : .022; p.a += p.s;
        if (kind === 'sparks') p.vy += .05; if (kind === 'leaves') { p.vy += .03; p.vx += Math.sin(p.a) * .05; }
        if (kind === 'bubbles') p.vx += Math.sin(p.a * 3) * .03;
        c.globalAlpha = Math.max(0, p.l);
        if (kind === 'bubbles') { c.strokeStyle = p.c; c.lineWidth = 2; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.28); c.stroke(); }
        else if (kind === 'sparks') { c.fillStyle = p.c; c.shadowColor = p.c; c.shadowBlur = 10; c.fillRect(p.x, p.y, 3, 3); c.shadowBlur = 0; }
        else if (kind === 'leaves') { c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.fillStyle = p.c; c.strokeStyle = '#16241A'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(0, 0, p.r * 1.8, p.r, 0, 0, 6.28); c.fill(); c.stroke(); c.restore(); }
        else { c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.fillStyle = p.c; c.beginPath(); for (var k = 0; k < 8; k++) { var rr = k % 2 ? p.r * .4 : p.r * 1.4, an = k * Math.PI / 4; c.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } c.fill(); c.restore(); }
      }
      c.globalAlpha = 1;
      if (parts.length) requestAnimationFrame(loop); else { running = false; c.clearRect(0, 0, innerWidth, innerHeight); }
    }
  };

  function weather(cfg) {
    var t = $('#wx-temp'); if (!t || !cfg) return;
    function tick() {
      var v = Math.round(SS.rand(cfg.temp[0], cfg.temp[1]));
      t.textContent = (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°';
      (cfg.vals || []).forEach(function (o) { var el = $('#' + o.id); if (el) el.textContent = Math.round(SS.rand(o.min, o.max)) + (o.unit || ''); });
    }
    tick(); setInterval(tick, 3200);
  }

  function more(id) {
    var box = $('#more'); if (!box) return;
    function render() {
      box.innerHTML = SS.TOURS.filter(function (t) { return t.id !== id; }).map(function (t) {
        var mix = SS.lang === 'en' ? t.mixEn : t.mixUa;
        return '<a href="' + t.file + '" style="--c:' + t.color + '"><span class="dot" aria-hidden="true"></span><span><b>' + SS.L(t.ua, t.en) + '</b><small>' + mix.join(' + ') + '</small></span></a>';
      }).join('');
    }
    render(); document.addEventListener('ss:lang', render);
  }

  SS.tourPage = function (cfg) {
    var init = cfg.init;
    cfg.init = function () {
      $$('[data-book]').forEach(function (a) { a.setAttribute('href', 'Klymchuk_booking.html?tour=' + cfg.id); a.setAttribute('data-word', SS.L('В ДОРОГУ!', 'LET’S GO!')); });
      more(cfg.id); weather(cfg.weather);
      if (cfg.fx) SS.cursorFX(cfg.fx);
      var title = $('.t-title');
      if (title && G && !SS.reduce) {
        var txt = title.textContent; title.setAttribute('aria-label', txt);
        if (!title.classList.contains('glitch')) {
          SS.splitChars(title);
          G.from($$('.ch', title), { yPercent: 100, rotation: function () { return SS.rand(-20, 20); }, opacity: 0, stagger: .04, duration: .6, ease: 'back.out(2)' });
        } else G.from(title, { scale: 1.3, opacity: 0, duration: .5, ease: 'power3.out' });
        G.from('.stat', { y: 20, rotation: function (i) { return (i - 1) * 5; }, stagger: .1, delay: .3, duration: .5, ease: 'back.out(2)' });
        document.addEventListener('ss:lang', function () { if (!title.classList.contains('glitch')) SS.splitChars(title); });
      }
      SS.reveal('.day', { y: 70, rot: 3, trigger: '.days' });
      SS.reveal('.panel', { y: 40, trigger: '.side' });
      SS.reveal('#more a', { y: 40, trigger: '#more' });
      if (init) init();
    };
    SS.boot(cfg);
  };
})();
