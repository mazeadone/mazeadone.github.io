# 🏆 Live Leaderboard Setup Guide

This guide walks you through setting up a **live, auto-updating leaderboard** for your ACM QR Scavenger Hunt using Google Forms + Google Sheets + OpenSheet.

**Time required:** ~5-10 minutes  
**Cost:** $0 (completely free)

---

## Step 1: Create a Google Form

1. **Go to [Google Forms](https://forms.google.com)**
   - Sign in with your Google account

2. **Create a new form**
   - Click the **+ Blank** form button
   - Title it: `ACM Hunt Leaderboard Submissions`

3. **Add the following 6 questions** (all should be **Short answer** type):

   | Question Title | Type | Required |
   |---------------|------|----------|
   | `Team name` | Short answer | ✅ Yes |
   | `Total time (ms)` | Short answer | ✅ Yes |
   | `Split 1 (ms)` | Short answer | ✅ Yes |
   | `Split 2 (ms)` | Short answer | ✅ Yes |
   | `Split 3 (ms)` | Short answer | ✅ Yes |
   | `Split 4 (ms)` | Short answer | ✅ Yes |

4. **Get the form submission URL:**
   - Click the **Send** button (top right)
   - Click the **link icon** (🔗) to get a shareable link
   - **Do NOT use this link** — we need the `formResponse` URL
   - Instead, click the **three dots** (⋮) in the top right → **Get pre-filled link**
   - Fill in ANY dummy values (e.g., "test", "1000", "250", "250", "250", "250")
   - Click **Get link** at the bottom
   - Copy the entire URL — it looks like:
   
     ```
     https://docs.google.com/forms/d/e/1FAIpQLSc...LONG_ID.../viewform?usp=pp_url&entry.123456789=test&entry.234567890=1000&entry.345678901=250&entry.456789012=250&entry.567890123=250&entry.678901234=250
     ```

5. **Extract the important parts:**
   - **Form Action URL:** Replace `/viewform?usp=pp_url&...` with `/formResponse`
     - Example result: `https://docs.google.com/forms/d/e/1FAIpQLSc...LONG_ID.../formResponse`
   - **Entry IDs:** Note down the 6 entry numbers:
     - `entry.123456789` → Team name
     - `entry.234567890` → Total time
     - `entry.345678901` → Split 1
     - `entry.456789012` → Split 2
     - `entry.567890123` → Split 3
     - `entry.678901234` → Split 4

---

## Step 2: Link to Google Sheet

1. **Open your form** in edit mode
2. Click the **Responses** tab at the top
3. Click the **green Sheets icon** → **Create Spreadsheet**
4. Name it: `ACM Hunt Leaderboard`
5. Click **Create** — a new Google Sheet opens

---

## Step 3: Publish the Sheet (for OpenSheet access)

1. **In the Google Sheet**, click **File** → **Share** → **Publish to web**
2. In the dialog:
   - **Link:** Select the specific sheet tab (usually "Form Responses 1")
   - **Published content:** Leave as "Entire Document" or select your tab
   - Click **Publish**
   - Confirm "Are you sure?" → **OK**
3. **Copy the Sheet ID** from the URL bar:
   - **Edit URL** looks like: `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2/edit`
     - Copy the part between `/d/` and `/edit`
   - **Published URL** (from "Publish to web") looks like: `https://docs.google.com/spreadsheets/d/e/2PACX-1vRp_ICkS21XNP47xGhzs_KqZzDXWQcExoTUl6VYnE9RrNIVfDhxyflfaaju9hRb3m8IhKU6ZPdOuRRy/pubhtml`
     - Copy the part between `/d/e/` and `/pubhtml`
   - Either way works! Example: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2`

---

## Step 4: Get OpenSheet URL

OpenSheet is a free service that lets you read Google Sheets as JSON without authentication.

**Format:**
```
https://opensheet.elk.sh/{SHEET_ID}/{TAB_NAME}
```

**Your URL:**
- Replace `{SHEET_ID}` with the ID from Step 3
- Replace `{TAB_NAME}` with the exact tab name (usually `Form Responses 1` — spaces are okay)
- Example:
  ```
  https://opensheet.elk.sh/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2/Form Responses 1
  ```

**Test it:**
- Paste the URL in your browser
- You should see `[]` (empty array) or a JSON response if there are submissions
- If you see an error, double-check the Sheet ID and tab name

---

## Step 5: Configure app.js

1. **Open `assets/app.js`** in VS Code
2. **Find the `CONFIG` object** (lines ~13-38)
3. **Update these values:**

```javascript
const CONFIG = {
  leaderboardEnabled: true,  // Already set to true!

  // Paste your formResponse URL here:
  googleFormAction: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse',

  // Paste your entry IDs here:
  formEntries: {
    team: 'entry.123456789',      // From Step 1
    totalMs: 'entry.234567890',   // From Step 1
    s1Ms: 'entry.345678901',      // From Step 1
    s2Ms: 'entry.456789012',      // From Step 1
    s3Ms: 'entry.567890123',      // From Step 1
    s4Ms: 'entry.678901234',      // From Step 1
  },

  // Paste your OpenSheet URL here:
  openSheetUrl: 'https://opensheet.elk.sh/YOUR_SHEET_ID_HERE/Form Responses 1',

  leaderboardLimit: 12,           // Top 12 teams
  leaderboardRefreshMs: 30000,    // Refresh every 30 seconds
};
```

4. **Save the file** (`Ctrl+S`)

---

## Step 6: Test It!

### Local Testing

1. **Open `index.html` in a browser**
   - Right-click → Open with → Chrome/Firefox/Edge
   - Or use Live Server extension in VS Code

2. **Check the leaderboard section:**
   - If URLs are configured: "No submissions yet. Be the first to complete the hunt!"
   - If URLs are missing: "⚙️ Setup Required..." message

3. **Complete a hunt run:**
   - Enter a team name (e.g., "Test Eagles")
   - Go through all 4 clues (click correct emojis)
   - On the "Finished" page, it will auto-submit to Google Forms

4. **Check the Google Sheet:**
   - Refresh the sheet — you should see a new row with your data

5. **Check the leaderboard:**
   - Refresh the home page (`index.html`)
   - Your team should appear in the leaderboard table

---

## Troubleshooting

### "No submissions yet" but I submitted
- **Check the Google Sheet** — is the data there?
- **Wait 30 seconds** — the leaderboard auto-refreshes
- **Check the OpenSheet URL** in your browser — does it return JSON with your data?
- **Check the tab name** — must match exactly (case-sensitive, spaces included)

### "Failed to fetch" or CORS error
- **Make sure the Sheet is published** (Step 3)
- **Double-check the OpenSheet URL format**
- **Try accessing the OpenSheet URL directly** in a browser

### Data not submitting to Google Form
- **Check `googleFormAction` URL** — must end with `/formResponse`
- **Check entry IDs** — must match exactly (e.g., `entry.123456789`)
- **Open browser console** (F12) on the "Finished" page to see any errors

### Duplicate submissions
- This is normal! The code submits every time someone finishes
- If you want to prevent duplicates:
  - Manually delete rows in Google Sheets, OR
  - Add a filter in your sheet to show only unique team names (best time)

---

## Advanced: Custom Sorting

By default, the leaderboard sorts by **fastest total time** (ascending).

To show only the **best time per team** (if someone submits multiple times):

1. In Google Sheets, create a new tab called `Leaderboard`
2. Use a formula to deduplicate and sort:
   ```
   =SORT(UNIQUE('Form Responses 1'!A2:A), 2, TRUE)
   ```
3. Update `openSheetUrl` to point to the new tab:
   ```javascript
   openSheetUrl: 'https://opensheet.elk.sh/YOUR_SHEET_ID/Leaderboard',
   ```

---

## You're Done! 🎉

Your leaderboard will now:
- ✅ Auto-submit when teams finish the hunt
- ✅ Refresh every 30 seconds on the home page
- ✅ Show top 12 teams sorted by fastest time
- ✅ Work for all visitors (no login required)

**Deploy to GitHub Pages:**
```bash
git add .
git commit -m "Enable live leaderboard"
git push
```

Your site will be live at: `https://mazeadone.github.io`

---

## Need Help?

- **OpenSheet issues:** Check [opensheet.elk.sh](https://opensheet.elk.sh)
- **Google Forms/Sheets:** Make sure sharing is set to "Anyone with the link can view"
- **Still stuck?** Share the error message or what you see in the browser console (F12)
