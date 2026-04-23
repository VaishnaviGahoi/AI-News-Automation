"""
summarizer/ollama_summarizer.py
Summarizes articles, assigns sentiment & importance via local Ollama (llama3)
"""
import json
import requests
from config.settings import OLLAMA_MODEL, OLLAMA_BASE_URL, SUMMARIZE_TOP_N


def _ask_ollama(prompt: str) -> str:
    """Raw call to Ollama /api/generate endpoint."""
    try:
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=120,
        )
        resp.raise_for_status()
        return resp.json().get("response", "").strip()
    except Exception as e:
        print(f"  [Ollama] ERROR: {e}")
        return ""


def summarize_article(title: str) -> dict:
    """
    Returns { summary, sentiment, importance }
    importance: 1-10 integer
    sentiment:  Positive | Negative | Neutral
    """
    prompt = f"""You are a news analyst. Given the news headline below, do THREE things:
1. Write a 1-2 sentence summary (plain English, no jargon).
2. Classify sentiment as exactly one of: Positive, Negative, Neutral
3. Rate importance from 1-10 (10 = breaking/critical, 1 = trivial).

Respond ONLY in this exact JSON format (no extra text):
{{
  "summary": "...",
  "sentiment": "Positive|Negative|Neutral",
  "importance": <integer 1-10>
}}

Headline: {title}"""

    raw = _ask_ollama(prompt)

    # parse JSON safely
    try:
        # sometimes model wraps in ```json ... ```
        if "```" in raw:
            raw = raw.split("```")[1].replace("json", "").strip()
        data = json.loads(raw)
        return {
            "summary":    str(data.get("summary", title)),
            "sentiment":  data.get("sentiment", "Neutral"),
            "importance": int(data.get("importance", 5)),
        }
    except Exception:
        return {"summary": title, "sentiment": "Neutral", "importance": 5}


def summarize_batch(articles: list) -> list:
    """
    Takes list of article dicts, adds summary/sentiment/importance.
    Only processes top SUMMARIZE_TOP_N per call to save time.
    """
    top = articles[:SUMMARIZE_TOP_N]
    enriched = []
    for art in top:
        print(f"    [LLM] Summarising: {art['title'][:60]}...")
        result = summarize_article(art["title"])
        art.update(result)
        enriched.append(art)

    # articles beyond top N get basic defaults
    for art in articles[SUMMARIZE_TOP_N:]:
        art["summary"]    = art["title"]
        art["sentiment"]  = "Neutral"
        art["importance"] = 3
        enriched.append(art)

    return enriched


def generate_category_digest(category: str, articles: list) -> str:
    """Generate a short HTML digest paragraph for a category (used in email)."""
    headlines = "\n".join([f"- {a['title']}" for a in articles[:5]])
    prompt = f"""Write a 3-4 sentence HTML paragraph summarising today's top news in {category}.
Use <strong> for key terms. Be concise and factual.
Headlines:
{headlines}
Return ONLY the HTML paragraph, no extra text."""
    return _ask_ollama(prompt) or f"<p>Top {category} news for today.</p>"
