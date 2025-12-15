const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function setAll(open){
  $$('.rec-details').forEach(d => d.open = open);
}

$('#expandAll').addEventListener('click', () => setAll(true));
$('#collapseAll').addEventListener('click', () => setAll(false));
$('#printBtn').addEventListener('click', () => window.print());

// Toggle quote tabs
$$('.rec').forEach(rec => {
  const tabs = $$('.tab', rec);
  const panes = $$('.quote-card', rec);
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      panes.forEach(p => p.classList.toggle('hidden', p.dataset.pane !== target));
    });
  });

  // Copy visible quote
  const copyBtn = $('.copy-quote', rec);
  if(copyBtn){
    copyBtn.addEventListener('click', async () => {
      const visible = panes.find(p => !p.classList.contains('hidden'));
      const txt = visible ? visible.innerText.trim() : '';
      if(!txt) return;
      await navigator.clipboard.writeText(txt);
      copyBtn.textContent = 'Copied!';
      setTimeout(()=>copyBtn.textContent='Copy visible quote', 1200);
    });
  }

  // Copy link
  const linkBtn = $('.copy-link', rec);
  if(linkBtn){
    linkBtn.addEventListener('click', async () => {
      const url = window.location.href.split('#')[0] + '#' + rec.closest('section').id;
      await navigator.clipboard.writeText(url);
      linkBtn.textContent = 'Link copied!';
      setTimeout(()=>linkBtn.textContent='Copy link', 1200);
    });
  }
});

// Axis toggle
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

// Search filter (matches within rec data-search)
$('#searchInput').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  $$('.rec').forEach(r => {
    const hay = r.dataset.search || '';
    r.style.display = (!q || hay.includes(q)) ? '' : 'none';
  });
});