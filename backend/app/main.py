from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
import os
from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent.parent / '.env')

app = FastAPI(title='InsureBot API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    answer: str
    sources: list = []
    session_id: str

rag_chain = None
retriever = None

@app.on_event('startup')
async def startup():
    global rag_chain, retriever
    try:
        embeddings = OllamaEmbeddings(model='llama3')
        vectorstore = Chroma(
            collection_name='insurebot',
            embedding_function=embeddings,
            persist_directory='./chroma_db'
        )
        retriever = vectorstore.as_retriever(search_kwargs={'k': 4})
        llm = ChatGroq(
            model_name='llama-3.1-8b-instant',
            groq_api_key=os.getenv('GROQ_API_KEY'),
            temperature=0.1
        )
        prompt = PromptTemplate.from_template("""You are InsureBot, a helpful insurance assistant.
Answer questions based on the policy documents provided.
If you cannot find the answer in the documents, say so clearly.
Be concise, friendly, and accurate.
Never invent policy details that are not in the documents.

Context: {context}
Question: {question}
Answer:""")

        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)

        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )
        print("RAG pipeline ready!")
    except Exception as e:
        print(f"RAG pipeline failed to load: {e}")
        print("Running in limited mode - RAG pipeline unavailable")
        print("Running in limited mode - RAG pipeline unavailable")

@app.get('/health')
async def health():
    return {'status': 'ok', 'rag_ready': rag_chain is not None}

@app.post('/chat', response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not rag_chain:
        return ChatResponse(
            answer="Hi! I'm InsureBot 🤖 The full AI-powered demo requires local setup with Ollama and ChromaDB. Visit the GitHub repo for setup instructions: github.com/alexshr5/InsureBot",
            sources=[],
            session_id=request.session_id or str(uuid.uuid4())
        )
    
    docs = retriever.invoke(request.message)
    sources = list(set([doc.metadata.get('source', '') for doc in docs]))
    answer = rag_chain.invoke(request.message)
    
    return ChatResponse(
        answer=answer,
        sources=sources,
        session_id=request.session_id or str(uuid.uuid4())
    )