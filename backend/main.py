from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class Transaction(BaseModel):
    id: int
    amount: float
    desc: str
    timestamp: str
    status: str

app = FastAPI()
app.add_middleware( CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"], )

@app.post("/explain")
async def explain_transaction(tx: Transaction):
    prompt = (
        f"You are a bank support agent speaking to a Nigerian customer. Explain the transaction in clear, simple English, like you are talking to someone who just wants to understand what happened without stress. Use a friendly and calm tone. Avoid banking jargon. Be short, straight to the point, and explain the meaning of any confusing charge. If the transaction is a fee or levy, explain why the bank removed the money. For example, if you see something like “SMS Alert Charge -₦948.00”, explain that it is the banks charge for sending SMS alerts for transactions, but the amount looks unusually high because as analyzed, the network has not been good enough to allow the bank remove them instantly and now this is the cumulative sum. If something looks suspicious or out of the normal range, gently warn the customer. Keep the explanation under 3 sentences and make it very easy to read. Description: {tx.desc} Amount: {tx.amount} NGN Time: {tx.timestamp}Status: {tx.status}"
    )
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return {"explanation": response.text}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
