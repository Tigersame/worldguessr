# Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Your Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub/GitLab/Bitbucket
   - Click "Add New Project"
   - Import your repository

2. **Configure Project Settings:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** Leave empty (Next.js handles this)
   - **Install Command:** `npm install`

3. **Environment Variables:**
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_ROOT_URL=https://farcasterworld.vercel.app
   NEXT_PUBLIC_API_URL=your-api-url.com
   NEXT_PUBLIC_WS_HOST=your-websocket-url.com
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   
   # Reward Token Configuration (if using blockchain features)
   REWARD_TOKEN_ADDRESS=your-contract-address
   TOKEN_PRIVATE_KEY=your-private-key
   BASE_RPC_URL=https://mainnet.base.org
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://farcasterworld.vercel.app`

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   For production deployment:
   ```bash
   vercel --prod
   ```

---

## 📋 Build Configuration

The project is already configured for Vercel:

- ✅ **Next.js Framework:** Detected automatically
- ✅ **API Routes:** `pages/api/` directory (serverless functions)
- ✅ **Build Command:** `npm run build` (defined in `package.json`)
- ✅ **Output:** Standard Next.js build (not static export)
- ✅ **Rewrites:** Configured in `vercel.json` for:
  - `/.well-known/farcaster.json` → `/api/farcaster-manifest`
  - `/map/:slug` → `/map?s=:slug`

---

## 🔧 Important Notes

### API Routes
- Your API routes in `pages/api/` will be automatically deployed as Vercel serverless functions
- The Farcaster manifest endpoint is at: `/.well-known/farcaster.json`

### Environment Variables
Make sure to set all required environment variables in Vercel Dashboard:
- `NEXT_PUBLIC_ROOT_URL` - Your Vercel deployment URL
- `NEXT_PUBLIC_API_URL` - Your backend API URL (separate server)
- `NEXT_PUBLIC_WS_HOST` - Your WebSocket server URL

### Separate Backend Services
⚠️ **Note:** Your Express API server (`server.js`), WebSocket server (`ws/ws.js`), and Cron jobs (`cron.js`) need to be deployed separately. Vercel only hosts the Next.js frontend.

**Options for Backend:**
- **Railway:** https://railway.app
- **Render:** https://render.com
- **Heroku:** https://heroku.com
- **DigitalOcean App Platform:** https://www.digitalocean.com/products/app-platform
- **AWS/GCP/Azure:** Cloud services

---

## 🎯 After Deployment

1. **Update `minikit.config.js`:**
   - The `ROOT_URL` will automatically use `VERCEL_URL` environment variable
   - Or set `NEXT_PUBLIC_ROOT_URL` manually

2. **Test Farcaster Manifest:**
   - Visit: `https://your-app.vercel.app/.well-known/farcaster.json`
   - Should return JSON with your app manifest

3. **Test Webhook:**
   - The webhook URL is: `https://your-app.vercel.app/api/webhook`
   - Base/Farcaster will send events to this endpoint

---

## 📝 Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] Environment variables set in Vercel Dashboard
- [ ] Build command: `npm run build`
- [ ] Framework: Next.js
- [ ] Output directory: (leave empty)
- [ ] Deploy backend services separately (API, WebSocket, Cron)
- [ ] Test Farcaster manifest endpoint
- [ ] Test webhook endpoint
- [ ] Update Base Mini App configuration with deployment URL

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Check for syntax errors in `next.config.js`

### API Routes Not Working
- Verify `pages/api/` directory exists
- Check `vercel.json` rewrites configuration
- Ensure functions are not timing out (Vercel has execution time limits)

### Environment Variables Not Loading
- Set variables in Vercel Dashboard → Settings → Environment Variables
- Redeploy after adding new variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

### Manifest Not Accessible
- Check `/.well-known/farcaster.json` rewrite in `vercel.json`
- Verify `pages/api/farcaster-manifest.js` exists
- Check browser console for errors

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Next.js on Vercel:** https://vercel.com/docs/frameworks/nextjs
- **Base Mini Apps:** https://base.dev/docs/mini-apps

---

**Ready to deploy!** 🚀

