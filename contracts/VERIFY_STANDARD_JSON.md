# How to Verify Using Standard JSON Input (Fixes Network Error)

## The Problem

BaseScan's single-file compiler is timing out with "Unable to connect to the remote server" error. This happens because:
- Large contracts with OpenZeppelin dependencies take >45 seconds to compile
- BaseScan's compiler service has a 45-second timeout
- Network connectivity issues

## Solution: Use Standard JSON Input

The Standard JSON Input method uses **pre-compiled artifacts** and doesn't require BaseScan's compiler service!

## Step-by-Step Instructions

### 1. Go to Your Contract
Visit: https://basescan.org/address/0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6#code

### 2. Start Verification
- Click the **"Contract"** tab
- Click **"Verify and Publish"**

### 3. Select Compiler Type
**IMPORTANT:** Select **"Solidity (Standard JSON Input)"** (NOT "Single file")

### 4. Upload the JSON File
- Click **"Choose File"** or drag and drop
- Select: `contracts/RewardToken-StandardJSON.json`
- This file is **537KB** and contains all compilation settings

### 5. Enter Constructor Arguments
```
000000000000000000000000EFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96
```

### 6. Submit
Click **"Verify and Publish"**

## Why This Works

✅ **No compilation needed** - Uses pre-compiled bytecode  
✅ **No timeout** - No 45-second limit  
✅ **Auto-detects settings** - Optimization, runs, compiler version all included  
✅ **More reliable** - Doesn't depend on BaseScan's compiler service  

## File Location

The Standard JSON file is ready at:
- **Path:** `contracts/RewardToken-StandardJSON.json`
- **Size:** 537KB
- **Contains:** All compilation settings, sources, and metadata

## Troubleshooting

If Standard JSON also fails:
1. Wait 10-15 minutes and try again
2. Check BaseScan status: https://status.basescan.org/
3. Try verification during off-peak hours
4. Use Hardhat CLI: `npx hardhat verify --network base 0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6 0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`

## Important Notes

- Your contract is **already deployed and working** - verification is optional
- You can verify **anytime**, even days/weeks after deployment
- Standard JSON Input is the **most reliable** verification method

