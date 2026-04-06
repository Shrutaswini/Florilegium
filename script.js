/* ═══════════════════════════════════════════
   FLORILEGIUM — script.js
   ═══════════════════════════════════════════ */

const flowerMap = {
  Longing:      "images/bluebigflower.png",
  Stillness:    "images/lightblue.png",
  Anticipation: "images/yellowtallflower.png",
  Melancholy:   "images/darkblueflower.png",
  Elation:      "images/yellowblueflower.png",
  Grief:        "images/whiteflower2.png",
  Tenderness:   "images/pink tulip.png",
  Unease:       "images/smallblueflower.png",
  Wonder:       "images/purpleflower.png",
  Resilience:   "images/greenwhiteflower.png",
  Desire:       "images/blueflower2.png",
  Awe:          "images/tallerblueflower.png",
  Isolation:    "images/whiteflower.png",
  Blooming:     "images/daisy.png",
  Decay:        "images/yellowsmallflower.png"
};

const allFlowerImages = Object.values(flowerMap);

const emotions = [
  { name: "Longing",      prompts: ["distant unnamed shore",     "waiting without arrival",     "unfinished sentences linger"] },
  { name: "Stillness",    prompts: ["silence between moments",   "heavy sigh escaping",         "unmoving afternoon air"] },
  { name: "Anticipation", prompts: ["something almost arriving", "breath held hoping",          "the next beginning"] },
  { name: "Melancholy",   prompts: ["gentle unnamed sorrow",     "letter never received",       "slowly fading light"] },
  { name: "Elation",      prompts: ["an uncontained joy",        "bursting into brightness",    "rays shining outward"] },
  { name: "Grief",        prompts: ["what once stayed",          "futile search echoing",       "shaped like quiet absence"] },
  { name: "Tenderness",   prompts: ["pink marshmallow heart",    "soft hands playing",          "holding without breaking"] },
  { name: "Unease",       prompts: ["cold hands fidgeting",      "shifting underfoot softly",   "something not aligning"] },
  { name: "Wonder",       prompts: ["gaze held open",            "something newly seen",        "beyond what names"] },
  { name: "Resilience",   prompts: ["roots still holding",       "quiet inner return",          "bending without breaking"] },
  { name: "Desire",       prompts: ["pulling toward warmth",     "charged with craving",        "reaching with urgency"] },
  { name: "Awe",          prompts: ["vastness pressing gently",  "something larger watching",   "sky too wide open"] },
  { name: "Isolation",    prompts: ["self enclosed softly",      "distance without echo",       "friends with absence"] },
  { name: "Blooming",     prompts: ["petals opening slowly",     "flowers smiling gently",      "unfolding into light"] },
  { name: "Decay",        prompts: ["falling into earth",        "time touching matter",        "age turning inward"] }
];

// ── Supabase ──────────────────────────────────
const SUPABASE_URL  = "https://tnvpqjxdwavyxcgdhghj.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRudnBxanhkd2F2eXhjZ2RoZ2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDc0MTgsImV4cCI6MjA5MDM4MzQxOH0.JkWJsVvwx_32BJRc9p_mMGKOTtY-cHePvaLIacXhOm0";

let supabaseClient = null;

function initSupabase() {
  if (typeof window.supabase === "undefined") {
    console.warn("Supabase SDK not loaded — using localStorage fallback");
    return;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  console.log("✅ Supabase connected");
}

// ── Page router ───────────────────────────────
window.onload = async function () {
  const path = window.location.pathname;
  initSupabase();
  spawnFloatingFlowers();

  if      (path.endsWith("create.html")) { loadEmotion(); }
  else if (path.endsWith("write.html"))  { loadWritingPage(); }
  else if (path.endsWith("card.html"))   { loadCardPage(); }
  // garden.html and index.html both load the garden
  if (!path.endsWith("write.html") && !path.endsWith("create.html")) {
    await loadGardenFromDB();
  }
};

// ── DOMContentLoaded: instant localStorage fallback ─
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (!path.endsWith("card.html") && !path.endsWith("write.html") && !path.endsWith("create.html")) {
    const container = document.getElementById("gardenContainer");
    if (container) {
      const garden = JSON.parse(localStorage.getItem("gardenArchive")) || [];
      if (garden.length > 0) renderGarden(garden, false);
    }
  }
});

