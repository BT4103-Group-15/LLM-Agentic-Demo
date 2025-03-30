import re
import json
import requests
from langchain_ollama import OllamaLLM
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
import pandas as pd
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account

model = OllamaLLM(model="mistral")

# to generate markdown of the requirement df
def create_markdown(requirement_df):
    # Convert the updated document to markdown
    markdown_content = pd.DataFrame(
        requirement_df
    ).to_markdown()
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
    return str_output
# save the file to google drive
# need to pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client

def send_to_drive(json_file_name):
    # 134099195066-lj0433ibnbl53mbk975qre1av4so9sli.apps.googleusercontent.com
    # Load service account credentials
    SCOPES = ["https://www.googleapis.com/auth/drive.file"]
    SERVICE_ACCOUNT_FILE = "scoping-agent-chatbot@fluent-stratum-433010-t7.iam.gserviceaccount.com"  # Your service account JSON

    creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    drive_service = build("drive", "v3", credentials=creds)

    # Define the file and shared folder ID
    file_metadata = {
        "name": json_file_name,  # File name on Google Drive
        "parents": ["138uy4jq9uOXjJmH4NWZ8sRhj64gFHiax"]  # Replace with the shared folder ID
    }
    media = MediaFileUpload(json_file_name, mimetype="application/json")

    # Upload the file
    file = drive_service.files().create(body=file_metadata, media_body=media, fields="id").execute()
    print(f"File uploaded successfully! File ID: {file.get('id')}")
    
    return 0


# link to n8n
def send_to_n8n_google_drive():
    # get http endpoint

    # API endpoint on n8n
    url = "https://example.com/api/upload"

    # Load JSON file
    with open("data.json", "r") as file:
        json_data = json.load(file)

    # Send POST request
    response = requests.post(url, json=json_data, headers={"Content-Type": "application/json"})
    
    # save to google drive file
    send_to_drive(json_data)
    # Print response
    return response.status_code, response.json()

