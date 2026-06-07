from fastapi import FastAPI, File, UploadFile, Form
from routes import parse, score, recommend

app = FastAPI()

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    # 1. Parse PDF
    raw_text = await parse.extract_text(file)
    parsed = parse.parse_resume(raw_text)
    
    # 2. Score against JD
    score_result = score.score_resume(parsed, job_description)
    
    # 3. Skill gap + recommendations
    gaps = score.find_skill_gaps(parsed['skills'], job_description)
    career = recommend.predict_career_path(parsed)
    
    return {
        "raw_text": raw_text,
        "parsed": parsed,
        "score": {
            **score_result,
            "skill_gaps": gaps,
            "career_prediction": career
        }
    }