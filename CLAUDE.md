# Nikah invitation: notes for AI assistants

- Vite + TypeScript, no framework. `npm run build` must pass (`tsc --noEmit` runs first).
- All guest-facing text and event data belong in `src/content.ts`. Never hardcode names, times or places elsewhere.
- Markup is generated in `src/render.ts`; motion in `src/scenes/`; behaviour in `src/features/`.
- The scroll timeline uses progress values 0–1; the map of moments is the comment at the top of `src/scenes/journey.ts`. Keep it updated when timings change.
- Fonts: Playfair Display (names/headings), Marcellus (small caps labels and all numerals), GE SS Two (all Arabic). GE SS Two is a licensed font.
- Colours and font tokens live in `src/styles/tokens.css`.
- The couple's photos (`public/img/groom.webp`, `bride.webp`) must never be altered beyond background removal.
- Test on a 390×844 phone viewport. The page must work with reduced motion and without music.
- RSVPs: table `public.rsvps`, insert-only for the public key (see `supabase/migrations`). Never add a select policy for anon.
