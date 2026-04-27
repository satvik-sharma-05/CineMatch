# CineMatch

> An intelligent movie recommendation system powered by machine learning and natural language processing.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://cine-match-blond-nine.vercel.app/)
[![API](https://img.shields.io/badge/API-active-blue)](https://cinematch-n7vq.onrender.com/)
[![Python](https://img.shields.io/badge/python-3.14.3-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-18-61dafb)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Overview

CineMatch is a full-stack movie recommendation platform that combines content-based filtering with real-time movie data. The system analyzes movie plots, genres, and metadata using TF-IDF vectorization and cosine similarity to deliver personalized recommendations from a dataset of 41,371 films.

**Live Application**: [https://cine-match-blond-nine.vercel.app/](https://cine-match-blond-nine.vercel.app/)  
**API Endpoint**: [https://cinematch-n7vq.onrender.com/](https://cinematch-n7vq.onrender.com/)

## Features

- **Content-Based Recommendations**: ML model trained on 41,371 movies using TF-IDF and cosine similarity
- **Hybrid Architecture**: Seamless fallback to TMDB API for comprehensive coverage
- **Real-Time Data**: Integration with TMDB for current movie information, cast, and trailers
- **Advanced Filtering**: Search and filter by genre, year, and popularity
- **Responsive Design**: Optimized for desktop and mobile devices
- **Transparent AI**: Visual indicators distinguish ML recommendations from API suggestions

## Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.14.3)
- **ML Libraries**: scikit-learn, NLTK, Pandas, NumPy
- **API Integration**: TMDB REST API
- **Deployment**: Render

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3
- **Deployment**: Vercel

### Machine Learning
- **Algorithm**: TF-IDF Vectorization + Cosine Similarity
- **Feature Engineering**: 50,000 TF-IDF features with bigram analysis
- **Text Processing**: NLTK tokenization, stopword removal, lemmatization
- **Dataset**: 41,371 unique movies (deduplicated by rating)

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
echo "TMBD_API=your_api_key" > .env
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:8000" > .env
npm start
```

Access the application at `http://localhost:3000`

## Architecture

### System Design

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   FastAPI    │─────▶│   TMDB API  │
│  Frontend   │      │   Backend    │      │             │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  ML Model    │
                     │  (41K movies)│
                     └──────────────┘
```

### ML Pipeline

1. **Data Preprocessing**: Combine overview, genres, and tagline
2. **Text Normalization**: Tokenization, stopword removal, lemmatization
3. **Feature Extraction**: TF-IDF vectorization (50K features, bigrams)
4. **Similarity Computation**: Cosine similarity between movie vectors
5. **Recommendation Generation**: Top-5 similar movies by content

## API Documentation

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check and model statistics |
| GET | `/recommend/{movie_name}` | Get AI-powered recommendations |
| GET | `/movies/{id}` | Retrieve detailed movie information |
| GET | `/movies/trending` | Fetch trending movies |
| GET | `/movies/popular` | Get popular movies |
| GET | `/movies/search/{query}` | Search movies by title |
| GET | `/movies/discover` | Filter movies by genre/year |
| GET | `/ml-movies` | List all movies in ML dataset |

Full API documentation available at: [https://cinematch-n7vq.onrender.com/docs](https://cinematch-n7vq.onrender.com/docs)

## Project Structure

```
cinematch/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   └── pages/          # Page components
│   └── package.json        # Node dependencies
├── data/
│   ├── df.pkl              # Movie dataset
│   ├── tfidf_matrix.pkl    # TF-IDF vectors
│   ├── indices.pkl         # Title mappings
│   └── tfidf.pkl           # Vectorizer
├── scripts/
│   └── Project_1.ipynb     # Original ML notebook
└── docs/
    └── TUTORIAL.md         # Technical documentation
```

## Model Performance

| Metric | Value |
|--------|-------|
| Dataset Size | 41,371 movies |
| Feature Dimensions | 50,000 TF-IDF features |
| Recommendation Latency | <100ms (cached) |
| API Response Time | 1-2s (uncached) |
| Coverage | Universal (ML + TMDB fallback) |

## Deployment

### Production Deployment

**Backend (Render)**
```bash
# Automatic deployment via render.yaml
# Environment: TMBD_API=your_key
```

**Frontend (Vercel)**
```bash
# Automatic deployment via Git integration
# Environment: REACT_APP_API_URL=https://cinematch-n7vq.onrender.com
```

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

## Development

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Code Quality
```bash
# Python linting
flake8 backend/

# JavaScript linting
cd frontend && npm run lint
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for comprehensive movie data
- [scikit-learn](https://scikit-learn.org/) for machine learning algorithms
- [NLTK](https://www.nltk.org/) for natural language processing tools
- [FastAPI](https://fastapi.tiangolo.com/) for the modern Python web framework
- [React](https://reactjs.org/) for the frontend framework

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Live Demo**: [https://cine-match-blond-nine.vercel.app/](https://cine-match-blond-nine.vercel.app/)  
**API Documentation**: [https://cinematch-n7vq.onrender.com/docs](https://cinematch-n7vq.onrender.com/docs)
