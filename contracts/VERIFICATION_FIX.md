# Contract Verification Timeout - Fixed

## What Was Fixed

I've made several improvements to handle the BaseScan API timeout issue:

### 1. **Increased Timeout in Hardhat Config**
   - Increased from 60 seconds to 120 seconds
   - Added `sourcify.enabled: false` to speed up verification

### 2. **Added Retry Logic to Deployment Script**
   - The deployment script now automatically retries verification up to 3 times
   - Includes exponential backoff (5s, 10s, 15s delays)

### 3. **Created Standalone Verification Script**
   - `scripts/verify-only.cjs` - Script with retry logic for verification only
   - Can be used independently after deployment

### 4. **Created Troubleshooting Guide**
   - `TROUBLESHOOTING.md` - Comprehensive guide for verification issues
   - `VERIFY.md` - Quick reference for verification methods

## Contract Information

- **Contract Address:** `0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6`
- **Owner Address:** `0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`
- **Network:** Base Mainnet
- **View on BaseScan:** https://basescan.org/address/0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6

## Verification Methods

### Method 1: Direct Hardhat Command (Try This First)

```bash
cd contracts
npx hardhat verify --network base 0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6 0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96
```

If it times out, wait 30 seconds and try again. The timeout has been increased to 120 seconds.

### Method 2: Manual Verification (Most Reliable)

**This is the most reliable method when API is slow:**

1. Go to: https://basescan.org/address/0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6#code
2. Click "Contract" tab → "Verify and Publish"
3. Fill in:
   - **Compiler Type:** Solidity (Standard JSON Input) ← **Important: Use this for OpenZeppelin contracts**
   - **Compiler Version:** v0.8.20+commit.a1b79de6
   - **License:** MIT

4. **For Standard JSON Input method:**
   - Get the JSON input from Hardhat:
     ```bash
     cd contracts
     npx hardhat compile
     ```
   - The JSON file will be in `artifacts/build-info/`
   - Upload that JSON file to BaseScan

5. **Constructor Arguments:**
   ```
   000000000000000000000000EFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96
   ```
   (Owner address padded to 32 bytes)

### Method 3: Flatten Contract for Manual Verification

If you prefer single-file verification:

```bash
cd contracts
npx hardhat flatten src/RewardToken.sol > RewardToken_flattened.sol
```

Then use the flattened file in BaseScan's single-file verification.

## Why Verification Fails

The timeout error is typically caused by:
1. **BaseScan API being slow** - Very common, especially during peak hours
2. **Network issues** - Firewall, proxy, or slow connection
3. **Missing API key** - Make sure `BASESCAN_API_KEY` is set in `.env`

## Quick Fixes

1. **Check API Key:**
   ```bash
   # Make sure .env has:
   BASESCAN_API_KEY=your_actual_key_here
   ```

2. **Try Multiple Times:**
   ```bash
   # Run verification multiple times - BaseScan API is flaky
   npx hardhat verify --network base 0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6 0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96
   ```

3. **Use Manual Verification:**
   - Most reliable method
   - Doesn't depend on API timeouts
   - See Method 2 above

## Important Notes

✅ **Contract is already deployed and working** - Verification is optional but recommended for transparency

✅ **You can verify anytime** - Even days or weeks after deployment

✅ **Manual verification is often more reliable** - The BaseScan API can be slow

✅ **Verification makes source code public** - Good for trust and transparency

## Next Steps

1. **Try Method 1** (direct command) a few times
2. **If it keeps timing out, use Method 2** (manual verification)
3. **Update your backend** with the contract address:
   ```env
   REWARD_TOKEN_ADDRESS=0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6
   ```

The contract is deployed and ready to use, even without verification!

