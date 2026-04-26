import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function HomePage() {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [filtering, setFiltering] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovies();
        fetchGenres();

        // Check for search parameter from About page
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            setSearchQuery(searchParam);
            handleSearchWithQuery(searchParam);
        }
    }, []);

    const handleSearchWithQuery = async (query) => {
        setSearching(true);
        try {
            const response = await axios.get(`${API_URL}/movies/search/${encodeURIComponent(query)}`);
            setSearchResults(response.data.movies);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const fetchMovies = async () => {
        try {
            const [trending, popular] = await Promise.all([
                axios.get(`${API_URL}/movies/trending`),
                axios.get(`${API_URL}/movies/popular`)
            ]);
            setTrendingMovies(trending.data.movies);
            setPopularMovies(popular.data.movies);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await axios.get(`${API_URL}/movies/genres`);
            setGenres(response.data.genres);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const handleFilter = async () => {
        if (!selectedGenre && !selectedYear) {
            setFilteredMovies([]);
            return;
        }

        setFiltering(true);
        try {
            const params = {};
            if (selectedGenre) params.genre = selectedGenre;
            if (selectedYear) params.year = selectedYear;

            const response = await axios.get(`${API_URL}/movies/discover`, { params });
            setFilteredMovies(response.data.movies);
        } catch (error) {
            console.error('Filter error:', error);
            setFilteredMovies([]);
        } finally {
            setFiltering(false);
        }
    };

    const clearFilters = () => {
        setSelectedGenre('');
        setSelectedYear('');
        setFilteredMovies([]);
    };

    useEffect(() => {
        if (selectedGenre || selectedYear) {
            handleFilter();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGenre, selectedYear]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const response = await axios.get(`${API_URL}/movies/search/${encodeURIComponent(searchQuery)}`);
            setSearchResults(response.data.movies);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading movies...</p>
            </div>
        );
    }

    return (
        <div className="homepage">
            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">🎬 CineMatch</h1>
                    <p className="hero-subtitle">Discover your next favorite movie</p>

                    <div className="hero-nav">
                        <button
                            className="about-link"
                            onClick={() => navigate('/about')}
                        >
                            🤖 How Our AI Works
                        </button>
                    </div>

                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="search-input-hero"
                            placeholder="Search for movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-btn" disabled={searching}>
                            {searching ? 'Searching...' : 'Search'}
                        </button>
                        {searchQuery && (
                            <button type="button" className="clear-btn" onClick={clearSearch}>
                                Clear
                            </button>
                        )}
                    </form>

                    <div className="filter-controls">
                        <select
                            className="filter-select"
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                        >
                            <option value="">All Genres</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            className="filter-input"
                            placeholder="Year (e.g., 2024)"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            min="1900"
                            max={new Date().getFullYear() + 1}
                        />

                        {(selectedGenre || selectedYear) && (
                            <button type="button" className="clear-filter-btn" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="main-content">
                {filteredMovies.length > 0 ? (
                    <section className="movie-section">
                        <h2 className="section-title">
                            🎯 Filtered Results
                            {selectedGenre && ` - ${genres.find(g => g.id === selectedGenre)?.name}`}
                            {selectedYear && ` - ${selectedYear}`}
                        </h2>
                        {filtering ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                                <p>Filtering movies...</p>
                            </div>
                        ) : (
                            <div className="movie-grid">
                                {filteredMovies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="movie-card"
                                        onClick={() => handleMovieClick(movie.id)}
                                    >
                                        <div className="movie-poster-container">
                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="movie-poster"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                                                }}
                                            />
                                            <div className="movie-overlay-home">
                                                <div className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</div>
                                                <p className="movie-overview-preview">{movie.overview}</p>
                                            </div>
                                        </div>
                                        <h3 className="movie-title-home">{movie.title}</h3>
                                        <p className="movie-year">{movie.release_date?.split('-')[0]}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                ) : searchResults.length > 0 ? (
                    <section className="movie-section">
                        <h2 className="section-title">Search Results</h2>
                        <div className="movie-grid">
                            {searchResults.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="movie-card"
                                    onClick={() => handleMovieClick(movie.id)}
                                >
                                    <div className="movie-poster-container">
                                        <img
                                            src={movie.poster}
                                            alt={movie.title}
                                            className="movie-poster"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                                            }}
                                        />
                                        <div className="movie-overlay-home">
                                            <div className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</div>
                                            <p className="movie-overview-preview">{movie.overview}</p>
                                        </div>
                                    </div>
                                    <h3 className="movie-title-home">{movie.title}</h3>
                                    <p className="movie-year">{movie.release_date?.split('-')[0]}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <>
                        <section className="movie-section">
                            <h2 className="section-title">🔥 Trending This Week</h2>
                            <div className="movie-grid">
                                {trendingMovies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="movie-card"
                                        onClick={() => handleMovieClick(movie.id)}
                                    >
                                        <div className="movie-poster-container">
                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="movie-poster"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                                                }}
                                            />
                                            <div className="movie-overlay-home">
                                                <div className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</div>
                                                <p className="movie-overview-preview">{movie.overview}</p>
                                            </div>
                                        </div>
                                        <h3 className="movie-title-home">{movie.title}</h3>
                                        <p className="movie-year">{movie.release_date?.split('-')[0]}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="movie-section">
                            <h2 className="section-title">⭐ Popular Movies</h2>
                            <div className="movie-grid">
                                {popularMovies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="movie-card"
                                        onClick={() => handleMovieClick(movie.id)}
                                    >
                                        <div className="movie-poster-container">
                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="movie-poster"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                                                }}
                                            />
                                            <div className="movie-overlay-home">
                                                <div className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</div>
                                                <p className="movie-overview-preview">{movie.overview}</p>
                                            </div>
                                        </div>
                                        <h3 className="movie-title-home">{movie.title}</h3>
                                        <p className="movie-year">{movie.release_date?.split('-')[0]}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default HomePage;
