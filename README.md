# 🎬 CineMatch

AI-powered movie recommendation system using TF-IDF + Cosine Similarity with React frontend and FastAPI backend.

## ✨ Features

- **🤖 AI Recommendations**: Custom ML model (41,371 movies)
- **🎬 Hybrid System**: ML model + TMDB fallback
- **🎯 Visual Indicators**: See AI vs API recommendations
- **🔍 Advanced Search**: Filter by genre, year, title
- **🎭 Rich Data**: Cast, trailers, budget, revenue

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
echo "TMBD_API=your_tmdb_api_key" > .env
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:8000" > .env
npm start
```

Visit: http://localhost:3000

Get TMDB API key: https://www.themoviedb.org/settings/api

## 📁 Project Structure

```
cinematch/
├── backend/         # FastAPI backend
│   ├── main.py
│   └── requirements.txt
├── frontend/        # React frontend
│   └── src/
├── data/            # ML model files (41,371 movies)
│   ├── df.pkl
│   ├── tfidf_matrix.pkl
│   └── indices.pkl
├── scripts/         # Original notebook
│   └── Project_1.ipynb
└── docs/            # Documentation
```

## 🤖 ML Model

- **Algorithm**: TF-IDF + Cosine Similarity
- **Dataset**: 41,371 unique movies (deduplicated)
- **Features**: 50,000 TF-IDF features with bigrams
- **Preprocessing**: NLTK tokenization, stopword removal, lemmatization

## 📚 Documentation

- **DEPLOY.md**: Deployment guide
- **docs/TUTORIAL.md**: Technical deep dive

## 🛠️ Tech Stack

**Frontend**: React, React Router  
**Backend**: FastAPI, scikit-learn, NLTK  
**API**: TMDB API  
**ML**: TF-IDF Vectorization, Cosine Similarity

## 📄 License

MIT License
