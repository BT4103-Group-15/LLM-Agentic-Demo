"""
This file defines langgraph agents and their overarching structure.

Note: Tools will be moved into packages in future.
"""

import pandas as pd

# from typing_extensions import TypedDict -> main default method of defining states
from pydantic import BaseModel

# from langgraph.prebuilt import create_react_agent  # high level implementation
from langgraph.checkpoint.memory import MemorySaver

# from langchain_ollama.llms import OllamaLLM
from langchain_ollama.chat_models import ChatOllama  # Changed this line
from langchain_core.tools import tool

from langgraph.graph import START, END, StateGraph  # Langgraph imports

from IPython.display import Image, display  # For visualising the output GRAPH

model = ChatOllama(model="mistral", temperature=0.8)

# graph.add_edge("node_a", END) : ending the graph


# For states
class AgentState(BaseModel):
    user_input: str
    requirement: str
    risks: str
    price: int
    manhours: int


def node_1(agentState: AgentState):

    return agentState


def node_2(agentState: AgentState):
    return agentState


def node_3(agentState: AgentState):
    return agentState


graph_builder = StateGraph(AgentState)

graph_builder.add_node("node_1", node_1)
graph_builder.add_node("node_2", node_1)
graph_builder.add_node("node_3", node_1)


graph_builder.add_edge(START, "Start")


graph_builder.add_edge(
    Edge("tech", "sales", condition=lambda state: "missing_info" in state)
)


graph = graph_builder.compile()

display(Image(graph.get_graph().draw_mermaid_png()))

###################################################################################################
# Agent Classes Low Level Definition
###################################################################################################

# Load worker data (CSV)
# workers_df = pd.read_csv(
#     "employee_data/workers.csv"
# )  # Ensure this CSV has columns: Name, Specialty, Availability


# Define the Sales Agent
class SalesAgent:
    def __init__(self):
        self.requirements = {}

    def gather_requirements(self, user_input):
        # Simulate gathering requirements
        self.requirements["project_name"] = user_input.get("project_name", "")
        self.requirements["scope"] = user_input.get("scope", "")
        self.requirements["deadline"] = user_input.get("deadline", "")
        return self.requirements

    def generate_message(self, missing_info):
        return f"Please provide the following missing information: {missing_info}"


# Define the Tech Agent
class TechAgent:
    def __init__(self):
        self.requirements = {}

    def check_requirements(self, requirements):
        missing_info = []
        for key, value in requirements.items():
            if not value:
                missing_info.append(key)
        return missing_info

    def generate_technical_plan(self, requirements):
        return f"Technical plan for project '{requirements['project_name']}' is ready."


# Define the Manager Agent
class ManagerAgent:
    def __init__(self, workers_df):
        self.workers_df = workers_df

    def allocate_resources(self, requirements):
        # Allocate workers based on specialty and availability
        available_workers = self.workers_df[self.workers_df["Availability"] == "Yes"]
        allocated_workers = available_workers.sample(n=2)  # Example: Allocate 2 workers
        return allocated_workers


# LangGraph setup
def sales_node(state):
    sales_agent = SalesAgent()
    requirements = sales_agent.gather_requirements(state["user_input"])
    state["requirements"] = requirements
    return state


def tech_node(state):
    tech_agent = TechAgent()
    missing_info = tech_agent.check_requirements(state["requirements"])
    if missing_info:
        state["missing_info"] = missing_info
        state["next_node"] = "sales"
    else:
        state["technical_plan"] = tech_agent.generate_technical_plan(
            state["requirements"]
        )
        state["next_node"] = "manager"
    return state


workers_df = pd.read_csv("employee_data/workers.csv")


def manager_node(state):
    manager_agent = ManagerAgent(workers_df)
    allocated_workers = manager_agent.allocate_resources(state["requirements"])
    state["allocated_workers"] = allocated_workers
    return state


# Conditional Control Flow + node update states
# def my_node(state: State) -> Command[Literal["my_other_node"]]:
#     if state["foo"] == "bar":
#         return Command(update={"foo": "baz"}, goto="my_other_node")
#
# Use Command when you need to both update the graph state and route to a different node.
# For example, when implementing multi-agent handoffs where it's important to route to a different agent and pass some information to that agent.
#

# Define the graph
# graph_builder = StateGraph(AgentState)
# graph_builder.add_node(START, "Start")

# graph_builder.add_node("sales", sales_node)
# graph_builder.add_node(Node("tech", tech_node))
# graph_builder.add_node(Node("manager", manager_node))
# graph_builder.add_edge(Edge("sales", "tech"))
# graph_builder.add_edge(
#     Edge("tech", "sales", condition=lambda state: "missing_info" in state)
# )
# graph_builder.add_edge(
#     Edge("tech", "manager", condition=lambda state: "technical_plan" in state)
# )

# Conditional edges -> for determining if we should move to A or B -> create cycles in the Graph
# graph.add_conditional_edges("node_a", routing_function)
# Similar to nodes, the routing_function accepts the current state of the graph and returns a value.

# By default, the return value routing_function is used as the name of the node (or list of nodes) to send the state to next. All those nodes will be run in parallel as a part of the next superstep.
# You can optionally provide a dictionary that maps the routing_function's output to the name of the next node.
# graph.add_conditional_edges("node_a", routing_function, {True: "node_b", False: "node_c"})

# Starting at different entry points
# graph.add_conditional_edges(START, routing_function)


# graph = graph_builder.compile()

# display(Image(graph.get_graph().draw_mermaid_png()))

###################################################################################################
# High Level Definition
###################################################################################################

# # Define the tools for the agent to use
# @tool
# def search(query: str):
#     """Call to surf the web."""
#     # This is a placeholder, but don't tell the LLM that...
#     if "sf" in query.lower() or "san francisco" in query.lower():
#         return "It's 60 degrees and foggy."
#     return "It's 90 degrees and sunny."


# tools = [search]
# # model = ChatOllama(model="deepseek-r1:8b")
# model = ChatOllama(model="mistral", temperature=0.8)

# # Initialize memory to persist state between graph runs
# checkpointer = MemorySaver()

# app = create_react_agent(model, tools, checkpointer=checkpointer)

# # Use the agent
# final_state = app.invoke(
#     {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
#     config={"configurable": {"thread_id": 42}},
# )

# print(final_state["messages"][-1].content)
