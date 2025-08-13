document.addEventListener('DOMContentLoaded',()=>{
  const y=document.getElementById('y'); if(y) y.textContent=new Date().getFullYear();
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} });
  },{threshold:0.15});
  reveals.forEach(el=>io.observe(el));
});
