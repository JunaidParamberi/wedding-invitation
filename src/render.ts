/**
 * Builds the page markup from content.ts.
 * Structure only; motion lives in scenes/, behaviour in features/.
 */
import { content as c } from './content';
import { calendarUrl, displayTime, esc, longDate, shortDate } from './lib/format';

const first = (full: string) => full.split(' ')[0];

function door(side: 'l' | 'r') {
  return `
  <div class="door ${side}">
    <div class="face front">
      <img class="art" src="/img/door-front.webp" alt="">
      <div class="print">
        <div class="p-top"><div class="p-bism" lang="ar">${c.bismillah}</div></div>
        <div class="p-bot">
          <div class="p-ar" lang="ar">${c.coupleAr}</div>
          <div class="p-names">${esc(first(c.groom.name))} &amp; ${esc(c.bride.name)}</div>
          <div class="p-date">${shortDate()}</div>
          <div class="p-tap">Tap the seal to open</div>
        </div>
      </div>
      <div class="edge"></div>
      <div class="shade"></div>
      <div class="seal-half"><img src="/img/seal.webp" alt=""></div>
    </div>
    <div class="face back"><img class="art" src="/img/door-in.webp" alt=""><div class="shade"></div></div>
  </div>`;
}

function gate() {
  return `
<div id="gate">
  ${door('l')}
  ${door('r')}
  <button id="openBtn" type="button" aria-label="Break the seal and open the invitation"></button>
  <div class="intro-fade"></div>
</div>`;
}

function bar() {
  return `
<div class="bar">
  <span class="mono" aria-hidden="true">${c.monogramAr}</span>
  <div class="bar-r">
    <button class="snd" id="snd" type="button" aria-label="Mute music" hidden><i></i><i></i><i></i><i></i></button>
    <button class="ghost" id="skip" type="button">Skip to details</button>
  </div>
</div>`;
}

function person(id: string, label: string, p: typeof c.groom | typeof c.bride) {
  return `
  <div class="copy" id="${id}">
    <span class="ln eyebrow">${label}</span>
    <div class="ln hero-ar" lang="ar">${p.nameAr}</div>
    <h2 class="ln name big">${esc(p.name)}</h2>
    <div class="ln rule"><span></span></div>
    <span class="ln sub">${p.relation} of ${esc(p.parents)}<br><i>${esc(p.home)}</i></span>
  </div>`;
}

function event(e: (typeof c.events)[number]) {
  return `
      <div class="ev">
        <span class="ev-k">${esc(e.label)}</span>
        <b class="ev-t">${displayTime(e.time)}</b>
        <strong class="ev-p">${esc(e.place)}</strong>
        <span class="ev-a">${esc(e.area)}</span>
        <a class="ev-map" target="_blank" rel="noopener" href="${esc(e.mapUrl)}">Directions</a>
      </div>`;
}

