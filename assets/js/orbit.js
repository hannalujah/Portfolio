/* Hero animation: a stylized NRHO -> DRO transfer in the Earth–Moon rotating frame.
   Spacecraft speed varies with distance to the Moon (fast at perilune, slow at apolune),
   each craft leaves a fading trail, and every other NRHO revolution a craft burns at
   apolune, flies the transfer arc and inserts into the DRO. */
(function () {
  "use strict";

  const svg = document.getElementById("orbit-svg");
  if (!svg) return;

  const NS = "http://www.w3.org/2000/svg";
  const MOON = { x: 248, y: 210 };
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  /* ---------- Starfield (deterministic, so it doesn't jump between visits) ---------- */
  (function stars() {
    const g = document.getElementById("stars");
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 90; i++) {
      const r = rnd() * 1.1 + 0.25;
      el("circle", {
        cx: (rnd() * 400).toFixed(1),
        cy: (rnd() * 360).toFixed(1),
        r: r.toFixed(2),
        class: r > 1.05 ? "twinkle" : "",
        style: `--tw-delay:${(rnd() * 6).toFixed(2)}s;--tw-dur:${(3 + rnd() * 4).toFixed(2)}s`,
        opacity: (rnd() * 0.55 + 0.25).toFixed(2)
      }, g);
    }
  })();

  /* ---------- Time-parameterized path sampling ----------
     Samples a path uniformly in arc length, then assigns each step a time dt = ds / v(r),
     where r is the distance to the Moon. phase in [0,1) is then "fraction of the period". */
  function sampler(path, n, speed) {
    const L = path.getTotalLength();
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const p = path.getPointAtLength((L * i) / n);
      pts.push({ x: p.x, y: p.y });
    }
    const t = [0];
    for (let i = 1; i <= n; i++) {
      const a = pts[i - 1], b = pts[i];
      const mx = (a.x + b.x) / 2 - MOON.x, my = (a.y + b.y) / 2 - MOON.y;
      t.push(t[i - 1] + Math.hypot(b.x - a.x, b.y - a.y) / speed(Math.hypot(mx, my)));
    }
    const T = t[n];
    for (let i = 0; i <= n; i++) t[i] /= T;
    return {
      pts,
      at(phase) {
        phase = ((phase % 1) + 1) % 1;
        let lo = 0, hi = n;
        while (hi - lo > 1) {
          const mid = (lo + hi) >> 1;
          if (t[mid] <= phase) lo = mid; else hi = mid;
        }
        const f = (phase - t[lo]) / (t[hi] - t[lo] || 1);
        const a = pts[lo], b = pts[hi];
        return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
      },
      phaseOfIndex: (i) => t[i]
    };
  }

  const nrhoPath = document.getElementById("nrho");
  const droPath = document.getElementById("dro");
  const xferBase = document.getElementById("xfer");
  const xferLive = document.getElementById("xfer-live");

  // Vis-viva-like speed profile: v ~ r^-k
  const NRHO = sampler(nrhoPath, 600, (r) => Math.pow(Math.max(r, 12), -0.85));
  const DRO = sampler(droPath, 600, (r) => Math.pow(Math.max(r, 12), -0.25));

  // Apolune = sampled point farthest from the Moon; the transfer departs there.
  let apoIdx = 0, best = -1;
  NRHO.pts.forEach((p, i) => {
    const d = Math.hypot(p.x - MOON.x, p.y - MOON.y);
    if (d > best) { best = d; apoIdx = i; }
  });
  const APO = NRHO.pts[apoIdx];
  const APO_PHASE = NRHO.phaseOfIndex(apoIdx);
  const INSERT = { x: 310, y: 210 }; // rightmost point of the DRO = start of its path
  const xd = `M${APO.x.toFixed(1)} ${APO.y.toFixed(1)} C ${(APO.x + 70).toFixed(1)} ${(APO.y + 6).toFixed(1)}, ${INSERT.x + 4} 150, ${INSERT.x} ${INSERT.y}`;
  xferBase.setAttribute("d", xd);
  xferLive.setAttribute("d", xd);
  const XFER_L = xferLive.getTotalLength();

  /* ---------- Scene objects ---------- */
  const trailsG = document.getElementById("trails");
  const craftG = document.getElementById("craft");
  const burnsG = document.getElementById("burns");
  const TRAIL_SEGS = 22;

  function makeCraft(cls, trailSpan) {
    const segs = [];
    for (let i = 0; i < TRAIL_SEGS; i++) {
      segs.push(el("path", { class: `trail ${cls}`, "stroke-opacity": (1 - i / TRAIL_SEGS) * 0.85, "stroke-width": 2.4 - (1.6 * i) / TRAIL_SEGS }, trailsG));
    }
    const dot = el("circle", { r: 3.6, class: `sc ${cls}` }, craftG);
    return { segs, dot, trailSpan };
  }

  // Trail drawn by sampling the orbit backwards in time, so it bends correctly around perilune.
  function drawCraft(c, orbit, phase) {
    const p = orbit.at(phase);
    c.dot.setAttribute("cx", p.x.toFixed(2));
    c.dot.setAttribute("cy", p.y.toFixed(2));
    const step = c.trailSpan / TRAIL_SEGS;
    for (let i = 0; i < TRAIL_SEGS; i++) {
      const a = phase - i * step;
      let d = "";
      for (let k = 0; k <= 3; k++) {
        const q = orbit.at(a - (k * step) / 3);
        d += (k ? "L" : "M") + q.x.toFixed(1) + " " + q.y.toFixed(1);
      }
      c.segs[i].setAttribute("d", d);
    }
  }

  const nrhoCraft = makeCraft("sc-nrho", 0.16);
  const droCraft = makeCraft("sc-dro", 0.14);
  const xferDot = el("circle", { r: 3.4, class: "sc sc-xfer", opacity: 0 }, craftG);

  function burn(x, y, cls) {
    const ring = el("circle", { cx: x, cy: y, r: 2, class: `burn ${cls}` }, burnsG);
    const start = performance.now();
    (function grow(now) {
      const k = Math.min((now - start) / 900, 1);
      const e = 1 - Math.pow(1 - k, 3);
      ring.setAttribute("r", (2 + 16 * e).toFixed(2));
      ring.setAttribute("stroke-opacity", (1 - k).toFixed(3));
      if (k < 1) requestAnimationFrame(grow); else ring.remove();
    })(start);
  }

  /* ---------- Loop ---------- */
  const T_NRHO = 6.5;   // seconds per NRHO revolution
  const T_DRO = 14;     // seconds per DRO revolution
  const T_XFER = 3.6;   // seconds of flight on the transfer arc
  const FADE = 1.4;     // seconds for the highlighted arc to fade after arrival

  let nrhoPhase = APO_PHASE + 0.35;
  let droPhase = 0.6;
  let revs = 0;
  let xfer = null; // { t } seconds since departure
  const easeInOut = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);

  function frame(dt) {
    const prev = nrhoPhase;
    nrhoPhase += dt / T_NRHO;
    droPhase += dt / T_DRO;

    // Did the NRHO craft pass apolune this frame?
    const crossed = Math.floor(prev - APO_PHASE) !== Math.floor(nrhoPhase - APO_PHASE);
    if (crossed && !xfer && revs++ % 2 === 0) {
      xfer = { t: 0 };
      burn(APO.x, APO.y, "burn-nrho");
    }

    drawCraft(nrhoCraft, NRHO, nrhoPhase);
    drawCraft(droCraft, DRO, droPhase);

    if (xfer) {
      xfer.t += dt;
      const k = Math.min(xfer.t / T_XFER, 1);
      const p = xferLive.getPointAtLength(XFER_L * easeInOut(k));
      xferDot.setAttribute("cx", p.x.toFixed(2));
      xferDot.setAttribute("cy", p.y.toFixed(2));
      xferDot.setAttribute("opacity", k < 1 ? 1 : 0);
      xferLive.style.strokeDashoffset = (1 - easeInOut(k)).toFixed(4);
      if (k >= 1 && !xfer.arrived) {
        xfer.arrived = true;
        burn(INSERT.x, INSERT.y, "burn-dro");
      }
      const fade = Math.max(0, (xfer.t - T_XFER) / FADE);
      xferLive.style.opacity = (1 - fade).toFixed(3);
      if (fade >= 1) {
        xfer = null;
        xferLive.style.opacity = 0;
      }
    }
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    svg.classList.add("static", "live");
    xferLive.style.opacity = 0;
    frame(0);
    return;
  }

  let running = false, visible = true, last = 0;
  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05); // clamp after tab switches
    last = now;
    frame(dt);
    requestAnimationFrame(tick);
  }
  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on) {
      last = performance.now();
      requestAnimationFrame(tick);
    }
  }
  const update = () => setRunning(visible && !document.hidden);

  frame(0);
  // Let the orbits draw in before the spacecraft start moving.
  setTimeout(() => {
    svg.classList.add("live");
    update();
  }, 1300);

  document.addEventListener("visibilitychange", update);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      update();
    }).observe(svg);
  }
})();
