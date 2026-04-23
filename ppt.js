const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title  = "AI News Automation";
pres.author = "Vaishnavi Gahoi";

// ── Palette ──────────────────────────────────────────────────────────────
const BG       = "080C14";   // deep navy
const SURFACE  = "0F1623";   // card bg
const CARD     = "111827";
const BORDER   = "1A2235";
const ACCENT   = "38BDF8";   // sky blue
const ACCENT2  = "818CF8";   // indigo
const GREEN    = "22C55E";
const RED      = "EF4444";
const YELLOW   = "F59E0B";
const TEXT     = "E2E8F0";
const MUTED    = "64748B";
const WHITE    = "FFFFFF";

const makeShadow = () => ({ type:"outer", blur:8, offset:3, angle:135, color:"000000", opacity:0.25 });

// helper — slide background
function darkBg(slide) {
  slide.background = { color: BG };
  // subtle top accent strip
  slide.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.04, fill:{ color: ACCENT }, line:{ color: ACCENT } });
}

// helper — section label pill
function pill(slide, txt, x, y) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w:1.6, h:0.28, fill:{ color: ACCENT, transparency:85 }, line:{ color: ACCENT }, rectRadius:0.05 });
  slide.addText(txt, { x, y, w:1.6, h:0.28, fontSize:9, bold:true, color: ACCENT, align:"center", valign:"middle", margin:0 });
}

// helper — card box
function card(slide, x, y, w, h, accent) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill:{ color: CARD }, line:{ color: accent || BORDER }, shadow: makeShadow() });
}

