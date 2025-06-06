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
    template="Provide a list of multiple-choice answers based on {choices} for the question: {question}. Format as a list."
)

# Base template for follow-up questions based on user input
followup_question_prompt = PromptTemplate(
    input_variables=["context"],
    template="Based on the user's previous answer: '{context}', ask a relevant follow-up question."
)

## To do: Handle "Other" responses

# Generate base questions
def generate_openEnded_questions(user_answers, questions_base):
    for question in questions_base:
        print("Bot:", question)
        user_response = input("You: ")
        user_answers[question] = user_response
    return user_answers

# Generate multiple choice questions
def generate_multiple_choice_questions(user_answers, questions_multiple_choice):
    # Initializing LangChain
    chain = multiple_choice_prompt | model | StrOutputParser()
    # Gather multiple-choice Application questions with LLM

    for question, options in questions_multiple_choice.items():
        print("\nBot:", question)

        # Generate multiple-choice options
        choices_text = chain.invoke({"question":question,"choices":options})
        model_options = choices_text.split("\n\n")  # Assuming AI returns options in newline format

        # Display options
        for option in model_options:
            print(option)

        # Get user selection (allow multiple choices)
        while True:
            user_input = input("You: Select one or more options (e.g., 1,3): ")
            try:
                choices = [int(choice.strip()) - 1 for choice in user_input.split(",") if choice.strip().isdigit()]
                
                if all(0 <= choice < len(options) for choice in choices):
                    user_answers[question] = [options[choice] for choice in choices]
                    break
                else:
                    print("Invalid choice(s). Please select valid numbers.")
            except ValueError:
                print("Invalid input. Please enter numbers separated by commas.")
    return user_answers

## Define each section into functions

## Application Overview
def get_application_overview(user_answers):
    application_overview_questions_base = [
        "What is your application name?",
        "What is your production URL?",
    ]

    application_overview_questions_multiple_choice = {
        "What is your current enviroment for testing?": 
            ["Production","Staging","Development"],
        "What is your application type?": 
            ["Web","API","Mobile","Desktop"]
    }
    
    # Gather Application questions without LLM
    user_answers = generate_openEnded_questions(user_answers,application_overview_questions_base)
    user_answers = generate_multiple_choice_questions(user_answers,application_overview_questions_multiple_choice)
    return user_answers

## Authentication & Access Control
def get_authentication_access_control(user_answers):
    authentication_access_control_question_base = [
    "Number of custom roles?", "What is the session timeout period (in minutes)?"
    ]

    authentication_access_control_questions_multiple_choice = {
        "What is your current authentication method for your application?": 
            ["Username & Password","SSO","Development","OAuth","Certificate-based", "Other"],
        "What are your user roles?": 
            ["Anonymous Users","Regular Users","Power Users","Administrators","System Administrators"],
        "How does your application manage its session?": 
            ["JWT","Session Cookies","Custom Tokens Session"]
    }
    user_answers = generate_multiple_choice_questions(user_answers,authentication_access_control_questions_multiple_choice)
    user_answers = generate_openEnded_questions(user_answers,authentication_access_control_question_base)
    return user_answers

## Input Processing
def get_input_processing(user_answers):
    input_processing_questions_base = [
    "What is your total number of input fields?",
    ]
    input_processing_questions_multiple_choice = {
        "What are the input types present?": 
        ["Free text fields",
         "File uploads (Types allowed: .pdf, .png)",
         "Rich text editors",
         "Payment information",
         "Personal data",
         "Database queries",
         "API calls"]
    }
    user_answers = generate_openEnded_questions(user_answers,input_processing_questions_base)
    user_answers = generate_multiple_choice_questions(user_answers,input_processing_questions_multiple_choice)
    return user_answers

## Data Processing
def get_data_processing(user_answers):
    data_processing_questions_multiple_choice = {
        "What types of sensitive data are going to be handled?": 
            [
                "Personal Information",
                "Financial Data",
                "Healthcare Information",
                "Government Data",
                "Intellectual Property" 
            ],
        "What do you use for the data storage?": 
            [
                "Local Database",
                "Cloud Storage",
                "Third-party Services",
                "Distributed Systems",
            ]
    }
    user_answers = generate_multiple_choice_questions(user_answers,data_processing_questions_multiple_choice)
    return user_answers

