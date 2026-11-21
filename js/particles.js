(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.getElementById('fx'); if (!cv) return;
  const cx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 1.5);
  const G = document.createElement('canvas'); G.width = G.height = 64;
  const g = G.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(198,255,61,.9)'); gr.addColorStop(.25, 'rgba(198,255,61,.25)'); gr.addColorStop(1, 'rgba(198,255,61,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  let w, h, P = [], run = true;
  const mk = (init) => ({ x: Math.random() * w, y: init ? Math.random() * h : h + 20, v: .15 + Math.random() * .45, d: (Math.random() - .5) * .25,
    s: Math.random() < .18 ? 26 + Math.random() * 20 : 2 + Math.random() * 3, glow: 0, a: .2 + Math.random() * .5, r: Math.random() * 6.28 });
  const size = () => { w = innerWidth; h = innerHeight; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    P = Array.from({ length: w < 600 ? 26 : 48 }, () => mk(true)); P.forEach(p => p.glow = p.s > 10); };
  size(); addEventListener('resize', size);
  document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) loop(); });
  function loop() {
    if (!run) return;
    cx.clearRect(0, 0, w, h);
    for (const p of P) {
      p.y -= p.v; p.x += p.d; p.r += .01;
      if (p.y < -40 || p.x < -40 || p.x > w + 40) { Object.assign(p, mk(false)); p.glow = p.s > 10; }
      if (p.glow) { cx.globalAlpha = p.a * .55; cx.drawImage(G, p.x - p.s, p.y - p.s, p.s * 2, p.s * 2); }
      else { cx.globalAlpha = p.a; cx.fillStyle = '#c6ff3d'; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); cx.restore(); }
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
