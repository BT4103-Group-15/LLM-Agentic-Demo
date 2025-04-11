"""
Fast API server to use the local LLM to generate and return the scoping sheet
"""

from fastapi import FastAPI
import pandas as pd

# from fastapi.middleware.cors import CORSMiddleware

# from fastapi.responses import Response -> for markdown
from schemas import RequirementRequest, ScopeOfWorkRequest
from graph_agent import run_scoping_generator  # Import your LLM function
from sow_generator import generate_sow

app = FastAPI(
    title="Scoping Sheet Generator Server",
    version="1.0",
    description="API endpoint to be connected via N8N http request node",
)


# For returning in markdown format
# return Response(content=markdown_content, media_type="text/markdown")


@app.get("/")
def read_root():
    return {"message": "FastAPI is running successfully!"}


def transform_input(input_json):
    """Converts input JSON to match FastAPI schema"""
    return {
        "email_text": input_json["email"],
        "requirement_df": [
            {"category": item["Category"], "requirement": item["Requirement"]}
            for item in input_json["requirement_columns"]
        ],
    }


@app.post("/api/scoping-local-flow")
async def ask_agent(request: RequirementRequest):  # raw request
    """Endpoint to interact with the local LLM"""
    # fixed_request = transform_input(request)  # Fix structure
    # request_obj = RequirementRequest(**fixed_request)
    response = run_scoping_generator(
        request.email_text, request.requirement_df, request.sample_scopingsheet
    )
    return response  # {"response": response}


@app.post("/api/sow-local-flow")
async def run_sow_generator(request: ScopeOfWorkRequest):  # raw request
    """Input will be a scoping sheet that is filled out in markdown?
    Output will be a SOW in markdown format
    Best if the markdown has signing fields for the client and the user
    """
    sow_markdown_str = generate_sow(request.completed_scopingsheet, request.sample_sow)
    return {"sow_document": sow_markdown_str}


# Run the FastAPI app from this file
if __name__ == "__main__":

    import uvicorn

    uvicorn.run(app, host="localhost", port=8080)

# Run with: uvicorn main:app --reload
