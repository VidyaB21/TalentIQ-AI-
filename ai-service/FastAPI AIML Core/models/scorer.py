from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')  # Fast + accurate

def score_resume(parsed_resume: dict, job_description: str) -> dict:
    resume_text = f"""
    Skills: {', '.join(parsed_resume.get('skills', []))}
    Experience: {' '.join(parsed_resume.get('experience', []))}
    Education: {parsed_resume.get('education', '')}
    """
    
    resume_embedding = model.encode([resume_text])
    jd_embedding = model.encode([job_description])
    
    similarity = cosine_similarity(resume_embedding, jd_embedding)[0][0]
    score = round(float(similarity) * 100, 2)
    
    return {
        "overall_score": score,
        "grade": "A" if score > 80 else "B" if score > 60 else "C" if score > 40 else "D",
        "summary": f"Your resume matches {score:.1f}% of the job requirements."
    }

def find_skill_gaps(resume_skills: list, job_description: str) -> dict:
    import spacy
    nlp = spacy.load("en_core_web_lg")
    
    # Extract tech skills from JD using NER + pattern matching
    jd_doc = nlp(job_description.lower())
    
    with open("data/skills_db.json") as f:
        import json
        all_skills = json.load(f)["skills"]
    
    jd_skills = [s for s in all_skills if s.lower() in job_description.lower()]
    resume_skills_lower = [s.lower() for s in resume_skills]
    
    missing = [s for s in jd_skills if s.lower() not in resume_skills_lower]
    matched = [s for s in jd_skills if s.lower() in resume_skills_lower]
    
    return {
        "matched_skills": matched,
        "missing_skills": missing[:10],
        "match_percentage": len(matched) / max(len(jd_skills), 1) * 100
    }