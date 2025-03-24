import os
import json
import webbrowser
from flask import Flask, render_template, request, jsonify
from model import get_answer
#from model_scoping_sheet import get_application_overview, get_api_details, get_authentication_access_control, get_business_logic, get_data_processing, get_infrastructure, get_input_processing, get_security_requirements, get_testing_contraints
#from model_scoping_sheet_final import get_application_overview
app = Flask(__name__)

scoping_questions = {}
with open('scoping_questions.json', 'r') as file:
    scoping_data = file.read()
scoping_questions = json.loads(scoping_data)
scoping_questions = {int(k): v for k, v in scoping_questions.items()}
requirement_df = []
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
        scoping_requirements = {}
        # requirement_df : [{category: "Application Overview", requirement:"Application Name",status:"finsecure"}]
        scoping_requirements["category"] = scoping_questions[index-1]["category"]
        scoping_requirements["requirement"] = scoping_questions[index-1]["requirement"]
        scoping_requirements["status"] = answer  # Store previous response
        requirement_df.append(scoping_requirements)
        scoping_requirements = {}

    if index in scoping_questions:
        question_data = scoping_questions[index]
        response_data = {
            "message": question_data["question"],
            "type": question_data["type"],
            "index": index + 1
        }

        if "options" in question_data:
            response_data["options"] = question_data["options"]  # Send options for MCQ
            if question_data["type"] == "mcq_multi":
                response_data["text"] = question_data["text"]

        return jsonify(response_data)
    else:
        print(requirement_df)
        return jsonify({"message": "Thanks for your responses!"})

if __name__ == "__main__":
    webbrowser.open('http://127.0.0.1:5001/')
    app.run(debug=True, port=5001)


## Flow of application
# Model scoping sheet -> generate the list of questions + LLM , save it in a final questions + options list
# Create the whole list of questions, save it to scoping_questions.json
# app.py to create the for loop of the whole list of questions for back and forth user input (done)
# save it to scoping_requirements > requirement_df (done)
# create function to generate markdown + requirement_df to send it over to n8n
