import os
import json
import webbrowser
from flask import Flask, render_template, request, jsonify
from model import get_answer
#from model_scoping_sheet import get_application_overview, get_api_details, get_authentication_access_control, get_business_logic, get_data_processing, get_infrastructure, get_input_processing, get_security_requirements, get_testing_contraints
#from model_scoping_sheet_final import get_application_overview
app = Flask(__name__)

scoping_requirements = {}
scoping_questions = {}
with open('scoping_questions.json', 'r') as file:
    scoping_data = file.read()
scoping_questions = json.loads(scoping_data)
scoping_questions = {int(k): v for k, v in scoping_questions.items()}
#print(scoping_questions[0])

@app.route("/")
def home(): 
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    # ask the client to input their contact information to start chatting
    user_input = request.form["user_input"]
    answer = get_answer(user_input)  # Call the function from the model module
    return jsonify({"answer": answer})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    index = data.get('index', 0)
    answer = data.get('answer')

    if index > 0:
        scoping_requirements[index - 1] = answer  # Store previous response

    if index in scoping_questions:
        question_data = scoping_questions[index]
        response_data = {
            "message": question_data["question"],
            "type": question_data["type"],
            "index": index + 1
        }

        if "options" in question_data:
            response_data["options"] = question_data["options"]  # Send options for MCQ

        return jsonify(response_data)
    else:
        print(scoping_requirements)
        return jsonify({"message": "Thanks for your responses!", "responses": scoping_requirements})

if __name__ == "__main__":
    webbrowser.open('http://127.0.0.1:5001/')
    app.run(debug=True, port=5001)


## Flow of application
# Model scoping sheet -> generate the list of questions + LLM , save it in a final questions + options list
# app.py to create the for loop of the whole list of questions for back and forth user input
# save it to scoping_requirements
# create function to format scoping requirements to send it over to n8n
