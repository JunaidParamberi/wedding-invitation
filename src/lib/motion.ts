/** Small math helpers shared by the scroll-driven scenes. */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Smoothstep from a to b */
export const ss = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Cubic ease-in-out from a to b */
export const ease = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Fade in over a→b, fade out over c→d */
export const fade = (p: number, a: number, b: number, c: number, d: number) =>
  ss(a, b, p) * (1 - ss(c, d, p));

/** Position, rotate, scale and set opacity in one write */
export const place = (el: HTMLElement, x: number, y: number, s = 1, o = 1, r = 0) => {
  el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${r}deg) scale(${s})`;
  el.style.opacity = String(o);
};

export const prefersReducedMotion = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;

export const $ = <T extends HTMLElement = HTMLElement>(id: string) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el as T;
};
