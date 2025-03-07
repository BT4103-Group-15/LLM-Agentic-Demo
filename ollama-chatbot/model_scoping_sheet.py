from langchain_ollama import OllamaLLM
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate

# Initialize storage for user responses
user_responses = {}
# Initialize the model and prompt template
model = OllamaLLM(model="mistral")

# Base template for the questions ( multiple choice)
multiple_choice_prompt = PromptTemplate(
    input_variables=["question","choices"],
    template="Provide four multiple-choice answers based on {choices} for the question: {question}. Format as a list."
)

# Base template for follow-up questions based on user input
followup_question_prompt = PromptTemplate(
    input_variables=["context"],
    template="Based on the user's previous answer: '{context}', ask a relevant follow-up question."
)

## Define each section into functions

## Application Overview
application_overview_questions_base = [
    "What is your application name?",
    "What is your production URL?",
]

application_overview_questions_multiple_choice = {
    "What is your current enviroment for testing?": ["Production","Staging","Development"],
    "what is your application type?": ["Web","API","Mobile","Desktop"]
}
# Gather Application questions without LLM
for question in application_overview_questions_base:
    print("Bot:", question)
    user_response = input("You: ")
    user_responses[question] = user_response

# Initializing LangChain
application_overview_chain = multiple_choice_prompt | model | StrOutputParser()
# Gather multiple-choice Application questions with LLM

for question, options in application_overview_questions_multiple_choice.items():
    print("\nBot:", question)

    # Generate multiple-choice options
    choices_text = application_overview_chain.invoke({"question":question,"choices":options})
    model_options = choices_text.split("\n\n")  # Assuming AI returns options in newline format

    # Display options
    for option in model_options:
        print(option)

    # Get user selection (allow multiple choices)
    while True:
        user_input = input("Select one or more options (e.g., 1,3): ")
        try:
            choices = [int(choice.strip()) - 1 for choice in user_input.split(",") if choice.strip().isdigit()]
            
            if all(0 <= choice < len(options) for choice in choices):
                user_responses[question] = [options[choice] for choice in choices]
                break
            else:
                print("Invalid choice(s). Please select valid numbers.")
        except ValueError:
            print("Invalid input. Please enter numbers separated by commas.")

print("\nCollected Information:")
for q, a in user_responses.items():
    print(f"{q} - {a}")

## Authentication & Access Control

## Input Processing

## Data Processing

## API Details

## Infrastructure

## Business Logic

## Security Requirements

## Testing constraints

## Deliverables

## Additional Notes

## Sign off with Client Contact information
