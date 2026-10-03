# Kathu (കത്ത്)

The Photoshop version of the invitation: **Kathu**, a story told as an airmail letter in 8 frames. Open `mockup/kathu-board.html` in a browser to see the layout. The website version lives in the repo root (`index.html`) and is not touched by anything in this folder.
**Junaid Raziq & Rafeeda** · **Sunday, 13 December 2026** · Nikah 12:00 PM · Zain Auditorium, Kadakkallu

> Something came in the post for you.

## What this is
8 story frames (1080 × 1920) designed in Photoshop, sent on WhatsApp and Instagram,
with an optional short video version.

## Folders
| Folder | What goes in it |
|---|---|
| `mockup/` | `kathu-board.html`: all 8 frames laid out, open in any browser |
| `story/` | The script, the props list, and the earlier Red Thread idea in `alternatives/` |
| `design/` | Style guide: colors, fonts, grid, export settings |
| `assets/photos/` | Childhood photos, couple photos, ring shot |
| `assets/props/` | Envelope, letter, telegram, wax seal and postcard shots |
| `assets/textures/` | Paper texture, grain |
| `assets/fonts/` | Font files used in the design |
| `psd/` | Photoshop working files |
| `exports/frames/` | Final JPG/PNG frames, named `01-envelope.jpg` … `08-reply.jpg` |
| `exports/video/` | The animated version (MP4) |

## Plan
- [ ] Fill in the remaining blanks in `story/script.md`, marked `[ ]`: how you met (optional telegram strip), postmark years, WhatsApp number
- [ ] Gather props and photos (`story/props-checklist.md`)
- [ ] Design frames in Photoshop
- [ ] Export and test on a phone
- [ ] Send

See `timeline.md` for dates.

## Note on large files
PSDs get big. If a file is over 50 MB, track `psd/` with Git LFS:
```
git lfs install
git lfs track "*.psd"
```