// ── Ambient floating flowers (all pages) ─────
function spawnFloatingFlowers() {
  
  if (window.location.pathname.endsWith("garden.html")) return;

  const layer = document.createElement("div");
  layer.id = "floatingFlowers";
  document.body.appendChild(layer);

  const COUNT = 9;
  for (let i = 0; i < COUNT; i++) {
    const img      = document.createElement("img");
    const src      = allFlowerImages[Math.floor(Math.random() * allFlowerImages.length)];
    const size     = 28 + Math.random() * 28;
    const leftPct  = Math.random() * 95;
    const duration = 14 + Math.random() * 16;
    const delay    = -(Math.random() * duration);
    const rot      = (Math.random() - 0.5) * 60;
    img.src = src;
    img.className = "float-flower";
    img.style.cssText = `
      width: ${size}px; height: ${size}px; left: ${leftPct}%;
      --dur: ${duration}s; --delay: ${delay}s; --rot: ${rot}deg;
      --sway-offset: ${Math.random() * 2}s; object-fit: contain;
    `;
    layer.appendChild(img);
  }
}

// ── Nav ───────────────────────────────────────
function start()  { window.location.href = "create.html"; }
function goHome() { window.location.href = "index.html"; }

// ── Create page ───────────────────────────────
function loadEmotion() {
  const random   = Math.floor(Math.random() * emotions.length);
  const selected = emotions[random];
  document.getElementById("emotion").innerText = selected.name;
  localStorage.setItem("currentEmotion", selected.name);
  document.getElementById("p0").innerText = selected.prompts[0];
  document.getElementById("p1").innerText = selected.prompts[1];
  document.getElementById("p2").innerText = selected.prompts[2];
  localStorage.setItem("prompt0", selected.prompts[0]);
  localStorage.setItem("prompt1", selected.prompts[1]);
  localStorage.setItem("prompt2", selected.prompts[2]);
}

function selectPrompt(index) {
  const promptText = localStorage.getItem("prompt" + index);
  const emotion    = localStorage.getItem("currentEmotion");
  window.location.href =
    `write.html?emotion=${encodeURIComponent(emotion)}&prompt=${encodeURIComponent(promptText)}`;
}

// ── Write page ────────────────────────────────
function loadWritingPage() {
  const params  = new URLSearchParams(window.location.search);
  const emotion = params.get("emotion");
  const prompt  = params.get("prompt");
  document.getElementById("emotion").innerText = "Emotion: " + (emotion || "Missing");
  document.getElementById("prompt").innerText  = "Prompt: "  + (prompt  || "Missing");
}

function validatePoem() {
  const poem    = document.getElementById("poem").value;
  const message = document.getElementById("message");
  const params  = new URLSearchParams(window.location.search);
  const prompt  = params.get("prompt");
  const emotion = params.get("emotion");

  const words = poem.trim().split(/\s+/);
  if (words.length < 15) { message.innerText = "Your poem must have at least 15 words."; return; }
  const lines = poem.trim().split("\n");
  if (lines.length < 3)  { message.innerText = "Your poem must have at least 3 lines."; return; }
  const promptWords = prompt.split(" ");
  const poemLower   = poem.toLowerCase();
  for (let word of promptWords) {
    if (!poemLower.includes(word.toLowerCase())) {
      message.innerText = `Your poem must include the word: "${word}"`;
      return;
    }
  }
  message.innerText = "Valid poem 🌸";
  setTimeout(() => {
    sessionStorage.removeItem("planted");
    window.location.href =
      `card.html?emotion=${encodeURIComponent(emotion)}&prompt=${encodeURIComponent(prompt)}&poem=${encodeURIComponent(poem)}`;
  }, 1000);
}

// ── Card page ─────────────────────────────────

