import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware  # Add this import
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import pandas as pd
from io import StringIO
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Input model for the API
class DataRequest(BaseModel):
    prompt: str
    rows: int

# Initialize Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    google_api_key=GEMINI_API_KEY,
    temperature=0.7
)

# Prompt template
template = """
Generate a synthetic dataset based on the following description: {prompt}.
Provide {rows} rows in CSV format with realistic values. Return only the CSV content, no extra text or explanations.
Example output for "users with name, age":
name,age
John Doe,34
Jane Smith,28
"""
prompt_template = PromptTemplate.from_template(template)

@app.post("/generate-data")
async def generate_data(request: DataRequest):
    try:
        chain = prompt_template | llm
        csv_content = chain.invoke({"prompt": request.prompt, "rows": request.rows}).content
        
        df = pd.read_csv(StringIO(csv_content))
        if len(df) != request.rows:
            raise ValueError(f"Generated {len(df)} rows, but {request.rows} were requested")
        
        stream = StringIO()
        df.to_csv(stream, index=False)
        stream.seek(0)
        
        return StreamingResponse(
            iter([stream.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=synthetic_data.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)