# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### Files Ready to Commit:
- ✅ `vercel.json` - Vercel configuration
- ✅ `minikit.config.js` - Base Mini App configuration
- ✅ `pages/api/` - API routes (farcaster-manifest.js, webhook.js)
- ✅ `components/wallet/` - Base wallet integration
- ✅ `components/tokenBalance.js` - Token balance display
- ✅ `services/tokenContract.js` - Token contract service
- ✅ `api/` - All API endpoints (tokenBalance, setWalletAddress, etc.)
- ✅ `REWARD_SYSTEM_GUIDE.md` - Documentation
- ✅ `VERCEL_DEPLOYMENT.md` - Deployment guide

### Files That Should NOT Be Committed:
- ❌ `.env` - Environment variables (set in Vercel Dashboard)
- ❌ `contracts/node_modules` - Contract dependencies
- ❌ `contracts/artifacts` - Compiled contracts
- ❌ `contracts/cache` - Build cache
- ❌ Any files with private keys

---

## 🚀 Deployment Steps

### 1. Commit All Changes
```bash
git add .
git commit -m "Add Base Mini App integration, wallet, and token rewards system"
git push origin main
```

### 2. Deploy to Vercel

#### Via Dashboard:
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`

#### Via CLI:
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. Set Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required Variables:**
```
NEXT_PUBLIC_ROOT_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=your-backend-api-url.com
NEXT_PUBLIC_WS_HOST=your-websocket-url.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

**Optional (for blockchain features):**
```
REWARD_TOKEN_ADDRESS=your-contract-address
TOKEN_PRIVATE_KEY=your-private-key
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your-basescan-api-key
```

### 4. Deploy Backend Services Separately

⚠️ **Important:** Your Express API, WebSocket, and Cron jobs need separate hosting:

**Options:**
- **Railway:** https://railway.app (recommended)
- **Render:** https://render.com
- **Heroku:** https://heroku.com
- **DigitalOcean:** https://www.digitalocean.com/products/app-platform

### 5. Test Deployment

After deployment, test:
- ✅ Homepage loads: `https://your-app.vercel.app`
- ✅ Farcaster manifest: `https://your-app.vercel.app/.well-known/farcaster.json`
- ✅ API routes work
- ✅ Wallet connection works
- ✅ Token balance displays

---

## 📝 What Gets Deployed

### Frontend (Vercel):
- ✅ Next.js app (`pages/`, `components/`)
- ✅ Static assets (`public/`)
- ✅ API routes (`pages/api/`)
- ✅ Farcaster manifest endpoint

### Backend (Separate Hosting):
- ❌ Express API server (`server.js`) → Deploy separately
- ❌ WebSocket server (`ws/ws.js`) → Deploy separately
- ❌ Cron jobs (`cron.js`) → Deploy separately

---

## 🔍 Post-Deployment Verification

1. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Click on deployment
   - Check for any build errors

2. **Test Endpoints:**
   ```bash
   # Test manifest
   curl https://your-app.vercel.app/.well-known/farcaster.json
   
   # Test webhook (should return 405 for GET)
   curl https://your-app.vercel.app/api/webhook
   ```

3. **Update Base Mini App:**
   - Use your Vercel URL in Base Mini App configuration
   - Test in Base/Farcaster app

---

## 🐛 Common Issues

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in `package.json`
- Check for syntax errors

### Environment Variables Not Loading
- Set in Vercel Dashboard → Settings → Environment Variables
- Redeploy after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side vars

### API Routes Return 404
- Verify `pages/api/` directory structure
- Check `vercel.json` rewrites
- Ensure functions don't timeout

---

## ✅ Ready to Deploy!

All files are configured and ready. Just commit, push, and deploy! 🚀

