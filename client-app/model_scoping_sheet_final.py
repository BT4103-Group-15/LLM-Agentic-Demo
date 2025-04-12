import re
import json
from langchain_ollama import OllamaLLM
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate

# Initialize storage for user responses
user_responses = {}
# Initialize the model and prompt template
model = OllamaLLM(model="mistral")

# Base template for the questions ( multiple choice) - to update with dynamic list of choices
multiple_choice_prompt = PromptTemplate(
    input_variables=["question","choices"],
    template="Provide a list of multiple-choice answers with a short explanation based on {choices} for the question: {question}. Format as multiple-choice answers."
)

# Base template for follow-up questions based on user input
followup_question_prompt = PromptTemplate(
    input_variables=["context"],
    template="Based on the user's previous answer: '{context}', ask a relevant follow-up question."
)

## To do: Handle "Other" responses

# Generate base questions
def generate_openEnded_questions(questions_base):
    return questions_base

# Generate multiple choice questions
def generate_multiple_choice_questions(questions_multiple_choice):
    questions_withLLM = questions_multiple_choice
    # Initializing LangChain
    chain = multiple_choice_prompt | model | StrOutputParser()
    # Gather multiple-choice Application questions with LLM

    for index, items in questions_multiple_choice.items():
        if questions_multiple_choice[index]["type"] == "mcq_multi":
            choices_text = chain.invoke({"question":questions_withLLM[index]["question"],"choices":questions_withLLM[index]["options"]})
            model_options = re.split(r'\d+\.\s*', choices_text)[1:]
            questions_withLLM[index]["text"] = model_options
    return questions_multiple_choice

## Define each section into functions

## Application Overview
def get_application_overview():
    application_overview_questions_base = {
        0:
            {
                "category": "Application Overview",
                "requirement":"Application Name",
                "question":"What is your application name?",
                "type": "open"
            },
        1:
            {
                "category": "Application Overview",
                "requirement":"Production URL",
                "question":"What is your production URL?",
                "type":"open"},
    }

    application_overview_questions_multiple_choice = {
        2:
            {
                "category": "Application Overview",
                "requirement":"Environment for Testing",
                "question":"What is your current environment for testing your application?",
                "type":"mcq_multi",
                "options": ["Production","Staging","Development"],
                "text":[]
            },
        3:
            {
                "category": "Application Overview",
                "requirement":"Application Type",
                "question":"What is your application type?",
                "type": "mcq_multi",
                "options": ["Web","API","Mobile","Desktop"],
                "text":[]
            }
    }
    generated_questions = generate_multiple_choice_questions(application_overview_questions_multiple_choice)
    generated_questions_dict = application_overview_questions_base | generated_questions
    return generated_questions_dict

## Authentication & Access Control
def get_authentication_access_control():
    authentication_access_control_questions = {
        4:
            {
                "category": "Authentication & Access Control",
                "requirement":"Authentication Method",
                "question":"What is your current authentication method for your application?",
                "type": "mcq_multi",
                "options": ["Username & Password","SSO","Development","OAuth","Certificate-based", "Other"],
                "text":[]
            },
        5:
            {
                "category": "Authentication & Access Control",
                "requirement":"User Roles",
                "question":"What are your user roles?",
                "type": "mcq_multi",
                "options": ["Anonymous Users","Regular Users","Power Users","Administrators","System Administrators"],
                "text":[]
            },
        6:
            {
                "category": "Authentication & Access Control",
                "requirement":"Custom Roles",
                "question":"Number of custom roles?",
                "type": "open"
            },
        7:
            {
                "category": "Authentication & Access Control",
                "requirement":"Session Management",
                "question":"How does your application manage its session?",
                "type":"mcq_multi",
                "options": ["JWT","Session Cookies","Custom Tokens Session"],
                "text":[]
            },
        8:
            {
                "category": "Authentication & Access Control",
                "requirement":"Session Timeout Period",
                "question":"What is the session timeout period (in minutes)?",
                "type": "open"
            },
    }
    generated_questions = generate_multiple_choice_questions(authentication_access_control_questions)
    return generated_questions

