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
  setTimeout(close, 18000);

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

  const status = form.querySelector('.form-status');
  const btn = form.querySelector('button[type="submit"]');
  if (!status || !btn) return;

  const isEnglish = document.documentElement.lang.startsWith('en');
  const messages = isEnglish
    ? {
        sending: 'Sending...',
        success: 'Thank you, your message has been sent.',
        error: 'Unable to send your message. Please try again later.'
      }
    : {
        sending: 'Envoi en cours...',
        success: 'Merci, votre message a bien été envoyé.',
        error: 'Impossible d\'envoyer votre message. Réessayez plus tard.'
      };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = messages.sending;
    btn.disabled = true;

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || messages.error);
      }

      status.textContent = messages.success;
      form.reset();
    } catch (error) {
      status.textContent = messages.error;
    } finally {
      btn.disabled = false;
    }
  });
})();
// ==== Zoom images (lightbox) ====
(function () {
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('imgModalImg');
  const modalClose = document.getElementById('imgModalClose');
  const zoomableImages = document.querySelectorAll('.zoomable img');

  if (!modal || !modalImg || !modalClose || zoomableImages.length === 0) return;

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  zoomableImages.forEach((img) => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
// Gestion du switch FR/EN
document.addEventListener("DOMContentLoaded", () => {
  const langSwitch = document.querySelector(".lang-switch");
  if (!langSwitch) return;

  langSwitch.addEventListener("click", (e) => {
    e.preventDefault();
    const currentPath = window.location.pathname;

    if (currentPath.startsWith("/en/")) {
      // Si on est côté EN → aller côté FR (en enlevant "/en")
      const target = currentPath.replace("/en", "");
      window.location.href = target || "/";
    } else {
      // Si on est côté FR → aller côté EN (en ajoutant "/en")
      const target = "/en" + currentPath;
      window.location.href = target;
    }
  });
});

