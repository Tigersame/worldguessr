# Reward Token & Base Wallet Configuration Guide

## 📍 **Reward Token Configuration**

### **1. Smart Contract Service**
**Location:** `services/tokenContract.js`

**Key Configuration:**
```javascript
// Line 48-50: Contract Configuration
const PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY || '0x6065576b9f1277658199f51dfd4460d390d76c8d7a98ecd928cd3cd2d54569b2';
let CONTRACT_ADDRESS = process.env.REWARD_TOKEN_ADDRESS || ''; // ⚠️ SET THIS IN .env
const REWARD_AMOUNT_PER_1000_POINTS = parseEther('1'); // 1 token per 1000 points
```

**Environment Variables Needed:**
```env
REWARD_TOKEN_ADDRESS=0xYourContractAddressHere  # ⚠️ REQUIRED - Set your deployed contract address
TOKEN_PRIVATE_KEY=0x6065576b9f1277658199f51dfd4460d390d76c8d7a98ecd928cd3cd2d54569b2
BASE_RPC_URL=https://mainnet.base.org
```

**Functions:**
- `distributeTokens(address, points)` - Distribute tokens to a user (1 token per 1000 points)
- `getTokenBalance(address)` - Get token balance for an address
- `batchDistributeTokens(rewards)` - Batch distribute to multiple users
- `getTotalSupply()` - Get total token supply

---

### **2. Smart Contract Source Code**
**Location:** `contracts/src/RewardToken.sol`

**Contract Details:**
- **Name:** Farcastbase Reward Token
- **Symbol:** FCRT
- **Total Supply:** 10,000,000,000,000,000 tokens (10^16)
- **Decimals:** 18
- **Network:** Base (Chain ID: 8453)

**Deployment Files:**
- `contracts/scripts/deploy-token.cjs` - Deployment script
- `contracts/hardhat.config.cjs` - Hardhat configuration

**View Deployment Summary:**
- `contracts/DEPLOYMENT_SUMMARY.md` - Latest deployment details

---

## 🔗 **Base Wallet Configuration**

### **1. Wallet Hook**
**Location:** `components/wallet/baseWallet.js`

**Key Configuration:**
```javascript
// Line 7: Base Chain ID
const BASE_CHAIN_ID = 8453;

// Line 10-13: Public Client for Base Network
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});
```

**Features:**
- ✅ Connects to Coinbase Wallet (preferred) or MetaMask
- ✅ Automatically switches to Base network if needed
- ✅ Fetches ETH balance
- ✅ Handles wallet disconnection
- ✅ Listens for account changes

**Exported Hook:** `useBaseWallet()`
- Returns: `{ account, address, balance, isConnecting, isConnected, connect, disconnect, formatAddress }`

---

### **2. Wallet Button Component**
**Location:** `components/wallet/walletButton.js`

**Features:**
- Connect/Disconnect wallet button
- Displays connected address (short format)
- Shows ETH balance
- Automatically saves wallet address to backend

**Integration:**
- Used in `components/accountModal.js` (Profile settings)

---

### **3. Wallet Address Storage**
**Location:** `api/setWalletAddress.js`

**Endpoint:** `POST /api/setWalletAddress`
- Saves user's wallet address to database
- Validates Ethereum address format
- Called automatically when wallet connects

---

## 🎁 **Reward System**

### **1. Token Rewards Calculation**
**Location:** `api/storeGame.js` (Lines 42-61)

**Reward Formula:**
```javascript
// Calculate token rewards: 1 token per 1000 points
// Only award tokens for official maps to prevent abuse
const tokensPerRound = rounds.map(round => {
  if (!official) return 0; // No tokens for community maps
  return Math.floor(round.points / 1000); // 1 token per 1000 points
});
const totalTokens = tokensPerRound.reduce((sum, tokens) => sum + tokens, 0);
```

