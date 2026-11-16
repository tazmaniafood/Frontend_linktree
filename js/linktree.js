/* Pa'l Filo · Enlaces
   ENLACES: pon aquí la dirección de cada canal. Si queda vacía, el botón sale apagado
   con "Muy pronto" (así no se manda a nadie a una página que no existe). */
const ENLACES = {
  doordash: '',   // p. ej. 'https://www.doordash.com/store/...'
  ubereats: '',   // p. ej. 'https://www.ubereats.com/store/...'
  tiktok: '',     // p. ej. 'https://www.tiktok.com/@palfilo'
};
const HORARIO = { dias: [3, 4, 5, 6, 0], abre: 18, cierra: 23, zona: 'America/Los_Angeles' };

(() => {
  const en = document.documentElement.lang === 'en';
  const $ = s => document.querySelector(s);
  document.getElementById('anio').textContent = new Date().getFullYear();

  /* ---- Canales sin dirección todavía: apagados ---- */
  Object.entries(ENLACES).forEach(([k, url]) => {
    document.querySelectorAll(`[data-enlace="${k}"]`).forEach(a => {
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; return; }
      a.classList.add('apagado'); a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true');
      const nota = a.querySelector('[data-nota]');
      if (nota) nota.textContent = en ? 'Coming soon' : 'Muy pronto';
      else a.insertAdjacentHTML('beforeend', `<em class="pronto">${en ? 'Soon' : 'Pronto'}</em>`);
    });
  });

  /* ---- Abierto o cerrado, con la hora de San José ---- */
  const p = new Intl.DateTimeFormat('en-US', { timeZone: HORARIO.zona, weekday: 'short', hour: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.find(x => x.type === 'weekday').value);
  const hora = +p.find(x => x.type === 'hour').value % 24;
  const abierto = HORARIO.dias.includes(dia) && hora >= HORARIO.abre && hora < HORARIO.cierra;
  document.documentElement.dataset.abierto = abierto ? 'si' : 'no';
  let texto;
  if (abierto) texto = en ? 'Open until 11 pm' : 'Abierto hasta las 11 pm';
  else if (HORARIO.dias.includes(dia) && hora < HORARIO.abre) texto = en ? 'Closed · opens today 6 pm' : 'Cerrado · abrimos hoy 6 pm';
  else {
    const nom = en ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    for (let i = 1; i <= 7; i++) { const d = (dia + i) % 7; if (HORARIO.dias.includes(d)) { texto = (en ? 'Closed · opens ' : 'Cerrado · abrimos ') + (i === 1 ? (en ? 'tomorrow' : 'mañana') : nom[d]) + ' 6 pm'; break; } }
  }
  $('[data-estado]').textContent = texto;
  const letras = en ? 'SMTWTFS' : 'DLMMJVS';
  $('.estado__dias').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<span class="${HORARIO.dias.includes(d) ? 'abre' : ''}${d === dia ? ' hoy' : ''}">${letras[d]}</span>`).join('');
  const est = $('.estado');
  est.addEventListener('click', () => est.setAttribute('aria-expanded', est.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'));

  /* ---- Compartir ---- */
  const aviso = msg => { const t = $('#aviso'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 1800); };
  $('[data-compartir]').addEventListener('click', async () => {
    const data = { title: "Pa'l Filo", text: 'Colombian Caribbean street food · San José', url: location.href.split('?')[0] };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(data.url); aviso(en ? 'Link copied' : 'Enlace copiado');
    } catch (_) {}
  });
})();
