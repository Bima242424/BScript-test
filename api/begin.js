const L = require('./_lib');
module.exports = async (req, res) => {
  try {
    const s = String(req.query.s) === '2' ? 2 : 1;
    const S = await L.settings();
    if (!S['server' + s + 'Active']) return res.status(403).json({ error: 'Server tidak aktif' });
    const steps = Math.min(Math.max(+S.adCount || 1, 1), 10), wait = Math.max(+S.stepSeconds || 8, 5);
    const now = Date.now();
    const t = L.sign({ k: 'b', s, steps, wait, iat: now, exp: now + 30 * 60 * 1000, j: require('crypto').randomUUID() });
    res.json({ t, steps, wait, url: S.monetagUrl, ret: S.mainUrl });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
};
