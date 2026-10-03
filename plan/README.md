# The Red Thread

The Photoshop version of the invitation: a set of story frames. The website version lives in the repo root (`index.html`) and is not touched by anything in this folder.
**Junaid Raziq & Rafeeda** · **Sunday, 13 December 2026** · Nikah 12:00 PM · Zain Auditorium, Kadakkallu

> They say an invisible red thread connects those who are meant to meet.

## What this is
8 story frames (1080 × 1920) designed in Photoshop, sent on WhatsApp and Instagram,
with an optional short video version.

## Folders
| Folder | What goes in it |
|---|---|
| `story/` | The script (text for every frame) and the shot list |
| `design/` | Style guide: colors, fonts, grid, export settings |
| `assets/photos/` | Childhood photos, couple photos, ring shot |
| `assets/props/` | Cut-out red thread, small objects for Frame 4 |
| `assets/textures/` | Paper texture, grain |
| `assets/fonts/` | Font files used in the design |
| `psd/` | Photoshop working files |
| `exports/frames/` | Final JPG/PNG frames, named `01-cover.jpg` … `08-you.jpg` |
| `exports/video/` | The animated version (MP4) |

## Plan
- [ ] Fill in the remaining blanks in `story/script.md`, marked `[ ]`: how you met, objects for Frame 4, RSVP contact
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
