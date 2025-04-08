import re
import json
import os
import requests
from langchain_ollama import OllamaLLM
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
import pandas as pd
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
from datetime import datetime

model = OllamaLLM(model="mistral")

# to generate markdown of the requirement df
def create_markdown(requirement_df, email):
    # Convert the updated document to markdown
    markdown_content = pd.DataFrame(
        requirement_df
    ).to_markdown()
    #print(markdown_content)
    template_for_md = """
    Create a markdown file for the scoping sheet based on the dataframe {scoping_df} given.

    """
    md_prompt = ChatPromptTemplate.from_template(template_for_md)
    chain = md_prompt | model | StrOutputParser()

    str_output = chain.invoke(
        {
            "scoping_df": markdown_content,
        }
    )
    
    print("Markdown Document:")
    print(str_output)
    print("Markdown generation Done. Now creating the json response and sending it to n8n.")
    # creating local json file to store the response to send to n8n
    scoping_requirement_response = {}
    # scoping_requirement_response["id"] = 1
    scoping_requirement_response["email"] = email
    scoping_requirement_response["scopingsheet_markdown"] = str_output
    scoping_requirement_response["requirement_df"] = requirement_df
    scoping_requirement_response["timestamp"] = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    email_json = re.sub(r"[^a-zA-Z0-9_.-]", "_", email)
    file_name = f"{email_json}_{scoping_requirement_response["timestamp"]}.json"
    with open(file_name, 'w') as fp:
        json.dump(scoping_requirement_response, fp, indent=4)
    print("json response created")
    send_to_n8n_google_drive(file_name)
    #return str_output
# save the file to google drive
# need to pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client

def send_to_drive(json_file_name):
    # 134099195066-lj0433ibnbl53mbk975qre1av4so9sli.apps.googleusercontent.com
    # Load service account credentials
    # filename = "aliceBrown_outlook.com_2025-03-31_20-20-03.json"
    #SCOPES = ["C:\Users\mingy\Documents\USB Files Backup\University\Y3 Semester 2\BT4103\Project\LLM-Agentic-Demo\ollama-chatbot\fluent-stratum-433010-t7-d5618f5c508f.json"]
    #SERVICE_ACCOUNT_FILE = "scoping-agent-chatbot@fluent-stratum-433010-t7.iam.gserviceaccount.com"  # Your service account JSON    
    #creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    SERVICE_ACCOUNT_FILE = os.path.join(current_dir, "fluent-stratum-433010-t7-d5618f5c508f.json")
    # fluent-stratum-433010-t7-d5618f5c508f.json
    SCOPES = ['https://www.googleapis.com/auth/drive.file']

    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    json_file_path = os.path.join(current_dir, json_file_name)
    
    drive_service = build("drive", "v3", credentials=creds)

    # Define the file and shared folder ID
    file_metadata = {
        "name": json_file_name,  # File name on Google Drive
        "parents": ["138uy4jq9uOXjJmH4NWZ8sRhj64gFHiax"]  # Replace with the shared folder ID
    }
    media = MediaFileUpload(json_file_path, mimetype="application/json")

    # Upload the file
    file = drive_service.files().create(body=file_metadata, media_body=media, fields="id").execute()
    print(f"File uploaded successfully! File ID: {file.get('id')}")


# link to n8n
def send_to_n8n_google_drive(filename):
    # get http endpoint

    # API endpoint on n8n
    url = "http://localhost:5678/webhook/5a0cd093-a0ed-404a-bfa1-be712355a441"

    # Load JSON file
    with open(filename, "r") as file:
        json_data = json.load(file)

    # Send POST request
    response = requests.post(url, json=json_data, headers={"Content-Type": "application/json"})
    
    # save to google drive file
    send_to_drive(filename)
    # Print response
    return response.status_code, response.json()


#filename = "aliceBrown_outlook.com_2025-03-31_20-20-03.json"
#send_to_drive(filename)

