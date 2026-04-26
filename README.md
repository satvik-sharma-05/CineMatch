# 🎬 CineMatch

AI-powered movie recommendation system using TF-IDF + Cosine Similarity with React frontend and FastAPI backend.

## ✨ Features

- **🤖 AI Recommendations**: Custom ML model trained on 41,371 movies
- **🎬 Hybrid System**: ML model for dataset movies + TMDB fallback for new releases
- **🎯 Visual Indicators**: Green badge (AI) vs Blue badge (TMDB)
- **🔍 Advanced Search**: Filter by genre, year, and search by title
- **🎭 Rich Data**: Cast, trailers, budget, revenue, ratings
- **📱 Responsive Design**: Works on desktop and mobile

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
├── backend/              # FastAPI backend
│   ├── main.py          # API endpoints
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   └── src/
│       ├── App.js
│       └── pages/       # HomePage, MovieDetailsPage, AboutPage
├── data/                # ML model files (41,371 movies)
│   ├── df.pkl          # Movie dataset
│   ├── tfidf_matrix.pkl # TF-IDF vectors
│   ├── indices.pkl     # Title-to-index mapping
│   └── tfidf.pkl       # TF-IDF vectorizer
├── scripts/             # Original notebook
│   └── Project_1.ipynb
└── docs/                # Documentation
    └── TUTORIAL.md
```

## 🤖 ML Model

**Algorithm**: TF-IDF + Cosine Similarity  
**Dataset**: 41,371 unique movies (deduplicated by highest rating)  
**Features**: 50,000 TF-IDF features with bigrams (1-2 word combinations)  
**Preprocessing**: NLTK tokenization, stopword removal, lemmatization

### How It Works
1. **Text Processing**: Combines movie overview + genres + tagline into "tags"
2. **Preprocessing**: Removes stopwords, lemmatizes words, tokenizes text
3. **Vectorization**: TF-IDF with max_features=50000, ngram_range=(1,2)
4. **Similarity**: Cosine similarity between movie vectors
5. **Recommendations**: Returns top 5 most similar movies

### Hybrid System
- **ML Model**: Used for 41K+ movies in training dataset
- **TMDB API**: Fallback for newer movies not in dataset
- **Smart Poster Fetching**: Searches TMDB by title for accurate posters

## 🔌 API Endpoints

- `GET /` - Health check and model stats
- `GET /movies/trending` - Trending movies
- `GET /movies/popular` - Popular movies
- `GET /movies/search/{query}` - Search movies
- `GET /movies/{id}` - Movie details with cast/trailer
- `GET /recommend/{movie_name}` - AI recommendations
- `GET /ml-movies` - List of movies in ML model
- `GET /movies/genres` - Available genres
- `GET /movies/discover` - Filter by genre/year

## 📚 Documentation

- **DEPLOY.md**: Full deployment guide
- **RENDER_SETUP.md**: Render-specific setup
- **DEPLOYMENT_CHECKLIST.md**: Step-by-step checklist
- **BUILD_NOTE.md**: Python 3.14.3 compatibility notes
- **docs/TUTORIAL.md**: Technical deep dive

## 🛠️ Tech Stack

**Frontend**
- React 18
- React Router
- Axios
- CSS3

**Backend**
- FastAPI
- scikit-learn (TF-IDF, Cosine Similarity)
- NLTK (Text preprocessing)
- Pandas (Data manipulation)
- Python 3.14.3

**External API**
- TMDB API (Movie data, posters, cast)

**ML Model**
- TF-IDF Vectorization
- Cosine Similarity
- Content-based filtering

## 🎯 Key Features Explained

### AI Transparency
Visit `/about` page to learn how the ML model works, what data it uses, and how recommendations are generated.

### Source Indicators
- 🟢 **Green Badge**: Recommendations from AI model (content-based)
- 🔵 **Blue Badge**: Recommendations from TMDB API (collaborative)

### Smart Poster Fetching
Backend searches TMDB by movie title to ensure accurate posters, even for older movies with outdated IDs.

### Caching System
1-hour cache for TMDB API responses to improve performance and reduce API calls.

## 🚀 Deployment

### Backend (Render)
1. Connect GitHub repo
2. Set Root Directory: `backend`
3. Add environment variable: `TMBD_API=your_key`
4. Deploy!

### Frontend (Vercel)
1. Connect GitHub repo
2. Set Root Directory: `frontend`
3. Add environment variable: `REACT_APP_API_URL=your_backend_url`
4. Deploy!

See **DEPLOY.md** for detailed instructions.

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development (React + FastAPI)
- Machine Learning (TF-IDF, Cosine Similarity)
- Natural Language Processing (NLTK)
- API integration (TMDB)
- Caching strategies
- Error handling and retry logic
- Hybrid recommendation systems
- Production deployment

## 📊 Model Performance

- **Dataset Size**: 41,371 unique movies
- **Feature Space**: 50,000 TF-IDF features
- **Recommendation Quality**: High-quality content-based matches
- **Coverage**: Universal (ML model + TMDB fallback)
- **Response Time**: <100ms (cached), 1-2s (uncached)

## 📄 License

MIT License - Free to use for learning and portfolio purposes.

## 🙏 Acknowledgments

- **TMDB**: Movie data and posters
- **scikit-learn**: ML algorithms
- **NLTK**: Text preprocessing
- **FastAPI**: Modern Python web framework
- **React**: Frontend framework

---

Built with ❤️ for movie lovers and ML enthusiasts!
