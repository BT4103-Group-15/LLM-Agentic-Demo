from pydantic import BaseModel

# from langgraph.graph import Graph # For simple with typed input output labelling
from langgraph.graph import START, END, StateGraph  # for State managed Graphs

# import ollama # Direct version, does not accept prompt template
from langchain_core.prompts import ChatPromptTemplate  # For formatting purposes
from langchain_ollama import OllamaLLM  # for LangChain version
import pandas as pd


###################################################################################################
# Local Model Initialisation via LangChain
###################################################################################################
mistral_7b_local = OllamaLLM(model="mistral")
llama3_8b_local = OllamaLLM(model="llama3.1")
qwen_2p5b_local = OllamaLLM(model="qwen2.5:14b")


###################################################################################################
# State Definitions
###################################################################################################
class InputState(BaseModel):
    """
    Data definition of the http input from fastAPI
    """

    email_text: str
    requirement_df: list[dict]  # confirm type from HTTP request


# This state class to be determined, depending on how the email task is to be decomposed
class OverAllState(BaseModel):
    """
    Data model to track
    1. email text from the Client
    2. Requirement Dataframe which is to be filled for the Client
    3. Workflow Steps to track and optimise agentic behaviour

    Overall State must contain all subfields from other states [input, output]
    """

    email_text: str  # input from http
    requirement_df: list[dict]  # Convert this into a pandas dataframe?
    scopingsheet_markdown: str
    workflow_steps: int  # track cycle from agents


class OutputState(BaseModel):
    """
    Data model to track
    1. email text from the Client
    2. Requirement Dataframe which is to be filled for the Client
    3. Workflow Steps to track and optimise agentic behaviour
    """

    scopingsheet_markdown: str  # output the markdown of the scoping sheet.
    requirement_df: list[dict]  # take from the http request


###################################################################################################
# Node Definitions
###################################################################################################


# Step 1: Extract requirements from the email -> update the dataframe
def extract_requirements(state: InputState) -> OverAllState:
    # The output here does not affect input of the next step
    """
    Use the Ollama Mistral model to extract requirements from the email.
    Going through each requirement one at a time, the function will feed the local LLM with
    the specific requirement and the full email text to extract the requirement.
    It will then update the requirement document which is a pandas dataframe.

    Note: Data types of each requirement can be added with eval() in future versions 2.0
    """
    # Since the scoping sheet has 10 sub tables, we will loop through it
    template = """
    # Role
    You are a seasoned software security tester with experience in penetration testing. You
    are tasked with extracting software requirements from the clients email before conducting
    a software security test.

    # Task
    Extract a specific software requirement from the following email.

    # Output Format
    1. If the requirement is not clear enough, please output NA as the output string.
    2. If the requirements are clear, output the extracted requirement in short phrases
    under 10 words.

    # Software Requirement: {the_requirement}

    # Email:
    \n\n{email_content}\n\n
    """
    requirement_dataframe = pd.DataFrame(state["requirement_df"])
    status_column = []
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | mistral_7b_local
    for index, requirement in requirement_dataframe.iterrows():
        req_string = ", ".join(requirement.astype(str))
        req_status = chain.invoke(
            {
                "email_content": state["email_text"],
                "the_requirement": req_string,  # str from row of dataframe
            }
        )
        status_column.append(req_status)
    requirement_dataframe["status"] = status_column
    return {
        "email_text": state["email_text"],
        "requirement_df": requirement_dataframe,  # pandas dataframe
    }


# Step 3: Output the scoping sheet in markdown format
def create_markdown(state: OverAllState):
    """
    Output the scoping sheet in markdown
    """
    # Convert the updated document to markdown
    markdown_content = pd.DataFrame(
        state["requirement_df"]
    ).to_markdown()  # pandas function -> add this plus formatting
    template_for_md = """
    Create a markdown file for the scoping sheet. Follow the format of this template. (insert template file)

    # Scoping Sheet:
    {scopingsheet_md}

    # Template:
    {template_for_md}
    """
    md_prompt = ChatPromptTemplate.from_template(template_for_md)
    chain = md_prompt | mistral_7b_local
    return {
        "scopingsheet_markdown": chain.invoke(
            {"scopingsheet_md": markdown_content, "template_for_md": template_for_md}
        ),
    }


# Step 4: Print the updated requirement document
def output_document(state: OverAllState) -> OutputState:
    """
    Print the updated requirement document.
    """
    print("Updated Requirement Document:")
    print(state["requirement_df"])
    return {
        "scopingsheet_markdown": state["scopingsheet_markdown"],
        "requirement_df": state["requirement_df"],
    }  # Printing for debugging purposes


###################################################################################################
# LangGraph workflow
###################################################################################################
workflow = StateGraph(
    OverAllState, input=InputState, output=OutputState
)  # Takes note of the state

# Add nodes to the workflow
workflow.add_node("extract_requirements", extract_requirements)
workflow.add_node("create_markdown", create_markdown)
workflow.add_node("output_document", output_document)

# Define the edges (flow of the workflow)
workflow.add_edge(START, "extract_requirements")
workflow.add_edge("extract_requirements", "create_markdown")
workflow.add_edge("create_markdown", "output_document")

workflow.set_entry_point("extract_requirements")  # already has START node

compiled_workflow = workflow.compile()  # Graph is compiled


###################################################################################################
# Scoping Generator Method
###################################################################################################
def run_scoping_generator(email_content: str) -> str:
    """
    Wrapper method to run the scoping generator workflow.
    """
    # To fix this input type again on sunday
    scopingsheet_filled = compiled_workflow.invoke({"email_content": email_content})
    return scopingsheet_filled
