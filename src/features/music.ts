import { content } from '../content';

/**
 * Background music. Uses Web Audio so the loop is seamless (an <audio loop>
 * leaves a small gap at the end of an MP3). Starts on the guest's tap,
 * fades in, and can be muted from the top bar.
 */
export function createMusic() {
  const btn = document.getElementById('snd') as HTMLButtonElement;
  const src = content.music;
  type Ctx = typeof AudioContext;
  const AC: Ctx | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctx }).webkitAudioContext;

  let ctx: AudioContext | null = null;
  let gain: GainNode | null = null;
  let source: AudioBufferSourceNode | null = null;
  let playing = false;

  // download early so the first tap can start the sound immediately
  const data: Promise<ArrayBuffer | null> = src && AC
    ? fetch(src).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null)
    : Promise.resolve(null);

  const fadeTo = (value: number, seconds: number) => {
    if (!ctx || !gain) return;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(value, now + seconds);
  };

  async function start() {
    if (!AC || playing) return;
    // create and resume inside the tap so mobile browsers allow sound
    ctx = ctx ?? new AC();
    void ctx.resume();
    const bytes = await data;
    if (!bytes) return;
    const buffer = await ctx.decodeAudioData(bytes.slice(0));
    gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain);
    source.start();
    playing = true;
    btn.hidden = false;
    fadeTo(0.6, 3.5);
  }

  btn.addEventListener('click', () => {
    if (!ctx) return;
    if (btn.classList.contains('off')) {
      void ctx.resume();
      fadeTo(0.6, 0.8);
      btn.classList.remove('off');
      btn.setAttribute('aria-label', 'Mute music');
    } else {
      fadeTo(0, 0.5);
      btn.classList.add('off');
      btn.setAttribute('aria-label', 'Play music');
    }
  });

  // pause when the guest leaves the tab, resume when they return
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !playing) return;
    if (document.hidden) void ctx.suspend();
    else if (!btn.classList.contains('off')) void ctx.resume();
  });

  return { start: () => void start() };
}
