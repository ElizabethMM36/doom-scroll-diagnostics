# Hypochondriapp (Gemini Edition)

Hypochondriapp jokingly diagnoses you with the worst possible disease based on your symptoms and a tongue-in-cheek personality test. If the mock prognosis is fatal, it also "routes" you to heaven or hell. For entertainment only.

## Stack
- FastAPI for the backend
- Jinja2 templates for a lightweight UI
- Google Gemini (Pro) for the dynamic diagnosis

## Prerequisites
- Python 3.10+
- A Google AI Studio API key for Gemini

## Setup
1. Clone or open this repo
2. Create your environment file
   ```bash
   cp .env.example .env
   # edit .env and set GOOGLE_API_KEY
   ```
3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```
4. Run the app
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
5. Open your browser at `http://localhost:8000`

## Notes
- This app is not medical advice. It's a parody app for fun.
- The model used is `gemini-1.5-pro-latest` via the `google-generativeai` SDK.
- If you previously used Ollama/Mistral, this version replaces that with Gemini for the diagnosis logic.
