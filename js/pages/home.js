(function () {
  'use strict';
  var SS = window.SS, G = SS.G, $ = SS.$, $$ = SS.$$, mk = SS.mk;

  var EN = {
    mq1: 'The “Mix of Worlds” season is open', mq2: 'Cyber-Sich: the Cossacks are waiting', mq3: 'Underwater Spaceport, no spacesuit needed', mq4: 'Robot Forest: mushrooms with batteries', mq5: 'Fairy-tale Lab: potions by formula',
    tagB: 'Travel agency', tag: 'to worlds that never were',
    lead: 'We stitch together what never fits in real life: Cossacks and neon, space and ocean, fairy tales and labs. Pick a world, book a ticket, and our guide Stitchy takes care of the seams.',
    cta1: 'Pick a world', cta2: 'Stitch your own', f1: 'worlds this season', f2: 'mixes in the builder', f3: 'yarn-ball guide',
    bub0: 'Hi! I’m Stitchy. I stitch worlds that never were.', heroAlt: 'Space stitched to the ocean, with Stitchy the guide sitting on the seam', stibokAlt: 'Stitchy: press to stitch a random world',
    hint: 'Click Stitchy and he will stitch a new world for you.',
    tTitle: 'Where are we going?', tSub: 'Four worlds this season. Each one is stitched from two that were never meant to meet.',
    b1: 'Season<br>hit', b2: 'Our<br>pick',
    t1: 'Underwater Spaceport', t2: 'Cyber-Sich', t3: 'Robot Forest', t4: 'Fairy-tale Lab',
    'm.space': 'Space', 'm.ocean': 'Ocean', 'm.cossack': 'Cossacks', 'm.cyber': 'Cyberpunk', 'm.nature': 'Nature', 'm.tech': 'Technology', 'm.fairy': 'Fairy tale', 'm.science': 'Science',
    d1: 'A jellyfish rocket launches from the sea floor. Zero gravity and salty spray in one ticket.',
    d2: 'Khortytsia 2099: neon Petrykivka, holographic maces and a council of hacker Cossacks.',
    d3: 'Trees with gears, firefly drones and mushrooms that charge your phone.',
    d4: 'A hut on robotic chicken legs and potions brewed by formula.',
    days2: '2 days', days3: '3 days', days4: '4 days', see: 'View',
    hTitle: 'How it works', hSub: 'Three steps, and you are in a world that did not exist yesterday.',
    s1t: 'Pick a world', s1: 'Four ready-made tours, or your own mix in the builder.',
    s2t: 'Stitchy stitches', s2: 'The guide joins two worlds so the seam holds for the whole trip.',
    s3t: 'Get your ticket', s3: 'A personal comic ticket you can download as an image or print.',
    rTitle: 'Traveller reviews', rSub: 'The characters are made up, the delight is real.',
    r1: 'First time in two hundred years I saw a tree that also needs oiling. Felt right at home.', r1n: 'Gvyntomyr', r1w: 'robot forester, Robot Forest',
    r2: 'At Cyber-Sich they finally upgraded my sabre to version 2.0. Now it hands out Wi-Fi too.', r2n: 'Ostap Bait', r2w: 'regiment programmer',
    r3: 'I flew to space and landed back home, on the sea floor. With a view of the stars, though.', r3n: 'Zirka the Fish', r3w: 'tourist from Atlantis',
    qTitle: 'Questions', qSub: 'We answer before you even ask.',
    q1: 'Is this a real travel agency?', a1: 'No, it is a competition website on the theme “A mix of worlds”. All the worlds are made up, but the ticket you book is real: you can download it as an image.',
    q2: 'How do I pay for a trip?', a2: 'In dreams. Each tour has a base price, for example 3 dreams for Cyber-Sich. Business class costs twice as much, Teleport three times.',
    q3: 'Can I combine my own worlds?', a3: 'Yes. The builder has eight starter worlds, which makes 28 possible pairs. A slider sets which world dominates, and Stitchy invents a name and a description.',
    q4: 'Where are my tickets stored?', a4: 'Only in your browser’s local storage. The site sends nothing anywhere and works even offline.',
    q5: 'Why does the site go “bam” and “whoosh”?', a5: 'Because it is a comic. The Sound button turns on each world’s atmosphere, synthesised right in the browser, and Less motion removes extra animation.',
    ctaT: 'Didn’t find your world? Stitch it yourself.', ctaB: 'Open the builder'
  };

  var TIPS = [
    ['Привіт! Я Стібок, ваш гід. Почніть з будь-якого туру нижче.', 'Hi! I’m Stitchy, your guide. Start with any tour below.'],
    ['Наведіть курсор на літери «Шов Світів», вони підстрибують.', 'Hover over the letters of the title, they jump.'],
    ['У конструкторі можна зшити 28 різних світів.', 'In the builder you can stitch 28 different worlds.'],
    ['Кнопка «Звук» вмикає атмосферу. Я її сам синтезую!', 'The Sound button turns on the atmosphere. I synthesise it myself!']
  ];

  var A_UA = ['Космо', 'Кібер', 'Казково', 'Підводно', 'Робо', 'Козацько', 'Лісо', 'Лабо', 'Неоно', 'Хмаро'];
  var B_UA = ['вареники', 'бібліотека', 'метро', 'пасіка', 'обсерваторія', 'ярмарок', 'дискотека', 'кузня', 'бабусин сад', 'вокзал'];
  var A_EN = ['Cosmo', 'Cyber', 'Fairy', 'Aqua', 'Robo', 'Cossack', 'Forest', 'Lab', 'Neon', 'Cloud'];
  var B_EN = ['dumplings', 'library', 'subway', 'apiary', 'observatory', 'fair', 'disco', 'forge', 'granny’s garden', 'station'];
  var PH = [['Клікни ще, я в ударі!', 'Click again, I’m on a roll!'], ['Шов тримає, перевірено.', 'The seam holds, tested.'], ['Цей світ я зшив учора ввечері.', 'I stitched this one last night.'], ['Квитків поки немає, але скоро будуть.', 'No tickets yet, but soon.']];

  function splitTitle() {
    var words = SS.lang === 'en' ? ['World', 'seam'] : ['Шов', 'Світів'];
    $$('.big [data-split]').forEach(function (el, i) { el.setAttribute('data-split', words[i]); SS.splitChars(el); });
    var h = $('#heroTitle'); h.setAttribute('aria-label', words.join(' '));
  }

  function buildScene() {
    var st = $('#stibok'); st.innerHTML = SS.stibok('none', true);
    var seam = $('#seamLine'), sg = $('#seamStitches'), L = seam.getTotalLength();
    for (var s = 14; s < L; s += 26) {
      var p = seam.getPointAtLength(s), q = seam.getPointAtLength(s + 1);
      var a = Math.atan2(q.y - p.y, q.x - p.x) + Math.PI / 2, dx = Math.cos(a) * 13, dy = Math.sin(a) * 13;
      sg.appendChild(mk('line', { x1: p.x - dx, y1: p.y - dy - 4, x2: p.x + dx, y2: p.y + dy + 4, stroke: '#FF4F9A', 'stroke-width': 5, 'stroke-linecap': 'round' }));
    }
    var stars = $('#stars');
    for (var i = 0; i < 34; i++) {
      var x = Math.random() * 290, y = Math.random() * 460, r = Math.random() * 2 + 1;
      stars.appendChild(mk('path', { d: 'M' + x + ' ' + (y - r * 3) + 'L' + (x + r) + ' ' + (y - r) + 'L' + (x + r * 3) + ' ' + y + 'L' + (x + r) + ' ' + (y + r) + 'L' + x + ' ' + (y + r * 3) + 'L' + (x - r) + ' ' + (y + r) + 'L' + (x - r * 3) + ' ' + y + 'L' + (x - r) + ' ' + (y - r) + 'Z', fill: i % 5 ? '#FFFDF7' : '#FFC93C', 'class': 'star' }));
    }
    var bub = $('#bubbles');
    for (var j = 0; j < 14; j++) bub.appendChild(mk('circle', { cx: 300 + Math.random() * 250, cy: 470, r: 3 + Math.random() * 7, fill: 'none', stroke: '#FFFDF7', 'stroke-width': 3, 'class': 'bb' }));
    $$('.stars-rate').forEach(function (el) {
      var s5 = ''; for (var k = 0; k < 5; k++) s5 += '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1l2.7 5.6 6.1.9-4.4 4.3 1 6.1L10 15l-5.5 2.9 1-6.1L1.2 7.5l6.1-.9z" fill="#FFC93C" stroke="#1A1423" stroke-width="1.6"/></svg>';
      el.innerHTML = s5;
    });
  }

  function stitchRandom() {
    var en = SS.lang === 'en', i = (Math.random() * A_UA.length) | 0, j = (Math.random() * B_UA.length) | 0;
    var mix = en ? A_EN[i] + '-' + B_EN[j] : A_UA[i] + '-' + B_UA[j];
    var ph = SS.pick(PH);
    $('#bubble').textContent = (en ? 'Just stitched: ' : 'Щойно зшив: ') + mix + '! ' + (en ? ph[1] : ph[0]);
    if (G && !SS.calm) {
      G.fromTo('#stibok .st-body', { rotation: 0 }, { rotation: 360, svgOrigin: '286 236', duration: .7, ease: 'back.inOut(1.6)' });
      G.fromTo('#bubble', { scale: .6 }, { scale: 1, duration: .4, ease: 'back.out(3)' });
      G.fromTo('#seamStitches line', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, stagger: .02, duration: .3, ease: 'back.out(3)' });
    }
    SS.pluck(392, .4, 'triangle'); setTimeout(function () { SS.pluck(523, .5, 'triangle'); }, 120);
  }

  function heroAnim() {
    if (!G || SS.reduce) return;
    G.from('.big .ch', { yPercent: 110, rotation: function () { return SS.rand(-15, 15); }, opacity: 0, stagger: .05, duration: .7, ease: 'back.out(2)' });
    G.fromTo('#stitchPath', { strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.out', delay: .4 });
    G.from('.scene-frame', { scale: .85, rotation: 4, opacity: 0, duration: .8, ease: 'back.out(1.8)', delay: .2 });
    G.from('#bubble', { scale: 0, transformOrigin: '20% 100%', duration: .5, ease: 'back.out(3)', delay: .9 });
    G.from('.fact', { y: 30, rotation: function (i) { return (i - 1) * 6; }, stagger: .1, duration: .6, ease: 'back.out(2)', delay: .6 });
    $$('.bb').forEach(function (b) {
      SS.ambient(G.to(b, { attr: { cy: -20 }, duration: SS.rand(4, 8), repeat: -1, delay: Math.random() * 5, ease: 'none' }));
      SS.ambient(G.to(b, { x: 'random(-14,14)', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    });
    $$('.star').forEach(function (s) { SS.ambient(G.to(s, { opacity: .2, duration: SS.rand(.6, 1.6), repeat: -1, yoyo: true, delay: Math.random() * 2 })); });
    SS.ambient(G.to('.rocket', { y: -14, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('.flame', { scaleY: 1.3, transformOrigin: '50% 0%', duration: .15, yoyo: true, repeat: -1 }));
    SS.ambient(G.to('.jelly', { y: 16, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('.fish', { x: -24, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    SS.ambient(G.to('#stibok .st-body', { y: -6, duration: .9, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    $$('.tour .bob').forEach(function (b) { SS.ambient(G.to(b, { y: -6, duration: SS.rand(1.3, 2.3), yoyo: true, repeat: -1, ease: 'sine.inOut' })); });
    $$('.tour .spin').forEach(function (b) { SS.ambient(G.to(b, { rotation: 360, svgOrigin: '100 62', duration: 8, repeat: -1, ease: 'none' })); });
  }

  function scrollAnims() {
    if (!G || !window.ScrollTrigger || SS.reduce) return;
    SS.reveal('.tour', { y: 80, rot: 4, trigger: '#tourGrid', stagger: .12 });
    SS.reveal('.step', { y: 50, scale: .92, trigger: '.steps', stagger: .15, ease: 'back.out(2)' });
    SS.reveal('.rev blockquote', { y: 30, scale: .7, rot: 3, trigger: '.revs', stagger: .15, ease: 'back.out(2.4)' });
    SS.reveal('.faq-item', { y: 40, trigger: '.faq-list', stagger: .08, d: .6 });
    var tp = $('#stepThread'); if (tp) { var len = tp.getTotalLength(); tp.style.strokeDasharray = '16 12'; G.fromTo(tp, { opacity: 0, scaleX: 0, transformOrigin: 'left center' }, { opacity: 1, scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 85%', end: 'top 40%', scrub: 1 } }); }
  }

  function parallax() {
    var scene = $('#scene'); var layers = $$('#heroSvg .layer');
    document.addEventListener('pointermove', function (e) {
      if (SS.calm || !G) return;
      var r = scene.getBoundingClientRect(); if (r.bottom < 0) return;
      var nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
      layers.forEach(function (l) { var d = +l.getAttribute('data-depth'); G.to(l, { x: -nx * d, y: -ny * d, duration: .6, overwrite: 'auto' }); });
    }, { passive: true });
  }

  function tilt() {
    $$('.tour').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        if (SS.calm || !G || e.pointerType !== 'mouse') return;
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        G.to(c, { rotationY: x * 14, rotationX: -y * 14, transformPerspective: 700, duration: .4 });
      });
      c.addEventListener('pointerleave', function () { if (G) G.to(c, { rotationY: 0, rotationX: 0, duration: .6, ease: 'elastic.out(1,.5)' }); });
    });
  }

  function faq() {
    $$('.faq-item button').forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') === 'true', ans = document.getElementById(b.getAttribute('aria-controls'));
        b.setAttribute('aria-expanded', open ? 'false' : 'true'); ans.hidden = open;
        if (!open && G && !SS.calm) G.from(ans, { height: 0, opacity: 0, duration: .35, ease: 'power2.out', clearProps: 'height,opacity' });
      });
    });
  }

  function counters() {
    if (!G || SS.reduce || !window.ScrollTrigger) return;
    $$('[data-count]').forEach(function (el) {
      var o = { v: 0 }, to = +el.getAttribute('data-count');
      G.to(o, { v: to, duration: 1.2, delay: .8, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }

  SS.boot({
    en: EN, outfit: 'none', tips: TIPS, tipDelay: 5000,
    drone: { base: 110, type: 'triangle', cut: 900, lfo: .12, vol: .03 },
    init: function () {
      splitTitle(); buildScene(); faq(); parallax(); tilt();
      var st = $('#stibok');
      st.addEventListener('click', stitchRandom);
      st.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stitchRandom(); } });
      document.addEventListener('ss:lang', function () { splitTitle(); });
      heroAnim(); scrollAnims(); counters();
    }
  });
})();
