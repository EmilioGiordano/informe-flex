// Índice lateral derecho ("en esta página") generado de los encabezados de la página.
// Construye el riel, lo inserta a la derecha del contenido y resalta la sección activa al hacer scroll.
(function () {
  const main = document.querySelector('main');
  if (!main) return;

  const heads = Array.from(main.querySelectorAll('h2, h3'));
  if (heads.length < 2) return;

  const slug = (t) => t.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const cleanText = (h) => {
    const c = h.cloneNode(true);
    c.querySelectorAll('.badge').forEach(b => b.remove());
    return c.textContent.replace(/\s+/g, ' ').trim();
  };

  heads.forEach(h => { if (!h.id) h.id = slug(cleanText(h)) || ('sec-' + heads.indexOf(h)); });

  const layout = document.createElement('div');
  layout.className = 'layout';
  main.parentNode.insertBefore(layout, main);
  layout.appendChild(main);

  const aside = document.createElement('aside');
  aside.className = 'rail';
  const tit = document.createElement('div');
  tit.className = 'rail-tit';
  tit.textContent = 'En esta página';
  aside.appendChild(tit);

  const ul = document.createElement('ul');
  const linkById = {};
  heads.forEach(h => {
    const li = document.createElement('li');
    li.className = (h.tagName === 'H3') ? 'lvl3' : 'lvl2';
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = cleanText(h);
    a.title = a.textContent;
    li.appendChild(a);
    ul.appendChild(li);
    linkById[h.id] = a;
  });
  aside.appendChild(ul);
  layout.appendChild(aside);

  let activeId = null;
  const setActive = (id) => {
    if (id === activeId) return;
    if (activeId && linkById[activeId]) linkById[activeId].classList.remove('active');
    activeId = id;
    if (linkById[id]) {
      linkById[id].classList.add('active');
      linkById[id].scrollIntoView({ block: 'nearest' });
    }
  };

  const observer = new IntersectionObserver((entries) => {
    const visibles = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visibles.length) setActive(visibles[0].target.id);
  }, { rootMargin: '-66px 0px -68% 0px', threshold: 0 });

  heads.forEach(h => observer.observe(h));

  heads.forEach(h => {
    if (linkById[h.id]) linkById[h.id].addEventListener('click', () => setActive(h.id));
  });
})();
