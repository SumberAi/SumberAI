let audioCtx = null;
let masterGain = null;
let isMuted = false;
let bgmAudio = null;

export const initAudio = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended' && !isMuted) {
    audioCtx.resume();
  }
};

export const toggleMute = () => {
  isMuted = !isMuted;
  
  if (audioCtx) {
    if (isMuted) {
      audioCtx.suspend();
    } else {
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }
  }

  if (masterGain) {
    masterGain.gain.value = isMuted ? 0 : 0.5;
  }

  if (bgmAudio) {
    bgmAudio.muted = isMuted;
  }
  
  return isMuted;
};

export const getMuteState = () => isMuted;

export const playBgm = (url) => {
  if (bgmAudio) {
    if (bgmAudio.src && bgmAudio.src.endsWith(url) && !bgmAudio.paused) {
      return; // Already playing the same BGM
    }
    bgmAudio.pause();
  }
  bgmAudio = new Audio(url);
  bgmAudio.loop = true;
  bgmAudio.volume = 0.3;
  bgmAudio.muted = isMuted;
  bgmAudio.play().catch(e => console.log("BGM play blocked:", e));
};

export const stopBgm = () => {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
};

const playTone = (freq, type, duration, vol = 1) => {
  if (!audioCtx || isMuted) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, audioCtx.currentTime);
  g.gain.setValueAtTime(vol, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  o.connect(g);
  g.connect(masterGain);
  o.start();
  o.stop(audioCtx.currentTime + duration);
};

export const playSfx = (type) => {
  initAudio();
  if (isMuted) return;

  const now = audioCtx.currentTime;

  switch (type) {
    case 'shoot':
      playTone(880, 'square', 0.1, 0.3);
      setTimeout(() => playTone(440, 'square', 0.1, 0.3), 50);
      break;
    case 'correct':
      playTone(523.25, 'sine', 0.1, 0.5); // C5
      setTimeout(() => playTone(659.25, 'sine', 0.2, 0.5), 100); // E5
      break;
    case 'wrong':
      playTone(300, 'sawtooth', 0.2, 0.4);
      setTimeout(() => playTone(250, 'sawtooth', 0.3, 0.4), 150);
      break;
    case 'gameover':
      playTone(400, 'sawtooth', 0.3, 0.4);
      setTimeout(() => playTone(300, 'sawtooth', 0.3, 0.4), 200);
      setTimeout(() => playTone(200, 'sawtooth', 0.5, 0.4), 400);
      break;
    case 'dice':
      // Quick blips
      for(let i=0; i<5; i++) {
        setTimeout(() => playTone(400 + Math.random()*400, 'square', 0.05, 0.3), i*50);
      }
      break;
    case 'move':
      playTone(600, 'sine', 0.08, 0.4);
      break;
    case 'slide': // snake / ladder
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(400, now);
      o.frequency.exponentialRampToValueAtTime(100, now + 0.5); // slide down
      g.gain.setValueAtTime(0.5, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      o.connect(g); g.connect(masterGain);
      o.start(); o.stop(now + 0.5);
      break;
    case 'climb':
      const o2 = audioCtx.createOscillator();
      const g2 = audioCtx.createGain();
      o2.type = 'triangle';
      o2.frequency.setValueAtTime(300, now);
      o2.frequency.exponentialRampToValueAtTime(800, now + 0.5); // slide up
      g2.gain.setValueAtTime(0.5, now);
      g2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      o2.connect(g2); g2.connect(masterGain);
      o2.start(); o2.stop(now + 0.5);
      break;
    case 'flip':
      playTone(800, 'sine', 0.05, 0.3);
      break;
    case 'match':
      playTone(600, 'sine', 0.1, 0.4);
      setTimeout(() => playTone(800, 'sine', 0.1, 0.4), 100);
      setTimeout(() => playTone(1200, 'sine', 0.2, 0.4), 200);
      break;
    case 'error':
      playTone(300, 'triangle', 0.1, 0.4);
      setTimeout(() => playTone(250, 'triangle', 0.2, 0.4), 100);
      break;
    case 'win':
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, i) => {
        setTimeout(() => playTone(f, 'sine', 0.2, 0.5), i * 150);
      });
      break;
    default:
      break;
  }
};
