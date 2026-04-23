"""
delivery/telegram_sender.py  —  Send high-importance alerts to Telegram
"""
import requests
from config.settings import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ALERT_SCORE_THRESHOLD


def send_message(text: str):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("  [Telegram] Skipped — token/chat_id not set in settings.py")
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        requests.post(url, json={
            "chat_id":    TELEGRAM_CHAT_ID,
            "text":       text,
            "parse_mode": "HTML",
        }, timeout=10)
        print("  [Telegram] Message sent.")
    except Exception as e:
        print(f"  [Telegram] ERROR: {e}")


def send_alerts(articles: list):
    """Send alerts for articles above importance threshold."""
    high = [a for a in articles if a.get("importance", 0) >= ALERT_SCORE_THRESHOLD]
    if not high:
        print("  [Telegram] No high-importance articles to alert.")
        return

    for a in high[:5]:   # max 5 alerts per run
        sentiment_icon = {"Positive": "🟢", "Negative": "🔴", "Neutral": "🟡"}.get(
            a.get("sentiment", "Neutral"), "🟡"
        )
        msg = (
            f"{sentiment_icon} <b>{a.get('category','News')}</b> | "
            f"★ {a.get('importance',0)}/10\n\n"
            f"<b>{a.get('title','')}</b>\n\n"
            f"{a.get('summary','')}\n\n"
            f"<a href='{a.get('link','#')}'>Read more</a>"
        )
        send_message(msg)


def send_daily_summary(total: int, categories: list):
    msg = (
        f"📡 <b>Daily News Digest Ready</b>\n\n"
        f"📰 {total} new articles across {len(categories)} categories\n"
        f"📂 Categories: {', '.join(categories)}\n\n"
        f"Open the dashboard: <code>http://localhost:5000</code>"
    )
    send_message(msg)
