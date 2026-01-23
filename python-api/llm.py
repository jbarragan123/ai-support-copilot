from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
import json
import os

llm = ChatOpenAI(
    temperature=0,
    model="gpt-4o-mini",
    api_key=os.getenv("OPENAI_API_KEY")
)

PROMPT = """
You are an AI support assistant.

Analyze the following support ticket and return a JSON object with:
- category: one of [Technical, Billing, Sales]
- sentiment: one of [Positive, Neutral, Negative]

Ticket:
"{ticket_text}"

Respond ONLY with valid JSON.
"""

def analyze_ticket(ticket_text: str) -> dict:
    if not ticket_text or not ticket_text.strip():
        raise ValueError("Ticket text is empty")

    prompt = PromptTemplate(
        input_variables=["ticket_text"],
        template=PROMPT
    )

    response = llm.invoke(
        prompt.format(ticket_text=ticket_text)
    )

    raw_content = response.content.strip()

    if raw_content.startswith("```"):
        raw_content = raw_content.strip("`")
        raw_content = raw_content.replace("json\n", "", 1).strip()

    try:
        return json.loads(raw_content)
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON returned by LLM: {raw_content}")
