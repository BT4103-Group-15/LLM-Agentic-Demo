# from crewai import Agent, Task, Crew
# from langchain.tools import DuckDuckGoSearchRun

# from langchain.chains import LLMChain
# from langchain.prompts import PromptTemplate

# Step 1: Define the locally hosted LLM
# Replace with your local LLM configuration
# local_llm = LlamaCpp(
#     model_path="/path/to/your/local/llm/model.bin",  # Path to your locally hosted LLM
#     temperature=0.7,
#     max_tokens=2000,
#     n_ctx=2048,
# )

# from langchain_ollama import OllamaLLM
# from crewai import Agent, Task, Crew

# # Initialize local LLM through Ollama
# local_llm = OllamaLLM(model="deepseek-r1:8b")

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_ollama.llms import OllamaLLM

# template = """Question: {question}

# Answer: Let's think step by step."""

# prompt = ChatPromptTemplate.from_template(template)

# model = OllamaLLM(model="deepseek-r1:8b")

# chain = prompt | model

# chain.invoke({"question": "What is LangChain?"})

###################################################################################################
# Test 2
###################################################################################################

model = OllamaLLM(model="deepseek-r1:8b")

prompt = ChatPromptTemplate.from_template("tell me a joke about {topic}")

chain = prompt | model | StrOutputParser()

analysis_prompt = ChatPromptTemplate.from_template("is this a funny joke? {joke}")

composed_chain = {"joke": chain} | analysis_prompt | model | StrOutputParser()

test_output = composed_chain.invoke({"topic": "bears"})

print(test_output)

# # Step 2: Define the Agents
# sales_assistant = Agent(
#     role="Sales Assistant",
#     goal="Assist customers with product inquiries and sales-related questions.",
#     backstory="You are a knowledgeable sales assistant with expertise in helping customers find the right products.",
#     llm=local_llm,
#     verbose=True,
# )

# technical_assistant = Agent(
#     role="Technical Assistant",
#     goal="Provide technical support and troubleshooting for products.",
#     backstory="You are a technical expert with deep knowledge of product specifications and troubleshooting.",
#     llm=local_llm,
#     verbose=True,
# )

# project_manager = Agent(
#     role="Project Manager",
#     goal="Coordinate tasks between the sales and technical teams to ensure customer satisfaction.",
#     backstory="You are an experienced project manager who ensures smooth collaboration between teams.",
#     llm=local_llm,
#     verbose=True,
# )

# # Step 3: Define the Tasks
# # Add expected_output parameter to Task
# sales_task = Task(
#     description="Read client first contact emails and gather user requirements to be passed to the technical team.",
#     expected_output="User requirements in the form of a table",  # Add this
#     agent=sales_assistant,
# )

# technical_task = Task(
#     description="Provide technical details and troubleshooting steps for a customer's issue.",
#     expected_output="Add to the table that is given in the input, comments for effort estimations in terms of man hours",  # Add this
#     agent=technical_assistant,
# )

# project_management_task = Task(
#     description="Coordinate the sales and technical teams to resolve a customer issue.",
#     expected_output=""""
#     - Assign tasks to the technical team based on user requirements.
#     """,
#     agent=project_manager,
# )

# # Step 4: Create the Crew
# crew = Crew(
#     agents=[sales_assistant, technical_assistant, project_manager],
#     tasks=[sales_task, technical_task, project_management_task],
#     verbose=True,  # Set verbosity level for debugging
# )

# # Step 5: Execute the Crew
# result = crew.kickoff()

# # Step 6: Print the Result
# print("Final Result:")
# print(result)


###################################################################################################
# Version 1
###################################################################################################

# # Initialize tools
# search_tool = DuckDuckGoSearchRun()

# # Define specialized agents
# researcher = Agent(
#     role="Research Analyst",
#     goal="Conduct comprehensive market research and gather relevant data",
#     backstory="""You are an experienced research analyst with expertise in
#     market analysis and data interpretation. Your strength lies in finding
#     and synthesizing information from various sources.""",
#     tools=[search_tool],
#     verbose=True,
# )

# writer = Agent(
#     role="Content Strategist",
#     goal="Create compelling and accurate content based on research findings",
#     backstory="""You are a skilled content strategist who excels at
#     transforming complex information into clear, engaging content. You have
#     years of experience in technical writing and communication.""",
#     verbose=True,
# )

# reviewer = Agent(
#     role="Quality Assurance Specialist",
#     goal="Ensure accuracy and quality of all produced content",
#     backstory="""You are a detail-oriented QA specialist with a strong
#     background in fact-checking and content validation. You ensure all
#     information is accurate and well-presented.""",
#     verbose=True,
# )

# # Define tasks for each agent
# research_task = Task(
#     description="""Conduct research on the latest developments in AI agents and workflows.
#     Focus on:
#     1. Current frameworks and tools
#     2. Best practices and patterns
#     3. Industry adoption and use cases
#     Compile your findings in a structured format.""",
#     agent=researcher,
# )

# writing_task = Task(
#     description="""Based on the research provided, create a comprehensive report on AI agents.
#     Include:
#     1. Overview of current frameworks
#     2. Implementation examples
#     3. Recommendations for adoption
#     Make it engaging and accessible to technical audiences.""",
#     agent=writer,
# )

# review_task = Task(
#     description="""Review the produced content for:
#     1. Technical accuracy
#     2. Completeness of coverage
#     3. Clarity and structure
#     Provide specific feedback and suggestions for improvements.""",
#     agent=reviewer,
# )

# # Create and run the crew
# crew = Crew(
#     agents=[researcher, writer, reviewer],
#     tasks=[research_task, writing_task, review_task],
#     verbose=2,
# )

# result = crew.kickoff()
