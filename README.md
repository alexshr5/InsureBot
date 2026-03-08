![CI](https://github.com/alexshr5/InsureBot/actions/workflows/deploy.yml/badge.svg)
![Python](https://img.shields.io/badge/python-3.11-blue)
![Terraform](https://img.shields.io/badge/terraform-1.14-purple)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-live-brightgreen)

# InsureBot 🤖

## Live Demo
🚀 API: https://insurebot-api.onrender.com/health

> An AI-powered insurance assistant that answers policy questions,
> guides users through claims, and provides instant quotes.
> Built with LangChain, Llama 3, ChromaDB, FastAPI, and Terraform.

## Architecture

[Architecture diagram will go here]

## Demo

![InsureBot Demo](docs/screenshot.png)

## Tech Stack

- **LLM**: Llama 3 via Groq API (or Ollama locally)
- **RAG Pipeline**: LangChain + ChromaDB
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (Supabase)
- **Chat UI**: Flowise
- **IaC**: Terraform
- **CI/CD**: GitHub Actions

## Quick Start
```bash
git clone https://github.com/alexshr5/InsureBot
cd insurebot
cp .env.example .env
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload
```
