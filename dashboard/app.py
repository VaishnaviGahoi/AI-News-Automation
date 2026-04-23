"""
dashboard/app.py  —  Flask web dashboard + REST API
Run: python dashboard/app.py
Open: http://localhost:5000
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, render_template, request, jsonify, redirect, url_for
from database.db import (
    init_db, get_articles, get_preferences, save_preferences, get_trending
)
from config.settings import CATEGORIES

app = Flask(__name__)


# ── Pages ────────────────────────────────────────────────────

@app.route("/")
def index():
    prefs    = get_preferences()
    trending = get_trending(7)
    cats     = list(CATEGORIES.keys())

    # summary counts
    all_arts = get_articles(limit=500)
    counts   = {}
    for cat in cats:
        counts[cat] = sum(1 for a in all_arts if a["category"] == cat)

    sentiment_counts = {
        "Positive": sum(1 for a in all_arts if a.get("sentiment") == "Positive"),
        "Negative": sum(1 for a in all_arts if a.get("sentiment") == "Negative"),
        "Neutral":  sum(1 for a in all_arts if a.get("sentiment") == "Neutral"),
    }

    return render_template("index.html",
        categories=cats,
        counts=counts,
        trending=trending,
        sentiment_counts=sentiment_counts,
        total=len(all_arts),
        prefs=prefs,
    )


@app.route("/news")
def news():
    category   = request.args.get("category", "")
    sentiment  = request.args.get("sentiment", "")
    min_score  = int(request.args.get("min_score", 0))
    limit      = int(request.args.get("limit", 30))

    articles = get_articles(
        category=category or None,
        sentiment=sentiment or None,
        min_importance=min_score,
        limit=limit,
    )
    cats = list(CATEGORIES.keys())
    return render_template("news.html",
        articles=articles,
        categories=cats,
        selected_cat=category,
        selected_sent=sentiment,
        min_score=min_score,
    )


@app.route("/preferences", methods=["GET", "POST"])
def preferences():
    cats = list(CATEGORIES.keys())
    if request.method == "POST":
        selected    = request.form.getlist("categories")
        do_email    = 1 if request.form.get("delivery_email") else 0
        do_telegram = 1 if request.form.get("delivery_telegram") else 0
        threshold   = int(request.form.get("alert_threshold", 7))
        save_preferences(selected, do_email, do_telegram, threshold)
        return redirect(url_for("preferences"))

    prefs = get_preferences()
    return render_template("preferences.html", categories=cats, prefs=prefs)


@app.route("/run-pipeline", methods=["POST"])
def run_pipeline_route():
    """Trigger pipeline manually from dashboard."""
    try:
        from pipeline import run_pipeline
        import threading
        t = threading.Thread(target=run_pipeline)
        t.daemon = True
        t.start()
        return jsonify({"status": "started", "message": "Pipeline running in background."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── REST API ─────────────────────────────────────────────────

@app.route("/api/news")
def api_news():
    """JSON API — GET /api/news?category=AI&sentiment=Positive&min_score=5"""
    category  = request.args.get("category")
    sentiment = request.args.get("sentiment")
    min_score = int(request.args.get("min_score", 0))
    limit     = int(request.args.get("limit", 20))

    articles = get_articles(
        category=category,
        sentiment=sentiment,
        min_importance=min_score,
        limit=limit,
    )
    return jsonify({"count": len(articles), "articles": articles})


@app.route("/api/trending")
def api_trending():
    days = int(request.args.get("days", 7))
    return jsonify(get_trending(days))


@app.route("/api/stats")
def api_stats():
    all_arts = get_articles(limit=1000)
    cats = list(CATEGORIES.keys())
    return jsonify({
        "total_articles": len(all_arts),
        "by_category":    {c: sum(1 for a in all_arts if a["category"] == c) for c in cats},
        "by_sentiment":   {
            s: sum(1 for a in all_arts if a.get("sentiment") == s)
            for s in ["Positive", "Negative", "Neutral"]
        },
        "avg_importance": round(
            sum(a.get("importance", 0) for a in all_arts) / max(len(all_arts), 1), 2
        ),
    })


if __name__ == "__main__":
    init_db()
    print("\n[Dashboard] Starting at http://localhost:5000\n")
    app.run(debug=False, port=5000)
