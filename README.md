# Junaid & Rafeeda · Nikah invitation

An immersive, scroll-driven wedding invitation: a gatefold envelope sealed with wax opens onto a lantern-lit walk through two arches, the couple, and the wedding details with RSVP.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (also on your phone over Wi‑Fi)
npm run build      # production build in dist/
```

## Change the wording, times or places

Everything guests read is in **`src/content.ts`**: names, parents, date, events and map links, the Qur'an quote, the WhatsApp number and the music file. Edit it and the whole page updates.

## Project layout

```
src/
  content.ts          ← all text and event details
  main.ts             ← boots everything in order
  render.ts           ← builds the page markup from content.ts
  scenes/
    gate.ts           ← gatefold envelope + wax seal opening
    journey.ts        ← scroll timeline (arches, lanterns, couple, text reveals)
  features/
    rsvp.ts           ← RSVP sheet → WhatsApp + Supabase
    countdown.ts
    music.ts
  lib/
    motion.ts         ← easing helpers
    format.ts         ← dates, times, calendar link
    supabase.ts       ← saves RSVPs (optional)
  styles/             ← one stylesheet per part of the page; colours/fonts in tokens.css
public/
  img/  fonts/  audio/   og.jpg (WhatsApp link preview)
supabase/migrations/  ← database schema for RSVPs
```

The scroll timeline is documented at the top of `src/scenes/journey.ts`. Each moment is a pair of numbers between 0 and 1 (scroll progress), so pacing changes are one-number edits.

## Music

`public/audio/music.mp3` is a seamless loop (the end crossfades into the start). It plays through Web Audio so there is no gap, fades in when the guest taps the seal; a small icon lets them mute it. With no file, the icon stays hidden.

## RSVPs

Guests' replies open WhatsApp to the number in `content.ts`, and a copy is saved to Supabase (table `rsvps`). Guests can only add replies; reading them needs your Supabase login.

- See every reply: Supabase dashboard → Table editor → `rsvps`
- See totals: SQL editor → `select * from rsvp_summary;`

Supabase settings live in `.env.production` (public values only). Leave them empty to use WhatsApp alone.

## Deploy (Vercel)

1. vercel.com → Add New → Project → import this repo. Vercel detects Vite; no settings needed.
2. After the first deploy, put your real site address in `VITE_SITE_URL` in `.env.production` and push. This makes the WhatsApp link preview show the envelope image.
3. Every push to `main` deploys automatically. Other branches get their own preview link, handy for trying changes before guests see them.
