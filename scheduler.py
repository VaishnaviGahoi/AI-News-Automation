"""
scheduler.py  —  Runs the pipeline daily at configured time
Run: python scheduler.py   (keep this terminal open)
"""
import schedule
import time
from config.settings import FETCH_HOUR, FETCH_MINUTE
from pipeline import run_pipeline

run_time = f"{FETCH_HOUR:02d}:{FETCH_MINUTE:02d}"
print(f"[Scheduler] Pipeline scheduled daily at {run_time}")
print("[Scheduler] Press Ctrl+C to stop.\n")

schedule.every().day.at(run_time).do(run_pipeline)

# Also run immediately once on start
run_pipeline()

while True:
    schedule.run_pending()
    time.sleep(60)
