// ACM QR Scavenger Hunt (GitHub Pages static)
// - Team + progress stored in localStorage
// - Optional global leaderboard via Google Form (write) + OpenSheet (read)

const STORE = {
  TEAM: 'acm_hunt_team',
  STEP: 'acm_hunt_step',
  START_TS: 'acm_hunt_start_ts',
  CHECKPOINTS: 'acm_hunt_checkpoints', // array of timestamps when each step was solved (index = step)
  SPLITS: 'acm_hunt_splits',           // array of ms durations per step
};

const CONFIG = {
  // ===== Leaderboard (optional) =====
  // 1) Create a Google Form that writes to a Google Sheet.
  // 2) Put the formResponse URL + entry IDs below so this site can submit results without CORS.
  // 3) Publish the linked Google Sheet and read it via OpenSheet (CORS-friendly).
  leaderboardEnabled: true,

  // Example: 'https://docs.google.com/forms/d/e/XXXXXXXXXXXX/formResponse'
  googleFormAction: 'https://docs.google.com/forms/d/e/1FAIpQLSdpershkxHEr-O72V3Lkp7fa3dOpu4En067PEC0rvXiq7S31A/formResponse',

  // Map of form entry IDs. (See README below.)
  formEntries: {
    team: 'entry.1025134229',     // e.g. 'entry.123456789'
    totalMs: 'entry.962831989',  // e.g. 'entry.234567890'
    s1Ms: 'entry.972432832',
    s2Ms: 'entry.528332285',
    s3Ms: 'entry.1887287050',
    s4Ms: 'entry.1908666368',
  },

  // Example OpenSheet URL: `https://opensheet.elk.sh/<SHEET_ID>/<TAB_NAME>`
  openSheetUrl: 'https://opensheet.elk.sh/1zv_u5eqyHDDWcXqUdnsd0D_S9hDsjCDQAuu-ROQrkRs/Form%20Responses%201',

  // How many rows to show on homepage
  leaderboardLimit: 12,
  
  // Auto-refresh interval in milliseconds (30 seconds)
  leaderboardRefreshMs: 30000,
};

function $(id){ return document.getElementById(id); }

function getTeam(){ return (localStorage.getItem(STORE.TEAM) || '').trim(); }
function setTeam(name){ localStorage.setItem(STORE.TEAM, (name||'').trim()); }

function getStep(){ return Number(localStorage.getItem(STORE.STEP) || '0'); }
function setStep(n){ localStorage.setItem(STORE.STEP, String(Number(n)||0)); }

function getStartTs(){ return Number(localStorage.getItem(STORE.START_TS) || '0'); }
function setStartTs(ts){ localStorage.setItem(STORE.START_TS, String(Number(ts)||0)); }

function getArr(key){
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}
function setArr(key, arr){
  localStorage.setItem(key, JSON.stringify(arr || []));
}

function msToClock(ms){
  ms = Math.max(0, Number(ms)||0);
  const totalSec = Math.floor(ms/1000);
  const m = Math.floor(totalSec/60);
  const s = totalSec%60;
  const mm = String(m).padStart(2,'0');
  const ss = String(s).padStart(2,'0');
  return `${mm}:${ss}`;
}

function now(){ return Date.now(); }

function ensureStart(){
  if (!getStartTs()){
    const t = now();
    setStartTs(t);
    setArr(STORE.CHECKPOINTS, []);
    setArr(STORE.SPLITS, []);
  }
}

