# RewardToken Contract - Latest Deployment

## ✅ Deployment Successful!

**Contract Address:** `0x101B1bdE24bF6fE0b88C49CCb099f28326e0A17C`  
**Network:** Base Mainnet (Chain ID: 8453)  
**Owner Address:** `0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`  
**Deployer Address:** `0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`

## Contract Details

- **Name:** Farcastbase Reward Token
- **Symbol:** FCRT
- **Decimals:** 18
- **Total Supply:** 10,000,000,000,000,000 FCRT (10^16 tokens)
- **Owner Balance:** 10,000,000,000,000,000 FCRT
- **Max Supply:** 10,000,000,000,000,000 FCRT

## View Contract

- **BaseScan:** https://basescan.org/address/0x101B1bdE24bF6fE0b88C49CCb099f28326e0A17C

## Verification

Automatic verification failed due to BaseScan API timeout. You can verify manually:

### Option 1: Standard JSON Input (Recommended)

1. Go to: https://basescan.org/address/0x101B1bdE24bF6fE0b88C49CCb099f28326e0A17C#code
2. Click "Contract" → "Verify and Publish"
3. Select: **"Solidity (Standard JSON Input)"**
4. Upload: `contracts/RewardToken-StandardJSON.json`
5. Constructor Arguments: `000000000000000000000000EFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96`
6. Click "Verify and Publish"

### Option 2: Hardhat CLI

```bash
cd contracts
npx hardhat verify --network base 0x101B1bdE24bF6fE0b88C49CCb099f28326e0A17C 0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96
```

## ⚠️ IMPORTANT: Update Your Backend

Update your backend environment variables with the **NEW** contract address:

```env
REWARD_TOKEN_ADDRESS=0x101B1bdE24bF6fE0b88C49CCb099f28326e0A17C
TOKEN_PRIVATE_KEY=0x6065576b9f1277658199f51dfd4460d390d76c8d7a98ecd928cd3cd2d54569b2
```

**Note:** The old contract address was `0xbBc15128bb4c9Ccb99B63e768Ec83a233b1DbeE6`. Make sure to update to the new address!

## Next Steps

1. ✅ **Contract deployed** - Ready to use
2. ⏳ **Verify contract** - Use Standard JSON Input method
3. 🔄 **Update backend** - Set `REWARD_TOKEN_ADDRESS` environment variable
4. 🧪 **Test token distribution** - Verify rewards are distributed correctly

## Contract Functions

### Public Functions
- `totalSupply()` - Get total supply
- `balanceOf(address)` - Get balance of address
- `transfer(to, amount)` - Transfer tokens
- `approve(spender, amount)` - Approve spending
- `transferFrom(from, to, amount)` - Transfer on behalf
- `burn(amount)` - Burn your own tokens

### Owner Functions
- `mint(to, amount)` - Mint new tokens (owner only)
- `batchMint(recipients[], amounts[])` - Batch mint to multiple addresses (owner only)
- `renounceOwnership()` - Renounce contract ownership