function loadCardPage() {
  const params     = new URLSearchParams(window.location.search);
  const emotionRaw = params.get("emotion");
  const emotion    = (!emotionRaw || emotionRaw === "null") ? "Unknown" : emotionRaw;
  const prompt     = params.get("prompt") || "";
  const poemRaw    = params.get("poem");
  const poem       = poemRaw ? decodeURIComponent(poemRaw) : "";

  document.getElementById("cardEmotion").innerText = "Emotion: " + emotion;
  document.getElementById("cardPrompt").innerText  = "Prompt: "  + prompt;
  document.getElementById("cardPoem").innerText    = poem;

  if (!poem) { console.warn("⚠️ No poem in URL"); return; }

  const lines = poem.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  let fragment = "";
  if (lines.length >= 3) {
    const start  = Math.floor(Math.random() * (lines.length - 2));
    const length = 2 + Math.floor(Math.random() * 2);
    fragment = lines.slice(start, start + length).join(" / ");
  } else {
    fragment = lines.join(" / ");
  }

  document.getElementById("gardenMessage").innerText = "Your flower is ready to be planted in the garden 🌿";
  document.getElementById("fragment").innerText      = fragment;
  document.getElementById("fragment").dataset.raw    = fragment;
}

// ── Open card popup ───────────────────────────

async function openCardPopup() {
  const params      = new URLSearchParams(window.location.search);
  const poem        = params.get("poem") ? decodeURIComponent(params.get("poem")) : "";
  const emotionRaw  = params.get("emotion");
  const emotion     = (!emotionRaw || emotionRaw === "null") ? "Unknown" : emotionRaw;
  const fragmentEl  = document.getElementById("fragment");
  const fragmentRaw = fragmentEl ? (fragmentEl.dataset.raw || fragmentEl.innerText).trim() : "";
 
  const fragment = fragmentRaw
    .replace(/\bnull\b/gi, "")
    .replace(/\s+\/\s+\/\s+/g, " / ")
    .trim();

  renderPoemToCard(poem);

  if (fragment) {
    await plantFragment(fragment, emotion);
    const tokenImg = document.getElementById("flowerTokenImg");
    tokenImg.src   = flowerMap[emotion] || "images/daisy.png";
    document.getElementById("flowerToken").style.display = "flex";
    triggerFlyAnimation(tokenImg.src);
  }

  document.getElementById("popupFragment").innerText =
    `a trace of ${emotion.toLowerCase()} now lives in the garden ✿`;
  document.getElementById("cardOverlay").classList.remove("hidden");
}

// ── Render poem lines with <br> tags ──────────

function renderPoemToCard(poem) {
  const poemEl = document.getElementById("popupPoem");
  poemEl.innerHTML = "";

  const lines     = poem ? poem.split("\n") : ["(no poem found)"];
  const lineCount = lines.length;
  const wordCount = poem ? poem.trim().split(/\s+/).length : 0;

  let fontSize = 13.5;
  if (lineCount > 8  || wordCount > 60)  fontSize = 12;
  if (lineCount > 12 || wordCount > 90)  fontSize = 10.5;
  if (lineCount > 16 || wordCount > 120) fontSize = 9.5;
  if (lineCount > 20 || wordCount > 150) fontSize = 8.5;

  poemEl.style.fontSize   = fontSize + "px";
  poemEl.style.lineHeight = fontSize > 11 ? "1.85" : "1.65";

  lines.forEach((line, i) => {
    const span = document.createElement("span");
    span.textContent = line;
    poemEl.appendChild(span);
    if (i < lines.length - 1) {
      poemEl.appendChild(document.createElement("br"));
    }
  });
}

// ── Close popup ───────────────────────────────
function closeCard() {
  document.getElementById("cardOverlay").classList.add("hidden");
  const gardenEl = document.getElementById("gardenSection");
  if (gardenEl) {
    setTimeout(() => gardenEl.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }
}

// ── Plant fragment ────────────────────────────
async function plantFragment(fragment, emotion) {
  let garden = JSON.parse(localStorage.getItem("gardenArchive")) || [];
  const alreadyLocal = garden.some(item => item.fragment === fragment);
  if (!alreadyLocal) {
    garden.push({ fragment, emotion });
    localStorage.setItem("gardenArchive", JSON.stringify(garden));
  }
  if (!supabaseClient) { renderGarden(garden, true); return; }

  const { error } = await supabaseClient
    .from("blooms")
    .insert({ fragment, emotion });

  if (error && error.code !== "23505") {
    console.error("Supabase insert error:", error.message);
  } else {
    console.log("✅ Planted:", fragment);
  }
  await loadGardenFromDB();
}

// ── Load garden from Supabase ─────────────────
async function loadGardenFromDB() {
  if (!supabaseClient) {
    const garden = JSON.parse(localStorage.getItem("gardenArchive")) || [];
    renderGarden(garden, false);
    return;
  }
  const { data, error } = await supabaseClient
    .from("blooms")
    .select("fragment, emotion, created_at")
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    console.error("Supabase fetch error:", error.message);
    const garden = JSON.parse(localStorage.getItem("gardenArchive")) || [];
    renderGarden(garden, false);
    return;
  }
  renderGarden(data, false);
}