// ====== Puzzles ======
// Designed to be easy + non-CS friendly (visual multiple-choice).
// Each correct pick unlocks the next location hint text you provided.
const STEPS = {
  1: {
    title: 'Clue 1 · Warm-up Riddle',
    prompt: 'The preview is you cannot use you brain before a buffet with a lagoon view:',
    type: 'mcq',
    options: [
      { id: 'library', label: '📚 + 😼' },
      { id: 'lakeside', label: '🍽️ + 🌊' },
      { id: 'gym', label: '🏋️ + 👻' },
      { id: 'lab', label: '🧪' },
    ],
    correct: ['lakeside'],
    nextHint: 'Head to **Lakeside Dining Hall**. Find the slime poster with the next QR (high-traffic entrance area).'
  },
  2: {
    title: 'Clue 2 · Pattern Match',
    prompt: 'This may not bring you fame but its what took to make this game:',
    type: 'mcq',
    options: [
      { id: 'art', label: '🎨' },
      { id: 'it', label: '💻 + 📟' },
      { id: 'theater', label: '🎭' },
      { id: 'pool', label: '🏊' },
    ],
    correct: ['it'],
    nextHint: 'Go to the **IT Building**. Find the slime poster + QR near a main hallway / lobby.'
  },
  3: {
    title: 'Clue 3 · “Many Branches”',
    prompt: 'A sole discipline for the long-run will not be enough:”',
    type: 'mcq',
    options: [
      { id: 'iab', label: '🌳 + 📚' },
      { id: 'dining', label: '🍽️' },
      { id: 'union', label: '🏛️ + 💸' },
      { id: 'parking', label: '🚗 + 📥' },
    ],
    correct: ['iab'],
    nextHint: 'Go to the **Interdisciplinary Academic Building (IAB)**. Find the final slime poster + QR.'
  },
  4: {
    title: 'Clue 4 · Final Check',
    prompt: 'You made it! Thank you for playing & we hope to collab with you at the club!',
    type: 'mcq',
    options: [
      { id: 'done', label: '🏁' },
      { id: 'sleep', label: '😴' },
      { id: 'again', label: '🔁' },
      { id: 'lost', label: '❓' },
    ],
    correct: ['done'],
    nextHint: 'You’re done! Tap **Finish** and head back to the ACM table to claim your prize.'
  },
};

function renderTeam(){
  const el = $('teamLabel');
  if (!el) return;
  const t = getTeam();
  el.textContent = t ? `Team: ${t}` : 'No team saved yet — go to the homepage first.';
}

function renderProgress(current){
  const row = $('progressRow');
  if (!row) return;
  const total = Object.keys(STEPS).length;
  row.innerHTML = '';
  for (let i=1;i<=total;i++){
    const dot = document.createElement('div');
    dot.className = 'dot' + (i<current ? ' done' : (i===current?' now':''));
    dot.title = `Clue ${i}`;
    row.appendChild(dot);
  }
}

function renderMcq(step){
  const body = $('pBody');
  body.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'mcqGrid';

  step.options.forEach(opt=>{
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mcqBtn';
    const face = document.createElement('div');
    face.className = 'mcqEmoji';
    face.textContent = opt.label; // render full label at uniform size
    btn.appendChild(face);

    btn.addEventListener('click', ()=>{
      // validate directly using selected option id (no text input)
      checkAnswer(step, opt.id);
    });
    grid.appendChild(btn);
  });

  body.appendChild(grid);

  // Hide the “type answer” UI for mcq, but keep it for accessibility (screen readers / manual entry).
  const ansWrap = $('answerWrap');
  if (ansWrap) ansWrap.style.display = 'none';

  // Hide the redundant Unlock button for MCQ (selection unlocks immediately)
  const unlock = $('unlock');
  if (unlock) unlock.style.display = 'none';
}