## Input Processing
def get_input_processing():
    input_processing_questions = {
        9:
            {
                "category": "Input Processing",
                "requirement":"total_num_input_fields",
                "question":"What is your total number of input fields?",
                "type": "open"
            },
        10:
            {
                "category":"Input Processing",
                "requirement":"Input Types Present",
                "question":"What are the input types present?",
                "type":"mcq_multi",
                "options": ["Free text fields","File uploads (Types allowed: .pdf, .png)","Rich text editors","Payment information","Personal data","Database queries","API calls"],
                "text":[]
            },
    }
    generated_questions = generate_multiple_choice_questions(input_processing_questions)
    return generated_questions

## Data Processing
def get_data_processing():
    data_processing_questions = {
        11:
            {
                "category":"Data Processing",
                "requirement":"Sensitive Data Handled",
                "question":"What types of sensitive data are going to be handled?",
                "type": "mcq_multi",
                "options": ["Personal Information","Financial Data","Healthcare Information","Government Data","Intellectual Property"],
                "text":[]
            },
        12:
            {
                "category":"Data Processing",
                "requirement":"Data Storage",
                "question":"What do you use for the data storage?",
                "type": "mcq_multi",
                "options": ["Local Database","Cloud Storage","Third-party Services","Distributed Systems"],
                "text":[]
            },
    }
    
    generated_questions = generate_multiple_choice_questions(data_processing_questions)
    return generated_questions

## API Details
def get_api_details():
    api_details_questions = {
        13:
            {
                "category":"API Details",
                "requirement":"Number of Endpoints",
                "question":"What is the number of API endpoints?",
                "type": "open"
            },
        14:
            {
                "category":"API Details",
                "requirement":"Authentication Required",
                "question":"Is Authentication required for API network?",
                "type":"mcq",
                "options": ["Yes","No"],
            },
        15:
            {
                "category":"API Details",
                "requirement":"Rate Limiting",
                "question":"Is there a rate limit?",
                "type":"mcq",
                "options": ["Yes","No"],
            },
        16:
            {
                "category":"API Details",
                "requirement":"Documentation Available",
                "question":"Is there documentation available on the API network?",
                "type":"mcq",
                "options": ["Yes","No"],
            },
        17:
            {
                "category":"API Details",
                "requirement":"API Methods",
                "question":"What are the API methods used?",
                "type":"mcq_multi",
                "options": ["GET","POST","PUT","DELETE","PATCH","Other"],
                "text":[]
            },
    }
    
    generated_questions = generate_multiple_choice_questions(api_details_questions)
    return generated_questions

## Infrastructure
def get_infrastructure():
    ## Need to ask for cloud platform
    infrastructure_questions = {
        18:
            {
                "category":"Infrastructure",
                "requirement":"Security Controls Present",
                "question":"What are the security controls present?",
                "type":"mcq_multi",
                "options": ["WAF","IPS/IDS","Load Balancer","Anti-DDoS","API Gateway" ],
                "text":[]
            },
        19:
            {
                "category":"Infrastructure",
                "requirement":"Hosting",
                "question":"Where do you host your application?",
                "type":"mcq_multi",
                "options": ["Cloud","On-premises","Hybrid"],
                "text":[]
            },
    }
    
    generated_questions = generate_multiple_choice_questions(infrastructure_questions)
    return generated_questions

## Business Logic
def get_business_logic():
    business_logic_questions = {
        20:
            {
                "category":"Business Logic",
                "requirement":"Critical Functions",
                "question":"What are the critical functions does your application handle?",
                "type":"mcq_multi",
                "options": ["Financial Transactions","User Data Management","Administrative Operations","System Configuration","Report Generation"],
                "text":[]
            },
    }
    generated_questions = generate_multiple_choice_questions(business_logic_questions)
    return generated_questions

