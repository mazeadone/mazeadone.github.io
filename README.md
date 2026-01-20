# ACM QR Scavenger Hunt (GitHub Pages)

This is a **fully static** QR scavenger hunt designed for **GitHub Pages**.

## Hunt flow (your buildings)
1. Russell Union (ACM table) → Clue 1 unlocks hint to **Lakeside Dining Hall**
2. Lakeside Dining Hall → Clue 2 unlocks hint to **IT Building**
3. IT Building → Clue 3 unlocks hint to **Interdisciplinary Academic Building (IAB)**
4. IAB → Clue 4 → Finish

QR pages:
- Starter QR at Union: `/hunt/1.html`
- Lakeside QR: `/hunt/2.html`
- IT QR: `/hunt/3.html`
- IAB QR: `/hunt/4.html`
- Optional finish QR: `/hunt/done.html`

---

## Leaderboard options

### Option A (fast + no backend): Google Form (write) + OpenSheet (read)
This gives you a **shared leaderboard** that everyone can see on the homepage.

1) Create a Google Form with fields:
- Team (Short answer)
- TotalMs (Short answer)
- S1Ms, S2Ms, S3Ms, S4Ms (Short answer)

2) Link the form to a Google Sheet (Google does this automatically).

3) Publish the Sheet (File → Share → Publish to web).

4) Edit `assets/app.js` → `CONFIG`:
- `leaderboardEnabled: true`
- `googleFormAction`: the form **formResponse** URL
- `formEntries`: the `entry.xxxxx` ids for each field
- `openSheetUrl`: `https://opensheet.elk.sh/<SHEET_ID>/<TAB_NAME>`

How to find entry IDs:
- Open the form → Preview
- View page source
- Search for `entry.` (you’ll see each input name like `entry.123456789`)

> Why this works: we submit to Google using a hidden HTML `<form>` (no CORS), and we read using OpenSheet (CORS-friendly).

### Option B (no shared board)
If you leave `leaderboardEnabled: false`, times still show on the finish page — you can award prizes manually.

---

## Edit the hints / puzzles
Open `assets/app.js` and edit the `STEPS` object:
- `prompt` (puzzle question)
- `options` (multiple choice)
- `nextHint` (the hint revealed when correct)

---

## Generate / print QR codes

### Easiest (no code): use any QR generator website
Make QR codes that point to your GitHub Pages URLs, for example:
`https://mazeadone.github.io/hunt/1.html`

### If you want to generate QR images locally (Python)
Install:
```bash
pip install qrcode pillow
```

Then use `import qrcode.py` (rename it if you want) or any simple script to create PNGs.

Printing tip:
- Put each QR on a page with a big label: “ACM Hunt – Scan Me”
- Print in color if you can, and tape at eye level.
