"""
delivery/email_sender.py  —  Send HTML email digest via Gmail SMTP
"""
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from config.settings import EMAIL_SENDER, EMAIL_PASSWORD, EMAIL_RECEIVER


SENTIMENT_COLOR = {
    "Positive": "#22c55e",
    "Negative": "#ef4444",
    "Neutral":  "#94a3b8",
}

CATEGORY_EMOJI = {
    "Artificial Intelligence": "🤖",
    "Technology":              "💻",
    "Finance":                 "💰",
    "Science":                 "🔬",
    "Health":                  "🏥",
    "Cybersecurity":           "🔐",
    "Space":                   "🚀",
    "Politics":                "🏛️",
    "Sports":                  "⚽",
    "Entertainment":           "🎬",
}


def _build_html(articles_by_category: dict) -> str:
    today = datetime.now().strftime("%B %d, %Y")
    sections = ""

    for category, articles in articles_by_category.items():
        emoji = CATEGORY_EMOJI.get(category, "📰")
        cards = ""
        for a in articles:
            color     = SENTIMENT_COLOR.get(a.get("sentiment", "Neutral"), "#94a3b8")
            score     = a.get("importance", 0)
            pub_time  = a.get("published_at", "")[:16].replace("T", " ")
            cards += f"""
            <div style="border-left:4px solid {color};padding:10px 14px;margin:10px 0;
                        background:#1e293b;border-radius:0 8px 8px 0;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="background:{color};color:#000;font-size:11px;padding:2px 7px;
                             border-radius:10px;font-weight:700;">{a.get('sentiment','Neutral')}</span>
                <span style="color:#64748b;font-size:11px;">⏱ {pub_time}</span>
                <span style="color:#f59e0b;font-size:12px;">★ {score}/10</span>
              </div>
              <a href="{a.get('link','#')}" style="color:#e2e8f0;font-weight:600;
                 text-decoration:none;font-size:15px;line-height:1.4;display:block;margin:6px 0 4px;">
                {a.get('title','')}
              </a>
              <p style="color:#94a3b8;font-size:13px;margin:0;">{a.get('summary','')}</p>
              <small style="color:#475569;font-size:11px;">📰 {a.get('source','')}</small>
            </div>"""

        sections += f"""
        <div style="margin-bottom:28px;">
          <h2 style="color:#f1f5f9;font-size:18px;border-bottom:1px solid #334155;
                     padding-bottom:8px;">{emoji} {category}</h2>
          {cards}
        </div>"""

    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#0f172a;font-family:'Segoe UI',sans-serif;
             color:#e2e8f0;margin:0;padding:20px;">
  <div style="max-width:680px;margin:0 auto;">
    <div style="text-align:center;padding:24px 0 16px;">
      <h1 style="color:#38bdf8;font-size:26px;margin:0;">📡 AI News Automation</h1>
      <p style="color:#64748b;margin:4px 0 0;">{today} · Powered by Ollama llama3 · Local AI</p>
    </div>
    {sections}
    <div style="text-align:center;padding:16px;color:#334155;font-size:12px;
                border-top:1px solid #1e293b;margin-top:20px;">
      Generated automatically · AI News Automation Project
    </div>
  </div>
</body></html>"""


def send_digest(articles_by_category: dict):
    if not EMAIL_SENDER or not EMAIL_PASSWORD:
        print("  [Email] Skipped — EMAIL_SENDER / EMAIL_PASSWORD not set in settings.py")
        return

    html = _build_html(articles_by_category)
    today = datetime.now().strftime("%B %d, %Y")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"📡 News Digest — {today}"
    msg["From"]    = EMAIL_SENDER
    msg["To"]      = EMAIL_RECEIVER
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as s:
            s.login(EMAIL_SENDER, EMAIL_PASSWORD)
            s.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())
        print(f"  [Email] Digest sent to {EMAIL_RECEIVER}")
    except Exception as e:
        print(f"  [Email] ERROR: {e}")