function markdownLite(s){
  // bold **text**
  return (s||'').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function recordSplit(stepNum) {
  ensureStart();

  const idx = Number(stepNum) - 1;
  if (idx < 0) return;

  const checkpoints = getArr(STORE.CHECKPOINTS);
  const splits = getArr(STORE.SPLITS);

  // ✅ prevent double-record for the same step
  if (splits[idx] != null) return;

  const t = now();
  const start = getStartTs();
  const prev = (idx === 0)
    ? start
    : (Number(checkpoints[idx - 1]) || start);

  const split = t - prev;

  // ✅ write by index so step 1 always lives at index 0, etc.
  checkpoints[idx] = t;
  splits[idx] = split;

  setArr(STORE.CHECKPOINTS, checkpoints);
  setArr(STORE.SPLITS, splits);
}


function checkAnswer(step, selectedId){
  let raw = '';
  if (selectedId != null) raw = String(selectedId).toLowerCase();
  else raw = ($('answer')?.value || '').trim().toLowerCase();
  const ok = step.correct.map(x=>String(x).toLowerCase()).includes(raw);

  const out = $('result');
  if (!out) return;

  if (!raw && step.type === 'mcq'){
    out.innerHTML = `<div class="bad">Pick an option first.</div>`;
    return;
  }

  if (!ok){
    out.innerHTML = `<div class="bad">Not quite — try again.</div>`;
    return;
  }
  document.querySelectorAll('.mcqBtn').forEach(b => b.disabled = true);


  const stepNum = Number(($('pBody')?.dataset.step)||0) || inferStepFromPath();
  recordSplit(stepNum);
  setStep(Math.max(getStep(), stepNum));

  const nextUrl = stepNum < 4 ? `../hunt/${stepNum+1}.html` : `../hunt/done.html`;
  out.innerHTML = `
    <div class="good">
      <div class="hintBox">${markdownLite(step.nextHint)}</div>
      <div class="tiny" style="margin-top:10px">Split time: <strong>${msToClock(getArr(STORE.SPLITS).slice(-1)[0] || 0)}</strong></div>
      <div class="actions" style="margin-top:12px">
        ${stepNum < 4 ? `<a class="btn" href="${nextUrl}">I scanned the next QR →</a>` : `<a class="btn" href="${nextUrl}">Finish →</a>`}
        <a class="btn secondary" href="../index.html">Home</a>
      </div>
    </div>
  `;

  // Disable inputs
  const unlock = $('unlock');
  if (unlock) unlock.disabled = true;
}

function inferStepFromPath(){
  const m = (location.pathname||'').match(/\/hunt\/(\d+)\.html$/);
  return m ? Number(m[1]) : 0;
}

// ===== Leaderboard submission (Google Form) =====
function submitToGoogleForm(payload){
  if (!CONFIG.leaderboardEnabled) return Promise.resolve({skipped:true});
  if (!CONFIG.googleFormAction) return Promise.resolve({skipped:true, reason:'No googleFormAction configured'});
  const e = CONFIG.formEntries || {};
  const required = [e.team,e.totalMs,e.s1Ms,e.s2Ms,e.s3Ms,e.s4Ms].every(Boolean);
  if (!required) return Promise.resolve({skipped:true, reason:'Missing form entry IDs'});

  // Create a hidden iframe + form submit (works cross-origin without CORS)
  return new Promise((resolve)=>{
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe_submit';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.action = CONFIG.googleFormAction;
    form.method = 'POST';
    form.target = iframe.name;

    function add(name, value){
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = String(value ?? '');
      form.appendChild(input);
    }

    add(e.team, payload.team);
    add(e.totalMs, payload.totalMs);
    add(e.s1Ms, payload.splits[0]||0);
    add(e.s2Ms, payload.splits[1]||0);
    add(e.s3Ms, payload.splits[2]||0);
    add(e.s4Ms, payload.splits[3]||0);

    document.body.appendChild(form);

    // Resolve soon after submit (Google won't give a clean callback)
    form.submit();
    setTimeout(()=>{
      form.remove();
      iframe.remove();
      resolve({ok:true});
    }, 600);
  });
}

// ===== Leaderboard read (OpenSheet) =====
async function fetchLeaderboard(){
  if (!CONFIG.leaderboardEnabled) return [];
  if (!CONFIG.openSheetUrl) return [];

  const res = await fetch(CONFIG.openSheetUrl, { cache: 'no-store' });
  if (!res.ok) return [];
  const rows = await res.json();

  // Expect columns: team, totalMs, s1Ms, s2Ms, s3Ms, s4Ms, timestamp (any order is fine)
  const normalized = rows.map(r=>({
    team: (r.team || r.Team || r['Team name'] || '').toString().trim(),
    totalMs: Number(r.totalMs || r.TotalMs || r.total || r.Total || 0),
    s1Ms: Number(r.s1Ms || r.S1Ms || r.split1 || r.Split1 || 0),
    s2Ms: Number(r.s2Ms || r.S2Ms || r.split2 || r.Split2 || 0),
    s3Ms: Number(r.s3Ms || r.S3Ms || r.split3 || r.Split3 || 0),
    s4Ms: Number(r.s4Ms || r.S4Ms || r.split4 || r.Split4 || 0),
  })).filter(x=>x.team);

  normalized.sort((a,b)=>a.totalMs-b.totalMs);
  return normalized.slice(0, CONFIG.leaderboardLimit);
}

async function renderLeaderboard(){
  const host = $('leaderboard');
  if (!host) return;

  if (!CONFIG.leaderboardEnabled){
    host.innerHTML = `<div class="tiny">Leaderboard disabled (static mode).</div>`;
    return;
  }

  // Check if URLs are configured
  if (!CONFIG.googleFormAction || !CONFIG.openSheetUrl){
    host.innerHTML = `<div class="tiny" style="background:#fff4e6;padding:12px;border-radius:12px;border:2px solid #ff8c00;">⚙️ <strong>Setup Required:</strong> Configure Google Form and Sheet URLs in app.js to enable live leaderboard.</div>`;
    return;
  }

  host.innerHTML = `<div class="tiny">Loading leaderboard…</div>`;
  let rows = [];
  try { rows = await fetchLeaderboard(); }
  catch { rows = []; }

  if (!rows.length){
    host.innerHTML = `<div class="tiny" style="background:#f0f9ff;padding:12px;border-radius:12px;border:2px solid #00a7ff;">📊 No submissions yet. Be the first to complete the hunt!</div>`;
    return;
  }

  const table = document.createElement('table');
  table.className = 'table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th><th>Team</th><th>Split 1</th><th>Split 2</th><th>Split 3</th><th>Split 4</th><th>Total</th>
      </tr>
    </thead>
  `;
  const tb = document.createElement('tbody');

  rows.forEach((r, idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${escapeHtml(r.team)}</td>
      <td>${msToClock(r.s1Ms)}</td>
      <td>${msToClock(r.s2Ms)}</td>
      <td>${msToClock(r.s3Ms)}</td>
      <td>${msToClock(r.s4Ms)}</td>
      <td><strong>${msToClock(r.totalMs)}</strong></td>
    `;
    tb.appendChild(tr);
  });

  table.appendChild(tb);
  host.innerHTML = '';
  host.appendChild(table);
}

