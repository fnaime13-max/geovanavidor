(function () {
  'use strict';
  var html = document.documentElement, body = document.body;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cfg = window.GV || {};

  /* ---------- links ---------- */
  var wa = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(cfg.mensagem || '');
  document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = wa; a.target = '_blank'; a.rel = 'noopener'; });
  if (cfg.instagram) document.querySelectorAll('[data-insta]').forEach(function (a) { a.href = cfg.instagram; });
  if (cfg.canalInside) document.querySelectorAll('[data-canal]').forEach(function (a) { a.href = cfg.canalInside; });
  var ano = document.getElementById('ano'); if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- avaliações (Google, todas 5 estrelas) ---------- */
  var AV = [
    ['Dandara Amaral', 'Muito além de uma consulta nutricional, me senti acolhida e compreendida num espaço sem julgamentos, sem ideologia estética e sem restrições mirabolantes. Pra quem busca fazer as pazes com a nutrição e, por consequência, com a balança, super recomendo a Geo. Profissional que se destaca no ramo.'],
    ['Amanda Costenaro', 'Excelente profissional! A Ge faz mais do que um plano alimentar: ela te ensina a coisa certa. Sem frescuras, sem invenções. O básico muito bem feito que dá resultado! Estou amando ser paciente dela, ela mudou a minha forma de pensar e agir em relação à comida.'],
    ['Clarissa Bueno', 'Daria mil estrelas para essa profissional! O atendimento é humanizado, acolhedor e sem terrorismo alimentar. Além disso, ela trabalha dentro da realidade do paciente (isso é indispensável para mim). Recomendo a Geovana de olhos fechados e já estou animada para o meu retorno!'],
    ['Letícia Medim', 'O tratamento com a Geo é sensacional! Acolhe, pensa em estratégias e cria uma rotina que cabe na nossa vida! Recomendo de olhos fechados, viver essa experiência transforma vidas!'],
    ['Amanda Ramos', 'Minha experiência nos últimos meses tem sido excelente! Mais do que melhorar minha composição corporal, o acompanhamento transformou completamente minha relação com a alimentação.'],
    ['Mauricio Ribeiro', 'A competência, o conhecimento e a dedicação da Ge são impressionantes. Desde a primeira consulta, fica evidente o cuidado em entender a realidade, os objetivos e as necessidades de cada paciente. Ela não entrega um plano alimentar genérico.'],
    ['Miriã Lima Rosa', 'Desde o primeiro momento da consulta me senti em uma conversa de grandes amigas. Excelente profissional, atenciosa e super motivadora. Realmente uma profissional diferenciada na nutrição!'],
    ['Laura Chiaradia', 'Maravilhosa a experiência! Me senti muitíssimo à vontade, principalmente pelo acolhimento, pelo olhar atencioso e preocupação da Ge em conhecer cada detalhe emocional, hábitos e rotinas, que vão muito além da nutrição! Feliz com a minha escolha!'],
    ['Gabriela Lahm', 'A Geovana é uma profissional incrível! O diferencial dela é olhar o paciente com empatia e acolhimento, o que torna o processo confortável e leve. Sua abordagem humanizada faz toda a diferença e traz resultados significativos. Super recomendo!'],
    ['Ana Julia Vian', 'Excelente! Muito mais do que uma Nutricionista! Não pensem duas vezes em marcar uma consulta! Vocês vão se arrepender de não ter começado a fazer os atendimentos antes!'],
    ['Rafaela M. de Laforet Brauner', 'Fazia anos que não me sentia tão confortável em um consultório, sem julgamentos e em busca da organização para uma vida saudável! Juntas vamos longe! Obrigada pelo ótimo atendimento.'],
    ['Carolina Scopel', 'Uma consulta incrível! Humana, sincera e empática. Geo e nutrição nasceram uma para a outra. Mudou minha vida e meus pensamentos em relação à alimentação. Super indico!'],
    ['Thaís C. Falibuski', 'A Geovana é uma profissional incrível: humana, sensível, cuidadosa, atenciosa e extremamente capacitada em nutrição. Tem me ajudado muito no meu processo, e só tenho a agradecer por estar comigo neste momento.'],
    ['Lívia Scopel', 'Tive uma experiência muito boa, foi uma consulta ótima, em que pude falar tudo que eu gostaria de melhorar e fui ouvida de forma acolhedora. Além de ter descoberto que é possível fazer dieta sem sofrer.'],
    ['Fernanda G. Fernandes', 'Uma nutri impecável que tenho orgulho de chamar de “minha nutri”! Se dedica de verdade para o bem-estar e experiência do paciente. Não troco por nada!'],
    ['Nathalia Peter', 'Geo é uma profissional e ser humano incrível! Toda a sua dedicação faz com que o seu trabalho aconteça com excelência.'],
    ['Victoria C. R. Pereira', 'Profissional maravilhosa, impecável, comprometida! Consultar com uma profissional assim é se sentir acolhida, entender os processos de uma vida saudável e ter com quem contar em uma nova jornada!'],
    ['Deisi Scopel', 'Experiência incrível, atendimento personalizado, humanizado e com resultado. Super recomendo!']
  ];
  var grade = document.getElementById('avGrade'), mais = document.getElementById('avMais');
  var VIS = window.innerWidth < 700 ? 4 : 9;
  var star = '<svg><use href="#i-estrela"/></svg>';
  if (grade) {
    grade.innerHTML = AV.map(function (a, i) {
      var ini = a[0].split(' ').map(function (p) { return p[0]; }).slice(0, 2).join('');
      return '<li class="av__card"' + (i >= VIS ? ' hidden' : '') + '>' +
        '<div class="av__topo"><span class="estrelas" aria-label="5 estrelas">' + star + star + star + star + star + '</span><svg class="g" aria-label="Google"><use href="#i-g"/></svg></div>' +
        '<blockquote>' + a[1] + '</blockquote>' +
        '<p class="av__quem"><span class="av__ini" aria-hidden="true">' + ini + '</span><span>' + a[0] + '<small>Avaliação no Google</small></span></p></li>';
    }).join('');
    mais.addEventListener('click', function () {
      grade.querySelectorAll('[hidden]').forEach(function (li) { li.hidden = false; });
      mais.parentNode.remove();
    });
  }

  /* ---------- letras do nome gigante ---------- */
  document.querySelectorAll('[data-letras]').forEach(function (el, k) {
    var t = el.textContent; el.textContent = '';
    t.split('').forEach(function (c, i) {
      var s = document.createElement('span'); s.className = 'l'; s.textContent = c;
      s.style.transitionDelay = (k * 0.12 + i * 0.045) + 's';
      el.appendChild(s);
    });
  });

  /* ---------- eucaliptos ---------- */
  var mob = window.innerWidth < 900;
  var heroCfg = { origem: .5, vaso: mob ? .8 : .9, galhos: [
    { a: -92, L: .62, k: -.28, n: 16, ramos: [{ i: .4, a: -132, L: .16 }, { i: .7, a: -62, L: .11 }] },
    { a: -114, L: .5, k: -.35, n: 14, ramos: [{ i: .5, a: -160, L: .14 }] },
    { a: -136, L: .4, k: -.3, n: 13, ramos: [{ i: .55, a: -102, L: .12 }] },
    { a: -158, L: .3, k: -.3, n: 11 },
    { a: -76, L: .44, k: .28, n: 13, ramos: [{ i: .5, a: -32, L: .1 }] },
    { a: -101, L: .36, k: .22, n: 12 },
    { a: -124, L: .27, k: -.1, n: 10 } ] };
  var finalCfg = { origem: .6, vaso: .9, galhos: [
    { a: -90, L: .6, k: -.2, n: 16, ramos: [{ i: .45, a: -135, L: .15 }, { i: .7, a: -50, L: .12 }] },
    { a: -116, L: .48, k: -.3, n: 14, ramos: [{ i: .5, a: -158, L: .13 }] },
    { a: -62, L: .48, k: .3, n: 14, ramos: [{ i: .5, a: -24, L: .12 }] },
    { a: -142, L: .34, k: -.28, n: 11 },
    { a: -38, L: .32, k: .3, n: 11 },
    { a: -100, L: .38, k: .2, n: 12 } ] };
  var euHero = null, euFinal = null;
  if (window.Eucalipto) {
    var ch = document.getElementById('eucaliptoHero'), cf = document.getElementById('eucaliptoFinal');
    if (ch) euHero = new window.Eucalipto(ch, heroCfg);
    if (cf) {
      euFinal = new window.Eucalipto(cf, finalCfg);
      if ('IntersectionObserver' in window) {
        var io0 = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { euFinal.crescer(2200); io0.disconnect(); } }, { threshold: .35 });
        io0.observe(cf);
      } else euFinal.crescer(1);
    }
  }

  /* ---------- ABERTURA (≈3,4 s) ---------- */
  var ab = document.getElementById('abertura');
  var num = document.getElementById('aberturaNum');
  var linha = ab && ab.querySelector('.abertura__linha span');
  var aberto = false, raf;
  function abrir() {
    if (aberto) return; aberto = true;
    cancelAnimationFrame(raf);
    if (num) num.textContent = '100';
    if (linha) linha.style.transform = 'translateX(-50%) scaleX(1)';
    html.classList.add('ab-abre');
    setTimeout(function () { html.classList.add('pronto'); }, 150);
    setTimeout(function () { if (euHero) euHero.crescer(2000); }, 500);
    setTimeout(function () { html.classList.add('ab-fim'); body.classList.remove('carregando'); }, 1150);
  }
  if (!ab || reduz) {
    html.classList.add('ab-fim', 'pronto'); body.classList.remove('carregando');
    if (euHero) euHero.crescer(1);
  } else {
    requestAnimationFrame(function () { html.classList.add('ab-luz'); });
    var ini = performance.now(), DUR = 2350;
    (function conta(ts) {
      var p = Math.min(1, Math.max(0, (ts - ini) / DUR));
      var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      var n = Math.round(e * 100);
      num.textContent = (n < 10 ? '00' : n < 100 ? '0' : '') + n;
      linha.style.transform = 'translateX(-50%) scaleX(' + e + ')';
      if (p < 1) raf = requestAnimationFrame(conta); else setTimeout(abrir, 260);
    })(ini);
    ab.addEventListener('click', abrir);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') abrir(); }, { once: true });
  }

  /* ---------- topo, menu, CTAs fixos ---------- */
  var topo = document.getElementById('topo'), botaoMenu = document.querySelector('.topo__menu'), menu = document.getElementById('menu');
  var fixos = document.querySelectorAll('.wa-fab, .barra-cta');
  function aoRolar() {
    var y = window.scrollY;
    topo.classList.toggle('rolou', y > 30);
    var mostra = y > window.innerHeight * .7;
    fixos.forEach(function (el) { el.classList.toggle('mostra', mostra); });
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  function fecharMenu() { menu.classList.remove('aberto'); topo.classList.remove('menu-aberto'); botaoMenu.setAttribute('aria-expanded', 'false'); }
  botaoMenu.addEventListener('click', function () {
    var abre = botaoMenu.getAttribute('aria-expanded') !== 'true';
    botaoMenu.setAttribute('aria-expanded', String(abre)); menu.classList.toggle('aberto', abre); topo.classList.toggle('menu-aberto', abre);
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', fecharMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('aberto')) { fecharMenu(); botaoMenu.focus(); } });

  if ('IntersectionObserver' in window) {
    var links = {};
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var ioNav = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var a = links[e.target.id]; if (!a || !e.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); }); a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) ioNav.observe(s); });
    if (!reduz) {
      var ioR = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); ioR.unobserve(e.target); } });
      }, { threshold: .15 });
      document.querySelectorAll('.rv').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 0.06 + 's'; ioR.observe(el); });
    } else document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('visto'); });
  } else document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('visto'); });

  aoRolar();
})();