**Distribution Logic:**
```javascript
// Distribute blockchain tokens if user has wallet address
if (totalTokens > 0 && user.walletAddress) {
  const { distributeTokens } = await import('../services/tokenContract.js');
  await distributeTokens(user.walletAddress, totalPoints);
}
```

**Rules:**
- ✅ Only official maps earn tokens (prevents abuse)
- ✅ 1 token = 1000 points
- ✅ Requires connected wallet address
- ✅ Tokens distributed on Base blockchain

---

### **2. Token Balance Display**
**Location:** `components/tokenBalance.js`

**Features:**
- Displays user's in-game token balance
- Shows on home screen next to ELO button
- Fetches from `api/tokenBalance.js`

**API Endpoint:** `POST /api/tokenBalance`
- Returns: `{ totalTokens, walletAddress }`

---

### **3. Token Display in Game Results**
**Location:** `components/roundOverScreen.js`

**Features:**
- Shows tokens earned per round
- Displays total tokens earned for the game
- Gold coin icon (🪙) for visual identification

---

### **4. Token Transfer**
**Location:** `api/transferTokens.js`

**Endpoint:** `POST /api/transferTokens`
- Transfer tokens between users
- Validates sender balance
- Prevents self-transfers
- Uses database transactions for safety

---

### **5. Blockchain Balance**
**Location:** `api/getBlockchainBalance.js`

**Endpoint:** `POST /api/getBlockchainBalance`
- Fetches token balance from blockchain
- Combines in-game and blockchain balances
- Returns: `{ inGameTokens, blockchainTokens, walletAddress }`

---

## 📋 **Environment Variables Setup**

Create or update your `.env` file in the **root directory**:

```env
# Reward Token Configuration
REWARD_TOKEN_ADDRESS=0xYourContractAddressHere  # ⚠️ REQUIRED - Get from deployment
TOKEN_PRIVATE_KEY=0x6065576b9f1277658199f51dfd4460d390d76c8d7a98ecd928cd3cd2d54569b2
BASE_RPC_URL=https://mainnet.base.org

# BaseScan API (for contract verification)
BASESCAN_API_KEY=your_basescan_api_key_here
```

---

## 🔍 **Quick Check Commands**

### Check if contract address is set:
```bash
grep -r "REWARD_TOKEN_ADDRESS" .env
```

### Check token contract service:
```bash
cat services/tokenContract.js | grep CONTRACT_ADDRESS
```

### Check Base wallet configuration:
```bash
cat components/wallet/baseWallet.js | grep BASE_CHAIN_ID
```

---

## ⚠️ **Important Notes**

1. **Contract Address Required:** The `REWARD_TOKEN_ADDRESS` must be set in `.env` for blockchain token distribution to work.

2. **Wallet Connection:** Users must connect their Base wallet to receive blockchain tokens. In-game tokens are always awarded.

3. **Official Maps Only:** Token rewards are only given for official maps to prevent abuse.

4. **Reward Rate:** Current rate is 1 token per 1000 points (adjustable in `api/storeGame.js` line 46).

5. **Network:** All blockchain operations are on Base Mainnet (Chain ID: 8453).

---

## 📚 **Related Files**

- `models/User.js` - User schema (includes `totalTokens` and `walletAddress` fields)
- `models/Game.js` - Game schema (includes `totalTokens` in player summary)
- `components/accountView.js` - Displays user's token balance
- `components/gameHistory.js` - Shows tokens earned in past games
- `components/gameUI.js` - Calculates and passes token rewards to round over screen

---

## 🚀 **Next Steps**

1. **Set Contract Address:** Add `REWARD_TOKEN_ADDRESS` to your `.env` file
2. **Test Wallet Connection:** Connect wallet in Account Modal
3. **Play a Game:** Earn tokens by playing official maps
4. **Check Balance:** View tokens in Account Modal and Home Screen

---

**Last Updated:** Based on current codebase structure

