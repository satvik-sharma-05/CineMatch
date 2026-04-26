from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
import requests
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI(title="CineMatch API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model files from data directory
import sys
import numpy as np

if not hasattr(np, '_core'):
    np._core = type('_core', (), {})()
    np._core.numeric = np

try:
    movies_df = pickle.load(open('../data/df.pkl', 'rb'))
    tfidf_matrix = pickle.load(open('../data/tfidf_matrix.pkl', 'rb'))
    indices = pickle.load(open('../data/indices.pkl', 'rb'))
    print(f"✓ Model loaded successfully! Movies: {len(movies_df)}")
except Exception as e:
    print(f"Error loading model files: {e}")
    movies_df = None
    tfidf_matrix = None
    indices = None

TMDB_API_KEY = os.getenv('TMBD_API', '')
TMDB_BASE_URL = "https://api.themoviedb.org/3"

# Simple in-memory cache
cache = {}
CACHE_DURATION = timedelta(hours=1)

def get_cached(key: str):
    """Get cached data if not expired"""
    if key in cache:
        data, timestamp = cache[key]
        if datetime.now() - timestamp < CACHE_DURATION:
            return data
    return None

def set_cache(key: str, data):
    """Set cache with timestamp"""
    cache[key] = (data, datetime.now())

def tmdb_request(url: str, cache_key: str = None):
    """Make TMDB API request with caching and retry"""
    if cache_key:
        cached = get_cached(cache_key)
        if cached:
            return cached
    
    for attempt in range(3):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            if cache_key:
                set_cache(cache_key, data)
            return data
        except requests.exceptions.RequestException as e:
            if attempt == 2:
                raise
            continue
    return None

def format_movie(movie: dict) -> dict:
    """Format movie data consistently"""
    return {
        'id': movie.get('id'),
        'title': movie.get('title'),
        'poster': f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get('poster_path') else "https://via.placeholder.com/500x750?text=No+Poster",
        'overview': movie.get('overview', ''),
        'vote_average': movie.get('vote_average', 0),
        'vote_count': movie.get('vote_count', 0),
        'release_date': movie.get('release_date', ''),
        'popularity': movie.get('popularity', 0)
    }

@app.get("/")
def root():
    return {
        "message": "CineMatch API is running",
        "status": "healthy",
        "ml_model_movies": movies_df['title'].tolist() if movies_df is not None else [],
        "endpoints": {
            "trending": "/movies/trending",
            "popular": "/movies/popular",
            "discover": "/movies/discover",
            "search": "/movies/search/{query}",
            "find": "/movies/find",
            "details": "/movies/{id}",
            "recommend": "/recommend/{movie_name}",
            "ml_movies": "/ml-movies"
        }
    }

@app.get("/movies/trending")
def get_trending_movies():
    """Get trending movies from TMDB with caching"""
    try:
        url = f"{TMDB_BASE_URL}/trending/movie/week?api_key={TMDB_API_KEY}"
        data = tmdb_request(url, "trending")
        movies = [format_movie(m) for m in data.get('results', [])[:20]]
        return {"movies": movies, "total": len(movies)}
    except Exception as e:
        print(f"Error (trending): {e}")
        raise HTTPException(status_code=503, detail="Movie service temporarily unavailable")

@app.get("/movies/popular")
def get_popular_movies():
    """Get popular movies from TMDB with caching"""
    try:
        url = f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}"
        data = tmdb_request(url, "popular")
        movies = [format_movie(m) for m in data.get('results', [])[:20]]
        return {"movies": movies, "total": len(movies)}
    except Exception as e:
        print(f"Error (popular): {e}")
        raise HTTPException(status_code=503, detail="Movie service temporarily unavailable")

@app.get("/movies/discover")
def discover_movies(
    genre: Optional[str] = None,
    year: Optional[int] = None,
    min_rating: Optional[float] = Query(None, ge=0, le=10),
    sort_by: Optional[str] = "popularity.desc",
    page: Optional[int] = 1
):
    """
    Discover movies with filters
    - genre: Genre ID (e.g., 28 for Action, 35 for Comedy)
    - year: Release year
    - min_rating: Minimum vote average
    - sort_by: Sort order (popularity.desc, vote_average.desc, release_date.desc)
    - page: Page number
    """
    try:
        params = {
            "api_key": TMDB_API_KEY,
            "sort_by": sort_by,
            "page": page,
            "vote_count.gte": 100  # Minimum votes for quality
        }
        
        if genre:
            params["with_genres"] = genre
        if year:
            params["primary_release_year"] = year
        if min_rating:
            params["vote_average.gte"] = min_rating
        
        url = f"{TMDB_BASE_URL}/discover/movie"
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        movies = [format_movie(m) for m in data.get('results', [])[:20]]
        return {
            "movies": movies,
            "total": len(movies),
            "page": page,
            "total_pages": data.get('total_pages', 1),
            "filters": {
                "genre": genre,
                "year": year,
                "min_rating": min_rating,
                "sort_by": sort_by
            }
        }
    except Exception as e:
        print(f"Error (discover): {e}")
        raise HTTPException(status_code=503, detail="Movie service temporarily unavailable")

