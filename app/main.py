import os
from typing import Dict, Any, List

from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from dotenv import load_dotenv

import google.generativeai as genai

from .personality import PersonalityQuestion, score_personality
from .prompting import build_diagnosis_prompt


load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "").strip()

# Configure Gemini only if key is available
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-pro-latest")

app = FastAPI(title="Hypochondriapp (Gemini Edition)")

# Static and templates
base_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(base_dir, "static")
templates_dir = os.path.join(base_dir, "templates")

app.mount("/static", StaticFiles(directory=static_dir), name="static")
templates = Jinja2Templates(directory=templates_dir)


class DiagnosisResult(BaseModel):
    disease_name: str
    severity: str
    prognosis: str
    death_outcome: bool
    afterlife: str
    reasoning: str
    recommended_action: str


def call_gemini(prompt: str) -> Dict[str, Any]:
    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)
    # We ask for JSON in the prompt; try to parse safely
    try:
        candidate_texts: List[str] = []
        for candidate in response.candidates or []:
            if candidate.content and candidate.content.parts:
                text_parts = [p.text for p in candidate.content.parts if hasattr(p, "text")]
                candidate_texts.append("\n".join(text_parts))
        full_text = ("\n\n".join(candidate_texts)).strip() or (response.text or "").strip()
        import json
        return json.loads(full_text)
    except Exception:
        # Fallback: wrap the raw text
        return {"raw": getattr(response, "text", ""), "error": "Non-JSON response"}


def offline_worst_case(symptoms: str, personality_score: int) -> Dict[str, Any]:
    """Deterministic offline fallback when no API key is configured."""
    symptoms_snippet = (symptoms or "mysterious malaise").strip()[:80]
    if personality_score >= 75:
        death = True
        severity = "apocalyptic"
        afterlife = "hell"
    elif personality_score >= 25:
        death = (hash(symptoms_snippet) % 2) == 0
        severity = "severe"
        afterlife = "purgatory" if death else "undecided"
    else:
        death = False
        severity = "dramatic-but-survivable"
        afterlife = "heaven" if death else "undecided"

    disease_name = "Catastrophic " + ("Hyper-" if len(symptoms_snippet) % 2 == 0 else "Ultra-") + "Syndrome"
    reasoning = (
        f"Based on your symptoms (\"{symptoms_snippet}\") and a personality score of {personality_score}, "
        "we extrapolated the bleakest timeline. Your flair for catastrophes strongly amplifies the diagnosis."
    )
    prognosis = (
        "Expect a rollercoaster of overly dramatic twists, culminating in either a miraculous recovery "
        "or a theatrical fade-to-black. This is satire, not medical advice."
    )
    recommended_action = (
        "Hydrate, take a walk, call someone you love, and avoid doomscrolling. If you truly feel unwell, "
        "seek real medical care. This is a parody app."
    )
    return {
        "disease_name": disease_name,
        "severity": severity,
        "prognosis": prognosis,
        "death_outcome": death,
        "afterlife": afterlife,
        "reasoning": reasoning,
        "recommended_action": recommended_action,
    }


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    questions = PersonalityQuestion.default_questions()
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "questions": questions},
    )


@app.post("/diagnose", response_class=HTMLResponse)
async def diagnose(
    request: Request,
    symptoms: str = Form(...),
    q_0: int = Form(3),
    q_1: int = Form(3),
    q_2: int = Form(3),
    q_3: int = Form(3),
    q_4: int = Form(3),
    q_5: int = Form(3),
    q_6: int = Form(3),
    q_7: int = Form(3),
    q_8: int = Form(3),
    q_9: int = Form(3),
):
    answers = [q_0, q_1, q_2, q_3, q_4, q_5, q_6, q_7, q_8, q_9]
    personality_score = score_personality(answers)

    if not GOOGLE_API_KEY:
        parsed = offline_worst_case(symptoms=symptoms, personality_score=personality_score)
    else:
        prompt = build_diagnosis_prompt(symptoms=symptoms, personality_score=personality_score)
        raw_result = call_gemini(prompt)

        if isinstance(raw_result, dict) and all(k in raw_result for k in [
            "disease_name", "severity", "prognosis", "death_outcome", "afterlife", "reasoning", "recommended_action"
        ]):
            parsed = raw_result
        else:
            parsed = {
                "disease_name": "Unknown Worst-Case Syndrome",
                "severity": "catastrophic",
                "prognosis": "Ambiguous output from model. This is a parody, not medical advice.",
                "death_outcome": False,
                "afterlife": "undecided",
                "reasoning": str(raw_result)[:1000],
                "recommended_action": "Refresh and try again. If you genuinely feel unwell, contact a healthcare professional.",
            }

    # Safety: Ensure types
    try:
        result = DiagnosisResult(**parsed)
    except Exception:
        result = DiagnosisResult(
            disease_name=str(parsed.get("disease_name", "Unknown Worst-Case Syndrome")),
            severity=str(parsed.get("severity", "catastrophic")),
            prognosis=str(parsed.get("prognosis", "This is a parody.")),
            death_outcome=bool(parsed.get("death_outcome", False)),
            afterlife=str(parsed.get("afterlife", "undecided")),
            reasoning=str(parsed.get("reasoning", ""))[:1000],
            recommended_action=str(parsed.get("recommended_action", "Hydrate, rest, seek real care if needed.")),
        )

    questions = PersonalityQuestion.default_questions()
    return templates.TemplateResponse(
        "result.html",
        {
            "request": request,
            "symptoms": symptoms,
            "score": personality_score,
            "result": result,
            "questions": questions,
        },
    )