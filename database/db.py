"""
database/db.py  —  SQLite layer for AI News Automation
"""
import sqlite3
import os
from config.settings import DB_PATH


def get_conn():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS articles (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            guid          TEXT UNIQUE,
            title         TEXT,
            link          TEXT,
            category      TEXT,
            source        TEXT,
            published_at  TEXT,
            fetched_at    TEXT DEFAULT (datetime('now')),
            summary       TEXT,
            sentiment     TEXT,
            importance    INTEGER DEFAULT 0,
            sent_email    INTEGER DEFAULT 0,
            sent_telegram INTEGER DEFAULT 0
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS user_preferences (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            categories   TEXT,          -- JSON list of enabled categories
            delivery_email    INTEGER DEFAULT 1,
            delivery_telegram INTEGER DEFAULT 1,
            alert_threshold   INTEGER DEFAULT 7,
            updated_at   TEXT DEFAULT (datetime('now'))
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS trending (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            keyword    TEXT,
            count      INTEGER,
            week       TEXT,
            category   TEXT
        )
    """)

    # seed default preferences if empty
    c.execute("SELECT COUNT(*) FROM user_preferences")
    if c.fetchone()[0] == 0:
        import json
        from config.settings import CATEGORIES
        all_cats = json.dumps(list(CATEGORIES.keys()))
        c.execute("INSERT INTO user_preferences (categories) VALUES (?)", (all_cats,))

    conn.commit()
    conn.close()
    print("[DB] Initialised successfully.")


def is_duplicate(guid: str) -> bool:
    conn = get_conn()
    row = conn.execute("SELECT id FROM articles WHERE guid=?", (guid,)).fetchone()
    conn.close()
    return row is not None


def insert_article(article: dict):
    conn = get_conn()
    try:
        conn.execute("""
            INSERT INTO articles
                (guid, title, link, category, source, published_at, summary, sentiment, importance)
            VALUES
                (:guid, :title, :link, :category, :source, :published_at, :summary, :sentiment, :importance)
        """, article)
        conn.commit()
    except sqlite3.IntegrityError:
        pass   # duplicate guid, skip silently
    finally:
        conn.close()


def get_articles(category=None, sentiment=None, min_importance=0, limit=50):
    conn = get_conn()
    query  = "SELECT * FROM articles WHERE importance >= ?"
    params = [min_importance]
    if category:
        query  += " AND category=?"
        params.append(category)
    if sentiment:
        query  += " AND sentiment=?"
        params.append(sentiment)
    query += " ORDER BY published_at DESC LIMIT ?"
    params.append(limit)
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_preferences():
    import json
    conn = get_conn()
    row = conn.execute("SELECT * FROM user_preferences ORDER BY id DESC LIMIT 1").fetchone()
    conn.close()
    if row:
        d = dict(row)
        d["categories"] = json.loads(d["categories"])
        return d
    return {}


def save_preferences(categories: list, delivery_email: int, delivery_telegram: int, alert_threshold: int):
    import json
    conn = get_conn()
    conn.execute("DELETE FROM user_preferences")
    conn.execute("""
        INSERT INTO user_preferences (categories, delivery_email, delivery_telegram, alert_threshold)
        VALUES (?, ?, ?, ?)
    """, (json.dumps(categories), delivery_email, delivery_telegram, alert_threshold))
    conn.commit()
    conn.close()


def mark_sent(guid: str, channel: str):
    """channel: 'email' or 'telegram'"""
    col = f"sent_{channel}"
    conn = get_conn()
    conn.execute(f"UPDATE articles SET {col}=1 WHERE guid=?", (guid,))
    conn.commit()
    conn.close()


def get_trending(days=7):
    conn = get_conn()
    rows = conn.execute("""
        SELECT category, COUNT(*) as count
        FROM articles
        WHERE fetched_at >= datetime('now', ?)
        GROUP BY category
        ORDER BY count DESC
    """, (f"-{days} days",)).fetchall()
    conn.close()
    return [dict(r) for r in rows]
