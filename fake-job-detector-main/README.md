# Advanced Fake Job Detection System
An AI-Powered full-stack application that detects fraudulent job postings by fusing traditional Machine Learning (TF-IDF & Logistic Regression) with deep Natural Language Processing (NLP) heuristics. 

## 🚀 Key Features & Upgrades
- **Deep Text Analysis Dashboard**: The frontend transforms into a rich analytical dashboard displaying real-time metrics and dynamic gauges.
- **NLP Sentiment & Tone Indexing**: Uses `TextBlob` to identify the underlying tone of the posting (e.g., *Highly Urgent/Pressuring*, *Positive Professional*).
- **Readability & Grammar Integrity**: Approximates the Flesch-Kincaid scale to measure how authentically professional and readable a job description is, while penalizing chaotic formatting (like excessive ALL CAPS).
- **Meta-Data Entity Extraction**: Automatically isolates and flags generic free emails (e.g., `@yahoo.com`), hidden outbound links, and scam-adjacent keyword combinations.
- **Rule-Based Hybrid Override**: Features a dual-engine protocol. If the Mathematical Logistic Regression is uncertain, heuristic rule penalties (like missing company profile length or suspicious wiring requests) can override and flag the posting as fraudulent.
- **Full History Tracking**: Node.js and MongoDB propagate and store all NLP statistical calculations alongside every job posting for future historic review.
- **Premium UI Aesthetics**: Crafted using React, Tailwind CSS, Lucide-React icons, and Framer Motion for buttery-smooth circular progress rings and diagnostic visualizations.

## 🛠 Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Lucide-React
- **Backend**: Node.js, Express, MongoDB
- **Machine Learning**: Python, Flask, scikit-learn, TextBlob, NLTK, pandas

## 📂 Project Structure
- `/client` - React Frontend
- `/server` - Node.js + Express Backend
- `/ml-model` - Python ML Model and Flask API

## 📝 Setup Instructions

### Prerequisites
1. Node.js (v18+)
2. Python (3.9+)
3. MongoDB (Running locally on default port 27017)

### 1. Setup ML Model (Python)
Navigate to the `ml-model` directory and create a virtual environment:
```bash
cd ml-model
python -m venv venv
# Activate the environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install textblob scipy numpy scikit-learn

# Run the training script (this will create sample data & outputs model.pkl)
python train.py

# Start the Flask API server
python app.py
```
The model will run on `http://localhost:5000`

### 2. Setup Backend Server (Node.js)
Open a new terminal and navigate to the `server` directory:
```bash
cd server

# Install dependencies
npm install

# Make sure you have MongoDB running locally!
# Start the Express server
npm run dev
```
The server will run on `http://localhost:5001`

### 3. Setup Frontend (React)
Open a new terminal and navigate to the `client` directory:
```bash
cd client

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will open on `http://localhost:5173`


## 🧪 Sample Test Data
Try these samples in the application's input form:

**Fake Job Test**
- *Title*: Data Entry Clerk Work From Home
- *Description*: EARN QUICK MONEY just by typing strings! Contact generic@yahoo.com or send a wire transfer to start right now. No experience needed! Get $5000 weekly! VERY URGENT!!!!!
- *Reason*: Multiple suspicious keywords, terrible readability syntax, ALL CAPS detection, heavily aggressive/pressuring tone extracted, and generic email flags.

**Real Job Test**
- *Title*: Senior Software Engineer
- *Description*: We are looking for an experienced Software Engineer with 5+ years of experience in Node.js, AWS, and modern architecture. You will be building scalable systems. Apply through our official portal hr@techcompany.com.
- *Company*: TechCompany is an innovative startup backed by top VCs that believes in shaping the future of web distribution across Europe and America.
