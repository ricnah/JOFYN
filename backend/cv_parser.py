import docx
import re

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)

def get_keywords(text):
    # Simple keyword extraction logic
    # In a real scenario, this could use NLP
    skills = ['python', 'react', 'javascript', 'golang', 'java', 'nodejs', 'sql', 'aws', 'docker', 'kubernetes', 'php', 'laravel', 'flutter']
    found_skills = []
    for skill in skills:
        if re.search(rf'\b{skill}\b', text, re.IGNORECASE):
            found_skills.append(skill.capitalize())
    return found_skills
