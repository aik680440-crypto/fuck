const appEl = document.getElementById("app");
const navLinks = { emi: document.getElementById("nav-emi"), todo: document.getElementById("nav-todo"), image: document.getElementById("nav-image"), password: document.getElementById("nav-password") };

// Theme
const themeToggle = document.getElementById("theme-toggle");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");
if (savedTheme){ document.documentElement.dataset.theme = savedTheme; } else { document.documentElement.dataset.theme = prefersDark ? "dark" : "light"; }

themeToggle.addEventListener('click',()=>{ const t=document.documentElement.dataset.theme==='dark'?'light':'dark'; document.documentElement.dataset.theme=t; localStorage.setItem('theme',t); });

window.addEventListener('load',()=>{ const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear(); });

// Routing
const routes = {
  '#/emi': () => import('./modules/emi.js'),
  '#/todo': () => import('./modules/todo.js'),
  '#/image': () => import('./modules/image.js'),
  '#/password': () => import('./modules/password.js'),
  '': () => import('./modules/landing.js')
};

function setActiveNav(hash){ Object.values(navLinks).forEach(a=>a&&a.removeAttribute('aria-current'));
  if(hash.startsWith('#/emi')&&navLinks.emi) navLinks.emi.setAttribute('aria-current','page');
  else if(hash.startsWith('#/todo')&&navLinks.todo) navLinks.todo.setAttribute('aria-current','page');
  else if(hash.startsWith('#/image')&&navLinks.image) navLinks.image.setAttribute('aria-current','page');
  else if(hash.startsWith('#/password')&&navLinks.password) navLinks.password.setAttribute('aria-current','page');
}

async function router(){ const hash = location.hash || '#/emi'; setActiveNav(hash); const loader = routes[hash] || routes['']; try{ const mod = await loader(); appEl.innerHTML=''; appEl.appendChild(await mod.render()); appEl.focus(); }catch(err){ appEl.innerHTML = `<div class="card"><h2>Error</h2><p class="muted">${err?.message||'Failed to load'}</p></div>`; } }

window.addEventListener('hashchange', router);
router();
console.log( scaffold)
