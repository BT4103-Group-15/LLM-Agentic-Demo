from pathlib import Path
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
import mysql.connector # need to pip install mysql-connector-python
from dotenv import load_dotenv

model = OllamaLLM(model="mistral")

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# mysql db connection
conn = mysql.connector.connect(
    host="localhost",
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

# to generate markdown of the requirement df
def create_markdown(requirement_df, client_info):
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
    # Get client id from db
    scoping_requirement_response["id"] = get_create_client_info_from_db(client_info[1],client_info[2],client_info[0])
    scoping_requirement_response["email"] = client_info[0]
    scoping_requirement_response["scopingsheet_markdown"] = str_output
    scoping_requirement_response["requirement_df"] = requirement_df
    scoping_requirement_response["timestamp"] = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    email_json = re.sub(r"[^a-zA-Z0-9_.-]", "_", client_info[0])
    file_name = f"{email_json}_{scoping_requirement_response["timestamp"]}.json"
    with open(file_name, 'w') as fp:
        json.dump(scoping_requirement_response, fp, indent=4)
    print("json response created")
    n8n_response = send_to_n8n_google_drive(file_name)
    print(n8n_response)
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
    url = "http://localhost:5678/webhook-test/6c05037c-6a05-4e3d-99df-b9bda4eabec2"

    # Load JSON file
    with open(filename, "r") as file:
        json_data = json.load(file)

    # Send POST request
    response = requests.post(url, json=json_data, headers={"Content-Type": "application/json"})
    
    # save to google drive file
    send_to_drive(filename)
    
    return response.status_code, response.json()

def get_create_client_info_from_db(company_name, client_name, email):
    cursor = conn.cursor()
    cursor.execute("SELECT client_id FROM clients WHERE company_name = %s", (company_name,))
    result = cursor.fetchone()

    if result:
        return result[0]
    else:
        cursor.execute(
            "INSERT INTO clients (company_name, contact_name ,email) VALUES (%s, %s,%s)",
            (company_name, client_name, email)
        )
        conn.commit()
        return cursor.lastrowid

# filename = "aliceBrown_outlook.com_2025-03-31_20-20-03.json"
# response_n8n = send_to_n8n_google_drive(filename)
# print(response_n8n)

