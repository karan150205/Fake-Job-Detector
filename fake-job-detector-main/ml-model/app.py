import os
import sys

# Change default encoding to UTF-8
os.environ["PYTHONIOENCODING"] = "utf-8"

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
from textblob import TextBlob
import string

app = Flask(__name__)
CORS(app)

try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    print("WARNING: model.pkl not found. Falling back to rule-based engine heavily.")
    model = None

def compute_readability(text):
    words = text.split()
    sentences = text.split('.')
    if len(words) == 0 or len(sentences) == 0:
        return 0
    # Simple Flesch-Kincaid approximation for demo
    avg_words = len(words) / len(sentences)
    syllables = sum([len(w)//3 + 1 for w in words]) # rough approximation
    avg_syllables = syllables / len(words)
    score = 206.835 - 1.015 * avg_words - 84.6 * avg_syllables
    return round(max(0, min(100, score)), 2)

def advanced_analysis(job_data):
    reasons = []
    text = (job_data.get('title', '') + " " + job_data.get('company_profile', '') + " " + job_data.get('description', '') + " " + job_data.get('requirements', '')).lower()
    
    blob = TextBlob(text)
    
    # 1. NLP Sentiment and Tone
    sentiment = blob.sentiment.polarity
    tone = "Neutral"
    if sentiment > 0.5: tone = "Overly Enthusiastic/Salesy"
    elif sentiment < -0.1: tone = "Negative/Aggressive"
    elif "urgent" in text or "immediate" in text or "fast money" in text: tone = "Highly Urgent/Pressuring"
    elif sentiment > 0.2: tone = "Positive Professional"
    else: tone = "Formal Professional"
    
    # 2. Grammar Confidence (Rough syntax checking)
    sentences = text.count('.')
    all_caps_words = len([w for w in job_data.get('description', '').split() if w.isupper() and len(w) > 3])
    grammar_score = 100
    if all_caps_words > 5:
        grammar_score -= 15
        reasons.append("Unprofessional use of ALL CAPS detected.")
        
    readability = compute_readability(text)
    if readability < 20:
        grammar_score -= 10
        reasons.append("Text is highly chaotic or overly complex, lowering readability.")
        
    # 3. Keyword / Link scanning
    urls = re.findall(r'(https?://[^\s]+)', job_data.get('description', '') + job_data.get('requirements', ''))
    suspicious_keywords = ["scam", "earn quick", "no experience required", "money transfer", "wire transfer", "western union", "$5000 weekly", "cash bonus", "investment required", "fees required"]
    found_scam_words = [kw for kw in suspicious_keywords if kw in text]
    
    for fw in found_scam_words:
        reasons.append(f"Suspicious keyword pattern detected: '{fw}'")
        
    # 4. Email / Domain Checking
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    emails = re.findall(email_pattern, text)
    generic_domains = ['yahoo.com', 'gmail.com', 'hotmail.com', 'outlook.com', 'protonmail.com']
    found_generic = False
    for email in emails:
        domain = email.split('@')[1]
        if domain in generic_domains:
            found_generic = True
            reasons.append(f"Using generic free email ({domain}) rather than corporate domain.")
            
    # 5. Company Info Integrity
    company = job_data.get('company_profile', '').strip()
    company_score = 100
    if not company:
        company_score = 0
        reasons.append("Completely missing company profile/background.")
    elif len(company) < 50:
        company_score = 40
        reasons.append("Company description is severely undetailed.")
    
    # 6. Contact and Logistics
    logistics_score = 100
    if job_data.get('salary', '') != '' and job_data.get('salary', '').count('$') > 2:
        logistics_score -= 30
        reasons.append("Salary format looks spammy or excessively repeated.")
        
    return {
        "reasons": reasons,
        "analytics": {
            "tone": tone,
            "sentiment_score": round(sentiment, 2),
            "readability": readability,
            "grammar_score": max(0, grammar_score),
            "company_score": company_score,
            "logistics_score": logistics_score,
            "links_found": len(urls),
            "emails_found": len(emails)
        }
    }

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    # Extract
    title = data.get('title', '')
    company_profile = data.get('company_profile', '')
    description = data.get('description', '')
    requirements = data.get('requirements', '')
    
    # Run Advanced NLP & Heuristic Analysis
    analysis = advanced_analysis(data)
    reasons = analysis["reasons"]
    analytics = analysis["analytics"]
    
    # Predict using ML
    combined_text = [title + " " + company_profile + " " + description + " " + requirements]
    
    base_confidence = 0.0
    if model is not None:
        try:
            prob = model.predict_proba(combined_text)[0]
            base_confidence = prob[1] * 100 # fraud probability
        except:
            pass
            
    # Heuristic Modifiers
    penalty = 0
    if analytics['company_score'] < 50: penalty += 15
    if analytics['grammar_score'] < 80: penalty += 10
    if "Generic free email" in str(reasons): penalty += 10
    if "Suspicious keyword" in str(reasons): penalty += 25
    
    final_confidence = min(99.9, base_confidence + penalty)
    if "overly enthusiastic" in analytics['tone'].lower() and penalty > 10:
        final_confidence = min(99.9, final_confidence + 10)
        
    # Final determination
    if final_confidence > 55.0 or (analytics['grammar_score'] <= 70 and penalty > 20):
        is_fake = True
    else:
        is_fake = False
        
    if is_fake and len(reasons) == 0:
        reasons.append("Machine Learning model caught subtle linguistic anomalies matching known fraud patterns.")
        
    return jsonify({
        'is_fake': bool(is_fake),
        'confidence': round(final_confidence, 2),
        'reasons': reasons,
        'analytics': analytics
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
