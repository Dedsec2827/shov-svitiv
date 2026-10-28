(function () {
  'use strict';
  var SS = window.SS;
  SS.WORLDS = [
    { id: 'space', ua: 'Космос', en: 'Space', adjUa: 'Космо', adjEn: 'Cosmo', nounUa: 'Орбіта', nounEn: 'Orbit', inhUa: 'космонавти', inhInsUa: 'космонавтами', inhEn: 'astronauts',
      fUa: 'замість дощу падають метеорити-цукерки', fEn: 'candy meteorites fall instead of rain', bg: '#160C2B', acc: '#FFC93C', acc2: '#FF4F9A', tr: [8, 3, 7] },
    { id: 'ocean', ua: 'Океан', en: 'Ocean', adjUa: 'Океано', adjEn: 'Aqua', nounUa: 'Атлантида', nounEn: 'Atlantis', inhUa: 'русалки', inhInsUa: 'русалками', inhEn: 'mermaids',
      fUa: 'вулицями пливуть косяки риб', fEn: 'schools of fish swim down the streets', bg: '#2BBEF0', acc: '#FF4F9A', acc2: '#3CCB7F', tr: [5, 6, 5] },
    { id: 'cossack', ua: 'Козаччина', en: 'Cossacks', adjUa: 'Козацько', adjEn: 'Cossack', nounUa: 'Січ', nounEn: 'Sich', inhUa: 'козаки', inhInsUa: 'козаками', inhEn: 'Cossacks',
      fUa: 'кожен ранок починається з гопака', fEn: 'every morning starts with a hopak', bg: '#BDE3FF', acc: '#FF2E63', acc2: '#FFC93C', tr: [4, 8, 3] },
    { id: 'cyber', ua: 'Кіберпанк', en: 'Cyberpunk', adjUa: 'Кібер', adjEn: 'Cyber', nounUa: 'Мегаполіс', nounEn: 'Megacity', inhUa: 'хакери', inhInsUa: 'хакерами', inhEn: 'hackers',
      fUa: 'неон світить навіть удень', fEn: 'neon glows even in daytime', bg: '#1B0F35', acc: '#2AF3FF', acc2: '#FF2E63', tr: [7, 4, 8] },
    { id: 'forest', ua: 'Ліс', en: 'Forest', adjUa: 'Лісо', adjEn: 'Forest', nounUa: 'Пуща', nounEn: 'Wildwood', inhUa: 'лісовики', inhInsUa: 'лісовиками', inhEn: 'wood sprites',
      fUa: 'дерева шепочуть прогноз погоди', fEn: 'trees whisper the weather forecast', bg: '#CFF2C2', acc: '#3CCB7F', acc2: '#8B5A2B', tr: [3, 9, 4] },
    { id: 'robots', ua: 'Роботи', en: 'Robots', adjUa: 'Робо', adjEn: 'Robo', nounUa: 'Депо', nounEn: 'Depot', inhUa: 'роботи', inhInsUa: 'роботами', inhEn: 'robots',
      fUa: 'шестерні крутяться замість вітряків', fEn: 'gears turn instead of windmills', bg: '#E4E2EE', acc: '#FF8A3D', acc2: '#2AF3FF', tr: [5, 5, 6] },
    { id: 'fairy', ua: 'Казка', en: 'Fairy tale', adjUa: 'Казково', adjEn: 'Fairy', nounUa: 'Королівство', nounEn: 'Kingdom', inhUa: 'феї', inhInsUa: 'феями', inhEn: 'fairies',
      fUa: 'кожна калюжа виконує одне бажання', fEn: 'every puddle grants one wish', bg: '#6E4FE0', acc: '#FFC93C', acc2: '#FF4F9A', tr: [4, 8, 9] },
    { id: 'science', ua: 'Наука', en: 'Science', adjUa: 'Науково', adjEn: 'Science', nounUa: 'Академія', nounEn: 'Academy', inhUa: 'науковці', inhInsUa: 'науковцями', inhEn: 'scientists',
      fUa: 'на кожному розі стоїть мікроскоп', fEn: 'there is a microscope on every corner', bg: '#FFF6E6', acc: '#2BBEF0', acc2: '#C6F432', tr: [6, 5, 7] }
  ];
  SS.worldById = function (id) { for (var i = 0; i < SS.WORLDS.length; i++) if (SS.WORLDS[i].id === id) return SS.WORLDS[i]; return null; };
  SS.mixColor = function (a, b, t) {
    t = t == null ? .5 : t;
    var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16); }), pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16); });
    return '#' + pa.map(function (v, i) { return ('0' + Math.round(v + (pb[i] - v) * t).toString(16)).slice(-2); }).join('').toUpperCase();
  };
  SS.mixName = function (aId, bId, p, lang) {
    var A = SS.worldById(aId), B = SS.worldById(bId); if (!A || !B) return '';
    var dom = p >= 50 ? A : B, oth = p >= 50 ? B : A, en = (lang || SS.lang) === 'en';
    return en ? dom.adjEn + ' ' + oth.nounEn : dom.adjUa + '-' + oth.nounUa;
  };
  SS.mixDesc = function (aId, bId, p, lang) {
    var A = SS.worldById(aId), B = SS.worldById(bId), en = (lang || SS.lang) === 'en', name = SS.mixName(aId, bId, p, lang);
    var dom = p >= 50 ? A : B, oth = p >= 50 ? B : A;
    return en
      ? name + ' is a world where ' + dom.fEn + ', and ' + oth.fEn + '. Here ' + dom.inhEn + ' live side by side with ' + oth.inhEn + ', and nobody is surprised.'
      : name + ' — світ, де ' + dom.fUa + ', а ' + oth.fUa + '. Тут ' + dom.inhUa + ' живуть пліч-о-пліч із ' + oth.inhInsUa + ', і ніхто цьому не дивується.';
  };
  SS.mixTraits = function (aId, bId, p) {
    var A = SS.worldById(aId), B = SS.worldById(bId), t = p / 100;
    return A.tr.map(function (v, i) { var m = v * t + B.tr[i] * (1 - t); if (i === 2) m = Math.min(10, m + 2); return Math.round(m * 10) / 10; });
  };
})();
