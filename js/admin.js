import { db, auth } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, getDocs, doc, getDoc, setDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const $ = (s) => document.querySelector(s);
const toast = (m) => { const t = $('#toast'); t.textContent = m; t.style.display = 'block'; setTimeout(() => t.style.display = 'none', 2200); };
const F = ['adCount', 'stepSeconds', 'monetagUrl', 'mainUrl', 'server1Url', 'server2Url'], C = ['server1Active', 'server2Active'];
$('#lg').onclick = () => signInWithEmailAndPassword(auth, $('#em').value, $('#pw').value).catch(() => toast('Login gagal'));
$('#out').onclick = () => signOut(auth);
onAuthStateChanged(auth, async (u) => {
  let ok = false;
  if (u) { try { ok = (await getDoc(doc(db, 'admins', u.uid))).exists(); } catch {} }
  if (u && !ok) { await signOut(auth); toast('Bukan akun admin'); }
  $('#login').style.display = ok ? 'none' : 'flex'; $('#app').style.display = ok ? 'block' : 'none';
  if (ok) { loadS(); loadL(); }
});
async function loadS() {
  const s = (await getDoc(doc(db, 'settings', 'main'))).data() || {};
  F.forEach(k => $('#' + k).value = s[k] ?? ''); C.forEach(k => $('#' + k).checked = !!s[k]);
}
$('#saveS').onclick = async () => {
  const s = {}; F.forEach(k => s[k] = $('#' + k).value.trim()); C.forEach(k => s[k] = $('#' + k).checked);
  s.adCount = +s.adCount || 1; s.stepSeconds = +s.stepSeconds || 8;
  await setDoc(doc(db, 'settings', 'main'), s); toast('Tersimpan');
};
async function loadL() {
  const items = (await getDocs(collection(db, 'scripts'))).docs.map(d => ({ id: d.id, ...d.data() }));
  $('#list').replaceChildren(...items.map(s => {
    const r = document.createElement('div'); r.className = 'row';
    const n = document.createElement('span'); n.textContent = `${s.title} (${s.category || '-'})`;
    const e = Object.assign(document.createElement('button'), { className: 'btn sec', textContent: 'Edit', onclick: () => edit(s) });
    const d = Object.assign(document.createElement('button'), { className: 'btn sec', textContent: 'Hapus', onclick: async () => { if (!confirm('Hapus?')) return; const b = writeBatch(db); b.delete(doc(db, 'scripts', s.id)); b.delete(doc(db, 'scriptCode', s.id)); await b.commit(); loadL(); } });
    r.append(n, e, d); return r;
  }));
}
async function edit(s) {
  $('#sid').value = s.id; $('#title').value = s.title; $('#desc').value = s.description || ''; $('#category').value = s.category || ''; $('#image').value = s.image || '';
  $('#code').value = (await getDoc(doc(db, 'scriptCode', s.id))).data()?.code || ''; $('#ft').textContent = 'Edit Script'; scrollTo(0, 0);
}
const reset = () => { ['sid', 'title', 'desc', 'category', 'image', 'code'].forEach(k => $('#' + k).value = ''); $('#ft').textContent = 'Tambah Script'; };
$('#reset').onclick = reset;
$('#saveSc').onclick = async () => {
  if (!$('#title').value || !$('#code').value) return toast('Judul & kode wajib');
  const id = $('#sid').value || doc(collection(db, 'scripts')).id, b = writeBatch(db);
  b.set(doc(db, 'scripts', id), { title: $('#title').value, description: $('#desc').value, category: $('#category').value.trim(), image: $('#image').value, updated: Date.now() });
  b.set(doc(db, 'scriptCode', id), { code: $('#code').value });
  await b.commit(); toast('Script tersimpan'); reset(); loadL();
};
