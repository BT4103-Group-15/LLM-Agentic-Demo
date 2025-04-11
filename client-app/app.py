import os
import json
import webbrowser
from flask import Flask, render_template, request, jsonify
from model import get_answer
from scoping_sheet import create_markdown, send_to_n8n_google_drive
import threading
app = Flask(__name__)

scoping_questions = {}
with open('scoping_questions.json', 'r') as file:
    scoping_data = file.read()
scoping_questions = json.loads(scoping_data)
scoping_questions = {int(k): v for k, v in scoping_questions.items()}
#print(scoping_questions)
requirement_df = []
client_info = ""
#print(scoping_questions[0])

@app.route("/")
def home(): 
    return render_template("index.html")

def ask(user_input):
    answer = get_answer(user_input)  # Call the function from the model module
    return answer

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    index = data.get('index', 0)
    answer = data.get('answer')
    in_query_mode = data.get('in_query_mode', False) # check if in query mode

    if not in_query_mode:
        if index > 0:
            scoping_requirements = {}
            # requirement_df : [{category: "Application Overview", requirement:"Application Name",status:"finsecure"}]
            scoping_requirements["category"] = scoping_questions[index-1]["category"]
            scoping_requirements["requirement"] = scoping_questions[index-1]["requirement"]
            scoping_requirements["status"] = answer  # Store previous response
            requirement_df.append(scoping_requirements)
            if scoping_questions[index-1]["category"] == "Client Contact Information":
                client_info = answer
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
        ## FR 21 - Answer Client's additional questions
        else:
            print(requirement_df)
            print(client_info)
            # send requirement_df to generate markdown asyc
            thread = threading.Thread(target=create_markdown, args=(requirement_df,client_info,))
            thread.start()
            # send json response to n8n and save the file to google drive
            #return jsonify({"message": "Thanks for your responses Your request is currently pending for the sales team approval!"})
            return jsonify({
                "message": "Thanks for your responses Your request is currently pending for the sales team approval! In the mean time, do you have any questions for us? If not, please answer with 'no'.",
                "query_prompt": True,  # frontend will handle this
                "index": index,
                "in_query_mode": True
            })
    else:
        print("here")
        # Handle post-Q&A user queries
        if answer.lower() in ["no", "nope", "none"]:
            return jsonify({
                "message": "Thank you! The session has ended.",
                "terminate": True
            })
        else:
            # Here you'd integrate your SLM/LLM (like Mistral or GPT)
            bot_response = ask(answer)
            bot_response = bot_response + "Do you have any additional questions for us? If not, please answer with 'no'."
            return jsonify({
                "message": bot_response,
                "in_query_mode": True
            })

if __name__ == "__main__":
    webbrowser.open('http://127.0.0.1:5001/')
    app.run(debug=True, port=5001, use_reloader= False)


## Flow of application
# Model scoping sheet -> generate the list of questions + LLM , save it in a final questions + options list
# Create the whole list of questions, save it to scoping_questions.json
# app.py to create the for loop of the whole list of questions for back and forth user input (done)
# save it to scoping_requirements > requirement_df (done)
# create function to generate markdown + requirement_df to send it over to n8n
# document down how to run on local host ( via command prompt)
