const L = require('./_lib');
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const o = L.verify(L.body(req).t);
    if (!o || o.k !== 'c') return res.status(400).json({ error: 'Token tidak valid/kedaluwarsa' });
    try { await L.db().doc('used/' + o.j).create({ at: Date.now() }); }
    catch { return res.status(400).json({ error: 'Token sudah dipakai' }); }
    res.json(L.makeKey());
  } catch { res.status(500).json({ error: 'Server error' }); }
};
