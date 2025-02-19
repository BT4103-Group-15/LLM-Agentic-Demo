"""
This file defines langgraph agents and their overarching structure.

Note: Tools will be moved into packages in future.
"""

from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

# from langchain_ollama.llms import OllamaLLM
from langchain_ollama.chat_models import ChatOllama  # Changed this line
from langchain_core.tools import tool


# Define the tools for the agent to use
@tool
def search(query: str):
    """Call to surf the web."""
    # This is a placeholder, but don't tell the LLM that...
    if "sf" in query.lower() or "san francisco" in query.lower():
        return "It's 60 degrees and foggy."
    return "It's 90 degrees and sunny."


tools = [search]
# model = ChatOllama(model="deepseek-r1:8b")
model = ChatOllama(model="mistral", temperature=0.8)

# Initialize memory to persist state between graph runs
checkpointer = MemorySaver()

app = create_react_agent(model, tools, checkpointer=checkpointer)

# Use the agent
final_state = app.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
    config={"configurable": {"thread_id": 42}},
)

print(final_state["messages"][-1].content)
