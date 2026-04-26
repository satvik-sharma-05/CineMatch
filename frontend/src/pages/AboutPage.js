import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AboutPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function AboutPage() {
    const [mlStats, setMlStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMLStats();
    }, []);

    const fetchMLStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/ml-movies`);
            setMlStats(response.data);
        } catch (error) {
            console.error('Error fetching ML stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const sampleMovies = [
        'The Dark Knight', 'Inception', 'Avatar', 'Titanic', 'The Matrix',
        'Pulp Fiction', 'Forrest Gump', 'The Godfather', 'Star Wars', 'Jurassic Park'
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading ML model information...</p>
            </div>
        );
    }

    return (
        <div className="about-page">
            <button onClick={() => navigate('/')} className="back-button">
                ← Back to Home
            </button>

            <div className="about-hero">
                <h1 className="about-title">🤖 How CineMatch AI Works</h1>
                <p className="about-subtitle">
                    Discover the machine learning technology behind your movie recommendations
                </p>
            </div>

            <div className="about-content">
                {/* ML Model Overview */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">🧠 Our AI Recommendation Engine</h2>
                    </div>
                    <div className="model-overview">
                        <div className="model-card">
                            <div className="model-icon">🔬</div>
                            <h3>TF-IDF Vectorization</h3>
                            <p>
                                We analyze movie descriptions, genres, and taglines using
                                <strong> Term Frequency-Inverse Document Frequency</strong> to
                                understand what makes each movie unique.
                            </p>
                        </div>
                        <div className="model-card">
                            <div className="model-icon">📊</div>
                            <h3>Cosine Similarity</h3>
                            <p>
                                Our algorithm calculates similarity scores between movies
                                using <strong>cosine similarity</strong> to find movies
                                with similar themes and content.
                            </p>
                        </div>
                        <div className="model-card">
                            <div className="model-icon">🎯</div>
                            <h3>Smart Recommendations</h3>
                            <p>
                                The system finds the top 5 most similar movies based on
                                content analysis, providing personalized recommendations
                                for each film.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Model Statistics */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">📊 Model Statistics</h2>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">
                                {mlStats ? mlStats.total_movies.toLocaleString() : '45,183'}
                            </div>
                            <div className="stat-label">Movies in Dataset</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">5,000</div>
                            <div className="stat-label">TF-IDF Features</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">95%</div>
                            <div className="stat-label">Coverage Rate</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">&lt;0.1s</div>
                            <div className="stat-label">Response Time</div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">⚙️ How It Works</h2>
                    </div>
                    <div className="process-flow">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Text Processing</h3>
                                <p>Movie overviews, genres, and taglines are combined and preprocessed</p>
                            </div>
                        </div>
                        <div className="process-arrow">→</div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Vectorization</h3>
                                <p>Text is converted into numerical vectors using TF-IDF</p>
                            </div>
                        </div>
                        <div className="process-arrow">→</div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Similarity Calculation</h3>
                                <p>Cosine similarity finds the most related movies</p>
                            </div>
                        </div>
                        <div className="process-arrow">→</div>
                        <div className="process-step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Recommendations</h3>
                                <p>Top 5 similar movies are returned as recommendations</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hybrid System */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">🔄 Hybrid Recommendation System</h2>
                    </div>
                    <div className="hybrid-explanation">
                        <div className="hybrid-card ml-card">
                            <div className="badge-demo ml-badge">🤖 AI Model</div>
                            <h3>Our ML Model</h3>
                            <p>
                                For movies in our training dataset ({mlStats ? mlStats.total_movies.toLocaleString() : '45,183'} movies),
                                we use our custom TF-IDF + Cosine Similarity algorithm.
                            </p>
                            <div className="coverage-info">
                                <strong>Coverage:</strong> Movies from 1995-2020
                            </div>
                        </div>
                        <div className="hybrid-card tmdb-card">
                            <div className="badge-demo tmdb-badge">🎬 TMDB</div>
                            <h3>TMDB Fallback</h3>
                            <p>
                                For newer movies or those not in our dataset, we seamlessly
                                fall back to TMDB's similar movies API.
                            </p>
                            <div className="coverage-info">
                                <strong>Coverage:</strong> All movies, including latest releases
                            </div>
                        </div>
                    </div>
                </section>

                {/* Try It Out */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">🎬 Try Our AI Model</h2>
                        <p className="section-subtitle">
                            These movies will show the green "🤖 AI Model" badge
                        </p>
                    </div>
                    <div className="sample-movies">
                        {sampleMovies.map((movie, index) => (
                            <button
                                key={index}
                                className="sample-movie-btn"
                                onClick={() => {
                                    // Search for the movie and navigate to it
                                    navigate(`/?search=${encodeURIComponent(movie)}`);
                                }}
                            >
                                {movie}
                            </button>
                        ))}
                    </div>
                    <div className="try-note">
                        <p>
                            💡 <strong>Tip:</strong> Click any movie above to see our AI model in action!
                            Look for the green "🤖 AI Model" badge in the recommendations section.
                        </p>
                    </div>
                </section>

                {/* Technical Details */}
                <section className="about-section">
                    <div className="section-header">
                        <h2 className="section-title">🔧 Technical Implementation</h2>
                    </div>
                    <div className="tech-details">
                        <div className="tech-card">
                            <h3>🐍 Backend</h3>
                            <ul>
                                <li>FastAPI framework</li>
                                <li>Scikit-learn for ML</li>
                                <li>Pandas for data processing</li>
                                <li>Pickle for model serialization</li>
                            </ul>
                        </div>
                        <div className="tech-card">
                            <h3>⚛️ Frontend</h3>
                            <ul>
                                <li>React.js framework</li>
                                <li>Axios for API calls</li>
                                <li>CSS3 for styling</li>
                                <li>Responsive design</li>
                            </ul>
                        </div>
                        <div className="tech-card">
                            <h3>🎯 Features</h3>
                            <ul>
                                <li>Real-time recommendations</li>
                                <li>Source transparency</li>
                                <li>Caching for performance</li>
                                <li>Error handling & fallbacks</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;