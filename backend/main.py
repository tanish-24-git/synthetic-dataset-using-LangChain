import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataRequest(BaseModel):
    prompt: str
    rows: int

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    google_api_key=GEMINI_API_KEY,
    temperature=0.7
)

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
        batch_size = 20  # Smaller batches to avoid API limits
        all_data = []
        remaining_rows = request.rows

        while remaining_rows > 0:
            rows_to_generate = min(batch_size, remaining_rows)
            chain = prompt_template | llm
            csv_content = chain.invoke({"prompt": request.prompt, "rows": rows_to_generate}).content
            print(f"Batch generated ({rows_to_generate} rows):\n{csv_content}")

            # Clean up non-CSV content
            lines = csv_content.split("\n")
            csv_lines = [line for line in lines if "," in line and not line.startswith(("Here", "```"))]
            cleaned_csv = "\n".join(csv_lines)
            print(f"Cleaned batch CSV:\n{cleaned_csv}")

            if not cleaned_csv.strip():
                print("Warning: No valid CSV data in batch, using fallback")
                # Fallback: Generate a single row if API fails
                cleaned_csv = "name,age\nFallback User,30"

            df_batch = pd.read_csv(StringIO(cleaned_csv))
            all_data.append(df_batch)
            remaining_rows -= rows_to_generate

        # Combine all batches
        df = pd.concat(all_data, ignore_index=True)
        
        # Ensure exact row count
        if len(df) < request.rows:
            print(f"Padding from {len(df)} to {request.rows} rows")
            padding = pd.DataFrame([df.iloc[-1].to_dict()] * (request.rows - len(df)))
            df = pd.concat([df, padding], ignore_index=True)
        elif len(df) > request.rows:
            df = df.iloc[:request.rows]  # Truncate if too many rows

        stream = StringIO()
        df.to_csv(stream, index=False)
        stream.seek(0)

        return StreamingResponse(
            iter([stream.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=synthetic_data.csv"}
        )
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)