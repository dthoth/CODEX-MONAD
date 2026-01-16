
const q = document.getElementById('q');
const tiles = () => [...document.querySelectorAll('[data-item]')];
const chips = () => [...document.querySelectorAll('[data-chip]')];
function apply(){
  const s = (q?.value||'').toLowerCase();
  const active = chips().filter(c=>c.classList.contains('on')).map(c=>c.dataset.chip);
  tiles().forEach(t=>{
    const text = (t.dataset.text||'').toLowerCase();
    const kind = t.dataset.kind;
    const hitQ = !s || text.includes(s);
    const hitK = !active.length || active.includes(kind);
    t.classList.toggle('hidden', !(hitQ && hitK));
  });
}
q?.addEventListener('input', apply);
chips().forEach(c=>c.addEventListener('click',()=>{c.classList.toggle('on');apply();}));
apply();
