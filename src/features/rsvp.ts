import { content } from '../content';
import { $ } from '../lib/motion';
import { saveRsvp } from '../lib/supabase';

/** RSVP sheet: collects the reply, saves it, and opens WhatsApp with it written out. */
export function initRsvp() {
  const sheet = $('sheet');
  const send = $<HTMLAnchorElement>('send');
  const nameEl = $<HTMLInputElement>('gName');
  const fromEl = $<HTMLInputElement>('gFrom');
  const msgEl = $<HTMLTextAreaElement>('gMsg');
  const { whatsapp, maxGuests } = content.rsvp;
  let attending = true;
  let guests = 1;

  let previousOverflow = '';
  const open = () => {
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    setTimeout(() => nameEl.focus({ preventScroll: true }), 350);
  };
  const close = () => {
    document.documentElement.style.overflow = previousOverflow;
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    $('openRsvp').focus({ preventScroll: true });
  };

  $('openRsvp').addEventListener('click', open);
  $('closeRsvp').addEventListener('click', close);
  $('shade').addEventListener('click', close);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet.classList.contains('open')) close(); });

  document.querySelectorAll<HTMLButtonElement>('[data-att]').forEach((b) =>
    b.addEventListener('click', () => {
      attending = b.dataset.att === 'yes';
      document.querySelectorAll('[data-att]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      $('countField').hidden = !attending;
      update();
    }),
  );

  const setCount = (n: number) => {
    guests = Math.min(maxGuests, Math.max(1, n));
    $('gCount').innerHTML = `${guests}<small>${guests === 1 ? 'Guest' : 'Guests'}</small>`;
    update();
  };
  $('minus').addEventListener('click', () => setCount(guests - 1));
  $('plus').addEventListener('click', () => setCount(guests + 1));
  [nameEl, fromEl, msgEl].forEach((el) => el.addEventListener('input', update));

  function values() {
    return { name: nameEl.value.trim(), from: fromEl.value.trim(), msg: msgEl.value.trim() };
  }

  function update() {
    const { name, from, msg } = values();
    const { day, month, year, weekday } = content.date;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const lines = [
      `Assalamu Alaikum! RSVP for the Nikah of ${content.groom.name.split(' ')[0]} & ${content.bride.name} (${weekday}, ${day} ${months[month - 1]} ${year})`,
      '',
      `Name: ${name}`,
      from ? `From: ${from}` : null,
      attending ? "Attending: Yes, insha'Allah" : 'Attending: Sorry, cannot make it',
      attending ? `Guests: ${guests}` : null,
      msg ? `Message: ${msg}` : null,
    ].filter((x): x is string => x !== null);

    const ready = Boolean(name && whatsapp);
    send.href = ready ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join('\n'))}` : '#';
    send.setAttribute('aria-disabled', String(!ready));
    $('sendHint').textContent = !whatsapp
      ? 'RSVP opens soon'
      : name ? 'This opens WhatsApp with your reply ready to send' : 'Add your name to send';
  }

  $('rsvp').addEventListener('submit', (e) => e.preventDefault());
  sheet.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const items = [...sheet.querySelectorAll<HTMLElement>('button, input, textarea, a[href]')]
      .filter((el) => el.getClientRects().length && el.getAttribute('aria-disabled') !== 'true');
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  });

  // Save a copy of the reply as WhatsApp opens; never blocks the guest
  send.addEventListener('click', (e) => {
    if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
    const { name, from, msg } = values();
    void saveRsvp({
      name,
      attending,
      guests: attending ? guests : 0,
      from_where: from || null,
      message: msg || null,
    });
  });

  update();
}
