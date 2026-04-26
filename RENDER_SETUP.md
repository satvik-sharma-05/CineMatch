# 🚀 Render Deployment - Quick Guide

## ✅ Answer to Your Question:

**YES! Set Root Directory to `backend` in Render**

Just like you set `frontend` as root in Vercel, you need to set `backend` as root in Render.

## 🎯 Two Ways to Deploy on Render:

### Option 1: Using render.yaml (Easiest - Recommended)

The `render.yaml` file already has `rootDir: backend` configured!

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repo: `satvik-sharma-05/CineMatch`
4. Render will auto-detect `render.yaml`
5. Add environment variable:
   - Key: `TMBD_API`
   - Value: `your_tmdb_api_key`
6. Click **"Apply"**
7. Done! ✅

### Option 2: Manual Setup

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. **IMPORTANT - Configure these settings:**
   ```
   Name: cinematch-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend          ← SET THIS!
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Add environment variable:
   - Key: `TMBD_API`
   - Value: `your_tmdb_api_key`
6. Click **"Create Web Service"**
7. Done! ✅

## 📊 What to Expect:

- **Build Time**: 3-5 minutes
- **First Deploy**: May take longer (downloading dependencies)
- **Memory**: Free tier (512MB) is enough
- **Status**: Check logs for "✓ Model loaded successfully! Movies: 41371"

## 🔍 After Deployment:

1. **Copy your backend URL** (e.g., `https://cinematch-backend.onrender.com`)
2. **Test it**: Visit `https://your-backend-url.onrender.com/`
3. **Should see**:
   ```json
   {
     "message": "CineMatch API is running",
     "status": "healthy",
     "model_loaded": true,
     "movies_count": 41371
   }
   ```

## 🎨 Update Frontend (Vercel):

After backend is deployed, update your Vercel environment variable:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `REACT_APP_API_URL`:
   - Value: `https://your-backend-url.onrender.com` (no trailing slash)
5. **Redeploy** frontend

## ⚡ Optimizations Applied:

- ✅ Python 3.11 (faster)
- ✅ Updated pandas version (pre-built wheels)
- ✅ Added numpy explicitly
- ✅ Faster build times

## 🐛 Troubleshooting:

**Build taking too long?**
- Wait for it to complete (first build is slower)
- Check logs for progress

**"Model files not found"?**
- Ensure `data/*.pkl` files are in your GitHub repo
- Check if files are committed

**Backend crashes?**
- Check logs for errors
- Verify `TMBD_API` is set correctly
- Ensure free tier has enough memory (512MB)

## 🎉 Success!

Once deployed, your backend will be live at:
`https://cinematch-backend.onrender.com`

Use this URL in your Vercel frontend! 🚀
