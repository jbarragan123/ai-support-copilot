from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from schemas import TicketProcessRequest, TicketProcessResponse
from llm import analyze_ticket
from supabase_client import update_ticket

app = FastAPI(title="AI Support Copilot")

@app.post("/process-ticket", response_model=TicketProcessResponse)
def process_ticket(payload: TicketProcessRequest):
    try:
        result = analyze_ticket(payload.description)

        update_ticket(
            ticket_id=payload.ticket_id,
            category=result["category"],
            sentiment=result["sentiment"]
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
