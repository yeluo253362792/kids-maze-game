(function (root) {
  let ctx = null;
  let unlocked = false;

  function getCtx() {
    if (!ctx) {
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  /** Call from a user gesture so mobile browsers allow sound. */
  function unlock() {
    const c = getCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    unlocked = true;
  }

  function tone(freq, duration, type, gainValue, when) {
    const c = getCtx();
    if (!c || !unlocked) return;
    const t0 = when != null ? when : c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainValue, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function step() {
    // Soft short “tap”
    tone(660, 0.07, 'triangle', 0.08);
  }

  function bump() {
    // Low dull thud
    const c = getCtx();
    if (!c || !unlocked) return;
    const t0 = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, t0);
    osc.frequency.exponentialRampToValueAtTime(60, t0 + 0.12);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.1, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + 0.16);
  }

  function win() {
    // Cheerful three-note sparkle
    const c = getCtx();
    if (!c || !unlocked) return;
    const t0 = c.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      tone(freq, 0.18, 'sine', 0.12, t0 + i * 0.1);
    });
  }

  root.Sfx = { unlock, step, bump, win };
})(typeof globalThis !== 'undefined' ? globalThis : this);
