# BaseScan Verification Error Fix

## The Problem

BaseScan is showing:
- **Optimization Enabled: False** ❌ (Should be True)
- **Runs: 200** ✅ (Correct)

This causes bytecode mismatch because the contract was compiled **WITH** optimization.

## Solution: Correct BaseScan Settings

When verifying on BaseScan, you MUST select:

1. **Compiler Type:** `Solidity (Standard JSON Input)`
2. **Compiler Version:** `v0.8.20+commit.a1b79de6`
3. **Open Source License Type:** `MIT`
4. **Optimization:** `Yes` ✅ (IMPORTANT!)
5. **Runs:** `200` ✅

## Step-by-Step Fix

### Option 1: Use Standard JSON Input (Recommended)

1. Go to: https://basescan.org/address/0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6#code
2. Click "Contract" → "Verify and Publish"
3. Select: **"Solidity (Standard JSON Input)"**
4. Upload: `contracts/RewardToken-StandardJSON.json`
5. **IMPORTANT:** Make sure "Optimization" is set to **"Yes"** and "Runs" is **"200"**
6. Constructor Arguments: `000000000000000000000000EFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`
7. Click "Verify and Publish"

### Option 2: Use Single File (If Standard JSON Doesn't Work)

If you need to verify using single file method:

1. Flatten the contract:
   ```bash
   cd contracts
   npx hardhat flatten src/RewardToken.sol > RewardToken-flattened.sol
   ```

2. On BaseScan:
   - Select "Solidity (Single file)"
   - Paste the flattened contract
   - **Optimization:** `Yes` ✅
   - **Runs:** `200` ✅
   - Compiler: `v0.8.20+commit.a1b79de6`
   - Constructor: `000000000000000000000000EFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`

## Key Points

✅ **Optimization MUST be enabled** - Your contract was compiled with `optimizer.enabled: true`

✅ **Runs must be 200** - Matches your Hardhat config

✅ **Compiler version must match** - `v0.8.20+commit.a1b79de6`

✅ **Constructor arguments** - Owner address padded to 32 bytes

## Verification Checklist

- [ ] Optimization: **Yes** (not No!)
- [ ] Runs: **200**
- [ ] Compiler: **v0.8.20+commit.a1b79de6**
- [ ] License: **MIT**
- [ ] Constructor: `000000000000000000000000EFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`

The most common mistake is forgetting to enable optimization!

