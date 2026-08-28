/* ==========================================================================
   Pelada Carioca — comportamento da página
   1. Cabeçalho que muda ao rolar
   2. Menu mobile
   3. Carrossel (dots, setas, teclado, autoplay)
   4. Link ativo conforme a seção visível
   5. Revelar elementos ao rolar
   6. Lightbox da galeria
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Cabeçalho ---------- */
  const cabecalho = document.getElementById('cabecalho');

  const atualizarCabecalho = () => {
    cabecalho.classList.toggle('solido', window.scrollY > 60);
  };
  atualizarCabecalho();
  window.addEventListener('scroll', atualizarCabecalho, { passive: true });

  /* ---------- 2. Menu mobile ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  const fecharMenu = () => {
    nav.classList.remove('aberto');
    menuBtn.classList.remove('aberto');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', () => {
    const aberto = nav.classList.toggle('aberto');
    menuBtn.classList.toggle('aberto', aberto);
    menuBtn.setAttribute('aria-expanded', String(aberto));
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', fecharMenu));

  /* ---------- 3. Carrossel ---------- */
  const slides = [...document.querySelectorAll('.slide')];
  const dotsBox = document.getElementById('sliderDots');
  let atual = 0;
  let timer = null;

  if (slides.length && dotsBox) {

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'dot' + (i === 0 ? ' ativo' : '');
      b.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
      b.addEventListener('click', () => { irPara(i); reiniciarAutoplay(); });
      dotsBox.appendChild(b);
    });

    const dots = [...dotsBox.children];

    function irPara(i) {
      atual = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('ativo', k === atual));
      dots.forEach((d, k) => d.classList.toggle('ativo', k === atual));
    }

    const proximo = () => irPara(atual + 1);
    const anterior = () => irPara(atual - 1);

    document.getElementById('slideNext')
      ?.addEventListener('click', () => { proximo(); reiniciarAutoplay(); });
    document.getElementById('slidePrev')
      ?.addEventListener('click', () => { anterior(); reiniciarAutoplay(); });

    document.addEventListener('keydown', e => {
      if (document.getElementById('lightbox').classList.contains('aberto')) return;
      if (e.key === 'ArrowRight') { proximo(); reiniciarAutoplay(); }
      if (e.key === 'ArrowLeft')  { anterior(); reiniciarAutoplay(); }
    });

    function reiniciarAutoplay() {
      clearInterval(timer);
      timer = setInterval(proximo, 7000);
    }

    const palco = document.querySelector('.slider__palco');
    palco.addEventListener('mouseenter', () => clearInterval(timer));
    palco.addEventListener('mouseleave', reiniciarAutoplay);

    reiniciarAutoplay();
  }

  /* ---------- 4. Link ativo por seção ---------- */
  const secoes = [...document.querySelectorAll('section[id]')];
  const links = [...document.querySelectorAll('.nav__link')];

  const observadorSecao = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      links.forEach(l => l.classList.toggle('ativo', l.getAttribute('href') === `#${id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  secoes.forEach(s => observadorSecao.observe(s));

  /* ---------- 5. Revelar ao rolar ---------- */
  const observadorRevelar = new IntersectionObserver((entradas, obs) => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visivel');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.revelar').forEach(el => observadorRevelar.observe(el));

  /* ---------- 6. Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  const abrirLightbox = src => {
    lightboxImg.src = src;
    lightbox.classList.add('aberto');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const fecharLightbox = () => {
    lightbox.classList.remove('aberto');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.galeria__item img').forEach(img => {
    img.addEventListener('click', () => abrirLightbox(img.src));
  });

  document.getElementById('lightboxFechar').addEventListener('click', fecharLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) fecharLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharLightbox(); });

});
