from fastapi import FastAPI
from schemas import SecurityTestingRequest
from graph_agent import run_agent  # Import your LLM function

app = FastAPI(
    title="Scoping Sheet Generator Server",
    version="1.0",
    description="API endpoint to be connected to other automation fuctions via N8N http request node",
)


@app.post("/api/scoping-local-flow")
async def ask_agent(request: SecurityTestingRequest):
    """Endpoint to interact with the local LLM"""
    response = run_agent(request.email_text)
    return {"response": response}


# Run the FastAPI app from this file
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8080)

# Run with: uvicorn main:app --reload
