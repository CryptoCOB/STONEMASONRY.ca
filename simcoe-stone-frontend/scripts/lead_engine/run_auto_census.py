"""
Run the census-prioritized auto-scraper for a fixed duration.

This script starts the background worker from modules.scraping.auto_scraper,
then keeps the process alive for the requested duration (default 6 hours),
printing periodic status updates from scraping_stats.
"""

import os
import sys
import time
from datetime import datetime, timedelta

# Ensure package imports work when run directly
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from modules.scraping.auto_scraper import start_automated_scraping, stop_automated_scraping
from modules.utils.config import scraping_stats, AUTO_SCRAPE_INTERVAL


def main(hours: int = 6):
    print(f"[AutoRun] Starting census-prioritized auto-scraper for {hours} hours...")
    msg = start_automated_scraping()
    print(f"[AutoRun] {msg}")

    end_time = datetime.now() + timedelta(hours=hours)
    last_report = None
    try:
        while datetime.now() < end_time:
            # Periodic status report every 5 minutes
            if last_report is None or (datetime.now() - last_report).total_seconds() >= 300:
                print(
                    f"[Status] running={scraping_stats.get('running')} "
                    f"cities_processed={scraping_stats.get('cities_processed')} "
                    f"total_scraped={scraping_stats.get('total_scraped')} "
                    f"last_run={scraping_stats.get('last_run')}"
                )
                last_report = datetime.now()
            time.sleep(5)
    except KeyboardInterrupt:
        print("[AutoRun] Interrupted, stopping...")
    finally:
        stop_automated_scraping()
        print("[AutoRun] Done.")


if __name__ == "__main__":
    # Optional CLI arg for hours
    hrs = 6
    if len(sys.argv) > 1:
        try:
            hrs = max(1, int(sys.argv[1]))
        except Exception:
            pass
    main(hrs)
