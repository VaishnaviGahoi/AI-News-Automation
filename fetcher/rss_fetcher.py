"""
fetcher/rss_fetcher.py  —  Fetch RSS for all (or selected) categories
"""
import feedparser
import hashlib
from datetime import datetime
from config.settings import CATEGORIES, MAX_ARTICLES_PER_CATEGORY
from database.db import is_duplicate


def _parse_date(entry) -> str:
    """Return ISO8601 string from feedparser entry."""
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        return datetime(*entry.published_parsed[:6]).isoformat()
    return datetime.utcnow().isoformat()


def _extract_source(title: str) -> str:
    """Google News RSS embeds source after ' - ' at end of title."""
    if " - " in title:
        return title.rsplit(" - ", 1)[-1].strip()
    return "Unknown"


def _make_guid(entry) -> str:
    base = getattr(entry, "id", None) or getattr(entry, "link", entry.get("title", ""))
    return hashlib.md5(base.encode()).hexdigest()


def fetch_category(category: str, url: str) -> list:
    """Fetch one RSS feed; return list of new (non-duplicate) article dicts."""
    print(f"  [RSS] Fetching: {category}")
    try:
        feed = feedparser.parse(url)
    except Exception as e:
        print(f"  [RSS] ERROR fetching {category}: {e}")
        return []

    articles = []
    for entry in feed.entries[:MAX_ARTICLES_PER_CATEGORY]:
        guid = _make_guid(entry)
        if is_duplicate(guid):
            continue

        title = entry.get("title", "No Title")
        articles.append({
            "guid":         guid,
            "title":        title,
            "link":         entry.get("link", ""),
            "category":     category,
            "source":       _extract_source(title),
            "published_at": _parse_date(entry),
            "summary":      None,
            "sentiment":    None,
            "importance":   0,
        })

    print(f"  [RSS] {category}: {len(articles)} new articles")
    return articles


def fetch_all(enabled_categories: list = None) -> dict:
    """
    Fetch all enabled categories.
    Returns  { category_name: [article_dict, ...] }
    """
    target = enabled_categories or list(CATEGORIES.keys())
    result = {}
    for cat in target:
        url = CATEGORIES.get(cat)
        if not url:
            continue
        articles = fetch_category(cat, url)
        if articles:
            result[cat] = articles
    return result
