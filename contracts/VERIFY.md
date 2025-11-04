# Contract Verification Guide

## Quick Verification

The contract has been deployed at:
- **Contract Address:** `0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6`
- **Owner Address:** `0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`

## Method 1: Direct Hardhat Command (Recommended)

```bash
cd contracts
npx hardhat verify --network base 0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6 0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96
```

If this times out, try again. BaseScan API can be slow.

## Method 2: Manual Verification on BaseScan Website

1. Go to: https://basescan.org/address/0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6#code
2. Click "Contract" tab
3. Click "Verify and Publish"
4. Select:
   - **Compiler Type:** Solidity (Single file)
   - **Compiler Version:** v0.8.20+commit.a1b79de6
   - **Open Source License Type:** MIT
5. Paste the contract source code from `src/RewardToken.sol`
6. Constructor arguments: `0x000000000000000000000000EFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`
   (This is the owner address padded to 32 bytes)
7. Click "Verify and Publish"

## Method 3: Using Verification Script (with retry logic)

```bash
cd contracts
CONTRACT_ADDRESS=0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6 OWNER_ADDRESS=0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96 npx hardhat run scripts/verify-only.cjs --network base
```

## Troubleshooting Timeout Issues

If you're getting timeout errors:

1. **Check your internet connection**
2. **Verify BaseScan API key** in `.env` file:
   ```env
   BASESCAN_API_KEY=your_actual_api_key_here
   ```
   Get your API key from: https://basescan.org/

3. **Try again later** - BaseScan API can be slow during peak times

4. **Use manual verification** (Method 2) - This is often more reliable

5. **Increase timeout** in `hardhat.config.cjs`:
   ```javascript
   etherscan: {
     timeout: 120000, // 120 seconds
   }
   ```

## Contract Details for Manual Verification

- **Contract Name:** RewardToken
- **Compiler Version:** 0.8.20
- **Optimization:** Enabled (200 runs)
- **License:** MIT
- **Constructor Argument:** `0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96` (owner address)

## After Verification

Once verified, the contract source code will be visible on BaseScan, making it easier for users to:
- View the contract code
- Verify its integrity
- Interact with it through the explorer

