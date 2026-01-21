# 🎯 QR Code Setup Guide for ACM Scavenger Hunt

This guide shows you exactly how to create, print, and place QR codes for your hunt.

---

## 📋 Overview: What QR Codes You Need

You need **5 QR codes total**:

| QR Code | Location | Points To | When Scanned |
|---------|----------|-----------|--------------|
| **Starter QR** | Russell Union (ACM Table) | `/hunt/1.html` | Shows Clue 1 puzzle |
| **QR #2** | Lakeside Dining Hall | `/hunt/2.html` | Shows Clue 2 puzzle |
| **QR #3** | IT Building | `/hunt/3.html` | Shows Clue 3 puzzle |
| **QR #4** | IAB Building | `/hunt/4.html` | Shows Clue 4 puzzle |
| **QR #5 (Optional)** | IAB Building | `/hunt/done.html` | Shows finish screen |

**Note:** QR #5 is optional — after solving Clue 4, teams can tap "Finish" to reach `done.html` without scanning.

---

## 🔗 Step 1: Get Your GitHub Pages URL

Before creating QR codes, you need your live site URL.

1. **Push your code to GitHub:**
   ```powershell
   git add .
   git commit -m "ACM Hunt ready for deployment"
   git push
   ```

2. **Enable GitHub Pages:**
   - Go to your repo: https://github.com/mazeadone/mazeadone.github.io
   - Click **Settings** → **Pages** (left sidebar)
   - Under "Source", select **main** branch
   - Click **Save**
   - Wait 1-2 minutes

3. **Your site will be live at:**
   ```
   https://mazeadone.github.io
   ```

4. **Test it:** Open that URL in a browser and make sure the home page loads.

---

## 🎨 Step 2: Create Styled QR Code Posters

### RECOMMENDED: Use the Styled Python Script (Nickelodeon Theme!)

**This creates beautiful, branded QR codes matching your site's slime green/orange theme!**

Your repo includes `generate_styled_qr.py` which creates eye-catching posters.

#### How to Generate Styled QR Codes:

1. **Install required libraries:**
   ```powershell
   pip install qrcode[pil] pillow
   ```

2. **Edit `generate_styled_qr.py` (line 10):**
   - Open the file in VS Code
   - Change `BASE_URL = "https://mazeadone.github.io"` to your actual GitHub Pages URL
   - Save the file (Ctrl+S)

3. **Run the script:**
   ```powershell
   python generate_styled_qr.py
   ```

4. **Result:** 
   - Creates a `qr_codes/` folder in your project
   - Generates 5 styled poster PNG files:
     - `1-starter-russell-union.png` - Orange header with 🏛️
     - `2-lakeside-dining.png` - Green header with 🍽️
     - `3-it-building.png` - Green header with 💻
     - `4-iab-building.png` - Green header with 🌳
     - `5-finish.png` - Blue header with 🏁

**Each poster includes:**
- 🎨 Colorful Nickelodeon-style header (orange/green/blue)
- 🏛️ Large location emoji
- 📍 Bold "START HERE" or "SCAN ME" title
- 🎯 Clue number badge (CLUE 1, CLUE 2, etc.)
- 📱 Large, colored QR code with border
- 📍 Location name (Russell Union, Lakeside Dining, etc.)
- ℹ️ Clear scanning instructions
- 🎓 ACM branding footer

**What they look like:**
```
┌─────────────────────────────────────┐
│  🏛️  VIBRANT ORANGE/GREEN HEADER   │
│         "START HERE" / "SCAN ME"     │
├─────────────────────────────────────┤
│       ┌───────────────────┐         │
│       │   CLUE 1 badge    │         │
│       └───────────────────┘         │
│                                     │
│       ┌───────────────────┐         │
│       │  ■ ■ ■ ■ ■ ■ ■   │         │
│       │  ■ COLORED  ■ ■   │         │
│       │  ■ QR CODE  ■ ■   │         │
│       │  ■ ■ ■ ■ ■ ■ ■   │         │
│       └───────────────────┘         │
│                                     │
│       Russell Union / ACM Table     │
│     SCAN WITH YOUR PHONE CAMERA     │
│                                     │
│    ACM @ Organization Fair          │
└─────────────────────────────────────┘
```

**Size:** 850x1100 pixels (perfect for 8.5" x 11" printing at 300 DPI)

---

### Alternative: Online Generator (If Python doesn't work)

If you can't run Python, use [QRCode Monkey](https://www.qrcode-monkey.com/):

**For each URL:**
1. **Starter QR:** `https://mazeadone.github.io/hunt/1.html`
2. **QR #2:** `https://mazeadone.github.io/hunt/2.html`
3. **QR #3:** `https://mazeadone.github.io/hunt/3.html`
4. **QR #4:** `https://mazeadone.github.io/hunt/4.html`
5. **Finish QR:** `https://mazeadone.github.io/hunt/done.html`