// ── Render garden ─────────────────────────────

function renderGarden(garden, highlightLast = false) {
  const container = document.getElementById("gardenContainer");
  if (!container) return;
  container.innerHTML = "";

  // Strip bad rows before rendering
  const clean = garden.filter(item =>
    item.emotion && item.emotion !== "null" &&
    item.fragment && item.fragment !== "null"
  );

  if (clean.length === 0) {
    const empty = document.createElement("p");
    empty.className = "garden-empty";
    empty.innerText = "your garden is waiting for its first bloom...";
    container.appendChild(empty);
    return;
  }

  const isScattered = !document.getElementById("gardenSection");

  clean.forEach((item, index) => {
    const isNew = highlightLast && index === clean.length - 1;

    const wrapper = document.createElement("div");
    wrapper.className = "flower-item" + (isNew ? " just-planted" : "");
    wrapper.style.animationDelay = `${index * 0.05}s`;
    wrapper.style.setProperty("--sway-offset", `${(Math.random() * 2).toFixed(2)}s`);

    if (isScattered) {
      const topMin = window.location.pathname.endsWith("garden.html") ? 10 : 4;
      const topMax = window.location.pathname.endsWith("garden.html") ? 80 : 88;
      wrapper.style.left = (4  + Math.random() * 88).toFixed(1) + "%";
      wrapper.style.top  = (topMin + Math.random() * (topMax - topMin)).toFixed(1) + "%";
    }

    const img = document.createElement("img");
    img.src   = flowerMap[item.emotion] || "images/daisy.png";
    img.alt   = item.emotion;

    const tooltip = document.createElement("div");
    tooltip.className = "flower-tooltip";
    tooltip.innerText = `${item.emotion}\n"${item.fragment}"`;

    const label = document.createElement("div");
    label.className = "flower-label";
    label.innerText = item.emotion;

    wrapper.appendChild(tooltip);
    wrapper.appendChild(img);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

// ── Flying flower animation ───────────────────
function triggerFlyAnimation(imgSrc) {
  const gardenEl = document.getElementById("gardenContainer");
  if (!gardenEl) return;
  const rect   = gardenEl.getBoundingClientRect();
  const startX = window.innerWidth  / 2;
  const startY = window.innerHeight / 2;
  const endX   = rect.left + rect.width  / 2;
  const endY   = rect.top  + rect.height / 2;

  const flyImg = document.createElement("img");
  flyImg.src   = imgSrc;
  flyImg.style.cssText = `
    position: fixed; width: 68px; height: 68px;
    object-fit: contain; pointer-events: none; z-index: 2000;
    left: ${startX - 34}px; top: ${startY - 34}px;
    transition: left 0.85s cubic-bezier(0.4,0,0.2,1),
                top  0.85s cubic-bezier(0.4,0,0.2,1),
                opacity 0.85s ease, transform 0.85s ease;
  `;
  document.body.appendChild(flyImg);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    flyImg.style.left      = `${endX - 34}px`;
    flyImg.style.top       = `${endY - 34}px`;
    flyImg.style.opacity   = "0";
    flyImg.style.transform = "scale(0.3)";
  }));
  setTimeout(() => flyImg.remove(), 950);
}/* ═══════════════════════════════════════════
   FLORILEGIUM — script.js
   ═══════════════════════════════════════════ */

