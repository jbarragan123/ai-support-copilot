from pydantic import BaseModel

class TicketProcessRequest(BaseModel):
    ticket_id: str
    description: str

class TicketProcessResponse(BaseModel):
    category: str
    sentiment: str
