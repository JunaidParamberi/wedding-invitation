# Nikah invitation: notes for AI assistants

- Vite + TypeScript, no framework. `npm run build` must pass (`tsc --noEmit` runs first).
- All guest-facing text and event data belong in `src/content.ts`. Never hardcode names, times or places elsewhere.
- Markup is generated in `src/render.ts`; motion in `src/scenes/`; behaviour in `src/features/`.
- The scroll timeline uses progress values 0–1; the map of moments is the comment at the top of `src/scenes/journey.ts`. Keep it updated when timings change.
- Fonts: Transcity demo (script names and headings; letters only), Lora (fallback for symbols and venue names), Montserrat (everything else, including numbers), GE SS Two (all Arabic, licensed). Keep text easy to read: sentence case, normal letter spacing.
- No shadows on text, figures or edges.
- Colours and font tokens live in `src/styles/tokens.css`.
- The bride, groom and couple are illustrations (`public/img/bride.webp`, `groom.webp`, `couple.webp`), cut out from a blue screen.
- Palette: warm ivory/cream, deep burgundy (`--wine`) as the only strong colour, champagne gold detail. No blue or green in new artwork.
- Test on a 390×844 phone viewport. The page must work with reduced motion and without music.
- RSVPs: table `public.rsvps`, insert-only for the public key (see `supabase/migrations`). Never add a select policy for anon.