**Settings:**
- Colors: Use #6bd425 (slime green) or #ff6f00 (orange)
- Size: High resolution (at least 1000x1000px)
- Format: PNG
- Error correction: Level H

Then design posters in PowerPoint/Canva with the QR codes.

### Option B: Use Styled Python Script (RECOMMENDED - Nickelodeon Theme!)

**This creates beautiful, branded QR codes matching your site's slime green/orange theme!**

Your repo includes `generate_styled_qr.py` which creates eye-catching posters with:
- 🎨 Slime green & orange Nickelodeon colors
- 🏛️ Location emojis and names
- 📍 Clear "SCAN ME" instructions
- 🖼️ Professional poster layout (ready to print)

1. **Install required libraries:**
   ```powershell
   pip install qrcode[pil] pillow
   ```

2. **Edit `generate_styled_qr.py` (line 10):**
   - Change `BASE_URL = "https://mazeadone.github.io"` to your actual GitHub Pages URL
   - Save the file

3. **Run the script:**
   ```powershell
   python generate_styled_qr.py
   ```

4. **Result:** 
   - Creates a `qr_codes/` folder
   - Generates 5 styled PNG posters (850x1100px, print-ready)
   - Each poster has:
     - Colorful header (orange for START, green for hunt, blue for FINISH)
     - Large emoji and title
     - QR code with border
     - Location name
     - Instructions to scan
     - ACM branding

**What the posters look like:**
```
┌─────────────────────────────────────┐
│  ORANGE/GREEN HEADER WITH EMOJI 🏛️  │
│        "START HERE" / "SCAN ME"      │
├─────────────────────────────────────┤
│       ┌───────────────────┐         │
│       │  "CLUE 1"  badge  │         │
│       └───────────────────┘         │
│                                     │
│       ┌───────────────────┐         │
│       │                   │         │
│       │   LARGE QR CODE   │         │
│       │   (colored!)      │         │
│       │                   │         │
│       └───────────────────┘         │
│                                     │
│       Russell Union / ACM Table     │
│     SCAN WITH YOUR PHONE CAMERA     │
│                                     │
│    ACM @ Organization Fair          │
└─────────────────────────────────────┘
```

**Print settings:**
- Size: 8.5" x 11" (letter)
- Quality: Best/High
- Color: Full color (makes them pop!)
- Paper: Regular or cardstock

---

## 🖨️ Step 3: Print Your Styled QR Codes

**You now have professional, Nickelodeon-themed QR posters ready to print!**

### Printing Instructions:

1. **Open the `qr_codes/` folder**
   - You'll see 5 PNG files
   - Each is sized perfectly for 8.5" x 11" paper

2. **Print settings:**
   - **Paper:** 8.5" x 11" (letter size)
   - **Quality:** Best / High Quality
   - **Color:** Full color (this makes them POP! 🎨)
   - **Paper type:** 
     - Regular printer paper works fine
     - Cardstock is better (more durable)
   - **Orientation:** Portrait

3. **How many to print:**
   - 1-2 copies per location (backup in case one gets damaged)
   - Total: 5-10 sheets

4. **Cost:**
   - Home printer: ~$0.50-1.00 per color page
   - Library/print shop: Usually $0.25-0.50 per page
   - FedEx/Staples: $0.50-1.00 per color page

**No printer? Options:**
- 📚 University library print services
- 🏢 FedEx Office / Staples
- 🖨️ UPS Store
- 🎓 ACM department printer (ask faculty advisor)

**Just email yourself the PNG files and print at any of these locations!**

---

## 📍 Step 4: How Each QR Code Directs to the Next Challenge

### General Placement Guidelines:
✅ **Eye level** (5-6 feet high)  
✅ **High-traffic areas** (entrances, lobbies, near doors)  
✅ **Well-lit** (avoid dark corners)  
✅ **Protected** (inside buildings when possible)  
✅ **Visible** but not blocking walkways  
❌ **Don't cover emergency exits or official signage**

### Specific Locations:

#### 1. **Starter QR (Russell Union)**
   - **Where:** ACM table at the Organization Fair
   - **Setup:** Tape it to your table display or poster board
   - **Visibility:** Make sure people at the fair can see it
   - **Staff:** Have an ACM volunteer nearby to help

#### 2. **QR #2 (Lakeside Dining Hall)**
   - **Where:** Main entrance area (high-traffic)
   - **Hint from Clue 1:** "Find the slime poster with the next QR"
   - **Placement:** Near the entrance where people enter for meals
   - **Tape:** Use painter's tape (won't damage walls)

