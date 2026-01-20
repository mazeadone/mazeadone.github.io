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
  leaderboardEnabled: false,

  // Example: 'https://docs.google.com/forms/d/e/XXXXXXXXXXXX/formResponse'
  googleFormAction: '',

  // Map of form entry IDs. (See README below.)
  formEntries: {
    team: '',     // e.g. 'entry.123456789'
    totalMs: '',  // e.g. 'entry.234567890'
    s1Ms: '',
    s2Ms: '',
    s3Ms: '',
    s4Ms: '',
  },

  // Example OpenSheet URL: `https://opensheet.elk.sh/<SHEET_ID>/<TAB_NAME>`
  openSheetUrl: '',

  // How many rows to show on homepage
  leaderboardLimit: 12,
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
    prompt: 'Pick the picture that best matches: “You can’t use your brain before you’ve indulged in a buffet with a lagoon view.”',
    type: 'mcq',
    options: [
      { id: 'library', label: '📚 A quiet place to read' },
      { id: 'lakeside', label: '🍽️ Buffet + 🌊 lagoon view' },
      { id: 'gym', label: '🏋️ A place to lift' },
      { id: 'lab', label: '🧪 A science lab' },
    ],
    correct: ['lakeside'],
    nextHint: 'Head to **Lakeside Dining Hall**. Find the slime poster with the next QR (high-traffic entrance area).'
  },
  2: {
    title: 'Clue 2 · Pattern Match',
    prompt: 'Pick the option that “belongs” with learning to build apps and implementations (think: coding, labs, tech).',
    type: 'mcq',
    options: [
      { id: 'art', label: '🎨 Art studio' },
      { id: 'it', label: '💻 Computers + labs + tech help' },
      { id: 'theater', label: '🎭 Theater stage' },
      { id: 'pool', label: '🏊 Pool' },
    ],
    correct: ['it'],
    nextHint: 'Go to the **IT Building**. Find the slime poster + QR near a main hallway / lobby.'
  },
  3: {
    title: 'Clue 3 · “Many Branches”',
    prompt: 'Which picture best matches: “A building of many branches of discipline.”',
    type: 'mcq',
    options: [
      { id: 'iab', label: '🌳 Many branches + 📚 many subjects' },
      { id: 'dining', label: '🍽️ Dining hall' },
      { id: 'union', label: '🏛️ Student union' },
      { id: 'parking', label: '🚗 Parking deck' },
    ],
    correct: ['iab'],
    nextHint: 'Go to the **Interdisciplinary Academic Building (IAB)**. Find the final slime poster + QR.'
  },
  4: {
    title: 'Clue 4 · Final Check',
    prompt: 'Last one: pick the icon that means “finish / done / claim prize.”',
    type: 'mcq',
    options: [
      { id: 'done', label: '🏁 Finish line' },
      { id: 'sleep', label: '😴 Nap' },
      { id: 'again', label: '🔁 Restart' },
      { id: 'lost', label: '❓ Confused' },
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
    btn.innerHTML = `<div class="mcqEmoji">${opt.label.split(' ')[0]}</div><div class="mcqText">${opt.label.replace(/^\S+\s*/,'')}</div>`;
    btn.addEventListener('click', ()=>{
      // store selection in hidden input (so we can reuse the same check logic)
      const ans = $('answer');
      if (ans) ans.value = opt.id;
      checkAnswer(step);
    });
    grid.appendChild(btn);
  });

  body.appendChild(grid);

  // Hide the “type answer” UI for mcq, but keep it for accessibility (screen readers / manual entry).
  const ansWrap = $('answerWrap');
  if (ansWrap) ansWrap.style.display = 'none';
}

function markdownLite(s){
  // bold **text**
  return (s||'').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function recordSplit(stepNum){
  ensureStart();
  const checkpoints = getArr(STORE.CHECKPOINTS);
  const splits = getArr(STORE.SPLITS);

  const t = now();
  // last checkpoint is either start_ts or previous checkpoint
  const start = getStartTs();
  const prev = (checkpoints.length>0 ? checkpoints[checkpoints.length-1] : start);
  const split = t - prev;

  checkpoints.push(t);
  splits.push(split);

  setArr(STORE.CHECKPOINTS, checkpoints);
  setArr(STORE.SPLITS, splits);
}

function checkAnswer(step){
  const raw = ($('answer')?.value || '').trim().toLowerCase();
  const ok = step.correct.map(x=>String(x).toLowerCase()).includes(raw);

  const out = $('result');
  if (!out) return;

  if (!ok){
    out.innerHTML = `<div class="bad">Not quite — try again.</div>`;
    return;
  }

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

  host.innerHTML = `<div class="tiny">Loading leaderboard…</div>`;
  let rows = [];
  try { rows = await fetchLeaderboard(); }
  catch { rows = []; }

  if (!rows.length){
    host.innerHTML = `<div class="tiny">No results yet (or sheet not configured).</div>`;
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

  // reset button (optional)
  const resetBtn = $('resetRun');
  if (resetBtn){
    resetBtn.addEventListener('click', ()=>{
      localStorage.removeItem(STORE.STEP);
      localStorage.removeItem(STORE.START_TS);
      localStorage.removeItem(STORE.CHECKPOINTS);
      localStorage.removeItem(STORE.SPLITS);
      $('homeMsg').innerHTML = '<div class="good">Progress reset for this device.</div>';
    });
  }

  renderTeam();
  renderLeaderboard();
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
  const ansWrap = $('answerWrap');
  if (ansWrap) ansWrap.style.display = '';

  // Render puzzle type
  if (step.type === 'mcq') renderMcq(step);

  const unlock = $('unlock');
  if (unlock){
    unlock.addEventListener('click', ()=>checkAnswer(step));
  }
}

async function initDone(){
  renderTeam();
  const splits = getArr(STORE.SPLITS);
  const totalMs = splits.reduce((a,b)=>a+Number(b||0),0);

  const el = $('finalTimes');
  if (el){
    el.innerHTML = `
      <div class="times">
        <div>Split 1: <strong>${msToClock(splits[0]||0)}</strong></div>
        <div>Split 2: <strong>${msToClock(splits[1]||0)}</strong></div>
        <div>Split 3: <strong>${msToClock(splits[2]||0)}</strong></div>
        <div>Split 4: <strong>${msToClock(splits[3]||0)}</strong></div>
        <div class="total">Total: <strong>${msToClock(totalMs)}</strong></div>
      </div>
    `;
  }

  const team = getTeam() || 'Unknown';
  const payload = { team, splits, totalMs };

  const status = $('submitStatus');
  if (status){
    if (!CONFIG.leaderboardEnabled){
      status.innerHTML = `<div class="tiny">Leaderboard disabled. Show this screen to ACM staff to claim your prize.</div>`;
    } else {
      status.innerHTML = `<div class="tiny">Submitting…</div>`;
      try{
        await submitToGoogleForm(payload);
        status.innerHTML = `<div class="good">Submitted to leaderboard!</div>`;
      }catch{
        status.innerHTML = `<div class="bad">Couldn’t auto-submit. Show this screen to ACM staff.</div>`;
      }
    }
  }

  // After finishing, keep progress but allow reset from home.
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
