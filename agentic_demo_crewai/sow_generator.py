"""
This file runs the Scope of Work (SOW) document generator that takes in
1. A completed Scoping Sheet
2. A sample SOW document
and outputs
1. A generated SOW document in Markdown format
"""

from langchain_core.prompts import ChatPromptTemplate  # For formatting purposes
from langchain_core.output_parsers import StrOutputParser

#comment later
import os
os.environ["QROQ_API_KEY"]= "gsk_XsYc4agDeX8A5R9vWpXHWGdyb3FYlCOMbVUB2t2ka0eU6isB3M3qgsk_7y3HLZlG69yeNcRcQDBCWGdyb3FYBRAl4TcInNKBPLQ6xw9Yjk9C"
from langchain_groq import ChatGroq

# from langchain.schema.runnable import RunnableSequence
#from langchain_ollama import OllamaLLM  # for LangChain version

###################################################################################################
# Model Initialisation
###################################################################################################
#llama3_8b_local = OllamaLLM(model="llama3.1", temperature=0.1)
llama3_8b_local = ChatGroq(model_name = "llama-3.3-70b-versatile",temperature=0.7)
###################################################################################################
# Scope of Work Generator Method
###################################################################################################


def generate_sow(
    completed_scopingsheet: str,
    sample_sow: str = None,
) -> str:
    """
    Generate a Scope of Work (SOW) document based on the provided Scoping Sheet which is completed.

    Args contained in completed_scopingsheet:
        client_name (str): Name of the client.
        project_name (str): Name of the project.
        project_description (str): Description of the project.
        project_scope (str): Scope of the project.
        project_deadline (str): Deadline for the project.
        project_budget (str): Budget for the project.
        project_deliverables (str): List of deliverables for the project.
        project_requirements (str): Requirements for the project.
        project_terms (str): Terms for the project.
        project_acceptance (str): Acceptance criteria for the project.

    Sample_Arg for 1 shot prompting:
        a reference scoping sheet str : completed_scopingsheet

    Returns:
        str: Generated Scope of Work (SOW) document in Markdown
    """
    # Define the template for the Scope of Work (SOW) document
    sow_generation_template = """
    # Task:
    Generate the scope of work document for a software testing project that follows the format
    given by the example, while taking all the necessary information from the scoping sheet.

    # Example:
    {example}

    # Scoping Sheet containing information to be used to fill up the scope of work document
    {scoping_sheet}

    # Requirement:
    1. Output the SOW in markdown format ONLY, DO NOT INCLUDeE ANY OTHER TEXT.
    """
    output_check_template = """
    # Task: 
    1. Check if the output_document is in markdown format, if it isnt, please make the necessary edits.
    2. If the output_document is in markdown format, please return the output_document as it is

    # Output Document:
    {output_document}

    # Requirement:
    1. OUTPUT ONLY THE DOCUMENT
    2. DO NOT TELL ME ANYTHING OR INCLUDE ANY OTHER TEXT
    """
    sow_generation_prompt = ChatPromptTemplate.from_template(sow_generation_template)
    qa_prompt = ChatPromptTemplate.from_template(output_check_template)
    generation_step = sow_generation_prompt | llama3_8b_local | StrOutputParser()
    qa_step = qa_prompt | llama3_8b_local | StrOutputParser()
    chain = generation_step | qa_step
    sow_mkdn = chain.invoke(
        {"example": sample_sow, "scoping_sheet": completed_scopingsheet}
    )
    return sow_mkdn  # "SOW Generated Successfully!"