function escapeHtml(s){
  return String(s||'').replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
}

// ===== Campus Map =====
function renderCampusMap(){
  const host = $('campusMap');
  if (!host) return;

  // SVG campus map with corrected Georgia Southern layout
  const svg = `
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" style="width:100%; max-width:700px; margin:0 auto; display:block;">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
        </filter>
      </defs>
      
      <!-- Background with subtle gradient -->
      <rect width="800" height="600" fill="#f8fcf8"/>
      <rect width="800" height="600" fill="url(#grassGradient)"/>
      <defs>
        <linearGradient id="grassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f0f8f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e8f5e8;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Main roads forming + shape -->
      <path d="M 50 295 L 750 295" stroke="#c9b896" stroke-width="14" fill="none" opacity="0.5"/>
      <path d="M 400 50 L 400 550" stroke="#c9b896" stroke-width="12" fill="none" opacity="0.5"/>
      
      <!-- Green spaces with trees clusters -->
      <ellipse cx="200" cy="150" rx="60" ry="45" fill="#90d050" opacity="0.15"/>
      <ellipse cx="650" cy="450" rx="70" ry="50" fill="#90d050" opacity="0.15"/>
      
      <!-- Scattered trees for realism -->
      <circle cx="180" cy="140" r="14" fill="#6ba832" opacity="0.5"/>
      <circle cx="220" cy="155" r="16" fill="#78b83e" opacity="0.5"/>
      <circle cx="195" cy="175" r="12" fill="#6ba832" opacity="0.5"/>
      <circle cx="630" cy="440" r="18" fill="#6ba832" opacity="0.5"/>
      <circle cx="670" cy="460" r="14" fill="#78b83e" opacity="0.5"/>
      <circle cx="700" cy="420" r="13" fill="#6ba832" opacity="0.5"/>
      <circle cx="520" cy="180" r="15" fill="#78b83e" opacity="0.5"/>
      
      <!-- Lake (left side, replacing Hanner position) -->
      <path d="M 100 320 Q 140 290, 200 300 Q 250 310, 260 350 Q 250 390, 200 400 Q 140 410, 110 380 Q 80 350, 100 320 Z" 
            fill="#87ceeb" stroke="#5a9fb5" stroke-width="2" opacity="0.85" filter="url(#shadow)"/>
      <text x="175" y="355" text-anchor="middle" font-size="13" font-weight="600" fill="#4a7a8c" opacity="0.8">Lake</text>
      
      <!-- Water ripple effect -->
      <ellipse cx="160" cy="340" rx="25" ry="12" fill="white" opacity="0.2"/>
      <ellipse cx="200" cy="370" rx="20" ry="10" fill="white" opacity="0.15"/>
      
      <!-- Rotunda - right before Russell Union (far middle right) -->
      <g filter="url(#shadow)">
        <circle cx="560" cy="295" r="38" fill="#90d050" stroke="#0b3b13" stroke-width="3" opacity="0.7"/>
        <circle cx="560" cy="295" r="28" fill="none" stroke="#fff" stroke-width="2" opacity="0.4"/>
        <text x="560" y="305" text-anchor="middle" font-size="18">⭕</text>
      </g>
      <text x="560" y="345" text-anchor="middle" font-size="11" font-weight="600" fill="#2c2c2c">Rotunda</text>
      
      <!-- START: Russell Union (far middle right) -->
      <g class="map-building start" filter="url(#shadow)">
        <path d="M 645 265 L 745 265 L 745 330 L 645 330 Z" fill="#ff6f00" stroke="#141414" stroke-width="2.5"/>
        <path d="M 640 265 L 695 245 L 750 265 Z" fill="#d95f00" stroke="#141414" stroke-width="2"/>
        <rect x="675" y="280" width="15" height="25" fill="#8b4000" opacity="0.6"/>
        <rect x="705" y="280" width="15" height="25" fill="#8b4000" opacity="0.6"/>
        <text x="695" y="302" text-anchor="middle" font-size="24" fill="white">🏛️</text>
        <text x="695" y="320" text-anchor="middle" font-size="9" font-weight="bold" fill="white">START</text>
      </g>
      <text x="695" y="350" text-anchor="middle" font-size="12" font-weight="700" fill="#2c2c2c">Russell Union</text>
      
      <!-- HUNT STOP 1: Lakeside Dining (right of lake) -->
      <g class="map-building hunt" filter="url(#shadow)">
        <path d="M 290 310 L 385 310 L 385 350 L 335 350 L 335 390 L 290 390 Z" 
              fill="#6bd425" stroke="#0b3b13" stroke-width="2.5"/>
        <rect x="300" y="320" width="12" height="18" fill="#fff" opacity="0.5"/>
        <rect x="320" y="320" width="12" height="18" fill="#fff" opacity="0.5"/>
        <rect x="340" y="320" width="12" height="18" fill="#fff" opacity="0.5"/>
        <text x="335" y="345" text-anchor="middle" font-size="24">🍽️</text>
        <text x="335" y="375" text-anchor="middle" font-size="9" font-weight="bold" fill="#0b3b13">STOP 1</text>
      </g>
      <text x="335" y="410" text-anchor="middle" font-size="12" font-weight="700" fill="#2c2c2c">Lakeside Dining</text>
      
      <!-- Decoy: Henderson Library (upper middle left) -->
      <g class="map-building decoy" opacity="0.45" filter="url(#shadow)">
        <rect x="250" y="120" width="95" height="60" fill="#d4d4d4" stroke="#888" stroke-width="2" rx="3"/>
        <path d="M 245 120 L 297 100 L 350 120 Z" fill="#b8b8b8" stroke="#888" stroke-width="1.5"/>
        <text x="297" y="156" text-anchor="middle" font-size="22">📚</text>
      </g>
      <text x="297" y="195" text-anchor="middle" font-size="11" fill="#666">Henderson Library</text>
      
      <!-- HUNT STOP 2: IT Building (far left, below Henderson Library) -->
      <g class="map-building hunt" filter="url(#shadow)">
        <rect x="90" y="210" width="110" height="65" fill="#6bd425" stroke="#0b3b13" stroke-width="2.5" rx="4"/>
        <rect x="180" y="230" width="30" height="45" fill="#5fc115" stroke="#0b3b13" stroke-width="2"/>
        <rect x="105" y="220" width="14" height="12" fill="#fff" opacity="0.4"/>
        <rect x="125" y="220" width="14" height="12" fill="#fff" opacity="0.4"/>
        <rect x="145" y="220" width="14" height="12" fill="#fff" opacity="0.4"/>
        <rect x="105" y="250" width="14" height="12" fill="#fff" opacity="0.4"/>
        <rect x="125" y="250" width="14" height="12" fill="#fff" opacity="0.4"/>
        <text x="145" y="248" text-anchor="middle" font-size="24">💻</text>
      </g>
      <text x="145" y="292" text-anchor="middle" font-size="12" font-weight="700" fill="#2c2c2c">IT Building</text>
      
      <!-- HUNT STOP 3: IAB (lower middle) -->
      <g class="map-building hunt" filter="url(#shadow)">
        <path d="M 350 455 L 455 455 L 465 480 L 465 530 L 350 530 Z" 
              fill="#6bd425" stroke="#0b3b13" stroke-width="2.5"/>
        <rect x="365" y="470" width="13" height="15" fill="#fff" opacity="0.4"/>
        <rect x="390" y="470" width="13" height="15" fill="#fff" opacity="0.4"/>
        <rect x="415" y="470" width="13" height="15" fill="#fff" opacity="0.4"/>
        <rect x="440" y="470" width="13" height="15" fill="#fff" opacity="0.4"/>
        <text x="405" y="500" text-anchor="middle" font-size="24">🌳</text>
        <text x="405" y="517" text-anchor="middle" font-size="9" font-weight="bold" fill="#0b3b13">STOP 3</text>
      </g>
      <text x="405" y="550" text-anchor="middle" font-size="12" font-weight="700" fill="#2c2c2c">IAB Building</text>
      
      <!-- Decoy: Stadium (right side, lower) -->
      <g class="map-building decoy" opacity="0.45" filter="url(#shadow)">
        <ellipse cx="640" cy="470" rx="55" ry="45" fill="#d4d4d4" stroke="#888" stroke-width="2"/>
        <rect x="610" y="445" width="60" height="50" fill="#d4d4d4" stroke="#888" stroke-width="2" rx="5"/>
        <text x="640" y="478" text-anchor="middle" font-size="22">🏟️</text>
      </g>
      <text x="640" y="530" text-anchor="middle" font-size="11" fill="#666">Stadium</text>
      
      <!-- FINISH marker -->
      <g class="map-building finish" filter="url(#shadow)">
        <rect x="480" y="410" width="85" height="65" fill="#00a7ff" stroke="#054a73" stroke-width="2.5" rx="8"/>
        <text x="522" y="442" text-anchor="middle" font-size="24">🏁</text>
        <text x="522" y="460" text-anchor="middle" font-size="9" font-weight="bold" fill="white">FINISH</text>
      </g>
      <text x="522" y="490" text-anchor="middle" font-size="12" font-weight="700" fill="#2c2c2c">Return to ACM</text>
      
      <!-- Legend with better styling -->
      <g transform="translate(30, 545)">
        <rect x="-10" y="-8" width="250" height="45" fill="white" opacity="0.85" rx="6" stroke="#ccc" stroke-width="1"/>
        <rect x="0" y="0" width="18" height="18" fill="#6bd425" stroke="#0b3b13" stroke-width="2" rx="3"/>
        <text x="24" y="14" font-size="12" font-weight="600" fill="#333">Hunt Location</text>
        
        <rect x="140" y="0" width="18" height="18" fill="#d4d4d4" stroke="#888" stroke-width="2" rx="3" opacity="0.6"/>
        <text x="164" y="14" font-size="12" fill="#666">Other Building</text>
      </g>
    </svg>
  `;
  
  host.innerHTML = svg;
}

