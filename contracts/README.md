# RewardToken Smart Contract

ERC-20 token contract for Farcastbase game rewards deployed on Base network.

## Contract Details

- **Name**: Farcastbase Reward Token
- **Symbol**: FCRT
- **Decimals**: 18
- **Total Supply**: 10,000,000,000,000,000 FCRT (10^16 tokens)
- **Network**: Base (Chain ID: 8453)

## Features

- Standard ERC-20 token functionality
- Burnable tokens (users can burn their own tokens)
- Owner-controlled minting
- Batch minting for efficient distribution

## Setup

1. Install dependencies:
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox @openzeppelin/contracts hardhat dotenv
```

2. Create `.env` file:
```env
PRIVATE_KEY=0x6065576b9f1277658199f51dfd4460d390d76c8d7a98ecd928cd3cd2d54569b2
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

3. Compile contract:
```bash
npx hardhat compile
```

4. Deploy to Base:
```bash
npx hardhat run scripts/deploy-token.js --network base
```

5. Verify contract on BaseScan:
```bash
npx hardhat verify --network base <CONTRACT_ADDRESS> <OWNER_ADDRESS>
```

## Security Notes

⚠️ **IMPORTANT**: 
- The private key provided is for deployment only
- Keep your private keys secure
- Never commit private keys to version control
- Use environment variables for sensitive data
- Consider using a hardware wallet for mainnet deployments

## Integration

After deployment, update your backend to use the contract address:

```javascript
// In your backend code
const REWARD_TOKEN_ADDRESS = '0x...'; // Your deployed contract address
const REWARD_TOKEN_ABI = [...]; // ERC20 ABI

// Use viem or ethers.js to interact with the contract
```

## Contract Functions

### Public Functions
- `totalSupply()` - Get total supply
- `balanceOf(address)` - Get balance of address
- `transfer(to, amount)` - Transfer tokens
- `approve(spender, amount)` - Approve spending
- `transferFrom(from, to, amount)` - Transfer on behalf
- `burn(amount)` - Burn your own tokens

### Owner Functions
- `mint(to, amount)` - Mint new tokens
- `batchMint(recipients[], amounts[])` - Batch mint to multiple addresses
- `renounceOwnership()` - Renounce contract ownership

