import { clamp } from '../lib/motion';

/** Background music: fades in when the invitation opens, with a mute toggle. */
export function createMusic() {
  const audio = document.getElementById('music') as HTMLAudioElement | null;
  const btn = document.getElementById('snd') as HTMLButtonElement;
  let available = false;

  if (audio) {
    audio.addEventListener('canplaythrough', () => (available = true), { once: true });
    audio.addEventListener('error', () => { available = false; btn.hidden = true; });
  }

  const fade = (to: number, ms: number) => {
    if (!audio) return;
    const from = audio.volume, t0 = performance.now();
    const step = (now: number) => {
      const k = clamp((now - t0) / ms);
      audio.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step);
      else if (to === 0) audio.pause();
    };
    requestAnimationFrame(step);
  };

  btn.addEventListener('click', () => {
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => fade(0.55, 800)).catch(() => {});
      btn.classList.remove('off');
      btn.setAttribute('aria-label', 'Mute music');
    } else {
      fade(0, 500);
      btn.classList.add('off');
      btn.setAttribute('aria-label', 'Play music');
    }
  });

  return {
    /** Call from the guest's tap so the browser allows sound */
    start() {
      if (!audio || !(available || audio.readyState >= 2)) return;
      audio.volume = 0;
      audio.play().then(() => { btn.hidden = false; fade(0.55, 3500); }).catch(() => {});
    },
  };
}
