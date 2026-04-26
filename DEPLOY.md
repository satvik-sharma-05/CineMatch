# 🚀 CineMatch Deployment Guide

## Prerequisites
- Python 3.8+
- Node.js 14+
- TMDB API Key ([Get it here](https://www.themoviedb.org/settings/api))

## Quick Deploy

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd cinematch
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "TMBD_API=your_tmdb_api_key" > .env

# Start backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start frontend
npm start
```

### 4. Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Production Deploy

### Backend (Render/Railway/Heroku)
1. Set environment variable: `TMBD_API=your_key`
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel/Netlify)
1. Set environment variable: `REACT_APP_API_URL=your_backend_url`
2. Build command: `npm run build`
3. Publish directory: `build`

## Notes
- ML model files (data/*.pkl) must be included in deployment
- Total size: ~17MB (model files)
- Backend needs 512MB+ RAM for model loading