## Security Requirements
def get_security_requirements():
    security_requirements_questions = {
        21:
            {
                "category":"Security Requirements",
                "requirement":"Compliance Requirements",
                "question":"What are the compliance required?",
                "type":"mcq_multi",
                "options": ["PCI DSS","HIPAA","GDPR","ISO 27001","SOC 2","Other"],
                "text":[]
            },
        22:
            {
                "category":"Security Requirements",
                "requirement":"Previous Testing",
                "question":"When was the last security assessment? Please answer in DD/MM/YYYY format",
                "type": "open"
            },
        23:
            {
                "category":"Security Requirements",
                "requirement":"Known Vulnerabilities",
                "question":"What were the known vulnerabilities reported?",
                "type": "open"
            },
        24:
            {
                "category":"Security Requirements",
                "requirement":"Critical Assets",
                "question":"What were the critical asset handled?",
                "type": "open"
            },
    }
    generated_questions = generate_multiple_choice_questions(security_requirements_questions)
    return generated_questions

## Testing constraints
def get_testing_contraints():
    testing_constraints_questions = {
        25:
            {
                "category":"Testing Constraints",
                "requirement":"Time Restrictions",
                "question":"When can we test your application?",
                "type":"mcq_multi",
                "options": ["During Business Hours only","24/7 Allowed","Specific Time Window"],
                "text":[]
            },
        26:
            {
                "category":"Testing Constraints",
                "requirement":"Testing Limitations",
                "question":"What testing limitations would you like to set?",
                "type":"mcq_multi",
                "options": ["No Destructive Testing","No Automated Scanning","No Performance Testing"],
                "text":[]
            },
    }
    generated_questions = generate_multiple_choice_questions(testing_constraints_questions)
    return generated_questions

## Deliverables
def get_deliverables():
    deliverables_questions = {
        27:
            {
                "category":"Deliverables",
                "requirement":"Required Reports",
                "question":"Which reports would you like to receive?",
                "type":"mcq_multi",
                "options": ["Executive Summary","Technical Details","Remediation Plan","Compliance Mapping","Risk Rating"],
                "text":[]
            },
    }
    generated_questions = generate_multiple_choice_questions(deliverables_questions)
    return generated_questions

## Additional Notes
def get_additional_notes():
    additional_notes_questions = {
        28:
            {
                "category":"Notes",
                "requirement":"Additional Information",
                "question":"Any additional information would you like to add?",
                "type": "open"
            },
    }
    return additional_notes_questions

## Sign off with Client Contact information
def get_client_contact_info():
    client_contact_info_questions = {
        29:
            {
                "category":"Client Contact Information",
                "requirement":"Client Email",
                "question":"Please add your email for future contact.",
                "type": "open"
            },
    }

    return client_contact_info_questions

# application_questions = get_application_overview()
# print(1)
# authentication_questions = get_authentication_access_control()
# print(authentication_questions)
# input_questions = get_input_processing()
# print(3)
data_questions = get_application_overview()
print(data_questions)
# api_questions = get_api_details()
# print(5)
# infrastructure_questions = get_infrastructure()
# print(6)
# business_questions = get_business_logic()
# print(7)
# security_questions = get_security_requirements()
# print(8)
# testing_questions = get_testing_contraints()
# print(9)
# deliverables_questions = get_deliverables()
# print(10)
# notes_questions = get_additional_notes()
# print(11)
# client_contact_questions = get_client_contact_info()
# print(12)

# final_questions = application_questions | authentication_questions | input_questions | data_questions| api_questions| infrastructure_questions| business_questions| security_questions|testing_questions|deliverables_questions|notes_questions|client_contact_questions
# with open('scoping_questions.json', 'w') as fp:
#     json.dump(final_questions, fp, indent=4)