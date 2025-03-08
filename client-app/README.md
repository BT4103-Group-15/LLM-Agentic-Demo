# Prerequisites

Before running the chatbot application, ensure you have the following installed:

1. Python (Version 3.8 or later)

2. Flask (for running the web server)
   `pip install flask`

3. LangChain and Ollama LLM (for chatbot responses)

   `pip install langchain langchain_ollama`

4. Ollama Model (Mistral)

- Ensure Ollama is installed on your system. Download it from Ollama's website.

- Pull the required model:

  `ollama pull mistral`

# Running the Application

1. Navigate to the Directory

- Make sure you’re in the directory where your app.py file is located.

2. Start the Server

- Run the following command in your terminal (assuming you're using Python 3):

  `python app.py`
