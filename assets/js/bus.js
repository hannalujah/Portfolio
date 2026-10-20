/* Hero animation for the embedded page: data packets moving between an MCU and its
   peripherals over SPI, CAN, BLE and I2C, a FreeRTOS "heartbeat" LED, and a
   logic-analyzer strip that shows the SPI transactions as they happen. */
(function () {
  "use strict";

  const svg = document.getElementById("bus-svg");
  if (!svg) return;

  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const $ = (id) => document.getElementById(id);

  /* ---------- MCU pins (QFP-style, 8 per side) ---------- */
  (function pins() {
    const g = $("mcu-pins");
    const N = 8, x0 = 150, y0 = 130, S = 100, step = S / (N + 1);
    for (let i = 1; i <= N; i++) {
      const o = i * step;
      el("rect", { class: "mcu-pin", x: x0 + o - 2, y: y0 - 7, width: 4, height: 7 }, g);
      el("rect", { class: "mcu-pin", x: x0 + o - 2, y: y0 + S, width: 4, height: 7 }, g);
      el("rect", { class: "mcu-pin", x: x0 - 7, y: y0 + o - 2, width: 7, height: 4 }, g);
      el("rect", { class: "mcu-pin", x: x0 + S, y: y0 + o - 2, width: 7, height: 4 }, g);
    }
  })();

  /* ---------- Packets ---------- */
  const packetsG = $("packets");
  const wavesG = $("waves");
  const active = [];

  // Send a packet along a trace. reverse=true runs it from the trace's end to its start.
  function send(traceId, cls, dur, { reverse = false, onDone } = {}) {
    const path = $(traceId);
    const L = path.getTotalLength();
    const dot = el("rect", { class: `packet ${cls}`, width: 7, height: 4, rx: 1.5 }, packetsG);
    active.push({ path, L, dot, t: 0, dur, reverse, onDone });
  }

  function flash(id) {
    const g = $(id);
    g.classList.add("hit");
    setTimeout(() => g.classList.remove("hit"), 260);
  }

  // Radio waves from the BLE antenna tip
  function radiate() {
    for (let k = 0; k < 2; k++) {
      setTimeout(() => {
        const ring = el("path", { class: "wave", d: "" }, wavesG);
        const start = performance.now();
        (function grow(now) {
          const p = Math.min((now - start) / 1100, 1);
          const r = 6 + 22 * (1 - Math.pow(1 - p, 2));
          // Upward-facing arc above the antenna tip (331, 112)
          ring.setAttribute("d", `M${331 - r} ${112 - r * 0.15} A${r} ${r} 0 0 1 ${331 + r} ${112 - r * 0.15}`);
          ring.setAttribute("stroke-opacity", (1 - p).toFixed(3));
          if (p < 1) requestAnimationFrame(grow); else ring.remove();
        })(start);
      }, k * 260);
    }
  }

  function updatePackets(dt) {
    for (let i = active.length - 1; i >= 0; i--) {
      const a = active[i];
      a.t += dt;
      const k = Math.min(a.t / a.dur, 1);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const s = a.reverse ? 1 - e : e;
      const p = a.path.getPointAtLength(a.L * s);
      // Orient the packet along the trace
      const q = a.path.getPointAtLength(Math.min(a.L, Math.max(0, a.L * s + (a.reverse ? -0.5 : 0.5))));
      const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      a.dot.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${ang.toFixed(1)}) translate(-3.5 -2)`);
      if (k >= 1) {
        a.dot.remove();
        active.splice(i, 1);
        if (a.onDone) a.onDone();
      }
    }
  }

  /* ---------- Bus traffic schedule ---------- */
  let spiBusyUntil = 0; // clock time (s) until which the logic analyzer shows an SPI transaction
  let clock = 0;

  const buses = [
    {
      // SPI: MCU polls the RC522 (MOSI out, MISO back) — also drives the logic analyzer
      period: 2.4, phase: 0.4,
      fire() {
        spiBusyUntil = clock + 0.9;
        // Traces are drawn MCU -> peripheral, so MISO (peripheral -> MCU) runs in reverse.
        send("t-spi-mosi", "pk-spi", 0.55, { onDone: () => flash("p-spi") });
        setTimeout(() => send("t-spi-miso", "pk-spi", 0.55, { reverse: true }), 380);
      }
    },
    {
      // CAN: transmit a frame out to the bus connector, occasionally receive one
      period: 1.9, phase: 1.1, n: 0,
      fire() {
        if (this.n++ % 3 === 2) {
          send("t-can-bus", "pk-can", 0.45, { reverse: true, onDone: () => {
            flash("p-can");
            send("t-can-rx", "pk-can", 0.5, { reverse: true });
          } });
        } else {
          send("t-can-tx", "pk-can", 0.5, { onDone: () => {
            flash("p-can");
            send("t-can-bus", "pk-can", 0.45);
          } });
        }
      }
    },
    {
      // BLE: telemetry notification, radiated from the antenna
      period: 3.2, phase: 2.0,
      fire() {
        send("t-ble-tx", "pk-ble", 0.6, { onDone: () => { flash("p-ble"); radiate(); } });
      }
    },
    {
      // I2C: periodic IMU sample read into the MCU
      period: 1.25, phase: 0.2,
      fire() {
        send("t-i2c-sda", "pk-i2c", 0.45, { reverse: true });
        flash("p-i2c");
      }
    }
  ];
  buses.forEach((b) => (b.next = b.phase));

  /* ---------- Logic analyzer ---------- */
  const X0 = 48, X1 = 358, DX = 2, NS_ = Math.floor((X1 - X0) / DX);
  const BASE = { cs: 21, sck: 39, mosi: 57 }, AMP = 8;
  const samples = { cs: [], sck: [], mosi: [] };
  for (let i = 0; i < NS_; i++) { samples.cs.push(1); samples.sck.push(0); samples.mosi.push(0); }
  const SAMPLE_RATE = 70; // samples per second, i.e. scroll speed
  let sampleAcc = 0, sckPhase = 0, mosiBit = 0, mosiHold = 0;

  function pushSample() {
    const busy = clock < spiBusyUntil;
    samples.cs.push(busy ? 0 : 1);
    sckPhase = busy ? 1 - sckPhase : 0;
    samples.sck.push(sckPhase);
    if (busy) {
      if (mosiHold-- <= 0) { mosiBit = Math.random() < 0.5 ? 1 : 0; mosiHold = 1; }
    } else mosiBit = 0;
    samples.mosi.push(mosiBit);
    for (const k in samples) samples[k].shift();
  }

  function waveD(arr, base) {
    let y = base - arr[0] * AMP;
    let d = `M${X0} ${y}`;
    for (let i = 1; i < arr.length; i++) {
      const ny = base - arr[i] * AMP;
      if (ny !== y) { d += `H${X0 + i * DX}V${ny}`; y = ny; }
    }
    return d + `H${X0 + (arr.length - 1) * DX}`;
  }
  const wf = { cs: $("wf-cs"), sck: $("wf-sck"), mosi: $("wf-mosi") };
  const drawWaves = () => { for (const k in wf) wf[k].setAttribute("d", waveD(samples[k], BASE[k])); };

  /* ---------- Heartbeat LED (FreeRTOS idle-task blink) ---------- */
  const led = $("led");

  function frame(dt) {
    clock += dt;
    for (const b of buses) {
      if (clock >= b.next) { b.fire(); b.next += b.period; }
    }
    updatePackets(dt);
    sampleAcc += dt * SAMPLE_RATE;
    while (sampleAcc >= 1) { pushSample(); sampleAcc -= 1; }
    drawWaves();
    led.classList.toggle("on", clock % 1 < 0.12 || (clock % 1 > 0.24 && clock % 1 < 0.36));
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    // Static snapshot: one SPI transaction frozen on the logic analyzer
    spiBusyUntil = Infinity;
    for (let i = 0; i < 60; i++) pushSample();
    spiBusyUntil = 0;
    for (let i = 0; i < 40; i++) pushSample();
    drawWaves();
    svg.classList.add("live");
    return;
  }

  let running = false, visible = true, last = 0;
  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    frame(dt);
    requestAnimationFrame(tick);
  }
  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on) { last = performance.now(); requestAnimationFrame(tick); }
  }
  const update = () => setRunning(visible && !document.hidden);

  drawWaves();
  setTimeout(() => { svg.classList.add("live"); update(); }, 900);
  document.addEventListener("visibilitychange", update);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; update(); }).observe(svg);
  }
})();
