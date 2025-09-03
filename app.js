document.addEventListener('DOMContentLoaded',()=>{
  const y=document.getElementById('y'); if(y) y.textContent=new Date().getFullYear();
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} });
  },{threshold:0.15});
  reveals.forEach(el=>io.observe(el));
});
// Intro overlay (avec scroll / swipe / clavier)
(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;

  // ====== CONFIG ======
  // 'always'  : rejouer à chaque chargement
  // 'session' : une fois par onglet (actuel)
  // 'ttl'     : une fois toutes les X ms (INT.TTL ci-dessous)
  const SHOW_MODE = 'session';            // <- change ici si besoin
  const INTRO_TTL_MS = 6 * 60 * 60 * 1000; // 6h si SHOW_MODE === 'ttl'
  // ====================

  const seenSession = () => sessionStorage.getItem('introSeen') === '1';
  const seenTTL = () => {
    const last = +localStorage.getItem('introTs') || 0;
    return Date.now() - last < INTRO_TTL_MS;
  };
  const shouldHide =
    SHOW_MODE === 'always' ? false :
    SHOW_MODE === 'session' ? seenSession() :
    SHOW_MODE === 'ttl' ? seenTTL() : false;

  if (shouldHide) { intro.classList.add('hide'); return; }

  const video = document.getElementById('introVideo');
  const skip  = document.getElementById('introSkip');

  const markSeen = () => {
    if (SHOW_MODE === 'session') sessionStorage.setItem('introSeen', '1');
    if (SHOW_MODE === 'ttl') localStorage.setItem('introTs', String(Date.now()));
  };

  const cleanup = () => {
    window.removeEventListener('wheel', onWheel, wheelOpts);
    window.removeEventListener('touchstart', onTouchStart, touchStartOpts);
    window.removeEventListener('touchmove', onTouchMove, touchMoveOpts);
    window.removeEventListener('keydown', onKey);
  };

  const close = () => {
    intro.classList.add('hide');
    markSeen();
    cleanup();
    const main = document.querySelector('main');
    if (main) { main.setAttribute('tabindex','-1'); main.focus(); }
  };

  // Clic bouton / fin vidéo / timeout garde-fou
  if (skip)  skip.addEventListener('click', close);
  if (video) video.addEventListener('ended', close);
  setTimeout(close, 12000);

  // Molette (PC)
  const wheelOpts = { passive: false };
  const onWheel = (e) => {
    if (intro.classList.contains('hide')) return;
    e.preventDefault(); close();
  };
  window.addEventListener('wheel', onWheel, wheelOpts);

  // Swipe (mobile)
  let startY = null;
  const touchStartOpts = { passive: true };
  const touchMoveOpts  = { passive: false };

  const onTouchStart = (e) => { startY = e.touches[0].clientY; };
  const onTouchMove  = (e) => {
    if (intro.classList.contains('hide')) return;
    if (startY == null) return;
    const dy = e.touches[0].clientY - startY;
    if (Math.abs(dy) > 20) { e.preventDefault(); close(); }
  };
  window.addEventListener('touchstart', onTouchStart, touchStartOpts);
  window.addEventListener('touchmove',  onTouchMove,  touchMoveOpts);

  // Clavier (Enter / Space / ArrowDown / Esc)
  const onKey = (e) => {
    if (['Enter',' ','ArrowDown','Escape'].includes(e.key)) close();
  };
  window.addEventListener('keydown', onKey);
})();
// Contact form (Web3Forms)
(function () {
const form = document.getElementById('contactForm') 
          || document.querySelector('form.contact-form');
  if (!form) return;

  // Si jamais l'action manque, évite l'alerte d'origine
  form.removeAttribute('data-needs-setup');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    const btn = form.querySelector('button[type="submit"]');
    status.textContent = 'Envoi…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: new FormData(form)
      });
      const data = await res.json();
      if (data.success) {
        status.textContent = 'Merci, votre message a bien été envoyé ✔';
        form.reset();
      } else {
        status.textContent = 'Erreur : ' + (data.message || 'envoi impossible.');
      }
    } catch (err) {
      status.textContent = 'Erreur réseau. Réessayez plus tard.';
    } finally {
      btn.disabled = false;
      setTimeout(() => (status.textContent = ''), 5000);
    }
  });
})();
// ==== Zoom images (lightbox) ====
(function(){
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('imgModalImg');
  const modalClose = document.getElementById('imgModalClose');

  document.querySelectorAll('.zoomable img').forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  });

  modal.addEventListener('click', e => {
    if(e.target === modal){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
    }
  });
})();

