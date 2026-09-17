const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const setMenuState = (open) => {
  nav?.classList.toggle('open', open);
  menuButton?.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
};
menuButton?.addEventListener('click', () => setMenuState(!nav?.classList.contains('open')));
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => setMenuState(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav?.classList.contains('open')) setMenuState(false); });
window.addEventListener('resize', () => { if (window.innerWidth > 850 && nav?.classList.contains('open')) setMenuState(false); });

const filterButtons = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.equipment-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  const value = button.dataset.filter;
  cards.forEach(card => {
    const categories = (card.dataset.category || '').split(' ');
    card.hidden = value !== 'all' && !categories.includes(value);
  });
}));

const revealTargets = document.querySelectorAll('.equipment-card, .work, .manifesto, .contact-block, .info-card, .detail-card, .process-card, .category-tile, .location-card, .video-project, .video-lead, .home-video-teaser');
revealTargets.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
  }), { threshold: 0.1 });
  revealTargets.forEach(el => observer.observe(el));
} else revealTargets.forEach(el => el.classList.add('is-visible'));

const enquiryForm = document.querySelector('#enquiry-form');
enquiryForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(enquiryForm);
  const subject = `Consulta K Grip — ${data.get('material') || 'material / producción'}`;
  const body = [
    `Nombre / producción: ${data.get('nombre') || ''}`,
    `Email / teléfono: ${data.get('contacto') || ''}`,
    `Material: ${data.get('material') || ''}`,
    `Fechas: ${data.get('fechas') || ''}`,
    '',
    data.get('mensaje') || ''
  ].join('\n');
  window.location.href = `mailto:adp@kgrip.es?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const params = new URLSearchParams(window.location.search);
const requestedMaterial = params.get('material');
if (requestedMaterial) {
  const select = document.querySelector('#material-select');
  if (select) {
    const exact = [...select.options].find(o => o.value.toLowerCase() === requestedMaterial.toLowerCase());
    if (exact) exact.selected = true;
    else {
      const fallback = [...select.options].find(o => o.value === 'Varios / por definir');
      if (fallback) fallback.selected = true;
      const message = document.querySelector('#mensaje');
      if (message && !message.value) message.value = `Material de interés: ${requestedMaterial}\n`;
    }
  }
}

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a').forEach(a => {
  const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
  if (href === currentPage) a.classList.add('active');
});


// Video portfolio modal
const videoModal = document.querySelector('#video-modal');
const videoFrame = document.querySelector('#video-frame');
const getEmbedUrl = (provider, id) => {
  if (provider === 'vimeo') return `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
};
const openVideo = (provider, id) => {
  if (!videoModal || !videoFrame || !id) return;
  const iframe = document.createElement('iframe');
  iframe.src = getEmbedUrl(provider, id);
  iframe.title = 'Vídeo K Grip';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  videoFrame.replaceChildren(iframe);
  videoModal.classList.add('is-open');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('video-modal-open');
  videoModal.querySelector('.video-modal-close')?.focus();
};
const closeVideo = () => {
  if (!videoModal || !videoFrame) return;
  videoModal.classList.remove('is-open');
  videoModal.setAttribute('aria-hidden', 'true');
  videoFrame.replaceChildren();
  document.body.classList.remove('video-modal-open');
};
document.querySelectorAll('[data-video-provider][data-video-id]').forEach(trigger => {
  trigger.addEventListener('click', () => openVideo(trigger.dataset.videoProvider, trigger.dataset.videoId));
});
document.querySelectorAll('[data-video-close]').forEach(trigger => trigger.addEventListener('click', closeVideo));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && videoModal?.classList.contains('is-open')) closeVideo(); });

// Rotating photos in home category cards
document.querySelectorAll('[data-rotator]').forEach(box => {
  const imgs = box.querySelectorAll('img');
  if (imgs.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let i = 0;
  setInterval(() => {
    imgs[i].classList.remove('is-active');
    i = (i + 1) % imgs.length;
    imgs[i].classList.add('is-active');
  }, 3000);
});