// ===== Page initializers =====
function initHome(){
  const saveBtn = $('saveTeam');
  if (saveBtn){
    saveBtn.addEventListener('click', ()=>{
      const v = ($('teamInput')?.value || '').trim();
      if (!v){
        $('homeMsg').innerHTML = '<div class="bad">Enter a team name.</div>';
        return;
      }
      setTeam(v);
      $('homeMsg').innerHTML = '<div class="good">Saved! Now scan the starter QR at the ACM table.</div>';
      renderTeam();
    });
  }

  // Pre-fill saved team and auto-save as the user types
  const teamInput = $('teamInput');
  if (teamInput){
    const existing = getTeam();
    if (existing) teamInput.value = existing;
    teamInput.addEventListener('input', ()=>{
      setTeam(teamInput.value || '');
      renderTeam();
    });
  }

  renderTeam();
  renderLeaderboard();
  renderCampusMap();
  
  // Auto-refresh leaderboard every 30 seconds if enabled
  if (CONFIG.leaderboardEnabled && CONFIG.leaderboardRefreshMs > 0){
    setInterval(()=>{
      renderLeaderboard();
    }, CONFIG.leaderboardRefreshMs);
  }
}

function initClue(stepNum){
  ensureStart();
  renderTeam();
  renderProgress(stepNum);

  const step = STEPS[stepNum];
  $('pTitle').textContent = step.title;
  $('pPrompt').textContent = step.prompt;

  const body = $('pBody');
  body.dataset.step = String(stepNum);

  // Make sure answer UI exists
  let ansWrap = $('answerWrap');
  if (!ansWrap){
    ansWrap = document.createElement('div');
    ansWrap.id = 'answerWrap';
    ansWrap.style.display = 'none';
    // Insert into DOM safely even if page doesn't define it
    // Place near body end; it's hidden for MCQ anyway
    document.body.appendChild(ansWrap);
  }
  if (ansWrap){
    // Ensure a hidden input exists for storing the selection
    let ans = $('answer');
    if (!ans){
      ans = document.createElement('input');
      ans.type = 'text';
      ans.id = 'answer';
      ans.autocomplete = 'off';
      ans.inputMode = 'text';
      ans.placeholder = 'Type answer or use buttons above';
      ansWrap.appendChild(ans);
    }
    ansWrap.style.display = '';
  }

  // Render puzzle type
  if (step.type === 'mcq') renderMcq(step);

  const unlock = $('unlock');
  if (unlock){
    unlock.addEventListener('click', ()=>checkAnswer(step));
  }
}

