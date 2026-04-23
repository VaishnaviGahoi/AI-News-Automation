"""
pipeline.py  —  Orchestrates the full news automation pipeline
Run manually: python pipeline.py
Or scheduled via scheduler.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.db       import init_db, insert_article, get_preferences, mark_sent, get_articles
from fetcher.rss_fetcher      import fetch_all
from summarizer.ollama_summarizer import summarize_batch
from delivery.email_sender    import send_digest
from delivery.telegram_sender import send_alerts, send_daily_summary


def run_pipeline():
    print("\n" + "="*55)
    print("  AI NEWS AUTOMATION — Pipeline Starting")
    print("="*55)

    # 1. Init DB
    init_db()

    # 2. Load user preferences
    prefs = get_preferences()
    enabled_cats  = prefs.get("categories", [])
    do_email      = bool(prefs.get("delivery_email", 1))
    do_telegram   = bool(prefs.get("delivery_telegram", 1))
    print(f"\n[Config] Categories : {enabled_cats}")
    print(f"[Config] Email      : {do_email}")
    print(f"[Config] Telegram   : {do_telegram}")

    # 3. Fetch RSS
    print("\n[Step 1] Fetching RSS feeds...")
    raw_data = fetch_all(enabled_cats)   # { category: [articles] }

    if not raw_data:
        print("[Pipeline] No new articles found. Exiting.")
        return

    # 4. Summarise & score each category
    print("\n[Step 2] Summarising with Ollama llama3...")
    enriched_data = {}
    all_articles  = []

    for category, articles in raw_data.items():
        print(f"\n  Category: {category} ({len(articles)} articles)")
        enriched = summarize_batch(articles)
        enriched_data[category] = enriched
        all_articles.extend(enriched)

    # 5. Save to DB
    print("\n[Step 3] Saving to SQLite...")
    for art in all_articles:
        insert_article(art)
    print(f"  Saved {len(all_articles)} articles.")

    # 6. Deliver
    if do_email:
        print("\n[Step 4] Sending email digest...")
        send_digest(enriched_data)

    if do_telegram:
        print("\n[Step 5] Sending Telegram alerts...")
        send_alerts(all_articles)
        send_daily_summary(len(all_articles), list(enriched_data.keys()))

    print("\n" + "="*55)
    print(f"  Pipeline complete. {len(all_articles)} articles processed.")
    print("="*55 + "\n")


if __name__ == "__main__":
    run_pipeline()