function stage() {
  const couple = `${esc(c.groom.name)} <span class="amp">&amp;</span> ${esc(c.bride.name)}`;
  return `
<div id="stage">
  <img class="full" id="night" src="/img/night.webp" alt="">
  <img class="full" id="court" src="/img/courtyard.webp" alt="">

  <div class="group" id="mid">
    <img class="person" id="pGroom" src="/img/groom.webp" alt="${esc(c.groom.name)}">
    <img class="person" id="pBride" src="/img/bride.webp" alt="${esc(c.bride.name)}">
    <img class="archimg" src="/img/arch-mid.webp" alt="">
  </div>
  <div class="group" id="outer"><img class="archimg" src="/img/arch-outer.webp" alt=""></div>

  <div id="duo">
    <img id="dBride" src="/img/bride.webp" alt="">
    <img id="dGroom" src="/img/groom.webp" alt="">
  </div>
  <div id="lanterns"></div>
  <div id="petals"></div>
  <div class="vignette"></div>
  <div id="veil"></div>
  <div id="finalShade"></div>
  <div class="scrim" id="scrim"></div>

  <div class="copy" id="intro">
    <div class="ln bism" lang="ar">${c.bismillah}</div>
    <div class="ln rule"><span></span></div>
    <span class="ln eyebrow">Together with our families</span>
    <div class="ln hero-ar" lang="ar">${c.coupleAr}</div>
    <h1 class="ln name">${esc(first(c.groom.name))} <span class="amp">&amp;</span> ${esc(c.bride.name)}</h1>
  </div>
  <div id="hint"><span>Scroll to enter</span><i></i></div>

  ${person('nameA', 'The Groom', c.groom)}
  ${person('nameB', 'The Bride', c.bride)}

  <div class="copy" id="together">
    <span class="ln eyebrow">By the will of Allah</span>
    <h2 class="ln name big">Two hearts,<br>one Nikah</h2>
    <img class="ln orn" src="/img/ornament.webp" alt="">
    <span class="ln sub"><i>“${esc(c.quote.text)}”</i><br>${esc(c.quote.source)}</span>
  </div>

  <div class="copy" id="final" role="region" aria-label="Wedding details">
    <span class="ln eyebrow">We invite you to the Nikah of</span>
    <h2 class="ln name">${couple}</h2>
    <img class="ln orn" src="/img/ornament.webp" alt="">
    <div class="ln dateline"><span>${c.date.weekday}</span><b>${longDate()}</b></div>
    <div class="ln events">
      ${c.events.map(event).join('<span class="ev-div" aria-hidden="true"></span>')}
    </div>
    <div class="ln count" aria-live="polite">
      <div><b data-cd="d">00</b><small>Days</small></div>
      <div><b data-cd="h">00</b><small>Hours</small></div>
      <div><b data-cd="m">00</b><small>Min</small></div>
      <div><b data-cd="s">00</b><small>Sec</small></div>
    </div>
    <div class="ln actions">
      <button class="btn solid" id="openRsvp" type="button">RSVP</button>
      <a class="btn" target="_blank" rel="noopener" href="${esc(calendarUrl())}">Add to calendar</a>
    </div>
    <button class="ln link" id="replay" type="button">Walk through again</button>
  </div>
  <div class="grain"></div>
</div>`;
}

function sheet() {
  return `
<div id="sheet" aria-hidden="true">
  <div class="shade" id="shade"></div>
  <form class="form" id="rsvp" role="dialog" aria-modal="true" aria-labelledby="rsvpTitle">
    <button class="closex" id="closeRsvp" type="button" aria-label="Close">×</button>
    <h3 id="rsvpTitle">RSVP</h3>
    <p class="lead">Kindly let us know if you can join us</p>
    <div class="field">
      <label for="gName">Your name</label>
      <input id="gName" name="gName" autocomplete="name" placeholder="Full name" maxlength="60">
    </div>
    <div class="field">
      <span>Will you attend?</span>
      <div class="choice" role="group" aria-label="Will you attend?">
        <button type="button" data-att="yes" aria-pressed="true">Joyfully yes</button>
        <button type="button" data-att="no" aria-pressed="false">Sadly no</button>
      </div>
    </div>
    <div class="field" id="countField">
      <span>Number of guests, including you</span>
      <div class="stepper">
        <button type="button" id="minus" aria-label="Fewer guests">−</button>
        <output id="gCount" aria-live="polite">1<small>Guest</small></output>
        <button type="button" id="plus" aria-label="More guests">+</button>
      </div>
    </div>
    <div class="field">
      <label for="gFrom">From</label>
      <input id="gFrom" name="gFrom" placeholder="Family, place or relation (e.g. Kundoor, cousin)" maxlength="80">
    </div>
    <div class="field">
      <label for="gMsg">Dua or message (optional)</label>
      <textarea id="gMsg" name="gMsg" rows="2" maxlength="300" placeholder="Your wishes for the couple"></textarea>
    </div>
    <a class="send" id="send" target="_blank" rel="noopener" href="#" aria-disabled="true">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1.9 2 1.2 2.3 1.4.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>
      Send RSVP on WhatsApp
    </a>
    <p class="hintline" id="sendHint">Add your name to send</p>
  </form>
</div>`;
}

export function renderPage(root: HTMLElement) {
  root.innerHTML = `
<div id="load" aria-hidden="true"></div>
${gate()}
${bar()}
${stage()}
${sheet()}
<div id="track" aria-hidden="true"></div>`;
}
