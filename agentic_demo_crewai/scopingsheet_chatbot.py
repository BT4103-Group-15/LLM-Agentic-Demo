# from langchain_ollama import OllamaLLM
from langchain_groq import ChatGroq

# from langchain.prompts import ChatPromptTemplate

from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

from IPython.display import Image, display

# Initialize the language model
# llm = OllamaLLM(model="mistral", temperature=0.7)


groq_api_key = "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"
llm = ChatGroq(
    groq_api_key=groq_api_key, model_name="llama-3.3-70b-versatile", temperature=0.7
)


class State(TypedDict):
    messages: Annotated[list, add_messages]


def chatbot(state: State):
    return {"messages": llm.invoke(state["messages"])}


###################################################################################################
# Define the state graph
###################################################################################################

graph_builder = StateGraph(State)
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
graph = graph_builder.compile()


try:
    display(Image(graph.get_graph().draw_mermaid_png()))
except Exception:
    pass

###################################################################################################
# Running the Chatbot
###################################################################################################

while True:
    user_input = input("User: ")
    if user_input.lower() in ["quit", "q"]:
        print("Good Bye")
        break
    for event in graph.stream({"messages": ("user", user_input)}):
        print(event.values())
        for value in event.values():
            print(value["messages"])
            print("Assistant:", value["messages"].content)


# def process_user_input(state):
#     user_input = state["user_input"]
#     # Here you might preprocess the input, e.g., lowercase, remove punctuation, etc.
#     state["processed_input"] = user_input.lower()
#     return state


# def classify_intent(state):
#     processed_input = state["processed_input"]
#     prompt = ChatPromptTemplate.from_template(
#         "Classify the intent of this user input: {input}. "
#         "Possible intents are: greeting, question, farewell, others."
#     )
#     response = llm(prompt.format_messages(input=processed_input))
#     state["intent"] = response.content
#     return state


# def generate_response(state):
#     intent = state["intent"]
#     processed_input = state["processed_input"]

#     if intent == "greeting":
#         response = "Hello! How can I assist you today?"

#     elif intent == "question":
#         prompt = ChatPromptTemplate.from_template("Answer this question: {input}")
#         response = llm(prompt.format_messages(input=processed_input)).content

#     elif intent == "farewell":
#         response = "Goodbye! Have a great day!"
#     else:
#         response = "I'm not sure how to respond to that. Can you please rephrase?"

#     state["bot_response"] = response
#     return state


###################################################################################################
# Define the state graph
###################################################################################################

# workflow = StateGraph()

# # Add nodes to the graph
# workflow.add_node("process_input", process_user_input)  # assuming starting edge???
# workflow.add_node("classify_intent", classify_intent)
# workflow.add_node("generate_response", generate_response)

# # Define the edges between nodes
# workflow.add_edge("process_input", "classify_intent")
# workflow.add_edge("classify_intent", "generate_response")
# workflow.add_edge("generate_response", END)

# # Set the entry point
# workflow.set_entry_point("process_input")

# # Compile the graph
# chatbot = workflow.compile()

###################################################################################################
# Running the Chatbot
###################################################################################################

# while True:
#     user_input = input("You: ")
#     if user_input.lower() == "quit":
#         print("Bot: Goodbye!")
#         break

#     result = chatbot.invoke({"user_input": user_input})
#     print(f"Bot: {result['bot_response']}")
