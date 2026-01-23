import os
import requests
from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL is not set")

if not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_KEY is not set")


def update_ticket(ticket_id: str, category: str, sentiment: str):
    url = f"{SUPABASE_URL}/rest/v1/tickets?id=eq.{ticket_id}"

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    payload = {
        "category": category,
        "sentiment": sentiment,
        "processed": True
    }

    response = requests.patch(url, json=payload, headers=headers)

    if response.status_code >= 400:
        raise RuntimeError(
            f"Supabase update failed: {response.status_code} - {response.text}"
        )
