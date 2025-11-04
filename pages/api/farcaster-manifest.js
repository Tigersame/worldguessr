// Vercel serverless function for Farcaster manifest
// This serves the manifest at /.well-known/farcaster.json via Vercel rewrites

import { minikitConfig } from '../../minikit.config.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const manifest = {
      accountAssociation: minikitConfig.accountAssociation,
      version: minikitConfig.miniapp.version,
      name: minikitConfig.miniapp.name,
      description: minikitConfig.miniapp.description,
      iconUrl: minikitConfig.miniapp.iconUrl,
      splashImageUrl: minikitConfig.miniapp.splashImageUrl,
      splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
      homeUrl: minikitConfig.miniapp.homeUrl,
      webhookUrl: minikitConfig.miniapp.webhookUrl,
      primaryCategory: minikitConfig.miniapp.primaryCategory,
      tags: minikitConfig.miniapp.tags,
      heroImageUrl: minikitConfig.miniapp.heroImageUrl,
      screenshotUrls: minikitConfig.miniapp.screenshotUrls,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(manifest);
  } catch (error) {
    console.error('[Farcaster Manifest] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