#### 3. **QR #3 (IT Building)**
   - **Where:** Main lobby or hallway near entrance
   - **Hint from Clue 2:** "Find the slime poster + QR near a main hallway / lobby"
   - **Placement:** Somewhere visible when entering the building
   - **Permission:** Check with IT building staff if needed

#### 4. **QR #4 (IAB Building)**
   - **Where:** Main entrance or lobby area
   - **Hint from Clue 3:** "Find the final slime poster + QR"
   - **Placement:** Near the main entrance
   - **Final stop:** Make this one easy to find since it's the last clue

#### 5. **QR #5 (Optional Finish QR)**
   - **Where:** Back at Russell Union / ACM table OR at IAB
   - **Purpose:** Teams can scan to go directly to finish screen
   - **Note:** Not required — teams can tap "Finish" in the app instead

---

## 🔒 Step 5: Secure the Posters

### Materials You'll Need:
- **Painter's tape** (won't damage walls)
- **Clear packing tape** (to laminate posters)
- **Scissors**
- Optional: Page protectors or laminating sheets

### How to Secure:
1. **Laminate (optional but recommended):**
   - Cover the poster with clear packing tape on both sides
   - Or use a page protector / laminating sheet
   - This protects from rain, tears, and smudges

2. **Tape to wall:**
   - Use 4 pieces of painter's tape (one on each corner)
   - For extra security, add tape strips along the edges
   - Make sure it's flat against the wall

3. **Height:**
   - Tape at eye level (around 5-6 feet)
   - Test by scanning with your phone before leaving

---

## ✅ Step 6: Test the Hunt Flow

Before the event, do a **full test run**:

1. **Scan Starter QR at Russell Union**
   - Should load `/hunt/1.html`
   - Enter a test team name
   - Solve Clue 1 (pick 🍽️ + 🌊)
   - Verify hint appears: "Head to Lakeside Dining Hall..."

2. **Walk to Lakeside → Scan QR #2**
   - Should load `/hunt/2.html`
   - Solve Clue 2 (pick 💻 + 📟)
   - Verify hint: "Go to the IT Building..."

3. **Walk to IT Building → Scan QR #3**
   - Should load `/hunt/3.html`
   - Solve Clue 3 (pick 🌳 + 📚)
   - Verify hint: "Go to IAB..."

4. **Walk to IAB → Scan QR #4**
   - Should load `/hunt/4.html`
   - Solve Clue 4 (pick 🏁)
   - Tap "Finish"
   - Should load `/hunt/done.html`

5. **Check leaderboard:**
   - Go back to home page
   - Verify your test team appears in leaderboard (if configured)

**If anything doesn't work:**
- Check the QR code URL (typo?)
- Make sure GitHub Pages is live
- Test internet connection at each location

---

## 📱 Day-of-Event Checklist

**30 minutes before:**
- [ ] Visit each location and check QR codes are still in place
- [ ] Test scan each QR with your phone
- [ ] Have spare printed QR codes in case one gets damaged

**During event:**
- [ ] Have an ACM volunteer at Russell Union (start point)
- [ ] Check your phone for incoming leaderboard submissions
- [ ] Replace any damaged QR codes

**After event:**
- [ ] Remove all QR code posters
- [ ] Download leaderboard data from Google Sheets (if using)
- [ ] Thank building staff if you got permission

---

## 🆘 Troubleshooting

### "QR code won't scan"
- **Fix:** Make sure it's not too small (minimum 3" x 3")
- **Fix:** Check lighting — use a flashlight if needed
- **Fix:** Make sure the QR isn't wrinkled or damaged

### "Wrong page loads"
- **Fix:** Double-check the URL in the QR code
- **Fix:** Regenerate the QR with the correct URL

### "Site says 'Page not found'"
- **Fix:** Make sure GitHub Pages is enabled and deployed
- **Fix:** Wait 2-3 minutes after pushing code

### "Leaderboard not updating"
- **Fix:** Check Google Form and Sheet URLs in `app.js`
- **Fix:** Make sure Sheet is published and shared publicly

---

## 🎉 You're Ready!

You now have everything to run a successful QR scavenger hunt:
- ✅ QR codes created and tested
- ✅ Posters designed and printed
- ✅ Codes placed at each location
- ✅ Hunt flow tested end-to-end

**Good luck with your ACM Organization Fair! 🦅**

---

## 📦 Quick Reference: URLs for QR Codes

Copy-paste these into your QR generator:

```
Starter QR:  https://mazeadone.github.io/hunt/1.html
QR #2:       https://mazeadone.github.io/hunt/2.html
QR #3:       https://mazeadone.github.io/hunt/3.html
QR #4:       https://mazeadone.github.io/hunt/4.html
Finish QR:   https://mazeadone.github.io/hunt/done.html
```

Replace `mazeadone.github.io` with your actual GitHub Pages domain if different.