const flowerMap = {
  Longing:      "images/bluebigflower.png",
  Stillness:    "images/lightblue.png",
  Anticipation: "images/yellowtallflower.png",
  Melancholy:   "images/darkblueflower.png",
  Elation:      "images/yellowblueflower.png",
  Grief:        "images/whiteflower2.png",
  Tenderness:   "images/pink tulip.png",
  Unease:       "images/smallblueflower.png",
  Wonder:       "images/purpleflower.png",
  Resilience:   "images/greenwhiteflower.png",
  Desire:       "images/blueflower2.png",
  Awe:          "images/tallerblueflower.png",
  Isolation:    "images/whiteflower.png",
  Blooming:     "images/daisy.png",
  Decay:        "images/yellowsmallflower.png"
};

const allFlowerImages = Object.values(flowerMap);

const emotions = [
  { name: "Longing",      prompts: ["distant unnamed shore",     "waiting without arrival",     "unfinished sentences linger"] },
  { name: "Stillness",    prompts: ["silence between moments",   "heavy sigh escaping",         "unmoving afternoon air"] },
  { name: "Anticipation", prompts: ["something almost arriving", "breath held hoping",          "the next beginning"] },
  { name: "Melancholy",   prompts: ["gentle unnamed sorrow",     "letter never received",       "slowly fading light"] },
  { name: "Elation",      prompts: ["an uncontained joy",        "bursting into brightness",    "rays shining outward"] },
  { name: "Grief",        prompts: ["what once stayed",          "futile search echoing",       "shaped like quiet absence"] },
  { name: "Tenderness",   prompts: ["pink marshmallow heart",    "soft hands playing",          "holding without breaking"] },
  { name: "Unease",       prompts: ["cold hands fidgeting",      "shifting underfoot softly",   "something not aligning"] },
  { name: "Wonder",       prompts: ["gaze held open",            "something newly seen",        "beyond what names"] },
  { name: "Resilience",   prompts: ["roots still holding",       "quiet inner return",          "bending without breaking"] },
  { name: "Desire",       prompts: ["pulling toward warmth",     "charged with craving",        "reaching with urgency"] },
  { name: "Awe",          prompts: ["vastness pressing gently",  "something larger watching",   "sky too wide open"] },
  { name: "Isolation",    prompts: ["self enclosed softly",      "distance without echo",       "friends with absence"] },
  { name: "Blooming",     prompts: ["petals opening slowly",     "flowers smiling gently",      "unfolding into light"] },
  { name: "Decay",        prompts: ["falling into earth",        "time touching matter",        "age turning inward"] }
];

// ── Supabase ──────────────────────────────────
// Named supabaseClient (not supabase) to avoid clash with
// the global `supabase` object injected by the CDN SDK script
const SUPABASE_URL  = "https://tnvpqjxdwavyxcgdhghj.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRudnBxanhkd2F2eXhjZ2RoZ2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDc0MTgsImV4cCI6MjA5MDM4MzQxOH0.JkWJsVvwx_32BJRc9p_mMGKOTtY-cHePvaLIacXhOm0";

let supabaseClient = null;   // ← renamed from `supabase`

function initSupabase() {
  if (typeof window.supabase === "undefined") {
    console.warn("Supabase SDK not loaded — using localStorage fallback");
    return;
  }
  // window.supabase is the SDK namespace; .createClient() gives us our instance
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  console.log("✅ Supabase connected");
}

// ── Page router ───────────────────────────────
window.onload = async function () {
  const path = window.location.pathname;

  initSupabase();
  spawnFloatingFlowers();

  if      (path.endsWith("create.html")) { loadEmotion(); }
  else if (path.endsWith("write.html"))  { loadWritingPage(); }
  else if (path.endsWith("card.html"))   { loadCardPage(); }

  if (!path.endsWith("write.html") && !path.endsWith("create.html")) {
    await loadGardenFromDB();
  }
};

// ── DOMContentLoaded: instant localStorage garden ─
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (!path.endsWith("card.html") && !path.endsWith("write.html") && !path.endsWith("create.html")) {
    const container = document.getElementById("gardenContainer");
    if (container) {
      const garden = JSON.parse(localStorage.getItem("gardenArchive")) || [];
      if (garden.length > 0) renderGarden(garden, false);
    }
  }
});

