(function () {
  'use strict';
  var SS = window.SS, G = SS.G, $ = SS.$, $$ = SS.$$;

  var EN = {
    kick: 'BUILDER', tagA: 'A', tagB: 'B', title: 'Stitch your own world',
    lead: 'Pick two worlds that were never meant to meet and use the slider to decide which one dominates. Stitchy will stitch them together and invent a name and a description, and you can download the picture or book a trip.',
    pickA: 'First world', pickB: 'Second world', ratio: 'Proportion', stitch: 'Stitch!', rand: 'Random mix', pairs: 'Different pairs stitched:', recent: 'Recent mixes',
    cvAlt: 'A scene of two stitched worlds', palette: 'World palette', tr1: 'Adventure', tr2: 'Coziness', tr3: 'Weirdness', dl: 'Download picture', book: 'Book this world'
  };
  var TIPS = [
    ['Оберіть два світи і натисніть «Зшити!». Я вже тримаю голку.', 'Pick two worlds and press Stitch! I’m holding the needle.'],
    ['Повзунок пересуває шов. Що більше світу, то більше його в назві.', 'The slider moves the seam. The bigger the world, the more it shapes the name.'],
    ['Клікніть на колір палітри, щоб скопіювати його код.', 'Click a palette colour to copy its code.'],
    ['Усього 28 пар. Я зшив кожну щонайменше двічі.', 'There are 28 pairs. I’ve stitched each one at least twice.']
  ];

  var st = { a: 'space', b: 'ocean', p: 50 }, shown = { a: 'space', b: 'ocean', p: 50 }, stitchT = -1e9, cv, t0 = performance.now();
  var W = 1200, H = 750, scene = null;

  function render(now) {
    var t = SS.calm ? 2 : (now - t0) / 1000;
    var prog = Math.min(1, Math.max(0, (now - stitchT) / 1100)), e = 1 - Math.pow(1 - prog, 3);
    scene.draw(shown, t, e);
  }
  var visible = true;
  function loop(now) { if (visible) render(now); requestAnimationFrame(loop); }

  function renderPickers() {
    ['A', 'B'].forEach(function (side) {
      var box = $('#w' + side);
      box.innerHTML = SS.WORLDS.map(function (w) {
        return '<button type="button" class="wbtn" data-side="' + side + '" data-id="' + w.id + '" data-noboom><i style="background:' + w.bg + ';--c2:' + w.acc + '"></i><span>' + SS.L(w.ua, w.en) + '</span></button>';
      }).join('');
    });
    syncPickers();
  }
  function syncPickers() {
    $$('.wbtn').forEach(function (b) {
      var side = b.getAttribute('data-side'), id = b.getAttribute('data-id'), mine = side === 'A' ? st.a : st.b, other = side === 'A' ? st.b : st.a;
      b.setAttribute('aria-pressed', id === mine ? 'true' : 'false'); b.disabled = id === other;
    });
    var r = $('#ratio'); r.value = st.p; r.style.setProperty('--v', ((st.p - 20) / 60 * 100) + '%');
    var A = SS.worldById(st.a), B = SS.worldById(st.b);
    $('#rA').textContent = SS.L(A.ua, A.en) + ' ' + st.p + '%'; $('#rB').textContent = SS.L(B.ua, B.en) + ' ' + (100 - st.p) + '%';
  }
  function showResult(animate) {
    var name = SS.mixName(shown.a, shown.b, shown.p), A = SS.worldById(shown.a), B = SS.worldById(shown.b);
    $('#mName').textContent = name; $('#mDesc').textContent = SS.mixDesc(shown.a, shown.b, shown.p);
    var pal = [A.bg, A.acc, SS.mixColor(A.bg, B.bg, .5), B.acc, B.bg];
    $('#sw').innerHTML = pal.map(function (h) { return '<button type="button" data-hex="' + h.toUpperCase() + '" data-noboom aria-label="' + SS.L('Скопіювати колір ', 'Copy colour ') + h + '"><i style="background:' + h + '"></i><span>' + h.toUpperCase() + '</span></button>'; }).join('');
    var tr = SS.mixTraits(shown.a, shown.b, shown.p);
    tr.forEach(function (v, i) { $('#t' + i).textContent = v.toFixed(1) + '/10'; $('#b' + i).style.width = (v * 10) + '%'; });
    $('#bookMix').setAttribute('href', 'Klymchuk_booking.html?custom=' + shown.a + '-' + shown.b + '-' + shown.p);
    if (animate && G && !SS.calm) { G.fromTo('#mName', { scale: .6, rotation: -4 }, { scale: 1, rotation: 0, duration: .5, ease: 'back.out(3)' }); G.from('#sw button', { y: 20, stagger: .06, duration: .4, ease: 'back.out(3)' }); }
  }
  function stitch(animate) {
    shown = { a: st.a, b: st.b, p: st.p };
    stitchT = animate && !SS.calm ? performance.now() : -1e9;
    showResult(animate); render(performance.now());
    if (animate && innerWidth < 980) { var fr = cv.getBoundingClientRect(); if (fr.top < 60 || fr.bottom > innerHeight) cv.scrollIntoView({ behavior: SS.calm ? 'auto' : 'smooth', block: 'center' }); }
    if (animate) {
      for (var i = 0; i < 8; i++) setTimeout(function () { SS.noise(.06, .1, 3000); }, i * 120);
      setTimeout(function () { SS.pluck(523, .4, 'triangle'); SS.pluck(784, .6, 'triangle'); }, 1000);
      var r = cv.getBoundingClientRect(); setTimeout(function () { SS.boom(r.left + r.width * st.p / 100, r.top + r.height * .45, SS.L('ЗШИТО!', 'STITCHED!')); }, 1050);
      remember();
    }
  }
  function remember() {
    var list = SS.store.get('mixes', []).filter(function (m) { return !(m.a === st.a && m.b === st.b && m.p === st.p); });
    list.unshift({ a: st.a, b: st.b, p: st.p }); SS.store.set('mixes', list.slice(0, 6));
    var pairs = SS.store.get('pairs', []), k = [st.a, st.b].sort().join('+');
    if (pairs.indexOf(k) < 0) { pairs.push(k); SS.store.set('pairs', pairs); }
    renderRecent();
  }
  function renderRecent() {
    var list = SS.store.get('mixes', []), box = $('#recent');
    box.innerHTML = list.length ? list.map(function (m, i) { return '<button type="button" data-i="' + i + '">' + SS.mixName(m.a, m.b, m.p) + '</button>'; }).join('') : '<span class="empty">' + SS.L('Тут з’являться ваші зшиті світи.', 'Your stitched worlds will appear here.') + '</span>';
    $$('button', box).forEach(function (b) { b.addEventListener('click', function () { var m = list[+b.getAttribute('data-i')]; st = { a: m.a, b: m.b, p: m.p }; syncPickers(); stitch(true); }); });
    $('#pairsN').textContent = SS.store.get('pairs', []).length + '/28';
  }
  function download() {
    render(performance.now() + 5000);
    var name = SS.mixName(shown.a, shown.b, shown.p, 'en').replace(/[^A-Za-z0-9]+/g, '_');
    var done = function (url, revoke) {
      var a = document.createElement('a'); a.href = url; a.download = 'Klymchuk_' + name + '.png'; document.body.appendChild(a); a.click(); a.remove();
      if (revoke) setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      SS.toast(SS.L('Картинку збережено. Шукайте її в «Завантаженнях».', 'Picture saved. Look for it in your Downloads.'));
    };
    try { cv.toBlob(function (b) { if (b) done(URL.createObjectURL(b), true); else done(cv.toDataURL('image/png')); }, 'image/png'); }
    catch (e) { SS.toast(SS.L('Браузер не дозволив зберегти картинку.', 'The browser did not allow saving the picture.')); }
  }

  function init() {
    cv = $('#cv'); scene = SS.makeScene(cv);
    renderPickers(); renderRecent();
    document.addEventListener('click', function (e) {
      var b = e.target.closest('.wbtn'); if (!b || b.disabled) return;
      if (b.getAttribute('data-side') === 'A') st.a = b.getAttribute('data-id'); else st.b = b.getAttribute('data-id');
      syncPickers(); SS.blip(500, .1, 'triangle');
      if (G && !SS.calm) G.fromTo(b, { scale: .85 }, { scale: 1, duration: .4, ease: 'back.out(3)' });
    });
    $('#ratio').addEventListener('input', function (e) { st.p = +e.target.value; syncPickers(); if (shown.a === st.a && shown.b === st.b) { shown.p = st.p; showResult(false); } });
    $('#cForm').addEventListener('submit', function (e) { e.preventDefault(); stitch(true); });
    $('#rand').addEventListener('click', function () {
      var ids = SS.WORLDS.map(function (w) { return w.id; }), a = SS.pick(ids), b; do { b = SS.pick(ids); } while (b === a);
      st = { a: a, b: b, p: 20 + ((Math.random() * 13) | 0) * 5 }; syncPickers(); stitch(true);
    });
    $('#sw').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var hex = b.getAttribute('data-hex');
      var ok = function () { SS.toast(SS.L('Колір ' + hex + ' скопійовано.', 'Colour ' + hex + ' copied.')); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(hex).then(ok, function () { SS.toast(hex); }); else SS.toast(hex);
    });
    $('#dl').addEventListener('click', download);
    document.addEventListener('ss:lang', function () { renderPickers(); renderRecent(); showResult(false); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(cv);
    var t = $('#cTitle'); if (G && !SS.reduce) { SS.splitChars(t); G.from($$('.ch', t), { yPercent: 100, rotation: function () { return SS.rand(-20, 20); }, opacity: 0, stagger: .03, duration: .5, ease: 'back.out(2)' }); document.addEventListener('ss:lang', function () { SS.splitChars(t); }); }
    if (G && !SS.reduce) G.from('.c-panel', { x: -40, rotation: -2, duration: .7, ease: 'back.out(1.7)' });
    stitch(false);
    if (!SS.calm) stitchT = performance.now() + 400;
    requestAnimationFrame(loop);
  }

  SS.boot({ en: EN, outfit: 'builder', tips: TIPS, drone: { base: 130.8, type: 'triangle', cut: 1000, lfo: .18, vol: .03 }, init: init });
})();
