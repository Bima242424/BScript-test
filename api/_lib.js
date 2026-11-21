const c = require('crypto');
const SECRET = process.env.KEY_SECRET || '';
const h = (s) => c.createHmac('sha256', SECRET).update(s).digest('base64url');
const eq = (a, b) => a.length === b.length && c.timingSafeEqual(Buffer.from(a), Buffer.from(b));
exports.sign = (o) => { const p = Buffer.from(JSON.stringify(o)).toString('base64url'); return p + '.' + h(p); };
exports.verify = (t) => {
  try {
    const [p, s] = String(t).split('.');
    if (!eq(s, h(p))) return null;
    const o = JSON.parse(Buffer.from(p, 'base64url'));
    return o.exp > Date.now() ? o : null;
  } catch { return null; }
};
exports.makeKey = () => {
  const id = c.randomBytes(6).toString('hex'), exp = Date.now() + 12 * 3600 * 1000;
  const e = exp.toString(36);
  return { key: `BS-${id}-${e}-${h(id + e).slice(0, 16)}`, exp };
};
exports.checkKey = (k) => {
  const m = /^BS-([0-9a-f]{12})-([0-9a-z]+)-([0-9a-zA-Z_-]{16})$/.exec(String(k || ''));
  if (!m || !eq(m[3], h(m[1] + m[2]).slice(0, 16))) return false;
  return parseInt(m[2], 36) > Date.now();
};
let db;
exports.db = () => {
  if (!db) {
    const a = require('firebase-admin');
    if (!a.apps.length) a.initializeApp({ credential: a.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
    db = a.firestore();
  }
  return db;
};
exports.settings = async () => (await exports.db().doc('settings/main').get()).data() || {};
exports.body = (req) => (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {});
