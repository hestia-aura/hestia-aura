document.addEventListener('DOMContentLoaded',()=>{
  const y=document.getElementById('y'); if(y) y.textContent=new Date().getFullYear();
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} });
  },{threshold:0.15});
  reveals.forEach(el=>io.observe(el));
});
// Intro overlay
(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;

  // Ne l'affiche qu'une fois par session
  if (sessionStorage.getItem('introSeen') === '1') {
    intro.classList.add('hide'); return;
  }

  const video = document.getElementById('introVideo');
  const skip  = document.getElementById('introSkip');
  const close = () => {
    intro.classList.add('hide');
    sessionStorage.setItem('introSeen', '1');
    const main = document.querySelector('main'); if (main) { main.setAttribute('tabindex','-1'); main.focus(); }
  };

  skip.addEventListener('click', close);
  if (video) video.addEventListener('ended', close);
  // Sécurité : ferme au bout de 12 s même si la vidéo loop
  setTimeout(close, 12000);
})();
