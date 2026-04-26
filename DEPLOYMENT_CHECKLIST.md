# ✅ Deployment Checklist

## Before Deploying

### 1. Verify Files
- [ ] `requirements.txt` in root directory
- [ ] `render.yaml` in root directory
- [ ] All 4 model files in `data/` folder:
  - [ ] `data/df.pkl`
  - [ ] `data/tfidf_matrix.pkl`
  - [ ] `data/indices.pkl`
  - [ ] `data/tfidf.pkl`

### 2. Environment Variables Ready
- [ ] TMDB API key obtained
- [ ] Backend env var: `TMBD_API`
- [ ] Frontend env var: `REACT_APP_API_URL`

## Deploy Backend (Render)

### Option 1: Auto-Deploy with render.yaml
1. [ ] Push code to GitHub
2. [ ] Go to [Render Dashboard](https://dashboard.render.com/)
3. [ ] Click "New +" → "Blueprint"
4. [ ] Connect your GitHub repo
5. [ ] Render detects `render.yaml` automatically
6. [ ] Add environment variable: `TMBD_API=your_key`
7. [ ] Click "Apply"
8. [ ] Wait for deployment (3-5 minutes)
9. [ ] Copy backend URL (e.g., `https://cinematch-backend.onrender.com`)

### Option 2: Manual Deploy
1. [ ] Go to [Render Dashboard](https://dashboard.render.com/)
2. [ ] Click "New +" → "Web Service"
3. [ ] Connect GitHub repo
4. [ ] Configure:
   - Name: `cinematch-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. [ ] Add environment variable: `TMBD_API=your_key`
6. [ ] Click "Create Web Service"
7. [ ] Wait for deployment
8. [ ] Copy backend URL

## Deploy Frontend (Vercel)

1. [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. [ ] Click "Add New" → "Project"
3. [ ] Import your GitHub repo
4. [ ] Configure:
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. [ ] Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your backend URL (from Render)
6. [ ] Click "Deploy"
7. [ ] Wait for deployment (2-3 minutes)
8. [ ] Visit your live site!

## Post-Deployment

### Test Backend
- [ ] Visit `https://your-backend.onrender.com/`
- [ ] Should see: `{"message": "CineMatch API is running", "status": "healthy", "model_loaded": true, "movies_count": 41371}`

### Test Frontend
- [ ] Homepage loads with trending movies
- [ ] Search works
- [ ] Movie details page loads
- [ ] Recommendations work
- [ ] Check source badges (green = AI, blue = TMDB)

### Common Issues

**Backend: "Model files not found"**
- Ensure `data/*.pkl` files are committed to Git
- Check if files are in correct location

**Frontend: "Network Error"**
- Verify `REACT_APP_API_URL` is set correctly
- Check backend is running
- Verify CORS settings

**Backend: "Out of Memory"**
- Increase instance size (Render: 512MB minimum)
- Model files need ~200MB RAM to load

## Success! 🎉

Your CineMatch app is now live:
- Backend: `https://your-backend.onrender.com`
- Frontend: `https://your-frontend.vercel.app`

Share your project and enjoy! 🚀
