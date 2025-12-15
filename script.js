const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function setAll(open){ $$('.rec-details').forEach(d => d.open = open); }
$('#expandAll')?.addEventListener('click', () => setAll(true));
$('#collapseAll')?.addEventListener('click', () => setAll(false));
$('#printBtn')?.addEventListener('click', () => window.print());

$('#modeVisual')?.addEventListener('click', () => {
  document.body.classList.remove('focus');
  $('#modeVisual').setAttribute('aria-pressed','true');
  $('#modeFocus').setAttribute('aria-pressed','false');
});
$('#modeFocus')?.addEventListener('click', () => {
  document.body.classList.add('focus');
  $('#modeVisual').setAttribute('aria-pressed','false');
  $('#modeFocus').setAttribute('aria-pressed','true');
});

$$('.rec').forEach(rec => {
  const tabs = $$('.tab', rec);
  const panes = $$('.quote-card', rec);

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    panes.forEach(p => p.classList.toggle('hidden', p.dataset.pane !== target));
  }));

  $('.copy-quote', rec)?.addEventListener('click', async (e) => {
    const visible = panes.find(p => !p.classList.contains('hidden'));
    const txt = visible ? visible.innerText.trim() : '';
    if(!txt) return;
    await navigator.clipboard.writeText(txt);
    e.target.textContent = 'Copied';
    setTimeout(()=>e.target.textContent='Copy quote', 900);
  });

  $('.copy-link', rec)?.addEventListener('click', async (e) => {
    const axis = rec.closest('section')?.id || '';
    const url = window.location.href.split('#')[0] + '#' + axis;
    await navigator.clipboard.writeText(url);
    e.target.textContent = 'Copied';
    setTimeout(()=>e.target.textContent='Copy axis link', 900);
  });
});

$$('.toggle-axis').forEach(btn => {
  btn.addEventListener('click', () => {
    const axisId = btn.dataset.axis;
    const axis = document.getElementById(axisId);
    if(!axis) return;
    const details = $$('.rec-details', axis);
    const anyClosed = details.some(d => !d.open);
    details.forEach(d => d.open = anyClosed);
  });
});

$('#search')?.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  $$('.rec').forEach(r => {
    const hay = (r.dataset.search || '');
    r.style.display = (!q || hay.includes(q)) ? '' : 'none';
  });
});