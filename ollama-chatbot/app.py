import os
import webbrowser
from flask import Flask, render_template, request, jsonify
from model import get_answer

app = Flask(__name__)

@app.route("/")
def home(): 
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.form["user_input"]
    answer = get_answer(user_input)  # Call the function from the model module
    return jsonify({"answer": answer})

if __name__ == "__main__":
    webbrowser.open('http://127.0.0.1:5001/')
    app.run(debug=True, port=5001)
