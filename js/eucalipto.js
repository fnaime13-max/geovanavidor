/* Eucalipto em vaso dourado — o arranjo da recepção do consultório.
   Os galhos balançam com o movimento do mouse, as folhas giram quando tocadas
   e um clique solta algumas folhas, que caem e voltam a nascer. */
(function () {
  'use strict';
  var TAU = Math.PI * 2;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // folhas secas do arranjo: cobre, bronze, champanhe e creme
  var FRENTE = ['#A8714F', '#93583E', '#C4926E', '#D6BC9C', '#E7D9C4', '#B98468', '#8A563C', '#CFAE8A'];
  var VERSO  = ['#D9BCA2', '#C9A78C', '#E6CFB7', '#EFE3D2', '#F6EEE2', '#DDBFA8', '#C69F84', '#E8D4BC'];

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function Eucalipto(canvas, cfg) {
    this.c = canvas;
    this.x = canvas.getContext('2d');
    this.cfg = cfg;
    this.g = reduz ? 1 : 0;          // crescimento global 0→1
    this.gAlvo = reduz ? 1 : 0;
    this.m = { x: -9999, y: -9999, vx: 0, vy: 0, dentro: false };
    this.caindo = [];
    this.t = 0;
    this.ativo = true;
    this.medir();
    this.montar();
    this.ouvir();
    var self = this;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { self.visivel = e[0].isIntersecting; if (self.visivel) self.laco(); }, { rootMargin: '80px' }).observe(canvas);
    } else { this.visivel = true; }
    if ('ResizeObserver' in window) {
      var to;
      new ResizeObserver(function () { clearTimeout(to); to = setTimeout(function () { self.medir(); self.montar(); self.desenhar(); }, 120); }).observe(canvas);
    }
    this.desenhar();
  }

  Eucalipto.prototype.medir = function () {
    var r = this.c.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = Math.max(1, r.width); this.H = Math.max(1, r.height);
    this.c.width = Math.round(this.W * this.dpr); this.c.height = Math.round(this.H * this.dpr);
    this.s = Math.min(this.H / 720, this.W / 420);
  };

  Eucalipto.prototype.montar = function () {
    var cfg = this.cfg, s = this.s, self = this;
    var vw = 54 * s * (cfg.vaso || 1), vh = 150 * s * (cfg.vaso || 1);
    this.vaso = { x: cfg.origem * this.W, y: this.H, w: vw, h: vh };
    var bx = this.vaso.x, by = this.H - vh + 6 * s;
    this.galhos = [];
    cfg.galhos.forEach(function (gd, gi) {
      var g = self.novoGalho(null, 0, bx + (gi % 3 - 1) * vw * .18, by, gd.a * Math.PI / 180, gd.L * self.H, gd.k || 0, gd.n || 14, gi * .07);
      self.galhos.push(g);
      // raminhos laterais
      (gd.ramos || []).forEach(function (rm) {
        var sub = self.novoGalho(g, Math.round(rm.i * g.n), 0, 0, rm.a * Math.PI / 180, rm.L * self.H, rm.k || 0, 7, gi * .07 + rm.i * .5);
        self.galhos.push(sub);
      });
    });
  };

  Eucalipto.prototype.novoGalho = function (pai, idx, x, y, a, L, k, n, atraso) {
    var g = { pai: pai, idx: idx, x0: x, y0: y, a0: a, L: L, k: k, n: n, seg: L / n, atraso: atraso,
      bend: 0, vb: 0, fase: rnd(0, TAU), pts: [], folhas: [] };
    for (var i = 0; i <= n; i++) g.pts.push({ x: 0, y: 0, a: 0 });
    var r0 = (pai ? 8.5 : 11) * this.s;
    for (var j = 2; j <= n; j++) {
      var tam = r0 * (1.05 - .55 * (j / n)) * rnd(.85, 1.12);
      for (var lado = -1; lado <= 1; lado += 2) {
        var ci = (Math.random() * FRENTE.length) | 0;
        g.folhas.push({ i: j, lado: lado, r: tam, cf: FRENTE[ci], cv: VERSO[ci],
          flip: rnd(-.5, .5), vf: 0, rot: rnd(-.3, .3), vr: 0, cresce: 1, solta: false, x: 0, y: 0 });
      }
    }
    return g;
  };

  Eucalipto.prototype.ouvir = function () {
    var self = this, ult = null;
    window.addEventListener('pointermove', function (e) {
      var r = self.c.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (ult) { self.m.vx = clamp(x - ult.x, -60, 60); self.m.vy = clamp(y - ult.y, -60, 60); }
      ult = { x: x, y: y };
      self.m.x = x; self.m.y = y;
      self.m.dentro = x > -40 && y > -40 && x < self.W + 40 && y < self.H + 40;
      if (self.m.dentro) self.laco();
    }, { passive: true });
    window.addEventListener('pointerdown', function (e) {
      if (reduz) return;
      var r = self.c.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > self.W || y > self.H) return;
      if (e.target.closest && e.target.closest('a, button, summary, input')) return;
      self.soltar(x, y);
    });
  };

  Eucalipto.prototype.soltar = function (x, y) {
    var R = 110 * this.s, n = 0, self = this;
    this.galhos.forEach(function (g) {
      g.folhas.forEach(function (f) {
        if (n >= 7 || f.solta || f.cresce < 1) return;
        var dx = f.x - x, dy = f.y - y;
        if (dx * dx + dy * dy < R * R && Math.random() < .75) {
          f.solta = true; n++;
          self.caindo.push({ f: f, x: f.x, y: f.y, vx: rnd(-1.4, 1.4) + dx * .01, vy: rnd(-2.2, -.6), rot: f.rot, vr: rnd(-.08, .08), flip: f.flip, vf: rnd(.08, .2), vida: 0 });
        }
      });
    });
    g0(this);
    function g0(s) { s.laco(); }
  };

  Eucalipto.prototype.crescer = function (dur) {
    if (reduz) return;
    this.gAlvo = 1; this.gDur = dur || 1800; this.gIni = performance.now(); this.laco();
  };

  Eucalipto.prototype.laco = function () {
    if (this.rodando || reduz) return;
    var self = this; this.rodando = true; this.ocioso = 0;
    requestAnimationFrame(function passo(ts) {
      if (!self.visivel && self.g >= 1) { self.rodando = false; return; }
      self.atualizar(ts); self.desenhar();
      // dorme quando tudo parou e o mouse está longe
      var calmo = !self.m.dentro && self.caindo.length === 0 && self.g >= 1 && self.energia < .0004;
      self.ocioso = calmo ? self.ocioso + 1 : 0;
      if (self.ocioso > 240) { self.rodando = false; return; }
      requestAnimationFrame(passo);
    });
  };

  Eucalipto.prototype.atualizar = function (ts) {
    this.t += 1 / 60;
    if (this.gIni && this.g < 1) {
      var p = clamp((ts - this.gIni) / this.gDur, 0, 1);
      this.g = 1 - Math.pow(1 - p, 3);
    }
    var m = this.m, s = this.s, t = this.t, energia = 0;
    m.vx *= .86; m.vy *= .86;
    var vel = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
    var Rg = 150 * s;

    for (var gi = 0; gi < this.galhos.length; gi++) {
      var g = this.galhos[gi];
      // força do mouse: componente perpendicular ao galho, perto da ponta
      var tip = g.pts[g.n], mid = g.pts[g.n >> 1];
      var dx = m.x - (tip.x + mid.x) / 2, dy = m.y - (tip.y + mid.y) / 2;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (m.dentro && d < Rg) {
        var fall = 1 - d / Rg, a = tip.a;
        var perp = -Math.sin(a) * m.vx + Math.cos(a) * m.vy;
        g.vb += perp * .0011 * fall * (g.pai ? 1.4 : 1);
        // empurrão suave para longe do cursor parado
        var lado = Math.cos(a) * dy - Math.sin(a) * dx;
        g.vb -= Math.sign(lado) * .0009 * fall * fall;
      }
      g.vb += -.018 * g.bend; g.vb *= .9; g.bend += g.vb;
      g.bend = clamp(g.bend, -.7, .7);
      energia += Math.abs(g.vb);

      for (var fi = 0; fi < g.folhas.length; fi++) {
        var f = g.folhas[fi];
        if (f.solta) continue;
        if (f.cresce < 1) { f.cresce = Math.min(1, f.cresce + .012); energia += .001; }
        var fx = m.x - f.x, fy = m.y - f.y;
        if (m.dentro && vel > .6 && fx * fx + fy * fy < (f.r * 1.8) * (f.r * 1.8)) {
          f.vf += vel * .012 * (m.vx >= 0 ? 1 : -1);
          f.vr += (m.vy * .004);
        }
        // a folha volta a assentar em uma face (múltiplo de 2π)
        var alvo = Math.round(f.flip / TAU) * TAU;
        f.vf += (alvo - f.flip) * .02; f.vf *= .93; f.flip += f.vf;
        f.vr += -f.rot * .03; f.vr *= .9; f.rot += f.vr;
        energia += Math.abs(f.vf) * .1;
      }
    }

    for (var i = this.caindo.length - 1; i >= 0; i--) {
      var c = this.caindo[i];
      c.vida++; c.vy += .045 * s * 1.2; c.vx *= .992; c.vy *= .985;
      c.vx += Math.sin(c.vida * .06 + i) * .05;
      c.x += c.vx; c.y += c.vy; c.rot += c.vr; c.flip += c.vf;
      if (c.y > this.H + 30 || c.vida > 420) {
        this.caindo.splice(i, 1);
        (function (f) { setTimeout(function () { f.solta = false; f.cresce = 0; f.flip = 0; f.vf = 0; }, rnd(1800, 3800)); })(c.f);
      }
    }
    this.energia = energia;
    // brisa
    this.brisa = Math.sin(t * .7) * .018 + Math.sin(t * 1.9) * .006;
  };

  Eucalipto.prototype.posicionar = function () {
    var brisa = reduz ? 0 : (this.brisa || 0), g = this.g;
    for (var gi = 0; gi < this.galhos.length; gi++) {
      var b = this.galhos[gi], p0;
      if (b.pai) { p0 = b.pai.pts[b.idx]; b.x0 = p0.x; b.y0 = p0.y; }
      var a = b.a0 + (b.pai ? b.pai.pts[b.idx].a - b.pai.a0 : 0);
      // crescimento escalonado
      var lg = clamp((g - b.atraso) / (1 - Math.min(.6, b.atraso)), 0, 1);
      b.cresc = lg;
      var x = b.x0, y = b.y0;
      b.pts[0].x = x; b.pts[0].y = y; b.pts[0].a = a;
      for (var i = 1; i <= b.n; i++) {
        var u = i / b.n;
        var ai = a + b.k * u + (b.bend + brisa * (1 + b.fase * .05)) * Math.pow(u, 1.4) * 1.4;
        var len = b.seg * lg;
        x += Math.cos(ai) * len; y += Math.sin(ai) * len;
        b.pts[i].x = x; b.pts[i].y = y; b.pts[i].a = ai;
      }
    }
  };

  Eucalipto.prototype.folha = function (x, y, r, rot, flip, cf, cv, esc) {
    var ctx = this.x, sx = Math.cos(flip);
    if (esc <= .01) return;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot); ctx.scale(Math.max(.08, Math.abs(sx)) * esc, esc);
    var frente = sx >= 0;
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * .78, 0, 0, TAU);
    ctx.fillStyle = frente ? cf : cv; ctx.fill();
    // meia-folha mais escura: dá volume sem parecer esfera
    ctx.save(); ctx.clip();
    ctx.fillStyle = frente ? 'rgba(60,35,22,.16)' : 'rgba(120,90,70,.10)';
    ctx.fillRect(-r, 0, r * 2, r);
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(-r * .9, 0); ctx.quadraticCurveTo(0, -r * .08, r * .8, 0);
    ctx.strokeStyle = frente ? 'rgba(70,42,28,.38)' : 'rgba(120,90,70,.3)'; ctx.lineWidth = Math.max(.5, r * .07); ctx.stroke();
    ctx.restore();
  };

  function shade(hex, p) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
    var f = 1 + p / 100;
    return 'rgb(' + clamp(r * f | 0, 0, 255) + ',' + clamp(g * f | 0, 0, 255) + ',' + clamp(b * f | 0, 0, 255) + ')';
  }

  Eucalipto.prototype.desenhar = function () {
    var ctx = this.x, s = this.s;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.W, this.H);
    this.posicionar();
    var v = this.vaso, vg = reduz ? 1 : clamp(this.g * 3, 0, 1);

    // boca do vaso (fundo)
    ctx.globalAlpha = vg;
    ctx.beginPath(); ctx.ellipse(v.x, this.H - v.h, v.w / 2, v.w * .12, 0, 0, TAU);
    ctx.fillStyle = '#4A321C'; ctx.fill();
    ctx.globalAlpha = 1;

    // caules
    ctx.lineCap = 'round';
    for (var gi = 0; gi < this.galhos.length; gi++) {
      var b = this.galhos[gi];
      if (b.cresc <= 0) continue;
      ctx.beginPath(); ctx.moveTo(b.pts[0].x, b.pts[0].y);
      for (var i = 1; i <= b.n; i++) ctx.lineTo(b.pts[i].x, b.pts[i].y);
      ctx.strokeStyle = '#6A4634'; ctx.lineWidth = (b.pai ? 1.3 : 2.2) * s; ctx.stroke();
    }
    // folhas
    for (gi = 0; gi < this.galhos.length; gi++) {
      b = this.galhos[gi];
      if (b.cresc <= 0) continue;
      for (var fi = 0; fi < b.folhas.length; fi++) {
        var f = b.folhas[fi], p = b.pts[f.i];
        var perp = p.a + f.lado * Math.PI / 2;
        f.x = p.x + Math.cos(perp) * f.r * .95; f.y = p.y + Math.sin(perp) * f.r * .95;
        if (f.solta) continue;
        var apar = clamp((b.cresc * b.n - f.i + 1.5) / 2, 0, 1) * f.cresce;
        this.folha(f.x, f.y, f.r, perp + f.rot, f.flip, f.cf, f.cv, apar);
      }
    }
    for (var c = 0; c < this.caindo.length; c++) {
      var q = this.caindo[c];
      this.folha(q.x, q.y, q.f.r, q.rot, q.flip, q.f.cf, q.f.cv, 1);
    }

    // corpo do vaso: cilindro de latão escovado
    ctx.globalAlpha = vg;
    var x0 = v.x - v.w / 2, top = this.H - v.h;
    var lg = ctx.createLinearGradient(x0, 0, x0 + v.w, 0);
    lg.addColorStop(0, '#6E4A22'); lg.addColorStop(.22, '#B89967'); lg.addColorStop(.42, '#F1D59E');
    lg.addColorStop(.6, '#C9A46A'); lg.addColorStop(.85, '#8A6230'); lg.addColorStop(1, '#5E3E1C');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.moveTo(x0, top); ctx.lineTo(x0, this.H); ctx.lineTo(x0 + v.w, this.H); ctx.lineTo(x0 + v.w, top);
    ctx.ellipse(v.x, top, v.w / 2, v.w * .12, 0, 0, Math.PI, false);
    ctx.fill();
    // aro
    ctx.beginPath(); ctx.ellipse(v.x, top, v.w / 2, v.w * .12, 0, 0, TAU);
    ctx.strokeStyle = 'rgba(255,236,200,.55)'; ctx.lineWidth = 1.2 * s; ctx.stroke();
    ctx.globalAlpha = 1;
  };

  window.Eucalipto = Eucalipto;
})();
