import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const $ = (s) => document.querySelector(s);
let S = {}, scripts = [], cat = 'Semua';
const getKey = () => { try { const k = JSON.parse(localStorage.getItem('bs_key')); return k && k.exp > Date.now() ? k : null; } catch { return null; } };
const toast = (m) => { const t = $('#toast'); t.textContent = m; t.style.display = 'block'; setTimeout(() => t.style.display = 'none', 2200); };
const el = (tag, props = {}, ...kids) => { const e = Object.assign(document.createElement(tag), props); kids.forEach(k => e.append(k)); return e; };
const fmt = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return [s / 3600 | 0, (s % 3600) / 60 | 0, s % 60].map(n => String(n).padStart(2, '0')).join(':'); };

function renderKey() {
  const b = $('#keybox'), k = getKey(); b.replaceChildren();
  if (!k) { b.append(el('span', { textContent: 'Belum ada key' }), el('button', { className: 'btn', textContent: 'Get Key', onclick: openModal })); return; }
  b.append(el('code', { textContent: k.key }),
    el('button', { className: 'btn sec', textContent: 'Salin', onclick: () => { navigator.clipboard.writeText(k.key); toast('Key disalin'); } }),
    el('span', { id: 'left', textContent: 'Valid ' + fmt(k.exp - Date.now()) }));
}
setInterval(() => { const k = getKey(), l = $('#left'); if (!k) renderKey(); else if (l) l.textContent = 'Valid ' + fmt(k.exp - Date.now()); }, 1000);

function openModal() {
  [1, 2].forEach(n => {
    const b = $('#s' + n), on = !!S['server' + n + 'Active'];
    b.replaceChildren(el('span', { textContent: 'Server ' + n }), el('b', { className: on ? 'on-t' : 'off-t', textContent: on ? 'Aktif' : 'Tidak aktif' }));
    b.disabled = !on || !S['server' + n + 'Url'];
    b.onclick = () => { location.href = S['server' + n + 'Url'].replace(/\/$/, '') + '/verify.html?s=' + n; };
  });
  $('#modal').classList.add('on');
}
$('#close').onclick = () => $('#modal').classList.remove('on');

async function act(s, mode) {
  const k = getKey(); if (!k) return openModal();
  const r = await fetch(`/api/script?id=${encodeURIComponent(s.id)}&key=${encodeURIComponent(k.key)}`);
  if (r.status === 401) { localStorage.removeItem('bs_key'); renderKey(); return openModal(); }
  if (!r.ok) return toast('Gagal mengambil script');
  const { code } = await r.json();
  if (mode === 'copy') { await navigator.clipboard.writeText(code); toast('Script disalin'); }
  else { const a = el('a', { href: URL.createObjectURL(new Blob([code])), download: s.title.replace(/\W+/g, '_') + '.lua' }); a.click(); }
}

function render() {
  const cats = ['Semua', ...new Set(scripts.map(s => s.category).filter(Boolean))];
  $('#cats').replaceChildren(...cats.map(c => el('button', { className: 'cat' + (c === cat ? ' on' : ''), textContent: c, onclick: () => { cat = c; render(); } })));
  $('#grid').replaceChildren(...scripts.filter(s => cat === 'Semua' || s.category === cat).map(s => el('div', { className: 'card' },
    el('img', { src: s.image || '', alt: '', loading: 'lazy' }),
    el('div', { className: 'i' }, el('h3', { textContent: s.title }), el('p', { textContent: s.description })),
    el('div', { className: 'act' }, el('button', { className: 'btn', textContent: 'Salin', onclick: () => act(s, 'copy') }), el('button', { className: 'btn sec', textContent: 'Download', onclick: () => act(s, 'dl') })))));
}

(async () => {
  const t = new URLSearchParams(location.search).get('t');
  if (t) {
    history.replaceState({}, '', location.pathname);
    try {
      const r = await fetch('/api/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t }) });
      const d = await r.json();
      if (r.ok) { localStorage.setItem('bs_key', JSON.stringify(d)); toast('Key berhasil dibuat!'); } else toast(d.error);
    } catch { toast('Gagal membuat key'); }
  }
  renderKey();
  try {
    S = (await getDoc(doc(db, 'settings', 'main'))).data() || {};
    scripts = (await getDocs(collection(db, 'scripts'))).docs.map(d => ({ id: d.id, ...d.data() }));
    render();
  } catch { toast('Gagal memuat data'); }
})();
