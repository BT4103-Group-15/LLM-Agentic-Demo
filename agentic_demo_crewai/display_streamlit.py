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
