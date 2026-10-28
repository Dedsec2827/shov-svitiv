(function () {
  'use strict';
  var SS = window.SS, G = SS.G, $ = SS.$, $$ = SS.$$;
  var INK = '#1A1423';

  var EN = {
    kick: 'BOX OFFICE', title: 'Booking', lead: 'Three steps to a ticket for a world that does not exist. Pay in dreams, get your ticket instantly.',
    st1: 'World', st2: 'When and how many', st3: 'Class and traveller',
    p1t: 'Where are we going?', p1s: 'Pick one of the season’s tours or a world you stitched in the builder.',
    p2t: 'When do we leave?', p2s: 'Time is stitched in our worlds too, so pick an era first, then a day.',
    eraL: 'Era', dayL: 'Day', trav: 'Travellers:', less: 'Fewer travellers', more: 'More travellers',
    p3t: 'How do we travel?', p3s: 'The class affects the price and how soft the landing is.',
    nameL: 'Traveller’s name', nameP: 'For example, Oksana Zirka', agree: 'I understand the world is made up, but the impressions are real',
    next: 'Next', prev: 'Back', issue: 'Issue ticket',
    sumT: 'Your booking', sW: 'World', sD: 'When', sT: 'Travellers', sC: 'Class', sum: 'Total',
    tkT: 'Your ticket', tDl: 'Download PNG', tPrint: 'Print', tNew: 'New booking',
    myT: 'My tickets', myS: 'Tickets are stored only in this browser.'
  };
  var TIPS = [
    ['Я сьогодні кондуктор. Квитки видаю миттєво.', 'I’m the conductor today. Tickets are issued instantly.'],
    ['Клас «Телепорт» найдорожчий, зате черг немає зовсім.', 'Teleport class is the priciest, but there are no queues at all.'],
    ['Квиток можна завантажити картинкою або роздрукувати.', 'You can download the ticket as an image or print it.'],
    ['Закреслені дні зайняті: ми там ремонтуємо шви.', 'Crossed-out days are taken: we are repairing seams there.']
  ];
  var ERAS = [
    { id: 'yday', ua: 'Вчора', en: 'Yesterday' }, { id: 'today', ua: 'Сьогодні', en: 'Today' }, { id: 'tmrw', ua: 'Завтра', en: 'Tomorrow' },
    { id: 'y3025', ua: 'У 3025 році', en: 'In the year 3025' }, { id: 'any', ua: 'Коли захочеться', en: 'Whenever you like' }
  ];
  var CLASSES = [
    { id: 'econ', m: 1, ua: 'Економ', en: 'Economy', dUa: 'Місце біля шва і бутерброд з космосом.', dEn: 'A seat by the seam and a space sandwich.', c: '#FFC93C' },
    { id: 'biz', m: 2, ua: 'Бізнес', en: 'Business', dUa: 'М’яке крісло і вид на обидва світи одразу.', dEn: 'A soft seat and a view of both worlds at once.', c: '#FF4F9A' },
    { id: 'tele', m: 3, ua: 'Телепорт', en: 'Teleport', dUa: 'Без черг і пересадок: ви вже там.', dEn: 'No queues, no transfers: you are already there.', c: '#2BBEF0' }
  ];
  var BUSY = [3, 8, 12, 17];
  var WD_UA = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'], WD_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  var st = { tour: null, custom: null, era: null, day: null, trav: 1, cls: 'econ' }, step = 1, current = null;

  function dreams(n) {
    if (SS.lang === 'en') return n + (n === 1 ? ' dream' : ' dreams');
    var m10 = n % 10, m100 = n % 100;
    return n + (m10 === 1 && m100 !== 11 ? ' сон' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? ' сни' : ' снів');
  }
  function base(t) { if (t === 'custom') return 5; var x = SS.tour(t); return x ? x.price : 0; }
  function worldName(tk) {
    if (tk.tour === 'custom' && tk.custom) return SS.mixName(tk.custom.a, tk.custom.b, tk.custom.p);
    var t = SS.tour(tk.tour); return t ? SS.L(t.ua, t.en) : '—';
  }
  function worldColor(tk) {
    if (tk.tour === 'custom' && tk.custom) { var A = SS.worldById(tk.custom.a); return A ? A.acc : '#FFC93C'; }
    var t = SS.tour(tk.tour); return t ? t.color : '#FFC93C';
  }
  function datePhrase(tk) {
    var e = null; ERAS.forEach(function (x) { if (x.id === tk.era) e = x; }); if (!e || !tk.day) return '—';
    return SS.lang === 'en' ? e.en + ', day ' + tk.day : e.ua + ', ' + tk.day + '-го числа';
  }
  function clsName(id) { var r = '—'; CLASSES.forEach(function (c) { if (c.id === id) r = SS.L(c.ua, c.en); }); return r; }
  function total(s) { var m = 1; CLASSES.forEach(function (c) { if (c.id === s.cls) m = c.m; }); return base(s.tour) * m * s.trav; }

  function parseCustom() {
    var m = /[?&]custom=([a-z]+)-([a-z]+)-(\d+)/.exec(location.search);
    if (m && SS.worldById(m[1]) && SS.worldById(m[2]) && m[1] !== m[2]) return { a: m[1], b: m[2], p: Math.max(20, Math.min(80, +m[3])) };
    var last = SS.store.get('mixes', [])[0];
    return last && SS.worldById(last.a) ? last : null;
  }
  function renderTours() {
    var html = SS.TOURS.map(function (t) {
      var mix = SS.lang === 'en' ? t.mixEn : t.mixUa;
      return '<label class="choice"><input type="radio" name="tour" value="' + t.id + '"' + (st.tour === t.id ? ' checked' : '') + '><span class="card" style="--c:' + t.color + '"><span class="sw"></span><b>' + SS.L(t.ua, t.en) + '</b><small>' + mix.join(' + ') + '</small><span class="price">' + SS.L('від ', 'from ') + dreams(t.price) + '</span></span></label>';
    }).join('');
    if (st.custom) {
      var A = SS.worldById(st.custom.a), B = SS.worldById(st.custom.b);
      html += '<label class="choice"><input type="radio" name="tour" value="custom"' + (st.tour === 'custom' ? ' checked' : '') + '><span class="card" style="--c:' + A.acc + '"><span class="sw" style="background:linear-gradient(90deg,' + A.bg + ' 50%,' + B.bg + ' 50%)"></span><b>' + SS.mixName(st.custom.a, st.custom.b, st.custom.p) + '</b><small>' + SS.L('Ваш зшитий світ', 'Your stitched world') + '</small><span class="price">' + SS.L('від ', 'from ') + dreams(5) + '</span></span></label>';
    }
    $('#tourChoices').innerHTML = html;
  }
  function renderEras() {
    $('#eras').innerHTML = ERAS.map(function (e) { return '<label class="era"><input type="radio" name="era" value="' + e.id + '"' + (st.era === e.id ? ' checked' : '') + '><span>' + SS.L(e.ua, e.en) + '</span></label>'; }).join('');
  }
  function renderCal() {
    var wd = SS.lang === 'en' ? WD_EN : WD_UA, h = wd.map(function (d) { return '<span class="wd" aria-hidden="true">' + d + '</span>'; }).join('');
    for (var d = 1; d <= 21; d++) {
      var busy = BUSY.indexOf(d) >= 0;
      h += '<button type="button" data-day="' + d + '" data-noboom aria-pressed="' + (st.day === d) + '"' + (busy ? ' disabled aria-label="' + d + SS.L(', зайнято', ', taken') + '"' : '') + '>' + d + '</button>';
    }
    $('#cal').innerHTML = h;
  }
  function renderPeople() {
    var s = ''; for (var i = 0; i < st.trav; i++) s += '<svg viewBox="0 0 26 34"><circle cx="13" cy="9" r="7" fill="' + ['#FF4F9A', '#2BBEF0', '#FFC93C', '#3CCB7F', '#7A5CFA', '#FF8A3D'][i] + '" stroke="#1A1423" stroke-width="2.5"/><path d="M3 33c0-9 4-14 10-14s10 5 10 14z" fill="#FFFDF7" stroke="#1A1423" stroke-width="2.5"/></svg>';
    $('#people').innerHTML = s; $('#travN').textContent = st.trav;
  }
  function renderClasses() {
    $('#classChoices').innerHTML = CLASSES.map(function (c) {
      return '<label class="choice"><input type="radio" name="cls" value="' + c.id + '"' + (st.cls === c.id ? ' checked' : '') + '><span class="card" style="--c:' + c.c + '"><span class="sw"></span><b>' + SS.L(c.ua, c.en) + '</b><small>' + SS.L(c.dUa, c.dEn) + '</small><span class="price">×' + c.m + '</span></span></label>';
    }).join('');
  }
  function summary() {
    $('#sWorld').textContent = st.tour ? worldName(st) : '—';
    $('#sDate').textContent = st.era && st.day ? datePhrase(st) : '—';
    $('#sTrav').textContent = st.trav;
    $('#sClass').textContent = clsName(st.cls);
    var tt = st.tour ? total(st) : 0;
    $('#sTotal').textContent = st.tour ? dreams(tt) : '—';
    if (G && !SS.calm) G.fromTo('#sTotal', { scale: 1.25 }, { scale: 1, duration: .4, ease: 'back.out(3)' });
  }
  function renderAll() { renderTours(); renderEras(); renderCal(); renderPeople(); renderClasses(); summary(); renderList(); }

  function validate(n) {
    var e = $('#e' + n); e.textContent = '';
    if (n === 1 && !st.tour) { e.textContent = SS.L('Оберіть світ, щоб продовжити.', 'Pick a world to continue.'); return false; }
    if (n === 2 && !st.era) { e.textContent = SS.L('Оберіть епоху: вчора, сьогодні, завтра чи інша.', 'Pick an era: yesterday, today, tomorrow or another.'); return false; }
    if (n === 2 && !st.day) { e.textContent = SS.L('Оберіть день у календарі. Закреслені дні зайняті.', 'Pick a day in the calendar. Crossed-out days are taken.'); return false; }
    if (n === 3) {
      var nm = $('#pName').value.trim();
      if (nm.length < 2) { e.textContent = SS.L('Впишіть ім’я мандрівника, щонайменше 2 літери.', 'Enter the traveller’s name, at least 2 letters.'); $('#pName').focus(); return false; }
      if (!/^[\p{L}\s'’\-.]+$/u.test(nm)) { e.textContent = SS.L('Ім’я може містити лише літери, пробіли, дефіс та апостроф.', 'The name can only contain letters, spaces, hyphens and apostrophes.'); $('#pName').focus(); return false; }
      if (!$('#agree').checked) { e.textContent = SS.L('Поставте позначку, що розумієте: світ вигаданий.', 'Tick the box to confirm you understand the world is made up.'); return false; }
    }
    return true;
  }
  function go(n) {
    var from = $('.panel-step[data-step="' + step + '"]'), to = $('.panel-step[data-step="' + n + '"]'), dir = n > step ? 1 : -1;
    step = n; from.hidden = true; to.hidden = false;
    $$('#stepper li').forEach(function (li, i) { li.classList.toggle('on', i + 1 === n); li.classList.toggle('done', i + 1 < n); });
    if (G && !SS.calm) G.fromTo(to, { x: 60 * dir, rotation: 1.5 * dir }, { x: 0, rotation: 0, duration: .45, ease: 'back.out(1.8)' });
    var h = $('h2', to); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
    var r = to.getBoundingClientRect(); if (r.top < 70) scrollTo({ top: scrollY + r.top - 100, behavior: SS.calm ? 'auto' : 'smooth' });
    SS.blip(400 + n * 100, .15, 'triangle');
  }

  function rnd(seed) { var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
  function drawTicket(tk) {
    var cv = $('#ticket'), c = cv.getContext('2d'), Wt = 1000, Ht = 420, col = worldColor(tk), perf = 735;
    c.clearRect(0, 0, Wt, Ht);
    function shape() {
      c.beginPath(); var r = 26, x = 8, y = 8, w = Wt - 16, h = Ht - 16;
      c.moveTo(x + r, y); c.lineTo(perf - 22, y); c.arc(perf, y, 22, Math.PI, 0, true); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r);
      c.lineTo(x + w, y + h - r); c.arcTo(x + w, y + h, x + w - r, y + h, r); c.lineTo(perf + 22, y + h); c.arc(perf, y + h, 22, 0, Math.PI, true);
      c.lineTo(x + r, y + h); c.arcTo(x, y + h, x, y + h - r, r); c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r); c.closePath();
    }
    shape(); c.fillStyle = '#FFF1D2'; c.fill();
    c.save(); shape(); c.clip();
    c.fillStyle = col; c.fillRect(0, 0, Wt, 96);
    c.fillStyle = 'rgba(26,20,35,.16)'; for (var hx = 0; hx < Wt; hx += 12) for (var hy = 4; hy < 96; hy += 12) { c.beginPath(); c.arc(hx + (hy % 24 ? 6 : 0), hy, 2, 0, 6.28); c.fill(); }
    c.fillStyle = INK; c.fillRect(0, 96, Wt, 5);
    c.fillStyle = 'rgba(26,20,35,.06)'; for (var gx = 0; gx < Wt; gx += 14) for (var gy = 110; gy < Ht; gy += 14) c.fillRect(gx, gy, 2, 2);
    c.restore();
    shape(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
    c.setLineDash([10, 10]); c.lineWidth = 4; c.beginPath(); c.moveTo(perf, 40); c.lineTo(perf, Ht - 40); c.stroke(); c.setLineDash([]);
    c.fillStyle = INK; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    c.font = '900 40px Unbounded, Arial Black, sans-serif'; c.fillText(SS.L('ШОВ СВІТІВ', 'WORLDSEAM'), 36, 62);
    c.font = '700 15px Onest, Arial, sans-serif'; c.fillText(SS.L('КВИТОК У СВІТ, ЯКОГО НЕ БУВАЄ', 'A TICKET TO A WORLD THAT NEVER WAS'), 38, 84);
    c.font = '900 22px Unbounded, Arial Black, sans-serif'; c.textAlign = 'right'; c.fillText(clsName(tk.cls).toUpperCase(), perf - 34, 62); c.textAlign = 'left';
    function field(lbl, val, x, y, size, maxW) {
      c.fillStyle = '#6B5E77'; c.font = '700 13px Onest, Arial, sans-serif'; c.fillText(lbl, x, y);
      c.fillStyle = INK; var s = size; c.font = '900 ' + s + 'px Unbounded, Arial Black, sans-serif';
      while (c.measureText(val).width > maxW && s > 13) { s--; c.font = '900 ' + s + 'px Unbounded, Arial Black, sans-serif'; }
      c.fillText(val, x, y + s + 6);
    }
    field(SS.L('МАНДРІВНИК', 'TRAVELLER'), tk.name, 36, 140, 34, perf - 80);
    field(SS.L('СВІТ', 'WORLD'), worldName(tk), 36, 225, 24, perf - 80);
    field(SS.L('КОЛИ', 'WHEN'), datePhrase(tk), 36, 300, 18, 330);
    field(SS.L('МАНДРІВНИКІВ', 'TRAVELLERS'), String(tk.trav), 400, 300, 18, 120);
    field(SS.L('ЦІНА', 'PRICE'), dreams(tk.total), 540, 300, 18, 170);
    c.fillStyle = '#6B5E77'; c.font = '500 13px Onest, Arial, sans-serif';
    c.fillText(SS.L('Посадка біля шва за 5 хвилин до відправлення. Сни не повертаються.', 'Boarding at the seam 5 minutes before departure. Dreams are non-refundable.'), 36, 380);
    c.save(); c.translate(600, 190); c.rotate(-.25); c.globalAlpha = .85; c.strokeStyle = '#FF4F9A'; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 56, 0, 6.28); c.stroke(); c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, 46, 0, 6.28); c.stroke();
    c.fillStyle = '#FF4F9A'; c.font = '900 15px Unbounded, Arial Black, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(SS.L('ЗШИТО', 'STITCHED'), 0, 0); c.restore();
    c.textAlign = 'left'; c.textBaseline = 'alphabetic'; var sx = perf + 34;
    c.fillStyle = INK; c.font = '900 16px Unbounded, Arial Black, sans-serif'; c.fillText('№ ' + tk.no, sx, 62);
    field(SS.L('МІСЦЕ', 'SEAT'), SS.L('Шов ', 'Seam ') + tk.seam + SS.L(', місце ', ', seat ') + tk.seat, sx, 140, 17, 210);
    var seed = 0; for (var i = 0; i < tk.no.length; i++) seed += tk.no.charCodeAt(i) * (i + 1);
    var bx = sx; c.fillStyle = INK; while (bx < Wt - 40) { var w = 2 + Math.floor(rnd(seed++) * 5); c.fillRect(bx, 208, w, 74); bx += w + 2 + Math.floor(rnd(seed++) * 4); }
    c.font = '700 12px Onest, Arial, sans-serif'; c.fillText(tk.no.replace(/-/g, ' '), sx, 300);
    c.save(); c.translate(Wt - 80, 352); c.scale(.42, .42);
    c.beginPath(); c.arc(0, 0, 58, 0, 6.28); c.fillStyle = '#FF4F9A'; c.fill(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
    [-20, 20].forEach(function (d) { c.beginPath(); c.arc(d, -6, 15, 0, 6.28); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 5; c.stroke(); c.beginPath(); c.arc(d + 3, -4, 7, 0, 6.28); c.fillStyle = INK; c.fill(); });
    c.beginPath(); c.arc(0, 16, 14, .2, Math.PI - .2); c.lineWidth = 5; c.stroke();
    c.beginPath(); c.moveTo(-48, -40); c.quadraticCurveTo(0, -100, 48, -40); c.closePath(); c.fillStyle = '#2BBEF0'; c.fill(); c.stroke();
    c.fillStyle = INK; c.fillRect(-58, -44, 116, 12); c.beginPath(); c.arc(0, -64, 10, 0, 6.28); c.fillStyle = '#FFC93C'; c.fill(); c.stroke();
    c.restore();
    $('#ticket').setAttribute('aria-label', SS.L('Квиток ', 'Ticket ') + tk.no + ': ' + tk.name + ', ' + worldName(tk) + ', ' + datePhrase(tk));
  }
  function showTicket(tk, animate) {
    current = tk; var sec = $('#ticketSec'); sec.hidden = false; drawTicket(tk);
    sec.scrollIntoView({ behavior: SS.calm ? 'auto' : 'smooth', block: 'start' });
    if (animate && G && !SS.calm) {
      G.fromTo('.ticket-wrap canvas', { yPercent: -102 }, { yPercent: 0, duration: 1.6, ease: 'steps(12)', delay: .3 });
      for (var i = 0; i < 12; i++) setTimeout(function () { SS.noise(.07, .08, 2200); }, 300 + i * 133);
      setTimeout(function () { var r = $('#ticket').getBoundingClientRect(); SS.boom(r.left + r.width * .6, r.top + r.height * .45, SS.L('ДЗИНЬ!', 'DING!')); [523, 659, 784].forEach(function (f, k) { setTimeout(function () { SS.pluck(f, .4, 'triangle', .07); }, k * 100); }); }, 2000);
    }
  }
  function issue() {
    var no = 'SS-' + (1000 + ((Math.random() * 9000) | 0)) + '-' + (1000 + ((Math.random() * 9000) | 0));
    var tk = { no: no, name: $('#pName').value.trim(), tour: st.tour, custom: st.tour === 'custom' ? st.custom : null, era: st.era, day: st.day, trav: st.trav, cls: st.cls, total: total(st), seam: 1 + ((Math.random() * 9) | 0), seat: 1 + ((Math.random() * 40) | 0), at: Date.now() };
    var list = SS.store.get('tickets', []); list.unshift(tk); SS.store.set('tickets', list.slice(0, 30));
    renderList(); showTicket(tk, true);
    if (SS.guideSay) SS.guideSay('Квиток надруковано! Щасливої подорожі через шов.', 'Ticket printed! Have a great trip through the seam.');
  }
  function download() {
    if (!current) return; var cv = $('#ticket'), name = 'Klymchuk_kvytok_' + current.no + '.png';
    var save = function (url, rev) { var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); if (rev) setTimeout(function () { URL.revokeObjectURL(url); }, 2000); SS.toast(SS.L('Квиток збережено в «Завантаження».', 'Ticket saved to Downloads.')); };
    try { cv.toBlob(function (b) { b ? save(URL.createObjectURL(b), true) : save(cv.toDataURL('image/png')); }, 'image/png'); } catch (e) { SS.toast(SS.L('Браузер не дозволив зберегти файл.', 'The browser did not allow saving the file.')); }
  }

  function renderList() {
    var list = SS.store.get('tickets', []), box = $('#tkList');
    if (!list.length) {
      box.innerHTML = '<div class="empty-state"><p>' + SS.L('Квитків поки немає. Оформіть перший угорі сторінки.', 'No tickets yet. Book your first one at the top of the page.') + '</p><a class="btn" href="#bForm">' + SS.L('До бронювання', 'Go to booking') + '</a></div>';
      return;
    }
    box.innerHTML = '<div class="tickets">' + list.map(function (tk, i) {
      return '<div class="tk" style="--c:' + worldColor(tk) + '"><small>№ ' + tk.no + '</small><b>' + worldName(tk) + '</b><span>' + escapeHtml(tk.name) + '</span><small>' + datePhrase(tk) + ', ' + clsName(tk.cls) + ', ' + dreams(tk.total) + '</small>' +
        '<div class="row"><button type="button" data-show="' + i + '">' + SS.L('Показати', 'Show') + '</button><button type="button" class="danger" data-del="' + i + '">' + SS.L('Видалити', 'Delete') + '</button></div></div>';
    }).join('') + '</div>';
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }

  function init() {
    st.custom = parseCustom();
    var q = /[?&]tour=([a-z]+)/.exec(location.search);
    if (q && SS.tour(q[1])) st.tour = q[1];
    if (/[?&]custom=/.test(location.search) && st.custom) st.tour = 'custom';
    renderAll();
    var form = $('#bForm');
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'tour') { st.tour = t.value; $('#e1').textContent = ''; }
      if (t.name === 'era') { st.era = t.value; $('#e2').textContent = ''; }
      if (t.name === 'cls') st.cls = t.value;
      summary();
    });
    $('#cal').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-day]'); if (!b || b.disabled) return;
      st.day = +b.getAttribute('data-day'); $$('#cal button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $('#e2').textContent = ''; summary(); SS.blip(700, .08, 'square', .04);
      if (G && !SS.calm) G.fromTo(b, { scale: .8 }, { scale: 1, duration: .35, ease: 'back.out(3)' });
    });
    $('#minus').addEventListener('click', function () { if (st.trav > 1) { st.trav--; renderPeople(); summary(); SS.blip(300, .1, 'sine'); } });
    $('#plus').addEventListener('click', function () {
      if (st.trav < 6) { st.trav++; renderPeople(); summary(); SS.blip(500, .1, 'sine'); if (G && !SS.calm) G.from('#people svg:last-child', { y: -20, scale: 0, duration: .4, ease: 'back.out(3)' }); }
      else SS.toast(SS.L('Більше шести мандрівників шов не витримає.', 'The seam can’t hold more than six travellers.'));
    });
    $$('[data-next]').forEach(function (b) { b.addEventListener('click', function () { if (validate(step)) go(step + 1); else SS.blip(140, .25, 'sawtooth'); }); });
    $$('[data-prev]').forEach(function (b) { b.addEventListener('click', function () { go(step - 1); }); });
    $('#pName').addEventListener('input', function () { $('#e3').textContent = ''; });
    form.addEventListener('submit', function (e) { e.preventDefault(); if (step !== 3) return; if (validate(3)) issue(); else SS.blip(140, .25, 'sawtooth'); });
    $('#tDl').addEventListener('click', download);
    $('#tPrint').addEventListener('click', function () { window.print(); });
    $('#tNew').addEventListener('click', function () {
      $('#ticketSec').hidden = true; form.reset(); st = { tour: null, custom: st.custom, era: null, day: null, trav: 1, cls: 'econ' };
      $('.panel-step[data-step="' + step + '"]').hidden = true; step = 1; $('.panel-step[data-step="1"]').hidden = false;
      $$('#stepper li').forEach(function (li, i) { li.classList.toggle('on', i === 0); li.classList.remove('done'); });
      renderAll(); form.scrollIntoView({ behavior: SS.calm ? 'auto' : 'smooth' });
    });
    $('#tkList').addEventListener('click', function (e) {
      var list = SS.store.get('tickets', []), s = e.target.closest('[data-show]'), d = e.target.closest('[data-del]');
      if (s) showTicket(list[+s.getAttribute('data-show')], true);
      if (d) {
        if (d.getAttribute('data-confirm') !== '1') { d.setAttribute('data-confirm', '1'); d.textContent = SS.L('Точно видалити?', 'Really delete?'); return; }
        list.splice(+d.getAttribute('data-del'), 1); SS.store.set('tickets', list); renderList(); SS.toast(SS.L('Квиток видалено.', 'Ticket deleted.'));
      }
    });
    document.addEventListener('ss:lang', function () { renderAll(); if (current && !$('#ticketSec').hidden) drawTicket(current); });
    var t = $('#bTitle'); if (G && !SS.reduce) { SS.splitChars(t); G.from($$('.ch', t), { yPercent: 100, rotation: function () { return SS.rand(-20, 20); }, opacity: 0, stagger: .04, duration: .5, ease: 'back.out(2)' }); document.addEventListener('ss:lang', function () { SS.splitChars(t); }); }
    if (st.tour && G && !SS.calm) setTimeout(function () { SS.toast(SS.L('Світ уже обрано: ', 'World already selected: ') + worldName(st)); }, 900);
  }

  SS.boot({ en: EN, outfit: 'conductor', tips: TIPS, drone: { base: 110, type: 'sine', cut: 900, lfo: .1, vol: .03 }, init: init });
})();