async function initDone() {
  renderTeam();

  // ✅ only first 4 splits count, always numeric
  const splitsRaw = getArr(STORE.SPLITS);
  const splits = splitsRaw.slice(0, 4).map(v => Number(v) || 0);
  const totalMs = splits.reduce((sum, v) => sum + v, 0);

  const el = $('finalTimes');
  if (el) {
    el.innerHTML = `
      <div class="times">
        <div>Split 1: <strong>${msToClock(splits[0] || 0)}</strong></div>
        <div>Split 2: <strong>${msToClock(splits[1] || 0)}</strong></div>
        <div>Split 3: <strong>${msToClock(splits[2] || 0)}</strong></div>
        <div>Split 4: <strong>${msToClock(splits[3] || 0)}</strong></div>
        <div class="total">Total: <strong>${msToClock(totalMs)}</strong></div>
      </div>
    `;
  }

  const team = getTeam() || 'Unknown';
  const payload = { team, splits, totalMs };

  const status = $('submitStatus');
  if (status) {
    if (!CONFIG.leaderboardEnabled) {
      status.innerHTML = `<div class="tiny">Leaderboard disabled. Show this screen to ACM staff to claim your prize.</div>`;
    } else {
      status.innerHTML = `<div class="tiny">Submitting…</div>`;
      try {
        await submitToGoogleForm(payload);
        status.innerHTML = `<div class="good">Submitted to leaderboard!</div>`;
      } catch {
        status.innerHTML = `<div class="bad">Couldn’t auto-submit. Show this screen to ACM staff.</div>`;
      }
    }
  }
}


document.addEventListener('DOMContentLoaded', ()=>{
  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'clue1') initClue(1);
  if (page === 'clue2') initClue(2);
  if (page === 'clue3') initClue(3);
  if (page === 'clue4') initClue(4);
  if (page === 'done') initDone();
});
