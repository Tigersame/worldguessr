# Deployment Guide

## Quick Deploy with Auto-Verification

### Prerequisites

1. Navigate to contracts directory:
```bash
cd contracts
```

2. Install dependencies:
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox @openzeppelin/contracts hardhat dotenv
```

3. Get BaseScan API Key:
   - Go to https://basescan.org/
   - Create an account
   - Get your API key from the API section

4. Create `.env` file in the contracts directory:
```env
PRIVATE_KEY=0x6065576b9f1277658199f51dfd4460d390d76c8d7a98ecd928cd3cd2d54569b2
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key_here
```

### Deployment Steps

1. Compile the contract:
```bash
cd contracts
npx hardhat compile
```

2. Deploy and auto-verify:
```bash
npm run deploy:base
```
Or directly:
```bash
npx hardhat run scripts/deploy-token.cjs --network base
```

The script will:
- ✅ Deploy the contract to Base network
- ✅ Wait for 5 block confirmations
- ✅ Automatically verify the contract on BaseScan
- ✅ Display contract details and verification link

### Manual Verification (if auto-verification fails)

If automatic verification fails, you can manually verify:

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS> <OWNER_ADDRESS>
```

**Note:** The config files use `.cjs` extension to work with ES module projects.

Example:
```bash
npx hardhat verify --network base 0xYourContractAddress 0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96
```

## Contract Information

- **Contract Name**: RewardToken
- **Token Name**: Farcastbase Reward Token
- **Token Symbol**: FCRT
- **Decimals**: 18
- **Total Supply**: 10,000,000,000,000,000 FCRT (10^16 tokens)
- **Network**: Base Mainnet (Chain ID: 8453)
- **Owner Address**: 0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96

## After Deployment

1. **Save the contract address** - You'll need this for integration
2. **Check BaseScan** - Verify the contract is visible and verified
3. **Update backend** - Add contract address to your environment variables
4. **Test integration** - Use the contract address in your reward distribution system

## Security Reminder

⚠️ **Keep your private keys secure!**
- Never commit `.env` files to git
- Use environment variables in production
- Consider using a hardware wallet for mainnet deployments

