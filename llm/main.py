from fastapi import FastAPI
from pydantic import BaseModel
import httpx
from typing import Optional
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from datetime import date
import json


app = FastAPI()

# 1. Request model
class QuestionRequest(BaseModel):
    question: str

# 2. Instantiate LLM
llm = Ollama(model="llama3:8b-instruct-q5_K_M")

# 3. Query Prompt Template
today = date.today().isoformat()
query_generation_prompt = PromptTemplate.from_template("""
You are an intelligent assistant. Your job is to convert a user's natural language request into a JSON object that matches the following structure for filtering invoices.

Today's date is: {today}

Here is the structure:
{{
  "ClientName": string or null,
  "FromDate": "YYYY-MM-DD" or null,
  "ToDate": "YYYY-MM-DD" or null,
  "DueFrom": "YYYY-MM-DD" or null,
  "DueTo": "YYYY-MM-DD" or null,
  "Status": 0 | 1 | 2 or null,
  "MinTotal": number or null,
  "MaxTotal": number or null,
  "Currency": string or null
}}

Only include fields relevant to the query. Dates must be in ISO format: "YYYY-MM-DD".

---

User input:
"{input}"

---

Your answer:
JSON only. No explanation. No extra text.
""").partial(today=today)

# 4. LangChain pipeline
query_chain = (
    {"input": RunnablePassthrough()}
    | query_generation_prompt
    | llm
)

# 5. Answer Prompt Template
answer_prompt = PromptTemplate.from_template("""You are an intelligent assistant helping users understand invoice-related information. Use only the provided context to answer the user's question.

Context:
---------
{context}
---------

User's question:
{question}

Instructions:
- Answer using only the information in the context.
- Be concise and helpful.
- If the answer is not in the context, respond with:
  "Sorry, I couldn't find that information in the records."

Answer:
""")

# 5. API endpoint
@app.post("/ask")
async def ask_question(request: QuestionRequest):
    raw_json_text = query_chain.invoke(request.question)
    try:
        query_dict = json.loads(raw_json_text)
    except Exception as e:
        return {"error": f"Failed to parse JSON: {str(e)}", "raw_output": raw_json_text}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "http://localhost:5299/api/Invoices",
                params=query_dict,
                timeout=10.0
            )
        response.raise_for_status()
        invoices = response.json()

        formatted_context = json.dumps(invoices, indent=2)

        rag_chain = (
            {"context": lambda _: formatted_context, "question": RunnablePassthrough()}
            | answer_prompt
            | llm
            | StrOutputParser()
        )

        answer = await rag_chain.ainvoke(request.question)
    except Exception as e:
        return {"error": f"Failed to fetch invoices: {str(e)}", "query": query_dict}

    return {
        "query": query_dict,
        "answer": answer,
    }


