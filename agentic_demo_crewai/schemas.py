"""
This file contains the data model for our fast API application.

To be confirmed:
1. Is the production URL only provided in the email?
2. Is the name of the company going to be inside the email?
3. What do we do when there is insufficient information in the email?

Questions
1. For repeated customers, are there additional information about the client the 
we have which can help us in our generation?
"""

from typing import List
from pydantic import BaseModel


class RequirementColumns(BaseModel):
    """
    columns in the scoping sheet to be filled -> to be updated to new format
    """

    Application_Overview: List[str]
    Authentication_Access_Control: List[str]
    Input_Processing: List[str]
    Data_Processing: List[str]
    API_Details: List[str]
    Infrastructure: List[str]
    Business_Logic: List[str]
    Security_Requirements: List[str]
    Testing_Constraints: List[str]
    Deliverables: List[str]


class RequirementRequest(BaseModel):
    """
    JSON n8n request to the FastAPI server
    """

    email_text: str
    requirement_columns: RequirementColumns
