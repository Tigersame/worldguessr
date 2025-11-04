# Contract Verification Troubleshooting

## Issue: Connect Timeout Error

If you're getting `Connect Timeout Error` when verifying your contract, this is typically caused by:

1. **BaseScan API being slow or overloaded**
2. **Network connectivity issues**
3. **Firewall/proxy blocking the request**
4. **Invalid or missing API key**

## Solutions

### Solution 1: Manual Verification (Most Reliable)

Manual verification on BaseScan is often more reliable than automated verification:

1. **Go to your contract on BaseScan:**
   https://basescan.org/address/0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6#code

2. **Click "Contract" tab**, then click **"Verify and Publish"**

3. **Fill in the form:**
   - **Compiler Type:** Solidity (Single file)
   - **Compiler Version:** v0.8.20+commit.a1b79de6
   - **Open Source License Type:** MIT
   - **Optimization:** Yes
   - **Runs:** 200

4. **Paste the contract code** from `contracts/src/RewardToken.sol`

5. **Constructor Arguments:**
   ```
   000000000000000000000000EFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96
   ```
   (This is the owner address padded to 32 bytes)

6. **Click "Verify and Publish"**

### Solution 2: Retry Verification Command

Try running the verification multiple times - BaseScan API can be flaky:

```bash
cd contracts
npx hardhat verify --network base 0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6 0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96
```

If it fails, wait 30 seconds and try again.

### Solution 3: Check Your API Key

1. **Get a BaseScan API key:**
   - Go to https://basescan.org/
   - Create an account or log in
   - Go to API section
   - Create a new API key

2. **Update your `.env` file:**
   ```env
   BASESCAN_API_KEY=your_actual_api_key_here
   ```

3. **Try verification again**

### Solution 4: Use Alternative RPC/Network

If BaseScan API is down, you can try:
- Waiting a few hours and trying again
- Using a VPN if you're behind a firewall
- Checking BaseScan status page

### Solution 5: Verify Contract is Actually Deployed

Before worrying about verification, confirm the contract is deployed:

```bash
# Check contract on BaseScan
# Visit: https://basescan.org/address/0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6
```

If you can see the contract on BaseScan, it's deployed. Verification is optional but recommended for transparency.

## Contract Details for Manual Verification

- **Contract Address:** `0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6`
- **Owner Address:** `0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`
- **Contract File:** `contracts/src/RewardToken.sol`
- **Compiler:** Solidity 0.8.20
- **Optimization:** Enabled (200 runs)
- **License:** MIT

## Important Notes

- **Verification is optional** - Your contract works fine without verification
- **Verification makes source code public** - This is good for transparency
- **Manual verification is often more reliable** than automated
- **You can verify anytime** - Even months after deployment

## Still Having Issues?

If none of these solutions work:

1. Check BaseScan status: https://status.basescan.org/
2. Try verification during off-peak hours
3. Use manual verification (Solution 1) - it's the most reliable method
4. Contact BaseScan support if the issue persists

