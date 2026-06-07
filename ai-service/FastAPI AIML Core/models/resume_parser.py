import spacy
import re
from pdfminer.high_level import extract_text as pdf_extract

nlp = spacy.load("en_core_web_lg")

SKILL_PATTERNS = [
    "python", "javascript", "react", "node.js", "mongodb", "sql",
    "machine learning", "deep learning", "tensorflow", "pytorch",
    "docker", "kubernetes", "aws", "azure", "git", "rest api",
    ".net", "c#", "java", "typescript", "vue", "angular"
]

def parse_resume(text: str) -> dict:
    doc = nlp(text)
    
    # Extract entities
    emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    phones = re.findall(r'\b[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}\b', text)
    
    # Extract skills
    text_lower = text.lower()
    skills = [s for s in SKILL_PATTERNS if s in text_lower]
    
    # Extract names (first PERSON entity)
    names = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    
    # Extract years of experience
    exp_pattern = re.findall(r'(\d+)\+?\s*years?\s*(?:of\s*)?experience', text.lower())
    
    return {
        "name": names[0] if names else "Unknown",
        "email": emails[0] if emails else "",
        "phone": phones[0] if phones else "",
        "skills": list(set(skills)),
        "experience_years": int(exp_pattern[0]) if exp_pattern else 0,
        "word_count": len(text.split())
    }