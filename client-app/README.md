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

5. Requests (for HTTP requests)

   `pip install requests`

7. Pandas (for Markdown)

   `pip install pandas`

8. Google API Authentication for Python (for connecting to Google Drive)

   `pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client`

8. MySQL (for database connection)

- Ensure that the database is first created. If no database is created, please refer to agentic_demo_crewai/README.md for the database setup.

  `pip install mysql-connector-python`

9. Python Dotev (for reading .env files)

   `pip install python-dotenv`

# Running the Application

1. Navigate to the Directory LLM-Agentic-Demo/client-app

- Make sure you’re in the directory where the app.py file is located.

2. Start the Server

- Run the following command in your terminal (assuming you're using Python 3):

  `python app.py`
