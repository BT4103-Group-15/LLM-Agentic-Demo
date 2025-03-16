"""
This file runs the Scope of Work (SOW) document generator that takes in
1. A completed Scoping Sheet
2. A sample SOW document
and outputs
1. A generated SOW document in Markdown format
"""

from langchain_core.prompts import ChatPromptTemplate  # For formatting purposes
from langchain_core.output_parsers import StrOutputParser

# from langchain.schema.runnable import RunnableSequence
from langchain_ollama import OllamaLLM  # for LangChain version

###################################################################################################
# Model Initialisation
###################################################################################################
llama3_8b_local = OllamaLLM(model="llama3.1")

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
    """
    sow_generation_prompt = ChatPromptTemplate.from_template(sow_generation_template)
    chain = sow_generation_prompt | llama3_8b_local | StrOutputParser()
    sow_mkdn = chain.invoke(
        {"example": sample_sow, "scoping_sheet": completed_scopingsheet}
    )
    return sow_mkdn  # "SOW Generated Successfully!"
