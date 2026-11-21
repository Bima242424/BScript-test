const $ = (s) => document.querySelector(s);
const info = $('#info'), go = $('#go');
let D, step = 0, busy = false;
const post = (u, b) => fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error); return d; });
const label = () => { info.textContent = `Langkah ${step + 1} dari ${D.steps}: klik tombol, lihat iklan, lalu tunggu.`; go.textContent = 'Buka Iklan'; go.disabled = false; };
(async () => {
  try {
    const s = new URLSearchParams(location.search).get('s') === '2' ? 2 : 1;
    D = await fetch('/api/begin?s=' + s).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error); return d; });
    label();
  } catch (e) { info.textContent = e.message || 'Gagal memuat'; }
})();
go.onclick = () => {
  if (busy) return; busy = true; go.disabled = true;
  window.open(D.url, '_blank', 'noopener');
  let left = D.wait; go.textContent = `Tunggu ${left}s`;
  const iv = setInterval(async () => {
    left--; go.textContent = `Tunggu ${left}s`;
    if (left > 0) return;
    clearInterval(iv); step++; busy = false;
    $('#bar').style.width = (step / D.steps * 100) + '%';
    if (step < D.steps) return label();
    go.textContent = 'Memproses...';
    try { const r = await post('/api/complete', { t: D.t }); location.href = D.ret.replace(/\/$/, '') + '/?t=' + encodeURIComponent(r.t); }
    catch (e) { info.textContent = e.message; }
  }, 1000);
};
