(function () {
  'use strict';
  var SS = window.SS;
  var INK = '#1A1423', W = 1200, H = 750, GROUND = 600;
  SS.makeScene = function (canvas) {
  var c = canvas.getContext('2d');
  function rnd(s) { var x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function o(lw, col) { c.lineWidth = lw || 4; c.strokeStyle = col || INK; c.lineJoin = 'round'; c.lineCap = 'round'; }
  function fillStroke(fill, lw) { c.fillStyle = fill; c.fill(); o(lw); c.stroke(); }

  var P = {
    planet: function (x, y, r) { c.beginPath(); c.arc(x, y, r, 0, 6.28); fillStroke('#FFC93C', 5); c.beginPath(); c.ellipse(x, y + 4, r * 1.8, r * .34, -.25, 0, 6.28); o(7, '#FF4F9A'); c.stroke(); },
    fish: function (x, y, s, dir, col) { c.save(); c.translate(x, y); c.scale(dir < 0 ? -s : s, s); c.beginPath(); c.moveTo(-30, 0); c.quadraticCurveTo(0, -24, 28, 0); c.quadraticCurveTo(0, 24, -30, 0); fillStroke(col || '#FFC93C', 4); c.beginPath(); c.moveTo(-28, 0); c.lineTo(-48, -16); c.lineTo(-48, 16); c.closePath(); fillStroke(col || '#FFC93C', 4); c.fillStyle = INK; c.beginPath(); c.arc(14, -4, 4, 0, 6.28); c.fill(); c.restore(); },
    sunflower: function (x, y, s, t) { c.save(); c.translate(x, y); c.rotate(Math.sin(t * 1.5 + x) * .05); c.scale(s, s); o(6, '#2E8B57'); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -110); c.stroke(); c.beginPath(); c.ellipse(14, -50, 16, 7, -.5, 0, 6.28); fillStroke('#3CCB7F', 3); for (var i = 0; i < 12; i++) { c.save(); c.translate(0, -120); c.rotate(i / 12 * 6.28); c.beginPath(); c.ellipse(0, -28, 9, 16, 0, 0, 6.28); fillStroke('#FFC93C', 3); c.restore(); } c.beginPath(); c.arc(0, -120, 20, 0, 6.28); fillStroke('#8B5A2B', 4); c.restore(); },
    neon: function (x, y, s, t, txt) { c.save(); c.translate(x, y); c.scale(s, s); var on = Math.sin(t * 9) > -.7; c.beginPath(); c.rect(-70, -30, 140, 60); fillStroke('#1B0F35', 4); c.font = '900 30px Unbounded, Arial Black, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = on ? '#2AF3FF' : '#21606A'; c.shadowColor = '#2AF3FF'; c.shadowBlur = on ? 18 : 0; c.fillText(txt || 'NEON', 0, 2); c.restore(); },
    pine: function (x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.rect(-10, -30, 20, 30); fillStroke('#8B5A2B', 4); [[-70, 0, -150], [-58, -50, -190], [-44, -100, -226]].forEach(function (l) { c.beginPath(); c.moveTo(l[0], l[1] - 20); c.lineTo(0, l[2]); c.lineTo(-l[0], l[1] - 20); c.closePath(); fillStroke('#3CCB7F', 4); }); c.restore(); },
    gear: function (x, y, r, t, col) { c.save(); c.translate(x, y); c.rotate(t); c.beginPath(); var n = 20; for (var i = 0; i <= n; i++) { var a = i / n * 6.28, rr = i % 2 ? r : r * 1.22; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); fillStroke(col || '#FF8A3D', 4); c.beginPath(); c.arc(0, 0, r * .35, 0, 6.28); fillStroke('#FFFDF7', 4); c.restore(); },
    sparkle: function (x, y, r, col) { c.beginPath(); for (var k = 0; k < 8; k++) { var rr = k % 2 ? r * .35 : r, a = k * Math.PI / 4 - Math.PI / 2; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); fillStroke(col || '#FFC93C', 3); },
    flask: function (x, y, s, col, t) { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-12, -80); c.lineTo(12, -80); c.lineTo(12, -50); c.lineTo(40, 0); c.quadraticCurveTo(44, 14, 30, 14); c.lineTo(-30, 14); c.quadraticCurveTo(-44, 14, -40, 0); c.lineTo(-12, -50); c.closePath(); fillStroke(col || '#C6F432', 4); c.fillStyle = 'rgba(255,253,247,.8)'; for (var i = 0; i < 3; i++) { c.beginPath(); c.arc(-10 + i * 12, -10 - ((t * 30 + i * 20) % 50), 4, 0, 6.28); c.fill(); } c.restore(); },
    rocket: function (x, y, s, t) { c.save(); c.translate(x, y); c.rotate(-.35); c.scale(s, s); c.beginPath(); c.moveTo(-16, 40); c.quadraticCurveTo(0, 90 + Math.sin(t * 30) * 10, 16, 40); fillStroke('#FFC93C', 4); c.beginPath(); c.moveTo(0, -80); c.bezierCurveTo(30, -56, 32, 0, 24, 40); c.lineTo(-24, 40); c.bezierCurveTo(-32, 0, -30, -56, 0, -80); fillStroke('#FFFDF7', 5); c.beginPath(); c.arc(0, -20, 14, 0, 6.28); fillStroke('#2BBEF0', 4); c.beginPath(); c.moveTo(-24, 10); c.lineTo(-46, 44); c.lineTo(-22, 36); c.closePath(); fillStroke('#FF4F9A', 4); c.beginPath(); c.moveTo(24, 10); c.lineTo(46, 44); c.lineTo(22, 36); c.closePath(); fillStroke('#FF4F9A', 4); c.restore(); }
  };
  var GUEST = {
    space: function (x, y, t) { P.planet(x, y - 60, 36); },
    ocean: function (x, y, t) { P.fish(x + Math.sin(t) * 20, y - 60, 1.2, 1, '#FF4F9A'); },
    cossack: function (x, y, t) { P.sunflower(x, y, .9, t); },
    cyber: function (x, y, t) { P.neon(x, y - 70, .9, t, '2099'); },
    forest: function (x, y, t) { P.pine(x, y, .7); },
    robots: function (x, y, t) { P.gear(x, y - 60, 40, t, '#FF8A3D'); },
    fairy: function (x, y, t) { P.sparkle(x, y - 80, 30 + Math.sin(t * 4) * 4, '#FFC93C'); P.sparkle(x + 40, y - 130, 14, '#FF4F9A'); },
    science: function (x, y, t) { P.flask(x, y, 1, '#C6F432', t); }
  };

  function grad(stops) { var g = c.createLinearGradient(0, 0, 0, H); stops.forEach(function (s, i) { g.addColorStop(i / (stops.length - 1), s); }); return g; }
  function ground(col, y, amp, ph) { c.beginPath(); c.moveTo(-50, H + 10); for (var x = -50; x <= W + 50; x += 30) c.lineTo(x, y + Math.sin(x / 140 + (ph || 0)) * (amp || 14)); c.lineTo(W + 50, H + 10); c.closePath(); fillStroke(col, 5); }
  var DRAW = {
    space: function (x0, x1, t) {
      var rw = x1 - x0; c.fillStyle = grad(['#0A0B2A', '#160C2B', '#2A1752']); c.fillRect(-50, 0, W + 100, H);
      for (var i = 0; i < 110; i++) { var a = .4 + .6 * Math.abs(Math.sin(t * 1.5 + i)); c.globalAlpha = a; c.fillStyle = i % 7 ? '#FFFDF7' : '#FFC93C'; c.beginPath(); c.arc(rnd(i) * W, rnd(i + 50) * 560, 1 + rnd(i + 99) * 2.4, 0, 6.28); c.fill(); }
      c.globalAlpha = 1; P.planet(x0 + rw * .32, 170, 64);
      ground('#6E6A8A', GROUND + 20, 18, 1);
      c.fillStyle = 'rgba(26,20,35,.25)'; [.2, .5, .8].forEach(function (f, k) { c.beginPath(); c.ellipse(x0 + rw * f, GROUND + 70 + k * 10, 40, 10, 0, 0, 6.28); c.fill(); });
      P.rocket(x0 + rw * .68, 400 + Math.sin(t * 1.4) * 14, 1.1, t);
    },
    ocean: function (x0, x1, t) {
      var rw = x1 - x0; c.fillStyle = grad(['#7FD8FF', '#2BBEF0', '#1466B8']); c.fillRect(-50, 0, W + 100, H);
      o(3, 'rgba(26,20,35,.25)'); for (var r = 0; r < 4; r++) { c.beginPath(); for (var x = -50; x <= W + 50; x += 20) { var y = 120 + r * 120 + Math.sin(x / 60 + t * 1.5 + r) * 8; x === -50 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); }
      ground('#E8C77A', GROUND + 30, 12, 2);
      for (var w = 0; w < 6; w++) { var bx = x0 + rw * (w + .5) / 6; c.beginPath(); c.moveTo(bx - 10, GROUND + 40); c.quadraticCurveTo(bx + Math.sin(t * 2 + w) * 22, GROUND - 60, bx + Math.sin(t * 1.7 + w) * 12, GROUND - 130 - (w % 3) * 20); c.quadraticCurveTo(bx + 14, GROUND - 40, bx + 10, GROUND + 40); fillStroke(w % 2 ? '#3CCB7F' : '#FF4F9A', 4); }
      for (var f = 0; f < 5; f++) { var sp = (f % 2 ? 1 : -1) * (20 + f * 8), fx = x0 + ((((rnd(f) * rw + t * sp) % (rw + 160)) + rw + 160) % (rw + 160)) - 80; P.fish(fx, 160 + f * 80 + Math.sin(t * 2 + f) * 8, .9 + rnd(f + 3) * .5, sp, ['#FFC93C', '#FF4F9A', '#FFFDF7', '#FF8A3D', '#3CCB7F'][f]); }
      o(3, 'rgba(255,253,247,.85)'); for (var b = 0; b < 26; b++) { var by = H - ((t * (30 + rnd(b) * 40) + rnd(b + 7) * H) % H); c.beginPath(); c.arc(x0 + rnd(b + 20) * rw, by, 3 + rnd(b + 40) * 7, 0, 6.28); c.stroke(); }
    },
    cossack: function (x0, x1, t) {
      var rw = x1 - x0; c.fillStyle = grad(['#8FD3FF', '#BDE3FF', '#FFF1D2']); c.fillRect(-50, 0, W + 100, H);
      c.beginPath(); c.arc(x0 + rw * .78, 140, 56, 0, 6.28); fillStroke('#FFC93C', 5);
      ground('#FFC93C', GROUND - 40, 20, 0); ground('#3CCB7F', GROUND + 50, 10, 1);
      o(2.5, 'rgba(26,20,35,.4)'); for (var k = 0; k < 40; k++) { var wx = x0 + rnd(k) * rw, wy = GROUND - 20 + rnd(k + 9) * 60; c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx + Math.sin(t * 2 + k) * 4, wy - 24); c.stroke(); }
      var hx = x0 + rw * .5, hy = GROUND + 20; c.beginPath(); c.rect(hx - 110, hy - 140, 220, 140); fillStroke('#FFFDF7', 5);
      c.beginPath(); c.moveTo(hx - 140, hy - 136); c.quadraticCurveTo(hx, hy - 290, hx + 140, hy - 136); c.closePath(); fillStroke('#E8B44A', 5);
      o(2.5); for (var s = -110; s <= 110; s += 22) { c.beginPath(); c.moveTo(hx + s, hy - 150); c.lineTo(hx + s * .6, hy - 210); c.stroke(); }
      [-60, 60].forEach(function (d) { c.beginPath(); c.rect(hx + d - 24, hy - 104, 48, 44); fillStroke('#2BBEF0', 4); c.beginPath(); c.rect(hx + d - 40, hy - 104, 14, 44); fillStroke('#FF2E63', 3); c.beginPath(); c.rect(hx + d + 26, hy - 104, 14, 44); fillStroke('#FF2E63', 3); });
      c.beginPath(); c.rect(hx - 106, hy - 30, 212, 10); c.fillStyle = '#FF2E63'; c.fill();
      P.sunflower(x0 + rw * .15, GROUND + 40, 1, t); P.sunflower(x0 + rw * .86, GROUND + 50, .85, t);
    },
    cyber: function (x0, x1, t) {
      var rw = x1 - x0; c.fillStyle = grad(['#1B0F35', '#3A1A5E', '#5B1E5E']); c.fillRect(-50, 0, W + 100, H);
      c.beginPath(); c.arc(x0 + rw * .7, 150, 70, 0, 6.28); c.fillStyle = '#FF2E63'; c.shadowColor = '#FF2E63'; c.shadowBlur = 40; c.fill(); c.shadowBlur = 0;
      for (var b = 0; b < 7; b++) {
        var bw = 90 + rnd(b) * 70, bh = 200 + rnd(b + 5) * 260, bx = x0 + (b / 7) * rw + rnd(b + 2) * 20, by = GROUND - bh;
        c.beginPath(); c.rect(bx, by, bw, bh + 10); fillStroke('#120826', 4);
        for (var wy = by + 20; wy < GROUND - 20; wy += 30) for (var wx = bx + 14; wx < bx + bw - 14; wx += 24) { var lit = rnd(wx * 3 + wy) > .45 && Math.sin(t * 3 + wx + wy) > -.8; c.fillStyle = lit ? (rnd(wx + wy) > .5 ? '#2AF3FF' : '#FF2E63') : '#2A1E48'; c.fillRect(wx, wy, 12, 14); }
      }
      c.fillStyle = '#120826'; c.fillRect(-50, GROUND, W + 100, H - GROUND);
      o(2, 'rgba(42,243,255,.8)'); for (var gy = 0; gy < 7; gy++) { var yy = GROUND + Math.pow(gy / 6, 1.8) * (H - GROUND) + ((t * 40) % 20) * (gy / 6); c.beginPath(); c.moveTo(-50, yy); c.lineTo(W + 50, yy); c.stroke(); }
      o(2, 'rgba(255,46,99,.7)'); for (var gx = -12; gx <= 12; gx++) { c.beginPath(); c.moveTo(W / 2 + gx * 40, GROUND); c.lineTo(W / 2 + gx * 180, H); c.stroke(); }
      P.neon(x0 + rw * .3, 230, 1, t, 'NEON');
    },
    forest: function (x0, x1, t) {
      var rw = x1 - x0; c.fillStyle = grad(['#9FDCFF', '#CFF2C2']); c.fillRect(-50, 0, W + 100, H);
      [[.25, 130, 40], [.7, 90, 30]].forEach(function (cl, i) { var cx = x0 + ((cl[0] * rw + t * 10 * (i + 1)) % (rw + 200)) - 60; c.beginPath(); c.arc(cx, cl[1], cl[2], Math.PI * .5, Math.PI * 1.5); c.arc(cx + cl[2], cl[1] - cl[2] * .5, cl[2], Math.PI, 0); c.arc(cx + cl[2] * 2, cl[1], cl[2], Math.PI * 1.5, Math.PI * .5); c.closePath(); fillStroke('#FFFDF7', 4); });
      ground('#7BD88F', GROUND - 60, 30, 0.5);
      [.12, .32, .55, .76, .92].forEach(function (f, i) { P.pine(x0 + rw * f, GROUND - 30 + (i % 2) * 20, .9 + (i % 3) * .18); });
      ground('#3CCB7F', GROUND + 50, 12, 2);
      [.2, .45, .66, .85].forEach(function (f, i) { var mx = x0 + rw * f, my = GROUND + 60; c.beginPath(); c.rect(mx - 8, my - 26, 16, 26); fillStroke('#FFFDF7', 3); c.beginPath(); c.moveTo(mx - 30, my - 24); c.quadraticCurveTo(mx, my - 70, mx + 30, my - 24); c.closePath(); fillStroke(i % 2 ? '#FFC93C' : '#FF4F9A', 4); });
    },
    robots: function (x0, x1, t) {
      var rw = x1 - x0; c.fillStyle = '#E4E2EE'; c.fillRect(-50, 0, W + 100, H);
      o(1.5, 'rgba(43,190,240,.5)'); for (var g = 0; g < W; g += 40) { c.beginPath(); c.moveTo(g, 0); c.lineTo(g, H); c.stroke(); c.beginPath(); c.moveTo(0, g); c.lineTo(W, g); c.stroke(); }
      P.gear(x0 + rw * .25, 200, 80, t * .6, '#FF8A3D'); P.gear(x0 + rw * .25 + 150, 290, 50, -t * .96, '#2AF3FF'); P.gear(x0 + rw * .85, 140, 44, t, '#FFC93C');
      c.beginPath(); c.rect(-50, GROUND, W + 100, H - GROUND); fillStroke('#8C8FA3', 5);
      c.fillStyle = INK; for (var r = 20; r < W; r += 60) { c.beginPath(); c.arc(r, GROUND + 24, 4, 0, 6.28); c.fill(); }
      var rx = x0 + rw * .62, ry = GROUND; c.beginPath(); c.rect(rx - 60, ry - 170, 120, 130); fillStroke('#FFFDF7', 5);
      c.beginPath(); c.rect(rx - 46, ry - 270, 92, 80); fillStroke('#FF8A3D', 5);
      c.fillStyle = '#2AF3FF'; [-20, 20].forEach(function (d) { c.beginPath(); c.arc(rx + d, ry - 232, 13, 0, 6.28); c.fill(); o(4); c.stroke(); });
      o(5); c.beginPath(); c.moveTo(rx, ry - 270); c.lineTo(rx, ry - 300); c.stroke(); c.beginPath(); c.arc(rx, ry - 306, 8, 0, 6.28); fillStroke('#FF4F9A', 4);
      o(10); c.beginPath(); c.moveTo(rx - 60, ry - 140); c.lineTo(rx - 100, ry - 70); c.stroke();
      var wave = Math.sin(t * 5) * .5; c.beginPath(); c.moveTo(rx + 60, ry - 140); c.lineTo(rx + 60 + Math.cos(-1.2 + wave) * 70, ry - 140 + Math.sin(-1.2 + wave) * 70); c.stroke();
      c.beginPath(); c.rect(rx - 50, ry - 40, 30, 40); fillStroke('#8C8FA3', 4); c.beginPath(); c.rect(rx + 20, ry - 40, 30, 40); fillStroke('#8C8FA3', 4);
      c.fillStyle = INK; c.fillRect(rx - 30, ry - 130, 60, 26); c.fillStyle = Math.sin(t * 4) > 0 ? '#3CCB7F' : '#FF4F9A'; c.fillRect(rx - 22, ry - 124, 14, 14);
    },
    fairy: function (x0, x1, t) {
      var rw = x1 - x0; c.fillStyle = grad(['#3A2470', '#6E4FE0', '#B18CFF']); c.fillRect(-50, 0, W + 100, H);
      c.beginPath(); c.arc(x0 + rw * .8, 130, 54, 0, 6.28); fillStroke('#FFFDF7', 5); c.beginPath(); c.arc(x0 + rw * .8 + 24, 116, 48, 0, 6.28); c.fillStyle = '#4B33A8'; c.fill();
      ground('#C6F432', GROUND - 10, 34, 1.2);
      var cx = x0 + rw * .45, cy = GROUND - 20;
      c.beginPath(); c.rect(cx - 120, cy - 200, 240, 200); fillStroke('#FFFDF7', 5);
      [[-150, 300, 60], [150, 300, 60], [0, 360, 70]].forEach(function (tw) { c.beginPath(); c.rect(cx + tw[0] - tw[2] / 2, cy - tw[1], tw[2], tw[1]); fillStroke('#FFFDF7', 5); c.beginPath(); c.moveTo(cx + tw[0] - tw[2] / 2 - 12, cy - tw[1]); c.lineTo(cx + tw[0], cy - tw[1] - 90); c.lineTo(cx + tw[0] + tw[2] / 2 + 12, cy - tw[1]); c.closePath(); fillStroke('#FF4F9A', 5); c.beginPath(); c.rect(cx + tw[0] - 10, cy - tw[1] + 40, 20, 30); fillStroke('#FFC93C', 3); });
      c.beginPath(); c.moveTo(cx - 34, cy); c.lineTo(cx - 34, cy - 70); c.quadraticCurveTo(cx, cy - 110, cx + 34, cy - 70); c.lineTo(cx + 34, cy); fillStroke('#8B5A2B', 5);
      for (var s = 0; s < 14; s++) P.sparkle(x0 + rnd(s) * rw, 80 + rnd(s + 30) * 380, 8 + Math.abs(Math.sin(t * 3 + s)) * 10, s % 2 ? '#FFC93C' : '#C6F432');
    },
    science: function (x0, x1, t) {
      var rw = x1 - x0; c.fillStyle = '#FFF6E6'; c.fillRect(-50, 0, W + 100, H);
      o(2, 'rgba(26,20,35,.12)'); for (var g = 0; g < W; g += 60) { c.beginPath(); c.moveTo(g, 0); c.lineTo(g, GROUND); c.stroke(); } for (var gy = 0; gy < GROUND; gy += 60) { c.beginPath(); c.moveTo(0, gy); c.lineTo(W, gy); c.stroke(); }
      var ax = x0 + rw * .3, ay = 190; o(4, '#2BBEF0'); for (var k = 0; k < 3; k++) { c.beginPath(); c.ellipse(ax, ay, 110, 36, k * Math.PI / 3, 0, 6.28); c.stroke(); var ea = t * 2 + k * 2.1; c.beginPath(); c.arc(ax + Math.cos(ea) * 110 * Math.cos(k * Math.PI / 3) - Math.sin(ea) * 36 * Math.sin(k * Math.PI / 3), ay + Math.cos(ea) * 110 * Math.sin(k * Math.PI / 3) + Math.sin(ea) * 36 * Math.cos(k * Math.PI / 3), 9, 0, 6.28); fillStroke('#FF4F9A', 3); }
      c.beginPath(); c.arc(ax, ay, 20, 0, 6.28); fillStroke('#FFC93C', 4);
      c.fillStyle = INK; c.font = '900 46px Unbounded, Arial Black, sans-serif'; c.textAlign = 'left'; c.fillText('E=mc²', x0 + rw * .62, 160);
      c.beginPath(); c.rect(-50, GROUND - 20, W + 100, 40); fillStroke('#8B5A2B', 5); c.beginPath(); c.rect(-50, GROUND + 20, W + 100, H); fillStroke('#DDE8D6', 5);
      P.flask(x0 + rw * .2, GROUND - 26, 1.2, '#C6F432', t); P.flask(x0 + rw * .5, GROUND - 26, .9, '#FF4F9A', t + 1); P.flask(x0 + rw * .78, GROUND - 26, 1.4, '#2BBEF0', t + 2);
    }
  };

  function seamX(base, y, t) { return base + Math.sin(y / 70 + t * .8) * 14; }
  function clipSide(base, off, left, t) {
    c.beginPath();
    if (left) { c.moveTo(-60, -10); for (var y = -10; y <= H + 10; y += 15) c.lineTo(seamX(base, y, t) + off, y); c.lineTo(-60, H + 10); }
    else { c.moveTo(W + 60, -10); for (var y2 = -10; y2 <= H + 10; y2 += 15) c.lineTo(seamX(base, y2, t) + off, y2); c.lineTo(W + 60, H + 10); }
    c.closePath(); c.clip();
  }
  function drawSeam(base, prog, t) {
    var end = H * prog;
    o(9); c.beginPath(); for (var y = 0; y <= end; y += 10) { var x = seamX(base, y, t); y ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    o(7, '#FF4F9A');
    for (var s = 20; s < end; s += 34) { var x1 = seamX(base, s, t); c.beginPath(); c.moveTo(x1 - 18, s - 8); c.lineTo(x1 + 18, s + 8); c.stroke(); }
  }
  function drawStibok(x, y, t, prog) {
    c.save(); c.translate(x, y + Math.sin(t * 3) * 6); var sc = .9; c.scale(sc, sc);
    o(6); c.beginPath(); c.moveTo(-30, 52); c.quadraticCurveTo(-36, 78, -52, 82); c.moveTo(30, 52); c.quadraticCurveTo(36, 78, 52, 82); c.stroke();
    c.fillStyle = INK; c.beginPath(); c.ellipse(-56, 84, 14, 7, 0, 0, 6.28); c.ellipse(56, 84, 14, 7, 0, 0, 6.28); c.fill();
    c.beginPath(); c.arc(0, 0, 58, 0, 6.28); fillStroke('#FF4F9A', 6);
    o(3, 'rgba(26,20,35,.35)'); c.beginPath(); c.moveTo(-50, -26); c.quadraticCurveTo(-10, -6, 48, -32); c.moveTo(-56, 4); c.quadraticCurveTo(-4, 30, 56, 0); c.moveTo(-20, -54); c.quadraticCurveTo(-44, -4, -24, 54); c.stroke();
    [-20, 20].forEach(function (d) { c.beginPath(); c.arc(d, -8, 15, 0, 6.28); fillStroke('#FFFDF7', 4); c.fillStyle = INK; c.beginPath(); c.arc(d + Math.sin(t) * 3, -8, 6.5, 0, 6.28); c.fill(); });
    o(4); c.beginPath(); c.arc(0, 14, 14, .2, Math.PI - .2); c.stroke();
    o(5); c.beginPath(); c.moveTo(52, -6); c.quadraticCurveTo(78, -16, 86, -40 - Math.sin(t * 6) * 6 * (1 - prog)); c.stroke();
    c.save(); c.translate(86, -42); c.rotate(-.66); c.beginPath(); c.moveTo(0, -44); c.lineTo(5, 30); c.lineTo(0, 40); c.lineTo(-5, 30); c.closePath(); fillStroke('#E9E6F2', 3.5); c.restore();
    c.restore();
  }
  function banner(name, sub) {
    c.font = '900 46px Unbounded, Arial Black, sans-serif';
    var size = 46; while (c.measureText(name).width > 760 && size > 24) { size -= 2; c.font = '900 ' + size + 'px Unbounded, Arial Black, sans-serif'; }
    var w = c.measureText(name).width + 56;
    c.save(); c.translate(36, 30); c.rotate(-.015);
    c.fillStyle = INK; roundRect(8, 8, w, size + 66, 22); c.fill();
    c.fillStyle = '#FFFDF7'; roundRect(0, 0, w, size + 66, 22); c.fill(); o(5); c.stroke();
    c.fillStyle = INK; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(name, 28, 18);
    c.font = '700 18px Onest, Arial, sans-serif'; c.fillStyle = '#4A3F55'; c.fillText(sub, 28, 26 + size);
    c.restore();
    c.font = '900 16px Unbounded, Arial Black, sans-serif'; var cr = SS.L('Шов Світів', 'Worldseam'), cw = c.measureText(cr).width + 30;
    c.fillStyle = '#FFC93C'; roundRect(W - cw - 24, H - 52, cw, 34, 17); c.fill(); o(3); c.stroke(); c.fillStyle = INK; c.textBaseline = 'middle'; c.fillText(cr, W - cw - 9, H - 35);
  }
  function roundRect(x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  function draw(st, t, e, opts) {
    opts = opts || {};
    var base = W * st.p / 100, gap = (1 - e) * 140;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = '#FFF1D2'; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(26,20,35,.12)'; for (var hx = 0; hx < W; hx += 14) for (var hy = 0; hy < H; hy += 14) c.fillRect(hx, hy, 2, 2);
    c.save(); clipSide(base, -gap / 2, true, t); c.translate(-gap / 2, 0); DRAW[st.a](0, base, t); GUEST[st.b](base * .5 + 60, GROUND + 70, t); c.restore();
    c.save(); clipSide(base, gap / 2, false, t); c.translate(gap / 2, 0); DRAW[st.b](base, W, t); GUEST[st.a](base + (W - base) * .42, GROUND + 70, t); c.restore();
    drawSeam(base, e, t);
    if (opts.handle) { var hy2 = opts.handleY || 300, hx2 = seamX(base, hy2, t); c.beginPath(); c.arc(hx2, hy2, 30, 0, 6.28); fillStroke('#FFC93C', 5); c.fillStyle = INK; c.font = '900 26px Unbounded, Arial Black, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('⇔', hx2, hy2 + 1); }
    drawStibok(seamX(base, 600, t), 600 - 30, t, e);
    if (opts.banner !== false) {
      var A = SS.worldById(st.a), B = SS.worldById(st.b);
      banner(SS.mixName(st.a, st.b, st.p), SS.L(A.ua, A.en) + ' ' + st.p + '% + ' + SS.L(B.ua, B.en) + ' ' + (100 - st.p) + '%');
    }
  }
  return { draw: draw, W: W, H: H, seamX: seamX };
  };
})();
