## to pip install -q -U google-genai for the import
from google import genai

## API key 
client = genai.Client(api_key="AIzaSyD-iu54pfU8Sj4PCEFeSdCIlNBCeXmzidc")
response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Explain how AI works"
)
print(response.text)