import os
import webbrowser
from flask import Flask, render_template, request, jsonify
from model import get_answer
import requests

# n8n Webhook URL to receive data
N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/c7762441-9ac6-4fde-ac9b-04f1b2a7e2ea"

app = Flask(__name__)

@app.route("/")
def home(): 
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.form["user_input"]
    answer = get_answer(user_input)

    # Send conversation data to n8n
    conversation_data = {
        "user_input": user_input,
        "bot_response": answer
    }
    
    try:
        response = requests.post(N8N_WEBHOOK_URL, json=conversation_data)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error sending data to n8n: {e}")

    return jsonify({"answer": answer})

if __name__ == "__main__":
    webbrowser.open('http://127.0.0.1:5001/')
    app.run(debug=True, port=5001)
