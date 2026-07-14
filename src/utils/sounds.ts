let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch { /* audio not available */ }
}

export function playFlipSound() {
  playTone(800, 0.05, 'square', 0.03);
  setTimeout(() => playTone(1200, 0.04, 'square', 0.02), 30);
}

export function playWinSound() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.06), i * 80);
  });
}

export function playLoseSound() {
  const notes = [400, 350, 300];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'triangle', 0.05), i * 100);
  });
}

export function playAchievementSound() {
  const notes = [880, 1100, 1320, 1760];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.1, 'sine', 0.07), i * 60);
  });
}
