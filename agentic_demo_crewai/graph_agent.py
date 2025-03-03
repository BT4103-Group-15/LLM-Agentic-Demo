from pydantic import BaseModel

from langgraph.graph import Graph
from langgraph.graph import START, END, StateGraph
import ollama
from langchain_ollama import OllamaLLM
import pandas as pd

# Define the requirement document structure
requirement_columns = ["Requirement ID", "Description", "Priority", "Status"]
requirement_doc = pd.DataFrame(columns=requirement_columns)


# This state class to be determined, depending on how the email task is to be decomposed
class State(BaseModel):
    email_text: str  # input from http

    workflow_steps: int  # track cycle from agents


# Step 1: Extract requirements from the email
def extract_requirements(email_content: str) -> list[dict]:
    """
    Use the Ollama Mistral model to extract requirements from the email.
    """
    # Since the scoping sheet has 10 sub tables, we will loop through it
    response = ollama.generate(
        model="mistral",
        prompt="""
        # Task
        Extract software requirements from the following email:
        \n\n{email_content}\n\n 
        # Requirement: 
        Format the requirements as a list of dictionaries with keys:
         'Requirement ID', 'Description', 'Priority', 'Status'.
         """,
    )
    # Parse the response into a list of dictionaries
    requirements = eval(
        response["response"]
    )  # Assuming the model returns a valid Python list of dictionaries -> dangerous function
    return requirements


# Step 2: Update the requirement document
def update_requirement_doc(requirements: list[dict]) -> pd.DataFrame:
    """
    Update the requirement document with the extracted requirements.
    """
    global requirement_doc  # Does this need to be global?
    new_requirements = pd.DataFrame(requirements)
    requirement_doc = pd.concat([requirement_doc, new_requirements], ignore_index=True)
    return requirement_doc


# Step 3: Output the updated requirement document
def output_document(updated_doc: pd.DataFrame) -> None:
    """
    Print the updated requirement document.
    """
    print("Updated Requirement Document:")
    print(updated_doc)


# Define the LangGraph workflow
workflow = Graph()

# Add nodes to the workflow
workflow.add_node("extract_requirements", extract_requirements)
workflow.add_node("update_requirement_doc", update_requirement_doc)
workflow.add_node("output_document", output_document)

# Define the edges (flow of the workflow)
workflow.add_edge("extract_requirements", "update_requirement_doc")
workflow.add_edge("update_requirement_doc", "output_document")

# Set the entry point of the workflow
workflow.set_entry_point("extract_requirements")

# Compile the workflow
compiled_workflow = workflow.compile()


# Main function to run the workflow
def run_scoping_generator(email_content: str) -> str:
    """
    Wrapper method to run the scoping generator workflow.
    """
    # Sample Email
    # email_content = """
    # Hi Team,

    # Please add the following requirements to the project:
    # 1. Requirement ID: REQ001, Description: User authentication, Priority: High, Status: New
    # 2. Requirement ID: REQ002, Description: Data encryption, Priority: Medium, Status: New

    # Thanks,
    # John
    # """

    # Run the workflow with the email content as input
    scopingsheet_filled = compiled_workflow.invoke({"email_content": email_content})
    return scopingsheet_filled
