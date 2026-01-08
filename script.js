// Hamburger
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (!menu || !icon) return;
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Theme toggle
const THEME_KEY = "theme-preference";
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll(".theme-toggle").forEach(btn=>{
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  });
}
function getPreferredTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function initTheme(){ applyTheme(getPreferredTheme()); }
function toggleTheme(){
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// Reveal
function setupReveal(){
  const targets = document.querySelectorAll("[data-reveal], .xt__item, .details-container, .color-container");
  if (!targets.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add("in"); obs.unobserve(e.target); }
    });
  },{threshold:0.18, rootMargin:"0px 0px -10% 0px"});
  targets.forEach(t=>obs.observe(t));
}

// 3D Tilt
function setupTilt(){
  const cards = document.querySelectorAll("#projects .details-container.color-container");
  cards.forEach(card=>{
    card.classList.add("tilt");
    const img = card.querySelector(".project-img");
    if (img && !img.classList.contains("tilt__inner")) img.classList.add("tilt__inner");

    function moveLikeMouse(x,y){
      const r = card.getBoundingClientRect();
      const nx = (x - r.left) / r.width;
      const ny = (y - r.top) / r.height;
      const rx = (0.5 - ny) * 12;
      const ry = (nx - 0.5) * 12;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    card.addEventListener("mousemove", e=>moveLikeMouse(e.clientX, e.clientY));
    card.addEventListener("mouseleave", ()=> card.style.transform = "perspective(900px) rotateX(0) rotateY(0)");
    card.addEventListener("touchmove", e=>{
      if(!e.touches.length) return;
      const t = e.touches[0];
      moveLikeMouse(t.clientX, t.clientY);
    }, {passive:true});
    card.addEventListener("touchend", ()=> card.style.transform = "perspective(900px) rotateX(0) rotateY(0)");
  });
}

// Init
document.addEventListener("DOMContentLoaded", ()=>{
  initTheme();
  document.querySelectorAll(".theme-toggle").forEach(b=>b.addEventListener("click", toggleTheme));
  setupReveal();
  setupTilt();
});
