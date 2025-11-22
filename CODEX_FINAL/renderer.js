document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('launcher-btn');
  const panel = document.getElementById('launcher-panel');
  const list = document.getElementById('apps-list');
  const close = document.getElementById('launcher-close');

  const refresh = async () => {
    const apps = await window.electronAPI.listApps();
    list.innerHTML = apps.map(a => `<button class="app-card" role="listitem" data-id="${a.id||a.dir}"><strong>${a.name||a.id||a.dir}</strong></button>`).join('');
    list.querySelectorAll('.app-card').forEach(c => c.onclick = () => window.electronAPI.openApp(c.dataset.id));
  };

  btn.addEventListener('click', async () => {
    panel.classList.toggle('hidden');
    panel.setAttribute('aria-hidden', panel.classList.contains('hidden') ? 'true' : 'false');
    if (!panel.classList.contains('hidden')) await refresh();
  });

  close.addEventListener('click', () => { panel.classList.add('hidden'); panel.setAttribute('aria-hidden','true'); });
});
