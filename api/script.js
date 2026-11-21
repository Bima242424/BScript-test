const L = require('./_lib');
module.exports = async (req, res) => {
  try {
    const { id, key } = req.query;
    if (!L.checkKey(key)) return res.status(401).json({ error: 'Key tidak valid/expired' });
    if (!/^[\w-]{1,40}$/.test(id || '')) return res.status(400).json({ error: 'Bad id' });
    const d = await L.db().doc('scriptCode/' + id).get();
    if (!d.exists) return res.status(404).json({ error: 'Tidak ada' });
    res.setHeader('Cache-Control', 'no-store');
    res.json({ code: d.data().code });
  } catch { res.status(500).json({ error: 'Server error' }); }
};
