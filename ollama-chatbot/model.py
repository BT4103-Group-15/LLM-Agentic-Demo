from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

# Initialize the model and prompt template
template = """
Answer the question below.

Here is the conversation history: {context}

Question: {question}

Answer:
"""

model = OllamaLLM(model="mistral")
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

context = ""  # Holds the conversation history

def get_answer(user_input):
    global context
    result = chain.invoke({"context": context, "question": user_input})

    # Update the context with the user's input and AI's response
    context += f"\nUser: {user_input}\nAI: {result}"

    return result
