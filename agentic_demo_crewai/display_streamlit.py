"""
# My first app
Here's our first attempt at using data to create a table:
"""

import streamlit as st
import pandas as pd

# df = pd.DataFrame({"first column": [1, 2, 3, 4], "second column": [10, 20, 30, 40]})

workers_df = pd.read_csv("employee_data/workers.csv")

st.title("Software Penetration Testing Company")
st.write("Enter your project requirements:")
project_name = st.text_input("Project Name")
scope = st.text_area("Scope")
deadline = st.date_input("Deadline")
st.write(workers_df)

# if st.button("Submit"):
#     user_input = {
#         "project_name": project_name,
#         "scope": scope,
#         "deadline": str(deadline),
#     }

#     # Initialize state
#     state = {"user_input": user_input}

#     # Run the graph
#     final_state = graph.run(state)

#     # Display results
#     if "missing_info" in final_state:
#         st.warning(final_state["missing_info"])
#     else:
#         st.success("Requirements fulfilled!")
#         st.write("Technical Plan:", final_state["technical_plan"])
#         st.write("Allocated Workers:", final_state["allocated_workers"])
