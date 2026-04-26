import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import AboutPage from './pages/AboutPage';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movie/:id" element={<MovieDetailsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>

                <footer className="footer">
                    <p>Built with React + FastAPI | Powered by TMDB</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
