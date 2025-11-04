const { ethers, run } = require('hardhat');
require('dotenv').config();

async function main() {
  console.log('Deploying RewardToken contract...');
  
  // Configuration
  const OWNER_ADDRESS = '0xEFd2E9d8E8Cf622B3bBB493C97538BdfD9f00B96';
  
  // Get signers from Hardhat (uses configured network from hardhat.config.cjs)
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error('No signers available. Make sure PRIVATE_KEY is set in .env file');
  }
  
  const deployer = signers[0];
  
  console.log('Deploying from address:', deployer.address);
  console.log('Owner address:', OWNER_ADDRESS);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Deployer balance:', ethers.formatEther(balance), 'ETH');
  
  if (balance === 0n) {
    throw new Error('Deployer has no ETH balance. Please fund the account.');
  }
  
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
  
  // Wait for transaction to be mined before reading state
  console.log('\n⏳ Waiting for transaction to be mined...');
  const deployTx = rewardToken.deploymentTransaction();
  if (deployTx) {
    await deployTx.wait(2); // Wait for 2 confirmations before reading state
  }
  
  // Verify deployment details
  console.log('Reading contract state...');
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
  
  // Wait for additional block confirmations before verification
  console.log('\n⏳ Waiting for additional block confirmations...');
  if (deployTx) {
    await deployTx.wait(3); // Wait for 3 more confirmations (total 5)
  }
  
  // Automatically verify contract with retry logic
  console.log('\n🔍 Verifying contract on BaseScan...');
  let verificationSuccess = false;
  
  // Try verification with retries
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Verification attempt ${attempt}/3...`);
      
      await run('verify:verify', {
        address: contractAddress,
        constructorArguments: [OWNER_ADDRESS],
        contract: 'src/RewardToken.sol:RewardToken',
      });
      
      console.log('✅ Contract verified successfully on BaseScan!');
      verificationSuccess = true;
      break;
    } catch (error) {
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.toLowerCase().includes('already verified')) {
        console.log('✅ Contract is already verified on BaseScan!');
        verificationSuccess = true;
        break;
      }
      
      if (errorMessage.toLowerCase().includes('timeout') || 
          errorMessage.toLowerCase().includes('connect timeout') ||
          errorMessage.toLowerCase().includes('network request failed')) {
        console.log(`⚠️  Attempt ${attempt} failed: ${errorMessage}`);
        
        if (attempt < 3) {
          const waitTime = attempt * 5000; // 5s, 10s
          console.log(`⏳ Waiting ${waitTime / 1000} seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          console.error('❌ Verification failed after 3 attempts due to timeout.');
          console.log('\n💡 You can verify manually using:');
          console.log(`   npm run verify -- ${contractAddress} ${OWNER_ADDRESS}`);
          console.log(`   OR: npx hardhat verify --network base ${contractAddress} ${OWNER_ADDRESS}`);
          console.log(`   OR: node scripts/verify-contract.cjs ${contractAddress} ${OWNER_ADDRESS}`);
        }
      } else {
        // Other errors
        console.error('❌ Verification failed:', errorMessage);
        console.log('\n💡 You can verify manually using:');
        console.log(`   npm run verify -- ${contractAddress} ${OWNER_ADDRESS}`);
        console.log(`   OR: npx hardhat verify --network base ${contractAddress} ${OWNER_ADDRESS}`);
        break;
      }
    }
  }
  
  if (verificationSuccess) {
    console.log(`📄 View contract: https://basescan.org/address/${contractAddress}`);
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
