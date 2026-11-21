const L = require('./_lib');
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    const o = L.verify(L.body(req).t);
    if (!o || o.k !== 'b') return res.status(400).json({ error: 'Token tidak valid' });
    if (Date.now() - o.iat < o.steps * o.wait * 1000 * 0.9) return res.status(400).json({ error: 'Terlalu cepat' });
    res.json({ t: L.sign({ k: 'c', j: o.j, exp: Date.now() + 5 * 60 * 1000 }) });
  } catch { res.status(500).json({ error: 'Server error' }); }
};
