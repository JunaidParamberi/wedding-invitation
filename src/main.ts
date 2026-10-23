import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/gate.css';
import './styles/journey.css';
import './styles/details.css';
import './styles/rsvp.css';

import { renderPage } from './render';
import { initGate } from './scenes/gate';
import { initJourney } from './scenes/journey';
import { createMusic } from './features/music';
import { startCountdown } from './features/countdown';
import { initRsvp } from './features/rsvp';

const root = document.getElementById('app')!;
renderPage(root);

document.documentElement.classList.add('locked');
history.scrollRestoration = 'manual';
scrollTo(0, 0);

const music = createMusic();
const journey = initJourney();
const gate = initGate(() => {
  music.start();
  document.documentElement.classList.remove('locked');
  journey.arrive();
});

startCountdown();
initRsvp();

// reveal the envelope once the first images and fonts are ready
const load = document.getElementById('load')!;
const reveal = () => {
  load.classList.add('done');
  setTimeout(gate.ready, 300);
};
// wait for every scene image so nothing pops in during the journey (capped below)
const critical = [...document.querySelectorAll<HTMLImageElement>('img')];
Promise.all(critical.map((img) => img.decode().catch(() => undefined)))
  .then(() => document.fonts.ready)
  .finally(reveal);
setTimeout(reveal, 8000);