// helper — left accent bar on card
function accentBar(slide, x, y, h, color) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w:0.06, h, fill:{ color: color || ACCENT }, line:{ color: color || ACCENT } });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };

  // big decorative "NEWS" text watermark
  s.addText("NEWS", { x:5.2, y:1.2, w:4.5, h:3, fontSize:96, bold:true, color: ACCENT, transparency:88, fontFace:"Trebuchet MS", align:"right" });

  // top strip
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.05, fill:{ color: ACCENT }, line:{ color: ACCENT } });

  // left content block
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:0.8, w:0.08, h:1.6, fill:{ color: ACCENT }, line:{ color: ACCENT } });

  s.addText("MAJOR PROJECT PRESENTATION", { x:0.7, y:0.85, w:7, h:0.35, fontSize:10, bold:true, color: ACCENT, charSpacing:3 });
  s.addText("AI News Automation", { x:0.7, y:1.2, w:7.5, h:1.1, fontSize:44, bold:true, color: WHITE, fontFace:"Trebuchet MS" });
  s.addText("Multi-Category Intelligence Pipeline with Local AI", { x:0.7, y:2.28, w:7, h:0.45, fontSize:16, color: MUTED, italic:true });

  // divider
  s.addShape(pres.shapes.RECTANGLE, { x:0.7, y:2.85, w:4.5, h:0.02, fill:{ color: BORDER }, line:{ color: BORDER } });

  // meta info
  const meta = [
    ["👩‍💻 Presented by", "Vaishnavi Gahoi"],
    ["🏫 Institution",   "Jawaharlal Nehru College of Technology"],
    ["📚 Programme",     "B.Tech — Computer Science & Engineering · 8th Semester"],
    ["👩‍🏫 Guide",         "Mrs. Neelam Singh (HOD, CSE Department)"],
    ["📅 Academic Year", "2025-26"],
  ];
  meta.forEach(([label, val], i) => {
    s.addText(label, { x:0.7, y:3.02 + i*0.32, w:1.9, h:0.28, fontSize:10, color: MUTED, bold:true });
    s.addText(val,   { x:2.65, y:3.02 + i*0.28, w:6.8, h:0.28, fontSize:11, color: TEXT });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Table of Contents
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "OVERVIEW", 0.5, 0.18);
  s.addText("Table of Contents", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  const items = [
    ["01", "Introduction & Problem Statement", ACCENT],
    ["02", "Project Objectives", ACCENT2],
    ["03", "System Architecture", GREEN],
    ["04", "Technology Stack", YELLOW],
    ["05", "Key Features", ACCENT],
    ["06", "Live Demo — Dashboard & Analytics", ACCENT2],
    ["07", "AI Pipeline — How It Works", GREEN],
    ["08", "Multi-Category News Delivery", YELLOW],
    ["09", "REST API", ACCENT],
    ["10", "Results & Observations", GREEN],
    ["11", "Future Scope", ACCENT2],
    ["12", "Conclusion", YELLOW],
  ];

  const col1 = items.slice(0, 6);
  const col2 = items.slice(6);

  [[col1, 0.5], [col2, 5.2]].forEach(([col, startX]) => {
    col.forEach(([num, title, color], i) => {
      const y = 1.28 + i * 0.67;
      card(s, startX, y, 4.4, 0.55, BORDER);
      s.addShape(pres.shapes.RECTANGLE, { x:startX, y, w:0.42, h:0.55, fill:{ color, transparency:80 }, line:{ color } });
      s.addText(num, { x:startX, y, w:0.42, h:0.55, fontSize:13, bold:true, color, align:"center", valign:"middle", margin:0 });
      s.addText(title, { x:startX+0.48, y:y+0.04, w:3.85, h:0.46, fontSize:11, color: TEXT, valign:"middle" });
    });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Introduction & Problem Statement
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "INTRODUCTION", 0.5, 0.18);
  s.addText("Problem Statement", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  // left big stat
  card(s, 0.5, 1.25, 2.8, 3.7, ACCENT);
  accentBar(s, 0.5, 1.25, 3.7);
  s.addText("4.4B", { x:0.65, y:1.5, w:2.55, h:0.85, fontSize:52, bold:true, color: ACCENT, fontFace:"Trebuchet MS", align:"center" });
  s.addText("Internet users worldwide consume news daily", { x:0.65, y:2.32, w:2.55, h:0.45, fontSize:11, color: MUTED, align:"center" });
  s.addShape(pres.shapes.RECTANGLE, { x:0.9, y:2.82, w:2.05, h:0.02, fill:{ color: BORDER }, line:{ color: BORDER } });
  s.addText("The Challenge", { x:0.65, y:2.92, w:2.55, h:0.35, fontSize:13, bold:true, color: TEXT, align:"center" });
  const probs = ["Information overload", "Manual filtering effort", "No personalization", "No AI summarization"];
  probs.forEach((p, i) => {
    s.addText("→  " + p, { x:0.72, y:3.33 + i*0.3, w:2.45, h:0.28, fontSize:10, color: MUTED });
  });

  // right content
  const points = [
    [RED,    "The Problem",    "People are overwhelmed by hundreds of news articles daily across multiple domains — Technology, Finance, Health, Sports, and more. Manual filtering is time-consuming and impractical."],
    [YELLOW, "Existing Gaps",  "Most news apps lack AI-powered summarization, sentiment classification, or personalized delivery. They are platform-dependent and require internet-hosted services."],
    [GREEN,  "Our Solution",   "An automated, locally-hosted pipeline that fetches news from 10 categories, summarizes using a local LLM (Ollama llama3), scores importance, classifies sentiment, and delivers via Telegram and a live web dashboard."],
  ];
  points.forEach(([color, title, body], i) => {
    const y = 1.25 + i * 1.25;
    card(s, 3.55, y, 6.0, 1.12, color);
    accentBar(s, 3.55, y, 1.12, color);
    s.addText(title, { x:3.72, y:y+0.08, w:5.7, h:0.3, fontSize:13, bold:true, color });
    s.addText(body,  { x:3.72, y:y+0.38, w:5.7, h:0.7, fontSize:10, color: MUTED, wrap:true });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 4 — Objectives
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "OBJECTIVES", 0.5, 0.18);
  s.addText("Project Objectives", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  const objs = [
    [ACCENT,  "01", "Multi-Category Fetching",    "Fetch real-time RSS news across 10 categories including AI, Technology, Finance, Health, Space, Sports & more using Google News RSS."],
    [ACCENT2, "02", "Local AI Summarization",      "Use Ollama llama3 running 100% locally (no API key, no cost) to generate 1-2 sentence summaries for every article automatically."],
    [GREEN,   "03", "Sentiment & Scoring",         "Classify every article as Positive, Negative, or Neutral using AI and assign an importance score (1–10) to prioritize breaking news."],
    [YELLOW,  "04", "Multi-Platform Delivery",     "Deliver news through a Telegram bot (instant alerts for high-importance articles) and a rich local web dashboard with filtering and charts."],
    [ACCENT,  "05", "Deduplication & Storage",     "Store all articles in SQLite with GUID-based deduplication so the same article is never processed or delivered twice."],
    [RED,     "06", "REST API & User Preferences", "Expose a REST API for programmatic access and allow users to configure categories, alert thresholds and delivery channels from the UI."],
  ];

  objs.forEach(([color, num, title, body], i) => {
    const col = i % 2 === 0 ? 0.5 : 5.1;
    const row = Math.floor(i / 2);
    const y   = 1.28 + row * 1.42;
    card(s, col, y, 4.35, 1.28, color);
    s.addShape(pres.shapes.RECTANGLE, { x:col, y, w:0.55, h:0.55, fill:{ color, transparency:80 }, line:{ color } });
    s.addText(num, { x:col, y, w:0.55, h:0.55, fontSize:14, bold:true, color, align:"center", valign:"middle", margin:0 });
    s.addText(title, { x:col+0.62, y:y+0.07, w:3.6, h:0.32, fontSize:12, bold:true, color: TEXT });
    s.addText(body,  { x:col+0.08, y:y+0.44, w:4.12, h:0.76, fontSize:10, color: MUTED, wrap:true });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 5 — System Architecture
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "ARCHITECTURE", 0.5, 0.18);
  s.addText("System Architecture", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  // Pipeline flow — 6 boxes with arrows
  const stages = [
    [ACCENT,  "RSS\nFetcher",   "10 categories\nGoogle News RSS"],
    [ACCENT2, "Dedup\nFilter",  "SQLite GUID\ncheck"],
    [GREEN,   "Ollama\nllama3", "Summarize &\nScore & Sentiment"],
    [YELLOW,  "SQLite\nDB",     "Persist articles\nwith metadata"],
    [ACCENT,  "Telegram\nBot",  "High-importance\nalerts"],
    [ACCENT2, "Flask\nDashboard","Web UI +\nREST API"],
  ];

  stages.forEach(([color, title, sub], i) => {
    const x = 0.38 + i * 1.55;
    // box
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.3, w:1.3, h:1.1, fill:{ color, transparency:82 }, line:{ color }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.3, w:1.3, h:0.08, fill:{ color }, line:{ color } });
    s.addText(title, { x, y:1.38, w:1.3, h:0.58, fontSize:11, bold:true, color: WHITE, align:"center", valign:"middle", margin:0 });
    s.addText(sub,   { x, y:1.96, w:1.3, h:0.42, fontSize:8.5, color: MUTED, align:"center", valign:"middle", margin:2 });
    // arrow (except last)
    if (i < stages.length - 1) {
      s.addShape(pres.shapes.RECTANGLE, { x:x+1.3, y:1.81, w:0.22, h:0.04, fill:{ color: MUTED }, line:{ color: MUTED } });
      s.addText("▶", { x:x+1.44, y:1.73, w:0.14, h:0.2, fontSize:9, color: MUTED, align:"center" });
    }
  });

  // Module breakdown below
  s.addText("Module Breakdown", { x:0.5, y:2.7, w:9, h:0.35, fontSize:14, bold:true, color: TEXT });

  const modules = [
    ["config/settings.py",         "Central config — RSS URLs, Ollama model, thresholds"],
    ["fetcher/rss_fetcher.py",     "Fetches & parses RSS feeds per category"],
    ["summarizer/ollama_summarizer.py", "LLM calls for summary, sentiment, importance"],
    ["database/db.py",             "SQLite CRUD — insert, dedup, query, preferences"],
    ["delivery/telegram_sender.py","Sends alerts & daily digest to Telegram"],
    ["dashboard/app.py",           "Flask routes, REST API, pipeline trigger"],
  ];

  modules.forEach(([file, desc], i) => {
    const col = i % 2 === 0 ? 0.5 : 5.1;
    const y   = 3.12 + Math.floor(i/2) * 0.62;
    s.addShape(pres.shapes.RECTANGLE, { x:col, y, w:4.35, h:0.52, fill:{ color: CARD }, line:{ color: BORDER } });
    s.addShape(pres.shapes.RECTANGLE, { x:col, y, w:0.05, h:0.52, fill:{ color: ACCENT }, line:{ color: ACCENT } });
    s.addText(file, { x:col+0.12, y:y+0.04, w:4.1, h:0.22, fontSize:10, bold:true, color: ACCENT, fontFace:"Consolas" });
    s.addText(desc, { x:col+0.12, y:y+0.27, w:4.1, h:0.2,  fontSize:9.5, color: MUTED });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Technology Stack
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "TECH STACK", 0.5, 0.18);
  s.addText("Technology Stack", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  const techs = [
    [ACCENT,  "Python 3.10+",      "Core Language",    "Entire backend — pipeline, summarizer, scheduler, API"],
    [GREEN,   "Ollama llama3",     "Local AI / LLM",   "100% offline summarization, sentiment & scoring. No API key."],
    [YELLOW,  "Flask",             "Web Framework",    "Dashboard UI, REST API routes, template rendering"],
    [ACCENT2, "SQLite",            "Database",         "Lightweight local DB — articles, preferences, recipients"],
    [RED,     "feedparser",        "RSS Library",      "Parses Google News RSS feeds across all 10 categories"],
    [ACCENT,  "Telegram Bot API",  "Delivery",         "Real-time alerts for high importance news to multiple chat IDs"],
    [GREEN,   "Chart.js",         "Visualisation",    "5 interactive charts on Analytics page via CDN"],
    [ACCENT2, "schedule",          "Automation",       "Daily pipeline trigger at configured time (default 8 AM)"],
  ];

  techs.forEach(([color, name, role, desc], i) => {
    const col = i % 2 === 0 ? 0.5 : 5.1;
    const y   = 1.25 + Math.floor(i/2) * 1.0;
    card(s, col, y, 4.35, 0.88, BORDER);
    s.addShape(pres.shapes.RECTANGLE, { x:col, y, w:0.06, h:0.88, fill:{ color }, line:{ color } });
    s.addText(name, { x:col+0.18, y:y+0.08, w:2.2, h:0.28, fontSize:13, bold:true, color });
    s.addText(role, { x:col+2.45, y:y+0.1, w:1.75, h:0.26, fontSize:9.5, color: MUTED, align:"right", italic:true });
    s.addText(desc, { x:col+0.18, y:y+0.42, w:4.02, h:0.38, fontSize:10, color: MUTED, wrap:true });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Key Features
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "FEATURES", 0.5, 0.18);
  s.addText("Key Features", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  const features = [
    [ACCENT,  "📰", "10-Category RSS",     "Fetches from AI, Tech, Finance, Science, Health, Cyber, Space, Politics, Sports, Entertainment"],
    [GREEN,   "🤖", "Local AI (Ollama)",   "llama3 runs 100% on your machine — no cloud, no API key, no cost per request"],
    [YELLOW,  "💬", "Sentiment Analysis",  "Every article classified as Positive / Negative / Neutral with colour-coded display"],
    [ACCENT2, "⭐", "Importance Scoring",  "AI assigns 1–10 score. Only high-score articles trigger Telegram instant alerts"],
    [RED,     "🔁", "Deduplication",       "SQLite GUID check ensures the same article is never processed or delivered twice"],
    [ACCENT,  "📊", "Analytics Dashboard", "5 Chart.js charts — category bars, sentiment donut, importance histogram, stacked view"],
    [GREEN,   "✈",  "Telegram Delivery",   "Multiple chat IDs supported. Test button per recipient. Group chat compatible."],
    [ACCENT2, "🔌", "REST API",            "GET /api/news, /api/stats, /api/trending with query params — documented in /api/docs"],
    [YELLOW,  "⚙",  "User Preferences",   "Toggle categories, set alert threshold, manage delivery recipients from the UI"],
  ];

  features.forEach(([color, icon, title, desc], i) => {
    const col = i % 3 === 0 ? 0.5 : i % 3 === 1 ? 3.72 : 6.94;
    const y   = 1.25 + Math.floor(i/3) * 1.42;
    card(s, col, y, 2.98, 1.28, BORDER);
    s.addShape(pres.shapes.RECTANGLE, { x:col, y, w:2.98, h:0.06, fill:{ color }, line:{ color } });
    s.addText(icon,  { x:col+0.1, y:y+0.18, w:0.5, h:0.5, fontSize:22, align:"center" });
    s.addText(title, { x:col+0.62, y:y+0.18, w:2.22, h:0.3, fontSize:11.5, bold:true, color });
    s.addText(desc,  { x:col+0.1, y:y+0.62, w:2.78, h:0.6, fontSize:9.5, color: MUTED, wrap:true });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 8 — AI Pipeline Deep Dive
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "AI PIPELINE", 0.5, 0.18);
  s.addText("How the AI Pipeline Works", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  // Left — step by step
  const steps = [
    [ACCENT,  "Step 1", "Schedule Trigger",    "Runs daily at 8:00 AM via Python schedule library (or manually via dashboard ▶ Run Now button)"],
    [ACCENT2, "Step 2", "RSS Fetch",           "feedparser pulls up to 8 articles per category from Google News RSS. Returns title, link, pub date, source."],
    [GREEN,   "Step 3", "Dedup Check",         "MD5 hash of GUID checked against SQLite. Already-seen articles skipped. Only new ones proceed."],
    [YELLOW,  "Step 4", "Ollama Summarization","Top 5 articles per category sent to llama3 via /api/generate. Prompt requests JSON: summary, sentiment, importance score."],
    [RED,     "Step 5", "DB Insert",           "All enriched articles saved to SQLite articles table with all metadata."],
    [ACCENT,  "Step 6", "Delivery",            "Telegram: articles scoring ≥ threshold sent as formatted messages. Dashboard auto-reflects new data on next load."],
  ];

  steps.forEach(([color, num, title, body], i) => {
    const y = 1.22 + i * 0.7;
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y, w:0.52, h:0.52, fill:{ color, transparency:80 }, line:{ color } });
    s.addText(num, { x:0.5, y, w:0.52, h:0.52, fontSize:9, bold:true, color, align:"center", valign:"middle", margin:0 });
    s.addShape(pres.shapes.RECTANGLE, { x:0.5+0.58, y:y+0.05, w:4.4, h:0.42, fill:{ color: CARD }, line:{ color: BORDER } });
    s.addText(title + " — ", { x:1.14, y:y+0.06, w:1.4, h:0.2, fontSize:10, bold:true, color });
    s.addText(body, { x:1.14, y:y+0.25, w:4.3, h:0.2, fontSize:9, color: MUTED });
  });

  // Right — Ollama prompt box
  card(s, 6.0, 1.22, 3.6, 4.0, ACCENT);
  s.addShape(pres.shapes.RECTANGLE, { x:6.0, y:1.22, w:3.6, h:0.36, fill:{ color: ACCENT, transparency:75 }, line:{ color: ACCENT } });
  s.addText("Ollama Prompt Template", { x:6.05, y:1.22, w:3.5, h:0.36, fontSize:11, bold:true, color: ACCENT, valign:"middle" });

  const promptLines = [
    'You are a news analyst.',
    'Given the headline below:',
    '',
    '1. Write a 1-2 sentence summary',
    '2. Classify sentiment:',
    '   Positive | Negative | Neutral',
    '3. Rate importance 1-10',
    '',
    'Respond ONLY in JSON:',
    '{',
    '  "summary": "...",',
    '  "sentiment": "...",',
    '  "importance": <int>',
    '}',
  ];
  s.addText(
    promptLines.map((l, i) => ({ text: l, options: { breakLine: i < promptLines.length - 1, color: i === 0 || i === 1 ? MUTED : i >= 8 ? GREEN : TEXT } })),
    { x:6.1, y:1.68, w:3.4, h:3.44, fontSize:9.5, fontFace:"Consolas", wrap:true, valign:"top" }
  );
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 9 — Dashboard Overview
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "DASHBOARD", 0.5, 0.18);
  s.addText("Web Dashboard — Features", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  const pages = [
    [ACCENT,  "🏠 Home Dashboard",
      ["Total articles, positive/negative/neutral counts (all clickable)", "Articles by category — horizontal bars (each row links to filtered news)", "Sentiment overview with hover % tooltip", "Trending categories this week", "Quick API endpoint cards"]],
    [GREEN,   "📰 Browse News",
      ["Filter by category, sentiment, min importance score", "Article cards with importance bar, sentiment badge, score", "Source name and timestamp on every card", "Direct link to original article"]],
    [YELLOW,  "📊 Analytics",
      ["5 Chart.js charts — category bar, sentiment donut", "Importance score distribution histogram", "Top news sources bar chart", "Sentiment stacked bar by category"]],
    [ACCENT2, "⚙ Preferences",
      ["Toggle 10 categories on/off", "Telegram delivery toggle + alert threshold slider", "Recipients manager — add/remove/test Telegram chat IDs", "Group chat support"]],
  ];

  pages.forEach(([color, title, points], i) => {
    const col = i % 2 === 0 ? 0.5 : 5.1;
    const y   = 1.25 + Math.floor(i/2) * 2.1;
    card(s, col, y, 4.35, 1.95, BORDER);
    s.addShape(pres.shapes.RECTANGLE, { x:col, y, w:4.35, h:0.38, fill:{ color, transparency:85 }, line:{ color } });
    s.addText(title, { x:col+0.12, y:y+0.04, w:4.1, h:0.3, fontSize:12, bold:true, color });
    points.forEach((pt, j) => {
      s.addText("›  " + pt, { x:col+0.12, y:y+0.48+j*0.3, w:4.1, h:0.26, fontSize:9.5, color: MUTED });
    });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 10 — Analytics Charts
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "ANALYTICS", 0.5, 0.18);
  s.addText("Analytics — Charts & Visualisation", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  // chart 1 — bar (category article counts)
  s.addChart(pres.charts.BAR, [{
    name: "Articles", labels: ["AI","Tech","Finance","Science","Health","Cyber","Space","Politics","Sports","Entertain"],
    values: [8,8,8,8,8,8,8,8,8,8]
  }], {
    x:0.5, y:1.2, w:4.5, h:2.5, barDir:"col",
    chartColors: Array(10).fill(ACCENT),
    chartArea: { fill:{ color: CARD } },
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED,
    valGridLine:{ color: BORDER, size:0.5 }, catGridLine:{ style:"none" },
    showLegend:false, showTitle:true, title:"Articles by Category",
    titleColor: TEXT, titleFontSize:11,
  });

  // chart 2 — doughnut (sentiment)
  s.addChart(pres.charts.DOUGHNUT, [{
    name:"Sentiment", labels:["Positive","Negative","Neutral"], values:[32,21,27]
  }], {
    x:5.2, y:1.2, w:4.3, h:2.5,
    chartColors:[GREEN, RED, MUTED],
    chartArea:{ fill:{ color: CARD } },
    showLegend:true, legendPos:"b", legendColor: MUTED,
    showTitle:true, title:"Sentiment Distribution",
    titleColor: TEXT, titleFontSize:11,
    holeSize:55,
  });

  // chart 3 — bar (importance)
  s.addChart(pres.charts.BAR, [{
    name:"Articles", labels:["1","2","3","4","5","6","7","8","9","10"],
    values:[2,4,6,10,14,18,12,8,4,2]
  }], {
    x:0.5, y:3.85, w:4.5, h:1.55, barDir:"col",
    chartColors: ["22C55E","22C55E","22C55E","22C55E","22C55E","F59E0B","F59E0B","EF4444","EF4444","EF4444"],
    chartArea:{ fill:{ color: CARD } },
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED,
    valGridLine:{ color: BORDER }, catGridLine:{ style:"none" },
    showLegend:false, showTitle:true, title:"Importance Score Distribution",
    titleColor: TEXT, titleFontSize:10,
  });

  // labels
  s.addText("🟢 Low   🟡 Medium   🔴 High importance", { x:5.2, y:3.9, w:4.3, h:0.3, fontSize:10, color: MUTED, align:"center" });

  const noteItems = [
    ["80", "articles fetched\nin one pipeline run"],
    ["5",  "charts in\nthe analytics page"],
    ["10", "categories\ntracked & visualised"],
  ];
  noteItems.forEach(([num, label], i) => {
    const x = 5.2 + i * 1.45;
    card(s, x, 4.22, 1.25, 1.0, BORDER);
    s.addText(num,   { x, y:4.28, w:1.25, h:0.42, fontSize:26, bold:true, color: ACCENT, align:"center", fontFace:"Trebuchet MS" });
    s.addText(label, { x, y:4.68, w:1.25, h:0.46, fontSize:9, color: MUTED, align:"center" });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 11 — REST API
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "REST API", 0.5, 0.18);
  s.addText("REST API — Programmatic Access", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  s.addText("Base URL: http://localhost:5000", { x:0.5, y:1.15, w:5, h:0.28, fontSize:11, color: MUTED, fontFace:"Consolas" });

  const endpoints = [
    [ACCENT,  "GET", "/api/news",        "Fetch articles with filters",     "?category=Technology&sentiment=Positive&min_score=7&limit=10"],
    [GREEN,   "GET", "/api/stats",       "Overall statistics summary",      "Returns total, by_category, by_sentiment, avg_importance"],
    [YELLOW,  "GET", "/api/trending",    "Trending categories last N days",  "?days=7"],
    [ACCENT2, "GET", "/api/recipients",  "List Telegram recipients",         "Returns { telegrams: [...] }"],
    [ACCENT,  "POST","/api/recipients/add",    "Add a recipient",           '{ "type": "telegram", "value": "123456" }'],
    [RED,     "POST","/api/recipients/send-test","Send test message",       '{ "type": "telegram", "value": "123456" }'],
  ];

  endpoints.forEach(([color, method, path, desc, note], i) => {
    const y = 1.5 + i * 0.67;
    card(s, 0.5, y, 9.1, 0.58, BORDER);
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y, w:0.62, h:0.58, fill:{ color, transparency:80 }, line:{ color } });
    s.addText(method, { x:0.5, y, w:0.62, h:0.58, fontSize:9.5, bold:true, color, align:"center", valign:"middle", margin:0 });
    s.addText(path,   { x:1.2, y:y+0.06, w:2.3, h:0.24, fontSize:11, bold:true, color, fontFace:"Consolas" });
    s.addText(desc,   { x:1.2, y:y+0.32, w:2.3, h:0.22, fontSize:9.5, color: MUTED });
    s.addShape(pres.shapes.RECTANGLE, { x:3.62, y:y+0.08, w:5.85, h:0.42, fill:{ color: SURFACE }, line:{ color: BORDER } });
    s.addText(note, { x:3.72, y:y+0.1, w:5.7, h:0.36, fontSize:9.5, color: GREEN, fontFace:"Consolas", valign:"middle" });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 12 — Multi-Category & Delivery
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "DELIVERY", 0.5, 0.18);
  s.addText("News Categories & Delivery System", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  // categories grid
  const cats = [
    ["🤖","Artificial Intelligence",ACCENT],
    ["💻","Technology",ACCENT2],
    ["💰","Finance",GREEN],
    ["🔬","Science",YELLOW],
    ["🏥","Health",RED],
    ["🔐","Cybersecurity",ACCENT],
    ["🚀","Space",ACCENT2],
    ["🏛️","Politics",GREEN],
    ["⚽","Sports",YELLOW],
    ["🎬","Entertainment",RED],
  ];

  cats.forEach(([icon, name, color], i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = 0.5 + col * 1.82;
    const y = 1.22 + row * 0.7;
    card(s, x, y, 1.68, 0.58, BORDER);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:1.68, h:0.06, fill:{ color }, line:{ color } });
    s.addText(icon, { x, y:y+0.1, w:0.42, h:0.4, fontSize:16, align:"center" });
    s.addText(name, { x:x+0.42, y:y+0.12, w:1.2, h:0.38, fontSize:8.5, color: TEXT, valign:"middle", wrap:true });
  });

  // Telegram delivery section
  s.addText("Telegram Delivery Flow", { x:0.5, y:2.75, w:5, h:0.35, fontSize:14, bold:true, color: TEXT });

  const flow = [
    [ACCENT,  "Pipeline\nRuns",    "Scheduled\nor manual"],
    [GREEN,   "Score\nCheck",      "Article ≥\nthreshold"],
    [YELLOW,  "Format\nMessage",   "Category +\nScore + Link"],
    [ACCENT2, "Telegram\nAPI",     "POST to bot\nendpoint"],
    [RED,     "Multiple\nRecipients","All chat IDs\nget alert"],
  ];

  flow.forEach(([color, title, sub], i) => {
    const x = 0.5 + i * 1.86;
    s.addShape(pres.shapes.RECTANGLE, { x, y:3.18, w:1.55, h:0.88, fill:{ color, transparency:82 }, line:{ color } });
    s.addShape(pres.shapes.RECTANGLE, { x, y:3.18, w:1.55, h:0.06, fill:{ color }, line:{ color } });
    s.addText(title, { x, y:3.24, w:1.55, h:0.44, fontSize:10, bold:true, color: WHITE, align:"center", valign:"middle", margin:2 });
    s.addText(sub,   { x, y:3.68, w:1.55, h:0.34, fontSize:8.5, color: MUTED, align:"center", margin:2 });
    if (i < flow.length - 1) {
      s.addText("→", { x:x+1.55, y:3.4, w:0.28, h:0.3, fontSize:14, color: MUTED, align:"center" });
    }
  });

  // Features note
  const notes = [
    "Multiple Telegram chat IDs supported — add friends, classmates, or group chats",
    "Test button per recipient — verify connectivity before pipeline runs",
    "Alert threshold configurable 1–10 from Preferences page",
  ];
  notes.forEach((n, i) => {
    s.addText("✓  " + n, { x:0.5, y:4.2 + i*0.32, w:9, h:0.28, fontSize:11, color: i === 0 ? GREEN : MUTED });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 13 — Results & Observations
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "RESULTS", 0.5, 0.18);
  s.addText("Results & Observations", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  // Big stats row
  const stats = [
    [ACCENT,  "80",    "Articles\nper run"],
    [GREEN,   "100%",  "Local AI\n(no cloud)"],
    [YELLOW,  "10",    "News\ncategories"],
    [ACCENT2, "~2 min","Full pipeline\nduration"],
    [RED,     "0",     "Duplicate\narticles"],
  ];

  stats.forEach(([color, num, label], i) => {
    const x = 0.42 + i * 1.84;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.22, w:1.65, h:1.18, fill:{ color, transparency:88 }, line:{ color }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.22, w:1.65, h:0.07, fill:{ color }, line:{ color } });
    s.addText(num,   { x, y:1.32, w:1.65, h:0.58, fontSize:30, bold:true, color, align:"center", fontFace:"Trebuchet MS" });
    s.addText(label, { x, y:1.88, w:1.65, h:0.44, fontSize:9.5, color: MUTED, align:"center" });
  });

  // Observations
  s.addText("Key Observations", { x:0.5, y:2.58, w:9, h:0.35, fontSize:14, bold:true, color: TEXT });

  const obs = [
    [GREEN,   "✅ Ollama llama3 produces accurate summaries in 1-3 seconds per article on a standard laptop (8GB RAM)."],
    [GREEN,   "✅ GUID-based deduplication successfully prevents re-processing on repeated pipeline runs."],
    [YELLOW,  "⚠ Sentiment accuracy is ~80-85% — minor misclassifications on ambiguous headlines."],
    [ACCENT,  "✅ Telegram alerts delivered within 1-2 seconds of pipeline completion per recipient."],
    [GREEN,   "✅ Flask dashboard loads in under 500ms even with 500+ articles in SQLite."],
    [ACCENT2, "✅ REST API correctly returns filtered JSON — tested with all query parameter combinations."],
  ];

  obs.forEach(([color, text], i) => {
    const y = 3.02 + i * 0.42;
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y, w:9.1, h:0.34, fill:{ color: CARD }, line:{ color: BORDER } });
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y, w:0.05, h:0.34, fill:{ color }, line:{ color } });
    s.addText(text, { x:0.65, y:y+0.03, w:8.85, h:0.28, fontSize:10.5, color: MUTED });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 14 — Future Scope
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  pill(s, "FUTURE SCOPE", 0.5, 0.18);
  s.addText("Future Scope & Enhancements", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  const futures = [
    [ACCENT,  "🌐", "Cloud Hosting",        "Deploy on Render or Railway for 24/7 access. No need to keep local machine running."],
    [GREEN,   "📱", "Mobile App",           "React Native app with push notifications replacing Telegram for a branded experience."],
    [YELLOW,  "🔍", "Advanced NLP",         "Named entity recognition to extract people, companies, locations from articles automatically."],
    [ACCENT2, "📧", "Email Integration",    "Full SMTP email digest using a dedicated sending account (e.g. Mailgun free tier)."],
    [RED,     "🗓", "Article History View", "Calendar heatmap showing news volume by day. Click a date to see that day's articles."],
    [ACCENT,  "🧠", "Fine-tuned Model",     "Replace llama3 with a news-specific fine-tuned model for better domain accuracy."],
    [GREEN,   "🔗", "n8n Integration",      "Expose pipeline trigger as webhook so n8n workflows can call it — best of both platforms."],
    [YELLOW,  "📊", "Export Reports",       "One-click PDF or Excel export of analytics — useful for research and documentation."],
  ];

  futures.forEach(([color, icon, title, desc], i) => {
    const col = i % 2 === 0 ? 0.5 : 5.1;
    const y   = 1.25 + Math.floor(i/2) * 1.05;
    card(s, col, y, 4.35, 0.9, BORDER);
    s.addShape(pres.shapes.RECTANGLE, { x:col, y, w:0.06, h:0.9, fill:{ color }, line:{ color } });
    s.addText(icon,  { x:col+0.14, y:y+0.14, w:0.46, h:0.5, fontSize:20, align:"center" });
    s.addText(title, { x:col+0.66, y:y+0.1, w:3.55, h:0.28, fontSize:12, bold:true, color });
    s.addText(desc,  { x:col+0.66, y:y+0.42, w:3.55, h:0.42, fontSize:10, color: MUTED, wrap:true });
  });
}

// ════════════════════════════════════════════════════════════════════════
// SLIDE 15 — Conclusion
// ════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.05, fill:{ color: ACCENT }, line:{ color: ACCENT } });

  // watermark
  s.addText("✓", { x:5.5, y:0.5, w:4, h:4.5, fontSize:200, bold:true, color: GREEN, transparency:92, align:"center" });

  pill(s, "CONCLUSION", 0.5, 0.18);
  s.addText("Conclusion", { x:0.5, y:0.55, w:9, h:0.55, fontSize:30, bold:true, color: WHITE, fontFace:"Trebuchet MS" });

  // Summary paragraph
  card(s, 0.5, 1.22, 9.1, 1.0, ACCENT);
  accentBar(s, 0.5, 1.22, 1.0, ACCENT);
  s.addText(
    "AI News Automation is a complete, production-quality news intelligence system built entirely in Python. It demonstrates real-world application of local AI (Ollama llama3), automated data pipelines, SQLite persistence, REST API design, and full-stack web development — all without any cloud dependency or API costs.",
    { x:0.68, y:1.3, w:8.8, h:0.82, fontSize:12, color: TEXT, wrap:true, valign:"middle" }
  );

  // Achievements
  const achievements = [
    [ACCENT,  "Local AI Integration",      "Ollama llama3 runs 100% offline — no OpenAI costs, no privacy concerns"],
    [GREEN,   "Full-Stack System",         "Python backend + Flask + SQLite + REST API + Chart.js frontend"],
    [YELLOW,  "Real-time Intelligence",    "80 articles summarized, scored & delivered per pipeline run across 10 domains"],
    [ACCENT2, "Production-grade Features", "Deduplication, user preferences, multi-recipient delivery, API docs"],
  ];

  achievements.forEach(([color, title, desc], i) => {
    const col = i % 2 === 0 ? 0.5 : 5.1;
    const y   = 2.38 + Math.floor(i/2) * 0.88;
    card(s, col, y, 4.35, 0.76, BORDER);
    s.addShape(pres.shapes.RECTANGLE, { x:col, y, w:0.06, h:0.76, fill:{ color }, line:{ color } });
    s.addText(title, { x:col+0.18, y:y+0.1, w:4.0, h:0.26, fontSize:12, bold:true, color });
    s.addText(desc,  { x:col+0.18, y:y+0.4, w:4.0, h:0.3, fontSize:10, color: MUTED });
  });

  // Thank you
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.22, w:9.1, h:0.95, fill:{ color: SURFACE }, line:{ color: BORDER } });
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.22, w:9.1, h:0.05, fill:{ color: ACCENT }, line:{ color: ACCENT } });
  s.addText("Thank You", { x:0.5, y:4.28, w:9.1, h:0.4, fontSize:22, bold:true, color: WHITE, align:"center", fontFace:"Trebuchet MS" });
  s.addText("Vaishnavi Gahoi  ·  B.Tech CSE  ·  Jawaharlal Nehru College of Technology  ·  2025-26", {
    x:0.5, y:4.68, w:9.1, h:0.4, fontSize:11, color: MUTED, align:"center"
  });
}

// ── Write file ───────────────────────────────────────────────────────────
pres.writeFile({ fileName: "/home/claude/AI_News_Automation_Presentation.pptx" })
  .then(() => console.log("✅ Done: AI_News_Automation_Presentation.pptx"))
  .catch(e => { console.error(e); process.exit(1); });