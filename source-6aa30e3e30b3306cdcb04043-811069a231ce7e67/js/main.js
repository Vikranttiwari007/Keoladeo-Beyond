// ---------- helpers ----------
async function loadJSON(path){
  const res = await fetch(path, { cache: 'no-store' });
  if(!res.ok) throw new Error('Failed to load ' + path);
  return res.json();
}

function rootPath(){
  // works whether page lives at / or /admin/ etc — pages in this site are all at root
  return '';
}

// ---------- nav ----------
function initNav(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }
}

// ---------- hero slider ----------
async function initHero(){
  const heroEl = document.querySelector('[data-hero]');
  if(!heroEl) return;
  try{
    const photos = (await loadJSON('data/photos.json')).photos;
    const featured = photos.filter(p => p.featured).slice(0, 5);
    const slides = featured.length ? featured : photos.slice(0, 5);
    if(!slides.length) return;

    const media = heroEl.querySelector('.hero-media');
    const dotsWrap = heroEl.querySelector('.hero-dots');
    let current = 0;

    function setSlide(i){
      current = i;
      media.style.backgroundImage = `url('${slides[i].image}')`;
      dotsWrap.querySelectorAll('button').forEach((b, idx) => b.classList.toggle('active', idx === i));
    }

    slides.forEach((s, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Show slide ' + (i + 1));
      b.addEventListener('click', () => setSlide(i));
      dotsWrap.appendChild(b);
    });

    setSlide(0);
    if(slides.length > 1){
      setInterval(() => setSlide((current + 1) % slides.length), 6000);
    }
  }catch(e){ console.error(e); }
}

// ---------- lightbox ----------
let LB_PHOTOS = [];
let LB_INDEX = 0;

function buildLightbox(){
  if(document.querySelector('.lightbox')) return;
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M1 1l14 14M15 1L1 15" stroke="currentColor" stroke-width="1.4"/></svg></button>
    <button class="lightbox-nav prev" aria-label="Previous photo"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 1L3 8l7 7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button>
    <button class="lightbox-nav next" aria-label="Next photo"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 1l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button>
    <div class="lightbox-inner">
      <img src="" alt="">
      <div class="lightbox-meta">
        <div class="ti"></div>
        <div class="sp"></div>
        <div class="st"></div>
        <div class="lo"></div>
        <div class="cr"></div>
      </div>
    </div>`;
  document.body.appendChild(lb);

  lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if(e.target === lb) closeLightbox(); });
  lb.querySelector('.prev').addEventListener('click', () => showLightbox(LB_INDEX - 1));
  lb.querySelector('.next').addEventListener('click', () => showLightbox(LB_INDEX + 1));
  document.addEventListener('keydown', (e) => {
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') showLightbox(LB_INDEX - 1);
    if(e.key === 'ArrowRight') showLightbox(LB_INDEX + 1);
  });
}

function showLightbox(i){
  const lb = document.querySelector('.lightbox');
  LB_INDEX = (i + LB_PHOTOS.length) % LB_PHOTOS.length;
  const p = LB_PHOTOS[LB_INDEX];
  lb.querySelector('img').src = p.image;
  lb.querySelector('img').alt = p.title + ' — ' + p.species;
  lb.querySelector('.ti').textContent = p.title;
  lb.querySelector('.sp').textContent = p.species;
  lb.querySelector('.st').textContent = p.story || '';
  lb.querySelector('.lo').textContent = p.location || '';
  lb.querySelector('.cr').textContent = p.credit ? 'Photo: ' + p.credit : '';
  lb.classList.add('open');
}

function closeLightbox(){
  document.querySelector('.lightbox')?.classList.remove('open');
}

function openLightboxFor(photos, id){
  buildLightbox();
  LB_PHOTOS = photos;
  const i = photos.findIndex(p => p.id === id);
  showLightbox(i < 0 ? 0 : i);
}

// ---------- card markup ----------
function cardHTML(p){
  return `
    <div class="card" data-id="${p.id}" data-category="${p.category}" tabindex="0" role="button" aria-label="View ${p.title}">
      <img class="ph" src="${p.thumb || p.image}" alt="${p.species} — ${p.title}" loading="lazy">
      <div class="card-info">
        <div class="sp">${p.species}</div>
        <div class="lo">${p.title}${p.location ? ' · ' + p.location : ''}</div>
      </div>
    </div>`;
}

function wireCards(container, photos){
  container.querySelectorAll('.card').forEach(card => {
    const open = () => openLightboxFor(photos, card.dataset.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); } });
  });
}

// ---------- featured grid (home page) ----------
async function initFeaturedGrid(){
  const grid = document.querySelector('[data-featured-grid]');
  if(!grid) return;
  try{
    const photos = (await loadJSON('data/photos.json')).photos;
    const featured = photos.filter(p => p.featured).slice(0, 6);
    grid.innerHTML = featured.map(cardHTML).join('');
    wireCards(grid, featured);
  }catch(e){ console.error(e); }
}

// ---------- full gallery (gallery page) ----------
async function initGallery(){
  const grid = document.querySelector('[data-gallery-grid]');
  if(!grid) return;
  try{
    const photos = (await loadJSON('data/photos.json')).photos;
    const toolbar = document.querySelector('[data-gallery-filters]');
    const empty = document.querySelector('[data-gallery-empty]');
    const categories = ['all', ...new Set(photos.map(p => p.category))];
    const labels = { all: 'All work', birds: 'Birds', reptiles: 'Reptiles', mammals: 'Mammals', landscapes: 'Landscapes' };

    function render(filter){
      const list = filter === 'all' ? photos : photos.filter(p => p.category === filter);
      grid.innerHTML = list.map(cardHTML).join('');
      wireCards(grid, list);
      if(empty) empty.style.display = list.length ? 'none' : 'block';
    }

    if(toolbar){
      toolbar.innerHTML = categories.map((c, i) =>
        `<button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${c}">${labels[c] || c}</button>`
      ).join('');
      toolbar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          toolbar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          render(btn.dataset.filter);
        });
      });
    }
    render('all');
  }catch(e){ console.error(e); }
}

// ---------- settings-driven text (about/contact/footer) ----------
async function initSettings(){
  const nodes = document.querySelectorAll('[data-setting]');
  if(!nodes.length) return;
  try{
    const settings = await loadJSON('data/settings.json');
    nodes.forEach(node => {
      const key = node.dataset.setting;
      const val = settings[key];
      if(val == null) return;
      if(node.tagName === 'IMG'){ node.src = val; }
      else if(node.dataset.settingHtml !== undefined){
        node.innerHTML = String(val).split('\n\n').map(p => `<p>${p}</p>`).join('');
      } else {
        node.textContent = val;
      }
    });
    document.querySelectorAll('[data-setting-href]').forEach(node => {
      const key = node.dataset.settingHref;
      if(settings[key]) node.href = key === 'email' ? `mailto:${settings[key]}` : settings[key];
    });
  }catch(e){ console.error(e); }
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHero();
  initFeaturedGrid();
  initGallery();
  initSettings();
});
