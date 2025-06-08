import os
import openai
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def chat():
    print("Ask something (type 'exit' to quit):")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": user_input}]
            )
            answer = response['choices'][0]['message']['content']
            print("GPT-4:", answer.strip())
        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    chat()