@app.get("/movies/genres")
def get_genres():
    """Get list of movie genres"""
    try:
        url = f"{TMDB_BASE_URL}/genre/movie/list?api_key={TMDB_API_KEY}"
        data = tmdb_request(url, "genres")
        return {"genres": data.get('genres', [])}
    except Exception as e:
        print(f"Error (genres): {e}")
        raise HTTPException(status_code=503, detail="Movie service temporarily unavailable")

@app.get("/movies/{movie_id}")
def get_movie_details(movie_id: int):
    """Get detailed movie information from TMDB with caching"""
    try:
        url = f"{TMDB_BASE_URL}/movie/{movie_id}?api_key={TMDB_API_KEY}&append_to_response=credits,videos"
        movie = tmdb_request(url, f"movie_{movie_id}")
        
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        # Extract cast (top 10)
        cast = []
        if 'credits' in movie and 'cast' in movie['credits']:
            cast = [
                {
                    'name': actor.get('name'),
                    'character': actor.get('character'),
                    'profile_path': f"https://image.tmdb.org/t/p/w185{actor.get('profile_path')}" if actor.get('profile_path') else None
                }
                for actor in movie['credits']['cast'][:10]
            ]
        
        # Extract trailer
        trailer = None
        if 'videos' in movie and 'results' in movie['videos']:
            trailers = [v for v in movie['videos']['results'] if v.get('type') == 'Trailer' and v.get('site') == 'YouTube']
            if trailers:
                trailer = f"https://www.youtube.com/watch?v={trailers[0]['key']}"
        
        return {
            'id': movie.get('id'),
            'title': movie.get('title'),
            'poster': f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get('poster_path') else "https://via.placeholder.com/500x750?text=No+Poster",
            'backdrop': f"https://image.tmdb.org/t/p/original{movie.get('backdrop_path')}" if movie.get('backdrop_path') else None,
            'overview': movie.get('overview', ''),
            'vote_average': movie.get('vote_average', 0),
            'vote_count': movie.get('vote_count', 0),
            'release_date': movie.get('release_date', ''),
            'runtime': movie.get('runtime', 0),
            'genres': [g['name'] for g in movie.get('genres', [])],
            'tagline': movie.get('tagline', ''),
            'status': movie.get('status', ''),
            'budget': movie.get('budget', 0),
            'revenue': movie.get('revenue', 0),
            'cast': cast,
            'trailer': trailer
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error (details): {e}")
        raise HTTPException(status_code=503, detail="Movie service temporarily unavailable")

@app.get("/movies/search/{query}")
def search_movies_tmdb(query: str, page: int = 1):
    """Search movies on TMDB by text"""
    try:
        url = f"{TMDB_BASE_URL}/search/movie?api_key={TMDB_API_KEY}&query={query}&page={page}"
        data = tmdb_request(url, f"search_{query}_{page}")
        
        movies = [format_movie(m) for m in data.get('results', [])[:20]]
        return {
            "movies": movies,
            "total": len(movies),
            "page": page,
            "total_pages": data.get('total_pages', 1),
            "query": query
        }
    except Exception as e:
        print(f"Error (search): {e}")
        raise HTTPException(status_code=503, detail="Movie service temporarily unavailable")

@app.get("/movies/find")
def find_by_external_id(
    imdb_id: Optional[str] = None,
    external_source: str = "imdb_id"
):
    """
    Find movie by external ID (IMDB, TVDB, etc.)
    - imdb_id: IMDB ID (e.g., tt0111161)
    - external_source: Source type (imdb_id, tvdb_id, etc.)
    """
    try:
        if not imdb_id:
            raise HTTPException(status_code=400, detail="External ID required")
        
        url = f"{TMDB_BASE_URL}/find/{imdb_id}?api_key={TMDB_API_KEY}&external_source={external_source}"
        data = tmdb_request(url, f"find_{imdb_id}")
        
        movies = []
        if 'movie_results' in data and data['movie_results']:
            movies = [format_movie(m) for m in data['movie_results']]
        
        return {
            "movies": movies,
            "external_id": imdb_id,
            "source": external_source
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error (find): {e}")
        raise HTTPException(status_code=503, detail="Movie service temporarily unavailable")

@app.get("/ml-movies")
def get_ml_movies():
    """Get list of movies that will use the ML model for recommendations"""
    if movies_df is not None:
        return {
            "status": "ML model loaded",
            "total_movies": len(movies_df),
            "movies": movies_df['title'].tolist(),
            "note": "Only these movies will show the green 🤖 AI Model badge"
        }
    else:
        return {
            "status": "ML model not loaded",
            "total_movies": 0,
            "movies": [],
            "note": "ML model files not found"
        }

@app.get("/recommend/{movie_name}")
def recommend_movies(movie_name: str):
    """
    Get movie recommendations - uses ML model if available, otherwise TMDB similar movies
    Returns source indicator: 'ml_model' or 'tmdb_similar'
    """
    try:
        # Try ML model first
        if movies_df is not None and tfidf_matrix is not None:
            from sklearn.metrics.pairwise import cosine_similarity
            
            # Look for exact title match (case-insensitive)
            title_lower = movie_name.lower()
            matching_movies = movies_df[movies_df['title'].str.lower() == title_lower]
            
            if not matching_movies.empty:
                # Use the first (and should be only) match since we deduplicated by highest rating
                idx = matching_movies.index[0]
                movie_title = movies_df.iloc[idx]['title']
                movie_rating = movies_df.iloc[idx]['vote_average']
                
                print(f"🎯 Found '{movie_title}' in ML dataset (Rating: {movie_rating})")
                
                # Calculate similarity scores
                sim_scores = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()
                similar_indices = sim_scores.argsort()[::-1][1:6]  # Top 5, excluding self
                
                recommendations = []
                for movie_idx in similar_indices:
                    movie = movies_df.iloc[movie_idx]
                    similarity_score = sim_scores[movie_idx]
                    movie_title = movie['title']
                    
                    # Search TMDB by title to get correct poster
                    poster = "https://via.placeholder.com/500x750?text=No+Poster"
                    movie_id = 0
                    overview = movie.get('overview', 'No overview available')
                    vote_average = float(movie.get('vote_average', 0))
                    
                    try:
                        # Search TMDB for the movie by title
                        search_url = f"{TMDB_BASE_URL}/search/movie?api_key={TMDB_API_KEY}&query={movie_title}"
                        search_data = tmdb_request(search_url, f"search_{movie_title}")
                        
                        if search_data and search_data.get('results'):
                            # Get the first result (most relevant)
                            tmdb_movie = search_data['results'][0]
                            movie_id = tmdb_movie.get('id', 0)
                            
                            if tmdb_movie.get('poster_path'):
                                poster = f"https://image.tmdb.org/t/p/w500{tmdb_movie['poster_path']}"
                            
                            # Use TMDB data if available (more up-to-date)
                            if tmdb_movie.get('overview'):
                                overview = tmdb_movie['overview']
                            if tmdb_movie.get('vote_average'):
                                vote_average = float(tmdb_movie['vote_average'])
                    except Exception as e:
                        print(f"⚠️ Could not fetch TMDB data for {movie_title}: {e}")
                    
                    recommendations.append({
                        'title': movie_title,
                        'poster': poster,
                        'overview': overview,
                        'vote_average': vote_average,
                        'popularity': float(movie.get('popularity', 0)),
                        'id': movie_id,
                        'similarity': float(similarity_score)
                    })
                
                print(f"✅ Generated {len(recommendations)} ML recommendations for '{movie_name}'")
                return {
                    "query": movie_name,
                    "recommendations": recommendations,
                    "source": "ml_model",
                    "source_description": "AI-powered recommendations using TF-IDF + Cosine Similarity"
                }
        
        # Fallback to TMDB similar movies
        search_url = f"{TMDB_BASE_URL}/search/movie?api_key={TMDB_API_KEY}&query={movie_name}"
        search_data = tmdb_request(search_url, f"search_{movie_name}")
        
        if not search_data or not search_data.get('results'):
            raise HTTPException(status_code=404, detail=f"Movie '{movie_name}' not found")
        
        movie_id = search_data['results'][0]['id']
        
        # Get similar movies from TMDB
        similar_url = f"{TMDB_BASE_URL}/movie/{movie_id}/similar?api_key={TMDB_API_KEY}"
        similar_data = tmdb_request(similar_url, f"similar_{movie_id}")
        
        recommendations = []
        for movie in similar_data.get('results', [])[:5]:
            recommendations.append({
                'title': movie.get('title'),
                'poster': f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get('poster_path') else "https://via.placeholder.com/500x750?text=No+Poster",
                'overview': movie.get('overview', 'No overview available'),
                'vote_average': float(movie.get('vote_average', 0)),
                'popularity': float(movie.get('popularity', 0)),
                'id': movie.get('id')
            })
        
        return {
            "query": movie_name,
            "recommendations": recommendations,
            "source": "tmdb_similar",
            "source_description": "Similar movies from TMDB database"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error (recommend): {e}")
        raise HTTPException(status_code=500, detail=str(e))
