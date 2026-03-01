from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid

app = FastAPI(title='InsureBot API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/health')
async def health():
    return {'status': 'ok', 'rag_ready': False}

@app.post('/chat')
async def chat(request: dict):
    return {'answer': 'InsureBot is running!', 'session_id': str(uuid.uuid4())}
