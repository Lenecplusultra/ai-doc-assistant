from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import openai

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    message: str

@app.post("/chat")
async def chat(query: Query):
    try:
        print("Received message:", query.message)  # Debug
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # make sure you're using a model you have access to
            messages=[{"role": "user", "content": query.message}]
        )
        print("OpenAI raw response:", response)  # Debug
        answer = response.choices[0].message.content
        return {"response": answer.strip()}
    except Exception as e:
        print("❌ BACKEND ERROR:", str(e))  # <- this will show the actual cause
        raise HTTPException(status_code=500, detail=str(e))
