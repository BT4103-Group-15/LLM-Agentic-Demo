"""
Fast API server to use the local LLM to generate and return the scoping sheet
"""

from fastapi import FastAPI

# from fastapi.responses import Response -> for markdown
from schemas import RequirementRequest
from graph_agent import run_scoping_generator  # Import your LLM function

app = FastAPI(
    title="Scoping Sheet Generator Server",
    version="1.0",
    description="API endpoint to be connected via N8N http request node",
)

# For returning in markdown format
# return Response(content=markdown_content, media_type="text/markdown")


@app.post("/api/scoping-local-flow")
async def ask_agent(request: RequirementRequest):
    """Endpoint to interact with the local LLM"""
    response = run_scoping_generator(request.email_text)
    return {"response": response}


# Run the FastAPI app from this file
if __name__ == "__main__":

    import uvicorn

    uvicorn.run(app, host="localhost", port=8080)

# Run with: uvicorn main:app --reload
