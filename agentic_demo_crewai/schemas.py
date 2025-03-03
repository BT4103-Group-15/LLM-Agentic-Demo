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

from pydantic import BaseModel


class SecurityTestingRequest(BaseModel):
    # app_name: str
    # production_url: str # might be provided in the email
    email_text: str
