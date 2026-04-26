# 🚀 CineMatch Deployment Guide

## Prerequisites
- Python 3.8+
- Node.js 14+
- TMDB API Key ([Get it here](https://www.themoviedb.org/settings/api))

## Quick Local Deploy

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

### Backend (Render)

**Option 1: Using render.yaml (Recommended)**
1. Push code to GitHub
2. Connect repo to Render
3. Render will auto-detect `render.yaml`
4. Set environment variable: `TMBD_API=your_key`
5. Deploy!

**Option 2: Manual Setup**
1. Create new Web Service on Render
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable: `TMBD_API=your_key`
5. Deploy!

### Frontend (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add environment variable: `REACT_APP_API_URL=your_backend_url`
5. Deploy!

### Frontend (Netlify)
1. Push code to GitHub
2. Import project to Netlify
3. Settings:
   - **Base Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `frontend/build`
4. Add environment variable: `REACT_APP_API_URL=your_backend_url`
5. Deploy!

## Important Notes

### Model Files
- ML model files in `data/` folder (~17MB) must be included
- Ensure `data/*.pkl` files are committed to Git
- Backend needs 512MB+ RAM for model loading

### Environment Variables
**Backend:**
- `TMBD_API` - Your TMDB API key

**Frontend:**
- `REACT_APP_API_URL` - Backend URL (e.g., https://your-backend.onrender.com)

### CORS
Backend is configured to allow all origins. For production, update CORS settings in `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    ...
)
```

## Troubleshooting

**Backend won't start:**
- Check if all `.pkl` files are present in `data/` folder
- Verify TMBD_API environment variable is set
- Ensure Python 3.8+ is being used

**Frontend can't connect:**
- Verify REACT_APP_API_URL is set correctly
- Check CORS settings in backend
- Ensure backend is running and accessible

**Model loading fails:**
- Increase memory allocation (512MB minimum)
- Check if all 4 pickle files exist: df.pkl, tfidf_matrix.pkl, indices.pkl, tfidf.pkl
