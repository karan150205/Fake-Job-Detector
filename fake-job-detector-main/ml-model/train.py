import pandas as pd
import numpy as np
import pickle
import nltk
from nltk.corpus import stopwords
import re
import os

nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

def clean_text(text):
    if pd.isna(text):
        return ""
    text = str(text).lower()
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = text.split()
    tokens = [t for t in tokens if t not in stop_words]
    return " ".join(tokens)

def main():
    # Attempt to load Kaggle dataset; fallback to generated sample data for demonstration
    dataset_path = 'fake_job_postings.csv'
    if os.path.exists(dataset_path):
        print("Loading genuine Kaggle dataset...")
        df = pd.read_csv(dataset_path)
    else:
        print("Dataset not found. Generating sample training data for the model...")
        data = {
            'title': ['Software Engineer', 'Data Entry Clerk Work From Home', 'Python Developer', 'Customer Service Representative', 'Senior Backend Engineer', 'Earn $5000 weekly entering data'],
            'company_profile': ['We are a tech company...', '', 'Leading data analytics firm', 'Well known telecom company.', 'Innovative startup...', ''],
            'description': ['Develop cool apps.', 'Just type strings into our system and make money fast! Contact generic@yahoo.com.', 'Write python scripts for ML automation.', 'Answer customer calls.', 'Design scalable architectures.', 'Get rich quick, no experience needed! Contact me at scammer@gmail.com'],
            'requirements': ['BS in CS, 3 yrs exp', 'None', 'Python, SQL', 'Communication skills', 'Node.js, AWS, System Design', 'Must have a bank account to receive transfer'],
            'telecommuting': [0, 1, 0, 1, 0, 1],
            'has_company_logo': [1, 0, 1, 1, 1, 0],
            'has_questions': [1, 0, 1, 0, 1, 0],
            'fraudulent': [0, 1, 0, 0, 0, 1]
        }
        df = pd.DataFrame(data)
        df.to_csv('sample_data.csv', index=False)
        print("Created sample_data.csv for testing.")

    # In Kaggle dataset, usually text features are concatenated
    # Features: title, company_profile, description, requirements, benefits, etc.
    text_cols = ['title', 'company_profile', 'description', 'requirements']
    
    # Fill NaN with empty string just in case
    for c in text_cols:
        if c in df.columns:
            df[c] = df[c].fillna('')
    
    # Combine text columns
    df['combined_text'] = df['title'] + " " + df['company_profile'] + " " + df['description'] + " " + df['requirements']
    
    print("Cleaning text data...")
    df['cleaned_text'] = df['combined_text'].apply(clean_text)

    X = df['cleaned_text']
    y = df['fraudulent']

    from sklearn.model_selection import train_test_split
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import Pipeline
    from sklearn.metrics import classification_report

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42) if len(df) > 10 else (X, X, y, y)

    print("Training Logistic Regression Model with TF-IDF...")
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1,2))),
        ('clf', LogisticRegression(random_state=42))
    ])

    pipeline.fit(X_train, y_train)
    
    # evaluate
    preds = pipeline.predict(X_test)
    if len(df) > 10:
        print("\nModel Evaluation:")
        print(classification_report(y_test, preds))
    else:
        print("\nModel Evaluation skipped for tiny dataset.")

    # save the model
    with open('model.pkl', 'wb') as f:
        pickle.dump(pipeline, f)
    
    print("Model saved as model.pkl")

if __name__ == '__main__':
    main()
