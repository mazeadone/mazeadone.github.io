# 🎯 Quick Reference: Hunt Flow & QR Placement

## How Each QR Code Works

### The Complete Journey:

```
START → Russell Union (ACM Table)
│
├─ Scan: 1-starter-russell-union.png
├─ Loads: /hunt/1.html
├─ Puzzle: Pick emojis for "buffet with lagoon view"
├─ Answer: 🍽️ + 🌊 (lakeside)
├─ Unlocks: "Head to Lakeside Dining Hall..."
│
↓ (Team walks to Lakeside)
│
STOP 1 → Lakeside Dining Hall
│
├─ Scan: 2-lakeside-dining.png
├─ Loads: /hunt/2.html  
├─ Puzzle: Pick emojis for "what made this game"
├─ Answer: 💻 + 📟 (it)
├─ Unlocks: "Go to the IT Building..."
│
↓ (Team walks to IT Building)
│
STOP 2 → IT Building
│
├─ Scan: 3-it-building.png
├─ Loads: /hunt/3.html
├─ Puzzle: Pick emojis for "many branches"
├─ Answer: 🌳 + 📚 (iab)
├─ Unlocks: "Go to IAB..."
│
↓ (Team walks to IAB)
│
STOP 3 → IAB Building
│
├─ Scan: 4-iab-building.png
├─ Loads: /hunt/4.html
├─ Puzzle: Final check
├─ Answer: 🏁 (done)
├─ Unlocks: "Tap Finish!"
│
↓ (Team taps Finish button)
│
FINISH → Completion Screen
│
├─ Shows: Split times + total time
├─ Auto-submits: To leaderboard
└─ Team returns to ACM table for prize!
```

---

## Why This Works

### Physical Security:
- Each QR code is at a **different campus building**
- Teams **must walk to each location** to scan
- Can't skip ahead - don't know where next QR is until solving puzzle

### Digital Flow:
- Each QR points to a **unique URL** (`/hunt/1.html`, `/hunt/2.html`, etc.)
- Solving puzzle **unlocks the hint** with next location name
- No manual verification needed - all automated

### Time Tracking:
- Timer starts when scanning first QR (Russell Union)
- Split times recorded after each puzzle solved
- Total time = sum of all splits
- Auto-submits to Google Sheets leaderboard

---

## Visual: What Students See on Campus

### At Russell Union (START):
```
┌─────────────────────────────────────┐
│  🏛️  VIBRANT ORANGE HEADER         │
│         "START HERE"                 │
├─────────────────────────────────────┤
│       ┌───────────────────┐         │
│       │    CLUE 1 badge   │         │
│       └───────────────────┘         │
│       ┌───────────────────┐         │
│       │   ORANGE QR CODE  │  ← Colored!
│       └───────────────────┘         │
│       Russell Union / ACM Table     │
│     SCAN WITH YOUR PHONE CAMERA     │
└─────────────────────────────────────┘
```
**Scans to:** `hunt/1.html`

### At Lakeside Dining (STOP 1):
```
┌─────────────────────────────────────┐
│  🍽️  SLIME GREEN HEADER            │
│         "SCAN ME"                    │
├─────────────────────────────────────┤
│       ┌───────────────────┐         │
│       │    CLUE 2 badge   │         │
│       └───────────────────┘         │
│       ┌───────────────────┐         │
│       │   GREEN QR CODE   │  ← Slime green!
│       └───────────────────┘         │
│      Lakeside Dining Hall           │
└─────────────────────────────────────┘
```
**Scans to:** `hunt/2.html`

### At IT Building (STOP 2):
```
┌─────────────────────────────────────┐
│  💻  SLIME GREEN HEADER            │
│         "SCAN ME"                    │
├─────────────────────────────────────┤
│       ┌───────────────────┐         │
│       │    CLUE 3 badge   │         │
│       └───────────────────┘         │
│       ┌───────────────────┐         │
│       │   GREEN QR CODE   │  ← Slime green!
│       └───────────────────┘         │
│          IT Building                │
└─────────────────────────────────────┘
```
**Scans to:** `hunt/3.html`

### At IAB (STOP 3):
```
┌─────────────────────────────────────┐
│  🌳  SLIME GREEN HEADER            │
│         "SCAN ME"                    │
├─────────────────────────────────────┤
│       ┌───────────────────┐         │
│       │    CLUE 4 badge   │         │
│       └───────────────────┘         │
│       ┌───────────────────┐         │
│       │   GREEN QR CODE   │  ← Slime green!
│       └───────────────────┘         │
│          IAB Building               │
└─────────────────────────────────────┘
```
**Scans to:** `hunt/4.html`

### Optional Finish QR:
```
┌─────────────────────────────────────┐
│  🏁  BLUE HEADER                    │
│         "YOU DID IT!"                │
├─────────────────────────────────────┤
│       ┌───────────────────┐         │
│       │   FINISH badge    │         │
│       └───────────────────┘         │
│       ┌───────────────────┐         │
│       │   BLUE QR CODE    │  ← Blue!
│       └───────────────────┘         │
│      Return to ACM Table            │
└─────────────────────────────────────┘
```
**Scans to:** `hunt/done.html`

---

## Color Scheme (Nickelodeon Theme)

- **START (Russell Union):** #ff6f00 (Orange) - energetic, attention-grabbing
- **HUNT (Clues 2-4):** #6bd425 (Slime Green) - fun, recognizable
- **FINISH:** #00a7ff (Blue) - celebratory, completion

This matches your website's design perfectly!

---

## Quick Setup Checklist

1. **Generate QR codes:**
   ```powershell
   python generate_styled_qr.py
   ```

2. **Print posters:**
   - Open `qr_codes/` folder
   - Print all 5 PNG files on 8.5x11" paper
   - Use color printing for best effect

3. **Laminate (optional):**
   - Cover with clear packing tape
   - Or use page protectors

4. **Place on campus:**
   - Russell Union: Tape to ACM table
   - Lakeside: Main entrance area
   - IT Building: Lobby/hallway
   - IAB: Main entrance
   - (Optional) Finish QR at ACM table

5. **Test flow:**
   - Scan each QR with your phone
   - Solve each puzzle
   - Verify hints appear correctly
   - Check times show on finish screen

---

## Troubleshooting

**QR won't scan:**
- Make it larger (minimum 3" x 3")
- Improve lighting
- Check for wrinkles/damage

**Wrong page loads:**
- Verify URL in QR code
- Check GitHub Pages is deployed

**Team can't find QR:**
- Place at eye level (5-6 feet)
- Use high-traffic areas
- Make sure it's well-lit

**Leaderboard not updating:**
- Check Google Sheet configuration
- Verify `app.js` has correct URLs

---

## Day-of-Event

**Morning:**
- [ ] Check all QR codes are in place
- [ ] Test scan each one
- [ ] Have backup posters ready

**During:**
- [ ] Monitor leaderboard submissions
- [ ] Help teams if stuck
- [ ] Replace damaged posters

**After:**
- [ ] Remove all posters
- [ ] Download leaderboard data
- [ ] Award prizes!

---

**Good luck! Your Nickelodeon-themed hunt is ready to go! 🎉**
