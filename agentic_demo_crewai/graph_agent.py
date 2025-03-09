from pydantic import BaseModel

# from langgraph.graph import Graph # For simple with typed input output labelling
from langgraph.graph import START, StateGraph  # for State managed Graphs

# import ollama # Direct version, does not accept prompt template
from langchain_core.prompts import ChatPromptTemplate  # For formatting purposes
from langchain_core.output_parsers import (
    StrOutputParser,
)  # extracting .content : model agnostic
from langchain.schema.runnable import RunnableSequence
from langchain_ollama import OllamaLLM  # for LangChain version
import pandas as pd

from schemas import RequirementItem  # Confirm the path
from typing import List

# for Groq credentials
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

###################################################################################################
# Local Model Initialisation via LangChain
###################################################################################################
# Groq is for development, for production use OllamaLLM
from langchain_groq import ChatGroq  # llm invocation output differs from OllamaLLM

# The structure of groq model.invoke():
# content : the response string
# additional_kwargs : not sure what this is yet
# response_metadata :
#   token_usage:{...}, model_name="str", system_fingerprint, finish_reason: good = stop
# id='to track and monitor chat id',
# usage_metadata : {...},

mistral_7b_local = OllamaLLM(model="mistral")
llama3_8b_local = OllamaLLM(model="llama3.1")
qwen_2p5b_local = OllamaLLM(model="qwen2.5:14b")

groq_api_key = api_key  # move into dotenv
# llm = ChatGroq(
#     groq_api_key=groq_api_key, model_name="llama-3.3-70b-versatile", temperature=0.7
# ) # Rate limit exceeded
llm = ChatGroq(groq_api_key=groq_api_key, model_name="gemma2-9b-it", temperature=0.3)


###################################################################################################
# State Definitions
###################################################################################################
class InputState(BaseModel):
    """
    Data definition of the http input from fastAPI
    """

    email_text: str
    requirement_df: list[RequirementItem]  # confirm type from HTTP request


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
    # requirement_df: pd.DataFrame  not allowed in pydantic framework
    requirement_df: list[dict]  # standard
    scopingsheet_markdown: str
    workflow_steps: int  # track cycle from agents

    model_config = {"arbitrary_types_allowed": True}


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
    Using Mistral model from OllamaLLM to extract requirements from the email.
    Going through each requirement one at a time, the function will feed the local LLM with
    the specific requirement and the full email text to extract the requirement.
    It will then update the requirement document which is a pandas dataframe.

    Note: Data types of each requirement can be added with eval() in future versions 2.0
    """
    # Since the scoping sheet has 10 sub tables, we will loop through it
    req_extraction_template = """
    # Role
    You are a seasoned software security tester with experience in penetration testing and are
    tasked with extracting software requirements from the clients email before conducting
    a software security test.

    # Task
    Extract this software requirement: {the_requirement}
    from the following email: 
    {email_content}

    # Output Format
    1. If the requirement is not clear enough, please output NA only.
    2. Else, output the extracted requirement in point form, do not include any reasoning.
    3. DO NOT OUTPUT ANYTHING ELSE OTHER THAN THE REQUIREMENT OR NA
    """
    req_checking_template = """
    # Task
    Please ensure that the requirement gathered here is not verbose and only mentions the relevant
    content. If is appears as NA, output NA only.
    # Requirement:
    {requirement_row} 
    """
    requirement_dataframe = pd.DataFrame(
        state.requirement_df
    )  # already converts to DF here
    status_column = []
    extraction_prompt = ChatPromptTemplate.from_template(req_extraction_template)
    qa_prompt = ChatPromptTemplate.from_template(req_checking_template)
    step1 = extraction_prompt | llm | StrOutputParser()  # Extracts the "content" string
    step2 = qa_prompt | llm | StrOutputParser()

    extraction_chain = step1 | step2  # Chaining the two prompts
    for index, requirement in requirement_dataframe.iterrows():
        req_string = str(index) + ", ".join(
            requirement.astype(str)
        )  # will this work on dictionary?
        str_output = extraction_chain.invoke(
            {
                "email_content": state.email_text,
                "the_requirement": req_string,  # str from row of dataframe
            }
        )
        # req_status = groq_output.content
        # checking_status = groq_output.response_metadata[
        #     "token_usage"
        # ]  # check groq output times
        # print(checking_status)
        print(index, " : " + str_output)
        status_column.append(str_output)
    requirement_dataframe["status"] = status_column
    # Must return all fields in the OverAllState object that are to be tracked
    return {
        "email_text": state.email_text,
        "requirement_df": requirement_dataframe.to_dict("records"),  # pandas dataframe
        "scopingsheet_markdown": "",
        "workflow_steps": 1,
    }


# Step 3: Output the scoping sheet in markdown format
def create_markdown(state: OverAllState):
    """
    Output the scoping sheet in markdown
    """
    # Convert the updated document to markdown
    markdown_content = pd.DataFrame(
        state.requirement_df
    ).to_markdown()  # Do i need to convert this into markdown to begin with?
    template_for_md = """
    Create a markdown file for the scoping sheet. Follow the format of this template. (insert template file)

    # Scoping Sheet:
    {scopingsheet_md}

    # Template:
    {template_for_md}
    """
    md_prompt = ChatPromptTemplate.from_template(template_for_md)
    chain = md_prompt | llm | StrOutputParser()
    str_output = chain.invoke(
        {"scopingsheet_md": markdown_content, "template_for_md": template_for_md}
    )
    # markdown_content = groq_output.content
    # checking_status = groq_output.response_metadata["token_usage"]
    # print(checking_status)
    print("Markdown Document:")
    print(str_output)
    return {
        "scopingsheet_markdown": str_output,
    }


# content : the response string
# additional_kwargs : not sure what this is yet
# response_metadata :
#   token_usage:{...}, model_name="str", system_fingerprint, finish_reason: good = stop
# id='to track and monitor chat id',
# usage_metadata : {...},


# Step 4: Print the updated requirement document
def output_document(state: OverAllState) -> OutputState:
    """
    Print the updated requirement document.
    """
    # print("Updated Requirement Document:")
    # print(state.requirement_df)
    return {
        "scopingsheet_markdown": state.scopingsheet_markdown,
        "requirement_df": state.requirement_df,
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
def run_scoping_generator(
    email_content: str, requirement_dataframe: List[RequirementItem]
) -> str:
    """
    Wrapper method to run the scoping generator workflow.
    """

    output = compiled_workflow.invoke(
        {"email_text": email_content, "requirement_df": requirement_dataframe}
    )
    # print(output)
    return output
