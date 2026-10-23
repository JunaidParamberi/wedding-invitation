import { content } from '../content';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const pad = (n: number) => String(n).padStart(2, '0');

/** "10:00" → "10:00 AM" */
export function displayTime(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${pad(h12)}:${pad(m)} ${suffix}`;
}

export function longDate() {
  const { day, month, year } = content.date;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function shortDate() {
  const { day, month, year } = content.date;
  return `${pad(day)} · ${pad(month)} · ${year}`;
}

/** Exact moment of an event as a Date */
export function eventDate(hhmm: string) {
  const { year, month, day } = content.date;
  return new Date(`${year}-${pad(month)}-${pad(day)}T${hhmm}:00${content.timezoneOffset}`);
}

const gcal = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function calendarUrl() {
  const first = content.events[0];
  const start = eventDate(first.time);
  const end = new Date(start.getTime() + content.calendarHours * 3600_000);
  const details = content.events.map((e) => `${e.label} ${displayTime(e.time)} at ${e.place}, ${e.area}.`).join(' ');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Nikah of ${content.groom.name.split(' ')[0]} & ${content.bride.name}`,
    dates: `${gcal(start)}/${gcal(end)}`,
    details,
    location: `${first.place}, ${first.area}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Escape text before putting it into an HTML template */
export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
