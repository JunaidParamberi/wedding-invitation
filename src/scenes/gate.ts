/**
 * Opening: a full-screen gatefold envelope. Tapping the wax seal cracks it
 * and the two doors swing open sideways, revealing the journey behind.
 */
import { $, prefersReducedMotion } from '../lib/motion';

/** Artwork size of /img/door-front.webp */
const ART_W = 1092;
const ART_H = 1440;
/** Seal-circle diameter and text bands, as fractions of the artwork */
const SEAL = 230;
const TEXT_TOP = 0.2;
const TEXT_BOTTOM = 0.64;
/** Vertical centre of the seal circle */
const SEAL_Y = 0.486;

export function initGate(onOpen: () => void) {
  const gate = $('gate');
  const reduce = prefersReducedMotion();
  let opened = false;

  // keep the printed text and the seal locked to the cover-scaled artwork
  const fit = () => {
    const w = gate.clientWidth || innerWidth;
    const scale = Math.max(w / ART_W, innerHeight / ART_H);
    const h = ART_H * scale;
    const top = (innerHeight - h) / 2;
    gate.style.setProperty('--seal', `${Math.round(SEAL * scale)}px`);
    gate.style.setProperty('--seal-y', `${top + h * SEAL_Y}px`);
    gate.style.setProperty('--p-top', `${top + h * TEXT_TOP}px`);
    gate.style.setProperty('--p-bot', `${top + h * TEXT_BOTTOM}px`);
  };
  fit();
  addEventListener('resize', fit);

  $('openBtn').addEventListener('click', () => {
    if (opened) return;
    opened = true;
    gate.classList.add('crack');
    setTimeout(() => {
      gate.classList.add('open', 'gone');
      onOpen();
      setTimeout(() => (gate.style.display = 'none'), 2900);
    }, reduce ? 0 : 480);
  });

  return {
    /** Fade the envelope in once its images are ready */
    ready: () => gate.classList.add('ready'),
  };
}