## API Details
def get_api_details(user_answers):
    api_details_questions_base = [
        "What is the number of API endpoints?",
        "Is Authentication required for API network?",
        "Is there a rate limit?",
        "Is there documentation available on the API network?"
    ]

    api_details_questions_multiple_choice = {
        "What are the API methods used?": 
            ["GET","POST","PUT","DELETE","PATCH","Other"],
    }
    user_answers = generate_openEnded_questions(user_answers,api_details_questions_base)
    user_answers = generate_multiple_choice_questions(user_answers,api_details_questions_multiple_choice)
    if "Other" in user_answers["What are the API methods used?"]:
        question = "What other API methods are in use?"
        print("Bot:", question)
        user_response = input("You: ")
        user_answers[question] = user_response
    return user_answers

## Infrastructure
def get_infrastructure(user_answers):
    infrastructure_questions_multiple_choice = {
        "What are the security controls present?": 
            [
                "WAF",
                "IPS/IDS",
                "Load Balancer",
                "Anti-DDoS",
                "API Gateway" 
            ],
        "Where do you host your application?": 
            [
                "Cloud",
                "On-premises",
                "Hybrid",
            ]
    }
    user_answers = generate_multiple_choice_questions(user_answers,infrastructure_questions_multiple_choice)
    if "Cloud" in user_answers["Where do you host your application?"]:
        question = "Which Cloud platform is used for your hosting needs?"
        print("Bot:", question)
        user_response = input("You: ")
        user_answers[question] = user_response
    return user_answers

## Business Logic
def get_business_logic(user_answers):
    business_logic_questions_multiple_choice = {
        "What are the critical functions does your application handle?": 
            [
                "Financial Transactions",
                "User Data Management",
                "Administrative Operations",
                "System Configuration",
                "Report Generation" 
            ],
    }
    user_answers = generate_multiple_choice_questions(user_answers,business_logic_questions_multiple_choice)
    return user_answers

## Security Requirements
def get_security_requirements(user_answers):
    infrastructure_questions_base = [
        "When was the last security assessment? Please answer in DD/MM/YYYY format",
        "What were the known vulnerabilities reported?",
        "What were the critical assest handled?",
    ]
    infrastructure_questions_multiple_choice = {
        "What are the compliance required?": 
            [
                "PCI DSS",
                "HIPAA",
                "GDPR",
                "ISO 27001",
                "SOC 2",
                "Other"
            ],
    }
    user_answers = generate_multiple_choice_questions(user_answers,infrastructure_questions_multiple_choice)
    if "Other" in user_answers["What are the compliance required?"]:
        question = "what other compliance requirements are needed?"
        print("Bot:", question)
        user_response = input("You: ")
        user_answers[question] = user_response
    user_answers = generate_openEnded_questions(user_answers,infrastructure_questions_base)
    return user_answers

## Testing constraints
def get_testing_contraints(user_answers):
    testing_constraints_questions_multiple_choice = {
        "When can we test your application?": 
            [
                "During Business Hours only",
                "24/7 Allowed",
                "Specific Time Window",
            ],
    }
    user_answers = generate_multiple_choice_questions(user_answers,testing_constraints_questions_multiple_choice)
    if "Specific Time Window" in user_answers["When can we test your application?"]:
        question = "Please specific a time window where we can conduct our testing."
        print("Bot:", question)
        user_response = input("You: ")
        user_answers[question] = user_response
    return user_answers

## Deliverables -- to exclude as staff will need to discuss with client on it

## Additional Notes -- to exclude as staff will need to discuss with the client

## Sign off with Client Contact information

user_responses = get_application_overview(user_responses)
user_responses = get_authentication_access_control(user_responses)
print("\nCollected Information:")
for q, a in user_responses.items():
    print(f"{q} - {a}")