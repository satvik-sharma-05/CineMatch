import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieDetailsPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function MovieDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [recommendationSource, setRecommendationSource] = useState('');
    const [sourceDescription, setSourceDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [recLoading, setRecLoading] = useState(false);

    useEffect(() => {
        fetchMovieDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchMovieDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/movies/${id}`);
            setMovie(response.data);

            // Fetch recommendations based on movie title
            fetchRecommendations(response.data.title);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async (movieTitle) => {
        setRecLoading(true);
        try {
            const response = await axios.get(`${API_URL}/recommend/${encodeURIComponent(movieTitle)}`);
            setRecommendations(response.data.recommendations);
            setRecommendationSource(response.data.source);
            setSourceDescription(response.data.source_description);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendations([]);
            setRecommendationSource('');
            setSourceDescription('');
        } finally {
            setRecLoading(false);
        }
    };

    const handleRecommendationClick = async (recTitle) => {
        // Search for the movie by title to get its ID
        try {
            const response = await axios.get(`${API_URL}/movies/search/${encodeURIComponent(recTitle)}`);
            if (response.data.movies && response.data.movies.length > 0) {
                const movieId = response.data.movies[0].id;
                navigate(`/movie/${movieId}`);
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Error finding movie:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading movie details...</p>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="error-container">
                <h2>Movie not found</h2>
                <button onClick={() => navigate('/')} className="back-btn">
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="movie-details-page">
            <button onClick={() => navigate('/')} className="back-button">
                ← Back to Home
            </button>

            <div
                className="movie-hero"
                style={{
                    backgroundImage: movie.backdrop
                        ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(20,20,20,0.95)), url(${movie.backdrop})`
                        : 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
                }}
            >
                <div className="movie-hero-content">
                    <div className="movie-poster-large">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                            }}
                        />
                    </div>

                    <div className="movie-info-main">
                        <h1 className="movie-title-large">{movie.title}</h1>

                        {movie.tagline && (
                            <p className="movie-tagline">"{movie.tagline}"</p>
                        )}

                        <div className="movie-meta">
                            <span className="meta-item">
                                ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                            </span>
                            <span className="meta-item">
                                📅 {movie.release_date}
                            </span>
                            {movie.runtime > 0 && (
                                <span className="meta-item">
                                    ⏱️ {movie.runtime} min
                                </span>
                            )}
                            <span className="meta-item status">
                                {movie.status}
                            </span>
                        </div>

                        {movie.genres && movie.genres.length > 0 && (
                            <div className="movie-genres">
                                {movie.genres.map((genre, index) => (
                                    <span key={index} className="genre-tag">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="movie-overview-section">
                            <h2>Overview</h2>
                            <p className="movie-overview-text">{movie.overview}</p>
                        </div>

                        {(movie.budget > 0 || movie.revenue > 0) && (
                            <div className="movie-financials">
                                {movie.budget > 0 && (
                                    <div className="financial-item">
                                        <span className="financial-label">💰 Budget:</span>
                                        <span className="financial-value">${(movie.budget / 1000000).toFixed(1)}M</span>
                                    </div>
                                )}
                                {movie.revenue > 0 && (
                                    <div className="financial-item">
                                        <span className="financial-label">💵 Revenue:</span>
                                        <span className="financial-value">${(movie.revenue / 1000000).toFixed(1)}M</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {movie.trailer && (
                            <div className="trailer-section">
                                <a href={movie.trailer} target="_blank" rel="noopener noreferrer" className="trailer-btn">
                                    ▶️ Watch Trailer
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {movie.cast && movie.cast.length > 0 && (
                <div className="cast-section">
                    <h2 className="cast-title">🎭 Cast</h2>
                    <div className="cast-grid">
                        {movie.cast.map((actor, index) => (
                            <div key={index} className="cast-card">
                                {actor.profile_path ? (
                                    <img
                                        src={actor.profile_path}
                                        alt={actor.name}
                                        className="cast-photo"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/185x278?text=No+Photo';
                                        }}
                                    />
                                ) : (
                                    <div className="cast-photo-placeholder">
                                        <span>👤</span>
                                    </div>
                                )}
                                <div className="cast-info">
                                    <p className="cast-name">{actor.name}</p>
                                    <p className="cast-character">{actor.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="recommendations-section">
                <div className="recommendations-header">
                    <h2 className="recommendations-title">
                        🎬 You Might Also Like
                    </h2>
                    {recommendationSource && (
                        <div className={`recommendation-source ${recommendationSource}`}>
                            {recommendationSource === 'ml_model' ? (
                                <>
                                    <span className="source-badge ml-badge">🤖 AI Model</span>
                                    <span className="source-text">{sourceDescription}</span>
                                </>
                            ) : (
                                <>
                                    <span className="source-badge tmdb-badge">🎬 TMDB</span>
                                    <span className="source-text">{sourceDescription}</span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {recLoading ? (
                    <div className="rec-loading">
                        <div className="spinner"></div>
                        <p>Finding similar movies...</p>
                    </div>
                ) : recommendations.length > 0 ? (
                    <div className="recommendations-grid">
                        {recommendations.map((rec, index) => (
                            <div
                                key={index}
                                className="recommendation-card"
                                onClick={() => handleRecommendationClick(rec.title)}
                            >
                                <div className="rec-poster-container">
                                    <img
                                        src={rec.poster}
                                        alt={rec.title}
                                        className="rec-poster"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                                        }}
                                    />
                                    <div className="rec-overlay">
                                        <p className="rec-overview">{rec.overview}</p>
                                    </div>
                                </div>
                                <h3 className="rec-title">{rec.title}</h3>
                                <div className="rec-stats">
                                    <span className="rec-rating">⭐ {rec.vote_average.toFixed(1)}</span>
                                    <span className="rec-popularity">🔥 {Math.round(rec.popularity)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-recommendations">
                        <p>No recommendations available for this movie.</p>
                        <p className="hint">Try searching for another movie from our database.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieDetailsPage;
