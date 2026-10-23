import { content } from '../content';
import { eventDate } from '../lib/format';

const pad = (n: number) => String(n).padStart(2, '0');

export function startCountdown() {
  const target = eventDate(content.events[content.countdownTo].time).getTime();
  const els = [...document.querySelectorAll<HTMLElement>('[data-cd]')];
  const tick = () => {
    let ms = Math.max(0, target - Date.now());
    const d = Math.floor(ms / 864e5); ms -= d * 864e5;
    const h = Math.floor(ms / 36e5); ms -= h * 36e5;
    const m = Math.floor(ms / 6e4); ms -= m * 6e4;
    const v: Record<string, string> = { d: pad(d), h: pad(h), m: pad(m), s: pad(Math.floor(ms / 1e3)) };
    for (const el of els) {
      const next = v[el.dataset.cd!];
      if (el.textContent !== next) el.textContent = next;
    }
  };
  tick();
  setInterval(tick, 1000);
}
