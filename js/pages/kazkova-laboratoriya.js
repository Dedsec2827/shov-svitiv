(function () {
  'use strict';
  var SS = window.SS, G = SS.G, $ = SS.$, $$ = SS.$$, mk = SS.mk;
  var INK = '#120826';

  var EN = {
    kick: 'FAIRY TALE + SCIENCE', title: 'Fairy-tale Lab',
    lead: 'Baba Yaga defended her PhD in chemistry, and her hut now walks on robotic chicken legs. Potions here are brewed by formula, and spells are tested in experiments.',
    s1: '3 days', s2: 'Alchemist', s3: 'from 3 dreams', artAlt: 'A hut on mechanical chicken legs walks under the moon',
    lK: 'INTERACTIVE', lT: 'The magic cauldron', lI: 'Drag two ingredients into the cauldron or just tap them. The cauldron brews a potion, and the recipe book remembers your discovery. There are 15 recipes in total.',
    shelfAlt: 'Shelf with ingredients', cauldronAlt: 'Cauldron', clear: 'Empty the cauldron', random: 'Random recipe', bookT: 'Recipe book',
    d1n: 'DAY 1', d1t: 'Baba Yaga’s lecture', d1: 'Topic: “Why the broom flies: aerodynamics for wizards”. A flight after the lecture is mandatory.',
    d2n: 'DAY 2', d2t: 'Potion practicum', d2: 'We brew potions in microscopic cauldrons, write down formulas and catch a firebird for a feather.',
    d3n: 'DAY 3', d3t: 'The hut goes for a walk', d3: 'The hut carries us on its robotic legs to Koshchei, who is defending his immortality as a research project.',
    wxT: 'Weather over the lab', wx1: '<b>Fog</b> smelling of mint', wx2: 'Chance of a miracle:', wx3: 'Brooms in the sky:',
    p1: '<b>A robe</b>, lab or magic', p2: '<b>Safety goggles</b> against potion sparks', p3: '<b>A notebook</b> for formulas and spells',
    ctaT: 'The hut comes to you', ctaP: 'Say “turn your back to the forest and your front to me”, and the transfer is ready.'
  };
  var TIPS = [
    ['Киньте в казан два інгредієнти. Подивимось, що вибухне... тобто вийде.', 'Drop two ingredients in the cauldron. Let’s see what explodes... I mean, happens.'],
    ['Усього 15 рецептів. Чи зберете всі?', 'There are 15 recipes. Can you find them all?'],
    ['Мій капелюх захищає від іскор. І від критики.', 'My hat protects from sparks. And from criticism.'],
    ['Якщо не знаєте, що варити, натисніть «Випадковий рецепт».', 'Not sure what to brew? Press Random recipe.']
  ];

  var ING = [
    { id: 'frog', ua: 'Жаб’яча лапка', en: 'Frog leg', c: '#3CCB7F', svg: '<path d="M30 8c6 0 8 8 6 16l-2 12 10 8c4 3 2 8-2 7l-8-2 2 6c1 4-4 5-6 2l-2-6-4 6c-2 3-7 1-5-3l3-7-8 1c-4 0-5-5-1-7l9-5-2-12c-1-9 4-16 10-16z" fill="#3CCB7F" stroke="#120826" stroke-width="3" stroke-linejoin="round"/>' },
    { id: 'chip', ua: 'Мікрочип', en: 'Microchip', c: '#2AF3FF', svg: '<rect x="14" y="14" width="32" height="32" rx="4" fill="#2AF3FF" stroke="#120826" stroke-width="3"/><rect x="22" y="22" width="16" height="16" fill="#120826"/><path d="M20 14V6M30 14V6M40 14V6M20 46v8M30 46v8M40 46v8M14 20H6M14 30H6M14 40H6M46 20h8M46 30h8M46 40h8" stroke="#120826" stroke-width="3"/>' },
    { id: 'feather', ua: 'Перо жар-птиці', en: 'Firebird feather', c: '#FF8A3D', svg: '<path d="M12 50C14 30 30 10 50 8c-2 18-16 38-38 42z" fill="#FF8A3D" stroke="#120826" stroke-width="3" stroke-linejoin="round"/><path d="M12 50L44 16M24 34l-6-6M30 28l-4-8M36 22l2-8M28 36l8 2M34 30l10 0" stroke="#120826" stroke-width="2.5" stroke-linecap="round"/><path d="M8 54l6-6" stroke="#FFE45E" stroke-width="4" stroke-linecap="round"/>' },
    { id: 'plasma', ua: 'Колба плазми', en: 'Plasma flask', c: '#FF4F9A', svg: '<path d="M24 6h12v14l12 22c4 8-1 14-10 14H22c-9 0-14-6-10-14l12-22z" fill="#FF4F9A" stroke="#120826" stroke-width="3" stroke-linejoin="round"/><path d="M32 26l-6 12h8l-6 12" stroke="#FFE45E" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
    { id: 'onion', ua: 'Цибулина', en: 'Onion', c: '#B18CFF', svg: '<path d="M30 12c4 8 18 14 18 28 0 10-8 16-18 16S12 50 12 40c0-14 14-20 18-28z" fill="#B18CFF" stroke="#120826" stroke-width="3" stroke-linejoin="round"/><path d="M30 14c-4 10-6 26 0 40M30 14c4 10 6 26 0 40" stroke="#120826" stroke-width="2" fill="none" opacity=".5"/><path d="M30 12c-2-4 0-8 4-10M30 12c2-4 6-5 10-4" stroke="#3CCB7F" stroke-width="3" fill="none" stroke-linecap="round"/>' },
    { id: 'star', ua: 'Зоряний пил', en: 'Stardust', c: '#FFE45E', svg: '<path d="M18 26c0-4 4-6 12-6s12 2 12 6l4 22c0 6-6 8-16 8s-16-2-16-8z" fill="#7A5CFA" stroke="#120826" stroke-width="3"/><path d="M20 24c4 4 16 4 20 0" stroke="#FFE45E" stroke-width="3" fill="none"/><path d="M30 4l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="#FFE45E" stroke="#120826" stroke-width="2"/><circle cx="46" cy="12" r="2.5" fill="#FFE45E"/><circle cx="14" cy="14" r="2" fill="#FFE45E"/>' }
  ];
  var R = {
    'chip+frog': ['«Квакбук»', 'Croakbook', 'Після ковтка жаби навчаться друкувати на клавіатурі. Ви теж, але квакаючи.', 'After a sip, frogs learn to type. So do you, but while croaking.'],
    'feather+frog': ['«Жабоптах»', 'Frogbird', 'Ви літаєте, але тільки над ставками й калюжами.', 'You can fly, but only over ponds and puddles.'],
    'frog+plasma': ['«Стрибуча блискавка»', 'Jumping Lightning', 'Стрибки на три метри з іскрами з-під п’ят.', 'Three-metre jumps with sparks from your heels.'],
    'frog+onion': ['«Сльоза царівни-жаби»', 'Frog Princess’s Tear', 'Ви плачете, але тільки від сміху. Довго.', 'You cry, but only from laughter. For a long time.'],
    'frog+star': ['«Зоряний пуголовок»', 'Star Tadpole', 'Три години світитеся в темряві, як нічник.', 'You glow in the dark for three hours, like a night light.'],
    'chip+feather': ['«Жар-процесор»', 'Fire Processor', 'Комп’ютер перестає гальмувати і горить ентузіазмом.', 'Your computer stops lagging and burns with enthusiasm.'],
    'chip+plasma': ['«Перезавантаження»', 'Reboot', 'Повертає бадьорість за пів секунди. Без втрати даних.', 'Restores energy in half a second. No data loss.'],
    'chip+onion': ['«Бабусин антивірус»', 'Granny’s Antivirus', 'Лікує і людей, і ноутбуки. Пахне відповідно.', 'Cures both people and laptops. Smells accordingly.'],
    'chip+star': ['«Космічний вай-фай»', 'Space Wi-Fi', 'Сигнал ловиться навіть на зворотному боці Місяця.', 'You get signal even on the far side of the Moon.'],
    'feather+plasma': ['«Феєрверк у пляшці»', 'Firework in a Bottle', 'Наступні десять хвилин ви чхаєте салютом.', 'For the next ten minutes you sneeze fireworks.'],
    'feather+onion': ['«Цибулевий фенікс»', 'Onion Phoenix', 'Відроджує будь-який зів’ялий вазон за ніч.', 'Revives any wilted houseplant overnight.'],
    'feather+star': ['«Комета»', 'Comet', 'Десять хвилин ходите із сяючим хвостом.', 'For ten minutes you walk around with a glowing tail.'],
    'onion+plasma': ['«Неонова сльоза»', 'Neon Tear', 'Сльози світяться неоном, і плачете ви лише від радості.', 'Your tears glow neon, and you only cry from joy.'],
    'plasma+star': ['«Надновий настрій»', 'Supernova Mood', 'Настрій вибухає до ста відсотків і тримається до вечора.', 'Your mood explodes to one hundred percent and lasts till evening.'],
    'onion+star': ['«Цибуля-галактика»', 'Galaxy Onion', 'Кожен шар цибулини показує нову зоряну карту.', 'Every layer of the onion shows a new star map.']
  };
  function key(a, b) { return [a, b].sort().join('+'); }
  function ing(id) { for (var i = 0; i < ING.length; i++) if (ING[i].id === id) return ING[i]; }
  function mix(a, b) {
    var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16); }), pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16); });
    return '#' + pa.map(function (v, i) { return ('0' + Math.round((v + pb[i]) / 2).toString(16)).slice(-2); }).join('');
  }

  var slots = [], found = SS.store.get('potions', []), busy = false;

  function hero() {
    var hs = $('#hStars');
    for (var i = 0; i < 18; i++) hs.appendChild(mk('circle', { cx: SS.rand(80, 440), cy: SS.rand(60, 300), r: SS.rand(1.2, 3), fill: i % 4 ? '#FFFDF7' : '#C6F432', 'class': 'hst' }));
    if (!G || SS.reduce) return;
    G.from('#heroArt', { scale: .85, rotation: -6, opacity: 0, duration: .9, ease: 'back.out(1.7)' });
    SS.ambient(G.timeline({ repeat: -1 })
      .to('.legL', { y: -16, rotation: -8, svgOrigin: '220 300', duration: .35, ease: 'sine.out' })
      .to('.legL', { y: 0, rotation: 0, svgOrigin: '220 300', duration: .35, ease: 'sine.in' })
      .to('.legR', { y: -16, rotation: 8, svgOrigin: '300 300', duration: .35, ease: 'sine.out' })
      .to('.legR', { y: 0, rotation: 0, svgOrigin: '300 300', duration: .35, ease: 'sine.in' }));
    SS.ambient(G.to('.house', { rotation: 2, svgOrigin: '260 300', y: -4, duration: .35, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('.win', { attr: { fill: '#FFE45E' }, duration: .8, yoyo: true, repeat: -1 }));
    SS.ambient(G.to('.smoke', { y: -8, opacity: .3, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    $$('.hst').forEach(function (s) { SS.ambient(G.to(s, { opacity: .2, duration: SS.rand(.5, 1.4), yoyo: true, repeat: -1, delay: Math.random() * 2 })); });
  }

  function cauldronIdle() {
    var cb = $('#cBubbles');
    for (var i = 0; i < 9; i++) cb.appendChild(mk('circle', { cx: SS.rand(110, 290), cy: 124, r: SS.rand(4, 10), fill: '#6E58A8', stroke: INK, 'stroke-width': 3, 'class': 'cb' }));
    if (!G || SS.reduce) return;
    $$('.cb').forEach(function (b) { SS.ambient(G.fromTo(b, { attr: { cy: 128 }, scale: 0, transformOrigin: '50% 50%' }, { attr: { cy: SS.rand(70, 100) }, scale: 1, opacity: 0, duration: SS.rand(1, 2), repeat: -1, delay: Math.random() * 2, ease: 'power1.out' })); });
    SS.ambient(G.to('.flame', { scaleY: 1.15, transformOrigin: '50% 100%', duration: .25, yoyo: true, repeat: -1 }));
  }

  function renderShelf() {
    var sh = $('#shelf');
    sh.innerHTML = ING.map(function (g) {
      return '<button type="button" class="ing" role="listitem" data-id="' + g.id + '" data-noboom aria-label="' + SS.L('Додати в казан: ', 'Add to cauldron: ') + SS.L(g.ua, g.en) + '"><svg viewBox="0 0 60 60" aria-hidden="true">' + g.svg + '</svg><span>' + SS.L(g.ua, g.en) + '</span></button>';
    }).join('');
    $$('.ing', sh).forEach(dragify);
    markUsed();
  }
  function markUsed() { $$('.ing').forEach(function (b) { b.classList.toggle('used', slots.indexOf(b.getAttribute('data-id')) >= 0); }); }
  function renderSlots() {
    [0, 1].forEach(function (i) {
      var el = $('#slot' + i), id = slots[i];
      el.textContent = id ? SS.L(ing(id).ua, ing(id).en) : SS.L('порожньо', 'empty');
      el.classList.toggle('full', !!id);
    });
  }
  function renderBook() {
    var box = $('#recipes');
    box.innerHTML = Object.keys(R).map(function (k) {
      var on = found.indexOf(k) >= 0, p = k.split('+'), col = mix(ing(p[0]).c, ing(p[1]).c);
      return '<div class="recipe' + (on ? ' found' : '') + '"><i style="' + (on ? 'background:' + col : '') + '"></i><span>' + (on ? SS.L(R[k][0], R[k][1]) : '???') + '</span></div>';
    }).join('');
    $('#bookN').textContent = found.length + '/15';
  }

  function add(id, fromEl) {
    if (busy || slots.indexOf(id) >= 0 || slots.length >= 2) return;
    slots.push(id); renderSlots(); markUsed();
    var g = ing(id);
    SS.blip(320 + slots.length * 120, .2, 'sine');
    if (G && !SS.calm) {
      G.to('#liquid', { attr: { fill: slots.length === 1 ? g.c : mix(ing(slots[0]).c, g.c) }, duration: .6 });
      G.fromTo('#liquid', { attr: { ry: 30 } }, { attr: { ry: 22 }, duration: .8, ease: 'elastic.out(1.4,.3)' });
      $$('.cb').forEach(function (b) { b.setAttribute('fill', g.c); });
      if (fromEl) {
        var r1 = fromEl.getBoundingClientRect(), r2 = $('#liquid').getBoundingClientRect();
        var fly = document.createElement('div');
        fly.innerHTML = '<svg viewBox="0 0 60 60" width="56" height="56">' + g.svg + '</svg>';
        fly.style.cssText = 'position:fixed;left:' + (r1.left + r1.width / 2 - 28) + 'px;top:' + (r1.top + 10) + 'px;z-index:90;pointer-events:none';
        document.body.appendChild(fly);
        G.to(fly, { x: r2.left + r2.width / 2 - (r1.left + r1.width / 2), y: r2.top - r1.top - 10, rotation: 360, scale: .5, duration: .55, ease: 'power2.in', onComplete: function () { fly.remove(); splash(); } });
      } else splash();
    } else $('#liquid').setAttribute('fill', slots.length === 1 ? g.c : mix(ing(slots[0]).c, g.c));
    if (slots.length === 2) { busy = true; setTimeout(brew, SS.calm ? 100 : 900); }
  }
  function splash() {
    var r = $('#liquid').getBoundingClientRect();
    SS.boom(r.left + r.width / 2, r.top, SS.L('БУЛЬК!', 'PLOP!'));
    SS.noise(.25, .1, 900);
  }
  function brew() {
    var k = key(slots[0], slots[1]), rec = R[k], col = mix(ing(slots[0]).c, ing(slots[1]).c), isNew = found.indexOf(k) < 0;
    if (isNew) { found.push(k); SS.store.set('potions', found); }
    $('#pName').textContent = SS.L(rec[0], rec[1]) + (isNew ? SS.L(' — нове відкриття!', ' — new discovery!') : '');
    $('#pDesc').textContent = SS.L(rec[2], rec[3]);
    $('#bottle').setAttribute('fill', col);
    var card = $('#potion'); card.hidden = false;
    renderBook();
    [392, 523, 659].forEach(function (f, i) { setTimeout(function () { SS.pluck(f, .5, 'triangle', .07); }, i * 110); });
    if (G && !SS.calm) {
      var st = $('#steam'); st.innerHTML = '';
      for (var i = 0; i < 6; i++) st.appendChild(mk('circle', { cx: 140 + i * 24, cy: 110, r: 18, fill: col, stroke: INK, 'stroke-width': 3 }));
      G.fromTo($$('circle', st), { attr: { cy: 110 }, scale: .3, transformOrigin: '50% 50%', opacity: 1 }, { attr: { cy: -10 }, scale: 1.6, opacity: 0, duration: 1.2, stagger: .05, ease: 'power2.out' });
      G.fromTo('#cauldron svg', { rotation: -3 }, { rotation: 0, duration: .8, ease: 'elastic.out(1.6,.2)' });
      G.fromTo(card, { scale: .5, rotation: -6 }, { scale: 1, rotation: 0, duration: .55, ease: 'back.out(2.4)' });
      var r = $('#cauldron').getBoundingClientRect(); SS.boom(r.left + r.width / 2, r.top + 40, SS.L('ПУФ!', 'POOF!'));
      if (isNew) G.fromTo($$('.recipe.found')[found.length - 1] || [], { scale: 1.3 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
    }
    if (found.length === 15 && isNew) { SS.toast(SS.L('Усі 15 рецептів відкрито! Баба Яга пропонує вам ставку в лабораторії.', 'All 15 recipes found! Baba Yaga offers you a job at the lab.'), 4000); }
    slots = []; busy = false; setTimeout(function () { renderSlots(); markUsed(); }, 400);
  }

  function dragify(btn) {
    var id = btn.getAttribute('data-id'), sx = 0, sy = 0, moved = false, ghost = null, pid = null;
    var cauld = $('#cauldron');
    function over(x, y) { var r = cauld.getBoundingClientRect(); return x > r.left && x < r.right && y > r.top && y < r.bottom; }
    btn.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return; sx = e.clientX; sy = e.clientY; moved = false; pid = e.pointerId; btn.setPointerCapture(pid);
    });
    btn.addEventListener('pointermove', function (e) {
      if (pid !== e.pointerId) return;
      if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) {
        moved = true; btn.classList.add('dragging');
        ghost = btn.cloneNode(true); ghost.removeAttribute('id');
        var r = btn.getBoundingClientRect();
        ghost.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;z-index:90;pointer-events:none;transform:rotate(-6deg)';
        document.body.appendChild(ghost);
      }
      if (moved && ghost) {
        var r2 = btn.getBoundingClientRect();
        ghost.style.transform = 'translate(' + (e.clientX - sx) + 'px,' + (e.clientY - sy) + 'px) rotate(-6deg)';
        cauld.classList.toggle('over', over(e.clientX, e.clientY));
      }
    });
    function end(e) {
      if (pid !== e.pointerId) return; pid = null;
      btn.classList.remove('dragging'); cauld.classList.remove('over');
      if (moved) {
        var hit = over(e.clientX, e.clientY);
        if (ghost) { var gh = ghost; ghost = null; if (G && !SS.calm && !hit) G.to(gh, { x: 0, y: 0, duration: .3, onComplete: function () { gh.remove(); } }); else gh.remove(); }
        if (hit) { add(id, null); }
      }
    }
    btn.addEventListener('pointerup', end); btn.addEventListener('pointercancel', end);
    btn.addEventListener('click', function () { if (!moved) add(id, btn); moved = false; });
  }

  function init() {
    hero(); cauldronIdle(); renderShelf(); renderSlots(); renderBook();
    $('#clear').addEventListener('click', function () {
      if (busy) return; slots = []; renderSlots(); markUsed(); $('#potion').hidden = true;
      if (G) G.to('#liquid', { attr: { fill: '#6E58A8' }, duration: .5 }); else $('#liquid').setAttribute('fill', '#6E58A8');
    });
    $('#random').addEventListener('click', function () {
      if (busy) return; slots = []; renderSlots(); markUsed();
      var left = Object.keys(R).filter(function (k) { return found.indexOf(k) < 0; });
      var k = (left.length ? SS.pick(left) : SS.pick(Object.keys(R))).split('+');
      add(k[0], $('.ing[data-id="' + k[0] + '"]')); setTimeout(function () { add(k[1], $('.ing[data-id="' + k[1] + '"]')); }, SS.calm ? 0 : 450);
    });
    document.addEventListener('ss:lang', function () { renderShelf(); renderSlots(); renderBook(); $('#potion').hidden = true; });
    SS.reveal('.ing', { y: 30, rot: 6, trigger: '#shelf', stagger: .06, d: .5 });
  }

  SS.tourPage({
    id: 'lab', en: EN, outfit: 'witch', tips: TIPS, fx: 'stars',
    drone: { base: 82.4, type: 'triangle', cut: 800, lfo: .25, vol: .035 },
    weather: { temp: [4, 14], vals: [{ id: 'wx-a', min: 70, max: 99, unit: '%' }, { id: 'wx-b', min: 2, max: 13 }] },
    init: init
  });
})();
