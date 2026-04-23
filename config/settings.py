# ============================================================
#  AI News Automation — Configuration
# ============================================================

OLLAMA_MODEL = "llama3"
OLLAMA_BASE_URL = "http://localhost:11434"

DB_PATH = "data/news.db"

MAX_ARTICLES_PER_CATEGORY = 8   # fetched from RSS
SUMMARIZE_TOP_N = 5             # sent to LLM per category

# ── Telegram ────────────────────────────────────────────────
TELEGRAM_BOT_TOKEN = "8698470334:AAHlDuVeI3d_iNO6BawsySgeQGDyPKKa7v8"         # fill after creating bot
TELEGRAM_CHAT_ID   = "5322306492"         # fill after /start in bot

# ── Email (Gmail SMTP) ───────────────────────────────────────
EMAIL_SENDER   = ""             # your gmail
EMAIL_PASSWORD = ""             # app password (not login pwd)
EMAIL_RECEIVER = ""             # where to send digest

# ── Importance threshold for Telegram alert ─────────────────
ALERT_SCORE_THRESHOLD = 7       # articles scored >= 7 get instant Telegram alert

# ── News Categories & RSS Feeds ─────────────────────────────
CATEGORIES = {
    "Artificial Intelligence": "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-IN&gl=IN&ceid=IN:en",
    "Technology":              "https://news.google.com/rss/search?q=technology&hl=en-IN&gl=IN&ceid=IN:en",
    "Finance":                 "https://news.google.com/rss/search?q=finance+economy&hl=en-IN&gl=IN&ceid=IN:en",
    "Science":                 "https://news.google.com/rss/search?q=science+research&hl=en-IN&gl=IN&ceid=IN:en",
    "Health":                  "https://news.google.com/rss/search?q=health+medicine&hl=en-IN&gl=IN&ceid=IN:en",
    "Cybersecurity":           "https://news.google.com/rss/search?q=cybersecurity+hacking&hl=en-IN&gl=IN&ceid=IN:en",
    "Space":                   "https://news.google.com/rss/search?q=space+NASA+ISRO&hl=en-IN&gl=IN&ceid=IN:en",
    "Politics":                "https://news.google.com/rss/search?q=india+politics&hl=en-IN&gl=IN&ceid=IN:en",
    "Sports":                  "https://news.google.com/rss/search?q=sports+cricket+football&hl=en-IN&gl=IN&ceid=IN:en",
    "Entertainment":           "https://news.google.com/rss/search?q=entertainment+bollywood&hl=en-IN&gl=IN&ceid=IN:en",
}

# ── Scheduler ───────────────────────────────────────────────
FETCH_HOUR   = 8    # 8 AM daily fetch
FETCH_MINUTE = 0
