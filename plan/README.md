# Mylanchi (മൈലാഞ്ചി)

The Photoshop version of the invitation: **Mylanchi**, the whole story drawn in henna across 8 frames. Open `mockup/mylanchi-board.html` in a browser to see the layout. The website version lives in the repo root (`index.html`) and is not touched by anything in this folder.
**Junaid Raziq & Rafeeda** · **Sunday, 13 December 2026** · Nikah 12:00 PM · Zain Auditorium, Kadakkallu

> Look closely. Our names are hidden somewhere in here.

## What this is
8 story frames (1080 × 1920) designed in Photoshop, sent on WhatsApp and Instagram,
with an optional short video version.

## Folders
| Folder | What goes in it |
|---|---|
| `mockup/` | `mylanchi-board.html`: all 8 frames laid out, open in any browser. `kathu-board.html` is the earlier airmail idea. |
| `story/` | The script, the props list, and earlier ideas (Red Thread, Kathu) in `alternatives/` |
| `design/` | Style guide: colors, fonts, grid, export settings |
| `assets/photos/` | Childhood photos, couple photos, ring shot |
| `assets/props/` | Henna photos: wet paste and stain shots for each design |
| `assets/textures/` | Paper texture, grain |
| `assets/fonts/` | Font files used in the design |
| `psd/` | Photoshop working files |
| `exports/frames/` | Final JPG/PNG frames, named `01-names.jpg` … `08-reply.jpg` |
| `exports/video/` | The animated version (MP4) |

## Plan
- [ ] Fill in the remaining blanks in `story/script.md`, marked `[ ]`: how you met (optional line in frame 4), WhatsApp number
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
