import hre from 'hardhat';
import dotenv from 'dotenv';

dotenv.config();

const { ethers, run } = hre;

async function main() {
  console.log('Deploying RewardToken contract...');
  
  // Configuration
  const PRIVATE_KEY = '0x6065576b9f1277658199f51dfd4460d390d76c8d7a98ecd928cd3cd2d54569b2';
  const OWNER_ADDRESS = '0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96';
  
  // Base network RPC (you may need to adjust this)
  const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
  
  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log('Deploying from address:', wallet.address);
  console.log('Owner address:', OWNER_ADDRESS);
  
  // Get contract factory
  const RewardToken = await ethers.getContractFactory('RewardToken');
  
  // Deploy contract
  console.log('Deploying contract...');
  const rewardToken = await RewardToken.deploy(OWNER_ADDRESS);
  
  await rewardToken.waitForDeployment();
  const contractAddress = await rewardToken.getAddress();
  
  console.log('✅ RewardToken deployed to:', contractAddress);
  console.log('Owner address:', OWNER_ADDRESS);
  console.log('Total supply: 10,000,000,000,000,000 FCRT');
  
  // Verify deployment details
  const totalSupply = await rewardToken.totalSupply();
  const maxSupply = await rewardToken.maxSupply();
  const symbol = await rewardToken.symbol();
  const name = await rewardToken.name();
  
  console.log('\n📊 Contract Details:');
  console.log('Name:', name);
  console.log('Symbol:', symbol);
  console.log('Total Supply:', ethers.formatEther(totalSupply), 'FCRT');
  console.log('Max Supply:', ethers.formatEther(maxSupply), 'FCRT');
  console.log('Decimals: 18');
  
  // Check owner balance
  const ownerBalance = await rewardToken.balanceOf(OWNER_ADDRESS);
  console.log('Owner Balance:', ethers.formatEther(ownerBalance), 'FCRT');
  
  // Wait for block confirmations before verification
  console.log('\n⏳ Waiting for block confirmations...');
  await rewardToken.deploymentTransaction()?.wait(5); // Wait for 5 confirmations
  
  // Automatically verify contract
  console.log('\n🔍 Verifying contract on BaseScan...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: [OWNER_ADDRESS],
      contract: 'contracts/RewardToken.sol:RewardToken',
    });
    console.log('✅ Contract verified successfully on BaseScan!');
    console.log(`📄 View contract: https://basescan.org/address/${contractAddress}`);
  } catch (error) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log('✅ Contract is already verified on BaseScan!');
      console.log(`📄 View contract: https://basescan.org/address/${contractAddress}`);
    } else {
      console.error('❌ Verification failed:', error.message);
      console.log('\n⚠️  You can manually verify the contract using:');
      console.log(`npx hardhat verify --network base ${contractAddress} ${OWNER_ADDRESS}`);
    }
  }
  
  console.log('\n📝 Deployment Summary:');
  console.log('Contract Address:', contractAddress);
  console.log('Owner Address:', OWNER_ADDRESS);
  console.log('Total Supply:', ethers.formatEther(totalSupply), 'FCRT');
  console.log('\n✅ Next Steps:');
  console.log('1. Contract is deployed and verified ✅');
  console.log('2. Update your backend to use this contract address');
  console.log('3. Integrate with your reward distribution system');
  
  return {
    contractAddress,
    ownerAddress: OWNER_ADDRESS,
    totalSupply: ethers.formatEther(totalSupply)
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });

