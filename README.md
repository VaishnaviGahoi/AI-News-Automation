# 📡 AI News Automation
### B.Tech Major Project | CSE | Local AI + Python + Flask

---

## 📁 Project Structure
```
ai_news_automation/
├── config/
│   └── settings.py          ← ALL config here (tokens, emails, categories)
├── database/
│   └── db.py                ← SQLite operations
├── fetcher/
│   └── rss_fetcher.py       ← Multi-category RSS fetching
├── summarizer/
│   └── ollama_summarizer.py ← Local AI summarization (llama3)
├── delivery/
│   ├── email_sender.py      ← Gmail digest
│   └── telegram_sender.py   ← Telegram alerts
├── dashboard/
│   ├── app.py               ← Flask web app + REST API
│   └── templates/           ← HTML pages
├── pipeline.py              ← Main orchestrator
├── scheduler.py             ← Daily auto-run
├── requirements.txt
└── data/                    ← SQLite DB stored here (auto-created)
```

---

## ⚡ Setup Instructions (Windows)

### Step 1 — Install Python packages
```
cd ai_news_automation
pip install -r requirements.txt
```

### Step 2 — Make sure Ollama is running
```
ollama serve
```
In another terminal, verify:
```
ollama list
```
You should see `llama3` listed.

### Step 3 — Configure settings
Open `config/settings.py` and fill in:
- `EMAIL_SENDER` — your Gmail address
- `EMAIL_PASSWORD` — Gmail App Password (see below)
- `EMAIL_RECEIVER` — where to send digest
- `TELEGRAM_BOT_TOKEN` — from @BotFather (see below)
- `TELEGRAM_CHAT_ID` — your chat ID (see below)

### Step 4 — Run the dashboard
```
python dashboard/app.py
```
Open: http://localhost:5000

### Step 5 — Run the pipeline manually
Click **▶ Run Now** in the dashboard, or:
```
python pipeline.py
```

### Step 6 — Auto-schedule (runs daily at 8 AM)
```
python scheduler.py
```

---

## 📧 Gmail App Password Setup
1. Go to myaccount.google.com
2. Security → 2-Step Verification (enable if not done)
3. Security → App Passwords → Select app: Mail → Generate
4. Copy the 16-char password → paste in `EMAIL_PASSWORD`

---

## ✈ Telegram Bot Setup
1. Open Telegram → search `@BotFather`
2. Send `/newbot` → follow steps → copy the token → paste in `TELEGRAM_BOT_TOKEN`
3. Start a chat with your new bot → send `/start`
4. Open this URL in browser (replace TOKEN):
   `https://api.telegram.org/botTOKEN/getUpdates`
5. Find `"id"` inside `"chat"` → that is your `TELEGRAM_CHAT_ID`

---

## 🔌 REST API
| Endpoint | Description |
|---|---|
| GET /api/news | All articles. Params: category, sentiment, min_score, limit |
| GET /api/stats | Summary statistics |
| GET /api/trending | Trending categories (last 7 days) |

Example:
```
http://localhost:5000/api/news?category=Technology&sentiment=Positive&min_score=7
```

---

## 🧠 Tech Stack
| Layer | Technology |
|---|---|
| Language | Python 3.10+ |
| LLM | Ollama llama3 (100% local, free) |
| Data Source | Google News RSS (10 categories) |
| Database | SQLite |
| Web Framework | Flask |
| Delivery | Gmail SMTP + Telegram Bot API |
| Scheduling | Python `schedule` library |
