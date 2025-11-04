// MiniKit configuration for Base Mini App
// Reference: https://base.dev/docs/mini-apps/features/manifest

const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
   process.env.VERCEL ? `https://farcasterworld.vercel.app` :
   'http://localhost:3000');

export const minikitConfig = {
  accountAssociation: {
    // This will be populated in step 5 of the Base Mini App setup
    // After deploying and using the Account association tool at base.dev/preview
    "header": "",
    "payload": "",
    "signature": ""
  },
  miniapp: {
    version: "1",
    name: "farcastbase",
    subtitle: "The #1 free alternative to farcasteruser",
    description: "The #1 free alternative to farcasteruser, enjoy unlimited games and play to your hearts content! Engage in the fun of discovering new places and learn geography.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/icon.png`,
    splashBackgroundColor: "#092f5f",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["geography", "games", "education", "world", "farcasteruser"],
    heroImageUrl: `${ROOT_URL}/icon.png`,
    tagline: "Discover the world, one guess at a time",
    ogTitle: "farcastbase - Free Geography Game",
    ogDescription: "The #1 free alternative to farcasteruser. Play unlimited geography games and discover new places!",
    ogImageUrl: `${ROOT_URL}/icon.png`,
  },
};