// ── Ambient floating flowers ──────────────────
function spawnFloatingFlowers() {
  const layer = document.createElement("div");
  layer.id = "floatingFlowers";
  document.body.appendChild(layer);

  const COUNT = 9;
  for (let i = 0; i < COUNT; i++) {
    const img      = document.createElement("img");
    const src      = allFlowerImages[Math.floor(Math.random() * allFlowerImages.length)];
    const size     = 28 + Math.random() * 28;
    const leftPct  = Math.random() * 95;
    const duration = 14 + Math.random() * 16;
    const delay    = -(Math.random() * duration);
    const rot      = (Math.random() - 0.5) * 60;

    img.src = src;
    img.className = "float-flower";
    img.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${leftPct}%;
      --dur: ${duration}s; --delay: ${delay}s;
      --rot: ${rot}deg;
      --sway-offset: ${Math.random() * 2}s;
      object-fit: contain;
    `;
    layer.appendChild(img);
  }
}

// ── Nav ───────────────────────────────────────
function start()  { window.location.href = "create.html"; }
function goHome() { window.location.href = "index.html"; }

// ── Create page ───────────────────────────────
function loadEmotion() {
  const random   = Math.floor(Math.random() * emotions.length);
  const selected = emotions[random];
  document.getElementById("emotion").innerText = selected.name;
  localStorage.setItem("currentEmotion", selected.name);
  document.getElementById("p0").innerText = selected.prompts[0];
  document.getElementById("p1").innerText = selected.prompts[1];
  document.getElementById("p2").innerText = selected.prompts[2];
  localStorage.setItem("prompt0", selected.prompts[0]);
  localStorage.setItem("prompt1", selected.prompts[1]);
  localStorage.setItem("prompt2", selected.prompts[2]);
}

function selectPrompt(index) {
  const promptText = localStorage.getItem("prompt" + index);
  const emotion    = localStorage.getItem("currentEmotion");
  window.location.href =
    `write.html?emotion=${encodeURIComponent(emotion)}&prompt=${encodeURIComponent(promptText)}`;
}

// ── Write page ────────────────────────────────
function loadWritingPage() {
  const params  = new URLSearchParams(window.location.search);
  const emotion = params.get("emotion");
  const prompt  = params.get("prompt");
  document.getElementById("emotion").innerText = "Emotion: " + (emotion || "Missing");
  document.getElementById("prompt").innerText  = "Prompt: "  + (prompt  || "Missing");
}

function validatePoem() {
  const poem    = document.getElementById("poem").value;
  const message = document.getElementById("message");
  const params  = new URLSearchParams(window.location.search);
  const prompt  = params.get("prompt");
  const emotion = params.get("emotion");

  const words = poem.trim().split(/\s+/);
  if (words.length < 15) { message.innerText = "Your poem must have at least 15 words."; return; }

  const lines = poem.trim().split("\n");
  if (lines.length < 3)  { message.innerText = "Your poem must have at least 3 lines."; return; }

  const promptWords = prompt.split(" ");
  const poemLower   = poem.toLowerCase();
  for (let word of promptWords) {
    if (!poemLower.includes(word.toLowerCase())) {
      message.innerText = `Your poem must include the word: "${word}"`;
      return;
    }
  }

  message.innerText = "Valid poem 🌸";
  setTimeout(() => {
    sessionStorage.removeItem("planted");
    window.location.href =
      `card.html?emotion=${encodeURIComponent(emotion)}&prompt=${encodeURIComponent(prompt)}&poem=${encodeURIComponent(poem)}`;
  }, 1000);
}

// ── Card page ─────────────────────────────────
function loadCardPage() {
  const params  = new URLSearchParams(window.location.search);
  const emotion = params.get("emotion") || "Unknown";
  const prompt  = params.get("prompt")  || "";
  const poemRaw = params.get("poem");
  const poem    = poemRaw ? decodeURIComponent(poemRaw) : "";

  document.getElementById("cardEmotion").innerText = "Emotion: " + emotion;
  document.getElementById("cardPrompt").innerText  = "Prompt: "  + prompt;
  document.getElementById("cardPoem").innerText    = poem;

  if (!poem) { console.warn("⚠️ No poem in URL"); return; }

  const lines = poem.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  let fragment = "";
  if (lines.length >= 3) {
    const start  = Math.floor(Math.random() * (lines.length - 2));
    const length = 2 + Math.floor(Math.random() * 2);
    fragment = lines.slice(start, start + length).join(" / ");
  } else {
    fragment = lines.join(" / ");
  }

  document.getElementById("gardenMessage").innerText = "Your flower is ready to be planted in the garden 🌿";
  document.getElementById("fragment").innerText      = fragment;
  document.getElementById("fragment").dataset.raw    = fragment;
}

// ── Open card popup ───────────────────────────
async function openCardPopup() {
  const params     = new URLSearchParams(window.location.search);
  const poem       = params.get("poem")    ? decodeURIComponent(params.get("poem")) : "";
  const emotion    = params.get("emotion") || "Unknown";
  const fragmentEl = document.getElementById("fragment");
  const fragment   = fragmentEl ? (fragmentEl.dataset.raw || fragmentEl.innerText).trim() : "";

  const poemEl = document.getElementById("popupPoem");
  poemEl.innerText = poem || "(no poem found)";
  fitPoemToCard(poemEl, poem);

  if (fragment) {
    await plantFragment(fragment, emotion);
    const tokenImg = document.getElementById("flowerTokenImg");
    tokenImg.src   = flowerMap[emotion] || "images/daisy.png";
    document.getElementById("flowerToken").style.display = "flex";
    triggerFlyAnimation(tokenImg.src);
  }

  document.getElementById("popupFragment").innerText =
    "planted this blossom of emotion in florilegium ✿";
  document.getElementById("cardOverlay").classList.remove("hidden");
}

// ── Font scaling for long poems ───────────────
function fitPoemToCard(poemEl, poem) {
  const lineCount = (poem.match(/\n/g) || []).length + 1;
  const wordCount = poem.trim().split(/\s+/).length;

  let fontSize = 13.5;
  if (lineCount > 8  || wordCount > 60)  fontSize = 12;
  if (lineCount > 12 || wordCount > 90)  fontSize = 10.5;
  if (lineCount > 16 || wordCount > 120) fontSize = 9.5;
  if (lineCount > 20 || wordCount > 150) fontSize = 8.5;

  poemEl.style.fontSize   = fontSize + "px";
  poemEl.style.lineHeight = fontSize > 11 ? "1.9" : "1.7";
}

// ── Close popup ───────────────────────────────
function closeCard() {
  document.getElementById("cardOverlay").classList.add("hidden");
  const gardenEl = document.getElementById("gardenSection");
  if (gardenEl) {
    setTimeout(() => gardenEl.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }
}

// ── Plant fragment ────────────────────────────
async function plantFragment(fragment, emotion) {
  let garden = JSON.parse(localStorage.getItem("gardenArchive")) || [];
  const alreadyLocal = garden.some(item => item.fragment === fragment);
  if (!alreadyLocal) {
    garden.push({ fragment, emotion });
    localStorage.setItem("gardenArchive", JSON.stringify(garden));
  }

  if (!supabaseClient) {       // ← renamed
    renderGarden(garden, true);
    return;
  }

  const { error } = await supabaseClient   // ← renamed
    .from("blooms")
    .insert({ fragment, emotion });

  if (error && error.code !== "23505") {
    console.error("Supabase insert error:", error.message);
  } else {
    console.log("✅ Planted in Supabase:", fragment);
  }

  await loadGardenFromDB();
}

// ── Load garden ───────────────────────────────
async function loadGardenFromDB() {
  if (!supabaseClient) {       // ← renamed
    const garden = JSON.parse(localStorage.getItem("gardenArchive")) || [];
    renderGarden(garden, false);
    return;
  }

  const { data, error } = await supabaseClient   // ← renamed
    .from("blooms")
    .select("fragment, emotion, created_at")
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    console.error("Supabase fetch error:", error.message);
    const garden = JSON.parse(localStorage.getItem("gardenArchive")) || [];
    renderGarden(garden, false);
    return;
  }

  renderGarden(data, false);
}

// ── Render garden ─────────────────────────────
function renderGarden(garden, highlightLast = false) {
  const container = document.getElementById("gardenContainer");
  if (!container) return;

  container.innerHTML = "";

  if (garden.length === 0) {
    const empty = document.createElement("p");
    empty.className = "garden-empty";
    empty.innerText = "your garden is waiting for its first bloom...";
    container.appendChild(empty);
    return;
  }

  const isIndex = !document.getElementById("gardenSection");

  garden.forEach((item, index) => {
    const isNew = highlightLast && index === garden.length - 1;

    const wrapper = document.createElement("div");
    wrapper.className = "flower-item" + (isNew ? " just-planted" : "");
    wrapper.style.animationDelay = `${index * 0.05}s`;
    wrapper.style.setProperty("--sway-offset", `${Math.random() * 2}s`);

    if (isIndex) {
      wrapper.style.left = (4 + Math.random() * 88) + "%";
      wrapper.style.top  = (4 + Math.random() * 88) + "%";
    }

    const img = document.createElement("img");
    img.src   = flowerMap[item.emotion] || "images/daisy.png";
    img.alt   = item.emotion;

    const tooltip = document.createElement("div");
    tooltip.className = "flower-tooltip";
    tooltip.innerText = `${item.emotion}\n"${item.fragment}"`;

    const label = document.createElement("div");
    label.className = "flower-label";
    label.innerText = item.emotion;

    wrapper.appendChild(tooltip);
    wrapper.appendChild(img);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

// ── Flying flower animation ───────────────────
function triggerFlyAnimation(imgSrc) {
  const gardenEl = document.getElementById("gardenContainer");
  if (!gardenEl) return;

  const rect   = gardenEl.getBoundingClientRect();
  const startX = window.innerWidth  / 2;
  const startY = window.innerHeight / 2;
  const endX   = rect.left + rect.width  / 2;
  const endY   = rect.top  + rect.height / 2;

  const flyImg = document.createElement("img");
  flyImg.src   = imgSrc;
  flyImg.style.cssText = `
    position: fixed; width: 68px; height: 68px;
    object-fit: contain; pointer-events: none; z-index: 2000;
    left: ${startX - 34}px; top: ${startY - 34}px;
    transition: left 0.85s cubic-bezier(0.4,0,0.2,1),
                top  0.85s cubic-bezier(0.4,0,0.2,1),
                opacity 0.85s ease, transform 0.85s ease;
  `;
  document.body.appendChild(flyImg);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    flyImg.style.left      = `${endX - 34}px`;
    flyImg.style.top       = `${endY - 34}px`;
    flyImg.style.opacity   = "0";
    flyImg.style.transform = "scale(0.3)";
  }));

  setTimeout(() => flyImg.remove(), 950);
}

// ── Save card as PNG ──────────────────────────
async function saveCard() {
  const cardEl  = document.getElementById("cardDesign");
  const saveBtn = document.querySelector(".cardActions button");
  if (saveBtn) { saveBtn.innerText = "saving…"; saveBtn.disabled = true; }

  try {
    const canvas = await html2canvas(cardEl, {
      useCORS: true, scale: 2, backgroundColor: null, logging: false,
      width: cardEl.offsetWidth, height: cardEl.offsetHeight,
    });
    const link    = document.createElement("a");
    link.download = "florilegium.png";
    link.href     = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Save failed:", err);
    alert("Could not save image. Try a different browser.");
  } finally {
    if (saveBtn) { saveBtn.innerText = "Save"; saveBtn.disabled = false; }
  }
}

// ── Share card as PNG ─────────────────────────
async function shareCard() {
  const cardEl   = document.getElementById("cardDesign");
  const shareBtn = document.querySelectorAll(".cardActions button")[1];
  if (shareBtn) { shareBtn.innerText = "preparing…"; shareBtn.disabled = true; }

  try {
    const canvas = await html2canvas(cardEl, {
      useCORS: true, scale: 2, backgroundColor: null, logging: false,
      width: cardEl.offsetWidth, height: cardEl.offsetHeight,
    });

    canvas.toBlob(async (blob) => {
      const file = new File([blob], "florilegium.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: "Florilegium", text: "a blossom of feeling, planted in the garden ✿", files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title: "Florilegium", text: "a blossom of feeling, planted in the garden ✿", url: window.location.href });
      } else {
        const link = document.createElement("a");
        link.download = "florilegium.png";
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    }, "image/png");
  } catch (err) {
    if (err.name !== "AbortError") { console.error("Share failed:", err); saveCard(); }
  } finally {
    if (shareBtn) { shareBtn.innerText = "Share"; shareBtn.disabled = false; }
  }
}
